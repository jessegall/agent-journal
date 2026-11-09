import { openBlock as u, createElementBlock as d, normalizeStyle as ye, unref as L, renderSlot as he, createElementVNode as m, normalizeClass as K, Fragment as D, renderList as ne, defineComponent as Ui, Comment as Gi, h as ua, cloneVNode as Vi, createBlock as F, withCtx as j, createVNode as I, toDisplayString as v, createCommentVNode as k, ref as O, inject as Me, watch as ge, onMounted as _e, onBeforeUnmount as et, reactive as Ht, shallowRef as Xe, onUnmounted as Be, useAttrs as ca, computed as E, resolveDynamicComponent as ut, mergeProps as Pe, useId as Os, resolveDirective as Ki, withDirectives as Je, createTextVNode as V, Teleport as da, nextTick as je, Transition as zt, withModifiers as Se, createApp as Yi, shallowReactive as Qi, withKeys as _t, onScopeDispose as fa, useModel as on, mergeModels as Pt, toRef as Sa, vModelText as Yn, resolveComponent as Xi, provide as Il, onErrorCaptured as Ji, TransitionGroup as Ts, isRef as go, getCurrentInstance as Zi, getCurrentScope as Bl, createSlots as eu, vShow as Rl, useSlots as tu, normalizeProps as nu, guardReactiveProps as au, defineAsyncComponent as su } from "vue";
function Ll(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ou = 1600, lu = {
  __name: "Shimmer",
  setup(e) {
    const t = Ll(ou);
    return (n, a) => (u(), d("span", {
      class: "shimmer",
      style: ye(L(t))
    }, null, 4));
  }
}, Zt = /* @__PURE__ */ z(lu, [["__scopeId", "data-v-6c018b03"]]), ru = { class: "skeleton-line" }, iu = 2e3, uu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Ll(iu);
    return (n, a) => (u(), d("span", ru, [
      he(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: K(["bars", { faded: e.filled }])
      }, [
        (u(!0), d(D, null, ne(e.bars, (s) => (u(), d("span", {
          key: s.width,
          class: K(["bar", { still: e.still }]),
          style: ye({ ...L(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ z(uu, [["__scopeId", "data-v-484fe8a0"]]), Ut = Ui({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Gi);
      return a.length !== 1 ? ua(D, { key: n }, a) : a[0].key == null ? Vi(a[0], { key: n }) : a[0];
    };
  }
}), cu = ["aria-label"], du = ["aria-label"], fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], gu = ["aria-label"], vu = {
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
    return (i, c) => (u(), F(Ut, { value: e.shape }, {
      messages: j(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), d(D, null, ne(t, (f) => I(Zt, {
            key: f.id,
            class: K(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, cu)
      ]),
      older: j(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), d(D, null, ne(t.slice(0, 3), (f) => (u(), F(Zt, {
            key: f.id,
            class: K(["skeleton-message", { mine: f.mine }]),
            style: ye({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, du)
      ]),
      cards: j(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), d(D, null, ne(e.count, (f) => (u(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (u(), d(D, null, ne(n, (h) => I(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, fu)
      ]),
      file: j(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), d(D, null, ne(e.count, (f) => (u(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            I(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), d(D, null, ne(s, (h) => I(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, hu)
      ]),
      page: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          I(bt, {
            class: "skeleton-heading",
            bars: r
          }),
          (u(!0), d(D, null, ne(e.count, (f) => (u(), F(bt, {
            key: f,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, mu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), d(D, null, ne(e.count, (f) => (u(), F(bt, {
            key: f,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, pu)
      ]),
      default: j(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), d(D, null, ne(e.count, (f) => (u(), F(bt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, gu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ke = /* @__PURE__ */ z(vu, [["__scopeId", "data-v-ef519c5f"]]), yu = {
  key: 1,
  class: "empty-state titled"
}, bu = { class: "empty-state-title" }, ku = { class: "empty-state-text" }, wu = {
  key: 2,
  class: "empty-state"
}, $u = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), d("div", yu, [
      m("p", bu, v(e.title), 1),
      m("p", ku, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), d("p", wu, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ln = /* @__PURE__ */ z($u, [["__scopeId", "data-v-b27e89b0"]]), xu = { class: "fold-group" }, Su = ["aria-expanded"], Mu = { class: "fold-label" }, _u = {
  key: 0,
  class: "fold-count"
}, Cu = {
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
    return (a, s) => (u(), d("div", xu, [
      m("button", {
        type: "button",
        class: K(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Mu, v(e.label), 1),
        e.count !== "" ? (u(), d("span", _u, v(e.count), 1)) : k("", !0),
        m("span", {
          class: K(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Su),
      e.open ? he(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, CS = /* @__PURE__ */ z(Cu, [["__scopeId", "data-v-9ef1865c"]]), Eu = 150, Au = () => Eu;
function Is(e, t, n = Au(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Nl(e, t, n) {
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
const Ou = 50, vo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function ES(e) {
  const t = tt().sources.find((n) => n.key === e);
  return t ? os(t.read, t.events) : os("", []);
}
function ql(e, t, n, a, s = () => !1) {
  const o = O([]), l = O(null), r = O(""), i = O(!1), c = performance.now(), f = O(!1), h = O(""), p = O(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function A(g) {
    return s() ? (y.add(g), b ?? (b = new Promise((M) => setTimeout(() => M(S()), Ou)))) : x(g);
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
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((ee) => ee.id === g.row_id)) return A(g.row_id);
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
    f.value = vo(C.value, n());
    const R = new Set(o.value.map((U) => U.id));
    return o.value = [...o.value, ...C.value.rows.filter((U) => !R.has(U.id))], !0;
  }
  let N = 0;
  function w(g, M) {
    var U, Z;
    const C = g.ok ? e.shared ? [g.value] : ((U = g.value) == null ? void 0 : U.rows) ?? [] : [];
    g.ok && (o.value = M(C)), l.value = g.ok ? g.value : null;
    const R = C.length ? Math.min(...C.map((ee) => ee.id)) : 0;
    g.ok && ((Z = g.value) != null && Z.rows) && !o.value.some((ee) => ee.id < R) && (f.value = !e.shared && vo(g.value, n())), r.value = g.ok ? "" : g.error, Is(c, () => i.value = !0);
  }
  async function H(g) {
    const M = ++N, C = await t({});
    M === N && w(C, g);
  }
  const P = (g) => {
    if (!a() || !g.length) return g;
    const M = Math.min(...g.map((R) => R.id)), C = Math.max(...g.map((R) => R.id));
    return [...o.value.filter((R) => R.id > C), ...g, ...o.value.filter((R) => R.id < M)];
  }, q = () => H(P), _ = (g) => w(g, P), T = () => H((g) => g);
  async function $(g, M = null) {
    const C = await Nl(M && { target: o, fields: { value: M(o.value) } }, g, e.run);
    return h.value = C.ok ? "" : C.error, p.value = C.ok ? C.value : null, await q(), C;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: f, load: q, loadLatest: T, older: W, act: $, actionFailure: h, answer: p, context: e, heard: B, showFirst: _, pageSize: n };
}
const Tu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function os(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = tt(), l = ql(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Tu(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Iu = 2e3;
function Bs(e, t, n = Iu) {
  let a = null, s = !1, o = !1, l = !1;
  const r = Me(Ne, null), i = () => {
    var A;
    return ((A = r == null ? void 0 : r.visible) == null ? void 0 : A.value) === !1;
  }, c = () => document.hidden || i(), f = async (A) => {
    o = !0;
    try {
      await A();
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
    var A;
    return (A = r == null ? void 0 : r.visible) == null ? void 0 : A.value;
  }, b), _e(async () => {
    document.addEventListener("visibilitychange", b), i() || await y();
  }), et(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const Dl = typeof document < "u" && document.documentElement.classList.contains("phone"), Pl = 120;
var Ol;
const Ma = globalThis[Ol = Symbol.for("journal.pressed")] ?? (globalThis[Ol] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Bu(e = 0) {
  const t = Ma.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Ma.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Ma.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function ls(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function jl(e = window) {
  if (!ls(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    ls(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const rs = "journal.stale-build-reload", Ru = 'script[type="module"][src*="/assets/index-"]', yo = (e) => {
  var t;
  return ((t = e.querySelector(Ru)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Lu(e = document, t = (a, s) => Ee.quietRead(a, s), n = () => jl(window)) {
  const a = yo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = yo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let _a = "";
function Nu(e, t = () => jl(window)) {
  if (!e) return !1;
  const n = !!_a && _a !== e;
  return _a = e, n && t(), n;
}
const qu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Du(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(rs) === e.message) return !1;
    t.setItem(rs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Pu(e = window.sessionStorage) {
  try {
    e.removeItem(rs);
  } catch {
    return;
  }
}
const ju = 2e3, Fu = 3e4, Ge = Ht({ starting: !1, external: !1, late: !1, offline: !1 }), Rs = () => Ge.starting, Wu = 3;
let Cn = 0, is = 0, Fl = 0, Wl = [];
async function Hu() {
  try {
    const e = await Ee.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let bo = null;
const zu = () => bo ?? (bo = Hu().finally(() => bo = null));
function Uu() {
  clearTimeout(is), clearTimeout(Fl), is = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), Wl.splice(0).forEach((e) => e()), Lu();
}
async function Gu() {
  Ge.offline = !navigator.onLine;
  const e = await zu();
  if (Ge.external = e.updating, Cn = !e.restarting && !e.updating && e.reachable ? Cn + 1 : 0, Cn < Wu) return;
  Cn = 0, (!Nu(e.started_at) || ls()) && Uu();
}
function Hl() {
  is = setTimeout(async () => {
    await Gu(), Ge.starting && Hl();
  }, ju);
}
function Vu() {
  Ge.starting || (Ge.starting = !0, Ge.offline = !navigator.onLine, Hl(), Fl = setTimeout(() => Ge.late = !0, Fu));
}
const zl = () => Ge.starting ? new Promise((e) => Wl.push(e)) : Promise.resolve();
function Ls(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const r = () => {
    o = !1, a = Date.now(), l && (l = !1, c());
  }, i = () => {
    s = null;
    const f = e();
    a = Date.now(), f instanceof Promise && (o = !0, f.catch(() => {
    }).finally(r));
  }, c = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const f = t - (Date.now() - a);
    f <= 0 ? i() : s = setTimeout(i, f);
  };
  return c.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, c;
}
function Ku(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Yu {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Ls(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Ku(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const dt = "viewer.shell", En = 2e4, Qu = 4, ko = "/api/read-lines", Xu = 5e3, Ju = 403, wo = "/api/repeated-lines", Zu = 10, ec = 2e3, tc = 3e5, AS = 6e5, An = 6, nc = 500, ac = "/journal/summary", $o = "/api/server-state", sc = 2e4, On = Dl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, oc = (e) => e.split("?")[0].endsWith(ac), us = (e, t) => Object.assign(new Error(t), { status: e });
async function lc(e, t, n = us) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const rc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), ic = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), xo = (e) => e.split(" ").slice(0, 2).join(" "), st = "read", Bt = "write", uc = "stream";
class cc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = An;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = xo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < ec));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Zu || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(wo, { method: "POST", headers: { ...On, "Content-Type": "application/json" }, body: r }, [{ window: dt, line: wo, kind: Bt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Bu(n ? Pl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: ic(n.signal, s) } : n;
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
      throw o instanceof TypeError && Vu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Qu ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(ko, { headers: On }, [{ window: dt, line: ko, kind: st }], Xu).then(async (t) => {
      if (t.status === Ju) return /* @__PURE__ */ new Set();
      if (!t.ok) throw us(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Yu(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = xo(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = An;
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
    const r = a instanceof FormData, i = { method: t, headers: { ...On, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: rc(a) }, c = s || (r ? tc : En);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: dt, line: n, kind: st }], c)) : await this.sent(n, i, [{ window: dt, line: n, kind: Bt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, nc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = An, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return lc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: dt, line: t, kind: st }], En)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: On });
    if (!n.ok) throw us(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, An, o).then((r) => (this.written(n), r)) : Rs() && !oc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: dt, line: t, kind: uc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out($o, { cache: "no-store" }, [{ window: dt, line: $o, kind: st }], sc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = dt, line: s = t, limit: o = En } = {}) {
    const l = (n.method ?? "GET") === "GET" ? st : Bt;
    return l === Bt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Ca = Symbol.for("journal.transport"), Ee = globalThis[Ca] ?? (globalThis[Ca] = new cc());
class Ul {
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
    Ee.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Ns(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Ns(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const dc = 50, fc = "refresh", hc = 1e3, mc = 3e4, pc = "requested", gc = "after_window", vc = 50, Tn = ".*", yc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function bc(e) {
  const t = {}, n = Ht({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, r = /* @__PURE__ */ new Set();
  let i = {}, c = 0, f = 0, h = !1;
  function p(_) {
    const T = () => i[_] ?? i[`${_.slice(0, _.lastIndexOf("."))}.*`] ?? {}, $ = O(void 0), g = ql(e, async (M) => {
      const C = await A(_, M);
      return C.ok && !Object.keys(M).length && ($.value = C.value), C;
    }, () => T().page_size || vc, () => !!T().page_size, () => !!T().reads_ids);
    return t[_] = { ...g, data: $, readAt: 0 };
  }
  const y = new Proxy({}, { get: (_, T) => typeof T != "string" || T.startsWith("__v") ? void 0 : t[T] ?? p(T) }), b = (_) => (i[_].loading !== pc || _.endsWith(Tn)) && (!i[_].tab || i[_].tab === n.tab);
  function A(_, T = {}) {
    return new Promise(($) => {
      a.push({ name: _, flags: T, resolve: $ }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const _ = /* @__PURE__ */ new Map(), T = a.splice(0).filter((M) => {
      const C = JSON.stringify(M.flags);
      return _.has(M.name) || _.set(M.name, C), _.get(M.name) === C ? !0 : (a.push(M), !1);
    });
    a.length && setTimeout(S);
    const $ = Object.fromEntries(T.flatMap(({ name: M, flags: C }) => Object.entries(C).map(([R, U]) => [`${M}.${R}`, U]))), g = await e.readKeys({ only: [...new Set(T.map(({ name: M }) => M))], state: { ...n, ...$ } });
    T.forEach(({ name: M, resolve: C }) => C(g.ok ? g.value.keys[M] : g));
  }
  async function x(_) {
    var M;
    const T = ++f;
    (_.length ? _ : Object.keys(i).filter((C) => !C.endsWith(Tn) && i[C].loading === "first" && b(C))).forEach((C) => l[C] = T);
    const g = await e.readKeys({ only: _, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const C = (_.length ? _ : Object.keys(t)).filter((U) => (l[U] ?? 0) <= T);
      C.forEach((U) => {
        y[U].readAt = Date.now(), g.failure === "unreachable" ? r.add(U) : r.delete(U), y[U].showFirst(g);
      });
      const R = g.failure === "unreachable" && ((M = e.waitForServer) == null ? void 0 : M.call(e));
      return R && R.then(() => {
        if (h) return;
        const U = C.filter((Z) => l[Z] === T);
        (U.length || !_.length && !C.length && f === T) && x(U);
      }), !1;
    }
    return P(g.value.declared), Object.entries(g.value.keys).forEach(([C, R]) => {
      (l[C] ?? 0) > T || (l[C] = T, y[C].readAt = Date.now(), r.delete(C), R.ok && (y[C].data.value = R.value), y[C].showFirst(R));
    }), !0;
  }
  function B(_) {
    const T = yc(_);
    return T.length ? (T.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, $(x(g));
    })))) : x([]);
  }
  function W(_) {
    _.forEach((T) => s.add(T)), clearTimeout(c), c = setTimeout(() => {
      const T = [...s];
      s.clear(), T.length && B(T);
    }, dc);
  }
  const N = (_) => _.endsWith(Tn) ? Object.keys(t).filter((T) => T.startsWith(_.slice(0, -1)) && t[T].readAt) : [_], w = (_) => (i[_] ?? i[`${_.split(".")[0]}.*`]).reload_seconds;
  function H(_) {
    const T = Object.keys(i).filter((g) => _.event === fc || i[g].events.some((M) => Ns(M, _.event)));
    T.filter((g) => i[g].page_size).forEach((g) => y[g].heard(_));
    const $ = T.filter((g) => !i[g].page_size);
    $.filter((g) => !b(g)).forEach((g) => y[g].readAt = 0), W($.filter(b).flatMap(N));
  }
  function P(_) {
    if (Object.keys(i).length) return;
    i = _;
    const T = [...new Set(Object.values(_).flatMap((g) => g.events))];
    T.length && e.follow(T, H);
    const $ = Object.keys(_).filter((g) => _[g].loading === gc);
    $.length && x($);
  }
  ge(() => n.tab, () => {
    const _ = Object.keys(i).filter((T) => !T.endsWith(Tn) && b(T) && !y[T].readAt);
    _.length && x(_);
  }), Be(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const _ = Date.now(), T = Object.keys(i).filter(($) => i[$].reload_seconds > 0 && b($)).flatMap(N).filter(($) => _ - y[$].readAt >= (r.has($) ? Math.min(w($) * 1e3, mc) : w($) * 1e3));
    T.length && W(T);
  }
  return Bs(q, () => e.visible.value, hc), queueMicrotask(() => x([])), { props: y, state: n, reload: B, readKey: A };
}
const kc = Symbol("open-view"), Ne = Symbol.for("journal.window-context"), Gl = Symbol("dock-card");
function wc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = bc(e));
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
  return wc(e);
}
const $c = (e, t) => e(Gl, t), OS = () => Me(Gl), cs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', So = {
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
  agent: cs,
  worker: cs,
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
}, xc = ["data-icon", "stroke-width", "innerHTML"], re = {
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
      agent: cs,
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
    return (o, l) => (u(), d("svg", {
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
    }, null, 12, xc));
  }
}, Sc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), d("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Mc = /* @__PURE__ */ z(Sc, [["__scopeId", "data-v-eb453d6f"]]), _c = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ca(), a = E(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = O(!1), o = E(() => t.busy || s.value), l = Me(Ne, null), r = E(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Pl);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, f) => (u(), F(ut(e.href ? "a" : "button"), Pe(a.value, {
      type: e.href ? void 0 : L(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: j(() => [
        m("span", {
          class: K(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), F(re, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          he(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), F(Mc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ z(_c, [["__scopeId", "data-v-ededdadf"]]), Cc = ["aria-checked", "aria-haspopup", "onClick"], Ec = {
  key: 0,
  class: "segmented-dot"
}, Ac = {
  key: 1,
  class: "segmented-note"
}, Oc = {
  key: 2,
  class: "segmented-count"
}, Tc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Os();
    return (s, o) => {
      const l = Ki("tip");
      return u(), d("span", {
        class: K(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), d(D, null, ne(e.options, (r) => Je((u(), d("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: K(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (u(), d("span", Ec)) : k("", !0),
          V(" " + v(r.label) + " ", 1),
          r.note ? (u(), d("small", Ac, v(r.note), 1)) : k("", !0),
          r.count !== void 0 ? (u(), d("em", Oc, v(r.count), 1)) : k("", !0)
        ], 10, Cc)), [
          [l, r.tip || r.title, `${L(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, jt = /* @__PURE__ */ z(Tc, [["__scopeId", "data-v-c89bc92d"]]), Ic = {
  key: 0,
  class: "more-items"
}, Bc = {
  key: 0,
  role: "alert"
}, Rc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), d("div", Ic, [
      e.failure ? (u(), d("p", Bc, v(e.failure), 1)) : k("", !0),
      e.more ? (u(), F(ve, {
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
}, vn = /* @__PURE__ */ z(Rc, [["__scopeId", "data-v-10464014"]]), Lc = { class: "link-group" }, Nc = {
  class: "group-label",
  "data-link-kind": ""
}, qc = ["disabled", "onClick"], Dc = { class: "title" }, Pc = { class: "relations" }, jc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1), o = E(() => s.value ? n.rows : n.rows.slice(0, 3)), l = E(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), r = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, i = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (u(), d("div", Lc, [
      m("div", Nc, v(l.value), 1),
      (u(!0), d(D, null, ne(o.value, (p) => (u(), d("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(p), {
        disabled: r(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Dc, v(p.endpoint.title), 1),
        m("span", Pc, [
          V(v(c(p)), 1),
          r(p) ? (u(), d(D, { key: 0 }, [
            V(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, qc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Fc = /* @__PURE__ */ z(jc, [["__scopeId", "data-v-be6f079c"]]), Wc = ["data-loaded"], Hc = { class: "rows" }, zc = ["disabled", "onClick"], Uc = { class: "title" }, Gc = { class: "relations" }, Vc = { key: 2 }, Kc = {
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
    const n = e, a = t, s = O([]), o = O({}), l = O(0), r = O(""), i = O(null), c = O(!1), f = O("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (_) => _.toUpperCase())}s`, b = E(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, _) => q + _, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, _]) => ({ key: q, label: y(q), count: _ }))
    ]), A = E(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((T) => T.endpoint.model))].map((T) => [T, s.value.filter(($) => $.endpoint.model === T).length])), _ = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([T], [$]) => (_[T] ?? 3) - (_[$] ?? 3)).map(([T, $]) => ({ model: T, count: $, rows: s.value.filter((g) => g.endpoint.model === T) }));
    }), S = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, x = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), B = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (_) => _.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((_) => _.replaceAll("_", " ")).join(", ")}`;
    async function W(q = 1) {
      const _ = ++h;
      c.value = !0, f.value = "";
      const T = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && T.push("--outside-plan"), n.documentId && T.push("--first-counterpart", `doc:${n.documentId}`), r.value && T.push("--kind", r.value);
      try {
        const $ = await n.read(T);
        if (_ !== h) return;
        if (!$.ok) {
          f.value = $.error;
          return;
        }
        const g = $.value.counterparts ?? [], M = q === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(M.map((C) => [`${C.endpoint.model}:${C.endpoint.id}`, C])).values()], o.value = $.value.categories ?? {}, l.value = $.value.total, i.value = $.value.next_page ?? null;
      } catch ($) {
        _ === h && (f.value = $.message);
      } finally {
        _ === h && (c.value = !1);
      }
    }
    function N(q) {
      if (S(q)) return;
      const [_, T] = q.endpoint.open_ref.split(":");
      a("open", { table: _, id: Number(T) });
    }
    function w(q) {
      r.value = q, W();
    }
    const H = () => !c.value && i.value && W(i.value), P = E(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ge(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", W();
    }, { immediate: !0 }), (q, _) => s.value.length || c.value || f.value || e.empty ? (u(), d("section", {
      key: 0,
      class: K(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (u(), F(jt, {
        key: 0,
        options: b.value,
        value: r.value,
        wrap: "",
        onPick: w
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", Hc, [
        e.grouped ? (u(!0), d(D, { key: 0 }, ne(A.value, (T) => (u(), F(Fc, {
          key: T.model,
          model: T.model,
          count: T.count,
          rows: T.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: N
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), d(D, { key: 1 }, ne(s.value, (T) => (u(), d("button", Pe({
          key: `${T.endpoint.model}:${T.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, x(T), {
          disabled: S(T),
          onClick: ($) => N(T)
        }), [
          m("span", Uc, v(T.endpoint.title), 1),
          m("span", Gc, [
            V(v(B(T)), 1),
            S(T) ? (u(), d(D, { key: 0 }, [
              V(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, zc))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (u(), d("p", Vc, v(e.empty), 1)) : k("", !0),
        I(vn, {
          more: !!i.value,
          loading: c.value,
          failure: f.value,
          label: P.value,
          onMore: H
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Wc)) : k("", !0);
  }
}, Yc = /* @__PURE__ */ z(Kc, [["__scopeId", "data-v-3b23de37"]]), Qc = (e, t, n) => Math.max(t, Math.min(n, e)), Xc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Vl = /* @__PURE__ */ new WeakMap(), Jc = (e, t) => Vl.set(e, t);
function Zc(e, t) {
  for (let n = t; n; n = Vl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Kl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Zc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Tt = 8, ed = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = O(null), o = (g) => g ? `${g}px` : void 0, l = E(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = O({ w: 0, h: 0 }), i = O(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (g) => ({
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
      return r.value.w <= C.across && r.value.h <= Math.max(C.below, C.above) ? M : c();
    }
    const A = E(() => {
      if (!i.value) return l.value;
      const g = i.value, M = b(g), C = y(M, g), { w: R, h: U } = r.value, Z = a.align === "auto" ? g.left + g.right > M.left + M.right : a.align === "right", ee = Qc(Z ? g.right - R : g.left, M.left + Tt, Math.max(M.left + Tt, M.right - R - Tt)), ie = U > C.below && C.above > C.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, C.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, C.below) };
      return { ...l.value, ...ie, left: `${ee}px`, maxWidth: p(a.maxWidth, C.across) };
    }), S = n, x = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function B(g) {
      const M = x(), C = M.indexOf(document.activeElement);
      M[(C + g + M.length) % M.length].focus();
    }
    const W = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => S("close") }, N = (g) => W[g.key] && (g.preventDefault(), W[g.key]()), w = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let H = 0;
    const P = new ResizeObserver(() => {
      cancelAnimationFrame(H), H = requestAnimationFrame(w);
    });
    Kl(s, (g) => a.anchor && !a.anchor.contains(g.target) && S("close"));
    const q = (g, M) => ["top", "left", "right", "bottom"].some((C) => Math.abs(g[C] - M[C]) > 1), _ = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let T = 0;
    function $() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || _(g)) return S("close");
        q(g, i.value) && (i.value = g);
      }
      T = requestAnimationFrame($);
    }
    return _e(() => {
      a.anchor && s.value && Jc(s.value, a.anchor), w(), s.value && P.observe(s.value), !a.plain && x()[0] && x()[0].focus(), $();
    }), Be(() => {
      P.disconnect(), cancelAnimationFrame(T), cancelAnimationFrame(H);
    }), t({ element: s }), (g, M) => (u(), F(da, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", Pe({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: A.value,
        onKeydown: N
      }), [
        he(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ha = /* @__PURE__ */ z(ed, [["__scopeId", "data-v-3d203970"]]), td = { class: "split-button" }, nd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = O(null), s = O(!1), o = () => s.value = !1;
    return (l, r) => (u(), d("span", td, [
      I(ve, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
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
        I(ve, {
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
            I(re, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), F(ha, {
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
}, ad = /* @__PURE__ */ z(nd, [["__scopeId", "data-v-c258494d"]]), sd = 0, od = "/api/lines", ld = "/api/line", Mo = 5e3, _o = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Co = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ea = (e) => JSON.stringify(e.line), Eo = () => new DOMException("cancelled", "AbortError");
class rd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ea(t))) {
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
    this.timer ?? (this.timer = setTimeout(() => Ee.whenFree(() => this.send()), sd));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Eo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Eo()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ee.sent(od, _o({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Co(r.body, st)), Mo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ee.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, st), Date.now() - n < Mo ? this.slow.delete(Ea(t.body)) : this.slow.add(Ea(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ee.sent(ld, _o(t.body, t.signal), [Co(t.body, n)], n === st ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Yl = new rd(), id = "/api/window";
function ud(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${id}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (c) => Ee.whenFree(async () => {
    const f = await Ee.sent(l, { signal: c, headers: r }, [{ window: e, line: l, kind: st }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ee.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const Ql = /* @__PURE__ */ new Map();
class cd {
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
function TS(e, t) {
  const n = new cd(e, t);
  return Ql.set(e, n), n.load().catch(() => {
  }), n;
}
const qs = (e) => Ql.get(e);
function dd(e, t, n) {
  const a = qs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function fd(e, t) {
  if (!e) return !0;
  const n = qs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Qn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Xl = {};
async function IS(e = (t) => Ee.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Xl = (await t.json()).states);
}
const Ds = (e, t) => {
  var n;
  return (n = Xl[e]) == null ? void 0 : n[t];
}, rn = (e, t) => {
  var n;
  return ((n = Ds(e, t)) == null ? void 0 : n.label) ?? Qn(t);
}, Jl = (e, t) => {
  var n;
  return ((n = Ds(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, hd = (e, t) => {
  var n;
  return ((n = Ds(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, md = Symbol("pane-page"), Ps = Symbol("inspector-host"), Zl = { 1: "refused", 2: "usage", 3: "fault" }, pd = 100, gd = 50, vd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, yd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function bd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = O({}), declared: c = [], page: f = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: A = {}, search: S = {}, readOnly: x = !1, shared: B = null }) {
  const W = /* @__PURE__ */ new Map(), N = (Z, ee) => l.follow(e, Z, (pe) => {
    W.clear(), ee(pe);
  }, a), w = new AbortController(), H = O(!1), P = performance.now();
  let q = 0, _ = 0, T = () => {
  };
  const $ = new Promise((Z) => T = Z);
  w.signal.addEventListener("abort", T, { once: !0 });
  const g = () => {
    clearTimeout(_), _ = setTimeout(() => {
      q === 0 && Is(P, () => {
        H.value = !0, T();
      });
    }, gd);
  }, M = (Z, ee) => (q += 1, Lt(e, Z, t, w.signal, ee).finally(() => {
    q -= 1, g();
  })), C = (Z, ee) => (g(), $.then(() => w.signal.aborted ? it : Lt(e, Z, t, w.signal, ee))), R = ({ only: Z = [], state: ee = {} } = {}) => (q += 1, wd(() => ud(e, t, Z, ee, w.signal), w.signal).finally(() => {
    q -= 1, g();
  })), U = (Z, { unbatched: ee = !1, deferred: pe = !1 } = {}) => {
    const ie = W.get(Z);
    if (ie && performance.now() - ie.at < pd) return ie.answer;
    const we = pe && !H.value ? C(Z, ee) : M(Z, ee);
    return W.set(Z, { answer: we, at: performance.now() }), we;
  };
  return {
    answered: H,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: E(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: A,
    search: S,
    readOnly: x,
    shared: B,
    read: U,
    readKeys: R,
    waitForServer: () => Rs() ? zl() : null,
    run: (Z) => Lt(e, Z, t, w.signal),
    upload: (Z) => xd(Z, e, w.signal),
    cancel: () => w.abort(),
    signal: w.signal,
    subscriptions: l,
    follow: (Z, ee) => N([Z].flat().filter((pe) => o.some((ie) => Ns(ie, pe))), ee),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: N,
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (Z) => E(() => {
      var ee;
      return i.value[Z] ?? ((ee = c.find((pe) => pe.key === Z)) == null ? void 0 : ee.default);
    }),
    setting: async (Z, ee) => {
      const pe = await U(`window setting ${e} ${Z}`);
      return pe.ok ? pe.value.value : ee;
    },
    setOption: h,
    keep: (Z, ee) => Lt(e, ["window", "save-setting", e, Z, JSON.stringify(ee)], t, w.signal)
  };
}
function er(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const it = { ok: !1, failure: "cancelled", error: "" }, js = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function tr(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? it : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Zl[n.code] || "fault", error: er(n.error) };
  } catch {
    return t != null && t.aborted ? it : { ok: !1, failure: "unreachable", error: js };
  }
}
const kd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Zl[e.code] || "fault", error: er(e.error) };
async function wd(e, t) {
  try {
    const n = await e();
    return t.aborted ? it : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, kd(s)])) } };
  } catch {
    return t.aborted ? it : { ok: !1, failure: "unreachable", error: js };
  }
}
async function nr(e, t, n) {
  const a = await tr(() => Yl.read(e, t, n), t);
  return a.failure !== "unreachable" || !Rs() ? a : (await zl(), t.aborted ? it : nr(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ee.held(() => $d(e, t, n, a, s), Ee.knownRead(Array.isArray(t) ? t : Fs(t)));
}
async function $d(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Fs(t), environment: n };
  return await Ee.isRead(o.line) ? Ee.joined(JSON.stringify(o), (l, r) => nr({ ...o, attribution: r }, l, s), a, o).catch(() => it) : tr(() => Yl.write({ ...o, attribution: {
    client_id: Ee.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function xd(e, t, n = void 0) {
  try {
    const a = await Ee.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? it : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? it : { ok: !1, failure: "unreachable", error: js };
  }
}
function Fs(e) {
  return [...e.matchAll(vd)].map(([t]) => t.replace(yd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Sd = (e) => `show-${e}`, BS = (e, t, n) => e.filter((a) => {
  var s;
  return n(Sd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ar = "messages.chat", Md = {
  key: 0,
  class: "template-brief"
}, _d = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Cd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O([]), o = O(""), l = E(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), r = E(() => s.value.find((c) => String(c.id) === n.value));
    async function i() {
      const c = await Lt(ar, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === f);
      h && a("pick", String(h.id));
    }
    return i(), (c, f) => (u(), d(D, null, [
      I(jt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      r.value ? (u(), d("p", Md, v(r.value.brief), 1)) : k("", !0),
      o.value ? (u(), d("p", _d, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Ed = /* @__PURE__ */ z(Cd, [["__scopeId", "data-v-14be8a5c"]]), Ad = { class: "info-tip" }, Od = ["aria-label"], Td = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Id = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (u(), d("span", Ad, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        I(re, {
          name: "info",
          size: 13
        })
      ], 8, Od),
      m("span", Td, [
        (u(!0), d(D, null, ne(e.lines, (a, s) => (u(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, sr = /* @__PURE__ */ z(Id, [["__scopeId", "data-v-a2fe5ff1"]]), Bd = { class: "form-field" }, Rd = { class: "form-field-head" }, Ld = ["for"], Nd = {
  key: 1,
  class: "form-field-aside"
}, qd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), d("div", Bd, [
      m("div", Rd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Ld),
        e.help ? (u(), F(sr, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (u(), d("span", Nd, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Dd = /* @__PURE__ */ z(qd, [["__scopeId", "data-v-302c40bf"]]), ds = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Pd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ca(), n = E(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((u(), d("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [L(ds), L(t).value]
    ]);
  }
}), jd = /* @__PURE__ */ z(Pd, [["__scopeId", "data-v-e130a5b9"]]), Fd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Os(), o = E(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (u(), F(Dd, {
      label: e.field.label,
      for: L(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        I(Ut, { value: o.value }, {
          choice: j(() => [
            I(jt, {
              id: L(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            I(Ed, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            I(jd, {
              id: L(s),
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
}, ma = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), F(ve, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        I(re, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Wd(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Hd = (e, t = () => !0) => Wd("keydown", (n) => n.key === "Escape" && t() && e());
function or(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = O(!1), s = E(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Hd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const zd = 80, It = Ht([]);
function lr(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return ge(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), E(() => zd + Math.max(0, It.indexOf(t)));
}
let rr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return rr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Ud = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Gd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Ud)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : rr, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Vd = ["aria-modal", "aria-label", "aria-labelledby"], Kd = {
  key: 0,
  class: "dialog-head"
}, Yd = ["id", "tabindex"], Qd = {
  key: 1,
  class: "dialog-foot"
}, Xd = 500, Jd = 400, Zd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = or(a, n), r = lr(s), i = O(null), c = O(null), f = O(null), h = Os(), p = O(!1), y = Date.now();
    n.modal && Gd(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Jd);
    }
    function A(B) {
      !n.modal || Date.now() - y >= Xd || ![" ", "Enter"].includes(B.key) || (B.preventDefault(), B.stopPropagation());
    }
    const S = () => i.value && (i.value.scrollTop = i.value.scrollHeight), x = new MutationObserver(S);
    return ge(i, (B) => {
      x.disconnect(), B && n.follow && (x.observe(B, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Be(() => x.disconnect()), (B, W) => (u(), F(da, { to: "body" }, [
      I(zt, {
        name: "dialog",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
          L(s) ? (u(), d("div", {
            key: 0,
            class: K(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: L(r) }),
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
              onKeydownCapture: A
            }, [
              e.bare ? k("", !0) : (u(), d("header", Kd, [
                m("h3", {
                  id: L(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Yd),
                e.closable ? (u(), F(ma, {
                  key: 0,
                  onClick: L(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: i,
                class: K(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                he(B.$slots, "default", {}, void 0, !0)
              ], 2),
              B.$slots.foot ? (u(), d("footer", Qd, [
                he(B.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Vd)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, pa = /* @__PURE__ */ z(Zd, [["__scopeId", "data-v-24a11f8a"]]), ef = {
  class: "action-output",
  "data-action-output": ""
}, tf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), F(pa, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        m("pre", ef, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, nf = /* @__PURE__ */ z(tf, [["__scopeId", "data-v-b32f94a4"]]);
function af(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Yi(nf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const sf = (e, t, n = {}) => Fs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function yn(e, t, n, a = {}) {
  var s;
  try {
    if (!await fd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(ar, sf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && af(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const of = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Aa = [
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
}), ga = {
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
    filters: Aa
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Aa
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
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: Aa }),
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
}, lf = ["secrets", "plugins"], ir = Object.keys(ga).filter((e) => !(Dl && lf.includes(e)));
E(() => ir.map((e) => ({ name: e, ...ga[e] })));
const Gt = (e) => ga[e], ur = new Map(ir.flatMap((e) => [e, e.replace(/s$/, ""), ga[e].title.toLowerCase()].map((t) => [t, e]))), gt = (e) => ur.get(String(e).toLowerCase()) || "", cr = [...ur.keys()].sort((e, t) => t.length - e.length).join("|"), rf = {
  class: "button-form",
  "data-button-form": ""
}, uf = {
  key: 0,
  class: "button-form-title"
}, cf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, df = { class: "button-form-actions" }, ff = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = O(!1), l = O(""), r = E(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), i = E(() => {
      var h;
      if (!n.row) return n.button.label;
      const f = ((h = Gt(gt(n.row.term))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !r.value) return;
      o.value = !0;
      const f = await yn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, h) => (u(), F(pa, {
      padded: "",
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: j(() => {
        var p;
        return [
          m("div", rf, [
            (p = e.row) != null && p.title ? (u(), d("p", uf, v(e.row.title), 1)) : k("", !0),
            (u(!0), d(D, null, ne(e.button.fields, (y) => (u(), F(Fd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), d("p", cf, v(l.value), 1)) : k("", !0),
            m("div", df, [
              I(ve, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: j(() => [...h[2] || (h[2] = [
                  V("Cancel", -1)
                ])]),
                _: 1
              }),
              I(ve, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
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
}, hf = /* @__PURE__ */ z(ff, [["__scopeId", "data-v-e3f0d786"]]), mf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, pf = {
  key: 1,
  class: "menu-item-text"
}, gf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), d("button", {
      type: "button",
      class: K(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), d("span", mf, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (u(), d("span", pf, [
        m("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ze = /* @__PURE__ */ z(gf, [["__scopeId", "data-v-fec99974"]]), vf = ["aria-busy"], yf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, bf = { class: "button-slot-confirm-text" }, kf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, wf = {
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
    const n = e, a = t, s = E(() => qs(n.environment)), o = E(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = E(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = E(() => n.readOnly ? [] : dd(n.environment, n.name, n.row)), c = O(null), f = O(null), h = O(""), p = O(!1), y = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), b = (x) => x.icon || (x.warning ? "dot" : "");
    function A(x) {
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
      const B = await yn(x, n.row, n.environment);
      p.value = !1, h.value = B.ok ? "" : B.error;
      const W = x.label.toLowerCase() + (n.objectName && !x.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", B.ok ? "" : `Could not ${W}: ${B.error}`), B.ok && a("done");
    }
    return (x, B) => (u(), d("span", {
      class: K(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), d(D, { key: 0 }, [
        B[5] || (B[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        I(ve, {
          small: "",
          onClick: r
        }, {
          default: j(() => [...B[4] || (B[4] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (u(), d("span", yf, [
        m("span", bf, v(f.value.confirm), 1),
        I(ve, {
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
        I(ve, {
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
      ])) : o.value ? k("", !0) : (u(), d(D, { key: 2 }, [
        (u(!0), d(D, null, ne(i.value, (W) => (u(), d(D, {
          key: W.name
        }, [
          W.menu.length ? (u(), F(ad, {
            key: 0,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": W.menu_label || "More ways",
            title: y(W),
            "data-button": W.name,
            onMain: (N) => A(W)
          }, {
            menu: j(({ close: N }) => [
              (u(!0), d(D, null, ne(W.menu, (w) => (u(), F(ze, {
                key: w.label,
                description: w.description,
                onClick: (H) => (N(), A({ ...W, ...w, menu: [] }))
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
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), F(ve, {
            key: 1,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            bordered: !W.primary,
            class: K({ danger: W.danger }),
            icon: b(W),
            disabled: p.value,
            title: y(W),
            "data-button": W.name,
            onClick: (N) => A(W)
          }, {
            default: j(() => [
              V(v(W.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), d("span", kf, v(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (u(), F(hf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: B[2] || (B[2] = (W) => c.value = null),
          onDone: B[3] || (B[3] = (W) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, vf));
  }
}, Ws = /* @__PURE__ */ z(wf, [["__scopeId", "data-v-a4b6f174"]]), $f = {
  class: "running",
  "data-running-command": ""
}, xf = ["title"], Sf = {
  key: "idle",
  class: "running-idle"
}, Mf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), d("span", $f, [
      I(zt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (u(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, xf)) : (u(), d("span", Sf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, RS = /* @__PURE__ */ z(Mf, [["__scopeId", "data-v-d3240219"]]), _f = ["aria-checked", "aria-label", "title"], Cf = {
  key: 0,
  class: "switch-inner"
}, Ef = {
  key: 0,
  class: "switch-word"
}, Af = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), d("button", {
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
        e.labelled ? (u(), d("span", Cf, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), d("span", Ef, v(e.word), 1)) : k("", !0)
    ], 10, _f));
  }
}, LS = /* @__PURE__ */ z(Af, [["__scopeId", "data-v-a4c6c503"]]);
function dr(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Xn(e, t) {
  return dr(() => localStorage, e, t);
}
function fr(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Hs(e, t) {
  return fr(() => localStorage, e, t);
}
function hr(e, t) {
  ge(t, (n) => Hs(e, n), { deep: !0 });
}
function Of(e, t) {
  return dr(() => sessionStorage, e, t);
}
function Tf(e, t) {
  return fr(() => sessionStorage, e, t);
}
const Jn = "journal.environment", mr = O(Of(Jn, Xn(Jn, "")));
function If(e) {
  mr.value = e, Tf(Jn, e), Hs(Jn, e);
}
const Zn = O(location.hash), Ao = Xe(null), Oo = { integrations: "mcp", library: "team" };
function Bf() {
  if (!Ao.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Oo[n]) {
    location.replace(`#/${[Oo[n], ...a].join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash;
    return;
  }
  !n || Ao.value(n) || (If(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Zn.value = location.hash, Bf();
});
const fs = E(() => {
  const [e, t = ""] = Zn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [c = "", f = "", h = ""] = r.split(":");
    return { table: c, id: Number(f), comment: Number(h) || 0, env: i };
  });
  return {
    env: mr.value,
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
}), zs = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${zs.page(e)}?open=${t}`
};
function Rf(e = "", t = 0, n = "") {
  location.hash = zs.page(e, t, n);
}
function Lf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Nf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function pr(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Nf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function NS(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function yt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = fs.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  pr([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function qf(e, t, n, a = 0, s = "") {
  if (e === fs.value.env) return yt(t, n, a, s);
  const o = fs.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  pr([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function De(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? qf(a, s, Number(o), 0, t) : yt(s, Number(o), 0, t);
}
function Df(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = Df(e);
  t && De(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function qS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Pf = { class: "inspector-part" }, jf = { class: "inspector-part-title" }, Ff = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), d("section", Pf, [
      m("h4", jf, v(e.title), 1),
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, DS = /* @__PURE__ */ z(Ff, [["__scopeId", "data-v-5175e4a3"]]), To = /* @__PURE__ */ new Map(), Wf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = O(null), a = O(!1), s = O(t.name && To.get(t.name) || !1);
    function o(i) {
      s.value = i, t.name && To.set(t.name, i);
    }
    const l = () => {
      const i = !!n.value && n.value.scrollHeight > t.at;
      i !== a.value && (a.value = i);
    }, r = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && r.observe(n.value.firstElementChild || n.value)), Be(() => r.disconnect()), (i, c) => (u(), d(D, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: K(["folded-body", { folded: a.value && !s.value }]),
        style: ye(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        he(i.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (u(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = Se((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, gr = /* @__PURE__ */ z(Wf, [["__scopeId", "data-v-4d2235ba"]]), Hf = ["aria-valuenow", "aria-valuemax"], zf = {
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
    const t = e, n = E(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (u(), d("span", {
      class: K(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: ye({ width: n.value })
      }, null, 4)
    ], 10, Hf));
  }
}, vr = /* @__PURE__ */ z(zf, [["__scopeId", "data-v-9eba6a85"]]), Uf = { processes: "process", memories: "memory", replies: "reply" }, ea = (e) => (Uf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), hs = [], Gf = 2e3, ht = /* @__PURE__ */ new Map(), Vf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Kf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? hs.unshift(e) : hs.push(e), ht.clear();
}
function yr(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Yf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Qf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function rt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Xf(e, t) {
  const n = [{ type: "text", text: rt(e).replace(/\r\n/g, `
`) }];
  for (const a of hs)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function un(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Jf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Jf(e) {
  return e.split(Kf).map((t, n) => n % 2 ? t : t.replace(Vf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Io(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Zf = 24;
function eh(e) {
  const [t, , ...n] = e, a = Io(t), s = n.map(Io), o = (i) => [a, ...s].some((c) => (c[i] ?? "").length > Zf) ? ' class="text-column"' : "", l = a.map((i, c) => `<th${o(c)}>${un(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((c, f) => `<td${o(f)}>${un(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const br = /^\s*(?:[-*+]|\d+[.)])\s+/, ms = /^\s*(\d+)[.)]\s/, Bo = (e) => e.match(/^\s*/)[0].length;
function kr(e) {
  const t = e[0].match(ms), n = Bo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && Bo(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${un(o.text)}${o.nested.length ? kr(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function th(e, t) {
  const n = ms.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (br.test(e[s]) && ms.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Ro = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function wr(e) {
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
      const r = t.findIndex((c, f) => f > a && /^(```|~~~)/.test(c)), i = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${un(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Ro(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(eh(t.slice(a, r))), a = r;
      continue;
    }
    if (br.test(s)) {
      const r = th(t, a);
      n.push(kr(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${wr(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Ro(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${un(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const nh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ah = (e) => e.type !== "text" && !nh.test(e.html);
function sh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(wr(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : ah(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Us(e, t = { env: "" }) {
  const n = Qf(e, t), a = ht.get(n);
  if (ht.delete(n), a && a.source === t.source && a.reads.every((l) => Yf(l, t)))
    return ht.set(n, a), a.html;
  const s = [], o = sh(Xf(e, { ...t, reads: s }));
  return ht.set(n, { html: o, reads: s, source: t.source }), ht.size > Gf && ht.delete(ht.keys().next().value), o;
}
const Oa = /* @__PURE__ */ new WeakMap();
function oh(e) {
  if (Oa.has(e)) return Oa.get(e);
  const t = Qi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const h = s(c, f), p = e.read(`${ea(c)} show ${f}`);
    n.set(h, p), p.then((y) => {
      n.get(h) === p && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${ea(c).replace(/-/g, "_")}.*`], (f) => {
      const h = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(h)) continue;
        const y = Number(p.slice(h.length));
        (!f.row_id || f.row_id === y) && o(c, y);
      }
    }));
  }
  function r(c, f) {
    l(c);
    const h = s(c, f);
    return !t.has(h) && !n.has(h) && o(c, f), t.get(h);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return Oa.set(e, i), i;
}
function $r() {
  const e = Me(Ne, null), t = e ? oh(e) : null;
  return (n, a = {}) => Us(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const xr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, bn = (e) => String(e || "").replace(xr, (t, n, a, s) => s), lh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), In = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, rh = /^Traceback \(most recent call last\):/m, ih = 8;
function Sr(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ih).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function uh(e) {
  const t = [...e.matchAll(lh)].map((a) => a.index);
  if (In.lastIndex = 0, !t.length || !In.test(e)) return null;
  In.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(In)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Sr(n), tail: "" } : null;
}
function ch(e) {
  const t = rh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Sr([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = bn(e), n = ch(t) || uh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ta = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Mr = (e) => `${e.table}:${e.id}`, ps = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ta = 80;
function Lo(e) {
  return e.length <= Ta ? e : `${e.slice(0, Ta + 1).replace(/\s+\S*$/, "") || e.slice(0, Ta)}…`;
}
const No = {
  messages: (e) => Lo(ps(e.text)),
  comments: (e) => Lo(ps(e.text)),
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
}, dh = (e) => (No[e.table] ? No[e.table](e) : e.title || "") || "", Ct = (e) => ta(e.created_at), fh = (e) => ta(e.updated_at) || Ct(e), hh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, mh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function ph(e) {
  const t = hh.exec(e);
  if (t && gt(t[1])) return { at: t.index, length: t[0].length, table: gt(t[1]), id: Number(t[2]), label: t[3] };
  const n = mh.exec(e), a = n && gt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function gh(e, t, n, a) {
  const s = yr(a, e, t), o = bn(s ? dh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${rt(Gt(e).title)} ${t}</span><span class="row-card-title">${rt(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = ph(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: gh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const vh = /\.(png|jpe?g|gif|webp|svg)$/i, yh = (e) => vh.test(e), bh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, kh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function wh(e, t) {
  const n = bh.exec(e), [, a, s, o, l, r] = n || [], i = n && gt(a || o), c = i && yr(t, i, Number(s || l));
  if (i !== "messages" || !c || !(c.files || []).includes(r)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(r)}`, h = `${Gt(i).title} ${c.id} · ${rt(r)}`, p = yh(r) ? `<img class="file-card-image" src="${f}" alt="${rt(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${rt(r)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function $h(e) {
  const t = kh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${rt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = wh(e, t) || $h(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const xh = /`([^`\n]+)`/g;
At((e) => e.replace(xh, (t, n) => `<code>${n}</code>`));
const qo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${zs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(xr, (n, a, s, o) => qo[a] ? qo[a](s, o, t) : o)
);
const Sh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, _r = new RegExp(`\\b(${cr}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Cr = new RegExp(`\\b(${cr}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Mh = new RegExp(`<code>((?:${_r.source}|${Cr.source}))</code>`, "gi"), _h = (e) => e.replace(Mh, "$1"), Ch = (e, t) => `<a class="row-pill" href="#" data-peek="${gt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Eh = (e) => e.replace(Cr, (t, n, a) => a.replace(/\d+/g, (s) => Ch(n.replace(/s$/i, ""), s))), Ah = (e) => Eh(e).replace(
  _r,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${gt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : _h(e).split(Sh).map((n, a) => a % 2 ? n : Ah(n)).join("")
);
const Oh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Th = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Ih = /[\w\]]\(/, Bh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Rh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Lh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Nh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, qh = /[[({,]$/, Dh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Ph = /^(\t|\s{2,})\S/, jh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Fh = /`[^`]+`/, Wh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Hh = /[{}()[\];=<>$&|*\\@+^~%]/g, Er = /^\s*(?:[-*+]|\d+[.)])\s/, zh = /^\s*>/, Uh = /^\s*\|/, Gh = 0.6, Vh = 0.4, Kh = 5, Yh = 0.03, Ar = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Kh && t.every((n) => Wh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Hh) ?? []).length / e.length < Yh;
}, Ia = (e) => {
  const t = e.trim();
  return Fh.test(t) ? !1 : [Oh, Th, Ih, Bh, Rh, Lh, Nh, qh, Dh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Ph.test(e) && !Er.test(e) && !Ar(e);
};
function Qh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Er.test(t[0]) || t.every((o) => zh.test(o) || Uh.test(o))) return "text";
  const n = t.filter((o) => !jh.test(o.trim()));
  if (t.length === 1) return !n.length || Ia(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ia).length, s = n.filter((o) => !Ia(o) && Ar(o)).length;
  return a >= n.length * Gh && s <= n.length * Vh ? "code" : "text";
}
const gs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Xh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Jh = `${gs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Zh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", em = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Do = {
  js: { keywords: gs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Xh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Jh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: gs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Zh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: em, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, tm = {
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
function Po(e, t, n) {
  return n && e.startsWith(n, t);
}
function nm(e, t) {
  const n = Do[tm[t] ?? t] || Do.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
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
    if (Po(e, o, n.line) || n.hash && r === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Po(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), f = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, f)), o = f;
      continue;
    }
    const i = (n.triple || []).find((c) => e.startsWith(c, o));
    if (i) {
      const c = e.indexOf(i, o + 3), f = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, f)), o = f;
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
      const f = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? f.toLowerCase() : f, p = n.property && /^\s*:/.test(e.slice(o + f.length));
      l(a.has(h) ? "keyword" : p ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function am(e, t) {
  const n = [""];
  for (const { type: a, value: s } of nm(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? rt(l) : `<span class="tok-${a}">${rt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function sm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const om = 1500, jo = /* @__PURE__ */ new WeakMap();
async function lm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await sm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(jo.get(t)), jo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, om)
  )));
}
typeof document < "u" && document.addEventListener("click", lm, !0);
const rm = /\n\s*\n/, im = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, um = /^\s*(`{3,}|~{3,})\s*$/, cm = /^\s{4,}\S/, dm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, vs = /^\s*(?:[-*+]|\d+[.)])\s/, Or = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, fm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Gs(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function hm(e) {
  const t = Gs(e.join(`
`));
  return (fm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const mm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Or.test(t) && !vs.test(t);
}, pm = (e, t) => vs.test(t) || vs.test([...e].reverse().find((n) => n.trim()) || "");
function Vs(e, t) {
  const n = t || hm(e), a = am(Gs(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function gm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && um.test(s));
  return a < 0 ? e.length : a;
}
function vm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Vs(a.map(bn), n ? n.toLowerCase() : "");
}
function ym(e) {
  const t = e.split(rm).map((l) => ({ paragraph: l, type: Qh(Gs(l).split(`
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
      s(), n.push(Vs(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(bn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function bm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : ym(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(im);
    if (r) {
      const c = gm(n, l, r[2]);
      o(), a.push(vm(n.slice(l + 1, c), r[1], r[3])), l = c + 1;
      continue;
    }
    const i = mm(s) ? dm : cm;
    if (!t && i.test(n[l]) && !pm(s, n[l])) {
      let c = l;
      for (; c < n.length && (i.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Or.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(Vs([...f, ...n.slice(l, c)].map(bn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => bm(e, t.document), { first: !0 });
const km = ["innerHTML"], wm = ["innerHTML"], $m = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = $r(), a = E(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, km)) : (u(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, wm));
  }
}, ot = /* @__PURE__ */ z($m, [["__scopeId", "data-v-d8e75741"]]), Fo = (e) => [...new Set(e.agents.map((t) => t.name))], xm = (e) => Fo(e).length === 1 ? `Worker: ${Fo(e)[0]}` : "Delegated", Sm = ["aria-expanded"], Mm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, _m = {
  key: 0,
  class: "tip-failure"
}, Cm = { key: 1 }, Em = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(Ne, null), a = E(() => hd(t.type, t.state)), s = O(!1), o = O([]), l = O("");
    async function r() {
      s.value = !0;
      const f = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      l.value = f.ok ? "" : f.error, f.ok && (o.value = f.value.lines ?? []);
    }
    const i = () => s.value = !1, c = () => s.value ? i() : r();
    return (f, h) => a.value ? (u(), d("span", {
      key: 0,
      class: "state-badge",
      tabindex: "0",
      role: "button",
      "aria-expanded": s.value,
      "data-state-badge": "",
      onMouseenter: r,
      onMouseleave: i,
      onFocus: r,
      onBlur: i,
      onClick: c,
      onKeydown: _t(i, ["escape"])
    }, [
      V(v(L(rn)(e.type, e.state)) + " ", 1),
      s.value ? (u(), d("span", Mm, [
        l.value ? (u(), d("span", _m, v(l.value), 1)) : k("", !0),
        (u(!0), d(D, null, ne(o.value, (p) => (u(), d("span", {
          key: p,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : k("", !0)
    ], 40, Sm)) : (u(), d("span", Cm, v(L(rn)(e.type, e.state)), 1));
  }
}, Am = /* @__PURE__ */ z(Em, [["__scopeId", "data-v-bf9353d9"]]), Om = {
  class: "plan-details",
  "data-plan-details": ""
}, Tm = { class: "state-line" }, Im = {
  key: 0,
  class: "phase-count"
}, Bm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Rm = { class: "text" }, Lm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Nm = { class: "overall" }, qm = { class: "overall-figure" }, Dm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Pm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, jm = {
  key: 4,
  class: "part"
}, Fm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (u(), d("div", Om, [
      m("div", Tm, [
        I(Am, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: K(["status", L(Jl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), d("span", Im, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
      ]),
      e.plan.reason ? (u(), d("section", Bm, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Rm, v(e.plan.reason), 1)
      ])) : k("", !0),
      e.plan.total ? (u(), d("section", Lm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Nm, [
          I(vr, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", qm, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : k("", !0),
      e.plan.assignee ? (u(), d("p", Dm, "Agent: " + v(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), d("p", Pm, v(L(xm)(e.plan)), 1)) : k("", !0),
      e.plan.brief ? (u(), d("section", jm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        I(gr, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: j(() => [
            I(ot, {
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
}, PS = /* @__PURE__ */ z(Fm, [["__scopeId", "data-v-c37da567"]]), Wm = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Hm = ["title", "onClick"], zm = { class: "agent-word" }, Um = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = E(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const r of a.tasks.filter((i) => i.helper_id && !n.has(i.state))) {
        const i = ((l = o.get(r.helper_id)) == null ? void 0 : l.held) || t.has(r.state);
        o.set(r.helper_id, { id: r.helper_id, name: r.helper_name, held: i });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (u(), d("div", Wm, [
      (u(!0), d(D, null, ne(s.value, (r) => (u(), d("button", {
        key: r.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${r.name}`,
        "data-plan-phase-agent": "",
        onClick: (i) => L(De)(`agents:${r.id}`)
      }, [
        m("span", {
          class: K(["agent-dot", { held: r.held }])
        }, null, 2),
        V(" " + v(r.name) + " ", 1),
        m("span", zm, v(r.held ? "Working" : "Queued"), 1)
      ], 8, Hm))), 128))
    ])) : k("", !0);
  }
}, Gm = /* @__PURE__ */ z(Um, [["__scopeId", "data-v-8d95f9a6"]]), Vm = { class: "phases" }, Km = { class: "phead" }, Ym = { class: "mark" }, Qm = { class: "ptitle" }, Xm = { class: "phead-end" }, Jm = {
  key: 0,
  class: "checkpoint"
}, Zm = { class: "progress" }, ep = {
  key: 0,
  class: "when"
}, tp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (u(), d("ol", Vm, [
      (u(!0), d(D, null, ne(e.phases, (l, r) => (u(), d("li", {
        key: l.id,
        class: K(["phase", { current: r + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", Km, [
          m("span", Ym, [
            I(re, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Qm, v(r + 1) + ". " + v(l.title), 1),
          m("span", Xm, [
            l.checkpoint ? (u(), d("span", Jm, "checkpoint")) : k("", !0),
            m("span", Zm, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (u(), d("div", ep, v(l.goal), 1)) : k("", !0),
        I(Gm, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (u(!0), d(D, null, ne(l.tasks, (i) => he(s.$slots, "task", { task: i }, void 0, !0, i.id)), 128))
      ], 2))), 128))
    ]));
  }
}, jS = /* @__PURE__ */ z(tp, [["__scopeId", "data-v-05aaa685"]]), np = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, ap = { ...np, done: "Completed" }, sp = /* @__PURE__ */ new Set(["completed", "cancelled"]), op = (e) => sp.has(e), cn = (e) => op(e) ? "done" : e, lp = { class: "task-status-icon" }, rp = ["width", "height", "aria-label"], ip = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = E(() => Jl("task", cn(t.status))), a = E(() => n.value === "testing" ? "started" : n.value), s = E(() => ap[t.status] ?? rn("task", t.status));
    return (o, l) => (u(), d("span", lp, [
      I(zt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (u(), d("svg", {
            key: n.value,
            class: K(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            I(Ut, { value: a.value }, {
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
          ], 10, rp))
        ]),
        _: 1
      })
    ]));
  }
}, va = /* @__PURE__ */ z(ip, [["__scopeId", "data-v-ae24a63f"]]), up = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, cp = {
  key: 0,
  class: "empty",
  role: "alert"
}, dp = {
  key: 2,
  class: "empty"
}, fp = { class: "day" }, hp = { class: "events" }, mp = { class: "mark" }, pp = { class: "what" }, gp = { class: "head" }, vp = { class: "word" }, yp = ["title", "onClick"], bp = { class: "at" }, kp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = O(null), l = O(""), r = E(() => {
      const f = /* @__PURE__ */ new Map();
      for (const h of o.value ?? []) {
        const p = new Date(h.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        f.set(p, [...f.get(p) ?? [], h]);
      }
      return [...f].map(([h, p]) => ({ day: h, items: p }));
    }), i = (f) => new Date(f).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const f = await a.read(["plan", "timeline", String(a.id)]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.events : [];
    }
    return ge(() => a.id, c, { immediate: !0 }), (f, h) => (u(), d("section", up, [
      l.value ? (u(), d("p", cp, v(l.value), 1)) : o.value === null ? (u(), F(Ke, { key: 1 })) : o.value.length ? k("", !0) : (u(), d("p", dp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), d(D, null, ne(r.value, (p) => (u(), d(D, {
        key: p.day
      }, [
        m("h3", fp, v(p.day), 1),
        m("ol", hp, [
          (u(!0), d(D, null, ne(p.items, (y) => (u(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: K(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", mp, [
              n[y.event_type].state ? (u(), F(va, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (u(), F(re, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", pp, [
              m("div", gp, [
                m("span", vp, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, yp),
                m("span", bp, v(i(y.time)), 1)
              ]),
              y.text ? (u(), F(ot, {
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
}, FS = /* @__PURE__ */ z(kp, [["__scopeId", "data-v-9e511133"]]);
function wp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Ks(e, t = Date.now()) {
  const n = wp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const $p = 36e5;
function xp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / $p;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Wo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Tr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Ho(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ba = (e) => String(e).padStart(2, "0");
function Ir(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ba(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ba(Math.floor(t % 3600 / 60))}m ${Ba(t % 60)}s`;
}
const Sp = 1e3;
function Br() {
  const e = O(Date.now()), t = setInterval(() => e.value = Date.now(), Sp);
  return et(() => clearInterval(t)), e;
}
const Mp = Symbol("resource-subscriptions");
function kn(e, t, n = () => !0) {
  const a = Me(Mp, () => new Ul(), !0), s = Ls(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  fa(() => {
    o(), s.cancel();
  });
}
const Rr = (e, t) => !e.row_id || t.has(e.row_id), _p = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, WS = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Cp = "Not known", Ep = 80, Ap = 1e3, Op = "worker", Tp = "main", Ip = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Bp = (e) => e.ok ? e.value.rows : [], Rp = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Lp = (e, t) => (t == null ? void 0 : t.given_name) || Rp((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Np = (e, t) => e.ended_at ? "ended" : e.paused_at || Ip.has(t == null ? void 0 : t.state) ? "waiting" : "running", Lr = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function qp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Ap, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ir(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Ep }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Cp : `$${t.cost_dollars.toFixed(2)}` }), e.role === Op && l.push({ key: "pace", label: "Tasks an hour", value: String(xp(Lr(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Tp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Dp(e) {
  const t = Lr(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Pp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Wo(e.created_at)]), e.ended_at && n.push(["Ended", Wo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const jp = { class: "band" }, Fp = { key: 0 }, Wp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), d("h2", jp, [
      I(re, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      he(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), d("span", Fp, v(e.count), 1)) : k("", !0)
    ]));
  }
}, Ft = /* @__PURE__ */ z(Wp, [["__scopeId", "data-v-1758914f"]]), Hp = { class: "number" }, zp = { class: "text" }, Up = 150, Gp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = O(!1), a = E(() => t.text.length > Up), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), d(D, null, [
      e.text ? (u(), d(D, { key: 0 }, [
        I(Ft, { icon: "file" }, {
          default: j(() => [
            V(v(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: K(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (u(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (r) => n.value = !0)
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (u(), d(D, { key: 1 }, [
        I(Ft, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
            V("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), d(D, null, ne(e.points, (r) => {
          var i;
          return u(), d("p", {
            key: r.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", Hp, v(r.id), 1),
            m("span", zp, [
              V(v(r.text), 1),
              m("span", {
                class: K(["proof", { checked: ((i = r.proof) == null ? void 0 : i.state) === "checked" }])
              }, v(s(r)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, Vp = /* @__PURE__ */ z(Gp, [["__scopeId", "data-v-c99de22c"]]), Kp = ["aria-expanded"], Yp = { class: "count" }, Qp = {
  key: 0,
  "data-agent-fold-body": ""
}, Xp = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Pt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = on(e, "open");
    return (n, a) => (u(), d(D, null, [
      m("button", {
        type: "button",
        class: K(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        I(re, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        V(v(e.label), 1),
        m("span", Yp, v(e.count), 1),
        I(re, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Kp),
      t.value ? (u(), d("div", Qp, [
        he(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Ra = /* @__PURE__ */ z(Xp, [["__scopeId", "data-v-7f93d8d9"]]), Jp = ["onClick"], Zp = { class: "text" }, e1 = { class: "aside" }, t1 = {
  key: 0,
  class: "none"
}, n1 = {
  class: "skills",
  "data-agent-skills": ""
}, a1 = {
  key: 0,
  class: "none-inline"
}, s1 = { class: "label" }, o1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ht({ helpers: !1, skills: !1 }), a = O([]), s = O([]), o = async (r) => Bp(await t.read(r));
    ge(() => [n.helpers, t.loads], async ([r]) => {
      r && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ge(() => [n.skills, t.loads], async ([r]) => {
      r && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (r) => r.given_name || `${Qn(r.role)} ${r.id}`;
    return (r, i) => (u(), d(D, null, [
      I(Ra, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: j(() => [
          (u(!0), d(D, null, ne(a.value, (c) => (u(), d("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (f) => L(yt)("agents", c.id)
          }, [
            m("span", Zp, v(l(c)), 1),
            m("span", e1, v(L(Qn)(c.role)) + " " + v(c.id), 1)
          ], 8, Jp))), 128)),
          a.value.length ? k("", !0) : (u(), d("p", t1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      I(Ra, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: j(() => [
          m("p", n1, [
            (u(!0), d(D, null, ne(s.value, (c) => (u(), d("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? k("", !0) : (u(), d("span", a1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      I(Ra, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: j(() => [
          (u(!0), d(D, null, ne(e.details, ([c, f, h]) => (u(), d("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", s1, v(c) + ":", 1),
            m("span", {
              class: K(["value", h])
            }, v(f), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, l1 = /* @__PURE__ */ z(o1, [["__scopeId", "data-v-358a0300"]]), r1 = ["datetime", "title"], Ze = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Br(), a = E(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(L(Ks)(e.at, L(n))), 9, r1));
  }
}, i1 = {
  class: "now",
  "data-agent-now": ""
}, u1 = {
  key: 1,
  class: "muted"
}, c1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, d1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, f1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, h1 = { class: "line" }, m1 = { class: "detail" }, p1 = { class: "bar" }, g1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = E(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), d(D, null, [
      I(Ft, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          V("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", i1, [
        e.inspection.task ? (u(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => L(yt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (u(), d("span", u1, v(e.nothing), 1)),
        n.value ? (u(), d("span", c1, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (u(), d("span", d1, [
          o[3] || (o[3] = V("Seen: ", -1)),
          I(Ze, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (u(), d("div", f1, [
        m("div", h1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => L(yt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", m1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", p1, [
          m("i", {
            style: ye({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, v1 = /* @__PURE__ */ z(g1, [["__scopeId", "data-v-ff25c609"]]), y1 = ["onClick"], b1 = { class: "text" }, k1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, w1 = { class: "text" }, $1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, x1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), d(D, null, [
      I(Ft, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
          V("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), d(D, null, ne(e.moves, (a) => (u(), d(D, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (u(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => L(yt)(a.table, a.id)
        }, [
          m("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          m("span", b1, v(a.text), 1),
          I(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, y1)) : (u(), d("div", k1, [
          m("i", {
            class: K(["dot", a.tone])
          }, null, 2),
          m("span", w1, v(a.text), 1),
          I(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (u(), d("p", $1, "Nothing yet."))
    ], 64));
  }
}, S1 = /* @__PURE__ */ z(x1, [["__scopeId", "data-v-58f0db57"]]), M1 = {
  class: "strip",
  "data-agent-strip": ""
}, _1 = ["data-agent-cell"], C1 = {
  key: 0,
  class: "meter"
}, E1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), d("div", M1, [
      (u(!0), d(D, null, ne(e.cells, (a) => (u(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: K({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (u(), d("div", C1, [
          m("i", {
            class: K({ high: a.high }),
            style: ye({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, _1))), 128))
    ]));
  }
}, A1 = /* @__PURE__ */ z(E1, [["__scopeId", "data-v-b6657ab7"]]), O1 = {}, T1 = { class: "menu-label" };
function I1(e, t) {
  return u(), d("span", T1, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Mt = /* @__PURE__ */ z(O1, [["render", I1], ["__scopeId", "data-v-aa955b3e"]]), B1 = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, R1 = {
  key: 0,
  class: "skills-none"
}, L1 = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.skills.filter((l) => l.state === "loaded")), o = E(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, r) => (u(), d("div", B1, [
      I(Mt, null, {
        default: j(() => [...r[1] || (r[1] = [
          V("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (u(), d("p", R1, "None yet. Compacting the conversation empties this list.")),
      (u(!0), d(D, null, ne(s.value, (i) => (u(), d("p", {
        key: i.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        I(re, {
          name: "book",
          size: 12
        }),
        V(v(i.skill), 1)
      ]))), 128)),
      o.value.length ? (u(), d(D, { key: 1 }, [
        I(Mt, null, {
          default: j(() => [...r[2] || (r[2] = [
            V("Still to read", -1)
          ])]),
          _: 1
        }),
        (u(!0), d(D, null, ne(o.value, (i) => (u(), d("p", {
          key: i.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          I(re, {
            name: "book",
            size: 12
          }),
          V(v(i.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      I(ze, {
        "data-agent-skills-browse": "",
        onClick: r[0] || (r[0] = (i) => a("browse"))
      }, {
        default: j(() => [...r[3] || (r[3] = [
          V("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, N1 = /* @__PURE__ */ z(L1, [["__scopeId", "data-v-be514d47"]]), q1 = ["disabled", "title"], D1 = { class: "gauge usage" }, P1 = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.windows[0] ?? null), o = E(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = E(() => o.value !== null && o.value >= 100), r = E(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), i = E(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${r.value ? `, starts again ${r.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${r.value ? `, starts again ${r.value}` : ""}`);
    return (c, f) => o.value !== null ? (u(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: i.value,
      onClick: f[0] || (f[0] = (h) => a("open", h.currentTarget))
    }, [
      I(re, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = V()),
      m("span", D1, [
        m("span", {
          style: ye({ width: `${o.value}%` })
        }, null, 4)
      ]),
      V(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, q1)) : k("", !0);
  }
}, j1 = /* @__PURE__ */ z(P1, [["__scopeId", "data-v-a36f09dc"]]), F1 = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), d("span", {
      class: K(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Ys = /* @__PURE__ */ z(F1, [["__scopeId", "data-v-9e7e1157"]]);
function W1(e, t, n, { groups: a, programs: s }) {
  const o = O({}), l = O(""), r = O(!1), i = E(() => !!e.value && !e.value.ended_at), c = E(() => i.value && !!e.value.paused_at);
  async function f(b, A = null) {
    l.value = "";
    const S = await Nl(A, b, t);
    return l.value = S.ok ? "" : S.error, n(), S;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: r, running: i, paused: c, choose: (b, A) => f(["agent", "control", String(e.value.id), b, A.value], { target: o, fields: { value: { ...o.value, [b]: A.label } } }), stop: () => (r.value = !1, f(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
function H1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const z1 = ["disabled", "title"], U1 = ["disabled", "title"], G1 = { class: "gauge" }, V1 = ["disabled", "title"], K1 = ["disabled"], Y1 = ["disabled"], Q1 = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, X1 = ["title"], J1 = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Z1 = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, eg = { class: "gauge" }, tg = { class: "context-used" }, ng = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, ag = 75, sg = {
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
    const n = e, a = t, s = W1(Sa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Sa(n, "controlGroups"), programs: Sa(n, "agentPrograms") }), o = O(null), l = O(""), r = E(() => s.groups.value.find((N) => N.key === l.value));
    function i(N, w) {
      o.value = N.currentTarget, l.value = w;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = E(() => n.skills.filter((N) => N.state === "loaded"));
    function h(N) {
      i(N, "skills"), a("skills");
    }
    const p = (N) => s.groups.value.some((w) => w.key === N), y = E(() => {
      var N;
      return s.chosen.value.model ?? ((N = A.value) == null ? void 0 : N.model) ?? "";
    }), b = E(() => {
      var N;
      return s.chosen.value.effort ?? ((N = A.value) == null ? void 0 : N.effort) ?? "";
    });
    E(() => !!n.agent && !n.agent.ended_at);
    const A = E(() => {
      var N;
      return ((N = n.usage.agents) == null ? void 0 : N.find((w) => {
        var H;
        return w.id === ((H = n.agent) == null ? void 0 : H.id);
      })) ?? null;
    }), S = E(() => {
      var N;
      return ((N = A.value) == null ? void 0 : N.context_percent) == null ? null : Math.round(A.value.context_percent);
    }), x = (N) => `${Math.round(N / 1e3)}k`, B = E(() => {
      var N;
      return (N = A.value) != null && N.context_limit_tokens ? `${x(A.value.context_tokens ?? 0)} of ${x(A.value.context_limit_tokens)}` : "";
    }), W = E(() => {
      var N;
      return (N = A.value) != null && N.cost_dollars ? `$${A.value.cost_dollars.toFixed(2)}` : "";
    });
    return (N, w) => {
      var H;
      return u(), d("div", {
        class: K(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (u(), d(D, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: w[0] || (w[0] = (P) => i(P, "agent"))
          }, [
            I(re, {
              name: "agents",
              size: 12
            }),
            V(" " + v(((H = e.agentPrograms.find((P) => P.name === e.agent.program)) == null ? void 0 : H.title) || e.agent.program), 1)
          ], 8, z1),
          I(j1, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: w[1] || (w[1] = (P) => a("open", "usage", P))
          }, null, 8, ["windows", "disabled"]),
          S.value !== null ? (u(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${S.value}% full: clear or compact it`,
            onClick: w[2] || (w[2] = (P) => p("context") ? i(P, "context") : a("open", "context", P.currentTarget))
          }, [
            I(re, {
              name: "gauge",
              size: 12
            }),
            w[14] || (w[14] = V()),
            m("span", G1, [
              m("span", {
                style: ye({ width: `${S.value}%` })
              }, null, 4)
            ]),
            V(" " + v(S.value) + "% ", 1)
          ], 8, U1)) : k("", !0),
          y.value ? (u(), d("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: w[3] || (w[3] = (P) => p("model") ? i(P, "model") : null)
          }, [
            I(re, {
              name: "model",
              size: 12
            }),
            V(" " + v(y.value), 1)
          ], 8, V1)) : k("", !0),
          p("effort") || e.card && b.value ? (u(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: w[4] || (w[4] = (P) => i(P, "effort"))
          }, [
            I(re, {
              name: "bolt",
              size: 12
            }),
            V(" " + v(b.value), 1)
          ], 8, K1)) : k("", !0),
          W.value ? (u(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: w[5] || (w[5] = (P) => a("open", "cost", P.currentTarget))
          }, v(W.value), 9, Y1)) : k("", !0),
          e.branch ? (u(), d("span", Q1, [
            I(re, {
              name: "branch",
              size: 12
            }),
            V(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (u(), d("button", {
            key: 5,
            type: "button",
            class: K(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: w[6] || (w[6] = (P) => a("open", "jobs", P.currentTarget))
          }, [
            I(re, {
              name: "clock",
              size: 12
            }),
            V(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (u(), d("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: h
          }, [
            I(re, {
              name: "book",
              size: 12
            }),
            V(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (u(), d(D, { key: 7 }, [
            m("button", {
              type: "button",
              class: K(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ag }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: w[7] || (w[7] = (P) => a("open", "fitness", P.currentTarget))
            }, [
              I(re, {
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
              I(re, {
                name: "weight",
                size: 12
              }),
              V(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (u(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: w[9] || (w[9] = (P) => i(P, "start"))
        }, [
          I(re, {
            name: "agents",
            size: 12
          }),
          w[15] || (w[15] = V(" Start an agent", -1))
        ])) : k("", !0),
        w[21] || (w[21] = m("span", { class: "space" }, null, -1)),
        L(s).failure.value ? (u(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: L(s).failure.value
        }, v(L(s).failure.value), 9, X1)) : k("", !0),
        he(N.$slots, "default", {}, void 0, !0),
        o.value ? (u(), F(ha, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: j(() => {
            var P;
            return [
              l.value === "agent" ? (u(), d(D, { key: 0 }, [
                L(s).asking.value ? (u(), d(D, { key: 0 }, [
                  I(Mt, { "data-agent-stop-ask": "" }, {
                    default: j(() => [...w[16] || (w[16] = [
                      V("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  I(ze, {
                    "data-agent-stop-confirm": "",
                    onClick: w[10] || (w[10] = (q) => (c(), L(s).stop()))
                  }, {
                    default: j(() => [...w[17] || (w[17] = [
                      V("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  I(ze, {
                    onClick: w[11] || (w[11] = (q) => L(s).asking.value = !1)
                  }, {
                    default: j(() => [...w[18] || (w[18] = [
                      V("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (u(), F(ze, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: w[12] || (w[12] = (q) => L(s).asking.value = !0)
                }, {
                  default: j(() => [...w[19] || (w[19] = [
                    V("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (u(), d(D, { key: 1 }, [
                I(Mt, null, {
                  default: j(() => [...w[20] || (w[20] = [
                    V("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (u(!0), d(D, null, ne(L(s).programs.value, (q) => (u(), F(ze, {
                  key: q.name,
                  "data-agent-program": q.name,
                  onClick: (_) => (c(), L(s).start(q))
                }, {
                  default: j(() => [
                    V(v(q.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (u(), F(N1, {
                key: 2,
                skills: e.skills,
                onBrowse: w[13] || (w[13] = (q) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : r.value ? (u(), d(D, { key: 3 }, [
                I(Mt, null, {
                  default: j(() => [
                    V(v(r.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (u(), d(D, { key: 0 }, [
                  m("p", J1, v(L(H1)(((P = A.value) == null ? void 0 : P.last_compaction) ?? null)), 1),
                  m("div", Z1, [
                    m("span", eg, [
                      m("span", {
                        style: ye({ width: `${S.value}%` })
                      }, null, 4)
                    ]),
                    m("span", tg, v(S.value) + "%", 1)
                  ]),
                  B.value ? (u(), d("p", ng, [
                    V(v(B.value) + " ", 1),
                    I(Ys, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                (u(!0), d(D, null, ne(r.value.choices, (q) => (u(), F(ze, {
                  key: q.value,
                  "data-agent-choice": q.value,
                  onClick: (_) => (L(s).choose(r.value.key, q), c())
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
}, og = /* @__PURE__ */ z(sg, [["__scopeId", "data-v-dc15ff96"]]), lg = {
  class: "who",
  "data-agent-who": ""
}, rg = { class: "name" }, ig = ["data-agent-state"], ug = {
  class: "sub",
  "data-agent-started-by": ""
}, cg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), d("div", lg, [
      m("h2", rg, [
        m("i", {
          class: K(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, ig),
        V(v(e.name), 1)
      ]),
      I(og, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", ug, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, dg = /* @__PURE__ */ z(cg, [["__scopeId", "data-v-83bd4a9d"]]), fg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, hg = { class: "scroll" }, mg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, pg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, gg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Br(), a = O(null), s = O(null), o = O(null), l = O({}), r = O({ helpers: 0, skills: 0 }), i = O(0), c = O([]), f = O([]), h = O("");
    let p = 0;
    const y = E(() => {
      var x;
      return a.value.ended_at ? Dp(s.value) : `It has no task.${(x = s.value) != null && x.instruction ? " It was given an instruction." : ""}`;
    });
    async function b() {
      const x = ++p, B = await t.read(["usage", "inspector", String(t.id), "--environment", t.environment]);
      x === p && (h.value = B.ok ? "" : B.error, B.ok && (a.value = B.value.agent, s.value = B.value.facts, o.value = B.value.inspection, l.value = B.value.tool, r.value = { helpers: B.value.helpers, skills: B.value.skills }, c.value = B.value.points, f.value = B.value.programs, i.value += 1));
    }
    const A = E(() => /* @__PURE__ */ new Set([t.id])), S = {
      agent: (x) => Rr(x, A.value),
      hook_call: (x) => _p(x, "session_agent_id", A.value)
    };
    return kn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], b, (x) => {
      var B;
      return ((B = S[x.event.split(".")[0]]) == null ? void 0 : B.call(S, x)) ?? !0;
    }), _e(b), (x, B) => {
      var W, N;
      return u(), d("article", fg, [
        m("div", hg, [
          h.value ? (u(), d("p", mg, v(h.value), 1)) : a.value && o.value ? (u(), d(D, { key: 1 }, [
            I(dg, {
              name: L(Lp)(a.value, s.value),
              state: L(Np)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: f.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            I(A1, {
              cells: L(qp)({ row: a.value, facts: s.value, inspection: o.value, now: L(n) })
            }, null, 8, ["cells"]),
            I(v1, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            I(Vp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((N = s.value) == null ? void 0 : N.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            I(S1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            I(l1, {
              id: e.id,
              read: e.read,
              counts: r.value,
              loads: i.value,
              details: L(Pp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), d("p", pg, "Ended " + v(L(Ks)(a.value.ended_at, L(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (u(), F(Ke, { key: 2 }))
        ])
      ]);
    };
  }
}, HS = /* @__PURE__ */ z(gg, [["__scopeId", "data-v-26d7ee78"]]), vg = ["aria-expanded"], yg = { class: "drop-label" }, bg = ["value"], kg = {
  key: 1,
  class: "drop-lead"
}, wg = { class: "drop-item-text" }, $g = {
  key: 2,
  class: "drop-note"
}, xg = {
  key: 1,
  class: "drop-none"
}, Sg = {
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
    const n = e, a = t, s = O(!1), o = O(null), l = O(""), r = E(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function i(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (u(), d("div", {
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
        e.icon ? (u(), F(re, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        m("span", yg, v(e.label), 1),
        I(re, {
          name: "down",
          size: 11
        })
      ], 10, vg),
      s.value ? (u(), F(ha, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (h) => s.value = !1)
      }, {
        default: j(() => [
          e.searchable ? (u(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (h) => l.value = h.target.value)
          }, null, 40, bg)) : k("", !0),
          (u(!0), d(D, null, ne(r.value, (h) => (u(), F(ze, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => i(h)
          }, {
            default: j(() => [
              h.running !== void 0 ? (u(), d("span", {
                key: 0,
                class: K(["drop-dot", { live: h.running }])
              }, null, 2)) : k("", !0),
              h.lead ? (u(), d("span", kg, v(h.lead), 1)) : k("", !0),
              m("span", wg, v(h.label), 1),
              h.note ? (u(), d("span", $g, v(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? k("", !0) : (u(), d("p", xg, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Nr = /* @__PURE__ */ z(Sg, [["__scopeId", "data-v-29dfcce5"]]);
function Mg(e) {
  const t = O(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), et(() => n.disconnect()), t;
}
const _g = ["data-comment-id"], Cg = {
  key: 0,
  class: "comment-top"
}, Eg = { class: "comment-mark" }, Ag = {
  class: "comment-body",
  "data-comment": ""
}, Og = { class: "comment-foot" }, Tg = {
  key: 1,
  "data-comment-lost": ""
}, Ig = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (u(), d("article", {
      class: K(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (u(), d("div", Cg, [
        m("span", Eg, v(e.comment.number), 1),
        m("span", {
          class: K(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", Ag, v(e.comment.body), 1),
      m("div", Og, [
        e.comment.created_at ? (u(), F(Ze, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (u(), d("span", Tg, "The text has changed here")) : e.comment.quote ? (u(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, _g));
  }
}, qr = /* @__PURE__ */ z(Ig, [["__scopeId", "data-v-a37d4507"]]);
var Tl;
/Mac|iPhone|iPad/.test(((Tl = navigator.userAgentData) == null ? void 0 : Tl.platform) || navigator.platform);
function Dr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Bg = {
  class: "comment-box",
  "data-comment-box": ""
}, Rg = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Lg = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Ng = { class: "comment-row" }, qg = ["placeholder"], Dg = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Pt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Pt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = on(e, "draft"), l = O(""), r = O(!1), i = O(null), c = E(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = E(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      i.value.style.height = "auto", i.value.style.height = `${i.value.scrollHeight + 2}px`;
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || r.value)) {
        l.value = "", r.value = !0;
        try {
          await a.send(y), o.value = "", await je(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          r.value = !1;
        }
      }
    }
    return t({ focus: () => i.value.focus() }), (y, b) => (u(), d("div", Bg, [
      e.selection ? (u(), d("div", Rg, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: K(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        I(ma, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (A) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (u(), d("p", Lg, v(l.value), 1)) : k("", !0),
      m("div", Ng, [
        Je(m("textarea", {
          ref_key: "box",
          ref: i,
          "onUpdate:modelValue": b[1] || (b[1] = (A) => o.value = A),
          rows: "1",
          maxlength: "2000",
          class: K({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = _t((A) => L(Dr)(A, p), ["enter"]))
        }, null, 42, qg), [
          [Yn, o.value]
        ]),
        I(ve, {
          variant: "primary",
          busy: r.value,
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
}, Pg = /* @__PURE__ */ z(Dg, [["__scopeId", "data-v-41d2081c"]]), Bn = (e) => e ? e.split(", ") : [];
function jg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Fg(e, t) {
  return {
    reads: Bn(e.reads_allowed),
    runs: Bn(e.runs_allowed),
    missing: [...Bn(e.reads_missing), ...Bn(e.runs_missing)],
    ask: t
  };
}
const Wg = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = Xi("SkeletonParts", !0);
      return u(!0), d(D, null, ne(e.parts, (i, c) => (u(), d(D, { key: c }, [
        (u(!0), d(D, null, ne(i.count, (f) => (u(), F(Ut, {
          key: f,
          value: i.shape
        }, {
          line: j(() => [
            I(Zt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            I(Zt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            I(Zt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            m("div", {
              class: "skeleton-row",
              style: ye(a(i))
            }, [
              I(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            m("div", {
              class: "skeleton-stack",
              style: ye(a(i))
            }, [
              I(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ye(a(i))
            }, [
              I(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            m("div", {
              class: "skeleton-grid",
              style: ye(s(i))
            }, [
              I(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Hg = /* @__PURE__ */ z(Wg, [["__scopeId", "data-v-fa8baeaf"]]), zg = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Ug = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), d("div", zg, [
      I(Hg, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Qs = /* @__PURE__ */ z(Ug, [["__scopeId", "data-v-52f66b64"]]), Pr = {
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
}, Gg = { class: "bars" }, Vg = { class: "bar-name" }, Kg = { class: "bar-value" }, Yg = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = E(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (u(), d("div", Gg, [
      (u(!0), d(D, null, ne(e.items, (i, c) => (u(), F(ut(i.open ? "button" : "div"), {
        key: `${c}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: K(["bar-row", i.tone, { opens: i.open }]),
        onClick: (f) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          m("span", Vg, v(i.label), 1),
          I(vr, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Kg, v(i.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Qg = /* @__PURE__ */ z(Yg, [["__scopeId", "data-v-663427f4"]]), Xg = { class: "bars" }, Jg = {
  key: 0,
  class: "bars-title"
}, Zg = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), d("div", Xg, [
      e.node.title ? (u(), d("span", Jg, v(e.node.title), 1)) : k("", !0),
      I(Qg, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, ev = /* @__PURE__ */ z(Zg, [["__scopeId", "data-v-7135bb11"]]), tv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = E(() => n[a.node.type](a.node));
    return (l, r) => (u(), d("div", {
      class: K([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ye(o.value)
    }, [
      (u(!0), d(D, null, ne(e.node.children || [], (i, c) => (u(), F(jr, {
        key: c,
        node: i,
        onOpen: r[0] || (r[0] = (f) => s("open", f)),
        onFile: r[1] || (r[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Wn = /* @__PURE__ */ z(tv, [["__scopeId", "data-v-d142a3f4"]]), nv = {
  key: 0,
  class: "card-head"
}, av = { class: "card-title" }, sv = {
  key: 0,
  class: "card-note"
}, ov = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), d("section", {
      class: K(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), d("header", nv, [
        m("span", av, v(e.node.title), 1),
        e.node.note ? (u(), d("span", sv, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      I(Wn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, lv = /* @__PURE__ */ z(ov, [["__scopeId", "data-v-67b72d40"]]), rv = { class: "fact" }, iv = { class: "fact-label" }, uv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), d("div", rv, [
      m("span", iv, v(e.label), 1),
      I(ot, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, cv = /* @__PURE__ */ z(uv, [["__scopeId", "data-v-3a88ecf8"]]), dv = { class: "list" }, fv = { class: "list-label" }, hv = {
  key: 1,
  class: "list-note"
}, mv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), d("div", dv, [
      (u(!0), d(D, null, ne(e.items, (o, l) => (u(), F(ut(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: K(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", fv, v(o.label), 1),
          o.badge ? (u(), F(Ys, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (u(), d("span", hv, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, pv = /* @__PURE__ */ z(mv, [["__scopeId", "data-v-ebe2ae0a"]]), gv = { class: "table" }, vv = {
  key: 0,
  class: "table-row empty"
}, yv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), d("div", gv, [
      m("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (u(!0), d(D, null, ne(e.columns, (r) => (u(), d("span", {
          key: r,
          class: "cell"
        }, v(r), 1))), 128))
      ], 4),
      (u(!0), d(D, null, ne(e.rows, (r, i) => (u(), F(ut(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: K(["table-row", r.tone, { opens: r.open }]),
        style: ye(s.value),
        onClick: (c) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          (u(!0), d(D, null, ne(r.cells, (c, f) => (u(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), d("div", vv, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, bv = /* @__PURE__ */ z(yv, [["__scopeId", "data-v-9326a52e"]]), kv = { class: "stat-value" }, wv = { class: "stat-label" }, $v = {
  key: 0,
  class: "stat-note"
}, xv = {
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
    return (a, s) => (u(), F(ut(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: K(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        m("span", kv, v(e.value), 1),
        m("span", wv, v(e.label), 1),
        e.note ? (u(), d("span", $v, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Sv = /* @__PURE__ */ z(xv, [["__scopeId", "data-v-ad0db6d6"]]), Mv = { class: "code" }, _v = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), F(Ut, {
      value: e.node.type
    }, {
      stack: j(() => [
        I(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        I(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        I(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        I(lv, {
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
        I(Sv, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        I(ev, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        I(bv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        I(pv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        I(ot, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        I(cv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        I(Ys, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", Mv, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), jr = /* @__PURE__ */ z(_v, [["__scopeId", "data-v-cbdcf540"]]), Cv = { class: "dashboard" }, Ev = { class: "trail" }, Av = ["onClick"], Ov = {
  key: 0,
  class: "gone",
  role: "status"
}, Tv = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = O(!!n.page && !s(n.page)), l = O(n.page && !o.value ? [n.page] : []), r = E(() => l.value.at(-1) || n.document.start), i = E(() => (n.document.pages || {})[r.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ge(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (u(), d("div", Cv, [
      e.document.broken ? (u(), F(ln, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          V(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), F(ln, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          V(v(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (u(), d(D, { key: 2 }, [
        m("nav", Ev, [
          m("button", {
            type: "button",
            class: K(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(c(e.document.start)), 3),
          (u(!0), d(D, null, ne(l.value, (b, A) => (u(), d(D, {
            key: `${A}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: K(["step", { current: A === l.value.length - 1 }]),
              onClick: (S) => h(A + 1)
            }, v(c(b)), 11, Av)
          ], 64))), 128))
        ]),
        o.value ? (u(), d("p", Ov, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        I(zt, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (u(), d("div", {
              key: r.value,
              class: "page"
            }, [
              I(jr, {
                node: i.value.view,
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
}, Iv = /* @__PURE__ */ z(Tv, [["__scopeId", "data-v-fbe83734"]]);
function Bv(e, t) {
  const n = tt(), a = Ls(e, Pr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), et(() => {
    s(), a.cancel();
  });
}
const Rv = {
  key: 0,
  class: "window-failure"
}, Lv = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = tt(), o = O(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Bv(l, n.events) : Bs(l, () => !0, Pr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (u(), d("p", Rv, v(o.value.error), 1)) : o.value ? (u(), F(Iv, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, Nv = 1e4;
class qv {
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
    return this.heardAt !== null && t - this.heardAt > Nv;
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
const Dv = {
  key: 0,
  class: "frame-note"
}, Pv = {
  key: 0,
  class: "frame-note"
}, jv = ["src", "title"], Fv = 1e3, Wv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = tt(), a = O(null), s = O(!1), o = O(!1);
    let l = null, r = 0;
    return _e(() => {
      l = new qv(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Fv);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, c) => o.value ? (u(), d("p", Dv, "This window was closed because it stopped answering.")) : (u(), d(D, { key: 1 }, [
      s.value ? (u(), d("div", Pv, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        I(ve, {
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
      }, null, 8, jv)
    ], 64));
  }
}, Hv = /* @__PURE__ */ z(Wv, [["__scopeId", "data-v-32a49046"]]), zv = {
  class: "allowance-prompt",
  role: "dialog"
}, Uv = { class: "allowance-prompt-text" }, Gv = { class: "allowance-prompt-buttons" }, Vv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), d("div", zv, [
      m("p", Uv, v(L(jg)(e.request)), 1),
      m("div", Gv, [
        I(ve, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            V("Allow", -1)
          ])]),
          _: 1
        }),
        I(ve, {
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
}, Kv = /* @__PURE__ */ z(Vv, [["__scopeId", "data-v-cad69fe2"]]), La = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), F(ln, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        V(v(e.reason) + " ", 1),
        e.retry ? (u(), F(ve, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            V("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (u(), F(ve, {
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
}, Yv = ["data-window", "data-agent"], Qv = {
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
    const n = e, a = t, s = O(""), o = O(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Me(kc, null), i = bd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: E(() => n.options),
      declared: n.declared,
      page: Me(md, null),
      setOption: (h, p) => a("option", h, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (h, p) => {
        a("open", h, p), r == null || r(h, p);
      }
    });
    Il(Ne, i), ge(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), _e(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Ji((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ua(n.component), f = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (u(), F(Kv, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (u(), F(La, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), F(La, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), d(D, { key: 4 }, [
        (u(), F(c, { key: o.value })),
        e.skeleton.length && !L(i).answered.value ? (u(), F(Qs, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (u(), F(La, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Yv));
  }
}, en = /* @__PURE__ */ z(Qv, [["__scopeId", "data-v-c4443e2b"]]), Fr = {
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
    const n = e, a = t, s = { render: () => ua(Hv, { src: n.entry.entry_url }) };
    return (o, l) => (u(), F(en, {
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
}, Xv = ["data-window"], Wr = {
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
    const n = e, a = t, s = Xe(null), o = O("");
    return ge(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Pu();
          } catch (r) {
            if (qu(r) && Du(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      I(Qs, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Xv)) : (u(), F(en, {
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
}, Jv = {
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
    const n = t, a = e, s = E(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = E(() => s.value && { render: () => ua(Lv, { line: s.value.line, events: s.value.events }) }), l = O(null), r = E(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), i = E(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = E(
      () => {
        var p, y;
        return l.value ? Fg(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
        await f(), c.value.missing.length && !r.value && h();
      },
      { immediate: !0 }
    ), (p, y) => {
      var b, A;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), F(Qs, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((A = s.value) == null ? void 0 : A.shows) === "one-agent" && e.agent === null ? (u(), F(ln, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (u(), F(en, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), F(Wr, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), F(Fr, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), F(en, {
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
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), F(en, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (S) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Zv = ["data-section"], ey = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, ty = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(Ps, null), a = E(() => {
      const o = t.names.map((r) => ({ name: r, offered: !!(n != null && n.catalogue.window(r)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((r) => !t.names.includes(r.name));
      return [...o, ...l.map((r) => ({ name: r.name, offered: !0 }))];
    }), s = E(() => ({ row: t.row }));
    return (o, l) => L(n) ? (u(!0), d(D, { key: 0 }, ne(a.value, (r) => (u(), d("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      r.offered ? (u(), F(Jv, {
        key: 0,
        name: r.name,
        catalogue: L(n).catalogue,
        subscriptions: L(n).subscriptions,
        environment: L(n).environment,
        prompts: L(n).prompts,
        "shell-read": L(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), d("p", ey, v(r.name) + " is not available", 1))
    ], 8, Zv))), 128)) : k("", !0);
  }
}, ys = /* @__PURE__ */ z(ty, [["__scopeId", "data-v-a47d36b7"]]), ny = { class: "rail-head" }, ay = { key: 0 }, sy = {
  key: 1,
  class: "rail-none"
}, oy = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), d("aside", {
      class: K(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", ny, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), d("span", ay, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (u(!0), d(D, { key: 0 }, ne(e.comments, (a) => (u(), F(qr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), d("p", sy, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, ly = /* @__PURE__ */ z(oy, [["__scopeId", "data-v-4d684649"]]), ry = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, iy = ["aria-pressed"], uy = ["aria-pressed"], cy = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, dy = {
  key: 0,
  role: "alert"
}, fy = {
  key: 1,
  class: "sidebar-none"
}, hy = ["data-question-id"], my = { class: "question-state" }, py = ["data-question-show", "onClick"], gy = {
  key: 0,
  class: "sidebar-none"
}, vy = {
  key: 1,
  class: "question-answer"
}, yy = {
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
    const t = Me(Ps, null);
    return (n, a) => (u(), d("div", {
      class: K(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", ry, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, iy),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, uy)
      ]),
      e.mode === "comments" ? (u(), d(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), F(ly, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        I(vn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), d("aside", cy, [
        e.failure ? (u(), d("p", dy, v(e.failure), 1)) : e.questions.length ? k("", !0) : (u(), d("p", fy, "No questions about this text yet.")),
        (u(!0), d(D, null, ne(e.questions, (s) => {
          var o;
          return u(), d("section", {
            key: s.id,
            class: K(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", my, v(L(rn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, py),
            s.quote ? (u(), d(D, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (u(), d("p", gy, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (u(), d("p", vy, "Answered: " + v(s.answer), 1)) : k("", !0),
            I(ys, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            I(Ws, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = L(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, hy);
        }), 128))
      ]))
    ], 2));
  }
}, zo = /* @__PURE__ */ z(yy, [["__scopeId", "data-v-660e5c85"]]), by = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, ky = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ht({ abstract: n.row.abstract, body: n.row.body }), o = O("");
    async function l() {
      const r = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = r.ok ? "" : r.error, r.ok && a("saved");
    }
    return (r, i) => (u(), F(pa, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: i[3] || (i[3] = (c) => a("close"))
    }, {
      foot: j(() => [
        m("span", by, v(o.value), 1),
        I(ve, {
          onClick: i[2] || (i[2] = (c) => a("close"))
        }, {
          default: j(() => [...i[6] || (i[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        I(ve, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: j(() => [...i[7] || (i[7] = [
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
            i[4] || (i[4] = m("span", null, "Abstract", -1)),
            Je(m("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Yn, s.abstract]
            ])
          ]),
          m("label", null, [
            i[5] || (i[5] = m("span", null, "Text", -1)),
            Je(m("textarea", {
              "onUpdate:modelValue": i[1] || (i[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Yn, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, wy = /* @__PURE__ */ z(ky, [["__scopeId", "data-v-464d77a8"]]);
function Hr(e, t) {
  const n = O([]), a = O(!1), s = O(null), o = O(0), l = O(!1), r = O("");
  let i = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: A, id: S, title: x } = e(), B = `On ${A} ${S}, ${x}: `;
    return b.text.startsWith(B) ? b.text.slice(B.length) : b.text;
  };
  async function h(b = 1) {
    const { term: A, id: S } = e();
    if (!S) return;
    const x = ++c;
    l.value = !0, r.value = "";
    try {
      const B = await t([A, "comments", String(S), "--page", String(b), "--page-size", "25"]);
      if (x !== c) return;
      if (!B.ok) {
        r.value = B.error;
        return;
      }
      const W = B.value.rows ?? [], N = b === 1 ? W : [...n.value, ...W];
      n.value = [...new Map(N.map((w) => [w.id, w])).values()], o.value = B.value.total ?? n.value.length, s.value = B.value.next_page ?? null;
    } catch (B) {
      x === c && (r.value = B.message);
    } finally {
      x === c && (l.value = !1);
    }
  }
  async function p(b) {
    var w;
    const { term: A, id: S } = e(), x = `${A}:${S}`, B = { id: `sending-${++i}`, text: b };
    n.value = [...n.value, B], o.value++, a.value = !0;
    const W = await t([A, "comment", String(S), b]);
    if (x !== `${e().term}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((H) => H.id !== B.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await h();
    const N = (w = W.value) == null ? void 0 : w.id;
    N && !n.value.some((H) => H.id === N) && (n.value = [...n.value, { ...B, id: N }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return ge(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: r };
}
function $y(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let i = n.length - 1; i >= 0; i -= 1)
    for (let c = a.length - 1; c >= 0; c -= 1)
      s[i][c] = n[i] === a[c] ? s[i + 1][c + 1] + 1 : Math.max(s[i + 1][c], s[i][c + 1]);
  const o = [];
  let l = 0, r = 0;
  for (; l < n.length || r < a.length; )
    l < n.length && r < a.length && n[l] === a[r] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, r += 1) : r < a.length && (l === n.length || s[l][r + 1] >= s[l + 1][r]) ? (o.push({ key: `new:${r}`, type: "added", text: a[r] }), r += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const xy = {
  class: "document-tab",
  "data-document-revisions": ""
}, Sy = ["datetime"], My = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, _y = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Cy = {
  key: 2,
  class: "document-none"
}, Ey = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(null), o = O(""), l = E(() => s.value ? $y(s.value.body, n.text) : []);
    async function r(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function i() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (u(), d("div", xy, [
      e.editing ? (u(), F(ve, {
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
      e.revisions.length ? (u(), d(D, { key: 1 }, [
        (u(!0), d(D, null, ne(e.revisions, (h) => (u(), F(ve, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => r(h)
        }, {
          default: j(() => [
            V("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, Sy)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), d("p", My, v(o.value), 1)) : k("", !0),
        s.value ? (u(), d(D, { key: 1 }, [
          I(ve, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: i
          }, {
            default: j(() => [...f[2] || (f[2] = [
              V("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", _y, [
            (u(!0), d(D, null, ne(l.value, (h) => (u(), d("div", {
              key: h.key,
              class: K(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (u(), d("p", Cy, "No revisions"))
    ]));
  }
}, Ay = /* @__PURE__ */ z(Ey, [["__scopeId", "data-v-3a381aa4"]]), Oy = "button, [data-comment-number]", Ty = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function zr(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Oy) || n.push(t.currentNode);
  return n;
}
function Uo(e, t, n) {
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
const Iy = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function By(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = zr(e), s = a.map((c) => c.data).join(""), o = Uo(a, n.startContainer, n.startOffset), l = s.slice(o, Uo(a, n.endContainer, n.endOffset)), r = l.trim();
  if (!r) return null;
  const i = n.commonAncestorContainer;
  return { quote: r, position: o + l.indexOf(r), selection_type: Iy(i.nodeType === Node.TEXT_NODE ? i.parentElement : i) };
}
function Ry(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function Ly(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), r = Math.min(n - s, o.data.length);
    l < r && a.push({ node: o, from: l, to: r }), s += o.data.length;
  }
  return a;
}
function Na(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function Ny({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function qy(e, t) {
  const n = zr(e), a = Ry(n.map((r) => r.data).join(""), t);
  if (a < 0) return !1;
  const s = Ly(n, a, a + t.quote.length), o = (r) => r.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(Ny).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const r of l)
    r.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && r.classList.add("hot"), t.id && (r.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Na(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Na(t.number, t.id, t.label)) : l.at(-1).append(Na(t.number, t.id, t.label))), !0;
}
function Dy(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !qy(e, a) && a.id && n.push(a.id);
  return n;
}
const Py = (e) => e.closest(Ty) ?? e;
function Go(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const jy = {
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
    const a = e, s = n, o = O(null), l = O(null), r = O(null), i = O(!1), c = O(null);
    function f() {
      if (!l.value || i.value) return;
      l.value.innerHTML = a.html;
      const A = a.comments.filter((W) => W.quote).map((W) => ({ ...W, label: a.annotationLabel, hot: W.id === a.hot })), S = Dy(l.value, a.pending ? [...A, { ...a.pending, pending: !0 }] : A);
      s("lost", S);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const B = document.createElement("div");
      B.className = "inline-comment", Py(x).after(B), c.value = B;
    }
    function h() {
      if (!l.value) return;
      const A = By(l.value);
      if (i.value = !!A, !A) {
        r.value = null;
        return;
      }
      const S = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      r.value = { left: `${Math.max(S.left - x.left, 0)}px`, top: `${S.top - x.top + o.value.scrollTop}px` }, s("select", A);
    }
    function p(A) {
      const S = A.target.closest("[data-comment-number]");
      S ? s("number", Number(S.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(A) {
      var S;
      (S = l.value.querySelector(`[data-comment="${A}"]`)) == null || S.scrollIntoView({ block: "center" });
    }
    function b(A) {
      var S;
      (S = l.value.querySelectorAll("h3, h4, h5, h6")[A]) == null || S.scrollIntoView({ block: "start" });
    }
    return ge(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, i.value, a.pending], f, { flush: "post" }), _e(() => {
      f(), document.addEventListener("selectionchange", h);
    }), et(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: je }), (A, S) => (u(), d("div", {
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
      r.value ? (u(), d("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ye(r.value),
        "data-comment-pill": "",
        onMousedown: S[0] || (S[0] = Se(() => {
        }, ["prevent"])),
        onClick: S[1] || (S[1] = (x) => s("write"))
      }, [
        I(re, {
          name: "chat",
          size: 13
        }),
        S[2] || (S[2] = V("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (u(), F(da, {
        key: 1,
        to: c.value
      }, [
        he(A.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      he(A.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Fy = /* @__PURE__ */ z(jy, [["__scopeId", "data-v-548d0aaa"]]), Wy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, Hy = { class: "document-tabs" }, zy = { class: "document-body" }, Uy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Gy = {
  key: 1,
  class: "document-loading"
}, Vy = {
  class: "document-details",
  "data-resource-fields": ""
}, Ky = 760, Yy = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = O(null), a = Mg(n), s = E(() => a.value !== null && a.value < Ky), o = O(null), l = O(""), r = O([]), i = O([]), c = O(""), f = O("comments"), h = O("text"), p = O(0), y = O(0), b = O([]), A = O(null), S = O(""), x = O(!1), B = O(null), W = O(null);
    let N = 0;
    const w = Hr(() => o.value ? { term: t.term, id: t.id, title: o.value.title } : {}, (ce) => t.read(ce)), H = E(() => Go(w.comments.value)), P = E(() => f.value === "questions" ? Go(i.value) : H.value), q = E(() => f.value === "questions" ? P.value.length : w.total.value), _ = E(() => {
      var ce;
      return (ce = o.value) != null && ce.body ? Us(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), T = E(() => {
      var ce;
      return (((ce = o.value) == null ? void 0 : ce.body) ?? "").split(`
`).filter((te) => /^#{1,4} /.test(te)).map((te, se) => ({ key: String(se), value: se, label: te.replace(/^#+ /, "") }));
    }), $ = E(() => H.value.find((ce) => ce.id === y.value)), g = E(() => {
      var ce;
      return (ce = o.value) != null && ce.close_reason ? "Closed" : "Open";
    }), M = E(() => h.value === "comments" && !s.value ? "text" : h.value), C = (ce) => ce.ok ? ce.value.rows ?? [] : [];
    async function R() {
      const ce = ++N, te = await t.read([t.term, "inspect", String(t.id)]);
      if (ce !== N) return;
      l.value = te.ok ? "" : te.error, o.value = te.ok ? te.value : null;
      const se = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), oe = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      ce === N && (i.value = C(se), c.value = se.ok ? "" : se.error, r.value = oe ? C(oe) : []);
    }
    async function U(ce) {
      const te = A.value ? ["--quote", A.value.quote, "--position", String(A.value.position), "--selection-type", A.value.selection_type] : [], se = await t.read([t.term, "comment", String(t.id), ...te, "--", ce]);
      if (!se.ok) throw new Error(se.error);
      A.value = null, await Promise.all([R(), w.load()]);
    }
    async function Z() {
      const ce = await t.read(["doc", "close", String(t.id)]);
      l.value = ce.ok ? "" : ce.error, ce.ok && await R();
    }
    function ee() {
      S.value.trim() || (A.value = null);
    }
    function pe(ce) {
      var te;
      if (p.value = ce, s.value && f.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === ce ? 0 : ce : (te = n.value.querySelector(f.value === "questions" ? `[data-question-id="${ce}"]` : `[data-comment-id="${ce}"]`)) == null || te.scrollIntoView({ block: "nearest" });
    }
    async function ie(ce) {
      var te, se;
      h.value = "text", p.value = ce, await ((te = B.value) == null ? void 0 : te.nextTick()), (se = B.value) == null || se.show(ce);
    }
    function we() {
      x.value = !1, R();
    }
    return ge(() => `${t.term}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, A.value = null, i.value = [], c.value = "", R();
    }, { immediate: !0 }), ge(f, () => {
      p.value = 0, y.value = 0;
    }), (ce, te) => (u(), d("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), d("div", Wy, [
        I(ve, {
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
      m("nav", Hy, [
        m("button", {
          type: "button",
          class: K(["document-tab-button", { on: M.value === "text" }]),
          "data-document-tab": "text",
          onClick: te[1] || (te[1] = (se) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), d("button", {
          key: 0,
          type: "button",
          class: K(["document-tab-button", { on: M.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: te[2] || (te[2] = (se) => h.value = "comments")
        }, [
          V(v(f.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(q.value || ""), 1)
        ], 2)) : k("", !0),
        e.term === "doc" ? (u(), d("button", {
          key: 1,
          type: "button",
          class: K(["document-tab-button", { on: M.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: te[3] || (te[3] = (se) => h.value = "revisions")
        }, [
          te[15] || (te[15] = V("Revisions ", -1)),
          m("em", null, v(r.value.length || ""), 1)
        ], 2)) : k("", !0),
        te[16] || (te[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        M.value === "text" && T.value.length > 1 ? (u(), F(Nr, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: T.value,
          "data-text-chapters": "",
          onPick: te[4] || (te[4] = (se) => {
            var oe;
            return (oe = B.value) == null ? void 0 : oe.showHeading(se.value);
          })
        }, null, 8, ["label", "items"])) : k("", !0)
      ]),
      m("div", zy, [
        l.value ? (u(), d("p", Uy, v(l.value), 1)) : o.value ? M.value === "revisions" ? (u(), F(Ay, {
          key: 2,
          id: e.id,
          revisions: r.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: Z,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : M.value === "comments" ? (u(), F(zo, {
          key: 3,
          mode: f.value,
          "onUpdate:mode": te[5] || (te[5] = (se) => f.value = se),
          tab: "",
          comments: H.value,
          questions: i.value,
          hot: p.value,
          lost: b.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!L(w).nextPage.value,
          "comment-loading": L(w).loading.value,
          "comment-failure": L(w).failure.value,
          "comment-total": L(w).total.value,
          onMore: L(w).loadMore,
          onShow: ie,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), d(D, { key: 4 }, [
          I(Fy, {
            ref_key: "words",
            ref: B,
            html: _.value,
            comments: P.value,
            "annotation-label": f.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: A.value,
            inline: y.value,
            onSelect: te[7] || (te[7] = (se) => A.value = se),
            onClear: ee,
            onNumber: pe,
            onWrite: te[8] || (te[8] = (se) => {
              var oe;
              return (oe = W.value) == null ? void 0 : oe.focus();
            }),
            onLost: te[9] || (te[9] = (se) => b.value = se)
          }, {
            inline: j(() => [
              $.value ? (u(), F(qr, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: te[6] || (te[6] = (se) => ie($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: j(() => [
              m("dl", Vy, [
                te[18] || (te[18] = m("h4", null, "Details", -1)),
                te[19] || (te[19] = m("dt", null, "State", -1)),
                m("dd", null, v(g.value), 1),
                o.value.close_reason ? (u(), d(D, { key: 0 }, [
                  te[17] || (te[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(o.value.close_reason), 1)
                ], 64)) : k("", !0),
                te[20] || (te[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  I(Ze, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                te[21] || (te[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  I(Ze, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? k("", !0) : (u(), F(zo, {
            key: 0,
            mode: f.value,
            "onUpdate:mode": te[10] || (te[10] = (se) => f.value = se),
            comments: H.value,
            questions: i.value,
            hot: p.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!L(w).nextPage.value,
            "comment-loading": L(w).loading.value,
            "comment-failure": L(w).failure.value,
            "comment-total": L(w).total.value,
            onMore: L(w).loadMore,
            onShow: ie,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), d("div", Gy, [
          I(Ke)
        ]))
      ]),
      o.value ? (u(), F(Pg, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: S.value,
        "onUpdate:draft": te[11] || (te[11] = (se) => S.value = se),
        selection: A.value,
        send: U,
        narrow: s.value,
        onClear: te[12] || (te[12] = (se) => A.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      x.value ? (u(), F(wy, {
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
}, zS = /* @__PURE__ */ z(Yy, [["__scopeId", "data-v-029db6fe"]]), Qy = {
  key: 1,
  class: "row-list-failure"
}, Xy = ["data-row"], Jy = {
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
    const t = e, n = E(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = O(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), d("p", Qy, v(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), F(ln, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        V(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), d(D, { key: 3 }, [
      (u(), F(ut(e.arrival || e.moves ? Ts : "ul"), Pe(n.value, { class: "row-list" }), {
        default: j(() => [
          (u(!0), d(D, null, ne(e.rows, (r) => (u(), d("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            he(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Xy))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : k("", !0)
    ], 64));
  }
}, Zy = /* @__PURE__ */ z(Jy, [["__scopeId", "data-v-e9f251f3"]]), e0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, t0 = {
  key: 1,
  class: "agent-rows-note"
}, n0 = {
  key: 2,
  class: "agent-rows-note"
}, a0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, s0 = ["data-agent-row", "onClick"], o0 = { class: "agent-row-name" }, l0 = { class: "agent-row-state" }, r0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = E(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), d("div", e0, [
      e.loaded ? e.failure ? (u(), d("p", t0, v(e.failure), 1)) : e.rows.length ? (u(), d(D, { key: 3 }, [
        m("p", a0, v(a.value) + " running", 1),
        (u(!0), d(D, null, ne(n.value, (l) => (u(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => L(De)(`agents:${l.id}`)
        }, [
          m("span", o0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", l0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, s0))), 128))
      ], 64)) : (u(), d("p", n0, v(e.none), 1)) : (u(), F(Ke, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, US = /* @__PURE__ */ z(r0, [["__scopeId", "data-v-a01e5a17"]]), ft = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ue = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, i0 = 6;
function Xs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const u0 = (e) => {
  const t = Xs(e, ft.lineChars), n = Math.max(ft.minWidth, Math.max(...t.map((a) => a.length)) * ft.charWidth + ft.padX * 2);
  return { name: e, lines: t, line: ft.line, padY: ft.padY, width: n, height: t.length * ft.line + ft.padY * 2 };
};
function c0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const c = s.get(r[1]);
      c === "open" ? a.add(i) : c || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function d0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function f0(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), c = (f) => {
      const h = r(f).map((p) => i.get(p));
      return h.length ? h.reduce((p, y) => p + y, 0) / h.length : i.get(f);
    };
    return [...l].sort((f, h) => c(f) - c(h));
  };
  for (let l = 0; l < i0; l++) {
    const r = l % 2 === 0, i = a.map((c, f) => f);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((p) => p[r ? 1 : 0] === h).map((p) => p[r ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function h0(e, t) {
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
function m0(e) {
  const t = [...new Set(e.flatMap(([N, w]) => [N, w]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = c0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, w) => !s.has(w)), l = d0(t, o), r = f0(t, o, l), i = new Map(t.map((N) => [N, u0(N)])), c = r.map((N) => N.reduce((w, H) => w + i.get(H).width, 0) + He.across * (N.length - 1)), f = Math.max(...c) + He.margin * 2, h = g0(e, l, r.length), p = /* @__PURE__ */ new Map();
  let y = He.margin;
  r.forEach((N, w) => {
    let H = (f - c[w]) / 2;
    const P = Math.max(...N.map((q) => i.get(q).height));
    N.forEach((q) => {
      const _ = i.get(q);
      p.set(q, { ..._, x: H, y: y + (P - _.height) / 2 }), H += _.width + He.across;
    }), y += P + (h[w] ?? He.down);
  });
  const b = e.map(([N, w, H], P) => ({ from: N, to: w, label: H || "", back: s.has(P) || l.get(w) <= l.get(N) }));
  h0(b, p);
  const A = b.map((N) => v0(N, p.get(N.from), p.get(N.to))), S = [...p.values()], x = w0(A, S), B = Math.max(y - He.down, ...x.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(f - He.margin, ...x.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + He.margin, height: B + He.margin, nodes: S, arrows: x };
}
const p0 = (e) => e ? Xs(e, Ue.lineChars).length * Ue.line + Ue.pad * 2 : 0;
function g0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += p0(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function v0(e, t, n) {
  const a = e.label ? Xs(e.label, Ue.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ue.charWidth + Ue.pad * 2 : 0, o = a.length * Ue.line + (a.length ? Ue.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - r) / 2, h = [{ x: l, y: r }, { x: l, y: r + f }, { x: i, y: c - f }, { x: i, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${r} C${l} ${r + f} ${i} ${c - f} ${i} ${c}` };
}
const y0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, b0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], k0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ue.line);
function w0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, c) => {
      const f = y0(a.curve, i);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, r = k0.flatMap((i) => b0.map((c) => s(c, i))).find((i) => !n.some((c) => Vo(i, c))) ?? s(0.5, 0);
    for (; n.some((i) => Vo(r, i)); ) r.y += Ue.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Ue.line, pad: Ue.pad } };
  });
}
const Vo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, $0 = { class: "flowchart-tools" }, x0 = ["width", "height", "viewBox", "aria-label"], S0 = ["d"], M0 = ["x", "y", "width", "height"], _0 = ["x", "y"], C0 = ["x", "dy"], E0 = {
  key: 0,
  class: "flowchart-label"
}, A0 = ["x", "y", "width", "height"], O0 = ["x", "y"], T0 = ["x", "dy"], I0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => m0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = O(null), r = O({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function c() {
      var x;
      const A = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(A != null && A.width)) return;
      const S = Math.min(A.width / s.value.width, A.height / s.value.height, 1.5);
      r.value = { zoom: S, x: (A.width - s.value.width * S) / 2, y: (A.height - s.value.height * S) / 2 };
    }
    function f(A, S, x) {
      const { zoom: B, x: W, y: N } = r.value, w = Math.min(o.most, Math.max(o.least, B * A));
      r.value = { zoom: w, x: S - (S - W) * w / B, y: x - (x - N) * w / B };
    }
    function h(A) {
      const S = l.value.getBoundingClientRect();
      f(A, S.width / 2, S.height / 2);
    }
    function p(A) {
      const S = l.value.getBoundingClientRect();
      A.ctrlKey || A.metaKey ? f(A.deltaY < 0 ? o.step : 1 / o.step, A.clientX - S.left, A.clientY - S.top) : r.value = { ...r.value, x: r.value.x - A.deltaX, y: r.value.y - A.deltaY };
    }
    function y(A) {
      var S, x, B;
      A.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), i = { x: A.clientX - r.value.x, y: A.clientY - r.value.y }, (B = (x = l.value).setPointerCapture) == null || B.call(x, A.pointerId);
    }
    function b(A) {
      i && (r.value = { ...r.value, x: A.clientX - i.x, y: A.clientY - i.y });
    }
    return _e(c), (A, S) => (u(), F(pa, {
      padded: "",
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (x) => a("close"))
    }, {
      default: j(() => [
        m("div", $0, [
          I(ve, {
            small: "",
            onClick: S[0] || (S[0] = (x) => h(o.step))
          }, {
            default: j(() => [...S[5] || (S[5] = [
              V("Zoom in", -1)
            ])]),
            _: 1
          }),
          I(ve, {
            small: "",
            onClick: S[1] || (S[1] = (x) => h(1 / o.step))
          }, {
            default: j(() => [...S[6] || (S[6] = [
              V("Zoom out", -1)
            ])]),
            _: 1
          }),
          I(ve, {
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
          onPointerup: S[2] || (S[2] = (x) => go(i) ? i.value = null : i = null),
          onPointercancel: S[3] || (S[3] = (x) => go(i) ? i.value = null : i = null)
        }, [
          (u(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ye({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
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
            (u(!0), d(D, null, ne(s.value.arrows, (x, B) => (u(), d("path", {
              key: `arrow-${B}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, S0))), 128)),
            (u(!0), d(D, null, ne(s.value.nodes, (x) => (u(), d("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, M0),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (u(!0), d(D, null, ne(x.lines, (B, W) => (u(), d("tspan", {
                  key: W,
                  x: x.x + x.width / 2,
                  dy: W ? x.line : 0
                }, v(B), 9, C0))), 128))
              ], 8, _0)
            ]))), 128)),
            (u(!0), d(D, null, ne(s.value.arrows, (x, B) => (u(), d(D, {
              key: `label-${B}`
            }, [
              x.label ? (u(), d("g", E0, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, A0),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (u(!0), d(D, null, ne(x.label.lines, (W, N) => (u(), d("tspan", {
                    key: N,
                    x: x.label.x + x.label.width / 2,
                    dy: N ? x.label.line : 0
                  }, v(W), 9, T0))), 128))
                ], 8, O0)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, x0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, B0 = /* @__PURE__ */ z(I0, [["__scopeId", "data-v-e98799dc"]]), R0 = ["innerHTML"], L0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => So[t.name] || So.dot);
    return (a, s) => (u(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, R0));
  }
}, Et = /* @__PURE__ */ z(L0, [["__scopeId", "data-v-beb5935c"]]), N0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), d("span", {
      class: K(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      I(Et, { name: "fold" })
    ], 2));
  }
}, Vt = /* @__PURE__ */ z(N0, [["__scopeId", "data-v-d03899bb"]]), q0 = ["data-tip", "aria-label"], D0 = {
  key: 0,
  class: "mact-word"
}, P0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), d("button", {
      type: "button",
      class: K(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      I(Et, { name: "open" }),
      e.open ? (u(), d("span", D0, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, q0));
  }
}, Ur = /* @__PURE__ */ z(P0, [["__scopeId", "data-v-3b292e09"]]), Gr = 120, Hn = 280, Vr = 160, j0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, F0 = ["leaving", "resizing", "entering"];
function bs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function W0(e) {
  const t = F0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = bs(e);
  return e.classList.add(...t), n;
}
function Kr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = O(t()), s = O("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), r = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function i(h, p) {
    r(h);
    const y = W0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, i(h, bs(h)));
    });
    return b.observe(p), b;
  }
  async function f(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || j0()) {
      a.value = h;
      return;
    }
    const b = bs(p);
    if (l(p, b), s.value = "leaving", await n(Gr), y !== o) return;
    a.value = h, s.value = "resizing", await je(), i(p, b);
    const A = c(p);
    await n(Hn), A == null || A.disconnect(), y === o && (r(p), s.value = "entering", await n(Vr), y === o && (s.value = ""));
  }
  return ge(t, (h) => f(h)), et(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const H0 = { class: "growing-card-top" }, z0 = ["aria-expanded"], U0 = { class: "growing-card-avatar" }, G0 = { class: "growing-card-title" }, V0 = { class: "growing-card-more" }, K0 = { class: "growing-card-body" }, Y0 = {
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
    const n = e, a = t, s = O(!1), o = O(null), { folded: l, phase: r } = Kr(o, () => !s.value), i = E(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = E(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (u(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: K(["growing-card-wrap", L(r), { open: !L(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", H0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", U0, [
            e.bad ? (u(), F(Et, {
              key: 0,
              name: "cross"
            })) : i.value ? (u(), d(D, { key: 1 }, [
              V(v(i.value), 1)
            ], 64)) : (u(), F(re, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", G0, v(e.title), 1),
          I(Vt, { open: s.value }, null, 8, ["open"])
        ], 8, z0),
        e.action ? (u(), F(Ur, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : k("", !0),
        e.commentable ? (u(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (p) => a("comment"))
        }, [
          I(re, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", V0, [
        m("div", K0, [
          (u(!0), d(D, null, ne(c.value, (p, y) => (u(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Q0 = /* @__PURE__ */ z(Y0, [["__scopeId", "data-v-f2b4930d"]]), X0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, J0 = { class: "md inline" }, Z0 = ["disabled", "title", "onClick"], eb = {
  key: 1,
  class: "message-links-many"
}, tb = ["aria-expanded"], nb = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, ab = ["disabled", "onClick"], sb = { class: "row-pill message-links-chip" }, ob = { class: "message-links-title" }, lb = { key: 0 }, qa = 3, rb = "task", ib = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.total || n.links.length), o = E(() => n.links.every((p) => p.endpoint.model === rb) ? "tasks" : "items"), l = O(!1), r = O(null);
    Kl(r, () => l.value = !1);
    const i = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, De(p.endpoint.open_ref));
    }
    return (p, y) => (u(), d("div", {
      ref_key: "line",
      ref: r,
      class: K(["message-links", { many: s.value > qa, three: s.value === qa, open: l.value }]),
      "data-message-links": ""
    }, [
      I(Et, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), d("span", X0, [
        m("span", J0, [
          y[1] || (y[1] = V("Linked: ", -1)),
          (u(!0), d(D, null, ne(e.links, (b) => (u(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (A) => h(b)
          }, [
            V(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (u(), d(D, { key: 0 }, [
              V(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (u(), d(D, { key: 1 }, [
              V(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, Z0))), 128))
        ])
      ])) : k("", !0),
      s.value >= qa ? (u(), d("span", eb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          V(v(s.value) + " linked " + v(o.value) + " ", 1),
          I(Vt, { open: l.value }, null, 8, ["open"])
        ], 8, tb)
      ])) : k("", !0),
      l.value ? (u(), d("div", nb, [
        (u(!0), d(D, null, ne(e.links, (b) => (u(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (A) => h(b)
        }, [
          m("span", sb, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          m("span", ob, v(b.endpoint.title), 1),
          m("span", null, v(f(b)), 1),
          c(b) ? (u(), d("span", lb, "Unavailable")) : k("", !0)
        ], 8, ab))), 128))
      ])) : k("", !0),
      I(vn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, ub = /* @__PURE__ */ z(ib, [["__scopeId", "data-v-14ec7c9a"]]), cb = ["title", "aria-label"], db = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, fb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, hb = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = E(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), d("span", {
      class: K(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), d("svg", db, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), d("path", fb)) : k("", !0)
      ]))
    ], 10, cb));
  }
}, mb = /* @__PURE__ */ z(hb, [["__scopeId", "data-v-6dc92808"]]), pb = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, gb = (e) => e.worker_id != null ? "report" : "message", vb = (e) => pb[gb(e)], yb = "img,pre,table";
function bb(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function kb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function wb(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(yb)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = bb(kb(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function $b(e, t) {
  let n = null;
  const a = () => e.value && wb(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), ge(t, a, { flush: "post" });
}
const xb = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Sb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Rn = /* @__PURE__ */ new WeakMap(), Re = "work", Qe = "sent", Mb = 50, Ko = 50, Yo = () => ({ rows: O([]), total: O(0), next: O(null), loading: O(!1), failure: O(""), version: 0 });
function _b(e) {
  var A;
  if (Rn.has(e)) return Rn.get(e);
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
    const H = x === Re ? N.value.counterparts ?? [] : N.value.rows ?? [], P = W === 1 ? H : [...w.rows.value, ...H], q = x === Re ? (_) => `${_.endpoint.model}:${_.endpoint.id}` : (_) => _.id ?? _.target_id;
    w.rows.value = [...new Map(P.map((_) => [q(_), _])).values()], w.total.value = N.value.total ?? w.rows.value.length, w.next.value = N.value.next_page ?? null;
  }
  function r(S, x, B, W) {
    const N = S[x];
    N.version === B && (N.failure.value = W.message, N.loading.value = !1);
  }
  async function i(S, x, B) {
    const W = o(S, x), N = x === Re ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(S, x, W, B, await e.read(`link list --source message:${S.id} ${N} --page ${B} --page-size ${x === Re ? 10 : 25}`));
    } catch (w) {
      r(S, x, W, w);
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
      S.forEach((W, N) => [Re, Qe].forEach((w) => r(W, w, x[N][w], B)));
    }
  }
  function f() {
    a = null;
    const S = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), S.forEach((x) => x.dirty.clear());
    for (let x = 0; x < S.length; x += Ko) c(S.slice(x, x + Ko));
  }
  function h(S, x = [Re, Qe]) {
    for (const B of x) S.dirty.add(B);
    s(S) && (n.add(S.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(S) {
    const x = S.sources ?? (S.source_model && Number.isInteger(S.source_id) ? [{ model: S.source_model, id: S.source_id }] : []), B = S.link_types ?? (S.link_type ? [S.link_type] : []), W = B.length ? [Re, Qe].filter((w) => w === Re ? B.some((H) => ["about", "edited"].includes(H)) : B.includes("sent_to")) : [Re, Qe];
    if (!W.length) return;
    const N = x.length ? [...new Set(x.filter((w) => w.model === "message").map((w) => w.id))].map((w) => t.get(w)).filter(Boolean) : [...t.values()].filter(s).slice(0, Mb);
    for (const w of N) h(w, W);
  }
  const y = (A = e.follow) == null ? void 0 : A.call(e, ["link.*"], p), b = {
    attach(S, x) {
      let B = t.get(S);
      return B || (B = { id: S, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Re, Qe]), work: Yo(), sent: Yo() }, t.set(S, B)), B.views.add(x), B.dirty.size && h(B, [...B.dirty]), B;
    },
    shown(S) {
      S.dirty.size && h(S, [...S.dirty]);
    },
    detach(S, x) {
      S.views.delete(x), S.views.size || t.delete(S.id), t.size || (clearTimeout(a), y == null || y(), Rn.delete(e));
    },
    more(S, x) {
      const B = S == null ? void 0 : S[x];
      if (B != null && B.next.value && !B.loading.value) return i(S, x, B.next.value);
    }
  };
  return Rn.set(e, b), b;
}
function Cb(e, t, n) {
  const a = Xe(null);
  let s = null;
  const o = ge(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = _b(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = ge(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    i(() => {
      p(), h == null || h.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return fa(o), {
    links: E(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: E(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: E(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: E(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: E(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: E(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: E(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: E(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: E(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Re),
    loadSent: () => s == null ? void 0 : s.more(a.value, Qe)
  };
}
const Eb = ["data-incoming", "data-ref"], Ab = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Ob = { class: "message-body" }, Tb = ["title"], Ib = ["innerHTML"], Bb = ["title"], Rb = ["innerHTML"], Lb = {
  class: "message-faces",
  "data-message-faces": ""
}, Nb = ["title", "data-face", "onClick"], qb = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Db = ["title", "data-reaction", "onClick"], Pb = {
  key: 0,
  class: "message-reaction-count"
}, jb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Fb = ["href", "title"], Wb = ["src", "alt"], Hb = ["href"], zb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Ub = ["disabled", "data-sent-worker", "title", "onClick"], Gb = { class: "message-foot" }, Vb = { class: "message-time" }, Kb = {
  class: "message-id",
  "data-message-id": ""
}, Yb = 1500, Qb = "An earlier message", Xb = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1), o = O(null), l = E(() => ["user", "comment"].includes(n.message.type)), r = E(() => {
      const [te, se] = (n.message.commented_row || ":").split(":"), oe = gt(te);
      return oe ? { ref: `${oe}:${se}`, label: `${Gt(oe).title.toLowerCase()} ${se}` } : null;
    }), i = E(() => n.message.worker_id ?? null), c = E(() => vb(n.message)), f = E(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var te;
      await ((te = navigator.clipboard) == null ? void 0 : te.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Yb);
    }
    const p = $r(), y = E(() => p(n.message.text ?? "")), b = E(() => JSON.parse(n.message.flowchart_edges || "[]")), A = O(!1), S = E(() => ps(n.quote)), x = E(() => p(S.value || Qb));
    function B() {
      const te = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      te ? te.scrollIntoView({ block: "center", behavior: "smooth" }) : De(`messages:${n.message.parent_id}`);
    }
    $b(o, () => `${n.message.text} ${S.value}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, N = (te) => `/api/files/message/${n.message.id}/${encodeURIComponent(te)}`, w = E(() => JSON.parse(n.message.captions || "{}")), H = E(() => (n.message.files ?? []).map((te) => ({ name: te, address: N(te), isImage: W.test(te), title: w.value[te] || te }))), P = E(() => Tr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), q = Me(Ne, null), { links: _, total: T, more: $, loading: g, failure: M, sentTo: C, sentMore: R, sentLoading: U, sentFailure: Z, loadMore: ee, loadSent: pe } = Cb(q, () => l.value && !n.message.local ? n.message.id : null, o), ie = O(!1), we = E(() => Sb(n.message.reactions));
    function ce(te) {
      ie.value = !1, a("react", n.message, te);
    }
    return (te, se) => e.message.peer || e.message.recipient ? (u(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      I(Q0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: se[0] || (se[0] = (oe) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Eb)) : (u(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Ob, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: K(["message-card", "md", { comment: r.value }]),
          onClick: se[5] || (se[5] = (...oe) => L(Nt) && L(Nt)(...oe))
        }, [
          r.value ? (u(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: se[1] || (se[1] = Se((oe) => L(De)(r.value.ref), ["stop"]))
          }, [
            I(re, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(r.value.label), 1)
          ], 8, Tb)) : k("", !0),
          e.message.parent_id ? (u(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: Se(B, ["stop"]),
            innerHTML: x.value
          }, null, 8, Ib)) : k("", !0),
          i.value !== null ? (u(), d("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: se[2] || (se[2] = Se((oe) => L(De)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + v(i.value), 9, Bb)) : k("", !0),
          I(gr, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: j(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Rb)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (u(), d(D, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: se[3] || (se[3] = (oe) => A.value = !0)
            }, "Open the flowchart"),
            A.value ? (u(), F(B0, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: se[4] || (se[4] = (oe) => A.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: K(["message-tools", { picking: ie.value }]),
          "data-message-tools": ""
        }, [
          ie.value ? (u(), d(D, { key: 0 }, [
            m("div", Lb, [
              (u(!0), d(D, null, ne(L(xb), (oe) => (u(), d("button", {
                key: oe,
                type: "button",
                class: "message-face",
                title: `React ${oe}`,
                "data-face": oe,
                onClick: (nt) => ce(oe)
              }, v(oe), 9, Nb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: se[6] || (se[6] = (oe) => ie.value = !1)
            }, [
              I(re, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), d(D, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: se[7] || (se[7] = (oe) => ie.value = !0)
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
            f.value ? (u(), d("button", {
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
      we.value.length ? (u(), d("div", qb, [
        (u(!0), d(D, null, ne(we.value, (oe) => (u(), d("button", {
          key: oe.emoji,
          type: "button",
          class: K(["message-reaction", { mine: oe.mine }]),
          title: oe.title,
          "data-reaction": oe.emoji,
          onClick: (nt) => a("react", e.message, oe.emoji)
        }, [
          V(v(oe.emoji) + " ", 1),
          oe.count > 1 ? (u(), d("span", Pb, v(oe.count), 1)) : k("", !0)
        ], 10, Db))), 128))
      ])) : k("", !0),
      H.value.length ? (u(), d("div", jb, [
        (u(!0), d(D, null, ne(H.value, (oe) => (u(), d(D, {
          key: oe.name
        }, [
          oe.isImage ? (u(), d("a", {
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
            }, null, 8, Wb)
          ], 8, Fb)) : (u(), d("a", {
            key: 1,
            href: oe.address,
            target: "_blank",
            class: "message-file"
          }, v(oe.name), 9, Hb))
        ], 64))), 128))
      ])) : k("", !0),
      L(C).length ? (u(), d("div", zb, [
        I(re, {
          name: "send",
          size: 12
        }),
        (u(!0), d(D, null, ne(L(C), (oe) => (u(), d("button", {
          key: oe.id,
          type: "button",
          class: "message-sent-worker",
          disabled: oe.unavailable || !oe.open_ref,
          "data-sent-worker": oe.id,
          title: `Open worker ${oe.id}`,
          onClick: Se((nt) => oe.open_ref && L(De)(oe.open_ref), ["stop"])
        }, [
          V("Also sent to worker " + v(oe.id), 1),
          oe.unavailable ? (u(), d(D, { key: 0 }, [
            V(" (unavailable)")
          ], 64)) : k("", !0)
        ], 8, Ub))), 128))
      ])) : k("", !0),
      I(vn, {
        more: L(R),
        loading: L(U),
        failure: L(Z),
        label: "More recipients",
        onMore: L(pe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Gb, [
        m("time", Vb, v(P.value), 1),
        Number.isInteger(e.message.id) ? (u(), d(D, { key: 0 }, [
          se[10] || (se[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Kb, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (u(), F(mb, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      L(_).length || L(M) ? (u(), F(ub, {
        key: 3,
        links: L(_),
        total: L(T),
        more: L($),
        loading: L(g),
        failure: L(M),
        onMore: L(ee)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Ab));
  }
}, GS = /* @__PURE__ */ z(Xb, [["__scopeId", "data-v-b42dab37"]]), na = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Da = 200, Yr = (e) => {
  var t;
  return ((t = na.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? na[0].key;
}, VS = (e) => {
  var t;
  return ((t = na.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Jb = ["aria-label"], Zb = 300, Qo = 400, ek = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Da } },
  setup(e) {
    const t = e, n = E(() => Yr(t.value)), a = E(() => n.value < Da ? [1, 0.25, 0.25] : n.value === Da ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), d("svg", {
      class: K(["ico", "prio", { hot: n.value >= Qo, high: n.value >= Zb && n.value < Qo }]),
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
    ], 10, Jb));
  }
}, KS = /* @__PURE__ */ z(ek, [["__scopeId", "data-v-b10e610f"]]), Qr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], YS = (e) => {
  const t = Qr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, tk = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Xo = (e) => tk[e.card.state] || "idle", nk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Jo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Zo = (e, t) => Jo[Xo(e)] - Jo[Xo(t)], el = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, QS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Zo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || nk(a, s)) : [...e].sort((a, s) => Zo(a, s) || (el[t] || el.state)(a, s)), ak = { class: "list-row" }, sk = {
  key: 0,
  class: "list-row-type"
}, ok = { class: "list-row-main" }, lk = {
  key: 0,
  class: "list-row-title"
}, rk = { class: "list-row-body" }, ik = {
  key: 1,
  class: "list-row-end"
}, uk = {
  key: 1,
  class: "list-row-text"
}, ck = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), d("div", ak, [
      e.type ? (u(), d("span", sk, v(e.type), 1)) : k("", !0),
      m("div", ok, [
        e.title ? (u(), d("span", lk, v(e.title), 1)) : k("", !0),
        m("div", rk, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), d("div", ik, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (u(), d("span", uk, v(e.text), 1)) : k("", !0)
    ]));
  }
}, XS = /* @__PURE__ */ z(ck, [["__scopeId", "data-v-dfc8c3a7"]]), JS = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = E(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (u(), F(Nr, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, dk = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), d("div", {
      class: K(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Xr = /* @__PURE__ */ z(dk, [["__scopeId", "data-v-978e0921"]]), fk = ["aria-label"], hk = { class: "head" }, mk = { class: "names" }, pk = { class: "body" }, gk = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = or(a, n), r = lr(s);
    return (i, c) => (u(), F(da, { to: "body" }, [
      I(zt, {
        name: "side",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
          L(s) ? (u(), d("div", {
            key: 0,
            class: K(["veil", { over: e.over, under: e.depth }]),
            style: ye({ "--depth": e.depth, zIndex: L(r) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = Se((...f) => L(o) && L(o)(...f), ["self"]))
          }, [
            m("aside", {
              class: K(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), d(D, { key: 0 }, [
                m("header", hk, [
                  m("div", mk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (u(), F(ot, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0)
                  ]),
                  he(i.$slots, "actions", {}, void 0, !0),
                  I(ma, {
                    title: e.closeLabel,
                    onClick: L(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (u(), F(Xr, { key: 0 }, {
                  default: j(() => [
                    he(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", pk, [
                  he(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : he(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, fk)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ZS = /* @__PURE__ */ z(gk, [["__scopeId", "data-v-f276f055"]]), vk = {
  key: 1,
  class: "text-field-label"
}, yk = {
  key: 2,
  class: "text-field-end"
}, bk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Pt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = on(e, "modelValue"), a = ca(), s = "onUpdate:modelValue" in (((f = Zi()) == null ? void 0 : f.vnode.props) || {}), o = E(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), r = E(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), i = E(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = O(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (u(), d("label", {
      key: 0,
      class: K(["text-field", { large: e.large, ended: h.$slots.end }, L(a).class]),
      style: ye(L(a).style)
    }, [
      e.icon ? (u(), F(re, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (u(), d("span", vk, v(e.label), 1)) : k("", !0),
      Je(m("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [L(ds), o.value]
      ]),
      h.$slots.end ? (u(), d("span", yk, [
        he(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : Je((u(), d("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [L(ds), o.value]
    ]);
  }
}), e6 = /* @__PURE__ */ z(bk, [["__scopeId", "data-v-d9c38ca8"]]), kk = { class: "title" }, wk = { class: "state" }, $k = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = os(t.line, t.events);
    return (o, l) => (u(), F(Zy, {
      rows: L(n),
      failure: L(a),
      loaded: L(s),
      empty: e.empty
    }, {
      default: j(({ row: r }) => [
        m("span", kk, v(r.title), 1),
        m("span", wk, v(L(rn)(e.term, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, t6 = /* @__PURE__ */ z($k, [["__scopeId", "data-v-6be0c59e"]]);
function xk(e = 1e3, t = null) {
  const n = O(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ge(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const Pa = O(Date.now() / 1e3);
let tl = 0, Ln = 0;
function Js() {
  return Ln || (Pa.value = Date.now() / 1e3, tl = setInterval(() => Pa.value = Date.now() / 1e3, 1e3)), Ln += 1, Bl() && fa(() => {
    Ln -= 1, Ln || clearInterval(tl);
  }), Pa;
}
const Sk = 200, Mk = Gr + Hn + Vr + Sk, _k = 300, Nn = /* @__PURE__ */ new WeakMap();
function Ck(e, t) {
  const n = Nn.get(e) ?? [];
  Nn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Nn.get(e);
    Nn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, _k);
}
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Ek(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Yt(e),
    top: Yt(e.querySelector(".top")),
    title: Yt(e.querySelector(".title")),
    contents: Yt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, c;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((c = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: c, display: f }))(getComputedStyle(e)),
    parent: Yt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Ak(e, t, n, a) {
  ge(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Ek(o, l, n.value)), performance.now() - l < Mk) return void requestAnimationFrame(i);
        Ck(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r });
      }
    }
    i();
  }, { flush: "sync" });
}
const Ok = ["title", "data-figure-mark", "data-folded", "data-open"], Tk = {
  key: 2,
  class: "worker"
}, Ik = { class: "head" }, Bk = { key: 0 }, Rk = {
  key: 3,
  class: "status"
}, Lk = {
  key: 0,
  class: "figure"
}, Nk = {
  class: "figure-decimal",
  "data-figure-decimal": ""
}, qk = {
  key: 1,
  class: "ran-for"
}, Dk = { key: 2 }, Pk = {
  key: 3,
  class: "news"
}, jk = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Fk = {
  key: 6,
  class: "settled"
}, Wk = {
  key: 1,
  class: "bar"
}, Hk = {
  key: 3,
  class: "detail body"
}, zk = {
  key: 0,
  class: "body-label"
}, Uk = ["title"], Gk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ca(), a = ["onClick", "onAct"], s = E(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = O(!1), l = E(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = E(() => t.open !== void 0), i = E(() => r.value || l.value), c = E(() => r.value ? t.open : o.value), f = E(() => r.value ? !t.open : l.value && !o.value), h = E(() => !!(t.mark.action && n.onAct)), p = E(() => i.value || h.value || !!n.onClick), y = O(null), b = O(null), { folded: A, phase: S } = Kr(y, () => f.value);
    Ak(y, f, S, Me(Ne, null));
    function x(ie) {
      var we, ce;
      if (!(ie.target !== y.value && !b.value.contains(ie.target))) {
        if (r.value) return (we = n.onClick) == null ? void 0 : we.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (ce = n.onAct || n.onClick) == null || ce(ie);
      }
    }
    const B = (ie) => n.onAct(ie), W = ["failed", "unfinished"], N = E(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), w = E(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), H = E(() => w.value || "var(--tone-work)"), P = E(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), q = Js(), _ = E(
      () => t.mark.began_at && P.value && !t.mark.figure && !t.mark.counting ? Ir(q.value - t.mark.began_at) : ""
    ), T = E(() => {
      const { started: ie, ended: we } = t.mark;
      return ie ? we ? `ran ${Ho(we - ie, !0)}` : Ho(q.value - ie, !0) : _.value;
    }), $ = ["bad", "danger", "warn"], g = E(() => $.includes(N.value) || t.mark.asks ? "attention" : P.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], C = E(() => M.includes(N.value)), R = E(() => g.value === "process" ? "running" : C.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), U = E(
      () => !!(t.mark.figure || T.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), Z = E(() => /^(\d+)(\.\d+)(.*)$/.exec(t.mark.figure ?? "")), ee = E(() => [t.mark.title, t.mark.time ? Tr(t.mark.time) : ""].filter(Boolean).join(" · ")), pe = E(() => ({
      ...w.value ? { "--mark": w.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, we) => (u(), d("div", Pe(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        L(S),
        {
          open: c.value,
          folding: r.value && f.value,
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
      "data-folded": L(A) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: x
    }), [
      (u(), F(ut(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!c.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (u(), F(Et, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), F(re, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), d("span", Tk, v(e.mark.worker), 1)) : k("", !0),
          m("span", Ik, [
            I(ot, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), d("strong", Bk, v(e.mark.name), 1)) : k("", !0),
            i.value ? (u(), F(Vt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          U.value ? (u(), d("span", Rk, [
            e.mark.figure ? (u(), d("span", Lk, [
              Z.value ? (u(), d(D, { key: 0 }, [
                V(v(Z.value[1]), 1),
                m("span", Nk, v(Z.value[2]), 1),
                V(v(Z.value[3]), 1)
              ], 64)) : (u(), d(D, { key: 1 }, [
                V(v(e.mark.figure), 1)
              ], 64))
            ])) : k("", !0),
            T.value ? (u(), d("span", qk, v(T.value), 1)) : k("", !0),
            e.mark.stopping ? (u(), d("span", Dk, "Stopping")) : k("", !0),
            e.mark.news ? (u(), d("span", Pk, v(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (u(), d("span", jk)) : R.value ? (u(), F(Et, {
              key: 5,
              class: K(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (u(), d("span", Fk, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), F(Ur, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: Se(B, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && P.value ? (u(), d("span", Wk, [
        m("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: H.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !L(A) ? (u(), F(ot, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !L(A) ? (u(), d("div", Hk, [
        e.mark.bodyLabel ? (u(), d("p", zk, v(e.mark.bodyLabel), 1)) : k("", !0),
        I(ot, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !L(A) ? (u(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Uk)) : k("", !0),
      e.mark.card ? (u(), F(ot, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      he(ie.$slots, "default", {
        shown: !L(A)
      }, void 0, !0)
    ], 16, Ok));
  }
}), Jr = /* @__PURE__ */ z(Gk, [["__scopeId", "data-v-1525b8df"]]), Vk = 8, Kk = 40, Yk = [];
class Zs {
  constructor(t, n, { top: a = Vk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Yk.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Zs(t, {
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
    n > Kk && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Qk = 60, Xk = 300, Zr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function ei(e, t) {
  const n = O([]), a = O(0);
  let s = -1, o = 0;
  async function l() {
    const h = await e(["output", "page", String(t())]);
    return h.ok && (n.value = h.value.lines, a.value = h.value.first_byte, s = h.value.last_byte, o = h.value.cut_bytes), h;
  }
  async function r() {
    if (s < 0) return l();
    const h = await e(["output", "page", String(t()), "--after", String(s)]);
    return h.ok ? h.value.cut_bytes !== o || h.value.total < s ? l() : (h.value.lines.length && (n.value = [...n.value, ...h.value.lines]), s = h.value.last_byte, h) : h;
  }
  async function i() {
    const h = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return h.ok ? (n.value = [...h.value.lines, ...n.value], a.value = h.value.first_byte, !0) : !1;
  }
  const c = new Zs("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Xk, more: () => a.value > 0, previous: i }, { top: Qk });
  return { lines: n, newest: l, follow: r, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Jk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function ti(e) {
  var n;
  const t = Jk[e] || ((n = Gt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Zk = (e) => ti(String(e).split(":")[0]), ew = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), tw = { passed: "good", failed: "danger", warned: "warn", running: "" }, nw = { good: "good", warn: "warn", danger: "danger" }, nl = {
  "open row": (e) => De(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Rf(e.target_model, e.target_id || 0)
}, aw = { "open row": (e) => Zk(e.target_model), "open page": () => ti("pages") };
function sw(e, t) {
  const n = t || {}, a = nl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? tw[e.outcome] || "" : nw[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? aw[a](e) : "",
    handlers: a ? { onAct: () => nl[a](e) } : {}
  };
}
const ow = 24, lw = 1e3, al = 2e3, rw = 0.25, iw = 5e3;
function uw(e, t = ow, n = () => !0) {
  const a = O(!1), s = O(0), o = O(!1);
  let l = 0, r = 0, i = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const N = c();
    return N ? N.scrollHeight - N.scrollTop - N.clientHeight : 0;
  }, h = () => !c() || f() <= t;
  function p(N) {
    if (clearTimeout(l), !N) {
      o.value = !1, i = Date.now();
      return;
    }
    const w = Date.now() - i < al ? al : lw;
    l = setTimeout(() => o.value = a.value, w);
  }
  function y() {
    clearTimeout(r), a.value = !1, s.value = 0, p(!1);
  }
  function b(N = !1) {
    const w = c();
    w && N && w.scrollTo ? w.scrollTo({ top: w.scrollHeight, behavior: "smooth" }) : w && (w.scrollTop = w.scrollHeight), y();
  }
  function A() {
    x(), !a.value && (a.value = !0, p(!0));
  }
  const S = () => !!c() && f() <= c().clientHeight * rw;
  function x() {
    clearTimeout(r), S() && (r = setTimeout(() => a.value && S() && n() && b(!0), iw));
  }
  function B() {
    h() ? y() : A();
  }
  function W(N = 1, w = !1) {
    a.value ? s.value += Math.max(0, N) : b(w);
  }
  return Bl() && fa(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: b, left: A, scrolled: B, arrived: W };
}
const cw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, dw = (e) => String(e ?? "").replace(cw, ""), fw = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(null), { away: o, scrolled: l, arrived: r, toBottom: i } = uw(s);
    ge(
      () => n.lines.length,
      () => je(() => {
        var f;
        r(), s.value && ((f = n.feed) == null || f.drawn(s.value));
      }),
      { immediate: !0 }
    );
    function c(f) {
      l(), a("older", f.target);
    }
    return (f, h) => (u(), d("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      V(v(L(dw)(e.lines.join(`
`)) || e.empty), 1),
      L(o) ? (u(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => L(i)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, hw = /* @__PURE__ */ z(fw, [["__scopeId", "data-v-5a8693fe"]]), mw = "*.*", pw = {
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
    const t = e, n = Me(Ne, null), a = new Ul();
    ge(
      () => a.patterns,
      (i, c, f) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, i, (y) => a.dispatch(y));
        f(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = E(() => !!(t.declaration.shipped || t.declaration.trusted)), r = E(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [mw] : t.declaration.events ?? [],
      options: []
    }));
    return (i, c) => l.value ? (u(), F(Wr, {
      key: 0,
      entry: r.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), F(Fr, {
      key: 1,
      entry: r.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, gw = { class: "mark-more-inner" }, vw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, yw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, bw = {
  key: 3,
  class: "mark-lines"
}, kw = "process", sl = "task", ww = {
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
    const t = e, n = tt(), a = E(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = E(() => ew.has(t.mark.variant) && t.mark.detail || ""), o = E(() => t.mark.target_model === sl ? t.mark.target_id : 0), l = ei(
      Zr(n),
      () => t.mark.target_id
    ), r = l.lines, i = O(!1), c = O(""), f = E(() => !t.declaration.body_url && t.mark.target_model === kw && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      i.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = E(() => t.shown && f.value);
    return ge(p, (y) => y && h()), Bs(() => p.value && h(), () => p.value && !t.mark.ended_at), ge(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, b) => (u(), d("div", {
      class: K(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = Se(() => {
      }, ["stop"]))
    }, [
      m("div", gw, [
        e.declaration.body_url ? (u(), F(pw, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (u(), d(D, { key: 1 }, [
          s.value ? (u(), d(D, { key: 0 }, [
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", vw, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (u(), d("p", yw, v(c.value), 1)) : f.value && i.value ? (u(), d(D, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            I(hw, {
              class: "mark-terminal",
              lines: L(r),
              feed: L(l).feed,
              onOlder: L(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), d("p", bw, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (u(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = Se((A) => L(De)(`${sl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ks = /* @__PURE__ */ z(ww, [["__scopeId", "data-v-df71b15a"]]), $w = ["title", "aria-label", "onClick"], xw = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Sw = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = E(() => of(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = O(""), s = Me(Ne);
    async function o(l) {
      const r = await yn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (u(), d(D, null, [
      (u(!0), d(D, null, ne(n.value, (i) => (u(), d("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: Se((c) => o(i), ["stop"])
      }, [
        I(Et, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, $w))), 128)),
      a.value ? (u(), d("span", xw, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, Mw = /* @__PURE__ */ z(Sw, [["__scopeId", "data-v-7a62c88e"]]);
function ni(e, t) {
  const n = Xe(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ee.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const ai = ni("/api/marks", "marks"), n6 = ai.fetchAll, _w = ai.find, Cw = ["data-ref"], Ew = ["data-ref"], Aw = { class: "mark-row" }, Ow = "dock add", Tw = "questions.answer", Iw = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = E(() => _w(a.mark.type)), o = E(() => sw(a.mark, s.value)), l = E(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), r = E(() => l.value || !!o.value.handlers.onAct), i = E(() => a.mark.type === Tw), c = O(!1);
    function f() {
      c.value = !c.value;
    }
    const h = E(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(Ow));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var b, A;
      return (b = s.value) != null && b.card ? (u(), d("div", {
        key: 0,
        class: K(["thread-turn", "card", "whole-card", { "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        I(ks, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Cw)) : (u(), d("div", {
        key: 1,
        class: K(["thread-turn", "card", { "full-width": (A = s.value) == null ? void 0 : A.full_width, docked: e.docked, "user-side": L(n).has(e.mark.variant), "answer-bubble": i.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Aw, [
          I(Jr, {
            mark: o.value,
            open: r.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, eu({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: S }) => [
                I(ks, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: S
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          I(Mw, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Ew));
    };
  }
}, Bw = /* @__PURE__ */ z(Iw, [["__scopeId", "data-v-424ddb61"]]), Rw = ["data-ref"], Lw = ["inert"], Nw = { class: "group-fold" }, qw = { class: "thread-group" }, Dw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = O(!1), a = O(!1), s = O(!1), o = O(null);
    ge(n, async (r) => {
      var i;
      a.value = !0, await je(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = E(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (u(), d("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      I(Jr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: K(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", Nw, [
          m("div", qw, [
            (u(!0), d(D, null, ne(e.group.marks, (c) => (u(), F(Bw, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Lw)) : k("", !0)
    ], 8, Rw));
  }
}, a6 = /* @__PURE__ */ z(Dw, [["__scopeId", "data-v-45b58b9b"]]);
function Pw(e) {
  const t = O(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), et(() => n.disconnect()), t;
}
const jw = { class: "chat-dock-fold" }, Fw = ["aria-label"], Ww = { class: "chat-dock-head" }, Hw = { class: "chat-dock-inner" }, zw = { class: "chat-dock-foot" }, si = 700, Uw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = O(null), a = O(null), s = Pw(a), o = O(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, si)), et(() => clearTimeout(l)), t({ card: n }), (r, i) => (u(), d("div", {
      class: K(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", jw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: K(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          he(r.$slots, "edge", {}, void 0, !0),
          m("header", Ww, [
            he(r.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: K(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", Hw, [
              m("div", {
                class: K(["chat-dock-grow", { settled: o.value }]),
                style: ye(L(s) === null ? null : { height: `${L(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  he(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          he(r.$slots, "still", {}, void 0, !0),
          m("footer", zw, [
            he(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Fw)
      ])
    ], 2));
  }
}, Gw = /* @__PURE__ */ z(Uw, [["__scopeId", "data-v-574cba3d"]]), Vw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ja = 5, Kw = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ja, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ja}s`, animationDelay: `${(n - ja).toFixed(2)}s` };
    return (s, o) => (u(), d("span", Vw, [
      m("i", { style: a })
    ]));
  }
}, Yw = /* @__PURE__ */ z(Kw, [["__scopeId", "data-v-2a7bc150"]]), Qw = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), ws = (e) => e.charAt(0).toUpperCase() + e.slice(1), Xw = (e) => ws(e.replace(/_at$/, "").replaceAll("_", " ")), Jw = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Zw = (e, t, n) => [ws(`${e} ${n}`), (t == null ? void 0 : t.state) && ws(t.state)].filter(Boolean).join(" · "), oi = (e) => e.given_name || `${Qn(e.role)} ${e.id}`, e2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? oi(t) : (e == null ? void 0 : e.name) ?? "", t2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? oi(t) : "", n2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Qw.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Xw(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], a2 = { reviewing: "Under review" }, s2 = (e, t) => e || a2[t == null ? void 0 : t.state] || "", li = ni("/api/docks", "docks"), s6 = li.fetchAll, Rt = li.find, o2 = 6, Fa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, eo = (e) => Date.parse(e.leaves_at) / 1e3, Xt = (e) => !!(e.leaves_at && !e.kept), l2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Xt(e) || t < eo(e) || n.has(e.id)), r2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => l2(a, t, n)).sort((a, s) => a.id - s.id);
function i2(e, t, n = o2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(eo(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const u2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), $s = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), c2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), d2 = (e) => ({ ...e.kept ? $s("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : $s("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), f2 = ["keep", "unkeep", "open", "undock"], h2 = (e) => ({ ...e, iconOnly: f2.includes(e.action) });
function m2(e, t) {
  var n;
  return [
    ...c2(e, t) ? [d2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Gt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    $s("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(h2);
}
function ri(e, t) {
  const n = m2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: u2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const p2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || ri(e, t).title, g2 = { class: "dock-text" }, v2 = ["title"], y2 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, b2 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, k2 = {
  key: 1,
  "data-dock-row": ""
}, w2 = { class: "dock-acts" }, $2 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = E(() => Rt(a.item.type)), o = Js(), l = E(() => Ks(a.item.created_at, o.value * 1e3)), r = O(null), i = O(null), c = O(null), f = O(null), h = E(() => ri(a.item, s.value)), p = tt(), y = E(() => `dock.${a.item.id}`), b = E(() => p.props[y.value].data.value), A = E(() => p2(a.item, s.value, b.value)), S = E(() => ea(a.item.target_model ?? "")), x = E(() => {
      var $;
      return (($ = s.value) == null ? void 0 : $.word) ?? "";
    }), B = E(() => ({ ...b.value, id: a.item.target_id, term: S.value })), W = () => {
      var $, g;
      return ((g = ($ = s.value) == null ? void 0 : $.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    $c(Il, { data: b, reload: W, readOutput: Zr(p) }), ge(
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
    const N = O(/* @__PURE__ */ new Set()), w = O("");
    async function H($) {
      if ($.action === "undock") return n("undock", $);
      if ($.action === "open") return De(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (N.value = /* @__PURE__ */ new Set([...N.value, $.label])), w.value = "";
      const M = await yn($, { id: a.item.target_id }, p.environment);
      (M == null ? void 0 : M.ok) === !1 && (N.value = new Set([...N.value].filter((C) => C !== $.label)), w.value = `Could not ${$.label.toLowerCase()}: ${M.error}`);
    }
    const P = E(() => h.value.actions.filter(($) => !N.value.has($.label))), q = E(() => {
      var $;
      return s2(($ = s.value) == null ? void 0 : $.badge, B.value);
    }), _ = E(() => h.value.controls), T = E(() => {
      var $;
      return !!(($ = s.value) != null && $.draws_head) && !a.collapsed;
    });
    return ($, g) => {
      var M, C, R, U;
      return u(), F(Gw, {
        label: h.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        type: (C = s.value) != null && C.needs_user ? "waiting" : "",
        folded: !!((R = s.value) != null && R.folds) && e.folded,
        body: !!((U = s.value) != null && U.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[3] || (g[3] = (Z) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (u(), F(Yw, {
            key: 0,
            "ends-at": L(eo)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: j(() => {
          var Z;
          return [
            T.value ? (u(), d("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), d(D, { key: 1 }, [
              I(re, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", g2, [
                m("span", {
                  class: K(["dock-title", { strip: e.collapsed }]),
                  title: A.value
                }, v(A.value), 11, v2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Z = s.value) != null && Z.leaves_after_seconds ? k("", !0) : (u(), d(D, { key: 0 }, [
                V(v(l.value), 1)
              ], 64))
            ], 512),
            _.value.length ? (u(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = Se(() => {
              }, ["stop"]))
            }, [
              (u(!0), d(D, null, ne(_.value, (ee) => {
                var pe, ie;
                return u(), d(D, {
                  key: ee.action + ee.runs
                }, [
                  !N.value.has(ee.label) && (!((pe = ee.variants) != null && pe.length) || !((ie = B.value) != null && ie.state) || ee.variants.includes(B.value.state)) ? (u(), F(ve, {
                    key: 0,
                    variant: "icon",
                    class: K({ kept: ee.pressed }),
                    "aria-pressed": ee.pressed,
                    "aria-label": ee.label,
                    title: ee.label,
                    "data-dock-action": ee.action,
                    onClick: (we) => H(ee)
                  }, {
                    default: j(() => [
                      I(re, {
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
          w.value || e.refusal ? (u(), d("p", y2, v(w.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: j(() => {
          var Z;
          return [
            m("span", b2, [
              q.value ? (u(), d("span", {
                key: 0,
                class: K(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : k("", !0),
              x.value ? (u(), d("span", k2, v(x.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (Z = s.value) != null && Z.folds ? (u(), F(ve, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (ee) => n("fold"))
            }, {
              default: j(() => [
                V(v(s.value.folds) + " ", 1),
                I(Vt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            m("span", w2, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              I(Ws, {
                name: `dock.${e.item.type}`,
                row: B.value,
                environment: L(p).environment,
                "read-only": L(p).readOnly,
                "object-name": L(ea)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (ee) => w.value = ee),
                onDone: $.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), d(D, null, ne(P.value, (ee) => (u(), F(ve, {
                key: ee.action + ee.runs,
                small: "",
                variant: ee.primary ? "primary" : "ghost",
                bordered: !ee.primary,
                "data-dock-action": ee.action,
                onClick: (pe) => H(ee)
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
            (Z = s.value) != null && Z.body_url ? (u(), F(ks, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
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
}, ol = /* @__PURE__ */ z($2, [["__scopeId", "data-v-c4a0c2b2"]]), x2 = 24, S2 = 8, o6 = 420;
function l6({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= x2 ? !0 : e < t && s > S2 ? !1 : null;
}
const M2 = (e, t) => e === void 0 ? t : e, _2 = { me: 1, people: [] }, aa = Ht({
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
  people: _2,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Xn("journal.activity", !0),
  wide: !1,
  sideMini: Xn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
hr("journal.activity", () => aa.activity);
hr("journal.side.mini", () => aa.sideMini);
const ii = "journal.viewer.";
function C2(e, t, n) {
  try {
    const a = n.getItem(ii + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function E2(e, t, n) {
  try {
    n.setItem(ii + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function ll(e, t, n = window.localStorage) {
  const a = O(C2(e, t, n));
  return ge(a, (s) => E2(e, s, n), { deep: !0 }), a;
}
const A2 = {
  key: "dock-all",
  class: "dock-all"
}, O2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var $, g;
    const t = e, n = xk(500), a = O(/* @__PURE__ */ new Set()), s = Me(Ne), o = O(/* @__PURE__ */ new Set()), l = O({});
    async function r(M, C) {
      l.value = { ...l.value, [M.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, M.id]);
      const R = await yn(C, { id: M.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((U) => U !== M.id)), l.value = { ...l.value, [M.id]: `Could not dismiss this card: ${R.error}` });
    }
    const i = E(
      () => r2(
        t.items.filter((M) => !o.value.has(M.id)),
        n.value,
        a.value
      )
    ), c = E(
      () => i2(
        i.value.filter((M) => Fa(M, Rt)),
        n.value
      )
    ), f = E(() => i.value.filter((M) => !c.value.includes(M) && !Fa(M, Rt))), h = ll(`dock-size:${(($ = aa.identity) == null ? void 0 : $.root) || location.host}`, null), p = (M) => {
      var C;
      return !!((C = Rt(M.type)) != null && C.needs_user);
    }, y = O(/* @__PURE__ */ new Set()), b = O(/* @__PURE__ */ new Set()), A = E(() => i.value.length === 1), S = (M) => p(M) || A.value, x = (M) => S(M) ? y.value.has(M.id) || b.value.has(M.id) : h.value ? h.value.collapsed && !h.value.opened.includes(M.id) : t.collapsed, B = E(() => i.value.some(x));
    ge(() => t.collapsed, (M) => {
      b.value = new Set(M ? i.value.filter(p).map((C) => C.id) : []);
    });
    function W() {
      const M = !B.value;
      h.value = { collapsed: M, opened: [] }, y.value = new Set(M ? i.value.filter(p).map((C) => C.id) : []), b.value = /* @__PURE__ */ new Set();
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
    const w = ll(`dock-folded:${((g = aa.identity) == null ? void 0 : g.root) || location.host}`, {}), H = (M) => {
      var C;
      return !!((C = Rt(M.type)) != null && C.folds) && (t.insidesFolded || M2(w.value[M.id], Fa(M, Rt) || t.folded));
    };
    function P(M) {
      H(M) && q(M), w.value = { ...w.value, [M.id]: !H(M) };
    }
    function q(M) {
      var C;
      !((C = h.value) != null && C.collapsed) || h.value.opened.includes(M.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, M.id] });
    }
    function _(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function T(M) {
      a.value = new Set([...a.value].filter((C) => C !== M.id));
    }
    return (M, C) => (u(), F(Ts, {
      tag: "div",
      name: "dock",
      duration: L(si),
      class: "dock-stack"
    }, {
      default: j(() => [
        i.value.length > 1 ? (u(), d("div", A2, [
          I(ve, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": B.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: j(() => [
              I(Vt, {
                open: !B.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (u(!0), d(D, null, ne(f.value, (R) => (u(), F(ol, {
          key: R.id,
          item: R,
          class: K({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: H(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (U) => N(R),
          onFold: (U) => P(R),
          onUndock: (U) => r(R, U),
          onMouseenter: (U) => _(R),
          onMouseleave: (U) => T(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (u(!0), d(D, null, ne(c.value, (R) => (u(), F(ol, {
          key: R.id,
          item: R,
          class: K({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: H(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (U) => N(R),
          onFold: (U) => P(R),
          onUndock: (U) => r(R, U),
          onMouseenter: (U) => _(R),
          onMouseleave: (U) => T(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, r6 = /* @__PURE__ */ z(O2, [["__scopeId", "data-v-2c47a65e"]]), St = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, zn = (e) => Math.min(Math.max(e, 0), 1), T2 = (e) => {
  const t = zn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => T2((e - t) / (n - t));
function i6(e) {
  const t = zn(e), n = zn((t - 0.12) / 0.76) * St.shuffles, a = Math.min(Math.floor(n), St.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), r = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), i = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * zn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / St.shuffles, lift: St.lift * o, ready: r, weight: i, follow: c, shuffle: a, phase: s };
}
function u6(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const rl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, c6 = (e) => rl[e] ?? rl.butler, to = 2400, I2 = 0.05;
function B2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, I2), l = Math.min(t + to * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function d6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function R2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function f6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const h6 = (e, t) => ({ ...e, stretch: t.stretch }), m6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, ui = (e, t) => t >= (e.least ?? 0);
function p6(e, t, n) {
  if (!ui(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const g6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), L2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", il = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), N2 = (e) => e.right > e.left && e.bottom > e.top;
function v6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(L2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = il(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = il(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), N2(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function ci(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [f, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[p]) && (r = -1);
      else {
        const b = (o[h] - e[f]) / y, A = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(b, A)), r = Math.min(r, Math.max(b, A));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: c, on: "surface", surface: s.id, dx: i - s.left, dy: c - s.top };
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
}, dn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), q2 = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => q2(dn(e, t, n)), D2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], pt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, qn = ([e, t], n) => e + n() * (t - e);
function P2(e) {
  return D2.map(() => {
    const t = qn(pt.speed, e), n = qn(pt.angle, e) * Math.PI / 180, a = qn(pt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [qn(pt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const j2 = P2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function F2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * pt.gravity * (t[2] - pt.floor))) / pt.gravity;
}
function y6(e, t, n = j2) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = F2(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * i);
  return c[2] -= pt.gravity * i * i / 2, { at: c, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const b6 = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function k6(e, t) {
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
const w6 = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function $6(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, r] = [t.left + Dt.margin * n, t.right - Dt.margin * n], i = Math.min(Math.max(e + o + s * Dt.reach * n, l), r), c = i - o - e, f = i - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [i - t.left, f - t.left] };
}
function x6(e, t, n) {
  const a = Oe.bug_smash, s = Te(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Dt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Dt.tall * n * (1 - Te(t, a.emerge)),
      turn: 90 * (1 - Te(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Te(t, a.gone)
    }
  };
}
function S6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = B2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const qe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function M6(e) {
  const t = qe.least + Math.floor(e() * (qe.most - qe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: qe.walls[Math.floor(e() * qe.walls.length)],
    along: qe.margin + e() * (1 - 2 * qe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function xs(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * qe.margin, l = ((e.along - qe.margin + e.way * qe.speed * n / a) / s % 2 + 2) % 2, r = qe.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + qe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + qe.inset : t.right - qe.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function W2(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = R2(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: c };
}
function _6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: r, shot: i } = W2(n, e.length), c = e.map((x, B) => ({ ...xs(x, t, Math.min(n / o.fps, Un(B).shot)), shot: B < i })), f = Te(l / o.frames, o.aim), [h, p] = [c[Math.max(r - 1, 0)], c[r]], y = e.map((x, B) => ({ bug: x, index: B, seconds: n / o.fps - Un(B).shot, spot: xs(x, t, Un(B).shot) })).filter((x) => x.seconds >= 0), b = y.flatMap((x) => {
    const B = (s == null ? void 0 : s.get(x.index)) ?? V2(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, B), s && K2(B, x.seconds, a), Y2(B, x.seconds, a);
  }), A = y.filter((x) => U2(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), S = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - f) + +(e[r].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * f, y: h.y + (p.y - h.y) * f, back: S }, slush: b, camera: A };
}
function Un(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function C6(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((c, f) => {
    const h = Un(f), p = xs(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - p.x), A = Math.abs(p.x - i) >= y ? i : p.x + b * y, S = b > 0 ? Math.max(i, Math.min(A, r)) : Math.min(i, Math.max(A, l)), x = { from: i, to: S, begin: h.walk, end: h.aim };
    return i = S, x;
  });
}
function E6(e, t, n) {
  var o;
  const a = Oe.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Te(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, H2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function z2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const U2 = (e) => e.along * 97 % 1 < Ce.camera, fn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function G2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let r = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), h = fn(e, f), p = ci(r, h, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    r = h;
  }
  const i = fn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function V2(e, t, n, a = []) {
  const s = z2(e.along + 1), [o, l] = H2[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const i = r + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * c, vy: Math.sin(i) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...G2(f, t, a) };
  });
}
function K2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), r = ci(fn(a, o), fn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function Y2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...fn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ce.hold) / Ce.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function A6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = Oe.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * r / i, f = (o[1] - o[0]) * r / i, h = Te(e, [0, c]), p = Te(e, [c, c + f]);
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
function O6(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], h = (A) => {
    const [S, x] = [A.x - e.at.x, A.y - e.at.y];
    return { x: r.x + S * c - x * f, y: r.y + S * f + x * c };
  }, [p, y] = [...n].sort((A, S) => A.x - S.x), b = e.ends.map(h);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: b.map((A, S) => ({ from: A, to: S < b.length / 2 ? p : y })) };
}
const T6 = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function sa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: dn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: dn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function I6(e, t) {
  const n = Oe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = sa(n, t), l = 1 - (1 - n.small) * Te(a, n.shrinks) * (1 - Te(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = sa(n, t), o = n.flat * Te(a, n.squashes) * (1 - Te(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * dn(s, ...n.springs)) * (1 - dn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const B6 = (e) => e === "pack_box";
function R6(e) {
  const { into: t, out: n } = sa(Oe.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function L6(e) {
  const t = Oe.rope_swing, { into: n, out: a } = sa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Q2 = { after: 3 }, no = 10, X2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, J2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Z2 = { weight: 19 }, di = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, e5 = { every: 120 }, fi = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, hi = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, t5 = {
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
}, wn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: no }), le = (e, t, n = {}) => wn(e, "clip", t, n), Wa = (e, t, n = {}) => wn(e, "look", t, n), ul = (e, t, n = {}) => wn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...wn(e, "pick", t, n), ...a }), $e = (e) => wn("nothing", "nothing", e, {}), n5 = 120, a5 = 300, Ha = (e, t) => ({ ...le(e, t), cooldown: a5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), s5 = () => [le("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...le(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: X2[e.name] }), Qt = (e) => ({ ...e, shenanigan: !0, lasts: J2[e.name] }), ya = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [le("nod", 2), $e(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(le("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(le("bug_smash", 2)), toward: "", onto: !1 },
    le("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [le("startled", 2), le("dismay", 1), le("tantrum", 3), $e(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [le("nod", 2), $e(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [le("halo", 1), $e(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [le("repent", 1), $e(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [le("nod", 4), le("hand_rub", 4), $e(7)]),
  ...fe("question_asked", { cooldown: 60 }, [le("ask_sign", 9), le("look_up", 3), $e(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [ul("read", 3), le("nod", 1), $e(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [ul("read", 3), $e(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [le("file_card", 3), le("nod", 1), $e(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [le("nod", 2), $e(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, s5()),
  ...fe("bar_failed", { holds: !0 }, [le("fume", 1), le("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [le("look_left", 2), le("look_right", 2), le("look_up", 1), $e(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [le("tumble", 3), $e(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [le("wipe_brow", 4), le("look_left", 1), le("look_right", 1), $e(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [le("shake", 3), le("tantrum", 2), $e(2)]),
  ...fe("refused", { cooldown: 20 }, [le("shake", 1), $e(1)]),
  ...fe("work_done", { cooldown: 120 }, [le("stretch", 2), $e(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [Wa("amused", 3), $e(2)]),
  ...fe("heard", { cooldown: 30 }, [
    le("bow", 1, { voices: ["butler"] }),
    le("salute", 1, { voices: ["squire"] }),
    le("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    $e(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [le("stumble", 3), $e(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [le("glance", 7), $e(13)]),
  ...fe("typing", { cooldown: 60 }, [Wa("reading", 1), $e(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(t5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Wa(t, 1)])),
  ...Object.entries(fi).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [le(a, 1, { voices: [e] })])[0])),
  ...Object.entries(hi).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [le(t, 1)])),
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
    { ...Qt($t(le("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Qt($t(le("disco", 2, { ball: "bubble" }))),
    $e(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: n5 }, [Ha("search", 3), { ...Ha("binoculars", 2), when: { home: !0 } }, { ...Ha("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [le("type", 3), le("type_ponder", 1)]),
  ...fe("held:compacting", {}, [le("pack_box", 3), le("vacuum", 2), le("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), $e(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...$t(le("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [le("eager", 2, { slow: !0 }), $e(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [Qt($t(le("backflip", 7, { high: !0 }))), le("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: di.build.cooldown }, [be("unit", Z2.weight), $e(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [le("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: e5.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    be("rest", 35, {}, { stay: [25, 60] }),
    be("seat", 15, {}, { stay: [15, 40] }),
    be("edge", 25, {}, { stay: [8, 20] }),
    Qt(be("bubble", 15, {}, { stay: [30, 80] })),
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
    Qt($t(be("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], mi = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), pi = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), o5 = (e) => Array.isArray(e) ? e[0] : e, l5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, r5 = (e) => ya.some((t) => t.when.moment === e);
function i5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || pi(f).every(([h, p]) => n(h) >= o5(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = ya.filter((f) => mi(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), r = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= Q2.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, i = r.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return i.some((f) => f.type !== "nothing") ? i : r;
}
function Ve(e, t) {
  const n = i5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (gi(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function gi(e, t, n) {
  var a;
  for (const [s, o] of pi(t)) (a = e.memory) == null || a.set(s, e.now + l5(o, n));
}
function N6(e, t, n) {
  gi(e, ya.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const q6 = (e) => Object.values(di).find((t) => mi(t.when, e)) ?? null, u5 = (e, t, n) => n - t <= (e.lifetime ?? no), D6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || ui(e.clip, t));
class vi {
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
const Ss = {
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
}, P6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), yi = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), j6 = {
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
}, F6 = 120, c5 = 20, W6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < c5), d5 = (e) => Ss[e] || Ss.idle, H6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, bi = "airborne", f5 = "landing", h5 = "travelling", ki = "grounded", z6 = ({ airborne: e, landing: t, trip: n }) => e ? bi : t ? f5 : n != null && n.started ? h5 : ki;
function U6(e, t) {
  var s;
  const n = m5(e, t);
  return e.mode === ki && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function m5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: c, doing: f, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === bi && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...p5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && r.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, r.posture) ? f : d5(c), facing: y ? p : r.posture === "sit" ? r.face : h };
}
function p5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Ms = (e) => e.outcome, g5 = /^plugin:[^:]+:sins:/, cl = (e) => e.type === "plugins.card" && g5.test(e.markKey), v5 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => cl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => cl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], G6 = (e, t) => e.filter((n) => n.author === "user" && ta(n.read_at) > t).map((n) => ({ beat: "read_message", time: ta(n.read_at), card: Mr(n) })).sort((n, a) => n.time - a.time), dl = { user: "reacted", agent: "agent_reacted" };
function V6(e, t) {
  return e.filter((n) => dl[n.author] && Ct(n) > t).map((n) => ({ beat: `${dl[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const y5 = [.../* @__PURE__ */ new Set([...Object.values(fi).flatMap((e) => Object.keys(e)), ...Object.keys(hi)])];
function K6(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = y5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: Mr(n) })).sort((n, a) => n.time - a.time);
}
const b5 = (e) => new vi(e).isTest(), oa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Ms(e)] || "";
}, k5 = 1800, w5 = (e, t) => {
  if (oa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && oa(n) !== "finished" && Number(e.time) - Number(n.time) <= k5 ? "tests_fixed" : "tests_passed";
};
function Y6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(b5), s = a.filter((r) => oa(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, oa(r))), o.map((r) => ({ beat: w5(r, s), time: Number(r.time), card: r.key }));
}
function Q6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Ms(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Ms(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const X6 = (e) => e.map((t) => {
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
function J6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function Z6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function eM(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = v5.find((c) => c.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function ao(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const fl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function $5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    ao(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function tM(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : r5(`held:${e}`) ? "idle" : e;
}
const Le = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function nM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Le.ahead * n ? 180 : Math.sign(a) * Le.turn;
}
const hl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function aM(e, t) {
  const n = Math.min(Le.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Le.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Le.lines, Math.floor((e.bottom - e.top - 2 * a) / Le.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Le.sweep) % s, r = o % Le.sweep, i = Le.sweep - Le.returnSeconds, c = hl((r - i) / Le.returnSeconds), f = r <= i ? hl(r / i) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * Le.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const ml = 3, wi = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, pl = 12, sM = (e, t) => ({ mood: e, began: t, seen: 0 });
function oM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!wi(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= ml ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * pl) / pl, lasts: ml } };
}
const lM = (e) => e.posture === "hang" && !wi(e.face), x5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), S5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function rM(e, t, n) {
  return x5.has(e) ? 1 / 0 : !S5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max($i(n - t.began, t.share) - lt.lead, 0);
}
const M5 = 5;
function iM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= M5 ? { beat: "long_walk", time: n } : null };
}
const _5 = 30, Dn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function uM(e, t, n, a, s = null) {
  if (t && n < t.until || !Dn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, r] = Dn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Dn.every } : { state: e, began: 0, until: 0, next: n + Dn.every };
}
const cM = (e, t, n) => t && n < t.until && yi.has(e.state) ? { state: t.state, since: t.began } : e, lt = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, $i = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function dM(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = $i(o, e.share);
  return s ? { eager: C5(t, l), moment: null } : l > lt.lead ? { eager: t, moment: null } : l < lt.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > lt.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < lt.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function C5(e, t) {
  return e.on && t > lt.lead + lt.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= lt.lead && t >= lt.least ? { ...e, on: !0, calm: !1 } : e;
}
const E5 = 1, A5 = { look: "look", gaze: "gaze" };
function O5(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [A5[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const T5 = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), I5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > E5 * t, memory: a, now: s, room: o }, n).name === "backflip", B5 = { work: ["building"], idle: ["standing"] };
function fM(e, t, n, a) {
  const s = Ss[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(B5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), yi.has(e) ? { moments: o, began: n || a } : (n && a - n >= _5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function R5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const gl = { pondering: R5 };
function hM(e, t, n, a, s, o) {
  if (gl[e.beat]) {
    const r = gl[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = O5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== no && { lifetime: l.lifetime } } } : null;
}
function mM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = T5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const pM = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function gM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function vM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const yM = (e, t) => !!(e != null && e.watches) && !t.once, bM = 10, kM = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || u5(a, a.queuedAt, n)), wM = (e, t) => t ? null : e[0] ?? null;
function $M(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const xM = (e, t) => !t.during || !e.some((n) => n.during === t.during), L5 = 2 * Math.PI, N5 = 500;
function SM(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / N5, i = t && e.point && !!t.behind != !!e.point.behind, c = i && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + r, f) : Math.max(e.amount - r, f), p = L5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, A = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !i ? s && !t.behind && !y.behind ? D5(y, t, n, p, s) : j5(y, t, n, p) : t) ?? y, S = A != null && A.behind && A.mood === "reading" ? q5(e.point, A, n, l, s) : A;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: a };
}
function q5(e, t, n, a, s) {
  const o = (_) => _ * 180 / Math.PI, l = (_) => o(Math.atan2(Math.sin(_ * Math.PI / 180), Math.cos(_ * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -i)) - r), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - r) : 0, y = h ? e.readingYaw + p : f, b = y + l(c - y), A = Math.min(Math.max(a / 1e3, 0), 0.1), S = Le.turnSpeed * A, x = h ? y + Math.min(Math.max(b - y, -S), S) : b, B = h ? e.readingFollow + p : x, W = B + (x - B) * (1 - Math.exp(-A / Le.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, w = o(ao(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), H = Math.min(Math.max(w, -N.up), N.down), P = Le.tipSpeed * A, q = h ? e.readingPitch + Math.min(Math.max(H - e.readingPitch, -P), P) : H;
  return { ...t, readingYaw: x, readingFollow: W, readingPitch: q, readingFacing: r };
}
function D5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (B) => {
    const { yaw: W, pitch: N } = ao(B.x - n.x, s, n.y - B.y, o);
    return { yaw: W, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, c] = [fl(r(e)), fl(r(t))], f = Math.acos(Math.min(Math.max(i[0] * c[0] + i[1] * c[1] + i[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [p, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [b, A, S] = i.map((B, W) => p * B + y * c[W]), x = s * b / A;
  return { ...t, x: n.x + x, y: n.y - $5(x, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const P5 = 0.15;
function MM(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= P5;
}
function j5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const F5 = (e) => !(e != null && e.on);
function _M(e, t, n) {
  if (F5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const hn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, at = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, za = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), vl = (e) => e * e * (3 - 2 * e);
function W5(e) {
  if (e < 0 || e >= at.seconds) return null;
  const t = za(e, ...at.flicker), n = Math.floor(t * at.flickers * 2) % 2 === 0, a = e < at.flicker[1] ? n ? 0.35 + 0.5 * t : at.dim : 1;
  return { strength: 1 - vl(za(e, ...at.fade)), lit: a, white: e < at.flash[0] ? 0 : 1 - vl(za(e, ...at.flash)) };
}
const CM = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function EM(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = W5(t - e.at);
  return a && { colour: hn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: at.signs[e.tone], ...a } };
}
function AM(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function OM(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= hn.looks || a === null && n - e.since >= hn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function TM(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const mt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, IM = { behind: 39, figure: 40, ahead: 41 }, H5 = "[data-figure-pile]", z5 = { amber: [1, 0.69, 0.125], good: hn.colours.good, bad: hn.colours.bad }, Gn = { phases: 4, ms: 230, dim: 0.25 }, BM = (e, t, n) => e !== "amber" || (t + n) % Gn.phases < Gn.phases / 2 ? 1 : Gn.dim, RM = (e) => e === "amber" ? Gn.phases : 1;
function LM(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const NM = Object.keys(z5), Ye = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Jt = ([e, t], n) => e + n() * (t - e);
function qM(e) {
  const t = Ye.least + Math.floor(e() * (Ye.most - Ye.least + 1));
  return Array.from({ length: Math.min(t, Ye.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ye.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Jt(Ye.start, e), l = Jt(Ye.reach, e);
    return {
      text: Ve({ moment: "digit" }, e).name,
      x: a * o,
      y: Ye.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Jt(Ye.moveMs, e)),
      fadeMs: Math.round(Jt(Ye.fadeMs, e))
    };
  });
}
const Ua = { high: 3, gap: 1 };
function DM(e) {
  const t = Math.floor(e / Ua.high);
  return { left: -(mt.inside + mt.width / 2 + t * (mt.width + Ua.gap)), up: e % Ua.high * (mt.height - mt.top) };
}
const U5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, G5 = { after: 5 }, V5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new vi(t).isBuild());
function PM(e, t, n) {
  const a = V5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= G5.after ? s : null;
}
function jM(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: U5(n, a, s) } : null;
}
const yl = { ahead: 140, up: 70 };
function FM(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * yl.ahead, y: a - yl.up } } : o ? { at: { x: n(o), y: a - o.up - mt.height } } : t ? { at: null } : null;
}
const Ga = { least: 4e3, most: 1e4 }, K5 = (e) => Ga.least + e() * (Ga.most - Ga.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function WM(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = K5(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const HM = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), zM = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), xi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), UM = new Set(ya.filter((e) => xi.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Y5 = (e) => e.some((t) => t.state === "built"), GM = (e, t) => Y5(t) ? e.filter((n) => !xi.has(n.beat)) : e, vt = { reach: 40, room: 6 }, Q5 = (e, t) => t <= e - vt.reach + 2, VM = (e, t, n) => Q5(e, n) ? t - vt.reach : e - vt.reach - vt.room, KM = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, Va = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, YM = (e) => Jt(e() < Va.longShare ? Va.long : Va.short, e), X5 = 2 * mt.width;
function QM(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= X5 ? o : e + (o - e + s / 2) % s;
}
const J5 = 60, XM = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= J5, bl = "[data-figure-home]", $n = () => {
  var t;
  const e = document.querySelector(bl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(bl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Z5 = "[data-figure-docked-bars]", e$ = "[data-figure-chat-foot]", t$ = [0.85, 0.6, 0.35, 0.15], n$ = ["question", "waiting", "suggestion"], JM = (e, t) => n$.find((n) => e[n] > 0 && t[n] === "behind") || null;
function ZM() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const a$ = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", s$ = "[data-figure-newest]";
function Si() {
  var a, s;
  const e = (a = $n()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(s$), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !so(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function mn(e, t, n = Si()) {
  if (!e || !n) return !0;
  const a = ct(e, t), s = ka(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ie.top * t.size, bottom: a.top + Ie.bottom * t.size }, l = St.gap;
  return !ba(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function e_(e, t, n, a = Si()) {
  if (!a || mn(t, e, a)) return null;
  const s = ka(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ot(), i = t.posture === "stand" ? lo * e.size : Ii * e.size, c = Math.max(n.left + i, r.left + o), f = Math.min(n.right - i, r.right - l);
  return [a.left - St.gap - l, a.right + St.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && mn(p, e, a) && B$(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Ka = 0.26, Mi = 0.54, o$ = 1.25 / 5.4, xn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ka, travels: "stand" },
  lounge: { drop: Ka, travels: "stand" },
  composed: { drop: Ka, travels: "stand" },
  hang: { drop: Mi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, t_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * o$ * Math.cos(t * Math.PI / 180),
  y: 1 - n - Mi
}), tn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), l$ = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), n_ = (e, t) => (e === "sit" ? l$.has(t) : tn.has(e)) ? e : "stand";
function a_(e, t) {
  return e.facing === t.facing || !tn.has(e.posture) && !tn.has(t.posture) ? t : { posture: "stand", facing: tn.has(e.posture) ? e.facing : t.facing };
}
const s_ = 0.25, o_ = (e, t) => tn.has(e) && xn[t].drop === 0, _i = 2, r$ = 90, i$ = 180, u$ = 140, c$ = 280, d$ = 420, f$ = 0.25, h$ = 290, m$ = 600, p$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", g$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ya = 5;
function la(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ya) return null;
  (l || r) && (o = Math.max(o, _i));
  const y = o > 1, b = Math.abs(t.x - e.x), A = b < Ya ? 0 : b / (r$ * o) * 1e3, S = Math.min(A, y ? u$ : i$), x = Math.abs(t.y - e.y), B = t.y < e.y, W = B && !p && I5(x, n, i, c, f, h), N = B ? d$ + Math.min(x, 400) * f$ : Math.sqrt(2 * x / to) * 1e3, w = {
    x: t.x,
    y: t.y,
    ms: x > Ya ? W ? m$ : N : 0,
    lead: W ? h$ : B ? c$ : 0,
    easing: B ? p$ : g$,
    hopping: !0,
    clip: W ? "backflip" : B ? "jump" : "fall"
  }, H = { x: t.x, y: t.y, ms: A + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, P = p ? v$(t, n) : w, q = B && !a ? [{ ...H, y: e.y }, P] : [{ ...w, x: e.x }, H];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const v$ = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), y$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], l_ = (e, t, n) => e.posture === "walk" && n ? "walk" : y$(e.clip, t), ct = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - xn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ba = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, so = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = $n()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Pn = 0.5, kl = 20;
function r_(e, t, n = Ot()) {
  const a = ct(e, t);
  return a.left >= n.left + kl && a.right <= n.right - kl;
}
function oo(e, t, n = Ot()) {
  const a = ct(e, t), s = a.right - a.left, o = ka(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Pn && r <= n.right + Pn && a.top >= n.top - Pn && i <= n.bottom + Pn;
}
const ra = [0.35, 0.5, 0.65], ia = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ie = { left: ra[0], right: ra.at(-1), top: ia[0], bottom: ia.at(-1) }, b$ = 0.24;
function ka(e) {
  if (e.posture === "stand") return { left: Ie.left, right: Ie.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + b$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ie.left, t), right: Math.max(Ie.right, t) };
}
function k$(e, { size: t }, n = Ot()) {
  const a = ka(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const lo = (Ie.right - Ie.left) / 2 + 0.08;
function i_(e, t) {
  return e === "hang" ? Ie : { ...Ie, bottom: Math.min(Ie.bottom, 1 - t - xn[e].drop) };
}
const w$ = "[data-figure-agent]";
function Ci(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !so(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[i].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, i), c.setEnd(o, i + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const Ei = (e) => ia.flatMap(
  (t) => ra.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ro(e, t, n = "") {
  if (!mn(e, t)) return ra.length * ia.length;
  const a = ct(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(a$)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && ba(s, i) && so(r)).map(({ rect: r }) => r), l = (r, i) => o.some((c) => r >= c.left && r <= c.right && i >= c.top && i <= c.bottom);
  return Ei(s).filter(([r, i]) => l(r, i) || Ci(r, i, n)).length;
}
function $$(e, t) {
  const n = ct(e, t);
  return Ei({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Ci(a, s, "", w$)).length;
}
const wl = 4;
function u_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = wl; o <= s; o += wl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!$$(r, e) && mn(r, e)) return r;
    }
  return null;
}
function pn(e, t, n) {
  const a = Ot(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => oo(l, t, a) && mn(l, t)).map((l) => ({ spot: l, covered: ro(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Ai = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), x$ = [0.5, 0.25, 0.75], S$ = (e) => Ai(e.getBoundingClientRect(), x$), Oi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, M$ = lo, _$ = (e, t, { size: n }, a = M$) => Ti(e, Oi[t], a * n, "stand");
function Ti(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const C$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Ii = 0.1, E$ = (e, t, { size: n }) => Ti(e, C$[t], Ii * n, "sit"), A$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Qa = 60;
function c_(e, t) {
  const n = A$(t);
  return !e.aside || Math.abs(n) >= Qa ? t : n < 0 ? 360 - Qa : Qa;
}
const nn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, O$ = (e) => [.../* @__PURE__ */ new Set([e, ...nn.turns.map((t) => (t + 360) % 360)])];
function d_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = O$(t), l = nn.every[0] + a() * (nn.every[1] - nn.every[0]);
  return { face: t, from: s ? T$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function T$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / nn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function f_(e, t) {
  const { element: n, edge: a } = wa(), s = ["left", "right"].map((r) => Sn(E$(a, r, e), e)).filter((r) => n && oo(r, e) && !ro(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function h_(e, t, { size: n }) {
  const a = (Ie.right - Ie.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Bi } : e;
}
const Bi = 7;
function Ri() {
  const e = [...document.querySelectorAll(H5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function I$(e, t) {
  const n = ct(e, t), a = n.right - n.left;
  return { left: n.left + Ie.left * a, right: n.left + Ie.right * a, top: n.top + Ie.top * a, bottom: n.bottom };
}
function B$(e, t) {
  const n = Ri();
  return !n || !ba(I$(e, t), n);
}
const R$ = 4;
function wa() {
  const e = Mn(), t = Ri(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > R$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Bi - n, 0) } };
}
const m_ = ({ size: e, below: t }) => (1 - t) * e;
function Sn(e, t) {
  const n = Ot(), { size: a, below: s } = t, o = xn[e.posture].drop * a;
  return { ...k$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const _s = (e, t) => Object.keys(Oi).map((n) => Sn(_$(e, n, t), t)), io = (e, t) => Ai(e, t$).map((n) => Sn(n, t)), Li = (e, t, n) => pn(e, t, n) ?? e[0];
function p_(e, t) {
  const { element: n, edge: a } = wa();
  return { ...Li(_s(a, e), e, t), view: null, on: n };
}
function g_(e, t, n, a) {
  const { element: s, edge: o } = wa(), l = (a ? _s(o, t) : [..._s(o, t), ...io(o, t)]).filter(
    (c) => !ba(ct(c, t), e)
  ), r = pn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !ro(r, t) ? r : pn(l, t, n);
  return i && { ...i, view: null, on: s };
}
function Mn() {
  var a;
  const e = $n(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Z5);
  if (!t) return { ...$a(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const $l = { within: 2 };
function v_(e) {
  const { element: t, docked: n, edge: a } = Mn();
  if (!n || e.on !== t) return !0;
  const s = $a().edge;
  return a.left > s.left + $l.within || a.left + a.width < s.left + s.width - $l.within;
}
const L$ = "[data-figure-closing]";
function y_() {
  var n;
  const { element: e, docked: t } = Mn();
  return t && !!((n = e.firstElementChild) != null && n.matches(L$));
}
const Ni = "[data-figure-progress]";
function b_(e) {
  const t = e.querySelector(Ni);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function k_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const N$ = { across: 300, above: 380, below: 60 };
function w_(e) {
  const { across: t, above: n, below: a } = N$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: q$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const q$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), qi = "[data-figure-bar]", Cs = { back: 144, along: 0.4 };
function $_(e) {
  const { element: t, docked: n, edge: a } = Mn(), s = n ? t.querySelector(qi) : null;
  if (!(s != null && s.querySelector(Ni))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Sn({ x: o - Cs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function x_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Cs.along * a.size ? t.x + Cs.along * a.size : e.x, y: e.y, behind: !0 };
}
function S_(e) {
  const t = e.querySelector(qi), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function $a() {
  const e = $n();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function M_(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = $a(), i = n === null ? D$(r, e, o === null ? t : { x: o, y: r.top }, a, s) : Sn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function D$(e, t, n, a, s) {
  const o = io(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + mt.width < s && i.x + a - vt.reach - vt.room >= l);
  return pn(r.length ? r : o, t, n);
}
const P$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function __(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: c = null, now: f = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, _i));
  const y = (W) => {
    const N = ct(W, n, xn[W.posture].travels);
    return { x: N.left, y: N.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return j$(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [A, ...S] = [e, ...i, t].map(y), x = la(A, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: c, now: f, room: h, pogo: p }), B = S.slice(1).map((W, N) => {
    var w;
    return (w = la(S[N], W, n.size, { random: r, memory: c, now: f, room: h })) == null ? void 0 : w.legs.find((H) => H.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...B.filter(Boolean)] };
}
function j$(e, t, n, a, s, o, l) {
  const r = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / P$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? la(e, n, o.size, { pace: l }) : la(n, t, o.size, { pace: l }), c = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function C_(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function E_(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && pn(S$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = wa();
  return { ...Li(io(s, t), t, n), view: null, on: a };
}
const F$ = "[data-figure-bubble]", W$ = 250;
let an = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Di = 0;
const Kt = () => an, Xa = /* @__PURE__ */ new WeakMap();
let H$ = 0;
function uo(e) {
  return Xa.has(e) || Xa.set(e, `floor-${++H$}`), Xa.get(e);
}
const z$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, U$ = () => {
  var e, t;
  return ((t = (e = $n()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function G$(e, t) {
  var a;
  const n = (a = e.querySelector(e$)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function V$(e, t) {
  const n = e && G$(e, t), a = e ? [...e.querySelectorAll(F$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || z$(l, n))).map(({ element: o, type: l, box: r }) => ({ id: uo(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const K$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= W$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Pi(e = an, t = performance.now()) {
  const n = Ot(), a = U$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = Mn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const c = $a();
  return c.element && i.push({ id: uo(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), i.push(...V$(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((f) => Object.freeze({ ...f, vy: K$(e, f, t) }))) });
}
const Es = /* @__PURE__ */ new Set();
function Y$(e) {
  return Es.add(e), () => Es.delete(e);
}
function Q$() {
  ji();
  const e = () => {
    Di = requestAnimationFrame(e), !document.hidden && (an = Pi(an), Es.forEach((t) => t(an)));
  };
  e();
}
function ji() {
  cancelAnimationFrame(Di);
}
const co = 5, X$ = 56, J$ = { share: 0.6 }, Z$ = (e) => -Math.sqrt(2 * to * J$.share * e), Wt = (e, t) => e.find((n) => n.id === t) ?? null;
function A_(e, t = Pi().floors) {
  const n = Wt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : uo(e.on) : null, o = s && Wt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Fi({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Kt().floors) {
  const c = Wt(i, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || e4(c, f, o)) && t4(f, r, i) ? { x: f.x, y: f.y } : null;
}
const fo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, e4 = (e, t, n) => !fo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function O_(e, t = Kt().floors) {
  if (!fo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= co && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function t4(e, t, n = Kt().floors) {
  const a = Wt(n, "home");
  return e.posture === "hang" && a && ct(e, t).bottom >= a.top ? !1 : oo(e, t);
}
function T_(e, t, n, a = Kt().floors) {
  const s = Fi(e, n, a);
  if (!e.home) return n4(e, t, s, a);
  if (!s) return null;
  const o = Wt(a, "home"), l = s.y - t.y, r = l > co ? "dropping" : -l > X$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function n4(e, t, n, a) {
  const s = n ? Wt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Z$(e.risen) };
  if (!n) return null;
  if (fo(t) && n.y - t.y > co) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function I_(e, t, n) {
  const a = lo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function B_(e, t, n, a = Kt().floors) {
  const s = t && Fi(t, n, a);
  return s ? { ...e, ...s } : e;
}
const a4 = ["data-type"], s4 = { class: "figure-floor-name" }, o4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", s4, v(e.floor.type), 1)
    ], 12, a4));
  }
}, l4 = /* @__PURE__ */ z(o4, [["__scopeId", "data-v-4e0f1e2e"]]), r4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, i4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Xe(Kt().floors);
    let n = () => {
    };
    return _e(() => {
      n = Y$((a) => t.value = a.floors), Q$();
    }), Be(() => {
      n(), ji();
    }), (a, s) => (u(), d("div", r4, [
      (u(!0), d(D, null, ne(t.value, (o) => (u(), F(l4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, R_ = /* @__PURE__ */ z(i4, [["__scopeId", "data-v-e519168b"]]), sn = (e) => typeof e == "number" ? e : Date.parse(e);
function L_(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: sn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => sn(s.row.created_at) - sn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const xl = 20;
async function N_(e, t, n) {
  for (let a = 0; a < xl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || sn(o.created_at) <= sn(s.created_at) || !await n()) return a;
  }
  return xl;
}
const u4 = 3, Ja = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function c4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ja[n.grouping]) == null ? void 0 : a.call(Ja, e.row, n)) || "";
}
function d4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function q_(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= u4 ? [d4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = c4(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function f4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const D_ = (e) => (t) => t.filter((n) => n.id !== e), P_ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), j_ = (e) => (t) => [...t, e], F_ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function W_(e, t = {}) {
  const n = tt(), a = O(null), s = O("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function H_(e) {
  const t = tt(), n = O("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const jn = /* @__PURE__ */ new Map();
function h4(e, t) {
  if (jn.has(e)) return jn.get(e);
  const n = t().finally(() => jn.delete(e));
  return jn.set(e, n), n;
}
function z_() {
  const e = tt(), t = O(null), n = O("");
  async function a() {
    const s = await h4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const m4 = { class: "cards-page" }, p4 = { class: "cards-bar" }, g4 = { class: "cards-count" }, v4 = { class: "cards" }, y4 = {
  key: 1,
  class: "cards-note"
}, b4 = {
  key: 2,
  class: "cards-note"
}, k4 = ["data-row", "onClick"], w4 = { class: "card-head" }, $4 = { class: "card-title" }, x4 = { class: "card-foot" }, S4 = {
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
    return (a, s) => (u(), d("div", m4, [
      m("div", p4, [
        m("span", g4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        I(ve, Pe({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            I(re, {
              name: "plus",
              size: 12
            }),
            V(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", v4, [
        e.loaded ? e.failure ? (u(), d("p", y4, v(e.failure), 1)) : e.rows.length ? k("", !0) : (u(), d("p", b4, "No " + v(e.term) + "s yet", 1)) : (u(), F(Ke, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), d(D, null, ne(e.rows, (o) => (u(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", w4, [
            I(re, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            V(" " + v(e.head(o)), 1),
            I(Ze, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", $4, v(e.title(o)), 1),
          m("span", x4, v(e.foot(o)), 1)
        ], 8, k4))), 128))
      ]),
      he(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, U_ = /* @__PURE__ */ z(S4, [["__scopeId", "data-v-b39fea5d"]]), Sl = "newest";
function G_(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(Ne, null)) == null ? void 0 : c.search, s = O(""), o = O(Sl), l = O("all"), r = E(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((p) => f4(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Sl ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), i = E(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const M4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, _4 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, C4 = 40, E4 = "top", A4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Me(Ne, null)) == null ? void 0 : p.autoScroll, s = E(() => a === E4), o = O(null), l = O(!1), r = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function f() {
      var y;
      l.value = r(o.value) >= C4, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    ge(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = i()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return _e(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = i());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), et(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (u(), d("div", M4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: K(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        he(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", _4, [
        I(zt, {
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
              I(re, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = V(" Newest ", -1))
            ], 512), [
              [Rl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, V_ = /* @__PURE__ */ z(A4, [["__scopeId", "data-v-d704d7e3"]]), O4 = ["aria-selected", "data-tab", "onClick"], T4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, I4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Me(Ne, null), o = E(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = O(null), r = O({ left: 0, width: 0, slides: !1 }), i = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => je(() => c(!0));
    let h = null;
    return _e(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Be(() => h == null ? void 0 : h.disconnect()), ge(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), ge(() => n.answer, f, { deep: !0 }), (p, y) => (u(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), d(D, null, ne(o.value, (b) => {
        var A, S;
        return u(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: K(["inner-tab", { on: ((A = e.active) == null ? void 0 : A.key) === b.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === b.key,
          "data-tab": b.key,
          onClick: (x) => a("choose", b)
        }, [
          V(v(b.label) + " ", 1),
          i(b) ? (u(), d("span", T4, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, O4);
      }), 128)),
      m("i", {
        class: K(["inner-tabs-line", { slides: r.value.slides }]),
        style: ye({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, K_ = /* @__PURE__ */ z(I4, [["__scopeId", "data-v-63fcd326"]]), B4 = { class: "task-bar" }, R4 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (u(), d("span", B4, [
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
}, Y_ = /* @__PURE__ */ z(R4, [["__scopeId", "data-v-a4fc52ae"]]), L4 = {
  class: "tab-body",
  "data-tab-body": ""
}, N4 = { "data-tab-content": "" }, q4 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = O(!1);
    let a = 0;
    return ge(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Is(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), d("div", L4, [
      n.value ? (u(), F(Ke, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      Je(m("div", N4, [
        he(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Rl, !n.value]
      ])
    ]));
  }
}, Q_ = /* @__PURE__ */ z(q4, [["__scopeId", "data-v-63876533"]]), D4 = {
  class: "search-bar",
  "data-search-bar": ""
}, P4 = { class: "search-bar-control" }, j4 = ["value", "placeholder", "aria-label"], F4 = ["aria-expanded"], W4 = {
  key: 0,
  "data-menu-count": ""
}, H4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = tu(), l = ((x = Me(Ne, null)) == null ? void 0 : x.search) ?? {}, r = E(() => l.placeholder || a.placeholder), i = l.context ?? [], c = O(null), f = O(null), h = O([]), p = E(() => h.value.length ? h.value[h.value.length - 1].next : i), y = E(() => !!o.menu || i.length > 0), b = (B) => {
      h.value = [], f.value = f.value ? null : B.currentTarget;
    };
    function A(B) {
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
      return u(), d("div", D4, [
        m("div", P4, [
          I(re, {
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
            placeholder: r.value,
            "aria-label": r.value,
            onInput: W[0] || (W[0] = (w) => s("update:modelValue", w.target.value)),
            onKeydown: _t(S, ["esc"])
          }, null, 40, j4),
          e.modelValue ? (u(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            I(re, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          y.value ? (u(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: b
          }, [
            e.menuCount ? (u(), d("span", W4, v(e.menuCount), 1)) : k("", !0),
            I(re, {
              name: "caret",
              size: 12
            })
          ], 8, F4)) : k("", !0)
        ]),
        (N = L(l).button) != null && N.title ? (u(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = (w) => s("pick", L(l).button.click))
        }, v(L(l).button.title), 1)) : k("", !0),
        he(B.$slots, "default", {}, void 0, !0),
        f.value ? (u(), F(ha, {
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
            h.value.length ? (u(), F(ze, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = (w) => h.value = h.value.slice(0, -1))
            }, {
              default: j(() => [
                V("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (u(!0), d(D, null, ne(p.value, (w) => (u(), F(ze, {
              key: w.title,
              description: w.subtext,
              "data-search-entry": w.title,
              onClick: (H) => A(w)
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
}, z4 = /* @__PURE__ */ z(H4, [["__scopeId", "data-v-45374bed"]]), U4 = {
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
    return (o, l) => (u(), F(z4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: j(() => [
        I(Mt, null, {
          default: j(() => [...l[2] || (l[2] = [
            V("Order", -1)
          ])]),
          _: 1
        }),
        (u(), d(D, null, ne(a, (r) => I(ze, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: j(() => [
            V(v(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), d(D, { key: 0 }, [
          I(Mt, null, {
            default: j(() => [...l[3] || (l[3] = [
              V("Show", -1)
            ])]),
            _: 1
          }),
          (u(), d(D, null, ne(s, (r) => I(ze, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: j(() => [
              V(v(r.label), 1)
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
}, X_ = /* @__PURE__ */ z(U4, [["__scopeId", "data-v-dab0064d"]]);
function J_() {
  const e = O(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Z_ = (e) => import(
  /* @vite-ignore */
  e
), G4 = 86400, As = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function V4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((As(t) - As(e)) / G4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function eC(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = As(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: V4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Za = 280, es = 240, ts = 120, K4 = 6, Y4 = 14, gn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Q4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Wi(e, t) {
  const n = Math.max(0, Q4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function X4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Y4}px)` }), e.offsetHeight, e.style.transition = `height ${Za}ms ${gn}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Wi(t, e));
    const p = s() - r;
    if (!i && p >= Za && (i = !0, e.style.transition = `opacity ${es}ms ease-out, transform ${es}ms ${gn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Za + es) return a(h);
    f();
  };
  return a(h), f;
}
function tC(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${K4}px)` }), e.offsetHeight, e.style.transition = `opacity ${ts}ms ease-out, transform ${ts}ms ${gn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Wi(t, e)), s() - l < ts) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const J4 = 140, Fn = 220, Ml = 5;
function nC({ gap: e = J4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(f, h) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), h();
    });
  }
  function i() {
    const f = n.splice(0, Ml);
    if (s = f.length > 0, !s) return;
    let h = f.length;
    for (const p of f)
      p.el.style.display = p.display, r(p, () => {
        h -= 1, h || (o = t(i, e));
      });
  }
  const c = (f, h, p, y = X4) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: f, options: h, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, r(b, () => o = t(i, e));
    f.style.display = "none", n.push(b), n.length >= Ml && c.flush();
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
function aC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${gn}, opacity ${Fn}ms ease-in, margin ${Fn}ms ${gn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Fn);
}
const Hi = "chat.pins.minimised", Vn = O(Xn(Hi, !1));
function _l(e) {
  Vn.value = e, Hs(Hi, e);
}
function Z4(e) {
  const t = E(() => e()), n = E(() => Vn.value ? [] : e()), a = () => _l(!Vn.value), s = Date.now() / 1e3;
  return ge(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && _l(!1)
  ), { pins: t, visible: n, minimised: Vn, toggle: a };
}
const ex = ["title"], tx = {
  key: 0,
  class: "pins-count"
}, nx = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Z4(() => t.pinRows);
    return (o, l) => L(n).length ? (u(), d("button", {
      key: 0,
      type: "button",
      class: K(["pins-toggle", { minimised: L(a), inline: e.inline }]),
      title: L(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = Se((...r) => L(s) && L(s)(...r), ["stop"]))
    }, [
      I(re, {
        name: L(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      L(a) ? (u(), d("span", tx, v(L(n).length), 1)) : k("", !0)
    ], 10, ex)) : k("", !0);
  }
}, sC = /* @__PURE__ */ z(nx, [["__scopeId", "data-v-d073c504"]]), ax = ["title"], sx = ["title"], ox = { class: "diff-card-dir" }, lx = { class: "diff-card-name" }, rx = ["title"], ix = ["title"], ux = {
  key: 0,
  class: "diff-card-note"
}, cx = ["href"], dx = ["src", "alt"], fx = { class: "diff-card-rows" }, hx = { class: "diff-row-num" }, mx = { class: "diff-row-sign" }, px = { class: "diff-row-code" }, gx = {
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
    function o(T) {
      (T.metaKey || T.ctrlKey) && (T.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = E(() => n.path.lastIndexOf("/") + 1), c = E(() => n.path.slice(0, i.value)), f = E(() => n.path.slice(i.value)), h = E(() => n.change === "deleted"), p = E(() => l[n.change]), y = E(() => new Set(n.rows.filter((T) => T.line_type === "add").map((T) => T.line))), b = O("after"), A = E(() => b.value === "before" ? n.whole.old : n.whole.text), S = E(() => n.whole && n.whole.text !== void 0 ? A.value.split(`
`).map((T, $) => ({ line_type: b.value === "after" && y.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: T })) : n.rows.filter(
      (T) => !(n.editsOnly && ["ctx", "fold"].includes(T.line_type)) && !(n.hideRemovals && T.line_type === "del")
    )), x = O(!1), B = E(() => n.lines && !x.value && !n.whole), W = E(() => B.value ? S.value.slice(0, n.lines) : S.value), N = E(() => S.value.length - W.value.length), w = (T) => T.line === null || T.line_type === "del" ? "" : T.line, H = (T) => T.line_type === "fold" ? T.hidden ? `⋯ ${T.hidden} lines` : "⋯" : T.text, P = O(null), q = O(null);
    let _ = null;
    return _e(() => {
      if (!q.value) return;
      let T = !0;
      _ = new ResizeObserver(() => {
        !P.value || !q.value || (P.value.style.transition = T ? "none" : "", P.value.style.height = `${q.value.offsetHeight}px`, T = !1);
      }), _.observe(q.value);
    }), Be(() => _ && _.disconnect()), (T, $) => (u(), d("section", {
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
          m("span", ox, v(c.value), 1),
          m("span", lx, v(f.value), 1),
          p.value ? (u(), d("span", {
            key: 0,
            class: K(["diff-card-badge", e.change])
          }, v(p.value), 3)) : k("", !0)
        ], 8, sx),
        m("span", {
          class: K(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: K(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        I(Ze, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: $[0] || ($[0] = Se((g) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, rx)) : k("", !0),
        h.value ? k("", !0) : (u(), d("button", {
          key: 1,
          type: "button",
          class: K(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: $[1] || ($[1] = Se((g) => a("whole"), ["stop"]))
        }, [
          I(re, {
            name: "file",
            size: 12
          })
        ], 10, ix))
      ], 8, ax),
      e.whole && e.whole.error ? (u(), d("p", ux, v(e.whole.error), 1)) : k("", !0),
      !h.value && !e.folded ? (u(), d(D, { key: 1 }, [
        e.picture ? (u(), d("a", {
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
          }, null, 8, dx)
        ], 8, cx)) : (u(), d("div", {
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
            m("div", fx, [
              (u(!0), d(D, null, ne(W.value, (g, M) => (u(), d("div", {
                key: M,
                class: K(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", hx, v(w(g)), 1),
                m("span", mx, v(r[g.line_type]), 1),
                m("span", px, v(H(g)), 1)
              ], 2))), 128)),
              N.value > 0 ? (u(), d("button", {
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
}, oC = /* @__PURE__ */ z(gx, [["__scopeId", "data-v-23581cbb"]]), vx = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (u(), F(ut(e.as), {
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
}, lC = /* @__PURE__ */ z(vx, [["__scopeId", "data-v-683e1839"]]), yx = { "data-queue-controls": "" }, bx = { class: "counts" }, kx = { "data-queue-spots": "" }, wx = {
  class: "spots",
  "aria-label": "Places in use"
}, $x = { "data-queue-waiting": "" }, xx = { key: 0 }, Sx = { class: "control" }, Mx = { class: "stepper" }, _x = ["disabled"], Cx = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, Ex = ["disabled"], Ax = ["for"], Ox = ["id", "value", "disabled", "onChange"], Tx = { class: "control" }, Ix = ["aria-checked", "disabled"], Bx = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, Rx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, Lx = {
  key: 2,
  class: "note failure",
  role: "alert"
}, Nx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1), o = O("");
    async function l(r, i) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", r, String(i)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (r, i) => (u(), d("div", yx, [
      I(Ft, { icon: "gauge" }, {
        default: j(() => [...i[3] || (i[3] = [
          V("Now", -1)
        ])]),
        _: 1
      }),
      m("div", bx, [
        m("div", null, [
          m("strong", kx, [
            V(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", wx, [
            (u(!0), d(D, null, ne(e.queue.parallel_limit, (c) => (u(), d("span", {
              key: c,
              class: K({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", $x, v(e.queue.waiting_count), 1),
          i[4] || (i[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), d("p", xx, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", Sx, [
        i[5] || (i[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", Mx, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: i[0] || (i[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, _x),
          m("output", Cx, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: i[1] || (i[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, Ex)
        ])
      ]),
      (u(!0), d(D, null, ne(e.queue.suite_limits, (c) => (u(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, Ax),
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
        }, null, 40, Ox)
      ]))), 128)),
      m("div", Tx, [
        i[7] || (i[7] = m("div", null, [
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
          onClick: i[2] || (i[2] = (c) => l(e.queue.main_spots_setting, e.queue.count_main_runs ? "off" : "on"))
        }, [...i[6] || (i[6] = [
          m("span", null, null, -1)
        ])], 8, Ix)
      ]),
      e.queue.halt_cause === "update" ? (u(), d("p", Bx, [
        I(re, {
          name: "pause",
          size: 13
        }),
        i[8] || (i[8] = V("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), d("p", Rx, [
        I(re, {
          name: "pause",
          size: 13
        }),
        V("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (u(), d("p", Lx, v(o.value), 1)) : k("", !0)
    ]));
  }
}, qx = /* @__PURE__ */ z(Nx, [["__scopeId", "data-v-975b4b89"]]), Dx = ["data-queue-row", "data-queue-process"], Px = ["aria-expanded"], jx = { class: "run-line" }, Fx = { class: "leading" }, Wx = {
  key: 0,
  "data-queue-position": ""
}, Hx = ["title"], zx = { class: "command" }, Ux = {
  class: "time",
  "data-queue-time": ""
}, Gx = { class: "details" }, Vx = { "data-queue-type": "" }, Kx = { class: "failed" }, Yx = { class: "drop-inner" }, Qx = { class: "output" }, Xx = { class: "output-heading" }, Jx = ["href"], Zx = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(), o = ei((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, r = Js(), i = E(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = E(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : r.value * 1e3, b = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
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
    return ge(() => n.expanded, h, { immediate: !0 }), kn(["output.*"], f, (p) => Rr(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (u(), d("div", {
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
        m("div", jx, [
          m("span", Fx, [
            e.run.section === "waiting" ? (u(), d("span", Wx, v(e.position), 1)) : (u(), d("span", {
              key: 1,
              class: K(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, Hx))
          ]),
          m("code", zx, v(e.run.line), 1),
          m("span", Ux, v(c.value), 1),
          I(re, {
            class: K(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", Gx, [
          m("span", Vx, v(i.value), 1),
          e.run.owner_agent_id ? (u(), d(D, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = Se((b) => L(yt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), d(D, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (u(), d(D, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = Se((b) => L(yt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (u(), d(D, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", Kx, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, Px),
      m("div", {
        class: K(["drop", { open: e.expanded }])
      }, [
        m("div", Yx, [
          m("div", Qx, [
            m("div", Xx, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Jx)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && L(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              V(v(e.run.line), 1),
              L(l).length ? (u(), d(D, { key: 0 }, [
                V(v(`
` + L(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, Dx));
  }
}, e8 = /* @__PURE__ */ z(Zx, [["__scopeId", "data-v-18099d0b"]]), t8 = {
  class: "process-queue",
  "data-test-queue": ""
}, n8 = { class: "scroll" }, a8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, s8 = ["data-queue-empty"], ns = 20, o8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = O(null), a = O(""), s = O([]), o = O(ns), l = E(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let r = 0;
    const i = E(() => n.value ? [
      { type: "running", heading: "Running", icon: "start", rows: n.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: n.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: n.value.recent, empty: "Nothing has run yet." }
    ].flatMap((y) => [
      { key: `band:${y.type}`, section: y },
      ...y.rows.length ? y.rows.map((b, A) => ({ key: `run:${b.id}`, run: b, position: A + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
    ]) : []);
    function c(p) {
      s.value = s.value.includes(p) ? s.value.filter((y) => y !== p) : [...s.value, p];
    }
    async function f() {
      const p = ++r, y = await t.read(o.value === ns ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === r && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += ns, f();
    }
    return kn(["process.*", "setting.*"], f), _e(f), (p, y) => (u(), d("article", t8, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", n8, [
        a.value ? (u(), d("p", a8, v(a.value), 1)) : k("", !0),
        n.value ? (u(), d(D, { key: 1 }, [
          I(qx, {
            queue: n.value,
            read: e.read,
            onSaved: f
          }, null, 8, ["queue", "read"]),
          I(Ts, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: j(() => [
              (u(!0), d(D, null, ne(i.value, (b) => (u(), d(D, {
                key: b.key
              }, [
                b.run ? (u(), F(e8, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (A) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (u(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, v(b.section.empty), 9, s8)) : (u(), F(Ft, {
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
          l.value ? (u(), d("button", {
            key: 0,
            type: "button",
            class: "older",
            "data-queue-older": "",
            onClick: h
          }, "Show older commands")) : k("", !0)
        ], 64)) : a.value ? k("", !0) : (u(), F(Ke, { key: 2 }))
      ])
    ]));
  }
}, rC = /* @__PURE__ */ z(o8, [["__scopeId", "data-v-d9b6ef6b"]]), l8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, r8 = ["aria-expanded"], i8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, u8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, c8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, d8 = {
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
    const t = e, n = O(t.open), a = O(0), s = O(0), o = O("");
    let l = 0;
    async function r() {
      const i = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      i === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return ge(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, r();
    }, { immediate: !0 }), kn(["link.*", "phase.*", "phase_task.*"], r), (i, c) => (u(), d(D, null, [
      a.value ? (u(), d("section", l8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", i8, v(a.value), 1),
          I(Vt, { open: n.value }, null, 8, ["open"])
        ], 8, r8),
        m("div", {
          class: K(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), d("div", u8, [
            I(Yc, {
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
              onOpen: c[1] || (c[1] = (f) => i.$emit("open", f))
            }, null, 8, ["model", "id", "document-id", "read", "changes", "outside-plan", "page-size", "only-kinds"])
          ])) : k("", !0)
        ], 2)
      ])) : k("", !0),
      o.value ? (u(), d("p", c8, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, f8 = /* @__PURE__ */ z(d8, [["__scopeId", "data-v-a4550728"]]), h8 = ["placeholder"], m8 = { class: "actions" }, p8 = { class: "error" }, g8 = {
  key: 1,
  class: "card closed"
}, v8 = { class: "mark" }, y8 = { class: "prompt" }, b8 = {
  key: 0,
  class: "draft"
}, k8 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Pt({
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
  emits: /* @__PURE__ */ Pt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = on(e, "draft"), l = on(e, "error"), r = O(!!l.value), i = O(!1), c = O(!1), f = O(null);
    async function h() {
      var b, A;
      r.value = !0, i.value = !1, await je(), (A = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || A.focus();
    }
    function p() {
      r.value = !1, l.value = "";
    }
    async function y() {
      const b = o.value.trim();
      if (!(!b || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(b), r.value = !1, i.value = !0;
        } catch (A) {
          o.value = b, l.value = A.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, A) => (u(), d("div", {
      class: K(["comment-bar", { open: r.value }])
    }, [
      r.value ? (u(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: Se(y, ["prevent"]),
        onKeydown: _t(p, ["esc"])
      }, [
        he(b.$slots, "who", {}, void 0, !0),
        Je(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": A[0] || (A[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: A[1] || (A[1] = _t((S) => L(Dr)(S, y), ["enter"]))
        }, null, 40, h8), [
          [Yn, o.value]
        ]),
        m("div", m8, [
          m("span", p8, v(l.value), 1),
          I(ve, {
            small: "",
            onClick: p
          }, {
            default: j(() => [...A[3] || (A[3] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          I(ve, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: j(() => [...A[4] || (A[4] = [
              V("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), d("div", g8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", v8, [
            I(re, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", y8, v(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), d("span", b8, "Draft kept")) : k("", !0)
        ]),
        e.count ? (u(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: A[2] || (A[2] = (S) => s("show"))
        }, [
          m("span", null, v(L(Xc)(e.count, "comment")), 1),
          I(re, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, w8 = /* @__PURE__ */ z(k8, [["__scopeId", "data-v-b68baddd"]]), $8 = { wide: 1130 }, x8 = /\{([A-Za-z_]\w*)\}/g;
function Kn(e, t, n = {}) {
  return e.replace(x8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const S8 = (e, t, n, a) => Kn(e.label, n, { row_id: a, id: a }) || Zw(t, n, a), M8 = { class: "comment-side-head" }, _8 = {
  key: 0,
  class: "comment-none"
}, C8 = { key: 0 }, E8 = {
  key: 1,
  class: "comment-none"
}, A8 = {
  class: "comment",
  "data-comment": ""
}, O8 = {
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
    return (t, n) => (u(), d("aside", {
      class: K(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", M8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        I(ma, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), d("p", _8, "No comments yet")) : k("", !0),
      (u(!0), d(D, null, ne(e.comments, (a) => (u(), d("section", {
        key: a.id
      }, [
        a.quote ? (u(), d("blockquote", C8, v(a.quote), 1)) : k("", !0),
        a.revision ? (u(), d("span", E8, "Revision " + v(a.revision), 1)) : k("", !0),
        m("p", A8, v(e.words(a)), 1)
      ]))), 128)),
      I(vn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Cl = /* @__PURE__ */ z(O8, [["__scopeId", "data-v-276284a3"]]), T8 = { class: "resource-heading" }, I8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, B8 = {
  key: 1,
  class: "resource-abstract"
}, R8 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), d("div", T8, [
      e.title ? (u(), d("h2", I8, v(e.title), 1)) : k("", !0),
      e.abstract ? (u(), d("p", B8, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, L8 = /* @__PURE__ */ z(R8, [["__scopeId", "data-v-d65ef53f"]]), N8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, q8 = { class: "inspector-icons" }, D8 = { class: "inspector-icons-start" }, P8 = {
  class: "inspector-label",
  "data-resource-type": ""
}, j8 = { class: "inspector-icons-end" }, F8 = ["href"], W8 = {
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
    const n = e, a = t, s = E(() => `${n.opened.table}:${n.opened.id}`), o = E(() => n.shareable && !n.readOnly), l = E(() => n.backed ? "Close all rows" : "Close");
    return (r, i) => (u(), d("header", N8, [
      m("div", q8, [
        m("span", D8, [
          e.backed ? (u(), F(ve, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: i[0] || (i[0] = (c) => a("back"))
          }, {
            default: j(() => [
              I(re, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (u(), d(D, { key: 1 }, [
            I(ve, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: i[1] || (i[1] = (c) => a("step", -1))
            }, {
              default: j(() => [
                I(re, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            I(ve, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: i[2] || (i[2] = (c) => a("step", 1))
            }, {
              default: j(() => [
                I(re, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        m("p", P8, v(e.label), 1),
        m("span", j8, [
          e.embedded ? (u(), F(ve, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: i[3] || (i[3] = (c) => L(De)(s.value))
          }, {
            default: j(() => [
              I(re, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          o.value ? (u(), d("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this link",
            "aria-label": "Share this link",
            "data-resource-share": "",
            href: L(Lf)(s.value)
          }, [
            I(re, {
              name: "share",
              size: 13
            })
          ], 8, F8)) : k("", !0),
          e.embedded ? k("", !0) : (u(), F(ve, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: i[4] || (i[4] = (c) => a("close"))
          }, {
            default: j(() => [
              I(re, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      I(L8, {
        title: e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, H8 = /* @__PURE__ */ z(W8, [["__scopeId", "data-v-414d2086"]]), z8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, U8 = { class: "field-name" }, G8 = {
  key: 1,
  class: "field-value"
}, V8 = ["onClick"], K8 = {
  key: 2,
  class: "field-value"
}, Y8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), d("section", z8, [
      (u(!0), d(D, null, ne(e.fields, (o) => (u(), d(D, {
        key: o.name
      }, [
        m("p", U8, v(o.label), 1),
        o.isTime ? (u(), F(Ze, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), d("p", G8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, V8)
        ])) : (u(), d("p", K8, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, Q8 = /* @__PURE__ */ z(Y8, [["__scopeId", "data-v-7e45afb5"]]);
async function X8(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: e2(s.value.actor, s.value.creator_agent), owner: a.length ? t2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const J8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Z8 = {
  key: 1,
  class: "inspector-wait"
}, e3 = { class: "inspector-main" }, t3 = { class: "inspector-column" }, n3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, a3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, s3 = { class: "inspector-text" }, o3 = ["innerHTML"], l3 = {
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
    const n = e, a = t, s = /* @__PURE__ */ new Set(["question", "memory", "rule"]), o = E(() => n.catalogue.inspector(n.term) ?? {
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
    }), l = O(null), r = O(""), i = O(""), c = O(""), f = O("details"), h = O(null), p = O(0);
    let y = 0;
    const b = E(() => ({ row_id: n.id, id: n.id })), A = E(() => l.value ? Kn(o.value.title, l.value, b.value) || Jw(n.term, l.value, n.id) : ""), S = E(() => l.value ? S8(o.value, n.term, l.value, n.id) : ""), x = E(() => S.value === A.value ? "" : S.value), B = E(() => l.value ? Kn(o.value.description, l.value, b.value) : ""), W = E(() => {
      var C, R, U;
      return ((C = l.value) == null ? void 0 : C.body) || ((R = l.value) == null ? void 0 : R.brief) || (s.has(n.term) ? (U = l.value) == null ? void 0 : U.text : "") || "";
    }), N = E(() => W.value ? Us(W.value, { env: "", rowNames: !1 }) : ""), w = E(() => n2(l.value, W.value, r.value, i.value)), H = E(() => o.value.comments && p.value >= $8.wide), P = E(() => o.value.comments && !H.value), q = (C) => o.value.components.filter((R) => (R.tab || "") === C).map((R) => R.window), _ = E(() => [...new Set(o.value.components.map((C) => C.tab).filter(Boolean))]), T = E(() => _.value.length || P.value ? [{ key: "details", label: "Details" }, ..._.value.map((C) => ({ key: C, label: C })), ...P.value ? [{ key: "comments", label: "Comments" }] : []] : []), $ = Hr(() => o.value.comments && l.value ? { term: n.term, id: n.id, title: l.value.title } : {}, (C) => n.read(C));
    async function g() {
      const C = ++y, R = await n.read(Kn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      if (C !== y || (c.value = R.ok ? "" : R.error, !R.ok)) return;
      l.value = R.value;
      const U = await X8(n.read, l.value);
      C === y && (r.value = U.creator, i.value = U.owner);
    }
    ge(() => `${n.term}:${n.id}`, () => {
      l.value = null, r.value = "", i.value = "", c.value = "", f.value = "details", g();
    }, { immediate: !0 }), kn(o.value.events, g), ge($.open, (C) => C && P.value && (f.value = "comments"));
    let M = null;
    return _e(() => {
      var C;
      p.value = ((C = h.value) == null ? void 0 : C.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (M = new ResizeObserver(() => p.value = h.value.clientWidth), M.observe(h.value));
    }), Be(() => M == null ? void 0 : M.disconnect()), (C, R) => (u(), d("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      I(H8, {
        label: x.value,
        title: A.value,
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
      c.value ? (u(), d("p", J8, v(c.value), 1)) : l.value ? (u(), d(D, { key: 2 }, [
        I(Xr, null, {
          default: j(() => [
            I(Ws, {
              name: `row.${e.term}`,
              row: { ...l.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: g
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", e3, [
          m("div", t3, [
            T.value.length ? (u(), d("div", n3, [
              I(jt, {
                options: T.value,
                value: f.value,
                onPick: R[3] || (R[3] = (U) => f.value = U)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", a3, [
              I(Ut, { value: f.value }, {
                details: j(() => [
                  m("div", s3, [
                    N.value && !o.value.draws_text ? (u(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, o3)) : k("", !0),
                    o.value.lists_fields ? (u(), F(Q8, {
                      key: 1,
                      fields: w.value,
                      onPeek: R[4] || (R[4] = (U) => a("open", U))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  I(ys, {
                    "slot-name": `inspector.${e.term}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  I(Cl, {
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
                  I(ys, {
                    names: q(f.value),
                    row: { ...l.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), F(f8, {
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
            o.value.comments ? (u(), F(w8, {
              key: 1,
              send: L($).send,
              count: L($).total.value,
              onShow: R[7] || (R[7] = (U) => P.value && (f.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          H.value ? (u(), F(Cl, {
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
      ], 64)) : (u(), d("div", Z8, [
        I(Ke)
      ]))
    ], 512));
  }
}, r3 = /* @__PURE__ */ z(l3, [["__scopeId", "data-v-4e283d29"]]), iC = {
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
    const t = Me(Ps);
    return (n, a) => (u(), F(r3, Pe(n.$props, {
      catalogue: L(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, i3 = { class: "facts" }, u3 = { class: "fact wide" }, c3 = ["title"], d3 = {
  key: 1,
  class: "fact-value"
}, f3 = {
  key: 0,
  class: "fact"
}, h3 = { class: "fact-value" }, m3 = { class: "fact" }, p3 = { class: "fact-label" }, g3 = ["title"], v3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, y3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, b3 = {
  key: 2,
  class: "fact"
}, k3 = { class: "fact-value" }, w3 = { class: "fact wide" }, $3 = { class: "fact-label" }, x3 = { class: "fact wide" }, S3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, M3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = na.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, c;
      return u(), d("div", i3, [
        m("div", u3, [
          r[4] || (r[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (u(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (f) => L(De)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, c3)) : (u(), d("span", d3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (u(), d("div", f3, [
          r[5] || (r[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", h3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (u(), d(D, { key: 1 }, [
          m("div", m3, [
            m("span", p3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (f) => L(De)(`agents:${e.task.helper_id}`))
            }, v(e.task.helper_name), 9, g3)
          ]),
          L(o).has(e.task.state) && e.task.holder_id ? (u(), d("p", v3, v(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), d("p", y3, v(e.task.helper_name) + " takes it after the task it is on.", 1)) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), d("div", b3, [
          r[6] || (r[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", k3, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", w3, [
          m("span", $3, [
            r[7] || (r[7] = V(" Complexity ", -1)),
            I(sr, {
              lines: L(Qr).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          I(jt, {
            options: L(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", x3, [
          r[8] || (r[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          I(jt, {
            options: L(n),
            value: String(L(Yr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), d("p", S3, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, _3 = /* @__PURE__ */ z(M3, [["__scopeId", "data-v-95418036"]]);
function C3(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, c]) => c === i).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((c) => !s.has(c)))
    i.forEach((c) => s.add(c)), o.push(i.map((c) => n.get(c)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([c]) => c === e); i && !r.has(i[1]); i = t.edges.find(([c]) => c === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const E3 = { class: "number" }, A3 = { class: "title" }, O3 = { class: "word" }, T3 = {
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
    return (a, s) => (u(), F(ut(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: K(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        I(va, { status: e.status }, null, 8, ["status"]),
        m("span", E3, v(e.number), 1),
        m("span", A3, v(e.title), 1),
        m("span", O3, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, as = /* @__PURE__ */ z(T3, [["__scopeId", "data-v-f6417ae8"]]), I3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, B3 = { class: "level" }, R3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1);
    ge(() => n.task.id, () => s.value = !1);
    const o = E(() => C3(n.task.id, n.graph)), l = E(() => s.value ? o.value.above : o.value.above.slice(-1)), r = E(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = E(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, p = !1) => ({ status: cn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), d("section", I3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), d(D, null, ne(l.value, (y) => (u(), d(D, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", B3, [
          (u(!0), d(D, null, ne(y, (b) => (u(), F(as, Pe({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (A) => a("select", A))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      I(as, nu(au(f(e.task, !0))), null, 16),
      (u(!0), d(D, null, ne(r.value, (y) => (u(), d(D, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        I(as, Pe({ ref_for: !0 }, f(y), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (u(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, L3 = /* @__PURE__ */ z(R3, [["__scopeId", "data-v-79c52417"]]), N3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, q3 = ["datetime"], D3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), d("section", N3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), d(D, null, ne(e.renewals, (a) => (u(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, q3),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, P3 = /* @__PURE__ */ z(D3, [["__scopeId", "data-v-b41f213b"]]), j3 = {
  class: "part",
  "data-resource-waits": ""
}, F3 = ["onClick"], W3 = { class: "wait-id" }, H3 = { class: "wait-title" }, z3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), d("section", j3, [
      m("h4", null, v(e.title), 1),
      (u(!0), d(D, null, ne(e.waits, (o) => (u(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        I(va, {
          status: L(cn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", W3, v(o.id), 1),
        m("span", H3, v(o.title), 1)
      ], 8, F3))), 128))
    ]));
  }
}, El = /* @__PURE__ */ z(z3, [["__scopeId", "data-v-8fb2e251"]]), U3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, G3 = { class: "text" }, V3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, K3 = 180, Y3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = O(!1), l = E(() => a.task.waits.filter((i) => !n.has(i.state))), r = E(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, c) => (u(), d(D, null, [
      l.value.length ? (u(), F(El, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), d("section", U3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", G3, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (u(), d("section", V3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: K(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > K3 && !o.value ? (u(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      r.value.length ? (u(), F(El, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, Q3 = /* @__PURE__ */ z(Y3, [["__scopeId", "data-v-4a3f1e79"]]), X3 = {
  class: "task-details",
  "data-task-details": ""
}, J3 = { class: "since" }, Z3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, eS = { class: "text" }, tS = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, nS = {
  key: 1,
  class: "note"
}, aS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, sS = { class: "text" }, oS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), d("div", X3, [
        m("div", {
          class: K(["state-line", L(cn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            I(va, {
              status: L(cn)(e.task.state)
            }, null, 8, ["status"]),
            V(" " + v(a(e.task.state)), 1)
          ]),
          m("span", J3, [
            o[5] || (o[5] = V(" since ", -1)),
            I(Ze, {
              at: L(fh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), d("section", Z3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", eS, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), d("p", tS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (u(), d("p", nS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), d("section", aS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", sS, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (u(), F(L3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : k("", !0),
        I(_3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        I(Q3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        I(P3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, uC = /* @__PURE__ */ z(oS, [["__scopeId", "data-v-7e73fa21"]]), lS = 50, rS = { messages: 25 }, iS = (e) => rS[e] || lS, uS = {
  class: "task-log",
  "aria-label": "Task log"
}, cS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, dS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, fS = { class: "entries" }, hS = ["data-task-log-important"], mS = ["datetime"], pS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, gS = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = O([]), a = O(1), s = O(!0), o = O(!0), l = O("");
    let r = 0;
    async function i(c = 1) {
      const f = ++r;
      a.value = c, o.value = !0, l.value = "";
      const h = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(iS("task_logs")),
        "--page",
        String(c)
      ]);
      f === r && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return ge(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), et(() => {
      r += 1;
    }), (c, f) => (u(), d("section", uS, [
      o.value ? (u(), F(Ke, { key: 0 })) : l.value ? (u(), d(D, { key: 1 }, [
        m("p", cS, v(l.value), 1),
        I(ve, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => i(a.value))
        }, {
          default: j(() => [...f[3] || (f[3] = [
            V("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), d(D, { key: 2 }, [
        n.value.length ? k("", !0) : (u(), d("p", dS, "No log entries yet.")),
        m("ol", fS, [
          (u(!0), d(D, null, ne(n.value, (h) => (u(), d("li", {
            key: h.id,
            class: K(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, mS),
            m("p", null, v(h.line), 1)
          ], 10, hS))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), d("nav", pS, [
          I(ve, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => i(a.value - 1))
          }, {
            default: j(() => [...f[4] || (f[4] = [
              V("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          I(ve, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => i(a.value + 1))
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
}, cC = /* @__PURE__ */ z(gS, [["__scopeId", "data-v-cfa43bf1"]]);
function vS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ss = { exports: {} }, Al;
function yS() {
  return Al || (Al = 1, (function(e, t) {
    var n = (function() {
      var a = function(w, H) {
        var P = 236, q = 17, _ = w, T = o[H], $ = null, g = 0, M = null, C = [], R = {}, U = function(Y, Q) {
          g = _ * 4 + 17, $ = (function(G) {
            for (var X = new Array(G), J = 0; J < G; J += 1) {
              X[J] = new Array(G);
              for (var ae = 0; ae < G; ae += 1)
                X[J][ae] = null;
            }
            return X;
          })(g), Z(0, 0), Z(g - 7, 0), Z(0, g - 7), ie(), pe(), ce(Y, Q), _ >= 7 && we(Y), M == null && (M = oe(_, T, C)), te(M, Q);
        }, Z = function(Y, Q) {
          for (var G = -1; G <= 7; G += 1)
            if (!(Y + G <= -1 || g <= Y + G))
              for (var X = -1; X <= 7; X += 1)
                Q + X <= -1 || g <= Q + X || (0 <= G && G <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= X && X <= 4 ? $[Y + G][Q + X] = !0 : $[Y + G][Q + X] = !1);
        }, ee = function() {
          for (var Y = 0, Q = 0, G = 0; G < 8; G += 1) {
            U(!0, G);
            var X = r.getLostPoint(R);
            (G == 0 || Y > X) && (Y = X, Q = G);
          }
          return Q;
        }, pe = function() {
          for (var Y = 8; Y < g - 8; Y += 1)
            $[Y][6] == null && ($[Y][6] = Y % 2 == 0);
          for (var Q = 8; Q < g - 8; Q += 1)
            $[6][Q] == null && ($[6][Q] = Q % 2 == 0);
        }, ie = function() {
          for (var Y = r.getPatternPosition(_), Q = 0; Q < Y.length; Q += 1)
            for (var G = 0; G < Y.length; G += 1) {
              var X = Y[Q], J = Y[G];
              if ($[X][J] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? $[X + ae][J + de] = !0 : $[X + ae][J + de] = !1;
            }
        }, we = function(Y) {
          for (var Q = r.getBCHTypeNumber(_), G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[Math.floor(G / 3)][G % 3 + g - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[G % 3 + g - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, ce = function(Y, Q) {
          for (var G = T << 3 | Q, X = r.getBCHTypeInfo(G), J = 0; J < 15; J += 1) {
            var ae = !Y && (X >> J & 1) == 1;
            J < 6 ? $[J][8] = ae : J < 8 ? $[J + 1][8] = ae : $[g - 15 + J][8] = ae;
          }
          for (var J = 0; J < 15; J += 1) {
            var ae = !Y && (X >> J & 1) == 1;
            J < 8 ? $[8][g - J - 1] = ae : J < 9 ? $[8][15 - J - 1 + 1] = ae : $[8][15 - J - 1] = ae;
          }
          $[g - 8][8] = !Y;
        }, te = function(Y, Q) {
          for (var G = -1, X = g - 1, J = 7, ae = 0, de = r.getMaskFunction(Q), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var xe = 0; xe < 2; xe += 1)
                if ($[X][ue - xe] == null) {
                  var Ae = !1;
                  ae < Y.length && (Ae = (Y[ae] >>> J & 1) == 1);
                  var me = de(X, ue - xe);
                  me && (Ae = !Ae), $[X][ue - xe] = Ae, J -= 1, J == -1 && (ae += 1, J = 7);
                }
              if (X += G, X < 0 || g <= X) {
                X -= G, G = -G;
                break;
              }
            }
        }, se = function(Y, Q) {
          for (var G = 0, X = 0, J = 0, ae = new Array(Q.length), de = new Array(Q.length), ue = 0; ue < Q.length; ue += 1) {
            var xe = Q[ue].dataCount, Ae = Q[ue].totalCount - xe;
            X = Math.max(X, xe), J = Math.max(J, Ae), ae[ue] = new Array(xe);
            for (var me = 0; me < ae[ue].length; me += 1)
              ae[ue][me] = 255 & Y.getBuffer()[me + G];
            G += xe;
            var Fe = r.getErrorCorrectPolynomial(Ae), We = c(ae[ue], Fe.getLength() - 1), ho = We.mod(Fe);
            de[ue] = new Array(Fe.getLength() - 1);
            for (var me = 0; me < de[ue].length; me += 1) {
              var mo = me + ho.getLength() - de[ue].length;
              de[ue][me] = mo >= 0 ? ho.getAt(mo) : 0;
            }
          }
          for (var po = 0, me = 0; me < Q.length; me += 1)
            po += Q[me].totalCount;
          for (var xa = new Array(po), _n = 0, me = 0; me < X; me += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              me < ae[ue].length && (xa[_n] = ae[ue][me], _n += 1);
          for (var me = 0; me < J; me += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              me < de[ue].length && (xa[_n] = de[ue][me], _n += 1);
          return xa;
        }, oe = function(Y, Q, G) {
          for (var X = f.getRSBlocks(Y, Q), J = h(), ae = 0; ae < G.length; ae += 1) {
            var de = G[ae];
            J.put(de.getMode(), 4), J.put(de.getLength(), r.getLengthInBits(de.getMode(), Y)), de.write(J);
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
              G = A(Y);
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
              for (var Q = f.getRSBlocks(Y, T), G = h(), X = 0; X < C.length; X++) {
                var J = C[X];
                G.put(J.getMode(), 4), G.put(J.getLength(), r.getLengthInBits(J.getMode(), Y)), J.write(G);
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
          var ae = R.getModuleCount() * Y + Q * 2, de, ue, xe, Ae, me = "", Fe;
          for (Fe = "l" + Y + ",0 0," + Y + " -" + Y + ",0 0,-" + Y + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += J.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', me += ' viewBox="0 0 ' + ae + " " + ae + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += X.text || G.text ? ' role="img" aria-labelledby="' + nt([X.id, G.id].join(" ").trim()) + '"' : "", me += ">", me += X.text ? '<title id="' + nt(X.id) + '">' + nt(X.text) + "</title>" : "", me += G.text ? '<description id="' + nt(G.id) + '">' + nt(G.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', xe = 0; xe < R.getModuleCount(); xe += 1)
            for (Ae = xe * Y + Q, de = 0; de < R.getModuleCount(); de += 1)
              R.isDark(xe, de) && (ue = de * Y + Q, me += "M" + ue + "," + Ae + Fe);
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
        }, zi = function(Y) {
          var Q = 1;
          Y = typeof Y > "u" ? Q * 2 : Y;
          var G = R.getModuleCount() * Q + Y * 2, X = Y, J = G - Y, ae, de, ue, xe, Ae, me = {
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
              Ae = "█", X <= de && de < J && X <= ae && ae < J && R.isDark(ue, Math.floor((de - X) / Q)) && (Ae = " "), X <= de && de < J && X <= ae + 1 && ae + 1 < J && R.isDark(xe, Math.floor((de - X) / Q)) ? Ae += " " : Ae += "█", We += Y < 1 && ae + 1 >= J ? Fe[Ae] : me[Ae];
            We += `
`;
          }
          return G % 2 && Y > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return R.createASCII = function(Y, Q) {
          if (Y = Y || 1, Y < 2)
            return zi(Q);
          Y -= 1, Q = typeof Q > "u" ? Y * 2 : Q;
          var G = R.getModuleCount() * Y + Q * 2, X = Q, J = G - Q, ae, de, ue, xe, Ae = Array(Y + 1).join("██"), me = Array(Y + 1).join("  "), Fe = "", We = "";
          for (ae = 0; ae < G; ae += 1) {
            for (ue = Math.floor((ae - X) / Y), We = "", de = 0; de < G; de += 1)
              xe = 1, X <= de && de < J && X <= ae && ae < J && R.isDark(ue, Math.floor((de - X) / Y)) && (xe = 0), We += xe ? Ae : me;
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
          for (var H = [], P = 0; P < w.length; P += 1) {
            var q = w.charCodeAt(P);
            H.push(q & 255);
          }
          return H;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(w, H) {
        var P = (function() {
          for (var _ = B(w), T = function() {
            var pe = _.read();
            if (pe == -1) throw "eof";
            return pe;
          }, $ = 0, g = {}; ; ) {
            var M = _.read();
            if (M == -1) break;
            var C = T(), R = T(), U = T(), Z = String.fromCharCode(M << 8 | C), ee = R << 8 | U;
            g[Z] = ee, $ += 1;
          }
          if ($ != H)
            throw $ + " != " + H;
          return g;
        })(), q = 63;
        return function(_) {
          for (var T = [], $ = 0; $ < _.length; $ += 1) {
            var g = _.charCodeAt($);
            if (g < 128)
              T.push(g);
            else {
              var M = P[_.charAt($)];
              typeof M == "number" ? (M & 255) == M ? T.push(M) : (T.push(M >>> 8), T.push(M & 255)) : T.push(q);
            }
          }
          return T;
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
        ], H = 1335, P = 7973, q = 21522, _ = {}, T = function($) {
          for (var g = 0; $ != 0; )
            g += 1, $ >>>= 1;
          return g;
        };
        return _.getBCHTypeInfo = function($) {
          for (var g = $ << 10; T(g) - T(H) >= 0; )
            g ^= H << T(g) - T(H);
          return ($ << 10 | g) ^ q;
        }, _.getBCHTypeNumber = function($) {
          for (var g = $ << 12; T(g) - T(P) >= 0; )
            g ^= P << T(g) - T(P);
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
            g = g.multiply(c([1, i.gexp(M)], 0));
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
              var ie = 0;
              $.isDark(C, R) && (ie += 1), $.isDark(C + 1, R) && (ie += 1), $.isDark(C, R + 1) && (ie += 1), $.isDark(C + 1, R + 1) && (ie += 1), (ie == 0 || ie == 4) && (M += 3);
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
      })(), i = (function() {
        for (var w = new Array(256), H = new Array(256), P = 0; P < 8; P += 1)
          w[P] = 1 << P;
        for (var P = 8; P < 256; P += 1)
          w[P] = w[P - 4] ^ w[P - 5] ^ w[P - 6] ^ w[P - 8];
        for (var P = 0; P < 255; P += 1)
          H[w[P]] = P;
        var q = {};
        return q.glog = function(_) {
          if (_ < 1)
            throw "glog(" + _ + ")";
          return H[_];
        }, q.gexp = function(_) {
          for (; _ < 0; )
            _ += 255;
          for (; _ >= 256; )
            _ -= 255;
          return w[_];
        }, q;
      })();
      function c(w, H) {
        if (typeof w.length > "u")
          throw w.length + "/" + H;
        var P = (function() {
          for (var _ = 0; _ < w.length && w[_] == 0; )
            _ += 1;
          for (var T = new Array(w.length - _ + H), $ = 0; $ < w.length - _; $ += 1)
            T[$] = w[$ + _];
          return T;
        })(), q = {};
        return q.getAt = function(_) {
          return P[_];
        }, q.getLength = function() {
          return P.length;
        }, q.multiply = function(_) {
          for (var T = new Array(q.getLength() + _.getLength() - 1), $ = 0; $ < q.getLength(); $ += 1)
            for (var g = 0; g < _.getLength(); g += 1)
              T[$ + g] ^= i.gexp(i.glog(q.getAt($)) + i.glog(_.getAt(g)));
          return c(T, 0);
        }, q.mod = function(_) {
          if (q.getLength() - _.getLength() < 0)
            return q;
          for (var T = i.glog(q.getAt(0)) - i.glog(_.getAt(0)), $ = new Array(q.getLength()), g = 0; g < q.getLength(); g += 1)
            $[g] = q.getAt(g);
          for (var g = 0; g < _.getLength(); g += 1)
            $[g] ^= i.gexp(i.glog(_.getAt(g)) + T);
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
        ], H = function(_, T) {
          var $ = {};
          return $.totalCount = _, $.dataCount = T, $;
        }, P = {}, q = function(_, T) {
          switch (T) {
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
        return P.getRSBlocks = function(_, T) {
          var $ = q(_, T);
          if (typeof $ > "u")
            throw "bad rs block @ typeNumber:" + _ + "/errorCorrectionLevel:" + T;
          for (var g = $.length / 3, M = [], C = 0; C < g; C += 1)
            for (var R = $[C * 3 + 0], U = $[C * 3 + 1], Z = $[C * 3 + 2], ee = 0; ee < R; ee += 1)
              M.push(H(U, Z));
          return M;
        }, P;
      })(), h = function() {
        var w = [], H = 0, P = {};
        return P.getBuffer = function() {
          return w;
        }, P.getAt = function(q) {
          var _ = Math.floor(q / 8);
          return (w[_] >>> 7 - q % 8 & 1) == 1;
        }, P.put = function(q, _) {
          for (var T = 0; T < _; T += 1)
            P.putBit((q >>> _ - T - 1 & 1) == 1);
        }, P.getLengthInBits = function() {
          return H;
        }, P.putBit = function(q) {
          var _ = Math.floor(H / 8);
          w.length <= _ && w.push(0), q && (w[_] |= 128 >>> H % 8), H += 1;
        }, P;
      }, p = function(w) {
        var H = s.MODE_NUMBER, P = w, q = {};
        q.getMode = function() {
          return H;
        }, q.getLength = function($) {
          return P.length;
        }, q.write = function($) {
          for (var g = P, M = 0; M + 2 < g.length; )
            $.put(_(g.substring(M, M + 3)), 10), M += 3;
          M < g.length && (g.length - M == 1 ? $.put(_(g.substring(M, M + 1)), 4) : g.length - M == 2 && $.put(_(g.substring(M, M + 2)), 7));
        };
        var _ = function($) {
          for (var g = 0, M = 0; M < $.length; M += 1)
            g = g * 10 + T($.charAt(M));
          return g;
        }, T = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          throw "illegal char :" + $;
        };
        return q;
      }, y = function(w) {
        var H = s.MODE_ALPHA_NUM, P = w, q = {};
        q.getMode = function() {
          return H;
        }, q.getLength = function(T) {
          return P.length;
        }, q.write = function(T) {
          for (var $ = P, g = 0; g + 1 < $.length; )
            T.put(
              _($.charAt(g)) * 45 + _($.charAt(g + 1)),
              11
            ), g += 2;
          g < $.length && T.put(_($.charAt(g)), 6);
        };
        var _ = function(T) {
          if ("0" <= T && T <= "9")
            return T.charCodeAt(0) - 48;
          if ("A" <= T && T <= "Z")
            return T.charCodeAt(0) - 65 + 10;
          switch (T) {
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
              throw "illegal char :" + T;
          }
        };
        return q;
      }, b = function(w) {
        var H = s.MODE_8BIT_BYTE, P = a.stringToBytes(w), q = {};
        return q.getMode = function() {
          return H;
        }, q.getLength = function(_) {
          return P.length;
        }, q.write = function(_) {
          for (var T = 0; T < P.length; T += 1)
            _.put(P[T], 8);
        }, q;
      }, A = function(w) {
        var H = s.MODE_KANJI, P = a.stringToBytesFuncs.SJIS;
        if (!P)
          throw "sjis not supported.";
        (function(T, $) {
          var g = P(T);
          if (g.length != 2 || (g[0] << 8 | g[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var q = P(w), _ = {};
        return _.getMode = function() {
          return H;
        }, _.getLength = function(T) {
          return ~~(q.length / 2);
        }, _.write = function(T) {
          for (var $ = q, g = 0; g + 1 < $.length; ) {
            var M = (255 & $[g]) << 8 | 255 & $[g + 1];
            if (33088 <= M && M <= 40956)
              M -= 33088;
            else if (57408 <= M && M <= 60351)
              M -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + M;
            M = (M >>> 8 & 255) * 192 + (M & 255), T.put(M, 13), g += 2;
          }
          if (g < $.length)
            throw "illegal char at " + (g + 1);
        }, _;
      }, S = function() {
        var w = [], H = {};
        return H.writeByte = function(P) {
          w.push(P & 255);
        }, H.writeShort = function(P) {
          H.writeByte(P), H.writeByte(P >>> 8);
        }, H.writeBytes = function(P, q, _) {
          q = q || 0, _ = _ || P.length;
          for (var T = 0; T < _; T += 1)
            H.writeByte(P[T + q]);
        }, H.writeString = function(P) {
          for (var q = 0; q < P.length; q += 1)
            H.writeByte(P.charCodeAt(q));
        }, H.toByteArray = function() {
          return w;
        }, H.toString = function() {
          var P = "";
          P += "[";
          for (var q = 0; q < w.length; q += 1)
            q > 0 && (P += ","), P += w[q];
          return P += "]", P;
        }, H;
      }, x = function() {
        var w = 0, H = 0, P = 0, q = "", _ = {}, T = function(g) {
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
          for (w = w << 8 | g & 255, H += 8, P += 1; H >= 6; )
            T(w >>> H - 6), H -= 6;
        }, _.flush = function() {
          if (H > 0 && (T(w << 6 - H), w = 0, H = 0), P % 3 != 0)
            for (var g = 3 - P % 3, M = 0; M < g; M += 1)
              q += "=";
        }, _.toString = function() {
          return q;
        }, _;
      }, B = function(w) {
        var H = w, P = 0, q = 0, _ = 0, T = {};
        T.read = function() {
          for (; _ < 8; ) {
            if (P >= H.length) {
              if (_ == 0)
                return -1;
              throw "unexpected end of file./" + _;
            }
            var g = H.charAt(P);
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
        return T;
      }, W = function(w, H) {
        var P = w, q = H, _ = new Array(w * H), T = {};
        T.setPixel = function(C, R, U) {
          _[R * P + C] = U;
        }, T.write = function(C) {
          C.writeString("GIF87a"), C.writeShort(P), C.writeShort(q), C.writeByte(128), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(255), C.writeByte(255), C.writeByte(255), C.writeString(","), C.writeShort(0), C.writeShort(0), C.writeShort(P), C.writeShort(q), C.writeByte(0);
          var R = 2, U = g(R);
          C.writeByte(R);
          for (var Z = 0; U.length - Z > 255; )
            C.writeByte(255), C.writeBytes(U, Z, 255), Z += 255;
          C.writeByte(U.length - Z), C.writeBytes(U, Z, U.length - Z), C.writeByte(0), C.writeString(";");
        };
        var $ = function(C) {
          var R = C, U = 0, Z = 0, ee = {};
          return ee.write = function(pe, ie) {
            if (pe >>> ie)
              throw "length over";
            for (; U + ie >= 8; )
              R.writeByte(255 & (pe << U | Z)), ie -= 8 - U, pe >>>= 8 - U, Z = 0, U = 0;
            Z = pe << U | Z, U = U + ie;
          }, ee.flush = function() {
            U > 0 && R.writeByte(Z);
          }, ee;
        }, g = function(C) {
          for (var R = 1 << C, U = (1 << C) + 1, Z = C + 1, ee = M(), pe = 0; pe < R; pe += 1)
            ee.add(String.fromCharCode(pe));
          ee.add(String.fromCharCode(R)), ee.add(String.fromCharCode(U));
          var ie = S(), we = $(ie);
          we.write(R, Z);
          var ce = 0, te = String.fromCharCode(_[ce]);
          for (ce += 1; ce < _.length; ) {
            var se = String.fromCharCode(_[ce]);
            ce += 1, ee.contains(te + se) ? te = te + se : (we.write(ee.indexOf(te), Z), ee.size() < 4095 && (ee.size() == 1 << Z && (Z += 1), ee.add(te + se)), te = se);
          }
          return we.write(ee.indexOf(te), Z), we.write(U, Z), we.flush(), ie.toByteArray();
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
        return T;
      }, N = function(w, H, P) {
        for (var q = W(w, H), _ = 0; _ < H; _ += 1)
          for (var T = 0; T < w; T += 1)
            q.setPixel(T, _, P(T, _));
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
  })(ss)), ss.exports;
}
var bS = yS();
const kS = /* @__PURE__ */ vS(bS), wS = ["width", "height", "viewBox"], $S = ["width", "height"], xS = ["d"], SS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = E(() => {
      const a = kS(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (u(), d("svg", {
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
      }, null, 8, $S),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, xS)
    ], 8, wS));
  }
}, dC = /* @__PURE__ */ z(SS, [["__scopeId", "data-v-489f0852"]]), MS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, fC = /* @__PURE__ */ z(MS, [["__scopeId", "data-v-47e67f04"]]);
function hC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const mC = su(() => import("./VoiceFigure-C45qbgBW.js").then((e) => e.V)), pC = "1.2.0", gC = "3.5";
export {
  Tf as $,
  Oe as A,
  Ie as B,
  ba as C,
  ct as D,
  g_ as E,
  _$ as F,
  lM as G,
  f_ as H,
  l$ as I,
  B$ as J,
  Ot as K,
  AS as L,
  lo as M,
  P$ as N,
  I$ as O,
  ya as P,
  IM as Q,
  P6 as R,
  Gn as S,
  qM as T,
  T6 as U,
  Te as V,
  sa as W,
  O6 as X,
  A6 as Y,
  Of as Z,
  z as _,
  w6 as a,
  e_ as a$,
  q$ as a0,
  j6 as a1,
  F6 as a2,
  Ne as a3,
  J6 as a4,
  X6 as a5,
  Ct as a6,
  W6 as a7,
  cM as a8,
  c6 as a9,
  GM as aA,
  AM as aB,
  Y5 as aC,
  mM as aD,
  pM as aE,
  v_ as aF,
  _i as aG,
  NM as aH,
  $n as aI,
  g6 as aJ,
  h6 as aK,
  l_ as aL,
  xn as aM,
  c_ as aN,
  oM as aO,
  OM as aP,
  TM as aQ,
  EM as aR,
  hn as aS,
  St as aT,
  d6 as aU,
  P2 as aV,
  _M as aW,
  q6 as aX,
  Si as aY,
  Wt as aZ,
  Kt as a_,
  t_ as aa,
  i_ as ab,
  b6 as ac,
  I6 as ad,
  B6 as ae,
  Y6 as af,
  Q6 as ag,
  Z6 as ah,
  M6 as ai,
  bl as aj,
  H6 as ak,
  uM as al,
  w_ as am,
  $M as an,
  kM as ao,
  bM as ap,
  eM as aq,
  V6 as ar,
  G6 as as,
  K6 as at,
  LM as au,
  iM as av,
  dM as aw,
  S_ as ax,
  tn as ay,
  fM as az,
  Q$ as b,
  x_ as b$,
  $$ as b0,
  u_ as b1,
  jM as b2,
  PM as b3,
  u5 as b4,
  di as b5,
  XM as b6,
  rM as b7,
  $a as b8,
  mt as b9,
  WM as bA,
  KM as bB,
  vt as bC,
  DM as bD,
  YM as bE,
  hM as bF,
  xM as bG,
  gM as bH,
  Le as bI,
  sM as bJ,
  QM as bK,
  I_ as bL,
  B_ as bM,
  i6 as bN,
  W2 as bO,
  nM as bP,
  HM as bQ,
  $6 as bR,
  k_ as bS,
  FM as bT,
  zM as bU,
  UM as bV,
  tM as bW,
  Q5 as bX,
  aM as bY,
  yM as bZ,
  b_,
  VM as ba,
  Ua as bb,
  Mr as bc,
  __ as bd,
  A_ as be,
  RM as bf,
  o_ as bg,
  u6 as bh,
  wM as bi,
  C_ as bj,
  z6 as bk,
  U6 as bl,
  C6 as bm,
  D6 as bn,
  p6 as bo,
  a_ as bp,
  x6 as bq,
  S6 as br,
  E6 as bs,
  MM as bt,
  R2 as bu,
  d_ as bv,
  T$ as bw,
  _6 as bx,
  v6 as by,
  SM as bz,
  i5 as c,
  FS as c$,
  m6 as c0,
  f6 as c1,
  vM as c2,
  O_ as c3,
  fo as c4,
  T_ as c5,
  Fi as c6,
  s_ as c7,
  L6 as c8,
  R6 as c9,
  CS as cA,
  Vt as cB,
  Dd as cC,
  iC as cD,
  lC as cE,
  re as cF,
  sr as cG,
  K_ as cH,
  DS as cI,
  pC as cJ,
  gC as cK,
  XS as cL,
  X_ as cM,
  ks as cN,
  a6 as cO,
  Bw as cP,
  ze as cQ,
  Mt as cR,
  ha as cS,
  GS as cT,
  JS as cU,
  kc as cV,
  hw as cW,
  na as cX,
  sC as cY,
  PS as cZ,
  jS as c_,
  D2 as ca,
  y6 as cb,
  A$ as cc,
  CM as cd,
  ao as ce,
  z5 as cf,
  BM as cg,
  nn as ch,
  Dt as ci,
  HS as cj,
  US as ck,
  V_ as cl,
  ve as cm,
  hf as cn,
  Ws as co,
  ma as cp,
  Iv as cq,
  pa as cr,
  oC as cs,
  r6 as ct,
  zS as cu,
  Lv as cv,
  Nr as cw,
  ln as cx,
  Zs as cy,
  R_ as cz,
  Ve as d,
  QS as d$,
  KS as d0,
  rC as d1,
  dC as d2,
  Pr as d3,
  Yc as d4,
  U_ as d5,
  Zy as d6,
  RS as d7,
  o6 as d8,
  z4 as d9,
  wp as dA,
  Fo as dB,
  Ks as dC,
  fd as dD,
  nC as dE,
  tC as dF,
  qs as dG,
  dd as dH,
  Ls as dI,
  xm as dJ,
  aC as dK,
  l6 as dL,
  Rr as dM,
  _p as dN,
  WS as dO,
  Yk as dP,
  s6 as dQ,
  n6 as dR,
  q_ as dS,
  am as dT,
  L_ as dU,
  IS as dV,
  Z_ as dW,
  _w as dX,
  f4 as dY,
  Yr as dZ,
  NS as d_,
  jt as da,
  ZS as db,
  Ke as dc,
  bt as dd,
  Hg as de,
  ad as df,
  Am as dg,
  t6 as dh,
  LS as di,
  Ut as dj,
  Q_ as dk,
  Y_ as dl,
  L3 as dm,
  uC as dn,
  cC as dp,
  va as dq,
  jd as dr,
  ot as ds,
  e6 as dt,
  Ze as du,
  mC as dv,
  fC as dw,
  Qs as dx,
  j_ as dy,
  Is as dz,
  N6 as e,
  P_ as e0,
  F_ as e1,
  De as e2,
  xp as e3,
  VS as e4,
  $c as e5,
  N_ as e6,
  Zr as e7,
  D_ as e8,
  Nl as e9,
  YS as ea,
  BS as eb,
  TS as ec,
  rn as ed,
  Jl as ee,
  hd as ef,
  qS as eg,
  gt as eh,
  hC as ei,
  h4 as ej,
  ES as ek,
  OS as el,
  G_ as em,
  Br as en,
  J_ as eo,
  ei as ep,
  Kl as eq,
  Z4 as er,
  Bs as es,
  W_ as et,
  os as eu,
  H_ as ev,
  z_ as ew,
  tt as ex,
  eC as ey,
  Qn as ez,
  B2 as f,
  M_ as g,
  mn as h,
  h_ as i,
  E_ as j,
  m_ as k,
  n_ as l,
  t4 as m,
  ro as n,
  r_ as o,
  k6 as p,
  p_ as q,
  Pi as r,
  ji as s,
  Ee as t,
  d5 as u,
  JM as v,
  $_ as w,
  ZM as x,
  Mn as y,
  y_ as z
};
