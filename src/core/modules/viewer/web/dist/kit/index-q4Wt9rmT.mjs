/* @code-commandments-generated */
import { openBlock as u, createElementBlock as h, normalizeStyle as ge, unref as P, renderSlot as ue, createElementVNode as y, normalizeClass as Z, Fragment as G, renderList as ee, defineComponent as ii, Comment as ci, h as Kn, cloneVNode as ui, createBlock as H, withCtx as q, createVNode as D, toDisplayString as k, createCommentVNode as C, ref as L, onMounted as Re, onBeforeUnmount as ft, reactive as Yn, shallowRef as Ke, watch as fe, onUnmounted as Be, inject as Oe, useAttrs as Jn, computed as I, resolveDynamicComponent as ht, mergeProps as Fe, useId as fs, resolveDirective as di, withDirectives as tt, createTextVNode as te, Teleport as hs, nextTick as mt, Transition as Dt, withModifiers as xe, TransitionGroup as tl, shallowReactive as fi, isRef as zs, onScopeDispose as ms, resolveComponent as hi, useModel as Fa, getCurrentInstance as mi, mergeModels as Wa, getCurrentScope as nl, provide as al, onErrorCaptured as pi, toHandlers as gi, createSlots as vi, vShow as sl, useSlots as yi, withKeys as Zt, vModelText as Ha, normalizeProps as bi, guardReactiveProps as wi, defineAsyncComponent as ki } from "vue";
function ol(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, xi = 1600, $i = {
  __name: "Shimmer",
  setup(e) {
    const t = ol(xi);
    return (n, a) => (u(), h("span", {
      class: "shimmer",
      style: ge(P(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ Y($i, [["__scopeId", "data-v-1c6fdf5f"]]), Mi = { class: "skeleton-line" }, Si = 2e3, _i = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = ol(Si);
    return (n, a) => (u(), h("span", Mi, [
      ue(n.$slots, "default", {}, void 0, !0),
      y("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (u(!0), h(G, null, ee(e.bars, (s) => (u(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...P(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, pt = /* @__PURE__ */ Y(_i, [["__scopeId", "data-v-341b98f6"]]), jt = ii({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ci);
      return a.length !== 1 ? Kn(G, { key: n }, a) : a[0].key == null ? ui(a[0], { key: n }) : a[0];
    };
  }
}), Ei = ["aria-label"], Ai = ["aria-label"], Ci = ["aria-label"], Oi = ["aria-label"], Ti = ["aria-label"], Ri = ["aria-label"], Ii = ["aria-label"], Bi = {
  __name: "Skeleton",
  props: { shape: { type: String, default: "rows" }, count: { type: Number, default: 4 }, label: { type: String, default: "Loading" } },
  setup(e) {
    const t = [
      { id: "shape-1", width: 46, height: 38, mine: !1 },
      { id: "shape-2", width: 30, height: 22, mine: !0 },
      { id: "shape-3", width: 58, height: 64, mine: !1 },
      { id: "shape-4", width: 40, height: 30, mine: !1 },
      { id: "shape-5", width: 34, height: 22, mine: !0 },
      { id: "shape-6", width: 62, height: 86, mine: !1 },
      { id: "shape-7", width: 26, height: 22, mine: !1 },
      { id: "shape-8", width: 50, height: 44, mine: !0 },
      { id: "shape-9", width: 38, height: 30, mine: !1 },
      { id: "shape-10", width: 56, height: 58, mine: !1 },
      { id: "shape-11", width: 30, height: 22, mine: !0 },
      { id: "shape-12", width: 44, height: 38, mine: !1 },
      { id: "shape-13", width: 60, height: 72, mine: !1 },
      { id: "shape-14", width: 36, height: 30, mine: !0 }
    ], n = [
      { id: "type", bars: [{ width: "64px", height: 8 }] },
      { id: "title", bars: [{ width: "70%", height: 12 }] },
      { id: "line", bars: [{ width: "45%", height: 9 }] }
    ], a = [
      { width: "46%", height: 12 },
      { width: "52px", height: 9 }
    ], s = [
      { id: "first", bars: [{ width: "88%", height: 9 }] },
      { id: "second", bars: [{ width: "64%", height: 9 }] },
      { id: "third", bars: [{ width: "76%", height: 9 }] }
    ], o = [
      { width: "58%", height: 11 },
      { width: "32%", height: 9 }
    ], l = ["94%", "88%", "91%", "62%"].map((i) => ({ width: i, height: 10 })), r = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (i, c) => (u(), H(jt, { value: e.shape }, {
      messages: q(() => [
        y("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), h(G, null, ee(t, (d) => D(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Ei)
      ]),
      older: q(() => [
        y("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, ee(t.slice(0, 3), (d) => (u(), H(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ai)
      ]),
      cards: q(() => [
        y("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, ee(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), h(G, null, ee(n, (f) => D(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ci)
      ]),
      file: q(() => [
        y("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, ee(e.count, (d) => (u(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            D(pt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), h(G, null, ee(s, (f) => D(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Oi)
      ]),
      page: q(() => [
        y("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          D(pt, {
            class: "skeleton-heading",
            bars: r
          }),
          (u(!0), h(G, null, ee(e.count, (d) => (u(), H(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ti)
      ]),
      text: q(() => [
        y("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, ee(e.count, (d) => (u(), H(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ri)
      ]),
      default: q(() => [
        y("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), h(G, null, ee(e.count, (d) => (u(), H(pt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Ii)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, _t = /* @__PURE__ */ Y(Bi, [["__scopeId", "data-v-5a4a3667"]]), Li = {
  key: 1,
  class: "empty-state titled"
}, Ni = { class: "empty-state-title" }, Di = { class: "empty-state-text" }, ji = {
  key: 2,
  class: "empty-state"
}, Pi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), h("div", Li, [
      y("p", Ni, k(e.title), 1),
      y("p", Di, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), h("p", ji, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Xt = /* @__PURE__ */ Y(Pi, [["__scopeId", "data-v-bbb14fd6"]]), qi = { class: "fold-group" }, Fi = ["aria-expanded"], Wi = { class: "fold-label" }, Hi = {
  key: 0,
  class: "fold-count"
}, zi = {
  __name: "FoldGroup",
  props: {
    label: { type: String, required: !0 },
    count: { type: [Number, String], default: "" },
    open: { type: Boolean, default: !0 },
    flush: { type: Boolean, default: !1 },
    bar: { type: Boolean, default: !1 }
  },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", qi, [
      y("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        y("span", Wi, k(e.label), 1),
        e.count !== "" ? (u(), h("span", Hi, k(e.count), 1)) : C("", !0),
        y("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Fi),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, F5 = /* @__PURE__ */ Y(zi, [["__scopeId", "data-v-5a6a4d36"]]), Ui = 150, Vi = () => Ui;
function ps(e, t, n = Vi(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Gi(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((i) => [i, a[i]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let r = !1;
  try {
    const i = await n(t);
    return r = i.ok, i;
  } finally {
    r || l();
  }
}
const Ki = 50, Us = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function W5(e) {
  const t = We().sources.find((n) => n.key === e);
  return t ? za(t.read, t.events) : za("", []);
}
function ll(e, t, n, a, s = () => !1) {
  const o = L([]), l = L(null), r = L(""), i = L(!1), c = performance.now(), d = L(!1), f = L(""), m = L(null), g = /* @__PURE__ */ new Set();
  let v = null;
  function x(p) {
    return s() ? (g.add(p), v ?? (v = new Promise((S) => setTimeout(() => S(M()), Ki)))) : B(p);
  }
  async function M() {
    const p = new Set(g);
    g.clear(), v = null;
    const S = O, E = await t({ ids: [...p].join(","), limit: p.size });
    if (S !== O) return;
    if (!E.ok) return A();
    const T = new Map(E.value.rows.map((j) => [j.id, j]));
    o.value = o.value.flatMap((j) => p.has(j.id) ? T.has(j.id) ? [T.get(j.id)] : [] : [j]);
  }
  async function B(p) {
    const S = O, E = await t({ "before-id": p + 1, limit: 1 });
    if (S !== O) return;
    if (!E.ok) return A();
    const T = E.value.rows.find((j) => j.id === p);
    o.value = T ? o.value.map((j) => j.id === p ? T : j) : o.value.filter((j) => j.id !== p);
  }
  async function F(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ne) => ne.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((ne) => ne.id === p.row_id)) return x(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return A();
    const E = Math.max(...o.value.map((ne) => ne.id)), T = O, j = await t({ "after-id": E });
    if (T !== O) return;
    if (!j.ok) return A();
    const X = new Set(o.value.map((ne) => ne.id));
    o.value = [...j.value.rows.filter((ne) => !X.has(ne.id)), ...o.value];
  }
  async function J() {
    if (!d.value || !o.value.length) return !1;
    const p = O, S = Math.min(...o.value.map((j) => j.id)), E = await t({ "before-id": S });
    if (p !== O) return !1;
    if (!E.ok || !E.value.rows.length) return d.value = !1;
    d.value = Us(E.value, n());
    const T = new Set(o.value.map((j) => j.id));
    return o.value = [...o.value, ...E.value.rows.filter((j) => !T.has(j.id))], !0;
  }
  let O = 0;
  function w(p, S) {
    var j, X;
    const E = p.ok ? e.shared ? [p.value] : ((j = p.value) == null ? void 0 : j.rows) ?? [] : [];
    p.ok && (o.value = S(E)), l.value = p.ok ? p.value : null;
    const T = E.length ? Math.min(...E.map((ne) => ne.id)) : 0;
    p.ok && ((X = p.value) != null && X.rows) && !o.value.some((ne) => ne.id < T) && (d.value = !e.shared && Us(p.value, n())), r.value = p.ok ? "" : p.error, ps(c, () => i.value = !0);
  }
  async function R(p) {
    const S = ++O, E = await t({});
    S === O && w(E, p);
  }
  const b = (p) => {
    if (!a() || !p.length) return p;
    const S = Math.min(...p.map((T) => T.id)), E = Math.max(...p.map((T) => T.id));
    return [...o.value.filter((T) => T.id > E), ...p, ...o.value.filter((T) => T.id < S)];
  }, A = () => R(b), $ = (p) => w(p, b), N = () => R((p) => p);
  async function _(p, S = null) {
    const E = await Gi(S && { target: o, fields: { value: S(o.value) } }, p, e.run);
    return f.value = E.ok ? "" : E.error, m.value = E.ok ? E.value : null, await A(), E;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: d, load: A, loadLatest: N, older: J, act: _, actionFailure: f, answer: m, context: e, heard: F, showFirst: $ };
}
const Yi = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function za(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = We(), l = ll(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Yi(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Ji = 2e3;
function gs(e, t, n = Ji) {
  let a = null, s = !1, o = !1;
  const l = async (d) => {
    o = !0;
    try {
      await d();
    } catch {
    } finally {
      o = !1;
    }
  }, r = () => l(async () => t() && await e()), i = () => {
    s || document.hidden || (a = setTimeout(
      async () => {
        document.hidden || await r(), i();
      },
      typeof n == "function" ? n() : n
    ));
  }, c = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Re(async () => {
    document.addEventListener("visibilitychange", c), await l(e), i();
  }), ft(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const rl = typeof document < "u" && document.documentElement.classList.contains("phone"), il = 120;
var Qo;
const ia = globalThis[Qo = Symbol.for("journal.pressed")] ?? (globalThis[Qo] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Zi(e = 0) {
  const t = ia.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ia.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ia.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function Ua(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function cl(e = window) {
  if (!Ua(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ua(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Va = "journal.stale-build-reload", Xi = 'script[type="module"][src*="/assets/index-"]', Vs = (e) => {
  var t;
  return ((t = e.querySelector(Xi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Qi(e = document, t = (a, s) => Me.quietRead(a, s), n = () => cl(window)) {
  const a = Vs(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Vs(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ca = "";
function ec(e, t = () => cl(window)) {
  if (!e) return !1;
  const n = !!ca && ca !== e;
  return ca = e, n && t(), n;
}
const tc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function nc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Va) === e.message) return !1;
    t.setItem(Va, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function ac(e = window.sessionStorage) {
  try {
    e.removeItem(Va);
  } catch {
    return;
  }
}
const sc = 2e3, oc = 3e4, ze = Yn({ starting: !1, external: !1, late: !1, offline: !1 }), ul = () => ze.starting, lc = 3;
let vn = 0, Ga = 0, dl = 0, fl = [];
async function rc() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
let Gs = null;
const ic = () => Gs ?? (Gs = rc().finally(() => Gs = null));
function cc() {
  clearTimeout(Ga), clearTimeout(dl), Ga = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), fl.splice(0).forEach((e) => e()), Qi();
}
async function uc() {
  ze.offline = !navigator.onLine;
  const e = await ic();
  if (ze.external = e.updating, vn = !e.restarting && !e.updating && e.reachable ? vn + 1 : 0, vn < lc) return;
  vn = 0, (!ec(e.started_at) || Ua()) && cc();
}
function hl() {
  Ga = setTimeout(async () => {
    await uc(), ze.starting && hl();
  }, sc);
}
function dc() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, hl(), dl = setTimeout(() => ze.late = !0, oc));
}
const fc = () => ze.starting ? new Promise((e) => fl.push(e)) : Promise.resolve();
function ml(e, t) {
  let n = 0, a = null, s = !1, o = !1;
  const l = () => {
    s = !1, n = Date.now(), o && (o = !1, i());
  }, r = () => {
    a = null;
    const c = e();
    n = Date.now(), c instanceof Promise && (s = !0, c.catch(() => {
    }).finally(l));
  }, i = () => {
    if (s) {
      o = !0;
      return;
    }
    if (a) return;
    const c = t - (Date.now() - n);
    c <= 0 ? r() : a = setTimeout(r, c);
  };
  return i.cancel = () => {
    clearTimeout(a), a = null, o = !1;
  }, i;
}
function hc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class mc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = ml(() => this.leave(), 0);
  }
  leave() {
    const t = this.following;
    this.following = null, this.flying = t, this.outdated = !1, this.tracked("sent", t);
    const n = this.read(t.stop.signal, t);
    t.resolve(n);
    const a = () => {
      this.tracked("answered", t), this.flying === t && (this.flying = null), this.following || this.ended();
    };
    return n.then(a, a), n;
  }
  asked(t) {
    var o;
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = hc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
    a.askers += 1, a.callers += 1, this.tracked("asked", a);
    const s = this.answerFor(a, t);
    return this.following === a && this.ask(), s;
  }
  answerFor(t, n) {
    return n ? new Promise((a, s) => {
      const o = () => {
        this.left(t), s(new DOMException("cancelled", "AbortError"));
      };
      if (n.aborted) return o();
      n.addEventListener("abort", o, { once: !0 }), t.answer.then(a, s).finally(() => n.removeEventListener("abort", o));
    }) : t.answer;
  }
  left(t) {
    t.askers -= 1, !(t.askers > 0) && (t.stop.abort(), t === this.following && (this.following = null, this.ask.cancel(), this.flying || this.ended()));
  }
  heardEvent() {
    this.flying && (this.outdated = !0);
  }
}
const st = "viewer.shell", yn = 2e4, pc = 4, Ks = "/api/read-lines", gc = 5e3, vc = 403, Ys = "/api/repeated-lines", yc = 10, bc = 2e3, wc = 3e5, H5 = 6e5, bn = 6, kc = 500, xc = "/journal/summary", Js = "/api/server-state", $c = 2e4, wn = rl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Mc = (e) => e.split("?")[0].endsWith(xc), Ka = (e, t) => Object.assign(new Error(t), { status: e });
async function Sc(e, t, n = Ka) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const _c = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Ec = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Zs = (e) => e.split(" ").slice(0, 2).join(" "), Ze = "read", Tt = "write", Ac = "stream";
class Cc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = bn;
  }
  // what is in flight, of one window or of all: each with its window, line, kind (read, write or stream), address and started_at
  inFlight(t = null) {
    return [...this.flights].filter((n) => t === null || n.window === t).map((n) => ({ ...n }));
  }
  // how many requests a window has sent, by noun and verb
  sentCounts(t) {
    return Object.fromEntries(this.lineCounts.get(t) ?? []);
  }
  requestCounts(t) {
    var s;
    const n = this.sentCounts(t), a = [...((s = this.joinCounts.get(t)) == null ? void 0 : s.values()) ?? []];
    return {
      http_requests: this.httpCounts.get(t) ?? 0,
      logical_commands: Object.entries(n).filter(([o]) => !o.startsWith("/")).reduce((o, [, l]) => o + l, 0),
      joined_callers: a.reduce((o, l) => o + l.joined_callers, 0),
      trailing_reads: a.reduce((o, l) => o + l.trailing_reads, 0),
      by_command: n
    };
  }
  requestTotals() {
    const t = [...this.lineCounts.keys()].map((n) => this.requestCounts(n));
    return {
      http_requests: this.httpRequests,
      logical_commands: t.reduce((n, a) => n + a.logical_commands, 0),
      joined_callers: t.reduce((n, a) => n + a.joined_callers, 0),
      trailing_reads: t.reduce((n, a) => n + a.trailing_reads, 0)
    };
  }
  took(t, n) {
    /\/api\/lines?$/.test(n) && (this.httpRequests += 1, new Set(t.map((o) => o.window)).forEach((o) => this.httpCounts.set(o, (this.httpCounts.get(o) ?? 0) + 1)));
    const a = Date.now(), s = t.map((o) => ({ ...o, url: n, started_at: a }));
    return s.forEach((o) => {
      this.flights.add(o), this.counted(o);
    }), () => s.forEach((o) => this.flights.delete(o));
  }
  counted({ window: t, line: n }) {
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Zs(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < bc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < yc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Ys, { method: "POST", headers: { ...wn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Ys, kind: Tt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Zi(n ? il : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Ec(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Tt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = yn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && dc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= pc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
    try {
      return await t();
    } finally {
      const n = this.readsWaiting.shift();
      n ? n() : this.readsFlying -= 1;
    }
  }
  // whether a line only reads, as the server knows its command: a line the server has not called a read is a write, which is never joined
  async isRead(t) {
    return this.readLines ?? (this.readLines = this.answeredReadLines()), this.knownReads = await this.readLines, this.knownReads.has(t.slice(0, 2).join(" "));
  }
  // the same, at once and without asking: a line is taken for a write until the server's list of reads has come
  knownRead(t) {
    var n;
    return !!((n = this.knownReads) != null && n.has(t.slice(0, 2).join(" ")));
  }
  answeredReadLines() {
    return this.out(Ks, { headers: wn }, [{ window: st, line: Ks, kind: Ze }], gc).then(async (t) => {
      if (t.status === vc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Ka(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new mc(
      (l, r) => n(l, s ? this.readAttribution(r) : void 0),
      () => this.joinedReads.delete(t),
      (l, r) => {
        s && this.trackRead(s, l, r);
      }
    );
    return this.joinedReads.set(t, o), o.asked(a);
  }
  readAttribution(t) {
    return {
      client_id: this.clientId,
      command_id: t.id,
      joined_callers: t.callers - 1,
      followed_command_id: t.trailingOf,
      complete: !1
    };
  }
  trackRead({ window: t, line: n }, a, s) {
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Zs(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
    a === "asked" && s.callers > 1 && (r.joined_callers += 1), a === "sent" && s.trailingOf && (r.trailing_reads += 1), o.set(l, r), this.joinCounts.set(t, o), !(a !== "answered" || !this.recording) && (this.readReceipts.push(this.readAttribution(s)), this.receiptTimer ?? (this.receiptTimer = setTimeout(() => this.flushReadReceipts(), 50)));
  }
  flushReadReceipts() {
    clearTimeout(this.receiptTimer), this.receiptTimer = null;
    const t = this.readReceipts;
    return this.readReceipts = [], t.length ? (this.receiptSending = this.receiptSending.then(async () => {
      try {
        (await this.raw("/api/read-receipts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receipts: t })
        })).ok || (this.receiptFailures += t.length);
      } catch {
        this.receiptFailures += t.length;
      }
    }), this.receiptSending) : this.receiptSending;
  }
  // an event has come: a read in flight may be older than it, so whoever asks that read from now on gets one that runs after it
  readsOutdated() {
    this.joinedReads.forEach((t) => t.heardEvent());
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = bn;
    }
  }
  watch(t) {
    this.watcher = t;
  }
  onWrite(t) {
    this.written = t;
  }
  onBlocked(t) {
    this.refused = t;
  }
  async reach(t, n, a, s, o, l = {}) {
    const r = a instanceof FormData, i = { method: t, headers: { ...wn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: _c(a) }, c = s || (r ? wc : yn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Ze }], c)) : await this.sent(n, i, [{ window: st, line: n, kind: Tt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, kc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = bn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Sc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: st, line: t, kind: Ze }], yn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: wn });
    if (!n.ok) throw Ka(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, bn, o).then((r) => (this.written(n), r)) : ul() && !Mc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: Ac }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Js, { cache: "no-store" }, [{ window: st, line: Js, kind: Ze }], $c);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = yn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Ze : Tt;
    return l === Tt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ua = Symbol.for("journal.transport"), Me = globalThis[ua] ?? (globalThis[ua] = new Cc());
class Oc {
  constructor() {
    this.following = Ke([]), this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, a, s = () => !0) {
    const o = { window: t, patterns: n, heard: a, visible: s };
    return this.following.value = [...this.follows, o], () => this.following.value = this.follows.filter((l) => l !== o);
  }
  get follows() {
    return this.following.value;
  }
  get patterns() {
    return [...new Set(this.follows.flatMap((t) => t.patterns))].sort();
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.following.value = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    Me.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => vs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function vs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Tc = 50, Rc = "refresh", Ic = 1e3, Bc = "requested", Lc = "after_window", Nc = 50, da = ".*", Dc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function jc(e) {
  const t = {}, n = Yn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null };
  let l = {}, r = 0;
  function i(O) {
    const w = () => l[O] ?? {}, R = L(void 0), b = ll(e, async (A) => {
      const $ = await f(O, A);
      return $.ok && !Object.keys(A).length && (R.value = $.value), $;
    }, () => w().page_size || Nc, () => !!w().page_size, () => !!w().reads_ids);
    return t[O] = { ...b, data: R, readAt: 0 };
  }
  const c = new Proxy({}, { get: (O, w) => typeof w != "string" || w.startsWith("__v") ? void 0 : t[w] ?? i(w) }), d = (O) => (l[O].loading !== Bc || O.endsWith(da)) && (!l[O].tab || l[O].tab === n.tab);
  function f(O, w = {}) {
    return new Promise((R) => {
      a.push({ name: O, flags: w, resolve: R }), a.length === 1 && setTimeout(m);
    });
  }
  async function m() {
    const O = /* @__PURE__ */ new Map(), w = a.splice(0).filter((A) => {
      const $ = JSON.stringify(A.flags);
      return O.has(A.name) || O.set(A.name, $), O.get(A.name) === $ ? !0 : (a.push(A), !1);
    });
    a.length && setTimeout(m);
    const R = Object.fromEntries(w.flatMap(({ name: A, flags: $ }) => Object.entries($).map(([N, _]) => [`${A}.${N}`, _]))), b = await e.readKeys({ only: [...new Set(w.map(({ name: A }) => A))], state: { ...n, ...R } });
    w.forEach(({ name: A, resolve: $ }) => $(b.ok ? b.value.keys[A] : b));
  }
  async function g(O) {
    const w = await e.readKeys({ only: O, state: { ...n } });
    return w.ok ? (F(w.value.declared), Object.entries(w.value.keys).forEach(([R, b]) => {
      c[R].readAt = Date.now(), b.ok && (c[R].data.value = b.value), c[R].showFirst(b);
    }), !0) : (w.failure !== "cancelled" && (O.length ? O : Object.keys(t)).forEach((R) => c[R].showFirst(w)), !1);
  }
  function v(O) {
    const w = Dc(O);
    return w.length ? (w.forEach((R) => o.names.add(R)), o.answer ?? (o.answer = new Promise((R) => setTimeout(() => {
      const b = [...o.names];
      o.names.clear(), o.answer = null, R(g(b));
    })))) : g([]);
  }
  function x(O) {
    O.forEach((w) => s.add(w)), clearTimeout(r), r = setTimeout(() => {
      const w = [...s];
      s.clear(), w.length && g(w);
    }, Tc);
  }
  const M = (O) => O.endsWith(da) ? Object.keys(t).filter((w) => w.startsWith(O.slice(0, -1)) && t[w].readAt) : [O];
  function B(O) {
    const w = Object.keys(l).filter((b) => O.event === Rc || l[b].events.some((A) => vs(A, O.event)));
    w.filter((b) => l[b].page_size).forEach((b) => c[b].heard(O));
    const R = w.filter((b) => !l[b].page_size);
    R.filter((b) => !d(b)).forEach((b) => c[b].readAt = 0), x(R.filter(d).flatMap(M));
  }
  function F(O) {
    if (Object.keys(l).length) return;
    l = O;
    const w = [...new Set(Object.values(O).flatMap((b) => b.events))];
    w.length && e.follow(w, B);
    const R = Object.keys(O).filter((b) => O[b].loading === Lc);
    R.length && g(R);
  }
  fe(() => n.tab, () => {
    const O = Object.keys(l).filter((w) => !w.endsWith(da) && d(w) && !c[w].readAt);
    O.length && g(O);
  }), Be(() => clearTimeout(r));
  function J() {
    const O = Date.now(), w = Object.keys(l).filter((R) => l[R].reload_seconds > 0 && d(R) && O - c[R].readAt >= l[R].reload_seconds * 1e3);
    w.length && x(w.flatMap(M));
  }
  return gs(J, () => e.visible.value, Ic), queueMicrotask(() => g([])), { props: c, state: n, reload: v, readKey: f };
}
const Pc = Symbol("open-view"), Le = Symbol.for("journal.window-context"), pl = Symbol("dock-card");
function qc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = jc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function We() {
  const e = Oe(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return qc(e);
}
const Fc = (e, t) => e(pl, t), z5 = () => Oe(pl), Wc = ["stroke-width", "innerHTML"], ye = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const t = e, n = { right: 0, down: 90, left: 180, up: 270 }, a = {
      mail: "inbox",
      circle: "todos",
      play: "work",
      flag: "plan",
      file: "docs",
      report: "reports",
      pin: "pins",
      list: "rules",
      clock: "reminders",
      help: "questions",
      bubble: "inbox",
      wrench: "tools",
      brush: "style",
      band: "rules",
      smile: "smile",
      bot: "agents",
      panel: "activity",
      x: "close",
      check: "todos",
      clip: "paperclip",
      send: "arrow",
      more: "dots",
      chevron: "arrow"
    }, s = {
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      key: '<circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5 13 3M10.8 5.2l1.7 1.7M9.2 6.8l1.2 1.2"/>',
      terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
      trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
      chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
      edits: '<path d="M8 3v6M5 6h6M5 12.5h6"/>',
      gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
      hook: '<path d="M8 2v7.6a2.9 2.9 0 1 1-2.9-2.9"/><circle cx="8" cy="2.6" r=".7" fill="currentColor"/>',
      request: '<path d="M3 5.2h9.4M10 2.9l2.4 2.3L10 7.5"/><path d="M13 10.8H3.6M6 8.5l-2.4 2.3L6 13.1"/>',
      heart: '<path d="M8 13.2 3.2 8.4a2.9 2.9 0 0 1 4.1-4.1L8 5l.7-.7a2.9 2.9 0 0 1 4.1 4.1z"/>',
      weight: '<path d="M2.5 13.5h11l-1.6-7.5H4.1zM6 6a2 2 0 1 1 4 0"/>',
      points: '<path d="M3 13.2V8.6M6.7 13.2V5.4M10.4 13.2V9.8M14 13.2V2.8" stroke-linecap="round"/>',
      bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
      bulb: '<path d="M5.4 9.9a4.3 4.3 0 1 1 5.2 0c-.45.35-.7.85-.7 1.4v.2H6.1v-.2c0-.55-.25-1.05-.7-1.4Z"/><path d="M6.3 13.5h3.4"/>',
      todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
      task: '<rect x="3.5" y="2.5" width="9" height="11.5" rx="1.4"/><path d="M6.2 2.5V1.6h3.6v.9M5.8 6.4h4.4M5.8 8.9h4.4M5.8 11.4h2.6"/>',
      pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
      style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
      warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
      book: '<path d="M8 4.4c-1.7-1.2-3.8-1.5-6-.9v9c2.2-.6 4.3-.3 6 .9 1.7-1.2 3.8-1.5 6-.9v-9c-2.2-.6-4.3-.3-6 .9Z"/><path d="M8 4.4v9"/>',
      auto: '<path d="M5 3.4 12.4 8 5 12.6z" fill="currentColor" stroke-width="1"/>',
      branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
      scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
      wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
      narrow: '<path d="M2.6 6.2h3.6V2.6M13.4 6.2H9.8V2.6M2.6 9.8h3.6v3.6M13.4 9.8H9.8v3.6"/>',
      up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
      down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
      board: '<rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><rect x="3.6" y="4.4" width="2.4" height="4" rx=".5" fill="currentColor" stroke="none"/><rect x="3.6" y="9.4" width="2.4" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="6.8" y="4.4" width="2.4" height="5.6" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="4.4" width="2.4" height="2.4" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="7.8" width="2.4" height="3.2" rx=".5" fill="currentColor" stroke="none"/>',
      ticket: '<path d="M2.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1.75a1.75 1.75 0 0 0 0 3.5v1.75a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9.75a1.75 1.75 0 0 0 0-3.5z"/><path d="M6.5 5v1M6.5 7.5v1M6.5 10v1"/>',
      download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
      upload: '<path d="M8 10V2.5M5 5.5l3-3 3 3"/><path d="M3 11v2h10v-2"/>',
      open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
      sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
      columns: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 3v10"/>',
      rows: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 8h11"/>',
      tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
      float: '<rect x="5.5" y="5.5" width="8" height="7.5" rx="1"/><path d="M2.5 10.5V3h8"/>',
      minimize: '<path d="M4 8h8"/>',
      chapters: '<path d="M2.5 4h6M2.5 8h11M2.5 12h8"/><path d="M11 2.2v3.6l1.2-.9 1.2.9V2.2"/>',
      reply: '<path d="M6.5 4.2 3 7.6l3.5 3.4"/><path d="M3.4 7.6h5.4a4 4 0 0 1 4 4v1.2"/>',
      copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 3.8V3.6A1.6 1.6 0 0 0 8.9 2H4.1A1.6 1.6 0 0 0 2.5 3.6v4.8A1.6 1.6 0 0 0 4.1 10h.2"/>',
      broadcast: '<circle cx="8" cy="8" r="1.3"/><path d="M5.4 5.2a4 4 0 0 0 0 5.6"/><path d="M10.6 5.2a4 4 0 0 1 0 5.6"/><path d="M3.2 2.9a7 7 0 0 0 0 10.2"/><path d="M12.8 2.9a7 7 0 0 1 0 10.2"/>',
      artboard: '<path d="M5 2.5v11M11 2.5v11M2.5 5h11M2.5 11h11"/>',
      webpage: '<rect x="2.5" y="3" width="11" height="10" rx="1.6"/><path d="M2.5 5.8h11M5 8.6h6M5 10.6h3.6"/>',
      pull: '<circle cx="4.5" cy="3.8" r="1.5"/><circle cx="4.5" cy="12.2" r="1.5"/><circle cx="11.5" cy="12.2" r="1.5"/><path d="M4.5 5.3v5.4M11.5 10.7V7.2a2.2 2.2 0 0 0-2.2-2.2H7.4M8.8 3.4 7.2 5l1.6 1.6"/>',
      window: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/>',
      dock: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 5.5V10M5.8 7.8 8 10l2.2-2.2"/>',
      restore: '<path d="M3 8a5 5 0 1 0 1.5-3.55"/><path d="M3 2.75V5h2.25"/>',
      caret: '<path d="M5 6.5l3 3 3-3"/>',
      share: '<path d="M5.5 6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-1"/><path d="M8 9.5V2M5.75 4.25L8 2l2.25 2.25"/>',
      floppy: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h6.4L13 5.1v6.4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z"/><path d="M5.5 3v3h4.5V3"/><rect x="5" y="8.5" width="6" height="4.5" rx="0.6"/>',
      saveinto: '<path d="M5.5 3H4a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 4 13h8a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12 3h-1.5"/><path d="M8 1.75v6.5M5.75 6l2.25 2.25L10.25 6"/><path d="M5 10.75h6"/>',
      tiles: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
      palette: '<path d="M8 2.5a5.5 5.5 0 1 0 0 11c.8 0 1.2-.5 1.2-1.1 0-.9-.8-1.2-.8-2 0-.6.5-1 1.1-1h1.6a2.4 2.4 0 0 0 2.4-2.4C13.5 4.6 11.1 2.5 8 2.5z"/><circle cx="5.3" cy="7.2" r=".6"/><circle cx="7.4" cy="5.1" r=".6"/><circle cx="10.2" cy="5.4" r=".6"/>',
      pause: '<path d="M5.8 4v8M10.2 4v8"/>',
      stop: '<path d="M4.5 4.5h7v7h-7z"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      resume: '<path d="M5.5 3.8v8.4L12.2 8z"/>',
      tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
      ring: '<circle cx="8" cy="8" r="5.25" stroke-width="2"/>',
      checkbox: '<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.5"/><path d="M5.4 8.1l1.8 1.8 3.5-3.7"/>',
      layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
      info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
      bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
      activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
      arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
      chevronRight: '<path d="M6 3 11 8 6 13"/>',
      back: '<path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/>',
      paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
      crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
      camera: '<path d="M2 5.5h2.6l1.2-1.8h4.4l1.2 1.8H14v7.5H2z"/><circle cx="8" cy="9" r="2.3"/>',
      wheel: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="1.6"/><path d="M8 2.4v4M8 9.6v4M2.4 8h4M9.6 8h4"/>',
      model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
      agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
      reviewer: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/><path d="M5 7.1l1.4 1.4 2.6-2.8"/>',
      verifier: '<path d="M8 1.8v1.4"/><path d="M5.5 3.2h5"/><path d="M5 4.6h6v7.4H5z"/><path d="M4.5 13.6h7"/><path d="M8 6.9c.9.9 1.2 1.6 1.2 2.3a1.2 1.2 0 0 1-2.4 0c0-.7.3-1.4 1.2-2.3z"/>',
      reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
      work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
      reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
      pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
      revisions: '<path d="M5.2 4.4h7v9.8h-7z"/><path d="M3.4 11.8V2.2h6.4"/><path d="M7 7.4h3.4M7 10h3.4"/>',
      docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
      rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
      folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
      inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
      questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
      home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
      close: '<path d="M4 4l8 8M12 4l-8 8"/>',
      plus: '<path d="M8 3.5v9M3.5 8h9"/>',
      minus: '<path d="M3.5 8h9"/>',
      power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
      people: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
      lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
      plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
      tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
      plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
      search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
      settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
      smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
      dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
      "dots-vertical": '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (o, l) => (u(), h("svg", {
      class: "ico",
      style: ge({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...t.facing === "right" ? {} : { transform: `rotate(${n[t.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: s[a[e.name] || e.name] || s.dot
    }, null, 12, Wc));
  }
}, Hc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, zc = /* @__PURE__ */ Y(Hc, [["__scopeId", "data-v-37ba86f3"]]), Uc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "Btn",
  props: {
    variant: { type: String, default: "ghost" },
    small: Boolean,
    large: Boolean,
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
    bordered: Boolean,
    href: { type: String, default: "" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = Jn(), a = I(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = L(!1), o = I(() => t.busy || s.value), l = Oe(Le, null), r = I(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(c) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(c)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, il);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (c, d) => (u(), H(ht(e.href ? "a" : "button"), Fe(a.value, {
      type: e.href ? void 0 : P(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: q(() => [
        y("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : C("", !0),
          ue(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), H(zc, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ Y(Uc, [["__scopeId", "data-v-7068e4e1"]]), Vc = ["aria-checked", "aria-haspopup", "onClick"], Gc = {
  key: 0,
  class: "segmented-dot"
}, Kc = {
  key: 1,
  class: "segmented-note"
}, Yc = {
  key: 2,
  class: "segmented-count"
}, Jc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = fs();
    return (s, o) => {
      const l = di("tip");
      return u(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), h(G, null, ee(e.options, (r) => tt((u(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (u(), h("span", Gc)) : C("", !0),
          te(" " + k(r.label) + " ", 1),
          r.note ? (u(), h("small", Kc, k(r.note), 1)) : C("", !0),
          r.count !== void 0 ? (u(), h("em", Yc, k(r.count), 1)) : C("", !0)
        ], 10, Vc)), [
          [l, r.tip || r.title, `${P(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, rn = /* @__PURE__ */ Y(Jc, [["__scopeId", "data-v-7d0b33ab"]]), Zc = {
  key: 0,
  class: "more-items"
}, Xc = {
  key: 0,
  role: "alert"
}, Qc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), h("div", Zc, [
      e.failure ? (u(), h("p", Xc, k(e.failure), 1)) : C("", !0),
      e.more ? (u(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: q(() => [
          te(k(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : C("", !0)
    ])) : C("", !0);
  }
}, Zn = /* @__PURE__ */ Y(Qc, [["__scopeId", "data-v-5355e7f5"]]), eu = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, tu = ["disabled", "onClick"], nu = { class: "title" }, au = { class: "relations" }, su = { key: 1 }, ou = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    changes: { type: Number, default: 0 },
    outsidePlan: Boolean,
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L([]), o = L({}), l = L(0), r = L(""), i = L(null), c = L(!1), d = L("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (b) => m[b] || `${b.replaceAll("_", " ").replace(/^./, (A) => A.toUpperCase())}s`, v = I(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((b, A) => b + A, 0) },
      ...Object.entries(o.value).map(([b, A]) => ({ key: b, label: g(b), count: A }))
    ]), x = (b) => b.endpoint.unavailable || !b.endpoint.open_ref, M = (b) => ({ [n.linkAttribute]: !0, "data-link-model": b.endpoint.model, "data-link-id": b.endpoint.id }), B = (b) => `${b.endpoint.model === "doc" && b.endpoint.id === n.documentId ? "Design document" : b.endpoint.model.replaceAll("_", " ").replace(/^./, (A) => A.toUpperCase())} ${b.endpoint.id}, ${b.relations.map((A) => A.replaceAll("_", " ")).join(", ")}`;
    async function F(b = 1) {
      const A = ++f;
      c.value = !0, d.value = "";
      const $ = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(b), "--page-size", String(n.pageSize)];
      n.outsidePlan && $.push("--outside-plan"), n.documentId && $.push("--first-counterpart", `doc:${n.documentId}`), r.value && $.push("--kind", r.value);
      try {
        const N = await n.read($);
        if (A !== f) return;
        if (!N.ok) {
          d.value = N.error;
          return;
        }
        const _ = N.value.counterparts ?? [], p = b === 1 ? _ : [...s.value, ..._];
        s.value = [...new Map(p.map((S) => [`${S.endpoint.model}:${S.endpoint.id}`, S])).values()], o.value = N.value.kinds ?? {}, l.value = N.value.total, i.value = N.value.next_page ?? null;
      } catch (N) {
        A === f && (d.value = N.message);
      } finally {
        A === f && (c.value = !1);
      }
    }
    function J(b) {
      if (x(b)) return;
      const [A, $] = b.endpoint.open_ref.split(":");
      a("open", { table: A, id: Number($) });
    }
    function O(b) {
      r.value = b, F();
    }
    const w = () => !c.value && i.value && F(i.value), R = I(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return fe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", F();
    }, { immediate: !0 }), (b, A) => s.value.length || c.value || d.value || e.empty ? (u(), h("section", eu, [
      v.value.length > 2 ? (u(), H(rn, {
        key: 0,
        options: v.value,
        value: r.value,
        wrap: "",
        onPick: O
      }, null, 8, ["options", "value"])) : C("", !0),
      (u(!0), h(G, null, ee(s.value, ($) => (u(), h("button", Fe({
        key: `${$.endpoint.model}:${$.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, M($), {
        disabled: x($),
        onClick: (N) => J($)
      }), [
        y("span", nu, k($.endpoint.title), 1),
        y("span", au, [
          te(k(B($)), 1),
          x($) ? (u(), h(G, { key: 0 }, [
            te(" · Unavailable")
          ], 64)) : C("", !0)
        ])
      ], 16, tu))), 128)),
      !s.value.length && !c.value && !d.value && e.empty ? (u(), h("p", su, k(e.empty), 1)) : C("", !0),
      D(Zn, {
        more: !!i.value,
        loading: c.value,
        failure: d.value,
        label: R.value,
        onMore: w
      }, null, 8, ["more", "loading", "failure", "label"])
    ])) : C("", !0);
  }
}, lu = /* @__PURE__ */ Y(ou, [["__scopeId", "data-v-bf716809"]]), ru = (e, t, n) => Math.max(t, Math.min(n, e)), iu = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, gl = /* @__PURE__ */ new WeakMap(), cu = (e, t) => gl.set(e, t);
function uu(e, t) {
  for (let n = t; n; n = gl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function vl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !uu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ct = 8, du = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    align: { type: String, default: "auto" },
    minWidth: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    gap: { type: Number, default: 4 },
    height: { type: Number, default: 0 },
    plain: Boolean
  },
  emits: ["close"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = L(null), o = (p) => p ? `${p}px` : void 0, l = I(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = L({ w: 0, h: 0 }), i = L(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const S = p.closest(".pane, .float-window");
      return S ? d(S.getBoundingClientRect()) : c();
    }, m = (p, S) => `${Math.max(0, p ? Math.min(p, S) : S)}px`;
    function g(p, S) {
      return {
        below: p.bottom - S.bottom - a.gap - Ct,
        above: S.top - p.top - a.gap - Ct,
        across: p.right - p.left - 2 * Ct
      };
    }
    function v(p) {
      const S = f(a.anchor), E = g(S, p);
      return r.value.w <= E.across && r.value.h <= Math.max(E.below, E.above) ? S : c();
    }
    const x = I(() => {
      if (!i.value) return l.value;
      const p = i.value, S = v(p), E = g(S, p), { w: T, h: j } = r.value, X = a.align === "auto" ? p.left + p.right > S.left + S.right : a.align === "right", ne = ru(X ? p.right - T : p.left, S.left + Ct, Math.max(S.left + Ct, S.right - T - Ct)), he = j > E.below && E.above > E.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, E.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, E.below) };
      return { ...l.value, ...he, left: `${ne}px`, maxWidth: m(a.maxWidth, E.across) };
    }), M = n, B = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function F(p) {
      const S = B(), E = S.indexOf(document.activeElement);
      S[(E + p + S.length) % S.length].focus();
    }
    const J = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => M("close") }, O = (p) => J[p.key] && (p.preventDefault(), J[p.key]()), w = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let R = 0;
    const b = new ResizeObserver(() => {
      cancelAnimationFrame(R), R = requestAnimationFrame(w);
    });
    vl(s, (p) => a.anchor && !a.anchor.contains(p.target) && M("close"));
    const A = (p, S) => ["top", "left", "right", "bottom"].some((E) => Math.abs(p[E] - S[E]) > 1), $ = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let N = 0;
    function _() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || $(p)) return M("close");
        A(p, i.value) && (i.value = p);
      }
      N = requestAnimationFrame(_);
    }
    return Re(() => {
      a.anchor && s.value && cu(s.value, a.anchor), w(), s.value && b.observe(s.value), !a.plain && B()[0] && B()[0].focus(), _();
    }), Be(() => {
      b.disconnect(), cancelAnimationFrame(N), cancelAnimationFrame(R);
    }), t({ element: s }), (p, S) => (u(), H(hs, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", Fe({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: x.value,
        onKeydown: O
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Xn = /* @__PURE__ */ Y(du, [["__scopeId", "data-v-7f046e0d"]]), fu = { class: "split-button" }, hu = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = L(null), s = L(!1), o = () => s.value = !1;
    return (l, r) => (u(), h("span", fu, [
      D(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: q(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      y("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        D(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: q(() => [
            D(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), H(Xn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: q(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : C("", !0)
    ]));
  }
}, mu = /* @__PURE__ */ Y(hu, [["__scopeId", "data-v-9908ef1d"]]), pu = 0, gu = "/api/lines", vu = "/api/line", Xs = 5e3, Qs = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), eo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), fa = (e) => JSON.stringify(e.line), to = () => new DOMException("cancelled", "AbortError");
class yu {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(fa(t))) {
        Me.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Tt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), pu));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(to())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(to()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(gu, Qs({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => eo(r.body, Ze)), Xs);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Me.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, Ze), Date.now() - n < Xs ? this.slow.delete(fa(t.body)) : this.slow.add(fa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(vu, Qs(t.body, t.signal), [eo(t.body, n)], n === Ze ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const yl = new yu(), bu = "/api/window";
function wu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${bu}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: r }, [{ window: e, line: l, kind: Ze }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const bl = /* @__PURE__ */ new Map();
class ku {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ke({ buttons: [], missing: {} }), this.loading = Ke(!1), this.loaded = Ke(!1), this.failed = Ke(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Me.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
    if (t.status === 403) return { buttons: [], missing: {} };
    const n = await t.json();
    if (!t.ok) throw new Error(n.error || "Buttons could not be loaded.");
    return n;
  }
  heard(t) {
    var s;
    const n = (s = t.data) == null ? void 0 : s.key, a = t.event.startsWith("setting.") && (!n || n.includes("suite"));
    return t.event === "registry.sync" || a ? this.load() : Promise.resolve();
  }
  async allowed(t) {
    var s;
    await this.load();
    const n = this.offers.value.missing[t];
    return n != null && n.length ? await this.prompts.ask(t, {
      window: `button:${t}`,
      reads_missing: "",
      runs_missing: n.map(({ label: o, line: l }) => `${o}: ${l}`).join(", ")
    }) ? (await this.load(), !((s = this.offers.value.missing[t]) != null && s.length)) : !1 : !0;
  }
}
function U5(e, t) {
  const n = new ku(e, t);
  return bl.set(e, n), n.load().catch(() => {
  }), n;
}
const ys = (e) => bl.get(e);
function xu(e, t, n) {
  const a = ys(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function $u(e, t) {
  if (!e) return !0;
  const n = ys(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Mu = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let wl = {};
async function V5(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (wl = (await t.json()).states);
}
const bs = (e, t) => {
  var n;
  return (n = wl[e]) == null ? void 0 : n[t];
}, kl = (e, t) => {
  var n;
  return ((n = bs(e, t)) == null ? void 0 : n.label) ?? Mu(t);
}, xl = (e, t) => {
  var n;
  return ((n = bs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Su = (e, t) => {
  var n;
  return ((n = bs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, _u = Symbol("pane-page"), Eu = Symbol("inspector-host"), $l = { 1: "refused", 2: "usage", 3: "fault" }, Au = 100, Cu = 50, Ou = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Tu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Ru({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = L({}), declared: c = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: g = [], sources: v = [], links: x = {}, search: M = {}, readOnly: B = !1, shared: F = null }) {
  const J = /* @__PURE__ */ new Map(), O = new AbortController(), w = L(!1), R = performance.now();
  let b = 0, A = 0, $ = () => {
  };
  const N = new Promise((j) => $ = j);
  O.signal.addEventListener("abort", $, { once: !0 });
  const _ = () => {
    clearTimeout(A), A = setTimeout(() => {
      b === 0 && ps(R, () => {
        w.value = !0, $();
      });
    }, Cu);
  }, p = (j, X) => (b += 1, Rt(e, j, t, O.signal, X).finally(() => {
    b -= 1, _();
  })), S = (j, X) => (_(), N.then(() => O.signal.aborted ? nt : Rt(e, j, t, O.signal, X))), E = ({ only: j = [], state: X = {} } = {}) => (b += 1, Bu(() => wu(e, t, j, X, O.signal), O.signal).finally(() => {
    b -= 1, _();
  })), T = (j, { unbatched: X = !1, deferred: ne = !1 } = {}) => {
    const ie = J.get(j);
    if (ie && performance.now() - ie.at < Au) return ie.answer;
    const he = ne && !w.value ? S(j, X) : p(j, X);
    return J.set(j, { answer: he, at: performance.now() }), he;
  };
  return {
    answered: w,
    settle: _,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: I(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: g,
    sources: v,
    links: x,
    search: M,
    readOnly: B,
    shared: F,
    read: T,
    readKeys: E,
    run: (j) => Rt(e, j, t, O.signal),
    upload: (j) => Nu(j, e, O.signal),
    cancel: () => O.abort(),
    signal: O.signal,
    subscriptions: l,
    follow: (j, X) => l.follow(e, [j].flat().filter((ne) => o.some((ie) => vs(ie, ne))), (ne) => {
      J.clear(), X(ne);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (j) => I(() => {
      var X;
      return i.value[j] ?? ((X = c.find((ne) => ne.key === j)) == null ? void 0 : X.default);
    }),
    setting: async (j, X) => {
      const ne = await T(`window setting ${e} ${j}`);
      return ne.ok ? ne.value.value : X;
    },
    setOption: f,
    keep: (j, X) => Rt(e, ["window", "save-setting", e, j, JSON.stringify(X)], t, O.signal)
  };
}
function Ml(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nt = { ok: !1, failure: "cancelled", error: "" }, ws = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Sl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? nt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: $l[n.code] || "fault", error: Ml(n.error) };
  } catch {
    return t != null && t.aborted ? nt : { ok: !1, failure: "unreachable", error: ws };
  }
}
const Iu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: $l[e.code] || "fault", error: Ml(e.error) };
async function Bu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Iu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: ws };
  }
}
async function _l(e, t, n) {
  const a = await Sl(() => yl.read(e, t, n), t);
  return a.failure !== "unreachable" || !ul() ? a : (await fc(), t.aborted ? nt : _l(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => Lu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : ks(t)));
}
async function Lu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ks(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => _l({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : Sl(() => yl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Nu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: ws };
  }
}
function ks(e) {
  return [...e.matchAll(Ou)].map(([t]) => t.replace(Tu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Du = (e) => `show-${e}`, G5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Du((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), El = "messages.chat", ju = {
  key: 0,
  class: "template-brief"
}, Pu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, qu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L([]), o = L(""), l = I(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), r = I(() => s.value.find((c) => String(c.id) === n.value));
    async function i() {
      const c = await Rt(El, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (c, d) => (u(), h(G, null, [
      D(rn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (u(), h("p", ju, k(r.value.brief), 1)) : C("", !0),
      o.value ? (u(), h("p", Pu, k(o.value), 1)) : C("", !0)
    ], 64));
  }
}, Fu = /* @__PURE__ */ Y(qu, [["__scopeId", "data-v-8c3f5d57"]]), Wu = { class: "form-field" }, Hu = { class: "form-field-head" }, zu = ["for"], Uu = {
  key: 0,
  class: "form-field-aside"
}, Vu = {
  key: 0,
  class: "form-field-help"
}, Gu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), h("div", Wu, [
      y("div", Hu, [
        y("label", {
          class: "form-field-label",
          for: t.$props.for
        }, k(e.label), 9, zu),
        t.$slots.aside ? (u(), h("span", Uu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (u(), h("p", Vu, k(e.help), 1)) : C("", !0)
    ]));
  }
}, Ku = /* @__PURE__ */ Y(Gu, [["__scopeId", "data-v-8f255b8f"]]), Ya = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Yu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Jn(), n = I(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => tt((u(), h("textarea", Fe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [P(Ya), P(t).value]
    ]);
  }
}), Ju = /* @__PURE__ */ Y(Yu, [["__scopeId", "data-v-11521837"]]), Zu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = fs(), o = I(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (u(), H(Ku, {
      label: e.field.label,
      for: P(s),
      "data-button-field": e.field.name
    }, {
      default: q(() => [
        D(jt, { value: o.value }, {
          choice: q(() => [
            D(rn, {
              id: P(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: q(() => [
            D(Fu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: q(() => [
            D(Ju, {
              id: P(s),
              value: e.value,
              onInput: r[2] || (r[2] = (i) => a("pick", i.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, xs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), H(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: q(() => [
        D(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Xu(e, t, n, a = () => window) {
  Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Qu = (e, t = () => !0) => Xu("keydown", (n) => n.key === "Escape" && t() && e());
function Al(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = L(!1), s = I(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Qu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const ed = 80, Ot = Yn([]);
function Cl(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return fe(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), I(() => ed + Math.max(0, Ot.indexOf(t)));
}
let Ol = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Ol = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const td = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function nd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(td)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Re(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Ol, document.addEventListener("keydown", s), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const ad = ["aria-modal", "aria-label", "aria-labelledby"], sd = {
  key: 0,
  class: "dialog-head"
}, od = ["id", "tabindex"], ld = {
  key: 1,
  class: "dialog-foot"
}, rd = 500, id = 400, cd = {
  __name: "Dialog",
  props: {
    title: { type: String, default: "" },
    follow: { type: Boolean, default: !1 },
    fits: Boolean,
    wide: Boolean,
    small: Boolean,
    tall: Boolean,
    large: Boolean,
    bare: Boolean,
    open: { type: Boolean, default: null },
    closable: { type: Boolean, default: !0 },
    modal: Boolean,
    sheet: Boolean
  },
  emits: ["close", "dismiss", "escape"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Al(a, n), r = Cl(s), i = L(null), c = L(null), d = L(null), f = fs(), m = L(!1), g = Date.now();
    n.modal && nd(c, () => a("escape"), d);
    function v() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, id);
    }
    function x(F) {
      !n.modal || Date.now() - g >= rd || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const M = () => i.value && (i.value.scrollTop = i.value.scrollHeight), B = new MutationObserver(M);
    return fe(i, (F) => {
      B.disconnect(), F && n.follow && (B.observe(F, { childList: !0, subtree: !0, characterData: !0 }), M());
    }), Be(() => B.disconnect()), (F, J) => (u(), H(hs, { to: "body" }, [
      D(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: q(() => [
          P(s) ? (u(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: P(r) }),
            onClick: xe(v, ["self"])
          }, [
            y("section", {
              ref_key: "panel",
              ref: c,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? P(f) : void 0,
              onKeydownCapture: x
            }, [
              e.bare ? C("", !0) : (u(), h("header", sd, [
                y("h3", {
                  id: P(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, od),
                e.closable ? (u(), H(xs, {
                  key: 0,
                  onClick: P(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              y("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (u(), h("footer", ld, [
                ue(F.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, ad)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Tl = /* @__PURE__ */ Y(cd, [["__scopeId", "data-v-484a731f"]]), ud = (e, t, n = {}) => ks(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function cn(e, t, n, a = {}) {
  try {
    return await $u(e.module, n) ? Rt(El, ud(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const dd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, ha = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], be = (e, t, n, a = {}) => ({
  title: e,
  icon: t,
  abstract: n,
  view: "small",
  scope: "environment",
  in_sidebar: !1,
  listed_under: "",
  needs_attention: !1,
  lists_completed_unread: !1,
  nested: !1,
  takes_comments: !1,
  closed_first: !1,
  created_in_viewer: !1,
  listed_as_cards: !1,
  typed_as_title: !1,
  start_as_count: !1,
  exports: !1,
  labels: {},
  filters: [],
  ...a
}), Qn = {
  messages: be("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: be("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: be("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: ha
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ha
  }),
  reports: be("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: be("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: be("Document", "file", "What stays true about the project, catalogued for every session", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    exports: !0,
    start_as_count: !0
  }),
  memories: be("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: be("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: be("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: ha }),
  reactions: be("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: be("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: be("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: be("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: be("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: be("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: be("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: be("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: be("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: be("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: be("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: be("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: be("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: be("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
    view: "check",
    filters: [
      { key: "open", title: "Checks", shows: "open" },
      { key: "closed", title: "Waits", shows: "closed", empty: "No wait has a check." }
    ],
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0
  }),
  dumps: be("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: be("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: be("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, fd = ["secrets", "plugins"], Rl = Object.keys(Qn).filter((e) => !(rl && fd.includes(e)));
I(() => Rl.map((e) => ({ name: e, ...Qn[e] })));
const Pt = (e) => Qn[e], Il = new Map(Rl.flatMap((e) => [e, e.replace(/s$/, ""), Qn[e].title.toLowerCase()].map((t) => [t, e]))), ct = (e) => Il.get(String(e).toLowerCase()) || "", Bl = [...Il.keys()].sort((e, t) => t.length - e.length).join("|"), hd = {
  class: "button-form",
  "data-button-form": ""
}, md = {
  key: 0,
  class: "button-form-title"
}, pd = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, gd = { class: "button-form-actions" }, vd = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = L(!1), l = L(""), r = I(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = I(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Pt(ct(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await cn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (u(), H(Tl, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: q(() => {
        var m;
        return [
          y("div", hd, [
            (m = e.row) != null && m.title ? (u(), h("p", md, k(e.row.title), 1)) : C("", !0),
            (u(!0), h(G, null, ee(e.button.fields, (g) => (u(), H(Zu, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (v) => s.value[g.name] = v
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), h("p", pd, k(l.value), 1)) : C("", !0),
            y("div", gd, [
              D(de, {
                small: "",
                onClick: f[0] || (f[0] = (g) => a("close"))
              }, {
                default: q(() => [...f[2] || (f[2] = [
                  te("Cancel", -1)
                ])]),
                _: 1
              }),
              D(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: q(() => [...f[3] || (f[3] = [
                  te("Send", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "busy"])
            ])
          ])
        ];
      }),
      _: 1
    }, 8, ["title"]));
  }
}, yd = /* @__PURE__ */ Y(vd, [["__scopeId", "data-v-e77a3ca7"]]), bd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, wd = {
  key: 1,
  class: "menu-item-text"
}, kd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), h("span", bd, k(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (u(), h("span", wd, [
        y("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, k(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ Y(kd, [["__scopeId", "data-v-9c67fe37"]]), xd = ["aria-busy"], $d = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Md = {
  __name: "ButtonSlot",
  props: {
    name: { type: String, required: !0 },
    row: { type: Object, default: null },
    environment: { type: String, required: !0 },
    readOnly: Boolean,
    externalFailure: Boolean,
    objectName: { type: String, default: "" }
  },
  emits: ["done", "failure"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ys(n.environment)), o = I(
      () => {
        var v;
        return !n.readOnly && ((v = s.value) == null ? void 0 : v.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = I(() => {
      var v;
      return !n.readOnly && ((v = s.value) == null ? void 0 : v.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = I(() => n.readOnly ? [] : xu(n.environment, n.name, n.row)), c = L(null), d = L(""), f = L(!1), m = (v) => [v.from ? `From ${v.from}` : "", v.tip].filter(Boolean).join(" · ");
    async function g(v) {
      if (f.value || n.readOnly) return;
      if (v.fields.length) {
        c.value = v;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const x = await cn(v, n.row, n.environment);
      f.value = !1, d.value = x.ok ? "" : x.error;
      const M = v.label.toLowerCase() + (n.objectName && !v.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", x.ok ? "" : `Could not ${M}: ${x.error}`), x.ok && a("done");
    }
    return (v, x) => (u(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), h(G, { key: 0 }, [
        x[3] || (x[3] = y("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        D(de, {
          small: "",
          onClick: r
        }, {
          default: q(() => [...x[2] || (x[2] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? C("", !0) : (u(), h(G, { key: 1 }, [
        (u(!0), h(G, null, ee(i.value, (M) => (u(), h(G, {
          key: M.name
        }, [
          M.menu.length ? (u(), H(mu, {
            key: 0,
            small: "",
            variant: M.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": M.menu_label || "More ways",
            title: m(M),
            "data-button": M.name,
            onMain: (B) => g(M)
          }, {
            menu: q(({ close: B }) => [
              (u(!0), h(G, null, ee(M.menu, (F) => (u(), H(Mt, {
                key: F.label,
                description: F.description,
                onClick: (J) => (B(), g({ ...M, ...F, menu: [] }))
              }, {
                default: q(() => [
                  te(k(F.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: q(() => [
              te(k(M.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), H(de, {
            key: 1,
            small: "",
            variant: M.primary ? "primary" : "ghost",
            bordered: !M.primary,
            icon: M.icon,
            disabled: f.value,
            title: m(M),
            "data-button": M.name,
            onClick: (B) => g(M)
          }, {
            default: q(() => [
              te(k(M.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (u(), h("span", $d, k(d.value), 1)) : C("", !0),
        c.value && !e.readOnly ? (u(), H(yd, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: x[0] || (x[0] = (M) => c.value = null),
          onDone: x[1] || (x[1] = (M) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, xd));
  }
}, Sd = /* @__PURE__ */ Y(Md, [["__scopeId", "data-v-08a87e69"]]), _d = {
  class: "running",
  "data-running-command": ""
}, Ed = ["title"], Ad = {
  key: "idle",
  class: "running-idle"
}, Cd = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), h("span", _d, [
      D(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: q(() => [
          e.text ? (u(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, Ed)) : (u(), h("span", Ad, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, K5 = /* @__PURE__ */ Y(Cd, [["__scopeId", "data-v-8311b32c"]]), Od = ["aria-checked", "aria-label", "title"], Td = {
  key: 0,
  class: "switch-inner"
}, Rd = {
  key: 0,
  class: "switch-word"
}, Id = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("button", {
      type: "button",
      class: Z(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      y("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), h("span", Td, k(e.word), 1)) : C("", !0),
        s[1] || (s[1] = y("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), h("span", Rd, k(e.word), 1)) : C("", !0)
    ], 10, Od));
  }
}, Y5 = /* @__PURE__ */ Y(Id, [["__scopeId", "data-v-688091a6"]]);
function Ll(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Nn(e, t) {
  return Ll(() => localStorage, e, t);
}
function Nl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function $s(e, t) {
  return Nl(() => localStorage, e, t);
}
function Dl(e, t) {
  fe(t, (n) => $s(e, n), { deep: !0 });
}
function Bd(e, t) {
  return Ll(() => sessionStorage, e, t);
}
function Ld(e, t) {
  return Nl(() => sessionStorage, e, t);
}
const Dn = "journal.environment", jl = L(Bd(Dn, Nn(Dn, "")));
function Nd(e) {
  jl.value = e, Ld(Dn, e), $s(Dn, e);
}
const jn = L(location.hash), no = Ke(null), ao = { integrations: "mcp", library: "team" };
function Dd() {
  if (!no.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (ao[n]) {
    location.replace(`#/${[ao[n], ...a].join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash;
    return;
  }
  !n || no.value(n) || (Nd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  jn.value = location.hash, Dd();
});
const Ja = I(() => {
  const [e, t = ""] = jn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [c = "", d = "", f = ""] = r.split(":");
    return { table: c, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: jl.value,
    page: n,
    n: a ? /^\d+$/.test(a) ? Number(a) : a : 0,
    q: s.get("q") || "",
    sub: s.get("sub") || "",
    tab: s.get("tab") || "",
    plugin: s.get("plugin") || "",
    install: s.get("install") || "",
    line: Number(s.get("line") || 0),
    at: s.get("at") || "",
    stack: o,
    open: o[o.length - 1] || null
  };
}), Ms = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ms.page(e)}?open=${t}`
};
function jd(e = "", t = 0, n = "") {
  location.hash = Ms.page(e, t, n);
}
const Pd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Pl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Pd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function J5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function ql(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ja.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Pl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function qd(e, t, n, a = 0, s = "") {
  if (e === Ja.value.env) return ql(t, n, a, s);
  const o = Ja.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Pl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? qd(a, s, Number(o), 0, t) : ql(s, Number(o), 0, t);
}
function Fd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = Fd(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function Z5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Wd = { class: "inspector-part" }, Hd = { class: "inspector-part-title" }, zd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("section", Wd, [
      y("h4", Hd, k(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, X5 = /* @__PURE__ */ Y(zd, [["__scopeId", "data-v-426868e9"]]), Ud = {
  key: 1,
  class: "row-list-failure"
}, Vd = ["data-row"], Gd = {
  __name: "RowList",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    // what is empty, in the window's own terms, and under it the sentence that says what brings rows there
    empty: { type: String, required: !0 },
    hint: { type: String, default: "" },
    // whether a search or a filter is on: with it, and no row left, the list says nothing matches (`matches` names it in the window's words) and what to try, not that it is empty
    searching: Boolean,
    matches: { type: String, default: "Nothing matches" },
    loaded: { type: Boolean, required: !0 },
    // what the skeleton looks like while the first read is out: the shape of what is coming
    shape: { type: String, default: "rows" },
    // reads the next page behind the rows and says whether it found any; with none given the list has no pages
    older: { type: Function, default: null },
    // whether the server holds a page behind the rows, which is what shows the button to read it
    more: { type: Boolean, default: !0 },
    // how a row comes in and goes out, {enter, leave} each given the row's element and the call that ends it; with none given rows just appear
    arrival: { type: Object, default: null }
  },
  setup(e) {
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = L(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), h("p", Ud, k(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), H(Xt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: q(() => [
        te(k(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), h(G, { key: 3 }, [
      (u(), H(ht(e.arrival ? tl : "ul"), Fe(n.value, { class: "row-list" }), {
        default: q(() => [
          (u(!0), h(G, null, ee(e.rows, (r) => (u(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Vd))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : C("", !0)
    ], 64));
  }
}, Kd = /* @__PURE__ */ Y(Gd, [["__scopeId", "data-v-3eb1aa55"]]), Yd = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Jd = {
  key: 1,
  class: "agent-rows-note"
}, Zd = {
  key: 2,
  class: "agent-rows-note"
}, Xd = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Qd = ["data-agent-row", "onClick"], ef = { class: "agent-row-name" }, tf = { class: "agent-row-state" }, nf = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = I(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), h("div", Yd, [
      e.loaded ? e.failure ? (u(), h("p", Jd, k(e.failure), 1)) : e.rows.length ? (u(), h(G, { key: 3 }, [
        y("p", Xd, k(a.value) + " running", 1),
        (u(!0), h(G, null, ee(n.value, (l) => (u(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => P(qe)(`agents:${l.id}`)
        }, [
          y("span", ef, "#" + k(l.id) + " " + k(l.session), 1),
          y("span", tf, k(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Qd))), 128))
      ], 64)) : (u(), h("p", Zd, k(e.none), 1)) : (u(), H(_t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Q5 = /* @__PURE__ */ Y(nf, [["__scopeId", "data-v-7e3656dc"]]), af = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["badge", e.tone])
    }, k(e.text), 3));
  }
}, Fl = /* @__PURE__ */ Y(af, [["__scopeId", "data-v-6ef74765"]]), sf = ["aria-valuenow", "aria-valuemax"], of = {
  __name: "ProgressBar",
  props: {
    value: { type: Number, required: !0 },
    max: { type: Number, default: 100 },
    tone: { type: String, default: "" },
    least: { type: Number, default: 0 },
    thin: Boolean,
    busy: Boolean
  },
  setup(e) {
    const t = e, n = I(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (u(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      y("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, sf));
  }
}, lf = /* @__PURE__ */ Y(of, [["__scopeId", "data-v-5045237e"]]), rf = { class: "bars" }, cf = { class: "bar-name" }, uf = { class: "bar-value" }, df = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (u(), h("div", rf, [
      (u(!0), h(G, null, ee(e.items, (i, c) => (u(), H(ht(i.open ? "button" : "div"), {
        key: `${c}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: q(() => [
          y("span", cf, k(i.label), 1),
          D(lf, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          y("span", uf, k(i.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ff = /* @__PURE__ */ Y(df, [["__scopeId", "data-v-09485718"]]), hf = { class: "bars" }, mf = {
  key: 0,
  class: "bars-title"
}, pf = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", hf, [
      e.node.title ? (u(), h("span", mf, k(e.node.title), 1)) : C("", !0),
      D(ff, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, gf = /* @__PURE__ */ Y(pf, [["__scopeId", "data-v-a9861a72"]]), vf = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = I(() => n[a.node.type](a.node));
    return (l, r) => (u(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (u(!0), h(G, null, ee(e.node.children || [], (i, c) => (u(), H(nr, {
        key: c,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, On = /* @__PURE__ */ Y(vf, [["__scopeId", "data-v-2a5c17d3"]]), yf = {
  key: 0,
  class: "card-head"
}, bf = { class: "card-title" }, wf = {
  key: 0,
  class: "card-note"
}, kf = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), h("header", yf, [
        y("span", bf, k(e.node.title), 1),
        e.node.note ? (u(), h("span", wf, k(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      D(On, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, xf = /* @__PURE__ */ Y(kf, [["__scopeId", "data-v-bb0b3bdb"]]), $f = { processes: "process", memories: "memory", replies: "reply" }, Pn = (e) => ($f[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Za = [], Mf = 2e3, lt = /* @__PURE__ */ new Map(), Sf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, _f = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? Za.unshift(e) : Za.push(e), lt.clear();
}
function Wl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Ef = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Af = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Cf(e, t) {
  const n = [{ type: "text", text: et(e).replace(/\r\n/g, `
`) }];
  for (const a of Za)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function Qt(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Of(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Of(e) {
  return e.split(_f).map((t, n) => n % 2 ? t : t.replace(Sf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function so(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Tf = 24;
function Rf(e) {
  const [t, , ...n] = e, a = so(t), s = n.map(so), o = (i) => [a, ...s].some((c) => (c[i] ?? "").length > Tf) ? ' class="text-column"' : "", l = a.map((i, c) => `<th${o(c)}>${Qt(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((c, d) => `<td${o(d)}>${Qt(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Hl = /^\s*(?:[-*+]|\d+[.)])\s+/, Xa = /^\s*(\d+)[.)]\s/, oo = (e) => e.match(/^\s*/)[0].length;
function zl(e) {
  const t = e[0].match(Xa), n = oo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && oo(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Qt(o.text)}${o.nested.length ? zl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function If(e, t) {
  const n = Xa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Hl.test(e[s]) && Xa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const lo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ul(e) {
  const t = String(e || "").replace(/\r\n/g, `
`).split(`
`), n = [];
  let a = 0;
  for (; a < t.length; ) {
    const s = t[a];
    if (!s.trim()) {
      a += 1;
      continue;
    }
    if (/^(```|~~~)/.test(s)) {
      const r = t.findIndex((c, d) => d > a && /^(```|~~~)/.test(c)), i = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${Qt(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (lo(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Rf(t.slice(a, r))), a = r;
      continue;
    }
    if (Hl.test(s)) {
      const r = If(t, a);
      n.push(zl(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Ul(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !lo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${Qt(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Bf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Lf = (e) => e.type !== "text" && !Bf.test(e.html);
function Nf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Ul(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Lf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Df(e, t = { env: "" }) {
  const n = Af(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => Ef(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = Nf(Cf(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > Mf && lt.delete(lt.keys().next().value), o;
}
const ma = /* @__PURE__ */ new WeakMap();
function jf(e) {
  if (ma.has(e)) return ma.get(e);
  const t = fi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const f = s(c, d), m = e.read(`${Pn(c)} show ${d}`);
    n.set(f, m), m.then((g) => {
      n.get(f) === m && (n.delete(f), t.set(f, g.ok ? { ...g.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Pn(c).replace(/-/g, "_")}.*`], (d) => {
      const f = `${c}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const g = Number(m.slice(f.length));
        (!d.row_id || d.row_id === g) && o(c, g);
      }
    }));
  }
  function r(c, d) {
    l(c);
    const f = s(c, d);
    return !t.has(f) && !n.has(f) && o(c, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return ma.set(e, i), i;
}
function Vl() {
  const e = Oe(Le, null), t = e ? jf(e) : null;
  return (n, a = {}) => Df(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Gl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(Gl, (t, n, a, s) => s), Pf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), kn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, qf = /^Traceback \(most recent call last\):/m, Ff = 8;
function Kl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Ff).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Wf(e) {
  const t = [...e.matchAll(Pf)].map((a) => a.index);
  if (kn.lastIndex = 0, !t.length || !kn.test(e)) return null;
  kn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(kn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Kl(n), tail: "" } : null;
}
function Hf(e) {
  const t = qf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Kl([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = un(e), n = Hf(t) || Wf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const zf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Uf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Vf = /[\w\]]\(/, Gf = /^[\w$.[\]'"]+\s*=\s*[^=]/, Kf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Yf = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Jf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Zf = /[[({,]$/, Xf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Qf = /^(\t|\s{2,})\S/, eh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, th = /`[^`]+`/, nh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, ah = /[{}()[\];=<>$&|*\\@+^~%]/g, Yl = /^\s*(?:[-*+]|\d+[.)])\s/, sh = /^\s*>/, oh = /^\s*\|/, lh = 0.6, rh = 0.4, ih = 5, ch = 0.03, Jl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= ih && t.every((n) => nh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(ah) ?? []).length / e.length < ch;
}, pa = (e) => {
  const t = e.trim();
  return th.test(t) ? !1 : [zf, Uf, Vf, Gf, Kf, Yf, Jf, Zf, Xf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Qf.test(e) && !Yl.test(e) && !Jl(e);
};
function uh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Yl.test(t[0]) || t.every((o) => sh.test(o) || oh.test(o))) return "text";
  const n = t.filter((o) => !eh.test(o.trim()));
  if (t.length === 1) return !n.length || pa(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(pa).length, s = n.filter((o) => !pa(o) && Jl(o)).length;
  return a >= n.length * lh && s <= n.length * rh ? "code" : "text";
}
const Qa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", dh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", fh = `${Qa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, hh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", mh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", ro = {
  js: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: dh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: fh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: hh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: mh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, ph = {
  javascript: "js",
  mjs: "js",
  cjs: "js",
  ts: "js",
  typescript: "js",
  tsx: "js",
  jsx: "js",
  vue: "html",
  python: "py",
  cpp: "c",
  cc: "c",
  h: "c",
  hpp: "c",
  cs: "c",
  csharp: "c",
  java: "c",
  kt: "c",
  kotlin: "c",
  go: "c",
  golang: "c",
  rs: "c",
  rust: "c",
  swift: "c",
  scala: "c",
  dart: "c",
  bash: "sh",
  shell: "sh",
  zsh: "sh",
  fish: "sh",
  scss: "css",
  less: "css",
  htm: "html",
  xml: "html",
  yml: "yaml",
  markdown: "md"
};
function io(e, t, n) {
  return n && e.startsWith(n, t);
}
function gh(e, t) {
  const n = ro[ph[t] ?? t] || ro.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const c = e.indexOf(`
`, o), d = e.slice(o, c < 0 ? e.length : c);
      l(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), l("plain", c < 0 ? "" : `
`), o = c < 0 ? e.length : c + 1;
      continue;
    }
    if (io(e, o, n.line) || n.hash && r === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && io(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), d = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((c) => e.startsWith(c, o));
    if (i) {
      const c = e.indexOf(i, o + 3), d = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(r)) {
      let c = o + 1;
      for (; c < e.length && e[c] !== r && (r === "`" || e[c] !== `
`); ) c += e[c] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(c + 1)) ? "property" : "string", e.slice(o, c + 1)), o = c + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const c = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", c[0]), o += c[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(r)) {
      const c = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", c[0]), o += c[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const c = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + c)), o += c;
      continue;
    }
    l("plain", r), o += 1;
  }
  return s;
}
function vh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of gh(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? et(l) : `<span class="tok-${a}">${et(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function yh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const bh = 1500, co = /* @__PURE__ */ new WeakMap();
async function wh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await yh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(co.get(t)), co.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, bh)
  )));
}
typeof document < "u" && document.addEventListener("click", wh, !0);
const kh = /\n\s*\n/, xh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, $h = /^\s*(`{3,}|~{3,})\s*$/, Mh = /^\s{4,}\S/, Sh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, es = /^\s*(?:[-*+]|\d+[.)])\s/, Zl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, _h = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ss(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Eh(e) {
  const t = Ss(e.join(`
`));
  return (_h.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Ah = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Zl.test(t) && !es.test(t);
}, Ch = (e, t) => es.test(t) || es.test([...e].reverse().find((n) => n.trim()) || "");
function _s(e, t) {
  const n = t || Eh(e), a = vh(Ss(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Oh(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && $h.test(s));
  return a < 0 ? e.length : a;
}
function Th(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return _s(a.map(un), n ? n.toLowerCase() : "");
}
function Rh(e) {
  const t = e.split(kh).map((l) => ({ paragraph: l, type: uh(Ss(l).split(`
`)) })), n = [];
  let a = [];
  const s = () => {
    a.length && n.push({ type: "text", text: a.join(`

`) }), a = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let l = o;
    for (; l < t.length && t[l].type !== "text"; ) l += 1;
    const r = t.slice(o, l);
    if (r.some(({ type: i }) => i === "code") || r.length > 1) {
      s(), n.push(_s(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(un), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Ih(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Rh(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(xh);
    if (r) {
      const c = Oh(n, l, r[2]);
      o(), a.push(Th(n.slice(l + 1, c), r[1], r[3])), l = c + 1;
      continue;
    }
    const i = Ah(s) ? Sh : Mh;
    if (!t && i.test(n[l]) && !Ch(s, n[l])) {
      let c = l;
      for (; c < n.length && (i.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Zl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(_s([...d, ...n.slice(l, c)].map(un), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => Ih(e, t.document));
const qn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Xl = (e) => `${e.table}:${e.id}`, uo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ga = 80;
function fo(e) {
  return e.length <= ga ? e : `${e.slice(0, ga + 1).replace(/\s+\S*$/, "") || e.slice(0, ga)}…`;
}
const ho = {
  messages: (e) => fo(uo(e.text)),
  comments: (e) => fo(uo(e.text)),
  questions: (e) => e.text,
  memories: (e) => `${e.text} (weight ${e.weight})`,
  rules: (e) => e.text,
  reminders: (e) => e.text,
  environments: (e) => e.name,
  agents: (e) => e.session,
  workers: (e) => e.name,
  triggers: (e) => (e.phrases || []).join(", "),
  reactions: (e) => e.face,
  nudges: (e) => {
    var t;
    return ((t = e.data) == null ? void 0 : t.line) || "";
  },
  plugins: (e) => {
    var t;
    return ((t = e.manifest) == null ? void 0 : t.title) || e.name;
  },
  shares: (e) => `Share of ${e.target || "nothing"}`
}, Bh = (e) => (ho[e.table] ? ho[e.table](e) : e.title || "") || "", St = (e) => qn(e.created_at), Ql = (e) => qn(e.updated_at) || St(e), Lh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Nh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Dh(e) {
  const t = Lh.exec(e);
  if (t && ct(t[1])) return { at: t.index, length: t[0].length, table: ct(t[1]), id: Number(t[2]), label: t[3] };
  const n = Nh.exec(e), a = n && ct(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function jh(e, t, n, a) {
  const s = Wl(a, e, t), o = un(s ? Bh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${et(Pt(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = Dh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: jh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ph = /\.(png|jpe?g|gif|webp|svg)$/i, qh = (e) => Ph.test(e), Fh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Wh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Hh(e, t) {
  const n = Fh.exec(e), [, a, s, o, l, r] = n || [], i = n && ct(a || o), c = i && Wl(t, i, Number(s || l));
  if (i !== "messages" || !c || !(c.files || []).includes(r)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(r)}`, f = `${Pt(i).title} ${c.id} · ${et(r)}`, m = qh(r) ? `<img class="file-card-image" src="${d}" alt="${et(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function zh(e) {
  const t = Wh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = Hh(e, t) || zh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Uh = /`([^`\n]+)`/g;
Et((e) => e.replace(Uh, (t, n) => `<code>${n}</code>`));
const mo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ms.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(Gl, (n, a, s, o) => mo[a] ? mo[a](s, o, t) : o)
);
const Vh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, er = new RegExp(`\\b(${Bl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), tr = new RegExp(`\\b(${Bl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Gh = new RegExp(`<code>((?:${er.source}|${tr.source}))</code>`, "gi"), Kh = (e) => e.replace(Gh, "$1"), Yh = (e, t) => `<a class="row-pill" href="#" data-peek="${ct(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Jh = (e) => e.replace(tr, (t, n, a) => a.replace(/\d+/g, (s) => Yh(n.replace(/s$/i, ""), s))), Zh = (e) => Jh(e).replace(
  er,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ct(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Kh(e).split(Vh).map((n, a) => a % 2 ? n : Zh(n)).join("")
);
const Xh = ["innerHTML"], Qh = ["innerHTML"], em = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Vl(), a = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Xh)) : (u(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Qh));
  }
}, kt = /* @__PURE__ */ Y(em, [["__scopeId", "data-v-7cbf7b8a"]]), tm = { class: "fact" }, nm = { class: "fact-label" }, am = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", tm, [
      y("span", nm, k(e.label), 1),
      D(kt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, sm = /* @__PURE__ */ Y(am, [["__scopeId", "data-v-a0ce1d97"]]), om = { class: "list" }, lm = { class: "list-label" }, rm = {
  key: 1,
  class: "list-note"
}, im = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", om, [
      (u(!0), h(G, null, ee(e.items, (o, l) => (u(), H(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: q(() => [
          y("span", lm, k(o.label), 1),
          o.badge ? (u(), H(Fl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (u(), h("span", rm, k(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, cm = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-e2e240a1"]]), um = { class: "table" }, dm = {
  key: 0,
  class: "table-row empty"
}, fm = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), h("div", um, [
      y("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (u(!0), h(G, null, ee(e.columns, (r) => (u(), h("span", {
          key: r,
          class: "cell"
        }, k(r), 1))), 128))
      ], 4),
      (u(!0), h(G, null, ee(e.rows, (r, i) => (u(), H(ht(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (c) => r.open && a("open", r.open)
      }, {
        default: q(() => [
          (u(!0), h(G, null, ee(r.cells, (c, d) => (u(), h("span", {
            key: d,
            class: "cell"
          }, k(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), h("div", dm, k(e.empty), 1)) : C("", !0)
    ]));
  }
}, hm = /* @__PURE__ */ Y(fm, [["__scopeId", "data-v-349d16ca"]]), mm = { class: "stat-value" }, pm = { class: "stat-label" }, gm = {
  key: 0,
  class: "stat-note"
}, vm = {
  __name: "StatTile",
  props: {
    label: { type: String, required: !0 },
    value: { type: [String, Number], required: !0 },
    note: { type: String, default: "" },
    tone: { type: String, default: "" },
    opens: Boolean
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(ht(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: q(() => [
        y("span", mm, k(e.value), 1),
        y("span", pm, k(e.label), 1),
        e.note ? (u(), h("span", gm, k(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ym = /* @__PURE__ */ Y(vm, [["__scopeId", "data-v-bf2aa36f"]]), bm = { class: "code" }, wm = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), H(jt, {
      value: e.node.type
    }, {
      stack: q(() => [
        D(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: q(() => [
        D(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: q(() => [
        D(On, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: q(() => [
        D(xf, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: q(() => [
        y("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: q(() => [...l[2] || (l[2] = [
        y("hr", { class: "divider" }, null, -1)
      ])]),
      stat: q(() => [
        D(ym, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: q(() => [
        D(gf, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: q(() => [
        D(hm, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: q(() => [
        D(cm, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: q(() => [
        D(kt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: q(() => [
        D(sm, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: q(() => [
        D(Fl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: q(() => [
        y("pre", bm, [
          y("code", null, k(e.node.text), 1)
        ])
      ]),
      file: q(() => [
        y("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), nr = /* @__PURE__ */ Y(wm, [["__scopeId", "data-v-92ed1e03"]]), km = { class: "dashboard" }, xm = { class: "trail" }, $m = ["onClick"], Mm = {
  key: 0,
  class: "gone",
  role: "status"
}, Sm = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = L(!!n.page && !s(n.page)), l = L(n.page && !o.value ? [n.page] : []), r = I(() => l.value.at(-1) || n.document.start), i = I(() => (n.document.pages || {})[r.value] || null), c = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return fe(
      () => n.document.start,
      () => l.value = []
    ), (m, g) => (u(), h("div", km, [
      e.document.broken ? (u(), H(Xt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: q(() => [
          te(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), H(Xt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: q(() => [
          te(k(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (u(), h(G, { key: 2 }, [
        y("nav", xm, [
          y("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (v) => f(0))
          }, k(c(e.document.start)), 3),
          (u(!0), h(G, null, ee(l.value, (v, x) => (u(), h(G, {
            key: `${x}-${v}`
          }, [
            g[2] || (g[2] = y("span", { class: "sep" }, "/", -1)),
            y("button", {
              type: "button",
              class: Z(["step", { current: x === l.value.length - 1 }]),
              onClick: (M) => f(x + 1)
            }, k(c(v)), 11, $m)
          ], 64))), 128))
        ]),
        o.value ? (u(), h("p", Mm, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        D(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: q(() => [
            (u(), h("div", {
              key: r.value,
              class: "page"
            }, [
              D(nr, {
                node: i.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (v) => a("file", v))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : C("", !0)
    ]));
  }
}, _m = /* @__PURE__ */ Y(Sm, [["__scopeId", "data-v-9e88e6d3"]]), ar = {
  runningTool: 1e3,
  agentCommand: 5e3,
  planCard: 3e3,
  openPanel: 5e3,
  documentWithNoEvents: 6e4,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
};
function Em(e, t) {
  const n = We(), a = ml(e, ar.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Re(e), ft(() => {
    s(), a.cancel();
  });
}
const Am = {
  key: 0,
  class: "window-failure"
}, Cm = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = We(), o = L(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Em(l, n.events) : gs(l, () => !0, ar.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (u(), h("p", Am, k(o.value.error), 1)) : o.value ? (u(), H(_m, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : C("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Pe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Om = 6;
function Es(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Tm = (e) => {
  const t = Es(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function Rm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const c = s.get(r[1]);
      c === "open" ? a.add(i) : c || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Im(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Bm(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), c = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, g) => m + g, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => c(d) - c(f));
  };
  for (let l = 0; l < Om; l++) {
    const r = l % 2 === 0, i = a.map((c, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((c) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Lm(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, r) => {
    const i = `${s[o]}:${l}`;
    (n.get(i) || n.set(i, []).get(i)).push({ arrow: s, end: o, other: r });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, r) => o[`${l}Share`] = (r + 1) / (s.length + 1));
}
function Nm(e) {
  const t = [...new Set(e.flatMap(([O, w]) => [O, w]))], n = new Set(e.map(([, O]) => O)), a = t.filter((O) => !n.has(O)), s = Rm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((O, w) => !s.has(w)), l = Im(t, o), r = Bm(t, o, l), i = new Map(t.map((O) => [O, Tm(O)])), c = r.map((O) => O.reduce((w, R) => w + i.get(R).width, 0) + je.across * (O.length - 1)), d = Math.max(...c) + je.margin * 2, f = jm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let g = je.margin;
  r.forEach((O, w) => {
    let R = (d - c[w]) / 2;
    const b = Math.max(...O.map((A) => i.get(A).height));
    O.forEach((A) => {
      const $ = i.get(A);
      m.set(A, { ...$, x: R, y: g + (b - $.height) / 2 }), R += $.width + je.across;
    }), g += b + (f[w] ?? je.down);
  });
  const v = e.map(([O, w, R], b) => ({ from: O, to: w, label: R || "", back: s.has(b) || l.get(w) <= l.get(O) }));
  Lm(v, m);
  const x = v.map((O) => Pm(O, m.get(O.from), m.get(O.to))), M = [...m.values()], B = Hm(x, M), F = Math.max(g - je.down, ...B.filter((O) => O.label).map((O) => O.label.y + O.label.height));
  return { width: Math.max(d - je.margin, ...B.filter((O) => O.label).map((O) => O.label.x + O.label.width)) + je.margin, height: F + je.margin, nodes: M, arrows: B };
}
const Dm = (e) => e ? Es(e, Pe.lineChars).length * Pe.line + Pe.pad * 2 : 0;
function jm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Dm(l) + je.labelSpace);
  }), a.map((s) => Math.max(je.down, s));
}
function Pm(e, t, n) {
  const a = e.label ? Es(e.label, Pe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Pe.charWidth + Pe.pad * 2 : 0, o = a.length * Pe.line + (a.length ? Pe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: c - d }, { x: i, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${c - d} ${i} ${c}` };
}
const qm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Fm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Wm = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Pe.line);
function Hm(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, c) => {
      const d = qm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, r = Wm.flatMap((i) => Fm.map((c) => s(c, i))).find((i) => !n.some((c) => po(i, c))) ?? s(0.5, 0);
    for (; n.some((i) => po(r, i)); ) r.y += Pe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Pe.line, pad: Pe.pad } };
  });
}
const po = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, zm = { class: "flowchart-tools" }, Um = ["width", "height", "viewBox", "aria-label"], Vm = ["d"], Gm = ["x", "y", "width", "height"], Km = ["x", "y"], Ym = ["x", "dy"], Jm = {
  key: 0,
  class: "flowchart-label"
}, Zm = ["x", "y", "width", "height"], Xm = ["x", "y"], Qm = ["x", "dy"], e1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Nm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = L(null), r = L({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function c() {
      var B;
      const x = (B = l.value) == null ? void 0 : B.getBoundingClientRect();
      if (!(x != null && x.width)) return;
      const M = Math.min(x.width / s.value.width, x.height / s.value.height, 1.5);
      r.value = { zoom: M, x: (x.width - s.value.width * M) / 2, y: (x.height - s.value.height * M) / 2 };
    }
    function d(x, M, B) {
      const { zoom: F, x: J, y: O } = r.value, w = Math.min(o.most, Math.max(o.least, F * x));
      r.value = { zoom: w, x: M - (M - J) * w / F, y: B - (B - O) * w / F };
    }
    function f(x) {
      const M = l.value.getBoundingClientRect();
      d(x, M.width / 2, M.height / 2);
    }
    function m(x) {
      const M = l.value.getBoundingClientRect();
      x.ctrlKey || x.metaKey ? d(x.deltaY < 0 ? o.step : 1 / o.step, x.clientX - M.left, x.clientY - M.top) : r.value = { ...r.value, x: r.value.x - x.deltaX, y: r.value.y - x.deltaY };
    }
    function g(x) {
      var M, B, F;
      x.preventDefault(), (M = window.getSelection()) == null || M.removeAllRanges(), i = { x: x.clientX - r.value.x, y: x.clientY - r.value.y }, (F = (B = l.value).setPointerCapture) == null || F.call(B, x.pointerId);
    }
    function v(x) {
      i && (r.value = { ...r.value, x: x.clientX - i.x, y: x.clientY - i.y });
    }
    return Re(c), (x, M) => (u(), H(Tl, {
      title: e.title,
      large: "",
      onClose: M[4] || (M[4] = (B) => a("close"))
    }, {
      default: q(() => [
        y("div", zm, [
          D(de, {
            small: "",
            onClick: M[0] || (M[0] = (B) => f(o.step))
          }, {
            default: q(() => [...M[5] || (M[5] = [
              te("Zoom in", -1)
            ])]),
            _: 1
          }),
          D(de, {
            small: "",
            onClick: M[1] || (M[1] = (B) => f(1 / o.step))
          }, {
            default: q(() => [...M[6] || (M[6] = [
              te("Zoom out", -1)
            ])]),
            _: 1
          }),
          D(de, {
            small: "",
            onClick: c
          }, {
            default: q(() => [...M[7] || (M[7] = [
              te("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        y("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: g,
          onPointermove: v,
          onPointerup: M[2] || (M[2] = (B) => zs(i) ? i.value = null : i = null),
          onPointercancel: M[3] || (M[3] = (B) => zs(i) ? i.value = null : i = null)
        }, [
          (u(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            M[8] || (M[8] = y("defs", null, [
              y("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                y("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (u(!0), h(G, null, ee(s.value.arrows, (B, F) => (u(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: B.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Vm))), 128)),
            (u(!0), h(G, null, ee(s.value.nodes, (B) => (u(), h("g", {
              key: B.name,
              class: "flowchart-node"
            }, [
              y("rect", {
                x: B.x,
                y: B.y,
                width: B.width,
                height: B.height,
                rx: "8"
              }, null, 8, Gm),
              y("text", {
                x: B.x + B.width / 2,
                y: B.y + B.padY + B.line / 2
              }, [
                (u(!0), h(G, null, ee(B.lines, (F, J) => (u(), h("tspan", {
                  key: J,
                  x: B.x + B.width / 2,
                  dy: J ? B.line : 0
                }, k(F), 9, Ym))), 128))
              ], 8, Km)
            ]))), 128)),
            (u(!0), h(G, null, ee(s.value.arrows, (B, F) => (u(), h(G, {
              key: `label-${F}`
            }, [
              B.label ? (u(), h("g", Jm, [
                y("rect", {
                  x: B.label.x,
                  y: B.label.y,
                  width: B.label.width,
                  height: B.label.height,
                  rx: "4"
                }, null, 8, Zm),
                y("text", {
                  x: B.label.x + B.label.width / 2,
                  y: B.label.y + B.label.pad + B.label.line / 2
                }, [
                  (u(!0), h(G, null, ee(B.label.lines, (J, O) => (u(), h("tspan", {
                    key: O,
                    x: B.label.x + B.label.width / 2,
                    dy: O ? B.label.line : 0
                  }, k(J), 9, Qm))), 128))
                ], 8, Xm)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, Um))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, t1 = /* @__PURE__ */ Y(e1, [["__scopeId", "data-v-6f337720"]]), go = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', vo = {
  words: '<rect x="2.5" y="3" width="11" height="8" rx="2"/><polyline points="5,11 5,13.5 8,11"/>',
  summary: '<line x1="3" y1="4.5" x2="13" y2="4.5"/><line x1="3" y1="8" x2="11" y2="8"/><line x1="3" y1="11.5" x2="8" y2="11.5"/>',
  warning: '<polygon points="8,2.5 14,13 2,13"/><line x1="8" y1="6.5" x2="8" y2="9.3"/><circle class="f" cx="8" cy="11.2" r=".75"/>',
  visitor: '<circle cx="6.5" cy="5.5" r="2.3"/><path d="M2.5 13.5c0-2.3 1.8-3.8 4-3.8s4 1.5 4 3.8"/><line x1="12" y1="4" x2="14" y2="4"/><line x1="12" y1="6.5" x2="14" y2="6.5"/>',
  flowchart: '<rect x="5.5" y="2" width="5" height="3.5" rx="1"/><rect x="1.5" y="10.5" width="5" height="3.5" rx="1"/><rect x="9.5" y="10.5" width="5" height="3.5" rx="1"/><polyline points="8,5.5 8,8 4,8 4,10.5"/><polyline points="8,8 12,8 12,10.5"/>',
  skill: '<rect x="3" y="2.5" width="10" height="11" rx="1.5"/><line x1="6" y1="2.5" x2="6" y2="13.5"/>',
  compact: '<polyline points="5,2.5 8,5.5 11,2.5"/><polyline points="5,13.5 8,10.5 11,13.5"/><line x1="2.5" y1="8" x2="13.5" y2="8"/>',
  rule: '<path d="M4 13.5V6.5a4 4 0 0 1 8 0v7z"/><line x1="6.3" y1="7.6" x2="9.7" y2="7.6"/><line x1="6.3" y1="10.3" x2="9.7" y2="10.3"/>',
  fact: '<circle cx="8" cy="6" r="3.2"/><line x1="8" y1="9.2" x2="8" y2="14"/>',
  reminder: '<path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.2H3z"/><line x1="6.8" y1="14.2" x2="9.2" y2="14.2"/>',
  ack: '<path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.2H3z"/><polyline points="6.2,7.8 7.6,9.2 10,6.6"/>',
  task: '<rect x="3" y="3" width="10" height="10" rx="2"/>',
  task_start: '<rect x="3" y="3" width="10" height="10" rx="2"/><polygon class="f" points="6.8,5.8 10.4,8 6.8,10.2"/>',
  task_done: '<rect x="3" y="3" width="10" height="10" rx="2"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  task_pause: '<rect x="3" y="3" width="10" height="10" rx="2"/><line x1="6.8" y1="6" x2="6.8" y2="10"/><line x1="9.2" y1="6" x2="9.2" y2="10"/>',
  task_block: '<rect x="3" y="3" width="10" height="10" rx="2"/><line x1="5.6" y1="8" x2="10.4" y2="8"/>',
  stuck: '<circle cx="8" cy="8" r="5.5"/><line x1="4.2" y1="11.8" x2="11.8" y2="4.2"/>',
  request: '<path d="M2.5 9l1.8-5.5h7.4L13.5 9v3.5h-11z"/><polyline points="2.5,9 6,9 6.8,10.5 9.2,10.5 10,9 13.5,9"/>',
  filed: '<polyline points="2.5,10 2.5,13 13.5,13 13.5,10"/><line x1="8" y1="2.5" x2="8" y2="9.5"/><polyline points="5.5,7 8,9.5 10.5,7"/>',
  question: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.6a1.7 1.7 0 1 1 2.4 1.5c-.5.3-.8.6-.8 1.2"/><circle class="f" cx="8" cy="11.1" r=".7"/>',
  answered: '<circle cx="8" cy="8" r="5.5"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  sequence: '<circle cx="4" cy="4" r="1.3"/><circle cx="4" cy="8" r="1.3"/><circle cx="4" cy="12" r="1.3"/><line x1="7" y1="4" x2="13" y2="4"/><line x1="7" y1="8" x2="13" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/>',
  step: '<polyline points="6,4 10,8 6,12"/>',
  agent: go,
  worker: go,
  subagent: '<circle cx="6.5" cy="6" r="2.2"/><path d="M2.5 13.5c0-2.4 1.8-4 4-4s4 1.6 4 4"/><circle cx="12" cy="4" r="1.4"/>',
  send: '<line x1="2.5" y1="8" x2="13" y2="8"/><polyline points="9,4 13,8 9,12"/>',
  receive: '<line x1="13.5" y1="8" x2="3" y2="8"/><polyline points="7,4 3,8 7,12"/>',
  report: '<rect x="3.5" y="2.5" width="9" height="11" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="8.5" x2="10" y2="8.5"/><line x1="6" y1="11" x2="8.5" y2="11"/>',
  document: '<path d="M4 2.5h5.5l3 3v8h-8.5z"/><polyline points="9.5,2.5 9.5,5.5 12.5,5.5"/>',
  fitness: '<polyline points="2,9 5,9 6.5,5 9,12 10.5,8 14,8"/>',
  worker_step: '<path d="M12.5 6.5A5 5 0 0 0 3.6 6.6"/><polyline points="3.2,3.8 3.6,6.6 6.3,6.2"/><path d="M3.5 9.5a5 5 0 0 0 8.9-.1"/><polyline points="12.8,12.2 12.4,9.4 9.7,9.8"/>',
  trigger: '<polygon points="9,2 4,9 8,9 7,14 12,7 8,7"/>',
  check: '<circle cx="8" cy="8" r="5.5"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  check_fail: '<circle cx="8" cy="8" r="5.5"/><line x1="6" y1="6" x2="10" y2="10"/><line x1="10" y1="6" x2="6" y2="10"/>',
  terminal: '<rect x="2" y="3" width="12" height="10" rx="2"/><polyline points="5,6.5 7,8 5,9.5"/><line x1="8.5" y1="10" x2="11" y2="10"/>',
  verifier: '<path d="M8 2.5l4.5 1.8v3.6c0 2.8-2 4.8-4.5 5.6-2.5-.8-4.5-2.8-4.5-5.6V4.3z"/><polyline points="6,8 7.5,9.5 10,6.8"/>',
  review: '<path d="M2 8s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4z"/><circle cx="8" cy="8" r="1.6"/>',
  menu: '<circle class="f" cx="3.5" cy="8" r="1"/><line x1="6" y1="4.5" x2="13" y2="4.5"/><line x1="6" y1="8" x2="13" y2="8"/><line x1="6" y1="11.5" x2="13" y2="11.5"/>',
  commit: '<circle cx="8" cy="8" r="2.5"/><line x1="2" y1="8" x2="5.5" y2="8"/><line x1="10.5" y1="8" x2="14" y2="8"/>',
  worktree: '<circle cx="5" cy="3.5" r="1.5"/><circle cx="5" cy="12.5" r="1.5"/><circle cx="11" cy="5.5" r="1.5"/><line x1="5" y1="5" x2="5" y2="11"/><path d="M11 7c0 2.6-6 2-6 4"/>',
  push: '<line x1="8" y1="11.5" x2="8" y2="3"/><polyline points="4.5,6.5 8,3 11.5,6.5"/><line x1="3" y1="13.5" x2="13" y2="13.5"/>',
  branch: '<line x1="3" y1="5.5" x2="12" y2="5.5"/><polyline points="9.5,3 12,5.5 9.5,8"/><line x1="13" y1="10.5" x2="4" y2="10.5"/><polyline points="6.5,8 4,10.5 6.5,13"/>',
  plugin: '<rect x="4" y="6" width="8" height="5" rx="1.5"/><line x1="6.5" y1="3" x2="6.5" y2="6"/><line x1="9.5" y1="3" x2="9.5" y2="6"/><line x1="8" y1="11" x2="8" y2="14"/>',
  phone: '<rect x="4.5" y="1.8" width="7" height="12.4" rx="1.8"/><line x1="7" y1="12" x2="9" y2="12"/>',
  share: '<path d="M6.5 9.5l5-5"/><polyline points="8,4.5 11.5,4.5 11.5,8"/><path d="M9.5 9.5v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h3"/>',
  search: '<circle cx="7" cy="7" r="4"/><line x1="10" y1="10" x2="13.5" y2="13.5"/>',
  update: '<path d="M13 8a5 5 0 1 1-1.5-3.6"/><polyline points="11.8,1.9 11.6,4.6 8.9,4.4"/>',
  bulb: '<circle cx="8" cy="6.5" r="4"/><line x1="6.5" y1="12" x2="9.5" y2="12"/><line x1="7" y1="14" x2="9" y2="14"/>',
  conflict: '<rect x="2.5" y="5" width="7" height="7" rx="1.5"/><rect x="6.5" y="2.5" width="7" height="7" rx="1.5"/>',
  plan: '<line x1="4" y1="2.5" x2="4" y2="14"/><path d="M4 3h8l-2 2.8 2 2.7H4"/>',
  dock: '<rect x="2.5" y="2.5" width="11" height="11" rx="2"/><line x1="2.5" y1="6" x2="13.5" y2="6"/>',
  fold: '<polyline points="4,6 8,10 12,6"/>',
  open: '<path d="M7.5 3.5H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 12.5h6a1.5 1.5 0 0 0 1.5-1.5V8.5"/><line x1="8" y1="8" x2="12.5" y2="3.5"/><polyline points="9.5,3.5 12.5,3.5 12.5,6.5"/>',
  stop: '<circle cx="8" cy="8" r="5.75"/><rect class="f" x="5.9" y="5.9" width="4.2" height="4.2" rx=".9"/>',
  stopped: '<rect class="f" x="4" y="4" width="8" height="8" rx="1.6"/>',
  runs: '<rect x="2.5" y="6.5" width="11" height="7" rx="1.8"/><line x1="4.5" y1="4.3" x2="11.5" y2="4.3"/><line x1="6" y1="2.2" x2="10" y2="2.2"/>',
  linked: '<path d="M6.8 9.2l2.4-2.4"/><path d="M7.4 5.6l1-1a2.3 2.3 0 0 1 3.2 3.2l-1 1"/><path d="M8.6 10.4l-1 1a2.3 2.3 0 0 1-3.2-3.2l1-1"/>',
  close: '<line x1="4.5" y1="4.5" x2="11.5" y2="11.5"/><line x1="11.5" y1="4.5" x2="4.5" y2="11.5"/>',
  tick: '<polyline points="3.5,8.3 6.5,11.2 12.5,4.8"/>',
  cross: '<line x1="4.5" y1="4.5" x2="11.5" y2="11.5"/><line x1="11.5" y1="4.5" x2="4.5" y2="11.5"/>',
  bang: '<line x1="8" y1="3.5" x2="8" y2="9"/><circle class="f" cx="8" cy="12" r="1"/>',
  file: '<path d="M4.5 2.5h4.5l2.5 2.5v8.5h-7z"/>',
  hash: '<line x1="6" y1="3" x2="5" y2="13"/><line x1="11" y1="3" x2="10" y2="13"/><line x1="3" y1="6.5" x2="13" y2="6.5"/><line x1="3" y1="10" x2="13" y2="10"/>',
  dot: '<circle class="f" cx="8" cy="8" r="2.5"/>',
  window: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><line x1="2.5" y1="6" x2="13.5" y2="6"/>'
}, n1 = ["innerHTML"], a1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => vo[t.name] || vo.dot);
    return (a, s) => (u(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, n1));
  }
}, dt = /* @__PURE__ */ Y(a1, [["__scopeId", "data-v-939f191f"]]), s1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      D(dt, { name: "fold" })
    ], 2));
  }
}, $t = /* @__PURE__ */ Y(s1, [["__scopeId", "data-v-a570162c"]]), o1 = ["data-tip", "aria-label"], l1 = {
  key: 0,
  class: "mact-word"
}, r1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      D(dt, { name: "open" }),
      e.open ? (u(), h("span", l1, k(e.label), 1)) : C("", !0),
      n[0] || (n[0] = y("span", { class: "hit" }, null, -1))
    ], 10, o1));
  }
}, sr = /* @__PURE__ */ Y(r1, [["__scopeId", "data-v-2824bb7d"]]), or = 120, Tn = 280, lr = 160, i1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, c1 = ["leaving", "resizing", "entering"];
function ts(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function u1(e) {
  const t = c1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ts(e);
  return e.classList.add(...t), n;
}
function rr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = L(t()), s = L("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const g = u1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Tn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Tn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, g);
  }
  function c(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let g = m.offsetHeight;
    const v = new ResizeObserver(() => {
      m.offsetHeight !== g && (g = m.offsetHeight, i(f, ts(f)));
    });
    return v.observe(m), v;
  }
  async function d(f) {
    const m = e.value, g = ++o;
    if (!m || !m.offsetWidth || i1()) {
      a.value = f;
      return;
    }
    const v = ts(m);
    if (l(m, v), s.value = "leaving", await n(or), g !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, v);
    const x = c(m);
    await n(Tn), x == null || x.disconnect(), g === o && (r(m), s.value = "entering", await n(lr), g === o && (s.value = ""));
  }
  return fe(t, (f) => d(f)), ft(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const d1 = { class: "growing-card-top" }, f1 = ["aria-expanded"], h1 = { class: "growing-card-avatar" }, m1 = { class: "growing-card-title" }, p1 = { class: "growing-card-more" }, g1 = { class: "growing-card-body" }, v1 = {
  __name: "GrowingCard",
  props: {
    title: { type: String, required: !0 },
    text: { type: String, default: "" },
    icon: { type: String, default: "agents" },
    person: { type: String, default: "" },
    bad: Boolean,
    action: { type: String, default: "" },
    incoming: Boolean,
    commentable: Boolean
  },
  emits: ["act", "comment"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(!1), o = L(null), { folded: l, phase: r } = rr(o, () => !s.value), i = I(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = I(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (u(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", P(r), { open: !P(l), bad: e.bad, incoming: e.incoming }])
    }, [
      y("div", d1, [
        y("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          y("span", h1, [
            e.bad ? (u(), H(dt, {
              key: 0,
              name: "cross"
            })) : i.value ? (u(), h(G, { key: 1 }, [
              te(k(i.value), 1)
            ], 64)) : (u(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          y("span", m1, k(e.title), 1),
          D($t, { open: s.value }, null, 8, ["open"])
        ], 8, f1),
        e.action ? (u(), H(sr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : C("", !0),
        e.commentable ? (u(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          D(ye, {
            name: "bubble",
            size: 13
          })
        ])) : C("", !0)
      ]),
      y("div", p1, [
        y("div", g1, [
          (u(!0), h(G, null, ee(c.value, (m, g) => (u(), h("p", {
            key: g,
            class: "growing-card-text"
          }, k(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, y1 = /* @__PURE__ */ Y(v1, [["__scopeId", "data-v-9cee1e01"]]), b1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, w1 = { class: "md inline" }, k1 = ["disabled", "title", "onClick"], x1 = {
  key: 1,
  class: "message-links-many"
}, $1 = ["aria-expanded"], M1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, S1 = ["disabled", "onClick"], _1 = { class: "row-pill message-links-chip" }, E1 = { class: "message-links-title" }, A1 = { key: 0 }, va = 3, C1 = "task", O1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => n.total || n.links.length), o = I(() => n.links.every((m) => m.endpoint.model === C1) ? "tasks" : "items"), l = L(!1), r = L(null);
    vl(r, () => l.value = !1);
    const i = () => l.value = !l.value, c = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      c(m) || (l.value = !1, qe(m.endpoint.open_ref));
    }
    return (m, g) => (u(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > va, three: s.value === va, open: l.value }]),
      "data-message-links": ""
    }, [
      D(dt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), h("span", b1, [
        y("span", w1, [
          g[1] || (g[1] = te("Linked: ", -1)),
          (u(!0), h(G, null, ee(e.links, (v) => (u(), h("button", {
            key: `${v.endpoint.model}:${v.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(v),
            title: v.endpoint.title,
            onClick: (x) => f(v)
          }, [
            te(k(v.endpoint.model.replaceAll("_", " ")) + " " + k(v.endpoint.id), 1),
            d(v) ? (u(), h(G, { key: 0 }, [
              te(" (" + k(d(v)) + ")", 1)
            ], 64)) : C("", !0),
            c(v) ? (u(), h(G, { key: 1 }, [
              te(" (unavailable)")
            ], 64)) : C("", !0)
          ], 8, k1))), 128))
        ])
      ])) : C("", !0),
      s.value >= va ? (u(), h("span", x1, [
        y("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          te(k(s.value) + " linked " + k(o.value) + " ", 1),
          D($t, { open: l.value }, null, 8, ["open"])
        ], 8, $1)
      ])) : C("", !0),
      l.value ? (u(), h("div", M1, [
        (u(!0), h(G, null, ee(e.links, (v) => (u(), h("button", {
          key: `${v.endpoint.model}:${v.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(v),
          onClick: (x) => f(v)
        }, [
          y("span", _1, k(v.endpoint.model.replaceAll("_", " ")) + " " + k(v.endpoint.id), 1),
          y("span", E1, k(v.endpoint.title), 1),
          y("span", null, k(d(v)), 1),
          c(v) ? (u(), h("span", A1, "Unavailable")) : C("", !0)
        ], 8, S1))), 128))
      ])) : C("", !0),
      D(Zn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (v) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, T1 = /* @__PURE__ */ Y(O1, [["__scopeId", "data-v-417b955f"]]), R1 = ["title", "aria-label"], I1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, B1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, L1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), h("svg", I1, [
        o[0] || (o[0] = y("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), h("path", B1)) : C("", !0)
      ]))
    ], 10, R1));
  }
}, N1 = /* @__PURE__ */ Y(L1, [["__scopeId", "data-v-6c0a4358"]]);
function D1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function ir(e, t = Date.now()) {
  const n = D1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const j1 = 36e5;
function e4(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / j1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function cr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function yo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ya = (e) => String(e).padStart(2, "0");
function P1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ya(t % 60)}s` : `${Math.floor(t / 3600)}h ${ya(Math.floor(t % 3600 / 60))}m ${ya(t % 60)}s`;
}
const q1 = "img,pre,table";
function F1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function W1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function H1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(q1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = F1(W1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function z1(e, t) {
  let n = null;
  const a = () => e.value && H1(e.value);
  Re(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), fe(t, a, { flush: "post" });
}
const U1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function V1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const xn = /* @__PURE__ */ new WeakMap(), Ge = "work", Ht = "sent", G1 = 50, bo = () => ({ rows: L([]), total: L(0), next: L(null), loading: L(!1), failure: L(""), version: 0 });
function K1(e) {
  var f;
  if (xn.has(e)) return xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...m.views].some((v) => v.visible);
  };
  async function o(m, g, v = 1) {
    const x = m[g], M = ++x.version;
    x.loading.value = !0, x.failure.value = "";
    const B = g === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", F = `link list --source message:${m.id} ${B} --page ${v} --page-size ${g === Ge ? 10 : 25}`;
    try {
      const J = await e.read(F);
      if (t.get(m.id) !== m || x.version !== M) return;
      if (!J.ok) {
        x.failure.value = J.error;
        return;
      }
      const O = g === Ge ? J.value.counterparts ?? [] : J.value.rows ?? [], w = v === 1 ? O : [...x.rows.value, ...O], R = g === Ge ? (b) => `${b.endpoint.model}:${b.endpoint.id}` : (b) => b.id ?? b.target_id;
      x.rows.value = [...new Map(w.map((b) => [R(b), b])).values()], x.total.value = J.value.total ?? x.rows.value.length, x.next.value = J.value.next_page ?? null;
    } catch (J) {
      x.version === M && (x.failure.value = J.message);
    } finally {
      x.version === M && (x.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of m) {
      const v = [...g.dirty];
      g.dirty.clear();
      for (const x of v) o(g, x);
    }
  }
  function r(m, g = [Ge, Ht]) {
    for (const v of g) m.dirty.add(v);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const g = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), v = m.link_types ?? (m.link_type ? [m.link_type] : []), x = v.length ? [Ge, Ht].filter((B) => B === Ge ? v.some((F) => ["about", "edited"].includes(F)) : v.includes("sent_to")) : [Ge, Ht];
    if (!x.length) return;
    const M = g.length ? [...new Set(g.filter((B) => B.model === "message").map((B) => B.id))].map((B) => t.get(B)).filter(Boolean) : [...t.values()].filter(s).slice(0, G1);
    for (const B of M) r(B, x);
  }
  const c = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, g) {
      let v = t.get(m);
      return v || (v = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ht]), work: bo(), sent: bo() }, t.set(m, v)), v.views.add(g), v.dirty.size && r(v, [...v.dirty]), v;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, g) {
      m.views.delete(g), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), c == null || c(), xn.delete(e));
    },
    more(m, g) {
      const v = m == null ? void 0 : m[g];
      if (v != null && v.next.value && !v.loading.value) return o(m, g, v.next.value);
    }
  };
  return xn.set(e, d), d;
}
function Y1(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = fe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = K1(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      c.visible = g.some((v) => v.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = fe(n, (g) => {
      f == null || f.disconnect(), g && (f == null || f.observe(g));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return ms(o), {
    links: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: I(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: I(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: I(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ge),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ht)
  };
}
const J1 = ["data-incoming", "data-ref"], Z1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], X1 = { class: "message-body" }, Q1 = ["title"], ep = ["innerHTML"], tp = ["title"], np = ["innerHTML"], ap = {
  class: "message-faces",
  "data-message-faces": ""
}, sp = ["title", "data-face", "onClick"], op = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, lp = ["title", "data-reaction", "onClick"], rp = {
  key: 0,
  class: "message-reaction-count"
}, ip = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, cp = ["href", "title"], up = ["src", "alt"], dp = ["href"], fp = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, hp = ["disabled", "data-sent-worker", "title", "onClick"], mp = { class: "message-foot" }, pp = { class: "message-time" }, gp = {
  class: "message-id",
  "data-message-id": ""
}, vp = 140, yp = 2, bp = 1500, wp = "An earlier message", kp = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(!1), o = L(null), l = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), se = ct(ve);
      return se ? { ref: `${se}:${me}`, label: `${Pt(se).title.toLowerCase()} ${me}` } : null;
    }), i = I(() => n.message.worker_id ?? null), c = L(!1), d = I(() => i.value !== null && ((n.message.text ?? "").length > vp || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > yp)), f = I(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, bp);
    }
    const g = Vl(), v = I(() => g(n.message.text ?? "")), x = I(() => JSON.parse(n.message.flowchart_edges || "[]")), M = L(!1), B = I(() => g(n.quote || wp));
    function F() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    z1(o, () => `${n.message.text} ${n.quote}`);
    const J = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, O = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, w = I(() => JSON.parse(n.message.captions || "{}")), R = I(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: O(ve), isImage: J.test(ve), title: w.value[ve] || ve }))), b = I(() => cr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = Oe(Le, null), { links: $, total: N, more: _, loading: p, failure: S, sentTo: E, sentMore: T, sentLoading: j, sentFailure: X, loadMore: ne, loadSent: ie } = Y1(A, () => l.value && !n.message.local ? n.message.id : null, o), he = L(!1), Ae = I(() => V1(n.message.reactions));
    function He(ve) {
      he.value = !1, a("react", n.message, ve);
    }
    return (ve, me) => e.message.peer || e.message.recipient ? (u(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      D(y1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (se) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, J1)) : (u(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      y("div", X1, [
        y("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...se) => P(It) && P(It)(...se))
        }, [
          r.value ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = xe((se) => P(qe)(r.value.ref), ["stop"]))
          }, [
            D(ye, {
              name: "bubble",
              size: 12
            }),
            y("span", null, "Comment on " + k(r.value.label), 1)
          ], 8, Q1)) : C("", !0),
          e.message.parent_id ? (u(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(F, ["stop"]),
            innerHTML: B.value
          }, null, 8, ep)) : C("", !0),
          i.value !== null ? (u(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = xe((se) => P(qe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + k(i.value), 9, tp)) : C("", !0),
          y("div", {
            class: Z({ "message-folded": d.value && !c.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, np),
          d.value ? (u(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = xe((se) => c.value = !c.value, ["stop"]))
          }, k(c.value ? "Show less" : "Show more"), 1)) : C("", !0),
          x.value.length ? (u(), h(G, { key: 4 }, [
            y("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (se) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (u(), H(t1, {
              key: 0,
              title: e.message.text,
              edges: x.value,
              onClose: me[5] || (me[5] = (se) => M.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        y("div", {
          class: Z(["message-tools", { picking: he.value }]),
          "data-message-tools": ""
        }, [
          he.value ? (u(), h(G, { key: 0 }, [
            y("div", ap, [
              (u(!0), h(G, null, ee(P(U1), (se) => (u(), h("button", {
                key: se,
                type: "button",
                class: "message-face",
                title: `React ${se}`,
                "data-face": se,
                onClick: (Ye) => He(se)
              }, k(se), 9, sp))), 128))
            ]),
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: me[7] || (me[7] = (se) => he.value = !1)
            }, [
              D(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), h(G, { key: 1 }, [
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: me[8] || (me[8] = (se) => he.value = !0)
            }, "React"),
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: me[9] || (me[9] = (se) => a("reply", e.message))
            }, "Reply"),
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, k(s.value ? "Copied" : "Copy"), 1),
            f.value ? (u(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: me[10] || (me[10] = (se) => a("delete", e.message))
            }, "Delete")) : C("", !0)
          ], 64))
        ], 2)
      ]),
      Ae.value.length ? (u(), h("div", op, [
        (u(!0), h(G, null, ee(Ae.value, (se) => (u(), h("button", {
          key: se.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: se.mine }]),
          title: se.title,
          "data-reaction": se.emoji,
          onClick: (Ye) => a("react", e.message, se.emoji)
        }, [
          te(k(se.emoji) + " ", 1),
          se.count > 1 ? (u(), h("span", rp, k(se.count), 1)) : C("", !0)
        ], 10, lp))), 128))
      ])) : C("", !0),
      R.value.length ? (u(), h("div", ip, [
        (u(!0), h(G, null, ee(R.value, (se) => (u(), h(G, {
          key: se.name
        }, [
          se.isImage ? (u(), h("a", {
            key: 0,
            href: se.address,
            target: "_blank",
            class: "message-image",
            title: se.title
          }, [
            y("img", {
              src: se.address,
              alt: se.name,
              "data-figure-picture": ""
            }, null, 8, up)
          ], 8, cp)) : (u(), h("a", {
            key: 1,
            href: se.address,
            target: "_blank",
            class: "message-file"
          }, k(se.name), 9, dp))
        ], 64))), 128))
      ])) : C("", !0),
      P(E).length ? (u(), h("div", fp, [
        D(ye, {
          name: "send",
          size: 12
        }),
        (u(!0), h(G, null, ee(P(E), (se) => (u(), h("button", {
          key: se.id,
          type: "button",
          class: "message-sent-worker",
          disabled: se.unavailable || !se.open_ref,
          "data-sent-worker": se.id,
          title: `Open worker ${se.id}`,
          onClick: xe((Ye) => se.open_ref && P(qe)(se.open_ref), ["stop"])
        }, [
          te("Also sent to worker " + k(se.id), 1),
          se.unavailable ? (u(), h(G, { key: 0 }, [
            te(" (unavailable)")
          ], 64)) : C("", !0)
        ], 8, hp))), 128))
      ])) : C("", !0),
      D(Zn, {
        more: P(T),
        loading: P(j),
        failure: P(X),
        label: "More recipients",
        onMore: P(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      y("div", mp, [
        y("time", pp, k(b.value), 1),
        Number.isInteger(e.message.id) ? (u(), h(G, { key: 0 }, [
          me[11] || (me[11] = y("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          y("span", gp, "message " + k(e.message.id), 1)
        ], 64)) : C("", !0),
        l.value ? (u(), H(N1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ]),
      P($).length || P(S) ? (u(), H(T1, {
        key: 3,
        links: P($),
        total: P(N),
        more: P(_),
        loading: P(p),
        failure: P(S),
        onMore: P(ne)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : C("", !0)
    ], 8, Z1));
  }
}, t4 = /* @__PURE__ */ Y(kp, [["__scopeId", "data-v-bc09cda6"]]), xp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = hi("SkeletonParts", !0);
      return u(!0), h(G, null, ee(e.parts, (i, c) => (u(), h(G, { key: c }, [
        (u(!0), h(G, null, ee(i.count, (d) => (u(), H(jt, {
          key: d,
          value: i.shape
        }, {
          line: q(() => [
            D(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: q(() => [
            D(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: q(() => [
            D(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: q(() => [...l[0] || (l[0] = [
            y("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: q(() => [
            y("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: q(() => [
            y("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: q(() => [
            y("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: q(() => [
            y("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              D(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), $p = /* @__PURE__ */ Y(xp, [["__scopeId", "data-v-b78e62d9"]]), Mp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Sp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), h("div", Mp, [
      D($p, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, As = /* @__PURE__ */ Y(Sp, [["__scopeId", "data-v-a5cff6ec"]]), Fn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ba = 200, ur = (e) => {
  var t;
  return ((t = Fn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Fn[0].key;
}, n4 = (e) => {
  var t;
  return ((t = Fn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, _p = ["aria-label"], Ep = 300, wo = 400, Ap = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ba } },
  setup(e) {
    const t = e, n = I(() => ur(t.value)), a = I(() => n.value < ba ? [1, 0.25, 0.25] : n.value === ba ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= wo, high: n.value >= Ep && n.value < wo }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      y("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      y("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      y("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, _p));
  }
}, a4 = /* @__PURE__ */ Y(Ap, [["__scopeId", "data-v-549d72cf"]]), ko = (e) => [...new Set(e.agents.map((t) => t.name))], s4 = (e) => ko(e).length === 1 ? `Worker: ${ko(e)[0]}` : "Delegated", Cp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, xo = (e) => Cp[e.card.state] || "idle", Op = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), $o = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Mo = (e, t) => $o[xo(e)] - $o[xo(t)], So = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, o4 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Mo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Op(a, s)) : [...e].sort((a, s) => Mo(a, s) || (So[t] || So.state)(a, s)), Tp = { class: "list-row" }, Rp = {
  key: 0,
  class: "list-row-type"
}, Ip = { class: "list-row-main" }, Bp = {
  key: 0,
  class: "list-row-title"
}, Lp = { class: "list-row-body" }, Np = {
  key: 1,
  class: "list-row-end"
}, Dp = {
  key: 1,
  class: "list-row-text"
}, jp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), h("div", Tp, [
      e.type ? (u(), h("span", Rp, k(e.type), 1)) : C("", !0),
      y("div", Ip, [
        e.title ? (u(), h("span", Bp, k(e.title), 1)) : C("", !0),
        y("div", Lp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), h("div", Np, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (u(), h("span", Dp, k(e.text), 1)) : C("", !0)
    ]));
  }
}, l4 = /* @__PURE__ */ Y(jp, [["__scopeId", "data-v-30fac05a"]]), Pp = {
  claude: [
    { key: "haiku", label: "haiku", note: "fast, for mechanical work" },
    { key: "sonnet", label: "sonnet", note: "careful work without invention" },
    { key: "opus", label: "opus", note: "judgement" },
    { key: "fable", label: "fable", note: "the most demanding work, for rare occasions" }
  ],
  codex: [
    { key: "gpt-6-luna", label: "gpt-6-luna", note: "fast, for mechanical work" },
    { key: "gpt-6.1-terra", label: "gpt-6.1-terra", note: "careful work without invention" },
    { key: "gpt-6.1-sol", label: "gpt-6.1-sol", note: "judgement" },
    { key: "gpt-6-astra", label: "gpt-6-astra", note: "the most demanding work, for rare occasions" }
  ]
}, qp = { claude: "Claude Code", codex: "Codex" }, Fp = ["aria-expanded"], Wp = { class: "drop-label" }, Hp = ["value"], zp = {
  key: 1,
  class: "drop-lead"
}, Up = { class: "drop-item-text" }, Vp = {
  key: 2,
  class: "drop-note"
}, Gp = {
  key: 1,
  class: "drop-none"
}, Kp = {
  __name: "DropList",
  props: {
    label: { type: String, default: "" },
    icon: { type: String, default: "" },
    items: { type: Array, default: () => [] },
    picked: { type: String, default: "" },
    empty: { type: String, default: "Nothing here" },
    wide: Boolean,
    bare: Boolean,
    menuWidth: { type: Number, default: 260 },
    searchable: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(!1), o = L(null), l = L(""), r = I(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function i(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      y("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (u(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : C("", !0),
        y("span", Wp, k(e.label), 1),
        D(ye, {
          name: "down",
          size: 11
        })
      ], 10, Fp),
      s.value ? (u(), H(Xn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: q(() => [
          e.searchable ? (u(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, Hp)) : C("", !0),
          (u(!0), h(G, null, ee(r.value, (f) => (u(), H(Mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: q(() => [
              f.running !== void 0 ? (u(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : C("", !0),
              f.lead ? (u(), h("span", zp, k(f.lead), 1)) : C("", !0),
              y("span", Up, k(f.label), 1),
              f.note ? (u(), h("span", Vp, k(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? C("", !0) : (u(), h("p", Gp, k(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, Yp = /* @__PURE__ */ Y(Kp, [["__scopeId", "data-v-9d0322ab"]]), r4 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => [
      ...Pp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = I(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (u(), H(Yp, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${P(qp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Jp = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: Z(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, dr = /* @__PURE__ */ Y(Jp, [["__scopeId", "data-v-36d0137f"]]), Zp = ["aria-label"], Xp = { class: "head" }, Qp = { class: "names" }, eg = { class: "body" }, tg = {
  __name: "SidePanel",
  props: {
    title: { type: String, default: "" },
    abstract: { type: String, default: "" },
    width: { type: String, default: "normal" },
    open: { type: Boolean, default: null },
    depth: { type: Number, default: 0 },
    over: { type: Boolean, default: !1 },
    closeLabel: { type: String, default: "Close the panel" }
  },
  emits: ["close", "dismiss"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Al(a, n), r = Cl(s);
    return (i, c) => (u(), H(hs, { to: "body" }, [
      D(Dt, {
        name: "side",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: q(() => [
          P(s) ? (u(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: P(r) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => P(o) && P(o)(...d), ["self"]))
          }, [
            y("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), h(G, { key: 0 }, [
                y("header", Xp, [
                  y("div", Qp, [
                    y("h2", null, k(e.title), 1),
                    e.abstract ? (u(), H(kt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : C("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  D(xs, {
                    title: e.closeLabel,
                    onClick: P(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (u(), H(dr, { key: 0 }, {
                  default: q(() => [
                    ue(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : C("", !0),
                y("div", eg, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Zp)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, i4 = /* @__PURE__ */ Y(tg, [["__scopeId", "data-v-2199b5ec"]]), ng = {
  key: 1,
  class: "text-field-label"
}, ag = {
  key: 2,
  class: "text-field-end"
}, sg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Wa({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Fa(e, "modelValue"), a = Jn(), s = "onUpdate:modelValue" in (((d = mi()) == null ? void 0 : d.vnode.props) || {}), o = I(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = I(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = I(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), c = L(null);
    return t({ focus: () => c.value && c.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (u(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, P(a).class]),
      style: ge(P(a).style)
    }, [
      e.icon ? (u(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (u(), h("span", ng, k(e.label), 1)) : C("", !0),
      tt(y("input", Fe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [P(Ya), o.value]
      ]),
      f.$slots.end ? (u(), h("span", ag, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
    ], 6)) : tt((u(), h("input", Fe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [P(Ya), o.value]
    ]);
  }
}), c4 = /* @__PURE__ */ Y(sg, [["__scopeId", "data-v-631ba0ce"]]), og = { class: "title" }, lg = { class: "state" }, rg = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = za(t.line, t.events);
    return (o, l) => (u(), H(Kd, {
      rows: P(n),
      failure: P(a),
      loaded: P(s),
      empty: e.empty
    }, {
      default: q(({ row: r }) => [
        y("span", og, k(r.title), 1),
        y("span", lg, k(P(kl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, u4 = /* @__PURE__ */ Y(rg, [["__scopeId", "data-v-46749af8"]]);
function ig(e = 1e3, t = null) {
  const n = L(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? fe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const wa = L(Date.now() / 1e3);
let _o = 0, $n = 0;
function fr() {
  return $n || (wa.value = Date.now() / 1e3, _o = setInterval(() => wa.value = Date.now() / 1e3, 1e3)), $n += 1, nl() && ms(() => {
    $n -= 1, $n || clearInterval(_o);
  }), wa;
}
const cg = 200, ug = or + Tn + lr + cg;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function dg(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Ft(e),
    top: Ft(e.querySelector(".top")),
    title: Ft(e.querySelector(".title")),
    contents: Ft(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, c;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((c = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: d }))(getComputedStyle(e)),
    parent: Ft(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function fg(e, t, n, a) {
  fe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(dg(o, l, n.value)), performance.now() - l < ug) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const hg = ["title", "data-figure-mark", "data-folded", "data-open"], mg = {
  key: 2,
  class: "worker"
}, pg = { class: "head" }, gg = { key: 0 }, vg = {
  key: 3,
  class: "status"
}, yg = {
  key: 0,
  class: "figure"
}, bg = {
  key: 1,
  class: "ran-for"
}, wg = { key: 2 }, kg = {
  key: 3,
  class: "news"
}, xg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, $g = {
  key: 6,
  class: "settled"
}, Mg = {
  key: 1,
  class: "bar"
}, Sg = {
  key: 3,
  class: "detail body"
}, _g = {
  key: 0,
  class: "body-label"
}, Eg = ["title"], Ag = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Jn(), a = ["onClick", "onAct"], s = I(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = L(!1), l = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), i = I(() => r.value || l.value), c = I(() => r.value ? t.open : o.value), d = I(() => r.value ? !t.open : l.value && !o.value), f = I(() => !!(t.mark.action && n.onAct)), m = I(() => i.value || f.value || !!n.onClick), g = L(null), v = L(null), { folded: x, phase: M } = rr(g, () => d.value);
    fg(g, d, M, Oe(Le, null));
    function B(ie) {
      var he, Ae;
      if (!(ie.target !== g.value && !v.value.contains(ie.target))) {
        if (r.value) return (he = n.onClick) == null ? void 0 : he.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const F = (ie) => n.onAct(ie), J = ["failed", "unfinished"], O = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? J.includes(t.mark.state) ? "danger" : "good" : ""), w = I(() => t.mark.color ? t.mark.color : O.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : O.value ? `var(--tone-${O.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), R = I(() => w.value || "var(--tone-work)"), b = I(() => !t.mark.ending && !t.mark.ended && O.value !== "stopped"), A = fr(), $ = I(
      () => t.mark.began_at && b.value && !t.mark.figure && !t.mark.counting ? P1(A.value - t.mark.began_at) : ""
    ), N = I(() => {
      const { started: ie, ended: he } = t.mark;
      return ie ? he ? `ran ${yo(he - ie, !0)}` : yo(A.value - ie, !0) : $.value;
    }), _ = ["bad", "danger", "warn"], p = I(() => _.includes(O.value) || t.mark.asks ? "attention" : b.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], E = I(() => S.includes(O.value)), T = I(() => p.value === "process" ? "running" : E.value ? "cross" : O.value === "stopped" ? "stopped" : O.value === "good" ? "tick" : ""), j = I(
      () => !!(t.mark.figure || N.value || t.mark.docked || t.mark.stopping || T.value || t.mark.settled || t.mark.news)
    ), X = I(() => [t.mark.title, t.mark.time ? cr(t.mark.time) : ""].filter(Boolean).join(" · ")), ne = I(() => ({
      ...w.value ? { "--mark": w.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, he) => (u(), h("div", Fe(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${p.value}`,
        P(M),
        {
          open: c.value,
          folding: r.value && d.value,
          live: m.value,
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: w.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ne.value,
      title: X.value,
      "data-figure-mark": e.mark.key,
      "data-folded": P(x) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: B
    }), [
      (u(), H(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: v,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!c.value) : void 0
      }, {
        default: q(() => [
          e.mark.markIcon ? (u(), H(dt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), h("span", mg, k(e.mark.worker), 1)) : C("", !0),
          y("span", pg, [
            D(kt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), h("strong", gg, k(e.mark.name), 1)) : C("", !0),
            i.value ? (u(), H($t, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          j.value ? (u(), h("span", vg, [
            e.mark.figure ? (u(), h("span", yg, k(e.mark.figure), 1)) : C("", !0),
            N.value ? (u(), h("span", bg, k(N.value), 1)) : C("", !0),
            e.mark.stopping ? (u(), h("span", wg, "Stopping")) : C("", !0),
            e.mark.news ? (u(), h("span", kg, k(e.mark.news), 1)) : C("", !0),
            T.value === "running" ? (u(), h("span", xg)) : T.value ? (u(), H(dt, {
              key: 5,
              class: Z(["sign", T.value]),
              name: T.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (u(), h("span", $g, k(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (u(), H(sr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(F, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && b.value ? (u(), h("span", Mg, [
        y("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: R.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !P(x) ? (u(), H(kt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !P(x) ? (u(), h("div", Sg, [
        e.mark.bodyLabel ? (u(), h("p", _g, k(e.mark.bodyLabel), 1)) : C("", !0),
        D(kt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !P(x) ? (u(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, Eg)) : C("", !0),
      e.mark.card ? (u(), H(kt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      ue(ie.$slots, "default", {
        shown: !P(x)
      }, void 0, !0)
    ], 16, hg));
  }
}), hr = /* @__PURE__ */ Y(Ag, [["__scopeId", "data-v-dc93aa50"]]), Cg = 60, mr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Og(e, t) {
  const n = L([]), a = L(0);
  let s = -1, o = 0, l = !1;
  async function r() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, a.value = d.value.first_byte, s = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function i() {
    if (s < 0) return r();
    const d = await e(["output", "page", String(t()), "--after", String(s)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < s ? r() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), s = d.value.last_byte, d) : d;
  }
  async function c(d) {
    if (l || a.value <= 0 || d.scrollTop > Cg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: c };
}
const Tg = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function pr(e) {
  var n;
  const t = Tg[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Rg = (e) => pr(String(e).split(":")[0]), gr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ig = { passed: "good", failed: "danger", warned: "warn", running: "" }, Bg = { good: "good", warn: "warn", danger: "danger" }, Eo = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => jd(e.target_model, e.target_id || 0)
}, Lg = { "open row": (e) => Rg(e.target_model), "open page": () => pr("pages") };
function Ng(e, t) {
  const n = t || {}, a = Eo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Ig[e.outcome] || "" : Bg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Lg[a](e) : "",
    handlers: a ? { onAct: () => Eo[a](e) } : {}
  };
}
const Dg = 24, jg = 1e3, Ao = 2e3, Pg = 0.25, qg = 5e3;
function Fg(e, t = Dg, n = () => !0) {
  const a = L(!1), s = L(0), o = L(!1);
  let l = 0, r = 0, i = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const O = c();
    return O ? O.scrollHeight - O.scrollTop - O.clientHeight : 0;
  }, f = () => !c() || d() <= t;
  function m(O) {
    if (clearTimeout(l), !O) {
      o.value = !1, i = Date.now();
      return;
    }
    const w = Date.now() - i < Ao ? Ao : jg;
    l = setTimeout(() => o.value = a.value, w);
  }
  function g() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function v(O = !1) {
    const w = c();
    w && O && w.scrollTo ? w.scrollTo({ top: w.scrollHeight, behavior: "smooth" }) : w && (w.scrollTop = w.scrollHeight), g();
  }
  function x() {
    B(), !a.value && (a.value = !0, m(!0));
  }
  const M = () => !!c() && d() <= c().clientHeight * Pg;
  function B() {
    clearTimeout(r), M() && (r = setTimeout(() => a.value && M() && n() && v(!0), qg));
  }
  function F() {
    f() ? g() : x();
  }
  function J(O = 1, w = !1) {
    a.value ? s.value += Math.max(0, O) : v(w);
  }
  return nl() && ms(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: g, toBottom: v, left: x, scrolled: F, arrived: J };
}
const Wg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Hg = (e) => String(e ?? "").replace(Wg, ""), zg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(null), { away: o, scrolled: l, arrived: r, toBottom: i } = Fg(s);
    fe(
      () => n.lines.length,
      () => mt(() => r()),
      { immediate: !0 }
    );
    function c(d) {
      l(), a("older", d.target);
    }
    return (d, f) => (u(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      te(k(P(Hg)(e.lines.join(`
`)) || e.empty), 1),
      P(o) ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => P(i)(!0))
      }, "Follow")) : C("", !0)
    ], 544));
  }
}, Ug = /* @__PURE__ */ Y(zg, [["__scopeId", "data-v-07980c45"]]), Vg = 1e4;
class Gg {
  constructor(t, n) {
    this.frame = t, this.context = n, this.heardAt = null, this.received = this.received.bind(this);
  }
  start() {
    window.addEventListener("message", this.received);
  }
  stop() {
    window.removeEventListener("message", this.received);
  }
  silent(t = Date.now()) {
    return this.heardAt !== null && t - this.heardAt > Vg;
  }
  async received(t) {
    if (t.source !== this.frame.contentWindow) return;
    this.heardAt = Date.now();
    const n = t.data;
    !n || typeof n.id != "number" || (n.type === "read" && this.send(n.id, await this.context.read(n.line)), n.type === "run" && this.send(n.id, await this.context.run(n.line)), n.type === "option" && this.send(n.id, { ok: !0, value: this.context.option(n.key).value ?? null }), n.type === "follow" && (this.context.follow(n.patterns, (a) => this.send(n.id, { ok: !0, value: a })), this.send(n.id, { ok: !0, value: null })));
  }
  send(t, n) {
    var a;
    (a = this.frame.contentWindow) == null || a.postMessage({ id: t, answer: n }, "*");
  }
}
const Kg = {
  key: 0,
  class: "frame-note"
}, Yg = {
  key: 0,
  class: "frame-note"
}, Jg = ["src", "title"], Zg = 1e3, Xg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = We(), a = L(null), s = L(!1), o = L(!1);
    let l = null, r = 0;
    return Re(() => {
      l = new Gg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Zg);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, c) => o.value ? (u(), h("p", Kg, "This window was closed because it stopped answering.")) : (u(), h(G, { key: 1 }, [
      s.value ? (u(), h("div", Yg, [
        c[2] || (c[2] = y("p", null, "This window has not answered for ten seconds.", -1)),
        D(de, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: q(() => [...c[1] || (c[1] = [
            te("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : C("", !0),
      y("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: P(n).window
      }, null, 8, Jg)
    ], 64));
  }
}, Qg = /* @__PURE__ */ Y(Xg, [["__scopeId", "data-v-f3cb2f7c"]]), Mn = (e) => e ? e.split(", ") : [];
function ev({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function tv(e, t) {
  return {
    reads: Mn(e.reads_allowed),
    runs: Mn(e.runs_allowed),
    missing: [...Mn(e.reads_missing), ...Mn(e.runs_missing)],
    ask: t
  };
}
const nv = {
  class: "allowance-prompt",
  role: "dialog"
}, av = { class: "allowance-prompt-text" }, sv = { class: "allowance-prompt-buttons" }, ov = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", nv, [
      y("p", av, k(P(ev)(e.request)), 1),
      y("div", sv, [
        D(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            te("Allow", -1)
          ])]),
          _: 1
        }),
        D(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            te("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, lv = /* @__PURE__ */ Y(ov, [["__scopeId", "data-v-9319ffca"]]), ka = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(Xt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: q(() => [
        te(k(e.reason) + " ", 1),
        e.retry ? (u(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            te("Retry", -1)
          ])]),
          _: 1
        })) : C("", !0),
        e.removable ? (u(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            te("Remove tab", -1)
          ])]),
          _: 1
        })) : C("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, rv = ["data-window", "data-agent"], iv = {
  __name: "WindowHost",
  props: {
    name: { type: String, required: !0 },
    component: { type: Object, default: null },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, default: "" },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, default: () => ({ reads: [], runs: [], missing: [], ask: async () => !0 }) },
    prompts: { type: Object, default: null },
    events: { type: Array, default: () => [] },
    unavailableReason: { type: String, default: "" },
    options: { type: Object, default: () => ({}) },
    declared: { type: Array, default: () => [] },
    autoScroll: { type: String, default: "" },
    tabs: { type: Array, default: () => [] },
    sources: { type: Array, default: () => [] },
    links: { type: Object, default: () => ({}) },
    search: { type: Object, default: () => ({}) },
    readOnly: Boolean,
    shared: { type: Object, default: null },
    skeleton: { type: Array, default: () => [] }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(""), o = L(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Oe(Pc, null), i = Ru({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
      declared: n.declared,
      page: Oe(_u, null),
      setOption: (f, m) => a("option", f, m),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, m) => {
        a("open", f, m), r == null || r(f, m);
      }
    });
    al(Le, i), fe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Re(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), pi((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const c = () => Kn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (u(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), H(lv, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : C("", !0),
      e.unavailableReason ? (u(), H(ka, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), H(ka, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), h(G, { key: 4 }, [
        (u(), H(c, { key: o.value })),
        e.skeleton.length && !P(i).answered.value ? (u(), H(As, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : C("", !0)
      ], 64)) : (u(), H(ka, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, rv));
  }
}, Gt = /* @__PURE__ */ Y(iv, [["__scopeId", "data-v-bd481e0c"]]), vr = {
  __name: "FrameWindow",
  props: {
    entry: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, default: () => ({ reads: [], runs: [], missing: [], ask: async () => !0 }) },
    prompts: { type: Object, default: null },
    options: { type: Object, default: () => ({}) }
  },
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = { render: () => Kn(Qg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), H(Gt, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: s,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: l[0] || (l[0] = (r, i) => a("option", r, i))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, cv = ["data-window"], yr = {
  __name: "PageWindow",
  props: {
    entry: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, required: !0 },
    prompts: { type: Object, default: null },
    options: { type: Object, default: () => ({}) }
  },
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ke(null), o = L("");
    return fe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, ac();
          } catch (r) {
            if (tc(r) && nc(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      D(As, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, cv)) : (u(), H(Gt, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: s.value,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events,
      skeleton: e.entry.skeleton,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: r[0] || (r[0] = (i, c) => a("option", i, c))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, uv = "*.*", dv = {
  __name: "ModuleBody",
  props: {
    declaration: { type: Object, required: !0 },
    row: { type: Object, default: null },
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean,
    environment: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = Oe(Le, null), a = new Oc();
    fe(
      () => a.patterns,
      (i, c, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (g) => a.dispatch(g));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = I(() => !!(t.declaration.shipped || t.declaration.trusted)), r = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [uv] : t.declaration.events ?? [],
      options: []
    }));
    return (i, c) => l.value ? (u(), H(yr, {
      key: 0,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), H(vr, {
      key: 1,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, fv = { class: "mark-more-inner" }, hv = {
  class: "mark-lines",
  "data-mark-reason": ""
}, mv = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, pv = {
  key: 3,
  class: "mark-lines"
}, gv = "process", Co = "task", vv = {
  __name: "MarkBody",
  props: {
    declaration: { type: Object, required: !0 },
    mark: { type: Object, required: !0 },
    shown: Boolean,
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean
  },
  setup(e) {
    const t = e, n = We(), a = I(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = I(() => gr.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === Co ? t.mark.target_id : 0), l = Og(
      mr(n),
      () => t.mark.target_id
    ), r = l.lines, i = L(!1), c = L(""), d = I(() => !t.declaration.body_url && t.mark.target_model === gv && !!t.mark.target_id);
    async function f(g = l.follow) {
      const v = await g();
      i.value = !0, c.value = v.ok ? "" : v.error;
    }
    const m = I(() => t.shown && d.value);
    return fe(m, (g) => g && f()), gs(() => m.value && f(), () => m.value && !t.mark.ended_at), fe(
      () => t.mark.ended_at,
      (g) => g && m.value && f(l.newest)
    ), (g, v) => (u(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: v[1] || (v[1] = xe(() => {
      }, ["stop"]))
    }, [
      y("div", fv, [
        e.declaration.body_url ? (u(), H(dv, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (u(), h(G, { key: 1 }, [
          s.value ? (u(), h(G, { key: 0 }, [
            v[2] || (v[2] = y("p", { class: "mark-label" }, "Why it stopped", -1)),
            y("p", hv, k(s.value), 1)
          ], 64)) : C("", !0),
          d.value && c.value ? (u(), h("p", mv, k(c.value), 1)) : d.value && i.value ? (u(), h(G, { key: 2 }, [
            v[3] || (v[3] = y("p", { class: "mark-label" }, "Output", -1)),
            D(Ug, {
              class: "mark-terminal",
              lines: P(r),
              onOlder: P(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (u(), h("p", pv, k(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (u(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: v[0] || (v[0] = xe((x) => P(qe)(`${Co}:${o.value}`), ["stop"]))
          }, " Open task " + k(o.value) + " and its proofs ", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ns = /* @__PURE__ */ Y(vv, [["__scopeId", "data-v-d51a1ce5"]]), yv = ["title", "aria-label", "onClick"], bv = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, wv = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => dd(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = L(""), s = Oe(Le);
    async function o(l) {
      const r = await cn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (u(), h(G, null, [
      (u(!0), h(G, null, ee(n.value, (i) => (u(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((c) => o(i), ["stop"])
      }, [
        D(dt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, yv))), 128)),
      a.value ? (u(), h("span", bv, k(a.value), 1)) : C("", !0)
    ], 64));
  }
}, kv = /* @__PURE__ */ Y(wv, [["__scopeId", "data-v-c8022f67"]]);
function br(e, t) {
  const n = Ke(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const wr = br("/api/marks", "marks"), d4 = wr.fetchAll, xv = wr.find, $v = ["data-ref"], Mv = ["data-ref"], Sv = { class: "mark-row" }, _v = "dock add", Ev = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = I(() => xv(a.mark.type)), o = I(() => Ng(a.mark, s.value)), l = I(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && gr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = L(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const c = I(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(_v));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, g;
      return (m = s.value) != null && m.card ? (u(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        D(ns, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, $v)) : (u(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        y("span", Sv, [
          D(hr, Fe({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, gi(o.value.handlers), { onClick: i }), vi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: q(({ shown: v }) => [
                D(ns, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: v
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          D(kv, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Mv));
    };
  }
}, Av = /* @__PURE__ */ Y(Ev, [["__scopeId", "data-v-822c50ad"]]), Cv = ["data-ref"], Ov = ["inert"], Tv = { class: "group-fold" }, Rv = { class: "thread-group" }, Iv = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = L(!1), a = L(!1), s = L(!1), o = L(null);
    fe(n, async (r) => {
      var i;
      a.value = !0, await mt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = I(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (u(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      D(hr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        y("div", Tv, [
          y("div", Rv, [
            (u(!0), h(G, null, ee(e.group.marks, (c) => (u(), H(Av, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Ov)) : C("", !0)
    ], 8, Cv));
  }
}, f4 = /* @__PURE__ */ Y(Iv, [["__scopeId", "data-v-163808b2"]]);
function Bv(e) {
  const t = L(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), ft(() => n.disconnect()), t;
}
const Lv = { class: "chat-dock-fold" }, Nv = ["aria-label"], Dv = { class: "chat-dock-head" }, jv = { class: "chat-dock-inner" }, Pv = { class: "chat-dock-foot" }, kr = 700, qv = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = L(null), a = L(null), s = Bv(a), o = L(!1);
    let l = 0;
    return Re(() => l = setTimeout(() => o.value = !0, kr)), ft(() => clearTimeout(l)), t({ card: n }), (r, i) => (u(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      y("div", Lv, [
        y("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          y("header", Dv, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          y("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            y("div", jv, [
              y("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(P(s) === null ? null : { height: `${P(s)}px` })
              }, [
                y("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(r.$slots, "still", {}, void 0, !0),
          y("footer", Pv, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Nv)
      ])
    ], 2));
  }
}, xr = /* @__PURE__ */ Y(qv, [["__scopeId", "data-v-faaa3f0d"]]), Fv = {
  class: "dock-leave",
  "aria-hidden": "true"
}, xa = 5, Wv = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(xa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${xa}s`, animationDelay: `${(n - xa).toFixed(2)}s` };
    return (s, o) => (u(), h("span", Fv, [
      y("i", { style: a })
    ]));
  }
}, $r = /* @__PURE__ */ Y(Wv, [["__scopeId", "data-v-3be36688"]]), Hv = { reviewing: "Under review" }, zv = (e, t) => e || Hv[t == null ? void 0 : t.state] || "", Xe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Uv = {
  draft: [{ word: "ready", label: "Mark ready" }, Xe],
  ready: [Xe],
  approved: [{ word: "start", label: "Start", main: !0 }, Xe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Xe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Xe],
  completed: [],
  cancelled: []
}, Vv = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Xe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Xe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Xe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Xe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Gv = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Kv = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Yv = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Jv = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], Zv = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Xv = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Qv(e, t) {
  const n = { plan: Uv, task: Vv }[e], a = t != null && t.state ? Su(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[xl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const e0 = (e, t) => e === "doc" || e === "report" ? Xv(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Yv(t), ...Kv(t)] : e === "check" ? Zv(t) : e === "question" ? Gv(t) : e === "memory" ? Jv(t) : Qv(e, t), Mr = br("/api/docks", "docks"), h4 = Mr.fetchAll, zt = Mr.find, t0 = 6, n0 = 3, $a = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ea = (e) => Date.parse(e.leaves_at) / 1e3, wt = (e) => !!(e.leaves_at && !e.kept), a0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < ea(e) || n.has(e.id)), s0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => a0(a, t, n)).sort((a, s) => a.id - s.id);
function o0(e, t, n = t0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ea(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const l0 = (e, t, n = e) => n < 2 ? !1 : e >= n0 ? !0 : t, r0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), as = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), i0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), c0 = (e) => ({ ...e.kept ? as("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : as("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), u0 = ["pins"], d0 = (e) => ({ ...e, iconOnly: u0.includes(e.icon) });
function f0(e, t) {
  var n;
  return [
    ...i0(e, t) ? [c0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    as("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(d0);
}
function h0(e, t) {
  const n = f0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: r0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const m0 = ["title"], p0 = {
  key: 2,
  class: "dock-controls"
}, g0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, v0 = { class: "dock-facts" }, y0 = { key: 1 }, b0 = {
  key: 2,
  class: "dock-kept"
}, w0 = { class: "dock-acts" }, k0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => zt(a.item.type)), o = fr(), l = I(() => ir(a.item.created_at, o.value * 1e3)), r = L(null), i = L(null), c = L(null), d = L(null), f = I(() => h0(a.item, s.value)), m = We(), g = I(() => `dock.${a.item.id}`), v = I(() => m.props[g.value].data.value), x = I(() => Pn(a.item.target_model ?? "")), M = I(() => ({ ...v.value, id: a.item.target_id, noun: x.value })), B = () => {
      var A, $;
      return (($ = (A = s.value) == null ? void 0 : A.reads) == null ? void 0 : $.length) && m.reload(g.value);
    };
    Fc(al, { data: v, reload: B, readOutput: mr(m) }), fe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (A, $, N) => {
        var p;
        B();
        const _ = (p = m.subscriptions) == null ? void 0 : p.follow(`dock ${a.item.id}`, [`${x.value.replaceAll("-", "_")}.*`], (S) => {
          (!S.row_id || S.row_id === a.item.target_id) && B();
        });
        N(() => _ == null ? void 0 : _());
      },
      { immediate: !0 }
    );
    const F = L(/* @__PURE__ */ new Set()), J = L("");
    async function O(A) {
      if (A.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      A.action === "declared" && (F.value = /* @__PURE__ */ new Set([...F.value, A.label])), J.value = "";
      const N = await cn(A, { id: a.item.target_id }, m.environment);
      (N == null ? void 0 : N.ok) === !1 && (F.value = new Set([...F.value].filter((_) => _ !== A.label)), J.value = `Could not ${A.label.toLowerCase()}: ${N.error}`);
    }
    const w = I(() => f.value.actions.filter((A) => A.action !== "undock" && !F.value.has(A.label))), R = I(() => {
      var A;
      return zv((A = s.value) == null ? void 0 : A.badge, M.value);
    }), b = I(() => f.value.buttons.find((A) => A.action === "undock"));
    return (A, $) => {
      var N, _, p, S;
      return u(), H(xr, {
        label: f.value.title + ((N = s.value) != null && N.needs_user ? ", waiting for you" : ""),
        type: (_ = s.value) != null && _.needs_user ? "waiting" : "",
        folded: !!((p = s.value) != null && p.folds) && e.folded,
        body: !!((S = s.value) != null && S.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[3] || ($[3] = (E) => e.collapsed && n("open"))
      }, {
        edge: q(() => [
          e.leaving && !e.item.kept ? (u(), H($r, {
            key: 0,
            "ends-at": P(ea)(e.item)
          }, null, 8, ["ends-at"])) : C("", !0)
        ]),
        head: q(() => {
          var E, T;
          return [
            (E = s.value) != null && E.draws_head && !e.collapsed ? (u(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), h(G, { key: 1 }, [
              D(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              y("span", {
                class: "dock-title",
                title: f.value.title
              }, k(f.value.title), 9, m0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (u(), h("span", p0, [
              (u(!0), h(G, null, ee(f.value.controls, (j) => {
                var X, ne;
                return u(), h(G, {
                  key: j.action + j.runs
                }, [
                  !F.value.has(j.label) && (!((X = j.variants) != null && X.length) || !((ne = M.value) != null && ne.state) || j.variants.includes(M.value.state)) ? (u(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: j.pressed }),
                    "aria-pressed": j.pressed,
                    "aria-label": j.label,
                    title: j.label,
                    "data-dock-action": j.action,
                    onClick: (ie) => O(j)
                  }, {
                    default: q(() => [
                      D(ye, {
                        name: j.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : C("", !0)
                ], 64);
              }), 128))
            ])) : C("", !0),
            y("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (T = s.value) != null && T.leaves_after_seconds ? C("", !0) : (u(), h(G, { key: 0 }, [
                te(k(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: q(() => [
          J.value || e.refusal ? (u(), h("p", g0, k(J.value || e.refusal), 1)) : C("", !0)
        ]),
        foot: q(() => {
          var E, T;
          return [
            y("span", v0, [
              R.value ? (u(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, k(R.value), 3)) : C("", !0),
              (E = s.value) != null && E.word ? (u(), h("span", y0, k(s.value.word), 1)) : C("", !0),
              y("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (u(), h("span", b0, "Kept")) : C("", !0)
            ]),
            (T = s.value) != null && T.folds ? (u(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: $[0] || ($[0] = (j) => n("fold"))
            }, {
              default: q(() => [
                te(k(s.value.folds) + " ", 1),
                D($t, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : C("", !0),
            y("span", w0, [
              y("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              D(Sd, {
                name: `dock.${e.item.type}`,
                row: M.value,
                environment: P(m).environment,
                "read-only": P(m).readOnly,
                "object-name": P(Pn)(e.item.target_model),
                "external-failure": "",
                onFailure: $[1] || ($[1] = (j) => J.value = j),
                onDone: A.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), h(G, null, ee(w.value, (j) => (u(), H(de, {
                key: j.action + j.runs,
                small: "",
                variant: j.primary ? "primary" : "ghost",
                bordered: !j.primary,
                "data-dock-action": j.action,
                onClick: (X) => O(j)
              }, {
                default: q(() => [
                  te(k(j.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              D(de, {
                small: "",
                bordered: "",
                title: b.value.label,
                "data-dock-action": "undock",
                onClick: $[2] || ($[2] = (j) => n("undock", b.value))
              }, {
                default: q(() => [...$[4] || ($[4] = [
                  te("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: q(() => {
          var E;
          return [
            (E = s.value) != null && E.body_url ? (u(), H(ns, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: c.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : C("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Oo = /* @__PURE__ */ Y(k0, [["__scopeId", "data-v-6e7150f5"]]), x0 = ["title", "aria-label"], $0 = { class: "run-chip-in" }, M0 = {
  key: 0,
  class: "run-chip-ring"
}, S0 = { class: "run-chip-name" }, _0 = { class: "run-chip-bar" }, E0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = We(), o = I(() => `run.${a.item.target_id}`), l = I(() => s.props[o.value].data.value), r = I(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = I(() => {
      var m, g;
      return ((m = l.value) == null ? void 0 : m.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), c = I(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let f = null;
    return Re(() => {
      var m;
      d(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), ft(() => f == null ? void 0 : f()), (m, g) => {
      var v;
      return u(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": c.value })
      }, [
        P(wt)(e.item) ? (u(), H($r, {
          key: 0,
          "ends-at": P(ea)(e.item)
        }, null, 8, ["ends-at"])) : C("", !0),
        y("span", $0, [
          r.value ? (u(), h("span", M0)) : (u(), H(dt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          y("span", S0, k(i.value), 1)
        ]),
        y("span", _0, [
          y("i", {
            style: ge({ width: r.value ? `${((v = l.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, x0);
    };
  }
}, A0 = /* @__PURE__ */ Y(E0, [["__scopeId", "data-v-9783c7e3"]]), C0 = 24, O0 = 8, m4 = 420;
function p4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= C0 ? !0 : e < t && s > O0 ? !1 : null;
}
const T0 = (e, t) => e === void 0 ? t : e, R0 = { me: 1, people: [] }, Wn = Yn({
  spec: null,
  drafting: 0,
  quoting: null,
  dumping: !1,
  dumpSelected: 0,
  dumpFiles: [],
  pane: "chat",
  skill: "",
  pluginPage: null,
  identity: null,
  rows: {},
  elsewhere: {},
  paging: { size: {}, more: {} },
  counts: {},
  entries: [],
  settings: null,
  agents: [],
  live: [],
  journals: [],
  summary: null,
  people: R0,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Nn("journal.activity", !0),
  wide: !1,
  sideMini: Nn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Dl("journal.activity", () => Wn.activity);
Dl("journal.side.mini", () => Wn.sideMini);
const Sr = "journal.viewer.";
function I0(e, t, n) {
  try {
    const a = n.getItem(Sr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function B0(e, t, n) {
  try {
    n.setItem(Sr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function To(e, t, n = window.localStorage) {
  const a = L(I0(e, t, n));
  return fe(a, (s) => B0(e, s, n), { deep: !0 }), a;
}
const L0 = {
  key: "dock-all",
  class: "dock-all"
}, N0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, D0 = { class: "dock-runs-title" }, j0 = { class: "dock-runs-chips" }, P0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var _, p;
    const t = e, n = ig(500), a = L(/* @__PURE__ */ new Set()), s = L(!1), o = L(!1), l = Oe(Le), r = L(/* @__PURE__ */ new Set()), i = L({});
    async function c(S, E) {
      i.value = { ...i.value, [S.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, S.id]);
      const T = await cn(E, { id: S.target_id }, l.environment);
      (T == null ? void 0 : T.ok) === !1 && (r.value = new Set([...r.value].filter((j) => j !== S.id)), i.value = { ...i.value, [S.id]: `Could not close this card: ${T.error}` });
    }
    const d = I(
      () => s0(
        t.items.filter((S) => !r.value.has(S.id)),
        n.value,
        a.value
      )
    ), f = I(
      () => o0(
        d.value.filter((S) => $a(S, zt)),
        n.value
      )
    ), m = I(() => d.value.filter((S) => !f.value.includes(S) && !$a(S, zt))), g = I(() => f.value.filter((S) => !wt(S))), v = To(`dock-size:${((_ = Wn.identity) == null ? void 0 : _.root) || location.host}`, null), x = (S) => v.value ? v.value.collapsed && !v.value.opened.includes(S.id) : t.collapsed, M = I(() => d.value.some(x)), B = I(() => (s.value = l0(f.value.length, s.value, g.value.length)) && !o.value && !d.value.some(x));
    function F() {
      v.value = { collapsed: !M.value, opened: [] };
    }
    function J(S) {
      var T;
      if (!x(S)) return;
      const E = (T = v.value) != null && T.collapsed ? v.value.opened : [];
      v.value = { collapsed: !0, opened: [...E, S.id] };
    }
    const O = To(`dock-folded:${((p = Wn.identity) == null ? void 0 : p.root) || location.host}`, {}), w = (S) => {
      var E;
      return !!((E = zt(S.type)) != null && E.folds) && T0(O.value[S.id], $a(S, zt) || t.folded);
    };
    function R(S) {
      O.value = { ...O.value, [S.id]: !w(S) };
    }
    function b(S) {
      O.value = { ...O.value, ...Object.fromEntries(f.value.map((E) => [E.id, E.id !== S.id])) }, o.value = !0;
    }
    function A() {
      O.value = Object.fromEntries(Object.entries(O.value).filter(([S]) => !f.value.some((E) => String(E.id) === S))), o.value = !1;
    }
    function $(S) {
      a.value = /* @__PURE__ */ new Set([...a.value, S.id]);
    }
    function N(S) {
      a.value = new Set([...a.value].filter((E) => E !== S.id));
    }
    return (S, E) => (u(), H(tl, {
      tag: "div",
      name: "dock",
      duration: P(kr),
      class: "dock-stack"
    }, {
      default: q(() => [
        d.value.length > 1 ? (u(), h("div", L0, [
          D(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": M.value ? "Open all" : "Collapse all",
            onClick: F
          }, {
            default: q(() => [
              D($t, {
                open: !M.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : C("", !0),
        (u(!0), h(G, null, ee(m.value, (T) => (u(), H(Oo, {
          key: T.id,
          item: T,
          class: Z({ timed: P(wt)(T) }),
          leaving: P(wt)(T) && !a.value.has(T.id),
          folded: w(T),
          collapsed: x(T),
          refusal: i.value[T.id],
          onOpen: (j) => J(T),
          onFold: (j) => R(T),
          onUndock: (j) => c(T, j),
          onMouseenter: (j) => $(T),
          onMouseleave: (j) => N(T)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !M.value ? (u(), h("div", N0, [
          y("span", null, k(f.value.length) + " runs", 1),
          D(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: A
          }, {
            default: q(() => [
              E[1] || (E[1] = te(" Runs ", -1)),
              D($t, { open: "" })
            ]),
            _: 1
          })
        ])) : C("", !0),
        (u(!0), h(G, null, ee(B.value ? [] : f.value, (T) => (u(), H(Oo, {
          key: T.id,
          item: T,
          class: Z({ timed: P(wt)(T) }),
          leaving: P(wt)(T) && !a.value.has(T.id),
          folded: w(T),
          collapsed: x(T),
          refusal: i.value[T.id],
          onOpen: (j) => J(T),
          onFold: (j) => R(T),
          onUndock: (j) => c(T, j),
          onMouseenter: (j) => $(T),
          onMouseleave: (j) => N(T)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        B.value ? (u(), H(xr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: q(() => [
            D(ye, {
              name: "runs",
              size: 14
            }),
            y("span", D0, k(f.value.length) + " runs", 1)
          ]),
          foot: q(() => [
            y("span", j0, [
              (u(!0), h(G, null, ee(f.value, (T) => (u(), H(A0, {
                key: T.id,
                item: T,
                onClick: (j) => b(T)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            D(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: E[0] || (E[0] = (T) => o.value = !0)
            }, {
              default: q(() => [
                E[2] || (E[2] = te(" Runs ", -1)),
                D($t)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : C("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, g4 = /* @__PURE__ */ Y(P0, [["__scopeId", "data-v-f7b03628"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Rn = (e) => Math.min(Math.max(e, 0), 1), q0 = (e) => {
  const t = Rn(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => q0((e - t) / (n - t));
function v4(e) {
  const t = Rn(e), n = Rn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = gt(s, 0.26, 0.38) * (1 - gt(s, 0.76, 0.96)), l = gt(s, 0.38, 0.76), r = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), i = gt(s, 0.2, 0.34) * (1 - gt(s, 0.84, 1)), c = Math.sin(Math.PI * Rn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: r, weight: i, follow: c, shuffle: a, phase: s };
}
function y4(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Ro = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, b4 = (e) => Ro[e] ?? Ro.butler, Cs = 2400, F0 = 0.05;
function W0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, F0), l = Math.min(t + Cs * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function w4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function H0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function k4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const x4 = (e, t) => ({ ...e, stretch: t.stretch }), $4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, _r = (e, t) => t >= (e.least ?? 0);
function M4(e, t, n) {
  if (!_r(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const S4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), z0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Io = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), U0 = (e) => e.right > e.left && e.bottom > e.top;
function _4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(z0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Io(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Io(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), U0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function Er(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const g = t[d] - e[d];
      if (Math.abs(g) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const v = (o[f] - e[d]) / g, x = (o[m] - e[d]) / g;
        l = Math.max(l, Math.min(v, x)), r = Math.min(r, Math.max(v, x));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: c, on: "surface", surface: s.id, dx: i - s.left, dy: c - s.top };
  }
  return a;
}
const _e = {
  // a celebration: it jumps for joy `jumps` times with its arms flung up, each jump a little lower than the last
  joy: { frames: 50, fps: 14, jumps: 5 },
  // a worker sent off or another session messaged: a call on an old desk telephone (figure.js TELEPHONE). The telephone appears on the
  // floor before it, whole, in a poof of smoke over `poof`, `above` its units over the floor, drops onto it over `drop` and settles with
  // a jiggle over `settle`, squashing `squash` flat as it lands and wobbling `wobbles` times to still (figure.js phoneArrival), its handset
  // resting on the cradle a moment; it bends to the handset over `reach` and lifts it to its ear over `lift`; it bends to the dial and
  // puts a finger in it over `finger` and turns it `turn` degrees over `dial`; over `back` the finger withdraws first for `release` of
  // that phase, then the dial springs back once the finger is clear. It
  // talks over `talk`, nodding `nods` times; it bends to put the handset back on the cradle over `hang`, stands back from it a moment, and the telephone goes in a poof over `goes`
  // While it talks and until the handset is down it says whom it calls in a speech bubble beside its head (figure/places.js callSays)
  // Seated it follows the same phases. The set sits beside and behind the hip, turned inward toward the hands; the torso
  // leans toward it while the far hand dials, then returns upright. `beside` and `behind` place it in the figure's units, `turn` rotates
  // the dial toward its owner, `lean` is the dialling lean in degrees, and `backLean` tips the torso toward the set for pickup.
  // phonePlacement.js reserves the complete rotated base and receiver footprint on the seat.
  phone_call: { frames: 108, fps: 12, poof: [0, 0.06], above: 0.7, drop: [0.015, 0.055], settle: [0.055, 0.12], squash: 0.24, wobbles: 3, reach: [0.13, 0.2], lift: [0.2, 0.28], finger: [0.28, 0.33], dial: [0.33, 0.42], turn: 250, back: [0.42, 0.5], release: 0.25, talk: [0.5, 0.72], nods: 3, hang: [0.72, 0.84], goes: [0.92, 1], seated: { finger: [0.28, 0.33], dial: [0.33, 0.42], back: [0.42, 0.5], reach: [0.13, 0.2], lift: [0.2, 0.28], beside: 1.2, behind: 0.95, wide: 0.82, turn: 45, lean: 20, backLean: 8 } },
  // a question asked: it raises a sign with a question mark on a stick over its head and waggles it
  ask_sign: { frames: 42, fps: 12, raise: [0, 0.22], waggle: [0.22, 0.78], waggles: 3, lower: [0.78, 1] },
  // a report: it brings the rolled scroll up before its chest over `raise`, a roller in each hand, the free hand's on top; pulls the
  // rollers apart over `unrolls`, the written side toward itself and the parchment's plain back to the viewer (figure.js SCROLL); reads
  // it `lines` lines down, its head going slowly along each; rolls it closed between its hands over `rolls` and lowers it over `lower`
  scroll: { frames: 96, fps: 12, raise: [0, 0.09], unrolls: [0.09, 0.22], rolls: [0.85, 0.93], lower: [0.93, 1], lines: 3 },
  // a task finished, a job well done: standing, it brings its hands together before its chest over `together`, rubs them round each
  // other `rubs` times, slowly, a stroke and a half a second at most, nodding a little with each, and lowers them over `apart`; `puffs`
  // small puffs rise from the hands once each over `puff`, with `sparkles` sparkles among them (chat/act/HandRub.vue)
  hand_rub: { frames: 48, fps: 12, together: [0, 0.12], rubs: 2, apart: [0.88, 1], puff: [0.2, 0.9], puffs: 2, sparkles: 1 },
  // stopping to think at the laptop (figure.js type_ponder), under the thought cloud, its dots pulsing three times a loop
  type_ponder: { frames: 24, fps: 6, pulse: 4 / 3 },
  // The thinking act, now and then while the agent thinks (figure.js thinkingClip, reactions.js thinkingAct), in its three plays. With
  // the cloud: it raises its finger to its cheek over `into`, tilting its head up, swaying `sways` times; three puffs rise from its head
  // over `puffs` into a small thought cloud over it, held over `cloud`, its three dots pulsing one after another, `pulse` seconds round
  // (chat/FigureAct.vue), and over `rise` its hand comes away. With the bulb: over `rise` the finger comes up, "got it", the light bulb
  // over the head (figure.js LIGHT_BULB) appears over `appears`, switches on over `lights`, glows, goes out over `fades` and is gone over
  // `goes`. "ponder" has both, the bulb at its end; "think_cloud" the cloud alone, its hand going down; "got_it" the bulb alone.
  ponder: { frames: 84, fps: 12, into: [0, 0.1], puffs: [0.06, 0.24], cloud: [0.06, 0.72], pulse: 1.2, sways: 2, rise: [0.72, 0.8], appears: [0.75, 0.78], lights: [0.79, 0.82], fades: [0.9, 0.96], goes: [0.95, 1] },
  think_cloud: { frames: 66, fps: 12, into: [0, 0.12], puffs: [0.07, 0.29], cloud: [0.07, 0.86], pulse: 1.2, sways: 2, rise: [0.86, 1] },
  got_it: { frames: 30, fps: 12, rise: [0, 0.25], appears: [0.05, 0.15], lights: [0.18, 0.26], fades: [0.72, 0.88], goes: [0.86, 1] },
  // a fact or a reminder: a small cabinet grows beside it, its drawer slides out, it files a card in it and the drawer shuts
  file_card: { frames: 42, fps: 12, grows: [0, 0.15], opens: [0.12, 0.28], reach: [0.2, 0.44], filed: [0.44, 0.56], back: [0.56, 0.72], shuts: [0.58, 0.72], sinks: [0.86, 1] },
  // searching from the compose box: binoculars at its eyes, tipped `up` degrees up the chat and scanning slowly up and down it `scan`
  // degrees either way, twice, with a little turn left and right
  binoculars: { frames: 100, fps: 10, sweep: 1, up: 9, scan: 6 },
  // searching, now and then: at the edge of the chat window the figure reaches past it into the space beyond, where nothing is seen, and
  // rummages there like a cartoon character hunting through a closet: it turns side-on to the edge and leans in, head and shoulders past
  // it, over `leans`, digging about `digs` times, and flings what it pulls out back over its shoulder, one thing at each of `throws`, each
  // from `from` (the figure's units, across, forward and up, before it turns side-on) on the arc its throw gives it (throwsFor), shrinking
  // away to nothing over `shrinks` once it lands; over `pops` it pulls back out, having found nothing
  rummage: {
    frames: 120,
    fps: 12,
    leans: [0.05, 0.14],
    digs: 7,
    pops: [0.8, 0.9],
    throws: [0.18, 0.28, 0.38, 0.48],
    from: [0, -1.5, 1.5],
    shrinks: 0.05
  },
  // a bar it was eager for failed: crushed at first, then plainly mad about it, stamping and fuming, steam rising off its head
  fume: { frames: 54, fps: 12, crushed: [0, 0.36], mad: [0.36, 0.96], stamps: 6, steam: [0.42, 0.96] },
  // Each voice has its own angry performance, with a full recovery before ordinary activity resumes.
  tantrum: { frames: 108, fps: 18, hops: 6 },
  // a rope swing tied under a bubble, drawn whole from the act's first frame: its two ropes `rope` of the figure's height long from the
  // middle of the bubble's bottom edge, `ties` of it apart, just outside the figure's arms, down to a seat `seat` of it wide, a little wider
  // than its body, whose top is `under` of it below the line the figure sits on, where its thighs' underside rests. Its frames are an
  // intro, the figure sitting down onto the seat as it starts to swing; a held stretch looped for `swings` pendulum cycles toward the
  // camera and away, `angle` degrees either side of the bottom, around the fixed knots, its legs pumping; and an outro, settling as the
  // figure rises off it. The ropes stay straight and keep their length, the seat rising at both ends of the arc. The knots stand at
  // least `room` of the figure's height in from the chat's sides, with `clearance` extra room kept around the hanging figure.
  rope_swing: { intro: 12, hold: 60, outro: 12, fps: 12, swings: 2, rope: 0.62, ties: 0.53, seat: 0.59, under: 0.025, angle: 20, clearance: 0.12, room: 0.85 },
  // a pogo stick up onto a bubble's top: it reaches behind its back and pulls the stick out over `draw`, bounces `count` times on the spot
  // over `bounces`, each higher than the last up to `bounce` of its height, and springs up over `spring` to the top of its throw, `over`
  // of its height past the bubble's edge; there it lets the stick go over `release`, the stick falling away over `drop`, and it falls
  // onto the bubble on its own feet; every hop and the fall are timed by one gravity (pogoHop); the lower shaft keeps its existing
  // `stick`-based length, with the handles `handles` of the picture's height above the feet, shared by the stick and the hands
  pogo: { frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], over: 0.3, release: [0.82, 0.86], drop: [0.82, 1], stick: 0.62, handles: 0.2455 },
  // a fixed run's bugs: two to five of them crawl along the chat window's walls (WALL_BUGS); the figure first walks to its firing spot,
  // turns its whole body toward each wall (back toward the screen for a top-wall bug), and pulls a rifle from behind its back
  // over `draw` and shoulders it, then shoots them one by one, each in its own `turn` of the act played over again for every bug
  // (bugShotFrame): it swings its aim onto the bug over `aim`, shoots `count` bursts over `shots`, each kicking the rifle and the shoulder
  // back, and the bug splatters on its wall at `splat`; after the last, drops of its splatter fly out at the screen over `fly`, growing
  // as they come, land on it as on a camera's lens at their `lens` places (from the figure's middle, in shares of the picture, as big as
  // `size`), and run down and fade over `drops`, as the rifle is lowered; a bug steeper from the figure's eyes than `back.limit` degrees is
  // first backed away from along the floor, facing it, stepping `back.stride` of the picture at a time, to within it (backPlan), never
  // nearer an end of its floor than `back.margin` of the picture
  bug_shot: {
    frames: 80,
    fps: 12,
    draw: [0, 0.22],
    turn: [0.25, 0.55],
    aim: [0.25, 0.32],
    shots: [0.33, 0.48],
    count: 2,
    splat: 0.48,
    fly: [0.56, 0.64],
    drops: [0.64, 1],
    back: { limit: 55, margin: 0.25, stride: 0.5 },
    lens: [{ at: [-1.3, -1.6], size: 0.2 }, { at: [0.9, -0.9], size: 0.14 }, { at: [-0.4, 0.2], size: 0.16 }, { at: [1.6, -2.1], size: 0.1 }]
  },
  // a fixed run's bug smashed with a big wooden mallet on the floor the figure stands on (smashPlan): the bug climbs up the back of the
  // floor's box, out of sight behind it, over `emerge`, comes over its top edge onto it over `climb`, and it and the figure walk to meet
  // each other over `walk`, until it is `away` of the picture out on the figure's left (`side`); the figure raises the mallet high before
  // its head over `raise` and holds it there for the wind-up until `swing`, swings it down over `swing` and flattens the bug at `blow`,
  // which lies flat and fades over `gone`, and lowers the mallet over `lower`
  bug_smash: {
    frames: 96,
    fps: 12,
    side: 1,
    emerge: [0, 0.09],
    climb: [0.09, 0.16],
    walk: [0.16, 0.38],
    raise: [0.46, 0.58],
    swing: [0.66, 0.72],
    blow: 0.72,
    gone: [0.84, 0.95],
    lower: [0.88, 0.95],
    away: 0.42
  },
  // a sin repented: a halo grows over the head over `grows` and fades over `fades`, the figure floating up `float` of its units and down
  // with its hands folded and a serene, holy look
  halo: { frames: 48, fps: 12, grows: [0, 0.15], fades: [0.85, 1], float: 0.01 },
  // A confession: the hands come to the chest during the descent, the head bows after the shoulders, and the figure rises slowly.
  repent: { frames: 84, fps: 12, stand: [0, 0.12], kneel: [0.12, 0.34], out: [0.18, 0.4], up: [0.34, 0.48], hold: [0.48, 0.74], down: [0.74, 0.86], rise: [0.76, 1] },
  // a disco dance under a disco ball: the classic move, one arm pointing up and the other down, switching sides `beats` times, the hips
  // swaying and the knees bouncing, the visor flashing through the colours; the ball `ball` of the picture across, turning, hung `clear`
  // of it over the hat, on a string at least `tie` of it long from the bottom of a bubble no further than `far` of the figure's height
  // above the hat
  disco: { frames: 96, fps: 12, beats: 8, ball: 0.24, clear: 0.08, tie: 0.1, far: 2.2 },
  // leaning against a wall to rest (perches.js leanSpot): the wall `wall` of the picture out from its middle, the hand flat against it
  // `contact` of the figure's units above its feet; the whole body tilted `tilt` degrees toward it from the feet, its weight on that hand;
  // the other hand on its hip at `hip` (across, forward, up); the ankles crossed, the inner leg turned in `inner` degrees and the outer
  // `outer`, swung `over` degrees before the inner so its foot crosses over in front
  lean: { wall: 0.33, contact: 1.95, tilt: 16, hip: [0.62, 0.05, 1.5], inner: 20, outer: 42, over: 12 },
  // coming down on a parachute, swaying `sway` degrees under it, its canopy (figure.js canopyOf) `width` of the picture across with its
  // rim `above` of the picture over the eyes, the lines running from the rim down to the hands
  chute: { frames: 24, fps: 8, sway: 8, width: 0.66, above: 0.5 },
  // compacting: a box appears, it hops into it and the box shrinks with it inside; once the compaction is over the box grows back and
  // pops in a puff, and it jumps out. Its frames are an intro, a held stretch looped while the compaction lasts, and an outro
  pack_box: { intro: 36, hold: 24, outro: 26, fps: 12, appears: [0, 0.3], hop: [0.3, 0.62], into: [0.55, 0.88], shrinks: [0.86, 1], grows: [0, 0.3], pops: 0.38, leap: [0.38, 0.88], small: 0.5 },
  // compacting: a press comes down onto its head, it holds it up with both hands and is squashed under it, and springs back once it lifts
  press: { intro: 24, hold: 24, outro: 24, fps: 12, lowers: [0, 0.55], squashes: [0.5, 1], frees: [0, 0.3], springs: [0.25, 0.7], lifts: [0.3, 1], flat: 0.42 },
  // compacting: it vacuums up the words flying in from beside it, the canister on the floor and the nozzle in its hand
  vacuum: { intro: 10, hold: 40, outro: 10, fps: 10, words: 5 }
}, en = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), V0 = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => V0(en(e, t, n)), G0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Sn = ([e, t], n) => e + n() * (t - e);
function K0(e) {
  return G0.map(() => {
    const t = Sn(it.speed, e), n = Sn(it.angle, e) * Math.PI / 180, a = Sn(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Sn(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Y0 = K0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function J0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function E4(e, t, n = Y0) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = J0(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), c = a.from.map((d, f) => d + o.velocity[f] * i);
  return c[2] -= it.gravity * i * i / 2, { at: c, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const A4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function C4(e, t) {
  const n = e.map((o) => Math.sqrt(o)), a = n.reduce((o, l) => o + l, 0);
  let s = Math.min(Math.max(t, 0), 1) * a;
  for (const [o, l] of n.entries()) {
    if (s <= l || o === n.length - 1) {
      const r = l > 0 ? Math.min(s / l, 1) : 1;
      return { index: o, s: r, height: e[o] * 4 * r * (1 - r) };
    }
    s -= l;
  }
  return { index: 0, s: 1, height: 0 };
}
const O4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function T4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), c = i - o - e, d = i - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function R4(e, t, n) {
  const a = _e.bug_smash, s = Ee(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Lt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Lt.tall * n * (1 - Ee(t, a.emerge)),
      turn: 90 * (1 - Ee(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ee(t, a.gone)
    }
  };
}
function I4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = W0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function B4(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ss(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ie.margin, l = ((e.along - Ie.margin + e.way * Ie.speed * n / a) / s % 2 + 2) % 2, r = Ie.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function Z0(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = H0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: c };
}
function L4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = Z0(n, e.length), c = e.map((B, F) => ({ ...ss(B, t, Math.min(n / o.fps, In(F).shot)), shot: F < i })), d = Ee(l / o.frames, o.aim), [f, m] = [c[Math.max(r - 1, 0)], c[r]], g = e.map((B, F) => ({ bug: B, index: F, seconds: n / o.fps - In(F).shot, spot: ss(B, t, In(F).shot) })).filter((B) => B.seconds >= 0), v = g.flatMap((B) => {
    const F = (s == null ? void 0 : s.get(B.index)) ?? ny(B.bug, t, B.spot, s ? [] : a);
    return s == null || s.set(B.index, F), s && ay(F, B.seconds, a), sy(F, B.seconds, a);
  }), x = g.filter((B) => ey(B.bug)).map((B) => ({ seconds: B.seconds, from: B.spot })), M = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: M }, slush: v, camera: x };
}
function In(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function N4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((c, d) => {
    const f = In(d), m = ss(c, t, f.shot), g = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), v = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), x = Math.abs(m.x - i) >= g ? i : m.x + v * g, M = v > 0 ? Math.max(i, Math.min(x, r)) : Math.min(i, Math.max(x, l)), B = { from: i, to: M, begin: f.walk, end: f.aim };
    return i = M, B;
  });
}
function D4(e, t, n) {
  var o;
  const a = _e.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Ee(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, X0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Q0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const ey = (e) => e.along * 97 % 1 < $e.camera, tn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function ty(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let r = e.from;
  for (let c = 0; c < l.t; c += $e.step) {
    const d = Math.min(c + $e.step, l.t), f = tn(e, d), m = Er(r, f, n);
    if (m) return { ...m, t: c + (d - c) * m.share };
    r = f;
  }
  const i = tn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function ny(e, t, n, a = []) {
  const s = Q0(e.along + 1), [o, l] = X0[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), c = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * c, vy: Math.sin(i) * c, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...ty(d, t, a) };
  });
}
function ay(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += $e.step) {
      const l = Math.min(o + $e.step, s), r = Er(tn(a, o), tn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function sy(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...tn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function j4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, c]), m = Ee(e, [c, c + d]);
  return l.map((g) => {
    const v = { x: a.x + g.at[0] * t, y: a.y + g.at[1] * t };
    return {
      x: n.x + (v.x - n.x) * f,
      y: n.y + (v.y - n.y) * f,
      r: g.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function P4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (x) => {
    const [M, B] = [x.x - e.at.x, x.y - e.at.y];
    return { x: r.x + M * c - B * d, y: r.y + M * d + B * c };
  }, [m, g] = [...n].sort((x, M) => x.x - M.x), v = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: v.map((x, M) => ({ from: x, to: M < v.length / 2 ? m : g })) };
}
const q4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function Hn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: en(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: en(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function F4(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Hn(n, t), l = 1 - (1 - n.small) * Ee(a, n.shrinks) * (1 - Ee(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Hn(n, t), o = n.flat * Ee(a, n.squashes) * (1 - Ee(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * en(s, ...n.springs)) * (1 - en(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const W4 = (e) => e === "pack_box";
function H4(e) {
  const { into: t, out: n } = Hn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function z4(e) {
  const t = _e.rope_swing, { into: n, out: a } = Hn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const oy = { after: 3 }, Os = 10, ly = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, ry = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, iy = { weight: 19 }, Ar = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, cy = { every: 120 }, Cr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Or = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, uy = {
  "❤️": "hearts",
  "👍": "amused",
  "🎉": "startled",
  "😄": "amused",
  "👀": "reading",
  "🙏": "hearts",
  "👎": "worried",
  "💔": "worried",
  "😠": "angry",
  "🎩": "amused",
  "🧐": "reading",
  "🥂": "amused",
  "🤙": "amused",
  "😎": "amused",
  "🔥": "startled",
  "💪": "amused",
  "🏆": "hearts",
  "⚔️": "angry",
  "🛡️": "worried",
  "🏰": "amused"
}, dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Os }), ae = (e, t, n = {}) => dn(e, "clip", t, n), Ma = (e, t, n = {}) => dn(e, "look", t, n), Bo = (e, t, n = {}) => dn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...dn(e, "pick", t, n), ...a }), we = (e) => dn("nothing", "nothing", e, {}), dy = 120, fy = 300, Sa = (e, t) => ({ ...ae(e, t), cooldown: fy }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), hy = () => [ae("joy", 2)], vt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), yt = (e) => ({ ...e, cooldown: ly[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: ry[e.name] }), ta = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...re("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...re("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...yt(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...yt(ae("bug_smash", 2)), toward: "", onto: !1 },
    ae("nod", 2)
  ]),
  ...re("tests_failed", { cooldown: 20, toward: "card" }, [ae("startled", 2), ae("dismay", 1), ae("tantrum", 3), we(1)]),
  ...re("committed", { cooldown: 30, toward: "card", onto: !0 }, [ae("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...re("sin_fixed", { cooldown: 300 }, [ae("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...re("sin_committed", { cooldown: 300 }, [ae("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...re("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ae("nod", 4), ae("hand_rub", 4), we(7)]),
  ...re("question_asked", { cooldown: 60 }, [ae("ask_sign", 9), ae("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...re("reported", { cooldown: 90 }, [Bo("read", 3), ae("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [Bo("read", 3), we(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), we(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, hy()),
  ...re("bar_failed", { holds: !0 }, [ae("fume", 1), ae("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...re("standing", { cooldown: 12 }, [ae("look_left", 2), ae("look_right", 2), ae("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...re("launched", { cooldown: 300 }, [ae("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...re("building", { cooldown: 30 }, [ae("wipe_brow", 4), ae("look_left", 1), ae("look_right", 1), we(69)]),
  ...re("failed", { cooldown: 20, toward: "card" }, [ae("shake", 3), ae("tantrum", 2), we(2)]),
  ...re("refused", { cooldown: 20 }, [ae("shake", 1), we(1)]),
  ...re("work_done", { cooldown: 120 }, [ae("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...re("pondering", { cooldown: [30, 60] }, [pe("ponder", 1)]),
  ...re("thought_cloud", { cooldown: 90 }, [pe("cloud", 1)]),
  ...re("light_bulb", { cooldown: 150 }, [pe("bulb", 1)]),
  ...re("answered", { cooldown: 15 }, [Ma("amused", 3), we(2)]),
  ...re("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ae("stumble", 3), we(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), we(13)]),
  ...re("typing", { cooldown: 60 }, [Ma("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(uy).flatMap(([e, t]) => re(`reacted:${e}`, {}, [Ma(t, 1)])),
  ...Object.entries(Cr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Or).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...re("pastime", {}, [
    vt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    vt("rest", 3, 180, 120),
    vt("yawn", 2, 60, 60),
    vt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    vt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    vt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    vt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Wt(yt(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(yt(ae("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...re("held:search", { cooldown: dy }, [Sa("search", 3), { ...Sa("binoculars", 2), when: { home: !0 } }, { ...Sa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...re("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...re("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...re("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...re("tickled", {}, [{ ...yt(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...re("eager", {}, [ae("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...re("jump", {}, [Wt(yt(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...re("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...re("unit", { cooldown: Ar.build.cooldown }, [pe("unit", iy.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: cy.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...re("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...re("roam", {}, [
    pe("rest", 35, {}, { stay: [25, 60] }),
    pe("seat", 15, {}, { stay: [15, 40] }),
    pe("edge", 25, {}, { stay: [8, 20] }),
    Wt(pe("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    pe("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    pe("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    pe("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    pe("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    pe("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Wt(yt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...re("laptop", {}, [pe("seat", 6, {}, { stay: [60, 150] }), pe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...re("ledge_at", {}, [pe("middle", 2, {}, { along: 1 / 2 }), pe("third", 1, {}, { along: 1 / 3 }), pe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...re("composed_as", {}, [
    pe("facing", 4, {}, { turn: 0, leans: 0 }),
    pe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    pe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    pe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    pe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Tr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Rr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), my = (e) => Array.isArray(e) ? e[0] : e, py = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, gy = (e) => ta.some((t) => t.when.moment === e);
function vy(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Rr(d).every(([f, m]) => n(f) >= my(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ta.filter((d) => Tr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= oy.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function Ue(e, t) {
  const n = vy(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Ir(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ir(e, t, n) {
  var a;
  for (const [s, o] of Rr(t)) (a = e.memory) == null || a.set(s, e.now + py(o, n));
}
function U4(e, t, n) {
  Ir(e, ta.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const V4 = (e) => Object.values(Ar).find((t) => Tr(t.when, e)) ?? null, yy = (e, t, n) => n - t <= (e.lifetime ?? Os), G4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || _r(e.clip, t));
class Br {
  constructor(t) {
    this.card = t;
  }
  isTest() {
    var t;
    return !!((t = this.card.guesses) != null && t.test);
  }
  isBuild() {
    var t;
    return !!((t = this.card.guesses) != null && t.build);
  }
  isUpload() {
    var t;
    return !!((t = this.card.guesses) != null && t.upload);
  }
}
const os = {
  idle: "idle",
  asleep: "sleep",
  thinking: "idle",
  quiet: "idle",
  searching: "search",
  reading: "read",
  writing: "type",
  testing: "idle",
  building: "work",
  running: "idle",
  waiting: "waiting",
  asking: "waiting",
  compacting: "compacting",
  paused: "idle",
  stopped: "sleep"
}, K4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Lr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), Y4 = {
  Read: "reading",
  Grep: "searching",
  Glob: "searching",
  WebSearch: "searching",
  WebFetch: "searching",
  Edit: "writing",
  MultiEdit: "writing",
  Write: "writing",
  NotebookEdit: "writing",
  Bash: "running"
}, J4 = 120, by = 20, Z4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < by), wy = (e) => os[e] || os.idle, X4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Nr = "airborne", ky = "landing", xy = "travelling", Dr = "grounded", Q4 = ({ airborne: e, landing: t, trip: n }) => e ? Nr : t ? ky : n != null && n.started ? xy : Dr;
function ex(e, t) {
  var s;
  const n = $y(e, t);
  return e.mode === Dr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function $y(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: c, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Nr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...My(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && c === "asking") return { clip: "point", facing: 0 };
  const g = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : wy(c), facing: g ? m : r.posture === "sit" ? r.face : f };
}
function My(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ls = (e) => e.outcome, Sy = "plugin:code-commandments:sins:", Lo = (e) => e.type === "plugins.card" && e.markKey.startsWith(Sy), _y = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Lo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Lo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], tx = (e, t) => e.filter((n) => n.author === "user" && qn(n.read_at) > t).map((n) => ({ beat: "read_message", time: qn(n.read_at), card: Xl(n) })).sort((n, a) => n.time - a.time), No = { user: "reacted", agent: "agent_reacted" };
function nx(e, t) {
  return e.filter((n) => No[n.author] && St(n) > t).map((n) => ({ beat: `${No[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Ey = [.../* @__PURE__ */ new Set([...Object.values(Cr).flatMap((e) => Object.keys(e)), ...Object.keys(Or)])];
function ax(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Ey.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: Xl(n) })).sort((n, a) => n.time - a.time);
}
const Ay = (e) => new Br(e).isTest(), zn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ls(e)] || "";
}, Cy = 1800, Oy = (e, t) => {
  if (zn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && zn(n) !== "finished" && Number(e.time) - Number(n.time) <= Cy ? "tests_fixed" : "tests_passed";
};
function sx(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Ay), s = a.filter((r) => zn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, zn(r))), o.map((r) => ({ beat: Oy(r, s), time: Number(r.time), card: r.key }));
}
function ox(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ls(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ls(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const lx = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: St(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function rx(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function ix(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function cx(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = _y.find((c) => c.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Ts(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Do = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Ty(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Ts(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function ux(e, t, n, a = {}) {
  const s = Ue({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : gy(`held:${e}`) ? "idle" : e;
}
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function dx(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Te.ahead * n ? 180 : Math.sign(a) * Te.turn;
}
const jo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function fx(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * a) / Te.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Te.sweep) % s, r = o % Te.sweep, i = Te.sweep - Te.returnSeconds, c = jo((r - i) / Te.returnSeconds), d = r <= i ? jo(r / i) : 1 - c, f = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Po = 3, jr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, qo = 12, hx = (e, t) => ({ mood: e, began: t, seen: 0 });
function mx(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!jr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Po ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * qo) / qo, lasts: Po } };
}
const px = (e) => e.posture === "hang" && !jr(e.face), Ry = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Iy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function gx(e, t, n) {
  return Ry.has(e) ? 1 / 0 : !Iy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Pr(n - t.began, t.share) - Qe.lead, 0);
}
const By = 5;
function vx(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= By ? { beat: "long_walk", time: n } : null };
}
const Ly = 30, _n = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function yx(e, t, n, a, s = null) {
  if (t && n < t.until || !_n.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ue({ moment: "spell", state: e, tally: s }, a), [l, r] = _n.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + _n.every } : { state: e, began: 0, until: 0, next: n + _n.every };
}
const bx = (e, t, n) => t && n < t.until && Lr.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Pr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function wx(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Pr(o, e.share);
  return s ? { eager: Ny(t, l), moment: null } : l > Qe.lead ? { eager: t, moment: null } : l < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ue({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Ny(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const Dy = 1, jy = { look: "look", gaze: "gaze" };
function Py(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ue({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [jy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const qy = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ue({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Fy = (e, t, n, a, s, o = 0) => Ue({ moment: "jump", high: e > Dy * t, memory: a, now: s, room: o }, n).name === "backflip", Wy = { work: ["building"], idle: ["standing"] };
function kx(e, t, n, a) {
  const s = os[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Wy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Lr.has(e) ? { moments: o, began: n || a } : (n && a - n >= Ly && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Hy(e, t, n) {
  return !Ue({ moment: "pondering", memory: e, now: t }, n) || !Ue({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ue({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Fo = { pondering: Hy };
function xx(e, t, n, a, s, o) {
  if (Fo[e.beat]) {
    const r = Fo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Py(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Os && { lifetime: l.lifetime } } } : null;
}
function $x(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = qy(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const Mx = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function Sx(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function _x(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Ex = (e, t) => !!(e != null && e.watches) && !t.once, Ax = 10, Cx = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || yy(a, a.queuedAt, n)), Ox = (e, t) => t ? null : e[0] ?? null;
function Tx(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const Rx = (e, t) => !t.during || !e.some((n) => n.during === t.during), zy = 2 * Math.PI, Uy = 500;
function Ix(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Uy, i = t && e.point && !!t.behind != !!e.point.behind, c = i && e.amount > 0, d = t && !c ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = zy * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, x = (c ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !i ? s && !t.behind && !g.behind ? Gy(g, t, n, m, s) : Yy(g, t, n, m) : t) ?? g, M = x != null && x.behind && x.mood === "reading" ? Vy(e.point, x, n, l, s) : x;
  return { point: M ?? null, toward: M ? { x: M.x - n.x, y: M.y - n.y } : null, amount: f, at: a };
}
function Vy(e, t, n, a, s) {
  const o = ($) => $ * 180 / Math.PI, l = ($) => o(Math.atan2(Math.sin($ * Math.PI / 180), Math.cos($ * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, g = f ? e.readingYaw + m : d, v = g + l(c - g), x = Math.min(Math.max(a / 1e3, 0), 0.1), M = Te.turnSpeed * x, B = f ? g + Math.min(Math.max(v - g, -M), M) : v, F = f ? e.readingFollow + m : B, J = F + (B - F) * (1 - Math.exp(-x / Te.followSeconds)), O = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, w = o(Ts(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), R = Math.min(Math.max(w, -O.up), O.down), b = Te.tipSpeed * x, A = f ? e.readingPitch + Math.min(Math.max(R - e.readingPitch, -b), b) : R;
  return { ...t, readingYaw: B, readingFollow: J, readingPitch: A, readingFacing: r };
}
function Gy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (F) => {
    const { yaw: J, pitch: O } = Ts(F.x - n.x, s, n.y - F.y, o);
    return { yaw: J, pitch: Math.min(Math.max(O, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, c] = [Do(r(e)), Do(r(t))], d = Math.acos(Math.min(Math.max(i[0] * c[0] + i[1] * c[1] + i[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, g] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [v, x, M] = i.map((F, J) => m * F + g * c[J]), B = s * v / x;
  return { ...t, x: n.x + B, y: n.y - Ty(B, s, -Math.asin(Math.min(Math.max(M, -1), 1)), o) };
}
const Ky = 0.15;
function Bx(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Ky;
}
function Yy(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Jy = (e) => !(e != null && e.on);
function Lx(e, t, n) {
  if (Jy(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const nn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, _a = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Wo = (e) => e * e * (3 - 2 * e);
function Zy(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = _a(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, a = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Wo(_a(e, ...Je.fade)), lit: a, white: e < Je.flash[0] ? 0 : 1 - Wo(_a(e, ...Je.flash)) };
}
const Nx = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Dx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Zy(t - e.at);
  return a && { colour: nn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...a } };
}
function jx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function Px(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= nn.looks || a === null && n - e.since >= nn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function qx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, Fx = { behind: 39, figure: 40, ahead: 41 }, Xy = "[data-figure-pile]", Qy = { amber: [1, 0.69, 0.125], good: nn.colours.good, bad: nn.colours.bad }, Bn = { phases: 4, ms: 230, dim: 0.25 }, Wx = (e, t, n) => e !== "amber" || (t + n) % Bn.phases < Bn.phases / 2 ? 1 : Bn.dim, Hx = (e) => e === "amber" ? Bn.phases : 1;
function zx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Ux = Object.keys(Qy), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ut = ([e, t], n) => e + n() * (t - e);
function Vx(e) {
  const t = Ve.least + Math.floor(e() * (Ve.most - Ve.least + 1));
  return Array.from({ length: Math.min(t, Ve.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ve.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Ut(Ve.start, e), l = Ut(Ve.reach, e);
    return {
      text: Ue({ moment: "digit" }, e).name,
      x: a * o,
      y: Ve.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Ut(Ve.moveMs, e)),
      fadeMs: Math.round(Ut(Ve.fadeMs, e))
    };
  });
}
const Ea = { high: 3, gap: 1 };
function Gx(e) {
  const t = Math.floor(e / Ea.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + Ea.gap)), up: e % Ea.high * (rt.height - rt.top) };
}
const eb = (e, t, n) => Ue({ moment: "unit", memory: e, now: t }, n) !== null, tb = { after: 5 }, nb = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Br(t).isBuild());
function Kx(e, t, n) {
  const a = nb(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= tb.after ? s : null;
}
function Yx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: eb(n, a, s) } : null;
}
const Ho = { ahead: 140, up: 70 };
function Jx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Ho.ahead, y: a - Ho.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Aa = { least: 4e3, most: 1e4 }, ab = (e) => Aa.least + e() * (Aa.most - Aa.least), bt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function Zx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = ab(t);
    if (n.length >= bt.most || t() >= bt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (bt.at[0] + t() * (bt.at[1] - bt.at[0]));
    n.push({ from: o, to: o + bt.ms }), a = o + bt.ms;
  }
}
const Xx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Qx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), qr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), e$ = new Set(ta.filter((e) => qr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), sb = (e) => e.some((t) => t.state === "built"), t$ = (e, t) => sb(t) ? e.filter((n) => !qr.has(n.beat)) : e, ut = { reach: 40, room: 6 }, ob = (e, t) => t <= e - ut.reach + 2, n$ = (e, t, n) => ob(e, n) ? t - ut.reach : e - ut.reach - ut.room, a$ = (e, t, n, a) => a > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, Ca = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, s$ = (e) => Ut(e() < Ca.longShare ? Ca.long : Ca.short, e), lb = 2 * rt.width;
function o$(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= lb ? o : e + (o - e + s / 2) % s;
}
const rb = 60, l$ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= rb, zo = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(zo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(zo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, ib = "[data-figure-docked-bars]", cb = "[data-figure-chat-foot]", ub = [0.85, 0.6, 0.35, 0.15], db = ["question", "waiting", "suggestion"], r$ = (e, t) => db.find((n) => e[n] > 0 && t[n] === "behind") || null;
function i$() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const fb = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", hb = "[data-figure-newest]";
function Fr() {
  var a, s;
  const e = (a = fn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(hb), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Rs(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function an(e, t, n = Fr()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = aa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ce.top * t.size, bottom: a.top + Ce.bottom * t.size }, l = xt.gap;
  return !na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function c$(e, t, n, a = Fr()) {
  if (!a || an(t, e, a)) return null;
  const s = aa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Bs * e.size : Yr * e.size, c = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= c && m.x <= d && an(m, e, a) && Wb(m, e)).sort((m, g) => Math.abs(m.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Oa = 0.26, Wr = 0.54, mb = 1.25 / 5.4, hn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Oa, travels: "stand" },
  lounge: { drop: Oa, travels: "stand" },
  composed: { drop: Oa, travels: "stand" },
  hang: { drop: Wr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, u$ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * mb * Math.cos(t * Math.PI / 180),
  y: 1 - n - Wr
}), Kt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), pb = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), d$ = (e, t) => (e === "sit" ? pb.has(t) : Kt.has(e)) ? e : "stand";
function f$(e, t) {
  return e.facing === t.facing || !Kt.has(e.posture) && !Kt.has(t.posture) ? t : { posture: "stand", facing: Kt.has(e.posture) ? e.facing : t.facing };
}
const h$ = 0.25, m$ = (e, t) => Kt.has(e) && hn[t].drop === 0, Hr = 2, gb = 90, vb = 180, yb = 140, bb = 280, wb = 420, kb = 0.25, xb = 290, $b = 600, Mb = "cubic-bezier(0.2, 0.7, 0.4, 1)", Sb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ta = 5;
function Un(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ta) return null;
  (l || r) && (o = Math.max(o, Hr));
  const g = o > 1, v = Math.abs(t.x - e.x), x = v < Ta ? 0 : v / (gb * o) * 1e3, M = Math.min(x, g ? yb : vb), B = Math.abs(t.y - e.y), F = t.y < e.y, J = F && !m && Fy(B, n, i, c, d, f), O = F ? wb + Math.min(B, 400) * kb : Math.sqrt(2 * B / Cs) * 1e3, w = {
    x: t.x,
    y: t.y,
    ms: B > Ta ? J ? $b : O : 0,
    lead: J ? xb : F ? bb : 0,
    easing: F ? Mb : Sb,
    hopping: !0,
    clip: J ? "backflip" : F ? "jump" : "fall"
  }, R = { x: t.x, y: t.y, ms: x + M, lead: 0, easing: "linear", ramp: M, ...g ? { clip: "run" } : {} }, b = m ? _b(t, n) : w, A = F && !a ? [{ ...R, y: e.y }, b] : [{ ...w, x: e.x }, R];
  return { way: Math.sign(t.x - e.x) || 1, legs: A, lands: !s, pace: o, running: g };
}
const _b = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Eb = (e, t) => e.postures.includes(t) ? t : e.postures[0], p$ = (e, t, n) => e.posture === "walk" && n ? "walk" : Eb(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - hn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, na = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Rs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const En = 0.5, Uo = 20;
function g$(e, t, n = At()) {
  const a = at(e, t);
  return a.left >= n.left + Uo && a.right <= n.right - Uo;
}
function Is(e, t, n = At()) {
  const a = at(e, t), s = a.right - a.left, o = aa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - En && r <= n.right + En && a.top >= n.top - En && i <= n.bottom + En;
}
const Vn = [0.35, 0.5, 0.65], Gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Vn[0], right: Vn.at(-1), top: Gn[0], bottom: Gn.at(-1) }, Ab = 0.24;
function aa(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ab * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Cb(e, { size: t }, n = At()) {
  const a = aa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Bs = (Ce.right - Ce.left) / 2 + 0.08;
function v$(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - hn[e].drop) };
}
const Ob = "[data-figure-agent]";
function zr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Rs(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[i].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, i), c.setEnd(o, i + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Ur = (e) => Gn.flatMap(
  (t) => Vn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ls(e, t, n = "") {
  if (!an(e, t)) return Vn.length * Gn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(fb)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && na(s, i) && Rs(r)).map(({ rect: r }) => r), l = (r, i) => o.some((c) => r >= c.left && r <= c.right && i >= c.top && i <= c.bottom);
  return Ur(s).filter(([r, i]) => l(r, i) || zr(r, i, n)).length;
}
function Tb(e, t) {
  const n = at(e, t);
  return Ur({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => zr(a, s, "", Ob)).length;
}
const Vo = 4;
function y$(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Vo; o <= s; o += Vo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Tb(r, e) && an(r, e)) return r;
    }
  return null;
}
function sn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Is(l, t, a) && an(l, t)).map((l) => ({ spot: l, covered: Ls(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Vr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Rb = [0.5, 0.25, 0.75], Ib = (e) => Vr(e.getBoundingClientRect(), Rb), Gr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Bb = Bs, Lb = (e, t, { size: n }, a = Bb) => Kr(e, Gr[t], a * n, "stand");
function Kr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Nb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Yr = 0.1, Db = (e, t, { size: n }) => Kr(e, Nb[t], Yr * n, "sit"), jb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ra = 60;
function b$(e, t) {
  const n = jb(t);
  return !e.aside || Math.abs(n) >= Ra ? t : n < 0 ? 360 - Ra : Ra;
}
const Yt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Pb = (e) => [.../* @__PURE__ */ new Set([e, ...Yt.turns.map((t) => (t + 360) % 360)])];
function w$(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Pb(t), l = Yt.every[0] + a() * (Yt.every[1] - Yt.every[0]);
  return { face: t, from: s ? qb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function qb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Yt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function k$(e, t) {
  const { element: n, edge: a } = sa(), s = ["left", "right"].map((r) => mn(Db(a, r, e), e)).filter((r) => n && Is(r, e) && !Ls(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function x$(e, t, { size: n }) {
  const a = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Jr } : e;
}
const Jr = 7;
function Zr() {
  const e = [...document.querySelectorAll(Xy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Fb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Ce.left * a, right: n.left + Ce.right * a, top: n.top + Ce.top * a, bottom: n.bottom };
}
function Wb(e, t) {
  const n = Zr();
  return !n || !na(Fb(e, t), n);
}
const Hb = 4;
function sa() {
  const e = pn(), t = Zr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Hb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Jr - n, 0) } };
}
const $$ = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = hn[e.posture].drop * a;
  return { ...Cb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const rs = (e, t) => Object.keys(Gr).map((n) => mn(Lb(e, n, t), t)), Ns = (e, t) => Vr(e, ub).map((n) => mn(n, t)), Xr = (e, t, n) => sn(e, t, n) ?? e[0];
function M$(e, t) {
  const { element: n, edge: a } = sa();
  return { ...Xr(rs(a, e), e, t), view: null, on: n };
}
function S$(e, t, n, a) {
  const { element: s, edge: o } = sa(), l = (a ? rs(o, t) : [...rs(o, t), ...Ns(o, t)]).filter(
    (c) => !na(at(c, t), e)
  ), r = sn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Ls(r, t) ? r : sn(l, t, n);
  return i && { ...i, view: null, on: s };
}
function pn() {
  var a;
  const e = fn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(ib);
  if (!t) return { ...oa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Go = { within: 2 };
function _$(e) {
  const { element: t, docked: n, edge: a } = pn();
  if (!n || e.on !== t) return !0;
  const s = oa().edge;
  return a.left > s.left + Go.within || a.left + a.width < s.left + s.width - Go.within;
}
const zb = "[data-figure-closing]";
function E$() {
  var n;
  const { element: e, docked: t } = pn();
  return t && !!((n = e.firstElementChild) != null && n.matches(zb));
}
const Qr = "[data-figure-progress]";
function A$(e) {
  const t = e.querySelector(Qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function C$(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Ub = { across: 300, above: 380, below: 60 };
function O$(e) {
  const { across: t, above: n, below: a } = Ub;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Vb(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Vb = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ei = "[data-figure-bar]", is = { back: 144, along: 0.4 };
function T$(e) {
  const { element: t, docked: n, edge: a } = pn(), s = n ? t.querySelector(ei) : null;
  if (!(s != null && s.querySelector(Qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...mn({ x: o - is.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function R$(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < is.along * a.size ? t.x + is.along * a.size : e.x, y: e.y, behind: !0 };
}
function I$(e) {
  const t = e.querySelector(ei), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function oa() {
  const e = fn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function B$(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = oa(), i = n === null ? Gb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : mn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Gb(e, t, n, a, s) {
  const o = Ns(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - ut.reach - ut.room >= l);
  return sn(r.length ? r : o, t, n);
}
const Kb = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function L$(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: c = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Hr));
  const g = (J) => {
    const O = at(J, n, hn[J.posture].travels);
    return { x: O.left, y: O.top };
  }, v = t.ladder ?? e.ladder;
  if (v && !(t.ladder && e.ladder)) return Yb(g(e), g(t), g({ ...v.foot, posture: "stand" }), v.way, !!t.ladder, n, s);
  const [x, ...M] = [e, ...i, t].map(g), B = Un(x, M[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: c, now: d, room: f, pogo: m }), F = M.slice(1).map((J, O) => {
    var w;
    return (w = Un(M[O], J, n.size, { random: r, memory: c, now: d, room: f })) == null ? void 0 : w.legs.find((R) => R.hopping);
  });
  return B && { ...B, legs: [...B.legs, ...F.filter(Boolean)] };
}
function Yb(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Kb.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Un(e, n, o.size, { pace: l }) : Un(n, t, o.size, { pace: l }), c = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function N$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function D$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && sn(Ib(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = sa();
  return { ...Xr(Ns(s, t), t, n), view: null, on: a };
}
const Jb = "[data-figure-bubble]", Zb = 250;
let Jt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ti = 0;
const qt = () => Jt, Ia = /* @__PURE__ */ new WeakMap();
let Xb = 0;
function Ds(e) {
  return Ia.has(e) || Ia.set(e, `floor-${++Xb}`), Ia.get(e);
}
const Qb = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, ew = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function tw(e, t) {
  var a;
  const n = (a = e.querySelector(cb)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function nw(e, t) {
  const n = e && tw(e, t), a = e ? [...e.querySelectorAll(Jb)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Qb(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ds(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const aw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Zb ? (t.top - a.top) / s * 1e3 : 0;
};
function ni(e = Jt, t = performance.now()) {
  const n = At(), a = ew(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = pn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const c = oa();
  return c.element && i.push({ id: Ds(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), i.push(...nw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: aw(e, d, t) }))) });
}
const cs = /* @__PURE__ */ new Set();
function sw(e) {
  return cs.add(e), () => cs.delete(e);
}
function ow() {
  ai();
  const e = () => {
    ti = requestAnimationFrame(e), !document.hidden && (Jt = ni(Jt), cs.forEach((t) => t(Jt)));
  };
  e();
}
function ai() {
  cancelAnimationFrame(ti);
}
const js = 5, lw = 56, rw = { share: 0.6 }, iw = (e) => -Math.sqrt(2 * Cs * rw.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function j$(e, t = ni().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ds(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function si({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const c = Nt(i, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || cw(c, d, o)) && uw(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Ps = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, cw = (e, t, n) => !Ps({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function P$(e, t = qt().floors) {
  if (!Ps(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= js && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function uw(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Is(e, t);
}
function q$(e, t, n, a = qt().floors) {
  const s = si(e, n, a);
  if (!e.home) return dw(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > js ? "dropping" : -l > lw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function dw(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: iw(e.risen) };
  if (!n) return null;
  if (Ps(t) && n.y - t.y > js) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function F$(e, t, n) {
  const a = Bs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function W$(e, t, n, a = qt().floors) {
  const s = t && si(t, n, a);
  return s ? { ...e, ...s } : e;
}
const fw = ["data-type"], hw = { class: "figure-floor-name" }, mw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      y("span", hw, k(e.floor.type), 1)
    ], 12, fw));
  }
}, pw = /* @__PURE__ */ Y(mw, [["__scopeId", "data-v-ac620b01"]]), gw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, vw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(qt().floors);
    let n = () => {
    };
    return Re(() => {
      n = sw((a) => t.value = a.floors), ow();
    }), Be(() => {
      n(), ai();
    }), (a, s) => (u(), h("div", gw, [
      (u(!0), h(G, null, ee(t.value, (o) => (u(), H(pw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, H$ = /* @__PURE__ */ Y(vw, [["__scopeId", "data-v-c8fb9617"]]), Ba = (e) => typeof e == "number" ? e : Date.parse(e);
function z$(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ba(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ba(s.row.created_at) - Ba(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const yw = 3, La = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function bw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = La[n.grouping]) == null ? void 0 : a.call(La, e.row, n)) || "";
}
function ww(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function U$(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= yw ? [ww(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = bw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const kw = 1e3;
function xw() {
  const e = L(Date.now()), t = setInterval(() => e.value = Date.now(), kw);
  return ft(() => clearInterval(t)), e;
}
const $w = ["datetime", "title"], la = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = xw(), a = I(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, k(P(ir)(e.at, P(n))), 9, $w));
  }
};
function V$(e) {
  const t = We(), n = t.option("row"), a = L(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), fe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Mw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const G$ = (e) => (t) => t.filter((n) => n.id !== e), K$ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), Y$ = (e) => (t) => [...t, e], J$ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function Z$(e, t = {}) {
  const n = We(), a = L(null), s = L("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function X$(e) {
  const t = We(), n = L("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const An = /* @__PURE__ */ new Map();
function Sw(e, t) {
  if (An.has(e)) return An.get(e);
  const n = t().finally(() => An.delete(e));
  return An.set(e, n), n;
}
function Q$() {
  const e = We(), t = L(null), n = L("");
  async function a() {
    const s = await Sw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const _w = { class: "cards-page" }, Ew = { class: "cards-bar" }, Aw = { class: "cards-count" }, Cw = { class: "cards" }, Ow = {
  key: 1,
  class: "cards-note"
}, Tw = {
  key: 2,
  class: "cards-note"
}, Rw = ["data-row", "onClick"], Iw = { class: "card-head" }, Bw = { class: "card-title" }, Lw = { class: "card-foot" }, Nw = {
  __name: "RowCards",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    loaded: { type: Boolean, required: !0 },
    noun: { type: String, required: !0 },
    icon: { type: String, required: !0 },
    head: { type: Function, required: !0 },
    title: { type: Function, required: !0 },
    foot: { type: Function, required: !0 }
  },
  emits: ["new", "open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("div", _w, [
      y("div", Ew, [
        y("span", Aw, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        D(de, Fe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: q(() => [
            D(ye, {
              name: "plus",
              size: 12
            }),
            te(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      y("div", Cw, [
        e.loaded ? e.failure ? (u(), h("p", Ow, k(e.failure), 1)) : e.rows.length ? C("", !0) : (u(), h("p", Tw, "No " + k(e.noun) + "s yet", 1)) : (u(), H(_t, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), h(G, null, ee(e.rows, (o) => (u(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          y("span", Iw, [
            D(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            te(" " + k(e.head(o)), 1),
            D(la, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          y("span", Bw, k(e.title(o)), 1),
          y("span", Lw, k(e.foot(o)), 1)
        ], 8, Rw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, e8 = /* @__PURE__ */ Y(Nw, [["__scopeId", "data-v-b9e18f79"]]), Ko = "newest";
function t8(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Oe(Le, null)) == null ? void 0 : c.search, s = L(""), o = L(Ko), l = L("all"), r = I(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => Mw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Ko ? f : [...f].sort((m, g) => t(m).localeCompare(t(g)));
  }), i = I(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Dw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, jw = 40, Pw = "top", qw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(Le, null)) == null ? void 0 : f.autoScroll, s = I(() => a === Pw), o = L(null), l = L(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= jw;
    }
    return fe(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, g) => (u(), h("div", Dw, [
      y("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      D(Dt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: q(() => [
          tt(y("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: c
          }, [
            D(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            g[0] || (g[0] = te(" Newest ", -1))
          ], 512), [
            [sl, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, n8 = /* @__PURE__ */ Y(qw, [["__scopeId", "data-v-ffe6b8a5"]]), Fw = ["aria-selected", "data-tab", "onClick"], Ww = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Hw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(Le, null), o = I(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = L(null), r = L({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function c(m) {
      var v;
      const g = (v = l.value) == null ? void 0 : v.querySelector(".inner-tab.on");
      if (!g) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: g.offsetLeft, width: g.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const d = () => mt(() => c(!0));
    let f = null;
    return Re(() => {
      var m;
      c(!1), f = new ResizeObserver(() => c(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => c(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), fe(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), fe(() => n.answer, d, { deep: !0 }), (m, g) => (u(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), h(G, null, ee(o.value, (v) => {
        var x, M;
        return u(), h("button", {
          key: v.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((x = e.active) == null ? void 0 : x.key) === v.key }]),
          "aria-selected": ((M = e.active) == null ? void 0 : M.key) === v.key,
          "data-tab": v.key,
          onClick: (B) => a("choose", v)
        }, [
          te(k(v.label) + " ", 1),
          i(v) ? (u(), h("span", Ww, k(e.answer[v.count_field]), 1)) : C("", !0)
        ], 10, Fw);
      }), 128)),
      y("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, a8 = /* @__PURE__ */ Y(Hw, [["__scopeId", "data-v-e0def8d7"]]), zw = {
  class: "tab-body",
  "data-tab-body": ""
}, Uw = { "data-tab-content": "" }, Vw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = L(!1);
    let a = 0;
    return fe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ps(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), h("div", zw, [
      n.value ? (u(), H(_t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      tt(y("div", Uw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [sl, !n.value]
      ])
    ]));
  }
}, s8 = /* @__PURE__ */ Y(Vw, [["__scopeId", "data-v-fe3ebcad"]]), Gw = {}, Kw = { class: "menu-label" };
function Yw(e, t) {
  return u(), h("span", Kw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const us = /* @__PURE__ */ Y(Gw, [["render", Yw], ["__scopeId", "data-v-71c11156"]]), Jw = {
  class: "search-bar",
  "data-search-bar": ""
}, Zw = { class: "search-bar-control" }, Xw = ["value", "placeholder", "aria-label"], Qw = ["aria-expanded"], ek = {
  key: 0,
  "data-menu-count": ""
}, tk = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var B;
    const a = e, s = n, o = yi(), l = ((B = Oe(Le, null)) == null ? void 0 : B.search) ?? {}, r = I(() => l.placeholder || a.placeholder), i = l.context ?? [], c = L(null), d = L(null), f = L([]), m = I(() => f.value.length ? f.value[f.value.length - 1].next : i), g = I(() => !!o.menu || i.length > 0), v = (F) => {
      f.value = [], d.value = d.value ? null : F.currentTarget;
    };
    function x(F) {
      if (F.next.length) {
        f.value = [...f.value, F];
        return;
      }
      d.value = null, s("pick", F.click);
    }
    function M() {
      var F;
      s("update:modelValue", ""), (F = c.value) == null || F.focus();
    }
    return t({ focus: () => {
      var F;
      return (F = c.value) == null ? void 0 : F.focus();
    } }), (F, J) => {
      var O;
      return u(), h("div", Jw, [
        y("div", Zw, [
          D(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          y("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: J[0] || (J[0] = (w) => s("update:modelValue", w.target.value)),
            onKeydown: Zt(M, ["esc"])
          }, null, 40, Xw),
          e.modelValue ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: M
          }, [
            D(ye, {
              name: "close",
              size: 12
            })
          ])) : C("", !0),
          g.value ? (u(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: v
          }, [
            e.menuCount ? (u(), h("span", ek, k(e.menuCount), 1)) : C("", !0),
            D(ye, {
              name: "caret",
              size: 12
            })
          ], 8, Qw)) : C("", !0)
        ]),
        (O = P(l).button) != null && O.title ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: J[1] || (J[1] = (w) => s("pick", P(l).button.click))
        }, k(P(l).button.title), 1)) : C("", !0),
        ue(F.$slots, "default", {}, void 0, !0),
        d.value ? (u(), H(Xn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: J[3] || (J[3] = xe(() => {
          }, ["stop"])),
          onClose: J[4] || (J[4] = (w) => d.value = null)
        }, {
          default: q(() => [
            f.value.length ? (u(), H(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: J[2] || (J[2] = (w) => f.value = f.value.slice(0, -1))
            }, {
              default: q(() => [
                te("‹ " + k(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (u(!0), h(G, null, ee(m.value, (w) => (u(), H(Mt, {
              key: w.title,
              description: w.subtext,
              "data-search-entry": w.title,
              onClick: (R) => x(w)
            }, {
              default: q(() => [
                te(k(w.title) + k(w.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? C("", !0) : ue(F.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : C("", !0)
      ]);
    };
  }
}, nk = /* @__PURE__ */ Y(tk, [["__scopeId", "data-v-8617b565"]]), ak = {
  __name: "ListTools",
  props: { tools: { type: Object, required: !0 }, placeholder: { type: String, default: "Search" } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], s = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ];
    return (o, l) => (u(), H(nk, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: q(() => [
        D(us, null, {
          default: q(() => [...l[2] || (l[2] = [
            te("Order", -1)
          ])]),
          _: 1
        }),
        (u(), h(G, null, ee(a, (r) => D(Mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: q(() => [
            te(k(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), h(G, { key: 0 }, [
          D(us, null, {
            default: q(() => [...l[3] || (l[3] = [
              te("Show", -1)
            ])]),
            _: 1
          }),
          (u(), h(G, null, ee(s, (r) => D(Mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: q(() => [
              te(k(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : C("", !0)
      ]),
      default: q(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, o8 = /* @__PURE__ */ Y(ak, [["__scopeId", "data-v-9c2114d0"]]);
function l8() {
  const e = L(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const r8 = (e) => import(
  /* @vite-ignore */
  e
), sk = 86400, ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function ok(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ds(t) - ds(e)) / sk);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function i8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ds(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: ok(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Na = 280, Da = 240, ja = 120, lk = 6, rk = 14, on = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function ik(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function oi(e, t) {
  const n = Math.max(0, ik(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function ck(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${rk}px)` }), e.offsetHeight, e.style.transition = `height ${Na}ms ${on}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (c) return;
    n() && (t.scrollTop = oi(t, e));
    const m = s() - r;
    if (!i && m >= Na && (i = !0, e.style.transition = `opacity ${Da}ms ease-out, transform ${Da}ms ${on}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Na + Da) return a(f);
    d();
  };
  return a(f), d;
}
function c8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${lk}px)` }), e.offsetHeight, e.style.transition = `opacity ${ja}ms ease-out, transform ${ja}ms ${on}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = oi(t, e)), s() - l < ja) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const uk = 140, Cn = 220, Yo = 5;
function u8({ gap: e = uk, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Yo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const c = (d, f, m, g = ck) => {
    if (l || !f.pane || !f.follows()) return m();
    const v = { el: d, options: f, done: m, arrival: g, display: d.style.display || "" };
    if (!s)
      return s = !0, r(v, () => o = t(i, e));
    d.style.display = "none", n.push(v), n.length >= Yo && c.flush();
  };
  return c.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, c;
}
function d8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Cn}ms ${on}, opacity ${Cn}ms ease-in, margin ${Cn}ms ${on}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Cn);
}
const li = "chat.pins.minimised", Ln = L(Nn(li, !1));
function Jo(e) {
  Ln.value = e, $s(li, e);
}
function dk(e) {
  const t = I(() => e()), n = I(() => Ln.value ? [] : e()), a = () => Jo(!Ln.value), s = Date.now() / 1e3;
  return fe(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Jo(!1)
  ), { pins: t, visible: n, minimised: Ln, toggle: a };
}
const fk = ["title"], hk = {
  key: 0,
  class: "pins-count"
}, mk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = dk(() => t.pinRows);
    return (o, l) => P(n).length ? (u(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: P(a), inline: e.inline }]),
      title: P(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => P(s) && P(s)(...r), ["stop"]))
    }, [
      D(ye, {
        name: P(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      P(a) ? (u(), h("span", hk, k(P(n).length), 1)) : C("", !0)
    ], 10, fk)) : C("", !0);
  }
}, f8 = /* @__PURE__ */ Y(mk, [["__scopeId", "data-v-999f2559"]]), pk = ["title"], gk = ["title"], vk = { class: "diff-card-dir" }, yk = { class: "diff-card-name" }, bk = ["title"], wk = ["title"], kk = {
  key: 0,
  class: "diff-card-note"
}, xk = ["href"], $k = ["src", "alt"], Mk = { class: "diff-card-rows" }, Sk = { class: "diff-row-num" }, _k = { class: "diff-row-sign" }, Ek = { class: "diff-row-code" }, Ak = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    change: { type: String, required: !0 },
    added: { type: Number, required: !0 },
    removed: { type: Number, required: !0 },
    at: { type: [String, Number], required: !0 },
    rows: { type: Array, required: !0 },
    flush: Boolean,
    half: Boolean,
    folded: Boolean,
    editsOnly: Boolean,
    hideRemovals: Boolean,
    capped: Boolean,
    lines: { type: Number, default: 0 },
    whole: { type: Object, default: null },
    entering: Boolean,
    picture: { type: String, default: "" },
    fresh: { type: String, default: "" }
  },
  emits: ["fold", "whole", "open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl";
    function o(N) {
      (N.metaKey || N.ctrlKey) && (N.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = I(() => n.path.lastIndexOf("/") + 1), c = I(() => n.path.slice(0, i.value)), d = I(() => n.path.slice(i.value)), f = I(() => n.change === "deleted"), m = I(() => l[n.change]), g = I(() => new Set(n.rows.filter((N) => N.line_type === "add").map((N) => N.line))), v = L("after"), x = I(() => v.value === "before" ? n.whole.old : n.whole.text), M = I(() => n.whole && n.whole.text !== void 0 ? x.value.split(`
`).map((N, _) => ({ line_type: v.value === "after" && g.value.has(_ + 1) ? "add" : "ctx", line: _ + 1, text: N })) : n.rows.filter(
      (N) => !(n.editsOnly && ["ctx", "fold"].includes(N.line_type)) && !(n.hideRemovals && N.line_type === "del")
    )), B = L(!1), F = I(() => n.lines && !B.value && !n.whole), J = I(() => F.value ? M.value.slice(0, n.lines) : M.value), O = I(() => M.value.length - J.value.length), w = (N) => N.line === null || N.line_type === "del" ? "" : N.line, R = (N) => N.line_type === "fold" ? N.hidden ? `⋯ ${N.hidden} lines` : "⋯" : N.text, b = L(null), A = L(null);
    let $ = null;
    return Re(() => {
      if (!A.value) return;
      let N = !0;
      $ = new ResizeObserver(() => {
        !b.value || !A.value || (b.value.style.transition = N ? "none" : "", b.value.style.height = `${A.value.offsetHeight}px`, N = !1);
      }), $.observe(A.value);
    }), Be(() => $ && $.disconnect()), (N, _) => (u(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      y("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: _[2] || (_[2] = (p) => !f.value && a("fold"))
      }, [
        y("span", {
          class: "diff-card-path",
          title: `${e.path} · ${P(s)}-click to open it`,
          onClick: o
        }, [
          y("span", vk, k(c.value), 1),
          y("span", yk, k(d.value), 1),
          m.value ? (u(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, k(m.value), 3)) : C("", !0)
        ], 8, gk),
        y("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        y("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        D(la, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: v.value === "after" ? "Show the file before" : "Show the file after",
          onClick: _[0] || (_[0] = xe((p) => v.value = v.value === "after" ? "before" : "after", ["stop"]))
        }, k(v.value === "after" ? "After" : "Before"), 9, bk)) : C("", !0),
        f.value ? C("", !0) : (u(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: _[1] || (_[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          D(ye, {
            name: "file",
            size: 12
          })
        ], 10, wk))
      ], 8, pk),
      e.whole && e.whole.error ? (u(), h("p", kk, k(e.whole.error), 1)) : C("", !0),
      !f.value && !e.folded ? (u(), h(G, { key: 1 }, [
        e.picture ? (u(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          y("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, $k)
        ], 8, xk)) : (u(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: b,
          class: "diff-card-grow"
        }, [
          y("div", {
            ref_key: "body",
            ref: A,
            class: "diff-card-diff"
          }, [
            y("div", Mk, [
              (u(!0), h(G, null, ee(J.value, (p, S) => (u(), h("div", {
                key: S,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                y("span", Sk, k(w(p)), 1),
                y("span", _k, k(r[p.line_type]), 1),
                y("span", Ek, k(R(p)), 1)
              ], 2))), 128)),
              O.value > 0 ? (u(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: _[3] || (_[3] = xe((p) => B.value = !0, ["stop"]))
              }, k(O.value) + " more " + k(O.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, h8 = /* @__PURE__ */ Y(Ak, [["__scopeId", "data-v-9c99c502"]]), Ck = {
  __name: "WindowPane",
  props: {
    name: { type: String, required: !0 },
    catalogue: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    prompts: { type: Object, default: null },
    shellRead: { type: Function, default: null },
    options: { type: Object, default: () => ({}) },
    dropdown: { type: Boolean, default: !1 },
    bar: { type: Boolean, default: !1 }
  },
  emits: ["remove", "option"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = I(() => s.value && { render: () => Kn(Cm, { line: s.value.line, events: s.value.events }) }), l = L(null), r = I(() => {
      var m, g;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), i = I(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = I(
      () => {
        var m, g;
        return l.value ? tv(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function f() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await d(), m;
    }
    return fe(
      () => {
        var m, g;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await d(), c.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, g) => {
      var v, x;
      return !s.value && ((v = e.catalogue.loaded) == null ? void 0 : v.value) === !1 ? (u(), H(As, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((x = s.value) == null ? void 0 : x.shows) === "one-agent" && e.agent === null ? (u(), H(Xt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (u(), H(Gt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), H(yr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (M, B) => n("option", M, B))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), H(vr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (M, B) => n("option", M, B))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), H(Gt, {
        key: s.value.line || s.value.entry_url,
        name: e.name,
        component: o.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        events: s.value.events,
        options: e.options,
        declared: s.value.options,
        "auto-scroll": s.value.auto_scroll,
        tabs: s.value.tabs,
        sources: s.value.sources,
        links: s.value.links,
        search: s.value.search,
        skeleton: s.value.skeleton,
        "unavailable-reason": s.value.unavailable_reason,
        onOption: g[2] || (g[2] = (M, B) => n("option", M, B))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), H(Gt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (M) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Ok = ["data-section"], Tk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Eu, null), a = I(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = I(() => ({ row: t.row }));
    return (o, l) => (u(!0), h(G, null, ee(a.value, (r) => (u(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      D(Ck, {
        name: r.name,
        catalogue: P(n).catalogue,
        subscriptions: P(n).subscriptions,
        environment: P(n).environment,
        prompts: P(n).prompts,
        "shell-read": P(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Ok))), 128));
  }
}, Rk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: q(() => [
        D(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Ik = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Bk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Lk = { class: "ask-text" }, Nk = ["placeholder", "aria-label"], Dk = ["placeholder", "aria-label"], jk = {
  key: 3,
  class: "moves"
}, Pk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(() => e0(a.noun, a.row)), l = L(""), r = L(null), i = L(""), c = L("");
    fe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(g, v = "") {
      const x = await a.read([g.noun ?? a.noun, g.word, String(a.id), ...g.flag ? [g.flag, v] : g.positional ? [v] : [], ...g.opener && c.value.trim() ? ["--on", c.value.trim()] : []]);
      l.value = x.ok ? "" : x.error, x.ok && (r.value = null, i.value = "", c.value = "", s("done"));
    }
    const f = (g) => g.confirm ? r.value = g : g.said ? d(g, g.said) : g.flag || g.positional ? (r.value = g, i.value = "") : d(g), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (g, v) => o.value.length ? (u(), H(dr, {
      key: 0,
      inline: e.inline
    }, {
      default: q(() => {
        var x;
        return [
          l.value ? (u(), h("p", Ik, k(l.value), 1)) : C("", !0),
          (x = r.value) != null && x.confirm ? (u(), h("div", Bk, [
            y("span", Lk, k(r.value.confirm), 1),
            D(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: Z({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: v[0] || (v[0] = (M) => d(r.value))
            }, {
              default: q(() => [
                te(k(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            D(de, {
              small: "",
              variant: "ghost",
              onClick: v[1] || (v[1] = (M) => r.value = null)
            }, {
              default: q(() => [...v[7] || (v[7] = [
                te("Back", -1)
              ])]),
              _: 1
            })
          ])) : r.value ? (u(), h("form", {
            key: 2,
            class: "ask",
            "data-resource-ask": "",
            onSubmit: xe(m, ["prevent"])
          }, [
            tt(y("input", {
              "onUpdate:modelValue": v[2] || (v[2] = (M) => i.value = M),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: v[3] || (v[3] = Zt(xe((M) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Nk), [
              [Ha, i.value]
            ]),
            r.value.opener ? tt((u(), h("input", {
              key: 0,
              "onUpdate:modelValue": v[4] || (v[4] = (M) => c.value = M),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: v[5] || (v[5] = Zt(xe((M) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Dk)), [
              [Ha, c.value]
            ]) : C("", !0),
            D(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: q(() => [
                te(k(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            D(de, {
              small: "",
              variant: "ghost",
              onClick: v[6] || (v[6] = (M) => r.value = null)
            }, {
              default: q(() => [...v[8] || (v[8] = [
                te("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (u(), h("div", jk, [
            (u(!0), h(G, null, ee(o.value, (M) => (u(), H(de, {
              key: M.word,
              small: !M.bordered,
              bordered: M.bordered,
              icon: M.icon,
              variant: M.main ? "primary" : "ghost",
              class: Z({ danger: M.danger }),
              "data-move": M.word,
              onClick: (B) => f(M)
            }, {
              default: q(() => [
                te(k(M.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : C("", !0);
  }
}, qk = /* @__PURE__ */ Y(Pk, [["__scopeId", "data-v-dddb7bdd"]]), Fk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Wk = (e) => Fk.has(e), ln = (e) => Wk(e) ? "done" : e, Hk = { class: "facts" }, zk = { class: "fact wide" }, Uk = ["title"], Vk = {
  key: 1,
  class: "fact-value"
}, Gk = {
  key: 0,
  class: "fact"
}, Kk = { class: "fact-value" }, Yk = { class: "fact" }, Jk = { class: "fact-label" }, Zk = ["title"], Xk = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Qk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, e2 = {
  key: 2,
  class: "fact"
}, t2 = { class: "fact-value" }, n2 = { class: "fact wide" }, a2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, s2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Fn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return u(), h("div", Hk, [
        y("div", zk, [
          l[3] || (l[3] = y("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: l[0] || (l[0] = (c) => P(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + k(e.place.plan_id) + ": " + k(e.place.plan_title), 9, Uk)) : (u(), h("span", Vk, "Not in a plan"))
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (u(), h("div", Gk, [
          l[4] || (l[4] = y("span", { class: "fact-label" }, "Phase", -1)),
          y("span", Kk, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (u(), h(G, { key: 1 }, [
          y("div", Yk, [
            y("span", Jk, k(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            y("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[1] || (l[1] = (c) => P(qe)(`agents:${e.task.helper_id}`))
            }, k(e.task.helper_name), 9, Zk)
          ]),
          P(s).has(e.task.state) ? (u(), h("p", Xk, k(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), h("p", Qk, k(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), h("div", e2, [
          l[5] || (l[5] = y("span", { class: "fact-label" }, "Assigned to", -1)),
          y("span", t2, "Agent " + k(e.task.holder_id), 1)
        ])) : C("", !0),
        y("div", n2, [
          l[6] || (l[6] = y("span", { class: "fact-label" }, "Priority", -1)),
          D(rn, {
            options: P(n),
            value: String(P(ur)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[2] || (l[2] = (c) => a("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), h("p", a2, k(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, o2 = /* @__PURE__ */ Y(s2, [["__scopeId", "data-v-a6452f15"]]);
function l2(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, c]) => c === i).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((c) => !s.has(c)))
    i.forEach((c) => s.add(c)), o.push(i.map((c) => n.get(c)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([c]) => c === e); i && !r.has(i[1]); i = t.edges.find(([c]) => c === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const r2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, i2 = { ...r2, done: "Completed" }, c2 = { class: "task-status-icon" }, u2 = ["width", "height", "aria-label"], d2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = I(() => xl("task", ln(t.status))), a = I(() => n.value === "testing" ? "started" : n.value), s = I(() => i2[t.status] ?? kl("task", t.status));
    return (o, l) => (u(), h("span", c2, [
      D(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: q(() => [
          (u(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            D(jt, { value: a.value }, {
              blocked: q(() => [...l[0] || (l[0] = [
                y("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                y("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                y("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: q(() => [...l[1] || (l[1] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                y("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: q(() => [...l[2] || (l[2] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                y("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: q(() => [...l[3] || (l[3] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                y("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                y("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: q(() => [...l[4] || (l[4] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                y("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                y("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: q(() => [...l[5] || (l[5] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: q(() => [...l[6] || (l[6] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, u2))
        ]),
        _: 1
      })
    ]));
  }
}, qs = /* @__PURE__ */ Y(d2, [["__scopeId", "data-v-b13c7c09"]]), f2 = { class: "number" }, h2 = { class: "title" }, m2 = { class: "word" }, p2 = {
  __name: "TaskChainLink",
  props: {
    status: { type: String, required: !0 },
    number: { type: Number, required: !0 },
    title: { type: String, required: !0 },
    word: { type: String, required: !0 },
    current: Boolean
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(ht(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Z(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: q(() => [
        D(qs, { status: e.status }, null, 8, ["status"]),
        y("span", f2, k(e.number), 1),
        y("span", h2, k(e.title), 1),
        y("span", m2, k(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Pa = /* @__PURE__ */ Y(p2, [["__scopeId", "data-v-3148246d"]]), g2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, v2 = { class: "level" }, y2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(!1);
    fe(() => n.task.id, () => s.value = !1);
    const o = I(() => l2(n.task.id, n.graph)), l = I(() => s.value ? o.value.above : o.value.above.slice(-1)), r = I(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = I(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), d = (f, m = !1) => ({ status: ln(f.state), number: f.id, title: f.title, word: m ? "This task" : c(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (u(), h("section", g2, [
      m[5] || (m[5] = y("h4", null, "What waits on what", -1)),
      (u(!0), h(G, null, ee(l.value, (g) => (u(), h(G, {
        key: g.map((v) => v.id).join()
      }, [
        y("div", v2, [
          (u(!0), h(G, null, ee(g, (v) => (u(), H(Pa, Fe({
            key: v.id,
            ref_for: !0
          }, d(v), {
            onSelect: m[0] || (m[0] = (x) => a("select", x))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = y("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      D(Pa, bi(wi(d(e.task, !0))), null, 16),
      (u(!0), h(G, null, ee(r.value, (g) => (u(), h(G, {
        key: g.id
      }, [
        m[4] || (m[4] = y("div", { class: "waits" }, "↓ waits on", -1)),
        D(Pa, Fe({ ref_for: !0 }, d(g), {
          onSelect: m[1] || (m[1] = (v) => a("select", v))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (u(), h("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (g) => s.value = !s.value)
      }, k(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : C("", !0)
    ])) : C("", !0);
  }
}, b2 = /* @__PURE__ */ Y(y2, [["__scopeId", "data-v-e85446b7"]]), w2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, k2 = ["datetime"], x2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), h("section", w2, [
      n[0] || (n[0] = y("h3", null, "Block history", -1)),
      (u(!0), h(G, null, ee(e.renewals, (a) => (u(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        y("time", {
          datetime: a.created_at
        }, k(new Date(a.created_at).toLocaleString()), 9, k2),
        y("p", null, k(a.reason), 1)
      ]))), 128))
    ])) : C("", !0);
  }
}, $2 = /* @__PURE__ */ Y(x2, [["__scopeId", "data-v-3019b030"]]), M2 = {
  class: "part",
  "data-resource-waits": ""
}, S2 = ["onClick"], _2 = { class: "wait-id" }, E2 = { class: "wait-title" }, A2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), h("section", M2, [
      y("h4", null, k(e.title), 1),
      (u(!0), h(G, null, ee(e.waits, (o) => (u(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        D(qs, {
          status: P(ln)(o.state),
          size: 12
        }, null, 8, ["status"]),
        y("span", _2, k(o.id), 1),
        y("span", E2, k(o.title), 1)
      ], 8, S2))), 128))
    ]));
  }
}, Zo = /* @__PURE__ */ Y(A2, [["__scopeId", "data-v-96a767b5"]]), C2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, O2 = { class: "text" }, T2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, R2 = 180, I2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = L(!1), l = I(() => a.task.waits.filter((i) => !n.has(i.state))), r = I(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, c) => (u(), h(G, null, [
      l.value.length ? (u(), H(Zo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), h("section", C2, [
        c[3] || (c[3] = y("h4", null, "How it was done", -1)),
        y("p", O2, k(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (u(), h("section", T2, [
        c[4] || (c[4] = y("h4", null, "The brief", -1)),
        y("p", {
          class: Z(["text", { clamped: !o.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > R2 && !o.value ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0),
      r.value.length ? (u(), H(Zo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0)
    ], 64));
  }
}, B2 = /* @__PURE__ */ Y(I2, [["__scopeId", "data-v-b628bea5"]]), L2 = {
  class: "task-details",
  "data-task-details": ""
}, N2 = { class: "since" }, D2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, j2 = { class: "text" }, P2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, q2 = {
  key: 1,
  class: "note"
}, F2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, W2 = { class: "text" }, H2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), h("div", L2, [
        y("div", {
          class: Z(["state-line", P(ln)(e.task.state)])
        }, [
          y("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            D(qs, {
              status: P(ln)(e.task.state)
            }, null, 8, ["status"]),
            te(" " + k(a(e.task.state)), 1)
          ]),
          y("span", N2, [
            o[4] || (o[4] = te(" since ", -1)),
            D(la, {
              at: P(Ql)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), h("section", D2, [
          o[5] || (o[5] = y("span", { class: "label" }, "Blocked, waiting on", -1)),
          y("p", j2, k(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), h("p", P2, "Opens by itself when " + k(e.task.openers.join(" or ")) + ".", 1)) : (u(), h("p", q2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), h("section", F2, [
          o[6] || (o[6] = y("span", { class: "label" }, "Why it was cancelled", -1)),
          y("p", W2, k(e.task.reason), 1)
        ])) : C("", !0),
        e.graph ? (u(), H(b2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : C("", !0),
        D(o2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        D(B2, {
          task: e.task,
          onSelect: o[3] || (o[3] = (r) => n("select", r))
        }, null, 8, ["task"]),
        D($2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, z2 = /* @__PURE__ */ Y(H2, [["__scopeId", "data-v-7b2c2caa"]]), U2 = 50, V2 = { messages: 25 }, G2 = (e) => V2[e] || U2, K2 = {
  class: "task-log",
  "aria-label": "Task log"
}, Y2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, J2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Z2 = { class: "entries" }, X2 = ["data-task-log-important"], Q2 = ["datetime"], e5 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, t5 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = L([]), a = L(1), s = L(!0), o = L(!0), l = L("");
    let r = 0;
    async function i(c = 1) {
      const d = ++r;
      a.value = c, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(G2("task_logs")),
        "--page",
        String(c)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return fe(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), ft(() => {
      r += 1;
    }), (c, d) => (u(), h("section", K2, [
      o.value ? (u(), H(_t, { key: 0 })) : l.value ? (u(), h(G, { key: 1 }, [
        y("p", Y2, k(l.value), 1),
        D(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: q(() => [...d[3] || (d[3] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), h(G, { key: 2 }, [
        n.value.length ? C("", !0) : (u(), h("p", J2, "No log entries yet.")),
        y("ol", Z2, [
          (u(!0), h(G, null, ee(n.value, (f) => (u(), h("li", {
            key: f.id,
            class: Z(["entry", { important: f.important }]),
            "data-task-log": "",
            "data-task-log-important": f.important ? "" : null
          }, [
            y("time", {
              datetime: f.created_at
            }, k(new Date(f.created_at).toLocaleString()), 9, Q2),
            y("p", null, k(f.line), 1)
          ], 10, X2))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), h("nav", e5, [
          D(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: q(() => [...d[4] || (d[4] = [
              te("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          y("span", null, "Page " + k(a.value), 1),
          D(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: q(() => [...d[5] || (d[5] = [
              te("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : C("", !0)
      ], 64))
    ]));
  }
}, n5 = /* @__PURE__ */ Y(t5, [["__scopeId", "data-v-bd886dcf"]]), a5 = { class: "comment-side-head" }, s5 = {
  key: 0,
  class: "comment-none"
}, o5 = { key: 0 }, l5 = {
  key: 1,
  class: "comment-none"
}, r5 = {
  class: "comment",
  "data-comment": ""
}, i5 = {
  __name: "CommentSide",
  props: {
    comments: { type: Array, required: !0 },
    words: { type: Function, required: !0 },
    below: Boolean,
    more: Boolean,
    loading: Boolean,
    failure: { type: String, default: "" }
  },
  emits: ["close", "more"],
  setup(e) {
    return (t, n) => (u(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      y("header", a5, [
        n[2] || (n[2] = y("h3", null, "Comments", -1)),
        D(xs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), h("p", s5, "No comments yet")) : C("", !0),
      (u(!0), h(G, null, ee(e.comments, (a) => (u(), h("section", {
        key: a.id
      }, [
        a.quote ? (u(), h("blockquote", o5, k(a.quote), 1)) : C("", !0),
        a.revision ? (u(), h("span", l5, "Revision " + k(a.revision), 1)) : C("", !0),
        y("p", r5, k(e.words(a)), 1)
      ]))), 128)),
      D(Zn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, c5 = /* @__PURE__ */ Y(i5, [["__scopeId", "data-v-798005b2"]]);
var el;
/Mac|iPhone|iPad/.test(((el = navigator.userAgentData) == null ? void 0 : el.platform) || navigator.platform);
function u5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const d5 = ["placeholder"], f5 = { class: "actions" }, h5 = { class: "error" }, m5 = {
  key: 1,
  class: "card closed"
}, p5 = { class: "mark" }, g5 = { class: "prompt" }, v5 = {
  key: 0,
  class: "draft"
}, y5 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Wa({
    send: { type: Function, required: !0 },
    count: { type: Number, default: 0 },
    ready: { type: Boolean, default: !0 },
    placeholder: { type: String, default: "Write a comment…" }
  }, {
    draft: { type: String, default: "" },
    draftModifiers: {},
    error: { type: String, default: "" },
    errorModifiers: {}
  }),
  emits: /* @__PURE__ */ Wa(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Fa(e, "draft"), l = Fa(e, "error"), r = L(!!l.value), i = L(!1), c = L(!1), d = L(null);
    async function f() {
      var v, x;
      r.value = !0, i.value = !1, await mt(), (x = ((v = d.value) == null ? void 0 : v.querySelector("input")) || d.value) == null || x.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function g() {
      const v = o.value.trim();
      if (!(!v || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(v), r.value = !1, i.value = !0;
        } catch (x) {
          o.value = v, l.value = x.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: f }), (v, x) => (u(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (u(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(g, ["prevent"]),
        onKeydown: Zt(m, ["esc"])
      }, [
        ue(v.$slots, "who", {}, void 0, !0),
        tt(y("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": x[0] || (x[0] = (M) => o.value = M),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: x[1] || (x[1] = Zt((M) => P(u5)(M, g), ["enter"]))
        }, null, 40, d5), [
          [Ha, o.value]
        ]),
        y("div", f5, [
          y("span", h5, k(l.value), 1),
          D(de, {
            small: "",
            onClick: m
          }, {
            default: q(() => [...x[3] || (x[3] = [
              te("Cancel", -1)
            ])]),
            _: 1
          }),
          D(de, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: q(() => [...x[4] || (x[4] = [
              te("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), h("div", m5, [
        y("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          y("span", p5, [
            D(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          y("span", g5, k(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), h("span", v5, "Draft kept")) : C("", !0)
        ]),
        e.count ? (u(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: x[2] || (x[2] = (M) => s("show"))
        }, [
          y("span", null, k(P(iu)(e.count, "comment")), 1),
          D(ye, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, b5 = /* @__PURE__ */ Y(y5, [["__scopeId", "data-v-54460909"]]);
function w5(e, t) {
  const n = L([]), a = L(!1), s = L(null), o = L(0), l = L(!1), r = L("");
  let i = 0, c = 0;
  const d = (v) => {
    if (typeof v.body == "string") return v.body;
    const { noun: x, id: M, title: B } = e(), F = `On ${x} ${M}, ${B}: `;
    return v.text.startsWith(F) ? v.text.slice(F.length) : v.text;
  };
  async function f(v = 1) {
    const { noun: x, id: M } = e();
    if (!M) return;
    const B = ++c;
    l.value = !0, r.value = "";
    try {
      const F = await t([x, "comments", String(M), "--page", String(v), "--page-size", "25"]);
      if (B !== c) return;
      if (!F.ok) {
        r.value = F.error;
        return;
      }
      const J = F.value.rows ?? [], O = v === 1 ? J : [...n.value, ...J];
      n.value = [...new Map(O.map((w) => [w.id, w])).values()], o.value = F.value.total ?? n.value.length, s.value = F.value.next_page ?? null;
    } catch (F) {
      B === c && (r.value = F.message);
    } finally {
      B === c && (l.value = !1);
    }
  }
  async function m(v) {
    var w;
    const { noun: x, id: M } = e(), B = `${x}:${M}`, F = { id: `sending-${++i}`, text: v };
    n.value = [...n.value, F], o.value++, a.value = !0;
    const J = await t([x, "comment", String(M), v]);
    if (B !== `${e().noun}:${e().id}`) return;
    if (!J.ok)
      throw n.value = n.value.filter((R) => R.id !== F.id), o.value = Math.max(0, o.value - 1), new Error(J.error);
    await f();
    const O = (w = J.value) == null ? void 0 : w.id;
    O && !n.value.some((R) => R.id === O) && (n.value = [...n.value, { ...F, id: O }]);
  }
  const g = () => !l.value && s.value && f(s.value);
  return fe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", c++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: g, nextPage: s, total: o, loading: l, failure: r };
}
const k5 = { class: "top" }, x5 = {
  class: "crumb",
  "data-task-crumb": ""
}, $5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, M5 = {
  key: 1,
  class: "body"
}, S5 = { class: "summary" }, _5 = { class: "stamp" }, E5 = {
  class: "title",
  "data-resource-title": ""
}, A5 = {
  class: "tabs",
  "data-task-tabs": ""
}, C5 = { class: "panels" }, O5 = {
  __name: "TaskInspector",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    lone: Boolean,
    stepped: Boolean,
    backed: Boolean,
    changes: { type: Number, default: 0 }
  },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = L(null), l = L(null), r = L(null), i = L(""), c = L(""), d = L(null), f = L(null), m = L("details"), g = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = w5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (w) => a.read(w)
    );
    let x = 0;
    const M = I(() => {
      var w;
      return (w = l.value) != null && w.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function B() {
      const w = ++x, [R, b, A] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      w === x && (i.value = R.ok ? "" : R.error, o.value = R.ok ? R.value : null, l.value = b.ok ? b.value : null, r.value = A.ok ? A.value : null);
    }
    fe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", B();
      },
      { immediate: !0 }
    ), fe(() => a.changes, B), fe(v.open, (w) => {
      w && (m.value = "comments");
    });
    async function F(w) {
      const R = o.value.priority;
      o.value.priority = Number(w);
      const b = await a.read(["task", "edit", String(a.id), "--priority", w]);
      if (c.value = b.ok ? "" : b.error, b.ok) return B();
      o.value.priority = R;
    }
    function J(w) {
      d.value = null, f.value.press(w);
    }
    const O = (w) => {
      var R;
      return ((R = f.value) == null ? void 0 : R.moves.length) && (d.value = w);
    };
    return t({ openStatus: O }), (w, R) => (u(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      y("div", k5, [
        e.backed ? (u(), H(Rk, {
          key: 0,
          onBack: R[0] || (R[0] = (b) => s("back"))
        })) : C("", !0),
        y("span", x5, k(M.value), 1),
        R[10] || (R[10] = y("span", { class: "grow" }, null, -1)),
        e.stepped ? (u(), h(G, { key: 1 }, [
          D(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: R[1] || (R[1] = (b) => s("step", -1))
          }, {
            default: q(() => [
              D(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          D(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: R[2] || (R[2] = (b) => s("step", 1))
          }, {
            default: q(() => [
              D(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : C("", !0),
        D(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: R[3] || (R[3] = (b) => s("close"))
        }, {
          default: q(() => [
            D(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (u(), h("p", $5, k(i.value), 1)) : o.value ? (u(), h(G, { key: 2 }, [
        D(qk, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: B
        }, null, 8, ["id", "row", "read"]),
        y("header", S5, [
          y("div", _5, [
            te(" Task " + k(o.value.id) + " · updated ", 1),
            D(la, {
              at: P(Ql)(o.value)
            }, null, 8, ["at"])
          ]),
          y("h3", E5, k(o.value.title), 1)
        ]),
        y("div", A5, [
          D(rn, {
            options: g,
            value: m.value,
            onPick: R[4] || (R[4] = (b) => m.value = b)
          }, null, 8, ["value"])
        ]),
        y("div", C5, [
          D(jt, { value: m.value }, {
            details: q(() => [
              D(z2, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: c.value,
                onStatus: O,
                onPriority: F,
                onSelect: R[5] || (R[5] = (b) => s("select", b))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              D(Tk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              D(lu, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: R[6] || (R[6] = (b) => s("select", b))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: q(() => [
              D(c5, {
                below: "",
                comments: P(v).comments.value,
                words: P(v).words,
                more: !!P(v).nextPage.value,
                loading: P(v).loading.value,
                failure: P(v).failure.value,
                onMore: P(v).loadMore,
                onClose: R[7] || (R[7] = (b) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: q(() => [
              D(n5, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        D(b5, {
          send: P(v).send,
          count: P(v).total.value,
          onShow: R[8] || (R[8] = (b) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (u(), h("div", M5, [
        D(_t)
      ])),
      d.value ? (u(), H(Xn, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: R[9] || (R[9] = (b) => d.value = null)
      }, {
        default: q(() => [
          D(us, null, {
            default: q(() => [
              te("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (u(!0), h(G, null, ee(f.value.moves, (b) => (u(), H(Mt, {
            key: b.word,
            onClick: (A) => J(b)
          }, {
            default: q(() => [
              te(k(b.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : C("", !0)
    ], 2));
  }
}, m8 = /* @__PURE__ */ Y(O5, [["__scopeId", "data-v-0a2a3882"]]);
function T5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var qa = { exports: {} }, Xo;
function R5() {
  return Xo || (Xo = 1, (function(e, t) {
    var n = (function() {
      var a = function(w, R) {
        var b = 236, A = 17, $ = w, N = o[R], _ = null, p = 0, S = null, E = [], T = {}, j = function(z, U) {
          p = $ * 4 + 17, _ = (function(W) {
            for (var V = new Array(W), K = 0; K < W; K += 1) {
              V[K] = new Array(W);
              for (var Q = 0; Q < W; Q += 1)
                V[K][Q] = null;
            }
            return V;
          })(p), X(0, 0), X(p - 7, 0), X(0, p - 7), he(), ie(), He(z, U), $ >= 7 && Ae(z), S == null && (S = se($, N, E)), ve(S, U);
        }, X = function(z, U) {
          for (var W = -1; W <= 7; W += 1)
            if (!(z + W <= -1 || p <= z + W))
              for (var V = -1; V <= 7; V += 1)
                U + V <= -1 || p <= U + V || (0 <= W && W <= 6 && (V == 0 || V == 6) || 0 <= V && V <= 6 && (W == 0 || W == 6) || 2 <= W && W <= 4 && 2 <= V && V <= 4 ? _[z + W][U + V] = !0 : _[z + W][U + V] = !1);
        }, ne = function() {
          for (var z = 0, U = 0, W = 0; W < 8; W += 1) {
            j(!0, W);
            var V = r.getLostPoint(T);
            (W == 0 || z > V) && (z = V, U = W);
          }
          return U;
        }, ie = function() {
          for (var z = 8; z < p - 8; z += 1)
            _[z][6] == null && (_[z][6] = z % 2 == 0);
          for (var U = 8; U < p - 8; U += 1)
            _[6][U] == null && (_[6][U] = U % 2 == 0);
        }, he = function() {
          for (var z = r.getPatternPosition($), U = 0; U < z.length; U += 1)
            for (var W = 0; W < z.length; W += 1) {
              var V = z[U], K = z[W];
              if (_[V][K] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var le = -2; le <= 2; le += 1)
                    Q == -2 || Q == 2 || le == -2 || le == 2 || Q == 0 && le == 0 ? _[V + Q][K + le] = !0 : _[V + Q][K + le] = !1;
            }
        }, Ae = function(z) {
          for (var U = r.getBCHTypeNumber($), W = 0; W < 18; W += 1) {
            var V = !z && (U >> W & 1) == 1;
            _[Math.floor(W / 3)][W % 3 + p - 8 - 3] = V;
          }
          for (var W = 0; W < 18; W += 1) {
            var V = !z && (U >> W & 1) == 1;
            _[W % 3 + p - 8 - 3][Math.floor(W / 3)] = V;
          }
        }, He = function(z, U) {
          for (var W = N << 3 | U, V = r.getBCHTypeInfo(W), K = 0; K < 15; K += 1) {
            var Q = !z && (V >> K & 1) == 1;
            K < 6 ? _[K][8] = Q : K < 8 ? _[K + 1][8] = Q : _[p - 15 + K][8] = Q;
          }
          for (var K = 0; K < 15; K += 1) {
            var Q = !z && (V >> K & 1) == 1;
            K < 8 ? _[8][p - K - 1] = Q : K < 9 ? _[8][15 - K - 1 + 1] = Q : _[8][15 - K - 1] = Q;
          }
          _[p - 8][8] = !z;
        }, ve = function(z, U) {
          for (var W = -1, V = p - 1, K = 7, Q = 0, le = r.getMaskFunction(U), oe = p - 1; oe > 0; oe -= 2)
            for (oe == 6 && (oe -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (_[V][oe - ke] == null) {
                  var Se = !1;
                  Q < z.length && (Se = (z[Q] >>> K & 1) == 1);
                  var ce = le(V, oe - ke);
                  ce && (Se = !Se), _[V][oe - ke] = Se, K -= 1, K == -1 && (Q += 1, K = 7);
                }
              if (V += W, V < 0 || p <= V) {
                V -= W, W = -W;
                break;
              }
            }
        }, me = function(z, U) {
          for (var W = 0, V = 0, K = 0, Q = new Array(U.length), le = new Array(U.length), oe = 0; oe < U.length; oe += 1) {
            var ke = U[oe].dataCount, Se = U[oe].totalCount - ke;
            V = Math.max(V, ke), K = Math.max(K, Se), Q[oe] = new Array(ke);
            for (var ce = 0; ce < Q[oe].length; ce += 1)
              Q[oe][ce] = 255 & z.getBuffer()[ce + W];
            W += ke;
            var Ne = r.getErrorCorrectPolynomial(Se), De = c(Q[oe], Ne.getLength() - 1), Fs = De.mod(Ne);
            le[oe] = new Array(Ne.getLength() - 1);
            for (var ce = 0; ce < le[oe].length; ce += 1) {
              var Ws = ce + Fs.getLength() - le[oe].length;
              le[oe][ce] = Ws >= 0 ? Fs.getAt(Ws) : 0;
            }
          }
          for (var Hs = 0, ce = 0; ce < U.length; ce += 1)
            Hs += U[ce].totalCount;
          for (var ra = new Array(Hs), gn = 0, ce = 0; ce < V; ce += 1)
            for (var oe = 0; oe < U.length; oe += 1)
              ce < Q[oe].length && (ra[gn] = Q[oe][ce], gn += 1);
          for (var ce = 0; ce < K; ce += 1)
            for (var oe = 0; oe < U.length; oe += 1)
              ce < le[oe].length && (ra[gn] = le[oe][ce], gn += 1);
          return ra;
        }, se = function(z, U, W) {
          for (var V = d.getRSBlocks(z, U), K = f(), Q = 0; Q < W.length; Q += 1) {
            var le = W[Q];
            K.put(le.getMode(), 4), K.put(le.getLength(), r.getLengthInBits(le.getMode(), z)), le.write(K);
          }
          for (var oe = 0, Q = 0; Q < V.length; Q += 1)
            oe += V[Q].dataCount;
          if (K.getLengthInBits() > oe * 8)
            throw "code length overflow. (" + K.getLengthInBits() + ">" + oe * 8 + ")";
          for (K.getLengthInBits() + 4 <= oe * 8 && K.put(0, 4); K.getLengthInBits() % 8 != 0; )
            K.putBit(!1);
          for (; !(K.getLengthInBits() >= oe * 8 || (K.put(b, 8), K.getLengthInBits() >= oe * 8)); )
            K.put(A, 8);
          return me(K, V);
        };
        T.addData = function(z, U) {
          U = U || "Byte";
          var W = null;
          switch (U) {
            case "Numeric":
              W = m(z);
              break;
            case "Alphanumeric":
              W = g(z);
              break;
            case "Byte":
              W = v(z);
              break;
            case "Kanji":
              W = x(z);
              break;
            default:
              throw "mode:" + U;
          }
          E.push(W), S = null;
        }, T.isDark = function(z, U) {
          if (z < 0 || p <= z || U < 0 || p <= U)
            throw z + "," + U;
          return _[z][U];
        }, T.getModuleCount = function() {
          return p;
        }, T.make = function() {
          if ($ < 1) {
            for (var z = 1; z < 40; z++) {
              for (var U = d.getRSBlocks(z, N), W = f(), V = 0; V < E.length; V++) {
                var K = E[V];
                W.put(K.getMode(), 4), W.put(K.getLength(), r.getLengthInBits(K.getMode(), z)), K.write(W);
              }
              for (var Q = 0, V = 0; V < U.length; V++)
                Q += U[V].dataCount;
              if (W.getLengthInBits() <= Q * 8)
                break;
            }
            $ = z;
          }
          j(!1, ne());
        }, T.createTableTag = function(z, U) {
          z = z || 2, U = typeof U > "u" ? z * 4 : U;
          var W = "";
          W += '<table style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: " + U + "px;", W += '">', W += "<tbody>";
          for (var V = 0; V < T.getModuleCount(); V += 1) {
            W += "<tr>";
            for (var K = 0; K < T.getModuleCount(); K += 1)
              W += '<td style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: 0px;", W += " width: " + z + "px;", W += " height: " + z + "px;", W += " background-color: ", W += T.isDark(V, K) ? "#000000" : "#ffffff", W += ";", W += '"/>';
            W += "</tr>";
          }
          return W += "</tbody>", W += "</table>", W;
        }, T.createSvgTag = function(z, U, W, V) {
          var K = {};
          typeof arguments[0] == "object" && (K = arguments[0], z = K.cellSize, U = K.margin, W = K.alt, V = K.title), z = z || 2, U = typeof U > "u" ? z * 4 : U, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-description" : null, V = typeof V == "string" ? { text: V } : V || {}, V.text = V.text || null, V.id = V.text ? V.id || "qrcode-title" : null;
          var Q = T.getModuleCount() * z + U * 2, le, oe, ke, Se, ce = "", Ne;
          for (Ne = "l" + z + ",0 0," + z + " -" + z + ",0 0,-" + z + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += K.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', ce += ' viewBox="0 0 ' + Q + " " + Q + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += V.text || W.text ? ' role="img" aria-labelledby="' + Ye([V.id, W.id].join(" ").trim()) + '"' : "", ce += ">", ce += V.text ? '<title id="' + Ye(V.id) + '">' + Ye(V.text) + "</title>" : "", ce += W.text ? '<description id="' + Ye(W.id) + '">' + Ye(W.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < T.getModuleCount(); ke += 1)
            for (Se = ke * z + U, le = 0; le < T.getModuleCount(); le += 1)
              T.isDark(ke, le) && (oe = le * z + U, ce += "M" + oe + "," + Se + Ne);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, T.createDataURL = function(z, U) {
          z = z || 2, U = typeof U > "u" ? z * 4 : U;
          var W = T.getModuleCount() * z + U * 2, V = U, K = W - U;
          return O(W, W, function(Q, le) {
            if (V <= Q && Q < K && V <= le && le < K) {
              var oe = Math.floor((Q - V) / z), ke = Math.floor((le - V) / z);
              return T.isDark(ke, oe) ? 0 : 1;
            } else
              return 1;
          });
        }, T.createImgTag = function(z, U, W) {
          z = z || 2, U = typeof U > "u" ? z * 4 : U;
          var V = T.getModuleCount() * z + U * 2, K = "";
          return K += "<img", K += ' src="', K += T.createDataURL(z, U), K += '"', K += ' width="', K += V, K += '"', K += ' height="', K += V, K += '"', W && (K += ' alt="', K += Ye(W), K += '"'), K += "/>", K;
        };
        var Ye = function(z) {
          for (var U = "", W = 0; W < z.length; W += 1) {
            var V = z.charAt(W);
            switch (V) {
              case "<":
                U += "&lt;";
                break;
              case ">":
                U += "&gt;";
                break;
              case "&":
                U += "&amp;";
                break;
              case '"':
                U += "&quot;";
                break;
              default:
                U += V;
                break;
            }
          }
          return U;
        }, ri = function(z) {
          var U = 1;
          z = typeof z > "u" ? U * 2 : z;
          var W = T.getModuleCount() * U + z * 2, V = z, K = W - z, Q, le, oe, ke, Se, ce = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ne = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, De = "";
          for (Q = 0; Q < W; Q += 2) {
            for (oe = Math.floor((Q - V) / U), ke = Math.floor((Q + 1 - V) / U), le = 0; le < W; le += 1)
              Se = "█", V <= le && le < K && V <= Q && Q < K && T.isDark(oe, Math.floor((le - V) / U)) && (Se = " "), V <= le && le < K && V <= Q + 1 && Q + 1 < K && T.isDark(ke, Math.floor((le - V) / U)) ? Se += " " : Se += "█", De += z < 1 && Q + 1 >= K ? Ne[Se] : ce[Se];
            De += `
`;
          }
          return W % 2 && z > 0 ? De.substring(0, De.length - W - 1) + Array(W + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return T.createASCII = function(z, U) {
          if (z = z || 1, z < 2)
            return ri(U);
          z -= 1, U = typeof U > "u" ? z * 2 : U;
          var W = T.getModuleCount() * z + U * 2, V = U, K = W - U, Q, le, oe, ke, Se = Array(z + 1).join("██"), ce = Array(z + 1).join("  "), Ne = "", De = "";
          for (Q = 0; Q < W; Q += 1) {
            for (oe = Math.floor((Q - V) / z), De = "", le = 0; le < W; le += 1)
              ke = 1, V <= le && le < K && V <= Q && Q < K && T.isDark(oe, Math.floor((le - V) / z)) && (ke = 0), De += ke ? Se : ce;
            for (oe = 0; oe < z; oe += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, T.renderTo2dContext = function(z, U) {
          U = U || 2;
          for (var W = T.getModuleCount(), V = 0; V < W; V++)
            for (var K = 0; K < W; K++)
              z.fillStyle = T.isDark(V, K) ? "black" : "white", z.fillRect(V * U, K * U, U, U);
        }, T;
      };
      a.stringToBytesFuncs = {
        default: function(w) {
          for (var R = [], b = 0; b < w.length; b += 1) {
            var A = w.charCodeAt(b);
            R.push(A & 255);
          }
          return R;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(w, R) {
        var b = (function() {
          for (var $ = F(w), N = function() {
            var ie = $.read();
            if (ie == -1) throw "eof";
            return ie;
          }, _ = 0, p = {}; ; ) {
            var S = $.read();
            if (S == -1) break;
            var E = N(), T = N(), j = N(), X = String.fromCharCode(S << 8 | E), ne = T << 8 | j;
            p[X] = ne, _ += 1;
          }
          if (_ != R)
            throw _ + " != " + R;
          return p;
        })(), A = 63;
        return function($) {
          for (var N = [], _ = 0; _ < $.length; _ += 1) {
            var p = $.charCodeAt(_);
            if (p < 128)
              N.push(p);
            else {
              var S = b[$.charAt(_)];
              typeof S == "number" ? (S & 255) == S ? N.push(S) : (N.push(S >>> 8), N.push(S & 255)) : N.push(A);
            }
          }
          return N;
        };
      };
      var s = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
      }, o = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      }, l = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, r = (function() {
        var w = [
          [],
          [6, 18],
          [6, 22],
          [6, 26],
          [6, 30],
          [6, 34],
          [6, 22, 38],
          [6, 24, 42],
          [6, 26, 46],
          [6, 28, 50],
          [6, 30, 54],
          [6, 32, 58],
          [6, 34, 62],
          [6, 26, 46, 66],
          [6, 26, 48, 70],
          [6, 26, 50, 74],
          [6, 30, 54, 78],
          [6, 30, 56, 82],
          [6, 30, 58, 86],
          [6, 34, 62, 90],
          [6, 28, 50, 72, 94],
          [6, 26, 50, 74, 98],
          [6, 30, 54, 78, 102],
          [6, 28, 54, 80, 106],
          [6, 32, 58, 84, 110],
          [6, 30, 58, 86, 114],
          [6, 34, 62, 90, 118],
          [6, 26, 50, 74, 98, 122],
          [6, 30, 54, 78, 102, 126],
          [6, 26, 52, 78, 104, 130],
          [6, 30, 56, 82, 108, 134],
          [6, 34, 60, 86, 112, 138],
          [6, 30, 58, 86, 114, 142],
          [6, 34, 62, 90, 118, 146],
          [6, 30, 54, 78, 102, 126, 150],
          [6, 24, 50, 76, 102, 128, 154],
          [6, 28, 54, 80, 106, 132, 158],
          [6, 32, 58, 84, 110, 136, 162],
          [6, 26, 54, 82, 110, 138, 166],
          [6, 30, 58, 86, 114, 142, 170]
        ], R = 1335, b = 7973, A = 21522, $ = {}, N = function(_) {
          for (var p = 0; _ != 0; )
            p += 1, _ >>>= 1;
          return p;
        };
        return $.getBCHTypeInfo = function(_) {
          for (var p = _ << 10; N(p) - N(R) >= 0; )
            p ^= R << N(p) - N(R);
          return (_ << 10 | p) ^ A;
        }, $.getBCHTypeNumber = function(_) {
          for (var p = _ << 12; N(p) - N(b) >= 0; )
            p ^= b << N(p) - N(b);
          return _ << 12 | p;
        }, $.getPatternPosition = function(_) {
          return w[_ - 1];
        }, $.getMaskFunction = function(_) {
          switch (_) {
            case l.PATTERN000:
              return function(p, S) {
                return (p + S) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, S) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, S) {
                return S % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, S) {
                return (p + S) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, S) {
                return (Math.floor(p / 2) + Math.floor(S / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, S) {
                return p * S % 2 + p * S % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, S) {
                return (p * S % 2 + p * S % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, S) {
                return (p * S % 3 + (p + S) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + _;
          }
        }, $.getErrorCorrectPolynomial = function(_) {
          for (var p = c([1], 0), S = 0; S < _; S += 1)
            p = p.multiply(c([1, i.gexp(S)], 0));
          return p;
        }, $.getLengthInBits = function(_, p) {
          if (1 <= p && p < 10)
            switch (_) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + _;
            }
          else if (p < 27)
            switch (_) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + _;
            }
          else if (p < 41)
            switch (_) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + _;
            }
          else
            throw "type:" + p;
        }, $.getLostPoint = function(_) {
          for (var p = _.getModuleCount(), S = 0, E = 0; E < p; E += 1)
            for (var T = 0; T < p; T += 1) {
              for (var j = 0, X = _.isDark(E, T), ne = -1; ne <= 1; ne += 1)
                if (!(E + ne < 0 || p <= E + ne))
                  for (var ie = -1; ie <= 1; ie += 1)
                    T + ie < 0 || p <= T + ie || ne == 0 && ie == 0 || X == _.isDark(E + ne, T + ie) && (j += 1);
              j > 5 && (S += 3 + j - 5);
            }
          for (var E = 0; E < p - 1; E += 1)
            for (var T = 0; T < p - 1; T += 1) {
              var he = 0;
              _.isDark(E, T) && (he += 1), _.isDark(E + 1, T) && (he += 1), _.isDark(E, T + 1) && (he += 1), _.isDark(E + 1, T + 1) && (he += 1), (he == 0 || he == 4) && (S += 3);
            }
          for (var E = 0; E < p; E += 1)
            for (var T = 0; T < p - 6; T += 1)
              _.isDark(E, T) && !_.isDark(E, T + 1) && _.isDark(E, T + 2) && _.isDark(E, T + 3) && _.isDark(E, T + 4) && !_.isDark(E, T + 5) && _.isDark(E, T + 6) && (S += 40);
          for (var T = 0; T < p; T += 1)
            for (var E = 0; E < p - 6; E += 1)
              _.isDark(E, T) && !_.isDark(E + 1, T) && _.isDark(E + 2, T) && _.isDark(E + 3, T) && _.isDark(E + 4, T) && !_.isDark(E + 5, T) && _.isDark(E + 6, T) && (S += 40);
          for (var Ae = 0, T = 0; T < p; T += 1)
            for (var E = 0; E < p; E += 1)
              _.isDark(E, T) && (Ae += 1);
          var He = Math.abs(100 * Ae / p / p - 50) / 5;
          return S += He * 10, S;
        }, $;
      })(), i = (function() {
        for (var w = new Array(256), R = new Array(256), b = 0; b < 8; b += 1)
          w[b] = 1 << b;
        for (var b = 8; b < 256; b += 1)
          w[b] = w[b - 4] ^ w[b - 5] ^ w[b - 6] ^ w[b - 8];
        for (var b = 0; b < 255; b += 1)
          R[w[b]] = b;
        var A = {};
        return A.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return R[$];
        }, A.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return w[$];
        }, A;
      })();
      function c(w, R) {
        if (typeof w.length > "u")
          throw w.length + "/" + R;
        var b = (function() {
          for (var $ = 0; $ < w.length && w[$] == 0; )
            $ += 1;
          for (var N = new Array(w.length - $ + R), _ = 0; _ < w.length - $; _ += 1)
            N[_] = w[_ + $];
          return N;
        })(), A = {};
        return A.getAt = function($) {
          return b[$];
        }, A.getLength = function() {
          return b.length;
        }, A.multiply = function($) {
          for (var N = new Array(A.getLength() + $.getLength() - 1), _ = 0; _ < A.getLength(); _ += 1)
            for (var p = 0; p < $.getLength(); p += 1)
              N[_ + p] ^= i.gexp(i.glog(A.getAt(_)) + i.glog($.getAt(p)));
          return c(N, 0);
        }, A.mod = function($) {
          if (A.getLength() - $.getLength() < 0)
            return A;
          for (var N = i.glog(A.getAt(0)) - i.glog($.getAt(0)), _ = new Array(A.getLength()), p = 0; p < A.getLength(); p += 1)
            _[p] = A.getAt(p);
          for (var p = 0; p < $.getLength(); p += 1)
            _[p] ^= i.gexp(i.glog($.getAt(p)) + N);
          return c(_, 0).mod($);
        }, A;
      }
      var d = (function() {
        var w = [
          // L
          // M
          // Q
          // H
          // 1
          [1, 26, 19],
          [1, 26, 16],
          [1, 26, 13],
          [1, 26, 9],
          // 2
          [1, 44, 34],
          [1, 44, 28],
          [1, 44, 22],
          [1, 44, 16],
          // 3
          [1, 70, 55],
          [1, 70, 44],
          [2, 35, 17],
          [2, 35, 13],
          // 4
          [1, 100, 80],
          [2, 50, 32],
          [2, 50, 24],
          [4, 25, 9],
          // 5
          [1, 134, 108],
          [2, 67, 43],
          [2, 33, 15, 2, 34, 16],
          [2, 33, 11, 2, 34, 12],
          // 6
          [2, 86, 68],
          [4, 43, 27],
          [4, 43, 19],
          [4, 43, 15],
          // 7
          [2, 98, 78],
          [4, 49, 31],
          [2, 32, 14, 4, 33, 15],
          [4, 39, 13, 1, 40, 14],
          // 8
          [2, 121, 97],
          [2, 60, 38, 2, 61, 39],
          [4, 40, 18, 2, 41, 19],
          [4, 40, 14, 2, 41, 15],
          // 9
          [2, 146, 116],
          [3, 58, 36, 2, 59, 37],
          [4, 36, 16, 4, 37, 17],
          [4, 36, 12, 4, 37, 13],
          // 10
          [2, 86, 68, 2, 87, 69],
          [4, 69, 43, 1, 70, 44],
          [6, 43, 19, 2, 44, 20],
          [6, 43, 15, 2, 44, 16],
          // 11
          [4, 101, 81],
          [1, 80, 50, 4, 81, 51],
          [4, 50, 22, 4, 51, 23],
          [3, 36, 12, 8, 37, 13],
          // 12
          [2, 116, 92, 2, 117, 93],
          [6, 58, 36, 2, 59, 37],
          [4, 46, 20, 6, 47, 21],
          [7, 42, 14, 4, 43, 15],
          // 13
          [4, 133, 107],
          [8, 59, 37, 1, 60, 38],
          [8, 44, 20, 4, 45, 21],
          [12, 33, 11, 4, 34, 12],
          // 14
          [3, 145, 115, 1, 146, 116],
          [4, 64, 40, 5, 65, 41],
          [11, 36, 16, 5, 37, 17],
          [11, 36, 12, 5, 37, 13],
          // 15
          [5, 109, 87, 1, 110, 88],
          [5, 65, 41, 5, 66, 42],
          [5, 54, 24, 7, 55, 25],
          [11, 36, 12, 7, 37, 13],
          // 16
          [5, 122, 98, 1, 123, 99],
          [7, 73, 45, 3, 74, 46],
          [15, 43, 19, 2, 44, 20],
          [3, 45, 15, 13, 46, 16],
          // 17
          [1, 135, 107, 5, 136, 108],
          [10, 74, 46, 1, 75, 47],
          [1, 50, 22, 15, 51, 23],
          [2, 42, 14, 17, 43, 15],
          // 18
          [5, 150, 120, 1, 151, 121],
          [9, 69, 43, 4, 70, 44],
          [17, 50, 22, 1, 51, 23],
          [2, 42, 14, 19, 43, 15],
          // 19
          [3, 141, 113, 4, 142, 114],
          [3, 70, 44, 11, 71, 45],
          [17, 47, 21, 4, 48, 22],
          [9, 39, 13, 16, 40, 14],
          // 20
          [3, 135, 107, 5, 136, 108],
          [3, 67, 41, 13, 68, 42],
          [15, 54, 24, 5, 55, 25],
          [15, 43, 15, 10, 44, 16],
          // 21
          [4, 144, 116, 4, 145, 117],
          [17, 68, 42],
          [17, 50, 22, 6, 51, 23],
          [19, 46, 16, 6, 47, 17],
          // 22
          [2, 139, 111, 7, 140, 112],
          [17, 74, 46],
          [7, 54, 24, 16, 55, 25],
          [34, 37, 13],
          // 23
          [4, 151, 121, 5, 152, 122],
          [4, 75, 47, 14, 76, 48],
          [11, 54, 24, 14, 55, 25],
          [16, 45, 15, 14, 46, 16],
          // 24
          [6, 147, 117, 4, 148, 118],
          [6, 73, 45, 14, 74, 46],
          [11, 54, 24, 16, 55, 25],
          [30, 46, 16, 2, 47, 17],
          // 25
          [8, 132, 106, 4, 133, 107],
          [8, 75, 47, 13, 76, 48],
          [7, 54, 24, 22, 55, 25],
          [22, 45, 15, 13, 46, 16],
          // 26
          [10, 142, 114, 2, 143, 115],
          [19, 74, 46, 4, 75, 47],
          [28, 50, 22, 6, 51, 23],
          [33, 46, 16, 4, 47, 17],
          // 27
          [8, 152, 122, 4, 153, 123],
          [22, 73, 45, 3, 74, 46],
          [8, 53, 23, 26, 54, 24],
          [12, 45, 15, 28, 46, 16],
          // 28
          [3, 147, 117, 10, 148, 118],
          [3, 73, 45, 23, 74, 46],
          [4, 54, 24, 31, 55, 25],
          [11, 45, 15, 31, 46, 16],
          // 29
          [7, 146, 116, 7, 147, 117],
          [21, 73, 45, 7, 74, 46],
          [1, 53, 23, 37, 54, 24],
          [19, 45, 15, 26, 46, 16],
          // 30
          [5, 145, 115, 10, 146, 116],
          [19, 75, 47, 10, 76, 48],
          [15, 54, 24, 25, 55, 25],
          [23, 45, 15, 25, 46, 16],
          // 31
          [13, 145, 115, 3, 146, 116],
          [2, 74, 46, 29, 75, 47],
          [42, 54, 24, 1, 55, 25],
          [23, 45, 15, 28, 46, 16],
          // 32
          [17, 145, 115],
          [10, 74, 46, 23, 75, 47],
          [10, 54, 24, 35, 55, 25],
          [19, 45, 15, 35, 46, 16],
          // 33
          [17, 145, 115, 1, 146, 116],
          [14, 74, 46, 21, 75, 47],
          [29, 54, 24, 19, 55, 25],
          [11, 45, 15, 46, 46, 16],
          // 34
          [13, 145, 115, 6, 146, 116],
          [14, 74, 46, 23, 75, 47],
          [44, 54, 24, 7, 55, 25],
          [59, 46, 16, 1, 47, 17],
          // 35
          [12, 151, 121, 7, 152, 122],
          [12, 75, 47, 26, 76, 48],
          [39, 54, 24, 14, 55, 25],
          [22, 45, 15, 41, 46, 16],
          // 36
          [6, 151, 121, 14, 152, 122],
          [6, 75, 47, 34, 76, 48],
          [46, 54, 24, 10, 55, 25],
          [2, 45, 15, 64, 46, 16],
          // 37
          [17, 152, 122, 4, 153, 123],
          [29, 74, 46, 14, 75, 47],
          [49, 54, 24, 10, 55, 25],
          [24, 45, 15, 46, 46, 16],
          // 38
          [4, 152, 122, 18, 153, 123],
          [13, 74, 46, 32, 75, 47],
          [48, 54, 24, 14, 55, 25],
          [42, 45, 15, 32, 46, 16],
          // 39
          [20, 147, 117, 4, 148, 118],
          [40, 75, 47, 7, 76, 48],
          [43, 54, 24, 22, 55, 25],
          [10, 45, 15, 67, 46, 16],
          // 40
          [19, 148, 118, 6, 149, 119],
          [18, 75, 47, 31, 76, 48],
          [34, 54, 24, 34, 55, 25],
          [20, 45, 15, 61, 46, 16]
        ], R = function($, N) {
          var _ = {};
          return _.totalCount = $, _.dataCount = N, _;
        }, b = {}, A = function($, N) {
          switch (N) {
            case o.L:
              return w[($ - 1) * 4 + 0];
            case o.M:
              return w[($ - 1) * 4 + 1];
            case o.Q:
              return w[($ - 1) * 4 + 2];
            case o.H:
              return w[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return b.getRSBlocks = function($, N) {
          var _ = A($, N);
          if (typeof _ > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + N;
          for (var p = _.length / 3, S = [], E = 0; E < p; E += 1)
            for (var T = _[E * 3 + 0], j = _[E * 3 + 1], X = _[E * 3 + 2], ne = 0; ne < T; ne += 1)
              S.push(R(j, X));
          return S;
        }, b;
      })(), f = function() {
        var w = [], R = 0, b = {};
        return b.getBuffer = function() {
          return w;
        }, b.getAt = function(A) {
          var $ = Math.floor(A / 8);
          return (w[$] >>> 7 - A % 8 & 1) == 1;
        }, b.put = function(A, $) {
          for (var N = 0; N < $; N += 1)
            b.putBit((A >>> $ - N - 1 & 1) == 1);
        }, b.getLengthInBits = function() {
          return R;
        }, b.putBit = function(A) {
          var $ = Math.floor(R / 8);
          w.length <= $ && w.push(0), A && (w[$] |= 128 >>> R % 8), R += 1;
        }, b;
      }, m = function(w) {
        var R = s.MODE_NUMBER, b = w, A = {};
        A.getMode = function() {
          return R;
        }, A.getLength = function(_) {
          return b.length;
        }, A.write = function(_) {
          for (var p = b, S = 0; S + 2 < p.length; )
            _.put($(p.substring(S, S + 3)), 10), S += 3;
          S < p.length && (p.length - S == 1 ? _.put($(p.substring(S, S + 1)), 4) : p.length - S == 2 && _.put($(p.substring(S, S + 2)), 7));
        };
        var $ = function(_) {
          for (var p = 0, S = 0; S < _.length; S += 1)
            p = p * 10 + N(_.charAt(S));
          return p;
        }, N = function(_) {
          if ("0" <= _ && _ <= "9")
            return _.charCodeAt(0) - 48;
          throw "illegal char :" + _;
        };
        return A;
      }, g = function(w) {
        var R = s.MODE_ALPHA_NUM, b = w, A = {};
        A.getMode = function() {
          return R;
        }, A.getLength = function(N) {
          return b.length;
        }, A.write = function(N) {
          for (var _ = b, p = 0; p + 1 < _.length; )
            N.put(
              $(_.charAt(p)) * 45 + $(_.charAt(p + 1)),
              11
            ), p += 2;
          p < _.length && N.put($(_.charAt(p)), 6);
        };
        var $ = function(N) {
          if ("0" <= N && N <= "9")
            return N.charCodeAt(0) - 48;
          if ("A" <= N && N <= "Z")
            return N.charCodeAt(0) - 65 + 10;
          switch (N) {
            case " ":
              return 36;
            case "$":
              return 37;
            case "%":
              return 38;
            case "*":
              return 39;
            case "+":
              return 40;
            case "-":
              return 41;
            case ".":
              return 42;
            case "/":
              return 43;
            case ":":
              return 44;
            default:
              throw "illegal char :" + N;
          }
        };
        return A;
      }, v = function(w) {
        var R = s.MODE_8BIT_BYTE, b = a.stringToBytes(w), A = {};
        return A.getMode = function() {
          return R;
        }, A.getLength = function($) {
          return b.length;
        }, A.write = function($) {
          for (var N = 0; N < b.length; N += 1)
            $.put(b[N], 8);
        }, A;
      }, x = function(w) {
        var R = s.MODE_KANJI, b = a.stringToBytesFuncs.SJIS;
        if (!b)
          throw "sjis not supported.";
        (function(N, _) {
          var p = b(N);
          if (p.length != 2 || (p[0] << 8 | p[1]) != _)
            throw "sjis not supported.";
        })("友", 38726);
        var A = b(w), $ = {};
        return $.getMode = function() {
          return R;
        }, $.getLength = function(N) {
          return ~~(A.length / 2);
        }, $.write = function(N) {
          for (var _ = A, p = 0; p + 1 < _.length; ) {
            var S = (255 & _[p]) << 8 | 255 & _[p + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), N.put(S, 13), p += 2;
          }
          if (p < _.length)
            throw "illegal char at " + (p + 1);
        }, $;
      }, M = function() {
        var w = [], R = {};
        return R.writeByte = function(b) {
          w.push(b & 255);
        }, R.writeShort = function(b) {
          R.writeByte(b), R.writeByte(b >>> 8);
        }, R.writeBytes = function(b, A, $) {
          A = A || 0, $ = $ || b.length;
          for (var N = 0; N < $; N += 1)
            R.writeByte(b[N + A]);
        }, R.writeString = function(b) {
          for (var A = 0; A < b.length; A += 1)
            R.writeByte(b.charCodeAt(A));
        }, R.toByteArray = function() {
          return w;
        }, R.toString = function() {
          var b = "";
          b += "[";
          for (var A = 0; A < w.length; A += 1)
            A > 0 && (b += ","), b += w[A];
          return b += "]", b;
        }, R;
      }, B = function() {
        var w = 0, R = 0, b = 0, A = "", $ = {}, N = function(p) {
          A += String.fromCharCode(_(p & 63));
        }, _ = function(p) {
          if (!(p < 0)) {
            if (p < 26)
              return 65 + p;
            if (p < 52)
              return 97 + (p - 26);
            if (p < 62)
              return 48 + (p - 52);
            if (p == 62)
              return 43;
            if (p == 63)
              return 47;
          }
          throw "n:" + p;
        };
        return $.writeByte = function(p) {
          for (w = w << 8 | p & 255, R += 8, b += 1; R >= 6; )
            N(w >>> R - 6), R -= 6;
        }, $.flush = function() {
          if (R > 0 && (N(w << 6 - R), w = 0, R = 0), b % 3 != 0)
            for (var p = 3 - b % 3, S = 0; S < p; S += 1)
              A += "=";
        }, $.toString = function() {
          return A;
        }, $;
      }, F = function(w) {
        var R = w, b = 0, A = 0, $ = 0, N = {};
        N.read = function() {
          for (; $ < 8; ) {
            if (b >= R.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var p = R.charAt(b);
            if (b += 1, p == "=")
              return $ = 0, -1;
            if (p.match(/^\s$/))
              continue;
            A = A << 6 | _(p.charCodeAt(0)), $ += 6;
          }
          var S = A >>> $ - 8 & 255;
          return $ -= 8, S;
        };
        var _ = function(p) {
          if (65 <= p && p <= 90)
            return p - 65;
          if (97 <= p && p <= 122)
            return p - 97 + 26;
          if (48 <= p && p <= 57)
            return p - 48 + 52;
          if (p == 43)
            return 62;
          if (p == 47)
            return 63;
          throw "c:" + p;
        };
        return N;
      }, J = function(w, R) {
        var b = w, A = R, $ = new Array(w * R), N = {};
        N.setPixel = function(E, T, j) {
          $[T * b + E] = j;
        }, N.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(b), E.writeShort(A), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(b), E.writeShort(A), E.writeByte(0);
          var T = 2, j = p(T);
          E.writeByte(T);
          for (var X = 0; j.length - X > 255; )
            E.writeByte(255), E.writeBytes(j, X, 255), X += 255;
          E.writeByte(j.length - X), E.writeBytes(j, X, j.length - X), E.writeByte(0), E.writeString(";");
        };
        var _ = function(E) {
          var T = E, j = 0, X = 0, ne = {};
          return ne.write = function(ie, he) {
            if (ie >>> he)
              throw "length over";
            for (; j + he >= 8; )
              T.writeByte(255 & (ie << j | X)), he -= 8 - j, ie >>>= 8 - j, X = 0, j = 0;
            X = ie << j | X, j = j + he;
          }, ne.flush = function() {
            j > 0 && T.writeByte(X);
          }, ne;
        }, p = function(E) {
          for (var T = 1 << E, j = (1 << E) + 1, X = E + 1, ne = S(), ie = 0; ie < T; ie += 1)
            ne.add(String.fromCharCode(ie));
          ne.add(String.fromCharCode(T)), ne.add(String.fromCharCode(j));
          var he = M(), Ae = _(he);
          Ae.write(T, X);
          var He = 0, ve = String.fromCharCode($[He]);
          for (He += 1; He < $.length; ) {
            var me = String.fromCharCode($[He]);
            He += 1, ne.contains(ve + me) ? ve = ve + me : (Ae.write(ne.indexOf(ve), X), ne.size() < 4095 && (ne.size() == 1 << X && (X += 1), ne.add(ve + me)), ve = me);
          }
          return Ae.write(ne.indexOf(ve), X), Ae.write(j, X), Ae.flush(), he.toByteArray();
        }, S = function() {
          var E = {}, T = 0, j = {};
          return j.add = function(X) {
            if (j.contains(X))
              throw "dup key:" + X;
            E[X] = T, T += 1;
          }, j.size = function() {
            return T;
          }, j.indexOf = function(X) {
            return E[X];
          }, j.contains = function(X) {
            return typeof E[X] < "u";
          }, j;
        };
        return N;
      }, O = function(w, R, b) {
        for (var A = J(w, R), $ = 0; $ < R; $ += 1)
          for (var N = 0; N < w; N += 1)
            A.setPixel(N, $, b(N, $));
        var _ = M();
        A.write(_);
        for (var p = B(), S = _.toByteArray(), E = 0; E < S.length; E += 1)
          p.writeByte(S[E]);
        return p.flush(), "data:image/gif;base64," + p;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var l = [], r = 0; r < o.length; r++) {
            var i = o.charCodeAt(r);
            i < 128 ? l.push(i) : i < 2048 ? l.push(
              192 | i >> 6,
              128 | i & 63
            ) : i < 55296 || i >= 57344 ? l.push(
              224 | i >> 12,
              128 | i >> 6 & 63,
              128 | i & 63
            ) : (r++, i = 65536 + ((i & 1023) << 10 | o.charCodeAt(r) & 1023), l.push(
              240 | i >> 18,
              128 | i >> 12 & 63,
              128 | i >> 6 & 63,
              128 | i & 63
            ));
          }
          return l;
        }
        return s(a);
      };
    })(), (function(a) {
      e.exports = a();
    })(function() {
      return n;
    });
  })(qa)), qa.exports;
}
var I5 = R5();
const B5 = /* @__PURE__ */ T5(I5), L5 = ["width", "height", "viewBox"], N5 = ["width", "height"], D5 = ["d"], j5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const a = B5(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (u(), h("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      y("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, N5),
      y("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, D5)
    ], 8, L5));
  }
}, p8 = /* @__PURE__ */ Y(j5, [["__scopeId", "data-v-b4458227"]]), P5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, g8 = /* @__PURE__ */ Y(P5, [["__scopeId", "data-v-79847aff"]]);
function v8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const y8 = ki(() => import("./VoiceFigure-BCCvLWsC.mjs").then((e) => e.V)), b8 = "1.2.0", w8 = "3.5";
export {
  Ld as $,
  _e as A,
  Ce as B,
  na as C,
  at as D,
  S$ as E,
  Lb as F,
  px as G,
  k$ as H,
  pb as I,
  Wb as J,
  At as K,
  H5 as L,
  Bs as M,
  Kb as N,
  Fb as O,
  ta as P,
  Fx as Q,
  K4 as R,
  Bn as S,
  Vx as T,
  q4 as U,
  Ee as V,
  Hn as W,
  P4 as X,
  j4 as Y,
  Bd as Z,
  Y as _,
  O4 as a,
  c$ as a$,
  Vb as a0,
  Y4 as a1,
  J4 as a2,
  Le as a3,
  rx as a4,
  lx as a5,
  St as a6,
  Z4 as a7,
  bx as a8,
  b4 as a9,
  t$ as aA,
  jx as aB,
  sb as aC,
  $x as aD,
  Mx as aE,
  _$ as aF,
  Hr as aG,
  Ux as aH,
  fn as aI,
  S4 as aJ,
  x4 as aK,
  p$ as aL,
  hn as aM,
  b$ as aN,
  mx as aO,
  Px as aP,
  qx as aQ,
  Dx as aR,
  nn as aS,
  xt as aT,
  w4 as aU,
  K0 as aV,
  Lx as aW,
  V4 as aX,
  Fr as aY,
  Nt as aZ,
  qt as a_,
  u$ as aa,
  v$ as ab,
  A4 as ac,
  F4 as ad,
  W4 as ae,
  sx as af,
  ox as ag,
  ix as ah,
  B4 as ai,
  zo as aj,
  X4 as ak,
  yx as al,
  O$ as am,
  Tx as an,
  Cx as ao,
  Ax as ap,
  cx as aq,
  nx as ar,
  tx as as,
  ax as at,
  zx as au,
  vx as av,
  wx as aw,
  I$ as ax,
  Kt as ay,
  kx as az,
  ow as b,
  R$ as b$,
  Tb as b0,
  y$ as b1,
  Yx as b2,
  Kx as b3,
  yy as b4,
  Ar as b5,
  l$ as b6,
  gx as b7,
  oa as b8,
  rt as b9,
  Zx as bA,
  a$ as bB,
  ut as bC,
  Gx as bD,
  s$ as bE,
  xx as bF,
  Rx as bG,
  Sx as bH,
  Te as bI,
  hx as bJ,
  o$ as bK,
  F$ as bL,
  W$ as bM,
  v4 as bN,
  Z0 as bO,
  dx as bP,
  Xx as bQ,
  T4 as bR,
  C$ as bS,
  Jx as bT,
  Qx as bU,
  e$ as bV,
  ux as bW,
  ob as bX,
  fx as bY,
  Ex as bZ,
  A$ as b_,
  n$ as ba,
  Ea as bb,
  Xl as bc,
  L$ as bd,
  j$ as be,
  Hx as bf,
  m$ as bg,
  y4 as bh,
  Ox as bi,
  N$ as bj,
  Q4 as bk,
  ex as bl,
  N4 as bm,
  G4 as bn,
  M4 as bo,
  f$ as bp,
  R4 as bq,
  I4 as br,
  D4 as bs,
  Bx as bt,
  H0 as bu,
  w$ as bv,
  qb as bw,
  L4 as bx,
  _4 as by,
  Ix as bz,
  vy as c,
  rn as c$,
  $4 as c0,
  k4 as c1,
  _x as c2,
  P$ as c3,
  Ps as c4,
  q$ as c5,
  si as c6,
  h$ as c7,
  z4 as c8,
  H4 as c9,
  ye as cA,
  a8 as cB,
  X5 as cC,
  b8 as cD,
  w8 as cE,
  l4 as cF,
  o8 as cG,
  ns as cH,
  f4 as cI,
  Av as cJ,
  Mt as cK,
  us as cL,
  Xn as cM,
  t4 as cN,
  r4 as cO,
  Pc as cP,
  Ug as cQ,
  f8 as cR,
  a4 as cS,
  p8 as cT,
  ar as cU,
  lu as cV,
  e8 as cW,
  Kd as cX,
  K5 as cY,
  m4 as cZ,
  nk as c_,
  G0 as ca,
  E4 as cb,
  jb as cc,
  Nx as cd,
  Ts as ce,
  Qy as cf,
  Wx as cg,
  Yt as ch,
  Lt as ci,
  Q5 as cj,
  n8 as ck,
  de as cl,
  yd as cm,
  Sd as cn,
  xs as co,
  _m as cp,
  Tl as cq,
  h8 as cr,
  g4 as cs,
  Cm as ct,
  Yp as cu,
  Xt as cv,
  H$ as cw,
  F5 as cx,
  $t as cy,
  Ku as cz,
  Ue as d,
  V$ as d$,
  i4 as d0,
  _t as d1,
  pt as d2,
  $p as d3,
  mu as d4,
  u4 as d5,
  Y5 as d6,
  jt as d7,
  s8 as d8,
  m8 as d9,
  vh as dA,
  z$ as dB,
  V5 as dC,
  r8 as dD,
  xv as dE,
  Mw as dF,
  J5 as dG,
  o4 as dH,
  K$ as dI,
  J$ as dJ,
  qe as dK,
  e4 as dL,
  n4 as dM,
  Fc as dN,
  G$ as dO,
  Gi as dP,
  G5 as dQ,
  U5 as dR,
  kl as dS,
  xl as dT,
  Su as dU,
  Z5 as dV,
  ct as dW,
  v8 as dX,
  Sw as dY,
  W5 as dZ,
  z5 as d_,
  qs as da,
  Ju as db,
  kt as dc,
  c4 as dd,
  la as de,
  y8 as df,
  g8 as dg,
  As as dh,
  Y$ as di,
  ps as dj,
  D1 as dk,
  ko as dl,
  ir as dm,
  $u as dn,
  u8 as dp,
  c8 as dq,
  ys as dr,
  xu as ds,
  ml as dt,
  s4 as du,
  d8 as dv,
  p4 as dw,
  h4 as dx,
  d4 as dy,
  U$ as dz,
  U4 as e,
  t8 as e0,
  xw as e1,
  l8 as e2,
  Og as e3,
  vl as e4,
  dk as e5,
  gs as e6,
  Z$ as e7,
  za as e8,
  X$ as e9,
  Q$ as ea,
  We as eb,
  i8 as ec,
  Mu as ed,
  W0 as f,
  B$ as g,
  an as h,
  x$ as i,
  D$ as j,
  $$ as k,
  d$ as l,
  uw as m,
  Ls as n,
  g$ as o,
  C4 as p,
  M$ as q,
  ni as r,
  ai as s,
  Me as t,
  wy as u,
  r$ as v,
  T$ as w,
  i$ as x,
  pn as y,
  E$ as z
};
