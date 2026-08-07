# DONE — Dîvân-ı Kare

## Ne yapıldı

Yavuz Sultan Selim'in "Sanma şâhım herkesi sen sâdıkâne yâr olur" şiirindeki
geleneği — **satır ve sütun okuması aynı olan simetrik kelime kareleri** — için
Divan dönemi estetiğinde bir web uygulaması.

Konum: `~/projects/divan-kare/`
Yerel çalıştırma: `python3 server.py` → http://localhost:8000
Canlı: https://abdurrahimozagac.github.io/divan-kare/ (GitHub Pages + Actions)

## İstenen özellikler ve karşılıkları

| İstek | Durum |
|---|---|
| Hücrelerde KELİME (harf değil) | ✓ "Şiiri Yükle" orijinal dörtlüğün ayak karesini işler |
| Default boyut 4×4 | ✓ `VARSAYILAN_BOYUT = 4` |
| ORİJİNAL şiir metni | ✓ 4×4 ayak karesi; kaynak: malumatfurus.org + mecmua metinleri (antoloji varyantı "dostun mu sandın/didâr" daha az yaygın) |
| Yatay dikdörtgen kutular | ✓ 112×56px (clamp 68–112 × 42–56); kelimeler tam görünür |
| Boyut seçimi 1×1 … 10×10 | ✓ Buton grubu; içerik boyut değişince korunur |
| (r,c) ↔ (c,r) otomatik senkron | ✓ Birine yazılınca diğerine yazılır, birinden silinince diğerinden silinir |
| Satır = sütun okuması | ✓ Okuma paneli satır/sütun karşılaştırır, simetriyi doğrular |
| Divan dönemi UI | ✓ Tezhip köşe süsleri, altın varak, tuğra, Marcellus/EB Garamond |
| Canlı yayın | ✓ GitHub Pages (public repo, Actions ile otomatik deploy) |

## Mimari

- `grid.js` — saf mantık (DOM'suz `GridState`). Depo her zaman tam simetrik:
  `cells[r][c] === cells[c][r]`; `set()` iki yönlü yazar. `loadPoem()` şiiri
  bölüklere ayırır ve döngüsel yerleştirir: hücre (r,c) = bölük[(r+c)%n] —
  her satır/sütun şiirin tamamını okur, satır i = sütun i.
- `app.js` — DOM + olay yönetimi; her girişte `GridState.set` → dönen çiftler
  DOM'da senkronlanır (`programatik` bayrağı ile olay döngüsü önlenir).
- `style.css` — gece laciverti + altın varak + lal kırmızısı; yatay dikdörtgen
  hücreler; geniş karelerde çerçeve yatay kayar; duyarlı düzen.
- `server.py` — stdlib statik sunucu, no-store cache.
- `.github/workflows/pages.yml` — push'ta Pages'e otomatik dağıtım.

## Test kanıtı

### Birim testleri — `node test/grid.test.mjs` → **23/23 geçti**

Kapsanan: varsayılan boyut 4×4, boyut sınırları (1..10), yazma senkronu,
transpoz okuma, diyagonal, silme senkronu, üzerine yazma, tüm karakterler,
satır=sütun okuma, ayraçlı kelime okuma, fromText, toText, boyut değişiminde
içerik korunması, resize sonrası simetri, clearAll, loadPoem (4×4 yerleşim,
küçük karede birleştirme, büyük karede bölme, boş bölük tamamlama, 1×1,
sonrası düzenleme), Yavuz mısrası 6×6.

### E2E (gerçek tarayıcı)

1. Varsayılan açılış: 4×4, tüm hücreler boş ✓
2. "Şiiri Yükle" → Satır 1 = Sütun 1 = "Sanma şâhım | Herkesi sen | Sâdıkâne | Yâr olur" ✓
3. Okuma paneli: 4 satır × 4 sütun birebir aynı, "✓ söz bir, kare bir" ✓
4. Hücre boyutu 112×56 (yatay dikdörtgen) ✓
5. Canlı sitede (GitHub Pages) aynı doğrulama tekrarlandı ✓

## Kararlar ve gerekçeler

- **Framework'süz vanilla JS**: tek sayfalık statik araç; bağımlılık yükü
  değer katmaz. Python stdlib sunucu her yerde çalışır.
- **Tek kaynak depo (GridState)**: DOM iki kutu gösterir ama doğruluk tek
  kaynaktan gelir — UI hatası simetriyi bozamaz.
- **Kelime karesi döngüsel yerleşim**: (r+c) toplamı simetrik olduğundan
  matris kendiliğinden simetriktir; ikinci satır şiirin ters okunuşunu verir
  — tıpkı divan karesi geleneğindeki gibi.
- **GitHub Actions (legacy değil)**: legacy Pages derleyicisi takıldı;
  Actions deterministik, logları izlenebilir, `workflow` scope'u ile push
  edilir. Her `master` push'u otomatik yayınlar.

## Not

Yerel sunucu geliştirme için duruyor; canlı sürüm GitHub Pages'te.
