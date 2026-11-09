import { openBlock as r, createElementBlock as d, normalizeStyle as ye, unref as L, renderSlot as he, createElementVNode as m, normalizeClass as K, Fragment as D, renderList as ne, defineComponent as Vr, Comment as Kr, h as ca, cloneVNode as Yr, createBlock as F, withCtx as j, createVNode as E, toDisplayString as v, createCommentVNode as k, ref as T, inject as Me, watch as ge, onMounted as _e, onBeforeUnmount as et, reactive as zt, shallowRef as Xe, onUnmounted as Be, useAttrs as da, computed as A, resolveDynamicComponent as ut, mergeProps as Pe, useId as Is, resolveDirective as Qr, withDirectives as Je, createTextVNode as V, Teleport as fa, nextTick as je, Transition as Ut, withModifiers as Se, createApp as Xr, shallowReactive as Jr, withKeys as _t, onScopeDispose as ha, useModel as ln, mergeModels as jt, toRef as Ma, vModelText as Qn, resolveComponent as Zr, provide as Rl, onErrorCaptured as eu, TransitionGroup as Bs, isRef as bo, getCurrentInstance as tu, getCurrentScope as Ll, createSlots as nu, vShow as Nl, useSlots as au, normalizeProps as su, guardReactiveProps as ou, defineAsyncComponent as lu } from "vue";
function ql(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const H = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, iu = 1600, ru = {
  __name: "Shimmer",
  setup(e) {
    const t = ql(iu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ye(L(t))
    }, null, 4));
  }
}, en = /* @__PURE__ */ H(ru, [["__scopeId", "data-v-6c018b03"]]), uu = { class: "skeleton-line" }, cu = 2e3, du = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = ql(cu);
    return (n, a) => (r(), d("span", uu, [
      he(n.$slots, "default", {}, void 0, !0),
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
}, bt = /* @__PURE__ */ H(du, [["__scopeId", "data-v-484fe8a0"]]), Gt = Vr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Kr);
      return a.length !== 1 ? ca(D, { key: n }, a) : a[0].key == null ? Yr(a[0], { key: n }) : a[0];
    };
  }
}), fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], gu = ["aria-label"], vu = ["aria-label"], yu = ["aria-label"], bu = {
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
      messages: j(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(D, null, ne(t, (f) => E(en, {
            key: f.id,
            class: K(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, fu)
      ]),
      older: j(() => [
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
        ], 8, hu)
      ]),
      cards: j(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(D, null, ne(n, (h) => E(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, mu)
      ]),
      file: j(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            E(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(D, null, ne(s, (h) => E(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, pu)
      ]),
      page: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          E(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, gu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(bt, {
            key: f,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, vu)
      ]),
      default: j(() => [
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
        ], 8, yu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ke = /* @__PURE__ */ H(bu, [["__scopeId", "data-v-ef519c5f"]]), ku = {
  key: 1,
  class: "empty-state titled"
}, wu = { class: "empty-state-title" }, $u = { class: "empty-state-text" }, xu = {
  key: 2,
  class: "empty-state"
}, Su = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", ku, [
      m("p", wu, v(e.title), 1),
      m("p", $u, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", xu, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, rn = /* @__PURE__ */ H(Su, [["__scopeId", "data-v-b27e89b0"]]), Mu = { class: "fold-group" }, _u = ["aria-expanded"], Cu = { class: "fold-label" }, Au = {
  key: 0,
  class: "fold-count"
}, Eu = {
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
    return (a, s) => (r(), d("div", Mu, [
      m("button", {
        type: "button",
        class: K(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Cu, v(e.label), 1),
        e.count !== "" ? (r(), d("span", Au, v(e.count), 1)) : k("", !0),
        m("span", {
          class: K(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, _u),
      e.open ? he(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, BS = /* @__PURE__ */ H(Eu, [["__scopeId", "data-v-9ef1865c"]]), Ou = 150, Tu = () => Ou;
function Rs(e, t, n = Tu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Dl(e, t, n) {
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
const Iu = 50, ko = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function RS(e) {
  const t = tt().sources.find((n) => n.key === e);
  return t ? is(t.read, t.events) : is("", []);
}
function Pl(e, t, n, a, s = () => !1) {
  const o = T([]), l = T(null), i = T(""), u = T(!1), c = performance.now(), f = T(!1), h = T(""), p = T(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function O(g) {
    return s() ? (y.add(g), b ?? (b = new Promise((M) => setTimeout(() => M(S()), Iu)))) : x(g);
  }
  async function S() {
    const g = new Set(y);
    y.clear(), b = null;
    const M = N, C = await t({ ids: [...g].join(","), limit: g.size });
    if (M !== N) return;
    if (!C.ok) return q();
    const R = new Map(C.value.rows.map((U) => [U.id, U]));
    o.value = o.value.flatMap((U) => g.has(U.id) ? R.has(U.id) ? [R.get(U.id)] : [] : [U]);
  }
  async function x(g) {
    const M = N, C = await t({ "before-id": g + 1, limit: 1 });
    if (M !== N) return;
    if (!C.ok) return q();
    const R = C.value.rows.find((U) => U.id === g);
    o.value = R ? o.value.map((U) => U.id === g ? R : U) : o.value.filter((U) => U.id !== g);
  }
  async function B(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ee) => ee.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((ee) => ee.id === g.row_id)) return O(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return q();
    const C = Math.max(...o.value.map((ee) => ee.id)), R = N, U = await t({ "after-id": C });
    if (R !== N) return;
    if (!U.ok) return q();
    const Z = new Set(o.value.map((ee) => ee.id));
    o.value = [...U.value.rows.filter((ee) => !Z.has(ee.id)), ...o.value];
  }
  async function W() {
    if (!f.value || !o.value.length) return !1;
    const g = N, M = Math.min(...o.value.map((U) => U.id)), C = await t({ "before-id": M });
    if (g !== N) return !1;
    if (!C.ok || !C.value.rows.length) return f.value = !1;
    f.value = ko(C.value, n());
    const R = new Set(o.value.map((U) => U.id));
    return o.value = [...o.value, ...C.value.rows.filter((U) => !R.has(U.id))], !0;
  }
  let N = 0;
  function w(g, M) {
    var U, Z;
    const C = g.ok ? e.shared ? [g.value] : ((U = g.value) == null ? void 0 : U.rows) ?? [] : [];
    g.ok && (o.value = M(C)), l.value = g.ok ? g.value : null;
    const R = C.length ? Math.min(...C.map((ee) => ee.id)) : 0;
    g.ok && ((Z = g.value) != null && Z.rows) && !o.value.some((ee) => ee.id < R) && (f.value = !e.shared && ko(g.value, n())), i.value = g.ok ? "" : g.error, Rs(c, () => u.value = !0);
  }
  async function z(g) {
    const M = ++N, C = await t({});
    M === N && w(C, g);
  }
  const P = (g) => {
    if (!a() || !g.length) return g;
    const M = Math.min(...g.map((R) => R.id)), C = Math.max(...g.map((R) => R.id));
    return [...o.value.filter((R) => R.id > C), ...g, ...o.value.filter((R) => R.id < M)];
  }, q = () => z(P), _ = (g) => w(g, P), I = () => z((g) => g);
  async function $(g, M = null) {
    const C = await Dl(M && { target: o, fields: { value: M(o.value) } }, g, e.run);
    return h.value = C.ok ? "" : C.error, p.value = C.ok ? C.value : null, await q(), C;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: q, loadLatest: I, older: W, act: $, actionFailure: h, answer: p, context: e, heard: B, showFirst: _, pageSize: n };
}
const Bu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function is(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = tt(), l = Pl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Bu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Ru = 2e3;
function Ls(e, t, n = Ru) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Me(Ne, null), u = () => {
    var O;
    return ((O = i == null ? void 0 : i.visible) == null ? void 0 : O.value) === !1;
  }, c = () => document.hidden || u(), f = async (O) => {
    o = !0;
    try {
      await O();
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
  }, b = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return y();
      await h(), p();
    }
  };
  ge(() => {
    var O;
    return (O = i == null ? void 0 : i.visible) == null ? void 0 : O.value;
  }, b), _e(async () => {
    document.addEventListener("visibilitychange", b), u() || await y();
  }), et(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const jl = typeof document < "u" && document.documentElement.classList.contains("phone"), Fl = 120;
var Il;
const _a = globalThis[Il = Symbol.for("journal.pressed")] ?? (globalThis[Il] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Lu(e = 0) {
  const t = _a.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, _a.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, _a.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function rs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Wl(e = window) {
  if (!rs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    rs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const us = "journal.stale-build-reload", Nu = 'script[type="module"][src*="/assets/index-"]', wo = (e) => {
  var t;
  return ((t = e.querySelector(Nu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function qu(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => Wl(window)) {
  const a = wo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = wo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ca = "";
function Du(e, t = () => Wl(window)) {
  if (!e) return !1;
  const n = !!Ca && Ca !== e;
  return Ca = e, n && t(), n;
}
const Pu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function ju(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(us) === e.message) return !1;
    t.setItem(us, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Fu(e = window.sessionStorage) {
  try {
    e.removeItem(us);
  } catch {
    return;
  }
}
const Wu = 2e3, Hu = 3e4, Ge = zt({ starting: !1, external: !1, late: !1, offline: !1 }), Ns = () => Ge.starting, zu = 3;
let An = 0, cs = 0, Hl = 0, zl = [];
async function Uu() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let $o = null;
const Gu = () => $o ?? ($o = Uu().finally(() => $o = null));
function Vu() {
  clearTimeout(cs), clearTimeout(Hl), cs = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), zl.splice(0).forEach((e) => e()), qu();
}
async function Ku() {
  Ge.offline = !navigator.onLine;
  const e = await Gu();
  if (Ge.external = e.updating, An = !e.restarting && !e.updating && e.reachable ? An + 1 : 0, An < zu) return;
  An = 0, (!Du(e.started_at) || rs()) && Vu();
}
function Ul() {
  cs = setTimeout(async () => {
    await Ku(), Ge.starting && Ul();
  }, Wu);
}
function Yu() {
  Ge.starting || (Ge.starting = !0, Ge.offline = !navigator.onLine, Ul(), Hl = setTimeout(() => Ge.late = !0, Hu));
}
const Gl = () => Ge.starting ? new Promise((e) => zl.push(e)) : Promise.resolve();
function qs(e, t, n = 0) {
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
function Qu(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Xu {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = qs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Qu(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const dt = "viewer.shell", En = 2e4, Ju = 4, xo = "/api/read-lines", Zu = 5e3, ec = 403, So = "/api/repeated-lines", tc = 10, nc = 2e3, ac = 3e5, LS = 6e5, On = 6, sc = 500, oc = "/journal/summary", Mo = "/api/server-state", lc = 2e4, Tn = jl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, ic = (e) => e.split("?")[0].endsWith(oc), ds = (e, t) => Object.assign(new Error(t), { status: e });
async function rc(e, t, n = ds) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const uc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), cc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), _o = (e) => e.split(" ").slice(0, 2).join(" "), st = "read", Bt = "write", dc = "stream";
class fc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = On;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = _o(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < nc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < tc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(So, { method: "POST", headers: { ...Tn, "Content-Type": "application/json" }, body: i }, [{ window: dt, line: So, kind: Bt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Lu(n ? Fl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: cc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Bt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = En) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Yu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Ju ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(xo, { headers: Tn }, [{ window: dt, line: xo, kind: st }], Zu).then(async (t) => {
      if (t.status === ec) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ds(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Xu(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = _o(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = On;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Tn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: uc(a) }, c = s || (i ? ac : En);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: dt, line: n, kind: st }], c)) : await this.sent(n, u, [{ window: dt, line: n, kind: Bt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, sc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = On, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return rc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: dt, line: t, kind: st }], En)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Tn });
    if (!n.ok) throw ds(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, On, o).then((i) => (this.written(n), i)) : Ns() && !ic(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: dt, line: t, kind: dc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Mo, { cache: "no-store" }, [{ window: dt, line: Mo, kind: st }], lc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = dt, line: s = t, limit: o = En } = {}) {
    const l = (n.method ?? "GET") === "GET" ? st : Bt;
    return l === Bt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Aa = Symbol.for("journal.transport"), Ae = globalThis[Aa] ?? (globalThis[Aa] = new fc());
class Vl {
  constructor() {
    this.following = Xe([]), this.held = /* @__PURE__ */ new Set();
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
    Ae.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Ds(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Ds(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const hc = 50, mc = "refresh", pc = 1e3, gc = 3e4, vc = "requested", yc = "after_window", bc = 50, In = ".*", kc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function wc(e) {
  const t = {}, n = zt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, h = !1;
  function p(_) {
    const I = () => u[_] ?? u[`${_.slice(0, _.lastIndexOf("."))}.*`] ?? {}, $ = T(void 0), g = Pl(e, async (M) => {
      const C = await O(_, M);
      return C.ok && !Object.keys(M).length && ($.value = C.value), C;
    }, () => I().page_size || bc, () => !!I().page_size, () => !!I().reads_ids);
    return t[_] = { ...g, data: $, readAt: 0 };
  }
  const y = new Proxy({}, { get: (_, I) => typeof I != "string" || I.startsWith("__v") ? void 0 : t[I] ?? p(I) }), b = (_) => (u[_].loading !== vc || _.endsWith(In)) && (!u[_].tab || u[_].tab === n.tab);
  function O(_, I = {}) {
    return new Promise(($) => {
      a.push({ name: _, flags: I, resolve: $ }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const _ = /* @__PURE__ */ new Map(), I = a.splice(0).filter((M) => {
      const C = JSON.stringify(M.flags);
      return _.has(M.name) || _.set(M.name, C), _.get(M.name) === C ? !0 : (a.push(M), !1);
    });
    a.length && setTimeout(S);
    const $ = Object.fromEntries(I.flatMap(({ name: M, flags: C }) => Object.entries(C).map(([R, U]) => [`${M}.${R}`, U]))), g = await e.readKeys({ only: [...new Set(I.map(({ name: M }) => M))], state: { ...n, ...$ } });
    I.forEach(({ name: M, resolve: C }) => C(g.ok ? g.value.keys[M] : g));
  }
  async function x(_) {
    var M;
    const I = ++f;
    (_.length ? _ : Object.keys(u).filter((C) => !C.endsWith(In) && u[C].loading === "first" && b(C))).forEach((C) => l[C] = I);
    const g = await e.readKeys({ only: _, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const C = (_.length ? _ : Object.keys(t)).filter((U) => (l[U] ?? 0) <= I);
      C.forEach((U) => {
        y[U].readAt = Date.now(), g.failure === "unreachable" ? i.add(U) : i.delete(U), y[U].showFirst(g);
      });
      const R = g.failure === "unreachable" && ((M = e.waitForServer) == null ? void 0 : M.call(e));
      return R && R.then(() => {
        if (h) return;
        const U = C.filter((Z) => l[Z] === I);
        (U.length || !_.length && !C.length && f === I) && x(U);
      }), !1;
    }
    return P(g.value.declared), Object.entries(g.value.keys).forEach(([C, R]) => {
      (l[C] ?? 0) > I || (l[C] = I, y[C].readAt = Date.now(), i.delete(C), R.ok && (y[C].data.value = R.value), y[C].showFirst(R));
    }), !0;
  }
  function B(_) {
    const I = kc(_);
    return I.length ? (I.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, $(x(g));
    })))) : x([]);
  }
  function W(_) {
    _.forEach((I) => s.add(I)), clearTimeout(c), c = setTimeout(() => {
      const I = [...s];
      s.clear(), I.length && B(I);
    }, hc);
  }
  const N = (_) => _.endsWith(In) ? Object.keys(t).filter((I) => I.startsWith(_.slice(0, -1)) && t[I].readAt) : [_], w = (_) => (u[_] ?? u[`${_.split(".")[0]}.*`]).reload_seconds;
  function z(_) {
    const I = Object.keys(u).filter((g) => _.event === mc || u[g].events.some((M) => Ds(M, _.event)));
    I.filter((g) => u[g].page_size).forEach((g) => y[g].heard(_));
    const $ = I.filter((g) => !u[g].page_size);
    $.filter((g) => !b(g)).forEach((g) => y[g].readAt = 0), W($.filter(b).flatMap(N));
  }
  function P(_) {
    if (Object.keys(u).length) return;
    u = _;
    const I = [...new Set(Object.values(_).flatMap((g) => g.events))];
    I.length && e.follow(I, z);
    const $ = Object.keys(_).filter((g) => _[g].loading === yc);
    $.length && x($);
  }
  ge(() => n.tab, () => {
    const _ = Object.keys(u).filter((I) => !I.endsWith(In) && b(I) && !y[I].readAt);
    _.length && x(_);
  }), Be(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const _ = Date.now(), I = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && b($)).flatMap(N).filter(($) => _ - y[$].readAt >= (i.has($) ? Math.min(w($) * 1e3, gc) : w($) * 1e3));
    I.length && W(I);
  }
  return Ls(q, () => e.visible.value, pc), queueMicrotask(() => x([])), { props: y, state: n, reload: B, readKey: O };
}
const $c = Symbol("open-view"), Ne = Symbol.for("journal.window-context"), Kl = Symbol("dock-card");
function xc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = wc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function tt() {
  const e = Me(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return xc(e);
}
const Sc = (e, t) => e(Kl, t), NS = () => Me(Kl), fs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Co = {
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
  agent: fs,
  worker: fs,
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
}, Mc = ["data-icon", "stroke-width", "innerHTML"], le = {
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
      agent: fs,
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
    }, null, 12, Mc));
  }
}, _c = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Cc = /* @__PURE__ */ H(_c, [["__scopeId", "data-v-eb453d6f"]]), Ac = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = da(), a = A(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = T(!1), o = A(() => t.busy || s.value), l = Me(Ne, null), i = A(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Fl);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, f) => (r(), F(ut(e.href ? "a" : "button"), Pe(a.value, {
      type: e.href ? void 0 : L(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: j(() => [
        m("span", {
          class: K(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), F(le, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          he(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), F(Cc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ H(Ac, [["__scopeId", "data-v-ededdadf"]]), Ec = ["aria-checked", "aria-haspopup", "onClick"], Oc = {
  key: 0,
  class: "segmented-dot"
}, Tc = {
  key: 1,
  class: "segmented-note"
}, Ic = {
  key: 2,
  class: "segmented-count"
}, Bc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Is();
    return (s, o) => {
      const l = Qr("tip");
      return r(), d("span", {
        class: K(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(D, null, ne(e.options, (i) => Je((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: K(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Oc)) : k("", !0),
          V(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Tc, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", Ic, v(i.count), 1)) : k("", !0)
        ], 10, Ec)), [
          [l, i.tip || i.title, `${L(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ft = /* @__PURE__ */ H(Bc, [["__scopeId", "data-v-c89bc92d"]]), Rc = {
  key: 0,
  class: "more-items"
}, Lc = {
  key: 0,
  role: "alert"
}, Nc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", Rc, [
      e.failure ? (r(), d("p", Lc, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), F(ve, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          V(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, yn = /* @__PURE__ */ H(Nc, [["__scopeId", "data-v-10464014"]]), qc = { class: "link-group" }, Dc = {
  class: "group-label",
  "data-link-kind": ""
}, Pc = ["disabled", "onClick"], jc = { class: "title" }, Fc = { class: "relations" }, Wc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(!1), o = A(() => s.value ? n.rows : n.rows.slice(0, 3)), l = A(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (r(), d("div", qc, [
      m("div", Dc, v(l.value), 1),
      (r(!0), d(D, null, ne(o.value, (p) => (r(), d("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", jc, v(p.endpoint.title), 1),
        m("span", Fc, [
          V(v(c(p)), 1),
          i(p) ? (r(), d(D, { key: 0 }, [
            V(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Pc))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Hc = /* @__PURE__ */ H(Wc, [["__scopeId", "data-v-be6f079c"]]), zc = ["data-loaded"], Uc = { class: "rows" }, Gc = ["disabled", "onClick"], Vc = { class: "title" }, Kc = { class: "relations" }, Yc = { key: 2 }, Qc = {
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
    const n = e, a = t, s = T([]), o = T({}), l = T(0), i = T(""), u = T(null), c = T(!1), f = T("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (_) => _.toUpperCase())}s`, b = A(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, _) => q + _, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, _]) => ({ key: q, label: y(q), count: _ }))
    ]), O = A(() => {
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
        s.value = [...new Map(M.map((C) => [`${C.endpoint.model}:${C.endpoint.id}`, C])).values()], o.value = $.value.categories ?? {}, l.value = $.value.total, u.value = $.value.next_page ?? null;
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
    const z = () => !c.value && u.value && W(u.value), P = A(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ge(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", W();
    }, { immediate: !0 }), (q, _) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: K(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), F(Ft, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: w
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", Uc, [
        e.grouped ? (r(!0), d(D, { key: 0 }, ne(O.value, (I) => (r(), F(Hc, {
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
          m("span", Vc, v(I.endpoint.title), 1),
          m("span", Kc, [
            V(v(B(I)), 1),
            S(I) ? (r(), d(D, { key: 0 }, [
              V(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Gc))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Yc, v(e.empty), 1)) : k("", !0),
        E(yn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: P.value,
          onMore: z
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, zc)) : k("", !0);
  }
}, Xc = /* @__PURE__ */ H(Qc, [["__scopeId", "data-v-3b23de37"]]), Jc = (e, t, n) => Math.max(t, Math.min(n, e)), Zc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Yl = /* @__PURE__ */ new WeakMap(), ed = (e, t) => Yl.set(e, t);
function td(e, t) {
  for (let n = t; n; n = Yl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ql(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !td(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Tt = 8, nd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = T(null), o = (g) => g ? `${g}px` : void 0, l = A(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = T({ w: 0, h: 0 }), u = T(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (g) => ({
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
    function b(g) {
      const M = h(a.anchor), C = y(M, g);
      return i.value.w <= C.across && i.value.h <= Math.max(C.below, C.above) ? M : c();
    }
    const O = A(() => {
      if (!u.value) return l.value;
      const g = u.value, M = b(g), C = y(M, g), { w: R, h: U } = i.value, Z = a.align === "auto" ? g.left + g.right > M.left + M.right : a.align === "right", ee = Jc(Z ? g.right - R : g.left, M.left + Tt, Math.max(M.left + Tt, M.right - R - Tt)), re = U > C.below && C.above > C.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, C.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, C.below) };
      return { ...l.value, ...re, left: `${ee}px`, maxWidth: p(a.maxWidth, C.across) };
    }), S = n, x = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function B(g) {
      const M = x(), C = M.indexOf(document.activeElement);
      M[(C + g + M.length) % M.length].focus();
    }
    const W = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => S("close") }, N = (g) => W[g.key] && (g.preventDefault(), W[g.key]()), w = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let z = 0;
    const P = new ResizeObserver(() => {
      cancelAnimationFrame(z), z = requestAnimationFrame(w);
    });
    Ql(s, (g) => a.anchor && !a.anchor.contains(g.target) && S("close"));
    const q = (g, M) => ["top", "left", "right", "bottom"].some((C) => Math.abs(g[C] - M[C]) > 1), _ = (g) => g.bottom < 0 || g.top > window.innerHeight;
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
      a.anchor && s.value && ed(s.value, a.anchor), w(), s.value && P.observe(s.value), !a.plain && x()[0] && x()[0].focus(), $();
    }), Be(() => {
      P.disconnect(), cancelAnimationFrame(I), cancelAnimationFrame(z);
    }), t({ element: s }), (g, M) => (r(), F(fa, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", Pe({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: N
      }), [
        he(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ma = /* @__PURE__ */ H(nd, [["__scopeId", "data-v-3d203970"]]), ad = { class: "split-button" }, sd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = T(null), s = T(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", ad, [
      E(ve, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: j(() => [
          he(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        E(ve, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: j(() => [
            E(le, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), F(ma, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: j(() => [
          he(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, od = /* @__PURE__ */ H(sd, [["__scopeId", "data-v-c258494d"]]), ld = 0, id = "/api/lines", rd = "/api/line", Ao = 5e3, Eo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Oo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ea = (e) => JSON.stringify(e.line), To = () => new DOMException("cancelled", "AbortError");
class ud {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ea(t))) {
        Ae.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), ld));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(To())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(To()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ae.sent(id, Eo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Oo(i.body, st)), Ao);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ae.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, st), Date.now() - n < Ao ? this.slow.delete(Ea(t.body)) : this.slow.add(Ea(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ae.sent(rd, Eo(t.body, t.signal), [Oo(t.body, n)], n === st ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Xl = new ud(), cd = "/api/window";
function dd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${cd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ae.whenFree(async () => {
    const f = await Ae.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: st }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ae.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const Jl = /* @__PURE__ */ new Map();
class fd {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Xe({ buttons: [], missing: {} }), this.loading = Xe(!1), this.loaded = Xe(!1), this.failed = Xe(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Ae.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function qS(e, t) {
  const n = new fd(e, t);
  return Jl.set(e, n), n.load().catch(() => {
  }), n;
}
const Ps = (e) => Jl.get(e);
function hd(e, t, n) {
  const a = Ps(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function md(e, t) {
  if (!e) return !0;
  const n = Ps(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Xn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Zl = {};
async function DS(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Zl = (await t.json()).states);
}
const js = (e, t) => {
  var n;
  return (n = Zl[e]) == null ? void 0 : n[t];
}, un = (e, t) => {
  var n;
  return ((n = js(e, t)) == null ? void 0 : n.label) ?? Xn(t);
}, ei = (e, t) => {
  var n;
  return ((n = js(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, pd = (e, t) => {
  var n;
  return ((n = js(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, gd = Symbol("pane-page"), Fs = Symbol("inspector-host"), ti = { 1: "refused", 2: "usage", 3: "fault" }, vd = 100, yd = 50, bd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, kd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function wd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = T({}), declared: c = [], page: f = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: O = {}, search: S = {}, readOnly: x = !1, shared: B = null }) {
  const W = /* @__PURE__ */ new Map(), N = (Z, ee) => l.follow(e, Z, (pe) => {
    W.clear(), ee(pe);
  }, a), w = new AbortController(), z = T(!1), P = performance.now();
  let q = 0, _ = 0, I = () => {
  };
  const $ = new Promise((Z) => I = Z);
  w.signal.addEventListener("abort", I, { once: !0 });
  const g = () => {
    clearTimeout(_), _ = setTimeout(() => {
      q === 0 && Rs(P, () => {
        z.value = !0, I();
      });
    }, yd);
  }, M = (Z, ee) => (q += 1, Lt(e, Z, t, w.signal, ee).finally(() => {
    q -= 1, g();
  })), C = (Z, ee) => (g(), $.then(() => w.signal.aborted ? rt : Lt(e, Z, t, w.signal, ee))), R = ({ only: Z = [], state: ee = {} } = {}) => (q += 1, xd(() => dd(e, t, Z, ee, w.signal), w.signal).finally(() => {
    q -= 1, g();
  })), U = (Z, { unbatched: ee = !1, deferred: pe = !1 } = {}) => {
    const re = W.get(Z);
    if (re && performance.now() - re.at < vd) return re.answer;
    const we = pe && !z.value ? C(Z, ee) : M(Z, ee);
    return W.set(Z, { answer: we, at: performance.now() }), we;
  };
  return {
    answered: z,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: A(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: O,
    search: S,
    readOnly: x,
    shared: B,
    read: U,
    readKeys: R,
    waitForServer: () => Ns() ? Gl() : null,
    run: (Z) => Lt(e, Z, t, w.signal),
    upload: (Z) => Md(Z, e, w.signal),
    cancel: () => w.abort(),
    signal: w.signal,
    subscriptions: l,
    follow: (Z, ee) => N([Z].flat().filter((pe) => o.some((re) => Ds(re, pe))), ee),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: N,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (Z) => A(() => {
      var ee;
      return u.value[Z] ?? ((ee = c.find((pe) => pe.key === Z)) == null ? void 0 : ee.default);
    }),
    setting: async (Z, ee) => {
      const pe = await U(`window setting ${e} ${Z}`);
      return pe.ok ? pe.value.value : ee;
    },
    setOption: h,
    keep: (Z, ee) => Lt(e, ["window", "save-setting", e, Z, JSON.stringify(ee)], t, w.signal)
  };
}
function ni(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const rt = { ok: !1, failure: "cancelled", error: "" }, Ws = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ai(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? rt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: ti[n.code] || "fault", error: ni(n.error) };
  } catch {
    return t != null && t.aborted ? rt : { ok: !1, failure: "unreachable", error: Ws };
  }
}
const $d = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: ti[e.code] || "fault", error: ni(e.error) };
async function xd(e, t) {
  try {
    const n = await e();
    return t.aborted ? rt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, $d(s)])) } };
  } catch {
    return t.aborted ? rt : { ok: !1, failure: "unreachable", error: Ws };
  }
}
async function si(e, t, n) {
  const a = await ai(() => Xl.read(e, t, n), t);
  return a.failure !== "unreachable" || !Ns() ? a : (await Gl(), t.aborted ? rt : si(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ae.held(() => Sd(e, t, n, a, s), Ae.knownRead(Array.isArray(t) ? t : Hs(t)));
}
async function Sd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Hs(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (l, i) => si({ ...o, attribution: i }, l, s), a, o).catch(() => rt) : ai(() => Xl.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Md(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? rt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? rt : { ok: !1, failure: "unreachable", error: Ws };
  }
}
function Hs(e) {
  return [...e.matchAll(bd)].map(([t]) => t.replace(kd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const _d = (e) => `show-${e}`, PS = (e, t, n) => e.filter((a) => {
  var s;
  return n(_d((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), oi = "messages.chat", Cd = {
  key: 0,
  class: "template-brief"
}, Ad = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Ed = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T([]), o = T(""), l = A(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = A(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Lt(oi, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === f);
      h && a("pick", String(h.id));
    }
    return u(), (c, f) => (r(), d(D, null, [
      E(Ft, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Cd, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", Ad, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Od = /* @__PURE__ */ H(Ed, [["__scopeId", "data-v-14be8a5c"]]), Td = { class: "info-tip" }, Id = ["aria-label"], Bd = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Rd = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Td, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        E(le, {
          name: "info",
          size: 13
        })
      ], 8, Id),
      m("span", Bd, [
        (r(!0), d(D, null, ne(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, li = /* @__PURE__ */ H(Rd, [["__scopeId", "data-v-a2fe5ff1"]]), Ld = { class: "form-field" }, Nd = { class: "form-field-head" }, qd = ["for"], Dd = {
  key: 1,
  class: "form-field-aside"
}, Pd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Ld, [
      m("div", Nd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, qd),
        e.help ? (r(), F(li, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", Dd, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, jd = /* @__PURE__ */ H(Pd, [["__scopeId", "data-v-302c40bf"]]), hs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Fd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = da(), n = A(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((r(), d("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [L(hs), L(t).value]
    ]);
  }
}), Wd = /* @__PURE__ */ H(Fd, [["__scopeId", "data-v-e130a5b9"]]), Hd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Is(), o = A(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (r(), F(jd, {
      label: e.field.label,
      for: L(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        E(Gt, { value: o.value }, {
          choice: j(() => [
            E(Ft, {
              id: L(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            E(Od, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            E(Wd, {
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
}, pa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), F(ve, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        E(le, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function zd(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Ud = (e, t = () => !0) => zd("keydown", (n) => n.key === "Escape" && t() && e());
function ii(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = T(!1), s = A(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Ud(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Gd = 80, It = zt([]);
function ri(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return ge(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), A(() => Gd + Math.max(0, It.indexOf(t)));
}
let ui = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ui = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Vd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Kd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Vd)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : ui, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Yd = ["aria-modal", "aria-label", "aria-labelledby"], Qd = {
  key: 0,
  class: "dialog-head"
}, Xd = ["id", "tabindex"], Jd = {
  key: 1,
  class: "dialog-foot"
}, Zd = 500, ef = 400, tf = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ii(a, n), i = ri(s), u = T(null), c = T(null), f = T(null), h = Is(), p = T(!1), y = Date.now();
    n.modal && Kd(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, ef);
    }
    function O(B) {
      !n.modal || Date.now() - y >= Zd || ![" ", "Enter"].includes(B.key) || (B.preventDefault(), B.stopPropagation());
    }
    const S = () => u.value && (u.value.scrollTop = u.value.scrollHeight), x = new MutationObserver(S);
    return ge(u, (B) => {
      x.disconnect(), B && n.follow && (x.observe(B, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Be(() => x.disconnect()), (B, W) => (r(), F(fa, { to: "body" }, [
      E(Ut, {
        name: "dialog",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
          L(s) ? (r(), d("div", {
            key: 0,
            class: K(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: L(i) }),
            onClick: Se(b, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: K(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? L(h) : void 0,
              onKeydownCapture: O
            }, [
              e.bare ? k("", !0) : (r(), d("header", Qd, [
                m("h3", {
                  id: L(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Xd),
                e.closable ? (r(), F(pa, {
                  key: 0,
                  onClick: L(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: u,
                class: K(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                he(B.$slots, "default", {}, void 0, !0)
              ], 2),
              B.$slots.foot ? (r(), d("footer", Jd, [
                he(B.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Yd)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ga = /* @__PURE__ */ H(tf, [["__scopeId", "data-v-24a11f8a"]]), nf = {
  class: "action-output",
  "data-action-output": ""
}, af = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(ga, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        m("pre", nf, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, sf = /* @__PURE__ */ H(af, [["__scopeId", "data-v-b32f94a4"]]);
function of(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Xr(sf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const lf = (e, t, n = {}) => Hs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function bn(e, t, n, a = {}) {
  var s;
  try {
    if (!await md(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(oi, lf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && of(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const rf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Oa = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], ke = (e, t, n, a = {}) => ({
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
}), va = {
  messages: ke("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: ke("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: ke("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: Oa
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Oa
  }),
  reports: ke("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: ke("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: ke("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: ke("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: ke("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: ke("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: Oa }),
  reactions: ke("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: ke("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: ke("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: ke("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: ke("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: ke("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: ke("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: ke("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: ke("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: ke("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: ke("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: ke("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: ke("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: ke("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: ke("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: ke("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: ke("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, uf = ["secrets", "plugins"], ci = Object.keys(va).filter((e) => !(jl && uf.includes(e)));
A(() => ci.map((e) => ({ name: e, ...va[e] })));
const Vt = (e) => va[e], di = new Map(ci.flatMap((e) => [e, e.replace(/s$/, ""), va[e].title.toLowerCase()].map((t) => [t, e]))), gt = (e) => di.get(String(e).toLowerCase()) || "", fi = [...di.keys()].sort((e, t) => t.length - e.length).join("|"), cf = {
  class: "button-form",
  "data-button-form": ""
}, df = {
  key: 0,
  class: "button-form-title"
}, ff = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, hf = { class: "button-form-actions" }, mf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = T(!1), l = T(""), i = A(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = A(() => {
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
    return (f, h) => (r(), F(ga, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: j(() => {
        var p;
        return [
          m("div", cf, [
            (p = e.row) != null && p.title ? (r(), d("p", df, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(D, null, ne(e.button.fields, (y) => (r(), F(Hd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", ff, v(l.value), 1)) : k("", !0),
            m("div", hf, [
              E(ve, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: j(() => [...h[2] || (h[2] = [
                  V("Cancel", -1)
                ])]),
                _: 1
              }),
              E(ve, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: j(() => [...h[3] || (h[3] = [
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
}, pf = /* @__PURE__ */ H(mf, [["__scopeId", "data-v-e3f0d786"]]), gf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, vf = {
  key: 1,
  class: "menu-item-text"
}, yf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: K(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", gf, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", vf, [
        m("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ze = /* @__PURE__ */ H(yf, [["__scopeId", "data-v-fec99974"]]), bf = ["aria-busy"], kf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, wf = { class: "button-slot-confirm-text" }, $f = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, xf = {
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
    const n = e, a = t, s = A(() => Ps(n.environment)), o = A(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = A(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = A(() => n.readOnly ? [] : hd(n.environment, n.name, n.row)), c = T(null), f = T(null), h = T(""), p = T(!1), y = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), b = (x) => x.icon || (x.warning ? "dot" : "");
    function O(x) {
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
        E(ve, {
          small: "",
          onClick: i
        }, {
          default: j(() => [...B[4] || (B[4] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", kf, [
        m("span", wf, v(f.value.confirm), 1),
        E(ve, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: K({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: B[0] || (B[0] = (W) => S(f.value))
        }, {
          default: j(() => [
            V(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        E(ve, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: B[1] || (B[1] = (W) => f.value = null)
        }, {
          default: j(() => [...B[6] || (B[6] = [
            V("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(D, { key: 2 }, [
        (r(!0), d(D, null, ne(u.value, (W) => (r(), d(D, {
          key: W.name
        }, [
          W.menu.length ? (r(), F(od, {
            key: 0,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": W.menu_label || "More ways",
            title: y(W),
            "data-button": W.name,
            onMain: (N) => O(W)
          }, {
            menu: j(({ close: N }) => [
              (r(!0), d(D, null, ne(W.menu, (w) => (r(), F(ze, {
                key: w.label,
                description: w.description,
                onClick: (z) => (N(), O({ ...W, ...w, menu: [] }))
              }, {
                default: j(() => [
                  V(v(w.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              V(v(W.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), F(ve, {
            key: 1,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            bordered: !W.primary,
            class: K({ danger: W.danger }),
            icon: b(W),
            disabled: p.value,
            title: y(W),
            "data-button": W.name,
            onClick: (N) => O(W)
          }, {
            default: j(() => [
              V(v(W.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (r(), d("span", $f, v(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), F(pf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: B[2] || (B[2] = (W) => c.value = null),
          onDone: B[3] || (B[3] = (W) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, bf));
  }
}, zs = /* @__PURE__ */ H(xf, [["__scopeId", "data-v-a4b6f174"]]), Sf = {
  class: "running",
  "data-running-command": ""
}, Mf = ["title"], _f = {
  key: "idle",
  class: "running-idle"
}, Cf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Sf, [
      E(Ut, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Mf)) : (r(), d("span", _f, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, jS = /* @__PURE__ */ H(Cf, [["__scopeId", "data-v-d3240219"]]), Af = ["aria-checked", "aria-label", "title"], Ef = {
  key: 0,
  class: "switch-inner"
}, Of = {
  key: 0,
  class: "switch-word"
}, Tf = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: K(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: K(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", Ef, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", Of, v(e.word), 1)) : k("", !0)
    ], 10, Af));
  }
}, FS = /* @__PURE__ */ H(Tf, [["__scopeId", "data-v-a4c6c503"]]);
function hi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Jn(e, t) {
  return hi(() => localStorage, e, t);
}
function mi(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Us(e, t) {
  return mi(() => localStorage, e, t);
}
function pi(e, t) {
  ge(t, (n) => Us(e, n), { deep: !0 });
}
function If(e, t) {
  return hi(() => sessionStorage, e, t);
}
function Bf(e, t) {
  return mi(() => sessionStorage, e, t);
}
const Zn = "journal.environment", gi = T(If(Zn, Jn(Zn, "")));
function Rf(e) {
  gi.value = e, Bf(Zn, e), Us(Zn, e);
}
const ea = T(location.hash), Io = Xe(null), Bo = { integrations: "mcp", library: "team" };
function Lf() {
  if (!Io.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Bo[n]) {
    location.replace(`#/${[Bo[n], ...a].join("/")}${t ? `?${t}` : ""}`), ea.value = location.hash;
    return;
  }
  !n || Io.value(n) || (Rf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ea.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ea.value = location.hash, Lf();
});
const ms = A(() => {
  const [e, t = ""] = ea.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", h = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(h) || 0, env: u };
  });
  return {
    env: gi.value,
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
}), Gs = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Gs.page(e)}?open=${t}`
};
function Nf(e = "", t = 0, n = "") {
  location.hash = Gs.page(e, t, n);
}
function qf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Df = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function vi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Df).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function WS(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function yt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = ms.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  vi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Pf(e, t, n, a = 0, s = "") {
  if (e === ms.value.env) return yt(t, n, a, s);
  const o = ms.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  vi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function De(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Pf(a, s, Number(o), 0, t) : yt(s, Number(o), 0, t);
}
function jf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = jf(e);
  t && De(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function HS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Ff = { class: "inspector-part" }, Wf = { class: "inspector-part-title" }, Hf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", Ff, [
      m("h4", Wf, v(e.title), 1),
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, zS = /* @__PURE__ */ H(Hf, [["__scopeId", "data-v-5175e4a3"]]), Ro = /* @__PURE__ */ new Map(), zf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = T(null), a = T(!1), s = T(t.name && Ro.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Ro.set(t.name, u);
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
        he(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = Se((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, yi = /* @__PURE__ */ H(zf, [["__scopeId", "data-v-4d2235ba"]]), Uf = ["aria-valuenow", "aria-valuemax"], Gf = {
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
    const t = e, n = A(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
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
    ], 10, Uf));
  }
}, bi = /* @__PURE__ */ H(Gf, [["__scopeId", "data-v-9eba6a85"]]), Vf = { processes: "process", memories: "memory", replies: "reply" }, ta = (e) => (Vf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), ps = [], Kf = 2e3, ht = /* @__PURE__ */ new Map(), Yf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Qf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? ps.unshift(e) : ps.push(e), ht.clear();
}
function ki(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Xf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Jf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function it(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Zf(e, t) {
  const n = [{ type: "text", text: it(e).replace(/\r\n/g, `
`) }];
  for (const a of ps)
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
  return eh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function eh(e) {
  return e.split(Qf).map((t, n) => n % 2 ? t : t.replace(Yf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Lo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const th = 24;
function nh(e) {
  const [t, , ...n] = e, a = Lo(t), s = n.map(Lo), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > th) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${cn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${cn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const wi = /^\s*(?:[-*+]|\d+[.)])\s+/, gs = /^\s*(\d+)[.)]\s/, No = (e) => e.match(/^\s*/)[0].length;
function $i(e) {
  const t = e[0].match(gs), n = No(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && No(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${cn(o.text)}${o.nested.length ? $i(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function ah(e, t) {
  const n = gs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (wi.test(e[s]) && gs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const qo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function xi(e) {
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
    if (qo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(nh(t.slice(a, i))), a = i;
      continue;
    }
    if (wi.test(s)) {
      const i = ah(t, a);
      n.push($i(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${xi(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !qo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${cn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const sh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, oh = (e) => e.type !== "text" && !sh.test(e.html);
function lh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(xi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : oh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Vs(e, t = { env: "" }) {
  const n = Jf(e, t), a = ht.get(n);
  if (ht.delete(n), a && a.source === t.source && a.reads.every((l) => Xf(l, t)))
    return ht.set(n, a), a.html;
  const s = [], o = lh(Zf(e, { ...t, reads: s }));
  return ht.set(n, { html: o, reads: s, source: t.source }), ht.size > Kf && ht.delete(ht.keys().next().value), o;
}
const Ta = /* @__PURE__ */ new WeakMap();
function ih(e) {
  if (Ta.has(e)) return Ta.get(e);
  const t = Jr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const h = s(c, f), p = e.read(`${ta(c)} show ${f}`);
    n.set(h, p), p.then((y) => {
      n.get(h) === p && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${ta(c).replace(/-/g, "_")}.*`], (f) => {
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
  return Ta.set(e, u), u;
}
function Si() {
  const e = Me(Ne, null), t = e ? ih(e) : null;
  return (n, a = {}) => Vs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Mi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, kn = (e) => String(e || "").replace(Mi, (t, n, a, s) => s), rh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Bn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, uh = /^Traceback \(most recent call last\):/m, ch = 8;
function _i(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ch).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function dh(e) {
  const t = [...e.matchAll(rh)].map((a) => a.index);
  if (Bn.lastIndex = 0, !t.length || !Bn.test(e)) return null;
  Bn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Bn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: _i(n), tail: "" } : null;
}
function fh(e) {
  const t = uh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: _i([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = kn(e), n = fh(t) || dh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const na = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ci = (e) => `${e.table}:${e.id}`, vs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ia = 80;
function Do(e) {
  return e.length <= Ia ? e : `${e.slice(0, Ia + 1).replace(/\s+\S*$/, "") || e.slice(0, Ia)}…`;
}
const Po = {
  messages: (e) => Do(vs(e.text)),
  comments: (e) => Do(vs(e.text)),
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
}, hh = (e) => (Po[e.table] ? Po[e.table](e) : e.title || "") || "", Ct = (e) => na(e.created_at), mh = (e) => na(e.updated_at) || Ct(e), ph = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, gh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function vh(e) {
  const t = ph.exec(e);
  if (t && gt(t[1])) return { at: t.index, length: t[0].length, table: gt(t[1]), id: Number(t[2]), label: t[3] };
  const n = gh.exec(e), a = n && gt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function yh(e, t, n, a) {
  const s = ki(a, e, t), o = kn(s ? hh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${it(Vt(e).title)} ${t}</span><span class="row-card-title">${it(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = vh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: yh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const bh = /\.(png|jpe?g|gif|webp|svg)$/i, kh = (e) => bh.test(e), wh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, $h = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function xh(e, t) {
  const n = wh.exec(e), [, a, s, o, l, i] = n || [], u = n && gt(a || o), c = u && ki(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Vt(u).title} ${c.id} · ${it(i)}`, p = kh(i) ? `<img class="file-card-image" src="${f}" alt="${it(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${it(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function Sh(e) {
  const t = $h.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${it(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = xh(e, t) || Sh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Mh = /`([^`\n]+)`/g;
Et((e) => e.replace(Mh, (t, n) => `<code>${n}</code>`));
const jo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Gs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(Mi, (n, a, s, o) => jo[a] ? jo[a](s, o, t) : o)
);
const _h = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ai = new RegExp(`\\b(${fi}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Ei = new RegExp(`\\b(${fi}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Ch = new RegExp(`<code>((?:${Ai.source}|${Ei.source}))</code>`, "gi"), Ah = (e) => e.replace(Ch, "$1"), Eh = (e, t) => `<a class="row-pill" href="#" data-peek="${gt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Oh = (e) => e.replace(Ei, (t, n, a) => a.replace(/\d+/g, (s) => Eh(n.replace(/s$/i, ""), s))), Th = (e) => Oh(e).replace(
  Ai,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${gt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Ah(e).split(_h).map((n, a) => a % 2 ? n : Th(n)).join("")
);
const Ih = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Bh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Rh = /[\w\]]\(/, Lh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Nh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, qh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Dh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Ph = /[[({,]$/, jh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Fh = /^(\t|\s{2,})\S/, Wh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Hh = /`[^`]+`/, zh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Uh = /[{}()[\];=<>$&|*\\@+^~%]/g, Oi = /^\s*(?:[-*+]|\d+[.)])\s/, Gh = /^\s*>/, Vh = /^\s*\|/, Kh = 0.6, Yh = 0.4, Qh = 5, Xh = 0.03, Ti = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Qh && t.every((n) => zh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Uh) ?? []).length / e.length < Xh;
}, Ba = (e) => {
  const t = e.trim();
  return Hh.test(t) ? !1 : [Ih, Bh, Rh, Lh, Nh, qh, Dh, Ph, jh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Fh.test(e) && !Oi.test(e) && !Ti(e);
};
function Jh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Oi.test(t[0]) || t.every((o) => Gh.test(o) || Vh.test(o))) return "text";
  const n = t.filter((o) => !Wh.test(o.trim()));
  if (t.length === 1) return !n.length || Ba(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ba).length, s = n.filter((o) => !Ba(o) && Ti(o)).length;
  return a >= n.length * Kh && s <= n.length * Yh ? "code" : "text";
}
const ys = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Zh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", em = `${ys} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, tm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", nm = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Fo = {
  js: { keywords: ys, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Zh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: em, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ys, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: tm, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: nm, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, am = {
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
function Wo(e, t, n) {
  return n && e.startsWith(n, t);
}
function sm(e, t) {
  const n = Fo[am[t] ?? t] || Fo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Wo(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Wo(e, o, n.block[0])) {
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
function om(e, t) {
  const n = [""];
  for (const { type: a, value: s } of sm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? it(l) : `<span class="tok-${a}">${it(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function lm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const im = 1500, Ho = /* @__PURE__ */ new WeakMap();
async function rm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await lm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ho.get(t)), Ho.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, im)
  )));
}
typeof document < "u" && document.addEventListener("click", rm, !0);
const um = /\n\s*\n/, cm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, dm = /^\s*(`{3,}|~{3,})\s*$/, fm = /^\s{4,}\S/, hm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, bs = /^\s*(?:[-*+]|\d+[.)])\s/, Ii = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, mm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ks(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function pm(e) {
  const t = Ks(e.join(`
`));
  return (mm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const gm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ii.test(t) && !bs.test(t);
}, vm = (e, t) => bs.test(t) || bs.test([...e].reverse().find((n) => n.trim()) || "");
function Ys(e, t) {
  const n = t || pm(e), a = om(Ks(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function ym(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && dm.test(s));
  return a < 0 ? e.length : a;
}
function bm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Ys(a.map(kn), n ? n.toLowerCase() : "");
}
function km(e) {
  const t = e.split(um).map((l) => ({ paragraph: l, type: Jh(Ks(l).split(`
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
      s(), n.push(Ys(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(kn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function wm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : km(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(cm);
    if (i) {
      const c = ym(n, l, i[2]);
      o(), a.push(bm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = gm(s) ? hm : fm;
    if (!t && u.test(n[l]) && !vm(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Ii.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(Ys([...f, ...n.slice(l, c)].map(kn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => wm(e, t.document), { first: !0 });
const $m = ["innerHTML"], xm = ["innerHTML"], Sm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Si(), a = A(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, $m)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, xm));
  }
}, ot = /* @__PURE__ */ H(Sm, [["__scopeId", "data-v-d8e75741"]]), US = (e) => [...new Set(e.agents.map((t) => t.name))], Ra = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, Mm = "main agent", Qs = (e, t) => t ? Mm : e, _m = ["data-agent-main"], Cm = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Am = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Em = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = A(() => Qs(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: K(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Cm, [...s[0] || (s[0] = [
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
      e.iconOnly ? k("", !0) : (r(), d("span", Am, v(n.value), 1))
    ], 10, _m));
  }
}, Dt = /* @__PURE__ */ H(Em, [["__scopeId", "data-v-a4c3d1e5"]]), Om = ["aria-expanded"], Tm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Im = {
  key: 0,
  class: "tip-failure"
}, Bm = { key: 1 }, Rm = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(Ne, null), a = A(() => pd(t.type, t.state)), s = T(!1), o = T([]), l = T("");
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
      s.value ? (r(), d("span", Tm, [
        l.value ? (r(), d("span", Im, v(l.value), 1)) : k("", !0),
        (r(!0), d(D, null, ne(o.value, (p) => (r(), d("span", {
          key: p,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : k("", !0)
    ], 40, Om)) : (r(), d("span", Bm, v(L(un)(e.type, e.state)), 1));
  }
}, Lm = /* @__PURE__ */ H(Rm, [["__scopeId", "data-v-bf9353d9"]]), Nm = {
  class: "plan-details",
  "data-plan-details": ""
}, qm = { class: "state-line" }, Dm = {
  key: 0,
  class: "phase-count"
}, Pm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, jm = { class: "text" }, Fm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Wm = { class: "overall" }, Hm = { class: "overall-figure" }, zm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Um = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, Gm = {
  key: 4,
  class: "part"
}, Vm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (r(), d("div", Nm, [
      m("div", qm, [
        E(Lm, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: K(["status", L(ei)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (r(), d("span", Dm, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
      ]),
      e.plan.reason ? (r(), d("section", Pm, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", jm, v(e.plan.reason), 1)
      ])) : k("", !0),
      e.plan.total ? (r(), d("section", Fm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Wm, [
          E(bi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Hm, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : k("", !0),
      e.plan.assignee ? (r(), d("p", zm, [
        E(Dt, {
          name: e.plan.assignee.name,
          main: e.plan.assignee.main
        }, null, 8, ["name", "main"])
      ])) : e.plan.delegated ? (r(), d("p", Um, [
        L(Ra)(e.plan) ? (r(), F(Dt, {
          key: 0,
          name: L(Ra)(e.plan).name,
          main: L(Ra)(e.plan).main
        }, null, 8, ["name", "main"])) : (r(), d(D, { key: 1 }, [
          V(" Delegated ")
        ], 64))
      ])) : k("", !0),
      e.plan.brief ? (r(), d("section", Gm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        E(yi, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: j(() => [
            E(ot, {
              class: "text",
              "data-resource-text": "",
              text: e.plan.brief
            }, null, 8, ["text"])
          ]),
          _: 1
        }, 8, ["name"])
      ])) : k("", !0)
    ]));
  }
}, GS = /* @__PURE__ */ H(Vm, [["__scopeId", "data-v-d555fe18"]]), Km = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Ym = ["title", "onClick"], Qm = { class: "agent-word" }, Xm = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = A(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", Km, [
      (r(!0), d(D, null, ne(s.value, (i) => (r(), d("button", {
        key: i.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${L(Qs)(i.name, i.main)}`,
        "data-plan-phase-agent": "",
        onClick: (u) => L(De)(`agents:${i.id}`)
      }, [
        m("span", {
          class: K(["agent-dot", { held: i.held }])
        }, null, 2),
        E(Dt, {
          name: i.name,
          main: i.main
        }, null, 8, ["name", "main"]),
        m("span", Qm, v(i.held ? "Working" : "Queued"), 1)
      ], 8, Ym))), 128))
    ])) : k("", !0);
  }
}, Jm = /* @__PURE__ */ H(Xm, [["__scopeId", "data-v-18f29985"]]), Zm = { class: "phases" }, ep = { class: "phead" }, tp = { class: "mark" }, np = { class: "ptitle" }, ap = { class: "phead-end" }, sp = {
  key: 0,
  class: "checkpoint"
}, op = { class: "progress" }, lp = {
  key: 0,
  class: "when"
}, ip = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", Zm, [
      (r(!0), d(D, null, ne(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: K(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", ep, [
          m("span", tp, [
            E(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", np, v(i + 1) + ". " + v(l.title), 1),
          m("span", ap, [
            l.checkpoint ? (r(), d("span", sp, "checkpoint")) : k("", !0),
            m("span", op, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", lp, v(l.goal), 1)) : k("", !0),
        E(Jm, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(D, null, ne(l.tasks, (u) => he(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, VS = /* @__PURE__ */ H(ip, [["__scopeId", "data-v-05aaa685"]]), rp = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, up = { ...rp, done: "Completed" }, cp = /* @__PURE__ */ new Set(["completed", "cancelled"]), dp = (e) => cp.has(e), dn = (e) => dp(e) ? "done" : e, fp = { class: "task-status-icon" }, hp = ["width", "height", "aria-label"], mp = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = A(() => ei("task", dn(t.status))), a = A(() => n.value === "testing" ? "started" : n.value), s = A(() => up[t.status] ?? un("task", t.status));
    return (o, l) => (r(), d("span", fp, [
      E(Ut, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (r(), d("svg", {
            key: n.value,
            class: K(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            E(Gt, { value: a.value }, {
              blocked: j(() => [...l[0] || (l[0] = [
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
              done: j(() => [...l[1] || (l[1] = [
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
              started: j(() => [...l[2] || (l[2] = [
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
              asked: j(() => [...l[3] || (l[3] = [
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
              paused: j(() => [...l[4] || (l[4] = [
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
              planned: j(() => [...l[5] || (l[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: j(() => [...l[6] || (l[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, hp))
        ]),
        _: 1
      })
    ]));
  }
}, ya = /* @__PURE__ */ H(mp, [["__scopeId", "data-v-ae24a63f"]]), pp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, gp = {
  key: 0,
  class: "empty",
  role: "alert"
}, vp = {
  key: 2,
  class: "empty"
}, yp = { class: "day" }, bp = { class: "events" }, kp = { class: "mark" }, wp = { class: "what" }, $p = { class: "head" }, xp = { class: "word" }, Sp = ["title", "onClick"], Mp = { class: "at" }, _p = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = T(null), l = T(""), i = A(() => {
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
    return ge(() => a.id, c, { immediate: !0 }), (f, h) => (r(), d("section", pp, [
      l.value ? (r(), d("p", gp, v(l.value), 1)) : o.value === null ? (r(), F(Ke, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", vp, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(D, null, ne(i.value, (p) => (r(), d(D, {
        key: p.day
      }, [
        m("h3", yp, v(p.day), 1),
        m("ol", bp, [
          (r(!0), d(D, null, ne(p.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: K(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", kp, [
              n[y.event_type].state ? (r(), F(ya, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), F(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", wp, [
              m("div", $p, [
                m("span", xp, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, Sp),
                m("span", Mp, v(u(y.time)), 1)
              ]),
              y.text ? (r(), F(ot, {
                key: 0,
                class: "text",
                text: y.text
              }, null, 8, ["text"])) : k("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, KS = /* @__PURE__ */ H(_p, [["__scopeId", "data-v-9e511133"]]);
function Cp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Xs(e, t = Date.now()) {
  const n = Cp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Ap = 36e5;
function Ep(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Ap;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function zo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Bi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Uo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const La = (e) => String(e).padStart(2, "0");
function Ri(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${La(t % 60)}s` : `${Math.floor(t / 3600)}h ${La(Math.floor(t % 3600 / 60))}m ${La(t % 60)}s`;
}
const Op = 1e3;
function Li() {
  const e = T(Date.now()), t = setInterval(() => e.value = Date.now(), Op);
  return et(() => clearInterval(t)), e;
}
const Tp = Symbol("resource-subscriptions");
function wn(e, t, n = () => !0) {
  const a = Me(Tp, () => new Vl(), !0), s = qs(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  ha(() => {
    o(), s.cancel();
  });
}
const Ni = (e, t) => !e.row_id || t.has(e.row_id), Ip = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, YS = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Bp = "Not known", Rp = 80, Lp = 1e3, Np = "worker", qp = "main", Dp = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Pp = (e) => e.ok ? e.value.rows : [], jp = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Fp = (e, t) => (t == null ? void 0 : t.given_name) || jp((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Wp = (e, t) => e.ended_at ? "ended" : e.paused_at || Dp.has(t == null ? void 0 : t.state) ? "waiting" : "running", qi = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Hp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Lp, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ri(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Rp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Bp : `$${t.cost_dollars.toFixed(2)}` }), e.role === Np && l.push({ key: "pace", label: "Tasks an hour", value: String(Ep(qi(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === qp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function zp(e) {
  const t = qi(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Up(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", zo(e.created_at)]), e.ended_at && n.push(["Ended", zo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const Gp = { class: "band" }, Vp = { key: 0 }, Kp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", Gp, [
      E(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      he(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", Vp, v(e.count), 1)) : k("", !0)
    ]));
  }
}, Wt = /* @__PURE__ */ H(Kp, [["__scopeId", "data-v-1758914f"]]), Yp = { class: "number" }, Qp = { class: "text" }, Xp = 150, Jp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = T(!1), a = A(() => t.text.length > Xp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(D, null, [
      e.text ? (r(), d(D, { key: 0 }, [
        E(Wt, { icon: "file" }, {
          default: j(() => [
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
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (r(), d(D, { key: 1 }, [
        E(Wt, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
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
            m("span", Yp, v(i.id), 1),
            m("span", Qp, [
              V(v(i.text), 1),
              m("span", {
                class: K(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, Zp = /* @__PURE__ */ H(Jp, [["__scopeId", "data-v-c99de22c"]]), e1 = ["aria-expanded"], t1 = { class: "count" }, n1 = {
  key: 0,
  "data-agent-fold-body": ""
}, a1 = {
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
        E(le, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        V(v(e.label), 1),
        m("span", t1, v(e.count), 1),
        E(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, e1),
      t.value ? (r(), d("div", n1, [
        he(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Na = /* @__PURE__ */ H(a1, [["__scopeId", "data-v-7f93d8d9"]]), s1 = ["onClick"], o1 = { class: "text" }, l1 = { class: "aside" }, i1 = {
  key: 0,
  class: "none"
}, r1 = {
  class: "skills",
  "data-agent-skills": ""
}, u1 = {
  key: 0,
  class: "none-inline"
}, c1 = { class: "label" }, d1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = zt({ helpers: !1, skills: !1 }), a = T([]), s = T([]), o = async (i) => Pp(await t.read(i));
    ge(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ge(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Xn(i.role)} ${i.id}`;
    return (i, u) => (r(), d(D, null, [
      E(Na, {
        open: n.helpers,
        "onUpdate:open": u[0] || (u[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: j(() => [
          (r(!0), d(D, null, ne(a.value, (c) => (r(), d("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (f) => L(yt)("agents", c.id)
          }, [
            m("span", o1, v(l(c)), 1),
            m("span", l1, v(L(Xn)(c.role)) + " " + v(c.id), 1)
          ], 8, s1))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", i1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Na, {
        open: n.skills,
        "onUpdate:open": u[1] || (u[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: j(() => [
          m("p", r1, [
            (r(!0), d(D, null, ne(s.value, (c) => (r(), d("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", u1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Na, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: j(() => [
          (r(!0), d(D, null, ne(e.details, ([c, f, h]) => (r(), d("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", c1, v(c) + ":", 1),
            m("span", {
              class: K(["value", h])
            }, v(f), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, f1 = /* @__PURE__ */ H(d1, [["__scopeId", "data-v-358a0300"]]), h1 = ["datetime", "title"], Ze = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Li(), a = A(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(L(Xs)(e.at, L(n))), 9, h1));
  }
}, m1 = {
  class: "now",
  "data-agent-now": ""
}, p1 = {
  key: 1,
  class: "muted"
}, g1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, v1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, y1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, b1 = { class: "line" }, k1 = { class: "detail" }, w1 = { class: "bar" }, $1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = A(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = A(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(D, null, [
      E(Wt, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          V("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", m1, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => L(yt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", p1, v(e.nothing), 1)),
        n.value ? (r(), d("span", g1, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", v1, [
          o[3] || (o[3] = V("Seen: ", -1)),
          E(Ze, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", y1, [
        m("div", b1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => L(yt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", k1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", w1, [
          m("i", {
            style: ye({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, x1 = /* @__PURE__ */ H($1, [["__scopeId", "data-v-ff25c609"]]), S1 = ["onClick"], M1 = { class: "text" }, _1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, C1 = { class: "text" }, A1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, E1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(D, null, [
      E(Wt, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
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
          m("span", M1, v(a.text), 1),
          E(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, S1)) : (r(), d("div", _1, [
          m("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          m("span", C1, v(a.text), 1),
          E(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", A1, "Nothing yet."))
    ], 64));
  }
}, O1 = /* @__PURE__ */ H(E1, [["__scopeId", "data-v-58f0db57"]]), T1 = {
  class: "strip",
  "data-agent-strip": ""
}, I1 = ["data-agent-cell"], B1 = {
  key: 0,
  class: "meter"
}, R1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", T1, [
      (r(!0), d(D, null, ne(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: K({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", B1, [
          m("i", {
            class: K({ high: a.high }),
            style: ye({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, I1))), 128))
    ]));
  }
}, L1 = /* @__PURE__ */ H(R1, [["__scopeId", "data-v-b6657ab7"]]), N1 = {}, q1 = { class: "menu-label" };
function D1(e, t) {
  return r(), d("span", q1, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Mt = /* @__PURE__ */ H(N1, [["render", D1], ["__scopeId", "data-v-aa955b3e"]]), P1 = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, j1 = {
  key: 0,
  class: "skills-none"
}, F1 = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => n.skills.filter((l) => l.state === "loaded")), o = A(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", P1, [
      E(Mt, null, {
        default: j(() => [...i[1] || (i[1] = [
          V("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", j1, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(D, null, ne(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        E(le, {
          name: "book",
          size: 12
        }),
        V(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(D, { key: 1 }, [
        E(Mt, null, {
          default: j(() => [...i[2] || (i[2] = [
            V("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(D, null, ne(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          E(le, {
            name: "book",
            size: 12
          }),
          V(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      E(ze, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: j(() => [...i[3] || (i[3] = [
          V("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, W1 = /* @__PURE__ */ H(F1, [["__scopeId", "data-v-be514d47"]]), H1 = ["disabled", "title"], z1 = { class: "gauge usage" }, U1 = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => n.windows[0] ?? null), o = A(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = A(() => o.value !== null && o.value >= 100), i = A(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), u = A(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, f) => o.value !== null ? (r(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: u.value,
      onClick: f[0] || (f[0] = (h) => a("open", h.currentTarget))
    }, [
      E(le, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = V()),
      m("span", z1, [
        m("span", {
          style: ye({ width: `${o.value}%` })
        }, null, 4)
      ]),
      V(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, H1)) : k("", !0);
  }
}, G1 = /* @__PURE__ */ H(U1, [["__scopeId", "data-v-a36f09dc"]]), V1 = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: K(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Js = /* @__PURE__ */ H(V1, [["__scopeId", "data-v-9e7e1157"]]);
function K1(e, t, n, { groups: a, programs: s }) {
  const o = T({}), l = T(""), i = T(!1), u = A(() => !!e.value && !e.value.ended_at), c = A(() => u.value && !!e.value.paused_at);
  async function f(b, O = null) {
    l.value = "";
    const S = await Dl(O, b, t);
    return l.value = S.ok ? "" : S.error, n(), S;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, O) => f(["agent", "control", String(e.value.id), b, O.value], { target: o, fields: { value: { ...o.value, [b]: O.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
function Y1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Q1 = ["disabled", "title"], X1 = ["disabled", "title"], J1 = { class: "gauge" }, Z1 = ["disabled", "title"], eg = ["disabled"], tg = ["disabled"], ng = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, ag = ["title"], sg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, og = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, lg = { class: "gauge" }, ig = { class: "context-used" }, rg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, ug = 75, cg = {
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
    const n = e, a = t, s = K1(Ma(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ma(n, "controlGroups"), programs: Ma(n, "agentPrograms") }), o = T(null), l = T(""), i = A(() => s.groups.value.find((N) => N.key === l.value));
    function u(N, w) {
      o.value = N.currentTarget, l.value = w;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = A(() => n.skills.filter((N) => N.state === "loaded"));
    function h(N) {
      u(N, "skills"), a("skills");
    }
    const p = (N) => s.groups.value.some((w) => w.key === N), y = A(() => {
      var N;
      return s.chosen.value.model ?? ((N = O.value) == null ? void 0 : N.model) ?? "";
    }), b = A(() => {
      var N;
      return s.chosen.value.effort ?? ((N = O.value) == null ? void 0 : N.effort) ?? "";
    });
    A(() => !!n.agent && !n.agent.ended_at);
    const O = A(() => {
      var N;
      return ((N = n.usage.agents) == null ? void 0 : N.find((w) => {
        var z;
        return w.id === ((z = n.agent) == null ? void 0 : z.id);
      })) ?? null;
    }), S = A(() => {
      var N;
      return ((N = O.value) == null ? void 0 : N.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), x = (N) => `${Math.round(N / 1e3)}k`, B = A(() => {
      var N;
      return (N = O.value) != null && N.context_limit_tokens ? `${x(O.value.context_tokens ?? 0)} of ${x(O.value.context_limit_tokens)}` : "";
    }), W = A(() => {
      var N;
      return (N = O.value) != null && N.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
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
            onClick: w[0] || (w[0] = (P) => u(P, "agent"))
          }, [
            E(le, {
              name: "agents",
              size: 12
            }),
            V(" " + v(((z = e.agentPrograms.find((P) => P.name === e.agent.program)) == null ? void 0 : z.title) || e.agent.program), 1)
          ], 8, Q1),
          E(G1, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: w[1] || (w[1] = (P) => a("open", "usage", P))
          }, null, 8, ["windows", "disabled"]),
          S.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${S.value}% full: clear or compact it`,
            onClick: w[2] || (w[2] = (P) => p("context") ? u(P, "context") : a("open", "context", P.currentTarget))
          }, [
            E(le, {
              name: "gauge",
              size: 12
            }),
            w[14] || (w[14] = V()),
            m("span", J1, [
              m("span", {
                style: ye({ width: `${S.value}%` })
              }, null, 4)
            ]),
            V(" " + v(S.value) + "% ", 1)
          ], 8, X1)) : k("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: w[3] || (w[3] = (P) => p("model") ? u(P, "model") : null)
          }, [
            E(le, {
              name: "model",
              size: 12
            }),
            V(" " + v(y.value), 1)
          ], 8, Z1)) : k("", !0),
          p("effort") || e.card && b.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: w[4] || (w[4] = (P) => u(P, "effort"))
          }, [
            E(le, {
              name: "bolt",
              size: 12
            }),
            V(" " + v(b.value), 1)
          ], 8, eg)) : k("", !0),
          W.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: w[5] || (w[5] = (P) => a("open", "cost", P.currentTarget))
          }, v(W.value), 9, tg)) : k("", !0),
          e.branch ? (r(), d("span", ng, [
            E(le, {
              name: "branch",
              size: 12
            }),
            V(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 5,
            type: "button",
            class: K(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: w[6] || (w[6] = (P) => a("open", "jobs", P.currentTarget))
          }, [
            E(le, {
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
            E(le, {
              name: "book",
              size: 12
            }),
            V(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(D, { key: 7 }, [
            m("button", {
              type: "button",
              class: K(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ug }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: w[7] || (w[7] = (P) => a("open", "fitness", P.currentTarget))
            }, [
              E(le, {
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
              onClick: w[8] || (w[8] = (P) => a("open", "load", P.currentTarget))
            }, [
              E(le, {
                name: "weight",
                size: 12
              }),
              V(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: w[9] || (w[9] = (P) => u(P, "start"))
        }, [
          E(le, {
            name: "agents",
            size: 12
          }),
          w[15] || (w[15] = V(" Start an agent", -1))
        ])) : k("", !0),
        w[21] || (w[21] = m("span", { class: "space" }, null, -1)),
        L(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: L(s).failure.value
        }, v(L(s).failure.value), 9, ag)) : k("", !0),
        he(N.$slots, "default", {}, void 0, !0),
        o.value ? (r(), F(ma, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: j(() => {
            var P;
            return [
              l.value === "agent" ? (r(), d(D, { key: 0 }, [
                L(s).asking.value ? (r(), d(D, { key: 0 }, [
                  E(Mt, { "data-agent-stop-ask": "" }, {
                    default: j(() => [...w[16] || (w[16] = [
                      V("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  E(ze, {
                    "data-agent-stop-confirm": "",
                    onClick: w[10] || (w[10] = (q) => (c(), L(s).stop()))
                  }, {
                    default: j(() => [...w[17] || (w[17] = [
                      V("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  E(ze, {
                    onClick: w[11] || (w[11] = (q) => L(s).asking.value = !1)
                  }, {
                    default: j(() => [...w[18] || (w[18] = [
                      V("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), F(ze, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: w[12] || (w[12] = (q) => L(s).asking.value = !0)
                }, {
                  default: j(() => [...w[19] || (w[19] = [
                    V("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(D, { key: 1 }, [
                E(Mt, null, {
                  default: j(() => [...w[20] || (w[20] = [
                    V("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(D, null, ne(L(s).programs.value, (q) => (r(), F(ze, {
                  key: q.name,
                  "data-agent-program": q.name,
                  onClick: (_) => (c(), L(s).start(q))
                }, {
                  default: j(() => [
                    V(v(q.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), F(W1, {
                key: 2,
                skills: e.skills,
                onBrowse: w[13] || (w[13] = (q) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(D, { key: 3 }, [
                E(Mt, null, {
                  default: j(() => [
                    V(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(D, { key: 0 }, [
                  m("p", sg, v(L(Y1)(((P = O.value) == null ? void 0 : P.last_compaction) ?? null)), 1),
                  m("div", og, [
                    m("span", lg, [
                      m("span", {
                        style: ye({ width: `${S.value}%` })
                      }, null, 4)
                    ]),
                    m("span", ig, v(S.value) + "%", 1)
                  ]),
                  B.value ? (r(), d("p", rg, [
                    V(v(B.value) + " ", 1),
                    E(Js, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                (r(!0), d(D, null, ne(i.value.choices, (q) => (r(), F(ze, {
                  key: q.value,
                  "data-agent-choice": q.value,
                  onClick: (_) => (L(s).choose(i.value.key, q), c())
                }, {
                  default: j(() => [
                    V(v(q.label), 1)
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
}, dg = /* @__PURE__ */ H(cg, [["__scopeId", "data-v-dc15ff96"]]), fg = {
  class: "who",
  "data-agent-who": ""
}, hg = { class: "name" }, mg = ["data-agent-state"], pg = {
  class: "sub",
  "data-agent-started-by": ""
}, gg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", fg, [
      m("h2", hg, [
        m("i", {
          class: K(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, mg),
        V(v(e.name), 1)
      ]),
      E(dg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", pg, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, vg = /* @__PURE__ */ H(gg, [["__scopeId", "data-v-83bd4a9d"]]), yg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, bg = { class: "scroll" }, kg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, wg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, $g = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Li(), a = T(null), s = T(null), o = T(null), l = T({}), i = T({ helpers: 0, skills: 0 }), u = T(0), c = T([]), f = T([]), h = T("");
    let p = 0;
    const y = A(() => {
      var x;
      return a.value.ended_at ? zp(s.value) : `It has no task.${(x = s.value) != null && x.instruction ? " It was given an instruction." : ""}`;
    });
    async function b() {
      const x = ++p, B = await t.read(["usage", "inspector", String(t.id), "--environment", t.environment]);
      x === p && (h.value = B.ok ? "" : B.error, B.ok && (a.value = B.value.agent, s.value = B.value.facts, o.value = B.value.inspection, l.value = B.value.tool, i.value = { helpers: B.value.helpers, skills: B.value.skills }, c.value = B.value.points, f.value = B.value.programs, u.value += 1));
    }
    const O = A(() => /* @__PURE__ */ new Set([t.id])), S = {
      agent: (x) => Ni(x, O.value),
      hook_call: (x) => Ip(x, "session_agent_id", O.value)
    };
    return wn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], b, (x) => {
      var B;
      return ((B = S[x.event.split(".")[0]]) == null ? void 0 : B.call(S, x)) ?? !0;
    }), _e(b), (x, B) => {
      var W, N;
      return r(), d("article", yg, [
        m("div", bg, [
          h.value ? (r(), d("p", kg, v(h.value), 1)) : a.value && o.value ? (r(), d(D, { key: 1 }, [
            E(vg, {
              name: L(Fp)(a.value, s.value),
              state: L(Wp)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: f.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            E(L1, {
              cells: L(Hp)({ row: a.value, facts: s.value, inspection: o.value, now: L(n) })
            }, null, 8, ["cells"]),
            E(x1, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            E(Zp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((N = s.value) == null ? void 0 : N.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            E(O1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            E(f1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: u.value,
              details: L(Up)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", wg, "Ended " + v(L(Xs)(a.value.ended_at, L(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), F(Ke, { key: 2 }))
        ])
      ]);
    };
  }
}, QS = /* @__PURE__ */ H($g, [["__scopeId", "data-v-26d7ee78"]]), xg = ["aria-expanded"], Sg = { class: "drop-label" }, Mg = ["value"], _g = {
  key: 1,
  class: "drop-lead"
}, Cg = { class: "drop-item-text" }, Ag = {
  key: 2,
  class: "drop-note"
}, Eg = {
  key: 1,
  class: "drop-none"
}, Og = {
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
    const n = e, a = t, s = T(!1), o = T(null), l = T(""), i = A(() => {
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
        }, null, 8, ["name"])) : k("", !0),
        m("span", Sg, v(e.label), 1),
        E(le, {
          name: "down",
          size: 11
        })
      ], 10, xg),
      s.value ? (r(), F(ma, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (h) => s.value = !1)
      }, {
        default: j(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (h) => l.value = h.target.value)
          }, null, 40, Mg)) : k("", !0),
          (r(!0), d(D, null, ne(i.value, (h) => (r(), F(ze, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => u(h)
          }, {
            default: j(() => [
              h.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: K(["drop-dot", { live: h.running }])
              }, null, 2)) : k("", !0),
              h.lead ? (r(), d("span", _g, v(h.lead), 1)) : k("", !0),
              m("span", Cg, v(h.label), 1),
              h.note ? (r(), d("span", Ag, v(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", Eg, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Di = /* @__PURE__ */ H(Og, [["__scopeId", "data-v-29dfcce5"]]);
function Tg(e) {
  const t = T(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), et(() => n.disconnect()), t;
}
const Ig = ["data-comment-id"], Bg = {
  key: 0,
  class: "comment-top"
}, Rg = { class: "comment-mark" }, Lg = {
  class: "comment-body",
  "data-comment": ""
}, Ng = { class: "comment-foot" }, qg = {
  key: 1,
  "data-comment-lost": ""
}, Dg = {
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
      e.comment.quote ? (r(), d("div", Bg, [
        m("span", Rg, v(e.comment.number), 1),
        m("span", {
          class: K(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", Lg, v(e.comment.body), 1),
      m("div", Ng, [
        e.comment.created_at ? (r(), F(Ze, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", qg, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Ig));
  }
}, Pi = /* @__PURE__ */ H(Dg, [["__scopeId", "data-v-a37d4507"]]);
var Bl;
/Mac|iPhone|iPad/.test(((Bl = navigator.userAgentData) == null ? void 0 : Bl.platform) || navigator.platform);
function ji(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Pg = {
  class: "comment-box",
  "data-comment-box": ""
}, jg = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Fg = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Wg = { class: "comment-row" }, Hg = ["placeholder"], zg = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ jt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ jt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = ln(e, "draft"), l = T(""), i = T(!1), u = T(null), c = A(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = A(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await je(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, b) => (r(), d("div", Pg, [
      e.selection ? (r(), d("div", jg, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: K(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        E(pa, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (O) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", Fg, v(l.value), 1)) : k("", !0),
      m("div", Wg, [
        Je(m("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": b[1] || (b[1] = (O) => o.value = O),
          rows: "1",
          maxlength: "2000",
          class: K({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = _t((O) => L(ji)(O, p), ["enter"]))
        }, null, 42, Hg), [
          [Qn, o.value]
        ]),
        E(ve, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: j(() => [...b[4] || (b[4] = [
            V("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, Ug = /* @__PURE__ */ H(zg, [["__scopeId", "data-v-41d2081c"]]), Rn = (e) => e ? e.split(", ") : [];
function Gg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Vg(e, t) {
  return {
    reads: Rn(e.reads_allowed),
    runs: Rn(e.runs_allowed),
    missing: [...Rn(e.reads_missing), ...Rn(e.runs_missing)],
    ask: t
  };
}
const Kg = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Zr("SkeletonParts", !0);
      return r(!0), d(D, null, ne(e.parts, (u, c) => (r(), d(D, { key: c }, [
        (r(!0), d(D, null, ne(u.count, (f) => (r(), F(Gt, {
          key: f,
          value: u.shape
        }, {
          line: j(() => [
            E(en, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            E(en, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            E(en, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            m("div", {
              class: "skeleton-row",
              style: ye(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            m("div", {
              class: "skeleton-stack",
              style: ye(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ye(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            m("div", {
              class: "skeleton-grid",
              style: ye(s(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Yg = /* @__PURE__ */ H(Kg, [["__scopeId", "data-v-fa8baeaf"]]), Qg = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Xg = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", Qg, [
      E(Yg, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Zs = /* @__PURE__ */ H(Xg, [["__scopeId", "data-v-52f66b64"]]), Fi = {
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
}, Jg = { class: "bars" }, Zg = { class: "bar-name" }, ev = { class: "bar-value" }, tv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = A(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", Jg, [
      (r(!0), d(D, null, ne(e.items, (u, c) => (r(), F(ut(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: K(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: j(() => [
          m("span", Zg, v(u.label), 1),
          E(bi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", ev, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, nv = /* @__PURE__ */ H(tv, [["__scopeId", "data-v-663427f4"]]), av = { class: "bars" }, sv = {
  key: 0,
  class: "bars-title"
}, ov = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", av, [
      e.node.title ? (r(), d("span", sv, v(e.node.title), 1)) : k("", !0),
      E(nv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, lv = /* @__PURE__ */ H(ov, [["__scopeId", "data-v-7135bb11"]]), iv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = A(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: K([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ye(o.value)
    }, [
      (r(!0), d(D, null, ne(e.node.children || [], (u, c) => (r(), F(Wi, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Hn = /* @__PURE__ */ H(iv, [["__scopeId", "data-v-d142a3f4"]]), rv = {
  key: 0,
  class: "card-head"
}, uv = { class: "card-title" }, cv = {
  key: 0,
  class: "card-note"
}, dv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: K(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", rv, [
        m("span", uv, v(e.node.title), 1),
        e.node.note ? (r(), d("span", cv, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      E(Hn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, fv = /* @__PURE__ */ H(dv, [["__scopeId", "data-v-67b72d40"]]), hv = { class: "fact" }, mv = { class: "fact-label" }, pv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", hv, [
      m("span", mv, v(e.label), 1),
      E(ot, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, gv = /* @__PURE__ */ H(pv, [["__scopeId", "data-v-3a88ecf8"]]), vv = { class: "list" }, yv = { class: "list-label" }, bv = {
  key: 1,
  class: "list-note"
}, kv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", vv, [
      (r(!0), d(D, null, ne(e.items, (o, l) => (r(), F(ut(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: K(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", yv, v(o.label), 1),
          o.badge ? (r(), F(Js, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", bv, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, wv = /* @__PURE__ */ H(kv, [["__scopeId", "data-v-ebe2ae0a"]]), $v = { class: "table" }, xv = {
  key: 0,
  class: "table-row empty"
}, Sv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", $v, [
      m("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (r(!0), d(D, null, ne(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(D, null, ne(e.rows, (i, u) => (r(), F(ut(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: K(["table-row", i.tone, { opens: i.open }]),
        style: ye(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          (r(!0), d(D, null, ne(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", xv, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, Mv = /* @__PURE__ */ H(Sv, [["__scopeId", "data-v-9326a52e"]]), _v = { class: "stat-value" }, Cv = { class: "stat-label" }, Av = {
  key: 0,
  class: "stat-note"
}, Ev = {
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
    return (a, s) => (r(), F(ut(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: K(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        m("span", _v, v(e.value), 1),
        m("span", Cv, v(e.label), 1),
        e.note ? (r(), d("span", Av, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Ov = /* @__PURE__ */ H(Ev, [["__scopeId", "data-v-ad0db6d6"]]), Tv = { class: "code" }, Iv = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (r(), F(Gt, {
      value: e.node.type
    }, {
      stack: j(() => [
        E(Hn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        E(Hn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        E(Hn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        E(fv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        m("h3", {
          class: K(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        E(Ov, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        E(lv, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        E(Mv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        E(wv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        E(ot, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        E(gv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        E(Js, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", Tv, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Wi = /* @__PURE__ */ H(Iv, [["__scopeId", "data-v-cbdcf540"]]), Bv = { class: "dashboard" }, Rv = { class: "trail" }, Lv = ["onClick"], Nv = {
  key: 0,
  class: "gone",
  role: "status"
}, qv = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = T(!!n.page && !s(n.page)), l = T(n.page && !o.value ? [n.page] : []), i = A(() => l.value.at(-1) || n.document.start), u = A(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ge(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (r(), d("div", Bv, [
      e.document.broken ? (r(), F(rn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          V(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), F(rn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          V(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(D, { key: 2 }, [
        m("nav", Rv, [
          m("button", {
            type: "button",
            class: K(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(D, null, ne(l.value, (b, O) => (r(), d(D, {
            key: `${O}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: K(["step", { current: O === l.value.length - 1 }]),
              onClick: (S) => h(O + 1)
            }, v(c(b)), 11, Lv)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Nv, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        E(Ut, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              E(Wi, {
                node: u.value.view,
                onOpen: f,
                onFile: y[1] || (y[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, Dv = /* @__PURE__ */ H(qv, [["__scopeId", "data-v-fbe83734"]]);
function Pv(e, t) {
  const n = tt(), a = qs(e, Fi.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), et(() => {
    s(), a.cancel();
  });
}
const jv = {
  key: 0,
  class: "window-failure"
}, Fv = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = tt(), o = T(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Pv(l, n.events) : Ls(l, () => !0, Fi.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", jv, v(o.value.error), 1)) : o.value ? (r(), F(Dv, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, Wv = 1e4;
class Hv {
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
    return this.heardAt !== null && t - this.heardAt > Wv;
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
const zv = {
  key: 0,
  class: "frame-note"
}, Uv = {
  key: 0,
  class: "frame-note"
}, Gv = ["src", "title"], Vv = 1e3, Kv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = tt(), a = T(null), s = T(!1), o = T(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new Hv(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, Vv);
    }), Be(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", zv, "This window was closed because it stopped answering.")) : (r(), d(D, { key: 1 }, [
      s.value ? (r(), d("div", Uv, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        E(ve, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: j(() => [...c[1] || (c[1] = [
            V("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: L(n).window
      }, null, 8, Gv)
    ], 64));
  }
}, Yv = /* @__PURE__ */ H(Kv, [["__scopeId", "data-v-32a49046"]]), Qv = {
  class: "allowance-prompt",
  role: "dialog"
}, Xv = { class: "allowance-prompt-text" }, Jv = { class: "allowance-prompt-buttons" }, Zv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Qv, [
      m("p", Xv, v(L(Gg)(e.request)), 1),
      m("div", Jv, [
        E(ve, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            V("Allow", -1)
          ])]),
          _: 1
        }),
        E(ve, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            V("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, ey = /* @__PURE__ */ H(Zv, [["__scopeId", "data-v-cad69fe2"]]), qa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(rn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        V(v(e.reason) + " ", 1),
        e.retry ? (r(), F(ve, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            V("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), F(ve, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            V("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ty = ["data-window", "data-agent"], ny = {
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
    const n = e, a = t, s = T(""), o = T(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Me($c, null), u = wd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: A(() => n.options),
      declared: n.declared,
      page: Me(gd, null),
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
    Rl(Ne, u), ge(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), _e(u.settle), Be(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), eu((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ca(n.component), f = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), F(ey, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), F(qa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), F(qa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(D, { key: 4 }, [
        (r(), F(c, { key: o.value })),
        e.skeleton.length && !L(u).answered.value ? (r(), F(Zs, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), F(qa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, ty));
  }
}, tn = /* @__PURE__ */ H(ny, [["__scopeId", "data-v-c4443e2b"]]), Hi = {
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
    const n = e, a = t, s = { render: () => ca(Yv, { src: n.entry.entry_url }) };
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
}, ay = ["data-window"], zi = {
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
    const n = e, a = t, s = Xe(null), o = T("");
    return ge(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Fu();
          } catch (i) {
            if (Pu(i) && ju(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      E(Zs, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, ay)) : (r(), F(tn, {
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
}, sy = {
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
    const n = t, a = e, s = A(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = A(() => s.value && { render: () => ca(Fv, { line: s.value.line, events: s.value.events }) }), l = T(null), i = A(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = A(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = A(
      () => {
        var p, y;
        return l.value ? Vg(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
    return ge(
      () => {
        var p, y;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (p, y) => {
      var b, O;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), F(Zs, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((O = s.value) == null ? void 0 : O.shows) === "one-agent" && e.agent === null ? (r(), F(rn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), F(tn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), F(zi, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), F(Hi, {
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
}, oy = ["data-section"], ly = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, iy = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(Fs, null), a = A(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = A(() => ({ row: t.row }));
    return (o, l) => L(n) ? (r(!0), d(D, { key: 0 }, ne(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), F(sy, {
        key: 0,
        name: i.name,
        catalogue: L(n).catalogue,
        subscriptions: L(n).subscriptions,
        environment: L(n).environment,
        prompts: L(n).prompts,
        "shell-read": L(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", ly, v(i.name) + " is not available", 1))
    ], 8, oy))), 128)) : k("", !0);
  }
}, ks = /* @__PURE__ */ H(iy, [["__scopeId", "data-v-a47d36b7"]]), ry = { class: "rail-head" }, uy = { key: 0 }, cy = {
  key: 1,
  class: "rail-none"
}, dy = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: K(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", ry, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", uy, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(D, { key: 0 }, ne(e.comments, (a) => (r(), F(Pi, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", cy, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, fy = /* @__PURE__ */ H(dy, [["__scopeId", "data-v-4d684649"]]), hy = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, my = ["aria-pressed"], py = ["aria-pressed"], gy = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, vy = {
  key: 0,
  role: "alert"
}, yy = {
  key: 1,
  class: "sidebar-none"
}, by = ["data-question-id"], ky = { class: "question-state" }, wy = ["data-question-show", "onClick"], $y = {
  key: 0,
  class: "sidebar-none"
}, xy = {
  key: 1,
  class: "question-answer"
}, Sy = {
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
    const t = Me(Fs, null);
    return (n, a) => (r(), d("div", {
      class: K(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", hy, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, my),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, py)
      ]),
      e.mode === "comments" ? (r(), d(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), F(fy, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        E(yn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", gy, [
        e.failure ? (r(), d("p", vy, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", yy, "No questions about this text yet.")),
        (r(!0), d(D, null, ne(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: K(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", ky, v(L(un)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, wy),
            s.quote ? (r(), d(D, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", $y, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", xy, "Answered: " + v(s.answer), 1)) : k("", !0),
            E(ks, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            E(zs, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = L(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, by);
        }), 128))
      ]))
    ], 2));
  }
}, Go = /* @__PURE__ */ H(Sy, [["__scopeId", "data-v-660e5c85"]]), My = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, _y = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = zt({ abstract: n.row.abstract, body: n.row.body }), o = T("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), F(ga, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: j(() => [
        m("span", My, v(o.value), 1),
        E(ve, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: j(() => [...u[6] || (u[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        E(ve, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: j(() => [...u[7] || (u[7] = [
            V("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: j(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: Se(l, ["prevent"])
        }, [
          m("label", null, [
            u[4] || (u[4] = m("span", null, "Abstract", -1)),
            Je(m("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Qn, s.abstract]
            ])
          ]),
          m("label", null, [
            u[5] || (u[5] = m("span", null, "Text", -1)),
            Je(m("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Qn, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Cy = /* @__PURE__ */ H(_y, [["__scopeId", "data-v-464d77a8"]]);
function Ui(e, t) {
  const n = T([]), a = T(!1), s = T(null), o = T(0), l = T(!1), i = T("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: O, id: S, title: x } = e(), B = `On ${O} ${S}, ${x}: `;
    return b.text.startsWith(B) ? b.text.slice(B.length) : b.text;
  };
  async function h(b = 1) {
    const { term: O, id: S } = e();
    if (!S) return;
    const x = ++c;
    l.value = !0, i.value = "";
    try {
      const B = await t([O, "comments", String(S), "--page", String(b), "--page-size", "25"]);
      if (x !== c) return;
      if (!B.ok) {
        i.value = B.error;
        return;
      }
      const W = B.value.rows ?? [], N = b === 1 ? W : [...n.value, ...W];
      n.value = [...new Map(N.map((w) => [w.id, w])).values()], o.value = B.value.total ?? n.value.length, s.value = B.value.next_page ?? null;
    } catch (B) {
      x === c && (i.value = B.message);
    } finally {
      x === c && (l.value = !1);
    }
  }
  async function p(b) {
    var w;
    const { term: O, id: S } = e(), x = `${O}:${S}`, B = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, B], o.value++, a.value = !0;
    const W = await t([O, "comment", String(S), b]);
    if (x !== `${e().term}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((z) => z.id !== B.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await h();
    const N = (w = W.value) == null ? void 0 : w.id;
    N && !n.value.some((z) => z.id === N) && (n.value = [...n.value, { ...B, id: N }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return ge(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function Ay(e, t) {
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
const Ey = {
  class: "document-tab",
  "data-document-revisions": ""
}, Oy = ["datetime"], Ty = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Iy = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, By = {
  key: 2,
  class: "document-none"
}, Ry = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(null), o = T(""), l = A(() => s.value ? Ay(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", Ey, [
      e.editing ? (r(), F(ve, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (h) => a("close-revision"))
      }, {
        default: j(() => [...f[1] || (f[1] = [
          V("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(D, { key: 1 }, [
        (r(!0), d(D, null, ne(e.revisions, (h) => (r(), F(ve, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: j(() => [
            V("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, Oy)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", Ty, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(D, { key: 1 }, [
          E(ve, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: j(() => [...f[2] || (f[2] = [
              V("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", Iy, [
            (r(!0), d(D, null, ne(l.value, (h) => (r(), d("div", {
              key: h.key,
              class: K(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", By, "No revisions"))
    ]));
  }
}, Ly = /* @__PURE__ */ H(Ry, [["__scopeId", "data-v-3a381aa4"]]), Ny = "button, [data-comment-number]", qy = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Gi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Ny) || n.push(t.currentNode);
  return n;
}
function Vo(e, t, n) {
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
const Dy = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function Py(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Gi(e), s = a.map((c) => c.data).join(""), o = Vo(a, n.startContainer, n.startOffset), l = s.slice(o, Vo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: Dy(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function jy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function Fy(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Da(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function Wy({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function Hy(e, t) {
  const n = Gi(e), a = jy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = Fy(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(Wy).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Da(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Da(t.number, t.id, t.label)) : l.at(-1).append(Da(t.number, t.id, t.label))), !0;
}
function zy(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !Hy(e, a) && a.id && n.push(a.id);
  return n;
}
const Uy = (e) => e.closest(qy) ?? e;
function Ko(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Gy = {
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
    const a = e, s = n, o = T(null), l = T(null), i = T(null), u = T(!1), c = T(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const O = a.comments.filter((W) => W.quote).map((W) => ({ ...W, label: a.annotationLabel, hot: W.id === a.hot })), S = zy(l.value, a.pending ? [...O, { ...a.pending, pending: !0 }] : O);
      s("lost", S);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const B = document.createElement("div");
      B.className = "inline-comment", Uy(x).after(B), c.value = B;
    }
    function h() {
      if (!l.value) return;
      const O = Py(l.value);
      if (u.value = !!O, !O) {
        i.value = null;
        return;
      }
      const S = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(S.left - x.left, 0)}px`, top: `${S.top - x.top + o.value.scrollTop}px` }, s("select", O);
    }
    function p(O) {
      const S = O.target.closest("[data-comment-number]");
      S ? s("number", Number(S.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(O) {
      var S;
      (S = l.value.querySelector(`[data-comment="${O}"]`)) == null || S.scrollIntoView({ block: "center" });
    }
    function b(O) {
      var S;
      (S = l.value.querySelectorAll("h3, h4, h5, h6")[O]) == null || S.scrollIntoView({ block: "start" });
    }
    return ge(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), _e(() => {
      f(), document.addEventListener("selectionchange", h);
    }), et(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: je }), (O, S) => (r(), d("div", {
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
        E(le, {
          name: "chat",
          size: 13
        }),
        S[2] || (S[2] = V("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), F(fa, {
        key: 1,
        to: c.value
      }, [
        he(O.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      he(O.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Vy = /* @__PURE__ */ H(Gy, [["__scopeId", "data-v-548d0aaa"]]), Ky = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, Yy = { class: "document-tabs" }, Qy = { class: "document-body" }, Xy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Jy = {
  key: 1,
  class: "document-loading"
}, Zy = {
  class: "document-details",
  "data-resource-fields": ""
}, e0 = 760, t0 = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = T(null), a = Tg(n), s = A(() => a.value !== null && a.value < e0), o = T(null), l = T(""), i = T([]), u = T([]), c = T(""), f = T("comments"), h = T("text"), p = T(0), y = T(0), b = T([]), O = T(null), S = T(""), x = T(!1), B = T(null), W = T(null);
    let N = 0;
    const w = Ui(() => o.value ? { term: t.term, id: t.id, title: o.value.title } : {}, (ce) => t.read(ce)), z = A(() => Ko(w.comments.value)), P = A(() => f.value === "questions" ? Ko(u.value) : z.value), q = A(() => f.value === "questions" ? P.value.length : w.total.value), _ = A(() => {
      var ce;
      return (ce = o.value) != null && ce.body ? Vs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), I = A(() => {
      var ce;
      return (((ce = o.value) == null ? void 0 : ce.body) ?? "").split(`
`).filter((te) => /^#{1,4} /.test(te)).map((te, se) => ({ key: String(se), value: se, label: te.replace(/^#+ /, "") }));
    }), $ = A(() => z.value.find((ce) => ce.id === y.value)), g = A(() => {
      var ce;
      return (ce = o.value) != null && ce.close_reason ? "Closed" : "Open";
    }), M = A(() => h.value === "comments" && !s.value ? "text" : h.value), C = (ce) => ce.ok ? ce.value.rows ?? [] : [];
    async function R() {
      const ce = ++N, te = await t.read([t.term, "inspect", String(t.id)]);
      if (ce !== N) return;
      l.value = te.ok ? "" : te.error, o.value = te.ok ? te.value : null;
      const se = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), oe = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      ce === N && (u.value = C(se), c.value = se.ok ? "" : se.error, i.value = oe ? C(oe) : []);
    }
    async function U(ce) {
      const te = O.value ? ["--quote", O.value.quote, "--position", String(O.value.position), "--selection-type", O.value.selection_type] : [], se = await t.read([t.term, "comment", String(t.id), ...te, "--", ce]);
      if (!se.ok) throw new Error(se.error);
      O.value = null, await Promise.all([R(), w.load()]);
    }
    async function Z() {
      const ce = await t.read(["doc", "close", String(t.id)]);
      l.value = ce.ok ? "" : ce.error, ce.ok && await R();
    }
    function ee() {
      S.value.trim() || (O.value = null);
    }
    function pe(ce) {
      var te;
      if (p.value = ce, s.value && f.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === ce ? 0 : ce : (te = n.value.querySelector(f.value === "questions" ? `[data-question-id="${ce}"]` : `[data-comment-id="${ce}"]`)) == null || te.scrollIntoView({ block: "nearest" });
    }
    async function re(ce) {
      var te, se;
      h.value = "text", p.value = ce, await ((te = B.value) == null ? void 0 : te.nextTick()), (se = B.value) == null || se.show(ce);
    }
    function we() {
      x.value = !1, R();
    }
    return ge(() => `${t.term}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, O.value = null, u.value = [], c.value = "", R();
    }, { immediate: !0 }), ge(f, () => {
      p.value = 0, y.value = 0;
    }), (ce, te) => (r(), d("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (r(), d("div", Ky, [
        E(ve, {
          bordered: "",
          "data-text-edit": "",
          onClick: te[0] || (te[0] = (se) => x.value = !0)
        }, {
          default: j(() => [...te[14] || (te[14] = [
            V("Edit", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      m("nav", Yy, [
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
        ], 2)) : k("", !0),
        e.term === "doc" ? (r(), d("button", {
          key: 1,
          type: "button",
          class: K(["document-tab-button", { on: M.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: te[3] || (te[3] = (se) => h.value = "revisions")
        }, [
          te[15] || (te[15] = V("Revisions ", -1)),
          m("em", null, v(i.value.length || ""), 1)
        ], 2)) : k("", !0),
        te[16] || (te[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        M.value === "text" && I.value.length > 1 ? (r(), F(Di, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: I.value,
          "data-text-chapters": "",
          onPick: te[4] || (te[4] = (se) => {
            var oe;
            return (oe = B.value) == null ? void 0 : oe.showHeading(se.value);
          })
        }, null, 8, ["label", "items"])) : k("", !0)
      ]),
      m("div", Qy, [
        l.value ? (r(), d("p", Xy, v(l.value), 1)) : o.value ? M.value === "revisions" ? (r(), F(Ly, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: Z,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : M.value === "comments" ? (r(), F(Go, {
          key: 3,
          mode: f.value,
          "onUpdate:mode": te[5] || (te[5] = (se) => f.value = se),
          tab: "",
          comments: z.value,
          questions: u.value,
          hot: p.value,
          lost: b.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!L(w).nextPage.value,
          "comment-loading": L(w).loading.value,
          "comment-failure": L(w).failure.value,
          "comment-total": L(w).total.value,
          onMore: L(w).loadMore,
          onShow: re,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(D, { key: 4 }, [
          E(Vy, {
            ref_key: "words",
            ref: B,
            html: _.value,
            comments: P.value,
            "annotation-label": f.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: O.value,
            inline: y.value,
            onSelect: te[7] || (te[7] = (se) => O.value = se),
            onClear: ee,
            onNumber: pe,
            onWrite: te[8] || (te[8] = (se) => {
              var oe;
              return (oe = W.value) == null ? void 0 : oe.focus();
            }),
            onLost: te[9] || (te[9] = (se) => b.value = se)
          }, {
            inline: j(() => [
              $.value ? (r(), F(Pi, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: te[6] || (te[6] = (se) => re($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: j(() => [
              m("dl", Zy, [
                te[18] || (te[18] = m("h4", null, "Details", -1)),
                te[19] || (te[19] = m("dt", null, "State", -1)),
                m("dd", null, v(g.value), 1),
                o.value.close_reason ? (r(), d(D, { key: 0 }, [
                  te[17] || (te[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(o.value.close_reason), 1)
                ], 64)) : k("", !0),
                te[20] || (te[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  E(Ze, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                te[21] || (te[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  E(Ze, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? k("", !0) : (r(), F(Go, {
            key: 0,
            mode: f.value,
            "onUpdate:mode": te[10] || (te[10] = (se) => f.value = se),
            comments: z.value,
            questions: u.value,
            hot: p.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!L(w).nextPage.value,
            "comment-loading": L(w).loading.value,
            "comment-failure": L(w).failure.value,
            "comment-total": L(w).total.value,
            onMore: L(w).loadMore,
            onShow: re,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (r(), d("div", Jy, [
          E(Ke)
        ]))
      ]),
      o.value ? (r(), F(Ug, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: S.value,
        "onUpdate:draft": te[11] || (te[11] = (se) => S.value = se),
        selection: O.value,
        send: U,
        narrow: s.value,
        onClear: te[12] || (te[12] = (se) => O.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      x.value ? (r(), F(Cy, {
        key: 2,
        term: e.term,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: te[13] || (te[13] = (se) => x.value = !1),
        onSaved: we
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, XS = /* @__PURE__ */ H(t0, [["__scopeId", "data-v-029db6fe"]]), n0 = {
  key: 1,
  class: "row-list-failure"
}, a0 = ["data-row"], s0 = {
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
    const t = e, n = A(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = T(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", n0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), F(rn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        V(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(D, { key: 3 }, [
      (r(), F(ut(e.arrival || e.moves ? Bs : "ul"), Pe(n.value, { class: "row-list" }), {
        default: j(() => [
          (r(!0), d(D, null, ne(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            he(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, a0))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : k("", !0)
    ], 64));
  }
}, o0 = /* @__PURE__ */ H(s0, [["__scopeId", "data-v-e9f251f3"]]), l0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, i0 = {
  key: 1,
  class: "agent-rows-note"
}, r0 = {
  key: 2,
  class: "agent-rows-note"
}, u0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, c0 = ["data-agent-row", "onClick"], d0 = { class: "agent-row-name" }, f0 = { class: "agent-row-state" }, h0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = A(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = A(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", l0, [
      e.loaded ? e.failure ? (r(), d("p", i0, v(e.failure), 1)) : e.rows.length ? (r(), d(D, { key: 3 }, [
        m("p", u0, v(a.value) + " running", 1),
        (r(!0), d(D, null, ne(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => L(De)(`agents:${l.id}`)
        }, [
          m("span", d0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", f0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, c0))), 128))
      ], 64)) : (r(), d("p", r0, v(e.none), 1)) : (r(), F(Ke, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, JS = /* @__PURE__ */ H(h0, [["__scopeId", "data-v-a01e5a17"]]), ft = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ue = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, m0 = 6;
function eo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const p0 = (e) => {
  const t = eo(e, ft.lineChars), n = Math.max(ft.minWidth, Math.max(...t.map((a) => a.length)) * ft.charWidth + ft.padX * 2);
  return { name: e, lines: t, line: ft.line, padY: ft.padY, width: n, height: t.length * ft.line + ft.padY * 2 };
};
function g0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function v0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function y0(e, t, n) {
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
  for (let l = 0; l < m0; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function b0(e, t) {
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
function k0(e) {
  const t = [...new Set(e.flatMap(([N, w]) => [N, w]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = g0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, w) => !s.has(w)), l = v0(t, o), i = y0(t, o, l), u = new Map(t.map((N) => [N, p0(N)])), c = i.map((N) => N.reduce((w, z) => w + u.get(z).width, 0) + He.across * (N.length - 1)), f = Math.max(...c) + He.margin * 2, h = $0(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = He.margin;
  i.forEach((N, w) => {
    let z = (f - c[w]) / 2;
    const P = Math.max(...N.map((q) => u.get(q).height));
    N.forEach((q) => {
      const _ = u.get(q);
      p.set(q, { ..._, x: z, y: y + (P - _.height) / 2 }), z += _.width + He.across;
    }), y += P + (h[w] ?? He.down);
  });
  const b = e.map(([N, w, z], P) => ({ from: N, to: w, label: z || "", back: s.has(P) || l.get(w) <= l.get(N) }));
  b0(b, p);
  const O = b.map((N) => x0(N, p.get(N.from), p.get(N.to))), S = [...p.values()], x = C0(O, S), B = Math.max(y - He.down, ...x.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(f - He.margin, ...x.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + He.margin, height: B + He.margin, nodes: S, arrows: x };
}
const w0 = (e) => e ? eo(e, Ue.lineChars).length * Ue.line + Ue.pad * 2 : 0;
function $0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += w0(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function x0(e, t, n) {
  const a = e.label ? eo(e.label, Ue.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ue.charWidth + Ue.pad * 2 : 0, o = a.length * Ue.line + (a.length ? Ue.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const S0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, M0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], _0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ue.line);
function C0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = S0(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = _0.flatMap((u) => M0.map((c) => s(c, u))).find((u) => !n.some((c) => Yo(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => Yo(i, u)); ) i.y += Ue.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ue.line, pad: Ue.pad } };
  });
}
const Yo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, A0 = { class: "flowchart-tools" }, E0 = ["width", "height", "viewBox", "aria-label"], O0 = ["d"], T0 = ["x", "y", "width", "height"], I0 = ["x", "y"], B0 = ["x", "dy"], R0 = {
  key: 0,
  class: "flowchart-label"
}, L0 = ["x", "y", "width", "height"], N0 = ["x", "y"], q0 = ["x", "dy"], D0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => k0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = T(null), i = T({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var x;
      const O = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(O != null && O.width)) return;
      const S = Math.min(O.width / s.value.width, O.height / s.value.height, 1.5);
      i.value = { zoom: S, x: (O.width - s.value.width * S) / 2, y: (O.height - s.value.height * S) / 2 };
    }
    function f(O, S, x) {
      const { zoom: B, x: W, y: N } = i.value, w = Math.min(o.most, Math.max(o.least, B * O));
      i.value = { zoom: w, x: S - (S - W) * w / B, y: x - (x - N) * w / B };
    }
    function h(O) {
      const S = l.value.getBoundingClientRect();
      f(O, S.width / 2, S.height / 2);
    }
    function p(O) {
      const S = l.value.getBoundingClientRect();
      O.ctrlKey || O.metaKey ? f(O.deltaY < 0 ? o.step : 1 / o.step, O.clientX - S.left, O.clientY - S.top) : i.value = { ...i.value, x: i.value.x - O.deltaX, y: i.value.y - O.deltaY };
    }
    function y(O) {
      var S, x, B;
      O.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), u = { x: O.clientX - i.value.x, y: O.clientY - i.value.y }, (B = (x = l.value).setPointerCapture) == null || B.call(x, O.pointerId);
    }
    function b(O) {
      u && (i.value = { ...i.value, x: O.clientX - u.x, y: O.clientY - u.y });
    }
    return _e(c), (O, S) => (r(), F(ga, {
      padded: "",
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (x) => a("close"))
    }, {
      default: j(() => [
        m("div", A0, [
          E(ve, {
            small: "",
            onClick: S[0] || (S[0] = (x) => h(o.step))
          }, {
            default: j(() => [...S[5] || (S[5] = [
              V("Zoom in", -1)
            ])]),
            _: 1
          }),
          E(ve, {
            small: "",
            onClick: S[1] || (S[1] = (x) => h(1 / o.step))
          }, {
            default: j(() => [...S[6] || (S[6] = [
              V("Zoom out", -1)
            ])]),
            _: 1
          }),
          E(ve, {
            small: "",
            onClick: c
          }, {
            default: j(() => [...S[7] || (S[7] = [
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
          onPointermove: b,
          onPointerup: S[2] || (S[2] = (x) => bo(u) ? u.value = null : u = null),
          onPointercancel: S[3] || (S[3] = (x) => bo(u) ? u.value = null : u = null)
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
            }, null, 8, O0))), 128)),
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
              }, null, 8, T0),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (r(!0), d(D, null, ne(x.lines, (B, W) => (r(), d("tspan", {
                  key: W,
                  x: x.x + x.width / 2,
                  dy: W ? x.line : 0
                }, v(B), 9, B0))), 128))
              ], 8, I0)
            ]))), 128)),
            (r(!0), d(D, null, ne(s.value.arrows, (x, B) => (r(), d(D, {
              key: `label-${B}`
            }, [
              x.label ? (r(), d("g", R0, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, L0),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (r(!0), d(D, null, ne(x.label.lines, (W, N) => (r(), d("tspan", {
                    key: N,
                    x: x.label.x + x.label.width / 2,
                    dy: N ? x.label.line : 0
                  }, v(W), 9, q0))), 128))
                ], 8, N0)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, E0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, P0 = /* @__PURE__ */ H(D0, [["__scopeId", "data-v-e98799dc"]]), j0 = ["innerHTML"], F0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = A(() => Co[t.name] || Co.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, j0));
  }
}, At = /* @__PURE__ */ H(F0, [["__scopeId", "data-v-beb5935c"]]), W0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: K(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      E(At, { name: "fold" })
    ], 2));
  }
}, Kt = /* @__PURE__ */ H(W0, [["__scopeId", "data-v-d03899bb"]]), H0 = ["data-tip", "aria-label"], z0 = {
  key: 0,
  class: "mact-word"
}, U0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: K(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      E(At, { name: "open" }),
      e.open ? (r(), d("span", z0, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, H0));
  }
}, Vi = /* @__PURE__ */ H(U0, [["__scopeId", "data-v-3b292e09"]]), Ki = 120, zn = 280, Yi = 160, G0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, V0 = ["leaving", "resizing", "entering"];
function ws(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function K0(e) {
  const t = V0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ws(e);
  return e.classList.add(...t), n;
}
function Qi(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = T(t()), s = T("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function u(h, p) {
    i(h);
    const y = K0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${zn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${zn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, u(h, ws(h)));
    });
    return b.observe(p), b;
  }
  async function f(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || G0()) {
      a.value = h;
      return;
    }
    const b = ws(p);
    if (l(p, b), s.value = "leaving", await n(Ki), y !== o) return;
    a.value = h, s.value = "resizing", await je(), u(p, b);
    const O = c(p);
    await n(zn), O == null || O.disconnect(), y === o && (i(p), s.value = "entering", await n(Yi), y === o && (s.value = ""));
  }
  return ge(t, (h) => f(h)), et(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Y0 = { class: "growing-card-top" }, Q0 = ["aria-expanded"], X0 = { class: "growing-card-avatar" }, J0 = { class: "growing-card-title" }, Z0 = { class: "growing-card-more" }, eb = { class: "growing-card-body" }, tb = {
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
    const n = e, a = t, s = T(!1), o = T(null), { folded: l, phase: i } = Qi(o, () => !s.value), u = A(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = A(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: K(["growing-card-wrap", L(i), { open: !L(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", Y0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", X0, [
            e.bad ? (r(), F(At, {
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
          m("span", J0, v(e.title), 1),
          E(Kt, { open: s.value }, null, 8, ["open"])
        ], 8, Q0),
        e.action ? (r(), F(Vi, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : k("", !0),
        e.commentable ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (p) => a("comment"))
        }, [
          E(le, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", Z0, [
        m("div", eb, [
          (r(!0), d(D, null, ne(c.value, (p, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, nb = /* @__PURE__ */ H(tb, [["__scopeId", "data-v-f2b4930d"]]), ab = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, sb = { class: "md inline" }, ob = ["disabled", "title", "onClick"], lb = {
  key: 1,
  class: "message-links-many"
}, ib = ["aria-expanded"], rb = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, ub = ["disabled", "onClick"], cb = { class: "row-pill message-links-chip" }, db = { class: "message-links-title" }, fb = { key: 0 }, Pa = 3, hb = "task", mb = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => n.total || n.links.length), o = A(() => n.links.every((p) => p.endpoint.model === hb) ? "tasks" : "items"), l = T(!1), i = T(null);
    Ql(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, De(p.endpoint.open_ref));
    }
    return (p, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: K(["message-links", { many: s.value > Pa, three: s.value === Pa, open: l.value }]),
      "data-message-links": ""
    }, [
      E(At, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", ab, [
        m("span", sb, [
          y[1] || (y[1] = V("Linked: ", -1)),
          (r(!0), d(D, null, ne(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (O) => h(b)
          }, [
            V(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (r(), d(D, { key: 0 }, [
              V(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(D, { key: 1 }, [
              V(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, ob))), 128))
        ])
      ])) : k("", !0),
      s.value >= Pa ? (r(), d("span", lb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          V(v(s.value) + " linked " + v(o.value) + " ", 1),
          E(Kt, { open: l.value }, null, 8, ["open"])
        ], 8, ib)
      ])) : k("", !0),
      l.value ? (r(), d("div", rb, [
        (r(!0), d(D, null, ne(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (O) => h(b)
        }, [
          m("span", cb, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          m("span", db, v(b.endpoint.title), 1),
          m("span", null, v(f(b)), 1),
          c(b) ? (r(), d("span", fb, "Unavailable")) : k("", !0)
        ], 8, ub))), 128))
      ])) : k("", !0),
      E(yn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, pb = /* @__PURE__ */ H(mb, [["__scopeId", "data-v-14ec7c9a"]]), gb = ["title", "aria-label"], vb = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, yb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, bb = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = A(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: K(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", vb, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", yb)) : k("", !0)
      ]))
    ], 10, gb));
  }
}, kb = /* @__PURE__ */ H(bb, [["__scopeId", "data-v-6dc92808"]]), wb = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, $b = (e) => e.worker_id != null ? "report" : "message", xb = (e) => wb[$b(e)], Sb = "img,pre,table";
function Mb(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function _b(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Cb(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Sb)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Mb(_b(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Ab(e, t) {
  let n = null;
  const a = () => e.value && Cb(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), ge(t, a, { flush: "post" });
}
const Eb = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Ob(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Ln = /* @__PURE__ */ new WeakMap(), Re = "work", Qe = "sent", Tb = 50, Qo = 50, Xo = () => ({ rows: T([]), total: T(0), next: T(null), loading: T(!1), failure: T(""), version: 0 });
function Ib(e) {
  var O;
  if (Ln.has(e)) return Ln.get(e);
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
    const z = x === Re ? N.value.counterparts ?? [] : N.value.rows ?? [], P = W === 1 ? z : [...w.rows.value, ...z], q = x === Re ? (_) => `${_.endpoint.model}:${_.endpoint.id}` : (_) => _.id ?? _.target_id;
    w.rows.value = [...new Map(P.map((_) => [q(_), _])).values()], w.total.value = N.value.total ?? w.rows.value.length, w.next.value = N.value.next_page ?? null;
  }
  function i(S, x, B, W) {
    const N = S[x];
    N.version === B && (N.failure.value = W.message, N.loading.value = !1);
  }
  async function u(S, x, B) {
    const W = o(S, x), N = x === Re ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(S, x, W, B, await e.read(`link list --source message:${S.id} ${N} --page ${B} --page-size ${x === Re ? 10 : 25}`));
    } catch (w) {
      i(S, x, W, w);
    }
  }
  async function c(S) {
    const x = S.map((B) => ({ [Re]: o(B, Re), [Qe]: o(B, Qe) }));
    try {
      const B = await e.read(`link receipts --messages ${S.map((W) => W.id).join(",")}`);
      S.forEach((W, N) => {
        const w = B.ok ? B.value.messages[String(W.id)] : null;
        l(W, Re, x[N][Re], 1, B.ok ? { ok: !0, value: w.named } : B), l(W, Qe, x[N][Qe], 1, B.ok ? { ok: !0, value: w.sent } : B);
      });
    } catch (B) {
      S.forEach((W, N) => [Re, Qe].forEach((w) => i(W, w, x[N][w], B)));
    }
  }
  function f() {
    a = null;
    const S = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), S.forEach((x) => x.dirty.clear());
    for (let x = 0; x < S.length; x += Qo) c(S.slice(x, x + Qo));
  }
  function h(S, x = [Re, Qe]) {
    for (const B of x) S.dirty.add(B);
    s(S) && (n.add(S.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(S) {
    const x = S.sources ?? (S.source_model && Number.isInteger(S.source_id) ? [{ model: S.source_model, id: S.source_id }] : []), B = S.link_types ?? (S.link_type ? [S.link_type] : []), W = B.length ? [Re, Qe].filter((w) => w === Re ? B.some((z) => ["about", "edited"].includes(z)) : B.includes("sent_to")) : [Re, Qe];
    if (!W.length) return;
    const N = x.length ? [...new Set(x.filter((w) => w.model === "message").map((w) => w.id))].map((w) => t.get(w)).filter(Boolean) : [...t.values()].filter(s).slice(0, Tb);
    for (const w of N) h(w, W);
  }
  const y = (O = e.follow) == null ? void 0 : O.call(e, ["link.*"], p), b = {
    attach(S, x) {
      let B = t.get(S);
      return B || (B = { id: S, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Re, Qe]), work: Xo(), sent: Xo() }, t.set(S, B)), B.views.add(x), B.dirty.size && h(B, [...B.dirty]), B;
    },
    shown(S) {
      S.dirty.size && h(S, [...S.dirty]);
    },
    detach(S, x) {
      S.views.delete(x), S.views.size || t.delete(S.id), t.size || (clearTimeout(a), y == null || y(), Ln.delete(e));
    },
    more(S, x) {
      const B = S == null ? void 0 : S[x];
      if (B != null && B.next.value && !B.loading.value) return u(S, x, B.next.value);
    }
  };
  return Ln.set(e, b), b;
}
function Bb(e, t, n) {
  const a = Xe(null);
  let s = null;
  const o = ge(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Ib(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = ge(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), h == null || h.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return ha(o), {
    links: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: A(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: A(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: A(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: A(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Re),
    loadSent: () => s == null ? void 0 : s.more(a.value, Qe)
  };
}
const Rb = ["data-incoming", "data-ref"], Lb = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Nb = { class: "message-body" }, qb = ["title"], Db = ["innerHTML"], Pb = ["title"], jb = ["innerHTML"], Fb = {
  class: "message-faces",
  "data-message-faces": ""
}, Wb = ["title", "data-face", "onClick"], Hb = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, zb = ["title", "data-reaction", "onClick"], Ub = {
  key: 0,
  class: "message-reaction-count"
}, Gb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Vb = ["href", "title"], Kb = ["src", "alt"], Yb = ["href"], Qb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Xb = ["disabled", "data-sent-worker", "title", "onClick"], Jb = { class: "message-foot" }, Zb = { class: "message-time" }, ek = {
  class: "message-id",
  "data-message-id": ""
}, tk = 1500, nk = "An earlier message", ak = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(!1), o = T(null), l = A(() => ["user", "comment"].includes(n.message.type)), i = A(() => {
      const [te, se] = (n.message.commented_row || ":").split(":"), oe = gt(te);
      return oe ? { ref: `${oe}:${se}`, label: `${Vt(oe).title.toLowerCase()} ${se}` } : null;
    }), u = A(() => n.message.worker_id ?? null), c = A(() => xb(n.message)), f = A(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var te;
      await ((te = navigator.clipboard) == null ? void 0 : te.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, tk);
    }
    const p = Si(), y = A(() => p(n.message.text ?? "")), b = A(() => JSON.parse(n.message.flowchart_edges || "[]")), O = T(!1), S = A(() => vs(n.quote)), x = A(() => p(S.value || nk));
    function B() {
      const te = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      te ? te.scrollIntoView({ block: "center", behavior: "smooth" }) : De(`messages:${n.message.parent_id}`);
    }
    Ab(o, () => `${n.message.text} ${S.value}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, N = (te) => `/api/files/message/${n.message.id}/${encodeURIComponent(te)}`, w = A(() => JSON.parse(n.message.captions || "{}")), z = A(() => (n.message.files ?? []).map((te) => ({ name: te, address: N(te), isImage: W.test(te), title: w.value[te] || te }))), P = A(() => Bi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), q = Me(Ne, null), { links: _, total: I, more: $, loading: g, failure: M, sentTo: C, sentMore: R, sentLoading: U, sentFailure: Z, loadMore: ee, loadSent: pe } = Bb(q, () => l.value && !n.message.local ? n.message.id : null, o), re = T(!1), we = A(() => Ob(n.message.reactions));
    function ce(te) {
      re.value = !1, a("react", n.message, te);
    }
    return (te, se) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      E(nb, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: se[0] || (se[0] = (oe) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Rb)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Nb, [
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
            E(le, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, qb)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Se(B, ["stop"]),
            innerHTML: x.value
          }, null, 8, Db)) : k("", !0),
          u.value !== null ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${u.value}`,
            onClick: se[2] || (se[2] = Se((oe) => L(De)(`agents:${u.value}`), ["stop"]))
          }, "Worker " + v(u.value), 9, Pb)) : k("", !0),
          E(yi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: j(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, jb)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(D, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: se[3] || (se[3] = (oe) => O.value = !0)
            }, "Open the flowchart"),
            O.value ? (r(), F(P0, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: se[4] || (se[4] = (oe) => O.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: K(["message-tools", { picking: re.value }]),
          "data-message-tools": ""
        }, [
          re.value ? (r(), d(D, { key: 0 }, [
            m("div", Fb, [
              (r(!0), d(D, null, ne(L(Eb), (oe) => (r(), d("button", {
                key: oe,
                type: "button",
                class: "message-face",
                title: `React ${oe}`,
                "data-face": oe,
                onClick: (nt) => ce(oe)
              }, v(oe), 9, Wb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: se[6] || (se[6] = (oe) => re.value = !1)
            }, [
              E(le, {
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
              onClick: se[7] || (se[7] = (oe) => re.value = !0)
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
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      we.value.length ? (r(), d("div", Hb, [
        (r(!0), d(D, null, ne(we.value, (oe) => (r(), d("button", {
          key: oe.emoji,
          type: "button",
          class: K(["message-reaction", { mine: oe.mine }]),
          title: oe.title,
          "data-reaction": oe.emoji,
          onClick: (nt) => a("react", e.message, oe.emoji)
        }, [
          V(v(oe.emoji) + " ", 1),
          oe.count > 1 ? (r(), d("span", Ub, v(oe.count), 1)) : k("", !0)
        ], 10, zb))), 128))
      ])) : k("", !0),
      z.value.length ? (r(), d("div", Gb, [
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
            }, null, 8, Kb)
          ], 8, Vb)) : (r(), d("a", {
            key: 1,
            href: oe.address,
            target: "_blank",
            class: "message-file"
          }, v(oe.name), 9, Yb))
        ], 64))), 128))
      ])) : k("", !0),
      L(C).length ? (r(), d("div", Qb, [
        E(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(D, null, ne(L(C), (oe) => (r(), d("button", {
          key: oe.id,
          type: "button",
          class: "message-sent-worker",
          disabled: oe.unavailable || !oe.open_ref,
          "data-sent-worker": oe.id,
          title: `Open worker ${oe.id}`,
          onClick: Se((nt) => oe.open_ref && L(De)(oe.open_ref), ["stop"])
        }, [
          V("Also sent to worker " + v(oe.id), 1),
          oe.unavailable ? (r(), d(D, { key: 0 }, [
            V(" (unavailable)")
          ], 64)) : k("", !0)
        ], 8, Xb))), 128))
      ])) : k("", !0),
      E(yn, {
        more: L(R),
        loading: L(U),
        failure: L(Z),
        label: "More recipients",
        onMore: L(pe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Jb, [
        m("time", Zb, v(P.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(D, { key: 0 }, [
          se[10] || (se[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", ek, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), F(kb, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      L(_).length || L(M) ? (r(), F(pb, {
        key: 3,
        links: L(_),
        total: L(I),
        more: L($),
        loading: L(g),
        failure: L(M),
        onMore: L(ee)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Lb));
  }
}, ZS = /* @__PURE__ */ H(ak, [["__scopeId", "data-v-b42dab37"]]), aa = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ja = 200, Xi = (e) => {
  var t;
  return ((t = aa.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? aa[0].key;
}, e6 = (e) => {
  var t;
  return ((t = aa.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, sk = ["aria-label"], ok = 300, Jo = 400, lk = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ja } },
  setup(e) {
    const t = e, n = A(() => Xi(t.value)), a = A(() => n.value < ja ? [1, 0.25, 0.25] : n.value === ja ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: K(["ico", "prio", { hot: n.value >= Jo, high: n.value >= ok && n.value < Jo }]),
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
    ], 10, sk));
  }
}, t6 = /* @__PURE__ */ H(lk, [["__scopeId", "data-v-b10e610f"]]), Ji = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], n6 = (e) => {
  const t = Ji[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, ik = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Zo = (e) => ik[e.card.state] || "idle", rk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), el = { working: 0, waiting: 1, idle: 2, stopped: 3 }, tl = (e, t) => el[Zo(e)] - el[Zo(t)], nl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, a6 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => tl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || rk(a, s)) : [...e].sort((a, s) => tl(a, s) || (nl[t] || nl.state)(a, s)), uk = { class: "list-row" }, ck = {
  key: 0,
  class: "list-row-type"
}, dk = { class: "list-row-main" }, fk = {
  key: 0,
  class: "list-row-title"
}, hk = { class: "list-row-body" }, mk = {
  key: 1,
  class: "list-row-end"
}, pk = {
  key: 1,
  class: "list-row-text"
}, gk = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", uk, [
      e.type ? (r(), d("span", ck, v(e.type), 1)) : k("", !0),
      m("div", dk, [
        e.title ? (r(), d("span", fk, v(e.title), 1)) : k("", !0),
        m("div", hk, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", mk, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", pk, v(e.text), 1)) : k("", !0)
    ]));
  }
}, s6 = /* @__PURE__ */ H(gk, [["__scopeId", "data-v-dfc8c3a7"]]), o6 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = A(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (r(), F(Di, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, vk = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: K(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Zi = /* @__PURE__ */ H(vk, [["__scopeId", "data-v-978e0921"]]), yk = ["aria-label"], bk = { class: "head" }, kk = { class: "names" }, wk = { class: "body" }, $k = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ii(a, n), i = ri(s);
    return (u, c) => (r(), F(fa, { to: "body" }, [
      E(Ut, {
        name: "side",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
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
                m("header", bk, [
                  m("div", kk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (r(), F(ot, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0)
                  ]),
                  he(u.$slots, "actions", {}, void 0, !0),
                  E(pa, {
                    title: e.closeLabel,
                    onClick: L(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot ? (r(), F(Zi, { key: 0 }, {
                  default: j(() => [
                    he(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", wk, [
                  he(u.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : he(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, yk)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, l6 = /* @__PURE__ */ H($k, [["__scopeId", "data-v-f276f055"]]), xk = {
  key: 1,
  class: "text-field-label"
}, Sk = {
  key: 2,
  class: "text-field-end"
}, Mk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ jt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = ln(e, "modelValue"), a = da(), s = "onUpdate:modelValue" in (((f = tu()) == null ? void 0 : f.vnode.props) || {}), o = A(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = A(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), u = A(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = T(null);
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
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", xk, v(e.label), 1)) : k("", !0),
      Je(m("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [L(hs), o.value]
      ]),
      h.$slots.end ? (r(), d("span", Sk, [
        he(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : Je((r(), d("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [L(hs), o.value]
    ]);
  }
}), i6 = /* @__PURE__ */ H(Mk, [["__scopeId", "data-v-d9c38ca8"]]), _k = { class: "title" }, Ck = { class: "state" }, Ak = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = is(t.line, t.events);
    return (o, l) => (r(), F(o0, {
      rows: L(n),
      failure: L(a),
      loaded: L(s),
      empty: e.empty
    }, {
      default: j(({ row: i }) => [
        m("span", _k, v(i.title), 1),
        m("span", Ck, v(L(un)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, r6 = /* @__PURE__ */ H(Ak, [["__scopeId", "data-v-6be0c59e"]]);
function Ek(e = 1e3, t = null) {
  const n = T(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ge(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const Fa = T(Date.now() / 1e3);
let al = 0, Nn = 0;
function to() {
  return Nn || (Fa.value = Date.now() / 1e3, al = setInterval(() => Fa.value = Date.now() / 1e3, 1e3)), Nn += 1, Ll() && ha(() => {
    Nn -= 1, Nn || clearInterval(al);
  }), Fa;
}
const Ok = 200, Tk = Ki + zn + Yi + Ok, Ik = 300, qn = /* @__PURE__ */ new WeakMap();
function Bk(e, t) {
  const n = qn.get(e) ?? [];
  qn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = qn.get(e);
    qn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, Ik);
}
function Qt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Rk(e, t, n) {
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
function Lk(e, t, n, a) {
  ge(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(Rk(o, l, n.value)), performance.now() - l < Tk) return void requestAnimationFrame(u);
        Bk(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const Nk = ["title", "data-figure-mark", "data-folded", "data-open"], qk = {
  key: 2,
  class: "worker"
}, Dk = { class: "head" }, Pk = { key: 0 }, jk = {
  key: 3,
  class: "status"
}, Fk = {
  key: 0,
  class: "figure"
}, Wk = {
  class: "figure-decimal",
  "data-figure-decimal": ""
}, Hk = {
  key: 1,
  class: "ran-for"
}, zk = { key: 2 }, Uk = {
  key: 3,
  class: "news"
}, Gk = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Vk = {
  key: 6,
  class: "settled"
}, Kk = {
  key: 1,
  class: "bar"
}, Yk = {
  key: 3,
  class: "detail body"
}, Qk = {
  key: 0,
  class: "body-label"
}, Xk = ["title"], Jk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = da(), a = ["onClick", "onAct"], s = A(() => Object.fromEntries(Object.entries(n).filter(([re]) => !a.includes(re)))), o = T(!1), l = A(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = A(() => t.open !== void 0), u = A(() => i.value || l.value), c = A(() => i.value ? t.open : o.value), f = A(() => i.value ? !t.open : l.value && !o.value), h = A(() => !!(t.mark.action && n.onAct)), p = A(() => u.value || h.value || !!n.onClick), y = T(null), b = T(null), { folded: O, phase: S } = Qi(y, () => f.value);
    Lk(y, f, S, Me(Ne, null));
    function x(re) {
      var we, ce;
      if (!(re.target !== y.value && !b.value.contains(re.target))) {
        if (i.value) return (we = n.onClick) == null ? void 0 : we.call(n, re);
        if (l.value) return void (o.value = !o.value);
        (ce = n.onAct || n.onClick) == null || ce(re);
      }
    }
    const B = (re) => n.onAct(re), W = ["failed", "unfinished"], N = A(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), w = A(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), z = A(() => w.value || "var(--tone-work)"), P = A(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), q = to(), _ = A(
      () => t.mark.began_at && P.value && !t.mark.figure && !t.mark.counting ? Ri(q.value - t.mark.began_at) : ""
    ), I = A(() => {
      const { started: re, ended: we } = t.mark;
      return re ? we ? `ran ${Uo(we - re, !0)}` : Uo(q.value - re, !0) : _.value;
    }), $ = ["bad", "danger", "warn"], g = A(() => $.includes(N.value) || t.mark.asks ? "attention" : P.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], C = A(() => M.includes(N.value)), R = A(() => g.value === "process" ? "running" : C.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), U = A(
      () => !!(t.mark.figure || I.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), Z = A(() => /^(\d+)(\.\d+)(.*)$/.exec(t.mark.figure ?? "")), ee = A(() => [t.mark.title, t.mark.time ? Bi(t.mark.time) : ""].filter(Boolean).join(" · ")), pe = A(() => ({
      ...w.value ? { "--mark": w.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (re, we) => (r(), d("div", Pe(s.value, {
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
          failed: C.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: w.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: pe.value,
      title: ee.value,
      "data-figure-mark": e.mark.key,
      "data-folded": L(O) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (r(), F(ut(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (r(), F(At, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (r(), F(le, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (r(), d("span", qk, v(e.mark.worker), 1)) : k("", !0),
          m("span", Dk, [
            E(ot, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", Pk, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), F(Kt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          U.value ? (r(), d("span", jk, [
            e.mark.figure ? (r(), d("span", Fk, [
              Z.value ? (r(), d(D, { key: 0 }, [
                V(v(Z.value[1]), 1),
                m("span", Wk, v(Z.value[2]), 1),
                V(v(Z.value[3]), 1)
              ], 64)) : (r(), d(D, { key: 1 }, [
                V(v(e.mark.figure), 1)
              ], 64))
            ])) : k("", !0),
            I.value ? (r(), d("span", Hk, v(I.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", zk, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", Uk, v(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (r(), d("span", Gk)) : R.value ? (r(), F(At, {
              key: 5,
              class: K(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", Vk, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (r(), F(Vi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: Se(B, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && P.value ? (r(), d("span", Kk, [
        m("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: z.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !L(O) ? (r(), F(ot, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !L(O) ? (r(), d("div", Yk, [
        e.mark.bodyLabel ? (r(), d("p", Qk, v(e.mark.bodyLabel), 1)) : k("", !0),
        E(ot, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !L(O) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Xk)) : k("", !0),
      e.mark.card ? (r(), F(ot, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      he(re.$slots, "default", {
        shown: !L(O)
      }, void 0, !0)
    ], 16, Nk));
  }
}), er = /* @__PURE__ */ H(Jk, [["__scopeId", "data-v-1525b8df"]]), Zk = 8, ew = 40, tw = [];
class no {
  constructor(t, n, { top: a = Zk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && tw.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new no(t, {
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
    n > ew && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const nw = 60, aw = 300, tr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function nr(e, t) {
  const n = T([]), a = T(0);
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
  const c = new no("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => aw, more: () => a.value > 0, previous: u }, { top: nw });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const sw = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function ar(e) {
  var n;
  const t = sw[e] || ((n = Vt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const ow = (e) => ar(String(e).split(":")[0]), lw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), iw = { passed: "good", failed: "danger", warned: "warn", running: "" }, rw = { good: "good", warn: "warn", danger: "danger" }, sl = {
  "open row": (e) => De(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Nf(e.target_model, e.target_id || 0)
}, uw = { "open row": (e) => ow(e.target_model), "open page": () => ar("pages") };
function cw(e, t) {
  const n = t || {}, a = sl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? iw[e.outcome] || "" : rw[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? uw[a](e) : "",
    handlers: a ? { onAct: () => sl[a](e) } : {}
  };
}
const dw = 24, fw = 1e3, ol = 2e3, hw = 0.25, mw = 5e3;
function pw(e, t = dw, n = () => !0) {
  const a = T(!1), s = T(0), o = T(!1);
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
    const w = Date.now() - u < ol ? ol : fw;
    l = setTimeout(() => o.value = a.value, w);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(N = !1) {
    const w = c();
    w && N && w.scrollTo ? w.scrollTo({ top: w.scrollHeight, behavior: "smooth" }) : w && (w.scrollTop = w.scrollHeight), y();
  }
  function O() {
    x(), !a.value && (a.value = !0, p(!0));
  }
  const S = () => !!c() && f() <= c().clientHeight * hw;
  function x() {
    clearTimeout(i), S() && (i = setTimeout(() => a.value && S() && n() && b(!0), mw));
  }
  function B() {
    h() ? y() : O();
  }
  function W(N = 1, w = !1) {
    a.value ? s.value += Math.max(0, N) : b(w);
  }
  return Ll() && ha(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: b, left: O, scrolled: B, arrived: W };
}
const gw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, vw = (e) => String(e ?? "").replace(gw, ""), yw = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(null), { away: o, scrolled: l, arrived: i, toBottom: u } = pw(s);
    ge(
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
      V(v(L(vw)(e.lines.join(`
`)) || e.empty), 1),
      L(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => L(u)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, bw = /* @__PURE__ */ H(yw, [["__scopeId", "data-v-5a8693fe"]]), kw = "*.*", ww = {
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
    const t = e, n = Me(Ne, null), a = new Vl();
    ge(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = A(() => !!(t.declaration.shipped || t.declaration.trusted)), i = A(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [kw] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), F(zi, {
      key: 0,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), F(Hi, {
      key: 1,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, $w = { class: "mark-more-inner" }, xw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Sw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Mw = {
  key: 3,
  class: "mark-lines"
}, _w = "process", ll = "task", Cw = {
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
    const t = e, n = tt(), a = A(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = A(() => lw.has(t.mark.variant) && t.mark.detail || ""), o = A(() => t.mark.target_model === ll ? t.mark.target_id : 0), l = nr(
      tr(n),
      () => t.mark.target_id
    ), i = l.lines, u = T(!1), c = T(""), f = A(() => !t.declaration.body_url && t.mark.target_model === _w && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = A(() => t.shown && f.value);
    return ge(p, (y) => y && h()), Ls(() => p.value && h(), () => p.value && !t.mark.ended_at), ge(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, b) => (r(), d("div", {
      class: K(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = Se(() => {
      }, ["stop"]))
    }, [
      m("div", $w, [
        e.declaration.body_url ? (r(), F(ww, {
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
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", xw, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", Sw, v(c.value), 1)) : f.value && u.value ? (r(), d(D, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            E(bw, {
              class: "mark-terminal",
              lines: L(i),
              feed: L(l).feed,
              onOlder: L(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", Mw, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = Se((O) => L(De)(`${ll}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, $s = /* @__PURE__ */ H(Cw, [["__scopeId", "data-v-df71b15a"]]), Aw = ["title", "aria-label", "onClick"], Ew = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Ow = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = A(() => rf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = T(""), s = Me(Ne);
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
        E(At, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, Aw))), 128)),
      a.value ? (r(), d("span", Ew, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, Tw = /* @__PURE__ */ H(Ow, [["__scopeId", "data-v-7a62c88e"]]);
function sr(e, t) {
  const n = Xe(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ae.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const or = sr("/api/marks", "marks"), u6 = or.fetchAll, Iw = or.find, Bw = ["data-ref"], Rw = ["data-ref"], Lw = { class: "mark-row" }, Nw = "dock add", qw = "questions.answer", Dw = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = A(() => Iw(a.mark.type)), o = A(() => cw(a.mark, s.value)), l = A(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = A(() => l.value || !!o.value.handlers.onAct), u = A(() => a.mark.type === qw), c = T(!1);
    function f() {
      c.value = !c.value;
    }
    const h = A(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(Nw));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var b, O;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: K(["thread-turn", "card", "whole-card", { "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        E($s, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Bw)) : (r(), d("div", {
        key: 1,
        class: K(["thread-turn", "card", { "full-width": (O = s.value) == null ? void 0 : O.full_width, docked: e.docked, "user-side": L(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Lw, [
          E(er, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, nu({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: S }) => [
                E($s, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: S
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          E(Tw, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Rw));
    };
  }
}, Pw = /* @__PURE__ */ H(Dw, [["__scopeId", "data-v-424ddb61"]]), jw = ["data-ref"], Fw = ["inert"], Ww = { class: "group-fold" }, Hw = { class: "thread-group" }, zw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = T(!1), a = T(!1), s = T(!1), o = T(null);
    ge(n, async (i) => {
      var u;
      a.value = !0, await je(), (u = o.value) == null || u.offsetHeight, s.value = i;
    });
    const l = A(() => ({
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
      E(er, {
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
        m("div", Ww, [
          m("div", Hw, [
            (r(!0), d(D, null, ne(e.group.marks, (c) => (r(), F(Pw, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Fw)) : k("", !0)
    ], 8, jw));
  }
}, c6 = /* @__PURE__ */ H(zw, [["__scopeId", "data-v-45b58b9b"]]);
function Uw(e) {
  const t = T(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), et(() => n.disconnect()), t;
}
const Gw = { class: "chat-dock-fold" }, Vw = ["aria-label"], Kw = { class: "chat-dock-head" }, Yw = { class: "chat-dock-inner" }, Qw = { class: "chat-dock-foot" }, lr = 700, Xw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = T(null), a = T(null), s = Uw(a), o = T(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, lr)), et(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: K(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", Gw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: K(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          he(i.$slots, "edge", {}, void 0, !0),
          m("header", Kw, [
            he(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: K(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", Yw, [
              m("div", {
                class: K(["chat-dock-grow", { settled: o.value }]),
                style: ye(L(s) === null ? null : { height: `${L(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  he(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          he(i.$slots, "still", {}, void 0, !0),
          m("footer", Qw, [
            he(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Vw)
      ])
    ], 2));
  }
}, Jw = /* @__PURE__ */ H(Xw, [["__scopeId", "data-v-574cba3d"]]), Zw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Wa = 5, e2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Wa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Wa}s`, animationDelay: `${(n - Wa).toFixed(2)}s` };
    return (s, o) => (r(), d("span", Zw, [
      m("i", { style: a })
    ]));
  }
}, t2 = /* @__PURE__ */ H(e2, [["__scopeId", "data-v-2a7bc150"]]), n2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), xs = (e) => e.charAt(0).toUpperCase() + e.slice(1), a2 = (e) => xs(e.replace(/_at$/, "").replaceAll("_", " ")), s2 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, o2 = (e, t, n) => [xs(`${e} ${n}`), (t == null ? void 0 : t.state) && xs(t.state)].filter(Boolean).join(" · "), ir = (e) => e.given_name || `${Xn(e.role)} ${e.id}`, l2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? ir(t) : (e == null ? void 0 : e.name) ?? "", i2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? ir(t) : "", r2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !n2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: a2(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], u2 = { reviewing: "Under review" }, c2 = (e, t) => e || u2[t == null ? void 0 : t.state] || "", rr = sr("/api/docks", "docks"), d6 = rr.fetchAll, Rt = rr.find, d2 = 6, Ha = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ao = (e) => Date.parse(e.leaves_at) / 1e3, Jt = (e) => !!(e.leaves_at && !e.kept), f2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Jt(e) || t < ao(e) || n.has(e.id)), h2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => f2(a, t, n)).sort((a, s) => a.id - s.id);
function m2(e, t, n = d2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ao(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const p2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ss = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), g2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), v2 = (e) => ({ ...e.kept ? Ss("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ss("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), y2 = ["keep", "unkeep", "open", "undock"], b2 = (e) => ({ ...e, iconOnly: y2.includes(e.action) });
function k2(e, t) {
  var n;
  return [
    ...g2(e, t) ? [v2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Vt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Ss("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(b2);
}
function ur(e, t) {
  const n = k2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: p2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const w2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || ur(e, t).title, $2 = { class: "dock-text" }, x2 = ["title"], S2 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, M2 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, _2 = {
  key: 1,
  "data-dock-row": ""
}, C2 = { class: "dock-acts" }, A2 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = A(() => Rt(a.item.type)), o = to(), l = A(() => Xs(a.item.created_at, o.value * 1e3)), i = T(null), u = T(null), c = T(null), f = T(null), h = A(() => ur(a.item, s.value)), p = tt(), y = A(() => `dock.${a.item.id}`), b = A(() => p.props[y.value].data.value), O = A(() => w2(a.item, s.value, b.value)), S = A(() => ta(a.item.target_model ?? "")), x = A(() => {
      var $;
      return (($ = s.value) == null ? void 0 : $.word) ?? "";
    }), B = A(() => ({ ...b.value, id: a.item.target_id, term: S.value })), W = () => {
      var $, g;
      return ((g = ($ = s.value) == null ? void 0 : $.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    Sc(Rl, { data: b, reload: W, readOutput: tr(p) }), ge(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      ($, g, M) => {
        var R;
        W();
        const C = (R = p.followUndeclared) == null ? void 0 : R.call(p, [`${S.value.replaceAll("-", "_")}.*`], (U) => {
          (!U.row_id || U.row_id === a.item.target_id) && W();
        });
        M(() => C == null ? void 0 : C());
      },
      { immediate: !0 }
    );
    const N = T(/* @__PURE__ */ new Set()), w = T("");
    async function z($) {
      if ($.action === "undock") return n("undock", $);
      if ($.action === "open") return De(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (N.value = /* @__PURE__ */ new Set([...N.value, $.label])), w.value = "";
      const M = await bn($, { id: a.item.target_id }, p.environment);
      (M == null ? void 0 : M.ok) === !1 && (N.value = new Set([...N.value].filter((C) => C !== $.label)), w.value = `Could not ${$.label.toLowerCase()}: ${M.error}`);
    }
    const P = A(() => h.value.actions.filter(($) => !N.value.has($.label))), q = A(() => {
      var $;
      return c2(($ = s.value) == null ? void 0 : $.badge, B.value);
    }), _ = A(() => h.value.controls), I = A(() => {
      var $;
      return !!(($ = s.value) != null && $.draws_head) && !a.collapsed;
    });
    return ($, g) => {
      var M, C, R, U;
      return r(), F(Jw, {
        label: h.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        type: (C = s.value) != null && C.needs_user ? "waiting" : "",
        folded: !!((R = s.value) != null && R.folds) && e.folded,
        body: !!((U = s.value) != null && U.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[3] || (g[3] = (Z) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (r(), F(t2, {
            key: 0,
            "ends-at": L(ao)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: j(() => {
          var Z;
          return [
            I.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(D, { key: 1 }, [
              E(le, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", $2, [
                m("span", {
                  class: K(["dock-title", { strip: e.collapsed }]),
                  title: O.value
                }, v(O.value), 11, x2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Z = s.value) != null && Z.leaves_after_seconds ? k("", !0) : (r(), d(D, { key: 0 }, [
                V(v(l.value), 1)
              ], 64))
            ], 512),
            _.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = Se(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(D, null, ne(_.value, (ee) => {
                var pe, re;
                return r(), d(D, {
                  key: ee.action + ee.runs
                }, [
                  !N.value.has(ee.label) && (!((pe = ee.variants) != null && pe.length) || !((re = B.value) != null && re.state) || ee.variants.includes(B.value.state)) ? (r(), F(ve, {
                    key: 0,
                    variant: "icon",
                    class: K({ kept: ee.pressed }),
                    "aria-pressed": ee.pressed,
                    "aria-label": ee.label,
                    title: ee.label,
                    "data-dock-action": ee.action,
                    onClick: (we) => z(ee)
                  }, {
                    default: j(() => [
                      E(le, {
                        name: ee.icon,
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
        still: j(() => [
          w.value || e.refusal ? (r(), d("p", S2, v(w.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: j(() => {
          var Z;
          return [
            m("span", M2, [
              q.value ? (r(), d("span", {
                key: 0,
                class: K(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : k("", !0),
              x.value ? (r(), d("span", _2, v(x.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (Z = s.value) != null && Z.folds ? (r(), F(ve, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (ee) => n("fold"))
            }, {
              default: j(() => [
                V(v(s.value.folds) + " ", 1),
                E(Kt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            m("span", C2, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              E(zs, {
                name: `dock.${e.item.type}`,
                row: B.value,
                environment: L(p).environment,
                "read-only": L(p).readOnly,
                "object-name": L(ta)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (ee) => w.value = ee),
                onDone: $.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (r(!0), d(D, null, ne(P.value, (ee) => (r(), F(ve, {
                key: ee.action + ee.runs,
                small: "",
                variant: ee.primary ? "primary" : "ghost",
                bordered: !ee.primary,
                "data-dock-action": ee.action,
                onClick: (pe) => z(ee)
              }, {
                default: j(() => [
                  V(v(ee.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var Z;
          return [
            (Z = s.value) != null && Z.body_url ? (r(), F($s, {
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
}, il = /* @__PURE__ */ H(A2, [["__scopeId", "data-v-c4a0c2b2"]]), E2 = 24, O2 = 8, f6 = 420;
function h6({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= E2 ? !0 : e < t && s > O2 ? !1 : null;
}
const T2 = (e, t) => e === void 0 ? t : e, I2 = { me: 1, people: [] }, sa = zt({
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
  people: I2,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Jn("journal.activity", !0),
  wide: !1,
  sideMini: Jn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
pi("journal.activity", () => sa.activity);
pi("journal.side.mini", () => sa.sideMini);
const cr = "journal.viewer.";
function B2(e, t, n) {
  try {
    const a = n.getItem(cr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function R2(e, t, n) {
  try {
    n.setItem(cr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function rl(e, t, n = window.localStorage) {
  const a = T(B2(e, t, n));
  return ge(a, (s) => R2(e, s, n), { deep: !0 }), a;
}
const L2 = {
  key: "dock-all",
  class: "dock-all"
}, N2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var $, g;
    const t = e, n = Ek(500), a = T(/* @__PURE__ */ new Set()), s = Me(Ne), o = T(/* @__PURE__ */ new Set()), l = T({});
    async function i(M, C) {
      l.value = { ...l.value, [M.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, M.id]);
      const R = await bn(C, { id: M.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((U) => U !== M.id)), l.value = { ...l.value, [M.id]: `Could not dismiss this card: ${R.error}` });
    }
    const u = A(
      () => h2(
        t.items.filter((M) => !o.value.has(M.id)),
        n.value,
        a.value
      )
    ), c = A(
      () => m2(
        u.value.filter((M) => Ha(M, Rt)),
        n.value
      )
    ), f = A(() => u.value.filter((M) => !c.value.includes(M) && !Ha(M, Rt))), h = rl(`dock-size:${(($ = sa.identity) == null ? void 0 : $.root) || location.host}`, null), p = (M) => {
      var C;
      return !!((C = Rt(M.type)) != null && C.needs_user);
    }, y = T(/* @__PURE__ */ new Set()), b = T(/* @__PURE__ */ new Set()), O = A(() => u.value.length === 1), S = (M) => p(M) || O.value, x = (M) => S(M) ? y.value.has(M.id) || b.value.has(M.id) : h.value ? h.value.collapsed && !h.value.opened.includes(M.id) : t.collapsed, B = A(() => u.value.some(x));
    ge(() => t.collapsed, (M) => {
      b.value = new Set(M ? u.value.filter(p).map((C) => C.id) : []);
    });
    function W() {
      const M = !B.value;
      h.value = { collapsed: M, opened: [] }, y.value = new Set(M ? u.value.filter(p).map((C) => C.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function N(M) {
      var R;
      if (!x(M)) return;
      if (S(M)) {
        y.value = new Set([...y.value].filter((U) => U !== M.id)), b.value = new Set([...b.value].filter((U) => U !== M.id));
        return;
      }
      const C = (R = h.value) != null && R.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...C, M.id] };
    }
    const w = rl(`dock-folded:${((g = sa.identity) == null ? void 0 : g.root) || location.host}`, {}), z = (M) => {
      var C;
      return !!((C = Rt(M.type)) != null && C.folds) && (t.insidesFolded || T2(w.value[M.id], Ha(M, Rt) || t.folded));
    };
    function P(M) {
      z(M) && q(M), w.value = { ...w.value, [M.id]: !z(M) };
    }
    function q(M) {
      var C;
      !((C = h.value) != null && C.collapsed) || h.value.opened.includes(M.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, M.id] });
    }
    function _(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function I(M) {
      a.value = new Set([...a.value].filter((C) => C !== M.id));
    }
    return (M, C) => (r(), F(Bs, {
      tag: "div",
      name: "dock",
      duration: L(lr),
      class: "dock-stack"
    }, {
      default: j(() => [
        u.value.length > 1 ? (r(), d("div", L2, [
          E(ve, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": B.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: j(() => [
              E(Kt, {
                open: !B.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(D, null, ne(f.value, (R) => (r(), F(il, {
          key: R.id,
          item: R,
          class: K({ timed: L(Jt)(R) }),
          leaving: L(Jt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (U) => N(R),
          onFold: (U) => P(R),
          onUndock: (U) => i(R, U),
          onMouseenter: (U) => _(R),
          onMouseleave: (U) => I(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(D, null, ne(c.value, (R) => (r(), F(il, {
          key: R.id,
          item: R,
          class: K({ timed: L(Jt)(R) }),
          leaving: L(Jt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (U) => N(R),
          onFold: (U) => P(R),
          onUndock: (U) => i(R, U),
          onMouseenter: (U) => _(R),
          onMouseleave: (U) => I(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, m6 = /* @__PURE__ */ H(N2, [["__scopeId", "data-v-2c47a65e"]]), St = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Un = (e) => Math.min(Math.max(e, 0), 1), q2 = (e) => {
  const t = Un(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => q2((e - t) / (n - t));
function p6(e) {
  const t = Un(e), n = Un((t - 0.12) / 0.76) * St.shuffles, a = Math.min(Math.floor(n), St.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), u = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Un((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / St.shuffles, lift: St.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function g6(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const ul = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, v6 = (e) => ul[e] ?? ul.butler, so = 2400, D2 = 0.05;
function P2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, D2), l = Math.min(t + so * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function y6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function j2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function b6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const k6 = (e, t) => ({ ...e, stretch: t.stretch }), w6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, dr = (e, t) => t >= (e.least ?? 0);
function $6(e, t, n) {
  if (!dr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const x6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), F2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", cl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), W2 = (e) => e.right > e.left && e.bottom > e.top;
function S6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(F2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = cl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = cl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), W2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function fr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[p]) && (i = -1);
      else {
        const b = (o[h] - e[f]) / y, O = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(b, O)), i = Math.min(i, Math.max(b, O));
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
}, fn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), H2 = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => H2(fn(e, t, n)), z2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], pt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Dn = ([e, t], n) => e + n() * (t - e);
function U2(e) {
  return z2.map(() => {
    const t = Dn(pt.speed, e), n = Dn(pt.angle, e) * Math.PI / 180, a = Dn(pt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Dn(pt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const G2 = U2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function V2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * pt.gravity * (t[2] - pt.floor))) / pt.gravity;
}
function M6(e, t, n = G2) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = V2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * u);
  return c[2] -= pt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const _6 = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function C6(e, t) {
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
const A6 = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), Pt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function E6(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, i] = [t.left + Pt.margin * n, t.right - Pt.margin * n], u = Math.min(Math.max(e + o + s * Pt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function O6(e, t, n) {
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
function T6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Pt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = P2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const qe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function I6(e) {
  const t = qe.least + Math.floor(e() * (qe.most - qe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: qe.walls[Math.floor(e() * qe.walls.length)],
    along: qe.margin + e() * (1 - 2 * qe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ms(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * qe.margin, l = ((e.along - qe.margin + e.way * qe.speed * n / a) / s % 2 + 2) % 2, i = qe.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + qe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + qe.inset : t.right - qe.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function K2(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = j2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function B6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: i, shot: u } = K2(n, e.length), c = e.map((x, B) => ({ ...Ms(x, t, Math.min(n / o.fps, Gn(B).shot)), shot: B < u })), f = Te(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((x, B) => ({ bug: x, index: B, seconds: n / o.fps - Gn(B).shot, spot: Ms(x, t, Gn(B).shot) })).filter((x) => x.seconds >= 0), b = y.flatMap((x) => {
    const B = (s == null ? void 0 : s.get(x.index)) ?? Z2(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, B), s && e5(B, x.seconds, a), t5(B, x.seconds, a);
  }), O = y.filter((x) => X2(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * f, y: h.y + (p.y - h.y) * f, back: S }, slush: b, camera: O };
}
function Gn(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function R6(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const h = Gn(f), p = Ms(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), O = Math.abs(p.x - u) >= y ? u : p.x + b * y, S = b > 0 ? Math.max(u, Math.min(O, i)) : Math.min(u, Math.max(O, l)), x = { from: u, to: S, begin: h.walk, end: h.aim };
    return u = S, x;
  });
}
function L6(e, t, n) {
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
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Y2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Q2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const X2 = (e) => e.along * 97 % 1 < Ce.camera, hn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function J2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), h = hn(e, f), p = fr(i, h, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = h;
  }
  const u = hn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function Z2(e, t, n, a = []) {
  const s = Q2(e.along + 1), [o, l] = Y2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...J2(f, t, a) };
  });
}
function e5(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), i = fr(hn(a, o), hn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function t5(e, t, n = []) {
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
function N6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Oe.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, h = Te(e, [0, c]), p = Te(e, [c, c + f]);
  return l.map((y) => {
    const b = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * h,
      y: n.y + (b.y - n.y) * h,
      r: y.size * t * (0.15 + 0.85 * h * h),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: h >= 1
    };
  });
}
function q6(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], h = (O) => {
    const [S, x] = [O.x - e.at.x, O.y - e.at.y];
    return { x: i.x + S * c - x * f, y: i.y + S * f + x * c };
  }, [p, y] = [...n].sort((O, S) => O.x - S.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((O, S) => ({ from: O, to: S < b.length / 2 ? p : y })) };
}
const D6 = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function oa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: fn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: fn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function P6(e, t) {
  const n = Oe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = oa(n, t), l = 1 - (1 - n.small) * Te(a, n.shrinks) * (1 - Te(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = oa(n, t), o = n.flat * Te(a, n.squashes) * (1 - Te(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * fn(s, ...n.springs)) * (1 - fn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const j6 = (e) => e === "pack_box";
function F6(e) {
  const { into: t, out: n } = oa(Oe.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function W6(e) {
  const t = Oe.rope_swing, { into: n, out: a } = oa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const n5 = { after: 3 }, oo = 10, a5 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, s5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, o5 = { weight: 19 }, hr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, l5 = { every: 120 }, mr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, pr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, i5 = {
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
}, $n = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: oo }), ie = (e, t, n = {}) => $n(e, "clip", t, n), za = (e, t, n = {}) => $n(e, "look", t, n), dl = (e, t, n = {}) => $n(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...$n(e, "pick", t, n), ...a }), $e = (e) => $n("nothing", "nothing", e, {}), r5 = 120, u5 = 300, Ua = (e, t) => ({ ...ie(e, t), cooldown: u5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), c5 = () => [ie("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: a5[e.name] }), Xt = (e) => ({ ...e, shenanigan: !0, lasts: s5[e.name] }), ba = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ie("nod", 2), $e(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(ie("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(ie("bug_smash", 2)), toward: "", onto: !1 },
    ie("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [ie("startled", 2), ie("dismay", 1), ie("tantrum", 3), $e(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [ie("nod", 2), $e(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [ie("halo", 1), $e(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [ie("repent", 1), $e(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ie("nod", 4), ie("hand_rub", 4), $e(7)]),
  ...fe("question_asked", { cooldown: 60 }, [ie("ask_sign", 9), ie("look_up", 3), $e(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [dl("read", 3), ie("nod", 1), $e(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [dl("read", 3), $e(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), $e(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), $e(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, c5()),
  ...fe("bar_failed", { holds: !0 }, [ie("fume", 1), ie("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [ie("look_left", 2), ie("look_right", 2), ie("look_up", 1), $e(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [ie("tumble", 3), $e(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [ie("wipe_brow", 4), ie("look_left", 1), ie("look_right", 1), $e(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [ie("shake", 3), ie("tantrum", 2), $e(2)]),
  ...fe("refused", { cooldown: 20 }, [ie("shake", 1), $e(1)]),
  ...fe("work_done", { cooldown: 120 }, [ie("stretch", 2), $e(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [za("amused", 3), $e(2)]),
  ...fe("heard", { cooldown: 30 }, [
    ie("bow", 1, { voices: ["butler"] }),
    ie("salute", 1, { voices: ["squire"] }),
    ie("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    $e(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [ie("stumble", 3), $e(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [ie("glance", 7), $e(13)]),
  ...fe("typing", { cooldown: 60 }, [za("reading", 1), $e(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(i5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [za(t, 1)])),
  ...Object.entries(mr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(pr).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [ie(t, 1)])),
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
    { ...Xt($t(ie("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Xt($t(ie("disco", 2, { ball: "bubble" }))),
    $e(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: r5 }, [Ua("search", 3), { ...Ua("binoculars", 2), when: { home: !0 } }, { ...Ua("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [ie("type", 3), ie("type_ponder", 1)]),
  ...fe("held:compacting", {}, [ie("pack_box", 3), ie("vacuum", 2), ie("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), $e(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...$t(ie("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [ie("eager", 2, { slow: !0 }), $e(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [Xt($t(ie("backflip", 7, { high: !0 }))), ie("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: hr.build.cooldown }, [be("unit", o5.weight), $e(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: l5.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    be("rest", 35, {}, { stay: [25, 60] }),
    be("seat", 15, {}, { stay: [15, 40] }),
    be("edge", 25, {}, { stay: [8, 20] }),
    Xt(be("bubble", 15, {}, { stay: [30, 80] })),
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
    Xt($t(be("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], gr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), vr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), d5 = (e) => Array.isArray(e) ? e[0] : e, f5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, h5 = (e) => ba.some((t) => t.when.moment === e);
function m5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || vr(f).every(([h, p]) => n(h) >= d5(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = ba.filter((f) => gr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= n5.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Ve(e, t) {
  const n = m5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (yr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function yr(e, t, n) {
  var a;
  for (const [s, o] of vr(t)) (a = e.memory) == null || a.set(s, e.now + f5(o, n));
}
function H6(e, t, n) {
  yr(e, ba.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const z6 = (e) => Object.values(hr).find((t) => gr(t.when, e)) ?? null, p5 = (e, t, n) => n - t <= (e.lifetime ?? oo), U6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || dr(e.clip, t));
class br {
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
const _s = {
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
}, G6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), kr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), V6 = {
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
}, K6 = 120, g5 = 20, Y6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < g5), v5 = (e) => _s[e] || _s.idle, Q6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, wr = "airborne", y5 = "landing", b5 = "travelling", $r = "grounded", X6 = ({ airborne: e, landing: t, trip: n }) => e ? wr : t ? y5 : n != null && n.started ? b5 : $r;
function J6(e, t) {
  var s;
  const n = k5(e, t);
  return e.mode === $r && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function k5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === wr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...w5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : v5(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function w5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Cs = (e) => e.outcome, $5 = /^plugin:[^:]+:sins:/, fl = (e) => e.type === "plugins.card" && $5.test(e.markKey), x5 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => fl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => fl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], Z6 = (e, t) => e.filter((n) => n.author === "user" && na(n.read_at) > t).map((n) => ({ beat: "read_message", time: na(n.read_at), card: Ci(n) })).sort((n, a) => n.time - a.time), hl = { user: "reacted", agent: "agent_reacted" };
function eM(e, t) {
  return e.filter((n) => hl[n.author] && Ct(n) > t).map((n) => ({ beat: `${hl[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const S5 = [.../* @__PURE__ */ new Set([...Object.values(mr).flatMap((e) => Object.keys(e)), ...Object.keys(pr)])];
function tM(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = S5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: Ci(n) })).sort((n, a) => n.time - a.time);
}
const M5 = (e) => new br(e).isTest(), la = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Cs(e)] || "";
}, _5 = 1800, C5 = (e, t) => {
  if (la(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && la(n) !== "finished" && Number(e.time) - Number(n.time) <= _5 ? "tests_fixed" : "tests_passed";
};
function nM(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(M5), s = a.filter((i) => la(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, la(i))), o.map((i) => ({ beat: C5(i, s), time: Number(i.time), card: i.key }));
}
function aM(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Cs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Cs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const sM = (e) => e.map((t) => {
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
function oM(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function lM(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function iM(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = x5.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function lo(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const ml = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function A5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    lo(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function rM(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : h5(`held:${e}`) ? "idle" : e;
}
const Le = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function uM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Le.ahead * n ? 180 : Math.sign(a) * Le.turn;
}
const pl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function cM(e, t) {
  const n = Math.min(Le.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Le.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Le.lines, Math.floor((e.bottom - e.top - 2 * a) / Le.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Le.sweep) % s, i = o % Le.sweep, u = Le.sweep - Le.returnSeconds, c = pl((i - u) / Le.returnSeconds), f = i <= u ? pl(i / u) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * Le.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const gl = 3, xr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, vl = 12, dM = (e, t) => ({ mood: e, began: t, seen: 0 });
function fM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!xr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= gl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * vl) / vl, lasts: gl } };
}
const hM = (e) => e.posture === "hang" && !xr(e.face), E5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), O5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function mM(e, t, n) {
  return E5.has(e) ? 1 / 0 : !O5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Sr(n - t.began, t.share) - lt.lead, 0);
}
const T5 = 5;
function pM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= T5 ? { beat: "long_walk", time: n } : null };
}
const I5 = 30, Pn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function gM(e, t, n, a, s = null) {
  if (t && n < t.until || !Pn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, i] = Pn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Pn.every } : { state: e, began: 0, until: 0, next: n + Pn.every };
}
const vM = (e, t, n) => t && n < t.until && kr.has(e.state) ? { state: t.state, since: t.began } : e, lt = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Sr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function yM(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Sr(o, e.share);
  return s ? { eager: B5(t, l), moment: null } : l > lt.lead ? { eager: t, moment: null } : l < lt.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > lt.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < lt.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function B5(e, t) {
  return e.on && t > lt.lead + lt.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= lt.lead && t >= lt.least ? { ...e, on: !0, calm: !1 } : e;
}
const R5 = 1, L5 = { look: "look", gaze: "gaze" };
function N5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [L5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const q5 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), D5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > R5 * t, memory: a, now: s, room: o }, n).name === "backflip", P5 = { work: ["building"], idle: ["standing"] };
function bM(e, t, n, a) {
  const s = _s[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(P5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), kr.has(e) ? { moments: o, began: n || a } : (n && a - n >= I5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function j5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const yl = { pondering: j5 };
function kM(e, t, n, a, s, o) {
  if (yl[e.beat]) {
    const i = yl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = N5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== oo && { lifetime: l.lifetime } } } : null;
}
function wM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = q5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const $M = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function xM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function SM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const MM = (e, t) => !!(e != null && e.watches) && !t.once, _M = 10, CM = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || p5(a, a.queuedAt, n)), AM = (e, t) => t ? null : e[0] ?? null;
function EM(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const OM = (e, t) => !t.during || !e.some((n) => n.during === t.during), F5 = 2 * Math.PI, W5 = 500;
function TM(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / W5, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = F5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, O = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? z5(y, t, n, p, s) : G5(y, t, n, p) : t) ?? y, S = O != null && O.behind && O.mood === "reading" ? H5(e.point, O, n, l, s) : O;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: a };
}
function H5(e, t, n, a, s) {
  const o = (_) => _ * 180 / Math.PI, l = (_) => o(Math.atan2(Math.sin(_ * Math.PI / 180), Math.cos(_ * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : f, b = y + l(c - y), O = Math.min(Math.max(a / 1e3, 0), 0.1), S = Le.turnSpeed * O, x = h ? y + Math.min(Math.max(b - y, -S), S) : b, B = h ? e.readingFollow + p : x, W = B + (x - B) * (1 - Math.exp(-O / Le.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, w = o(lo(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), z = Math.min(Math.max(w, -N.up), N.down), P = Le.tipSpeed * O, q = h ? e.readingPitch + Math.min(Math.max(z - e.readingPitch, -P), P) : z;
  return { ...t, readingYaw: x, readingFollow: W, readingPitch: q, readingFacing: i };
}
function z5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (B) => {
    const { yaw: W, pitch: N } = lo(B.x - n.x, s, n.y - B.y, o);
    return { yaw: W, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [ml(i(e)), ml(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [p, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [b, O, S] = u.map((B, W) => p * B + y * c[W]), x = s * b / O;
  return { ...t, x: n.x + x, y: n.y - A5(x, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const U5 = 0.15;
function IM(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= U5;
}
function G5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const V5 = (e) => !(e != null && e.on);
function BM(e, t, n) {
  if (V5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const mn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, at = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ga = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), bl = (e) => e * e * (3 - 2 * e);
function K5(e) {
  if (e < 0 || e >= at.seconds) return null;
  const t = Ga(e, ...at.flicker), n = Math.floor(t * at.flickers * 2) % 2 === 0, a = e < at.flicker[1] ? n ? 0.35 + 0.5 * t : at.dim : 1;
  return { strength: 1 - bl(Ga(e, ...at.fade)), lit: a, white: e < at.flash[0] ? 0 : 1 - bl(Ga(e, ...at.flash)) };
}
const RM = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function LM(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = K5(t - e.at);
  return a && { colour: mn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: at.signs[e.tone], ...a } };
}
function NM(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function qM(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= mn.looks || a === null && n - e.since >= mn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function DM(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const mt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, PM = { behind: 39, figure: 40, ahead: 41 }, Y5 = "[data-figure-pile]", Q5 = { amber: [1, 0.69, 0.125], good: mn.colours.good, bad: mn.colours.bad }, Vn = { phases: 4, ms: 230, dim: 0.25 }, jM = (e, t, n) => e !== "amber" || (t + n) % Vn.phases < Vn.phases / 2 ? 1 : Vn.dim, FM = (e) => e === "amber" ? Vn.phases : 1;
function WM(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const HM = Object.keys(Q5), Ye = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Zt = ([e, t], n) => e + n() * (t - e);
function zM(e) {
  const t = Ye.least + Math.floor(e() * (Ye.most - Ye.least + 1));
  return Array.from({ length: Math.min(t, Ye.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ye.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Zt(Ye.start, e), l = Zt(Ye.reach, e);
    return {
      text: Ve({ moment: "digit" }, e).name,
      x: a * o,
      y: Ye.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Zt(Ye.moveMs, e)),
      fadeMs: Math.round(Zt(Ye.fadeMs, e))
    };
  });
}
const Va = { high: 3, gap: 1 };
function UM(e) {
  const t = Math.floor(e / Va.high);
  return { left: -(mt.inside + mt.width / 2 + t * (mt.width + Va.gap)), up: e % Va.high * (mt.height - mt.top) };
}
const X5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, J5 = { after: 5 }, Z5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new br(t).isBuild());
function GM(e, t, n) {
  const a = Z5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= J5.after ? s : null;
}
function VM(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: X5(n, a, s) } : null;
}
const kl = { ahead: 140, up: 70 };
function KM(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * kl.ahead, y: a - kl.up } } : o ? { at: { x: n(o), y: a - o.up - mt.height } } : t ? { at: null } : null;
}
const Ka = { least: 4e3, most: 1e4 }, e$ = (e) => Ka.least + e() * (Ka.most - Ka.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function YM(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = e$(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const QM = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), XM = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Mr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), JM = new Set(ba.filter((e) => Mr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), t$ = (e) => e.some((t) => t.state === "built"), ZM = (e, t) => t$(t) ? e.filter((n) => !Mr.has(n.beat)) : e, vt = { reach: 40, room: 6 }, n$ = (e, t) => t <= e - vt.reach + 2, e_ = (e, t, n) => n$(e, n) ? t - vt.reach : e - vt.reach - vt.room, t_ = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, Ya = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, n_ = (e) => Zt(e() < Ya.longShare ? Ya.long : Ya.short, e), a$ = 2 * mt.width;
function a_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= a$ ? o : e + (o - e + s / 2) % s;
}
const s$ = 60, s_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= s$, wl = "[data-figure-home]", xn = () => {
  var t;
  const e = document.querySelector(wl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(wl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, o$ = "[data-figure-docked-bars]", l$ = "[data-figure-chat-foot]", i$ = [0.85, 0.6, 0.35, 0.15], r$ = ["question", "waiting", "suggestion"], o_ = (e, t) => r$.find((n) => e[n] > 0 && t[n] === "behind") || null;
function l_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const u$ = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", c$ = "[data-figure-newest]";
function _r() {
  var a, s;
  const e = (a = xn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(c$), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !io(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function pn(e, t, n = _r()) {
  if (!e || !n) return !0;
  const a = ct(e, t), s = wa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ie.top * t.size, bottom: a.top + Ie.bottom * t.size }, l = St.gap;
  return !ka(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function i_(e, t, n, a = _r()) {
  if (!a || pn(t, e, a)) return null;
  const s = wa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Ot(), u = t.posture === "stand" ? uo * e.size : Rr * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - St.gap - l, a.right + St.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && pn(p, e, a) && P$(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Qa = 0.26, Cr = 0.54, d$ = 1.25 / 5.4, Sn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Qa, travels: "stand" },
  lounge: { drop: Qa, travels: "stand" },
  composed: { drop: Qa, travels: "stand" },
  hang: { drop: Cr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, r_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * d$ * Math.cos(t * Math.PI / 180),
  y: 1 - n - Cr
}), nn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), f$ = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), u_ = (e, t) => (e === "sit" ? f$.has(t) : nn.has(e)) ? e : "stand";
function c_(e, t) {
  return e.facing === t.facing || !nn.has(e.posture) && !nn.has(t.posture) ? t : { posture: "stand", facing: nn.has(e.posture) ? e.facing : t.facing };
}
const d_ = 0.25, f_ = (e, t) => nn.has(e) && Sn[t].drop === 0, Ar = 2, h$ = 90, m$ = 180, p$ = 140, g$ = 280, v$ = 420, y$ = 0.25, b$ = 290, k$ = 600, w$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", $$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", Xa = 5;
function ia(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Xa) return null;
  (l || i) && (o = Math.max(o, Ar));
  const y = o > 1, b = Math.abs(t.x - e.x), O = b < Xa ? 0 : b / (h$ * o) * 1e3, S = Math.min(O, y ? p$ : m$), x = Math.abs(t.y - e.y), B = t.y < e.y, W = B && !p && D5(x, n, u, c, f, h), N = B ? v$ + Math.min(x, 400) * y$ : Math.sqrt(2 * x / so) * 1e3, w = {
    x: t.x,
    y: t.y,
    ms: x > Xa ? W ? k$ : N : 0,
    lead: W ? b$ : B ? g$ : 0,
    easing: B ? w$ : $$,
    hopping: !0,
    clip: W ? "backflip" : B ? "jump" : "fall"
  }, z = { x: t.x, y: t.y, ms: O + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, P = p ? x$(t, n) : w, q = B && !a ? [{ ...z, y: e.y }, P] : [{ ...w, x: e.x }, z];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const x$ = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), S$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], h_ = (e, t, n) => e.posture === "walk" && n ? "walk" : S$(e.clip, t), ct = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Sn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ka = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, io = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = xn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const jn = 0.5, $l = 20;
function m_(e, t, n = Ot()) {
  const a = ct(e, t);
  return a.left >= n.left + $l && a.right <= n.right - $l;
}
function ro(e, t, n = Ot()) {
  const a = ct(e, t), s = a.right - a.left, o = wa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - jn && i <= n.right + jn && a.top >= n.top - jn && u <= n.bottom + jn;
}
const ra = [0.35, 0.5, 0.65], ua = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ie = { left: ra[0], right: ra.at(-1), top: ua[0], bottom: ua.at(-1) }, M$ = 0.24;
function wa(e) {
  if (e.posture === "stand") return { left: Ie.left, right: Ie.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + M$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ie.left, t), right: Math.max(Ie.right, t) };
}
function _$(e, { size: t }, n = Ot()) {
  const a = wa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const uo = (Ie.right - Ie.left) / 2 + 0.08;
function p_(e, t) {
  return e === "hang" ? Ie : { ...Ie, bottom: Math.min(Ie.bottom, 1 - t - Sn[e].drop) };
}
const C$ = "[data-figure-agent]";
function Er(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !io(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const Or = (e) => ua.flatMap(
  (t) => ra.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function co(e, t, n = "") {
  if (!pn(e, t)) return ra.length * ua.length;
  const a = ct(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(u$)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && ka(s, u) && io(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return Or(s).filter(([i, u]) => l(i, u) || Er(i, u, n)).length;
}
function A$(e, t) {
  const n = ct(e, t);
  return Or({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Er(a, s, "", C$)).length;
}
const xl = 4;
function g_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = xl; o <= s; o += xl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!A$(i, e) && pn(i, e)) return i;
    }
  return null;
}
function gn(e, t, n) {
  const a = Ot(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => ro(l, t, a) && pn(l, t)).map((l) => ({ spot: l, covered: co(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Tr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), E$ = [0.5, 0.25, 0.75], O$ = (e) => Tr(e.getBoundingClientRect(), E$), Ir = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, T$ = uo, I$ = (e, t, { size: n }, a = T$) => Br(e, Ir[t], a * n, "stand");
function Br(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const B$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Rr = 0.1, R$ = (e, t, { size: n }) => Br(e, B$[t], Rr * n, "sit"), L$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ja = 60;
function v_(e, t) {
  const n = L$(t);
  return !e.aside || Math.abs(n) >= Ja ? t : n < 0 ? 360 - Ja : Ja;
}
const an = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, N$ = (e) => [.../* @__PURE__ */ new Set([e, ...an.turns.map((t) => (t + 360) % 360)])];
function y_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = N$(t), l = an.every[0] + a() * (an.every[1] - an.every[0]);
  return { face: t, from: s ? q$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function q$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / an.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function b_(e, t) {
  const { element: n, edge: a } = $a(), s = ["left", "right"].map((i) => Mn(R$(a, i, e), e)).filter((i) => n && ro(i, e) && !co(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function k_(e, t, { size: n }) {
  const a = (Ie.right - Ie.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Lr } : e;
}
const Lr = 7;
function Nr() {
  const e = [...document.querySelectorAll(Y5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function D$(e, t) {
  const n = ct(e, t), a = n.right - n.left;
  return { left: n.left + Ie.left * a, right: n.left + Ie.right * a, top: n.top + Ie.top * a, bottom: n.bottom };
}
function P$(e, t) {
  const n = Nr();
  return !n || !ka(D$(e, t), n);
}
const j$ = 4;
function $a() {
  const e = _n(), t = Nr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > j$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Lr - n, 0) } };
}
const w_ = ({ size: e, below: t }) => (1 - t) * e;
function Mn(e, t) {
  const n = Ot(), { size: a, below: s } = t, o = Sn[e.posture].drop * a;
  return { ..._$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const As = (e, t) => Object.keys(Ir).map((n) => Mn(I$(e, n, t), t)), fo = (e, t) => Tr(e, i$).map((n) => Mn(n, t)), qr = (e, t, n) => gn(e, t, n) ?? e[0];
function $_(e, t) {
  const { element: n, edge: a } = $a();
  return { ...qr(As(a, e), e, t), view: null, on: n };
}
function x_(e, t, n, a) {
  const { element: s, edge: o } = $a(), l = (a ? As(o, t) : [...As(o, t), ...fo(o, t)]).filter(
    (c) => !ka(ct(c, t), e)
  ), i = gn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !co(i, t) ? i : gn(l, t, n);
  return u && { ...u, view: null, on: s };
}
function _n() {
  var a;
  const e = xn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(o$);
  if (!t) return { ...xa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Sl = { within: 2 };
function S_(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = xa().edge;
  return a.left > s.left + Sl.within || a.left + a.width < s.left + s.width - Sl.within;
}
const F$ = "[data-figure-closing]";
function M_() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(F$));
}
const Dr = "[data-figure-progress]";
function __(e) {
  const t = e.querySelector(Dr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function C_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const W$ = { across: 300, above: 380, below: 60 };
function A_(e) {
  const { across: t, above: n, below: a } = W$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: H$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const H$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Pr = "[data-figure-bar]", Es = { back: 144, along: 0.4 };
function E_(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(Pr) : null;
  if (!(s != null && s.querySelector(Dr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Mn({ x: o - Es.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function O_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Es.along * a.size ? t.x + Es.along * a.size : e.x, y: e.y, behind: !0 };
}
function T_(e) {
  const t = e.querySelector(Pr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function xa() {
  const e = xn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function I_(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = xa(), u = n === null ? z$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Mn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function z$(e, t, n, a, s) {
  const o = fo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + mt.width < s && u.x + a - vt.reach - vt.room >= l);
  return gn(i.length ? i : o, t, n);
}
const U$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function B_(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Ar));
  const y = (W) => {
    const N = ct(W, n, Sn[W.posture].travels);
    return { x: N.left, y: N.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return G$(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [O, ...S] = [e, ...u, t].map(y), x = ia(O, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: h, pogo: p }), B = S.slice(1).map((W, N) => {
    var w;
    return (w = ia(S[N], W, n.size, { random: i, memory: c, now: f, room: h })) == null ? void 0 : w.legs.find((z) => z.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...B.filter(Boolean)] };
}
function G$(e, t, n, a, s, o, l) {
  const i = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / U$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ia(e, n, o.size, { pace: l }) : ia(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function R_(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function L_(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && gn(O$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = $a();
  return { ...qr(fo(s, t), t, n), view: null, on: a };
}
const V$ = "[data-figure-bubble]", K$ = 250;
let sn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), jr = 0;
const Yt = () => sn, Za = /* @__PURE__ */ new WeakMap();
let Y$ = 0;
function ho(e) {
  return Za.has(e) || Za.set(e, `floor-${++Y$}`), Za.get(e);
}
const Q$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, X$ = () => {
  var e, t;
  return ((t = (e = xn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function J$(e, t) {
  var a;
  const n = (a = e.querySelector(l$)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Z$(e, t) {
  const n = e && J$(e, t), a = e ? [...e.querySelectorAll(V$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Q$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: ho(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const e4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= K$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Fr(e = sn, t = performance.now()) {
  const n = Ot(), a = X$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = xa();
  return c.element && u.push({ id: ho(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...Z$(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: e4(e, f, t) }))) });
}
const Os = /* @__PURE__ */ new Set();
function t4(e) {
  return Os.add(e), () => Os.delete(e);
}
function n4() {
  Wr();
  const e = () => {
    jr = requestAnimationFrame(e), !document.hidden && (sn = Fr(sn), Os.forEach((t) => t(sn)));
  };
  e();
}
function Wr() {
  cancelAnimationFrame(jr);
}
const mo = 5, a4 = 56, s4 = { share: 0.6 }, o4 = (e) => -Math.sqrt(2 * so * s4.share * e), Ht = (e, t) => e.find((n) => n.id === t) ?? null;
function N_(e, t = Fr().floors) {
  const n = Ht(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ho(e.on) : null, o = s && Ht(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Hr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Yt().floors) {
  const c = Ht(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || l4(c, f, o)) && i4(f, i, u) ? { x: f.x, y: f.y } : null;
}
const po = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, l4 = (e, t, n) => !po({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function q_(e, t = Yt().floors) {
  if (!po(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= mo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function i4(e, t, n = Yt().floors) {
  const a = Ht(n, "home");
  return e.posture === "hang" && a && ct(e, t).bottom >= a.top ? !1 : ro(e, t);
}
function D_(e, t, n, a = Yt().floors) {
  const s = Hr(e, n, a);
  if (!e.home) return r4(e, t, s, a);
  if (!s) return null;
  const o = Ht(a, "home"), l = s.y - t.y, i = l > mo ? "dropping" : -l > a4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function r4(e, t, n, a) {
  const s = n ? Ht(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: o4(e.risen) };
  if (!n) return null;
  if (po(t) && n.y - t.y > mo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function P_(e, t, n) {
  const a = uo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function j_(e, t, n, a = Yt().floors) {
  const s = t && Hr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const u4 = ["data-type"], c4 = { class: "figure-floor-name" }, d4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", c4, v(e.floor.type), 1)
    ], 12, u4));
  }
}, f4 = /* @__PURE__ */ H(d4, [["__scopeId", "data-v-4e0f1e2e"]]), h4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, m4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Xe(Yt().floors);
    let n = () => {
    };
    return _e(() => {
      n = t4((a) => t.value = a.floors), n4();
    }), Be(() => {
      n(), Wr();
    }), (a, s) => (r(), d("div", h4, [
      (r(!0), d(D, null, ne(t.value, (o) => (r(), F(f4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, F_ = /* @__PURE__ */ H(m4, [["__scopeId", "data-v-e519168b"]]), on = (e) => typeof e == "number" ? e : Date.parse(e);
function W_(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: on(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => on(s.row.created_at) - on(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Ml = 20;
async function H_(e, t, n) {
  for (let a = 0; a < Ml; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || on(o.created_at) <= on(s.created_at) || !await n()) return a;
  }
  return Ml;
}
const p4 = 3, es = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function g4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = es[n.grouping]) == null ? void 0 : a.call(es, e.row, n)) || "";
}
function v4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function z_(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= p4 ? [v4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = g4(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function y4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const U_ = (e) => (t) => t.filter((n) => n.id !== e), G_ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), V_ = (e) => (t) => [...t, e], K_ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function Y_(e, t = {}) {
  const n = tt(), a = T(null), s = T("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function Q_(e) {
  const t = tt(), n = T("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Fn = /* @__PURE__ */ new Map();
function b4(e, t) {
  if (Fn.has(e)) return Fn.get(e);
  const n = t().finally(() => Fn.delete(e));
  return Fn.set(e, n), n;
}
function X_() {
  const e = tt(), t = T(null), n = T("");
  async function a() {
    const s = await b4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const k4 = { class: "cards-page" }, w4 = { class: "cards-bar" }, $4 = { class: "cards-count" }, x4 = { class: "cards" }, S4 = {
  key: 1,
  class: "cards-note"
}, M4 = {
  key: 2,
  class: "cards-note"
}, _4 = ["data-row", "onClick"], C4 = { class: "card-head" }, A4 = { class: "card-title" }, E4 = { class: "card-foot" }, O4 = {
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
    return (a, s) => (r(), d("div", k4, [
      m("div", w4, [
        m("span", $4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        E(ve, Pe({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            E(le, {
              name: "plus",
              size: 12
            }),
            V(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", x4, [
        e.loaded ? e.failure ? (r(), d("p", S4, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", M4, "No " + v(e.term) + "s yet", 1)) : (r(), F(Ke, {
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
          m("span", C4, [
            E(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            V(" " + v(e.head(o)), 1),
            E(Ze, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", A4, v(e.title(o)), 1),
          m("span", E4, v(e.foot(o)), 1)
        ], 8, _4))), 128))
      ]),
      he(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, J_ = /* @__PURE__ */ H(O4, [["__scopeId", "data-v-b39fea5d"]]), _l = "newest";
function Z_(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(Ne, null)) == null ? void 0 : c.search, s = T(""), o = T(_l), l = T("all"), i = A(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((p) => y4(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === _l ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), u = A(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const T4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, I4 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, B4 = 40, R4 = "top", L4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Me(Ne, null)) == null ? void 0 : p.autoScroll, s = A(() => a === R4), o = T(null), l = T(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= B4, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    ge(() => {
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
    }), et(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (r(), d("div", T4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: K(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        he(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", I4, [
        E(Ut, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: j(() => [
            Je(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              E(le, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = V(" Newest ", -1))
            ], 512), [
              [Nl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, eC = /* @__PURE__ */ H(L4, [["__scopeId", "data-v-d704d7e3"]]), N4 = ["aria-selected", "data-tab", "onClick"], q4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, D4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Me(Ne, null), o = A(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = T(null), i = T({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => je(() => c(!0));
    let h = null;
    return _e(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Be(() => h == null ? void 0 : h.disconnect()), ge(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), ge(() => n.answer, f, { deep: !0 }), (p, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(D, null, ne(o.value, (b) => {
        var O, S;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: K(["inner-tab", { on: ((O = e.active) == null ? void 0 : O.key) === b.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === b.key,
          "data-tab": b.key,
          onClick: (x) => a("choose", b)
        }, [
          V(v(b.label) + " ", 1),
          u(b) ? (r(), d("span", q4, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, N4);
      }), 128)),
      m("i", {
        class: K(["inner-tabs-line", { slides: i.value.slides }]),
        style: ye({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, tC = /* @__PURE__ */ H(D4, [["__scopeId", "data-v-63fcd326"]]), P4 = { class: "task-bar" }, j4 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", P4, [
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
}, nC = /* @__PURE__ */ H(j4, [["__scopeId", "data-v-a4fc52ae"]]), F4 = {
  class: "tab-body",
  "data-tab-body": ""
}, W4 = { "data-tab-content": "" }, H4 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = T(!1);
    let a = 0;
    return ge(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Rs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", F4, [
      n.value ? (r(), F(Ke, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      Je(m("div", W4, [
        he(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Nl, !n.value]
      ])
    ]));
  }
}, aC = /* @__PURE__ */ H(H4, [["__scopeId", "data-v-63876533"]]), z4 = {
  class: "search-bar",
  "data-search-bar": ""
}, U4 = { class: "search-bar-control" }, G4 = ["value", "placeholder", "aria-label"], V4 = ["aria-expanded"], K4 = {
  key: 0,
  "data-menu-count": ""
}, Y4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = au(), l = ((x = Me(Ne, null)) == null ? void 0 : x.search) ?? {}, i = A(() => l.placeholder || a.placeholder), u = l.context ?? [], c = T(null), f = T(null), h = T([]), p = A(() => h.value.length ? h.value[h.value.length - 1].next : u), y = A(() => !!o.menu || u.length > 0), b = (B) => {
      h.value = [], f.value = f.value ? null : B.currentTarget;
    };
    function O(B) {
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
      return r(), d("div", z4, [
        m("div", U4, [
          E(le, {
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
          }, null, 40, G4),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            E(le, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: b
          }, [
            e.menuCount ? (r(), d("span", K4, v(e.menuCount), 1)) : k("", !0),
            E(le, {
              name: "caret",
              size: 12
            })
          ], 8, V4)) : k("", !0)
        ]),
        (N = L(l).button) != null && N.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = (w) => s("pick", L(l).button.click))
        }, v(L(l).button.title), 1)) : k("", !0),
        he(B.$slots, "default", {}, void 0, !0),
        f.value ? (r(), F(ma, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: W[3] || (W[3] = Se(() => {
          }, ["stop"])),
          onClose: W[4] || (W[4] = (w) => f.value = null)
        }, {
          default: j(() => [
            h.value.length ? (r(), F(ze, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = (w) => h.value = h.value.slice(0, -1))
            }, {
              default: j(() => [
                V("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(D, null, ne(p.value, (w) => (r(), F(ze, {
              key: w.title,
              description: w.subtext,
              "data-search-entry": w.title,
              onClick: (z) => O(w)
            }, {
              default: j(() => [
                V(v(w.title) + v(w.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? k("", !0) : he(B.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Q4 = /* @__PURE__ */ H(Y4, [["__scopeId", "data-v-45374bed"]]), X4 = {
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
    return (o, l) => (r(), F(Q4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: j(() => [
        E(Mt, null, {
          default: j(() => [...l[2] || (l[2] = [
            V("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(D, null, ne(a, (i) => E(ze, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: j(() => [
            V(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(D, { key: 0 }, [
          E(Mt, null, {
            default: j(() => [...l[3] || (l[3] = [
              V("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(D, null, ne(s, (i) => E(ze, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: j(() => [
              V(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: j(() => [
        he(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, sC = /* @__PURE__ */ H(X4, [["__scopeId", "data-v-dab0064d"]]);
function oC() {
  const e = T(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const lC = (e) => import(
  /* @vite-ignore */
  e
), J4 = 86400, Ts = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Z4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ts(t) - Ts(e)) / J4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function iC(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ts(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Z4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ts = 280, ns = 240, as = 120, ex = 6, tx = 14, vn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function nx(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function zr(e, t) {
  const n = Math.max(0, nx(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function ax(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${tx}px)` }), e.offsetHeight, e.style.transition = `height ${ts}ms ${vn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = zr(t, e));
    const p = s() - i;
    if (!u && p >= ts && (u = !0, e.style.transition = `opacity ${ns}ms ease-out, transform ${ns}ms ${vn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < ts + ns) return a(h);
    f();
  };
  return a(h), f;
}
function rC(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${ex}px)` }), e.offsetHeight, e.style.transition = `opacity ${as}ms ease-out, transform ${as}ms ${vn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = zr(t, e)), s() - l < as) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const sx = 140, Wn = 220, Cl = 5;
function uC({ gap: e = sx, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, h) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), h();
    });
  }
  function u() {
    const f = n.splice(0, Cl);
    if (s = f.length > 0, !s) return;
    let h = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(u, e));
      });
  }
  const c = (f, h, p, y = ax) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: f, options: h, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Cl && c.flush();
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
function cC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Wn}ms ${vn}, opacity ${Wn}ms ease-in, margin ${Wn}ms ${vn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Wn);
}
const Ur = "chat.pins.minimised", Kn = T(Jn(Ur, !1));
function Al(e) {
  Kn.value = e, Us(Ur, e);
}
function ox(e) {
  const t = A(() => e()), n = A(() => Kn.value ? [] : e()), a = () => Al(!Kn.value), s = Date.now() / 1e3;
  return ge(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && Al(!1)
  ), { pins: t, visible: n, minimised: Kn, toggle: a };
}
const lx = ["title"], ix = {
  key: 0,
  class: "pins-count"
}, rx = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = ox(() => t.pinRows);
    return (o, l) => L(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: K(["pins-toggle", { minimised: L(a), inline: e.inline }]),
      title: L(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = Se((...i) => L(s) && L(s)(...i), ["stop"]))
    }, [
      E(le, {
        name: L(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      L(a) ? (r(), d("span", ix, v(L(n).length), 1)) : k("", !0)
    ], 10, lx)) : k("", !0);
  }
}, dC = /* @__PURE__ */ H(rx, [["__scopeId", "data-v-d073c504"]]), ux = ["title"], cx = ["title"], dx = { class: "diff-card-dir" }, fx = { class: "diff-card-name" }, hx = ["title"], mx = ["title"], px = {
  key: 0,
  class: "diff-card-note"
}, gx = ["href"], vx = ["src", "alt"], yx = { class: "diff-card-rows" }, bx = { class: "diff-row-num" }, kx = { class: "diff-row-sign" }, wx = { class: "diff-row-code" }, $x = {
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
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, u = A(() => n.path.lastIndexOf("/") + 1), c = A(() => n.path.slice(0, u.value)), f = A(() => n.path.slice(u.value)), h = A(() => n.change === "deleted"), p = A(() => l[n.change]), y = A(() => new Set(n.rows.filter((I) => I.line_type === "add").map((I) => I.line))), b = T("after"), O = A(() => b.value === "before" ? n.whole.old : n.whole.text), S = A(() => n.whole && n.whole.text !== void 0 ? O.value.split(`
`).map((I, $) => ({ line_type: b.value === "after" && y.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: I })) : n.rows.filter(
      (I) => !(n.editsOnly && ["ctx", "fold"].includes(I.line_type)) && !(n.hideRemovals && I.line_type === "del")
    )), x = T(!1), B = A(() => n.lines && !x.value && !n.whole), W = A(() => B.value ? S.value.slice(0, n.lines) : S.value), N = A(() => S.value.length - W.value.length), w = (I) => I.line === null || I.line_type === "del" ? "" : I.line, z = (I) => I.line_type === "fold" ? I.hidden ? `⋯ ${I.hidden} lines` : "⋯" : I.text, P = T(null), q = T(null);
    let _ = null;
    return _e(() => {
      if (!q.value) return;
      let I = !0;
      _ = new ResizeObserver(() => {
        !P.value || !q.value || (P.value.style.transition = I ? "none" : "", P.value.style.height = `${q.value.offsetHeight}px`, I = !1);
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
          m("span", dx, v(c.value), 1),
          m("span", fx, v(f.value), 1),
          p.value ? (r(), d("span", {
            key: 0,
            class: K(["diff-card-badge", e.change])
          }, v(p.value), 3)) : k("", !0)
        ], 8, cx),
        m("span", {
          class: K(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: K(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        E(Ze, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: $[0] || ($[0] = Se((g) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, hx)) : k("", !0),
        h.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: K(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: $[1] || ($[1] = Se((g) => a("whole"), ["stop"]))
        }, [
          E(le, {
            name: "file",
            size: 12
          })
        ], 10, mx))
      ], 8, ux),
      e.whole && e.whole.error ? (r(), d("p", px, v(e.whole.error), 1)) : k("", !0),
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
          }, null, 8, vx)
        ], 8, gx)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: P,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            m("div", yx, [
              (r(!0), d(D, null, ne(W.value, (g, M) => (r(), d("div", {
                key: M,
                class: K(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", bx, v(w(g)), 1),
                m("span", kx, v(i[g.line_type]), 1),
                m("span", wx, v(z(g)), 1)
              ], 2))), 128)),
              N.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: $[3] || ($[3] = Se((g) => x.value = !0, ["stop"]))
              }, v(N.value) + " more " + v(N.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, fC = /* @__PURE__ */ H($x, [["__scopeId", "data-v-23581cbb"]]), xx = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), F(ut(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: j(() => [
        he(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: K(["tip", e.place]),
          role: "tooltip"
        }, [
          he(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, hC = /* @__PURE__ */ H(xx, [["__scopeId", "data-v-683e1839"]]), Sx = { "data-queue-controls": "" }, Mx = { class: "counts" }, _x = { "data-queue-spots": "" }, Cx = {
  class: "spots",
  "aria-label": "Places in use"
}, Ax = { "data-queue-waiting": "" }, Ex = { key: 0 }, Ox = { class: "control" }, Tx = { class: "stepper" }, Ix = ["disabled"], Bx = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, Rx = ["disabled"], Lx = ["for"], Nx = ["id", "value", "disabled", "onChange"], qx = { class: "control" }, Dx = ["aria-checked", "disabled"], Px = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, jx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, Fx = {
  key: 2,
  class: "note failure",
  role: "alert"
}, Wx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(!1), o = T("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", Sx, [
      E(Wt, { icon: "gauge" }, {
        default: j(() => [...u[3] || (u[3] = [
          V("Now", -1)
        ])]),
        _: 1
      }),
      m("div", Mx, [
        m("div", null, [
          m("strong", _x, [
            V(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", Cx, [
            (r(!0), d(D, null, ne(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: K({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", Ax, v(e.queue.waiting_count), 1),
          u[4] || (u[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", Ex, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", Ox, [
        u[5] || (u[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", Tx, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, Ix),
          m("output", Bx, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, Rx)
        ])
      ]),
      (r(!0), d(D, null, ne(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, Lx),
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
        }, null, 40, Nx)
      ]))), 128)),
      m("div", qx, [
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
        ])], 8, Dx)
      ]),
      e.queue.halt_cause === "update" ? (r(), d("p", Px, [
        E(le, {
          name: "pause",
          size: 13
        }),
        u[8] || (u[8] = V("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", jx, [
        E(le, {
          name: "pause",
          size: 13
        }),
        V("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", Fx, v(o.value), 1)) : k("", !0)
    ]));
  }
}, Hx = /* @__PURE__ */ H(Wx, [["__scopeId", "data-v-975b4b89"]]), zx = ["data-queue-row", "data-queue-process"], Ux = ["aria-expanded"], Gx = { class: "run-line" }, Vx = { class: "leading" }, Kx = {
  key: 0,
  "data-queue-position": ""
}, Yx = ["title"], Qx = { class: "command" }, Xx = {
  class: "time",
  "data-queue-time": ""
}, Jx = { class: "details" }, Zx = { "data-queue-type": "" }, e8 = { class: "failed" }, t8 = { class: "drop-inner" }, n8 = { class: "output" }, a8 = { class: "output-heading" }, s8 = ["href"], o8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(), o = nr((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = to(), u = A(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = A(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await je(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await je(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return ge(() => n.expanded, h, { immediate: !0 }), wn(["output.*"], f, (p) => Ni(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      m("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: y[2] || (y[2] = (b) => a("toggle")),
        onKeydown: [
          y[3] || (y[3] = _t(Se((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = _t(Se((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", Gx, [
          m("span", Vx, [
            e.run.section === "waiting" ? (r(), d("span", Kx, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: K(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, Yx))
          ]),
          m("code", Qx, v(e.run.line), 1),
          m("span", Xx, v(c.value), 1),
          E(le, {
            class: K(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", Jx, [
          m("span", Zx, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(D, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = Se((b) => L(yt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(D, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(D, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = Se((b) => L(yt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(D, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", e8, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, Ux),
      m("div", {
        class: K(["drop", { open: e.expanded }])
      }, [
        m("div", t8, [
          m("div", n8, [
            m("div", a8, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, s8)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && L(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              V(v(e.run.line), 1),
              L(l).length ? (r(), d(D, { key: 0 }, [
                V(v(`
` + L(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, zx));
  }
}, l8 = /* @__PURE__ */ H(o8, [["__scopeId", "data-v-18099d0b"]]), i8 = {
  class: "process-queue",
  "data-test-queue": ""
}, r8 = { class: "scroll" }, u8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, c8 = ["data-queue-empty"], ss = 20, d8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = T(null), a = T(""), s = T([]), o = T(ss), l = A(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const u = A(() => n.value ? [
      { type: "running", heading: "Running", icon: "start", rows: n.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: n.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: n.value.recent, empty: "Nothing has run yet." }
    ].flatMap((y) => [
      { key: `band:${y.type}`, section: y },
      ...y.rows.length ? y.rows.map((b, O) => ({ key: `run:${b.id}`, run: b, position: O + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
    ]) : []);
    function c(p) {
      s.value = s.value.includes(p) ? s.value.filter((y) => y !== p) : [...s.value, p];
    }
    async function f() {
      const p = ++i, y = await t.read(o.value === ss ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === i && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += ss, f();
    }
    return wn(["process.*", "setting.*"], f), _e(f), (p, y) => (r(), d("article", i8, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", r8, [
        a.value ? (r(), d("p", u8, v(a.value), 1)) : k("", !0),
        n.value ? (r(), d(D, { key: 1 }, [
          E(Hx, {
            queue: n.value,
            read: e.read,
            onSaved: f
          }, null, 8, ["queue", "read"]),
          E(Bs, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: j(() => [
              (r(!0), d(D, null, ne(u.value, (b) => (r(), d(D, {
                key: b.key
              }, [
                b.run ? (r(), F(l8, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (O) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, v(b.section.empty), 9, c8)) : (r(), F(Wt, {
                  key: 2,
                  icon: b.section.icon,
                  count: b.section.rows.length,
                  "data-queue-heading": b.section.type
                }, {
                  default: j(() => [
                    V(v(b.section.heading), 1)
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
          }, "Show older commands")) : k("", !0)
        ], 64)) : a.value ? k("", !0) : (r(), F(Ke, { key: 2 }))
      ])
    ]));
  }
}, mC = /* @__PURE__ */ H(d8, [["__scopeId", "data-v-d9b6ef6b"]]), f8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, h8 = ["aria-expanded"], m8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, p8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, g8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, v8 = {
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
    const t = e, n = T(t.open), a = T(0), s = T(0), o = T("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return ge(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), wn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(D, null, [
      a.value ? (r(), d("section", f8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", m8, v(a.value), 1),
          E(Kt, { open: n.value }, null, 8, ["open"])
        ], 8, h8),
        m("div", {
          class: K(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", p8, [
            E(Xc, {
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
      o.value ? (r(), d("p", g8, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, y8 = /* @__PURE__ */ H(v8, [["__scopeId", "data-v-a4550728"]]), b8 = ["placeholder"], k8 = { class: "actions" }, w8 = { class: "error" }, $8 = {
  key: 1,
  class: "card closed"
}, x8 = { class: "mark" }, S8 = { class: "prompt" }, M8 = {
  key: 0,
  class: "draft"
}, _8 = {
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
    const a = e, s = n, o = ln(e, "draft"), l = ln(e, "error"), i = T(!!l.value), u = T(!1), c = T(!1), f = T(null);
    async function h() {
      var b, O;
      i.value = !0, u.value = !1, await je(), (O = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || O.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const b = o.value.trim();
      if (!(!b || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(b), i.value = !1, u.value = !0;
        } catch (O) {
          o.value = b, l.value = O.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, O) => (r(), d("div", {
      class: K(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: Se(y, ["prevent"]),
        onKeydown: _t(p, ["esc"])
      }, [
        he(b.$slots, "who", {}, void 0, !0),
        Je(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": O[0] || (O[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: O[1] || (O[1] = _t((S) => L(ji)(S, y), ["enter"]))
        }, null, 40, b8), [
          [Qn, o.value]
        ]),
        m("div", k8, [
          m("span", w8, v(l.value), 1),
          E(ve, {
            small: "",
            onClick: p
          }, {
            default: j(() => [...O[3] || (O[3] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          E(ve, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: j(() => [...O[4] || (O[4] = [
              V("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", $8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", x8, [
            E(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", S8, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", M8, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: O[2] || (O[2] = (S) => s("show"))
        }, [
          m("span", null, v(L(Zc)(e.count, "comment")), 1),
          E(le, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, C8 = /* @__PURE__ */ H(_8, [["__scopeId", "data-v-b68baddd"]]), A8 = { wide: 1130 }, E8 = /\{([A-Za-z_]\w*)\}/g;
function Yn(e, t, n = {}) {
  return e.replace(E8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const O8 = (e, t, n, a) => Yn(e.label, n, { row_id: a, id: a }) || o2(t, n, a), T8 = { class: "comment-side-head" }, I8 = {
  key: 0,
  class: "comment-none"
}, B8 = { key: 0 }, R8 = {
  key: 1,
  class: "comment-none"
}, L8 = {
  class: "comment",
  "data-comment": ""
}, N8 = {
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
      m("header", T8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        E(pa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", I8, "No comments yet")) : k("", !0),
      (r(!0), d(D, null, ne(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", B8, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", R8, "Revision " + v(a.revision), 1)) : k("", !0),
        m("p", L8, v(e.words(a)), 1)
      ]))), 128)),
      E(yn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, El = /* @__PURE__ */ H(N8, [["__scopeId", "data-v-276284a3"]]), q8 = { class: "resource-heading" }, D8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, P8 = {
  key: 1,
  class: "resource-abstract"
}, j8 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", q8, [
      e.title ? (r(), d("h2", D8, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", P8, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, F8 = /* @__PURE__ */ H(j8, [["__scopeId", "data-v-d65ef53f"]]), W8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, H8 = { class: "inspector-icons" }, z8 = { class: "inspector-icons-start" }, U8 = {
  class: "inspector-label",
  "data-resource-type": ""
}, G8 = { class: "inspector-icons-end" }, V8 = ["href"], K8 = {
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
    const n = e, a = t, s = A(() => `${n.opened.table}:${n.opened.id}`), o = A(() => n.shareable && !n.readOnly), l = A(() => n.backed ? "Close all rows" : "Close");
    return (i, u) => (r(), d("header", W8, [
      m("div", H8, [
        m("span", z8, [
          e.backed ? (r(), F(ve, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: u[0] || (u[0] = (c) => a("back"))
          }, {
            default: j(() => [
              E(le, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (r(), d(D, { key: 1 }, [
            E(ve, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: u[1] || (u[1] = (c) => a("step", -1))
            }, {
              default: j(() => [
                E(le, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            E(ve, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: u[2] || (u[2] = (c) => a("step", 1))
            }, {
              default: j(() => [
                E(le, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        m("p", U8, v(e.label), 1),
        m("span", G8, [
          e.embedded ? (r(), F(ve, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: u[3] || (u[3] = (c) => L(De)(s.value))
          }, {
            default: j(() => [
              E(le, {
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
            href: L(qf)(s.value)
          }, [
            E(le, {
              name: "share",
              size: 13
            })
          ], 8, V8)) : k("", !0),
          e.embedded ? k("", !0) : (r(), F(ve, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: u[4] || (u[4] = (c) => a("close"))
          }, {
            default: j(() => [
              E(le, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      E(F8, {
        title: e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, Y8 = /* @__PURE__ */ H(K8, [["__scopeId", "data-v-414d2086"]]), Q8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, X8 = { class: "field-name" }, J8 = {
  key: 1,
  class: "field-value"
}, Z8 = ["onClick"], e3 = {
  key: 2,
  class: "field-value"
}, t3 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", Q8, [
      (r(!0), d(D, null, ne(e.fields, (o) => (r(), d(D, {
        key: o.name
      }, [
        m("p", X8, v(o.label), 1),
        o.isTime ? (r(), F(Ze, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", J8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, Z8)
        ])) : (r(), d("p", e3, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, n3 = /* @__PURE__ */ H(t3, [["__scopeId", "data-v-7e45afb5"]]);
async function a3(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: l2(s.value.actor, s.value.creator_agent), owner: a.length ? i2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const s3 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, o3 = {
  key: 1,
  class: "inspector-wait"
}, l3 = { class: "inspector-main" }, i3 = { class: "inspector-column" }, r3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, u3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, c3 = { class: "inspector-text" }, d3 = ["innerHTML"], f3 = {
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
    const n = e, a = t, s = /* @__PURE__ */ new Set(["question", "memory", "rule"]), o = A(() => n.catalogue.inspector(n.term) ?? {
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
    }), l = T(null), i = T(""), u = T(""), c = T(""), f = T("details"), h = T(null), p = T(0);
    let y = 0;
    const b = A(() => ({ row_id: n.id, id: n.id })), O = A(() => l.value ? Yn(o.value.title, l.value, b.value) || s2(n.term, l.value, n.id) : ""), S = A(() => l.value ? O8(o.value, n.term, l.value, n.id) : ""), x = A(() => S.value === O.value ? "" : S.value), B = A(() => l.value ? Yn(o.value.description, l.value, b.value) : ""), W = A(() => {
      var C, R, U;
      return ((C = l.value) == null ? void 0 : C.body) || ((R = l.value) == null ? void 0 : R.brief) || (s.has(n.term) ? (U = l.value) == null ? void 0 : U.text : "") || "";
    }), N = A(() => W.value ? Vs(W.value, { env: "", rowNames: !1 }) : ""), w = A(() => r2(l.value, W.value, i.value, u.value)), z = A(() => o.value.comments && p.value >= A8.wide), P = A(() => o.value.comments && !z.value), q = (C) => o.value.components.filter((R) => (R.tab || "") === C).map((R) => R.window), _ = A(() => [...new Set(o.value.components.map((C) => C.tab).filter(Boolean))]), I = A(() => _.value.length || P.value ? [{ key: "details", label: "Details" }, ..._.value.map((C) => ({ key: C, label: C })), ...P.value ? [{ key: "comments", label: "Comments" }] : []] : []), $ = Ui(() => o.value.comments && l.value ? { term: n.term, id: n.id, title: l.value.title } : {}, (C) => n.read(C));
    async function g() {
      const C = ++y, R = await n.read(Yn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      if (C !== y || (c.value = R.ok ? "" : R.error, !R.ok)) return;
      l.value = R.value;
      const U = await a3(n.read, l.value);
      C === y && (i.value = U.creator, u.value = U.owner);
    }
    ge(() => `${n.term}:${n.id}`, () => {
      l.value = null, i.value = "", u.value = "", c.value = "", f.value = "details", g();
    }, { immediate: !0 }), wn(o.value.events, g), ge($.open, (C) => C && P.value && (f.value = "comments"));
    let M = null;
    return _e(() => {
      var C;
      p.value = ((C = h.value) == null ? void 0 : C.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (M = new ResizeObserver(() => p.value = h.value.clientWidth), M.observe(h.value));
    }), Be(() => M == null ? void 0 : M.disconnect()), (C, R) => (r(), d("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      E(Y8, {
        label: x.value,
        title: O.value,
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
      c.value ? (r(), d("p", s3, v(c.value), 1)) : l.value ? (r(), d(D, { key: 2 }, [
        E(Zi, null, {
          default: j(() => [
            E(zs, {
              name: `row.${e.term}`,
              row: { ...l.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: g
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", l3, [
          m("div", i3, [
            I.value.length ? (r(), d("div", r3, [
              E(Ft, {
                options: I.value,
                value: f.value,
                onPick: R[3] || (R[3] = (U) => f.value = U)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", u3, [
              E(Gt, { value: f.value }, {
                details: j(() => [
                  m("div", c3, [
                    N.value && !o.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, d3)) : k("", !0),
                    o.value.lists_fields ? (r(), F(n3, {
                      key: 1,
                      fields: w.value,
                      onPeek: R[4] || (R[4] = (U) => a("open", U))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  E(ks, {
                    "slot-name": `inspector.${e.term}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  E(El, {
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
                default: j(() => [
                  E(ks, {
                    names: q(f.value),
                    row: { ...l.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (r(), F(y8, {
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read,
                categories: o.value.links.categories,
                open: o.value.links.open,
                "outside-plan": o.value.links.excludes_plan,
                "page-size": o.value.links.page_size,
                onOpen: R[6] || (R[6] = (U) => a("open", U))
              }, null, 8, ["model", "id", "read", "categories", "open", "outside-plan", "page-size"])) : k("", !0)
            ]),
            o.value.comments ? (r(), F(C8, {
              key: 1,
              send: L($).send,
              count: L($).total.value,
              onShow: R[7] || (R[7] = (U) => P.value && (f.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          z.value ? (r(), F(El, {
            key: 0,
            comments: L($).comments.value,
            words: L($).words,
            more: !!L($).nextPage.value,
            loading: L($).loading.value,
            failure: L($).failure.value,
            onMore: L($).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (r(), d("div", o3, [
        E(Ke)
      ]))
    ], 512));
  }
}, h3 = /* @__PURE__ */ H(f3, [["__scopeId", "data-v-4e283d29"]]), pC = {
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
    const t = Me(Fs);
    return (n, a) => (r(), F(h3, Pe(n.$props, {
      catalogue: L(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, m3 = { class: "facts" }, p3 = { class: "fact wide" }, g3 = ["title"], v3 = {
  key: 1,
  class: "fact-value"
}, y3 = {
  key: 0,
  class: "fact"
}, b3 = { class: "fact-value" }, k3 = { class: "fact" }, w3 = { class: "fact-label" }, $3 = ["title"], x3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, S3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, M3 = {
  key: 2,
  class: "fact"
}, _3 = { class: "fact-value" }, C3 = { class: "fact wide" }, A3 = { class: "fact-label" }, E3 = { class: "fact wide" }, O3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, T3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = aa.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", m3, [
        m("div", p3, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => L(De)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, g3)) : (r(), d("span", v3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", y3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", b3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(D, { key: 1 }, [
          m("div", k3, [
            m("span", w3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${L(Qs)(e.task.helper_name, e.task.helper_main)}`,
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => L(De)(`agents:${e.task.helper_id}`))
            }, [
              E(Dt, {
                name: e.task.helper_name,
                main: e.task.helper_main
              }, null, 8, ["name", "main"])
            ], 8, $3)
          ]),
          L(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", x3, [
            E(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = V(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", S3, [
            E(Dt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = V(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", M3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", _3, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", C3, [
          m("span", A3, [
            i[9] || (i[9] = V(" Complexity ", -1)),
            E(li, {
              lines: L(Ji).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          E(Ft, {
            options: L(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", E3, [
          i[10] || (i[10] = m("span", { class: "fact-label" }, "Priority", -1)),
          E(Ft, {
            options: L(n),
            value: String(L(Xi)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", O3, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, I3 = /* @__PURE__ */ H(T3, [["__scopeId", "data-v-61067487"]]);
function B3(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const R3 = { class: "number" }, L3 = { class: "title" }, N3 = { class: "word" }, q3 = {
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
    return (a, s) => (r(), F(ut(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: K(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        E(ya, { status: e.status }, null, 8, ["status"]),
        m("span", R3, v(e.number), 1),
        m("span", L3, v(e.title), 1),
        m("span", N3, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, os = /* @__PURE__ */ H(q3, [["__scopeId", "data-v-f6417ae8"]]), D3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, P3 = { class: "level" }, j3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(!1);
    ge(() => n.task.id, () => s.value = !1);
    const o = A(() => B3(n.task.id, n.graph)), l = A(() => s.value ? o.value.above : o.value.above.slice(-1)), i = A(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = A(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, p = !1) => ({ status: dn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (r(), d("section", D3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (r(!0), d(D, null, ne(l.value, (y) => (r(), d(D, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", P3, [
          (r(!0), d(D, null, ne(y, (b) => (r(), F(os, Pe({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (O) => a("select", O))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      E(os, su(ou(f(e.task, !0))), null, 16),
      (r(!0), d(D, null, ne(i.value, (y) => (r(), d(D, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        E(os, Pe({ ref_for: !0 }, f(y), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, F3 = /* @__PURE__ */ H(j3, [["__scopeId", "data-v-79c52417"]]), W3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, H3 = ["datetime"], z3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", W3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (r(!0), d(D, null, ne(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, H3),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, U3 = /* @__PURE__ */ H(z3, [["__scopeId", "data-v-b41f213b"]]), G3 = {
  class: "part",
  "data-resource-waits": ""
}, V3 = ["onClick"], K3 = { class: "wait-id" }, Y3 = { class: "wait-title" }, Q3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", G3, [
      m("h4", null, v(e.title), 1),
      (r(!0), d(D, null, ne(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        E(ya, {
          status: L(dn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", K3, v(o.id), 1),
        m("span", Y3, v(o.title), 1)
      ], 8, V3))), 128))
    ]));
  }
}, Ol = /* @__PURE__ */ H(Q3, [["__scopeId", "data-v-8fb2e251"]]), X3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, J3 = { class: "text" }, Z3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, eS = 180, tS = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = T(!1), l = A(() => a.task.waits.filter((u) => !n.has(u.state))), i = A(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(D, null, [
      l.value.length ? (r(), F(Ol, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", X3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", J3, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", Z3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: K(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > eS && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), F(Ol, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, nS = /* @__PURE__ */ H(tS, [["__scopeId", "data-v-4a3f1e79"]]), aS = {
  class: "task-details",
  "data-task-details": ""
}, sS = { class: "since" }, oS = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, lS = { class: "text" }, iS = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, rS = {
  key: 1,
  class: "note"
}, uS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, cS = { class: "text" }, dS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", aS, [
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
            E(ya, {
              status: L(dn)(e.task.state)
            }, null, 8, ["status"]),
            V(" " + v(a(e.task.state)), 1)
          ]),
          m("span", sS, [
            o[5] || (o[5] = V(" since ", -1)),
            E(Ze, {
              at: L(mh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", oS, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", lS, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", iS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", rS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", uS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", cS, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), F(F3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        E(I3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        E(nS, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        E(U3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, gC = /* @__PURE__ */ H(dS, [["__scopeId", "data-v-7e73fa21"]]), fS = 50, hS = { messages: 25 }, mS = (e) => hS[e] || fS, pS = {
  class: "task-log",
  "aria-label": "Task log"
}, gS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, vS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, yS = { class: "entries" }, bS = ["data-task-log-important"], kS = ["datetime"], wS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, $S = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = T([]), a = T(1), s = T(!0), o = T(!0), l = T("");
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
        String(mS("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return ge(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), et(() => {
      i += 1;
    }), (c, f) => (r(), d("section", pS, [
      o.value ? (r(), F(Ke, { key: 0 })) : l.value ? (r(), d(D, { key: 1 }, [
        m("p", gS, v(l.value), 1),
        E(ve, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => u(a.value))
        }, {
          default: j(() => [...f[3] || (f[3] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(D, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", vS, "No log entries yet.")),
        m("ol", yS, [
          (r(!0), d(D, null, ne(n.value, (h) => (r(), d("li", {
            key: h.id,
            class: K(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, kS),
            m("p", null, v(h.line), 1)
          ], 10, bS))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", wS, [
          E(ve, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => u(a.value - 1))
          }, {
            default: j(() => [...f[4] || (f[4] = [
              V("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          E(ve, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => u(a.value + 1))
          }, {
            default: j(() => [...f[5] || (f[5] = [
              V("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, vC = /* @__PURE__ */ H($S, [["__scopeId", "data-v-cfa43bf1"]]);
function xS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ls = { exports: {} }, Tl;
function SS() {
  return Tl || (Tl = 1, (function(e, t) {
    var n = (function() {
      var a = function(w, z) {
        var P = 236, q = 17, _ = w, I = o[z], $ = null, g = 0, M = null, C = [], R = {}, U = function(Y, Q) {
          g = _ * 4 + 17, $ = (function(G) {
            for (var X = new Array(G), J = 0; J < G; J += 1) {
              X[J] = new Array(G);
              for (var ae = 0; ae < G; ae += 1)
                X[J][ae] = null;
            }
            return X;
          })(g), Z(0, 0), Z(g - 7, 0), Z(0, g - 7), re(), pe(), ce(Y, Q), _ >= 7 && we(Y), M == null && (M = oe(_, I, C)), te(M, Q);
        }, Z = function(Y, Q) {
          for (var G = -1; G <= 7; G += 1)
            if (!(Y + G <= -1 || g <= Y + G))
              for (var X = -1; X <= 7; X += 1)
                Q + X <= -1 || g <= Q + X || (0 <= G && G <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= X && X <= 4 ? $[Y + G][Q + X] = !0 : $[Y + G][Q + X] = !1);
        }, ee = function() {
          for (var Y = 0, Q = 0, G = 0; G < 8; G += 1) {
            U(!0, G);
            var X = i.getLostPoint(R);
            (G == 0 || Y > X) && (Y = X, Q = G);
          }
          return Q;
        }, pe = function() {
          for (var Y = 8; Y < g - 8; Y += 1)
            $[Y][6] == null && ($[Y][6] = Y % 2 == 0);
          for (var Q = 8; Q < g - 8; Q += 1)
            $[6][Q] == null && ($[6][Q] = Q % 2 == 0);
        }, re = function() {
          for (var Y = i.getPatternPosition(_), Q = 0; Q < Y.length; Q += 1)
            for (var G = 0; G < Y.length; G += 1) {
              var X = Y[Q], J = Y[G];
              if ($[X][J] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? $[X + ae][J + de] = !0 : $[X + ae][J + de] = !1;
            }
        }, we = function(Y) {
          for (var Q = i.getBCHTypeNumber(_), G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[Math.floor(G / 3)][G % 3 + g - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[G % 3 + g - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, ce = function(Y, Q) {
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
          for (var G = -1, X = g - 1, J = 7, ae = 0, de = i.getMaskFunction(Q), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var xe = 0; xe < 2; xe += 1)
                if ($[X][ue - xe] == null) {
                  var Ee = !1;
                  ae < Y.length && (Ee = (Y[ae] >>> J & 1) == 1);
                  var me = de(X, ue - xe);
                  me && (Ee = !Ee), $[X][ue - xe] = Ee, J -= 1, J == -1 && (ae += 1, J = 7);
                }
              if (X += G, X < 0 || g <= X) {
                X -= G, G = -G;
                break;
              }
            }
        }, se = function(Y, Q) {
          for (var G = 0, X = 0, J = 0, ae = new Array(Q.length), de = new Array(Q.length), ue = 0; ue < Q.length; ue += 1) {
            var xe = Q[ue].dataCount, Ee = Q[ue].totalCount - xe;
            X = Math.max(X, xe), J = Math.max(J, Ee), ae[ue] = new Array(xe);
            for (var me = 0; me < ae[ue].length; me += 1)
              ae[ue][me] = 255 & Y.getBuffer()[me + G];
            G += xe;
            var Fe = i.getErrorCorrectPolynomial(Ee), We = c(ae[ue], Fe.getLength() - 1), go = We.mod(Fe);
            de[ue] = new Array(Fe.getLength() - 1);
            for (var me = 0; me < de[ue].length; me += 1) {
              var vo = me + go.getLength() - de[ue].length;
              de[ue][me] = vo >= 0 ? go.getAt(vo) : 0;
            }
          }
          for (var yo = 0, me = 0; me < Q.length; me += 1)
            yo += Q[me].totalCount;
          for (var Sa = new Array(yo), Cn = 0, me = 0; me < X; me += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              me < ae[ue].length && (Sa[Cn] = ae[ue][me], Cn += 1);
          for (var me = 0; me < J; me += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              me < de[ue].length && (Sa[Cn] = de[ue][me], Cn += 1);
          return Sa;
        }, oe = function(Y, Q, G) {
          for (var X = f.getRSBlocks(Y, Q), J = h(), ae = 0; ae < G.length; ae += 1) {
            var de = G[ae];
            J.put(de.getMode(), 4), J.put(de.getLength(), i.getLengthInBits(de.getMode(), Y)), de.write(J);
          }
          for (var ue = 0, ae = 0; ae < X.length; ae += 1)
            ue += X[ae].dataCount;
          if (J.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + J.getLengthInBits() + ">" + ue * 8 + ")";
          for (J.getLengthInBits() + 4 <= ue * 8 && J.put(0, 4); J.getLengthInBits() % 8 != 0; )
            J.putBit(!1);
          for (; !(J.getLengthInBits() >= ue * 8 || (J.put(P, 8), J.getLengthInBits() >= ue * 8)); )
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
              G = b(Y);
              break;
            case "Kanji":
              G = O(Y);
              break;
            default:
              throw "mode:" + Q;
          }
          C.push(G), M = null;
        }, R.isDark = function(Y, Q) {
          if (Y < 0 || g <= Y || Q < 0 || g <= Q)
            throw Y + "," + Q;
          return $[Y][Q];
        }, R.getModuleCount = function() {
          return g;
        }, R.make = function() {
          if (_ < 1) {
            for (var Y = 1; Y < 40; Y++) {
              for (var Q = f.getRSBlocks(Y, I), G = h(), X = 0; X < C.length; X++) {
                var J = C[X];
                G.put(J.getMode(), 4), G.put(J.getLength(), i.getLengthInBits(J.getMode(), Y)), J.write(G);
              }
              for (var ae = 0, X = 0; X < Q.length; X++)
                ae += Q[X].dataCount;
              if (G.getLengthInBits() <= ae * 8)
                break;
            }
            _ = Y;
          }
          U(!1, ee());
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
          var ae = R.getModuleCount() * Y + Q * 2, de, ue, xe, Ee, me = "", Fe;
          for (Fe = "l" + Y + ",0 0," + Y + " -" + Y + ",0 0,-" + Y + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += J.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', me += ' viewBox="0 0 ' + ae + " " + ae + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += X.text || G.text ? ' role="img" aria-labelledby="' + nt([X.id, G.id].join(" ").trim()) + '"' : "", me += ">", me += X.text ? '<title id="' + nt(X.id) + '">' + nt(X.text) + "</title>" : "", me += G.text ? '<description id="' + nt(G.id) + '">' + nt(G.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', xe = 0; xe < R.getModuleCount(); xe += 1)
            for (Ee = xe * Y + Q, de = 0; de < R.getModuleCount(); de += 1)
              R.isDark(xe, de) && (ue = de * Y + Q, me += "M" + ue + "," + Ee + Fe);
          return me += '" stroke="transparent" fill="black"/>', me += "</svg>", me;
        }, R.createDataURL = function(Y, Q) {
          Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q;
          var G = R.getModuleCount() * Y + Q * 2, X = Q, J = G - Q;
          return N(G, G, function(ae, de) {
            if (X <= ae && ae < J && X <= de && de < J) {
              var ue = Math.floor((ae - X) / Y), xe = Math.floor((de - X) / Y);
              return R.isDark(xe, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(Y, Q, G) {
          Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q;
          var X = R.getModuleCount() * Y + Q * 2, J = "";
          return J += "<img", J += ' src="', J += R.createDataURL(Y, Q), J += '"', J += ' width="', J += X, J += '"', J += ' height="', J += X, J += '"', G && (J += ' alt="', J += nt(G), J += '"'), J += "/>", J;
        };
        var nt = function(Y) {
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
        }, Gr = function(Y) {
          var Q = 1;
          Y = typeof Y > "u" ? Q * 2 : Y;
          var G = R.getModuleCount() * Q + Y * 2, X = Y, J = G - Y, ae, de, ue, xe, Ee, me = {
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
            for (ue = Math.floor((ae - X) / Q), xe = Math.floor((ae + 1 - X) / Q), de = 0; de < G; de += 1)
              Ee = "█", X <= de && de < J && X <= ae && ae < J && R.isDark(ue, Math.floor((de - X) / Q)) && (Ee = " "), X <= de && de < J && X <= ae + 1 && ae + 1 < J && R.isDark(xe, Math.floor((de - X) / Q)) ? Ee += " " : Ee += "█", We += Y < 1 && ae + 1 >= J ? Fe[Ee] : me[Ee];
            We += `
`;
          }
          return G % 2 && Y > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return R.createASCII = function(Y, Q) {
          if (Y = Y || 1, Y < 2)
            return Gr(Q);
          Y -= 1, Q = typeof Q > "u" ? Y * 2 : Q;
          var G = R.getModuleCount() * Y + Q * 2, X = Q, J = G - Q, ae, de, ue, xe, Ee = Array(Y + 1).join("██"), me = Array(Y + 1).join("  "), Fe = "", We = "";
          for (ae = 0; ae < G; ae += 1) {
            for (ue = Math.floor((ae - X) / Y), We = "", de = 0; de < G; de += 1)
              xe = 1, X <= de && de < J && X <= ae && ae < J && R.isDark(ue, Math.floor((de - X) / Y)) && (xe = 0), We += xe ? Ee : me;
            for (ue = 0; ue < Y; ue += 1)
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
          for (var z = [], P = 0; P < w.length; P += 1) {
            var q = w.charCodeAt(P);
            z.push(q & 255);
          }
          return z;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(w, z) {
        var P = (function() {
          for (var _ = B(w), I = function() {
            var pe = _.read();
            if (pe == -1) throw "eof";
            return pe;
          }, $ = 0, g = {}; ; ) {
            var M = _.read();
            if (M == -1) break;
            var C = I(), R = I(), U = I(), Z = String.fromCharCode(M << 8 | C), ee = R << 8 | U;
            g[Z] = ee, $ += 1;
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
              var M = P[_.charAt($)];
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
        ], z = 1335, P = 7973, q = 21522, _ = {}, I = function($) {
          for (var g = 0; $ != 0; )
            g += 1, $ >>>= 1;
          return g;
        };
        return _.getBCHTypeInfo = function($) {
          for (var g = $ << 10; I(g) - I(z) >= 0; )
            g ^= z << I(g) - I(z);
          return ($ << 10 | g) ^ q;
        }, _.getBCHTypeNumber = function($) {
          for (var g = $ << 12; I(g) - I(P) >= 0; )
            g ^= P << I(g) - I(P);
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
          for (var g = $.getModuleCount(), M = 0, C = 0; C < g; C += 1)
            for (var R = 0; R < g; R += 1) {
              for (var U = 0, Z = $.isDark(C, R), ee = -1; ee <= 1; ee += 1)
                if (!(C + ee < 0 || g <= C + ee))
                  for (var pe = -1; pe <= 1; pe += 1)
                    R + pe < 0 || g <= R + pe || ee == 0 && pe == 0 || Z == $.isDark(C + ee, R + pe) && (U += 1);
              U > 5 && (M += 3 + U - 5);
            }
          for (var C = 0; C < g - 1; C += 1)
            for (var R = 0; R < g - 1; R += 1) {
              var re = 0;
              $.isDark(C, R) && (re += 1), $.isDark(C + 1, R) && (re += 1), $.isDark(C, R + 1) && (re += 1), $.isDark(C + 1, R + 1) && (re += 1), (re == 0 || re == 4) && (M += 3);
            }
          for (var C = 0; C < g; C += 1)
            for (var R = 0; R < g - 6; R += 1)
              $.isDark(C, R) && !$.isDark(C, R + 1) && $.isDark(C, R + 2) && $.isDark(C, R + 3) && $.isDark(C, R + 4) && !$.isDark(C, R + 5) && $.isDark(C, R + 6) && (M += 40);
          for (var R = 0; R < g; R += 1)
            for (var C = 0; C < g - 6; C += 1)
              $.isDark(C, R) && !$.isDark(C + 1, R) && $.isDark(C + 2, R) && $.isDark(C + 3, R) && $.isDark(C + 4, R) && !$.isDark(C + 5, R) && $.isDark(C + 6, R) && (M += 40);
          for (var we = 0, R = 0; R < g; R += 1)
            for (var C = 0; C < g; C += 1)
              $.isDark(C, R) && (we += 1);
          var ce = Math.abs(100 * we / g / g - 50) / 5;
          return M += ce * 10, M;
        }, _;
      })(), u = (function() {
        for (var w = new Array(256), z = new Array(256), P = 0; P < 8; P += 1)
          w[P] = 1 << P;
        for (var P = 8; P < 256; P += 1)
          w[P] = w[P - 4] ^ w[P - 5] ^ w[P - 6] ^ w[P - 8];
        for (var P = 0; P < 255; P += 1)
          z[w[P]] = P;
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
        var P = (function() {
          for (var _ = 0; _ < w.length && w[_] == 0; )
            _ += 1;
          for (var I = new Array(w.length - _ + z), $ = 0; $ < w.length - _; $ += 1)
            I[$] = w[$ + _];
          return I;
        })(), q = {};
        return q.getAt = function(_) {
          return P[_];
        }, q.getLength = function() {
          return P.length;
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
        }, P = {}, q = function(_, I) {
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
        return P.getRSBlocks = function(_, I) {
          var $ = q(_, I);
          if (typeof $ > "u")
            throw "bad rs block @ typeNumber:" + _ + "/errorCorrectionLevel:" + I;
          for (var g = $.length / 3, M = [], C = 0; C < g; C += 1)
            for (var R = $[C * 3 + 0], U = $[C * 3 + 1], Z = $[C * 3 + 2], ee = 0; ee < R; ee += 1)
              M.push(z(U, Z));
          return M;
        }, P;
      })(), h = function() {
        var w = [], z = 0, P = {};
        return P.getBuffer = function() {
          return w;
        }, P.getAt = function(q) {
          var _ = Math.floor(q / 8);
          return (w[_] >>> 7 - q % 8 & 1) == 1;
        }, P.put = function(q, _) {
          for (var I = 0; I < _; I += 1)
            P.putBit((q >>> _ - I - 1 & 1) == 1);
        }, P.getLengthInBits = function() {
          return z;
        }, P.putBit = function(q) {
          var _ = Math.floor(z / 8);
          w.length <= _ && w.push(0), q && (w[_] |= 128 >>> z % 8), z += 1;
        }, P;
      }, p = function(w) {
        var z = s.MODE_NUMBER, P = w, q = {};
        q.getMode = function() {
          return z;
        }, q.getLength = function($) {
          return P.length;
        }, q.write = function($) {
          for (var g = P, M = 0; M + 2 < g.length; )
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
        var z = s.MODE_ALPHA_NUM, P = w, q = {};
        q.getMode = function() {
          return z;
        }, q.getLength = function(I) {
          return P.length;
        }, q.write = function(I) {
          for (var $ = P, g = 0; g + 1 < $.length; )
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
      }, b = function(w) {
        var z = s.MODE_8BIT_BYTE, P = a.stringToBytes(w), q = {};
        return q.getMode = function() {
          return z;
        }, q.getLength = function(_) {
          return P.length;
        }, q.write = function(_) {
          for (var I = 0; I < P.length; I += 1)
            _.put(P[I], 8);
        }, q;
      }, O = function(w) {
        var z = s.MODE_KANJI, P = a.stringToBytesFuncs.SJIS;
        if (!P)
          throw "sjis not supported.";
        (function(I, $) {
          var g = P(I);
          if (g.length != 2 || (g[0] << 8 | g[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var q = P(w), _ = {};
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
        return z.writeByte = function(P) {
          w.push(P & 255);
        }, z.writeShort = function(P) {
          z.writeByte(P), z.writeByte(P >>> 8);
        }, z.writeBytes = function(P, q, _) {
          q = q || 0, _ = _ || P.length;
          for (var I = 0; I < _; I += 1)
            z.writeByte(P[I + q]);
        }, z.writeString = function(P) {
          for (var q = 0; q < P.length; q += 1)
            z.writeByte(P.charCodeAt(q));
        }, z.toByteArray = function() {
          return w;
        }, z.toString = function() {
          var P = "";
          P += "[";
          for (var q = 0; q < w.length; q += 1)
            q > 0 && (P += ","), P += w[q];
          return P += "]", P;
        }, z;
      }, x = function() {
        var w = 0, z = 0, P = 0, q = "", _ = {}, I = function(g) {
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
          for (w = w << 8 | g & 255, z += 8, P += 1; z >= 6; )
            I(w >>> z - 6), z -= 6;
        }, _.flush = function() {
          if (z > 0 && (I(w << 6 - z), w = 0, z = 0), P % 3 != 0)
            for (var g = 3 - P % 3, M = 0; M < g; M += 1)
              q += "=";
        }, _.toString = function() {
          return q;
        }, _;
      }, B = function(w) {
        var z = w, P = 0, q = 0, _ = 0, I = {};
        I.read = function() {
          for (; _ < 8; ) {
            if (P >= z.length) {
              if (_ == 0)
                return -1;
              throw "unexpected end of file./" + _;
            }
            var g = z.charAt(P);
            if (P += 1, g == "=")
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
        var P = w, q = z, _ = new Array(w * z), I = {};
        I.setPixel = function(C, R, U) {
          _[R * P + C] = U;
        }, I.write = function(C) {
          C.writeString("GIF87a"), C.writeShort(P), C.writeShort(q), C.writeByte(128), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(255), C.writeByte(255), C.writeByte(255), C.writeString(","), C.writeShort(0), C.writeShort(0), C.writeShort(P), C.writeShort(q), C.writeByte(0);
          var R = 2, U = g(R);
          C.writeByte(R);
          for (var Z = 0; U.length - Z > 255; )
            C.writeByte(255), C.writeBytes(U, Z, 255), Z += 255;
          C.writeByte(U.length - Z), C.writeBytes(U, Z, U.length - Z), C.writeByte(0), C.writeString(";");
        };
        var $ = function(C) {
          var R = C, U = 0, Z = 0, ee = {};
          return ee.write = function(pe, re) {
            if (pe >>> re)
              throw "length over";
            for (; U + re >= 8; )
              R.writeByte(255 & (pe << U | Z)), re -= 8 - U, pe >>>= 8 - U, Z = 0, U = 0;
            Z = pe << U | Z, U = U + re;
          }, ee.flush = function() {
            U > 0 && R.writeByte(Z);
          }, ee;
        }, g = function(C) {
          for (var R = 1 << C, U = (1 << C) + 1, Z = C + 1, ee = M(), pe = 0; pe < R; pe += 1)
            ee.add(String.fromCharCode(pe));
          ee.add(String.fromCharCode(R)), ee.add(String.fromCharCode(U));
          var re = S(), we = $(re);
          we.write(R, Z);
          var ce = 0, te = String.fromCharCode(_[ce]);
          for (ce += 1; ce < _.length; ) {
            var se = String.fromCharCode(_[ce]);
            ce += 1, ee.contains(te + se) ? te = te + se : (we.write(ee.indexOf(te), Z), ee.size() < 4095 && (ee.size() == 1 << Z && (Z += 1), ee.add(te + se)), te = se);
          }
          return we.write(ee.indexOf(te), Z), we.write(U, Z), we.flush(), re.toByteArray();
        }, M = function() {
          var C = {}, R = 0, U = {};
          return U.add = function(Z) {
            if (U.contains(Z))
              throw "dup key:" + Z;
            C[Z] = R, R += 1;
          }, U.size = function() {
            return R;
          }, U.indexOf = function(Z) {
            return C[Z];
          }, U.contains = function(Z) {
            return typeof C[Z] < "u";
          }, U;
        };
        return I;
      }, N = function(w, z, P) {
        for (var q = W(w, z), _ = 0; _ < z; _ += 1)
          for (var I = 0; I < w; I += 1)
            q.setPixel(I, _, P(I, _));
        var $ = S();
        q.write($);
        for (var g = x(), M = $.toByteArray(), C = 0; C < M.length; C += 1)
          g.writeByte(M[C]);
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
  })(ls)), ls.exports;
}
var MS = SS();
const _S = /* @__PURE__ */ xS(MS), CS = ["width", "height", "viewBox"], AS = ["width", "height"], ES = ["d"], OS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = A(() => {
      const a = _S(0, "M");
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
      }, null, 8, AS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, ES)
    ], 8, CS));
  }
}, yC = /* @__PURE__ */ H(OS, [["__scopeId", "data-v-489f0852"]]), TS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, bC = /* @__PURE__ */ H(TS, [["__scopeId", "data-v-47e67f04"]]);
function kC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const wC = lu(() => import("./VoiceFigure-Cx8Q7jsS.js").then((e) => e.V)), $C = "1.2.0", xC = "3.5";
export {
  Bf as $,
  Oe as A,
  Ie as B,
  ka as C,
  ct as D,
  x_ as E,
  I$ as F,
  hM as G,
  b_ as H,
  f$ as I,
  P$ as J,
  Ot as K,
  LS as L,
  uo as M,
  U$ as N,
  D$ as O,
  ba as P,
  PM as Q,
  G6 as R,
  Vn as S,
  zM as T,
  D6 as U,
  Te as V,
  oa as W,
  q6 as X,
  N6 as Y,
  If as Z,
  H as _,
  A6 as a,
  i_ as a$,
  H$ as a0,
  V6 as a1,
  K6 as a2,
  Ne as a3,
  oM as a4,
  sM as a5,
  Ct as a6,
  Y6 as a7,
  vM as a8,
  v6 as a9,
  ZM as aA,
  NM as aB,
  t$ as aC,
  wM as aD,
  $M as aE,
  S_ as aF,
  Ar as aG,
  HM as aH,
  xn as aI,
  x6 as aJ,
  k6 as aK,
  h_ as aL,
  Sn as aM,
  v_ as aN,
  fM as aO,
  qM as aP,
  DM as aQ,
  LM as aR,
  mn as aS,
  St as aT,
  y6 as aU,
  U2 as aV,
  BM as aW,
  z6 as aX,
  _r as aY,
  Ht as aZ,
  Yt as a_,
  r_ as aa,
  p_ as ab,
  _6 as ac,
  P6 as ad,
  j6 as ae,
  nM as af,
  aM as ag,
  lM as ah,
  I6 as ai,
  wl as aj,
  Q6 as ak,
  gM as al,
  A_ as am,
  EM as an,
  CM as ao,
  _M as ap,
  iM as aq,
  eM as ar,
  Z6 as as,
  tM as at,
  WM as au,
  pM as av,
  yM as aw,
  T_ as ax,
  nn as ay,
  bM as az,
  n4 as b,
  O_ as b$,
  A$ as b0,
  g_ as b1,
  VM as b2,
  GM as b3,
  p5 as b4,
  hr as b5,
  s_ as b6,
  mM as b7,
  xa as b8,
  mt as b9,
  YM as bA,
  t_ as bB,
  vt as bC,
  UM as bD,
  n_ as bE,
  kM as bF,
  OM as bG,
  xM as bH,
  Le as bI,
  dM as bJ,
  a_ as bK,
  P_ as bL,
  j_ as bM,
  p6 as bN,
  K2 as bO,
  uM as bP,
  QM as bQ,
  E6 as bR,
  C_ as bS,
  KM as bT,
  XM as bU,
  JM as bV,
  rM as bW,
  n$ as bX,
  cM as bY,
  MM as bZ,
  __ as b_,
  e_ as ba,
  Va as bb,
  Ci as bc,
  B_ as bd,
  N_ as be,
  FM as bf,
  f_ as bg,
  g6 as bh,
  AM as bi,
  R_ as bj,
  X6 as bk,
  J6 as bl,
  R6 as bm,
  U6 as bn,
  $6 as bo,
  c_ as bp,
  O6 as bq,
  T6 as br,
  L6 as bs,
  IM as bt,
  j2 as bu,
  y_ as bv,
  q$ as bw,
  B6 as bx,
  S6 as by,
  TM as bz,
  m5 as c,
  VS as c$,
  w6 as c0,
  b6 as c1,
  SM as c2,
  q_ as c3,
  po as c4,
  D_ as c5,
  Hr as c6,
  d_ as c7,
  W6 as c8,
  F6 as c9,
  F_ as cA,
  BS as cB,
  Kt as cC,
  jd as cD,
  pC as cE,
  hC as cF,
  le as cG,
  li as cH,
  tC as cI,
  zS as cJ,
  $C as cK,
  xC as cL,
  s6 as cM,
  sC as cN,
  $s as cO,
  c6 as cP,
  Pw as cQ,
  ze as cR,
  Mt as cS,
  ma as cT,
  ZS as cU,
  o6 as cV,
  $c as cW,
  bw as cX,
  aa as cY,
  dC as cZ,
  GS as c_,
  z2 as ca,
  M6 as cb,
  L$ as cc,
  RM as cd,
  lo as ce,
  Q5 as cf,
  jM as cg,
  an as ch,
  Pt as ci,
  Dt as cj,
  QS as ck,
  JS as cl,
  eC as cm,
  ve as cn,
  pf as co,
  zs as cp,
  pa as cq,
  Dv as cr,
  ga as cs,
  fC as ct,
  m6 as cu,
  XS as cv,
  Fv as cw,
  Di as cx,
  rn as cy,
  no as cz,
  Ve as d,
  WS as d$,
  KS as d0,
  t6 as d1,
  mC as d2,
  yC as d3,
  Fi as d4,
  Xc as d5,
  J_ as d6,
  o0 as d7,
  jS as d8,
  f6 as d9,
  Rs as dA,
  Cp as dB,
  Qs as dC,
  US as dD,
  Xs as dE,
  md as dF,
  uC as dG,
  rC as dH,
  Ps as dI,
  hd as dJ,
  qs as dK,
  cC as dL,
  h6 as dM,
  Ni as dN,
  Ip as dO,
  YS as dP,
  tw as dQ,
  d6 as dR,
  u6 as dS,
  z_ as dT,
  om as dU,
  W_ as dV,
  DS as dW,
  lC as dX,
  Iw as dY,
  y4 as dZ,
  Xi as d_,
  Q4 as da,
  Ft as db,
  l6 as dc,
  Ke as dd,
  bt as de,
  Yg as df,
  od as dg,
  Lm as dh,
  r6 as di,
  FS as dj,
  Gt as dk,
  aC as dl,
  nC as dm,
  F3 as dn,
  gC as dp,
  vC as dq,
  ya as dr,
  Wd as ds,
  ot as dt,
  i6 as du,
  Ze as dv,
  wC as dw,
  bC as dx,
  Zs as dy,
  V_ as dz,
  H6 as e,
  a6 as e0,
  G_ as e1,
  K_ as e2,
  De as e3,
  Ep as e4,
  e6 as e5,
  Sc as e6,
  H_ as e7,
  tr as e8,
  U_ as e9,
  iC as eA,
  Xn as eB,
  Dl as ea,
  n6 as eb,
  PS as ec,
  Ra as ed,
  qS as ee,
  un as ef,
  ei as eg,
  pd as eh,
  HS as ei,
  gt as ej,
  kC as ek,
  b4 as el,
  RS as em,
  NS as en,
  Z_ as eo,
  Li as ep,
  oC as eq,
  nr as er,
  Ql as es,
  ox as et,
  Ls as eu,
  Y_ as ev,
  is as ew,
  Q_ as ex,
  X_ as ey,
  tt as ez,
  P2 as f,
  I_ as g,
  pn as h,
  k_ as i,
  L_ as j,
  w_ as k,
  u_ as l,
  i4 as m,
  co as n,
  m_ as o,
  C6 as p,
  $_ as q,
  Fr as r,
  Wr as s,
  Ae as t,
  v5 as u,
  o_ as v,
  E_ as w,
  l_ as x,
  _n as y,
  M_ as z
};
