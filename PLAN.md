# PLAN — Divan Karesi

## Brief (kullanıcı isteği)

Yavuz Sultan Selim'in "Sanma şâhım herkesi sen..." şiirindeki gibi satır ve
sütun okuması aynı olan simetrik harf kareleri için web uygulaması.
Boyut 1x1–10x10 seçilebilir, her hücreye tüm karakterler yazılabilir,
(i,j) ↔ (j,i) hücreleri otomatik senkron olmalı (yazınca yaz, silince sil).
Divan dönemi estetiğinde UI. Localhost'ta çalışacak. Bittiğinde Telegram'dan
bildirim.

## Yorum ve kararlar

- **Stack**: Saf HTML/CSS/JS (harici framework yok) + Python stdlib http.server.
  Gerekçe: tek sayfalık statik bir araç; framework eklemek kurulum/bağımlılık
  yükü getirir, değer katmaz. Her yerde çalışır (sadece python3 yeterli).
- **Simetri modeli**: `(r,c)` ve `(c,r)` aynı hücreyi temsil eder — DOM'da
  her simetri çifti için TEK input; görünürde iki kutu aynı input'a bağlı
  değil, iki ayrı input ama biri yazınca diğeri programatik güncellenir.
  Daha sağlam: tek kaynak `cells[r][c]` string dizisi; her input yazımında
  kaynak güncellenir ve eşi olan input'un değeri senkronlanır.
  Diyagonal (r==c) kendisiyle eşleşir, normal tek input.
- **Boyut değişimi**: mevcut içerik korunur (daha büyük boyuta geçilince
  önceki hücreler durur; küçültünce taşanlar bellekte tutulur, tekrar
  büyütünce geri gelir).
- **Satır/Sütun doğrulama**: "Oku" modu — her satırı soldan sağa, her
  sütunu yukarıdan aşağı okur; simetri garantili olduğu için satırlar ve
  sütunlar birebir aynıdır; arayüz bunu gösterir (vurgu animasyonu).
- **Estetik**: koyu lacivert + altın varak + fildişi; tezhip köşe süsleri
  (inline SVG), hat esintili serif (Georgia/EB Garamond yerel, Google Fonts
  yoksa fallback). Dönem hissi: "Hünkâr Divanı" başlığı, küçük ayet/beyit
  alıntıları, tuğra esintili logo.
- **Örnek içerik**: "Sanma Şâhım" şiirini harf harf kareye yerleştiren
  "Şiiri Yükle" butonu. Not: şiir tam kare değil (harf sayısı kare değil),
  bu yüzden kareye en yakın düzen + kalan harfler koyulur; asıl amaç
  kullanıcıya simetriyi göstermek. Kullanıcı kendi dizesini girer.
- **Test stratejisi**:
  1. `grid.js` saf mantık modülü → Node unit test (simetri, senkron,
     boyut değişimi, okuma)
  2. Sunucuyu başlat → curl ile 200 + içerik
  3. Tarayıcı (browser tool) ile gerçek E2E: hücreye yaz, eş hücrenin
     güncellendiğini doğrula; silme senkronunu doğrula; boyut değiştir.
- **Dağıtım**: localhost, `python3 server.py` (port 8000). Systemd yok,
  kullanıcı istediğinde açar.

## Dosya düzeni

```
~/projects/divan-kare/
  index.html
  style.css
  app.js          (DOM + olay yönetimi)
  grid.js         (saf mantık: GridState)
  server.py       (statik sunucu)
  test/grid.test.mjs
  README.md  PLAN.md  PROGRESS.md  DONE.md
```

## Gereksinimler

- python3 (sunucu) — mevcut
- node (testler) — mevcut v22
- Harici bağımlılık yok
