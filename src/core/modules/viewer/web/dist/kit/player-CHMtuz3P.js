/* @code-commandments-generated */
import { Stage as U, SIDES as j, reachSide as q } from "./figure-D_EX9NSf.js";
import { bg as Q, aM as V, c7 as R } from "./index-BIEp0ufD.js";
import { t as X } from "./VoiceFigure-B7Ysnzfb.js";
const Y = 4, Z = (u) => u * u * (3 - 2 * u);
class tt {
  constructor(t, s) {
    this.figure = t, this.canvas = s, this.stage = new U(), this.drawn = /* @__PURE__ */ new Map(), this.shown = "", this.drawing = null, this.moves = null, this.shape = "", this.posture = "", this.blend = null, this.facing = null, this.turn = null, this.drewAt = null, this.propClips = /* @__PURE__ */ new Set();
  }
  // whether a change is still easing, so its frames go on being drawn until it is done
  blending() {
    return this.blend !== null || !!this.turn;
  }
  // Ease an explicit gaze interruption even when the clip, posture and facing key stays the same.
  easeFromCurrent() {
    var t, s;
    this.moves && (this.blend = { from: this.moves, began: performance.now(), plant: !!((t = this.blend) != null && t.plant), floor: !!((s = this.blend) != null && s.floor) });
  }
  // the clip's frame `index` in `posture`, turned `facing` degrees, onto the canvas, the eyes wearing the look `eyes` if one is given,
  // the legs `stride` through a step on the move, a figure watching the sky standing as `sky` says (figure.js watch), and the head
  // looking at `at` in the picture when given (figure.js lookToward), a rifle aimed at `target` there (figure.js rifleAim), the eyes `open`
  // that far through a blink, and the visor lit as a
  // screen as `screen` says (figure/visor.js), the head leaning `tilt` degrees at rest (figure/headTilt.js), and the things flung out
  // rummaging flying as `throws` says (acts.js throwsFor), leaning out `leanWay` (figure.js reachSide); nothing is drawn when that frame is
  // already there and nothing eases; `ticker` is text scrolling across the visor in place of the eyes (visorPixels.js tickerPixels); and the
  // figure `grabbed` by the pointer startled (figure.js startledHeld); and which mirrored telephone placement a seated call uses,
  // `phoneWay` (figure.js seatedCall); an `airborne` figure no longer plants its feet while leaving a seat
  show(t, s, e, { posture: n, eyes: a = null, stride: i = null, sky: r = null, throws: m = null, leanWay: d = 0, walkWay: f = 0, at: w = null, target: c = null, open: g = 1, screen: v = null, tilt: b = 0, ticker: p = null, grabbed: S = !1, phoneWay: $ = 1, airborne: A = !1 }) {
    var B, I, P, T, F, M, k, D;
    ["walk", "run"].includes(t.name) && i !== null && (s = (i % 1 + 1) % 1 * t.frames);
    const o = performance.now(), _ = `${t.name}/${n}/${e}`;
    if ((!this.shape.startsWith(`${t.name}/${n}/`) || A && ((B = this.blend) != null && B.plant || (I = this.blend) != null && I.floor)) && this.moves) {
      const K = [this.shape.split("/")[0], t.name].some((L) => ["walk", "run"].includes(L));
      this.blend = {
        from: this.moves,
        began: o,
        plant: !A && (Q(this.posture, n) || !!((P = this.blend) != null && P.plant) && V[n].drop === 0),
        floor: !A && this.posture === "stand" && n === "stand" && K
      };
    }
    const O = this.facing ?? (this.shape ? Number(this.shape.split("/")[2]) : null), C = X(O === null ? null : { facing: O, speed: ((T = this.turn) == null ? void 0 : T.speed) ?? 0 }, e, (o - (this.drewAt ?? o)) / 1e3, R);
    this.facing = C.facing, this.turn = C.settled ? null : C, this.drewAt = o, this.shape = _, this.posture = n, e = this.facing;
    const z = this.blend ? Math.min((o - this.blend.began) / 1e3 / R, 1) : 1, l = this.blend ? { from: this.blend.from, previous: this.moves, k: Z(z), settled: !1, plant: this.blend.plant, floor: this.blend.floor } : null, E = JSON.stringify([t.name, s, e, n, i, this.canvas.width, this.canvas.height, a, r, m, d, f, w, c, g, v, b, p, S, $]), h = (F = this.figure) == null ? void 0 : F.propTransitions;
    if (E === this.shown && !l && !(h != null && h.active)) return;
    const G = a || i !== null || r || m || d || f || w || c || g < 1 || v || b || p || S || $ !== 1 || l || this.turn || (h == null ? void 0 : h.present) || (h == null ? void 0 : h.active) || ((M = this.propClips) == null ? void 0 : M.has(t.name)) || !Number.isInteger(s), { frame: H, moves: J } = G ? this.liveOf(t, s, e, { posture: n, eyes: a, stride: i ?? 0, blend: l, sky: r, throws: m, leanWay: d, walkWay: f, at: w, target: c, open: g, screen: v, tilt: b, ticker: p, grabbed: S, phoneWay: $, time: o / 1e3 }) : this.frameOf(t, s, e, n);
    (D = (k = this.figure) == null ? void 0 : k.propTransitions) != null && D.present && (this.propClips ?? (this.propClips = /* @__PURE__ */ new Set())).add(t.name);
    const N = this.canvas.getContext("2d");
    N.clearRect(0, 0, this.canvas.width, this.canvas.height), N.drawImage(H, 0, 0), this.moves = J, l != null && l.settled && (this.blend = null), this.shown = l ? "" : E;
  }
  // the way the figure leans out rummaging toward `way`, 1 the picture's right, -1 its left: that way, or the other when that hand is busy
  reachWay(t) {
    return j[q(this.figure.stance, t)];
  }
  headAt() {
    return this.stage.headAt(this.figure, this.moves);
  }
  handAt() {
    return this.stage.handAt(this.figure, this.moves);
  }
  frameOf(t, s, e, n) {
    const a = `${t.name}/${e}/${n}/${this.canvas.width}`, i = this.drawn.get(a) || [];
    for (this.drawn.delete(a), this.drawn.set(a, i); this.drawn.size > Y; ) this.drawn.delete(this.drawn.keys().next().value);
    if (!i[s]) {
      const r = this.blank();
      i[s] = { frame: r, moves: this.stage.draw(this.figure, t, s, e, r, { posture: n }) };
    }
    return i[s];
  }
  liveOf(t, s, e, n) {
    return this.drawing ?? (this.drawing = this.blank()), { frame: this.drawing, moves: this.stage.draw(this.figure, t, s, e, this.drawing, n) };
  }
  blank() {
    const t = document.createElement("canvas");
    return t.width = t.height = this.canvas.width, t;
  }
}
export {
  tt as FigurePlayer
};
