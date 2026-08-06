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
