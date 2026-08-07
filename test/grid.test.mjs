/**
 * grid.test.mjs — GridState birim testleri (Node)
 *
 * Çalıştırma: node test/grid.test.mjs
 */

import { GridState } from "../grid.js";
import assert from "node:assert/strict";

let gecen = 0;
let kalan = 0;

function test(ad, fn) {
  kalan++;
  try {
    fn();
    gecen++;
    console.log(`  ✓ ${ad}`);
  } catch (err) {
    console.error(`  ✗ ${ad}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

// ── Temel davranış ──────────────────────────────────────
test("varsayılan boyut 4x4, tüm hücreler boş", () => {
  const g = new GridState();
  assert.equal(g.size, 4);
  assert.equal(g.entries().length, 10); // üst üçgen: 4*5/2
  assert.ok(g.entries().every((e) => e.value === ""));
});

test("boyut 1..10 aralığına sınırlanır", () => {
  assert.equal(new GridState(0).size, 1);
  assert.equal(new GridState(-3).size, 1);
  assert.equal(new GridState(99).size, 10);
});

// ── Simetri senkronizasyonu ─────────────────────────────
test("(0,1) yazınca (1,0) da aynı değeri alır", () => {
  const g = new GridState(4);
  const guncellenen = g.set(0, 1, "şâhım");
  assert.equal(g.get(0, 1), "şâhım");
  assert.equal(g.get(1, 0), "şâhım");
  assert.deepEqual(
    guncellenen.sort((a, b) => a.r - b.r || a.c - b.c),
    [
      { r: 0, c: 1, value: "şâhım" },
      { r: 1, c: 0, value: "şâhım" },
    ]
  );
});

test("(3,1) yazınca (1,3) senkron; transpoz okuma", () => {
  const g = new GridState(6);
  g.set(3, 1, "yâr");
  assert.equal(g.get(1, 3), "yâr");
  assert.equal(g.get(3, 1), "yâr");
});

test("diyagonal (2,2) kendisiyle eşleşir, tek güncelleme", () => {
  const g = new GridState(5);
  const guncellenen = g.set(2, 2, "sâdıkâne");
  assert.equal(guncellenen.length, 1);
  assert.equal(g.get(2, 2), "sâdıkâne");
});

test("silme senkronu: birinden silinince diğerinden de silinir", () => {
  const g = new GridState(3);
  g.set(0, 2, "olur");
  assert.equal(g.get(2, 0), "olur");
  g.clear(0, 2);
  assert.equal(g.get(0, 2), "");
  assert.equal(g.get(2, 0), "");
});

test("üzerine yazma: değer değişince eş de güncellenir", () => {
  const g = new GridState(4);
  g.set(1, 2, "a");
  g.set(1, 2, "b");
  assert.equal(g.get(1, 2), "b");
  assert.equal(g.get(2, 1), "b");
});

test("herhangi bir karakter kabul edilir", () => {
  const g = new GridState(3);
  g.set(0, 1, "ç ğ ı ö ş ü .,!? 123"); // boşluk + Türkçe + noktalama
  assert.equal(g.get(1, 0), "ç ğ ı ö ş ü .,!? 123");
});

// ── Okuma ve doğrulama ──────────────────────────────────
test("readRows ve readCols simetri nedeniyle birebir aynıdır", () => {
  const g = new GridState(4);
  // Rastgele dolu üst üçgen
  g.set(0, 0, "s"); g.set(0, 1, "a"); g.set(0, 2, "n"); g.set(0, 3, "m");
  g.set(1, 1, "a"); g.set(1, 2, "h"); g.set(1, 3, "ı");
  g.set(2, 2, "m"); g.set(2, 3, "h");
  g.set(3, 3, "e");
  assert.deepEqual(g.readRows(), g.readCols());
  assert.ok(g.verifySymmetry());
});

test("readRows/readCols ayraçla kelime okur", () => {
  const g = new GridState(2);
  g.set(0, 0, "Sanma"); g.set(0, 1, "şâhım"); g.set(1, 1, "sen");
  assert.equal(g.readRows(" ")[0], "Sanma şâhım");
  assert.equal(g.readCols(" ")[0], "Sanma şâhım");
  assert.equal(g.readRows(" ")[1], "şâhım sen");
});

test("verifySymmetry boş karede true döner", () => {
  const g = new GridState(3);
  assert.ok(g.verifySymmetry());
});

test("fromText üst üçgeni doldurur, simetri korunur", () => {
  const g = new GridState(3);
  g.fromText("abc\ndef\nghi");
  // fromText satır satır yazar; (0,0)='a', (0,1)='b', (0,2)='c' ...
  assert.equal(g.get(0, 0), "a");
  assert.equal(g.get(0, 1), "b");
  assert.equal(g.get(0, 2), "c");
  assert.equal(g.get(1, 1), "e");
  assert.equal(g.get(1, 2), "f");
  assert.equal(g.get(2, 2), "i");
  assert.equal(g.get(2, 0), "c"); // transpoz yansıması
  assert.ok(g.verifySymmetry());
});

test("toText satır okumasını döndürür", () => {
  const g = new GridState(2);
  g.set(0, 0, "s"); g.set(0, 1, "e"); g.set(1, 1, "n");
  assert.equal(g.toText(), "se\nen");
});

// ── Boyut değişimi ──────────────────────────────────────
test("boyut değişince içerik korunur", () => {
  const g = new GridState(4);
  g.set(0, 1, "değer");
  g.resize(6);
  assert.equal(g.get(0, 1), "değer");
  assert.equal(g.get(1, 0), "değer");
  g.resize(2);
  assert.equal(g.get(0, 1), "değer");
  // taşan hücreler kaybolur ama hata vermez
  assert.equal(g.get(3, 3), "");
});

test("resize sonrası simetri korunur", () => {
  const g = new GridState(3);
  g.set(0, 2, "z");
  g.resize(7);
  g.set(5, 1, "t");
  assert.equal(g.get(1, 5), "t");
  assert.ok(g.verifySymmetry());
});

// ── clearAll ────────────────────────────────────────────
test("clearAll tüm kareyi boşaltır", () => {
  const g = new GridState(4);
  g.set(0, 1, "x"); g.set(2, 3, "y"); g.set(1, 1, "z");
  g.clearAll();
  assert.ok(g.entries().every((e) => e.value === ""));
  assert.ok(g.verifySymmetry());
});

// ── Kelime karesi (loadPoem) ────────────────────────────
const DORT_BOLUK = ["Sanma şâhım", "Herkesi sen", "Sâdıkâne", "Yâr olur"];
const TAM_SIIR = "Sanma şâhım Herkesi sen Sâdıkâne Yâr olur";

test("loadPoem 4 bölüğü 4x4 kareye yerleştirir; satır=sütun", () => {
  const g = new GridState(4);
  g.loadPoem(DORT_BOLUK);
  assert.equal(g.readRows(" ")[0], TAM_SIIR);
  assert.deepEqual(g.readRows(" "), g.readCols(" "));
  assert.ok(g.verifySymmetry());
  // Her satır/sütun her bölüğü tam bir kez okur
  for (const okuma of g.readRows(" ")) {
    for (const b of DORT_BOLUK) {
      assert.ok(okuma.includes(b), `${okuma} içinde "${b}" arandı`);
    }
  }
  // İlk sütun da şiirin tamamını okur (simetri)
  assert.equal(g.readCols(" ")[0], TAM_SIIR);
});

test("loadPoem daha küçük karede bölükleri birleştirir", () => {
  const g = new GridState(2);
  g.loadPoem(DORT_BOLUK);
  assert.equal(g.readRows(" ")[0], TAM_SIIR);
  assert.ok(g.verifySymmetry());
});

test("loadPoem daha büyük karede bölükleri kelimelerine böler", () => {
  const g = new GridState(5);
  g.loadPoem(DORT_BOLUK);
  assert.equal(g.readRows(" ")[0], TAM_SIIR);
  assert.ok(g.verifySymmetry());
  assert.deepEqual(g.readRows(" "), g.readCols(" "));
});

test("loadPoem kelimeden fazla boyutta boş bölüklerle tamamlar", () => {
  const g = new GridState(8); // 7 kelime → 7 bölük + 1 boş
  g.loadPoem(DORT_BOLUK);
  assert.equal(g.readRows(" ")[0].trim(), TAM_SIIR);
  assert.ok(g.verifySymmetry());
});

test("loadPoem 1x1'de tüm şiir tek hücrede okunur", () => {
  const g = new GridState(1);
  g.loadPoem(DORT_BOLUK);
  assert.equal(g.readRows(" ")[0].trim(), TAM_SIIR);
  assert.ok(g.verifySymmetry());
});

test("loadPoem sonrası düzenleme simetriyi korur", () => {
  const g = new GridState(4);
  g.loadPoem(DORT_BOLUK);
  g.set(0, 1, "Dostlarım");
  assert.equal(g.get(1, 0), "Dostlarım");
  assert.ok(g.verifySymmetry());
});

// ── Gerçek divan karesi (loadSquare) ───────────────────
const ORJINAL_KARE = [
  ["Sanma şâhım", "Herkesi sen", "Sâdıkâne", "Yâr olur"],
  ["Herkesi sen", "Dost mu sandın", "Belki ol", "Ağyâr olur"],
  ["Sâdıkâne", "Belki ol", "Bu âlemde", "Dildâr olur"],
  ["Yâr olur", "Ağyâr olur", "Dildâr olur", "Serdâr olur"],
];

test("loadSquare orijinal dörtlüğü 4×4'e yerleştirir; satır=sütun", () => {
  const g = new GridState();
  g.loadSquare(ORJINAL_KARE);
  assert.equal(g.size, 4);
  assert.deepEqual(g.readRows(" "), [
    "Sanma şâhım Herkesi sen Sâdıkâne Yâr olur",
    "Herkesi sen Dost mu sandın Belki ol Ağyâr olur",
    "Sâdıkâne Belki ol Bu âlemde Dildâr olur",
    "Yâr olur Ağyâr olur Dildâr olur Serdâr olur",
  ]);
  assert.deepEqual(g.readRows(" "), g.readCols(" "));
  assert.ok(g.verifySymmetry());
});

test("loadSquare simetriyi zorlar (üst üçgen kaynak, alt üçgen aynalanır)", () => {
  const g = new GridState();
  g.loadSquare([
    ["A", "B", "C"],
    ["X", "E", "F"], // (1,0)="X" asimetrik — üst üçgen (0,1)="B" kazanır
    ["Y", "Z", "I"],
  ]);
  assert.equal(g.get(1, 0), "B");
  assert.equal(g.get(2, 0), "C");
  assert.equal(g.get(2, 1), "F");
  assert.ok(g.verifySymmetry());
});

test("loadSquare sonrası düzenleme simetriyi korur", () => {
  const g = new GridState();
  g.loadSquare(ORJINAL_KARE);
  g.set(1, 2, "Dostlarım");
  assert.equal(g.get(2, 1), "Dostlarım");
  assert.ok(g.verifySymmetry());
});

// ── Yavuz örneği (harf karesi, geriye dönük uyum) ──────
test("Yavuz mısrası 6×6 kareye yerleşir ve simetrik okunur", () => {
  const g = new GridState(6);
  const metin = "sanmaşâhımherkesisensâdıkâneyârolur";
  assert.ok(metin.length <= 6 * 6, "mısra 36 hücreye sığmalı");
  let i = 0;
  outer:
  for (let r = 0; r < g.size; r++) {
    for (let c = r; c < g.size; c++) {
      if (i >= metin.length) break outer;
      g.set(r, c, metin[i++]);
    }
  }
  assert.ok(g.verifySymmetry());
  assert.deepEqual(g.readRows(), g.readCols());
});

console.log(`\n${gecen}/${kalan} test geçti`);
if (process.exitCode) {
  console.error("BAZILARI BAŞARISIZ");
  process.exit(1);
}
