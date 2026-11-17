import { openBlock as r, createElementBlock as d, normalizeStyle as pe, unref as O, renderSlot as ne, createElementVNode as h, normalizeClass as X, Fragment as B, renderList as Z, defineComponent as Wu, Comment as Hu, h as _a, cloneVNode as zu, createBlock as j, withCtx as L, createVNode as A, toDisplayString as v, createCommentVNode as k, ref as E, inject as $e, watch as ce, onMounted as _e, onBeforeUnmount as tt, reactive as nn, shallowRef as lt, onUnmounted as Te, useAttrs as Ca, computed as M, resolveDynamicComponent as Je, mergeProps as Ne, createTextVNode as H, useId as eo, resolveDirective as Uu, withDirectives as ge, Teleport as In, nextTick as Re, Transition as an, withModifiers as he, createApp as Vu, shallowReactive as Gu, withKeys as ze, createSlots as Ea, onScopeDispose as Aa, useModel as Dt, mergeModels as mt, toRef as Fa, resolveComponent as ri, vModelText as Fe, provide as to, onErrorCaptured as Ku, TransitionGroup as no, isRef as Vo, getCurrentInstance as Yu, useSlots as Qu, vShow as ao, getCurrentScope as ui, normalizeProps as bt, guardReactiveProps as ci, vModelSelect as Pt, defineAsyncComponent as Xu } from "vue";
function di(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Ju = 1600, Zu = {
  __name: "Shimmer",
  setup(e) {
    const t = di(Ju);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: pe(O(t))
    }, null, 4));
  }
}, vn = /* @__PURE__ */ U(Zu, [["__scopeId", "data-v-6c018b03"]]), ec = { class: "skeleton-line" }, tc = 2e3, nc = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = di(tc);
    return (n, a) => (r(), d("span", ec, [
      ne(n.$slots, "default", {}, void 0, !0),
      h("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(B, null, Z(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: pe({ ...O(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, Ot = /* @__PURE__ */ U(nc, [["__scopeId", "data-v-484fe8a0"]]), At = Wu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Hu);
      return a.length !== 1 ? _a(B, { key: n }, a) : a[0].key == null ? zu(a[0], { key: n }) : a[0];
    };
  }
}), ac = ["aria-label"], sc = ["aria-label"], oc = ["aria-label"], lc = ["aria-label"], ic = ["aria-label"], rc = ["aria-label"], uc = ["aria-label"], cc = {
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
    ], l = ["94%", "88%", "91%", "62%"].map((u) => ({ width: u, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (u, c) => (r(), j(At, { value: e.shape }, {
      messages: L(() => [
        h("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(B, null, Z(t, (f) => A(vn, {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: pe({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, ac)
      ]),
      older: L(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(t.slice(0, 3), (f) => (r(), j(vn, {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: pe({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, sc)
      ]),
      cards: L(() => [
        h("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(B, null, Z(n, (m) => A(Ot, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, oc)
      ]),
      file: L(() => [
        h("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(Ot, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(B, null, Z(s, (m) => A(Ot, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, lc)
      ]),
      page: L(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(Ot, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(B, null, Z(e.count, (f) => (r(), j(Ot, {
            key: f,
            bars: O(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ic)
      ]),
      text: L(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), j(Ot, {
            key: f,
            bars: O(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, rc)
      ]),
      default: L(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), j(Ot, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, uc)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, nt = /* @__PURE__ */ U(cc, [["__scopeId", "data-v-ef519c5f"]]), dc = {
  key: 1,
  class: "empty-state titled"
}, fc = { class: "empty-state-title" }, mc = { class: "empty-state-text" }, hc = {
  key: 2,
  class: "empty-state"
}, pc = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), j(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", dc, [
      h("p", fc, v(e.title), 1),
      h("p", mc, [
        ne(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", hc, [
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, St = /* @__PURE__ */ U(pc, [["__scopeId", "data-v-b27e89b0"]]), vc = { class: "fold-group" }, gc = ["aria-expanded"], yc = { class: "fold-label" }, bc = {
  key: 0,
  class: "fold-count"
}, kc = {
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
    return (a, s) => (r(), d("div", vc, [
      h("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", yc, v(e.label), 1),
        e.count !== "" ? (r(), d("span", bc, v(e.count), 1)) : k("", !0),
        h("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, gc),
      e.open ? ne(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, lA = /* @__PURE__ */ U(kc, [["__scopeId", "data-v-9ef1865c"]]), wc = 150, $c = () => wc;
function so(e, t, n = $c(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function fi(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((u) => [u, a[u]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let i = !1;
  try {
    const u = await n(t);
    return i = u.ok, u;
  } finally {
    i || l();
  }
}
const xc = 50, Go = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function iA(e) {
  const t = at().sources.find((n) => n.key === e);
  return t ? Ms(t.read, t.events) : Ms("", []);
}
function mi(e, t, n, a, s = () => !1) {
  const o = E([]), l = E(null), i = E(""), u = E(!1), c = performance.now(), f = E(!1), m = E(""), p = E(null), b = /* @__PURE__ */ new Set();
  let $ = null;
  function y(g) {
    return s() ? (b.add(g), $ ?? ($ = new Promise((S) => setTimeout(() => S(w()), xc)))) : x(g);
  }
  async function w() {
    const g = new Set(b);
    b.clear(), $ = null;
    const S = P, T = await t({ ids: [...g].join(","), limit: g.size });
    if (S !== P) return;
    if (!T.ok) return R();
    const N = new Map(T.value.rows.map((V) => [V.id, V]));
    o.value = o.value.flatMap((V) => g.has(V.id) ? N.has(V.id) ? [N.get(V.id)] : [] : [V]);
  }
  async function x(g) {
    const S = P, T = await t({ "before-id": g + 1, limit: 1 });
    if (S !== P) return;
    if (!T.ok) return R();
    const N = T.value.rows.find((V) => V.id === g);
    o.value = N ? o.value.map((V) => V.id === g ? N : V) : o.value.filter((V) => V.id !== g);
  }
  async function C(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ee) => ee.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((ee) => ee.id === g.row_id)) return y(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return R();
    const T = Math.max(...o.value.map((ee) => ee.id)), N = P, V = await t({ "after-id": T });
    if (N !== P) return;
    if (!V.ok) return R();
    const J = new Set(o.value.map((ee) => ee.id));
    o.value = [...V.value.rows.filter((ee) => !J.has(ee.id)), ...o.value];
  }
  async function q() {
    if (!f.value || !o.value.length) return !1;
    const g = P, S = Math.min(...o.value.map((V) => V.id)), T = await t({ "before-id": S });
    if (g !== P) return !1;
    if (!T.ok || !T.value.rows.length) return f.value = !1;
    f.value = Go(T.value, n());
    const N = new Set(o.value.map((V) => V.id));
    return o.value = [...o.value, ...T.value.rows.filter((V) => !N.has(V.id))], !0;
  }
  let P = 0;
  function I(g, S) {
    var V, J;
    const T = g.ok ? e.shared ? [g.value] : ((V = g.value) == null ? void 0 : V.rows) ?? [] : [];
    g.ok && (o.value = S(T)), l.value = g.ok ? g.value : null;
    const N = T.length ? Math.min(...T.map((ee) => ee.id)) : 0;
    g.ok && ((J = g.value) != null && J.rows) && !o.value.some((ee) => ee.id < N) && (f.value = !e.shared && Go(g.value, n())), i.value = g.ok ? "" : g.error, so(c, () => u.value = !0);
  }
  async function Q(g) {
    const S = ++P, T = await t({});
    S === P && I(T, g);
  }
  const W = (g) => {
    if (!a() || !g.length) return g;
    const S = Math.min(...g.map((N) => N.id)), T = Math.max(...g.map((N) => N.id));
    return [...o.value.filter((N) => N.id > T), ...g, ...o.value.filter((N) => N.id < S)];
  }, R = () => Q(W), D = (g) => I(g, W), G = () => Q((g) => g);
  async function _(g, S = null) {
    const T = await fi(S && { target: o, fields: { value: S(o.value) } }, g, e.run);
    return m.value = T.ok ? "" : T.error, p.value = T.ok ? T.value : null, await R(), T;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: R, loadLatest: G, older: q, act: _, actionFailure: m, answer: p, context: e, heard: C, showFirst: D, pageSize: n };
}
const Sc = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ms(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = at(), l = mi(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Sc(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Mc = 2e3;
function oo(e, t, n = Mc) {
  let a = null, s = !1, o = !1, l = !1;
  const i = $e(Be, null), u = () => {
    var y;
    return ((y = i == null ? void 0 : i.visible) == null ? void 0 : y.value) === !1;
  }, c = () => document.hidden || u(), f = async (y) => {
    o = !0;
    try {
      await y();
    } catch {
    } finally {
      o = !1;
    }
  }, m = () => f(async () => t() && await e()), p = () => {
    s || c() || (a = setTimeout(
      async () => {
        c() || await m(), p();
      },
      typeof n == "function" ? n() : n
    ));
  }, b = async () => {
    l = !0, await f(e), p();
  }, $ = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return b();
      await m(), p();
    }
  };
  ce(() => {
    var y;
    return (y = i == null ? void 0 : i.visible) == null ? void 0 : y.value;
  }, $), _e(async () => {
    document.addEventListener("visibilitychange", $), u() || await b();
  }), tt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", $);
  });
}
const hi = typeof document < "u" && document.documentElement.classList.contains("phone"), pi = 120;
var li;
const Wa = globalThis[li = Symbol.for("journal.pressed")] ?? (globalThis[li] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function _c(e = 0) {
  const t = Wa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Wa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Wa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function _s(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function vi(e = window) {
  if (!_s(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    _s(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Cs = "journal.stale-build-reload", Cc = 'script[type="module"][src*="/assets/index-"]', Ko = (e) => {
  var t;
  return ((t = e.querySelector(Cc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Ec(e = document, t = (a, s) => Ee.quietRead(a, s), n = () => vi(window)) {
  const a = Ko(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Ko(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ha = "";
function Ac(e, t = () => vi(window)) {
  if (!e) return !1;
  const n = !!Ha && Ha !== e;
  return Ha = e, n && t(), n;
}
const Oc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Tc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Cs) === e.message) return !1;
    t.setItem(Cs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Ic(e = window.sessionStorage) {
  try {
    e.removeItem(Cs);
  } catch {
    return;
  }
}
const Bc = 2e3, Rc = 3e4, Xe = nn({ starting: !1, external: !1, late: !1, offline: !1 }), lo = () => Xe.starting, Lc = 3;
let zn = 0, Es = 0, gi = 0, yi = [];
async function Nc() {
  try {
    const e = await Ee.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Xe.external };
  }
}
let Yo = null;
const qc = () => Yo ?? (Yo = Nc().finally(() => Yo = null));
function Dc() {
  clearTimeout(Es), clearTimeout(gi), Es = 0, Object.assign(Xe, { starting: !1, external: !1, late: !1, offline: !1 }), yi.splice(0).forEach((e) => e()), Ec();
}
async function Pc() {
  Xe.offline = !navigator.onLine;
  const e = await qc();
  if (Xe.external = e.updating, zn = !e.restarting && !e.updating && e.reachable ? zn + 1 : 0, zn < Lc) return;
  zn = 0, (!Ac(e.started_at) || _s()) && Dc();
}
function bi() {
  Es = setTimeout(async () => {
    await Pc(), Xe.starting && bi();
  }, Bc);
}
function Qo() {
  Xe.starting || (Xe.starting = !0, Xe.offline = !navigator.onLine, bi(), gi = setTimeout(() => Xe.late = !0, Rc));
}
const ki = () => Xe.starting ? new Promise((e) => yi.push(e)) : Promise.resolve();
function Oa(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const i = () => {
    o = !1, a = Date.now(), l && (l = !1, c());
  }, u = () => {
    s = null;
    const f = e();
    a = Date.now(), f instanceof Promise && (o = !0, f.catch(() => {
    }).finally(i));
  }, c = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const f = t - (Date.now() - a);
    f <= 0 ? u() : s = setTimeout(u, f);
  };
  return c.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, c;
}
function jc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Fc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Oa(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = jc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const vt = "viewer.shell";
function Wc(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Un = 2e4, Hc = 4, Xo = "/api/read-lines", zc = 5e3, Uc = 403, Jo = "/api/repeated-lines", Vc = 10, Gc = 2e3, Kc = 3e5, rA = 6e5, Yc = "X-Journal-Window-Hidden", Vn = 6, Qc = 500, Xc = "/journal/summary", Zo = "/api/server-state", Jc = 2e4, Gn = hi ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Zc = (e) => e.split("?")[0].endsWith(Xc), As = (e, t) => Object.assign(new Error(t), { status: e });
async function ed(e, t, n = As) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const td = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), nd = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), el = (e) => e.split(" ").slice(0, 2).join(" "), rt = "read", Vt = "write", ad = "stream";
class sd {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Vn;
  }
  // what is in flight, of one window or of all: each with its window, line, kind (read, write or stream), address and started_at
  inFlight(t = null) {
    return [...this.flights].filter((n) => t === null || n.window === t).map((n) => ({ ...n }));
  }
  // how many requests a window has sent, by term and verb
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = el(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < Gc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Vc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Jo, { method: "POST", headers: { ...Gn, "Content-Type": "application/json" }, body: i }, [{ window: vt, line: Jo, kind: Vt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = _c(n ? pi : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [Yc]: Wc() ? "1" : "0" } }, i = s ? { ...l, signal: nd(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Vt ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = Un) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      if (!(o instanceof TypeError)) throw o;
      if ((n.method || "GET") === "GET")
        try {
          return await this.out(t, n, a, s);
        } catch (l) {
          throw l instanceof TypeError && Qo(), l;
        }
      throw Qo(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Hc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Xo, { headers: Gn }, [{ window: vt, line: Xo, kind: rt }], zc).then(async (t) => {
      if (t.status === Uc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw As(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Fc(
      (l, i) => n(l, s ? this.readAttribution(i) : void 0),
      () => this.joinedReads.delete(t),
      (l, i) => {
        s && this.trackRead(s, l, i);
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = el(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
    a === "asked" && s.callers > 1 && (i.joined_callers += 1), a === "sent" && s.trailingOf && (i.trailing_reads += 1), o.set(l, i), this.joinCounts.set(t, o), !(a !== "answered" || !this.recording) && (this.readReceipts.push(this.readAttribution(s)), this.receiptTimer ?? (this.receiptTimer = setTimeout(() => this.flushReadReceipts(), 50)));
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
      this.tries = Vn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Gn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: td(a) }, c = s || (i ? Kc : Un);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: vt, line: n, kind: rt }], c)) : await this.sent(n, u, [{ window: vt, line: n, kind: Vt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, Qc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Vn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return ed(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: vt, line: t, kind: rt }], Un)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Gn });
    if (!n.ok) throw As(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Vn, o).then((i) => (this.written(n), i)) : lo() && !Zc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: vt, line: t, kind: ad }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Zo, { cache: "no-store" }, [{ window: vt, line: Zo, kind: rt }], Jc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = vt, line: s = t, limit: o = Un } = {}) {
    const l = (n.method ?? "GET") === "GET" ? rt : Vt;
    return l === Vt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const za = Symbol.for("journal.transport"), Ee = globalThis[za] ?? (globalThis[za] = new sd());
class wi {
  constructor() {
    this.following = lt([]), this.held = /* @__PURE__ */ new Set();
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
    Ee.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => io(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function io(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const $i = (e, t) => !e.row_id || t.has(e.row_id), od = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, ld = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, id = 50, rd = "refresh", ud = 1e3, cd = 3e4, dd = "requested", fd = "after_window", md = 50, Kn = ".*", hd = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function pd(e) {
  const t = {}, n = nn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = (_) => u[_] ?? u[`${_.slice(0, _.lastIndexOf("."))}.*`] ?? {};
  function b(_) {
    const g = () => p(_), S = E(void 0), T = mi(e, async (N) => {
      const V = await w(_, N);
      return V.ok && !Object.keys(N).length && (S.value = V.value), V;
    }, () => g().page_size || md, () => !!g().page_size, () => !!g().reads_ids);
    return t[_] = { ...T, data: S, readAt: 0 };
  }
  const $ = new Proxy({}, { get: (_, g) => typeof g != "string" || g.startsWith("__v") ? void 0 : t[g] ?? b(g) }), y = (_) => (u[_].loading !== dd || _.endsWith(Kn)) && (!u[_].tab || u[_].tab === n.tab);
  function w(_, g = {}) {
    return new Promise((S) => {
      a.push({ name: _, flags: g, resolve: S }), a.length === 1 && setTimeout(x);
    });
  }
  async function x() {
    const _ = /* @__PURE__ */ new Map(), g = a.splice(0).filter((N) => {
      const V = JSON.stringify(N.flags);
      return _.has(N.name) || _.set(N.name, V), _.get(N.name) === V ? !0 : (a.push(N), !1);
    });
    a.length && setTimeout(x);
    const S = Object.fromEntries(g.flatMap(({ name: N, flags: V }) => Object.entries(V).map(([J, ee]) => [`${N}.${J}`, ee]))), T = await e.readKeys({ only: [...new Set(g.map(({ name: N }) => N))], state: { ...n, ...S } });
    g.forEach(({ name: N, resolve: V }) => V(T.ok ? T.value.keys[N] : T));
  }
  async function C(_) {
    var N;
    const g = ++f;
    (_.length ? _ : Object.keys(u).filter((V) => !V.endsWith(Kn) && u[V].loading === "first" && y(V))).forEach((V) => l[V] = g);
    const T = await e.readKeys({ only: _, state: { ...n } });
    if (!T.ok) {
      if (T.failure === "cancelled") return !1;
      const V = (_.length ? _ : Object.keys(t)).filter((ee) => (l[ee] ?? 0) <= g);
      V.forEach((ee) => {
        $[ee].readAt = Date.now(), T.failure === "unreachable" ? i.add(ee) : i.delete(ee), $[ee].showFirst(T);
      });
      const J = T.failure === "unreachable" && ((N = e.waitForServer) == null ? void 0 : N.call(e));
      return J && J.then(() => {
        if (m) return;
        const ee = V.filter((oe) => l[oe] === g);
        (ee.length || !_.length && !V.length && f === g) && C(ee);
      }), !1;
    }
    return D(T.value.declared), Object.entries(T.value.keys).forEach(([V, J]) => {
      (l[V] ?? 0) > g || (l[V] = g, $[V].readAt = Date.now(), i.delete(V), J.ok && ($[V].data.value = J.value), $[V].showFirst(J));
    }), !0;
  }
  function q(_) {
    const g = hd(_);
    return g.length ? (g.forEach((S) => o.names.add(S)), o.answer ?? (o.answer = new Promise((S) => setTimeout(() => {
      const T = [...o.names];
      o.names.clear(), o.answer = null, S(C(T));
    })))) : C([]);
  }
  function P(_) {
    _.forEach((g) => s.add(g)), clearTimeout(c), c = setTimeout(() => {
      const g = [...s];
      s.clear(), g.length && q(g);
    }, id);
  }
  const I = (_) => _.endsWith(Kn) ? Object.keys(t).filter((g) => g.startsWith(_.slice(0, -1)) && t[g].readAt) : [_], Q = (_, g) => {
    const S = p(_).event_column;
    return !S || ld(g, S, /* @__PURE__ */ new Set([Number(_.slice(_.lastIndexOf(".") + 1))]));
  }, W = (_) => (u[_] ?? u[`${_.split(".")[0]}.*`]).reload_seconds;
  function R(_) {
    const g = Object.keys(u).filter((T) => _.event === rd || u[T].events.some((N) => io(N, _.event)));
    g.filter((T) => u[T].page_size).forEach((T) => $[T].heard(_));
    const S = g.filter((T) => !u[T].page_size);
    S.filter((T) => !y(T)).forEach((T) => $[T].readAt = 0), P(S.filter(y).flatMap(I).filter((T) => Q(T, _)));
  }
  function D(_) {
    if (Object.keys(u).length) return;
    u = _;
    const g = [...new Set(Object.values(_).flatMap((T) => T.events))];
    g.length && e.follow(g, R);
    const S = Object.keys(_).filter((T) => _[T].loading === fd);
    S.length && C(S);
  }
  ce(() => n.tab, () => {
    const _ = Object.keys(u).filter((g) => !g.endsWith(Kn) && y(g) && !$[g].readAt);
    _.length && C(_);
  }), Te(() => {
    m = !0, clearTimeout(c);
  });
  function G() {
    const _ = Date.now(), g = Object.keys(u).filter((S) => u[S].reload_seconds > 0 && y(S)).flatMap(I).filter((S) => _ - $[S].readAt >= (i.has(S) ? Math.min(W(S) * 1e3, cd) : W(S) * 1e3));
    g.length && P(g);
  }
  return oo(G, () => e.visible.value, ud), queueMicrotask(() => C([])), { props: $, state: n, reload: q, readKey: w };
}
const vd = Symbol("open-view"), Be = Symbol.for("journal.window-context"), xi = Symbol("dock-card"), Si = Symbol.for("journal.inspector-actions");
function gd(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = pd(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function at() {
  const e = $e(Be, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return gd(e);
}
const yd = (e, t) => e(xi, t), uA = () => $e(xi), Os = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', tl = {
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
  agent: Os,
  worker: Os,
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
}, bd = ["data-icon", "stroke-width", "innerHTML"], se = {
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
      agent: Os,
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
      code: '<path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (o, l) => (r(), d("svg", {
      class: "ico",
      "data-icon": e.name,
      style: pe({
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
    }, null, 12, bd));
  }
}, kd = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: pe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, wd = /* @__PURE__ */ U(kd, [["__scopeId", "data-v-eb453d6f"]]), $d = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Ca(), a = M(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = E(!1), o = M(() => t.busy || s.value), l = $e(Be, null), i = M(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, pi);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(m), s.value = !1;
      }
    }
    return (c, f) => (r(), j(Je(e.href ? "a" : "button"), Ne(a.value, {
      type: e.href ? void 0 : O(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: L(() => [
        h("span", {
          class: X(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), j(se, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          ne(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), j(wd, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ie = /* @__PURE__ */ U($d, [["__scopeId", "data-v-ededdadf"]]), xd = ["disabled"], Sd = {
  __name: "MoreButton",
  props: { disabled: Boolean },
  emits: ["click"],
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: "more-button",
      disabled: e.disabled,
      onClick: n[0] || (n[0] = (a) => t.$emit("click", a))
    }, [
      ne(t.$slots, "default", {}, () => [
        n[1] || (n[1] = H("Show more", -1))
      ], !0)
    ], 8, xd));
  }
}, Mi = /* @__PURE__ */ U(Sd, [["__scopeId", "data-v-a8b20d76"]]), Md = ["aria-checked", "aria-haspopup", "onClick"], _d = {
  key: 0,
  class: "segmented-dot"
}, Cd = {
  key: 1,
  class: "segmented-note"
}, Ed = {
  key: 2,
  class: "segmented-count"
}, Ad = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = eo();
    return (s, o) => {
      const l = Uu("tip");
      return r(), d("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(B, null, Z(e.options, (i) => ge((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: X(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", _d)) : k("", !0),
          H(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Cd, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", Ed, v(i.count), 1)) : k("", !0)
        ], 10, Md)), [
          [l, i.tip || i.title, `${O(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Mt = /* @__PURE__ */ U(Ad, [["__scopeId", "data-v-c89bc92d"]]), Od = {
  key: 0,
  class: "more-items"
}, Td = {
  key: 0,
  role: "alert"
}, Id = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", Od, [
      e.failure ? (r(), d("p", Td, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), j(Mi, {
        key: 1,
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: L(() => [
          H(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, Bn = /* @__PURE__ */ U(Id, [["__scopeId", "data-v-5da5456e"]]), Bd = { class: "link-group" }, Rd = {
  class: "group-label",
  "data-link-kind": ""
}, Ld = ["disabled", "onClick"], Nd = { class: "title" }, qd = { class: "relations" }, Dd = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = M(() => s.value ? n.rows : n.rows.slice(0, 3)), l = M(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", Bd, [
      h("div", Rd, v(l.value), 1),
      (r(!0), d(B, null, Z(o.value, (p) => (r(), d("button", Ne({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (b) => a("open", p)
      }), [
        h("span", Nd, v(p.endpoint.title), 1),
        h("span", qd, [
          H(v(c(p)), 1),
          i(p) ? (r(), d(B, { key: 0 }, [
            H(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Ld))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Pd = /* @__PURE__ */ U(Dd, [["__scopeId", "data-v-be6f079c"]]), jd = ["data-loaded"], Fd = { class: "rows" }, Wd = ["disabled", "onClick"], Hd = { class: "title" }, zd = { class: "relations" }, Ud = { key: 2 }, Vd = {
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
    pinned: Boolean,
    onlyKinds: { type: Array, default: () => [] },
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E({}), l = E(0), i = E(""), u = E(null), c = E(!1), f = E("");
    let m = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, b = (R) => p[R] || `${R.replaceAll("_", " ").replace(/^./, (D) => D.toUpperCase())}s`, $ = M(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((R, D) => R + D, 0) },
      ...Object.entries(o.value).filter(([R]) => !n.onlyKinds.length || n.onlyKinds.includes(R)).map(([R, D]) => ({ key: R, label: b(R), count: D }))
    ]), y = M(() => {
      const R = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((G) => G.endpoint.model))].map((G) => [G, s.value.filter((_) => _.endpoint.model === G).length])), D = { doc: 0, task: 1, message: 2 };
      return Object.entries(R).sort(([G], [_]) => (D[G] ?? 3) - (D[_] ?? 3)).map(([G, _]) => ({ model: G, count: _, rows: s.value.filter((g) => g.endpoint.model === G) }));
    }), w = (R) => R.endpoint.unavailable || !R.endpoint.open_ref, x = (R) => ({ [n.linkAttribute]: !0, "data-link-model": R.endpoint.model, "data-link-id": R.endpoint.id }), C = (R) => `${R.endpoint.model === "doc" && R.endpoint.id === n.documentId ? "Design document" : R.endpoint.model.replaceAll("_", " ").replace(/^./, (D) => D.toUpperCase())} ${R.endpoint.id}, ${R.relations.map((D) => D.replaceAll("_", " ")).join(", ")}`;
    async function q(R = 1) {
      const D = ++m;
      c.value = !0, f.value = "";
      const G = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(R), "--page-size", String(n.pageSize)];
      n.outsidePlan && G.push("--outside-plan"), n.documentId && G.push("--first-counterpart", `doc:${n.documentId}`), i.value && G.push("--kind", i.value);
      try {
        const _ = await n.read(G);
        if (D !== m) return;
        if (!_.ok) {
          f.value = _.error;
          return;
        }
        const g = _.value.counterparts ?? [], S = R === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(S.map((T) => [`${T.endpoint.model}:${T.endpoint.id}`, T])).values()], o.value = _.value.categories ?? {}, l.value = _.value.total, u.value = _.value.next_page ?? null;
      } catch (_) {
        D === m && (f.value = _.message);
      } finally {
        D === m && (c.value = !1);
      }
    }
    function P(R) {
      if (w(R)) return;
      const [D, G] = R.endpoint.open_ref.split(":");
      a("open", { table: D, id: Number(G) });
    }
    function I(R) {
      i.value = R, q();
    }
    const Q = () => !c.value && u.value && q(u.value), W = M(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ce(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", q();
    }, { immediate: !0 }), (R, D) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: X(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      $.value.length > 2 ? (r(), j(Mt, {
        key: 0,
        options: $.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : k("", !0),
      h("div", Fd, [
        e.grouped ? (r(!0), d(B, { key: 0 }, Z(y.value, (G) => (r(), j(Pd, {
          key: G.model,
          model: G.model,
          count: G.count,
          rows: G.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: P
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(B, { key: 1 }, Z(s.value, (G) => (r(), d("button", Ne({
          key: `${G.endpoint.model}:${G.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, x(G), {
          disabled: w(G),
          onClick: (_) => P(G)
        }), [
          h("span", Hd, v(G.endpoint.title), 1),
          h("span", zd, [
            H(v(C(G)), 1),
            w(G) ? (r(), d(B, { key: 0 }, [
              H(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Wd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Ud, v(e.empty), 1)) : k("", !0),
        A(Bn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: W.value,
          onMore: Q
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, jd)) : k("", !0);
  }
}, Gd = /* @__PURE__ */ U(Vd, [["__scopeId", "data-v-3b23de37"]]), Kd = (e, t, n) => Math.max(t, Math.min(n, e)), Yd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, _i = /* @__PURE__ */ new WeakMap(), Qd = (e, t) => _i.set(e, t);
function Xd(e, t) {
  for (let n = t; n; n = _i.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ci(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Xd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const Tt = 8, Jd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    // a spot on the screen instead of an element: {x, y}, and flipX when it opens leftward from there (a submenu opens beside its item)
    point: { type: Object, default: null },
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
    const a = e, s = E(null), o = (S) => S ? `${S}px` : void 0, l = M(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = E({ w: 0, h: 0 }), u = (S) => ({ left: S.x, right: S.flipX ?? S.x, top: S.y, bottom: S.y }), c = E(a.anchor ? a.anchor.getBoundingClientRect() : a.point ? u(a.point) : null), f = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), m = (S) => ({
      left: Math.max(0, S.left),
      top: Math.max(0, S.top),
      right: Math.min(window.innerWidth, S.right),
      bottom: Math.min(window.innerHeight, S.bottom)
    }), p = (S) => {
      const T = S.closest(".pane, .float-window");
      return T ? m(T.getBoundingClientRect()) : f();
    }, b = (S, T) => `${Math.max(0, S ? Math.min(S, T) : T)}px`;
    function $(S, T) {
      return {
        below: S.bottom - T.bottom - a.gap - Tt,
        above: T.top - S.top - a.gap - Tt,
        across: S.right - S.left - 2 * Tt
      };
    }
    function y(S) {
      if (!a.anchor) return f();
      const T = p(a.anchor), N = $(T, S);
      return i.value.w <= N.across && i.value.h <= Math.max(N.below, N.above) ? T : f();
    }
    const w = M(() => {
      if (!c.value) return l.value;
      const S = c.value, T = y(S), N = $(T, S), { w: V, h: J } = i.value, ee = a.point ? S.left + V > T.right - Tt : a.align === "auto" ? S.left + S.right > T.left + T.right : a.align === "right", oe = Kd(ee ? S.right - V : S.left, T.left + Tt, Math.max(T.left + Tt, T.right - V - Tt)), ke = J > N.below && N.above > N.below ? { bottom: `${window.innerHeight - S.top + a.gap}px`, maxHeight: b(a.maxHeight, N.above) } : { top: `${S.bottom + a.gap}px`, maxHeight: b(a.maxHeight, N.below) };
      return { ...l.value, ...ke, left: `${oe}px`, maxWidth: b(a.maxWidth, N.across) };
    }), x = n, C = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function q(S) {
      const T = C(), N = T.indexOf(document.activeElement);
      T[(N + S + T.length) % T.length].focus();
    }
    const P = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => x("close") }, I = (S) => P[S.key] && (S.preventDefault(), P[S.key]()), Q = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let W = 0;
    const R = new ResizeObserver(() => {
      cancelAnimationFrame(W), W = requestAnimationFrame(Q);
    });
    Ci(s, (S) => a.anchor && !a.anchor.contains(S.target) && x("close"));
    const D = (S, T) => ["top", "left", "right", "bottom"].some((N) => Math.abs(S[N] - T[N]) > 1), G = (S) => S.bottom < 0 || S.top > window.innerHeight;
    let _ = 0;
    function g() {
      if (a.anchor) {
        const S = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || G(S)) return x("close");
        D(S, c.value) && (c.value = S);
      }
      _ = requestAnimationFrame(g);
    }
    return _e(() => {
      a.anchor && s.value && Qd(s.value, a.anchor), Q(), s.value && R.observe(s.value), !a.plain && C()[0] && C()[0].focus(), g();
    }), Te(() => {
      R.disconnect(), cancelAnimationFrame(_), cancelAnimationFrame(W);
    }), t({ element: s }), (S, T) => (r(), j(In, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      h("div", Ne({
        ref_key: "panel",
        ref: s
      }, S.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: w.value,
        onKeydown: I
      }), [
        ne(S.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Wt = /* @__PURE__ */ U(Jd, [["__scopeId", "data-v-8094ec27"]]), Zd = { class: "split-button" }, ef = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = E(null), s = E(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", Zd, [
      A(ie, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: L(() => [
          ne(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      h("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        A(ie, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: L(() => [
            A(se, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), j(Wt, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: L(() => [
          ne(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, tf = /* @__PURE__ */ U(ef, [["__scopeId", "data-v-c258494d"]]), nf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, af = {
  key: 1,
  class: "menu-item-text"
}, sf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", nf, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", af, [
        h("span", null, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, v(e.description), 1)
      ])) : ne(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, We = /* @__PURE__ */ U(sf, [["__scopeId", "data-v-fec99974"]]), of = ["aria-expanded"], lf = { class: "drop-label" }, rf = ["value"], uf = {
  key: 1,
  class: "drop-lead"
}, cf = { class: "drop-item-text" }, df = {
  key: 2,
  class: "drop-note"
}, ff = {
  key: 1,
  class: "drop-none"
}, mf = {
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
    const n = e, a = t, s = E(!1), o = E(null), l = E(""), i = M(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function u(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (r(), d("div", {
      class: X(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      h("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: X(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (m) => s.value = !s.value)
      }, [
        e.icon ? (r(), j(se, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        h("span", lf, v(e.label), 1),
        A(se, {
          name: "down",
          size: 11
        })
      ], 10, of),
      s.value ? (r(), j(Wt, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (m) => s.value = !1)
      }, {
        default: L(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (m) => l.value = m.target.value)
          }, null, 40, rf)) : k("", !0),
          (r(!0), d(B, null, Z(i.value, (m) => (r(), j(We, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (p) => u(m)
          }, {
            default: L(() => [
              m.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: X(["drop-dot", { live: m.running }])
              }, null, 2)) : k("", !0),
              m.lead ? (r(), d("span", uf, v(m.lead), 1)) : k("", !0),
              h("span", cf, v(m.label), 1),
              m.note ? (r(), d("span", df, v(m.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", ff, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, ro = /* @__PURE__ */ U(mf, [["__scopeId", "data-v-29dfcce5"]]), hf = 0, pf = "/api/lines", vf = "/api/line", nl = 5e3, al = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), sl = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ua = (e) => JSON.stringify(e.line), ol = () => new DOMException("cancelled", "AbortError");
class gf {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ua(t))) {
        Ee.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Vt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ee.whenFree(() => this.send()), hf));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(ol())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(ol()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ee.sent(pf, al({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => sl(i.body, rt)), nl);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ee.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, rt), Date.now() - n < nl ? this.slow.delete(Ua(t.body)) : this.slow.add(Ua(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ee.sent(vf, al(t.body, t.signal), [sl(t.body, n)], n === rt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Ei = new gf(), yf = "/api/window";
function bf(e, t, n, a, s) {
  const o = Object.fromEntries(Object.entries(a).filter(([, f]) => f !== "" && f !== null && f !== void 0)), l = new URLSearchParams({ environment: t, ...o }), i = `${yf}?${l}`, u = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, c = (f) => Ee.whenFree(async () => {
    const m = await Ee.sent(i, { signal: f, headers: u }, [{ window: e, line: i, kind: rt }]);
    if (!m.ok) throw new Error((await m.json()).error);
    return m.json();
  });
  return Ee.joined(`${e} ${n.join(",")} ${l}`, c, s);
}
const Ai = /* @__PURE__ */ new Map();
class kf {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = lt({ buttons: [], missing: {} }), this.loading = lt(!1), this.loaded = lt(!1), this.failed = lt(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Ee.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function cA(e, t) {
  const n = new kf(e, t);
  return Ai.set(e, n), n.load().catch(() => {
  }), n;
}
const uo = (e) => Ai.get(e);
function wf(e, t, n) {
  const a = uo(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function $f(e, t) {
  if (!e) return !0;
  const n = uo(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const xf = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Oi = {};
async function dA(e = (t) => Ee.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Oi = (await t.json()).states);
}
const co = (e, t) => {
  var n;
  return (n = Oi[e]) == null ? void 0 : n[t];
}, Jt = (e, t) => {
  var n;
  return ((n = co(e, t)) == null ? void 0 : n.label) ?? xf(t);
}, fo = (e, t) => {
  var n;
  return ((n = co(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Sf = (e, t) => {
  var n;
  return ((n = co(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, Mf = Symbol("pane-page"), Ta = Symbol("inspector-host"), Ti = { 1: "refused", 2: "usage", 3: "fault" }, _f = 100, Cf = 50, Ef = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Af = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Of({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = E({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: b = [], sources: $ = [], links: y = {}, search: w = {}, readOnly: x = !1, shared: C = null }) {
  const q = /* @__PURE__ */ new Map(), P = (J, ee) => l.follow(e, J, (oe) => {
    q.clear(), ee(oe);
  }, a), I = new AbortController(), Q = E(!1), W = performance.now();
  let R = 0, D = 0, G = () => {
  };
  const _ = new Promise((J) => G = J);
  I.signal.addEventListener("abort", G, { once: !0 });
  const g = () => {
    clearTimeout(D), D = setTimeout(() => {
      R === 0 && so(W, () => {
        Q.value = !0, G();
      });
    }, Cf);
  }, S = (J, ee) => (R += 1, Nt(e, J, t, I.signal, ee).finally(() => {
    R -= 1, g();
  })), T = (J, ee) => (g(), _.then(() => I.signal.aborted ? ht : Nt(e, J, t, I.signal, ee))), N = ({ only: J = [], state: ee = {} } = {}) => (R += 1, If(() => bf(e, t, J, ee, I.signal), I.signal).finally(() => {
    R -= 1, g();
  })), V = (J, { unbatched: ee = !1, deferred: oe = !1 } = {}) => {
    const le = q.get(J);
    if (le && performance.now() - le.at < _f) return le.answer;
    const ke = oe && !Q.value ? T(J, ee) : S(J, ee);
    return q.set(J, { answer: ke, at: performance.now() }), ke;
  };
  return {
    answered: Q,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: M(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: b,
    sources: $,
    links: y,
    search: w,
    readOnly: x,
    shared: C,
    read: V,
    readKeys: N,
    waitForServer: () => lo() ? ki() : null,
    run: (J) => Nt(e, J, t, I.signal),
    upload: (J) => Rf(J, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (J, ee) => P([J].flat().filter((oe) => o.some((le) => io(le, oe))), ee),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: P,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (J) => M(() => {
      var ee;
      return u.value[J] ?? ((ee = c.find((oe) => oe.key === J)) == null ? void 0 : ee.default);
    }),
    setting: async (J, ee) => {
      const oe = await V(`window setting ${e} ${J}`);
      return oe.ok ? oe.value.value : ee;
    },
    setOption: m,
    keep: (J, ee) => Nt(e, ["window", "save-setting", e, J, JSON.stringify(ee)], t, I.signal)
  };
}
function Ii(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const ht = { ok: !1, failure: "cancelled", error: "" }, mo = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Bi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ht : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Ti[n.code] || "fault", error: Ii(n.error) };
  } catch {
    return t != null && t.aborted ? ht : { ok: !1, failure: "unreachable", error: mo };
  }
}
const Tf = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Ti[e.code] || "fault", error: Ii(e.error) };
async function If(e, t) {
  try {
    const n = await e();
    return t.aborted ? ht : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Tf(s)])) } };
  } catch {
    return t.aborted ? ht : { ok: !1, failure: "unreachable", error: mo };
  }
}
async function Ri(e, t, n) {
  const a = await Bi(() => Ei.read(e, t, n), t);
  return a.failure !== "unreachable" || !lo() ? a : (await ki(), t.aborted ? ht : Ri(e, t, n));
}
function Nt(e, t, n, a = void 0, s = !1) {
  return Ee.held(() => Bf(e, t, n, a, s), Ee.knownRead(Array.isArray(t) ? t : ho(t)));
}
async function Bf(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ho(t), environment: n };
  return await Ee.isRead(o.line) ? Ee.joined(JSON.stringify(o), (l, i) => Ri({ ...o, attribution: i }, l, s), a, o).catch(() => ht) : Bi(() => Ei.write({ ...o, attribution: {
    client_id: Ee.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Rf(e, t, n = void 0) {
  try {
    const a = await Ee.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ht : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ht : { ok: !1, failure: "unreachable", error: mo };
  }
}
function ho(e) {
  return [...e.matchAll(Ef)].map(([t]) => t.replace(Af, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Lf = (e) => `show-${e}`, fA = (e, t, n) => e.filter((a) => {
  var s;
  return n(Lf((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), po = "messages.chat", oa = "main", Li = "Main agent", Nf = { main: Li, worker: "Worker", helper: "Helper" }, qf = "journal-", vo = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Df = (e) => vo(e.replace(qf, "").replaceAll("-", " ")), Pf = (e) => `${e.role} ${e.id}`, jf = (e) => e.role === oa ? Li : `${vo(e.role)} ${e.id}`;
function Zt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === oa || !n ? Nf[e.role] ?? vo(e.role) : Df(n), s = e.role === oa ? "" : Pf(e), o = e.role === oa ? a : n ? `${a} · ${s}` : `${a} ${e.id}`;
  return { title: a, subtext: s, text: o, name: jf(e) };
}
const Ff = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, Wf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E(""), l = M(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.id), label: Zt(c).title, note: Zt(c).subtext }))), i = M(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Nt(po, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(B, null, [
      A(ro, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", Ff, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Hf = /* @__PURE__ */ U(Wf, [["__scopeId", "data-v-5b40e2ff"]]), zf = {
  key: 0,
  class: "template-brief"
}, Uf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Vf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E(""), l = M(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = M(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Nt(po, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), m = s.value.find((p) => p.title === f);
      m && a("pick", String(m.id));
    }
    return u(), (c, f) => (r(), d(B, null, [
      A(Mt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", zf, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", Uf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Gf = /* @__PURE__ */ U(Vf, [["__scopeId", "data-v-14be8a5c"]]), Kf = { class: "info-tip" }, Yf = ["aria-label"], Qf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Xf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Kf, [
      h("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(se, {
          name: "info",
          size: 13
        })
      ], 8, Yf),
      h("span", Qf, [
        (r(!0), d(B, null, Z(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, Ni = /* @__PURE__ */ U(Xf, [["__scopeId", "data-v-a2fe5ff1"]]), Jf = { class: "form-field" }, Zf = { class: "form-field-head" }, em = ["for"], tm = {
  key: 1,
  class: "form-field-aside"
}, nm = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Jf, [
      h("div", Zf, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, em),
        e.help ? (r(), j(Ni, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", tm, [
          ne(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, qi = /* @__PURE__ */ U(nm, [["__scopeId", "data-v-302c40bf"]]), Ts = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, am = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Ca(), n = M(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => ge((r(), d("textarea", Ne({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [O(Ts), O(t).value]
    ]);
  }
}), Di = /* @__PURE__ */ U(am, [["__scopeId", "data-v-e130a5b9"]]), sm = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = eo(), o = M(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), j(qi, {
      label: e.field.label,
      for: O(s),
      "data-button-field": e.field.name
    }, {
      default: L(() => [
        A(At, { value: o.value }, {
          choice: L(() => [
            A(Mt, {
              id: O(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: L(() => [
            A(Gf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: L(() => [
            A(Hf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: L(() => [
            A(Di, {
              id: O(s),
              value: e.value,
              onInput: i[3] || (i[3] = (u) => a("pick", u.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, Ia = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), j(ie, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: L(() => [
        A(se, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function om(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const lm = (e, t = () => !0) => om("keydown", (n) => n.key === "Escape" && t() && e());
function Pi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = E(!1), s = M(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return lm(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const im = 80, Ut = nn([]);
function ji(e) {
  const t = Symbol("layer"), n = () => Ut.includes(t) && Ut.splice(Ut.indexOf(t), 1);
  return ce(
    e,
    (a) => {
      a && !Ut.includes(t) && Ut.push(t), a || n();
    },
    { immediate: !0 }
  ), Te(n), M(() => im + Math.max(0, Ut.indexOf(t)));
}
let Fi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Fi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const rm = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function um(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(rm)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Fi, document.addEventListener("keydown", s), Re(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const cm = ["aria-modal", "aria-label", "aria-labelledby"], dm = {
  key: 0,
  class: "dialog-head"
}, fm = ["id", "tabindex"], mm = {
  key: 1,
  class: "dialog-foot"
}, hm = 500, pm = 400, vm = {
  __name: "Dialog",
  props: {
    title: { type: String, default: "" },
    follow: { type: Boolean, default: !1 },
    fits: Boolean,
    wide: Boolean,
    huge: Boolean,
    small: Boolean,
    tall: Boolean,
    large: Boolean,
    bare: Boolean,
    padded: Boolean,
    open: { type: Boolean, default: null },
    closable: { type: Boolean, default: !0 },
    modal: Boolean,
    sheet: Boolean
  },
  emits: ["close", "dismiss", "escape"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Pi(a, n), i = ji(s), u = E(null), c = E(null), f = E(null), m = eo(), p = E(!1), b = Date.now();
    n.modal && um(c, () => a("escape"), f);
    function $() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, pm);
    }
    function y(C) {
      !n.modal || Date.now() - b >= hm || ![" ", "Enter"].includes(C.key) || (C.preventDefault(), C.stopPropagation());
    }
    const w = () => u.value && (u.value.scrollTop = u.value.scrollHeight), x = new MutationObserver(w);
    return ce(u, (C) => {
      x.disconnect(), C && n.follow && (x.observe(C, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Te(() => x.disconnect()), (C, q) => (r(), j(In, { to: "body" }, [
      A(an, {
        name: "dialog",
        appear: "",
        onAfterLeave: O(l)
      }, {
        default: L(() => [
          O(s) ? (r(), d("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: pe({ zIndex: O(i) }),
            onClick: he($, ["self"])
          }, [
            h("section", {
              ref_key: "panel",
              ref: c,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? O(m) : void 0,
              onKeydownCapture: y
            }, [
              e.bare ? k("", !0) : (r(), d("header", dm, [
                h("h3", {
                  id: O(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, fm),
                e.closable ? (r(), j(Ia, {
                  key: 0,
                  onClick: O(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              h("div", {
                ref_key: "body",
                ref: u,
                class: X(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ne(C.$slots, "default", {}, void 0, !0)
              ], 2),
              C.$slots.foot ? (r(), d("footer", mm, [
                ne(C.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, cm)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, sn = /* @__PURE__ */ U(vm, [["__scopeId", "data-v-089c42bc"]]), gm = {
  class: "action-output",
  "data-action-output": ""
}, ym = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(sn, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: L(() => [
        h("pre", gm, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, bm = /* @__PURE__ */ U(ym, [["__scopeId", "data-v-b32f94a4"]]);
function km(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Vu(bm, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const wm = (e, t, n = {}) => ho(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function Rn(e, t, n, a = {}) {
  var s;
  try {
    if (!await $f(e.module, n)) return { ok: !1, error: "" };
    const o = await Nt(po, wm(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && km(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const $m = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Va = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], we = (e, t, n, a = {}) => ({
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
}), Ln = {
  messages: we("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: we("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: we("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: Va
  }),
  tasks: we("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Va
  }),
  reports: we("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: we("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: we("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: we("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: we("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: we("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: we("Pin", "band", "One line pinned to the chat while it matters", { filters: Va }),
  reactions: we("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: we("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: we("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: we("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  agent_message_records: we("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: we("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: we("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: we("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: we("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: we("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: we("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: we("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: we("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: we("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: we("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: we("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: we("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, xm = ["secrets", "plugins"], Wi = Object.keys(Ln).filter((e) => !(hi && xm.includes(e)));
M(() => Wi.map((e) => ({ name: e, ...Ln[e] })));
const on = (e) => Ln[e], Hi = new Map(Wi.flatMap((e) => [e, e.replace(/s$/, ""), Ln[e].title.toLowerCase()].map((t) => [t, e]))), dt = (e) => Hi.get(String(e).toLowerCase()) || "", mA = (e) => {
  var t;
  return ((t = Ln[dt(e)]) == null ? void 0 : t.title) || String(e).charAt(0).toUpperCase() + String(e).slice(1);
}, zi = [...Hi.keys()].sort((e, t) => t.length - e.length).join("|"), Sm = {
  class: "button-form",
  "data-button-form": ""
}, Mm = {
  key: 0,
  class: "button-form-title"
}, _m = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Cm = { class: "button-form-actions" }, Em = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = E(!1), l = E(""), i = M(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = M(() => {
      var m;
      if (!n.row) return n.button.label;
      const f = ((m = on(dt(n.row.term))) == null ? void 0 : m.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await Rn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, m) => (r(), j(sn, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: m[1] || (m[1] = (p) => a("close"))
    }, {
      default: L(() => {
        var p;
        return [
          h("div", Sm, [
            (p = e.row) != null && p.title ? (r(), d("p", Mm, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(B, null, Z(e.button.fields, (b) => (r(), j(sm, {
              key: b.name,
              field: b,
              value: s.value[b.name],
              environment: e.environment,
              onPick: ($) => s.value[b.name] = $
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", _m, v(l.value), 1)) : k("", !0),
            h("div", Cm, [
              A(ie, {
                small: "",
                onClick: m[0] || (m[0] = (b) => a("close"))
              }, {
                default: L(() => [...m[2] || (m[2] = [
                  H("Cancel", -1)
                ])]),
                _: 1
              }),
              A(ie, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: L(() => [...m[3] || (m[3] = [
                  H("Send", -1)
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
}, Am = /* @__PURE__ */ U(Em, [["__scopeId", "data-v-e3f0d786"]]), Om = ["aria-busy"], Tm = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Im = { class: "button-slot-confirm-text" }, Bm = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Rm = {
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
    const n = e, a = t, s = M(() => uo(n.environment)), o = M(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = M(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = M(() => n.readOnly ? [] : wf(n.environment, n.name, n.row)), c = E(null), f = E(null), m = E(""), p = E(!1), b = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), $ = (x) => x.icon || (x.warning ? "dot" : "");
    function y(x) {
      if (!(p.value || n.readOnly)) {
        if (x.fields.length) {
          c.value = x;
          return;
        }
        if (x.confirm) {
          f.value = x;
          return;
        }
        return w(x);
      }
    }
    async function w(x) {
      f.value = null, m.value = "", a("failure", ""), p.value = !0;
      const C = await Rn(x, n.row, n.environment);
      p.value = !1, m.value = C.ok ? "" : C.error;
      const q = x.label.toLowerCase() + (n.objectName && !x.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", C.ok ? "" : `Could not ${q}: ${C.error}`), C.ok && a("done");
    }
    return (x, C) => (r(), d("span", {
      class: X(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(B, { key: 0 }, [
        C[5] || (C[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(ie, {
          small: "",
          onClick: i
        }, {
          default: L(() => [...C[4] || (C[4] = [
            H("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", Tm, [
        h("span", Im, v(f.value.confirm), 1),
        A(ie, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: X({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: C[0] || (C[0] = (q) => w(f.value))
        }, {
          default: L(() => [
            H(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(ie, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: C[1] || (C[1] = (q) => f.value = null)
        }, {
          default: L(() => [...C[6] || (C[6] = [
            H("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(B, { key: 2 }, [
        (r(!0), d(B, null, Z(u.value, (q) => (r(), d(B, {
          key: q.name
        }, [
          q.menu.length ? (r(), j(tf, {
            key: 0,
            small: "",
            variant: q.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": q.menu_label || "More ways",
            title: b(q),
            "data-button": q.name,
            onMain: (P) => y(q)
          }, {
            menu: L(({ close: P }) => [
              (r(!0), d(B, null, Z(q.menu, (I) => (r(), j(We, {
                key: I.label,
                description: I.description,
                onClick: (Q) => (P(), y({ ...q, ...I, menu: [] }))
              }, {
                default: L(() => [
                  H(v(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: L(() => [
              H(v(q.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), j(ie, {
            key: 1,
            small: "",
            variant: q.primary ? "primary" : "ghost",
            bordered: !q.primary,
            class: X({ danger: q.danger }),
            icon: $(q),
            disabled: p.value,
            title: b(q),
            "data-button": q.name,
            onClick: (P) => y(q)
          }, {
            default: L(() => [
              H(v(q.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Bm, v(m.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), j(Am, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: C[2] || (C[2] = (q) => c.value = null),
          onDone: C[3] || (C[3] = (q) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, Om));
  }
}, go = /* @__PURE__ */ U(Rm, [["__scopeId", "data-v-a4b6f174"]]), Lm = {
  class: "running",
  "data-running-command": ""
}, Nm = ["title"], qm = {
  key: "idle",
  class: "running-idle"
}, Dm = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Lm, [
      A(an, {
        name: "roll",
        mode: "out-in"
      }, {
        default: L(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Nm)) : (r(), d("span", qm, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, hA = /* @__PURE__ */ U(Dm, [["__scopeId", "data-v-d3240219"]]), Pm = ["aria-checked", "disabled", "aria-label", "title"], jm = {
  key: 0,
  class: "switch-inner"
}, Fm = {
  key: 0,
  class: "switch-word"
}, Wm = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean, disabled: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: X(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      disabled: e.disabled,
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      h("span", {
        class: X(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", jm, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = h("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", Fm, v(e.word), 1)) : k("", !0)
    ], 10, Pm));
  }
}, pA = /* @__PURE__ */ U(Wm, [["__scopeId", "data-v-92ae7767"]]), Hm = { class: "notice-text" }, zm = {
  key: 1,
  class: "notice-actions"
}, Um = {
  __name: "Notice",
  props: {
    tone: { type: String, default: "muted" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = ["brief", "report", "wait", "danger", "info", "need", "ask"];
    return (n, a) => (r(), d("div", {
      class: X(["notice", [`notice-${e.tone}`, { "notice-band": t.includes(e.tone) }]])
    }, [
      e.icon ? (r(), j(se, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : k("", !0),
      h("span", Hm, [
        ne(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", zm, [
        ne(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, vA = /* @__PURE__ */ U(Um, [["__scopeId", "data-v-445bd8a6"]]);
function Ui(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function fa(e, t) {
  return Ui(() => localStorage, e, t);
}
function Vi(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function yo(e, t) {
  return Vi(() => localStorage, e, t);
}
function Gi(e, t) {
  ce(t, (n) => yo(e, n), { deep: !0 });
}
function Vm(e, t) {
  return Ui(() => sessionStorage, e, t);
}
function Gm(e, t) {
  return Vi(() => sessionStorage, e, t);
}
const ma = "journal.environment", Ki = E(Vm(ma, fa(ma, "")));
function Km(e) {
  Ki.value = e, Gm(ma, e), yo(ma, e);
}
const ha = E(location.hash), ll = lt(null), il = { integrations: "mcp", library: "team" };
function Ym() {
  if (!ll.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (il[n]) {
    location.replace(`#/${[il[n], ...a].join("/")}${t ? `?${t}` : ""}`), ha.value = location.hash;
    return;
  }
  !n || ll.value(n) || (Km(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ha.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ha.value = location.hash, Ym();
});
const bo = "file", pa = M(() => {
  const [e, t = ""] = ha.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", m = ""] = i.split(":");
    return { table: c, id: c === bo ? decodeURIComponent(f) : Number(f), comment: Number(m) || 0, env: u };
  });
  return {
    env: Ki.value,
    page: n,
    n: a ? /^\d+$/.test(a) ? Number(a) : a : 0,
    q: s.get("q") || "",
    sub: s.get("sub") || "",
    tab: s.get("tab") || "",
    row: s.get("row") || "",
    plugin: s.get("plugin") || "",
    install: s.get("install") || "",
    line: Number(s.get("line") || 0),
    at: s.get("at") || "",
    stack: o,
    open: o[o.length - 1] || null
  };
}), Ba = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ba.page(e)}?open=${t}`
};
function Qm(e = "", t = 0, n = "") {
  location.hash = Ba.page(e, t, n);
}
function Xm(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Jm = (e) => `${e.table}:${e.table === bo ? encodeURIComponent(e.id) : e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Yi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Jm).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
function Zm(e) {
  const [t, n = ""] = location.hash.replace(/^#/, "").split("?"), a = new URLSearchParams(n);
  a.set("row", String(e)), location.replace(`#${t}?${a}`);
}
const Yt = {};
function gA(e, t) {
  return Yt[e] = t, () => Yt[e] === t && delete Yt[e];
}
function Ze(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Yt[e]) != null && l.call(Yt, t))) return;
  const s = pa.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Yi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
const eh = (e = "") => Ze(bo, e);
function th(e, t, n, a = 0, s = "") {
  if (e === pa.value.env) return Ze(t, n, a, s);
  const o = pa.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Yi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Pe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? th(a, s, Number(o), 0, t) : Ze(s, Number(o), 0, t);
}
function nh(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Kt(e) {
  const t = nh(e);
  t && Pe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function yA(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const ah = { class: "inspector-part" }, sh = { class: "inspector-part-title" }, oh = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", ah, [
      h("h4", sh, v(e.title), 1),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, bA = /* @__PURE__ */ U(oh, [["__scopeId", "data-v-5175e4a3"]]), rl = /* @__PURE__ */ new Map(), lh = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = E(null), a = E(!1), s = E(t.name && rl.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && rl.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && i.observe(n.value.firstElementChild || n.value)), Te(() => i.disconnect()), (u, c) => (r(), d(B, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: X(["folded-body", { folded: a.value && !s.value }]),
        style: pe(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ne(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = he((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Qi = /* @__PURE__ */ U(lh, [["__scopeId", "data-v-4d2235ba"]]), ih = ["aria-valuenow", "aria-valuemax"], rh = {
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
    const t = e, n = M(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (r(), d("span", {
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      h("span", {
        class: "fill",
        style: pe({ width: n.value })
      }, null, 4)
    ], 10, ih));
  }
}, Xi = /* @__PURE__ */ U(rh, [["__scopeId", "data-v-9eba6a85"]]), uh = { processes: "process", memories: "memory", replies: "reply" }, va = (e) => (uh[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), Is = [], ch = 2e3, yt = /* @__PURE__ */ new Map(), dh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, fh = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Ht(e, { first: t = !1 } = {}) {
  t ? Is.unshift(e) : Is.push(e), yt.clear();
}
function Ji(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const mh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, hh = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ft(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function ph(e, t) {
  const n = [{ type: "text", text: ft(e).replace(/\r\n/g, `
`) }];
  for (const a of Is)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function $n(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return vh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function vh(e) {
  return e.split(fh).map((t, n) => n % 2 ? t : t.replace(dh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function ul(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const gh = 24;
function yh(e) {
  const [t, , ...n] = e, a = ul(t), s = n.map(ul), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > gh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${$n(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${$n(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Zi = /^\s*(?:[-*+]|\d+[.)])\s+/, Bs = /^\s*(\d+)[.)]\s/, cl = (e) => e.match(/^\s*/)[0].length;
function er(e) {
  const t = e[0].match(Bs), n = cl(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && cl(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${$n(o.text)}${o.nested.length ? er(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function bh(e, t) {
  const n = Bs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Zi.test(e[s]) && Bs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const dl = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function tr(e) {
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
      const i = t.findIndex((c, f) => f > a && /^(```|~~~)/.test(c)), u = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(a + 1, u).join(`
`)}</code></pre>`), a = u + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${$n(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (dl(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(yh(t.slice(a, i))), a = i;
      continue;
    }
    if (Zi.test(s)) {
      const i = bh(t, a);
      n.push(er(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${tr(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !dl(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${$n(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const kh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, wh = (e) => e.type !== "text" && !kh.test(e.html);
function $h(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(tr(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : wh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function ko(e, t = { env: "" }) {
  const n = hh(e, t), a = yt.get(n);
  if (yt.delete(n), a && a.source === t.source && a.reads.every((l) => mh(l, t)))
    return yt.set(n, a), a.html;
  const s = [], o = $h(ph(e, { ...t, reads: s }));
  return yt.set(n, { html: o, reads: s, source: t.source }), yt.size > ch && yt.delete(yt.keys().next().value), o;
}
const Ga = /* @__PURE__ */ new WeakMap();
function xh(e) {
  if (Ga.has(e)) return Ga.get(e);
  const t = Gu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const m = s(c, f), p = e.read(`${va(c)} show ${f}`);
    n.set(m, p), p.then((b) => {
      n.get(m) === p && (n.delete(m), t.set(m, b.ok ? { ...b.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${va(c).replace(/-/g, "_")}.*`], (f) => {
      const m = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(m)) continue;
        const b = Number(p.slice(m.length));
        (!f.row_id || f.row_id === b) && o(c, b);
      }
    }));
  }
  function i(c, f) {
    l(c);
    const m = s(c, f);
    return !t.has(m) && !n.has(m) && o(c, f), t.get(m);
  }
  const u = { id: Symbol("window text rows"), row: i };
  return Ga.set(e, u), u;
}
function nr() {
  const e = $e(Be, null), t = e ? xh(e) : null;
  return (n, a = {}) => ko(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const ar = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Nn = (e) => String(e || "").replace(ar, (t, n, a, s) => s), Sh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Yn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Mh = /^Traceback \(most recent call last\):/m, _h = 8;
function sr(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, _h).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Ch(e) {
  const t = [...e.matchAll(Sh)].map((a) => a.index);
  if (Yn.lastIndex = 0, !t.length || !Yn.test(e)) return null;
  Yn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Yn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: sr(n), tail: "" } : null;
}
function Eh(e) {
  const t = Mh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: sr([o]), tail: n.slice(s).join(`
`) };
}
Ht((e) => {
  const t = Nn(e), n = Eh(t) || Ch(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ga = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, or = (e) => `${e.table}:${e.id}`, Rs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ka = 80;
function fl(e) {
  return e.length <= Ka ? e : `${e.slice(0, Ka + 1).replace(/\s+\S*$/, "") || e.slice(0, Ka)}…`;
}
const ml = {
  messages: (e) => fl(Rs(e.text)),
  comments: (e) => fl(Rs(e.text)),
  questions: (e) => e.text,
  memories: (e) => `${e.text} (weight ${e.weight})`,
  rules: (e) => e.text,
  reminders: (e) => e.text,
  environments: (e) => e.name,
  agents: (e) => e.session,
  workers: (e) => e.name,
  triggers: (e) => (e.phrases || []).join(", "),
  reactions: (e) => e.face,
  agent_message_records: (e) => {
    var t;
    return ((t = e.data) == null ? void 0 : t.line) || "";
  },
  plugins: (e) => {
    var t;
    return ((t = e.manifest) == null ? void 0 : t.title) || e.name;
  },
  shares: (e) => `Share of ${e.target || "nothing"}`
}, Ah = (e) => (ml[e.table] ? ml[e.table](e) : e.title || "") || "", jt = (e) => ga(e.created_at), Oh = (e) => ga(e.updated_at) || jt(e), Th = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Ih = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Bh(e) {
  const t = Th.exec(e);
  if (t && dt(t[1])) return { at: t.index, length: t[0].length, table: dt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Ih.exec(e), a = n && dt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Rh(e, t, n, a) {
  const s = Ji(a, e, t), o = Nn(s ? Ah(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ft(on(e).title)} ${t}</span><span class="row-card-title">${ft(o)}</span></a>`;
}
Ht(
  (e, t) => {
    const n = Bh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Rh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Lh = /\.(png|jpe?g|gif|webp|svg)$/i, Nh = (e) => Lh.test(e), qh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Dh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Ph(e, t) {
  const n = qh.exec(e), [, a, s, o, l, i] = n || [], u = n && dt(a || o), c = u && Ji(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${on(u).title} ${c.id} · ${ft(i)}`, p = Nh(i) ? `<img class="file-card-image" src="${f}" alt="${ft(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ft(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function jh(e) {
  const t = Dh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ft(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Ht(
  (e, t) => {
    if (t.inline) return null;
    const n = Ph(e, t) || jh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Fh = /`([^`\n]+)`/g;
Ht((e) => e.replace(Fh, (t, n) => `<code>${n}</code>`));
const hl = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ba.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Ht(
  (e, t) => e.replace(ar, (n, a, s, o) => hl[a] ? hl[a](s, o, t) : o)
);
const Wh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, lr = new RegExp(`\\b(${zi}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), ir = new RegExp(`\\b(${zi}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Hh = new RegExp(`<code>((?:${lr.source}|${ir.source}))</code>`, "gi"), zh = (e) => e.replace(Hh, "$1"), Uh = (e, t) => `<a class="row-pill" href="#" data-peek="${dt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Vh = (e) => e.replace(ir, (t, n, a) => a.replace(/\d+/g, (s) => Uh(n.replace(/s$/i, ""), s))), Gh = (e) => Vh(e).replace(
  lr,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${dt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Ht(
  (e, t) => t.rowNames === !1 ? e : zh(e).split(Wh).map((n, a) => a % 2 ? n : Gh(n)).join("")
);
const Kh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Yh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Qh = /[\w\]]\(/, Xh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Jh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Zh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, ep = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, tp = /[[({,]$/, np = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, ap = /^(\t|\s{2,})\S/, sp = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, op = /`[^`]+`/, lp = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, ip = /[{}()[\];=<>$&|*\\@+^~%]/g, Ls = /^\s*(?:[-*+]|\d+[.)])\s/, rp = /^\s*>/, up = /^\s*\|/, cp = 0.6, dp = 0.4, fp = 5, mp = 0.03, rr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= fp && t.every((n) => lp.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(ip) ?? []).length / e.length < mp;
}, Ya = (e) => {
  const t = e.trim();
  return op.test(t) ? !1 : [Kh, Yh, Qh, Xh, Jh, Zh, ep, tp, np].some((n) => n.test(t)) || /[;{}]$/.test(t) && !Ls.test(t) || ap.test(e) && !Ls.test(e) && !rr(e);
};
function hp(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ls.test(t[0]) || t.every((o) => rp.test(o) || up.test(o))) return "text";
  const n = t.filter((o) => !sp.test(o.trim()));
  if (t.length === 1) return !n.length || Ya(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ya).length, s = n.filter((o) => !Ya(o) && rr(o)).length;
  return a >= n.length * cp && s <= n.length * dp ? "code" : "text";
}
const Ns = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", pp = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", vp = `${Ns} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, gp = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", yp = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", pl = {
  js: { keywords: Ns, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: pp, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: vp, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ns, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: gp, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: yp, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, bp = {
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
function vl(e, t, n) {
  return n && e.startsWith(n, t);
}
function kp(e, t) {
  const n = pl[bp[t] ?? t] || pl.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (i, u) => u && s.push({ type: i, value: u });
  for (; o < e.length; ) {
    const i = e[o];
    if (n.markdown) {
      const c = e.indexOf(`
`, o), f = e.slice(o, c < 0 ? e.length : c);
      l(
        /^#{1,6}\s/.test(f) ? "keyword" : /^(```|~~~)/.test(f) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(f) ? "number" : "plain",
        f
      ), l("plain", c < 0 ? "" : `
`), o = c < 0 ? e.length : c + 1;
      continue;
    }
    if (vl(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && vl(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), f = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, f)), o = f;
      continue;
    }
    const u = (n.triple || []).find((c) => e.startsWith(c, o));
    if (u) {
      const c = e.indexOf(u, o + 3), f = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, f)), o = f;
      continue;
    }
    if (n.quotes.includes(i)) {
      let c = o + 1;
      for (; c < e.length && e[c] !== i && (i === "`" || e[c] !== `
`); ) c += e[c] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(c + 1)) ? "property" : "string", e.slice(o, c + 1)), o = c + 1;
      continue;
    }
    if (n.tags && i === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const c = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", c[0]), o += c[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(i)) {
      const f = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? f.toLowerCase() : f, p = n.property && /^\s*:/.test(e.slice(o + f.length));
      l(a.has(m) ? "keyword" : p ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
      continue;
    }
    if (/\d/.test(i)) {
      const c = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", c[0]), o += c[0].length;
      continue;
    }
    if (n.tags && (i === ">" || e.startsWith("/>", o))) {
      const c = i === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + c)), o += c;
      continue;
    }
    l("plain", i), o += 1;
  }
  return s;
}
function wp(e, t) {
  const n = [""];
  for (const { type: a, value: s } of kp(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ft(l) : `<span class="tok-${a}">${ft(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function ur(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const $p = 1500, gl = /* @__PURE__ */ new WeakMap();
async function xp(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await ur(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(gl.get(t)), gl.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, $p)
  )));
}
typeof document < "u" && document.addEventListener("click", xp, !0);
const Sp = /\n\s*\n/, Mp = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, _p = /^\s*(`{3,}|~{3,})\s*$/, Cp = /^\s{4,}\S/, Ep = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, qs = /^\s*(?:[-*+]|\d+[.)])\s/, cr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Ap = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function wo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Op(e) {
  const t = wo(e.join(`
`));
  return (Ap.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Tp = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && cr.test(t) && !qs.test(t);
}, Ip = (e, t) => qs.test(t) || qs.test([...e].reverse().find((n) => n.trim()) || "");
function $o(e, t) {
  const n = t || Op(e), a = wp(wo(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Bp(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && _p.test(s));
  return a < 0 ? e.length : a;
}
function Rp(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return $o(a.map(Nn), n ? n.toLowerCase() : "");
}
function Lp(e) {
  const t = e.split(Sp).map((l) => ({ paragraph: l, type: hp(wo(l).split(`
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
    const i = t.slice(o, l);
    if (i.some(({ type: u }) => u === "code") || i.length > 1) {
      s(), n.push($o(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(Nn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Np(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Lp(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(Mp);
    if (i) {
      const c = Bp(n, l, i[2]);
      o(), a.push(Rp(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Tp(s) ? Ep : Cp;
    if (!t && u.test(n[l]) && !Ip(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && cr.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push($o([...f, ...n.slice(l, c)].map(Nn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Ht((e, t) => Np(e, t.document), { first: !0 });
const qp = ["innerHTML"], Dp = ["innerHTML"], Pp = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = nr(), a = M(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => O(Kt) && O(Kt)(...l)),
      innerHTML: a.value
    }, null, 8, qp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => O(Kt) && O(Kt)(...l)),
      innerHTML: a.value
    }, null, 8, Dp));
  }
}, ut = /* @__PURE__ */ U(Pp, [["__scopeId", "data-v-d8e75741"]]), kA = (e) => [...new Set(e.agents.map((t) => t.name))], Qa = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, jp = "main agent", xo = (e, t) => t ? jp : e, Fp = ["data-agent-main"], Wp = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Hp = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, zp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean, chip: Boolean },
  setup(e) {
    const t = e, n = M(() => xo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: X(["agent-badge", { main: e.main, chip: e.chip }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Wp, [...s[0] || (s[0] = [
        h("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        h("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), j(se, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", Hp, v(n.value), 1))
    ], 10, Fp));
  }
}, Qt = /* @__PURE__ */ U(zp, [["__scopeId", "data-v-f8a38025"]]), Up = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], dr = { danger: "failed", warn: "waiting" }, Vp = (e) => Up.includes(dr[e] ?? e), fr = (e) => Vp(e) ? ["badge", dr[e] ?? e] : ["badge-quiet"], Gp = ["aria-expanded"], Kp = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Yp = {
  key: 0,
  class: "tip-failure"
}, Qp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = $e(Be, null), a = M(() => Sf(t.type, t.state)), s = M(() => fr(fo(t.type, t.state))), o = E(!1), l = E([]), i = E("");
    async function u() {
      o.value = !0;
      const m = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      i.value = m.ok ? "" : m.error, m.ok && (l.value = m.value.lines ?? []);
    }
    const c = () => o.value = !1, f = () => o.value ? c() : u();
    return (m, p) => a.value ? (r(), d("span", {
      key: 0,
      class: X(["state-badge", ...s.value]),
      tabindex: "0",
      role: "button",
      "aria-expanded": o.value,
      "data-state-badge": "",
      onMouseenter: u,
      onMouseleave: c,
      onFocus: u,
      onBlur: c,
      onClick: f,
      onKeydown: ze(c, ["escape"])
    }, [
      H(v(O(Jt)(e.type, e.state)) + " ", 1),
      o.value ? (r(), d("span", Kp, [
        i.value ? (r(), d("span", Yp, v(i.value), 1)) : k("", !0),
        (r(!0), d(B, null, Z(l.value, (b) => (r(), d("span", {
          key: b,
          class: "tip-line"
        }, v(b), 1))), 128))
      ])) : k("", !0)
    ], 42, Gp)) : (r(), d("span", {
      key: 1,
      class: X(s.value)
    }, v(O(Jt)(e.type, e.state)), 3));
  }
}, Xp = /* @__PURE__ */ U(Qp, [["__scopeId", "data-v-d276694c"]]), Jp = {
  class: "plan-details",
  "data-plan-details": ""
}, Zp = { class: "state-line" }, e1 = {
  key: 0,
  class: "phase-count"
}, t1 = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, n1 = { class: "text" }, a1 = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, s1 = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, o1 = { class: "overall" }, l1 = { class: "overall-figure" }, i1 = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, r1 = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, u1 = {
  key: 5,
  class: "part"
}, c1 = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", Jp, [
        h("div", Zp, [
          A(Xp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: X(["status", O(fo)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", e1, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", t1, [
          h("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", n1, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", a1, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", s1, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", o1, [
            A(Xi, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", l1, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", i1, [
          A(Qt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", r1, [
          O(Qa)(e.plan) ? (r(), j(Qt, {
            key: 0,
            name: O(Qa)(e.plan).name,
            main: O(Qa)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(B, { key: 1 }, [
            H(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", u1, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          A(Qi, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: L(() => [
              A(ut, {
                class: "text",
                "data-resource-text": "",
                text: e.plan.brief
              }, null, 8, ["text"])
            ]),
            _: 1
          }, 8, ["name"])
        ])) : k("", !0)
      ]);
    };
  }
}, wA = /* @__PURE__ */ U(c1, [["__scopeId", "data-v-52683b11"]]), d1 = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), j(Je(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: L(() => [
        ne(t.$slots, "default", {}, void 0, !0),
        h("span", {
          class: X(["tip", e.place]),
          role: "tooltip"
        }, [
          ne(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, f1 = /* @__PURE__ */ U(d1, [["__scopeId", "data-v-683e1839"]]), m1 = 5e3, h1 = "cancelled", Xa = /* @__PURE__ */ new Map();
async function p1(e, t) {
  const n = `${e.environment}:${t}`, a = Xa.get(n);
  if (a && performance.now() - a.at < m1) {
    const o = await a.answer;
    if (o.failure !== h1) return o;
    Xa.delete(n);
  }
  const s = e.read(`agent tip ${String(t)}`);
  return Xa.set(n, { answer: s, at: performance.now() }), s;
}
function v1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function ln(e, t = Date.now()) {
  const n = v1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const g1 = 36e5;
function y1(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / g1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Ds(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function mr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function en(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ja = (e) => String(e).padStart(2, "0");
function hr(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ja(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ja(Math.floor(t % 3600 / 60))}m ${Ja(t % 60)}s`;
}
const b1 = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, k1 = { state: "retired", words: "Retired" }, w1 = (e) => e.retired ? k1 : b1[e.activity], $1 = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), x1 = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${ln(e, t)}` : "", S1 = (e, t) => e ? `Seen: ${ln(e, t)}` : "", M1 = {
  class: "line head",
  "data-agent-tip-head": ""
}, _1 = { key: 0 }, C1 = {
  class: "line",
  "data-agent-tip-identity": ""
}, E1 = {
  class: "line status",
  "data-agent-tip-status": ""
}, A1 = ["data-state"], O1 = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, T1 = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, I1 = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, B1 = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, R1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = $e(Be, null), a = E(!1), s = E(null), o = E(""), l = E(Date.now()), i = M(() => w1(s.value)), u = M(() => x1(s.value.since, l.value)), c = M(() => S1(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await p1(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), j(f1, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Ea({
      default: L(() => [
        ne(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: L(() => [
          s.value ? (r(), d(B, { key: 0 }, [
            h("span", M1, [
              h("b", null, v(s.value.title), 1),
              p[0] || (p[0] = H()),
              s.value.name ? (r(), d("span", _1, v(s.value.name), 1)) : k("", !0)
            ]),
            h("span", C1, v(O($1)(s.value)), 1),
            h("span", E1, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, A1),
              H(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", O1, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", T1, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", I1, v(e.label), 1)),
          o.value ? (r(), d("span", B1, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, xn = /* @__PURE__ */ U(R1, [["__scopeId", "data-v-71d17663"]]), L1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, N1 = { class: "agent-word" }, q1 = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = M(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", L1, [
      (r(!0), d(B, null, Z(s.value, (i) => (r(), j(xn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: O(xo)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => O(Pe)(`agents:${i.id}`)
      }, {
        default: L(() => [
          h("span", {
            class: X(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Qt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", N1, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, D1 = /* @__PURE__ */ U(q1, [["__scopeId", "data-v-619caeed"]]), P1 = { class: "phases" }, j1 = { class: "phead" }, F1 = { class: "mark" }, W1 = { class: "ptitle" }, H1 = { class: "phead-end" }, z1 = {
  key: 0,
  class: "checkpoint"
}, U1 = { class: "progress" }, V1 = {
  key: 0,
  class: "when"
}, G1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", P1, [
      (r(!0), d(B, null, Z(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: X(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", j1, [
          h("span", F1, [
            A(se, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", W1, v(i + 1) + ". " + v(l.title), 1),
          h("span", H1, [
            l.checkpoint ? (r(), d("span", z1, "checkpoint")) : k("", !0),
            h("span", U1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", V1, v(l.goal), 1)) : k("", !0),
        A(D1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(B, null, Z(l.tasks, (u) => ne(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, $A = /* @__PURE__ */ U(G1, [["__scopeId", "data-v-05aaa685"]]), K1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Y1 = { ...K1, done: "Completed" }, Q1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), X1 = (e) => Q1.has(e), Sn = (e) => X1(e) ? "done" : e, J1 = { class: "task-status-icon" }, Z1 = ["width", "height", "aria-label"], ev = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = M(() => fo("task", Sn(t.status))), a = M(() => n.value === "testing" ? "started" : n.value), s = M(() => Y1[t.status] ?? Jt("task", t.status));
    return (o, l) => (r(), d("span", J1, [
      A(an, {
        name: "turn",
        mode: "out-in"
      }, {
        default: L(() => [
          (r(), d("svg", {
            key: n.value,
            class: X(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            A(At, { value: a.value }, {
              blocked: L(() => [...l[0] || (l[0] = [
                h("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                h("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: L(() => [...l[1] || (l[1] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                h("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: L(() => [...l[2] || (l[2] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: L(() => [...l[3] || (l[3] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                h("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: L(() => [...l[4] || (l[4] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                h("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: L(() => [...l[5] || (l[5] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: L(() => [...l[6] || (l[6] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Z1))
        ]),
        _: 1
      })
    ]));
  }
}, Ra = /* @__PURE__ */ U(ev, [["__scopeId", "data-v-ae24a63f"]]), tv = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, nv = {
  key: 0,
  class: "empty",
  role: "alert"
}, av = {
  key: 2,
  class: "empty"
}, sv = { class: "day" }, ov = { class: "events" }, lv = { class: "mark" }, iv = { class: "what" }, rv = { class: "head" }, uv = { class: "word" }, cv = ["title", "onClick"], dv = { class: "at" }, fv = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = E(null), l = E(""), i = M(() => {
      const f = /* @__PURE__ */ new Map();
      for (const m of o.value ?? []) {
        const p = new Date(m.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        f.set(p, [...f.get(p) ?? [], m]);
      }
      return [...f].map(([m, p]) => ({ day: m, items: p }));
    }), u = (f) => new Date(f).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const f = await a.read(["plan", "timeline", String(a.id)]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.events : [];
    }
    return ce(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", tv, [
      l.value ? (r(), d("p", nv, v(l.value), 1)) : o.value === null ? (r(), j(nt, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", av, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(B, null, Z(i.value, (p) => (r(), d(B, {
        key: p.day
      }, [
        h("h3", sv, v(p.day), 1),
        h("ol", ov, [
          (r(!0), d(B, null, Z(p.items, (b) => (r(), d("li", {
            key: `${b.time}-${b.event_type}-${b.task_id}`,
            class: X(["event", b.event_type]),
            "data-plan-event": ""
          }, [
            h("span", lv, [
              n[b.event_type].state ? (r(), j(Ra, {
                key: 0,
                status: n[b.event_type].state
              }, null, 8, ["status"])) : (r(), j(se, {
                key: 1,
                name: n[b.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", iv, [
              h("div", rv, [
                h("span", uv, v(n[b.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${b.task_id}`,
                  onClick: ($) => s("select", b.task_id)
                }, "#" + v(b.task_id) + " " + v(b.title), 9, cv),
                h("span", dv, v(u(b.time)), 1)
              ]),
              b.text ? (r(), j(ut, {
                key: 0,
                class: "text",
                text: b.text
              }, null, 8, ["text"])) : k("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, xA = /* @__PURE__ */ U(fv, [["__scopeId", "data-v-9e511133"]]), mv = 1e3;
function pr() {
  const e = E(Date.now()), t = setInterval(() => e.value = Date.now(), mv);
  return tt(() => clearInterval(t)), e;
}
const hv = Symbol("resource-subscriptions");
function pv() {
  const e = $e(hv, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = $e(Be, null);
  if (t != null && t.subscriptions) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new wi();
  return (a, s) => n.follow("resources", a, s);
}
function qn(e, t, n = () => !0) {
  const a = Oa(t, 100), s = pv()(e, (o) => {
    n(o) && a();
  });
  Aa(() => {
    s(), a.cancel();
  });
}
function vv(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const vr = { compact: "Compaction", clear: "Clear" }, gv = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, yv = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function bv(e) {
  return e != null && e.is_open ? `${vr[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function kv(e) {
  if (!e) return [];
  const t = [["Last context change", `${vr[e.change]}: ${yv[e.state]}`], ["Asked by", gv[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const wv = "Not known", $v = 80, xv = 1e3, Sv = "worker", Mv = "main", _v = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Cv = (e) => e.ok ? e.value.rows : [], Ev = (e, t) => e.ended_at ? "ended" : e.paused_at || _v.has(t == null ? void 0 : t.state) ? "waiting" : "running", gr = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Av({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / xv, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: hr(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > $v }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? wv : `$${t.cost_dollars.toFixed(2)}` }), e.role === Sv && l.push({ key: "pace", label: "Tasks an hour", value: String(y1(gr(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Mv && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Ov(e) {
  const t = gr(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Tv(e, t, n = null) {
  const a = [["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", Ds(e.created_at)]), e.ended_at && a.push(["Ended", Ds(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...kv(n)), a;
}
const Iv = { class: "band" }, Bv = { key: 0 }, Rv = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", Iv, [
      A(se, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ne(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", Bv, v(e.count), 1)) : k("", !0)
    ]));
  }
}, _t = /* @__PURE__ */ U(Rv, [["__scopeId", "data-v-1758914f"]]), Lv = { class: "number" }, Nv = { class: "text" }, qv = 150, Dv = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = E(!1), a = M(() => t.text.length > qv), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(B, null, [
      e.text ? (r(), d(B, { key: 0 }, [
        A(_t, { icon: "file" }, {
          default: L(() => [
            H(v(e.label), 1)
          ]),
          _: 1
        }),
        h("div", {
          class: X(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (r(), d(B, { key: 1 }, [
        A(_t, { icon: "points" }, {
          default: L(() => [...l[1] || (l[1] = [
            H("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(B, null, Z(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            h("span", Lv, v(i.id), 1),
            h("span", Nv, [
              H(v(i.text), 1),
              h("span", {
                class: X(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, Pv = /* @__PURE__ */ U(Dv, [["__scopeId", "data-v-c99de22c"]]), jv = ["aria-expanded"], Fv = { class: "count" }, Wv = {
  key: 0,
  "data-agent-fold-body": ""
}, Hv = {
  __name: "AgentFold",
  props: /* @__PURE__ */ mt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = Dt(e, "open");
    return (n, a) => (r(), d(B, null, [
      h("button", {
        type: "button",
        class: X(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(se, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        H(v(e.label), 1),
        h("span", Fv, v(e.count), 1),
        A(se, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, jv),
      t.value ? (r(), d("div", Wv, [
        ne(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Za = /* @__PURE__ */ U(Hv, [["__scopeId", "data-v-7f93d8d9"]]), zv = ["onClick"], Uv = { class: "text" }, Vv = { class: "aside" }, Gv = {
  key: 0,
  class: "none"
}, Kv = {
  class: "skills",
  "data-agent-skills": ""
}, Yv = {
  key: 0,
  class: "none-inline"
}, Qv = { class: "label" }, Xv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = nn({ helpers: !1, skills: !1 }), a = E([]), s = E([]), o = async (l) => Cv(await t.read(l));
    return ce(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ce(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(B, null, [
      A(Za, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: L(() => [
          (r(!0), d(B, null, Z(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => O(Ze)("agents", u.id)
          }, [
            h("span", Uv, v(O(Zt)(u).title), 1),
            h("span", Vv, v(O(Zt)(u).subtext), 1)
          ], 8, zv))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", Gv, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Za, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: L(() => [
          h("p", Kv, [
            (r(!0), d(B, null, Z(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", Yv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Za, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: L(() => [
          (r(!0), d(B, null, Z(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            h("span", Qv, v(u) + ":", 1),
            h("span", {
              class: X(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, Jv = /* @__PURE__ */ U(Xv, [["__scopeId", "data-v-1281605f"]]), Zv = ["datetime", "title"], Ye = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = pr(), a = M(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(O(ln)(e.at, O(n))), 9, Zv));
  }
}, eg = {
  class: "now",
  "data-agent-now": ""
}, tg = {
  key: 1,
  class: "muted"
}, ng = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, ag = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, sg = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, og = { class: "line" }, lg = { class: "detail" }, ig = { class: "bar" }, rg = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = M(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(B, null, [
      A(_t, { icon: "play" }, {
        default: L(() => [...o[2] || (o[2] = [
          H("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", eg, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => O(Ze)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", tg, v(e.nothing), 1)),
        n.value ? (r(), d("span", ng, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", ag, [
          o[3] || (o[3] = H("Seen: ", -1)),
          A(Ye, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", sg, [
        h("div", og, [
          h("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => O(Ze)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", lg, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        h("div", ig, [
          h("i", {
            style: pe({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, ug = /* @__PURE__ */ U(rg, [["__scopeId", "data-v-ff25c609"]]), cg = ["onClick"], dg = { class: "text" }, fg = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, mg = { class: "text" }, hg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, pg = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(B, null, [
      A(_t, { icon: "clock" }, {
        default: L(() => [...n[0] || (n[0] = [
          H("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(B, null, Z(e.moves, (a) => (r(), d(B, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => O(Ze)(a.table, a.id)
        }, [
          h("i", {
            class: X(["dot", a.tone])
          }, null, 2),
          h("span", dg, v(a.text), 1),
          A(Ye, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, cg)) : (r(), d("div", fg, [
          h("i", {
            class: X(["dot", a.tone])
          }, null, 2),
          h("span", mg, v(a.text), 1),
          A(Ye, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", hg, "Nothing yet."))
    ], 64));
  }
}, vg = /* @__PURE__ */ U(pg, [["__scopeId", "data-v-58f0db57"]]), gg = ["title"], yg = { class: "name" }, bg = { class: "state-type" }, kg = {
  __name: "AgentStates",
  props: { states: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => e.states.length ? (r(), d(B, { key: 0 }, [
      A(_t, { icon: "clock" }, {
        default: L(() => [...n[0] || (n[0] = [
          H("States", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(B, null, Z(e.states, (a) => (r(), d("div", {
        key: a.name,
        class: "state",
        "data-agent-open-state": "",
        title: `${a.name} (${a.state}): ${a.rows.join(", ")}`
      }, [
        h("span", yg, v(a.name), 1),
        h("span", bg, v(O(Jt)("agent_state", a.state)), 1),
        A(Ye, {
          class: "since",
          at: a.entered_at
        }, null, 8, ["at"])
      ], 8, gg))), 128))
    ], 64)) : k("", !0);
  }
}, wg = /* @__PURE__ */ U(kg, [["__scopeId", "data-v-4e41623e"]]), $g = {
  class: "strip",
  "data-agent-strip": ""
}, xg = ["data-agent-cell"], Sg = {
  key: 0,
  class: "meter"
}, Mg = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", $g, [
      (r(!0), d(B, null, Z(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, v(a.label), 1),
        h("b", {
          class: X({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", Sg, [
          h("i", {
            class: X({ high: a.high }),
            style: pe({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, xg))), 128))
    ]));
  }
}, _g = /* @__PURE__ */ U(Mg, [["__scopeId", "data-v-b6657ab7"]]), Cg = {}, Eg = { class: "menu-label" };
function Ag(e, t) {
  return r(), d("span", Eg, [
    ne(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $t = /* @__PURE__ */ U(Cg, [["render", Ag], ["__scopeId", "data-v-aa955b3e"]]), Og = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Tg = {
  key: 0,
  class: "skills-none"
}, Ig = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.skills.filter((l) => l.state === "loaded")), o = M(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Og, [
      A($t, null, {
        default: L(() => [...i[1] || (i[1] = [
          H("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", Tg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(B, null, Z(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(se, {
          name: "book",
          size: 12
        }),
        H(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(B, { key: 1 }, [
        A($t, null, {
          default: L(() => [...i[2] || (i[2] = [
            H("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(B, null, Z(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(se, {
            name: "book",
            size: 12
          }),
          H(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      A(We, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: L(() => [...i[3] || (i[3] = [
          H("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Bg = /* @__PURE__ */ U(Ig, [["__scopeId", "data-v-be514d47"]]), Rg = ["disabled", "title"], Lg = { class: "gauge usage" }, Ng = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.windows[0] ?? null), o = M(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = M(() => o.value !== null && o.value >= 100), i = M(() => {
      var c;
      return (c = s.value) != null && c.reset_unix_seconds ? new Date(s.value.reset_unix_seconds * 1e3).toLocaleString() : "";
    }), u = M(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, f) => o.value !== null ? (r(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: u.value,
      onClick: f[0] || (f[0] = (m) => a("open", m.currentTarget))
    }, [
      A(se, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = H()),
      h("span", Lg, [
        h("span", {
          style: pe({ width: `${o.value}%` })
        }, null, 4)
      ]),
      H(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Rg)) : k("", !0);
  }
}, qg = /* @__PURE__ */ U(Ng, [["__scopeId", "data-v-8ee387a5"]]), Dg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: X(O(fr)(e.tone))
    }, v(e.text), 3));
  }
}, So = /* @__PURE__ */ U(Dg, [["__scopeId", "data-v-b7a33f3d"]]);
function Pg(e, t, n, { groups: a, programs: s }) {
  const o = E({}), l = E(""), i = E(!1), u = M(() => !!e.value && !e.value.ended_at), c = M(() => u.value && !!e.value.paused_at);
  async function f($, y = null) {
    l.value = "";
    const w = await fi(y, $, t);
    return l.value = w.ok ? "" : w.error, n(), w;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: ($, y) => f(["agent", "control", String(e.value.id), $, y.value], { target: o, fields: { value: { ...o.value, [$]: y.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: ($) => f(["agent", "launch", $.name]) };
}
const jg = ["disabled", "title"], Fg = ["disabled", "title"], Wg = { class: "gauge" }, Hg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, zg = ["disabled", "title"], Ug = ["disabled"], Vg = ["disabled"], Gg = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Kg = ["title"], Yg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Qg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Xg = { class: "gauge" }, Jg = { class: "context-used" }, Zg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, ey = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, ty = 75, ny = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    controlGroups: { type: Array, default: () => [] },
    agentPrograms: { type: Array, default: () => [] },
    skills: { type: Array, default: () => [] },
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed", "skills"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Pg(Fa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Fa(n, "controlGroups"), programs: Fa(n, "agentPrograms") }), o = E(null), l = E(""), i = M(() => s.groups.value.find((W) => W.key === l.value));
    function u(W, R) {
      o.value = W.currentTarget, l.value = R;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = M(() => n.skills.filter((W) => W.state === "loaded"));
    function m(W) {
      u(W, "skills"), a("skills");
    }
    const p = (W) => s.groups.value.some((R) => R.key === W), b = M(() => {
      var W;
      return s.chosen.value.model ?? ((W = y.value) == null ? void 0 : W.model) ?? "";
    }), $ = M(() => {
      var W;
      return s.chosen.value.effort ?? ((W = y.value) == null ? void 0 : W.effort) ?? "";
    });
    M(() => !!n.agent && !n.agent.ended_at);
    const y = M(() => {
      var W;
      return ((W = n.usage.agents) == null ? void 0 : W.find((R) => {
        var D;
        return R.id === ((D = n.agent) == null ? void 0 : D.id);
      })) ?? null;
    }), w = M(() => {
      var W;
      return ((W = y.value) == null ? void 0 : W.context_percent) == null ? null : Math.round(y.value.context_percent);
    }), x = M(() => {
      var W;
      return bv(((W = y.value) == null ? void 0 : W.context_change) ?? null);
    }), C = (W) => `${Math.round(W / 1e3)}k`, q = M(() => {
      var W;
      return !!((W = y.value) != null && W.context_limit_tokens);
    }), P = M(() => {
      var W, R;
      return ((W = y.value) == null ? void 0 : W.context_limit_tokens) || ((R = y.value) == null ? void 0 : R.context_window_tokens) || 0;
    }), I = M(() => P.value ? `${C(y.value.context_tokens ?? 0)} of ${C(P.value)}` : ""), Q = M(() => {
      var W;
      return (W = y.value) != null && W.cost_dollars ? `$${y.value.cost_dollars.toFixed(2)}` : "";
    });
    return (W, R) => {
      var D, G;
      return r(), d("div", {
        class: X(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(B, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: R[0] || (R[0] = (_) => u(_, "agent"))
          }, [
            A(se, {
              name: "agents",
              size: 12
            }),
            H(" " + v(((D = e.agentPrograms.find((_) => _.name === e.agent.program)) == null ? void 0 : D.title) || e.agent.program), 1)
          ], 8, jg),
          A(qg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: R[1] || (R[1] = (_) => a("open", "usage", _))
          }, null, 8, ["windows", "disabled"]),
          w.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${w.value}% full: clear or compact it`,
            onClick: R[2] || (R[2] = (_) => p("context") ? u(_, "context") : a("open", "context", _.currentTarget))
          }, [
            A(se, {
              name: "gauge",
              size: 12
            }),
            R[14] || (R[14] = H()),
            h("span", Wg, [
              h("span", {
                style: pe({ width: `${w.value}%` })
              }, null, 4)
            ]),
            H(" " + v(w.value) + "% ", 1)
          ], 8, Fg)) : (G = y.value) != null && G.context_unknown ? (r(), d("span", Hg, [
            A(se, {
              name: "gauge",
              size: 12
            }),
            R[15] || (R[15] = H(" Context: unknown", -1))
          ])) : k("", !0),
          b.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${b.value}: change the model`,
            onClick: R[3] || (R[3] = (_) => p("model") ? u(_, "model") : null)
          }, [
            A(se, {
              name: "model",
              size: 12
            }),
            H(" " + v(b.value), 1)
          ], 8, zg)) : k("", !0),
          p("effort") || e.card && $.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: R[4] || (R[4] = (_) => u(_, "effort"))
          }, [
            A(se, {
              name: "bolt",
              size: 12
            }),
            H(" " + v($.value), 1)
          ], 8, Ug)) : k("", !0),
          Q.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: R[5] || (R[5] = (_) => a("open", "cost", _.currentTarget))
          }, v(Q.value), 9, Vg)) : k("", !0),
          e.branch ? (r(), d("span", Gg, [
            A(se, {
              name: "branch",
              size: 12
            }),
            H(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: X(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: R[6] || (R[6] = (_) => a("open", "jobs", _.currentTarget))
          }, [
            A(se, {
              name: "clock",
              size: 12
            }),
            H(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: m
          }, [
            A(se, {
              name: "book",
              size: 12
            }),
            H(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(B, { key: 8 }, [
            h("button", {
              type: "button",
              class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ty }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: R[7] || (R[7] = (_) => a("open", "fitness", _.currentTarget))
            }, [
              A(se, {
                name: "heart",
                size: 12
              }),
              H(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: X(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: R[8] || (R[8] = (_) => a("open", "load", _.currentTarget))
            }, [
              A(se, {
                name: "weight",
                size: 12
              }),
              H(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: R[9] || (R[9] = (_) => u(_, "start"))
        }, [
          A(se, {
            name: "agents",
            size: 12
          }),
          R[16] || (R[16] = H(" Start an agent", -1))
        ])) : k("", !0),
        R[22] || (R[22] = h("span", { class: "space" }, null, -1)),
        O(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: O(s).failure.value
        }, v(O(s).failure.value), 9, Kg)) : k("", !0),
        ne(W.$slots, "default", {}, void 0, !0),
        o.value ? (r(), j(Wt, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: L(() => {
            var _;
            return [
              l.value === "agent" ? (r(), d(B, { key: 0 }, [
                O(s).asking.value ? (r(), d(B, { key: 0 }, [
                  A($t, { "data-agent-stop-ask": "" }, {
                    default: L(() => [...R[17] || (R[17] = [
                      H("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(We, {
                    "data-agent-stop-confirm": "",
                    onClick: R[10] || (R[10] = (g) => (c(), O(s).stop()))
                  }, {
                    default: L(() => [...R[18] || (R[18] = [
                      H("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(We, {
                    onClick: R[11] || (R[11] = (g) => O(s).asking.value = !1)
                  }, {
                    default: L(() => [...R[19] || (R[19] = [
                      H("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), j(We, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: R[12] || (R[12] = (g) => O(s).asking.value = !0)
                }, {
                  default: L(() => [...R[20] || (R[20] = [
                    H("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(B, { key: 1 }, [
                A($t, null, {
                  default: L(() => [...R[21] || (R[21] = [
                    H("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(B, null, Z(O(s).programs.value, (g) => (r(), j(We, {
                  key: g.name,
                  "data-agent-program": g.name,
                  onClick: (S) => (c(), O(s).start(g))
                }, {
                  default: L(() => [
                    H(v(g.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), j(Bg, {
                key: 2,
                skills: e.skills,
                onBrowse: R[13] || (R[13] = (g) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(B, { key: 3 }, [
                A($t, null, {
                  default: L(() => [
                    H(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(B, { key: 0 }, [
                  h("p", Yg, v(O(vv)(((_ = y.value) == null ? void 0 : _.last_compaction) ?? null)), 1),
                  h("div", Qg, [
                    h("span", Xg, [
                      h("span", {
                        style: pe({ width: `${w.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Jg, v(w.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", Zg, [
                    H(v(I.value) + " ", 1),
                    q.value ? (r(), j(So, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && x.value ? (r(), d("p", ey, v(x.value), 1)) : (r(!0), d(B, { key: 2 }, Z(i.value.choices, (g) => (r(), j(We, {
                  key: g.value,
                  "data-agent-choice": g.value,
                  onClick: (S) => (O(s).choose(i.value.key, g), c())
                }, {
                  default: L(() => [
                    H(v(g.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : k("", !0)
      ], 2);
    };
  }
}, ay = /* @__PURE__ */ U(ny, [["__scopeId", "data-v-d7113347"]]), sy = {
  class: "who",
  "data-agent-who": ""
}, oy = { class: "name" }, ly = ["data-agent-state"], iy = {
  class: "sub",
  "data-agent-started-by": ""
}, ry = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", sy, [
      h("h2", oy, [
        h("i", {
          class: X(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, ly),
        H(v(e.name), 1)
      ]),
      A(ay, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", iy, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, uy = /* @__PURE__ */ U(ry, [["__scopeId", "data-v-83bd4a9d"]]), cy = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, dy = { class: "scroll" }, fy = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, my = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, hy = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = pr(), a = E(null), s = E(null), o = E(null), l = E(null), i = E({}), u = E({ helpers: 0, skills: 0 }), c = E(0), f = E([]), m = E([]), p = E([]), b = E("");
    let $ = 0;
    const y = M(() => {
      var q;
      return a.value.ended_at ? Ov(s.value) : `It has no task.${(q = s.value) != null && q.instruction ? " It was given an instruction." : ""}`;
    });
    async function w() {
      const q = ++$, P = await t.read(["usage", "inspector", String(t.id), "--environment", t.environment]);
      q === $ && (b.value = P.ok ? "" : P.error, P.ok && (a.value = P.value.agent, s.value = P.value.facts, o.value = P.value.inspection, l.value = P.value.compaction ?? null, i.value = P.value.tool, u.value = { helpers: P.value.helpers, skills: P.value.skills }, f.value = P.value.points, m.value = P.value.programs, p.value = P.value.states ?? [], c.value += 1));
    }
    const x = M(() => /* @__PURE__ */ new Set([t.id])), C = {
      agent: (q) => $i(q, x.value),
      hook_call: (q) => od(q, "session_agent_id", x.value)
    };
    return qn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], w, (q) => {
      var P;
      return ((P = C[q.event.split(".")[0]]) == null ? void 0 : P.call(C, q)) ?? !0;
    }), _e(w), (q, P) => {
      var I, Q;
      return r(), d("article", cy, [
        h("div", dy, [
          b.value ? (r(), d("p", fy, v(b.value), 1)) : a.value && o.value ? (r(), d(B, { key: 1 }, [
            A(uy, {
              name: O(Zt)(a.value, s.value).text,
              state: O(Ev)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((I = s.value) == null ? void 0 : I.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(_g, {
              cells: O(Av)({ row: a.value, facts: s.value, inspection: o.value, now: O(n) })
            }, null, 8, ["cells"]),
            A(ug, {
              inspection: o.value,
              tool: i.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(Pv, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((Q = s.value) == null ? void 0 : Q.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            A(wg, { states: p.value }, null, 8, ["states"]),
            A(vg, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(Jv, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: O(Tv)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", my, "Ended " + v(O(ln)(a.value.ended_at, O(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), j(nt, { key: 2 }))
        ])
      ]);
    };
  }
}, SA = /* @__PURE__ */ U(hy, [["__scopeId", "data-v-764e1210"]]), py = Symbol.for("journal.toast"), vy = Symbol.for("journal.page-toasts");
function MA() {
  const e = $e(py, null);
  if (!e) throw new Error("useToast is called only inside a page that shows toasts");
  return e.raise;
}
const gy = ["open", "copy", "own", "delete"], yy = (e) => e.danger ? "delete" : e.group ?? "own";
function by(e) {
  return gy.map((n) => e.filter((a) => yy(a) === n)).filter((n) => n.length).flatMap((n, a) => [
    ...a ? [{ separator: !0, key: `separator-${a}` }] : [],
    ...n.map((s, o) => ({ ...s, key: `${a}-${o}` }))
  ]);
}
function ky() {
  const e = E(null);
  let t = null;
  const n = (l, i, u, c, f = c) => {
    t = f, e.value = { at: l, head: i, items: u, target: c };
  };
  function a(l, i, u) {
    l.preventDefault(), n({ x: l.clientX, y: l.clientY }, i, u, l.currentTarget);
  }
  function s(l, i, u) {
    if (l.key !== "ContextMenu" && !(l.shiftKey && l.key === "F10")) return;
    l.preventDefault();
    const c = l.target.getBoundingClientRect();
    n({ x: Math.max(8, c.left + 8), y: Math.min(window.innerHeight - 8, c.bottom + 2) }, i, u, l.currentTarget);
  }
  function o() {
    e.value = null, t != null && t.isConnected && t.focus({ preventScroll: !0 });
  }
  return { menu: e, show: n, open: a, openFromKey: s, close: o };
}
const wy = {
  key: 0,
  class: "context-head",
  "data-context-head": ""
}, $y = {
  key: 0,
  class: "context-separator",
  role: "separator",
  "data-context-separator": ""
}, xy = { class: "context-label" }, Sy = {
  key: 0,
  class: "context-note",
  "data-context-reason": ""
}, My = {
  key: 1,
  class: "context-note",
  "aria-hidden": "true"
}, _y = {
  key: 2,
  class: "context-note"
}, Cy = ".context-menu", Ey = {
  __name: "ContextMenu",
  props: {
    at: { type: Object, required: !0 },
    head: { type: String, default: "" },
    items: { type: Array, required: !0 },
    // the element the menu belongs to; it wears an accent ring while the menu is open
    target: { type: Object, default: null },
    depth: { type: Number, default: 0 }
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => by(n.items)), o = E(null), l = E(""), i = (C) => [...C.querySelectorAll("[data-menu-item]:not(:disabled)")], u = (C, q) => {
      var P;
      return (P = q(i(C))) == null ? void 0 : P.focus();
    }, c = (C) => s.value.find((q) => q.key === (C == null ? void 0 : C.dataset.menuItem));
    function f(C, q) {
      if (!C.disabled) {
        if (C.children) {
          const P = q.getBoundingClientRect();
          o.value = { items: C.children, at: { x: P.right + 2, y: P.top - 4, flipX: P.left - 2 }, opener: q };
          return;
        }
        if (C.danger && l.value !== C.key) {
          l.value = C.key;
          return;
        }
        a("close", !0), C.run && setTimeout(C.run, 0);
      }
    }
    function m(C, q) {
      if (q.focus(), C.children && !C.disabled) return f(C, q);
      o.value = null;
    }
    function p(C, q) {
      var Q;
      const P = i(C);
      (Q = P.slice(P.indexOf(document.activeElement) + 1).concat(P).find((W) => c(W).label.toLowerCase().startsWith(q.toLowerCase()))) == null || Q.focus();
    }
    const b = {
      Home: (C) => u(C, (q) => q[0]),
      End: (C) => u(C, (q) => q[q.length - 1]),
      Enter: () => document.activeElement.click(),
      " ": () => document.activeElement.click(),
      ArrowRight: (C) => {
        var q;
        return ((q = c(document.activeElement)) == null ? void 0 : q.children) && document.activeElement.click();
      },
      ArrowLeft: () => n.depth && a("close", !1),
      Tab: () => a("close", !1)
    };
    function $(C) {
      const q = C.currentTarget, P = q.contains(document.activeElement) && document.activeElement.dataset.menuItem !== void 0;
      b[C.key] && (P || !["Enter", " ", "ArrowRight"].includes(C.key)) ? (C.preventDefault(), b[C.key](q)) : C.key.length === 1 && !C.ctrlKey && !C.metaKey && !C.altKey && p(q, C.key);
    }
    function y(C) {
      var q, P;
      (P = (q = C.target).closest) != null && P.call(q, Cy) || a("close", !1);
    }
    const w = () => a("close", !1), x = (C) => {
      const q = o.value.opener;
      o.value = null, C ? a("close", !0) : q.focus();
    };
    return _e(() => {
      var C;
      (C = n.target) == null || C.classList.add("menu-target"), !n.depth && (window.addEventListener("pointerdown", y, !0), window.addEventListener("scroll", y, !0), window.addEventListener("blur", w), window.addEventListener("resize", w));
    }), Te(() => {
      var C;
      (C = n.target) == null || C.classList.remove("menu-target"), window.removeEventListener("pointerdown", y, !0), window.removeEventListener("scroll", y, !0), window.removeEventListener("blur", w), window.removeEventListener("resize", w);
    }), (C, q) => {
      const P = ri("ContextMenu", !0);
      return r(), j(Wt, {
        class: "context-menu",
        role: "menu",
        "data-context-menu": "",
        point: e.at,
        gap: 0,
        "min-width": 196,
        "max-width": 320,
        "aria-label": e.head,
        onClose: q[0] || (q[0] = (I) => a("close", !1)),
        onKeydown: $,
        onContextmenu: q[1] || (q[1] = he(() => {
        }, ["prevent"]))
      }, {
        default: L(() => [
          e.head && !e.depth ? (r(), d("p", wy, v(e.head), 1)) : k("", !0),
          (r(!0), d(B, null, Z(s.value, (I) => (r(), d(B, {
            key: I.key
          }, [
            I.separator ? (r(), d("hr", $y)) : (r(), j(We, {
              key: 1,
              role: "menuitem",
              class: X({ "context-danger": I.danger, "context-armed": l.value === I.key }),
              disabled: I.disabled,
              "aria-haspopup": I.children ? "menu" : void 0,
              title: I.disabled ? I.reason : void 0,
              "data-menu-item": I.key,
              onClick: (Q) => f(I, Q.currentTarget),
              onMouseenter: (Q) => m(I, Q.currentTarget)
            }, {
              default: L(() => [
                h("span", xy, v(l.value === I.key ? I.armedLabel ?? `${I.label}: click again` : I.label), 1),
                I.disabled ? (r(), d("span", Sy, v(I.reason), 1)) : I.children ? (r(), d("span", My, "›")) : I.keys ? (r(), d("kbd", _y, v(I.keys), 1)) : k("", !0)
              ]),
              _: 2
            }, 1032, ["class", "disabled", "aria-haspopup", "title", "data-menu-item", "onClick", "onMouseenter"]))
          ], 64))), 128)),
          o.value ? (r(), j(P, {
            key: 1,
            depth: e.depth + 1,
            at: o.value.at,
            items: o.value.items,
            onClose: x
          }, null, 8, ["depth", "at", "items"])) : k("", !0)
        ]),
        _: 1
      }, 8, ["point", "aria-label"]);
    };
  }
}, Ay = /* @__PURE__ */ U(Ey, [["__scopeId", "data-v-92b4e261"]]), Oy = {
  __name: "ActionsMenu",
  props: { items: { type: Array, required: !0 }, head: { type: String, default: "" }, label: { type: String, default: "Actions" } },
  setup(e) {
    const t = e, { menu: n, show: a, close: s } = ky(), o = (u, c = null) => {
      var f;
      return (f = globalThis[vy]) == null ? void 0 : f.raise(u, c);
    }, l = (u) => u.map((c) => ({ ...c, run: c.run && (() => c.run({ say: o })), children: c.children && l(c.children) }));
    function i(u) {
      const c = u.currentTarget.getBoundingClientRect();
      a({ x: c.left, y: c.bottom + 2, flipX: c.right }, t.head, l(t.items), u.currentTarget);
    }
    return (u, c) => (r(), d(B, null, [
      A(ie, {
        small: "",
        "aria-haspopup": "menu",
        "aria-expanded": !!O(n),
        "data-actions-menu": "",
        onClick: i
      }, {
        default: L(() => [
          H(v(e.label), 1),
          A(se, {
            name: "chevronRight",
            size: 11,
            facing: "down"
          })
        ]),
        _: 1
      }, 8, ["aria-expanded"]),
      O(n) ? (r(), j(Ay, Ne({ key: 0 }, O(n), { onClose: O(s) }), null, 16, ["onClose"])) : k("", !0)
    ], 64));
  }
};
function Ty(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), tt(() => n.disconnect()), t;
}
const Iy = ["innerHTML"], By = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => tl[t.name] || tl.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Iy));
  }
}, Ct = /* @__PURE__ */ U(By, [["__scopeId", "data-v-beb5935c"]]), Ry = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(Ct, { name: "fold" })
    ], 2));
  }
}, rn = /* @__PURE__ */ U(Ry, [["__scopeId", "data-v-d03899bb"]]), Ly = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, Ny = ["aria-expanded"], qy = {
  class: "links-count",
  "data-inspector-links-count": ""
}, Dy = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, Py = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, jy = {
  __name: "InspectorLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    categories: { type: Array, default: () => [] },
    open: Boolean,
    outsidePlan: Boolean,
    pageSize: { type: Number, default: 10 }
  },
  emits: ["open"],
  setup(e) {
    const t = e, n = E(t.open), a = E(0), s = E(0), o = E("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return ce(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), qn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(B, null, [
      a.value ? (r(), d("section", Ly, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", qy, v(a.value), 1),
          A(rn, { open: n.value }, null, 8, ["open"])
        ], 8, Ny),
        h("div", {
          class: X(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", Dy, [
            A(Gd, {
              pinned: "",
              model: e.model,
              id: e.id,
              "document-id": e.documentId,
              read: e.read,
              changes: s.value,
              "outside-plan": e.outsidePlan,
              "page-size": e.pageSize,
              "only-kinds": e.categories,
              "link-attribute": "data-inspector-link",
              onOpen: c[1] || (c[1] = (f) => u.$emit("open", f))
            }, null, 8, ["model", "id", "document-id", "read", "changes", "outside-plan", "page-size", "only-kinds"])
          ])) : k("", !0)
        ], 2)
      ])) : k("", !0),
      o.value ? (r(), d("p", Py, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Mo = /* @__PURE__ */ U(jy, [["__scopeId", "data-v-a4550728"]]);
var ii;
/Mac|iPhone|iPad/.test(((ii = navigator.userAgentData) == null ? void 0 : ii.platform) || navigator.platform);
function yr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Mn = (e, t = 40) => e.length > t ? `${e.slice(0, t - 1)}…` : e;
async function Ft(e, t, n) {
  n(await ur(e) ? `Copied ${t || Mn(e)}` : "The browser did not allow copying");
}
function _A({ word: e = "Delete", name: t, remove: n, restore: a = null, erase: s = !1 }) {
  return {
    label: e,
    danger: !0,
    armedLabel: s ? "Click again: the value is erased for good" : `${e}: click again`,
    run: async ({ say: o }) => {
      const l = await n();
      if (!l.ok) return o(l.error);
      if (s) return o(`Deleted ${t}. The value is erased.`);
      o(`${e}d ${t}`, a ? { line: a } : null);
    }
  };
}
const Fy = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Ps = (e) => e.charAt(0).toUpperCase() + e.slice(1), Wy = (e) => Ps(e.replace(/_at$/, "").replaceAll("_", " ")), Hy = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, zy = (e, t, n) => [Ps(`${e} ${n}`), (t == null ? void 0 : t.state) && Ps(t.state)].filter(Boolean).join(" · "), br = (e) => Zt(e).text, Uy = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? br(t) : (e == null ? void 0 : e.name) ?? "", Vy = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? br(t) : "", Gy = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Fy.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Wy(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], Ky = { reviewing: "Under review" }, Yy = (e, t) => e || Ky[t == null ? void 0 : t.state] || "";
async function kr(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: Uy(s.value.actor, s.value.creator_agent), owner: a.length ? Vy(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const Qy = ["data-comment-id"], Xy = {
  key: 0,
  class: "comment-top"
}, Jy = { class: "comment-mark" }, Zy = {
  class: "comment-body",
  "data-comment": ""
}, e0 = { class: "comment-foot" }, t0 = {
  key: 1,
  "data-comment-lost": ""
}, n0 = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (r(), d("article", {
      class: X(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (r(), d("div", Xy, [
        h("span", Jy, v(e.comment.number), 1),
        h("span", {
          class: X(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      h("p", Zy, v(e.comment.body), 1),
      h("div", e0, [
        e.comment.created_at ? (r(), j(Ye, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", t0, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Qy));
  }
}, wr = /* @__PURE__ */ U(n0, [["__scopeId", "data-v-a37d4507"]]), a0 = {
  class: "comment-box",
  "data-comment-box": ""
}, s0 = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, o0 = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, l0 = { class: "comment-row" }, i0 = ["placeholder"], r0 = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ mt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ mt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Dt(e, "draft"), l = E(""), i = E(!1), u = E(null), c = M(() => {
      var b;
      return ((b = a.selection) == null ? void 0 : b.selection_type) === "code";
    }), f = M(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function m() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const b = o.value.trim();
      if (!(!b || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(b), o.value = "", await Re(), m();
        } catch ($) {
          l.value = $.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (b, $) => (r(), d("div", a0, [
      e.selection ? (r(), d("div", s0, [
        $[3] || ($[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: X(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(Ia, {
          title: "Comment on the whole document instead",
          onClick: $[0] || ($[0] = (y) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", o0, v(l.value), 1)) : k("", !0),
      h("div", l0, [
        ge(h("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": $[1] || ($[1] = (y) => o.value = y),
          rows: "1",
          maxlength: "2000",
          class: X({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: m,
          onKeydown: $[2] || ($[2] = ze((y) => O(yr)(y, p), ["enter"]))
        }, null, 42, i0), [
          [Fe, o.value]
        ]),
        A(ie, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: L(() => [...$[4] || ($[4] = [
            H("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, u0 = /* @__PURE__ */ U(r0, [["__scopeId", "data-v-41d2081c"]]), Qn = (e) => e ? e.split(", ") : [];
function c0({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function d0(e, t) {
  return {
    reads: Qn(e.reads_allowed),
    runs: Qn(e.runs_allowed),
    missing: [...Qn(e.reads_missing), ...Qn(e.runs_missing)],
    ask: t
  };
}
const f0 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = ri("SkeletonParts", !0);
      return r(!0), d(B, null, Z(e.parts, (u, c) => (r(), d(B, { key: c }, [
        (r(!0), d(B, null, Z(u.count, (f) => (r(), j(At, {
          key: f,
          value: u.shape
        }, {
          line: L(() => [
            A(vn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: pe({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: L(() => [
            A(vn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: pe({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: L(() => [
            A(vn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: pe({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: L(() => [...l[0] || (l[0] = [
            h("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: L(() => [
            h("div", {
              class: "skeleton-row",
              style: pe(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: L(() => [
            h("div", {
              class: "skeleton-stack",
              style: pe(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: L(() => [
            h("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: pe(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: L(() => [
            h("div", {
              class: "skeleton-grid",
              style: pe(s(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), m0 = /* @__PURE__ */ U(f0, [["__scopeId", "data-v-fa8baeaf"]]), h0 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, p0 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", h0, [
      A(m0, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, _o = /* @__PURE__ */ U(p0, [["__scopeId", "data-v-52f66b64"]]), Co = {
  runningTool: 500,
  agentCommand: 500,
  planCard: 3e3,
  openPanel: 5e3,
  documentWithNoEvents: 6e4,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
}, v0 = { class: "bars" }, g0 = { class: "bar-name" }, y0 = { class: "bar-value" }, b0 = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = M(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", v0, [
      (r(!0), d(B, null, Z(e.items, (u, c) => (r(), j(Je(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: X(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: L(() => [
          h("span", g0, v(u.label), 1),
          A(Xi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", y0, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, k0 = /* @__PURE__ */ U(b0, [["__scopeId", "data-v-663427f4"]]), w0 = { class: "bars" }, $0 = {
  key: 0,
  class: "bars-title"
}, x0 = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", w0, [
      e.node.title ? (r(), d("span", $0, v(e.node.title), 1)) : k("", !0),
      A(k0, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, S0 = /* @__PURE__ */ U(x0, [["__scopeId", "data-v-7135bb11"]]), M0 = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = M(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: pe(o.value)
    }, [
      (r(!0), d(B, null, Z(e.node.children || [], (u, c) => (r(), j(Sr, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, $r = /* @__PURE__ */ U(M0, [["__scopeId", "data-v-d142a3f4"]]), _0 = {
  key: 0,
  class: "card-head"
}, C0 = { class: "card-title" }, E0 = {
  key: 0,
  class: "card-note"
}, A0 = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", _0, [
        h("span", C0, v(e.node.title), 1),
        e.node.note ? (r(), d("span", E0, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      A($r, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, O0 = /* @__PURE__ */ U(A0, [["__scopeId", "data-v-67b72d40"]]), T0 = { class: "fact" }, I0 = { class: "fact-label" }, B0 = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", T0, [
      h("span", I0, v(e.label), 1),
      A(ut, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, R0 = /* @__PURE__ */ U(B0, [["__scopeId", "data-v-3a88ecf8"]]), L0 = { class: "list" }, N0 = { class: "list-label" }, q0 = {
  key: 1,
  class: "list-note"
}, D0 = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", L0, [
      (r(!0), d(B, null, Z(e.items, (o, l) => (r(), j(Je(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: L(() => [
          h("span", N0, v(o.label), 1),
          o.badge ? (r(), j(So, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", q0, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, P0 = /* @__PURE__ */ U(D0, [["__scopeId", "data-v-ebe2ae0a"]]), es = Symbol.for("journal.context-place"), Et = {
  mounted(e, t) {
    e[es] = t.value;
  },
  updated(e, t) {
    e[es] = t.value;
  },
  unmounted(e) {
    delete e[es];
  }
}, j0 = { class: "table" }, F0 = {
  key: 0,
  class: "table-row empty"
}, W0 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" }, widths: { type: Array, default: () => [] } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => ({ gridTemplateColumns: n.widths.length ? n.widths.join(" ") : `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` })), o = (l) => {
      const i = l.cells.join(" ").replace(/\s+/g, " ").trim();
      return {
        head: Mn(i, 40),
        items: [
          { label: "Open", group: "open", disabled: !l.open, reason: "Nothing to open", run: () => a("open", l.open) },
          { label: "Copy number", group: "copy", run: ({ say: u }) => Ft(String(l.cells[0] ?? ""), "", u) },
          { label: "Copy line", group: "copy", run: ({ say: u }) => Ft(i, "the line", u) }
        ]
      };
    };
    return (l, i) => (r(), d("div", j0, [
      h("div", {
        class: "table-row head",
        style: pe(s.value)
      }, [
        (r(!0), d(B, null, Z(e.columns, (u) => (r(), d("span", {
          key: u,
          class: "cell"
        }, v(u), 1))), 128))
      ], 4),
      (r(!0), d(B, null, Z(e.rows, (u, c) => ge((r(), j(Je(u.open ? "button" : "div"), {
        key: c,
        type: u.open ? "button" : void 0,
        class: X(["table-row", u.tone, { opens: u.open, active: u.active }]),
        style: pe(s.value),
        "data-table-row": u.mark,
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: L(() => [
          (r(!0), d(B, null, Z(u.cells, (f, m) => (r(), d("span", {
            key: m,
            class: "cell"
          }, v(f), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "data-table-row", "onClick"])), [
        [O(Et), () => o(u)]
      ])), 128)),
      !e.rows.length && e.empty ? (r(), d("div", F0, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, xr = /* @__PURE__ */ U(W0, [["__scopeId", "data-v-8d66b77f"]]), H0 = { class: "stat-value" }, z0 = { class: "stat-label" }, U0 = {
  key: 0,
  class: "stat-note"
}, V0 = {
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
    return (a, s) => (r(), j(Je(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: L(() => [
        h("span", H0, v(e.value), 1),
        h("span", z0, v(e.label), 1),
        e.note ? (r(), d("span", U0, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, G0 = /* @__PURE__ */ U(V0, [["__scopeId", "data-v-ad0db6d6"]]), K0 = { class: "code" }, Y0 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = M(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), j(At, { value: s.value }, {
      group: L(() => [
        A($r, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: L(() => [
        A(O0, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      heading: L(() => [
        h("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: L(() => [...c[2] || (c[2] = [
        h("hr", { class: "divider" }, null, -1)
      ])]),
      stat: L(() => [
        A(G0, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: L(() => [
        A(S0, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: L(() => [
        A(xr, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: L(() => [
        A(P0, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: L(() => [
        A(ut, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: L(() => [
        A(R0, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: L(() => [
        A(So, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: L(() => [
        h("pre", K0, [
          h("code", null, v(e.node.text), 1)
        ])
      ]),
      file: L(() => [
        h("button", {
          type: "button",
          class: "file",
          onClick: c[1] || (c[1] = (f) => i(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Sr = /* @__PURE__ */ U(Y0, [["__scopeId", "data-v-b9156b43"]]), Q0 = { class: "dashboard" }, X0 = { class: "trail" }, J0 = ["onClick"], Z0 = {
  key: 0,
  class: "gone",
  role: "status"
}, eb = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = E(!!n.page && !s(n.page)), l = E(n.page && !o.value ? [n.page] : []), i = M(() => l.value.at(-1) || n.document.start), u = M(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ce(
      () => n.document.start,
      () => l.value = []
    ), (p, b) => (r(), d("div", Q0, [
      e.document.broken ? (r(), j(St, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: L(() => [
          H(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), j(St, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: L(() => [
          H(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(B, { key: 2 }, [
        h("nav", X0, [
          h("button", {
            type: "button",
            class: X(["step", { current: !l.value.length }]),
            onClick: b[0] || (b[0] = ($) => m(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(B, null, Z(l.value, ($, y) => (r(), d(B, {
            key: `${y}-${$}`
          }, [
            b[2] || (b[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: X(["step", { current: y === l.value.length - 1 }]),
              onClick: (w) => m(y + 1)
            }, v(c($)), 11, J0)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Z0, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        A(an, {
          name: "page",
          mode: "out-in"
        }, {
          default: L(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(Sr, {
                node: u.value.view,
                onOpen: f,
                onFile: b[1] || (b[1] = ($) => a("file", $))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, tb = /* @__PURE__ */ U(eb, [["__scopeId", "data-v-fbe83734"]]);
function nb(e, t) {
  const n = at(), a = Oa(e, Co.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), tt(() => {
    s(), a.cancel();
  });
}
const ab = {
  key: 0,
  class: "window-failure"
}, sb = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = at(), o = E(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? nb(l, n.events) : oo(l, () => !0, Co.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", ab, v(o.value.error), 1)) : o.value ? (r(), j(tb, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, ob = 1e4;
class lb {
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
    return this.heardAt !== null && t - this.heardAt > ob;
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
const ib = {
  key: 0,
  class: "frame-note"
}, rb = {
  key: 0,
  class: "frame-note"
}, ub = ["src", "title"], cb = 1e3, db = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = at(), a = E(null), s = E(!1), o = E(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new lb(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, cb);
    }), Te(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", ib, "This window was closed because it stopped answering.")) : (r(), d(B, { key: 1 }, [
      s.value ? (r(), d("div", rb, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        A(ie, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: L(() => [...c[1] || (c[1] = [
            H("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      h("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: O(n).window
      }, null, 8, ub)
    ], 64));
  }
}, fb = /* @__PURE__ */ U(db, [["__scopeId", "data-v-32a49046"]]), mb = {
  class: "allowance-prompt",
  role: "dialog"
}, hb = { class: "allowance-prompt-text" }, pb = { class: "allowance-prompt-buttons" }, vb = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", mb, [
      h("p", hb, v(O(c0)(e.request)), 1),
      h("div", pb, [
        A(ie, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: L(() => [...s[2] || (s[2] = [
            H("Allow", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: L(() => [...s[3] || (s[3] = [
            H("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, gb = /* @__PURE__ */ U(vb, [["__scopeId", "data-v-cad69fe2"]]), ts = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(St, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: L(() => [
        H(v(e.reason) + " ", 1),
        e.retry ? (r(), j(ie, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: L(() => [...s[2] || (s[2] = [
            H("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), j(ie, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: L(() => [...s[3] || (s[3] = [
            H("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, yb = ["data-window", "data-agent"], bb = {
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
    const n = e, a = t, s = E(""), o = E(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = $e(vd, null), u = Of({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: M(() => n.options),
      declared: n.declared,
      page: $e(Mf, null),
      setOption: (m, p) => a("option", m, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (m, p) => {
        a("open", m, p), i == null || i(m, p);
      }
    });
    to(Be, u), ce(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), _e(u.settle), Te(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), Ku((m) => (console.error(`window ${n.name} failed`, m), s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => _a(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), j(gb, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (b) => e.prompts.answer(b))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), j(ts, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), j(ts, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(B, { key: 4 }, [
        (r(), j(c, { key: o.value })),
        e.skeleton.length && !O(u).answered.value ? (r(), j(_o, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), j(ts, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (b) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, yb));
  }
}, gn = /* @__PURE__ */ U(bb, [["__scopeId", "data-v-ec294108"]]), Mr = {
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
    const n = e, a = t, s = { render: () => _a(fb, { src: n.entry.entry_url }) };
    return (o, l) => (r(), j(gn, {
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
      onOption: l[0] || (l[0] = (i, u) => a("option", i, u))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, kb = ["data-window"], _r = {
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
    const n = e, a = t, s = lt(null), o = E("");
    return ce(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Ic();
          } catch (i) {
            if (Oc(i) && Tc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(_o, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, kb)) : (r(), j(gn, {
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
      onOption: i[0] || (i[0] = (u, c) => a("option", u, c))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, Cr = {
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
    const n = t, a = e, s = M(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = M(() => s.value && { render: () => _a(sb, { line: s.value.line, events: s.value.events }) }), l = E(null), i = M(() => {
      var p, b;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((b = l.value) != null && b.component_trusted);
    }), u = M(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = M(
      () => {
        var p, b;
        return l.value ? d0(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((b = s.value) == null ? void 0 : b.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function f() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const p = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = p.ok ? p.value : null;
    }
    async function m() {
      const p = await a.prompts.ask(s.value.title, l.value);
      return await f(), p;
    }
    return ce(
      () => {
        var p, b;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((b = s.value) == null ? void 0 : b.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, b) => {
      var $, y;
      return !s.value && (($ = e.catalogue.loaded) == null ? void 0 : $.value) === !1 ? (r(), j(_o, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((y = s.value) == null ? void 0 : y.shows) === "one-agent" && e.agent === null ? (r(), j(St, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), j(gn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), j(_r, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: b[0] || (b[0] = (w, x) => n("option", w, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), j(Mr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: b[1] || (b[1] = (w, x) => n("option", w, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), j(gn, {
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
        onOption: b[2] || (b[2] = (w, x) => n("option", w, x))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), j(gn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: b[3] || (b[3] = (w) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, wb = ["data-section"], $b = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, xb = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = $e(Ta, null), a = M(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = M(() => ({ row: t.row }));
    return (o, l) => O(n) ? (r(!0), d(B, { key: 0 }, Z(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), j(Cr, {
        key: 0,
        name: i.name,
        catalogue: O(n).catalogue,
        subscriptions: O(n).subscriptions,
        environment: O(n).environment,
        prompts: O(n).prompts,
        "shell-read": O(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", $b, v(i.name) + " is not available", 1))
    ], 8, wb))), 128)) : k("", !0);
  }
}, js = /* @__PURE__ */ U(xb, [["__scopeId", "data-v-a47d36b7"]]), Sb = { class: "rail-head" }, Mb = { key: 0 }, _b = {
  key: 1,
  class: "rail-none"
}, Cb = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: X(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", Sb, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", Mb, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(B, { key: 0 }, Z(e.comments, (a) => (r(), j(wr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", _b, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Eb = /* @__PURE__ */ U(Cb, [["__scopeId", "data-v-4d684649"]]), Ab = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, Ob = ["aria-pressed"], Tb = ["aria-pressed"], Ib = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Bb = {
  key: 0,
  role: "alert"
}, Rb = {
  key: 1,
  class: "sidebar-none"
}, Lb = ["data-question-id"], Nb = { class: "question-state" }, qb = ["data-question-show", "onClick"], Db = {
  key: 0,
  class: "sidebar-none"
}, Pb = {
  key: 1,
  class: "question-answer"
}, jb = {
  __name: "DocumentSidebar",
  props: {
    mode: { type: String, default: "comments" },
    comments: { type: Array, required: !0 },
    questions: { type: Array, required: !0 },
    hot: { type: Number, default: 0 },
    lost: { type: Array, default: () => [] },
    failure: { type: String, default: "" },
    read: { type: Function, required: !0 },
    tab: Boolean,
    commentMore: Boolean,
    commentLoading: Boolean,
    commentFailure: { type: String, default: "" },
    commentTotal: { type: Number, default: 0 }
  },
  emits: ["update:mode", "show", "changed", "more"],
  setup(e) {
    const t = $e(Ta, null);
    return (n, a) => (r(), d("div", {
      class: X(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      h("nav", Ab, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, Ob),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Tb)
      ]),
      e.mode === "comments" ? (r(), d(B, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), j(Eb, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        A(Bn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", Ib, [
        e.failure ? (r(), d("p", Bb, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", Rb, "No questions about this text yet.")),
        (r(!0), d(B, null, Z(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: X(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", Nb, v(O(Jt)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, qb),
            s.quote ? (r(), d(B, { key: 0 }, [
              h("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", Db, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", Pb, "Answered: " + v(s.answer), 1)) : k("", !0),
            A(js, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(go, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = O(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Lb);
        }), 128))
      ]))
    ], 2));
  }
}, yl = /* @__PURE__ */ U(jb, [["__scopeId", "data-v-660e5c85"]]), Fb = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Wb = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = nn({ abstract: n.row.abstract, body: n.row.body }), o = E("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), j(sn, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: L(() => [
        h("span", Fb, v(o.value), 1),
        A(ie, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: L(() => [...u[6] || (u[6] = [
            H("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: L(() => [...u[7] || (u[7] = [
            H("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: L(() => [
        h("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: he(l, ["prevent"])
        }, [
          h("label", null, [
            u[4] || (u[4] = h("span", null, "Abstract", -1)),
            ge(h("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Fe, s.abstract]
            ])
          ]),
          h("label", null, [
            u[5] || (u[5] = h("span", null, "Text", -1)),
            ge(h("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Fe, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Hb = /* @__PURE__ */ U(Wb, [["__scopeId", "data-v-464d77a8"]]);
function Er(e, t) {
  const n = E([]), a = E(!1), s = E(null), o = E(0), l = E(!1), i = E("");
  let u = 0, c = 0;
  const f = ($) => {
    if (typeof $.body == "string") return $.body;
    const { term: y, id: w, title: x } = e(), C = `On ${y} ${w}, ${x}: `;
    return $.text.startsWith(C) ? $.text.slice(C.length) : $.text;
  };
  async function m($ = 1) {
    const { term: y, id: w } = e();
    if (!w) return;
    const x = ++c;
    l.value = !0, i.value = "";
    try {
      const C = await t([y, "comments", String(w), "--page", String($), "--page-size", "25"]);
      if (x !== c) return;
      if (!C.ok) {
        i.value = C.error;
        return;
      }
      const q = C.value.rows ?? [], P = $ === 1 ? q : [...n.value, ...q];
      n.value = [...new Map(P.map((I) => [I.id, I])).values()], o.value = C.value.total ?? n.value.length, s.value = C.value.next_page ?? null;
    } catch (C) {
      x === c && (i.value = C.message);
    } finally {
      x === c && (l.value = !1);
    }
  }
  async function p($) {
    var I;
    const { term: y, id: w } = e(), x = `${y}:${w}`, C = { id: `sending-${++u}`, text: $ };
    n.value = [...n.value, C], o.value++, a.value = !0;
    const q = await t([y, "comment", String(w), $]);
    if (x !== `${e().term}:${e().id}`) return;
    if (!q.ok)
      throw n.value = n.value.filter((Q) => Q.id !== C.id), o.value = Math.max(0, o.value - 1), new Error(q.error);
    await m();
    const P = (I = q.value) == null ? void 0 : I.id;
    P && !n.value.some((Q) => Q.id === P) && (n.value = [...n.value, { ...C, id: P }]);
  }
  const b = () => !l.value && s.value && m(s.value);
  return ce(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: b, nextPage: s, total: o, loading: l, failure: i };
}
function zb(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let u = n.length - 1; u >= 0; u -= 1)
    for (let c = a.length - 1; c >= 0; c -= 1)
      s[u][c] = n[u] === a[c] ? s[u + 1][c + 1] + 1 : Math.max(s[u + 1][c], s[u][c + 1]);
  const o = [];
  let l = 0, i = 0;
  for (; l < n.length || i < a.length; )
    l < n.length && i < a.length && n[l] === a[i] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, i += 1) : i < a.length && (l === n.length || s[l][i + 1] >= s[l + 1][i]) ? (o.push({ key: `new:${i}`, type: "added", text: a[i] }), i += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const Ub = {
  class: "document-tab",
  "data-document-revisions": ""
}, Vb = ["datetime"], Gb = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Kb = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Yb = {
  key: 2,
  class: "document-none"
}, Qb = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(""), l = M(() => [...n.revisions].sort((f, m) => m.number - f.number)), i = M(() => s.value ? zb(s.value.body, n.text) : []);
    async function u(f) {
      const m = await n.read(["doc", "revision", String(n.id), String(f.number)]);
      s.value = m.ok ? m.value : null, o.value = m.ok ? "" : m.error;
    }
    async function c() {
      const f = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = f.ok ? "" : f.error, f.ok && a("restored");
    }
    return (f, m) => (r(), d("div", Ub, [
      e.editing ? (r(), j(ie, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: m[0] || (m[0] = (p) => a("close-revision"))
      }, {
        default: L(() => [...m[1] || (m[1] = [
          H("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(B, { key: 1 }, [
        (r(!0), d(B, null, Z(l.value, (p, b) => (r(), j(ie, {
          key: p.number,
          variant: "text",
          "data-text-revision": p.number,
          onClick: ($) => u(p)
        }, {
          default: L(() => [
            H("Revision " + v(p.number), 1),
            b ? k("", !0) : (r(), d(B, { key: 0 }, [
              H(" · current")
            ], 64)),
            H(": " + v(p.change) + " · " + v(p.author_name) + " · ", 1),
            h("time", {
              datetime: p.created_at
            }, v(p.created_at.slice(0, 16).replace("T", " ")), 9, Vb)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", Gb, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(B, { key: 1 }, [
          A(ie, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: c
          }, {
            default: L(() => [...m[2] || (m[2] = [
              H("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          h("div", Kb, [
            (r(!0), d(B, null, Z(i.value, (p) => (r(), d("div", {
              key: p.key,
              class: X(["revision-line", p.type])
            }, v(p.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", Yb, "No revisions"))
    ]));
  }
}, Xb = /* @__PURE__ */ U(Qb, [["__scopeId", "data-v-d99a0253"]]), Jb = {
  class: "settle-failure",
  role: "alert",
  "data-settle-failure": ""
}, Zb = {
  __name: "DocumentSettleDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(""), o = E("");
    async function l() {
      const i = await n.read([n.term, n.term === "doc" ? "settle" : "close", String(n.id), "--why", s.value.trim()]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), j(sn, {
      padded: "",
      title: `Settle this ${e.term === "doc" ? "document" : "report"}`,
      onClose: u[2] || (u[2] = (c) => a("close"))
    }, {
      foot: L(() => [
        h("span", Jb, v(o.value), 1),
        A(ie, {
          onClick: u[1] || (u[1] = (c) => a("close"))
        }, {
          default: L(() => [...u[4] || (u[4] = [
            H("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          variant: "primary",
          disabled: !s.value.trim(),
          "data-settle-save": "",
          onClick: l
        }, {
          default: L(() => [...u[5] || (u[5] = [
            H("Settle", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: L(() => [
        h("form", {
          class: "settle-form",
          "data-settle-form": "",
          onSubmit: he(l, ["prevent"])
        }, [
          h("label", null, [
            u[3] || (u[3] = h("span", null, "Why does it need no action?", -1)),
            ge(h("textarea", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.value = c),
              rows: "3",
              "data-settle-why": ""
            }, null, 512), [
              [Fe, s.value]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ek = /* @__PURE__ */ U(Zb, [["__scopeId", "data-v-10475409"]]), tk = "button, [data-comment-number]", nk = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Ar(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(tk) || n.push(t.currentNode);
  return n;
}
function bl(e, t, n) {
  const a = document.createRange();
  a.setStart(t, n), a.collapse(!0);
  let s = 0;
  for (const o of e) {
    if (o === t) return s + n;
    if (a.comparePoint(o, 0) >= 0) return s;
    s += o.data.length;
  }
  return s;
}
const ak = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function sk(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Ar(e), s = a.map((c) => c.data).join(""), o = bl(a, n.startContainer, n.startOffset), l = s.slice(o, bl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: ak(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function ok(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function lk(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function ns(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function ik({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function rk(e, t) {
  const n = Ar(e), a = ok(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = lk(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(ik).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(ns(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(ns(t.number, t.id, t.label)) : l.at(-1).append(ns(t.number, t.id, t.label))), !0;
}
function uk(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !rk(e, a) && a.id && n.push(a.id);
  return n;
}
const ck = (e) => e.closest(nk) ?? e;
function kl(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const dk = {
  __name: "DocumentText",
  props: {
    html: { type: String, required: !0 },
    comments: { type: Array, required: !0 },
    annotationLabel: { type: String, default: "Comment" },
    hot: { type: Number, default: 0 },
    pending: { type: Object, default: null },
    inline: { type: Number, default: 0 }
  },
  emits: ["select", "clear", "number", "write", "lost"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = E(null), l = E(null), i = E(null), u = E(!1), c = E(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const y = a.comments.filter((q) => q.quote).map((q) => ({ ...q, label: a.annotationLabel, hot: q.id === a.hot })), w = uk(l.value, a.pending ? [...y, { ...a.pending, pending: !0 }] : y);
      s("lost", w);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const C = document.createElement("div");
      C.className = "inline-comment", ck(x).after(C), c.value = C;
    }
    function m() {
      if (!l.value) return;
      const y = sk(l.value);
      if (u.value = !!y, !y) {
        i.value = null;
        return;
      }
      const w = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(w.left - x.left, 0)}px`, top: `${w.top - x.top + o.value.scrollTop}px` }, s("select", y);
    }
    function p(y) {
      const w = y.target.closest("[data-comment-number]");
      w ? s("number", Number(w.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function b(y) {
      var w;
      (w = l.value.querySelector(`[data-comment="${y}"]`)) == null || w.scrollIntoView({ block: "center" });
    }
    function $(y) {
      var w;
      (w = l.value.querySelectorAll("h3, h4, h5, h6")[y]) == null || w.scrollIntoView({ block: "start" });
    }
    return ce(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), _e(() => {
      f(), document.addEventListener("selectionchange", m);
    }), tt(() => document.removeEventListener("selectionchange", m)), t({ show: b, showHeading: $, nextTick: Re }), (y, w) => (r(), d("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      h("div", {
        ref_key: "text",
        ref: l,
        class: "md document-words",
        "data-resource-text": "",
        onClick: p
      }, null, 512),
      i.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: pe(i.value),
        "data-comment-pill": "",
        onMousedown: w[0] || (w[0] = he(() => {
        }, ["prevent"])),
        onClick: w[1] || (w[1] = (x) => s("write"))
      }, [
        A(se, {
          name: "chat",
          size: 13
        }),
        w[2] || (w[2] = H("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), j(In, {
        key: 1,
        to: c.value
      }, [
        ne(y.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      ne(y.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, fk = /* @__PURE__ */ U(dk, [["__scopeId", "data-v-a92386e6"]]), mk = { class: "document-tabs" }, hk = ["aria-pressed"], pk = { class: "document-body" }, vk = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, gk = {
  key: 1,
  class: "document-loading"
}, yk = {
  key: 3,
  class: "document-pane",
  "data-document-links": ""
}, bk = {
  key: 4,
  class: "document-details",
  "data-resource-fields": ""
}, kk = 760, wk = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, textOnly: Boolean },
  setup(e) {
    const t = e, n = $e(Si, E(null)), a = E(null), s = Ty(a), o = M(() => s.value !== null && s.value < kk), l = E(null), i = E(""), u = E([]), c = E([]), f = E(""), m = E("comments"), p = E("text"), b = E(0), $ = E(!1), y = E(0), w = E([]), x = E(null), C = E(""), q = E(!1), P = E(!1), I = E(""), Q = E(null), W = E(null);
    let R = 0;
    const D = Er(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (K) => t.read(K)), G = M(() => kl(D.comments.value)), _ = M(() => m.value === "questions" ? kl(c.value) : G.value), g = M(() => m.value === "questions" ? _.value.length : D.total.value), S = M(() => {
      var K;
      return (K = l.value) != null && K.body ? ko(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), T = M(() => {
      var K;
      return (((K = l.value) == null ? void 0 : K.body) ?? "").split(`
`).filter((F) => /^#{1,4} /.test(F)).map((F, Y) => ({ key: String(Y), value: Y, label: F.replace(/^#+ /, "") }));
    }), N = M(() => G.value.find((K) => K.id === y.value)), V = M(() => {
      var K;
      return !!((K = l.value) != null && K.close_reason);
    }), J = M(() => V.value ? "Closed" : "Open"), ee = new URLSearchParams(location.search).get("environment") ?? "", oe = M(() => [
      { label: "Edit", group: "own", run: () => q.value = !0 },
      ...V.value ? [] : [{ label: "Settle", group: "own", run: () => P.value = !0 }],
      { label: "Documents", group: "open", run: () => window.open(`?page=documents.page&environment=${encodeURIComponent(ee)}`, "_blank", "noopener") },
      { label: "Copy command", group: "copy", run: ({ say: K }) => Ft(`journal ${t.term} show ${t.id}`, "the command", K) }
    ]), le = M(() => p.value === "comments" && !o.value ? "text" : p.value), ke = (K) => K.ok ? K.value.rows ?? [] : [];
    async function xe() {
      const K = ++R, F = await t.read([t.term, "inspect", String(t.id)]);
      if (K !== R) return;
      i.value = F.ok ? "" : F.error, l.value = F.ok ? F.value : null;
      const Y = F.ok && !t.textOnly ? await kr(t.read, l.value) : { creator: "" }, te = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), ae = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      K === R && (I.value = Y.creator, c.value = ke(te), f.value = te.ok ? "" : te.error, u.value = ae ? ke(ae) : []);
    }
    async function He(K) {
      const F = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], Y = await t.read([t.term, "comment", String(t.id), ...F, "--", K]);
      if (!Y.ok) throw new Error(Y.error);
      x.value = null, await Promise.all([xe(), D.load()]);
    }
    async function Qe() {
      const K = await t.read(["doc", "close", String(t.id)]);
      i.value = K.ok ? "" : K.error, K.ok && await xe();
    }
    function cn() {
      C.value.trim() || (x.value = null);
    }
    async function ve(K) {
      var F;
      if (b.value = K, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        y.value = y.value === K ? 0 : K;
        return;
      }
      $.value = !0, await Re(), (F = a.value.querySelector(m.value === "questions" ? `[data-question-id="${K}"]` : `[data-comment-id="${K}"]`)) == null || F.scrollIntoView({ block: "nearest" });
    }
    async function ye(K) {
      var F, Y;
      p.value = "text", b.value = K, await ((F = Q.value) == null ? void 0 : F.nextTick()), (Y = Q.value) == null || Y.show(K);
    }
    function z() {
      q.value = !1, P.value = !1, xe();
    }
    return ce(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", $.value = !1, b.value = 0, y.value = 0, x.value = null, c.value = [], f.value = "", xe();
    }, { immediate: !0 }), ce(m, () => {
      b.value = 0, y.value = 0;
    }), (K, F) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), j(In, {
        key: 0,
        to: O(n),
        disabled: !O(n)
      }, [
        h("span", {
          class: X(["document-actions", { placed: O(n) }]),
          "data-document-actions": ""
        }, [
          e.textOnly ? k("", !0) : (r(), j(Oy, {
            key: 0,
            items: oe.value,
            head: l.value.title
          }, null, 8, ["items", "head"])),
          le.value === "text" && T.value.length > 1 ? (r(), j(ro, {
            key: 1,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: T.value,
            "data-text-chapters": "",
            onPick: F[0] || (F[0] = (Y) => {
              var te;
              return (te = Q.value) == null ? void 0 : te.showHeading(Y.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      h("nav", mk, [
        h("button", {
          type: "button",
          class: X(["document-tab-button", { on: le.value === "text" }]),
          "data-document-tab": "text",
          onClick: F[1] || (F[1] = (Y) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: X(["document-tab-button", { on: le.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: F[2] || (F[2] = (Y) => p.value = "comments")
        }, [
          H(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(g.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: X(["document-tab-button", { on: $.value }]),
          "aria-pressed": $.value,
          "data-document-notes-toggle": "",
          onClick: F[3] || (F[3] = (Y) => $.value = !$.value)
        }, [
          H(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(g.value || ""), 1)
        ], 10, hk)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: X(["document-tab-button", { on: le.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: F[4] || (F[4] = (Y) => p.value = "revisions")
        }, [
          F[18] || (F[18] = H("Revisions ", -1)),
          h("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0),
        e.textOnly ? k("", !0) : (r(), d(B, { key: 3 }, [
          h("button", {
            type: "button",
            class: X(["document-tab-button", { on: le.value === "links" }]),
            "data-document-tab": "links",
            onClick: F[5] || (F[5] = (Y) => p.value = "links")
          }, "Links", 2),
          h("button", {
            type: "button",
            class: X(["document-tab-button", { on: le.value === "details" }]),
            "data-document-tab": "details",
            onClick: F[6] || (F[6] = (Y) => p.value = "details")
          }, "Details", 2)
        ], 64))
      ]),
      h("div", pk, [
        i.value ? (r(), d("p", vk, v(i.value), 1)) : l.value ? le.value === "revisions" ? (r(), j(Xb, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: Qe,
          onRestored: xe
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : le.value === "links" ? (r(), d("div", yk, [
          A(Mo, {
            model: e.term,
            id: e.id,
            read: e.read,
            open: "",
            onOpen: F[7] || (F[7] = (Y) => O(Ze)(Y.table, Y.id))
          }, null, 8, ["model", "id", "read"])
        ])) : le.value === "details" ? (r(), d("dl", bk, [
          I.value ? (r(), d(B, { key: 0 }, [
            F[19] || (F[19] = h("dt", null, "By", -1)),
            h("dd", null, v(I.value), 1)
          ], 64)) : k("", !0),
          F[21] || (F[21] = h("dt", null, "State", -1)),
          h("dd", null, v(J.value), 1),
          l.value.close_reason ? (r(), d(B, { key: 1 }, [
            F[20] || (F[20] = h("dt", null, "Why settled", -1)),
            h("dd", null, v(l.value.close_reason), 1)
          ], 64)) : k("", !0),
          F[22] || (F[22] = h("dt", null, "Created", -1)),
          h("dd", null, [
            A(Ye, {
              at: l.value.created_at
            }, null, 8, ["at"])
          ]),
          F[23] || (F[23] = h("dt", null, "Updated", -1)),
          h("dd", null, [
            A(Ye, {
              at: l.value.updated_at
            }, null, 8, ["at"])
          ])
        ])) : le.value === "comments" ? (r(), j(yl, {
          key: 5,
          mode: m.value,
          "onUpdate:mode": F[8] || (F[8] = (Y) => m.value = Y),
          tab: "",
          comments: G.value,
          questions: c.value,
          hot: b.value,
          lost: w.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!O(D).nextPage.value,
          "comment-loading": O(D).loading.value,
          "comment-failure": O(D).failure.value,
          "comment-total": O(D).total.value,
          onMore: O(D).loadMore,
          onShow: ye,
          onChanged: xe
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(B, { key: 6 }, [
          A(fk, {
            ref_key: "words",
            ref: Q,
            html: S.value,
            comments: _.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: b.value,
            pending: x.value,
            inline: y.value,
            onSelect: F[10] || (F[10] = (Y) => x.value = Y),
            onClear: cn,
            onNumber: ve,
            onWrite: F[11] || (F[11] = (Y) => {
              var te;
              return (te = W.value) == null ? void 0 : te.focus();
            }),
            onLost: F[12] || (F[12] = (Y) => w.value = Y)
          }, {
            inline: L(() => [
              N.value ? (r(), j(wr, {
                key: 0,
                comment: N.value,
                hot: "",
                onShow: F[9] || (F[9] = (Y) => ye(N.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && $.value ? (r(), j(yl, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": F[13] || (F[13] = (Y) => m.value = Y),
            comments: G.value,
            questions: c.value,
            hot: b.value,
            lost: w.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!O(D).nextPage.value,
            "comment-loading": O(D).loading.value,
            "comment-failure": O(D).failure.value,
            "comment-total": O(D).total.value,
            onMore: O(D).loadMore,
            onShow: ye,
            onChanged: xe
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", gk, [
          A(nt)
        ]))
      ]),
      l.value ? (r(), j(u0, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: C.value,
        "onUpdate:draft": F[14] || (F[14] = (Y) => C.value = Y),
        selection: x.value,
        send: He,
        narrow: o.value,
        onClear: F[15] || (F[15] = (Y) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      P.value ? (r(), j(ek, {
        key: 2,
        term: e.term,
        id: e.id,
        read: e.read,
        onClose: F[16] || (F[16] = (Y) => P.value = !1),
        onSaved: z
      }, null, 8, ["term", "id", "read"])) : k("", !0),
      q.value ? (r(), j(Hb, {
        key: 3,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: F[17] || (F[17] = (Y) => q.value = !1),
        onSaved: z
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, CA = /* @__PURE__ */ U(wk, [["__scopeId", "data-v-9dd1cac8"]]), $k = {
  key: 1,
  class: "row-list-failure"
}, xk = ["data-row"], Sk = {
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
    arrival: { type: Object, default: null },
    // whether rows glide to their new place when their order changes, with the move of the activity list
    moves: Boolean,
    // whether rows that leave are removed at once, for a parent that measures the list right after a change
    leavesAtOnce: Boolean
  },
  setup(e) {
    const t = e, n = M(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = E(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), j(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", $k, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), j(St, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: L(() => [
        H(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(B, { key: 3 }, [
      (r(), j(Je(e.arrival || e.moves ? no : "ul"), Ne(n.value, { class: "row-list" }), {
        default: L(() => [
          (r(!0), d(B, null, Z(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ne(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, xk))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (r(), j(Mi, {
        key: 0,
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, {
        default: L(() => [...l[1] || (l[1] = [
          H("Show more", -1)
        ])]),
        _: 1
      })) : k("", !0)
    ], 64));
  }
}, Mk = /* @__PURE__ */ U(Sk, [["__scopeId", "data-v-107f794b"]]), _k = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ck = {
  key: 1,
  class: "agent-rows-note"
}, Ek = {
  key: 2,
  class: "agent-rows-note"
}, Ak = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Ok = ["data-agent-row", "onClick"], Tk = { class: "agent-row-name" }, Ik = { class: "agent-row-state" }, Bk = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = M(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", _k, [
      e.loaded ? e.failure ? (r(), d("p", Ck, v(e.failure), 1)) : e.rows.length ? (r(), d(B, { key: 3 }, [
        h("p", Ak, v(a.value) + " running", 1),
        (r(!0), d(B, null, Z(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => O(Pe)(`agents:${l.id}`)
        }, [
          h("span", Tk, "#" + v(l.id) + " " + v(l.session), 1),
          h("span", Ik, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Ok))), 128))
      ], 64)) : (r(), d("p", Ek, v(e.none), 1)) : (r(), j(nt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, EA = /* @__PURE__ */ U(Bk, [["__scopeId", "data-v-a01e5a17"]]), gt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ke = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ge = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Rk = 6;
function Eo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Lk = (e) => {
  const t = Eo(e, gt.lineChars), n = Math.max(gt.minWidth, Math.max(...t.map((a) => a.length)) * gt.charWidth + gt.padX * 2);
  return { name: e, lines: t, line: gt.line, padY: gt.padY, width: n, height: t.length * gt.line + gt.padY * 2 };
};
function Nk(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function qk(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Dk(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, u) => [i, u]))), o = (l, i) => {
    const u = s(), c = (f) => {
      const m = i(f).map((p) => u.get(p));
      return m.length ? m.reduce((p, b) => p + b, 0) / m.length : u.get(f);
    };
    return [...l].sort((f, m) => c(f) - c(m));
  };
  for (let l = 0; l < Rk; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function Pk(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, i) => {
    const u = `${s[o]}:${l}`;
    (n.get(u) || n.set(u, []).get(u)).push({ arrow: s, end: o, other: i });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, i) => o[`${l}Share`] = (i + 1) / (s.length + 1));
}
function jk(e) {
  const t = [...new Set(e.flatMap(([P, I]) => [P, I]))], n = new Set(e.map(([, P]) => P)), a = t.filter((P) => !n.has(P)), s = Nk(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((P, I) => !s.has(I)), l = qk(t, o), i = Dk(t, o, l), u = new Map(t.map((P) => [P, Lk(P)])), c = i.map((P) => P.reduce((I, Q) => I + u.get(Q).width, 0) + Ge.across * (P.length - 1)), f = Math.max(...c) + Ge.margin * 2, m = Wk(e, l, i.length), p = /* @__PURE__ */ new Map();
  let b = Ge.margin;
  i.forEach((P, I) => {
    let Q = (f - c[I]) / 2;
    const W = Math.max(...P.map((R) => u.get(R).height));
    P.forEach((R) => {
      const D = u.get(R);
      p.set(R, { ...D, x: Q, y: b + (W - D.height) / 2 }), Q += D.width + Ge.across;
    }), b += W + (m[I] ?? Ge.down);
  });
  const $ = e.map(([P, I, Q], W) => ({ from: P, to: I, label: Q || "", back: s.has(W) || l.get(I) <= l.get(P) }));
  Pk($, p);
  const y = $.map((P) => Hk(P, p.get(P.from), p.get(P.to))), w = [...p.values()], x = Gk(y, w), C = Math.max(b - Ge.down, ...x.filter((P) => P.label).map((P) => P.label.y + P.label.height));
  return { width: Math.max(f - Ge.margin, ...x.filter((P) => P.label).map((P) => P.label.x + P.label.width)) + Ge.margin, height: C + Ge.margin, nodes: w, arrows: x };
}
const Fk = (e) => e ? Eo(e, Ke.lineChars).length * Ke.line + Ke.pad * 2 : 0;
function Wk(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ge.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += Fk(l) + Ge.labelSpace);
  }), a.map((s) => Math.max(Ge.down, s));
}
function Hk(e, t, n) {
  const a = e.label ? Eo(e.label, Ke.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ke.charWidth + Ke.pad * 2 : 0, o = a.length * Ke.line + (a.length ? Ke.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const zk = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Uk = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Vk = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ke.line);
function Gk(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = zk(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Vk.flatMap((u) => Uk.map((c) => s(c, u))).find((u) => !n.some((c) => wl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => wl(i, u)); ) i.y += Ke.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ke.line, pad: Ke.pad } };
  });
}
const wl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Kk = { class: "flowchart-tools" }, Yk = ["width", "height", "viewBox", "aria-label"], Qk = ["d"], Xk = ["x", "y", "width", "height"], Jk = ["x", "y"], Zk = ["x", "dy"], ew = {
  key: 0,
  class: "flowchart-label"
}, tw = ["x", "y", "width", "height"], nw = ["x", "y"], aw = ["x", "dy"], sw = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => jk(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = E(null), i = E({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var x;
      const y = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(y != null && y.width)) return;
      const w = Math.min(y.width / s.value.width, y.height / s.value.height, 1.5);
      i.value = { zoom: w, x: (y.width - s.value.width * w) / 2, y: (y.height - s.value.height * w) / 2 };
    }
    function f(y, w, x) {
      const { zoom: C, x: q, y: P } = i.value, I = Math.min(o.most, Math.max(o.least, C * y));
      i.value = { zoom: I, x: w - (w - q) * I / C, y: x - (x - P) * I / C };
    }
    function m(y) {
      const w = l.value.getBoundingClientRect();
      f(y, w.width / 2, w.height / 2);
    }
    function p(y) {
      const w = l.value.getBoundingClientRect();
      y.ctrlKey || y.metaKey ? f(y.deltaY < 0 ? o.step : 1 / o.step, y.clientX - w.left, y.clientY - w.top) : i.value = { ...i.value, x: i.value.x - y.deltaX, y: i.value.y - y.deltaY };
    }
    function b(y) {
      var w, x, C;
      y.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), u = { x: y.clientX - i.value.x, y: y.clientY - i.value.y }, (C = (x = l.value).setPointerCapture) == null || C.call(x, y.pointerId);
    }
    function $(y) {
      u && (i.value = { ...i.value, x: y.clientX - u.x, y: y.clientY - u.y });
    }
    return _e(c), (y, w) => (r(), j(sn, {
      padded: "",
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (x) => a("close"))
    }, {
      default: L(() => [
        h("div", Kk, [
          A(ie, {
            small: "",
            onClick: w[0] || (w[0] = (x) => m(o.step))
          }, {
            default: L(() => [...w[5] || (w[5] = [
              H("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(ie, {
            small: "",
            onClick: w[1] || (w[1] = (x) => m(1 / o.step))
          }, {
            default: L(() => [...w[6] || (w[6] = [
              H("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(ie, {
            small: "",
            onClick: c
          }, {
            default: L(() => [...w[7] || (w[7] = [
              H("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        h("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: he(p, ["prevent"]),
          onPointerdown: b,
          onPointermove: $,
          onPointerup: w[2] || (w[2] = (x) => Vo(u) ? u.value = null : u = null),
          onPointercancel: w[3] || (w[3] = (x) => Vo(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: pe({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            w[8] || (w[8] = h("defs", null, [
              h("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                h("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (r(!0), d(B, null, Z(s.value.arrows, (x, C) => (r(), d("path", {
              key: `arrow-${C}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Qk))), 128)),
            (r(!0), d(B, null, Z(s.value.nodes, (x) => (r(), d("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, Xk),
              h("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (r(!0), d(B, null, Z(x.lines, (C, q) => (r(), d("tspan", {
                  key: q,
                  x: x.x + x.width / 2,
                  dy: q ? x.line : 0
                }, v(C), 9, Zk))), 128))
              ], 8, Jk)
            ]))), 128)),
            (r(!0), d(B, null, Z(s.value.arrows, (x, C) => (r(), d(B, {
              key: `label-${C}`
            }, [
              x.label ? (r(), d("g", ew, [
                h("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, tw),
                h("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (r(!0), d(B, null, Z(x.label.lines, (q, P) => (r(), d("tspan", {
                    key: P,
                    x: x.label.x + x.label.width / 2,
                    dy: P ? x.label.line : 0
                  }, v(q), 9, aw))), 128))
                ], 8, nw)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Yk))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ow = /* @__PURE__ */ U(sw, [["__scopeId", "data-v-e98799dc"]]), lw = ["data-tip", "aria-label"], iw = {
  key: 0,
  class: "mact-word"
}, rw = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(Ct, { name: "open" }),
      e.open ? (r(), d("span", iw, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, lw));
  }
}, Or = /* @__PURE__ */ U(rw, [["__scopeId", "data-v-3b292e09"]]), Tr = 120, la = 280, Ir = 160, uw = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, cw = ["leaving", "resizing", "entering"];
function Fs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function dw(e) {
  const t = cw.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Fs(e);
  return e.classList.add(...t), n;
}
function Br(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = E(t()), s = E("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const b = dw(m);
    l(m, p), m.offsetWidth, m.style.transition = `width ${la}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${la}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(m, b);
  }
  function c(m) {
    const p = m.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let b = p.offsetHeight;
    const $ = new ResizeObserver(() => {
      p.offsetHeight !== b && (b = p.offsetHeight, u(m, Fs(m)));
    });
    return $.observe(p), $;
  }
  async function f(m) {
    const p = e.value, b = ++o;
    if (!p || !p.offsetWidth || uw()) {
      a.value = m;
      return;
    }
    const $ = Fs(p);
    if (l(p, $), s.value = "leaving", await n(Tr), b !== o) return;
    a.value = m, s.value = "resizing", await Re(), u(p, $);
    const y = c(p);
    await n(la), y == null || y.disconnect(), b === o && (i(p), s.value = "entering", await n(Ir), b === o && (s.value = ""));
  }
  return ce(t, (m) => f(m)), tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const fw = { class: "growing-card-top" }, mw = ["aria-expanded"], hw = { class: "growing-card-avatar" }, pw = { class: "growing-card-title" }, vw = { class: "growing-card-more" }, gw = { class: "growing-card-body" }, yw = {
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
    const n = e, a = t, s = E(!1), o = E(null), { folded: l, phase: i } = Br(o, () => !s.value), u = M(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = M(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", O(i), { open: !O(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", fw, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", hw, [
            e.bad ? (r(), j(Ct, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(B, { key: 1 }, [
              H(v(u.value), 1)
            ], 64)) : (r(), j(se, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          h("span", pw, v(e.title), 1),
          A(rn, { open: s.value }, null, 8, ["open"])
        ], 8, mw),
        e.action ? (r(), j(Or, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: m[1] || (m[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : k("", !0),
        e.commentable ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: m[2] || (m[2] = (p) => a("comment"))
        }, [
          A(se, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      h("div", vw, [
        h("div", gw, [
          (r(!0), d(B, null, Z(c.value, (p, b) => (r(), d("p", {
            key: b,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, bw = /* @__PURE__ */ U(yw, [["__scopeId", "data-v-f2b4930d"]]), kw = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, ww = { class: "md inline" }, $w = ["disabled", "title", "onClick"], xw = {
  key: 1,
  class: "message-links-many"
}, Sw = ["aria-expanded"], Mw = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, _w = ["disabled", "onClick"], Cw = { class: "row-pill message-links-chip" }, Ew = { class: "message-links-title" }, Aw = { key: 0 }, as = 3, Ow = "task", Tw = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.total || n.links.length), o = M(() => n.links.every((p) => p.endpoint.model === Ow) ? "tasks" : "items"), l = E(!1), i = E(null);
    Ci(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, Pe(p.endpoint.open_ref));
    }
    return (p, b) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: X(["message-links", { many: s.value > as, three: s.value === as, open: l.value }]),
      "data-message-links": ""
    }, [
      A(Ct, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", kw, [
        h("span", ww, [
          b[1] || (b[1] = H("Linked: ", -1)),
          (r(!0), d(B, null, Z(e.links, ($) => (r(), d("button", {
            key: `${$.endpoint.model}:${$.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c($),
            title: $.endpoint.title,
            onClick: (y) => m($)
          }, [
            H(v($.endpoint.model.replaceAll("_", " ")) + " " + v($.endpoint.id), 1),
            f($) ? (r(), d(B, { key: 0 }, [
              H(" (" + v(f($)) + ")", 1)
            ], 64)) : k("", !0),
            c($) ? (r(), d(B, { key: 1 }, [
              H(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, $w))), 128))
        ])
      ])) : k("", !0),
      s.value >= as ? (r(), d("span", xw, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          H(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(rn, { open: l.value }, null, 8, ["open"])
        ], 8, Sw)
      ])) : k("", !0),
      l.value ? (r(), d("div", Mw, [
        (r(!0), d(B, null, Z(e.links, ($) => (r(), d("button", {
          key: `${$.endpoint.model}:${$.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c($),
          onClick: (y) => m($)
        }, [
          h("span", Cw, v($.endpoint.model.replaceAll("_", " ")) + " " + v($.endpoint.id), 1),
          h("span", Ew, v($.endpoint.title), 1),
          h("span", null, v(f($)), 1),
          c($) ? (r(), d("span", Aw, "Unavailable")) : k("", !0)
        ], 8, _w))), 128))
      ])) : k("", !0),
      A(Bn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: b[0] || (b[0] = ($) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Iw = /* @__PURE__ */ U(Tw, [["__scopeId", "data-v-843fc3bd"]]), Bw = ["title", "aria-label"], Rw = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Lw = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Nw = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = M(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: X(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", Rw, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Lw)) : k("", !0)
      ]))
    ], 10, Bw));
  }
}, qw = /* @__PURE__ */ U(Nw, [["__scopeId", "data-v-6dc92808"]]), Dw = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Pw = (e) => e.worker_id != null ? "report" : "message", jw = (e) => Dw[Pw(e)], Fw = "img,pre,table";
function Ww(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Hw(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function zw(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Fw)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Ww(Hw(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Uw(e, t) {
  let n = null;
  const a = () => e.value && zw(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), ce(t, a, { flush: "post" });
}
const $l = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Vw(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Xn = /* @__PURE__ */ new WeakMap(), qe = "work", ot = "sent", Gw = 50, xl = 50, Sl = () => ({ rows: E([]), total: E(0), next: E(null), loading: E(!1), failure: E(""), version: 0 });
function Kw(e) {
  var y;
  if (Xn.has(e)) return Xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (w) => {
    var x;
    return ((x = e.visible) == null ? void 0 : x.value) !== !1 && [...w.views].some((C) => C.visible);
  };
  function o(w, x) {
    const C = w[x], q = ++C.version;
    return C.loading.value = !0, C.failure.value = "", q;
  }
  function l(w, x, C, q, P) {
    const I = w[x];
    if (t.get(w.id) !== w || I.version !== C) return;
    if (I.loading.value = !1, !P.ok) {
      I.failure.value = P.error;
      return;
    }
    const Q = x === qe ? P.value.counterparts ?? [] : P.value.rows ?? [], W = q === 1 ? Q : [...I.rows.value, ...Q], R = x === qe ? (D) => `${D.endpoint.model}:${D.endpoint.id}` : (D) => D.id ?? D.target_id;
    I.rows.value = [...new Map(W.map((D) => [R(D), D])).values()], I.total.value = P.value.total ?? I.rows.value.length, I.next.value = P.value.next_page ?? null;
  }
  function i(w, x, C, q) {
    const P = w[x];
    P.version === C && (P.failure.value = q.message, P.loading.value = !1);
  }
  async function u(w, x, C) {
    const q = o(w, x), P = x === qe ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(w, x, q, C, await e.read(`link list --source message:${w.id} ${P} --page ${C} --page-size ${x === qe ? 10 : 25}`));
    } catch (I) {
      i(w, x, q, I);
    }
  }
  async function c(w) {
    const x = w.map((C) => ({ [qe]: o(C, qe), [ot]: o(C, ot) }));
    try {
      const C = await e.read(`link receipts --messages ${w.map((q) => q.id).join(",")}`);
      w.forEach((q, P) => {
        const I = C.ok ? C.value.messages[String(q.id)] : null;
        l(q, qe, x[P][qe], 1, C.ok ? { ok: !0, value: I.named } : C), l(q, ot, x[P][ot], 1, C.ok ? { ok: !0, value: I.sent } : C);
      });
    } catch (C) {
      w.forEach((q, P) => [qe, ot].forEach((I) => i(q, I, x[P][I], C)));
    }
  }
  function f() {
    a = null;
    const w = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), w.forEach((x) => x.dirty.clear());
    for (let x = 0; x < w.length; x += xl) c(w.slice(x, x + xl));
  }
  function m(w, x = [qe, ot]) {
    for (const C of x) w.dirty.add(C);
    s(w) && (n.add(w.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(w) {
    const x = w.sources ?? (w.source_model && Number.isInteger(w.source_id) ? [{ model: w.source_model, id: w.source_id }] : []), C = w.link_types ?? (w.link_type ? [w.link_type] : []), q = C.length ? [qe, ot].filter((I) => I === qe ? C.some((Q) => ["about", "edited"].includes(Q)) : C.includes("sent_to")) : [qe, ot];
    if (!q.length) return;
    const P = x.length ? [...new Set(x.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, Gw);
    for (const I of P) m(I, q);
  }
  const b = (y = e.follow) == null ? void 0 : y.call(e, ["link.*"], p), $ = {
    attach(w, x) {
      let C = t.get(w);
      return C || (C = { id: w, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([qe, ot]), work: Sl(), sent: Sl() }, t.set(w, C)), C.views.add(x), C.dirty.size && m(C, [...C.dirty]), C;
    },
    shown(w) {
      w.dirty.size && m(w, [...w.dirty]);
    },
    detach(w, x) {
      w.views.delete(x), w.views.size || t.delete(w.id), t.size || (clearTimeout(a), b == null || b(), Xn.delete(e));
    },
    more(w, x) {
      const C = w == null ? void 0 : w[x];
      if (C != null && C.next.value && !C.loading.value) return u(w, x, C.next.value);
    }
  };
  return Xn.set(e, $), $;
}
function Yw(e, t, n) {
  const a = lt(null);
  let s = null;
  const o = ce(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Kw(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((b) => {
      c.visible = b.some(($) => $.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = ce(n, (b) => {
      m == null || m.disconnect(), b && (m == null || m.observe(b));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), m == null || m.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return Aa(o), {
    links: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: M(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: M(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: M(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, qe),
    loadSent: () => s == null ? void 0 : s.more(a.value, ot)
  };
}
const Qw = ["data-incoming", "data-ref"], Xw = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Jw = { class: "message-body" }, Zw = ["title"], e2 = ["innerHTML"], t2 = ["innerHTML"], n2 = {
  class: "message-faces",
  "data-message-faces": ""
}, a2 = ["title", "data-face", "onClick"], s2 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, o2 = ["title", "data-reaction", "onClick"], l2 = {
  key: 0,
  class: "message-reaction-count"
}, i2 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, r2 = ["href", "title"], u2 = ["src", "alt"], c2 = ["href"], d2 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, f2 = { class: "message-foot" }, m2 = { class: "message-time" }, h2 = {
  class: "message-id",
  "data-message-id": ""
}, p2 = 1500, v2 = "An earlier message", g2 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E(null), l = M(() => ["user", "comment"].includes(n.message.type)), i = M(() => {
      const [ve, ye] = (n.message.commented_row || ":").split(":"), z = dt(ve);
      return z ? { ref: `${z}:${ye}`, label: `${on(z).title.toLowerCase()} ${ye}` } : null;
    }), u = M(() => n.message.worker_id ?? null), c = M(() => jw(n.message)), f = M(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, p2);
    }
    const p = nr(), b = M(() => p(n.message.text ?? "")), $ = M(() => JSON.parse(n.message.flowchart_edges || "[]")), y = E(!1), w = M(() => Rs(n.quote)), x = M(() => p(w.value || v2));
    function C() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : Pe(`messages:${n.message.parent_id}`);
    }
    Uw(o, () => `${n.message.text} ${w.value}`);
    const q = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, P = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, I = M(() => JSON.parse(n.message.captions || "{}")), Q = M(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: P(ve), isImage: q.test(ve), title: I.value[ve] || ve }))), W = M(() => mr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), R = $e(Be, null), { links: D, total: G, more: _, loading: g, failure: S, sentTo: T, sentMore: N, sentLoading: V, sentFailure: J, loadMore: ee, loadSent: oe } = Yw(R, () => l.value && !n.message.local ? n.message.id : null, o), le = E(!1), ke = M(() => Vw(n.message.reactions)), xe = M(() => Number.isInteger(n.message.id)), He = () => `${location.href.split("#")[0]}#open=messages:${n.message.id}`, Qe = () => ({
      head: Mn(n.message.text ?? "", 40),
      items: [
        { label: "Reply", group: "open", disabled: !xe.value, reason: "Not sent yet", run: () => a("reply", n.message) },
        { label: "React", group: "open", disabled: !xe.value, reason: "Not sent yet", children: $l.map((ve) => ({ label: ve, run: () => a("react", n.message, ve) })) },
        { label: "Copy text", group: "copy", run: ({ say: ve }) => Ft(n.message.text ?? "", "the message", ve) },
        { label: "Copy link", group: "copy", disabled: !xe.value, reason: "Not sent yet", run: ({ say: ve }) => Ft(He(), "the link", ve) },
        { label: "Pin to the top of the chat", disabled: !xe.value || !R, reason: "Not sent yet", run: async ({ say: ve }) => {
          const ye = await R.run(["pin", "make", Mn(n.message.text ?? "", 60) || `Message ${n.message.id}`, "--link", `messages:${n.message.id}`]);
          ve(ye.ok ? "Pinned" : ye.error);
        } }
      ]
    });
    function cn(ve) {
      le.value = !1, a("react", n.message, ve);
    }
    return (ve, ye) => e.message.peer || e.message.recipient ? ge((r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(bw, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ye[0] || (ye[0] = (z) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Qw)), [
      [O(Et), Qe]
    ]) : ge((r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", Jw, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: i.value }]),
          onClick: ye[5] || (ye[5] = (...z) => O(Kt) && O(Kt)(...z))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ye[1] || (ye[1] = he((z) => O(Pe)(i.value.ref), ["stop"]))
          }, [
            A(se, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Zw)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: he(C, ["stop"]),
            innerHTML: x.value
          }, null, 8, e2)) : k("", !0),
          u.value !== null ? (r(), j(xn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: ye[2] || (ye[2] = he((z) => O(Pe)(`agents:${u.value}`), ["stop"]))
          }, {
            default: L(() => [
              H("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          A(Qi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: L(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: b.value
              }, null, 8, t2)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          $.value.length ? (r(), d(B, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ye[3] || (ye[3] = (z) => y.value = !0)
            }, "Open the flowchart"),
            y.value ? (r(), j(ow, {
              key: 0,
              title: e.message.text,
              edges: $.value,
              onClose: ye[4] || (ye[4] = (z) => y.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        h("div", {
          class: X(["message-tools", { picking: le.value }]),
          "data-message-tools": ""
        }, [
          le.value ? (r(), d(B, { key: 0 }, [
            h("div", n2, [
              (r(!0), d(B, null, Z(O($l), (z) => (r(), d("button", {
                key: z,
                type: "button",
                class: "message-face",
                title: `React ${z}`,
                "data-face": z,
                onClick: (K) => cn(z)
              }, v(z), 9, a2))), 128))
            ]),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ye[6] || (ye[6] = (z) => le.value = !1)
            }, [
              A(se, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(B, { key: 1 }, [
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ye[7] || (ye[7] = (z) => le.value = !0)
            }, "React"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ye[8] || (ye[8] = (z) => a("reply", e.message))
            }, "Reply"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, v(s.value ? "Copied" : "Copy"), 1),
            f.value ? (r(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ye[9] || (ye[9] = (z) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      ke.value.length ? (r(), d("div", s2, [
        (r(!0), d(B, null, Z(ke.value, (z) => (r(), d("button", {
          key: z.emoji,
          type: "button",
          class: X(["message-reaction", { mine: z.mine }]),
          title: z.title,
          "data-reaction": z.emoji,
          onClick: (K) => a("react", e.message, z.emoji)
        }, [
          H(v(z.emoji) + " ", 1),
          z.count > 1 ? (r(), d("span", l2, v(z.count), 1)) : k("", !0)
        ], 10, o2))), 128))
      ])) : k("", !0),
      Q.value.length ? (r(), d("div", i2, [
        (r(!0), d(B, null, Z(Q.value, (z) => (r(), d(B, {
          key: z.name
        }, [
          z.isImage ? (r(), d("a", {
            key: 0,
            href: z.address,
            target: "_blank",
            class: "message-image",
            title: z.title
          }, [
            h("img", {
              src: z.address,
              alt: z.name,
              "data-figure-picture": ""
            }, null, 8, u2)
          ], 8, r2)) : (r(), d("a", {
            key: 1,
            href: z.address,
            target: "_blank",
            class: "message-file"
          }, v(z.name), 9, c2))
        ], 64))), 128))
      ])) : k("", !0),
      O(T).length ? (r(), d("div", d2, [
        A(se, {
          name: "send",
          size: 12
        }),
        (r(!0), d(B, null, Z(O(T), (z) => (r(), j(xn, {
          key: z.id,
          as: "button",
          "agent-id": z.id,
          label: `Worker ${z.id}`,
          class: "message-sent-worker",
          disabled: z.unavailable || !z.open_ref,
          "data-sent-worker": z.id,
          onClick: he((K) => z.open_ref && O(Pe)(z.open_ref), ["stop"])
        }, {
          default: L(() => [
            H("Also sent to worker " + v(z.id), 1),
            z.unavailable ? (r(), d(B, { key: 0 }, [
              H(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      A(Bn, {
        more: O(N),
        loading: O(V),
        failure: O(J),
        label: "More recipients",
        onMore: O(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", f2, [
        h("time", m2, v(W.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(B, { key: 0 }, [
          ye[10] || (ye[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", h2, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), j(qw, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      O(D).length || O(S) ? (r(), j(Iw, {
        key: 3,
        links: O(D),
        total: O(G),
        more: O(_),
        loading: O(g),
        failure: O(S),
        onMore: O(ee)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Xw)), [
      [O(Et), Qe]
    ]);
  }
}, AA = /* @__PURE__ */ U(g2, [["__scopeId", "data-v-7241010f"]]), ya = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ss = 200, Rr = (e) => {
  var t;
  return ((t = ya.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ya[0].key;
}, OA = (e) => {
  var t;
  return ((t = ya.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, y2 = ["aria-label"], b2 = 300, Ml = 400, k2 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ss } },
  setup(e) {
    const t = e, n = M(() => Rr(t.value)), a = M(() => n.value < ss ? [1, 0.25, 0.25] : n.value === ss ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: X(["ico", "prio", { hot: n.value >= Ml, high: n.value >= b2 && n.value < Ml }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      h("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: pe({ opacity: a.value[0] })
      }, null, 4),
      h("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: pe({ opacity: a.value[1] })
      }, null, 4),
      h("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: pe({ opacity: a.value[2] })
      }, null, 4)
    ], 10, y2));
  }
}, TA = /* @__PURE__ */ U(k2, [["__scopeId", "data-v-b10e610f"]]), Lr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], IA = (e) => {
  const t = Lr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, w2 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, _l = (e) => w2[e.card.state] || "idle", $2 = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Cl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, El = (e, t) => Cl[_l(e)] - Cl[_l(t)], Al = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, BA = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => El(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || $2(a, s)) : [...e].sort((a, s) => El(a, s) || (Al[t] || Al.state)(a, s)), x2 = { class: "list-row" }, S2 = {
  key: 0,
  class: "list-row-type"
}, M2 = { class: "list-row-main" }, _2 = {
  key: 0,
  class: "list-row-title"
}, C2 = { class: "list-row-body" }, E2 = {
  key: 1,
  class: "list-row-end"
}, A2 = {
  key: 1,
  class: "list-row-line"
}, O2 = {
  key: 2,
  class: "list-row-text"
}, T2 = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", x2, [
      e.type ? (r(), d("span", S2, v(e.type), 1)) : k("", !0),
      h("div", M2, [
        e.title ? (r(), d("span", _2, v(e.title), 1)) : k("", !0),
        h("div", C2, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", E2, [
          ne(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      t.$slots.text ? (r(), d("div", A2, [
        ne(t.$slots, "text", {}, void 0, !0)
      ])) : e.text ? (r(), d("span", O2, v(e.text), 1)) : k("", !0)
    ]));
  }
}, I2 = /* @__PURE__ */ U(T2, [["__scopeId", "data-v-f1b2d4cf"]]), RA = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = M(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (r(), j(ro, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, B2 = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: X(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Ws = /* @__PURE__ */ U(B2, [["__scopeId", "data-v-978e0921"]]), R2 = ["aria-label"], L2 = { class: "head" }, N2 = { class: "names" }, q2 = { class: "body" }, D2 = {
  __name: "SidePanel",
  props: {
    title: { type: String, default: "" },
    abstract: { type: String, default: "" },
    width: { type: String, default: "normal" },
    open: { type: Boolean, default: null },
    depth: { type: Number, default: 0 },
    over: { type: Boolean, default: !1 },
    closeLabel: { type: String, default: "Close the panel" },
    footBelow: { type: Boolean, default: !1 }
  },
  emits: ["close", "dismiss"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Pi(a, n), i = ji(s);
    return (u, c) => (r(), j(In, { to: "body" }, [
      A(an, {
        name: "side",
        appear: "",
        onAfterLeave: O(l)
      }, {
        default: L(() => [
          O(s) ? (r(), d("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: pe({ "--depth": e.depth, zIndex: O(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = he((...f) => O(o) && O(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(B, { key: 0 }, [
                h("header", L2, [
                  h("div", N2, [
                    h("h2", null, v(e.title), 1),
                    e.abstract ? (r(), j(ut, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    ne(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ne(u.$slots, "actions", {}, void 0, !0),
                  A(Ia, {
                    title: e.closeLabel,
                    onClick: O(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), j(Ws, { key: 0 }, {
                  default: L(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                h("div", q2, [
                  ne(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), j(Ws, {
                  key: 1,
                  class: "below"
                }, {
                  default: L(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : ne(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, R2)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, LA = /* @__PURE__ */ U(D2, [["__scopeId", "data-v-d0a677ef"]]), P2 = {
  key: 1,
  class: "text-field-label"
}, j2 = {
  key: 2,
  class: "text-field-end"
}, F2 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ mt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Dt(e, "modelValue"), a = Ca(), s = "onUpdate:modelValue" in (((f = Yu()) == null ? void 0 : f.vnode.props) || {}), o = M(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = M(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = M(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = E(null);
    return t({ focus: () => c.value && c.value.focus() }), (m, p) => e.label || e.icon || m.$slots.end ? (r(), d("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: m.$slots.end }, O(a).class]),
      style: pe(O(a).style)
    }, [
      e.icon ? (r(), j(se, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", P2, v(e.label), 1)) : k("", !0),
      ge(h("input", Ne({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [O(Ts), o.value]
      ]),
      m.$slots.end ? (r(), d("span", j2, [
        ne(m.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : ge((r(), d("input", Ne({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [O(Ts), o.value]
    ]);
  }
}), W2 = /* @__PURE__ */ U(F2, [["__scopeId", "data-v-d9c38ca8"]]), H2 = {
  class: "page-header",
  "data-page-header": ""
}, z2 = { class: "page-title" }, U2 = {
  key: 0,
  class: "page-count",
  "data-page-count": ""
}, V2 = { class: "page-header-end" }, G2 = {
  __name: "PageHeader",
  props: { title: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("header", H2, [
      h("h1", z2, [
        H(v(e.title), 1),
        e.count !== null ? (r(), d("span", U2, v(e.count), 1)) : k("", !0)
      ]),
      h("span", V2, [
        ne(t.$slots, "primary", {}, void 0, !0),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, K2 = /* @__PURE__ */ U(G2, [["__scopeId", "data-v-923fbadc"]]);
function Nr(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
function NA(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const qA = () => ({}), ba = (e) => Object.fromEntries(e.filter((t) => {
  var n;
  return (n = t.default) == null ? void 0 : n.length;
}).map((t) => [t.key, { not: !1, values: [...t.default] }])), qr = (e, t) => {
  const n = (t == null ? void 0 : t.values) ?? [], a = e.default ?? [];
  return !(t != null && t.not) && n.length === a.length && a.every((s) => n.includes(s));
}, Dr = (e) => !!(e != null && e.values.length), DA = (e, t, n = (a) => a) => [...new Set(e.flatMap((a) => [].concat(t(a))).filter((a) => a != null && a !== ""))].map((a) => [a, n(a)]), Y2 = (e, t, n) => t.filter((a) => [].concat(e.get(a)).includes(n)).length;
function Pr(e, t, n, a = "", s = []) {
  return e.filter((o) => t.every((l) => Q2(o, l, n[l.key])) && (!a.trim() || Nr(o, a, s)));
}
function Q2(e, t, n) {
  if (!Dr(n)) return !0;
  const a = [].concat(t.get(e)), s = n.values.some((o) => a.includes(o));
  return n.not ? !s : s;
}
const X2 = { class: "filter-ways" }, J2 = { class: "filter-count" }, Z2 = {
  __name: "FilterChoices",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = [
      { key: "is", label: "is" },
      { key: "not", label: "is not" }
    ], o = () => n.modelValue ?? { not: !1, values: [] }, l = (c) => a("update:modelValue", c.values.length ? c : null), i = (c) => l({ ...o(), not: c === "not" }), u = (c) => l({ ...o(), values: o().values.includes(c) ? o().values.filter((f) => f !== c) : [...o().values, c] });
    return (c, f) => (r(), d(B, null, [
      h("div", X2, [
        A(Mt, {
          options: s,
          value: o().not ? "not" : "is",
          onPick: i
        }, null, 8, ["value"])
      ]),
      (r(!0), d(B, null, Z(e.field.options, ([m, p]) => (r(), j(We, {
        key: m,
        checked: o().values.includes(m),
        "data-filter-option": m,
        onClick: (b) => u(m)
      }, {
        default: L(() => [
          H(v(p) + " ", 1),
          h("span", J2, v(O(Y2)(e.field, e.rows, m)), 1)
        ]),
        _: 2
      }, 1032, ["checked", "data-filter-option", "onClick"]))), 128))
    ], 64));
  }
}, jr = /* @__PURE__ */ U(Z2, [["__scopeId", "data-v-4e84eb6e"]]), e$ = ["data-filter-chip"], t$ = ["aria-expanded"], n$ = {
  key: 0,
  "data-filter-value": ""
}, a$ = ["aria-label"], s$ = {
  __name: "FilterChip",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = M(() => Dr(n.modelValue)), l = M(() => !qr(n.field, n.modelValue)), i = M(() => n.modelValue.values.map((f) => {
      var m;
      return ((m = n.field.options.find(([p]) => p === f)) == null ? void 0 : m[1]) ?? f;
    }).join(", ")), u = () => {
      var f;
      return a("update:modelValue", (f = n.field.default) != null && f.length ? { not: !1, values: [...n.field.default] } : null);
    }, c = (f) => s.value = s.value ? null : f.currentTarget;
    return (f, m) => (r(), d("span", {
      class: X(["filter-chip", { on: o.value }]),
      "data-filter-chip": e.field.key
    }, [
      h("button", {
        type: "button",
        class: "filter-chip-main",
        "aria-haspopup": "menu",
        "aria-expanded": !!s.value,
        onClick: c
      }, [
        h("span", null, v(e.field.label), 1),
        o.value ? (r(), d("b", n$, v(e.modelValue.not ? "is not " : ": ") + v(i.value), 1)) : k("", !0),
        A(se, {
          name: "caret",
          size: 10
        })
      ], 8, t$),
      o.value && l.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "filter-chip-clear",
        "data-filter-clear": "",
        "aria-label": `Clear ${e.field.label}`,
        onClick: u
      }, [
        A(se, {
          name: "close",
          size: 9
        })
      ], 8, a$)) : k("", !0),
      s.value ? (r(), j(Wt, {
        key: 1,
        anchor: s.value,
        align: "start",
        "min-width": 240,
        "max-width": 320,
        onClick: m[1] || (m[1] = he(() => {
        }, ["stop"])),
        onClose: m[2] || (m[2] = (p) => s.value = null)
      }, {
        default: L(() => [
          A(jr, {
            field: e.field,
            rows: e.rows,
            "model-value": e.modelValue,
            "onUpdate:modelValue": m[0] || (m[0] = (p) => a("update:modelValue", p))
          }, null, 8, ["field", "rows", "model-value"])
        ]),
        _: 1
      }, 8, ["anchor"])) : k("", !0)
    ], 10, e$));
  }
}, o$ = /* @__PURE__ */ U(s$, [["__scopeId", "data-v-0cc7efe6"]]), l$ = {
  class: "search-bar",
  "data-search-bar": ""
}, i$ = { class: "search-bar-control" }, r$ = ["value", "placeholder", "aria-label"], u$ = ["aria-expanded"], c$ = {
  key: 0,
  "data-menu-count": ""
}, d$ = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = Qu(), l = ((x = $e(Be, null)) == null ? void 0 : x.search) ?? {}, i = M(() => l.placeholder || a.placeholder), u = l.context ?? [], c = E(null), f = E(null), m = E([]), p = M(() => m.value.length ? m.value[m.value.length - 1].next : u), b = M(() => !!o.menu || u.length > 0), $ = (C) => {
      m.value = [], f.value = f.value ? null : C.currentTarget;
    };
    function y(C) {
      if (C.next.length) {
        m.value = [...m.value, C];
        return;
      }
      f.value = null, s("pick", C.click);
    }
    function w() {
      var C;
      s("update:modelValue", ""), (C = c.value) == null || C.focus();
    }
    return t({ focus: () => {
      var C;
      return (C = c.value) == null ? void 0 : C.focus();
    } }), (C, q) => {
      var P;
      return r(), d("div", l$, [
        h("div", i$, [
          A(se, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          h("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: q[0] || (q[0] = (I) => s("update:modelValue", I.target.value)),
            onKeydown: ze(w, ["esc"])
          }, null, 40, r$),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: w
          }, [
            A(se, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          b.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: $
          }, [
            e.menuCount ? (r(), d("span", c$, v(e.menuCount), 1)) : k("", !0),
            A(se, {
              name: "caret",
              size: 12
            })
          ], 8, u$)) : k("", !0)
        ]),
        (P = O(l).button) != null && P.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: q[1] || (q[1] = (I) => s("pick", O(l).button.click))
        }, v(O(l).button.title), 1)) : k("", !0),
        ne(C.$slots, "default", {}, void 0, !0),
        f.value ? (r(), j(Wt, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: q[3] || (q[3] = he(() => {
          }, ["stop"])),
          onClose: q[4] || (q[4] = (I) => f.value = null)
        }, {
          default: L(() => [
            m.value.length ? (r(), j(We, {
              key: 0,
              "data-search-back": "",
              onClick: q[2] || (q[2] = (I) => m.value = m.value.slice(0, -1))
            }, {
              default: L(() => [
                H("‹ " + v(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(B, null, Z(p.value, (I) => (r(), j(We, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (Q) => y(I)
            }, {
              default: L(() => [
                H(v(I.title) + v(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? k("", !0) : ne(C.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Fr = /* @__PURE__ */ U(d$, [["__scopeId", "data-v-45374bed"]]), f$ = ["aria-expanded"], m$ = {
  key: 0,
  class: "filter-count",
  "data-filter-count": ""
}, h$ = 72, p$ = {
  __name: "FilterBar",
  props: {
    fields: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    modelValue: { type: Object, required: !0 },
    words: { type: String, default: "" },
    shown: { type: Number, default: null },
    placeholder: { type: String, default: "Search" }
  },
  emits: ["update:modelValue", "update:words"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(null), l = E([]), i = M(() => n.fields.filter((b) => l.value.includes(b.key))), u = M(() => n.fields.some((b) => !qr(b, n.modelValue[b.key])) || !!n.words.trim()), c = (b, $) => a("update:modelValue", { ...n.modelValue, [b]: $ }), f = () => {
      a("update:modelValue", ba(n.fields)), a("update:words", "");
    };
    async function m() {
      if (!s.value) return;
      l.value = [], await Re();
      const b = s.value.clientWidth;
      b && (l.value = [...s.value.querySelectorAll("[data-filter-chip]")].filter(($) => $.offsetLeft + $.offsetWidth > b - h$).map(($) => $.dataset.filterChip));
    }
    let p = null;
    return _e(() => {
      m(), p = new ResizeObserver(m), p.observe(s.value);
    }), Te(() => p == null ? void 0 : p.disconnect()), ce(() => [n.fields.length, n.modelValue], () => m(), { flush: "post" }), (b, $) => (r(), j(Fr, {
      "model-value": e.words,
      class: "filter-bar",
      placeholder: e.placeholder,
      "data-filter-bar": "",
      "onUpdate:modelValue": $[3] || ($[3] = (y) => a("update:words", y))
    }, {
      default: L(() => [
        h("div", {
          ref_key: "chips",
          ref: s,
          class: "filter-chips"
        }, [
          (r(!0), d(B, null, Z(e.fields, (y) => ge((r(), j(o$, {
            key: y.key,
            field: y,
            rows: e.rows,
            "model-value": e.modelValue[y.key] ?? null,
            "onUpdate:modelValue": (w) => c(y.key, w)
          }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])), [
            [ao, !l.value.includes(y.key)]
          ])), 128))
        ], 512),
        i.value.length ? (r(), d(B, { key: 0 }, [
          h("button", {
            type: "button",
            class: "filter-more",
            "data-filter-more": "",
            "aria-haspopup": "menu",
            "aria-expanded": !!o.value,
            onClick: $[0] || ($[0] = (y) => o.value = o.value ? null : y.currentTarget)
          }, "More", 8, f$),
          o.value ? (r(), j(Wt, {
            key: 0,
            anchor: o.value,
            align: "end",
            "min-width": 240,
            "max-width": 320,
            onClick: $[1] || ($[1] = he(() => {
            }, ["stop"])),
            onClose: $[2] || ($[2] = (y) => o.value = null)
          }, {
            default: L(() => [
              (r(!0), d(B, null, Z(i.value, (y) => (r(), d(B, {
                key: y.key
              }, [
                A($t, null, {
                  default: L(() => [
                    H(v(y.label), 1)
                  ]),
                  _: 2
                }, 1024),
                A(jr, {
                  field: y,
                  rows: e.rows,
                  "model-value": e.modelValue[y.key] ?? null,
                  "onUpdate:modelValue": (w) => c(y.key, w)
                }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])
              ], 64))), 128))
            ]),
            _: 1
          }, 8, ["anchor"])) : k("", !0)
        ], 64)) : k("", !0),
        u.value ? (r(), d(B, { key: 1 }, [
          e.shown !== null ? (r(), d("span", m$, v(e.shown) + " of " + v(e.rows.length), 1)) : k("", !0),
          h("button", {
            type: "button",
            class: "filter-clear",
            "data-filter-clear-all": "",
            onClick: f
          }, "Clear")
        ], 64)) : k("", !0)
      ]),
      _: 1
    }, 8, ["model-value", "placeholder"]));
  }
}, Wr = /* @__PURE__ */ U(p$, [["__scopeId", "data-v-c20a74ef"]]), v$ = { class: "title" }, g$ = { class: "state" }, y$ = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ms(t.line, t.events);
    return (o, l) => (r(), j(Mk, {
      rows: O(n),
      failure: O(a),
      loaded: O(s),
      empty: e.empty
    }, {
      default: L(({ row: i }) => [
        h("span", v$, v(i.title), 1),
        h("span", g$, v(O(Jt)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, PA = /* @__PURE__ */ U(y$, [["__scopeId", "data-v-6be0c59e"]]);
function b$(e = 1e3, t = null) {
  const n = E(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ce(t, s, { immediate: !0 }) : s(!0), Te(() => clearInterval(a)), n;
}
const os = E(Date.now() / 1e3);
let Ol = 0, Jn = 0;
function Ao() {
  return Jn || (os.value = Date.now() / 1e3, Ol = setInterval(() => os.value = Date.now() / 1e3, 1e3)), Jn += 1, ui() && Aa(() => {
    Jn -= 1, Jn || clearInterval(Ol);
  }), os;
}
const k$ = 200, w$ = Tr + la + Ir + k$, $$ = 300, Zn = /* @__PURE__ */ new WeakMap();
function x$(e, t) {
  const n = Zn.get(e) ?? [];
  Zn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Zn.get(e);
    Zn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, $$);
}
function dn(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function S$(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: dn(e),
    top: dn(e.querySelector(".top")),
    title: dn(e.querySelector(".title")),
    contents: dn(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: dn(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function M$(e, t, n, a) {
  ce(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(S$(o, l, n.value)), performance.now() - l < w$) return void requestAnimationFrame(u);
        x$(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const _$ = ["title", "data-figure-mark", "data-folded", "data-open"], C$ = {
  key: 2,
  class: "worker"
}, E$ = { class: "head" }, A$ = { key: 0 }, O$ = {
  key: 3,
  class: "status"
}, T$ = {
  key: 0,
  class: "figure"
}, I$ = {
  key: 1,
  class: "ran-for"
}, B$ = { key: 2 }, R$ = {
  key: 3,
  class: "news"
}, L$ = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, N$ = {
  key: 6,
  class: "settled"
}, q$ = {
  key: 1,
  class: "bar"
}, D$ = {
  key: 3,
  class: "detail body"
}, P$ = {
  key: 0,
  class: "body-label"
}, j$ = ["title"], F$ = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Ca(), a = ["onClick", "onAct"], s = M(() => Object.fromEntries(Object.entries(n).filter(([le]) => !a.includes(le)))), o = E(!1), l = M(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = M(() => t.open !== void 0), u = M(() => i.value || l.value), c = M(() => i.value ? t.open : o.value), f = M(() => i.value ? !t.open : l.value && !o.value), m = M(() => !!(t.mark.action && n.onAct)), p = M(() => u.value || m.value || !!n.onClick), b = E(null), $ = E(null), { folded: y, phase: w } = Br(b, () => f.value);
    M$(b, f, w, $e(Be, null));
    function x(le) {
      var ke, xe;
      if (!(le.target !== b.value && !$.value.contains(le.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, le);
        if (l.value) return void (o.value = !o.value);
        (xe = n.onAct || n.onClick) == null || xe(le);
      }
    }
    const C = (le) => n.onAct(le), q = ["failed", "unfinished"], P = M(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? q.includes(t.mark.state) ? "danger" : "good" : ""), I = M(() => t.mark.color ? t.mark.color : P.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : P.value ? `var(--tone-${P.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), Q = M(() => I.value || "var(--tone-work)"), W = M(() => !t.mark.ending && !t.mark.ended && P.value !== "stopped"), R = Ao(), D = M(
      () => t.mark.began_at && W.value && !t.mark.figure && !t.mark.counting ? hr(R.value - t.mark.began_at) : ""
    ), G = M(() => {
      const { started: le, ended: ke } = t.mark;
      return le ? ke ? `ran ${en(ke - le, !0)}` : en(R.value - le, !0) : D.value;
    }), _ = ["bad", "danger", "warn"], g = M(() => _.includes(P.value) || t.mark.asks ? "attention" : W.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], T = M(() => S.includes(P.value)), N = M(() => g.value === "process" ? "running" : T.value ? "cross" : P.value === "stopped" ? "stopped" : P.value === "good" ? "tick" : ""), V = M(
      () => !!(t.mark.figure || G.value || t.mark.docked || t.mark.stopping || N.value || t.mark.settled || t.mark.news)
    ), J = M(() => t.mark.markIcon ? { component: Ct, props: { class: "ico", name: t.mark.markIcon } } : { component: se, props: { name: t.mark.icon || "dot" } }), ee = M(() => [t.mark.title, t.mark.time ? mr(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = M(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ke) => (r(), d("div", Ne(s.value, {
      ref_key: "root",
      ref: b,
      class: [
        "mark",
        `w-${g.value}`,
        O(w),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: I.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: oe.value,
      title: ee.value,
      "data-figure-mark": e.mark.key,
      "data-folded": O(y) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (r(), j(Je(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: $,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: L(() => [
          e.mark.agentId ? (r(), j(xn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: L(() => [
              (r(), j(Je(J.value.component), bt(ci(J.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), j(Je(J.value.component), bt(Ne({ key: 1 }, J.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", C$, v(e.mark.worker), 1)) : k("", !0),
          h("span", E$, [
            A(ut, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", A$, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), j(rn, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          V.value ? (r(), d("span", O$, [
            e.mark.figure ? (r(), d("span", T$, v(e.mark.figure), 1)) : k("", !0),
            G.value ? (r(), d("span", I$, v(G.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", B$, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", R$, v(e.mark.news), 1)) : k("", !0),
            N.value === "running" ? (r(), d("span", L$)) : N.value ? (r(), j(Ct, {
              key: 5,
              class: X(["sign", N.value]),
              name: N.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", N$, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), j(Or, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: he(C, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && W.value ? (r(), d("span", q$, [
        h("span", {
          class: "progress",
          style: pe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: Q.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !O(y) ? (r(), j(ut, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !O(y) ? (r(), d("div", D$, [
        e.mark.bodyLabel ? (r(), d("p", P$, v(e.mark.bodyLabel), 1)) : k("", !0),
        A(ut, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !O(y) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, j$)) : k("", !0),
      e.mark.card ? (r(), j(ut, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      ne(le.$slots, "default", {
        shown: !O(y)
      }, void 0, !0)
    ], 16, _$));
  }
}), Hr = /* @__PURE__ */ U(F$, [["__scopeId", "data-v-6e839007"]]), W$ = 8, H$ = 40, z$ = [];
class Oo {
  constructor(t, n, { top: a = W$, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && z$.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Oo(t, {
      loaded: () => n.loaded.value,
      count: () => n.rows.value.length,
      pageSize: n.pageSize,
      more: () => n.more.value,
      previous: n.older
    }, a);
  }
  breach(t) {
    const n = `feed ${this.name}: ${t}`;
    if (this.breaches.push(n), this.development) throw new Error(n);
    return !1;
  }
  isLoaded() {
    return this.source.loaded();
  }
  // the first rows of the feed are on screen, and the pane has been taken to its bottom
  drawn(t) {
    if (this.shown || !this.source.loaded() || !this.source.count()) return;
    this.shown = !0;
    const n = t.scrollHeight - t.scrollTop - t.clientHeight;
    n > H$ && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
  }
  // the reader scrolled: at the top of the pane the page before the oldest one is read
  async reachTop(t) {
    return t.scrollTop < this.top ? this.scrollUp(t) : !1;
  }
  // one earlier page is read, and a pane stays on the row it showed. Without a pane the reader asked for it by a button.
  async scrollUp(t = null) {
    if (this.loading || !this.source.more()) return !1;
    if (!this.source.loaded()) return this.breach("an earlier page was read before the newest page");
    if (t && t.scrollTop >= this.top) return this.breach(`an earlier page was read ${t.scrollTop}px below the top`);
    this.loading = !0;
    const n = this.source.count(), a = (t == null ? void 0 : t.scrollHeight) ?? 0;
    let s = !1;
    try {
      s = await this.source.previous();
    } finally {
      this.loading = !1;
    }
    const o = this.source.count() - n;
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await Re(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await Re();
  }
}
const U$ = 60, V$ = 300, zr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Ur(e, t) {
  const n = E([]), a = E(0);
  let s = -1, o = 0;
  async function l() {
    const m = await e(["output", "page", String(t())]);
    return m.ok && (n.value = m.value.lines, a.value = m.value.first_byte, s = m.value.last_byte, o = m.value.cut_bytes), m;
  }
  async function i() {
    if (s < 0) return l();
    const m = await e(["output", "page", String(t()), "--after", String(s)]);
    return m.ok ? m.value.cut_bytes !== o || m.value.total < s ? l() : (m.value.lines.length && (n.value = [...n.value, ...m.value.lines]), s = m.value.last_byte, m) : m;
  }
  async function u() {
    const m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return m.ok ? (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, !0) : !1;
  }
  const c = new Oo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => V$, more: () => a.value > 0, previous: u }, { top: U$ });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const G$ = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Vr(e) {
  var n;
  const t = G$[e] || ((n = on(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const K$ = (e) => Vr(String(e).split(":")[0]), Y$ = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Q$ = "agents", X$ = { passed: "good", failed: "danger", warned: "warn", running: "" }, J$ = { good: "good", warn: "warn", danger: "danger" }, Tl = {
  "open row": (e) => Pe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Qm(e.target_model, e.target_id || 0)
}, Z$ = { "open row": (e) => K$(e.target_model), "open page": () => Vr("pages") };
function e5(e, t) {
  const n = t || {}, a = Tl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? X$[e.outcome] || "" : J$[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === Q$ ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Z$[a](e) : "",
    handlers: a ? { onAct: () => Tl[a](e) } : {}
  };
}
const t5 = 24, n5 = 1e3, Il = 2e3, a5 = 0.25, s5 = 5e3;
function o5(e, t = t5, n = () => !0) {
  const a = E(!1), s = E(0), o = E(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const P = c();
    return P ? P.scrollHeight - P.scrollTop - P.clientHeight : 0;
  }, m = () => !c() || f() <= t;
  function p(P) {
    if (clearTimeout(l), !P) {
      o.value = !1, u = Date.now();
      return;
    }
    const I = Date.now() - u < Il ? Il : n5;
    l = setTimeout(() => o.value = a.value, I);
  }
  function b() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function $(P = !1) {
    const I = c();
    I && P && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), b();
  }
  function y() {
    x(), !a.value && (a.value = !0, p(!0));
  }
  const w = () => !!c() && f() <= c().clientHeight * a5;
  function x() {
    clearTimeout(i), w() && (i = setTimeout(() => a.value && w() && n() && $(!0), s5));
  }
  function C() {
    m() ? b() : y();
  }
  function q(P = 1, I = !1) {
    a.value ? s.value += Math.max(0, P) : $(I);
  }
  return ui() && Aa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: b, toBottom: $, left: y, scrolled: C, arrived: q };
}
const l5 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, i5 = (e) => String(e ?? "").replace(l5, ""), r5 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), { away: o, scrolled: l, arrived: i, toBottom: u } = o5(s);
    ce(
      () => [n.lines, n.lines.length],
      () => Re(() => {
        var f;
        i(), s.value && ((f = n.feed) == null || f.drawn(s.value));
      }),
      { immediate: !0 }
    );
    function c(f) {
      l(), a("older", f.target);
    }
    return (f, m) => (r(), d("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      H(v(O(i5)(e.lines.join(`
`)) || e.empty), 1),
      O(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (p) => O(u)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, u5 = /* @__PURE__ */ U(r5, [["__scopeId", "data-v-89621acd"]]), c5 = "*.*", d5 = {
  __name: "ModuleBody",
  props: {
    declaration: { type: Object, required: !0 },
    row: { type: Object, default: null },
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean,
    collapsed: Boolean,
    environment: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = $e(Be, null), a = new wi();
    ce(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const m = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (b) => a.dispatch(b));
        f(() => m == null ? void 0 : m());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = M(() => !!(t.declaration.shipped || t.declaration.trusted)), i = M(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [c5] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), j(_r, {
      key: 0,
      entry: i.value,
      subscriptions: O(a),
      environment: O(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), j(Mr, {
      key: 1,
      entry: i.value,
      subscriptions: O(a),
      environment: O(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, f5 = { class: "mark-more-inner" }, m5 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, h5 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, p5 = {
  key: 3,
  class: "mark-lines"
}, v5 = "process", Bl = "task", g5 = {
  __name: "MarkBody",
  props: {
    declaration: { type: Object, required: !0 },
    mark: { type: Object, required: !0 },
    shown: Boolean,
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean,
    collapsed: Boolean
  },
  setup(e) {
    const t = e, n = at(), a = M(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = M(() => Y$.has(t.mark.variant) && t.mark.detail || ""), o = M(() => t.mark.target_model === Bl ? t.mark.target_id : 0), l = Ur(
      zr(n),
      () => t.mark.target_id
    ), i = l.lines, u = E(!1), c = E(""), f = M(() => !t.declaration.body_url && t.mark.target_model === v5 && !!t.mark.target_id);
    async function m(b = l.follow) {
      const $ = await b();
      u.value = !0, c.value = $.ok ? "" : $.error;
    }
    const p = M(() => t.shown && f.value);
    return ce(p, (b) => b && m()), oo(() => p.value && m(), () => p.value && !t.mark.ended_at), ce(
      () => t.mark.ended_at,
      (b) => b && p.value && m(l.newest)
    ), (b, $) => (r(), d("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: $[1] || ($[1] = he(() => {
      }, ["stop"]))
    }, [
      h("div", f5, [
        e.declaration.body_url ? (r(), j(d5, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(B, { key: 1 }, [
          s.value ? (r(), d(B, { key: 0 }, [
            $[2] || ($[2] = h("p", { class: "mark-label" }, "Why it stopped", -1)),
            h("p", m5, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", h5, v(c.value), 1)) : f.value && u.value ? (r(), d(B, { key: 2 }, [
            $[3] || ($[3] = h("p", { class: "mark-label" }, "Output", -1)),
            A(u5, {
              class: "mark-terminal",
              lines: O(i),
              feed: O(l).feed,
              onOlder: O(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", p5, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: $[0] || ($[0] = he((y) => O(Pe)(`${Bl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Hs = /* @__PURE__ */ U(g5, [["__scopeId", "data-v-df71b15a"]]), y5 = ["title", "aria-label", "onClick"], b5 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, k5 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = M(() => $m(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = E(""), s = $e(Be);
    async function o(l) {
      const i = await Rn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(B, null, [
      (r(!0), d(B, null, Z(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: he((c) => o(u), ["stop"])
      }, [
        A(Ct, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, y5))), 128)),
      a.value ? (r(), d("span", b5, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, w5 = /* @__PURE__ */ U(k5, [["__scopeId", "data-v-7a62c88e"]]);
function Gr(e, t) {
  const n = lt(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ee.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Kr = Gr("/api/marks", "marks"), jA = Kr.fetchAll, $5 = Kr.find, x5 = ["data-ref"], S5 = ["data-ref"], M5 = { class: "mark-row" }, _5 = "dock add", C5 = "questions.answer", E5 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = M(() => $5(a.mark.type)), o = M(() => e5(a.mark, s.value)), l = M(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = M(() => l.value || !!o.value.handlers.onAct), u = M(() => a.mark.type === C5), c = E(!1);
    function f() {
      c.value = !c.value;
    }
    const m = M(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((b) => {
        var $;
        return !a.docked || !(($ = b.runs) != null && $.startsWith(_5));
      }).map((b) => ({ ...b, module: s.value.module }));
    });
    return (p, b) => {
      var $, y;
      return ($ = s.value) != null && $.card ? (r(), d("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": O(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Hs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, x5)) : (r(), d("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (y = s.value) == null ? void 0 : y.full_width, docked: e.docked, "user-side": O(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", M5, [
          A(Hr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Ea({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: L(({ shown: w }) => [
                A(Hs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: w
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(w5, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, S5));
    };
  }
}, A5 = /* @__PURE__ */ U(E5, [["__scopeId", "data-v-424ddb61"]]), O5 = ["data-ref"], T5 = ["inert"], I5 = { class: "group-fold" }, B5 = { class: "thread-group" }, R5 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = E(!1), a = E(!1), s = E(!1), o = E(null);
    ce(n, async (i) => {
      var u;
      a.value = !0, await Re(), (u = o.value) == null || u.offsetHeight, s.value = i;
    });
    const l = M(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (i, u) => (r(), d("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      A(Hr, {
        mark: l.value,
        open: n.value,
        onClick: u[0] || (u[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (r(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: X(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        h("div", I5, [
          h("div", B5, [
            (r(!0), d(B, null, Z(e.group.marks, (c) => (r(), j(A5, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, T5)) : k("", !0)
    ], 8, O5));
  }
}, FA = /* @__PURE__ */ U(R5, [["__scopeId", "data-v-45b58b9b"]]);
function L5(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), tt(() => n.disconnect()), t;
}
const N5 = { class: "chat-dock-fold" }, q5 = ["aria-label"], D5 = { class: "chat-dock-head" }, P5 = { class: "chat-dock-inner" }, j5 = { class: "chat-dock-foot" }, Yr = 700, F5 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = E(null), a = E(null), s = L5(a), o = E(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, Yr)), tt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", N5, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ne(i.$slots, "edge", {}, void 0, !0),
          h("header", D5, [
            ne(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", P5, [
              h("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
                style: pe(O(s) === null ? null : { height: `${O(s)}px` })
              }, [
                h("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ne(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ne(i.$slots, "still", {}, void 0, !0),
          h("footer", j5, [
            ne(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, q5)
      ])
    ], 2));
  }
}, W5 = /* @__PURE__ */ U(F5, [["__scopeId", "data-v-cc05fdac"]]), H5 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ls = 5, z5 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ls, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ls}s`, animationDelay: `${(n - ls).toFixed(2)}s` };
    return (s, o) => (r(), d("span", H5, [
      h("i", { style: a })
    ]));
  }
}, U5 = /* @__PURE__ */ U(z5, [["__scopeId", "data-v-2a7bc150"]]), Qr = Gr("/api/docks", "docks"), WA = Qr.fetchAll, Gt = Qr.find, V5 = 6, is = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, To = (e) => Date.parse(e.leaves_at) / 1e3, mn = (e) => !!(e.leaves_at && !e.kept), G5 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!mn(e) || t < To(e) || n.has(e.id)), K5 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => G5(a, t, n)).sort((a, s) => a.id - s.id);
function Y5(e, t, n = V5) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(To(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Q5 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), zs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), X5 = (e, t) => !(t != null && t.person_required) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), J5 = (e) => ({ ...e.kept ? zs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : zs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Z5 = ["keep", "unkeep", "open", "undock"], e4 = (e) => ({ ...e, iconOnly: Z5.includes(e.action) });
function t4(e, t) {
  var n;
  return [
    ...X5(e, t) ? [J5(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || on(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    zs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(e4);
}
function Xr(e, t) {
  const n = t4(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: Q5(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const n4 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || Xr(e, t).title, a4 = { class: "dock-text" }, s4 = ["title"], o4 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, l4 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, i4 = {
  key: 1,
  "data-dock-row": ""
}, r4 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = M(() => Gt(a.item.type)), o = Ao(), l = M(() => ln(a.item.created_at, o.value * 1e3)), i = E(null), u = E(null), c = E(null), f = E(null), m = M(() => Xr(a.item, s.value)), p = at(), b = M(() => `dock.${a.item.id}`), $ = M(() => p.props[b.value].data.value), y = M(() => n4(a.item, s.value, $.value)), w = M(() => va(a.item.target_model ?? "")), x = M(() => {
      var g;
      return ((g = s.value) == null ? void 0 : g.word) ?? "";
    }), C = M(() => ({ ...$.value, id: a.item.target_id, term: w.value })), q = () => {
      var g, S;
      return ((S = (g = s.value) == null ? void 0 : g.reads) == null ? void 0 : S.length) && p.reload(b.value);
    };
    yd(to, { data: $, reload: q, readOutput: zr(p) }), ce(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (g, S, T) => {
        var V;
        q();
        const N = (V = p.followUndeclared) == null ? void 0 : V.call(p, [`${w.value.replaceAll("-", "_")}.*`], (J) => {
          (!J.row_id || J.row_id === a.item.target_id) && q();
        });
        T(() => N == null ? void 0 : N());
      },
      { immediate: !0 }
    );
    const P = E(/* @__PURE__ */ new Set()), I = E("");
    async function Q(g) {
      if (g.action === "undock") return n("undock", g);
      if (g.action === "open") return Pe(`${a.item.target_model}:${a.item.target_id}`);
      g.action === "declared" && (P.value = /* @__PURE__ */ new Set([...P.value, g.label])), I.value = "";
      const T = await Rn(g, { id: a.item.target_id }, p.environment);
      (T == null ? void 0 : T.ok) === !1 && (P.value = new Set([...P.value].filter((N) => N !== g.label)), I.value = `Could not ${g.label.toLowerCase()}: ${T.error}`);
    }
    const W = M(() => m.value.actions.filter((g) => !P.value.has(g.label))), R = M(() => {
      var g;
      return Yy((g = s.value) == null ? void 0 : g.badge, C.value);
    }), D = M(() => m.value.controls), G = M(() => {
      var g;
      return !((g = s.value) != null && g.folds && a.folded);
    }), _ = M(() => {
      var g;
      return !!((g = s.value) != null && g.draws_head) && !a.collapsed;
    });
    return (g, S) => {
      var T, N, V, J;
      return r(), j(W5, {
        label: m.value.title + ((T = s.value) != null && T.person_required ? ", waiting for you" : ""),
        type: (N = s.value) != null && N.person_required ? "waiting" : "",
        folded: !!((V = s.value) != null && V.folds) && e.folded,
        body: !!((J = s.value) != null && J.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: S[4] || (S[4] = (ee) => e.collapsed && n("open"))
      }, {
        edge: L(() => [
          e.leaving && !e.item.kept ? (r(), j(U5, {
            key: 0,
            "ends-at": O(To)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: L(() => {
          var ee;
          return [
            _.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(B, { key: 1 }, [
              A(se, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", a4, [
                h("span", {
                  class: X(["dock-title", { strip: e.collapsed }]),
                  title: y.value
                }, v(y.value), 11, s4)
              ])
            ], 64)),
            h("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (ee = s.value) != null && ee.leaves_after_seconds ? k("", !0) : (r(), d(B, { key: 0 }, [
                H(v(l.value), 1)
              ], 64))
            ], 512),
            D.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: S[0] || (S[0] = he(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(B, null, Z(D.value, (oe) => {
                var le, ke;
                return r(), d(B, {
                  key: oe.action + oe.runs
                }, [
                  !P.value.has(oe.label) && (!((le = oe.variants) != null && le.length) || !((ke = C.value) != null && ke.state) || oe.variants.includes(C.value.state)) ? (r(), j(ie, {
                    key: 0,
                    variant: "icon",
                    class: X({ kept: oe.pressed }),
                    "aria-pressed": oe.pressed,
                    "aria-label": oe.label,
                    title: oe.label,
                    "data-dock-action": oe.action,
                    onClick: (xe) => Q(oe)
                  }, {
                    default: L(() => [
                      A(se, {
                        name: oe.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : k("", !0)
                ], 64);
              }), 128))
            ])) : k("", !0)
          ];
        }),
        still: L(() => [
          I.value || e.refusal ? (r(), d("p", o4, v(I.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: L(() => {
          var ee;
          return [
            h("span", l4, [
              R.value ? (r(), d("span", {
                key: 0,
                class: X(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(R.value), 3)) : k("", !0),
              x.value ? (r(), d("span", i4, v(x.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              h("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (ee = s.value) != null && ee.folds ? (r(), j(ie, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: S[1] || (S[1] = (oe) => n("fold"))
            }, {
              default: L(() => [
                H(v(s.value.folds) + " ", 1),
                A(rn, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            h("span", {
              class: "dock-acts",
              onClick: S[3] || (S[3] = he(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              G.value ? (r(), d(B, { key: 0 }, [
                A(go, {
                  name: `dock.${e.item.type}`,
                  row: C.value,
                  environment: O(p).environment,
                  "read-only": O(p).readOnly,
                  "object-name": O(va)(e.item.target_model),
                  "external-failure": "",
                  onFailure: S[2] || (S[2] = (oe) => I.value = oe),
                  onDone: g.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(B, null, Z(W.value, (oe) => (r(), j(ie, {
                  key: oe.action + oe.runs,
                  small: "",
                  variant: oe.primary ? "primary" : "ghost",
                  bordered: !oe.primary,
                  "data-dock-action": oe.action,
                  onClick: (le) => Q(oe)
                }, {
                  default: L(() => [
                    H(v(oe.label), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ])
          ];
        }),
        default: L(() => {
          var ee;
          return [
            (ee = s.value) != null && ee.body_url ? (r(), j(Hs, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: i.value,
              foot: u.value,
              actions: c.value,
              time: f.value,
              folded: e.folded,
              collapsed: e.collapsed
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : k("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Rl = /* @__PURE__ */ U(r4, [["__scopeId", "data-v-8bfc4ed9"]]), u4 = 24, c4 = 8, HA = 420;
function zA({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= u4 ? !0 : e < t && s > c4 ? !1 : null;
}
const d4 = (e, t) => e === void 0 ? t : e, f4 = { me: 1, people: [] }, ka = nn({
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
  people: f4,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: fa("journal.activity", !0),
  wide: !1,
  sideMini: fa("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Gi("journal.activity", () => ka.activity);
Gi("journal.side.mini", () => ka.sideMini);
const Jr = "journal.viewer.";
function m4(e, t, n) {
  try {
    const a = n.getItem(Jr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function h4(e, t, n) {
  try {
    n.setItem(Jr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Ll(e, t, n = window.localStorage) {
  const a = E(m4(e, t, n));
  return ce(a, (s) => h4(e, s, n), { deep: !0 }), a;
}
const p4 = {
  key: "dock-all",
  class: "dock-all"
}, v4 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var _, g;
    const t = e, n = b$(500), a = E(/* @__PURE__ */ new Set()), s = $e(Be), o = E(/* @__PURE__ */ new Set()), l = E({});
    async function i(S, T) {
      l.value = { ...l.value, [S.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, S.id]);
      const N = await Rn(T, { id: S.target_id }, s.environment);
      (N == null ? void 0 : N.ok) === !1 && (o.value = new Set([...o.value].filter((V) => V !== S.id)), l.value = { ...l.value, [S.id]: `Could not dismiss this card: ${N.error}` });
    }
    const u = M(
      () => K5(
        t.items.filter((S) => !o.value.has(S.id)),
        n.value,
        a.value
      )
    ), c = M(
      () => Y5(
        u.value.filter((S) => is(S, Gt)),
        n.value
      )
    ), f = M(() => u.value.filter((S) => !c.value.includes(S) && !is(S, Gt))), m = Ll(`dock-size:${((_ = ka.identity) == null ? void 0 : _.root) || location.host}`, null), p = (S) => {
      var T;
      return !!((T = Gt(S.type)) != null && T.person_required);
    }, b = E(/* @__PURE__ */ new Set()), $ = E(/* @__PURE__ */ new Set()), y = M(() => u.value.length === 1), w = (S) => p(S) || y.value, x = (S) => w(S) ? b.value.has(S.id) || $.value.has(S.id) : m.value ? m.value.collapsed && !m.value.opened.includes(S.id) : t.collapsed, C = M(() => u.value.some(x));
    ce(() => t.collapsed, (S) => {
      $.value = new Set(S ? u.value.filter(p).map((T) => T.id) : []);
    });
    function q() {
      const S = !C.value;
      m.value = { collapsed: S, opened: [] }, b.value = new Set(S ? u.value.filter(p).map((T) => T.id) : []), $.value = /* @__PURE__ */ new Set();
    }
    function P(S) {
      var N;
      if (!x(S)) return;
      if (w(S)) {
        b.value = new Set([...b.value].filter((V) => V !== S.id)), $.value = new Set([...$.value].filter((V) => V !== S.id));
        return;
      }
      const T = (N = m.value) != null && N.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...T, S.id] };
    }
    const I = Ll(`dock-folded:${((g = ka.identity) == null ? void 0 : g.root) || location.host}`, {}), Q = (S) => {
      var T;
      return !!((T = Gt(S.type)) != null && T.folds) && (t.insidesFolded || d4(I.value[S.id], is(S, Gt) || t.folded));
    };
    function W(S) {
      Q(S) && R(S), I.value = { ...I.value, [S.id]: !Q(S) };
    }
    function R(S) {
      var T;
      !((T = m.value) != null && T.collapsed) || m.value.opened.includes(S.id) || (m.value = { collapsed: !0, opened: [...m.value.opened, S.id] });
    }
    function D(S) {
      a.value = /* @__PURE__ */ new Set([...a.value, S.id]);
    }
    function G(S) {
      a.value = new Set([...a.value].filter((T) => T !== S.id));
    }
    return (S, T) => (r(), j(no, {
      tag: "div",
      name: "dock",
      duration: O(Yr),
      class: "dock-stack"
    }, {
      default: L(() => [
        u.value.length > 1 ? (r(), d("div", p4, [
          A(ie, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": C.value ? "Open all" : "Collapse all",
            onClick: q
          }, {
            default: L(() => [
              A(rn, {
                open: !C.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(B, null, Z(f.value, (N) => (r(), j(Rl, {
          key: N.id,
          item: N,
          class: X({ timed: O(mn)(N) }),
          leaving: O(mn)(N) && !a.value.has(N.id),
          folded: Q(N),
          collapsed: x(N),
          refusal: l.value[N.id],
          onOpen: (V) => P(N),
          onFold: (V) => W(N),
          onUndock: (V) => i(N, V),
          onMouseenter: (V) => D(N),
          onMouseleave: (V) => G(N)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(B, null, Z(c.value, (N) => (r(), j(Rl, {
          key: N.id,
          item: N,
          class: X({ timed: O(mn)(N) }),
          leaving: O(mn)(N) && !a.value.has(N.id),
          folded: Q(N),
          collapsed: x(N),
          refusal: l.value[N.id],
          onOpen: (V) => P(N),
          onFold: (V) => W(N),
          onUndock: (V) => i(N, V),
          onMouseenter: (V) => D(N),
          onMouseleave: (V) => G(N)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, UA = /* @__PURE__ */ U(v4, [["__scopeId", "data-v-0e24b6bb"]]), qt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, ia = (e) => Math.min(Math.max(e, 0), 1), g4 = (e) => {
  const t = ia(e);
  return t * t * (3 - 2 * t);
}, It = (e, t, n) => g4((e - t) / (n - t));
function VA(e) {
  const t = ia(e), n = ia((t - 0.12) / 0.76) * qt.shuffles, a = Math.min(Math.floor(n), qt.shuffles - 1), s = n - a, o = It(s, 0.26, 0.38) * (1 - It(s, 0.76, 0.96)), l = It(s, 0.38, 0.76), i = It(t, 0, 0.12) * (1 - It(t, 0.88, 1)), u = It(s, 0.2, 0.34) * (1 - It(s, 0.84, 1)), c = Math.sin(Math.PI * ia((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / qt.shuffles, lift: qt.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function GA(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Nl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, KA = (e) => Nl[e] ?? Nl.butler, Io = 2400, y4 = 0.05;
function b4({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, y4), l = Math.min(t + Io * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function YA(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function k4(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function QA(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const XA = (e, t) => ({ ...e, stretch: t.stretch }), JA = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Zr = (e, t) => t >= (e.least ?? 0);
function ZA(e, t, n) {
  if (!Zr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const eO = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), w4 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ql = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), $4 = (e) => e.right > e.left && e.bottom > e.top;
function tO(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(w4)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = ql(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = ql(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), $4(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function eu(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, m, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const b = t[f] - e[f];
      if (Math.abs(b) < 1e-9)
        (e[f] < o[m] || e[f] > o[p]) && (i = -1);
      else {
        const $ = (o[m] - e[f]) / b, y = (o[p] - e[f]) / b;
        l = Math.max(l, Math.min($, y)), i = Math.min(i, Math.max($, y));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const u = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: u, y: c, on: "surface", surface: s.id, dx: u - s.left, dy: c - s.top };
  }
  return a;
}
const Oe = {
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
}, _n = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), x4 = (e) => e * e * (3 - 2 * e), Ie = (e, [t, n]) => x4(_n(e, t, n)), S4 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], wt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, ea = ([e, t], n) => e + n() * (t - e);
function M4(e) {
  return S4.map(() => {
    const t = ea(wt.speed, e), n = ea(wt.angle, e) * Math.PI / 180, a = ea(wt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [ea(wt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const _4 = M4(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function C4(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * wt.gravity * (t[2] - wt.floor))) / wt.gravity;
}
function nO(e, t, n = _4) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = C4(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= wt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const aO = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function sO(e, t) {
  const n = e.map((o) => Math.sqrt(o)), a = n.reduce((o, l) => o + l, 0);
  let s = Math.min(Math.max(t, 0), 1) * a;
  for (const [o, l] of n.entries()) {
    if (s <= l || o === n.length - 1) {
      const i = l > 0 ? Math.min(s / l, 1) : 1;
      return { index: o, s: i, height: e[o] * 4 * i * (1 - i) };
    }
    s -= l;
  }
  return { index: 0, s: 1, height: 0 };
}
const oO = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), Xt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function lO(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, i] = [t.left + Xt.margin * n, t.right - Xt.margin * n], u = Math.min(Math.max(e + o + s * Xt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function iO(e, t, n) {
  const a = Oe.bug_smash, s = Ie(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Xt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Xt.tall * n * (1 - Ie(t, a.emerge)),
      turn: 90 * (1 - Ie(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ie(t, a.gone)
    }
  };
}
function rO(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Xt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = b4({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const je = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function uO(e) {
  const t = je.least + Math.floor(e() * (je.most - je.least + 1));
  return Array.from({ length: t }, () => ({
    wall: je.walls[Math.floor(e() * je.walls.length)],
    along: je.margin + e() * (1 - 2 * je.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Us(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * je.margin, l = ((e.along - je.margin + e.way * je.speed * n / a) / s % 2 + 2) % 2, i = je.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + je.inset, turn: 180 } : { x: e.wall === "left" ? t.left + je.inset : t.right - je.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function E4(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = k4(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function cO(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: i, shot: u } = E4(n, e.length), c = e.map((x, C) => ({ ...Us(x, t, Math.min(n / o.fps, ra(C).shot)), shot: C < u })), f = Ie(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], b = e.map((x, C) => ({ bug: x, index: C, seconds: n / o.fps - ra(C).shot, spot: Us(x, t, ra(C).shot) })).filter((x) => x.seconds >= 0), $ = b.flatMap((x) => {
    const C = (s == null ? void 0 : s.get(x.index)) ?? B4(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, C), s && R4(C, x.seconds, a), L4(C, x.seconds, a);
  }), y = b.filter((x) => T4(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), w = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: w }, slush: $, camera: y };
}
function ra(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function dO(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = ra(f), p = Us(c, t, m.shot), b = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), $ = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), y = Math.abs(p.x - u) >= b ? u : p.x + $ * b, w = $ > 0 ? Math.max(u, Math.min(y, i)) : Math.min(u, Math.max(y, l)), x = { from: u, to: w, begin: m.walk, end: m.aim };
    return u = w, x;
  });
}
function fO(e, t, n) {
  var o;
  const a = Oe.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Ie(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, A4 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function O4(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const T4 = (e) => e.along * 97 % 1 < Ce.camera, Cn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function I4(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), m = Cn(e, f), p = eu(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = Cn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function B4(e, t, n, a = []) {
  const s = O4(e.along + 1), [o, l] = A4[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...I4(f, t, a) };
  });
}
function R4(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), i = eu(Cn(a, o), Cn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function L4(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...Cn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ce.hold) / Ce.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function mO(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Oe.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, m = Ie(e, [0, c]), p = Ie(e, [c, c + f]);
  return l.map((b) => {
    const $ = { x: a.x + b.at[0] * t, y: a.y + b.at[1] * t };
    return {
      x: n.x + ($.x - n.x) * m,
      y: n.y + ($.y - n.y) * m,
      r: b.size * t * (0.15 + 0.85 * m * m),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: m >= 1
    };
  });
}
function hO(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (y) => {
    const [w, x] = [y.x - e.at.x, y.y - e.at.y];
    return { x: i.x + w * c - x * f, y: i.y + w * f + x * c };
  }, [p, b] = [...n].sort((y, w) => y.x - w.x), $ = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: $.map((y, w) => ({ from: y, to: w < $.length / 2 ? p : b })) };
}
const pO = (e, t) => Ie(t, e.grows) * (1 - Ie(t, e.sinks));
function wa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: _n(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: _n(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function vO(e, t) {
  const n = Oe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = wa(n, t), l = 1 - (1 - n.small) * Ie(a, n.shrinks) * (1 - Ie(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = wa(n, t), o = n.flat * Ie(a, n.squashes) * (1 - Ie(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * _n(s, ...n.springs)) * (1 - _n(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const gO = (e) => e === "pack_box";
function yO(e) {
  const { into: t, out: n } = wa(Oe.rope_swing, e);
  return 1 - Ie(t, [0, 1]) * (1 - Ie(n, [0, 1]));
}
function bO(e) {
  const t = Oe.rope_swing, { into: n, out: a } = wa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ie(n, [0, 1]) * (1 - Ie(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const N4 = { after: 3 }, Bo = 10, q4 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, D4 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, P4 = { weight: 19 }, tu = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, j4 = { every: 120 }, nu = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, au = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, F4 = {
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
}, Dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Bo }), re = (e, t, n = {}) => Dn(e, "clip", t, n), rs = (e, t, n = {}) => Dn(e, "look", t, n), Dl = (e, t, n = {}) => Dn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...Dn(e, "pick", t, n), ...a }), Se = (e) => Dn("nothing", "nothing", e, {}), W4 = 120, H4 = 300, us = (e, t) => ({ ...re(e, t), cooldown: H4 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), z4 = () => [re("joy", 2)], Bt = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), Rt = (e) => ({ ...e, cooldown: q4[e.name] }), fn = (e) => ({ ...e, shenanigan: !0, lasts: D4[e.name] }), La = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), Se(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Rt(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...Rt(re("bug_smash", 2)), toward: "", onto: !1 },
    re("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [re("startled", 2), re("dismay", 1), re("tantrum", 3), Se(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [re("nod", 2), Se(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [re("halo", 1), Se(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [re("repent", 1), Se(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [re("nod", 4), re("hand_rub", 4), Se(7)]),
  ...fe("question_asked", { cooldown: 60 }, [re("ask_sign", 9), re("look_up", 3), Se(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [Dl("read", 3), re("nod", 1), Se(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [Dl("read", 3), Se(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), Se(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), Se(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, z4()),
  ...fe("bar_failed", { holds: !0 }, [re("fume", 1), re("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [re("look_left", 2), re("look_right", 2), re("look_up", 1), Se(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [re("tumble", 3), Se(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [re("wipe_brow", 4), re("look_left", 1), re("look_right", 1), Se(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [re("shake", 3), re("tantrum", 2), Se(2)]),
  ...fe("refused", { cooldown: 20 }, [re("shake", 1), Se(1)]),
  ...fe("work_done", { cooldown: 120 }, [re("stretch", 2), Se(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [rs("amused", 3), Se(2)]),
  ...fe("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    Se(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [re("stumble", 3), Se(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), Se(13)]),
  ...fe("typing", { cooldown: 60 }, [rs("reading", 1), Se(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(F4).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [rs(t, 1)])),
  ...Object.entries(nu).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(au).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    Bt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    Bt("rest", 3, 180, 120),
    Bt("yawn", 2, 60, 60),
    Bt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    Bt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    Bt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    Bt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...fn(Rt(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    fn(Rt(re("disco", 2, { ball: "bubble" }))),
    Se(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: W4 }, [us("search", 3), { ...us("binoculars", 2), when: { home: !0 } }, { ...us("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...fe("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), Se(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...Rt(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [re("eager", 2, { slow: !0 }), Se(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [fn(Rt(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: tu.build.cooldown }, [be("unit", P4.weight), Se(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: j4.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    be("rest", 35, {}, { stay: [25, 60] }),
    be("seat", 15, {}, { stay: [15, 40] }),
    be("edge", 25, {}, { stay: [8, 20] }),
    fn(be("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    be("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    be("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    be("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    be("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    be("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    fn(Rt(be("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...fe("laptop", {}, [be("seat", 6, {}, { stay: [60, 150] }), be("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...fe("ledge_at", {}, [be("middle", 2, {}, { along: 1 / 2 }), be("third", 1, {}, { along: 1 / 3 }), be("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...fe("composed_as", {}, [
    be("facing", 4, {}, { turn: 0, leans: 0 }),
    be("turned_left", 1, {}, { turn: 335, leans: 0 }),
    be("turned_right", 1, {}, { turn: 25, leans: 0 }),
    be("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    be("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], su = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), ou = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), U4 = (e) => Array.isArray(e) ? e[0] : e, V4 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, G4 = (e) => La.some((t) => t.when.moment === e);
function K4(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || ou(f).every(([m, p]) => n(m) >= U4(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = La.filter((f) => su(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= N4.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function et(e, t) {
  const n = K4(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (lu(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function lu(e, t, n) {
  var a;
  for (const [s, o] of ou(t)) (a = e.memory) == null || a.set(s, e.now + V4(o, n));
}
function kO(e, t, n) {
  lu(e, La.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const wO = (e) => Object.values(tu).find((t) => su(t.when, e)) ?? null, Y4 = (e, t, n) => n - t <= (e.lifetime ?? Bo), $O = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Zr(e.clip, t));
class iu {
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
const Vs = {
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
}, xO = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), ru = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), SO = {
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
}, MO = 120, Q4 = 20, _O = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Q4), X4 = (e) => Vs[e] || Vs.idle, CO = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, uu = "airborne", J4 = "landing", Z4 = "travelling", cu = "grounded", EO = ({ airborne: e, landing: t, trip: n }) => e ? uu : t ? J4 : n != null && n.started ? Z4 : cu;
function AO(e, t) {
  var s;
  const n = ex(e, t);
  return e.mode === cu && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function ex(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === uu && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...tx(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const b = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: b ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : X4(c), facing: b ? p : i.posture === "sit" ? i.face : m };
}
function tx(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Gs = (e) => e.outcome, nx = /^plugin:[^:]+:sins:/, Pl = (e) => e.type === "plugins.card" && nx.test(e.markKey), ax = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Pl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Pl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], OO = (e, t) => e.filter((n) => n.author === "user" && ga(n.read_at) > t).map((n) => ({ beat: "read_message", time: ga(n.read_at), card: or(n) })).sort((n, a) => n.time - a.time), jl = { user: "reacted", agent: "agent_reacted" };
function TO(e, t) {
  return e.filter((n) => jl[n.author] && jt(n) > t).map((n) => ({ beat: `${jl[n.author]}:${n.emoji}`, time: jt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const sx = [.../* @__PURE__ */ new Set([...Object.values(nu).flatMap((e) => Object.keys(e)), ...Object.keys(au)])];
function IO(e, t) {
  return e.filter((n) => n.author === "agent" && jt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = sx.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: jt(n), card: or(n) })).sort((n, a) => n.time - a.time);
}
const ox = (e) => new iu(e).isTest(), $a = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Gs(e)] || "";
}, lx = 1800, ix = (e, t) => {
  if ($a(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && $a(n) !== "finished" && Number(e.time) - Number(n.time) <= lx ? "tests_fixed" : "tests_passed";
};
function BO(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(ox), s = a.filter((i) => $a(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, $a(i))), o.map((i) => ({ beat: ix(i, s), time: Number(i.time), card: i.key }));
}
function RO(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Gs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Gs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const LO = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: jt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function NO(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function qO(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function DO(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = ax.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function Ro(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Fl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function rx(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Ro(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function PO(e, t, n, a = {}) {
  const s = et({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : G4(`held:${e}`) ? "idle" : e;
}
const De = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function jO(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < De.ahead * n ? 180 : Math.sign(a) * De.turn;
}
const Wl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function FO(e, t) {
  const n = Math.min(De.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(De.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(De.lines, Math.floor((e.bottom - e.top - 2 * a) / De.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / De.sweep) % s, i = o % De.sweep, u = De.sweep - De.returnSeconds, c = Wl((i - u) / De.returnSeconds), f = i <= u ? Wl(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * De.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Hl = 3, du = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, zl = 12, WO = (e, t) => ({ mood: e, began: t, seen: 0 });
function HO(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!du(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Hl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * zl) / zl, lasts: Hl } };
}
const zO = (e) => e.posture === "hang" && !du(e.face), ux = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), cx = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function UO(e, t, n) {
  return ux.has(e) ? 1 / 0 : !cx.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(fu(n - t.began, t.share) - ct.lead, 0);
}
const dx = 5;
function VO(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= dx ? { beat: "long_walk", time: n } : null };
}
const fx = 30, ta = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function GO(e, t, n, a, s = null) {
  if (t && n < t.until || !ta.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = et({ moment: "spell", state: e, tally: s }, a), [l, i] = ta.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + ta.every } : { state: e, began: 0, until: 0, next: n + ta.every };
}
const KO = (e, t, n) => t && n < t.until && ru.has(e.state) ? { state: t.state, since: t.began } : e, ct = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, fu = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function YO(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = fu(o, e.share);
  return s ? { eager: mx(t, l), moment: null } : l > ct.lead ? { eager: t, moment: null } : l < ct.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ct.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ct.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = et({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function mx(e, t) {
  return e.on && t > ct.lead + ct.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ct.lead && t >= ct.least ? { ...e, on: !0, calm: !1 } : e;
}
const hx = 1, px = { look: "look", gaze: "gaze" };
function vx(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = et({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [px[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const gx = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => et({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), yx = (e, t, n, a, s, o = 0) => et({ moment: "jump", high: e > hx * t, memory: a, now: s, room: o }, n).name === "backflip", bx = { work: ["building"], idle: ["standing"] };
function QO(e, t, n, a) {
  const s = Vs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(bx[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), ru.has(e) ? { moments: o, began: n || a } : (n && a - n >= fx && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function kx(e, t, n) {
  return !et({ moment: "pondering", memory: e, now: t }, n) || !et({ moment: "thought_cloud", memory: e, now: t }, n) ? null : et({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Ul = { pondering: kx };
function XO(e, t, n, a, s, o) {
  if (Ul[e.beat]) {
    const i = Ul[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = vx(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Bo && { lifetime: l.lifetime } } } : null;
}
function JO(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = gx(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const ZO = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function eT(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function tT(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const nT = (e, t) => !!(e != null && e.watches) && !t.once, aT = 10, sT = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || Y4(a, a.queuedAt, n)), oT = (e, t) => t ? null : e[0] ?? null;
function lT(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const iT = (e, t) => !t.during || !e.some((n) => n.during === t.during), wx = 2 * Math.PI, $x = 500;
function rT(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / $x, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = wx * l / 1e3, b = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, y = (c ? b : t != null && t.behind && t.mood === "reading" ? { ...t } : t && b && !u ? s && !t.behind && !b.behind ? Sx(b, t, n, p, s) : _x(b, t, n, p) : t) ?? b, w = y != null && y.behind && y.mood === "reading" ? xx(e.point, y, n, l, s) : y;
  return { point: w ?? null, toward: w ? { x: w.x - n.x, y: w.y - n.y } : null, amount: m, at: a };
}
function xx(e, t, n, a, s) {
  const o = (D) => D * 180 / Math.PI, l = (D) => o(Math.atan2(Math.sin(D * Math.PI / 180), Math.cos(D * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, b = m ? e.readingYaw + p : f, $ = b + l(c - b), y = Math.min(Math.max(a / 1e3, 0), 0.1), w = De.turnSpeed * y, x = m ? b + Math.min(Math.max($ - b, -w), w) : $, C = m ? e.readingFollow + p : x, q = C + (x - C) * (1 - Math.exp(-y / De.followSeconds)), P = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(Ro(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), Q = Math.min(Math.max(I, -P.up), P.down), W = De.tipSpeed * y, R = m ? e.readingPitch + Math.min(Math.max(Q - e.readingPitch, -W), W) : Q;
  return { ...t, readingYaw: x, readingFollow: q, readingPitch: R, readingFacing: i };
}
function Sx(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (C) => {
    const { yaw: q, pitch: P } = Ro(C.x - n.x, s, n.y - C.y, o);
    return { yaw: q, pitch: Math.min(Math.max(P, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Fl(i(e)), Fl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, b] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [$, y, w] = u.map((C, q) => p * C + b * c[q]), x = s * $ / y;
  return { ...t, x: n.x + x, y: n.y - rx(x, s, -Math.asin(Math.min(Math.max(w, -1), 1)), o) };
}
const Mx = 0.15;
function uT(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Mx;
}
function _x(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const Cx = (e) => !(e != null && e.on);
function cT(e, t, n) {
  if (Cx(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const En = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, it = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, cs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Vl = (e) => e * e * (3 - 2 * e);
function Ex(e) {
  if (e < 0 || e >= it.seconds) return null;
  const t = cs(e, ...it.flicker), n = Math.floor(t * it.flickers * 2) % 2 === 0, a = e < it.flicker[1] ? n ? 0.35 + 0.5 * t : it.dim : 1;
  return { strength: 1 - Vl(cs(e, ...it.fade)), lit: a, white: e < it.flash[0] ? 0 : 1 - Vl(cs(e, ...it.flash)) };
}
const dT = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function fT(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Ex(t - e.at);
  return a && { colour: En.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: it.signs[e.tone], ...a } };
}
function mT(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function hT(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= En.looks || a === null && n - e.since >= En.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function pT(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const kt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, vT = { behind: 39, figure: 40, ahead: 41 }, Ax = "[data-figure-pile]", Ox = { amber: [1, 0.69, 0.125], good: En.colours.good, bad: En.colours.bad }, ua = { phases: 4, ms: 230, dim: 0.25 }, gT = (e, t, n) => e !== "amber" || (t + n) % ua.phases < ua.phases / 2 ? 1 : ua.dim, yT = (e) => e === "amber" ? ua.phases : 1;
function bT(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const kT = Object.keys(Ox), st = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, hn = ([e, t], n) => e + n() * (t - e);
function wT(e) {
  const t = st.least + Math.floor(e() * (st.most - st.least + 1));
  return Array.from({ length: Math.min(t, st.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * st.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = hn(st.start, e), l = hn(st.reach, e);
    return {
      text: et({ moment: "digit" }, e).name,
      x: a * o,
      y: st.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(hn(st.moveMs, e)),
      fadeMs: Math.round(hn(st.fadeMs, e))
    };
  });
}
const ds = { high: 3, gap: 1 };
function $T(e) {
  const t = Math.floor(e / ds.high);
  return { left: -(kt.inside + kt.width / 2 + t * (kt.width + ds.gap)), up: e % ds.high * (kt.height - kt.top) };
}
const Tx = (e, t, n) => et({ moment: "unit", memory: e, now: t }, n) !== null, Ix = { after: 5 }, Bx = (e) => e.filter((t) => t.active && (t.process || t.watch) && new iu(t).isBuild());
function xT(e, t, n) {
  const a = Bx(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Ix.after ? s : null;
}
function ST(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Tx(n, a, s) } : null;
}
const Gl = { ahead: 140, up: 70 };
function MT(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Gl.ahead, y: a - Gl.up } } : o ? { at: { x: n(o), y: a - o.up - kt.height } } : t ? { at: null } : null;
}
const fs = { least: 4e3, most: 1e4 }, Rx = (e) => fs.least + e() * (fs.most - fs.least), Lt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function _T(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Rx(t);
    if (n.length >= Lt.most || t() >= Lt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (Lt.at[0] + t() * (Lt.at[1] - Lt.at[0]));
    n.push({ from: o, to: o + Lt.ms }), a = o + Lt.ms;
  }
}
const CT = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), ET = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), mu = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), AT = new Set(La.filter((e) => mu.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Lx = (e) => e.some((t) => t.state === "built"), OT = (e, t) => Lx(t) ? e.filter((n) => !mu.has(n.beat)) : e, xt = { reach: 40, room: 6 }, Nx = (e, t) => t <= e - xt.reach + 2, TT = (e, t, n) => Nx(e, n) ? t - xt.reach : e - xt.reach - xt.room, IT = (e, t, n, a) => a > 0 && t < e && t + xt.reach >= e - 2 ? Math.min(n, Math.max(e, t + xt.reach)) : e, ms = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, BT = (e) => hn(e() < ms.longShare ? ms.long : ms.short, e), qx = 2 * kt.width;
function RT(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= qx ? o : e + (o - e + s / 2) % s;
}
const Dx = 60, LT = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Dx, Kl = "[data-figure-home]", Pn = () => {
  var t;
  const e = document.querySelector(Kl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Kl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Px = "[data-figure-docked-bars]", jx = "[data-figure-chat-foot]", Fx = [0.85, 0.6, 0.35, 0.15], Wx = ["question", "waiting", "suggestion"], NT = (e, t) => Wx.find((n) => e[n] > 0 && t[n] === "behind") || null;
function qT() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Hx = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", zx = "[data-figure-newest]";
function hu() {
  var a, s;
  const e = (a = Pn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(zx), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Lo(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function An(e, t, n = hu()) {
  if (!e || !n) return !0;
  const a = pt(e, t), s = qa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Le.top * t.size, bottom: a.top + Le.bottom * t.size }, l = qt.gap;
  return !Na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function DT(e, t, n, a = hu()) {
  if (!a || An(t, e, a)) return null;
  const s = qa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = zt(), u = t.posture === "stand" ? qo * e.size : $u * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - qt.gap - l, a.right + qt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && An(p, e, a) && b8(p, e)).sort((p, b) => Math.abs(p.x - t.x) - Math.abs(b.x - t.x))[0] ?? null;
}
const hs = 0.26, pu = 0.54, Ux = 1.25 / 5.4, jn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: hs, travels: "stand" },
  lounge: { drop: hs, travels: "stand" },
  composed: { drop: hs, travels: "stand" },
  hang: { drop: pu, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, PT = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Ux * Math.cos(t * Math.PI / 180),
  y: 1 - n - pu
}), yn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Vx = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), jT = (e, t) => (e === "sit" ? Vx.has(t) : yn.has(e)) ? e : "stand";
function FT(e, t) {
  return e.facing === t.facing || !yn.has(e.posture) && !yn.has(t.posture) ? t : { posture: "stand", facing: yn.has(e.posture) ? e.facing : t.facing };
}
const WT = 0.25, HT = (e, t) => yn.has(e) && jn[t].drop === 0, vu = 2, Gx = 90, Kx = 180, Yx = 140, Qx = 280, Xx = 420, Jx = 0.25, Zx = 290, e8 = 600, t8 = "cubic-bezier(0.2, 0.7, 0.4, 1)", n8 = "cubic-bezier(0.55, 0, 0.9, 0.6)", ps = 5;
function xa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ps) return null;
  (l || i) && (o = Math.max(o, vu));
  const b = o > 1, $ = Math.abs(t.x - e.x), y = $ < ps ? 0 : $ / (Gx * o) * 1e3, w = Math.min(y, b ? Yx : Kx), x = Math.abs(t.y - e.y), C = t.y < e.y, q = C && !p && yx(x, n, u, c, f, m), P = C ? Xx + Math.min(x, 400) * Jx : Math.sqrt(2 * x / Io) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: x > ps ? q ? e8 : P : 0,
    lead: q ? Zx : C ? Qx : 0,
    easing: C ? t8 : n8,
    hopping: !0,
    clip: q ? "backflip" : C ? "jump" : "fall"
  }, Q = { x: t.x, y: t.y, ms: y + w, lead: 0, easing: "linear", ramp: w, ...b ? { clip: "run" } : {} }, W = p ? a8(t, n) : I, R = C && !a ? [{ ...Q, y: e.y }, W] : [{ ...I, x: e.x }, Q];
  return { way: Math.sign(t.x - e.x) || 1, legs: R, lands: !s, pace: o, running: b };
}
const a8 = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), s8 = (e, t) => e.postures.includes(t) ? t : e.postures[0], zT = (e, t, n) => e.posture === "walk" && n ? "walk" : s8(e.clip, t), pt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - jn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Na = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Lo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function zt() {
  var t;
  const e = (t = Pn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const na = 0.5, Yl = 20;
function UT(e, t, n = zt()) {
  const a = pt(e, t);
  return a.left >= n.left + Yl && a.right <= n.right - Yl;
}
function No(e, t, n = zt()) {
  const a = pt(e, t), s = a.right - a.left, o = qa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - na && i <= n.right + na && a.top >= n.top - na && u <= n.bottom + na;
}
const Sa = [0.35, 0.5, 0.65], Ma = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Le = { left: Sa[0], right: Sa.at(-1), top: Ma[0], bottom: Ma.at(-1) }, o8 = 0.24;
function qa(e) {
  if (e.posture === "stand") return { left: Le.left, right: Le.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + o8 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Le.left, t), right: Math.max(Le.right, t) };
}
function l8(e, { size: t }, n = zt()) {
  const a = qa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const qo = (Le.right - Le.left) / 2 + 0.08;
function VT(e, t) {
  return e === "hang" ? Le : { ...Le, bottom: Math.min(Le.bottom, 1 - t - jn[e].drop) };
}
const i8 = "[data-figure-agent]";
function gu(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Lo(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const yu = (e) => Ma.flatMap(
  (t) => Sa.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Do(e, t, n = "") {
  if (!An(e, t)) return Sa.length * Ma.length;
  const a = pt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Hx)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Na(s, u) && Lo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return yu(s).filter(([i, u]) => l(i, u) || gu(i, u, n)).length;
}
function r8(e, t) {
  const n = pt(e, t);
  return yu({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => gu(a, s, "", i8)).length;
}
const Ql = 4;
function GT(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Ql; o <= s; o += Ql)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!r8(i, e) && An(i, e)) return i;
    }
  return null;
}
function On(e, t, n) {
  const a = zt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => No(l, t, a) && An(l, t)).map((l) => ({ spot: l, covered: Do(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const bu = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), u8 = [0.5, 0.25, 0.75], c8 = (e) => bu(e.getBoundingClientRect(), u8), ku = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, d8 = qo, f8 = (e, t, { size: n }, a = d8) => wu(e, ku[t], a * n, "stand");
function wu(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const m8 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, $u = 0.1, h8 = (e, t, { size: n }) => wu(e, m8[t], $u * n, "sit"), p8 = (e) => ((e + 180) % 360 + 360) % 360 - 180, vs = 60;
function KT(e, t) {
  const n = p8(t);
  return !e.aside || Math.abs(n) >= vs ? t : n < 0 ? 360 - vs : vs;
}
const bn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, v8 = (e) => [.../* @__PURE__ */ new Set([e, ...bn.turns.map((t) => (t + 360) % 360)])];
function YT(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = v8(t), l = bn.every[0] + a() * (bn.every[1] - bn.every[0]);
  return { face: t, from: s ? g8(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function g8(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / bn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function QT(e, t) {
  const { element: n, edge: a } = Da(), s = ["left", "right"].map((i) => Fn(h8(a, i, e), e)).filter((i) => n && No(i, e) && !Do(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function XT(e, t, { size: n }) {
  const a = (Le.right - Le.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - xu } : e;
}
const xu = 7;
function Su() {
  const e = [...document.querySelectorAll(Ax)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function y8(e, t) {
  const n = pt(e, t), a = n.right - n.left;
  return { left: n.left + Le.left * a, right: n.left + Le.right * a, top: n.top + Le.top * a, bottom: n.bottom };
}
function b8(e, t) {
  const n = Su();
  return !n || !Na(y8(e, t), n);
}
const k8 = 4;
function Da() {
  const e = Wn(), t = Su(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > k8 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - xu - n, 0) } };
}
const JT = ({ size: e, below: t }) => (1 - t) * e;
function Fn(e, t) {
  const n = zt(), { size: a, below: s } = t, o = jn[e.posture].drop * a;
  return { ...l8(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ks = (e, t) => Object.keys(ku).map((n) => Fn(f8(e, n, t), t)), Po = (e, t) => bu(e, Fx).map((n) => Fn(n, t)), Mu = (e, t, n) => On(e, t, n) ?? e[0];
function ZT(e, t) {
  const { element: n, edge: a } = Da();
  return { ...Mu(Ks(a, e), e, t), view: null, on: n };
}
function eI(e, t, n, a) {
  const { element: s, edge: o } = Da(), l = (a ? Ks(o, t) : [...Ks(o, t), ...Po(o, t)]).filter(
    (c) => !Na(pt(c, t), e)
  ), i = On(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !Do(i, t) ? i : On(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Wn() {
  var a;
  const e = Pn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Px);
  if (!t) return { ...Pa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Xl = { within: 2 };
function tI(e) {
  const { element: t, docked: n, edge: a } = Wn();
  if (!n || e.on !== t) return !0;
  const s = Pa().edge;
  return a.left > s.left + Xl.within || a.left + a.width < s.left + s.width - Xl.within;
}
const w8 = "[data-figure-closing]";
function nI() {
  var n;
  const { element: e, docked: t } = Wn();
  return t && !!((n = e.firstElementChild) != null && n.matches(w8));
}
const _u = "[data-figure-progress]";
function aI(e) {
  const t = e.querySelector(_u);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function sI(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const $8 = { across: 300, above: 380, below: 60 };
function oI(e) {
  const { across: t, above: n, below: a } = $8;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: x8(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const x8 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Cu = "[data-figure-bar]", Ys = { back: 144, along: 0.4 };
function lI(e) {
  const { element: t, docked: n, edge: a } = Wn(), s = n ? t.querySelector(Cu) : null;
  if (!(s != null && s.querySelector(_u))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Fn({ x: o - Ys.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function iI(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ys.along * a.size ? t.x + Ys.along * a.size : e.x, y: e.y, behind: !0 };
}
function rI(e) {
  const t = e.querySelector(Cu), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Pa() {
  const e = Pn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function uI(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Pa(), u = n === null ? S8(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Fn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function S8(e, t, n, a, s) {
  const o = Po(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + kt.width < s && u.x + a - xt.reach - xt.room >= l);
  return On(i.length ? i : o, t, n);
}
const M8 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function cI(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, vu));
  const b = (q) => {
    const P = pt(q, n, jn[q.posture].travels);
    return { x: P.left, y: P.top };
  }, $ = t.ladder ?? e.ladder;
  if ($ && !(t.ladder && e.ladder)) return _8(b(e), b(t), b({ ...$.foot, posture: "stand" }), $.way, !!t.ladder, n, s);
  const [y, ...w] = [e, ...u, t].map(b), x = xa(y, w[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), C = w.slice(1).map((q, P) => {
    var I;
    return (I = xa(w[P], q, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : I.legs.find((Q) => Q.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...C.filter(Boolean)] };
}
function _8(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / M8.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? xa(e, n, o.size, { pace: l }) : xa(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function dI(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function fI(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && On(c8(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Da();
  return { ...Mu(Po(s, t), t, n), view: null, on: a };
}
const C8 = "[data-figure-bubble]", E8 = 250;
let kn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Eu = 0;
const un = () => kn, gs = /* @__PURE__ */ new WeakMap();
let A8 = 0;
function jo(e) {
  return gs.has(e) || gs.set(e, `floor-${++A8}`), gs.get(e);
}
const O8 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, T8 = () => {
  var e, t;
  return ((t = (e = Pn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function I8(e, t) {
  var a;
  const n = (a = e.querySelector(jx)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function B8(e, t) {
  const n = e && I8(e, t), a = e ? [...e.querySelectorAll(C8)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || O8(l, n))).map(({ element: o, type: l, box: i }) => ({ id: jo(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const R8 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= E8 ? (t.top - a.top) / s * 1e3 : 0;
};
function Au(e = kn, t = performance.now()) {
  const n = zt(), a = T8(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Wn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Pa();
  return c.element && u.push({ id: jo(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...B8(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: R8(e, f, t) }))) });
}
const Qs = /* @__PURE__ */ new Set();
function L8(e) {
  return Qs.add(e), () => Qs.delete(e);
}
function N8() {
  Ou();
  const e = () => {
    Eu = requestAnimationFrame(e), !document.hidden && (kn = Au(kn), Qs.forEach((t) => t(kn)));
  };
  e();
}
function Ou() {
  cancelAnimationFrame(Eu);
}
const Fo = 5, q8 = 56, D8 = { share: 0.6 }, P8 = (e) => -Math.sqrt(2 * Io * D8.share * e), tn = (e, t) => e.find((n) => n.id === t) ?? null;
function mI(e, t = Au().floors) {
  const n = tn(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : jo(e.on) : null, o = s && tn(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Tu({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = un().floors) {
  const c = tn(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || j8(c, f, o)) && F8(f, i, u) ? { x: f.x, y: f.y } : null;
}
const Wo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, j8 = (e, t, n) => !Wo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function hI(e, t = un().floors) {
  if (!Wo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Fo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function F8(e, t, n = un().floors) {
  const a = tn(n, "home");
  return e.posture === "hang" && a && pt(e, t).bottom >= a.top ? !1 : No(e, t);
}
function pI(e, t, n, a = un().floors) {
  const s = Tu(e, n, a);
  if (!e.home) return W8(e, t, s, a);
  if (!s) return null;
  const o = tn(a, "home"), l = s.y - t.y, i = l > Fo ? "dropping" : -l > q8 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function W8(e, t, n, a) {
  const s = n ? tn(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: P8(e.risen) };
  if (!n) return null;
  if (Wo(t) && n.y - t.y > Fo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function vI(e, t, n) {
  const a = qo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function gI(e, t, n, a = un().floors) {
  const s = t && Tu(t, n, a);
  return s ? { ...e, ...s } : e;
}
const H8 = ["data-type"], z8 = { class: "figure-floor-name" }, U8 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: pe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", z8, v(e.floor.type), 1)
    ], 12, H8));
  }
}, V8 = /* @__PURE__ */ U(U8, [["__scopeId", "data-v-4e0f1e2e"]]), G8 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, K8 = {
  __name: "FigureFloors",
  setup(e) {
    const t = lt(un().floors);
    let n = () => {
    };
    return _e(() => {
      n = L8((a) => t.value = a.floors), N8();
    }), Te(() => {
      n(), Ou();
    }), (a, s) => (r(), d("div", G8, [
      (r(!0), d(B, null, Z(t.value, (o) => (r(), j(V8, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, yI = /* @__PURE__ */ U(K8, [["__scopeId", "data-v-e519168b"]]), Y8 = 5e3;
function bI(e, { chosen: t, held: n = () => !1 }) {
  const a = (q) => {
    var P;
    return (P = e.props[q].data.value) == null ? void 0 : P.value;
  }, s = E(""), o = E(""), l = E(!1), i = E(!1), u = E(Date.now() / 1e3), c = M(() => e.props["voice-profile"].loaded.value ? { profile: a("voice-profile"), avatar: a("voice-avatar"), avatar_shown: a("voice-avatar-shown") } : null), f = () => {
    var q;
    return !((q = c.value) != null && q.avatar) || c.value.avatar_shown === "never" || c.value.avatar_shown === "working" && !s.value ? "" : c.value.profile;
  }, m = M(() => {
    const q = t();
    return q === "voice" ? f() : q && q !== "none" ? q : "";
  }), p = M(() => !!m.value && !n()), b = E("");
  ce(m, (q) => {
    q && (b.value = q);
  }, { immediate: !0 });
  const $ = E(!1), y = E(!1);
  let w = 0;
  const { data: x, failure: C } = e.props.tool;
  return ce([x, C], () => {
    const q = C.value ? {} : x.value ?? {};
    ((q.tool ?? "") !== s.value || !!q.running !== $.value) && (clearTimeout(w), y.value = !!q.tool, q.tool && !q.running && (w = setTimeout(() => {
      y.value = !1;
    }, Y8))), $.value = !!q.running, s.value = q.tool ?? "", o.value = q.wait_target ?? "", l.value = !!q.thinking, i.value = !!q.asking;
  }), u.value = Date.now() / 1e3, e.follow(["hook_call.*", "dock_item.*", "process_part.*"], Oa(() => {
    u.value = Date.now() / 1e3, e.reload("tool");
  }, Co.runningTool)), { figureVoice: m, figureHere: p, shownVoice: b, runningTool: s, waitingFor: o, thinking: l, asking: i, heardAt: u, toolRunning: $, commandShown: y };
}
const Xs = E(0), kI = M(() => Xs.value > 0);
function wI() {
  Xs.value += 1, Te(() => {
    Xs.value -= 1;
  });
}
const wn = (e) => typeof e == "number" ? e : Date.parse(e);
function $I(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: wn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => wn(s.row.created_at) - wn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Jl = 20;
async function xI(e, t, n) {
  for (let a = 0; a < Jl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || wn(o.created_at) <= wn(s.created_at) || !await n()) return a;
  }
  return Jl;
}
const Q8 = 3, ys = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function X8(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ys[n.grouping]) == null ? void 0 : a.call(ys, e.row, n)) || "";
}
function J8(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function SI(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Q8 ? [J8(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = X8(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const MI = (e) => (t) => t.filter((n) => n.id !== e), _I = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), CI = (e) => (t) => [...t, e], EI = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function AI(e, t = {}) {
  const n = at(), a = E(null), s = E("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function OI(e) {
  const t = at(), n = E("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const aa = /* @__PURE__ */ new Map();
function Z8(e, t) {
  if (aa.has(e)) return aa.get(e);
  const n = t().finally(() => aa.delete(e));
  return aa.set(e, n), n;
}
function TI() {
  const e = at(), t = E(null), n = E("");
  async function a() {
    const s = await Z8(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const e3 = { class: "cards-page" }, t3 = { class: "cards-bar" }, n3 = { class: "cards-count" }, a3 = { class: "cards" }, s3 = {
  key: 1,
  class: "cards-note"
}, o3 = {
  key: 2,
  class: "cards-note"
}, l3 = ["data-row", "onClick"], i3 = { class: "card-head" }, r3 = { class: "card-title" }, u3 = { class: "card-foot" }, c3 = {
  __name: "RowCards",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    loaded: { type: Boolean, required: !0 },
    term: { type: String, required: !0 },
    icon: { type: String, required: !0 },
    head: { type: Function, required: !0 },
    title: { type: Function, required: !0 },
    foot: { type: Function, required: !0 }
  },
  emits: ["new", "open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", e3, [
      h("div", t3, [
        h("span", n3, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(ie, Ne({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: L(() => [
            A(se, {
              name: "plus",
              size: 12
            }),
            H(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", a3, [
        e.loaded ? e.failure ? (r(), d("p", s3, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", o3, "No " + v(e.term) + "s yet", 1)) : (r(), j(nt, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(B, null, Z(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          h("span", i3, [
            A(se, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            H(" " + v(e.head(o)), 1),
            A(Ye, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", r3, v(e.title(o)), 1),
          h("span", u3, v(e.foot(o)), 1)
        ], 8, l3))), 128))
      ]),
      ne(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, II = /* @__PURE__ */ U(c3, [["__scopeId", "data-v-b39fea5d"]]), Zl = "newest";
function BI(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = $e(Be, null)) == null ? void 0 : c.search, s = E(""), o = E(Zl), l = E("all"), i = M(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => Nr(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Zl ? m : [...m].sort((p, b) => t(p).localeCompare(t(b)));
  }), u = M(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const d3 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, f3 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, m3 = 40, h3 = "top", p3 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = $e(Be, null)) == null ? void 0 : p.autoScroll, s = M(() => a === h3), o = E(null), l = E(!1), i = (b) => s.value ? b.scrollTop : b.scrollHeight - b.scrollTop - b.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var b;
      l.value = i(o.value) >= m3, s.value || (b = n.feed) == null || b.reachTop(o.value);
    }
    ce(() => {
      var b;
      return [n.rowCount, (b = n.feed) == null ? void 0 : b.isLoaded()];
    }, async () => {
      await Re(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return _e(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), tt(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (b, $) => (r(), d("div", d3, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ne(b.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", f3, [
        A(an, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: L(() => [
            ge(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(se, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              $[0] || ($[0] = H(" Newest ", -1))
            ], 512), [
              [ao, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, RI = /* @__PURE__ */ U(p3, [["__scopeId", "data-v-d704d7e3"]]), v3 = ["aria-selected", "data-tab", "onClick"], g3 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, y3 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = $e(Be, null), o = M(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = E(null), i = E({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var $;
      const b = ($ = l.value) == null ? void 0 : $.querySelector(".inner-tab.on");
      if (!b) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: b.offsetLeft, width: b.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, b.offsetLeft - 12));
    }
    const f = () => Re(() => c(!0));
    let m = null;
    return _e(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Te(() => m == null ? void 0 : m.disconnect()), ce(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), ce(() => n.answer, f, { deep: !0 }), (p, b) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(B, null, Z(o.value, ($) => {
        var y, w;
        return r(), d("button", {
          key: $.key,
          type: "button",
          role: "tab",
          class: X(["inner-tab", { on: ((y = e.active) == null ? void 0 : y.key) === $.key }]),
          "aria-selected": ((w = e.active) == null ? void 0 : w.key) === $.key,
          "data-tab": $.key,
          onClick: (x) => a("choose", $)
        }, [
          H(v($.label) + " ", 1),
          u($) ? (r(), d("span", g3, v(e.answer[$.count_field]), 1)) : k("", !0)
        ], 10, v3);
      }), 128)),
      h("i", {
        class: X(["inner-tabs-line", { slides: i.value.slides }]),
        style: pe({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, b3 = /* @__PURE__ */ U(y3, [["__scopeId", "data-v-63fcd326"]]), k3 = { class: "task-bar" }, w3 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", k3, [
      h("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: pe({ width: `${n(e.done)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: pe({ width: `${n(e.testing)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-started",
        "data-task-bar-started": "",
        style: pe({ width: `${n(e.started)}%` })
      }, null, 4)
    ]));
  }
}, LI = /* @__PURE__ */ U(w3, [["__scopeId", "data-v-eafa73d4"]]), $3 = {
  class: "tab-body",
  "data-tab-body": ""
}, x3 = { "data-tab-content": "" }, S3 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = E(!1);
    let a = 0;
    return ce(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, so(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", $3, [
      n.value ? (r(), j(nt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      ge(h("div", x3, [
        ne(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [ao, !n.value]
      ])
    ]));
  }
}, M3 = /* @__PURE__ */ U(S3, [["__scopeId", "data-v-63876533"]]), _3 = {
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
    return (o, l) => (r(), j(Fr, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: L(() => [
        A($t, null, {
          default: L(() => [...l[2] || (l[2] = [
            H("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(B, null, Z(a, (i) => A(We, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: L(() => [
            H(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(B, { key: 0 }, [
          A($t, null, {
            default: L(() => [...l[3] || (l[3] = [
              H("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(B, null, Z(s, (i) => A(We, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: L(() => [
              H(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: L(() => [
        ne(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, NI = /* @__PURE__ */ U(_3, [["__scopeId", "data-v-dab0064d"]]);
function qI() {
  const e = E(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const DI = (e) => import(
  /* @vite-ignore */
  e
), C3 = 86400, Js = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function E3(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Js(t) - Js(e)) / C3);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function PI(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Js(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: E3(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const bs = 280, ks = 240, ws = 120, A3 = 6, O3 = 14, Tn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function T3(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Iu(e, t) {
  const n = Math.max(0, T3(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function I3(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${O3}px)` }), e.offsetHeight, e.style.transition = `height ${bs}ms ${Tn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = Iu(t, e));
    const p = s() - i;
    if (!u && p >= bs && (u = !0, e.style.transition = `opacity ${ks}ms ease-out, transform ${ks}ms ${Tn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < bs + ks) return a(m);
    f();
  };
  return a(m), f;
}
function jI(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${A3}px)` }), e.offsetHeight, e.style.transition = `opacity ${ws}ms ease-out, transform ${ws}ms ${Tn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Iu(t, e)), s() - l < ws) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const B3 = 140, sa = 220, ei = 5;
function FI({ gap: e = B3, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, ei);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, b = I3) => {
    if (l || !m.pane || !m.follows()) return p();
    const $ = { el: f, options: m, done: p, arrival: b, display: f.style.display || "" };
    if (!s)
      return s = !0, i($, () => o = t(u, e));
    f.style.display = "none", n.push($), n.length >= ei && c.flush();
  };
  return c.flush = () => {
    var f;
    l = !0, queueMicrotask(() => l = !1);
    for (const m of [...a]) (f = m.cancel) == null || f.call(m);
    clearTimeout(o), s = !1;
    for (const m of n.splice(0))
      m.el.style.display = m.display, m.done();
  }, c;
}
function WI(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${sa}ms ${Tn}, opacity ${sa}ms ease-in, margin ${sa}ms ${Tn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, sa);
}
const Bu = "chat.pins.minimised", ca = E(fa(Bu, !1));
function ti(e) {
  ca.value = e, yo(Bu, e);
}
function R3(e) {
  const t = M(() => e()), n = M(() => ca.value ? [] : e()), a = () => ti(!ca.value), s = Date.now() / 1e3;
  return ce(
    () => t.value.filter((o) => jt(o) > s).length,
    (o, l) => o > l && ti(!1)
  ), { pins: t, visible: n, minimised: ca, toggle: a };
}
const L3 = ["title"], N3 = {
  key: 0,
  class: "pins-count"
}, q3 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = R3(() => t.pinRows);
    return (o, l) => O(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: O(a), inline: e.inline }]),
      title: O(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = he((...i) => O(s) && O(s)(...i), ["stop"]))
    }, [
      A(se, {
        name: O(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      O(a) ? (r(), d("span", N3, v(O(n).length), 1)) : k("", !0)
    ], 10, L3)) : k("", !0);
  }
}, HI = /* @__PURE__ */ U(q3, [["__scopeId", "data-v-d073c504"]]), D3 = ["title"], P3 = ["title"], j3 = { class: "diff-card-dir" }, F3 = { class: "diff-card-name" }, W3 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, H3 = ["title"], z3 = ["title"], U3 = {
  key: 0,
  class: "diff-card-note"
}, V3 = ["href"], G3 = ["src", "alt"], K3 = { class: "diff-card-rows" }, Y3 = { class: "diff-row-num" }, Q3 = { class: "diff-row-sign" }, X3 = { class: "diff-row-code" }, J3 = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    change: { type: String, required: !0 },
    from: { type: String, default: "" },
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
    function o(_) {
      (_.metaKey || _.ctrlKey) && (_.stopPropagation(), a("open", n.path));
    }
    const l = () => ({
      head: n.path,
      items: [
        { label: "Open file", group: "open", disabled: p.value, reason: "Deleted", run: () => location.hash = Ba.file(n.path) },
        { label: n.folded ? "Unfold" : "Fold", group: "open", disabled: p.value, reason: "Deleted", run: () => a("fold") },
        { label: "Copy path", group: "copy", run: ({ say: _ }) => Ft(n.path, "the path", _) }
      ]
    }), i = { new: "created", deleted: "deleted", moved: "moved" }, u = { add: "+", del: "−" }, c = M(() => n.path.lastIndexOf("/") + 1), f = M(() => n.path.slice(0, c.value)), m = M(() => n.path.slice(c.value)), p = M(() => n.change === "deleted"), b = M(() => i[n.change]), $ = M(() => new Set(n.rows.filter((_) => _.line_type === "add").map((_) => _.line))), y = E("after"), w = M(() => y.value === "before" ? n.whole.old : n.whole.text), x = M(() => n.whole && n.whole.text !== void 0 ? w.value.split(`
`).map((_, g) => ({ line_type: y.value === "after" && $.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: _ })) : n.rows.filter(
      (_) => !(n.editsOnly && ["ctx", "fold"].includes(_.line_type)) && !(n.hideRemovals && _.line_type === "del")
    )), C = E(!1), q = M(() => n.lines && !C.value && !n.whole), P = M(() => q.value ? x.value.slice(0, n.lines) : x.value), I = M(() => x.value.length - P.value.length), Q = (_) => _.line === null || _.line_type === "del" ? "" : _.line, W = (_) => _.line_type === "fold" ? _.hidden ? `⋯ ${_.hidden} lines` : "⋯" : _.text, R = E(null), D = E(null);
    let G = null;
    return _e(() => {
      if (!D.value) return;
      let _ = !0;
      G = new ResizeObserver(() => {
        !R.value || !D.value || (R.value.style.transition = _ ? "none" : "", R.value.style.height = `${D.value.offsetHeight}px`, _ = !1);
      }), G.observe(D.value);
    }), Te(() => G && G.disconnect()), (_, g) => (r(), d("section", {
      class: X(["diff-card", { half: e.half, gone: p.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      ge((r(), d("header", {
        class: "diff-card-head",
        title: p.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: g[3] || (g[3] = (S) => !p.value && a("fold"))
      }, [
        h("span", {
          class: "diff-card-path",
          title: `${e.path} · ${O(s)}-click to open it`,
          onClick: o
        }, [
          h("span", j3, v(f.value), 1),
          h("span", F3, v(m.value), 1),
          b.value ? (r(), d("span", {
            key: 0,
            class: X(["diff-card-badge", e.change])
          }, v(b.value), 3)) : k("", !0),
          e.from ? (r(), d("span", W3, "from " + v(e.from), 1)) : k("", !0)
        ], 8, P3),
        h("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        h("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(Ye, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        h("button", {
          type: "button",
          class: "diff-card-open",
          title: "Open in the inspector",
          "aria-label": "Open in the inspector",
          "data-diff-open": "",
          onClick: g[0] || (g[0] = he((S) => O(eh)(e.path), ["stop"]))
        }, [
          A(se, {
            name: "open",
            size: 13
          })
        ]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[1] || (g[1] = he((S) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, v(y.value === "after" ? "After" : "Before"), 9, H3)) : k("", !0),
        p.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[2] || (g[2] = he((S) => a("whole"), ["stop"]))
        }, [
          A(se, {
            name: "file",
            size: 12
          })
        ], 10, z3))
      ], 8, D3)), [
        [O(Et), l]
      ]),
      e.whole && e.whole.error ? (r(), d("p", U3, v(e.whole.error), 1)) : k("", !0),
      !p.value && !e.folded ? (r(), d(B, { key: 1 }, [
        e.picture ? (r(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          h("img", {
            src: e.picture,
            alt: m.value,
            loading: "lazy"
          }, null, 8, G3)
        ], 8, V3)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: R,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: D,
            class: "diff-card-diff"
          }, [
            h("div", K3, [
              (r(!0), d(B, null, Z(P.value, (S, T) => (r(), d("div", {
                key: T,
                class: X(["diff-row", S.line_type, { fresh: e.fresh && S.edit === e.fresh }])
              }, [
                h("span", Y3, v(Q(S)), 1),
                h("span", Q3, v(u[S.line_type]), 1),
                h("span", X3, v(W(S)), 1)
              ], 2))), 128)),
              I.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[4] || (g[4] = he((S) => C.value = !0, ["stop"]))
              }, v(I.value) + " more " + v(I.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, zI = /* @__PURE__ */ U(J3, [["__scopeId", "data-v-543e1e74"]]), Z3 = {
  instant: "Hooks, journal commands and viewer requests. Each takes 1 slot.",
  short: "Reads, searches, edits and git. Each takes 1 slot.",
  long: "Tests, builds, checks, installs and plugins. A test, a build or a check takes 4 slots, an install 2."
}, eS = { "test run": "test", "version control": "git", package: "install", "background job": "job" }, Ru = (e) => `${e[0].toUpperCase()}${e.slice(1)}`, Lu = (e) => `${Ru(e.lane)} lane`, Nu = (e) => eS[e] || e.split(" ").at(-1), Zs = (e) => e === 0 ? "no slot" : e === 1 ? "1 slot" : `${e} slots`, pn = (e) => e.halt_type === "command", tS = {
  class: "tiles",
  "data-queue-controls": ""
}, nS = ["data-queue-tile", "onClick"], aS = {
  key: 0,
  class: "chip"
}, sS = {
  key: 1,
  class: "chip"
}, oS = { "data-queue-tile-use": "" }, lS = {
  __name: "ProcessQueueControls",
  props: { lanes: { type: Array, required: !0 } },
  setup(e) {
    function t(n, a) {
      n.currentTarget.closest("[data-test-queue]").querySelector(`[data-lane="${a.lane}"]`).scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return (n, a) => (r(), d("div", tS, [
      (r(!0), d(B, null, Z(e.lanes, (s) => (r(), d("button", {
        key: s.lane,
        type: "button",
        class: "tile",
        "data-queue-tile": s.lane,
        onClick: (o) => t(o, s)
      }, [
        h("small", null, [
          H(v(O(Ru)(s.lane)), 1),
          O(pn)(s) ? (r(), d("span", aS, "Paused")) : s.halted ? (r(), d("span", sS, "Held")) : k("", !0)
        ]),
        h("b", oS, [
          H(v(s.used), 1),
          h("span", null, " of " + v(s.capacity), 1)
        ]),
        h("span", {
          class: X(["meter", { warn: s.halted, bad: !s.halted && s.over_capacity }])
        }, [
          h("i", {
            style: pe({ width: `${Math.min(100, s.used / s.capacity * 100)}%` })
          }, null, 4)
        ], 2),
        h("span", {
          class: X(["sub", { on: s.waiting.length }]),
          "data-queue-tile-waiting": ""
        }, v(s.waiting.length ? `${s.waiting.length} waiting` : "Nothing waits"), 3)
      ], 8, nS))), 128))
    ]));
  }
}, iS = /* @__PURE__ */ U(lS, [["__scopeId", "data-v-b55ad746"]]), rS = ["data-queue-row", "data-queue-process"], uS = ["aria-expanded"], cS = { class: "run-line" }, dS = { class: "leading" }, fS = {
  key: 0,
  "data-queue-position": ""
}, mS = ["title"], hS = { class: "command" }, pS = {
  class: "time",
  "data-queue-time": ""
}, vS = { class: "details" }, gS = { "data-queue-lane": "" }, yS = { "data-queue-type": "" }, bS = { class: "failed" }, kS = { class: "drop-inner" }, wS = { class: "output" }, $S = { class: "output-heading" }, xS = ["title"], SS = ["title"], MS = ["href"], _S = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(), o = Ur((y) => n.read([...y, "--limit", "50"]), () => n.run.id), l = o.lines, i = Ao(), u = M(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = M(() => {
      const y = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!y) return "";
      const w = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, x = Math.max(0, Math.floor((w - new Date(y).getTime()) / 1e3));
      return x < 60 ? `${x} s` : x < 3600 ? `${Math.floor(x / 60)} m ${x % 60} s` : `${Math.floor(x / 3600)} h ${String(Math.floor(x / 60) % 60).padStart(2, "0")} m`;
    }), f = M(() => n.run.section === "waiting" || !n.run.started_at ? "" : ln(n.run.started_at, i.value * 1e3)), m = M(() => n.run.section === "waiting" ? "Waiting for" : n.run.ended_at ? "Ran for" : "Running for");
    async function p() {
      if (!n.expanded) return;
      const y = s.value, w = y.scrollHeight - y.scrollTop - y.clientHeight < 2;
      await o.follow(), await Re(), n.expanded && w && (y.scrollTop = y.scrollHeight);
    }
    async function b() {
      n.expanded && (await o.newest(), await Re(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    const $ = () => ({
      head: Mn(n.run.line, 40),
      items: [
        { label: n.expanded ? "Hide output" : "Show output", group: "open", run: () => a("toggle") },
        { label: "Copy command", group: "copy", run: ({ say: y }) => Ft(n.run.line, "the command", y) },
        { label: "Open its task", group: "copy", disabled: !n.run.task_id, reason: "No task", run: () => Ze("tasks", n.run.task_id) }
      ]
    });
    return ce(() => n.expanded, b, { immediate: !0 }), qn(["output.*"], p, (y) => $i(y, /* @__PURE__ */ new Set([n.run.id]))), (y, w) => ge((r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      h("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: w[2] || (w[2] = (x) => a("toggle")),
        onKeydown: [
          w[3] || (w[3] = ze(he((x) => a("toggle"), ["prevent"]), ["enter"])),
          w[4] || (w[4] = ze(he((x) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", cS, [
          h("span", dS, [
            e.run.section === "waiting" ? (r(), d("span", fS, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: X(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, mS))
          ]),
          h("code", hS, v(e.run.line), 1),
          h("span", pS, v(c.value), 1),
          A(se, {
            class: X(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", vS, [
          e.run.lane ? (r(), d(B, { key: 0 }, [
            h("span", gS, v(O(Lu)(e.run)), 1),
            w[6] || (w[6] = h("span", { class: "separator" }, "·", -1))
          ], 64)) : k("", !0),
          h("span", yS, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(B, { key: 1 }, [
            w[7] || (w[7] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: w[0] || (w[0] = he((x) => O(Ze)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(B, { key: 2 }, [
            w[8] || (w[8] = h("span", { class: "separator" }, "·", -1)),
            w[9] || (w[9] = h("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(B, { key: 3 }, [
            w[10] || (w[10] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: w[1] || (w[1] = he((x) => O(Ze)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(B, { key: 4 }, [
            w[11] || (w[11] = h("span", { class: "separator" }, "·", -1)),
            h("span", bS, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, uS),
      h("div", {
        class: X(["drop", { open: e.expanded }])
      }, [
        h("div", kS, [
          h("div", wS, [
            h("div", $S, [
              h("span", null, [
                H("Output " + v(e.run.id), 1),
                e.run.task_id ? (r(), d(B, { key: 0 }, [
                  H(" · Task " + v(e.run.task_id), 1)
                ], 64)) : k("", !0),
                f.value ? (r(), d(B, { key: 1 }, [
                  w[12] || (w[12] = H(" · ", -1)),
                  h("span", {
                    class: "started",
                    "data-queue-started": "",
                    title: O(Ds)(e.run.started_at)
                  }, "Started " + v(f.value), 9, xS)
                ], 64)) : k("", !0),
                c.value ? (r(), d(B, { key: 2 }, [
                  w[13] || (w[13] = H(" · ", -1)),
                  h("span", {
                    title: m.value,
                    "data-queue-duration": ""
                  }, v(c.value), 9, SS)
                ], 64)) : k("", !0)
              ]),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, MS)
            ]),
            h("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: w[5] || (w[5] = (x) => e.expanded && O(o).loadEarlier(x.target))
            }, [
              w[14] || (w[14] = h("span", { class: "prompt" }, "$ ", -1)),
              H(v(e.run.line), 1),
              O(l).length ? (r(), d(B, { key: 0 }, [
                H(v(`
` + O(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, rS)), [
      [O(Et), $]
    ]);
  }
}, CS = /* @__PURE__ */ U(_S, [["__scopeId", "data-v-f528b4c6"]]), qu = ["instant", "short", "long"], Du = ["background", "normal", "agent", "reserved", "immediate"], ES = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function Pu(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const AS = ["data-class-row"], OS = { scope: "row" }, TS = { key: 0 }, IS = ["value"], BS = ["value"], RS = { class: "actions" }, LS = ["disabled"], NS = ["disabled"], qS = { class: "actions" }, DS = ["disabled"], PS = ["disabled"], jS = ["disabled"], FS = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...Pu(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", OS, [
        H(v(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", TS, v(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : k("", !0)
      ]),
      s.value ? (r(), d(B, { key: 0 }, [
        h("td", null, [
          ge(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(B, null, Z(O(qu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, IS))), 128))
          ], 512), [
            [Pt, o.value.lane]
          ])
        ]),
        h("td", null, [
          ge(h("input", {
            "onUpdate:modelValue": f[1] || (f[1] = (m) => o.value.cost = m),
            type: "number",
            min: "0",
            "aria-label": "Slots",
            "data-class-cost": ""
          }, null, 512), [
            [
              Fe,
              o.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", null, [
          ge(h("select", {
            "onUpdate:modelValue": f[2] || (f[2] = (m) => o.value.priority = m),
            "aria-label": "Priority",
            "data-class-priority": ""
          }, [
            (r(!0), d(B, null, Z(O(Du), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, BS))), 128))
          ], 512), [
            [Pt, o.value.priority]
          ])
        ]),
        h("td", null, [
          ge(h("input", {
            "onUpdate:modelValue": f[3] || (f[3] = (m) => o.value.limit = m),
            type: "number",
            min: "0",
            "aria-label": "At once, 0 for no limit",
            "data-class-limit": ""
          }, null, 512), [
            [
              Fe,
              o.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", RS, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, LS),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, NS)
        ])
      ], 64)) : (r(), d(B, { key: 1 }, [
        h("td", null, v(e.entry.lane), 1),
        h("td", null, v(e.entry.cost), 1),
        h("td", null, v(e.entry.priority), 1),
        h("td", null, v(e.entry.limit || "no limit"), 1),
        h("td", qS, [
          h("span", {
            class: X(["origin", { own: e.entry.origin !== "built-in" }])
          }, v(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, DS),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, PS)) : k("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, jS)) : k("", !0)
        ])
      ], 64))
    ], 8, AS));
  }
}, WS = /* @__PURE__ */ U(FS, [["__scopeId", "data-v-20ea89e6"]]), HS = { class: "fields" }, zS = ["disabled"], US = ["disabled"], VS = ["value"], GS = ["value"], KS = { class: "buttons" }, YS = ["disabled"], QS = ["disabled"], XS = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, JS = { key: 1 }, ZS = {
  key: 1,
  class: "hint"
}, e6 = {
  key: 2,
  class: "failure",
  role: "alert"
}, t6 = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = E(null), l = E(""), i = M(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    ce(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...Pu(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: he(c, ["prevent"])
    }, [
      h("div", HS, [
        h("label", null, [
          m[7] || (m[7] = H("Name", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (p) => s.value.name = p),
            required: "",
            "data-class-name": ""
          }, null, 512), [
            [
              Fe,
              s.value.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[8] || (m[8] = H("Line pattern", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (p) => s.value.pattern = p),
            placeholder: "for example ^npm run e2e",
            disabled: !!s.value.plugin,
            "data-class-pattern": ""
          }, null, 8, zS), [
            [Fe, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = H("Or plugin", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, US), [
            [
              Fe,
              s.value.plugin,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[10] || (m[10] = H("Lane", -1)),
          ge(h("select", {
            "onUpdate:modelValue": m[3] || (m[3] = (p) => s.value.lane = p)
          }, [
            (r(!0), d(B, null, Z(O(qu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, VS))), 128))
          ], 512), [
            [Pt, s.value.lane]
          ])
        ]),
        h("label", null, [
          m[11] || (m[11] = H("Slots", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[4] || (m[4] = (p) => s.value.cost = p),
            type: "number",
            min: "0"
          }, null, 512), [
            [
              Fe,
              s.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[12] || (m[12] = H("Priority", -1)),
          ge(h("select", {
            "onUpdate:modelValue": m[5] || (m[5] = (p) => s.value.priority = p)
          }, [
            (r(!0), d(B, null, Z(O(Du), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, GS))), 128))
          ], 512), [
            [Pt, s.value.priority]
          ])
        ]),
        h("label", null, [
          m[13] || (m[13] = H("At once", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[6] || (m[6] = (p) => s.value.limit = p),
            type: "number",
            min: "0",
            title: "0 for no limit"
          }, null, 512), [
            [
              Fe,
              s.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      h("div", KS, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, YS),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, QS)
      ]),
      o.value !== null ? (r(), d("div", XS, [
        o.value.length ? (r(), d(B, { key: 0 }, [
          h("p", null, v(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(B, null, Z(o.value, (p) => (r(), d("code", { key: p }, v(p), 1))), 128))
        ], 64)) : (r(), d("p", JS, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", ZS, "See which recent lines the class would match before you add it.")) : k("", !0),
      l.value ? (r(), d("p", e6, v(l.value), 1)) : k("", !0)
    ], 32));
  }
}, n6 = /* @__PURE__ */ U(t6, [["__scopeId", "data-v-6e42f7c8"]]), a6 = { "data-execution-classes": "" }, s6 = ["id"], o6 = ["aria-labelledby"], l6 = ["disabled", "onClick"], i6 = ["data-lane-setting"], r6 = ["disabled", "onClick"], u6 = { class: "control presets" }, c6 = ["disabled", "data-class-preset", "onClick"], d6 = { class: "scroll" }, f6 = { "data-class-table": "" }, m6 = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, h6 = {
  __name: "ExecutionClasses",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = E(null), a = E(""), s = E(!1);
    async function o() {
      const i = await t.read(["queue-class", "list"]);
      i.ok ? n.value = i.value : a.value = i.error;
    }
    async function l(i, u = () => {
    }) {
      if (s.value) return;
      s.value = !0;
      const c = await t.read(i);
      a.value = c.ok ? "" : c.error, s.value = !1, c.ok && (u(), await o());
    }
    return _e(o), (i, u) => (r(), d("section", a6, [
      A(_t, { icon: "gauge" }, {
        default: L(() => [...u[0] || (u[0] = [
          H("Execution classes", -1)
        ])]),
        _: 1
      }),
      u[3] || (u[3] = h("p", { class: "lead" }, "Each run the journal starts belongs to a class, which says its lane, how many slots it takes and its priority.", -1)),
      n.value ? (r(), d(B, { key: 0 }, [
        (r(!0), d(B, null, Z(n.value.settings, (c) => (r(), d("div", {
          key: c.key,
          class: "control"
        }, [
          h("div", null, [
            h("label", {
              id: c.key
            }, v(c.title), 9, s6),
            h("p", null, v(c.description), 1)
          ]),
          h("div", {
            class: "stepper",
            role: "group",
            "aria-labelledby": c.key
          }, [
            h("button", {
              type: "button",
              "aria-label": "One fewer",
              disabled: s.value || c.value <= 1,
              onClick: (f) => l(["setting", "set", c.key, String(c.value - 1)])
            }, "−", 8, l6),
            h("output", {
              "data-lane-setting": c.key
            }, v(c.value), 9, i6),
            h("button", {
              type: "button",
              "aria-label": "One more",
              disabled: s.value,
              onClick: (f) => l(["setting", "set", c.key, String(c.value + 1)])
            }, "+", 8, r6)
          ], 8, o6)
        ]))), 128)),
        h("div", u6, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(B, null, Z(O(ES), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, v(c.title), 9, c6))), 128))
        ]),
        h("div", d6, [
          h("table", f6, [
            u[2] || (u[2] = h("thead", null, [
              h("tr", null, [
                h("th", { scope: "col" }, "Class"),
                h("th", { scope: "col" }, "Lane"),
                h("th", { scope: "col" }, "Slots"),
                h("th", { scope: "col" }, "Priority"),
                h("th", { scope: "col" }, "At once"),
                h("th", { scope: "col" }, [
                  h("span", { class: "hidden" }, "Actions")
                ])
              ])
            ], -1)),
            h("tbody", null, [
              (r(!0), d(B, null, Z(n.value.classes, (c) => (r(), j(WS, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        A(n6, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : k("", !0),
      a.value ? (r(), d("p", m6, v(a.value), 1)) : k("", !0)
    ]));
  }
}, p6 = /* @__PURE__ */ U(h6, [["__scopeId", "data-v-bd3e5ac3"]]), v6 = { "data-queue-settings": "" }, g6 = ["for"], y6 = ["id", "value", "disabled", "onChange"], b6 = {
  key: 0,
  class: "failure",
  role: "alert"
}, k6 = {
  __name: "ProcessQueueSettings",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", v6, [
      (r(!0), d(B, null, Z(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, v(c.title), 9, g6),
          h("p", null, v(c.description), 1)
        ]),
        h("input", {
          id: c.key,
          class: "limit",
          type: "number",
          min: "0",
          value: c.value,
          disabled: s.value,
          "data-queue-suite-limit": "",
          onChange: (f) => l(c.key, f.target.value)
        }, null, 40, y6)
      ]))), 128)),
      o.value ? (r(), d("p", b6, v(o.value), 1)) : k("", !0),
      A(p6, { read: e.read }, null, 8, ["read"])
    ]));
  }
}, w6 = /* @__PURE__ */ U(k6, [["__scopeId", "data-v-1b1c7570"]]), $6 = ["data-lane-entry"], x6 = ["aria-expanded"], S6 = { class: "lead" }, M6 = {
  key: 0,
  "data-lane-position": ""
}, _6 = ["title"], C6 = {
  class: "kind",
  "data-lane-kind": ""
}, E6 = { class: "command" }, A6 = { class: "text" }, O6 = ["title"], T6 = {
  key: 1,
  title: "Waits for a reader"
}, I6 = ["title"], B6 = {
  class: "cost",
  "data-lane-takes": ""
}, R6 = { class: "who" }, L6 = { class: "time" }, N6 = {
  key: 0,
  class: "facts",
  "data-lane-facts": ""
}, q6 = ["href"], D6 = {
  __name: "ExecutionLaneRow",
  props: {
    entry: { type: Object, required: !0 },
    waiting: Boolean,
    position: { type: Number, required: !0 },
    waitCount: { type: Number, required: !0 },
    why: { type: String, required: !0 },
    laneName: { type: String, required: !0 },
    environment: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, n = E(!1), a = M(() => t.entry.reason === "waits for a reader"), s = M(() => [
      ["Class", t.entry.class],
      ["Priority", t.entry.raised_from ? `${t.entry.priority}, moved up from ${t.entry.raised_from} after a long wait` : t.entry.priority],
      ["Started by", t.entry.starter],
      [t.waiting ? "Waiting for" : "Running for", en(t.entry.seconds, !0)],
      ["Takes", Zs(t.entry.slot_cost)],
      ...t.waiting ? [["Place", `${t.position} of ${t.waitCount} in the ${t.laneName.toLowerCase()}`], ["Why it waits", a.value ? "Waits for a reader" : t.why]] : [],
      ...t.entry.parent_line ? [["For", t.entry.parent_line]] : []
    ]);
    return (o, l) => (r(), d("div", {
      class: X(["run", { open: n.value }]),
      "data-lane-entry": e.waiting ? "waiting" : "running"
    }, [
      h("button", {
        type: "button",
        class: "line",
        "aria-expanded": n.value,
        onClick: l[0] || (l[0] = (i) => n.value = !n.value)
      }, [
        h("span", S6, [
          e.waiting ? (r(), d("span", M6, v(e.position), 1)) : (r(), d("span", {
            key: 1,
            class: X(["dot", { free: !e.entry.slot_cost }]),
            title: e.entry.slot_cost ? "In a slot" : "Without a slot"
          }, null, 10, _6))
        ]),
        h("span", C6, v(O(Nu)(e.entry.kind)), 1),
        h("span", E6, [
          h("span", A6, v(e.entry.line), 1),
          e.waiting && e.entry.raised_from ? (r(), d("em", {
            key: 0,
            class: "up",
            title: `Moved up from ${e.entry.raised_from} after a long wait`
          }, "moved up", 8, O6)) : k("", !0),
          a.value ? (r(), d("em", T6, "reader")) : k("", !0),
          e.entry.parent_line ? (r(), d("em", {
            key: 2,
            title: `Runs for ${e.entry.parent_line}`
          }, "for " + v(e.entry.parent_line), 9, I6)) : k("", !0)
        ]),
        h("span", B6, v(O(Zs)(e.entry.slot_cost)), 1),
        h("span", R6, v(e.entry.starter), 1),
        h("span", L6, v(O(en)(e.entry.seconds, !0)), 1),
        A(se, {
          class: "chevron",
          name: "chevronRight",
          facing: "down",
          size: 11
        })
      ], 8, x6),
      n.value ? (r(), d("div", N6, [
        h("dl", null, [
          (r(!0), d(B, null, Z(s.value, ([i, u]) => (r(), d(B, { key: i }, [
            h("dt", null, v(i), 1),
            h("dd", null, v(u), 1)
          ], 64))), 128))
        ]),
        e.entry.run_id ? (r(), d("a", {
          key: 0,
          class: "output",
          href: `?page=processes.output&output=${e.entry.run_id}&environment=${encodeURIComponent(e.environment)}`,
          target: "_blank",
          rel: "noopener",
          "data-lane-output": ""
        }, "Open its output", 8, q6)) : k("", !0)
      ])) : k("", !0)
    ], 10, $6));
  }
}, ni = /* @__PURE__ */ U(D6, [["__scopeId", "data-v-287a0ae3"]]), P6 = ["data-lane", "aria-label"], j6 = { class: "head" }, F6 = {
  class: "use",
  "data-lane-use": ""
}, W6 = {
  key: 0,
  class: "chip warn",
  "data-lane-state": ""
}, H6 = {
  key: 1,
  class: "chip warn",
  "data-lane-state": ""
}, z6 = {
  key: 2,
  class: "chip bad",
  "data-lane-state": ""
}, U6 = { class: "contents" }, V6 = {
  key: 1,
  class: "note",
  role: "status",
  "data-lane-note": ""
}, G6 = ["aria-label"], K6 = ["title", "data-lane-cell"], Y6 = {
  key: 2,
  class: "empty",
  "data-lane-empty": ""
}, Q6 = { class: "sub" }, X6 = {
  key: 0,
  class: "empty"
}, J6 = { class: "sub" }, Z6 = {
  class: "why",
  "data-lane-why": ""
}, eM = {
  key: 0,
  class: "empty"
}, tM = {
  __name: "ExecutionLane",
  props: { lane: { type: Object, required: !0 }, kept: { type: Function, required: !0 }, environment: { type: String, required: !0 }, pausable: Boolean },
  emits: ["pause", "resume"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E(""), l = M(() => Lu(n.lane)), i = M(() => Math.max(0, n.lane.used - n.lane.capacity)), u = M(() => pn(n.lane) ? "The lane is paused" : n.lane.halted ? n.lane.halt_type === "update" ? "The lane is held for an update" : "The lane is held for a restart" : `No room: ${n.lane.used} of ${n.lane.capacity} slots in use`), c = M(() => pn(n.lane) ? "Paused" : n.lane.halted ? "Held" : u.value), f = M(() => n.lane.running.filter(n.kept)), m = M(() => n.lane.waiting.map(($, y) => ({ entry: $, position: y + 1 })).filter(({ entry: $ }) => n.kept($))), p = M(() => {
      let $ = 0;
      return [...n.lane.running.filter((w) => w.slot_cost > 0).map((w, x) => ($ += w.slot_cost, { key: `run:${x}`, cost: w.slot_cost, over: $ > n.lane.capacity, label: w.slot_cost >= 3 ? Nu(w.kind) : "", title: `${w.line} · ${Zs(w.slot_cost)}` })), ...Array.from({ length: Math.max(0, n.lane.capacity - $) }, (w, x) => ({ key: `free:${x}`, cost: 1, free: !0, label: "", title: "Free" }))];
    });
    function b() {
      a("pause", o.value.trim()), s.value = !1, o.value = "";
    }
    return ($, y) => (r(), d("section", {
      class: X(["lane", { stopped: e.lane.halted }]),
      "data-lane": e.lane.lane,
      "aria-label": l.value
    }, [
      h("h3", j6, [
        H(v(l.value) + " ", 1),
        h("span", F6, [
          h("b", null, v(e.lane.used), 1),
          H(" of " + v(e.lane.capacity) + " slots", 1),
          e.lane.waiting.length ? (r(), d(B, { key: 0 }, [
            H(" · " + v(e.lane.waiting.length) + " waiting", 1)
          ], 64)) : k("", !0)
        ]),
        O(pn)(e.lane) ? (r(), d("span", W6, "Paused")) : e.lane.halted ? (r(), d("span", H6, "Held")) : i.value ? (r(), d("span", z6, v(i.value) + " over", 1)) : k("", !0),
        y[6] || (y[6] = h("span", { class: "grow" }, null, -1)),
        e.pausable && O(pn)(e.lane) ? (r(), j(ie, {
          key: 3,
          small: "",
          variant: "primary",
          "data-lane-resume": "",
          onClick: y[0] || (y[0] = (w) => a("resume"))
        }, {
          default: L(() => [...y[4] || (y[4] = [
            H("Resume", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.pausable && !e.lane.halted && !s.value ? (r(), j(ie, {
          key: 4,
          small: "",
          icon: "pause",
          "data-lane-pause": "",
          onClick: y[1] || (y[1] = (w) => s.value = !0)
        }, {
          default: L(() => [...y[5] || (y[5] = [
            H("Pause", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      h("p", U6, v(O(Z3)[e.lane.lane]), 1),
      s.value && !e.lane.halted ? (r(), d("form", {
        key: 0,
        class: "note",
        "data-lane-pause-form": "",
        onSubmit: he(b, ["prevent"])
      }, [
        A(se, {
          name: "pause",
          size: 13
        }),
        ge(h("input", {
          "onUpdate:modelValue": y[2] || (y[2] = (w) => o.value = w),
          class: "reason",
          required: "",
          placeholder: "Why is it paused?",
          "aria-label": "Reason"
        }, null, 512), [
          [Fe, o.value]
        ]),
        A(ie, {
          small: "",
          variant: "primary",
          type: "submit"
        }, {
          default: L(() => [...y[7] || (y[7] = [
            H("Pause", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          small: "",
          onClick: y[3] || (y[3] = (w) => s.value = !1)
        }, {
          default: L(() => [...y[8] || (y[8] = [
            H("Cancel", -1)
          ])]),
          _: 1
        })
      ], 32)) : k("", !0),
      e.lane.halted ? (r(), d("div", V6, [
        A(se, {
          name: "pause",
          size: 13
        }),
        A(At, {
          value: e.lane.halt_type
        }, {
          command: L(() => [
            h("span", null, [
              y[9] || (y[9] = h("b", null, "Paused", -1)),
              e.lane.halt_reason ? (r(), d(B, { key: 0 }, [
                H(" · " + v(e.lane.halt_reason), 1)
              ], 64)) : k("", !0),
              y[10] || (y[10] = H(". No waiting run starts here until it is resumed; what runs goes on.", -1))
            ])
          ]),
          update: L(() => [
            h("span", null, [
              y[11] || (y[11] = h("b", null, "Update: waiting.", -1)),
              H(" The update waits for the running commands to end. Nothing new starts here until it is done; " + v(e.lane.waiting.length ? `the ${e.lane.waiting.length} waiting keep their place` : "nothing waits") + ".", 1)
            ])
          ]),
          restart: L(() => [
            h("span", null, [
              y[12] || (y[12] = h("b", null, "Restart: waiting.", -1)),
              H(" The server is restarting. " + v(e.lane.waiting.length ? `The ${e.lane.waiting.length} waiting keep their place and start once it is back` : "Nothing waits") + ".", 1)
            ])
          ]),
          _: 1
        }, 8, ["value"])
      ])) : k("", !0),
      h("div", {
        class: X(["strip", { fine: e.lane.capacity > 16 }]),
        role: "img",
        "aria-label": `${e.lane.used} of ${e.lane.capacity} slots in use`,
        "data-lane-strip": ""
      }, [
        (r(!0), d(B, null, Z(p.value, (w) => (r(), d("i", {
          key: w.key,
          class: X(["cell", { on: !w.free, over: w.over }]),
          style: pe({ flex: w.cost }),
          title: w.title,
          "data-lane-cell": w.free ? "free" : "run"
        }, v(w.label), 15, K6))), 128))
      ], 10, G6),
      !e.lane.running.length && !e.lane.waiting.length ? (r(), d("p", Y6, "Nothing runs or waits here")) : (r(), d(B, { key: 3 }, [
        h("h4", Q6, [
          y[13] || (y[13] = H("Running ", -1)),
          h("span", null, v(e.lane.running.length), 1)
        ]),
        (r(!0), d(B, null, Z(f.value, (w, x) => (r(), j(ni, {
          key: `run:${x}:${w.line}`,
          entry: w,
          position: x + 1,
          "wait-count": e.lane.waiting.length,
          why: u.value,
          "lane-name": l.value,
          environment: e.environment
        }, null, 8, ["entry", "position", "wait-count", "why", "lane-name", "environment"]))), 128)),
        f.value.length ? k("", !0) : (r(), d("p", X6, v(e.lane.running.length ? "None match the filter" : "Nothing runs"), 1)),
        e.lane.waiting.length ? (r(), d(B, { key: 1 }, [
          h("h4", J6, [
            y[14] || (y[14] = H("Waiting, in the order they start ", -1)),
            h("span", null, v(e.lane.waiting.length), 1),
            h("span", Z6, v(c.value), 1)
          ]),
          (r(!0), d(B, null, Z(m.value, (w) => (r(), j(ni, {
            key: `wait:${w.position}:${w.entry.line}`,
            entry: w.entry,
            waiting: "",
            position: w.position,
            "wait-count": e.lane.waiting.length,
            why: u.value,
            "lane-name": l.value,
            environment: e.environment
          }, null, 8, ["entry", "position", "wait-count", "why", "lane-name", "environment"]))), 128)),
          m.value.length ? k("", !0) : (r(), d("p", eM, "None match the filter"))
        ], 64)) : k("", !0)
      ], 64))
    ], 10, P6));
  }
}, nM = /* @__PURE__ */ U(tM, [["__scopeId", "data-v-63a7296c"]]), aM = {
  class: "lanes",
  "data-execution-lanes": ""
}, sM = { class: "tools" }, oM = {
  class: "sum",
  "data-lanes-count": ""
}, lM = ["value"], iM = ["value"], rM = { "data-lanes-waits": "" }, uM = {
  key: 0,
  class: "empty"
}, cM = {
  key: 1,
  class: "waits"
}, dM = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 }, environment: { type: String, required: !0 }, pausable: Boolean },
  emits: ["pause", "resume"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(""), o = E(""), l = M(() => n.execution.lanes.flatMap((b) => [...b.running, ...b.waiting])), i = M(() => n.execution.lanes.reduce((b, $) => b + $.running.length, 0)), u = M(() => [...new Set(l.value.map((b) => b.class))].sort()), c = M(() => [...new Set(l.value.map((b) => b.starter))].sort()), f = (b) => (!s.value || b.class === s.value) && (!o.value || b.starter === o.value), m = M(() => l.value.filter(f).length), p = M(() => n.execution.waits.filter((b) => b.runs));
    return (b, $) => (r(), d("section", aM, [
      h("div", sM, [
        h("span", oM, [
          H(v(i.value) + " running · " + v(l.value.length - i.value) + " waiting", 1),
          s.value || o.value ? (r(), d(B, { key: 0 }, [
            H(" · showing " + v(m.value) + " of " + v(l.value.length), 1)
          ], 64)) : k("", !0)
        ]),
        h("label", null, [
          $[5] || ($[5] = H("Class ", -1)),
          ge(h("select", {
            "onUpdate:modelValue": $[0] || ($[0] = (y) => s.value = y),
            "data-lanes-class": ""
          }, [
            $[4] || ($[4] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(B, null, Z(u.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, lM))), 128))
          ], 512), [
            [Pt, s.value]
          ])
        ]),
        h("label", null, [
          $[7] || ($[7] = H("Started by ", -1)),
          ge(h("select", {
            "onUpdate:modelValue": $[1] || ($[1] = (y) => o.value = y),
            "data-lanes-starter": ""
          }, [
            $[6] || ($[6] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(B, null, Z(c.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, iM))), 128))
          ], 512), [
            [Pt, o.value]
          ])
        ])
      ]),
      (r(!0), d(B, null, Z(e.execution.lanes, (y) => (r(), j(nM, {
        key: y.lane,
        lane: y,
        kept: f,
        environment: e.environment,
        pausable: e.pausable && y.lane === "long",
        onPause: $[2] || ($[2] = (w) => a("pause", w)),
        onResume: $[3] || ($[3] = (w) => a("resume"))
      }, null, 8, ["lane", "environment", "pausable"]))), 128)),
      h("div", rM, [
        A(_t, { icon: "clock" }, {
          default: L(() => [...$[8] || ($[8] = [
            H("Waits, last hour", -1)
          ])]),
          _: 1
        }),
        p.value.length ? (r(), d("table", cM, [
          $[9] || ($[9] = h("thead", null, [
            h("tr", null, [
              h("th", { scope: "col" }, "Priority"),
              h("th", { scope: "col" }, "Started"),
              h("th", { scope: "col" }, "Longest wait"),
              h("th", { scope: "col" }, "Average wait")
            ])
          ], -1)),
          h("tbody", null, [
            (r(!0), d(B, null, Z(p.value, (y) => (r(), d("tr", {
              key: y.priority
            }, [
              h("td", null, v(y.priority), 1),
              h("td", null, v(y.runs), 1),
              h("td", null, v(O(en)(y.longest_seconds, !0)), 1),
              h("td", null, v(O(en)(y.average_seconds, !0)), 1)
            ]))), 128))
          ])
        ])) : (r(), d("p", uM, "No run started in the last hour."))
      ])
    ]));
  }
}, fM = /* @__PURE__ */ U(dM, [["__scopeId", "data-v-112283a4"]]), mM = {
  class: "process-queue",
  "data-test-queue": ""
}, hM = {
  key: 0,
  class: "lead"
}, pM = { class: "scroll" }, vM = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, gM = {
  key: 0,
  class: "tabs"
}, yM = ["data-queue-empty"], $s = 20, bM = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = [{ key: "queue", label: "Queue" }, { key: "settings", label: "Settings" }], n = e, a = M(() => n.agent ? ["--agent", String(n.agent)] : []), s = E(null), o = E(""), l = E([]), i = E($s), u = E("queue"), c = M(() => {
      var w, x;
      return (((w = s.value) == null ? void 0 : w.recent_total) ?? 0) > (((x = s.value) == null ? void 0 : x.recent.length) ?? 0);
    });
    let f = 0;
    const m = M(() => {
      if (!s.value) return [];
      const w = { type: "recent", heading: n.agent ? "Finished" : "Finished lately", icon: "check", rows: s.value.recent, empty: "None" };
      return (n.agent ? [
        { type: "running", heading: "Running", icon: "start", rows: s.value.running, empty: "None" },
        { type: "waiting", heading: "Waiting", icon: "clock", rows: s.value.waiting, empty: "None" },
        w
      ] : [w]).flatMap((C) => [
        { key: `band:${C.type}`, section: C },
        ...C.rows.length ? C.rows.map((q, P) => ({ key: `run:${q.id}`, run: q, position: P + 1 })) : [{ key: `none:${C.type}`, section: C, empty: !0 }]
      ]);
    });
    function p(w) {
      l.value = l.value.includes(w) ? l.value.filter((x) => x !== w) : [...l.value, w];
    }
    async function b() {
      const w = ++f, x = await n.read([...i.value === $s ? ["queue", "list"] : ["queue", "list", "--recent", String(i.value)], ...a.value]);
      w === f && (o.value = x.ok ? "" : x.error, x.ok && (s.value = x.value));
    }
    async function $(w) {
      const x = await n.read(w);
      o.value = x.ok ? "" : x.error, x.ok && b();
    }
    function y() {
      i.value += $s, b();
    }
    return qn(["process.*", "setting.*"], b), _e(b), (w, x) => (r(), d("article", mM, [
      e.agent ? k("", !0) : (r(), d("p", hM, "Commands from workers wait here for a free slot. Reading and editing never wait.")),
      h("div", pM, [
        o.value ? (r(), d("p", vM, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(B, { key: 1 }, [
          e.agent ? k("", !0) : (r(), d("div", gM, [
            A(Mt, {
              options: t,
              value: u.value,
              "data-queue-tabs": "",
              onPick: x[0] || (x[0] = (C) => u.value = C)
            }, null, 8, ["value"])
          ])),
          !e.agent && u.value === "settings" ? (r(), j(w6, {
            key: 1,
            queue: s.value,
            read: e.read,
            onSaved: b
          }, null, 8, ["queue", "read"])) : (r(), d(B, { key: 2 }, [
            e.agent ? k("", !0) : (r(), j(iS, {
              key: 0,
              lanes: s.value.execution.lanes
            }, null, 8, ["lanes"])),
            e.agent ? k("", !0) : (r(), j(fM, {
              key: 1,
              execution: s.value.execution,
              environment: s.value.environment_name,
              pausable: "",
              onPause: x[1] || (x[1] = (C) => $(["queue", "halt", C])),
              onResume: x[2] || (x[2] = (C) => $(["queue", "resume"]))
            }, null, 8, ["execution", "environment"])),
            A(no, {
              name: "queue",
              tag: "div",
              class: "queue-list"
            }, {
              default: L(() => [
                (r(!0), d(B, null, Z(m.value, (C) => (r(), d(B, {
                  key: C.key
                }, [
                  C.run ? (r(), j(CS, {
                    key: 0,
                    run: C.run,
                    environment: s.value.environment_name,
                    position: C.position,
                    read: e.read,
                    expanded: l.value.includes(C.run.id),
                    onToggle: (q) => p(C.run.id)
                  }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : C.empty ? (r(), d("p", {
                    key: 1,
                    class: "empty",
                    "data-queue-empty": C.section.type
                  }, v(C.section.empty), 9, yM)) : (r(), j(_t, {
                    key: 2,
                    class: "sticky-band",
                    icon: C.section.icon,
                    count: C.section.rows.length,
                    "data-queue-heading": C.section.type
                  }, {
                    default: L(() => [
                      H(v(C.section.heading), 1)
                    ]),
                    _: 2
                  }, 1032, ["icon", "count", "data-queue-heading"]))
                ], 64))), 128))
              ]),
              _: 1
            }),
            c.value ? (r(), d("button", {
              key: 2,
              type: "button",
              class: "older",
              "data-queue-older": "",
              onClick: y
            }, "Show older commands")) : k("", !0)
          ], 64))
        ], 64)) : o.value ? k("", !0) : (r(), j(nt, { key: 2 }))
      ])
    ]));
  }
}, UI = /* @__PURE__ */ U(bM, [["__scopeId", "data-v-a09896b8"]]), kM = ["placeholder"], wM = { class: "actions" }, $M = { class: "error" }, xM = {
  key: 1,
  class: "card closed"
}, SM = { class: "mark" }, MM = { class: "prompt" }, _M = {
  key: 0,
  class: "draft"
}, CM = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ mt({
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
  emits: /* @__PURE__ */ mt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Dt(e, "draft"), l = Dt(e, "error"), i = E(!!l.value), u = E(!1), c = E(!1), f = E(null);
    async function m() {
      var $, y;
      i.value = !0, u.value = !1, await Re(), (y = (($ = f.value) == null ? void 0 : $.querySelector("input")) || f.value) == null || y.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function b() {
      const $ = o.value.trim();
      if (!(!$ || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send($), i.value = !1, u.value = !0;
        } catch (y) {
          o.value = $, l.value = y.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: m }), ($, y) => (r(), d("div", {
      class: X(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: he(b, ["prevent"]),
        onKeydown: ze(p, ["esc"])
      }, [
        ne($.$slots, "who", {}, void 0, !0),
        ge(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (w) => o.value = w),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: y[1] || (y[1] = ze((w) => O(yr)(w, b), ["enter"]))
        }, null, 40, kM), [
          [Fe, o.value]
        ]),
        h("div", wM, [
          h("span", $M, v(l.value), 1),
          A(ie, {
            small: "",
            onClick: p
          }, {
            default: L(() => [...y[3] || (y[3] = [
              H("Cancel", -1)
            ])]),
            _: 1
          }),
          A(ie, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: b
          }, {
            default: L(() => [...y[4] || (y[4] = [
              H("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", xM, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", SM, [
            A(se, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", MM, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", _M, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[2] || (y[2] = (w) => s("show"))
        }, [
          h("span", null, v(O(Yd)(e.count, "comment")), 1),
          A(se, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, EM = /* @__PURE__ */ U(CM, [["__scopeId", "data-v-b68baddd"]]), AM = { wide: 1120 }, OM = /\{([A-Za-z_]\w*)\}/g;
function da(e, t, n = {}) {
  return e.replace(OM, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const TM = (e, t, n, a) => da(e.label, n, { row_id: a, id: a }) || zy(t, n, a), IM = { class: "comment-side-head" }, BM = {
  key: 0,
  class: "comment-none"
}, RM = { key: 0 }, LM = {
  key: 1,
  class: "comment-none"
}, NM = {
  class: "comment",
  "data-comment": ""
}, qM = {
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
    return (t, n) => (r(), d("aside", {
      class: X(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      h("header", IM, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        A(Ia, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", BM, "No comments yet")) : k("", !0),
      (r(!0), d(B, null, Z(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", RM, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", LM, "Revision " + v(a.revision), 1)) : k("", !0),
        h("p", NM, v(e.words(a)), 1)
      ]))), 128)),
      A(Bn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, ai = /* @__PURE__ */ U(qM, [["__scopeId", "data-v-276284a3"]]), DM = {
  __name: "InspectorBack",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(ie, {
      variant: "icon",
      title: "Back",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: L(() => [
        A(se, {
          name: "back",
          size: 13
        })
      ]),
      _: 1
    }));
  }
}, PM = { class: "resource-heading" }, jM = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, FM = {
  key: 1,
  class: "resource-abstract"
}, WM = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", PM, [
      e.title ? (r(), d("h2", jM, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", FM, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, ju = /* @__PURE__ */ U(WM, [["__scopeId", "data-v-172f09ac"]]), HM = {
  class: "inspector-head",
  "data-inspector-head": ""
}, zM = { class: "inspector-icons" }, UM = { class: "inspector-icons-start" }, VM = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, GM = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, KM = { class: "inspector-icons-end" }, YM = ["href"], QM = {
  __name: "InspectorHead",
  props: {
    label: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    backed: Boolean,
    stepped: Boolean,
    embedded: Boolean,
    shareable: Boolean,
    readOnly: Boolean,
    opened: { type: Object, required: !0 }
  },
  emits: ["close", "back", "step"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => `${n.opened.table}:${n.opened.id}`), o = M(() => n.shareable && !n.readOnly), l = M(() => !n.label && !!n.title), i = M(() => n.backed ? "Close all rows" : "Close");
    return (u, c) => (r(), d("header", HM, [
      h("div", zM, [
        h("span", UM, [
          e.backed ? (r(), j(DM, {
            key: 0,
            onBack: c[0] || (c[0] = (f) => a("back"))
          })) : k("", !0),
          e.stepped ? (r(), d(B, { key: 1 }, [
            A(ie, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: L(() => [
                A(se, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            A(ie, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: L(() => [
                A(se, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        l.value ? (r(), d("h2", VM, v(e.title), 1)) : (r(), d("p", GM, v(e.label), 1)),
        h("span", KM, [
          e.embedded ? (r(), j(ie, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => O(Pe)(s.value))
          }, {
            default: L(() => [
              A(se, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          o.value ? (r(), d("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this link",
            "aria-label": "Share this link",
            "data-resource-share": "",
            href: O(Xm)(s.value)
          }, [
            A(se, {
              name: "share",
              size: 13
            })
          ], 8, YM)) : k("", !0),
          e.embedded ? k("", !0) : (r(), j(ie, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: L(() => [
              A(se, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(ju, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, XM = /* @__PURE__ */ U(QM, [["__scopeId", "data-v-48e6812e"]]), JM = {
  class: "section field-grid",
  "data-resource-fields": ""
}, ZM = { class: "field-name" }, e_ = {
  key: 1,
  class: "field-value"
}, t_ = ["onClick"], n_ = {
  key: 2,
  class: "field-value"
}, a_ = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", JM, [
      (r(!0), d(B, null, Z(e.fields, (o) => (r(), d(B, {
        key: o.name
      }, [
        h("p", ZM, v(o.label), 1),
        o.isTime ? (r(), j(Ye, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", e_, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, t_)
        ])) : (r(), d("p", n_, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, Fu = /* @__PURE__ */ U(a_, [["__scopeId", "data-v-7e45afb5"]]), s_ = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, o_ = {
  key: 1,
  class: "inspector-wait"
}, l_ = { class: "inspector-main" }, i_ = { class: "inspector-column" }, r_ = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, u_ = {
  class: "inspector-body",
  "data-inspector-body": ""
}, c_ = { class: "inspector-text" }, d_ = ["innerHTML"], f_ = {
  __name: "Inspector",
  props: {
    term: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    catalogue: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    table: { type: String, default: "" },
    readOnly: Boolean,
    backed: Boolean,
    stepped: Boolean,
    embedded: Boolean
  },
  emits: ["close", "back", "step", "open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null);
    to(Si, M(() => {
      var V;
      return ((V = s.value) == null ? void 0 : V.$el) ?? null;
    }));
    const o = /* @__PURE__ */ new Set(["question", "memory", "rule"]), l = M(() => n.catalogue.inspector(n.term) ?? {
      reads: `${n.term} show {row_id}`,
      label: "",
      title: "{title}",
      description: "",
      width: "small",
      components: [],
      comments: !1,
      events: [],
      links: { categories: [], open: !1, excludes_plan: !1, page_size: 10 },
      shareable: !1,
      lists_fields: !0,
      draws_text: !1
    }), i = E(null), u = E(""), c = E(""), f = E(""), m = E("details"), p = E(null), b = E(0);
    let $ = 0;
    const y = M(() => ({ row_id: n.id, id: n.id })), w = M(() => i.value ? da(l.value.title, i.value, y.value) || Hy(n.term, i.value, n.id) : ""), x = M(() => i.value ? TM(l.value, n.term, i.value, n.id) : ""), C = M(() => x.value === w.value ? "" : x.value), q = M(() => i.value ? da(l.value.description, i.value, y.value) : ""), P = M(() => {
      var V, J, ee;
      return ((V = i.value) == null ? void 0 : V.body) || ((J = i.value) == null ? void 0 : J.brief) || (o.has(n.term) ? (ee = i.value) == null ? void 0 : ee.text : "") || "";
    }), I = M(() => P.value ? ko(P.value, { env: "", rowNames: !1 }) : ""), Q = M(() => Gy(i.value, P.value, u.value, c.value)), W = M(() => l.value.comments && b.value >= AM.wide), R = M(() => l.value.comments && !W.value), D = (V) => l.value.components.filter((J) => (J.tab || "") === V).map((J) => J.window), G = M(() => [...new Set(l.value.components.map((V) => V.tab).filter(Boolean))]), _ = M(() => G.value.length || R.value ? [{ key: "details", label: "Details" }, ...G.value.map((V) => ({ key: V, label: V })), ...R.value ? [{ key: "comments", label: "Comments" }] : []] : []), g = M(() => {
      const V = l.value.links;
      return V ? { categories: V.categories, open: V.open, outsidePlan: V.excludes_plan, pageSize: V.page_size } : null;
    }), S = Er(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (V) => n.read(V));
    async function T() {
      const V = ++$, J = await n.read(da(l.value.reads, null, y.value).split(/\s+/).filter(Boolean));
      if (V !== $ || (f.value = J.ok ? "" : J.error, !J.ok)) return;
      i.value = J.value;
      const ee = await kr(n.read, i.value);
      V === $ && (u.value = ee.creator, c.value = ee.owner);
    }
    ce(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", T();
    }, { immediate: !0 }), qn(l.value.events, T), ce(S.open, (V) => V && R.value && (m.value = "comments"));
    let N = null;
    return _e(() => {
      var V;
      b.value = ((V = p.value) == null ? void 0 : V.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (N = new ResizeObserver(() => b.value = p.value.clientWidth), N.observe(p.value));
    }), Te(() => N == null ? void 0 : N.disconnect()), (V, J) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(XM, {
        label: C.value,
        title: w.value,
        description: q.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: J[0] || (J[0] = (ee) => a("close")),
        onBack: J[1] || (J[1] = (ee) => a("back")),
        onStep: J[2] || (J[2] = (ee) => a("step", ee))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", s_, v(f.value), 1)) : i.value ? (r(), d(B, { key: 2 }, [
        A(Ws, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: L(() => [
            A(go, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: T
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", l_, [
          h("div", i_, [
            _.value.length ? (r(), d("div", r_, [
              A(Mt, {
                options: _.value,
                value: m.value,
                onPick: J[3] || (J[3] = (ee) => m.value = ee)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            h("div", u_, [
              A(At, { value: m.value }, {
                details: L(() => [
                  h("div", c_, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, d_)) : k("", !0),
                    l.value.lists_fields ? (r(), j(Fu, {
                      key: 1,
                      fields: Q.value,
                      onPeek: J[4] || (J[4] = (ee) => a("open", ee))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  A(js, {
                    "slot-name": `inspector.${e.term}`,
                    names: D(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: L(() => [
                  A(ai, {
                    below: "",
                    comments: O(S).comments.value,
                    words: O(S).words,
                    more: !!O(S).nextPage.value,
                    loading: O(S).loading.value,
                    failure: O(S).failure.value,
                    onMore: O(S).loadMore,
                    onClose: J[5] || (J[5] = (ee) => m.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: L(() => [
                  A(js, {
                    names: D(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              g.value ? (r(), j(Mo, Ne({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, g.value, {
                onOpen: J[6] || (J[6] = (ee) => a("open", ee))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), j(EM, {
              key: 1,
              send: O(S).send,
              count: O(S).total.value,
              onShow: J[7] || (J[7] = (ee) => R.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          W.value ? (r(), j(ai, {
            key: 0,
            comments: O(S).comments.value,
            words: O(S).words,
            more: !!O(S).nextPage.value,
            loading: O(S).loading.value,
            failure: O(S).failure.value,
            onMore: O(S).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (r(), d("div", o_, [
        A(nt)
      ]))
    ], 512));
  }
}, m_ = /* @__PURE__ */ U(f_, [["__scopeId", "data-v-60363e95"]]), VI = {
  __name: "HostedInspector",
  props: {
    term: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    environment: { type: String, required: !0 },
    stepped: Boolean,
    embedded: Boolean,
    readOnly: Boolean
  },
  emits: ["step", "open", "close", "back"],
  setup(e) {
    const t = $e(Ta);
    return (n, a) => (r(), j(m_, Ne(n.$props, {
      catalogue: O(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, h_ = { class: "facts" }, p_ = { class: "fact wide" }, v_ = ["title"], g_ = {
  key: 1,
  class: "fact-value"
}, y_ = {
  key: 0,
  class: "fact"
}, b_ = { class: "fact-value" }, k_ = { class: "fact" }, w_ = { class: "fact-label" }, $_ = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, x_ = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, S_ = {
  key: 2,
  class: "fact"
}, M_ = { class: "fact-value" }, __ = { class: "fact wide" }, C_ = { class: "fact-label" }, E_ = { class: "fact wide" }, A_ = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, O_ = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ya.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", h_, [
        h("div", p_, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => O(Pe)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, v_)) : (r(), d("span", g_, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", y_, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", b_, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(B, { key: 1 }, [
          h("div", k_, [
            h("span", w_, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(xn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: O(xo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => O(Pe)(`agents:${e.task.helper_id}`))
            }, {
              default: L(() => [
                A(Qt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          O(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", $_, [
            A(Qt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = H(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", x_, [
            A(Qt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = H(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", S_, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", M_, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        h("div", __, [
          h("span", C_, [
            i[9] || (i[9] = H(" Complexity ", -1)),
            A(Ni, {
              lines: O(Lr).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Mt, {
            options: O(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", E_, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          A(Mt, {
            options: O(n),
            value: String(O(Rr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", A_, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, T_ = /* @__PURE__ */ U(O_, [["__scopeId", "data-v-4bf27961"]]);
function I_(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const B_ = { class: "number" }, R_ = { class: "title" }, L_ = { class: "word" }, N_ = {
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
    return (a, s) => (r(), j(Je(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: X(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: L(() => [
        A(Ra, { status: e.status }, null, 8, ["status"]),
        h("span", B_, v(e.number), 1),
        h("span", R_, v(e.title), 1),
        h("span", L_, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, xs = /* @__PURE__ */ U(N_, [["__scopeId", "data-v-f6417ae8"]]), q_ = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, D_ = { class: "level" }, P_ = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1);
    ce(() => n.task.id, () => s.value = !1);
    const o = M(() => I_(n.task.id, n.graph)), l = M(() => s.value ? o.value.above : o.value.above.slice(-1)), i = M(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = M(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: Sn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", q_, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(B, null, Z(l.value, (b) => (r(), d(B, {
        key: b.map(($) => $.id).join()
      }, [
        h("div", D_, [
          (r(!0), d(B, null, Z(b, ($) => (r(), j(xs, Ne({
            key: $.id,
            ref_for: !0
          }, f($), {
            onSelect: p[0] || (p[0] = (y) => a("select", y))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(xs, bt(ci(f(e.task, !0))), null, 16),
      (r(!0), d(B, null, Z(i.value, (b) => (r(), d(B, {
        key: b.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        A(xs, Ne({ ref_for: !0 }, f(b), {
          onSelect: p[1] || (p[1] = ($) => a("select", $))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (b) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, j_ = /* @__PURE__ */ U(P_, [["__scopeId", "data-v-79c52417"]]), F_ = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, W_ = ["datetime"], H_ = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", F_, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(B, null, Z(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, W_),
        h("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, z_ = /* @__PURE__ */ U(H_, [["__scopeId", "data-v-b41f213b"]]), U_ = {
  class: "part",
  "data-resource-waits": ""
}, V_ = ["onClick"], G_ = { class: "wait-id" }, K_ = { class: "wait-title" }, Y_ = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", U_, [
      h("h4", null, v(e.title), 1),
      (r(!0), d(B, null, Z(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(Ra, {
          status: O(Sn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", G_, v(o.id), 1),
        h("span", K_, v(o.title), 1)
      ], 8, V_))), 128))
    ]));
  }
}, si = /* @__PURE__ */ U(Y_, [["__scopeId", "data-v-8fb2e251"]]), Q_ = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, X_ = { class: "text" }, J_ = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, Z_ = 180, eC = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = E(!1), l = M(() => a.task.waits.filter((u) => !n.has(u.state))), i = M(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(B, null, [
      l.value.length ? (r(), j(si, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", Q_, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", X_, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", J_, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: X(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > Z_ && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), j(si, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, tC = /* @__PURE__ */ U(eC, [["__scopeId", "data-v-4a3f1e79"]]), nC = {
  class: "task-details",
  "data-task-details": ""
}, aC = { class: "since" }, sC = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, oC = { class: "text" }, lC = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, iC = {
  key: 1,
  class: "note"
}, rC = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, uC = { class: "text" }, cC = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", nC, [
        h("div", {
          class: X(["state-line", O(Sn)(e.task.state)])
        }, [
          h("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(Ra, {
              status: O(Sn)(e.task.state)
            }, null, 8, ["status"]),
            H(" " + v(a(e.task.state)), 1)
          ]),
          h("span", aC, [
            o[5] || (o[5] = H(" since ", -1)),
            A(Ye, {
              at: O(Oh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", sC, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", oC, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", lC, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", iC, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", rC, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", uC, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), j(j_, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        A(T_, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(tC, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(z_, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, GI = /* @__PURE__ */ U(cC, [["__scopeId", "data-v-7e73fa21"]]), dC = 50, fC = { messages: 25 }, mC = (e) => fC[e] || dC, hC = {
  class: "task-log",
  "aria-label": "Task log"
}, pC = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, vC = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, gC = { class: "entries" }, yC = ["data-task-log-important"], bC = ["datetime"], kC = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, wC = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = E([]), a = E(1), s = E(!0), o = E(!0), l = E("");
    let i = 0;
    async function u(c = 1) {
      const f = ++i;
      a.value = c, o.value = !0, l.value = "";
      const m = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(mC("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = m.ok ? "" : m.error, m.ok && (n.value = m.value.rows, s.value = m.value.is_last_page));
    }
    return ce(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), tt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", hC, [
      o.value ? (r(), j(nt, { key: 0 })) : l.value ? (r(), d(B, { key: 1 }, [
        h("p", pC, v(l.value), 1),
        A(ie, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (m) => u(a.value))
        }, {
          default: L(() => [...f[3] || (f[3] = [
            H("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(B, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", vC, "No log entries yet.")),
        h("ol", gC, [
          (r(!0), d(B, null, Z(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: X(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, v(new Date(m.created_at).toLocaleString()), 9, bC),
            h("p", null, v(m.line), 1)
          ], 10, yC))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", kC, [
          A(ie, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (m) => u(a.value - 1))
          }, {
            default: L(() => [...f[4] || (f[4] = [
              H("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          h("span", null, "Page " + v(a.value), 1),
          A(ie, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (m) => u(a.value + 1))
          }, {
            default: L(() => [...f[5] || (f[5] = [
              H("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, KI = /* @__PURE__ */ U(wC, [["__scopeId", "data-v-cfa43bf1"]]);
function $C(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ss = { exports: {} }, oi;
function xC() {
  return oi || (oi = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, Q) {
        var W = 236, R = 17, D = I, G = o[Q], _ = null, g = 0, S = null, T = [], N = {}, V = function(z, K) {
          g = D * 4 + 17, _ = (function(F) {
            for (var Y = new Array(F), te = 0; te < F; te += 1) {
              Y[te] = new Array(F);
              for (var ae = 0; ae < F; ae += 1)
                Y[te][ae] = null;
            }
            return Y;
          })(g), J(0, 0), J(g - 7, 0), J(0, g - 7), le(), oe(), xe(z, K), D >= 7 && ke(z), S == null && (S = cn(D, G, T)), He(S, K);
        }, J = function(z, K) {
          for (var F = -1; F <= 7; F += 1)
            if (!(z + F <= -1 || g <= z + F))
              for (var Y = -1; Y <= 7; Y += 1)
                K + Y <= -1 || g <= K + Y || (0 <= F && F <= 6 && (Y == 0 || Y == 6) || 0 <= Y && Y <= 6 && (F == 0 || F == 6) || 2 <= F && F <= 4 && 2 <= Y && Y <= 4 ? _[z + F][K + Y] = !0 : _[z + F][K + Y] = !1);
        }, ee = function() {
          for (var z = 0, K = 0, F = 0; F < 8; F += 1) {
            V(!0, F);
            var Y = i.getLostPoint(N);
            (F == 0 || z > Y) && (z = Y, K = F);
          }
          return K;
        }, oe = function() {
          for (var z = 8; z < g - 8; z += 1)
            _[z][6] == null && (_[z][6] = z % 2 == 0);
          for (var K = 8; K < g - 8; K += 1)
            _[6][K] == null && (_[6][K] = K % 2 == 0);
        }, le = function() {
          for (var z = i.getPatternPosition(D), K = 0; K < z.length; K += 1)
            for (var F = 0; F < z.length; F += 1) {
              var Y = z[K], te = z[F];
              if (_[Y][te] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? _[Y + ae][te + de] = !0 : _[Y + ae][te + de] = !1;
            }
        }, ke = function(z) {
          for (var K = i.getBCHTypeNumber(D), F = 0; F < 18; F += 1) {
            var Y = !z && (K >> F & 1) == 1;
            _[Math.floor(F / 3)][F % 3 + g - 8 - 3] = Y;
          }
          for (var F = 0; F < 18; F += 1) {
            var Y = !z && (K >> F & 1) == 1;
            _[F % 3 + g - 8 - 3][Math.floor(F / 3)] = Y;
          }
        }, xe = function(z, K) {
          for (var F = G << 3 | K, Y = i.getBCHTypeInfo(F), te = 0; te < 15; te += 1) {
            var ae = !z && (Y >> te & 1) == 1;
            te < 6 ? _[te][8] = ae : te < 8 ? _[te + 1][8] = ae : _[g - 15 + te][8] = ae;
          }
          for (var te = 0; te < 15; te += 1) {
            var ae = !z && (Y >> te & 1) == 1;
            te < 8 ? _[8][g - te - 1] = ae : te < 9 ? _[8][15 - te - 1 + 1] = ae : _[8][15 - te - 1] = ae;
          }
          _[g - 8][8] = !z;
        }, He = function(z, K) {
          for (var F = -1, Y = g - 1, te = 7, ae = 0, de = i.getMaskFunction(K), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var Me = 0; Me < 2; Me += 1)
                if (_[Y][ue - Me] == null) {
                  var Ae = !1;
                  ae < z.length && (Ae = (z[ae] >>> te & 1) == 1);
                  var me = de(Y, ue - Me);
                  me && (Ae = !Ae), _[Y][ue - Me] = Ae, te -= 1, te == -1 && (ae += 1, te = 7);
                }
              if (Y += F, Y < 0 || g <= Y) {
                Y -= F, F = -F;
                break;
              }
            }
        }, Qe = function(z, K) {
          for (var F = 0, Y = 0, te = 0, ae = new Array(K.length), de = new Array(K.length), ue = 0; ue < K.length; ue += 1) {
            var Me = K[ue].dataCount, Ae = K[ue].totalCount - Me;
            Y = Math.max(Y, Me), te = Math.max(te, Ae), ae[ue] = new Array(Me);
            for (var me = 0; me < ae[ue].length; me += 1)
              ae[ue][me] = 255 & z.getBuffer()[me + F];
            F += Me;
            var Ue = i.getErrorCorrectPolynomial(Ae), Ve = c(ae[ue], Ue.getLength() - 1), Ho = Ve.mod(Ue);
            de[ue] = new Array(Ue.getLength() - 1);
            for (var me = 0; me < de[ue].length; me += 1) {
              var zo = me + Ho.getLength() - de[ue].length;
              de[ue][me] = zo >= 0 ? Ho.getAt(zo) : 0;
            }
          }
          for (var Uo = 0, me = 0; me < K.length; me += 1)
            Uo += K[me].totalCount;
          for (var ja = new Array(Uo), Hn = 0, me = 0; me < Y; me += 1)
            for (var ue = 0; ue < K.length; ue += 1)
              me < ae[ue].length && (ja[Hn] = ae[ue][me], Hn += 1);
          for (var me = 0; me < te; me += 1)
            for (var ue = 0; ue < K.length; ue += 1)
              me < de[ue].length && (ja[Hn] = de[ue][me], Hn += 1);
          return ja;
        }, cn = function(z, K, F) {
          for (var Y = f.getRSBlocks(z, K), te = m(), ae = 0; ae < F.length; ae += 1) {
            var de = F[ae];
            te.put(de.getMode(), 4), te.put(de.getLength(), i.getLengthInBits(de.getMode(), z)), de.write(te);
          }
          for (var ue = 0, ae = 0; ae < Y.length; ae += 1)
            ue += Y[ae].dataCount;
          if (te.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + te.getLengthInBits() + ">" + ue * 8 + ")";
          for (te.getLengthInBits() + 4 <= ue * 8 && te.put(0, 4); te.getLengthInBits() % 8 != 0; )
            te.putBit(!1);
          for (; !(te.getLengthInBits() >= ue * 8 || (te.put(W, 8), te.getLengthInBits() >= ue * 8)); )
            te.put(R, 8);
          return Qe(te, Y);
        };
        N.addData = function(z, K) {
          K = K || "Byte";
          var F = null;
          switch (K) {
            case "Numeric":
              F = p(z);
              break;
            case "Alphanumeric":
              F = b(z);
              break;
            case "Byte":
              F = $(z);
              break;
            case "Kanji":
              F = y(z);
              break;
            default:
              throw "mode:" + K;
          }
          T.push(F), S = null;
        }, N.isDark = function(z, K) {
          if (z < 0 || g <= z || K < 0 || g <= K)
            throw z + "," + K;
          return _[z][K];
        }, N.getModuleCount = function() {
          return g;
        }, N.make = function() {
          if (D < 1) {
            for (var z = 1; z < 40; z++) {
              for (var K = f.getRSBlocks(z, G), F = m(), Y = 0; Y < T.length; Y++) {
                var te = T[Y];
                F.put(te.getMode(), 4), F.put(te.getLength(), i.getLengthInBits(te.getMode(), z)), te.write(F);
              }
              for (var ae = 0, Y = 0; Y < K.length; Y++)
                ae += K[Y].dataCount;
              if (F.getLengthInBits() <= ae * 8)
                break;
            }
            D = z;
          }
          V(!1, ee());
        }, N.createTableTag = function(z, K) {
          z = z || 2, K = typeof K > "u" ? z * 4 : K;
          var F = "";
          F += '<table style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: " + K + "px;", F += '">', F += "<tbody>";
          for (var Y = 0; Y < N.getModuleCount(); Y += 1) {
            F += "<tr>";
            for (var te = 0; te < N.getModuleCount(); te += 1)
              F += '<td style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: 0px;", F += " width: " + z + "px;", F += " height: " + z + "px;", F += " background-color: ", F += N.isDark(Y, te) ? "#000000" : "#ffffff", F += ";", F += '"/>';
            F += "</tr>";
          }
          return F += "</tbody>", F += "</table>", F;
        }, N.createSvgTag = function(z, K, F, Y) {
          var te = {};
          typeof arguments[0] == "object" && (te = arguments[0], z = te.cellSize, K = te.margin, F = te.alt, Y = te.title), z = z || 2, K = typeof K > "u" ? z * 4 : K, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-description" : null, Y = typeof Y == "string" ? { text: Y } : Y || {}, Y.text = Y.text || null, Y.id = Y.text ? Y.id || "qrcode-title" : null;
          var ae = N.getModuleCount() * z + K * 2, de, ue, Me, Ae, me = "", Ue;
          for (Ue = "l" + z + ",0 0," + z + " -" + z + ",0 0,-" + z + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += te.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', me += ' viewBox="0 0 ' + ae + " " + ae + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += Y.text || F.text ? ' role="img" aria-labelledby="' + ve([Y.id, F.id].join(" ").trim()) + '"' : "", me += ">", me += Y.text ? '<title id="' + ve(Y.id) + '">' + ve(Y.text) + "</title>" : "", me += F.text ? '<description id="' + ve(F.id) + '">' + ve(F.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', Me = 0; Me < N.getModuleCount(); Me += 1)
            for (Ae = Me * z + K, de = 0; de < N.getModuleCount(); de += 1)
              N.isDark(Me, de) && (ue = de * z + K, me += "M" + ue + "," + Ae + Ue);
          return me += '" stroke="transparent" fill="black"/>', me += "</svg>", me;
        }, N.createDataURL = function(z, K) {
          z = z || 2, K = typeof K > "u" ? z * 4 : K;
          var F = N.getModuleCount() * z + K * 2, Y = K, te = F - K;
          return P(F, F, function(ae, de) {
            if (Y <= ae && ae < te && Y <= de && de < te) {
              var ue = Math.floor((ae - Y) / z), Me = Math.floor((de - Y) / z);
              return N.isDark(Me, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, N.createImgTag = function(z, K, F) {
          z = z || 2, K = typeof K > "u" ? z * 4 : K;
          var Y = N.getModuleCount() * z + K * 2, te = "";
          return te += "<img", te += ' src="', te += N.createDataURL(z, K), te += '"', te += ' width="', te += Y, te += '"', te += ' height="', te += Y, te += '"', F && (te += ' alt="', te += ve(F), te += '"'), te += "/>", te;
        };
        var ve = function(z) {
          for (var K = "", F = 0; F < z.length; F += 1) {
            var Y = z.charAt(F);
            switch (Y) {
              case "<":
                K += "&lt;";
                break;
              case ">":
                K += "&gt;";
                break;
              case "&":
                K += "&amp;";
                break;
              case '"':
                K += "&quot;";
                break;
              default:
                K += Y;
                break;
            }
          }
          return K;
        }, ye = function(z) {
          var K = 1;
          z = typeof z > "u" ? K * 2 : z;
          var F = N.getModuleCount() * K + z * 2, Y = z, te = F - z, ae, de, ue, Me, Ae, me = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ue = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ve = "";
          for (ae = 0; ae < F; ae += 2) {
            for (ue = Math.floor((ae - Y) / K), Me = Math.floor((ae + 1 - Y) / K), de = 0; de < F; de += 1)
              Ae = "█", Y <= de && de < te && Y <= ae && ae < te && N.isDark(ue, Math.floor((de - Y) / K)) && (Ae = " "), Y <= de && de < te && Y <= ae + 1 && ae + 1 < te && N.isDark(Me, Math.floor((de - Y) / K)) ? Ae += " " : Ae += "█", Ve += z < 1 && ae + 1 >= te ? Ue[Ae] : me[Ae];
            Ve += `
`;
          }
          return F % 2 && z > 0 ? Ve.substring(0, Ve.length - F - 1) + Array(F + 1).join("▀") : Ve.substring(0, Ve.length - 1);
        };
        return N.createASCII = function(z, K) {
          if (z = z || 1, z < 2)
            return ye(K);
          z -= 1, K = typeof K > "u" ? z * 2 : K;
          var F = N.getModuleCount() * z + K * 2, Y = K, te = F - K, ae, de, ue, Me, Ae = Array(z + 1).join("██"), me = Array(z + 1).join("  "), Ue = "", Ve = "";
          for (ae = 0; ae < F; ae += 1) {
            for (ue = Math.floor((ae - Y) / z), Ve = "", de = 0; de < F; de += 1)
              Me = 1, Y <= de && de < te && Y <= ae && ae < te && N.isDark(ue, Math.floor((de - Y) / z)) && (Me = 0), Ve += Me ? Ae : me;
            for (ue = 0; ue < z; ue += 1)
              Ue += Ve + `
`;
          }
          return Ue.substring(0, Ue.length - 1);
        }, N.renderTo2dContext = function(z, K) {
          K = K || 2;
          for (var F = N.getModuleCount(), Y = 0; Y < F; Y++)
            for (var te = 0; te < F; te++)
              z.fillStyle = N.isDark(Y, te) ? "black" : "white", z.fillRect(Y * K, te * K, K, K);
        }, N;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var Q = [], W = 0; W < I.length; W += 1) {
            var R = I.charCodeAt(W);
            Q.push(R & 255);
          }
          return Q;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, Q) {
        var W = (function() {
          for (var D = C(I), G = function() {
            var oe = D.read();
            if (oe == -1) throw "eof";
            return oe;
          }, _ = 0, g = {}; ; ) {
            var S = D.read();
            if (S == -1) break;
            var T = G(), N = G(), V = G(), J = String.fromCharCode(S << 8 | T), ee = N << 8 | V;
            g[J] = ee, _ += 1;
          }
          if (_ != Q)
            throw _ + " != " + Q;
          return g;
        })(), R = 63;
        return function(D) {
          for (var G = [], _ = 0; _ < D.length; _ += 1) {
            var g = D.charCodeAt(_);
            if (g < 128)
              G.push(g);
            else {
              var S = W[D.charAt(_)];
              typeof S == "number" ? (S & 255) == S ? G.push(S) : (G.push(S >>> 8), G.push(S & 255)) : G.push(R);
            }
          }
          return G;
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
      }, i = (function() {
        var I = [
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
        ], Q = 1335, W = 7973, R = 21522, D = {}, G = function(_) {
          for (var g = 0; _ != 0; )
            g += 1, _ >>>= 1;
          return g;
        };
        return D.getBCHTypeInfo = function(_) {
          for (var g = _ << 10; G(g) - G(Q) >= 0; )
            g ^= Q << G(g) - G(Q);
          return (_ << 10 | g) ^ R;
        }, D.getBCHTypeNumber = function(_) {
          for (var g = _ << 12; G(g) - G(W) >= 0; )
            g ^= W << G(g) - G(W);
          return _ << 12 | g;
        }, D.getPatternPosition = function(_) {
          return I[_ - 1];
        }, D.getMaskFunction = function(_) {
          switch (_) {
            case l.PATTERN000:
              return function(g, S) {
                return (g + S) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, S) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, S) {
                return S % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, S) {
                return (g + S) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, S) {
                return (Math.floor(g / 2) + Math.floor(S / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, S) {
                return g * S % 2 + g * S % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, S) {
                return (g * S % 2 + g * S % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, S) {
                return (g * S % 3 + (g + S) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + _;
          }
        }, D.getErrorCorrectPolynomial = function(_) {
          for (var g = c([1], 0), S = 0; S < _; S += 1)
            g = g.multiply(c([1, u.gexp(S)], 0));
          return g;
        }, D.getLengthInBits = function(_, g) {
          if (1 <= g && g < 10)
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
          else if (g < 27)
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
          else if (g < 41)
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
            throw "type:" + g;
        }, D.getLostPoint = function(_) {
          for (var g = _.getModuleCount(), S = 0, T = 0; T < g; T += 1)
            for (var N = 0; N < g; N += 1) {
              for (var V = 0, J = _.isDark(T, N), ee = -1; ee <= 1; ee += 1)
                if (!(T + ee < 0 || g <= T + ee))
                  for (var oe = -1; oe <= 1; oe += 1)
                    N + oe < 0 || g <= N + oe || ee == 0 && oe == 0 || J == _.isDark(T + ee, N + oe) && (V += 1);
              V > 5 && (S += 3 + V - 5);
            }
          for (var T = 0; T < g - 1; T += 1)
            for (var N = 0; N < g - 1; N += 1) {
              var le = 0;
              _.isDark(T, N) && (le += 1), _.isDark(T + 1, N) && (le += 1), _.isDark(T, N + 1) && (le += 1), _.isDark(T + 1, N + 1) && (le += 1), (le == 0 || le == 4) && (S += 3);
            }
          for (var T = 0; T < g; T += 1)
            for (var N = 0; N < g - 6; N += 1)
              _.isDark(T, N) && !_.isDark(T, N + 1) && _.isDark(T, N + 2) && _.isDark(T, N + 3) && _.isDark(T, N + 4) && !_.isDark(T, N + 5) && _.isDark(T, N + 6) && (S += 40);
          for (var N = 0; N < g; N += 1)
            for (var T = 0; T < g - 6; T += 1)
              _.isDark(T, N) && !_.isDark(T + 1, N) && _.isDark(T + 2, N) && _.isDark(T + 3, N) && _.isDark(T + 4, N) && !_.isDark(T + 5, N) && _.isDark(T + 6, N) && (S += 40);
          for (var ke = 0, N = 0; N < g; N += 1)
            for (var T = 0; T < g; T += 1)
              _.isDark(T, N) && (ke += 1);
          var xe = Math.abs(100 * ke / g / g - 50) / 5;
          return S += xe * 10, S;
        }, D;
      })(), u = (function() {
        for (var I = new Array(256), Q = new Array(256), W = 0; W < 8; W += 1)
          I[W] = 1 << W;
        for (var W = 8; W < 256; W += 1)
          I[W] = I[W - 4] ^ I[W - 5] ^ I[W - 6] ^ I[W - 8];
        for (var W = 0; W < 255; W += 1)
          Q[I[W]] = W;
        var R = {};
        return R.glog = function(D) {
          if (D < 1)
            throw "glog(" + D + ")";
          return Q[D];
        }, R.gexp = function(D) {
          for (; D < 0; )
            D += 255;
          for (; D >= 256; )
            D -= 255;
          return I[D];
        }, R;
      })();
      function c(I, Q) {
        if (typeof I.length > "u")
          throw I.length + "/" + Q;
        var W = (function() {
          for (var D = 0; D < I.length && I[D] == 0; )
            D += 1;
          for (var G = new Array(I.length - D + Q), _ = 0; _ < I.length - D; _ += 1)
            G[_] = I[_ + D];
          return G;
        })(), R = {};
        return R.getAt = function(D) {
          return W[D];
        }, R.getLength = function() {
          return W.length;
        }, R.multiply = function(D) {
          for (var G = new Array(R.getLength() + D.getLength() - 1), _ = 0; _ < R.getLength(); _ += 1)
            for (var g = 0; g < D.getLength(); g += 1)
              G[_ + g] ^= u.gexp(u.glog(R.getAt(_)) + u.glog(D.getAt(g)));
          return c(G, 0);
        }, R.mod = function(D) {
          if (R.getLength() - D.getLength() < 0)
            return R;
          for (var G = u.glog(R.getAt(0)) - u.glog(D.getAt(0)), _ = new Array(R.getLength()), g = 0; g < R.getLength(); g += 1)
            _[g] = R.getAt(g);
          for (var g = 0; g < D.getLength(); g += 1)
            _[g] ^= u.gexp(u.glog(D.getAt(g)) + G);
          return c(_, 0).mod(D);
        }, R;
      }
      var f = (function() {
        var I = [
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
        ], Q = function(D, G) {
          var _ = {};
          return _.totalCount = D, _.dataCount = G, _;
        }, W = {}, R = function(D, G) {
          switch (G) {
            case o.L:
              return I[(D - 1) * 4 + 0];
            case o.M:
              return I[(D - 1) * 4 + 1];
            case o.Q:
              return I[(D - 1) * 4 + 2];
            case o.H:
              return I[(D - 1) * 4 + 3];
            default:
              return;
          }
        };
        return W.getRSBlocks = function(D, G) {
          var _ = R(D, G);
          if (typeof _ > "u")
            throw "bad rs block @ typeNumber:" + D + "/errorCorrectionLevel:" + G;
          for (var g = _.length / 3, S = [], T = 0; T < g; T += 1)
            for (var N = _[T * 3 + 0], V = _[T * 3 + 1], J = _[T * 3 + 2], ee = 0; ee < N; ee += 1)
              S.push(Q(V, J));
          return S;
        }, W;
      })(), m = function() {
        var I = [], Q = 0, W = {};
        return W.getBuffer = function() {
          return I;
        }, W.getAt = function(R) {
          var D = Math.floor(R / 8);
          return (I[D] >>> 7 - R % 8 & 1) == 1;
        }, W.put = function(R, D) {
          for (var G = 0; G < D; G += 1)
            W.putBit((R >>> D - G - 1 & 1) == 1);
        }, W.getLengthInBits = function() {
          return Q;
        }, W.putBit = function(R) {
          var D = Math.floor(Q / 8);
          I.length <= D && I.push(0), R && (I[D] |= 128 >>> Q % 8), Q += 1;
        }, W;
      }, p = function(I) {
        var Q = s.MODE_NUMBER, W = I, R = {};
        R.getMode = function() {
          return Q;
        }, R.getLength = function(_) {
          return W.length;
        }, R.write = function(_) {
          for (var g = W, S = 0; S + 2 < g.length; )
            _.put(D(g.substring(S, S + 3)), 10), S += 3;
          S < g.length && (g.length - S == 1 ? _.put(D(g.substring(S, S + 1)), 4) : g.length - S == 2 && _.put(D(g.substring(S, S + 2)), 7));
        };
        var D = function(_) {
          for (var g = 0, S = 0; S < _.length; S += 1)
            g = g * 10 + G(_.charAt(S));
          return g;
        }, G = function(_) {
          if ("0" <= _ && _ <= "9")
            return _.charCodeAt(0) - 48;
          throw "illegal char :" + _;
        };
        return R;
      }, b = function(I) {
        var Q = s.MODE_ALPHA_NUM, W = I, R = {};
        R.getMode = function() {
          return Q;
        }, R.getLength = function(G) {
          return W.length;
        }, R.write = function(G) {
          for (var _ = W, g = 0; g + 1 < _.length; )
            G.put(
              D(_.charAt(g)) * 45 + D(_.charAt(g + 1)),
              11
            ), g += 2;
          g < _.length && G.put(D(_.charAt(g)), 6);
        };
        var D = function(G) {
          if ("0" <= G && G <= "9")
            return G.charCodeAt(0) - 48;
          if ("A" <= G && G <= "Z")
            return G.charCodeAt(0) - 65 + 10;
          switch (G) {
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
              throw "illegal char :" + G;
          }
        };
        return R;
      }, $ = function(I) {
        var Q = s.MODE_8BIT_BYTE, W = a.stringToBytes(I), R = {};
        return R.getMode = function() {
          return Q;
        }, R.getLength = function(D) {
          return W.length;
        }, R.write = function(D) {
          for (var G = 0; G < W.length; G += 1)
            D.put(W[G], 8);
        }, R;
      }, y = function(I) {
        var Q = s.MODE_KANJI, W = a.stringToBytesFuncs.SJIS;
        if (!W)
          throw "sjis not supported.";
        (function(G, _) {
          var g = W(G);
          if (g.length != 2 || (g[0] << 8 | g[1]) != _)
            throw "sjis not supported.";
        })("友", 38726);
        var R = W(I), D = {};
        return D.getMode = function() {
          return Q;
        }, D.getLength = function(G) {
          return ~~(R.length / 2);
        }, D.write = function(G) {
          for (var _ = R, g = 0; g + 1 < _.length; ) {
            var S = (255 & _[g]) << 8 | 255 & _[g + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), G.put(S, 13), g += 2;
          }
          if (g < _.length)
            throw "illegal char at " + (g + 1);
        }, D;
      }, w = function() {
        var I = [], Q = {};
        return Q.writeByte = function(W) {
          I.push(W & 255);
        }, Q.writeShort = function(W) {
          Q.writeByte(W), Q.writeByte(W >>> 8);
        }, Q.writeBytes = function(W, R, D) {
          R = R || 0, D = D || W.length;
          for (var G = 0; G < D; G += 1)
            Q.writeByte(W[G + R]);
        }, Q.writeString = function(W) {
          for (var R = 0; R < W.length; R += 1)
            Q.writeByte(W.charCodeAt(R));
        }, Q.toByteArray = function() {
          return I;
        }, Q.toString = function() {
          var W = "";
          W += "[";
          for (var R = 0; R < I.length; R += 1)
            R > 0 && (W += ","), W += I[R];
          return W += "]", W;
        }, Q;
      }, x = function() {
        var I = 0, Q = 0, W = 0, R = "", D = {}, G = function(g) {
          R += String.fromCharCode(_(g & 63));
        }, _ = function(g) {
          if (!(g < 0)) {
            if (g < 26)
              return 65 + g;
            if (g < 52)
              return 97 + (g - 26);
            if (g < 62)
              return 48 + (g - 52);
            if (g == 62)
              return 43;
            if (g == 63)
              return 47;
          }
          throw "n:" + g;
        };
        return D.writeByte = function(g) {
          for (I = I << 8 | g & 255, Q += 8, W += 1; Q >= 6; )
            G(I >>> Q - 6), Q -= 6;
        }, D.flush = function() {
          if (Q > 0 && (G(I << 6 - Q), I = 0, Q = 0), W % 3 != 0)
            for (var g = 3 - W % 3, S = 0; S < g; S += 1)
              R += "=";
        }, D.toString = function() {
          return R;
        }, D;
      }, C = function(I) {
        var Q = I, W = 0, R = 0, D = 0, G = {};
        G.read = function() {
          for (; D < 8; ) {
            if (W >= Q.length) {
              if (D == 0)
                return -1;
              throw "unexpected end of file./" + D;
            }
            var g = Q.charAt(W);
            if (W += 1, g == "=")
              return D = 0, -1;
            if (g.match(/^\s$/))
              continue;
            R = R << 6 | _(g.charCodeAt(0)), D += 6;
          }
          var S = R >>> D - 8 & 255;
          return D -= 8, S;
        };
        var _ = function(g) {
          if (65 <= g && g <= 90)
            return g - 65;
          if (97 <= g && g <= 122)
            return g - 97 + 26;
          if (48 <= g && g <= 57)
            return g - 48 + 52;
          if (g == 43)
            return 62;
          if (g == 47)
            return 63;
          throw "c:" + g;
        };
        return G;
      }, q = function(I, Q) {
        var W = I, R = Q, D = new Array(I * Q), G = {};
        G.setPixel = function(T, N, V) {
          D[N * W + T] = V;
        }, G.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(W), T.writeShort(R), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(W), T.writeShort(R), T.writeByte(0);
          var N = 2, V = g(N);
          T.writeByte(N);
          for (var J = 0; V.length - J > 255; )
            T.writeByte(255), T.writeBytes(V, J, 255), J += 255;
          T.writeByte(V.length - J), T.writeBytes(V, J, V.length - J), T.writeByte(0), T.writeString(";");
        };
        var _ = function(T) {
          var N = T, V = 0, J = 0, ee = {};
          return ee.write = function(oe, le) {
            if (oe >>> le)
              throw "length over";
            for (; V + le >= 8; )
              N.writeByte(255 & (oe << V | J)), le -= 8 - V, oe >>>= 8 - V, J = 0, V = 0;
            J = oe << V | J, V = V + le;
          }, ee.flush = function() {
            V > 0 && N.writeByte(J);
          }, ee;
        }, g = function(T) {
          for (var N = 1 << T, V = (1 << T) + 1, J = T + 1, ee = S(), oe = 0; oe < N; oe += 1)
            ee.add(String.fromCharCode(oe));
          ee.add(String.fromCharCode(N)), ee.add(String.fromCharCode(V));
          var le = w(), ke = _(le);
          ke.write(N, J);
          var xe = 0, He = String.fromCharCode(D[xe]);
          for (xe += 1; xe < D.length; ) {
            var Qe = String.fromCharCode(D[xe]);
            xe += 1, ee.contains(He + Qe) ? He = He + Qe : (ke.write(ee.indexOf(He), J), ee.size() < 4095 && (ee.size() == 1 << J && (J += 1), ee.add(He + Qe)), He = Qe);
          }
          return ke.write(ee.indexOf(He), J), ke.write(V, J), ke.flush(), le.toByteArray();
        }, S = function() {
          var T = {}, N = 0, V = {};
          return V.add = function(J) {
            if (V.contains(J))
              throw "dup key:" + J;
            T[J] = N, N += 1;
          }, V.size = function() {
            return N;
          }, V.indexOf = function(J) {
            return T[J];
          }, V.contains = function(J) {
            return typeof T[J] < "u";
          }, V;
        };
        return G;
      }, P = function(I, Q, W) {
        for (var R = q(I, Q), D = 0; D < Q; D += 1)
          for (var G = 0; G < I; G += 1)
            R.setPixel(G, D, W(G, D));
        var _ = w();
        R.write(_);
        for (var g = x(), S = _.toByteArray(), T = 0; T < S.length; T += 1)
          g.writeByte(S[T]);
        return g.flush(), "data:image/gif;base64," + g;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var l = [], i = 0; i < o.length; i++) {
            var u = o.charCodeAt(i);
            u < 128 ? l.push(u) : u < 2048 ? l.push(
              192 | u >> 6,
              128 | u & 63
            ) : u < 55296 || u >= 57344 ? l.push(
              224 | u >> 12,
              128 | u >> 6 & 63,
              128 | u & 63
            ) : (i++, u = 65536 + ((u & 1023) << 10 | o.charCodeAt(i) & 1023), l.push(
              240 | u >> 18,
              128 | u >> 12 & 63,
              128 | u >> 6 & 63,
              128 | u & 63
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
  })(Ss)), Ss.exports;
}
var SC = xC();
const MC = /* @__PURE__ */ $C(SC), _C = ["width", "height", "viewBox"], CC = ["width", "height"], EC = ["d"], AC = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = M(() => {
      const a = MC(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let i = 0; i < s; i += 1)
          a.isDark(l, i) && o.push(`M${i + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (r(), d("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      h("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, CC),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, EC)
    ], 8, _C));
  }
}, YI = /* @__PURE__ */ U(AC, [["__scopeId", "data-v-489f0852"]]), OC = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: pe({ padding: e.padding })
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, QI = /* @__PURE__ */ U(OC, [["__scopeId", "data-v-47e67f04"]]), TC = {
  class: "list-reader",
  "data-list-reader": ""
}, IC = { class: "list-reader-body" }, BC = {
  key: 0,
  class: "list-reader-group"
}, RC = ["title", "aria-current", "data-row", "onClick"], LC = {
  class: "list-reader-reader",
  "data-reader-pane": ""
}, NC = {
  __name: "ListReaderLayout",
  props: /* @__PURE__ */ mt({
    items: { type: Array, required: !0 },
    listWidth: { type: Number, default: 360 },
    emptyTitle: { type: String, default: "Nothing here yet" },
    pickLine: { type: String, default: "No row chosen" },
    place: { type: Function, default: null },
    // a page that wants its first row read at once, with no row named by the address
    openFirst: { type: Boolean, default: !1 }
  }, {
    chosen: { type: [String, Number], default: null },
    chosenModifiers: {}
  }),
  emits: ["update:chosen"],
  setup(e) {
    const t = e, n = Dt(e, "chosen"), a = M(() => t.items.find((f) => f.id === n.value) ?? null), s = M(() => [...new Set(t.items.map((f) => f.group || ""))]), o = (f) => t.items.filter((m) => (m.group || "") === f);
    function l(f) {
      n.value = f.id, Zm(f.id);
    }
    function i(f) {
      const m = t.items.findIndex((b) => b.id === n.value), p = t.items[Math.min(t.items.length - 1, Math.max(0, m + f))];
      p && l(p);
    }
    const u = { ArrowDown: 1, ArrowUp: -1 };
    function c(f) {
      /^(INPUT|TEXTAREA|SELECT)$/.test(f.target.tagName) || !u[f.key] || (f.preventDefault(), i(u[f.key]));
    }
    return ce(() => t.items.length, () => {
      if (n.value !== null) return;
      const f = t.items.find((m) => String(m.id) === pa.value.row) ?? (t.openFirst ? t.items[0] : void 0);
      f && (n.value = f.id);
    }, { immediate: !0 }), (f, m) => (r(), d("div", TC, [
      ne(f.$slots, "top", {}, void 0, !0),
      h("div", IC, [
        h("div", {
          class: "list-reader-list",
          style: pe({ width: `${e.listWidth}px` }),
          tabindex: "0",
          "aria-label": "List",
          "data-reader-list": "",
          onKeydown: c
        }, [
          e.items.length ? k("", !0) : (r(), j(St, {
            key: 0,
            title: e.emptyTitle
          }, {
            default: L(() => [
              ne(f.$slots, "empty", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["title"])),
          (r(!0), d(B, null, Z(s.value, (p) => (r(), d(B, { key: p }, [
            p ? (r(), d("p", BC, v(p), 1)) : k("", !0),
            (r(!0), d(B, null, Z(o(p), (b) => ge((r(), d("button", {
              key: b.id,
              type: "button",
              class: X(["list-reader-row", { on: b.id === n.value }]),
              title: b.title,
              "aria-current": b.id === n.value,
              "data-reader-row": "",
              "data-row": b.id,
              onClick: ($) => l(b)
            }, [
              A(I2, {
                title: b.title,
                text: b.desc || ""
              }, Ea({ _: 2 }, [
                f.$slots.meta ? {
                  name: "end",
                  fn: L(() => [
                    ne(f.$slots, "meta", { item: b }, void 0, !0)
                  ]),
                  key: "0"
                } : void 0,
                f.$slots.line ? {
                  name: "text",
                  fn: L(() => [
                    ne(f.$slots, "line", { item: b }, void 0, !0)
                  ]),
                  key: "1"
                } : void 0
              ]), 1032, ["title", "text"])
            ], 10, RC)), [
              [O(Et), e.place ? () => e.place(b) : null]
            ])), 128))
          ], 64))), 128))
        ], 36),
        h("div", LC, [
          a.value ? ne(f.$slots, "reader", { item: a.value }, void 0, !0, 0) : e.items.length ? (r(), j(St, {
            key: 1,
            title: e.pickLine
          }, null, 8, ["title"])) : k("", !0)
        ])
      ])
    ]));
  }
}, XI = /* @__PURE__ */ U(NC, [["__scopeId", "data-v-998be0de"]]), qC = {
  class: "reader",
  "data-reader": ""
}, DC = {
  class: "reader-head",
  "data-reader-head": ""
}, PC = { class: "reader-meta" }, jC = {
  key: 0,
  class: "reader-number",
  "data-reader-number": ""
}, FC = { class: "reader-title-line" }, WC = { class: "reader-buttons" }, HC = { class: "reader-body" }, zC = {
  __name: "Reader",
  props: /* @__PURE__ */ mt({
    title: { type: String, required: !0 },
    number: { type: String, default: "" },
    abstract: { type: String, default: "" },
    tabs: { type: Array, default: () => [] },
    facts: { type: Array, default: () => [] }
  }, {
    tab: { type: String, default: "" },
    tabModifiers: {}
  }),
  emits: /* @__PURE__ */ mt(["peek"], ["update:tab"]),
  setup(e, { emit: t }) {
    var u;
    const n = e, a = t, s = Dt(e, "tab");
    s.value || (s.value = ((u = n.tabs[0]) == null ? void 0 : u.key) ?? ""), ce(() => n.tabs.map((c) => c.key).join(), () => {
      var c;
      n.tabs.some((f) => f.key === s.value) || (s.value = ((c = n.tabs[0]) == null ? void 0 : c.key) ?? "");
    });
    const o = M(() => n.tabs.map((c) => ({ key: c.key, label: c.label, count_field: c.count != null ? `count_${c.key}` : "" }))), l = M(() => o.value.find((c) => c.key === s.value) ?? null), i = M(() => Object.fromEntries(n.tabs.filter((c) => c.count != null).map((c) => [`count_${c.key}`, c.count])));
    return (c, f) => (r(), d("article", qC, [
      h("header", DC, [
        h("div", PC, [
          e.number ? (r(), d("span", jC, v(e.number), 1)) : k("", !0),
          ne(c.$slots, "agent", {}, void 0, !0)
        ]),
        h("div", FC, [
          A(ju, {
            title: e.title,
            abstract: e.abstract
          }, null, 8, ["title", "abstract"]),
          h("span", WC, [
            ne(c.$slots, "primary", {}, void 0, !0),
            ne(c.$slots, "actions", {}, void 0, !0)
          ])
        ])
      ]),
      e.tabs.length ? (r(), j(b3, {
        key: 0,
        tabs: o.value,
        active: l.value,
        answer: i.value,
        onChoose: f[0] || (f[0] = (m) => s.value = m.key)
      }, null, 8, ["tabs", "active", "answer"])) : k("", !0),
      h("div", HC, [
        e.facts.length ? (r(), j(Fu, {
          key: 0,
          fields: e.facts,
          onPeek: f[1] || (f[1] = (m) => a("peek", m))
        }, null, 8, ["fields"])) : k("", !0),
        A(M3, { tab: l.value }, {
          default: L(() => [
            ne(c.$slots, "default", { tab: s.value }, void 0, !0)
          ]),
          _: 3
        }, 8, ["tab"])
      ])
    ]));
  }
}, JI = /* @__PURE__ */ U(zC, [["__scopeId", "data-v-4511759f"]]), UC = {
  class: "reader-section",
  "data-reader-section": ""
}, VC = { class: "reader-section-title" }, GC = { class: "reader-section-name" }, KC = {
  __name: "ReaderSection",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", UC, [
      h("h4", VC, [
        h("span", GC, v(e.title), 1),
        ne(t.$slots, "end", {}, void 0, !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ZI = /* @__PURE__ */ U(KC, [["__scopeId", "data-v-ab40cbe5"]]), YC = {
  class: "reader-timeline",
  "data-reader-timeline": ""
}, QC = { class: "reader-timeline-who" }, XC = { class: "reader-timeline-text" }, JC = {
  key: 0,
  class: "reader-timeline-none"
}, ZC = {
  __name: "ReaderTimeline",
  props: { entries: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("ol", YC, [
      (r(!0), d(B, null, Z(e.entries, (a) => (r(), d("li", {
        key: a.id,
        class: "reader-timeline-entry"
      }, [
        h("span", QC, v(a.by), 1),
        A(Ye, {
          class: "reader-timeline-at",
          at: a.at
        }, null, 8, ["at"]),
        h("span", XC, v(a.text), 1)
      ]))), 128)),
      e.entries.length ? k("", !0) : (r(), d("li", JC, "None"))
    ]));
  }
}, eB = /* @__PURE__ */ U(ZC, [["__scopeId", "data-v-312caab5"]]), tB = {
  __name: "ReaderLinks",
  props: { model: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["open"],
  setup(e) {
    const t = $e(Be);
    return (n, a) => (r(), j(Mo, {
      model: e.model,
      id: e.id,
      read: O(t).read,
      open: "",
      onOpen: a[0] || (a[0] = (s) => n.$emit("open", s))
    }, null, 8, ["model", "id", "read"]));
  }
}, eE = {
  class: "page-card",
  "data-page-card": ""
}, tE = { class: "page-card-head" }, nE = {
  key: 0,
  class: "page-card-mark",
  "aria-hidden": "true"
}, aE = { class: "page-card-names" }, sE = ["title"], oE = {
  class: "page-card-state",
  "data-card-state": ""
}, lE = {
  key: 1,
  class: "page-card-corner",
  "data-card-corner": ""
}, iE = ["title"], rE = {
  key: 0,
  class: "page-card-fault",
  role: "alert",
  "data-card-fault": ""
}, uE = {
  class: "page-card-foot",
  "data-card-foot": ""
}, cE = {
  __name: "PageCard",
  props: {
    title: { type: String, required: !0 },
    icon: { type: String, default: "" },
    state: { type: String, default: "" },
    line: { type: String, default: "" },
    fault: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("article", eE, [
      h("header", tE, [
        e.icon ? (r(), d("span", nE, [
          A(se, {
            name: e.icon,
            size: 16
          }, null, 8, ["name"])
        ])) : k("", !0),
        h("span", aE, [
          h("h3", {
            class: "page-card-title",
            title: e.title
          }, v(e.title), 9, sE),
          h("p", oE, v(e.state || "—"), 1)
        ]),
        t.$slots.corner ? (r(), d("span", lE, [
          ne(t.$slots, "corner", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      h("p", {
        class: "page-card-line",
        "data-card-line": "",
        title: e.line
      }, v(e.line || "—"), 9, iE),
      ne(t.$slots, "default", {}, void 0, !0),
      e.fault ? (r(), d("p", rE, v(e.fault), 1)) : k("", !0),
      h("footer", uE, [
        ne(t.$slots, "foot", {}, void 0, !0),
        n[0] || (n[0] = h("span", { class: "page-card-grow" }, null, -1)),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, dE = /* @__PURE__ */ U(cE, [["__scopeId", "data-v-5fb37604"]]), fE = {
  class: "card-page",
  "data-card-page": ""
}, mE = { class: "card-page-body" }, hE = {
  key: 0,
  class: "card-page-group"
}, pE = { class: "card-page-grid" }, vE = {
  __name: "CardPage",
  props: {
    title: { type: String, required: !0 },
    items: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    emptyTitle: { type: String, default: "Nothing here yet" },
    place: { type: Function, default: null }
  },
  setup(e) {
    const t = e, n = E(ba(t.fields)), a = E(""), s = M(() => Pr(t.items, t.fields, n.value, a.value, ["title", "line"])), o = M(() => [...new Set(s.value.map((u) => u.group || ""))]), l = (u) => s.value.filter((c) => (c.group || "") === u), i = () => {
      n.value = ba(t.fields), a.value = "";
    };
    return (u, c) => (r(), d("div", fE, [
      A(K2, {
        title: e.title,
        count: e.items.length
      }, {
        primary: L(() => [
          ne(u.$slots, "primary", {}, void 0, !0)
        ]),
        actions: L(() => [
          ne(u.$slots, "actions", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["title", "count"]),
      A(Wr, {
        modelValue: n.value,
        "onUpdate:modelValue": c[0] || (c[0] = (f) => n.value = f),
        words: a.value,
        "onUpdate:words": c[1] || (c[1] = (f) => a.value = f),
        fields: e.fields,
        rows: e.items,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", mE, [
        s.value.length ? k("", !0) : (r(), j(St, {
          key: 0,
          title: e.items.length ? "No match" : e.emptyTitle
        }, {
          default: L(() => [
            e.items.length ? (r(), j(ie, {
              key: 0,
              small: "",
              onClick: i
            }, {
              default: L(() => [...c[2] || (c[2] = [
                H("Clear", -1)
              ])]),
              _: 1
            })) : ne(u.$slots, "empty", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["title"])),
        (r(!0), d(B, null, Z(o.value, (f) => (r(), d(B, { key: f }, [
          f ? (r(), d("p", hE, v(f), 1)) : k("", !0),
          h("div", pE, [
            (r(!0), d(B, null, Z(l(f), (m) => ge((r(), j(dE, {
              key: m.id,
              title: m.title,
              icon: m.icon,
              state: m.state,
              line: m.line,
              fault: m.fault,
              "data-row": m.id
            }, Ea({
              default: L(() => [
                ne(u.$slots, "card", { item: m }, void 0, !0)
              ]),
              _: 2
            }, [
              u.$slots.corner ? {
                name: "corner",
                fn: L(() => [
                  ne(u.$slots, "corner", { item: m }, void 0, !0)
                ]),
                key: "0"
              } : void 0,
              u.$slots.foot ? {
                name: "foot",
                fn: L(() => [
                  ne(u.$slots, "foot", { item: m }, void 0, !0)
                ]),
                key: "1"
              } : void 0,
              u.$slots["card-actions"] ? {
                name: "actions",
                fn: L(() => [
                  ne(u.$slots, "card-actions", { item: m }, void 0, !0)
                ]),
                key: "2"
              } : void 0
            ]), 1032, ["title", "icon", "state", "line", "fault", "data-row"])), [
              [O(Et), e.place ? () => e.place(m) : null]
            ])), 128))
          ])
        ], 64))), 128))
      ])
    ]));
  }
}, nB = /* @__PURE__ */ U(vE, [["__scopeId", "data-v-803a0502"]]), gE = {
  class: "table-layout",
  "data-table-layout": ""
}, yE = { class: "table-layout-body" }, bE = {
  __name: "TableLayout",
  props: {
    columns: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    empty: { type: String, default: "No match" },
    pick: { type: Function, default: null },
    active: { type: [String, Number], default: "" }
  },
  setup(e) {
    const t = e, n = E(ba(t.fields)), a = E(""), s = M(() => Pr(t.rows, t.fields, n.value, a.value, t.columns.map((f) => f.key))), o = M(() => t.columns.map((f) => f.label)), l = M(() => t.columns.some((f) => f.width) ? t.columns.map((f) => f.width ?? "1fr") : []), i = (f) => f.ref ?? (t.pick && f.mark !== void 0 ? String(f.mark) : ""), u = M(() => s.value.map((f) => ({ cells: t.columns.map((m) => f[m.key] ?? ""), open: i(f), tone: f.tone ?? "", mark: f.mark, active: t.active !== "" && f.mark === t.active }))), c = (f) => t.pick ? t.pick(f) : Pe(f);
    return (f, m) => (r(), d("div", gE, [
      A(Wr, {
        modelValue: n.value,
        "onUpdate:modelValue": m[0] || (m[0] = (p) => n.value = p),
        words: a.value,
        "onUpdate:words": m[1] || (m[1] = (p) => a.value = p),
        fields: e.fields,
        rows: e.rows,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", yE, [
        A(xr, {
          columns: o.value,
          widths: l.value,
          rows: u.value,
          empty: e.empty,
          onOpen: c
        }, null, 8, ["columns", "widths", "rows", "empty"])
      ])
    ]));
  }
}, aB = /* @__PURE__ */ U(bE, [["__scopeId", "data-v-ee2fbabd"]]), kE = ["id", "onUpdate:modelValue", "data-field"], wE = ["value"], $E = ["data-refused"], xE = {
  class: "create-command",
  "data-command-preview": ""
}, SE = {
  key: 0,
  class: "create-refusal",
  role: "alert",
  "data-create-failure": ""
}, ME = { class: "create-actions" }, _E = {
  __name: "CreateDialog",
  props: {
    title: { type: String, required: !0 },
    fields: { type: Array, required: !0 },
    submit: { type: String, default: "Make" },
    // the command line for the values typed so far, shown under the fields
    command: { type: Function, required: !0 },
    // {key: refusal} for the values typed, or nothing when they pass; a refused field keeps its value and says why under it
    check: { type: Function, default: () => ({}) },
    // sends the values; the answer is {ok} or {ok: false, error}
    run: { type: Function, required: !0 }
  },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (b) => b.value ?? (b.kind === "select" ? b.options[0][0] : ""), o = E(Object.fromEntries(n.fields.map((b) => [b.key, s(b)]))), l = E({}), i = E(""), u = E(!1), c = M(() => n.fields.filter((b) => !b.when || b.when(o.value))), f = M(() => c.value.every((b) => !b.required || String(o.value[b.key]).trim())), m = M(() => n.command(o.value));
    async function p() {
      if (u.value || !f.value || (l.value = n.check(o.value) ?? {}, Object.keys(l.value).length)) return;
      u.value = !0;
      const b = await n.run(o.value);
      u.value = !1, i.value = b.ok ? "" : b.error, b.ok && (a("done", o.value), a("close"));
    }
    return (b, $) => (r(), j(sn, {
      padded: "",
      title: e.title,
      fits: "",
      small: "",
      sheet: "",
      onClose: $[1] || ($[1] = (y) => a("close"))
    }, {
      default: L(() => [
        h("form", {
          class: "create-dialog",
          "data-create-dialog": "",
          onSubmit: he(p, ["prevent"])
        }, [
          (r(!0), d(B, null, Z(c.value, (y) => (r(), j(qi, {
            key: y.key,
            label: y.label,
            help: y.help,
            for: `create-${y.key}`
          }, {
            default: L(() => [
              A(At, {
                value: y.kind
              }, {
                select: L(() => [
                  ge(h("select", {
                    id: `create-${y.key}`,
                    "onUpdate:modelValue": (w) => o.value[y.key] = w,
                    "data-field": y.key
                  }, [
                    (r(!0), d(B, null, Z(y.options, ([w, x]) => (r(), d("option", {
                      key: w,
                      value: w
                    }, v(x), 9, wE))), 128))
                  ], 8, kE), [
                    [Pt, o.value[y.key]]
                  ])
                ]),
                slot: L(() => [
                  ne(b.$slots, y.key, {
                    value: o.value[y.key],
                    values: o.value,
                    set: (w) => o.value[y.key] = w
                  }, void 0, !0)
                ]),
                area: L(() => [
                  A(Di, {
                    id: `create-${y.key}`,
                    value: o.value[y.key],
                    placeholder: y.placeholder,
                    "data-field": y.key,
                    onInput: (w) => o.value[y.key] = w.target.value
                  }, null, 8, ["id", "value", "placeholder", "data-field", "onInput"])
                ]),
                default: L(() => [
                  A(W2, {
                    id: `create-${y.key}`,
                    type: y.kind === "password" ? "password" : y.kind === "number" ? "number" : "text",
                    "model-value": String(o.value[y.key]),
                    placeholder: y.placeholder,
                    "data-field": y.key,
                    "onUpdate:modelValue": (w) => o.value[y.key] = w
                  }, null, 8, ["id", "type", "model-value", "placeholder", "data-field", "onUpdate:modelValue"])
                ]),
                _: 2
              }, 1032, ["value"]),
              l.value[y.key] ? (r(), d("p", {
                key: 0,
                class: "create-refusal",
                role: "alert",
                "data-refused": y.key
              }, v(l.value[y.key]), 9, $E)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["label", "help", "for"]))), 128)),
          h("code", xE, v(m.value), 1),
          i.value ? (r(), d("p", SE, v(i.value), 1)) : k("", !0),
          h("div", ME, [
            A(ie, {
              small: "",
              onClick: $[0] || ($[0] = (y) => a("close"))
            }, {
              default: L(() => [...$[2] || ($[2] = [
                H("Cancel", -1)
              ])]),
              _: 1
            }),
            A(ie, {
              variant: "primary",
              small: "",
              type: "submit",
              disabled: !f.value || u.value,
              busy: u.value,
              "data-create-send": ""
            }, {
              default: L(() => [
                H(v(e.submit), 1)
              ]),
              _: 1
            }, 8, ["disabled", "busy"])
          ])
        ], 32)
      ]),
      _: 3
    }, 8, ["title"]));
  }
}, sB = /* @__PURE__ */ U(_E, [["__scopeId", "data-v-311423f9"]]), CE = ["aria-selected", "data-tab", "onPointerdown", "onAuxclick", "onKeydown"], EE = { class: "pane-tab-label" }, AE = ["aria-label", "onClick"], OE = 1, TE = {
  __name: "EditorTabs",
  props: { tabs: { type: Array, required: !0 }, insertAt: { type: Number, default: -1 }, extra: { type: Function, default: () => [] } },
  emits: ["pick", "close", "grab"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(!1);
    let l = null;
    async function i() {
      o.value = !1, await Re(), s.value && (o.value = s.value.scrollWidth > s.value.clientWidth);
    }
    const u = (f) => f.forEach((m) => a("close", m.key)), c = (f, m) => ({
      head: f.title,
      items: [
        { label: "Close", group: "open", keys: "Del", run: () => a("close", f.key) },
        { label: "Close others", group: "open", disabled: n.tabs.length < 2, reason: "Only tab", run: () => u(n.tabs.filter((p) => p !== f)) },
        { label: "Close to the right", group: "open", disabled: m === n.tabs.length - 1, reason: "None", run: () => u(n.tabs.slice(m + 1)) },
        { label: "Close all", group: "open", run: () => u(n.tabs) },
        ...n.extra(f)
      ]
    });
    return ce(() => n.tabs.map((f) => `${f.title}:${f.count ?? ""}`).join("|"), i), _e(() => {
      i(), !(typeof ResizeObserver > "u") && (l = new ResizeObserver(i), l.observe(s.value));
    }), tt(() => l == null ? void 0 : l.disconnect()), (f, m) => (r(), d("div", {
      class: X(["pane-tabs", { compact: o.value }])
    }, [
      h("div", {
        ref_key: "row",
        ref: s,
        class: "pane-tabs-row",
        role: "tablist"
      }, [
        (r(!0), d(B, null, Z(e.tabs, (p, b) => ge((r(), d("div", {
          key: p.key,
          role: "tab",
          tabindex: "0",
          "aria-selected": p.on,
          class: X([
            "pane-tab",
            {
              on: p.on,
              lifting: p.lifting,
              gone: p.gone,
              "insert-before": e.insertAt === b,
              "insert-after": e.insertAt === e.tabs.length && b === e.tabs.length - 1
            }
          ]),
          "data-tab": p.key,
          onPointerdown: ($) => a("grab", $, p.key),
          onMousedown: m[1] || (m[1] = he(() => {
          }, ["middle", "prevent"])),
          onAuxclick: ($) => $.button === OE && (a("close", p.key), $.preventDefault()),
          onKeydown: [
            ze(he(($) => a("pick", p.key), ["prevent"]), ["enter"]),
            ze(he(($) => a("pick", p.key), ["prevent"]), ["space"]),
            ze(he(($) => a("close", p.key), ["prevent"]), ["delete"])
          ]
        }, [
          A(Ct, {
            name: p.icon
          }, null, 8, ["name"]),
          h("span", EE, v(p.title), 1),
          p.count !== void 0 ? (r(), d("span", {
            key: 0,
            class: X(["pane-tab-n", { hot: p.hot }])
          }, v(p.count), 3)) : k("", !0),
          h("button", {
            type: "button",
            class: "pane-tab-x",
            tabindex: "-1",
            "aria-label": `Close ${p.title}`,
            onPointerdown: m[0] || (m[0] = he(() => {
            }, ["stop"])),
            onClick: he(($) => a("close", p.key), ["stop"])
          }, [
            A(se, {
              name: "x",
              size: 10
            })
          ], 40, AE)
        ], 42, CE)), [
          [O(Et), () => c(p, b)]
        ])), 128))
      ], 512),
      ne(f.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, oB = /* @__PURE__ */ U(TE, [["__scopeId", "data-v-6b328f63"]]), IE = { class: "text-list" }, BE = { class: "text-number" }, RE = ["value", "aria-label", "placeholder", "onInput"], LE = { class: "text-moves" }, NE = {
  __name: "TextList",
  props: {
    items: { type: Array, required: !0 },
    kind: { type: String, default: "item" },
    noun: { type: String, default: "Item" },
    placeholder: { type: String, default: "" },
    addLabel: { type: String, default: "Add one" },
    // the last one cannot be removed while the list must not be empty
    keepOne: { type: Boolean, default: !0 }
  },
  emits: ["items"],
  setup(e, { emit: t }) {
    const n = e, a = t;
    function s(i, u) {
      a("items", n.items.map((c, f) => f === i ? u : c));
    }
    function o(i, u) {
      const c = [...n.items], [f] = c.splice(i, 1);
      c.splice(i + u, 0, f), a("items", c);
    }
    const l = (i) => a("items", n.items.filter((u, c) => c !== i));
    return (i, u) => (r(), d(B, null, [
      h("ol", IE, [
        (r(!0), d(B, null, Z(e.items, (c, f) => (r(), d("li", {
          key: f,
          class: "text-card"
        }, [
          h("span", BE, v(f + 1), 1),
          h("textarea", bt({
            value: c,
            rows: "2",
            "aria-label": `${e.noun} ${f + 1}`,
            placeholder: e.placeholder,
            [`data-${e.kind}-text` || ""]: "",
            onInput: (m) => s(f, m.target.value)
          }), null, 16, RE),
          h("div", LE, [
            A(ie, bt({
              small: "",
              disabled: f === 0,
              "aria-label": `Move ${e.noun.toLowerCase()} ${f + 1} up`,
              [`data-${e.kind}-up` || ""]: "",
              onClick: (m) => o(f, -1)
            }), {
              default: L(() => [
                A(se, {
                  name: "up",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"]),
            A(ie, bt({
              small: "",
              disabled: f === e.items.length - 1,
              "aria-label": `Move ${e.noun.toLowerCase()} ${f + 1} down`,
              [`data-${e.kind}-down` || ""]: "",
              onClick: (m) => o(f, 1)
            }), {
              default: L(() => [
                A(se, {
                  name: "down",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"]),
            A(ie, bt({
              small: "",
              disabled: e.keepOne && e.items.length === 1,
              "aria-label": `Remove ${e.noun.toLowerCase()} ${f + 1}`,
              [`data-${e.kind}-remove` || ""]: "",
              onClick: (m) => l(f)
            }), {
              default: L(() => [
                A(se, {
                  name: "trash",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"])
          ])
        ]))), 128))
      ]),
      A(ie, bt({
        small: "",
        bordered: "",
        [`data-${e.kind}-add` || ""]: "",
        onClick: u[0] || (u[0] = (c) => a("items", [...e.items, ""]))
      }), {
        default: L(() => [
          H(v(e.addLabel), 1)
        ]),
        _: 1
      }, 16)
    ], 64));
  }
}, lB = /* @__PURE__ */ U(NE, [["__scopeId", "data-v-432edb9d"]]), iB = {
  __name: "HostedWindow",
  props: { name: { type: String, required: !0 }, options: { type: Object, default: () => ({}) }, environment: { type: String, default: "" } },
  setup(e) {
    const t = e, n = $e(Ta, null), a = t.environment || at().environment;
    return (s, o) => O(n) ? (r(), j(Cr, {
      key: 0,
      name: e.name,
      catalogue: O(n).catalogue,
      subscriptions: O(n).subscriptions,
      environment: O(a),
      prompts: O(n).prompts,
      "shell-read": O(n).shellRead,
      options: e.options
    }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : k("", !0);
  }
}, qE = ["data-comment"], DE = { class: "comment-who" }, PE = { key: 0 }, jE = {
  key: 1,
  class: "badge-quiet",
  "data-comment-outdated": ""
}, FE = { key: 0 }, WE = { class: "comment-text" }, HE = {
  key: 1,
  class: "comment-who comment-reply"
}, zE = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: X(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment": e.comment.id,
      onClick: n[0] || (n[0] = (a) => t.$emit("show"))
    }, [
      h("div", DE, [
        h("span", {
          class: X(["comment-by", { agent: e.comment.agent }])
        }, v(e.comment.by), 3),
        e.comment.at ? (r(), d("span", PE, v(e.comment.at), 1)) : k("", !0),
        e.comment.outdated ? (r(), d("span", jE, "Lines changed")) : k("", !0)
      ]),
      e.comment.quote ? (r(), d("blockquote", FE, v(e.comment.quote), 1)) : k("", !0),
      h("p", WE, v(e.comment.text), 1),
      e.comment.reply ? (r(), d("div", HE, [
        h("span", null, [
          h("b", null, v(e.comment.reply.by), 1),
          H(": " + v(e.comment.reply.text), 1)
        ])
      ])) : k("", !0)
    ], 10, qE));
  }
}, UE = /* @__PURE__ */ U(zE, [["__scopeId", "data-v-390d0c5e"]]), VE = { class: "rail-head" }, GE = { class: "rail-count" }, KE = { class: "rail-list" }, YE = {
  key: 0,
  class: "rail-empty"
}, QE = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, floating: Boolean, empty: { type: String, default: "No comments" } },
  emits: ["show", "close"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: X(["comment-rail", { floating: e.floating }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", VE, [
        n[1] || (n[1] = h("h3", null, "Comments", -1)),
        h("span", GE, v(e.comments.length), 1),
        n[2] || (n[2] = h("span", { class: "rail-grow" }, null, -1)),
        A(ie, {
          small: "",
          title: "Hide",
          "aria-label": "Hide the comments",
          "data-rail-close": "",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        }, {
          default: L(() => [
            A(se, {
              name: "close",
              size: 12
            })
          ]),
          _: 1
        })
      ]),
      h("div", KE, [
        e.comments.length ? k("", !0) : (r(), d("p", YE, v(e.empty), 1)),
        (r(!0), d(B, null, Z(e.comments, (a) => (r(), j(UE, {
          key: a.id,
          comment: a,
          hot: e.hot === a.id,
          onShow: (s) => t.$emit("show", a.id)
        }, null, 8, ["comment", "hot", "onShow"]))), 128))
      ])
    ], 2));
  }
}, rB = /* @__PURE__ */ U(QE, [["__scopeId", "data-v-1c625f14"]]), XE = {
  class: "comment-dock",
  "data-comment-box": ""
}, JE = { class: "comment-box" }, ZE = ["onKeydown"], eA = {
  key: 0,
  class: "box-quote",
  "data-box-quote": ""
}, tA = { class: "box-quote-words" }, nA = { class: "box-actions" }, aA = {
  key: 1,
  class: "box-closed"
}, sA = {
  __name: "CommentBox",
  props: { count: { type: Number, default: 0 }, quote: { type: String, default: "" }, placeholder: { type: String, default: "Comment on this file, or pick lines first" }, sending: Boolean },
  emits: ["send", "show", "clear-quote"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = E(!1), l = E(""), i = E(null);
    ce(() => a.quote, (f) => f && u());
    async function u() {
      var f;
      o.value = !0, await Re(), (f = i.value) == null || f.focus();
    }
    t({ openBox: u });
    function c() {
      const f = l.value.trim();
      !f || a.sending || (s("send", f), l.value = "", o.value = !1);
    }
    return (f, m) => (r(), d("div", XE, [
      h("div", JE, [
        o.value ? (r(), d("form", {
          key: 0,
          class: "box-form",
          onSubmit: he(c, ["prevent"]),
          onKeydown: [
            m[3] || (m[3] = ze(he((p) => o.value = !1, ["stop"]), ["esc"])),
            ze(he(c, ["meta", "prevent"]), ["enter"]),
            ze(he(c, ["ctrl", "prevent"]), ["enter"])
          ]
        }, [
          e.quote ? (r(), d("div", eA, [
            m[5] || (m[5] = h("b", null, "On", -1)),
            h("span", tA, v(e.quote), 1),
            h("button", {
              type: "button",
              class: "box-quote-clear",
              title: "Whole file",
              "aria-label": "Whole file",
              onClick: m[0] || (m[0] = (p) => s("clear-quote"))
            }, [
              A(se, {
                name: "close",
                size: 10
              })
            ])
          ])) : k("", !0),
          ge(h("textarea", {
            ref_key: "field",
            ref: i,
            "onUpdate:modelValue": m[1] || (m[1] = (p) => l.value = p),
            placeholder: "Comment",
            "aria-label": "Comment",
            "data-box-field": ""
          }, null, 512), [
            [Fe, l.value]
          ]),
          h("div", nA, [
            A(ie, {
              small: "",
              onClick: m[2] || (m[2] = (p) => o.value = !1)
            }, {
              default: L(() => [...m[6] || (m[6] = [
                H("Cancel", -1)
              ])]),
              _: 1
            }),
            A(ie, {
              small: "",
              variant: "primary",
              disabled: !l.value.trim() || e.sending,
              "data-box-send": "",
              onClick: c
            }, {
              default: L(() => [...m[7] || (m[7] = [
                H("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ], 40, ZE)) : (r(), d("div", aA, [
          h("button", {
            type: "button",
            class: "box-open",
            "data-box-open": "",
            onClick: u
          }, [
            A(se, {
              name: "chat",
              size: 13
            }),
            h("span", null, v(e.placeholder), 1)
          ]),
          e.count > 0 ? (r(), j(ie, {
            key: 0,
            small: "",
            title: "Comments",
            "aria-label": "Show the comments",
            "data-box-count": "",
            onClick: m[4] || (m[4] = (p) => s("show"))
          }, {
            default: L(() => [
              A(se, {
                name: "chat",
                size: 13
              }),
              H(v(e.count), 1)
            ]),
            _: 1
          })) : k("", !0)
        ]))
      ])
    ]));
  }
}, uB = /* @__PURE__ */ U(sA, [["__scopeId", "data-v-b494c444"]]), cB = Xu(() => import("./VoiceFigure-DyupuxNq.js").then((e) => e.V)), dB = "1.2.0", fB = "3.5";
export {
  Gm as $,
  Oe as A,
  Le as B,
  Na as C,
  pt as D,
  eI as E,
  f8 as F,
  zO as G,
  QT as H,
  Vx as I,
  b8 as J,
  zt as K,
  rA as L,
  qo as M,
  M8 as N,
  y8 as O,
  La as P,
  vT as Q,
  xO as R,
  ua as S,
  wT as T,
  pO as U,
  Ie as V,
  wa as W,
  hO as X,
  mO as Y,
  Vm as Z,
  U as _,
  oO as a,
  DT as a$,
  x8 as a0,
  SO as a1,
  MO as a2,
  Be as a3,
  NO as a4,
  LO as a5,
  jt as a6,
  _O as a7,
  KO as a8,
  KA as a9,
  OT as aA,
  mT as aB,
  Lx as aC,
  JO as aD,
  ZO as aE,
  tI as aF,
  vu as aG,
  kT as aH,
  Pn as aI,
  eO as aJ,
  XA as aK,
  zT as aL,
  jn as aM,
  KT as aN,
  HO as aO,
  hT as aP,
  pT as aQ,
  fT as aR,
  En as aS,
  qt as aT,
  YA as aU,
  M4 as aV,
  cT as aW,
  wO as aX,
  hu as aY,
  tn as aZ,
  un as a_,
  PT as aa,
  VT as ab,
  aO as ac,
  vO as ad,
  gO as ae,
  BO as af,
  RO as ag,
  qO as ah,
  uO as ai,
  Kl as aj,
  CO as ak,
  GO as al,
  oI as am,
  lT as an,
  sT as ao,
  aT as ap,
  DO as aq,
  TO as ar,
  OO as as,
  IO as at,
  bT as au,
  VO as av,
  YO as aw,
  rI as ax,
  yn as ay,
  QO as az,
  N8 as b,
  iI as b$,
  r8 as b0,
  GT as b1,
  ST as b2,
  xT as b3,
  Y4 as b4,
  tu as b5,
  LT as b6,
  UO as b7,
  Pa as b8,
  kt as b9,
  _T as bA,
  IT as bB,
  xt as bC,
  $T as bD,
  BT as bE,
  XO as bF,
  iT as bG,
  eT as bH,
  De as bI,
  WO as bJ,
  RT as bK,
  vI as bL,
  gI as bM,
  VA as bN,
  E4 as bO,
  jO as bP,
  CT as bQ,
  lO as bR,
  sI as bS,
  MT as bT,
  ET as bU,
  AT as bV,
  PO as bW,
  Nx as bX,
  FO as bY,
  nT as bZ,
  aI as b_,
  TT as ba,
  ds as bb,
  or as bc,
  cI as bd,
  mI as be,
  yT as bf,
  HT as bg,
  GA as bh,
  oT as bi,
  dI as bj,
  EO as bk,
  AO as bl,
  dO as bm,
  $O as bn,
  ZA as bo,
  FT as bp,
  iO as bq,
  rO as br,
  fO as bs,
  uT as bt,
  k4 as bu,
  YT as bv,
  g8 as bw,
  cO as bx,
  tO as by,
  rT as bz,
  K4 as c,
  NI as c$,
  JA as c0,
  QA as c1,
  tT as c2,
  hI as c3,
  Wo as c4,
  pI as c5,
  Tu as c6,
  WT as c7,
  bO as c8,
  yO as c9,
  zI as cA,
  UA as cB,
  CA as cC,
  sb as cD,
  ro as cE,
  oB as cF,
  St as cG,
  fM as cH,
  Oo as cI,
  yI as cJ,
  Wr as cK,
  o$ as cL,
  lA as cM,
  rn as cN,
  qi as cO,
  VI as cP,
  iB as cQ,
  f1 as cR,
  Si as cS,
  se as cT,
  Ni as cU,
  b3 as cV,
  bA as cW,
  dB as cX,
  fB as cY,
  XI as cZ,
  I2 as c_,
  S4 as ca,
  nO as cb,
  p8 as cc,
  dT as cd,
  Ro as ce,
  Ox as cf,
  gT as cg,
  bn as ch,
  Xt as ci,
  Oy as cj,
  Qt as ck,
  SA as cl,
  EA as cm,
  xn as cn,
  RI as co,
  ie as cp,
  Am as cq,
  go as cr,
  nB as cs,
  Ia as ct,
  uB as cu,
  UE as cv,
  rB as cw,
  sB as cx,
  tb as cy,
  sn as cz,
  et as d,
  kA as d$,
  Hs as d0,
  FA as d1,
  A5 as d2,
  ut as d3,
  We as d4,
  $t as d5,
  Wt as d6,
  AA as d7,
  RA as d8,
  Mi as d9,
  LA as dA,
  nt as dB,
  Ot as dC,
  m0 as dD,
  tf as dE,
  Xp as dF,
  PA as dG,
  pA as dH,
  At as dI,
  M3 as dJ,
  aB as dK,
  LI as dL,
  j_ as dM,
  GI as dN,
  KI as dO,
  Ra as dP,
  Di as dQ,
  W2 as dR,
  lB as dS,
  Ye as dT,
  cB as dU,
  QI as dV,
  _o as dW,
  CI as dX,
  so as dY,
  v1 as dZ,
  xo as d_,
  vA as da,
  vd as db,
  u5 as dc,
  ya as dd,
  dE as de,
  K2 as df,
  HI as dg,
  wA as dh,
  $A as di,
  xA as dj,
  TA as dk,
  UI as dl,
  YI as dm,
  Co as dn,
  JI as dp,
  tB as dq,
  ZI as dr,
  eB as ds,
  Gd as dt,
  II as du,
  Mk as dv,
  hA as dw,
  HA as dx,
  Fr as dy,
  Mt as dz,
  kO as e,
  iA as e$,
  Pf as e0,
  Zt as e1,
  ln as e2,
  $f as e3,
  Pr as e4,
  FI as e5,
  jI as e6,
  kI as e7,
  uo as e8,
  wf as e9,
  BA as eA,
  _I as eB,
  EI as eC,
  Pe as eD,
  y1 as eE,
  OA as eF,
  yd as eG,
  xI as eH,
  zr as eI,
  MI as eJ,
  fi as eK,
  IA as eL,
  S1 as eM,
  Mn as eN,
  fA as eO,
  x1 as eP,
  Qa as eQ,
  cA as eR,
  Jt as eS,
  fo as eT,
  Sf as eU,
  yA as eV,
  dt as eW,
  mA as eX,
  NA as eY,
  Z8 as eZ,
  bI as e_,
  Oa as ea,
  Ft as eb,
  Ds as ec,
  ba as ed,
  _A as ee,
  WI as ef,
  zA as eg,
  qA as eh,
  $i as ei,
  od as ej,
  ld as ek,
  z$ as el,
  WA as em,
  jA as en,
  SI as eo,
  wp as ep,
  wI as eq,
  $I as er,
  dA as es,
  DI as et,
  $5 as eu,
  Nr as ev,
  Rr as ew,
  eh as ex,
  gA as ey,
  DA as ez,
  b4 as f,
  uA as f0,
  BI as f1,
  pr as f2,
  qI as f3,
  Ur as f4,
  Ci as f5,
  R3 as f6,
  oo as f7,
  AI as f8,
  Ms as f9,
  OI as fa,
  MA as fb,
  TI as fc,
  at as fd,
  Et as fe,
  PI as ff,
  xf as fg,
  uI as g,
  An as h,
  XT as i,
  fI as j,
  JT as k,
  jT as l,
  F8 as m,
  Do as n,
  UT as o,
  sO as p,
  ZT as q,
  Au as r,
  Ou as s,
  Ee as t,
  X4 as u,
  NT as v,
  lI as w,
  qT as x,
  Wn as y,
  nI as z
};
