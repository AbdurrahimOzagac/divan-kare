/**
 * grid.js — Divan Karesi saf mantık modülü
 *
 * DOM'dan bağımsız simetrik kare (symmetric square) yönetimi.
 * (r,c) hücresi ile (c,r) hücresi AYNI değeri taşır — Yavuz Sultan
 * Selim'in kare düzenleme geleneği: satır okuması = sütun okuması.
 *
 * Hücreler harf veya KELİME taşıyabilir. loadPoem, şiiri anlamlı
 * bölüklere ayırıp döngüsel yerleştirir: hücre (r,c) = bölük[(r+c)%n],
 * böylece her satır ve her sütun şiirin tamamını okur.
 *
 * Bu modül hem tarayıcıda (script tag) hem Node'da (ESM) çalışır.
 */

export class GridState {
  /**
   * @param {number} size Kare boyutu (1..10)
   */
  constructor(size = 4) {
    this.size = 0;
    // cells[r][c] -> string. Sadece r <= c olan hücreler "gerçek" kaynaktır;
    // r > c olanlar her zaman transpozuna (cells[c][r]) yansır.
    this.cells = [];
    this.resize(size);
  }

  /** Kare boyutunu değiştirir; mevcut içerik korunur. */
  resize(newSize) {
    newSize = Math.max(1, Math.min(10, Math.floor(newSize)));
    const old = this.cells;
    const next = [];
    for (let r = 0; r < newSize; r++) {
      next.push([]);
      for (let c = 0; c < newSize; c++) {
        next[r].push((old[r] && old[r][c] !== undefined) ? old[r][c] : "");
      }
    }
    this.cells = next;
    this.size = newSize;
  }

  /**
   * (r,c) hücresinin değerini döndürür.
   * r > c ise transpozu okur (simetri garantisi).
   */
  get(r, c) {
    if (r > c) [r, c] = [c, r];
    return this.cells[r]?.[c] ?? "";
  }

  /**
   * (r,c) hücresine değer yazar. Eş hücre (c,r) otomatik aynı değeri alır —
   * depo her zaman tam simetriktir: cells[r][c] === cells[c][r].
   * Diyagonal (r==c) kendisidir.
   *
   * @returns {{r:number,c:number,value:string}[]} Güncellenen (r,c) çiftleri
   *          (yazan hücre + transpoz eşi). Diyagonalde tek elemanlı.
   */
  set(r, c, value) {
    value = String(value ?? "");
    if (r > c) [r, c] = [c, r];
    this.cells[r][c] = value;
    this.cells[c][r] = value;
    const updated = [{ r, c, value }];
    if (r !== c) {
      updated.push({ r: c, c: r, value });
    }
    return updated;
  }

  /** (r,c) hücresini (ve eşini) boşaltır. */
  clear(r, c) {
    return this.set(r, c, "");
  }

