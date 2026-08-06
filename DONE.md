# DONE — Dîvân-ı Kare

## Ne yapıldı

Yavuz Sultan Selim'in "Sanma şâhım herkesi sen sâdıkâne yâr olur" şiirindeki
geleneği — **satır ve sütun okuması aynı olan simetrik harf kareleri** — için
Divan dönemi estetiğinde bir web uygulaması.

Konum: `~/projects/divan-kare/`
Çalıştırma: `python3 server.py` → http://localhost:8000

## İstenen özellikler ve karşılıkları

| İstek | Durum |
|---|---|
| Boyut seçimi 1×1 … 10×10 | ✓ Buton grubu; içerik boyut değişince korunur |
| Tüm karakterler yazılabilir | ✓ Boşluk, Türkçe karakter, noktalama, rakam — hepsi |
| (r,c) ↔ (c,r) otomatik senkron | ✓ Birine yazılınca diğerine yazılır |
| Birinden silinince diğerinden silinir | ✓ `clear` senkronu test edildi |
| Satır = sütun okuması | ✓ Okuma paneli satır/sütun karşılaştırır, simetriyi doğrular |
| Divan dönemi UI | ✓ Tezhip köşe süsleri, altın varak, tuğra, Marcellus/EB Garamond |
| Localhost | ✓ `server.py` (port 8000) |
| Bittiğinde Telegram bildirimi | ✓ Bu rapor |

## Mimari

- `grid.js` — saf mantık (DOM'suz `GridState`). Depo her zaman tam simetrik:
  `cells[r][c] === cells[c][r]`; `set()` iki yönlü yazar.
- `app.js` — DOM + olay yönetimi; her girişte `GridState.set` → dönen çiftler
  DOM'da senkronlanır (`programatik` bayrağı ile olay döngüsü önlenir).
- `style.css` — gece laciverti + altın varak + lal kırmızısı; tezhip SVG
  köşeleri; duyarlı (mobil) düzen.
- `server.py` — stdlib statik sunucu, no-store cache.
- Bonus: "✒ Şiiri Yükle" butonu Yavuz'un mısrasını kareye işler (6×6'ya
  otomatik boyutlanır, üst üçgene yerleşir, alt üçgen aynalanır).

## Test kanıtı

### Birim testleri — `node test/grid.test.mjs` → **16/16 geçti**

Kapsanan: varsayılan boyut, boyut sınırları (1..10), yazma senkronu,
transpoz okuma, diyagonal, silme senkronu, üzerine yazma, tüm karakterler,
satır=sütun okuma, boş kare doğrulaması, fromText, toText, boyut değişiminde
içerik korunması, resize sonrası simetri, clearAll, Yavuz mısrası 6×6.

### E2E (gerçek tarayıcı, localhost:8000)

1. `index/style/app/grid` → hepsi HTTP 200
2. (0,1) hücresine "s" yazıldı → (1,0) otomatik "s" oldu ✓
3. (1,0)'dan silindi → (0,1) de boşaldı ✓
4. "Şiiri Yükle" → 6×6 kare, ilk satır "sanmaş", satır=sütun ✓
5. 3×3'e geçildi → içerik korundu, simetri bozulmadı ✓
6. Tema doğrulandı: Marcellus fontu, altın başlık, lacivert hücreler,
   lal diyagonal çerçeve ✓

## Kararlar ve gerekçeler

- **Framework'süz vanilla JS**: tek sayfalık statik araç; bağımlılık yükü
  değer katmaz. Python stdlib sunucu her yerde çalışır.
- **Tek kaynak depo (GridState)**: DOM iki kutu gösterir ama doğruluk tek
  kaynaktan gelir — UI hatası simetriyi bozamaz.
- **Şiir yükleme üst üçgene**: alt üçgen `set()` ile aynalandığı için
  simetri garantisi korunur; gerçek dize girişi kullanıcıya kalmış.

## Not

Sunucu şu anda arka planda çalışıyor (proc_10cfdd6ac45d). Kapatmak için:
`kill 10725` veya `pkill -f "python3 server.py"`.
