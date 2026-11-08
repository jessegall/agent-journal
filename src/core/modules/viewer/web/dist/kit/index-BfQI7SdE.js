/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as ve, unref as L, renderSlot as fe, createElementVNode as m, normalizeClass as V, Fragment as D, renderList as ae, defineComponent as zr, Comment as Ur, h as ua, cloneVNode as Gr, createBlock as F, withCtx as j, createVNode as T, toDisplayString as v, createCommentVNode as k, ref as O, inject as Se, watch as me, onMounted as Me, onBeforeUnmount as et, reactive as Ht, shallowRef as Xe, onUnmounted as Ie, useAttrs as ca, computed as E, resolveDynamicComponent as rt, mergeProps as Pe, useId as Es, resolveDirective as Vr, withDirectives as Je, createTextVNode as K, Teleport as da, nextTick as je, Transition as zt, withModifiers as $e, createApp as Kr, shallowReactive as Yr, withKeys as Mt, onScopeDispose as fa, useModel as on, mergeModels as Pt, toRef as xa, vModelText as Yn, resolveComponent as Qr, provide as Tl, onErrorCaptured as Xr, TransitionGroup as As, isRef as mo, getCurrentInstance as Jr, getCurrentScope as Il, createSlots as Zr, vShow as Bl, useSlots as eu, normalizeProps as tu, guardReactiveProps as nu, defineAsyncComponent as au } from "vue";
function Rl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, su = 1600, ou = {
  __name: "Shimmer",
  setup(e) {
    const t = Rl(su);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: ve(L(t))
    }, null, 4));
  }
}, Zt = /* @__PURE__ */ U(ou, [["__scopeId", "data-v-6c018b03"]]), lu = { class: "skeleton-line" }, iu = 2e3, ru = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Rl(iu);
    return (n, a) => (u(), f("span", lu, [
      fe(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: V(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(D, null, ae(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: V(["bar", { still: e.still }]),
          style: ve({ ...L(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, yt = /* @__PURE__ */ U(ru, [["__scopeId", "data-v-484fe8a0"]]), Ut = zr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Ur);
      return a.length !== 1 ? ua(D, { key: n }, a) : a[0].key == null ? Gr(a[0], { key: n }) : a[0];
    };
  }
}), uu = ["aria-label"], cu = ["aria-label"], du = ["aria-label"], fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], gu = {
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
    ], l = ["94%", "88%", "91%", "62%"].map((r) => ({ width: r, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (r, c) => (u(), F(Ut, { value: e.shape }, {
      messages: j(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), f(D, null, ae(t, (d) => T(Zt, {
            key: d.id,
            class: V(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, uu)
      ]),
      older: j(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(t.slice(0, 3), (d) => (u(), F(Zt, {
            key: d.id,
            class: V(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, cu)
      ]),
      cards: j(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(D, null, ae(n, (h) => T(yt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, du)
      ]),
      file: j(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            T(yt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(D, null, ae(s, (h) => T(yt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, fu)
      ]),
      page: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          T(yt, {
            class: "skeleton-heading",
            bars: i
          }),
          (u(!0), f(D, null, ae(e.count, (d) => (u(), F(yt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, hu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), F(yt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, mu)
      ]),
      default: j(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), F(yt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, pu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ke = /* @__PURE__ */ U(gu, [["__scopeId", "data-v-ef519c5f"]]), vu = {
  key: 1,
  class: "empty-state titled"
}, yu = { class: "empty-state-title" }, bu = { class: "empty-state-text" }, ku = {
  key: 2,
  class: "empty-state"
}, wu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", vu, [
      m("p", yu, v(e.title), 1),
      m("p", bu, [
        fe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", ku, [
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ln = /* @__PURE__ */ U(wu, [["__scopeId", "data-v-b27e89b0"]]), $u = { class: "fold-group" }, xu = ["aria-expanded"], Su = { class: "fold-label" }, Mu = {
  key: 0,
  class: "fold-count"
}, _u = {
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
    return (a, s) => (u(), f("div", $u, [
      m("button", {
        type: "button",
        class: V(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Su, v(e.label), 1),
        e.count !== "" ? (u(), f("span", Mu, v(e.count), 1)) : k("", !0),
        m("span", {
          class: V(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, xu),
      e.open ? fe(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, MS = /* @__PURE__ */ U(_u, [["__scopeId", "data-v-9ef1865c"]]), Cu = 150, Eu = () => Cu;
function Os(e, t, n = Eu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Ll(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((r) => [r, a[r]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let i = !1;
  try {
    const r = await n(t);
    return i = r.ok, r;
  } finally {
    i || l();
  }
}
const Au = 50, po = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function _S(e) {
  const t = tt().sources.find((n) => n.key === e);
  return t ? ss(t.read, t.events) : ss("", []);
}
function Nl(e, t, n, a, s = () => !1) {
  const o = O([]), l = O(null), i = O(""), r = O(!1), c = performance.now(), d = O(!1), h = O(""), p = O(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function A(g) {
    return s() ? (y.add(g), b ?? (b = new Promise((M) => setTimeout(() => M(S()), Au)))) : x(g);
  }
  async function S() {
    const g = new Set(y);
    y.clear(), b = null;
    const M = N, C = await t({ ids: [...g].join(","), limit: g.size });
    if (M !== N) return;
    if (!C.ok) return q();
    const R = new Map(C.value.rows.map((z) => [z.id, z]));
    o.value = o.value.flatMap((z) => g.has(z.id) ? R.has(z.id) ? [R.get(z.id)] : [] : [z]);
  }
  async function x(g) {
    const M = N, C = await t({ "before-id": g + 1, limit: 1 });
    if (M !== N) return;
    if (!C.ok) return q();
    const R = C.value.rows.find((z) => z.id === g);
    o.value = R ? o.value.map((z) => z.id === g ? R : z) : o.value.filter((z) => z.id !== g);
  }
  async function B(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ee) => ee.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((ee) => ee.id === g.row_id)) return A(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return q();
    const C = Math.max(...o.value.map((ee) => ee.id)), R = N, z = await t({ "after-id": C });
    if (R !== N) return;
    if (!z.ok) return q();
    const te = new Set(o.value.map((ee) => ee.id));
    o.value = [...z.value.rows.filter((ee) => !te.has(ee.id)), ...o.value];
  }
  async function W() {
    if (!d.value || !o.value.length) return !1;
    const g = N, M = Math.min(...o.value.map((z) => z.id)), C = await t({ "before-id": M });
    if (g !== N) return !1;
    if (!C.ok || !C.value.rows.length) return d.value = !1;
    d.value = po(C.value, n());
    const R = new Set(o.value.map((z) => z.id));
    return o.value = [...o.value, ...C.value.rows.filter((z) => !R.has(z.id))], !0;
  }
  let N = 0;
  function w(g, M) {
    var z, te;
    const C = g.ok ? e.shared ? [g.value] : ((z = g.value) == null ? void 0 : z.rows) ?? [] : [];
    g.ok && (o.value = M(C)), l.value = g.ok ? g.value : null;
    const R = C.length ? Math.min(...C.map((ee) => ee.id)) : 0;
    g.ok && ((te = g.value) != null && te.rows) && !o.value.some((ee) => ee.id < R) && (d.value = !e.shared && po(g.value, n())), i.value = g.ok ? "" : g.error, Os(c, () => r.value = !0);
  }
  async function H(g) {
    const M = ++N, C = await t({});
    M === N && w(C, g);
  }
  const P = (g) => {
    if (!a() || !g.length) return g;
    const M = Math.min(...g.map((R) => R.id)), C = Math.max(...g.map((R) => R.id));
    return [...o.value.filter((R) => R.id > C), ...g, ...o.value.filter((R) => R.id < M)];
  }, q = () => H(P), _ = (g) => w(g, P), I = () => H((g) => g);
  async function $(g, M = null) {
    const C = await Ll(M && { target: o, fields: { value: M(o.value) } }, g, e.run);
    return h.value = C.ok ? "" : C.error, p.value = C.ok ? C.value : null, await q(), C;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: q, loadLatest: I, older: W, act: $, actionFailure: h, answer: p, context: e, heard: B, showFirst: _, pageSize: n };
}
const Ou = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ss(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = tt(), l = Nl(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Ou(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Tu = 2e3;
function Ts(e, t, n = Tu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Se(Le, null), r = () => {
    var A;
    return ((A = i == null ? void 0 : i.visible) == null ? void 0 : A.value) === !1;
  }, c = () => document.hidden || r(), d = async (A) => {
    o = !0;
    try {
      await A();
    } catch {
    } finally {
      o = !1;
    }
  }, h = () => d(async () => t() && await e()), p = () => {
    s || c() || (a = setTimeout(
      async () => {
        c() || await h(), p();
      },
      typeof n == "function" ? n() : n
    ));
  }, y = async () => {
    l = !0, await d(e), p();
  }, b = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return y();
      await h(), p();
    }
  };
  me(() => {
    var A;
    return (A = i == null ? void 0 : i.visible) == null ? void 0 : A.value;
  }, b), Me(async () => {
    document.addEventListener("visibilitychange", b), r() || await y();
  }), et(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const ql = typeof document < "u" && document.documentElement.classList.contains("phone"), Dl = 120;
var Al;
const Sa = globalThis[Al = Symbol.for("journal.pressed")] ?? (globalThis[Al] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Iu(e = 0) {
  const t = Sa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Sa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Sa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function os(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Pl(e = window) {
  if (!os(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    os(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ls = "journal.stale-build-reload", Bu = 'script[type="module"][src*="/assets/index-"]', go = (e) => {
  var t;
  return ((t = e.querySelector(Bu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Ru(e = document, t = (a, s) => Ce.quietRead(a, s), n = () => Pl(window)) {
  const a = go(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = go(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ma = "";
function Lu(e, t = () => Pl(window)) {
  if (!e) return !1;
  const n = !!Ma && Ma !== e;
  return Ma = e, n && t(), n;
}
const Nu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function qu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ls) === e.message) return !1;
    t.setItem(ls, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Du(e = window.sessionStorage) {
  try {
    e.removeItem(ls);
  } catch {
    return;
  }
}
const Pu = 2e3, ju = 3e4, Ge = Ht({ starting: !1, external: !1, late: !1, offline: !1 }), Is = () => Ge.starting, Fu = 3;
let En = 0, is = 0, jl = 0, Fl = [];
async function Wu() {
  try {
    const e = await Ce.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let vo = null;
const Hu = () => vo ?? (vo = Wu().finally(() => vo = null));
function zu() {
  clearTimeout(is), clearTimeout(jl), is = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), Fl.splice(0).forEach((e) => e()), Ru();
}
async function Uu() {
  Ge.offline = !navigator.onLine;
  const e = await Hu();
  if (Ge.external = e.updating, En = !e.restarting && !e.updating && e.reachable ? En + 1 : 0, En < Fu) return;
  En = 0, (!Lu(e.started_at) || os()) && zu();
}
function Wl() {
  is = setTimeout(async () => {
    await Uu(), Ge.starting && Wl();
  }, Pu);
}
function Gu() {
  Ge.starting || (Ge.starting = !0, Ge.offline = !navigator.onLine, Wl(), jl = setTimeout(() => Ge.late = !0, ju));
}
const Hl = () => Ge.starting ? new Promise((e) => Fl.push(e)) : Promise.resolve();
function Bs(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const i = () => {
    o = !1, a = Date.now(), l && (l = !1, c());
  }, r = () => {
    s = null;
    const d = e();
    a = Date.now(), d instanceof Promise && (o = !0, d.catch(() => {
    }).finally(i));
  }, c = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const d = t - (Date.now() - a);
    d <= 0 ? r() : s = setTimeout(r, d);
  };
  return c.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, c;
}
function Vu(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Ku {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Bs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Vu(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const ct = "viewer.shell", An = 2e4, Yu = 4, yo = "/api/read-lines", Qu = 5e3, Xu = 403, bo = "/api/repeated-lines", Ju = 10, Zu = 2e3, ec = 3e5, CS = 6e5, On = 6, tc = 500, nc = "/journal/summary", ko = "/api/server-state", ac = 2e4, Tn = ql ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, sc = (e) => e.split("?")[0].endsWith(nc), rs = (e, t) => Object.assign(new Error(t), { status: e });
async function oc(e, t, n = rs) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const lc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), ic = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), wo = (e) => e.split(" ").slice(0, 2).join(" "), at = "read", Bt = "write", rc = "stream";
class uc {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = wo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < Zu));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Ju || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(bo, { method: "POST", headers: { ...Tn, "Content-Type": "application/json" }, body: i }, [{ window: ct, line: bo, kind: Bt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Iu(n ? Dl : 0);
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
  async sent(t, n, a, s = An) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Gu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Yu ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(yo, { headers: Tn }, [{ window: ct, line: yo, kind: at }], Qu).then(async (t) => {
      if (t.status === Xu) return /* @__PURE__ */ new Set();
      if (!t.ok) throw rs(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Ku(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = wo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const i = a instanceof FormData, r = { method: t, headers: { ...Tn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: lc(a) }, c = s || (i ? ec : An);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: ct, line: n, kind: at }], c)) : await this.sent(n, r, [{ window: ct, line: n, kind: Bt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, tc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = On, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return oc(i, `${i.status} ${i.statusText}`).catch((r) => {
      throw r.blocked && t !== "GET" && this.refused(r.message), r;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: ct, line: t, kind: at }], An)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Tn });
    if (!n.ok) throw rs(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, On, o).then((i) => (this.written(n), i)) : Is() && !sc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ct, line: t, kind: rc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(ko, { cache: "no-store" }, [{ window: ct, line: ko, kind: at }], ac);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ct, line: s = t, limit: o = An } = {}) {
    const l = (n.method ?? "GET") === "GET" ? at : Bt;
    return l === Bt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const _a = Symbol.for("journal.transport"), Ce = globalThis[_a] ?? (globalThis[_a] = new uc());
class zl {
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
    Ce.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Rs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Rs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const cc = 50, dc = "refresh", fc = 1e3, hc = 3e4, mc = "requested", pc = "after_window", gc = 50, In = ".*", vc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function yc(e) {
  const t = {}, n = Ht({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function p(_) {
    const I = () => r[_] ?? r[`${_.slice(0, _.lastIndexOf("."))}.*`] ?? {}, $ = O(void 0), g = Nl(e, async (M) => {
      const C = await A(_, M);
      return C.ok && !Object.keys(M).length && ($.value = C.value), C;
    }, () => I().page_size || gc, () => !!I().page_size, () => !!I().reads_ids);
    return t[_] = { ...g, data: $, readAt: 0 };
  }
  const y = new Proxy({}, { get: (_, I) => typeof I != "string" || I.startsWith("__v") ? void 0 : t[I] ?? p(I) }), b = (_) => (r[_].loading !== mc || _.endsWith(In)) && (!r[_].tab || r[_].tab === n.tab);
  function A(_, I = {}) {
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
    const $ = Object.fromEntries(I.flatMap(({ name: M, flags: C }) => Object.entries(C).map(([R, z]) => [`${M}.${R}`, z]))), g = await e.readKeys({ only: [...new Set(I.map(({ name: M }) => M))], state: { ...n, ...$ } });
    I.forEach(({ name: M, resolve: C }) => C(g.ok ? g.value.keys[M] : g));
  }
  async function x(_) {
    var M;
    const I = ++d;
    (_.length ? _ : Object.keys(r).filter((C) => !C.endsWith(In) && r[C].loading === "first" && b(C))).forEach((C) => l[C] = I);
    const g = await e.readKeys({ only: _, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const C = (_.length ? _ : Object.keys(t)).filter((z) => (l[z] ?? 0) <= I);
      C.forEach((z) => {
        y[z].readAt = Date.now(), g.failure === "unreachable" ? i.add(z) : i.delete(z), y[z].showFirst(g);
      });
      const R = g.failure === "unreachable" && ((M = e.waitForServer) == null ? void 0 : M.call(e));
      return R && R.then(() => {
        if (h) return;
        const z = C.filter((te) => l[te] === I);
        (z.length || !_.length && !C.length && d === I) && x(z);
      }), !1;
    }
    return P(g.value.declared), Object.entries(g.value.keys).forEach(([C, R]) => {
      (l[C] ?? 0) > I || (l[C] = I, y[C].readAt = Date.now(), i.delete(C), R.ok && (y[C].data.value = R.value), y[C].showFirst(R));
    }), !0;
  }
  function B(_) {
    const I = vc(_);
    return I.length ? (I.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, $(x(g));
    })))) : x([]);
  }
  function W(_) {
    _.forEach((I) => s.add(I)), clearTimeout(c), c = setTimeout(() => {
      const I = [...s];
      s.clear(), I.length && B(I);
    }, cc);
  }
  const N = (_) => _.endsWith(In) ? Object.keys(t).filter((I) => I.startsWith(_.slice(0, -1)) && t[I].readAt) : [_], w = (_) => (r[_] ?? r[`${_.split(".")[0]}.*`]).reload_seconds;
  function H(_) {
    const I = Object.keys(r).filter((g) => _.event === dc || r[g].events.some((M) => Rs(M, _.event)));
    I.filter((g) => r[g].page_size).forEach((g) => y[g].heard(_));
    const $ = I.filter((g) => !r[g].page_size);
    $.filter((g) => !b(g)).forEach((g) => y[g].readAt = 0), W($.filter(b).flatMap(N));
  }
  function P(_) {
    if (Object.keys(r).length) return;
    r = _;
    const I = [...new Set(Object.values(_).flatMap((g) => g.events))];
    I.length && e.follow(I, H);
    const $ = Object.keys(_).filter((g) => _[g].loading === pc);
    $.length && x($);
  }
  me(() => n.tab, () => {
    const _ = Object.keys(r).filter((I) => !I.endsWith(In) && b(I) && !y[I].readAt);
    _.length && x(_);
  }), Ie(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const _ = Date.now(), I = Object.keys(r).filter(($) => r[$].reload_seconds > 0 && b($)).flatMap(N).filter(($) => _ - y[$].readAt >= (i.has($) ? Math.min(w($) * 1e3, hc) : w($) * 1e3));
    I.length && W(I);
  }
  return Ts(q, () => e.visible.value, fc), queueMicrotask(() => x([])), { props: y, state: n, reload: B, readKey: A };
}
const bc = Symbol("open-view"), Le = Symbol.for("journal.window-context"), Ul = Symbol("dock-card");
function kc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = yc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function tt() {
  const e = Se(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return kc(e);
}
const wc = (e, t) => e(Ul, t), ES = () => Se(Ul), us = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', $o = {
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
  agent: us,
  worker: us,
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
}, $c = ["data-icon", "stroke-width", "innerHTML"], re = {
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
      agent: us,
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
    return (o, l) => (u(), f("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ve({
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
    }, null, 12, $c));
  }
}, xc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Sc = /* @__PURE__ */ U(xc, [["__scopeId", "data-v-eb453d6f"]]), Mc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ca(), a = E(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = O(!1), o = E(() => t.busy || s.value), l = Se(Le, null), i = E(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function r(c) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, Dl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, d) => (u(), F(rt(e.href ? "a" : "button"), Pe(a.value, {
      type: e.href ? void 0 : L(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: r
    }), {
      default: j(() => [
        m("span", {
          class: V(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), F(re, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          fe(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), F(Sc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ge = /* @__PURE__ */ U(Mc, [["__scopeId", "data-v-ededdadf"]]), _c = ["aria-checked", "aria-haspopup", "onClick"], Cc = {
  key: 0,
  class: "segmented-dot"
}, Ec = {
  key: 1,
  class: "segmented-note"
}, Ac = {
  key: 2,
  class: "segmented-count"
}, Oc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Es();
    return (s, o) => {
      const l = Vr("tip");
      return u(), f("span", {
        class: V(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(D, null, ae(e.options, (i) => Je((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: V(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", Cc)) : k("", !0),
          K(" " + v(i.label) + " ", 1),
          i.note ? (u(), f("small", Ec, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (u(), f("em", Ac, v(i.count), 1)) : k("", !0)
        ], 10, _c)), [
          [l, i.tip || i.title, `${L(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, jt = /* @__PURE__ */ U(Oc, [["__scopeId", "data-v-c89bc92d"]]), Tc = {
  key: 0,
  class: "more-items"
}, Ic = {
  key: 0,
  role: "alert"
}, Bc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", Tc, [
      e.failure ? (u(), f("p", Ic, v(e.failure), 1)) : k("", !0),
      e.more ? (u(), F(ge, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          K(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, vn = /* @__PURE__ */ U(Bc, [["__scopeId", "data-v-10464014"]]), Rc = { class: "link-group" }, Lc = {
  class: "group-label",
  "data-link-kind": ""
}, Nc = ["disabled", "onClick"], qc = { class: "title" }, Dc = { class: "relations" }, Pc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1), o = E(() => s.value ? n.rows : n.rows.slice(0, 3)), l = E(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Rc, [
      m("div", Lc, v(l.value), 1),
      (u(!0), f(D, null, ae(o.value, (p) => (u(), f("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", qc, v(p.endpoint.title), 1),
        m("span", Dc, [
          K(v(c(p)), 1),
          i(p) ? (u(), f(D, { key: 0 }, [
            K(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Nc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, jc = /* @__PURE__ */ U(Pc, [["__scopeId", "data-v-be6f079c"]]), Fc = ["data-loaded"], Wc = { class: "rows" }, Hc = ["disabled", "onClick"], zc = { class: "title" }, Uc = { class: "relations" }, Gc = { key: 2 }, Vc = {
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
    const n = e, a = t, s = O([]), o = O({}), l = O(0), i = O(""), r = O(null), c = O(!1), d = O("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (_) => _.toUpperCase())}s`, b = E(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, _) => q + _, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, _]) => ({ key: q, label: y(q), count: _ }))
    ]), A = E(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((I) => I.endpoint.model))].map((I) => [I, s.value.filter(($) => $.endpoint.model === I).length])), _ = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([I], [$]) => (_[I] ?? 3) - (_[$] ?? 3)).map(([I, $]) => ({ model: I, count: $, rows: s.value.filter((g) => g.endpoint.model === I) }));
    }), S = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, x = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), B = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (_) => _.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((_) => _.replaceAll("_", " ")).join(", ")}`;
    async function W(q = 1) {
      const _ = ++h;
      c.value = !0, d.value = "";
      const I = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && I.push("--outside-plan"), n.documentId && I.push("--first-counterpart", `doc:${n.documentId}`), i.value && I.push("--kind", i.value);
      try {
        const $ = await n.read(I);
        if (_ !== h) return;
        if (!$.ok) {
          d.value = $.error;
          return;
        }
        const g = $.value.counterparts ?? [], M = q === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(M.map((C) => [`${C.endpoint.model}:${C.endpoint.id}`, C])).values()], o.value = $.value.kinds ?? {}, l.value = $.value.total, r.value = $.value.next_page ?? null;
      } catch ($) {
        _ === h && (d.value = $.message);
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
    const H = () => !c.value && r.value && W(r.value), P = E(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], r.value = null, i.value = "", W();
    }, { immediate: !0 }), (q, _) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
      key: 0,
      class: V(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (u(), F(jt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: w
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", Wc, [
        e.grouped ? (u(!0), f(D, { key: 0 }, ae(A.value, (I) => (u(), F(jc, {
          key: I.model,
          model: I.model,
          count: I.count,
          rows: I.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: N
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(D, { key: 1 }, ae(s.value, (I) => (u(), f("button", Pe({
          key: `${I.endpoint.model}:${I.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, x(I), {
          disabled: S(I),
          onClick: ($) => N(I)
        }), [
          m("span", zc, v(I.endpoint.title), 1),
          m("span", Uc, [
            K(v(B(I)), 1),
            S(I) ? (u(), f(D, { key: 0 }, [
              K(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Hc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Gc, v(e.empty), 1)) : k("", !0),
        T(vn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: P.value,
          onMore: H
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Fc)) : k("", !0);
  }
}, Kc = /* @__PURE__ */ U(Vc, [["__scopeId", "data-v-29b9c31b"]]), Yc = (e, t, n) => Math.max(t, Math.min(n, e)), Qc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Gl = /* @__PURE__ */ new WeakMap(), Xc = (e, t) => Gl.set(e, t);
function Jc(e, t) {
  for (let n = t; n; n = Gl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Vl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Jc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const Tt = 8, Zc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    })), i = O({ w: 0, h: 0 }), r = O(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), h = (g) => {
      const M = g.closest(".pane, .float-window");
      return M ? d(M.getBoundingClientRect()) : c();
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
    const A = E(() => {
      if (!r.value) return l.value;
      const g = r.value, M = b(g), C = y(M, g), { w: R, h: z } = i.value, te = a.align === "auto" ? g.left + g.right > M.left + M.right : a.align === "right", ee = Yc(te ? g.right - R : g.left, M.left + Tt, Math.max(M.left + Tt, M.right - R - Tt)), pe = z > C.below && C.above > C.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, C.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, C.below) };
      return { ...l.value, ...pe, left: `${ee}px`, maxWidth: p(a.maxWidth, C.across) };
    }), S = n, x = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function B(g) {
      const M = x(), C = M.indexOf(document.activeElement);
      M[(C + g + M.length) % M.length].focus();
    }
    const W = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => S("close") }, N = (g) => W[g.key] && (g.preventDefault(), W[g.key]()), w = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let H = 0;
    const P = new ResizeObserver(() => {
      cancelAnimationFrame(H), H = requestAnimationFrame(w);
    });
    Vl(s, (g) => a.anchor && !a.anchor.contains(g.target) && S("close"));
    const q = (g, M) => ["top", "left", "right", "bottom"].some((C) => Math.abs(g[C] - M[C]) > 1), _ = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let I = 0;
    function $() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || _(g)) return S("close");
        q(g, r.value) && (r.value = g);
      }
      I = requestAnimationFrame($);
    }
    return Me(() => {
      a.anchor && s.value && Xc(s.value, a.anchor), w(), s.value && P.observe(s.value), !a.plain && x()[0] && x()[0].focus(), $();
    }), Ie(() => {
      P.disconnect(), cancelAnimationFrame(I), cancelAnimationFrame(H);
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
        fe(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ha = /* @__PURE__ */ U(Zc, [["__scopeId", "data-v-3d203970"]]), ed = { class: "split-button" }, td = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = O(null), s = O(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", ed, [
      T(ge, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (r) => n("main"))
      }, {
        default: j(() => [
          fe(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        T(ge, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (r) => s.value = !s.value)
        }, {
          default: j(() => [
            T(re, { name: "caret" })
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
          fe(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, nd = /* @__PURE__ */ U(td, [["__scopeId", "data-v-c258494d"]]), ad = 0, sd = "/api/lines", od = "/api/line", xo = 5e3, So = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Mo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ca = (e) => JSON.stringify(e.line), _o = () => new DOMException("cancelled", "AbortError");
class ld {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ca(t))) {
        Ce.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => Ce.whenFree(() => this.send()), ad));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(_o())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(_o()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ce.sent(sd, So({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Mo(i.body, at)), xo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, r) => i.resolve(l[r]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ce.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, at), Date.now() - n < xo ? this.slow.delete(Ca(t.body)) : this.slow.add(Ca(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ce.sent(od, So(t.body, t.signal), [Mo(t.body, n)], n === at ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Kl = new ld(), id = "/api/window";
function rd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${id}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => Ce.whenFree(async () => {
    const d = await Ce.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: at }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Ce.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const Yl = /* @__PURE__ */ new Map();
class ud {
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
    const t = await Ce.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function AS(e, t) {
  const n = new ud(e, t);
  return Yl.set(e, n), n.load().catch(() => {
  }), n;
}
const Ls = (e) => Yl.get(e);
function cd(e, t, n) {
  const a = Ls(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function dd(e, t) {
  if (!e) return !0;
  const n = Ls(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Qn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Ql = {};
async function OS(e = (t) => Ce.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Ql = (await t.json()).states);
}
const Ns = (e, t) => {
  var n;
  return (n = Ql[e]) == null ? void 0 : n[t];
}, rn = (e, t) => {
  var n;
  return ((n = Ns(e, t)) == null ? void 0 : n.label) ?? Qn(t);
}, Xl = (e, t) => {
  var n;
  return ((n = Ns(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, fd = (e, t) => {
  var n;
  return ((n = Ns(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, hd = Symbol("pane-page"), qs = Symbol("inspector-host"), Jl = { 1: "refused", 2: "usage", 3: "fault" }, md = 100, pd = 50, gd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, vd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function yd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = O({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: A = {}, search: S = {}, readOnly: x = !1, shared: B = null }) {
  const W = /* @__PURE__ */ new Map(), N = (te, ee) => l.follow(e, te, (le) => {
    W.clear(), ee(le);
  }, a), w = new AbortController(), H = O(!1), P = performance.now();
  let q = 0, _ = 0, I = () => {
  };
  const $ = new Promise((te) => I = te);
  w.signal.addEventListener("abort", I, { once: !0 });
  const g = () => {
    clearTimeout(_), _ = setTimeout(() => {
      q === 0 && Os(P, () => {
        H.value = !0, I();
      });
    }, pd);
  }, M = (te, ee) => (q += 1, Lt(e, te, t, w.signal, ee).finally(() => {
    q -= 1, g();
  })), C = (te, ee) => (g(), $.then(() => w.signal.aborted ? it : Lt(e, te, t, w.signal, ee))), R = ({ only: te = [], state: ee = {} } = {}) => (q += 1, kd(() => rd(e, t, te, ee, w.signal), w.signal).finally(() => {
    q -= 1, g();
  })), z = (te, { unbatched: ee = !1, deferred: le = !1 } = {}) => {
    const pe = W.get(te);
    if (pe && performance.now() - pe.at < md) return pe.answer;
    const xe = le && !H.value ? C(te, ee) : M(te, ee);
    return W.set(te, { answer: xe, at: performance.now() }), xe;
  };
  return {
    answered: H,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: E(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: A,
    search: S,
    readOnly: x,
    shared: B,
    read: z,
    readKeys: R,
    waitForServer: () => Is() ? Hl() : null,
    run: (te) => Lt(e, te, t, w.signal),
    upload: (te) => $d(te, e, w.signal),
    cancel: () => w.abort(),
    signal: w.signal,
    subscriptions: l,
    follow: (te, ee) => N([te].flat().filter((le) => o.some((pe) => Rs(pe, le))), ee),
    // for a dock of the chat, whose row's noun the window cannot declare ahead
    followUndeclared: N,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (te) => E(() => {
      var ee;
      return r.value[te] ?? ((ee = c.find((le) => le.key === te)) == null ? void 0 : ee.default);
    }),
    setting: async (te, ee) => {
      const le = await z(`window setting ${e} ${te}`);
      return le.ok ? le.value.value : ee;
    },
    setOption: h,
    keep: (te, ee) => Lt(e, ["window", "save-setting", e, te, JSON.stringify(ee)], t, w.signal)
  };
}
function Zl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const it = { ok: !1, failure: "cancelled", error: "" }, Ds = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ei(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? it : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Jl[n.code] || "fault", error: Zl(n.error) };
  } catch {
    return t != null && t.aborted ? it : { ok: !1, failure: "unreachable", error: Ds };
  }
}
const bd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Jl[e.code] || "fault", error: Zl(e.error) };
async function kd(e, t) {
  try {
    const n = await e();
    return t.aborted ? it : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, bd(s)])) } };
  } catch {
    return t.aborted ? it : { ok: !1, failure: "unreachable", error: Ds };
  }
}
async function ti(e, t, n) {
  const a = await ei(() => Kl.read(e, t, n), t);
  return a.failure !== "unreachable" || !Is() ? a : (await Hl(), t.aborted ? it : ti(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ce.held(() => wd(e, t, n, a, s), Ce.knownRead(Array.isArray(t) ? t : Ps(t)));
}
async function wd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Ps(t), environment: n };
  return await Ce.isRead(o.line) ? Ce.joined(JSON.stringify(o), (l, i) => ti({ ...o, attribution: i }, l, s), a, o).catch(() => it) : ei(() => Kl.write({ ...o, attribution: {
    client_id: Ce.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function $d(e, t, n = void 0) {
  try {
    const a = await Ce.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? it : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? it : { ok: !1, failure: "unreachable", error: Ds };
  }
}
function Ps(e) {
  return [...e.matchAll(gd)].map(([t]) => t.replace(vd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const xd = (e) => `show-${e}`, TS = (e, t, n) => e.filter((a) => {
  var s;
  return n(xd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ni = "messages.chat", Sd = {
  key: 0,
  class: "template-brief"
}, Md = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, _d = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O([]), o = O(""), l = E(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = E(() => s.value.find((c) => String(c.id) === n.value));
    async function r() {
      const c = await Lt(ni, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === d);
      h && a("pick", String(h.id));
    }
    return r(), (c, d) => (u(), f(D, null, [
      T(jt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (u(), f("p", Sd, v(i.value.brief), 1)) : k("", !0),
      o.value ? (u(), f("p", Md, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Cd = /* @__PURE__ */ U(_d, [["__scopeId", "data-v-14be8a5c"]]), Ed = { class: "info-tip" }, Ad = ["aria-label"], Od = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Td = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (u(), f("span", Ed, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        T(re, {
          name: "info",
          size: 13
        })
      ], 8, Ad),
      m("span", Od, [
        (u(!0), f(D, null, ae(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, ai = /* @__PURE__ */ U(Td, [["__scopeId", "data-v-a2fe5ff1"]]), Id = { class: "form-field" }, Bd = { class: "form-field-head" }, Rd = ["for"], Ld = {
  key: 1,
  class: "form-field-aside"
}, Nd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Id, [
      m("div", Bd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Rd),
        e.help ? (u(), F(ai, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (u(), f("span", Ld, [
          fe(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, qd = /* @__PURE__ */ U(Nd, [["__scopeId", "data-v-302c40bf"]]), cs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Dd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ca(), n = E(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((u(), f("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [L(cs), L(t).value]
    ]);
  }
}), Pd = /* @__PURE__ */ U(Dd, [["__scopeId", "data-v-e130a5b9"]]), jd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Es(), o = E(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), F(qd, {
      label: e.field.label,
      for: L(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        T(Ut, { value: o.value }, {
          choice: j(() => [
            T(jt, {
              id: L(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (r) => a("pick", r))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            T(Cd, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (r) => a("pick", r))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            T(Pd, {
              id: L(s),
              value: e.value,
              onInput: i[2] || (i[2] = (r) => a("pick", r.target.value))
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
    return (t, n) => (u(), F(ge, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        T(re, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Fd(e, t, n, a = () => window) {
  Me(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ie(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Wd = (e, t = () => !0) => Fd("keydown", (n) => n.key === "Escape" && t() && e());
function si(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = O(!1), s = E(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Wd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Hd = 80, It = Ht([]);
function oi(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Ie(n), E(() => Hd + Math.max(0, It.indexOf(t)));
}
let li = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return li = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const zd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Ud(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(zd)];
    if (!l.length) return o.preventDefault();
    const [i, r] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), r.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === r && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Me(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : li, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Gd = ["aria-modal", "aria-label", "aria-labelledby"], Vd = {
  key: 0,
  class: "dialog-head"
}, Kd = ["id", "tabindex"], Yd = {
  key: 1,
  class: "dialog-foot"
}, Qd = 500, Xd = 400, Jd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = si(a, n), i = oi(s), r = O(null), c = O(null), d = O(null), h = Es(), p = O(!1), y = Date.now();
    n.modal && Ud(c, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Xd);
    }
    function A(B) {
      !n.modal || Date.now() - y >= Qd || ![" ", "Enter"].includes(B.key) || (B.preventDefault(), B.stopPropagation());
    }
    const S = () => r.value && (r.value.scrollTop = r.value.scrollHeight), x = new MutationObserver(S);
    return me(r, (B) => {
      x.disconnect(), B && n.follow && (x.observe(B, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Ie(() => x.disconnect()), (B, W) => (u(), F(da, { to: "body" }, [
      T(zt, {
        name: "dialog",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
          L(s) ? (u(), f("div", {
            key: 0,
            class: V(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: L(i) }),
            onClick: $e(b, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: V(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? L(h) : void 0,
              onKeydownCapture: A
            }, [
              e.bare ? k("", !0) : (u(), f("header", Vd, [
                m("h3", {
                  id: L(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Kd),
                e.closable ? (u(), F(ma, {
                  key: 0,
                  onClick: L(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: r,
                class: V(["dialog-body", { bare: e.bare }])
              }, [
                fe(B.$slots, "default", {}, void 0, !0)
              ], 2),
              B.$slots.foot ? (u(), f("footer", Yd, [
                fe(B.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Gd)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, pa = /* @__PURE__ */ U(Jd, [["__scopeId", "data-v-6d1ecd98"]]), Zd = {
  class: "action-output",
  "data-action-output": ""
}, ef = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), F(pa, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        m("pre", Zd, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, tf = /* @__PURE__ */ U(ef, [["__scopeId", "data-v-423a045c"]]);
function nf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Kr(tf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const af = (e, t, n = {}) => Ps(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function yn(e, t, n, a = {}) {
  var s;
  try {
    if (!await dd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(ni, af(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && nf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const sf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ea = [
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
}), ga = {
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
    filters: Ea
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ea
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
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: Ea }),
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
}, of = ["secrets", "plugins"], ii = Object.keys(ga).filter((e) => !(ql && of.includes(e)));
E(() => ii.map((e) => ({ name: e, ...ga[e] })));
const Gt = (e) => ga[e], ri = new Map(ii.flatMap((e) => [e, e.replace(/s$/, ""), ga[e].title.toLowerCase()].map((t) => [t, e]))), pt = (e) => ri.get(String(e).toLowerCase()) || "", ui = [...ri.keys()].sort((e, t) => t.length - e.length).join("|"), lf = {
  class: "button-form",
  "data-button-form": ""
}, rf = {
  key: 0,
  class: "button-form-title"
}, uf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, cf = { class: "button-form-actions" }, df = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = O(!1), l = O(""), i = E(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = E(() => {
      var h;
      if (!n.row) return n.button.label;
      const d = ((h = Gt(pt(n.row.noun))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const d = await yn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, h) => (u(), F(pa, {
      title: r.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: j(() => {
        var p;
        return [
          m("div", lf, [
            (p = e.row) != null && p.title ? (u(), f("p", rf, v(e.row.title), 1)) : k("", !0),
            (u(!0), f(D, null, ae(e.button.fields, (y) => (u(), F(jd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", uf, v(l.value), 1)) : k("", !0),
            m("div", cf, [
              T(ge, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: j(() => [...h[2] || (h[2] = [
                  K("Cancel", -1)
                ])]),
                _: 1
              }),
              T(ge, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: j(() => [...h[3] || (h[3] = [
                  K("Send", -1)
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
}, ff = /* @__PURE__ */ U(df, [["__scopeId", "data-v-f26c27a7"]]), hf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, mf = {
  key: 1,
  class: "menu-item-text"
}, pf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: V(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", hf, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (u(), f("span", mf, [
        m("span", null, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : fe(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ze = /* @__PURE__ */ U(pf, [["__scopeId", "data-v-fec99974"]]), gf = ["aria-busy"], vf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, yf = { class: "button-slot-confirm-text" }, bf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, kf = {
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
    const n = e, a = t, s = E(() => Ls(n.environment)), o = E(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = E(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = E(() => n.readOnly ? [] : cd(n.environment, n.name, n.row)), c = O(null), d = O(null), h = O(""), p = O(!1), y = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), b = (x) => x.icon || (x.warning ? "dot" : "");
    function A(x) {
      if (!(p.value || n.readOnly)) {
        if (x.fields.length) {
          c.value = x;
          return;
        }
        if (x.confirm) {
          d.value = x;
          return;
        }
        return S(x);
      }
    }
    async function S(x) {
      d.value = null, h.value = "", a("failure", ""), p.value = !0;
      const B = await yn(x, n.row, n.environment);
      p.value = !1, h.value = B.ok ? "" : B.error;
      const W = x.label.toLowerCase() + (n.objectName && !x.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", B.ok ? "" : `Could not ${W}: ${B.error}`), B.ok && a("done");
    }
    return (x, B) => (u(), f("span", {
      class: V(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), f(D, { key: 0 }, [
        B[5] || (B[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        T(ge, {
          small: "",
          onClick: i
        }, {
          default: j(() => [...B[4] || (B[4] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", vf, [
        m("span", yf, v(d.value.confirm), 1),
        T(ge, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: V({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: B[0] || (B[0] = (W) => S(d.value))
        }, {
          default: j(() => [
            K(v(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        T(ge, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: B[1] || (B[1] = (W) => d.value = null)
        }, {
          default: j(() => [...B[6] || (B[6] = [
            K("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (u(), f(D, { key: 2 }, [
        (u(!0), f(D, null, ae(r.value, (W) => (u(), f(D, {
          key: W.name
        }, [
          W.menu.length ? (u(), F(nd, {
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
              (u(!0), f(D, null, ae(W.menu, (w) => (u(), F(ze, {
                key: w.label,
                description: w.description,
                onClick: (H) => (N(), A({ ...W, ...w, menu: [] }))
              }, {
                default: j(() => [
                  K(v(w.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              K(v(W.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), F(ge, {
            key: 1,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            bordered: !W.primary,
            class: V({ danger: W.danger }),
            icon: b(W),
            disabled: p.value,
            title: y(W),
            "data-button": W.name,
            onClick: (N) => A(W)
          }, {
            default: j(() => [
              K(v(W.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", bf, v(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (u(), F(ff, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: B[2] || (B[2] = (W) => c.value = null),
          onDone: B[3] || (B[3] = (W) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, gf));
  }
}, js = /* @__PURE__ */ U(kf, [["__scopeId", "data-v-a4b6f174"]]), wf = {
  class: "running",
  "data-running-command": ""
}, $f = ["title"], xf = {
  key: "idle",
  class: "running-idle"
}, Sf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", wf, [
      T(zt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, $f)) : (u(), f("span", xf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, IS = /* @__PURE__ */ U(Sf, [["__scopeId", "data-v-d3240219"]]), Mf = ["aria-checked", "aria-label", "title"], _f = {
  key: 0,
  class: "switch-inner"
}, Cf = {
  key: 0,
  class: "switch-word"
}, Ef = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("button", {
      type: "button",
      class: V(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: V(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), f("span", _f, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", Cf, v(e.word), 1)) : k("", !0)
    ], 10, Mf));
  }
}, BS = /* @__PURE__ */ U(Ef, [["__scopeId", "data-v-1bfb90f3"]]);
function ci(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Xn(e, t) {
  return ci(() => localStorage, e, t);
}
function di(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Fs(e, t) {
  return di(() => localStorage, e, t);
}
function fi(e, t) {
  me(t, (n) => Fs(e, n), { deep: !0 });
}
function Af(e, t) {
  return ci(() => sessionStorage, e, t);
}
function Of(e, t) {
  return di(() => sessionStorage, e, t);
}
const Jn = "journal.environment", hi = O(Af(Jn, Xn(Jn, "")));
function Tf(e) {
  hi.value = e, Of(Jn, e), Fs(Jn, e);
}
const Zn = O(location.hash), Co = Xe(null), Eo = { integrations: "mcp", library: "team" };
function If() {
  if (!Co.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Eo[n]) {
    location.replace(`#/${[Eo[n], ...a].join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash;
    return;
  }
  !n || Co.value(n) || (Tf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Zn.value = location.hash, If();
});
const ds = E(() => {
  const [e, t = ""] = Zn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, r = ""] = l.split("@"), [c = "", d = "", h = ""] = i.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: r };
  });
  return {
    env: hi.value,
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
}), Ws = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ws.page(e)}?open=${t}`
};
function Bf(e = "", t = 0, n = "") {
  location.hash = Ws.page(e, t, n);
}
function Rf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Lf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function mi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Lf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function RS(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function vt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = ds.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  mi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Nf(e, t, n, a = 0, s = "") {
  if (e === ds.value.env) return vt(t, n, a, s);
  const o = ds.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  mi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Nf(a, s, Number(o), 0, t) : vt(s, Number(o), 0, t);
}
function qf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = qf(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function LS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Df = { class: "inspector-part" }, Pf = { class: "inspector-part-title" }, jf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", Df, [
      m("h4", Pf, v(e.title), 1),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, NS = /* @__PURE__ */ U(jf, [["__scopeId", "data-v-5175e4a3"]]), Ao = /* @__PURE__ */ new Map(), Ff = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = O(null), a = O(!1), s = O(t.name && Ao.get(t.name) || !1);
    function o(r) {
      s.value = r, t.name && Ao.set(t.name, r);
    }
    const l = () => {
      const r = !!n.value && n.value.scrollHeight > t.at;
      r !== a.value && (a.value = r);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Me(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ie(() => i.disconnect()), (r, c) => (u(), f(D, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: V(["folded-body", { folded: a.value && !s.value }]),
        style: ve(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (d) => o(!0))
      }, [
        fe(r.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = $e((d) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, pi = /* @__PURE__ */ U(Ff, [["__scopeId", "data-v-4d2235ba"]]), Wf = ["aria-valuenow", "aria-valuemax"], Hf = {
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
    return (a, s) => (u(), f("span", {
      class: V(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: ve({ width: n.value })
      }, null, 4)
    ], 10, Wf));
  }
}, gi = /* @__PURE__ */ U(Hf, [["__scopeId", "data-v-9eba6a85"]]), zf = { processes: "process", memories: "memory", replies: "reply" }, ea = (e) => (zf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), fs = [], Uf = 2e3, ft = /* @__PURE__ */ new Map(), Gf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Vf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? fs.unshift(e) : fs.push(e), ft.clear();
}
function vi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Kf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Yf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function lt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Qf(e, t) {
  const n = [{ type: "text", text: lt(e).replace(/\r\n/g, `
`) }];
  for (const a of fs)
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
  return Xf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Xf(e) {
  return e.split(Vf).map((t, n) => n % 2 ? t : t.replace(Gf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Oo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Jf = 24;
function Zf(e) {
  const [t, , ...n] = e, a = Oo(t), s = n.map(Oo), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > Jf) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${un(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${un(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const yi = /^\s*(?:[-*+]|\d+[.)])\s+/, hs = /^\s*(\d+)[.)]\s/, To = (e) => e.match(/^\s*/)[0].length;
function bi(e) {
  const t = e[0].match(hs), n = To(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && To(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${un(o.text)}${o.nested.length ? bi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function eh(e, t) {
  const n = hs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (yi.test(e[s]) && hs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Io = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function ki(e) {
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
      const i = t.findIndex((c, d) => d > a && /^(```|~~~)/.test(c)), r = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(a + 1, r).join(`
`)}</code></pre>`), a = r + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${un(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Io(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Zf(t.slice(a, i))), a = i;
      continue;
    }
    if (yi.test(s)) {
      const i = eh(t, a);
      n.push(bi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${ki(
          t.slice(a, i).map((r) => r.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Io(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${un(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const th = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, nh = (e) => e.type !== "text" && !th.test(e.html);
function ah(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(ki(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : nh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Hs(e, t = { env: "" }) {
  const n = Yf(e, t), a = ft.get(n);
  if (ft.delete(n), a && a.source === t.source && a.reads.every((l) => Kf(l, t)))
    return ft.set(n, a), a.html;
  const s = [], o = ah(Qf(e, { ...t, reads: s }));
  return ft.set(n, { html: o, reads: s, source: t.source }), ft.size > Uf && ft.delete(ft.keys().next().value), o;
}
const Aa = /* @__PURE__ */ new WeakMap();
function sh(e) {
  if (Aa.has(e)) return Aa.get(e);
  const t = Yr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const h = s(c, d), p = e.read(`${ea(c)} show ${d}`);
    n.set(h, p), p.then((y) => {
      n.get(h) === p && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${ea(c).replace(/-/g, "_")}.*`], (d) => {
      const h = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(h)) continue;
        const y = Number(p.slice(h.length));
        (!d.row_id || d.row_id === y) && o(c, y);
      }
    }));
  }
  function i(c, d) {
    l(c);
    const h = s(c, d);
    return !t.has(h) && !n.has(h) && o(c, d), t.get(h);
  }
  const r = { id: Symbol("window text rows"), row: i };
  return Aa.set(e, r), r;
}
function wi() {
  const e = Se(Le, null), t = e ? sh(e) : null;
  return (n, a = {}) => Hs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const $i = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, bn = (e) => String(e || "").replace($i, (t, n, a, s) => s), oh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Bn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, lh = /^Traceback \(most recent call last\):/m, ih = 8;
function xi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ih).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function rh(e) {
  const t = [...e.matchAll(oh)].map((a) => a.index);
  if (Bn.lastIndex = 0, !t.length || !Bn.test(e)) return null;
  Bn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Bn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: xi(n), tail: "" } : null;
}
function uh(e) {
  const t = lh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: xi([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = bn(e), n = uh(t) || rh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ta = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Si = (e) => `${e.table}:${e.id}`, Bo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Oa = 80;
function Ro(e) {
  return e.length <= Oa ? e : `${e.slice(0, Oa + 1).replace(/\s+\S*$/, "") || e.slice(0, Oa)}…`;
}
const Lo = {
  messages: (e) => Ro(Bo(e.text)),
  comments: (e) => Ro(Bo(e.text)),
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
}, ch = (e) => (Lo[e.table] ? Lo[e.table](e) : e.title || "") || "", _t = (e) => ta(e.created_at), dh = (e) => ta(e.updated_at) || _t(e), fh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, hh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function mh(e) {
  const t = fh.exec(e);
  if (t && pt(t[1])) return { at: t.index, length: t[0].length, table: pt(t[1]), id: Number(t[2]), label: t[3] };
  const n = hh.exec(e), a = n && pt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function ph(e, t, n, a) {
  const s = vi(a, e, t), o = bn(s ? ch(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${lt(Gt(e).title)} ${t}</span><span class="row-card-title">${lt(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = mh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: ph(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const gh = /\.(png|jpe?g|gif|webp|svg)$/i, vh = (e) => gh.test(e), yh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, bh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function kh(e, t) {
  const n = yh.exec(e), [, a, s, o, l, i] = n || [], r = n && pt(a || o), c = r && vi(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Gt(r).title} ${c.id} · ${lt(i)}`, p = vh(i) ? `<img class="file-card-image" src="${d}" alt="${lt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${lt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function wh(e) {
  const t = bh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${lt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = kh(e, t) || wh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const $h = /`([^`\n]+)`/g;
Et((e) => e.replace($h, (t, n) => `<code>${n}</code>`));
const No = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ws.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace($i, (n, a, s, o) => No[a] ? No[a](s, o, t) : o)
);
const xh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Mi = new RegExp(`\\b(${ui}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), _i = new RegExp(`\\b(${ui}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Sh = new RegExp(`<code>((?:${Mi.source}|${_i.source}))</code>`, "gi"), Mh = (e) => e.replace(Sh, "$1"), _h = (e, t) => `<a class="row-pill" href="#" data-peek="${pt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Ch = (e) => e.replace(_i, (t, n, a) => a.replace(/\d+/g, (s) => _h(n.replace(/s$/i, ""), s))), Eh = (e) => Ch(e).replace(
  Mi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${pt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Mh(e).split(xh).map((n, a) => a % 2 ? n : Eh(n)).join("")
);
const Ah = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Oh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Th = /[\w\]]\(/, Ih = /^[\w$.[\]'"]+\s*=\s*[^=]/, Bh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Rh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Lh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Nh = /[[({,]$/, qh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Dh = /^(\t|\s{2,})\S/, Ph = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, jh = /`[^`]+`/, Fh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Wh = /[{}()[\];=<>$&|*\\@+^~%]/g, Ci = /^\s*(?:[-*+]|\d+[.)])\s/, Hh = /^\s*>/, zh = /^\s*\|/, Uh = 0.6, Gh = 0.4, Vh = 5, Kh = 0.03, Ei = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Vh && t.every((n) => Fh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Wh) ?? []).length / e.length < Kh;
}, Ta = (e) => {
  const t = e.trim();
  return jh.test(t) ? !1 : [Ah, Oh, Th, Ih, Bh, Rh, Lh, Nh, qh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Dh.test(e) && !Ci.test(e) && !Ei(e);
};
function Yh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ci.test(t[0]) || t.every((o) => Hh.test(o) || zh.test(o))) return "text";
  const n = t.filter((o) => !Ph.test(o.trim()));
  if (t.length === 1) return !n.length || Ta(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ta).length, s = n.filter((o) => !Ta(o) && Ei(o)).length;
  return a >= n.length * Uh && s <= n.length * Gh ? "code" : "text";
}
const ms = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Qh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Xh = `${ms} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Jh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Zh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", qo = {
  js: { keywords: ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Qh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Xh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Jh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Zh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, em = {
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
function Do(e, t, n) {
  return n && e.startsWith(n, t);
}
function tm(e, t) {
  const n = qo[em[t] ?? t] || qo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (i, r) => r && s.push({ type: i, value: r });
  for (; o < e.length; ) {
    const i = e[o];
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
    if (Do(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Do(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), d = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const r = (n.triple || []).find((c) => e.startsWith(c, o));
    if (r) {
      const c = e.indexOf(r, o + 3), d = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, d)), o = d;
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
      const d = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? d.toLowerCase() : d, p = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(h) ? "keyword" : p ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function nm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of tm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? lt(l) : `<span class="tok-${a}">${lt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function am(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const sm = 1500, Po = /* @__PURE__ */ new WeakMap();
async function om(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await am(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Po.get(t)), Po.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, sm)
  )));
}
typeof document < "u" && document.addEventListener("click", om, !0);
const lm = /\n\s*\n/, im = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, rm = /^\s*(`{3,}|~{3,})\s*$/, um = /^\s{4,}\S/, cm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, ps = /^\s*(?:[-*+]|\d+[.)])\s/, Ai = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, dm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function zs(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function fm(e) {
  const t = zs(e.join(`
`));
  return (dm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const hm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ai.test(t) && !ps.test(t);
}, mm = (e, t) => ps.test(t) || ps.test([...e].reverse().find((n) => n.trim()) || "");
function Us(e, t) {
  const n = t || fm(e), a = nm(zs(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function pm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && rm.test(s));
  return a < 0 ? e.length : a;
}
function gm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Us(a.map(bn), n ? n.toLowerCase() : "");
}
function vm(e) {
  const t = e.split(lm).map((l) => ({ paragraph: l, type: Yh(zs(l).split(`
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
    if (i.some(({ type: r }) => r === "code") || i.length > 1) {
      s(), n.push(Us(i.map(({ paragraph: r }) => r).join(`

`).split(`
`).map(bn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function ym(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : vm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(im);
    if (i) {
      const c = pm(n, l, i[2]);
      o(), a.push(gm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const r = hm(s) ? cm : um;
    if (!t && r.test(n[l]) && !mm(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Ai.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Us([...d, ...n.slice(l, c)].map(bn), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => ym(e, t.document), { first: !0 });
const bm = ["innerHTML"], km = ["innerHTML"], wm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = wi(), a = E(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, bm)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, km));
  }
}, st = /* @__PURE__ */ U(wm, [["__scopeId", "data-v-d8e75741"]]), jo = (e) => [...new Set(e.agents.map((t) => t.name))], $m = (e) => jo(e).length === 1 ? `Worker: ${jo(e)[0]}` : "Delegated", xm = ["aria-expanded"], Sm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Mm = {
  key: 0,
  class: "tip-failure"
}, _m = { key: 1 }, Cm = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Se(Le, null), a = E(() => fd(t.type, t.state)), s = O(!1), o = O([]), l = O("");
    async function i() {
      s.value = !0;
      const d = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      l.value = d.ok ? "" : d.error, d.ok && (o.value = d.value.lines ?? []);
    }
    const r = () => s.value = !1, c = () => s.value ? r() : i();
    return (d, h) => a.value ? (u(), f("span", {
      key: 0,
      class: "state-badge",
      tabindex: "0",
      role: "button",
      "aria-expanded": s.value,
      "data-state-badge": "",
      onMouseenter: i,
      onMouseleave: r,
      onFocus: i,
      onBlur: r,
      onClick: c,
      onKeydown: Mt(r, ["escape"])
    }, [
      K(v(L(rn)(e.type, e.state)) + " ", 1),
      s.value ? (u(), f("span", Sm, [
        l.value ? (u(), f("span", Mm, v(l.value), 1)) : k("", !0),
        (u(!0), f(D, null, ae(o.value, (p, y) => (u(), f("span", {
          key: y,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : k("", !0)
    ], 40, xm)) : (u(), f("span", _m, v(L(rn)(e.type, e.state)), 1));
  }
}, Em = /* @__PURE__ */ U(Cm, [["__scopeId", "data-v-73ac4596"]]), Am = {
  class: "plan-details",
  "data-plan-details": ""
}, Om = { class: "state-line" }, Tm = {
  key: 0,
  class: "phase-count"
}, Im = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Bm = { class: "text" }, Rm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Lm = { class: "overall" }, Nm = { class: "overall-figure" }, qm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Dm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, Pm = {
  key: 4,
  class: "part"
}, jm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (u(), f("div", Am, [
      m("div", Om, [
        T(Em, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: V(["status", L(Xl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Tm, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Im, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Bm, v(e.plan.reason), 1)
      ])) : k("", !0),
      e.plan.total ? (u(), f("section", Rm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Lm, [
          T(gi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Nm, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : k("", !0),
      e.plan.assignee ? (u(), f("p", qm, "Agent: " + v(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), f("p", Dm, v(L($m)(e.plan)), 1)) : k("", !0),
      e.plan.brief ? (u(), f("section", Pm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        T(pi, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: j(() => [
            T(st, {
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
}, qS = /* @__PURE__ */ U(jm, [["__scopeId", "data-v-c37da567"]]), Fm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Wm = { ...Fm, done: "Completed" }, Hm = /* @__PURE__ */ new Set(["completed", "cancelled"]), zm = (e) => Hm.has(e), cn = (e) => zm(e) ? "done" : e, Um = { class: "task-status-icon" }, Gm = ["width", "height", "aria-label"], Vm = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = E(() => Xl("task", cn(t.status))), a = E(() => n.value === "testing" ? "started" : n.value), s = E(() => Wm[t.status] ?? rn("task", t.status));
    return (o, l) => (u(), f("span", Um, [
      T(zt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (u(), f("svg", {
            key: n.value,
            class: V(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            T(Ut, { value: a.value }, {
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
          ], 10, Gm))
        ]),
        _: 1
      })
    ]));
  }
}, kn = /* @__PURE__ */ U(Vm, [["__scopeId", "data-v-ae24a63f"]]), Km = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Ym = ["title", "onClick"], Qm = { class: "agent-word" }, Xm = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = E(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((r) => r.helper_id && !n.has(r.state))) {
        const r = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, held: r });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (u(), f("div", Km, [
      (u(!0), f(D, null, ae(s.value, (i) => (u(), f("button", {
        key: i.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${i.name}`,
        "data-plan-phase-agent": "",
        onClick: (r) => L(qe)(`agents:${i.id}`)
      }, [
        m("span", {
          class: V(["agent-dot", { held: i.held }])
        }, null, 2),
        K(" " + v(i.name) + " ", 1),
        m("span", Qm, v(i.held ? "Working" : "Queued"), 1)
      ], 8, Ym))), 128))
    ])) : k("", !0);
  }
}, Jm = /* @__PURE__ */ U(Xm, [["__scopeId", "data-v-0c589695"]]), Zm = { class: "phases" }, ep = { class: "phead" }, tp = { class: "mark" }, np = { class: "ptitle" }, ap = { class: "phead-end" }, sp = {
  key: 0,
  class: "checkpoint"
}, op = { class: "progress" }, lp = {
  key: 0,
  class: "when"
}, ip = ["onClick"], rp = { class: "row-id" }, up = { class: "row-title" }, cp = ["title"], dp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((i) => n.has(i.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, i) => (u(), f("ol", Zm, [
      (u(!0), f(D, null, ae(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: V(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", ep, [
          m("span", tp, [
            T(re, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", np, v(c + 1) + ". " + v(r.title), 1),
          m("span", ap, [
            r.checkpoint ? (u(), f("span", sp, "checkpoint")) : k("", !0),
            m("span", op, v(s(r)) + "/" + v(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", lp, v(r.goal), 1)) : k("", !0),
        T(Jm, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(D, null, ae(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: V(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          T(kn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", rp, "#" + v(d.id), 1),
          m("span", up, v(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, v(d.helper_name), 9, cp)) : k("", !0)
        ], 10, ip))), 128))
      ], 2))), 128))
    ]));
  }
}, DS = /* @__PURE__ */ U(dp, [["__scopeId", "data-v-6a600744"]]), fp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, hp = {
  key: 0,
  class: "empty",
  role: "alert"
}, mp = {
  key: 2,
  class: "empty"
}, pp = { class: "day" }, gp = { class: "events" }, vp = { class: "mark" }, yp = { class: "what" }, bp = { class: "head" }, kp = { class: "word" }, wp = ["title", "onClick"], $p = { class: "at" }, xp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = O(null), l = O(""), i = E(() => {
      const d = /* @__PURE__ */ new Map();
      for (const h of o.value ?? []) {
        const p = new Date(h.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        d.set(p, [...d.get(p) ?? [], h]);
      }
      return [...d].map(([h, p]) => ({ day: h, items: p }));
    }), r = (d) => new Date(d).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const d = await a.read(["plan", "timeline", String(a.id)]);
      l.value = d.ok ? "" : d.error, o.value = d.ok ? d.value.events : [];
    }
    return me(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", fp, [
      l.value ? (u(), f("p", hp, v(l.value), 1)) : o.value === null ? (u(), F(Ke, { key: 1 })) : o.value.length ? k("", !0) : (u(), f("p", mp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(D, null, ae(i.value, (p) => (u(), f(D, {
        key: p.day
      }, [
        m("h3", pp, v(p.day), 1),
        m("ol", gp, [
          (u(!0), f(D, null, ae(p.items, (y) => (u(), f("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: V(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", vp, [
              n[y.event_type].state ? (u(), F(kn, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (u(), F(re, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", yp, [
              m("div", bp, [
                m("span", kp, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, wp),
                m("span", $p, v(r(y.time)), 1)
              ]),
              y.text ? (u(), F(st, {
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
}, PS = /* @__PURE__ */ U(xp, [["__scopeId", "data-v-9e511133"]]);
function Sp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Gs(e, t = Date.now()) {
  const n = Sp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Mp = 36e5;
function _p(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Mp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Fo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Oi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Wo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ia = (e) => String(e).padStart(2, "0");
function Ti(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ia(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ia(Math.floor(t % 3600 / 60))}m ${Ia(t % 60)}s`;
}
const Cp = 1e3;
function Ii() {
  const e = O(Date.now()), t = setInterval(() => e.value = Date.now(), Cp);
  return et(() => clearInterval(t)), e;
}
const Ep = Symbol("resource-subscriptions");
function wn(e, t, n = () => !0) {
  const a = Se(Ep, () => new zl(), !0), s = Bs(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  fa(() => {
    o(), s.cancel();
  });
}
const Bi = (e, t) => !e.row_id || t.has(e.row_id), Ap = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, jS = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Op = "Not known", Tp = 80, Ip = 1e3, Bp = "worker", Rp = "main", Lp = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Np = (e) => e.ok ? e.value.rows : [], qp = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Dp = (e, t) => (t == null ? void 0 : t.given_name) || qp((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Pp = (e, t) => e.ended_at ? "ended" : e.paused_at || Lp.has(t == null ? void 0 : t.state) ? "waiting" : "running", Ri = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function jp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Ip, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ti(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Tp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Op : `$${t.cost_dollars.toFixed(2)}` }), e.role === Bp && l.push({ key: "pace", label: "Tasks an hour", value: String(_p(Ri(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Rp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Fp(e) {
  const t = Ri(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Wp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Fo(e.created_at)]), e.ended_at && n.push(["Ended", Fo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const Hp = { class: "band" }, zp = { key: 0 }, Up = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", Hp, [
      T(re, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      fe(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", zp, v(e.count), 1)) : k("", !0)
    ]));
  }
}, Ft = /* @__PURE__ */ U(Up, [["__scopeId", "data-v-1758914f"]]), Gp = { class: "number" }, Vp = { class: "text" }, Kp = 150, Yp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = O(!1), a = E(() => t.text.length > Kp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(D, null, [
      e.text ? (u(), f(D, { key: 0 }, [
        T(Ft, { icon: "file" }, {
          default: j(() => [
            K(v(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: V(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (u(), f(D, { key: 1 }, [
        T(Ft, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
            K("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(D, null, ae(e.points, (i) => {
          var r;
          return u(), f("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", Gp, v(i.id), 1),
            m("span", Vp, [
              K(v(i.text), 1),
              m("span", {
                class: V(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, Qp = /* @__PURE__ */ U(Yp, [["__scopeId", "data-v-c99de22c"]]), Xp = ["aria-expanded"], Jp = { class: "count" }, Zp = {
  key: 0,
  "data-agent-fold-body": ""
}, e1 = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Pt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = on(e, "open");
    return (n, a) => (u(), f(D, null, [
      m("button", {
        type: "button",
        class: V(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        T(re, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        K(v(e.label), 1),
        m("span", Jp, v(e.count), 1),
        T(re, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Xp),
      t.value ? (u(), f("div", Zp, [
        fe(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Ba = /* @__PURE__ */ U(e1, [["__scopeId", "data-v-7f93d8d9"]]), t1 = ["onClick"], n1 = { class: "text" }, a1 = { class: "aside" }, s1 = {
  key: 0,
  class: "none"
}, o1 = {
  class: "skills",
  "data-agent-skills": ""
}, l1 = {
  key: 0,
  class: "none-inline"
}, i1 = { class: "label" }, r1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ht({ helpers: !1, skills: !1 }), a = O([]), s = O([]), o = async (i) => Np(await t.read(i));
    me(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), me(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Qn(i.role)} ${i.id}`;
    return (i, r) => (u(), f(D, null, [
      T(Ba, {
        open: n.helpers,
        "onUpdate:open": r[0] || (r[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: j(() => [
          (u(!0), f(D, null, ae(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => L(vt)("agents", c.id)
          }, [
            m("span", n1, v(l(c)), 1),
            m("span", a1, v(L(Qn)(c.role)) + " " + v(c.id), 1)
          ], 8, t1))), 128)),
          a.value.length ? k("", !0) : (u(), f("p", s1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      T(Ba, {
        open: n.skills,
        "onUpdate:open": r[1] || (r[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: j(() => [
          m("p", o1, [
            (u(!0), f(D, null, ae(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? k("", !0) : (u(), f("span", l1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      T(Ba, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: j(() => [
          (u(!0), f(D, null, ae(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", i1, v(c) + ":", 1),
            m("span", {
              class: V(["value", h])
            }, v(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, u1 = /* @__PURE__ */ U(r1, [["__scopeId", "data-v-358a0300"]]), c1 = ["datetime", "title"], Ze = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ii(), a = E(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(L(Gs)(e.at, L(n))), 9, c1));
  }
}, d1 = {
  class: "now",
  "data-agent-now": ""
}, f1 = {
  key: 1,
  class: "muted"
}, h1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, m1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, p1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, g1 = { class: "line" }, v1 = { class: "detail" }, y1 = { class: "bar" }, b1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = E(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(D, null, [
      T(Ft, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          K("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", d1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => L(vt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (u(), f("span", f1, v(e.nothing), 1)),
        n.value ? (u(), f("span", h1, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (u(), f("span", m1, [
          o[3] || (o[3] = K("Seen: ", -1)),
          T(Ze, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", p1, [
        m("div", g1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => L(vt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", v1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", y1, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, k1 = /* @__PURE__ */ U(b1, [["__scopeId", "data-v-ff25c609"]]), w1 = ["onClick"], $1 = { class: "text" }, x1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, S1 = { class: "text" }, M1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, _1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(D, null, [
      T(Ft, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
          K("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), f(D, null, ae(e.moves, (a) => (u(), f(D, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => L(vt)(a.table, a.id)
        }, [
          m("i", {
            class: V(["dot", a.tone])
          }, null, 2),
          m("span", $1, v(a.text), 1),
          T(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, w1)) : (u(), f("div", x1, [
          m("i", {
            class: V(["dot", a.tone])
          }, null, 2),
          m("span", S1, v(a.text), 1),
          T(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (u(), f("p", M1, "Nothing yet."))
    ], 64));
  }
}, C1 = /* @__PURE__ */ U(_1, [["__scopeId", "data-v-58f0db57"]]), E1 = {
  class: "strip",
  "data-agent-strip": ""
}, A1 = ["data-agent-cell"], O1 = {
  key: 0,
  class: "meter"
}, T1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", E1, [
      (u(!0), f(D, null, ae(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: V({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", O1, [
          m("i", {
            class: V({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, A1))), 128))
    ]));
  }
}, I1 = /* @__PURE__ */ U(T1, [["__scopeId", "data-v-b6657ab7"]]), B1 = {}, R1 = { class: "menu-label" };
function L1(e, t) {
  return u(), f("span", R1, [
    fe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const St = /* @__PURE__ */ U(B1, [["render", L1], ["__scopeId", "data-v-aa955b3e"]]), N1 = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, q1 = {
  key: 0,
  class: "skills-none"
}, D1 = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.skills.filter((l) => l.state === "loaded")), o = E(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (u(), f("div", N1, [
      T(St, null, {
        default: j(() => [...i[1] || (i[1] = [
          K("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (u(), f("p", q1, "None yet. Compacting the conversation empties this list.")),
      (u(!0), f(D, null, ae(s.value, (r) => (u(), f("p", {
        key: r.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        T(re, {
          name: "book",
          size: 12
        }),
        K(v(r.skill), 1)
      ]))), 128)),
      o.value.length ? (u(), f(D, { key: 1 }, [
        T(St, null, {
          default: j(() => [...i[2] || (i[2] = [
            K("Still to read", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(D, null, ae(o.value, (r) => (u(), f("p", {
          key: r.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          T(re, {
            name: "book",
            size: 12
          }),
          K(v(r.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      T(ze, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (r) => a("browse"))
      }, {
        default: j(() => [...i[3] || (i[3] = [
          K("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, P1 = /* @__PURE__ */ U(D1, [["__scopeId", "data-v-be514d47"]]), j1 = ["disabled", "title"], F1 = { class: "gauge usage" }, W1 = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.windows[0] ?? null), o = E(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = E(() => o.value !== null && o.value >= 100), i = E(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), r = E(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, d) => o.value !== null ? (u(), f("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: r.value,
      onClick: d[0] || (d[0] = (h) => a("open", h.currentTarget))
    }, [
      T(re, {
        name: "allowance",
        size: 12
      }),
      d[1] || (d[1] = K()),
      m("span", F1, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      K(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, j1)) : k("", !0);
  }
}, H1 = /* @__PURE__ */ U(W1, [["__scopeId", "data-v-048b0a74"]]), z1 = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: V(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Vs = /* @__PURE__ */ U(z1, [["__scopeId", "data-v-9e7e1157"]]);
function U1(e, t, n, { groups: a, programs: s }) {
  const o = O({}), l = O(""), i = O(!1), r = E(() => !!e.value && !e.value.ended_at), c = E(() => r.value && !!e.value.paused_at);
  async function d(b, A = null) {
    l.value = "";
    const S = await Ll(A, b, t);
    return l.value = S.ok ? "" : S.error, n(), S;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: r, paused: c, choose: (b, A) => d(["agent", "control", String(e.value.id), b, A.value], { target: o, fields: { value: { ...o.value, [b]: A.label } } }), stop: () => (i.value = !1, d(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => d(["agent", "launch", b.name]) };
}
function G1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const V1 = ["disabled", "title"], K1 = ["disabled", "title"], Y1 = { class: "gauge" }, Q1 = ["disabled", "title"], X1 = ["disabled"], J1 = ["disabled"], Z1 = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, eg = ["title"], tg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, ng = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, ag = { class: "gauge" }, sg = { class: "context-used" }, og = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, lg = 75, ig = {
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
    const n = e, a = t, s = U1(xa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: xa(n, "controlGroups"), programs: xa(n, "agentPrograms") }), o = O(null), l = O(""), i = E(() => s.groups.value.find((N) => N.key === l.value));
    function r(N, w) {
      o.value = N.currentTarget, l.value = w;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const d = E(() => n.skills.filter((N) => N.state === "loaded"));
    function h(N) {
      r(N, "skills"), a("skills");
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
      return u(), f("div", {
        class: V(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (u(), f(D, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: w[0] || (w[0] = (P) => r(P, "agent"))
          }, [
            T(re, {
              name: "agents",
              size: 12
            }),
            K(" " + v(((H = e.agentPrograms.find((P) => P.name === e.agent.program)) == null ? void 0 : H.title) || e.agent.program), 1)
          ], 8, V1),
          T(H1, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: w[1] || (w[1] = (P) => a("open", "usage", P))
          }, null, 8, ["windows", "disabled"]),
          S.value !== null ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${S.value}% full: clear or compact it`,
            onClick: w[2] || (w[2] = (P) => p("context") ? r(P, "context") : a("open", "context", P.currentTarget))
          }, [
            T(re, {
              name: "gauge",
              size: 12
            }),
            w[14] || (w[14] = K()),
            m("span", Y1, [
              m("span", {
                style: ve({ width: `${S.value}%` })
              }, null, 4)
            ]),
            K(" " + v(S.value) + "% ", 1)
          ], 8, K1)) : k("", !0),
          y.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: w[3] || (w[3] = (P) => p("model") ? r(P, "model") : null)
          }, [
            T(re, {
              name: "model",
              size: 12
            }),
            K(" " + v(y.value), 1)
          ], 8, Q1)) : k("", !0),
          p("effort") || e.card && b.value ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: w[4] || (w[4] = (P) => r(P, "effort"))
          }, [
            T(re, {
              name: "bolt",
              size: 12
            }),
            K(" " + v(b.value), 1)
          ], 8, X1)) : k("", !0),
          W.value ? (u(), f("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: w[5] || (w[5] = (P) => a("open", "cost", P.currentTarget))
          }, v(W.value), 9, J1)) : k("", !0),
          e.branch ? (u(), f("span", Z1, [
            T(re, {
              name: "branch",
              size: 12
            }),
            K(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (u(), f("button", {
            key: 5,
            type: "button",
            class: V(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: w[6] || (w[6] = (P) => a("open", "jobs", P.currentTarget))
          }, [
            T(re, {
              name: "clock",
              size: 12
            }),
            K(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (u(), f("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: h
          }, [
            T(re, {
              name: "book",
              size: 12
            }),
            K(" " + v(d.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (u(), f(D, { key: 7 }, [
            m("button", {
              type: "button",
              class: V(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < lg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: w[7] || (w[7] = (P) => a("open", "fitness", P.currentTarget))
            }, [
              T(re, {
                name: "heart",
                size: 12
              }),
              K(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: V(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: w[8] || (w[8] = (P) => a("open", "load", P.currentTarget))
            }, [
              T(re, {
                name: "weight",
                size: 12
              }),
              K(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (u(), f("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: w[9] || (w[9] = (P) => r(P, "start"))
        }, [
          T(re, {
            name: "agents",
            size: 12
          }),
          w[15] || (w[15] = K(" Start an agent", -1))
        ])) : k("", !0),
        w[21] || (w[21] = m("span", { class: "space" }, null, -1)),
        L(s).failure.value ? (u(), f("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: L(s).failure.value
        }, v(L(s).failure.value), 9, eg)) : k("", !0),
        fe(N.$slots, "default", {}, void 0, !0),
        o.value ? (u(), F(ha, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: j(() => {
            var P;
            return [
              l.value === "agent" ? (u(), f(D, { key: 0 }, [
                L(s).asking.value ? (u(), f(D, { key: 0 }, [
                  T(St, { "data-agent-stop-ask": "" }, {
                    default: j(() => [...w[16] || (w[16] = [
                      K("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  T(ze, {
                    "data-agent-stop-confirm": "",
                    onClick: w[10] || (w[10] = (q) => (c(), L(s).stop()))
                  }, {
                    default: j(() => [...w[17] || (w[17] = [
                      K("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  T(ze, {
                    onClick: w[11] || (w[11] = (q) => L(s).asking.value = !1)
                  }, {
                    default: j(() => [...w[18] || (w[18] = [
                      K("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (u(), F(ze, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: w[12] || (w[12] = (q) => L(s).asking.value = !0)
                }, {
                  default: j(() => [...w[19] || (w[19] = [
                    K("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (u(), f(D, { key: 1 }, [
                T(St, null, {
                  default: j(() => [...w[20] || (w[20] = [
                    K("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (u(!0), f(D, null, ae(L(s).programs.value, (q) => (u(), F(ze, {
                  key: q.name,
                  "data-agent-program": q.name,
                  onClick: (_) => (c(), L(s).start(q))
                }, {
                  default: j(() => [
                    K(v(q.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (u(), F(P1, {
                key: 2,
                skills: e.skills,
                onBrowse: w[13] || (w[13] = (q) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (u(), f(D, { key: 3 }, [
                T(St, null, {
                  default: j(() => [
                    K(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (u(), f(D, { key: 0 }, [
                  m("p", tg, v(L(G1)(((P = A.value) == null ? void 0 : P.last_compaction) ?? null)), 1),
                  m("div", ng, [
                    m("span", ag, [
                      m("span", {
                        style: ve({ width: `${S.value}%` })
                      }, null, 4)
                    ]),
                    m("span", sg, v(S.value) + "%", 1)
                  ]),
                  B.value ? (u(), f("p", og, [
                    K(v(B.value) + " ", 1),
                    T(Vs, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                (u(!0), f(D, null, ae(i.value.choices, (q) => (u(), F(ze, {
                  key: q.value,
                  "data-agent-choice": q.value,
                  onClick: (_) => (L(s).choose(i.value.key, q), c())
                }, {
                  default: j(() => [
                    K(v(q.label), 1)
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
}, rg = /* @__PURE__ */ U(ig, [["__scopeId", "data-v-dc15ff96"]]), ug = {
  class: "who",
  "data-agent-who": ""
}, cg = { class: "name" }, dg = ["data-agent-state"], fg = {
  class: "sub",
  "data-agent-started-by": ""
}, hg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", ug, [
      m("h2", cg, [
        m("i", {
          class: V(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, dg),
        K(v(e.name), 1)
      ]),
      T(rg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", fg, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, mg = /* @__PURE__ */ U(hg, [["__scopeId", "data-v-83bd4a9d"]]), pg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, gg = { class: "scroll" }, vg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, yg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, bg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ii(), a = O(null), s = O(null), o = O(null), l = O({}), i = O({ helpers: 0, skills: 0 }), r = O(0), c = O([]), d = O([]), h = O("");
    let p = 0;
    const y = E(() => {
      var x;
      return a.value.ended_at ? Fp(s.value) : `It has no task.${(x = s.value) != null && x.instruction ? " It was given an instruction." : ""}`;
    });
    async function b() {
      const x = ++p, B = await t.read(["usage", "inspector", String(t.id), "--environment", t.environment]);
      x === p && (h.value = B.ok ? "" : B.error, B.ok && (a.value = B.value.agent, s.value = B.value.facts, o.value = B.value.inspection, l.value = B.value.tool, i.value = { helpers: B.value.helpers, skills: B.value.skills }, c.value = B.value.points, d.value = B.value.programs, r.value += 1));
    }
    const A = E(() => /* @__PURE__ */ new Set([t.id])), S = {
      agent: (x) => Bi(x, A.value),
      hook_call: (x) => Ap(x, "session_agent_id", A.value)
    };
    return wn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], b, (x) => {
      var B;
      return ((B = S[x.event.split(".")[0]]) == null ? void 0 : B.call(S, x)) ?? !0;
    }), Me(b), (x, B) => {
      var W, N;
      return u(), f("article", pg, [
        m("div", gg, [
          h.value ? (u(), f("p", vg, v(h.value), 1)) : a.value && o.value ? (u(), f(D, { key: 1 }, [
            T(mg, {
              name: L(Dp)(a.value, s.value),
              state: L(Pp)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: d.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            T(I1, {
              cells: L(jp)({ row: a.value, facts: s.value, inspection: o.value, now: L(n) })
            }, null, 8, ["cells"]),
            T(k1, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            T(Qp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((N = s.value) == null ? void 0 : N.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            T(C1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            T(u1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: r.value,
              details: L(Wp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", yg, "Ended " + v(L(Gs)(a.value.ended_at, L(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (u(), F(Ke, { key: 2 }))
        ])
      ]);
    };
  }
}, FS = /* @__PURE__ */ U(bg, [["__scopeId", "data-v-26d7ee78"]]), kg = ["aria-expanded"], wg = { class: "drop-label" }, $g = ["value"], xg = {
  key: 1,
  class: "drop-lead"
}, Sg = { class: "drop-item-text" }, Mg = {
  key: 2,
  class: "drop-note"
}, _g = {
  key: 1,
  class: "drop-none"
}, Cg = {
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
    const n = e, a = t, s = O(!1), o = O(null), l = O(""), i = E(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function r(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), f("div", {
      class: V(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: V(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (u(), F(re, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        m("span", wg, v(e.label), 1),
        T(re, {
          name: "down",
          size: 11
        })
      ], 10, kg),
      s.value ? (u(), F(ha, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (h) => s.value = !1)
      }, {
        default: j(() => [
          e.searchable ? (u(), f("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (h) => l.value = h.target.value)
          }, null, 40, $g)) : k("", !0),
          (u(!0), f(D, null, ae(i.value, (h) => (u(), F(ze, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => r(h)
          }, {
            default: j(() => [
              h.running !== void 0 ? (u(), f("span", {
                key: 0,
                class: V(["drop-dot", { live: h.running }])
              }, null, 2)) : k("", !0),
              h.lead ? (u(), f("span", xg, v(h.lead), 1)) : k("", !0),
              m("span", Sg, v(h.label), 1),
              h.note ? (u(), f("span", Mg, v(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (u(), f("p", _g, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Li = /* @__PURE__ */ U(Cg, [["__scopeId", "data-v-29dfcce5"]]);
function Eg(e) {
  const t = O(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Me(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), et(() => n.disconnect()), t;
}
const Ag = ["data-comment-id"], Og = {
  key: 0,
  class: "comment-top"
}, Tg = { class: "comment-mark" }, Ig = {
  class: "comment-body",
  "data-comment": ""
}, Bg = { class: "comment-foot" }, Rg = {
  key: 1,
  "data-comment-lost": ""
}, Lg = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (u(), f("article", {
      class: V(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (u(), f("div", Og, [
        m("span", Tg, v(e.comment.number), 1),
        m("span", {
          class: V(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", Ig, v(e.comment.body), 1),
      m("div", Bg, [
        e.comment.created_at ? (u(), F(Ze, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (u(), f("span", Rg, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Ag));
  }
}, Ni = /* @__PURE__ */ U(Lg, [["__scopeId", "data-v-a37d4507"]]);
var Ol;
/Mac|iPhone|iPad/.test(((Ol = navigator.userAgentData) == null ? void 0 : Ol.platform) || navigator.platform);
function qi(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Ng = {
  class: "comment-box",
  "data-comment-box": ""
}, qg = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Dg = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Pg = { class: "comment-row" }, jg = ["placeholder"], Fg = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Pt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Pt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = on(e, "draft"), l = O(""), i = O(!1), r = O(null), c = E(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), d = E(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      r.value.style.height = "auto", r.value.style.height = `${r.value.scrollHeight + 2}px`;
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
    return t({ focus: () => r.value.focus() }), (y, b) => (u(), f("div", Ng, [
      e.selection ? (u(), f("div", qg, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: V(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        T(ma, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (A) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (u(), f("p", Dg, v(l.value), 1)) : k("", !0),
      m("div", Pg, [
        Je(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": b[1] || (b[1] = (A) => o.value = A),
          rows: "1",
          maxlength: "2000",
          class: V({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Mt((A) => L(qi)(A, p), ["enter"]))
        }, null, 42, jg), [
          [Yn, o.value]
        ]),
        T(ge, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: j(() => [...b[4] || (b[4] = [
            K("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, Wg = /* @__PURE__ */ U(Fg, [["__scopeId", "data-v-41d2081c"]]), Rn = (e) => e ? e.split(", ") : [];
function Hg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function zg(e, t) {
  return {
    reads: Rn(e.reads_allowed),
    runs: Rn(e.runs_allowed),
    missing: [...Rn(e.reads_missing), ...Rn(e.runs_missing)],
    ask: t
  };
}
const Ug = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Qr("SkeletonParts", !0);
      return u(!0), f(D, null, ae(e.parts, (r, c) => (u(), f(D, { key: c }, [
        (u(!0), f(D, null, ae(r.count, (d) => (u(), F(Ut, {
          key: d,
          value: r.shape
        }, {
          line: j(() => [
            T(Zt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: r.width, height: `${t[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            T(Zt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[r.size]}px`, height: `${n[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            T(Zt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: r.width, height: `${r.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            m("div", {
              class: "skeleton-row",
              style: ve(a(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            m("div", {
              class: "skeleton-stack",
              style: ve(a(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ve(a(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            m("div", {
              class: "skeleton-grid",
              style: ve(s(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Gg = /* @__PURE__ */ U(Ug, [["__scopeId", "data-v-fa8baeaf"]]), Vg = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Kg = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", Vg, [
      T(Gg, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Ks = /* @__PURE__ */ U(Kg, [["__scopeId", "data-v-52f66b64"]]), Di = {
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
}, Yg = { class: "bars" }, Qg = { class: "bar-name" }, Xg = { class: "bar-value" }, Jg = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = E(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", Yg, [
      (u(!0), f(D, null, ae(e.items, (r, c) => (u(), F(rt(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: V(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          m("span", Qg, v(r.label), 1),
          T(gi, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Xg, v(r.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Zg = /* @__PURE__ */ U(Jg, [["__scopeId", "data-v-663427f4"]]), ev = { class: "bars" }, tv = {
  key: 0,
  class: "bars-title"
}, nv = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", ev, [
      e.node.title ? (u(), f("span", tv, v(e.node.title), 1)) : k("", !0),
      T(Zg, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, av = /* @__PURE__ */ U(nv, [["__scopeId", "data-v-7135bb11"]]), sv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = E(() => n[a.node.type](a.node));
    return (l, i) => (u(), f("div", {
      class: V([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ve(o.value)
    }, [
      (u(!0), f(D, null, ae(e.node.children || [], (r, c) => (u(), F(Pi, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Wn = /* @__PURE__ */ U(sv, [["__scopeId", "data-v-d142a3f4"]]), ov = {
  key: 0,
  class: "card-head"
}, lv = { class: "card-title" }, iv = {
  key: 0,
  class: "card-note"
}, rv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: V(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", ov, [
        m("span", lv, v(e.node.title), 1),
        e.node.note ? (u(), f("span", iv, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      T(Wn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, uv = /* @__PURE__ */ U(rv, [["__scopeId", "data-v-67b72d40"]]), cv = { class: "fact" }, dv = { class: "fact-label" }, fv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", cv, [
      m("span", dv, v(e.label), 1),
      T(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, hv = /* @__PURE__ */ U(fv, [["__scopeId", "data-v-3a88ecf8"]]), mv = { class: "list" }, pv = { class: "list-label" }, gv = {
  key: 1,
  class: "list-note"
}, vv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", mv, [
      (u(!0), f(D, null, ae(e.items, (o, l) => (u(), F(rt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: V(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", pv, v(o.label), 1),
          o.badge ? (u(), F(Vs, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (u(), f("span", gv, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, yv = /* @__PURE__ */ U(vv, [["__scopeId", "data-v-ebe2ae0a"]]), bv = { class: "table" }, kv = {
  key: 0,
  class: "table-row empty"
}, wv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", bv, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (u(!0), f(D, null, ae(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (u(!0), f(D, null, ae(e.rows, (i, r) => (u(), F(rt(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: V(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          (u(!0), f(D, null, ae(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", kv, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, $v = /* @__PURE__ */ U(wv, [["__scopeId", "data-v-9326a52e"]]), xv = { class: "stat-value" }, Sv = { class: "stat-label" }, Mv = {
  key: 0,
  class: "stat-note"
}, _v = {
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
    return (a, s) => (u(), F(rt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: V(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        m("span", xv, v(e.value), 1),
        m("span", Sv, v(e.label), 1),
        e.note ? (u(), f("span", Mv, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Cv = /* @__PURE__ */ U(_v, [["__scopeId", "data-v-ad0db6d6"]]), Ev = { class: "code" }, Av = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), F(Ut, {
      value: e.node.type
    }, {
      stack: j(() => [
        T(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        T(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        T(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        T(uv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        m("h3", {
          class: V(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        T(Cv, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        T(av, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        T($v, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        T(yv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        T(st, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        T(hv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        T(Vs, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", Ev, [
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
}), Pi = /* @__PURE__ */ U(Av, [["__scopeId", "data-v-cbdcf540"]]), Ov = { class: "dashboard" }, Tv = { class: "trail" }, Iv = ["onClick"], Bv = {
  key: 0,
  class: "gone",
  role: "status"
}, Rv = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = O(!!n.page && !s(n.page)), l = O(n.page && !o.value ? [n.page] : []), i = E(() => l.value.at(-1) || n.document.start), r = E(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return me(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (u(), f("div", Ov, [
      e.document.broken ? (u(), F(ln, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          K(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), F(ln, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          K(v(e.document.missing), 1)
        ]),
        _: 1
      })) : r.value ? (u(), f(D, { key: 2 }, [
        m("nav", Tv, [
          m("button", {
            type: "button",
            class: V(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(c(e.document.start)), 3),
          (u(!0), f(D, null, ae(l.value, (b, A) => (u(), f(D, {
            key: `${A}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: V(["step", { current: A === l.value.length - 1 }]),
              onClick: (S) => h(A + 1)
            }, v(c(b)), 11, Iv)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", Bv, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        T(zt, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              T(Pi, {
                node: r.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, Lv = /* @__PURE__ */ U(Rv, [["__scopeId", "data-v-fbe83734"]]);
function Nv(e, t) {
  const n = tt(), a = Bs(e, Di.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Me(e), et(() => {
    s(), a.cancel();
  });
}
const qv = {
  key: 0,
  class: "window-failure"
}, Dv = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = tt(), o = O(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Nv(l, n.events) : Ts(l, () => !0, Di.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", qv, v(o.value.error), 1)) : o.value ? (u(), F(Lv, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, Pv = 1e4;
class jv {
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
    return this.heardAt !== null && t - this.heardAt > Pv;
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
const Fv = {
  key: 0,
  class: "frame-note"
}, Wv = {
  key: 0,
  class: "frame-note"
}, Hv = ["src", "title"], zv = 1e3, Uv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = tt(), a = O(null), s = O(!1), o = O(!1);
    let l = null, i = 0;
    return Me(() => {
      l = new jv(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, zv);
    }), Ie(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", Fv, "This window was closed because it stopped answering.")) : (u(), f(D, { key: 1 }, [
      s.value ? (u(), f("div", Wv, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        T(ge, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...c[1] || (c[1] = [
            K("Close the window", -1)
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
      }, null, 8, Hv)
    ], 64));
  }
}, Gv = /* @__PURE__ */ U(Uv, [["__scopeId", "data-v-32a49046"]]), Vv = {
  class: "allowance-prompt",
  role: "dialog"
}, Kv = { class: "allowance-prompt-text" }, Yv = { class: "allowance-prompt-buttons" }, Qv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Vv, [
      m("p", Kv, v(L(Hg)(e.request)), 1),
      m("div", Yv, [
        T(ge, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            K("Allow", -1)
          ])]),
          _: 1
        }),
        T(ge, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            K("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Xv = /* @__PURE__ */ U(Qv, [["__scopeId", "data-v-cad69fe2"]]), Ra = {
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
        K(v(e.reason) + " ", 1),
        e.retry ? (u(), F(ge, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            K("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (u(), F(ge, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            K("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Jv = ["data-window", "data-agent"], Zv = {
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
    const i = Se(bc, null), r = yd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: E(() => n.options),
      declared: n.declared,
      page: Se(hd, null),
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
    Tl(Le, r), me(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Me(r.settle), Ie(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Xr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ua(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), F(Xv, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (u(), F(Ra, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), F(Ra, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(D, { key: 4 }, [
        (u(), F(c, { key: o.value })),
        e.skeleton.length && !L(r).answered.value ? (u(), F(Ks, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (u(), F(Ra, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Jv));
  }
}, en = /* @__PURE__ */ U(Zv, [["__scopeId", "data-v-c4443e2b"]]), ji = {
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
    const n = e, a = t, s = { render: () => ua(Gv, { src: n.entry.entry_url }) };
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
      onOption: l[0] || (l[0] = (i, r) => a("option", i, r))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, ey = ["data-window"], Fi = {
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
    return me(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Du();
          } catch (i) {
            if (Nu(i) && qu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      T(Ks, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, ey)) : (u(), F(en, {
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
      onOption: i[0] || (i[0] = (r, c) => a("option", r, c))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, ty = {
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
    const n = t, a = e, s = E(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = E(() => s.value && { render: () => ua(Dv, { line: s.value.line, events: s.value.events }) }), l = O(null), i = E(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), r = E(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = E(
      () => {
        var p, y;
        return l.value ? zg(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const p = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = p.ok ? p.value : null;
    }
    async function h() {
      const p = await a.prompts.ask(s.value.title, l.value);
      return await d(), p;
    }
    return me(
      () => {
        var p, y;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await d(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (p, y) => {
      var b, A;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), F(Ks, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((A = s.value) == null ? void 0 : A.shows) === "one-agent" && e.agent === null ? (u(), F(ln, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), F(en, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": r.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), F(Fi, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), F(ji, {
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
}, ny = ["data-section"], ay = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, sy = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Se(qs, null), a = E(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = E(() => ({ row: t.row }));
    return (o, l) => L(n) ? (u(!0), f(D, { key: 0 }, ae(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), F(ty, {
        key: 0,
        name: i.name,
        catalogue: L(n).catalogue,
        subscriptions: L(n).subscriptions,
        environment: L(n).environment,
        prompts: L(n).prompts,
        "shell-read": L(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", ay, v(i.name) + " is not available", 1))
    ], 8, ny))), 128)) : k("", !0);
  }
}, gs = /* @__PURE__ */ U(sy, [["__scopeId", "data-v-a47d36b7"]]), oy = { class: "rail-head" }, ly = { key: 0 }, iy = {
  key: 1,
  class: "rail-none"
}, ry = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: V(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", oy, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", ly, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (u(!0), f(D, { key: 0 }, ae(e.comments, (a) => (u(), F(Ni, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", iy, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, uy = /* @__PURE__ */ U(ry, [["__scopeId", "data-v-4d684649"]]), cy = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, dy = ["aria-pressed"], fy = ["aria-pressed"], hy = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, my = {
  key: 0,
  role: "alert"
}, py = {
  key: 1,
  class: "sidebar-none"
}, gy = ["data-question-id"], vy = { class: "question-state" }, yy = ["data-question-show", "onClick"], by = {
  key: 0,
  class: "sidebar-none"
}, ky = {
  key: 1,
  class: "question-answer"
}, wy = {
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
    const t = Se(qs, null);
    return (n, a) => (u(), f("div", {
      class: V(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", cy, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, dy),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, fy)
      ]),
      e.mode === "comments" ? (u(), f(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), F(uy, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        T(vn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), f("aside", hy, [
        e.failure ? (u(), f("p", my, v(e.failure), 1)) : e.questions.length ? k("", !0) : (u(), f("p", py, "No questions about this text yet.")),
        (u(!0), f(D, null, ae(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: V(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", vy, v(L(rn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, yy),
            s.quote ? (u(), f(D, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", by, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (u(), f("p", ky, "Answered: " + v(s.answer), 1)) : k("", !0),
            T(gs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            T(js, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = L(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, gy);
        }), 128))
      ]))
    ], 2));
  }
}, Ho = /* @__PURE__ */ U(wy, [["__scopeId", "data-v-2718a08d"]]), $y = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, xy = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ht({ abstract: n.row.abstract, body: n.row.body }), o = O("");
    async function l() {
      const i = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, r) => (u(), F(pa, {
      title: "Edit the document",
      wide: "",
      onClose: r[3] || (r[3] = (c) => a("close"))
    }, {
      foot: j(() => [
        m("span", $y, v(o.value), 1),
        T(ge, {
          onClick: r[2] || (r[2] = (c) => a("close"))
        }, {
          default: j(() => [...r[6] || (r[6] = [
            K("Cancel", -1)
          ])]),
          _: 1
        }),
        T(ge, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: j(() => [...r[7] || (r[7] = [
            K("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: j(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: $e(l, ["prevent"])
        }, [
          m("label", null, [
            r[4] || (r[4] = m("span", null, "Abstract", -1)),
            Je(m("input", {
              "onUpdate:modelValue": r[0] || (r[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Yn, s.abstract]
            ])
          ]),
          m("label", null, [
            r[5] || (r[5] = m("span", null, "Text", -1)),
            Je(m("textarea", {
              "onUpdate:modelValue": r[1] || (r[1] = (c) => s.body = c),
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
}, Sy = /* @__PURE__ */ U(xy, [["__scopeId", "data-v-e99f14e0"]]);
function Wi(e, t) {
  const n = O([]), a = O(!1), s = O(null), o = O(0), l = O(!1), i = O("");
  let r = 0, c = 0;
  const d = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: A, id: S, title: x } = e(), B = `On ${A} ${S}, ${x}: `;
    return b.text.startsWith(B) ? b.text.slice(B.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: A, id: S } = e();
    if (!S) return;
    const x = ++c;
    l.value = !0, i.value = "";
    try {
      const B = await t([A, "comments", String(S), "--page", String(b), "--page-size", "25"]);
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
    const { noun: A, id: S } = e(), x = `${A}:${S}`, B = { id: `sending-${++r}`, text: b };
    n.value = [...n.value, B], o.value++, a.value = !0;
    const W = await t([A, "comment", String(S), b]);
    if (x !== `${e().noun}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((H) => H.id !== B.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await h();
    const N = (w = W.value) == null ? void 0 : w.id;
    N && !n.value.some((H) => H.id === N) && (n.value = [...n.value, { ...B, id: N }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return me(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function My(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let r = n.length - 1; r >= 0; r -= 1)
    for (let c = a.length - 1; c >= 0; c -= 1)
      s[r][c] = n[r] === a[c] ? s[r + 1][c + 1] + 1 : Math.max(s[r + 1][c], s[r][c + 1]);
  const o = [];
  let l = 0, i = 0;
  for (; l < n.length || i < a.length; )
    l < n.length && i < a.length && n[l] === a[i] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, i += 1) : i < a.length && (l === n.length || s[l][i + 1] >= s[l + 1][i]) ? (o.push({ key: `new:${i}`, type: "added", text: a[i] }), i += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const _y = {
  class: "document-tab",
  "data-document-revisions": ""
}, Cy = ["datetime"], Ey = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Ay = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Oy = {
  key: 2,
  class: "document-none"
}, Ty = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(null), o = O(""), l = E(() => s.value ? My(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", _y, [
      e.editing ? (u(), F(ge, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (h) => a("close-revision"))
      }, {
        default: j(() => [...d[1] || (d[1] = [
          K("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (u(), f(D, { key: 1 }, [
        (u(!0), f(D, null, ae(e.revisions, (h) => (u(), F(ge, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: j(() => [
            K("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, Cy)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", Ey, v(o.value), 1)) : k("", !0),
        s.value ? (u(), f(D, { key: 1 }, [
          T(ge, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: r
          }, {
            default: j(() => [...d[2] || (d[2] = [
              K("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", Ay, [
            (u(!0), f(D, null, ae(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: V(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (u(), f("p", Oy, "No revisions"))
    ]));
  }
}, Iy = /* @__PURE__ */ U(Ty, [["__scopeId", "data-v-3a381aa4"]]), By = "button, [data-comment-number]", Ry = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Hi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(By) || n.push(t.currentNode);
  return n;
}
function zo(e, t, n) {
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
const Ly = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function Ny(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Hi(e), s = a.map((c) => c.data).join(""), o = zo(a, n.startContainer, n.startOffset), l = s.slice(o, zo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: Ly(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function qy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function Dy(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function La(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function Py({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function jy(e, t) {
  const n = Hi(e), a = qy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = Dy(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(Py).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(La(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(La(t.number, t.id, t.label)) : l.at(-1).append(La(t.number, t.id, t.label))), !0;
}
function Fy(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !jy(e, a) && a.id && n.push(a.id);
  return n;
}
const Wy = (e) => e.closest(Ry) ?? e;
function Uo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Hy = {
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
    const a = e, s = n, o = O(null), l = O(null), i = O(null), r = O(!1), c = O(null);
    function d() {
      if (!l.value || r.value) return;
      l.value.innerHTML = a.html;
      const A = a.comments.filter((W) => W.quote).map((W) => ({ ...W, label: a.annotationLabel, hot: W.id === a.hot })), S = Fy(l.value, a.pending ? [...A, { ...a.pending, pending: !0 }] : A);
      s("lost", S);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const B = document.createElement("div");
      B.className = "inline-comment", Wy(x).after(B), c.value = B;
    }
    function h() {
      if (!l.value) return;
      const A = Ny(l.value);
      if (r.value = !!A, !A) {
        i.value = null;
        return;
      }
      const S = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(S.left - x.left, 0)}px`, top: `${S.top - x.top + o.value.scrollTop}px` }, s("select", A);
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
    return me(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), Me(() => {
      d(), document.addEventListener("selectionchange", h);
    }), et(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: je }), (A, S) => (u(), f("div", {
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
      i.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ve(i.value),
        "data-comment-pill": "",
        onMousedown: S[0] || (S[0] = $e(() => {
        }, ["prevent"])),
        onClick: S[1] || (S[1] = (x) => s("write"))
      }, [
        T(re, {
          name: "chat",
          size: 13
        }),
        S[2] || (S[2] = K("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (u(), F(da, {
        key: 1,
        to: c.value
      }, [
        fe(A.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      fe(A.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, zy = /* @__PURE__ */ U(Hy, [["__scopeId", "data-v-548d0aaa"]]), Uy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, Gy = { class: "document-tabs" }, Vy = { class: "document-body" }, Ky = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Yy = {
  key: 1,
  class: "document-loading"
}, Qy = {
  class: "document-details",
  "data-resource-fields": ""
}, Xy = 760, Jy = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = O(null), a = Eg(n), s = E(() => a.value !== null && a.value < Xy), o = O(null), l = O(""), i = O([]), r = O([]), c = O(""), d = O("comments"), h = O("text"), p = O(0), y = O(0), b = O([]), A = O(null), S = O(""), x = O(!1), B = O(null), W = O(null);
    let N = 0;
    const w = Wi(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (oe) => t.read(oe)), H = E(() => Uo(w.comments.value)), P = E(() => d.value === "questions" ? Uo(r.value) : H.value), q = E(() => d.value === "questions" ? P.value.length : w.total.value), _ = E(() => {
      var oe;
      return (oe = o.value) != null && oe.body ? Hs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), I = E(() => {
      var oe;
      return (((oe = o.value) == null ? void 0 : oe.body) ?? "").split(`
`).filter((Z) => /^#{1,4} /.test(Z)).map((Z, ne) => ({ key: String(ne), value: ne, label: Z.replace(/^#+ /, "") }));
    }), $ = E(() => H.value.find((oe) => oe.id === y.value)), g = E(() => {
      var oe;
      return (oe = o.value) != null && oe.close_reason ? "Closed" : "Open";
    }), M = E(() => h.value === "comments" && !s.value ? "text" : h.value), C = (oe) => oe.ok ? oe.value.rows ?? [] : [];
    async function R() {
      const oe = ++N, Z = await t.read([t.noun, "inspect", String(t.id)]);
      if (oe !== N) return;
      l.value = Z.ok ? "" : Z.error, o.value = Z.ok ? Z.value : null;
      const ne = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), De = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      oe === N && (r.value = C(ne), c.value = ne.ok ? "" : ne.error, i.value = De ? C(De) : []);
    }
    async function z(oe) {
      const Z = A.value ? ["--quote", A.value.quote, "--position", String(A.value.position), "--selection-type", A.value.selection_type] : [], ne = await t.read([t.noun, "comment", String(t.id), ...Z, "--", oe]);
      if (!ne.ok) throw new Error(ne.error);
      A.value = null, await Promise.all([R(), w.load()]);
    }
    async function te() {
      const oe = await t.read(["doc", "close", String(t.id)]);
      l.value = oe.ok ? "" : oe.error, oe.ok && await R();
    }
    function ee() {
      S.value.trim() || (A.value = null);
    }
    function le(oe) {
      var Z;
      if (p.value = oe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === oe ? 0 : oe : (Z = n.value.querySelector(d.value === "questions" ? `[data-question-id="${oe}"]` : `[data-comment-id="${oe}"]`)) == null || Z.scrollIntoView({ block: "nearest" });
    }
    async function pe(oe) {
      var Z, ne;
      h.value = "text", p.value = oe, await ((Z = B.value) == null ? void 0 : Z.nextTick()), (ne = B.value) == null || ne.show(oe);
    }
    function xe() {
      x.value = !1, R();
    }
    return me(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, A.value = null, r.value = [], c.value = "", R();
    }, { immediate: !0 }), me(d, () => {
      p.value = 0, y.value = 0;
    }), (oe, Z) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", Uy, [
        T(ge, {
          bordered: "",
          "data-text-edit": "",
          onClick: Z[0] || (Z[0] = (ne) => x.value = !0)
        }, {
          default: j(() => [...Z[14] || (Z[14] = [
            K("Edit", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      m("nav", Gy, [
        m("button", {
          type: "button",
          class: V(["document-tab-button", { on: M.value === "text" }]),
          "data-document-tab": "text",
          onClick: Z[1] || (Z[1] = (ne) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: V(["document-tab-button", { on: M.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Z[2] || (Z[2] = (ne) => h.value = "comments")
        }, [
          K(v(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(q.value || ""), 1)
        ], 2)) : k("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: V(["document-tab-button", { on: M.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Z[3] || (Z[3] = (ne) => h.value = "revisions")
        }, [
          Z[15] || (Z[15] = K("Revisions ", -1)),
          m("em", null, v(i.value.length || ""), 1)
        ], 2)) : k("", !0),
        Z[16] || (Z[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        M.value === "text" && I.value.length > 1 ? (u(), F(Li, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: I.value,
          "data-text-chapters": "",
          onPick: Z[4] || (Z[4] = (ne) => {
            var De;
            return (De = B.value) == null ? void 0 : De.showHeading(ne.value);
          })
        }, null, 8, ["label", "items"])) : k("", !0)
      ]),
      m("div", Vy, [
        l.value ? (u(), f("p", Ky, v(l.value), 1)) : o.value ? M.value === "revisions" ? (u(), F(Iy, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: te,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : M.value === "comments" ? (u(), F(Ho, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": Z[5] || (Z[5] = (ne) => d.value = ne),
          tab: "",
          comments: H.value,
          questions: r.value,
          hot: p.value,
          lost: b.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!L(w).nextPage.value,
          "comment-loading": L(w).loading.value,
          "comment-failure": L(w).failure.value,
          "comment-total": L(w).total.value,
          onMore: L(w).loadMore,
          onShow: pe,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(D, { key: 4 }, [
          T(zy, {
            ref_key: "words",
            ref: B,
            html: _.value,
            comments: P.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: A.value,
            inline: y.value,
            onSelect: Z[7] || (Z[7] = (ne) => A.value = ne),
            onClear: ee,
            onNumber: le,
            onWrite: Z[8] || (Z[8] = (ne) => {
              var De;
              return (De = W.value) == null ? void 0 : De.focus();
            }),
            onLost: Z[9] || (Z[9] = (ne) => b.value = ne)
          }, {
            inline: j(() => [
              $.value ? (u(), F(Ni, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: Z[6] || (Z[6] = (ne) => pe($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: j(() => [
              m("dl", Qy, [
                Z[18] || (Z[18] = m("h4", null, "Details", -1)),
                Z[19] || (Z[19] = m("dt", null, "State", -1)),
                m("dd", null, v(g.value), 1),
                o.value.close_reason ? (u(), f(D, { key: 0 }, [
                  Z[17] || (Z[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(o.value.close_reason), 1)
                ], 64)) : k("", !0),
                Z[20] || (Z[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  T(Ze, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                Z[21] || (Z[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  T(Ze, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? k("", !0) : (u(), F(Ho, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": Z[10] || (Z[10] = (ne) => d.value = ne),
            comments: H.value,
            questions: r.value,
            hot: p.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!L(w).nextPage.value,
            "comment-loading": L(w).loading.value,
            "comment-failure": L(w).failure.value,
            "comment-total": L(w).total.value,
            onMore: L(w).loadMore,
            onShow: pe,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", Yy, [
          T(Ke)
        ]))
      ]),
      o.value ? (u(), F(Wg, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: S.value,
        "onUpdate:draft": Z[11] || (Z[11] = (ne) => S.value = ne),
        selection: A.value,
        send: z,
        narrow: s.value,
        onClear: Z[12] || (Z[12] = (ne) => A.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      x.value ? (u(), F(Sy, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: Z[13] || (Z[13] = (ne) => x.value = !1),
        onSaved: xe
      }, null, 8, ["noun", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, WS = /* @__PURE__ */ U(Jy, [["__scopeId", "data-v-784faf41"]]), Zy = {
  key: 1,
  class: "row-list-failure"
}, e0 = ["data-row"], t0 = {
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
    moves: Boolean
  },
  setup(e) {
    const t = e, n = E(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", "data-row-list-moves": "" } : {}), a = O(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", Zy, v(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), F(ln, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        K(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(D, { key: 3 }, [
      (u(), F(rt(e.arrival || e.moves ? As : "ul"), Pe(n.value, { class: "row-list" }), {
        default: j(() => [
          (u(!0), f(D, null, ae(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            fe(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, e0))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : k("", !0)
    ], 64));
  }
}, n0 = /* @__PURE__ */ U(t0, [["__scopeId", "data-v-059675a8"]]), a0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, s0 = {
  key: 1,
  class: "agent-rows-note"
}, o0 = {
  key: 2,
  class: "agent-rows-note"
}, l0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, i0 = ["data-agent-row", "onClick"], r0 = { class: "agent-row-name" }, u0 = { class: "agent-row-state" }, c0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = E(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", a0, [
      e.loaded ? e.failure ? (u(), f("p", s0, v(e.failure), 1)) : e.rows.length ? (u(), f(D, { key: 3 }, [
        m("p", l0, v(a.value) + " running", 1),
        (u(!0), f(D, null, ae(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => L(qe)(`agents:${l.id}`)
        }, [
          m("span", r0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", u0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, i0))), 128))
      ], 64)) : (u(), f("p", o0, v(e.none), 1)) : (u(), F(Ke, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, HS = /* @__PURE__ */ U(c0, [["__scopeId", "data-v-a01e5a17"]]), dt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ue = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, d0 = 6;
function Ys(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const f0 = (e) => {
  const t = Ys(e, dt.lineChars), n = Math.max(dt.minWidth, Math.max(...t.map((a) => a.length)) * dt.charWidth + dt.padX * 2);
  return { name: e, lines: t, line: dt.line, padY: dt.padY, width: n, height: t.length * dt.line + dt.padY * 2 };
};
function h0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function m0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function p0(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, r) => [i, r]))), o = (l, i) => {
    const r = s(), c = (d) => {
      const h = i(d).map((p) => r.get(p));
      return h.length ? h.reduce((p, y) => p + y, 0) / h.length : r.get(d);
    };
    return [...l].sort((d, h) => c(d) - c(h));
  };
  for (let l = 0; l < d0; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function g0(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, i) => {
    const r = `${s[o]}:${l}`;
    (n.get(r) || n.set(r, []).get(r)).push({ arrow: s, end: o, other: i });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, i) => o[`${l}Share`] = (i + 1) / (s.length + 1));
}
function v0(e) {
  const t = [...new Set(e.flatMap(([N, w]) => [N, w]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = h0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, w) => !s.has(w)), l = m0(t, o), i = p0(t, o, l), r = new Map(t.map((N) => [N, f0(N)])), c = i.map((N) => N.reduce((w, H) => w + r.get(H).width, 0) + He.across * (N.length - 1)), d = Math.max(...c) + He.margin * 2, h = b0(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = He.margin;
  i.forEach((N, w) => {
    let H = (d - c[w]) / 2;
    const P = Math.max(...N.map((q) => r.get(q).height));
    N.forEach((q) => {
      const _ = r.get(q);
      p.set(q, { ..._, x: H, y: y + (P - _.height) / 2 }), H += _.width + He.across;
    }), y += P + (h[w] ?? He.down);
  });
  const b = e.map(([N, w, H], P) => ({ from: N, to: w, label: H || "", back: s.has(P) || l.get(w) <= l.get(N) }));
  g0(b, p);
  const A = b.map((N) => k0(N, p.get(N.from), p.get(N.to))), S = [...p.values()], x = S0(A, S), B = Math.max(y - He.down, ...x.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(d - He.margin, ...x.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + He.margin, height: B + He.margin, nodes: S, arrows: x };
}
const y0 = (e) => e ? Ys(e, Ue.lineChars).length * Ue.line + Ue.pad * 2 : 0;
function b0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += y0(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function k0(e, t, n) {
  const a = e.label ? Ys(e.label, Ue.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ue.charWidth + Ue.pad * 2 : 0, o = a.length * Ue.line + (a.length ? Ue.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const w0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, $0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], x0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ue.line);
function S0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = w0(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = x0.flatMap((r) => $0.map((c) => s(c, r))).find((r) => !n.some((c) => Go(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => Go(i, r)); ) i.y += Ue.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ue.line, pad: Ue.pad } };
  });
}
const Go = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, M0 = { class: "flowchart-tools" }, _0 = ["width", "height", "viewBox", "aria-label"], C0 = ["d"], E0 = ["x", "y", "width", "height"], A0 = ["x", "y"], O0 = ["x", "dy"], T0 = {
  key: 0,
  class: "flowchart-label"
}, I0 = ["x", "y", "width", "height"], B0 = ["x", "y"], R0 = ["x", "dy"], L0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => v0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = O(null), i = O({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var x;
      const A = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(A != null && A.width)) return;
      const S = Math.min(A.width / s.value.width, A.height / s.value.height, 1.5);
      i.value = { zoom: S, x: (A.width - s.value.width * S) / 2, y: (A.height - s.value.height * S) / 2 };
    }
    function d(A, S, x) {
      const { zoom: B, x: W, y: N } = i.value, w = Math.min(o.most, Math.max(o.least, B * A));
      i.value = { zoom: w, x: S - (S - W) * w / B, y: x - (x - N) * w / B };
    }
    function h(A) {
      const S = l.value.getBoundingClientRect();
      d(A, S.width / 2, S.height / 2);
    }
    function p(A) {
      const S = l.value.getBoundingClientRect();
      A.ctrlKey || A.metaKey ? d(A.deltaY < 0 ? o.step : 1 / o.step, A.clientX - S.left, A.clientY - S.top) : i.value = { ...i.value, x: i.value.x - A.deltaX, y: i.value.y - A.deltaY };
    }
    function y(A) {
      var S, x, B;
      A.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), r = { x: A.clientX - i.value.x, y: A.clientY - i.value.y }, (B = (x = l.value).setPointerCapture) == null || B.call(x, A.pointerId);
    }
    function b(A) {
      r && (i.value = { ...i.value, x: A.clientX - r.x, y: A.clientY - r.y });
    }
    return Me(c), (A, S) => (u(), F(pa, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (x) => a("close"))
    }, {
      default: j(() => [
        m("div", M0, [
          T(ge, {
            small: "",
            onClick: S[0] || (S[0] = (x) => h(o.step))
          }, {
            default: j(() => [...S[5] || (S[5] = [
              K("Zoom in", -1)
            ])]),
            _: 1
          }),
          T(ge, {
            small: "",
            onClick: S[1] || (S[1] = (x) => h(1 / o.step))
          }, {
            default: j(() => [...S[6] || (S[6] = [
              K("Zoom out", -1)
            ])]),
            _: 1
          }),
          T(ge, {
            small: "",
            onClick: c
          }, {
            default: j(() => [...S[7] || (S[7] = [
              K("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: $e(p, ["prevent"]),
          onPointerdown: y,
          onPointermove: b,
          onPointerup: S[2] || (S[2] = (x) => mo(r) ? r.value = null : r = null),
          onPointercancel: S[3] || (S[3] = (x) => mo(r) ? r.value = null : r = null)
        }, [
          (u(), f("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ve({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (u(!0), f(D, null, ae(s.value.arrows, (x, B) => (u(), f("path", {
              key: `arrow-${B}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, C0))), 128)),
            (u(!0), f(D, null, ae(s.value.nodes, (x) => (u(), f("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, E0),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (u(!0), f(D, null, ae(x.lines, (B, W) => (u(), f("tspan", {
                  key: W,
                  x: x.x + x.width / 2,
                  dy: W ? x.line : 0
                }, v(B), 9, O0))), 128))
              ], 8, A0)
            ]))), 128)),
            (u(!0), f(D, null, ae(s.value.arrows, (x, B) => (u(), f(D, {
              key: `label-${B}`
            }, [
              x.label ? (u(), f("g", T0, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, I0),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (u(!0), f(D, null, ae(x.label.lines, (W, N) => (u(), f("tspan", {
                    key: N,
                    x: x.label.x + x.label.width / 2,
                    dy: N ? x.label.line : 0
                  }, v(W), 9, R0))), 128))
                ], 8, B0)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, _0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, N0 = /* @__PURE__ */ U(L0, [["__scopeId", "data-v-51d24cfe"]]), q0 = ["innerHTML"], D0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => $o[t.name] || $o.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, q0));
  }
}, Ct = /* @__PURE__ */ U(D0, [["__scopeId", "data-v-beb5935c"]]), P0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: V(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      T(Ct, { name: "fold" })
    ], 2));
  }
}, Vt = /* @__PURE__ */ U(P0, [["__scopeId", "data-v-d03899bb"]]), j0 = ["data-tip", "aria-label"], F0 = {
  key: 0,
  class: "mact-word"
}, W0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: V(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      T(Ct, { name: "open" }),
      e.open ? (u(), f("span", F0, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, j0));
  }
}, zi = /* @__PURE__ */ U(W0, [["__scopeId", "data-v-3b292e09"]]), Ui = 120, Hn = 280, Gi = 160, H0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, z0 = ["leaving", "resizing", "entering"];
function vs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function U0(e) {
  const t = z0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = vs(e);
  return e.classList.add(...t), n;
}
function Vi(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = O(t()), s = O("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, p) {
    i(h);
    const y = U0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, r(h, vs(h)));
    });
    return b.observe(p), b;
  }
  async function d(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || H0()) {
      a.value = h;
      return;
    }
    const b = vs(p);
    if (l(p, b), s.value = "leaving", await n(Ui), y !== o) return;
    a.value = h, s.value = "resizing", await je(), r(p, b);
    const A = c(p);
    await n(Hn), A == null || A.disconnect(), y === o && (i(p), s.value = "entering", await n(Gi), y === o && (s.value = ""));
  }
  return me(t, (h) => d(h)), et(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const G0 = { class: "growing-card-top" }, V0 = ["aria-expanded"], K0 = { class: "growing-card-avatar" }, Y0 = { class: "growing-card-title" }, Q0 = { class: "growing-card-more" }, X0 = { class: "growing-card-body" }, J0 = {
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
    const n = e, a = t, s = O(!1), o = O(null), { folded: l, phase: i } = Vi(o, () => !s.value), r = E(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = E(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: V(["growing-card-wrap", L(i), { open: !L(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", G0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", K0, [
            e.bad ? (u(), F(Ct, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(D, { key: 1 }, [
              K(v(r.value), 1)
            ], 64)) : (u(), F(re, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", Y0, v(e.title), 1),
          T(Vt, { open: s.value }, null, 8, ["open"])
        ], 8, V0),
        e.action ? (u(), F(zi, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : k("", !0),
        e.commentable ? (u(), f("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (p) => a("comment"))
        }, [
          T(re, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", Q0, [
        m("div", X0, [
          (u(!0), f(D, null, ae(c.value, (p, y) => (u(), f("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Z0 = /* @__PURE__ */ U(J0, [["__scopeId", "data-v-f2b4930d"]]), eb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, tb = { class: "md inline" }, nb = ["disabled", "title", "onClick"], ab = {
  key: 1,
  class: "message-links-many"
}, sb = ["aria-expanded"], ob = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, lb = ["disabled", "onClick"], ib = { class: "row-pill message-links-chip" }, rb = { class: "message-links-title" }, ub = { key: 0 }, Na = 3, cb = "task", db = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.total || n.links.length), o = E(() => n.links.every((p) => p.endpoint.model === cb) ? "tasks" : "items"), l = O(!1), i = O(null);
    Vl(i, () => l.value = !1);
    const r = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, d = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, qe(p.endpoint.open_ref));
    }
    return (p, y) => (u(), f("div", {
      ref_key: "line",
      ref: i,
      class: V(["message-links", { many: s.value > Na, three: s.value === Na, open: l.value }]),
      "data-message-links": ""
    }, [
      T(Ct, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), f("span", eb, [
        m("span", tb, [
          y[1] || (y[1] = K("Linked: ", -1)),
          (u(!0), f(D, null, ae(e.links, (b) => (u(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (A) => h(b)
          }, [
            K(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            d(b) ? (u(), f(D, { key: 0 }, [
              K(" (" + v(d(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (u(), f(D, { key: 1 }, [
              K(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, nb))), 128))
        ])
      ])) : k("", !0),
      s.value >= Na ? (u(), f("span", ab, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          K(v(s.value) + " linked " + v(o.value) + " ", 1),
          T(Vt, { open: l.value }, null, 8, ["open"])
        ], 8, sb)
      ])) : k("", !0),
      l.value ? (u(), f("div", ob, [
        (u(!0), f(D, null, ae(e.links, (b) => (u(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (A) => h(b)
        }, [
          m("span", ib, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          m("span", rb, v(b.endpoint.title), 1),
          m("span", null, v(d(b)), 1),
          c(b) ? (u(), f("span", ub, "Unavailable")) : k("", !0)
        ], 8, lb))), 128))
      ])) : k("", !0),
      T(vn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, fb = /* @__PURE__ */ U(db, [["__scopeId", "data-v-e9bc783c"]]), hb = ["title", "aria-label"], mb = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, pb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, gb = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = E(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), f("span", {
      class: V(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), f("svg", mb, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", pb)) : k("", !0)
      ]))
    ], 10, hb));
  }
}, vb = /* @__PURE__ */ U(gb, [["__scopeId", "data-v-6dc92808"]]), yb = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, bb = (e) => e.worker_id != null ? "report" : "message", kb = (e) => yb[bb(e)], wb = "img,pre,table";
function $b(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function xb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Sb(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(wb)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = $b(xb(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Mb(e, t) {
  let n = null;
  const a = () => e.value && Sb(e.value);
  Me(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const _b = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Cb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Ln = /* @__PURE__ */ new WeakMap(), Be = "work", Qe = "sent", Eb = 50, Vo = 50, Ko = () => ({ rows: O([]), total: O(0), next: O(null), loading: O(!1), failure: O(""), version: 0 });
function Ab(e) {
  var A;
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
    const H = x === Be ? N.value.counterparts ?? [] : N.value.rows ?? [], P = W === 1 ? H : [...w.rows.value, ...H], q = x === Be ? (_) => `${_.endpoint.model}:${_.endpoint.id}` : (_) => _.id ?? _.target_id;
    w.rows.value = [...new Map(P.map((_) => [q(_), _])).values()], w.total.value = N.value.total ?? w.rows.value.length, w.next.value = N.value.next_page ?? null;
  }
  function i(S, x, B, W) {
    const N = S[x];
    N.version === B && (N.failure.value = W.message, N.loading.value = !1);
  }
  async function r(S, x, B) {
    const W = o(S, x), N = x === Be ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(S, x, W, B, await e.read(`link list --source message:${S.id} ${N} --page ${B} --page-size ${x === Be ? 10 : 25}`));
    } catch (w) {
      i(S, x, W, w);
    }
  }
  async function c(S) {
    const x = S.map((B) => ({ [Be]: o(B, Be), [Qe]: o(B, Qe) }));
    try {
      const B = await e.read(`link receipts --messages ${S.map((W) => W.id).join(",")}`);
      S.forEach((W, N) => {
        const w = B.ok ? B.value.messages[String(W.id)] : null;
        l(W, Be, x[N][Be], 1, B.ok ? { ok: !0, value: w.named } : B), l(W, Qe, x[N][Qe], 1, B.ok ? { ok: !0, value: w.sent } : B);
      });
    } catch (B) {
      S.forEach((W, N) => [Be, Qe].forEach((w) => i(W, w, x[N][w], B)));
    }
  }
  function d() {
    a = null;
    const S = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), S.forEach((x) => x.dirty.clear());
    for (let x = 0; x < S.length; x += Vo) c(S.slice(x, x + Vo));
  }
  function h(S, x = [Be, Qe]) {
    for (const B of x) S.dirty.add(B);
    s(S) && (n.add(S.id), a ?? (a = setTimeout(d, 0)));
  }
  function p(S) {
    const x = S.sources ?? (S.source_model && Number.isInteger(S.source_id) ? [{ model: S.source_model, id: S.source_id }] : []), B = S.link_types ?? (S.link_type ? [S.link_type] : []), W = B.length ? [Be, Qe].filter((w) => w === Be ? B.some((H) => ["about", "edited"].includes(H)) : B.includes("sent_to")) : [Be, Qe];
    if (!W.length) return;
    const N = x.length ? [...new Set(x.filter((w) => w.model === "message").map((w) => w.id))].map((w) => t.get(w)).filter(Boolean) : [...t.values()].filter(s).slice(0, Eb);
    for (const w of N) h(w, W);
  }
  const y = (A = e.follow) == null ? void 0 : A.call(e, ["link.*"], p), b = {
    attach(S, x) {
      let B = t.get(S);
      return B || (B = { id: S, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Be, Qe]), work: Ko(), sent: Ko() }, t.set(S, B)), B.views.add(x), B.dirty.size && h(B, [...B.dirty]), B;
    },
    shown(S) {
      S.dirty.size && h(S, [...S.dirty]);
    },
    detach(S, x) {
      S.views.delete(x), S.views.size || t.delete(S.id), t.size || (clearTimeout(a), y == null || y(), Ln.delete(e));
    },
    more(S, x) {
      const B = S == null ? void 0 : S[x];
      if (B != null && B.next.value && !B.loading.value) return r(S, x, B.next.value);
    }
  };
  return Ln.set(e, b), b;
}
function Ob(e, t, n) {
  const a = Xe(null);
  let s = null;
  const o = me(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Ab(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), p = me(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    r(() => {
      p(), h == null || h.disconnect(), s.detach(d, c), a.value = null;
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
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Be),
    loadSent: () => s == null ? void 0 : s.more(a.value, Qe)
  };
}
const Tb = ["data-incoming", "data-ref"], Ib = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Bb = { class: "message-body" }, Rb = ["title"], Lb = ["innerHTML"], Nb = ["title"], qb = ["innerHTML"], Db = {
  class: "message-faces",
  "data-message-faces": ""
}, Pb = ["title", "data-face", "onClick"], jb = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Fb = ["title", "data-reaction", "onClick"], Wb = {
  key: 0,
  class: "message-reaction-count"
}, Hb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, zb = ["href", "title"], Ub = ["src", "alt"], Gb = ["href"], Vb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Kb = ["disabled", "data-sent-worker", "title", "onClick"], Yb = { class: "message-foot" }, Qb = { class: "message-time" }, Xb = {
  class: "message-id",
  "data-message-id": ""
}, Jb = 1500, Zb = "An earlier message", ek = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1), o = O(null), l = E(() => ["user", "comment"].includes(n.message.type)), i = E(() => {
      const [oe, Z] = (n.message.commented_row || ":").split(":"), ne = pt(oe);
      return ne ? { ref: `${ne}:${Z}`, label: `${Gt(ne).title.toLowerCase()} ${Z}` } : null;
    }), r = E(() => n.message.worker_id ?? null), c = E(() => kb(n.message)), d = E(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var oe;
      await ((oe = navigator.clipboard) == null ? void 0 : oe.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Jb);
    }
    const p = wi(), y = E(() => p(n.message.text ?? "")), b = E(() => JSON.parse(n.message.flowchart_edges || "[]")), A = O(!1), S = E(() => p(n.quote || Zb));
    function x() {
      const oe = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      oe ? oe.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    Mb(o, () => `${n.message.text} ${n.quote}`);
    const B = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (oe) => `/api/files/message/${n.message.id}/${encodeURIComponent(oe)}`, N = E(() => JSON.parse(n.message.captions || "{}")), w = E(() => (n.message.files ?? []).map((oe) => ({ name: oe, address: W(oe), isImage: B.test(oe), title: N.value[oe] || oe }))), H = E(() => Oi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), P = Se(Le, null), { links: q, total: _, more: I, loading: $, failure: g, sentTo: M, sentMore: C, sentLoading: R, sentFailure: z, loadMore: te, loadSent: ee } = Ob(P, () => l.value && !n.message.local ? n.message.id : null, o), le = O(!1), pe = E(() => Cb(n.message.reactions));
    function xe(oe) {
      le.value = !1, a("react", n.message, oe);
    }
    return (oe, Z) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      T(Z0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: Z[0] || (Z[0] = (ne) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Tb)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Bb, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: V(["message-card", "md", { comment: i.value }]),
          onClick: Z[5] || (Z[5] = (...ne) => L(Nt) && L(Nt)(...ne))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: Z[1] || (Z[1] = $e((ne) => L(qe)(i.value.ref), ["stop"]))
          }, [
            T(re, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Rb)) : k("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(x, ["stop"]),
            innerHTML: S.value
          }, null, 8, Lb)) : k("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: Z[2] || (Z[2] = $e((ne) => L(qe)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + v(r.value), 9, Nb)) : k("", !0),
          T(pi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: j(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, qb)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (u(), f(D, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: Z[3] || (Z[3] = (ne) => A.value = !0)
            }, "Open the flowchart"),
            A.value ? (u(), F(N0, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: Z[4] || (Z[4] = (ne) => A.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: V(["message-tools", { picking: le.value }]),
          "data-message-tools": ""
        }, [
          le.value ? (u(), f(D, { key: 0 }, [
            m("div", Db, [
              (u(!0), f(D, null, ae(L(_b), (ne) => (u(), f("button", {
                key: ne,
                type: "button",
                class: "message-face",
                title: `React ${ne}`,
                "data-face": ne,
                onClick: (De) => xe(ne)
              }, v(ne), 9, Pb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: Z[6] || (Z[6] = (ne) => le.value = !1)
            }, [
              T(re, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), f(D, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: Z[7] || (Z[7] = (ne) => le.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: Z[8] || (Z[8] = (ne) => a("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: h
            }, v(s.value ? "Copied" : "Copy"), 1),
            d.value ? (u(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: Z[9] || (Z[9] = (ne) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      pe.value.length ? (u(), f("div", jb, [
        (u(!0), f(D, null, ae(pe.value, (ne) => (u(), f("button", {
          key: ne.emoji,
          type: "button",
          class: V(["message-reaction", { mine: ne.mine }]),
          title: ne.title,
          "data-reaction": ne.emoji,
          onClick: (De) => a("react", e.message, ne.emoji)
        }, [
          K(v(ne.emoji) + " ", 1),
          ne.count > 1 ? (u(), f("span", Wb, v(ne.count), 1)) : k("", !0)
        ], 10, Fb))), 128))
      ])) : k("", !0),
      w.value.length ? (u(), f("div", Hb, [
        (u(!0), f(D, null, ae(w.value, (ne) => (u(), f(D, {
          key: ne.name
        }, [
          ne.isImage ? (u(), f("a", {
            key: 0,
            href: ne.address,
            target: "_blank",
            class: "message-image",
            title: ne.title
          }, [
            m("img", {
              src: ne.address,
              alt: ne.name,
              "data-figure-picture": ""
            }, null, 8, Ub)
          ], 8, zb)) : (u(), f("a", {
            key: 1,
            href: ne.address,
            target: "_blank",
            class: "message-file"
          }, v(ne.name), 9, Gb))
        ], 64))), 128))
      ])) : k("", !0),
      L(M).length ? (u(), f("div", Vb, [
        T(re, {
          name: "send",
          size: 12
        }),
        (u(!0), f(D, null, ae(L(M), (ne) => (u(), f("button", {
          key: ne.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ne.unavailable || !ne.open_ref,
          "data-sent-worker": ne.id,
          title: `Open worker ${ne.id}`,
          onClick: $e((De) => ne.open_ref && L(qe)(ne.open_ref), ["stop"])
        }, [
          K("Also sent to worker " + v(ne.id), 1),
          ne.unavailable ? (u(), f(D, { key: 0 }, [
            K(" (unavailable)")
          ], 64)) : k("", !0)
        ], 8, Kb))), 128))
      ])) : k("", !0),
      T(vn, {
        more: L(C),
        loading: L(R),
        failure: L(z),
        label: "More recipients",
        onMore: L(ee)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Yb, [
        m("time", Qb, v(H.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(D, { key: 0 }, [
          Z[10] || (Z[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Xb, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (u(), F(vb, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      L(q).length || L(g) ? (u(), F(fb, {
        key: 3,
        links: L(q),
        total: L(_),
        more: L(I),
        loading: L($),
        failure: L(g),
        onMore: L(te)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Ib));
  }
}, zS = /* @__PURE__ */ U(ek, [["__scopeId", "data-v-d064e828"]]), na = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], qa = 200, Ki = (e) => {
  var t;
  return ((t = na.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? na[0].key;
}, US = (e) => {
  var t;
  return ((t = na.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, tk = ["aria-label"], nk = 300, Yo = 400, ak = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: qa } },
  setup(e) {
    const t = e, n = E(() => Ki(t.value)), a = E(() => n.value < qa ? [1, 0.25, 0.25] : n.value === qa ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: V(["ico", "prio", { hot: n.value >= Yo, high: n.value >= nk && n.value < Yo }]),
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
        style: ve({ opacity: a.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ve({ opacity: a.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ve({ opacity: a.value[2] })
      }, null, 4)
    ], 10, tk));
  }
}, GS = /* @__PURE__ */ U(ak, [["__scopeId", "data-v-b10e610f"]]), Yi = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], VS = (e) => {
  const t = Yi[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, sk = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Qo = (e) => sk[e.card.state] || "idle", ok = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Xo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Jo = (e, t) => Xo[Qo(e)] - Xo[Qo(t)], Zo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, KS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Jo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || ok(a, s)) : [...e].sort((a, s) => Jo(a, s) || (Zo[t] || Zo.state)(a, s)), lk = { class: "list-row" }, ik = {
  key: 0,
  class: "list-row-type"
}, rk = { class: "list-row-main" }, uk = {
  key: 0,
  class: "list-row-title"
}, ck = { class: "list-row-body" }, dk = {
  key: 1,
  class: "list-row-end"
}, fk = {
  key: 1,
  class: "list-row-text"
}, hk = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", lk, [
      e.type ? (u(), f("span", ik, v(e.type), 1)) : k("", !0),
      m("div", rk, [
        e.title ? (u(), f("span", uk, v(e.title), 1)) : k("", !0),
        m("div", ck, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", dk, [
          fe(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (u(), f("span", fk, v(e.text), 1)) : k("", !0)
    ]));
  }
}, YS = /* @__PURE__ */ U(hk, [["__scopeId", "data-v-dfc8c3a7"]]), QS = {
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
    return (l, i) => (u(), F(Li, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, mk = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: V(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      fe(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Qi = /* @__PURE__ */ U(mk, [["__scopeId", "data-v-978e0921"]]), pk = ["aria-label"], gk = { class: "head" }, vk = { class: "names" }, yk = { class: "body" }, bk = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = si(a, n), i = oi(s);
    return (r, c) => (u(), F(da, { to: "body" }, [
      T(zt, {
        name: "side",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: j(() => [
          L(s) ? (u(), f("div", {
            key: 0,
            class: V(["veil", { over: e.over, under: e.depth }]),
            style: ve({ "--depth": e.depth, zIndex: L(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = $e((...d) => L(o) && L(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: V(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), f(D, { key: 0 }, [
                m("header", gk, [
                  m("div", vk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (u(), F(st, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0)
                  ]),
                  fe(r.$slots, "actions", {}, void 0, !0),
                  T(ma, {
                    title: e.closeLabel,
                    onClick: L(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), F(Qi, { key: 0 }, {
                  default: j(() => [
                    fe(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", yk, [
                  fe(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : fe(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, pk)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, XS = /* @__PURE__ */ U(bk, [["__scopeId", "data-v-f276f055"]]), kk = {
  key: 1,
  class: "text-field-label"
}, wk = {
  key: 2,
  class: "text-field-end"
}, $k = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Pt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = on(e, "modelValue"), a = ca(), s = "onUpdate:modelValue" in (((d = Jr()) == null ? void 0 : d.vnode.props) || {}), o = E(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = E(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = E(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = O(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: V(["text-field", { large: e.large, ended: h.$slots.end }, L(a).class]),
      style: ve(L(a).style)
    }, [
      e.icon ? (u(), F(re, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (u(), f("span", kk, v(e.label), 1)) : k("", !0),
      Je(m("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [L(cs), o.value]
      ]),
      h.$slots.end ? (u(), f("span", wk, [
        fe(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : Je((u(), f("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, r.value, { onInput: l }), null, 16)), [
      [L(cs), o.value]
    ]);
  }
}), JS = /* @__PURE__ */ U($k, [["__scopeId", "data-v-d9c38ca8"]]), xk = { class: "title" }, Sk = { class: "state" }, Mk = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ss(t.line, t.events);
    return (o, l) => (u(), F(n0, {
      rows: L(n),
      failure: L(a),
      loaded: L(s),
      empty: e.empty
    }, {
      default: j(({ row: i }) => [
        m("span", xk, v(i.title), 1),
        m("span", Sk, v(L(rn)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, ZS = /* @__PURE__ */ U(Mk, [["__scopeId", "data-v-9191a6f0"]]);
function _k(e = 1e3, t = null) {
  const n = O(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Ie(() => clearInterval(a)), n;
}
const Da = O(Date.now() / 1e3);
let el = 0, Nn = 0;
function Qs() {
  return Nn || (Da.value = Date.now() / 1e3, el = setInterval(() => Da.value = Date.now() / 1e3, 1e3)), Nn += 1, Il() && fa(() => {
    Nn -= 1, Nn || clearInterval(el);
  }), Da;
}
const Ck = 200, Ek = Ui + Hn + Gi + Ck;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Ak(e, t, n) {
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
      var l, i, r, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: r, transform: c, display: d }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: r, transform: c, display: d }))(getComputedStyle(e)),
    parent: Yt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Ok(e, t, n, a) {
  me(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(Ak(o, l, n.value)), performance.now() - l < Ek) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const Tk = ["title", "data-figure-mark", "data-folded", "data-open"], Ik = {
  key: 2,
  class: "worker"
}, Bk = { class: "head" }, Rk = { key: 0 }, Lk = {
  key: 3,
  class: "status"
}, Nk = {
  key: 0,
  class: "figure"
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
    const t = e, n = ca(), a = ["onClick", "onAct"], s = E(() => Object.fromEntries(Object.entries(n).filter(([le]) => !a.includes(le)))), o = O(!1), l = E(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = E(() => t.open !== void 0), r = E(() => i.value || l.value), c = E(() => i.value ? t.open : o.value), d = E(() => i.value ? !t.open : l.value && !o.value), h = E(() => !!(t.mark.action && n.onAct)), p = E(() => r.value || h.value || !!n.onClick), y = O(null), b = O(null), { folded: A, phase: S } = Vi(y, () => d.value);
    Ok(y, d, S, Se(Le, null));
    function x(le) {
      var pe, xe;
      if (!(le.target !== y.value && !b.value.contains(le.target))) {
        if (i.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, le);
        if (l.value) return void (o.value = !o.value);
        (xe = n.onAct || n.onClick) == null || xe(le);
      }
    }
    const B = (le) => n.onAct(le), W = ["failed", "unfinished"], N = E(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), w = E(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), H = E(() => w.value || "var(--tone-work)"), P = E(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), q = Qs(), _ = E(
      () => t.mark.began_at && P.value && !t.mark.figure && !t.mark.counting ? Ti(q.value - t.mark.began_at) : ""
    ), I = E(() => {
      const { started: le, ended: pe } = t.mark;
      return le ? pe ? `ran ${Wo(pe - le, !0)}` : Wo(q.value - le, !0) : _.value;
    }), $ = ["bad", "danger", "warn"], g = E(() => $.includes(N.value) || t.mark.asks ? "attention" : P.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], C = E(() => M.includes(N.value)), R = E(() => g.value === "process" ? "running" : C.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), z = E(
      () => !!(t.mark.figure || I.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), te = E(() => [t.mark.title, t.mark.time ? Oi(t.mark.time) : ""].filter(Boolean).join(" · ")), ee = E(() => ({
      ...w.value ? { "--mark": w.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, pe) => (u(), f("div", Pe(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        L(S),
        {
          open: c.value,
          folding: i.value && d.value,
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
      style: ee.value,
      title: te.value,
      "data-figure-mark": e.mark.key,
      "data-folded": L(A) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (u(), F(rt(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": r.value ? String(!!c.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (u(), F(Ct, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), F(re, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", Ik, v(e.mark.worker), 1)) : k("", !0),
          m("span", Bk, [
            T(st, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", Rk, v(e.mark.name), 1)) : k("", !0),
            r.value ? (u(), F(Vt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          z.value ? (u(), f("span", Lk, [
            e.mark.figure ? (u(), f("span", Nk, v(e.mark.figure), 1)) : k("", !0),
            I.value ? (u(), f("span", qk, v(I.value), 1)) : k("", !0),
            e.mark.stopping ? (u(), f("span", Dk, "Stopping")) : k("", !0),
            e.mark.news ? (u(), f("span", Pk, v(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (u(), f("span", jk)) : R.value ? (u(), F(Ct, {
              key: 5,
              class: V(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (u(), f("span", Fk, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), F(zi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(B, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && P.value ? (u(), f("span", Wk, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: H.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !L(A) ? (u(), F(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !L(A) ? (u(), f("div", Hk, [
        e.mark.bodyLabel ? (u(), f("p", zk, v(e.mark.bodyLabel), 1)) : k("", !0),
        T(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !L(A) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Uk)) : k("", !0),
      e.mark.card ? (u(), F(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      fe(le.$slots, "default", {
        shown: !L(A)
      }, void 0, !0)
    ], 16, Tk));
  }
}), Xi = /* @__PURE__ */ U(Gk, [["__scopeId", "data-v-2aa9c496"]]), Vk = 8, Kk = 40, Yk = [];
class Xs {
  constructor(t, n, { top: a = Vk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Yk.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Xs(t, {
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
const Qk = 60, Xk = 300, Ji = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Zi(e, t) {
  const n = O([]), a = O(0);
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
  async function r() {
    const h = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return h.ok ? (n.value = [...h.value.lines, ...n.value], a.value = h.value.first_byte, !0) : !1;
  }
  const c = new Xs("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Xk, more: () => a.value > 0, previous: r }, { top: Qk });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Jk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function er(e) {
  var n;
  const t = Jk[e] || ((n = Gt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Zk = (e) => er(String(e).split(":")[0]), ew = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), tw = { passed: "good", failed: "danger", warned: "warn", running: "" }, nw = { good: "good", warn: "warn", danger: "danger" }, tl = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Bf(e.target_model, e.target_id || 0)
}, aw = { "open row": (e) => Zk(e.target_model), "open page": () => er("pages") };
function sw(e, t) {
  const n = t || {}, a = tl[n.click] && e.target_model ? n.click : "";
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
    handlers: a ? { onAct: () => tl[a](e) } : {}
  };
}
const ow = 24, lw = 1e3, nl = 2e3, iw = 0.25, rw = 5e3;
function uw(e, t = ow, n = () => !0) {
  const a = O(!1), s = O(0), o = O(!1);
  let l = 0, i = 0, r = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const N = c();
    return N ? N.scrollHeight - N.scrollTop - N.clientHeight : 0;
  }, h = () => !c() || d() <= t;
  function p(N) {
    if (clearTimeout(l), !N) {
      o.value = !1, r = Date.now();
      return;
    }
    const w = Date.now() - r < nl ? nl : lw;
    l = setTimeout(() => o.value = a.value, w);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(N = !1) {
    const w = c();
    w && N && w.scrollTo ? w.scrollTo({ top: w.scrollHeight, behavior: "smooth" }) : w && (w.scrollTop = w.scrollHeight), y();
  }
  function A() {
    x(), !a.value && (a.value = !0, p(!0));
  }
  const S = () => !!c() && d() <= c().clientHeight * iw;
  function x() {
    clearTimeout(i), S() && (i = setTimeout(() => a.value && S() && n() && b(!0), rw));
  }
  function B() {
    h() ? y() : A();
  }
  function W(N = 1, w = !1) {
    a.value ? s.value += Math.max(0, N) : b(w);
  }
  return Il() && fa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: y, toBottom: b, left: A, scrolled: B, arrived: W };
}
const cw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, dw = (e) => String(e ?? "").replace(cw, ""), fw = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(null), { away: o, scrolled: l, arrived: i, toBottom: r } = uw(s);
    me(
      () => n.lines.length,
      () => je(() => {
        var d;
        i(), s.value && ((d = n.feed) == null || d.drawn(s.value));
      }),
      { immediate: !0 }
    );
    function c(d) {
      l(), a("older", d.target);
    }
    return (d, h) => (u(), f("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      K(v(L(dw)(e.lines.join(`
`)) || e.empty), 1),
      L(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => L(r)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, hw = /* @__PURE__ */ U(fw, [["__scopeId", "data-v-5a8693fe"]]), mw = "*.*", pw = {
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
    const t = e, n = Se(Le, null), a = new zl();
    me(
      () => a.patterns,
      (r, c, d) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, r, (y) => a.dispatch(y));
        d(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = E(() => !!(t.declaration.shipped || t.declaration.trusted)), i = E(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [mw] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), F(Fi, {
      key: 0,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), F(ji, {
      key: 1,
      entry: i.value,
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
}, kw = "process", al = "task", ww = {
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
    ), s = E(() => ew.has(t.mark.variant) && t.mark.detail || ""), o = E(() => t.mark.target_model === al ? t.mark.target_id : 0), l = Zi(
      Ji(n),
      () => t.mark.target_id
    ), i = l.lines, r = O(!1), c = O(""), d = E(() => !t.declaration.body_url && t.mark.target_model === kw && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      r.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = E(() => t.shown && d.value);
    return me(p, (y) => y && h()), Ts(() => p.value && h(), () => p.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, b) => (u(), f("div", {
      class: V(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = $e(() => {
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
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (u(), f(D, { key: 1 }, [
          s.value ? (u(), f(D, { key: 0 }, [
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", vw, v(s.value), 1)
          ], 64)) : k("", !0),
          d.value && c.value ? (u(), f("p", yw, v(c.value), 1)) : d.value && r.value ? (u(), f(D, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            T(hw, {
              class: "mark-terminal",
              lines: L(i),
              feed: L(l).feed,
              onOlder: L(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", bw, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = $e((A) => L(qe)(`${al}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ys = /* @__PURE__ */ U(ww, [["__scopeId", "data-v-df71b15a"]]), $w = ["title", "aria-label", "onClick"], xw = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Sw = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = E(() => sf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = O(""), s = Se(Le);
    async function o(l) {
      const i = await yn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (u(), f(D, null, [
      (u(!0), f(D, null, ae(n.value, (r) => (u(), f("button", {
        key: r.runs,
        type: "button",
        class: "mark-button",
        title: r.label,
        "aria-label": r.label,
        onClick: $e((c) => o(r), ["stop"])
      }, [
        T(Ct, {
          name: r.icon
        }, null, 8, ["name"])
      ], 8, $w))), 128)),
      a.value ? (u(), f("span", xw, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, Mw = /* @__PURE__ */ U(Sw, [["__scopeId", "data-v-7a62c88e"]]);
function tr(e, t) {
  const n = Xe(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ce.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const nr = tr("/api/marks", "marks"), e6 = nr.fetchAll, _w = nr.find, Cw = ["data-ref"], Ew = ["data-ref"], Aw = { class: "mark-row" }, Ow = "dock add", Tw = "questions.answer", Iw = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = E(() => _w(a.mark.type)), o = E(() => sw(a.mark, s.value)), l = E(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = E(() => l.value || !!o.value.handlers.onAct), r = E(() => a.mark.type === Tw), c = O(!1);
    function d() {
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
      return (b = s.value) != null && b.card ? (u(), f("div", {
        key: 0,
        class: V(["thread-turn", "card", "whole-card", { "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        T(ys, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Cw)) : (u(), f("div", {
        key: 1,
        class: V(["thread-turn", "card", { "full-width": (A = s.value) == null ? void 0 : A.full_width, docked: e.docked, "user-side": L(n).has(e.mark.variant), "answer-bubble": r.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Aw, [
          T(Xi, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: d
          }, Zr({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: S }) => [
                T(ys, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: S
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          T(Mw, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Ew));
    };
  }
}, Bw = /* @__PURE__ */ U(Iw, [["__scopeId", "data-v-424ddb61"]]), Rw = ["data-ref"], Lw = ["inert"], Nw = { class: "group-fold" }, qw = { class: "thread-group" }, Dw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = O(!1), a = O(!1), s = O(!1), o = O(null);
    me(n, async (i) => {
      var r;
      a.value = !0, await je(), (r = o.value) == null || r.offsetHeight, s.value = i;
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
    return (i, r) => (u(), f("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      T(Xi, {
        mark: l.value,
        open: n.value,
        onClick: r[0] || (r[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), f("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: V(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", Nw, [
          m("div", qw, [
            (u(!0), f(D, null, ae(e.group.marks, (c) => (u(), F(Bw, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Lw)) : k("", !0)
    ], 8, Rw));
  }
}, t6 = /* @__PURE__ */ U(Dw, [["__scopeId", "data-v-45b58b9b"]]);
function Pw(e) {
  const t = O(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Me(() => n.observe(e.value)), et(() => n.disconnect()), t;
}
const jw = { class: "chat-dock-fold" }, Fw = ["aria-label"], Ww = { class: "chat-dock-head" }, Hw = { class: "chat-dock-inner" }, zw = { class: "chat-dock-foot" }, ar = 700, Uw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = O(null), a = O(null), s = Pw(a), o = O(!1);
    let l = 0;
    return Me(() => l = setTimeout(() => o.value = !0, ar)), et(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: V(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", jw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: V(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          fe(i.$slots, "edge", {}, void 0, !0),
          m("header", Ww, [
            fe(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: V(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", Hw, [
              m("div", {
                class: V(["chat-dock-grow", { settled: o.value }]),
                style: ve(L(s) === null ? null : { height: `${L(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  fe(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          fe(i.$slots, "still", {}, void 0, !0),
          m("footer", zw, [
            fe(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Fw)
      ])
    ], 2));
  }
}, Gw = /* @__PURE__ */ U(Uw, [["__scopeId", "data-v-574cba3d"]]), Vw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Pa = 5, Kw = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Pa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Pa}s`, animationDelay: `${(n - Pa).toFixed(2)}s` };
    return (s, o) => (u(), f("span", Vw, [
      m("i", { style: a })
    ]));
  }
}, Yw = /* @__PURE__ */ U(Kw, [["__scopeId", "data-v-2a7bc150"]]), Qw = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), bs = (e) => e.charAt(0).toUpperCase() + e.slice(1), Xw = (e) => bs(e.replace(/_at$/, "").replaceAll("_", " ")), Jw = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Zw = (e, t, n) => [bs(`${e} ${n}`), (t == null ? void 0 : t.state) && bs(t.state)].filter(Boolean).join(" · "), sr = (e) => e.given_name || `${Qn(e.role)} ${e.id}`, e2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? sr(t) : (e == null ? void 0 : e.name) ?? "", t2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? sr(t) : "", n2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Qw.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Xw(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], a2 = { reviewing: "Under review" }, s2 = (e, t) => e || a2[t == null ? void 0 : t.state] || "", or = tr("/api/docks", "docks"), n6 = or.fetchAll, Rt = or.find, o2 = 6, ja = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Js = (e) => Date.parse(e.leaves_at) / 1e3, Xt = (e) => !!(e.leaves_at && !e.kept), l2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Xt(e) || t < Js(e) || n.has(e.id)), i2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => l2(a, t, n)).sort((a, s) => a.id - s.id);
function r2(e, t, n = o2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Js(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const u2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ks = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), c2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), d2 = (e) => ({ ...e.kept ? ks("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ks("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), f2 = ["keep", "unkeep", "open", "undock"], h2 = (e) => ({ ...e, iconOnly: f2.includes(e.action) });
function m2(e, t) {
  var n;
  return [
    ...c2(e, t) ? [d2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Gt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    ks("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(h2);
}
function lr(e, t) {
  const n = m2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: u2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const p2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || lr(e, t).title, g2 = { class: "dock-text" }, v2 = ["title"], y2 = {
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
    const n = t, a = e, s = E(() => Rt(a.item.type)), o = Qs(), l = E(() => Gs(a.item.created_at, o.value * 1e3)), i = O(null), r = O(null), c = O(null), d = O(null), h = E(() => lr(a.item, s.value)), p = tt(), y = E(() => `dock.${a.item.id}`), b = E(() => p.props[y.value].data.value), A = E(() => p2(a.item, s.value, b.value)), S = E(() => ea(a.item.target_model ?? "")), x = E(() => {
      var $;
      return (($ = s.value) == null ? void 0 : $.word) ?? "";
    }), B = E(() => ({ ...b.value, id: a.item.target_id, noun: S.value })), W = () => {
      var $, g;
      return ((g = ($ = s.value) == null ? void 0 : $.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    wc(Tl, { data: b, reload: W, readOutput: Ji(p) }), me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      ($, g, M) => {
        var R;
        W();
        const C = (R = p.followUndeclared) == null ? void 0 : R.call(p, [`${S.value.replaceAll("-", "_")}.*`], (z) => {
          (!z.row_id || z.row_id === a.item.target_id) && W();
        });
        M(() => C == null ? void 0 : C());
      },
      { immediate: !0 }
    );
    const N = O(/* @__PURE__ */ new Set()), w = O("");
    async function H($) {
      if ($.action === "undock") return n("undock", $);
      if ($.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (N.value = /* @__PURE__ */ new Set([...N.value, $.label])), w.value = "";
      const M = await yn($, { id: a.item.target_id }, p.environment);
      (M == null ? void 0 : M.ok) === !1 && (N.value = new Set([...N.value].filter((C) => C !== $.label)), w.value = `Could not ${$.label.toLowerCase()}: ${M.error}`);
    }
    const P = E(() => h.value.actions.filter(($) => !N.value.has($.label))), q = E(() => {
      var $;
      return s2(($ = s.value) == null ? void 0 : $.badge, B.value);
    }), _ = E(() => h.value.controls), I = E(() => {
      var $;
      return !!(($ = s.value) != null && $.draws_head) && !a.collapsed;
    });
    return ($, g) => {
      var M, C, R, z;
      return u(), F(Gw, {
        label: h.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        type: (C = s.value) != null && C.needs_user ? "waiting" : "",
        folded: !!((R = s.value) != null && R.folds) && e.folded,
        body: !!((z = s.value) != null && z.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[3] || (g[3] = (te) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (u(), F(Yw, {
            key: 0,
            "ends-at": L(Js)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: j(() => {
          var te;
          return [
            I.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(D, { key: 1 }, [
              T(re, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", g2, [
                m("span", {
                  class: V(["dock-title", { strip: e.collapsed }]),
                  title: A.value
                }, v(A.value), 11, v2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (te = s.value) != null && te.leaves_after_seconds ? k("", !0) : (u(), f(D, { key: 0 }, [
                K(v(l.value), 1)
              ], 64))
            ], 512),
            _.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = $e(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(D, null, ae(_.value, (ee) => {
                var le, pe;
                return u(), f(D, {
                  key: ee.action + ee.runs
                }, [
                  !N.value.has(ee.label) && (!((le = ee.variants) != null && le.length) || !((pe = B.value) != null && pe.state) || ee.variants.includes(B.value.state)) ? (u(), F(ge, {
                    key: 0,
                    variant: "icon",
                    class: V({ kept: ee.pressed }),
                    "aria-pressed": ee.pressed,
                    "aria-label": ee.label,
                    title: ee.label,
                    "data-dock-action": ee.action,
                    onClick: (xe) => H(ee)
                  }, {
                    default: j(() => [
                      T(re, {
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
          w.value || e.refusal ? (u(), f("p", y2, v(w.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: j(() => {
          var te;
          return [
            m("span", b2, [
              q.value ? (u(), f("span", {
                key: 0,
                class: V(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : k("", !0),
              x.value ? (u(), f("span", k2, v(x.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: r,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (te = s.value) != null && te.folds ? (u(), F(ge, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (ee) => n("fold"))
            }, {
              default: j(() => [
                K(v(s.value.folds) + " ", 1),
                T(Vt, {
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
              T(js, {
                name: `dock.${e.item.type}`,
                row: B.value,
                environment: L(p).environment,
                "read-only": L(p).readOnly,
                "object-name": L(ea)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (ee) => w.value = ee),
                onDone: $.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(D, null, ae(P.value, (ee) => (u(), F(ge, {
                key: ee.action + ee.runs,
                small: "",
                variant: ee.primary ? "primary" : "ghost",
                bordered: !ee.primary,
                "data-dock-action": ee.action,
                onClick: (le) => H(ee)
              }, {
                default: j(() => [
                  K(v(ee.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var te;
          return [
            (te = s.value) != null && te.body_url ? (u(), F(ys, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: i.value,
              foot: r.value,
              actions: c.value,
              time: d.value,
              folded: e.folded,
              collapsed: e.collapsed
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : k("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, sl = /* @__PURE__ */ U($2, [["__scopeId", "data-v-16f25ff3"]]), x2 = 24, S2 = 8, a6 = 420;
function s6({ top: e, before: t, height: n, shown: a }) {
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
fi("journal.activity", () => aa.activity);
fi("journal.side.mini", () => aa.sideMini);
const ir = "journal.viewer.";
function C2(e, t, n) {
  try {
    const a = n.getItem(ir + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function E2(e, t, n) {
  try {
    n.setItem(ir + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function ol(e, t, n = window.localStorage) {
  const a = O(C2(e, t, n));
  return me(a, (s) => E2(e, s, n), { deep: !0 }), a;
}
const A2 = {
  key: "dock-all",
  class: "dock-all"
}, O2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var $, g;
    const t = e, n = _k(500), a = O(/* @__PURE__ */ new Set()), s = Se(Le), o = O(/* @__PURE__ */ new Set()), l = O({});
    async function i(M, C) {
      l.value = { ...l.value, [M.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, M.id]);
      const R = await yn(C, { id: M.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((z) => z !== M.id)), l.value = { ...l.value, [M.id]: `Could not dismiss this card: ${R.error}` });
    }
    const r = E(
      () => i2(
        t.items.filter((M) => !o.value.has(M.id)),
        n.value,
        a.value
      )
    ), c = E(
      () => r2(
        r.value.filter((M) => ja(M, Rt)),
        n.value
      )
    ), d = E(() => r.value.filter((M) => !c.value.includes(M) && !ja(M, Rt))), h = ol(`dock-size:${(($ = aa.identity) == null ? void 0 : $.root) || location.host}`, null), p = (M) => {
      var C;
      return !!((C = Rt(M.type)) != null && C.needs_user);
    }, y = O(/* @__PURE__ */ new Set()), b = O(/* @__PURE__ */ new Set()), A = E(() => r.value.length === 1), S = (M) => p(M) || A.value, x = (M) => S(M) ? y.value.has(M.id) || b.value.has(M.id) : h.value ? h.value.collapsed && !h.value.opened.includes(M.id) : t.collapsed, B = E(() => r.value.some(x));
    me(() => t.collapsed, (M) => {
      b.value = new Set(M ? r.value.filter(p).map((C) => C.id) : []);
    });
    function W() {
      const M = !B.value;
      h.value = { collapsed: M, opened: [] }, y.value = new Set(M ? r.value.filter(p).map((C) => C.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function N(M) {
      var R;
      if (!x(M)) return;
      if (S(M)) {
        y.value = new Set([...y.value].filter((z) => z !== M.id)), b.value = new Set([...b.value].filter((z) => z !== M.id));
        return;
      }
      const C = (R = h.value) != null && R.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...C, M.id] };
    }
    const w = ol(`dock-folded:${((g = aa.identity) == null ? void 0 : g.root) || location.host}`, {}), H = (M) => {
      var C;
      return !!((C = Rt(M.type)) != null && C.folds) && (t.insidesFolded || M2(w.value[M.id], ja(M, Rt) || t.folded));
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
    function I(M) {
      a.value = new Set([...a.value].filter((C) => C !== M.id));
    }
    return (M, C) => (u(), F(As, {
      tag: "div",
      name: "dock",
      duration: L(ar),
      class: "dock-stack"
    }, {
      default: j(() => [
        r.value.length > 1 ? (u(), f("div", A2, [
          T(ge, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": B.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: j(() => [
              T(Vt, {
                open: !B.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (u(!0), f(D, null, ae(d.value, (R) => (u(), F(sl, {
          key: R.id,
          item: R,
          class: V({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: H(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (z) => N(R),
          onFold: (z) => P(R),
          onUndock: (z) => i(R, z),
          onMouseenter: (z) => _(R),
          onMouseleave: (z) => I(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (u(!0), f(D, null, ae(c.value, (R) => (u(), F(sl, {
          key: R.id,
          item: R,
          class: V({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: H(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (z) => N(R),
          onFold: (z) => P(R),
          onUndock: (z) => i(R, z),
          onMouseenter: (z) => _(R),
          onMouseleave: (z) => I(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, o6 = /* @__PURE__ */ U(O2, [["__scopeId", "data-v-2c47a65e"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, zn = (e) => Math.min(Math.max(e, 0), 1), T2 = (e) => {
  const t = zn(e);
  return t * t * (3 - 2 * t);
}, bt = (e, t, n) => T2((e - t) / (n - t));
function l6(e) {
  const t = zn(e), n = zn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = bt(s, 0.26, 0.38) * (1 - bt(s, 0.76, 0.96)), l = bt(s, 0.38, 0.76), i = bt(t, 0, 0.12) * (1 - bt(t, 0.88, 1)), r = bt(s, 0.2, 0.34) * (1 - bt(s, 0.84, 1)), c = Math.sin(Math.PI * zn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function i6(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const ll = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, r6 = (e) => ll[e] ?? ll.butler, Zs = 2400, I2 = 0.05;
function B2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, I2), l = Math.min(t + Zs * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function u6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function R2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function c6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const d6 = (e, t) => ({ ...e, stretch: t.stretch }), f6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, rr = (e, t) => t >= (e.least ?? 0);
function h6(e, t, n) {
  if (!rr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const m6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), L2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", il = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), N2 = (e) => e.right > e.left && e.bottom > e.top;
function p6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(L2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = il(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = il(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), N2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function ur(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [d, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[h] || e[d] > o[p]) && (i = -1);
      else {
        const b = (o[h] - e[d]) / y, A = (o[p] - e[d]) / y;
        l = Math.max(l, Math.min(b, A)), i = Math.min(i, Math.max(b, A));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const r = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: r, y: c, on: "surface", surface: s.id, dx: r - s.left, dy: c - s.top };
  }
  return a;
}
const Ae = {
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
}, dn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), q2 = (e) => e * e * (3 - 2 * e), Oe = (e, [t, n]) => q2(dn(e, t, n)), D2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], mt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, qn = ([e, t], n) => e + n() * (t - e);
function P2(e) {
  return D2.map(() => {
    const t = qn(mt.speed, e), n = qn(mt.angle, e) * Math.PI / 180, a = qn(mt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [qn(mt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const j2 = P2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function F2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * mt.gravity * (t[2] - mt.floor))) / mt.gravity;
}
function g6(e, t, n = j2) {
  const a = Ae.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = F2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= mt.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const v6 = (e, t) => e && Ae[e.name] ? { name: e.name, u: t / e.frames } : null;
function y6(e, t) {
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
const b6 = () => Array.from({ length: Ae.pogo.count }, (e, t) => Ae.pogo.bounce * (t + 1) / Ae.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function k6(e, t, n) {
  const { away: a, side: s } = Ae.bug_smash, o = s * a * n, [l, i] = [t.left + Dt.margin * n, t.right - Dt.margin * n], r = Math.min(Math.max(e + o + s * Dt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function w6(e, t, n) {
  const a = Ae.bug_smash, s = Oe(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Dt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Dt.tall * n * (1 - Oe(t, a.emerge)),
      turn: 90 * (1 - Oe(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Oe(t, a.gone)
    }
  };
}
function $6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = B2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ne = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function x6(e) {
  const t = Ne.least + Math.floor(e() * (Ne.most - Ne.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ne.walls[Math.floor(e() * Ne.walls.length)],
    along: Ne.margin + e() * (1 - 2 * Ne.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ws(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ne.margin, l = ((e.along - Ne.margin + e.way * Ne.speed * n / a) / s % 2 + 2) % 2, i = Ne.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Ne.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ne.inset : t.right - Ne.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function W2(e, t) {
  const n = Ae.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = R2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function S6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ae.bug_shot, { frame: l, bug: i, shot: r } = W2(n, e.length), c = e.map((x, B) => ({ ...ws(x, t, Math.min(n / o.fps, Un(B).shot)), shot: B < r })), d = Oe(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((x, B) => ({ bug: x, index: B, seconds: n / o.fps - Un(B).shot, spot: ws(x, t, Un(B).shot) })).filter((x) => x.seconds >= 0), b = y.flatMap((x) => {
    const B = (s == null ? void 0 : s.get(x.index)) ?? V2(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, B), s && K2(B, x.seconds, a), Y2(B, x.seconds, a);
  }), A = y.filter((x) => U2(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: S }, slush: b, camera: A };
}
function Un(e) {
  const t = Ae.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function M6(e, t, n, a) {
  const { limit: s, margin: o } = Ae.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = Un(d), p = ws(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - p.x), A = Math.abs(p.x - r) >= y ? r : p.x + b * y, S = b > 0 ? Math.max(r, Math.min(A, i)) : Math.min(r, Math.max(A, l)), x = { from: r, to: S, begin: h.walk, end: h.aim };
    return r = S, x;
  });
}
function _6(e, t, n) {
  var o;
  const a = Ae.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Oe(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const _e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, H2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function z2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const U2 = (e) => e.along * 97 % 1 < _e.camera, fn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * _e.gravity * t * t });
function G2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * _e.gravity * (t.bottom - e.from.y))) / _e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * _e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / _e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += _e.step) {
    const d = Math.min(c + _e.step, l.t), h = fn(e, d), p = ur(i, h, n);
    if (p) return { ...p, t: c + (d - c) * p.share };
    i = h;
  }
  const r = fn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function V2(e, t, n, a = []) {
  const s = z2(e.along + 1), [o, l] = H2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: _e.count }, () => {
    const r = i + (s() - 0.5) * 2 * (_e.spread * Math.PI / 180), c = _e.speed[0] + s() * (_e.speed[1] - _e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: _e.radius[0] + s() * (_e.radius[1] - _e.radius[0]) };
    return { ...d, ...G2(d, t, a) };
  });
}
function K2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += _e.step) {
      const l = Math.min(o + _e.step, s), i = ur(fn(a, o), fn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function Y2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...fn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - _e.hold) / _e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, r = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - r)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: r, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function C6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: r } = Ae.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / r, d = (o[1] - o[0]) * i / r, h = Oe(e, [0, c]), p = Oe(e, [c, c + d]);
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
function E6(e, t, n, a, s) {
  const { sway: o, above: l } = Ae.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (A) => {
    const [S, x] = [A.x - e.at.x, A.y - e.at.y];
    return { x: i.x + S * c - x * d, y: i.y + S * d + x * c };
  }, [p, y] = [...n].sort((A, S) => A.x - S.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: b.map((A, S) => ({ from: A, to: S < b.length / 2 ? p : y })) };
}
const A6 = (e, t) => Oe(t, e.grows) * (1 - Oe(t, e.sinks));
function sa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: dn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: dn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function O6(e, t) {
  const n = Ae[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = sa(n, t), l = 1 - (1 - n.small) * Oe(a, n.shrinks) * (1 - Oe(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = sa(n, t), o = n.flat * Oe(a, n.squashes) * (1 - Oe(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * dn(s, ...n.springs)) * (1 - dn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const T6 = (e) => e === "pack_box";
function I6(e) {
  const { into: t, out: n } = sa(Ae.rope_swing, e);
  return 1 - Oe(t, [0, 1]) * (1 - Oe(n, [0, 1]));
}
function B6(e) {
  const t = Ae.rope_swing, { into: n, out: a } = sa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Oe(n, [0, 1]) * (1 - Oe(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Q2 = { after: 3 }, eo = 10, X2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, J2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Z2 = { weight: 19 }, cr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, e5 = { every: 120 }, dr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, fr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, t5 = {
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
}, $n = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: eo }), ie = (e, t, n = {}) => $n(e, "clip", t, n), Fa = (e, t, n = {}) => $n(e, "look", t, n), rl = (e, t, n = {}) => $n(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...$n(e, "pick", t, n), ...a }), ke = (e) => $n("nothing", "nothing", e, {}), n5 = 120, a5 = 300, Wa = (e, t) => ({ ...ie(e, t), cooldown: a5 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), s5 = () => [ie("joy", 2)], kt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), wt = (e) => ({ ...e, cooldown: X2[e.name] }), Qt = (e) => ({ ...e, shenanigan: !0, lasts: J2[e.name] }), va = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...de("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ie("nod", 2), ke(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...de("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...wt(ie("bug_shot", 3)), toward: "", onto: !1 },
    { ...wt(ie("bug_smash", 2)), toward: "", onto: !1 },
    ie("nod", 2)
  ]),
  ...de("tests_failed", { cooldown: 20, toward: "card" }, [ie("startled", 2), ie("dismay", 1), ie("tantrum", 3), ke(1)]),
  ...de("committed", { cooldown: 30, toward: "card", onto: !0 }, [ie("nod", 2), ke(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...de("sin_fixed", { cooldown: 300 }, [ie("halo", 1), ke(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...de("sin_committed", { cooldown: 300 }, [ie("repent", 1), ke(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...de("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ie("nod", 4), ie("hand_rub", 4), ke(7)]),
  ...de("question_asked", { cooldown: 60 }, [ie("ask_sign", 9), ie("look_up", 3), ke(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...de("reported", { cooldown: 90 }, [rl("read", 3), ie("nod", 1), ke(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [rl("read", 3), ke(1)]),
  ...de("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), ke(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), ke(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, s5()),
  ...de("bar_failed", { holds: !0 }, [ie("fume", 1), ie("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...de("standing", { cooldown: 12 }, [ie("look_left", 2), ie("look_right", 2), ie("look_up", 1), ke(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...de("launched", { cooldown: 300 }, [ie("tumble", 3), ke(47)]),
  // a break from the hammering now and then
  ...de("building", { cooldown: 30 }, [ie("wipe_brow", 4), ie("look_left", 1), ie("look_right", 1), ke(69)]),
  ...de("failed", { cooldown: 20, toward: "card" }, [ie("shake", 3), ie("tantrum", 2), ke(2)]),
  ...de("refused", { cooldown: 20 }, [ie("shake", 1), ke(1)]),
  ...de("work_done", { cooldown: 120 }, [ie("stretch", 2), ke(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...de("pondering", { cooldown: [30, 60] }, [ye("ponder", 1)]),
  ...de("thought_cloud", { cooldown: 90 }, [ye("cloud", 1)]),
  ...de("light_bulb", { cooldown: 150 }, [ye("bulb", 1)]),
  ...de("answered", { cooldown: 15 }, [Fa("amused", 3), ke(2)]),
  ...de("heard", { cooldown: 30 }, [
    ie("bow", 1, { voices: ["butler"] }),
    ie("salute", 1, { voices: ["squire"] }),
    ie("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ke(1)
  ]),
  ...de("long_walk", { cooldown: 90 }, [ie("stumble", 3), ke(22)]),
  ...de("card_arrived", { cooldown: 20, toward: "card" }, [ie("glance", 7), ke(13)]),
  ...de("typing", { cooldown: 60 }, [Fa("reading", 1), ke(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(t5).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Fa(t, 1)])),
  ...Object.entries(dr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(fr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [ie(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...de("pastime", {}, [
    kt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    kt("rest", 3, 180, 120),
    kt("yawn", 2, 60, 60),
    kt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    kt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    kt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    kt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Qt(wt(ie("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Qt(wt(ie("disco", 2, { ball: "bubble" }))),
    ke(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...de("held:search", { cooldown: n5 }, [Wa("search", 3), { ...Wa("binoculars", 2), when: { home: !0 } }, { ...Wa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...de("held:type", {}, [ie("type", 3), ie("type_ponder", 1)]),
  ...de("held:compacting", {}, [ie("pack_box", 3), ie("vacuum", 2), ie("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...de("spell", {}, [ye("writing", 12, { state: "writing" }), ye("reading", 12, { state: "reading" }), ye("searching", 12, { state: "searching" }), ke(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...de("tickled", {}, [{ ...wt(ie("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...de("eager", {}, [ie("eager", 2, { slow: !0 }), ke(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...de("jump", {}, [Qt(wt(ie("backflip", 7, { high: !0 }))), ie("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...de("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...de("unit", { cooldown: cr.build.cooldown }, [ye("unit", Z2.weight), ke(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: e5.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...de("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...de("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    Qt(ye("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ye("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ye("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ye("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ye("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ye("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Qt(wt(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...de("laptop", {}, [ye("seat", 6, {}, { stay: [60, 150] }), ye("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...de("ledge_at", {}, [ye("middle", 2, {}, { along: 1 / 2 }), ye("third", 1, {}, { along: 1 / 3 }), ye("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...de("composed_as", {}, [
    ye("facing", 4, {}, { turn: 0, leans: 0 }),
    ye("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ye("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ye("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ye("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], hr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), mr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), o5 = (e) => Array.isArray(e) ? e[0] : e, l5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, i5 = (e) => va.some((t) => t.when.moment === e);
function r5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || mr(d).every(([h, p]) => n(h) >= o5(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = va.filter((d) => hr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= Q2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ve(e, t) {
  const n = r5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (pr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function pr(e, t, n) {
  var a;
  for (const [s, o] of mr(t)) (a = e.memory) == null || a.set(s, e.now + l5(o, n));
}
function R6(e, t, n) {
  pr(e, va.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const L6 = (e) => Object.values(cr).find((t) => hr(t.when, e)) ?? null, u5 = (e, t, n) => n - t <= (e.lifetime ?? eo), N6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || rr(e.clip, t));
class gr {
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
const $s = {
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
}, q6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), vr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), D6 = {
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
}, P6 = 120, c5 = 20, j6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < c5), d5 = (e) => $s[e] || $s.idle, F6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, yr = "airborne", f5 = "landing", h5 = "travelling", br = "grounded", W6 = ({ airborne: e, landing: t, trip: n }) => e ? yr : t ? f5 : n != null && n.started ? h5 : br;
function H6(e, t) {
  var s;
  const n = m5(e, t);
  return e.mode === br && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function m5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === yr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...p5(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : d5(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function p5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const xs = (e) => e.outcome, g5 = "plugin:code-commandments:sins:", ul = (e) => e.type === "plugins.card" && e.markKey.startsWith(g5), v5 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => ul(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => ul(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], z6 = (e, t) => e.filter((n) => n.author === "user" && ta(n.read_at) > t).map((n) => ({ beat: "read_message", time: ta(n.read_at), card: Si(n) })).sort((n, a) => n.time - a.time), cl = { user: "reacted", agent: "agent_reacted" };
function U6(e, t) {
  return e.filter((n) => cl[n.author] && _t(n) > t).map((n) => ({ beat: `${cl[n.author]}:${n.emoji}`, time: _t(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const y5 = [.../* @__PURE__ */ new Set([...Object.values(dr).flatMap((e) => Object.keys(e)), ...Object.keys(fr)])];
function G6(e, t) {
  return e.filter((n) => n.author === "agent" && _t(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = y5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: _t(n), card: Si(n) })).sort((n, a) => n.time - a.time);
}
const b5 = (e) => new gr(e).isTest(), oa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[xs(e)] || "";
}, k5 = 1800, w5 = (e, t) => {
  if (oa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && oa(n) !== "finished" && Number(e.time) - Number(n.time) <= k5 ? "tests_fixed" : "tests_passed";
};
function V6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(b5), s = a.filter((i) => oa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, oa(i))), o.map((i) => ({ beat: w5(i, s), time: Number(i.time), card: i.key }));
}
function K6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(xs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: xs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const Y6 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: _t(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function Q6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function X6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function J6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = v5.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function to(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const dl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function $5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    to(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function Z6(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : i5(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function eM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const fl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function tM(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, i = o % Re.sweep, r = Re.sweep - Re.returnSeconds, c = fl((i - r) / Re.returnSeconds), d = i <= r ? fl(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const hl = 3, kr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, ml = 12, nM = (e, t) => ({ mood: e, began: t, seen: 0 });
function aM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!kr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= hl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * ml) / ml, lasts: hl } };
}
const sM = (e) => e.posture === "hang" && !kr(e.face), x5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), S5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function oM(e, t, n) {
  return x5.has(e) ? 1 / 0 : !S5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(wr(n - t.began, t.share) - ot.lead, 0);
}
const M5 = 5;
function lM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= M5 ? { beat: "long_walk", time: n } : null };
}
const _5 = 30, Dn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function iM(e, t, n, a, s = null) {
  if (t && n < t.until || !Dn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, i] = Dn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Dn.every } : { state: e, began: 0, until: 0, next: n + Dn.every };
}
const rM = (e, t, n) => t && n < t.until && vr.has(e.state) ? { state: t.state, since: t.began } : e, ot = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, wr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function uM(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = wr(o, e.share);
  return s ? { eager: C5(t, l), moment: null } : l > ot.lead ? { eager: t, moment: null } : l < ot.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ot.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ot.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function C5(e, t) {
  return e.on && t > ot.lead + ot.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ot.lead && t >= ot.least ? { ...e, on: !0, calm: !1 } : e;
}
const E5 = 1, A5 = { look: "look", gaze: "gaze" };
function O5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [A5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const T5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), I5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > E5 * t, memory: a, now: s, room: o }, n).name === "backflip", B5 = { work: ["building"], idle: ["standing"] };
function cM(e, t, n, a) {
  const s = $s[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(B5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), vr.has(e) ? { moments: o, began: n || a } : (n && a - n >= _5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function R5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const pl = { pondering: R5 };
function dM(e, t, n, a, s, o) {
  if (pl[e.beat]) {
    const i = pl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = O5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== eo && { lifetime: l.lifetime } } } : null;
}
function fM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = T5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const hM = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function mM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function pM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const gM = (e, t) => !!(e != null && e.watches) && !t.once, vM = 10, yM = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || u5(a, a.queuedAt, n)), bM = (e, t) => t ? null : e[0] ?? null;
function kM(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const wM = (e, t) => !t.during || !e.some((n) => n.during === t.during), L5 = 2 * Math.PI, N5 = 500;
function $M(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / N5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = L5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, A = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !r ? s && !t.behind && !y.behind ? D5(y, t, n, p, s) : j5(y, t, n, p) : t) ?? y, S = A != null && A.behind && A.mood === "reading" ? q5(e.point, A, n, l, s) : A;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: a };
}
function q5(e, t, n, a, s) {
  const o = (_) => _ * 180 / Math.PI, l = (_) => o(Math.atan2(Math.sin(_ * Math.PI / 180), Math.cos(_ * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : d, b = y + l(c - y), A = Math.min(Math.max(a / 1e3, 0), 0.1), S = Re.turnSpeed * A, x = h ? y + Math.min(Math.max(b - y, -S), S) : b, B = h ? e.readingFollow + p : x, W = B + (x - B) * (1 - Math.exp(-A / Re.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, w = o(to(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), H = Math.min(Math.max(w, -N.up), N.down), P = Re.tipSpeed * A, q = h ? e.readingPitch + Math.min(Math.max(H - e.readingPitch, -P), P) : H;
  return { ...t, readingYaw: x, readingFollow: W, readingPitch: q, readingFacing: i };
}
function D5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (B) => {
    const { yaw: W, pitch: N } = to(B.x - n.x, s, n.y - B.y, o);
    return { yaw: W, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [dl(i(e)), dl(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [p, y] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [b, A, S] = r.map((B, W) => p * B + y * c[W]), x = s * b / A;
  return { ...t, x: n.x + x, y: n.y - $5(x, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const P5 = 0.15;
function xM(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= P5;
}
function j5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const F5 = (e) => !(e != null && e.on);
function SM(e, t, n) {
  if (F5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const hn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, nt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ha = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), gl = (e) => e * e * (3 - 2 * e);
function W5(e) {
  if (e < 0 || e >= nt.seconds) return null;
  const t = Ha(e, ...nt.flicker), n = Math.floor(t * nt.flickers * 2) % 2 === 0, a = e < nt.flicker[1] ? n ? 0.35 + 0.5 * t : nt.dim : 1;
  return { strength: 1 - gl(Ha(e, ...nt.fade)), lit: a, white: e < nt.flash[0] ? 0 : 1 - gl(Ha(e, ...nt.flash)) };
}
const MM = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function _M(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = W5(t - e.at);
  return a && { colour: hn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: nt.signs[e.tone], ...a } };
}
function CM(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function EM(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= hn.looks || a === null && n - e.since >= hn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function AM(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ht = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, OM = { behind: 39, figure: 40, ahead: 41 }, H5 = "[data-figure-pile]", z5 = { amber: [1, 0.69, 0.125], good: hn.colours.good, bad: hn.colours.bad }, Gn = { phases: 4, ms: 230, dim: 0.25 }, TM = (e, t, n) => e !== "amber" || (t + n) % Gn.phases < Gn.phases / 2 ? 1 : Gn.dim, IM = (e) => e === "amber" ? Gn.phases : 1;
function BM(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const RM = Object.keys(z5), Ye = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Jt = ([e, t], n) => e + n() * (t - e);
function LM(e) {
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
const za = { high: 3, gap: 1 };
function NM(e) {
  const t = Math.floor(e / za.high);
  return { left: -(ht.inside + ht.width / 2 + t * (ht.width + za.gap)), up: e % za.high * (ht.height - ht.top) };
}
const U5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, G5 = { after: 5 }, V5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new gr(t).isBuild());
function qM(e, t, n) {
  const a = V5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= G5.after ? s : null;
}
function DM(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: U5(n, a, s) } : null;
}
const vl = { ahead: 140, up: 70 };
function PM(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * vl.ahead, y: a - vl.up } } : o ? { at: { x: n(o), y: a - o.up - ht.height } } : t ? { at: null } : null;
}
const Ua = { least: 4e3, most: 1e4 }, K5 = (e) => Ua.least + e() * (Ua.most - Ua.least), $t = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function jM(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = K5(t);
    if (n.length >= $t.most || t() >= $t.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * ($t.at[0] + t() * ($t.at[1] - $t.at[0]));
    n.push({ from: o, to: o + $t.ms }), a = o + $t.ms;
  }
}
const FM = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), WM = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), $r = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), HM = new Set(va.filter((e) => $r.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Y5 = (e) => e.some((t) => t.state === "built"), zM = (e, t) => Y5(t) ? e.filter((n) => !$r.has(n.beat)) : e, gt = { reach: 40, room: 6 }, Q5 = (e, t) => t <= e - gt.reach + 2, UM = (e, t, n) => Q5(e, n) ? t - gt.reach : e - gt.reach - gt.room, GM = (e, t, n, a) => a > 0 && t < e && t + gt.reach >= e - 2 ? Math.min(n, Math.max(e, t + gt.reach)) : e, Ga = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, VM = (e) => Jt(e() < Ga.longShare ? Ga.long : Ga.short, e), X5 = 2 * ht.width;
function KM(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= X5 ? o : e + (o - e + s / 2) % s;
}
const J5 = 60, YM = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= J5, yl = "[data-figure-home]", xn = () => {
  var t;
  const e = document.querySelector(yl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(yl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Z5 = "[data-figure-docked-bars]", e$ = "[data-figure-chat-foot]", t$ = [0.85, 0.6, 0.35, 0.15], n$ = ["question", "waiting", "suggestion"], QM = (e, t) => n$.find((n) => e[n] > 0 && t[n] === "behind") || null;
function XM() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const a$ = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", s$ = "[data-figure-newest]";
function xr() {
  var a, s;
  const e = (a = xn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(s$), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !no(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function mn(e, t, n = xr()) {
  if (!e || !n) return !0;
  const a = ut(e, t), s = ba(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Te.top * t.size, bottom: a.top + Te.bottom * t.size }, l = xt.gap;
  return !ya(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function JM(e, t, n, a = xr()) {
  if (!a || mn(t, e, a)) return null;
  const s = ba(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = At(), r = t.posture === "stand" ? so * e.size : Tr * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= d && mn(p, e, a) && B$(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Va = 0.26, Sr = 0.54, o$ = 1.25 / 5.4, Sn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Va, travels: "stand" },
  lounge: { drop: Va, travels: "stand" },
  composed: { drop: Va, travels: "stand" },
  hang: { drop: Sr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, ZM = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * o$ * Math.cos(t * Math.PI / 180),
  y: 1 - n - Sr
}), tn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), l$ = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), e_ = (e, t) => (e === "sit" ? l$.has(t) : tn.has(e)) ? e : "stand";
function t_(e, t) {
  return e.facing === t.facing || !tn.has(e.posture) && !tn.has(t.posture) ? t : { posture: "stand", facing: tn.has(e.posture) ? e.facing : t.facing };
}
const n_ = 0.25, a_ = (e, t) => tn.has(e) && Sn[t].drop === 0, Mr = 2, i$ = 90, r$ = 180, u$ = 140, c$ = 280, d$ = 420, f$ = 0.25, h$ = 290, m$ = 600, p$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", g$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ka = 5;
function la(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ka) return null;
  (l || i) && (o = Math.max(o, Mr));
  const y = o > 1, b = Math.abs(t.x - e.x), A = b < Ka ? 0 : b / (i$ * o) * 1e3, S = Math.min(A, y ? u$ : r$), x = Math.abs(t.y - e.y), B = t.y < e.y, W = B && !p && I5(x, n, r, c, d, h), N = B ? d$ + Math.min(x, 400) * f$ : Math.sqrt(2 * x / Zs) * 1e3, w = {
    x: t.x,
    y: t.y,
    ms: x > Ka ? W ? m$ : N : 0,
    lead: W ? h$ : B ? c$ : 0,
    easing: B ? p$ : g$,
    hopping: !0,
    clip: W ? "backflip" : B ? "jump" : "fall"
  }, H = { x: t.x, y: t.y, ms: A + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, P = p ? v$(t, n) : w, q = B && !a ? [{ ...H, y: e.y }, P] : [{ ...w, x: e.x }, H];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const v$ = (e, t) => ({ x: e.x, y: e.y, ms: Ae.pogo.frames / Ae.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), y$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], s_ = (e, t, n) => e.posture === "walk" && n ? "walk" : y$(e.clip, t), ut = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Sn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ya = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, no = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = xn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Pn = 0.5, bl = 20;
function o_(e, t, n = At()) {
  const a = ut(e, t);
  return a.left >= n.left + bl && a.right <= n.right - bl;
}
function ao(e, t, n = At()) {
  const a = ut(e, t), s = a.right - a.left, o = ba(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Pn && i <= n.right + Pn && a.top >= n.top - Pn && r <= n.bottom + Pn;
}
const ia = [0.35, 0.5, 0.65], ra = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Te = { left: ia[0], right: ia.at(-1), top: ra[0], bottom: ra.at(-1) }, b$ = 0.24;
function ba(e) {
  if (e.posture === "stand") return { left: Te.left, right: Te.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + b$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Te.left, t), right: Math.max(Te.right, t) };
}
function k$(e, { size: t }, n = At()) {
  const a = ba(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const so = (Te.right - Te.left) / 2 + 0.08;
function l_(e, t) {
  return e === "hang" ? Te : { ...Te, bottom: Math.min(Te.bottom, 1 - t - Sn[e].drop) };
}
const w$ = "[data-figure-agent]";
function _r(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !no(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const r of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[r].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, r), c.setEnd(o, r + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Cr = (e) => ra.flatMap(
  (t) => ia.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function oo(e, t, n = "") {
  if (!mn(e, t)) return ia.length * ra.length;
  const a = ut(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(a$)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && ya(s, r) && no(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return Cr(s).filter(([i, r]) => l(i, r) || _r(i, r, n)).length;
}
function $$(e, t) {
  const n = ut(e, t);
  return Cr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => _r(a, s, "", w$)).length;
}
const kl = 4;
function i_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = kl; o <= s; o += kl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!$$(i, e) && mn(i, e)) return i;
    }
  return null;
}
function pn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => ao(l, t, a) && mn(l, t)).map((l) => ({ spot: l, covered: oo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Er = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), x$ = [0.5, 0.25, 0.75], S$ = (e) => Er(e.getBoundingClientRect(), x$), Ar = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, M$ = so, _$ = (e, t, { size: n }, a = M$) => Or(e, Ar[t], a * n, "stand");
function Or(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const C$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Tr = 0.1, E$ = (e, t, { size: n }) => Or(e, C$[t], Tr * n, "sit"), A$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ya = 60;
function r_(e, t) {
  const n = A$(t);
  return !e.aside || Math.abs(n) >= Ya ? t : n < 0 ? 360 - Ya : Ya;
}
const nn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, O$ = (e) => [.../* @__PURE__ */ new Set([e, ...nn.turns.map((t) => (t + 360) % 360)])];
function u_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = O$(t), l = nn.every[0] + a() * (nn.every[1] - nn.every[0]);
  return { face: t, from: s ? T$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function T$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / nn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function c_(e, t) {
  const { element: n, edge: a } = ka(), s = ["left", "right"].map((i) => Mn(E$(a, i, e), e)).filter((i) => n && ao(i, e) && !oo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function d_(e, t, { size: n }) {
  const a = (Te.right - Te.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Ir } : e;
}
const Ir = 7;
function Br() {
  const e = [...document.querySelectorAll(H5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function I$(e, t) {
  const n = ut(e, t), a = n.right - n.left;
  return { left: n.left + Te.left * a, right: n.left + Te.right * a, top: n.top + Te.top * a, bottom: n.bottom };
}
function B$(e, t) {
  const n = Br();
  return !n || !ya(I$(e, t), n);
}
const R$ = 4;
function ka() {
  const e = _n(), t = Br(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > R$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Ir - n, 0) } };
}
const f_ = ({ size: e, below: t }) => (1 - t) * e;
function Mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = Sn[e.posture].drop * a;
  return { ...k$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ss = (e, t) => Object.keys(Ar).map((n) => Mn(_$(e, n, t), t)), lo = (e, t) => Er(e, t$).map((n) => Mn(n, t)), Rr = (e, t, n) => pn(e, t, n) ?? e[0];
function h_(e, t) {
  const { element: n, edge: a } = ka();
  return { ...Rr(Ss(a, e), e, t), view: null, on: n };
}
function m_(e, t, n, a) {
  const { element: s, edge: o } = ka(), l = (a ? Ss(o, t) : [...Ss(o, t), ...lo(o, t)]).filter(
    (c) => !ya(ut(c, t), e)
  ), i = pn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), r = i && !oo(i, t) ? i : pn(l, t, n);
  return r && { ...r, view: null, on: s };
}
function _n() {
  var a;
  const e = xn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Z5);
  if (!t) return { ...wa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const wl = { within: 2 };
function p_(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = wa().edge;
  return a.left > s.left + wl.within || a.left + a.width < s.left + s.width - wl.within;
}
const L$ = "[data-figure-closing]";
function g_() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(L$));
}
const Lr = "[data-figure-progress]";
function v_(e) {
  const t = e.querySelector(Lr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function y_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const N$ = { across: 300, above: 380, below: 60 };
function b_(e) {
  const { across: t, above: n, below: a } = N$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: q$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const q$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Nr = "[data-figure-bar]", Ms = { back: 144, along: 0.4 };
function k_(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(Nr) : null;
  if (!(s != null && s.querySelector(Lr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Mn({ x: o - Ms.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function w_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ms.along * a.size ? t.x + Ms.along * a.size : e.x, y: e.y, behind: !0 };
}
function $_(e) {
  const t = e.querySelector(Nr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function wa() {
  const e = xn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function x_(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = wa(), r = n === null ? D$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Mn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function D$(e, t, n, a, s) {
  const o = lo(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + ht.width < s && r.x + a - gt.reach - gt.room >= l);
  return pn(i.length ? i : o, t, n);
}
const P$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function S_(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Mr));
  const y = (W) => {
    const N = ut(W, n, Sn[W.posture].travels);
    return { x: N.left, y: N.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return j$(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [A, ...S] = [e, ...r, t].map(y), x = la(A, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: p }), B = S.slice(1).map((W, N) => {
    var w;
    return (w = la(S[N], W, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : w.legs.find((H) => H.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...B.filter(Boolean)] };
}
function j$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / P$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? la(e, n, o.size, { pace: l }) : la(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function M_(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function __(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && pn(S$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ka();
  return { ...Rr(lo(s, t), t, n), view: null, on: a };
}
const F$ = "[data-figure-bubble]", W$ = 250;
let an = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), qr = 0;
const Kt = () => an, Qa = /* @__PURE__ */ new WeakMap();
let H$ = 0;
function io(e) {
  return Qa.has(e) || Qa.set(e, `floor-${++H$}`), Qa.get(e);
}
const z$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, U$ = () => {
  var e, t;
  return ((t = (e = xn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function G$(e, t) {
  var a;
  const n = (a = e.querySelector(e$)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function V$(e, t) {
  const n = e && G$(e, t), a = e ? [...e.querySelectorAll(F$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || z$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: io(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const K$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= W$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Dr(e = an, t = performance.now()) {
  const n = At(), a = U$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = wa();
  return c.element && r.push({ id: io(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...V$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: K$(e, d, t) }))) });
}
const _s = /* @__PURE__ */ new Set();
function Y$(e) {
  return _s.add(e), () => _s.delete(e);
}
function Q$() {
  Pr();
  const e = () => {
    qr = requestAnimationFrame(e), !document.hidden && (an = Dr(an), _s.forEach((t) => t(an)));
  };
  e();
}
function Pr() {
  cancelAnimationFrame(qr);
}
const ro = 5, X$ = 56, J$ = { share: 0.6 }, Z$ = (e) => -Math.sqrt(2 * Zs * J$.share * e), Wt = (e, t) => e.find((n) => n.id === t) ?? null;
function C_(e, t = Dr().floors) {
  const n = Wt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : io(e.on) : null, o = s && Wt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function jr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Kt().floors) {
  const c = Wt(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || e4(c, d, o)) && t4(d, i, r) ? { x: d.x, y: d.y } : null;
}
const uo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, e4 = (e, t, n) => !uo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function E_(e, t = Kt().floors) {
  if (!uo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= ro && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function t4(e, t, n = Kt().floors) {
  const a = Wt(n, "home");
  return e.posture === "hang" && a && ut(e, t).bottom >= a.top ? !1 : ao(e, t);
}
function A_(e, t, n, a = Kt().floors) {
  const s = jr(e, n, a);
  if (!e.home) return n4(e, t, s, a);
  if (!s) return null;
  const o = Wt(a, "home"), l = s.y - t.y, i = l > ro ? "dropping" : -l > X$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function n4(e, t, n, a) {
  const s = n ? Wt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Z$(e.risen) };
  if (!n) return null;
  if (uo(t) && n.y - t.y > ro) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function O_(e, t, n) {
  const a = so * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function T_(e, t, n, a = Kt().floors) {
  const s = t && jr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const a4 = ["data-type"], s4 = { class: "figure-floor-name" }, o4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", s4, v(e.floor.type), 1)
    ], 12, a4));
  }
}, l4 = /* @__PURE__ */ U(o4, [["__scopeId", "data-v-4e0f1e2e"]]), i4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, r4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Xe(Kt().floors);
    let n = () => {
    };
    return Me(() => {
      n = Y$((a) => t.value = a.floors), Q$();
    }), Ie(() => {
      n(), Pr();
    }), (a, s) => (u(), f("div", i4, [
      (u(!0), f(D, null, ae(t.value, (o) => (u(), F(l4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, I_ = /* @__PURE__ */ U(r4, [["__scopeId", "data-v-e519168b"]]), sn = (e) => typeof e == "number" ? e : Date.parse(e);
function B_(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: sn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => sn(s.row.created_at) - sn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const $l = 20;
async function R_(e, t, n) {
  for (let a = 0; a < $l; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || sn(o.created_at) <= sn(s.created_at) || !await n()) return a;
  }
  return $l;
}
const u4 = 3, Xa = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function c4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Xa[n.grouping]) == null ? void 0 : a.call(Xa, e.row, n)) || "";
}
function d4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function L_(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= u4 ? [d4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = c4(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function f4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const N_ = (e) => (t) => t.filter((n) => n.id !== e), q_ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), D_ = (e) => (t) => [...t, e], P_ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function j_(e, t = {}) {
  const n = tt(), a = O(null), s = O("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function F_(e) {
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
function W_() {
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
    noun: { type: String, required: !0 },
    icon: { type: String, required: !0 },
    head: { type: Function, required: !0 },
    title: { type: Function, required: !0 },
    foot: { type: Function, required: !0 }
  },
  emits: ["new", "open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", m4, [
      m("div", p4, [
        m("span", g4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        T(ge, Pe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            T(re, {
              name: "plus",
              size: 12
            }),
            K(" New " + v(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", v4, [
        e.loaded ? e.failure ? (u(), f("p", y4, v(e.failure), 1)) : e.rows.length ? k("", !0) : (u(), f("p", b4, "No " + v(e.noun) + "s yet", 1)) : (u(), F(Ke, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), f(D, null, ae(e.rows, (o) => (u(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", w4, [
            T(re, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            K(" " + v(e.head(o)), 1),
            T(Ze, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", $4, v(e.title(o)), 1),
          m("span", x4, v(e.foot(o)), 1)
        ], 8, k4))), 128))
      ]),
      fe(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, H_ = /* @__PURE__ */ U(S4, [["__scopeId", "data-v-990e6b37"]]), xl = "newest";
function z_(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Se(Le, null)) == null ? void 0 : c.search, s = O(""), o = O(xl), l = O("all"), i = E(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((p) => f4(p, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === xl ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), r = E(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
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
    const n = e, a = (p = Se(Le, null)) == null ? void 0 : p.autoScroll, s = E(() => a === E4), o = O(null), l = O(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      var y;
      l.value = i(o.value) >= C4, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    me(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = r()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return Me(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = r());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), et(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (u(), f("div", M4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: V(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        fe(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", _4, [
        T(zt, {
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
              T(re, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = K(" Newest ", -1))
            ], 512), [
              [Bl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, U_ = /* @__PURE__ */ U(A4, [["__scopeId", "data-v-d704d7e3"]]), O4 = ["aria-selected", "data-tab", "onClick"], T4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, I4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Se(Le, null), o = E(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = O(null), i = O({ left: 0, width: 0, slides: !1 }), r = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const d = () => je(() => c(!0));
    let h = null;
    return Me(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Ie(() => h == null ? void 0 : h.disconnect()), me(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, d), me(() => n.answer, d, { deep: !0 }), (p, y) => (u(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), f(D, null, ae(o.value, (b) => {
        var A, S;
        return u(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: V(["inner-tab", { on: ((A = e.active) == null ? void 0 : A.key) === b.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === b.key,
          "data-tab": b.key,
          onClick: (x) => a("choose", b)
        }, [
          K(v(b.label) + " ", 1),
          r(b) ? (u(), f("span", T4, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, O4);
      }), 128)),
      m("i", {
        class: V(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, G_ = /* @__PURE__ */ U(I4, [["__scopeId", "data-v-63fcd326"]]), B4 = {
  class: "tab-body",
  "data-tab-body": ""
}, R4 = { "data-tab-content": "" }, L4 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = O(!1);
    let a = 0;
    return me(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Os(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), f("div", B4, [
      n.value ? (u(), F(Ke, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      Je(m("div", R4, [
        fe(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Bl, !n.value]
      ])
    ]));
  }
}, V_ = /* @__PURE__ */ U(L4, [["__scopeId", "data-v-63876533"]]), N4 = {
  class: "search-bar",
  "data-search-bar": ""
}, q4 = { class: "search-bar-control" }, D4 = ["value", "placeholder", "aria-label"], P4 = ["aria-expanded"], j4 = {
  key: 0,
  "data-menu-count": ""
}, F4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = eu(), l = ((x = Se(Le, null)) == null ? void 0 : x.search) ?? {}, i = E(() => l.placeholder || a.placeholder), r = l.context ?? [], c = O(null), d = O(null), h = O([]), p = E(() => h.value.length ? h.value[h.value.length - 1].next : r), y = E(() => !!o.menu || r.length > 0), b = (B) => {
      h.value = [], d.value = d.value ? null : B.currentTarget;
    };
    function A(B) {
      if (B.next.length) {
        h.value = [...h.value, B];
        return;
      }
      d.value = null, s("pick", B.click);
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
      return u(), f("div", N4, [
        m("div", q4, [
          T(re, {
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
            onKeydown: Mt(S, ["esc"])
          }, null, 40, D4),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            T(re, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          y.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: b
          }, [
            e.menuCount ? (u(), f("span", j4, v(e.menuCount), 1)) : k("", !0),
            T(re, {
              name: "caret",
              size: 12
            })
          ], 8, P4)) : k("", !0)
        ]),
        (N = L(l).button) != null && N.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = (w) => s("pick", L(l).button.click))
        }, v(L(l).button.title), 1)) : k("", !0),
        fe(B.$slots, "default", {}, void 0, !0),
        d.value ? (u(), F(ha, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: W[3] || (W[3] = $e(() => {
          }, ["stop"])),
          onClose: W[4] || (W[4] = (w) => d.value = null)
        }, {
          default: j(() => [
            h.value.length ? (u(), F(ze, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = (w) => h.value = h.value.slice(0, -1))
            }, {
              default: j(() => [
                K("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (u(!0), f(D, null, ae(p.value, (w) => (u(), F(ze, {
              key: w.title,
              description: w.subtext,
              "data-search-entry": w.title,
              onClick: (H) => A(w)
            }, {
              default: j(() => [
                K(v(w.title) + v(w.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? k("", !0) : fe(B.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, W4 = /* @__PURE__ */ U(F4, [["__scopeId", "data-v-45374bed"]]), H4 = {
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
    return (o, l) => (u(), F(W4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: j(() => [
        T(St, null, {
          default: j(() => [...l[2] || (l[2] = [
            K("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(D, null, ae(a, (i) => T(ze, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (r) => e.tools.order.value = i.key
        }, {
          default: j(() => [
            K(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(D, { key: 0 }, [
          T(St, null, {
            default: j(() => [...l[3] || (l[3] = [
              K("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(D, null, ae(s, (i) => T(ze, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (r) => e.tools.state.value = i.key
          }, {
            default: j(() => [
              K(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: j(() => [
        fe(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, K_ = /* @__PURE__ */ U(H4, [["__scopeId", "data-v-dab0064d"]]);
function Y_() {
  const e = O(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Q_ = (e) => import(
  /* @vite-ignore */
  e
), z4 = 86400, Cs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function U4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Cs(t) - Cs(e)) / z4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function X_(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Cs(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: U4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ja = 280, Za = 240, es = 120, G4 = 6, V4 = 14, gn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function K4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Fr(e, t) {
  const n = Math.max(0, K4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Y4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${V4}px)` }), e.offsetHeight, e.style.transition = `height ${Ja}ms ${gn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Fr(t, e));
    const p = s() - i;
    if (!r && p >= Ja && (r = !0, e.style.transition = `opacity ${Za}ms ease-out, transform ${Za}ms ${gn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Ja + Za) return a(h);
    d();
  };
  return a(h), d;
}
function J_(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${G4}px)` }), e.offsetHeight, e.style.transition = `opacity ${es}ms ease-out, transform ${es}ms ${gn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Fr(t, e)), s() - l < es) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const Q4 = 140, Fn = 220, Sl = 5;
function Z_({ gap: e = Q4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function r() {
    const d = n.splice(0, Sl);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(r, e));
      });
  }
  const c = (d, h, p, y = Y4) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: d, options: h, done: p, arrival: y, display: d.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(r, e));
    d.style.display = "none", n.push(b), n.length >= Sl && c.flush();
  };
  return c.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const h of [...a]) (d = h.cancel) == null || d.call(h);
    clearTimeout(o), s = !1;
    for (const h of n.splice(0))
      h.el.style.display = h.display, h.done();
  }, c;
}
function eC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${gn}, opacity ${Fn}ms ease-in, margin ${Fn}ms ${gn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Fn);
}
const Wr = "chat.pins.minimised", Vn = O(Xn(Wr, !1));
function Ml(e) {
  Vn.value = e, Fs(Wr, e);
}
function X4(e) {
  const t = E(() => e()), n = E(() => Vn.value ? [] : e()), a = () => Ml(!Vn.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => _t(o) > s).length,
    (o, l) => o > l && Ml(!1)
  ), { pins: t, visible: n, minimised: Vn, toggle: a };
}
const J4 = ["title"], Z4 = {
  key: 0,
  class: "pins-count"
}, ex = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = X4(() => t.pinRows);
    return (o, l) => L(n).length ? (u(), f("button", {
      key: 0,
      type: "button",
      class: V(["pins-toggle", { minimised: L(a), inline: e.inline }]),
      title: L(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...i) => L(s) && L(s)(...i), ["stop"]))
    }, [
      T(re, {
        name: L(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      L(a) ? (u(), f("span", Z4, v(L(n).length), 1)) : k("", !0)
    ], 10, J4)) : k("", !0);
  }
}, tC = /* @__PURE__ */ U(ex, [["__scopeId", "data-v-d073c504"]]), tx = ["title"], nx = ["title"], ax = { class: "diff-card-dir" }, sx = { class: "diff-card-name" }, ox = ["title"], lx = ["title"], ix = {
  key: 0,
  class: "diff-card-note"
}, rx = ["href"], ux = ["src", "alt"], cx = { class: "diff-card-rows" }, dx = { class: "diff-row-num" }, fx = { class: "diff-row-sign" }, hx = { class: "diff-row-code" }, mx = {
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
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = E(() => n.path.lastIndexOf("/") + 1), c = E(() => n.path.slice(0, r.value)), d = E(() => n.path.slice(r.value)), h = E(() => n.change === "deleted"), p = E(() => l[n.change]), y = E(() => new Set(n.rows.filter((I) => I.line_type === "add").map((I) => I.line))), b = O("after"), A = E(() => b.value === "before" ? n.whole.old : n.whole.text), S = E(() => n.whole && n.whole.text !== void 0 ? A.value.split(`
`).map((I, $) => ({ line_type: b.value === "after" && y.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: I })) : n.rows.filter(
      (I) => !(n.editsOnly && ["ctx", "fold"].includes(I.line_type)) && !(n.hideRemovals && I.line_type === "del")
    )), x = O(!1), B = E(() => n.lines && !x.value && !n.whole), W = E(() => B.value ? S.value.slice(0, n.lines) : S.value), N = E(() => S.value.length - W.value.length), w = (I) => I.line === null || I.line_type === "del" ? "" : I.line, H = (I) => I.line_type === "fold" ? I.hidden ? `⋯ ${I.hidden} lines` : "⋯" : I.text, P = O(null), q = O(null);
    let _ = null;
    return Me(() => {
      if (!q.value) return;
      let I = !0;
      _ = new ResizeObserver(() => {
        !P.value || !q.value || (P.value.style.transition = I ? "none" : "", P.value.style.height = `${q.value.offsetHeight}px`, I = !1);
      }), _.observe(q.value);
    }), Ie(() => _ && _.disconnect()), (I, $) => (u(), f("section", {
      class: V(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
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
          m("span", ax, v(c.value), 1),
          m("span", sx, v(d.value), 1),
          p.value ? (u(), f("span", {
            key: 0,
            class: V(["diff-card-badge", e.change])
          }, v(p.value), 3)) : k("", !0)
        ], 8, nx),
        m("span", {
          class: V(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: V(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        T(Ze, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: $[0] || ($[0] = $e((g) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, ox)) : k("", !0),
        h.value ? k("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: V(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: $[1] || ($[1] = $e((g) => a("whole"), ["stop"]))
        }, [
          T(re, {
            name: "file",
            size: 12
          })
        ], 10, lx))
      ], 8, tx),
      e.whole && e.whole.error ? (u(), f("p", ix, v(e.whole.error), 1)) : k("", !0),
      !h.value && !e.folded ? (u(), f(D, { key: 1 }, [
        e.picture ? (u(), f("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          m("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, ux)
        ], 8, rx)) : (u(), f("div", {
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
            m("div", cx, [
              (u(!0), f(D, null, ae(W.value, (g, M) => (u(), f("div", {
                key: M,
                class: V(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", dx, v(w(g)), 1),
                m("span", fx, v(i[g.line_type]), 1),
                m("span", hx, v(H(g)), 1)
              ], 2))), 128)),
              N.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: $[3] || ($[3] = $e((g) => x.value = !0, ["stop"]))
              }, v(N.value) + " more " + v(N.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, nC = /* @__PURE__ */ U(mx, [["__scopeId", "data-v-23581cbb"]]), px = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (u(), F(rt(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: j(() => [
        fe(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: V(["tip", e.place]),
          role: "tooltip"
        }, [
          fe(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, aC = /* @__PURE__ */ U(px, [["__scopeId", "data-v-683e1839"]]), gx = { "data-queue-controls": "" }, vx = { class: "counts" }, yx = { "data-queue-spots": "" }, bx = {
  class: "spots",
  "aria-label": "Places in use"
}, kx = { "data-queue-waiting": "" }, wx = { key: 0 }, $x = { class: "control" }, xx = { class: "stepper" }, Sx = ["disabled"], Mx = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, _x = ["disabled"], Cx = ["for"], Ex = ["id", "value", "disabled", "onChange"], Ax = { class: "control" }, Ox = ["aria-checked", "disabled"], Tx = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, Ix = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, Bx = {
  key: 2,
  class: "note failure",
  role: "alert"
}, Rx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1), o = O("");
    async function l(i, r) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(r)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, r) => (u(), f("div", gx, [
      T(Ft, { icon: "gauge" }, {
        default: j(() => [...r[3] || (r[3] = [
          K("Now", -1)
        ])]),
        _: 1
      }),
      m("div", vx, [
        m("div", null, [
          m("strong", yx, [
            K(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", bx, [
            (u(!0), f(D, null, ae(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: V({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", kx, v(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", wx, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", $x, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", xx, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, Sx),
          m("output", Mx, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, _x)
        ])
      ]),
      (u(!0), f(D, null, ae(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, Cx),
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
          onChange: (d) => l(c.key, d.target.value)
        }, null, 40, Ex)
      ]))), 128)),
      m("div", Ax, [
        r[7] || (r[7] = m("div", null, [
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
          onClick: r[2] || (r[2] = (c) => l(e.queue.main_spots_setting, e.queue.count_main_runs ? "off" : "on"))
        }, [...r[6] || (r[6] = [
          m("span", null, null, -1)
        ])], 8, Ox)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", Tx, [
        T(re, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = K("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", Ix, [
        T(re, {
          name: "pause",
          size: 13
        }),
        K("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (u(), f("p", Bx, v(o.value), 1)) : k("", !0)
    ]));
  }
}, Lx = /* @__PURE__ */ U(Rx, [["__scopeId", "data-v-b594afa3"]]), Nx = ["data-queue-row", "data-queue-process"], qx = ["aria-expanded"], Dx = { class: "run-line" }, Px = { class: "leading" }, jx = {
  key: 0,
  "data-queue-position": ""
}, Fx = ["title"], Wx = { class: "command" }, Hx = {
  class: "time",
  "data-queue-time": ""
}, zx = { class: "details" }, Ux = { "data-queue-type": "" }, Gx = { class: "failed" }, Vx = { class: "drop-inner" }, Kx = { class: "output" }, Yx = { class: "output-heading" }, Qx = ["href"], Xx = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(), o = Zi((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = Qs(), r = E(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = E(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function d() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await je(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await je(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return me(() => n.expanded, h, { immediate: !0 }), wn(["output.*"], d, (p) => Bi(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (u(), f("div", {
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
          y[3] || (y[3] = Mt($e((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Mt($e((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", Dx, [
          m("span", Px, [
            e.run.section === "waiting" ? (u(), f("span", jx, v(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: V(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, Fx))
          ]),
          m("code", Wx, v(e.run.line), 1),
          m("span", Hx, v(c.value), 1),
          T(re, {
            class: V(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", zx, [
          m("span", Ux, v(r.value), 1),
          e.run.owner_agent_id ? (u(), f(D, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = $e((b) => L(vt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), f(D, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (u(), f(D, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = $e((b) => L(vt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (u(), f(D, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", Gx, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, qx),
      m("div", {
        class: V(["drop", { open: e.expanded }])
      }, [
        m("div", Vx, [
          m("div", Kx, [
            m("div", Yx, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Qx)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && L(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              K(v(e.run.line), 1),
              L(l).length ? (u(), f(D, { key: 0 }, [
                K(v(`
` + L(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, Nx));
  }
}, Jx = /* @__PURE__ */ U(Xx, [["__scopeId", "data-v-18099d0b"]]), Zx = {
  class: "process-queue",
  "data-test-queue": ""
}, e8 = { class: "scroll" }, t8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, n8 = ["data-queue-empty"], ts = 20, a8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = O(null), a = O(""), s = O([]), o = O(ts), l = E(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const r = E(() => n.value ? [
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
    async function d() {
      const p = ++i, y = await t.read(o.value === ts ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === i && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += ts, d();
    }
    return wn(["process.*", "setting.*"], d), Me(d), (p, y) => (u(), f("article", Zx, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", e8, [
        a.value ? (u(), f("p", t8, v(a.value), 1)) : k("", !0),
        n.value ? (u(), f(D, { key: 1 }, [
          T(Lx, {
            queue: n.value,
            read: e.read,
            onSaved: d
          }, null, 8, ["queue", "read"]),
          T(As, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: j(() => [
              (u(!0), f(D, null, ae(r.value, (b) => (u(), f(D, {
                key: b.key
              }, [
                b.run ? (u(), F(Jx, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (A) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (u(), f("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, v(b.section.empty), 9, n8)) : (u(), F(Ft, {
                  key: 2,
                  icon: b.section.icon,
                  count: b.section.rows.length,
                  "data-queue-heading": b.section.type
                }, {
                  default: j(() => [
                    K(v(b.section.heading), 1)
                  ]),
                  _: 2
                }, 1032, ["icon", "count", "data-queue-heading"]))
              ], 64))), 128))
            ]),
            _: 1
          }),
          l.value ? (u(), f("button", {
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
}, sC = /* @__PURE__ */ U(a8, [["__scopeId", "data-v-d9b6ef6b"]]), s8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, o8 = ["aria-expanded"], l8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, i8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, r8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, u8 = {
  __name: "InspectorLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    kinds: { type: Array, default: () => [] },
    open: Boolean,
    outsidePlan: Boolean,
    pageSize: { type: Number, default: 10 }
  },
  emits: ["open"],
  setup(e) {
    const t = e, n = O(t.open), a = O(0), s = O(0), o = O("");
    let l = 0;
    async function i() {
      const r = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], d = await t.read(c);
      r === l && (o.value = d.ok ? "" : d.error, d.ok && (a.value = d.value.total), s.value += 1);
    }
    return me(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), wn(["link.*", "phase.*", "phase_task.*"], i), (r, c) => (u(), f(D, null, [
      a.value ? (u(), f("section", s8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", l8, v(a.value), 1),
          T(Vt, { open: n.value }, null, 8, ["open"])
        ], 8, o8),
        m("div", {
          class: V(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", i8, [
            T(Kc, {
              pinned: "",
              model: e.model,
              id: e.id,
              "document-id": e.documentId,
              read: e.read,
              changes: s.value,
              "outside-plan": e.outsidePlan,
              "page-size": e.pageSize,
              "only-kinds": e.kinds,
              "link-attribute": "data-inspector-link",
              onOpen: c[1] || (c[1] = (d) => r.$emit("open", d))
            }, null, 8, ["model", "id", "document-id", "read", "changes", "outside-plan", "page-size", "only-kinds"])
          ])) : k("", !0)
        ], 2)
      ])) : k("", !0),
      o.value ? (u(), f("p", r8, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, c8 = /* @__PURE__ */ U(u8, [["__scopeId", "data-v-479ab50f"]]), d8 = ["placeholder"], f8 = { class: "actions" }, h8 = { class: "error" }, m8 = {
  key: 1,
  class: "card closed"
}, p8 = { class: "mark" }, g8 = { class: "prompt" }, v8 = {
  key: 0,
  class: "draft"
}, y8 = {
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
    const a = e, s = n, o = on(e, "draft"), l = on(e, "error"), i = O(!!l.value), r = O(!1), c = O(!1), d = O(null);
    async function h() {
      var b, A;
      i.value = !0, r.value = !1, await je(), (A = ((b = d.value) == null ? void 0 : b.querySelector("input")) || d.value) == null || A.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const b = o.value.trim();
      if (!(!b || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(b), i.value = !1, r.value = !0;
        } catch (A) {
          o.value = b, l.value = A.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, A) => (u(), f("div", {
      class: V(["comment-bar", { open: i.value }])
    }, [
      i.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(y, ["prevent"]),
        onKeydown: Mt(p, ["esc"])
      }, [
        fe(b.$slots, "who", {}, void 0, !0),
        Je(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": A[0] || (A[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: A[1] || (A[1] = Mt((S) => L(qi)(S, y), ["enter"]))
        }, null, 40, d8), [
          [Yn, o.value]
        ]),
        m("div", f8, [
          m("span", h8, v(l.value), 1),
          T(ge, {
            small: "",
            onClick: p
          }, {
            default: j(() => [...A[3] || (A[3] = [
              K("Cancel", -1)
            ])]),
            _: 1
          }),
          T(ge, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: j(() => [...A[4] || (A[4] = [
              K("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", m8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", p8, [
            T(re, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", g8, v(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", v8, "Draft kept")) : k("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: A[2] || (A[2] = (S) => s("show"))
        }, [
          m("span", null, v(L(Qc)(e.count, "comment")), 1),
          T(re, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, b8 = /* @__PURE__ */ U(y8, [["__scopeId", "data-v-b68baddd"]]), k8 = { wide: 1130 }, w8 = /\{([A-Za-z_]\w*)\}/g;
function Kn(e, t, n = {}) {
  return e.replace(w8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const $8 = (e, t, n, a) => Kn(e.label, n, { row_id: a, id: a }) || Zw(t, n, a), x8 = { class: "comment-side-head" }, S8 = {
  key: 0,
  class: "comment-none"
}, M8 = { key: 0 }, _8 = {
  key: 1,
  class: "comment-none"
}, C8 = {
  class: "comment",
  "data-comment": ""
}, E8 = {
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
    return (t, n) => (u(), f("aside", {
      class: V(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", x8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        T(ma, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", S8, "No comments yet")) : k("", !0),
      (u(!0), f(D, null, ae(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", M8, v(a.quote), 1)) : k("", !0),
        a.revision ? (u(), f("span", _8, "Revision " + v(a.revision), 1)) : k("", !0),
        m("p", C8, v(e.words(a)), 1)
      ]))), 128)),
      T(vn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, _l = /* @__PURE__ */ U(E8, [["__scopeId", "data-v-276284a3"]]), A8 = { class: "resource-heading" }, O8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, T8 = {
  key: 1,
  class: "resource-abstract"
}, I8 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", A8, [
      e.title ? (u(), f("h2", O8, v(e.title), 1)) : k("", !0),
      e.abstract ? (u(), f("p", T8, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, B8 = /* @__PURE__ */ U(I8, [["__scopeId", "data-v-d65ef53f"]]), R8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, L8 = { class: "inspector-icons" }, N8 = { class: "inspector-icons-start" }, q8 = {
  class: "inspector-label",
  "data-resource-type": ""
}, D8 = { class: "inspector-icons-end" }, P8 = ["href"], j8 = {
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
    return (i, r) => (u(), f("header", R8, [
      m("div", L8, [
        m("span", N8, [
          e.backed ? (u(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: r[0] || (r[0] = (c) => a("back"))
          }, {
            default: j(() => [
              T(re, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (u(), f(D, { key: 1 }, [
            T(ge, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: r[1] || (r[1] = (c) => a("step", -1))
            }, {
              default: j(() => [
                T(re, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            T(ge, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: r[2] || (r[2] = (c) => a("step", 1))
            }, {
              default: j(() => [
                T(re, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        m("p", q8, v(e.label), 1),
        m("span", D8, [
          e.embedded ? (u(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: r[3] || (r[3] = (c) => L(qe)(s.value))
          }, {
            default: j(() => [
              T(re, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          o.value ? (u(), f("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this row",
            "aria-label": "Share this row",
            "data-resource-share": "",
            href: L(Rf)(s.value)
          }, [
            T(re, {
              name: "share",
              size: 13
            })
          ], 8, P8)) : k("", !0),
          e.embedded ? k("", !0) : (u(), F(ge, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: r[4] || (r[4] = (c) => a("close"))
          }, {
            default: j(() => [
              T(re, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      T(B8, {
        title: e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, F8 = /* @__PURE__ */ U(j8, [["__scopeId", "data-v-2928b6ca"]]), W8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, H8 = { class: "field-name" }, z8 = {
  key: 1,
  class: "field-value"
}, U8 = ["onClick"], G8 = {
  key: 2,
  class: "field-value"
}, V8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", W8, [
      (u(!0), f(D, null, ae(e.fields, (o) => (u(), f(D, {
        key: o.name
      }, [
        m("p", H8, v(o.label), 1),
        o.isTime ? (u(), F(Ze, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", z8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, U8)
        ])) : (u(), f("p", G8, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, K8 = /* @__PURE__ */ U(V8, [["__scopeId", "data-v-7e45afb5"]]);
async function Y8(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: e2(s.value.actor, s.value.creator_agent), owner: a.length ? t2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const Q8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, X8 = {
  key: 1,
  class: "inspector-wait"
}, J8 = { class: "inspector-main" }, Z8 = { class: "inspector-column" }, e3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, t3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, n3 = { class: "inspector-text" }, a3 = ["innerHTML"], s3 = {
  __name: "Inspector",
  props: {
    noun: { type: String, required: !0 },
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
    const n = e, a = t, s = /* @__PURE__ */ new Set(["question", "memory", "rule"]), o = E(() => n.catalogue.inspector(n.noun) ?? {
      reads: `${n.noun} show {row_id}`,
      label: "",
      title: "{title}",
      description: "",
      width: "small",
      components: [],
      comments: !1,
      events: [],
      links: { kinds: [], open: !1, outside_plan: !1, page_size: 10 },
      shareable: !1,
      lists_fields: !0,
      draws_text: !1
    }), l = O(null), i = O(""), r = O(""), c = O(""), d = O("details"), h = O(null), p = O(0);
    let y = 0;
    const b = E(() => ({ row_id: n.id, id: n.id })), A = E(() => l.value ? Kn(o.value.title, l.value, b.value) || Jw(n.noun, l.value, n.id) : ""), S = E(() => l.value ? $8(o.value, n.noun, l.value, n.id) : ""), x = E(() => S.value === A.value ? "" : S.value), B = E(() => l.value ? Kn(o.value.description, l.value, b.value) : ""), W = E(() => {
      var C, R, z;
      return ((C = l.value) == null ? void 0 : C.body) || ((R = l.value) == null ? void 0 : R.brief) || (s.has(n.noun) ? (z = l.value) == null ? void 0 : z.text : "") || "";
    }), N = E(() => W.value ? Hs(W.value, { env: "", rowNames: !1 }) : ""), w = E(() => n2(l.value, W.value, i.value, r.value)), H = E(() => o.value.comments && p.value >= k8.wide), P = E(() => o.value.comments && !H.value), q = (C) => o.value.components.filter((R) => (R.tab || "") === C).map((R) => R.window), _ = E(() => [...new Set(o.value.components.map((C) => C.tab).filter(Boolean))]), I = E(() => _.value.length || P.value ? [{ key: "details", label: "Details" }, ..._.value.map((C) => ({ key: C, label: C })), ...P.value ? [{ key: "comments", label: "Comments" }] : []] : []), $ = Wi(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (C) => n.read(C));
    async function g() {
      const C = ++y, R = await n.read(Kn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      if (C !== y || (c.value = R.ok ? "" : R.error, !R.ok)) return;
      l.value = R.value;
      const z = await Y8(n.read, l.value);
      C === y && (i.value = z.creator, r.value = z.owner);
    }
    me(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", g();
    }, { immediate: !0 }), wn(o.value.events, g), me($.open, (C) => C && P.value && (d.value = "comments"));
    let M = null;
    return Me(() => {
      var C;
      p.value = ((C = h.value) == null ? void 0 : C.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (M = new ResizeObserver(() => p.value = h.value.clientWidth), M.observe(h.value));
    }), Ie(() => M == null ? void 0 : M.disconnect()), (C, R) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      T(F8, {
        label: x.value,
        title: A.value,
        description: B.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.noun}s`, id: e.id },
        onClose: R[0] || (R[0] = (z) => a("close")),
        onBack: R[1] || (R[1] = (z) => a("back")),
        onStep: R[2] || (R[2] = (z) => a("step", z))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (u(), f("p", Q8, v(c.value), 1)) : l.value ? (u(), f(D, { key: 2 }, [
        T(Qi, null, {
          default: j(() => [
            T(js, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: g
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", J8, [
          m("div", Z8, [
            I.value.length ? (u(), f("div", e3, [
              T(jt, {
                options: I.value,
                value: d.value,
                onPick: R[3] || (R[3] = (z) => d.value = z)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", t3, [
              T(Ut, { value: d.value }, {
                details: j(() => [
                  m("div", n3, [
                    N.value && !o.value.draws_text ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, a3)) : k("", !0),
                    o.value.lists_fields ? (u(), F(K8, {
                      key: 1,
                      fields: w.value,
                      onPeek: R[4] || (R[4] = (z) => a("open", z))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  T(gs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  T(_l, {
                    below: "",
                    comments: L($).comments.value,
                    words: L($).words,
                    more: !!L($).nextPage.value,
                    loading: L($).loading.value,
                    failure: L($).failure.value,
                    onMore: L($).loadMore,
                    onClose: R[5] || (R[5] = (z) => d.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: j(() => [
                  T(gs, {
                    names: q(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), F(c8, {
                key: 0,
                model: e.noun,
                id: e.id,
                read: e.read,
                kinds: o.value.links.kinds,
                open: o.value.links.open,
                "outside-plan": o.value.links.outside_plan,
                "page-size": o.value.links.page_size,
                onOpen: R[6] || (R[6] = (z) => a("open", z))
              }, null, 8, ["model", "id", "read", "kinds", "open", "outside-plan", "page-size"])) : k("", !0)
            ]),
            o.value.comments ? (u(), F(b8, {
              key: 1,
              send: L($).send,
              count: L($).total.value,
              onShow: R[7] || (R[7] = (z) => P.value && (d.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          H.value ? (u(), F(_l, {
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
      ], 64)) : (u(), f("div", X8, [
        T(Ke)
      ]))
    ], 512));
  }
}, o3 = /* @__PURE__ */ U(s3, [["__scopeId", "data-v-7b5fbc93"]]), oC = {
  __name: "HostedInspector",
  props: {
    noun: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    environment: { type: String, required: !0 },
    stepped: Boolean,
    embedded: Boolean,
    readOnly: Boolean
  },
  emits: ["step", "open", "close", "back"],
  setup(e) {
    const t = Se(qs);
    return (n, a) => (u(), F(o3, Pe(n.$props, {
      catalogue: L(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, l3 = { class: "facts" }, i3 = { class: "fact wide" }, r3 = ["title"], u3 = {
  key: 1,
  class: "fact-value"
}, c3 = {
  key: 0,
  class: "fact"
}, d3 = { class: "fact-value" }, f3 = { class: "fact" }, h3 = { class: "fact-label" }, m3 = ["title"], p3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, g3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, v3 = {
  key: 2,
  class: "fact"
}, y3 = { class: "fact-value" }, b3 = { class: "fact wide" }, k3 = { class: "fact-label" }, w3 = { class: "fact wide" }, $3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, x3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = na.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var r, c;
      return u(), f("div", l3, [
        m("div", i3, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (d) => L(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, r3)) : (u(), f("span", u3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (u(), f("div", c3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", d3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (u(), f(D, { key: 1 }, [
          m("div", f3, [
            m("span", h3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (d) => L(qe)(`agents:${e.task.helper_id}`))
            }, v(e.task.helper_name), 9, m3)
          ]),
          L(o).has(e.task.state) ? (u(), f("p", p3, v(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", g3, v(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", v3, [
          i[6] || (i[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", y3, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", b3, [
          m("span", k3, [
            i[7] || (i[7] = K(" Complexity ", -1)),
            T(ai, {
              lines: L(Yi).map((d, h) => `${h + 1}: ${d}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          T(jt, {
            options: L(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (d) => s("complexity", d))
          }, null, 8, ["options", "value"])
        ]),
        m("div", w3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          T(jt, {
            options: L(n),
            value: String(L(Ki)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", $3, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, S3 = /* @__PURE__ */ U(x3, [["__scopeId", "data-v-a8bf3e2c"]]);
function M3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
  return { above: o.reverse(), below: l };
}
const _3 = { class: "number" }, C3 = { class: "title" }, E3 = { class: "word" }, A3 = {
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
    return (a, s) => (u(), F(rt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: V(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        T(kn, { status: e.status }, null, 8, ["status"]),
        m("span", _3, v(e.number), 1),
        m("span", C3, v(e.title), 1),
        m("span", E3, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ns = /* @__PURE__ */ U(A3, [["__scopeId", "data-v-f6417ae8"]]), O3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, T3 = { class: "level" }, I3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = O(!1);
    me(() => n.task.id, () => s.value = !1);
    const o = E(() => M3(n.task.id, n.graph)), l = E(() => s.value ? o.value.above : o.value.above.slice(-1)), i = E(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = E(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, p = !1) => ({ status: cn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), f("section", O3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(D, null, ae(l.value, (y) => (u(), f(D, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", T3, [
          (u(!0), f(D, null, ae(y, (b) => (u(), F(ns, Pe({
            key: b.id,
            ref_for: !0
          }, d(b), {
            onSelect: p[0] || (p[0] = (A) => a("select", A))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      T(ns, tu(nu(d(e.task, !0))), null, 16),
      (u(!0), f(D, null, ae(i.value, (y) => (u(), f(D, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        T(ns, Pe({ ref_for: !0 }, d(y), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      r.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${r.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, B3 = /* @__PURE__ */ U(I3, [["__scopeId", "data-v-79c52417"]]), R3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, L3 = ["datetime"], N3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", R3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(D, null, ae(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, L3),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, q3 = /* @__PURE__ */ U(N3, [["__scopeId", "data-v-b41f213b"]]), D3 = {
  class: "part",
  "data-resource-waits": ""
}, P3 = ["onClick"], j3 = { class: "wait-id" }, F3 = { class: "wait-title" }, W3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", D3, [
      m("h4", null, v(e.title), 1),
      (u(!0), f(D, null, ae(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        T(kn, {
          status: L(cn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", j3, v(o.id), 1),
        m("span", F3, v(o.title), 1)
      ], 8, P3))), 128))
    ]));
  }
}, Cl = /* @__PURE__ */ U(W3, [["__scopeId", "data-v-8fb2e251"]]), H3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, z3 = { class: "text" }, U3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, G3 = 180, V3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = O(!1), l = E(() => a.task.waits.filter((r) => !n.has(r.state))), i = E(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(D, null, [
      l.value.length ? (u(), F(Cl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", H3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", z3, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (u(), f("section", U3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: V(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > G3 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (u(), F(Cl, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, K3 = /* @__PURE__ */ U(V3, [["__scopeId", "data-v-4a3f1e79"]]), Y3 = {
  class: "task-details",
  "data-task-details": ""
}, Q3 = { class: "since" }, X3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, J3 = { class: "text" }, Z3 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, eS = {
  key: 1,
  class: "note"
}, tS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, nS = { class: "text" }, aS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", Y3, [
        m("div", {
          class: V(["state-line", L(cn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            T(kn, {
              status: L(cn)(e.task.state)
            }, null, 8, ["status"]),
            K(" " + v(a(e.task.state)), 1)
          ]),
          m("span", Q3, [
            o[5] || (o[5] = K(" since ", -1)),
            T(Ze, {
              at: L(dh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", X3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", J3, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", Z3, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", eS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", tS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", nS, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (u(), F(B3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        T(S3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        T(K3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        T(q3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, lC = /* @__PURE__ */ U(aS, [["__scopeId", "data-v-7e73fa21"]]), sS = 50, oS = { messages: 25 }, lS = (e) => oS[e] || sS, iS = {
  class: "task-log",
  "aria-label": "Task log"
}, rS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, uS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, cS = { class: "entries" }, dS = ["data-task-log-important"], fS = ["datetime"], hS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, mS = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = O([]), a = O(1), s = O(!0), o = O(!0), l = O("");
    let i = 0;
    async function r(c = 1) {
      const d = ++i;
      a.value = c, o.value = !0, l.value = "";
      const h = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(lS("task_logs")),
        "--page",
        String(c)
      ]);
      d === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return me(
      () => [t.id, t.changes],
      () => {
        n.value = [], r();
      },
      { immediate: !0 }
    ), et(() => {
      i += 1;
    }), (c, d) => (u(), f("section", iS, [
      o.value ? (u(), F(Ke, { key: 0 })) : l.value ? (u(), f(D, { key: 1 }, [
        m("p", rS, v(l.value), 1),
        T(ge, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => r(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(D, { key: 2 }, [
        n.value.length ? k("", !0) : (u(), f("p", uS, "No log entries yet.")),
        m("ol", cS, [
          (u(!0), f(D, null, ae(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: V(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, fS),
            m("p", null, v(h.line), 1)
          ], 10, dS))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", hS, [
          T(ge, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => r(a.value - 1))
          }, {
            default: j(() => [...d[4] || (d[4] = [
              K("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          T(ge, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => r(a.value + 1))
          }, {
            default: j(() => [...d[5] || (d[5] = [
              K("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, iC = /* @__PURE__ */ U(mS, [["__scopeId", "data-v-cfa43bf1"]]);
function pS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var as = { exports: {} }, El;
function gS() {
  return El || (El = 1, (function(e, t) {
    var n = (function() {
      var a = function(w, H) {
        var P = 236, q = 17, _ = w, I = o[H], $ = null, g = 0, M = null, C = [], R = {}, z = function(Y, Q) {
          g = _ * 4 + 17, $ = (function(G) {
            for (var X = new Array(G), J = 0; J < G; J += 1) {
              X[J] = new Array(G);
              for (var se = 0; se < G; se += 1)
                X[J][se] = null;
            }
            return X;
          })(g), te(0, 0), te(g - 7, 0), te(0, g - 7), pe(), le(), oe(Y, Q), _ >= 7 && xe(Y), M == null && (M = De(_, I, C)), Z(M, Q);
        }, te = function(Y, Q) {
          for (var G = -1; G <= 7; G += 1)
            if (!(Y + G <= -1 || g <= Y + G))
              for (var X = -1; X <= 7; X += 1)
                Q + X <= -1 || g <= Q + X || (0 <= G && G <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= X && X <= 4 ? $[Y + G][Q + X] = !0 : $[Y + G][Q + X] = !1);
        }, ee = function() {
          for (var Y = 0, Q = 0, G = 0; G < 8; G += 1) {
            z(!0, G);
            var X = i.getLostPoint(R);
            (G == 0 || Y > X) && (Y = X, Q = G);
          }
          return Q;
        }, le = function() {
          for (var Y = 8; Y < g - 8; Y += 1)
            $[Y][6] == null && ($[Y][6] = Y % 2 == 0);
          for (var Q = 8; Q < g - 8; Q += 1)
            $[6][Q] == null && ($[6][Q] = Q % 2 == 0);
        }, pe = function() {
          for (var Y = i.getPatternPosition(_), Q = 0; Q < Y.length; Q += 1)
            for (var G = 0; G < Y.length; G += 1) {
              var X = Y[Q], J = Y[G];
              if ($[X][J] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    se == -2 || se == 2 || ce == -2 || ce == 2 || se == 0 && ce == 0 ? $[X + se][J + ce] = !0 : $[X + se][J + ce] = !1;
            }
        }, xe = function(Y) {
          for (var Q = i.getBCHTypeNumber(_), G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[Math.floor(G / 3)][G % 3 + g - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !Y && (Q >> G & 1) == 1;
            $[G % 3 + g - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, oe = function(Y, Q) {
          for (var G = I << 3 | Q, X = i.getBCHTypeInfo(G), J = 0; J < 15; J += 1) {
            var se = !Y && (X >> J & 1) == 1;
            J < 6 ? $[J][8] = se : J < 8 ? $[J + 1][8] = se : $[g - 15 + J][8] = se;
          }
          for (var J = 0; J < 15; J += 1) {
            var se = !Y && (X >> J & 1) == 1;
            J < 8 ? $[8][g - J - 1] = se : J < 9 ? $[8][15 - J - 1 + 1] = se : $[8][15 - J - 1] = se;
          }
          $[g - 8][8] = !Y;
        }, Z = function(Y, Q) {
          for (var G = -1, X = g - 1, J = 7, se = 0, ce = i.getMaskFunction(Q), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if ($[X][ue - we] == null) {
                  var Ee = !1;
                  se < Y.length && (Ee = (Y[se] >>> J & 1) == 1);
                  var he = ce(X, ue - we);
                  he && (Ee = !Ee), $[X][ue - we] = Ee, J -= 1, J == -1 && (se += 1, J = 7);
                }
              if (X += G, X < 0 || g <= X) {
                X -= G, G = -G;
                break;
              }
            }
        }, ne = function(Y, Q) {
          for (var G = 0, X = 0, J = 0, se = new Array(Q.length), ce = new Array(Q.length), ue = 0; ue < Q.length; ue += 1) {
            var we = Q[ue].dataCount, Ee = Q[ue].totalCount - we;
            X = Math.max(X, we), J = Math.max(J, Ee), se[ue] = new Array(we);
            for (var he = 0; he < se[ue].length; he += 1)
              se[ue][he] = 255 & Y.getBuffer()[he + G];
            G += we;
            var Fe = i.getErrorCorrectPolynomial(Ee), We = c(se[ue], Fe.getLength() - 1), co = We.mod(Fe);
            ce[ue] = new Array(Fe.getLength() - 1);
            for (var he = 0; he < ce[ue].length; he += 1) {
              var fo = he + co.getLength() - ce[ue].length;
              ce[ue][he] = fo >= 0 ? co.getAt(fo) : 0;
            }
          }
          for (var ho = 0, he = 0; he < Q.length; he += 1)
            ho += Q[he].totalCount;
          for (var $a = new Array(ho), Cn = 0, he = 0; he < X; he += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              he < se[ue].length && ($a[Cn] = se[ue][he], Cn += 1);
          for (var he = 0; he < J; he += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              he < ce[ue].length && ($a[Cn] = ce[ue][he], Cn += 1);
          return $a;
        }, De = function(Y, Q, G) {
          for (var X = d.getRSBlocks(Y, Q), J = h(), se = 0; se < G.length; se += 1) {
            var ce = G[se];
            J.put(ce.getMode(), 4), J.put(ce.getLength(), i.getLengthInBits(ce.getMode(), Y)), ce.write(J);
          }
          for (var ue = 0, se = 0; se < X.length; se += 1)
            ue += X[se].dataCount;
          if (J.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + J.getLengthInBits() + ">" + ue * 8 + ")";
          for (J.getLengthInBits() + 4 <= ue * 8 && J.put(0, 4); J.getLengthInBits() % 8 != 0; )
            J.putBit(!1);
          for (; !(J.getLengthInBits() >= ue * 8 || (J.put(P, 8), J.getLengthInBits() >= ue * 8)); )
            J.put(q, 8);
          return ne(J, X);
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
              for (var Q = d.getRSBlocks(Y, I), G = h(), X = 0; X < C.length; X++) {
                var J = C[X];
                G.put(J.getMode(), 4), G.put(J.getLength(), i.getLengthInBits(J.getMode(), Y)), J.write(G);
              }
              for (var se = 0, X = 0; X < Q.length; X++)
                se += Q[X].dataCount;
              if (G.getLengthInBits() <= se * 8)
                break;
            }
            _ = Y;
          }
          z(!1, ee());
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
          var se = R.getModuleCount() * Y + Q * 2, ce, ue, we, Ee, he = "", Fe;
          for (Fe = "l" + Y + ",0 0," + Y + " -" + Y + ",0 0,-" + Y + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += J.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', he += ' viewBox="0 0 ' + se + " " + se + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += X.text || G.text ? ' role="img" aria-labelledby="' + Ot([X.id, G.id].join(" ").trim()) + '"' : "", he += ">", he += X.text ? '<title id="' + Ot(X.id) + '">' + Ot(X.text) + "</title>" : "", he += G.text ? '<description id="' + Ot(G.id) + '">' + Ot(G.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', we = 0; we < R.getModuleCount(); we += 1)
            for (Ee = we * Y + Q, ce = 0; ce < R.getModuleCount(); ce += 1)
              R.isDark(we, ce) && (ue = ce * Y + Q, he += "M" + ue + "," + Ee + Fe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, R.createDataURL = function(Y, Q) {
          Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q;
          var G = R.getModuleCount() * Y + Q * 2, X = Q, J = G - Q;
          return N(G, G, function(se, ce) {
            if (X <= se && se < J && X <= ce && ce < J) {
              var ue = Math.floor((se - X) / Y), we = Math.floor((ce - X) / Y);
              return R.isDark(we, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(Y, Q, G) {
          Y = Y || 2, Q = typeof Q > "u" ? Y * 4 : Q;
          var X = R.getModuleCount() * Y + Q * 2, J = "";
          return J += "<img", J += ' src="', J += R.createDataURL(Y, Q), J += '"', J += ' width="', J += X, J += '"', J += ' height="', J += X, J += '"', G && (J += ' alt="', J += Ot(G), J += '"'), J += "/>", J;
        };
        var Ot = function(Y) {
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
        }, Hr = function(Y) {
          var Q = 1;
          Y = typeof Y > "u" ? Q * 2 : Y;
          var G = R.getModuleCount() * Q + Y * 2, X = Y, J = G - Y, se, ce, ue, we, Ee, he = {
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
          for (se = 0; se < G; se += 2) {
            for (ue = Math.floor((se - X) / Q), we = Math.floor((se + 1 - X) / Q), ce = 0; ce < G; ce += 1)
              Ee = "█", X <= ce && ce < J && X <= se && se < J && R.isDark(ue, Math.floor((ce - X) / Q)) && (Ee = " "), X <= ce && ce < J && X <= se + 1 && se + 1 < J && R.isDark(we, Math.floor((ce - X) / Q)) ? Ee += " " : Ee += "█", We += Y < 1 && se + 1 >= J ? Fe[Ee] : he[Ee];
            We += `
`;
          }
          return G % 2 && Y > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return R.createASCII = function(Y, Q) {
          if (Y = Y || 1, Y < 2)
            return Hr(Q);
          Y -= 1, Q = typeof Q > "u" ? Y * 2 : Q;
          var G = R.getModuleCount() * Y + Q * 2, X = Q, J = G - Q, se, ce, ue, we, Ee = Array(Y + 1).join("██"), he = Array(Y + 1).join("  "), Fe = "", We = "";
          for (se = 0; se < G; se += 1) {
            for (ue = Math.floor((se - X) / Y), We = "", ce = 0; ce < G; ce += 1)
              we = 1, X <= ce && ce < J && X <= se && se < J && R.isDark(ue, Math.floor((ce - X) / Y)) && (we = 0), We += we ? Ee : he;
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
          for (var _ = B(w), I = function() {
            var le = _.read();
            if (le == -1) throw "eof";
            return le;
          }, $ = 0, g = {}; ; ) {
            var M = _.read();
            if (M == -1) break;
            var C = I(), R = I(), z = I(), te = String.fromCharCode(M << 8 | C), ee = R << 8 | z;
            g[te] = ee, $ += 1;
          }
          if ($ != H)
            throw $ + " != " + H;
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
        ], H = 1335, P = 7973, q = 21522, _ = {}, I = function($) {
          for (var g = 0; $ != 0; )
            g += 1, $ >>>= 1;
          return g;
        };
        return _.getBCHTypeInfo = function($) {
          for (var g = $ << 10; I(g) - I(H) >= 0; )
            g ^= H << I(g) - I(H);
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
            g = g.multiply(c([1, r.gexp(M)], 0));
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
              for (var z = 0, te = $.isDark(C, R), ee = -1; ee <= 1; ee += 1)
                if (!(C + ee < 0 || g <= C + ee))
                  for (var le = -1; le <= 1; le += 1)
                    R + le < 0 || g <= R + le || ee == 0 && le == 0 || te == $.isDark(C + ee, R + le) && (z += 1);
              z > 5 && (M += 3 + z - 5);
            }
          for (var C = 0; C < g - 1; C += 1)
            for (var R = 0; R < g - 1; R += 1) {
              var pe = 0;
              $.isDark(C, R) && (pe += 1), $.isDark(C + 1, R) && (pe += 1), $.isDark(C, R + 1) && (pe += 1), $.isDark(C + 1, R + 1) && (pe += 1), (pe == 0 || pe == 4) && (M += 3);
            }
          for (var C = 0; C < g; C += 1)
            for (var R = 0; R < g - 6; R += 1)
              $.isDark(C, R) && !$.isDark(C, R + 1) && $.isDark(C, R + 2) && $.isDark(C, R + 3) && $.isDark(C, R + 4) && !$.isDark(C, R + 5) && $.isDark(C, R + 6) && (M += 40);
          for (var R = 0; R < g; R += 1)
            for (var C = 0; C < g - 6; C += 1)
              $.isDark(C, R) && !$.isDark(C + 1, R) && $.isDark(C + 2, R) && $.isDark(C + 3, R) && $.isDark(C + 4, R) && !$.isDark(C + 5, R) && $.isDark(C + 6, R) && (M += 40);
          for (var xe = 0, R = 0; R < g; R += 1)
            for (var C = 0; C < g; C += 1)
              $.isDark(C, R) && (xe += 1);
          var oe = Math.abs(100 * xe / g / g - 50) / 5;
          return M += oe * 10, M;
        }, _;
      })(), r = (function() {
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
          for (var I = new Array(w.length - _ + H), $ = 0; $ < w.length - _; $ += 1)
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
              I[$ + g] ^= r.gexp(r.glog(q.getAt($)) + r.glog(_.getAt(g)));
          return c(I, 0);
        }, q.mod = function(_) {
          if (q.getLength() - _.getLength() < 0)
            return q;
          for (var I = r.glog(q.getAt(0)) - r.glog(_.getAt(0)), $ = new Array(q.getLength()), g = 0; g < q.getLength(); g += 1)
            $[g] = q.getAt(g);
          for (var g = 0; g < _.getLength(); g += 1)
            $[g] ^= r.gexp(r.glog(_.getAt(g)) + I);
          return c($, 0).mod(_);
        }, q;
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
        ], H = function(_, I) {
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
            for (var R = $[C * 3 + 0], z = $[C * 3 + 1], te = $[C * 3 + 2], ee = 0; ee < R; ee += 1)
              M.push(H(z, te));
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
          for (var I = 0; I < _; I += 1)
            P.putBit((q >>> _ - I - 1 & 1) == 1);
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
            g = g * 10 + I($.charAt(M));
          return g;
        }, I = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          throw "illegal char :" + $;
        };
        return q;
      }, y = function(w) {
        var H = s.MODE_ALPHA_NUM, P = w, q = {};
        q.getMode = function() {
          return H;
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
        var H = s.MODE_8BIT_BYTE, P = a.stringToBytes(w), q = {};
        return q.getMode = function() {
          return H;
        }, q.getLength = function(_) {
          return P.length;
        }, q.write = function(_) {
          for (var I = 0; I < P.length; I += 1)
            _.put(P[I], 8);
        }, q;
      }, A = function(w) {
        var H = s.MODE_KANJI, P = a.stringToBytesFuncs.SJIS;
        if (!P)
          throw "sjis not supported.";
        (function(I, $) {
          var g = P(I);
          if (g.length != 2 || (g[0] << 8 | g[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var q = P(w), _ = {};
        return _.getMode = function() {
          return H;
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
        var w = [], H = {};
        return H.writeByte = function(P) {
          w.push(P & 255);
        }, H.writeShort = function(P) {
          H.writeByte(P), H.writeByte(P >>> 8);
        }, H.writeBytes = function(P, q, _) {
          q = q || 0, _ = _ || P.length;
          for (var I = 0; I < _; I += 1)
            H.writeByte(P[I + q]);
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
        var w = 0, H = 0, P = 0, q = "", _ = {}, I = function(g) {
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
            I(w >>> H - 6), H -= 6;
        }, _.flush = function() {
          if (H > 0 && (I(w << 6 - H), w = 0, H = 0), P % 3 != 0)
            for (var g = 3 - P % 3, M = 0; M < g; M += 1)
              q += "=";
        }, _.toString = function() {
          return q;
        }, _;
      }, B = function(w) {
        var H = w, P = 0, q = 0, _ = 0, I = {};
        I.read = function() {
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
        return I;
      }, W = function(w, H) {
        var P = w, q = H, _ = new Array(w * H), I = {};
        I.setPixel = function(C, R, z) {
          _[R * P + C] = z;
        }, I.write = function(C) {
          C.writeString("GIF87a"), C.writeShort(P), C.writeShort(q), C.writeByte(128), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(255), C.writeByte(255), C.writeByte(255), C.writeString(","), C.writeShort(0), C.writeShort(0), C.writeShort(P), C.writeShort(q), C.writeByte(0);
          var R = 2, z = g(R);
          C.writeByte(R);
          for (var te = 0; z.length - te > 255; )
            C.writeByte(255), C.writeBytes(z, te, 255), te += 255;
          C.writeByte(z.length - te), C.writeBytes(z, te, z.length - te), C.writeByte(0), C.writeString(";");
        };
        var $ = function(C) {
          var R = C, z = 0, te = 0, ee = {};
          return ee.write = function(le, pe) {
            if (le >>> pe)
              throw "length over";
            for (; z + pe >= 8; )
              R.writeByte(255 & (le << z | te)), pe -= 8 - z, le >>>= 8 - z, te = 0, z = 0;
            te = le << z | te, z = z + pe;
          }, ee.flush = function() {
            z > 0 && R.writeByte(te);
          }, ee;
        }, g = function(C) {
          for (var R = 1 << C, z = (1 << C) + 1, te = C + 1, ee = M(), le = 0; le < R; le += 1)
            ee.add(String.fromCharCode(le));
          ee.add(String.fromCharCode(R)), ee.add(String.fromCharCode(z));
          var pe = S(), xe = $(pe);
          xe.write(R, te);
          var oe = 0, Z = String.fromCharCode(_[oe]);
          for (oe += 1; oe < _.length; ) {
            var ne = String.fromCharCode(_[oe]);
            oe += 1, ee.contains(Z + ne) ? Z = Z + ne : (xe.write(ee.indexOf(Z), te), ee.size() < 4095 && (ee.size() == 1 << te && (te += 1), ee.add(Z + ne)), Z = ne);
          }
          return xe.write(ee.indexOf(Z), te), xe.write(z, te), xe.flush(), pe.toByteArray();
        }, M = function() {
          var C = {}, R = 0, z = {};
          return z.add = function(te) {
            if (z.contains(te))
              throw "dup key:" + te;
            C[te] = R, R += 1;
          }, z.size = function() {
            return R;
          }, z.indexOf = function(te) {
            return C[te];
          }, z.contains = function(te) {
            return typeof C[te] < "u";
          }, z;
        };
        return I;
      }, N = function(w, H, P) {
        for (var q = W(w, H), _ = 0; _ < H; _ += 1)
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
            var r = o.charCodeAt(i);
            r < 128 ? l.push(r) : r < 2048 ? l.push(
              192 | r >> 6,
              128 | r & 63
            ) : r < 55296 || r >= 57344 ? l.push(
              224 | r >> 12,
              128 | r >> 6 & 63,
              128 | r & 63
            ) : (i++, r = 65536 + ((r & 1023) << 10 | o.charCodeAt(i) & 1023), l.push(
              240 | r >> 18,
              128 | r >> 12 & 63,
              128 | r >> 6 & 63,
              128 | r & 63
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
  })(as)), as.exports;
}
var vS = gS();
const yS = /* @__PURE__ */ pS(vS), bS = ["width", "height", "viewBox"], kS = ["width", "height"], wS = ["d"], $S = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = E(() => {
      const a = yS(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let i = 0; i < s; i += 1)
          a.isDark(l, i) && o.push(`M${i + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (u(), f("svg", {
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
      }, null, 8, kS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, wS)
    ], 8, bS));
  }
}, rC = /* @__PURE__ */ U($S, [["__scopeId", "data-v-489f0852"]]), xS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: ve({ padding: e.padding })
    }, [
      fe(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, uC = /* @__PURE__ */ U(xS, [["__scopeId", "data-v-47e67f04"]]);
function cC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const dC = au(() => import("./VoiceFigure-Bgh0aVyC.js").then((e) => e.V)), fC = "1.2.0", hC = "3.5";
export {
  Of as $,
  Ae as A,
  Te as B,
  ya as C,
  ut as D,
  m_ as E,
  _$ as F,
  sM as G,
  c_ as H,
  l$ as I,
  B$ as J,
  At as K,
  CS as L,
  so as M,
  P$ as N,
  I$ as O,
  va as P,
  OM as Q,
  q6 as R,
  Gn as S,
  LM as T,
  A6 as U,
  Oe as V,
  sa as W,
  E6 as X,
  C6 as Y,
  Af as Z,
  U as _,
  b6 as a,
  JM as a$,
  q$ as a0,
  D6 as a1,
  P6 as a2,
  Le as a3,
  Q6 as a4,
  Y6 as a5,
  _t as a6,
  j6 as a7,
  rM as a8,
  r6 as a9,
  zM as aA,
  CM as aB,
  Y5 as aC,
  fM as aD,
  hM as aE,
  p_ as aF,
  Mr as aG,
  RM as aH,
  xn as aI,
  m6 as aJ,
  d6 as aK,
  s_ as aL,
  Sn as aM,
  r_ as aN,
  aM as aO,
  EM as aP,
  AM as aQ,
  _M as aR,
  hn as aS,
  xt as aT,
  u6 as aU,
  P2 as aV,
  SM as aW,
  L6 as aX,
  xr as aY,
  Wt as aZ,
  Kt as a_,
  ZM as aa,
  l_ as ab,
  v6 as ac,
  O6 as ad,
  T6 as ae,
  V6 as af,
  K6 as ag,
  X6 as ah,
  x6 as ai,
  yl as aj,
  F6 as ak,
  iM as al,
  b_ as am,
  kM as an,
  yM as ao,
  vM as ap,
  J6 as aq,
  U6 as ar,
  z6 as as,
  G6 as at,
  BM as au,
  lM as av,
  uM as aw,
  $_ as ax,
  tn as ay,
  cM as az,
  Q$ as b,
  w_ as b$,
  $$ as b0,
  i_ as b1,
  DM as b2,
  qM as b3,
  u5 as b4,
  cr as b5,
  YM as b6,
  oM as b7,
  wa as b8,
  ht as b9,
  jM as bA,
  GM as bB,
  gt as bC,
  NM as bD,
  VM as bE,
  dM as bF,
  wM as bG,
  mM as bH,
  Re as bI,
  nM as bJ,
  KM as bK,
  O_ as bL,
  T_ as bM,
  l6 as bN,
  W2 as bO,
  eM as bP,
  FM as bQ,
  k6 as bR,
  y_ as bS,
  PM as bT,
  WM as bU,
  HM as bV,
  Z6 as bW,
  Q5 as bX,
  tM as bY,
  gM as bZ,
  v_ as b_,
  UM as ba,
  za as bb,
  Si as bc,
  S_ as bd,
  C_ as be,
  IM as bf,
  a_ as bg,
  i6 as bh,
  bM as bi,
  M_ as bj,
  W6 as bk,
  H6 as bl,
  M6 as bm,
  N6 as bn,
  h6 as bo,
  t_ as bp,
  w6 as bq,
  $6 as br,
  _6 as bs,
  xM as bt,
  R2 as bu,
  u_ as bv,
  T$ as bw,
  S6 as bx,
  p6 as by,
  $M as bz,
  r5 as c,
  PS as c$,
  f6 as c0,
  c6 as c1,
  pM as c2,
  E_ as c3,
  uo as c4,
  A_ as c5,
  jr as c6,
  n_ as c7,
  B6 as c8,
  I6 as c9,
  MS as cA,
  Vt as cB,
  qd as cC,
  oC as cD,
  aC as cE,
  re as cF,
  ai as cG,
  G_ as cH,
  NS as cI,
  fC as cJ,
  hC as cK,
  YS as cL,
  K_ as cM,
  ys as cN,
  t6 as cO,
  Bw as cP,
  ze as cQ,
  St as cR,
  ha as cS,
  zS as cT,
  QS as cU,
  bc as cV,
  hw as cW,
  na as cX,
  tC as cY,
  qS as cZ,
  DS as c_,
  D2 as ca,
  g6 as cb,
  A$ as cc,
  MM as cd,
  to as ce,
  z5 as cf,
  TM as cg,
  nn as ch,
  Dt as ci,
  FS as cj,
  HS as ck,
  U_ as cl,
  ge as cm,
  ff as cn,
  js as co,
  ma as cp,
  Lv as cq,
  pa as cr,
  nC as cs,
  o6 as ct,
  WS as cu,
  Dv as cv,
  Li as cw,
  ln as cx,
  Xs as cy,
  I_ as cz,
  Ve as d,
  q_ as d$,
  GS as d0,
  sC as d1,
  rC as d2,
  Di as d3,
  Kc as d4,
  H_ as d5,
  n0 as d6,
  IS as d7,
  a6 as d8,
  W4 as d9,
  jo as dA,
  Gs as dB,
  dd as dC,
  Z_ as dD,
  J_ as dE,
  Ls as dF,
  cd as dG,
  Bs as dH,
  $m as dI,
  eC as dJ,
  s6 as dK,
  Bi as dL,
  Ap as dM,
  jS as dN,
  Yk as dO,
  n6 as dP,
  e6 as dQ,
  L_ as dR,
  nm as dS,
  B_ as dT,
  OS as dU,
  Q_ as dV,
  _w as dW,
  f4 as dX,
  Ki as dY,
  RS as dZ,
  KS as d_,
  jt as da,
  XS as db,
  Ke as dc,
  yt as dd,
  Gg as de,
  nd as df,
  Em as dg,
  ZS as dh,
  BS as di,
  Ut as dj,
  V_ as dk,
  B3 as dl,
  lC as dm,
  iC as dn,
  kn as dp,
  Pd as dq,
  st as dr,
  JS as ds,
  Ze as dt,
  dC as du,
  uC as dv,
  Ks as dw,
  D_ as dx,
  Os as dy,
  Sp as dz,
  R6 as e,
  P_ as e0,
  qe as e1,
  _p as e2,
  US as e3,
  wc as e4,
  R_ as e5,
  Ji as e6,
  N_ as e7,
  Ll as e8,
  VS as e9,
  TS as ea,
  AS as eb,
  rn as ec,
  Xl as ed,
  fd as ee,
  LS as ef,
  pt as eg,
  cC as eh,
  h4 as ei,
  _S as ej,
  ES as ek,
  z_ as el,
  Ii as em,
  Y_ as en,
  Zi as eo,
  Vl as ep,
  X4 as eq,
  Ts as er,
  j_ as es,
  ss as et,
  F_ as eu,
  W_ as ev,
  tt as ew,
  X_ as ex,
  Qn as ey,
  B2 as f,
  x_ as g,
  mn as h,
  d_ as i,
  __ as j,
  f_ as k,
  e_ as l,
  t4 as m,
  oo as n,
  o_ as o,
  y6 as p,
  h_ as q,
  Dr as r,
  Pr as s,
  Ce as t,
  d5 as u,
  QM as v,
  k_ as w,
  XM as x,
  _n as y,
  g_ as z
};
