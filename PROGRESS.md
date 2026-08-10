# PROGRESS — Dîvân-ı Kare

## 2026-08-06 (v1)

- [x] PLAN.md yazıldı (stack: vanilla JS + stdlib sunucu)
- [x] grid.js — GridState (tam simetrik depo)
- [x] index.html + style.css (Divan teması, tezhip, tuğra)
- [x] app.js — DOM, senkronizasyon, boyut seçimi, şiir yükleme
- [x] server.py — statik sunucu (port 8000)
- [x] test/grid.test.mjs — 16/16 geçti
- [x] E2E tarayıcı doğrulaması — yazma/silme senkronu, boyut değişimi, tema
- [x] DONE.md + git commit
- [x] Telegram bildirimi gönderildi

## 2026-08-06 (v2 — kelime karesi + yayın)

- [x] Kullanıcı geri bildirimi: harf değil KELİME isteniyor, default 4×4,
      hücreler yatay dikdörtgen olmalı
- [x] grid.js — `loadPoem()` döngüsel kelime yerleşimi (satır = sütun),
      default boyut 4, `readRows/readCols(sep)` ayraç desteği
- [x] app.js — kelime karesi yükleme, default 4×4, ayraçlı okuma paneli
- [x] style.css — yatay dikdörtgen hücreler (112×56), çerçeve kaydırması
- [x] test/grid.test.mjs — 23/23 geçti (loadPoem senaryoları dahil)
- [x] E2E doğrulama — satır 1 = sütun 1 = tam şiir, dikdörtgen hücre ✓
- [x] GitHub: repo `AbdurrahimOzagac/divan-kare` (public), Pages + Actions
- [x] Canlı: https://abdurrahimozagac.github.io/divan-kare/ doğrulandı

## 2026-08-06 (v3 — orijinal şiir düzeltmesi)

- [x] Kullanıcı: "Şiiri orijinalini yanlış yazmışsın, internetten doğrusunu bul"
- [x] Araştırma: dörtlük aslında 4×4 AYAK KARESİ — döngüsel değil, tam simetrik
      (10 farklı ayak). Kaynaklar: malumatfurus.org (akademik), frmtr, antoloji.com
- [x] grid.js — `loadSquare()`: üst üçgen kaynak, alt üçgen aynalanır
- [x] app.js — `SIIR_KARESI` (orijinal 4×4), "Şiiri Yükle" kareyi işler
- [x] index.html — "Yavuz Sultan Selim'e atfedilen dörtlük" (atıf tartışması notu)
- [x] test — 26/26 geçti (loadSquare senaryoları dahil)
- [x] E2E — dört satır = dört sütun = dört mısra ✓

## 2026-08-06 (v4 — önbellek + varsayılan düzeltme)

- [x] Kullanıcı: "Sitede yükle diyince gelen şiir doğru değil" — kök neden:
      GitHub Pages asset'leri URL'de sürüm olmadan sunuluyor, tarayıcı eski
      app.js'i (v2 döngüsel) önbellekte tutuyordu
- [x] index.html — cache-busting: `style.css?v=4`, `grid.js?v=4`, `app.js?v=4`
- [x] app.js — şiir açılışta OTOMATİK yükleniyor (default artık orijinal kare)
- [x] E2E — açılış anında 16 hücre orijinal dörtlükle dolu ✓

## 2026-08-07 (v5–v7 — Cloudflare Pages + fontlar)

- [x] v5: Cloudflare Pages desteği — `_headers` önbellek kuralları, `cloudflare.yml`
      workflow (push'ta otomatik deploy), `scripts/deploy.sh`
- [x] Kullanıcı eklemeleri: v6 (şiir metni kullanıcının verdiği orijinal metinle
      birebir — küçük harfler, 27 test), v6.1 (CF production branch = master)
- [x] v7: Google Fonts engeli çözümü — fontlar self-host (8 woff2, latin+latin-ext),
      `@font-face` style.css'te, index.html'den fonts.googleapis bağımlılığı SÖKÜLDÜ
- [x] Doğrulama: pages.dev + github.io HTTP 200, 0 dış istek, fontlar kendi
      alan adından immutable cache ile servis ediliyor, şiir otomatik yüklü ✓

## 2026-08-10 (v8 — cache-busting v=6 düzeltmesi)

- [x] Kullanıcı: "pages.dev'de site ayakta değil" — kök neden: v7'de asset'ler
      (style.css/grid.js/app.js) değişti ama index.html `?v=5`'te kaldı; Cloudflare
      `_headers` bunlara `max-age=31536000, immutable` verdiği için tarayıcılar
      ESKİ v5 dosyalarını 1 yıl önbellekten gösteriyordu (bozuk/boş görünüm)
- [x] index.html — tüm asset referansları `v=5` → `v=6`
- [x] _headers — NOT yorumu v=6 güncellendi
- [x] Test: 27/27 geçti; deploy'lar success; canlıda v=6 referansları + E2E
      tarayıcı doğrulaması (4×4 orijinal şiir, 0 console hatası) ✓
- [x] DERS: asset değişince sürümü artırmayı unutma — _headers'taki NOT takip et
