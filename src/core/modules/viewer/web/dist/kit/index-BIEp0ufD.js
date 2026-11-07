/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as P, renderSlot as ue, createElementVNode as y, normalizeClass as Z, Fragment as z, renderList as te, defineComponent as ii, Comment as ci, h as Jn, cloneVNode as ui, createBlock as H, withCtx as j, createVNode as L, toDisplayString as $, createCommentVNode as O, ref as I, onMounted as Re, onBeforeUnmount as ft, reactive as Zn, shallowRef as Ke, watch as fe, onUnmounted as Be, inject as Oe, useAttrs as Xn, computed as R, resolveDynamicComponent as ht, mergeProps as Le, useId as fs, resolveDirective as di, withDirectives as Ye, createTextVNode as ee, Teleport as hs, nextTick as mt, Transition as jt, withModifiers as $e, TransitionGroup as nl, shallowReactive as fi, isRef as zs, onScopeDispose as ms, resolveComponent as hi, useModel as Wa, getCurrentInstance as mi, mergeModels as Ha, getCurrentScope as al, provide as sl, onErrorCaptured as pi, toHandlers as gi, createSlots as vi, vShow as ol, useSlots as yi, withKeys as Xt, vModelText as Dn, normalizeProps as bi, guardReactiveProps as wi, defineAsyncComponent as ki } from "vue";
function ll(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, $i = 1600, xi = {
  __name: "Shimmer",
  setup(e) {
    const t = ll($i);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: ge(P(t))
    }, null, 4));
  }
}, Gt = /* @__PURE__ */ Y(xi, [["__scopeId", "data-v-6c018b03"]]), Mi = { class: "skeleton-line" }, Si = 2e3, _i = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = ll(Si);
    return (n, a) => (c(), h("span", Mi, [
      ue(n.$slots, "default", {}, void 0, !0),
      y("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(z, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...P(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, pt = /* @__PURE__ */ Y(_i, [["__scopeId", "data-v-484fe8a0"]]), Pt = ii({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ci);
      return a.length !== 1 ? Jn(z, { key: n }, a) : a[0].key == null ? ui(a[0], { key: n }) : a[0];
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
    return (i, u) => (c(), H(Pt, { value: e.shape }, {
      messages: j(() => [
        y("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(z, null, te(t, (d) => L(Gt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Ei)
      ]),
      older: j(() => [
        y("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(t.slice(0, 3), (d) => (c(), H(Gt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ai)
      ]),
      cards: j(() => [
        y("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(z, null, te(n, (f) => L(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ci)
      ]),
      file: j(() => [
        y("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            L(pt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(z, null, te(s, (f) => L(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Oi)
      ]),
      page: j(() => [
        y("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          L(pt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(z, null, te(e.count, (d) => (c(), H(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ti)
      ]),
      text: j(() => [
        y("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), H(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ri)
      ]),
      default: j(() => [
        y("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), H(pt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Ii)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, _t = /* @__PURE__ */ Y(Bi, [["__scopeId", "data-v-ef519c5f"]]), Li = {
  key: 1,
  class: "empty-state titled"
}, Ni = { class: "empty-state-title" }, Di = { class: "empty-state-text" }, ji = {
  key: 2,
  class: "empty-state"
}, Pi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Li, [
      y("p", Ni, $(e.title), 1),
      y("p", Di, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", ji, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ Y(Pi, [["__scopeId", "data-v-b27e89b0"]]), qi = { class: "fold-group" }, Fi = ["aria-expanded"], Wi = { class: "fold-label" }, Hi = {
  key: 0,
  class: "fold-count"
}, Ui = {
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
    return (a, s) => (c(), h("div", qi, [
      y("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        y("span", Wi, $(e.label), 1),
        e.count !== "" ? (c(), h("span", Hi, $(e.count), 1)) : O("", !0),
        y("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Fi),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : O("", !0)
    ]));
  }
}, Q5 = /* @__PURE__ */ Y(Ui, [["__scopeId", "data-v-9ef1865c"]]), zi = 150, Vi = () => zi;
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
const Ki = 50, Vs = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function e4(e) {
  const t = We().sources.find((n) => n.key === e);
  return t ? Ua(t.read, t.events) : Ua("", []);
}
function rl(e, t, n, a, s = () => !1) {
  const o = I([]), l = I(null), r = I(""), i = I(!1), u = performance.now(), d = I(!1), f = I(""), m = I(null), g = /* @__PURE__ */ new Set();
  let v = null;
  function _(p) {
    return s() ? (g.add(p), v ?? (v = new Promise((S) => setTimeout(() => S(E()), Ki)))) : T(p);
  }
  async function E() {
    const p = new Set(g);
    g.clear(), v = null;
    const S = D, x = await t({ ids: [...p].join(","), limit: p.size });
    if (S !== D) return;
    if (!x.ok) return M();
    const C = new Map(x.value.rows.map((N) => [N.id, N]));
    o.value = o.value.flatMap((N) => p.has(N.id) ? C.has(N.id) ? [C.get(N.id)] : [] : [N]);
  }
  async function T(p) {
    const S = D, x = await t({ "before-id": p + 1, limit: 1 });
    if (S !== D) return;
    if (!x.ok) return M();
    const C = x.value.rows.find((N) => N.id === p);
    o.value = C ? o.value.map((N) => N.id === p ? C : N) : o.value.filter((N) => N.id !== p);
  }
  async function W(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ne) => ne.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((ne) => ne.id === p.row_id)) return _(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return M();
    const x = Math.max(...o.value.map((ne) => ne.id)), C = D, N = await t({ "after-id": x });
    if (C !== D) return;
    if (!N.ok) return M();
    const X = new Set(o.value.map((ne) => ne.id));
    o.value = [...N.value.rows.filter((ne) => !X.has(ne.id)), ...o.value];
  }
  async function J() {
    if (!d.value || !o.value.length) return !1;
    const p = D, S = Math.min(...o.value.map((N) => N.id)), x = await t({ "before-id": S });
    if (p !== D) return !1;
    if (!x.ok || !x.value.rows.length) return d.value = !1;
    d.value = Vs(x.value, n());
    const C = new Set(o.value.map((N) => N.id));
    return o.value = [...o.value, ...x.value.rows.filter((N) => !C.has(N.id))], !0;
  }
  let D = 0;
  function B(p, S) {
    var N, X;
    const x = p.ok ? e.shared ? [p.value] : ((N = p.value) == null ? void 0 : N.rows) ?? [] : [];
    p.ok && (o.value = S(x)), l.value = p.ok ? p.value : null;
    const C = x.length ? Math.min(...x.map((ne) => ne.id)) : 0;
    p.ok && ((X = p.value) != null && X.rows) && !o.value.some((ne) => ne.id < C) && (d.value = !e.shared && Vs(p.value, n())), r.value = p.ok ? "" : p.error, ps(u, () => i.value = !0);
  }
  async function q(p) {
    const S = ++D, x = await t({});
    S === D && B(x, p);
  }
  const A = (p) => {
    if (!a() || !p.length) return p;
    const S = Math.min(...p.map((C) => C.id)), x = Math.max(...p.map((C) => C.id));
    return [...o.value.filter((C) => C.id > x), ...p, ...o.value.filter((C) => C.id < S)];
  }, M = () => q(A), b = (p) => B(p, A), k = () => q((p) => p);
  async function w(p, S = null) {
    const x = await Gi(S && { target: o, fields: { value: S(o.value) } }, p, e.run);
    return f.value = x.ok ? "" : x.error, m.value = x.ok ? x.value : null, await M(), x;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: d, load: M, loadLatest: k, older: J, act: w, actionFailure: f, answer: m, context: e, heard: W, showFirst: b };
}
const Yi = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ua(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = We(), l = rl(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Yi(i)}`), () => a, () => n);
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
  }, u = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Re(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), ft(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const il = typeof document < "u" && document.documentElement.classList.contains("phone"), cl = 120;
var el;
const ua = globalThis[el = Symbol.for("journal.pressed")] ?? (globalThis[el] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Zi(e = 0) {
  const t = ua.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ua.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ua.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function za(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ul(e = window) {
  if (!za(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    za(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Va = "journal.stale-build-reload", Xi = 'script[type="module"][src*="/assets/index-"]', Gs = (e) => {
  var t;
  return ((t = e.querySelector(Xi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Qi(e = document, t = (a, s) => Me.quietRead(a, s), n = () => ul(window)) {
  const a = Gs(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Gs(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let da = "";
function ec(e, t = () => ul(window)) {
  if (!e) return !1;
  const n = !!da && da !== e;
  return da = e, n && t(), n;
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
const sc = 2e3, oc = 3e4, Ue = Zn({ starting: !1, external: !1, late: !1, offline: !1 }), vs = () => Ue.starting, lc = 3;
let vn = 0, Ga = 0, dl = 0, fl = [];
async function rc() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ue.external };
  }
}
let Ks = null;
const ic = () => Ks ?? (Ks = rc().finally(() => Ks = null));
function cc() {
  clearTimeout(Ga), clearTimeout(dl), Ga = 0, Object.assign(Ue, { starting: !1, external: !1, late: !1, offline: !1 }), fl.splice(0).forEach((e) => e()), Qi();
}
async function uc() {
  Ue.offline = !navigator.onLine;
  const e = await ic();
  if (Ue.external = e.updating, vn = !e.restarting && !e.updating && e.reachable ? vn + 1 : 0, vn < lc) return;
  vn = 0, (!ec(e.started_at) || za()) && cc();
}
function hl() {
  Ga = setTimeout(async () => {
    await uc(), Ue.starting && hl();
  }, sc);
}
function dc() {
  Ue.starting || (Ue.starting = !0, Ue.offline = !navigator.onLine, hl(), dl = setTimeout(() => Ue.late = !0, oc));
}
const ml = () => Ue.starting ? new Promise((e) => fl.push(e)) : Promise.resolve();
function pl(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const r = () => {
    o = !1, a = Date.now(), l && (l = !1, u());
  }, i = () => {
    s = null;
    const d = e();
    a = Date.now(), d instanceof Promise && (o = !0, d.catch(() => {
    }).finally(r));
  }, u = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const d = t - (Date.now() - a);
    d <= 0 ? i() : s = setTimeout(i, d);
  };
  return u.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, u;
}
function fc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class hc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = pl(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = fc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const st = "viewer.shell", yn = 2e4, mc = 4, Ys = "/api/read-lines", pc = 5e3, gc = 403, Js = "/api/repeated-lines", vc = 10, yc = 2e3, bc = 3e5, t4 = 6e5, bn = 6, wc = 500, kc = "/journal/summary", Zs = "/api/server-state", $c = 2e4, wn = il ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, xc = (e) => e.split("?")[0].endsWith(kc), Ka = (e, t) => Object.assign(new Error(t), { status: e });
async function Mc(e, t, n = Ka) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Sc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), _c = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Xs = (e) => e.split(" ").slice(0, 2).join(" "), Xe = "read", Tt = "write", Ec = "stream";
class Ac {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Xs(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < yc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < vc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Js, { method: "POST", headers: { ...wn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Js, kind: Tt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Zi(n ? cl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: _c(n.signal, s) } : n;
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
    this.readsFlying >= mc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Ys, { headers: wn }, [{ window: st, line: Ys, kind: Xe }], pc).then(async (t) => {
      if (t.status === gc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Ka(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new hc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Xs(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const r = a instanceof FormData, i = { method: t, headers: { ...wn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Sc(a) }, u = s || (r ? bc : yn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Xe }], u)) : await this.sent(n, i, [{ window: st, line: n, kind: Tt }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, wc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = bn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Mc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: st, line: t, kind: Xe }], yn)), !0);
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
    return t !== "GET" ? this.send(t, n, a, s, bn, o).then((r) => (this.written(n), r)) : vs() && !xc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: Ec }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Zs, { cache: "no-store" }, [{ window: st, line: Zs, kind: Xe }], $c);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = yn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Xe : Tt;
    return l === Tt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const fa = Symbol.for("journal.transport"), Me = globalThis[fa] ?? (globalThis[fa] = new Ac());
class Cc {
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
      n.patterns.some((a) => ys(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ys(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Oc = 50, Tc = "refresh", Rc = 1e3, Ic = 3e4, Bc = "requested", Lc = "after_window", Nc = 50, kn = ".*", Dc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function jc(e) {
  const t = {}, n = Zn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, r = /* @__PURE__ */ new Set();
  let i = {}, u = 0, d = 0, f = !1;
  function m(b) {
    const k = () => i[b] ?? i[`${b.slice(0, b.lastIndexOf("."))}.*`] ?? {}, w = I(void 0), p = rl(e, async (S) => {
      const x = await _(b, S);
      return x.ok && !Object.keys(S).length && (w.value = x.value), x;
    }, () => k().page_size || Nc, () => !!k().page_size, () => !!k().reads_ids);
    return t[b] = { ...p, data: w, readAt: 0 };
  }
  const g = new Proxy({}, { get: (b, k) => typeof k != "string" || k.startsWith("__v") ? void 0 : t[k] ?? m(k) }), v = (b) => (i[b].loading !== Bc || b.endsWith(kn)) && (!i[b].tab || i[b].tab === n.tab);
  function _(b, k = {}) {
    return new Promise((w) => {
      a.push({ name: b, flags: k, resolve: w }), a.length === 1 && setTimeout(E);
    });
  }
  async function E() {
    const b = /* @__PURE__ */ new Map(), k = a.splice(0).filter((S) => {
      const x = JSON.stringify(S.flags);
      return b.has(S.name) || b.set(S.name, x), b.get(S.name) === x ? !0 : (a.push(S), !1);
    });
    a.length && setTimeout(E);
    const w = Object.fromEntries(k.flatMap(({ name: S, flags: x }) => Object.entries(x).map(([C, N]) => [`${S}.${C}`, N]))), p = await e.readKeys({ only: [...new Set(k.map(({ name: S }) => S))], state: { ...n, ...w } });
    k.forEach(({ name: S, resolve: x }) => x(p.ok ? p.value.keys[S] : p));
  }
  async function T(b) {
    var S;
    const k = ++d;
    (b.length ? b : Object.keys(i).filter((x) => !x.endsWith(kn) && i[x].loading === "first" && v(x))).forEach((x) => l[x] = k);
    const p = await e.readKeys({ only: b, state: { ...n } });
    if (!p.ok) {
      if (p.failure === "cancelled") return !1;
      const x = (b.length ? b : Object.keys(t)).filter((N) => (l[N] ?? 0) <= k);
      x.forEach((N) => {
        g[N].readAt = Date.now(), p.failure === "unreachable" ? r.add(N) : r.delete(N), g[N].showFirst(p);
      });
      const C = p.failure === "unreachable" && ((S = e.waitForServer) == null ? void 0 : S.call(e));
      return C && C.then(() => {
        if (f) return;
        const N = x.filter((X) => l[X] === k);
        (N.length || !b.length && !x.length && d === k) && T(N);
      }), !1;
    }
    return A(p.value.declared), Object.entries(p.value.keys).forEach(([x, C]) => {
      (l[x] ?? 0) > k || (l[x] = k, g[x].readAt = Date.now(), r.delete(x), C.ok && (g[x].data.value = C.value), g[x].showFirst(C));
    }), !0;
  }
  function W(b) {
    const k = Dc(b);
    return k.length ? (k.forEach((w) => o.names.add(w)), o.answer ?? (o.answer = new Promise((w) => setTimeout(() => {
      const p = [...o.names];
      o.names.clear(), o.answer = null, w(T(p));
    })))) : T([]);
  }
  function J(b) {
    b.forEach((k) => s.add(k)), clearTimeout(u), u = setTimeout(() => {
      const k = [...s];
      s.clear(), k.length && T(k);
    }, Oc);
  }
  const D = (b) => b.endsWith(kn) ? Object.keys(t).filter((k) => k.startsWith(b.slice(0, -1)) && t[k].readAt) : [b], B = (b) => (i[b] ?? i[`${b.split(".")[0]}.*`]).reload_seconds;
  function q(b) {
    const k = Object.keys(i).filter((p) => b.event === Tc || i[p].events.some((S) => ys(S, b.event)));
    k.filter((p) => i[p].page_size).forEach((p) => g[p].heard(b));
    const w = k.filter((p) => !i[p].page_size);
    w.filter((p) => !v(p)).forEach((p) => g[p].readAt = 0), J(w.filter(v).flatMap(D));
  }
  function A(b) {
    if (Object.keys(i).length) return;
    i = b;
    const k = [...new Set(Object.values(b).flatMap((p) => p.events))];
    k.length && e.follow(k, q);
    const w = Object.keys(b).filter((p) => b[p].loading === Lc);
    w.length && T(w);
  }
  fe(() => n.tab, () => {
    const b = Object.keys(i).filter((k) => !k.endsWith(kn) && v(k) && !g[k].readAt);
    b.length && T(b);
  }), Be(() => {
    f = !0, clearTimeout(u);
  });
  function M() {
    const b = Date.now(), k = Object.keys(i).filter((w) => i[w].reload_seconds > 0 && v(w)).flatMap(D).filter((w) => b - g[w].readAt >= (r.has(w) ? Math.min(B(w) * 1e3, Ic) : B(w) * 1e3));
    k.length && J(k);
  }
  return gs(M, () => e.visible.value, Rc), queueMicrotask(() => T([])), { props: g, state: n, reload: W, readKey: _ };
}
const Pc = Symbol("open-view"), Ne = Symbol.for("journal.window-context"), gl = Symbol("dock-card");
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
  const e = Oe(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return qc(e);
}
const Fc = (e, t) => e(gl, t), n4 = () => Oe(gl), Wc = ["data-icon", "stroke-width", "innerHTML"], ye = {
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
      time: '<circle cx="8" cy="8" r="5.5"/><path d="M8 4.5V8l2.4 1.5"/>',
      allowance: '<path d="M3 4.5h10v7H3zM5 6.5h1M10 9.5h1"/><circle cx="8" cy="8" r="1.4"/>',
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
    return (o, l) => (c(), h("svg", {
      class: "ico",
      "data-icon": e.name,
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
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Uc = /* @__PURE__ */ Y(Hc, [["__scopeId", "data-v-eb453d6f"]]), zc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Xn(), a = R(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = I(!1), o = R(() => t.busy || s.value), l = Oe(Ne, null), r = R(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, cl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), H(ht(e.href ? "a" : "button"), Le(a.value, {
      type: e.href ? void 0 : P(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: j(() => [
        y("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : O("", !0),
          ue(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), H(Uc, {
          key: 0,
          class: "btn-spinner"
        })) : O("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ Y(zc, [["__scopeId", "data-v-ededdadf"]]), Vc = ["aria-checked", "aria-haspopup", "onClick"], Gc = {
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
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(z, null, te(e.options, (r) => Ye((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Gc)) : O("", !0),
          ee(" " + $(r.label) + " ", 1),
          r.note ? (c(), h("small", Kc, $(r.note), 1)) : O("", !0),
          r.count !== void 0 ? (c(), h("em", Yc, $(r.count), 1)) : O("", !0)
        ], 10, Vc)), [
          [l, r.tip || r.title, `${P(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nt = /* @__PURE__ */ Y(Jc, [["__scopeId", "data-v-c89bc92d"]]), Zc = {
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
    return (t, n) => e.failure || e.more ? (c(), h("div", Zc, [
      e.failure ? (c(), h("p", Xc, $(e.failure), 1)) : O("", !0),
      e.more ? (c(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          ee($(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : O("", !0)
    ])) : O("", !0);
  }
}, Qn = /* @__PURE__ */ Y(Qc, [["__scopeId", "data-v-10464014"]]), eu = { class: "link-group" }, tu = {
  class: "group-label",
  "data-link-kind": ""
}, nu = ["disabled", "onClick"], au = { class: "title" }, su = { class: "relations" }, ou = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = R(() => s.value ? n.rows : n.rows.slice(0, 3)), l = R(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), r = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, i = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), u = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((f) => f.replaceAll("_", " ")).join(", ")}`;
    return (d, f) => (c(), h("div", eu, [
      y("div", tu, $(l.value), 1),
      (c(!0), h(z, null, te(o.value, (m) => (c(), h("button", Le({
        key: `${m.endpoint.model}:${m.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(m), {
        disabled: r(m),
        onClick: (g) => a("open", m)
      }), [
        y("span", au, $(m.endpoint.title), 1),
        y("span", su, [
          ee($(u(m)), 1),
          r(m) ? (c(), h(z, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : O("", !0)
        ])
      ], 16, nu))), 128)),
      e.rows.length > 3 && !s.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: f[0] || (f[0] = (m) => s.value = !0)
      }, "Show more")) : O("", !0)
    ]));
  }
}, lu = /* @__PURE__ */ Y(ou, [["__scopeId", "data-v-be6f079c"]]), ru = ["data-loaded"], iu = ["disabled", "onClick"], cu = { class: "title" }, uu = { class: "relations" }, du = { key: 3 }, fu = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    changes: { type: Number, default: 0 },
    outsidePlan: Boolean,
    grouped: Boolean,
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I({}), l = I(0), r = I(""), i = I(null), u = I(!1), d = I("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (M) => m[M] || `${M.replaceAll("_", " ").replace(/^./, (b) => b.toUpperCase())}s`, v = R(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((M, b) => M + b, 0) },
      ...Object.entries(o.value).map(([M, b]) => ({ key: M, label: g(M), count: b }))
    ]), _ = R(() => {
      const M = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((k) => k.endpoint.model))].map((k) => [k, s.value.filter((w) => w.endpoint.model === k).length])), b = { doc: 0, task: 1, message: 2 };
      return Object.entries(M).sort(([k], [w]) => (b[k] ?? 3) - (b[w] ?? 3)).map(([k, w]) => ({ model: k, count: w, rows: s.value.filter((p) => p.endpoint.model === k) }));
    }), E = (M) => M.endpoint.unavailable || !M.endpoint.open_ref, T = (M) => ({ [n.linkAttribute]: !0, "data-link-model": M.endpoint.model, "data-link-id": M.endpoint.id }), W = (M) => `${M.endpoint.model === "doc" && M.endpoint.id === n.documentId ? "Design document" : M.endpoint.model.replaceAll("_", " ").replace(/^./, (b) => b.toUpperCase())} ${M.endpoint.id}, ${M.relations.map((b) => b.replaceAll("_", " ")).join(", ")}`;
    async function J(M = 1) {
      const b = ++f;
      u.value = !0, d.value = "";
      const k = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(M), "--page-size", String(n.pageSize)];
      n.outsidePlan && k.push("--outside-plan"), n.documentId && k.push("--first-counterpart", `doc:${n.documentId}`), r.value && k.push("--kind", r.value);
      try {
        const w = await n.read(k);
        if (b !== f) return;
        if (!w.ok) {
          d.value = w.error;
          return;
        }
        const p = w.value.counterparts ?? [], S = M === 1 ? p : [...s.value, ...p];
        s.value = [...new Map(S.map((x) => [`${x.endpoint.model}:${x.endpoint.id}`, x])).values()], o.value = w.value.kinds ?? {}, l.value = w.value.total, i.value = w.value.next_page ?? null;
      } catch (w) {
        b === f && (d.value = w.message);
      } finally {
        b === f && (u.value = !1);
      }
    }
    function D(M) {
      if (E(M)) return;
      const [b, k] = M.endpoint.open_ref.split(":");
      a("open", { table: b, id: Number(k) });
    }
    function B(M) {
      r.value = M, J();
    }
    const q = () => !u.value && i.value && J(i.value), A = R(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return fe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", J();
    }, { immediate: !0 }), (M, b) => s.value.length || u.value || d.value || e.empty ? (c(), h("section", {
      key: 0,
      class: Z(["resource-links", { grouped: e.grouped }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      v.value.length > 2 ? (c(), H(Nt, {
        key: 0,
        options: v.value,
        value: r.value,
        wrap: "",
        onPick: B
      }, null, 8, ["options", "value"])) : O("", !0),
      e.grouped ? (c(!0), h(z, { key: 1 }, te(_.value, (k) => (c(), H(lu, {
        key: k.model,
        model: k.model,
        count: k.count,
        rows: k.rows,
        "link-attribute": e.linkAttribute,
        "document-id": e.documentId,
        onOpen: D
      }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (c(!0), h(z, { key: 2 }, te(s.value, (k) => (c(), h("button", Le({
        key: `${k.endpoint.model}:${k.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, T(k), {
        disabled: E(k),
        onClick: (w) => D(k)
      }), [
        y("span", cu, $(k.endpoint.title), 1),
        y("span", uu, [
          ee($(W(k)), 1),
          E(k) ? (c(), h(z, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : O("", !0)
        ])
      ], 16, iu))), 128)),
      !s.value.length && !u.value && !d.value && e.empty ? (c(), h("p", du, $(e.empty), 1)) : O("", !0),
      L(Qn, {
        more: !!i.value,
        loading: u.value,
        failure: d.value,
        label: A.value,
        onMore: q
      }, null, 8, ["more", "loading", "failure", "label"])
    ], 10, ru)) : O("", !0);
  }
}, hu = /* @__PURE__ */ Y(fu, [["__scopeId", "data-v-949d0a9f"]]), mu = (e, t, n) => Math.max(t, Math.min(n, e)), pu = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, vl = /* @__PURE__ */ new WeakMap(), gu = (e, t) => vl.set(e, t);
function vu(e, t) {
  for (let n = t; n; n = vl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function yl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !vu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ct = 8, yu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = I(null), o = (p) => p ? `${p}px` : void 0, l = R(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = I({ w: 0, h: 0 }), i = I(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const S = p.closest(".pane, .float-window");
      return S ? d(S.getBoundingClientRect()) : u();
    }, m = (p, S) => `${Math.max(0, p ? Math.min(p, S) : S)}px`;
    function g(p, S) {
      return {
        below: p.bottom - S.bottom - a.gap - Ct,
        above: S.top - p.top - a.gap - Ct,
        across: p.right - p.left - 2 * Ct
      };
    }
    function v(p) {
      const S = f(a.anchor), x = g(S, p);
      return r.value.w <= x.across && r.value.h <= Math.max(x.below, x.above) ? S : u();
    }
    const _ = R(() => {
      if (!i.value) return l.value;
      const p = i.value, S = v(p), x = g(S, p), { w: C, h: N } = r.value, X = a.align === "auto" ? p.left + p.right > S.left + S.right : a.align === "right", ne = mu(X ? p.right - C : p.left, S.left + Ct, Math.max(S.left + Ct, S.right - C - Ct)), he = N > x.below && x.above > x.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, x.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, x.below) };
      return { ...l.value, ...he, left: `${ne}px`, maxWidth: m(a.maxWidth, x.across) };
    }), E = n, T = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function W(p) {
      const S = T(), x = S.indexOf(document.activeElement);
      S[(x + p + S.length) % S.length].focus();
    }
    const J = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => E("close") }, D = (p) => J[p.key] && (p.preventDefault(), J[p.key]()), B = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let q = 0;
    const A = new ResizeObserver(() => {
      cancelAnimationFrame(q), q = requestAnimationFrame(B);
    });
    yl(s, (p) => a.anchor && !a.anchor.contains(p.target) && E("close"));
    const M = (p, S) => ["top", "left", "right", "bottom"].some((x) => Math.abs(p[x] - S[x]) > 1), b = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let k = 0;
    function w() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || b(p)) return E("close");
        M(p, i.value) && (i.value = p);
      }
      k = requestAnimationFrame(w);
    }
    return Re(() => {
      a.anchor && s.value && gu(s.value, a.anchor), B(), s.value && A.observe(s.value), !a.plain && T()[0] && T()[0].focus(), w();
    }), Be(() => {
      A.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(q);
    }), t({ element: s }), (p, S) => (c(), H(hs, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", Le({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: _.value,
        onKeydown: D
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ea = /* @__PURE__ */ Y(yu, [["__scopeId", "data-v-3d203970"]]), bu = { class: "split-button" }, wu = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", bu, [
      L(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: j(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      y("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        L(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: j(() => [
            L(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), H(ea, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: j(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : O("", !0)
    ]));
  }
}, ku = /* @__PURE__ */ Y(wu, [["__scopeId", "data-v-c258494d"]]), $u = 0, xu = "/api/lines", Mu = "/api/line", Qs = 5e3, eo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), to = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ha = (e) => JSON.stringify(e.line), no = () => new DOMException("cancelled", "AbortError");
class Su {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(ha(t))) {
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), $u));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(no())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(no()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(xu, eo({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => to(r.body, Xe)), Qs);
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
    await this.alone(t, Xe), Date.now() - n < Qs ? this.slow.delete(ha(t.body)) : this.slow.add(ha(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(Mu, eo(t.body, t.signal), [to(t.body, n)], n === Xe ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const bl = new Su(), _u = "/api/window";
function Eu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${_u}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (u) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: u, headers: r }, [{ window: e, line: l, kind: Xe }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const wl = /* @__PURE__ */ new Map();
class Au {
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
function a4(e, t) {
  const n = new Au(e, t);
  return wl.set(e, n), n.load().catch(() => {
  }), n;
}
const bs = (e) => wl.get(e);
function Cu(e, t, n) {
  const a = bs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Ou(e, t) {
  if (!e) return !0;
  const n = bs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Tu = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let kl = {};
async function s4(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (kl = (await t.json()).states);
}
const ws = (e, t) => {
  var n;
  return (n = kl[e]) == null ? void 0 : n[t];
}, $l = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.label) ?? Tu(t);
}, xl = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Ru = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Iu = Symbol("pane-page"), Bu = Symbol("inspector-host"), Ml = { 1: "refused", 2: "usage", 3: "fault" }, Lu = 100, Nu = 50, Du = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, ju = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Pu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: g = [], sources: v = [], links: _ = {}, search: E = {}, readOnly: T = !1, shared: W = null }) {
  const J = /* @__PURE__ */ new Map(), D = new AbortController(), B = I(!1), q = performance.now();
  let A = 0, M = 0, b = () => {
  };
  const k = new Promise((N) => b = N);
  D.signal.addEventListener("abort", b, { once: !0 });
  const w = () => {
    clearTimeout(M), M = setTimeout(() => {
      A === 0 && ps(q, () => {
        B.value = !0, b();
      });
    }, Nu);
  }, p = (N, X) => (A += 1, Rt(e, N, t, D.signal, X).finally(() => {
    A -= 1, w();
  })), S = (N, X) => (w(), k.then(() => D.signal.aborted ? nt : Rt(e, N, t, D.signal, X))), x = ({ only: N = [], state: X = {} } = {}) => (A += 1, Fu(() => Eu(e, t, N, X, D.signal), D.signal).finally(() => {
    A -= 1, w();
  })), C = (N, { unbatched: X = !1, deferred: ne = !1 } = {}) => {
    const ie = J.get(N);
    if (ie && performance.now() - ie.at < Lu) return ie.answer;
    const he = ne && !B.value ? S(N, X) : p(N, X);
    return J.set(N, { answer: he, at: performance.now() }), he;
  };
  return {
    answered: B,
    settle: w,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: g,
    sources: v,
    links: _,
    search: E,
    readOnly: T,
    shared: W,
    read: C,
    readKeys: x,
    waitForServer: () => vs() ? ml() : null,
    run: (N) => Rt(e, N, t, D.signal),
    upload: (N) => Hu(N, e, D.signal),
    cancel: () => D.abort(),
    signal: D.signal,
    subscriptions: l,
    follow: (N, X) => l.follow(e, [N].flat().filter((ne) => o.some((ie) => ys(ie, ne))), (ne) => {
      J.clear(), X(ne);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (N) => R(() => {
      var X;
      return i.value[N] ?? ((X = u.find((ne) => ne.key === N)) == null ? void 0 : X.default);
    }),
    setting: async (N, X) => {
      const ne = await C(`window setting ${e} ${N}`);
      return ne.ok ? ne.value.value : X;
    },
    setOption: f,
    keep: (N, X) => Rt(e, ["window", "save-setting", e, N, JSON.stringify(X)], t, D.signal)
  };
}
function Sl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nt = { ok: !1, failure: "cancelled", error: "" }, ks = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function _l(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? nt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Ml[n.code] || "fault", error: Sl(n.error) };
  } catch {
    return t != null && t.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
const qu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Ml[e.code] || "fault", error: Sl(e.error) };
async function Fu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, qu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
async function El(e, t, n) {
  const a = await _l(() => bl.read(e, t, n), t);
  return a.failure !== "unreachable" || !vs() ? a : (await ml(), t.aborted ? nt : El(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => Wu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : $s(t)));
}
async function Wu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : $s(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => El({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : _l(() => bl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Hu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
function $s(e) {
  return [...e.matchAll(Du)].map(([t]) => t.replace(ju, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Uu = (e) => `show-${e}`, o4 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Uu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Al = "messages.chat", zu = {
  key: 0,
  class: "template-brief"
}, Vu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Gu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), l = R(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = R(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await Rt(Al, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(z, null, [
      L(Nt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", zu, $(r.value.brief), 1)) : O("", !0),
      o.value ? (c(), h("p", Vu, $(o.value), 1)) : O("", !0)
    ], 64));
  }
}, Ku = /* @__PURE__ */ Y(Gu, [["__scopeId", "data-v-14be8a5c"]]), Yu = { class: "form-field" }, Ju = { class: "form-field-head" }, Zu = ["for"], Xu = {
  key: 0,
  class: "form-field-aside"
}, Qu = {
  key: 0,
  class: "form-field-help"
}, ed = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Yu, [
      y("div", Ju, [
        y("label", {
          class: "form-field-label",
          for: t.$props.for
        }, $(e.label), 9, Zu),
        t.$slots.aside ? (c(), h("span", Xu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Qu, $(e.help), 1)) : O("", !0)
    ]));
  }
}, td = /* @__PURE__ */ Y(ed, [["__scopeId", "data-v-dd7cdcff"]]), Ya = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, nd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Xn(), n = R(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ye((c(), h("textarea", Le({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [P(Ya), P(t).value]
    ]);
  }
}), ad = /* @__PURE__ */ Y(nd, [["__scopeId", "data-v-e130a5b9"]]), sd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = fs(), o = R(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), H(td, {
      label: e.field.label,
      for: P(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        L(Pt, { value: o.value }, {
          choice: j(() => [
            L(Nt, {
              id: P(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            L(Ku, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            L(ad, {
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
    return (t, n) => (c(), H(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        L(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function od(e, t, n, a = () => window) {
  Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const ld = (e, t = () => !0) => od("keydown", (n) => n.key === "Escape" && t() && e());
function Cl(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = R(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return ld(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const rd = 80, Ot = Zn([]);
function Ol(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return fe(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), R(() => rd + Math.max(0, Ot.indexOf(t)));
}
let Tl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Tl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const id = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function cd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(id)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Re(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Tl, document.addEventListener("keydown", s), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const ud = ["aria-modal", "aria-label", "aria-labelledby"], dd = {
  key: 0,
  class: "dialog-head"
}, fd = ["id", "tabindex"], hd = {
  key: 1,
  class: "dialog-foot"
}, md = 500, pd = 400, gd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Cl(a, n), r = Ol(s), i = I(null), u = I(null), d = I(null), f = fs(), m = I(!1), g = Date.now();
    n.modal && cd(u, () => a("escape"), d);
    function v() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, pd);
    }
    function _(W) {
      !n.modal || Date.now() - g >= md || ![" ", "Enter"].includes(W.key) || (W.preventDefault(), W.stopPropagation());
    }
    const E = () => i.value && (i.value.scrollTop = i.value.scrollHeight), T = new MutationObserver(E);
    return fe(i, (W) => {
      T.disconnect(), W && n.follow && (T.observe(W, { childList: !0, subtree: !0, characterData: !0 }), E());
    }), Be(() => T.disconnect()), (W, J) => (c(), H(hs, { to: "body" }, [
      L(jt, {
        name: "dialog",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: j(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: P(r) }),
            onClick: $e(v, ["self"])
          }, [
            y("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? P(f) : void 0,
              onKeydownCapture: _
            }, [
              e.bare ? O("", !0) : (c(), h("header", dd, [
                y("h3", {
                  id: P(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, $(e.title), 9, fd),
                e.closable ? (c(), H(xs, {
                  key: 0,
                  onClick: P(o)
                }, null, 8, ["onClick"])) : O("", !0)
              ])),
              y("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(W.$slots, "default", {}, void 0, !0)
              ], 2),
              W.$slots.foot ? (c(), h("footer", hd, [
                ue(W.$slots, "foot", {}, void 0, !0)
              ])) : O("", !0)
            ], 42, ud)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Rl = /* @__PURE__ */ Y(gd, [["__scopeId", "data-v-6d1ecd98"]]), vd = (e, t, n = {}) => $s(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function cn(e, t, n, a = {}) {
  try {
    return await Ou(e.module, n) ? Rt(Al, vd(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const yd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, ma = [
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
}), ta = {
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
    filters: ma
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ma
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
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: ma }),
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
}, bd = ["secrets", "plugins"], Il = Object.keys(ta).filter((e) => !(il && bd.includes(e)));
R(() => Il.map((e) => ({ name: e, ...ta[e] })));
const qt = (e) => ta[e], Bl = new Map(Il.flatMap((e) => [e, e.replace(/s$/, ""), ta[e].title.toLowerCase()].map((t) => [t, e]))), ct = (e) => Bl.get(String(e).toLowerCase()) || "", Ll = [...Bl.keys()].sort((e, t) => t.length - e.length).join("|"), wd = {
  class: "button-form",
  "data-button-form": ""
}, kd = {
  key: 0,
  class: "button-form-title"
}, $d = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, xd = { class: "button-form-actions" }, Md = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = I(!1), l = I(""), r = R(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = R(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = qt(ct(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await cn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), H(Rl, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: j(() => {
        var m;
        return [
          y("div", wd, [
            (m = e.row) != null && m.title ? (c(), h("p", kd, $(e.row.title), 1)) : O("", !0),
            (c(!0), h(z, null, te(e.button.fields, (g) => (c(), H(sd, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (v) => s.value[g.name] = v
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", $d, $(l.value), 1)) : O("", !0),
            y("div", xd, [
              L(de, {
                small: "",
                onClick: f[0] || (f[0] = (g) => a("close"))
              }, {
                default: j(() => [...f[2] || (f[2] = [
                  ee("Cancel", -1)
                ])]),
                _: 1
              }),
              L(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: j(() => [...f[3] || (f[3] = [
                  ee("Send", -1)
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
}, Sd = /* @__PURE__ */ Y(Md, [["__scopeId", "data-v-f26c27a7"]]), _d = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ed = {
  key: 1,
  class: "menu-item-text"
}, Ad = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", _d, $(e.checked ? "✓" : ""), 1)) : O("", !0),
      e.description ? (c(), h("span", Ed, [
        y("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, $(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ Y(Ad, [["__scopeId", "data-v-fec99974"]]), Cd = ["aria-busy"], Od = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Td = {
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
    const n = e, a = t, s = R(() => bs(n.environment)), o = R(
      () => {
        var v;
        return !n.readOnly && ((v = s.value) == null ? void 0 : v.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = R(() => {
      var v;
      return !n.readOnly && ((v = s.value) == null ? void 0 : v.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = R(() => n.readOnly ? [] : Cu(n.environment, n.name, n.row)), u = I(null), d = I(""), f = I(!1), m = (v) => [v.from ? `From ${v.from}` : "", v.tip].filter(Boolean).join(" · ");
    async function g(v) {
      if (f.value || n.readOnly) return;
      if (v.fields.length) {
        u.value = v;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const _ = await cn(v, n.row, n.environment);
      f.value = !1, d.value = _.ok ? "" : _.error;
      const E = v.label.toLowerCase() + (n.objectName && !v.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", _.ok ? "" : `Could not ${E}: ${_.error}`), _.ok && a("done");
    }
    return (v, _) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(z, { key: 0 }, [
        _[3] || (_[3] = y("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        L(de, {
          small: "",
          onClick: r
        }, {
          default: j(() => [..._[2] || (_[2] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? O("", !0) : (c(), h(z, { key: 1 }, [
        (c(!0), h(z, null, te(i.value, (E) => (c(), h(z, {
          key: E.name
        }, [
          E.menu.length ? (c(), H(ku, {
            key: 0,
            small: "",
            variant: E.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": E.menu_label || "More ways",
            title: m(E),
            "data-button": E.name,
            onMain: (T) => g(E)
          }, {
            menu: j(({ close: T }) => [
              (c(!0), h(z, null, te(E.menu, (W) => (c(), H(Mt, {
                key: W.label,
                description: W.description,
                onClick: (J) => (T(), g({ ...E, ...W, menu: [] }))
              }, {
                default: j(() => [
                  ee($(W.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              ee($(E.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), H(de, {
            key: 1,
            small: "",
            variant: E.primary ? "primary" : "ghost",
            bordered: !E.primary,
            icon: E.icon,
            disabled: f.value,
            title: m(E),
            "data-button": E.name,
            onClick: (T) => g(E)
          }, {
            default: j(() => [
              ee($(E.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Od, $(d.value), 1)) : O("", !0),
        u.value && !e.readOnly ? (c(), H(Sd, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: _[0] || (_[0] = (E) => u.value = null),
          onDone: _[1] || (_[1] = (E) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : O("", !0)
      ], 64))
    ], 10, Cd));
  }
}, Rd = /* @__PURE__ */ Y(Td, [["__scopeId", "data-v-a07b49a4"]]), Id = {
  class: "running",
  "data-running-command": ""
}, Bd = ["title"], Ld = {
  key: "idle",
  class: "running-idle"
}, Nd = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Id, [
      L(jt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, $(e.text), 9, Bd)) : (c(), h("span", Ld, $(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, l4 = /* @__PURE__ */ Y(Nd, [["__scopeId", "data-v-d3240219"]]), Dd = ["aria-checked", "aria-label", "title"], jd = {
  key: 0,
  class: "switch-inner"
}, Pd = {
  key: 0,
  class: "switch-word"
}, qd = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("button", {
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
        e.labelled ? (c(), h("span", jd, $(e.word), 1)) : O("", !0),
        s[1] || (s[1] = y("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Pd, $(e.word), 1)) : O("", !0)
    ], 10, Dd));
  }
}, r4 = /* @__PURE__ */ Y(qd, [["__scopeId", "data-v-1bfb90f3"]]);
function Nl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function jn(e, t) {
  return Nl(() => localStorage, e, t);
}
function Dl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ms(e, t) {
  return Dl(() => localStorage, e, t);
}
function jl(e, t) {
  fe(t, (n) => Ms(e, n), { deep: !0 });
}
function Fd(e, t) {
  return Nl(() => sessionStorage, e, t);
}
function Wd(e, t) {
  return Dl(() => sessionStorage, e, t);
}
const Pn = "journal.environment", Pl = I(Fd(Pn, jn(Pn, "")));
function Hd(e) {
  Pl.value = e, Wd(Pn, e), Ms(Pn, e);
}
const qn = I(location.hash), ao = Ke(null), so = { integrations: "mcp", library: "team" };
function Ud() {
  if (!ao.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (so[n]) {
    location.replace(`#/${[so[n], ...a].join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash;
    return;
  }
  !n || ao.value(n) || (Hd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  qn.value = location.hash, Ud();
});
const Ja = R(() => {
  const [e, t = ""] = qn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: Pl.value,
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
}), Ss = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ss.page(e)}?open=${t}`
};
function zd(e = "", t = 0, n = "") {
  location.hash = Ss.page(e, t, n);
}
const Vd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function ql(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Vd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function i4(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Fl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ja.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  ql([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Gd(e, t, n, a = 0, s = "") {
  if (e === Ja.value.env) return Fl(t, n, a, s);
  const o = Ja.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  ql([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Fe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Gd(a, s, Number(o), 0, t) : Fl(s, Number(o), 0, t);
}
function Kd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = Kd(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function c4(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Yd = { class: "inspector-part" }, Jd = { class: "inspector-part-title" }, Zd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", Yd, [
      y("h4", Jd, $(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, u4 = /* @__PURE__ */ Y(Zd, [["__scopeId", "data-v-0da7fa52"]]), Xd = {
  key: 1,
  class: "row-list-failure"
}, Qd = ["data-row"], ef = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = I(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Xd, $(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        ee($(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(z, { key: 3 }, [
      (c(), H(ht(e.arrival ? nl : "ul"), Le(n.value, { class: "row-list" }), {
        default: j(() => [
          (c(!0), h(z, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Qd))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : O("", !0)
    ], 64));
  }
}, tf = /* @__PURE__ */ Y(ef, [["__scopeId", "data-v-6c7ba696"]]), nf = {
  class: "agent-rows",
  "data-agent-rows": ""
}, af = {
  key: 1,
  class: "agent-rows-note"
}, sf = {
  key: 2,
  class: "agent-rows-note"
}, of = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, lf = ["data-agent-row", "onClick"], rf = { class: "agent-row-name" }, cf = { class: "agent-row-state" }, uf = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = R(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", nf, [
      e.loaded ? e.failure ? (c(), h("p", af, $(e.failure), 1)) : e.rows.length ? (c(), h(z, { key: 3 }, [
        y("p", of, $(a.value) + " running", 1),
        (c(!0), h(z, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => P(Fe)(`agents:${l.id}`)
        }, [
          y("span", rf, "#" + $(l.id) + " " + $(l.session), 1),
          y("span", cf, $(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, lf))), 128))
      ], 64)) : (c(), h("p", sf, $(e.none), 1)) : (c(), H(_t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, d4 = /* @__PURE__ */ Y(uf, [["__scopeId", "data-v-a01e5a17"]]), df = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, $(e.text), 3));
  }
}, Wl = /* @__PURE__ */ Y(df, [["__scopeId", "data-v-9e7e1157"]]), ff = ["aria-valuenow", "aria-valuemax"], hf = {
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
    const t = e, n = R(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (c(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      y("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, ff));
  }
}, mf = /* @__PURE__ */ Y(hf, [["__scopeId", "data-v-9eba6a85"]]), pf = { class: "bars" }, gf = { class: "bar-name" }, vf = { class: "bar-value" }, yf = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", pf, [
      (c(!0), h(z, null, te(e.items, (i, u) => (c(), H(ht(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          y("span", gf, $(i.label), 1),
          L(mf, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          y("span", vf, $(i.value) + $(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, bf = /* @__PURE__ */ Y(yf, [["__scopeId", "data-v-663427f4"]]), wf = { class: "bars" }, kf = {
  key: 0,
  class: "bars-title"
}, $f = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", wf, [
      e.node.title ? (c(), h("span", kf, $(e.node.title), 1)) : O("", !0),
      L(bf, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, xf = /* @__PURE__ */ Y($f, [["__scopeId", "data-v-7135bb11"]]), Mf = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = R(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (c(!0), h(z, null, te(e.node.children || [], (i, u) => (c(), H(ar, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Tn = /* @__PURE__ */ Y(Mf, [["__scopeId", "data-v-d142a3f4"]]), Sf = {
  key: 0,
  class: "card-head"
}, _f = { class: "card-title" }, Ef = {
  key: 0,
  class: "card-note"
}, Af = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", Sf, [
        y("span", _f, $(e.node.title), 1),
        e.node.note ? (c(), h("span", Ef, $(e.node.note), 1)) : O("", !0)
      ])) : O("", !0),
      L(Tn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Cf = /* @__PURE__ */ Y(Af, [["__scopeId", "data-v-67b72d40"]]), Of = { processes: "process", memories: "memory", replies: "reply" }, Fn = (e) => (Of[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Za = [], Tf = 2e3, lt = /* @__PURE__ */ new Map(), Rf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, If = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? Za.unshift(e) : Za.push(e), lt.clear();
}
function Hl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Bf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Lf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function tt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Nf(e, t) {
  const n = [{ type: "text", text: tt(e).replace(/\r\n/g, `
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
function en(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Df(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Df(e) {
  return e.split(If).map((t, n) => n % 2 ? t : t.replace(Rf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function oo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const jf = 24;
function Pf(e) {
  const [t, , ...n] = e, a = oo(t), s = n.map(oo), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > jf) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${en(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Ul = /^\s*(?:[-*+]|\d+[.)])\s+/, Xa = /^\s*(\d+)[.)]\s/, lo = (e) => e.match(/^\s*/)[0].length;
function zl(e) {
  const t = e[0].match(Xa), n = lo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && lo(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${en(o.text)}${o.nested.length ? zl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function qf(e, t) {
  const n = Xa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Ul.test(e[s]) && Xa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const ro = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Vl(e) {
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
      const r = t.findIndex((u, d) => d > a && /^(```|~~~)/.test(u)), i = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${en(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (ro(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Pf(t.slice(a, r))), a = r;
      continue;
    }
    if (Ul.test(s)) {
      const r = qf(t, a);
      n.push(zl(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Vl(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !ro(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${en(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Ff = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Wf = (e) => e.type !== "text" && !Ff.test(e.html);
function Hf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Vl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Wf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Uf(e, t = { env: "" }) {
  const n = Lf(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => Bf(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = Hf(Nf(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > Tf && lt.delete(lt.keys().next().value), o;
}
const pa = /* @__PURE__ */ new WeakMap();
function zf(e) {
  if (pa.has(e)) return pa.get(e);
  const t = fi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Fn(u)} show ${d}`);
    n.set(f, m), m.then((g) => {
      n.get(f) === m && (n.delete(f), t.set(f, g.ok ? { ...g.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${Fn(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const g = Number(m.slice(f.length));
        (!d.row_id || d.row_id === g) && o(u, g);
      }
    }));
  }
  function r(u, d) {
    l(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return pa.set(e, i), i;
}
function Gl() {
  const e = Oe(Ne, null), t = e ? zf(e) : null;
  return (n, a = {}) => Uf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Kl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(Kl, (t, n, a, s) => s), Vf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), $n = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Gf = /^Traceback \(most recent call last\):/m, Kf = 8;
function Yl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Kf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Yf(e) {
  const t = [...e.matchAll(Vf)].map((a) => a.index);
  if ($n.lastIndex = 0, !t.length || !$n.test(e)) return null;
  $n.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll($n)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Yl(n), tail: "" } : null;
}
function Jf(e) {
  const t = Gf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Yl([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = un(e), n = Jf(t) || Yf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Zf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Xf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Qf = /[\w\]]\(/, eh = /^[\w$.[\]'"]+\s*=\s*[^=]/, th = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, nh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, ah = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, sh = /[[({,]$/, oh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, lh = /^(\t|\s{2,})\S/, rh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, ih = /`[^`]+`/, ch = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, uh = /[{}()[\];=<>$&|*\\@+^~%]/g, Jl = /^\s*(?:[-*+]|\d+[.)])\s/, dh = /^\s*>/, fh = /^\s*\|/, hh = 0.6, mh = 0.4, ph = 5, gh = 0.03, Zl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= ph && t.every((n) => ch.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(uh) ?? []).length / e.length < gh;
}, ga = (e) => {
  const t = e.trim();
  return ih.test(t) ? !1 : [Zf, Xf, Qf, eh, th, nh, ah, sh, oh].some((n) => n.test(t)) || /[;{}]$/.test(t) || lh.test(e) && !Jl.test(e) && !Zl(e);
};
function vh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Jl.test(t[0]) || t.every((o) => dh.test(o) || fh.test(o))) return "text";
  const n = t.filter((o) => !rh.test(o.trim()));
  if (t.length === 1) return !n.length || ga(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ga).length, s = n.filter((o) => !ga(o) && Zl(o)).length;
  return a >= n.length * hh && s <= n.length * mh ? "code" : "text";
}
const Qa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", yh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", bh = `${Qa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, wh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", kh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", io = {
  js: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: yh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: bh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: wh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: kh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, $h = {
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
function co(e, t, n) {
  return n && e.startsWith(n, t);
}
function xh(e, t) {
  const n = io[$h[t] ?? t] || io.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), d = e.slice(o, u < 0 ? e.length : u);
      l(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), l("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (co(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && co(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), d = u < 0 ? e.length : u + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((u) => e.startsWith(u, o));
    if (i) {
      const u = e.indexOf(i, o + 3), d = u < 0 ? e.length : u + 3;
      l("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(r)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== r && (r === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(u + 1)) ? "property" : "string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(r)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const u = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    l("plain", r), o += 1;
  }
  return s;
}
function Mh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of xh(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? tt(l) : `<span class="tok-${a}">${tt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Sh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const _h = 1500, uo = /* @__PURE__ */ new WeakMap();
async function Eh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Sh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(uo.get(t)), uo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, _h)
  )));
}
typeof document < "u" && document.addEventListener("click", Eh, !0);
const Ah = /\n\s*\n/, Ch = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Oh = /^\s*(`{3,}|~{3,})\s*$/, Th = /^\s{4,}\S/, Rh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, es = /^\s*(?:[-*+]|\d+[.)])\s/, Xl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Ih = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function _s(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Bh(e) {
  const t = _s(e.join(`
`));
  return (Ih.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Lh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Xl.test(t) && !es.test(t);
}, Nh = (e, t) => es.test(t) || es.test([...e].reverse().find((n) => n.trim()) || "");
function Es(e, t) {
  const n = t || Bh(e), a = Mh(_s(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Dh(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Oh.test(s));
  return a < 0 ? e.length : a;
}
function jh(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Es(a.map(un), n ? n.toLowerCase() : "");
}
function Ph(e) {
  const t = e.split(Ah).map((l) => ({ paragraph: l, type: vh(_s(l).split(`
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
      s(), n.push(Es(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(un), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function qh(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Ph(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Ch);
    if (r) {
      const u = Dh(n, l, r[2]);
      o(), a.push(jh(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = Lh(s) ? Rh : Th;
    if (!t && i.test(n[l]) && !Nh(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Xl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - l + d.length >= 2) {
        o(), a.push(Es([...d, ...n.slice(l, u)].map(un), "")), l = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => qh(e, t.document));
const Wn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ql = (e) => `${e.table}:${e.id}`, fo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", va = 80;
function ho(e) {
  return e.length <= va ? e : `${e.slice(0, va + 1).replace(/\s+\S*$/, "") || e.slice(0, va)}…`;
}
const mo = {
  messages: (e) => ho(fo(e.text)),
  comments: (e) => ho(fo(e.text)),
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
}, Fh = (e) => (mo[e.table] ? mo[e.table](e) : e.title || "") || "", St = (e) => Wn(e.created_at), er = (e) => Wn(e.updated_at) || St(e), Wh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Hh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Uh(e) {
  const t = Wh.exec(e);
  if (t && ct(t[1])) return { at: t.index, length: t[0].length, table: ct(t[1]), id: Number(t[2]), label: t[3] };
  const n = Hh.exec(e), a = n && ct(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function zh(e, t, n, a) {
  const s = Hl(a, e, t), o = un(s ? Fh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${tt(qt(e).title)} ${t}</span><span class="row-card-title">${tt(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = Uh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: zh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Vh = /\.(png|jpe?g|gif|webp|svg)$/i, Gh = (e) => Vh.test(e), Kh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Yh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Jh(e, t) {
  const n = Kh.exec(e), [, a, s, o, l, r] = n || [], i = n && ct(a || o), u = i && Hl(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${qt(i).title} ${u.id} · ${tt(r)}`, m = Gh(r) ? `<img class="file-card-image" src="${d}" alt="${tt(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${tt(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Zh(e) {
  const t = Yh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${tt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = Jh(e, t) || Zh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Xh = /`([^`\n]+)`/g;
Et((e) => e.replace(Xh, (t, n) => `<code>${n}</code>`));
const po = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ss.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(Kl, (n, a, s, o) => po[a] ? po[a](s, o, t) : o)
);
const Qh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, tr = new RegExp(`\\b(${Ll}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), nr = new RegExp(`\\b(${Ll}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), em = new RegExp(`<code>((?:${tr.source}|${nr.source}))</code>`, "gi"), tm = (e) => e.replace(em, "$1"), nm = (e, t) => `<a class="row-pill" href="#" data-peek="${ct(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, am = (e) => e.replace(nr, (t, n, a) => a.replace(/\d+/g, (s) => nm(n.replace(/s$/i, ""), s))), sm = (e) => am(e).replace(
  tr,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ct(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : tm(e).split(Qh).map((n, a) => a % 2 ? n : sm(n)).join("")
);
const om = ["innerHTML"], lm = ["innerHTML"], rm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Gl(), a = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, om)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, lm));
  }
}, kt = /* @__PURE__ */ Y(rm, [["__scopeId", "data-v-d8e75741"]]), im = { class: "fact" }, cm = { class: "fact-label" }, um = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", im, [
      y("span", cm, $(e.label), 1),
      L(kt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, dm = /* @__PURE__ */ Y(um, [["__scopeId", "data-v-3a88ecf8"]]), fm = { class: "list" }, hm = { class: "list-label" }, mm = {
  key: 1,
  class: "list-note"
}, pm = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", fm, [
      (c(!0), h(z, null, te(e.items, (o, l) => (c(), H(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          y("span", hm, $(o.label), 1),
          o.badge ? (c(), H(Wl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : O("", !0),
          o.note ? (c(), h("span", mm, $(o.note), 1)) : O("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, gm = /* @__PURE__ */ Y(pm, [["__scopeId", "data-v-ebe2ae0a"]]), vm = { class: "table" }, ym = {
  key: 0,
  class: "table-row empty"
}, bm = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", vm, [
      y("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (c(!0), h(z, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, $(r), 1))), 128))
      ], 4),
      (c(!0), h(z, null, te(e.rows, (r, i) => (c(), H(ht(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          (c(!0), h(z, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, $(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", ym, $(e.empty), 1)) : O("", !0)
    ]));
  }
}, wm = /* @__PURE__ */ Y(bm, [["__scopeId", "data-v-9326a52e"]]), km = { class: "stat-value" }, $m = { class: "stat-label" }, xm = {
  key: 0,
  class: "stat-note"
}, Mm = {
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
    return (a, s) => (c(), H(ht(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        y("span", km, $(e.value), 1),
        y("span", $m, $(e.label), 1),
        e.note ? (c(), h("span", xm, $(e.note), 1)) : O("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Sm = /* @__PURE__ */ Y(Mm, [["__scopeId", "data-v-ad0db6d6"]]), _m = { class: "code" }, Em = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), H(Pt, {
      value: e.node.type
    }, {
      stack: j(() => [
        L(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        L(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        L(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        L(Cf, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        y("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, $(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        y("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        L(Sm, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        L(xf, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        L(wm, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        L(gm, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        L(kt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        L(dm, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        L(Wl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        y("pre", _m, [
          y("code", null, $(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        y("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, $(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ar = /* @__PURE__ */ Y(Em, [["__scopeId", "data-v-cbdcf540"]]), Am = { class: "dashboard" }, Cm = { class: "trail" }, Om = ["onClick"], Tm = {
  key: 0,
  class: "gone",
  role: "status"
}, Rm = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = I(!!n.page && !s(n.page)), l = I(n.page && !o.value ? [n.page] : []), r = R(() => l.value.at(-1) || n.document.start), i = R(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return fe(
      () => n.document.start,
      () => l.value = []
    ), (m, g) => (c(), h("div", Am, [
      e.document.broken ? (c(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          ee($(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          ee($(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(z, { key: 2 }, [
        y("nav", Cm, [
          y("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (v) => f(0))
          }, $(u(e.document.start)), 3),
          (c(!0), h(z, null, te(l.value, (v, _) => (c(), h(z, {
            key: `${_}-${v}`
          }, [
            g[2] || (g[2] = y("span", { class: "sep" }, "/", -1)),
            y("button", {
              type: "button",
              class: Z(["step", { current: _ === l.value.length - 1 }]),
              onClick: (E) => f(_ + 1)
            }, $(u(v)), 11, Om)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Tm, "What you opened is no longer in this dashboard. Here is its start page.")) : O("", !0),
        L(jt, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              L(ar, {
                node: i.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (v) => a("file", v))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : O("", !0)
    ]));
  }
}, Im = /* @__PURE__ */ Y(Rm, [["__scopeId", "data-v-fbe83734"]]), sr = {
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
function Bm(e, t) {
  const n = We(), a = pl(e, sr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Re(e), ft(() => {
    s(), a.cancel();
  });
}
const Lm = {
  key: 0,
  class: "window-failure"
}, Nm = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = We(), o = I(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Bm(l, n.events) : gs(l, () => !0, sr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (c(), h("p", Lm, $(o.value.error), 1)) : o.value ? (c(), H(Im, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (u) => a("file", u))
    }, null, 8, ["document"])) : O("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Dm = 6;
function As(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const jm = (e) => {
  const t = As(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function Pm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function qm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Fm(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), u = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, g) => m + g, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => u(d) - u(f));
  };
  for (let l = 0; l < Dm; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function Wm(e, t) {
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
function Hm(e) {
  const t = [...new Set(e.flatMap(([D, B]) => [D, B]))], n = new Set(e.map(([, D]) => D)), a = t.filter((D) => !n.has(D)), s = Pm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((D, B) => !s.has(B)), l = qm(t, o), r = Fm(t, o, l), i = new Map(t.map((D) => [D, jm(D)])), u = r.map((D) => D.reduce((B, q) => B + i.get(q).width, 0) + Pe.across * (D.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = zm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let g = Pe.margin;
  r.forEach((D, B) => {
    let q = (d - u[B]) / 2;
    const A = Math.max(...D.map((M) => i.get(M).height));
    D.forEach((M) => {
      const b = i.get(M);
      m.set(M, { ...b, x: q, y: g + (A - b.height) / 2 }), q += b.width + Pe.across;
    }), g += A + (f[B] ?? Pe.down);
  });
  const v = e.map(([D, B, q], A) => ({ from: D, to: B, label: q || "", back: s.has(A) || l.get(B) <= l.get(D) }));
  Wm(v, m);
  const _ = v.map((D) => Vm(D, m.get(D.from), m.get(D.to))), E = [...m.values()], T = Jm(_, E), W = Math.max(g - Pe.down, ...T.filter((D) => D.label).map((D) => D.label.y + D.label.height));
  return { width: Math.max(d - Pe.margin, ...T.filter((D) => D.label).map((D) => D.label.x + D.label.width)) + Pe.margin, height: W + Pe.margin, nodes: E, arrows: T };
}
const Um = (e) => e ? As(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function zm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Um(l) + Pe.labelSpace);
  }), a.map((s) => Math.max(Pe.down, s));
}
function Vm(e, t, n) {
  const a = e.label ? As(e.label, qe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * qe.charWidth + qe.pad * 2 : 0, o = a.length * qe.line + (a.length ? qe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const Gm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Km = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Ym = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function Jm(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = Gm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = Ym.flatMap((i) => Km.map((u) => s(u, i))).find((i) => !n.some((u) => go(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => go(r, i)); ) r.y += qe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: qe.line, pad: qe.pad } };
  });
}
const go = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Zm = { class: "flowchart-tools" }, Xm = ["width", "height", "viewBox", "aria-label"], Qm = ["d"], e1 = ["x", "y", "width", "height"], t1 = ["x", "y"], n1 = ["x", "dy"], a1 = {
  key: 0,
  class: "flowchart-label"
}, s1 = ["x", "y", "width", "height"], o1 = ["x", "y"], l1 = ["x", "dy"], r1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Hm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = I(null), r = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var T;
      const _ = (T = l.value) == null ? void 0 : T.getBoundingClientRect();
      if (!(_ != null && _.width)) return;
      const E = Math.min(_.width / s.value.width, _.height / s.value.height, 1.5);
      r.value = { zoom: E, x: (_.width - s.value.width * E) / 2, y: (_.height - s.value.height * E) / 2 };
    }
    function d(_, E, T) {
      const { zoom: W, x: J, y: D } = r.value, B = Math.min(o.most, Math.max(o.least, W * _));
      r.value = { zoom: B, x: E - (E - J) * B / W, y: T - (T - D) * B / W };
    }
    function f(_) {
      const E = l.value.getBoundingClientRect();
      d(_, E.width / 2, E.height / 2);
    }
    function m(_) {
      const E = l.value.getBoundingClientRect();
      _.ctrlKey || _.metaKey ? d(_.deltaY < 0 ? o.step : 1 / o.step, _.clientX - E.left, _.clientY - E.top) : r.value = { ...r.value, x: r.value.x - _.deltaX, y: r.value.y - _.deltaY };
    }
    function g(_) {
      var E, T, W;
      _.preventDefault(), (E = window.getSelection()) == null || E.removeAllRanges(), i = { x: _.clientX - r.value.x, y: _.clientY - r.value.y }, (W = (T = l.value).setPointerCapture) == null || W.call(T, _.pointerId);
    }
    function v(_) {
      i && (r.value = { ...r.value, x: _.clientX - i.x, y: _.clientY - i.y });
    }
    return Re(u), (_, E) => (c(), H(Rl, {
      title: e.title,
      large: "",
      onClose: E[4] || (E[4] = (T) => a("close"))
    }, {
      default: j(() => [
        y("div", Zm, [
          L(de, {
            small: "",
            onClick: E[0] || (E[0] = (T) => f(o.step))
          }, {
            default: j(() => [...E[5] || (E[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          L(de, {
            small: "",
            onClick: E[1] || (E[1] = (T) => f(1 / o.step))
          }, {
            default: j(() => [...E[6] || (E[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          L(de, {
            small: "",
            onClick: u
          }, {
            default: j(() => [...E[7] || (E[7] = [
              ee("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        y("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: $e(m, ["prevent"]),
          onPointerdown: g,
          onPointermove: v,
          onPointerup: E[2] || (E[2] = (T) => zs(i) ? i.value = null : i = null),
          onPointercancel: E[3] || (E[3] = (T) => zs(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            E[8] || (E[8] = y("defs", null, [
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
            (c(!0), h(z, null, te(s.value.arrows, (T, W) => (c(), h("path", {
              key: `arrow-${W}`,
              class: "flowchart-arrow",
              d: T.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Qm))), 128)),
            (c(!0), h(z, null, te(s.value.nodes, (T) => (c(), h("g", {
              key: T.name,
              class: "flowchart-node"
            }, [
              y("rect", {
                x: T.x,
                y: T.y,
                width: T.width,
                height: T.height,
                rx: "8"
              }, null, 8, e1),
              y("text", {
                x: T.x + T.width / 2,
                y: T.y + T.padY + T.line / 2
              }, [
                (c(!0), h(z, null, te(T.lines, (W, J) => (c(), h("tspan", {
                  key: J,
                  x: T.x + T.width / 2,
                  dy: J ? T.line : 0
                }, $(W), 9, n1))), 128))
              ], 8, t1)
            ]))), 128)),
            (c(!0), h(z, null, te(s.value.arrows, (T, W) => (c(), h(z, {
              key: `label-${W}`
            }, [
              T.label ? (c(), h("g", a1, [
                y("rect", {
                  x: T.label.x,
                  y: T.label.y,
                  width: T.label.width,
                  height: T.label.height,
                  rx: "4"
                }, null, 8, s1),
                y("text", {
                  x: T.label.x + T.label.width / 2,
                  y: T.label.y + T.label.pad + T.label.line / 2
                }, [
                  (c(!0), h(z, null, te(T.label.lines, (J, D) => (c(), h("tspan", {
                    key: D,
                    x: T.label.x + T.label.width / 2,
                    dy: D ? T.label.line : 0
                  }, $(J), 9, l1))), 128))
                ], 8, o1)
              ])) : O("", !0)
            ], 64))), 128))
          ], 12, Xm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, i1 = /* @__PURE__ */ Y(r1, [["__scopeId", "data-v-51d24cfe"]]), vo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', yo = {
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
  agent: vo,
  worker: vo,
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
}, c1 = ["innerHTML"], u1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => yo[t.name] || yo.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, c1));
  }
}, dt = /* @__PURE__ */ Y(u1, [["__scopeId", "data-v-beb5935c"]]), d1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      L(dt, { name: "fold" })
    ], 2));
  }
}, xt = /* @__PURE__ */ Y(d1, [["__scopeId", "data-v-d03899bb"]]), f1 = ["data-tip", "aria-label"], h1 = {
  key: 0,
  class: "mact-word"
}, m1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      L(dt, { name: "open" }),
      e.open ? (c(), h("span", h1, $(e.label), 1)) : O("", !0),
      n[0] || (n[0] = y("span", { class: "hit" }, null, -1))
    ], 10, f1));
  }
}, or = /* @__PURE__ */ Y(m1, [["__scopeId", "data-v-3b292e09"]]), lr = 120, Rn = 280, rr = 160, p1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, g1 = ["leaving", "resizing", "entering"];
function ts(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function v1(e) {
  const t = g1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ts(e);
  return e.classList.add(...t), n;
}
function ir(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const g = v1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, g);
  }
  function u(f) {
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
    if (!m || !m.offsetWidth || p1()) {
      a.value = f;
      return;
    }
    const v = ts(m);
    if (l(m, v), s.value = "leaving", await n(lr), g !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, v);
    const _ = u(m);
    await n(Rn), _ == null || _.disconnect(), g === o && (r(m), s.value = "entering", await n(rr), g === o && (s.value = ""));
  }
  return fe(t, (f) => d(f)), ft(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const y1 = { class: "growing-card-top" }, b1 = ["aria-expanded"], w1 = { class: "growing-card-avatar" }, k1 = { class: "growing-card-title" }, $1 = { class: "growing-card-more" }, x1 = { class: "growing-card-body" }, M1 = {
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
    const n = e, a = t, s = I(!1), o = I(null), { folded: l, phase: r } = ir(o, () => !s.value), i = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", P(r), { open: !P(l), bad: e.bad, incoming: e.incoming }])
    }, [
      y("div", y1, [
        y("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          y("span", w1, [
            e.bad ? (c(), H(dt, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(z, { key: 1 }, [
              ee($(i.value), 1)
            ], 64)) : (c(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          y("span", k1, $(e.title), 1),
          L(xt, { open: s.value }, null, 8, ["open"])
        ], 8, b1),
        e.action ? (c(), H(or, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : O("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          L(ye, {
            name: "bubble",
            size: 13
          })
        ])) : O("", !0)
      ]),
      y("div", $1, [
        y("div", x1, [
          (c(!0), h(z, null, te(u.value, (m, g) => (c(), h("p", {
            key: g,
            class: "growing-card-text"
          }, $(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, S1 = /* @__PURE__ */ Y(M1, [["__scopeId", "data-v-f2b4930d"]]), _1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, E1 = { class: "md inline" }, A1 = ["disabled", "title", "onClick"], C1 = {
  key: 1,
  class: "message-links-many"
}, O1 = ["aria-expanded"], T1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, R1 = ["disabled", "onClick"], I1 = { class: "row-pill message-links-chip" }, B1 = { class: "message-links-title" }, L1 = { key: 0 }, ya = 3, N1 = "task", D1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => n.total || n.links.length), o = R(() => n.links.every((m) => m.endpoint.model === N1) ? "tasks" : "items"), l = I(!1), r = I(null);
    yl(r, () => l.value = !1);
    const i = () => l.value = !l.value, u = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      u(m) || (l.value = !1, Fe(m.endpoint.open_ref));
    }
    return (m, g) => (c(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > ya, three: s.value === ya, open: l.value }]),
      "data-message-links": ""
    }, [
      L(dt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), h("span", _1, [
        y("span", E1, [
          g[1] || (g[1] = ee("Linked: ", -1)),
          (c(!0), h(z, null, te(e.links, (v) => (c(), h("button", {
            key: `${v.endpoint.model}:${v.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: u(v),
            title: v.endpoint.title,
            onClick: (_) => f(v)
          }, [
            ee($(v.endpoint.model.replaceAll("_", " ")) + " " + $(v.endpoint.id), 1),
            d(v) ? (c(), h(z, { key: 0 }, [
              ee(" (" + $(d(v)) + ")", 1)
            ], 64)) : O("", !0),
            u(v) ? (c(), h(z, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : O("", !0)
          ], 8, A1))), 128))
        ])
      ])) : O("", !0),
      s.value >= ya ? (c(), h("span", C1, [
        y("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee($(s.value) + " linked " + $(o.value) + " ", 1),
          L(xt, { open: l.value }, null, 8, ["open"])
        ], 8, O1)
      ])) : O("", !0),
      l.value ? (c(), h("div", T1, [
        (c(!0), h(z, null, te(e.links, (v) => (c(), h("button", {
          key: `${v.endpoint.model}:${v.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: u(v),
          onClick: (_) => f(v)
        }, [
          y("span", I1, $(v.endpoint.model.replaceAll("_", " ")) + " " + $(v.endpoint.id), 1),
          y("span", B1, $(v.endpoint.title), 1),
          y("span", null, $(d(v)), 1),
          u(v) ? (c(), h("span", L1, "Unavailable")) : O("", !0)
        ], 8, R1))), 128))
      ])) : O("", !0),
      L(Qn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (v) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, j1 = /* @__PURE__ */ Y(D1, [["__scopeId", "data-v-e9bc783c"]]), P1 = ["title", "aria-label"], q1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, F1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, W1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", q1, [
        o[0] || (o[0] = y("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", F1)) : O("", !0)
      ]))
    ], 10, P1));
  }
}, H1 = /* @__PURE__ */ Y(W1, [["__scopeId", "data-v-6dc92808"]]);
function U1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function cr(e, t = Date.now()) {
  const n = U1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const z1 = 36e5;
function f4(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / z1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function ur(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function bo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ba = (e) => String(e).padStart(2, "0");
function V1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ba(t % 60)}s` : `${Math.floor(t / 3600)}h ${ba(Math.floor(t % 3600 / 60))}m ${ba(t % 60)}s`;
}
const G1 = "img,pre,table";
function K1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Y1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function J1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(G1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = K1(Y1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Z1(e, t) {
  let n = null;
  const a = () => e.value && J1(e.value);
  Re(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), fe(t, a, { flush: "post" });
}
const X1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Q1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const xn = /* @__PURE__ */ new WeakMap(), Ge = "work", Ut = "sent", ep = 50, wo = () => ({ rows: I([]), total: I(0), next: I(null), loading: I(!1), failure: I(""), version: 0 });
function tp(e) {
  var f;
  if (xn.has(e)) return xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...m.views].some((v) => v.visible);
  };
  async function o(m, g, v = 1) {
    const _ = m[g], E = ++_.version;
    _.loading.value = !0, _.failure.value = "";
    const T = g === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", W = `link list --source message:${m.id} ${T} --page ${v} --page-size ${g === Ge ? 10 : 25}`;
    try {
      const J = await e.read(W);
      if (t.get(m.id) !== m || _.version !== E) return;
      if (!J.ok) {
        _.failure.value = J.error;
        return;
      }
      const D = g === Ge ? J.value.counterparts ?? [] : J.value.rows ?? [], B = v === 1 ? D : [..._.rows.value, ...D], q = g === Ge ? (A) => `${A.endpoint.model}:${A.endpoint.id}` : (A) => A.id ?? A.target_id;
      _.rows.value = [...new Map(B.map((A) => [q(A), A])).values()], _.total.value = J.value.total ?? _.rows.value.length, _.next.value = J.value.next_page ?? null;
    } catch (J) {
      _.version === E && (_.failure.value = J.message);
    } finally {
      _.version === E && (_.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of m) {
      const v = [...g.dirty];
      g.dirty.clear();
      for (const _ of v) o(g, _);
    }
  }
  function r(m, g = [Ge, Ut]) {
    for (const v of g) m.dirty.add(v);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const g = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), v = m.link_types ?? (m.link_type ? [m.link_type] : []), _ = v.length ? [Ge, Ut].filter((T) => T === Ge ? v.some((W) => ["about", "edited"].includes(W)) : v.includes("sent_to")) : [Ge, Ut];
    if (!_.length) return;
    const E = g.length ? [...new Set(g.filter((T) => T.model === "message").map((T) => T.id))].map((T) => t.get(T)).filter(Boolean) : [...t.values()].filter(s).slice(0, ep);
    for (const T of E) r(T, _);
  }
  const u = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, g) {
      let v = t.get(m);
      return v || (v = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ut]), work: wo(), sent: wo() }, t.set(m, v)), v.views.add(g), v.dirty.size && r(v, [...v.dirty]), v;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, g) {
      m.views.delete(g), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), u == null || u(), xn.delete(e));
    },
    more(m, g) {
      const v = m == null ? void 0 : m[g];
      if (v != null && v.next.value && !v.loading.value) return o(m, g, v.next.value);
    }
  };
  return xn.set(e, d), d;
}
function np(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = fe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = tp(e);
    const u = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, u);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      u.visible = g.some((v) => v.isIntersecting), u.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = fe(n, (g) => {
      f == null || f.disconnect(), g && (f == null || f.observe(g));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, u), a.value = null;
    });
  }, { immediate: !0 });
  return ms(o), {
    links: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: R(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: R(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: R(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ge),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ut)
  };
}
const ap = ["data-incoming", "data-ref"], sp = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], op = { class: "message-body" }, lp = ["title"], rp = ["innerHTML"], ip = ["title"], cp = ["innerHTML"], up = {
  class: "message-faces",
  "data-message-faces": ""
}, dp = ["title", "data-face", "onClick"], fp = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, hp = ["title", "data-reaction", "onClick"], mp = {
  key: 0,
  class: "message-reaction-count"
}, pp = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, gp = ["href", "title"], vp = ["src", "alt"], yp = ["href"], bp = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, wp = ["disabled", "data-sent-worker", "title", "onClick"], kp = { class: "message-foot" }, $p = { class: "message-time" }, xp = {
  class: "message-id",
  "data-message-id": ""
}, Mp = 140, Sp = 2, _p = 1500, Ep = "An earlier message", Ap = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), l = R(() => ["user", "comment"].includes(n.message.type)), r = R(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), se = ct(ve);
      return se ? { ref: `${se}:${me}`, label: `${qt(se).title.toLowerCase()} ${me}` } : null;
    }), i = R(() => n.message.worker_id ?? null), u = I(!1), d = R(() => i.value !== null && ((n.message.text ?? "").length > Mp || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > Sp)), f = R(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, _p);
    }
    const g = Gl(), v = R(() => g(n.message.text ?? "")), _ = R(() => JSON.parse(n.message.flowchart_edges || "[]")), E = I(!1), T = R(() => g(n.quote || Ep));
    function W() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    Z1(o, () => `${n.message.text} ${n.quote}`);
    const J = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, D = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, B = R(() => JSON.parse(n.message.captions || "{}")), q = R(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: D(ve), isImage: J.test(ve), title: B.value[ve] || ve }))), A = R(() => ur(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), M = Oe(Ne, null), { links: b, total: k, more: w, loading: p, failure: S, sentTo: x, sentMore: C, sentLoading: N, sentFailure: X, loadMore: ne, loadSent: ie } = np(M, () => l.value && !n.message.local ? n.message.id : null, o), he = I(!1), Ae = R(() => Q1(n.message.reactions));
    function He(ve) {
      he.value = !1, a("react", n.message, ve);
    }
    return (ve, me) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      L(S1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (se) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, ap)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      y("div", op, [
        y("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...se) => P(It) && P(It)(...se))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = $e((se) => P(Fe)(r.value.ref), ["stop"]))
          }, [
            L(ye, {
              name: "bubble",
              size: 12
            }),
            y("span", null, "Comment on " + $(r.value.label), 1)
          ], 8, lp)) : O("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(W, ["stop"]),
            innerHTML: T.value
          }, null, 8, rp)) : O("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = $e((se) => P(Fe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + $(i.value), 9, ip)) : O("", !0),
          y("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, cp),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = $e((se) => u.value = !u.value, ["stop"]))
          }, $(u.value ? "Show less" : "Show more"), 1)) : O("", !0),
          _.value.length ? (c(), h(z, { key: 4 }, [
            y("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (se) => E.value = !0)
            }, "Open the flowchart"),
            E.value ? (c(), H(i1, {
              key: 0,
              title: e.message.text,
              edges: _.value,
              onClose: me[5] || (me[5] = (se) => E.value = !1)
            }, null, 8, ["title", "edges"])) : O("", !0)
          ], 64)) : O("", !0)
        ], 2),
        y("div", {
          class: Z(["message-tools", { picking: he.value }]),
          "data-message-tools": ""
        }, [
          he.value ? (c(), h(z, { key: 0 }, [
            y("div", up, [
              (c(!0), h(z, null, te(P(X1), (se) => (c(), h("button", {
                key: se,
                type: "button",
                class: "message-face",
                title: `React ${se}`,
                "data-face": se,
                onClick: (Je) => He(se)
              }, $(se), 9, dp))), 128))
            ]),
            y("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: me[7] || (me[7] = (se) => he.value = !1)
            }, [
              L(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(z, { key: 1 }, [
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
            }, $(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: me[10] || (me[10] = (se) => a("delete", e.message))
            }, "Delete")) : O("", !0)
          ], 64))
        ], 2)
      ]),
      Ae.value.length ? (c(), h("div", fp, [
        (c(!0), h(z, null, te(Ae.value, (se) => (c(), h("button", {
          key: se.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: se.mine }]),
          title: se.title,
          "data-reaction": se.emoji,
          onClick: (Je) => a("react", e.message, se.emoji)
        }, [
          ee($(se.emoji) + " ", 1),
          se.count > 1 ? (c(), h("span", mp, $(se.count), 1)) : O("", !0)
        ], 10, hp))), 128))
      ])) : O("", !0),
      q.value.length ? (c(), h("div", pp, [
        (c(!0), h(z, null, te(q.value, (se) => (c(), h(z, {
          key: se.name
        }, [
          se.isImage ? (c(), h("a", {
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
            }, null, 8, vp)
          ], 8, gp)) : (c(), h("a", {
            key: 1,
            href: se.address,
            target: "_blank",
            class: "message-file"
          }, $(se.name), 9, yp))
        ], 64))), 128))
      ])) : O("", !0),
      P(x).length ? (c(), h("div", bp, [
        L(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(z, null, te(P(x), (se) => (c(), h("button", {
          key: se.id,
          type: "button",
          class: "message-sent-worker",
          disabled: se.unavailable || !se.open_ref,
          "data-sent-worker": se.id,
          title: `Open worker ${se.id}`,
          onClick: $e((Je) => se.open_ref && P(Fe)(se.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + $(se.id), 1),
          se.unavailable ? (c(), h(z, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : O("", !0)
        ], 8, wp))), 128))
      ])) : O("", !0),
      L(Qn, {
        more: P(C),
        loading: P(N),
        failure: P(X),
        label: "More recipients",
        onMore: P(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      y("div", kp, [
        y("time", $p, $(A.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(z, { key: 0 }, [
          me[11] || (me[11] = y("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          y("span", xp, "message " + $(e.message.id), 1)
        ], 64)) : O("", !0),
        l.value ? (c(), H(H1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : O("", !0)
      ]),
      P(b).length || P(S) ? (c(), H(j1, {
        key: 3,
        links: P(b),
        total: P(k),
        more: P(w),
        loading: P(p),
        failure: P(S),
        onMore: P(ne)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : O("", !0)
    ], 8, sp));
  }
}, h4 = /* @__PURE__ */ Y(Ap, [["__scopeId", "data-v-0be1107c"]]), Cp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = hi("SkeletonParts", !0);
      return c(!0), h(z, null, te(e.parts, (i, u) => (c(), h(z, { key: u }, [
        (c(!0), h(z, null, te(i.count, (d) => (c(), H(Pt, {
          key: d,
          value: i.shape
        }, {
          line: j(() => [
            L(Gt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            L(Gt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            L(Gt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            y("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            y("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            y("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            y("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            y("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Op = /* @__PURE__ */ Y(Cp, [["__scopeId", "data-v-fa8baeaf"]]), Tp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Rp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", Tp, [
      L(Op, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Cs = /* @__PURE__ */ Y(Rp, [["__scopeId", "data-v-52f66b64"]]), Hn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], wa = 200, dr = (e) => {
  var t;
  return ((t = Hn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Hn[0].key;
}, m4 = (e) => {
  var t;
  return ((t = Hn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Ip = ["aria-label"], Bp = 300, ko = 400, Lp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: wa } },
  setup(e) {
    const t = e, n = R(() => dr(t.value)), a = R(() => n.value < wa ? [1, 0.25, 0.25] : n.value === wa ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= ko, high: n.value >= Bp && n.value < ko }]),
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
    ], 10, Ip));
  }
}, p4 = /* @__PURE__ */ Y(Lp, [["__scopeId", "data-v-b10e610f"]]), $o = (e) => [...new Set(e.agents.map((t) => t.name))], g4 = (e) => $o(e).length === 1 ? `Worker: ${$o(e)[0]}` : "Delegated", Np = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, xo = (e) => Np[e.card.state] || "idle", Dp = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Mo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, So = (e, t) => Mo[xo(e)] - Mo[xo(t)], _o = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, v4 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => So(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Dp(a, s)) : [...e].sort((a, s) => So(a, s) || (_o[t] || _o.state)(a, s)), jp = { class: "list-row" }, Pp = {
  key: 0,
  class: "list-row-type"
}, qp = { class: "list-row-main" }, Fp = {
  key: 0,
  class: "list-row-title"
}, Wp = { class: "list-row-body" }, Hp = {
  key: 1,
  class: "list-row-end"
}, Up = {
  key: 1,
  class: "list-row-text"
}, zp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", jp, [
      e.type ? (c(), h("span", Pp, $(e.type), 1)) : O("", !0),
      y("div", qp, [
        e.title ? (c(), h("span", Fp, $(e.title), 1)) : O("", !0),
        y("div", Wp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Hp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      e.text ? (c(), h("span", Up, $(e.text), 1)) : O("", !0)
    ]));
  }
}, y4 = /* @__PURE__ */ Y(zp, [["__scopeId", "data-v-dfc8c3a7"]]), Vp = ["aria-expanded"], Gp = { class: "drop-label" }, Kp = ["value"], Yp = {
  key: 1,
  class: "drop-lead"
}, Jp = { class: "drop-item-text" }, Zp = {
  key: 2,
  class: "drop-note"
}, Xp = {
  key: 1,
  class: "drop-none"
}, Qp = {
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
    const n = e, a = t, s = I(!1), o = I(null), l = I(""), r = R(() => {
      const u = l.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function i(u) {
      s.value = !1, a("pick", u);
    }
    return (u, d) => (c(), h("div", {
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
        e.icon ? (c(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : O("", !0),
        y("span", Gp, $(e.label), 1),
        L(ye, {
          name: "down",
          size: 11
        })
      ], 10, Vp),
      s.value ? (c(), H(ea, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: j(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, Kp)) : O("", !0),
          (c(!0), h(z, null, te(r.value, (f) => (c(), H(Mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: j(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : O("", !0),
              f.lead ? (c(), h("span", Yp, $(f.lead), 1)) : O("", !0),
              y("span", Jp, $(f.label), 1),
              f.note ? (c(), h("span", Zp, $(f.note), 1)) : O("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? O("", !0) : (c(), h("p", Xp, $(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : O("", !0)
    ], 2));
  }
}, eg = /* @__PURE__ */ Y(Qp, [["__scopeId", "data-v-29dfcce5"]]), b4 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = R(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), H(eg, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, tg = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: Z(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, fr = /* @__PURE__ */ Y(tg, [["__scopeId", "data-v-978e0921"]]), ng = ["aria-label"], ag = { class: "head" }, sg = { class: "names" }, og = { class: "body" }, lg = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Cl(a, n), r = Ol(s);
    return (i, u) => (c(), H(hs, { to: "body" }, [
      L(jt, {
        name: "side",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: j(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: P(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = $e((...d) => P(o) && P(o)(...d), ["self"]))
          }, [
            y("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(z, { key: 0 }, [
                y("header", ag, [
                  y("div", sg, [
                    y("h2", null, $(e.title), 1),
                    e.abstract ? (c(), H(kt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : O("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  L(xs, {
                    title: e.closeLabel,
                    onClick: P(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (c(), H(fr, { key: 0 }, {
                  default: j(() => [
                    ue(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : O("", !0),
                y("div", og, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, ng)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, w4 = /* @__PURE__ */ Y(lg, [["__scopeId", "data-v-f276f055"]]), rg = {
  key: 1,
  class: "text-field-label"
}, ig = {
  key: 2,
  class: "text-field-end"
}, cg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ha({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Wa(e, "modelValue"), a = Xn(), s = "onUpdate:modelValue" in (((d = mi()) == null ? void 0 : d.vnode.props) || {}), o = R(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = R(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = R(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, P(a).class]),
      style: ge(P(a).style)
    }, [
      e.icon ? (c(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : O("", !0),
      e.label ? (c(), h("span", rg, $(e.label), 1)) : O("", !0),
      Ye(y("input", Le({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [P(Ya), o.value]
      ]),
      f.$slots.end ? (c(), h("span", ig, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : O("", !0)
    ], 6)) : Ye((c(), h("input", Le({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [P(Ya), o.value]
    ]);
  }
}), k4 = /* @__PURE__ */ Y(cg, [["__scopeId", "data-v-d9c38ca8"]]), ug = { class: "title" }, dg = { class: "state" }, fg = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ua(t.line, t.events);
    return (o, l) => (c(), H(tf, {
      rows: P(n),
      failure: P(a),
      loaded: P(s),
      empty: e.empty
    }, {
      default: j(({ row: r }) => [
        y("span", ug, $(r.title), 1),
        y("span", dg, $(P($l)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, $4 = /* @__PURE__ */ Y(fg, [["__scopeId", "data-v-9191a6f0"]]);
function hg(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? fe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const ka = I(Date.now() / 1e3);
let Eo = 0, Mn = 0;
function hr() {
  return Mn || (ka.value = Date.now() / 1e3, Eo = setInterval(() => ka.value = Date.now() / 1e3, 1e3)), Mn += 1, al() && ms(() => {
    Mn -= 1, Mn || clearInterval(Eo);
  }), ka;
}
const mg = 200, pg = lr + Rn + rr + mg;
function Wt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function gg(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Wt(e),
    top: Wt(e.querySelector(".top")),
    title: Wt(e.querySelector(".title")),
    contents: Wt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, u;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: Wt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function vg(e, t, n, a) {
  fe(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(gg(o, l, n.value)), performance.now() - l < pg) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const yg = ["title", "data-figure-mark", "data-folded", "data-open"], bg = {
  key: 2,
  class: "worker"
}, wg = { class: "head" }, kg = { key: 0 }, $g = {
  key: 3,
  class: "status"
}, xg = {
  key: 0,
  class: "figure"
}, Mg = {
  key: 1,
  class: "ran-for"
}, Sg = { key: 2 }, _g = {
  key: 3,
  class: "news"
}, Eg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Ag = {
  key: 6,
  class: "settled"
}, Cg = {
  key: 1,
  class: "bar"
}, Og = {
  key: 3,
  class: "detail body"
}, Tg = {
  key: 0,
  class: "body-label"
}, Rg = ["title"], Ig = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Xn(), a = ["onClick", "onAct"], s = R(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), l = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = R(() => t.open !== void 0), i = R(() => r.value || l.value), u = R(() => r.value ? t.open : o.value), d = R(() => r.value ? !t.open : l.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), m = R(() => i.value || f.value || !!n.onClick), g = I(null), v = I(null), { folded: _, phase: E } = ir(g, () => d.value);
    vg(g, d, E, Oe(Ne, null));
    function T(ie) {
      var he, Ae;
      if (!(ie.target !== g.value && !v.value.contains(ie.target))) {
        if (r.value) return (he = n.onClick) == null ? void 0 : he.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const W = (ie) => n.onAct(ie), J = ["failed", "unfinished"], D = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? J.includes(t.mark.state) ? "danger" : "good" : ""), B = R(() => t.mark.color ? t.mark.color : D.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : D.value ? `var(--tone-${D.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), q = R(() => B.value || "var(--tone-work)"), A = R(() => !t.mark.ending && !t.mark.ended && D.value !== "stopped"), M = hr(), b = R(
      () => t.mark.began_at && A.value && !t.mark.figure && !t.mark.counting ? V1(M.value - t.mark.began_at) : ""
    ), k = R(() => {
      const { started: ie, ended: he } = t.mark;
      return ie ? he ? `ran ${bo(he - ie, !0)}` : bo(M.value - ie, !0) : b.value;
    }), w = ["bad", "danger", "warn"], p = R(() => w.includes(D.value) || t.mark.asks ? "attention" : A.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], x = R(() => S.includes(D.value)), C = R(() => p.value === "process" ? "running" : x.value ? "cross" : D.value === "stopped" ? "stopped" : D.value === "good" ? "tick" : ""), N = R(
      () => !!(t.mark.figure || k.value || t.mark.docked || t.mark.stopping || C.value || t.mark.settled || t.mark.news)
    ), X = R(() => [t.mark.title, t.mark.time ? ur(t.mark.time) : ""].filter(Boolean).join(" · ")), ne = R(() => ({
      ...B.value ? { "--mark": B.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, he) => (c(), h("div", Le(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${p.value}`,
        P(E),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: x.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: B.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ne.value,
      title: X.value,
      "data-figure-mark": e.mark.key,
      "data-folded": P(_) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: T
    }), [
      (c(), H(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: v,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (c(), H(dt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", bg, $(e.mark.worker), 1)) : O("", !0),
          y("span", wg, [
            L(kt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", kg, $(e.mark.name), 1)) : O("", !0),
            i.value ? (c(), H(xt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : O("", !0)
          ]),
          N.value ? (c(), h("span", $g, [
            e.mark.figure ? (c(), h("span", xg, $(e.mark.figure), 1)) : O("", !0),
            k.value ? (c(), h("span", Mg, $(k.value), 1)) : O("", !0),
            e.mark.stopping ? (c(), h("span", Sg, "Stopping")) : O("", !0),
            e.mark.news ? (c(), h("span", _g, $(e.mark.news), 1)) : O("", !0),
            C.value === "running" ? (c(), h("span", Eg)) : C.value ? (c(), H(dt, {
              key: 5,
              class: Z(["sign", C.value]),
              name: C.value
            }, null, 8, ["class", "name"])) : O("", !0),
            e.mark.settled ? (c(), h("span", Ag, $(e.mark.settled), 1)) : O("", !0)
          ])) : O("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), H(or, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: $e(W, ["stop"])
      }, null, 8, ["label", "open"])) : O("", !0),
      (e.mark.figure || e.mark.counting) && A.value ? (c(), h("span", Cg, [
        y("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: q.value })
        }, null, 4)
      ])) : O("", !0),
      e.mark.detail && !P(_) ? (c(), H(kt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      e.mark.body && !P(_) ? (c(), h("div", Og, [
        e.mark.bodyLabel ? (c(), h("p", Tg, $(e.mark.bodyLabel), 1)) : O("", !0),
        L(kt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : O("", !0),
      e.mark.command && !P(_) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, $(e.mark.command), 9, Rg)) : O("", !0),
      e.mark.card ? (c(), H(kt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      ue(ie.$slots, "default", {
        shown: !P(_)
      }, void 0, !0)
    ], 16, yg));
  }
}), mr = /* @__PURE__ */ Y(Ig, [["__scopeId", "data-v-2aa9c496"]]), Bg = 60, pr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Lg(e, t) {
  const n = I([]), a = I(0);
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
  async function u(d) {
    if (l || a.value <= 0 || d.scrollTop > Bg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const Ng = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function gr(e) {
  var n;
  const t = Ng[e] || ((n = qt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Dg = (e) => gr(String(e).split(":")[0]), jg = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Pg = { passed: "good", failed: "danger", warned: "warn", running: "" }, qg = { good: "good", warn: "warn", danger: "danger" }, Ao = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => zd(e.target_model, e.target_id || 0)
}, Fg = { "open row": (e) => Dg(e.target_model), "open page": () => gr("pages") };
function Wg(e, t) {
  const n = t || {}, a = Ao[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Pg[e.outcome] || "" : qg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Fg[a](e) : "",
    handlers: a ? { onAct: () => Ao[a](e) } : {}
  };
}
const Hg = 24, Ug = 1e3, Co = 2e3, zg = 0.25, Vg = 5e3;
function Gg(e, t = Hg, n = () => !0) {
  const a = I(!1), s = I(0), o = I(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const D = u();
    return D ? D.scrollHeight - D.scrollTop - D.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(D) {
    if (clearTimeout(l), !D) {
      o.value = !1, i = Date.now();
      return;
    }
    const B = Date.now() - i < Co ? Co : Ug;
    l = setTimeout(() => o.value = a.value, B);
  }
  function g() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function v(D = !1) {
    const B = u();
    B && D && B.scrollTo ? B.scrollTo({ top: B.scrollHeight, behavior: "smooth" }) : B && (B.scrollTop = B.scrollHeight), g();
  }
  function _() {
    T(), !a.value && (a.value = !0, m(!0));
  }
  const E = () => !!u() && d() <= u().clientHeight * zg;
  function T() {
    clearTimeout(r), E() && (r = setTimeout(() => a.value && E() && n() && v(!0), Vg));
  }
  function W() {
    f() ? g() : _();
  }
  function J(D = 1, B = !1) {
    a.value ? s.value += Math.max(0, D) : v(B);
  }
  return al() && ms(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: g, toBottom: v, left: _, scrolled: W, arrived: J };
}
const Kg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Yg = (e) => String(e ?? "").replace(Kg, ""), Jg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: l, arrived: r, toBottom: i } = Gg(s);
    fe(
      () => n.lines.length,
      () => mt(() => r()),
      { immediate: !0 }
    );
    function u(d) {
      l(), a("older", d.target);
    }
    return (d, f) => (c(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: u
    }, [
      ee($(P(Yg)(e.lines.join(`
`)) || e.empty), 1),
      P(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => P(i)(!0))
      }, "Follow")) : O("", !0)
    ], 544));
  }
}, Zg = /* @__PURE__ */ Y(Jg, [["__scopeId", "data-v-c2fb1783"]]), Xg = 1e4;
class Qg {
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
    return this.heardAt !== null && t - this.heardAt > Xg;
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
const ev = {
  key: 0,
  class: "frame-note"
}, tv = {
  key: 0,
  class: "frame-note"
}, nv = ["src", "title"], av = 1e3, sv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = We(), a = I(null), s = I(!1), o = I(!1);
    let l = null, r = 0;
    return Re(() => {
      l = new Qg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, av);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", ev, "This window was closed because it stopped answering.")) : (c(), h(z, { key: 1 }, [
      s.value ? (c(), h("div", tv, [
        u[2] || (u[2] = y("p", null, "This window has not answered for ten seconds.", -1)),
        L(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...u[1] || (u[1] = [
            ee("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : O("", !0),
      y("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: P(n).window
      }, null, 8, nv)
    ], 64));
  }
}, ov = /* @__PURE__ */ Y(sv, [["__scopeId", "data-v-32a49046"]]), Sn = (e) => e ? e.split(", ") : [];
function lv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function rv(e, t) {
  return {
    reads: Sn(e.reads_allowed),
    runs: Sn(e.runs_allowed),
    missing: [...Sn(e.reads_missing), ...Sn(e.runs_missing)],
    ask: t
  };
}
const iv = {
  class: "allowance-prompt",
  role: "dialog"
}, cv = { class: "allowance-prompt-text" }, uv = { class: "allowance-prompt-buttons" }, dv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", iv, [
      y("p", cv, $(P(lv)(e.request)), 1),
      y("div", uv, [
        L(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ee("Allow", -1)
          ])]),
          _: 1
        }),
        L(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            ee("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, fv = /* @__PURE__ */ Y(dv, [["__scopeId", "data-v-cad69fe2"]]), $a = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        ee($(e.reason) + " ", 1),
        e.retry ? (c(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : O("", !0),
        e.removable ? (c(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            ee("Remove tab", -1)
          ])]),
          _: 1
        })) : O("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, hv = ["data-window", "data-agent"], mv = {
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
    const n = e, a = t, s = I(""), o = I(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Oe(Pc, null), i = Pu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: Oe(Iu, null),
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
    sl(Ne, i), fe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Re(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), pi((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Jn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), H(fv, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : O("", !0),
      e.unavailableReason ? (c(), H($a, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), H($a, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(z, { key: 4 }, [
        (c(), H(u, { key: o.value })),
        e.skeleton.length && !P(i).answered.value ? (c(), H(Cs, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : O("", !0)
      ], 64)) : (c(), H($a, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, hv));
  }
}, Kt = /* @__PURE__ */ Y(mv, [["__scopeId", "data-v-c4443e2b"]]), vr = {
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
    const n = e, a = t, s = { render: () => Jn(ov, { src: n.entry.entry_url }) };
    return (o, l) => (c(), H(Kt, {
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
}, pv = ["data-window"], yr = {
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
    const n = e, a = t, s = Ke(null), o = I("");
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
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      L(Cs, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, pv)) : (c(), H(Kt, {
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
      onOption: r[0] || (r[0] = (i, u) => a("option", i, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, gv = "*.*", vv = {
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
    const t = e, n = Oe(Ne, null), a = new Cc();
    fe(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (g) => a.dispatch(g));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = R(() => !!(t.declaration.shipped || t.declaration.trusted)), r = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [gv] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), H(yr, {
      key: 0,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), H(vr, {
      key: 1,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, yv = { class: "mark-more-inner" }, bv = {
  class: "mark-lines",
  "data-mark-reason": ""
}, wv = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, kv = {
  key: 3,
  class: "mark-lines"
}, $v = "process", Oo = "task", xv = {
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
    const t = e, n = We(), a = R(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = R(() => jg.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === Oo ? t.mark.target_id : 0), l = Lg(
      pr(n),
      () => t.mark.target_id
    ), r = l.lines, i = I(!1), u = I(""), d = R(() => !t.declaration.body_url && t.mark.target_model === $v && !!t.mark.target_id);
    async function f(g = l.follow) {
      const v = await g();
      i.value = !0, u.value = v.ok ? "" : v.error;
    }
    const m = R(() => t.shown && d.value);
    return fe(m, (g) => g && f()), gs(() => m.value && f(), () => m.value && !t.mark.ended_at), fe(
      () => t.mark.ended_at,
      (g) => g && m.value && f(l.newest)
    ), (g, v) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: v[1] || (v[1] = $e(() => {
      }, ["stop"]))
    }, [
      y("div", yv, [
        e.declaration.body_url ? (c(), H(vv, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), h(z, { key: 1 }, [
          s.value ? (c(), h(z, { key: 0 }, [
            v[2] || (v[2] = y("p", { class: "mark-label" }, "Why it stopped", -1)),
            y("p", bv, $(s.value), 1)
          ], 64)) : O("", !0),
          d.value && u.value ? (c(), h("p", wv, $(u.value), 1)) : d.value && i.value ? (c(), h(z, { key: 2 }, [
            v[3] || (v[3] = y("p", { class: "mark-label" }, "Output", -1)),
            L(Zg, {
              class: "mark-terminal",
              lines: P(r),
              onOlder: P(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", kv, $(a.value.join(`
`)), 1)) : O("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: v[0] || (v[0] = $e((_) => P(Fe)(`${Oo}:${o.value}`), ["stop"]))
          }, " Open task " + $(o.value) + " and its proofs ", 1)) : O("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ns = /* @__PURE__ */ Y(xv, [["__scopeId", "data-v-2f996108"]]), Mv = ["title", "aria-label", "onClick"], Sv = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, _v = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => yd(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = I(""), s = Oe(Ne);
    async function o(l) {
      const r = await cn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(z, null, [
      (c(!0), h(z, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: $e((u) => o(i), ["stop"])
      }, [
        L(dt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Mv))), 128)),
      a.value ? (c(), h("span", Sv, $(a.value), 1)) : O("", !0)
    ], 64));
  }
}, Ev = /* @__PURE__ */ Y(_v, [["__scopeId", "data-v-7a62c88e"]]);
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
const wr = br("/api/marks", "marks"), x4 = wr.fetchAll, Av = wr.find, Cv = ["data-ref"], Ov = ["data-ref"], Tv = { class: "mark-row" }, Rv = "dock add", Iv = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = R(() => Av(a.mark.type)), o = R(() => Wg(a.mark, s.value)), l = R(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = I(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = R(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(Rv));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, g;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        L(ns, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Cv)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        y("span", Tv, [
          L(mr, Le({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, gi(o.value.handlers), { onClick: i }), vi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: v }) => [
                L(ns, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: v
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          L(Ev, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Ov));
    };
  }
}, Bv = /* @__PURE__ */ Y(Iv, [["__scopeId", "data-v-afd7d6b1"]]), Lv = ["data-ref"], Nv = ["inert"], Dv = { class: "group-fold" }, jv = { class: "thread-group" }, Pv = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    fe(n, async (r) => {
      var i;
      a.value = !0, await mt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = R(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      L(mr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        y("div", Dv, [
          y("div", jv, [
            (c(!0), h(z, null, te(e.group.marks, (u) => (c(), H(Bv, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Nv)) : O("", !0)
    ], 8, Lv));
  }
}, M4 = /* @__PURE__ */ Y(Pv, [["__scopeId", "data-v-45b58b9b"]]);
function qv(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), ft(() => n.disconnect()), t;
}
const Fv = { class: "chat-dock-fold" }, Wv = ["aria-label"], Hv = { class: "chat-dock-head" }, Uv = { class: "chat-dock-inner" }, zv = { class: "chat-dock-foot" }, kr = 700, Vv = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = qv(a), o = I(!1);
    let l = 0;
    return Re(() => l = setTimeout(() => o.value = !0, kr)), ft(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      y("div", Fv, [
        y("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          y("header", Hv, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          y("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            y("div", Uv, [
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
          y("footer", zv, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Wv)
      ])
    ], 2));
  }
}, $r = /* @__PURE__ */ Y(Vv, [["__scopeId", "data-v-74d44b19"]]), Gv = {
  class: "dock-leave",
  "aria-hidden": "true"
}, xa = 5, Kv = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(xa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${xa}s`, animationDelay: `${(n - xa).toFixed(2)}s` };
    return (s, o) => (c(), h("span", Gv, [
      y("i", { style: a })
    ]));
  }
}, xr = /* @__PURE__ */ Y(Kv, [["__scopeId", "data-v-2a7bc150"]]), Yv = { reviewing: "Under review" }, Jv = (e, t) => e || Yv[t == null ? void 0 : t.state] || "", Qe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Zv = {
  draft: [{ word: "ready", label: "Mark ready" }, Qe],
  ready: [Qe],
  approved: [{ word: "start", label: "Start", main: !0 }, Qe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Qe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Qe],
  completed: [],
  cancelled: []
}, Xv = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Qe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Qe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Qv = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], e0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], t0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], n0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], a0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], s0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function o0(e, t) {
  const n = { plan: Zv, task: Xv }[e], a = t != null && t.state ? Ru(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[xl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const l0 = (e, t) => e === "doc" || e === "report" ? s0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...t0(t), ...e0(t)] : e === "check" ? a0(t) : e === "question" ? Qv(t) : e === "memory" ? n0(t) : o0(e, t), Mr = br("/api/docks", "docks"), S4 = Mr.fetchAll, zt = Mr.find, r0 = 6, i0 = 3, Ma = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, na = (e) => Date.parse(e.leaves_at) / 1e3, wt = (e) => !!(e.leaves_at && !e.kept), c0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < na(e) || n.has(e.id)), u0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => c0(a, t, n)).sort((a, s) => a.id - s.id);
function d0(e, t, n = r0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(na(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const f0 = (e, t, n = e) => n < 2 ? !1 : e >= i0 ? !0 : t, h0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), as = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), m0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), p0 = (e) => ({ ...e.kept ? as("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : as("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), g0 = ["pins"], v0 = (e) => ({ ...e, iconOnly: g0.includes(e.icon) });
function y0(e, t) {
  var n;
  return [
    ...m0(e, t) ? [p0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || qt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    as("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(v0);
}
function b0(e, t) {
  const n = y0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: h0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const w0 = ["title"], k0 = {
  key: 2,
  class: "dock-controls"
}, $0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, x0 = { class: "dock-facts" }, M0 = { key: 1 }, S0 = {
  key: 2,
  class: "dock-kept"
}, _0 = { class: "dock-acts" }, E0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = R(() => zt(a.item.type)), o = hr(), l = R(() => cr(a.item.created_at, o.value * 1e3)), r = I(null), i = I(null), u = I(null), d = I(null), f = R(() => b0(a.item, s.value)), m = We(), g = R(() => `dock.${a.item.id}`), v = R(() => m.props[g.value].data.value), _ = R(() => Fn(a.item.target_model ?? "")), E = R(() => ({ ...v.value, id: a.item.target_id, noun: _.value })), T = () => {
      var M, b;
      return ((b = (M = s.value) == null ? void 0 : M.reads) == null ? void 0 : b.length) && m.reload(g.value);
    };
    Fc(sl, { data: v, reload: T, readOutput: pr(m) }), fe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (M, b, k) => {
        var p;
        T();
        const w = (p = m.subscriptions) == null ? void 0 : p.follow(`dock ${a.item.id}`, [`${_.value.replaceAll("-", "_")}.*`], (S) => {
          (!S.row_id || S.row_id === a.item.target_id) && T();
        });
        k(() => w == null ? void 0 : w());
      },
      { immediate: !0 }
    );
    const W = I(/* @__PURE__ */ new Set()), J = I("");
    async function D(M) {
      if (M.action === "open") return Fe(`${a.item.target_model}:${a.item.target_id}`);
      M.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, M.label])), J.value = "";
      const k = await cn(M, { id: a.item.target_id }, m.environment);
      (k == null ? void 0 : k.ok) === !1 && (W.value = new Set([...W.value].filter((w) => w !== M.label)), J.value = `Could not ${M.label.toLowerCase()}: ${k.error}`);
    }
    const B = R(() => f.value.actions.filter((M) => M.action !== "undock" && !W.value.has(M.label))), q = R(() => {
      var M;
      return Jv((M = s.value) == null ? void 0 : M.badge, E.value);
    }), A = R(() => f.value.buttons.find((M) => M.action === "undock"));
    return (M, b) => {
      var k, w, p, S;
      return c(), H($r, {
        label: f.value.title + ((k = s.value) != null && k.needs_user ? ", waiting for you" : ""),
        type: (w = s.value) != null && w.needs_user ? "waiting" : "",
        folded: !!((p = s.value) != null && p.folds) && e.folded,
        body: !!((S = s.value) != null && S.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: b[3] || (b[3] = (x) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (c(), H(xr, {
            key: 0,
            "ends-at": P(na)(e.item)
          }, null, 8, ["ends-at"])) : O("", !0)
        ]),
        head: j(() => {
          var x, C;
          return [
            (x = s.value) != null && x.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(z, { key: 1 }, [
              L(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              y("span", {
                class: "dock-title",
                title: f.value.title
              }, $(f.value.title), 9, w0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", k0, [
              (c(!0), h(z, null, te(f.value.controls, (N) => {
                var X, ne;
                return c(), h(z, {
                  key: N.action + N.runs
                }, [
                  !W.value.has(N.label) && (!((X = N.variants) != null && X.length) || !((ne = E.value) != null && ne.state) || N.variants.includes(E.value.state)) ? (c(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: N.pressed }),
                    "aria-pressed": N.pressed,
                    "aria-label": N.label,
                    title: N.label,
                    "data-dock-action": N.action,
                    onClick: (ie) => D(N)
                  }, {
                    default: j(() => [
                      L(ye, {
                        name: N.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : O("", !0)
                ], 64);
              }), 128))
            ])) : O("", !0),
            y("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (C = s.value) != null && C.leaves_after_seconds ? O("", !0) : (c(), h(z, { key: 0 }, [
                ee($(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: j(() => [
          J.value || e.refusal ? (c(), h("p", $0, $(J.value || e.refusal), 1)) : O("", !0)
        ]),
        foot: j(() => {
          var x, C;
          return [
            y("span", x0, [
              q.value ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, $(q.value), 3)) : O("", !0),
              (x = s.value) != null && x.word ? (c(), h("span", M0, $(s.value.word), 1)) : O("", !0),
              y("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", S0, "Kept")) : O("", !0)
            ]),
            (C = s.value) != null && C.folds ? (c(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: b[0] || (b[0] = (N) => n("fold"))
            }, {
              default: j(() => [
                ee($(s.value.folds) + " ", 1),
                L(xt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : O("", !0),
            y("span", _0, [
              y("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              L(Rd, {
                name: `dock.${e.item.type}`,
                row: E.value,
                environment: P(m).environment,
                "read-only": P(m).readOnly,
                "object-name": P(Fn)(e.item.target_model),
                "external-failure": "",
                onFailure: b[1] || (b[1] = (N) => J.value = N),
                onDone: M.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (c(!0), h(z, null, te(B.value, (N) => (c(), H(de, {
                key: N.action + N.runs,
                small: "",
                variant: N.primary ? "primary" : "ghost",
                bordered: !N.primary,
                "data-dock-action": N.action,
                onClick: (X) => D(N)
              }, {
                default: j(() => [
                  ee($(N.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              L(de, {
                small: "",
                bordered: "",
                title: A.value.label,
                "data-dock-action": "undock",
                onClick: b[2] || (b[2] = (N) => n("undock", A.value))
              }, {
                default: j(() => [...b[4] || (b[4] = [
                  ee("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: j(() => {
          var x;
          return [
            (x = s.value) != null && x.body_url ? (c(), H(ns, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : O("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, To = /* @__PURE__ */ Y(E0, [["__scopeId", "data-v-a1d83375"]]), A0 = ["title", "aria-label"], C0 = { class: "run-chip-in" }, O0 = {
  key: 0,
  class: "run-chip-ring"
}, T0 = { class: "run-chip-name" }, R0 = { class: "run-chip-bar" }, I0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = We(), o = R(() => `run.${a.item.target_id}`), l = R(() => s.props[o.value].data.value), r = R(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = R(() => {
      var m, g;
      return ((m = l.value) == null ? void 0 : m.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), u = R(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let f = null;
    return Re(() => {
      var m;
      d(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), ft(() => f == null ? void 0 : f()), (m, g) => {
      var v;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": u.value })
      }, [
        P(wt)(e.item) ? (c(), H(xr, {
          key: 0,
          "ends-at": P(na)(e.item)
        }, null, 8, ["ends-at"])) : O("", !0),
        y("span", C0, [
          r.value ? (c(), h("span", O0)) : (c(), H(dt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          y("span", T0, $(i.value), 1)
        ]),
        y("span", R0, [
          y("i", {
            style: ge({ width: r.value ? `${((v = l.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, A0);
    };
  }
}, B0 = /* @__PURE__ */ Y(I0, [["__scopeId", "data-v-226ac6c8"]]), L0 = 24, N0 = 8, _4 = 420;
function E4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= L0 ? !0 : e < t && s > N0 ? !1 : null;
}
const D0 = (e, t) => e === void 0 ? t : e, j0 = { me: 1, people: [] }, Un = Zn({
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
  people: j0,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: jn("journal.activity", !0),
  wide: !1,
  sideMini: jn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
jl("journal.activity", () => Un.activity);
jl("journal.side.mini", () => Un.sideMini);
const Sr = "journal.viewer.";
function P0(e, t, n) {
  try {
    const a = n.getItem(Sr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function q0(e, t, n) {
  try {
    n.setItem(Sr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Ro(e, t, n = window.localStorage) {
  const a = I(P0(e, t, n));
  return fe(a, (s) => q0(e, s, n), { deep: !0 }), a;
}
const F0 = {
  key: "dock-all",
  class: "dock-all"
}, W0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, H0 = { class: "dock-runs-title" }, U0 = { class: "dock-runs-chips" }, z0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var w, p;
    const t = e, n = hg(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), l = Oe(Ne), r = I(/* @__PURE__ */ new Set()), i = I({});
    async function u(S, x) {
      i.value = { ...i.value, [S.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, S.id]);
      const C = await cn(x, { id: S.target_id }, l.environment);
      (C == null ? void 0 : C.ok) === !1 && (r.value = new Set([...r.value].filter((N) => N !== S.id)), i.value = { ...i.value, [S.id]: `Could not close this card: ${C.error}` });
    }
    const d = R(
      () => u0(
        t.items.filter((S) => !r.value.has(S.id)),
        n.value,
        a.value
      )
    ), f = R(
      () => d0(
        d.value.filter((S) => Ma(S, zt)),
        n.value
      )
    ), m = R(() => d.value.filter((S) => !f.value.includes(S) && !Ma(S, zt))), g = R(() => f.value.filter((S) => !wt(S))), v = Ro(`dock-size:${((w = Un.identity) == null ? void 0 : w.root) || location.host}`, null), _ = (S) => v.value ? v.value.collapsed && !v.value.opened.includes(S.id) : t.collapsed, E = R(() => d.value.some(_)), T = R(() => (s.value = f0(f.value.length, s.value, g.value.length)) && !o.value && !d.value.some(_));
    function W() {
      v.value = { collapsed: !E.value, opened: [] };
    }
    function J(S) {
      var C;
      if (!_(S)) return;
      const x = (C = v.value) != null && C.collapsed ? v.value.opened : [];
      v.value = { collapsed: !0, opened: [...x, S.id] };
    }
    const D = Ro(`dock-folded:${((p = Un.identity) == null ? void 0 : p.root) || location.host}`, {}), B = (S) => {
      var x;
      return !!((x = zt(S.type)) != null && x.folds) && D0(D.value[S.id], Ma(S, zt) || t.folded);
    };
    function q(S) {
      D.value = { ...D.value, [S.id]: !B(S) };
    }
    function A(S) {
      D.value = { ...D.value, ...Object.fromEntries(f.value.map((x) => [x.id, x.id !== S.id])) }, o.value = !0;
    }
    function M() {
      D.value = Object.fromEntries(Object.entries(D.value).filter(([S]) => !f.value.some((x) => String(x.id) === S))), o.value = !1;
    }
    function b(S) {
      a.value = /* @__PURE__ */ new Set([...a.value, S.id]);
    }
    function k(S) {
      a.value = new Set([...a.value].filter((x) => x !== S.id));
    }
    return (S, x) => (c(), H(nl, {
      tag: "div",
      name: "dock",
      duration: P(kr),
      class: "dock-stack"
    }, {
      default: j(() => [
        d.value.length > 1 ? (c(), h("div", F0, [
          L(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": E.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: j(() => [
              L(xt, {
                open: !E.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : O("", !0),
        (c(!0), h(z, null, te(m.value, (C) => (c(), H(To, {
          key: C.id,
          item: C,
          class: Z({ timed: P(wt)(C) }),
          leaving: P(wt)(C) && !a.value.has(C.id),
          folded: B(C),
          collapsed: _(C),
          refusal: i.value[C.id],
          onOpen: (N) => J(C),
          onFold: (N) => q(C),
          onUndock: (N) => u(C, N),
          onMouseenter: (N) => b(C),
          onMouseleave: (N) => k(C)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !E.value ? (c(), h("div", W0, [
          y("span", null, $(f.value.length) + " runs", 1),
          L(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: M
          }, {
            default: j(() => [
              x[1] || (x[1] = ee(" Runs ", -1)),
              L(xt, { open: "" })
            ]),
            _: 1
          })
        ])) : O("", !0),
        (c(!0), h(z, null, te(T.value ? [] : f.value, (C) => (c(), H(To, {
          key: C.id,
          item: C,
          class: Z({ timed: P(wt)(C) }),
          leaving: P(wt)(C) && !a.value.has(C.id),
          folded: B(C),
          collapsed: _(C),
          refusal: i.value[C.id],
          onOpen: (N) => J(C),
          onFold: (N) => q(C),
          onUndock: (N) => u(C, N),
          onMouseenter: (N) => b(C),
          onMouseleave: (N) => k(C)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        T.value ? (c(), H($r, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            L(ye, {
              name: "runs",
              size: 14
            }),
            y("span", H0, $(f.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            y("span", U0, [
              (c(!0), h(z, null, te(f.value, (C) => (c(), H(B0, {
                key: C.id,
                item: C,
                onClick: (N) => A(C)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            L(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: x[0] || (x[0] = (C) => o.value = !0)
            }, {
              default: j(() => [
                x[2] || (x[2] = ee(" Runs ", -1)),
                L(xt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : O("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, A4 = /* @__PURE__ */ Y(z0, [["__scopeId", "data-v-d078676b"]]), $t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, In = (e) => Math.min(Math.max(e, 0), 1), V0 = (e) => {
  const t = In(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => V0((e - t) / (n - t));
function C4(e) {
  const t = In(e), n = In((t - 0.12) / 0.76) * $t.shuffles, a = Math.min(Math.floor(n), $t.shuffles - 1), s = n - a, o = gt(s, 0.26, 0.38) * (1 - gt(s, 0.76, 0.96)), l = gt(s, 0.38, 0.76), r = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), i = gt(s, 0.2, 0.34) * (1 - gt(s, 0.84, 1)), u = Math.sin(Math.PI * In((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / $t.shuffles, lift: $t.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function O4(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Io = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, T4 = (e) => Io[e] ?? Io.butler, Os = 2400, G0 = 0.05;
function K0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, G0), l = Math.min(t + Os * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function R4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function Y0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function I4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const B4 = (e, t) => ({ ...e, stretch: t.stretch }), L4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, _r = (e, t) => t >= (e.least ?? 0);
function N4(e, t, n) {
  if (!_r(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const D4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), J0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Bo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Z0 = (e) => e.right > e.left && e.bottom > e.top;
function j4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(J0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Bo(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Bo(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), Z0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
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
        const v = (o[f] - e[d]) / g, _ = (o[m] - e[d]) / g;
        l = Math.max(l, Math.min(v, _)), r = Math.min(r, Math.max(v, _));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, u = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), X0 = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => X0(tn(e, t, n)), Q0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, _n = ([e, t], n) => e + n() * (t - e);
function ey(e) {
  return Q0.map(() => {
    const t = _n(it.speed, e), n = _n(it.angle, e) * Math.PI / 180, a = _n(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [_n(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const ty = ey(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function ny(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function P4(e, t, n = ty) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = ny(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= it.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const q4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function F4(e, t) {
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
const W4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function H4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function U4(e, t, n) {
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
function z4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = K0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function V4(e) {
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
function ay(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = Y0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function G4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = ay(n, e.length), u = e.map((T, W) => ({ ...ss(T, t, Math.min(n / o.fps, Bn(W).shot)), shot: W < i })), d = Ee(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], g = e.map((T, W) => ({ bug: T, index: W, seconds: n / o.fps - Bn(W).shot, spot: ss(T, t, Bn(W).shot) })).filter((T) => T.seconds >= 0), v = g.flatMap((T) => {
    const W = (s == null ? void 0 : s.get(T.index)) ?? iy(T.bug, t, T.spot, s ? [] : a);
    return s == null || s.set(T.index, W), s && cy(W, T.seconds, a), uy(W, T.seconds, a);
  }), _ = g.filter((T) => ly(T.bug)).map((T) => ({ seconds: T.seconds, from: T.spot })), E = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: E }, slush: v, camera: _ };
}
function Bn(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function K4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = Bn(d), m = ss(u, t, f.shot), g = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), v = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), _ = Math.abs(m.x - i) >= g ? i : m.x + v * g, E = v > 0 ? Math.max(i, Math.min(_, r)) : Math.min(i, Math.max(_, l)), T = { from: i, to: E, begin: f.walk, end: f.aim };
    return i = E, T;
  });
}
function Y4(e, t, n) {
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
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, sy = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function oy(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const ly = (e) => e.along * 97 % 1 < xe.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function ry(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += xe.step) {
    const d = Math.min(u + xe.step, l.t), f = nn(e, d), m = Er(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function iy(e, t, n, a = []) {
  const s = oy(e.along + 1), [o, l] = sy[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: xe.count }, () => {
    const i = r + (s() - 0.5) * 2 * (xe.spread * Math.PI / 180), u = xe.speed[0] + s() * (xe.speed[1] - xe.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: xe.radius[0] + s() * (xe.radius[1] - xe.radius[0]) };
    return { ...d, ...ry(d, t, a) };
  });
}
function cy(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += xe.step) {
      const l = Math.min(o + xe.step, s), r = Er(nn(a, o), nn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function uy(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...nn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - xe.hold) / xe.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, u = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function J4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, u]), m = Ee(e, [u, u + d]);
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
function Z4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (_) => {
    const [E, T] = [_.x - e.at.x, _.y - e.at.y];
    return { x: r.x + E * u - T * d, y: r.y + E * d + T * u };
  }, [m, g] = [...n].sort((_, E) => _.x - E.x), v = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: v.map((_, E) => ({ from: _, to: E < v.length / 2 ? m : g })) };
}
const X4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function zn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Q4(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = zn(n, t), l = 1 - (1 - n.small) * Ee(a, n.shrinks) * (1 - Ee(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = zn(n, t), o = n.flat * Ee(a, n.squashes) * (1 - Ee(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * tn(s, ...n.springs)) * (1 - tn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const e$ = (e) => e === "pack_box";
function t$(e) {
  const { into: t, out: n } = zn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function n$(e) {
  const t = _e.rope_swing, { into: n, out: a } = zn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const dy = { after: 3 }, Ts = 10, fy = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, hy = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, my = { weight: 19 }, Ar = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, py = { every: 120 }, Cr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Or = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, gy = {
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
}, dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Ts }), ae = (e, t, n = {}) => dn(e, "clip", t, n), Sa = (e, t, n = {}) => dn(e, "look", t, n), Lo = (e, t, n = {}) => dn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...dn(e, "pick", t, n), ...a }), we = (e) => dn("nothing", "nothing", e, {}), vy = 120, yy = 300, _a = (e, t) => ({ ...ae(e, t), cooldown: yy }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), by = () => [ae("joy", 2)], vt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), yt = (e) => ({ ...e, cooldown: fy[e.name] }), Ht = (e) => ({ ...e, shenanigan: !0, lasts: hy[e.name] }), aa = [
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
  ...re("reported", { cooldown: 90 }, [Lo("read", 3), ae("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [Lo("read", 3), we(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), we(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, by()),
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
  ...re("answered", { cooldown: 15 }, [Sa("amused", 3), we(2)]),
  ...re("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ae("stumble", 3), we(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), we(13)]),
  ...re("typing", { cooldown: 60 }, [Sa("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(gy).flatMap(([e, t]) => re(`reacted:${e}`, {}, [Sa(t, 1)])),
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
    { ...Ht(yt(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Ht(yt(ae("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...re("held:search", { cooldown: vy }, [_a("search", 3), { ..._a("binoculars", 2), when: { home: !0 } }, { ..._a("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...re("jump", {}, [Ht(yt(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...re("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...re("unit", { cooldown: Ar.build.cooldown }, [pe("unit", my.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: py.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...re("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...re("roam", {}, [
    pe("rest", 35, {}, { stay: [25, 60] }),
    pe("seat", 15, {}, { stay: [15, 40] }),
    pe("edge", 25, {}, { stay: [8, 20] }),
    Ht(pe("bubble", 15, {}, { stay: [30, 80] })),
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
    Ht(yt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], Tr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Rr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), wy = (e) => Array.isArray(e) ? e[0] : e, ky = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, $y = (e) => aa.some((t) => t.when.moment === e);
function xy(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Rr(d).every(([f, m]) => n(f) >= wy(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = aa.filter((d) => Tr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= dy.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function ze(e, t) {
  const n = xy(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Ir(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ir(e, t, n) {
  var a;
  for (const [s, o] of Rr(t)) (a = e.memory) == null || a.set(s, e.now + ky(o, n));
}
function a$(e, t, n) {
  Ir(e, aa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const s$ = (e) => Object.values(Ar).find((t) => Tr(t.when, e)) ?? null, My = (e, t, n) => n - t <= (e.lifetime ?? Ts), o$ = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || _r(e.clip, t));
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
}, l$ = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Lr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), r$ = {
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
}, i$ = 120, Sy = 20, c$ = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Sy), _y = (e) => os[e] || os.idle, u$ = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Nr = "airborne", Ey = "landing", Ay = "travelling", Dr = "grounded", d$ = ({ airborne: e, landing: t, trip: n }) => e ? Nr : t ? Ey : n != null && n.started ? Ay : Dr;
function f$(e, t) {
  var s;
  const n = Cy(e, t);
  return e.mode === Dr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function Cy(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Nr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Oy(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const g = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : _y(u), facing: g ? m : r.posture === "sit" ? r.face : f };
}
function Oy(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ls = (e) => e.outcome, Ty = "plugin:code-commandments:sins:", No = (e) => e.type === "plugins.card" && e.markKey.startsWith(Ty), Ry = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => No(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => No(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], h$ = (e, t) => e.filter((n) => n.author === "user" && Wn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Wn(n.read_at), card: Ql(n) })).sort((n, a) => n.time - a.time), Do = { user: "reacted", agent: "agent_reacted" };
function m$(e, t) {
  return e.filter((n) => Do[n.author] && St(n) > t).map((n) => ({ beat: `${Do[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Iy = [.../* @__PURE__ */ new Set([...Object.values(Cr).flatMap((e) => Object.keys(e)), ...Object.keys(Or)])];
function p$(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Iy.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: Ql(n) })).sort((n, a) => n.time - a.time);
}
const By = (e) => new Br(e).isTest(), Vn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ls(e)] || "";
}, Ly = 1800, Ny = (e, t) => {
  if (Vn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Vn(n) !== "finished" && Number(e.time) - Number(n.time) <= Ly ? "tests_fixed" : "tests_passed";
};
function g$(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(By), s = a.filter((r) => Vn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Vn(r))), o.map((r) => ({ beat: Ny(r, s), time: Number(r.time), card: r.key }));
}
function v$(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ls(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ls(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const y$ = (e) => e.map((t) => {
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
function b$(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function w$(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function k$(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = Ry.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Rs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const jo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Dy(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Rs(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function $$(e, t, n, a = {}) {
  const s = ze({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : $y(`held:${e}`) ? "idle" : e;
}
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function x$(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Te.ahead * n ? 180 : Math.sign(a) * Te.turn;
}
const Po = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function M$(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * a) / Te.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Te.sweep) % s, r = o % Te.sweep, i = Te.sweep - Te.returnSeconds, u = Po((r - i) / Te.returnSeconds), d = r <= i ? Po(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const qo = 3, jr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Fo = 12, S$ = (e, t) => ({ mood: e, began: t, seen: 0 });
function _$(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!jr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= qo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Fo) / Fo, lasts: qo } };
}
const E$ = (e) => e.posture === "hang" && !jr(e.face), jy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Py = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function A$(e, t, n) {
  return jy.has(e) ? 1 / 0 : !Py.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Pr(n - t.began, t.share) - et.lead, 0);
}
const qy = 5;
function C$(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= qy ? { beat: "long_walk", time: n } : null };
}
const Fy = 30, En = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function O$(e, t, n, a, s = null) {
  if (t && n < t.until || !En.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = ze({ moment: "spell", state: e, tally: s }, a), [l, r] = En.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + En.every } : { state: e, began: 0, until: 0, next: n + En.every };
}
const T$ = (e, t, n) => t && n < t.until && Lr.has(e.state) ? { state: t.state, since: t.began } : e, et = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Pr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function R$(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Pr(o, e.share);
  return s ? { eager: Wy(t, l), moment: null } : l > et.lead ? { eager: t, moment: null } : l < et.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > et.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < et.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = ze({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Wy(e, t) {
  return e.on && t > et.lead + et.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= et.lead && t >= et.least ? { ...e, on: !0, calm: !1 } : e;
}
const Hy = 1, Uy = { look: "look", gaze: "gaze" };
function zy(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = ze({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Uy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const Vy = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => ze({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Gy = (e, t, n, a, s, o = 0) => ze({ moment: "jump", high: e > Hy * t, memory: a, now: s, room: o }, n).name === "backflip", Ky = { work: ["building"], idle: ["standing"] };
function I$(e, t, n, a) {
  const s = os[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Ky[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Lr.has(e) ? { moments: o, began: n || a } : (n && a - n >= Fy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Yy(e, t, n) {
  return !ze({ moment: "pondering", memory: e, now: t }, n) || !ze({ moment: "thought_cloud", memory: e, now: t }, n) ? null : ze({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Wo = { pondering: Yy };
function B$(e, t, n, a, s, o) {
  if (Wo[e.beat]) {
    const r = Wo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = zy(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Ts && { lifetime: l.lifetime } } } : null;
}
function L$(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = Vy(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const N$ = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function D$(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function j$(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const P$ = (e, t) => !!(e != null && e.watches) && !t.once, q$ = 10, F$ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || My(a, a.queuedAt, n)), W$ = (e, t) => t ? null : e[0] ?? null;
function H$(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const U$ = (e, t) => !t.during || !e.some((n) => n.during === t.during), Jy = 2 * Math.PI, Zy = 500;
function z$(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Zy, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Jy * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, _ = (u ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !i ? s && !t.behind && !g.behind ? Qy(g, t, n, m, s) : tb(g, t, n, m) : t) ?? g, E = _ != null && _.behind && _.mood === "reading" ? Xy(e.point, _, n, l, s) : _;
  return { point: E ?? null, toward: E ? { x: E.x - n.x, y: E.y - n.y } : null, amount: f, at: a };
}
function Xy(e, t, n, a, s) {
  const o = (b) => b * 180 / Math.PI, l = (b) => o(Math.atan2(Math.sin(b * Math.PI / 180), Math.cos(b * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, g = f ? e.readingYaw + m : d, v = g + l(u - g), _ = Math.min(Math.max(a / 1e3, 0), 0.1), E = Te.turnSpeed * _, T = f ? g + Math.min(Math.max(v - g, -E), E) : v, W = f ? e.readingFollow + m : T, J = W + (T - W) * (1 - Math.exp(-_ / Te.followSeconds)), D = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, B = o(Rs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), q = Math.min(Math.max(B, -D.up), D.down), A = Te.tipSpeed * _, M = f ? e.readingPitch + Math.min(Math.max(q - e.readingPitch, -A), A) : q;
  return { ...t, readingYaw: T, readingFollow: J, readingPitch: M, readingFacing: r };
}
function Qy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (W) => {
    const { yaw: J, pitch: D } = Rs(W.x - n.x, s, n.y - W.y, o);
    return { yaw: J, pitch: Math.min(Math.max(D, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [jo(r(e)), jo(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, g] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [v, _, E] = i.map((W, J) => m * W + g * u[J]), T = s * v / _;
  return { ...t, x: n.x + T, y: n.y - Dy(T, s, -Math.asin(Math.min(Math.max(E, -1), 1)), o) };
}
const eb = 0.15;
function V$(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= eb;
}
function tb(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const nb = (e) => !(e != null && e.on);
function G$(e, t, n) {
  if (nb(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ze = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ea = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ho = (e) => e * e * (3 - 2 * e);
function ab(e) {
  if (e < 0 || e >= Ze.seconds) return null;
  const t = Ea(e, ...Ze.flicker), n = Math.floor(t * Ze.flickers * 2) % 2 === 0, a = e < Ze.flicker[1] ? n ? 0.35 + 0.5 * t : Ze.dim : 1;
  return { strength: 1 - Ho(Ea(e, ...Ze.fade)), lit: a, white: e < Ze.flash[0] ? 0 : 1 - Ho(Ea(e, ...Ze.flash)) };
}
const K$ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Y$(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = ab(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ze.signs[e.tone], ...a } };
}
function J$(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function Z$(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function X$(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, Q$ = { behind: 39, figure: 40, ahead: 41 }, sb = "[data-figure-pile]", ob = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, Ln = { phases: 4, ms: 230, dim: 0.25 }, ex = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, tx = (e) => e === "amber" ? Ln.phases : 1;
function nx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const ax = Object.keys(ob), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Vt = ([e, t], n) => e + n() * (t - e);
function sx(e) {
  const t = Ve.least + Math.floor(e() * (Ve.most - Ve.least + 1));
  return Array.from({ length: Math.min(t, Ve.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ve.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Vt(Ve.start, e), l = Vt(Ve.reach, e);
    return {
      text: ze({ moment: "digit" }, e).name,
      x: a * o,
      y: Ve.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Vt(Ve.moveMs, e)),
      fadeMs: Math.round(Vt(Ve.fadeMs, e))
    };
  });
}
const Aa = { high: 3, gap: 1 };
function ox(e) {
  const t = Math.floor(e / Aa.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + Aa.gap)), up: e % Aa.high * (rt.height - rt.top) };
}
const lb = (e, t, n) => ze({ moment: "unit", memory: e, now: t }, n) !== null, rb = { after: 5 }, ib = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Br(t).isBuild());
function lx(e, t, n) {
  const a = ib(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= rb.after ? s : null;
}
function rx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: lb(n, a, s) } : null;
}
const Uo = { ahead: 140, up: 70 };
function ix(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Uo.ahead, y: a - Uo.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ca = { least: 4e3, most: 1e4 }, cb = (e) => Ca.least + e() * (Ca.most - Ca.least), bt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function cx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = cb(t);
    if (n.length >= bt.most || t() >= bt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (bt.at[0] + t() * (bt.at[1] - bt.at[0]));
    n.push({ from: o, to: o + bt.ms }), a = o + bt.ms;
  }
}
const ux = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), dx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), qr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), fx = new Set(aa.filter((e) => qr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), ub = (e) => e.some((t) => t.state === "built"), hx = (e, t) => ub(t) ? e.filter((n) => !qr.has(n.beat)) : e, ut = { reach: 40, room: 6 }, db = (e, t) => t <= e - ut.reach + 2, mx = (e, t, n) => db(e, n) ? t - ut.reach : e - ut.reach - ut.room, px = (e, t, n, a) => a > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, Oa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, gx = (e) => Vt(e() < Oa.longShare ? Oa.long : Oa.short, e), fb = 2 * rt.width;
function vx(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= fb ? o : e + (o - e + s / 2) % s;
}
const hb = 60, yx = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= hb, zo = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(zo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(zo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, mb = "[data-figure-docked-bars]", pb = "[data-figure-chat-foot]", gb = [0.85, 0.6, 0.35, 0.15], vb = ["question", "waiting", "suggestion"], bx = (e, t) => vb.find((n) => e[n] > 0 && t[n] === "behind") || null;
function wx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const yb = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", bb = "[data-figure-newest]";
function Fr() {
  var a, s;
  const e = (a = fn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(bb), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Is(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function sn(e, t, n = Fr()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = oa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ce.top * t.size, bottom: a.top + Ce.bottom * t.size }, l = $t.gap;
  return !sa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function kx(e, t, n, a = Fr()) {
  if (!a || sn(t, e, a)) return null;
  const s = oa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Ls * e.size : Yr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - $t.gap - l, a.right + $t.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && sn(m, e, a) && Kb(m, e)).sort((m, g) => Math.abs(m.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Ta = 0.26, Wr = 0.54, wb = 1.25 / 5.4, hn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ta, travels: "stand" },
  lounge: { drop: Ta, travels: "stand" },
  composed: { drop: Ta, travels: "stand" },
  hang: { drop: Wr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, $x = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * wb * Math.cos(t * Math.PI / 180),
  y: 1 - n - Wr
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), kb = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), xx = (e, t) => (e === "sit" ? kb.has(t) : Yt.has(e)) ? e : "stand";
function Mx(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const Sx = 0.25, _x = (e, t) => Yt.has(e) && hn[t].drop === 0, Hr = 2, $b = 90, xb = 180, Mb = 140, Sb = 280, _b = 420, Eb = 0.25, Ab = 290, Cb = 600, Ob = "cubic-bezier(0.2, 0.7, 0.4, 1)", Tb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ra = 5;
function Gn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ra) return null;
  (l || r) && (o = Math.max(o, Hr));
  const g = o > 1, v = Math.abs(t.x - e.x), _ = v < Ra ? 0 : v / ($b * o) * 1e3, E = Math.min(_, g ? Mb : xb), T = Math.abs(t.y - e.y), W = t.y < e.y, J = W && !m && Gy(T, n, i, u, d, f), D = W ? _b + Math.min(T, 400) * Eb : Math.sqrt(2 * T / Os) * 1e3, B = {
    x: t.x,
    y: t.y,
    ms: T > Ra ? J ? Cb : D : 0,
    lead: J ? Ab : W ? Sb : 0,
    easing: W ? Ob : Tb,
    hopping: !0,
    clip: J ? "backflip" : W ? "jump" : "fall"
  }, q = { x: t.x, y: t.y, ms: _ + E, lead: 0, easing: "linear", ramp: E, ...g ? { clip: "run" } : {} }, A = m ? Rb(t, n) : B, M = W && !a ? [{ ...q, y: e.y }, A] : [{ ...B, x: e.x }, q];
  return { way: Math.sign(t.x - e.x) || 1, legs: M, lands: !s, pace: o, running: g };
}
const Rb = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Ib = (e, t) => e.postures.includes(t) ? t : e.postures[0], Ex = (e, t, n) => e.posture === "walk" && n ? "walk" : Ib(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - hn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, sa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Is = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const An = 0.5, Vo = 20;
function Ax(e, t, n = At()) {
  const a = at(e, t);
  return a.left >= n.left + Vo && a.right <= n.right - Vo;
}
function Bs(e, t, n = At()) {
  const a = at(e, t), s = a.right - a.left, o = oa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - An && r <= n.right + An && a.top >= n.top - An && i <= n.bottom + An;
}
const Kn = [0.35, 0.5, 0.65], Yn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Kn[0], right: Kn.at(-1), top: Yn[0], bottom: Yn.at(-1) }, Bb = 0.24;
function oa(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Bb * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Lb(e, { size: t }, n = At()) {
  const a = oa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Ls = (Ce.right - Ce.left) / 2 + 0.08;
function Cx(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - hn[e].drop) };
}
const Nb = "[data-figure-agent]";
function Ur(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Is(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const zr = (e) => Yn.flatMap(
  (t) => Kn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ns(e, t, n = "") {
  if (!sn(e, t)) return Kn.length * Yn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(yb)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && sa(s, i) && Is(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return zr(s).filter(([r, i]) => l(r, i) || Ur(r, i, n)).length;
}
function Db(e, t) {
  const n = at(e, t);
  return zr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Ur(a, s, "", Nb)).length;
}
const Go = 4;
function Ox(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Go; o <= s; o += Go)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Db(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Bs(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Ns(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Vr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), jb = [0.5, 0.25, 0.75], Pb = (e) => Vr(e.getBoundingClientRect(), jb), Gr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, qb = Ls, Fb = (e, t, { size: n }, a = qb) => Kr(e, Gr[t], a * n, "stand");
function Kr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Wb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Yr = 0.1, Hb = (e, t, { size: n }) => Kr(e, Wb[t], Yr * n, "sit"), Ub = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ia = 60;
function Tx(e, t) {
  const n = Ub(t);
  return !e.aside || Math.abs(n) >= Ia ? t : n < 0 ? 360 - Ia : Ia;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, zb = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function Rx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = zb(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? Vb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Vb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function Ix(e, t) {
  const { element: n, edge: a } = la(), s = ["left", "right"].map((r) => mn(Hb(a, r, e), e)).filter((r) => n && Bs(r, e) && !Ns(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function Bx(e, t, { size: n }) {
  const a = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Jr } : e;
}
const Jr = 7;
function Zr() {
  const e = [...document.querySelectorAll(sb)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Gb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Ce.left * a, right: n.left + Ce.right * a, top: n.top + Ce.top * a, bottom: n.bottom };
}
function Kb(e, t) {
  const n = Zr();
  return !n || !sa(Gb(e, t), n);
}
const Yb = 4;
function la() {
  const e = pn(), t = Zr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Yb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Jr - n, 0) } };
}
const Lx = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = hn[e.posture].drop * a;
  return { ...Lb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const rs = (e, t) => Object.keys(Gr).map((n) => mn(Fb(e, n, t), t)), Ds = (e, t) => Vr(e, gb).map((n) => mn(n, t)), Xr = (e, t, n) => on(e, t, n) ?? e[0];
function Nx(e, t) {
  const { element: n, edge: a } = la();
  return { ...Xr(rs(a, e), e, t), view: null, on: n };
}
function Dx(e, t, n, a) {
  const { element: s, edge: o } = la(), l = (a ? rs(o, t) : [...rs(o, t), ...Ds(o, t)]).filter(
    (u) => !sa(at(u, t), e)
  ), r = on(
    l.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Ns(r, t) ? r : on(l, t, n);
  return i && { ...i, view: null, on: s };
}
function pn() {
  var a;
  const e = fn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(mb);
  if (!t) return { ...ra(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Ko = { within: 2 };
function jx(e) {
  const { element: t, docked: n, edge: a } = pn();
  if (!n || e.on !== t) return !0;
  const s = ra().edge;
  return a.left > s.left + Ko.within || a.left + a.width < s.left + s.width - Ko.within;
}
const Jb = "[data-figure-closing]";
function Px() {
  var n;
  const { element: e, docked: t } = pn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Jb));
}
const Qr = "[data-figure-progress]";
function qx(e) {
  const t = e.querySelector(Qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Fx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Zb = { across: 300, above: 380, below: 60 };
function Wx(e) {
  const { across: t, above: n, below: a } = Zb;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Xb(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Xb = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ei = "[data-figure-bar]", is = { back: 144, along: 0.4 };
function Hx(e) {
  const { element: t, docked: n, edge: a } = pn(), s = n ? t.querySelector(ei) : null;
  if (!(s != null && s.querySelector(Qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...mn({ x: o - is.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Ux(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < is.along * a.size ? t.x + is.along * a.size : e.x, y: e.y, behind: !0 };
}
function zx(e) {
  const t = e.querySelector(ei), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ra() {
  const e = fn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function Vx(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = ra(), i = n === null ? Qb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : mn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Qb(e, t, n, a, s) {
  const o = Ds(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - ut.reach - ut.room >= l);
  return on(r.length ? r : o, t, n);
}
const ew = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function Gx(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Hr));
  const g = (J) => {
    const D = at(J, n, hn[J.posture].travels);
    return { x: D.left, y: D.top };
  }, v = t.ladder ?? e.ladder;
  if (v && !(t.ladder && e.ladder)) return tw(g(e), g(t), g({ ...v.foot, posture: "stand" }), v.way, !!t.ladder, n, s);
  const [_, ...E] = [e, ...i, t].map(g), T = Gn(_, E[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), W = E.slice(1).map((J, D) => {
    var B;
    return (B = Gn(E[D], J, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : B.legs.find((q) => q.hopping);
  });
  return T && { ...T, legs: [...T.legs, ...W.filter(Boolean)] };
}
function tw(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / ew.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Gn(e, n, o.size, { pace: l }) : Gn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function Kx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function Yx(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(Pb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = la();
  return { ...Xr(Ds(s, t), t, n), view: null, on: a };
}
const nw = "[data-figure-bubble]", aw = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ti = 0;
const Ft = () => Zt, Ba = /* @__PURE__ */ new WeakMap();
let sw = 0;
function js(e) {
  return Ba.has(e) || Ba.set(e, `floor-${++sw}`), Ba.get(e);
}
const ow = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, lw = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function rw(e, t) {
  var a;
  const n = (a = e.querySelector(pb)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function iw(e, t) {
  const n = e && rw(e, t), a = e ? [...e.querySelectorAll(nw)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || ow(l, n))).map(({ element: o, type: l, box: r }) => ({ id: js(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const cw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= aw ? (t.top - a.top) / s * 1e3 : 0;
};
function ni(e = Zt, t = performance.now()) {
  const n = At(), a = lw(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = pn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = ra();
  return u.element && i.push({ id: js(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...iw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: cw(e, d, t) }))) });
}
const cs = /* @__PURE__ */ new Set();
function uw(e) {
  return cs.add(e), () => cs.delete(e);
}
function dw() {
  ai();
  const e = () => {
    ti = requestAnimationFrame(e), !document.hidden && (Zt = ni(Zt), cs.forEach((t) => t(Zt)));
  };
  e();
}
function ai() {
  cancelAnimationFrame(ti);
}
const Ps = 5, fw = 56, hw = { share: 0.6 }, mw = (e) => -Math.sqrt(2 * Os * hw.share * e), Dt = (e, t) => e.find((n) => n.id === t) ?? null;
function Jx(e, t = ni().floors) {
  const n = Dt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : js(e.on) : null, o = s && Dt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function si({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Ft().floors) {
  const u = Dt(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || pw(u, d, o)) && gw(d, r, i) ? { x: d.x, y: d.y } : null;
}
const qs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, pw = (e, t, n) => !qs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function Zx(e, t = Ft().floors) {
  if (!qs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ps && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function gw(e, t, n = Ft().floors) {
  const a = Dt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Bs(e, t);
}
function Xx(e, t, n, a = Ft().floors) {
  const s = si(e, n, a);
  if (!e.home) return vw(e, t, s, a);
  if (!s) return null;
  const o = Dt(a, "home"), l = s.y - t.y, r = l > Ps ? "dropping" : -l > fw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function vw(e, t, n, a) {
  const s = n ? Dt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: mw(e.risen) };
  if (!n) return null;
  if (qs(t) && n.y - t.y > Ps) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function Qx(e, t, n) {
  const a = Ls * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function e8(e, t, n, a = Ft().floors) {
  const s = t && si(t, n, a);
  return s ? { ...e, ...s } : e;
}
const yw = ["data-type"], bw = { class: "figure-floor-name" }, ww = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      y("span", bw, $(e.floor.type), 1)
    ], 12, yw));
  }
}, kw = /* @__PURE__ */ Y(ww, [["__scopeId", "data-v-4e0f1e2e"]]), $w = {
  class: "figure-floors",
  "aria-hidden": "true"
}, xw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(Ft().floors);
    let n = () => {
    };
    return Re(() => {
      n = uw((a) => t.value = a.floors), dw();
    }), Be(() => {
      n(), ai();
    }), (a, s) => (c(), h("div", $w, [
      (c(!0), h(z, null, te(t.value, (o) => (c(), H(kw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, t8 = /* @__PURE__ */ Y(xw, [["__scopeId", "data-v-e519168b"]]), La = (e) => typeof e == "number" ? e : Date.parse(e);
function n8(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: La(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => La(s.row.created_at) - La(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Mw = 3, Na = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Sw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Na[n.grouping]) == null ? void 0 : a.call(Na, e.row, n)) || "";
}
function _w(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function a8(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Mw ? [_w(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = Sw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const Ew = 1e3;
function Aw() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), Ew);
  return ft(() => clearInterval(t)), e;
}
const Cw = ["datetime", "title"], ia = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Aw(), a = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, $(P(cr)(e.at, P(n))), 9, Cw));
  }
};
function s8(e) {
  const t = We(), n = t.option("row"), a = I(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), fe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Ow(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const o8 = (e) => (t) => t.filter((n) => n.id !== e), l8 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), r8 = (e) => (t) => [...t, e], i8 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function c8(e, t = {}) {
  const n = We(), a = I(null), s = I("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function u8(e) {
  const t = We(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Cn = /* @__PURE__ */ new Map();
function Tw(e, t) {
  if (Cn.has(e)) return Cn.get(e);
  const n = t().finally(() => Cn.delete(e));
  return Cn.set(e, n), n;
}
function d8() {
  const e = We(), t = I(null), n = I("");
  async function a() {
    const s = await Tw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Rw = { class: "cards-page" }, Iw = { class: "cards-bar" }, Bw = { class: "cards-count" }, Lw = { class: "cards" }, Nw = {
  key: 1,
  class: "cards-note"
}, Dw = {
  key: 2,
  class: "cards-note"
}, jw = ["data-row", "onClick"], Pw = { class: "card-head" }, qw = { class: "card-title" }, Fw = { class: "card-foot" }, Ww = {
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
    return (a, s) => (c(), h("div", Rw, [
      y("div", Iw, [
        y("span", Bw, $(e.rows.length) + " " + $(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        L(de, Le({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            L(ye, {
              name: "plus",
              size: 12
            }),
            ee(" New " + $(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      y("div", Lw, [
        e.loaded ? e.failure ? (c(), h("p", Nw, $(e.failure), 1)) : e.rows.length ? O("", !0) : (c(), h("p", Dw, "No " + $(e.noun) + "s yet", 1)) : (c(), H(_t, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(z, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          y("span", Pw, [
            L(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ee(" " + $(e.head(o)), 1),
            L(ia, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          y("span", qw, $(e.title(o)), 1),
          y("span", Fw, $(e.foot(o)), 1)
        ], 8, jw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, f8 = /* @__PURE__ */ Y(Ww, [["__scopeId", "data-v-990e6b37"]]), Yo = "newest";
function h8(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = Oe(Ne, null)) == null ? void 0 : u.search, s = I(""), o = I(Yo), l = I("all"), r = R(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => Ow(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Yo ? f : [...f].sort((m, g) => t(m).localeCompare(t(g)));
  }), i = R(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Hw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Uw = 40, zw = "top", Vw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(Ne, null)) == null ? void 0 : f.autoScroll, s = R(() => a === zw), o = I(null), l = I(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= Uw;
    }
    return fe(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, g) => (c(), h("div", Hw, [
      y("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      L(jt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: j(() => [
          Ye(y("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            L(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            g[0] || (g[0] = ee(" Newest ", -1))
          ], 512), [
            [ol, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, m8 = /* @__PURE__ */ Y(Vw, [["__scopeId", "data-v-3accb764"]]), Gw = ["aria-selected", "data-tab", "onClick"], Kw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Yw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(Ne, null), o = R(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = I(null), r = I({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var v;
      const g = (v = l.value) == null ? void 0 : v.querySelector(".inner-tab.on");
      if (!g) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: g.offsetLeft, width: g.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const d = () => mt(() => u(!0));
    let f = null;
    return Re(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), fe(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), fe(() => n.answer, d, { deep: !0 }), (m, g) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(z, null, te(o.value, (v) => {
        var _, E;
        return c(), h("button", {
          key: v.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((_ = e.active) == null ? void 0 : _.key) === v.key }]),
          "aria-selected": ((E = e.active) == null ? void 0 : E.key) === v.key,
          "data-tab": v.key,
          onClick: (T) => a("choose", v)
        }, [
          ee($(v.label) + " ", 1),
          i(v) ? (c(), h("span", Kw, $(e.answer[v.count_field]), 1)) : O("", !0)
        ], 10, Gw);
      }), 128)),
      y("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, p8 = /* @__PURE__ */ Y(Yw, [["__scopeId", "data-v-63fcd326"]]), Jw = {
  class: "tab-body",
  "data-tab-body": ""
}, Zw = { "data-tab-content": "" }, Xw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = I(!1);
    let a = 0;
    return fe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ps(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", Jw, [
      n.value ? (c(), H(_t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : O("", !0),
      Ye(y("div", Zw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [ol, !n.value]
      ])
    ]));
  }
}, g8 = /* @__PURE__ */ Y(Xw, [["__scopeId", "data-v-63876533"]]), Qw = {}, ek = { class: "menu-label" };
function tk(e, t) {
  return c(), h("span", ek, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const us = /* @__PURE__ */ Y(Qw, [["render", tk], ["__scopeId", "data-v-aa955b3e"]]), nk = {
  class: "search-bar",
  "data-search-bar": ""
}, ak = { class: "search-bar-control" }, sk = ["value", "placeholder", "aria-label"], ok = ["aria-expanded"], lk = {
  key: 0,
  "data-menu-count": ""
}, rk = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var T;
    const a = e, s = n, o = yi(), l = ((T = Oe(Ne, null)) == null ? void 0 : T.search) ?? {}, r = R(() => l.placeholder || a.placeholder), i = l.context ?? [], u = I(null), d = I(null), f = I([]), m = R(() => f.value.length ? f.value[f.value.length - 1].next : i), g = R(() => !!o.menu || i.length > 0), v = (W) => {
      f.value = [], d.value = d.value ? null : W.currentTarget;
    };
    function _(W) {
      if (W.next.length) {
        f.value = [...f.value, W];
        return;
      }
      d.value = null, s("pick", W.click);
    }
    function E() {
      var W;
      s("update:modelValue", ""), (W = u.value) == null || W.focus();
    }
    return t({ focus: () => {
      var W;
      return (W = u.value) == null ? void 0 : W.focus();
    } }), (W, J) => {
      var D;
      return c(), h("div", nk, [
        y("div", ak, [
          L(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          y("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: J[0] || (J[0] = (B) => s("update:modelValue", B.target.value)),
            onKeydown: Xt(E, ["esc"])
          }, null, 40, sk),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: E
          }, [
            L(ye, {
              name: "close",
              size: 12
            })
          ])) : O("", !0),
          g.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: v
          }, [
            e.menuCount ? (c(), h("span", lk, $(e.menuCount), 1)) : O("", !0),
            L(ye, {
              name: "caret",
              size: 12
            })
          ], 8, ok)) : O("", !0)
        ]),
        (D = P(l).button) != null && D.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: J[1] || (J[1] = (B) => s("pick", P(l).button.click))
        }, $(P(l).button.title), 1)) : O("", !0),
        ue(W.$slots, "default", {}, void 0, !0),
        d.value ? (c(), H(ea, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: J[3] || (J[3] = $e(() => {
          }, ["stop"])),
          onClose: J[4] || (J[4] = (B) => d.value = null)
        }, {
          default: j(() => [
            f.value.length ? (c(), H(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: J[2] || (J[2] = (B) => f.value = f.value.slice(0, -1))
            }, {
              default: j(() => [
                ee("‹ " + $(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : O("", !0),
            (c(!0), h(z, null, te(m.value, (B) => (c(), H(Mt, {
              key: B.title,
              description: B.subtext,
              "data-search-entry": B.title,
              onClick: (q) => _(B)
            }, {
              default: j(() => [
                ee($(B.title) + $(B.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? O("", !0) : ue(W.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : O("", !0)
      ]);
    };
  }
}, ik = /* @__PURE__ */ Y(rk, [["__scopeId", "data-v-45374bed"]]), ck = {
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
    return (o, l) => (c(), H(ik, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: j(() => [
        L(us, null, {
          default: j(() => [...l[2] || (l[2] = [
            ee("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(z, null, te(a, (r) => L(Mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: j(() => [
            ee($(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(z, { key: 0 }, [
          L(us, null, {
            default: j(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(z, null, te(s, (r) => L(Mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: j(() => [
              ee($(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : O("", !0)
      ]),
      default: j(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, v8 = /* @__PURE__ */ Y(ck, [["__scopeId", "data-v-dab0064d"]]);
function y8() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const b8 = (e) => import(
  /* @vite-ignore */
  e
), uk = 86400, ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function dk(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ds(t) - ds(e)) / uk);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function w8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ds(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: dk(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Da = 280, ja = 240, Pa = 120, fk = 6, hk = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function mk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function oi(e, t) {
  const n = Math.max(0, mk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function pk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${hk}px)` }), e.offsetHeight, e.style.transition = `height ${Da}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = oi(t, e));
    const m = s() - r;
    if (!i && m >= Da && (i = !0, e.style.transition = `opacity ${ja}ms ease-out, transform ${ja}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Da + ja) return a(f);
    d();
  };
  return a(f), d;
}
function k8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${fk}px)` }), e.offsetHeight, e.style.transition = `opacity ${Pa}ms ease-out, transform ${Pa}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = oi(t, e)), s() - l < Pa) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const gk = 140, On = 220, Jo = 5;
function $8({ gap: e = gk, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Jo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, g = pk) => {
    if (l || !f.pane || !f.follows()) return m();
    const v = { el: d, options: f, done: m, arrival: g, display: d.style.display || "" };
    if (!s)
      return s = !0, r(v, () => o = t(i, e));
    d.style.display = "none", n.push(v), n.length >= Jo && u.flush();
  };
  return u.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, u;
}
function x8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${On}ms ${ln}, opacity ${On}ms ease-in, margin ${On}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, On);
}
const li = "chat.pins.minimised", Nn = I(jn(li, !1));
function Zo(e) {
  Nn.value = e, Ms(li, e);
}
function vk(e) {
  const t = R(() => e()), n = R(() => Nn.value ? [] : e()), a = () => Zo(!Nn.value), s = Date.now() / 1e3;
  return fe(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Zo(!1)
  ), { pins: t, visible: n, minimised: Nn, toggle: a };
}
const yk = ["title"], bk = {
  key: 0,
  class: "pins-count"
}, wk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = vk(() => t.pinRows);
    return (o, l) => P(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: P(a), inline: e.inline }]),
      title: P(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...r) => P(s) && P(s)(...r), ["stop"]))
    }, [
      L(ye, {
        name: P(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      P(a) ? (c(), h("span", bk, $(P(n).length), 1)) : O("", !0)
    ], 10, yk)) : O("", !0);
  }
}, M8 = /* @__PURE__ */ Y(wk, [["__scopeId", "data-v-d073c504"]]), kk = ["title"], $k = ["title"], xk = { class: "diff-card-dir" }, Mk = { class: "diff-card-name" }, Sk = ["title"], _k = ["title"], Ek = {
  key: 0,
  class: "diff-card-note"
}, Ak = ["href"], Ck = ["src", "alt"], Ok = { class: "diff-card-rows" }, Tk = { class: "diff-row-num" }, Rk = { class: "diff-row-sign" }, Ik = { class: "diff-row-code" }, Bk = {
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
    function o(k) {
      (k.metaKey || k.ctrlKey) && (k.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, i.value)), d = R(() => n.path.slice(i.value)), f = R(() => n.change === "deleted"), m = R(() => l[n.change]), g = R(() => new Set(n.rows.filter((k) => k.line_type === "add").map((k) => k.line))), v = I("after"), _ = R(() => v.value === "before" ? n.whole.old : n.whole.text), E = R(() => n.whole && n.whole.text !== void 0 ? _.value.split(`
`).map((k, w) => ({ line_type: v.value === "after" && g.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: k })) : n.rows.filter(
      (k) => !(n.editsOnly && ["ctx", "fold"].includes(k.line_type)) && !(n.hideRemovals && k.line_type === "del")
    )), T = I(!1), W = R(() => n.lines && !T.value && !n.whole), J = R(() => W.value ? E.value.slice(0, n.lines) : E.value), D = R(() => E.value.length - J.value.length), B = (k) => k.line === null || k.line_type === "del" ? "" : k.line, q = (k) => k.line_type === "fold" ? k.hidden ? `⋯ ${k.hidden} lines` : "⋯" : k.text, A = I(null), M = I(null);
    let b = null;
    return Re(() => {
      if (!M.value) return;
      let k = !0;
      b = new ResizeObserver(() => {
        !A.value || !M.value || (A.value.style.transition = k ? "none" : "", A.value.style.height = `${M.value.offsetHeight}px`, k = !1);
      }), b.observe(M.value);
    }), Be(() => b && b.disconnect()), (k, w) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      y("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (p) => !f.value && a("fold"))
      }, [
        y("span", {
          class: "diff-card-path",
          title: `${e.path} · ${P(s)}-click to open it`,
          onClick: o
        }, [
          y("span", xk, $(u.value), 1),
          y("span", Mk, $(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, $(m.value), 3)) : O("", !0)
        ], 8, $k),
        y("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + $(e.added), 3),
        y("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + $(e.removed), 3),
        L(ia, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: v.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = $e((p) => v.value = v.value === "after" ? "before" : "after", ["stop"]))
        }, $(v.value === "after" ? "After" : "Before"), 9, Sk)) : O("", !0),
        f.value ? O("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = $e((p) => a("whole"), ["stop"]))
        }, [
          L(ye, {
            name: "file",
            size: 12
          })
        ], 10, _k))
      ], 8, kk),
      e.whole && e.whole.error ? (c(), h("p", Ek, $(e.whole.error), 1)) : O("", !0),
      !f.value && !e.folded ? (c(), h(z, { key: 1 }, [
        e.picture ? (c(), h("a", {
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
          }, null, 8, Ck)
        ], 8, Ak)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: A,
          class: "diff-card-grow"
        }, [
          y("div", {
            ref_key: "body",
            ref: M,
            class: "diff-card-diff"
          }, [
            y("div", Ok, [
              (c(!0), h(z, null, te(J.value, (p, S) => (c(), h("div", {
                key: S,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                y("span", Tk, $(B(p)), 1),
                y("span", Rk, $(r[p.line_type]), 1),
                y("span", Ik, $(q(p)), 1)
              ], 2))), 128)),
              D.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = $e((p) => T.value = !0, ["stop"]))
              }, $(D.value) + " more " + $(D.value === 1 ? "line" : "lines"), 1)) : O("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : O("", !0)
    ], 2));
  }
}, S8 = /* @__PURE__ */ Y(Bk, [["__scopeId", "data-v-23581cbb"]]), Lk = {
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
    const n = t, a = e, s = R(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = R(() => s.value && { render: () => Jn(Nm, { line: s.value.line, events: s.value.events }) }), l = I(null), r = R(() => {
      var m, g;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), i = R(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = R(
      () => {
        var m, g;
        return l.value ? rv(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, g) => {
      var v, _;
      return !s.value && ((v = e.catalogue.loaded) == null ? void 0 : v.value) === !1 ? (c(), H(Cs, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((_ = s.value) == null ? void 0 : _.shows) === "one-agent" && e.agent === null ? (c(), H(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), H(Kt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), H(yr, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (E, T) => n("option", E, T))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), H(vr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (E, T) => n("option", E, T))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), H(Kt, {
        key: s.value.line || s.value.entry_url,
        name: e.name,
        component: o.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
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
        onOption: g[2] || (g[2] = (E, T) => n("option", E, T))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (E) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Nk = ["data-section"], Dk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Bu, null), a = R(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = R(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(z, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      L(Lk, {
        name: r.name,
        catalogue: P(n).catalogue,
        subscriptions: P(n).subscriptions,
        environment: P(n).environment,
        prompts: P(n).prompts,
        "shell-read": P(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Nk))), 128));
  }
}, jk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: j(() => [
        L(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Pk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, qk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Fk = { class: "ask-text" }, Wk = ["placeholder", "aria-label"], Hk = ["placeholder", "aria-label"], Uk = {
  key: 3,
  class: "moves"
}, zk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = R(() => l0(a.noun, a.row)), l = I(""), r = I(null), i = I(""), u = I("");
    fe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(g, v = "") {
      const _ = await a.read([g.noun ?? a.noun, g.word, String(a.id), ...g.flag ? [g.flag, v] : g.positional ? [v] : [], ...g.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = _.ok ? "" : _.error, _.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (g) => g.confirm ? r.value = g : g.said ? d(g, g.said) : g.flag || g.positional ? (r.value = g, i.value = "") : d(g), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (g, v) => o.value.length ? (c(), H(fr, {
      key: 0,
      inline: e.inline
    }, {
      default: j(() => {
        var _;
        return [
          l.value ? (c(), h("p", Pk, $(l.value), 1)) : O("", !0),
          (_ = r.value) != null && _.confirm ? (c(), h("div", qk, [
            y("span", Fk, $(r.value.confirm), 1),
            L(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: Z({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: v[0] || (v[0] = (E) => d(r.value))
            }, {
              default: j(() => [
                ee($(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            L(de, {
              small: "",
              variant: "ghost",
              onClick: v[1] || (v[1] = (E) => r.value = null)
            }, {
              default: j(() => [...v[7] || (v[7] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ])) : r.value ? (c(), h("form", {
            key: 2,
            class: "ask",
            "data-resource-ask": "",
            onSubmit: $e(m, ["prevent"])
          }, [
            Ye(y("input", {
              "onUpdate:modelValue": v[2] || (v[2] = (E) => i.value = E),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: v[3] || (v[3] = Xt($e((E) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Wk), [
              [Dn, i.value]
            ]),
            r.value.opener ? Ye((c(), h("input", {
              key: 0,
              "onUpdate:modelValue": v[4] || (v[4] = (E) => u.value = E),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: v[5] || (v[5] = Xt($e((E) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Hk)), [
              [Dn, u.value]
            ]) : O("", !0),
            L(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: j(() => [
                ee($(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            L(de, {
              small: "",
              variant: "ghost",
              onClick: v[6] || (v[6] = (E) => r.value = null)
            }, {
              default: j(() => [...v[8] || (v[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (c(), h("div", Uk, [
            (c(!0), h(z, null, te(o.value, (E) => (c(), H(de, {
              key: E.word,
              small: !E.bordered,
              bordered: E.bordered,
              icon: E.icon,
              variant: E.main ? "primary" : "ghost",
              class: Z({ danger: E.danger }),
              "data-move": E.word,
              onClick: (T) => f(E)
            }, {
              default: j(() => [
                ee($(E.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : O("", !0);
  }
}, Vk = /* @__PURE__ */ Y(zk, [["__scopeId", "data-v-bdac0207"]]), Gk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Kk = (e) => Gk.has(e), rn = (e) => Kk(e) ? "done" : e, Yk = { class: "facts" }, Jk = { class: "fact wide" }, Zk = ["title"], Xk = {
  key: 1,
  class: "fact-value"
}, Qk = {
  key: 0,
  class: "fact"
}, e2 = { class: "fact-value" }, t2 = { class: "fact" }, n2 = { class: "fact-label" }, a2 = ["title"], s2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, o2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, l2 = {
  key: 2,
  class: "fact"
}, r2 = { class: "fact-value" }, i2 = { class: "fact wide" }, c2 = { class: "fact wide" }, u2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, d2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = Hn.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, u;
      return c(), h("div", Yk, [
        y("div", Jk, [
          r[4] || (r[4] = y("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (d) => P(Fe)(`plans:${e.place.plan_id}`))
          }, "Plan " + $(e.place.plan_id) + ": " + $(e.place.plan_title), 9, Zk)) : (c(), h("span", Xk, "Not in a plan"))
        ]),
        ((u = e.place) == null ? void 0 : u.phase_total) > 1 ? (c(), h("div", Qk, [
          r[5] || (r[5] = y("span", { class: "fact-label" }, "Phase", -1)),
          y("span", e2, $(e.place.phase_number) + " of " + $(e.place.phase_total) + ": " + $(e.place.phase_title), 1)
        ])) : O("", !0),
        e.task.helper_id ? (c(), h(z, { key: 1 }, [
          y("div", t2, [
            y("span", n2, $(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            y("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (d) => P(Fe)(`agents:${e.task.helper_id}`))
            }, $(e.task.helper_name), 9, a2)
          ]),
          P(o).has(e.task.state) ? (c(), h("p", s2, $(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", o2, $(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : O("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", l2, [
          r[6] || (r[6] = y("span", { class: "fact-label" }, "Assigned to", -1)),
          y("span", r2, "Agent " + $(e.task.holder_id), 1)
        ])) : O("", !0),
        y("div", i2, [
          r[7] || (r[7] = y("span", { class: "fact-label" }, "Complexity", -1)),
          L(Nt, {
            options: P(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (d) => s("complexity", d))
          }, null, 8, ["options", "value"]),
          r[8] || (r[8] = y("span", { class: "fact-label" }, "1: a few lines. 5: a design with risk.", -1))
        ]),
        y("div", c2, [
          r[9] || (r[9] = y("span", { class: "fact-label" }, "Priority", -1)),
          L(Nt, {
            options: P(n),
            value: String(P(dr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", u2, $(e.refusal), 1)) : O("", !0)
        ])
      ]);
    };
  }
}, f2 = /* @__PURE__ */ Y(d2, [["__scopeId", "data-v-81d598cf"]]);
function h2(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, u]) => u === i).map(([u]) => u), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((u) => !s.has(u)))
    i.forEach((u) => s.add(u)), o.push(i.map((u) => n.get(u)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([u]) => u === e); i && !r.has(i[1]); i = t.edges.find(([u]) => u === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const m2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, p2 = { ...m2, done: "Completed" }, g2 = { class: "task-status-icon" }, v2 = ["width", "height", "aria-label"], y2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = R(() => xl("task", rn(t.status))), a = R(() => n.value === "testing" ? "started" : n.value), s = R(() => p2[t.status] ?? $l("task", t.status));
    return (o, l) => (c(), h("span", g2, [
      L(jt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (c(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            L(Pt, { value: a.value }, {
              blocked: j(() => [...l[0] || (l[0] = [
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
              done: j(() => [...l[1] || (l[1] = [
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
              started: j(() => [...l[2] || (l[2] = [
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
              asked: j(() => [...l[3] || (l[3] = [
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
              paused: j(() => [...l[4] || (l[4] = [
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
              planned: j(() => [...l[5] || (l[5] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: j(() => [...l[6] || (l[6] = [
                y("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, v2))
        ]),
        _: 1
      })
    ]));
  }
}, Fs = /* @__PURE__ */ Y(y2, [["__scopeId", "data-v-ae24a63f"]]), b2 = { class: "number" }, w2 = { class: "title" }, k2 = { class: "word" }, $2 = {
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
    return (a, s) => (c(), H(ht(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Z(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        L(Fs, { status: e.status }, null, 8, ["status"]),
        y("span", b2, $(e.number), 1),
        y("span", w2, $(e.title), 1),
        y("span", k2, $(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, qa = /* @__PURE__ */ Y($2, [["__scopeId", "data-v-f6417ae8"]]), x2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, M2 = { class: "level" }, S2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1);
    fe(() => n.task.id, () => s.value = !1);
    const o = R(() => h2(n.task.id, n.graph)), l = R(() => s.value ? o.value.above : o.value.above.slice(-1)), r = R(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = R(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), u = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), d = (f, m = !1) => ({ status: rn(f.state), number: f.id, title: f.title, word: m ? "This task" : u(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (c(), h("section", x2, [
      m[5] || (m[5] = y("h4", null, "What waits on what", -1)),
      (c(!0), h(z, null, te(l.value, (g) => (c(), h(z, {
        key: g.map((v) => v.id).join()
      }, [
        y("div", M2, [
          (c(!0), h(z, null, te(g, (v) => (c(), H(qa, Le({
            key: v.id,
            ref_for: !0
          }, d(v), {
            onSelect: m[0] || (m[0] = (_) => a("select", _))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = y("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      L(qa, bi(wi(d(e.task, !0))), null, 16),
      (c(!0), h(z, null, te(r.value, (g) => (c(), h(z, {
        key: g.id
      }, [
        m[4] || (m[4] = y("div", { class: "waits" }, "↓ waits on", -1)),
        L(qa, Le({ ref_for: !0 }, d(g), {
          onSelect: m[1] || (m[1] = (v) => a("select", v))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (g) => s.value = !s.value)
      }, $(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : O("", !0)
    ])) : O("", !0);
  }
}, _2 = /* @__PURE__ */ Y(S2, [["__scopeId", "data-v-db05c4b2"]]), E2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, A2 = ["datetime"], C2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", E2, [
      n[0] || (n[0] = y("h3", null, "Block history", -1)),
      (c(!0), h(z, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        y("time", {
          datetime: a.created_at
        }, $(new Date(a.created_at).toLocaleString()), 9, A2),
        y("p", null, $(a.reason), 1)
      ]))), 128))
    ])) : O("", !0);
  }
}, O2 = /* @__PURE__ */ Y(C2, [["__scopeId", "data-v-b41f213b"]]), T2 = {
  class: "part",
  "data-resource-waits": ""
}, R2 = ["onClick"], I2 = { class: "wait-id" }, B2 = { class: "wait-title" }, L2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", T2, [
      y("h4", null, $(e.title), 1),
      (c(!0), h(z, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        L(Fs, {
          status: P(rn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        y("span", I2, $(o.id), 1),
        y("span", B2, $(o.title), 1)
      ], 8, R2))), 128))
    ]));
  }
}, Xo = /* @__PURE__ */ Y(L2, [["__scopeId", "data-v-8fb2e251"]]), N2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, D2 = { class: "text" }, j2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, P2 = 180, q2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), l = R(() => a.task.waits.filter((i) => !n.has(i.state))), r = R(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(z, null, [
      l.value.length ? (c(), H(Xo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : O("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", N2, [
        u[3] || (u[3] = y("h4", null, "How it was done", -1)),
        y("p", D2, $(e.task.outcome), 1)
      ])) : O("", !0),
      e.task.brief ? (c(), h("section", j2, [
        u[4] || (u[4] = y("h4", null, "The brief", -1)),
        y("p", {
          class: Z(["text", { clamped: !o.value }])
        }, $(e.task.brief), 3),
        e.task.brief.length > P2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : O("", !0)
      ])) : O("", !0),
      r.value.length ? (c(), H(Xo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : O("", !0)
    ], 64));
  }
}, F2 = /* @__PURE__ */ Y(q2, [["__scopeId", "data-v-4a3f1e79"]]), W2 = {
  class: "task-details",
  "data-task-details": ""
}, H2 = { class: "since" }, U2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, z2 = { class: "text" }, V2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, G2 = {
  key: 1,
  class: "note"
}, K2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Y2 = { class: "text" }, J2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", W2, [
        y("div", {
          class: Z(["state-line", P(rn)(e.task.state)])
        }, [
          y("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            L(Fs, {
              status: P(rn)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + $(a(e.task.state)), 1)
          ]),
          y("span", H2, [
            o[5] || (o[5] = ee(" since ", -1)),
            L(ia, {
              at: P(er)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", U2, [
          o[6] || (o[6] = y("span", { class: "label" }, "Blocked, waiting on", -1)),
          y("p", z2, $(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", V2, "Opens by itself when " + $(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", G2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", K2, [
          o[7] || (o[7] = y("span", { class: "label" }, "Why it was cancelled", -1)),
          y("p", Y2, $(e.task.reason), 1)
        ])) : O("", !0),
        e.graph ? (c(), H(_2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : O("", !0),
        L(f2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        L(F2, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        L(O2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, Z2 = /* @__PURE__ */ Y(J2, [["__scopeId", "data-v-7e73fa21"]]), X2 = 50, Q2 = { messages: 25 }, e5 = (e) => Q2[e] || X2, t5 = {
  class: "task-log",
  "aria-label": "Task log"
}, n5 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, a5 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, s5 = { class: "entries" }, o5 = ["data-task-log-important"], l5 = ["datetime"], r5 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, i5 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = I([]), a = I(1), s = I(!0), o = I(!0), l = I("");
    let r = 0;
    async function i(u = 1) {
      const d = ++r;
      a.value = u, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(e5("task_logs")),
        "--page",
        String(u)
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
    }), (u, d) => (c(), h("section", t5, [
      o.value ? (c(), H(_t, { key: 0 })) : l.value ? (c(), h(z, { key: 1 }, [
        y("p", n5, $(l.value), 1),
        L(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(z, { key: 2 }, [
        n.value.length ? O("", !0) : (c(), h("p", a5, "No log entries yet.")),
        y("ol", s5, [
          (c(!0), h(z, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: Z(["entry", { important: f.important }]),
            "data-task-log": "",
            "data-task-log-important": f.important ? "" : null
          }, [
            y("time", {
              datetime: f.created_at
            }, $(new Date(f.created_at).toLocaleString()), 9, l5),
            y("p", null, $(f.line), 1)
          ], 10, o5))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", r5, [
          L(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: j(() => [...d[4] || (d[4] = [
              ee("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          y("span", null, "Page " + $(a.value), 1),
          L(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: j(() => [...d[5] || (d[5] = [
              ee("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : O("", !0)
      ], 64))
    ]));
  }
}, c5 = /* @__PURE__ */ Y(i5, [["__scopeId", "data-v-cfa43bf1"]]), u5 = {
  class: "task-tags",
  "aria-label": "Task tags"
}, d5 = { class: "tags" }, f5 = ["aria-label", "data-remove-tag", "onClick"], h5 = {
  __name: "TaskTags",
  props: { tags: { type: Array, required: !0 } },
  emits: ["add", "remove"],
  setup(e, { emit: t }) {
    const n = t, a = I("");
    function s() {
      const o = a.value.trim();
      o && (n("add", o), a.value = "");
    }
    return (o, l) => (c(), h("section", u5, [
      y("div", d5, [
        (c(!0), h(z, null, te(e.tags, (r) => (c(), h("span", {
          key: r,
          class: "tag",
          "data-task-tag": ""
        }, [
          ee($(r) + " ", 1),
          y("button", {
            type: "button",
            "aria-label": `Remove tag ${r}`,
            "data-remove-tag": r,
            onClick: (i) => n("remove", r)
          }, "×", 8, f5)
        ]))), 128))
      ]),
      y("form", {
        class: "add-tag",
        onSubmit: $e(s, ["prevent"])
      }, [
        Ye(y("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (r) => a.value = r),
          "aria-label": "New tag",
          placeholder: "New tag",
          pattern: "[a-z0-9-]+",
          "data-task-tag-input": ""
        }, null, 512), [
          [Dn, a.value]
        ]),
        L(de, {
          small: "",
          type: "submit",
          disabled: !a.value.trim(),
          "data-task-tag-add": ""
        }, {
          default: j(() => [...l[1] || (l[1] = [
            ee("Add tag", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)
    ]));
  }
}, m5 = /* @__PURE__ */ Y(h5, [["__scopeId", "data-v-1d720cf2"]]), p5 = { class: "comment-side-head" }, g5 = {
  key: 0,
  class: "comment-none"
}, v5 = { key: 0 }, y5 = {
  key: 1,
  class: "comment-none"
}, b5 = {
  class: "comment",
  "data-comment": ""
}, w5 = {
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
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      y("header", p5, [
        n[2] || (n[2] = y("h3", null, "Comments", -1)),
        L(xs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", g5, "No comments yet")) : O("", !0),
      (c(!0), h(z, null, te(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", v5, $(a.quote), 1)) : O("", !0),
        a.revision ? (c(), h("span", y5, "Revision " + $(a.revision), 1)) : O("", !0),
        y("p", b5, $(e.words(a)), 1)
      ]))), 128)),
      L(Qn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, k5 = /* @__PURE__ */ Y(w5, [["__scopeId", "data-v-276284a3"]]);
var tl;
/Mac|iPhone|iPad/.test(((tl = navigator.userAgentData) == null ? void 0 : tl.platform) || navigator.platform);
function $5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const x5 = ["placeholder"], M5 = { class: "actions" }, S5 = { class: "error" }, _5 = {
  key: 1,
  class: "card closed"
}, E5 = { class: "mark" }, A5 = { class: "prompt" }, C5 = {
  key: 0,
  class: "draft"
}, O5 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ha({
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
  emits: /* @__PURE__ */ Ha(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Wa(e, "draft"), l = Wa(e, "error"), r = I(!!l.value), i = I(!1), u = I(!1), d = I(null);
    async function f() {
      var v, _;
      r.value = !0, i.value = !1, await mt(), (_ = ((v = d.value) == null ? void 0 : v.querySelector("input")) || d.value) == null || _.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function g() {
      const v = o.value.trim();
      if (!(!v || !a.ready || u.value)) {
        l.value = "", u.value = !0, o.value = "";
        try {
          await a.send(v), r.value = !1, i.value = !0;
        } catch (_) {
          o.value = v, l.value = _.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (v, _) => (c(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(g, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        ue(v.$slots, "who", {}, void 0, !0),
        Ye(y("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": _[0] || (_[0] = (E) => o.value = E),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: _[1] || (_[1] = Xt((E) => P($5)(E, g), ["enter"]))
        }, null, 40, x5), [
          [Dn, o.value]
        ]),
        y("div", M5, [
          y("span", S5, $(l.value), 1),
          L(de, {
            small: "",
            onClick: m
          }, {
            default: j(() => [..._[3] || (_[3] = [
              ee("Cancel", -1)
            ])]),
            _: 1
          }),
          L(de, {
            variant: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: j(() => [..._[4] || (_[4] = [
              ee("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", _5, [
        y("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          y("span", E5, [
            L(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          y("span", A5, $(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", C5, "Draft kept")) : O("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: _[2] || (_[2] = (E) => s("show"))
        }, [
          y("span", null, $(P(pu)(e.count, "comment")), 1),
          L(ye, {
            name: "down",
            size: 12
          })
        ])) : O("", !0)
      ]))
    ], 2));
  }
}, T5 = /* @__PURE__ */ Y(O5, [["__scopeId", "data-v-b68baddd"]]);
function R5(e, t) {
  const n = I([]), a = I(!1), s = I(null), o = I(0), l = I(!1), r = I("");
  let i = 0, u = 0;
  const d = (v) => {
    if (typeof v.body == "string") return v.body;
    const { noun: _, id: E, title: T } = e(), W = `On ${_} ${E}, ${T}: `;
    return v.text.startsWith(W) ? v.text.slice(W.length) : v.text;
  };
  async function f(v = 1) {
    const { noun: _, id: E } = e();
    if (!E) return;
    const T = ++u;
    l.value = !0, r.value = "";
    try {
      const W = await t([_, "comments", String(E), "--page", String(v), "--page-size", "25"]);
      if (T !== u) return;
      if (!W.ok) {
        r.value = W.error;
        return;
      }
      const J = W.value.rows ?? [], D = v === 1 ? J : [...n.value, ...J];
      n.value = [...new Map(D.map((B) => [B.id, B])).values()], o.value = W.value.total ?? n.value.length, s.value = W.value.next_page ?? null;
    } catch (W) {
      T === u && (r.value = W.message);
    } finally {
      T === u && (l.value = !1);
    }
  }
  async function m(v) {
    var B;
    const { noun: _, id: E } = e(), T = `${_}:${E}`, W = { id: `sending-${++i}`, text: v };
    n.value = [...n.value, W], o.value++, a.value = !0;
    const J = await t([_, "comment", String(E), v]);
    if (T !== `${e().noun}:${e().id}`) return;
    if (!J.ok)
      throw n.value = n.value.filter((q) => q.id !== W.id), o.value = Math.max(0, o.value - 1), new Error(J.error);
    await f();
    const D = (B = J.value) == null ? void 0 : B.id;
    D && !n.value.some((q) => q.id === D) && (n.value = [...n.value, { ...W, id: D }]);
  }
  const g = () => !l.value && s.value && f(s.value);
  return fe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", u++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: g, nextPage: s, total: o, loading: l, failure: r };
}
const I5 = { class: "top" }, B5 = {
  class: "crumb",
  "data-task-crumb": ""
}, L5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, N5 = {
  key: 1,
  class: "body"
}, D5 = { class: "summary" }, j5 = { class: "stamp" }, P5 = {
  class: "title",
  "data-resource-title": ""
}, q5 = {
  class: "tabs",
  "data-task-tabs": ""
}, F5 = { class: "panels" }, W5 = {
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
    const a = e, s = n, o = I(null), l = I(null), r = I(null), i = I(""), u = I(""), d = I(null), f = I(null), m = I("details"), g = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = R5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (q) => a.read(q)
    );
    let _ = 0;
    const E = R(() => {
      var q;
      return (q = l.value) != null && q.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function T() {
      const q = ++_, [A, M, b] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      q === _ && (i.value = A.ok ? "" : A.error, o.value = A.ok ? A.value : null, l.value = M.ok ? M.value : null, r.value = b.ok ? b.value : null);
    }
    fe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", T();
      },
      { immediate: !0 }
    ), fe(() => a.changes, T), fe(v.open, (q) => {
      q && (m.value = "comments");
    });
    async function W(q, A) {
      const M = o.value[q];
      o.value[q] = Number(A);
      const b = await a.read(["task", "edit", String(a.id), `--${q}`, A]);
      if (u.value = b.ok ? "" : b.error, b.ok) return T();
      o.value[q] = M;
    }
    async function J(q, A) {
      const M = await a.read(["task", q, String(a.id), A]);
      u.value = M.ok ? "" : M.error, M.ok && await T();
    }
    function D(q) {
      d.value = null, f.value.press(q);
    }
    const B = (q) => {
      var A;
      return ((A = f.value) == null ? void 0 : A.moves.length) && (d.value = q);
    };
    return t({ openStatus: B }), (q, A) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      y("div", I5, [
        e.backed ? (c(), H(jk, {
          key: 0,
          onBack: A[0] || (A[0] = (M) => s("back"))
        })) : O("", !0),
        y("span", B5, $(E.value), 1),
        A[14] || (A[14] = y("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(z, { key: 1 }, [
          L(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: A[1] || (A[1] = (M) => s("step", -1))
          }, {
            default: j(() => [
              L(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          L(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: A[2] || (A[2] = (M) => s("step", 1))
          }, {
            default: j(() => [
              L(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : O("", !0),
        L(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: A[3] || (A[3] = (M) => s("close"))
        }, {
          default: j(() => [
            L(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", L5, $(i.value), 1)) : o.value ? (c(), h(z, { key: 2 }, [
        L(Vk, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: T
        }, null, 8, ["id", "row", "read"]),
        y("header", D5, [
          y("div", j5, [
            ee(" Task " + $(o.value.id) + " · updated ", 1),
            L(ia, {
              at: P(er)(o.value)
            }, null, 8, ["at"])
          ]),
          y("h3", P5, $(o.value.title), 1),
          L(m5, {
            tags: o.value.tags,
            onAdd: A[4] || (A[4] = (M) => J("tag", M)),
            onRemove: A[5] || (A[5] = (M) => J("untag", M))
          }, null, 8, ["tags"])
        ]),
        y("div", q5, [
          L(Nt, {
            options: g,
            value: m.value,
            onPick: A[6] || (A[6] = (M) => m.value = M)
          }, null, 8, ["value"])
        ]),
        y("div", F5, [
          L(Pt, { value: m.value }, {
            details: j(() => [
              L(Z2, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: u.value,
                onStatus: B,
                onPriority: A[7] || (A[7] = (M) => W("priority", M)),
                onComplexity: A[8] || (A[8] = (M) => W("complexity", M)),
                onSelect: A[9] || (A[9] = (M) => s("select", M))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              L(Dk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              L(hu, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: A[10] || (A[10] = (M) => s("select", M))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: j(() => [
              L(k5, {
                below: "",
                comments: P(v).comments.value,
                words: P(v).words,
                more: !!P(v).nextPage.value,
                loading: P(v).loading.value,
                failure: P(v).failure.value,
                onMore: P(v).loadMore,
                onClose: A[11] || (A[11] = (M) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: j(() => [
              L(c5, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        L(T5, {
          send: P(v).send,
          count: P(v).total.value,
          onShow: A[12] || (A[12] = (M) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", N5, [
        L(_t)
      ])),
      d.value ? (c(), H(ea, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: A[13] || (A[13] = (M) => d.value = null)
      }, {
        default: j(() => [
          L(us, null, {
            default: j(() => [
              ee("Change the status of task " + $(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(z, null, te(f.value.moves, (M) => (c(), H(Mt, {
            key: M.word,
            onClick: (b) => D(M)
          }, {
            default: j(() => [
              ee($(M.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : O("", !0)
    ], 2));
  }
}, _8 = /* @__PURE__ */ Y(W5, [["__scopeId", "data-v-d8c2872e"]]);
function H5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Fa = { exports: {} }, Qo;
function U5() {
  return Qo || (Qo = 1, (function(e, t) {
    var n = (function() {
      var a = function(B, q) {
        var A = 236, M = 17, b = B, k = o[q], w = null, p = 0, S = null, x = [], C = {}, N = function(U, V) {
          p = b * 4 + 17, w = (function(F) {
            for (var G = new Array(F), K = 0; K < F; K += 1) {
              G[K] = new Array(F);
              for (var Q = 0; Q < F; Q += 1)
                G[K][Q] = null;
            }
            return G;
          })(p), X(0, 0), X(p - 7, 0), X(0, p - 7), he(), ie(), He(U, V), b >= 7 && Ae(U), S == null && (S = se(b, k, x)), ve(S, V);
        }, X = function(U, V) {
          for (var F = -1; F <= 7; F += 1)
            if (!(U + F <= -1 || p <= U + F))
              for (var G = -1; G <= 7; G += 1)
                V + G <= -1 || p <= V + G || (0 <= F && F <= 6 && (G == 0 || G == 6) || 0 <= G && G <= 6 && (F == 0 || F == 6) || 2 <= F && F <= 4 && 2 <= G && G <= 4 ? w[U + F][V + G] = !0 : w[U + F][V + G] = !1);
        }, ne = function() {
          for (var U = 0, V = 0, F = 0; F < 8; F += 1) {
            N(!0, F);
            var G = r.getLostPoint(C);
            (F == 0 || U > G) && (U = G, V = F);
          }
          return V;
        }, ie = function() {
          for (var U = 8; U < p - 8; U += 1)
            w[U][6] == null && (w[U][6] = U % 2 == 0);
          for (var V = 8; V < p - 8; V += 1)
            w[6][V] == null && (w[6][V] = V % 2 == 0);
        }, he = function() {
          for (var U = r.getPatternPosition(b), V = 0; V < U.length; V += 1)
            for (var F = 0; F < U.length; F += 1) {
              var G = U[V], K = U[F];
              if (w[G][K] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var le = -2; le <= 2; le += 1)
                    Q == -2 || Q == 2 || le == -2 || le == 2 || Q == 0 && le == 0 ? w[G + Q][K + le] = !0 : w[G + Q][K + le] = !1;
            }
        }, Ae = function(U) {
          for (var V = r.getBCHTypeNumber(b), F = 0; F < 18; F += 1) {
            var G = !U && (V >> F & 1) == 1;
            w[Math.floor(F / 3)][F % 3 + p - 8 - 3] = G;
          }
          for (var F = 0; F < 18; F += 1) {
            var G = !U && (V >> F & 1) == 1;
            w[F % 3 + p - 8 - 3][Math.floor(F / 3)] = G;
          }
        }, He = function(U, V) {
          for (var F = k << 3 | V, G = r.getBCHTypeInfo(F), K = 0; K < 15; K += 1) {
            var Q = !U && (G >> K & 1) == 1;
            K < 6 ? w[K][8] = Q : K < 8 ? w[K + 1][8] = Q : w[p - 15 + K][8] = Q;
          }
          for (var K = 0; K < 15; K += 1) {
            var Q = !U && (G >> K & 1) == 1;
            K < 8 ? w[8][p - K - 1] = Q : K < 9 ? w[8][15 - K - 1 + 1] = Q : w[8][15 - K - 1] = Q;
          }
          w[p - 8][8] = !U;
        }, ve = function(U, V) {
          for (var F = -1, G = p - 1, K = 7, Q = 0, le = r.getMaskFunction(V), oe = p - 1; oe > 0; oe -= 2)
            for (oe == 6 && (oe -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (w[G][oe - ke] == null) {
                  var Se = !1;
                  Q < U.length && (Se = (U[Q] >>> K & 1) == 1);
                  var ce = le(G, oe - ke);
                  ce && (Se = !Se), w[G][oe - ke] = Se, K -= 1, K == -1 && (Q += 1, K = 7);
                }
              if (G += F, G < 0 || p <= G) {
                G -= F, F = -F;
                break;
              }
            }
        }, me = function(U, V) {
          for (var F = 0, G = 0, K = 0, Q = new Array(V.length), le = new Array(V.length), oe = 0; oe < V.length; oe += 1) {
            var ke = V[oe].dataCount, Se = V[oe].totalCount - ke;
            G = Math.max(G, ke), K = Math.max(K, Se), Q[oe] = new Array(ke);
            for (var ce = 0; ce < Q[oe].length; ce += 1)
              Q[oe][ce] = 255 & U.getBuffer()[ce + F];
            F += ke;
            var De = r.getErrorCorrectPolynomial(Se), je = u(Q[oe], De.getLength() - 1), Ws = je.mod(De);
            le[oe] = new Array(De.getLength() - 1);
            for (var ce = 0; ce < le[oe].length; ce += 1) {
              var Hs = ce + Ws.getLength() - le[oe].length;
              le[oe][ce] = Hs >= 0 ? Ws.getAt(Hs) : 0;
            }
          }
          for (var Us = 0, ce = 0; ce < V.length; ce += 1)
            Us += V[ce].totalCount;
          for (var ca = new Array(Us), gn = 0, ce = 0; ce < G; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < Q[oe].length && (ca[gn] = Q[oe][ce], gn += 1);
          for (var ce = 0; ce < K; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < le[oe].length && (ca[gn] = le[oe][ce], gn += 1);
          return ca;
        }, se = function(U, V, F) {
          for (var G = d.getRSBlocks(U, V), K = f(), Q = 0; Q < F.length; Q += 1) {
            var le = F[Q];
            K.put(le.getMode(), 4), K.put(le.getLength(), r.getLengthInBits(le.getMode(), U)), le.write(K);
          }
          for (var oe = 0, Q = 0; Q < G.length; Q += 1)
            oe += G[Q].dataCount;
          if (K.getLengthInBits() > oe * 8)
            throw "code length overflow. (" + K.getLengthInBits() + ">" + oe * 8 + ")";
          for (K.getLengthInBits() + 4 <= oe * 8 && K.put(0, 4); K.getLengthInBits() % 8 != 0; )
            K.putBit(!1);
          for (; !(K.getLengthInBits() >= oe * 8 || (K.put(A, 8), K.getLengthInBits() >= oe * 8)); )
            K.put(M, 8);
          return me(K, G);
        };
        C.addData = function(U, V) {
          V = V || "Byte";
          var F = null;
          switch (V) {
            case "Numeric":
              F = m(U);
              break;
            case "Alphanumeric":
              F = g(U);
              break;
            case "Byte":
              F = v(U);
              break;
            case "Kanji":
              F = _(U);
              break;
            default:
              throw "mode:" + V;
          }
          x.push(F), S = null;
        }, C.isDark = function(U, V) {
          if (U < 0 || p <= U || V < 0 || p <= V)
            throw U + "," + V;
          return w[U][V];
        }, C.getModuleCount = function() {
          return p;
        }, C.make = function() {
          if (b < 1) {
            for (var U = 1; U < 40; U++) {
              for (var V = d.getRSBlocks(U, k), F = f(), G = 0; G < x.length; G++) {
                var K = x[G];
                F.put(K.getMode(), 4), F.put(K.getLength(), r.getLengthInBits(K.getMode(), U)), K.write(F);
              }
              for (var Q = 0, G = 0; G < V.length; G++)
                Q += V[G].dataCount;
              if (F.getLengthInBits() <= Q * 8)
                break;
            }
            b = U;
          }
          N(!1, ne());
        }, C.createTableTag = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var F = "";
          F += '<table style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: " + V + "px;", F += '">', F += "<tbody>";
          for (var G = 0; G < C.getModuleCount(); G += 1) {
            F += "<tr>";
            for (var K = 0; K < C.getModuleCount(); K += 1)
              F += '<td style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: 0px;", F += " width: " + U + "px;", F += " height: " + U + "px;", F += " background-color: ", F += C.isDark(G, K) ? "#000000" : "#ffffff", F += ";", F += '"/>';
            F += "</tr>";
          }
          return F += "</tbody>", F += "</table>", F;
        }, C.createSvgTag = function(U, V, F, G) {
          var K = {};
          typeof arguments[0] == "object" && (K = arguments[0], U = K.cellSize, V = K.margin, F = K.alt, G = K.title), U = U || 2, V = typeof V > "u" ? U * 4 : V, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-description" : null, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-title" : null;
          var Q = C.getModuleCount() * U + V * 2, le, oe, ke, Se, ce = "", De;
          for (De = "l" + U + ",0 0," + U + " -" + U + ",0 0,-" + U + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += K.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', ce += ' viewBox="0 0 ' + Q + " " + Q + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += G.text || F.text ? ' role="img" aria-labelledby="' + Je([G.id, F.id].join(" ").trim()) + '"' : "", ce += ">", ce += G.text ? '<title id="' + Je(G.id) + '">' + Je(G.text) + "</title>" : "", ce += F.text ? '<description id="' + Je(F.id) + '">' + Je(F.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < C.getModuleCount(); ke += 1)
            for (Se = ke * U + V, le = 0; le < C.getModuleCount(); le += 1)
              C.isDark(ke, le) && (oe = le * U + V, ce += "M" + oe + "," + Se + De);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, C.createDataURL = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var F = C.getModuleCount() * U + V * 2, G = V, K = F - V;
          return D(F, F, function(Q, le) {
            if (G <= Q && Q < K && G <= le && le < K) {
              var oe = Math.floor((Q - G) / U), ke = Math.floor((le - G) / U);
              return C.isDark(ke, oe) ? 0 : 1;
            } else
              return 1;
          });
        }, C.createImgTag = function(U, V, F) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var G = C.getModuleCount() * U + V * 2, K = "";
          return K += "<img", K += ' src="', K += C.createDataURL(U, V), K += '"', K += ' width="', K += G, K += '"', K += ' height="', K += G, K += '"', F && (K += ' alt="', K += Je(F), K += '"'), K += "/>", K;
        };
        var Je = function(U) {
          for (var V = "", F = 0; F < U.length; F += 1) {
            var G = U.charAt(F);
            switch (G) {
              case "<":
                V += "&lt;";
                break;
              case ">":
                V += "&gt;";
                break;
              case "&":
                V += "&amp;";
                break;
              case '"':
                V += "&quot;";
                break;
              default:
                V += G;
                break;
            }
          }
          return V;
        }, ri = function(U) {
          var V = 1;
          U = typeof U > "u" ? V * 2 : U;
          var F = C.getModuleCount() * V + U * 2, G = U, K = F - U, Q, le, oe, ke, Se, ce = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, De = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, je = "";
          for (Q = 0; Q < F; Q += 2) {
            for (oe = Math.floor((Q - G) / V), ke = Math.floor((Q + 1 - G) / V), le = 0; le < F; le += 1)
              Se = "█", G <= le && le < K && G <= Q && Q < K && C.isDark(oe, Math.floor((le - G) / V)) && (Se = " "), G <= le && le < K && G <= Q + 1 && Q + 1 < K && C.isDark(ke, Math.floor((le - G) / V)) ? Se += " " : Se += "█", je += U < 1 && Q + 1 >= K ? De[Se] : ce[Se];
            je += `
`;
          }
          return F % 2 && U > 0 ? je.substring(0, je.length - F - 1) + Array(F + 1).join("▀") : je.substring(0, je.length - 1);
        };
        return C.createASCII = function(U, V) {
          if (U = U || 1, U < 2)
            return ri(V);
          U -= 1, V = typeof V > "u" ? U * 2 : V;
          var F = C.getModuleCount() * U + V * 2, G = V, K = F - V, Q, le, oe, ke, Se = Array(U + 1).join("██"), ce = Array(U + 1).join("  "), De = "", je = "";
          for (Q = 0; Q < F; Q += 1) {
            for (oe = Math.floor((Q - G) / U), je = "", le = 0; le < F; le += 1)
              ke = 1, G <= le && le < K && G <= Q && Q < K && C.isDark(oe, Math.floor((le - G) / U)) && (ke = 0), je += ke ? Se : ce;
            for (oe = 0; oe < U; oe += 1)
              De += je + `
`;
          }
          return De.substring(0, De.length - 1);
        }, C.renderTo2dContext = function(U, V) {
          V = V || 2;
          for (var F = C.getModuleCount(), G = 0; G < F; G++)
            for (var K = 0; K < F; K++)
              U.fillStyle = C.isDark(G, K) ? "black" : "white", U.fillRect(G * V, K * V, V, V);
        }, C;
      };
      a.stringToBytesFuncs = {
        default: function(B) {
          for (var q = [], A = 0; A < B.length; A += 1) {
            var M = B.charCodeAt(A);
            q.push(M & 255);
          }
          return q;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(B, q) {
        var A = (function() {
          for (var b = W(B), k = function() {
            var ie = b.read();
            if (ie == -1) throw "eof";
            return ie;
          }, w = 0, p = {}; ; ) {
            var S = b.read();
            if (S == -1) break;
            var x = k(), C = k(), N = k(), X = String.fromCharCode(S << 8 | x), ne = C << 8 | N;
            p[X] = ne, w += 1;
          }
          if (w != q)
            throw w + " != " + q;
          return p;
        })(), M = 63;
        return function(b) {
          for (var k = [], w = 0; w < b.length; w += 1) {
            var p = b.charCodeAt(w);
            if (p < 128)
              k.push(p);
            else {
              var S = A[b.charAt(w)];
              typeof S == "number" ? (S & 255) == S ? k.push(S) : (k.push(S >>> 8), k.push(S & 255)) : k.push(M);
            }
          }
          return k;
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
        var B = [
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
        ], q = 1335, A = 7973, M = 21522, b = {}, k = function(w) {
          for (var p = 0; w != 0; )
            p += 1, w >>>= 1;
          return p;
        };
        return b.getBCHTypeInfo = function(w) {
          for (var p = w << 10; k(p) - k(q) >= 0; )
            p ^= q << k(p) - k(q);
          return (w << 10 | p) ^ M;
        }, b.getBCHTypeNumber = function(w) {
          for (var p = w << 12; k(p) - k(A) >= 0; )
            p ^= A << k(p) - k(A);
          return w << 12 | p;
        }, b.getPatternPosition = function(w) {
          return B[w - 1];
        }, b.getMaskFunction = function(w) {
          switch (w) {
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
              throw "bad maskPattern:" + w;
          }
        }, b.getErrorCorrectPolynomial = function(w) {
          for (var p = u([1], 0), S = 0; S < w; S += 1)
            p = p.multiply(u([1, i.gexp(S)], 0));
          return p;
        }, b.getLengthInBits = function(w, p) {
          if (1 <= p && p < 10)
            switch (w) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + w;
            }
          else if (p < 27)
            switch (w) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + w;
            }
          else if (p < 41)
            switch (w) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + w;
            }
          else
            throw "type:" + p;
        }, b.getLostPoint = function(w) {
          for (var p = w.getModuleCount(), S = 0, x = 0; x < p; x += 1)
            for (var C = 0; C < p; C += 1) {
              for (var N = 0, X = w.isDark(x, C), ne = -1; ne <= 1; ne += 1)
                if (!(x + ne < 0 || p <= x + ne))
                  for (var ie = -1; ie <= 1; ie += 1)
                    C + ie < 0 || p <= C + ie || ne == 0 && ie == 0 || X == w.isDark(x + ne, C + ie) && (N += 1);
              N > 5 && (S += 3 + N - 5);
            }
          for (var x = 0; x < p - 1; x += 1)
            for (var C = 0; C < p - 1; C += 1) {
              var he = 0;
              w.isDark(x, C) && (he += 1), w.isDark(x + 1, C) && (he += 1), w.isDark(x, C + 1) && (he += 1), w.isDark(x + 1, C + 1) && (he += 1), (he == 0 || he == 4) && (S += 3);
            }
          for (var x = 0; x < p; x += 1)
            for (var C = 0; C < p - 6; C += 1)
              w.isDark(x, C) && !w.isDark(x, C + 1) && w.isDark(x, C + 2) && w.isDark(x, C + 3) && w.isDark(x, C + 4) && !w.isDark(x, C + 5) && w.isDark(x, C + 6) && (S += 40);
          for (var C = 0; C < p; C += 1)
            for (var x = 0; x < p - 6; x += 1)
              w.isDark(x, C) && !w.isDark(x + 1, C) && w.isDark(x + 2, C) && w.isDark(x + 3, C) && w.isDark(x + 4, C) && !w.isDark(x + 5, C) && w.isDark(x + 6, C) && (S += 40);
          for (var Ae = 0, C = 0; C < p; C += 1)
            for (var x = 0; x < p; x += 1)
              w.isDark(x, C) && (Ae += 1);
          var He = Math.abs(100 * Ae / p / p - 50) / 5;
          return S += He * 10, S;
        }, b;
      })(), i = (function() {
        for (var B = new Array(256), q = new Array(256), A = 0; A < 8; A += 1)
          B[A] = 1 << A;
        for (var A = 8; A < 256; A += 1)
          B[A] = B[A - 4] ^ B[A - 5] ^ B[A - 6] ^ B[A - 8];
        for (var A = 0; A < 255; A += 1)
          q[B[A]] = A;
        var M = {};
        return M.glog = function(b) {
          if (b < 1)
            throw "glog(" + b + ")";
          return q[b];
        }, M.gexp = function(b) {
          for (; b < 0; )
            b += 255;
          for (; b >= 256; )
            b -= 255;
          return B[b];
        }, M;
      })();
      function u(B, q) {
        if (typeof B.length > "u")
          throw B.length + "/" + q;
        var A = (function() {
          for (var b = 0; b < B.length && B[b] == 0; )
            b += 1;
          for (var k = new Array(B.length - b + q), w = 0; w < B.length - b; w += 1)
            k[w] = B[w + b];
          return k;
        })(), M = {};
        return M.getAt = function(b) {
          return A[b];
        }, M.getLength = function() {
          return A.length;
        }, M.multiply = function(b) {
          for (var k = new Array(M.getLength() + b.getLength() - 1), w = 0; w < M.getLength(); w += 1)
            for (var p = 0; p < b.getLength(); p += 1)
              k[w + p] ^= i.gexp(i.glog(M.getAt(w)) + i.glog(b.getAt(p)));
          return u(k, 0);
        }, M.mod = function(b) {
          if (M.getLength() - b.getLength() < 0)
            return M;
          for (var k = i.glog(M.getAt(0)) - i.glog(b.getAt(0)), w = new Array(M.getLength()), p = 0; p < M.getLength(); p += 1)
            w[p] = M.getAt(p);
          for (var p = 0; p < b.getLength(); p += 1)
            w[p] ^= i.gexp(i.glog(b.getAt(p)) + k);
          return u(w, 0).mod(b);
        }, M;
      }
      var d = (function() {
        var B = [
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
        ], q = function(b, k) {
          var w = {};
          return w.totalCount = b, w.dataCount = k, w;
        }, A = {}, M = function(b, k) {
          switch (k) {
            case o.L:
              return B[(b - 1) * 4 + 0];
            case o.M:
              return B[(b - 1) * 4 + 1];
            case o.Q:
              return B[(b - 1) * 4 + 2];
            case o.H:
              return B[(b - 1) * 4 + 3];
            default:
              return;
          }
        };
        return A.getRSBlocks = function(b, k) {
          var w = M(b, k);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + b + "/errorCorrectionLevel:" + k;
          for (var p = w.length / 3, S = [], x = 0; x < p; x += 1)
            for (var C = w[x * 3 + 0], N = w[x * 3 + 1], X = w[x * 3 + 2], ne = 0; ne < C; ne += 1)
              S.push(q(N, X));
          return S;
        }, A;
      })(), f = function() {
        var B = [], q = 0, A = {};
        return A.getBuffer = function() {
          return B;
        }, A.getAt = function(M) {
          var b = Math.floor(M / 8);
          return (B[b] >>> 7 - M % 8 & 1) == 1;
        }, A.put = function(M, b) {
          for (var k = 0; k < b; k += 1)
            A.putBit((M >>> b - k - 1 & 1) == 1);
        }, A.getLengthInBits = function() {
          return q;
        }, A.putBit = function(M) {
          var b = Math.floor(q / 8);
          B.length <= b && B.push(0), M && (B[b] |= 128 >>> q % 8), q += 1;
        }, A;
      }, m = function(B) {
        var q = s.MODE_NUMBER, A = B, M = {};
        M.getMode = function() {
          return q;
        }, M.getLength = function(w) {
          return A.length;
        }, M.write = function(w) {
          for (var p = A, S = 0; S + 2 < p.length; )
            w.put(b(p.substring(S, S + 3)), 10), S += 3;
          S < p.length && (p.length - S == 1 ? w.put(b(p.substring(S, S + 1)), 4) : p.length - S == 2 && w.put(b(p.substring(S, S + 2)), 7));
        };
        var b = function(w) {
          for (var p = 0, S = 0; S < w.length; S += 1)
            p = p * 10 + k(w.charAt(S));
          return p;
        }, k = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return M;
      }, g = function(B) {
        var q = s.MODE_ALPHA_NUM, A = B, M = {};
        M.getMode = function() {
          return q;
        }, M.getLength = function(k) {
          return A.length;
        }, M.write = function(k) {
          for (var w = A, p = 0; p + 1 < w.length; )
            k.put(
              b(w.charAt(p)) * 45 + b(w.charAt(p + 1)),
              11
            ), p += 2;
          p < w.length && k.put(b(w.charAt(p)), 6);
        };
        var b = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          if ("A" <= k && k <= "Z")
            return k.charCodeAt(0) - 65 + 10;
          switch (k) {
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
              throw "illegal char :" + k;
          }
        };
        return M;
      }, v = function(B) {
        var q = s.MODE_8BIT_BYTE, A = a.stringToBytes(B), M = {};
        return M.getMode = function() {
          return q;
        }, M.getLength = function(b) {
          return A.length;
        }, M.write = function(b) {
          for (var k = 0; k < A.length; k += 1)
            b.put(A[k], 8);
        }, M;
      }, _ = function(B) {
        var q = s.MODE_KANJI, A = a.stringToBytesFuncs.SJIS;
        if (!A)
          throw "sjis not supported.";
        (function(k, w) {
          var p = A(k);
          if (p.length != 2 || (p[0] << 8 | p[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var M = A(B), b = {};
        return b.getMode = function() {
          return q;
        }, b.getLength = function(k) {
          return ~~(M.length / 2);
        }, b.write = function(k) {
          for (var w = M, p = 0; p + 1 < w.length; ) {
            var S = (255 & w[p]) << 8 | 255 & w[p + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), k.put(S, 13), p += 2;
          }
          if (p < w.length)
            throw "illegal char at " + (p + 1);
        }, b;
      }, E = function() {
        var B = [], q = {};
        return q.writeByte = function(A) {
          B.push(A & 255);
        }, q.writeShort = function(A) {
          q.writeByte(A), q.writeByte(A >>> 8);
        }, q.writeBytes = function(A, M, b) {
          M = M || 0, b = b || A.length;
          for (var k = 0; k < b; k += 1)
            q.writeByte(A[k + M]);
        }, q.writeString = function(A) {
          for (var M = 0; M < A.length; M += 1)
            q.writeByte(A.charCodeAt(M));
        }, q.toByteArray = function() {
          return B;
        }, q.toString = function() {
          var A = "";
          A += "[";
          for (var M = 0; M < B.length; M += 1)
            M > 0 && (A += ","), A += B[M];
          return A += "]", A;
        }, q;
      }, T = function() {
        var B = 0, q = 0, A = 0, M = "", b = {}, k = function(p) {
          M += String.fromCharCode(w(p & 63));
        }, w = function(p) {
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
        return b.writeByte = function(p) {
          for (B = B << 8 | p & 255, q += 8, A += 1; q >= 6; )
            k(B >>> q - 6), q -= 6;
        }, b.flush = function() {
          if (q > 0 && (k(B << 6 - q), B = 0, q = 0), A % 3 != 0)
            for (var p = 3 - A % 3, S = 0; S < p; S += 1)
              M += "=";
        }, b.toString = function() {
          return M;
        }, b;
      }, W = function(B) {
        var q = B, A = 0, M = 0, b = 0, k = {};
        k.read = function() {
          for (; b < 8; ) {
            if (A >= q.length) {
              if (b == 0)
                return -1;
              throw "unexpected end of file./" + b;
            }
            var p = q.charAt(A);
            if (A += 1, p == "=")
              return b = 0, -1;
            if (p.match(/^\s$/))
              continue;
            M = M << 6 | w(p.charCodeAt(0)), b += 6;
          }
          var S = M >>> b - 8 & 255;
          return b -= 8, S;
        };
        var w = function(p) {
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
        return k;
      }, J = function(B, q) {
        var A = B, M = q, b = new Array(B * q), k = {};
        k.setPixel = function(x, C, N) {
          b[C * A + x] = N;
        }, k.write = function(x) {
          x.writeString("GIF87a"), x.writeShort(A), x.writeShort(M), x.writeByte(128), x.writeByte(0), x.writeByte(0), x.writeByte(0), x.writeByte(0), x.writeByte(0), x.writeByte(255), x.writeByte(255), x.writeByte(255), x.writeString(","), x.writeShort(0), x.writeShort(0), x.writeShort(A), x.writeShort(M), x.writeByte(0);
          var C = 2, N = p(C);
          x.writeByte(C);
          for (var X = 0; N.length - X > 255; )
            x.writeByte(255), x.writeBytes(N, X, 255), X += 255;
          x.writeByte(N.length - X), x.writeBytes(N, X, N.length - X), x.writeByte(0), x.writeString(";");
        };
        var w = function(x) {
          var C = x, N = 0, X = 0, ne = {};
          return ne.write = function(ie, he) {
            if (ie >>> he)
              throw "length over";
            for (; N + he >= 8; )
              C.writeByte(255 & (ie << N | X)), he -= 8 - N, ie >>>= 8 - N, X = 0, N = 0;
            X = ie << N | X, N = N + he;
          }, ne.flush = function() {
            N > 0 && C.writeByte(X);
          }, ne;
        }, p = function(x) {
          for (var C = 1 << x, N = (1 << x) + 1, X = x + 1, ne = S(), ie = 0; ie < C; ie += 1)
            ne.add(String.fromCharCode(ie));
          ne.add(String.fromCharCode(C)), ne.add(String.fromCharCode(N));
          var he = E(), Ae = w(he);
          Ae.write(C, X);
          var He = 0, ve = String.fromCharCode(b[He]);
          for (He += 1; He < b.length; ) {
            var me = String.fromCharCode(b[He]);
            He += 1, ne.contains(ve + me) ? ve = ve + me : (Ae.write(ne.indexOf(ve), X), ne.size() < 4095 && (ne.size() == 1 << X && (X += 1), ne.add(ve + me)), ve = me);
          }
          return Ae.write(ne.indexOf(ve), X), Ae.write(N, X), Ae.flush(), he.toByteArray();
        }, S = function() {
          var x = {}, C = 0, N = {};
          return N.add = function(X) {
            if (N.contains(X))
              throw "dup key:" + X;
            x[X] = C, C += 1;
          }, N.size = function() {
            return C;
          }, N.indexOf = function(X) {
            return x[X];
          }, N.contains = function(X) {
            return typeof x[X] < "u";
          }, N;
        };
        return k;
      }, D = function(B, q, A) {
        for (var M = J(B, q), b = 0; b < q; b += 1)
          for (var k = 0; k < B; k += 1)
            M.setPixel(k, b, A(k, b));
        var w = E();
        M.write(w);
        for (var p = T(), S = w.toByteArray(), x = 0; x < S.length; x += 1)
          p.writeByte(S[x]);
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
  })(Fa)), Fa.exports;
}
var z5 = U5();
const V5 = /* @__PURE__ */ H5(z5), G5 = ["width", "height", "viewBox"], K5 = ["width", "height"], Y5 = ["d"], J5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const a = V5(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (c(), h("svg", {
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
      }, null, 8, K5),
      y("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Y5)
    ], 8, G5));
  }
}, E8 = /* @__PURE__ */ Y(J5, [["__scopeId", "data-v-489f0852"]]), Z5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, A8 = /* @__PURE__ */ Y(Z5, [["__scopeId", "data-v-47e67f04"]]);
function C8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const O8 = ki(() => import("./VoiceFigure-B7Ysnzfb.js").then((e) => e.V)), T8 = "1.2.0", R8 = "3.5";
export {
  Wd as $,
  _e as A,
  Ce as B,
  sa as C,
  at as D,
  Dx as E,
  Fb as F,
  E$ as G,
  Ix as H,
  kb as I,
  Kb as J,
  At as K,
  t4 as L,
  Ls as M,
  ew as N,
  Gb as O,
  aa as P,
  Q$ as Q,
  l$ as R,
  Ln as S,
  sx as T,
  X4 as U,
  Ee as V,
  zn as W,
  Z4 as X,
  J4 as Y,
  Fd as Z,
  Y as _,
  W4 as a,
  kx as a$,
  Xb as a0,
  r$ as a1,
  i$ as a2,
  Ne as a3,
  b$ as a4,
  y$ as a5,
  St as a6,
  c$ as a7,
  T$ as a8,
  T4 as a9,
  hx as aA,
  J$ as aB,
  ub as aC,
  L$ as aD,
  N$ as aE,
  jx as aF,
  Hr as aG,
  ax as aH,
  fn as aI,
  D4 as aJ,
  B4 as aK,
  Ex as aL,
  hn as aM,
  Tx as aN,
  _$ as aO,
  Z$ as aP,
  X$ as aQ,
  Y$ as aR,
  an as aS,
  $t as aT,
  R4 as aU,
  ey as aV,
  G$ as aW,
  s$ as aX,
  Fr as aY,
  Dt as aZ,
  Ft as a_,
  $x as aa,
  Cx as ab,
  q4 as ac,
  Q4 as ad,
  e$ as ae,
  g$ as af,
  v$ as ag,
  w$ as ah,
  V4 as ai,
  zo as aj,
  u$ as ak,
  O$ as al,
  Wx as am,
  H$ as an,
  F$ as ao,
  q$ as ap,
  k$ as aq,
  m$ as ar,
  h$ as as,
  p$ as at,
  nx as au,
  C$ as av,
  R$ as aw,
  zx as ax,
  Yt as ay,
  I$ as az,
  dw as b,
  Ux as b$,
  Db as b0,
  Ox as b1,
  rx as b2,
  lx as b3,
  My as b4,
  Ar as b5,
  yx as b6,
  A$ as b7,
  ra as b8,
  rt as b9,
  cx as bA,
  px as bB,
  ut as bC,
  ox as bD,
  gx as bE,
  B$ as bF,
  U$ as bG,
  D$ as bH,
  Te as bI,
  S$ as bJ,
  vx as bK,
  Qx as bL,
  e8 as bM,
  C4 as bN,
  ay as bO,
  x$ as bP,
  ux as bQ,
  H4 as bR,
  Fx as bS,
  ix as bT,
  dx as bU,
  fx as bV,
  $$ as bW,
  db as bX,
  M$ as bY,
  P$ as bZ,
  qx as b_,
  mx as ba,
  Aa as bb,
  Ql as bc,
  Gx as bd,
  Jx as be,
  tx as bf,
  _x as bg,
  O4 as bh,
  W$ as bi,
  Kx as bj,
  d$ as bk,
  f$ as bl,
  K4 as bm,
  o$ as bn,
  N4 as bo,
  Mx as bp,
  U4 as bq,
  z4 as br,
  Y4 as bs,
  V$ as bt,
  Y0 as bu,
  Rx as bv,
  Vb as bw,
  G4 as bx,
  j4 as by,
  z$ as bz,
  xy as c,
  Nt as c$,
  L4 as c0,
  I4 as c1,
  j$ as c2,
  Zx as c3,
  qs as c4,
  Xx as c5,
  si as c6,
  Sx as c7,
  n$ as c8,
  t$ as c9,
  ye as cA,
  p8 as cB,
  u4 as cC,
  T8 as cD,
  R8 as cE,
  y4 as cF,
  v8 as cG,
  ns as cH,
  M4 as cI,
  Bv as cJ,
  Mt as cK,
  us as cL,
  ea as cM,
  h4 as cN,
  b4 as cO,
  Pc as cP,
  Zg as cQ,
  M8 as cR,
  p4 as cS,
  E8 as cT,
  sr as cU,
  hu as cV,
  f8 as cW,
  tf as cX,
  l4 as cY,
  _4 as cZ,
  ik as c_,
  Q0 as ca,
  P4 as cb,
  Ub as cc,
  K$ as cd,
  Rs as ce,
  ob as cf,
  ex as cg,
  Jt as ch,
  Lt as ci,
  d4 as cj,
  m8 as ck,
  de as cl,
  Sd as cm,
  Rd as cn,
  xs as co,
  Im as cp,
  Rl as cq,
  S8 as cr,
  A4 as cs,
  Nm as ct,
  eg as cu,
  Qt as cv,
  t8 as cw,
  Q5 as cx,
  xt as cy,
  td as cz,
  ze as d,
  n4 as d$,
  w4 as d0,
  _t as d1,
  pt as d2,
  Op as d3,
  ku as d4,
  $4 as d5,
  r4 as d6,
  Pt as d7,
  g8 as d8,
  _8 as d9,
  Mh as dA,
  n8 as dB,
  s4 as dC,
  b8 as dD,
  Av as dE,
  Ow as dF,
  i4 as dG,
  v4 as dH,
  l8 as dI,
  i8 as dJ,
  Fe as dK,
  f4 as dL,
  m4 as dM,
  Fc as dN,
  pr as dO,
  o8 as dP,
  Gi as dQ,
  o4 as dR,
  a4 as dS,
  $l as dT,
  xl as dU,
  Ru as dV,
  c4 as dW,
  ct as dX,
  C8 as dY,
  Tw as dZ,
  e4 as d_,
  Fs as da,
  ad as db,
  kt as dc,
  k4 as dd,
  ia as de,
  O8 as df,
  A8 as dg,
  Cs as dh,
  r8 as di,
  ps as dj,
  U1 as dk,
  $o as dl,
  cr as dm,
  Ou as dn,
  $8 as dp,
  k8 as dq,
  bs as dr,
  Cu as ds,
  pl as dt,
  g4 as du,
  x8 as dv,
  E4 as dw,
  S4 as dx,
  x4 as dy,
  a8 as dz,
  a$ as e,
  s8 as e0,
  h8 as e1,
  Aw as e2,
  y8 as e3,
  Lg as e4,
  yl as e5,
  vk as e6,
  gs as e7,
  c8 as e8,
  Ua as e9,
  u8 as ea,
  d8 as eb,
  We as ec,
  w8 as ed,
  Tu as ee,
  K0 as f,
  Vx as g,
  sn as h,
  Bx as i,
  Yx as j,
  Lx as k,
  xx as l,
  gw as m,
  Ns as n,
  Ax as o,
  F4 as p,
  Nx as q,
  ni as r,
  ai as s,
  Me as t,
  _y as u,
  bx as v,
  Hx as w,
  wx as x,
  pn as y,
  Px as z
};
