/**
 * grid.js — Divan Karesi saf mantık modülü
 *
 * DOM'dan bağımsız simetrik kare (symmetric square) yönetimi.
 * (r,c) hücresi ile (c,r) hücresi AYNI değeri taşır — Yavuz Sultan
 * Selim'in kare düzenleme geleneği: satır okuması = sütun okuması.
 *
 * Bu modül hem tarayıcıda (script tag) hem Node'da (ESM) çalışır.
 */

export class GridState {
  /**
   * @param {number} size Kare boyutu (1..10)
   */
  constructor(size = 5) {
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
   * @returns {string[]}
   */
  readRows() {
    return this.cells.map((row) => row.join(""));
  }

  /**
   * Sütun okuması: her sütun yukarıdan aşağı birleştirilir.
   * Simetri sayesinde readRows() ile birebir aynıdır.
   * @returns {string[]}
   */
  readCols() {
    const cols = [];
    for (let c = 0; c < this.size; c++) {
      let s = "";
      for (let r = 0; r < this.size; r++) {
        s += this.cells[r][c];
      }
      cols.push(s);
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
}
