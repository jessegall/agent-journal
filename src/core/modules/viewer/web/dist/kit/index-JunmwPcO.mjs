/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as be, unref as B, renderSlot as me, createElementVNode as m, normalizeClass as Y, Fragment as D, renderList as ne, defineComponent as zr, Comment as Ur, h as ra, cloneVNode as Gr, createBlock as F, withCtx as j, createVNode as T, toDisplayString as g, createCommentVNode as w, ref as _, onMounted as _e, onBeforeUnmount as Ke, reactive as zt, shallowRef as Je, watch as ve, onUnmounted as Re, inject as Ee, useAttrs as ua, computed as C, resolveDynamicComponent as bt, mergeProps as De, useId as _s, resolveDirective as Vr, withDirectives as Ze, createTextVNode as te, Teleport as ca, nextTick as je, Transition as Ut, withModifiers as xe, createApp as Kr, shallowReactive as Yr, withKeys as Ct, onScopeDispose as da, useModel as sn, mergeModels as Pt, vModelText as Kn, resolveComponent as Qr, provide as Ol, onErrorCaptured as Xr, TransitionGroup as Ms, isRef as uo, getCurrentInstance as Jr, getCurrentScope as Tl, toHandlers as Zr, createSlots as eu, vShow as Il, useSlots as tu, normalizeProps as nu, guardReactiveProps as au, defineAsyncComponent as su } from "vue";
function Rl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ou = 1600, lu = {
  __name: "Shimmer",
  setup(e) {
    const t = Rl(ou);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: be(B(t))
    }, null, 4));
  }
}, Jt = /* @__PURE__ */ U(lu, [["__scopeId", "data-v-1c6fdf5f"]]), iu = { class: "skeleton-line" }, ru = 2e3, uu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Rl(ru);
    return (n, a) => (u(), f("span", iu, [
      me(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(D, null, ne(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: be({ ...B(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, kt = /* @__PURE__ */ U(uu, [["__scopeId", "data-v-341b98f6"]]), Gt = zr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Ur);
      return a.length !== 1 ? ra(D, { key: n }, a) : a[0].key == null ? Gr(a[0], { key: n }) : a[0];
    };
  }
}), cu = ["aria-label"], du = ["aria-label"], fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], vu = ["aria-label"], gu = {
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
    return (r, c) => (u(), F(Gt, { value: e.shape }, {
      messages: j(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), f(D, null, ne(t, (d) => T(Jt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: be({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, cu)
      ]),
      older: j(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ne(t.slice(0, 3), (d) => (u(), F(Jt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: be({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, du)
      ]),
      cards: j(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ne(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(D, null, ne(n, (h) => T(kt, {
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
          (u(!0), f(D, null, ne(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            T(kt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(D, null, ne(s, (h) => T(kt, {
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
          T(kt, {
            class: "skeleton-heading",
            bars: i
          }),
          (u(!0), f(D, null, ne(e.count, (d) => (u(), F(kt, {
            key: d,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, mu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ne(e.count, (d) => (u(), F(kt, {
            key: d,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, pu)
      ]),
      default: j(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ne(e.count, (d) => (u(), F(kt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, vu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ye = /* @__PURE__ */ U(gu, [["__scopeId", "data-v-5a4a3667"]]), yu = {
  key: 1,
  class: "empty-state titled"
}, bu = { class: "empty-state-title" }, ku = { class: "empty-state-text" }, wu = {
  key: 2,
  class: "empty-state"
}, $u = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), F(Ye, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", yu, [
      m("p", bu, g(e.title), 1),
      m("p", ku, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", wu, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, on = /* @__PURE__ */ U($u, [["__scopeId", "data-v-bbb14fd6"]]), xu = { class: "fold-group" }, Su = ["aria-expanded"], _u = { class: "fold-label" }, Mu = {
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
    return (a, s) => (u(), f("div", xu, [
      m("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", _u, g(e.label), 1),
        e.count !== "" ? (u(), f("span", Mu, g(e.count), 1)) : w("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Su),
      e.open ? me(a.$slots, "default", {}, void 0, !0, 0) : w("", !0)
    ]));
  }
}, cS = /* @__PURE__ */ U(Cu, [["__scopeId", "data-v-5a6a4d36"]]), Eu = 150, Au = () => Eu;
function Cs(e, t, n = Au(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Ou(e, t, n) {
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
const Tu = 50, co = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function dS(e) {
  const t = Ue().sources.find((n) => n.key === e);
  return t ? ns(t.read, t.events) : ns("", []);
}
function Bl(e, t, n, a, s = () => !1) {
  const o = _([]), l = _(null), i = _(""), r = _(!1), c = performance.now(), d = _(!1), h = _(""), p = _(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function A(v) {
    return s() ? (y.add(v), b ?? (b = new Promise((R) => setTimeout(() => R(S()), Tu)))) : $(v);
  }
  async function S() {
    const v = new Set(y);
    y.clear(), b = null;
    const R = N, O = await t({ ids: [...v].join(","), limit: v.size });
    if (R !== N) return;
    if (!O.ok) return q();
    const L = new Map(O.value.rows.map((P) => [P.id, P]));
    o.value = o.value.flatMap((P) => v.has(P.id) ? L.has(P.id) ? [L.get(P.id)] : [] : [P]);
  }
  async function $(v) {
    const R = N, O = await t({ "before-id": v + 1, limit: 1 });
    if (R !== N) return;
    if (!O.ok) return q();
    const L = O.value.rows.find((P) => P.id === v);
    o.value = L ? o.value.map((P) => P.id === v ? L : P) : o.value.filter((P) => P.id !== v);
  }
  async function I(v) {
    if (a() && String((v == null ? void 0 : v.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((z) => z.id !== v.row_id));
    if (a() && (v != null && v.row_id) && !String(v.event ?? "").endsWith(".create") && o.value.some((z) => z.id === v.row_id)) return A(v.row_id);
    if (!(a() && o.value.length && String((v == null ? void 0 : v.event) ?? "").endsWith(".create"))) return q();
    const O = Math.max(...o.value.map((z) => z.id)), L = N, P = await t({ "after-id": O });
    if (L !== N) return;
    if (!P.ok) return q();
    const J = new Set(o.value.map((z) => z.id));
    o.value = [...P.value.rows.filter((z) => !J.has(z.id)), ...o.value];
  }
  async function H() {
    if (!d.value || !o.value.length) return !1;
    const v = N, R = Math.min(...o.value.map((P) => P.id)), O = await t({ "before-id": R });
    if (v !== N) return !1;
    if (!O.ok || !O.value.rows.length) return d.value = !1;
    d.value = co(O.value, n());
    const L = new Set(o.value.map((P) => P.id));
    return o.value = [...o.value, ...O.value.rows.filter((P) => !L.has(P.id))], !0;
  }
  let N = 0;
  function E(v, R) {
    var P, J;
    const O = v.ok ? e.shared ? [v.value] : ((P = v.value) == null ? void 0 : P.rows) ?? [] : [];
    v.ok && (o.value = R(O)), l.value = v.ok ? v.value : null;
    const L = O.length ? Math.min(...O.map((z) => z.id)) : 0;
    v.ok && ((J = v.value) != null && J.rows) && !o.value.some((z) => z.id < L) && (d.value = !e.shared && co(v.value, n())), i.value = v.ok ? "" : v.error, Cs(c, () => r.value = !0);
  }
  async function V(v) {
    const R = ++N, O = await t({});
    R === N && E(O, v);
  }
  const W = (v) => {
    if (!a() || !v.length) return v;
    const R = Math.min(...v.map((L) => L.id)), O = Math.max(...v.map((L) => L.id));
    return [...o.value.filter((L) => L.id > O), ...v, ...o.value.filter((L) => L.id < R)];
  }, q = () => V(W), x = (v) => E(v, W), M = () => V((v) => v);
  async function k(v, R = null) {
    const O = await Ou(R && { target: o, fields: { value: R(o.value) } }, v, e.run);
    return h.value = O.ok ? "" : O.error, p.value = O.ok ? O.value : null, await q(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: q, loadLatest: M, older: H, act: k, actionFailure: h, answer: p, context: e, heard: I, showFirst: x, pageSize: n };
}
const Iu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ns(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = Ue(), l = Bl(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Iu(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Ru = 2e3;
function Es(e, t, n = Ru) {
  let a = null, s = !1, o = !1;
  const l = async (d) => {
    o = !0;
    try {
      await d();
    } catch {
    } finally {
      o = !1;
    }
  }, i = () => l(async () => t() && await e()), r = () => {
    s || document.hidden || (a = setTimeout(
      async () => {
        document.hidden || await i(), r();
      },
      typeof n == "function" ? n() : n
    ));
  }, c = async () => {
    s || document.hidden || o || (clearTimeout(a), await i(), r());
  };
  _e(async () => {
    document.addEventListener("visibilitychange", c), await l(e), r();
  }), Ke(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const Ll = typeof document < "u" && document.documentElement.classList.contains("phone"), Nl = 120;
var El;
const $a = globalThis[El = Symbol.for("journal.pressed")] ?? (globalThis[El] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Bu(e = 0) {
  const t = $a.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, $a.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, $a.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function as(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ql(e = window) {
  if (!as(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    as(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ss = "journal.stale-build-reload", Lu = 'script[type="module"][src*="/assets/index-"]', fo = (e) => {
  var t;
  return ((t = e.querySelector(Lu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Nu(e = document, t = (a, s) => Ce.quietRead(a, s), n = () => ql(window)) {
  const a = fo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = fo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let xa = "";
function qu(e, t = () => ql(window)) {
  if (!e) return !1;
  const n = !!xa && xa !== e;
  return xa = e, n && t(), n;
}
const Du = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Pu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ss) === e.message) return !1;
    t.setItem(ss, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function ju(e = window.sessionStorage) {
  try {
    e.removeItem(ss);
  } catch {
    return;
  }
}
const Fu = 2e3, Wu = 3e4, Ge = zt({ starting: !1, external: !1, late: !1, offline: !1 }), As = () => Ge.starting, Hu = 3;
let Cn = 0, os = 0, Dl = 0, Pl = [];
async function zu() {
  try {
    const e = await Ce.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let ho = null;
const Uu = () => ho ?? (ho = zu().finally(() => ho = null));
function Gu() {
  clearTimeout(os), clearTimeout(Dl), os = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), Pl.splice(0).forEach((e) => e()), Nu();
}
async function Vu() {
  Ge.offline = !navigator.onLine;
  const e = await Uu();
  if (Ge.external = e.updating, Cn = !e.restarting && !e.updating && e.reachable ? Cn + 1 : 0, Cn < Hu) return;
  Cn = 0, (!qu(e.started_at) || as()) && Gu();
}
function jl() {
  os = setTimeout(async () => {
    await Vu(), Ge.starting && jl();
  }, Fu);
}
function Ku() {
  Ge.starting || (Ge.starting = !0, Ge.offline = !navigator.onLine, jl(), Dl = setTimeout(() => Ge.late = !0, Wu));
}
const Fl = () => Ge.starting ? new Promise((e) => Pl.push(e)) : Promise.resolve();
function Os(e, t, n = 0) {
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
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Os(() => this.leave(), 0);
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
const ut = "viewer.shell", En = 2e4, Xu = 4, mo = "/api/read-lines", Ju = 5e3, Zu = 403, po = "/api/repeated-lines", ec = 10, tc = 2e3, nc = 3e5, fS = 6e5, An = 6, ac = 500, sc = "/journal/summary", vo = "/api/server-state", oc = 2e4, On = Ll ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, lc = (e) => e.split("?")[0].endsWith(sc), ls = (e, t) => Object.assign(new Error(t), { status: e });
async function ic(e, t, n = ls) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const rc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), uc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), go = (e) => e.split(" ").slice(0, 2).join(" "), at = "read", Rt = "write", cc = "stream";
class dc {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = go(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < tc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < ec || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(po, { method: "POST", headers: { ...On, "Content-Type": "application/json" }, body: i }, [{ window: ut, line: po, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Bu(n ? Nl : 0);
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
      return await fetch(t, a[0].kind === Rt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = En) {
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
    return this.out(mo, { headers: On }, [{ window: ut, line: mo, kind: at }], Ju).then(async (t) => {
      if (t.status === Zu) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ls(t.status, "The read lines did not answer");
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = go(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const i = a instanceof FormData, r = { method: t, headers: { ...On, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: rc(a) }, c = s || (i ? nc : En);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: ut, line: n, kind: at }], c)) : await this.sent(n, r, [{ window: ut, line: n, kind: Rt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, ac)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = An, l = {}) {
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
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: ut, line: t, kind: at }], En)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: On });
    if (!n.ok) throw ls(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, An, o).then((i) => (this.written(n), i)) : As() && !lc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ut, line: t, kind: cc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(vo, { cache: "no-store" }, [{ window: ut, line: vo, kind: at }], oc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ut, line: s = t, limit: o = En } = {}) {
    const l = (n.method ?? "GET") === "GET" ? at : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Sa = Symbol.for("journal.transport"), Ce = globalThis[Sa] ?? (globalThis[Sa] = new dc());
class Wl {
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
    Ce.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Ts(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Ts(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const fc = 50, hc = "refresh", mc = 1e3, pc = 3e4, vc = "requested", gc = "after_window", yc = 50, Tn = ".*", bc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function kc(e) {
  const t = {}, n = zt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function p(x) {
    const M = () => r[x] ?? r[`${x.slice(0, x.lastIndexOf("."))}.*`] ?? {}, k = _(void 0), v = Bl(e, async (R) => {
      const O = await A(x, R);
      return O.ok && !Object.keys(R).length && (k.value = O.value), O;
    }, () => M().page_size || yc, () => !!M().page_size, () => !!M().reads_ids);
    return t[x] = { ...v, data: k, readAt: 0 };
  }
  const y = new Proxy({}, { get: (x, M) => typeof M != "string" || M.startsWith("__v") ? void 0 : t[M] ?? p(M) }), b = (x) => (r[x].loading !== vc || x.endsWith(Tn)) && (!r[x].tab || r[x].tab === n.tab);
  function A(x, M = {}) {
    return new Promise((k) => {
      a.push({ name: x, flags: M, resolve: k }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const x = /* @__PURE__ */ new Map(), M = a.splice(0).filter((R) => {
      const O = JSON.stringify(R.flags);
      return x.has(R.name) || x.set(R.name, O), x.get(R.name) === O ? !0 : (a.push(R), !1);
    });
    a.length && setTimeout(S);
    const k = Object.fromEntries(M.flatMap(({ name: R, flags: O }) => Object.entries(O).map(([L, P]) => [`${R}.${L}`, P]))), v = await e.readKeys({ only: [...new Set(M.map(({ name: R }) => R))], state: { ...n, ...k } });
    M.forEach(({ name: R, resolve: O }) => O(v.ok ? v.value.keys[R] : v));
  }
  async function $(x) {
    var R;
    const M = ++d;
    (x.length ? x : Object.keys(r).filter((O) => !O.endsWith(Tn) && r[O].loading === "first" && b(O))).forEach((O) => l[O] = M);
    const v = await e.readKeys({ only: x, state: { ...n } });
    if (!v.ok) {
      if (v.failure === "cancelled") return !1;
      const O = (x.length ? x : Object.keys(t)).filter((P) => (l[P] ?? 0) <= M);
      O.forEach((P) => {
        y[P].readAt = Date.now(), v.failure === "unreachable" ? i.add(P) : i.delete(P), y[P].showFirst(v);
      });
      const L = v.failure === "unreachable" && ((R = e.waitForServer) == null ? void 0 : R.call(e));
      return L && L.then(() => {
        if (h) return;
        const P = O.filter((J) => l[J] === M);
        (P.length || !x.length && !O.length && d === M) && $(P);
      }), !1;
    }
    return W(v.value.declared), Object.entries(v.value.keys).forEach(([O, L]) => {
      (l[O] ?? 0) > M || (l[O] = M, y[O].readAt = Date.now(), i.delete(O), L.ok && (y[O].data.value = L.value), y[O].showFirst(L));
    }), !0;
  }
  function I(x) {
    const M = bc(x);
    return M.length ? (M.forEach((k) => o.names.add(k)), o.answer ?? (o.answer = new Promise((k) => setTimeout(() => {
      const v = [...o.names];
      o.names.clear(), o.answer = null, k($(v));
    })))) : $([]);
  }
  function H(x) {
    x.forEach((M) => s.add(M)), clearTimeout(c), c = setTimeout(() => {
      const M = [...s];
      s.clear(), M.length && $(M);
    }, fc);
  }
  const N = (x) => x.endsWith(Tn) ? Object.keys(t).filter((M) => M.startsWith(x.slice(0, -1)) && t[M].readAt) : [x], E = (x) => (r[x] ?? r[`${x.split(".")[0]}.*`]).reload_seconds;
  function V(x) {
    const M = Object.keys(r).filter((v) => x.event === hc || r[v].events.some((R) => Ts(R, x.event)));
    M.filter((v) => r[v].page_size).forEach((v) => y[v].heard(x));
    const k = M.filter((v) => !r[v].page_size);
    k.filter((v) => !b(v)).forEach((v) => y[v].readAt = 0), H(k.filter(b).flatMap(N));
  }
  function W(x) {
    if (Object.keys(r).length) return;
    r = x;
    const M = [...new Set(Object.values(x).flatMap((v) => v.events))];
    M.length && e.follow(M, V);
    const k = Object.keys(x).filter((v) => x[v].loading === gc);
    k.length && $(k);
  }
  ve(() => n.tab, () => {
    const x = Object.keys(r).filter((M) => !M.endsWith(Tn) && b(M) && !y[M].readAt);
    x.length && $(x);
  }), Re(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const x = Date.now(), M = Object.keys(r).filter((k) => r[k].reload_seconds > 0 && b(k)).flatMap(N).filter((k) => x - y[k].readAt >= (i.has(k) ? Math.min(E(k) * 1e3, pc) : E(k) * 1e3));
    M.length && H(M);
  }
  return Es(q, () => e.visible.value, mc), queueMicrotask(() => $([])), { props: y, state: n, reload: I, readKey: A };
}
const wc = Symbol("open-view"), Pe = Symbol.for("journal.window-context"), Hl = Symbol("dock-card");
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
function Ue() {
  const e = Ee(Pe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return $c(e);
}
const xc = (e, t) => e(Hl, t), hS = () => Ee(Hl), Sc = ["data-icon", "stroke-width", "innerHTML"], ge = {
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
    return (o, l) => (u(), f("svg", {
      class: "ico",
      "data-icon": e.name,
      style: be({
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
}, _c = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: be({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Mc = /* @__PURE__ */ U(_c, [["__scopeId", "data-v-37ba86f3"]]), Cc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ua(), a = C(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = _(!1), o = C(() => t.busy || s.value), l = Ee(Pe, null), i = C(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function r(c) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, Nl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, d) => (u(), F(bt(e.href ? "a" : "button"), De(a.value, {
      type: e.href ? void 0 : B(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: r
    }), {
      default: j(() => [
        m("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), F(ge, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : w("", !0),
          me(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), F(Mc, {
          key: 0,
          class: "btn-spinner"
        })) : w("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ U(Cc, [["__scopeId", "data-v-7068e4e1"]]), Ec = ["aria-checked", "aria-haspopup", "onClick"], Ac = {
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
    const n = t, a = _s();
    return (s, o) => {
      const l = Vr("tip");
      return u(), f("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(D, null, ne(e.options, (i) => Ze((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", Ac)) : w("", !0),
          te(" " + g(i.label) + " ", 1),
          i.note ? (u(), f("small", Oc, g(i.note), 1)) : w("", !0),
          i.count !== void 0 ? (u(), f("em", Tc, g(i.count), 1)) : w("", !0)
        ], 10, Ec)), [
          [l, i.tip || i.title, `${B(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, jt = /* @__PURE__ */ U(Ic, [["__scopeId", "data-v-7d0b33ab"]]), Rc = {
  key: 0,
  class: "more-items"
}, Bc = {
  key: 0,
  role: "alert"
}, Lc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", Rc, [
      e.failure ? (u(), f("p", Bc, g(e.failure), 1)) : w("", !0),
      e.more ? (u(), F(pe, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          te(g(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : w("", !0)
    ])) : w("", !0);
  }
}, vn = /* @__PURE__ */ U(Lc, [["__scopeId", "data-v-5355e7f5"]]), Nc = { class: "link-group" }, qc = {
  class: "group-label",
  "data-link-kind": ""
}, Dc = ["disabled", "onClick"], Pc = { class: "title" }, jc = { class: "relations" }, Fc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = C(() => s.value ? n.rows : n.rows.slice(0, 3)), l = C(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Nc, [
      m("div", qc, g(l.value), 1),
      (u(!0), f(D, null, ne(o.value, (p) => (u(), f("button", De({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Pc, g(p.endpoint.title), 1),
        m("span", jc, [
          te(g(c(p)), 1),
          i(p) ? (u(), f(D, { key: 0 }, [
            te(" · Unavailable")
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
}, Wc = /* @__PURE__ */ U(Fc, [["__scopeId", "data-v-53f351ad"]]), Hc = ["data-loaded"], zc = { class: "rows" }, Uc = ["disabled", "onClick"], Gc = { class: "title" }, Vc = { class: "relations" }, Kc = { key: 2 }, Yc = {
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
    const n = e, a = t, s = _([]), o = _({}), l = _(0), i = _(""), r = _(null), c = _(!1), d = _("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())}s`, b = C(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, x) => q + x, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, x]) => ({ key: q, label: y(q), count: x }))
    ]), A = C(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((M) => M.endpoint.model))].map((M) => [M, s.value.filter((k) => k.endpoint.model === M).length])), x = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([M], [k]) => (x[M] ?? 3) - (x[k] ?? 3)).map(([M, k]) => ({ model: M, count: k, rows: s.value.filter((v) => v.endpoint.model === M) }));
    }), S = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, $ = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), I = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((x) => x.replaceAll("_", " ")).join(", ")}`;
    async function H(q = 1) {
      const x = ++h;
      c.value = !0, d.value = "";
      const M = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && M.push("--outside-plan"), n.documentId && M.push("--first-counterpart", `doc:${n.documentId}`), i.value && M.push("--kind", i.value);
      try {
        const k = await n.read(M);
        if (x !== h) return;
        if (!k.ok) {
          d.value = k.error;
          return;
        }
        const v = k.value.counterparts ?? [], R = q === 1 ? v : [...s.value, ...v];
        s.value = [...new Map(R.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = k.value.kinds ?? {}, l.value = k.value.total, r.value = k.value.next_page ?? null;
      } catch (k) {
        x === h && (d.value = k.message);
      } finally {
        x === h && (c.value = !1);
      }
    }
    function N(q) {
      if (S(q)) return;
      const [x, M] = q.endpoint.open_ref.split(":");
      a("open", { table: x, id: Number(M) });
    }
    function E(q) {
      i.value = q, H();
    }
    const V = () => !c.value && r.value && H(r.value), W = C(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ve(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], r.value = null, i.value = "", H();
    }, { immediate: !0 }), (q, x) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (u(), F(jt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: E
      }, null, 8, ["options", "value"])) : w("", !0),
      m("div", zc, [
        e.grouped ? (u(!0), f(D, { key: 0 }, ne(A.value, (M) => (u(), F(Wc, {
          key: M.model,
          model: M.model,
          count: M.count,
          rows: M.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: N
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(D, { key: 1 }, ne(s.value, (M) => (u(), f("button", De({
          key: `${M.endpoint.model}:${M.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, $(M), {
          disabled: S(M),
          onClick: (k) => N(M)
        }), [
          m("span", Gc, g(M.endpoint.title), 1),
          m("span", Vc, [
            te(g(I(M)), 1),
            S(M) ? (u(), f(D, { key: 0 }, [
              te(" · Unavailable")
            ], 64)) : w("", !0)
          ])
        ], 16, Uc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Kc, g(e.empty), 1)) : w("", !0),
        T(vn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: W.value,
          onMore: V
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Hc)) : w("", !0);
  }
}, Qc = /* @__PURE__ */ U(Yc, [["__scopeId", "data-v-9424e926"]]), Xc = (e, t, n) => Math.max(t, Math.min(n, e)), Jc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, zl = /* @__PURE__ */ new WeakMap(), Zc = (e, t) => zl.set(e, t);
function ed(e, t) {
  for (let n = t; n; n = zl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ul(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !ed(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
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
    const a = e, s = _(null), o = (v) => v ? `${v}px` : void 0, l = C(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = _({ w: 0, h: 0 }), r = _(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), h = (v) => {
      const R = v.closest(".pane, .float-window");
      return R ? d(R.getBoundingClientRect()) : c();
    }, p = (v, R) => `${Math.max(0, v ? Math.min(v, R) : R)}px`;
    function y(v, R) {
      return {
        below: v.bottom - R.bottom - a.gap - Tt,
        above: R.top - v.top - a.gap - Tt,
        across: v.right - v.left - 2 * Tt
      };
    }
    function b(v) {
      const R = h(a.anchor), O = y(R, v);
      return i.value.w <= O.across && i.value.h <= Math.max(O.below, O.above) ? R : c();
    }
    const A = C(() => {
      if (!r.value) return l.value;
      const v = r.value, R = b(v), O = y(R, v), { w: L, h: P } = i.value, J = a.align === "auto" ? v.left + v.right > R.left + R.right : a.align === "right", z = Xc(J ? v.right - L : v.left, R.left + Tt, Math.max(R.left + Tt, R.right - L - Tt)), ae = P > O.below && O.above > O.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: p(a.maxHeight, O.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: p(a.maxHeight, O.below) };
      return { ...l.value, ...ae, left: `${z}px`, maxWidth: p(a.maxWidth, O.across) };
    }), S = n, $ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function I(v) {
      const R = $(), O = R.indexOf(document.activeElement);
      R[(O + v + R.length) % R.length].focus();
    }
    const H = { ArrowDown: () => I(1), ArrowUp: () => I(-1), Escape: () => S("close") }, N = (v) => H[v.key] && (v.preventDefault(), H[v.key]()), E = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let V = 0;
    const W = new ResizeObserver(() => {
      cancelAnimationFrame(V), V = requestAnimationFrame(E);
    });
    Ul(s, (v) => a.anchor && !a.anchor.contains(v.target) && S("close"));
    const q = (v, R) => ["top", "left", "right", "bottom"].some((O) => Math.abs(v[O] - R[O]) > 1), x = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let M = 0;
    function k() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(v)) return S("close");
        q(v, r.value) && (r.value = v);
      }
      M = requestAnimationFrame(k);
    }
    return _e(() => {
      a.anchor && s.value && Zc(s.value, a.anchor), E(), s.value && W.observe(s.value), !a.plain && $()[0] && $()[0].focus(), k();
    }), Re(() => {
      W.disconnect(), cancelAnimationFrame(M), cancelAnimationFrame(V);
    }), t({ element: s }), (v, R) => (u(), F(ca, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", De({
        ref_key: "panel",
        ref: s
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: A.value,
        onKeydown: N
      }), [
        me(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Is = /* @__PURE__ */ U(td, [["__scopeId", "data-v-7f046e0d"]]), nd = { class: "split-button" }, ad = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = _(null), s = _(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", nd, [
      T(pe, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (r) => n("main"))
      }, {
        default: j(() => [
          me(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        T(pe, {
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
            T(ge, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), F(Is, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: j(() => [
          me(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : w("", !0)
    ]));
  }
}, sd = /* @__PURE__ */ U(ad, [["__scopeId", "data-v-9908ef1d"]]), od = 0, ld = "/api/lines", id = "/api/line", yo = 5e3, bo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), ko = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), _a = (e) => JSON.stringify(e.line), wo = () => new DOMException("cancelled", "AbortError");
class rd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(_a(t))) {
        Ce.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Rt));
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
    }).forEach((n) => n.reject(wo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(wo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ce.sent(ld, bo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => ko(i.body, at)), yo);
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
    await this.alone(t, at), Date.now() - n < yo ? this.slow.delete(_a(t.body)) : this.slow.add(_a(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ce.sent(id, bo(t.body, t.signal), [ko(t.body, n)], n === at ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Gl = new rd(), ud = "/api/window";
function cd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${ud}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => Ce.whenFree(async () => {
    const d = await Ce.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: at }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Ce.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const Vl = /* @__PURE__ */ new Map();
class dd {
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
function mS(e, t) {
  const n = new dd(e, t);
  return Vl.set(e, n), n.load().catch(() => {
  }), n;
}
const Rs = (e) => Vl.get(e);
function fd(e, t, n) {
  const a = Rs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function hd(e, t) {
  if (!e) return !0;
  const n = Rs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Yn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Kl = {};
async function pS(e = (t) => Ce.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Kl = (await t.json()).states);
}
const Bs = (e, t) => {
  var n;
  return (n = Kl[e]) == null ? void 0 : n[t];
}, ln = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.label) ?? Yn(t);
}, Yl = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, md = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, pd = Symbol("pane-page"), Ls = Symbol("inspector-host"), Ql = { 1: "refused", 2: "usage", 3: "fault" }, vd = 100, gd = 50, yd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, bd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function kd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = _({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: A = {}, search: S = {}, readOnly: $ = !1, shared: I = null }) {
  const H = /* @__PURE__ */ new Map(), N = new AbortController(), E = _(!1), V = performance.now();
  let W = 0, q = 0, x = () => {
  };
  const M = new Promise((P) => x = P);
  N.signal.addEventListener("abort", x, { once: !0 });
  const k = () => {
    clearTimeout(q), q = setTimeout(() => {
      W === 0 && Cs(V, () => {
        E.value = !0, x();
      });
    }, gd);
  }, v = (P, J) => (W += 1, Lt(e, P, t, N.signal, J).finally(() => {
    W -= 1, k();
  })), R = (P, J) => (k(), M.then(() => N.signal.aborted ? it : Lt(e, P, t, N.signal, J))), O = ({ only: P = [], state: J = {} } = {}) => (W += 1, $d(() => cd(e, t, P, J, N.signal), N.signal).finally(() => {
    W -= 1, k();
  })), L = (P, { unbatched: J = !1, deferred: z = !1 } = {}) => {
    const se = H.get(P);
    if (se && performance.now() - se.at < vd) return se.answer;
    const ae = z && !E.value ? R(P, J) : v(P, J);
    return H.set(P, { answer: ae, at: performance.now() }), ae;
  };
  return {
    answered: E,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: C(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: A,
    search: S,
    readOnly: $,
    shared: I,
    read: L,
    readKeys: O,
    waitForServer: () => As() ? Fl() : null,
    run: (P) => Lt(e, P, t, N.signal),
    upload: (P) => Sd(P, e, N.signal),
    cancel: () => N.abort(),
    signal: N.signal,
    subscriptions: l,
    follow: (P, J) => l.follow(e, [P].flat().filter((z) => o.some((se) => Ts(se, z))), (z) => {
      H.clear(), J(z);
    }, a),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (P) => C(() => {
      var J;
      return r.value[P] ?? ((J = c.find((z) => z.key === P)) == null ? void 0 : J.default);
    }),
    setting: async (P, J) => {
      const z = await L(`window setting ${e} ${P}`);
      return z.ok ? z.value.value : J;
    },
    setOption: h,
    keep: (P, J) => Lt(e, ["window", "save-setting", e, P, JSON.stringify(J)], t, N.signal)
  };
}
function Xl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const it = { ok: !1, failure: "cancelled", error: "" }, Ns = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Jl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? it : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Ql[n.code] || "fault", error: Xl(n.error) };
  } catch {
    return t != null && t.aborted ? it : { ok: !1, failure: "unreachable", error: Ns };
  }
}
const wd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Ql[e.code] || "fault", error: Xl(e.error) };
async function $d(e, t) {
  try {
    const n = await e();
    return t.aborted ? it : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, wd(s)])) } };
  } catch {
    return t.aborted ? it : { ok: !1, failure: "unreachable", error: Ns };
  }
}
async function Zl(e, t, n) {
  const a = await Jl(() => Gl.read(e, t, n), t);
  return a.failure !== "unreachable" || !As() ? a : (await Fl(), t.aborted ? it : Zl(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ce.held(() => xd(e, t, n, a, s), Ce.knownRead(Array.isArray(t) ? t : qs(t)));
}
async function xd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : qs(t), environment: n };
  return await Ce.isRead(o.line) ? Ce.joined(JSON.stringify(o), (l, i) => Zl({ ...o, attribution: i }, l, s), a, o).catch(() => it) : Jl(() => Gl.write({ ...o, attribution: {
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
    return n != null && n.aborted ? it : { ok: !1, failure: "unreachable", error: Ns };
  }
}
function qs(e) {
  return [...e.matchAll(yd)].map(([t]) => t.replace(bd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const _d = (e) => `show-${e}`, vS = (e, t, n) => e.filter((a) => {
  var s;
  return n(_d((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ei = "messages.chat", Md = {
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
    const n = e, a = t, s = _([]), o = _(""), l = C(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = C(() => s.value.find((c) => String(c.id) === n.value));
    async function r() {
      const c = await Lt(ei, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
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
      i.value ? (u(), f("p", Md, g(i.value.brief), 1)) : w("", !0),
      o.value ? (u(), f("p", Cd, g(o.value), 1)) : w("", !0)
    ], 64));
  }
}, Ad = /* @__PURE__ */ U(Ed, [["__scopeId", "data-v-8c3f5d57"]]), Od = { class: "info-tip" }, Td = ["aria-label"], Id = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Rd = {
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
        T(ge, {
          name: "info",
          size: 13
        })
      ], 8, Td),
      m("span", Id, [
        (u(!0), f(D, null, ne(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, g(a), 1))), 128))
      ])
    ]));
  }
}, ti = /* @__PURE__ */ U(Rd, [["__scopeId", "data-v-13b7dee3"]]), Bd = { class: "form-field" }, Ld = { class: "form-field-head" }, Nd = ["for"], qd = {
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
    return (t, n) => (u(), f("div", Bd, [
      m("div", Ld, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, g(e.label), 9, Nd),
        e.help ? (u(), F(ti, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : w("", !0),
        t.$slots.aside ? (u(), f("span", qd, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Pd = /* @__PURE__ */ U(Dd, [["__scopeId", "data-v-732e6a10"]]), is = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, jd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ua(), n = C(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ze((u(), f("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [B(is), B(t).value]
    ]);
  }
}), Fd = /* @__PURE__ */ U(jd, [["__scopeId", "data-v-11521837"]]), Wd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _s(), o = C(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), F(Pd, {
      label: e.field.label,
      for: B(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        T(Gt, { value: o.value }, {
          choice: j(() => [
            T(jt, {
              id: B(s),
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
              id: B(s),
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
}, fa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), F(pe, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        T(ge, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Hd(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const zd = (e, t = () => !0) => Hd("keydown", (n) => n.key === "Escape" && t() && e());
function ni(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = _(!1), s = C(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return zd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Ud = 80, It = zt([]);
function ai(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return ve(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), C(() => Ud + Math.max(0, It.indexOf(t)));
}
let si = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return si = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
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
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : si, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ni(a, n), i = ai(s), r = _(null), c = _(null), d = _(null), h = _s(), p = _(!1), y = Date.now();
    n.modal && Vd(c, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Zd);
    }
    function A(I) {
      !n.modal || Date.now() - y >= Jd || ![" ", "Enter"].includes(I.key) || (I.preventDefault(), I.stopPropagation());
    }
    const S = () => r.value && (r.value.scrollTop = r.value.scrollHeight), $ = new MutationObserver(S);
    return ve(r, (I) => {
      $.disconnect(), I && n.follow && ($.observe(I, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Re(() => $.disconnect()), (I, H) => (u(), F(ca, { to: "body" }, [
      T(Ut, {
        name: "dialog",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: j(() => [
          B(s) ? (u(), f("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: be({ zIndex: B(i) }),
            onClick: xe(b, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? B(h) : void 0,
              onKeydownCapture: A
            }, [
              e.bare ? w("", !0) : (u(), f("header", Yd, [
                m("h3", {
                  id: B(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, g(e.title), 9, Qd),
                e.closable ? (u(), F(fa, {
                  key: 0,
                  onClick: B(o)
                }, null, 8, ["onClick"])) : w("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: r,
                class: Y(["dialog-body", { bare: e.bare }])
              }, [
                me(I.$slots, "default", {}, void 0, !0)
              ], 2),
              I.$slots.foot ? (u(), f("footer", Xd, [
                me(I.$slots, "foot", {}, void 0, !0)
              ])) : w("", !0)
            ], 42, Kd)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ha = /* @__PURE__ */ U(ef, [["__scopeId", "data-v-484a731f"]]), tf = {
  class: "action-output",
  "data-action-output": ""
}, nf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), F(ha, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        m("pre", tf, g(e.text), 1)
      ]),
      _: 1
    }));
  }
}, af = /* @__PURE__ */ U(nf, [["__scopeId", "data-v-328317d6"]]);
function sf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Kr(af, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const of = (e, t, n = {}) => qs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function gn(e, t, n, a = {}) {
  var s;
  try {
    if (!await hd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(ei, of(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && sf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const lf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ma = [
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
}), ma = {
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
    filters: Ma
  }),
  tasks: we("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ma
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
  pins: we("Pin", "band", "One line pinned to the chat while it matters", { filters: Ma }),
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
}, rf = ["secrets", "plugins"], oi = Object.keys(ma).filter((e) => !(Ll && rf.includes(e)));
C(() => oi.map((e) => ({ name: e, ...ma[e] })));
const Vt = (e) => ma[e], li = new Map(oi.flatMap((e) => [e, e.replace(/s$/, ""), ma[e].title.toLowerCase()].map((t) => [t, e]))), mt = (e) => li.get(String(e).toLowerCase()) || "", ii = [...li.keys()].sort((e, t) => t.length - e.length).join("|"), uf = {
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
    const n = e, a = t, s = _(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = _(!1), l = _(""), i = C(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = C(() => {
      var h;
      if (!n.row) return n.button.label;
      const d = ((h = Vt(mt(n.row.noun))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const d = await gn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, h) => (u(), F(ha, {
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
            (p = e.row) != null && p.title ? (u(), f("p", cf, g(e.row.title), 1)) : w("", !0),
            (u(!0), f(D, null, ne(e.button.fields, (y) => (u(), F(Wd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", df, g(l.value), 1)) : w("", !0),
            m("div", ff, [
              T(pe, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: j(() => [...h[2] || (h[2] = [
                  te("Cancel", -1)
                ])]),
                _: 1
              }),
              T(pe, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: j(() => [...h[3] || (h[3] = [
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
}, mf = /* @__PURE__ */ U(hf, [["__scopeId", "data-v-e77a3ca7"]]), pf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, vf = {
  key: 1,
  class: "menu-item-text"
}, gf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", pf, g(e.checked ? "✓" : ""), 1)) : w("", !0),
      e.description ? (u(), f("span", vf, [
        m("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, g(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ft = /* @__PURE__ */ U(gf, [["__scopeId", "data-v-9c67fe37"]]), yf = ["aria-busy"], bf = {
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
    const n = e, a = t, s = C(() => Rs(n.environment)), o = C(
      () => {
        var $;
        return !n.readOnly && (($ = s.value) == null ? void 0 : $.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = C(() => {
      var $;
      return !n.readOnly && (($ = s.value) == null ? void 0 : $.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = C(() => n.readOnly ? [] : fd(n.environment, n.name, n.row)), c = _(null), d = _(null), h = _(""), p = _(!1), y = ($) => [$.from ? `From ${$.from}` : "", $.tip, $.warning].filter(Boolean).join(" · "), b = ($) => $.icon || ($.warning ? "dot" : "");
    function A($) {
      if (!(p.value || n.readOnly)) {
        if ($.fields.length) {
          c.value = $;
          return;
        }
        if ($.confirm) {
          d.value = $;
          return;
        }
        return S($);
      }
    }
    async function S($) {
      d.value = null, h.value = "", a("failure", ""), p.value = !0;
      const I = await gn($, n.row, n.environment);
      p.value = !1, h.value = I.ok ? "" : I.error;
      const H = $.label.toLowerCase() + (n.objectName && !$.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", I.ok ? "" : `Could not ${H}: ${I.error}`), I.ok && a("done");
    }
    return ($, I) => (u(), f("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), f(D, { key: 0 }, [
        I[5] || (I[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        T(pe, {
          small: "",
          onClick: i
        }, {
          default: j(() => [...I[4] || (I[4] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", bf, [
        m("span", kf, g(d.value.confirm), 1),
        T(pe, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: Y({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: I[0] || (I[0] = (H) => S(d.value))
        }, {
          default: j(() => [
            te(g(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        T(pe, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: I[1] || (I[1] = (H) => d.value = null)
        }, {
          default: j(() => [...I[6] || (I[6] = [
            te("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? w("", !0) : (u(), f(D, { key: 2 }, [
        (u(!0), f(D, null, ne(r.value, (H) => (u(), f(D, {
          key: H.name
        }, [
          H.menu.length ? (u(), F(sd, {
            key: 0,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": H.menu_label || "More ways",
            title: y(H),
            "data-button": H.name,
            onMain: (N) => A(H)
          }, {
            menu: j(({ close: N }) => [
              (u(!0), f(D, null, ne(H.menu, (E) => (u(), F(Ft, {
                key: E.label,
                description: E.description,
                onClick: (V) => (N(), A({ ...H, ...E, menu: [] }))
              }, {
                default: j(() => [
                  te(g(E.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              te(g(H.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), F(pe, {
            key: 1,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            bordered: !H.primary,
            class: Y({ danger: H.danger }),
            icon: b(H),
            disabled: p.value,
            title: y(H),
            "data-button": H.name,
            onClick: (N) => A(H)
          }, {
            default: j(() => [
              te(g(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", wf, g(h.value), 1)) : w("", !0),
        c.value && !e.readOnly ? (u(), F(mf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: I[2] || (I[2] = (H) => c.value = null),
          onDone: I[3] || (I[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : w("", !0)
      ], 64))
    ], 10, yf));
  }
}, Ds = /* @__PURE__ */ U($f, [["__scopeId", "data-v-4e15e598"]]), xf = {
  class: "running",
  "data-running-command": ""
}, Sf = ["title"], _f = {
  key: "idle",
  class: "running-idle"
}, Mf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", xf, [
      T(Ut, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, g(e.text), 9, Sf)) : (u(), f("span", _f, g(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, gS = /* @__PURE__ */ U(Mf, [["__scopeId", "data-v-8311b32c"]]), Cf = ["aria-checked", "aria-label", "title"], Ef = {
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
      class: Y(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      m("span", {
        class: Y(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (u(), f("span", Ef, g(e.word), 1)) : w("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", Af, g(e.word), 1)) : w("", !0)
    ], 10, Cf));
  }
}, yS = /* @__PURE__ */ U(Of, [["__scopeId", "data-v-688091a6"]]);
function ri(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Qn(e, t) {
  return ri(() => localStorage, e, t);
}
function ui(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ps(e, t) {
  return ui(() => localStorage, e, t);
}
function ci(e, t) {
  ve(t, (n) => Ps(e, n), { deep: !0 });
}
function Tf(e, t) {
  return ri(() => sessionStorage, e, t);
}
function If(e, t) {
  return ui(() => sessionStorage, e, t);
}
const Xn = "journal.environment", di = _(Tf(Xn, Qn(Xn, "")));
function Rf(e) {
  di.value = e, If(Xn, e), Ps(Xn, e);
}
const Jn = _(location.hash), $o = Je(null), xo = { integrations: "mcp", library: "team" };
function Bf() {
  if (!$o.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (xo[n]) {
    location.replace(`#/${[xo[n], ...a].join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash;
    return;
  }
  !n || $o.value(n) || (Rf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jn.value = location.hash, Bf();
});
const rs = C(() => {
  const [e, t = ""] = Jn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, r = ""] = l.split("@"), [c = "", d = "", h = ""] = i.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: r };
  });
  return {
    env: di.value,
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
}), js = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${js.page(e)}?open=${t}`
};
function Lf(e = "", t = 0, n = "") {
  location.hash = js.page(e, t, n);
}
function Nf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const qf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function fi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(qf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function bS(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function gt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = rs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  fi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Df(e, t, n, a = 0, s = "") {
  if (e === rs.value.env) return gt(t, n, a, s);
  const o = rs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  fi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function qe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Df(a, s, Number(o), 0, t) : gt(s, Number(o), 0, t);
}
function Pf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = Pf(e);
  t && qe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function kS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const jf = { class: "inspector-part" }, Ff = { class: "inspector-part-title" }, Wf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", jf, [
      m("h4", Ff, g(e.title), 1),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, wS = /* @__PURE__ */ U(Wf, [["__scopeId", "data-v-ce42766b"]]), So = /* @__PURE__ */ new Map(), Hf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = _(null), a = _(!1), s = _(t.name && So.get(t.name) || !1);
    function o(r) {
      s.value = r, t.name && So.set(t.name, r);
    }
    const l = () => {
      const r = !!n.value && n.value.scrollHeight > t.at;
      r !== a.value && (a.value = r);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (r, c) => (u(), f(D, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: be(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (d) => o(!0))
      }, [
        me(r.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = xe((d) => o(!s.value), ["stop"]))
      }, g(s.value ? "Show less" : "Show more"), 1)) : w("", !0)
    ], 64));
  }
}, zf = /* @__PURE__ */ U(Hf, [["__scopeId", "data-v-8d3ed132"]]), Uf = ["aria-valuenow", "aria-valuemax"], Gf = {
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
      class: Y(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: be({ width: n.value })
      }, null, 4)
    ], 10, Uf));
  }
}, hi = /* @__PURE__ */ U(Gf, [["__scopeId", "data-v-5045237e"]]), Vf = { processes: "process", memories: "memory", replies: "reply" }, Zn = (e) => (Vf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), us = [], Kf = 2e3, dt = /* @__PURE__ */ new Map(), Yf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Qf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? us.unshift(e) : us.push(e), dt.clear();
}
function mi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Xf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Jf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function lt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Zf(e, t) {
  const n = [{ type: "text", text: lt(e).replace(/\r\n/g, `
`) }];
  for (const a of us)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function rn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return eh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function eh(e) {
  return e.split(Qf).map((t, n) => n % 2 ? t : t.replace(Yf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function _o(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const th = 24;
function nh(e) {
  const [t, , ...n] = e, a = _o(t), s = n.map(_o), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > th) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${rn(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${rn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const pi = /^\s*(?:[-*+]|\d+[.)])\s+/, cs = /^\s*(\d+)[.)]\s/, Mo = (e) => e.match(/^\s*/)[0].length;
function vi(e) {
  const t = e[0].match(cs), n = Mo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Mo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${rn(o.text)}${o.nested.length ? vi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function ah(e, t) {
  const n = cs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (pi.test(e[s]) && cs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Co = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function gi(e) {
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
      n.push(`<h${i}>${rn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Co(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(nh(t.slice(a, i))), a = i;
      continue;
    }
    if (pi.test(s)) {
      const i = ah(t, a);
      n.push(vi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${gi(
          t.slice(a, i).map((r) => r.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Co(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${rn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const sh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, oh = (e) => e.type !== "text" && !sh.test(e.html);
function lh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(gi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : oh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Fs(e, t = { env: "" }) {
  const n = Jf(e, t), a = dt.get(n);
  if (dt.delete(n), a && a.source === t.source && a.reads.every((l) => Xf(l, t)))
    return dt.set(n, a), a.html;
  const s = [], o = lh(Zf(e, { ...t, reads: s }));
  return dt.set(n, { html: o, reads: s, source: t.source }), dt.size > Kf && dt.delete(dt.keys().next().value), o;
}
const Ca = /* @__PURE__ */ new WeakMap();
function ih(e) {
  if (Ca.has(e)) return Ca.get(e);
  const t = Yr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const h = s(c, d), p = e.read(`${Zn(c)} show ${d}`);
    n.set(h, p), p.then((y) => {
      n.get(h) === p && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Zn(c).replace(/-/g, "_")}.*`], (d) => {
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
  return Ca.set(e, r), r;
}
function yi() {
  const e = Ee(Pe, null), t = e ? ih(e) : null;
  return (n, a = {}) => Fs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const bi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, yn = (e) => String(e || "").replace(bi, (t, n, a, s) => s), rh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), In = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, uh = /^Traceback \(most recent call last\):/m, ch = 8;
function ki(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ch).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function dh(e) {
  const t = [...e.matchAll(rh)].map((a) => a.index);
  if (In.lastIndex = 0, !t.length || !In.test(e)) return null;
  In.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(In)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ki(n), tail: "" } : null;
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
  return { lead: e.slice(0, t.index), html: ki([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = yn(e), n = fh(t) || dh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ea = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, wi = (e) => `${e.table}:${e.id}`, Eo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ea = 80;
function Ao(e) {
  return e.length <= Ea ? e : `${e.slice(0, Ea + 1).replace(/\s+\S*$/, "") || e.slice(0, Ea)}…`;
}
const Oo = {
  messages: (e) => Ao(Eo(e.text)),
  comments: (e) => Ao(Eo(e.text)),
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
}, hh = (e) => (Oo[e.table] ? Oo[e.table](e) : e.title || "") || "", Et = (e) => ea(e.created_at), mh = (e) => ea(e.updated_at) || Et(e), ph = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, vh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function gh(e) {
  const t = ph.exec(e);
  if (t && mt(t[1])) return { at: t.index, length: t[0].length, table: mt(t[1]), id: Number(t[2]), label: t[3] };
  const n = vh.exec(e), a = n && mt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function yh(e, t, n, a) {
  const s = mi(a, e, t), o = yn(s ? hh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${lt(Vt(e).title)} ${t}</span><span class="row-card-title">${lt(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = gh(e);
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
  const n = wh.exec(e), [, a, s, o, l, i] = n || [], r = n && mt(a || o), c = r && mi(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Vt(r).title} ${c.id} · ${lt(i)}`, p = kh(i) ? `<img class="file-card-image" src="${d}" alt="${lt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${lt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function Sh(e) {
  const t = $h.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${lt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
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
const _h = /`([^`\n]+)`/g;
At((e) => e.replace(_h, (t, n) => `<code>${n}</code>`));
const To = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${js.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(bi, (n, a, s, o) => To[a] ? To[a](s, o, t) : o)
);
const Mh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, $i = new RegExp(`\\b(${ii}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), xi = new RegExp(`\\b(${ii}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Ch = new RegExp(`<code>((?:${$i.source}|${xi.source}))</code>`, "gi"), Eh = (e) => e.replace(Ch, "$1"), Ah = (e, t) => `<a class="row-pill" href="#" data-peek="${mt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Oh = (e) => e.replace(xi, (t, n, a) => a.replace(/\d+/g, (s) => Ah(n.replace(/s$/i, ""), s))), Th = (e) => Oh(e).replace(
  $i,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${mt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Eh(e).split(Mh).map((n, a) => a % 2 ? n : Th(n)).join("")
);
const Ih = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Rh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Bh = /[\w\]]\(/, Lh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Nh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, qh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Dh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Ph = /[[({,]$/, jh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Fh = /^(\t|\s{2,})\S/, Wh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Hh = /`[^`]+`/, zh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Uh = /[{}()[\];=<>$&|*\\@+^~%]/g, Si = /^\s*(?:[-*+]|\d+[.)])\s/, Gh = /^\s*>/, Vh = /^\s*\|/, Kh = 0.6, Yh = 0.4, Qh = 5, Xh = 0.03, _i = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Qh && t.every((n) => zh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Uh) ?? []).length / e.length < Xh;
}, Aa = (e) => {
  const t = e.trim();
  return Hh.test(t) ? !1 : [Ih, Rh, Bh, Lh, Nh, qh, Dh, Ph, jh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Fh.test(e) && !Si.test(e) && !_i(e);
};
function Jh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Si.test(t[0]) || t.every((o) => Gh.test(o) || Vh.test(o))) return "text";
  const n = t.filter((o) => !Wh.test(o.trim()));
  if (t.length === 1) return !n.length || Aa(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Aa).length, s = n.filter((o) => !Aa(o) && _i(o)).length;
  return a >= n.length * Kh && s <= n.length * Yh ? "code" : "text";
}
const ds = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Zh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", em = `${ds} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, tm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", nm = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Io = {
  js: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Zh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: em, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
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
function Ro(e, t, n) {
  return n && e.startsWith(n, t);
}
function sm(e, t) {
  const n = Io[am[t] ?? t] || Io.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Ro(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Ro(e, o, n.block[0])) {
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
function om(e, t) {
  const n = [""];
  for (const { type: a, value: s } of sm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? lt(l) : `<span class="tok-${a}">${lt(l)}</span>`);
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
const im = 1500, Bo = /* @__PURE__ */ new WeakMap();
async function rm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await lm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Bo.get(t)), Bo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, im)
  )));
}
typeof document < "u" && document.addEventListener("click", rm, !0);
const um = /\n\s*\n/, cm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, dm = /^\s*(`{3,}|~{3,})\s*$/, fm = /^\s{4,}\S/, hm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, fs = /^\s*(?:[-*+]|\d+[.)])\s/, Mi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, mm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ws(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function pm(e) {
  const t = Ws(e.join(`
`));
  return (mm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const vm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Mi.test(t) && !fs.test(t);
}, gm = (e, t) => fs.test(t) || fs.test([...e].reverse().find((n) => n.trim()) || "");
function Hs(e, t) {
  const n = t || pm(e), a = om(Ws(e.join(`
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
  return Hs(a.map(yn), n ? n.toLowerCase() : "");
}
function km(e) {
  const t = e.split(um).map((l) => ({ paragraph: l, type: Jh(Ws(l).split(`
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
      s(), n.push(Hs(i.map(({ paragraph: r }) => r).join(`

`).split(`
`).map(yn), "")), o = l;
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
    const r = vm(s) ? hm : fm;
    if (!t && r.test(n[l]) && !gm(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Mi.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Hs([...d, ...n.slice(l, c)].map(yn), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => wm(e, t.document), { first: !0 });
const $m = ["innerHTML"], xm = ["innerHTML"], Sm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = yi(), a = C(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => B(Nt) && B(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, $m)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => B(Nt) && B(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, xm));
  }
}, st = /* @__PURE__ */ U(Sm, [["__scopeId", "data-v-7cbf7b8a"]]), Lo = (e) => [...new Set(e.agents.map((t) => t.name))], _m = (e) => Lo(e).length === 1 ? `Worker: ${Lo(e)[0]}` : "Delegated", Mm = ["aria-expanded"], Cm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Em = {
  key: 0,
  class: "tip-failure"
}, Am = { key: 1 }, Om = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Ee(Pe, null), a = C(() => md(t.type, t.state)), s = _(!1), o = _([]), l = _("");
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
      onKeydown: Ct(r, ["escape"])
    }, [
      te(g(B(ln)(e.type, e.state)) + " ", 1),
      s.value ? (u(), f("span", Cm, [
        l.value ? (u(), f("span", Em, g(l.value), 1)) : w("", !0),
        (u(!0), f(D, null, ne(o.value, (p, y) => (u(), f("span", {
          key: y,
          class: "tip-line"
        }, g(p), 1))), 128))
      ])) : w("", !0)
    ], 40, Mm)) : (u(), f("span", Am, g(B(ln)(e.type, e.state)), 1));
  }
}, Tm = /* @__PURE__ */ U(Om, [["__scopeId", "data-v-875d4fe6"]]), Im = {
  class: "plan-details",
  "data-plan-details": ""
}, Rm = { class: "state-line" }, Bm = {
  key: 0,
  class: "phase-count"
}, Lm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Nm = { class: "text" }, qm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Dm = { class: "overall" }, Pm = { class: "overall-figure" }, jm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Fm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, Wm = {
  key: 4,
  class: "part"
}, Hm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (u(), f("div", Im, [
      m("div", Rm, [
        T(Tm, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: Y(["status", B(Yl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Bm, "Phase " + g(e.plan.current_phase) + " of " + g(e.plan.phases.length), 1)) : w("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Lm, [
        m("h4", null, g(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Nm, g(e.plan.reason), 1)
      ])) : w("", !0),
      e.plan.total ? (u(), f("section", qm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Dm, [
          T(hi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Pm, g(e.plan.finished) + " of " + g(e.plan.total) + " done", 1)
        ])
      ])) : w("", !0),
      e.plan.assignee ? (u(), f("p", jm, "Agent: " + g(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), f("p", Fm, g(B(_m)(e.plan)), 1)) : w("", !0),
      e.plan.brief ? (u(), f("section", Wm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        T(zf, {
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
}, $S = /* @__PURE__ */ U(Hm, [["__scopeId", "data-v-a6cc8422"]]), zm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Um = { ...zm, done: "Completed" }, Gm = /* @__PURE__ */ new Set(["completed", "cancelled"]), Vm = (e) => Gm.has(e), un = (e) => Vm(e) ? "done" : e, Km = { class: "task-status-icon" }, Ym = ["width", "height", "aria-label"], Qm = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = C(() => Yl("task", un(t.status))), a = C(() => n.value === "testing" ? "started" : n.value), s = C(() => Um[t.status] ?? ln("task", t.status));
    return (o, l) => (u(), f("span", Km, [
      T(Ut, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (u(), f("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            T(Gt, { value: a.value }, {
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
          ], 10, Ym))
        ]),
        _: 1
      })
    ]));
  }
}, bn = /* @__PURE__ */ U(Qm, [["__scopeId", "data-v-b13c7c09"]]), Xm = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Jm = ["title", "onClick"], Zm = { class: "agent-word" }, ep = {
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
    return (o, l) => s.value.length ? (u(), f("div", Xm, [
      (u(!0), f(D, null, ne(s.value, (i) => (u(), f("button", {
        key: i.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${i.name}`,
        "data-plan-phase-agent": "",
        onClick: (r) => B(qe)(`agents:${i.id}`)
      }, [
        m("span", {
          class: Y(["agent-dot", { held: i.held }])
        }, null, 2),
        te(" " + g(i.name) + " ", 1),
        m("span", Zm, g(i.held ? "Working" : "Queued"), 1)
      ], 8, Jm))), 128))
    ])) : w("", !0);
  }
}, tp = /* @__PURE__ */ U(ep, [["__scopeId", "data-v-f4cb8f20"]]), np = { class: "phases" }, ap = { class: "phead" }, sp = { class: "mark" }, op = { class: "ptitle" }, lp = { class: "phead-end" }, ip = {
  key: 0,
  class: "checkpoint"
}, rp = { class: "progress" }, up = {
  key: 0,
  class: "when"
}, cp = ["onClick"], dp = { class: "row-id" }, fp = { class: "row-title" }, hp = ["title"], mp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((i) => n.has(i.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, i) => (u(), f("ol", np, [
      (u(!0), f(D, null, ne(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: Y(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", ap, [
          m("span", sp, [
            T(ge, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", op, g(c + 1) + ". " + g(r.title), 1),
          m("span", lp, [
            r.checkpoint ? (u(), f("span", ip, "checkpoint")) : w("", !0),
            m("span", rp, g(s(r)) + "/" + g(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", up, g(r.goal), 1)) : w("", !0),
        T(tp, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(D, null, ne(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: Y(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          T(bn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", dp, "#" + g(d.id), 1),
          m("span", fp, g(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, g(d.helper_name), 9, hp)) : w("", !0)
        ], 10, cp))), 128))
      ], 2))), 128))
    ]));
  }
}, xS = /* @__PURE__ */ U(mp, [["__scopeId", "data-v-5b512846"]]), pp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, vp = {
  key: 0,
  class: "empty",
  role: "alert"
}, gp = {
  key: 2,
  class: "empty"
}, yp = { class: "day" }, bp = { class: "events" }, kp = { class: "mark" }, wp = { class: "what" }, $p = { class: "head" }, xp = { class: "word" }, Sp = ["title", "onClick"], _p = { class: "at" }, Mp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = _(null), l = _(""), i = C(() => {
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
    return ve(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", pp, [
      l.value ? (u(), f("p", vp, g(l.value), 1)) : o.value === null ? (u(), F(Ye, { key: 1 })) : o.value.length ? w("", !0) : (u(), f("p", gp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(D, null, ne(i.value, (p) => (u(), f(D, {
        key: p.day
      }, [
        m("h3", yp, g(p.day), 1),
        m("ol", bp, [
          (u(!0), f(D, null, ne(p.items, (y) => (u(), f("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", kp, [
              n[y.event_type].state ? (u(), F(bn, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (u(), F(ge, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", wp, [
              m("div", $p, [
                m("span", xp, g(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + g(y.task_id) + " " + g(y.title), 9, Sp),
                m("span", _p, g(r(y.time)), 1)
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
}, SS = /* @__PURE__ */ U(Mp, [["__scopeId", "data-v-0d2d78ad"]]);
function Cp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function zs(e, t = Date.now()) {
  const n = Cp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Ep = 36e5;
function Ap(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Ep;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function No(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Ci(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function qo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Oa = (e) => String(e).padStart(2, "0");
function Ei(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Oa(t % 60)}s` : `${Math.floor(t / 3600)}h ${Oa(Math.floor(t % 3600 / 60))}m ${Oa(t % 60)}s`;
}
const Op = 1e3;
function Ai() {
  const e = _(Date.now()), t = setInterval(() => e.value = Date.now(), Op);
  return Ke(() => clearInterval(t)), e;
}
const Tp = Symbol("resource-subscriptions");
function kn(e, t) {
  const n = Ee(Tp, () => new Wl(), !0), a = Os(t, 100), s = n.follow("resources", e, a);
  da(() => {
    s(), a.cancel();
  });
}
const Ip = "Not known", Rp = 80, Bp = 1e3, Lp = "worker", Np = "main", qp = /* @__PURE__ */ new Set(["waiting", "blocked"]), Oi = (e) => e.ok ? e.value.rows : [], Do = (e) => e.ok ? e.value.total : 0, Ti = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Dp = (e, t) => (t == null ? void 0 : t.given_name) || Ti((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Pp = (e, t) => e.ended_at ? "ended" : e.paused_at || qp.has(t == null ? void 0 : t.state) ? "waiting" : "running", jp = (e, t) => [(t == null ? void 0 : t.profile) && Ti(t.profile_title || t.profile), e.program, t == null ? void 0 : t.model, (t == null ? void 0 : t.effort) && `${t.effort} effort`].filter(Boolean), Ii = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Fp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Bp, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ei(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Rp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Ip : `$${t.cost_dollars.toFixed(2)}` }), e.role === Lp && l.push({ key: "pace", label: "Tasks an hour", value: String(Ap(Ii(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Np && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Wp(e) {
  const t = Ii(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Hp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", No(e.created_at)]), e.ended_at && n.push(["Ended", No(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const zp = { class: "band" }, Up = { key: 0 }, Gp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", zp, [
      T(ge, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      me(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", Up, g(e.count), 1)) : w("", !0)
    ]));
  }
}, Wt = /* @__PURE__ */ U(Gp, [["__scopeId", "data-v-9cc4041c"]]), Vp = { class: "number" }, Kp = { class: "text" }, Yp = 150, Qp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = _(!1), a = C(() => t.text.length > Yp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(D, null, [
      e.text ? (u(), f(D, { key: 0 }, [
        T(Wt, { icon: "file" }, {
          default: j(() => [
            te(g(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: Y(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, g(e.text), 3),
        a.value && !n.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : w("", !0)
      ], 64)) : w("", !0),
      e.points.length ? (u(), f(D, { key: 1 }, [
        T(Wt, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
            te("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(D, null, ne(e.points, (i) => {
          var r;
          return u(), f("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", Vp, g(i.id), 1),
            m("span", Kp, [
              te(g(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, g(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : w("", !0)
    ], 64));
  }
}, Xp = /* @__PURE__ */ U(Qp, [["__scopeId", "data-v-93e545db"]]), Jp = ["aria-expanded"], Zp = { class: "count" }, e1 = {
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
    const t = sn(e, "open");
    return (n, a) => (u(), f(D, null, [
      m("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        T(ge, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        te(g(e.label), 1),
        m("span", Zp, g(e.count), 1),
        T(ge, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Jp),
      t.value ? (u(), f("div", e1, [
        me(n.$slots, "default", {}, void 0, !0)
      ])) : w("", !0)
    ], 64));
  }
}, Ta = /* @__PURE__ */ U(t1, [["__scopeId", "data-v-f723d34b"]]), n1 = ["onClick"], a1 = { class: "text" }, s1 = { class: "aside" }, o1 = {
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
    const t = e, n = zt({ helpers: !1, skills: !1 }), a = _([]), s = _([]), o = async (i) => Oi(await t.read(i));
    ve(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ve(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Yn(i.role)} ${i.id}`;
    return (i, r) => (u(), f(D, null, [
      T(Ta, {
        open: n.helpers,
        "onUpdate:open": r[0] || (r[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: j(() => [
          (u(!0), f(D, null, ne(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => B(gt)("agents", c.id)
          }, [
            m("span", a1, g(l(c)), 1),
            m("span", s1, g(B(Yn)(c.role)) + " " + g(c.id), 1)
          ], 8, n1))), 128)),
          a.value.length ? w("", !0) : (u(), f("p", o1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      T(Ta, {
        open: n.skills,
        "onUpdate:open": r[1] || (r[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: j(() => [
          m("p", l1, [
            (u(!0), f(D, null, ne(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, g(c.skill), 1))), 128)),
            s.value.length ? w("", !0) : (u(), f("span", i1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      T(Ta, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: j(() => [
          (u(!0), f(D, null, ne(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", r1, g(c) + ":", 1),
            m("span", {
              class: Y(["value", h])
            }, g(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, c1 = /* @__PURE__ */ U(u1, [["__scopeId", "data-v-a7f55464"]]), d1 = ["datetime", "title"], et = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ai(), a = C(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, g(B(zs)(e.at, B(n))), 9, d1));
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
}, v1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, g1 = { class: "line" }, y1 = { class: "detail" }, b1 = { class: "bar" }, k1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = C(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(D, null, [
      T(Wt, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          te("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", f1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => B(gt)("tasks", e.inspection.task.id))
        }, "Task " + g(e.inspection.task.id) + ": " + g(e.inspection.task.title), 1)) : (u(), f("span", h1, g(e.nothing), 1)),
        n.value ? (u(), f("span", m1, g(n.value), 1)) : w("", !0),
        e.inspection.last_activity ? (u(), f("span", p1, [
          o[3] || (o[3] = te("Last heard: ", -1)),
          T(et, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : w("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", v1, [
        m("div", g1, [
          m("span", null, "Plan " + g(e.inspection.plan.id) + ", phase " + g(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => B(gt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", y1, g(e.inspection.plan.done) + " of " + g(e.inspection.plan.total) + " tasks done", 1),
        m("div", b1, [
          m("i", {
            style: be({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : w("", !0)
    ], 64));
  }
}, w1 = /* @__PURE__ */ U(k1, [["__scopeId", "data-v-14102956"]]), $1 = ["onClick"], x1 = { class: "text" }, S1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, _1 = { class: "text" }, M1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, C1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(D, null, [
      T(Wt, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
          te("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), f(D, null, ne(e.moves, (a) => (u(), f(D, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => B(gt)(a.table, a.id)
        }, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", x1, g(a.text), 1),
          T(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, $1)) : (u(), f("div", S1, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", _1, g(a.text), 1),
          T(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? w("", !0) : (u(), f("p", M1, "Nothing yet."))
    ], 64));
  }
}, E1 = /* @__PURE__ */ U(C1, [["__scopeId", "data-v-b89a5e22"]]), A1 = {
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
      (u(!0), f(D, null, ne(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, g(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, g(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", T1, [
          m("i", {
            class: Y({ high: a.high }),
            style: be({ width: `${a.meter}%` })
          }, null, 6)
        ])) : w("", !0)
      ], 8, O1))), 128))
    ]));
  }
}, R1 = /* @__PURE__ */ U(I1, [["__scopeId", "data-v-e47edc19"]]), B1 = {
  class: "who",
  "data-agent-who": ""
}, L1 = { class: "name" }, N1 = ["data-agent-state"], q1 = {
  class: "sub",
  "data-agent-identity": ""
}, D1 = {
  class: "sub",
  "data-agent-started-by": ""
}, P1 = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, parts: { type: Array, required: !0 }, startedBy: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", B1, [
      m("h2", L1, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, N1),
        te(g(e.name), 1)
      ]),
      m("p", q1, g(e.parts.join(" · ")), 1),
      m("p", D1, "Started by: " + g(e.startedBy), 1)
    ]));
  }
}, j1 = /* @__PURE__ */ U(P1, [["__scopeId", "data-v-80917129"]]), F1 = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, W1 = { class: "scroll" }, H1 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, z1 = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, U1 = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ai(), a = _(null), s = _(null), o = _(null), l = _({}), i = _({ helpers: 0, skills: 0 }), r = _(0), c = _([]), d = _("");
    let h = 0;
    const p = C(() => {
      var b;
      return a.value.ended_at ? Wp(s.value) : `It has no task.${(b = s.value) != null && b.instruction ? " It was given an instruction." : ""}`;
    });
    async function y() {
      const b = ++h, A = await t.read(["agent", "show", String(t.id)]);
      if (b !== h) return;
      if (!A.ok) return void (d.value = A.error);
      const S = String(t.id), $ = A.value.role === "worker", [I, H, N, E, V, W] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", S, "--environment", t.environment]),
        t.read(["usage", "agent", S]),
        A.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", S]),
        t.read(["agent", "list", "--parent", S, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", S, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        $ ? t.read(["worker-worktree", "points", "--agent", S]) : { ok: !1 }
      ]);
      b === h && (d.value = H.ok ? "" : H.error, a.value = A.value, s.value = Oi(I).find((q) => q.id === t.id) ?? null, o.value = H.ok ? H.value : null, l.value = N.ok ? N.value : {}, i.value = { helpers: Do(E), skills: Do(V) }, c.value = W.ok ? W.value.points : [], r.value += 1);
    }
    return kn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], y), _e(y), (b, A) => {
      var S;
      return u(), f("article", F1, [
        m("div", W1, [
          d.value ? (u(), f("p", H1, g(d.value), 1)) : a.value && o.value ? (u(), f(D, { key: 1 }, [
            T(j1, {
              name: B(Dp)(a.value, s.value),
              state: B(Pp)(a.value, s.value),
              parts: B(jp)(a.value, s.value),
              "started-by": o.value.started_by
            }, null, 8, ["name", "state", "parts", "started-by"]),
            T(R1, {
              cells: B(Fp)({ row: a.value, facts: s.value, inspection: o.value, now: B(n) })
            }, null, 8, ["cells"]),
            T(w1, {
              inspection: o.value,
              tool: l.value,
              nothing: p.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            T(Xp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((S = s.value) == null ? void 0 : S.instruction) ?? "",
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
              details: B(Hp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", z1, "Ended " + g(B(zs)(a.value.ended_at, B(n))) + ". It takes no more actions.", 1)) : w("", !0)
          ], 64)) : (u(), F(Ye, { key: 2 }))
        ])
      ]);
    };
  }
}, _S = /* @__PURE__ */ U(U1, [["__scopeId", "data-v-faadddd1"]]), G1 = ["aria-expanded"], V1 = { class: "drop-label" }, K1 = ["value"], Y1 = {
  key: 1,
  class: "drop-lead"
}, Q1 = { class: "drop-item-text" }, X1 = {
  key: 2,
  class: "drop-note"
}, J1 = {
  key: 1,
  class: "drop-none"
}, Z1 = {
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
    const n = e, a = t, s = _(!1), o = _(null), l = _(""), i = C(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function r(c) {
      s.value = !1, a("pick", c);
    }
    return (c, d) => (u(), f("div", {
      class: Y(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Y(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (u(), F(ge, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : w("", !0),
        m("span", V1, g(e.label), 1),
        T(ge, {
          name: "down",
          size: 11
        })
      ], 10, G1),
      s.value ? (u(), F(Is, {
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
          }, null, 40, K1)) : w("", !0),
          (u(!0), f(D, null, ne(i.value, (h) => (u(), F(Ft, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => r(h)
          }, {
            default: j(() => [
              h.running !== void 0 ? (u(), f("span", {
                key: 0,
                class: Y(["drop-dot", { live: h.running }])
              }, null, 2)) : w("", !0),
              h.lead ? (u(), f("span", Y1, g(h.lead), 1)) : w("", !0),
              m("span", Q1, g(h.label), 1),
              h.note ? (u(), f("span", X1, g(h.note), 1)) : w("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? w("", !0) : (u(), f("p", J1, g(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : w("", !0)
    ], 2));
  }
}, Ri = /* @__PURE__ */ U(Z1, [["__scopeId", "data-v-9d0322ab"]]);
function ev(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), Ke(() => n.disconnect()), t;
}
const tv = ["data-comment-id"], nv = {
  key: 0,
  class: "comment-top"
}, av = { class: "comment-mark" }, sv = {
  class: "comment-body",
  "data-comment": ""
}, ov = { class: "comment-foot" }, lv = {
  key: 1,
  "data-comment-lost": ""
}, iv = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (u(), f("article", {
      class: Y(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (u(), f("div", nv, [
        m("span", av, g(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, g(e.comment.quote), 3)
      ])) : w("", !0),
      m("p", sv, g(e.comment.body), 1),
      m("div", ov, [
        e.comment.created_at ? (u(), F(et, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : w("", !0),
        e.lost ? (u(), f("span", lv, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : w("", !0)
      ])
    ], 10, tv));
  }
}, Bi = /* @__PURE__ */ U(iv, [["__scopeId", "data-v-a6358c22"]]);
var Al;
/Mac|iPhone|iPad/.test(((Al = navigator.userAgentData) == null ? void 0 : Al.platform) || navigator.platform);
function Li(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const rv = {
  class: "comment-box",
  "data-comment-box": ""
}, uv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, cv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, dv = { class: "comment-row" }, fv = ["placeholder"], hv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Pt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Pt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = sn(e, "draft"), l = _(""), i = _(!1), r = _(null), c = C(() => {
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
    return t({ focus: () => r.value.focus() }), (y, b) => (u(), f("div", rv, [
      e.selection ? (u(), f("div", uv, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, g(e.selection.quote), 3),
        T(fa, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (A) => s("clear"))
        })
      ])) : w("", !0),
      l.value ? (u(), f("p", cv, g(l.value), 1)) : w("", !0),
      m("div", dv, [
        Ze(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": b[1] || (b[1] = (A) => o.value = A),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Ct((A) => B(Li)(A, p), ["enter"]))
        }, null, 42, fv), [
          [Kn, o.value]
        ]),
        T(pe, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: j(() => [...b[4] || (b[4] = [
            te("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, mv = /* @__PURE__ */ U(hv, [["__scopeId", "data-v-08eb1031"]]), Rn = (e) => e ? e.split(", ") : [];
function pv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function vv(e, t) {
  return {
    reads: Rn(e.reads_allowed),
    runs: Rn(e.runs_allowed),
    missing: [...Rn(e.reads_missing), ...Rn(e.runs_missing)],
    ask: t
  };
}
const gv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Qr("SkeletonParts", !0);
      return u(!0), f(D, null, ne(e.parts, (r, c) => (u(), f(D, { key: c }, [
        (u(!0), f(D, null, ne(r.count, (d) => (u(), F(Gt, {
          key: d,
          value: r.shape
        }, {
          line: j(() => [
            T(Jt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: be({ width: r.width, height: `${t[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            T(Jt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: be({ width: `${n[r.size]}px`, height: `${n[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            T(Jt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: be({ width: r.width, height: `${r.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            m("div", {
              class: "skeleton-row",
              style: be(a(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            m("div", {
              class: "skeleton-stack",
              style: be(a(r))
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
              style: be(a(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            m("div", {
              class: "skeleton-grid",
              style: be(s(r))
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
}), yv = /* @__PURE__ */ U(gv, [["__scopeId", "data-v-b78e62d9"]]), bv = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, kv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", bv, [
      T(yv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Us = /* @__PURE__ */ U(kv, [["__scopeId", "data-v-a5cff6ec"]]), Ni = {
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
}, wv = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["badge", e.tone])
    }, g(e.text), 3));
  }
}, qi = /* @__PURE__ */ U(wv, [["__scopeId", "data-v-6ef74765"]]), $v = { class: "bars" }, xv = { class: "bar-name" }, Sv = { class: "bar-value" }, _v = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = C(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", $v, [
      (u(!0), f(D, null, ne(e.items, (r, c) => (u(), F(bt(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: Y(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          m("span", xv, g(r.label), 1),
          T(hi, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Sv, g(r.value) + g(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Mv = /* @__PURE__ */ U(_v, [["__scopeId", "data-v-09485718"]]), Cv = { class: "bars" }, Ev = {
  key: 0,
  class: "bars-title"
}, Av = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Cv, [
      e.node.title ? (u(), f("span", Ev, g(e.node.title), 1)) : w("", !0),
      T(Mv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Ov = /* @__PURE__ */ U(Av, [["__scopeId", "data-v-a9861a72"]]), Tv = {
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
      class: Y([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: be(o.value)
    }, [
      (u(!0), f(D, null, ne(e.node.children || [], (r, c) => (u(), F(Di, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Fn = /* @__PURE__ */ U(Tv, [["__scopeId", "data-v-2a5c17d3"]]), Iv = {
  key: 0,
  class: "card-head"
}, Rv = { class: "card-title" }, Bv = {
  key: 0,
  class: "card-note"
}, Lv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", Iv, [
        m("span", Rv, g(e.node.title), 1),
        e.node.note ? (u(), f("span", Bv, g(e.node.note), 1)) : w("", !0)
      ])) : w("", !0),
      T(Fn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Nv = /* @__PURE__ */ U(Lv, [["__scopeId", "data-v-bb0b3bdb"]]), qv = { class: "fact" }, Dv = { class: "fact-label" }, Pv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", qv, [
      m("span", Dv, g(e.label), 1),
      T(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, jv = /* @__PURE__ */ U(Pv, [["__scopeId", "data-v-a0ce1d97"]]), Fv = { class: "list" }, Wv = { class: "list-label" }, Hv = {
  key: 1,
  class: "list-note"
}, zv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Fv, [
      (u(!0), f(D, null, ne(e.items, (o, l) => (u(), F(bt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", Wv, g(o.label), 1),
          o.badge ? (u(), F(qi, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : w("", !0),
          o.note ? (u(), f("span", Hv, g(o.note), 1)) : w("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Uv = /* @__PURE__ */ U(zv, [["__scopeId", "data-v-e2e240a1"]]), Gv = { class: "table" }, Vv = {
  key: 0,
  class: "table-row empty"
}, Kv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", Gv, [
      m("div", {
        class: "table-row head",
        style: be(s.value)
      }, [
        (u(!0), f(D, null, ne(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, g(i), 1))), 128))
      ], 4),
      (u(!0), f(D, null, ne(e.rows, (i, r) => (u(), F(bt(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: be(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          (u(!0), f(D, null, ne(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, g(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", Vv, g(e.empty), 1)) : w("", !0)
    ]));
  }
}, Yv = /* @__PURE__ */ U(Kv, [["__scopeId", "data-v-349d16ca"]]), Qv = { class: "stat-value" }, Xv = { class: "stat-label" }, Jv = {
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
    return (a, s) => (u(), F(bt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        m("span", Qv, g(e.value), 1),
        m("span", Xv, g(e.label), 1),
        e.note ? (u(), f("span", Jv, g(e.note), 1)) : w("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, eg = /* @__PURE__ */ U(Zv, [["__scopeId", "data-v-bf2aa36f"]]), tg = { class: "code" }, ng = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), F(Gt, {
      value: e.node.type
    }, {
      stack: j(() => [
        T(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        T(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        T(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        T(Nv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        m("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, g(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        T(eg, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        T(Ov, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        T(Yv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        T(Uv, {
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
        T(jv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        T(qi, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", tg, [
          m("code", null, g(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, g(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Di = /* @__PURE__ */ U(ng, [["__scopeId", "data-v-92ed1e03"]]), ag = { class: "dashboard" }, sg = { class: "trail" }, og = ["onClick"], lg = {
  key: 0,
  class: "gone",
  role: "status"
}, ig = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = _(!!n.page && !s(n.page)), l = _(n.page && !o.value ? [n.page] : []), i = C(() => l.value.at(-1) || n.document.start), r = C(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ve(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (u(), f("div", ag, [
      e.document.broken ? (u(), F(on, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          te(g(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), F(on, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          te(g(e.document.missing), 1)
        ]),
        _: 1
      })) : r.value ? (u(), f(D, { key: 2 }, [
        m("nav", sg, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, g(c(e.document.start)), 3),
          (u(!0), f(D, null, ne(l.value, (b, A) => (u(), f(D, {
            key: `${A}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: A === l.value.length - 1 }]),
              onClick: (S) => h(A + 1)
            }, g(c(b)), 11, og)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", lg, "What you opened is no longer in this dashboard. Here is its start page.")) : w("", !0),
        T(Ut, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              T(Di, {
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
}, rg = /* @__PURE__ */ U(ig, [["__scopeId", "data-v-9e88e6d3"]]);
function ug(e, t) {
  const n = Ue(), a = Os(e, Ni.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), Ke(() => {
    s(), a.cancel();
  });
}
const cg = {
  key: 0,
  class: "window-failure"
}, dg = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ue(), o = _(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? ug(l, n.events) : Es(l, () => !0, Ni.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", cg, g(o.value.error), 1)) : o.value ? (u(), F(rg, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : w("", !0);
  }
}, fg = 1e4;
class hg {
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
    return this.heardAt !== null && t - this.heardAt > fg;
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
const mg = {
  key: 0,
  class: "frame-note"
}, pg = {
  key: 0,
  class: "frame-note"
}, vg = ["src", "title"], gg = 1e3, yg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ue(), a = _(null), s = _(!1), o = _(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new hg(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, gg);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", mg, "This window was closed because it stopped answering.")) : (u(), f(D, { key: 1 }, [
      s.value ? (u(), f("div", pg, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        T(pe, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...c[1] || (c[1] = [
            te("Close the window", -1)
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
        title: B(n).window
      }, null, 8, vg)
    ], 64));
  }
}, bg = /* @__PURE__ */ U(yg, [["__scopeId", "data-v-f3cb2f7c"]]), kg = {
  class: "allowance-prompt",
  role: "dialog"
}, wg = { class: "allowance-prompt-text" }, $g = { class: "allowance-prompt-buttons" }, xg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", kg, [
      m("p", wg, g(B(pv)(e.request)), 1),
      m("div", $g, [
        T(pe, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            te("Allow", -1)
          ])]),
          _: 1
        }),
        T(pe, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            te("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Sg = /* @__PURE__ */ U(xg, [["__scopeId", "data-v-9319ffca"]]), Ia = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), F(on, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        te(g(e.reason) + " ", 1),
        e.retry ? (u(), F(pe, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            te("Retry", -1)
          ])]),
          _: 1
        })) : w("", !0),
        e.removable ? (u(), F(pe, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            te("Remove tab", -1)
          ])]),
          _: 1
        })) : w("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, _g = ["data-window", "data-agent"], Mg = {
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
    const n = e, a = t, s = _(""), o = _(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Ee(wc, null), r = kd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: C(() => n.options),
      declared: n.declared,
      page: Ee(pd, null),
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
    Ol(Pe, r), ve(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), _e(r.settle), Re(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Xr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ra(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), F(Sg, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : w("", !0),
      e.unavailableReason ? (u(), F(Ia, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), F(Ia, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(D, { key: 4 }, [
        (u(), F(c, { key: o.value })),
        e.skeleton.length && !B(r).answered.value ? (u(), F(Us, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : w("", !0)
      ], 64)) : (u(), F(Ia, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, _g));
  }
}, Zt = /* @__PURE__ */ U(Mg, [["__scopeId", "data-v-bd481e0c"]]), Pi = {
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
    const n = e, a = t, s = { render: () => ra(bg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), F(Zt, {
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
}, Cg = ["data-window"], ji = {
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
    const n = e, a = t, s = Je(null), o = _("");
    return ve(
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
      T(Us, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Cg)) : (u(), F(Zt, {
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
}, Eg = {
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
    const n = t, a = e, s = C(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = C(() => s.value && { render: () => ra(dg, { line: s.value.line, events: s.value.events }) }), l = _(null), i = C(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), r = C(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = C(
      () => {
        var p, y;
        return l.value ? vv(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
    return ve(
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
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), F(Us, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((A = s.value) == null ? void 0 : A.shows) === "one-agent" && e.agent === null ? (u(), F(on, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), F(Zt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": r.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), F(ji, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (S, $) => n("option", S, $))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), F(Pi, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (S, $) => n("option", S, $))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), F(Zt, {
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
        onOption: y[2] || (y[2] = (S, $) => n("option", S, $))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), F(Zt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (S) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Ag = ["data-section"], Og = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Tg = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ee(Ls, null), a = C(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = C(() => ({ row: t.row }));
    return (o, l) => B(n) ? (u(!0), f(D, { key: 0 }, ne(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), F(Eg, {
        key: 0,
        name: i.name,
        catalogue: B(n).catalogue,
        subscriptions: B(n).subscriptions,
        environment: B(n).environment,
        prompts: B(n).prompts,
        "shell-read": B(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", Og, g(i.name) + " is not available", 1))
    ], 8, Ag))), 128)) : w("", !0);
  }
}, hs = /* @__PURE__ */ U(Tg, [["__scopeId", "data-v-f91fd1c7"]]), Ig = { class: "rail-head" }, Rg = { key: 0 }, Bg = {
  key: 1,
  class: "rail-none"
}, Lg = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Ig, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", Rg, g(e.total || e.comments.length), 1)) : w("", !0)
      ]),
      e.comments.length ? (u(!0), f(D, { key: 0 }, ne(e.comments, (a) => (u(), F(Bi, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", Bg, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Ng = /* @__PURE__ */ U(Lg, [["__scopeId", "data-v-f92148da"]]), qg = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, Dg = ["aria-pressed"], Pg = ["aria-pressed"], jg = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Fg = {
  key: 0,
  role: "alert"
}, Wg = {
  key: 1,
  class: "sidebar-none"
}, Hg = ["data-question-id"], zg = { class: "question-state" }, Ug = ["data-question-show", "onClick"], Gg = {
  key: 0,
  class: "sidebar-none"
}, Vg = {
  key: 1,
  class: "question-answer"
}, Kg = {
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
    const t = Ee(Ls, null);
    return (n, a) => (u(), f("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", qg, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, Dg),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Pg)
      ]),
      e.mode === "comments" ? (u(), f(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), F(Ng, {
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
      ], 64)) : (u(), f("aside", jg, [
        e.failure ? (u(), f("p", Fg, g(e.failure), 1)) : e.questions.length ? w("", !0) : (u(), f("p", Wg, "No questions about this text yet.")),
        (u(!0), f(D, null, ne(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", zg, g(B(ln)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, g(s.text), 9, Ug),
            s.quote ? (u(), f(D, { key: 0 }, [
              m("blockquote", null, g(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", Gg, "The quoted text has changed.")) : w("", !0)
            ], 64)) : w("", !0),
            s.answer ? (u(), f("p", Vg, "Answered: " + g(s.answer), 1)) : w("", !0),
            T(hs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            T(Ds, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = B(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Hg);
        }), 128))
      ]))
    ], 2));
  }
}, Po = /* @__PURE__ */ U(Kg, [["__scopeId", "data-v-6c028687"]]), Yg = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Qg = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = zt({ abstract: n.row.abstract, body: n.row.body }), o = _("");
    async function l() {
      const i = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, r) => (u(), F(ha, {
      title: "Edit the document",
      wide: "",
      onClose: r[3] || (r[3] = (c) => a("close"))
    }, {
      foot: j(() => [
        m("span", Yg, g(o.value), 1),
        T(pe, {
          onClick: r[2] || (r[2] = (c) => a("close"))
        }, {
          default: j(() => [...r[6] || (r[6] = [
            te("Cancel", -1)
          ])]),
          _: 1
        }),
        T(pe, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: j(() => [...r[7] || (r[7] = [
            te("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: j(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: xe(l, ["prevent"])
        }, [
          m("label", null, [
            r[4] || (r[4] = m("span", null, "Abstract", -1)),
            Ze(m("input", {
              "onUpdate:modelValue": r[0] || (r[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Kn, s.abstract]
            ])
          ]),
          m("label", null, [
            r[5] || (r[5] = m("span", null, "Text", -1)),
            Ze(m("textarea", {
              "onUpdate:modelValue": r[1] || (r[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Kn, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Xg = /* @__PURE__ */ U(Qg, [["__scopeId", "data-v-6d23f781"]]);
function Fi(e, t) {
  const n = _([]), a = _(!1), s = _(null), o = _(0), l = _(!1), i = _("");
  let r = 0, c = 0;
  const d = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: A, id: S, title: $ } = e(), I = `On ${A} ${S}, ${$}: `;
    return b.text.startsWith(I) ? b.text.slice(I.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: A, id: S } = e();
    if (!S) return;
    const $ = ++c;
    l.value = !0, i.value = "";
    try {
      const I = await t([A, "comments", String(S), "--page", String(b), "--page-size", "25"]);
      if ($ !== c) return;
      if (!I.ok) {
        i.value = I.error;
        return;
      }
      const H = I.value.rows ?? [], N = b === 1 ? H : [...n.value, ...H];
      n.value = [...new Map(N.map((E) => [E.id, E])).values()], o.value = I.value.total ?? n.value.length, s.value = I.value.next_page ?? null;
    } catch (I) {
      $ === c && (i.value = I.message);
    } finally {
      $ === c && (l.value = !1);
    }
  }
  async function p(b) {
    var E;
    const { noun: A, id: S } = e(), $ = `${A}:${S}`, I = { id: `sending-${++r}`, text: b };
    n.value = [...n.value, I], o.value++, a.value = !0;
    const H = await t([A, "comment", String(S), b]);
    if ($ !== `${e().noun}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((V) => V.id !== I.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await h();
    const N = (E = H.value) == null ? void 0 : E.id;
    N && !n.value.some((V) => V.id === N) && (n.value = [...n.value, { ...I, id: N }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return ve(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function Jg(e, t) {
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
const Zg = {
  class: "document-tab",
  "data-document-revisions": ""
}, ey = ["datetime"], ty = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, ny = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, ay = {
  key: 2,
  class: "document-none"
}, sy = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(""), l = C(() => s.value ? Jg(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", Zg, [
      e.editing ? (u(), F(pe, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (h) => a("close-revision"))
      }, {
        default: j(() => [...d[1] || (d[1] = [
          te("Close the open revision", -1)
        ])]),
        _: 1
      })) : w("", !0),
      e.revisions.length ? (u(), f(D, { key: 1 }, [
        (u(!0), f(D, null, ne(e.revisions, (h) => (u(), F(pe, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: j(() => [
            te("Revision " + g(h.number) + ": " + g(h.change) + " · " + g(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, g(h.created_at.slice(0, 16).replace("T", " ")), 9, ey)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", ty, g(o.value), 1)) : w("", !0),
        s.value ? (u(), f(D, { key: 1 }, [
          T(pe, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: r
          }, {
            default: j(() => [...d[2] || (d[2] = [
              te("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", ny, [
            (u(!0), f(D, null, ne(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, g(h.text || " "), 3))), 128))
          ])
        ], 64)) : w("", !0)
      ], 64)) : (u(), f("p", ay, "No revisions"))
    ]));
  }
}, oy = /* @__PURE__ */ U(sy, [["__scopeId", "data-v-1390e57a"]]), ly = "button, [data-comment-number]", iy = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Wi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(ly) || n.push(t.currentNode);
  return n;
}
function jo(e, t, n) {
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
const ry = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function uy(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Wi(e), s = a.map((c) => c.data).join(""), o = jo(a, n.startContainer, n.startOffset), l = s.slice(o, jo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: ry(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function cy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function dy(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Ra(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function fy({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function hy(e, t) {
  const n = Wi(e), a = cy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = dy(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(fy).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ra(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ra(t.number, t.id, t.label)) : l.at(-1).append(Ra(t.number, t.id, t.label))), !0;
}
function my(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !hy(e, a) && a.id && n.push(a.id);
  return n;
}
const py = (e) => e.closest(iy) ?? e;
function Fo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const vy = {
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
    const a = e, s = n, o = _(null), l = _(null), i = _(null), r = _(!1), c = _(null);
    function d() {
      if (!l.value || r.value) return;
      l.value.innerHTML = a.html;
      const A = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), S = my(l.value, a.pending ? [...A, { ...a.pending, pending: !0 }] : A);
      s("lost", S);
      const $ = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!$) {
        c.value = null;
        return;
      }
      const I = document.createElement("div");
      I.className = "inline-comment", py($).after(I), c.value = I;
    }
    function h() {
      if (!l.value) return;
      const A = uy(l.value);
      if (r.value = !!A, !A) {
        i.value = null;
        return;
      }
      const S = window.getSelection().getRangeAt(0).getBoundingClientRect(), $ = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(S.left - $.left, 0)}px`, top: `${S.top - $.top + o.value.scrollTop}px` }, s("select", A);
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
    return ve(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), _e(() => {
      d(), document.addEventListener("selectionchange", h);
    }), Ke(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: je }), (A, S) => (u(), f("div", {
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
        style: be(i.value),
        "data-comment-pill": "",
        onMousedown: S[0] || (S[0] = xe(() => {
        }, ["prevent"])),
        onClick: S[1] || (S[1] = ($) => s("write"))
      }, [
        T(ge, {
          name: "chat",
          size: 13
        }),
        S[2] || (S[2] = te("Comment on this", -1))
      ], 36)) : w("", !0),
      c.value ? (u(), F(ca, {
        key: 1,
        to: c.value
      }, [
        me(A.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : w("", !0),
      me(A.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, gy = /* @__PURE__ */ U(vy, [["__scopeId", "data-v-97f0a04d"]]), yy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, by = { class: "document-tabs" }, ky = { class: "document-body" }, wy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, $y = {
  key: 1,
  class: "document-loading"
}, xy = {
  class: "document-details",
  "data-resource-fields": ""
}, Sy = 760, _y = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _(null), a = ev(n), s = C(() => a.value !== null && a.value < Sy), o = _(null), l = _(""), i = _([]), r = _([]), c = _(""), d = _("comments"), h = _("text"), p = _(0), y = _(0), b = _([]), A = _(null), S = _(""), $ = _(!1), I = _(null), H = _(null);
    let N = 0;
    const E = Fi(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (fe) => t.read(fe)), V = C(() => Fo(E.comments.value)), W = C(() => d.value === "questions" ? Fo(r.value) : V.value), q = C(() => d.value === "questions" ? W.value.length : E.total.value), x = C(() => {
      var fe;
      return (fe = o.value) != null && fe.body ? Fs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), M = C(() => {
      var fe;
      return (((fe = o.value) == null ? void 0 : fe.body) ?? "").split(`
`).filter((ee) => /^#{1,4} /.test(ee)).map((ee, le) => ({ key: String(le), value: le, label: ee.replace(/^#+ /, "") }));
    }), k = C(() => V.value.find((fe) => fe.id === y.value)), v = C(() => {
      var fe;
      return (fe = o.value) != null && fe.close_reason ? "Closed" : "Open";
    }), R = C(() => h.value === "comments" && !s.value ? "text" : h.value), O = (fe) => fe.ok ? fe.value.rows ?? [] : [];
    async function L() {
      const fe = ++N, ee = await t.read([t.noun, "inspect", String(t.id)]);
      if (fe !== N) return;
      l.value = ee.ok ? "" : ee.error, o.value = ee.ok ? ee.value : null;
      const le = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), ie = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      fe === N && (r.value = O(le), c.value = le.ok ? "" : le.error, i.value = ie ? O(ie) : []);
    }
    async function P(fe) {
      const ee = A.value ? ["--quote", A.value.quote, "--position", String(A.value.position), "--selection-type", A.value.selection_type] : [], le = await t.read([t.noun, "comment", String(t.id), ...ee, "--", fe]);
      if (!le.ok) throw new Error(le.error);
      A.value = null, await Promise.all([L(), E.load()]);
    }
    async function J() {
      const fe = await t.read(["doc", "close", String(t.id)]);
      l.value = fe.ok ? "" : fe.error, fe.ok && await L();
    }
    function z() {
      S.value.trim() || (A.value = null);
    }
    function se(fe) {
      var ee;
      if (p.value = fe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === fe ? 0 : fe : (ee = n.value.querySelector(d.value === "questions" ? `[data-question-id="${fe}"]` : `[data-comment-id="${fe}"]`)) == null || ee.scrollIntoView({ block: "nearest" });
    }
    async function ae(fe) {
      var ee, le;
      h.value = "text", p.value = fe, await ((ee = I.value) == null ? void 0 : ee.nextTick()), (le = I.value) == null || le.show(fe);
    }
    function ye() {
      $.value = !1, L();
    }
    return ve(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, A.value = null, r.value = [], c.value = "", L();
    }, { immediate: !0 }), ve(d, () => {
      p.value = 0, y.value = 0;
    }), (fe, ee) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", yy, [
        T(pe, {
          bordered: "",
          "data-text-edit": "",
          onClick: ee[0] || (ee[0] = (le) => $.value = !0)
        }, {
          default: j(() => [...ee[14] || (ee[14] = [
            te("Edit", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      m("nav", by, [
        m("button", {
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "text" }]),
          "data-document-tab": "text",
          onClick: ee[1] || (ee[1] = (le) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: ee[2] || (ee[2] = (le) => h.value = "comments")
        }, [
          te(g(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, g(q.value || ""), 1)
        ], 2)) : w("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: ee[3] || (ee[3] = (le) => h.value = "revisions")
        }, [
          ee[15] || (ee[15] = te("Revisions ", -1)),
          m("em", null, g(i.value.length || ""), 1)
        ], 2)) : w("", !0),
        ee[16] || (ee[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        R.value === "text" && M.value.length > 1 ? (u(), F(Ri, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: M.value,
          "data-text-chapters": "",
          onPick: ee[4] || (ee[4] = (le) => {
            var ie;
            return (ie = I.value) == null ? void 0 : ie.showHeading(le.value);
          })
        }, null, 8, ["label", "items"])) : w("", !0)
      ]),
      m("div", ky, [
        l.value ? (u(), f("p", wy, g(l.value), 1)) : o.value ? R.value === "revisions" ? (u(), F(oy, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: J,
          onRestored: L
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : R.value === "comments" ? (u(), F(Po, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": ee[5] || (ee[5] = (le) => d.value = le),
          tab: "",
          comments: V.value,
          questions: r.value,
          hot: p.value,
          lost: b.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!B(E).nextPage.value,
          "comment-loading": B(E).loading.value,
          "comment-failure": B(E).failure.value,
          "comment-total": B(E).total.value,
          onMore: B(E).loadMore,
          onShow: ae,
          onChanged: L
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(D, { key: 4 }, [
          T(gy, {
            ref_key: "words",
            ref: I,
            html: x.value,
            comments: W.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: A.value,
            inline: y.value,
            onSelect: ee[7] || (ee[7] = (le) => A.value = le),
            onClear: z,
            onNumber: se,
            onWrite: ee[8] || (ee[8] = (le) => {
              var ie;
              return (ie = H.value) == null ? void 0 : ie.focus();
            }),
            onLost: ee[9] || (ee[9] = (le) => b.value = le)
          }, {
            inline: j(() => [
              k.value ? (u(), F(Bi, {
                key: 0,
                comment: k.value,
                hot: "",
                onShow: ee[6] || (ee[6] = (le) => ae(k.value.id))
              }, null, 8, ["comment"])) : w("", !0)
            ]),
            default: j(() => [
              m("dl", xy, [
                ee[18] || (ee[18] = m("h4", null, "Details", -1)),
                ee[19] || (ee[19] = m("dt", null, "State", -1)),
                m("dd", null, g(v.value), 1),
                o.value.close_reason ? (u(), f(D, { key: 0 }, [
                  ee[17] || (ee[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, g(o.value.close_reason), 1)
                ], 64)) : w("", !0),
                ee[20] || (ee[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  T(et, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                ee[21] || (ee[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  T(et, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? w("", !0) : (u(), F(Po, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": ee[10] || (ee[10] = (le) => d.value = le),
            comments: V.value,
            questions: r.value,
            hot: p.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!B(E).nextPage.value,
            "comment-loading": B(E).loading.value,
            "comment-failure": B(E).failure.value,
            "comment-total": B(E).total.value,
            onMore: B(E).loadMore,
            onShow: ae,
            onChanged: L
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", $y, [
          T(Ye)
        ]))
      ]),
      o.value ? (u(), F(mv, {
        key: 1,
        ref_key: "composer",
        ref: H,
        draft: S.value,
        "onUpdate:draft": ee[11] || (ee[11] = (le) => S.value = le),
        selection: A.value,
        send: P,
        narrow: s.value,
        onClear: ee[12] || (ee[12] = (le) => A.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : w("", !0),
      $.value ? (u(), F(Xg, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: ee[13] || (ee[13] = (le) => $.value = !1),
        onSaved: ye
      }, null, 8, ["noun", "id", "row", "read"])) : w("", !0)
    ], 512));
  }
}, MS = /* @__PURE__ */ U(_y, [["__scopeId", "data-v-bfc0cf2c"]]), My = {
  key: 1,
  class: "row-list-failure"
}, Cy = ["data-row"], Ey = {
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
    const t = e, n = C(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = _(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), F(Ye, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", My, g(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), F(on, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        te(g(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(D, { key: 3 }, [
      (u(), F(bt(e.arrival ? Ms : "ul"), De(n.value, { class: "row-list" }), {
        default: j(() => [
          (u(!0), f(D, null, ne(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            me(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Cy))), 128))
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
}, Ay = /* @__PURE__ */ U(Ey, [["__scopeId", "data-v-3eb1aa55"]]), Oy = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ty = {
  key: 1,
  class: "agent-rows-note"
}, Iy = {
  key: 2,
  class: "agent-rows-note"
}, Ry = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, By = ["data-agent-row", "onClick"], Ly = { class: "agent-row-name" }, Ny = { class: "agent-row-state" }, qy = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = C(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", Oy, [
      e.loaded ? e.failure ? (u(), f("p", Ty, g(e.failure), 1)) : e.rows.length ? (u(), f(D, { key: 3 }, [
        m("p", Ry, g(a.value) + " running", 1),
        (u(!0), f(D, null, ne(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => B(qe)(`agents:${l.id}`)
        }, [
          m("span", Ly, "#" + g(l.id) + " " + g(l.session), 1),
          m("span", Ny, g(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, By))), 128))
      ], 64)) : (u(), f("p", Iy, g(e.none), 1)) : (u(), F(Ye, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, CS = /* @__PURE__ */ U(qy, [["__scopeId", "data-v-7e3656dc"]]), ct = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, ze = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Dy = 6;
function Gs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Py = (e) => {
  const t = Gs(e, ct.lineChars), n = Math.max(ct.minWidth, Math.max(...t.map((a) => a.length)) * ct.charWidth + ct.padX * 2);
  return { name: e, lines: t, line: ct.line, padY: ct.padY, width: n, height: t.length * ct.line + ct.padY * 2 };
};
function jy(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Fy(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Wy(e, t, n) {
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
  for (let l = 0; l < Dy; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Hy(e, t) {
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
function zy(e) {
  const t = [...new Set(e.flatMap(([N, E]) => [N, E]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = jy(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, E) => !s.has(E)), l = Fy(t, o), i = Wy(t, o, l), r = new Map(t.map((N) => [N, Py(N)])), c = i.map((N) => N.reduce((E, V) => E + r.get(V).width, 0) + He.across * (N.length - 1)), d = Math.max(...c) + He.margin * 2, h = Gy(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = He.margin;
  i.forEach((N, E) => {
    let V = (d - c[E]) / 2;
    const W = Math.max(...N.map((q) => r.get(q).height));
    N.forEach((q) => {
      const x = r.get(q);
      p.set(q, { ...x, x: V, y: y + (W - x.height) / 2 }), V += x.width + He.across;
    }), y += W + (h[E] ?? He.down);
  });
  const b = e.map(([N, E, V], W) => ({ from: N, to: E, label: V || "", back: s.has(W) || l.get(E) <= l.get(N) }));
  Hy(b, p);
  const A = b.map((N) => Vy(N, p.get(N.from), p.get(N.to))), S = [...p.values()], $ = Xy(A, S), I = Math.max(y - He.down, ...$.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(d - He.margin, ...$.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + He.margin, height: I + He.margin, nodes: S, arrows: $ };
}
const Uy = (e) => e ? Gs(e, ze.lineChars).length * ze.line + ze.pad * 2 : 0;
function Gy(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += Uy(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function Vy(e, t, n) {
  const a = e.label ? Gs(e.label, ze.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * ze.charWidth + ze.pad * 2 : 0, o = a.length * ze.line + (a.length ? ze.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const Ky = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Yy = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Qy = [0, -1, 1, -2, 2, -3, 3].map((e) => e * ze.line);
function Xy(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = Ky(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Qy.flatMap((r) => Yy.map((c) => s(c, r))).find((r) => !n.some((c) => Wo(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => Wo(i, r)); ) i.y += ze.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: ze.line, pad: ze.pad } };
  });
}
const Wo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Jy = { class: "flowchart-tools" }, Zy = ["width", "height", "viewBox", "aria-label"], e0 = ["d"], t0 = ["x", "y", "width", "height"], n0 = ["x", "y"], a0 = ["x", "dy"], s0 = {
  key: 0,
  class: "flowchart-label"
}, o0 = ["x", "y", "width", "height"], l0 = ["x", "y"], i0 = ["x", "dy"], r0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => zy(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = _(null), i = _({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var $;
      const A = ($ = l.value) == null ? void 0 : $.getBoundingClientRect();
      if (!(A != null && A.width)) return;
      const S = Math.min(A.width / s.value.width, A.height / s.value.height, 1.5);
      i.value = { zoom: S, x: (A.width - s.value.width * S) / 2, y: (A.height - s.value.height * S) / 2 };
    }
    function d(A, S, $) {
      const { zoom: I, x: H, y: N } = i.value, E = Math.min(o.most, Math.max(o.least, I * A));
      i.value = { zoom: E, x: S - (S - H) * E / I, y: $ - ($ - N) * E / I };
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
      var S, $, I;
      A.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), r = { x: A.clientX - i.value.x, y: A.clientY - i.value.y }, (I = ($ = l.value).setPointerCapture) == null || I.call($, A.pointerId);
    }
    function b(A) {
      r && (i.value = { ...i.value, x: A.clientX - r.x, y: A.clientY - r.y });
    }
    return _e(c), (A, S) => (u(), F(ha, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = ($) => a("close"))
    }, {
      default: j(() => [
        m("div", Jy, [
          T(pe, {
            small: "",
            onClick: S[0] || (S[0] = ($) => h(o.step))
          }, {
            default: j(() => [...S[5] || (S[5] = [
              te("Zoom in", -1)
            ])]),
            _: 1
          }),
          T(pe, {
            small: "",
            onClick: S[1] || (S[1] = ($) => h(1 / o.step))
          }, {
            default: j(() => [...S[6] || (S[6] = [
              te("Zoom out", -1)
            ])]),
            _: 1
          }),
          T(pe, {
            small: "",
            onClick: c
          }, {
            default: j(() => [...S[7] || (S[7] = [
              te("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(p, ["prevent"]),
          onPointerdown: y,
          onPointermove: b,
          onPointerup: S[2] || (S[2] = ($) => uo(r) ? r.value = null : r = null),
          onPointercancel: S[3] || (S[3] = ($) => uo(r) ? r.value = null : r = null)
        }, [
          (u(), f("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: be({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
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
            (u(!0), f(D, null, ne(s.value.arrows, ($, I) => (u(), f("path", {
              key: `arrow-${I}`,
              class: "flowchart-arrow",
              d: $.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, e0))), 128)),
            (u(!0), f(D, null, ne(s.value.nodes, ($) => (u(), f("g", {
              key: $.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: $.x,
                y: $.y,
                width: $.width,
                height: $.height,
                rx: "8"
              }, null, 8, t0),
              m("text", {
                x: $.x + $.width / 2,
                y: $.y + $.padY + $.line / 2
              }, [
                (u(!0), f(D, null, ne($.lines, (I, H) => (u(), f("tspan", {
                  key: H,
                  x: $.x + $.width / 2,
                  dy: H ? $.line : 0
                }, g(I), 9, a0))), 128))
              ], 8, n0)
            ]))), 128)),
            (u(!0), f(D, null, ne(s.value.arrows, ($, I) => (u(), f(D, {
              key: `label-${I}`
            }, [
              $.label ? (u(), f("g", s0, [
                m("rect", {
                  x: $.label.x,
                  y: $.label.y,
                  width: $.label.width,
                  height: $.label.height,
                  rx: "4"
                }, null, 8, o0),
                m("text", {
                  x: $.label.x + $.label.width / 2,
                  y: $.label.y + $.label.pad + $.label.line / 2
                }, [
                  (u(!0), f(D, null, ne($.label.lines, (H, N) => (u(), f("tspan", {
                    key: N,
                    x: $.label.x + $.label.width / 2,
                    dy: N ? $.label.line : 0
                  }, g(H), 9, i0))), 128))
                ], 8, l0)
              ])) : w("", !0)
            ], 64))), 128))
          ], 12, Zy))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, u0 = /* @__PURE__ */ U(r0, [["__scopeId", "data-v-6f337720"]]), Ho = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', zo = {
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
  agent: Ho,
  worker: Ho,
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
}, c0 = ["innerHTML"], d0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => zo[t.name] || zo.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, c0));
  }
}, yt = /* @__PURE__ */ U(d0, [["__scopeId", "data-v-939f191f"]]), f0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      T(yt, { name: "fold" })
    ], 2));
  }
}, pt = /* @__PURE__ */ U(f0, [["__scopeId", "data-v-a570162c"]]), h0 = ["data-tip", "aria-label"], m0 = {
  key: 0,
  class: "mact-word"
}, p0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      T(yt, { name: "open" }),
      e.open ? (u(), f("span", m0, g(e.label), 1)) : w("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, h0));
  }
}, Hi = /* @__PURE__ */ U(p0, [["__scopeId", "data-v-2824bb7d"]]), zi = 120, Wn = 280, Ui = 160, v0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, g0 = ["leaving", "resizing", "entering"];
function ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function y0(e) {
  const t = g0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ms(e);
  return e.classList.add(...t), n;
}
function Gi(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = _(t()), s = _("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, p) {
    i(h);
    const y = y0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Wn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Wn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, r(h, ms(h)));
    });
    return b.observe(p), b;
  }
  async function d(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || v0()) {
      a.value = h;
      return;
    }
    const b = ms(p);
    if (l(p, b), s.value = "leaving", await n(zi), y !== o) return;
    a.value = h, s.value = "resizing", await je(), r(p, b);
    const A = c(p);
    await n(Wn), A == null || A.disconnect(), y === o && (i(p), s.value = "entering", await n(Ui), y === o && (s.value = ""));
  }
  return ve(t, (h) => d(h)), Ke(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const b0 = { class: "growing-card-top" }, k0 = ["aria-expanded"], w0 = { class: "growing-card-avatar" }, $0 = { class: "growing-card-title" }, x0 = { class: "growing-card-more" }, S0 = { class: "growing-card-body" }, _0 = {
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
    const n = e, a = t, s = _(!1), o = _(null), { folded: l, phase: i } = Gi(o, () => !s.value), r = C(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = C(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", B(i), { open: !B(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", b0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", w0, [
            e.bad ? (u(), F(yt, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(D, { key: 1 }, [
              te(g(r.value), 1)
            ], 64)) : (u(), F(ge, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", $0, g(e.title), 1),
          T(pt, { open: s.value }, null, 8, ["open"])
        ], 8, k0),
        e.action ? (u(), F(Hi, {
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
          T(ge, {
            name: "bubble",
            size: 13
          })
        ])) : w("", !0)
      ]),
      m("div", x0, [
        m("div", S0, [
          (u(!0), f(D, null, ne(c.value, (p, y) => (u(), f("p", {
            key: y,
            class: "growing-card-text"
          }, g(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, M0 = /* @__PURE__ */ U(_0, [["__scopeId", "data-v-9cee1e01"]]), C0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, E0 = { class: "md inline" }, A0 = ["disabled", "title", "onClick"], O0 = {
  key: 1,
  class: "message-links-many"
}, T0 = ["aria-expanded"], I0 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, R0 = ["disabled", "onClick"], B0 = { class: "row-pill message-links-chip" }, L0 = { class: "message-links-title" }, N0 = { key: 0 }, Ba = 3, q0 = "task", D0 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(() => n.total || n.links.length), o = C(() => n.links.every((p) => p.endpoint.model === q0) ? "tasks" : "items"), l = _(!1), i = _(null);
    Ul(i, () => l.value = !1);
    const r = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, d = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, qe(p.endpoint.open_ref));
    }
    return (p, y) => (u(), f("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ba, three: s.value === Ba, open: l.value }]),
      "data-message-links": ""
    }, [
      T(yt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), f("span", C0, [
        m("span", E0, [
          y[1] || (y[1] = te("Linked: ", -1)),
          (u(!0), f(D, null, ne(e.links, (b) => (u(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (A) => h(b)
          }, [
            te(g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
            d(b) ? (u(), f(D, { key: 0 }, [
              te(" (" + g(d(b)) + ")", 1)
            ], 64)) : w("", !0),
            c(b) ? (u(), f(D, { key: 1 }, [
              te(" (unavailable)")
            ], 64)) : w("", !0)
          ], 8, A0))), 128))
        ])
      ])) : w("", !0),
      s.value >= Ba ? (u(), f("span", O0, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          te(g(s.value) + " linked " + g(o.value) + " ", 1),
          T(pt, { open: l.value }, null, 8, ["open"])
        ], 8, T0)
      ])) : w("", !0),
      l.value ? (u(), f("div", I0, [
        (u(!0), f(D, null, ne(e.links, (b) => (u(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (A) => h(b)
        }, [
          m("span", B0, g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
          m("span", L0, g(b.endpoint.title), 1),
          m("span", null, g(d(b)), 1),
          c(b) ? (u(), f("span", N0, "Unavailable")) : w("", !0)
        ], 8, R0))), 128))
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
}, P0 = /* @__PURE__ */ U(D0, [["__scopeId", "data-v-417b955f"]]), j0 = ["title", "aria-label"], F0 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, W0 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, H0 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = C(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), f("span", {
      class: Y(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), f("svg", F0, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", W0)) : w("", !0)
      ]))
    ], 10, j0));
  }
}, z0 = /* @__PURE__ */ U(H0, [["__scopeId", "data-v-6c0a4358"]]), U0 = {
  person: { chars: 480, lines: 8, shown: 6 },
  agent: { chars: 600, lines: 10, shown: 8 },
  report: { chars: 140, lines: 2, shown: 2 }
};
function G0(e) {
  return e.worker_id != null ? "report" : ["user", "comment"].includes(e.type) ? "person" : "agent";
}
const V0 = (e) => e.split(`
`).filter((t) => t.trim()).length;
function K0(e) {
  const t = U0[G0(e)], n = e.text ?? "";
  return { ...t, long: n.length > t.chars || V0(n) > t.lines };
}
const Y0 = "img,pre,table";
function Q0(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function X0(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function J0(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Y0)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Q0(X0(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Z0(e, t) {
  let n = null;
  const a = () => e.value && J0(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), ve(t, a, { flush: "post" });
}
const eb = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function tb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Bn = /* @__PURE__ */ new WeakMap(), Be = "work", Xe = "sent", nb = 50, Uo = 50, Go = () => ({ rows: _([]), total: _(0), next: _(null), loading: _(!1), failure: _(""), version: 0 });
function ab(e) {
  var A;
  if (Bn.has(e)) return Bn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (S) => {
    var $;
    return (($ = e.visible) == null ? void 0 : $.value) !== !1 && [...S.views].some((I) => I.visible);
  };
  function o(S, $) {
    const I = S[$], H = ++I.version;
    return I.loading.value = !0, I.failure.value = "", H;
  }
  function l(S, $, I, H, N) {
    const E = S[$];
    if (t.get(S.id) !== S || E.version !== I) return;
    if (E.loading.value = !1, !N.ok) {
      E.failure.value = N.error;
      return;
    }
    const V = $ === Be ? N.value.counterparts ?? [] : N.value.rows ?? [], W = H === 1 ? V : [...E.rows.value, ...V], q = $ === Be ? (x) => `${x.endpoint.model}:${x.endpoint.id}` : (x) => x.id ?? x.target_id;
    E.rows.value = [...new Map(W.map((x) => [q(x), x])).values()], E.total.value = N.value.total ?? E.rows.value.length, E.next.value = N.value.next_page ?? null;
  }
  function i(S, $, I, H) {
    const N = S[$];
    N.version === I && (N.failure.value = H.message, N.loading.value = !1);
  }
  async function r(S, $, I) {
    const H = o(S, $), N = $ === Be ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(S, $, H, I, await e.read(`link list --source message:${S.id} ${N} --page ${I} --page-size ${$ === Be ? 10 : 25}`));
    } catch (E) {
      i(S, $, H, E);
    }
  }
  async function c(S) {
    const $ = S.map((I) => ({ [Be]: o(I, Be), [Xe]: o(I, Xe) }));
    try {
      const I = await e.read(`link receipts --messages ${S.map((H) => H.id).join(",")}`);
      S.forEach((H, N) => {
        const E = I.ok ? I.value.messages[String(H.id)] : null;
        l(H, Be, $[N][Be], 1, I.ok ? { ok: !0, value: E.named } : I), l(H, Xe, $[N][Xe], 1, I.ok ? { ok: !0, value: E.sent } : I);
      });
    } catch (I) {
      S.forEach((H, N) => [Be, Xe].forEach((E) => i(H, E, $[N][E], I)));
    }
  }
  function d() {
    a = null;
    const S = [...n].map(($) => t.get($)).filter(($) => $ && s($));
    n.clear(), S.forEach(($) => $.dirty.clear());
    for (let $ = 0; $ < S.length; $ += Uo) c(S.slice($, $ + Uo));
  }
  function h(S, $ = [Be, Xe]) {
    for (const I of $) S.dirty.add(I);
    s(S) && (n.add(S.id), a ?? (a = setTimeout(d, 0)));
  }
  function p(S) {
    const $ = S.sources ?? (S.source_model && Number.isInteger(S.source_id) ? [{ model: S.source_model, id: S.source_id }] : []), I = S.link_types ?? (S.link_type ? [S.link_type] : []), H = I.length ? [Be, Xe].filter((E) => E === Be ? I.some((V) => ["about", "edited"].includes(V)) : I.includes("sent_to")) : [Be, Xe];
    if (!H.length) return;
    const N = $.length ? [...new Set($.filter((E) => E.model === "message").map((E) => E.id))].map((E) => t.get(E)).filter(Boolean) : [...t.values()].filter(s).slice(0, nb);
    for (const E of N) h(E, H);
  }
  const y = (A = e.follow) == null ? void 0 : A.call(e, ["link.*"], p), b = {
    attach(S, $) {
      let I = t.get(S);
      return I || (I = { id: S, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Be, Xe]), work: Go(), sent: Go() }, t.set(S, I)), I.views.add($), I.dirty.size && h(I, [...I.dirty]), I;
    },
    shown(S) {
      S.dirty.size && h(S, [...S.dirty]);
    },
    detach(S, $) {
      S.views.delete($), S.views.size || t.delete(S.id), t.size || (clearTimeout(a), y == null || y(), Bn.delete(e));
    },
    more(S, $) {
      const I = S == null ? void 0 : S[$];
      if (I != null && I.next.value && !I.loading.value) return r(S, $, I.next.value);
    }
  };
  return Bn.set(e, b), b;
}
function sb(e, t, n) {
  const a = Je(null);
  let s = null;
  const o = ve(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = ab(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), p = ve(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    r(() => {
      p(), h == null || h.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return da(o), {
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
    loadSent: () => s == null ? void 0 : s.more(a.value, Xe)
  };
}
const ob = ["data-incoming", "data-ref"], lb = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], ib = { class: "message-body" }, rb = ["title"], ub = ["innerHTML"], cb = ["title"], db = ["innerHTML"], fb = {
  class: "message-faces",
  "data-message-faces": ""
}, hb = ["title", "data-face", "onClick"], mb = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, pb = ["title", "data-reaction", "onClick"], vb = {
  key: 0,
  class: "message-reaction-count"
}, gb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, yb = ["href", "title"], bb = ["src", "alt"], kb = ["href"], wb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, $b = ["disabled", "data-sent-worker", "title", "onClick"], xb = { class: "message-foot" }, Sb = { class: "message-time" }, _b = {
  class: "message-id",
  "data-message-id": ""
}, Mb = 1500, Cb = "An earlier message", Eb = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _(null), l = C(() => ["user", "comment"].includes(n.message.type)), i = C(() => {
      const [ee, le] = (n.message.commented_row || ":").split(":"), ie = mt(ee);
      return ie ? { ref: `${ie}:${le}`, label: `${Vt(ie).title.toLowerCase()} ${le}` } : null;
    }), r = C(() => n.message.worker_id ?? null), c = C(() => K0(n.message)), d = _(!1), h = C(() => l.value && !n.message.read_at && !n.message.local);
    async function p() {
      var ee;
      await ((ee = navigator.clipboard) == null ? void 0 : ee.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Mb);
    }
    const y = yi(), b = C(() => y(n.message.text ?? "")), A = C(() => JSON.parse(n.message.flowchart_edges || "[]")), S = _(!1), $ = C(() => y(n.quote || Cb));
    function I() {
      const ee = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ee ? ee.scrollIntoView({ block: "center", behavior: "smooth" }) : qe(`messages:${n.message.parent_id}`);
    }
    Z0(o, () => `${n.message.text} ${n.quote}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, N = (ee) => `/api/files/message/${n.message.id}/${encodeURIComponent(ee)}`, E = C(() => JSON.parse(n.message.captions || "{}")), V = C(() => (n.message.files ?? []).map((ee) => ({ name: ee, address: N(ee), isImage: H.test(ee), title: E.value[ee] || ee }))), W = C(() => Ci(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), q = Ee(Pe, null), { links: x, total: M, more: k, loading: v, failure: R, sentTo: O, sentMore: L, sentLoading: P, sentFailure: J, loadMore: z, loadSent: se } = sb(q, () => l.value && !n.message.local ? n.message.id : null, o), ae = _(!1), ye = C(() => tb(n.message.reactions));
    function fe(ee) {
      ae.value = !1, a("react", n.message, ee);
    }
    return (ee, le) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      T(M0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: le[0] || (le[0] = (ie) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, ob)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", ib, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: le[6] || (le[6] = (...ie) => B(Nt) && B(Nt)(...ie))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: le[1] || (le[1] = xe((ie) => B(qe)(i.value.ref), ["stop"]))
          }, [
            T(ge, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + g(i.value.label), 1)
          ], 8, rb)) : w("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(I, ["stop"]),
            innerHTML: $.value
          }, null, 8, ub)) : w("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: le[2] || (le[2] = xe((ie) => B(qe)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + g(r.value), 9, cb)) : w("", !0),
          m("div", {
            class: Y({ "message-folded": c.value.long && !d.value }),
            style: be({ "--fold-lines": c.value.shown }),
            "data-message-text": "",
            innerHTML: b.value
          }, null, 14, db),
          c.value.long ? (u(), f("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: le[3] || (le[3] = xe((ie) => d.value = !d.value, ["stop"]))
          }, g(d.value ? "Show less" : "Show more"), 1)) : w("", !0),
          A.value.length ? (u(), f(D, { key: 4 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: le[4] || (le[4] = (ie) => S.value = !0)
            }, "Open the flowchart"),
            S.value ? (u(), F(u0, {
              key: 0,
              title: e.message.text,
              edges: A.value,
              onClose: le[5] || (le[5] = (ie) => S.value = !1)
            }, null, 8, ["title", "edges"])) : w("", !0)
          ], 64)) : w("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: ae.value }]),
          "data-message-tools": ""
        }, [
          ae.value ? (u(), f(D, { key: 0 }, [
            m("div", fb, [
              (u(!0), f(D, null, ne(B(eb), (ie) => (u(), f("button", {
                key: ie,
                type: "button",
                class: "message-face",
                title: `React ${ie}`,
                "data-face": ie,
                onClick: (tt) => fe(ie)
              }, g(ie), 9, hb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: le[7] || (le[7] = (ie) => ae.value = !1)
            }, [
              T(ge, {
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
              onClick: le[8] || (le[8] = (ie) => ae.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: le[9] || (le[9] = (ie) => a("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: p
            }, g(s.value ? "Copied" : "Copy"), 1),
            h.value ? (u(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: le[10] || (le[10] = (ie) => a("delete", e.message))
            }, "Delete")) : w("", !0)
          ], 64))
        ], 2)
      ]),
      ye.value.length ? (u(), f("div", mb, [
        (u(!0), f(D, null, ne(ye.value, (ie) => (u(), f("button", {
          key: ie.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: ie.mine }]),
          title: ie.title,
          "data-reaction": ie.emoji,
          onClick: (tt) => a("react", e.message, ie.emoji)
        }, [
          te(g(ie.emoji) + " ", 1),
          ie.count > 1 ? (u(), f("span", vb, g(ie.count), 1)) : w("", !0)
        ], 10, pb))), 128))
      ])) : w("", !0),
      V.value.length ? (u(), f("div", gb, [
        (u(!0), f(D, null, ne(V.value, (ie) => (u(), f(D, {
          key: ie.name
        }, [
          ie.isImage ? (u(), f("a", {
            key: 0,
            href: ie.address,
            target: "_blank",
            class: "message-image",
            title: ie.title
          }, [
            m("img", {
              src: ie.address,
              alt: ie.name,
              "data-figure-picture": ""
            }, null, 8, bb)
          ], 8, yb)) : (u(), f("a", {
            key: 1,
            href: ie.address,
            target: "_blank",
            class: "message-file"
          }, g(ie.name), 9, kb))
        ], 64))), 128))
      ])) : w("", !0),
      B(O).length ? (u(), f("div", wb, [
        T(ge, {
          name: "send",
          size: 12
        }),
        (u(!0), f(D, null, ne(B(O), (ie) => (u(), f("button", {
          key: ie.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ie.unavailable || !ie.open_ref,
          "data-sent-worker": ie.id,
          title: `Open worker ${ie.id}`,
          onClick: xe((tt) => ie.open_ref && B(qe)(ie.open_ref), ["stop"])
        }, [
          te("Also sent to worker " + g(ie.id), 1),
          ie.unavailable ? (u(), f(D, { key: 0 }, [
            te(" (unavailable)")
          ], 64)) : w("", !0)
        ], 8, $b))), 128))
      ])) : w("", !0),
      T(vn, {
        more: B(L),
        loading: B(P),
        failure: B(J),
        label: "More recipients",
        onMore: B(se)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", xb, [
        m("time", Sb, g(W.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(D, { key: 0 }, [
          le[11] || (le[11] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", _b, "message " + g(e.message.id), 1)
        ], 64)) : w("", !0),
        l.value ? (u(), F(z0, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : w("", !0)
      ]),
      B(x).length || B(R) ? (u(), F(P0, {
        key: 3,
        links: B(x),
        total: B(M),
        more: B(k),
        loading: B(v),
        failure: B(R),
        onMore: B(z)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : w("", !0)
    ], 8, lb));
  }
}, ES = /* @__PURE__ */ U(Eb, [["__scopeId", "data-v-60a7b920"]]), ta = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], La = 200, Vi = (e) => {
  var t;
  return ((t = ta.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ta[0].key;
}, AS = (e) => {
  var t;
  return ((t = ta.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Ab = ["aria-label"], Ob = 300, Vo = 400, Tb = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: La } },
  setup(e) {
    const t = e, n = C(() => Vi(t.value)), a = C(() => n.value < La ? [1, 0.25, 0.25] : n.value === La ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: Y(["ico", "prio", { hot: n.value >= Vo, high: n.value >= Ob && n.value < Vo }]),
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
        style: be({ opacity: a.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: be({ opacity: a.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: be({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Ab));
  }
}, OS = /* @__PURE__ */ U(Tb, [["__scopeId", "data-v-549d72cf"]]), Ib = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Ko = (e) => Ib[e.card.state] || "idle", Rb = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Yo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Qo = (e, t) => Yo[Ko(e)] - Yo[Ko(t)], Xo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, TS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Qo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Rb(a, s)) : [...e].sort((a, s) => Qo(a, s) || (Xo[t] || Xo.state)(a, s)), Bb = { class: "list-row" }, Lb = {
  key: 0,
  class: "list-row-type"
}, Nb = { class: "list-row-main" }, qb = {
  key: 0,
  class: "list-row-title"
}, Db = { class: "list-row-body" }, Pb = {
  key: 1,
  class: "list-row-end"
}, jb = {
  key: 1,
  class: "list-row-text"
}, Fb = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Bb, [
      e.type ? (u(), f("span", Lb, g(e.type), 1)) : w("", !0),
      m("div", Nb, [
        e.title ? (u(), f("span", qb, g(e.title), 1)) : w("", !0),
        m("div", Db, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", Pb, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      e.text ? (u(), f("span", jb, g(e.text), 1)) : w("", !0)
    ]));
  }
}, IS = /* @__PURE__ */ U(Fb, [["__scopeId", "data-v-30fac05a"]]), RS = {
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
    return (l, i) => (u(), F(Ri, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Wb = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Ki = /* @__PURE__ */ U(Wb, [["__scopeId", "data-v-36d0137f"]]), Hb = ["aria-label"], zb = { class: "head" }, Ub = { class: "names" }, Gb = { class: "body" }, Vb = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ni(a, n), i = ai(s);
    return (r, c) => (u(), F(ca, { to: "body" }, [
      T(Ut, {
        name: "side",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: j(() => [
          B(s) ? (u(), f("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: be({ "--depth": e.depth, zIndex: B(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => B(o) && B(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), f(D, { key: 0 }, [
                m("header", zb, [
                  m("div", Ub, [
                    m("h2", null, g(e.title), 1),
                    e.abstract ? (u(), F(st, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : w("", !0)
                  ]),
                  me(r.$slots, "actions", {}, void 0, !0),
                  T(fa, {
                    title: e.closeLabel,
                    onClick: B(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), F(Ki, { key: 0 }, {
                  default: j(() => [
                    me(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : w("", !0),
                m("div", Gb, [
                  me(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : me(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, Hb)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, BS = /* @__PURE__ */ U(Vb, [["__scopeId", "data-v-2199b5ec"]]), Kb = {
  key: 1,
  class: "text-field-label"
}, Yb = {
  key: 2,
  class: "text-field-end"
}, Qb = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Pt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = sn(e, "modelValue"), a = ua(), s = "onUpdate:modelValue" in (((d = Jr()) == null ? void 0 : d.vnode.props) || {}), o = C(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = C(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = C(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = _(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, B(a).class]),
      style: be(B(a).style)
    }, [
      e.icon ? (u(), F(ge, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : w("", !0),
      e.label ? (u(), f("span", Kb, g(e.label), 1)) : w("", !0),
      Ze(m("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [B(is), o.value]
      ]),
      h.$slots.end ? (u(), f("span", Yb, [
        me(h.$slots, "end", {}, void 0, !0)
      ])) : w("", !0)
    ], 6)) : Ze((u(), f("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, r.value, { onInput: l }), null, 16)), [
      [B(is), o.value]
    ]);
  }
}), LS = /* @__PURE__ */ U(Qb, [["__scopeId", "data-v-631ba0ce"]]), Xb = { class: "title" }, Jb = { class: "state" }, Zb = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ns(t.line, t.events);
    return (o, l) => (u(), F(Ay, {
      rows: B(n),
      failure: B(a),
      loaded: B(s),
      empty: e.empty
    }, {
      default: j(({ row: i }) => [
        m("span", Xb, g(i.title), 1),
        m("span", Jb, g(B(ln)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, NS = /* @__PURE__ */ U(Zb, [["__scopeId", "data-v-46749af8"]]);
function ek(e = 1e3, t = null) {
  const n = _(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ve(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const Na = _(Date.now() / 1e3);
let Jo = 0, Ln = 0;
function Vs() {
  return Ln || (Na.value = Date.now() / 1e3, Jo = setInterval(() => Na.value = Date.now() / 1e3, 1e3)), Ln += 1, Tl() && da(() => {
    Ln -= 1, Ln || clearInterval(Jo);
  }), Na;
}
const tk = 200, nk = zi + Wn + Ui + tk;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function ak(e, t, n) {
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
function sk(e, t, n, a) {
  ve(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(ak(o, l, n.value)), performance.now() - l < nk) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const ok = ["title", "data-figure-mark", "data-folded", "data-open"], lk = {
  key: 2,
  class: "worker"
}, ik = { class: "head" }, rk = { key: 0 }, uk = {
  key: 3,
  class: "status"
}, ck = {
  key: 0,
  class: "figure"
}, dk = {
  key: 1,
  class: "ran-for"
}, fk = { key: 2 }, hk = {
  key: 3,
  class: "news"
}, mk = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, pk = {
  key: 6,
  class: "settled"
}, vk = {
  key: 1,
  class: "bar"
}, gk = {
  key: 3,
  class: "detail body"
}, yk = {
  key: 0,
  class: "body-label"
}, bk = ["title"], kk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ua(), a = ["onClick", "onAct"], s = C(() => Object.fromEntries(Object.entries(n).filter(([se]) => !a.includes(se)))), o = _(!1), l = C(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = C(() => t.open !== void 0), r = C(() => i.value || l.value), c = C(() => i.value ? t.open : o.value), d = C(() => i.value ? !t.open : l.value && !o.value), h = C(() => !!(t.mark.action && n.onAct)), p = C(() => r.value || h.value || !!n.onClick), y = _(null), b = _(null), { folded: A, phase: S } = Gi(y, () => d.value);
    sk(y, d, S, Ee(Pe, null));
    function $(se) {
      var ae, ye;
      if (!(se.target !== y.value && !b.value.contains(se.target))) {
        if (i.value) return (ae = n.onClick) == null ? void 0 : ae.call(n, se);
        if (l.value) return void (o.value = !o.value);
        (ye = n.onAct || n.onClick) == null || ye(se);
      }
    }
    const I = (se) => n.onAct(se), H = ["failed", "unfinished"], N = C(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), E = C(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), V = C(() => E.value || "var(--tone-work)"), W = C(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), q = Vs(), x = C(
      () => t.mark.began_at && W.value && !t.mark.figure && !t.mark.counting ? Ei(q.value - t.mark.began_at) : ""
    ), M = C(() => {
      const { started: se, ended: ae } = t.mark;
      return se ? ae ? `ran ${qo(ae - se, !0)}` : qo(q.value - se, !0) : x.value;
    }), k = ["bad", "danger", "warn"], v = C(() => k.includes(N.value) || t.mark.asks ? "attention" : W.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), R = ["bad", "danger"], O = C(() => R.includes(N.value)), L = C(() => v.value === "process" ? "running" : O.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), P = C(
      () => !!(t.mark.figure || M.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), J = C(() => [t.mark.title, t.mark.time ? Ci(t.mark.time) : ""].filter(Boolean).join(" · ")), z = C(() => ({
      ...E.value ? { "--mark": E.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (se, ae) => (u(), f("div", De(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${v.value}`,
        B(S),
        {
          open: c.value,
          folding: i.value && d.value,
          live: p.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: E.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: z.value,
      title: J.value,
      "data-figure-mark": e.mark.key,
      "data-folded": B(A) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: $
    }), [
      (u(), F(bt(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": r.value ? String(!!c.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (u(), F(yt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), F(ge, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", lk, g(e.mark.worker), 1)) : w("", !0),
          m("span", ik, [
            T(st, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", rk, g(e.mark.name), 1)) : w("", !0),
            r.value ? (u(), F(pt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : w("", !0)
          ]),
          P.value ? (u(), f("span", uk, [
            e.mark.figure ? (u(), f("span", ck, g(e.mark.figure), 1)) : w("", !0),
            M.value ? (u(), f("span", dk, g(M.value), 1)) : w("", !0),
            e.mark.stopping ? (u(), f("span", fk, "Stopping")) : w("", !0),
            e.mark.news ? (u(), f("span", hk, g(e.mark.news), 1)) : w("", !0),
            L.value === "running" ? (u(), f("span", mk)) : L.value ? (u(), F(yt, {
              key: 5,
              class: Y(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : w("", !0),
            e.mark.settled ? (u(), f("span", pk, g(e.mark.settled), 1)) : w("", !0)
          ])) : w("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), F(Hi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(I, ["stop"])
      }, null, 8, ["label", "open"])) : w("", !0),
      (e.mark.figure || e.mark.counting) && W.value ? (u(), f("span", vk, [
        m("span", {
          class: "progress",
          style: be({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: V.value })
        }, null, 4)
      ])) : w("", !0),
      e.mark.detail && !B(A) ? (u(), F(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      e.mark.body && !B(A) ? (u(), f("div", gk, [
        e.mark.bodyLabel ? (u(), f("p", yk, g(e.mark.bodyLabel), 1)) : w("", !0),
        T(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : w("", !0),
      e.mark.command && !B(A) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, g(e.mark.command), 9, bk)) : w("", !0),
      e.mark.card ? (u(), F(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      me(se.$slots, "default", {
        shown: !B(A)
      }, void 0, !0)
    ], 16, ok));
  }
}), Yi = /* @__PURE__ */ U(kk, [["__scopeId", "data-v-dc93aa50"]]), wk = 8, $k = 40, xk = [];
class Ks {
  constructor(t, n, { top: a = wk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && xk.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Ks(t, {
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
    n > $k && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Sk = 60, _k = 300, Qi = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Xi(e, t) {
  const n = _([]), a = _(0);
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
  const c = new Ks("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => _k, more: () => a.value > 0, previous: r }, { top: Sk });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Mk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Ji(e) {
  var n;
  const t = Mk[e] || ((n = Vt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ck = (e) => Ji(String(e).split(":")[0]), Ek = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ak = { passed: "good", failed: "danger", warned: "warn", running: "" }, Ok = { good: "good", warn: "warn", danger: "danger" }, Zo = {
  "open row": (e) => qe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Lf(e.target_model, e.target_id || 0)
}, Tk = { "open row": (e) => Ck(e.target_model), "open page": () => Ji("pages") };
function Ik(e, t) {
  const n = t || {}, a = Zo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Ak[e.outcome] || "" : Ok[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Tk[a](e) : "",
    handlers: a ? { onAct: () => Zo[a](e) } : {}
  };
}
const Rk = 24, Bk = 1e3, el = 2e3, Lk = 0.25, Nk = 5e3;
function qk(e, t = Rk, n = () => !0) {
  const a = _(!1), s = _(0), o = _(!1);
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
    const E = Date.now() - r < el ? el : Bk;
    l = setTimeout(() => o.value = a.value, E);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(N = !1) {
    const E = c();
    E && N && E.scrollTo ? E.scrollTo({ top: E.scrollHeight, behavior: "smooth" }) : E && (E.scrollTop = E.scrollHeight), y();
  }
  function A() {
    $(), !a.value && (a.value = !0, p(!0));
  }
  const S = () => !!c() && d() <= c().clientHeight * Lk;
  function $() {
    clearTimeout(i), S() && (i = setTimeout(() => a.value && S() && n() && b(!0), Nk));
  }
  function I() {
    h() ? y() : A();
  }
  function H(N = 1, E = !1) {
    a.value ? s.value += Math.max(0, N) : b(E);
  }
  return Tl() && da(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: y, toBottom: b, left: A, scrolled: I, arrived: H };
}
const Dk = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Pk = (e) => String(e ?? "").replace(Dk, ""), jk = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), { away: o, scrolled: l, arrived: i, toBottom: r } = qk(s);
    ve(
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
      te(g(B(Pk)(e.lines.join(`
`)) || e.empty), 1),
      B(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => B(r)(!0))
      }, "Follow")) : w("", !0)
    ], 544));
  }
}, Fk = /* @__PURE__ */ U(jk, [["__scopeId", "data-v-cd5e59e0"]]), Wk = "*.*", Hk = {
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
    const t = e, n = Ee(Pe, null), a = new Wl();
    ve(
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
      events: l.value ? [Wk] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), F(ji, {
      key: 0,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), F(Pi, {
      key: 1,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, zk = { class: "mark-more-inner" }, Uk = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Gk = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Vk = {
  key: 3,
  class: "mark-lines"
}, Kk = "process", tl = "task", Yk = {
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
    const t = e, n = Ue(), a = C(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = C(() => Ek.has(t.mark.variant) && t.mark.detail || ""), o = C(() => t.mark.target_model === tl ? t.mark.target_id : 0), l = Xi(
      Qi(n),
      () => t.mark.target_id
    ), i = l.lines, r = _(!1), c = _(""), d = C(() => !t.declaration.body_url && t.mark.target_model === Kk && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      r.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = C(() => t.shown && d.value);
    return ve(p, (y) => y && h()), Es(() => p.value && h(), () => p.value && !t.mark.ended_at), ve(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, b) => (u(), f("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = xe(() => {
      }, ["stop"]))
    }, [
      m("div", zk, [
        e.declaration.body_url ? (u(), F(Hk, {
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
            m("p", Uk, g(s.value), 1)
          ], 64)) : w("", !0),
          d.value && c.value ? (u(), f("p", Gk, g(c.value), 1)) : d.value && r.value ? (u(), f(D, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            T(Fk, {
              class: "mark-terminal",
              lines: B(i),
              feed: B(l).feed,
              onOlder: B(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", Vk, g(a.value.join(`
`)), 1)) : w("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = xe((A) => B(qe)(`${tl}:${o.value}`), ["stop"]))
          }, " Open task " + g(o.value) + " and its proofs ", 1)) : w("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ps = /* @__PURE__ */ U(Yk, [["__scopeId", "data-v-04806ba3"]]), Qk = ["title", "aria-label", "onClick"], Xk = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Jk = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = C(() => lf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = _(""), s = Ee(Pe);
    async function o(l) {
      const i = await gn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (u(), f(D, null, [
      (u(!0), f(D, null, ne(n.value, (r) => (u(), f("button", {
        key: r.runs,
        type: "button",
        class: "mark-button",
        title: r.label,
        "aria-label": r.label,
        onClick: xe((c) => o(r), ["stop"])
      }, [
        T(yt, {
          name: r.icon
        }, null, 8, ["name"])
      ], 8, Qk))), 128)),
      a.value ? (u(), f("span", Xk, g(a.value), 1)) : w("", !0)
    ], 64));
  }
}, Zk = /* @__PURE__ */ U(Jk, [["__scopeId", "data-v-c8022f67"]]);
function Zi(e, t) {
  const n = Je(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ce.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const er = Zi("/api/marks", "marks"), qS = er.fetchAll, ew = er.find, tw = ["data-ref"], nw = ["data-ref"], aw = { class: "mark-row" }, sw = "dock add", ow = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = C(() => ew(a.mark.type)), o = C(() => Ik(a.mark, s.value)), l = C(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), i = _(!1);
    function r(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      i.value = !i.value;
    }
    const c = C(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((h) => {
        var p;
        return !a.docked || !((p = h.runs) != null && p.startsWith(sw));
      }).map((h) => ({ ...h, module: s.value.module }));
    });
    return (d, h) => {
      var p, y;
      return (p = s.value) != null && p.card ? (u(), f("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        T(ps, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, tw)) : (u(), f("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (y = s.value) == null ? void 0 : y.full_width, docked: e.docked, "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", aw, [
          T(Yi, De({
            mark: o.value,
            open: l.value ? i.value : void 0
          }, Zr(o.value.handlers), { onClick: r }), eu({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: b }) => [
                T(ps, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: b
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          T(Zk, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, nw));
    };
  }
}, lw = /* @__PURE__ */ U(ow, [["__scopeId", "data-v-5f90ecd5"]]), iw = ["data-ref"], rw = ["inert"], uw = { class: "group-fold" }, cw = { class: "thread-group" }, dw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(!1), a = _(!1), s = _(!1), o = _(null);
    ve(n, async (i) => {
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
      T(Yi, {
        mark: l.value,
        open: n.value,
        onClick: r[0] || (r[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (u(), f("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Y(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        m("div", uw, [
          m("div", cw, [
            (u(!0), f(D, null, ne(e.group.marks, (c) => (u(), F(lw, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, rw)) : w("", !0)
    ], 8, iw));
  }
}, DS = /* @__PURE__ */ U(dw, [["__scopeId", "data-v-163808b2"]]);
function fw(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), Ke(() => n.disconnect()), t;
}
const hw = { class: "chat-dock-fold" }, mw = ["aria-label"], pw = { class: "chat-dock-head" }, vw = { class: "chat-dock-inner" }, gw = { class: "chat-dock-foot" }, tr = 700, yw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = _(null), a = _(null), s = fw(a), o = _(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, tr)), Ke(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", hw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          me(i.$slots, "edge", {}, void 0, !0),
          m("header", pw, [
            me(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", vw, [
              m("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: be(B(s) === null ? null : { height: `${B(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  me(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          me(i.$slots, "still", {}, void 0, !0),
          m("footer", gw, [
            me(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, mw)
      ])
    ], 2));
  }
}, nr = /* @__PURE__ */ U(yw, [["__scopeId", "data-v-c83b7e81"]]), bw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, qa = 5, kw = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(qa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${qa}s`, animationDelay: `${(n - qa).toFixed(2)}s` };
    return (s, o) => (u(), f("span", bw, [
      m("i", { style: a })
    ]));
  }
}, ar = /* @__PURE__ */ U(kw, [["__scopeId", "data-v-3be36688"]]), ww = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), vs = (e) => e.charAt(0).toUpperCase() + e.slice(1), $w = (e) => vs(e.replace(/_at$/, "").replaceAll("_", " ")), xw = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Sw = (e, t, n) => [vs(`${e} ${n}`), (t == null ? void 0 : t.state) && vs(t.state)].filter(Boolean).join(" · "), sr = (e) => e.given_name || `${Yn(e.role)} ${e.id}`, _w = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? sr(t) : (e == null ? void 0 : e.name) ?? "", Mw = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? sr(t) : "", Cw = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !ww.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: $w(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], Ew = { reviewing: "Under review" }, Aw = (e, t) => e || Ew[t == null ? void 0 : t.state] || "", or = Zi("/api/docks", "docks"), PS = or.fetchAll, Bt = or.find, Ow = 6, Tw = 3, Da = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, pa = (e) => Date.parse(e.leaves_at) / 1e3, _t = (e) => !!(e.leaves_at && !e.kept), Iw = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!_t(e) || t < pa(e) || n.has(e.id)), Rw = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => Iw(a, t, n)).sort((a, s) => a.id - s.id);
function Bw(e, t, n = Ow) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(pa(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Lw = (e, t, n = e) => n < 2 ? !1 : e >= Tw ? !0 : t, Nw = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), gs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), qw = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Dw = (e) => ({ ...e.kept ? gs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : gs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Pw = ["keep", "unkeep", "open", "undock"], jw = (e) => ({ ...e, iconOnly: Pw.includes(e.action) });
function Fw(e, t) {
  var n;
  return [
    ...qw(e, t) ? [Dw(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Vt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    gs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(jw);
}
function lr(e, t) {
  const n = Fw(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: Nw(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Ww = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || lr(e, t).title, Hw = { class: "dock-text" }, zw = ["title"], Uw = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Gw = {
  class: "dock-facts",
  "data-dock-facts": ""
}, Vw = {
  key: 1,
  "data-dock-row": ""
}, Kw = { class: "dock-acts" }, Yw = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = C(() => Bt(a.item.type)), o = Vs(), l = C(() => zs(a.item.created_at, o.value * 1e3)), i = _(null), r = _(null), c = _(null), d = _(null), h = C(() => lr(a.item, s.value)), p = Ue(), y = C(() => `dock.${a.item.id}`), b = C(() => p.props[y.value].data.value), A = C(() => Ww(a.item, s.value, b.value)), S = C(() => Zn(a.item.target_model ?? "")), $ = C(() => {
      var k;
      return ((k = s.value) == null ? void 0 : k.word) ?? "";
    }), I = C(() => ({ ...b.value, id: a.item.target_id, noun: S.value })), H = () => {
      var k, v;
      return ((v = (k = s.value) == null ? void 0 : k.reads) == null ? void 0 : v.length) && p.reload(y.value);
    };
    xc(Ol, { data: b, reload: H, readOutput: Qi(p) }), ve(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (k, v, R) => {
        var L;
        H();
        const O = (L = p.subscriptions) == null ? void 0 : L.follow(`dock ${a.item.id}`, [`${S.value.replaceAll("-", "_")}.*`], (P) => {
          (!P.row_id || P.row_id === a.item.target_id) && H();
        });
        R(() => O == null ? void 0 : O());
      },
      { immediate: !0 }
    );
    const N = _(/* @__PURE__ */ new Set()), E = _("");
    async function V(k) {
      if (k.action === "undock") return n("undock", k);
      if (k.action === "open") return qe(`${a.item.target_model}:${a.item.target_id}`);
      k.action === "declared" && (N.value = /* @__PURE__ */ new Set([...N.value, k.label])), E.value = "";
      const R = await gn(k, { id: a.item.target_id }, p.environment);
      (R == null ? void 0 : R.ok) === !1 && (N.value = new Set([...N.value].filter((O) => O !== k.label)), E.value = `Could not ${k.label.toLowerCase()}: ${R.error}`);
    }
    const W = C(() => h.value.actions.filter((k) => !N.value.has(k.label))), q = C(() => {
      var k;
      return Aw((k = s.value) == null ? void 0 : k.badge, I.value);
    }), x = C(() => h.value.controls), M = C(() => {
      var k;
      return !!((k = s.value) != null && k.draws_head) && !a.collapsed;
    });
    return (k, v) => {
      var R, O, L, P;
      return u(), F(nr, {
        label: h.value.title + ((R = s.value) != null && R.needs_user ? ", waiting for you" : ""),
        type: (O = s.value) != null && O.needs_user ? "waiting" : "",
        folded: !!((L = s.value) != null && L.folds) && e.folded,
        body: !!((P = s.value) != null && P.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: v[3] || (v[3] = (J) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (u(), F(ar, {
            key: 0,
            "ends-at": B(pa)(e.item)
          }, null, 8, ["ends-at"])) : w("", !0)
        ]),
        head: j(() => {
          var J;
          return [
            M.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(D, { key: 1 }, [
              T(ge, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", Hw, [
                m("span", {
                  class: "dock-title",
                  title: A.value
                }, g(A.value), 9, zw)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? w("", !0) : (u(), f(D, { key: 0 }, [
                te(g(l.value), 1)
              ], 64))
            ], 512),
            x.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: v[0] || (v[0] = xe(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(D, null, ne(x.value, (z) => {
                var se, ae;
                return u(), f(D, {
                  key: z.action + z.runs
                }, [
                  !N.value.has(z.label) && (!((se = z.variants) != null && se.length) || !((ae = I.value) != null && ae.state) || z.variants.includes(I.value.state)) ? (u(), F(pe, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: z.pressed }),
                    "aria-pressed": z.pressed,
                    "aria-label": z.label,
                    title: z.label,
                    "data-dock-action": z.action,
                    onClick: (ye) => V(z)
                  }, {
                    default: j(() => [
                      T(ge, {
                        name: z.icon,
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
          E.value || e.refusal ? (u(), f("p", Uw, g(E.value || e.refusal), 1)) : w("", !0)
        ]),
        foot: j(() => {
          var J;
          return [
            m("span", Gw, [
              q.value ? (u(), f("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, g(q.value), 3)) : w("", !0),
              $.value ? (u(), f("span", Vw, g($.value) + " " + g(e.item.target_id), 1)) : w("", !0),
              m("span", {
                ref_key: "foot",
                ref: r,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (J = s.value) != null && J.folds ? (u(), F(pe, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: v[1] || (v[1] = (z) => n("fold"))
            }, {
              default: j(() => [
                te(g(s.value.folds) + " ", 1),
                T(pt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : w("", !0),
            m("span", Kw, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              T(Ds, {
                name: `dock.${e.item.type}`,
                row: I.value,
                environment: B(p).environment,
                "read-only": B(p).readOnly,
                "object-name": B(Zn)(e.item.target_model),
                "external-failure": "",
                onFailure: v[2] || (v[2] = (z) => E.value = z),
                onDone: k.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(D, null, ne(W.value, (z) => (u(), F(pe, {
                key: z.action + z.runs,
                small: "",
                variant: z.primary ? "primary" : "ghost",
                bordered: !z.primary,
                "data-dock-action": z.action,
                onClick: (se) => V(z)
              }, {
                default: j(() => [
                  te(g(z.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var J;
          return [
            (J = s.value) != null && J.body_url ? (u(), F(ps, {
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
}, nl = /* @__PURE__ */ U(Yw, [["__scopeId", "data-v-2812d571"]]), Qw = ["title", "aria-label"], Xw = { class: "run-chip-in" }, Jw = {
  key: 0,
  class: "run-chip-ring"
}, Zw = { class: "run-chip-name" }, e2 = { class: "run-chip-bar" }, t2 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ue(), o = C(() => `run.${a.item.target_id}`), l = C(() => s.props[o.value].data.value), i = C(() => !l.value || l.value.state === "running" || l.value.state === "background"), r = C(() => {
      var p, y;
      return ((p = l.value) == null ? void 0 : p.title) || ((y = l.value) == null ? void 0 : y.line) || a.item.title || "";
    }), c = C(() => i.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let h = null;
    return _e(() => {
      var p;
      d(), h = (p = s.subscriptions) == null ? void 0 : p.follow(`run chip ${a.item.id}`, ["process.*"], (y) => {
        (!y.row_id || y.row_id === a.item.target_id) && d();
      });
    }), Ke(() => h == null ? void 0 : h()), (p, y) => {
      var b;
      return u(), f("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: be({ "--tone": c.value })
      }, [
        B(_t)(e.item) ? (u(), F(ar, {
          key: 0,
          "ends-at": B(pa)(e.item)
        }, null, 8, ["ends-at"])) : w("", !0),
        m("span", Xw, [
          i.value ? (u(), f("span", Jw)) : (u(), F(yt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", Zw, g(r.value), 1)
        ]),
        m("span", e2, [
          m("i", {
            style: be({ width: i.value ? `${((b = l.value) == null ? void 0 : b.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, Qw);
    };
  }
}, n2 = /* @__PURE__ */ U(t2, [["__scopeId", "data-v-684dc75a"]]), a2 = 24, s2 = 8, jS = 420;
function FS({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= a2 ? !0 : e < t && s > s2 ? !1 : null;
}
const o2 = (e, t) => e === void 0 ? t : e, l2 = { me: 1, people: [] }, na = zt({
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
  people: l2,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Qn("journal.activity", !0),
  wide: !1,
  sideMini: Qn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
ci("journal.activity", () => na.activity);
ci("journal.side.mini", () => na.sideMini);
const ir = "journal.viewer.";
function i2(e, t, n) {
  try {
    const a = n.getItem(ir + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function r2(e, t, n) {
  try {
    n.setItem(ir + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function al(e, t, n = window.localStorage) {
  const a = _(i2(e, t, n));
  return ve(a, (s) => r2(e, s, n), { deep: !0 }), a;
}
const u2 = {
  key: "dock-all",
  class: "dock-all"
}, c2 = {
  key: "runs-head",
  class: "dock-runs-head"
}, d2 = { class: "dock-runs-title" }, f2 = { class: "dock-runs-chips" }, h2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var P, J;
    const t = e, n = ek(500), a = _(/* @__PURE__ */ new Set()), s = _(!1), o = _(!1), l = Ee(Pe), i = _(/* @__PURE__ */ new Set()), r = _({});
    async function c(z, se) {
      r.value = { ...r.value, [z.id]: "" }, i.value = /* @__PURE__ */ new Set([...i.value, z.id]);
      const ae = await gn(se, { id: z.target_id }, l.environment);
      (ae == null ? void 0 : ae.ok) === !1 && (i.value = new Set([...i.value].filter((ye) => ye !== z.id)), r.value = { ...r.value, [z.id]: `Could not dismiss this card: ${ae.error}` });
    }
    const d = C(
      () => Rw(
        t.items.filter((z) => !i.value.has(z.id)),
        n.value,
        a.value
      )
    ), h = C(
      () => Bw(
        d.value.filter((z) => Da(z, Bt)),
        n.value
      )
    ), p = C(() => d.value.filter((z) => !h.value.includes(z) && !Da(z, Bt))), y = C(() => h.value.filter((z) => !_t(z))), b = al(`dock-size:${((P = na.identity) == null ? void 0 : P.root) || location.host}`, null), A = (z) => {
      var se;
      return !!((se = Bt(z.type)) != null && se.needs_user);
    }, S = _(/* @__PURE__ */ new Set()), $ = _(/* @__PURE__ */ new Set()), I = C(() => d.value.length === 1), H = (z) => A(z) || I.value, N = (z) => H(z) ? S.value.has(z.id) || $.value.has(z.id) : b.value ? b.value.collapsed && !b.value.opened.includes(z.id) : t.collapsed, E = C(() => d.value.some(N)), V = C(() => (s.value = Lw(h.value.length, s.value, y.value.length)) && !o.value && !d.value.some(N));
    ve(() => t.collapsed, (z) => {
      $.value = new Set(z ? d.value.filter(A).map((se) => se.id) : []);
    });
    function W() {
      const z = !E.value;
      b.value = { collapsed: z, opened: [] }, S.value = new Set(z ? d.value.filter(A).map((se) => se.id) : []), $.value = /* @__PURE__ */ new Set();
    }
    function q(z) {
      var ae;
      if (!N(z)) return;
      if (H(z)) {
        S.value = new Set([...S.value].filter((ye) => ye !== z.id)), $.value = new Set([...$.value].filter((ye) => ye !== z.id));
        return;
      }
      const se = (ae = b.value) != null && ae.collapsed ? b.value.opened : [];
      b.value = { collapsed: !0, opened: [...se, z.id] };
    }
    const x = al(`dock-folded:${((J = na.identity) == null ? void 0 : J.root) || location.host}`, {}), M = (z) => {
      var se;
      return !!((se = Bt(z.type)) != null && se.folds) && (t.insidesFolded || o2(x.value[z.id], Da(z, Bt) || t.folded));
    };
    function k(z) {
      x.value = { ...x.value, [z.id]: !M(z) };
    }
    function v(z) {
      x.value = { ...x.value, ...Object.fromEntries(h.value.map((se) => [se.id, se.id !== z.id])) }, o.value = !0;
    }
    function R() {
      x.value = Object.fromEntries(Object.entries(x.value).filter(([z]) => !h.value.some((se) => String(se.id) === z))), o.value = !1;
    }
    function O(z) {
      a.value = /* @__PURE__ */ new Set([...a.value, z.id]);
    }
    function L(z) {
      a.value = new Set([...a.value].filter((se) => se !== z.id));
    }
    return (z, se) => (u(), F(Ms, {
      tag: "div",
      name: "dock",
      duration: B(tr),
      class: "dock-stack"
    }, {
      default: j(() => [
        d.value.length > 1 ? (u(), f("div", u2, [
          T(pe, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": E.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: j(() => [
              T(pt, {
                open: !E.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : w("", !0),
        (u(!0), f(D, null, ne(p.value, (ae) => (u(), F(nl, {
          key: ae.id,
          item: ae,
          class: Y({ timed: B(_t)(ae) }),
          leaving: B(_t)(ae) && !a.value.has(ae.id),
          folded: M(ae),
          collapsed: N(ae),
          refusal: r.value[ae.id],
          onOpen: (ye) => q(ae),
          onFold: (ye) => k(ae),
          onUndock: (ye) => c(ae, ye),
          onMouseenter: (ye) => O(ae),
          onMouseleave: (ye) => L(ae)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !E.value ? (u(), f("div", c2, [
          m("span", null, g(h.value.length) + " runs", 1),
          T(pe, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: R
          }, {
            default: j(() => [
              se[1] || (se[1] = te(" Runs ", -1)),
              T(pt, { open: "" })
            ]),
            _: 1
          })
        ])) : w("", !0),
        (u(!0), f(D, null, ne(V.value ? [] : h.value, (ae) => (u(), F(nl, {
          key: ae.id,
          item: ae,
          class: Y({ timed: B(_t)(ae) }),
          leaving: B(_t)(ae) && !a.value.has(ae.id),
          folded: M(ae),
          collapsed: N(ae),
          refusal: r.value[ae.id],
          onOpen: (ye) => q(ae),
          onFold: (ye) => k(ae),
          onUndock: (ye) => c(ae, ye),
          onMouseenter: (ye) => O(ae),
          onMouseleave: (ye) => L(ae)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        V.value ? (u(), F(nr, {
          key: "runs-row",
          label: `${h.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            T(ge, {
              name: "runs",
              size: 14
            }),
            m("span", d2, g(h.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            m("span", f2, [
              (u(!0), f(D, null, ne(h.value, (ae) => (u(), F(n2, {
                key: ae.id,
                item: ae,
                onClick: (ye) => v(ae)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            T(pe, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: se[0] || (se[0] = (ae) => o.value = !0)
            }, {
              default: j(() => [
                se[2] || (se[2] = te(" Runs ", -1)),
                T(pt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : w("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, WS = /* @__PURE__ */ U(h2, [["__scopeId", "data-v-9636df0c"]]), Mt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Hn = (e) => Math.min(Math.max(e, 0), 1), m2 = (e) => {
  const t = Hn(e);
  return t * t * (3 - 2 * t);
}, wt = (e, t, n) => m2((e - t) / (n - t));
function HS(e) {
  const t = Hn(e), n = Hn((t - 0.12) / 0.76) * Mt.shuffles, a = Math.min(Math.floor(n), Mt.shuffles - 1), s = n - a, o = wt(s, 0.26, 0.38) * (1 - wt(s, 0.76, 0.96)), l = wt(s, 0.38, 0.76), i = wt(t, 0, 0.12) * (1 - wt(t, 0.88, 1)), r = wt(s, 0.2, 0.34) * (1 - wt(s, 0.84, 1)), c = Math.sin(Math.PI * Hn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / Mt.shuffles, lift: Mt.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function zS(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const sl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, US = (e) => sl[e] ?? sl.butler, Ys = 2400, p2 = 0.05;
function v2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, p2), l = Math.min(t + Ys * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function GS(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function g2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function VS(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const KS = (e, t) => ({ ...e, stretch: t.stretch }), YS = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, rr = (e, t) => t >= (e.least ?? 0);
function QS(e, t, n) {
  if (!rr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const XS = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), y2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ol = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), b2 = (e) => e.right > e.left && e.bottom > e.top;
function JS(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(y2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = ol(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = ol(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), b2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
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
}, cn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), k2 = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => k2(cn(e, t, n)), w2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ht = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Nn = ([e, t], n) => e + n() * (t - e);
function $2(e) {
  return w2.map(() => {
    const t = Nn(ht.speed, e), n = Nn(ht.angle, e) * Math.PI / 180, a = Nn(ht.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Nn(ht.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const x2 = $2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function S2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ht.gravity * (t[2] - ht.floor))) / ht.gravity;
}
function ZS(e, t, n = x2) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = S2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= ht.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const e6 = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function t6(e, t) {
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
const n6 = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function a6(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, i] = [t.left + Dt.margin * n, t.right - Dt.margin * n], r = Math.min(Math.max(e + o + s * Dt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function s6(e, t, n) {
  const a = Oe.bug_smash, s = Te(t, a.walk), o = ([l, i]) => l + (i - l) * s;
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
function o6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = v2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ne = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function l6(e) {
  const t = Ne.least + Math.floor(e() * (Ne.most - Ne.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ne.walls[Math.floor(e() * Ne.walls.length)],
    along: Ne.margin + e() * (1 - 2 * Ne.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ys(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ne.margin, l = ((e.along - Ne.margin + e.way * Ne.speed * n / a) / s % 2 + 2) % 2, i = Ne.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Ne.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ne.inset : t.right - Ne.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function _2(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = g2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function i6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: i, shot: r } = _2(n, e.length), c = e.map(($, I) => ({ ...ys($, t, Math.min(n / o.fps, zn(I).shot)), shot: I < r })), d = Te(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map(($, I) => ({ bug: $, index: I, seconds: n / o.fps - zn(I).shot, spot: ys($, t, zn(I).shot) })).filter(($) => $.seconds >= 0), b = y.flatMap(($) => {
    const I = (s == null ? void 0 : s.get($.index)) ?? O2($.bug, t, $.spot, s ? [] : a);
    return s == null || s.set($.index, I), s && T2(I, $.seconds, a), I2(I, $.seconds, a);
  }), A = y.filter(($) => E2($.bug)).map(($) => ({ seconds: $.seconds, from: $.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: S }, slush: b, camera: A };
}
function zn(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function r6(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = zn(d), p = ys(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - p.x), A = Math.abs(p.x - r) >= y ? r : p.x + b * y, S = b > 0 ? Math.max(r, Math.min(A, i)) : Math.min(r, Math.max(A, l)), $ = { from: r, to: S, begin: h.walk, end: h.aim };
    return r = S, $;
  });
}
function u6(e, t, n) {
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
const Me = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, M2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function C2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const E2 = (e) => e.along * 97 % 1 < Me.camera, dn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Me.gravity * t * t });
function A2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Me.gravity * (t.bottom - e.from.y))) / Me.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Me.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Me.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Me.step) {
    const d = Math.min(c + Me.step, l.t), h = dn(e, d), p = ur(i, h, n);
    if (p) return { ...p, t: c + (d - c) * p.share };
    i = h;
  }
  const r = dn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function O2(e, t, n, a = []) {
  const s = C2(e.along + 1), [o, l] = M2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Me.count }, () => {
    const r = i + (s() - 0.5) * 2 * (Me.spread * Math.PI / 180), c = Me.speed[0] + s() * (Me.speed[1] - Me.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: Me.radius[0] + s() * (Me.radius[1] - Me.radius[0]) };
    return { ...d, ...A2(d, t, a) };
  });
}
function T2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Me.step) {
      const l = Math.min(o + Me.step, s), i = ur(dn(a, o), dn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function I2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...dn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Me.hold) / Me.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, r = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - r)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: r, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function c6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: r } = Oe.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / r, d = (o[1] - o[0]) * i / r, h = Te(e, [0, c]), p = Te(e, [c, c + d]);
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
function d6(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (A) => {
    const [S, $] = [A.x - e.at.x, A.y - e.at.y];
    return { x: i.x + S * c - $ * d, y: i.y + S * d + $ * c };
  }, [p, y] = [...n].sort((A, S) => A.x - S.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: b.map((A, S) => ({ from: A, to: S < b.length / 2 ? p : y })) };
}
const f6 = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function aa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: cn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: cn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function h6(e, t) {
  const n = Oe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = aa(n, t), l = 1 - (1 - n.small) * Te(a, n.shrinks) * (1 - Te(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = aa(n, t), o = n.flat * Te(a, n.squashes) * (1 - Te(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * cn(s, ...n.springs)) * (1 - cn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const m6 = (e) => e === "pack_box";
function p6(e) {
  const { into: t, out: n } = aa(Oe.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function v6(e) {
  const t = Oe.rope_swing, { into: n, out: a } = aa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const R2 = { after: 3 }, Qs = 10, B2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, L2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, N2 = { weight: 19 }, cr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, q2 = { every: 120 }, dr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, fr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, D2 = {
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
}, wn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Qs }), re = (e, t, n = {}) => wn(e, "clip", t, n), Pa = (e, t, n = {}) => wn(e, "look", t, n), ll = (e, t, n = {}) => wn(e, "gaze", t, n), ke = (e, t, n = {}, a = {}) => ({ ...wn(e, "pick", t, n), ...a }), $e = (e) => wn("nothing", "nothing", e, {}), P2 = 120, j2 = 300, ja = (e, t) => ({ ...re(e, t), cooldown: j2 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), F2 = () => [re("joy", 2)], $t = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), xt = (e) => ({ ...e, cooldown: B2[e.name] }), Qt = (e) => ({ ...e, shenanigan: !0, lasts: L2[e.name] }), va = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...de("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), $e(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...de("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...xt(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...xt(re("bug_smash", 2)), toward: "", onto: !1 },
    re("nod", 2)
  ]),
  ...de("tests_failed", { cooldown: 20, toward: "card" }, [re("startled", 2), re("dismay", 1), re("tantrum", 3), $e(1)]),
  ...de("committed", { cooldown: 30, toward: "card", onto: !0 }, [re("nod", 2), $e(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...de("sin_fixed", { cooldown: 300 }, [re("halo", 1), $e(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...de("sin_committed", { cooldown: 300 }, [re("repent", 1), $e(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...de("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [re("nod", 4), re("hand_rub", 4), $e(7)]),
  ...de("question_asked", { cooldown: 60 }, [re("ask_sign", 9), re("look_up", 3), $e(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...de("reported", { cooldown: 90 }, [ll("read", 3), re("nod", 1), $e(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [ll("read", 3), $e(1)]),
  ...de("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), $e(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), $e(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, F2()),
  ...de("bar_failed", { holds: !0 }, [re("fume", 1), re("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...de("standing", { cooldown: 12 }, [re("look_left", 2), re("look_right", 2), re("look_up", 1), $e(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...de("launched", { cooldown: 300 }, [re("tumble", 3), $e(47)]),
  // a break from the hammering now and then
  ...de("building", { cooldown: 30 }, [re("wipe_brow", 4), re("look_left", 1), re("look_right", 1), $e(69)]),
  ...de("failed", { cooldown: 20, toward: "card" }, [re("shake", 3), re("tantrum", 2), $e(2)]),
  ...de("refused", { cooldown: 20 }, [re("shake", 1), $e(1)]),
  ...de("work_done", { cooldown: 120 }, [re("stretch", 2), $e(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...de("pondering", { cooldown: [30, 60] }, [ke("ponder", 1)]),
  ...de("thought_cloud", { cooldown: 90 }, [ke("cloud", 1)]),
  ...de("light_bulb", { cooldown: 150 }, [ke("bulb", 1)]),
  ...de("answered", { cooldown: 15 }, [Pa("amused", 3), $e(2)]),
  ...de("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    $e(1)
  ]),
  ...de("long_walk", { cooldown: 90 }, [re("stumble", 3), $e(22)]),
  ...de("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), $e(13)]),
  ...de("typing", { cooldown: 60 }, [Pa("reading", 1), $e(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(D2).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Pa(t, 1)])),
  ...Object.entries(dr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(fr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...de("pastime", {}, [
    $t("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    $t("rest", 3, 180, 120),
    $t("yawn", 2, 60, 60),
    $t("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    $t("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    $t("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    $t("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Qt(xt(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Qt(xt(re("disco", 2, { ball: "bubble" }))),
    $e(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...de("held:search", { cooldown: P2 }, [ja("search", 3), { ...ja("binoculars", 2), when: { home: !0 } }, { ...ja("glass_bubble", 2), when: { bubble: !0 } }]),
  ...de("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...de("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...de("spell", {}, [ke("writing", 12, { state: "writing" }), ke("reading", 12, { state: "reading" }), ke("searching", 12, { state: "searching" }), $e(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...de("tickled", {}, [{ ...xt(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...de("eager", {}, [re("eager", 2, { slow: !0 }), $e(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...de("jump", {}, [Qt(xt(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...de("climb", {}, [ke("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...de("unit", { cooldown: cr.build.cooldown }, [ke("unit", N2.weight), $e(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...ke("hang", 1, { hands: !0, free: !0 }), cooldown: q2.every }, ke("stand", 5)]),
  // a digit a blow's dust lets out
  ...de("digit", {}, [ke("0", 1), ke("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...de("roam", {}, [
    ke("rest", 35, {}, { stay: [25, 60] }),
    ke("seat", 15, {}, { stay: [15, 40] }),
    ke("edge", 25, {}, { stay: [8, 20] }),
    Qt(ke("bubble", 15, {}, { stay: [30, 80] })),
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
    Qt(xt(ke("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...de("laptop", {}, [ke("seat", 6, {}, { stay: [60, 150] }), ke("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...de("ledge_at", {}, [ke("middle", 2, {}, { along: 1 / 2 }), ke("third", 1, {}, { along: 1 / 3 }), ke("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...de("composed_as", {}, [
    ke("facing", 4, {}, { turn: 0, leans: 0 }),
    ke("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ke("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ke("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ke("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], hr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), mr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), W2 = (e) => Array.isArray(e) ? e[0] : e, H2 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, z2 = (e) => va.some((t) => t.when.moment === e);
function U2(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || mr(d).every(([h, p]) => n(h) >= W2(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = va.filter((d) => hr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= R2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ve(e, t) {
  const n = U2(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (pr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function pr(e, t, n) {
  var a;
  for (const [s, o] of mr(t)) (a = e.memory) == null || a.set(s, e.now + H2(o, n));
}
function g6(e, t, n) {
  pr(e, va.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const y6 = (e) => Object.values(cr).find((t) => hr(t.when, e)) ?? null, G2 = (e, t, n) => n - t <= (e.lifetime ?? Qs), b6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || rr(e.clip, t));
class vr {
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
const bs = {
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
}, k6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), gr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), w6 = {
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
}, $6 = 120, V2 = 20, x6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < V2), K2 = (e) => bs[e] || bs.idle, S6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, yr = "airborne", Y2 = "landing", Q2 = "travelling", br = "grounded", _6 = ({ airborne: e, landing: t, trip: n }) => e ? yr : t ? Y2 : n != null && n.started ? Q2 : br;
function M6(e, t) {
  var s;
  const n = X2(e, t);
  return e.mode === br && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function X2(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === yr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...J2(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : K2(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function J2(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ks = (e) => e.outcome, Z2 = "plugin:code-commandments:sins:", il = (e) => e.type === "plugins.card" && e.markKey.startsWith(Z2), e5 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => il(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => il(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], C6 = (e, t) => e.filter((n) => n.author === "user" && ea(n.read_at) > t).map((n) => ({ beat: "read_message", time: ea(n.read_at), card: wi(n) })).sort((n, a) => n.time - a.time), rl = { user: "reacted", agent: "agent_reacted" };
function E6(e, t) {
  return e.filter((n) => rl[n.author] && Et(n) > t).map((n) => ({ beat: `${rl[n.author]}:${n.emoji}`, time: Et(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const t5 = [.../* @__PURE__ */ new Set([...Object.values(dr).flatMap((e) => Object.keys(e)), ...Object.keys(fr)])];
function A6(e, t) {
  return e.filter((n) => n.author === "agent" && Et(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = t5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Et(n), card: wi(n) })).sort((n, a) => n.time - a.time);
}
const n5 = (e) => new vr(e).isTest(), sa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ks(e)] || "";
}, a5 = 1800, s5 = (e, t) => {
  if (sa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && sa(n) !== "finished" && Number(e.time) - Number(n.time) <= a5 ? "tests_fixed" : "tests_passed";
};
function O6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(n5), s = a.filter((i) => sa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, sa(i))), o.map((i) => ({ beat: s5(i, s), time: Number(i.time), card: i.key }));
}
function T6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ks(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ks(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const I6 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Et(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function R6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function B6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function L6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = e5.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function Xs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const ul = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function o5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Xs(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function N6(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : z2(`held:${e}`) ? "idle" : e;
}
const Le = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function q6(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Le.ahead * n ? 180 : Math.sign(a) * Le.turn;
}
const cl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function D6(e, t) {
  const n = Math.min(Le.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Le.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Le.lines, Math.floor((e.bottom - e.top - 2 * a) / Le.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Le.sweep) % s, i = o % Le.sweep, r = Le.sweep - Le.returnSeconds, c = cl((i - r) / Le.returnSeconds), d = i <= r ? cl(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Le.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const dl = 3, kr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, fl = 12, P6 = (e, t) => ({ mood: e, began: t, seen: 0 });
function j6(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!kr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= dl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * fl) / fl, lasts: dl } };
}
const F6 = (e) => e.posture === "hang" && !kr(e.face), l5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), i5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function W6(e, t, n) {
  return l5.has(e) ? 1 / 0 : !i5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(wr(n - t.began, t.share) - ot.lead, 0);
}
const r5 = 5;
function H6(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= r5 ? { beat: "long_walk", time: n } : null };
}
const u5 = 30, qn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function z6(e, t, n, a, s = null) {
  if (t && n < t.until || !qn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, i] = qn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + qn.every } : { state: e, began: 0, until: 0, next: n + qn.every };
}
const U6 = (e, t, n) => t && n < t.until && gr.has(e.state) ? { state: t.state, since: t.began } : e, ot = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, wr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function G6(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = wr(o, e.share);
  return s ? { eager: c5(t, l), moment: null } : l > ot.lead ? { eager: t, moment: null } : l < ot.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ot.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ot.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function c5(e, t) {
  return e.on && t > ot.lead + ot.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ot.lead && t >= ot.least ? { ...e, on: !0, calm: !1 } : e;
}
const d5 = 1, f5 = { look: "look", gaze: "gaze" };
function h5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [f5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const m5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), p5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > d5 * t, memory: a, now: s, room: o }, n).name === "backflip", v5 = { work: ["building"], idle: ["standing"] };
function V6(e, t, n, a) {
  const s = bs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(v5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), gr.has(e) ? { moments: o, began: n || a } : (n && a - n >= u5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function g5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const hl = { pondering: g5 };
function K6(e, t, n, a, s, o) {
  if (hl[e.beat]) {
    const i = hl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = h5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Qs && { lifetime: l.lifetime } } } : null;
}
function Y6(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = m5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const Q6 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function X6(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function J6(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Z6 = (e, t) => !!(e != null && e.watches) && !t.once, e_ = 10, t_ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || G2(a, a.queuedAt, n)), n_ = (e, t) => t ? null : e[0] ?? null;
function a_(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const s_ = (e, t) => !t.during || !e.some((n) => n.during === t.during), y5 = 2 * Math.PI, b5 = 500;
function o_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / b5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = y5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, A = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !r ? s && !t.behind && !y.behind ? w5(y, t, n, p, s) : x5(y, t, n, p) : t) ?? y, S = A != null && A.behind && A.mood === "reading" ? k5(e.point, A, n, l, s) : A;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: a };
}
function k5(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, l = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : d, b = y + l(c - y), A = Math.min(Math.max(a / 1e3, 0), 0.1), S = Le.turnSpeed * A, $ = h ? y + Math.min(Math.max(b - y, -S), S) : b, I = h ? e.readingFollow + p : $, H = I + ($ - I) * (1 - Math.exp(-A / Le.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, E = o(Xs(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), V = Math.min(Math.max(E, -N.up), N.down), W = Le.tipSpeed * A, q = h ? e.readingPitch + Math.min(Math.max(V - e.readingPitch, -W), W) : V;
  return { ...t, readingYaw: $, readingFollow: H, readingPitch: q, readingFacing: i };
}
function w5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (I) => {
    const { yaw: H, pitch: N } = Xs(I.x - n.x, s, n.y - I.y, o);
    return { yaw: H, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [ul(i(e)), ul(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [p, y] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [b, A, S] = r.map((I, H) => p * I + y * c[H]), $ = s * b / A;
  return { ...t, x: n.x + $, y: n.y - o5($, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const $5 = 0.15;
function l_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= $5;
}
function x5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const S5 = (e) => !(e != null && e.on);
function i_(e, t, n) {
  if (S5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const fn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, nt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Fa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ml = (e) => e * e * (3 - 2 * e);
function _5(e) {
  if (e < 0 || e >= nt.seconds) return null;
  const t = Fa(e, ...nt.flicker), n = Math.floor(t * nt.flickers * 2) % 2 === 0, a = e < nt.flicker[1] ? n ? 0.35 + 0.5 * t : nt.dim : 1;
  return { strength: 1 - ml(Fa(e, ...nt.fade)), lit: a, white: e < nt.flash[0] ? 0 : 1 - ml(Fa(e, ...nt.flash)) };
}
const r_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function u_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = _5(t - e.at);
  return a && { colour: fn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: nt.signs[e.tone], ...a } };
}
function c_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function d_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= fn.looks || a === null && n - e.since >= fn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function f_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ft = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, h_ = { behind: 39, figure: 40, ahead: 41 }, M5 = "[data-figure-pile]", C5 = { amber: [1, 0.69, 0.125], good: fn.colours.good, bad: fn.colours.bad }, Un = { phases: 4, ms: 230, dim: 0.25 }, m_ = (e, t, n) => e !== "amber" || (t + n) % Un.phases < Un.phases / 2 ? 1 : Un.dim, p_ = (e) => e === "amber" ? Un.phases : 1;
function v_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const g_ = Object.keys(C5), Qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Xt = ([e, t], n) => e + n() * (t - e);
function y_(e) {
  const t = Qe.least + Math.floor(e() * (Qe.most - Qe.least + 1));
  return Array.from({ length: Math.min(t, Qe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Qe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Xt(Qe.start, e), l = Xt(Qe.reach, e);
    return {
      text: Ve({ moment: "digit" }, e).name,
      x: a * o,
      y: Qe.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Xt(Qe.moveMs, e)),
      fadeMs: Math.round(Xt(Qe.fadeMs, e))
    };
  });
}
const Wa = { high: 3, gap: 1 };
function b_(e) {
  const t = Math.floor(e / Wa.high);
  return { left: -(ft.inside + ft.width / 2 + t * (ft.width + Wa.gap)), up: e % Wa.high * (ft.height - ft.top) };
}
const E5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, A5 = { after: 5 }, O5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new vr(t).isBuild());
function k_(e, t, n) {
  const a = O5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= A5.after ? s : null;
}
function w_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: E5(n, a, s) } : null;
}
const pl = { ahead: 140, up: 70 };
function $_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * pl.ahead, y: a - pl.up } } : o ? { at: { x: n(o), y: a - o.up - ft.height } } : t ? { at: null } : null;
}
const Ha = { least: 4e3, most: 1e4 }, T5 = (e) => Ha.least + e() * (Ha.most - Ha.least), St = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function x_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = T5(t);
    if (n.length >= St.most || t() >= St.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (St.at[0] + t() * (St.at[1] - St.at[0]));
    n.push({ from: o, to: o + St.ms }), a = o + St.ms;
  }
}
const S_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), __ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), $r = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), M_ = new Set(va.filter((e) => $r.has(e.when.moment) && e.type === "clip").map((e) => e.name)), I5 = (e) => e.some((t) => t.state === "built"), C_ = (e, t) => I5(t) ? e.filter((n) => !$r.has(n.beat)) : e, vt = { reach: 40, room: 6 }, R5 = (e, t) => t <= e - vt.reach + 2, E_ = (e, t, n) => R5(e, n) ? t - vt.reach : e - vt.reach - vt.room, A_ = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, za = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, O_ = (e) => Xt(e() < za.longShare ? za.long : za.short, e), B5 = 2 * ft.width;
function T_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= B5 ? o : e + (o - e + s / 2) % s;
}
const L5 = 60, I_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= L5, vl = "[data-figure-home]", $n = () => {
  var t;
  const e = document.querySelector(vl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(vl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, N5 = "[data-figure-docked-bars]", q5 = "[data-figure-chat-foot]", D5 = [0.85, 0.6, 0.35, 0.15], P5 = ["question", "waiting", "suggestion"], R_ = (e, t) => P5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function B_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const j5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", F5 = "[data-figure-newest]";
function xr() {
  var a, s;
  const e = (a = $n()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(F5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Js(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function hn(e, t, n = xr()) {
  if (!e || !n) return !0;
  const a = rt(e, t), s = ya(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ie.top * t.size, bottom: a.top + Ie.bottom * t.size }, l = Mt.gap;
  return !ga(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function L_(e, t, n, a = xr()) {
  if (!a || hn(t, e, a)) return null;
  const s = ya(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Ot(), r = t.posture === "stand" ? eo * e.size : Tr * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - Mt.gap - l, a.right + Mt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= d && hn(p, e, a) && v$(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Ua = 0.26, Sr = 0.54, W5 = 1.25 / 5.4, xn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ua, travels: "stand" },
  lounge: { drop: Ua, travels: "stand" },
  composed: { drop: Ua, travels: "stand" },
  hang: { drop: Sr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, N_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * W5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Sr
}), en = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), H5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), q_ = (e, t) => (e === "sit" ? H5.has(t) : en.has(e)) ? e : "stand";
function D_(e, t) {
  return e.facing === t.facing || !en.has(e.posture) && !en.has(t.posture) ? t : { posture: "stand", facing: en.has(e.posture) ? e.facing : t.facing };
}
const P_ = 0.25, j_ = (e, t) => en.has(e) && xn[t].drop === 0, _r = 2, z5 = 90, U5 = 180, G5 = 140, V5 = 280, K5 = 420, Y5 = 0.25, Q5 = 290, X5 = 600, J5 = "cubic-bezier(0.2, 0.7, 0.4, 1)", Z5 = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ga = 5;
function oa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ga) return null;
  (l || i) && (o = Math.max(o, _r));
  const y = o > 1, b = Math.abs(t.x - e.x), A = b < Ga ? 0 : b / (z5 * o) * 1e3, S = Math.min(A, y ? G5 : U5), $ = Math.abs(t.y - e.y), I = t.y < e.y, H = I && !p && p5($, n, r, c, d, h), N = I ? K5 + Math.min($, 400) * Y5 : Math.sqrt(2 * $ / Ys) * 1e3, E = {
    x: t.x,
    y: t.y,
    ms: $ > Ga ? H ? X5 : N : 0,
    lead: H ? Q5 : I ? V5 : 0,
    easing: I ? J5 : Z5,
    hopping: !0,
    clip: H ? "backflip" : I ? "jump" : "fall"
  }, V = { x: t.x, y: t.y, ms: A + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, W = p ? e$(t, n) : E, q = I && !a ? [{ ...V, y: e.y }, W] : [{ ...E, x: e.x }, V];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const e$ = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), t$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], F_ = (e, t, n) => e.posture === "walk" && n ? "walk" : t$(e.clip, t), rt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - xn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ga = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Js = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = $n()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Dn = 0.5, gl = 20;
function W_(e, t, n = Ot()) {
  const a = rt(e, t);
  return a.left >= n.left + gl && a.right <= n.right - gl;
}
function Zs(e, t, n = Ot()) {
  const a = rt(e, t), s = a.right - a.left, o = ya(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Dn && i <= n.right + Dn && a.top >= n.top - Dn && r <= n.bottom + Dn;
}
const la = [0.35, 0.5, 0.65], ia = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ie = { left: la[0], right: la.at(-1), top: ia[0], bottom: ia.at(-1) }, n$ = 0.24;
function ya(e) {
  if (e.posture === "stand") return { left: Ie.left, right: Ie.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + n$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ie.left, t), right: Math.max(Ie.right, t) };
}
function a$(e, { size: t }, n = Ot()) {
  const a = ya(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const eo = (Ie.right - Ie.left) / 2 + 0.08;
function H_(e, t) {
  return e === "hang" ? Ie : { ...Ie, bottom: Math.min(Ie.bottom, 1 - t - xn[e].drop) };
}
const s$ = "[data-figure-agent]";
function Mr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Js(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const r of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[r].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, r), c.setEnd(o, r + 1), [...c.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Cr = (e) => ia.flatMap(
  (t) => la.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function to(e, t, n = "") {
  if (!hn(e, t)) return la.length * ia.length;
  const a = rt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(j5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && ga(s, r) && Js(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return Cr(s).filter(([i, r]) => l(i, r) || Mr(i, r, n)).length;
}
function o$(e, t) {
  const n = rt(e, t);
  return Cr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Mr(a, s, "", s$)).length;
}
const yl = 4;
function z_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = yl; o <= s; o += yl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!o$(i, e) && hn(i, e)) return i;
    }
  return null;
}
function mn(e, t, n) {
  const a = Ot(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Zs(l, t, a) && hn(l, t)).map((l) => ({ spot: l, covered: to(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Er = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), l$ = [0.5, 0.25, 0.75], i$ = (e) => Er(e.getBoundingClientRect(), l$), Ar = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, r$ = eo, u$ = (e, t, { size: n }, a = r$) => Or(e, Ar[t], a * n, "stand");
function Or(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const c$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Tr = 0.1, d$ = (e, t, { size: n }) => Or(e, c$[t], Tr * n, "sit"), f$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Va = 60;
function U_(e, t) {
  const n = f$(t);
  return !e.aside || Math.abs(n) >= Va ? t : n < 0 ? 360 - Va : Va;
}
const tn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, h$ = (e) => [.../* @__PURE__ */ new Set([e, ...tn.turns.map((t) => (t + 360) % 360)])];
function G_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = h$(t), l = tn.every[0] + a() * (tn.every[1] - tn.every[0]);
  return { face: t, from: s ? m$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function m$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / tn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function V_(e, t) {
  const { element: n, edge: a } = ba(), s = ["left", "right"].map((i) => Sn(d$(a, i, e), e)).filter((i) => n && Zs(i, e) && !to(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function K_(e, t, { size: n }) {
  const a = (Ie.right - Ie.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Ir } : e;
}
const Ir = 7;
function Rr() {
  const e = [...document.querySelectorAll(M5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function p$(e, t) {
  const n = rt(e, t), a = n.right - n.left;
  return { left: n.left + Ie.left * a, right: n.left + Ie.right * a, top: n.top + Ie.top * a, bottom: n.bottom };
}
function v$(e, t) {
  const n = Rr();
  return !n || !ga(p$(e, t), n);
}
const g$ = 4;
function ba() {
  const e = _n(), t = Rr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > g$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Ir - n, 0) } };
}
const Y_ = ({ size: e, below: t }) => (1 - t) * e;
function Sn(e, t) {
  const n = Ot(), { size: a, below: s } = t, o = xn[e.posture].drop * a;
  return { ...a$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ws = (e, t) => Object.keys(Ar).map((n) => Sn(u$(e, n, t), t)), no = (e, t) => Er(e, D5).map((n) => Sn(n, t)), Br = (e, t, n) => mn(e, t, n) ?? e[0];
function Q_(e, t) {
  const { element: n, edge: a } = ba();
  return { ...Br(ws(a, e), e, t), view: null, on: n };
}
function X_(e, t, n, a) {
  const { element: s, edge: o } = ba(), l = (a ? ws(o, t) : [...ws(o, t), ...no(o, t)]).filter(
    (c) => !ga(rt(c, t), e)
  ), i = mn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), r = i && !to(i, t) ? i : mn(l, t, n);
  return r && { ...r, view: null, on: s };
}
function _n() {
  var a;
  const e = $n(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(N5);
  if (!t) return { ...ka(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const bl = { within: 2 };
function J_(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = ka().edge;
  return a.left > s.left + bl.within || a.left + a.width < s.left + s.width - bl.within;
}
const y$ = "[data-figure-closing]";
function Z_() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(y$));
}
const Lr = "[data-figure-progress]";
function eM(e) {
  const t = e.querySelector(Lr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function tM(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const b$ = { across: 300, above: 380, below: 60 };
function nM(e) {
  const { across: t, above: n, below: a } = b$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: k$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const k$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Nr = "[data-figure-bar]", $s = { back: 144, along: 0.4 };
function aM(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(Nr) : null;
  if (!(s != null && s.querySelector(Lr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Sn({ x: o - $s.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function sM(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < $s.along * a.size ? t.x + $s.along * a.size : e.x, y: e.y, behind: !0 };
}
function oM(e) {
  const t = e.querySelector(Nr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ka() {
  const e = $n();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function lM(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = ka(), r = n === null ? w$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Sn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function w$(e, t, n, a, s) {
  const o = no(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + ft.width < s && r.x + a - vt.reach - vt.room >= l);
  return mn(i.length ? i : o, t, n);
}
const $$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function iM(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, _r));
  const y = (H) => {
    const N = rt(H, n, xn[H.posture].travels);
    return { x: N.left, y: N.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return x$(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [A, ...S] = [e, ...r, t].map(y), $ = oa(A, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: p }), I = S.slice(1).map((H, N) => {
    var E;
    return (E = oa(S[N], H, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : E.legs.find((V) => V.hopping);
  });
  return $ && { ...$, legs: [...$.legs, ...I.filter(Boolean)] };
}
function x$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / $$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? oa(e, n, o.size, { pace: l }) : oa(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function rM(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function uM(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && mn(i$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ba();
  return { ...Br(no(s, t), t, n), view: null, on: a };
}
const S$ = "[data-figure-bubble]", _$ = 250;
let nn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), qr = 0;
const Kt = () => nn, Ka = /* @__PURE__ */ new WeakMap();
let M$ = 0;
function ao(e) {
  return Ka.has(e) || Ka.set(e, `floor-${++M$}`), Ka.get(e);
}
const C$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, E$ = () => {
  var e, t;
  return ((t = (e = $n()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function A$(e, t) {
  var a;
  const n = (a = e.querySelector(q5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function O$(e, t) {
  const n = e && A$(e, t), a = e ? [...e.querySelectorAll(S$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || C$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: ao(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const T$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= _$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Dr(e = nn, t = performance.now()) {
  const n = Ot(), a = E$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = ka();
  return c.element && r.push({ id: ao(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...O$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: T$(e, d, t) }))) });
}
const xs = /* @__PURE__ */ new Set();
function I$(e) {
  return xs.add(e), () => xs.delete(e);
}
function R$() {
  Pr();
  const e = () => {
    qr = requestAnimationFrame(e), !document.hidden && (nn = Dr(nn), xs.forEach((t) => t(nn)));
  };
  e();
}
function Pr() {
  cancelAnimationFrame(qr);
}
const so = 5, B$ = 56, L$ = { share: 0.6 }, N$ = (e) => -Math.sqrt(2 * Ys * L$.share * e), Ht = (e, t) => e.find((n) => n.id === t) ?? null;
function cM(e, t = Dr().floors) {
  const n = Ht(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ao(e.on) : null, o = s && Ht(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function jr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Kt().floors) {
  const c = Ht(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || q$(c, d, o)) && D$(d, i, r) ? { x: d.x, y: d.y } : null;
}
const oo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, q$ = (e, t, n) => !oo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function dM(e, t = Kt().floors) {
  if (!oo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= so && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function D$(e, t, n = Kt().floors) {
  const a = Ht(n, "home");
  return e.posture === "hang" && a && rt(e, t).bottom >= a.top ? !1 : Zs(e, t);
}
function fM(e, t, n, a = Kt().floors) {
  const s = jr(e, n, a);
  if (!e.home) return P$(e, t, s, a);
  if (!s) return null;
  const o = Ht(a, "home"), l = s.y - t.y, i = l > so ? "dropping" : -l > B$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function P$(e, t, n, a) {
  const s = n ? Ht(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: N$(e.risen) };
  if (!n) return null;
  if (oo(t) && n.y - t.y > so) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function hM(e, t, n) {
  const a = eo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function mM(e, t, n, a = Kt().floors) {
  const s = t && jr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const j$ = ["data-type"], F$ = { class: "figure-floor-name" }, W$ = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: be({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", F$, g(e.floor.type), 1)
    ], 12, j$));
  }
}, H$ = /* @__PURE__ */ U(W$, [["__scopeId", "data-v-ac620b01"]]), z$ = {
  class: "figure-floors",
  "aria-hidden": "true"
}, U$ = {
  __name: "FigureFloors",
  setup(e) {
    const t = Je(Kt().floors);
    let n = () => {
    };
    return _e(() => {
      n = I$((a) => t.value = a.floors), R$();
    }), Re(() => {
      n(), Pr();
    }), (a, s) => (u(), f("div", z$, [
      (u(!0), f(D, null, ne(t.value, (o) => (u(), F(H$, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, pM = /* @__PURE__ */ U(U$, [["__scopeId", "data-v-c8fb9617"]]), an = (e) => typeof e == "number" ? e : Date.parse(e);
function vM(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: an(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => an(s.row.created_at) - an(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const kl = 20;
async function gM(e, t, n) {
  for (let a = 0; a < kl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || an(o.created_at) <= an(s.created_at) || !await n()) return a;
  }
  return kl;
}
const G$ = 3, Ya = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function V$(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ya[n.grouping]) == null ? void 0 : a.call(Ya, e.row, n)) || "";
}
function K$(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function yM(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= G$ ? [K$(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = V$(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function bM(e) {
  const t = Ue(), n = t.option("row"), a = _(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), ve(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Y$(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const kM = (e) => (t) => t.filter((n) => n.id !== e), wM = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), $M = (e) => (t) => [...t, e], xM = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function SM(e, t = {}) {
  const n = Ue(), a = _(null), s = _("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function _M(e) {
  const t = Ue(), n = _("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Pn = /* @__PURE__ */ new Map();
function Q$(e, t) {
  if (Pn.has(e)) return Pn.get(e);
  const n = t().finally(() => Pn.delete(e));
  return Pn.set(e, n), n;
}
function MM() {
  const e = Ue(), t = _(null), n = _("");
  async function a() {
    const s = await Q$(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const X$ = { class: "cards-page" }, J$ = { class: "cards-bar" }, Z$ = { class: "cards-count" }, e4 = { class: "cards" }, t4 = {
  key: 1,
  class: "cards-note"
}, n4 = {
  key: 2,
  class: "cards-note"
}, a4 = ["data-row", "onClick"], s4 = { class: "card-head" }, o4 = { class: "card-title" }, l4 = { class: "card-foot" }, i4 = {
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
    return (a, s) => (u(), f("div", X$, [
      m("div", J$, [
        m("span", Z$, g(e.rows.length) + " " + g(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        T(pe, De({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            T(ge, {
              name: "plus",
              size: 12
            }),
            te(" New " + g(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", e4, [
        e.loaded ? e.failure ? (u(), f("p", t4, g(e.failure), 1)) : e.rows.length ? w("", !0) : (u(), f("p", n4, "No " + g(e.noun) + "s yet", 1)) : (u(), F(Ye, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), f(D, null, ne(e.rows, (o) => (u(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", s4, [
            T(ge, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            te(" " + g(e.head(o)), 1),
            T(et, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", o4, g(e.title(o)), 1),
          m("span", l4, g(e.foot(o)), 1)
        ], 8, a4))), 128))
      ]),
      me(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, CM = /* @__PURE__ */ U(i4, [["__scopeId", "data-v-b9e18f79"]]), wl = "newest";
function EM(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Ee(Pe, null)) == null ? void 0 : c.search, s = _(""), o = _(wl), l = _("all"), i = C(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((p) => Y$(p, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === wl ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), r = C(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
}
const r4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, u4 = 40, c4 = "top", d4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Ee(Pe, null)) == null ? void 0 : p.autoScroll, s = C(() => a === c4), o = _(null), l = _(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      var y;
      l.value = i(o.value) >= u4, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    ve(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = r()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return _e(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = r());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), Ke(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (u(), f("div", r4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        me(y.$slots, "default", {}, void 0, !0)
      ], 34),
      T(Ut, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: j(() => [
          Ze(m("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: c
          }, [
            T(ge, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            b[0] || (b[0] = te(" Newest ", -1))
          ], 512), [
            [Il, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, AM = /* @__PURE__ */ U(d4, [["__scopeId", "data-v-b5c0cd03"]]), f4 = ["aria-selected", "data-tab", "onClick"], h4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, m4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ee(Pe, null), o = C(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = _(null), i = _({ left: 0, width: 0, slides: !1 }), r = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const d = () => je(() => c(!0));
    let h = null;
    return _e(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Re(() => h == null ? void 0 : h.disconnect()), ve(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, d), ve(() => n.answer, d, { deep: !0 }), (p, y) => (u(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), f(D, null, ne(o.value, (b) => {
        var A, S;
        return u(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((A = e.active) == null ? void 0 : A.key) === b.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === b.key,
          "data-tab": b.key,
          onClick: ($) => a("choose", b)
        }, [
          te(g(b.label) + " ", 1),
          r(b) ? (u(), f("span", h4, g(e.answer[b.count_field]), 1)) : w("", !0)
        ], 10, f4);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: be({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, OM = /* @__PURE__ */ U(m4, [["__scopeId", "data-v-e0def8d7"]]), p4 = {
  class: "tab-body",
  "data-tab-body": ""
}, v4 = { "data-tab-content": "" }, g4 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = _(!1);
    let a = 0;
    return ve(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Cs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), f("div", p4, [
      n.value ? (u(), F(Ye, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : w("", !0),
      Ze(m("div", v4, [
        me(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Il, !n.value]
      ])
    ]));
  }
}, TM = /* @__PURE__ */ U(g4, [["__scopeId", "data-v-fe3ebcad"]]), y4 = {}, b4 = { class: "menu-label" };
function k4(e, t) {
  return u(), f("span", b4, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $l = /* @__PURE__ */ U(y4, [["render", k4], ["__scopeId", "data-v-71c11156"]]), w4 = {
  class: "search-bar",
  "data-search-bar": ""
}, $4 = { class: "search-bar-control" }, x4 = ["value", "placeholder", "aria-label"], S4 = ["aria-expanded"], _4 = {
  key: 0,
  "data-menu-count": ""
}, M4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var $;
    const a = e, s = n, o = tu(), l = (($ = Ee(Pe, null)) == null ? void 0 : $.search) ?? {}, i = C(() => l.placeholder || a.placeholder), r = l.context ?? [], c = _(null), d = _(null), h = _([]), p = C(() => h.value.length ? h.value[h.value.length - 1].next : r), y = C(() => !!o.menu || r.length > 0), b = (I) => {
      h.value = [], d.value = d.value ? null : I.currentTarget;
    };
    function A(I) {
      if (I.next.length) {
        h.value = [...h.value, I];
        return;
      }
      d.value = null, s("pick", I.click);
    }
    function S() {
      var I;
      s("update:modelValue", ""), (I = c.value) == null || I.focus();
    }
    return t({ focus: () => {
      var I;
      return (I = c.value) == null ? void 0 : I.focus();
    } }), (I, H) => {
      var N;
      return u(), f("div", w4, [
        m("div", $4, [
          T(ge, {
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
            onInput: H[0] || (H[0] = (E) => s("update:modelValue", E.target.value)),
            onKeydown: Ct(S, ["esc"])
          }, null, 40, x4),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            T(ge, {
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
            e.menuCount ? (u(), f("span", _4, g(e.menuCount), 1)) : w("", !0),
            T(ge, {
              name: "caret",
              size: 12
            })
          ], 8, S4)) : w("", !0)
        ]),
        (N = B(l).button) != null && N.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (E) => s("pick", B(l).button.click))
        }, g(B(l).button.title), 1)) : w("", !0),
        me(I.$slots, "default", {}, void 0, !0),
        d.value ? (u(), F(Is, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: H[3] || (H[3] = xe(() => {
          }, ["stop"])),
          onClose: H[4] || (H[4] = (E) => d.value = null)
        }, {
          default: j(() => [
            h.value.length ? (u(), F(Ft, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (E) => h.value = h.value.slice(0, -1))
            }, {
              default: j(() => [
                te("‹ " + g(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : w("", !0),
            (u(!0), f(D, null, ne(p.value, (E) => (u(), F(Ft, {
              key: E.title,
              description: E.subtext,
              "data-search-entry": E.title,
              onClick: (V) => A(E)
            }, {
              default: j(() => [
                te(g(E.title) + g(E.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? w("", !0) : me(I.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : w("", !0)
      ]);
    };
  }
}, C4 = /* @__PURE__ */ U(M4, [["__scopeId", "data-v-8617b565"]]), E4 = {
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
    return (o, l) => (u(), F(C4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: j(() => [
        T($l, null, {
          default: j(() => [...l[2] || (l[2] = [
            te("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(D, null, ne(a, (i) => T(Ft, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (r) => e.tools.order.value = i.key
        }, {
          default: j(() => [
            te(g(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(D, { key: 0 }, [
          T($l, null, {
            default: j(() => [...l[3] || (l[3] = [
              te("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(D, null, ne(s, (i) => T(Ft, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (r) => e.tools.state.value = i.key
          }, {
            default: j(() => [
              te(g(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : w("", !0)
      ]),
      default: j(() => [
        me(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, IM = /* @__PURE__ */ U(E4, [["__scopeId", "data-v-9c2114d0"]]);
function RM() {
  const e = _(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const BM = (e) => import(
  /* @vite-ignore */
  e
), A4 = 86400, Ss = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function O4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ss(t) - Ss(e)) / A4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function LM(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ss(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: O4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Qa = 280, Xa = 240, Ja = 120, T4 = 6, I4 = 14, pn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function R4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Fr(e, t) {
  const n = Math.max(0, R4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function B4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${I4}px)` }), e.offsetHeight, e.style.transition = `height ${Qa}ms ${pn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Fr(t, e));
    const p = s() - i;
    if (!r && p >= Qa && (r = !0, e.style.transition = `opacity ${Xa}ms ease-out, transform ${Xa}ms ${pn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Qa + Xa) return a(h);
    d();
  };
  return a(h), d;
}
function NM(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${T4}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ja}ms ease-out, transform ${Ja}ms ${pn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Fr(t, e)), s() - l < Ja) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const L4 = 140, jn = 220, xl = 5;
function qM({ gap: e = L4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function r() {
    const d = n.splice(0, xl);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(r, e));
      });
  }
  const c = (d, h, p, y = B4) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: d, options: h, done: p, arrival: y, display: d.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(r, e));
    d.style.display = "none", n.push(b), n.length >= xl && c.flush();
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
function DM(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${jn}ms ${pn}, opacity ${jn}ms ease-in, margin ${jn}ms ${pn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, jn);
}
const Wr = "chat.pins.minimised", Gn = _(Qn(Wr, !1));
function Sl(e) {
  Gn.value = e, Ps(Wr, e);
}
function N4(e) {
  const t = C(() => e()), n = C(() => Gn.value ? [] : e()), a = () => Sl(!Gn.value), s = Date.now() / 1e3;
  return ve(
    () => t.value.filter((o) => Et(o) > s).length,
    (o, l) => o > l && Sl(!1)
  ), { pins: t, visible: n, minimised: Gn, toggle: a };
}
const q4 = ["title"], D4 = {
  key: 0,
  class: "pins-count"
}, P4 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = N4(() => t.pinRows);
    return (o, l) => B(n).length ? (u(), f("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: B(a), inline: e.inline }]),
      title: B(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...i) => B(s) && B(s)(...i), ["stop"]))
    }, [
      T(ge, {
        name: B(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      B(a) ? (u(), f("span", D4, g(B(n).length), 1)) : w("", !0)
    ], 10, q4)) : w("", !0);
  }
}, PM = /* @__PURE__ */ U(P4, [["__scopeId", "data-v-999f2559"]]), j4 = ["title"], F4 = ["title"], W4 = { class: "diff-card-dir" }, H4 = { class: "diff-card-name" }, z4 = ["title"], U4 = ["title"], G4 = {
  key: 0,
  class: "diff-card-note"
}, V4 = ["href"], K4 = ["src", "alt"], Y4 = { class: "diff-card-rows" }, Q4 = { class: "diff-row-num" }, X4 = { class: "diff-row-sign" }, J4 = { class: "diff-row-code" }, Z4 = {
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
    function o(M) {
      (M.metaKey || M.ctrlKey) && (M.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = C(() => n.path.lastIndexOf("/") + 1), c = C(() => n.path.slice(0, r.value)), d = C(() => n.path.slice(r.value)), h = C(() => n.change === "deleted"), p = C(() => l[n.change]), y = C(() => new Set(n.rows.filter((M) => M.line_type === "add").map((M) => M.line))), b = _("after"), A = C(() => b.value === "before" ? n.whole.old : n.whole.text), S = C(() => n.whole && n.whole.text !== void 0 ? A.value.split(`
`).map((M, k) => ({ line_type: b.value === "after" && y.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: M })) : n.rows.filter(
      (M) => !(n.editsOnly && ["ctx", "fold"].includes(M.line_type)) && !(n.hideRemovals && M.line_type === "del")
    )), $ = _(!1), I = C(() => n.lines && !$.value && !n.whole), H = C(() => I.value ? S.value.slice(0, n.lines) : S.value), N = C(() => S.value.length - H.value.length), E = (M) => M.line === null || M.line_type === "del" ? "" : M.line, V = (M) => M.line_type === "fold" ? M.hidden ? `⋯ ${M.hidden} lines` : "⋯" : M.text, W = _(null), q = _(null);
    let x = null;
    return _e(() => {
      if (!q.value) return;
      let M = !0;
      x = new ResizeObserver(() => {
        !W.value || !q.value || (W.value.style.transition = M ? "none" : "", W.value.style.height = `${q.value.offsetHeight}px`, M = !1);
      }), x.observe(q.value);
    }), Re(() => x && x.disconnect()), (M, k) => (u(), f("section", {
      class: Y(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (v) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${B(s)}-click to open it`,
          onClick: o
        }, [
          m("span", W4, g(c.value), 1),
          m("span", H4, g(d.value), 1),
          p.value ? (u(), f("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, g(p.value), 3)) : w("", !0)
        ], 8, F4),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + g(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + g(e.removed), 3),
        T(et, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = xe((v) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, g(b.value === "after" ? "After" : "Before"), 9, z4)) : w("", !0),
        h.value ? w("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = xe((v) => a("whole"), ["stop"]))
        }, [
          T(ge, {
            name: "file",
            size: 12
          })
        ], 10, U4))
      ], 8, j4),
      e.whole && e.whole.error ? (u(), f("p", G4, g(e.whole.error), 1)) : w("", !0),
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
          }, null, 8, K4)
        ], 8, V4)) : (u(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: W,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
            m("div", Y4, [
              (u(!0), f(D, null, ne(H.value, (v, R) => (u(), f("div", {
                key: R,
                class: Y(["diff-row", v.line_type, { fresh: e.fresh && v.edit === e.fresh }])
              }, [
                m("span", Q4, g(E(v)), 1),
                m("span", X4, g(i[v.line_type]), 1),
                m("span", J4, g(V(v)), 1)
              ], 2))), 128)),
              N.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = xe((v) => $.value = !0, ["stop"]))
              }, g(N.value) + " more " + g(N.value === 1 ? "line" : "lines"), 1)) : w("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : w("", !0)
    ], 2));
  }
}, jM = /* @__PURE__ */ U(Z4, [["__scopeId", "data-v-9c99c502"]]), ex = { "data-queue-controls": "" }, tx = { class: "counts" }, nx = { "data-queue-spots": "" }, ax = {
  class: "spots",
  "aria-label": "Places in use"
}, sx = { "data-queue-waiting": "" }, ox = { key: 0 }, lx = { class: "control" }, ix = { class: "stepper" }, rx = ["disabled"], ux = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, cx = ["disabled"], dx = ["for"], fx = ["id", "value", "disabled", "onChange"], hx = { class: "control" }, mx = ["aria-checked", "disabled"], px = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, vx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, gx = {
  key: 2,
  class: "note failure",
  role: "alert"
}, yx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _("");
    async function l(i, r) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(r)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, r) => (u(), f("div", ex, [
      T(Wt, { icon: "gauge" }, {
        default: j(() => [...r[3] || (r[3] = [
          te("Now", -1)
        ])]),
        _: 1
      }),
      m("div", tx, [
        m("div", null, [
          m("strong", nx, [
            te(g(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + g(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + g(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", ax, [
            (u(!0), f(D, null, ne(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", sx, g(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", ox, "The oldest goes first.")) : w("", !0)
        ])
      ]),
      m("div", lx, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", ix, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, rx),
          m("output", ux, g(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, cx)
        ])
      ]),
      (u(!0), f(D, null, ne(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, g(c.title), 9, dx),
          m("p", null, g(c.description), 1)
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
        }, null, 40, fx)
      ]))), 128)),
      m("div", hx, [
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
        ])], 8, mx)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", px, [
        T(ge, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = te("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", vx, [
        T(ge, {
          name: "pause",
          size: 13
        }),
        te("The queue is paused. No waiting command gets a place until it is resumed. " + g(e.queue.halt_reason), 1)
      ])) : w("", !0),
      o.value ? (u(), f("p", gx, g(o.value), 1)) : w("", !0)
    ]));
  }
}, bx = /* @__PURE__ */ U(yx, [["__scopeId", "data-v-39474ada"]]), kx = ["data-queue-row", "data-queue-process"], wx = ["aria-expanded"], $x = { class: "run-line" }, xx = { class: "leading" }, Sx = {
  key: 0,
  "data-queue-position": ""
}, _x = ["title"], Mx = { class: "command" }, Cx = {
  class: "time",
  "data-queue-time": ""
}, Ex = { class: "details" }, Ax = { "data-queue-type": "" }, Ox = { class: "failed" }, Tx = { class: "drop-inner" }, Ix = { class: "output" }, Rx = { class: "output-heading" }, Bx = ["href"], Lx = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(), o = Xi((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = Vs(), r = C(() => ({ test: "Test run", build: "Build", check: "Check", install: "Install" })[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = C(() => {
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
    return ve(() => n.expanded, h, { immediate: !0 }), kn(["output.*"], d), (p, y) => (u(), f("div", {
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
          y[3] || (y[3] = Ct(xe((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Ct(xe((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", $x, [
          m("span", xx, [
            e.run.section === "waiting" ? (u(), f("span", Sx, g(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, _x))
          ]),
          m("code", Mx, g(e.run.line), 1),
          m("span", Cx, g(c.value), 1),
          T(ge, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", Ex, [
          m("span", Ax, g(r.value), 1),
          e.run.owner_agent_id ? (u(), f(D, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = xe((b) => B(gt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + g(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), f(D, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : w("", !0),
          e.run.task_id ? (u(), f(D, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = xe((b) => B(gt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + g(e.run.task_id), 1)
          ], 64)) : w("", !0),
          e.run.state === "failed" ? (u(), f(D, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", Ox, "Failed, exit " + g(e.run.exit_code), 1)
          ], 64)) : w("", !0)
        ])
      ], 40, wx),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", Tx, [
          m("div", Ix, [
            m("div", Rx, [
              m("span", null, "Output " + g(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Bx)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && B(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              te(g(e.run.line), 1),
              B(l).length ? (u(), f(D, { key: 0 }, [
                te(g(`
` + B(l).join(`
`)), 1)
              ], 64)) : w("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, kx));
  }
}, Nx = /* @__PURE__ */ U(Lx, [["__scopeId", "data-v-4bb860be"]]), qx = {
  class: "process-queue",
  "data-test-queue": ""
}, Dx = { class: "scroll" }, Px = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, jx = ["data-queue-empty"], Za = 20, Fx = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _(null), a = _(""), s = _([]), o = _(Za), l = C(() => {
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
      ...y.rows.length ? y.rows.map((b, A) => ({ key: `run:${b.id}`, run: b, position: A + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
    ]) : []);
    function c(p) {
      s.value = s.value.includes(p) ? s.value.filter((y) => y !== p) : [...s.value, p];
    }
    async function d() {
      const p = ++i, y = await t.read(o.value === Za ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === i && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += Za, d();
    }
    return kn(["process.*", "setting.*"], d), _e(d), (p, y) => (u(), f("article", qx, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", Dx, [
        a.value ? (u(), f("p", Px, g(a.value), 1)) : w("", !0),
        n.value ? (u(), f(D, { key: 1 }, [
          T(bx, {
            queue: n.value,
            read: e.read,
            onSaved: d
          }, null, 8, ["queue", "read"]),
          T(Ms, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: j(() => [
              (u(!0), f(D, null, ne(r.value, (b) => (u(), f(D, {
                key: b.key
              }, [
                b.run ? (u(), F(Nx, {
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
                }, g(b.section.empty), 9, jx)) : (u(), F(Wt, {
                  key: 2,
                  icon: b.section.icon,
                  count: b.section.rows.length,
                  "data-queue-heading": b.section.type
                }, {
                  default: j(() => [
                    te(g(b.section.heading), 1)
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
        ], 64)) : a.value ? w("", !0) : (u(), F(Ye, { key: 2 }))
      ])
    ]));
  }
}, FM = /* @__PURE__ */ U(Fx, [["__scopeId", "data-v-7a1812f7"]]), Wx = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, Hx = ["aria-expanded"], zx = {
  class: "links-count",
  "data-inspector-links-count": ""
}, Ux = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, Gx = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, Vx = {
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
    const t = e, n = _(t.open), a = _(0), s = _(0), o = _("");
    let l = 0;
    async function i() {
      const r = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], d = await t.read(c);
      r === l && (o.value = d.ok ? "" : d.error, d.ok && (a.value = d.value.total), s.value += 1);
    }
    return ve(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), kn(["link.*", "phase.*", "phase_task.*"], i), (r, c) => (u(), f(D, null, [
      a.value ? (u(), f("section", Wx, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", zx, g(a.value), 1),
          T(pt, { open: n.value }, null, 8, ["open"])
        ], 8, Hx),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", Ux, [
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
      o.value ? (u(), f("p", Gx, g(o.value), 1)) : w("", !0)
    ], 64));
  }
}, Kx = /* @__PURE__ */ U(Vx, [["__scopeId", "data-v-4476d1c4"]]), Yx = ["placeholder"], Qx = { class: "actions" }, Xx = { class: "error" }, Jx = {
  key: 1,
  class: "card closed"
}, Zx = { class: "mark" }, e8 = { class: "prompt" }, t8 = {
  key: 0,
  class: "draft"
}, n8 = {
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
    const a = e, s = n, o = sn(e, "draft"), l = sn(e, "error"), i = _(!!l.value), r = _(!1), c = _(!1), d = _(null);
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
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(y, ["prevent"]),
        onKeydown: Ct(p, ["esc"])
      }, [
        me(b.$slots, "who", {}, void 0, !0),
        Ze(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": A[0] || (A[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: A[1] || (A[1] = Ct((S) => B(Li)(S, y), ["enter"]))
        }, null, 40, Yx), [
          [Kn, o.value]
        ]),
        m("div", Qx, [
          m("span", Xx, g(l.value), 1),
          T(pe, {
            small: "",
            onClick: p
          }, {
            default: j(() => [...A[3] || (A[3] = [
              te("Cancel", -1)
            ])]),
            _: 1
          }),
          T(pe, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: j(() => [...A[4] || (A[4] = [
              te("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", Jx, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", Zx, [
            T(ge, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", e8, g(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", t8, "Draft kept")) : w("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: A[2] || (A[2] = (S) => s("show"))
        }, [
          m("span", null, g(B(Jc)(e.count, "comment")), 1),
          T(ge, {
            name: "down",
            size: 12
          })
        ])) : w("", !0)
      ]))
    ], 2));
  }
}, a8 = /* @__PURE__ */ U(n8, [["__scopeId", "data-v-54460909"]]), s8 = { wide: 1130 }, o8 = /\{([A-Za-z_]\w*)\}/g;
function Vn(e, t, n = {}) {
  return e.replace(o8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const l8 = (e, t, n, a) => Vn(e.label, n, { row_id: a, id: a }) || Sw(t, n, a), i8 = { class: "comment-side-head" }, r8 = {
  key: 0,
  class: "comment-none"
}, u8 = { key: 0 }, c8 = {
  key: 1,
  class: "comment-none"
}, d8 = {
  class: "comment",
  "data-comment": ""
}, f8 = {
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
      class: Y(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      m("header", i8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        T(fa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", r8, "No comments yet")) : w("", !0),
      (u(!0), f(D, null, ne(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", u8, g(a.quote), 1)) : w("", !0),
        a.revision ? (u(), f("span", c8, "Revision " + g(a.revision), 1)) : w("", !0),
        m("p", d8, g(e.words(a)), 1)
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
}, _l = /* @__PURE__ */ U(f8, [["__scopeId", "data-v-798005b2"]]), h8 = { class: "resource-heading" }, m8 = { class: "resource-type" }, p8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, v8 = {
  key: 1,
  class: "resource-abstract"
}, g8 = {
  __name: "ResourceHeading",
  props: { label: String, title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", h8, [
      m("p", m8, g(e.label), 1),
      e.title ? (u(), f("h2", p8, g(e.title), 1)) : w("", !0),
      e.abstract ? (u(), f("p", v8, g(e.abstract), 1)) : w("", !0)
    ]));
  }
}, y8 = /* @__PURE__ */ U(g8, [["__scopeId", "data-v-25879552"]]), b8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, k8 = { class: "inspector-icons" }, w8 = { class: "inspector-icons-start" }, $8 = { class: "inspector-icons-end" }, x8 = ["href"], S8 = {
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
    return (i, r) => (u(), f("header", b8, [
      m("div", k8, [
        m("span", w8, [
          e.backed ? (u(), F(pe, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: r[0] || (r[0] = (c) => a("back"))
          }, {
            default: j(() => [
              T(ge, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : w("", !0),
          e.stepped ? (u(), f(D, { key: 1 }, [
            T(pe, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: r[1] || (r[1] = (c) => a("step", -1))
            }, {
              default: j(() => [
                T(ge, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            T(pe, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: r[2] || (r[2] = (c) => a("step", 1))
            }, {
              default: j(() => [
                T(ge, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : w("", !0)
        ]),
        m("span", $8, [
          e.embedded ? (u(), F(pe, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: r[3] || (r[3] = (c) => B(qe)(s.value))
          }, {
            default: j(() => [
              T(ge, {
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
            href: B(Nf)(s.value)
          }, [
            T(ge, {
              name: "share",
              size: 13
            })
          ], 8, x8)) : w("", !0),
          e.embedded ? w("", !0) : (u(), F(pe, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: r[4] || (r[4] = (c) => a("close"))
          }, {
            default: j(() => [
              T(ge, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      T(y8, {
        label: e.label,
        title: e.title,
        abstract: e.description
      }, null, 8, ["label", "title", "abstract"])
    ]));
  }
}, _8 = /* @__PURE__ */ U(S8, [["__scopeId", "data-v-b4459543"]]), M8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, C8 = { class: "field-name" }, E8 = {
  key: 1,
  class: "field-value"
}, A8 = ["onClick"], O8 = {
  key: 2,
  class: "field-value"
}, T8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", M8, [
      (u(!0), f(D, null, ne(e.fields, (o) => (u(), f(D, {
        key: o.name
      }, [
        m("p", C8, g(o.label), 1),
        o.isTime ? (u(), F(et, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", E8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, g(o.value), 9, A8)
        ])) : (u(), f("p", O8, g(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, I8 = /* @__PURE__ */ U(T8, [["__scopeId", "data-v-0a2f112b"]]);
async function R8(e, t) {
  const n = await e(["agent", "show", String(t.agent_id)]);
  return n.ok ? Mw(t, n.value) : "";
}
async function B8(e, t) {
  const n = await e(["actor", "show", String(t)]), a = n.ok && n.value.type === "agent" ? await e(["agent", "show", String(t)]) : { ok: !1 };
  return n.ok ? _w(n.value, a.ok ? a.value : null) : "";
}
const L8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, N8 = {
  key: 1,
  class: "inspector-wait"
}, q8 = { class: "inspector-main" }, D8 = { class: "inspector-column" }, P8 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, j8 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, F8 = { class: "inspector-text" }, W8 = ["innerHTML"], H8 = {
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
      lists_fields: !0
    }), l = _(null), i = _(""), r = _(""), c = _(""), d = _("details"), h = _(null), p = _(0);
    let y = 0;
    const b = C(() => ({ row_id: n.id, id: n.id })), A = C(() => l.value ? Vn(o.value.title, l.value, b.value) || xw(n.noun, l.value, n.id) : ""), S = C(() => l.value ? l8(o.value, n.noun, l.value, n.id) : ""), $ = C(() => S.value === A.value ? "" : S.value), I = C(() => l.value ? Vn(o.value.description, l.value, b.value) : ""), H = C(() => {
      var L, P, J;
      return ((L = l.value) == null ? void 0 : L.body) || ((P = l.value) == null ? void 0 : P.brief) || (s.has(n.noun) ? (J = l.value) == null ? void 0 : J.text : "") || "";
    }), N = C(() => H.value ? Fs(H.value, { env: "", rowNames: !1 }) : ""), E = C(() => Cw(l.value, H.value, i.value, r.value)), V = C(() => o.value.comments && p.value >= s8.wide), W = C(() => o.value.comments && !V.value), q = (L) => o.value.components.filter((P) => (P.tab || "") === L).map((P) => P.window), x = C(() => [...new Set(o.value.components.map((L) => L.tab).filter(Boolean))]), M = C(() => x.value.length || W.value ? [{ key: "details", label: "Details" }, ...x.value.map((L) => ({ key: L, label: L })), ...W.value ? [{ key: "comments", label: "Comments" }] : []] : []), k = Fi(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (L) => n.read(L));
    async function v(L, P) {
      const J = await P;
      return L === y ? J : "";
    }
    async function R() {
      const L = ++y, P = await n.read(Vn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      L === y && (c.value = P.ok ? "" : P.error, P.ok && (l.value = P.value, l.value.creator_id && (i.value = await v(L, B8(n.read, l.value.creator_id))), l.value.agent_id && (r.value = await v(L, R8(n.read, l.value)))));
    }
    ve(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", R();
    }, { immediate: !0 }), kn(o.value.events, R), ve(k.open, (L) => L && W.value && (d.value = "comments"));
    let O = null;
    return _e(() => {
      var L;
      p.value = ((L = h.value) == null ? void 0 : L.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (O = new ResizeObserver(() => p.value = h.value.clientWidth), O.observe(h.value));
    }), Re(() => O == null ? void 0 : O.disconnect()), (L, P) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      T(_8, {
        label: $.value,
        title: A.value,
        description: I.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.noun}s`, id: e.id },
        onClose: P[0] || (P[0] = (J) => a("close")),
        onBack: P[1] || (P[1] = (J) => a("back")),
        onStep: P[2] || (P[2] = (J) => a("step", J))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (u(), f("p", L8, g(c.value), 1)) : l.value ? (u(), f(D, { key: 2 }, [
        T(Ki, null, {
          default: j(() => [
            T(Ds, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: R
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", q8, [
          m("div", D8, [
            M.value.length ? (u(), f("div", P8, [
              T(jt, {
                options: M.value,
                value: d.value,
                onPick: P[3] || (P[3] = (J) => d.value = J)
              }, null, 8, ["options", "value"])
            ])) : w("", !0),
            m("div", j8, [
              T(Gt, { value: d.value }, {
                details: j(() => [
                  m("div", F8, [
                    N.value ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, W8)) : w("", !0),
                    o.value.lists_fields ? (u(), F(I8, {
                      key: 1,
                      fields: E.value,
                      onPeek: P[4] || (P[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : w("", !0)
                  ]),
                  T(hs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  T(_l, {
                    below: "",
                    comments: B(k).comments.value,
                    words: B(k).words,
                    more: !!B(k).nextPage.value,
                    loading: B(k).loading.value,
                    failure: B(k).failure.value,
                    onMore: B(k).loadMore,
                    onClose: P[5] || (P[5] = (J) => d.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: j(() => [
                  T(hs, {
                    names: q(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), F(Kx, {
                key: 0,
                model: e.noun,
                id: e.id,
                read: e.read,
                kinds: o.value.links.kinds,
                open: o.value.links.open,
                "outside-plan": o.value.links.outside_plan,
                "page-size": o.value.links.page_size,
                onOpen: P[6] || (P[6] = (J) => a("open", J))
              }, null, 8, ["model", "id", "read", "kinds", "open", "outside-plan", "page-size"])) : w("", !0)
            ]),
            o.value.comments ? (u(), F(a8, {
              key: 1,
              send: B(k).send,
              count: B(k).total.value,
              onShow: P[7] || (P[7] = (J) => W.value && (d.value = "comments"))
            }, null, 8, ["send", "count"])) : w("", !0)
          ]),
          V.value ? (u(), F(_l, {
            key: 0,
            comments: B(k).comments.value,
            words: B(k).words,
            more: !!B(k).nextPage.value,
            loading: B(k).loading.value,
            failure: B(k).failure.value,
            onMore: B(k).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : w("", !0)
        ])
      ], 64)) : (u(), f("div", N8, [
        T(Ye)
      ]))
    ], 512));
  }
}, z8 = /* @__PURE__ */ U(H8, [["__scopeId", "data-v-3a0c8a17"]]), WM = {
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
    const t = Ee(Ls);
    return (n, a) => (u(), F(z8, De(n.$props, {
      catalogue: B(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, U8 = { class: "facts" }, G8 = { class: "fact wide" }, V8 = ["title"], K8 = {
  key: 1,
  class: "fact-value"
}, Y8 = {
  key: 0,
  class: "fact"
}, Q8 = { class: "fact-value" }, X8 = { class: "fact" }, J8 = { class: "fact-label" }, Z8 = ["title"], e3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, t3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, n3 = {
  key: 2,
  class: "fact"
}, a3 = { class: "fact-value" }, s3 = { class: "fact wide" }, o3 = { class: "fact-label" }, l3 = { class: "fact wide" }, i3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, r3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ta.map(({ key: i, label: r }) => ({ key: String(i), label: r })), a = [1, 2, 3, 4, 5].map((i) => ({ key: String(i), label: String(i) })), s = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], o = t, l = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (i, r) => {
      var c, d;
      return u(), f("div", U8, [
        m("div", G8, [
          r[4] || (r[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (c = e.place) != null && c.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (h) => B(qe)(`plans:${e.place.plan_id}`))
          }, "Plan " + g(e.place.plan_id) + ": " + g(e.place.plan_title), 9, V8)) : (u(), f("span", K8, "Not in a plan"))
        ]),
        ((d = e.place) == null ? void 0 : d.phase_total) > 1 ? (u(), f("div", Y8, [
          r[5] || (r[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", Q8, g(e.place.phase_number) + " of " + g(e.place.phase_total) + ": " + g(e.place.phase_title), 1)
        ])) : w("", !0),
        e.task.helper_id ? (u(), f(D, { key: 1 }, [
          m("div", X8, [
            m("span", J8, g(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (h) => B(qe)(`agents:${e.task.helper_id}`))
            }, g(e.task.helper_name), 9, Z8)
          ]),
          B(l).has(e.task.state) ? (u(), f("p", e3, g(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", t3, g(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : w("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", n3, [
          r[6] || (r[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", a3, "Agent " + g(e.task.holder_id), 1)
        ])) : w("", !0),
        m("div", s3, [
          m("span", o3, [
            r[7] || (r[7] = te(" Complexity ", -1)),
            T(ti, {
              lines: s.map((h, p) => `${p + 1}: ${h}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          T(jt, {
            options: B(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (h) => o("complexity", h))
          }, null, 8, ["options", "value"])
        ]),
        m("div", l3, [
          r[8] || (r[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          T(jt, {
            options: B(n),
            value: String(B(Vi)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (h) => o("priority", h))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", i3, g(e.refusal), 1)) : w("", !0)
        ])
      ]);
    };
  }
}, u3 = /* @__PURE__ */ U(r3, [["__scopeId", "data-v-d1ba1a48"]]);
function c3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
  return { above: o.reverse(), below: l };
}
const d3 = { class: "number" }, f3 = { class: "title" }, h3 = { class: "word" }, m3 = {
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
    return (a, s) => (u(), F(bt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        T(bn, { status: e.status }, null, 8, ["status"]),
        m("span", d3, g(e.number), 1),
        m("span", f3, g(e.title), 1),
        m("span", h3, g(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, es = /* @__PURE__ */ U(m3, [["__scopeId", "data-v-3148246d"]]), p3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, v3 = { class: "level" }, g3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1);
    ve(() => n.task.id, () => s.value = !1);
    const o = C(() => c3(n.task.id, n.graph)), l = C(() => s.value ? o.value.above : o.value.above.slice(-1)), i = C(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = C(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, p = !1) => ({ status: un(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), f("section", p3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(D, null, ne(l.value, (y) => (u(), f(D, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", v3, [
          (u(!0), f(D, null, ne(y, (b) => (u(), F(es, De({
            key: b.id,
            ref_for: !0
          }, d(b), {
            onSelect: p[0] || (p[0] = (A) => a("select", A))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      T(es, nu(au(d(e.task, !0))), null, 16),
      (u(!0), f(D, null, ne(i.value, (y) => (u(), f(D, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        T(es, De({ ref_for: !0 }, d(y), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      r.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, g(s.value ? "Show less" : `Show the whole chain (${r.value} more)`), 1)) : w("", !0)
    ])) : w("", !0);
  }
}, y3 = /* @__PURE__ */ U(g3, [["__scopeId", "data-v-b46a0452"]]), b3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, k3 = ["datetime"], w3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", b3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(D, null, ne(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, g(new Date(a.created_at).toLocaleString()), 9, k3),
        m("p", null, g(a.reason), 1)
      ]))), 128))
    ])) : w("", !0);
  }
}, $3 = /* @__PURE__ */ U(w3, [["__scopeId", "data-v-3019b030"]]), x3 = {
  class: "part",
  "data-resource-waits": ""
}, S3 = ["onClick"], _3 = { class: "wait-id" }, M3 = { class: "wait-title" }, C3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", x3, [
      m("h4", null, g(e.title), 1),
      (u(!0), f(D, null, ne(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        T(bn, {
          status: B(un)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", _3, g(o.id), 1),
        m("span", M3, g(o.title), 1)
      ], 8, S3))), 128))
    ]));
  }
}, Ml = /* @__PURE__ */ U(C3, [["__scopeId", "data-v-96a767b5"]]), E3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, A3 = { class: "text" }, O3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, T3 = 180, I3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = _(!1), l = C(() => a.task.waits.filter((r) => !n.has(r.state))), i = C(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(D, null, [
      l.value.length ? (u(), F(Ml, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : w("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", E3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", A3, g(e.task.outcome), 1)
      ])) : w("", !0),
      e.task.brief ? (u(), f("section", O3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, g(e.task.brief), 3),
        e.task.brief.length > T3 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : w("", !0)
      ])) : w("", !0),
      i.value.length ? (u(), F(Ml, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : w("", !0)
    ], 64));
  }
}, R3 = /* @__PURE__ */ U(I3, [["__scopeId", "data-v-b628bea5"]]), B3 = {
  class: "task-details",
  "data-task-details": ""
}, L3 = { class: "since" }, N3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, q3 = { class: "text" }, D3 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, P3 = {
  key: 1,
  class: "note"
}, j3 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, F3 = { class: "text" }, W3 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", B3, [
        m("div", {
          class: Y(["state-line", B(un)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            T(bn, {
              status: B(un)(e.task.state)
            }, null, 8, ["status"]),
            te(" " + g(a(e.task.state)), 1)
          ]),
          m("span", L3, [
            o[5] || (o[5] = te(" since ", -1)),
            T(et, {
              at: B(mh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", N3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", q3, g(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", D3, "Opens by itself when " + g(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", P3, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", j3, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", F3, g(e.task.reason), 1)
        ])) : w("", !0),
        e.graph ? (u(), F(y3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : w("", !0),
        T(u3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        T(R3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        T($3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, HM = /* @__PURE__ */ U(W3, [["__scopeId", "data-v-4f92171e"]]), H3 = 50, z3 = { messages: 25 }, U3 = (e) => z3[e] || H3, G3 = {
  class: "task-log",
  "aria-label": "Task log"
}, V3 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, K3 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Y3 = { class: "entries" }, Q3 = ["data-task-log-important"], X3 = ["datetime"], J3 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Z3 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = _([]), a = _(1), s = _(!0), o = _(!0), l = _("");
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
        String(U3("task_logs")),
        "--page",
        String(c)
      ]);
      d === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return ve(
      () => [t.id, t.changes],
      () => {
        n.value = [], r();
      },
      { immediate: !0 }
    ), Ke(() => {
      i += 1;
    }), (c, d) => (u(), f("section", G3, [
      o.value ? (u(), F(Ye, { key: 0 })) : l.value ? (u(), f(D, { key: 1 }, [
        m("p", V3, g(l.value), 1),
        T(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => r(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(D, { key: 2 }, [
        n.value.length ? w("", !0) : (u(), f("p", K3, "No log entries yet.")),
        m("ol", Y3, [
          (u(!0), f(D, null, ne(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, g(new Date(h.created_at).toLocaleString()), 9, X3),
            m("p", null, g(h.line), 1)
          ], 10, Q3))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", J3, [
          T(pe, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => r(a.value - 1))
          }, {
            default: j(() => [...d[4] || (d[4] = [
              te("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + g(a.value), 1),
          T(pe, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => r(a.value + 1))
          }, {
            default: j(() => [...d[5] || (d[5] = [
              te("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : w("", !0)
      ], 64))
    ]));
  }
}, zM = /* @__PURE__ */ U(Z3, [["__scopeId", "data-v-bd886dcf"]]);
function eS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ts = { exports: {} }, Cl;
function tS() {
  return Cl || (Cl = 1, (function(e, t) {
    var n = (function() {
      var a = function(E, V) {
        var W = 236, q = 17, x = E, M = o[V], k = null, v = 0, R = null, O = [], L = {}, P = function(K, Q) {
          v = x * 4 + 17, k = (function(G) {
            for (var X = new Array(G), Z = 0; Z < G; Z += 1) {
              X[Z] = new Array(G);
              for (var oe = 0; oe < G; oe += 1)
                X[Z][oe] = null;
            }
            return X;
          })(v), J(0, 0), J(v - 7, 0), J(0, v - 7), ae(), se(), fe(K, Q), x >= 7 && ye(K), R == null && (R = ie(x, M, O)), ee(R, Q);
        }, J = function(K, Q) {
          for (var G = -1; G <= 7; G += 1)
            if (!(K + G <= -1 || v <= K + G))
              for (var X = -1; X <= 7; X += 1)
                Q + X <= -1 || v <= Q + X || (0 <= G && G <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= X && X <= 4 ? k[K + G][Q + X] = !0 : k[K + G][Q + X] = !1);
        }, z = function() {
          for (var K = 0, Q = 0, G = 0; G < 8; G += 1) {
            P(!0, G);
            var X = i.getLostPoint(L);
            (G == 0 || K > X) && (K = X, Q = G);
          }
          return Q;
        }, se = function() {
          for (var K = 8; K < v - 8; K += 1)
            k[K][6] == null && (k[K][6] = K % 2 == 0);
          for (var Q = 8; Q < v - 8; Q += 1)
            k[6][Q] == null && (k[6][Q] = Q % 2 == 0);
        }, ae = function() {
          for (var K = i.getPatternPosition(x), Q = 0; Q < K.length; Q += 1)
            for (var G = 0; G < K.length; G += 1) {
              var X = K[Q], Z = K[G];
              if (k[X][Z] == null)
                for (var oe = -2; oe <= 2; oe += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    oe == -2 || oe == 2 || ce == -2 || ce == 2 || oe == 0 && ce == 0 ? k[X + oe][Z + ce] = !0 : k[X + oe][Z + ce] = !1;
            }
        }, ye = function(K) {
          for (var Q = i.getBCHTypeNumber(x), G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            k[Math.floor(G / 3)][G % 3 + v - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            k[G % 3 + v - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, fe = function(K, Q) {
          for (var G = M << 3 | Q, X = i.getBCHTypeInfo(G), Z = 0; Z < 15; Z += 1) {
            var oe = !K && (X >> Z & 1) == 1;
            Z < 6 ? k[Z][8] = oe : Z < 8 ? k[Z + 1][8] = oe : k[v - 15 + Z][8] = oe;
          }
          for (var Z = 0; Z < 15; Z += 1) {
            var oe = !K && (X >> Z & 1) == 1;
            Z < 8 ? k[8][v - Z - 1] = oe : Z < 9 ? k[8][15 - Z - 1 + 1] = oe : k[8][15 - Z - 1] = oe;
          }
          k[v - 8][8] = !K;
        }, ee = function(K, Q) {
          for (var G = -1, X = v - 1, Z = 7, oe = 0, ce = i.getMaskFunction(Q), ue = v - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var Se = 0; Se < 2; Se += 1)
                if (k[X][ue - Se] == null) {
                  var Ae = !1;
                  oe < K.length && (Ae = (K[oe] >>> Z & 1) == 1);
                  var he = ce(X, ue - Se);
                  he && (Ae = !Ae), k[X][ue - Se] = Ae, Z -= 1, Z == -1 && (oe += 1, Z = 7);
                }
              if (X += G, X < 0 || v <= X) {
                X -= G, G = -G;
                break;
              }
            }
        }, le = function(K, Q) {
          for (var G = 0, X = 0, Z = 0, oe = new Array(Q.length), ce = new Array(Q.length), ue = 0; ue < Q.length; ue += 1) {
            var Se = Q[ue].dataCount, Ae = Q[ue].totalCount - Se;
            X = Math.max(X, Se), Z = Math.max(Z, Ae), oe[ue] = new Array(Se);
            for (var he = 0; he < oe[ue].length; he += 1)
              oe[ue][he] = 255 & K.getBuffer()[he + G];
            G += Se;
            var Fe = i.getErrorCorrectPolynomial(Ae), We = c(oe[ue], Fe.getLength() - 1), lo = We.mod(Fe);
            ce[ue] = new Array(Fe.getLength() - 1);
            for (var he = 0; he < ce[ue].length; he += 1) {
              var io = he + lo.getLength() - ce[ue].length;
              ce[ue][he] = io >= 0 ? lo.getAt(io) : 0;
            }
          }
          for (var ro = 0, he = 0; he < Q.length; he += 1)
            ro += Q[he].totalCount;
          for (var wa = new Array(ro), Mn = 0, he = 0; he < X; he += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              he < oe[ue].length && (wa[Mn] = oe[ue][he], Mn += 1);
          for (var he = 0; he < Z; he += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              he < ce[ue].length && (wa[Mn] = ce[ue][he], Mn += 1);
          return wa;
        }, ie = function(K, Q, G) {
          for (var X = d.getRSBlocks(K, Q), Z = h(), oe = 0; oe < G.length; oe += 1) {
            var ce = G[oe];
            Z.put(ce.getMode(), 4), Z.put(ce.getLength(), i.getLengthInBits(ce.getMode(), K)), ce.write(Z);
          }
          for (var ue = 0, oe = 0; oe < X.length; oe += 1)
            ue += X[oe].dataCount;
          if (Z.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + Z.getLengthInBits() + ">" + ue * 8 + ")";
          for (Z.getLengthInBits() + 4 <= ue * 8 && Z.put(0, 4); Z.getLengthInBits() % 8 != 0; )
            Z.putBit(!1);
          for (; !(Z.getLengthInBits() >= ue * 8 || (Z.put(W, 8), Z.getLengthInBits() >= ue * 8)); )
            Z.put(q, 8);
          return le(Z, X);
        };
        L.addData = function(K, Q) {
          Q = Q || "Byte";
          var G = null;
          switch (Q) {
            case "Numeric":
              G = p(K);
              break;
            case "Alphanumeric":
              G = y(K);
              break;
            case "Byte":
              G = b(K);
              break;
            case "Kanji":
              G = A(K);
              break;
            default:
              throw "mode:" + Q;
          }
          O.push(G), R = null;
        }, L.isDark = function(K, Q) {
          if (K < 0 || v <= K || Q < 0 || v <= Q)
            throw K + "," + Q;
          return k[K][Q];
        }, L.getModuleCount = function() {
          return v;
        }, L.make = function() {
          if (x < 1) {
            for (var K = 1; K < 40; K++) {
              for (var Q = d.getRSBlocks(K, M), G = h(), X = 0; X < O.length; X++) {
                var Z = O[X];
                G.put(Z.getMode(), 4), G.put(Z.getLength(), i.getLengthInBits(Z.getMode(), K)), Z.write(G);
              }
              for (var oe = 0, X = 0; X < Q.length; X++)
                oe += Q[X].dataCount;
              if (G.getLengthInBits() <= oe * 8)
                break;
            }
            x = K;
          }
          P(!1, z());
        }, L.createTableTag = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var G = "";
          G += '<table style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: " + Q + "px;", G += '">', G += "<tbody>";
          for (var X = 0; X < L.getModuleCount(); X += 1) {
            G += "<tr>";
            for (var Z = 0; Z < L.getModuleCount(); Z += 1)
              G += '<td style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: 0px;", G += " width: " + K + "px;", G += " height: " + K + "px;", G += " background-color: ", G += L.isDark(X, Z) ? "#000000" : "#ffffff", G += ";", G += '"/>';
            G += "</tr>";
          }
          return G += "</tbody>", G += "</table>", G;
        }, L.createSvgTag = function(K, Q, G, X) {
          var Z = {};
          typeof arguments[0] == "object" && (Z = arguments[0], K = Z.cellSize, Q = Z.margin, G = Z.alt, X = Z.title), K = K || 2, Q = typeof Q > "u" ? K * 4 : Q, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-description" : null, X = typeof X == "string" ? { text: X } : X || {}, X.text = X.text || null, X.id = X.text ? X.id || "qrcode-title" : null;
          var oe = L.getModuleCount() * K + Q * 2, ce, ue, Se, Ae, he = "", Fe;
          for (Fe = "l" + K + ",0 0," + K + " -" + K + ",0 0,-" + K + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += Z.scalable ? "" : ' width="' + oe + 'px" height="' + oe + 'px"', he += ' viewBox="0 0 ' + oe + " " + oe + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += X.text || G.text ? ' role="img" aria-labelledby="' + tt([X.id, G.id].join(" ").trim()) + '"' : "", he += ">", he += X.text ? '<title id="' + tt(X.id) + '">' + tt(X.text) + "</title>" : "", he += G.text ? '<description id="' + tt(G.id) + '">' + tt(G.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', Se = 0; Se < L.getModuleCount(); Se += 1)
            for (Ae = Se * K + Q, ce = 0; ce < L.getModuleCount(); ce += 1)
              L.isDark(Se, ce) && (ue = ce * K + Q, he += "M" + ue + "," + Ae + Fe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, L.createDataURL = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var G = L.getModuleCount() * K + Q * 2, X = Q, Z = G - Q;
          return N(G, G, function(oe, ce) {
            if (X <= oe && oe < Z && X <= ce && ce < Z) {
              var ue = Math.floor((oe - X) / K), Se = Math.floor((ce - X) / K);
              return L.isDark(Se, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(K, Q, G) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var X = L.getModuleCount() * K + Q * 2, Z = "";
          return Z += "<img", Z += ' src="', Z += L.createDataURL(K, Q), Z += '"', Z += ' width="', Z += X, Z += '"', Z += ' height="', Z += X, Z += '"', G && (Z += ' alt="', Z += tt(G), Z += '"'), Z += "/>", Z;
        };
        var tt = function(K) {
          for (var Q = "", G = 0; G < K.length; G += 1) {
            var X = K.charAt(G);
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
        }, Hr = function(K) {
          var Q = 1;
          K = typeof K > "u" ? Q * 2 : K;
          var G = L.getModuleCount() * Q + K * 2, X = K, Z = G - K, oe, ce, ue, Se, Ae, he = {
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
          for (oe = 0; oe < G; oe += 2) {
            for (ue = Math.floor((oe - X) / Q), Se = Math.floor((oe + 1 - X) / Q), ce = 0; ce < G; ce += 1)
              Ae = "█", X <= ce && ce < Z && X <= oe && oe < Z && L.isDark(ue, Math.floor((ce - X) / Q)) && (Ae = " "), X <= ce && ce < Z && X <= oe + 1 && oe + 1 < Z && L.isDark(Se, Math.floor((ce - X) / Q)) ? Ae += " " : Ae += "█", We += K < 1 && oe + 1 >= Z ? Fe[Ae] : he[Ae];
            We += `
`;
          }
          return G % 2 && K > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return L.createASCII = function(K, Q) {
          if (K = K || 1, K < 2)
            return Hr(Q);
          K -= 1, Q = typeof Q > "u" ? K * 2 : Q;
          var G = L.getModuleCount() * K + Q * 2, X = Q, Z = G - Q, oe, ce, ue, Se, Ae = Array(K + 1).join("██"), he = Array(K + 1).join("  "), Fe = "", We = "";
          for (oe = 0; oe < G; oe += 1) {
            for (ue = Math.floor((oe - X) / K), We = "", ce = 0; ce < G; ce += 1)
              Se = 1, X <= ce && ce < Z && X <= oe && oe < Z && L.isDark(ue, Math.floor((ce - X) / K)) && (Se = 0), We += Se ? Ae : he;
            for (ue = 0; ue < K; ue += 1)
              Fe += We + `
`;
          }
          return Fe.substring(0, Fe.length - 1);
        }, L.renderTo2dContext = function(K, Q) {
          Q = Q || 2;
          for (var G = L.getModuleCount(), X = 0; X < G; X++)
            for (var Z = 0; Z < G; Z++)
              K.fillStyle = L.isDark(X, Z) ? "black" : "white", K.fillRect(X * Q, Z * Q, Q, Q);
        }, L;
      };
      a.stringToBytesFuncs = {
        default: function(E) {
          for (var V = [], W = 0; W < E.length; W += 1) {
            var q = E.charCodeAt(W);
            V.push(q & 255);
          }
          return V;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(E, V) {
        var W = (function() {
          for (var x = I(E), M = function() {
            var se = x.read();
            if (se == -1) throw "eof";
            return se;
          }, k = 0, v = {}; ; ) {
            var R = x.read();
            if (R == -1) break;
            var O = M(), L = M(), P = M(), J = String.fromCharCode(R << 8 | O), z = L << 8 | P;
            v[J] = z, k += 1;
          }
          if (k != V)
            throw k + " != " + V;
          return v;
        })(), q = 63;
        return function(x) {
          for (var M = [], k = 0; k < x.length; k += 1) {
            var v = x.charCodeAt(k);
            if (v < 128)
              M.push(v);
            else {
              var R = W[x.charAt(k)];
              typeof R == "number" ? (R & 255) == R ? M.push(R) : (M.push(R >>> 8), M.push(R & 255)) : M.push(q);
            }
          }
          return M;
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
        var E = [
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
        ], V = 1335, W = 7973, q = 21522, x = {}, M = function(k) {
          for (var v = 0; k != 0; )
            v += 1, k >>>= 1;
          return v;
        };
        return x.getBCHTypeInfo = function(k) {
          for (var v = k << 10; M(v) - M(V) >= 0; )
            v ^= V << M(v) - M(V);
          return (k << 10 | v) ^ q;
        }, x.getBCHTypeNumber = function(k) {
          for (var v = k << 12; M(v) - M(W) >= 0; )
            v ^= W << M(v) - M(W);
          return k << 12 | v;
        }, x.getPatternPosition = function(k) {
          return E[k - 1];
        }, x.getMaskFunction = function(k) {
          switch (k) {
            case l.PATTERN000:
              return function(v, R) {
                return (v + R) % 2 == 0;
              };
            case l.PATTERN001:
              return function(v, R) {
                return v % 2 == 0;
              };
            case l.PATTERN010:
              return function(v, R) {
                return R % 3 == 0;
              };
            case l.PATTERN011:
              return function(v, R) {
                return (v + R) % 3 == 0;
              };
            case l.PATTERN100:
              return function(v, R) {
                return (Math.floor(v / 2) + Math.floor(R / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(v, R) {
                return v * R % 2 + v * R % 3 == 0;
              };
            case l.PATTERN110:
              return function(v, R) {
                return (v * R % 2 + v * R % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(v, R) {
                return (v * R % 3 + (v + R) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, x.getErrorCorrectPolynomial = function(k) {
          for (var v = c([1], 0), R = 0; R < k; R += 1)
            v = v.multiply(c([1, r.gexp(R)], 0));
          return v;
        }, x.getLengthInBits = function(k, v) {
          if (1 <= v && v < 10)
            switch (k) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + k;
            }
          else if (v < 27)
            switch (k) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + k;
            }
          else if (v < 41)
            switch (k) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + k;
            }
          else
            throw "type:" + v;
        }, x.getLostPoint = function(k) {
          for (var v = k.getModuleCount(), R = 0, O = 0; O < v; O += 1)
            for (var L = 0; L < v; L += 1) {
              for (var P = 0, J = k.isDark(O, L), z = -1; z <= 1; z += 1)
                if (!(O + z < 0 || v <= O + z))
                  for (var se = -1; se <= 1; se += 1)
                    L + se < 0 || v <= L + se || z == 0 && se == 0 || J == k.isDark(O + z, L + se) && (P += 1);
              P > 5 && (R += 3 + P - 5);
            }
          for (var O = 0; O < v - 1; O += 1)
            for (var L = 0; L < v - 1; L += 1) {
              var ae = 0;
              k.isDark(O, L) && (ae += 1), k.isDark(O + 1, L) && (ae += 1), k.isDark(O, L + 1) && (ae += 1), k.isDark(O + 1, L + 1) && (ae += 1), (ae == 0 || ae == 4) && (R += 3);
            }
          for (var O = 0; O < v; O += 1)
            for (var L = 0; L < v - 6; L += 1)
              k.isDark(O, L) && !k.isDark(O, L + 1) && k.isDark(O, L + 2) && k.isDark(O, L + 3) && k.isDark(O, L + 4) && !k.isDark(O, L + 5) && k.isDark(O, L + 6) && (R += 40);
          for (var L = 0; L < v; L += 1)
            for (var O = 0; O < v - 6; O += 1)
              k.isDark(O, L) && !k.isDark(O + 1, L) && k.isDark(O + 2, L) && k.isDark(O + 3, L) && k.isDark(O + 4, L) && !k.isDark(O + 5, L) && k.isDark(O + 6, L) && (R += 40);
          for (var ye = 0, L = 0; L < v; L += 1)
            for (var O = 0; O < v; O += 1)
              k.isDark(O, L) && (ye += 1);
          var fe = Math.abs(100 * ye / v / v - 50) / 5;
          return R += fe * 10, R;
        }, x;
      })(), r = (function() {
        for (var E = new Array(256), V = new Array(256), W = 0; W < 8; W += 1)
          E[W] = 1 << W;
        for (var W = 8; W < 256; W += 1)
          E[W] = E[W - 4] ^ E[W - 5] ^ E[W - 6] ^ E[W - 8];
        for (var W = 0; W < 255; W += 1)
          V[E[W]] = W;
        var q = {};
        return q.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return V[x];
        }, q.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return E[x];
        }, q;
      })();
      function c(E, V) {
        if (typeof E.length > "u")
          throw E.length + "/" + V;
        var W = (function() {
          for (var x = 0; x < E.length && E[x] == 0; )
            x += 1;
          for (var M = new Array(E.length - x + V), k = 0; k < E.length - x; k += 1)
            M[k] = E[k + x];
          return M;
        })(), q = {};
        return q.getAt = function(x) {
          return W[x];
        }, q.getLength = function() {
          return W.length;
        }, q.multiply = function(x) {
          for (var M = new Array(q.getLength() + x.getLength() - 1), k = 0; k < q.getLength(); k += 1)
            for (var v = 0; v < x.getLength(); v += 1)
              M[k + v] ^= r.gexp(r.glog(q.getAt(k)) + r.glog(x.getAt(v)));
          return c(M, 0);
        }, q.mod = function(x) {
          if (q.getLength() - x.getLength() < 0)
            return q;
          for (var M = r.glog(q.getAt(0)) - r.glog(x.getAt(0)), k = new Array(q.getLength()), v = 0; v < q.getLength(); v += 1)
            k[v] = q.getAt(v);
          for (var v = 0; v < x.getLength(); v += 1)
            k[v] ^= r.gexp(r.glog(x.getAt(v)) + M);
          return c(k, 0).mod(x);
        }, q;
      }
      var d = (function() {
        var E = [
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
        ], V = function(x, M) {
          var k = {};
          return k.totalCount = x, k.dataCount = M, k;
        }, W = {}, q = function(x, M) {
          switch (M) {
            case o.L:
              return E[(x - 1) * 4 + 0];
            case o.M:
              return E[(x - 1) * 4 + 1];
            case o.Q:
              return E[(x - 1) * 4 + 2];
            case o.H:
              return E[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return W.getRSBlocks = function(x, M) {
          var k = q(x, M);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + M;
          for (var v = k.length / 3, R = [], O = 0; O < v; O += 1)
            for (var L = k[O * 3 + 0], P = k[O * 3 + 1], J = k[O * 3 + 2], z = 0; z < L; z += 1)
              R.push(V(P, J));
          return R;
        }, W;
      })(), h = function() {
        var E = [], V = 0, W = {};
        return W.getBuffer = function() {
          return E;
        }, W.getAt = function(q) {
          var x = Math.floor(q / 8);
          return (E[x] >>> 7 - q % 8 & 1) == 1;
        }, W.put = function(q, x) {
          for (var M = 0; M < x; M += 1)
            W.putBit((q >>> x - M - 1 & 1) == 1);
        }, W.getLengthInBits = function() {
          return V;
        }, W.putBit = function(q) {
          var x = Math.floor(V / 8);
          E.length <= x && E.push(0), q && (E[x] |= 128 >>> V % 8), V += 1;
        }, W;
      }, p = function(E) {
        var V = s.MODE_NUMBER, W = E, q = {};
        q.getMode = function() {
          return V;
        }, q.getLength = function(k) {
          return W.length;
        }, q.write = function(k) {
          for (var v = W, R = 0; R + 2 < v.length; )
            k.put(x(v.substring(R, R + 3)), 10), R += 3;
          R < v.length && (v.length - R == 1 ? k.put(x(v.substring(R, R + 1)), 4) : v.length - R == 2 && k.put(x(v.substring(R, R + 2)), 7));
        };
        var x = function(k) {
          for (var v = 0, R = 0; R < k.length; R += 1)
            v = v * 10 + M(k.charAt(R));
          return v;
        }, M = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return q;
      }, y = function(E) {
        var V = s.MODE_ALPHA_NUM, W = E, q = {};
        q.getMode = function() {
          return V;
        }, q.getLength = function(M) {
          return W.length;
        }, q.write = function(M) {
          for (var k = W, v = 0; v + 1 < k.length; )
            M.put(
              x(k.charAt(v)) * 45 + x(k.charAt(v + 1)),
              11
            ), v += 2;
          v < k.length && M.put(x(k.charAt(v)), 6);
        };
        var x = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          if ("A" <= M && M <= "Z")
            return M.charCodeAt(0) - 65 + 10;
          switch (M) {
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
              throw "illegal char :" + M;
          }
        };
        return q;
      }, b = function(E) {
        var V = s.MODE_8BIT_BYTE, W = a.stringToBytes(E), q = {};
        return q.getMode = function() {
          return V;
        }, q.getLength = function(x) {
          return W.length;
        }, q.write = function(x) {
          for (var M = 0; M < W.length; M += 1)
            x.put(W[M], 8);
        }, q;
      }, A = function(E) {
        var V = s.MODE_KANJI, W = a.stringToBytesFuncs.SJIS;
        if (!W)
          throw "sjis not supported.";
        (function(M, k) {
          var v = W(M);
          if (v.length != 2 || (v[0] << 8 | v[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var q = W(E), x = {};
        return x.getMode = function() {
          return V;
        }, x.getLength = function(M) {
          return ~~(q.length / 2);
        }, x.write = function(M) {
          for (var k = q, v = 0; v + 1 < k.length; ) {
            var R = (255 & k[v]) << 8 | 255 & k[v + 1];
            if (33088 <= R && R <= 40956)
              R -= 33088;
            else if (57408 <= R && R <= 60351)
              R -= 49472;
            else
              throw "illegal char at " + (v + 1) + "/" + R;
            R = (R >>> 8 & 255) * 192 + (R & 255), M.put(R, 13), v += 2;
          }
          if (v < k.length)
            throw "illegal char at " + (v + 1);
        }, x;
      }, S = function() {
        var E = [], V = {};
        return V.writeByte = function(W) {
          E.push(W & 255);
        }, V.writeShort = function(W) {
          V.writeByte(W), V.writeByte(W >>> 8);
        }, V.writeBytes = function(W, q, x) {
          q = q || 0, x = x || W.length;
          for (var M = 0; M < x; M += 1)
            V.writeByte(W[M + q]);
        }, V.writeString = function(W) {
          for (var q = 0; q < W.length; q += 1)
            V.writeByte(W.charCodeAt(q));
        }, V.toByteArray = function() {
          return E;
        }, V.toString = function() {
          var W = "";
          W += "[";
          for (var q = 0; q < E.length; q += 1)
            q > 0 && (W += ","), W += E[q];
          return W += "]", W;
        }, V;
      }, $ = function() {
        var E = 0, V = 0, W = 0, q = "", x = {}, M = function(v) {
          q += String.fromCharCode(k(v & 63));
        }, k = function(v) {
          if (!(v < 0)) {
            if (v < 26)
              return 65 + v;
            if (v < 52)
              return 97 + (v - 26);
            if (v < 62)
              return 48 + (v - 52);
            if (v == 62)
              return 43;
            if (v == 63)
              return 47;
          }
          throw "n:" + v;
        };
        return x.writeByte = function(v) {
          for (E = E << 8 | v & 255, V += 8, W += 1; V >= 6; )
            M(E >>> V - 6), V -= 6;
        }, x.flush = function() {
          if (V > 0 && (M(E << 6 - V), E = 0, V = 0), W % 3 != 0)
            for (var v = 3 - W % 3, R = 0; R < v; R += 1)
              q += "=";
        }, x.toString = function() {
          return q;
        }, x;
      }, I = function(E) {
        var V = E, W = 0, q = 0, x = 0, M = {};
        M.read = function() {
          for (; x < 8; ) {
            if (W >= V.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var v = V.charAt(W);
            if (W += 1, v == "=")
              return x = 0, -1;
            if (v.match(/^\s$/))
              continue;
            q = q << 6 | k(v.charCodeAt(0)), x += 6;
          }
          var R = q >>> x - 8 & 255;
          return x -= 8, R;
        };
        var k = function(v) {
          if (65 <= v && v <= 90)
            return v - 65;
          if (97 <= v && v <= 122)
            return v - 97 + 26;
          if (48 <= v && v <= 57)
            return v - 48 + 52;
          if (v == 43)
            return 62;
          if (v == 47)
            return 63;
          throw "c:" + v;
        };
        return M;
      }, H = function(E, V) {
        var W = E, q = V, x = new Array(E * V), M = {};
        M.setPixel = function(O, L, P) {
          x[L * W + O] = P;
        }, M.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(W), O.writeShort(q), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(W), O.writeShort(q), O.writeByte(0);
          var L = 2, P = v(L);
          O.writeByte(L);
          for (var J = 0; P.length - J > 255; )
            O.writeByte(255), O.writeBytes(P, J, 255), J += 255;
          O.writeByte(P.length - J), O.writeBytes(P, J, P.length - J), O.writeByte(0), O.writeString(";");
        };
        var k = function(O) {
          var L = O, P = 0, J = 0, z = {};
          return z.write = function(se, ae) {
            if (se >>> ae)
              throw "length over";
            for (; P + ae >= 8; )
              L.writeByte(255 & (se << P | J)), ae -= 8 - P, se >>>= 8 - P, J = 0, P = 0;
            J = se << P | J, P = P + ae;
          }, z.flush = function() {
            P > 0 && L.writeByte(J);
          }, z;
        }, v = function(O) {
          for (var L = 1 << O, P = (1 << O) + 1, J = O + 1, z = R(), se = 0; se < L; se += 1)
            z.add(String.fromCharCode(se));
          z.add(String.fromCharCode(L)), z.add(String.fromCharCode(P));
          var ae = S(), ye = k(ae);
          ye.write(L, J);
          var fe = 0, ee = String.fromCharCode(x[fe]);
          for (fe += 1; fe < x.length; ) {
            var le = String.fromCharCode(x[fe]);
            fe += 1, z.contains(ee + le) ? ee = ee + le : (ye.write(z.indexOf(ee), J), z.size() < 4095 && (z.size() == 1 << J && (J += 1), z.add(ee + le)), ee = le);
          }
          return ye.write(z.indexOf(ee), J), ye.write(P, J), ye.flush(), ae.toByteArray();
        }, R = function() {
          var O = {}, L = 0, P = {};
          return P.add = function(J) {
            if (P.contains(J))
              throw "dup key:" + J;
            O[J] = L, L += 1;
          }, P.size = function() {
            return L;
          }, P.indexOf = function(J) {
            return O[J];
          }, P.contains = function(J) {
            return typeof O[J] < "u";
          }, P;
        };
        return M;
      }, N = function(E, V, W) {
        for (var q = H(E, V), x = 0; x < V; x += 1)
          for (var M = 0; M < E; M += 1)
            q.setPixel(M, x, W(M, x));
        var k = S();
        q.write(k);
        for (var v = $(), R = k.toByteArray(), O = 0; O < R.length; O += 1)
          v.writeByte(R[O]);
        return v.flush(), "data:image/gif;base64," + v;
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
  })(ts)), ts.exports;
}
var nS = tS();
const aS = /* @__PURE__ */ eS(nS), sS = ["width", "height", "viewBox"], oS = ["width", "height"], lS = ["d"], iS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = C(() => {
      const a = aS(0, "M");
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
      }, null, 8, oS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, lS)
    ], 8, sS));
  }
}, UM = /* @__PURE__ */ U(iS, [["__scopeId", "data-v-b4458227"]]), rS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: be({ padding: e.padding })
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, GM = /* @__PURE__ */ U(rS, [["__scopeId", "data-v-79847aff"]]);
function VM(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const KM = su(() => import("./VoiceFigure-BJOpskj1.mjs").then((e) => e.V)), YM = "1.2.0", QM = "3.5";
export {
  If as $,
  Oe as A,
  Ie as B,
  ga as C,
  rt as D,
  X_ as E,
  u$ as F,
  F6 as G,
  V_ as H,
  H5 as I,
  v$ as J,
  Ot as K,
  fS as L,
  eo as M,
  $$ as N,
  p$ as O,
  va as P,
  h_ as Q,
  k6 as R,
  Un as S,
  y_ as T,
  f6 as U,
  Te as V,
  aa as W,
  d6 as X,
  c6 as Y,
  Tf as Z,
  U as _,
  n6 as a,
  L_ as a$,
  k$ as a0,
  w6 as a1,
  $6 as a2,
  Pe as a3,
  R6 as a4,
  I6 as a5,
  Et as a6,
  x6 as a7,
  U6 as a8,
  US as a9,
  C_ as aA,
  c_ as aB,
  I5 as aC,
  Y6 as aD,
  Q6 as aE,
  J_ as aF,
  _r as aG,
  g_ as aH,
  $n as aI,
  XS as aJ,
  KS as aK,
  F_ as aL,
  xn as aM,
  U_ as aN,
  j6 as aO,
  d_ as aP,
  f_ as aQ,
  u_ as aR,
  fn as aS,
  Mt as aT,
  GS as aU,
  $2 as aV,
  i_ as aW,
  y6 as aX,
  xr as aY,
  Ht as aZ,
  Kt as a_,
  N_ as aa,
  H_ as ab,
  e6 as ac,
  h6 as ad,
  m6 as ae,
  O6 as af,
  T6 as ag,
  B6 as ah,
  l6 as ai,
  vl as aj,
  S6 as ak,
  z6 as al,
  nM as am,
  a_ as an,
  t_ as ao,
  e_ as ap,
  L6 as aq,
  E6 as ar,
  C6 as as,
  A6 as at,
  v_ as au,
  H6 as av,
  G6 as aw,
  oM as ax,
  en as ay,
  V6 as az,
  R$ as b,
  sM as b$,
  o$ as b0,
  z_ as b1,
  w_ as b2,
  k_ as b3,
  G2 as b4,
  cr as b5,
  I_ as b6,
  W6 as b7,
  ka as b8,
  ft as b9,
  x_ as bA,
  A_ as bB,
  vt as bC,
  b_ as bD,
  O_ as bE,
  K6 as bF,
  s_ as bG,
  X6 as bH,
  Le as bI,
  P6 as bJ,
  T_ as bK,
  hM as bL,
  mM as bM,
  HS as bN,
  _2 as bO,
  q6 as bP,
  S_ as bQ,
  a6 as bR,
  tM as bS,
  $_ as bT,
  __ as bU,
  M_ as bV,
  N6 as bW,
  R5 as bX,
  D6 as bY,
  Z6 as bZ,
  eM as b_,
  E_ as ba,
  Wa as bb,
  wi as bc,
  iM as bd,
  cM as be,
  p_ as bf,
  j_ as bg,
  zS as bh,
  n_ as bi,
  rM as bj,
  _6 as bk,
  M6 as bl,
  r6 as bm,
  b6 as bn,
  QS as bo,
  D_ as bp,
  s6 as bq,
  o6 as br,
  u6 as bs,
  l_ as bt,
  g2 as bu,
  G_ as bv,
  m$ as bw,
  i6 as bx,
  JS as by,
  o_ as bz,
  U2 as c,
  FM as c$,
  YS as c0,
  VS as c1,
  J6 as c2,
  dM as c3,
  oo as c4,
  fM as c5,
  jr as c6,
  P_ as c7,
  v6 as c8,
  p6 as c9,
  cS as cA,
  pt as cB,
  Pd as cC,
  WM as cD,
  ge as cE,
  ti as cF,
  OM as cG,
  wS as cH,
  YM as cI,
  QM as cJ,
  IS as cK,
  IM as cL,
  ps as cM,
  DS as cN,
  lw as cO,
  Ft as cP,
  $l as cQ,
  Is as cR,
  ES as cS,
  RS as cT,
  wc as cU,
  Fk as cV,
  PM as cW,
  $S as cX,
  xS as cY,
  SS as cZ,
  OS as c_,
  w2 as ca,
  ZS as cb,
  f$ as cc,
  r_ as cd,
  Xs as ce,
  C5 as cf,
  m_ as cg,
  tn as ch,
  Dt as ci,
  _S as cj,
  CS as ck,
  AM as cl,
  pe as cm,
  mf as cn,
  Ds as co,
  fa as cp,
  rg as cq,
  ha as cr,
  jM as cs,
  WS as ct,
  MS as cu,
  dg as cv,
  Ri as cw,
  on as cx,
  Ks as cy,
  pM as cz,
  Ve as d,
  gM as d$,
  UM as d0,
  Ni as d1,
  Qc as d2,
  CM as d3,
  Ay as d4,
  gS as d5,
  jS as d6,
  C4 as d7,
  jt as d8,
  BS as d9,
  hd as dA,
  qM as dB,
  NM as dC,
  Rs as dD,
  fd as dE,
  Os as dF,
  _m as dG,
  DM as dH,
  FS as dI,
  xk as dJ,
  PS as dK,
  qS as dL,
  yM as dM,
  om as dN,
  vM as dO,
  pS as dP,
  BM as dQ,
  ew as dR,
  Y$ as dS,
  bS as dT,
  TS as dU,
  wM as dV,
  xM as dW,
  qe as dX,
  Ap as dY,
  AS as dZ,
  xc as d_,
  Ye as da,
  kt as db,
  yv as dc,
  sd as dd,
  Tm as de,
  NS as df,
  yS as dg,
  Gt as dh,
  TM as di,
  y3 as dj,
  HM as dk,
  zM as dl,
  bn as dm,
  Fd as dn,
  st as dp,
  LS as dq,
  et as dr,
  KM as ds,
  GM as dt,
  Us as du,
  $M as dv,
  Cs as dw,
  Cp as dx,
  Lo as dy,
  zs as dz,
  g6 as e,
  Qi as e0,
  kM as e1,
  Ou as e2,
  vS as e3,
  mS as e4,
  ln as e5,
  Yl as e6,
  md as e7,
  kS as e8,
  mt as e9,
  VM as ea,
  Q$ as eb,
  dS as ec,
  hS as ed,
  bM as ee,
  EM as ef,
  Ai as eg,
  RM as eh,
  Xi as ei,
  Ul as ej,
  N4 as ek,
  Es as el,
  SM as em,
  ns as en,
  _M as eo,
  MM as ep,
  Ue as eq,
  LM as er,
  Yn as es,
  v2 as f,
  lM as g,
  hn as h,
  K_ as i,
  uM as j,
  Y_ as k,
  q_ as l,
  D$ as m,
  to as n,
  W_ as o,
  t6 as p,
  Q_ as q,
  Dr as r,
  Pr as s,
  Ce as t,
  K2 as u,
  R_ as v,
  aM as w,
  B_ as x,
  _n as y,
  Z_ as z
};
