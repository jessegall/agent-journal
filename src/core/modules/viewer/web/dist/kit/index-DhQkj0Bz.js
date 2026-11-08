/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as ve, unref as L, renderSlot as fe, createElementVNode as m, normalizeClass as V, Fragment as P, renderList as ae, defineComponent as Gr, Comment as Vr, h as ua, cloneVNode as Kr, createBlock as F, withCtx as j, createVNode as T, toDisplayString as v, createCommentVNode as w, ref as A, inject as Se, watch as me, onMounted as Me, onBeforeUnmount as et, reactive as Ht, shallowRef as Xe, onUnmounted as Ie, useAttrs as ca, computed as C, resolveDynamicComponent as rt, mergeProps as Pe, useId as As, resolveDirective as Yr, withDirectives as Je, createTextVNode as K, Teleport as da, nextTick as je, Transition as zt, withModifiers as $e, createApp as Qr, shallowReactive as Xr, withKeys as Mt, onScopeDispose as fa, useModel as on, mergeModels as Pt, toRef as xa, vModelText as Yn, resolveComponent as Jr, provide as Bl, onErrorCaptured as Zr, TransitionGroup as Os, isRef as po, getCurrentInstance as eu, getCurrentScope as Rl, createSlots as tu, vShow as Ll, useSlots as nu, normalizeProps as au, guardReactiveProps as su, defineAsyncComponent as ou } from "vue";
function Nl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, lu = 1600, iu = {
  __name: "Shimmer",
  setup(e) {
    const t = Nl(lu);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: ve(L(t))
    }, null, 4));
  }
}, Zt = /* @__PURE__ */ U(iu, [["__scopeId", "data-v-6c018b03"]]), ru = { class: "skeleton-line" }, uu = 2e3, cu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Nl(uu);
    return (n, a) => (u(), f("span", ru, [
      fe(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: V(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(P, null, ae(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: V(["bar", { still: e.still }]),
          style: ve({ ...L(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, yt = /* @__PURE__ */ U(cu, [["__scopeId", "data-v-484fe8a0"]]), Ut = Gr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Vr);
      return a.length !== 1 ? ua(P, { key: n }, a) : a[0].key == null ? Kr(a[0], { key: n }) : a[0];
    };
  }
}), du = ["aria-label"], fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], gu = ["aria-label"], vu = ["aria-label"], yu = {
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
          (u(), f(P, null, ae(t, (d) => T(Zt, {
            key: d.id,
            class: V(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, du)
      ]),
      older: j(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(t.slice(0, 3), (d) => (u(), F(Zt, {
            key: d.id,
            class: V(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, fu)
      ]),
      cards: j(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(P, null, ae(n, (h) => T(yt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, hu)
      ]),
      file: j(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            T(yt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(P, null, ae(s, (h) => T(yt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, mu)
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
          (u(!0), f(P, null, ae(e.count, (d) => (u(), F(yt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, pu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), F(yt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, gu)
      ]),
      default: j(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(P, null, ae(e.count, (d) => (u(), F(yt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, vu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ke = /* @__PURE__ */ U(yu, [["__scopeId", "data-v-ef519c5f"]]), bu = {
  key: 1,
  class: "empty-state titled"
}, ku = { class: "empty-state-title" }, wu = { class: "empty-state-text" }, $u = {
  key: 2,
  class: "empty-state"
}, xu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", bu, [
      m("p", ku, v(e.title), 1),
      m("p", wu, [
        fe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", $u, [
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ln = /* @__PURE__ */ U(xu, [["__scopeId", "data-v-b27e89b0"]]), Su = { class: "fold-group" }, Mu = ["aria-expanded"], _u = { class: "fold-label" }, Cu = {
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
    return (a, s) => (u(), f("div", Su, [
      m("button", {
        type: "button",
        class: V(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", _u, v(e.label), 1),
        e.count !== "" ? (u(), f("span", Cu, v(e.count), 1)) : w("", !0),
        m("span", {
          class: V(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Mu),
      e.open ? fe(a.$slots, "default", {}, void 0, !0, 0) : w("", !0)
    ]));
  }
}, CS = /* @__PURE__ */ U(Eu, [["__scopeId", "data-v-9ef1865c"]]), Au = 150, Ou = () => Au;
function Ts(e, t, n = Ou(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function ql(e, t, n) {
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
const Tu = 50, go = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function ES(e) {
  const t = tt().sources.find((n) => n.key === e);
  return t ? ss(t.read, t.events) : ss("", []);
}
function Dl(e, t, n, a, s = () => !1) {
  const o = A([]), l = A(null), i = A(""), r = A(!1), c = performance.now(), d = A(!1), h = A(""), p = A(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function E(g) {
    return s() ? (y.add(g), b ?? (b = new Promise((_) => setTimeout(() => _(S()), Tu)))) : x(g);
  }
  async function S() {
    const g = new Set(y);
    y.clear(), b = null;
    const _ = N, I = await t({ ids: [...g].join(","), limit: g.size });
    if (_ !== N) return;
    if (!I.ok) return q();
    const R = new Map(I.value.rows.map((H) => [H.id, H]));
    o.value = o.value.flatMap((H) => g.has(H.id) ? R.has(H.id) ? [R.get(H.id)] : [] : [H]);
  }
  async function x(g) {
    const _ = N, I = await t({ "before-id": g + 1, limit: 1 });
    if (_ !== N) return;
    if (!I.ok) return q();
    const R = I.value.rows.find((H) => H.id === g);
    o.value = R ? o.value.map((H) => H.id === g ? R : H) : o.value.filter((H) => H.id !== g);
  }
  async function B(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((te) => te.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((te) => te.id === g.row_id)) return E(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return q();
    const I = Math.max(...o.value.map((te) => te.id)), R = N, H = await t({ "after-id": I });
    if (R !== N) return;
    if (!H.ok) return q();
    const Q = new Set(o.value.map((te) => te.id));
    o.value = [...H.value.rows.filter((te) => !Q.has(te.id)), ...o.value];
  }
  async function W() {
    if (!d.value || !o.value.length) return !1;
    const g = N, _ = Math.min(...o.value.map((H) => H.id)), I = await t({ "before-id": _ });
    if (g !== N) return !1;
    if (!I.ok || !I.value.rows.length) return d.value = !1;
    d.value = go(I.value, n());
    const R = new Set(o.value.map((H) => H.id));
    return o.value = [...o.value, ...I.value.rows.filter((H) => !R.has(H.id))], !0;
  }
  let N = 0;
  function k(g, _) {
    var H, Q;
    const I = g.ok ? e.shared ? [g.value] : ((H = g.value) == null ? void 0 : H.rows) ?? [] : [];
    g.ok && (o.value = _(I)), l.value = g.ok ? g.value : null;
    const R = I.length ? Math.min(...I.map((te) => te.id)) : 0;
    g.ok && ((Q = g.value) != null && Q.rows) && !o.value.some((te) => te.id < R) && (d.value = !e.shared && go(g.value, n())), i.value = g.ok ? "" : g.error, Ts(c, () => r.value = !0);
  }
  async function z(g) {
    const _ = ++N, I = await t({});
    _ === N && k(I, g);
  }
  const D = (g) => {
    if (!a() || !g.length) return g;
    const _ = Math.min(...g.map((R) => R.id)), I = Math.max(...g.map((R) => R.id));
    return [...o.value.filter((R) => R.id > I), ...g, ...o.value.filter((R) => R.id < _)];
  }, q = () => z(D), M = (g) => k(g, D), O = () => z((g) => g);
  async function $(g, _ = null) {
    const I = await ql(_ && { target: o, fields: { value: _(o.value) } }, g, e.run);
    return h.value = I.ok ? "" : I.error, p.value = I.ok ? I.value : null, await q(), I;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: q, loadLatest: O, older: W, act: $, actionFailure: h, answer: p, context: e, heard: B, showFirst: M, pageSize: n };
}
const Iu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ss(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = tt(), l = Dl(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Iu(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Bu = 2e3;
function Is(e, t, n = Bu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Se(Le, null), r = () => {
    var E;
    return ((E = i == null ? void 0 : i.visible) == null ? void 0 : E.value) === !1;
  }, c = () => document.hidden || r(), d = async (E) => {
    o = !0;
    try {
      await E();
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
    var E;
    return (E = i == null ? void 0 : i.visible) == null ? void 0 : E.value;
  }, b), Me(async () => {
    document.addEventListener("visibilitychange", b), r() || await y();
  }), et(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const Pl = typeof document < "u" && document.documentElement.classList.contains("phone"), jl = 120;
var Tl;
const Sa = globalThis[Tl = Symbol.for("journal.pressed")] ?? (globalThis[Tl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Ru(e = 0) {
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
function Fl(e = window) {
  if (!os(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    os(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ls = "journal.stale-build-reload", Lu = 'script[type="module"][src*="/assets/index-"]', vo = (e) => {
  var t;
  return ((t = e.querySelector(Lu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Nu(e = document, t = (a, s) => Ce.quietRead(a, s), n = () => Fl(window)) {
  const a = vo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = vo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ma = "";
function qu(e, t = () => Fl(window)) {
  if (!e) return !1;
  const n = !!Ma && Ma !== e;
  return Ma = e, n && t(), n;
}
const Du = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Pu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ls) === e.message) return !1;
    t.setItem(ls, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function ju(e = window.sessionStorage) {
  try {
    e.removeItem(ls);
  } catch {
    return;
  }
}
const Fu = 2e3, Wu = 3e4, Ge = Ht({ starting: !1, external: !1, late: !1, offline: !1 }), Bs = () => Ge.starting, Hu = 3;
let En = 0, is = 0, Wl = 0, Hl = [];
async function zu() {
  try {
    const e = await Ce.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let yo = null;
const Uu = () => yo ?? (yo = zu().finally(() => yo = null));
function Gu() {
  clearTimeout(is), clearTimeout(Wl), is = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), Hl.splice(0).forEach((e) => e()), Nu();
}
async function Vu() {
  Ge.offline = !navigator.onLine;
  const e = await Uu();
  if (Ge.external = e.updating, En = !e.restarting && !e.updating && e.reachable ? En + 1 : 0, En < Hu) return;
  En = 0, (!qu(e.started_at) || os()) && Gu();
}
function zl() {
  is = setTimeout(async () => {
    await Vu(), Ge.starting && zl();
  }, Fu);
}
function Ku() {
  Ge.starting || (Ge.starting = !0, Ge.offline = !navigator.onLine, zl(), Wl = setTimeout(() => Ge.late = !0, Wu));
}
const Ul = () => Ge.starting ? new Promise((e) => Hl.push(e)) : Promise.resolve();
function Rs(e, t, n = 0) {
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
function Yu(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Qu {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Rs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Yu(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const ct = "viewer.shell", An = 2e4, Xu = 4, bo = "/api/read-lines", Ju = 5e3, Zu = 403, ko = "/api/repeated-lines", ec = 10, tc = 2e3, nc = 3e5, AS = 6e5, On = 6, ac = 500, sc = "/journal/summary", wo = "/api/server-state", oc = 2e4, Tn = Pl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, lc = (e) => e.split("?")[0].endsWith(sc), rs = (e, t) => Object.assign(new Error(t), { status: e });
async function ic(e, t, n = rs) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const rc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), uc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), $o = (e) => e.split(" ").slice(0, 2).join(" "), at = "read", Bt = "write", cc = "stream";
class dc {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = $o(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < tc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < ec || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(ko, { method: "POST", headers: { ...Tn, "Content-Type": "application/json" }, body: i }, [{ window: ct, line: ko, kind: Bt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Ru(n ? jl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: uc(n.signal, s) } : n;
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
      throw o instanceof TypeError && Ku(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Xu ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(bo, { headers: Tn }, [{ window: ct, line: bo, kind: at }], Ju).then(async (t) => {
      if (t.status === Zu) return /* @__PURE__ */ new Set();
      if (!t.ok) throw rs(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Qu(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = $o(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const i = a instanceof FormData, r = { method: t, headers: { ...Tn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: rc(a) }, c = s || (i ? nc : An);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: ct, line: n, kind: at }], c)) : await this.sent(n, r, [{ window: ct, line: n, kind: Bt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, ac)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = On, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return ic(i, `${i.status} ${i.statusText}`).catch((r) => {
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
    return t !== "GET" ? this.send(t, n, a, s, On, o).then((i) => (this.written(n), i)) : Bs() && !lc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ct, line: t, kind: cc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(wo, { cache: "no-store" }, [{ window: ct, line: wo, kind: at }], oc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ct, line: s = t, limit: o = An } = {}) {
    const l = (n.method ?? "GET") === "GET" ? at : Bt;
    return l === Bt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const _a = Symbol.for("journal.transport"), Ce = globalThis[_a] ?? (globalThis[_a] = new dc());
class Gl {
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
      n.patterns.some((a) => Ls(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Ls(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const fc = 50, hc = "refresh", mc = 1e3, pc = 3e4, gc = "requested", vc = "after_window", yc = 50, In = ".*", bc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function kc(e) {
  const t = {}, n = Ht({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function p(M) {
    const O = () => r[M] ?? r[`${M.slice(0, M.lastIndexOf("."))}.*`] ?? {}, $ = A(void 0), g = Dl(e, async (_) => {
      const I = await E(M, _);
      return I.ok && !Object.keys(_).length && ($.value = I.value), I;
    }, () => O().page_size || yc, () => !!O().page_size, () => !!O().reads_ids);
    return t[M] = { ...g, data: $, readAt: 0 };
  }
  const y = new Proxy({}, { get: (M, O) => typeof O != "string" || O.startsWith("__v") ? void 0 : t[O] ?? p(O) }), b = (M) => (r[M].loading !== gc || M.endsWith(In)) && (!r[M].tab || r[M].tab === n.tab);
  function E(M, O = {}) {
    return new Promise(($) => {
      a.push({ name: M, flags: O, resolve: $ }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const M = /* @__PURE__ */ new Map(), O = a.splice(0).filter((_) => {
      const I = JSON.stringify(_.flags);
      return M.has(_.name) || M.set(_.name, I), M.get(_.name) === I ? !0 : (a.push(_), !1);
    });
    a.length && setTimeout(S);
    const $ = Object.fromEntries(O.flatMap(({ name: _, flags: I }) => Object.entries(I).map(([R, H]) => [`${_}.${R}`, H]))), g = await e.readKeys({ only: [...new Set(O.map(({ name: _ }) => _))], state: { ...n, ...$ } });
    O.forEach(({ name: _, resolve: I }) => I(g.ok ? g.value.keys[_] : g));
  }
  async function x(M) {
    var _;
    const O = ++d;
    (M.length ? M : Object.keys(r).filter((I) => !I.endsWith(In) && r[I].loading === "first" && b(I))).forEach((I) => l[I] = O);
    const g = await e.readKeys({ only: M, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const I = (M.length ? M : Object.keys(t)).filter((H) => (l[H] ?? 0) <= O);
      I.forEach((H) => {
        y[H].readAt = Date.now(), g.failure === "unreachable" ? i.add(H) : i.delete(H), y[H].showFirst(g);
      });
      const R = g.failure === "unreachable" && ((_ = e.waitForServer) == null ? void 0 : _.call(e));
      return R && R.then(() => {
        if (h) return;
        const H = I.filter((Q) => l[Q] === O);
        (H.length || !M.length && !I.length && d === O) && x(H);
      }), !1;
    }
    return D(g.value.declared), Object.entries(g.value.keys).forEach(([I, R]) => {
      (l[I] ?? 0) > O || (l[I] = O, y[I].readAt = Date.now(), i.delete(I), R.ok && (y[I].data.value = R.value), y[I].showFirst(R));
    }), !0;
  }
  function B(M) {
    const O = bc(M);
    return O.length ? (O.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, $(x(g));
    })))) : x([]);
  }
  function W(M) {
    M.forEach((O) => s.add(O)), clearTimeout(c), c = setTimeout(() => {
      const O = [...s];
      s.clear(), O.length && B(O);
    }, fc);
  }
  const N = (M) => M.endsWith(In) ? Object.keys(t).filter((O) => O.startsWith(M.slice(0, -1)) && t[O].readAt) : [M], k = (M) => (r[M] ?? r[`${M.split(".")[0]}.*`]).reload_seconds;
  function z(M) {
    const O = Object.keys(r).filter((g) => M.event === hc || r[g].events.some((_) => Ls(_, M.event)));
    O.filter((g) => r[g].page_size).forEach((g) => y[g].heard(M));
    const $ = O.filter((g) => !r[g].page_size);
    $.filter((g) => !b(g)).forEach((g) => y[g].readAt = 0), W($.filter(b).flatMap(N));
  }
  function D(M) {
    if (Object.keys(r).length) return;
    r = M;
    const O = [...new Set(Object.values(M).flatMap((g) => g.events))];
    O.length && e.follow(O, z);
    const $ = Object.keys(M).filter((g) => M[g].loading === vc);
    $.length && x($);
  }
  me(() => n.tab, () => {
    const M = Object.keys(r).filter((O) => !O.endsWith(In) && b(O) && !y[O].readAt);
    M.length && x(M);
  }), Ie(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const M = Date.now(), O = Object.keys(r).filter(($) => r[$].reload_seconds > 0 && b($)).flatMap(N).filter(($) => M - y[$].readAt >= (i.has($) ? Math.min(k($) * 1e3, pc) : k($) * 1e3));
    O.length && W(O);
  }
  return Is(q, () => e.visible.value, mc), queueMicrotask(() => x([])), { props: y, state: n, reload: B, readKey: E };
}
const wc = Symbol("open-view"), Le = Symbol.for("journal.window-context"), Vl = Symbol("dock-card");
function $c(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = kc(e));
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
  return $c(e);
}
const xc = (e, t) => e(Vl, t), OS = () => Se(Vl), us = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', xo = {
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
}, Sc = ["data-icon", "stroke-width", "innerHTML"], re = {
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
    }, null, 12, Sc));
  }
}, Mc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, _c = /* @__PURE__ */ U(Mc, [["__scopeId", "data-v-eb453d6f"]]), Cc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ca(), a = C(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = A(!1), o = C(() => t.busy || s.value), l = Se(Le, null), i = C(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function r(c) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, jl);
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
          }, null, 8, ["name"])) : w("", !0),
          fe(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), F(_c, {
          key: 0,
          class: "btn-spinner"
        })) : w("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ge = /* @__PURE__ */ U(Cc, [["__scopeId", "data-v-ededdadf"]]), Ec = ["aria-checked", "aria-haspopup", "onClick"], Ac = {
  key: 0,
  class: "segmented-dot"
}, Oc = {
  key: 1,
  class: "segmented-note"
}, Tc = {
  key: 2,
  class: "segmented-count"
}, Ic = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = As();
    return (s, o) => {
      const l = Yr("tip");
      return u(), f("span", {
        class: V(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(P, null, ae(e.options, (i) => Je((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: V(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", Ac)) : w("", !0),
          K(" " + v(i.label) + " ", 1),
          i.note ? (u(), f("small", Oc, v(i.note), 1)) : w("", !0),
          i.count !== void 0 ? (u(), f("em", Tc, v(i.count), 1)) : w("", !0)
        ], 10, Ec)), [
          [l, i.tip || i.title, `${L(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, jt = /* @__PURE__ */ U(Ic, [["__scopeId", "data-v-c89bc92d"]]), Bc = {
  key: 0,
  class: "more-items"
}, Rc = {
  key: 0,
  role: "alert"
}, Lc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", Bc, [
      e.failure ? (u(), f("p", Rc, v(e.failure), 1)) : w("", !0),
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
      }, 8, ["disabled"])) : w("", !0)
    ])) : w("", !0);
  }
}, vn = /* @__PURE__ */ U(Lc, [["__scopeId", "data-v-10464014"]]), Nc = { class: "link-group" }, qc = {
  class: "group-label",
  "data-link-kind": ""
}, Dc = ["disabled", "onClick"], Pc = { class: "title" }, jc = { class: "relations" }, Fc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = C(() => s.value ? n.rows : n.rows.slice(0, 3)), l = C(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Nc, [
      m("div", qc, v(l.value), 1),
      (u(!0), f(P, null, ae(o.value, (p) => (u(), f("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Pc, v(p.endpoint.title), 1),
        m("span", jc, [
          K(v(c(p)), 1),
          i(p) ? (u(), f(P, { key: 0 }, [
            K(" · Unavailable")
          ], 64)) : w("", !0)
        ])
      ], 16, Dc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : w("", !0)
    ]));
  }
}, Wc = /* @__PURE__ */ U(Fc, [["__scopeId", "data-v-be6f079c"]]), Hc = ["data-loaded"], zc = { class: "rows" }, Uc = ["disabled", "onClick"], Gc = { class: "title" }, Vc = { class: "relations" }, Kc = { key: 2 }, Yc = {
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
    const n = e, a = t, s = A([]), o = A({}), l = A(0), i = A(""), r = A(null), c = A(!1), d = A("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (M) => M.toUpperCase())}s`, b = C(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, M) => q + M, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, M]) => ({ key: q, label: y(q), count: M }))
    ]), E = C(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((O) => O.endpoint.model))].map((O) => [O, s.value.filter(($) => $.endpoint.model === O).length])), M = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([O], [$]) => (M[O] ?? 3) - (M[$] ?? 3)).map(([O, $]) => ({ model: O, count: $, rows: s.value.filter((g) => g.endpoint.model === O) }));
    }), S = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, x = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), B = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (M) => M.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((M) => M.replaceAll("_", " ")).join(", ")}`;
    async function W(q = 1) {
      const M = ++h;
      c.value = !0, d.value = "";
      const O = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && O.push("--outside-plan"), n.documentId && O.push("--first-counterpart", `doc:${n.documentId}`), i.value && O.push("--kind", i.value);
      try {
        const $ = await n.read(O);
        if (M !== h) return;
        if (!$.ok) {
          d.value = $.error;
          return;
        }
        const g = $.value.counterparts ?? [], _ = q === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(_.map((I) => [`${I.endpoint.model}:${I.endpoint.id}`, I])).values()], o.value = $.value.kinds ?? {}, l.value = $.value.total, r.value = $.value.next_page ?? null;
      } catch ($) {
        M === h && (d.value = $.message);
      } finally {
        M === h && (c.value = !1);
      }
    }
    function N(q) {
      if (S(q)) return;
      const [M, O] = q.endpoint.open_ref.split(":");
      a("open", { table: M, id: Number(O) });
    }
    function k(q) {
      i.value = q, W();
    }
    const z = () => !c.value && r.value && W(r.value), D = C(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], r.value = null, i.value = "", W();
    }, { immediate: !0 }), (q, M) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
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
        onPick: k
      }, null, 8, ["options", "value"])) : w("", !0),
      m("div", zc, [
        e.grouped ? (u(!0), f(P, { key: 0 }, ae(E.value, (O) => (u(), F(Wc, {
          key: O.model,
          model: O.model,
          count: O.count,
          rows: O.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: N
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(P, { key: 1 }, ae(s.value, (O) => (u(), f("button", Pe({
          key: `${O.endpoint.model}:${O.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, x(O), {
          disabled: S(O),
          onClick: ($) => N(O)
        }), [
          m("span", Gc, v(O.endpoint.title), 1),
          m("span", Vc, [
            K(v(B(O)), 1),
            S(O) ? (u(), f(P, { key: 0 }, [
              K(" · Unavailable")
            ], 64)) : w("", !0)
          ])
        ], 16, Uc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Kc, v(e.empty), 1)) : w("", !0),
        T(vn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: D.value,
          onMore: z
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Hc)) : w("", !0);
  }
}, Qc = /* @__PURE__ */ U(Yc, [["__scopeId", "data-v-29b9c31b"]]), Xc = (e, t, n) => Math.max(t, Math.min(n, e)), Jc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Kl = /* @__PURE__ */ new WeakMap(), Zc = (e, t) => Kl.set(e, t);
function ed(e, t) {
  for (let n = t; n; n = Kl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Yl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !ed(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const Tt = 8, td = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    })), i = A({ w: 0, h: 0 }), r = A(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), h = (g) => {
      const _ = g.closest(".pane, .float-window");
      return _ ? d(_.getBoundingClientRect()) : c();
    }, p = (g, _) => `${Math.max(0, g ? Math.min(g, _) : _)}px`;
    function y(g, _) {
      return {
        below: g.bottom - _.bottom - a.gap - Tt,
        above: _.top - g.top - a.gap - Tt,
        across: g.right - g.left - 2 * Tt
      };
    }
    function b(g) {
      const _ = h(a.anchor), I = y(_, g);
      return i.value.w <= I.across && i.value.h <= Math.max(I.below, I.above) ? _ : c();
    }
    const E = C(() => {
      if (!r.value) return l.value;
      const g = r.value, _ = b(g), I = y(_, g), { w: R, h: H } = i.value, Q = a.align === "auto" ? g.left + g.right > _.left + _.right : a.align === "right", te = Xc(Q ? g.right - R : g.left, _.left + Tt, Math.max(_.left + Tt, _.right - R - Tt)), pe = H > I.below && I.above > I.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, I.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, I.below) };
      return { ...l.value, ...pe, left: `${te}px`, maxWidth: p(a.maxWidth, I.across) };
    }), S = n, x = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function B(g) {
      const _ = x(), I = _.indexOf(document.activeElement);
      _[(I + g + _.length) % _.length].focus();
    }
    const W = { ArrowDown: () => B(1), ArrowUp: () => B(-1), Escape: () => S("close") }, N = (g) => W[g.key] && (g.preventDefault(), W[g.key]()), k = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let z = 0;
    const D = new ResizeObserver(() => {
      cancelAnimationFrame(z), z = requestAnimationFrame(k);
    });
    Yl(s, (g) => a.anchor && !a.anchor.contains(g.target) && S("close"));
    const q = (g, _) => ["top", "left", "right", "bottom"].some((I) => Math.abs(g[I] - _[I]) > 1), M = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let O = 0;
    function $() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || M(g)) return S("close");
        q(g, r.value) && (r.value = g);
      }
      O = requestAnimationFrame($);
    }
    return Me(() => {
      a.anchor && s.value && Zc(s.value, a.anchor), k(), s.value && D.observe(s.value), !a.plain && x()[0] && x()[0].focus(), $();
    }), Ie(() => {
      D.disconnect(), cancelAnimationFrame(O), cancelAnimationFrame(z);
    }), t({ element: s }), (g, _) => (u(), F(da, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", Pe({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: E.value,
        onKeydown: N
      }), [
        fe(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ha = /* @__PURE__ */ U(td, [["__scopeId", "data-v-3d203970"]]), nd = { class: "split-button" }, ad = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = A(null), s = A(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", nd, [
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
      }, 8, ["anchor"])) : w("", !0)
    ]));
  }
}, sd = /* @__PURE__ */ U(ad, [["__scopeId", "data-v-c258494d"]]), od = 0, ld = "/api/lines", id = "/api/line", So = 5e3, Mo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), _o = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ca = (e) => JSON.stringify(e.line), Co = () => new DOMException("cancelled", "AbortError");
class rd {
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
    this.timer ?? (this.timer = setTimeout(() => Ce.whenFree(() => this.send()), od));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Co())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Co()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ce.sent(ld, Mo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => _o(i.body, at)), So);
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
    await this.alone(t, at), Date.now() - n < So ? this.slow.delete(Ca(t.body)) : this.slow.add(Ca(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ce.sent(id, Mo(t.body, t.signal), [_o(t.body, n)], n === at ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Ql = new rd(), ud = "/api/window";
function cd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${ud}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => Ce.whenFree(async () => {
    const d = await Ce.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: at }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Ce.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const Xl = /* @__PURE__ */ new Map();
class dd {
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
function TS(e, t) {
  const n = new dd(e, t);
  return Xl.set(e, n), n.load().catch(() => {
  }), n;
}
const Ns = (e) => Xl.get(e);
function fd(e, t, n) {
  const a = Ns(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function hd(e, t) {
  if (!e) return !0;
  const n = Ns(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Qn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Jl = {};
async function IS(e = (t) => Ce.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Jl = (await t.json()).states);
}
const qs = (e, t) => {
  var n;
  return (n = Jl[e]) == null ? void 0 : n[t];
}, rn = (e, t) => {
  var n;
  return ((n = qs(e, t)) == null ? void 0 : n.label) ?? Qn(t);
}, Zl = (e, t) => {
  var n;
  return ((n = qs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, md = (e, t) => {
  var n;
  return ((n = qs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, pd = Symbol("pane-page"), Ds = Symbol("inspector-host"), ei = { 1: "refused", 2: "usage", 3: "fault" }, gd = 100, vd = 50, yd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, bd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function kd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = A({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: E = {}, search: S = {}, readOnly: x = !1, shared: B = null }) {
  const W = /* @__PURE__ */ new Map(), N = (Q, te) => l.follow(e, Q, (le) => {
    W.clear(), te(le);
  }, a), k = new AbortController(), z = A(!1), D = performance.now();
  let q = 0, M = 0, O = () => {
  };
  const $ = new Promise((Q) => O = Q);
  k.signal.addEventListener("abort", O, { once: !0 });
  const g = () => {
    clearTimeout(M), M = setTimeout(() => {
      q === 0 && Ts(D, () => {
        z.value = !0, O();
      });
    }, vd);
  }, _ = (Q, te) => (q += 1, Lt(e, Q, t, k.signal, te).finally(() => {
    q -= 1, g();
  })), I = (Q, te) => (g(), $.then(() => k.signal.aborted ? it : Lt(e, Q, t, k.signal, te))), R = ({ only: Q = [], state: te = {} } = {}) => (q += 1, $d(() => cd(e, t, Q, te, k.signal), k.signal).finally(() => {
    q -= 1, g();
  })), H = (Q, { unbatched: te = !1, deferred: le = !1 } = {}) => {
    const pe = W.get(Q);
    if (pe && performance.now() - pe.at < gd) return pe.answer;
    const xe = le && !z.value ? I(Q, te) : _(Q, te);
    return W.set(Q, { answer: xe, at: performance.now() }), xe;
  };
  return {
    answered: z,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: C(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: E,
    search: S,
    readOnly: x,
    shared: B,
    read: H,
    readKeys: R,
    waitForServer: () => Bs() ? Ul() : null,
    run: (Q) => Lt(e, Q, t, k.signal),
    upload: (Q) => Sd(Q, e, k.signal),
    cancel: () => k.abort(),
    signal: k.signal,
    subscriptions: l,
    follow: (Q, te) => N([Q].flat().filter((le) => o.some((pe) => Ls(pe, le))), te),
    // for a dock of the chat, whose row's noun the window cannot declare ahead
    followUndeclared: N,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (Q) => C(() => {
      var te;
      return r.value[Q] ?? ((te = c.find((le) => le.key === Q)) == null ? void 0 : te.default);
    }),
    setting: async (Q, te) => {
      const le = await H(`window setting ${e} ${Q}`);
      return le.ok ? le.value.value : te;
    },
    setOption: h,
    keep: (Q, te) => Lt(e, ["window", "save-setting", e, Q, JSON.stringify(te)], t, k.signal)
  };
}
function ti(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const it = { ok: !1, failure: "cancelled", error: "" }, Ps = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ni(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? it : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: ei[n.code] || "fault", error: ti(n.error) };
  } catch {
    return t != null && t.aborted ? it : { ok: !1, failure: "unreachable", error: Ps };
  }
}
const wd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: ei[e.code] || "fault", error: ti(e.error) };
async function $d(e, t) {
  try {
    const n = await e();
    return t.aborted ? it : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, wd(s)])) } };
  } catch {
    return t.aborted ? it : { ok: !1, failure: "unreachable", error: Ps };
  }
}
async function ai(e, t, n) {
  const a = await ni(() => Ql.read(e, t, n), t);
  return a.failure !== "unreachable" || !Bs() ? a : (await Ul(), t.aborted ? it : ai(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ce.held(() => xd(e, t, n, a, s), Ce.knownRead(Array.isArray(t) ? t : js(t)));
}
async function xd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : js(t), environment: n };
  return await Ce.isRead(o.line) ? Ce.joined(JSON.stringify(o), (l, i) => ai({ ...o, attribution: i }, l, s), a, o).catch(() => it) : ni(() => Ql.write({ ...o, attribution: {
    client_id: Ce.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Sd(e, t, n = void 0) {
  try {
    const a = await Ce.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? it : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? it : { ok: !1, failure: "unreachable", error: Ps };
  }
}
function js(e) {
  return [...e.matchAll(yd)].map(([t]) => t.replace(bd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Md = (e) => `show-${e}`, BS = (e, t, n) => e.filter((a) => {
  var s;
  return n(Md((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), si = "messages.chat", _d = {
  key: 0,
  class: "template-brief"
}, Cd = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Ed = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A([]), o = A(""), l = C(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = C(() => s.value.find((c) => String(c.id) === n.value));
    async function r() {
      const c = await Lt(si, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === d);
      h && a("pick", String(h.id));
    }
    return r(), (c, d) => (u(), f(P, null, [
      T(jt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (u(), f("p", _d, v(i.value.brief), 1)) : w("", !0),
      o.value ? (u(), f("p", Cd, v(o.value), 1)) : w("", !0)
    ], 64));
  }
}, Ad = /* @__PURE__ */ U(Ed, [["__scopeId", "data-v-14be8a5c"]]), Od = { class: "info-tip" }, Td = ["aria-label"], Id = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Bd = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (u(), f("span", Od, [
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
      ], 8, Td),
      m("span", Id, [
        (u(!0), f(P, null, ae(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, oi = /* @__PURE__ */ U(Bd, [["__scopeId", "data-v-a2fe5ff1"]]), Rd = { class: "form-field" }, Ld = { class: "form-field-head" }, Nd = ["for"], qd = {
  key: 1,
  class: "form-field-aside"
}, Dd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Rd, [
      m("div", Ld, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Nd),
        e.help ? (u(), F(oi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : w("", !0),
        t.$slots.aside ? (u(), f("span", qd, [
          fe(t.$slots, "aside", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Pd = /* @__PURE__ */ U(Dd, [["__scopeId", "data-v-302c40bf"]]), cs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, jd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ca(), n = C(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((u(), f("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [L(cs), L(t).value]
    ]);
  }
}), Fd = /* @__PURE__ */ U(jd, [["__scopeId", "data-v-e130a5b9"]]), Wd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = As(), o = C(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), F(Pd, {
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
            T(Ad, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (r) => a("pick", r))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            T(Fd, {
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
function Hd(e, t, n, a = () => window) {
  Me(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ie(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const zd = (e, t = () => !0) => Hd("keydown", (n) => n.key === "Escape" && t() && e());
function li(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = A(!1), s = C(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return zd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Ud = 80, It = Ht([]);
function ii(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Ie(n), C(() => Ud + Math.max(0, It.indexOf(t)));
}
let ri = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ri = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Gd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Vd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Gd)];
    if (!l.length) return o.preventDefault();
    const [i, r] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), r.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === r && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Me(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : ri, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Kd = ["aria-modal", "aria-label", "aria-labelledby"], Yd = {
  key: 0,
  class: "dialog-head"
}, Qd = ["id", "tabindex"], Xd = {
  key: 1,
  class: "dialog-foot"
}, Jd = 500, Zd = 400, ef = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = li(a, n), i = ii(s), r = A(null), c = A(null), d = A(null), h = As(), p = A(!1), y = Date.now();
    n.modal && Vd(c, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Zd);
    }
    function E(B) {
      !n.modal || Date.now() - y >= Jd || ![" ", "Enter"].includes(B.key) || (B.preventDefault(), B.stopPropagation());
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
              onKeydownCapture: E
            }, [
              e.bare ? w("", !0) : (u(), f("header", Yd, [
                m("h3", {
                  id: L(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Qd),
                e.closable ? (u(), F(ma, {
                  key: 0,
                  onClick: L(o)
                }, null, 8, ["onClick"])) : w("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: r,
                class: V(["dialog-body", { bare: e.bare }])
              }, [
                fe(B.$slots, "default", {}, void 0, !0)
              ], 2),
              B.$slots.foot ? (u(), f("footer", Xd, [
                fe(B.$slots, "foot", {}, void 0, !0)
              ])) : w("", !0)
            ], 42, Kd)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, pa = /* @__PURE__ */ U(ef, [["__scopeId", "data-v-6d1ecd98"]]), tf = {
  class: "action-output",
  "data-action-output": ""
}, nf = {
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
        m("pre", tf, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, af = /* @__PURE__ */ U(nf, [["__scopeId", "data-v-423a045c"]]);
function sf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Qr(af, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const of = (e, t, n = {}) => js(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function yn(e, t, n, a = {}) {
  var s;
  try {
    if (!await hd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(si, of(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && sf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const lf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ea = [
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
}, rf = ["secrets", "plugins"], ui = Object.keys(ga).filter((e) => !(Pl && rf.includes(e)));
C(() => ui.map((e) => ({ name: e, ...ga[e] })));
const Gt = (e) => ga[e], ci = new Map(ui.flatMap((e) => [e, e.replace(/s$/, ""), ga[e].title.toLowerCase()].map((t) => [t, e]))), pt = (e) => ci.get(String(e).toLowerCase()) || "", di = [...ci.keys()].sort((e, t) => t.length - e.length).join("|"), uf = {
  class: "button-form",
  "data-button-form": ""
}, cf = {
  key: 0,
  class: "button-form-title"
}, df = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, ff = { class: "button-form-actions" }, hf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = A(!1), l = A(""), i = C(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = C(() => {
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
          m("div", uf, [
            (p = e.row) != null && p.title ? (u(), f("p", cf, v(e.row.title), 1)) : w("", !0),
            (u(!0), f(P, null, ae(e.button.fields, (y) => (u(), F(Wd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", df, v(l.value), 1)) : w("", !0),
            m("div", ff, [
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
}, mf = /* @__PURE__ */ U(hf, [["__scopeId", "data-v-f26c27a7"]]), pf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, gf = {
  key: 1,
  class: "menu-item-text"
}, vf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: V(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", pf, v(e.checked ? "✓" : ""), 1)) : w("", !0),
      e.description ? (u(), f("span", gf, [
        m("span", null, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : fe(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ze = /* @__PURE__ */ U(vf, [["__scopeId", "data-v-fec99974"]]), yf = ["aria-busy"], bf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, kf = { class: "button-slot-confirm-text" }, wf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, $f = {
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
    const n = e, a = t, s = C(() => Ns(n.environment)), o = C(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = C(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = C(() => n.readOnly ? [] : fd(n.environment, n.name, n.row)), c = A(null), d = A(null), h = A(""), p = A(!1), y = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), b = (x) => x.icon || (x.warning ? "dot" : "");
    function E(x) {
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
      !o.value && l.value ? (u(), f(P, { key: 0 }, [
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
      ], 64)) : !o.value && d.value ? (u(), f("span", bf, [
        m("span", kf, v(d.value.confirm), 1),
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
      ])) : o.value ? w("", !0) : (u(), f(P, { key: 2 }, [
        (u(!0), f(P, null, ae(r.value, (W) => (u(), f(P, {
          key: W.name
        }, [
          W.menu.length ? (u(), F(sd, {
            key: 0,
            small: "",
            variant: W.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": W.menu_label || "More ways",
            title: y(W),
            "data-button": W.name,
            onMain: (N) => E(W)
          }, {
            menu: j(({ close: N }) => [
              (u(!0), f(P, null, ae(W.menu, (k) => (u(), F(ze, {
                key: k.label,
                description: k.description,
                onClick: (z) => (N(), E({ ...W, ...k, menu: [] }))
              }, {
                default: j(() => [
                  K(v(k.label), 1)
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
            onClick: (N) => E(W)
          }, {
            default: j(() => [
              K(v(W.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", wf, v(h.value), 1)) : w("", !0),
        c.value && !e.readOnly ? (u(), F(mf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: B[2] || (B[2] = (W) => c.value = null),
          onDone: B[3] || (B[3] = (W) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : w("", !0)
      ], 64))
    ], 10, yf));
  }
}, Fs = /* @__PURE__ */ U($f, [["__scopeId", "data-v-a4b6f174"]]), xf = {
  class: "running",
  "data-running-command": ""
}, Sf = ["title"], Mf = {
  key: "idle",
  class: "running-idle"
}, _f = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", xf, [
      T(zt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Sf)) : (u(), f("span", Mf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, RS = /* @__PURE__ */ U(_f, [["__scopeId", "data-v-d3240219"]]), Cf = ["aria-checked", "aria-label", "title"], Ef = {
  key: 0,
  class: "switch-inner"
}, Af = {
  key: 0,
  class: "switch-word"
}, Of = {
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
        e.labelled ? (u(), f("span", Ef, v(e.word), 1)) : w("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", Af, v(e.word), 1)) : w("", !0)
    ], 10, Cf));
  }
}, LS = /* @__PURE__ */ U(Of, [["__scopeId", "data-v-1bfb90f3"]]);
function fi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Xn(e, t) {
  return fi(() => localStorage, e, t);
}
function hi(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ws(e, t) {
  return hi(() => localStorage, e, t);
}
function mi(e, t) {
  me(t, (n) => Ws(e, n), { deep: !0 });
}
function Tf(e, t) {
  return fi(() => sessionStorage, e, t);
}
function If(e, t) {
  return hi(() => sessionStorage, e, t);
}
const Jn = "journal.environment", pi = A(Tf(Jn, Xn(Jn, "")));
function Bf(e) {
  pi.value = e, If(Jn, e), Ws(Jn, e);
}
const Zn = A(location.hash), Eo = Xe(null), Ao = { integrations: "mcp", library: "team" };
function Rf() {
  if (!Eo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Ao[n]) {
    location.replace(`#/${[Ao[n], ...a].join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash;
    return;
  }
  !n || Eo.value(n) || (Bf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Zn.value = location.hash, Rf();
});
const ds = C(() => {
  const [e, t = ""] = Zn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, r = ""] = l.split("@"), [c = "", d = "", h = ""] = i.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: r };
  });
  return {
    env: pi.value,
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
}), Hs = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Hs.page(e)}?open=${t}`
};
function Lf(e = "", t = 0, n = "") {
  location.hash = Hs.page(e, t, n);
}
function Nf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const qf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function gi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(qf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function NS(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function vt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = ds.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  gi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Df(e, t, n, a = 0, s = "") {
  if (e === ds.value.env) return vt(t, n, a, s);
  const o = ds.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  gi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Df(a, s, Number(o), 0, t) : vt(s, Number(o), 0, t);
}
function Pf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = Pf(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function qS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const jf = { class: "inspector-part" }, Ff = { class: "inspector-part-title" }, Wf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", jf, [
      m("h4", Ff, v(e.title), 1),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, DS = /* @__PURE__ */ U(Wf, [["__scopeId", "data-v-5175e4a3"]]), Oo = /* @__PURE__ */ new Map(), Hf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = A(null), a = A(!1), s = A(t.name && Oo.get(t.name) || !1);
    function o(r) {
      s.value = r, t.name && Oo.set(t.name, r);
    }
    const l = () => {
      const r = !!n.value && n.value.scrollHeight > t.at;
      r !== a.value && (a.value = r);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Me(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ie(() => i.disconnect()), (r, c) => (u(), f(P, null, [
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
      }, v(s.value ? "Show less" : "Show more"), 1)) : w("", !0)
    ], 64));
  }
}, vi = /* @__PURE__ */ U(Hf, [["__scopeId", "data-v-4d2235ba"]]), zf = ["aria-valuenow", "aria-valuemax"], Uf = {
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
    ], 10, zf));
  }
}, yi = /* @__PURE__ */ U(Uf, [["__scopeId", "data-v-9eba6a85"]]), Gf = { processes: "process", memories: "memory", replies: "reply" }, ea = (e) => (Gf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), fs = [], Vf = 2e3, ft = /* @__PURE__ */ new Map(), Kf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Yf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? fs.unshift(e) : fs.push(e), ft.clear();
}
function bi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Qf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Xf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function lt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Jf(e, t) {
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
  return Zf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Zf(e) {
  return e.split(Yf).map((t, n) => n % 2 ? t : t.replace(Kf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function To(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const eh = 24;
function th(e) {
  const [t, , ...n] = e, a = To(t), s = n.map(To), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > eh) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${un(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${un(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const ki = /^\s*(?:[-*+]|\d+[.)])\s+/, hs = /^\s*(\d+)[.)]\s/, Io = (e) => e.match(/^\s*/)[0].length;
function wi(e) {
  const t = e[0].match(hs), n = Io(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Io(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${un(o.text)}${o.nested.length ? wi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function nh(e, t) {
  const n = hs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (ki.test(e[s]) && hs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Bo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function $i(e) {
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
    if (Bo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(th(t.slice(a, i))), a = i;
      continue;
    }
    if (ki.test(s)) {
      const i = nh(t, a);
      n.push(wi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${$i(
          t.slice(a, i).map((r) => r.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Bo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${un(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const ah = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, sh = (e) => e.type !== "text" && !ah.test(e.html);
function oh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push($i(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : sh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function zs(e, t = { env: "" }) {
  const n = Xf(e, t), a = ft.get(n);
  if (ft.delete(n), a && a.source === t.source && a.reads.every((l) => Qf(l, t)))
    return ft.set(n, a), a.html;
  const s = [], o = oh(Jf(e, { ...t, reads: s }));
  return ft.set(n, { html: o, reads: s, source: t.source }), ft.size > Vf && ft.delete(ft.keys().next().value), o;
}
const Aa = /* @__PURE__ */ new WeakMap();
function lh(e) {
  if (Aa.has(e)) return Aa.get(e);
  const t = Xr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
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
function xi() {
  const e = Se(Le, null), t = e ? lh(e) : null;
  return (n, a = {}) => zs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Si = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, bn = (e) => String(e || "").replace(Si, (t, n, a, s) => s), ih = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Bn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, rh = /^Traceback \(most recent call last\):/m, uh = 8;
function Mi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, uh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function ch(e) {
  const t = [...e.matchAll(ih)].map((a) => a.index);
  if (Bn.lastIndex = 0, !t.length || !Bn.test(e)) return null;
  Bn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Bn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Mi(n), tail: "" } : null;
}
function dh(e) {
  const t = rh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Mi([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = bn(e), n = dh(t) || ch(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ta = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, _i = (e) => `${e.table}:${e.id}`, Ro = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Oa = 80;
function Lo(e) {
  return e.length <= Oa ? e : `${e.slice(0, Oa + 1).replace(/\s+\S*$/, "") || e.slice(0, Oa)}…`;
}
const No = {
  messages: (e) => Lo(Ro(e.text)),
  comments: (e) => Lo(Ro(e.text)),
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
}, fh = (e) => (No[e.table] ? No[e.table](e) : e.title || "") || "", _t = (e) => ta(e.created_at), hh = (e) => ta(e.updated_at) || _t(e), mh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, ph = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function gh(e) {
  const t = mh.exec(e);
  if (t && pt(t[1])) return { at: t.index, length: t[0].length, table: pt(t[1]), id: Number(t[2]), label: t[3] };
  const n = ph.exec(e), a = n && pt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function vh(e, t, n, a) {
  const s = bi(a, e, t), o = bn(s ? fh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${lt(Gt(e).title)} ${t}</span><span class="row-card-title">${lt(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = gh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: vh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const yh = /\.(png|jpe?g|gif|webp|svg)$/i, bh = (e) => yh.test(e), kh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, wh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function $h(e, t) {
  const n = kh.exec(e), [, a, s, o, l, i] = n || [], r = n && pt(a || o), c = r && bi(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Gt(r).title} ${c.id} · ${lt(i)}`, p = bh(i) ? `<img class="file-card-image" src="${d}" alt="${lt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${lt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function xh(e) {
  const t = wh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${lt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = $h(e, t) || xh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Sh = /`([^`\n]+)`/g;
Et((e) => e.replace(Sh, (t, n) => `<code>${n}</code>`));
const qo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Hs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(Si, (n, a, s, o) => qo[a] ? qo[a](s, o, t) : o)
);
const Mh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ci = new RegExp(`\\b(${di}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Ei = new RegExp(`\\b(${di}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), _h = new RegExp(`<code>((?:${Ci.source}|${Ei.source}))</code>`, "gi"), Ch = (e) => e.replace(_h, "$1"), Eh = (e, t) => `<a class="row-pill" href="#" data-peek="${pt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Ah = (e) => e.replace(Ei, (t, n, a) => a.replace(/\d+/g, (s) => Eh(n.replace(/s$/i, ""), s))), Oh = (e) => Ah(e).replace(
  Ci,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${pt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Ch(e).split(Mh).map((n, a) => a % 2 ? n : Oh(n)).join("")
);
const Th = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Ih = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Bh = /[\w\]]\(/, Rh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Lh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Nh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, qh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Dh = /[[({,]$/, Ph = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, jh = /^(\t|\s{2,})\S/, Fh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Wh = /`[^`]+`/, Hh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, zh = /[{}()[\];=<>$&|*\\@+^~%]/g, Ai = /^\s*(?:[-*+]|\d+[.)])\s/, Uh = /^\s*>/, Gh = /^\s*\|/, Vh = 0.6, Kh = 0.4, Yh = 5, Qh = 0.03, Oi = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Yh && t.every((n) => Hh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(zh) ?? []).length / e.length < Qh;
}, Ta = (e) => {
  const t = e.trim();
  return Wh.test(t) ? !1 : [Th, Ih, Bh, Rh, Lh, Nh, qh, Dh, Ph].some((n) => n.test(t)) || /[;{}]$/.test(t) || jh.test(e) && !Ai.test(e) && !Oi(e);
};
function Xh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ai.test(t[0]) || t.every((o) => Uh.test(o) || Gh.test(o))) return "text";
  const n = t.filter((o) => !Fh.test(o.trim()));
  if (t.length === 1) return !n.length || Ta(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ta).length, s = n.filter((o) => !Ta(o) && Oi(o)).length;
  return a >= n.length * Vh && s <= n.length * Kh ? "code" : "text";
}
const ms = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Jh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Zh = `${ms} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, em = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", tm = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Do = {
  js: { keywords: ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Jh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Zh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: em, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: tm, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, nm = {
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
function am(e, t) {
  const n = Do[nm[t] ?? t] || Do.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Po(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Po(e, o, n.block[0])) {
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
function sm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of am(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? lt(l) : `<span class="tok-${a}">${lt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function om(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const lm = 1500, jo = /* @__PURE__ */ new WeakMap();
async function im(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await om(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(jo.get(t)), jo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, lm)
  )));
}
typeof document < "u" && document.addEventListener("click", im, !0);
const rm = /\n\s*\n/, um = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, cm = /^\s*(`{3,}|~{3,})\s*$/, dm = /^\s{4,}\S/, fm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, ps = /^\s*(?:[-*+]|\d+[.)])\s/, Ti = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, hm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Us(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function mm(e) {
  const t = Us(e.join(`
`));
  return (hm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const pm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ti.test(t) && !ps.test(t);
}, gm = (e, t) => ps.test(t) || ps.test([...e].reverse().find((n) => n.trim()) || "");
function Gs(e, t) {
  const n = t || mm(e), a = sm(Us(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function vm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && cm.test(s));
  return a < 0 ? e.length : a;
}
function ym(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Gs(a.map(bn), n ? n.toLowerCase() : "");
}
function bm(e) {
  const t = e.split(rm).map((l) => ({ paragraph: l, type: Xh(Us(l).split(`
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
      s(), n.push(Gs(i.map(({ paragraph: r }) => r).join(`

`).split(`
`).map(bn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function km(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : bm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(um);
    if (i) {
      const c = vm(n, l, i[2]);
      o(), a.push(ym(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const r = pm(s) ? fm : dm;
    if (!t && r.test(n[l]) && !gm(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Ti.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Gs([...d, ...n.slice(l, c)].map(bn), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => km(e, t.document), { first: !0 });
const wm = ["innerHTML"], $m = ["innerHTML"], xm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = xi(), a = C(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, wm)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, $m));
  }
}, st = /* @__PURE__ */ U(xm, [["__scopeId", "data-v-d8e75741"]]), Fo = (e) => [...new Set(e.agents.map((t) => t.name))], Sm = (e) => Fo(e).length === 1 ? `Worker: ${Fo(e)[0]}` : "Delegated", Mm = ["aria-expanded"], _m = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Cm = {
  key: 0,
  class: "tip-failure"
}, Em = { key: 1 }, Am = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Se(Le, null), a = C(() => md(t.type, t.state)), s = A(!1), o = A([]), l = A("");
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
      s.value ? (u(), f("span", _m, [
        l.value ? (u(), f("span", Cm, v(l.value), 1)) : w("", !0),
        (u(!0), f(P, null, ae(o.value, (p, y) => (u(), f("span", {
          key: y,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : w("", !0)
    ], 40, Mm)) : (u(), f("span", Em, v(L(rn)(e.type, e.state)), 1));
  }
}, Om = /* @__PURE__ */ U(Am, [["__scopeId", "data-v-73ac4596"]]), Tm = {
  class: "plan-details",
  "data-plan-details": ""
}, Im = { class: "state-line" }, Bm = {
  key: 0,
  class: "phase-count"
}, Rm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Lm = { class: "text" }, Nm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, qm = { class: "overall" }, Dm = { class: "overall-figure" }, Pm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, jm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, Fm = {
  key: 4,
  class: "part"
}, Wm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (u(), f("div", Tm, [
      m("div", Im, [
        T(Om, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: V(["status", L(Zl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Bm, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : w("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Rm, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Lm, v(e.plan.reason), 1)
      ])) : w("", !0),
      e.plan.total ? (u(), f("section", Nm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", qm, [
          T(yi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Dm, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : w("", !0),
      e.plan.assignee ? (u(), f("p", Pm, "Agent: " + v(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), f("p", jm, v(L(Sm)(e.plan)), 1)) : w("", !0),
      e.plan.brief ? (u(), f("section", Fm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        T(vi, {
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
      ])) : w("", !0)
    ]));
  }
}, PS = /* @__PURE__ */ U(Wm, [["__scopeId", "data-v-c37da567"]]), Hm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, zm = { ...Hm, done: "Completed" }, Um = /* @__PURE__ */ new Set(["completed", "cancelled"]), Gm = (e) => Um.has(e), cn = (e) => Gm(e) ? "done" : e, Vm = { class: "task-status-icon" }, Km = ["width", "height", "aria-label"], Ym = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = C(() => Zl("task", cn(t.status))), a = C(() => n.value === "testing" ? "started" : n.value), s = C(() => zm[t.status] ?? rn("task", t.status));
    return (o, l) => (u(), f("span", Vm, [
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
          ], 10, Km))
        ]),
        _: 1
      })
    ]));
  }
}, kn = /* @__PURE__ */ U(Ym, [["__scopeId", "data-v-ae24a63f"]]), Qm = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Xm = ["title", "onClick"], Jm = { class: "agent-word" }, Zm = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = C(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((r) => r.helper_id && !n.has(r.state))) {
        const r = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, held: r });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (u(), f("div", Qm, [
      (u(!0), f(P, null, ae(s.value, (i) => (u(), f("button", {
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
        m("span", Jm, v(i.held ? "Working" : "Queued"), 1)
      ], 8, Xm))), 128))
    ])) : w("", !0);
  }
}, ep = /* @__PURE__ */ U(Zm, [["__scopeId", "data-v-0c589695"]]), tp = { class: "phases" }, np = { class: "phead" }, ap = { class: "mark" }, sp = { class: "ptitle" }, op = { class: "phead-end" }, lp = {
  key: 0,
  class: "checkpoint"
}, ip = { class: "progress" }, rp = {
  key: 0,
  class: "when"
}, up = ["onClick"], cp = { class: "row-id" }, dp = { class: "row-title" }, fp = ["title"], hp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((i) => n.has(i.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, i) => (u(), f("ol", tp, [
      (u(!0), f(P, null, ae(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: V(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", np, [
          m("span", ap, [
            T(re, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", sp, v(c + 1) + ". " + v(r.title), 1),
          m("span", op, [
            r.checkpoint ? (u(), f("span", lp, "checkpoint")) : w("", !0),
            m("span", ip, v(s(r)) + "/" + v(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", rp, v(r.goal), 1)) : w("", !0),
        T(ep, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(P, null, ae(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: V(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          T(kn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", cp, "#" + v(d.id), 1),
          m("span", dp, v(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, v(d.helper_name), 9, fp)) : w("", !0)
        ], 10, up))), 128))
      ], 2))), 128))
    ]));
  }
}, jS = /* @__PURE__ */ U(hp, [["__scopeId", "data-v-6a600744"]]), mp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, pp = {
  key: 0,
  class: "empty",
  role: "alert"
}, gp = {
  key: 2,
  class: "empty"
}, vp = { class: "day" }, yp = { class: "events" }, bp = { class: "mark" }, kp = { class: "what" }, wp = { class: "head" }, $p = { class: "word" }, xp = ["title", "onClick"], Sp = { class: "at" }, Mp = {
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
    return me(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", mp, [
      l.value ? (u(), f("p", pp, v(l.value), 1)) : o.value === null ? (u(), F(Ke, { key: 1 })) : o.value.length ? w("", !0) : (u(), f("p", gp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(P, null, ae(i.value, (p) => (u(), f(P, {
        key: p.day
      }, [
        m("h3", vp, v(p.day), 1),
        m("ol", yp, [
          (u(!0), f(P, null, ae(p.items, (y) => (u(), f("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: V(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", bp, [
              n[y.event_type].state ? (u(), F(kn, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (u(), F(re, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", kp, [
              m("div", wp, [
                m("span", $p, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, xp),
                m("span", Sp, v(r(y.time)), 1)
              ]),
              y.text ? (u(), F(st, {
                key: 0,
                class: "text",
                text: y.text
              }, null, 8, ["text"])) : w("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, FS = /* @__PURE__ */ U(Mp, [["__scopeId", "data-v-9e511133"]]);
function _p(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Vs(e, t = Date.now()) {
  const n = _p(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Cp = 36e5;
function Ep(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Cp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Wo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Ii(e) {
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
const Ia = (e) => String(e).padStart(2, "0");
function Bi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ia(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ia(Math.floor(t % 3600 / 60))}m ${Ia(t % 60)}s`;
}
const Ap = 1e3;
function Ri() {
  const e = A(Date.now()), t = setInterval(() => e.value = Date.now(), Ap);
  return et(() => clearInterval(t)), e;
}
const Op = Symbol("resource-subscriptions");
function wn(e, t, n = () => !0) {
  const a = Se(Op, () => new Gl(), !0), s = Rs(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  fa(() => {
    o(), s.cancel();
  });
}
const Li = (e, t) => !e.row_id || t.has(e.row_id), Tp = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, Ip = "Not known", Bp = 80, Rp = 1e3, Lp = "worker", Np = "main", qp = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), gs = (e) => e.ok ? e.value.rows : [], zo = (e) => e.ok ? e.value.total : 0, Dp = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Pp = (e, t) => (t == null ? void 0 : t.given_name) || Dp((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), jp = (e, t) => e.ended_at ? "ended" : e.paused_at || qp.has(t == null ? void 0 : t.state) ? "waiting" : "running", Ni = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Fp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Rp, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Bi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Bp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Ip : `$${t.cost_dollars.toFixed(2)}` }), e.role === Lp && l.push({ key: "pace", label: "Tasks an hour", value: String(Ep(Ni(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Np && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Wp(e) {
  const t = Ni(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Hp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Wo(e.created_at)]), e.ended_at && n.push(["Ended", Wo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const zp = { class: "band" }, Up = { key: 0 }, Gp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", zp, [
      T(re, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      fe(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", Up, v(e.count), 1)) : w("", !0)
    ]));
  }
}, Ft = /* @__PURE__ */ U(Gp, [["__scopeId", "data-v-1758914f"]]), Vp = { class: "number" }, Kp = { class: "text" }, Yp = 150, Qp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = A(!1), a = C(() => t.text.length > Yp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(P, null, [
      e.text ? (u(), f(P, { key: 0 }, [
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
        }, "Show all")) : w("", !0)
      ], 64)) : w("", !0),
      e.points.length ? (u(), f(P, { key: 1 }, [
        T(Ft, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
            K("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(P, null, ae(e.points, (i) => {
          var r;
          return u(), f("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", Vp, v(i.id), 1),
            m("span", Kp, [
              K(v(i.text), 1),
              m("span", {
                class: V(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : w("", !0)
    ], 64));
  }
}, Xp = /* @__PURE__ */ U(Qp, [["__scopeId", "data-v-c99de22c"]]), Jp = ["aria-expanded"], Zp = { class: "count" }, e1 = {
  key: 0,
  "data-agent-fold-body": ""
}, t1 = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Pt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = on(e, "open");
    return (n, a) => (u(), f(P, null, [
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
        m("span", Zp, v(e.count), 1),
        T(re, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Jp),
      t.value ? (u(), f("div", e1, [
        fe(n.$slots, "default", {}, void 0, !0)
      ])) : w("", !0)
    ], 64));
  }
}, Ba = /* @__PURE__ */ U(t1, [["__scopeId", "data-v-7f93d8d9"]]), n1 = ["onClick"], a1 = { class: "text" }, s1 = { class: "aside" }, o1 = {
  key: 0,
  class: "none"
}, l1 = {
  class: "skills",
  "data-agent-skills": ""
}, i1 = {
  key: 0,
  class: "none-inline"
}, r1 = { class: "label" }, u1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ht({ helpers: !1, skills: !1 }), a = A([]), s = A([]), o = async (i) => gs(await t.read(i));
    me(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), me(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Qn(i.role)} ${i.id}`;
    return (i, r) => (u(), f(P, null, [
      T(Ba, {
        open: n.helpers,
        "onUpdate:open": r[0] || (r[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: j(() => [
          (u(!0), f(P, null, ae(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => L(vt)("agents", c.id)
          }, [
            m("span", a1, v(l(c)), 1),
            m("span", s1, v(L(Qn)(c.role)) + " " + v(c.id), 1)
          ], 8, n1))), 128)),
          a.value.length ? w("", !0) : (u(), f("p", o1, "It started no helpers."))
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
          m("p", l1, [
            (u(!0), f(P, null, ae(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? w("", !0) : (u(), f("span", i1, "It loaded no skills."))
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
          (u(!0), f(P, null, ae(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", r1, v(c) + ":", 1),
            m("span", {
              class: V(["value", h])
            }, v(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, c1 = /* @__PURE__ */ U(u1, [["__scopeId", "data-v-358a0300"]]), d1 = ["datetime", "title"], Ze = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ri(), a = C(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(L(Vs)(e.at, L(n))), 9, d1));
  }
}, f1 = {
  class: "now",
  "data-agent-now": ""
}, h1 = {
  key: 1,
  class: "muted"
}, m1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, p1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, g1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, v1 = { class: "line" }, y1 = { class: "detail" }, b1 = { class: "bar" }, k1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = C(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(P, null, [
      T(Ft, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          K("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", f1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => L(vt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (u(), f("span", h1, v(e.nothing), 1)),
        n.value ? (u(), f("span", m1, v(n.value), 1)) : w("", !0),
        e.inspection.last_activity ? (u(), f("span", p1, [
          o[3] || (o[3] = K("Seen: ", -1)),
          T(Ze, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : w("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", g1, [
        m("div", v1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => L(vt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", y1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", b1, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : w("", !0)
    ], 64));
  }
}, w1 = /* @__PURE__ */ U(k1, [["__scopeId", "data-v-ff25c609"]]), $1 = ["onClick"], x1 = { class: "text" }, S1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, M1 = { class: "text" }, _1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, C1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(P, null, [
      T(Ft, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
          K("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), f(P, null, ae(e.moves, (a) => (u(), f(P, {
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
          m("span", x1, v(a.text), 1),
          T(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, $1)) : (u(), f("div", S1, [
          m("i", {
            class: V(["dot", a.tone])
          }, null, 2),
          m("span", M1, v(a.text), 1),
          T(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? w("", !0) : (u(), f("p", _1, "Nothing yet."))
    ], 64));
  }
}, E1 = /* @__PURE__ */ U(C1, [["__scopeId", "data-v-58f0db57"]]), A1 = {
  class: "strip",
  "data-agent-strip": ""
}, O1 = ["data-agent-cell"], T1 = {
  key: 0,
  class: "meter"
}, I1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", A1, [
      (u(!0), f(P, null, ae(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: V({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", T1, [
          m("i", {
            class: V({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : w("", !0)
      ], 8, O1))), 128))
    ]));
  }
}, B1 = /* @__PURE__ */ U(I1, [["__scopeId", "data-v-b6657ab7"]]), R1 = {}, L1 = { class: "menu-label" };
function N1(e, t) {
  return u(), f("span", L1, [
    fe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const St = /* @__PURE__ */ U(R1, [["render", N1], ["__scopeId", "data-v-aa955b3e"]]), q1 = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, D1 = {
  key: 0,
  class: "skills-none"
}, P1 = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => n.skills.filter((l) => l.state === "loaded")), o = C(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (u(), f("div", q1, [
      T(St, null, {
        default: j(() => [...i[1] || (i[1] = [
          K("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? w("", !0) : (u(), f("p", D1, "None yet. Compacting the conversation empties this list.")),
      (u(!0), f(P, null, ae(s.value, (r) => (u(), f("p", {
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
      o.value.length ? (u(), f(P, { key: 1 }, [
        T(St, null, {
          default: j(() => [...i[2] || (i[2] = [
            K("Still to read", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(P, null, ae(o.value, (r) => (u(), f("p", {
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
      ], 64)) : w("", !0),
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
}, j1 = /* @__PURE__ */ U(P1, [["__scopeId", "data-v-be514d47"]]), F1 = ["disabled", "title"], W1 = { class: "gauge usage" }, H1 = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => n.windows[0] ?? null), o = C(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = C(() => o.value !== null && o.value >= 100), i = C(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), r = C(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
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
      m("span", W1, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      K(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, F1)) : w("", !0);
  }
}, z1 = /* @__PURE__ */ U(H1, [["__scopeId", "data-v-048b0a74"]]), U1 = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: V(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Ks = /* @__PURE__ */ U(U1, [["__scopeId", "data-v-9e7e1157"]]);
function G1(e, t, n, { groups: a, programs: s }) {
  const o = A({}), l = A(""), i = A(!1), r = C(() => !!e.value && !e.value.ended_at), c = C(() => r.value && !!e.value.paused_at);
  async function d(b, E = null) {
    l.value = "";
    const S = await ql(E, b, t);
    return l.value = S.ok ? "" : S.error, n(), S;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: r, paused: c, choose: (b, E) => d(["agent", "control", String(e.value.id), b, E.value], { target: o, fields: { value: { ...o.value, [b]: E.label } } }), stop: () => (i.value = !1, d(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => d(["agent", "launch", b.name]) };
}
function V1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const K1 = ["disabled", "title"], Y1 = ["disabled", "title"], Q1 = { class: "gauge" }, X1 = ["disabled", "title"], J1 = ["disabled"], Z1 = ["disabled"], eg = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, tg = ["title"], ng = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, ag = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, sg = { class: "gauge" }, og = { class: "context-used" }, lg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, ig = 75, rg = {
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
    const n = e, a = t, s = G1(xa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: xa(n, "controlGroups"), programs: xa(n, "agentPrograms") }), o = A(null), l = A(""), i = C(() => s.groups.value.find((N) => N.key === l.value));
    function r(N, k) {
      o.value = N.currentTarget, l.value = k;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const d = C(() => n.skills.filter((N) => N.state === "loaded"));
    function h(N) {
      r(N, "skills"), a("skills");
    }
    const p = (N) => s.groups.value.some((k) => k.key === N), y = C(() => {
      var N;
      return s.chosen.value.model ?? ((N = E.value) == null ? void 0 : N.model) ?? "";
    }), b = C(() => {
      var N;
      return s.chosen.value.effort ?? ((N = E.value) == null ? void 0 : N.effort) ?? "";
    });
    C(() => !!n.agent && !n.agent.ended_at);
    const E = C(() => {
      var N;
      return ((N = n.usage.agents) == null ? void 0 : N.find((k) => {
        var z;
        return k.id === ((z = n.agent) == null ? void 0 : z.id);
      })) ?? null;
    }), S = C(() => {
      var N;
      return ((N = E.value) == null ? void 0 : N.context_percent) == null ? null : Math.round(E.value.context_percent);
    }), x = (N) => `${Math.round(N / 1e3)}k`, B = C(() => {
      var N;
      return (N = E.value) != null && N.context_limit_tokens ? `${x(E.value.context_tokens ?? 0)} of ${x(E.value.context_limit_tokens)}` : "";
    }), W = C(() => {
      var N;
      return (N = E.value) != null && N.cost_dollars ? `$${E.value.cost_dollars.toFixed(2)}` : "";
    });
    return (N, k) => {
      var z;
      return u(), f("div", {
        class: V(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (u(), f(P, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: k[0] || (k[0] = (D) => r(D, "agent"))
          }, [
            T(re, {
              name: "agents",
              size: 12
            }),
            K(" " + v(((z = e.agentPrograms.find((D) => D.name === e.agent.program)) == null ? void 0 : z.title) || e.agent.program), 1)
          ], 8, K1),
          T(z1, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: k[1] || (k[1] = (D) => a("open", "usage", D))
          }, null, 8, ["windows", "disabled"]),
          S.value !== null ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${S.value}% full: clear or compact it`,
            onClick: k[2] || (k[2] = (D) => p("context") ? r(D, "context") : a("open", "context", D.currentTarget))
          }, [
            T(re, {
              name: "gauge",
              size: 12
            }),
            k[14] || (k[14] = K()),
            m("span", Q1, [
              m("span", {
                style: ve({ width: `${S.value}%` })
              }, null, 4)
            ]),
            K(" " + v(S.value) + "% ", 1)
          ], 8, Y1)) : w("", !0),
          y.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: k[3] || (k[3] = (D) => p("model") ? r(D, "model") : null)
          }, [
            T(re, {
              name: "model",
              size: 12
            }),
            K(" " + v(y.value), 1)
          ], 8, X1)) : w("", !0),
          p("effort") || e.card && b.value ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: k[4] || (k[4] = (D) => r(D, "effort"))
          }, [
            T(re, {
              name: "bolt",
              size: 12
            }),
            K(" " + v(b.value), 1)
          ], 8, J1)) : w("", !0),
          W.value ? (u(), f("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: k[5] || (k[5] = (D) => a("open", "cost", D.currentTarget))
          }, v(W.value), 9, Z1)) : w("", !0),
          e.branch ? (u(), f("span", eg, [
            T(re, {
              name: "branch",
              size: 12
            }),
            K(" " + v(e.branch), 1)
          ])) : w("", !0),
          e.card ? w("", !0) : (u(), f("button", {
            key: 5,
            type: "button",
            class: V(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: k[6] || (k[6] = (D) => a("open", "jobs", D.currentTarget))
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
          ])) : w("", !0),
          e.fitness ? (u(), f(P, { key: 7 }, [
            m("button", {
              type: "button",
              class: V(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ig }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: k[7] || (k[7] = (D) => a("open", "fitness", D.currentTarget))
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
              onClick: k[8] || (k[8] = (D) => a("open", "load", D.currentTarget))
            }, [
              T(re, {
                name: "weight",
                size: 12
              }),
              K(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : w("", !0)
        ], 64)) : e.run && !e.loading ? (u(), f("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: k[9] || (k[9] = (D) => r(D, "start"))
        }, [
          T(re, {
            name: "agents",
            size: 12
          }),
          k[15] || (k[15] = K(" Start an agent", -1))
        ])) : w("", !0),
        k[21] || (k[21] = m("span", { class: "space" }, null, -1)),
        L(s).failure.value ? (u(), f("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: L(s).failure.value
        }, v(L(s).failure.value), 9, tg)) : w("", !0),
        fe(N.$slots, "default", {}, void 0, !0),
        o.value ? (u(), F(ha, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: j(() => {
            var D;
            return [
              l.value === "agent" ? (u(), f(P, { key: 0 }, [
                L(s).asking.value ? (u(), f(P, { key: 0 }, [
                  T(St, { "data-agent-stop-ask": "" }, {
                    default: j(() => [...k[16] || (k[16] = [
                      K("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  T(ze, {
                    "data-agent-stop-confirm": "",
                    onClick: k[10] || (k[10] = (q) => (c(), L(s).stop()))
                  }, {
                    default: j(() => [...k[17] || (k[17] = [
                      K("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  T(ze, {
                    onClick: k[11] || (k[11] = (q) => L(s).asking.value = !1)
                  }, {
                    default: j(() => [...k[18] || (k[18] = [
                      K("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (u(), F(ze, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: k[12] || (k[12] = (q) => L(s).asking.value = !0)
                }, {
                  default: j(() => [...k[19] || (k[19] = [
                    K("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (u(), f(P, { key: 1 }, [
                T(St, null, {
                  default: j(() => [...k[20] || (k[20] = [
                    K("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (u(!0), f(P, null, ae(L(s).programs.value, (q) => (u(), F(ze, {
                  key: q.name,
                  "data-agent-program": q.name,
                  onClick: (M) => (c(), L(s).start(q))
                }, {
                  default: j(() => [
                    K(v(q.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (u(), F(j1, {
                key: 2,
                skills: e.skills,
                onBrowse: k[13] || (k[13] = (q) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (u(), f(P, { key: 3 }, [
                T(St, null, {
                  default: j(() => [
                    K(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (u(), f(P, { key: 0 }, [
                  m("p", ng, v(L(V1)(((D = E.value) == null ? void 0 : D.last_compaction) ?? null)), 1),
                  m("div", ag, [
                    m("span", sg, [
                      m("span", {
                        style: ve({ width: `${S.value}%` })
                      }, null, 4)
                    ]),
                    m("span", og, v(S.value) + "%", 1)
                  ]),
                  B.value ? (u(), f("p", lg, [
                    K(v(B.value) + " ", 1),
                    T(Ks, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : w("", !0)
                ], 64)) : w("", !0),
                (u(!0), f(P, null, ae(i.value.choices, (q) => (u(), F(ze, {
                  key: q.value,
                  "data-agent-choice": q.value,
                  onClick: (M) => (L(s).choose(i.value.key, q), c())
                }, {
                  default: j(() => [
                    K(v(q.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : w("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : w("", !0)
      ], 2);
    };
  }
}, ug = /* @__PURE__ */ U(rg, [["__scopeId", "data-v-dc15ff96"]]), cg = {
  class: "who",
  "data-agent-who": ""
}, dg = { class: "name" }, fg = ["data-agent-state"], hg = {
  class: "sub",
  "data-agent-started-by": ""
}, mg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", cg, [
      m("h2", dg, [
        m("i", {
          class: V(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, fg),
        K(v(e.name), 1)
      ]),
      T(ug, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", hg, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, pg = /* @__PURE__ */ U(mg, [["__scopeId", "data-v-83bd4a9d"]]), gg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, vg = { class: "scroll" }, yg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, bg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, kg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ri(), a = A(null), s = A(null), o = A(null), l = A({}), i = A({ helpers: 0, skills: 0 }), r = A(0), c = A([]), d = A([]), h = A("");
    let p = 0;
    const y = C(() => {
      var x;
      return a.value.ended_at ? Wp(s.value) : `It has no task.${(x = s.value) != null && x.instruction ? " It was given an instruction." : ""}`;
    });
    async function b() {
      const x = ++p, B = await t.read(["agent", "show", String(t.id)]);
      if (x !== p) return;
      if (!B.ok) return void (h.value = B.error);
      const W = String(t.id), N = B.value.role === "worker", [k, z, D, q, M, O, $] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", W, "--environment", t.environment]),
        t.read(["usage", "agent", W]),
        B.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", W]),
        t.read(["agent", "list", "--parent", W, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", W, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        N ? t.read(["worker-worktree", "points", "--agent", W]) : { ok: !1 },
        t.read(["agent", "programs"])
      ]);
      x === p && (h.value = z.ok ? "" : z.error, a.value = B.value, s.value = gs(k).find((g) => g.id === t.id) ?? null, o.value = z.ok ? z.value : null, l.value = D.ok ? D.value : {}, i.value = { helpers: zo(q), skills: zo(M) }, c.value = O.ok ? O.value.points : [], d.value = gs($), r.value += 1);
    }
    const E = C(() => /* @__PURE__ */ new Set([t.id])), S = {
      agent: (x) => Li(x, E.value),
      hook_call: (x) => Tp(x, "session_agent_id", E.value)
    };
    return wn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], b, (x) => {
      var B;
      return ((B = S[x.event.split(".")[0]]) == null ? void 0 : B.call(S, x)) ?? !0;
    }), Me(b), (x, B) => {
      var W, N;
      return u(), f("article", gg, [
        m("div", vg, [
          h.value ? (u(), f("p", yg, v(h.value), 1)) : a.value && o.value ? (u(), f(P, { key: 1 }, [
            T(pg, {
              name: L(Pp)(a.value, s.value),
              state: L(jp)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: d.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            T(B1, {
              cells: L(Fp)({ row: a.value, facts: s.value, inspection: o.value, now: L(n) })
            }, null, 8, ["cells"]),
            T(w1, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            T(Xp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((N = s.value) == null ? void 0 : N.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            T(E1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            T(c1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: r.value,
              details: L(Hp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", bg, "Ended " + v(L(Vs)(a.value.ended_at, L(n))) + ". It takes no more actions.", 1)) : w("", !0)
          ], 64)) : (u(), F(Ke, { key: 2 }))
        ])
      ]);
    };
  }
}, WS = /* @__PURE__ */ U(kg, [["__scopeId", "data-v-4ba2b82d"]]), wg = ["aria-expanded"], $g = { class: "drop-label" }, xg = ["value"], Sg = {
  key: 1,
  class: "drop-lead"
}, Mg = { class: "drop-item-text" }, _g = {
  key: 2,
  class: "drop-note"
}, Cg = {
  key: 1,
  class: "drop-none"
}, Eg = {
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
        }, null, 8, ["name"])) : w("", !0),
        m("span", $g, v(e.label), 1),
        T(re, {
          name: "down",
          size: 11
        })
      ], 10, wg),
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
          }, null, 40, xg)) : w("", !0),
          (u(!0), f(P, null, ae(i.value, (h) => (u(), F(ze, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => r(h)
          }, {
            default: j(() => [
              h.running !== void 0 ? (u(), f("span", {
                key: 0,
                class: V(["drop-dot", { live: h.running }])
              }, null, 2)) : w("", !0),
              h.lead ? (u(), f("span", Sg, v(h.lead), 1)) : w("", !0),
              m("span", Mg, v(h.label), 1),
              h.note ? (u(), f("span", _g, v(h.note), 1)) : w("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? w("", !0) : (u(), f("p", Cg, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : w("", !0)
    ], 2));
  }
}, qi = /* @__PURE__ */ U(Eg, [["__scopeId", "data-v-29dfcce5"]]);
function Ag(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Me(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), et(() => n.disconnect()), t;
}
const Og = ["data-comment-id"], Tg = {
  key: 0,
  class: "comment-top"
}, Ig = { class: "comment-mark" }, Bg = {
  class: "comment-body",
  "data-comment": ""
}, Rg = { class: "comment-foot" }, Lg = {
  key: 1,
  "data-comment-lost": ""
}, Ng = {
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
      e.comment.quote ? (u(), f("div", Tg, [
        m("span", Ig, v(e.comment.number), 1),
        m("span", {
          class: V(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : w("", !0),
      m("p", Bg, v(e.comment.body), 1),
      m("div", Rg, [
        e.comment.created_at ? (u(), F(Ze, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : w("", !0),
        e.lost ? (u(), f("span", Lg, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : w("", !0)
      ])
    ], 10, Og));
  }
}, Di = /* @__PURE__ */ U(Ng, [["__scopeId", "data-v-a37d4507"]]);
var Il;
/Mac|iPhone|iPad/.test(((Il = navigator.userAgentData) == null ? void 0 : Il.platform) || navigator.platform);
function Pi(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const qg = {
  class: "comment-box",
  "data-comment-box": ""
}, Dg = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Pg = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, jg = { class: "comment-row" }, Fg = ["placeholder"], Wg = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Pt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Pt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = on(e, "draft"), l = A(""), i = A(!1), r = A(null), c = C(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), d = C(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
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
    return t({ focus: () => r.value.focus() }), (y, b) => (u(), f("div", qg, [
      e.selection ? (u(), f("div", Dg, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: V(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        T(ma, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (E) => s("clear"))
        })
      ])) : w("", !0),
      l.value ? (u(), f("p", Pg, v(l.value), 1)) : w("", !0),
      m("div", jg, [
        Je(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": b[1] || (b[1] = (E) => o.value = E),
          rows: "1",
          maxlength: "2000",
          class: V({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Mt((E) => L(Pi)(E, p), ["enter"]))
        }, null, 42, Fg), [
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
}, Hg = /* @__PURE__ */ U(Wg, [["__scopeId", "data-v-41d2081c"]]), Rn = (e) => e ? e.split(", ") : [];
function zg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Ug(e, t) {
  return {
    reads: Rn(e.reads_allowed),
    runs: Rn(e.runs_allowed),
    missing: [...Rn(e.reads_missing), ...Rn(e.runs_missing)],
    ask: t
  };
}
const Gg = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Jr("SkeletonParts", !0);
      return u(!0), f(P, null, ae(e.parts, (r, c) => (u(), f(P, { key: c }, [
        (u(!0), f(P, null, ae(r.count, (d) => (u(), F(Ut, {
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
}), Vg = /* @__PURE__ */ U(Gg, [["__scopeId", "data-v-fa8baeaf"]]), Kg = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Yg = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", Kg, [
      T(Vg, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Ys = /* @__PURE__ */ U(Yg, [["__scopeId", "data-v-52f66b64"]]), ji = {
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
}, Qg = { class: "bars" }, Xg = { class: "bar-name" }, Jg = { class: "bar-value" }, Zg = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = C(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", Qg, [
      (u(!0), f(P, null, ae(e.items, (r, c) => (u(), F(rt(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: V(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          m("span", Xg, v(r.label), 1),
          T(yi, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Jg, v(r.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ev = /* @__PURE__ */ U(Zg, [["__scopeId", "data-v-663427f4"]]), tv = { class: "bars" }, nv = {
  key: 0,
  class: "bars-title"
}, av = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", tv, [
      e.node.title ? (u(), f("span", nv, v(e.node.title), 1)) : w("", !0),
      T(ev, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, sv = /* @__PURE__ */ U(av, [["__scopeId", "data-v-7135bb11"]]), ov = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = C(() => n[a.node.type](a.node));
    return (l, i) => (u(), f("div", {
      class: V([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ve(o.value)
    }, [
      (u(!0), f(P, null, ae(e.node.children || [], (r, c) => (u(), F(Fi, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Wn = /* @__PURE__ */ U(ov, [["__scopeId", "data-v-d142a3f4"]]), lv = {
  key: 0,
  class: "card-head"
}, iv = { class: "card-title" }, rv = {
  key: 0,
  class: "card-note"
}, uv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: V(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", lv, [
        m("span", iv, v(e.node.title), 1),
        e.node.note ? (u(), f("span", rv, v(e.node.note), 1)) : w("", !0)
      ])) : w("", !0),
      T(Wn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, cv = /* @__PURE__ */ U(uv, [["__scopeId", "data-v-67b72d40"]]), dv = { class: "fact" }, fv = { class: "fact-label" }, hv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", dv, [
      m("span", fv, v(e.label), 1),
      T(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, mv = /* @__PURE__ */ U(hv, [["__scopeId", "data-v-3a88ecf8"]]), pv = { class: "list" }, gv = { class: "list-label" }, vv = {
  key: 1,
  class: "list-note"
}, yv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", pv, [
      (u(!0), f(P, null, ae(e.items, (o, l) => (u(), F(rt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: V(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", gv, v(o.label), 1),
          o.badge ? (u(), F(Ks, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : w("", !0),
          o.note ? (u(), f("span", vv, v(o.note), 1)) : w("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, bv = /* @__PURE__ */ U(yv, [["__scopeId", "data-v-ebe2ae0a"]]), kv = { class: "table" }, wv = {
  key: 0,
  class: "table-row empty"
}, $v = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", kv, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (u(!0), f(P, null, ae(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (u(!0), f(P, null, ae(e.rows, (i, r) => (u(), F(rt(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: V(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          (u(!0), f(P, null, ae(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", wv, v(e.empty), 1)) : w("", !0)
    ]));
  }
}, xv = /* @__PURE__ */ U($v, [["__scopeId", "data-v-9326a52e"]]), Sv = { class: "stat-value" }, Mv = { class: "stat-label" }, _v = {
  key: 0,
  class: "stat-note"
}, Cv = {
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
        m("span", Sv, v(e.value), 1),
        m("span", Mv, v(e.label), 1),
        e.note ? (u(), f("span", _v, v(e.note), 1)) : w("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Ev = /* @__PURE__ */ U(Cv, [["__scopeId", "data-v-ad0db6d6"]]), Av = { class: "code" }, Ov = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
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
        T(cv, {
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
        T(Ev, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        T(sv, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        T(xv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        T(bv, {
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
        T(mv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        T(Ks, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", Av, [
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
}), Fi = /* @__PURE__ */ U(Ov, [["__scopeId", "data-v-cbdcf540"]]), Tv = { class: "dashboard" }, Iv = { class: "trail" }, Bv = ["onClick"], Rv = {
  key: 0,
  class: "gone",
  role: "status"
}, Lv = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = A(!!n.page && !s(n.page)), l = A(n.page && !o.value ? [n.page] : []), i = C(() => l.value.at(-1) || n.document.start), r = C(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return me(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (u(), f("div", Tv, [
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
      })) : r.value ? (u(), f(P, { key: 2 }, [
        m("nav", Iv, [
          m("button", {
            type: "button",
            class: V(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(c(e.document.start)), 3),
          (u(!0), f(P, null, ae(l.value, (b, E) => (u(), f(P, {
            key: `${E}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: V(["step", { current: E === l.value.length - 1 }]),
              onClick: (S) => h(E + 1)
            }, v(c(b)), 11, Bv)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", Rv, "What you opened is no longer in this dashboard. Here is its start page.")) : w("", !0),
        T(zt, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              T(Fi, {
                node: r.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : w("", !0)
    ]));
  }
}, Nv = /* @__PURE__ */ U(Lv, [["__scopeId", "data-v-fbe83734"]]);
function qv(e, t) {
  const n = tt(), a = Rs(e, ji.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Me(e), et(() => {
    s(), a.cancel();
  });
}
const Dv = {
  key: 0,
  class: "window-failure"
}, Pv = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = tt(), o = A(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? qv(l, n.events) : Is(l, () => !0, ji.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", Dv, v(o.value.error), 1)) : o.value ? (u(), F(Nv, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : w("", !0);
  }
}, jv = 1e4;
class Fv {
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
    return this.heardAt !== null && t - this.heardAt > jv;
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
const Wv = {
  key: 0,
  class: "frame-note"
}, Hv = {
  key: 0,
  class: "frame-note"
}, zv = ["src", "title"], Uv = 1e3, Gv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = tt(), a = A(null), s = A(!1), o = A(!1);
    let l = null, i = 0;
    return Me(() => {
      l = new Fv(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, Uv);
    }), Ie(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", Wv, "This window was closed because it stopped answering.")) : (u(), f(P, { key: 1 }, [
      s.value ? (u(), f("div", Hv, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        T(ge, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...c[1] || (c[1] = [
            K("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: L(n).window
      }, null, 8, zv)
    ], 64));
  }
}, Vv = /* @__PURE__ */ U(Gv, [["__scopeId", "data-v-32a49046"]]), Kv = {
  class: "allowance-prompt",
  role: "dialog"
}, Yv = { class: "allowance-prompt-text" }, Qv = { class: "allowance-prompt-buttons" }, Xv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Kv, [
      m("p", Yv, v(L(zg)(e.request)), 1),
      m("div", Qv, [
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
}, Jv = /* @__PURE__ */ U(Xv, [["__scopeId", "data-v-cad69fe2"]]), Ra = {
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
        })) : w("", !0),
        e.removable ? (u(), F(ge, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            K("Remove tab", -1)
          ])]),
          _: 1
        })) : w("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Zv = ["data-window", "data-agent"], ey = {
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
    const i = Se(wc, null), r = kd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: C(() => n.options),
      declared: n.declared,
      page: Se(pd, null),
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
    Bl(Le, r), me(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Me(r.settle), Ie(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Zr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ua(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), F(Jv, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : w("", !0),
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
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(P, { key: 4 }, [
        (u(), F(c, { key: o.value })),
        e.skeleton.length && !L(r).answered.value ? (u(), F(Ys, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : w("", !0)
      ], 64)) : (u(), F(Ra, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Zv));
  }
}, en = /* @__PURE__ */ U(ey, [["__scopeId", "data-v-c4443e2b"]]), Wi = {
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
    const n = e, a = t, s = { render: () => ua(Vv, { src: n.entry.entry_url }) };
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
}, ty = ["data-window"], Hi = {
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
    const n = e, a = t, s = Xe(null), o = A("");
    return me(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, ju();
          } catch (i) {
            if (Du(i) && Pu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      T(Ys, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, ty)) : (u(), F(en, {
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
}, ny = {
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
    const n = t, a = e, s = C(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = C(() => s.value && { render: () => ua(Pv, { line: s.value.line, events: s.value.events }) }), l = A(null), i = C(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), r = C(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = C(
      () => {
        var p, y;
        return l.value ? Ug(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
      var b, E;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), F(Ys, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((E = s.value) == null ? void 0 : E.shows) === "one-agent" && e.agent === null ? (u(), F(ln, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), F(en, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": r.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), F(Hi, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), F(Wi, {
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
}, ay = ["data-section"], sy = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, oy = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Se(Ds, null), a = C(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = C(() => ({ row: t.row }));
    return (o, l) => L(n) ? (u(!0), f(P, { key: 0 }, ae(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), F(ny, {
        key: 0,
        name: i.name,
        catalogue: L(n).catalogue,
        subscriptions: L(n).subscriptions,
        environment: L(n).environment,
        prompts: L(n).prompts,
        "shell-read": L(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", sy, v(i.name) + " is not available", 1))
    ], 8, ay))), 128)) : w("", !0);
  }
}, vs = /* @__PURE__ */ U(oy, [["__scopeId", "data-v-a47d36b7"]]), ly = { class: "rail-head" }, iy = { key: 0 }, ry = {
  key: 1,
  class: "rail-none"
}, uy = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: V(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", ly, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", iy, v(e.total || e.comments.length), 1)) : w("", !0)
      ]),
      e.comments.length ? (u(!0), f(P, { key: 0 }, ae(e.comments, (a) => (u(), F(Di, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", ry, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, cy = /* @__PURE__ */ U(uy, [["__scopeId", "data-v-4d684649"]]), dy = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, fy = ["aria-pressed"], hy = ["aria-pressed"], my = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, py = {
  key: 0,
  role: "alert"
}, gy = {
  key: 1,
  class: "sidebar-none"
}, vy = ["data-question-id"], yy = { class: "question-state" }, by = ["data-question-show", "onClick"], ky = {
  key: 0,
  class: "sidebar-none"
}, wy = {
  key: 1,
  class: "question-answer"
}, $y = {
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
    const t = Se(Ds, null);
    return (n, a) => (u(), f("div", {
      class: V(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", dy, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, fy),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, hy)
      ]),
      e.mode === "comments" ? (u(), f(P, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), F(cy, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : w("", !0),
        T(vn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), f("aside", my, [
        e.failure ? (u(), f("p", py, v(e.failure), 1)) : e.questions.length ? w("", !0) : (u(), f("p", gy, "No questions about this text yet.")),
        (u(!0), f(P, null, ae(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: V(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", yy, v(L(rn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, by),
            s.quote ? (u(), f(P, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", ky, "The quoted text has changed.")) : w("", !0)
            ], 64)) : w("", !0),
            s.answer ? (u(), f("p", wy, "Answered: " + v(s.answer), 1)) : w("", !0),
            T(vs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            T(Fs, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = L(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, vy);
        }), 128))
      ]))
    ], 2));
  }
}, Uo = /* @__PURE__ */ U($y, [["__scopeId", "data-v-2718a08d"]]), xy = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Sy = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ht({ abstract: n.row.abstract, body: n.row.body }), o = A("");
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
        m("span", xy, v(o.value), 1),
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
}, My = /* @__PURE__ */ U(Sy, [["__scopeId", "data-v-e99f14e0"]]);
function zi(e, t) {
  const n = A([]), a = A(!1), s = A(null), o = A(0), l = A(!1), i = A("");
  let r = 0, c = 0;
  const d = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: E, id: S, title: x } = e(), B = `On ${E} ${S}, ${x}: `;
    return b.text.startsWith(B) ? b.text.slice(B.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: E, id: S } = e();
    if (!S) return;
    const x = ++c;
    l.value = !0, i.value = "";
    try {
      const B = await t([E, "comments", String(S), "--page", String(b), "--page-size", "25"]);
      if (x !== c) return;
      if (!B.ok) {
        i.value = B.error;
        return;
      }
      const W = B.value.rows ?? [], N = b === 1 ? W : [...n.value, ...W];
      n.value = [...new Map(N.map((k) => [k.id, k])).values()], o.value = B.value.total ?? n.value.length, s.value = B.value.next_page ?? null;
    } catch (B) {
      x === c && (i.value = B.message);
    } finally {
      x === c && (l.value = !1);
    }
  }
  async function p(b) {
    var k;
    const { noun: E, id: S } = e(), x = `${E}:${S}`, B = { id: `sending-${++r}`, text: b };
    n.value = [...n.value, B], o.value++, a.value = !0;
    const W = await t([E, "comment", String(S), b]);
    if (x !== `${e().noun}:${e().id}`) return;
    if (!W.ok)
      throw n.value = n.value.filter((z) => z.id !== B.id), o.value = Math.max(0, o.value - 1), new Error(W.error);
    await h();
    const N = (k = W.value) == null ? void 0 : k.id;
    N && !n.value.some((z) => z.id === N) && (n.value = [...n.value, { ...B, id: N }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return me(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function _y(e, t) {
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
const Cy = {
  class: "document-tab",
  "data-document-revisions": ""
}, Ey = ["datetime"], Ay = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Oy = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Ty = {
  key: 2,
  class: "document-none"
}, Iy = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), o = A(""), l = C(() => s.value ? _y(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", Cy, [
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
      })) : w("", !0),
      e.revisions.length ? (u(), f(P, { key: 1 }, [
        (u(!0), f(P, null, ae(e.revisions, (h) => (u(), F(ge, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: j(() => [
            K("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, Ey)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", Ay, v(o.value), 1)) : w("", !0),
        s.value ? (u(), f(P, { key: 1 }, [
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
          m("div", Oy, [
            (u(!0), f(P, null, ae(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: V(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : w("", !0)
      ], 64)) : (u(), f("p", Ty, "No revisions"))
    ]));
  }
}, By = /* @__PURE__ */ U(Iy, [["__scopeId", "data-v-3a381aa4"]]), Ry = "button, [data-comment-number]", Ly = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Ui(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Ry) || n.push(t.currentNode);
  return n;
}
function Go(e, t, n) {
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
const Ny = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function qy(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Ui(e), s = a.map((c) => c.data).join(""), o = Go(a, n.startContainer, n.startOffset), l = s.slice(o, Go(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: Ny(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function Dy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function Py(e, t, n) {
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
function jy({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function Fy(e, t) {
  const n = Ui(e), a = Dy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = Py(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(jy).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(La(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(La(t.number, t.id, t.label)) : l.at(-1).append(La(t.number, t.id, t.label))), !0;
}
function Wy(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !Fy(e, a) && a.id && n.push(a.id);
  return n;
}
const Hy = (e) => e.closest(Ly) ?? e;
function Vo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const zy = {
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
    const a = e, s = n, o = A(null), l = A(null), i = A(null), r = A(!1), c = A(null);
    function d() {
      if (!l.value || r.value) return;
      l.value.innerHTML = a.html;
      const E = a.comments.filter((W) => W.quote).map((W) => ({ ...W, label: a.annotationLabel, hot: W.id === a.hot })), S = Wy(l.value, a.pending ? [...E, { ...a.pending, pending: !0 }] : E);
      s("lost", S);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const B = document.createElement("div");
      B.className = "inline-comment", Hy(x).after(B), c.value = B;
    }
    function h() {
      if (!l.value) return;
      const E = qy(l.value);
      if (r.value = !!E, !E) {
        i.value = null;
        return;
      }
      const S = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(S.left - x.left, 0)}px`, top: `${S.top - x.top + o.value.scrollTop}px` }, s("select", E);
    }
    function p(E) {
      const S = E.target.closest("[data-comment-number]");
      S ? s("number", Number(S.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(E) {
      var S;
      (S = l.value.querySelector(`[data-comment="${E}"]`)) == null || S.scrollIntoView({ block: "center" });
    }
    function b(E) {
      var S;
      (S = l.value.querySelectorAll("h3, h4, h5, h6")[E]) == null || S.scrollIntoView({ block: "start" });
    }
    return me(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), Me(() => {
      d(), document.addEventListener("selectionchange", h);
    }), et(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: je }), (E, S) => (u(), f("div", {
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
      ], 36)) : w("", !0),
      c.value ? (u(), F(da, {
        key: 1,
        to: c.value
      }, [
        fe(E.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : w("", !0),
      fe(E.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Uy = /* @__PURE__ */ U(zy, [["__scopeId", "data-v-548d0aaa"]]), Gy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, Vy = { class: "document-tabs" }, Ky = { class: "document-body" }, Yy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Qy = {
  key: 1,
  class: "document-loading"
}, Xy = {
  class: "document-details",
  "data-resource-fields": ""
}, Jy = 760, Zy = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = Ag(n), s = C(() => a.value !== null && a.value < Jy), o = A(null), l = A(""), i = A([]), r = A([]), c = A(""), d = A("comments"), h = A("text"), p = A(0), y = A(0), b = A([]), E = A(null), S = A(""), x = A(!1), B = A(null), W = A(null);
    let N = 0;
    const k = zi(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (oe) => t.read(oe)), z = C(() => Vo(k.comments.value)), D = C(() => d.value === "questions" ? Vo(r.value) : z.value), q = C(() => d.value === "questions" ? D.value.length : k.total.value), M = C(() => {
      var oe;
      return (oe = o.value) != null && oe.body ? zs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), O = C(() => {
      var oe;
      return (((oe = o.value) == null ? void 0 : oe.body) ?? "").split(`
`).filter((ee) => /^#{1,4} /.test(ee)).map((ee, ne) => ({ key: String(ne), value: ne, label: ee.replace(/^#+ /, "") }));
    }), $ = C(() => z.value.find((oe) => oe.id === y.value)), g = C(() => {
      var oe;
      return (oe = o.value) != null && oe.close_reason ? "Closed" : "Open";
    }), _ = C(() => h.value === "comments" && !s.value ? "text" : h.value), I = (oe) => oe.ok ? oe.value.rows ?? [] : [];
    async function R() {
      const oe = ++N, ee = await t.read([t.noun, "inspect", String(t.id)]);
      if (oe !== N) return;
      l.value = ee.ok ? "" : ee.error, o.value = ee.ok ? ee.value : null;
      const ne = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), De = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      oe === N && (r.value = I(ne), c.value = ne.ok ? "" : ne.error, i.value = De ? I(De) : []);
    }
    async function H(oe) {
      const ee = E.value ? ["--quote", E.value.quote, "--position", String(E.value.position), "--selection-type", E.value.selection_type] : [], ne = await t.read([t.noun, "comment", String(t.id), ...ee, "--", oe]);
      if (!ne.ok) throw new Error(ne.error);
      E.value = null, await Promise.all([R(), k.load()]);
    }
    async function Q() {
      const oe = await t.read(["doc", "close", String(t.id)]);
      l.value = oe.ok ? "" : oe.error, oe.ok && await R();
    }
    function te() {
      S.value.trim() || (E.value = null);
    }
    function le(oe) {
      var ee;
      if (p.value = oe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === oe ? 0 : oe : (ee = n.value.querySelector(d.value === "questions" ? `[data-question-id="${oe}"]` : `[data-comment-id="${oe}"]`)) == null || ee.scrollIntoView({ block: "nearest" });
    }
    async function pe(oe) {
      var ee, ne;
      h.value = "text", p.value = oe, await ((ee = B.value) == null ? void 0 : ee.nextTick()), (ne = B.value) == null || ne.show(oe);
    }
    function xe() {
      x.value = !1, R();
    }
    return me(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, E.value = null, r.value = [], c.value = "", R();
    }, { immediate: !0 }), me(d, () => {
      p.value = 0, y.value = 0;
    }), (oe, ee) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", Gy, [
        T(ge, {
          bordered: "",
          "data-text-edit": "",
          onClick: ee[0] || (ee[0] = (ne) => x.value = !0)
        }, {
          default: j(() => [...ee[14] || (ee[14] = [
            K("Edit", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      m("nav", Vy, [
        m("button", {
          type: "button",
          class: V(["document-tab-button", { on: _.value === "text" }]),
          "data-document-tab": "text",
          onClick: ee[1] || (ee[1] = (ne) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: V(["document-tab-button", { on: _.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: ee[2] || (ee[2] = (ne) => h.value = "comments")
        }, [
          K(v(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(q.value || ""), 1)
        ], 2)) : w("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: V(["document-tab-button", { on: _.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: ee[3] || (ee[3] = (ne) => h.value = "revisions")
        }, [
          ee[15] || (ee[15] = K("Revisions ", -1)),
          m("em", null, v(i.value.length || ""), 1)
        ], 2)) : w("", !0),
        ee[16] || (ee[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        _.value === "text" && O.value.length > 1 ? (u(), F(qi, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: O.value,
          "data-text-chapters": "",
          onPick: ee[4] || (ee[4] = (ne) => {
            var De;
            return (De = B.value) == null ? void 0 : De.showHeading(ne.value);
          })
        }, null, 8, ["label", "items"])) : w("", !0)
      ]),
      m("div", Ky, [
        l.value ? (u(), f("p", Yy, v(l.value), 1)) : o.value ? _.value === "revisions" ? (u(), F(By, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: Q,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : _.value === "comments" ? (u(), F(Uo, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": ee[5] || (ee[5] = (ne) => d.value = ne),
          tab: "",
          comments: z.value,
          questions: r.value,
          hot: p.value,
          lost: b.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!L(k).nextPage.value,
          "comment-loading": L(k).loading.value,
          "comment-failure": L(k).failure.value,
          "comment-total": L(k).total.value,
          onMore: L(k).loadMore,
          onShow: pe,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(P, { key: 4 }, [
          T(Uy, {
            ref_key: "words",
            ref: B,
            html: M.value,
            comments: D.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: E.value,
            inline: y.value,
            onSelect: ee[7] || (ee[7] = (ne) => E.value = ne),
            onClear: te,
            onNumber: le,
            onWrite: ee[8] || (ee[8] = (ne) => {
              var De;
              return (De = W.value) == null ? void 0 : De.focus();
            }),
            onLost: ee[9] || (ee[9] = (ne) => b.value = ne)
          }, {
            inline: j(() => [
              $.value ? (u(), F(Di, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: ee[6] || (ee[6] = (ne) => pe($.value.id))
              }, null, 8, ["comment"])) : w("", !0)
            ]),
            default: j(() => [
              m("dl", Xy, [
                ee[18] || (ee[18] = m("h4", null, "Details", -1)),
                ee[19] || (ee[19] = m("dt", null, "State", -1)),
                m("dd", null, v(g.value), 1),
                o.value.close_reason ? (u(), f(P, { key: 0 }, [
                  ee[17] || (ee[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(o.value.close_reason), 1)
                ], 64)) : w("", !0),
                ee[20] || (ee[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  T(Ze, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                ee[21] || (ee[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  T(Ze, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? w("", !0) : (u(), F(Uo, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": ee[10] || (ee[10] = (ne) => d.value = ne),
            comments: z.value,
            questions: r.value,
            hot: p.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!L(k).nextPage.value,
            "comment-loading": L(k).loading.value,
            "comment-failure": L(k).failure.value,
            "comment-total": L(k).total.value,
            onMore: L(k).loadMore,
            onShow: pe,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", Qy, [
          T(Ke)
        ]))
      ]),
      o.value ? (u(), F(Hg, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: S.value,
        "onUpdate:draft": ee[11] || (ee[11] = (ne) => S.value = ne),
        selection: E.value,
        send: H,
        narrow: s.value,
        onClear: ee[12] || (ee[12] = (ne) => E.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : w("", !0),
      x.value ? (u(), F(My, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: ee[13] || (ee[13] = (ne) => x.value = !1),
        onSaved: xe
      }, null, 8, ["noun", "id", "row", "read"])) : w("", !0)
    ], 512));
  }
}, HS = /* @__PURE__ */ U(Zy, [["__scopeId", "data-v-784faf41"]]), e0 = {
  key: 1,
  class: "row-list-failure"
}, t0 = ["data-row"], n0 = {
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
    const t = e, n = C(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", "data-row-list-moves": "" } : {}), a = A(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), F(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", e0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), F(ln, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        K(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(P, { key: 3 }, [
      (u(), F(rt(e.arrival || e.moves ? Os : "ul"), Pe(n.value, { class: "row-list" }), {
        default: j(() => [
          (u(!0), f(P, null, ae(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            fe(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, t0))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : w("", !0)
    ], 64));
  }
}, a0 = /* @__PURE__ */ U(n0, [["__scopeId", "data-v-059675a8"]]), s0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, o0 = {
  key: 1,
  class: "agent-rows-note"
}, l0 = {
  key: 2,
  class: "agent-rows-note"
}, i0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, r0 = ["data-agent-row", "onClick"], u0 = { class: "agent-row-name" }, c0 = { class: "agent-row-state" }, d0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = C(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", s0, [
      e.loaded ? e.failure ? (u(), f("p", o0, v(e.failure), 1)) : e.rows.length ? (u(), f(P, { key: 3 }, [
        m("p", i0, v(a.value) + " running", 1),
        (u(!0), f(P, null, ae(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => L(qe)(`agents:${l.id}`)
        }, [
          m("span", u0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", c0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, r0))), 128))
      ], 64)) : (u(), f("p", l0, v(e.none), 1)) : (u(), F(Ke, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, zS = /* @__PURE__ */ U(d0, [["__scopeId", "data-v-a01e5a17"]]), dt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ue = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, f0 = 6;
function Qs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const h0 = (e) => {
  const t = Qs(e, dt.lineChars), n = Math.max(dt.minWidth, Math.max(...t.map((a) => a.length)) * dt.charWidth + dt.padX * 2);
  return { name: e, lines: t, line: dt.line, padY: dt.padY, width: n, height: t.length * dt.line + dt.padY * 2 };
};
function m0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function p0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function g0(e, t, n) {
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
  for (let l = 0; l < f0; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function v0(e, t) {
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
function y0(e) {
  const t = [...new Set(e.flatMap(([N, k]) => [N, k]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = m0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, k) => !s.has(k)), l = p0(t, o), i = g0(t, o, l), r = new Map(t.map((N) => [N, h0(N)])), c = i.map((N) => N.reduce((k, z) => k + r.get(z).width, 0) + He.across * (N.length - 1)), d = Math.max(...c) + He.margin * 2, h = k0(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = He.margin;
  i.forEach((N, k) => {
    let z = (d - c[k]) / 2;
    const D = Math.max(...N.map((q) => r.get(q).height));
    N.forEach((q) => {
      const M = r.get(q);
      p.set(q, { ...M, x: z, y: y + (D - M.height) / 2 }), z += M.width + He.across;
    }), y += D + (h[k] ?? He.down);
  });
  const b = e.map(([N, k, z], D) => ({ from: N, to: k, label: z || "", back: s.has(D) || l.get(k) <= l.get(N) }));
  v0(b, p);
  const E = b.map((N) => w0(N, p.get(N.from), p.get(N.to))), S = [...p.values()], x = M0(E, S), B = Math.max(y - He.down, ...x.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(d - He.margin, ...x.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + He.margin, height: B + He.margin, nodes: S, arrows: x };
}
const b0 = (e) => e ? Qs(e, Ue.lineChars).length * Ue.line + Ue.pad * 2 : 0;
function k0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += b0(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function w0(e, t, n) {
  const a = e.label ? Qs(e.label, Ue.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ue.charWidth + Ue.pad * 2 : 0, o = a.length * Ue.line + (a.length ? Ue.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const $0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, x0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], S0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ue.line);
function M0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = $0(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = S0.flatMap((r) => x0.map((c) => s(c, r))).find((r) => !n.some((c) => Ko(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => Ko(i, r)); ) i.y += Ue.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ue.line, pad: Ue.pad } };
  });
}
const Ko = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, _0 = { class: "flowchart-tools" }, C0 = ["width", "height", "viewBox", "aria-label"], E0 = ["d"], A0 = ["x", "y", "width", "height"], O0 = ["x", "y"], T0 = ["x", "dy"], I0 = {
  key: 0,
  class: "flowchart-label"
}, B0 = ["x", "y", "width", "height"], R0 = ["x", "y"], L0 = ["x", "dy"], N0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => y0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = A(null), i = A({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var x;
      const E = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(E != null && E.width)) return;
      const S = Math.min(E.width / s.value.width, E.height / s.value.height, 1.5);
      i.value = { zoom: S, x: (E.width - s.value.width * S) / 2, y: (E.height - s.value.height * S) / 2 };
    }
    function d(E, S, x) {
      const { zoom: B, x: W, y: N } = i.value, k = Math.min(o.most, Math.max(o.least, B * E));
      i.value = { zoom: k, x: S - (S - W) * k / B, y: x - (x - N) * k / B };
    }
    function h(E) {
      const S = l.value.getBoundingClientRect();
      d(E, S.width / 2, S.height / 2);
    }
    function p(E) {
      const S = l.value.getBoundingClientRect();
      E.ctrlKey || E.metaKey ? d(E.deltaY < 0 ? o.step : 1 / o.step, E.clientX - S.left, E.clientY - S.top) : i.value = { ...i.value, x: i.value.x - E.deltaX, y: i.value.y - E.deltaY };
    }
    function y(E) {
      var S, x, B;
      E.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), r = { x: E.clientX - i.value.x, y: E.clientY - i.value.y }, (B = (x = l.value).setPointerCapture) == null || B.call(x, E.pointerId);
    }
    function b(E) {
      r && (i.value = { ...i.value, x: E.clientX - r.x, y: E.clientY - r.y });
    }
    return Me(c), (E, S) => (u(), F(pa, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (x) => a("close"))
    }, {
      default: j(() => [
        m("div", _0, [
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
          onPointerup: S[2] || (S[2] = (x) => po(r) ? r.value = null : r = null),
          onPointercancel: S[3] || (S[3] = (x) => po(r) ? r.value = null : r = null)
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
            (u(!0), f(P, null, ae(s.value.arrows, (x, B) => (u(), f("path", {
              key: `arrow-${B}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, E0))), 128)),
            (u(!0), f(P, null, ae(s.value.nodes, (x) => (u(), f("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, A0),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (u(!0), f(P, null, ae(x.lines, (B, W) => (u(), f("tspan", {
                  key: W,
                  x: x.x + x.width / 2,
                  dy: W ? x.line : 0
                }, v(B), 9, T0))), 128))
              ], 8, O0)
            ]))), 128)),
            (u(!0), f(P, null, ae(s.value.arrows, (x, B) => (u(), f(P, {
              key: `label-${B}`
            }, [
              x.label ? (u(), f("g", I0, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, B0),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (u(!0), f(P, null, ae(x.label.lines, (W, N) => (u(), f("tspan", {
                    key: N,
                    x: x.label.x + x.label.width / 2,
                    dy: N ? x.label.line : 0
                  }, v(W), 9, L0))), 128))
                ], 8, R0)
              ])) : w("", !0)
            ], 64))), 128))
          ], 12, C0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, q0 = /* @__PURE__ */ U(N0, [["__scopeId", "data-v-51d24cfe"]]), D0 = ["innerHTML"], P0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => xo[t.name] || xo.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, D0));
  }
}, Ct = /* @__PURE__ */ U(P0, [["__scopeId", "data-v-beb5935c"]]), j0 = {
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
}, Vt = /* @__PURE__ */ U(j0, [["__scopeId", "data-v-d03899bb"]]), F0 = ["data-tip", "aria-label"], W0 = {
  key: 0,
  class: "mact-word"
}, H0 = {
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
      e.open ? (u(), f("span", W0, v(e.label), 1)) : w("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, F0));
  }
}, Gi = /* @__PURE__ */ U(H0, [["__scopeId", "data-v-3b292e09"]]), Vi = 120, Hn = 280, Ki = 160, z0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, U0 = ["leaving", "resizing", "entering"];
function ys(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function G0(e) {
  const t = U0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ys(e);
  return e.classList.add(...t), n;
}
function Yi(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = A(t()), s = A("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, p) {
    i(h);
    const y = G0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, r(h, ys(h)));
    });
    return b.observe(p), b;
  }
  async function d(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || z0()) {
      a.value = h;
      return;
    }
    const b = ys(p);
    if (l(p, b), s.value = "leaving", await n(Vi), y !== o) return;
    a.value = h, s.value = "resizing", await je(), r(p, b);
    const E = c(p);
    await n(Hn), E == null || E.disconnect(), y === o && (i(p), s.value = "entering", await n(Ki), y === o && (s.value = ""));
  }
  return me(t, (h) => d(h)), et(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const V0 = { class: "growing-card-top" }, K0 = ["aria-expanded"], Y0 = { class: "growing-card-avatar" }, Q0 = { class: "growing-card-title" }, X0 = { class: "growing-card-more" }, J0 = { class: "growing-card-body" }, Z0 = {
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
    const n = e, a = t, s = A(!1), o = A(null), { folded: l, phase: i } = Yi(o, () => !s.value), r = C(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = C(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: V(["growing-card-wrap", L(i), { open: !L(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", V0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", Y0, [
            e.bad ? (u(), F(Ct, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(P, { key: 1 }, [
              K(v(r.value), 1)
            ], 64)) : (u(), F(re, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", Q0, v(e.title), 1),
          T(Vt, { open: s.value }, null, 8, ["open"])
        ], 8, K0),
        e.action ? (u(), F(Gi, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : w("", !0),
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
        ])) : w("", !0)
      ]),
      m("div", X0, [
        m("div", J0, [
          (u(!0), f(P, null, ae(c.value, (p, y) => (u(), f("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, eb = /* @__PURE__ */ U(Z0, [["__scopeId", "data-v-f2b4930d"]]), tb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, nb = { class: "md inline" }, ab = ["disabled", "title", "onClick"], sb = {
  key: 1,
  class: "message-links-many"
}, ob = ["aria-expanded"], lb = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, ib = ["disabled", "onClick"], rb = { class: "row-pill message-links-chip" }, ub = { class: "message-links-title" }, cb = { key: 0 }, Na = 3, db = "task", fb = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => n.total || n.links.length), o = C(() => n.links.every((p) => p.endpoint.model === db) ? "tasks" : "items"), l = A(!1), i = A(null);
    Yl(i, () => l.value = !1);
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
      e.links.length ? (u(), f("span", tb, [
        m("span", nb, [
          y[1] || (y[1] = K("Linked: ", -1)),
          (u(!0), f(P, null, ae(e.links, (b) => (u(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (E) => h(b)
          }, [
            K(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            d(b) ? (u(), f(P, { key: 0 }, [
              K(" (" + v(d(b)) + ")", 1)
            ], 64)) : w("", !0),
            c(b) ? (u(), f(P, { key: 1 }, [
              K(" (unavailable)")
            ], 64)) : w("", !0)
          ], 8, ab))), 128))
        ])
      ])) : w("", !0),
      s.value >= Na ? (u(), f("span", sb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          K(v(s.value) + " linked " + v(o.value) + " ", 1),
          T(Vt, { open: l.value }, null, 8, ["open"])
        ], 8, ob)
      ])) : w("", !0),
      l.value ? (u(), f("div", lb, [
        (u(!0), f(P, null, ae(e.links, (b) => (u(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (E) => h(b)
        }, [
          m("span", rb, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          m("span", ub, v(b.endpoint.title), 1),
          m("span", null, v(d(b)), 1),
          c(b) ? (u(), f("span", cb, "Unavailable")) : w("", !0)
        ], 8, ib))), 128))
      ])) : w("", !0),
      T(vn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, hb = /* @__PURE__ */ U(fb, [["__scopeId", "data-v-e9bc783c"]]), mb = ["title", "aria-label"], pb = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, gb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, vb = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = C(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), f("span", {
      class: V(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), f("svg", pb, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", gb)) : w("", !0)
      ]))
    ], 10, mb));
  }
}, yb = /* @__PURE__ */ U(vb, [["__scopeId", "data-v-6dc92808"]]), bb = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, kb = (e) => e.worker_id != null ? "report" : "message", wb = (e) => bb[kb(e)], $b = "img,pre,table";
function xb(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Sb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Mb(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector($b)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = xb(Sb(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function _b(e, t) {
  let n = null;
  const a = () => e.value && Mb(e.value);
  Me(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const Cb = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Eb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Ln = /* @__PURE__ */ new WeakMap(), Be = "work", Qe = "sent", Ab = 50, Yo = 50, Qo = () => ({ rows: A([]), total: A(0), next: A(null), loading: A(!1), failure: A(""), version: 0 });
function Ob(e) {
  var E;
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
    const k = S[x];
    if (t.get(S.id) !== S || k.version !== B) return;
    if (k.loading.value = !1, !N.ok) {
      k.failure.value = N.error;
      return;
    }
    const z = x === Be ? N.value.counterparts ?? [] : N.value.rows ?? [], D = W === 1 ? z : [...k.rows.value, ...z], q = x === Be ? (M) => `${M.endpoint.model}:${M.endpoint.id}` : (M) => M.id ?? M.target_id;
    k.rows.value = [...new Map(D.map((M) => [q(M), M])).values()], k.total.value = N.value.total ?? k.rows.value.length, k.next.value = N.value.next_page ?? null;
  }
  function i(S, x, B, W) {
    const N = S[x];
    N.version === B && (N.failure.value = W.message, N.loading.value = !1);
  }
  async function r(S, x, B) {
    const W = o(S, x), N = x === Be ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(S, x, W, B, await e.read(`link list --source message:${S.id} ${N} --page ${B} --page-size ${x === Be ? 10 : 25}`));
    } catch (k) {
      i(S, x, W, k);
    }
  }
  async function c(S) {
    const x = S.map((B) => ({ [Be]: o(B, Be), [Qe]: o(B, Qe) }));
    try {
      const B = await e.read(`link receipts --messages ${S.map((W) => W.id).join(",")}`);
      S.forEach((W, N) => {
        const k = B.ok ? B.value.messages[String(W.id)] : null;
        l(W, Be, x[N][Be], 1, B.ok ? { ok: !0, value: k.named } : B), l(W, Qe, x[N][Qe], 1, B.ok ? { ok: !0, value: k.sent } : B);
      });
    } catch (B) {
      S.forEach((W, N) => [Be, Qe].forEach((k) => i(W, k, x[N][k], B)));
    }
  }
  function d() {
    a = null;
    const S = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), S.forEach((x) => x.dirty.clear());
    for (let x = 0; x < S.length; x += Yo) c(S.slice(x, x + Yo));
  }
  function h(S, x = [Be, Qe]) {
    for (const B of x) S.dirty.add(B);
    s(S) && (n.add(S.id), a ?? (a = setTimeout(d, 0)));
  }
  function p(S) {
    const x = S.sources ?? (S.source_model && Number.isInteger(S.source_id) ? [{ model: S.source_model, id: S.source_id }] : []), B = S.link_types ?? (S.link_type ? [S.link_type] : []), W = B.length ? [Be, Qe].filter((k) => k === Be ? B.some((z) => ["about", "edited"].includes(z)) : B.includes("sent_to")) : [Be, Qe];
    if (!W.length) return;
    const N = x.length ? [...new Set(x.filter((k) => k.model === "message").map((k) => k.id))].map((k) => t.get(k)).filter(Boolean) : [...t.values()].filter(s).slice(0, Ab);
    for (const k of N) h(k, W);
  }
  const y = (E = e.follow) == null ? void 0 : E.call(e, ["link.*"], p), b = {
    attach(S, x) {
      let B = t.get(S);
      return B || (B = { id: S, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Be, Qe]), work: Qo(), sent: Qo() }, t.set(S, B)), B.views.add(x), B.dirty.size && h(B, [...B.dirty]), B;
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
function Tb(e, t, n) {
  const a = Xe(null);
  let s = null;
  const o = me(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Ob(e);
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Be),
    loadSent: () => s == null ? void 0 : s.more(a.value, Qe)
  };
}
const Ib = ["data-incoming", "data-ref"], Bb = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Rb = { class: "message-body" }, Lb = ["title"], Nb = ["innerHTML"], qb = ["title"], Db = ["innerHTML"], Pb = {
  class: "message-faces",
  "data-message-faces": ""
}, jb = ["title", "data-face", "onClick"], Fb = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Wb = ["title", "data-reaction", "onClick"], Hb = {
  key: 0,
  class: "message-reaction-count"
}, zb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Ub = ["href", "title"], Gb = ["src", "alt"], Vb = ["href"], Kb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Yb = ["disabled", "data-sent-worker", "title", "onClick"], Qb = { class: "message-foot" }, Xb = { class: "message-time" }, Jb = {
  class: "message-id",
  "data-message-id": ""
}, Zb = 1500, ek = "An earlier message", tk = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = A(null), l = C(() => ["user", "comment"].includes(n.message.type)), i = C(() => {
      const [oe, ee] = (n.message.commented_row || ":").split(":"), ne = pt(oe);
      return ne ? { ref: `${ne}:${ee}`, label: `${Gt(ne).title.toLowerCase()} ${ee}` } : null;
    }), r = C(() => n.message.worker_id ?? null), c = C(() => wb(n.message)), d = C(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var oe;
      await ((oe = navigator.clipboard) == null ? void 0 : oe.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Zb);
    }
    const p = xi(), y = C(() => p(n.message.text ?? "")), b = C(() => JSON.parse(n.message.flowchart_edges || "[]")), E = A(!1), S = C(() => p(n.quote || ek));
    function x() {
      const oe = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      oe ? oe.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    _b(o, () => `${n.message.text} ${n.quote}`);
    const B = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (oe) => `/api/files/message/${n.message.id}/${encodeURIComponent(oe)}`, N = C(() => JSON.parse(n.message.captions || "{}")), k = C(() => (n.message.files ?? []).map((oe) => ({ name: oe, address: W(oe), isImage: B.test(oe), title: N.value[oe] || oe }))), z = C(() => Ii(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), D = Se(Le, null), { links: q, total: M, more: O, loading: $, failure: g, sentTo: _, sentMore: I, sentLoading: R, sentFailure: H, loadMore: Q, loadSent: te } = Tb(D, () => l.value && !n.message.local ? n.message.id : null, o), le = A(!1), pe = C(() => Eb(n.message.reactions));
    function xe(oe) {
      le.value = !1, a("react", n.message, oe);
    }
    return (oe, ee) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      T(eb, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (ne) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Ib)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Rb, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: V(["message-card", "md", { comment: i.value }]),
          onClick: ee[5] || (ee[5] = (...ne) => L(Nt) && L(Nt)(...ne))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = $e((ne) => L(qe)(i.value.ref), ["stop"]))
          }, [
            T(re, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Lb)) : w("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(x, ["stop"]),
            innerHTML: S.value
          }, null, 8, Nb)) : w("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: ee[2] || (ee[2] = $e((ne) => L(qe)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + v(r.value), 9, qb)) : w("", !0),
          T(vi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: j(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Db)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (u(), f(P, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[3] || (ee[3] = (ne) => E.value = !0)
            }, "Open the flowchart"),
            E.value ? (u(), F(q0, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: ee[4] || (ee[4] = (ne) => E.value = !1)
            }, null, 8, ["title", "edges"])) : w("", !0)
          ], 64)) : w("", !0)
        ], 2),
        m("div", {
          class: V(["message-tools", { picking: le.value }]),
          "data-message-tools": ""
        }, [
          le.value ? (u(), f(P, { key: 0 }, [
            m("div", Pb, [
              (u(!0), f(P, null, ae(L(Cb), (ne) => (u(), f("button", {
                key: ne,
                type: "button",
                class: "message-face",
                title: `React ${ne}`,
                "data-face": ne,
                onClick: (De) => xe(ne)
              }, v(ne), 9, jb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[6] || (ee[6] = (ne) => le.value = !1)
            }, [
              T(re, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), f(P, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ee[7] || (ee[7] = (ne) => le.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ee[8] || (ee[8] = (ne) => a("reply", e.message))
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
              onClick: ee[9] || (ee[9] = (ne) => a("delete", e.message))
            }, "Delete")) : w("", !0)
          ], 64))
        ], 2)
      ]),
      pe.value.length ? (u(), f("div", Fb, [
        (u(!0), f(P, null, ae(pe.value, (ne) => (u(), f("button", {
          key: ne.emoji,
          type: "button",
          class: V(["message-reaction", { mine: ne.mine }]),
          title: ne.title,
          "data-reaction": ne.emoji,
          onClick: (De) => a("react", e.message, ne.emoji)
        }, [
          K(v(ne.emoji) + " ", 1),
          ne.count > 1 ? (u(), f("span", Hb, v(ne.count), 1)) : w("", !0)
        ], 10, Wb))), 128))
      ])) : w("", !0),
      k.value.length ? (u(), f("div", zb, [
        (u(!0), f(P, null, ae(k.value, (ne) => (u(), f(P, {
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
            }, null, 8, Gb)
          ], 8, Ub)) : (u(), f("a", {
            key: 1,
            href: ne.address,
            target: "_blank",
            class: "message-file"
          }, v(ne.name), 9, Vb))
        ], 64))), 128))
      ])) : w("", !0),
      L(_).length ? (u(), f("div", Kb, [
        T(re, {
          name: "send",
          size: 12
        }),
        (u(!0), f(P, null, ae(L(_), (ne) => (u(), f("button", {
          key: ne.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ne.unavailable || !ne.open_ref,
          "data-sent-worker": ne.id,
          title: `Open worker ${ne.id}`,
          onClick: $e((De) => ne.open_ref && L(qe)(ne.open_ref), ["stop"])
        }, [
          K("Also sent to worker " + v(ne.id), 1),
          ne.unavailable ? (u(), f(P, { key: 0 }, [
            K(" (unavailable)")
          ], 64)) : w("", !0)
        ], 8, Yb))), 128))
      ])) : w("", !0),
      T(vn, {
        more: L(I),
        loading: L(R),
        failure: L(H),
        label: "More recipients",
        onMore: L(te)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Qb, [
        m("time", Xb, v(z.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(P, { key: 0 }, [
          ee[10] || (ee[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Jb, "message " + v(e.message.id), 1)
        ], 64)) : w("", !0),
        l.value ? (u(), F(yb, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : w("", !0)
      ]),
      L(q).length || L(g) ? (u(), F(hb, {
        key: 3,
        links: L(q),
        total: L(M),
        more: L(O),
        loading: L($),
        failure: L(g),
        onMore: L(Q)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : w("", !0)
    ], 8, Bb));
  }
}, US = /* @__PURE__ */ U(tk, [["__scopeId", "data-v-d064e828"]]), na = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], qa = 200, Qi = (e) => {
  var t;
  return ((t = na.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? na[0].key;
}, GS = (e) => {
  var t;
  return ((t = na.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, nk = ["aria-label"], ak = 300, Xo = 400, sk = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: qa } },
  setup(e) {
    const t = e, n = C(() => Qi(t.value)), a = C(() => n.value < qa ? [1, 0.25, 0.25] : n.value === qa ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: V(["ico", "prio", { hot: n.value >= Xo, high: n.value >= ak && n.value < Xo }]),
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
    ], 10, nk));
  }
}, VS = /* @__PURE__ */ U(sk, [["__scopeId", "data-v-b10e610f"]]), Xi = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], KS = (e) => {
  const t = Xi[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, ok = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Jo = (e) => ok[e.card.state] || "idle", lk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Zo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, el = (e, t) => Zo[Jo(e)] - Zo[Jo(t)], tl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, YS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => el(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || lk(a, s)) : [...e].sort((a, s) => el(a, s) || (tl[t] || tl.state)(a, s)), ik = { class: "list-row" }, rk = {
  key: 0,
  class: "list-row-type"
}, uk = { class: "list-row-main" }, ck = {
  key: 0,
  class: "list-row-title"
}, dk = { class: "list-row-body" }, fk = {
  key: 1,
  class: "list-row-end"
}, hk = {
  key: 1,
  class: "list-row-text"
}, mk = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", ik, [
      e.type ? (u(), f("span", rk, v(e.type), 1)) : w("", !0),
      m("div", uk, [
        e.title ? (u(), f("span", ck, v(e.title), 1)) : w("", !0),
        m("div", dk, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", fk, [
          fe(t.$slots, "end", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      e.text ? (u(), f("span", hk, v(e.text), 1)) : w("", !0)
    ]));
  }
}, QS = /* @__PURE__ */ U(mk, [["__scopeId", "data-v-dfc8c3a7"]]), XS = {
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
    return (l, i) => (u(), F(qi, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, pk = {
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
}, Ji = /* @__PURE__ */ U(pk, [["__scopeId", "data-v-978e0921"]]), gk = ["aria-label"], vk = { class: "head" }, yk = { class: "names" }, bk = { class: "body" }, kk = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = li(a, n), i = ii(s);
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
              e.title ? (u(), f(P, { key: 0 }, [
                m("header", vk, [
                  m("div", yk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (u(), F(st, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : w("", !0)
                  ]),
                  fe(r.$slots, "actions", {}, void 0, !0),
                  T(ma, {
                    title: e.closeLabel,
                    onClick: L(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), F(Ji, { key: 0 }, {
                  default: j(() => [
                    fe(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : w("", !0),
                m("div", bk, [
                  fe(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : fe(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, gk)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, JS = /* @__PURE__ */ U(kk, [["__scopeId", "data-v-f276f055"]]), wk = {
  key: 1,
  class: "text-field-label"
}, $k = {
  key: 2,
  class: "text-field-end"
}, xk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Pt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = on(e, "modelValue"), a = ca(), s = "onUpdate:modelValue" in (((d = eu()) == null ? void 0 : d.vnode.props) || {}), o = C(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = C(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = C(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = A(null);
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
      }, null, 8, ["name"])) : w("", !0),
      e.label ? (u(), f("span", wk, v(e.label), 1)) : w("", !0),
      Je(m("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [L(cs), o.value]
      ]),
      h.$slots.end ? (u(), f("span", $k, [
        fe(h.$slots, "end", {}, void 0, !0)
      ])) : w("", !0)
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
}), ZS = /* @__PURE__ */ U(xk, [["__scopeId", "data-v-d9c38ca8"]]), Sk = { class: "title" }, Mk = { class: "state" }, _k = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ss(t.line, t.events);
    return (o, l) => (u(), F(a0, {
      rows: L(n),
      failure: L(a),
      loaded: L(s),
      empty: e.empty
    }, {
      default: j(({ row: i }) => [
        m("span", Sk, v(i.title), 1),
        m("span", Mk, v(L(rn)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, e6 = /* @__PURE__ */ U(_k, [["__scopeId", "data-v-9191a6f0"]]);
function Ck(e = 1e3, t = null) {
  const n = A(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Ie(() => clearInterval(a)), n;
}
const Da = A(Date.now() / 1e3);
let nl = 0, Nn = 0;
function Xs() {
  return Nn || (Da.value = Date.now() / 1e3, nl = setInterval(() => Da.value = Date.now() / 1e3, 1e3)), Nn += 1, Rl() && fa(() => {
    Nn -= 1, Nn || clearInterval(nl);
  }), Da;
}
const Ek = 200, Ak = Vi + Hn + Ki + Ek;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Ok(e, t, n) {
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
function Tk(e, t, n, a) {
  me(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(Ok(o, l, n.value)), performance.now() - l < Ak) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const Ik = ["title", "data-figure-mark", "data-folded", "data-open"], Bk = {
  key: 2,
  class: "worker"
}, Rk = { class: "head" }, Lk = { key: 0 }, Nk = {
  key: 3,
  class: "status"
}, qk = {
  key: 0,
  class: "figure"
}, Dk = {
  key: 1,
  class: "ran-for"
}, Pk = { key: 2 }, jk = {
  key: 3,
  class: "news"
}, Fk = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Wk = {
  key: 6,
  class: "settled"
}, Hk = {
  key: 1,
  class: "bar"
}, zk = {
  key: 3,
  class: "detail body"
}, Uk = {
  key: 0,
  class: "body-label"
}, Gk = ["title"], Vk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ca(), a = ["onClick", "onAct"], s = C(() => Object.fromEntries(Object.entries(n).filter(([le]) => !a.includes(le)))), o = A(!1), l = C(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = C(() => t.open !== void 0), r = C(() => i.value || l.value), c = C(() => i.value ? t.open : o.value), d = C(() => i.value ? !t.open : l.value && !o.value), h = C(() => !!(t.mark.action && n.onAct)), p = C(() => r.value || h.value || !!n.onClick), y = A(null), b = A(null), { folded: E, phase: S } = Yi(y, () => d.value);
    Tk(y, d, S, Se(Le, null));
    function x(le) {
      var pe, xe;
      if (!(le.target !== y.value && !b.value.contains(le.target))) {
        if (i.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, le);
        if (l.value) return void (o.value = !o.value);
        (xe = n.onAct || n.onClick) == null || xe(le);
      }
    }
    const B = (le) => n.onAct(le), W = ["failed", "unfinished"], N = C(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? W.includes(t.mark.state) ? "danger" : "good" : ""), k = C(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), z = C(() => k.value || "var(--tone-work)"), D = C(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), q = Xs(), M = C(
      () => t.mark.began_at && D.value && !t.mark.figure && !t.mark.counting ? Bi(q.value - t.mark.began_at) : ""
    ), O = C(() => {
      const { started: le, ended: pe } = t.mark;
      return le ? pe ? `ran ${Ho(pe - le, !0)}` : Ho(q.value - le, !0) : M.value;
    }), $ = ["bad", "danger", "warn"], g = C(() => $.includes(N.value) || t.mark.asks ? "attention" : D.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), _ = ["bad", "danger"], I = C(() => _.includes(N.value)), R = C(() => g.value === "process" ? "running" : I.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), H = C(
      () => !!(t.mark.figure || O.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), Q = C(() => [t.mark.title, t.mark.time ? Ii(t.mark.time) : ""].filter(Boolean).join(" · ")), te = C(() => ({
      ...k.value ? { "--mark": k.value } : {},
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
          failed: I.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: k.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: te.value,
      title: Q.value,
      "data-figure-mark": e.mark.key,
      "data-folded": L(E) ? "" : null,
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
          e.mark.worker ? (u(), f("span", Bk, v(e.mark.worker), 1)) : w("", !0),
          m("span", Rk, [
            T(st, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", Lk, v(e.mark.name), 1)) : w("", !0),
            r.value ? (u(), F(Vt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : w("", !0)
          ]),
          H.value ? (u(), f("span", Nk, [
            e.mark.figure ? (u(), f("span", qk, v(e.mark.figure), 1)) : w("", !0),
            O.value ? (u(), f("span", Dk, v(O.value), 1)) : w("", !0),
            e.mark.stopping ? (u(), f("span", Pk, "Stopping")) : w("", !0),
            e.mark.news ? (u(), f("span", jk, v(e.mark.news), 1)) : w("", !0),
            R.value === "running" ? (u(), f("span", Fk)) : R.value ? (u(), F(Ct, {
              key: 5,
              class: V(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : w("", !0),
            e.mark.settled ? (u(), f("span", Wk, v(e.mark.settled), 1)) : w("", !0)
          ])) : w("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), F(Gi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(B, ["stop"])
      }, null, 8, ["label", "open"])) : w("", !0),
      (e.mark.figure || e.mark.counting) && D.value ? (u(), f("span", Hk, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: z.value })
        }, null, 4)
      ])) : w("", !0),
      e.mark.detail && !L(E) ? (u(), F(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      e.mark.body && !L(E) ? (u(), f("div", zk, [
        e.mark.bodyLabel ? (u(), f("p", Uk, v(e.mark.bodyLabel), 1)) : w("", !0),
        T(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : w("", !0),
      e.mark.command && !L(E) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Gk)) : w("", !0),
      e.mark.card ? (u(), F(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      fe(le.$slots, "default", {
        shown: !L(E)
      }, void 0, !0)
    ], 16, Ik));
  }
}), Zi = /* @__PURE__ */ U(Vk, [["__scopeId", "data-v-2aa9c496"]]), Kk = 8, Yk = 40, Qk = [];
class Js {
  constructor(t, n, { top: a = Kk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Qk.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Js(t, {
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
    n > Yk && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Xk = 60, Jk = 300, er = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function tr(e, t) {
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
  async function r() {
    const h = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return h.ok ? (n.value = [...h.value.lines, ...n.value], a.value = h.value.first_byte, !0) : !1;
  }
  const c = new Js("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Jk, more: () => a.value > 0, previous: r }, { top: Xk });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Zk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function nr(e) {
  var n;
  const t = Zk[e] || ((n = Gt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const ew = (e) => nr(String(e).split(":")[0]), tw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), nw = { passed: "good", failed: "danger", warned: "warn", running: "" }, aw = { good: "good", warn: "warn", danger: "danger" }, al = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Lf(e.target_model, e.target_id || 0)
}, sw = { "open row": (e) => ew(e.target_model), "open page": () => nr("pages") };
function ow(e, t) {
  const n = t || {}, a = al[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? nw[e.outcome] || "" : aw[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? sw[a](e) : "",
    handlers: a ? { onAct: () => al[a](e) } : {}
  };
}
const lw = 24, iw = 1e3, sl = 2e3, rw = 0.25, uw = 5e3;
function cw(e, t = lw, n = () => !0) {
  const a = A(!1), s = A(0), o = A(!1);
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
    const k = Date.now() - r < sl ? sl : iw;
    l = setTimeout(() => o.value = a.value, k);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(N = !1) {
    const k = c();
    k && N && k.scrollTo ? k.scrollTo({ top: k.scrollHeight, behavior: "smooth" }) : k && (k.scrollTop = k.scrollHeight), y();
  }
  function E() {
    x(), !a.value && (a.value = !0, p(!0));
  }
  const S = () => !!c() && d() <= c().clientHeight * rw;
  function x() {
    clearTimeout(i), S() && (i = setTimeout(() => a.value && S() && n() && b(!0), uw));
  }
  function B() {
    h() ? y() : E();
  }
  function W(N = 1, k = !1) {
    a.value ? s.value += Math.max(0, N) : b(k);
  }
  return Rl() && fa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: y, toBottom: b, left: E, scrolled: B, arrived: W };
}
const dw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, fw = (e) => String(e ?? "").replace(dw, ""), hw = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), { away: o, scrolled: l, arrived: i, toBottom: r } = cw(s);
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
      K(v(L(fw)(e.lines.join(`
`)) || e.empty), 1),
      L(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => L(r)(!0))
      }, "Follow")) : w("", !0)
    ], 544));
  }
}, mw = /* @__PURE__ */ U(hw, [["__scopeId", "data-v-5a8693fe"]]), pw = "*.*", gw = {
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
    const t = e, n = Se(Le, null), a = new Gl();
    me(
      () => a.patterns,
      (r, c, d) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, r, (y) => a.dispatch(y));
        d(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = C(() => !!(t.declaration.shipped || t.declaration.trusted)), i = C(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [pw] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), F(Hi, {
      key: 0,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), F(Wi, {
      key: 1,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, vw = { class: "mark-more-inner" }, yw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, bw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, kw = {
  key: 3,
  class: "mark-lines"
}, ww = "process", ol = "task", $w = {
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
    const t = e, n = tt(), a = C(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = C(() => tw.has(t.mark.variant) && t.mark.detail || ""), o = C(() => t.mark.target_model === ol ? t.mark.target_id : 0), l = tr(
      er(n),
      () => t.mark.target_id
    ), i = l.lines, r = A(!1), c = A(""), d = C(() => !t.declaration.body_url && t.mark.target_model === ww && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      r.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = C(() => t.shown && d.value);
    return me(p, (y) => y && h()), Is(() => p.value && h(), () => p.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, b) => (u(), f("div", {
      class: V(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = $e(() => {
      }, ["stop"]))
    }, [
      m("div", vw, [
        e.declaration.body_url ? (u(), F(gw, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (u(), f(P, { key: 1 }, [
          s.value ? (u(), f(P, { key: 0 }, [
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", yw, v(s.value), 1)
          ], 64)) : w("", !0),
          d.value && c.value ? (u(), f("p", bw, v(c.value), 1)) : d.value && r.value ? (u(), f(P, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            T(mw, {
              class: "mark-terminal",
              lines: L(i),
              feed: L(l).feed,
              onOlder: L(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", kw, v(a.value.join(`
`)), 1)) : w("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = $e((E) => L(qe)(`${ol}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : w("", !0)
        ], 64))
      ])
    ], 2));
  }
}, bs = /* @__PURE__ */ U($w, [["__scopeId", "data-v-df71b15a"]]), xw = ["title", "aria-label", "onClick"], Sw = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Mw = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = C(() => lf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = A(""), s = Se(Le);
    async function o(l) {
      const i = await yn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (u(), f(P, null, [
      (u(!0), f(P, null, ae(n.value, (r) => (u(), f("button", {
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
      ], 8, xw))), 128)),
      a.value ? (u(), f("span", Sw, v(a.value), 1)) : w("", !0)
    ], 64));
  }
}, _w = /* @__PURE__ */ U(Mw, [["__scopeId", "data-v-7a62c88e"]]);
function ar(e, t) {
  const n = Xe(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ce.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const sr = ar("/api/marks", "marks"), t6 = sr.fetchAll, Cw = sr.find, Ew = ["data-ref"], Aw = ["data-ref"], Ow = { class: "mark-row" }, Tw = "dock add", Iw = "questions.answer", Bw = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = C(() => Cw(a.mark.type)), o = C(() => ow(a.mark, s.value)), l = C(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = C(() => l.value || !!o.value.handlers.onAct), r = C(() => a.mark.type === Iw), c = A(!1);
    function d() {
      c.value = !c.value;
    }
    const h = C(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(Tw));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var b, E;
      return (b = s.value) != null && b.card ? (u(), f("div", {
        key: 0,
        class: V(["thread-turn", "card", "whole-card", { "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        T(bs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Ew)) : (u(), f("div", {
        key: 1,
        class: V(["thread-turn", "card", { "full-width": (E = s.value) == null ? void 0 : E.full_width, docked: e.docked, "user-side": L(n).has(e.mark.variant), "answer-bubble": r.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Ow, [
          T(Zi, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: d
          }, tu({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: S }) => [
                T(bs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: S
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          T(_w, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Aw));
    };
  }
}, Rw = /* @__PURE__ */ U(Bw, [["__scopeId", "data-v-424ddb61"]]), Lw = ["data-ref"], Nw = ["inert"], qw = { class: "group-fold" }, Dw = { class: "thread-group" }, Pw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = A(!1), a = A(!1), s = A(!1), o = A(null);
    me(n, async (i) => {
      var r;
      a.value = !0, await je(), (r = o.value) == null || r.offsetHeight, s.value = i;
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
    return (i, r) => (u(), f("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      T(Zi, {
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
        m("div", qw, [
          m("div", Dw, [
            (u(!0), f(P, null, ae(e.group.marks, (c) => (u(), F(Rw, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Nw)) : w("", !0)
    ], 8, Lw));
  }
}, n6 = /* @__PURE__ */ U(Pw, [["__scopeId", "data-v-45b58b9b"]]);
function jw(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Me(() => n.observe(e.value)), et(() => n.disconnect()), t;
}
const Fw = { class: "chat-dock-fold" }, Ww = ["aria-label"], Hw = { class: "chat-dock-head" }, zw = { class: "chat-dock-inner" }, Uw = { class: "chat-dock-foot" }, or = 700, Gw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = A(null), a = A(null), s = jw(a), o = A(!1);
    let l = 0;
    return Me(() => l = setTimeout(() => o.value = !0, or)), et(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: V(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", Fw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: V(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          fe(i.$slots, "edge", {}, void 0, !0),
          m("header", Hw, [
            fe(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: V(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", zw, [
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
          m("footer", Uw, [
            fe(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Ww)
      ])
    ], 2));
  }
}, Vw = /* @__PURE__ */ U(Gw, [["__scopeId", "data-v-574cba3d"]]), Kw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Pa = 5, Yw = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Pa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Pa}s`, animationDelay: `${(n - Pa).toFixed(2)}s` };
    return (s, o) => (u(), f("span", Kw, [
      m("i", { style: a })
    ]));
  }
}, Qw = /* @__PURE__ */ U(Yw, [["__scopeId", "data-v-2a7bc150"]]), Xw = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), ks = (e) => e.charAt(0).toUpperCase() + e.slice(1), Jw = (e) => ks(e.replace(/_at$/, "").replaceAll("_", " ")), Zw = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, e2 = (e, t, n) => [ks(`${e} ${n}`), (t == null ? void 0 : t.state) && ks(t.state)].filter(Boolean).join(" · "), lr = (e) => e.given_name || `${Qn(e.role)} ${e.id}`, t2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? lr(t) : (e == null ? void 0 : e.name) ?? "", n2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? lr(t) : "", a2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Xw.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Jw(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], s2 = { reviewing: "Under review" }, o2 = (e, t) => e || s2[t == null ? void 0 : t.state] || "", ir = ar("/api/docks", "docks"), a6 = ir.fetchAll, Rt = ir.find, l2 = 6, ja = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Zs = (e) => Date.parse(e.leaves_at) / 1e3, Xt = (e) => !!(e.leaves_at && !e.kept), i2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Xt(e) || t < Zs(e) || n.has(e.id)), r2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => i2(a, t, n)).sort((a, s) => a.id - s.id);
function u2(e, t, n = l2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Zs(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const c2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ws = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), d2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), f2 = (e) => ({ ...e.kept ? ws("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ws("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), h2 = ["keep", "unkeep", "open", "undock"], m2 = (e) => ({ ...e, iconOnly: h2.includes(e.action) });
function p2(e, t) {
  var n;
  return [
    ...d2(e, t) ? [f2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Gt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    ws("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(m2);
}
function rr(e, t) {
  const n = p2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: c2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const g2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || rr(e, t).title, v2 = { class: "dock-text" }, y2 = ["title"], b2 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, k2 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, w2 = {
  key: 1,
  "data-dock-row": ""
}, $2 = { class: "dock-acts" }, x2 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = C(() => Rt(a.item.type)), o = Xs(), l = C(() => Vs(a.item.created_at, o.value * 1e3)), i = A(null), r = A(null), c = A(null), d = A(null), h = C(() => rr(a.item, s.value)), p = tt(), y = C(() => `dock.${a.item.id}`), b = C(() => p.props[y.value].data.value), E = C(() => g2(a.item, s.value, b.value)), S = C(() => ea(a.item.target_model ?? "")), x = C(() => {
      var $;
      return (($ = s.value) == null ? void 0 : $.word) ?? "";
    }), B = C(() => ({ ...b.value, id: a.item.target_id, noun: S.value })), W = () => {
      var $, g;
      return ((g = ($ = s.value) == null ? void 0 : $.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    xc(Bl, { data: b, reload: W, readOutput: er(p) }), me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      ($, g, _) => {
        var R;
        W();
        const I = (R = p.followUndeclared) == null ? void 0 : R.call(p, [`${S.value.replaceAll("-", "_")}.*`], (H) => {
          (!H.row_id || H.row_id === a.item.target_id) && W();
        });
        _(() => I == null ? void 0 : I());
      },
      { immediate: !0 }
    );
    const N = A(/* @__PURE__ */ new Set()), k = A("");
    async function z($) {
      if ($.action === "undock") return n("undock", $);
      if ($.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (N.value = /* @__PURE__ */ new Set([...N.value, $.label])), k.value = "";
      const _ = await yn($, { id: a.item.target_id }, p.environment);
      (_ == null ? void 0 : _.ok) === !1 && (N.value = new Set([...N.value].filter((I) => I !== $.label)), k.value = `Could not ${$.label.toLowerCase()}: ${_.error}`);
    }
    const D = C(() => h.value.actions.filter(($) => !N.value.has($.label))), q = C(() => {
      var $;
      return o2(($ = s.value) == null ? void 0 : $.badge, B.value);
    }), M = C(() => h.value.controls), O = C(() => {
      var $;
      return !!(($ = s.value) != null && $.draws_head) && !a.collapsed;
    });
    return ($, g) => {
      var _, I, R, H;
      return u(), F(Vw, {
        label: h.value.title + ((_ = s.value) != null && _.needs_user ? ", waiting for you" : ""),
        type: (I = s.value) != null && I.needs_user ? "waiting" : "",
        folded: !!((R = s.value) != null && R.folds) && e.folded,
        body: !!((H = s.value) != null && H.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[3] || (g[3] = (Q) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (u(), F(Qw, {
            key: 0,
            "ends-at": L(Zs)(e.item)
          }, null, 8, ["ends-at"])) : w("", !0)
        ]),
        head: j(() => {
          var Q;
          return [
            O.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(P, { key: 1 }, [
              T(re, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", v2, [
                m("span", {
                  class: V(["dock-title", { strip: e.collapsed }]),
                  title: E.value
                }, v(E.value), 11, y2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Q = s.value) != null && Q.leaves_after_seconds ? w("", !0) : (u(), f(P, { key: 0 }, [
                K(v(l.value), 1)
              ], 64))
            ], 512),
            M.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = $e(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(P, null, ae(M.value, (te) => {
                var le, pe;
                return u(), f(P, {
                  key: te.action + te.runs
                }, [
                  !N.value.has(te.label) && (!((le = te.variants) != null && le.length) || !((pe = B.value) != null && pe.state) || te.variants.includes(B.value.state)) ? (u(), F(ge, {
                    key: 0,
                    variant: "icon",
                    class: V({ kept: te.pressed }),
                    "aria-pressed": te.pressed,
                    "aria-label": te.label,
                    title: te.label,
                    "data-dock-action": te.action,
                    onClick: (xe) => z(te)
                  }, {
                    default: j(() => [
                      T(re, {
                        name: te.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : w("", !0)
                ], 64);
              }), 128))
            ])) : w("", !0)
          ];
        }),
        still: j(() => [
          k.value || e.refusal ? (u(), f("p", b2, v(k.value || e.refusal), 1)) : w("", !0)
        ]),
        foot: j(() => {
          var Q;
          return [
            m("span", k2, [
              q.value ? (u(), f("span", {
                key: 0,
                class: V(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(q.value), 3)) : w("", !0),
              x.value ? (u(), f("span", w2, v(x.value) + " " + v(e.item.target_id), 1)) : w("", !0),
              m("span", {
                ref_key: "foot",
                ref: r,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (Q = s.value) != null && Q.folds ? (u(), F(ge, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (te) => n("fold"))
            }, {
              default: j(() => [
                K(v(s.value.folds) + " ", 1),
                T(Vt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : w("", !0),
            m("span", $2, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              T(Fs, {
                name: `dock.${e.item.type}`,
                row: B.value,
                environment: L(p).environment,
                "read-only": L(p).readOnly,
                "object-name": L(ea)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (te) => k.value = te),
                onDone: $.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(P, null, ae(D.value, (te) => (u(), F(ge, {
                key: te.action + te.runs,
                small: "",
                variant: te.primary ? "primary" : "ghost",
                bordered: !te.primary,
                "data-dock-action": te.action,
                onClick: (le) => z(te)
              }, {
                default: j(() => [
                  K(v(te.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var Q;
          return [
            (Q = s.value) != null && Q.body_url ? (u(), F(bs, {
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
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : w("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, ll = /* @__PURE__ */ U(x2, [["__scopeId", "data-v-16f25ff3"]]), S2 = 24, M2 = 8, s6 = 420;
function o6({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= S2 ? !0 : e < t && s > M2 ? !1 : null;
}
const _2 = (e, t) => e === void 0 ? t : e, C2 = { me: 1, people: [] }, aa = Ht({
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
  people: C2,
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
mi("journal.activity", () => aa.activity);
mi("journal.side.mini", () => aa.sideMini);
const ur = "journal.viewer.";
function E2(e, t, n) {
  try {
    const a = n.getItem(ur + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function A2(e, t, n) {
  try {
    n.setItem(ur + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function il(e, t, n = window.localStorage) {
  const a = A(E2(e, t, n));
  return me(a, (s) => A2(e, s, n), { deep: !0 }), a;
}
const O2 = {
  key: "dock-all",
  class: "dock-all"
}, T2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var $, g;
    const t = e, n = Ck(500), a = A(/* @__PURE__ */ new Set()), s = Se(Le), o = A(/* @__PURE__ */ new Set()), l = A({});
    async function i(_, I) {
      l.value = { ...l.value, [_.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, _.id]);
      const R = await yn(I, { id: _.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((H) => H !== _.id)), l.value = { ...l.value, [_.id]: `Could not dismiss this card: ${R.error}` });
    }
    const r = C(
      () => r2(
        t.items.filter((_) => !o.value.has(_.id)),
        n.value,
        a.value
      )
    ), c = C(
      () => u2(
        r.value.filter((_) => ja(_, Rt)),
        n.value
      )
    ), d = C(() => r.value.filter((_) => !c.value.includes(_) && !ja(_, Rt))), h = il(`dock-size:${(($ = aa.identity) == null ? void 0 : $.root) || location.host}`, null), p = (_) => {
      var I;
      return !!((I = Rt(_.type)) != null && I.needs_user);
    }, y = A(/* @__PURE__ */ new Set()), b = A(/* @__PURE__ */ new Set()), E = C(() => r.value.length === 1), S = (_) => p(_) || E.value, x = (_) => S(_) ? y.value.has(_.id) || b.value.has(_.id) : h.value ? h.value.collapsed && !h.value.opened.includes(_.id) : t.collapsed, B = C(() => r.value.some(x));
    me(() => t.collapsed, (_) => {
      b.value = new Set(_ ? r.value.filter(p).map((I) => I.id) : []);
    });
    function W() {
      const _ = !B.value;
      h.value = { collapsed: _, opened: [] }, y.value = new Set(_ ? r.value.filter(p).map((I) => I.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function N(_) {
      var R;
      if (!x(_)) return;
      if (S(_)) {
        y.value = new Set([...y.value].filter((H) => H !== _.id)), b.value = new Set([...b.value].filter((H) => H !== _.id));
        return;
      }
      const I = (R = h.value) != null && R.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...I, _.id] };
    }
    const k = il(`dock-folded:${((g = aa.identity) == null ? void 0 : g.root) || location.host}`, {}), z = (_) => {
      var I;
      return !!((I = Rt(_.type)) != null && I.folds) && (t.insidesFolded || _2(k.value[_.id], ja(_, Rt) || t.folded));
    };
    function D(_) {
      z(_) && q(_), k.value = { ...k.value, [_.id]: !z(_) };
    }
    function q(_) {
      var I;
      !((I = h.value) != null && I.collapsed) || h.value.opened.includes(_.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, _.id] });
    }
    function M(_) {
      a.value = /* @__PURE__ */ new Set([...a.value, _.id]);
    }
    function O(_) {
      a.value = new Set([...a.value].filter((I) => I !== _.id));
    }
    return (_, I) => (u(), F(Os, {
      tag: "div",
      name: "dock",
      duration: L(or),
      class: "dock-stack"
    }, {
      default: j(() => [
        r.value.length > 1 ? (u(), f("div", O2, [
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
        ])) : w("", !0),
        (u(!0), f(P, null, ae(d.value, (R) => (u(), F(ll, {
          key: R.id,
          item: R,
          class: V({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (H) => N(R),
          onFold: (H) => D(R),
          onUndock: (H) => i(R, H),
          onMouseenter: (H) => M(R),
          onMouseleave: (H) => O(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (u(!0), f(P, null, ae(c.value, (R) => (u(), F(ll, {
          key: R.id,
          item: R,
          class: V({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: x(R),
          refusal: l.value[R.id],
          onOpen: (H) => N(R),
          onFold: (H) => D(R),
          onUndock: (H) => i(R, H),
          onMouseenter: (H) => M(R),
          onMouseleave: (H) => O(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, l6 = /* @__PURE__ */ U(T2, [["__scopeId", "data-v-2c47a65e"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, zn = (e) => Math.min(Math.max(e, 0), 1), I2 = (e) => {
  const t = zn(e);
  return t * t * (3 - 2 * t);
}, bt = (e, t, n) => I2((e - t) / (n - t));
function i6(e) {
  const t = zn(e), n = zn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = bt(s, 0.26, 0.38) * (1 - bt(s, 0.76, 0.96)), l = bt(s, 0.38, 0.76), i = bt(t, 0, 0.12) * (1 - bt(t, 0.88, 1)), r = bt(s, 0.2, 0.34) * (1 - bt(s, 0.84, 1)), c = Math.sin(Math.PI * zn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function r6(e, t, n, a, s) {
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
}, u6 = (e) => rl[e] ?? rl.butler, eo = 2400, B2 = 0.05;
function R2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, B2), l = Math.min(t + eo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function c6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function L2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function d6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const f6 = (e, t) => ({ ...e, stretch: t.stretch }), h6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, cr = (e, t) => t >= (e.least ?? 0);
function m6(e, t, n) {
  if (!cr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const p6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), N2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ul = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), q2 = (e) => e.right > e.left && e.bottom > e.top;
function g6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(N2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = ul(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = ul(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), q2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function dr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [d, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[h] || e[d] > o[p]) && (i = -1);
      else {
        const b = (o[h] - e[d]) / y, E = (o[p] - e[d]) / y;
        l = Math.max(l, Math.min(b, E)), i = Math.min(i, Math.max(b, E));
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
}, dn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), D2 = (e) => e * e * (3 - 2 * e), Oe = (e, [t, n]) => D2(dn(e, t, n)), P2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], mt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, qn = ([e, t], n) => e + n() * (t - e);
function j2(e) {
  return P2.map(() => {
    const t = qn(mt.speed, e), n = qn(mt.angle, e) * Math.PI / 180, a = qn(mt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [qn(mt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const F2 = j2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function W2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * mt.gravity * (t[2] - mt.floor))) / mt.gravity;
}
function v6(e, t, n = F2) {
  const a = Ae.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = W2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= mt.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const y6 = (e, t) => e && Ae[e.name] ? { name: e.name, u: t / e.frames } : null;
function b6(e, t) {
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
const k6 = () => Array.from({ length: Ae.pogo.count }, (e, t) => Ae.pogo.bounce * (t + 1) / Ae.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function w6(e, t, n) {
  const { away: a, side: s } = Ae.bug_smash, o = s * a * n, [l, i] = [t.left + Dt.margin * n, t.right - Dt.margin * n], r = Math.min(Math.max(e + o + s * Dt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function $6(e, t, n) {
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
function x6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = R2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ne = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function S6(e) {
  const t = Ne.least + Math.floor(e() * (Ne.most - Ne.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ne.walls[Math.floor(e() * Ne.walls.length)],
    along: Ne.margin + e() * (1 - 2 * Ne.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function $s(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ne.margin, l = ((e.along - Ne.margin + e.way * Ne.speed * n / a) / s % 2 + 2) % 2, i = Ne.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Ne.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ne.inset : t.right - Ne.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function H2(e, t) {
  const n = Ae.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = L2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function M6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ae.bug_shot, { frame: l, bug: i, shot: r } = H2(n, e.length), c = e.map((x, B) => ({ ...$s(x, t, Math.min(n / o.fps, Un(B).shot)), shot: B < r })), d = Oe(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((x, B) => ({ bug: x, index: B, seconds: n / o.fps - Un(B).shot, spot: $s(x, t, Un(B).shot) })).filter((x) => x.seconds >= 0), b = y.flatMap((x) => {
    const B = (s == null ? void 0 : s.get(x.index)) ?? K2(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, B), s && Y2(B, x.seconds, a), Q2(B, x.seconds, a);
  }), E = y.filter((x) => G2(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: S }, slush: b, camera: E };
}
function Un(e) {
  const t = Ae.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function _6(e, t, n, a) {
  const { limit: s, margin: o } = Ae.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = Un(d), p = $s(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - p.x), E = Math.abs(p.x - r) >= y ? r : p.x + b * y, S = b > 0 ? Math.max(r, Math.min(E, i)) : Math.min(r, Math.max(E, l)), x = { from: r, to: S, begin: h.walk, end: h.aim };
    return r = S, x;
  });
}
function C6(e, t, n) {
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
const _e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, z2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function U2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const G2 = (e) => e.along * 97 % 1 < _e.camera, fn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * _e.gravity * t * t });
function V2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * _e.gravity * (t.bottom - e.from.y))) / _e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * _e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / _e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += _e.step) {
    const d = Math.min(c + _e.step, l.t), h = fn(e, d), p = dr(i, h, n);
    if (p) return { ...p, t: c + (d - c) * p.share };
    i = h;
  }
  const r = fn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function K2(e, t, n, a = []) {
  const s = U2(e.along + 1), [o, l] = z2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: _e.count }, () => {
    const r = i + (s() - 0.5) * 2 * (_e.spread * Math.PI / 180), c = _e.speed[0] + s() * (_e.speed[1] - _e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: _e.radius[0] + s() * (_e.radius[1] - _e.radius[0]) };
    return { ...d, ...V2(d, t, a) };
  });
}
function Y2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += _e.step) {
      const l = Math.min(o + _e.step, s), i = dr(fn(a, o), fn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function Q2(e, t, n = []) {
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
function E6(e, t, n, a) {
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
function A6(e, t, n, a, s) {
  const { sway: o, above: l } = Ae.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (E) => {
    const [S, x] = [E.x - e.at.x, E.y - e.at.y];
    return { x: i.x + S * c - x * d, y: i.y + S * d + x * c };
  }, [p, y] = [...n].sort((E, S) => E.x - S.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: b.map((E, S) => ({ from: E, to: S < b.length / 2 ? p : y })) };
}
const O6 = (e, t) => Oe(t, e.grows) * (1 - Oe(t, e.sinks));
function sa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: dn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: dn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function T6(e, t) {
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
const I6 = (e) => e === "pack_box";
function B6(e) {
  const { into: t, out: n } = sa(Ae.rope_swing, e);
  return 1 - Oe(t, [0, 1]) * (1 - Oe(n, [0, 1]));
}
function R6(e) {
  const t = Ae.rope_swing, { into: n, out: a } = sa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Oe(n, [0, 1]) * (1 - Oe(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const X2 = { after: 3 }, to = 10, J2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Z2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, e5 = { weight: 19 }, fr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, t5 = { every: 120 }, hr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, mr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, n5 = {
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
}, $n = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: to }), ie = (e, t, n = {}) => $n(e, "clip", t, n), Fa = (e, t, n = {}) => $n(e, "look", t, n), cl = (e, t, n = {}) => $n(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...$n(e, "pick", t, n), ...a }), ke = (e) => $n("nothing", "nothing", e, {}), a5 = 120, s5 = 300, Wa = (e, t) => ({ ...ie(e, t), cooldown: s5 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), o5 = () => [ie("joy", 2)], kt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), wt = (e) => ({ ...e, cooldown: J2[e.name] }), Qt = (e) => ({ ...e, shenanigan: !0, lasts: Z2[e.name] }), va = [
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
  ...de("reported", { cooldown: 90 }, [cl("read", 3), ie("nod", 1), ke(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [cl("read", 3), ke(1)]),
  ...de("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), ke(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), ke(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, o5()),
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
  ...Object.entries(n5).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Fa(t, 1)])),
  ...Object.entries(hr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(mr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [ie(t, 1)])),
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
  ...de("held:search", { cooldown: a5 }, [Wa("search", 3), { ...Wa("binoculars", 2), when: { home: !0 } }, { ...Wa("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...de("unit", { cooldown: fr.build.cooldown }, [ye("unit", e5.weight), ke(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: t5.every }, ye("stand", 5)]),
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
], pr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), gr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), l5 = (e) => Array.isArray(e) ? e[0] : e, i5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, r5 = (e) => va.some((t) => t.when.moment === e);
function u5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || gr(d).every(([h, p]) => n(h) >= l5(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = va.filter((d) => pr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= X2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ve(e, t) {
  const n = u5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (vr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function vr(e, t, n) {
  var a;
  for (const [s, o] of gr(t)) (a = e.memory) == null || a.set(s, e.now + i5(o, n));
}
function L6(e, t, n) {
  vr(e, va.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const N6 = (e) => Object.values(fr).find((t) => pr(t.when, e)) ?? null, c5 = (e, t, n) => n - t <= (e.lifetime ?? to), q6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || cr(e.clip, t));
class yr {
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
const xs = {
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
}, D6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), br = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), P6 = {
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
}, j6 = 120, d5 = 20, F6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < d5), f5 = (e) => xs[e] || xs.idle, W6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, kr = "airborne", h5 = "landing", m5 = "travelling", wr = "grounded", H6 = ({ airborne: e, landing: t, trip: n }) => e ? kr : t ? h5 : n != null && n.started ? m5 : wr;
function z6(e, t) {
  var s;
  const n = p5(e, t);
  return e.mode === wr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function p5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === kr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...g5(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : f5(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function g5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Ss = (e) => e.outcome, v5 = "plugin:code-commandments:sins:", dl = (e) => e.type === "plugins.card" && e.markKey.startsWith(v5), y5 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => dl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => dl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], U6 = (e, t) => e.filter((n) => n.author === "user" && ta(n.read_at) > t).map((n) => ({ beat: "read_message", time: ta(n.read_at), card: _i(n) })).sort((n, a) => n.time - a.time), fl = { user: "reacted", agent: "agent_reacted" };
function G6(e, t) {
  return e.filter((n) => fl[n.author] && _t(n) > t).map((n) => ({ beat: `${fl[n.author]}:${n.emoji}`, time: _t(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const b5 = [.../* @__PURE__ */ new Set([...Object.values(hr).flatMap((e) => Object.keys(e)), ...Object.keys(mr)])];
function V6(e, t) {
  return e.filter((n) => n.author === "agent" && _t(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = b5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: _t(n), card: _i(n) })).sort((n, a) => n.time - a.time);
}
const k5 = (e) => new yr(e).isTest(), oa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Ss(e)] || "";
}, w5 = 1800, $5 = (e, t) => {
  if (oa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && oa(n) !== "finished" && Number(e.time) - Number(n.time) <= w5 ? "tests_fixed" : "tests_passed";
};
function K6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(k5), s = a.filter((i) => oa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, oa(i))), o.map((i) => ({ beat: $5(i, s), time: Number(i.time), card: i.key }));
}
function Y6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Ss(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Ss(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const Q6 = (e) => e.map((t) => {
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
function X6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function J6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Z6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = y5.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function no(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const hl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function x5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    no(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function eM(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : r5(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function tM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const ml = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function nM(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, i = o % Re.sweep, r = Re.sweep - Re.returnSeconds, c = ml((i - r) / Re.returnSeconds), d = i <= r ? ml(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const pl = 3, $r = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, gl = 12, aM = (e, t) => ({ mood: e, began: t, seen: 0 });
function sM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!$r(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= pl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * gl) / gl, lasts: pl } };
}
const oM = (e) => e.posture === "hang" && !$r(e.face), S5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), M5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function lM(e, t, n) {
  return S5.has(e) ? 1 / 0 : !M5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(xr(n - t.began, t.share) - ot.lead, 0);
}
const _5 = 5;
function iM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= _5 ? { beat: "long_walk", time: n } : null };
}
const C5 = 30, Dn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function rM(e, t, n, a, s = null) {
  if (t && n < t.until || !Dn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, i] = Dn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Dn.every } : { state: e, began: 0, until: 0, next: n + Dn.every };
}
const uM = (e, t, n) => t && n < t.until && br.has(e.state) ? { state: t.state, since: t.began } : e, ot = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, xr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function cM(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = xr(o, e.share);
  return s ? { eager: E5(t, l), moment: null } : l > ot.lead ? { eager: t, moment: null } : l < ot.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ot.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ot.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function E5(e, t) {
  return e.on && t > ot.lead + ot.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ot.lead && t >= ot.least ? { ...e, on: !0, calm: !1 } : e;
}
const A5 = 1, O5 = { look: "look", gaze: "gaze" };
function T5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [O5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const I5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), B5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > A5 * t, memory: a, now: s, room: o }, n).name === "backflip", R5 = { work: ["building"], idle: ["standing"] };
function dM(e, t, n, a) {
  const s = xs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(R5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), br.has(e) ? { moments: o, began: n || a } : (n && a - n >= C5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function L5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const vl = { pondering: L5 };
function fM(e, t, n, a, s, o) {
  if (vl[e.beat]) {
    const i = vl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = T5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== to && { lifetime: l.lifetime } } } : null;
}
function hM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = I5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const mM = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function pM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function gM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const vM = (e, t) => !!(e != null && e.watches) && !t.once, yM = 10, bM = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || c5(a, a.queuedAt, n)), kM = (e, t) => t ? null : e[0] ?? null;
function wM(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const $M = (e, t) => !t.during || !e.some((n) => n.during === t.during), N5 = 2 * Math.PI, q5 = 500;
function xM(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / q5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = N5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, E = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !r ? s && !t.behind && !y.behind ? P5(y, t, n, p, s) : F5(y, t, n, p) : t) ?? y, S = E != null && E.behind && E.mood === "reading" ? D5(e.point, E, n, l, s) : E;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: a };
}
function D5(e, t, n, a, s) {
  const o = (M) => M * 180 / Math.PI, l = (M) => o(Math.atan2(Math.sin(M * Math.PI / 180), Math.cos(M * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : d, b = y + l(c - y), E = Math.min(Math.max(a / 1e3, 0), 0.1), S = Re.turnSpeed * E, x = h ? y + Math.min(Math.max(b - y, -S), S) : b, B = h ? e.readingFollow + p : x, W = B + (x - B) * (1 - Math.exp(-E / Re.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, k = o(no(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), z = Math.min(Math.max(k, -N.up), N.down), D = Re.tipSpeed * E, q = h ? e.readingPitch + Math.min(Math.max(z - e.readingPitch, -D), D) : z;
  return { ...t, readingYaw: x, readingFollow: W, readingPitch: q, readingFacing: i };
}
function P5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (B) => {
    const { yaw: W, pitch: N } = no(B.x - n.x, s, n.y - B.y, o);
    return { yaw: W, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [hl(i(e)), hl(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [p, y] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [b, E, S] = r.map((B, W) => p * B + y * c[W]), x = s * b / E;
  return { ...t, x: n.x + x, y: n.y - x5(x, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const j5 = 0.15;
function SM(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= j5;
}
function F5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const W5 = (e) => !(e != null && e.on);
function MM(e, t, n) {
  if (W5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const hn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, nt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ha = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), yl = (e) => e * e * (3 - 2 * e);
function H5(e) {
  if (e < 0 || e >= nt.seconds) return null;
  const t = Ha(e, ...nt.flicker), n = Math.floor(t * nt.flickers * 2) % 2 === 0, a = e < nt.flicker[1] ? n ? 0.35 + 0.5 * t : nt.dim : 1;
  return { strength: 1 - yl(Ha(e, ...nt.fade)), lit: a, white: e < nt.flash[0] ? 0 : 1 - yl(Ha(e, ...nt.flash)) };
}
const _M = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function CM(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = H5(t - e.at);
  return a && { colour: hn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: nt.signs[e.tone], ...a } };
}
function EM(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function AM(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= hn.looks || a === null && n - e.since >= hn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function OM(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ht = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, TM = { behind: 39, figure: 40, ahead: 41 }, z5 = "[data-figure-pile]", U5 = { amber: [1, 0.69, 0.125], good: hn.colours.good, bad: hn.colours.bad }, Gn = { phases: 4, ms: 230, dim: 0.25 }, IM = (e, t, n) => e !== "amber" || (t + n) % Gn.phases < Gn.phases / 2 ? 1 : Gn.dim, BM = (e) => e === "amber" ? Gn.phases : 1;
function RM(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const LM = Object.keys(U5), Ye = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Jt = ([e, t], n) => e + n() * (t - e);
function NM(e) {
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
function qM(e) {
  const t = Math.floor(e / za.high);
  return { left: -(ht.inside + ht.width / 2 + t * (ht.width + za.gap)), up: e % za.high * (ht.height - ht.top) };
}
const G5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, V5 = { after: 5 }, K5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new yr(t).isBuild());
function DM(e, t, n) {
  const a = K5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= V5.after ? s : null;
}
function PM(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: G5(n, a, s) } : null;
}
const bl = { ahead: 140, up: 70 };
function jM(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * bl.ahead, y: a - bl.up } } : o ? { at: { x: n(o), y: a - o.up - ht.height } } : t ? { at: null } : null;
}
const Ua = { least: 4e3, most: 1e4 }, Y5 = (e) => Ua.least + e() * (Ua.most - Ua.least), $t = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function FM(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Y5(t);
    if (n.length >= $t.most || t() >= $t.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * ($t.at[0] + t() * ($t.at[1] - $t.at[0]));
    n.push({ from: o, to: o + $t.ms }), a = o + $t.ms;
  }
}
const WM = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), HM = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Sr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), zM = new Set(va.filter((e) => Sr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Q5 = (e) => e.some((t) => t.state === "built"), UM = (e, t) => Q5(t) ? e.filter((n) => !Sr.has(n.beat)) : e, gt = { reach: 40, room: 6 }, X5 = (e, t) => t <= e - gt.reach + 2, GM = (e, t, n) => X5(e, n) ? t - gt.reach : e - gt.reach - gt.room, VM = (e, t, n, a) => a > 0 && t < e && t + gt.reach >= e - 2 ? Math.min(n, Math.max(e, t + gt.reach)) : e, Ga = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, KM = (e) => Jt(e() < Ga.longShare ? Ga.long : Ga.short, e), J5 = 2 * ht.width;
function YM(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= J5 ? o : e + (o - e + s / 2) % s;
}
const Z5 = 60, QM = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Z5, kl = "[data-figure-home]", xn = () => {
  var t;
  const e = document.querySelector(kl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(kl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, e$ = "[data-figure-docked-bars]", t$ = "[data-figure-chat-foot]", n$ = [0.85, 0.6, 0.35, 0.15], a$ = ["question", "waiting", "suggestion"], XM = (e, t) => a$.find((n) => e[n] > 0 && t[n] === "behind") || null;
function JM() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const s$ = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", o$ = "[data-figure-newest]";
function Mr() {
  var a, s;
  const e = (a = xn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(o$), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ao(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function mn(e, t, n = Mr()) {
  if (!e || !n) return !0;
  const a = ut(e, t), s = ba(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Te.top * t.size, bottom: a.top + Te.bottom * t.size }, l = xt.gap;
  return !ya(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function ZM(e, t, n, a = Mr()) {
  if (!a || mn(t, e, a)) return null;
  const s = ba(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = At(), r = t.posture === "stand" ? oo * e.size : Br * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= d && mn(p, e, a) && R$(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Va = 0.26, _r = 0.54, l$ = 1.25 / 5.4, Sn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Va, travels: "stand" },
  lounge: { drop: Va, travels: "stand" },
  composed: { drop: Va, travels: "stand" },
  hang: { drop: _r, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, e_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * l$ * Math.cos(t * Math.PI / 180),
  y: 1 - n - _r
}), tn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), i$ = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), t_ = (e, t) => (e === "sit" ? i$.has(t) : tn.has(e)) ? e : "stand";
function n_(e, t) {
  return e.facing === t.facing || !tn.has(e.posture) && !tn.has(t.posture) ? t : { posture: "stand", facing: tn.has(e.posture) ? e.facing : t.facing };
}
const a_ = 0.25, s_ = (e, t) => tn.has(e) && Sn[t].drop === 0, Cr = 2, r$ = 90, u$ = 180, c$ = 140, d$ = 280, f$ = 420, h$ = 0.25, m$ = 290, p$ = 600, g$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", v$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ka = 5;
function la(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ka) return null;
  (l || i) && (o = Math.max(o, Cr));
  const y = o > 1, b = Math.abs(t.x - e.x), E = b < Ka ? 0 : b / (r$ * o) * 1e3, S = Math.min(E, y ? c$ : u$), x = Math.abs(t.y - e.y), B = t.y < e.y, W = B && !p && B5(x, n, r, c, d, h), N = B ? f$ + Math.min(x, 400) * h$ : Math.sqrt(2 * x / eo) * 1e3, k = {
    x: t.x,
    y: t.y,
    ms: x > Ka ? W ? p$ : N : 0,
    lead: W ? m$ : B ? d$ : 0,
    easing: B ? g$ : v$,
    hopping: !0,
    clip: W ? "backflip" : B ? "jump" : "fall"
  }, z = { x: t.x, y: t.y, ms: E + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, D = p ? y$(t, n) : k, q = B && !a ? [{ ...z, y: e.y }, D] : [{ ...k, x: e.x }, z];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const y$ = (e, t) => ({ x: e.x, y: e.y, ms: Ae.pogo.frames / Ae.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), b$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], o_ = (e, t, n) => e.posture === "walk" && n ? "walk" : b$(e.clip, t), ut = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Sn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ya = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ao = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = xn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Pn = 0.5, wl = 20;
function l_(e, t, n = At()) {
  const a = ut(e, t);
  return a.left >= n.left + wl && a.right <= n.right - wl;
}
function so(e, t, n = At()) {
  const a = ut(e, t), s = a.right - a.left, o = ba(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Pn && i <= n.right + Pn && a.top >= n.top - Pn && r <= n.bottom + Pn;
}
const ia = [0.35, 0.5, 0.65], ra = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Te = { left: ia[0], right: ia.at(-1), top: ra[0], bottom: ra.at(-1) }, k$ = 0.24;
function ba(e) {
  if (e.posture === "stand") return { left: Te.left, right: Te.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + k$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Te.left, t), right: Math.max(Te.right, t) };
}
function w$(e, { size: t }, n = At()) {
  const a = ba(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const oo = (Te.right - Te.left) / 2 + 0.08;
function i_(e, t) {
  return e === "hang" ? Te : { ...Te, bottom: Math.min(Te.bottom, 1 - t - Sn[e].drop) };
}
const $$ = "[data-figure-agent]";
function Er(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !ao(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const r of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[r].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, r), c.setEnd(o, r + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Ar = (e) => ra.flatMap(
  (t) => ia.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function lo(e, t, n = "") {
  if (!mn(e, t)) return ia.length * ra.length;
  const a = ut(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(s$)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && ya(s, r) && ao(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return Ar(s).filter(([i, r]) => l(i, r) || Er(i, r, n)).length;
}
function x$(e, t) {
  const n = ut(e, t);
  return Ar({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Er(a, s, "", $$)).length;
}
const $l = 4;
function r_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = $l; o <= s; o += $l)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!x$(i, e) && mn(i, e)) return i;
    }
  return null;
}
function pn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => so(l, t, a) && mn(l, t)).map((l) => ({ spot: l, covered: lo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Or = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), S$ = [0.5, 0.25, 0.75], M$ = (e) => Or(e.getBoundingClientRect(), S$), Tr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, _$ = oo, C$ = (e, t, { size: n }, a = _$) => Ir(e, Tr[t], a * n, "stand");
function Ir(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const E$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Br = 0.1, A$ = (e, t, { size: n }) => Ir(e, E$[t], Br * n, "sit"), O$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ya = 60;
function u_(e, t) {
  const n = O$(t);
  return !e.aside || Math.abs(n) >= Ya ? t : n < 0 ? 360 - Ya : Ya;
}
const nn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, T$ = (e) => [.../* @__PURE__ */ new Set([e, ...nn.turns.map((t) => (t + 360) % 360)])];
function c_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = T$(t), l = nn.every[0] + a() * (nn.every[1] - nn.every[0]);
  return { face: t, from: s ? I$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function I$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / nn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function d_(e, t) {
  const { element: n, edge: a } = ka(), s = ["left", "right"].map((i) => Mn(A$(a, i, e), e)).filter((i) => n && so(i, e) && !lo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function f_(e, t, { size: n }) {
  const a = (Te.right - Te.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Rr } : e;
}
const Rr = 7;
function Lr() {
  const e = [...document.querySelectorAll(z5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function B$(e, t) {
  const n = ut(e, t), a = n.right - n.left;
  return { left: n.left + Te.left * a, right: n.left + Te.right * a, top: n.top + Te.top * a, bottom: n.bottom };
}
function R$(e, t) {
  const n = Lr();
  return !n || !ya(B$(e, t), n);
}
const L$ = 4;
function ka() {
  const e = _n(), t = Lr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > L$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Rr - n, 0) } };
}
const h_ = ({ size: e, below: t }) => (1 - t) * e;
function Mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = Sn[e.posture].drop * a;
  return { ...w$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ms = (e, t) => Object.keys(Tr).map((n) => Mn(C$(e, n, t), t)), io = (e, t) => Or(e, n$).map((n) => Mn(n, t)), Nr = (e, t, n) => pn(e, t, n) ?? e[0];
function m_(e, t) {
  const { element: n, edge: a } = ka();
  return { ...Nr(Ms(a, e), e, t), view: null, on: n };
}
function p_(e, t, n, a) {
  const { element: s, edge: o } = ka(), l = (a ? Ms(o, t) : [...Ms(o, t), ...io(o, t)]).filter(
    (c) => !ya(ut(c, t), e)
  ), i = pn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), r = i && !lo(i, t) ? i : pn(l, t, n);
  return r && { ...r, view: null, on: s };
}
function _n() {
  var a;
  const e = xn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(e$);
  if (!t) return { ...wa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const xl = { within: 2 };
function g_(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = wa().edge;
  return a.left > s.left + xl.within || a.left + a.width < s.left + s.width - xl.within;
}
const N$ = "[data-figure-closing]";
function v_() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(N$));
}
const qr = "[data-figure-progress]";
function y_(e) {
  const t = e.querySelector(qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function b_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const q$ = { across: 300, above: 380, below: 60 };
function k_(e) {
  const { across: t, above: n, below: a } = q$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: D$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const D$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Dr = "[data-figure-bar]", _s = { back: 144, along: 0.4 };
function w_(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(Dr) : null;
  if (!(s != null && s.querySelector(qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Mn({ x: o - _s.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function $_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < _s.along * a.size ? t.x + _s.along * a.size : e.x, y: e.y, behind: !0 };
}
function x_(e) {
  const t = e.querySelector(Dr), n = t == null ? void 0 : t.firstElementChild;
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
function S_(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = wa(), r = n === null ? P$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Mn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function P$(e, t, n, a, s) {
  const o = io(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + ht.width < s && r.x + a - gt.reach - gt.room >= l);
  return pn(i.length ? i : o, t, n);
}
const j$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function M_(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Cr));
  const y = (W) => {
    const N = ut(W, n, Sn[W.posture].travels);
    return { x: N.left, y: N.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return F$(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [E, ...S] = [e, ...r, t].map(y), x = la(E, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: p }), B = S.slice(1).map((W, N) => {
    var k;
    return (k = la(S[N], W, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : k.legs.find((z) => z.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...B.filter(Boolean)] };
}
function F$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / j$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? la(e, n, o.size, { pace: l }) : la(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function __(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function C_(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && pn(M$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ka();
  return { ...Nr(io(s, t), t, n), view: null, on: a };
}
const W$ = "[data-figure-bubble]", H$ = 250;
let an = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Pr = 0;
const Kt = () => an, Qa = /* @__PURE__ */ new WeakMap();
let z$ = 0;
function ro(e) {
  return Qa.has(e) || Qa.set(e, `floor-${++z$}`), Qa.get(e);
}
const U$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, G$ = () => {
  var e, t;
  return ((t = (e = xn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function V$(e, t) {
  var a;
  const n = (a = e.querySelector(t$)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function K$(e, t) {
  const n = e && V$(e, t), a = e ? [...e.querySelectorAll(W$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || U$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: ro(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Y$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= H$ ? (t.top - a.top) / s * 1e3 : 0;
};
function jr(e = an, t = performance.now()) {
  const n = At(), a = G$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = wa();
  return c.element && r.push({ id: ro(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...K$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: Y$(e, d, t) }))) });
}
const Cs = /* @__PURE__ */ new Set();
function Q$(e) {
  return Cs.add(e), () => Cs.delete(e);
}
function X$() {
  Fr();
  const e = () => {
    Pr = requestAnimationFrame(e), !document.hidden && (an = jr(an), Cs.forEach((t) => t(an)));
  };
  e();
}
function Fr() {
  cancelAnimationFrame(Pr);
}
const uo = 5, J$ = 56, Z$ = { share: 0.6 }, e4 = (e) => -Math.sqrt(2 * eo * Z$.share * e), Wt = (e, t) => e.find((n) => n.id === t) ?? null;
function E_(e, t = jr().floors) {
  const n = Wt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ro(e.on) : null, o = s && Wt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Wr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Kt().floors) {
  const c = Wt(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || t4(c, d, o)) && n4(d, i, r) ? { x: d.x, y: d.y } : null;
}
const co = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, t4 = (e, t, n) => !co({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function A_(e, t = Kt().floors) {
  if (!co(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= uo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function n4(e, t, n = Kt().floors) {
  const a = Wt(n, "home");
  return e.posture === "hang" && a && ut(e, t).bottom >= a.top ? !1 : so(e, t);
}
function O_(e, t, n, a = Kt().floors) {
  const s = Wr(e, n, a);
  if (!e.home) return a4(e, t, s, a);
  if (!s) return null;
  const o = Wt(a, "home"), l = s.y - t.y, i = l > uo ? "dropping" : -l > J$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function a4(e, t, n, a) {
  const s = n ? Wt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: e4(e.risen) };
  if (!n) return null;
  if (co(t) && n.y - t.y > uo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function T_(e, t, n) {
  const a = oo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function I_(e, t, n, a = Kt().floors) {
  const s = t && Wr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const s4 = ["data-type"], o4 = { class: "figure-floor-name" }, l4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", o4, v(e.floor.type), 1)
    ], 12, s4));
  }
}, i4 = /* @__PURE__ */ U(l4, [["__scopeId", "data-v-4e0f1e2e"]]), r4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, u4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Xe(Kt().floors);
    let n = () => {
    };
    return Me(() => {
      n = Q$((a) => t.value = a.floors), X$();
    }), Ie(() => {
      n(), Fr();
    }), (a, s) => (u(), f("div", r4, [
      (u(!0), f(P, null, ae(t.value, (o) => (u(), F(i4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, B_ = /* @__PURE__ */ U(u4, [["__scopeId", "data-v-e519168b"]]), sn = (e) => typeof e == "number" ? e : Date.parse(e);
function R_(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: sn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => sn(s.row.created_at) - sn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Sl = 20;
async function L_(e, t, n) {
  for (let a = 0; a < Sl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || sn(o.created_at) <= sn(s.created_at) || !await n()) return a;
  }
  return Sl;
}
const c4 = 3, Xa = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function d4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Xa[n.grouping]) == null ? void 0 : a.call(Xa, e.row, n)) || "";
}
function f4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function N_(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= c4 ? [f4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = d4(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function h4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const q_ = (e) => (t) => t.filter((n) => n.id !== e), D_ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), P_ = (e) => (t) => [...t, e], j_ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function F_(e, t = {}) {
  const n = tt(), a = A(null), s = A("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function W_(e) {
  const t = tt(), n = A("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const jn = /* @__PURE__ */ new Map();
function m4(e, t) {
  if (jn.has(e)) return jn.get(e);
  const n = t().finally(() => jn.delete(e));
  return jn.set(e, n), n;
}
function H_() {
  const e = tt(), t = A(null), n = A("");
  async function a() {
    const s = await m4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const p4 = { class: "cards-page" }, g4 = { class: "cards-bar" }, v4 = { class: "cards-count" }, y4 = { class: "cards" }, b4 = {
  key: 1,
  class: "cards-note"
}, k4 = {
  key: 2,
  class: "cards-note"
}, w4 = ["data-row", "onClick"], $4 = { class: "card-head" }, x4 = { class: "card-title" }, S4 = { class: "card-foot" }, M4 = {
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
    return (a, s) => (u(), f("div", p4, [
      m("div", g4, [
        m("span", v4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
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
      m("div", y4, [
        e.loaded ? e.failure ? (u(), f("p", b4, v(e.failure), 1)) : e.rows.length ? w("", !0) : (u(), f("p", k4, "No " + v(e.noun) + "s yet", 1)) : (u(), F(Ke, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), f(P, null, ae(e.rows, (o) => (u(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", $4, [
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
          m("span", x4, v(e.title(o)), 1),
          m("span", S4, v(e.foot(o)), 1)
        ], 8, w4))), 128))
      ]),
      fe(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, z_ = /* @__PURE__ */ U(M4, [["__scopeId", "data-v-990e6b37"]]), Ml = "newest";
function U_(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Se(Le, null)) == null ? void 0 : c.search, s = A(""), o = A(Ml), l = A("all"), i = C(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((p) => h4(p, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Ml ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), r = C(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
}
const _4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, C4 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, E4 = 40, A4 = "top", O4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Se(Le, null)) == null ? void 0 : p.autoScroll, s = C(() => a === A4), o = A(null), l = A(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      var y;
      l.value = i(o.value) >= E4, s.value || (y = n.feed) == null || y.reachTop(o.value);
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
    }), et(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (u(), f("div", _4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: V(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        fe(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", C4, [
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
              [Ll, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, G_ = /* @__PURE__ */ U(O4, [["__scopeId", "data-v-d704d7e3"]]), T4 = ["aria-selected", "data-tab", "onClick"], I4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, B4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Se(Le, null), o = C(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = A(null), i = A({ left: 0, width: 0, slides: !1 }), r = (p) => n.answer[p.count_field] !== void 0;
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
      (u(!0), f(P, null, ae(o.value, (b) => {
        var E, S;
        return u(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: V(["inner-tab", { on: ((E = e.active) == null ? void 0 : E.key) === b.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === b.key,
          "data-tab": b.key,
          onClick: (x) => a("choose", b)
        }, [
          K(v(b.label) + " ", 1),
          r(b) ? (u(), f("span", I4, v(e.answer[b.count_field]), 1)) : w("", !0)
        ], 10, T4);
      }), 128)),
      m("i", {
        class: V(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, V_ = /* @__PURE__ */ U(B4, [["__scopeId", "data-v-63fcd326"]]), R4 = {
  class: "tab-body",
  "data-tab-body": ""
}, L4 = { "data-tab-content": "" }, N4 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = A(!1);
    let a = 0;
    return me(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Ts(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), f("div", R4, [
      n.value ? (u(), F(Ke, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : w("", !0),
      Je(m("div", L4, [
        fe(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Ll, !n.value]
      ])
    ]));
  }
}, K_ = /* @__PURE__ */ U(N4, [["__scopeId", "data-v-63876533"]]), q4 = {
  class: "search-bar",
  "data-search-bar": ""
}, D4 = { class: "search-bar-control" }, P4 = ["value", "placeholder", "aria-label"], j4 = ["aria-expanded"], F4 = {
  key: 0,
  "data-menu-count": ""
}, W4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = nu(), l = ((x = Se(Le, null)) == null ? void 0 : x.search) ?? {}, i = C(() => l.placeholder || a.placeholder), r = l.context ?? [], c = A(null), d = A(null), h = A([]), p = C(() => h.value.length ? h.value[h.value.length - 1].next : r), y = C(() => !!o.menu || r.length > 0), b = (B) => {
      h.value = [], d.value = d.value ? null : B.currentTarget;
    };
    function E(B) {
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
      return u(), f("div", q4, [
        m("div", D4, [
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
            onInput: W[0] || (W[0] = (k) => s("update:modelValue", k.target.value)),
            onKeydown: Mt(S, ["esc"])
          }, null, 40, P4),
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
          ])) : w("", !0),
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
            e.menuCount ? (u(), f("span", F4, v(e.menuCount), 1)) : w("", !0),
            T(re, {
              name: "caret",
              size: 12
            })
          ], 8, j4)) : w("", !0)
        ]),
        (N = L(l).button) != null && N.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: W[1] || (W[1] = (k) => s("pick", L(l).button.click))
        }, v(L(l).button.title), 1)) : w("", !0),
        fe(B.$slots, "default", {}, void 0, !0),
        d.value ? (u(), F(ha, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: W[3] || (W[3] = $e(() => {
          }, ["stop"])),
          onClose: W[4] || (W[4] = (k) => d.value = null)
        }, {
          default: j(() => [
            h.value.length ? (u(), F(ze, {
              key: 0,
              "data-search-back": "",
              onClick: W[2] || (W[2] = (k) => h.value = h.value.slice(0, -1))
            }, {
              default: j(() => [
                K("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : w("", !0),
            (u(!0), f(P, null, ae(p.value, (k) => (u(), F(ze, {
              key: k.title,
              description: k.subtext,
              "data-search-entry": k.title,
              onClick: (z) => E(k)
            }, {
              default: j(() => [
                K(v(k.title) + v(k.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? w("", !0) : fe(B.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : w("", !0)
      ]);
    };
  }
}, H4 = /* @__PURE__ */ U(W4, [["__scopeId", "data-v-45374bed"]]), z4 = {
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
    return (o, l) => (u(), F(H4, {
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
        (u(), f(P, null, ae(a, (i) => T(ze, {
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
        e.tools.hasStates ? (u(), f(P, { key: 0 }, [
          T(St, null, {
            default: j(() => [...l[3] || (l[3] = [
              K("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(P, null, ae(s, (i) => T(ze, {
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
        ], 64)) : w("", !0)
      ]),
      default: j(() => [
        fe(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, Y_ = /* @__PURE__ */ U(z4, [["__scopeId", "data-v-dab0064d"]]);
function Q_() {
  const e = A(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const X_ = (e) => import(
  /* @vite-ignore */
  e
), U4 = 86400, Es = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function G4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Es(t) - Es(e)) / U4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function J_(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Es(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: G4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ja = 280, Za = 240, es = 120, V4 = 6, K4 = 14, gn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Y4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Hr(e, t) {
  const n = Math.max(0, Y4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Q4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${K4}px)` }), e.offsetHeight, e.style.transition = `height ${Ja}ms ${gn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Hr(t, e));
    const p = s() - i;
    if (!r && p >= Ja && (r = !0, e.style.transition = `opacity ${Za}ms ease-out, transform ${Za}ms ${gn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Ja + Za) return a(h);
    d();
  };
  return a(h), d;
}
function Z_(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${V4}px)` }), e.offsetHeight, e.style.transition = `opacity ${es}ms ease-out, transform ${es}ms ${gn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Hr(t, e)), s() - l < es) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const X4 = 140, Fn = 220, _l = 5;
function eC({ gap: e = X4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function r() {
    const d = n.splice(0, _l);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(r, e));
      });
  }
  const c = (d, h, p, y = Q4) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: d, options: h, done: p, arrival: y, display: d.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(r, e));
    d.style.display = "none", n.push(b), n.length >= _l && c.flush();
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
function tC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${gn}, opacity ${Fn}ms ease-in, margin ${Fn}ms ${gn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Fn);
}
const zr = "chat.pins.minimised", Vn = A(Xn(zr, !1));
function Cl(e) {
  Vn.value = e, Ws(zr, e);
}
function J4(e) {
  const t = C(() => e()), n = C(() => Vn.value ? [] : e()), a = () => Cl(!Vn.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => _t(o) > s).length,
    (o, l) => o > l && Cl(!1)
  ), { pins: t, visible: n, minimised: Vn, toggle: a };
}
const Z4 = ["title"], ex = {
  key: 0,
  class: "pins-count"
}, tx = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = J4(() => t.pinRows);
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
      L(a) ? (u(), f("span", ex, v(L(n).length), 1)) : w("", !0)
    ], 10, Z4)) : w("", !0);
  }
}, nC = /* @__PURE__ */ U(tx, [["__scopeId", "data-v-d073c504"]]), nx = ["title"], ax = ["title"], sx = { class: "diff-card-dir" }, ox = { class: "diff-card-name" }, lx = ["title"], ix = ["title"], rx = {
  key: 0,
  class: "diff-card-note"
}, ux = ["href"], cx = ["src", "alt"], dx = { class: "diff-card-rows" }, fx = { class: "diff-row-num" }, hx = { class: "diff-row-sign" }, mx = { class: "diff-row-code" }, px = {
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
    function o(O) {
      (O.metaKey || O.ctrlKey) && (O.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = C(() => n.path.lastIndexOf("/") + 1), c = C(() => n.path.slice(0, r.value)), d = C(() => n.path.slice(r.value)), h = C(() => n.change === "deleted"), p = C(() => l[n.change]), y = C(() => new Set(n.rows.filter((O) => O.line_type === "add").map((O) => O.line))), b = A("after"), E = C(() => b.value === "before" ? n.whole.old : n.whole.text), S = C(() => n.whole && n.whole.text !== void 0 ? E.value.split(`
`).map((O, $) => ({ line_type: b.value === "after" && y.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: O })) : n.rows.filter(
      (O) => !(n.editsOnly && ["ctx", "fold"].includes(O.line_type)) && !(n.hideRemovals && O.line_type === "del")
    )), x = A(!1), B = C(() => n.lines && !x.value && !n.whole), W = C(() => B.value ? S.value.slice(0, n.lines) : S.value), N = C(() => S.value.length - W.value.length), k = (O) => O.line === null || O.line_type === "del" ? "" : O.line, z = (O) => O.line_type === "fold" ? O.hidden ? `⋯ ${O.hidden} lines` : "⋯" : O.text, D = A(null), q = A(null);
    let M = null;
    return Me(() => {
      if (!q.value) return;
      let O = !0;
      M = new ResizeObserver(() => {
        !D.value || !q.value || (D.value.style.transition = O ? "none" : "", D.value.style.height = `${q.value.offsetHeight}px`, O = !1);
      }), M.observe(q.value);
    }), Ie(() => M && M.disconnect()), (O, $) => (u(), f("section", {
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
          m("span", sx, v(c.value), 1),
          m("span", ox, v(d.value), 1),
          p.value ? (u(), f("span", {
            key: 0,
            class: V(["diff-card-badge", e.change])
          }, v(p.value), 3)) : w("", !0)
        ], 8, ax),
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
        }, v(b.value === "after" ? "After" : "Before"), 9, lx)) : w("", !0),
        h.value ? w("", !0) : (u(), f("button", {
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
        ], 10, ix))
      ], 8, nx),
      e.whole && e.whole.error ? (u(), f("p", rx, v(e.whole.error), 1)) : w("", !0),
      !h.value && !e.folded ? (u(), f(P, { key: 1 }, [
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
          }, null, 8, cx)
        ], 8, ux)) : (u(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: D,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            m("div", dx, [
              (u(!0), f(P, null, ae(W.value, (g, _) => (u(), f("div", {
                key: _,
                class: V(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", fx, v(k(g)), 1),
                m("span", hx, v(i[g.line_type]), 1),
                m("span", mx, v(z(g)), 1)
              ], 2))), 128)),
              N.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: $[3] || ($[3] = $e((g) => x.value = !0, ["stop"]))
              }, v(N.value) + " more " + v(N.value === 1 ? "line" : "lines"), 1)) : w("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : w("", !0)
    ], 2));
  }
}, aC = /* @__PURE__ */ U(px, [["__scopeId", "data-v-23581cbb"]]), gx = {
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
}, sC = /* @__PURE__ */ U(gx, [["__scopeId", "data-v-683e1839"]]), vx = { "data-queue-controls": "" }, yx = { class: "counts" }, bx = { "data-queue-spots": "" }, kx = {
  class: "spots",
  "aria-label": "Places in use"
}, wx = { "data-queue-waiting": "" }, $x = { key: 0 }, xx = { class: "control" }, Sx = { class: "stepper" }, Mx = ["disabled"], _x = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, Cx = ["disabled"], Ex = ["for"], Ax = ["id", "value", "disabled", "onChange"], Ox = { class: "control" }, Tx = ["aria-checked", "disabled"], Ix = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, Bx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, Rx = {
  key: 2,
  class: "note failure",
  role: "alert"
}, Lx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = A("");
    async function l(i, r) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(r)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, r) => (u(), f("div", vx, [
      T(Ft, { icon: "gauge" }, {
        default: j(() => [...r[3] || (r[3] = [
          K("Now", -1)
        ])]),
        _: 1
      }),
      m("div", yx, [
        m("div", null, [
          m("strong", bx, [
            K(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", kx, [
            (u(!0), f(P, null, ae(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: V({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", wx, v(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", $x, "The oldest goes first.")) : w("", !0)
        ])
      ]),
      m("div", xx, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", Sx, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, Mx),
          m("output", _x, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, Cx)
        ])
      ]),
      (u(!0), f(P, null, ae(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, Ex),
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
        }, null, 40, Ax)
      ]))), 128)),
      m("div", Ox, [
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
        ])], 8, Tx)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", Ix, [
        T(re, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = K("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", Bx, [
        T(re, {
          name: "pause",
          size: 13
        }),
        K("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : w("", !0),
      o.value ? (u(), f("p", Rx, v(o.value), 1)) : w("", !0)
    ]));
  }
}, Nx = /* @__PURE__ */ U(Lx, [["__scopeId", "data-v-b594afa3"]]), qx = ["data-queue-row", "data-queue-process"], Dx = ["aria-expanded"], Px = { class: "run-line" }, jx = { class: "leading" }, Fx = {
  key: 0,
  "data-queue-position": ""
}, Wx = ["title"], Hx = { class: "command" }, zx = {
  class: "time",
  "data-queue-time": ""
}, Ux = { class: "details" }, Gx = { "data-queue-type": "" }, Vx = { class: "failed" }, Kx = { class: "drop-inner" }, Yx = { class: "output" }, Qx = { class: "output-heading" }, Xx = ["href"], Jx = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(), o = tr((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = Xs(), r = C(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = C(() => {
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
    return me(() => n.expanded, h, { immediate: !0 }), wn(["output.*"], d, (p) => Li(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (u(), f("div", {
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
        m("div", Px, [
          m("span", jx, [
            e.run.section === "waiting" ? (u(), f("span", Fx, v(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: V(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, Wx))
          ]),
          m("code", Hx, v(e.run.line), 1),
          m("span", zx, v(c.value), 1),
          T(re, {
            class: V(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", Ux, [
          m("span", Gx, v(r.value), 1),
          e.run.owner_agent_id ? (u(), f(P, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = $e((b) => L(vt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), f(P, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : w("", !0),
          e.run.task_id ? (u(), f(P, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = $e((b) => L(vt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : w("", !0),
          e.run.state === "failed" ? (u(), f(P, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", Vx, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : w("", !0)
        ])
      ], 40, Dx),
      m("div", {
        class: V(["drop", { open: e.expanded }])
      }, [
        m("div", Kx, [
          m("div", Yx, [
            m("div", Qx, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Xx)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && L(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              K(v(e.run.line), 1),
              L(l).length ? (u(), f(P, { key: 0 }, [
                K(v(`
` + L(l).join(`
`)), 1)
              ], 64)) : w("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, qx));
  }
}, Zx = /* @__PURE__ */ U(Jx, [["__scopeId", "data-v-18099d0b"]]), e8 = {
  class: "process-queue",
  "data-test-queue": ""
}, t8 = { class: "scroll" }, n8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, a8 = ["data-queue-empty"], ts = 20, s8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = A(""), s = A([]), o = A(ts), l = C(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const r = C(() => n.value ? [
      { type: "running", heading: "Running", icon: "start", rows: n.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: n.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: n.value.recent, empty: "Nothing has run yet." }
    ].flatMap((y) => [
      { key: `band:${y.type}`, section: y },
      ...y.rows.length ? y.rows.map((b, E) => ({ key: `run:${b.id}`, run: b, position: E + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
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
    return wn(["process.*", "setting.*"], d), Me(d), (p, y) => (u(), f("article", e8, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", t8, [
        a.value ? (u(), f("p", n8, v(a.value), 1)) : w("", !0),
        n.value ? (u(), f(P, { key: 1 }, [
          T(Nx, {
            queue: n.value,
            read: e.read,
            onSaved: d
          }, null, 8, ["queue", "read"]),
          T(Os, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: j(() => [
              (u(!0), f(P, null, ae(r.value, (b) => (u(), f(P, {
                key: b.key
              }, [
                b.run ? (u(), F(Zx, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (E) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (u(), f("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, v(b.section.empty), 9, a8)) : (u(), F(Ft, {
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
          }, "Show older commands")) : w("", !0)
        ], 64)) : a.value ? w("", !0) : (u(), F(Ke, { key: 2 }))
      ])
    ]));
  }
}, oC = /* @__PURE__ */ U(s8, [["__scopeId", "data-v-d9b6ef6b"]]), o8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, l8 = ["aria-expanded"], i8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, r8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, u8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, c8 = {
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
    const t = e, n = A(t.open), a = A(0), s = A(0), o = A("");
    let l = 0;
    async function i() {
      const r = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], d = await t.read(c);
      r === l && (o.value = d.ok ? "" : d.error, d.ok && (a.value = d.value.total), s.value += 1);
    }
    return me(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), wn(["link.*", "phase.*", "phase_task.*"], i), (r, c) => (u(), f(P, null, [
      a.value ? (u(), f("section", o8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", i8, v(a.value), 1),
          T(Vt, { open: n.value }, null, 8, ["open"])
        ], 8, l8),
        m("div", {
          class: V(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", r8, [
            T(Qc, {
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
          ])) : w("", !0)
        ], 2)
      ])) : w("", !0),
      o.value ? (u(), f("p", u8, v(o.value), 1)) : w("", !0)
    ], 64));
  }
}, d8 = /* @__PURE__ */ U(c8, [["__scopeId", "data-v-479ab50f"]]), f8 = ["placeholder"], h8 = { class: "actions" }, m8 = { class: "error" }, p8 = {
  key: 1,
  class: "card closed"
}, g8 = { class: "mark" }, v8 = { class: "prompt" }, y8 = {
  key: 0,
  class: "draft"
}, b8 = {
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
    const a = e, s = n, o = on(e, "draft"), l = on(e, "error"), i = A(!!l.value), r = A(!1), c = A(!1), d = A(null);
    async function h() {
      var b, E;
      i.value = !0, r.value = !1, await je(), (E = ((b = d.value) == null ? void 0 : b.querySelector("input")) || d.value) == null || E.focus();
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
        } catch (E) {
          o.value = b, l.value = E.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, E) => (u(), f("div", {
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
          "onUpdate:modelValue": E[0] || (E[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: E[1] || (E[1] = Mt((S) => L(Pi)(S, y), ["enter"]))
        }, null, 40, f8), [
          [Yn, o.value]
        ]),
        m("div", h8, [
          m("span", m8, v(l.value), 1),
          T(ge, {
            small: "",
            onClick: p
          }, {
            default: j(() => [...E[3] || (E[3] = [
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
            default: j(() => [...E[4] || (E[4] = [
              K("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", p8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", g8, [
            T(re, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", v8, v(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", y8, "Draft kept")) : w("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: E[2] || (E[2] = (S) => s("show"))
        }, [
          m("span", null, v(L(Jc)(e.count, "comment")), 1),
          T(re, {
            name: "down",
            size: 12
          })
        ])) : w("", !0)
      ]))
    ], 2));
  }
}, k8 = /* @__PURE__ */ U(b8, [["__scopeId", "data-v-b68baddd"]]), w8 = { wide: 1130 }, $8 = /\{([A-Za-z_]\w*)\}/g;
function Kn(e, t, n = {}) {
  return e.replace($8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const x8 = (e, t, n, a) => Kn(e.label, n, { row_id: a, id: a }) || e2(t, n, a), S8 = { class: "comment-side-head" }, M8 = {
  key: 0,
  class: "comment-none"
}, _8 = { key: 0 }, C8 = {
  key: 1,
  class: "comment-none"
}, E8 = {
  class: "comment",
  "data-comment": ""
}, A8 = {
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
      m("header", S8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        T(ma, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", M8, "No comments yet")) : w("", !0),
      (u(!0), f(P, null, ae(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", _8, v(a.quote), 1)) : w("", !0),
        a.revision ? (u(), f("span", C8, "Revision " + v(a.revision), 1)) : w("", !0),
        m("p", E8, v(e.words(a)), 1)
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
}, El = /* @__PURE__ */ U(A8, [["__scopeId", "data-v-276284a3"]]), O8 = { class: "resource-heading" }, T8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, I8 = {
  key: 1,
  class: "resource-abstract"
}, B8 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", O8, [
      e.title ? (u(), f("h2", T8, v(e.title), 1)) : w("", !0),
      e.abstract ? (u(), f("p", I8, v(e.abstract), 1)) : w("", !0)
    ]));
  }
}, R8 = /* @__PURE__ */ U(B8, [["__scopeId", "data-v-d65ef53f"]]), L8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, N8 = { class: "inspector-icons" }, q8 = { class: "inspector-icons-start" }, D8 = {
  class: "inspector-label",
  "data-resource-type": ""
}, P8 = { class: "inspector-icons-end" }, j8 = ["href"], F8 = {
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
    return (i, r) => (u(), f("header", L8, [
      m("div", N8, [
        m("span", q8, [
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
          })) : w("", !0),
          e.stepped ? (u(), f(P, { key: 1 }, [
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
          ], 64)) : w("", !0)
        ]),
        m("p", D8, v(e.label), 1),
        m("span", P8, [
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
          })) : w("", !0),
          o.value ? (u(), f("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this row",
            "aria-label": "Share this row",
            "data-resource-share": "",
            href: L(Nf)(s.value)
          }, [
            T(re, {
              name: "share",
              size: 13
            })
          ], 8, j8)) : w("", !0),
          e.embedded ? w("", !0) : (u(), F(ge, {
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
      T(R8, {
        title: e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, W8 = /* @__PURE__ */ U(F8, [["__scopeId", "data-v-2928b6ca"]]), H8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, z8 = { class: "field-name" }, U8 = {
  key: 1,
  class: "field-value"
}, G8 = ["onClick"], V8 = {
  key: 2,
  class: "field-value"
}, K8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", H8, [
      (u(!0), f(P, null, ae(e.fields, (o) => (u(), f(P, {
        key: o.name
      }, [
        m("p", z8, v(o.label), 1),
        o.isTime ? (u(), F(Ze, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", U8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, G8)
        ])) : (u(), f("p", V8, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, Y8 = /* @__PURE__ */ U(K8, [["__scopeId", "data-v-7e45afb5"]]);
async function Q8(e, t) {
  const n = await e(["agent", "show", String(t.agent_id)]);
  return n.ok ? n2(t, n.value) : "";
}
async function X8(e, t) {
  const n = await e(["actor", "show", String(t)]), a = n.ok && n.value.type === "agent" ? await e(["agent", "show", String(t)]) : { ok: !1 };
  return n.ok ? t2(n.value, a.ok ? a.value : null) : "";
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
    const n = e, a = t, s = /* @__PURE__ */ new Set(["question", "memory", "rule"]), o = C(() => n.catalogue.inspector(n.noun) ?? {
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
    }), l = A(null), i = A(""), r = A(""), c = A(""), d = A("details"), h = A(null), p = A(0);
    let y = 0;
    const b = C(() => ({ row_id: n.id, id: n.id })), E = C(() => l.value ? Kn(o.value.title, l.value, b.value) || Zw(n.noun, l.value, n.id) : ""), S = C(() => l.value ? x8(o.value, n.noun, l.value, n.id) : ""), x = C(() => S.value === E.value ? "" : S.value), B = C(() => l.value ? Kn(o.value.description, l.value, b.value) : ""), W = C(() => {
      var R, H, Q;
      return ((R = l.value) == null ? void 0 : R.body) || ((H = l.value) == null ? void 0 : H.brief) || (s.has(n.noun) ? (Q = l.value) == null ? void 0 : Q.text : "") || "";
    }), N = C(() => W.value ? zs(W.value, { env: "", rowNames: !1 }) : ""), k = C(() => a2(l.value, W.value, i.value, r.value)), z = C(() => o.value.comments && p.value >= w8.wide), D = C(() => o.value.comments && !z.value), q = (R) => o.value.components.filter((H) => (H.tab || "") === R).map((H) => H.window), M = C(() => [...new Set(o.value.components.map((R) => R.tab).filter(Boolean))]), O = C(() => M.value.length || D.value ? [{ key: "details", label: "Details" }, ...M.value.map((R) => ({ key: R, label: R })), ...D.value ? [{ key: "comments", label: "Comments" }] : []] : []), $ = zi(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (R) => n.read(R));
    async function g(R, H) {
      const Q = await H;
      return R === y ? Q : "";
    }
    async function _() {
      const R = ++y, H = await n.read(Kn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      R === y && (c.value = H.ok ? "" : H.error, H.ok && (l.value = H.value, l.value.creator_id && (i.value = await g(R, X8(n.read, l.value.creator_id))), l.value.agent_id && (r.value = await g(R, Q8(n.read, l.value)))));
    }
    me(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", _();
    }, { immediate: !0 }), wn(o.value.events, _), me($.open, (R) => R && D.value && (d.value = "comments"));
    let I = null;
    return Me(() => {
      var R;
      p.value = ((R = h.value) == null ? void 0 : R.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (I = new ResizeObserver(() => p.value = h.value.clientWidth), I.observe(h.value));
    }), Ie(() => I == null ? void 0 : I.disconnect()), (R, H) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      T(W8, {
        label: x.value,
        title: E.value,
        description: B.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.noun}s`, id: e.id },
        onClose: H[0] || (H[0] = (Q) => a("close")),
        onBack: H[1] || (H[1] = (Q) => a("back")),
        onStep: H[2] || (H[2] = (Q) => a("step", Q))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (u(), f("p", J8, v(c.value), 1)) : l.value ? (u(), f(P, { key: 2 }, [
        T(Ji, null, {
          default: j(() => [
            T(Fs, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: _
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", e3, [
          m("div", t3, [
            O.value.length ? (u(), f("div", n3, [
              T(jt, {
                options: O.value,
                value: d.value,
                onPick: H[3] || (H[3] = (Q) => d.value = Q)
              }, null, 8, ["options", "value"])
            ])) : w("", !0),
            m("div", a3, [
              T(Ut, { value: d.value }, {
                details: j(() => [
                  m("div", s3, [
                    N.value && !o.value.draws_text ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, o3)) : w("", !0),
                    o.value.lists_fields ? (u(), F(Y8, {
                      key: 1,
                      fields: k.value,
                      onPeek: H[4] || (H[4] = (Q) => a("open", Q))
                    }, null, 8, ["fields"])) : w("", !0)
                  ]),
                  T(vs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  T(El, {
                    below: "",
                    comments: L($).comments.value,
                    words: L($).words,
                    more: !!L($).nextPage.value,
                    loading: L($).loading.value,
                    failure: L($).failure.value,
                    onMore: L($).loadMore,
                    onClose: H[5] || (H[5] = (Q) => d.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: j(() => [
                  T(vs, {
                    names: q(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), F(d8, {
                key: 0,
                model: e.noun,
                id: e.id,
                read: e.read,
                kinds: o.value.links.kinds,
                open: o.value.links.open,
                "outside-plan": o.value.links.outside_plan,
                "page-size": o.value.links.page_size,
                onOpen: H[6] || (H[6] = (Q) => a("open", Q))
              }, null, 8, ["model", "id", "read", "kinds", "open", "outside-plan", "page-size"])) : w("", !0)
            ]),
            o.value.comments ? (u(), F(k8, {
              key: 1,
              send: L($).send,
              count: L($).total.value,
              onShow: H[7] || (H[7] = (Q) => D.value && (d.value = "comments"))
            }, null, 8, ["send", "count"])) : w("", !0)
          ]),
          z.value ? (u(), F(El, {
            key: 0,
            comments: L($).comments.value,
            words: L($).words,
            more: !!L($).nextPage.value,
            loading: L($).loading.value,
            failure: L($).failure.value,
            onMore: L($).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : w("", !0)
        ])
      ], 64)) : (u(), f("div", Z8, [
        T(Ke)
      ]))
    ], 512));
  }
}, i3 = /* @__PURE__ */ U(l3, [["__scopeId", "data-v-e194a998"]]), lC = {
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
    const t = Se(Ds);
    return (n, a) => (u(), F(i3, Pe(n.$props, {
      catalogue: L(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, r3 = { class: "facts" }, u3 = { class: "fact wide" }, c3 = ["title"], d3 = {
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
    const n = na.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var r, c;
      return u(), f("div", r3, [
        m("div", u3, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (d) => L(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, c3)) : (u(), f("span", d3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (u(), f("div", f3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", h3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : w("", !0),
        e.task.helper_id ? (u(), f(P, { key: 1 }, [
          m("div", m3, [
            m("span", p3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (d) => L(qe)(`agents:${e.task.helper_id}`))
            }, v(e.task.helper_name), 9, g3)
          ]),
          L(o).has(e.task.state) ? (u(), f("p", v3, v(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", y3, v(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : w("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", b3, [
          i[6] || (i[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", k3, "Agent " + v(e.task.holder_id), 1)
        ])) : w("", !0),
        m("div", w3, [
          m("span", $3, [
            i[7] || (i[7] = K(" Complexity ", -1)),
            T(oi, {
              lines: L(Xi).map((d, h) => `${h + 1}: ${d}`),
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
        m("div", x3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          T(jt, {
            options: L(n),
            value: String(L(Qi)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", S3, v(e.refusal), 1)) : w("", !0)
        ])
      ]);
    };
  }
}, _3 = /* @__PURE__ */ U(M3, [["__scopeId", "data-v-a8bf3e2c"]]);
function C3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
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
    return (a, s) => (u(), F(rt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: V(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        T(kn, { status: e.status }, null, 8, ["status"]),
        m("span", E3, v(e.number), 1),
        m("span", A3, v(e.title), 1),
        m("span", O3, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ns = /* @__PURE__ */ U(T3, [["__scopeId", "data-v-f6417ae8"]]), I3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, B3 = { class: "level" }, R3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1);
    me(() => n.task.id, () => s.value = !1);
    const o = C(() => C3(n.task.id, n.graph)), l = C(() => s.value ? o.value.above : o.value.above.slice(-1)), i = C(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = C(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, p = !1) => ({ status: cn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), f("section", I3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(P, null, ae(l.value, (y) => (u(), f(P, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", B3, [
          (u(!0), f(P, null, ae(y, (b) => (u(), F(ns, Pe({
            key: b.id,
            ref_for: !0
          }, d(b), {
            onSelect: p[0] || (p[0] = (E) => a("select", E))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      T(ns, au(su(d(e.task, !0))), null, 16),
      (u(!0), f(P, null, ae(i.value, (y) => (u(), f(P, {
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
      }, v(s.value ? "Show less" : `Show the whole chain (${r.value} more)`), 1)) : w("", !0)
    ])) : w("", !0);
  }
}, L3 = /* @__PURE__ */ U(R3, [["__scopeId", "data-v-79c52417"]]), N3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, q3 = ["datetime"], D3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", N3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(P, null, ae(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, q3),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : w("", !0);
  }
}, P3 = /* @__PURE__ */ U(D3, [["__scopeId", "data-v-b41f213b"]]), j3 = {
  class: "part",
  "data-resource-waits": ""
}, F3 = ["onClick"], W3 = { class: "wait-id" }, H3 = { class: "wait-title" }, z3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", j3, [
      m("h4", null, v(e.title), 1),
      (u(!0), f(P, null, ae(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        T(kn, {
          status: L(cn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", W3, v(o.id), 1),
        m("span", H3, v(o.title), 1)
      ], 8, F3))), 128))
    ]));
  }
}, Al = /* @__PURE__ */ U(z3, [["__scopeId", "data-v-8fb2e251"]]), U3 = {
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
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = A(!1), l = C(() => a.task.waits.filter((r) => !n.has(r.state))), i = C(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(P, null, [
      l.value.length ? (u(), F(Al, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : w("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", U3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", G3, v(e.task.outcome), 1)
      ])) : w("", !0),
      e.task.brief ? (u(), f("section", V3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: V(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > K3 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : w("", !0)
      ])) : w("", !0),
      i.value.length ? (u(), F(Al, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : w("", !0)
    ], 64));
  }
}, Q3 = /* @__PURE__ */ U(Y3, [["__scopeId", "data-v-4a3f1e79"]]), X3 = {
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
      return u(), f("div", X3, [
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
          m("span", J3, [
            o[5] || (o[5] = K(" since ", -1)),
            T(Ze, {
              at: L(hh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", Z3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", eS, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", tS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", nS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", aS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", sS, v(e.task.reason), 1)
        ])) : w("", !0),
        e.graph ? (u(), F(L3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : w("", !0),
        T(_3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        T(Q3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        T(P3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, iC = /* @__PURE__ */ U(oS, [["__scopeId", "data-v-7e73fa21"]]), lS = 50, iS = { messages: 25 }, rS = (e) => iS[e] || lS, uS = {
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
    const t = e, n = A([]), a = A(1), s = A(!0), o = A(!0), l = A("");
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
        String(rS("task_logs")),
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
    }), (c, d) => (u(), f("section", uS, [
      o.value ? (u(), F(Ke, { key: 0 })) : l.value ? (u(), f(P, { key: 1 }, [
        m("p", cS, v(l.value), 1),
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
      ], 64)) : (u(), f(P, { key: 2 }, [
        n.value.length ? w("", !0) : (u(), f("p", dS, "No log entries yet.")),
        m("ol", fS, [
          (u(!0), f(P, null, ae(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: V(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, mS),
            m("p", null, v(h.line), 1)
          ], 10, hS))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", pS, [
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
        ])) : w("", !0)
      ], 64))
    ]));
  }
}, rC = /* @__PURE__ */ U(gS, [["__scopeId", "data-v-cfa43bf1"]]);
function vS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var as = { exports: {} }, Ol;
function yS() {
  return Ol || (Ol = 1, (function(e, t) {
    var n = (function() {
      var a = function(k, z) {
        var D = 236, q = 17, M = k, O = o[z], $ = null, g = 0, _ = null, I = [], R = {}, H = function(Y, X) {
          g = M * 4 + 17, $ = (function(G) {
            for (var J = new Array(G), Z = 0; Z < G; Z += 1) {
              J[Z] = new Array(G);
              for (var se = 0; se < G; se += 1)
                J[Z][se] = null;
            }
            return J;
          })(g), Q(0, 0), Q(g - 7, 0), Q(0, g - 7), pe(), le(), oe(Y, X), M >= 7 && xe(Y), _ == null && (_ = De(M, O, I)), ee(_, X);
        }, Q = function(Y, X) {
          for (var G = -1; G <= 7; G += 1)
            if (!(Y + G <= -1 || g <= Y + G))
              for (var J = -1; J <= 7; J += 1)
                X + J <= -1 || g <= X + J || (0 <= G && G <= 6 && (J == 0 || J == 6) || 0 <= J && J <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= J && J <= 4 ? $[Y + G][X + J] = !0 : $[Y + G][X + J] = !1);
        }, te = function() {
          for (var Y = 0, X = 0, G = 0; G < 8; G += 1) {
            H(!0, G);
            var J = i.getLostPoint(R);
            (G == 0 || Y > J) && (Y = J, X = G);
          }
          return X;
        }, le = function() {
          for (var Y = 8; Y < g - 8; Y += 1)
            $[Y][6] == null && ($[Y][6] = Y % 2 == 0);
          for (var X = 8; X < g - 8; X += 1)
            $[6][X] == null && ($[6][X] = X % 2 == 0);
        }, pe = function() {
          for (var Y = i.getPatternPosition(M), X = 0; X < Y.length; X += 1)
            for (var G = 0; G < Y.length; G += 1) {
              var J = Y[X], Z = Y[G];
              if ($[J][Z] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    se == -2 || se == 2 || ce == -2 || ce == 2 || se == 0 && ce == 0 ? $[J + se][Z + ce] = !0 : $[J + se][Z + ce] = !1;
            }
        }, xe = function(Y) {
          for (var X = i.getBCHTypeNumber(M), G = 0; G < 18; G += 1) {
            var J = !Y && (X >> G & 1) == 1;
            $[Math.floor(G / 3)][G % 3 + g - 8 - 3] = J;
          }
          for (var G = 0; G < 18; G += 1) {
            var J = !Y && (X >> G & 1) == 1;
            $[G % 3 + g - 8 - 3][Math.floor(G / 3)] = J;
          }
        }, oe = function(Y, X) {
          for (var G = O << 3 | X, J = i.getBCHTypeInfo(G), Z = 0; Z < 15; Z += 1) {
            var se = !Y && (J >> Z & 1) == 1;
            Z < 6 ? $[Z][8] = se : Z < 8 ? $[Z + 1][8] = se : $[g - 15 + Z][8] = se;
          }
          for (var Z = 0; Z < 15; Z += 1) {
            var se = !Y && (J >> Z & 1) == 1;
            Z < 8 ? $[8][g - Z - 1] = se : Z < 9 ? $[8][15 - Z - 1 + 1] = se : $[8][15 - Z - 1] = se;
          }
          $[g - 8][8] = !Y;
        }, ee = function(Y, X) {
          for (var G = -1, J = g - 1, Z = 7, se = 0, ce = i.getMaskFunction(X), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if ($[J][ue - we] == null) {
                  var Ee = !1;
                  se < Y.length && (Ee = (Y[se] >>> Z & 1) == 1);
                  var he = ce(J, ue - we);
                  he && (Ee = !Ee), $[J][ue - we] = Ee, Z -= 1, Z == -1 && (se += 1, Z = 7);
                }
              if (J += G, J < 0 || g <= J) {
                J -= G, G = -G;
                break;
              }
            }
        }, ne = function(Y, X) {
          for (var G = 0, J = 0, Z = 0, se = new Array(X.length), ce = new Array(X.length), ue = 0; ue < X.length; ue += 1) {
            var we = X[ue].dataCount, Ee = X[ue].totalCount - we;
            J = Math.max(J, we), Z = Math.max(Z, Ee), se[ue] = new Array(we);
            for (var he = 0; he < se[ue].length; he += 1)
              se[ue][he] = 255 & Y.getBuffer()[he + G];
            G += we;
            var Fe = i.getErrorCorrectPolynomial(Ee), We = c(se[ue], Fe.getLength() - 1), fo = We.mod(Fe);
            ce[ue] = new Array(Fe.getLength() - 1);
            for (var he = 0; he < ce[ue].length; he += 1) {
              var ho = he + fo.getLength() - ce[ue].length;
              ce[ue][he] = ho >= 0 ? fo.getAt(ho) : 0;
            }
          }
          for (var mo = 0, he = 0; he < X.length; he += 1)
            mo += X[he].totalCount;
          for (var $a = new Array(mo), Cn = 0, he = 0; he < J; he += 1)
            for (var ue = 0; ue < X.length; ue += 1)
              he < se[ue].length && ($a[Cn] = se[ue][he], Cn += 1);
          for (var he = 0; he < Z; he += 1)
            for (var ue = 0; ue < X.length; ue += 1)
              he < ce[ue].length && ($a[Cn] = ce[ue][he], Cn += 1);
          return $a;
        }, De = function(Y, X, G) {
          for (var J = d.getRSBlocks(Y, X), Z = h(), se = 0; se < G.length; se += 1) {
            var ce = G[se];
            Z.put(ce.getMode(), 4), Z.put(ce.getLength(), i.getLengthInBits(ce.getMode(), Y)), ce.write(Z);
          }
          for (var ue = 0, se = 0; se < J.length; se += 1)
            ue += J[se].dataCount;
          if (Z.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + Z.getLengthInBits() + ">" + ue * 8 + ")";
          for (Z.getLengthInBits() + 4 <= ue * 8 && Z.put(0, 4); Z.getLengthInBits() % 8 != 0; )
            Z.putBit(!1);
          for (; !(Z.getLengthInBits() >= ue * 8 || (Z.put(D, 8), Z.getLengthInBits() >= ue * 8)); )
            Z.put(q, 8);
          return ne(Z, J);
        };
        R.addData = function(Y, X) {
          X = X || "Byte";
          var G = null;
          switch (X) {
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
              G = E(Y);
              break;
            default:
              throw "mode:" + X;
          }
          I.push(G), _ = null;
        }, R.isDark = function(Y, X) {
          if (Y < 0 || g <= Y || X < 0 || g <= X)
            throw Y + "," + X;
          return $[Y][X];
        }, R.getModuleCount = function() {
          return g;
        }, R.make = function() {
          if (M < 1) {
            for (var Y = 1; Y < 40; Y++) {
              for (var X = d.getRSBlocks(Y, O), G = h(), J = 0; J < I.length; J++) {
                var Z = I[J];
                G.put(Z.getMode(), 4), G.put(Z.getLength(), i.getLengthInBits(Z.getMode(), Y)), Z.write(G);
              }
              for (var se = 0, J = 0; J < X.length; J++)
                se += X[J].dataCount;
              if (G.getLengthInBits() <= se * 8)
                break;
            }
            M = Y;
          }
          H(!1, te());
        }, R.createTableTag = function(Y, X) {
          Y = Y || 2, X = typeof X > "u" ? Y * 4 : X;
          var G = "";
          G += '<table style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: " + X + "px;", G += '">', G += "<tbody>";
          for (var J = 0; J < R.getModuleCount(); J += 1) {
            G += "<tr>";
            for (var Z = 0; Z < R.getModuleCount(); Z += 1)
              G += '<td style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: 0px;", G += " width: " + Y + "px;", G += " height: " + Y + "px;", G += " background-color: ", G += R.isDark(J, Z) ? "#000000" : "#ffffff", G += ";", G += '"/>';
            G += "</tr>";
          }
          return G += "</tbody>", G += "</table>", G;
        }, R.createSvgTag = function(Y, X, G, J) {
          var Z = {};
          typeof arguments[0] == "object" && (Z = arguments[0], Y = Z.cellSize, X = Z.margin, G = Z.alt, J = Z.title), Y = Y || 2, X = typeof X > "u" ? Y * 4 : X, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-description" : null, J = typeof J == "string" ? { text: J } : J || {}, J.text = J.text || null, J.id = J.text ? J.id || "qrcode-title" : null;
          var se = R.getModuleCount() * Y + X * 2, ce, ue, we, Ee, he = "", Fe;
          for (Fe = "l" + Y + ",0 0," + Y + " -" + Y + ",0 0,-" + Y + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += Z.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', he += ' viewBox="0 0 ' + se + " " + se + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += J.text || G.text ? ' role="img" aria-labelledby="' + Ot([J.id, G.id].join(" ").trim()) + '"' : "", he += ">", he += J.text ? '<title id="' + Ot(J.id) + '">' + Ot(J.text) + "</title>" : "", he += G.text ? '<description id="' + Ot(G.id) + '">' + Ot(G.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', we = 0; we < R.getModuleCount(); we += 1)
            for (Ee = we * Y + X, ce = 0; ce < R.getModuleCount(); ce += 1)
              R.isDark(we, ce) && (ue = ce * Y + X, he += "M" + ue + "," + Ee + Fe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, R.createDataURL = function(Y, X) {
          Y = Y || 2, X = typeof X > "u" ? Y * 4 : X;
          var G = R.getModuleCount() * Y + X * 2, J = X, Z = G - X;
          return N(G, G, function(se, ce) {
            if (J <= se && se < Z && J <= ce && ce < Z) {
              var ue = Math.floor((se - J) / Y), we = Math.floor((ce - J) / Y);
              return R.isDark(we, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(Y, X, G) {
          Y = Y || 2, X = typeof X > "u" ? Y * 4 : X;
          var J = R.getModuleCount() * Y + X * 2, Z = "";
          return Z += "<img", Z += ' src="', Z += R.createDataURL(Y, X), Z += '"', Z += ' width="', Z += J, Z += '"', Z += ' height="', Z += J, Z += '"', G && (Z += ' alt="', Z += Ot(G), Z += '"'), Z += "/>", Z;
        };
        var Ot = function(Y) {
          for (var X = "", G = 0; G < Y.length; G += 1) {
            var J = Y.charAt(G);
            switch (J) {
              case "<":
                X += "&lt;";
                break;
              case ">":
                X += "&gt;";
                break;
              case "&":
                X += "&amp;";
                break;
              case '"':
                X += "&quot;";
                break;
              default:
                X += J;
                break;
            }
          }
          return X;
        }, Ur = function(Y) {
          var X = 1;
          Y = typeof Y > "u" ? X * 2 : Y;
          var G = R.getModuleCount() * X + Y * 2, J = Y, Z = G - Y, se, ce, ue, we, Ee, he = {
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
            for (ue = Math.floor((se - J) / X), we = Math.floor((se + 1 - J) / X), ce = 0; ce < G; ce += 1)
              Ee = "█", J <= ce && ce < Z && J <= se && se < Z && R.isDark(ue, Math.floor((ce - J) / X)) && (Ee = " "), J <= ce && ce < Z && J <= se + 1 && se + 1 < Z && R.isDark(we, Math.floor((ce - J) / X)) ? Ee += " " : Ee += "█", We += Y < 1 && se + 1 >= Z ? Fe[Ee] : he[Ee];
            We += `
`;
          }
          return G % 2 && Y > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return R.createASCII = function(Y, X) {
          if (Y = Y || 1, Y < 2)
            return Ur(X);
          Y -= 1, X = typeof X > "u" ? Y * 2 : X;
          var G = R.getModuleCount() * Y + X * 2, J = X, Z = G - X, se, ce, ue, we, Ee = Array(Y + 1).join("██"), he = Array(Y + 1).join("  "), Fe = "", We = "";
          for (se = 0; se < G; se += 1) {
            for (ue = Math.floor((se - J) / Y), We = "", ce = 0; ce < G; ce += 1)
              we = 1, J <= ce && ce < Z && J <= se && se < Z && R.isDark(ue, Math.floor((ce - J) / Y)) && (we = 0), We += we ? Ee : he;
            for (ue = 0; ue < Y; ue += 1)
              Fe += We + `
`;
          }
          return Fe.substring(0, Fe.length - 1);
        }, R.renderTo2dContext = function(Y, X) {
          X = X || 2;
          for (var G = R.getModuleCount(), J = 0; J < G; J++)
            for (var Z = 0; Z < G; Z++)
              Y.fillStyle = R.isDark(J, Z) ? "black" : "white", Y.fillRect(J * X, Z * X, X, X);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(k) {
          for (var z = [], D = 0; D < k.length; D += 1) {
            var q = k.charCodeAt(D);
            z.push(q & 255);
          }
          return z;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(k, z) {
        var D = (function() {
          for (var M = B(k), O = function() {
            var le = M.read();
            if (le == -1) throw "eof";
            return le;
          }, $ = 0, g = {}; ; ) {
            var _ = M.read();
            if (_ == -1) break;
            var I = O(), R = O(), H = O(), Q = String.fromCharCode(_ << 8 | I), te = R << 8 | H;
            g[Q] = te, $ += 1;
          }
          if ($ != z)
            throw $ + " != " + z;
          return g;
        })(), q = 63;
        return function(M) {
          for (var O = [], $ = 0; $ < M.length; $ += 1) {
            var g = M.charCodeAt($);
            if (g < 128)
              O.push(g);
            else {
              var _ = D[M.charAt($)];
              typeof _ == "number" ? (_ & 255) == _ ? O.push(_) : (O.push(_ >>> 8), O.push(_ & 255)) : O.push(q);
            }
          }
          return O;
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
        var k = [
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
        ], z = 1335, D = 7973, q = 21522, M = {}, O = function($) {
          for (var g = 0; $ != 0; )
            g += 1, $ >>>= 1;
          return g;
        };
        return M.getBCHTypeInfo = function($) {
          for (var g = $ << 10; O(g) - O(z) >= 0; )
            g ^= z << O(g) - O(z);
          return ($ << 10 | g) ^ q;
        }, M.getBCHTypeNumber = function($) {
          for (var g = $ << 12; O(g) - O(D) >= 0; )
            g ^= D << O(g) - O(D);
          return $ << 12 | g;
        }, M.getPatternPosition = function($) {
          return k[$ - 1];
        }, M.getMaskFunction = function($) {
          switch ($) {
            case l.PATTERN000:
              return function(g, _) {
                return (g + _) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, _) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, _) {
                return _ % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, _) {
                return (g + _) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, _) {
                return (Math.floor(g / 2) + Math.floor(_ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, _) {
                return g * _ % 2 + g * _ % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, _) {
                return (g * _ % 2 + g * _ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, _) {
                return (g * _ % 3 + (g + _) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + $;
          }
        }, M.getErrorCorrectPolynomial = function($) {
          for (var g = c([1], 0), _ = 0; _ < $; _ += 1)
            g = g.multiply(c([1, r.gexp(_)], 0));
          return g;
        }, M.getLengthInBits = function($, g) {
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
        }, M.getLostPoint = function($) {
          for (var g = $.getModuleCount(), _ = 0, I = 0; I < g; I += 1)
            for (var R = 0; R < g; R += 1) {
              for (var H = 0, Q = $.isDark(I, R), te = -1; te <= 1; te += 1)
                if (!(I + te < 0 || g <= I + te))
                  for (var le = -1; le <= 1; le += 1)
                    R + le < 0 || g <= R + le || te == 0 && le == 0 || Q == $.isDark(I + te, R + le) && (H += 1);
              H > 5 && (_ += 3 + H - 5);
            }
          for (var I = 0; I < g - 1; I += 1)
            for (var R = 0; R < g - 1; R += 1) {
              var pe = 0;
              $.isDark(I, R) && (pe += 1), $.isDark(I + 1, R) && (pe += 1), $.isDark(I, R + 1) && (pe += 1), $.isDark(I + 1, R + 1) && (pe += 1), (pe == 0 || pe == 4) && (_ += 3);
            }
          for (var I = 0; I < g; I += 1)
            for (var R = 0; R < g - 6; R += 1)
              $.isDark(I, R) && !$.isDark(I, R + 1) && $.isDark(I, R + 2) && $.isDark(I, R + 3) && $.isDark(I, R + 4) && !$.isDark(I, R + 5) && $.isDark(I, R + 6) && (_ += 40);
          for (var R = 0; R < g; R += 1)
            for (var I = 0; I < g - 6; I += 1)
              $.isDark(I, R) && !$.isDark(I + 1, R) && $.isDark(I + 2, R) && $.isDark(I + 3, R) && $.isDark(I + 4, R) && !$.isDark(I + 5, R) && $.isDark(I + 6, R) && (_ += 40);
          for (var xe = 0, R = 0; R < g; R += 1)
            for (var I = 0; I < g; I += 1)
              $.isDark(I, R) && (xe += 1);
          var oe = Math.abs(100 * xe / g / g - 50) / 5;
          return _ += oe * 10, _;
        }, M;
      })(), r = (function() {
        for (var k = new Array(256), z = new Array(256), D = 0; D < 8; D += 1)
          k[D] = 1 << D;
        for (var D = 8; D < 256; D += 1)
          k[D] = k[D - 4] ^ k[D - 5] ^ k[D - 6] ^ k[D - 8];
        for (var D = 0; D < 255; D += 1)
          z[k[D]] = D;
        var q = {};
        return q.glog = function(M) {
          if (M < 1)
            throw "glog(" + M + ")";
          return z[M];
        }, q.gexp = function(M) {
          for (; M < 0; )
            M += 255;
          for (; M >= 256; )
            M -= 255;
          return k[M];
        }, q;
      })();
      function c(k, z) {
        if (typeof k.length > "u")
          throw k.length + "/" + z;
        var D = (function() {
          for (var M = 0; M < k.length && k[M] == 0; )
            M += 1;
          for (var O = new Array(k.length - M + z), $ = 0; $ < k.length - M; $ += 1)
            O[$] = k[$ + M];
          return O;
        })(), q = {};
        return q.getAt = function(M) {
          return D[M];
        }, q.getLength = function() {
          return D.length;
        }, q.multiply = function(M) {
          for (var O = new Array(q.getLength() + M.getLength() - 1), $ = 0; $ < q.getLength(); $ += 1)
            for (var g = 0; g < M.getLength(); g += 1)
              O[$ + g] ^= r.gexp(r.glog(q.getAt($)) + r.glog(M.getAt(g)));
          return c(O, 0);
        }, q.mod = function(M) {
          if (q.getLength() - M.getLength() < 0)
            return q;
          for (var O = r.glog(q.getAt(0)) - r.glog(M.getAt(0)), $ = new Array(q.getLength()), g = 0; g < q.getLength(); g += 1)
            $[g] = q.getAt(g);
          for (var g = 0; g < M.getLength(); g += 1)
            $[g] ^= r.gexp(r.glog(M.getAt(g)) + O);
          return c($, 0).mod(M);
        }, q;
      }
      var d = (function() {
        var k = [
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
        ], z = function(M, O) {
          var $ = {};
          return $.totalCount = M, $.dataCount = O, $;
        }, D = {}, q = function(M, O) {
          switch (O) {
            case o.L:
              return k[(M - 1) * 4 + 0];
            case o.M:
              return k[(M - 1) * 4 + 1];
            case o.Q:
              return k[(M - 1) * 4 + 2];
            case o.H:
              return k[(M - 1) * 4 + 3];
            default:
              return;
          }
        };
        return D.getRSBlocks = function(M, O) {
          var $ = q(M, O);
          if (typeof $ > "u")
            throw "bad rs block @ typeNumber:" + M + "/errorCorrectionLevel:" + O;
          for (var g = $.length / 3, _ = [], I = 0; I < g; I += 1)
            for (var R = $[I * 3 + 0], H = $[I * 3 + 1], Q = $[I * 3 + 2], te = 0; te < R; te += 1)
              _.push(z(H, Q));
          return _;
        }, D;
      })(), h = function() {
        var k = [], z = 0, D = {};
        return D.getBuffer = function() {
          return k;
        }, D.getAt = function(q) {
          var M = Math.floor(q / 8);
          return (k[M] >>> 7 - q % 8 & 1) == 1;
        }, D.put = function(q, M) {
          for (var O = 0; O < M; O += 1)
            D.putBit((q >>> M - O - 1 & 1) == 1);
        }, D.getLengthInBits = function() {
          return z;
        }, D.putBit = function(q) {
          var M = Math.floor(z / 8);
          k.length <= M && k.push(0), q && (k[M] |= 128 >>> z % 8), z += 1;
        }, D;
      }, p = function(k) {
        var z = s.MODE_NUMBER, D = k, q = {};
        q.getMode = function() {
          return z;
        }, q.getLength = function($) {
          return D.length;
        }, q.write = function($) {
          for (var g = D, _ = 0; _ + 2 < g.length; )
            $.put(M(g.substring(_, _ + 3)), 10), _ += 3;
          _ < g.length && (g.length - _ == 1 ? $.put(M(g.substring(_, _ + 1)), 4) : g.length - _ == 2 && $.put(M(g.substring(_, _ + 2)), 7));
        };
        var M = function($) {
          for (var g = 0, _ = 0; _ < $.length; _ += 1)
            g = g * 10 + O($.charAt(_));
          return g;
        }, O = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          throw "illegal char :" + $;
        };
        return q;
      }, y = function(k) {
        var z = s.MODE_ALPHA_NUM, D = k, q = {};
        q.getMode = function() {
          return z;
        }, q.getLength = function(O) {
          return D.length;
        }, q.write = function(O) {
          for (var $ = D, g = 0; g + 1 < $.length; )
            O.put(
              M($.charAt(g)) * 45 + M($.charAt(g + 1)),
              11
            ), g += 2;
          g < $.length && O.put(M($.charAt(g)), 6);
        };
        var M = function(O) {
          if ("0" <= O && O <= "9")
            return O.charCodeAt(0) - 48;
          if ("A" <= O && O <= "Z")
            return O.charCodeAt(0) - 65 + 10;
          switch (O) {
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
              throw "illegal char :" + O;
          }
        };
        return q;
      }, b = function(k) {
        var z = s.MODE_8BIT_BYTE, D = a.stringToBytes(k), q = {};
        return q.getMode = function() {
          return z;
        }, q.getLength = function(M) {
          return D.length;
        }, q.write = function(M) {
          for (var O = 0; O < D.length; O += 1)
            M.put(D[O], 8);
        }, q;
      }, E = function(k) {
        var z = s.MODE_KANJI, D = a.stringToBytesFuncs.SJIS;
        if (!D)
          throw "sjis not supported.";
        (function(O, $) {
          var g = D(O);
          if (g.length != 2 || (g[0] << 8 | g[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var q = D(k), M = {};
        return M.getMode = function() {
          return z;
        }, M.getLength = function(O) {
          return ~~(q.length / 2);
        }, M.write = function(O) {
          for (var $ = q, g = 0; g + 1 < $.length; ) {
            var _ = (255 & $[g]) << 8 | 255 & $[g + 1];
            if (33088 <= _ && _ <= 40956)
              _ -= 33088;
            else if (57408 <= _ && _ <= 60351)
              _ -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + _;
            _ = (_ >>> 8 & 255) * 192 + (_ & 255), O.put(_, 13), g += 2;
          }
          if (g < $.length)
            throw "illegal char at " + (g + 1);
        }, M;
      }, S = function() {
        var k = [], z = {};
        return z.writeByte = function(D) {
          k.push(D & 255);
        }, z.writeShort = function(D) {
          z.writeByte(D), z.writeByte(D >>> 8);
        }, z.writeBytes = function(D, q, M) {
          q = q || 0, M = M || D.length;
          for (var O = 0; O < M; O += 1)
            z.writeByte(D[O + q]);
        }, z.writeString = function(D) {
          for (var q = 0; q < D.length; q += 1)
            z.writeByte(D.charCodeAt(q));
        }, z.toByteArray = function() {
          return k;
        }, z.toString = function() {
          var D = "";
          D += "[";
          for (var q = 0; q < k.length; q += 1)
            q > 0 && (D += ","), D += k[q];
          return D += "]", D;
        }, z;
      }, x = function() {
        var k = 0, z = 0, D = 0, q = "", M = {}, O = function(g) {
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
        return M.writeByte = function(g) {
          for (k = k << 8 | g & 255, z += 8, D += 1; z >= 6; )
            O(k >>> z - 6), z -= 6;
        }, M.flush = function() {
          if (z > 0 && (O(k << 6 - z), k = 0, z = 0), D % 3 != 0)
            for (var g = 3 - D % 3, _ = 0; _ < g; _ += 1)
              q += "=";
        }, M.toString = function() {
          return q;
        }, M;
      }, B = function(k) {
        var z = k, D = 0, q = 0, M = 0, O = {};
        O.read = function() {
          for (; M < 8; ) {
            if (D >= z.length) {
              if (M == 0)
                return -1;
              throw "unexpected end of file./" + M;
            }
            var g = z.charAt(D);
            if (D += 1, g == "=")
              return M = 0, -1;
            if (g.match(/^\s$/))
              continue;
            q = q << 6 | $(g.charCodeAt(0)), M += 6;
          }
          var _ = q >>> M - 8 & 255;
          return M -= 8, _;
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
        return O;
      }, W = function(k, z) {
        var D = k, q = z, M = new Array(k * z), O = {};
        O.setPixel = function(I, R, H) {
          M[R * D + I] = H;
        }, O.write = function(I) {
          I.writeString("GIF87a"), I.writeShort(D), I.writeShort(q), I.writeByte(128), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(255), I.writeByte(255), I.writeByte(255), I.writeString(","), I.writeShort(0), I.writeShort(0), I.writeShort(D), I.writeShort(q), I.writeByte(0);
          var R = 2, H = g(R);
          I.writeByte(R);
          for (var Q = 0; H.length - Q > 255; )
            I.writeByte(255), I.writeBytes(H, Q, 255), Q += 255;
          I.writeByte(H.length - Q), I.writeBytes(H, Q, H.length - Q), I.writeByte(0), I.writeString(";");
        };
        var $ = function(I) {
          var R = I, H = 0, Q = 0, te = {};
          return te.write = function(le, pe) {
            if (le >>> pe)
              throw "length over";
            for (; H + pe >= 8; )
              R.writeByte(255 & (le << H | Q)), pe -= 8 - H, le >>>= 8 - H, Q = 0, H = 0;
            Q = le << H | Q, H = H + pe;
          }, te.flush = function() {
            H > 0 && R.writeByte(Q);
          }, te;
        }, g = function(I) {
          for (var R = 1 << I, H = (1 << I) + 1, Q = I + 1, te = _(), le = 0; le < R; le += 1)
            te.add(String.fromCharCode(le));
          te.add(String.fromCharCode(R)), te.add(String.fromCharCode(H));
          var pe = S(), xe = $(pe);
          xe.write(R, Q);
          var oe = 0, ee = String.fromCharCode(M[oe]);
          for (oe += 1; oe < M.length; ) {
            var ne = String.fromCharCode(M[oe]);
            oe += 1, te.contains(ee + ne) ? ee = ee + ne : (xe.write(te.indexOf(ee), Q), te.size() < 4095 && (te.size() == 1 << Q && (Q += 1), te.add(ee + ne)), ee = ne);
          }
          return xe.write(te.indexOf(ee), Q), xe.write(H, Q), xe.flush(), pe.toByteArray();
        }, _ = function() {
          var I = {}, R = 0, H = {};
          return H.add = function(Q) {
            if (H.contains(Q))
              throw "dup key:" + Q;
            I[Q] = R, R += 1;
          }, H.size = function() {
            return R;
          }, H.indexOf = function(Q) {
            return I[Q];
          }, H.contains = function(Q) {
            return typeof I[Q] < "u";
          }, H;
        };
        return O;
      }, N = function(k, z, D) {
        for (var q = W(k, z), M = 0; M < z; M += 1)
          for (var O = 0; O < k; O += 1)
            q.setPixel(O, M, D(O, M));
        var $ = S();
        q.write($);
        for (var g = x(), _ = $.toByteArray(), I = 0; I < _.length; I += 1)
          g.writeByte(_[I]);
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
var bS = yS();
const kS = /* @__PURE__ */ vS(bS), wS = ["width", "height", "viewBox"], $S = ["width", "height"], xS = ["d"], SS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = C(() => {
      const a = kS(0, "M");
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
      }, null, 8, $S),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, xS)
    ], 8, wS));
  }
}, uC = /* @__PURE__ */ U(SS, [["__scopeId", "data-v-489f0852"]]), MS = {
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
}, cC = /* @__PURE__ */ U(MS, [["__scopeId", "data-v-47e67f04"]]);
function dC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const fC = ou(() => import("./VoiceFigure-BrxygSx9.js").then((e) => e.V)), hC = "1.2.0", mC = "3.5";
export {
  If as $,
  Ae as A,
  Te as B,
  ya as C,
  ut as D,
  p_ as E,
  C$ as F,
  oM as G,
  d_ as H,
  i$ as I,
  R$ as J,
  At as K,
  AS as L,
  oo as M,
  j$ as N,
  B$ as O,
  va as P,
  TM as Q,
  D6 as R,
  Gn as S,
  NM as T,
  O6 as U,
  Oe as V,
  sa as W,
  A6 as X,
  E6 as Y,
  Tf as Z,
  U as _,
  k6 as a,
  ZM as a$,
  D$ as a0,
  P6 as a1,
  j6 as a2,
  Le as a3,
  X6 as a4,
  Q6 as a5,
  _t as a6,
  F6 as a7,
  uM as a8,
  u6 as a9,
  UM as aA,
  EM as aB,
  Q5 as aC,
  hM as aD,
  mM as aE,
  g_ as aF,
  Cr as aG,
  LM as aH,
  xn as aI,
  p6 as aJ,
  f6 as aK,
  o_ as aL,
  Sn as aM,
  u_ as aN,
  sM as aO,
  AM as aP,
  OM as aQ,
  CM as aR,
  hn as aS,
  xt as aT,
  c6 as aU,
  j2 as aV,
  MM as aW,
  N6 as aX,
  Mr as aY,
  Wt as aZ,
  Kt as a_,
  e_ as aa,
  i_ as ab,
  y6 as ac,
  T6 as ad,
  I6 as ae,
  K6 as af,
  Y6 as ag,
  J6 as ah,
  S6 as ai,
  kl as aj,
  W6 as ak,
  rM as al,
  k_ as am,
  wM as an,
  bM as ao,
  yM as ap,
  Z6 as aq,
  G6 as ar,
  U6 as as,
  V6 as at,
  RM as au,
  iM as av,
  cM as aw,
  x_ as ax,
  tn as ay,
  dM as az,
  X$ as b,
  $_ as b$,
  x$ as b0,
  r_ as b1,
  PM as b2,
  DM as b3,
  c5 as b4,
  fr as b5,
  QM as b6,
  lM as b7,
  wa as b8,
  ht as b9,
  FM as bA,
  VM as bB,
  gt as bC,
  qM as bD,
  KM as bE,
  fM as bF,
  $M as bG,
  pM as bH,
  Re as bI,
  aM as bJ,
  YM as bK,
  T_ as bL,
  I_ as bM,
  i6 as bN,
  H2 as bO,
  tM as bP,
  WM as bQ,
  w6 as bR,
  b_ as bS,
  jM as bT,
  HM as bU,
  zM as bV,
  eM as bW,
  X5 as bX,
  nM as bY,
  vM as bZ,
  y_ as b_,
  GM as ba,
  za as bb,
  _i as bc,
  M_ as bd,
  E_ as be,
  BM as bf,
  s_ as bg,
  r6 as bh,
  kM as bi,
  __ as bj,
  H6 as bk,
  z6 as bl,
  _6 as bm,
  q6 as bn,
  m6 as bo,
  n_ as bp,
  $6 as bq,
  x6 as br,
  C6 as bs,
  SM as bt,
  L2 as bu,
  c_ as bv,
  I$ as bw,
  M6 as bx,
  g6 as by,
  xM as bz,
  u5 as c,
  FS as c$,
  h6 as c0,
  d6 as c1,
  gM as c2,
  A_ as c3,
  co as c4,
  O_ as c5,
  Wr as c6,
  a_ as c7,
  R6 as c8,
  B6 as c9,
  CS as cA,
  Vt as cB,
  Pd as cC,
  lC as cD,
  sC as cE,
  re as cF,
  oi as cG,
  V_ as cH,
  DS as cI,
  hC as cJ,
  mC as cK,
  QS as cL,
  Y_ as cM,
  bs as cN,
  n6 as cO,
  Rw as cP,
  ze as cQ,
  St as cR,
  ha as cS,
  US as cT,
  XS as cU,
  wc as cV,
  mw as cW,
  na as cX,
  nC as cY,
  PS as cZ,
  jS as c_,
  P2 as ca,
  v6 as cb,
  O$ as cc,
  _M as cd,
  no as ce,
  U5 as cf,
  IM as cg,
  nn as ch,
  Dt as ci,
  WS as cj,
  zS as ck,
  G_ as cl,
  ge as cm,
  mf as cn,
  Fs as co,
  ma as cp,
  Nv as cq,
  pa as cr,
  aC as cs,
  l6 as ct,
  HS as cu,
  Pv as cv,
  qi as cw,
  ln as cx,
  Js as cy,
  B_ as cz,
  Ve as d,
  j_ as d$,
  VS as d0,
  oC as d1,
  uC as d2,
  ji as d3,
  Qc as d4,
  z_ as d5,
  a0 as d6,
  RS as d7,
  s6 as d8,
  H4 as d9,
  Fo as dA,
  Vs as dB,
  hd as dC,
  eC as dD,
  Z_ as dE,
  Ns as dF,
  fd as dG,
  Rs as dH,
  Sm as dI,
  tC as dJ,
  o6 as dK,
  Li as dL,
  Tp as dM,
  Qk as dN,
  a6 as dO,
  t6 as dP,
  N_ as dQ,
  sm as dR,
  R_ as dS,
  IS as dT,
  X_ as dU,
  Cw as dV,
  h4 as dW,
  Qi as dX,
  NS as dY,
  YS as dZ,
  D_ as d_,
  jt as da,
  JS as db,
  Ke as dc,
  yt as dd,
  Vg as de,
  sd as df,
  Om as dg,
  e6 as dh,
  LS as di,
  Ut as dj,
  K_ as dk,
  L3 as dl,
  iC as dm,
  rC as dn,
  kn as dp,
  Fd as dq,
  st as dr,
  ZS as ds,
  Ze as dt,
  fC as du,
  cC as dv,
  Ys as dw,
  P_ as dx,
  Ts as dy,
  _p as dz,
  L6 as e,
  qe as e0,
  Ep as e1,
  GS as e2,
  xc as e3,
  L_ as e4,
  er as e5,
  q_ as e6,
  ql as e7,
  KS as e8,
  BS as e9,
  TS as ea,
  rn as eb,
  Zl as ec,
  md as ed,
  qS as ee,
  pt as ef,
  dC as eg,
  m4 as eh,
  ES as ei,
  OS as ej,
  U_ as ek,
  Ri as el,
  Q_ as em,
  tr as en,
  Yl as eo,
  J4 as ep,
  Is as eq,
  F_ as er,
  ss as es,
  W_ as et,
  H_ as eu,
  tt as ev,
  J_ as ew,
  Qn as ex,
  R2 as f,
  S_ as g,
  mn as h,
  f_ as i,
  C_ as j,
  h_ as k,
  t_ as l,
  n4 as m,
  lo as n,
  l_ as o,
  b6 as p,
  m_ as q,
  jr as r,
  Fr as s,
  Ce as t,
  f5 as u,
  XM as v,
  w_ as w,
  JM as x,
  _n as y,
  v_ as z
};