  /** Tüm kareyi boşaltır. */
  clearAll() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        this.cells[r][c] = "";
      }
    }
  }

  /**
   * Kareyi dolduran tüm (r,c,value) üçlülerini döndürür (r <= c üst üçgen).
   */
  entries() {
    const out = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = r; c < this.size; c++) {
        out.push({ r, c, value: this.cells[r][c] });
      }
    }
    return out;
  }

  /**
   * Satır okuması: her satır soldan sağa birleştirilir.
   * Kelime karelerinde ayraç olarak " " geçirin (readRows(" ")).
   * @param {string} sep Hücre değerleri arasına konacak ayraç
   * @returns {string[]}
   */
  readRows(sep = "") {
    return this.cells.map((row) => row.join(sep));
  }

  /**
   * Sütun okuması: her sütun yukarıdan aşağı birleştirilir.
   * Simetri sayesinde readRows() ile birebir aynıdır.
   * @param {string} sep Hücre değerleri arasına konacak ayraç
   * @returns {string[]}
   */
  readCols(sep = "") {
    const cols = [];
    for (let c = 0; c < this.size; c++) {
      const degerler = [];
      for (let r = 0; r < this.size; r++) {
        degerler.push(this.cells[r][c]);
      }
      cols.push(degerler.join(sep));
    }
    return cols;
  }

  /** Satır ve sütun okumalarının birebir aynı olup olmadığını doğrular. */
  verifySymmetry() {
    const rows = this.readRows();
    const cols = this.readCols();
    for (let i = 0; i < this.size; i++) {
      if (rows[i] !== cols[i]) return false;
    }
    return true;
  }

  /** Kareyi düz metin olarak döndürür (satırlar \n ile ayrık). */
  toText() {
    return this.readRows().join("\n");
  }

  /** Düz metinden doldurur (satır başına hücre sayısı kadar karakter alır).
   *  Sadece üst üçgene (r <= c) yazar; alt üçgen set() ile aynalanır. */
  fromText(text) {
    this.clearAll();
    const lines = String(text ?? "").split("\n");
    for (let r = 0; r < this.size; r++) {
      const line = lines[r] ?? "";
      for (let c = r; c < this.size; c++) {
        this.set(r, c, line[c] ?? "");
      }
    }
  }

  /**
   * Şiiri kelime düzeyinde kareye işler (kelime karesi).
   *
   * Şiir bölükleri tam olarak n gruba ayrılır (n = kare boyutu) ve hücre
   * (r,c) değeri bölükler[(r + c) % n] olur. Bu döngüsel yerleşim sayesinde:
   * - Her satır ve her sütun şiirin TAMAMINI okur (dönüşlü olarak).
   * - Satır i ile sütun i birebir aynıdır (satır okuması = sütun okuması).
   *
   * Örnek (4×4): ilk satır ve ilk sütun "Sanma şâhım Herkesi sen Sâdıkâne
   * Yâr olur" okur; ikinci satır "Herkesi sen Sâdıkâne Yâr olur Sanma şâhım"
   * — mısranın ters okunuşu, tıpkı divan karesi geleneğindeki gibi.
   *
   * @param {string[]} parcalar Şiirin anlamlı bölükleri
   *        (ör. ["Sanma şâhım", "Herkesi sen", "Sâdıkâne", "Yâr olur"]).
   */
  loadPoem(parcalar) {
    const n = this.size;
    const bolukler = this._boluklereAyir(parcalar, n);
    this.clearAll();
    // (r+c) toplamı simetrik olduğu için matris kendiliğinden simetriktir.
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        this.cells[r][c] = bolukler[(r + c) % n];
      }
    }
  }

  /**
   * Gerçek divan karesini (ayak karesi) yerleştirir.
   *
   * "Sanma şâhım" dörtlüğünün orijinali 4×4'lük bir AYAK karesidir: her
   * hücre bir kelime kümesi (ayak) taşır ve kare tam simetriktir — dört
   * satır da dört sütun da dört mısrayı aynı okur. Örn. (1,2)="Herkesi sen"
   * ile (2,1)="Herkesi sen" aynıdır.
   *
   * Boyut otomatik olarak satır sayısına ayarlanır. Simetri zorlanır: üst
   * üçgen (r <= c) kaynaktır, alt üçgen ondan aynalanır — veri asimetrik
   * olsa bile depo tam simetrik kalır.
   *
   * @param {string[][]} satirlar Kareyi oluşturan satır dizileri.
   */
  loadSquare(satirlar) {
    const boyut = Math.max(1, Math.min(10, satirlar.length));
    this.resize(boyut);
    for (let r = 0; r < boyut; r++) {
      const satir = satirlar[r] ?? [];
      for (let c = r; c < boyut; c++) {
        const deger = String(satir[c] ?? "");
        this.cells[r][c] = deger;
        this.cells[c][r] = deger;
      }
    }
  }

  /**
   * Parça listesini tam olarak n bölüğe ayırır:
   * - n == parça sayısı: olduğu gibi kullanılır.
   * - n < parça sayısı: sondan başlayarak komşu parçalar birleştirilir.
   * - n > parça sayısı: önce çok kelimeli parçalar kelimelerine ayrılır;
   *   hâlâ yetmezse boş bölükler eklenir (okuma bozulmaz).
   *
   * @param {string[]} parcalar
   * @param {number} n
   * @returns {string[]}
   */
  _boluklereAyir(parcalar, n) {
    n = Math.max(1, Math.min(10, Math.floor(n)));
    let bolukler = parcalar.map((p) => String(p ?? "").trim()).filter(Boolean);
    if (bolukler.length === 0) bolukler = [""];
    // n < parça sayısı → birleştir (sondan başla, ilk bölükler korunur)
    while (bolukler.length > n) {
      const son = bolukler.pop();
      bolukler[bolukler.length - 1] =
        `${bolukler[bolukler.length - 1]} ${son}`.trim();
    }
    // n > parça sayısı → böl (çok kelimeli bölükleri kelimelerine ayır)
    while (bolukler.length < n) {
      const idx = bolukler.findIndex((b) => b.includes(" "));
      if (idx === -1) break;
      const [ilk, ...kalan] = bolukler[idx].split(/\s+/);
      bolukler.splice(idx, 1, ilk, kalan.join(" "));
    }
    while (bolukler.length < n) bolukler.push("");
    return bolukler;
  }
}
