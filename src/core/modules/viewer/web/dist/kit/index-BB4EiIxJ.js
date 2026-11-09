import { openBlock as r, createElementBlock as d, normalizeStyle as ye, unref as L, renderSlot as ue, createElementVNode as m, normalizeClass as K, Fragment as D, renderList as ne, defineComponent as Jr, Comment as Zr, h as da, cloneVNode as eu, createBlock as F, withCtx as P, createVNode as O, toDisplayString as v, createCommentVNode as b, ref as A, inject as Me, watch as pe, onMounted as _e, onBeforeUnmount as tt, reactive as zt, shallowRef as Je, onUnmounted as Be, useAttrs as fa, computed as C, resolveDynamicComponent as Ve, mergeProps as Pe, useId as qs, resolveDirective as tu, withDirectives as Ze, createTextVNode as V, Teleport as ha, nextTick as je, Transition as Ut, withModifiers as Se, createApp as nu, shallowReactive as au, withKeys as _t, createSlots as Dl, onScopeDispose as ma, useModel as ln, mergeModels as jt, toRef as Ca, vModelText as Xn, resolveComponent as su, provide as Pl, onErrorCaptured as ou, TransitionGroup as Ds, isRef as xo, getCurrentInstance as lu, getCurrentScope as jl, normalizeProps as cs, guardReactiveProps as Fl, vShow as Wl, useSlots as iu, defineAsyncComponent as ru } from "vue";
function Hl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const H = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, uu = 1600, cu = {
  __name: "Shimmer",
  setup(e) {
    const t = Hl(uu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ye(L(t))
    }, null, 4));
  }
}, en = /* @__PURE__ */ H(cu, [["__scopeId", "data-v-6c018b03"]]), du = { class: "skeleton-line" }, fu = 2e3, hu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Hl(fu);
    return (n, a) => (r(), d("span", du, [
      ue(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: K(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(D, null, ne(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: K(["bar", { still: e.still }]),
          style: ye({ ...L(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ H(hu, [["__scopeId", "data-v-484fe8a0"]]), Gt = Jr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Zr);
      return a.length !== 1 ? da(D, { key: n }, a) : a[0].key == null ? eu(a[0], { key: n }) : a[0];
    };
  }
}), mu = ["aria-label"], pu = ["aria-label"], gu = ["aria-label"], vu = ["aria-label"], yu = ["aria-label"], bu = ["aria-label"], ku = ["aria-label"], wu = {
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
    return (u, c) => (r(), F(Gt, { value: e.shape }, {
      messages: P(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(D, null, ne(t, (f) => O(en, {
            key: f.id,
            class: K(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, mu)
      ]),
      older: P(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(t.slice(0, 3), (f) => (r(), F(en, {
            key: f.id,
            class: K(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, pu)
      ]),
      cards: P(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(D, null, ne(n, (h) => O(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, gu)
      ]),
      file: P(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            O(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(D, null, ne(s, (h) => O(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, vu)
      ]),
      page: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          O(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, yu)
      ]),
      text: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, bu)
      ]),
      default: P(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ku)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ye = /* @__PURE__ */ H(wu, [["__scopeId", "data-v-ef519c5f"]]), $u = {
  key: 1,
  class: "empty-state titled"
}, xu = { class: "empty-state-title" }, Su = { class: "empty-state-text" }, Mu = {
  key: 2,
  class: "empty-state"
}, _u = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), F(Ye, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", $u, [
      m("p", xu, v(e.title), 1),
      m("p", Su, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Mu, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, rn = /* @__PURE__ */ H(_u, [["__scopeId", "data-v-b27e89b0"]]), Cu = { class: "fold-group" }, Eu = ["aria-expanded"], Au = { class: "fold-label" }, Ou = {
  key: 0,
  class: "fold-count"
}, Tu = {
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
    return (a, s) => (r(), d("div", Cu, [
      m("button", {
        type: "button",
        class: K(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Au, v(e.label), 1),
        e.count !== "" ? (r(), d("span", Ou, v(e.count), 1)) : b("", !0),
        m("span", {
          class: K(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Eu),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : b("", !0)
    ]));
  }
}, t6 = /* @__PURE__ */ H(Tu, [["__scopeId", "data-v-9ef1865c"]]), Iu = 150, Bu = () => Iu;
function Ps(e, t, n = Bu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function zl(e, t, n) {
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
const Ru = 50, So = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function n6(e) {
  const t = nt().sources.find((n) => n.key === e);
  return t ? ds(t.read, t.events) : ds("", []);
}
function Ul(e, t, n, a, s = () => !1) {
  const o = A([]), l = A(null), i = A(""), u = A(!1), c = performance.now(), f = A(!1), h = A(""), p = A(null), y = /* @__PURE__ */ new Set();
  let k = null;
  function T(g) {
    return s() ? (y.add(g), k ?? (k = new Promise((M) => setTimeout(() => M(S()), Ru)))) : x(g);
  }
  async function S() {
    const g = new Set(y);
    y.clear(), k = null;
    const M = N, E = await t({ ids: [...g].join(","), limit: g.size });
    if (M !== N) return;
    if (!E.ok) return q();
    const R = new Map(E.value.rows.map((U) => [U.id, U]));
    o.value = o.value.flatMap((U) => g.has(U.id) ? R.has(U.id) ? [R.get(U.id)] : [] : [U]);
  }
  async function x(g) {
    const M = N, E = await t({ "before-id": g + 1, limit: 1 });
    if (M !== N) return;
    if (!E.ok) return q();
    const R = E.value.rows.find((U) => U.id === g);
    o.value = R ? o.value.map((U) => U.id === g ? R : U) : o.value.filter((U) => U.id !== g);
  }
  async function B(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((Z) => Z.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((Z) => Z.id === g.row_id)) return T(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return q();
    const E = Math.max(...o.value.map((Z) => Z.id)), R = N, U = await t({ "after-id": E });
    if (R !== N) return;
    if (!U.ok) return q();
    const ee = new Set(o.value.map((Z) => Z.id));
    o.value = [...U.value.rows.filter((Z) => !ee.has(Z.id)), ...o.value];
  }
  async function W() {
    if (!f.value || !o.value.length) return !1;
    const g = N, M = Math.min(...o.value.map((U) => U.id)), E = await t({ "before-id": M });
    if (g !== N) return !1;
    if (!E.ok || !E.value.rows.length) return f.value = !1;
    f.value = So(E.value, n());
    const R = new Set(o.value.map((U) => U.id));
    return o.value = [...o.value, ...E.value.rows.filter((U) => !R.has(U.id))], !0;
  }
  let N = 0;
  function w(g, M) {
    var U, ee;
    const E = g.ok ? e.shared ? [g.value] : ((U = g.value) == null ? void 0 : U.rows) ?? [] : [];
    g.ok && (o.value = M(E)), l.value = g.ok ? g.value : null;
    const R = E.length ? Math.min(...E.map((Z) => Z.id)) : 0;
    g.ok && ((ee = g.value) != null && ee.rows) && !o.value.some((Z) => Z.id < R) && (f.value = !e.shared && So(g.value, n())), i.value = g.ok ? "" : g.error, Ps(c, () => u.value = !0);
  }
  async function z(g) {
    const M = ++N, E = await t({});
    M === N && w(E, g);
  }
  const j = (g) => {
    if (!a() || !g.length) return g;
    const M = Math.min(...g.map((R) => R.id)), E = Math.max(...g.map((R) => R.id));
    return [...o.value.filter((R) => R.id > E), ...g, ...o.value.filter((R) => R.id < M)];
  }, q = () => z(j), _ = (g) => w(g, j), I = () => z((g) => g);
  async function $(g, M = null) {
    const E = await zl(M && { target: o, fields: { value: M(o.value) } }, g, e.run);
    return h.value = E.ok ? "" : E.error, p.value = E.ok ? E.value : null, await q(), E;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: q, loadLatest: I, older: W, act: $, actionFailure: h, answer: p, context: e, heard: B, showFirst: _, pageSize: n };
}
const Lu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ds(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = nt(), l = Ul(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Lu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Nu = 2e3;
function js(e, t, n = Nu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Me(Re, null), u = () => {
    var T;
    return ((T = i == null ? void 0 : i.visible) == null ? void 0 : T.value) === !1;
  }, c = () => document.hidden || u(), f = async (T) => {
    o = !0;
    try {
      await T();
    } catch {
    } finally {
      o = !1;
    }
  }, h = () => f(async () => t() && await e()), p = () => {
    s || c() || (a = setTimeout(
      async () => {
        c() || await h(), p();
      },
      typeof n == "function" ? n() : n
    ));
  }, y = async () => {
    l = !0, await f(e), p();
  }, k = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return y();
      await h(), p();
    }
  };
  pe(() => {
    var T;
    return (T = i == null ? void 0 : i.visible) == null ? void 0 : T.value;
  }, k), _e(async () => {
    document.addEventListener("visibilitychange", k), u() || await y();
  }), tt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", k);
  });
}
const Gl = typeof document < "u" && document.documentElement.classList.contains("phone"), Vl = 120;
var Nl;
const Ea = globalThis[Nl = Symbol.for("journal.pressed")] ?? (globalThis[Nl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function qu(e = 0) {
  const t = Ea.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Ea.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Ea.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function fs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Kl(e = window) {
  if (!fs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    fs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const hs = "journal.stale-build-reload", Du = 'script[type="module"][src*="/assets/index-"]', Mo = (e) => {
  var t;
  return ((t = e.querySelector(Du)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Pu(e = document, t = (a, s) => Ee.quietRead(a, s), n = () => Kl(window)) {
  const a = Mo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Mo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Aa = "";
function ju(e, t = () => Kl(window)) {
  if (!e) return !1;
  const n = !!Aa && Aa !== e;
  return Aa = e, n && t(), n;
}
const Fu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Wu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(hs) === e.message) return !1;
    t.setItem(hs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Hu(e = window.sessionStorage) {
  try {
    e.removeItem(hs);
  } catch {
    return;
  }
}
const zu = 2e3, Uu = 3e4, Ge = zt({ starting: !1, external: !1, late: !1, offline: !1 }), Fs = () => Ge.starting, Gu = 3;
let An = 0, ms = 0, Yl = 0, Ql = [];
async function Vu() {
  try {
    const e = await Ee.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let _o = null;
const Ku = () => _o ?? (_o = Vu().finally(() => _o = null));
function Yu() {
  clearTimeout(ms), clearTimeout(Yl), ms = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), Ql.splice(0).forEach((e) => e()), Pu();
}
async function Qu() {
  Ge.offline = !navigator.onLine;
  const e = await Ku();
  if (Ge.external = e.updating, An = !e.restarting && !e.updating && e.reachable ? An + 1 : 0, An < Gu) return;
  An = 0, (!ju(e.started_at) || fs()) && Yu();
}
function Xl() {
  ms = setTimeout(async () => {
    await Qu(), Ge.starting && Xl();
  }, zu);
}
function Xu() {
  Ge.starting || (Ge.starting = !0, Ge.offline = !navigator.onLine, Xl(), Yl = setTimeout(() => Ge.late = !0, Uu));
}
const Jl = () => Ge.starting ? new Promise((e) => Ql.push(e)) : Promise.resolve();
function Ws(e, t, n = 0) {
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
function Ju(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Zu {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Ws(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Ju(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const dt = "viewer.shell", On = 2e4, ec = 4, Co = "/api/read-lines", tc = 5e3, nc = 403, Eo = "/api/repeated-lines", ac = 10, sc = 2e3, oc = 3e5, a6 = 6e5, Tn = 6, lc = 500, ic = "/journal/summary", Ao = "/api/server-state", rc = 2e4, In = Gl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, uc = (e) => e.split("?")[0].endsWith(ic), ps = (e, t) => Object.assign(new Error(t), { status: e });
async function cc(e, t, n = ps) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const dc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), fc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Oo = (e) => e.split(" ").slice(0, 2).join(" "), ot = "read", Bt = "write", hc = "stream";
class mc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Tn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Oo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < sc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < ac || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Eo, { method: "POST", headers: { ...In, "Content-Type": "application/json" }, body: i }, [{ window: dt, line: Eo, kind: Bt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = qu(n ? Vl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: fc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Bt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = On) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Xu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= ec ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Co, { headers: In }, [{ window: dt, line: Co, kind: ot }], tc).then(async (t) => {
      if (t.status === nc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ps(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Zu(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Oo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Tn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...In, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: dc(a) }, c = s || (i ? oc : On);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: dt, line: n, kind: ot }], c)) : await this.sent(n, u, [{ window: dt, line: n, kind: Bt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, lc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Tn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return cc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: dt, line: t, kind: ot }], On)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: In });
    if (!n.ok) throw ps(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Tn, o).then((i) => (this.written(n), i)) : Fs() && !uc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: dt, line: t, kind: hc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Ao, { cache: "no-store" }, [{ window: dt, line: Ao, kind: ot }], rc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = dt, line: s = t, limit: o = On } = {}) {
    const l = (n.method ?? "GET") === "GET" ? ot : Bt;
    return l === Bt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Oa = Symbol.for("journal.transport"), Ee = globalThis[Oa] ?? (globalThis[Oa] = new mc());
class Zl {
  constructor() {
    this.following = Je([]), this.held = /* @__PURE__ */ new Set();
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
      n.patterns.some((a) => Hs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Hs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const pc = 50, gc = "refresh", vc = 1e3, yc = 3e4, bc = "requested", kc = "after_window", wc = 50, Bn = ".*", $c = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function xc(e) {
  const t = {}, n = zt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, h = !1;
  function p(_) {
    const I = () => u[_] ?? u[`${_.slice(0, _.lastIndexOf("."))}.*`] ?? {}, $ = A(void 0), g = Ul(e, async (M) => {
      const E = await T(_, M);
      return E.ok && !Object.keys(M).length && ($.value = E.value), E;
    }, () => I().page_size || wc, () => !!I().page_size, () => !!I().reads_ids);
    return t[_] = { ...g, data: $, readAt: 0 };
  }
  const y = new Proxy({}, { get: (_, I) => typeof I != "string" || I.startsWith("__v") ? void 0 : t[I] ?? p(I) }), k = (_) => (u[_].loading !== bc || _.endsWith(Bn)) && (!u[_].tab || u[_].tab === n.tab);
  function T(_, I = {}) {
    return new Promise(($) => {
      a.push({ name: _, flags: I, resolve: $ }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const _ = /* @__PURE__ */ new Map(), I = a.splice(0).filter((M) => {
      const E = JSON.stringify(M.flags);
      return _.has(M.name) || _.set(M.name, E), _.get(M.name) === E ? !0 : (a.push(M), !1);
    });
    a.length && setTimeout(S);
    const $ = Object.fromEntries(I.flatMap(({ name: M, flags: E }) => Object.entries(E).map(([R, U]) => [`${M}.${R}`, U]))), g = await e.readKeys({ only: [...new Set(I.map(({ name: M }) => M))], state: { ...n, ...$ } });
    I.forEach(({ name: M, resolve: E }) => E(g.ok ? g.value.keys[M] : g));
  }
  async function x(_) {
    var M;
    const I = ++f;
    (_.length ? _ : Object.keys(u).filter((E) => !E.endsWith(Bn) && u[E].loading === "first" && k(E))).forEach((E) => l[E] = I);
    const g = await e.readKeys({ only: _, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const E = (_.length ? _ : Object.keys(t)).filter((U) => (l[U] ?? 0) <= I);
      E.forEach((U) => {
        y[U].readAt = Date.now(), g.failure === "unreachable" ? i.add(U) : i.delete(U), y[U].showFirst(g);
      });
      const R = g.failure === "unreachable" && ((M = e.waitForServer) == null ? void 0 : M.call(e));
      return R && R.then(() => {
        if (h) return;
        const U = E.filter((ee) => l[ee] === I);
        (U.length || !_.length && !E.length && f === I) && x(U);
      }), !1;
    }
    return j(g.value.declared), Object.entries(g.value.keys).forEach(([E, R]) => {
      (l[E] ?? 0) > I || (l[E] = I, y[E].readAt = Date.now(), i.delete(E), R.ok && (y[E].data.value = R.value), y[E].showFirst(R));
    }), !0;
  }
  function B(_) {
    const I = $c(_);
    return I.length ? (I.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, $(x(g));
    })))) : x([]);
  }
  function W(_) {
    _.forEach((I) => s.add(I)), clearTimeout(c), c = setTimeout(() => {
      const I = [...s];
      s.clear(), I.length && B(I);
    }, pc);
  }
  const N = (_) => _.endsWith(Bn) ? Object.keys(t).filter((I) => I.startsWith(_.slice(0, -1)) && t[I].readAt) : [_], w = (_) => (u[_] ?? u[`${_.split(".")[0]}.*`]).reload_seconds;
  function z(_) {
    const I = Object.keys(u).filter((g) => _.event === gc || u[g].events.some((M) => Hs(M, _.event)));
    I.filter((g) => u[g].page_size).forEach((g) => y[g].heard(_));
    const $ = I.filter((g) => !u[g].page_size);
    $.filter((g) => !k(g)).forEach((g) => y[g].readAt = 0), W($.filter(k).flatMap(N));
  }
  function j(_) {
    if (Object.keys(u).length) return;
    u = _;
    const I = [...new Set(Object.values(_).flatMap((g) => g.events))];
    I.length && e.follow(I, z);
    const $ = Object.keys(_).filter((g) => _[g].loading === kc);
    $.length && x($);
  }
  pe(() => n.tab, () => {
    const _ = Object.keys(u).filter((I) => !I.endsWith(Bn) && k(I) && !y[I].readAt);
    _.length && x(_);
  }), Be(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const _ = Date.now(), I = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && k($)).flatMap(N).filter(($) => _ - y[$].readAt >= (i.has($) ? Math.min(w($) * 1e3, yc) : w($) * 1e3));
    I.length && W(I);
  }
  return js(q, () => e.visible.value, vc), queueMicrotask(() => x([])), { props: y, state: n, reload: B, readKey: T };
}
const Sc = Symbol("open-view"), Re = Symbol.for("journal.window-context"), ei = Symbol("dock-card");
function Mc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = xc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function nt() {
  const e = Me(Re, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Mc(e);
}
const _c = (e, t) => e(ei, t), s6 = () => Me(ei), gs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', To = {
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
  agent: gs,
  worker: gs,
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
}, Cc = ["data-icon", "stroke-width", "innerHTML"], le = {
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
      agent: gs,
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
    return (o, l) => (r(), d("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ye({
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
    }, null, 12, Cc));
  }
}, Ec = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Ac = /* @__PURE__ */ H(Ec, [["__scopeId", "data-v-eb453d6f"]]), Oc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = fa(), a = C(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = A(!1), o = C(() => t.busy || s.value), l = Me(Re, null), i = C(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Vl);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, f) => (r(), F(Ve(e.href ? "a" : "button"), Pe(a.value, {
      type: e.href ? void 0 : L(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: P(() => [
        m("span", {
          class: K(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), F(le, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : b("", !0),
          ue(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), F(Ac, {
          key: 0,
          class: "btn-spinner"
        })) : b("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ge = /* @__PURE__ */ H(Oc, [["__scopeId", "data-v-ededdadf"]]), Tc = ["aria-checked", "aria-haspopup", "onClick"], Ic = {
  key: 0,
  class: "segmented-dot"
}, Bc = {
  key: 1,
  class: "segmented-note"
}, Rc = {
  key: 2,
  class: "segmented-count"
}, Lc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = qs();
    return (s, o) => {
      const l = tu("tip");
      return r(), d("span", {
        class: K(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(D, null, ne(e.options, (i) => Ze((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: K(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Ic)) : b("", !0),
          V(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Bc, v(i.note), 1)) : b("", !0),
          i.count !== void 0 ? (r(), d("em", Rc, v(i.count), 1)) : b("", !0)
        ], 10, Tc)), [
          [l, i.tip || i.title, `${L(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ft = /* @__PURE__ */ H(Lc, [["__scopeId", "data-v-c89bc92d"]]), Nc = {
  key: 0,
  class: "more-items"
}, qc = {
  key: 0,
  role: "alert"
}, Dc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", Nc, [
      e.failure ? (r(), d("p", qc, v(e.failure), 1)) : b("", !0),
      e.more ? (r(), F(ge, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          V(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : b("", !0)
    ])) : b("", !0);
  }
}, yn = /* @__PURE__ */ H(Dc, [["__scopeId", "data-v-10464014"]]), Pc = { class: "link-group" }, jc = {
  class: "group-label",
  "data-link-kind": ""
}, Fc = ["disabled", "onClick"], Wc = { class: "title" }, Hc = { class: "relations" }, zc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = C(() => s.value ? n.rows : n.rows.slice(0, 3)), l = C(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (r(), d("div", Pc, [
      m("div", jc, v(l.value), 1),
      (r(!0), d(D, null, ne(o.value, (p) => (r(), d("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Wc, v(p.endpoint.title), 1),
        m("span", Hc, [
          V(v(c(p)), 1),
          i(p) ? (r(), d(D, { key: 0 }, [
            V(" · Unavailable")
          ], 64)) : b("", !0)
        ])
      ], 16, Fc))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : b("", !0)
    ]));
  }
}, Uc = /* @__PURE__ */ H(zc, [["__scopeId", "data-v-be6f079c"]]), Gc = ["data-loaded"], Vc = { class: "rows" }, Kc = ["disabled", "onClick"], Yc = { class: "title" }, Qc = { class: "relations" }, Xc = { key: 2 }, Jc = {
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
    const n = e, a = t, s = A([]), o = A({}), l = A(0), i = A(""), u = A(null), c = A(!1), f = A("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (_) => _.toUpperCase())}s`, k = C(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, _) => q + _, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, _]) => ({ key: q, label: y(q), count: _ }))
    ]), T = C(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((I) => I.endpoint.model))].map((I) => [I, s.value.filter(($) => $.endpoint.model === I).length])), _ = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([I], [$]) => (_[I] ?? 3) - (_[$] ?? 3)).map(([I, $]) => ({ model: I, count: $, rows: s.value.filter((g) => g.endpoint.model === I) }));
    }), S = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, x = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), B = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (_) => _.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((_) => _.replaceAll("_", " ")).join(", ")}`;
    async function W(q = 1) {
      const _ = ++h;
      c.value = !0, f.value = "";
      const I = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && I.push("--outside-plan"), n.documentId && I.push("--first-counterpart", `doc:${n.documentId}`), i.value && I.push("--kind", i.value);
      try {
        const $ = await n.read(I);
        if (_ !== h) return;
        if (!$.ok) {
          f.value = $.error;
          return;
        }
        const g = $.value.counterparts ?? [], M = q === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(M.map((E) => [`${E.endpoint.model}:${E.endpoint.id}`, E])).values()], o.value = $.value.categories ?? {}, l.value = $.value.total, u.value = $.value.next_page ?? null;
      } catch ($) {
        _ === h && (f.value = $.message);
      } finally {
        _ === h && (c.value = !1);
      }
    }
    function N(q) {
      if (S(q)) return;
      const [_, I] = q.endpoint.open_ref.split(":");
      a("open", { table: _, id: Number(I) });
    }
    function w(q) {
      i.value = q, W();
    }
    const z = () => !c.value && u.value && W(u.value), j = C(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", W();
    }, { immediate: !0 }), (q, _) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: K(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      k.value.length > 2 ? (r(), F(Ft, {
        key: 0,
        options: k.value,
        value: i.value,
        wrap: "",
        onPick: w
      }, null, 8, ["options", "value"])) : b("", !0),
      m("div", Vc, [
        e.grouped ? (r(!0), d(D, { key: 0 }, ne(T.value, (I) => (r(), F(Uc, {
          key: I.model,
          model: I.model,
          count: I.count,
          rows: I.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: N
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(D, { key: 1 }, ne(s.value, (I) => (r(), d("button", Pe({
          key: `${I.endpoint.model}:${I.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, x(I), {
          disabled: S(I),
          onClick: ($) => N(I)
        }), [
          m("span", Yc, v(I.endpoint.title), 1),
          m("span", Qc, [
            V(v(B(I)), 1),
            S(I) ? (r(), d(D, { key: 0 }, [
              V(" · Unavailable")
            ], 64)) : b("", !0)
          ])
        ], 16, Kc))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Xc, v(e.empty), 1)) : b("", !0),
        O(yn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: j.value,
          onMore: z
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Gc)) : b("", !0);
  }
}, Zc = /* @__PURE__ */ H(Jc, [["__scopeId", "data-v-3b23de37"]]), ed = (e, t, n) => Math.max(t, Math.min(n, e)), td = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ti = /* @__PURE__ */ new WeakMap(), nd = (e, t) => ti.set(e, t);
function ad(e, t) {
  for (let n = t; n; n = ti.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function ni(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !ad(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Tt = 8, sd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = A(null), o = (g) => g ? `${g}px` : void 0, l = C(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = A({ w: 0, h: 0 }), u = A(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), h = (g) => {
      const M = g.closest(".pane, .float-window");
      return M ? f(M.getBoundingClientRect()) : c();
    }, p = (g, M) => `${Math.max(0, g ? Math.min(g, M) : M)}px`;
    function y(g, M) {
      return {
        below: g.bottom - M.bottom - a.gap - Tt,
        above: M.top - g.top - a.gap - Tt,
        across: g.right - g.left - 2 * Tt
      };
    }
    function k(g) {
      const M = h(a.anchor), E = y(M, g);
      return i.value.w <= E.across && i.value.h <= Math.max(E.below, E.above) ? M : c();
    }
    const T = C(() => {
      if (!u.value) return l.value;
      const g = u.value, M = k(g), E = y(M, g), { w: R, h: U } = i.value, ee = a.align === "auto" ? g.left + g.right > M.left + M.right : a.align === "right", Z = ed(ee ? g.right - R : g.left, M.left + Tt, Math.max(M.left + Tt, M.right - R - Tt)), ve = U > E.below && E.above > E.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, E.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, E.below) };
      return { ...l.value, ...ve, left: `${Z}px`, maxWidth: p(a.maxWidth, E.across) };
    }), S = n, x = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function B(g) {
      const M = x(), E = M.indexOf(document.activeElement);
      M[(E + g + M.length) % M.length].focus();
    }
    const W = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => S("close") }, N = (g) => W[g.key] && (g.preventDefault(), W[g.key]()), w = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let z = 0;
    const j = new ResizeObserver(() => {
      cancelAnimationFrame(z), z = requestAnimationFrame(w);
    });
    ni(s, (g) => a.anchor && !a.anchor.contains(g.target) && S("close"));
    const q = (g, M) => ["top", "left", "right", "bottom"].some((E) => Math.abs(g[E] - M[E]) > 1), _ = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let I = 0;
    function $() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || _(g)) return S("close");
        q(g, u.value) && (u.value = g);
      }
      I = requestAnimationFrame($);
    }
    return _e(() => {
      a.anchor && s.value && nd(s.value, a.anchor), w(), s.value && j.observe(s.value), !a.plain && x()[0] && x()[0].focus(), $();
    }), Be(() => {
      j.disconnect(), cancelAnimationFrame(I), cancelAnimationFrame(z);
    }), t({ element: s }), (g, M) => (r(), F(ha, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", Pe({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: T.value,
        onKeydown: N
      }), [
        ue(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), pa = /* @__PURE__ */ H(sd, [["__scopeId", "data-v-3d203970"]]), od = { class: "split-button" }, ld = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = A(null), s = A(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", od, [
      O(ge, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: P(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        O(ge, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: P(() => [
            O(le, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), F(pa, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : b("", !0)
    ]));
  }
}, id = /* @__PURE__ */ H(ld, [["__scopeId", "data-v-c258494d"]]), rd = 0, ud = "/api/lines", cd = "/api/line", Io = 5e3, Bo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Ro = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ta = (e) => JSON.stringify(e.line), Lo = () => new DOMException("cancelled", "AbortError");
class dd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ta(t))) {
        Ee.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Bt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ee.whenFree(() => this.send()), rd));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Lo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Lo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ee.sent(ud, Bo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Ro(i.body, ot)), Io);
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
    await this.alone(t, ot), Date.now() - n < Io ? this.slow.delete(Ta(t.body)) : this.slow.add(Ta(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ee.sent(cd, Bo(t.body, t.signal), [Ro(t.body, n)], n === ot ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const ai = new dd(), fd = "/api/window";
function hd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${fd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ee.whenFree(async () => {
    const f = await Ee.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: ot }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ee.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const si = /* @__PURE__ */ new Map();
class md {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Je({ buttons: [], missing: {} }), this.loading = Je(!1), this.loaded = Je(!1), this.failed = Je(""), this.pending = null;
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
function o6(e, t) {
  const n = new md(e, t);
  return si.set(e, n), n.load().catch(() => {
  }), n;
}
const zs = (e) => si.get(e);
function pd(e, t, n) {
  const a = zs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function gd(e, t) {
  if (!e) return !0;
  const n = zs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Jn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let oi = {};
async function l6(e = (t) => Ee.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (oi = (await t.json()).states);
}
const Us = (e, t) => {
  var n;
  return (n = oi[e]) == null ? void 0 : n[t];
}, un = (e, t) => {
  var n;
  return ((n = Us(e, t)) == null ? void 0 : n.label) ?? Jn(t);
}, li = (e, t) => {
  var n;
  return ((n = Us(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, vd = (e, t) => {
  var n;
  return ((n = Us(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, yd = Symbol("pane-page"), Gs = Symbol("inspector-host"), ii = { 1: "refused", 2: "usage", 3: "fault" }, bd = 100, kd = 50, wd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, $d = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function xd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = A({}), declared: c = [], page: f = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: k = [], links: T = {}, search: S = {}, readOnly: x = !1, shared: B = null }) {
  const W = /* @__PURE__ */ new Map(), N = (ee, Z) => l.follow(e, ee, (me) => {
    W.clear(), Z(me);
  }, a), w = new AbortController(), z = A(!1), j = performance.now();
  let q = 0, _ = 0, I = () => {
  };
  const $ = new Promise((ee) => I = ee);
  w.signal.addEventListener("abort", I, { once: !0 });
  const g = () => {
    clearTimeout(_), _ = setTimeout(() => {
      q === 0 && Ps(j, () => {
        z.value = !0, I();
      });
    }, kd);
  }, M = (ee, Z) => (q += 1, Lt(e, ee, t, w.signal, Z).finally(() => {
    q -= 1, g();
  })), E = (ee, Z) => (g(), $.then(() => w.signal.aborted ? ut : Lt(e, ee, t, w.signal, Z))), R = ({ only: ee = [], state: Z = {} } = {}) => (q += 1, Md(() => hd(e, t, ee, Z, w.signal), w.signal).finally(() => {
    q -= 1, g();
  })), U = (ee, { unbatched: Z = !1, deferred: me = !1 } = {}) => {
    const ve = W.get(ee);
    if (ve && performance.now() - ve.at < bd) return ve.answer;
    const be = me && !z.value ? E(ee, Z) : M(ee, Z);
    return W.set(ee, { answer: be, at: performance.now() }), be;
  };
  return {
    answered: z,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: C(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: k,
    links: T,
    search: S,
    readOnly: x,
    shared: B,
    read: U,
    readKeys: R,
    waitForServer: () => Fs() ? Jl() : null,
    run: (ee) => Lt(e, ee, t, w.signal),
    upload: (ee) => Cd(ee, e, w.signal),
    cancel: () => w.abort(),
    signal: w.signal,
    subscriptions: l,
    follow: (ee, Z) => N([ee].flat().filter((me) => o.some((ve) => Hs(ve, me))), Z),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: N,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (ee) => C(() => {
      var Z;
      return u.value[ee] ?? ((Z = c.find((me) => me.key === ee)) == null ? void 0 : Z.default);
    }),
    setting: async (ee, Z) => {
      const me = await U(`window setting ${e} ${ee}`);
      return me.ok ? me.value.value : Z;
    },
    setOption: h,
    keep: (ee, Z) => Lt(e, ["window", "save-setting", e, ee, JSON.stringify(Z)], t, w.signal)
  };
}
function ri(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const ut = { ok: !1, failure: "cancelled", error: "" }, Vs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ui(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ut : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: ii[n.code] || "fault", error: ri(n.error) };
  } catch {
    return t != null && t.aborted ? ut : { ok: !1, failure: "unreachable", error: Vs };
  }
}
const Sd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: ii[e.code] || "fault", error: ri(e.error) };
async function Md(e, t) {
  try {
    const n = await e();
    return t.aborted ? ut : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Sd(s)])) } };
  } catch {
    return t.aborted ? ut : { ok: !1, failure: "unreachable", error: Vs };
  }
}
async function ci(e, t, n) {
  const a = await ui(() => ai.read(e, t, n), t);
  return a.failure !== "unreachable" || !Fs() ? a : (await Jl(), t.aborted ? ut : ci(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ee.held(() => _d(e, t, n, a, s), Ee.knownRead(Array.isArray(t) ? t : Ks(t)));
}
async function _d(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Ks(t), environment: n };
  return await Ee.isRead(o.line) ? Ee.joined(JSON.stringify(o), (l, i) => ci({ ...o, attribution: i }, l, s), a, o).catch(() => ut) : ui(() => ai.write({ ...o, attribution: {
    client_id: Ee.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Cd(e, t, n = void 0) {
  try {
    const a = await Ee.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ut : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ut : { ok: !1, failure: "unreachable", error: Vs };
  }
}
function Ks(e) {
  return [...e.matchAll(wd)].map(([t]) => t.replace($d, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Ed = (e) => `show-${e}`, i6 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Ed((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), di = "messages.chat", Ad = {
  key: 0,
  class: "template-brief"
}, Od = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Td = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A([]), o = A(""), l = C(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = C(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Lt(di, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === f);
      h && a("pick", String(h.id));
    }
    return u(), (c, f) => (r(), d(D, null, [
      O(Ft, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Ad, v(i.value.brief), 1)) : b("", !0),
      o.value ? (r(), d("p", Od, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, Id = /* @__PURE__ */ H(Td, [["__scopeId", "data-v-14be8a5c"]]), Bd = { class: "info-tip" }, Rd = ["aria-label"], Ld = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Nd = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Bd, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        O(le, {
          name: "info",
          size: 13
        })
      ], 8, Rd),
      m("span", Ld, [
        (r(!0), d(D, null, ne(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, fi = /* @__PURE__ */ H(Nd, [["__scopeId", "data-v-a2fe5ff1"]]), qd = { class: "form-field" }, Dd = { class: "form-field-head" }, Pd = ["for"], jd = {
  key: 1,
  class: "form-field-aside"
}, Fd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", qd, [
      m("div", Dd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Pd),
        e.help ? (r(), F(fi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : b("", !0),
        t.$slots.aside ? (r(), d("span", jd, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Wd = /* @__PURE__ */ H(Fd, [["__scopeId", "data-v-302c40bf"]]), vs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Hd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = fa(), n = C(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ze((r(), d("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [L(vs), L(t).value]
    ]);
  }
}), zd = /* @__PURE__ */ H(Hd, [["__scopeId", "data-v-e130a5b9"]]), Ud = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = qs(), o = C(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (r(), F(Wd, {
      label: e.field.label,
      for: L(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        O(Gt, { value: o.value }, {
          choice: P(() => [
            O(Ft, {
              id: L(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            O(Id, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            O(zd, {
              id: L(s),
              value: e.value,
              onInput: i[2] || (i[2] = (u) => a("pick", u.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, ga = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), F(ge, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        O(le, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Gd(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Vd = (e, t = () => !0) => Gd("keydown", (n) => n.key === "Escape" && t() && e());
function hi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = A(!1), s = C(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Vd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Kd = 80, It = zt([]);
function mi(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), C(() => Kd + Math.max(0, It.indexOf(t)));
}
let pi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return pi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Yd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Qd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Yd)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : pi, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Xd = ["aria-modal", "aria-label", "aria-labelledby"], Jd = {
  key: 0,
  class: "dialog-head"
}, Zd = ["id", "tabindex"], ef = {
  key: 1,
  class: "dialog-foot"
}, tf = 500, nf = 400, af = {
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
    padded: Boolean,
    open: { type: Boolean, default: null },
    closable: { type: Boolean, default: !0 },
    modal: Boolean,
    sheet: Boolean
  },
  emits: ["close", "dismiss", "escape"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = hi(a, n), i = mi(s), u = A(null), c = A(null), f = A(null), h = qs(), p = A(!1), y = Date.now();
    n.modal && Qd(c, () => a("escape"), f);
    function k() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, nf);
    }
    function T(B) {
      !n.modal || Date.now() - y >= tf || ![" ", "Enter"].includes(B.key) || (B.preventDefault(), B.stopPropagation());
    }
    const S = () => u.value && (u.value.scrollTop = u.value.scrollHeight), x = new MutationObserver(S);
    return pe(u, (B) => {
      x.disconnect(), B && n.follow && (x.observe(B, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Be(() => x.disconnect()), (B, W) => (r(), F(ha, { to: "body" }, [
      O(Ut, {
        name: "dialog",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: P(() => [
          L(s) ? (r(), d("div", {
            key: 0,
            class: K(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: L(i) }),
            onClick: Se(k, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: K(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? L(h) : void 0,
              onKeydownCapture: T
            }, [
              e.bare ? b("", !0) : (r(), d("header", Jd, [
                m("h3", {
                  id: L(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Zd),
                e.closable ? (r(), F(ga, {
                  key: 0,
                  onClick: L(o)
                }, null, 8, ["onClick"])) : b("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: u,
                class: K(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ue(B.$slots, "default", {}, void 0, !0)
              ], 2),
              B.$slots.foot ? (r(), d("footer", ef, [
                ue(B.$slots, "foot", {}, void 0, !0)
              ])) : b("", !0)
            ], 42, Xd)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, va = /* @__PURE__ */ H(af, [["__scopeId", "data-v-24a11f8a"]]), sf = {
  class: "action-output",
  "data-action-output": ""
}, of = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(va, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: P(() => [
        m("pre", sf, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, lf = /* @__PURE__ */ H(of, [["__scopeId", "data-v-b32f94a4"]]);
function rf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = nu(lf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const uf = (e, t, n = {}) => Ks(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function bn(e, t, n, a = {}) {
  var s;
  try {
    if (!await gd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(di, uf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && rf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const cf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ia = [
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
}), ya = {
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
    filters: Ia
  }),
  tasks: we("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ia
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
  pins: we("Pin", "band", "One line pinned to the chat while it matters", { filters: Ia }),
  reactions: we("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: we("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: we("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: we("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: we("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
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
}, df = ["secrets", "plugins"], gi = Object.keys(ya).filter((e) => !(Gl && df.includes(e)));
C(() => gi.map((e) => ({ name: e, ...ya[e] })));
const Vt = (e) => ya[e], vi = new Map(gi.flatMap((e) => [e, e.replace(/s$/, ""), ya[e].title.toLowerCase()].map((t) => [t, e]))), gt = (e) => vi.get(String(e).toLowerCase()) || "", yi = [...vi.keys()].sort((e, t) => t.length - e.length).join("|"), ff = {
  class: "button-form",
  "data-button-form": ""
}, hf = {
  key: 0,
  class: "button-form-title"
}, mf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, pf = { class: "button-form-actions" }, gf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = A(!1), l = A(""), i = C(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = C(() => {
      var h;
      if (!n.row) return n.button.label;
      const f = ((h = Vt(gt(n.row.term))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await bn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, h) => (r(), F(va, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: P(() => {
        var p;
        return [
          m("div", ff, [
            (p = e.row) != null && p.title ? (r(), d("p", hf, v(e.row.title), 1)) : b("", !0),
            (r(!0), d(D, null, ne(e.button.fields, (y) => (r(), F(Ud, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (k) => s.value[y.name] = k
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", mf, v(l.value), 1)) : b("", !0),
            m("div", pf, [
              O(ge, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: P(() => [...h[2] || (h[2] = [
                  V("Cancel", -1)
                ])]),
                _: 1
              }),
              O(ge, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: P(() => [...h[3] || (h[3] = [
                  V("Send", -1)
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
}, vf = /* @__PURE__ */ H(gf, [["__scopeId", "data-v-e3f0d786"]]), yf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, bf = {
  key: 1,
  class: "menu-item-text"
}, kf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: K(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", yf, v(e.checked ? "✓" : ""), 1)) : b("", !0),
      e.description ? (r(), d("span", bf, [
        m("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ze = /* @__PURE__ */ H(kf, [["__scopeId", "data-v-fec99974"]]), wf = ["aria-busy"], $f = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, xf = { class: "button-slot-confirm-text" }, Sf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Mf = {
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
    const n = e, a = t, s = C(() => zs(n.environment)), o = C(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = C(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = C(() => n.readOnly ? [] : pd(n.environment, n.name, n.row)), c = A(null), f = A(null), h = A(""), p = A(!1), y = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), k = (x) => x.icon || (x.warning ? "dot" : "");
    function T(x) {
      if (!(p.value || n.readOnly)) {
        if (x.fields.length) {
          c.value = x;
          return;
        }
        if (x.confirm) {
          f.value = x;
          return;
        }
        return S(x);
      }
    }
    async function S(x) {
      f.value = null, h.value = "", a("failure", ""), p.value = !0;
      const B = await bn(x, n.row, n.environment);
      p.value = !1, h.value = B.ok ? "" : B.error;
      const W = x.label.toLowerCase() + (n.objectName && !x.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", B.ok ? "" : `Could not ${W}: ${B.error}`), B.ok && a("done");
    }
    return (x, B) => (r(), d("span", {
      class: K(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(D, { key: 0 }, [
        B[5] || (B[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        O(ge, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...B[4] || (B[4] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", $f, [
        m("span", xf, v(f.value.confirm), 1),
        O(ge, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: K({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: B[0] || (B[0] = (W) => S(f.value))
        }, {
          default: P(() => [
            V(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        O(ge, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: B[1] || (B[1] = (W) => f.value = null)
        }, {
          default: P(() => [...B[6] || (B[6] = [
            V("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? b("", !0) : (r(), d(D, { key: 2 }, [
        (r(!0), d(D, null, ne(u.value, (W) => (r(), d(D, {
          key: W.name
        }, [
          W.menu.length ? (r(), F(id, {
            key: 0,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": W.menu_label || "More ways",
            title: y(W),
            "data-button": W.name,
            onMain: (N) => T(W)
          }, {
            menu: P(({ close: N }) => [
              (r(!0), d(D, null, ne(W.menu, (w) => (r(), F(ze, {
                key: w.label,
                description: w.description,
                onClick: (z) => (N(), T({ ...W, ...w, menu: [] }))
              }, {
                default: P(() => [
                  V(v(w.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              V(v(W.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), F(ge, {
            key: 1,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            bordered: !W.primary,
            class: K({ danger: W.danger }),
            icon: k(W),
            disabled: p.value,
            title: y(W),
            "data-button": W.name,
            onClick: (N) => T(W)
          }, {
            default: P(() => [
              V(v(W.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Sf, v(h.value), 1)) : b("", !0),
        c.value && !e.readOnly ? (r(), F(vf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: B[2] || (B[2] = (W) => c.value = null),
          onDone: B[3] || (B[3] = (W) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : b("", !0)
      ], 64))
    ], 10, wf));
  }
}, Ys = /* @__PURE__ */ H(Mf, [["__scopeId", "data-v-a4b6f174"]]), _f = {
  class: "running",
  "data-running-command": ""
}, Cf = ["title"], Ef = {
  key: "idle",
  class: "running-idle"
}, Af = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", _f, [
      O(Ut, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Cf)) : (r(), d("span", Ef, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, r6 = /* @__PURE__ */ H(Af, [["__scopeId", "data-v-d3240219"]]), Of = ["aria-checked", "disabled", "aria-label", "title"], Tf = {
  key: 0,
  class: "switch-inner"
}, If = {
  key: 0,
  class: "switch-word"
}, Bf = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean, disabled: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: K(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      disabled: e.disabled,
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: K(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", Tf, v(e.word), 1)) : b("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", If, v(e.word), 1)) : b("", !0)
    ], 10, Of));
  }
}, u6 = /* @__PURE__ */ H(Bf, [["__scopeId", "data-v-92ae7767"]]), Rf = { class: "notice-text" }, Lf = {
  key: 1,
  class: "notice-actions"
}, Nf = {
  __name: "Notice",
  props: {
    tone: { type: String, default: "muted" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = ["brief", "report", "wait", "danger", "info", "need", "ask"];
    return (n, a) => (r(), d("div", {
      class: K(["notice", [`notice-${e.tone}`, { "notice-band": t.includes(e.tone) }]])
    }, [
      e.icon ? (r(), F(le, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : b("", !0),
      m("span", Rf, [
        ue(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Lf, [
        ue(n.$slots, "actions", {}, void 0, !0)
      ])) : b("", !0)
    ], 2));
  }
}, c6 = /* @__PURE__ */ H(Nf, [["__scopeId", "data-v-445bd8a6"]]);
function bi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Zn(e, t) {
  return bi(() => localStorage, e, t);
}
function ki(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Qs(e, t) {
  return ki(() => localStorage, e, t);
}
function wi(e, t) {
  pe(t, (n) => Qs(e, n), { deep: !0 });
}
function qf(e, t) {
  return bi(() => sessionStorage, e, t);
}
function Df(e, t) {
  return ki(() => sessionStorage, e, t);
}
const ea = "journal.environment", $i = A(qf(ea, Zn(ea, "")));
function Pf(e) {
  $i.value = e, Df(ea, e), Qs(ea, e);
}
const ta = A(location.hash), No = Je(null), qo = { integrations: "mcp", library: "team" };
function jf() {
  if (!No.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (qo[n]) {
    location.replace(`#/${[qo[n], ...a].join("/")}${t ? `?${t}` : ""}`), ta.value = location.hash;
    return;
  }
  !n || No.value(n) || (Pf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ta.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ta.value = location.hash, jf();
});
const ys = C(() => {
  const [e, t = ""] = ta.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", h = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(h) || 0, env: u };
  });
  return {
    env: $i.value,
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
}), Xs = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Xs.page(e)}?open=${t}`
};
function Ff(e = "", t = 0, n = "") {
  location.hash = Xs.page(e, t, n);
}
function Wf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Hf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function xi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Hf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function d6(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function yt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = ys.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  xi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function zf(e, t, n, a = 0, s = "") {
  if (e === ys.value.env) return yt(t, n, a, s);
  const o = ys.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  xi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function De(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? zf(a, s, Number(o), 0, t) : yt(s, Number(o), 0, t);
}
function Uf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = Uf(e);
  t && De(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function f6(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Gf = { class: "inspector-part" }, Vf = { class: "inspector-part-title" }, Kf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", Gf, [
      m("h4", Vf, v(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, h6 = /* @__PURE__ */ H(Kf, [["__scopeId", "data-v-5175e4a3"]]), Do = /* @__PURE__ */ new Map(), Yf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = A(null), a = A(!1), s = A(t.name && Do.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Do.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && i.observe(n.value.firstElementChild || n.value)), Be(() => i.disconnect()), (u, c) => (r(), d(D, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: K(["folded-body", { folded: a.value && !s.value }]),
        style: ye(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ue(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = Se((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : b("", !0)
    ], 64));
  }
}, Si = /* @__PURE__ */ H(Yf, [["__scopeId", "data-v-4d2235ba"]]), Qf = ["aria-valuenow", "aria-valuemax"], Xf = {
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
    const t = e, n = C(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (r(), d("span", {
      class: K(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: ye({ width: n.value })
      }, null, 4)
    ], 10, Qf));
  }
}, Mi = /* @__PURE__ */ H(Xf, [["__scopeId", "data-v-9eba6a85"]]), Jf = { processes: "process", memories: "memory", replies: "reply" }, na = (e) => (Jf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), bs = [], Zf = 2e3, ht = /* @__PURE__ */ new Map(), eh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, th = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? bs.unshift(e) : bs.push(e), ht.clear();
}
function _i(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const nh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, ah = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function rt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function sh(e, t) {
  const n = [{ type: "text", text: rt(e).replace(/\r\n/g, `
`) }];
  for (const a of bs)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function cn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return oh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function oh(e) {
  return e.split(th).map((t, n) => n % 2 ? t : t.replace(eh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Po(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const lh = 24;
function ih(e) {
  const [t, , ...n] = e, a = Po(t), s = n.map(Po), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > lh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${cn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${cn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Ci = /^\s*(?:[-*+]|\d+[.)])\s+/, ks = /^\s*(\d+)[.)]\s/, jo = (e) => e.match(/^\s*/)[0].length;
function Ei(e) {
  const t = e[0].match(ks), n = jo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && jo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${cn(o.text)}${o.nested.length ? Ei(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function rh(e, t) {
  const n = ks.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Ci.test(e[s]) && ks.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Fo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ai(e) {
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
      n.push(`<h${i}>${cn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Fo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(ih(t.slice(a, i))), a = i;
      continue;
    }
    if (Ci.test(s)) {
      const i = rh(t, a);
      n.push(Ei(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Ai(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Fo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${cn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const uh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ch = (e) => e.type !== "text" && !uh.test(e.html);
function dh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Ai(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : ch(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Js(e, t = { env: "" }) {
  const n = ah(e, t), a = ht.get(n);
  if (ht.delete(n), a && a.source === t.source && a.reads.every((l) => nh(l, t)))
    return ht.set(n, a), a.html;
  const s = [], o = dh(sh(e, { ...t, reads: s }));
  return ht.set(n, { html: o, reads: s, source: t.source }), ht.size > Zf && ht.delete(ht.keys().next().value), o;
}
const Ba = /* @__PURE__ */ new WeakMap();
function fh(e) {
  if (Ba.has(e)) return Ba.get(e);
  const t = au(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const h = s(c, f), p = e.read(`${na(c)} show ${f}`);
    n.set(h, p), p.then((y) => {
      n.get(h) === p && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${na(c).replace(/-/g, "_")}.*`], (f) => {
      const h = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(h)) continue;
        const y = Number(p.slice(h.length));
        (!f.row_id || f.row_id === y) && o(c, y);
      }
    }));
  }
  function i(c, f) {
    l(c);
    const h = s(c, f);
    return !t.has(h) && !n.has(h) && o(c, f), t.get(h);
  }
  const u = { id: Symbol("window text rows"), row: i };
  return Ba.set(e, u), u;
}
function Oi() {
  const e = Me(Re, null), t = e ? fh(e) : null;
  return (n, a = {}) => Js(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Ti = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, kn = (e) => String(e || "").replace(Ti, (t, n, a, s) => s), hh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Rn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, mh = /^Traceback \(most recent call last\):/m, ph = 8;
function Ii(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ph).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function gh(e) {
  const t = [...e.matchAll(hh)].map((a) => a.index);
  if (Rn.lastIndex = 0, !t.length || !Rn.test(e)) return null;
  Rn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Rn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Ii(n), tail: "" } : null;
}
function vh(e) {
  const t = mh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Ii([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = kn(e), n = vh(t) || gh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const aa = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Bi = (e) => `${e.table}:${e.id}`, ws = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ra = 80;
function Wo(e) {
  return e.length <= Ra ? e : `${e.slice(0, Ra + 1).replace(/\s+\S*$/, "") || e.slice(0, Ra)}…`;
}
const Ho = {
  messages: (e) => Wo(ws(e.text)),
  comments: (e) => Wo(ws(e.text)),
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
}, yh = (e) => (Ho[e.table] ? Ho[e.table](e) : e.title || "") || "", Ct = (e) => aa(e.created_at), bh = (e) => aa(e.updated_at) || Ct(e), kh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, wh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function $h(e) {
  const t = kh.exec(e);
  if (t && gt(t[1])) return { at: t.index, length: t[0].length, table: gt(t[1]), id: Number(t[2]), label: t[3] };
  const n = wh.exec(e), a = n && gt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function xh(e, t, n, a) {
  const s = _i(a, e, t), o = kn(s ? yh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${rt(Vt(e).title)} ${t}</span><span class="row-card-title">${rt(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = $h(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: xh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Sh = /\.(png|jpe?g|gif|webp|svg)$/i, Mh = (e) => Sh.test(e), _h = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Ch = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Eh(e, t) {
  const n = _h.exec(e), [, a, s, o, l, i] = n || [], u = n && gt(a || o), c = u && _i(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Vt(u).title} ${c.id} · ${rt(i)}`, p = Mh(i) ? `<img class="file-card-image" src="${f}" alt="${rt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${rt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function Ah(e) {
  const t = Ch.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${rt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = Eh(e, t) || Ah(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Oh = /`([^`\n]+)`/g;
At((e) => e.replace(Oh, (t, n) => `<code>${n}</code>`));
const zo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Xs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(Ti, (n, a, s, o) => zo[a] ? zo[a](s, o, t) : o)
);
const Th = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ri = new RegExp(`\\b(${yi}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Li = new RegExp(`\\b(${yi}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Ih = new RegExp(`<code>((?:${Ri.source}|${Li.source}))</code>`, "gi"), Bh = (e) => e.replace(Ih, "$1"), Rh = (e, t) => `<a class="row-pill" href="#" data-peek="${gt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Lh = (e) => e.replace(Li, (t, n, a) => a.replace(/\d+/g, (s) => Rh(n.replace(/s$/i, ""), s))), Nh = (e) => Lh(e).replace(
  Ri,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${gt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Bh(e).split(Th).map((n, a) => a % 2 ? n : Nh(n)).join("")
);
const qh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Dh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Ph = /[\w\]]\(/, jh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Fh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Wh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Hh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, zh = /[[({,]$/, Uh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Gh = /^(\t|\s{2,})\S/, Vh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Kh = /`[^`]+`/, Yh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Qh = /[{}()[\];=<>$&|*\\@+^~%]/g, Ni = /^\s*(?:[-*+]|\d+[.)])\s/, Xh = /^\s*>/, Jh = /^\s*\|/, Zh = 0.6, em = 0.4, tm = 5, nm = 0.03, qi = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= tm && t.every((n) => Yh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Qh) ?? []).length / e.length < nm;
}, La = (e) => {
  const t = e.trim();
  return Kh.test(t) ? !1 : [qh, Dh, Ph, jh, Fh, Wh, Hh, zh, Uh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Gh.test(e) && !Ni.test(e) && !qi(e);
};
function am(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ni.test(t[0]) || t.every((o) => Xh.test(o) || Jh.test(o))) return "text";
  const n = t.filter((o) => !Vh.test(o.trim()));
  if (t.length === 1) return !n.length || La(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(La).length, s = n.filter((o) => !La(o) && qi(o)).length;
  return a >= n.length * Zh && s <= n.length * em ? "code" : "text";
}
const $s = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", sm = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", om = `${$s} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, lm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", im = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Uo = {
  js: { keywords: $s, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: sm, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: om, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: $s, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: lm, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: im, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, rm = {
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
function Go(e, t, n) {
  return n && e.startsWith(n, t);
}
function um(e, t) {
  const n = Uo[rm[t] ?? t] || Uo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Go(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Go(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? f.toLowerCase() : f, p = n.property && /^\s*:/.test(e.slice(o + f.length));
      l(a.has(h) ? "keyword" : p ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function cm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of um(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? rt(l) : `<span class="tok-${a}">${rt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function dm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const fm = 1500, Vo = /* @__PURE__ */ new WeakMap();
async function hm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await dm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Vo.get(t)), Vo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, fm)
  )));
}
typeof document < "u" && document.addEventListener("click", hm, !0);
const mm = /\n\s*\n/, pm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, gm = /^\s*(`{3,}|~{3,})\s*$/, vm = /^\s{4,}\S/, ym = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, xs = /^\s*(?:[-*+]|\d+[.)])\s/, Di = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, bm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Zs(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function km(e) {
  const t = Zs(e.join(`
`));
  return (bm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const wm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Di.test(t) && !xs.test(t);
}, $m = (e, t) => xs.test(t) || xs.test([...e].reverse().find((n) => n.trim()) || "");
function eo(e, t) {
  const n = t || km(e), a = cm(Zs(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function xm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && gm.test(s));
  return a < 0 ? e.length : a;
}
function Sm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return eo(a.map(kn), n ? n.toLowerCase() : "");
}
function Mm(e) {
  const t = e.split(mm).map((l) => ({ paragraph: l, type: am(Zs(l).split(`
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
      s(), n.push(eo(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(kn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function _m(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Mm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(pm);
    if (i) {
      const c = xm(n, l, i[2]);
      o(), a.push(Sm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = wm(s) ? ym : vm;
    if (!t && u.test(n[l]) && !$m(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Di.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(eo([...f, ...n.slice(l, c)].map(kn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => _m(e, t.document), { first: !0 });
const Cm = ["innerHTML"], Em = ["innerHTML"], Am = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Oi(), a = C(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Cm)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Em));
  }
}, lt = /* @__PURE__ */ H(Am, [["__scopeId", "data-v-d8e75741"]]), m6 = (e) => [...new Set(e.agents.map((t) => t.name))], Na = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, Om = "main agent", to = (e, t) => t ? Om : e, Tm = ["data-agent-main"], Im = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Bm = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Rm = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = C(() => to(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: K(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Im, [...s[0] || (s[0] = [
        m("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        m("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), F(le, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? b("", !0) : (r(), d("span", Bm, v(n.value), 1))
    ], 10, Tm));
  }
}, Dt = /* @__PURE__ */ H(Rm, [["__scopeId", "data-v-a4c3d1e5"]]), Lm = ["aria-expanded"], Nm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, qm = {
  key: 0,
  class: "tip-failure"
}, Dm = { key: 1 }, Pm = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(Re, null), a = C(() => vd(t.type, t.state)), s = A(!1), o = A([]), l = A("");
    async function i() {
      s.value = !0;
      const f = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      l.value = f.ok ? "" : f.error, f.ok && (o.value = f.value.lines ?? []);
    }
    const u = () => s.value = !1, c = () => s.value ? u() : i();
    return (f, h) => a.value ? (r(), d("span", {
      key: 0,
      class: "state-badge",
      tabindex: "0",
      role: "button",
      "aria-expanded": s.value,
      "data-state-badge": "",
      onMouseenter: i,
      onMouseleave: u,
      onFocus: i,
      onBlur: u,
      onClick: c,
      onKeydown: _t(u, ["escape"])
    }, [
      V(v(L(un)(e.type, e.state)) + " ", 1),
      s.value ? (r(), d("span", Nm, [
        l.value ? (r(), d("span", qm, v(l.value), 1)) : b("", !0),
        (r(!0), d(D, null, ne(o.value, (p) => (r(), d("span", {
          key: p,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : b("", !0)
    ], 40, Lm)) : (r(), d("span", Dm, v(L(un)(e.type, e.state)), 1));
  }
}, jm = /* @__PURE__ */ H(Pm, [["__scopeId", "data-v-bf9353d9"]]), Fm = {
  class: "plan-details",
  "data-plan-details": ""
}, Wm = { class: "state-line" }, Hm = {
  key: 0,
  class: "phase-count"
}, zm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Um = { class: "text" }, Gm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Vm = { class: "overall" }, Km = { class: "overall-figure" }, Ym = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Qm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, Xm = {
  key: 4,
  class: "part"
}, Jm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (r(), d("div", Fm, [
      m("div", Wm, [
        O(jm, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: K(["status", L(li)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (r(), d("span", Hm, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : b("", !0)
      ]),
      e.plan.reason ? (r(), d("section", zm, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Um, v(e.plan.reason), 1)
      ])) : b("", !0),
      e.plan.total ? (r(), d("section", Gm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Vm, [
          O(Mi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Km, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : b("", !0),
      e.plan.assignee ? (r(), d("p", Ym, [
        O(Dt, {
          name: e.plan.assignee.name,
          main: e.plan.assignee.main
        }, null, 8, ["name", "main"])
      ])) : e.plan.delegated ? (r(), d("p", Qm, [
        L(Na)(e.plan) ? (r(), F(Dt, {
          key: 0,
          name: L(Na)(e.plan).name,
          main: L(Na)(e.plan).main
        }, null, 8, ["name", "main"])) : (r(), d(D, { key: 1 }, [
          V(" Delegated ")
        ], 64))
      ])) : b("", !0),
      e.plan.brief ? (r(), d("section", Xm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        O(Si, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: P(() => [
            O(lt, {
              class: "text",
              "data-resource-text": "",
              text: e.plan.brief
            }, null, 8, ["text"])
          ]),
          _: 1
        }, 8, ["name"])
      ])) : b("", !0)
    ]));
  }
}, p6 = /* @__PURE__ */ H(Jm, [["__scopeId", "data-v-d555fe18"]]), Zm = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), F(Ve(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: P(() => [
        ue(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: K(["tip", e.place]),
          role: "tooltip"
        }, [
          ue(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, ep = /* @__PURE__ */ H(Zm, [["__scopeId", "data-v-683e1839"]]), tp = 5e3, np = "cancelled", qa = /* @__PURE__ */ new Map();
async function ap(e, t) {
  const n = `${e.environment}:${t}`, a = qa.get(n);
  if (a && performance.now() - a.at < tp) {
    const o = await a.answer;
    if (o.failure !== np) return o;
    qa.delete(n);
  }
  const s = e.read(`agent tip ${t}`);
  return qa.set(n, { answer: s, at: performance.now() }), s;
}
function sp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function wn(e, t = Date.now()) {
  const n = sp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const op = 36e5;
function lp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / op;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Ko(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Pi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Yo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Da = (e) => String(e).padStart(2, "0");
function ji(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Da(t % 60)}s` : `${Math.floor(t / 3600)}h ${Da(Math.floor(t % 3600 / 60))}m ${Da(t % 60)}s`;
}
const ip = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, rp = { state: "retired", words: "Retired" }, up = (e) => e.retired ? rp : ip[e.activity], cp = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), dp = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${wn(e, t)}` : "", fp = (e, t) => e ? `Seen: ${wn(e, t)}` : "", hp = {
  class: "line head",
  "data-agent-tip-head": ""
}, mp = {
  class: "line",
  "data-agent-tip-identity": ""
}, pp = {
  class: "line status",
  "data-agent-tip-status": ""
}, gp = ["data-state"], vp = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, yp = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, bp = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, kp = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, wp = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Me(Re, null), a = A(!1), s = A(null), o = A(""), l = A(Date.now()), i = C(() => up(s.value)), u = C(() => dp(s.value.since, l.value)), c = C(() => fp(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const h = await ap(n, t.agentId);
      o.value = h.ok ? "" : h.error, h.ok && (l.value = Date.now(), s.value = h.value);
    }
    return (h, p) => (r(), F(ep, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Dl({
      default: P(() => [
        ue(h.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: P(() => [
          s.value ? (r(), d(D, { key: 0 }, [
            m("span", hp, [
              m("b", null, v(s.value.title), 1),
              s.value.name ? (r(), d(D, { key: 0 }, [
                V(v(s.value.name), 1)
              ], 64)) : b("", !0)
            ]),
            m("span", mp, v(L(cp)(s.value)), 1),
            m("span", pp, [
              m("i", {
                "data-state": i.value.state
              }, null, 8, gp),
              V(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", vp, v(u.value), 1)) : b("", !0),
            c.value ? (r(), d("span", yp, v(c.value), 1)) : b("", !0)
          ], 64)) : (r(), d("b", bp, v(e.label), 1)),
          o.value ? (r(), d("span", kp, v(o.value), 1)) : b("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, ba = /* @__PURE__ */ H(wp, [["__scopeId", "data-v-9b0dfe81"]]), $p = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, xp = { class: "agent-word" }, Sp = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = C(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", $p, [
      (r(!0), d(D, null, ne(s.value, (i) => (r(), F(ba, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: L(to)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => L(De)(`agents:${i.id}`)
      }, {
        default: P(() => [
          m("span", {
            class: K(["agent-dot", { held: i.held }])
          }, null, 2),
          O(Dt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          m("span", xp, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : b("", !0);
  }
}, Mp = /* @__PURE__ */ H(Sp, [["__scopeId", "data-v-619caeed"]]), _p = { class: "phases" }, Cp = { class: "phead" }, Ep = { class: "mark" }, Ap = { class: "ptitle" }, Op = { class: "phead-end" }, Tp = {
  key: 0,
  class: "checkpoint"
}, Ip = { class: "progress" }, Bp = {
  key: 0,
  class: "when"
}, Rp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", _p, [
      (r(!0), d(D, null, ne(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: K(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", Cp, [
          m("span", Ep, [
            O(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Ap, v(i + 1) + ". " + v(l.title), 1),
          m("span", Op, [
            l.checkpoint ? (r(), d("span", Tp, "checkpoint")) : b("", !0),
            m("span", Ip, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", Bp, v(l.goal), 1)) : b("", !0),
        O(Mp, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(D, null, ne(l.tasks, (u) => ue(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, g6 = /* @__PURE__ */ H(Rp, [["__scopeId", "data-v-05aaa685"]]), Lp = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Np = { ...Lp, done: "Completed" }, qp = /* @__PURE__ */ new Set(["completed", "cancelled"]), Dp = (e) => qp.has(e), dn = (e) => Dp(e) ? "done" : e, Pp = { class: "task-status-icon" }, jp = ["width", "height", "aria-label"], Fp = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = C(() => li("task", dn(t.status))), a = C(() => n.value === "testing" ? "started" : n.value), s = C(() => Np[t.status] ?? un("task", t.status));
    return (o, l) => (r(), d("span", Pp, [
      O(Ut, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (r(), d("svg", {
            key: n.value,
            class: K(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            O(Gt, { value: a.value }, {
              blocked: P(() => [...l[0] || (l[0] = [
                m("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: P(() => [...l[1] || (l[1] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                m("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: P(() => [...l[2] || (l[2] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: P(() => [...l[3] || (l[3] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: P(() => [...l[4] || (l[4] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                m("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: P(() => [...l[5] || (l[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...l[6] || (l[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, jp))
        ]),
        _: 1
      })
    ]));
  }
}, ka = /* @__PURE__ */ H(Fp, [["__scopeId", "data-v-ae24a63f"]]), Wp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, Hp = {
  key: 0,
  class: "empty",
  role: "alert"
}, zp = {
  key: 2,
  class: "empty"
}, Up = { class: "day" }, Gp = { class: "events" }, Vp = { class: "mark" }, Kp = { class: "what" }, Yp = { class: "head" }, Qp = { class: "word" }, Xp = ["title", "onClick"], Jp = { class: "at" }, Zp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = A(null), l = A(""), i = C(() => {
      const f = /* @__PURE__ */ new Map();
      for (const h of o.value ?? []) {
        const p = new Date(h.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        f.set(p, [...f.get(p) ?? [], h]);
      }
      return [...f].map(([h, p]) => ({ day: h, items: p }));
    }), u = (f) => new Date(f).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const f = await a.read(["plan", "timeline", String(a.id)]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.events : [];
    }
    return pe(() => a.id, c, { immediate: !0 }), (f, h) => (r(), d("section", Wp, [
      l.value ? (r(), d("p", Hp, v(l.value), 1)) : o.value === null ? (r(), F(Ye, { key: 1 })) : o.value.length ? b("", !0) : (r(), d("p", zp, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(D, null, ne(i.value, (p) => (r(), d(D, {
        key: p.day
      }, [
        m("h3", Up, v(p.day), 1),
        m("ol", Gp, [
          (r(!0), d(D, null, ne(p.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: K(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", Vp, [
              n[y.event_type].state ? (r(), F(ka, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), F(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", Kp, [
              m("div", Yp, [
                m("span", Qp, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (k) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, Xp),
                m("span", Jp, v(u(y.time)), 1)
              ]),
              y.text ? (r(), F(lt, {
                key: 0,
                class: "text",
                text: y.text
              }, null, 8, ["text"])) : b("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, v6 = /* @__PURE__ */ H(Zp, [["__scopeId", "data-v-9e511133"]]), e1 = 1e3;
function Fi() {
  const e = A(Date.now()), t = setInterval(() => e.value = Date.now(), e1);
  return tt(() => clearInterval(t)), e;
}
const t1 = Symbol("resource-subscriptions");
function $n(e, t, n = () => !0) {
  const a = Me(t1, () => new Zl(), !0), s = Ws(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  ma(() => {
    o(), s.cancel();
  });
}
const Wi = (e, t) => !e.row_id || t.has(e.row_id), n1 = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, y6 = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, a1 = "Not known", s1 = 80, o1 = 1e3, l1 = "worker", i1 = "main", r1 = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), u1 = (e) => e.ok ? e.value.rows : [], c1 = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), d1 = (e, t) => (t == null ? void 0 : t.given_name) || c1((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), f1 = (e, t) => e.ended_at ? "ended" : e.paused_at || r1.has(t == null ? void 0 : t.state) ? "waiting" : "running", Hi = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function h1({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / o1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: ji(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > s1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? a1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === l1 && l.push({ key: "pace", label: "Tasks an hour", value: String(lp(Hi(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === i1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function m1(e) {
  const t = Hi(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function p1(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Ko(e.created_at)]), e.ended_at && n.push(["Ended", Ko(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const g1 = { class: "band" }, v1 = { key: 0 }, y1 = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", g1, [
      O(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", v1, v(e.count), 1)) : b("", !0)
    ]));
  }
}, Wt = /* @__PURE__ */ H(y1, [["__scopeId", "data-v-1758914f"]]), b1 = { class: "number" }, k1 = { class: "text" }, w1 = 150, $1 = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = A(!1), a = C(() => t.text.length > w1), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(D, null, [
      e.text ? (r(), d(D, { key: 0 }, [
        O(Wt, { icon: "file" }, {
          default: P(() => [
            V(v(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: K(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : b("", !0)
      ], 64)) : b("", !0),
      e.points.length ? (r(), d(D, { key: 1 }, [
        O(Wt, { icon: "points" }, {
          default: P(() => [...l[1] || (l[1] = [
            V("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(D, null, ne(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", b1, v(i.id), 1),
            m("span", k1, [
              V(v(i.text), 1),
              m("span", {
                class: K(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : b("", !0)
    ], 64));
  }
}, x1 = /* @__PURE__ */ H($1, [["__scopeId", "data-v-c99de22c"]]), S1 = ["aria-expanded"], M1 = { class: "count" }, _1 = {
  key: 0,
  "data-agent-fold-body": ""
}, C1 = {
  __name: "AgentFold",
  props: /* @__PURE__ */ jt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = ln(e, "open");
    return (n, a) => (r(), d(D, null, [
      m("button", {
        type: "button",
        class: K(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        O(le, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        V(v(e.label), 1),
        m("span", M1, v(e.count), 1),
        O(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, S1),
      t.value ? (r(), d("div", _1, [
        ue(n.$slots, "default", {}, void 0, !0)
      ])) : b("", !0)
    ], 64));
  }
}, Pa = /* @__PURE__ */ H(C1, [["__scopeId", "data-v-7f93d8d9"]]), E1 = ["onClick"], A1 = { class: "text" }, O1 = { class: "aside" }, T1 = {
  key: 0,
  class: "none"
}, I1 = {
  class: "skills",
  "data-agent-skills": ""
}, B1 = {
  key: 0,
  class: "none-inline"
}, R1 = { class: "label" }, L1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = zt({ helpers: !1, skills: !1 }), a = A([]), s = A([]), o = async (i) => u1(await t.read(i));
    pe(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Jn(i.role)} ${i.id}`;
    return (i, u) => (r(), d(D, null, [
      O(Pa, {
        open: n.helpers,
        "onUpdate:open": u[0] || (u[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: P(() => [
          (r(!0), d(D, null, ne(a.value, (c) => (r(), d("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (f) => L(yt)("agents", c.id)
          }, [
            m("span", A1, v(l(c)), 1),
            m("span", O1, v(L(Jn)(c.role)) + " " + v(c.id), 1)
          ], 8, E1))), 128)),
          a.value.length ? b("", !0) : (r(), d("p", T1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      O(Pa, {
        open: n.skills,
        "onUpdate:open": u[1] || (u[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: P(() => [
          m("p", I1, [
            (r(!0), d(D, null, ne(s.value, (c) => (r(), d("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? b("", !0) : (r(), d("span", B1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      O(Pa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: P(() => [
          (r(!0), d(D, null, ne(e.details, ([c, f, h]) => (r(), d("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", R1, v(c) + ":", 1),
            m("span", {
              class: K(["value", h])
            }, v(f), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, N1 = /* @__PURE__ */ H(L1, [["__scopeId", "data-v-358a0300"]]), q1 = ["datetime", "title"], et = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Fi(), a = C(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(L(wn)(e.at, L(n))), 9, q1));
  }
}, D1 = {
  class: "now",
  "data-agent-now": ""
}, P1 = {
  key: 1,
  class: "muted"
}, j1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, F1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, W1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, H1 = { class: "line" }, z1 = { class: "detail" }, U1 = { class: "bar" }, G1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = C(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(D, null, [
      O(Wt, { icon: "play" }, {
        default: P(() => [...o[2] || (o[2] = [
          V("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", D1, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => L(yt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", P1, v(e.nothing), 1)),
        n.value ? (r(), d("span", j1, v(n.value), 1)) : b("", !0),
        e.inspection.last_activity ? (r(), d("span", F1, [
          o[3] || (o[3] = V("Seen: ", -1)),
          O(et, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : b("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", W1, [
        m("div", H1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => L(yt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", z1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", U1, [
          m("i", {
            style: ye({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : b("", !0)
    ], 64));
  }
}, V1 = /* @__PURE__ */ H(G1, [["__scopeId", "data-v-ff25c609"]]), K1 = ["onClick"], Y1 = { class: "text" }, Q1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, X1 = { class: "text" }, J1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Z1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(D, null, [
      O(Wt, { icon: "clock" }, {
        default: P(() => [...n[0] || (n[0] = [
          V("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(D, null, ne(e.moves, (a) => (r(), d(D, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => L(yt)(a.table, a.id)
        }, [
          m("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          m("span", Y1, v(a.text), 1),
          O(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, K1)) : (r(), d("div", Q1, [
          m("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          m("span", X1, v(a.text), 1),
          O(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? b("", !0) : (r(), d("p", J1, "Nothing yet."))
    ], 64));
  }
}, eg = /* @__PURE__ */ H(Z1, [["__scopeId", "data-v-58f0db57"]]), tg = {
  class: "strip",
  "data-agent-strip": ""
}, ng = ["data-agent-cell"], ag = {
  key: 0,
  class: "meter"
}, sg = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", tg, [
      (r(!0), d(D, null, ne(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: K({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", ag, [
          m("i", {
            class: K({ high: a.high }),
            style: ye({ width: `${a.meter}%` })
          }, null, 6)
        ])) : b("", !0)
      ], 8, ng))), 128))
    ]));
  }
}, og = /* @__PURE__ */ H(sg, [["__scopeId", "data-v-b6657ab7"]]), lg = {}, ig = { class: "menu-label" };
function rg(e, t) {
  return r(), d("span", ig, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Mt = /* @__PURE__ */ H(lg, [["render", rg], ["__scopeId", "data-v-aa955b3e"]]), ug = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, cg = {
  key: 0,
  class: "skills-none"
}, dg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => n.skills.filter((l) => l.state === "loaded")), o = C(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", ug, [
      O(Mt, null, {
        default: P(() => [...i[1] || (i[1] = [
          V("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? b("", !0) : (r(), d("p", cg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(D, null, ne(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        O(le, {
          name: "book",
          size: 12
        }),
        V(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(D, { key: 1 }, [
        O(Mt, null, {
          default: P(() => [...i[2] || (i[2] = [
            V("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(D, null, ne(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          O(le, {
            name: "book",
            size: 12
          }),
          V(v(u.skill), 1)
        ]))), 128))
      ], 64)) : b("", !0),
      O(ze, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: P(() => [...i[3] || (i[3] = [
          V("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, fg = /* @__PURE__ */ H(dg, [["__scopeId", "data-v-be514d47"]]), hg = ["disabled", "title"], mg = { class: "gauge usage" }, pg = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => n.windows[0] ?? null), o = C(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = C(() => o.value !== null && o.value >= 100), i = C(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), u = C(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, f) => o.value !== null ? (r(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: u.value,
      onClick: f[0] || (f[0] = (h) => a("open", h.currentTarget))
    }, [
      O(le, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = V()),
      m("span", mg, [
        m("span", {
          style: ye({ width: `${o.value}%` })
        }, null, 4)
      ]),
      V(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, hg)) : b("", !0);
  }
}, gg = /* @__PURE__ */ H(pg, [["__scopeId", "data-v-a36f09dc"]]), vg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: K(["badge", e.tone])
    }, v(e.text), 3));
  }
}, no = /* @__PURE__ */ H(vg, [["__scopeId", "data-v-9e7e1157"]]);
function yg(e, t, n, { groups: a, programs: s }) {
  const o = A({}), l = A(""), i = A(!1), u = C(() => !!e.value && !e.value.ended_at), c = C(() => u.value && !!e.value.paused_at);
  async function f(k, T = null) {
    l.value = "";
    const S = await zl(T, k, t);
    return l.value = S.ok ? "" : S.error, n(), S;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (k, T) => f(["agent", "control", String(e.value.id), k, T.value], { target: o, fields: { value: { ...o.value, [k]: T.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (k) => f(["agent", "launch", k.name]) };
}
function bg(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const kg = ["disabled", "title"], wg = ["disabled", "title"], $g = { class: "gauge" }, xg = ["disabled", "title"], Sg = ["disabled"], Mg = ["disabled"], _g = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Cg = ["title"], Eg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ag = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Og = { class: "gauge" }, Tg = { class: "context-used" }, Ig = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Bg = 75, Rg = {
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
    const n = e, a = t, s = yg(Ca(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ca(n, "controlGroups"), programs: Ca(n, "agentPrograms") }), o = A(null), l = A(""), i = C(() => s.groups.value.find((N) => N.key === l.value));
    function u(N, w) {
      o.value = N.currentTarget, l.value = w;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = C(() => n.skills.filter((N) => N.state === "loaded"));
    function h(N) {
      u(N, "skills"), a("skills");
    }
    const p = (N) => s.groups.value.some((w) => w.key === N), y = C(() => {
      var N;
      return s.chosen.value.model ?? ((N = T.value) == null ? void 0 : N.model) ?? "";
    }), k = C(() => {
      var N;
      return s.chosen.value.effort ?? ((N = T.value) == null ? void 0 : N.effort) ?? "";
    });
    C(() => !!n.agent && !n.agent.ended_at);
    const T = C(() => {
      var N;
      return ((N = n.usage.agents) == null ? void 0 : N.find((w) => {
        var z;
        return w.id === ((z = n.agent) == null ? void 0 : z.id);
      })) ?? null;
    }), S = C(() => {
      var N;
      return ((N = T.value) == null ? void 0 : N.context_percent) == null ? null : Math.round(T.value.context_percent);
    }), x = (N) => `${Math.round(N / 1e3)}k`, B = C(() => {
      var N;
      return (N = T.value) != null && N.context_limit_tokens ? `${x(T.value.context_tokens ?? 0)} of ${x(T.value.context_limit_tokens)}` : "";
    }), W = C(() => {
      var N;
      return (N = T.value) != null && N.cost_dollars ? `$${T.value.cost_dollars.toFixed(2)}` : "";
    });
    return (N, w) => {
      var z;
      return r(), d("div", {
        class: K(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(D, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: w[0] || (w[0] = (j) => u(j, "agent"))
          }, [
            O(le, {
              name: "agents",
              size: 12
            }),
            V(" " + v(((z = e.agentPrograms.find((j) => j.name === e.agent.program)) == null ? void 0 : z.title) || e.agent.program), 1)
          ], 8, kg),
          O(gg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: w[1] || (w[1] = (j) => a("open", "usage", j))
          }, null, 8, ["windows", "disabled"]),
          S.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${S.value}% full: clear or compact it`,
            onClick: w[2] || (w[2] = (j) => p("context") ? u(j, "context") : a("open", "context", j.currentTarget))
          }, [
            O(le, {
              name: "gauge",
              size: 12
            }),
            w[14] || (w[14] = V()),
            m("span", $g, [
              m("span", {
                style: ye({ width: `${S.value}%` })
              }, null, 4)
            ]),
            V(" " + v(S.value) + "% ", 1)
          ], 8, wg)) : b("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: w[3] || (w[3] = (j) => p("model") ? u(j, "model") : null)
          }, [
            O(le, {
              name: "model",
              size: 12
            }),
            V(" " + v(y.value), 1)
          ], 8, xg)) : b("", !0),
          p("effort") || e.card && k.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: w[4] || (w[4] = (j) => u(j, "effort"))
          }, [
            O(le, {
              name: "bolt",
              size: 12
            }),
            V(" " + v(k.value), 1)
          ], 8, Sg)) : b("", !0),
          W.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: w[5] || (w[5] = (j) => a("open", "cost", j.currentTarget))
          }, v(W.value), 9, Mg)) : b("", !0),
          e.branch ? (r(), d("span", _g, [
            O(le, {
              name: "branch",
              size: 12
            }),
            V(" " + v(e.branch), 1)
          ])) : b("", !0),
          e.card ? b("", !0) : (r(), d("button", {
            key: 5,
            type: "button",
            class: K(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: w[6] || (w[6] = (j) => a("open", "jobs", j.currentTarget))
          }, [
            O(le, {
              name: "clock",
              size: 12
            }),
            V(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: h
          }, [
            O(le, {
              name: "book",
              size: 12
            }),
            V(" " + v(f.value.length), 1)
          ])) : b("", !0),
          e.fitness ? (r(), d(D, { key: 7 }, [
            m("button", {
              type: "button",
              class: K(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Bg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: w[7] || (w[7] = (j) => a("open", "fitness", j.currentTarget))
            }, [
              O(le, {
                name: "heart",
                size: 12
              }),
              V(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: K(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: w[8] || (w[8] = (j) => a("open", "load", j.currentTarget))
            }, [
              O(le, {
                name: "weight",
                size: 12
              }),
              V(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : b("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: w[9] || (w[9] = (j) => u(j, "start"))
        }, [
          O(le, {
            name: "agents",
            size: 12
          }),
          w[15] || (w[15] = V(" Start an agent", -1))
        ])) : b("", !0),
        w[21] || (w[21] = m("span", { class: "space" }, null, -1)),
        L(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: L(s).failure.value
        }, v(L(s).failure.value), 9, Cg)) : b("", !0),
        ue(N.$slots, "default", {}, void 0, !0),
        o.value ? (r(), F(pa, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: P(() => {
            var j;
            return [
              l.value === "agent" ? (r(), d(D, { key: 0 }, [
                L(s).asking.value ? (r(), d(D, { key: 0 }, [
                  O(Mt, { "data-agent-stop-ask": "" }, {
                    default: P(() => [...w[16] || (w[16] = [
                      V("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  O(ze, {
                    "data-agent-stop-confirm": "",
                    onClick: w[10] || (w[10] = (q) => (c(), L(s).stop()))
                  }, {
                    default: P(() => [...w[17] || (w[17] = [
                      V("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  O(ze, {
                    onClick: w[11] || (w[11] = (q) => L(s).asking.value = !1)
                  }, {
                    default: P(() => [...w[18] || (w[18] = [
                      V("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), F(ze, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: w[12] || (w[12] = (q) => L(s).asking.value = !0)
                }, {
                  default: P(() => [...w[19] || (w[19] = [
                    V("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(D, { key: 1 }, [
                O(Mt, null, {
                  default: P(() => [...w[20] || (w[20] = [
                    V("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(D, null, ne(L(s).programs.value, (q) => (r(), F(ze, {
                  key: q.name,
                  "data-agent-program": q.name,
                  onClick: (_) => (c(), L(s).start(q))
                }, {
                  default: P(() => [
                    V(v(q.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), F(fg, {
                key: 2,
                skills: e.skills,
                onBrowse: w[13] || (w[13] = (q) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(D, { key: 3 }, [
                O(Mt, null, {
                  default: P(() => [
                    V(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(D, { key: 0 }, [
                  m("p", Eg, v(L(bg)(((j = T.value) == null ? void 0 : j.last_compaction) ?? null)), 1),
                  m("div", Ag, [
                    m("span", Og, [
                      m("span", {
                        style: ye({ width: `${S.value}%` })
                      }, null, 4)
                    ]),
                    m("span", Tg, v(S.value) + "%", 1)
                  ]),
                  B.value ? (r(), d("p", Ig, [
                    V(v(B.value) + " ", 1),
                    O(no, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : b("", !0)
                ], 64)) : b("", !0),
                (r(!0), d(D, null, ne(i.value.choices, (q) => (r(), F(ze, {
                  key: q.value,
                  "data-agent-choice": q.value,
                  onClick: (_) => (L(s).choose(i.value.key, q), c())
                }, {
                  default: P(() => [
                    V(v(q.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : b("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : b("", !0)
      ], 2);
    };
  }
}, Lg = /* @__PURE__ */ H(Rg, [["__scopeId", "data-v-dc15ff96"]]), Ng = {
  class: "who",
  "data-agent-who": ""
}, qg = { class: "name" }, Dg = ["data-agent-state"], Pg = {
  class: "sub",
  "data-agent-started-by": ""
}, jg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Ng, [
      m("h2", qg, [
        m("i", {
          class: K(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, Dg),
        V(v(e.name), 1)
      ]),
      O(Lg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", Pg, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, Fg = /* @__PURE__ */ H(jg, [["__scopeId", "data-v-83bd4a9d"]]), Wg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, Hg = { class: "scroll" }, zg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Ug = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, Gg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Fi(), a = A(null), s = A(null), o = A(null), l = A({}), i = A({ helpers: 0, skills: 0 }), u = A(0), c = A([]), f = A([]), h = A("");
    let p = 0;
    const y = C(() => {
      var x;
      return a.value.ended_at ? m1(s.value) : `It has no task.${(x = s.value) != null && x.instruction ? " It was given an instruction." : ""}`;
    });
    async function k() {
      const x = ++p, B = await t.read(["usage", "inspector", String(t.id), "--environment", t.environment]);
      x === p && (h.value = B.ok ? "" : B.error, B.ok && (a.value = B.value.agent, s.value = B.value.facts, o.value = B.value.inspection, l.value = B.value.tool, i.value = { helpers: B.value.helpers, skills: B.value.skills }, c.value = B.value.points, f.value = B.value.programs, u.value += 1));
    }
    const T = C(() => /* @__PURE__ */ new Set([t.id])), S = {
      agent: (x) => Wi(x, T.value),
      hook_call: (x) => n1(x, "session_agent_id", T.value)
    };
    return $n(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], k, (x) => {
      var B;
      return ((B = S[x.event.split(".")[0]]) == null ? void 0 : B.call(S, x)) ?? !0;
    }), _e(k), (x, B) => {
      var W, N;
      return r(), d("article", Wg, [
        m("div", Hg, [
          h.value ? (r(), d("p", zg, v(h.value), 1)) : a.value && o.value ? (r(), d(D, { key: 1 }, [
            O(Fg, {
              name: L(d1)(a.value, s.value),
              state: L(f1)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: f.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            O(og, {
              cells: L(h1)({ row: a.value, facts: s.value, inspection: o.value, now: L(n) })
            }, null, 8, ["cells"]),
            O(V1, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            O(x1, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((N = s.value) == null ? void 0 : N.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            O(eg, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            O(N1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: u.value,
              details: L(p1)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", Ug, "Ended " + v(L(wn)(a.value.ended_at, L(n))) + ". It takes no more actions.", 1)) : b("", !0)
          ], 64)) : (r(), F(Ye, { key: 2 }))
        ])
      ]);
    };
  }
}, b6 = /* @__PURE__ */ H(Gg, [["__scopeId", "data-v-26d7ee78"]]), Vg = ["aria-expanded"], Kg = { class: "drop-label" }, Yg = ["value"], Qg = {
  key: 1,
  class: "drop-lead"
}, Xg = { class: "drop-item-text" }, Jg = {
  key: 2,
  class: "drop-note"
}, Zg = {
  key: 1,
  class: "drop-none"
}, ev = {
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
    const n = e, a = t, s = A(!1), o = A(null), l = A(""), i = C(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function u(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (r(), d("div", {
      class: K(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: K(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (r(), F(le, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : b("", !0),
        m("span", Kg, v(e.label), 1),
        O(le, {
          name: "down",
          size: 11
        })
      ], 10, Vg),
      s.value ? (r(), F(pa, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (h) => s.value = !1)
      }, {
        default: P(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (h) => l.value = h.target.value)
          }, null, 40, Yg)) : b("", !0),
          (r(!0), d(D, null, ne(i.value, (h) => (r(), F(ze, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => u(h)
          }, {
            default: P(() => [
              h.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: K(["drop-dot", { live: h.running }])
              }, null, 2)) : b("", !0),
              h.lead ? (r(), d("span", Qg, v(h.lead), 1)) : b("", !0),
              m("span", Xg, v(h.label), 1),
              h.note ? (r(), d("span", Jg, v(h.note), 1)) : b("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? b("", !0) : (r(), d("p", Zg, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : b("", !0)
    ], 2));
  }
}, zi = /* @__PURE__ */ H(ev, [["__scopeId", "data-v-29dfcce5"]]);
function tv(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), tt(() => n.disconnect()), t;
}
const nv = ["data-comment-id"], av = {
  key: 0,
  class: "comment-top"
}, sv = { class: "comment-mark" }, ov = {
  class: "comment-body",
  "data-comment": ""
}, lv = { class: "comment-foot" }, iv = {
  key: 1,
  "data-comment-lost": ""
}, rv = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (r(), d("article", {
      class: K(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (r(), d("div", av, [
        m("span", sv, v(e.comment.number), 1),
        m("span", {
          class: K(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : b("", !0),
      m("p", ov, v(e.comment.body), 1),
      m("div", lv, [
        e.comment.created_at ? (r(), F(et, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : b("", !0),
        e.lost ? (r(), d("span", iv, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : b("", !0)
      ])
    ], 10, nv));
  }
}, Ui = /* @__PURE__ */ H(rv, [["__scopeId", "data-v-a37d4507"]]);
var ql;
/Mac|iPhone|iPad/.test(((ql = navigator.userAgentData) == null ? void 0 : ql.platform) || navigator.platform);
function Gi(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const uv = {
  class: "comment-box",
  "data-comment-box": ""
}, cv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, dv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, fv = { class: "comment-row" }, hv = ["placeholder"], mv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ jt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ jt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = ln(e, "draft"), l = A(""), i = A(!1), u = A(null), c = C(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = C(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await je(), h();
        } catch (k) {
          l.value = k.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, k) => (r(), d("div", uv, [
      e.selection ? (r(), d("div", cv, [
        k[3] || (k[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: K(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        O(ga, {
          title: "Comment on the whole document instead",
          onClick: k[0] || (k[0] = (T) => s("clear"))
        })
      ])) : b("", !0),
      l.value ? (r(), d("p", dv, v(l.value), 1)) : b("", !0),
      m("div", fv, [
        Ze(m("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": k[1] || (k[1] = (T) => o.value = T),
          rows: "1",
          maxlength: "2000",
          class: K({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: k[2] || (k[2] = _t((T) => L(Gi)(T, p), ["enter"]))
        }, null, 42, hv), [
          [Xn, o.value]
        ]),
        O(ge, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: P(() => [...k[4] || (k[4] = [
            V("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, pv = /* @__PURE__ */ H(mv, [["__scopeId", "data-v-41d2081c"]]), Ln = (e) => e ? e.split(", ") : [];
function gv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function vv(e, t) {
  return {
    reads: Ln(e.reads_allowed),
    runs: Ln(e.runs_allowed),
    missing: [...Ln(e.reads_missing), ...Ln(e.runs_missing)],
    ask: t
  };
}
const yv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = su("SkeletonParts", !0);
      return r(!0), d(D, null, ne(e.parts, (u, c) => (r(), d(D, { key: c }, [
        (r(!0), d(D, null, ne(u.count, (f) => (r(), F(Gt, {
          key: f,
          value: u.shape
        }, {
          line: P(() => [
            O(en, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            O(en, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            O(en, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: P(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            m("div", {
              class: "skeleton-row",
              style: ye(a(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            m("div", {
              class: "skeleton-stack",
              style: ye(a(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ye(a(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            m("div", {
              class: "skeleton-grid",
              style: ye(s(u))
            }, [
              O(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), bv = /* @__PURE__ */ H(yv, [["__scopeId", "data-v-fa8baeaf"]]), kv = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, wv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", kv, [
      O(bv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ao = /* @__PURE__ */ H(wv, [["__scopeId", "data-v-52f66b64"]]), Vi = {
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
}, $v = { class: "bars" }, xv = { class: "bar-name" }, Sv = { class: "bar-value" }, Mv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = C(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", $v, [
      (r(!0), d(D, null, ne(e.items, (u, c) => (r(), F(Ve(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: K(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: P(() => [
          m("span", xv, v(u.label), 1),
          O(Mi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Sv, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, _v = /* @__PURE__ */ H(Mv, [["__scopeId", "data-v-663427f4"]]), Cv = { class: "bars" }, Ev = {
  key: 0,
  class: "bars-title"
}, Av = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Cv, [
      e.node.title ? (r(), d("span", Ev, v(e.node.title), 1)) : b("", !0),
      O(_v, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Ov = /* @__PURE__ */ H(Av, [["__scopeId", "data-v-7135bb11"]]), Tv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = C(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: K([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ye(o.value)
    }, [
      (r(!0), d(D, null, ne(e.node.children || [], (u, c) => (r(), F(Ki, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, zn = /* @__PURE__ */ H(Tv, [["__scopeId", "data-v-d142a3f4"]]), Iv = {
  key: 0,
  class: "card-head"
}, Bv = { class: "card-title" }, Rv = {
  key: 0,
  class: "card-note"
}, Lv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: K(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", Iv, [
        m("span", Bv, v(e.node.title), 1),
        e.node.note ? (r(), d("span", Rv, v(e.node.note), 1)) : b("", !0)
      ])) : b("", !0),
      O(zn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Nv = /* @__PURE__ */ H(Lv, [["__scopeId", "data-v-67b72d40"]]), qv = { class: "fact" }, Dv = { class: "fact-label" }, Pv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", qv, [
      m("span", Dv, v(e.label), 1),
      O(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, jv = /* @__PURE__ */ H(Pv, [["__scopeId", "data-v-3a88ecf8"]]), Fv = { class: "list" }, Wv = { class: "list-label" }, Hv = {
  key: 1,
  class: "list-note"
}, zv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Fv, [
      (r(!0), d(D, null, ne(e.items, (o, l) => (r(), F(Ve(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: K(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          m("span", Wv, v(o.label), 1),
          o.badge ? (r(), F(no, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : b("", !0),
          o.note ? (r(), d("span", Hv, v(o.note), 1)) : b("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Uv = /* @__PURE__ */ H(zv, [["__scopeId", "data-v-ebe2ae0a"]]), Gv = { class: "table" }, Vv = {
  key: 0,
  class: "table-row empty"
}, Kv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", Gv, [
      m("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (r(!0), d(D, null, ne(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(D, null, ne(e.rows, (i, u) => (r(), F(Ve(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: K(["table-row", i.tone, { opens: i.open }]),
        style: ye(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          (r(!0), d(D, null, ne(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", Vv, v(e.empty), 1)) : b("", !0)
    ]));
  }
}, Yv = /* @__PURE__ */ H(Kv, [["__scopeId", "data-v-9326a52e"]]), Qv = { class: "stat-value" }, Xv = { class: "stat-label" }, Jv = {
  key: 0,
  class: "stat-note"
}, Zv = {
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
    return (a, s) => (r(), F(Ve(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: K(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        m("span", Qv, v(e.value), 1),
        m("span", Xv, v(e.label), 1),
        e.note ? (r(), d("span", Jv, v(e.note), 1)) : b("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ey = /* @__PURE__ */ H(Zv, [["__scopeId", "data-v-ad0db6d6"]]), ty = { class: "code" }, ny = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (r(), F(Gt, {
      value: e.node.type
    }, {
      stack: P(() => [
        O(zn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: P(() => [
        O(zn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: P(() => [
        O(zn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        O(Nv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        m("h3", {
          class: K(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: P(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        O(ey, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        O(Ov, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        O(Yv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        O(Uv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        O(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        O(jv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        O(no, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        m("pre", ty, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Ki = /* @__PURE__ */ H(ny, [["__scopeId", "data-v-cbdcf540"]]), ay = { class: "dashboard" }, sy = { class: "trail" }, oy = ["onClick"], ly = {
  key: 0,
  class: "gone",
  role: "status"
}, iy = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = A(!!n.page && !s(n.page)), l = A(n.page && !o.value ? [n.page] : []), i = C(() => l.value.at(-1) || n.document.start), u = C(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return pe(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (r(), d("div", ay, [
      e.document.broken ? (r(), F(rn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          V(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), F(rn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          V(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(D, { key: 2 }, [
        m("nav", sy, [
          m("button", {
            type: "button",
            class: K(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (k) => h(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(D, null, ne(l.value, (k, T) => (r(), d(D, {
            key: `${T}-${k}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: K(["step", { current: T === l.value.length - 1 }]),
              onClick: (S) => h(T + 1)
            }, v(c(k)), 11, oy)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", ly, "What you opened is no longer in this dashboard. Here is its start page.")) : b("", !0),
        O(Ut, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              O(Ki, {
                node: u.value.view,
                onOpen: f,
                onFile: y[1] || (y[1] = (k) => a("file", k))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : b("", !0)
    ]));
  }
}, ry = /* @__PURE__ */ H(iy, [["__scopeId", "data-v-fbe83734"]]);
function uy(e, t) {
  const n = nt(), a = Ws(e, Vi.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), tt(() => {
    s(), a.cancel();
  });
}
const cy = {
  key: 0,
  class: "window-failure"
}, dy = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = nt(), o = A(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? uy(l, n.events) : js(l, () => !0, Vi.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", cy, v(o.value.error), 1)) : o.value ? (r(), F(ry, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : b("", !0);
  }
}, fy = 1e4;
class hy {
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
    return this.heardAt !== null && t - this.heardAt > fy;
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
const my = {
  key: 0,
  class: "frame-note"
}, py = {
  key: 0,
  class: "frame-note"
}, gy = ["src", "title"], vy = 1e3, yy = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = nt(), a = A(null), s = A(!1), o = A(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new hy(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, vy);
    }), Be(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", my, "This window was closed because it stopped answering.")) : (r(), d(D, { key: 1 }, [
      s.value ? (r(), d("div", py, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        O(ge, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: P(() => [...c[1] || (c[1] = [
            V("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : b("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: L(n).window
      }, null, 8, gy)
    ], 64));
  }
}, by = /* @__PURE__ */ H(yy, [["__scopeId", "data-v-32a49046"]]), ky = {
  class: "allowance-prompt",
  role: "dialog"
}, wy = { class: "allowance-prompt-text" }, $y = { class: "allowance-prompt-buttons" }, xy = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", ky, [
      m("p", wy, v(L(gv)(e.request)), 1),
      m("div", $y, [
        O(ge, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            V("Allow", -1)
          ])]),
          _: 1
        }),
        O(ge, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            V("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Sy = /* @__PURE__ */ H(xy, [["__scopeId", "data-v-cad69fe2"]]), ja = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(rn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        V(v(e.reason) + " ", 1),
        e.retry ? (r(), F(ge, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            V("Retry", -1)
          ])]),
          _: 1
        })) : b("", !0),
        e.removable ? (r(), F(ge, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            V("Remove tab", -1)
          ])]),
          _: 1
        })) : b("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, My = ["data-window", "data-agent"], _y = {
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
    const n = e, a = t, s = A(""), o = A(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Me(Sc, null), u = xd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: C(() => n.options),
      declared: n.declared,
      page: Me(yd, null),
      setOption: (h, p) => a("option", h, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (h, p) => {
        a("open", h, p), i == null || i(h, p);
      }
    });
    Pl(Re, u), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), _e(u.settle), Be(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), ou((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => da(n.component), f = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), F(Sy, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : b("", !0),
      e.unavailableReason ? (r(), F(ja, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), F(ja, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(D, { key: 4 }, [
        (r(), F(c, { key: o.value })),
        e.skeleton.length && !L(u).answered.value ? (r(), F(ao, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : b("", !0)
      ], 64)) : (r(), F(ja, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, My));
  }
}, tn = /* @__PURE__ */ H(_y, [["__scopeId", "data-v-c4443e2b"]]), Yi = {
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
    const n = e, a = t, s = { render: () => da(by, { src: n.entry.entry_url }) };
    return (o, l) => (r(), F(tn, {
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
}, Cy = ["data-window"], Qi = {
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
    const n = e, a = t, s = Je(null), o = A("");
    return pe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Hu();
          } catch (i) {
            if (Fu(i) && Wu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      O(ao, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Cy)) : (r(), F(tn, {
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
}, Ey = {
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
    const n = t, a = e, s = C(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = C(() => s.value && { render: () => da(dy, { line: s.value.line, events: s.value.events }) }), l = A(null), i = C(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = C(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = C(
      () => {
        var p, y;
        return l.value ? vv(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function f() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const p = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = p.ok ? p.value : null;
    }
    async function h() {
      const p = await a.prompts.ask(s.value.title, l.value);
      return await f(), p;
    }
    return pe(
      () => {
        var p, y;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (p, y) => {
      var k, T;
      return !s.value && ((k = e.catalogue.loaded) == null ? void 0 : k.value) === !1 ? (r(), F(ao, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((T = s.value) == null ? void 0 : T.shows) === "one-agent" && e.agent === null ? (r(), F(rn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), F(tn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), F(Qi, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (S, x) => n("option", S, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), F(Yi, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (S, x) => n("option", S, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), F(tn, {
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
        onOption: y[2] || (y[2] = (S, x) => n("option", S, x))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), F(tn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (S) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Ay = ["data-section"], Oy = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Ty = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(Gs, null), a = C(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = C(() => ({ row: t.row }));
    return (o, l) => L(n) ? (r(!0), d(D, { key: 0 }, ne(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), F(Ey, {
        key: 0,
        name: i.name,
        catalogue: L(n).catalogue,
        subscriptions: L(n).subscriptions,
        environment: L(n).environment,
        prompts: L(n).prompts,
        "shell-read": L(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", Oy, v(i.name) + " is not available", 1))
    ], 8, Ay))), 128)) : b("", !0);
  }
}, Ss = /* @__PURE__ */ H(Ty, [["__scopeId", "data-v-a47d36b7"]]), Iy = { class: "rail-head" }, By = { key: 0 }, Ry = {
  key: 1,
  class: "rail-none"
}, Ly = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: K(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Iy, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", By, v(e.total || e.comments.length), 1)) : b("", !0)
      ]),
      e.comments.length ? (r(!0), d(D, { key: 0 }, ne(e.comments, (a) => (r(), F(Ui, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", Ry, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Ny = /* @__PURE__ */ H(Ly, [["__scopeId", "data-v-4d684649"]]), qy = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, Dy = ["aria-pressed"], Py = ["aria-pressed"], jy = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Fy = {
  key: 0,
  role: "alert"
}, Wy = {
  key: 1,
  class: "sidebar-none"
}, Hy = ["data-question-id"], zy = { class: "question-state" }, Uy = ["data-question-show", "onClick"], Gy = {
  key: 0,
  class: "sidebar-none"
}, Vy = {
  key: 1,
  class: "question-answer"
}, Ky = {
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
    const t = Me(Gs, null);
    return (n, a) => (r(), d("div", {
      class: K(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", qy, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, Dy),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Py)
      ]),
      e.mode === "comments" ? (r(), d(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), F(Ny, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : b("", !0),
        O(yn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", jy, [
        e.failure ? (r(), d("p", Fy, v(e.failure), 1)) : e.questions.length ? b("", !0) : (r(), d("p", Wy, "No questions about this text yet.")),
        (r(!0), d(D, null, ne(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: K(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", zy, v(L(un)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, Uy),
            s.quote ? (r(), d(D, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", Gy, "The quoted text has changed.")) : b("", !0)
            ], 64)) : b("", !0),
            s.answer ? (r(), d("p", Vy, "Answered: " + v(s.answer), 1)) : b("", !0),
            O(Ss, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            O(Ys, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = L(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Hy);
        }), 128))
      ]))
    ], 2));
  }
}, Qo = /* @__PURE__ */ H(Ky, [["__scopeId", "data-v-660e5c85"]]), Yy = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Qy = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = zt({ abstract: n.row.abstract, body: n.row.body }), o = A("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), F(va, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: P(() => [
        m("span", Yy, v(o.value), 1),
        O(ge, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: P(() => [...u[6] || (u[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        O(ge, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: P(() => [...u[7] || (u[7] = [
            V("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: P(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: Se(l, ["prevent"])
        }, [
          m("label", null, [
            u[4] || (u[4] = m("span", null, "Abstract", -1)),
            Ze(m("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Xn, s.abstract]
            ])
          ]),
          m("label", null, [
            u[5] || (u[5] = m("span", null, "Text", -1)),
            Ze(m("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Xn, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Xy = /* @__PURE__ */ H(Qy, [["__scopeId", "data-v-464d77a8"]]);
function Xi(e, t) {
  const n = A([]), a = A(!1), s = A(null), o = A(0), l = A(!1), i = A("");
  let u = 0, c = 0;
  const f = (k) => {
    if (typeof k.body == "string") return k.body;
    const { term: T, id: S, title: x } = e(), B = `On ${T} ${S}, ${x}: `;
    return k.text.startsWith(B) ? k.text.slice(B.length) : k.text;
  };
  async function h(k = 1) {
    const { term: T, id: S } = e();
    if (!S) return;
    const x = ++c;
    l.value = !0, i.value = "";
    try {
      const B = await t([T, "comments", String(S), "--page", String(k), "--page-size", "25"]);
      if (x !== c) return;
      if (!B.ok) {
        i.value = B.error;
        return;
      }
      const W = B.value.rows ?? [], N = k === 1 ? W : [...n.value, ...W];
      n.value = [...new Map(N.map((w) => [w.id, w])).values()], o.value = B.value.total ?? n.value.length, s.value = B.value.next_page ?? null;
    } catch (B) {
      x === c && (i.value = B.message);
    } finally {
      x === c && (l.value = !1);
    }
  }
  async function p(k) {
    var w;
    const { term: T, id: S } = e(), x = `${T}:${S}`, B = { id: `sending-${++u}`, text: k };
    n.value = [...n.value, B], o.value++, a.value = !0;
    const W = await t([T, "comment", String(S), k]);
    if (x !== `${e().term}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((z) => z.id !== B.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await h();
    const N = (w = W.value) == null ? void 0 : w.id;
    N && !n.value.some((z) => z.id === N) && (n.value = [...n.value, { ...B, id: N }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return pe(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function Jy(e, t) {
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
const Zy = {
  class: "document-tab",
  "data-document-revisions": ""
}, e0 = ["datetime"], t0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, n0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, a0 = {
  key: 2,
  class: "document-none"
}, s0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), o = A(""), l = C(() => s.value ? Jy(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", Zy, [
      e.editing ? (r(), F(ge, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (h) => a("close-revision"))
      }, {
        default: P(() => [...f[1] || (f[1] = [
          V("Close the open revision", -1)
        ])]),
        _: 1
      })) : b("", !0),
      e.revisions.length ? (r(), d(D, { key: 1 }, [
        (r(!0), d(D, null, ne(e.revisions, (h) => (r(), F(ge, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: P(() => [
            V("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, e0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", t0, v(o.value), 1)) : b("", !0),
        s.value ? (r(), d(D, { key: 1 }, [
          O(ge, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: P(() => [...f[2] || (f[2] = [
              V("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", n0, [
            (r(!0), d(D, null, ne(l.value, (h) => (r(), d("div", {
              key: h.key,
              class: K(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : b("", !0)
      ], 64)) : (r(), d("p", a0, "No revisions"))
    ]));
  }
}, o0 = /* @__PURE__ */ H(s0, [["__scopeId", "data-v-3a381aa4"]]), l0 = "button, [data-comment-number]", i0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Ji(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(l0) || n.push(t.currentNode);
  return n;
}
function Xo(e, t, n) {
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
const r0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function u0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Ji(e), s = a.map((c) => c.data).join(""), o = Xo(a, n.startContainer, n.startOffset), l = s.slice(o, Xo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: r0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function c0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function d0(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Fa(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function f0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function h0(e, t) {
  const n = Ji(e), a = c0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = d0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(f0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Fa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Fa(t.number, t.id, t.label)) : l.at(-1).append(Fa(t.number, t.id, t.label))), !0;
}
function m0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !h0(e, a) && a.id && n.push(a.id);
  return n;
}
const p0 = (e) => e.closest(i0) ?? e;
function Jo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const g0 = {
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
    const a = e, s = n, o = A(null), l = A(null), i = A(null), u = A(!1), c = A(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const T = a.comments.filter((W) => W.quote).map((W) => ({ ...W, label: a.annotationLabel, hot: W.id === a.hot })), S = m0(l.value, a.pending ? [...T, { ...a.pending, pending: !0 }] : T);
      s("lost", S);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const B = document.createElement("div");
      B.className = "inline-comment", p0(x).after(B), c.value = B;
    }
    function h() {
      if (!l.value) return;
      const T = u0(l.value);
      if (u.value = !!T, !T) {
        i.value = null;
        return;
      }
      const S = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(S.left - x.left, 0)}px`, top: `${S.top - x.top + o.value.scrollTop}px` }, s("select", T);
    }
    function p(T) {
      const S = T.target.closest("[data-comment-number]");
      S ? s("number", Number(S.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(T) {
      var S;
      (S = l.value.querySelector(`[data-comment="${T}"]`)) == null || S.scrollIntoView({ block: "center" });
    }
    function k(T) {
      var S;
      (S = l.value.querySelectorAll("h3, h4, h5, h6")[T]) == null || S.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), _e(() => {
      f(), document.addEventListener("selectionchange", h);
    }), tt(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: k, nextTick: je }), (T, S) => (r(), d("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      m("div", {
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
        style: ye(i.value),
        "data-comment-pill": "",
        onMousedown: S[0] || (S[0] = Se(() => {
        }, ["prevent"])),
        onClick: S[1] || (S[1] = (x) => s("write"))
      }, [
        O(le, {
          name: "chat",
          size: 13
        }),
        S[2] || (S[2] = V("Comment on this", -1))
      ], 36)) : b("", !0),
      c.value ? (r(), F(ha, {
        key: 1,
        to: c.value
      }, [
        ue(T.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : b("", !0),
      ue(T.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, v0 = /* @__PURE__ */ H(g0, [["__scopeId", "data-v-548d0aaa"]]), y0 = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, b0 = { class: "document-tabs" }, k0 = { class: "document-body" }, w0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, $0 = {
  key: 1,
  class: "document-loading"
}, x0 = {
  class: "document-details",
  "data-resource-fields": ""
}, S0 = 760, M0 = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = tv(n), s = C(() => a.value !== null && a.value < S0), o = A(null), l = A(""), i = A([]), u = A([]), c = A(""), f = A("comments"), h = A("text"), p = A(0), y = A(0), k = A([]), T = A(null), S = A(""), x = A(!1), B = A(null), W = A(null);
    let N = 0;
    const w = Xi(() => o.value ? { term: t.term, id: t.id, title: o.value.title } : {}, (ie) => t.read(ie)), z = C(() => Jo(w.comments.value)), j = C(() => f.value === "questions" ? Jo(u.value) : z.value), q = C(() => f.value === "questions" ? j.value.length : w.total.value), _ = C(() => {
      var ie;
      return (ie = o.value) != null && ie.body ? Js(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), I = C(() => {
      var ie;
      return (((ie = o.value) == null ? void 0 : ie.body) ?? "").split(`
`).filter((te) => /^#{1,4} /.test(te)).map((te, se) => ({ key: String(se), value: se, label: te.replace(/^#+ /, "") }));
    }), $ = C(() => z.value.find((ie) => ie.id === y.value)), g = C(() => {
      var ie;
      return (ie = o.value) != null && ie.close_reason ? "Closed" : "Open";
    }), M = C(() => h.value === "comments" && !s.value ? "text" : h.value), E = (ie) => ie.ok ? ie.value.rows ?? [] : [];
    async function R() {
      const ie = ++N, te = await t.read([t.term, "inspect", String(t.id)]);
      if (ie !== N) return;
      l.value = te.ok ? "" : te.error, o.value = te.ok ? te.value : null;
      const se = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), oe = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      ie === N && (u.value = E(se), c.value = se.ok ? "" : se.error, i.value = oe ? E(oe) : []);
    }
    async function U(ie) {
      const te = T.value ? ["--quote", T.value.quote, "--position", String(T.value.position), "--selection-type", T.value.selection_type] : [], se = await t.read([t.term, "comment", String(t.id), ...te, "--", ie]);
      if (!se.ok) throw new Error(se.error);
      T.value = null, await Promise.all([R(), w.load()]);
    }
    async function ee() {
      const ie = await t.read(["doc", "close", String(t.id)]);
      l.value = ie.ok ? "" : ie.error, ie.ok && await R();
    }
    function Z() {
      S.value.trim() || (T.value = null);
    }
    function me(ie) {
      var te;
      if (p.value = ie, s.value && f.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === ie ? 0 : ie : (te = n.value.querySelector(f.value === "questions" ? `[data-question-id="${ie}"]` : `[data-comment-id="${ie}"]`)) == null || te.scrollIntoView({ block: "nearest" });
    }
    async function ve(ie) {
      var te, se;
      h.value = "text", p.value = ie, await ((te = B.value) == null ? void 0 : te.nextTick()), (se = B.value) == null || se.show(ie);
    }
    function be() {
      x.value = !1, R();
    }
    return pe(() => `${t.term}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, T.value = null, u.value = [], c.value = "", R();
    }, { immediate: !0 }), pe(f, () => {
      p.value = 0, y.value = 0;
    }), (ie, te) => (r(), d("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (r(), d("div", y0, [
        O(ge, {
          bordered: "",
          "data-text-edit": "",
          onClick: te[0] || (te[0] = (se) => x.value = !0)
        }, {
          default: P(() => [...te[14] || (te[14] = [
            V("Edit", -1)
          ])]),
          _: 1
        })
      ])) : b("", !0),
      m("nav", b0, [
        m("button", {
          type: "button",
          class: K(["document-tab-button", { on: M.value === "text" }]),
          "data-document-tab": "text",
          onClick: te[1] || (te[1] = (se) => h.value = "text")
        }, "Text", 2),
        s.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: K(["document-tab-button", { on: M.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: te[2] || (te[2] = (se) => h.value = "comments")
        }, [
          V(v(f.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(q.value || ""), 1)
        ], 2)) : b("", !0),
        e.term === "doc" ? (r(), d("button", {
          key: 1,
          type: "button",
          class: K(["document-tab-button", { on: M.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: te[3] || (te[3] = (se) => h.value = "revisions")
        }, [
          te[15] || (te[15] = V("Revisions ", -1)),
          m("em", null, v(i.value.length || ""), 1)
        ], 2)) : b("", !0),
        te[16] || (te[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        M.value === "text" && I.value.length > 1 ? (r(), F(zi, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: I.value,
          "data-text-chapters": "",
          onPick: te[4] || (te[4] = (se) => {
            var oe;
            return (oe = B.value) == null ? void 0 : oe.showHeading(se.value);
          })
        }, null, 8, ["label", "items"])) : b("", !0)
      ]),
      m("div", k0, [
        l.value ? (r(), d("p", w0, v(l.value), 1)) : o.value ? M.value === "revisions" ? (r(), F(o0, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: ee,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : M.value === "comments" ? (r(), F(Qo, {
          key: 3,
          mode: f.value,
          "onUpdate:mode": te[5] || (te[5] = (se) => f.value = se),
          tab: "",
          comments: z.value,
          questions: u.value,
          hot: p.value,
          lost: k.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!L(w).nextPage.value,
          "comment-loading": L(w).loading.value,
          "comment-failure": L(w).failure.value,
          "comment-total": L(w).total.value,
          onMore: L(w).loadMore,
          onShow: ve,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(D, { key: 4 }, [
          O(v0, {
            ref_key: "words",
            ref: B,
            html: _.value,
            comments: j.value,
            "annotation-label": f.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: T.value,
            inline: y.value,
            onSelect: te[7] || (te[7] = (se) => T.value = se),
            onClear: Z,
            onNumber: me,
            onWrite: te[8] || (te[8] = (se) => {
              var oe;
              return (oe = W.value) == null ? void 0 : oe.focus();
            }),
            onLost: te[9] || (te[9] = (se) => k.value = se)
          }, {
            inline: P(() => [
              $.value ? (r(), F(Ui, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: te[6] || (te[6] = (se) => ve($.value.id))
              }, null, 8, ["comment"])) : b("", !0)
            ]),
            default: P(() => [
              m("dl", x0, [
                te[18] || (te[18] = m("h4", null, "Details", -1)),
                te[19] || (te[19] = m("dt", null, "State", -1)),
                m("dd", null, v(g.value), 1),
                o.value.close_reason ? (r(), d(D, { key: 0 }, [
                  te[17] || (te[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(o.value.close_reason), 1)
                ], 64)) : b("", !0),
                te[20] || (te[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  O(et, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                te[21] || (te[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  O(et, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? b("", !0) : (r(), F(Qo, {
            key: 0,
            mode: f.value,
            "onUpdate:mode": te[10] || (te[10] = (se) => f.value = se),
            comments: z.value,
            questions: u.value,
            hot: p.value,
            lost: k.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!L(w).nextPage.value,
            "comment-loading": L(w).loading.value,
            "comment-failure": L(w).failure.value,
            "comment-total": L(w).total.value,
            onMore: L(w).loadMore,
            onShow: ve,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (r(), d("div", $0, [
          O(Ye)
        ]))
      ]),
      o.value ? (r(), F(pv, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: S.value,
        "onUpdate:draft": te[11] || (te[11] = (se) => S.value = se),
        selection: T.value,
        send: U,
        narrow: s.value,
        onClear: te[12] || (te[12] = (se) => T.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : b("", !0),
      x.value ? (r(), F(Xy, {
        key: 2,
        term: e.term,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: te[13] || (te[13] = (se) => x.value = !1),
        onSaved: be
      }, null, 8, ["term", "id", "row", "read"])) : b("", !0)
    ], 512));
  }
}, k6 = /* @__PURE__ */ H(M0, [["__scopeId", "data-v-029db6fe"]]), _0 = {
  key: 1,
  class: "row-list-failure"
}, C0 = ["data-row"], E0 = {
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
    const t = e, n = C(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = A(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), F(Ye, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", _0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), F(rn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        V(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(D, { key: 3 }, [
      (r(), F(Ve(e.arrival || e.moves ? Ds : "ul"), Pe(n.value, { class: "row-list" }), {
        default: P(() => [
          (r(!0), d(D, null, ne(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ue(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, C0))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : b("", !0)
    ], 64));
  }
}, A0 = /* @__PURE__ */ H(E0, [["__scopeId", "data-v-e9f251f3"]]), O0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, T0 = {
  key: 1,
  class: "agent-rows-note"
}, I0 = {
  key: 2,
  class: "agent-rows-note"
}, B0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, R0 = ["data-agent-row", "onClick"], L0 = { class: "agent-row-name" }, N0 = { class: "agent-row-state" }, q0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = C(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", O0, [
      e.loaded ? e.failure ? (r(), d("p", T0, v(e.failure), 1)) : e.rows.length ? (r(), d(D, { key: 3 }, [
        m("p", B0, v(a.value) + " running", 1),
        (r(!0), d(D, null, ne(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => L(De)(`agents:${l.id}`)
        }, [
          m("span", L0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", N0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, R0))), 128))
      ], 64)) : (r(), d("p", I0, v(e.none), 1)) : (r(), F(Ye, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, w6 = /* @__PURE__ */ H(q0, [["__scopeId", "data-v-a01e5a17"]]), ft = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ue = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, D0 = 6;
function so(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const P0 = (e) => {
  const t = so(e, ft.lineChars), n = Math.max(ft.minWidth, Math.max(...t.map((a) => a.length)) * ft.charWidth + ft.padX * 2);
  return { name: e, lines: t, line: ft.line, padY: ft.padY, width: n, height: t.length * ft.line + ft.padY * 2 };
};
function j0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function F0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function W0(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, u) => [i, u]))), o = (l, i) => {
    const u = s(), c = (f) => {
      const h = i(f).map((p) => u.get(p));
      return h.length ? h.reduce((p, y) => p + y, 0) / h.length : u.get(f);
    };
    return [...l].sort((f, h) => c(f) - c(h));
  };
  for (let l = 0; l < D0; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function H0(e, t) {
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
function z0(e) {
  const t = [...new Set(e.flatMap(([N, w]) => [N, w]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = j0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, w) => !s.has(w)), l = F0(t, o), i = W0(t, o, l), u = new Map(t.map((N) => [N, P0(N)])), c = i.map((N) => N.reduce((w, z) => w + u.get(z).width, 0) + He.across * (N.length - 1)), f = Math.max(...c) + He.margin * 2, h = G0(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = He.margin;
  i.forEach((N, w) => {
    let z = (f - c[w]) / 2;
    const j = Math.max(...N.map((q) => u.get(q).height));
    N.forEach((q) => {
      const _ = u.get(q);
      p.set(q, { ..._, x: z, y: y + (j - _.height) / 2 }), z += _.width + He.across;
    }), y += j + (h[w] ?? He.down);
  });
  const k = e.map(([N, w, z], j) => ({ from: N, to: w, label: z || "", back: s.has(j) || l.get(w) <= l.get(N) }));
  H0(k, p);
  const T = k.map((N) => V0(N, p.get(N.from), p.get(N.to))), S = [...p.values()], x = X0(T, S), B = Math.max(y - He.down, ...x.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(f - He.margin, ...x.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + He.margin, height: B + He.margin, nodes: S, arrows: x };
}
const U0 = (e) => e ? so(e, Ue.lineChars).length * Ue.line + Ue.pad * 2 : 0;
function G0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += U0(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function V0(e, t, n) {
  const a = e.label ? so(e.label, Ue.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ue.charWidth + Ue.pad * 2 : 0, o = a.length * Ue.line + (a.length ? Ue.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const K0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Y0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Q0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ue.line);
function X0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = K0(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Q0.flatMap((u) => Y0.map((c) => s(c, u))).find((u) => !n.some((c) => Zo(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => Zo(i, u)); ) i.y += Ue.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ue.line, pad: Ue.pad } };
  });
}
const Zo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, J0 = { class: "flowchart-tools" }, Z0 = ["width", "height", "viewBox", "aria-label"], eb = ["d"], tb = ["x", "y", "width", "height"], nb = ["x", "y"], ab = ["x", "dy"], sb = {
  key: 0,
  class: "flowchart-label"
}, ob = ["x", "y", "width", "height"], lb = ["x", "y"], ib = ["x", "dy"], rb = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => z0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = A(null), i = A({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var x;
      const T = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(T != null && T.width)) return;
      const S = Math.min(T.width / s.value.width, T.height / s.value.height, 1.5);
      i.value = { zoom: S, x: (T.width - s.value.width * S) / 2, y: (T.height - s.value.height * S) / 2 };
    }
    function f(T, S, x) {
      const { zoom: B, x: W, y: N } = i.value, w = Math.min(o.most, Math.max(o.least, B * T));
      i.value = { zoom: w, x: S - (S - W) * w / B, y: x - (x - N) * w / B };
    }
    function h(T) {
      const S = l.value.getBoundingClientRect();
      f(T, S.width / 2, S.height / 2);
    }
    function p(T) {
      const S = l.value.getBoundingClientRect();
      T.ctrlKey || T.metaKey ? f(T.deltaY < 0 ? o.step : 1 / o.step, T.clientX - S.left, T.clientY - S.top) : i.value = { ...i.value, x: i.value.x - T.deltaX, y: i.value.y - T.deltaY };
    }
    function y(T) {
      var S, x, B;
      T.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), u = { x: T.clientX - i.value.x, y: T.clientY - i.value.y }, (B = (x = l.value).setPointerCapture) == null || B.call(x, T.pointerId);
    }
    function k(T) {
      u && (i.value = { ...i.value, x: T.clientX - u.x, y: T.clientY - u.y });
    }
    return _e(c), (T, S) => (r(), F(va, {
      padded: "",
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (x) => a("close"))
    }, {
      default: P(() => [
        m("div", J0, [
          O(ge, {
            small: "",
            onClick: S[0] || (S[0] = (x) => h(o.step))
          }, {
            default: P(() => [...S[5] || (S[5] = [
              V("Zoom in", -1)
            ])]),
            _: 1
          }),
          O(ge, {
            small: "",
            onClick: S[1] || (S[1] = (x) => h(1 / o.step))
          }, {
            default: P(() => [...S[6] || (S[6] = [
              V("Zoom out", -1)
            ])]),
            _: 1
          }),
          O(ge, {
            small: "",
            onClick: c
          }, {
            default: P(() => [...S[7] || (S[7] = [
              V("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: Se(p, ["prevent"]),
          onPointerdown: y,
          onPointermove: k,
          onPointerup: S[2] || (S[2] = (x) => xo(u) ? u.value = null : u = null),
          onPointercancel: S[3] || (S[3] = (x) => xo(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ye({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            S[8] || (S[8] = m("defs", null, [
              m("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                m("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (r(!0), d(D, null, ne(s.value.arrows, (x, B) => (r(), d("path", {
              key: `arrow-${B}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, eb))), 128)),
            (r(!0), d(D, null, ne(s.value.nodes, (x) => (r(), d("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, tb),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (r(!0), d(D, null, ne(x.lines, (B, W) => (r(), d("tspan", {
                  key: W,
                  x: x.x + x.width / 2,
                  dy: W ? x.line : 0
                }, v(B), 9, ab))), 128))
              ], 8, nb)
            ]))), 128)),
            (r(!0), d(D, null, ne(s.value.arrows, (x, B) => (r(), d(D, {
              key: `label-${B}`
            }, [
              x.label ? (r(), d("g", sb, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, ob),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (r(!0), d(D, null, ne(x.label.lines, (W, N) => (r(), d("tspan", {
                    key: N,
                    x: x.label.x + x.label.width / 2,
                    dy: N ? x.label.line : 0
                  }, v(W), 9, ib))), 128))
                ], 8, lb)
              ])) : b("", !0)
            ], 64))), 128))
          ], 12, Z0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ub = /* @__PURE__ */ H(rb, [["__scopeId", "data-v-e98799dc"]]), cb = ["innerHTML"], db = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => To[t.name] || To.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, cb));
  }
}, Et = /* @__PURE__ */ H(db, [["__scopeId", "data-v-beb5935c"]]), fb = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: K(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      O(Et, { name: "fold" })
    ], 2));
  }
}, Kt = /* @__PURE__ */ H(fb, [["__scopeId", "data-v-d03899bb"]]), hb = ["data-tip", "aria-label"], mb = {
  key: 0,
  class: "mact-word"
}, pb = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: K(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      O(Et, { name: "open" }),
      e.open ? (r(), d("span", mb, v(e.label), 1)) : b("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, hb));
  }
}, Zi = /* @__PURE__ */ H(pb, [["__scopeId", "data-v-3b292e09"]]), er = 120, Un = 280, tr = 160, gb = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, vb = ["leaving", "resizing", "entering"];
function Ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function yb(e) {
  const t = vb.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ms(e);
  return e.classList.add(...t), n;
}
function nr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = A(t()), s = A("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function u(h, p) {
    i(h);
    const y = yb(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Un}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Un}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const k = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, u(h, Ms(h)));
    });
    return k.observe(p), k;
  }
  async function f(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || gb()) {
      a.value = h;
      return;
    }
    const k = Ms(p);
    if (l(p, k), s.value = "leaving", await n(er), y !== o) return;
    a.value = h, s.value = "resizing", await je(), u(p, k);
    const T = c(p);
    await n(Un), T == null || T.disconnect(), y === o && (i(p), s.value = "entering", await n(tr), y === o && (s.value = ""));
  }
  return pe(t, (h) => f(h)), tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const bb = { class: "growing-card-top" }, kb = ["aria-expanded"], wb = { class: "growing-card-avatar" }, $b = { class: "growing-card-title" }, xb = { class: "growing-card-more" }, Sb = { class: "growing-card-body" }, Mb = {
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
    const n = e, a = t, s = A(!1), o = A(null), { folded: l, phase: i } = nr(o, () => !s.value), u = C(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = C(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: K(["growing-card-wrap", L(i), { open: !L(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", bb, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", wb, [
            e.bad ? (r(), F(Et, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(D, { key: 1 }, [
              V(v(u.value), 1)
            ], 64)) : (r(), F(le, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", $b, v(e.title), 1),
          O(Kt, { open: s.value }, null, 8, ["open"])
        ], 8, kb),
        e.action ? (r(), F(Zi, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : b("", !0),
        e.commentable ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (p) => a("comment"))
        }, [
          O(le, {
            name: "bubble",
            size: 13
          })
        ])) : b("", !0)
      ]),
      m("div", xb, [
        m("div", Sb, [
          (r(!0), d(D, null, ne(c.value, (p, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, _b = /* @__PURE__ */ H(Mb, [["__scopeId", "data-v-f2b4930d"]]), Cb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Eb = { class: "md inline" }, Ab = ["disabled", "title", "onClick"], Ob = {
  key: 1,
  class: "message-links-many"
}, Tb = ["aria-expanded"], Ib = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Bb = ["disabled", "onClick"], Rb = { class: "row-pill message-links-chip" }, Lb = { class: "message-links-title" }, Nb = { key: 0 }, Wa = 3, qb = "task", Db = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => n.total || n.links.length), o = C(() => n.links.every((p) => p.endpoint.model === qb) ? "tasks" : "items"), l = A(!1), i = A(null);
    ni(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, De(p.endpoint.open_ref));
    }
    return (p, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: K(["message-links", { many: s.value > Wa, three: s.value === Wa, open: l.value }]),
      "data-message-links": ""
    }, [
      O(Et, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Cb, [
        m("span", Eb, [
          y[1] || (y[1] = V("Linked: ", -1)),
          (r(!0), d(D, null, ne(e.links, (k) => (r(), d("button", {
            key: `${k.endpoint.model}:${k.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(k),
            title: k.endpoint.title,
            onClick: (T) => h(k)
          }, [
            V(v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
            f(k) ? (r(), d(D, { key: 0 }, [
              V(" (" + v(f(k)) + ")", 1)
            ], 64)) : b("", !0),
            c(k) ? (r(), d(D, { key: 1 }, [
              V(" (unavailable)")
            ], 64)) : b("", !0)
          ], 8, Ab))), 128))
        ])
      ])) : b("", !0),
      s.value >= Wa ? (r(), d("span", Ob, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          V(v(s.value) + " linked " + v(o.value) + " ", 1),
          O(Kt, { open: l.value }, null, 8, ["open"])
        ], 8, Tb)
      ])) : b("", !0),
      l.value ? (r(), d("div", Ib, [
        (r(!0), d(D, null, ne(e.links, (k) => (r(), d("button", {
          key: `${k.endpoint.model}:${k.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(k),
          onClick: (T) => h(k)
        }, [
          m("span", Rb, v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
          m("span", Lb, v(k.endpoint.title), 1),
          m("span", null, v(f(k)), 1),
          c(k) ? (r(), d("span", Nb, "Unavailable")) : b("", !0)
        ], 8, Bb))), 128))
      ])) : b("", !0),
      O(yn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (k) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Pb = /* @__PURE__ */ H(Db, [["__scopeId", "data-v-14ec7c9a"]]), jb = ["title", "aria-label"], Fb = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Wb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Hb = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = C(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: K(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", Fb, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Wb)) : b("", !0)
      ]))
    ], 10, jb));
  }
}, zb = /* @__PURE__ */ H(Hb, [["__scopeId", "data-v-6dc92808"]]), Ub = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Gb = (e) => e.worker_id != null ? "report" : "message", Vb = (e) => Ub[Gb(e)], Kb = "img,pre,table";
function Yb(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Qb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Xb(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Kb)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Yb(Qb(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Jb(e, t) {
  let n = null;
  const a = () => e.value && Xb(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const Zb = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function ek(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Nn = /* @__PURE__ */ new WeakMap(), Le = "work", Xe = "sent", tk = 50, el = 50, tl = () => ({ rows: A([]), total: A(0), next: A(null), loading: A(!1), failure: A(""), version: 0 });
function nk(e) {
  var T;
  if (Nn.has(e)) return Nn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (S) => {
    var x;
    return ((x = e.visible) == null ? void 0 : x.value) !== !1 && [...S.views].some((B) => B.visible);
  };
  function o(S, x) {
    const B = S[x], W = ++B.version;
    return B.loading.value = !0, B.failure.value = "", W;
  }
  function l(S, x, B, W, N) {
    const w = S[x];
    if (t.get(S.id) !== S || w.version !== B) return;
    if (w.loading.value = !1, !N.ok) {
      w.failure.value = N.error;
      return;
    }
    const z = x === Le ? N.value.counterparts ?? [] : N.value.rows ?? [], j = W === 1 ? z : [...w.rows.value, ...z], q = x === Le ? (_) => `${_.endpoint.model}:${_.endpoint.id}` : (_) => _.id ?? _.target_id;
    w.rows.value = [...new Map(j.map((_) => [q(_), _])).values()], w.total.value = N.value.total ?? w.rows.value.length, w.next.value = N.value.next_page ?? null;
  }
  function i(S, x, B, W) {
    const N = S[x];
    N.version === B && (N.failure.value = W.message, N.loading.value = !1);
  }
  async function u(S, x, B) {
    const W = o(S, x), N = x === Le ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(S, x, W, B, await e.read(`link list --source message:${S.id} ${N} --page ${B} --page-size ${x === Le ? 10 : 25}`));
    } catch (w) {
      i(S, x, W, w);
    }
  }
  async function c(S) {
    const x = S.map((B) => ({ [Le]: o(B, Le), [Xe]: o(B, Xe) }));
    try {
      const B = await e.read(`link receipts --messages ${S.map((W) => W.id).join(",")}`);
      S.forEach((W, N) => {
        const w = B.ok ? B.value.messages[String(W.id)] : null;
        l(W, Le, x[N][Le], 1, B.ok ? { ok: !0, value: w.named } : B), l(W, Xe, x[N][Xe], 1, B.ok ? { ok: !0, value: w.sent } : B);
      });
    } catch (B) {
      S.forEach((W, N) => [Le, Xe].forEach((w) => i(W, w, x[N][w], B)));
    }
  }
  function f() {
    a = null;
    const S = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), S.forEach((x) => x.dirty.clear());
    for (let x = 0; x < S.length; x += el) c(S.slice(x, x + el));
  }
  function h(S, x = [Le, Xe]) {
    for (const B of x) S.dirty.add(B);
    s(S) && (n.add(S.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(S) {
    const x = S.sources ?? (S.source_model && Number.isInteger(S.source_id) ? [{ model: S.source_model, id: S.source_id }] : []), B = S.link_types ?? (S.link_type ? [S.link_type] : []), W = B.length ? [Le, Xe].filter((w) => w === Le ? B.some((z) => ["about", "edited"].includes(z)) : B.includes("sent_to")) : [Le, Xe];
    if (!W.length) return;
    const N = x.length ? [...new Set(x.filter((w) => w.model === "message").map((w) => w.id))].map((w) => t.get(w)).filter(Boolean) : [...t.values()].filter(s).slice(0, tk);
    for (const w of N) h(w, W);
  }
  const y = (T = e.follow) == null ? void 0 : T.call(e, ["link.*"], p), k = {
    attach(S, x) {
      let B = t.get(S);
      return B || (B = { id: S, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Le, Xe]), work: tl(), sent: tl() }, t.set(S, B)), B.views.add(x), B.dirty.size && h(B, [...B.dirty]), B;
    },
    shown(S) {
      S.dirty.size && h(S, [...S.dirty]);
    },
    detach(S, x) {
      S.views.delete(x), S.views.size || t.delete(S.id), t.size || (clearTimeout(a), y == null || y(), Nn.delete(e));
    },
    more(S, x) {
      const B = S == null ? void 0 : S[x];
      if (B != null && B.next.value && !B.loading.value) return u(S, x, B.next.value);
    }
  };
  return Nn.set(e, k), k;
}
function ak(e, t, n) {
  const a = Je(null);
  let s = null;
  const o = pe(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = nk(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((k) => k.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = pe(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), h == null || h.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return ma(o), {
    links: C(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: C(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: C(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: C(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: C(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: C(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: C(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: C(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: C(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Le),
    loadSent: () => s == null ? void 0 : s.more(a.value, Xe)
  };
}
const sk = ["data-incoming", "data-ref"], ok = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], lk = { class: "message-body" }, ik = ["title"], rk = ["innerHTML"], uk = ["innerHTML"], ck = {
  class: "message-faces",
  "data-message-faces": ""
}, dk = ["title", "data-face", "onClick"], fk = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, hk = ["title", "data-reaction", "onClick"], mk = {
  key: 0,
  class: "message-reaction-count"
}, pk = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, gk = ["href", "title"], vk = ["src", "alt"], yk = ["href"], bk = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, kk = ["disabled", "data-sent-worker", "title", "onClick"], wk = { class: "message-foot" }, $k = { class: "message-time" }, xk = {
  class: "message-id",
  "data-message-id": ""
}, Sk = 1500, Mk = "An earlier message", _k = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = A(null), l = C(() => ["user", "comment"].includes(n.message.type)), i = C(() => {
      const [te, se] = (n.message.commented_row || ":").split(":"), oe = gt(te);
      return oe ? { ref: `${oe}:${se}`, label: `${Vt(oe).title.toLowerCase()} ${se}` } : null;
    }), u = C(() => n.message.worker_id ?? null), c = C(() => Vb(n.message)), f = C(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var te;
      await ((te = navigator.clipboard) == null ? void 0 : te.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Sk);
    }
    const p = Oi(), y = C(() => p(n.message.text ?? "")), k = C(() => JSON.parse(n.message.flowchart_edges || "[]")), T = A(!1), S = C(() => ws(n.quote)), x = C(() => p(S.value || Mk));
    function B() {
      const te = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      te ? te.scrollIntoView({ block: "center", behavior: "smooth" }) : De(`messages:${n.message.parent_id}`);
    }
    Jb(o, () => `${n.message.text} ${S.value}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, N = (te) => `/api/files/message/${n.message.id}/${encodeURIComponent(te)}`, w = C(() => JSON.parse(n.message.captions || "{}")), z = C(() => (n.message.files ?? []).map((te) => ({ name: te, address: N(te), isImage: W.test(te), title: w.value[te] || te }))), j = C(() => Pi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), q = Me(Re, null), { links: _, total: I, more: $, loading: g, failure: M, sentTo: E, sentMore: R, sentLoading: U, sentFailure: ee, loadMore: Z, loadSent: me } = ak(q, () => l.value && !n.message.local ? n.message.id : null, o), ve = A(!1), be = C(() => ek(n.message.reactions));
    function ie(te) {
      ve.value = !1, a("react", n.message, te);
    }
    return (te, se) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      O(_b, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: se[0] || (se[0] = (oe) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, sk)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", lk, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: K(["message-card", "md", { comment: i.value }]),
          onClick: se[5] || (se[5] = (...oe) => L(Nt) && L(Nt)(...oe))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: se[1] || (se[1] = Se((oe) => L(De)(i.value.ref), ["stop"]))
          }, [
            O(le, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, ik)) : b("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Se(B, ["stop"]),
            innerHTML: x.value
          }, null, 8, rk)) : b("", !0),
          u.value !== null ? (r(), F(ba, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: se[2] || (se[2] = Se((oe) => L(De)(`agents:${u.value}`), ["stop"]))
          }, {
            default: P(() => [
              V("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : b("", !0),
          O(Si, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: P(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, uk)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          k.value.length ? (r(), d(D, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: se[3] || (se[3] = (oe) => T.value = !0)
            }, "Open the flowchart"),
            T.value ? (r(), F(ub, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: se[4] || (se[4] = (oe) => T.value = !1)
            }, null, 8, ["title", "edges"])) : b("", !0)
          ], 64)) : b("", !0)
        ], 2),
        m("div", {
          class: K(["message-tools", { picking: ve.value }]),
          "data-message-tools": ""
        }, [
          ve.value ? (r(), d(D, { key: 0 }, [
            m("div", ck, [
              (r(!0), d(D, null, ne(L(Zb), (oe) => (r(), d("button", {
                key: oe,
                type: "button",
                class: "message-face",
                title: `React ${oe}`,
                "data-face": oe,
                onClick: (at) => ie(oe)
              }, v(oe), 9, dk))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: se[6] || (se[6] = (oe) => ve.value = !1)
            }, [
              O(le, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(D, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: se[7] || (se[7] = (oe) => ve.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: se[8] || (se[8] = (oe) => a("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: h
            }, v(s.value ? "Copied" : "Copy"), 1),
            f.value ? (r(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: se[9] || (se[9] = (oe) => a("delete", e.message))
            }, "Delete")) : b("", !0)
          ], 64))
        ], 2)
      ]),
      be.value.length ? (r(), d("div", fk, [
        (r(!0), d(D, null, ne(be.value, (oe) => (r(), d("button", {
          key: oe.emoji,
          type: "button",
          class: K(["message-reaction", { mine: oe.mine }]),
          title: oe.title,
          "data-reaction": oe.emoji,
          onClick: (at) => a("react", e.message, oe.emoji)
        }, [
          V(v(oe.emoji) + " ", 1),
          oe.count > 1 ? (r(), d("span", mk, v(oe.count), 1)) : b("", !0)
        ], 10, hk))), 128))
      ])) : b("", !0),
      z.value.length ? (r(), d("div", pk, [
        (r(!0), d(D, null, ne(z.value, (oe) => (r(), d(D, {
          key: oe.name
        }, [
          oe.isImage ? (r(), d("a", {
            key: 0,
            href: oe.address,
            target: "_blank",
            class: "message-image",
            title: oe.title
          }, [
            m("img", {
              src: oe.address,
              alt: oe.name,
              "data-figure-picture": ""
            }, null, 8, vk)
          ], 8, gk)) : (r(), d("a", {
            key: 1,
            href: oe.address,
            target: "_blank",
            class: "message-file"
          }, v(oe.name), 9, yk))
        ], 64))), 128))
      ])) : b("", !0),
      L(E).length ? (r(), d("div", bk, [
        O(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(D, null, ne(L(E), (oe) => (r(), d("button", {
          key: oe.id,
          type: "button",
          class: "message-sent-worker",
          disabled: oe.unavailable || !oe.open_ref,
          "data-sent-worker": oe.id,
          title: `Open worker ${oe.id}`,
          onClick: Se((at) => oe.open_ref && L(De)(oe.open_ref), ["stop"])
        }, [
          V("Also sent to worker " + v(oe.id), 1),
          oe.unavailable ? (r(), d(D, { key: 0 }, [
            V(" (unavailable)")
          ], 64)) : b("", !0)
        ], 8, kk))), 128))
      ])) : b("", !0),
      O(yn, {
        more: L(R),
        loading: L(U),
        failure: L(ee),
        label: "More recipients",
        onMore: L(me)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", wk, [
        m("time", $k, v(j.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(D, { key: 0 }, [
          se[10] || (se[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", xk, "message " + v(e.message.id), 1)
        ], 64)) : b("", !0),
        l.value ? (r(), F(zb, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : b("", !0)
      ]),
      L(_).length || L(M) ? (r(), F(Pb, {
        key: 3,
        links: L(_),
        total: L(I),
        more: L($),
        loading: L(g),
        failure: L(M),
        onMore: L(Z)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : b("", !0)
    ], 8, ok));
  }
}, $6 = /* @__PURE__ */ H(_k, [["__scopeId", "data-v-6db3f02c"]]), sa = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ha = 200, ar = (e) => {
  var t;
  return ((t = sa.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? sa[0].key;
}, x6 = (e) => {
  var t;
  return ((t = sa.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Ck = ["aria-label"], Ek = 300, nl = 400, Ak = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ha } },
  setup(e) {
    const t = e, n = C(() => ar(t.value)), a = C(() => n.value < Ha ? [1, 0.25, 0.25] : n.value === Ha ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: K(["ico", "prio", { hot: n.value >= nl, high: n.value >= Ek && n.value < nl }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      m("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ye({ opacity: a.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ye({ opacity: a.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ye({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Ck));
  }
}, S6 = /* @__PURE__ */ H(Ak, [["__scopeId", "data-v-b10e610f"]]), sr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], M6 = (e) => {
  const t = sr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, Ok = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, al = (e) => Ok[e.card.state] || "idle", Tk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), sl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, ol = (e, t) => sl[al(e)] - sl[al(t)], ll = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, _6 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => ol(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Tk(a, s)) : [...e].sort((a, s) => ol(a, s) || (ll[t] || ll.state)(a, s)), Ik = { class: "list-row" }, Bk = {
  key: 0,
  class: "list-row-type"
}, Rk = { class: "list-row-main" }, Lk = {
  key: 0,
  class: "list-row-title"
}, Nk = { class: "list-row-body" }, qk = {
  key: 1,
  class: "list-row-end"
}, Dk = {
  key: 1,
  class: "list-row-text"
}, Pk = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Ik, [
      e.type ? (r(), d("span", Bk, v(e.type), 1)) : b("", !0),
      m("div", Rk, [
        e.title ? (r(), d("span", Lk, v(e.title), 1)) : b("", !0),
        m("div", Nk, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", qk, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      e.text ? (r(), d("span", Dk, v(e.text), 1)) : b("", !0)
    ]));
  }
}, C6 = /* @__PURE__ */ H(Pk, [["__scopeId", "data-v-dfc8c3a7"]]), E6 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = C(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (r(), F(zi, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, jk = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: K(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, _s = /* @__PURE__ */ H(jk, [["__scopeId", "data-v-978e0921"]]), Fk = ["aria-label"], Wk = { class: "head" }, Hk = { class: "names" }, zk = { class: "body" }, Uk = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = hi(a, n), i = mi(s);
    return (u, c) => (r(), F(ha, { to: "body" }, [
      O(Ut, {
        name: "side",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: P(() => [
          L(s) ? (r(), d("div", {
            key: 0,
            class: K(["veil", { over: e.over, under: e.depth }]),
            style: ye({ "--depth": e.depth, zIndex: L(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = Se((...f) => L(o) && L(o)(...f), ["self"]))
          }, [
            m("aside", {
              class: K(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(D, { key: 0 }, [
                m("header", Wk, [
                  m("div", Hk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (r(), F(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : b("", !0),
                    ue(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ue(u.$slots, "actions", {}, void 0, !0),
                  O(ga, {
                    title: e.closeLabel,
                    onClick: L(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), F(_s, { key: 0 }, {
                  default: P(() => [
                    ue(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : b("", !0),
                m("div", zk, [
                  ue(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), F(_s, {
                  key: 1,
                  class: "below"
                }, {
                  default: P(() => [
                    ue(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : b("", !0)
              ], 64)) : ue(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, Fk)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, A6 = /* @__PURE__ */ H(Uk, [["__scopeId", "data-v-d0a677ef"]]), Gk = {
  key: 1,
  class: "text-field-label"
}, Vk = {
  key: 2,
  class: "text-field-end"
}, Kk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ jt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = ln(e, "modelValue"), a = fa(), s = "onUpdate:modelValue" in (((f = lu()) == null ? void 0 : f.vnode.props) || {}), o = C(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = C(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), u = C(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = A(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (r(), d("label", {
      key: 0,
      class: K(["text-field", { large: e.large, ended: h.$slots.end }, L(a).class]),
      style: ye(L(a).style)
    }, [
      e.icon ? (r(), F(le, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : b("", !0),
      e.label ? (r(), d("span", Gk, v(e.label), 1)) : b("", !0),
      Ze(m("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [L(vs), o.value]
      ]),
      h.$slots.end ? (r(), d("span", Vk, [
        ue(h.$slots, "end", {}, void 0, !0)
      ])) : b("", !0)
    ], 6)) : Ze((r(), d("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [L(vs), o.value]
    ]);
  }
}), O6 = /* @__PURE__ */ H(Kk, [["__scopeId", "data-v-d9c38ca8"]]), Yk = { class: "title" }, Qk = { class: "state" }, Xk = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ds(t.line, t.events);
    return (o, l) => (r(), F(A0, {
      rows: L(n),
      failure: L(a),
      loaded: L(s),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        m("span", Yk, v(i.title), 1),
        m("span", Qk, v(L(un)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, T6 = /* @__PURE__ */ H(Xk, [["__scopeId", "data-v-6be0c59e"]]);
function Jk(e = 1e3, t = null) {
  const n = A(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const za = A(Date.now() / 1e3);
let il = 0, qn = 0;
function oo() {
  return qn || (za.value = Date.now() / 1e3, il = setInterval(() => za.value = Date.now() / 1e3, 1e3)), qn += 1, jl() && ma(() => {
    qn -= 1, qn || clearInterval(il);
  }), za;
}
const Zk = 200, ew = er + Un + tr + Zk, tw = 300, Dn = /* @__PURE__ */ new WeakMap();
function nw(e, t) {
  const n = Dn.get(e) ?? [];
  Dn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Dn.get(e);
    Dn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, tw);
}
function Qt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function aw(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Qt(e),
    top: Qt(e.querySelector(".top")),
    title: Qt(e.querySelector(".title")),
    contents: Qt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: Qt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function sw(e, t, n, a) {
  pe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(aw(o, l, n.value)), performance.now() - l < ew) return void requestAnimationFrame(u);
        nw(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const ow = ["title", "data-figure-mark", "data-folded", "data-open"], lw = {
  key: 2,
  class: "worker"
}, iw = { class: "head" }, rw = { key: 0 }, uw = {
  key: 3,
  class: "status"
}, cw = {
  key: 0,
  class: "figure"
}, dw = {
  class: "figure-decimal",
  "data-figure-decimal": ""
}, fw = {
  key: 1,
  class: "ran-for"
}, hw = { key: 2 }, mw = {
  key: 3,
  class: "news"
}, pw = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, gw = {
  key: 6,
  class: "settled"
}, vw = {
  key: 1,
  class: "bar"
}, yw = {
  key: 3,
  class: "detail body"
}, bw = {
  key: 0,
  class: "body-label"
}, kw = ["title"], ww = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = fa(), a = ["onClick", "onAct"], s = C(() => Object.fromEntries(Object.entries(n).filter(([be]) => !a.includes(be)))), o = A(!1), l = C(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = C(() => t.open !== void 0), u = C(() => i.value || l.value), c = C(() => i.value ? t.open : o.value), f = C(() => i.value ? !t.open : l.value && !o.value), h = C(() => !!(t.mark.action && n.onAct)), p = C(() => u.value || h.value || !!n.onClick), y = A(null), k = A(null), { folded: T, phase: S } = nr(y, () => f.value);
    sw(y, f, S, Me(Re, null));
    function x(be) {
      var ie, te;
      if (!(be.target !== y.value && !k.value.contains(be.target))) {
        if (i.value) return (ie = n.onClick) == null ? void 0 : ie.call(n, be);
        if (l.value) return void (o.value = !o.value);
        (te = n.onAct || n.onClick) == null || te(be);
      }
    }
    const B = (be) => n.onAct(be), W = ["failed", "unfinished"], N = C(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), w = C(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), z = C(() => w.value || "var(--tone-work)"), j = C(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), q = oo(), _ = C(
      () => t.mark.began_at && j.value && !t.mark.figure && !t.mark.counting ? ji(q.value - t.mark.began_at) : ""
    ), I = C(() => {
      const { started: be, ended: ie } = t.mark;
      return be ? ie ? `ran ${Yo(ie - be, !0)}` : Yo(q.value - be, !0) : _.value;
    }), $ = ["bad", "danger", "warn"], g = C(() => $.includes(N.value) || t.mark.asks ? "attention" : j.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], E = C(() => M.includes(N.value)), R = C(() => g.value === "process" ? "running" : E.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), U = C(
      () => !!(t.mark.figure || I.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), ee = C(() => /^(\d+)(\.\d+)(.*)$/.exec(t.mark.figure ?? "")), Z = C(() => t.mark.markIcon ? { component: Et, props: { class: "ico", name: t.mark.markIcon } } : { component: le, props: { name: t.mark.icon || "dot" } }), me = C(() => [t.mark.title, t.mark.time ? Pi(t.mark.time) : ""].filter(Boolean).join(" · ")), ve = C(() => ({
      ...w.value ? { "--mark": w.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (be, ie) => (r(), d("div", Pe(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        L(S),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: w.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ve.value,
      title: me.value,
      "data-figure-mark": e.mark.key,
      "data-folded": L(T) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (r(), F(Ve(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: k,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.agentId ? (r(), F(ba, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: P(() => [
              (r(), F(Ve(Z.value.component), cs(Fl(Z.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), F(Ve(Z.value.component), cs(Pe({ key: 1 }, Z.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", lw, v(e.mark.worker), 1)) : b("", !0),
          m("span", iw, [
            O(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", rw, v(e.mark.name), 1)) : b("", !0),
            u.value ? (r(), F(Kt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : b("", !0)
          ]),
          U.value ? (r(), d("span", uw, [
            e.mark.figure ? (r(), d("span", cw, [
              ee.value ? (r(), d(D, { key: 0 }, [
                V(v(ee.value[1]), 1),
                m("span", dw, v(ee.value[2]), 1),
                V(v(ee.value[3]), 1)
              ], 64)) : (r(), d(D, { key: 1 }, [
                V(v(e.mark.figure), 1)
              ], 64))
            ])) : b("", !0),
            I.value ? (r(), d("span", fw, v(I.value), 1)) : b("", !0),
            e.mark.stopping ? (r(), d("span", hw, "Stopping")) : b("", !0),
            e.mark.news ? (r(), d("span", mw, v(e.mark.news), 1)) : b("", !0),
            R.value === "running" ? (r(), d("span", pw)) : R.value ? (r(), F(Et, {
              key: 5,
              class: K(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : b("", !0),
            e.mark.settled ? (r(), d("span", gw, v(e.mark.settled), 1)) : b("", !0)
          ])) : b("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (r(), F(Zi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: Se(B, ["stop"])
      }, null, 8, ["label", "open"])) : b("", !0),
      (e.mark.figure || e.mark.counting) && j.value ? (r(), d("span", vw, [
        m("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: z.value })
        }, null, 4)
      ])) : b("", !0),
      e.mark.detail && !L(T) ? (r(), F(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      e.mark.body && !L(T) ? (r(), d("div", yw, [
        e.mark.bodyLabel ? (r(), d("p", bw, v(e.mark.bodyLabel), 1)) : b("", !0),
        O(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : b("", !0),
      e.mark.command && !L(T) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, kw)) : b("", !0),
      e.mark.card ? (r(), F(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      ue(be.$slots, "default", {
        shown: !L(T)
      }, void 0, !0)
    ], 16, ow));
  }
}), or = /* @__PURE__ */ H(ww, [["__scopeId", "data-v-26436a00"]]), $w = 8, xw = 40, Sw = [];
class lo {
  constructor(t, n, { top: a = $w, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Sw.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new lo(t, {
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
    n > xw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await je(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await je();
  }
}
const Mw = 60, _w = 300, lr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function ir(e, t) {
  const n = A([]), a = A(0);
  let s = -1, o = 0;
  async function l() {
    const h = await e(["output", "page", String(t())]);
    return h.ok && (n.value = h.value.lines, a.value = h.value.first_byte, s = h.value.last_byte, o = h.value.cut_bytes), h;
  }
  async function i() {
    if (s < 0) return l();
    const h = await e(["output", "page", String(t()), "--after", String(s)]);
    return h.ok ? h.value.cut_bytes !== o || h.value.total < s ? l() : (h.value.lines.length && (n.value = [...n.value, ...h.value.lines]), s = h.value.last_byte, h) : h;
  }
  async function u() {
    const h = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return h.ok ? (n.value = [...h.value.lines, ...n.value], a.value = h.value.first_byte, !0) : !1;
  }
  const c = new lo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => _w, more: () => a.value > 0, previous: u }, { top: Mw });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Cw = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function rr(e) {
  var n;
  const t = Cw[e] || ((n = Vt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ew = (e) => rr(String(e).split(":")[0]), Aw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ow = "agents", Tw = { passed: "good", failed: "danger", warned: "warn", running: "" }, Iw = { good: "good", warn: "warn", danger: "danger" }, rl = {
  "open row": (e) => De(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Ff(e.target_model, e.target_id || 0)
}, Bw = { "open row": (e) => Ew(e.target_model), "open page": () => rr("pages") };
function Rw(e, t) {
  const n = t || {}, a = rl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Tw[e.outcome] || "" : Iw[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === Ow ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Bw[a](e) : "",
    handlers: a ? { onAct: () => rl[a](e) } : {}
  };
}
const Lw = 24, Nw = 1e3, ul = 2e3, qw = 0.25, Dw = 5e3;
function Pw(e, t = Lw, n = () => !0) {
  const a = A(!1), s = A(0), o = A(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const N = c();
    return N ? N.scrollHeight - N.scrollTop - N.clientHeight : 0;
  }, h = () => !c() || f() <= t;
  function p(N) {
    if (clearTimeout(l), !N) {
      o.value = !1, u = Date.now();
      return;
    }
    const w = Date.now() - u < ul ? ul : Nw;
    l = setTimeout(() => o.value = a.value, w);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function k(N = !1) {
    const w = c();
    w && N && w.scrollTo ? w.scrollTo({ top: w.scrollHeight, behavior: "smooth" }) : w && (w.scrollTop = w.scrollHeight), y();
  }
  function T() {
    x(), !a.value && (a.value = !0, p(!0));
  }
  const S = () => !!c() && f() <= c().clientHeight * qw;
  function x() {
    clearTimeout(i), S() && (i = setTimeout(() => a.value && S() && n() && k(!0), Dw));
  }
  function B() {
    h() ? y() : T();
  }
  function W(N = 1, w = !1) {
    a.value ? s.value += Math.max(0, N) : k(w);
  }
  return jl() && ma(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: k, left: T, scrolled: B, arrived: W };
}
const jw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Fw = (e) => String(e ?? "").replace(jw, ""), Ww = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), { away: o, scrolled: l, arrived: i, toBottom: u } = Pw(s);
    pe(
      () => n.lines.length,
      () => je(() => {
        var f;
        i(), s.value && ((f = n.feed) == null || f.drawn(s.value));
      }),
      { immediate: !0 }
    );
    function c(f) {
      l(), a("older", f.target);
    }
    return (f, h) => (r(), d("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      V(v(L(Fw)(e.lines.join(`
`)) || e.empty), 1),
      L(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => L(u)(!0))
      }, "Follow")) : b("", !0)
    ], 544));
  }
}, Hw = /* @__PURE__ */ H(Ww, [["__scopeId", "data-v-5a8693fe"]]), zw = "*.*", Uw = {
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
    const t = e, n = Me(Re, null), a = new Zl();
    pe(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = C(() => !!(t.declaration.shipped || t.declaration.trusted)), i = C(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [zw] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), F(Qi, {
      key: 0,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), F(Yi, {
      key: 1,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Gw = { class: "mark-more-inner" }, Vw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Kw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Yw = {
  key: 3,
  class: "mark-lines"
}, Qw = "process", cl = "task", Xw = {
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
    const t = e, n = nt(), a = C(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = C(() => Aw.has(t.mark.variant) && t.mark.detail || ""), o = C(() => t.mark.target_model === cl ? t.mark.target_id : 0), l = ir(
      lr(n),
      () => t.mark.target_id
    ), i = l.lines, u = A(!1), c = A(""), f = C(() => !t.declaration.body_url && t.mark.target_model === Qw && !!t.mark.target_id);
    async function h(y = l.follow) {
      const k = await y();
      u.value = !0, c.value = k.ok ? "" : k.error;
    }
    const p = C(() => t.shown && f.value);
    return pe(p, (y) => y && h()), js(() => p.value && h(), () => p.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, k) => (r(), d("div", {
      class: K(["mark-more", { open: e.shown }]),
      onClick: k[1] || (k[1] = Se(() => {
      }, ["stop"]))
    }, [
      m("div", Gw, [
        e.declaration.body_url ? (r(), F(Uw, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(D, { key: 1 }, [
          s.value ? (r(), d(D, { key: 0 }, [
            k[2] || (k[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Vw, v(s.value), 1)
          ], 64)) : b("", !0),
          f.value && c.value ? (r(), d("p", Kw, v(c.value), 1)) : f.value && u.value ? (r(), d(D, { key: 2 }, [
            k[3] || (k[3] = m("p", { class: "mark-label" }, "Output", -1)),
            O(Hw, {
              class: "mark-terminal",
              lines: L(i),
              feed: L(l).feed,
              onOlder: L(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", Yw, v(a.value.join(`
`)), 1)) : b("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: k[0] || (k[0] = Se((T) => L(De)(`${cl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : b("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Cs = /* @__PURE__ */ H(Xw, [["__scopeId", "data-v-df71b15a"]]), Jw = ["title", "aria-label", "onClick"], Zw = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, e2 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = C(() => cf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = A(""), s = Me(Re);
    async function o(l) {
      const i = await bn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(D, null, [
      (r(!0), d(D, null, ne(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: Se((c) => o(u), ["stop"])
      }, [
        O(Et, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, Jw))), 128)),
      a.value ? (r(), d("span", Zw, v(a.value), 1)) : b("", !0)
    ], 64));
  }
}, t2 = /* @__PURE__ */ H(e2, [["__scopeId", "data-v-7a62c88e"]]);
function ur(e, t) {
  const n = Je(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ee.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const cr = ur("/api/marks", "marks"), I6 = cr.fetchAll, n2 = cr.find, a2 = ["data-ref"], s2 = ["data-ref"], o2 = { class: "mark-row" }, l2 = "dock add", i2 = "questions.answer", r2 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = C(() => n2(a.mark.type)), o = C(() => Rw(a.mark, s.value)), l = C(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = C(() => l.value || !!o.value.handlers.onAct), u = C(() => a.mark.type === i2), c = A(!1);
    function f() {
      c.value = !c.value;
    }
    const h = C(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var k;
        return !a.docked || !((k = y.runs) != null && k.startsWith(l2));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var k, T;
      return (k = s.value) != null && k.card ? (r(), d("div", {
        key: 0,
        class: K(["thread-turn", "card", "whole-card", { "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        O(Cs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, a2)) : (r(), d("div", {
        key: 1,
        class: K(["thread-turn", "card", { "full-width": (T = s.value) == null ? void 0 : T.full_width, docked: e.docked, "user-side": L(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", o2, [
          O(or, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Dl({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: S }) => [
                O(Cs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: S
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          O(t2, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, s2));
    };
  }
}, u2 = /* @__PURE__ */ H(r2, [["__scopeId", "data-v-424ddb61"]]), c2 = ["data-ref"], d2 = ["inert"], f2 = { class: "group-fold" }, h2 = { class: "thread-group" }, m2 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = A(!1), a = A(!1), s = A(!1), o = A(null);
    pe(n, async (i) => {
      var u;
      a.value = !0, await je(), (u = o.value) == null || u.offsetHeight, s.value = i;
    });
    const l = C(() => ({
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
      O(or, {
        mark: l.value,
        open: n.value,
        onClick: u[0] || (u[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (r(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: K(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", f2, [
          m("div", h2, [
            (r(!0), d(D, null, ne(e.group.marks, (c) => (r(), F(u2, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, d2)) : b("", !0)
    ], 8, c2));
  }
}, B6 = /* @__PURE__ */ H(m2, [["__scopeId", "data-v-45b58b9b"]]);
function p2(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), tt(() => n.disconnect()), t;
}
const g2 = { class: "chat-dock-fold" }, v2 = ["aria-label"], y2 = { class: "chat-dock-head" }, b2 = { class: "chat-dock-inner" }, k2 = { class: "chat-dock-foot" }, dr = 700, w2 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = A(null), a = A(null), s = p2(a), o = A(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, dr)), tt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: K(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", g2, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: K(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(i.$slots, "edge", {}, void 0, !0),
          m("header", y2, [
            ue(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: K(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", b2, [
              m("div", {
                class: K(["chat-dock-grow", { settled: o.value }]),
                style: ye(L(s) === null ? null : { height: `${L(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(i.$slots, "still", {}, void 0, !0),
          m("footer", k2, [
            ue(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, v2)
      ])
    ], 2));
  }
}, $2 = /* @__PURE__ */ H(w2, [["__scopeId", "data-v-574cba3d"]]), x2 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ua = 5, S2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ua, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ua}s`, animationDelay: `${(n - Ua).toFixed(2)}s` };
    return (s, o) => (r(), d("span", x2, [
      m("i", { style: a })
    ]));
  }
}, M2 = /* @__PURE__ */ H(S2, [["__scopeId", "data-v-2a7bc150"]]), _2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Es = (e) => e.charAt(0).toUpperCase() + e.slice(1), C2 = (e) => Es(e.replace(/_at$/, "").replaceAll("_", " ")), E2 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, A2 = (e, t, n) => [Es(`${e} ${n}`), (t == null ? void 0 : t.state) && Es(t.state)].filter(Boolean).join(" · "), fr = (e) => e.given_name || `${Jn(e.role)} ${e.id}`, O2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? fr(t) : (e == null ? void 0 : e.name) ?? "", T2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? fr(t) : "", I2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !_2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: C2(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], B2 = { reviewing: "Under review" }, R2 = (e, t) => e || B2[t == null ? void 0 : t.state] || "", hr = ur("/api/docks", "docks"), R6 = hr.fetchAll, Rt = hr.find, L2 = 6, Ga = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, io = (e) => Date.parse(e.leaves_at) / 1e3, Jt = (e) => !!(e.leaves_at && !e.kept), N2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Jt(e) || t < io(e) || n.has(e.id)), q2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => N2(a, t, n)).sort((a, s) => a.id - s.id);
function D2(e, t, n = L2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(io(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const P2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), As = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), j2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), F2 = (e) => ({ ...e.kept ? As("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : As("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), W2 = ["keep", "unkeep", "open", "undock"], H2 = (e) => ({ ...e, iconOnly: W2.includes(e.action) });
function z2(e, t) {
  var n;
  return [
    ...j2(e, t) ? [F2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Vt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    As("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(H2);
}
function mr(e, t) {
  const n = z2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: P2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const U2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || mr(e, t).title, G2 = { class: "dock-text" }, V2 = ["title"], K2 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Y2 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, Q2 = {
  key: 1,
  "data-dock-row": ""
}, X2 = { class: "dock-acts" }, J2 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = C(() => Rt(a.item.type)), o = oo(), l = C(() => wn(a.item.created_at, o.value * 1e3)), i = A(null), u = A(null), c = A(null), f = A(null), h = C(() => mr(a.item, s.value)), p = nt(), y = C(() => `dock.${a.item.id}`), k = C(() => p.props[y.value].data.value), T = C(() => U2(a.item, s.value, k.value)), S = C(() => na(a.item.target_model ?? "")), x = C(() => {
      var $;
      return (($ = s.value) == null ? void 0 : $.word) ?? "";
    }), B = C(() => ({ ...k.value, id: a.item.target_id, term: S.value })), W = () => {
      var $, g;
      return ((g = ($ = s.value) == null ? void 0 : $.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    _c(Pl, { data: k, reload: W, readOutput: lr(p) }), pe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      ($, g, M) => {
        var R;
        W();
        const E = (R = p.followUndeclared) == null ? void 0 : R.call(p, [`${S.value.replaceAll("-", "_")}.*`], (U) => {
          (!U.row_id || U.row_id === a.item.target_id) && W();
        });
        M(() => E == null ? void 0 : E());
      },
      { immediate: !0 }
    );
    const N = A(/* @__PURE__ */ new Set()), w = A("");
    async function z($) {
      if ($.action === "undock") return n("undock", $);
      if ($.action === "open") return De(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (N.value = /* @__PURE__ */ new Set([...N.value, $.label])), w.value = "";
      const M = await bn($, { id: a.item.target_id }, p.environment);
      (M == null ? void 0 : M.ok) === !1 && (N.value = new Set([...N.value].filter((E) => E !== $.label)), w.value = `Could not ${$.label.toLowerCase()}: ${M.error}`);
    }
    const j = C(() => h.value.actions.filter(($) => !N.value.has($.label))), q = C(() => {
      var $;
      return R2(($ = s.value) == null ? void 0 : $.badge, B.value);
    }), _ = C(() => h.value.controls), I = C(() => {
      var $;
      return !!(($ = s.value) != null && $.draws_head) && !a.collapsed;
    });
    return ($, g) => {
      var M, E, R, U;
      return r(), F($2, {
        label: h.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        type: (E = s.value) != null && E.needs_user ? "waiting" : "",
        folded: !!((R = s.value) != null && R.folds) && e.folded,
        body: !!((U = s.value) != null && U.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[3] || (g[3] = (ee) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (r(), F(M2, {
            key: 0,
            "ends-at": L(io)(e.item)
          }, null, 8, ["ends-at"])) : b("", !0)
        ]),
        head: P(() => {
          var ee;
          return [
            I.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(D, { key: 1 }, [
              O(le, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", G2, [
                m("span", {
                  class: K(["dock-title", { strip: e.collapsed }]),
                  title: T.value
                }, v(T.value), 11, V2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (ee = s.value) != null && ee.leaves_after_seconds ? b("", !0) : (r(), d(D, { key: 0 }, [
                V(v(l.value), 1)
              ], 64))
            ], 512),
            _.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = Se(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(D, null, ne(_.value, (Z) => {
                var me, ve;
                return r(), d(D, {
                  key: Z.action + Z.runs
                }, [
                  !N.value.has(Z.label) && (!((me = Z.variants) != null && me.length) || !((ve = B.value) != null && ve.state) || Z.variants.includes(B.value.state)) ? (r(), F(ge, {
                    key: 0,
                    variant: "icon",
                    class: K({ kept: Z.pressed }),
                    "aria-pressed": Z.pressed,
                    "aria-label": Z.label,
                    title: Z.label,
                    "data-dock-action": Z.action,
                    onClick: (be) => z(Z)
                  }, {
                    default: P(() => [
                      O(le, {
                        name: Z.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : b("", !0)
                ], 64);
              }), 128))
            ])) : b("", !0)
          ];
        }),
        still: P(() => [
          w.value || e.refusal ? (r(), d("p", K2, v(w.value || e.refusal), 1)) : b("", !0)
        ]),
        foot: P(() => {
          var ee;
          return [
            m("span", Y2, [
              q.value ? (r(), d("span", {
                key: 0,
                class: K(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : b("", !0),
              x.value ? (r(), d("span", Q2, v(x.value) + " " + v(e.item.target_id), 1)) : b("", !0),
              m("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (ee = s.value) != null && ee.folds ? (r(), F(ge, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (Z) => n("fold"))
            }, {
              default: P(() => [
                V(v(s.value.folds) + " ", 1),
                O(Kt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : b("", !0),
            m("span", X2, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              O(Ys, {
                name: `dock.${e.item.type}`,
                row: B.value,
                environment: L(p).environment,
                "read-only": L(p).readOnly,
                "object-name": L(na)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (Z) => w.value = Z),
                onDone: $.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (r(!0), d(D, null, ne(j.value, (Z) => (r(), F(ge, {
                key: Z.action + Z.runs,
                small: "",
                variant: Z.primary ? "primary" : "ghost",
                bordered: !Z.primary,
                "data-dock-action": Z.action,
                onClick: (me) => z(Z)
              }, {
                default: P(() => [
                  V(v(Z.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: P(() => {
          var ee;
          return [
            (ee = s.value) != null && ee.body_url ? (r(), F(Cs, {
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
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : b("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, dl = /* @__PURE__ */ H(J2, [["__scopeId", "data-v-c4a0c2b2"]]), Z2 = 24, e5 = 8, L6 = 420;
function N6({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Z2 ? !0 : e < t && s > e5 ? !1 : null;
}
const t5 = (e, t) => e === void 0 ? t : e, n5 = { me: 1, people: [] }, oa = zt({
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
  people: n5,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Zn("journal.activity", !0),
  wide: !1,
  sideMini: Zn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
wi("journal.activity", () => oa.activity);
wi("journal.side.mini", () => oa.sideMini);
const pr = "journal.viewer.";
function a5(e, t, n) {
  try {
    const a = n.getItem(pr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function s5(e, t, n) {
  try {
    n.setItem(pr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function fl(e, t, n = window.localStorage) {
  const a = A(a5(e, t, n));
  return pe(a, (s) => s5(e, s, n), { deep: !0 }), a;
}
const o5 = {
  key: "dock-all",
  class: "dock-all"
}, l5 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var $, g;
    const t = e, n = Jk(500), a = A(/* @__PURE__ */ new Set()), s = Me(Re), o = A(/* @__PURE__ */ new Set()), l = A({});
    async function i(M, E) {
      l.value = { ...l.value, [M.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, M.id]);
      const R = await bn(E, { id: M.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((U) => U !== M.id)), l.value = { ...l.value, [M.id]: `Could not dismiss this card: ${R.error}` });
    }
    const u = C(
      () => q2(
        t.items.filter((M) => !o.value.has(M.id)),
        n.value,
        a.value
      )
    ), c = C(
      () => D2(
        u.value.filter((M) => Ga(M, Rt)),
        n.value
      )
    ), f = C(() => u.value.filter((M) => !c.value.includes(M) && !Ga(M, Rt))), h = fl(`dock-size:${(($ = oa.identity) == null ? void 0 : $.root) || location.host}`, null), p = (M) => {
      var E;
      return !!((E = Rt(M.type)) != null && E.needs_user);
    }, y = A(/* @__PURE__ */ new Set()), k = A(/* @__PURE__ */ new Set()), T = C(() => u.value.length === 1), S = (M) => p(M) || T.value, x = (M) => S(M) ? y.value.has(M.id) || k.value.has(M.id) : h.value ? h.value.collapsed && !h.value.opened.includes(M.id) : t.collapsed, B = C(() => u.value.some(x));
    pe(() => t.collapsed, (M) => {
      k.value = new Set(M ? u.value.filter(p).map((E) => E.id) : []);
    });
    function W() {
      const M = !B.value;
      h.value = { collapsed: M, opened: [] }, y.value = new Set(M ? u.value.filter(p).map((E) => E.id) : []), k.value = /* @__PURE__ */ new Set();
    }
    function N(M) {
      var R;
      if (!x(M)) return;
      if (S(M)) {
        y.value = new Set([...y.value].filter((U) => U !== M.id)), k.value = new Set([...k.value].filter((U) => U !== M.id));
        return;
      }
      const E = (R = h.value) != null && R.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...E, M.id] };
    }
    const w = fl(`dock-folded:${((g = oa.identity) == null ? void 0 : g.root) || location.host}`, {}), z = (M) => {
      var E;
      return !!((E = Rt(M.type)) != null && E.folds) && (t.insidesFolded || t5(w.value[M.id], Ga(M, Rt) || t.folded));
    };
    function j(M) {
      z(M) && q(M), w.value = { ...w.value, [M.id]: !z(M) };
    }
    function q(M) {
      var E;
      !((E = h.value) != null && E.collapsed) || h.value.opened.includes(M.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, M.id] });
    }
    function _(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function I(M) {
      a.value = new Set([...a.value].filter((E) => E !== M.id));
    }
    return (M, E) => (r(), F(Ds, {
      tag: "div",
      name: "dock",
      duration: L(dr),
      class: "dock-stack"
    }, {
      default: P(() => [
        u.value.length > 1 ? (r(), d("div", o5, [
          O(ge, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": B.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: P(() => [
              O(Kt, {
                open: !B.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : b("", !0),
        (r(!0), d(D, null, ne(f.value, (R) => (r(), F(dl, {
          key: R.id,
          item: R,
          class: K({ timed: L(Jt)(R) }),
          leaving: L(Jt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (U) => N(R),
          onFold: (U) => j(R),
          onUndock: (U) => i(R, U),
          onMouseenter: (U) => _(R),
          onMouseleave: (U) => I(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(D, null, ne(c.value, (R) => (r(), F(dl, {
          key: R.id,
          item: R,
          class: K({ timed: L(Jt)(R) }),
          leaving: L(Jt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (U) => N(R),
          onFold: (U) => j(R),
          onUndock: (U) => i(R, U),
          onMouseenter: (U) => _(R),
          onMouseleave: (U) => I(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, q6 = /* @__PURE__ */ H(l5, [["__scopeId", "data-v-2c47a65e"]]), St = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Gn = (e) => Math.min(Math.max(e, 0), 1), i5 = (e) => {
  const t = Gn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => i5((e - t) / (n - t));
function D6(e) {
  const t = Gn(e), n = Gn((t - 0.12) / 0.76) * St.shuffles, a = Math.min(Math.floor(n), St.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), u = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Gn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / St.shuffles, lift: St.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function P6(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const hl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, j6 = (e) => hl[e] ?? hl.butler, ro = 2400, r5 = 0.05;
function u5({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, r5), l = Math.min(t + ro * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function F6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function c5(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function W6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const H6 = (e, t) => ({ ...e, stretch: t.stretch }), z6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, gr = (e, t) => t >= (e.least ?? 0);
function U6(e, t, n) {
  if (!gr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const G6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), d5 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ml = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), f5 = (e) => e.right > e.left && e.bottom > e.top;
function V6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(d5)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = ml(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = ml(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), f5(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function vr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[p]) && (i = -1);
      else {
        const k = (o[h] - e[f]) / y, T = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(k, T)), i = Math.min(i, Math.max(k, T));
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
}, fn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), h5 = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => h5(fn(e, t, n)), m5 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], pt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Pn = ([e, t], n) => e + n() * (t - e);
function p5(e) {
  return m5.map(() => {
    const t = Pn(pt.speed, e), n = Pn(pt.angle, e) * Math.PI / 180, a = Pn(pt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Pn(pt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const g5 = p5(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function v5(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * pt.gravity * (t[2] - pt.floor))) / pt.gravity;
}
function K6(e, t, n = g5) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = v5(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * u);
  return c[2] -= pt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const Y6 = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function Q6(e, t) {
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
const X6 = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), Pt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function J6(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, i] = [t.left + Pt.margin * n, t.right - Pt.margin * n], u = Math.min(Math.max(e + o + s * Pt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function Z6(e, t, n) {
  const a = Oe.bug_smash, s = Te(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Pt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Pt.tall * n * (1 - Te(t, a.emerge)),
      turn: 90 * (1 - Te(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Te(t, a.gone)
    }
  };
}
function eM(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Pt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = u5({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const qe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function tM(e) {
  const t = qe.least + Math.floor(e() * (qe.most - qe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: qe.walls[Math.floor(e() * qe.walls.length)],
    along: qe.margin + e() * (1 - 2 * qe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Os(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * qe.margin, l = ((e.along - qe.margin + e.way * qe.speed * n / a) / s % 2 + 2) % 2, i = qe.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + qe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + qe.inset : t.right - qe.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function y5(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = c5(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function nM(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: i, shot: u } = y5(n, e.length), c = e.map((x, B) => ({ ...Os(x, t, Math.min(n / o.fps, Vn(B).shot)), shot: B < u })), f = Te(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((x, B) => ({ bug: x, index: B, seconds: n / o.fps - Vn(B).shot, spot: Os(x, t, Vn(B).shot) })).filter((x) => x.seconds >= 0), k = y.flatMap((x) => {
    const B = (s == null ? void 0 : s.get(x.index)) ?? x5(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, B), s && S5(B, x.seconds, a), M5(B, x.seconds, a);
  }), T = y.filter((x) => w5(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * f, y: h.y + (p.y - h.y) * f, back: S }, slush: k, camera: T };
}
function Vn(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function aM(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const h = Vn(f), p = Os(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), k = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), T = Math.abs(p.x - u) >= y ? u : p.x + k * y, S = k > 0 ? Math.max(u, Math.min(T, i)) : Math.min(u, Math.max(T, l)), x = { from: u, to: S, begin: h.walk, end: h.aim };
    return u = S, x;
  });
}
function sM(e, t, n) {
  var o;
  const a = Oe.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Te(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, b5 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function k5(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const w5 = (e) => e.along * 97 % 1 < Ce.camera, hn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function $5(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), h = hn(e, f), p = vr(i, h, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = h;
  }
  const u = hn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function x5(e, t, n, a = []) {
  const s = k5(e.along + 1), [o, l] = b5[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...$5(f, t, a) };
  });
}
function S5(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), i = vr(hn(a, o), hn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function M5(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...hn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ce.hold) / Ce.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function oM(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Oe.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, h = Te(e, [0, c]), p = Te(e, [c, c + f]);
  return l.map((y) => {
    const k = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (k.x - n.x) * h,
      y: n.y + (k.y - n.y) * h,
      r: y.size * t * (0.15 + 0.85 * h * h),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: h >= 1
    };
  });
}
function lM(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], h = (T) => {
    const [S, x] = [T.x - e.at.x, T.y - e.at.y];
    return { x: i.x + S * c - x * f, y: i.y + S * f + x * c };
  }, [p, y] = [...n].sort((T, S) => T.x - S.x), k = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: k.map((T, S) => ({ from: T, to: S < k.length / 2 ? p : y })) };
}
const iM = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function la(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: fn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: fn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function rM(e, t) {
  const n = Oe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = la(n, t), l = 1 - (1 - n.small) * Te(a, n.shrinks) * (1 - Te(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = la(n, t), o = n.flat * Te(a, n.squashes) * (1 - Te(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * fn(s, ...n.springs)) * (1 - fn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const uM = (e) => e === "pack_box";
function cM(e) {
  const { into: t, out: n } = la(Oe.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function dM(e) {
  const t = Oe.rope_swing, { into: n, out: a } = la(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const _5 = { after: 3 }, uo = 10, C5 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, E5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, A5 = { weight: 19 }, yr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, O5 = { every: 120 }, br = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, kr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, T5 = {
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
}, xn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: uo }), re = (e, t, n = {}) => xn(e, "clip", t, n), Va = (e, t, n = {}) => xn(e, "look", t, n), pl = (e, t, n = {}) => xn(e, "gaze", t, n), ke = (e, t, n = {}, a = {}) => ({ ...xn(e, "pick", t, n), ...a }), $e = (e) => xn("nothing", "nothing", e, {}), I5 = 120, B5 = 300, Ka = (e, t) => ({ ...re(e, t), cooldown: B5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), R5 = () => [re("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: C5[e.name] }), Xt = (e) => ({ ...e, shenanigan: !0, lasts: E5[e.name] }), wa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), $e(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(re("bug_smash", 2)), toward: "", onto: !1 },
    re("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [re("startled", 2), re("dismay", 1), re("tantrum", 3), $e(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [re("nod", 2), $e(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [re("halo", 1), $e(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [re("repent", 1), $e(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [re("nod", 4), re("hand_rub", 4), $e(7)]),
  ...fe("question_asked", { cooldown: 60 }, [re("ask_sign", 9), re("look_up", 3), $e(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [pl("read", 3), re("nod", 1), $e(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [pl("read", 3), $e(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), $e(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), $e(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, R5()),
  ...fe("bar_failed", { holds: !0 }, [re("fume", 1), re("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [re("look_left", 2), re("look_right", 2), re("look_up", 1), $e(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [re("tumble", 3), $e(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [re("wipe_brow", 4), re("look_left", 1), re("look_right", 1), $e(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [re("shake", 3), re("tantrum", 2), $e(2)]),
  ...fe("refused", { cooldown: 20 }, [re("shake", 1), $e(1)]),
  ...fe("work_done", { cooldown: 120 }, [re("stretch", 2), $e(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [ke("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [ke("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [ke("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [Va("amused", 3), $e(2)]),
  ...fe("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    $e(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [re("stumble", 3), $e(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), $e(13)]),
  ...fe("typing", { cooldown: 60 }, [Va("reading", 1), $e(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(T5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Va(t, 1)])),
  ...Object.entries(br).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(kr).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    wt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    wt("rest", 3, 180, 120),
    wt("yawn", 2, 60, 60),
    wt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    wt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    wt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    wt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Xt($t(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Xt($t(re("disco", 2, { ball: "bubble" }))),
    $e(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: I5 }, [Ka("search", 3), { ...Ka("binoculars", 2), when: { home: !0 } }, { ...Ka("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...fe("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [ke("writing", 12, { state: "writing" }), ke("reading", 12, { state: "reading" }), ke("searching", 12, { state: "searching" }), $e(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...$t(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [re("eager", 2, { slow: !0 }), $e(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [Xt($t(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [ke("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: yr.build.cooldown }, [ke("unit", A5.weight), $e(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ke("hang", 1, { hands: !0, free: !0 }), cooldown: O5.every }, ke("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [ke("0", 1), ke("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    ke("rest", 35, {}, { stay: [25, 60] }),
    ke("seat", 15, {}, { stay: [15, 40] }),
    ke("edge", 25, {}, { stay: [8, 20] }),
    Xt(ke("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ke("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ke("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ke("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ke("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ke("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Xt($t(ke("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...fe("laptop", {}, [ke("seat", 6, {}, { stay: [60, 150] }), ke("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...fe("ledge_at", {}, [ke("middle", 2, {}, { along: 1 / 2 }), ke("third", 1, {}, { along: 1 / 3 }), ke("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...fe("composed_as", {}, [
    ke("facing", 4, {}, { turn: 0, leans: 0 }),
    ke("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ke("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ke("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ke("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], wr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), $r = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), L5 = (e) => Array.isArray(e) ? e[0] : e, N5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, q5 = (e) => wa.some((t) => t.when.moment === e);
function D5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || $r(f).every(([h, p]) => n(h) >= L5(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = wa.filter((f) => wr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= _5.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Ke(e, t) {
  const n = D5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (xr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function xr(e, t, n) {
  var a;
  for (const [s, o] of $r(t)) (a = e.memory) == null || a.set(s, e.now + N5(o, n));
}
function fM(e, t, n) {
  xr(e, wa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const hM = (e) => Object.values(yr).find((t) => wr(t.when, e)) ?? null, P5 = (e, t, n) => n - t <= (e.lifetime ?? uo), mM = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || gr(e.clip, t));
class Sr {
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
const Ts = {
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
}, pM = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Mr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), gM = {
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
}, vM = 120, j5 = 20, yM = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < j5), F5 = (e) => Ts[e] || Ts.idle, bM = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, _r = "airborne", W5 = "landing", H5 = "travelling", Cr = "grounded", kM = ({ airborne: e, landing: t, trip: n }) => e ? _r : t ? W5 : n != null && n.started ? H5 : Cr;
function wM(e, t) {
  var s;
  const n = z5(e, t);
  return e.mode === Cr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function z5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === _r && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...U5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : F5(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function U5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Is = (e) => e.outcome, G5 = /^plugin:[^:]+:sins:/, gl = (e) => e.type === "plugins.card" && G5.test(e.markKey), V5 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => gl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => gl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], $M = (e, t) => e.filter((n) => n.author === "user" && aa(n.read_at) > t).map((n) => ({ beat: "read_message", time: aa(n.read_at), card: Bi(n) })).sort((n, a) => n.time - a.time), vl = { user: "reacted", agent: "agent_reacted" };
function xM(e, t) {
  return e.filter((n) => vl[n.author] && Ct(n) > t).map((n) => ({ beat: `${vl[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const K5 = [.../* @__PURE__ */ new Set([...Object.values(br).flatMap((e) => Object.keys(e)), ...Object.keys(kr)])];
function SM(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = K5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: Bi(n) })).sort((n, a) => n.time - a.time);
}
const Y5 = (e) => new Sr(e).isTest(), ia = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Is(e)] || "";
}, Q5 = 1800, X5 = (e, t) => {
  if (ia(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ia(n) !== "finished" && Number(e.time) - Number(n.time) <= Q5 ? "tests_fixed" : "tests_passed";
};
function MM(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Y5), s = a.filter((i) => ia(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ia(i))), o.map((i) => ({ beat: X5(i, s), time: Number(i.time), card: i.key }));
}
function _M(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Is(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Is(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const CM = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Ct(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function EM(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function AM(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function OM(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = V5.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function co(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const yl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function J5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    co(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function TM(e, t, n, a = {}) {
  const s = Ke({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : q5(`held:${e}`) ? "idle" : e;
}
const Ne = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function IM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ne.ahead * n ? 180 : Math.sign(a) * Ne.turn;
}
const bl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function BM(e, t) {
  const n = Math.min(Ne.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ne.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ne.lines, Math.floor((e.bottom - e.top - 2 * a) / Ne.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Ne.sweep) % s, i = o % Ne.sweep, u = Ne.sweep - Ne.returnSeconds, c = bl((i - u) / Ne.returnSeconds), f = i <= u ? bl(i / u) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * Ne.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const kl = 3, Er = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, wl = 12, RM = (e, t) => ({ mood: e, began: t, seen: 0 });
function LM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Er(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= kl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * wl) / wl, lasts: kl } };
}
const NM = (e) => e.posture === "hang" && !Er(e.face), Z5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), e$ = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function qM(e, t, n) {
  return Z5.has(e) ? 1 / 0 : !e$.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Ar(n - t.began, t.share) - it.lead, 0);
}
const t$ = 5;
function DM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= t$ ? { beat: "long_walk", time: n } : null };
}
const n$ = 30, jn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function PM(e, t, n, a, s = null) {
  if (t && n < t.until || !jn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ke({ moment: "spell", state: e, tally: s }, a), [l, i] = jn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + jn.every } : { state: e, began: 0, until: 0, next: n + jn.every };
}
const jM = (e, t, n) => t && n < t.until && Mr.has(e.state) ? { state: t.state, since: t.began } : e, it = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Ar = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function FM(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Ar(o, e.share);
  return s ? { eager: a$(t, l), moment: null } : l > it.lead ? { eager: t, moment: null } : l < it.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > it.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < it.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ke({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function a$(e, t) {
  return e.on && t > it.lead + it.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= it.lead && t >= it.least ? { ...e, on: !0, calm: !1 } : e;
}
const s$ = 1, o$ = { look: "look", gaze: "gaze" };
function l$(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ke({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [o$[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const i$ = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Ke({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), r$ = (e, t, n, a, s, o = 0) => Ke({ moment: "jump", high: e > s$ * t, memory: a, now: s, room: o }, n).name === "backflip", u$ = { work: ["building"], idle: ["standing"] };
function WM(e, t, n, a) {
  const s = Ts[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(u$[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Mr.has(e) ? { moments: o, began: n || a } : (n && a - n >= n$ && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function c$(e, t, n) {
  return !Ke({ moment: "pondering", memory: e, now: t }, n) || !Ke({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ke({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const $l = { pondering: c$ };
function HM(e, t, n, a, s, o) {
  if ($l[e.beat]) {
    const i = $l[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = l$(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== uo && { lifetime: l.lifetime } } } : null;
}
function zM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = i$(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const UM = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function GM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function VM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const KM = (e, t) => !!(e != null && e.watches) && !t.once, YM = 10, QM = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || P5(a, a.queuedAt, n)), XM = (e, t) => t ? null : e[0] ?? null;
function JM(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const ZM = (e, t) => !t.during || !e.some((n) => n.during === t.during), d$ = 2 * Math.PI, f$ = 500;
function e_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / f$, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = d$ * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, T = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? m$(y, t, n, p, s) : g$(y, t, n, p) : t) ?? y, S = T != null && T.behind && T.mood === "reading" ? h$(e.point, T, n, l, s) : T;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: a };
}
function h$(e, t, n, a, s) {
  const o = (_) => _ * 180 / Math.PI, l = (_) => o(Math.atan2(Math.sin(_ * Math.PI / 180), Math.cos(_ * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : f, k = y + l(c - y), T = Math.min(Math.max(a / 1e3, 0), 0.1), S = Ne.turnSpeed * T, x = h ? y + Math.min(Math.max(k - y, -S), S) : k, B = h ? e.readingFollow + p : x, W = B + (x - B) * (1 - Math.exp(-T / Ne.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, w = o(co(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), z = Math.min(Math.max(w, -N.up), N.down), j = Ne.tipSpeed * T, q = h ? e.readingPitch + Math.min(Math.max(z - e.readingPitch, -j), j) : z;
  return { ...t, readingYaw: x, readingFollow: W, readingPitch: q, readingFacing: i };
}
function m$(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (B) => {
    const { yaw: W, pitch: N } = co(B.x - n.x, s, n.y - B.y, o);
    return { yaw: W, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [yl(i(e)), yl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [p, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [k, T, S] = u.map((B, W) => p * B + y * c[W]), x = s * k / T;
  return { ...t, x: n.x + x, y: n.y - J5(x, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const p$ = 0.15;
function t_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= p$;
}
function g$(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const v$ = (e) => !(e != null && e.on);
function n_(e, t, n) {
  if (v$(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const mn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, st = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ya = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), xl = (e) => e * e * (3 - 2 * e);
function y$(e) {
  if (e < 0 || e >= st.seconds) return null;
  const t = Ya(e, ...st.flicker), n = Math.floor(t * st.flickers * 2) % 2 === 0, a = e < st.flicker[1] ? n ? 0.35 + 0.5 * t : st.dim : 1;
  return { strength: 1 - xl(Ya(e, ...st.fade)), lit: a, white: e < st.flash[0] ? 0 : 1 - xl(Ya(e, ...st.flash)) };
}
const a_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function s_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = y$(t - e.at);
  return a && { colour: mn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: st.signs[e.tone], ...a } };
}
function o_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function l_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= mn.looks || a === null && n - e.since >= mn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function i_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const mt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, r_ = { behind: 39, figure: 40, ahead: 41 }, b$ = "[data-figure-pile]", k$ = { amber: [1, 0.69, 0.125], good: mn.colours.good, bad: mn.colours.bad }, Kn = { phases: 4, ms: 230, dim: 0.25 }, u_ = (e, t, n) => e !== "amber" || (t + n) % Kn.phases < Kn.phases / 2 ? 1 : Kn.dim, c_ = (e) => e === "amber" ? Kn.phases : 1;
function d_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const f_ = Object.keys(k$), Qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Zt = ([e, t], n) => e + n() * (t - e);
function h_(e) {
  const t = Qe.least + Math.floor(e() * (Qe.most - Qe.least + 1));
  return Array.from({ length: Math.min(t, Qe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Qe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Zt(Qe.start, e), l = Zt(Qe.reach, e);
    return {
      text: Ke({ moment: "digit" }, e).name,
      x: a * o,
      y: Qe.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Zt(Qe.moveMs, e)),
      fadeMs: Math.round(Zt(Qe.fadeMs, e))
    };
  });
}
const Qa = { high: 3, gap: 1 };
function m_(e) {
  const t = Math.floor(e / Qa.high);
  return { left: -(mt.inside + mt.width / 2 + t * (mt.width + Qa.gap)), up: e % Qa.high * (mt.height - mt.top) };
}
const w$ = (e, t, n) => Ke({ moment: "unit", memory: e, now: t }, n) !== null, $$ = { after: 5 }, x$ = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Sr(t).isBuild());
function p_(e, t, n) {
  const a = x$(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= $$.after ? s : null;
}
function g_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: w$(n, a, s) } : null;
}
const Sl = { ahead: 140, up: 70 };
function v_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Sl.ahead, y: a - Sl.up } } : o ? { at: { x: n(o), y: a - o.up - mt.height } } : t ? { at: null } : null;
}
const Xa = { least: 4e3, most: 1e4 }, S$ = (e) => Xa.least + e() * (Xa.most - Xa.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function y_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = S$(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const b_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), k_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Or = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), w_ = new Set(wa.filter((e) => Or.has(e.when.moment) && e.type === "clip").map((e) => e.name)), M$ = (e) => e.some((t) => t.state === "built"), $_ = (e, t) => M$(t) ? e.filter((n) => !Or.has(n.beat)) : e, vt = { reach: 40, room: 6 }, _$ = (e, t) => t <= e - vt.reach + 2, x_ = (e, t, n) => _$(e, n) ? t - vt.reach : e - vt.reach - vt.room, S_ = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, Ja = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, M_ = (e) => Zt(e() < Ja.longShare ? Ja.long : Ja.short, e), C$ = 2 * mt.width;
function __(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= C$ ? o : e + (o - e + s / 2) % s;
}
const E$ = 60, C_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= E$, Ml = "[data-figure-home]", Sn = () => {
  var t;
  const e = document.querySelector(Ml);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ml)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, A$ = "[data-figure-docked-bars]", O$ = "[data-figure-chat-foot]", T$ = [0.85, 0.6, 0.35, 0.15], I$ = ["question", "waiting", "suggestion"], E_ = (e, t) => I$.find((n) => e[n] > 0 && t[n] === "behind") || null;
function A_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const B$ = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", R$ = "[data-figure-newest]";
function Tr() {
  var a, s;
  const e = (a = Sn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(R$), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !fo(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function pn(e, t, n = Tr()) {
  if (!e || !n) return !0;
  const a = ct(e, t), s = xa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ie.top * t.size, bottom: a.top + Ie.bottom * t.size }, l = St.gap;
  return !$a(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function O_(e, t, n, a = Tr()) {
  if (!a || pn(t, e, a)) return null;
  const s = xa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Ot(), u = t.posture === "stand" ? mo * e.size : Pr * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - St.gap - l, a.right + St.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && pn(p, e, a) && u4(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Za = 0.26, Ir = 0.54, L$ = 1.25 / 5.4, Mn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Za, travels: "stand" },
  lounge: { drop: Za, travels: "stand" },
  composed: { drop: Za, travels: "stand" },
  hang: { drop: Ir, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, T_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * L$ * Math.cos(t * Math.PI / 180),
  y: 1 - n - Ir
}), nn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), N$ = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), I_ = (e, t) => (e === "sit" ? N$.has(t) : nn.has(e)) ? e : "stand";
function B_(e, t) {
  return e.facing === t.facing || !nn.has(e.posture) && !nn.has(t.posture) ? t : { posture: "stand", facing: nn.has(e.posture) ? e.facing : t.facing };
}
const R_ = 0.25, L_ = (e, t) => nn.has(e) && Mn[t].drop === 0, Br = 2, q$ = 90, D$ = 180, P$ = 140, j$ = 280, F$ = 420, W$ = 0.25, H$ = 290, z$ = 600, U$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", G$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", es = 5;
function ra(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < es) return null;
  (l || i) && (o = Math.max(o, Br));
  const y = o > 1, k = Math.abs(t.x - e.x), T = k < es ? 0 : k / (q$ * o) * 1e3, S = Math.min(T, y ? P$ : D$), x = Math.abs(t.y - e.y), B = t.y < e.y, W = B && !p && r$(x, n, u, c, f, h), N = B ? F$ + Math.min(x, 400) * W$ : Math.sqrt(2 * x / ro) * 1e3, w = {
    x: t.x,
    y: t.y,
    ms: x > es ? W ? z$ : N : 0,
    lead: W ? H$ : B ? j$ : 0,
    easing: B ? U$ : G$,
    hopping: !0,
    clip: W ? "backflip" : B ? "jump" : "fall"
  }, z = { x: t.x, y: t.y, ms: T + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, j = p ? V$(t, n) : w, q = B && !a ? [{ ...z, y: e.y }, j] : [{ ...w, x: e.x }, z];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const V$ = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), K$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], N_ = (e, t, n) => e.posture === "walk" && n ? "walk" : K$(e.clip, t), ct = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Mn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, $a = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, fo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = Sn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Fn = 0.5, _l = 20;
function q_(e, t, n = Ot()) {
  const a = ct(e, t);
  return a.left >= n.left + _l && a.right <= n.right - _l;
}
function ho(e, t, n = Ot()) {
  const a = ct(e, t), s = a.right - a.left, o = xa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Fn && i <= n.right + Fn && a.top >= n.top - Fn && u <= n.bottom + Fn;
}
const ua = [0.35, 0.5, 0.65], ca = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ie = { left: ua[0], right: ua.at(-1), top: ca[0], bottom: ca.at(-1) }, Y$ = 0.24;
function xa(e) {
  if (e.posture === "stand") return { left: Ie.left, right: Ie.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Y$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ie.left, t), right: Math.max(Ie.right, t) };
}
function Q$(e, { size: t }, n = Ot()) {
  const a = xa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const mo = (Ie.right - Ie.left) / 2 + 0.08;
function D_(e, t) {
  return e === "hang" ? Ie : { ...Ie, bottom: Math.min(Ie.bottom, 1 - t - Mn[e].drop) };
}
const X$ = "[data-figure-agent]";
function Rr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !fo(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const Lr = (e) => ca.flatMap(
  (t) => ua.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function po(e, t, n = "") {
  if (!pn(e, t)) return ua.length * ca.length;
  const a = ct(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(B$)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && $a(s, u) && fo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return Lr(s).filter(([i, u]) => l(i, u) || Rr(i, u, n)).length;
}
function J$(e, t) {
  const n = ct(e, t);
  return Lr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Rr(a, s, "", X$)).length;
}
const Cl = 4;
function P_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Cl; o <= s; o += Cl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!J$(i, e) && pn(i, e)) return i;
    }
  return null;
}
function gn(e, t, n) {
  const a = Ot(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => ho(l, t, a) && pn(l, t)).map((l) => ({ spot: l, covered: po(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Nr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Z$ = [0.5, 0.25, 0.75], e4 = (e) => Nr(e.getBoundingClientRect(), Z$), qr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, t4 = mo, n4 = (e, t, { size: n }, a = t4) => Dr(e, qr[t], a * n, "stand");
function Dr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const a4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Pr = 0.1, s4 = (e, t, { size: n }) => Dr(e, a4[t], Pr * n, "sit"), o4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, ts = 60;
function j_(e, t) {
  const n = o4(t);
  return !e.aside || Math.abs(n) >= ts ? t : n < 0 ? 360 - ts : ts;
}
const an = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, l4 = (e) => [.../* @__PURE__ */ new Set([e, ...an.turns.map((t) => (t + 360) % 360)])];
function F_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = l4(t), l = an.every[0] + a() * (an.every[1] - an.every[0]);
  return { face: t, from: s ? i4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function i4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / an.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function W_(e, t) {
  const { element: n, edge: a } = Sa(), s = ["left", "right"].map((i) => _n(s4(a, i, e), e)).filter((i) => n && ho(i, e) && !po(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function H_(e, t, { size: n }) {
  const a = (Ie.right - Ie.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - jr } : e;
}
const jr = 7;
function Fr() {
  const e = [...document.querySelectorAll(b$)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function r4(e, t) {
  const n = ct(e, t), a = n.right - n.left;
  return { left: n.left + Ie.left * a, right: n.left + Ie.right * a, top: n.top + Ie.top * a, bottom: n.bottom };
}
function u4(e, t) {
  const n = Fr();
  return !n || !$a(r4(e, t), n);
}
const c4 = 4;
function Sa() {
  const e = Cn(), t = Fr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > c4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - jr - n, 0) } };
}
const z_ = ({ size: e, below: t }) => (1 - t) * e;
function _n(e, t) {
  const n = Ot(), { size: a, below: s } = t, o = Mn[e.posture].drop * a;
  return { ...Q$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Bs = (e, t) => Object.keys(qr).map((n) => _n(n4(e, n, t), t)), go = (e, t) => Nr(e, T$).map((n) => _n(n, t)), Wr = (e, t, n) => gn(e, t, n) ?? e[0];
function U_(e, t) {
  const { element: n, edge: a } = Sa();
  return { ...Wr(Bs(a, e), e, t), view: null, on: n };
}
function G_(e, t, n, a) {
  const { element: s, edge: o } = Sa(), l = (a ? Bs(o, t) : [...Bs(o, t), ...go(o, t)]).filter(
    (c) => !$a(ct(c, t), e)
  ), i = gn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !po(i, t) ? i : gn(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Cn() {
  var a;
  const e = Sn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(A$);
  if (!t) return { ...Ma(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const El = { within: 2 };
function V_(e) {
  const { element: t, docked: n, edge: a } = Cn();
  if (!n || e.on !== t) return !0;
  const s = Ma().edge;
  return a.left > s.left + El.within || a.left + a.width < s.left + s.width - El.within;
}
const d4 = "[data-figure-closing]";
function K_() {
  var n;
  const { element: e, docked: t } = Cn();
  return t && !!((n = e.firstElementChild) != null && n.matches(d4));
}
const Hr = "[data-figure-progress]";
function Y_(e) {
  const t = e.querySelector(Hr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Q_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const f4 = { across: 300, above: 380, below: 60 };
function X_(e) {
  const { across: t, above: n, below: a } = f4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: h4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const h4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), zr = "[data-figure-bar]", Rs = { back: 144, along: 0.4 };
function J_(e) {
  const { element: t, docked: n, edge: a } = Cn(), s = n ? t.querySelector(zr) : null;
  if (!(s != null && s.querySelector(Hr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ..._n({ x: o - Rs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Z_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Rs.along * a.size ? t.x + Rs.along * a.size : e.x, y: e.y, behind: !0 };
}
function eC(e) {
  const t = e.querySelector(zr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ma() {
  const e = Sn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function tC(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ma(), u = n === null ? m4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : _n({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function m4(e, t, n, a, s) {
  const o = go(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + mt.width < s && u.x + a - vt.reach - vt.room >= l);
  return gn(i.length ? i : o, t, n);
}
const p4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function nC(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Br));
  const y = (W) => {
    const N = ct(W, n, Mn[W.posture].travels);
    return { x: N.left, y: N.top };
  }, k = t.ladder ?? e.ladder;
  if (k && !(t.ladder && e.ladder)) return g4(y(e), y(t), y({ ...k.foot, posture: "stand" }), k.way, !!t.ladder, n, s);
  const [T, ...S] = [e, ...u, t].map(y), x = ra(T, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: h, pogo: p }), B = S.slice(1).map((W, N) => {
    var w;
    return (w = ra(S[N], W, n.size, { random: i, memory: c, now: f, room: h })) == null ? void 0 : w.legs.find((z) => z.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...B.filter(Boolean)] };
}
function g4(e, t, n, a, s, o, l) {
  const i = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / p4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ra(e, n, o.size, { pace: l }) : ra(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function aC(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function sC(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && gn(e4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Sa();
  return { ...Wr(go(s, t), t, n), view: null, on: a };
}
const v4 = "[data-figure-bubble]", y4 = 250;
let sn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ur = 0;
const Yt = () => sn, ns = /* @__PURE__ */ new WeakMap();
let b4 = 0;
function vo(e) {
  return ns.has(e) || ns.set(e, `floor-${++b4}`), ns.get(e);
}
const k4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, w4 = () => {
  var e, t;
  return ((t = (e = Sn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function $4(e, t) {
  var a;
  const n = (a = e.querySelector(O$)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function x4(e, t) {
  const n = e && $4(e, t), a = e ? [...e.querySelectorAll(v4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || k4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: vo(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const S4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= y4 ? (t.top - a.top) / s * 1e3 : 0;
};
function Gr(e = sn, t = performance.now()) {
  const n = Ot(), a = w4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Cn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ma();
  return c.element && u.push({ id: vo(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...x4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: S4(e, f, t) }))) });
}
const Ls = /* @__PURE__ */ new Set();
function M4(e) {
  return Ls.add(e), () => Ls.delete(e);
}
function _4() {
  Vr();
  const e = () => {
    Ur = requestAnimationFrame(e), !document.hidden && (sn = Gr(sn), Ls.forEach((t) => t(sn)));
  };
  e();
}
function Vr() {
  cancelAnimationFrame(Ur);
}
const yo = 5, C4 = 56, E4 = { share: 0.6 }, A4 = (e) => -Math.sqrt(2 * ro * E4.share * e), Ht = (e, t) => e.find((n) => n.id === t) ?? null;
function oC(e, t = Gr().floors) {
  const n = Ht(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : vo(e.on) : null, o = s && Ht(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Kr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Yt().floors) {
  const c = Ht(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || O4(c, f, o)) && T4(f, i, u) ? { x: f.x, y: f.y } : null;
}
const bo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, O4 = (e, t, n) => !bo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function lC(e, t = Yt().floors) {
  if (!bo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= yo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function T4(e, t, n = Yt().floors) {
  const a = Ht(n, "home");
  return e.posture === "hang" && a && ct(e, t).bottom >= a.top ? !1 : ho(e, t);
}
function iC(e, t, n, a = Yt().floors) {
  const s = Kr(e, n, a);
  if (!e.home) return I4(e, t, s, a);
  if (!s) return null;
  const o = Ht(a, "home"), l = s.y - t.y, i = l > yo ? "dropping" : -l > C4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function I4(e, t, n, a) {
  const s = n ? Ht(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: A4(e.risen) };
  if (!n) return null;
  if (bo(t) && n.y - t.y > yo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function rC(e, t, n) {
  const a = mo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function uC(e, t, n, a = Yt().floors) {
  const s = t && Kr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const B4 = ["data-type"], R4 = { class: "figure-floor-name" }, L4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", R4, v(e.floor.type), 1)
    ], 12, B4));
  }
}, N4 = /* @__PURE__ */ H(L4, [["__scopeId", "data-v-4e0f1e2e"]]), q4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, D4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Je(Yt().floors);
    let n = () => {
    };
    return _e(() => {
      n = M4((a) => t.value = a.floors), _4();
    }), Be(() => {
      n(), Vr();
    }), (a, s) => (r(), d("div", q4, [
      (r(!0), d(D, null, ne(t.value, (o) => (r(), F(N4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, cC = /* @__PURE__ */ H(D4, [["__scopeId", "data-v-e519168b"]]), on = (e) => typeof e == "number" ? e : Date.parse(e);
function dC(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: on(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => on(s.row.created_at) - on(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Al = 20;
async function fC(e, t, n) {
  for (let a = 0; a < Al; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || on(o.created_at) <= on(s.created_at) || !await n()) return a;
  }
  return Al;
}
const P4 = 3, as = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function j4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = as[n.grouping]) == null ? void 0 : a.call(as, e.row, n)) || "";
}
function F4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function hC(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= P4 ? [F4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = j4(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function W4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const mC = (e) => (t) => t.filter((n) => n.id !== e), pC = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), gC = (e) => (t) => [...t, e], vC = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function yC(e, t = {}) {
  const n = nt(), a = A(null), s = A("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function bC(e) {
  const t = nt(), n = A("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Wn = /* @__PURE__ */ new Map();
function H4(e, t) {
  if (Wn.has(e)) return Wn.get(e);
  const n = t().finally(() => Wn.delete(e));
  return Wn.set(e, n), n;
}
function kC() {
  const e = nt(), t = A(null), n = A("");
  async function a() {
    const s = await H4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const z4 = { class: "cards-page" }, U4 = { class: "cards-bar" }, G4 = { class: "cards-count" }, V4 = { class: "cards" }, K4 = {
  key: 1,
  class: "cards-note"
}, Y4 = {
  key: 2,
  class: "cards-note"
}, Q4 = ["data-row", "onClick"], X4 = { class: "card-head" }, J4 = { class: "card-title" }, Z4 = { class: "card-foot" }, ex = {
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
    return (a, s) => (r(), d("div", z4, [
      m("div", U4, [
        m("span", G4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        O(ge, Pe({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: P(() => [
            O(le, {
              name: "plus",
              size: 12
            }),
            V(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", V4, [
        e.loaded ? e.failure ? (r(), d("p", K4, v(e.failure), 1)) : e.rows.length ? b("", !0) : (r(), d("p", Y4, "No " + v(e.term) + "s yet", 1)) : (r(), F(Ye, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(D, null, ne(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", X4, [
            O(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            V(" " + v(e.head(o)), 1),
            O(et, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", J4, v(e.title(o)), 1),
          m("span", Z4, v(e.foot(o)), 1)
        ], 8, Q4))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, wC = /* @__PURE__ */ H(ex, [["__scopeId", "data-v-b39fea5d"]]), Ol = "newest";
function $C(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(Re, null)) == null ? void 0 : c.search, s = A(""), o = A(Ol), l = A("all"), i = C(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((p) => W4(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Ol ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), u = C(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const tx = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, nx = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, ax = 40, sx = "top", ox = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Me(Re, null)) == null ? void 0 : p.autoScroll, s = C(() => a === sx), o = A(null), l = A(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= ax, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    pe(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return _e(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), tt(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, k) => (r(), d("div", tx, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: K(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ue(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", nx, [
        O(Ut, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: P(() => [
            Ze(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              O(le, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              k[0] || (k[0] = V(" Newest ", -1))
            ], 512), [
              [Wl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, xC = /* @__PURE__ */ H(ox, [["__scopeId", "data-v-d704d7e3"]]), lx = ["aria-selected", "data-tab", "onClick"], ix = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, rx = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Me(Re, null), o = C(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = A(null), i = A({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var k;
      const y = (k = l.value) == null ? void 0 : k.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => je(() => c(!0));
    let h = null;
    return _e(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Be(() => h == null ? void 0 : h.disconnect()), pe(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), pe(() => n.answer, f, { deep: !0 }), (p, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(D, null, ne(o.value, (k) => {
        var T, S;
        return r(), d("button", {
          key: k.key,
          type: "button",
          role: "tab",
          class: K(["inner-tab", { on: ((T = e.active) == null ? void 0 : T.key) === k.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === k.key,
          "data-tab": k.key,
          onClick: (x) => a("choose", k)
        }, [
          V(v(k.label) + " ", 1),
          u(k) ? (r(), d("span", ix, v(e.answer[k.count_field]), 1)) : b("", !0)
        ], 10, lx);
      }), 128)),
      m("i", {
        class: K(["inner-tabs-line", { slides: i.value.slides }]),
        style: ye({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, SC = /* @__PURE__ */ H(rx, [["__scopeId", "data-v-63fcd326"]]), ux = { class: "task-bar" }, cx = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", ux, [
      m("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ye({ width: `${n(e.done)}%` })
      }, null, 4),
      m("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ye({ width: `${n(e.testing)}%` })
      }, null, 4)
    ]));
  }
}, MC = /* @__PURE__ */ H(cx, [["__scopeId", "data-v-a4fc52ae"]]), dx = {
  class: "tab-body",
  "data-tab-body": ""
}, fx = { "data-tab-content": "" }, hx = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = A(!1);
    let a = 0;
    return pe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Ps(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", dx, [
      n.value ? (r(), F(Ye, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : b("", !0),
      Ze(m("div", fx, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Wl, !n.value]
      ])
    ]));
  }
}, _C = /* @__PURE__ */ H(hx, [["__scopeId", "data-v-63876533"]]), mx = {
  class: "search-bar",
  "data-search-bar": ""
}, px = { class: "search-bar-control" }, gx = ["value", "placeholder", "aria-label"], vx = ["aria-expanded"], yx = {
  key: 0,
  "data-menu-count": ""
}, bx = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = iu(), l = ((x = Me(Re, null)) == null ? void 0 : x.search) ?? {}, i = C(() => l.placeholder || a.placeholder), u = l.context ?? [], c = A(null), f = A(null), h = A([]), p = C(() => h.value.length ? h.value[h.value.length - 1].next : u), y = C(() => !!o.menu || u.length > 0), k = (B) => {
      h.value = [], f.value = f.value ? null : B.currentTarget;
    };
    function T(B) {
      if (B.next.length) {
        h.value = [...h.value, B];
        return;
      }
      f.value = null, s("pick", B.click);
    }
    function S() {
      var B;
      s("update:modelValue", ""), (B = c.value) == null || B.focus();
    }
    return t({ focus: () => {
      var B;
      return (B = c.value) == null ? void 0 : B.focus();
    } }), (B, W) => {
      var N;
      return r(), d("div", mx, [
        m("div", px, [
          O(le, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          m("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: W[0] || (W[0] = (w) => s("update:modelValue", w.target.value)),
            onKeydown: _t(S, ["esc"])
          }, null, 40, gx),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            O(le, {
              name: "close",
              size: 12
            })
          ])) : b("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: k
          }, [
            e.menuCount ? (r(), d("span", yx, v(e.menuCount), 1)) : b("", !0),
            O(le, {
              name: "caret",
              size: 12
            })
          ], 8, vx)) : b("", !0)
        ]),
        (N = L(l).button) != null && N.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = (w) => s("pick", L(l).button.click))
        }, v(L(l).button.title), 1)) : b("", !0),
        ue(B.$slots, "default", {}, void 0, !0),
        f.value ? (r(), F(pa, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: W[3] || (W[3] = Se(() => {
          }, ["stop"])),
          onClose: W[4] || (W[4] = (w) => f.value = null)
        }, {
          default: P(() => [
            h.value.length ? (r(), F(ze, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = (w) => h.value = h.value.slice(0, -1))
            }, {
              default: P(() => [
                V("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : b("", !0),
            (r(!0), d(D, null, ne(p.value, (w) => (r(), F(ze, {
              key: w.title,
              description: w.subtext,
              "data-search-entry": w.title,
              onClick: (z) => T(w)
            }, {
              default: P(() => [
                V(v(w.title) + v(w.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? b("", !0) : ue(B.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : b("", !0)
      ]);
    };
  }
}, kx = /* @__PURE__ */ H(bx, [["__scopeId", "data-v-45374bed"]]), wx = {
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
    return (o, l) => (r(), F(kx, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        O(Mt, null, {
          default: P(() => [...l[2] || (l[2] = [
            V("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(D, null, ne(a, (i) => O(ze, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: P(() => [
            V(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(D, { key: 0 }, [
          O(Mt, null, {
            default: P(() => [...l[3] || (l[3] = [
              V("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(D, null, ne(s, (i) => O(ze, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: P(() => [
              V(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : b("", !0)
      ]),
      default: P(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, CC = /* @__PURE__ */ H(wx, [["__scopeId", "data-v-dab0064d"]]);
function EC() {
  const e = A(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const AC = (e) => import(
  /* @vite-ignore */
  e
), $x = 86400, Ns = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function xx(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ns(t) - Ns(e)) / $x);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function OC(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ns(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: xx(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ss = 280, os = 240, ls = 120, Sx = 6, Mx = 14, vn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function _x(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Yr(e, t) {
  const n = Math.max(0, _x(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Cx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Mx}px)` }), e.offsetHeight, e.style.transition = `height ${ss}ms ${vn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Yr(t, e));
    const p = s() - i;
    if (!u && p >= ss && (u = !0, e.style.transition = `opacity ${os}ms ease-out, transform ${os}ms ${vn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < ss + os) return a(h);
    f();
  };
  return a(h), f;
}
function TC(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Sx}px)` }), e.offsetHeight, e.style.transition = `opacity ${ls}ms ease-out, transform ${ls}ms ${vn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Yr(t, e)), s() - l < ls) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const Ex = 140, Hn = 220, Tl = 5;
function IC({ gap: e = Ex, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, h) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), h();
    });
  }
  function u() {
    const f = n.splice(0, Tl);
    if (s = f.length > 0, !s) return;
    let h = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(u, e));
      });
  }
  const c = (f, h, p, y = Cx) => {
    if (l || !h.pane || !h.follows()) return p();
    const k = { el: f, options: h, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(k, () => o = t(u, e));
    f.style.display = "none", n.push(k), n.length >= Tl && c.flush();
  };
  return c.flush = () => {
    var f;
    l = !0, queueMicrotask(() => l = !1);
    for (const h of [...a]) (f = h.cancel) == null || f.call(h);
    clearTimeout(o), s = !1;
    for (const h of n.splice(0))
      h.el.style.display = h.display, h.done();
  }, c;
}
function BC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Hn}ms ${vn}, opacity ${Hn}ms ease-in, margin ${Hn}ms ${vn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Hn);
}
const Qr = "chat.pins.minimised", Yn = A(Zn(Qr, !1));
function Il(e) {
  Yn.value = e, Qs(Qr, e);
}
function Ax(e) {
  const t = C(() => e()), n = C(() => Yn.value ? [] : e()), a = () => Il(!Yn.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && Il(!1)
  ), { pins: t, visible: n, minimised: Yn, toggle: a };
}
const Ox = ["title"], Tx = {
  key: 0,
  class: "pins-count"
}, Ix = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Ax(() => t.pinRows);
    return (o, l) => L(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: K(["pins-toggle", { minimised: L(a), inline: e.inline }]),
      title: L(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = Se((...i) => L(s) && L(s)(...i), ["stop"]))
    }, [
      O(le, {
        name: L(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      L(a) ? (r(), d("span", Tx, v(L(n).length), 1)) : b("", !0)
    ], 10, Ox)) : b("", !0);
  }
}, RC = /* @__PURE__ */ H(Ix, [["__scopeId", "data-v-d073c504"]]), Bx = ["title"], Rx = ["title"], Lx = { class: "diff-card-dir" }, Nx = { class: "diff-card-name" }, qx = ["title"], Dx = ["title"], Px = {
  key: 0,
  class: "diff-card-note"
}, jx = ["href"], Fx = ["src", "alt"], Wx = { class: "diff-card-rows" }, Hx = { class: "diff-row-num" }, zx = { class: "diff-row-sign" }, Ux = { class: "diff-row-code" }, Gx = {
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
    function o(I) {
      (I.metaKey || I.ctrlKey) && (I.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, u = C(() => n.path.lastIndexOf("/") + 1), c = C(() => n.path.slice(0, u.value)), f = C(() => n.path.slice(u.value)), h = C(() => n.change === "deleted"), p = C(() => l[n.change]), y = C(() => new Set(n.rows.filter((I) => I.line_type === "add").map((I) => I.line))), k = A("after"), T = C(() => k.value === "before" ? n.whole.old : n.whole.text), S = C(() => n.whole && n.whole.text !== void 0 ? T.value.split(`
`).map((I, $) => ({ line_type: k.value === "after" && y.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: I })) : n.rows.filter(
      (I) => !(n.editsOnly && ["ctx", "fold"].includes(I.line_type)) && !(n.hideRemovals && I.line_type === "del")
    )), x = A(!1), B = C(() => n.lines && !x.value && !n.whole), W = C(() => B.value ? S.value.slice(0, n.lines) : S.value), N = C(() => S.value.length - W.value.length), w = (I) => I.line === null || I.line_type === "del" ? "" : I.line, z = (I) => I.line_type === "fold" ? I.hidden ? `⋯ ${I.hidden} lines` : "⋯" : I.text, j = A(null), q = A(null);
    let _ = null;
    return _e(() => {
      if (!q.value) return;
      let I = !0;
      _ = new ResizeObserver(() => {
        !j.value || !q.value || (j.value.style.transition = I ? "none" : "", j.value.style.height = `${q.value.offsetHeight}px`, I = !1);
      }), _.observe(q.value);
    }), Be(() => _ && _.disconnect()), (I, $) => (r(), d("section", {
      class: K(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: $[2] || ($[2] = (g) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${L(s)}-click to open it`,
          onClick: o
        }, [
          m("span", Lx, v(c.value), 1),
          m("span", Nx, v(f.value), 1),
          p.value ? (r(), d("span", {
            key: 0,
            class: K(["diff-card-badge", e.change])
          }, v(p.value), 3)) : b("", !0)
        ], 8, Rx),
        m("span", {
          class: K(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: K(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        O(et, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: k.value === "after" ? "Show the file before" : "Show the file after",
          onClick: $[0] || ($[0] = Se((g) => k.value = k.value === "after" ? "before" : "after", ["stop"]))
        }, v(k.value === "after" ? "After" : "Before"), 9, qx)) : b("", !0),
        h.value ? b("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: K(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: $[1] || ($[1] = Se((g) => a("whole"), ["stop"]))
        }, [
          O(le, {
            name: "file",
            size: 12
          })
        ], 10, Dx))
      ], 8, Bx),
      e.whole && e.whole.error ? (r(), d("p", Px, v(e.whole.error), 1)) : b("", !0),
      !h.value && !e.folded ? (r(), d(D, { key: 1 }, [
        e.picture ? (r(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          m("img", {
            src: e.picture,
            alt: f.value,
            loading: "lazy"
          }, null, 8, Fx)
        ], 8, jx)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: j,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            m("div", Wx, [
              (r(!0), d(D, null, ne(W.value, (g, M) => (r(), d("div", {
                key: M,
                class: K(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", Hx, v(w(g)), 1),
                m("span", zx, v(i[g.line_type]), 1),
                m("span", Ux, v(z(g)), 1)
              ], 2))), 128)),
              N.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: $[3] || ($[3] = Se((g) => x.value = !0, ["stop"]))
              }, v(N.value) + " more " + v(N.value === 1 ? "line" : "lines"), 1)) : b("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : b("", !0)
    ], 2));
  }
}, LC = /* @__PURE__ */ H(Gx, [["__scopeId", "data-v-23581cbb"]]), Vx = { "data-queue-controls": "" }, Kx = { class: "counts" }, Yx = { "data-queue-spots": "" }, Qx = {
  class: "spots",
  "aria-label": "Places in use"
}, Xx = { "data-queue-waiting": "" }, Jx = { key: 0 }, Zx = { class: "control" }, e8 = { class: "stepper" }, t8 = ["disabled"], n8 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, a8 = ["disabled"], s8 = ["for"], o8 = ["id", "value", "disabled", "onChange"], l8 = { class: "control" }, i8 = ["aria-checked", "disabled"], r8 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, u8 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, c8 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, d8 = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = A("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", Vx, [
      O(Wt, { icon: "gauge" }, {
        default: P(() => [...u[3] || (u[3] = [
          V("Now", -1)
        ])]),
        _: 1
      }),
      m("div", Kx, [
        m("div", null, [
          m("strong", Yx, [
            V(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", Qx, [
            (r(!0), d(D, null, ne(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: K({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", Xx, v(e.queue.waiting_count), 1),
          u[4] || (u[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", Jx, "The oldest goes first.")) : b("", !0)
        ])
      ]),
      m("div", Zx, [
        u[5] || (u[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", e8, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, t8),
          m("output", n8, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, a8)
        ])
      ]),
      (r(!0), d(D, null, ne(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, s8),
          m("p", null, v(c.description), 1)
        ]),
        m("input", {
          id: c.key,
          class: "limit",
          type: "number",
          min: "0",
          value: c.value,
          disabled: s.value,
          "data-queue-suite-limit": "",
          onChange: (f) => l(c.key, f.target.value)
        }, null, 40, o8)
      ]))), 128)),
      m("div", l8, [
        u[7] || (u[7] = m("div", null, [
          m("label", { id: "main-spots-label" }, "Count the main agent"),
          m("p", null, "Its commands always start right away, but each one takes a place, so fewer workers run at once.")
        ], -1)),
        m("button", {
          type: "button",
          role: "switch",
          "aria-labelledby": "main-spots-label",
          "aria-checked": e.queue.count_main_runs,
          disabled: s.value,
          "data-queue-main-spots": "",
          onClick: u[2] || (u[2] = (c) => l(e.queue.main_spots_setting, e.queue.count_main_runs ? "off" : "on"))
        }, [...u[6] || (u[6] = [
          m("span", null, null, -1)
        ])], 8, i8)
      ]),
      e.queue.halt_cause === "update" ? (r(), d("p", r8, [
        O(le, {
          name: "pause",
          size: 13
        }),
        u[8] || (u[8] = V("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", u8, [
        O(le, {
          name: "pause",
          size: 13
        }),
        V("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : b("", !0),
      o.value ? (r(), d("p", c8, v(o.value), 1)) : b("", !0)
    ]));
  }
}, f8 = /* @__PURE__ */ H(d8, [["__scopeId", "data-v-975b4b89"]]), h8 = ["data-queue-row", "data-queue-process"], m8 = ["aria-expanded"], p8 = { class: "run-line" }, g8 = { class: "leading" }, v8 = {
  key: 0,
  "data-queue-position": ""
}, y8 = ["title"], b8 = { class: "command" }, k8 = {
  class: "time",
  "data-queue-time": ""
}, w8 = { class: "details" }, $8 = { "data-queue-type": "" }, x8 = { class: "failed" }, S8 = { class: "drop-inner" }, M8 = { class: "output" }, _8 = { class: "output-heading" }, C8 = ["href"], E8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(), o = ir((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = oo(), u = C(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = C(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, k = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return k < 60 ? `${k} s` : k < 3600 ? `${Math.floor(k / 60)} m ${k % 60} s` : `${Math.floor(k / 3600)} h ${String(Math.floor(k / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await je(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await je(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return pe(() => n.expanded, h, { immediate: !0 }), $n(["output.*"], f, (p) => Wi(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      m("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: y[2] || (y[2] = (k) => a("toggle")),
        onKeydown: [
          y[3] || (y[3] = _t(Se((k) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = _t(Se((k) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", p8, [
          m("span", g8, [
            e.run.section === "waiting" ? (r(), d("span", v8, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: K(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, y8))
          ]),
          m("code", b8, v(e.run.line), 1),
          m("span", k8, v(c.value), 1),
          O(le, {
            class: K(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", w8, [
          m("span", $8, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(D, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = Se((k) => L(yt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(D, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : b("", !0),
          e.run.task_id ? (r(), d(D, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = Se((k) => L(yt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : b("", !0),
          e.run.state === "failed" ? (r(), d(D, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", x8, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : b("", !0)
        ])
      ], 40, m8),
      m("div", {
        class: K(["drop", { open: e.expanded }])
      }, [
        m("div", S8, [
          m("div", M8, [
            m("div", _8, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, C8)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (k) => e.expanded && L(o).loadEarlier(k.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              V(v(e.run.line), 1),
              L(l).length ? (r(), d(D, { key: 0 }, [
                V(v(`
` + L(l).join(`
`)), 1)
              ], 64)) : b("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, h8));
  }
}, A8 = /* @__PURE__ */ H(E8, [["__scopeId", "data-v-18099d0b"]]), O8 = {
  class: "process-queue",
  "data-test-queue": ""
}, T8 = { class: "scroll" }, I8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, B8 = ["data-queue-empty"], is = 20, R8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = A(""), s = A([]), o = A(is), l = C(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const u = C(() => n.value ? [
      { type: "running", heading: "Running", icon: "start", rows: n.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: n.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: n.value.recent, empty: "Nothing has run yet." }
    ].flatMap((y) => [
      { key: `band:${y.type}`, section: y },
      ...y.rows.length ? y.rows.map((k, T) => ({ key: `run:${k.id}`, run: k, position: T + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
    ]) : []);
    function c(p) {
      s.value = s.value.includes(p) ? s.value.filter((y) => y !== p) : [...s.value, p];
    }
    async function f() {
      const p = ++i, y = await t.read(o.value === is ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === i && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += is, f();
    }
    return $n(["process.*", "setting.*"], f), _e(f), (p, y) => (r(), d("article", O8, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", T8, [
        a.value ? (r(), d("p", I8, v(a.value), 1)) : b("", !0),
        n.value ? (r(), d(D, { key: 1 }, [
          O(f8, {
            queue: n.value,
            read: e.read,
            onSaved: f
          }, null, 8, ["queue", "read"]),
          O(Ds, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: P(() => [
              (r(!0), d(D, null, ne(u.value, (k) => (r(), d(D, {
                key: k.key
              }, [
                k.run ? (r(), F(A8, {
                  key: 0,
                  run: k.run,
                  environment: n.value.environment_name,
                  position: k.position,
                  read: e.read,
                  expanded: s.value.includes(k.run.id),
                  onToggle: (T) => c(k.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : k.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": k.section.type
                }, v(k.section.empty), 9, B8)) : (r(), F(Wt, {
                  key: 2,
                  icon: k.section.icon,
                  count: k.section.rows.length,
                  "data-queue-heading": k.section.type
                }, {
                  default: P(() => [
                    V(v(k.section.heading), 1)
                  ]),
                  _: 2
                }, 1032, ["icon", "count", "data-queue-heading"]))
              ], 64))), 128))
            ]),
            _: 1
          }),
          l.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "older",
            "data-queue-older": "",
            onClick: h
          }, "Show older commands")) : b("", !0)
        ], 64)) : a.value ? b("", !0) : (r(), F(Ye, { key: 2 }))
      ])
    ]));
  }
}, NC = /* @__PURE__ */ H(R8, [["__scopeId", "data-v-d9b6ef6b"]]), L8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, N8 = ["aria-expanded"], q8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, D8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, P8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, j8 = {
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
    const t = e, n = A(t.open), a = A(0), s = A(0), o = A("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return pe(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), $n(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(D, null, [
      a.value ? (r(), d("section", L8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", q8, v(a.value), 1),
          O(Kt, { open: n.value }, null, 8, ["open"])
        ], 8, N8),
        m("div", {
          class: K(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", D8, [
            O(Zc, {
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
          ])) : b("", !0)
        ], 2)
      ])) : b("", !0),
      o.value ? (r(), d("p", P8, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, F8 = /* @__PURE__ */ H(j8, [["__scopeId", "data-v-a4550728"]]), W8 = ["placeholder"], H8 = { class: "actions" }, z8 = { class: "error" }, U8 = {
  key: 1,
  class: "card closed"
}, G8 = { class: "mark" }, V8 = { class: "prompt" }, K8 = {
  key: 0,
  class: "draft"
}, Y8 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ jt({
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
  emits: /* @__PURE__ */ jt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = ln(e, "draft"), l = ln(e, "error"), i = A(!!l.value), u = A(!1), c = A(!1), f = A(null);
    async function h() {
      var k, T;
      i.value = !0, u.value = !1, await je(), (T = ((k = f.value) == null ? void 0 : k.querySelector("input")) || f.value) == null || T.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const k = o.value.trim();
      if (!(!k || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(k), i.value = !1, u.value = !0;
        } catch (T) {
          o.value = k, l.value = T.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (k, T) => (r(), d("div", {
      class: K(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: Se(y, ["prevent"]),
        onKeydown: _t(p, ["esc"])
      }, [
        ue(k.$slots, "who", {}, void 0, !0),
        Ze(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": T[0] || (T[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: T[1] || (T[1] = _t((S) => L(Gi)(S, y), ["enter"]))
        }, null, 40, W8), [
          [Xn, o.value]
        ]),
        m("div", H8, [
          m("span", z8, v(l.value), 1),
          O(ge, {
            small: "",
            onClick: p
          }, {
            default: P(() => [...T[3] || (T[3] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          O(ge, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: P(() => [...T[4] || (T[4] = [
              V("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", U8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", G8, [
            O(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", V8, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", K8, "Draft kept")) : b("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: T[2] || (T[2] = (S) => s("show"))
        }, [
          m("span", null, v(L(td)(e.count, "comment")), 1),
          O(le, {
            name: "down",
            size: 12
          })
        ])) : b("", !0)
      ]))
    ], 2));
  }
}, Q8 = /* @__PURE__ */ H(Y8, [["__scopeId", "data-v-b68baddd"]]), X8 = { wide: 1130 }, J8 = /\{([A-Za-z_]\w*)\}/g;
function Qn(e, t, n = {}) {
  return e.replace(J8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const Z8 = (e, t, n, a) => Qn(e.label, n, { row_id: a, id: a }) || A2(t, n, a), e3 = { class: "comment-side-head" }, t3 = {
  key: 0,
  class: "comment-none"
}, n3 = { key: 0 }, a3 = {
  key: 1,
  class: "comment-none"
}, s3 = {
  class: "comment",
  "data-comment": ""
}, o3 = {
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
      class: K(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", e3, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        O(ga, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", t3, "No comments yet")) : b("", !0),
      (r(!0), d(D, null, ne(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", n3, v(a.quote), 1)) : b("", !0),
        a.revision ? (r(), d("span", a3, "Revision " + v(a.revision), 1)) : b("", !0),
        m("p", s3, v(e.words(a)), 1)
      ]))), 128)),
      O(yn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Bl = /* @__PURE__ */ H(o3, [["__scopeId", "data-v-276284a3"]]), l3 = { class: "resource-heading" }, i3 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, r3 = {
  key: 1,
  class: "resource-abstract"
}, u3 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", l3, [
      e.title ? (r(), d("h2", i3, v(e.title), 1)) : b("", !0),
      e.abstract ? (r(), d("p", r3, v(e.abstract), 1)) : b("", !0)
    ]));
  }
}, c3 = /* @__PURE__ */ H(u3, [["__scopeId", "data-v-d65ef53f"]]), d3 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, f3 = { class: "inspector-icons" }, h3 = { class: "inspector-icons-start" }, m3 = {
  class: "inspector-label",
  "data-resource-type": ""
}, p3 = { class: "inspector-icons-end" }, g3 = ["href"], v3 = {
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
    const n = e, a = t, s = C(() => `${n.opened.table}:${n.opened.id}`), o = C(() => n.shareable && !n.readOnly), l = C(() => n.backed ? "Close all rows" : "Close");
    return (i, u) => (r(), d("header", d3, [
      m("div", f3, [
        m("span", h3, [
          e.backed ? (r(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: u[0] || (u[0] = (c) => a("back"))
          }, {
            default: P(() => [
              O(le, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          e.stepped ? (r(), d(D, { key: 1 }, [
            O(ge, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: u[1] || (u[1] = (c) => a("step", -1))
            }, {
              default: P(() => [
                O(le, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            O(ge, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: u[2] || (u[2] = (c) => a("step", 1))
            }, {
              default: P(() => [
                O(le, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : b("", !0)
        ]),
        m("p", m3, v(e.label), 1),
        m("span", p3, [
          e.embedded ? (r(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: u[3] || (u[3] = (c) => L(De)(s.value))
          }, {
            default: P(() => [
              O(le, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          o.value ? (r(), d("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this link",
            "aria-label": "Share this link",
            "data-resource-share": "",
            href: L(Wf)(s.value)
          }, [
            O(le, {
              name: "share",
              size: 13
            })
          ], 8, g3)) : b("", !0),
          e.embedded ? b("", !0) : (r(), F(ge, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: u[4] || (u[4] = (c) => a("close"))
          }, {
            default: P(() => [
              O(le, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      O(c3, {
        title: e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, y3 = /* @__PURE__ */ H(v3, [["__scopeId", "data-v-414d2086"]]), b3 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, k3 = { class: "field-name" }, w3 = {
  key: 1,
  class: "field-value"
}, $3 = ["onClick"], x3 = {
  key: 2,
  class: "field-value"
}, S3 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", b3, [
      (r(!0), d(D, null, ne(e.fields, (o) => (r(), d(D, {
        key: o.name
      }, [
        m("p", k3, v(o.label), 1),
        o.isTime ? (r(), F(et, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", w3, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, $3)
        ])) : (r(), d("p", x3, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, M3 = /* @__PURE__ */ H(S3, [["__scopeId", "data-v-7e45afb5"]]);
async function _3(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: O2(s.value.actor, s.value.creator_agent), owner: a.length ? T2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const C3 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, E3 = {
  key: 1,
  class: "inspector-wait"
}, A3 = { class: "inspector-main" }, O3 = { class: "inspector-column" }, T3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, I3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, B3 = { class: "inspector-text" }, R3 = ["innerHTML"], L3 = {
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
    const n = e, a = t, s = /* @__PURE__ */ new Set(["question", "memory", "rule"]), o = C(() => n.catalogue.inspector(n.term) ?? {
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
    }), l = A(null), i = A(""), u = A(""), c = A(""), f = A("details"), h = A(null), p = A(0);
    let y = 0;
    const k = C(() => ({ row_id: n.id, id: n.id })), T = C(() => l.value ? Qn(o.value.title, l.value, k.value) || E2(n.term, l.value, n.id) : ""), S = C(() => l.value ? Z8(o.value, n.term, l.value, n.id) : ""), x = C(() => S.value === T.value ? "" : S.value), B = C(() => l.value ? Qn(o.value.description, l.value, k.value) : ""), W = C(() => {
      var E, R, U;
      return ((E = l.value) == null ? void 0 : E.body) || ((R = l.value) == null ? void 0 : R.brief) || (s.has(n.term) ? (U = l.value) == null ? void 0 : U.text : "") || "";
    }), N = C(() => W.value ? Js(W.value, { env: "", rowNames: !1 }) : ""), w = C(() => I2(l.value, W.value, i.value, u.value)), z = C(() => o.value.comments && p.value >= X8.wide), j = C(() => o.value.comments && !z.value), q = (E) => o.value.components.filter((R) => (R.tab || "") === E).map((R) => R.window), _ = C(() => [...new Set(o.value.components.map((E) => E.tab).filter(Boolean))]), I = C(() => _.value.length || j.value ? [{ key: "details", label: "Details" }, ..._.value.map((E) => ({ key: E, label: E })), ...j.value ? [{ key: "comments", label: "Comments" }] : []] : []), $ = Xi(() => o.value.comments && l.value ? { term: n.term, id: n.id, title: l.value.title } : {}, (E) => n.read(E));
    async function g() {
      const E = ++y, R = await n.read(Qn(o.value.reads, null, k.value).split(/\s+/).filter(Boolean));
      if (E !== y || (c.value = R.ok ? "" : R.error, !R.ok)) return;
      l.value = R.value;
      const U = await _3(n.read, l.value);
      E === y && (i.value = U.creator, u.value = U.owner);
    }
    pe(() => `${n.term}:${n.id}`, () => {
      l.value = null, i.value = "", u.value = "", c.value = "", f.value = "details", g();
    }, { immediate: !0 }), $n(o.value.events, g), pe($.open, (E) => E && j.value && (f.value = "comments"));
    let M = null;
    return _e(() => {
      var E;
      p.value = ((E = h.value) == null ? void 0 : E.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (M = new ResizeObserver(() => p.value = h.value.clientWidth), M.observe(h.value));
    }), Be(() => M == null ? void 0 : M.disconnect()), (E, R) => (r(), d("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      O(y3, {
        label: x.value,
        title: T.value,
        description: B.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: R[0] || (R[0] = (U) => a("close")),
        onBack: R[1] || (R[1] = (U) => a("back")),
        onStep: R[2] || (R[2] = (U) => a("step", U))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (r(), d("p", C3, v(c.value), 1)) : l.value ? (r(), d(D, { key: 2 }, [
        O(_s, null, {
          default: P(() => [
            O(Ys, {
              name: `row.${e.term}`,
              row: { ...l.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: g
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", A3, [
          m("div", O3, [
            I.value.length ? (r(), d("div", T3, [
              O(Ft, {
                options: I.value,
                value: f.value,
                onPick: R[3] || (R[3] = (U) => f.value = U)
              }, null, 8, ["options", "value"])
            ])) : b("", !0),
            m("div", I3, [
              O(Gt, { value: f.value }, {
                details: P(() => [
                  m("div", B3, [
                    N.value && !o.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, R3)) : b("", !0),
                    o.value.lists_fields ? (r(), F(M3, {
                      key: 1,
                      fields: w.value,
                      onPeek: R[4] || (R[4] = (U) => a("open", U))
                    }, null, 8, ["fields"])) : b("", !0)
                  ]),
                  O(Ss, {
                    "slot-name": `inspector.${e.term}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: P(() => [
                  O(Bl, {
                    below: "",
                    comments: L($).comments.value,
                    words: L($).words,
                    more: !!L($).nextPage.value,
                    loading: L($).loading.value,
                    failure: L($).failure.value,
                    onMore: L($).loadMore,
                    onClose: R[5] || (R[5] = (U) => f.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: P(() => [
                  O(Ss, {
                    names: q(f.value),
                    row: { ...l.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (r(), F(F8, {
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read,
                categories: o.value.links.categories,
                open: o.value.links.open,
                "outside-plan": o.value.links.excludes_plan,
                "page-size": o.value.links.page_size,
                onOpen: R[6] || (R[6] = (U) => a("open", U))
              }, null, 8, ["model", "id", "read", "categories", "open", "outside-plan", "page-size"])) : b("", !0)
            ]),
            o.value.comments ? (r(), F(Q8, {
              key: 1,
              send: L($).send,
              count: L($).total.value,
              onShow: R[7] || (R[7] = (U) => j.value && (f.value = "comments"))
            }, null, 8, ["send", "count"])) : b("", !0)
          ]),
          z.value ? (r(), F(Bl, {
            key: 0,
            comments: L($).comments.value,
            words: L($).words,
            more: !!L($).nextPage.value,
            loading: L($).loading.value,
            failure: L($).failure.value,
            onMore: L($).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : b("", !0)
        ])
      ], 64)) : (r(), d("div", E3, [
        O(Ye)
      ]))
    ], 512));
  }
}, N3 = /* @__PURE__ */ H(L3, [["__scopeId", "data-v-4e283d29"]]), qC = {
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
    const t = Me(Gs);
    return (n, a) => (r(), F(N3, Pe(n.$props, {
      catalogue: L(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, q3 = { class: "facts" }, D3 = { class: "fact wide" }, P3 = ["title"], j3 = {
  key: 1,
  class: "fact-value"
}, F3 = {
  key: 0,
  class: "fact"
}, W3 = { class: "fact-value" }, H3 = { class: "fact" }, z3 = { class: "fact-label" }, U3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, G3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, V3 = {
  key: 2,
  class: "fact"
}, K3 = { class: "fact-value" }, Y3 = { class: "fact wide" }, Q3 = { class: "fact-label" }, X3 = { class: "fact wide" }, J3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Z3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = sa.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", q3, [
        m("div", D3, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => L(De)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, P3)) : (r(), d("span", j3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", F3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", W3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : b("", !0),
        e.task.helper_id ? (r(), d(D, { key: 1 }, [
          m("div", H3, [
            m("span", z3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            O(ba, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: L(to)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => L(De)(`agents:${e.task.helper_id}`))
            }, {
              default: P(() => [
                O(Dt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          L(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", U3, [
            O(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = V(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", G3, [
            O(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = V(" takes it after the task it is on.", -1))
          ])) : b("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", V3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", K3, "Agent " + v(e.task.holder_id), 1)
        ])) : b("", !0),
        m("div", Y3, [
          m("span", Q3, [
            i[9] || (i[9] = V(" Complexity ", -1)),
            O(fi, {
              lines: L(sr).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          O(Ft, {
            options: L(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", X3, [
          i[10] || (i[10] = m("span", { class: "fact-label" }, "Priority", -1)),
          O(Ft, {
            options: L(n),
            value: String(L(ar)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", J3, v(e.refusal), 1)) : b("", !0)
        ])
      ]);
    };
  }
}, eS = /* @__PURE__ */ H(Z3, [["__scopeId", "data-v-4bf27961"]]);
function tS(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const nS = { class: "number" }, aS = { class: "title" }, sS = { class: "word" }, oS = {
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
    return (a, s) => (r(), F(Ve(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: K(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: P(() => [
        O(ka, { status: e.status }, null, 8, ["status"]),
        m("span", nS, v(e.number), 1),
        m("span", aS, v(e.title), 1),
        m("span", sS, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, rs = /* @__PURE__ */ H(oS, [["__scopeId", "data-v-f6417ae8"]]), lS = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, iS = { class: "level" }, rS = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = C(() => tS(n.task.id, n.graph)), l = C(() => s.value ? o.value.above : o.value.above.slice(-1)), i = C(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = C(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, p = !1) => ({ status: dn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (r(), d("section", lS, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (r(!0), d(D, null, ne(l.value, (y) => (r(), d(D, {
        key: y.map((k) => k.id).join()
      }, [
        m("div", iS, [
          (r(!0), d(D, null, ne(y, (k) => (r(), F(rs, Pe({
            key: k.id,
            ref_for: !0
          }, f(k), {
            onSelect: p[0] || (p[0] = (T) => a("select", T))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      O(rs, cs(Fl(f(e.task, !0))), null, 16),
      (r(!0), d(D, null, ne(i.value, (y) => (r(), d(D, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        O(rs, Pe({ ref_for: !0 }, f(y), {
          onSelect: p[1] || (p[1] = (k) => a("select", k))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : b("", !0)
    ])) : b("", !0);
  }
}, uS = /* @__PURE__ */ H(rS, [["__scopeId", "data-v-79c52417"]]), cS = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, dS = ["datetime"], fS = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", cS, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (r(!0), d(D, null, ne(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, dS),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : b("", !0);
  }
}, hS = /* @__PURE__ */ H(fS, [["__scopeId", "data-v-b41f213b"]]), mS = {
  class: "part",
  "data-resource-waits": ""
}, pS = ["onClick"], gS = { class: "wait-id" }, vS = { class: "wait-title" }, yS = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", mS, [
      m("h4", null, v(e.title), 1),
      (r(!0), d(D, null, ne(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        O(ka, {
          status: L(dn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", gS, v(o.id), 1),
        m("span", vS, v(o.title), 1)
      ], 8, pS))), 128))
    ]));
  }
}, Rl = /* @__PURE__ */ H(yS, [["__scopeId", "data-v-8fb2e251"]]), bS = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, kS = { class: "text" }, wS = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, $S = 180, xS = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = A(!1), l = C(() => a.task.waits.filter((u) => !n.has(u.state))), i = C(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(D, null, [
      l.value.length ? (r(), F(Rl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : b("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", bS, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", kS, v(e.task.outcome), 1)
      ])) : b("", !0),
      e.task.brief ? (r(), d("section", wS, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: K(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > $S && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : b("", !0)
      ])) : b("", !0),
      i.value.length ? (r(), F(Rl, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : b("", !0)
    ], 64));
  }
}, SS = /* @__PURE__ */ H(xS, [["__scopeId", "data-v-4a3f1e79"]]), MS = {
  class: "task-details",
  "data-task-details": ""
}, _S = { class: "since" }, CS = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, ES = { class: "text" }, AS = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, OS = {
  key: 1,
  class: "note"
}, TS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, IS = { class: "text" }, BS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", MS, [
        m("div", {
          class: K(["state-line", L(dn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            O(ka, {
              status: L(dn)(e.task.state)
            }, null, 8, ["status"]),
            V(" " + v(a(e.task.state)), 1)
          ]),
          m("span", _S, [
            o[5] || (o[5] = V(" since ", -1)),
            O(et, {
              at: L(bh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", CS, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", ES, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", AS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", OS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", TS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", IS, v(e.task.reason), 1)
        ])) : b("", !0),
        e.graph ? (r(), F(uS, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : b("", !0),
        O(eS, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        O(SS, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        O(hS, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, DC = /* @__PURE__ */ H(BS, [["__scopeId", "data-v-7e73fa21"]]), RS = 50, LS = { messages: 25 }, NS = (e) => LS[e] || RS, qS = {
  class: "task-log",
  "aria-label": "Task log"
}, DS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, PS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, jS = { class: "entries" }, FS = ["data-task-log-important"], WS = ["datetime"], HS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, zS = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = A([]), a = A(1), s = A(!0), o = A(!0), l = A("");
    let i = 0;
    async function u(c = 1) {
      const f = ++i;
      a.value = c, o.value = !0, l.value = "";
      const h = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(NS("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), tt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", qS, [
      o.value ? (r(), F(Ye, { key: 0 })) : l.value ? (r(), d(D, { key: 1 }, [
        m("p", DS, v(l.value), 1),
        O(ge, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => u(a.value))
        }, {
          default: P(() => [...f[3] || (f[3] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(D, { key: 2 }, [
        n.value.length ? b("", !0) : (r(), d("p", PS, "No log entries yet.")),
        m("ol", jS, [
          (r(!0), d(D, null, ne(n.value, (h) => (r(), d("li", {
            key: h.id,
            class: K(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, WS),
            m("p", null, v(h.line), 1)
          ], 10, FS))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", HS, [
          O(ge, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => u(a.value - 1))
          }, {
            default: P(() => [...f[4] || (f[4] = [
              V("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          O(ge, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => u(a.value + 1))
          }, {
            default: P(() => [...f[5] || (f[5] = [
              V("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : b("", !0)
      ], 64))
    ]));
  }
}, PC = /* @__PURE__ */ H(zS, [["__scopeId", "data-v-cfa43bf1"]]);
function US(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var us = { exports: {} }, Ll;
function GS() {
  return Ll || (Ll = 1, (function(e, t) {
    var n = (function() {
      var a = function(w, z) {
        var j = 236, q = 17, _ = w, I = o[z], $ = null, g = 0, M = null, E = [], R = {}, U = function(Y, Q) {
          g = _ * 4 + 17, $ = (function(G) {
            for (var X = new Array(G), J = 0; J < G; J += 1) {
              X[J] = new Array(G);
              for (var ae = 0; ae < G; ae += 1)
                X[J][ae] = null;
            }
            return X;
          })(g), ee(0, 0), ee(g - 7, 0), ee(0, g - 7), ve(), me(), ie(Y, Q), _ >= 7 && be(Y), M == null && (M = oe(_, I, E)), te(M, Q);
        }, ee = function(Y, Q) {
          for (var G = -1; G <= 7; G += 1)
            if (!(Y + G <= -1 || g <= Y + G))
              for (var X = -1; X <= 7; X += 1)
                Q + X <= -1 || g <= Q + X || (0 <= G && G <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= X && X <= 4 ? $[Y + G][Q + X] = !0 : $[Y + G][Q + X] = !1);
        }, Z = function() {
          for (var Y = 0, Q = 0, G = 0; G < 8; G += 1) {
            U(!0, G);
            var X = i.getLostPoint(R);
            (G == 0 || Y > X) && (Y = X, Q = G);
          }
          return Q;
        }, me = function() {
          for (var Y = 8; Y < g - 8; Y += 1)
            $[Y][6] == null && ($[Y][6] = Y % 2 == 0);
          for (var Q = 8; Q < g - 8; Q += 1)
            $[6][Q] == null && ($[6][Q] = Q % 2 == 0);
        }, ve = function() {
          for (var Y = i.getPatternPosition(_), Q = 0; Q < Y.length; Q += 1)
            for (var G = 0; G < Y.length; G += 1) {
              var X = Y[Q], J = Y[G];
              if ($[X][J] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? $[X + ae][J + de] = !0 : $[X + ae][J + de] = !1;
            }
        }, be = function(Y) {
          for (var Q = i.getBCHTypeNumber(_), G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[Math.floor(G / 3)][G % 3 + g - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[G % 3 + g - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, ie = function(Y, Q) {
          for (var G = I << 3 | Q, X = i.getBCHTypeInfo(G), J = 0; J < 15; J += 1) {
            var ae = !Y && (X >> J & 1) == 1;
            J < 6 ? $[J][8] = ae : J < 8 ? $[J + 1][8] = ae : $[g - 15 + J][8] = ae;
          }
          for (var J = 0; J < 15; J += 1) {
            var ae = !Y && (X >> J & 1) == 1;
            J < 8 ? $[8][g - J - 1] = ae : J < 9 ? $[8][15 - J - 1 + 1] = ae : $[8][15 - J - 1] = ae;
          }
          $[g - 8][8] = !Y;
        }, te = function(Y, Q) {
          for (var G = -1, X = g - 1, J = 7, ae = 0, de = i.getMaskFunction(Q), ce = g - 1; ce > 0; ce -= 2)
            for (ce == 6 && (ce -= 1); ; ) {
              for (var xe = 0; xe < 2; xe += 1)
                if ($[X][ce - xe] == null) {
                  var Ae = !1;
                  ae < Y.length && (Ae = (Y[ae] >>> J & 1) == 1);
                  var he = de(X, ce - xe);
                  he && (Ae = !Ae), $[X][ce - xe] = Ae, J -= 1, J == -1 && (ae += 1, J = 7);
                }
              if (X += G, X < 0 || g <= X) {
                X -= G, G = -G;
                break;
              }
            }
        }, se = function(Y, Q) {
          for (var G = 0, X = 0, J = 0, ae = new Array(Q.length), de = new Array(Q.length), ce = 0; ce < Q.length; ce += 1) {
            var xe = Q[ce].dataCount, Ae = Q[ce].totalCount - xe;
            X = Math.max(X, xe), J = Math.max(J, Ae), ae[ce] = new Array(xe);
            for (var he = 0; he < ae[ce].length; he += 1)
              ae[ce][he] = 255 & Y.getBuffer()[he + G];
            G += xe;
            var Fe = i.getErrorCorrectPolynomial(Ae), We = c(ae[ce], Fe.getLength() - 1), ko = We.mod(Fe);
            de[ce] = new Array(Fe.getLength() - 1);
            for (var he = 0; he < de[ce].length; he += 1) {
              var wo = he + ko.getLength() - de[ce].length;
              de[ce][he] = wo >= 0 ? ko.getAt(wo) : 0;
            }
          }
          for (var $o = 0, he = 0; he < Q.length; he += 1)
            $o += Q[he].totalCount;
          for (var _a = new Array($o), En = 0, he = 0; he < X; he += 1)
            for (var ce = 0; ce < Q.length; ce += 1)
              he < ae[ce].length && (_a[En] = ae[ce][he], En += 1);
          for (var he = 0; he < J; he += 1)
            for (var ce = 0; ce < Q.length; ce += 1)
              he < de[ce].length && (_a[En] = de[ce][he], En += 1);
          return _a;
        }, oe = function(Y, Q, G) {
          for (var X = f.getRSBlocks(Y, Q), J = h(), ae = 0; ae < G.length; ae += 1) {
            var de = G[ae];
            J.put(de.getMode(), 4), J.put(de.getLength(), i.getLengthInBits(de.getMode(), Y)), de.write(J);
          }
          for (var ce = 0, ae = 0; ae < X.length; ae += 1)
            ce += X[ae].dataCount;
          if (J.getLengthInBits() > ce * 8)
            throw "code length overflow. (" + J.getLengthInBits() + ">" + ce * 8 + ")";
          for (J.getLengthInBits() + 4 <= ce * 8 && J.put(0, 4); J.getLengthInBits() % 8 != 0; )
            J.putBit(!1);
          for (; !(J.getLengthInBits() >= ce * 8 || (J.put(j, 8), J.getLengthInBits() >= ce * 8)); )
            J.put(q, 8);
          return se(J, X);
        };
        R.addData = function(Y, Q) {
          Q = Q || "Byte";
          var G = null;
          switch (Q) {
            case "Numeric":
              G = p(Y);
              break;
            case "Alphanumeric":
              G = y(Y);
              break;
            case "Byte":
              G = k(Y);
              break;
            case "Kanji":
              G = T(Y);
              break;
            default:
              throw "mode:" + Q;
          }
          E.push(G), M = null;
        }, R.isDark = function(Y, Q) {
          if (Y < 0 || g <= Y || Q < 0 || g <= Q)
            throw Y + "," + Q;
          return $[Y][Q];
        }, R.getModuleCount = function() {
          return g;
        }, R.make = function() {
          if (_ < 1) {
            for (var Y = 1; Y < 40; Y++) {
              for (var Q = f.getRSBlocks(Y, I), G = h(), X = 0; X < E.length; X++) {
                var J = E[X];
                G.put(J.getMode(), 4), G.put(J.getLength(), i.getLengthInBits(J.getMode(), Y)), J.write(G);
              }
              for (var ae = 0, X = 0; X < Q.length; X++)
                ae += Q[X].dataCount;
              if (G.getLengthInBits() <= ae * 8)
                break;
            }
            _ = Y;
          }
          U(!1, Z());
        }, R.createTableTag = function(Y, Q) {
          Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q;
          var G = "";
          G += '<table style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: " + Q + "px;", G += '">', G += "<tbody>";
          for (var X = 0; X < R.getModuleCount(); X += 1) {
            G += "<tr>";
            for (var J = 0; J < R.getModuleCount(); J += 1)
              G += '<td style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: 0px;", G += " width: " + Y + "px;", G += " height: " + Y + "px;", G += " background-color: ", G += R.isDark(X, J) ? "#000000" : "#ffffff", G += ";", G += '"/>';
            G += "</tr>";
          }
          return G += "</tbody>", G += "</table>", G;
        }, R.createSvgTag = function(Y, Q, G, X) {
          var J = {};
          typeof arguments[0] == "object" && (J = arguments[0], Y = J.cellSize, Q = J.margin, G = J.alt, X = J.title), Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-description" : null, X = typeof X == "string" ? { text: X } : X || {}, X.text = X.text || null, X.id = X.text ? X.id || "qrcode-title" : null;
          var ae = R.getModuleCount() * Y + Q * 2, de, ce, xe, Ae, he = "", Fe;
          for (Fe = "l" + Y + ",0 0," + Y + " -" + Y + ",0 0,-" + Y + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += J.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', he += ' viewBox="0 0 ' + ae + " " + ae + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += X.text || G.text ? ' role="img" aria-labelledby="' + at([X.id, G.id].join(" ").trim()) + '"' : "", he += ">", he += X.text ? '<title id="' + at(X.id) + '">' + at(X.text) + "</title>" : "", he += G.text ? '<description id="' + at(G.id) + '">' + at(G.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', xe = 0; xe < R.getModuleCount(); xe += 1)
            for (Ae = xe * Y + Q, de = 0; de < R.getModuleCount(); de += 1)
              R.isDark(xe, de) && (ce = de * Y + Q, he += "M" + ce + "," + Ae + Fe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, R.createDataURL = function(Y, Q) {
          Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q;
          var G = R.getModuleCount() * Y + Q * 2, X = Q, J = G - Q;
          return N(G, G, function(ae, de) {
            if (X <= ae && ae < J && X <= de && de < J) {
              var ce = Math.floor((ae - X) / Y), xe = Math.floor((de - X) / Y);
              return R.isDark(xe, ce) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(Y, Q, G) {
          Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q;
          var X = R.getModuleCount() * Y + Q * 2, J = "";
          return J += "<img", J += ' src="', J += R.createDataURL(Y, Q), J += '"', J += ' width="', J += X, J += '"', J += ' height="', J += X, J += '"', G && (J += ' alt="', J += at(G), J += '"'), J += "/>", J;
        };
        var at = function(Y) {
          for (var Q = "", G = 0; G < Y.length; G += 1) {
            var X = Y.charAt(G);
            switch (X) {
              case "<":
                Q += "&lt;";
                break;
              case ">":
                Q += "&gt;";
                break;
              case "&":
                Q += "&amp;";
                break;
              case '"':
                Q += "&quot;";
                break;
              default:
                Q += X;
                break;
            }
          }
          return Q;
        }, Xr = function(Y) {
          var Q = 1;
          Y = typeof Y > "u" ? Q * 2 : Y;
          var G = R.getModuleCount() * Q + Y * 2, X = Y, J = G - Y, ae, de, ce, xe, Ae, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Fe = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, We = "";
          for (ae = 0; ae < G; ae += 2) {
            for (ce = Math.floor((ae - X) / Q), xe = Math.floor((ae + 1 - X) / Q), de = 0; de < G; de += 1)
              Ae = "█", X <= de && de < J && X <= ae && ae < J && R.isDark(ce, Math.floor((de - X) / Q)) && (Ae = " "), X <= de && de < J && X <= ae + 1 && ae + 1 < J && R.isDark(xe, Math.floor((de - X) / Q)) ? Ae += " " : Ae += "█", We += Y < 1 && ae + 1 >= J ? Fe[Ae] : he[Ae];
            We += `
`;
          }
          return G % 2 && Y > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return R.createASCII = function(Y, Q) {
          if (Y = Y || 1, Y < 2)
            return Xr(Q);
          Y -= 1, Q = typeof Q > "u" ? Y * 2 : Q;
          var G = R.getModuleCount() * Y + Q * 2, X = Q, J = G - Q, ae, de, ce, xe, Ae = Array(Y + 1).join("██"), he = Array(Y + 1).join("  "), Fe = "", We = "";
          for (ae = 0; ae < G; ae += 1) {
            for (ce = Math.floor((ae - X) / Y), We = "", de = 0; de < G; de += 1)
              xe = 1, X <= de && de < J && X <= ae && ae < J && R.isDark(ce, Math.floor((de - X) / Y)) && (xe = 0), We += xe ? Ae : he;
            for (ce = 0; ce < Y; ce += 1)
              Fe += We + `
`;
          }
          return Fe.substring(0, Fe.length - 1);
        }, R.renderTo2dContext = function(Y, Q) {
          Q = Q || 2;
          for (var G = R.getModuleCount(), X = 0; X < G; X++)
            for (var J = 0; J < G; J++)
              Y.fillStyle = R.isDark(X, J) ? "black" : "white", Y.fillRect(X * Q, J * Q, Q, Q);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(w) {
          for (var z = [], j = 0; j < w.length; j += 1) {
            var q = w.charCodeAt(j);
            z.push(q & 255);
          }
          return z;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(w, z) {
        var j = (function() {
          for (var _ = B(w), I = function() {
            var me = _.read();
            if (me == -1) throw "eof";
            return me;
          }, $ = 0, g = {}; ; ) {
            var M = _.read();
            if (M == -1) break;
            var E = I(), R = I(), U = I(), ee = String.fromCharCode(M << 8 | E), Z = R << 8 | U;
            g[ee] = Z, $ += 1;
          }
          if ($ != z)
            throw $ + " != " + z;
          return g;
        })(), q = 63;
        return function(_) {
          for (var I = [], $ = 0; $ < _.length; $ += 1) {
            var g = _.charCodeAt($);
            if (g < 128)
              I.push(g);
            else {
              var M = j[_.charAt($)];
              typeof M == "number" ? (M & 255) == M ? I.push(M) : (I.push(M >>> 8), I.push(M & 255)) : I.push(q);
            }
          }
          return I;
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
        ], z = 1335, j = 7973, q = 21522, _ = {}, I = function($) {
          for (var g = 0; $ != 0; )
            g += 1, $ >>>= 1;
          return g;
        };
        return _.getBCHTypeInfo = function($) {
          for (var g = $ << 10; I(g) - I(z) >= 0; )
            g ^= z << I(g) - I(z);
          return ($ << 10 | g) ^ q;
        }, _.getBCHTypeNumber = function($) {
          for (var g = $ << 12; I(g) - I(j) >= 0; )
            g ^= j << I(g) - I(j);
          return $ << 12 | g;
        }, _.getPatternPosition = function($) {
          return w[$ - 1];
        }, _.getMaskFunction = function($) {
          switch ($) {
            case l.PATTERN000:
              return function(g, M) {
                return (g + M) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, M) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, M) {
                return M % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, M) {
                return (g + M) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, M) {
                return (Math.floor(g / 2) + Math.floor(M / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, M) {
                return g * M % 2 + g * M % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, M) {
                return (g * M % 2 + g * M % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, M) {
                return (g * M % 3 + (g + M) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + $;
          }
        }, _.getErrorCorrectPolynomial = function($) {
          for (var g = c([1], 0), M = 0; M < $; M += 1)
            g = g.multiply(c([1, u.gexp(M)], 0));
          return g;
        }, _.getLengthInBits = function($, g) {
          if (1 <= g && g < 10)
            switch ($) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + $;
            }
          else if (g < 27)
            switch ($) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + $;
            }
          else if (g < 41)
            switch ($) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + $;
            }
          else
            throw "type:" + g;
        }, _.getLostPoint = function($) {
          for (var g = $.getModuleCount(), M = 0, E = 0; E < g; E += 1)
            for (var R = 0; R < g; R += 1) {
              for (var U = 0, ee = $.isDark(E, R), Z = -1; Z <= 1; Z += 1)
                if (!(E + Z < 0 || g <= E + Z))
                  for (var me = -1; me <= 1; me += 1)
                    R + me < 0 || g <= R + me || Z == 0 && me == 0 || ee == $.isDark(E + Z, R + me) && (U += 1);
              U > 5 && (M += 3 + U - 5);
            }
          for (var E = 0; E < g - 1; E += 1)
            for (var R = 0; R < g - 1; R += 1) {
              var ve = 0;
              $.isDark(E, R) && (ve += 1), $.isDark(E + 1, R) && (ve += 1), $.isDark(E, R + 1) && (ve += 1), $.isDark(E + 1, R + 1) && (ve += 1), (ve == 0 || ve == 4) && (M += 3);
            }
          for (var E = 0; E < g; E += 1)
            for (var R = 0; R < g - 6; R += 1)
              $.isDark(E, R) && !$.isDark(E, R + 1) && $.isDark(E, R + 2) && $.isDark(E, R + 3) && $.isDark(E, R + 4) && !$.isDark(E, R + 5) && $.isDark(E, R + 6) && (M += 40);
          for (var R = 0; R < g; R += 1)
            for (var E = 0; E < g - 6; E += 1)
              $.isDark(E, R) && !$.isDark(E + 1, R) && $.isDark(E + 2, R) && $.isDark(E + 3, R) && $.isDark(E + 4, R) && !$.isDark(E + 5, R) && $.isDark(E + 6, R) && (M += 40);
          for (var be = 0, R = 0; R < g; R += 1)
            for (var E = 0; E < g; E += 1)
              $.isDark(E, R) && (be += 1);
          var ie = Math.abs(100 * be / g / g - 50) / 5;
          return M += ie * 10, M;
        }, _;
      })(), u = (function() {
        for (var w = new Array(256), z = new Array(256), j = 0; j < 8; j += 1)
          w[j] = 1 << j;
        for (var j = 8; j < 256; j += 1)
          w[j] = w[j - 4] ^ w[j - 5] ^ w[j - 6] ^ w[j - 8];
        for (var j = 0; j < 255; j += 1)
          z[w[j]] = j;
        var q = {};
        return q.glog = function(_) {
          if (_ < 1)
            throw "glog(" + _ + ")";
          return z[_];
        }, q.gexp = function(_) {
          for (; _ < 0; )
            _ += 255;
          for (; _ >= 256; )
            _ -= 255;
          return w[_];
        }, q;
      })();
      function c(w, z) {
        if (typeof w.length > "u")
          throw w.length + "/" + z;
        var j = (function() {
          for (var _ = 0; _ < w.length && w[_] == 0; )
            _ += 1;
          for (var I = new Array(w.length - _ + z), $ = 0; $ < w.length - _; $ += 1)
            I[$] = w[$ + _];
          return I;
        })(), q = {};
        return q.getAt = function(_) {
          return j[_];
        }, q.getLength = function() {
          return j.length;
        }, q.multiply = function(_) {
          for (var I = new Array(q.getLength() + _.getLength() - 1), $ = 0; $ < q.getLength(); $ += 1)
            for (var g = 0; g < _.getLength(); g += 1)
              I[$ + g] ^= u.gexp(u.glog(q.getAt($)) + u.glog(_.getAt(g)));
          return c(I, 0);
        }, q.mod = function(_) {
          if (q.getLength() - _.getLength() < 0)
            return q;
          for (var I = u.glog(q.getAt(0)) - u.glog(_.getAt(0)), $ = new Array(q.getLength()), g = 0; g < q.getLength(); g += 1)
            $[g] = q.getAt(g);
          for (var g = 0; g < _.getLength(); g += 1)
            $[g] ^= u.gexp(u.glog(_.getAt(g)) + I);
          return c($, 0).mod(_);
        }, q;
      }
      var f = (function() {
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
        ], z = function(_, I) {
          var $ = {};
          return $.totalCount = _, $.dataCount = I, $;
        }, j = {}, q = function(_, I) {
          switch (I) {
            case o.L:
              return w[(_ - 1) * 4 + 0];
            case o.M:
              return w[(_ - 1) * 4 + 1];
            case o.Q:
              return w[(_ - 1) * 4 + 2];
            case o.H:
              return w[(_ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return j.getRSBlocks = function(_, I) {
          var $ = q(_, I);
          if (typeof $ > "u")
            throw "bad rs block @ typeNumber:" + _ + "/errorCorrectionLevel:" + I;
          for (var g = $.length / 3, M = [], E = 0; E < g; E += 1)
            for (var R = $[E * 3 + 0], U = $[E * 3 + 1], ee = $[E * 3 + 2], Z = 0; Z < R; Z += 1)
              M.push(z(U, ee));
          return M;
        }, j;
      })(), h = function() {
        var w = [], z = 0, j = {};
        return j.getBuffer = function() {
          return w;
        }, j.getAt = function(q) {
          var _ = Math.floor(q / 8);
          return (w[_] >>> 7 - q % 8 & 1) == 1;
        }, j.put = function(q, _) {
          for (var I = 0; I < _; I += 1)
            j.putBit((q >>> _ - I - 1 & 1) == 1);
        }, j.getLengthInBits = function() {
          return z;
        }, j.putBit = function(q) {
          var _ = Math.floor(z / 8);
          w.length <= _ && w.push(0), q && (w[_] |= 128 >>> z % 8), z += 1;
        }, j;
      }, p = function(w) {
        var z = s.MODE_NUMBER, j = w, q = {};
        q.getMode = function() {
          return z;
        }, q.getLength = function($) {
          return j.length;
        }, q.write = function($) {
          for (var g = j, M = 0; M + 2 < g.length; )
            $.put(_(g.substring(M, M + 3)), 10), M += 3;
          M < g.length && (g.length - M == 1 ? $.put(_(g.substring(M, M + 1)), 4) : g.length - M == 2 && $.put(_(g.substring(M, M + 2)), 7));
        };
        var _ = function($) {
          for (var g = 0, M = 0; M < $.length; M += 1)
            g = g * 10 + I($.charAt(M));
          return g;
        }, I = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          throw "illegal char :" + $;
        };
        return q;
      }, y = function(w) {
        var z = s.MODE_ALPHA_NUM, j = w, q = {};
        q.getMode = function() {
          return z;
        }, q.getLength = function(I) {
          return j.length;
        }, q.write = function(I) {
          for (var $ = j, g = 0; g + 1 < $.length; )
            I.put(
              _($.charAt(g)) * 45 + _($.charAt(g + 1)),
              11
            ), g += 2;
          g < $.length && I.put(_($.charAt(g)), 6);
        };
        var _ = function(I) {
          if ("0" <= I && I <= "9")
            return I.charCodeAt(0) - 48;
          if ("A" <= I && I <= "Z")
            return I.charCodeAt(0) - 65 + 10;
          switch (I) {
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
              throw "illegal char :" + I;
          }
        };
        return q;
      }, k = function(w) {
        var z = s.MODE_8BIT_BYTE, j = a.stringToBytes(w), q = {};
        return q.getMode = function() {
          return z;
        }, q.getLength = function(_) {
          return j.length;
        }, q.write = function(_) {
          for (var I = 0; I < j.length; I += 1)
            _.put(j[I], 8);
        }, q;
      }, T = function(w) {
        var z = s.MODE_KANJI, j = a.stringToBytesFuncs.SJIS;
        if (!j)
          throw "sjis not supported.";
        (function(I, $) {
          var g = j(I);
          if (g.length != 2 || (g[0] << 8 | g[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var q = j(w), _ = {};
        return _.getMode = function() {
          return z;
        }, _.getLength = function(I) {
          return ~~(q.length / 2);
        }, _.write = function(I) {
          for (var $ = q, g = 0; g + 1 < $.length; ) {
            var M = (255 & $[g]) << 8 | 255 & $[g + 1];
            if (33088 <= M && M <= 40956)
              M -= 33088;
            else if (57408 <= M && M <= 60351)
              M -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + M;
            M = (M >>> 8 & 255) * 192 + (M & 255), I.put(M, 13), g += 2;
          }
          if (g < $.length)
            throw "illegal char at " + (g + 1);
        }, _;
      }, S = function() {
        var w = [], z = {};
        return z.writeByte = function(j) {
          w.push(j & 255);
        }, z.writeShort = function(j) {
          z.writeByte(j), z.writeByte(j >>> 8);
        }, z.writeBytes = function(j, q, _) {
          q = q || 0, _ = _ || j.length;
          for (var I = 0; I < _; I += 1)
            z.writeByte(j[I + q]);
        }, z.writeString = function(j) {
          for (var q = 0; q < j.length; q += 1)
            z.writeByte(j.charCodeAt(q));
        }, z.toByteArray = function() {
          return w;
        }, z.toString = function() {
          var j = "";
          j += "[";
          for (var q = 0; q < w.length; q += 1)
            q > 0 && (j += ","), j += w[q];
          return j += "]", j;
        }, z;
      }, x = function() {
        var w = 0, z = 0, j = 0, q = "", _ = {}, I = function(g) {
          q += String.fromCharCode($(g & 63));
        }, $ = function(g) {
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
        return _.writeByte = function(g) {
          for (w = w << 8 | g & 255, z += 8, j += 1; z >= 6; )
            I(w >>> z - 6), z -= 6;
        }, _.flush = function() {
          if (z > 0 && (I(w << 6 - z), w = 0, z = 0), j % 3 != 0)
            for (var g = 3 - j % 3, M = 0; M < g; M += 1)
              q += "=";
        }, _.toString = function() {
          return q;
        }, _;
      }, B = function(w) {
        var z = w, j = 0, q = 0, _ = 0, I = {};
        I.read = function() {
          for (; _ < 8; ) {
            if (j >= z.length) {
              if (_ == 0)
                return -1;
              throw "unexpected end of file./" + _;
            }
            var g = z.charAt(j);
            if (j += 1, g == "=")
              return _ = 0, -1;
            if (g.match(/^\s$/))
              continue;
            q = q << 6 | $(g.charCodeAt(0)), _ += 6;
          }
          var M = q >>> _ - 8 & 255;
          return _ -= 8, M;
        };
        var $ = function(g) {
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
        return I;
      }, W = function(w, z) {
        var j = w, q = z, _ = new Array(w * z), I = {};
        I.setPixel = function(E, R, U) {
          _[R * j + E] = U;
        }, I.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(j), E.writeShort(q), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(j), E.writeShort(q), E.writeByte(0);
          var R = 2, U = g(R);
          E.writeByte(R);
          for (var ee = 0; U.length - ee > 255; )
            E.writeByte(255), E.writeBytes(U, ee, 255), ee += 255;
          E.writeByte(U.length - ee), E.writeBytes(U, ee, U.length - ee), E.writeByte(0), E.writeString(";");
        };
        var $ = function(E) {
          var R = E, U = 0, ee = 0, Z = {};
          return Z.write = function(me, ve) {
            if (me >>> ve)
              throw "length over";
            for (; U + ve >= 8; )
              R.writeByte(255 & (me << U | ee)), ve -= 8 - U, me >>>= 8 - U, ee = 0, U = 0;
            ee = me << U | ee, U = U + ve;
          }, Z.flush = function() {
            U > 0 && R.writeByte(ee);
          }, Z;
        }, g = function(E) {
          for (var R = 1 << E, U = (1 << E) + 1, ee = E + 1, Z = M(), me = 0; me < R; me += 1)
            Z.add(String.fromCharCode(me));
          Z.add(String.fromCharCode(R)), Z.add(String.fromCharCode(U));
          var ve = S(), be = $(ve);
          be.write(R, ee);
          var ie = 0, te = String.fromCharCode(_[ie]);
          for (ie += 1; ie < _.length; ) {
            var se = String.fromCharCode(_[ie]);
            ie += 1, Z.contains(te + se) ? te = te + se : (be.write(Z.indexOf(te), ee), Z.size() < 4095 && (Z.size() == 1 << ee && (ee += 1), Z.add(te + se)), te = se);
          }
          return be.write(Z.indexOf(te), ee), be.write(U, ee), be.flush(), ve.toByteArray();
        }, M = function() {
          var E = {}, R = 0, U = {};
          return U.add = function(ee) {
            if (U.contains(ee))
              throw "dup key:" + ee;
            E[ee] = R, R += 1;
          }, U.size = function() {
            return R;
          }, U.indexOf = function(ee) {
            return E[ee];
          }, U.contains = function(ee) {
            return typeof E[ee] < "u";
          }, U;
        };
        return I;
      }, N = function(w, z, j) {
        for (var q = W(w, z), _ = 0; _ < z; _ += 1)
          for (var I = 0; I < w; I += 1)
            q.setPixel(I, _, j(I, _));
        var $ = S();
        q.write($);
        for (var g = x(), M = $.toByteArray(), E = 0; E < M.length; E += 1)
          g.writeByte(M[E]);
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
  })(us)), us.exports;
}
var VS = GS();
const KS = /* @__PURE__ */ US(VS), YS = ["width", "height", "viewBox"], QS = ["width", "height"], XS = ["d"], JS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = C(() => {
      const a = KS(0, "M");
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
      m("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, QS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, XS)
    ], 8, YS));
  }
}, jC = /* @__PURE__ */ H(JS, [["__scopeId", "data-v-489f0852"]]), ZS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, FC = /* @__PURE__ */ H(ZS, [["__scopeId", "data-v-47e67f04"]]);
function WC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const HC = ru(() => import("./VoiceFigure-C_PJ2Uwj.js").then((e) => e.V)), zC = "1.2.0", UC = "3.5";
export {
  Df as $,
  Oe as A,
  Ie as B,
  $a as C,
  ct as D,
  G_ as E,
  n4 as F,
  NM as G,
  W_ as H,
  N$ as I,
  u4 as J,
  Ot as K,
  a6 as L,
  mo as M,
  p4 as N,
  r4 as O,
  wa as P,
  r_ as Q,
  pM as R,
  Kn as S,
  h_ as T,
  iM as U,
  Te as V,
  la as W,
  lM as X,
  oM as Y,
  qf as Z,
  H as _,
  X6 as a,
  O_ as a$,
  h4 as a0,
  gM as a1,
  vM as a2,
  Re as a3,
  EM as a4,
  CM as a5,
  Ct as a6,
  yM as a7,
  jM as a8,
  j6 as a9,
  $_ as aA,
  o_ as aB,
  M$ as aC,
  zM as aD,
  UM as aE,
  V_ as aF,
  Br as aG,
  f_ as aH,
  Sn as aI,
  G6 as aJ,
  H6 as aK,
  N_ as aL,
  Mn as aM,
  j_ as aN,
  LM as aO,
  l_ as aP,
  i_ as aQ,
  s_ as aR,
  mn as aS,
  St as aT,
  F6 as aU,
  p5 as aV,
  n_ as aW,
  hM as aX,
  Tr as aY,
  Ht as aZ,
  Yt as a_,
  T_ as aa,
  D_ as ab,
  Y6 as ac,
  rM as ad,
  uM as ae,
  MM as af,
  _M as ag,
  AM as ah,
  tM as ai,
  Ml as aj,
  bM as ak,
  PM as al,
  X_ as am,
  JM as an,
  QM as ao,
  YM as ap,
  OM as aq,
  xM as ar,
  $M as as,
  SM as at,
  d_ as au,
  DM as av,
  FM as aw,
  eC as ax,
  nn as ay,
  WM as az,
  _4 as b,
  Z_ as b$,
  J$ as b0,
  P_ as b1,
  g_ as b2,
  p_ as b3,
  P5 as b4,
  yr as b5,
  C_ as b6,
  qM as b7,
  Ma as b8,
  mt as b9,
  y_ as bA,
  S_ as bB,
  vt as bC,
  m_ as bD,
  M_ as bE,
  HM as bF,
  ZM as bG,
  GM as bH,
  Ne as bI,
  RM as bJ,
  __ as bK,
  rC as bL,
  uC as bM,
  D6 as bN,
  y5 as bO,
  IM as bP,
  b_ as bQ,
  J6 as bR,
  Q_ as bS,
  v_ as bT,
  k_ as bU,
  w_ as bV,
  TM as bW,
  _$ as bX,
  BM as bY,
  KM as bZ,
  Y_ as b_,
  x_ as ba,
  Qa as bb,
  Bi as bc,
  nC as bd,
  oC as be,
  c_ as bf,
  L_ as bg,
  P6 as bh,
  XM as bi,
  aC as bj,
  kM as bk,
  wM as bl,
  aM as bm,
  mM as bn,
  U6 as bo,
  B_ as bp,
  Z6 as bq,
  eM as br,
  sM as bs,
  t_ as bt,
  c5 as bu,
  F_ as bv,
  i4 as bw,
  nM as bx,
  V6 as by,
  e_ as bz,
  D5 as c,
  RC as c$,
  z6 as c0,
  W6 as c1,
  VM as c2,
  lC as c3,
  bo as c4,
  iC as c5,
  Kr as c6,
  R_ as c7,
  dM as c8,
  cM as c9,
  lo as cA,
  cC as cB,
  t6 as cC,
  Kt as cD,
  Wd as cE,
  qC as cF,
  ep as cG,
  le as cH,
  fi as cI,
  SC as cJ,
  h6 as cK,
  zC as cL,
  UC as cM,
  C6 as cN,
  CC as cO,
  Cs as cP,
  B6 as cQ,
  u2 as cR,
  ze as cS,
  Mt as cT,
  pa as cU,
  $6 as cV,
  E6 as cW,
  c6 as cX,
  Sc as cY,
  Hw as cZ,
  sa as c_,
  m5 as ca,
  K6 as cb,
  o4 as cc,
  a_ as cd,
  co as ce,
  k$ as cf,
  u_ as cg,
  an as ch,
  Pt as ci,
  Dt as cj,
  b6 as ck,
  w6 as cl,
  ba as cm,
  xC as cn,
  ge as co,
  vf as cp,
  Ys as cq,
  ga as cr,
  ry as cs,
  va as ct,
  LC as cu,
  q6 as cv,
  k6 as cw,
  dy as cx,
  zi as cy,
  rn as cz,
  Ke as d,
  W4 as d$,
  p6 as d0,
  g6 as d1,
  v6 as d2,
  S6 as d3,
  NC as d4,
  jC as d5,
  Vi as d6,
  Zc as d7,
  wC as d8,
  A0 as d9,
  ao as dA,
  gC as dB,
  Ps as dC,
  sp as dD,
  to as dE,
  m6 as dF,
  wn as dG,
  gd as dH,
  IC as dI,
  TC as dJ,
  zs as dK,
  pd as dL,
  Ws as dM,
  BC as dN,
  N6 as dO,
  Wi as dP,
  n1 as dQ,
  y6 as dR,
  Sw as dS,
  R6 as dT,
  I6 as dU,
  hC as dV,
  cm as dW,
  dC as dX,
  l6 as dY,
  AC as dZ,
  n2 as d_,
  r6 as da,
  L6 as db,
  kx as dc,
  Ft as dd,
  A6 as de,
  Ye as df,
  bt as dg,
  bv as dh,
  id as di,
  jm as dj,
  T6 as dk,
  u6 as dl,
  Gt as dm,
  _C as dn,
  MC as dp,
  uS as dq,
  DC as dr,
  PC as ds,
  ka as dt,
  zd as du,
  lt as dv,
  O6 as dw,
  et as dx,
  HC as dy,
  FC as dz,
  fM as e,
  ar as e0,
  d6 as e1,
  _6 as e2,
  pC as e3,
  vC as e4,
  De as e5,
  lp as e6,
  x6 as e7,
  _c as e8,
  fC as e9,
  ds as eA,
  bC as eB,
  kC as eC,
  nt as eD,
  OC as eE,
  Jn as eF,
  lr as ea,
  mC as eb,
  zl as ec,
  M6 as ed,
  fp as ee,
  i6 as ef,
  dp as eg,
  Na as eh,
  o6 as ei,
  un as ej,
  li as ek,
  vd as el,
  f6 as em,
  gt as en,
  WC as eo,
  H4 as ep,
  n6 as eq,
  s6 as er,
  $C as es,
  Fi as et,
  EC as eu,
  ir as ev,
  ni as ew,
  Ax as ex,
  js as ey,
  yC as ez,
  u5 as f,
  tC as g,
  pn as h,
  H_ as i,
  sC as j,
  z_ as k,
  I_ as l,
  T4 as m,
  po as n,
  q_ as o,
  Q6 as p,
  U_ as q,
  Gr as r,
  Vr as s,
  Ee as t,
  F5 as u,
  E_ as v,
  J_ as w,
  A_ as x,
  Cn as y,
  K_ as z
};
