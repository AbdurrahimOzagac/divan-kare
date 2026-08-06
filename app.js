/**
 * app.js — Dîvân-ı Kare arayüzü
 *
 * GridState (saf mantık) + DOM. Her (r,c) hücresi için bir <input> vardır;
 * yazılan her değer GridState'e gider, GridState transpoz eşini döndürür,
 * DOM'da her iki kutu senkronlanır. Böylece (r,c) ↔ (c,r) birebir aynıdır:
 * birine yazılınca diğerine yazılır, birinden silinince diğerinden silinir.
 */

const SIIR_METNI = [
  "sanmaşâhımherkesisensâdıkâneyârolur",
  "herkesisendostmusandınbelkiolağyârolur",
  "sâdıkânebelkiolâlemededildârolur",
  "yârolursanmaşâhımherkesisen",
];

const MAX_BOYUT = 10;

/**
 * @param {typeof import("./grid.js").GridState} GridState
 */
export function initApp(GridState) {
  const izgaraEl = document.getElementById("kareIzgara");
  const boyutButonlariEl = document.getElementById("boyutButonlari");
  const durumEl = document.getElementById("durumMetni");
  const okumaSatirlarEl = document.getElementById("okumaSatirlar");
  const okumaSutunlarEl = document.getElementById("okumaSutunlar");
  const okumaSonucEl = document.getElementById("okumaSonuc");
  const siirYukleBtn = document.getElementById("siirYukle");
  const temizleBtn = document.getElementById("temizle");

  const grid = new GridState(5);
  /** @type {HTMLInputElement[][]} */
  const inputlar = [];
  /** Programatik güncelleme sırasında olay tetiklemesini bastırır. */
  let programatik = false;

  // ── Boyut butonları ─────────────────────────────────
  for (let n = 1; n <= MAX_BOYUT; n++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "boyut-btn";
    btn.textContent = `${n}×${n}`;
    btn.dataset.boyut = String(n);
    btn.addEventListener("click", () => boyutSec(n));
    boyutButonlariEl.appendChild(btn);
  }

  function boyutSec(n) {
    grid.resize(n);
    kareCiz();
    // Buton vurgusu
    boyutButonlariEl.querySelectorAll(".boyut-btn").forEach((b) => {
      b.classList.toggle("secili", Number(b.dataset.boyut) === n);
    });
    durumEl.textContent = `${n}×${n} kare seçildi. Hücrelere yazın; (satır, sütun) ve (sütun, satır) her zaman aynıdır.`;
    durumEl.classList.remove("iyi", "uyari");
    okumaGuncelle();
  }

  // ── Kare çizimi ─────────────────────────────────────
  function kareCiz() {
    izgaraEl.innerHTML = "";
    izgaraEl.style.gridTemplateColumns = `repeat(${grid.size}, 1fr)`;
    inputlar.length = 0;

    for (let r = 0; r < grid.size; r++) {
      inputlar.push([]);
      for (let c = 0; c < grid.size; c++) {
        const hucre = document.createElement("div");
        hucre.className = "hucre";
        if (r === c) hucre.classList.add("diyagonal");

        const baslik = document.createElement("span");
        baslik.className = "hucre-baslik";
        baslik.textContent = `${r},${c}`;

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 32;
        input.value = grid.get(r, c);
        input.setAttribute("aria-label", `Satır ${r + 1}, sütun ${c + 1}`);
        input.addEventListener("input", () => {
          if (programatik) return;
          hucreGuncelle(r, c, input.value);
        });
        // Klavye: Enter/Sağ/Sol ok ile hücreler arası gezinme
        input.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            const hedef = c + 1 < grid.size ? [r, c + 1] : [r + 1, 0];
            if (hedef[0] < grid.size) inputlar[hedef[0]][hedef[1]].focus();
          } else if (ev.key === "ArrowRight" && c + 1 < grid.size) {
            inputlar[r][c + 1].focus();
          } else if (ev.key === "ArrowLeft" && c > 0) {
            inputlar[r][c - 1].focus();
          } else if (ev.key === "ArrowDown" && r + 1 < grid.size) {
            inputlar[r + 1][c].focus();
          } else if (ev.key === "ArrowUp" && r > 0) {
            inputlar[r - 1][c].focus();
          }
        });

        hucre.appendChild(baslik);
        hucre.appendChild(input);
        izgaraEl.appendChild(hucre);
        inputlar[r].push(input);
      }
    }
  }

  /**
   * (r,c) hücresindeki kullanıcı girişini işler; eş hücreyi senkronlar.
   */
  function hucreGuncelle(r, c, deger) {
    const guncellenen = grid.set(r, c, deger);
    programatik = true;
    try {
      for (const { r: rr, c: cc, value } of guncellenen) {
        const hedef = inputlar[rr]?.[cc];
        if (hedef) hedef.value = value;
      }
    } finally {
      programatik = false;
    }
    okumaGuncelle();
  }

  // ── Okuma paneli ────────────────────────────────────
  function okumaGuncelle() {
    const satirlar = grid.readRows();
    const sutunlar = grid.readCols();
    okumaSatirlarEl.textContent = satirlar.join("\n") || "—";
    okumaSutunlarEl.textContent = sutunlar.join("\n") || "—";

    const dolu = grid.entries().some((e) => e.value.length > 0);
    if (!dolu) {
      okumaSonucEl.textContent = "Kare henüz boş — yazmaya başlayın.";
      okumaSonucEl.className = "okuma-sonuc";
      return;
    }
    if (grid.verifySymmetry()) {
      okumaSonucEl.textContent =
        "✓ Satır ve sütun okumaları birebir aynı — söz bir, kare bir.";
      okumaSonucEl.className = "okuma-sonuc iyi";
    } else {
      okumaSonucEl.textContent = "✗ Dikkat: kare simetrisi bozuldu!";
      okumaSonucEl.className = "okuma-sonuc uyari";
    }
  }

  // ── Şiiri Yükle ─────────────────────────────────────
  function siirYukle() {
    // İlk mısrayı kareye en uygun boyuta yerleştir:
    // mısra uzunluğu <= N² olacak en küçük N.
    const metin = SIIR_METNI[0];
    let n = Math.ceil(Math.sqrt(metin.length));
    n = Math.max(1, Math.min(MAX_BOYUT, n));
    grid.resize(n);
    boyutSec(n);
    // Üst üçgene (satır satır) yerleştir; alt üçgen otomatik aynalanır.
    grid.clearAll();
    let i = 0;
    outer:
    for (let r = 0; r < grid.size; r++) {
      for (let c = r; c < grid.size; c++) {
        if (i >= metin.length) break outer;
        grid.set(r, c, metin[i++]);
      }
    }
    kareCiz();
    // Buton vurgusunu güncelle
    boyutButonlariEl.querySelectorAll(".boyut-btn").forEach((b) => {
      b.classList.toggle("secili", Number(b.dataset.boyut) === n);
    });
    durumEl.textContent =
      "Yavuz Sultan Selim'in mısrası kareye işlendi — satır ve sütun aynı okunur.";
    durumEl.classList.remove("iyi", "uyari");
    durumEl.classList.add("iyi");
    okumaGuncelle();
  }

  function temizle() {
    grid.clearAll();
    programatik = true;
    try {
      for (let r = 0; r < grid.size; r++) {
        for (let c = 0; c < grid.size; c++) {
          inputlar[r][c].value = "";
        }
      }
    } finally {
      programatik = false;
    }
    durumEl.textContent = "Kare temizlendi.";
    durumEl.classList.remove("iyi", "uyari");
    okumaGuncelle();
  }

  siirYukleBtn.addEventListener("click", siirYukle);
  temizleBtn.addEventListener("click", temizle);

  // ── Başlangıç ───────────────────────────────────────
  boyutSec(5);
}
