export class DSU {
  constructor(n) {
    this.p = Array.from({ length: n }, (_, i) => i);
    this.r = new Array(n).fill(0);
    this.n = n;
  }

  find(i) {
    if (this.p[i] !== i) this.p[i] = this.find(this.p[i]);
    return this.p[i];
  }

  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.r[ra] < this.r[rb]) this.p[ra] = rb;
    else if (this.r[rb] < this.r[ra]) this.p[rb] = ra;
    else { this.p[rb] = ra; this.r[ra]++; }
    return true;
  }

  snap() { return { parent: [...this.p], rank: [...this.r] }; }

  groups() {
    const g = {};
    for (let i = 0; i < this.n; i++) {
      const r = this.find(i);
      (g[r] || (g[r] = [])).push(i);
    }
    return g;
  }
}
