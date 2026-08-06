# Divan Karesi — Simetrik Şiir Kareleri

Yavuz Sultan Selim'in "Sanma şâhım herkesi sen sâdıkâne yâr olur" şiirindeki
gibi, **satır ve sütun okuması aynı** olan simetrik harf kareleri oluşturmak
için bir web uygulaması.

## Özellikler

- Boyut seçimi: 1x1 → 10x10 (matris NxN)
- Her hücreye serbest metin (tüm karakterler: harf, rakam, noktalama, boşluk)
- **Simetri zorunlu**: `(satır, sütun)` hücresi `(sütun, satır)` hücresiyle
  otomatik senkron — birine yazınca diğerine yazılır, birini silince diğeri
  de silinir (Yavuz'un kare düzenleme geleneği)
- Satır/sütun okuma modu: kareyi soldan sağa ve yukarıdan aşağı okuyup
  aynı sonucu verdiğini anında doğrular
- Divan edebiyatı dönemi estetiği: tezhip desenleri, altın varak tonları,
  hat sanatından esinlenen tipografi
- Yavuz Sultan Selim'in "Sanma Şâhım" şiiri tek tıkla kareye yüklenir (örnek)

## Çalıştırma

```bash
cd ~/projects/divan-kare
python3 server.py          # http://localhost:8000
```

Veya herhangi bir statik sunucu:
```bash
python3 -m http.server 8000
```

## Yapı

- `index.html` — sayfa iskeleti
- `style.css` — Divan dönemi teması (tezhip, altın, hat)
- `app.js` — grid mantığı ve simetri senkronizasyonu
- `grid.js` — saf mantık (test edilebilir, DOM'suz)
- `server.py` — basit statik sunucu
- `test/grid.test.mjs` — Node unit testleri
