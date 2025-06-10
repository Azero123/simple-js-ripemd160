'use strict';

const rol  = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
const f    = (j, x, y, z) => (j <= 15) ? (x ^ y ^ z)
                : (j <= 31) ? ((x & y) | (~x & z))
                : (j <= 47) ? ((x | ~y) ^ z)
                : (j <= 63) ? ((x & z) | (y & ~z))
                : (x ^ (y | ~z));

const r = [
   0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,  7, 4,13, 1,10, 6,15, 3,
  12, 0, 9, 5, 2,14,11, 8,  3,10,14, 4, 9,15, 8, 1,  2, 7, 0, 6,13,11, 5,12,
   1, 9,11,10, 0, 8,12, 4,13, 3, 7,15,14, 5, 6, 2,  4, 0, 5, 9, 7,12, 2,10,
  14, 1, 3, 8,11, 6,15,13
];
const rP = [
   5,14, 7, 0, 9, 2,11, 4,13, 6,15, 8, 1,10, 3,12,  6,11, 3, 7, 0,13, 5,10,
  14,15, 8,12, 4, 9, 1, 2, 15, 5, 1, 3, 7,14, 6, 9, 11, 8,12, 2,10, 0, 4,13,
   8, 6, 4, 1, 3,11,15, 0, 5,12, 2,13, 9, 7,10,14, 12,15,10, 4, 1, 5, 8, 7,
   6, 2,13,14, 0, 3, 9,11
];
const s = [
  11,14,15,12, 5, 8, 7, 9,11,13,14,15, 6, 7, 9, 8,  7, 6, 8,13,11, 9, 7,15,
   7,12,15, 9,11, 7,13,12, 11,13, 6, 7,14, 9,13,15, 14, 8,13, 6, 5,12, 7, 5,
  11,12,14,15,14,15, 9, 8, 9,14, 5, 6, 8, 6, 5,12,  9,15, 5,11, 6, 8,13,12,
   5,12,13,14,11, 8, 5, 6
];
const sP = [
   8, 9, 9,11,13,15,15, 5, 7, 7, 8,11,14,14,12, 6,  9,13,15, 7,12, 8, 9,11,
   7, 7,12, 7, 6,15,13,11,  9, 7,15,11, 8, 6, 6,14, 12,13, 5,14,13,13, 7, 5,
  15, 5, 8,11,14,14, 6,14,  6, 9,12, 9,12, 5,15, 8,  8, 5,12, 9,12, 5,14, 6,
   8,13, 6, 5,15,13,11,11
];
const K  = [0x00000000,0x5A827999,0x6ED9EBA1,0x8F1BBCDC,0xA953FD4E];
const KP = [0x50A28BE6,0x5C4DD124,0x6D703EF3,0x7A6D76E9,0x00000000];

function ripemd160 (msg) {
  let M = Buffer.isBuffer(msg) ? Buffer.from(msg)
          : typeof msg === 'string' ? Buffer.from(msg, 'utf8')
          : Buffer.from(msg);

  const ml = M.length * 8;
  M = Buffer.concat([M, Buffer.from([0x80])]);
  while ((M.length % 64) !== 56) M = Buffer.concat([M, Buffer.alloc(1)]);
  const len = Buffer.alloc(8);
  len.writeUInt32LE(ml >>> 0, 0);
  len.writeUInt32LE(Math.floor(ml / 0x100000000) >>> 0, 4);
  M = Buffer.concat([M, len]);

  let h0 = 0x67452301,
      h1 = 0xEFCDAB89,
      h2 = 0x98BADCFE,
      h3 = 0x10325476,
      h4 = 0xC3D2E1F0;

  for (let i = 0; i < M.length; i += 64) {
    const X = new Uint32Array(16);
    for (let j = 0; j < 16; j++)
      X[j] = M.readUInt32LE(i + j * 4);

    let A1 = h0, B1 = h1, C1 = h2, D1 = h3, E1 = h4;
    let A2 = h0, B2 = h1, C2 = h2, D2 = h3, E2 = h4;

    for (let j = 0; j < 80; j++) {
      const T  = (rol((A1 + f(j, B1, C1, D1) + X[r[j]]  + K [j >> 4]) >>> 0, s [j]) + E1) >>> 0;
      A1 = E1; E1 = D1; D1 = rol(C1, 10); C1 = B1; B1 = T;

      const Tp = (rol((A2 + f(79 - j, B2, C2, D2) + X[rP[j]] + KP[j >> 4]) >>> 0, sP[j]) + E2) >>> 0;
      A2 = E2; E2 = D2; D2 = rol(C2, 10); C2 = B2; B2 = Tp;
    }

    const T   = (h1 + C1 + D2) >>> 0;
    h1 = (h2 + D1 + E2) >>> 0;
    h2 = (h3 + E1 + A2) >>> 0;
    h3 = (h4 + A1 + B2) >>> 0;
    h4 = (h0 + B1 + C2) >>> 0;
    h0 = T;
  }

  const out = Buffer.alloc(20);
  out.writeUInt32LE(h0,  0);
  out.writeUInt32LE(h1,  4);
  out.writeUInt32LE(h2,  8);
  out.writeUInt32LE(h3, 12);
  out.writeUInt32LE(h4, 16);
  return out.toString('hex');
}


module.exports = ripemd160;
