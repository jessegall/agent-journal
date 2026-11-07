/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as ye, unref as I, renderSlot as me, createElementVNode as m, normalizeClass as Y, Fragment as D, renderList as ae, defineComponent as jr, Comment as Fr, h as ia, cloneVNode as Wr, createBlock as H, withCtx as F, createVNode as E, toDisplayString as y, createCommentVNode as k, ref as S, onMounted as Se, onBeforeUnmount as Ze, reactive as Ht, shallowRef as Qe, watch as ge, onUnmounted as Re, inject as Ce, useAttrs as ra, computed as M, resolveDynamicComponent as yt, mergeProps as qe, useId as _s, resolveDirective as Hr, withDirectives as Je, createTextVNode as ne, Teleport as ua, nextTick as He, Transition as zt, withModifiers as $e, createApp as zr, shallowReactive as Ur, withKeys as Mt, onScopeDispose as ca, useModel as an, mergeModels as Dt, vModelText as Gn, resolveComponent as Vr, provide as Cl, onErrorCaptured as Gr, TransitionGroup as Ms, isRef as ro, getCurrentInstance as Kr, getCurrentScope as El, toHandlers as Yr, createSlots as Qr, vShow as Al, useSlots as Jr, normalizeProps as Xr, guardReactiveProps as Zr, defineAsyncComponent as eu } from "vue";
function Ol(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, tu = 1600, nu = {
  __name: "Shimmer",
  setup(e) {
    const t = Ol(tu);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: ye(I(t))
    }, null, 4));
  }
}, Xt = /* @__PURE__ */ U(nu, [["__scopeId", "data-v-6c018b03"]]), au = { class: "skeleton-line" }, su = 2e3, ou = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Ol(su);
    return (n, a) => (u(), f("span", au, [
      me(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(D, null, ae(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ye({ ...I(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ U(ou, [["__scopeId", "data-v-484fe8a0"]]), Ut = jr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Fr);
      return a.length !== 1 ? ia(D, { key: n }, a) : a[0].key == null ? Wr(a[0], { key: n }) : a[0];
    };
  }
}), lu = ["aria-label"], iu = ["aria-label"], ru = ["aria-label"], uu = ["aria-label"], cu = ["aria-label"], du = ["aria-label"], fu = ["aria-label"], hu = {
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
    return (r, c) => (u(), H(Ut, { value: e.shape }, {
      messages: F(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), f(D, null, ae(t, (d) => E(Xt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: ye({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, lu)
      ]),
      older: F(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(t.slice(0, 3), (d) => (u(), H(Xt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: ye({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, iu)
      ]),
      cards: F(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(D, null, ae(n, (h) => E(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ru)
      ]),
      file: F(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            E(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(D, null, ae(s, (h) => E(bt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, uu)
      ]),
      page: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          E(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (u(!0), f(D, null, ae(e.count, (d) => (u(), H(bt, {
            key: d,
            bars: I(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, cu)
      ]),
      text: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), H(bt, {
            key: d,
            bars: I(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, du)
      ]),
      default: F(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), H(bt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, fu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ge = /* @__PURE__ */ U(hu, [["__scopeId", "data-v-ef519c5f"]]), mu = {
  key: 1,
  class: "empty-state titled"
}, pu = { class: "empty-state-title" }, vu = { class: "empty-state-text" }, gu = {
  key: 2,
  class: "empty-state"
}, yu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), H(Ge, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", mu, [
      m("p", pu, y(e.title), 1),
      m("p", vu, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", gu, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, sn = /* @__PURE__ */ U(yu, [["__scopeId", "data-v-b27e89b0"]]), bu = { class: "fold-group" }, ku = ["aria-expanded"], wu = { class: "fold-label" }, $u = {
  key: 0,
  class: "fold-count"
}, xu = {
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
    return (a, s) => (u(), f("div", bu, [
      m("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", wu, y(e.label), 1),
        e.count !== "" ? (u(), f("span", $u, y(e.count), 1)) : k("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, ku),
      e.open ? me(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, eS = /* @__PURE__ */ U(xu, [["__scopeId", "data-v-9ef1865c"]]), Su = 150, _u = () => Su;
function Cs(e, t, n = _u(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Mu(e, t, n) {
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
const Cu = 50, uo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function tS(e) {
  const t = ze().sources.find((n) => n.key === e);
  return t ? ns(t.read, t.events) : ns("", []);
}
function Tl(e, t, n, a, s = () => !1) {
  const o = S([]), l = S(null), i = S(""), r = S(!1), c = performance.now(), d = S(!1), h = S(""), p = S(null), g = /* @__PURE__ */ new Set();
  let b = null;
  function _(v) {
    return s() ? (g.add(v), b ?? (b = new Promise((T) => setTimeout(() => T(O()), Cu)))) : C(v);
  }
  async function O() {
    const v = new Set(g);
    g.clear(), b = null;
    const T = W, A = await t({ ids: [...v].join(","), limit: v.size });
    if (T !== W) return;
    if (!A.ok) return L();
    const R = new Map(A.value.rows.map((q) => [q.id, q]));
    o.value = o.value.flatMap((q) => v.has(q.id) ? R.has(q.id) ? [R.get(q.id)] : [] : [q]);
  }
  async function C(v) {
    const T = W, A = await t({ "before-id": v + 1, limit: 1 });
    if (T !== W) return;
    if (!A.ok) return L();
    const R = A.value.rows.find((q) => q.id === v);
    o.value = R ? o.value.map((q) => q.id === v ? R : q) : o.value.filter((q) => q.id !== v);
  }
  async function j(v) {
    if (a() && String((v == null ? void 0 : v.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ee) => ee.id !== v.row_id));
    if (a() && (v != null && v.row_id) && !String(v.event ?? "").endsWith(".create") && o.value.some((ee) => ee.id === v.row_id)) return _(v.row_id);
    if (!(a() && o.value.length && String((v == null ? void 0 : v.event) ?? "").endsWith(".create"))) return L();
    const A = Math.max(...o.value.map((ee) => ee.id)), R = W, q = await t({ "after-id": A });
    if (R !== W) return;
    if (!q.ok) return L();
    const N = new Set(o.value.map((ee) => ee.id));
    o.value = [...q.value.rows.filter((ee) => !N.has(ee.id)), ...o.value];
  }
  async function z() {
    if (!d.value || !o.value.length) return !1;
    const v = W, T = Math.min(...o.value.map((q) => q.id)), A = await t({ "before-id": T });
    if (v !== W) return !1;
    if (!A.ok || !A.value.rows.length) return d.value = !1;
    d.value = uo(A.value, n());
    const R = new Set(o.value.map((q) => q.id));
    return o.value = [...o.value, ...A.value.rows.filter((q) => !R.has(q.id))], !0;
  }
  let W = 0;
  function B(v, T) {
    var q, N;
    const A = v.ok ? e.shared ? [v.value] : ((q = v.value) == null ? void 0 : q.rows) ?? [] : [];
    v.ok && (o.value = T(A)), l.value = v.ok ? v.value : null;
    const R = A.length ? Math.min(...A.map((ee) => ee.id)) : 0;
    v.ok && ((N = v.value) != null && N.rows) && !o.value.some((ee) => ee.id < R) && (d.value = !e.shared && uo(v.value, n())), i.value = v.ok ? "" : v.error, Cs(c, () => r.value = !0);
  }
  async function G(v) {
    const T = ++W, A = await t({});
    T === W && B(A, v);
  }
  const P = (v) => {
    if (!a() || !v.length) return v;
    const T = Math.min(...v.map((R) => R.id)), A = Math.max(...v.map((R) => R.id));
    return [...o.value.filter((R) => R.id > A), ...v, ...o.value.filter((R) => R.id < T)];
  }, L = () => G(P), x = (v) => B(v, P), $ = () => G((v) => v);
  async function w(v, T = null) {
    const A = await Mu(T && { target: o, fields: { value: T(o.value) } }, v, e.run);
    return h.value = A.ok ? "" : A.error, p.value = A.ok ? A.value : null, await L(), A;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: L, loadLatest: $, older: z, act: w, actionFailure: h, answer: p, context: e, heard: j, showFirst: x };
}
const Eu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ns(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = ze(), l = Tl(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Eu(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Au = 2e3;
function Es(e, t, n = Au) {
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
  Se(async () => {
    document.addEventListener("visibilitychange", c), await l(e), r();
  }), Ze(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const Il = typeof document < "u" && document.documentElement.classList.contains("phone"), Rl = 120;
var _l;
const wa = globalThis[_l = Symbol.for("journal.pressed")] ?? (globalThis[_l] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Ou(e = 0) {
  const t = wa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, wa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, wa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function as(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Bl(e = window) {
  if (!as(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    as(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ss = "journal.stale-build-reload", Tu = 'script[type="module"][src*="/assets/index-"]', co = (e) => {
  var t;
  return ((t = e.querySelector(Tu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Iu(e = document, t = (a, s) => Me.quietRead(a, s), n = () => Bl(window)) {
  const a = co(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = co(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let $a = "";
function Ru(e, t = () => Bl(window)) {
  if (!e) return !1;
  const n = !!$a && $a !== e;
  return $a = e, n && t(), n;
}
const Bu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Lu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ss) === e.message) return !1;
    t.setItem(ss, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Nu(e = window.sessionStorage) {
  try {
    e.removeItem(ss);
  } catch {
    return;
  }
}
const qu = 2e3, Du = 3e4, Ue = Ht({ starting: !1, external: !1, late: !1, offline: !1 }), As = () => Ue.starting, Pu = 3;
let Mn = 0, os = 0, Ll = 0, Nl = [];
async function ju() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ue.external };
  }
}
let fo = null;
const Fu = () => fo ?? (fo = ju().finally(() => fo = null));
function Wu() {
  clearTimeout(os), clearTimeout(Ll), os = 0, Object.assign(Ue, { starting: !1, external: !1, late: !1, offline: !1 }), Nl.splice(0).forEach((e) => e()), Iu();
}
async function Hu() {
  Ue.offline = !navigator.onLine;
  const e = await Fu();
  if (Ue.external = e.updating, Mn = !e.restarting && !e.updating && e.reachable ? Mn + 1 : 0, Mn < Pu) return;
  Mn = 0, (!Ru(e.started_at) || as()) && Wu();
}
function ql() {
  os = setTimeout(async () => {
    await Hu(), Ue.starting && ql();
  }, qu);
}
function zu() {
  Ue.starting || (Ue.starting = !0, Ue.offline = !navigator.onLine, ql(), Ll = setTimeout(() => Ue.late = !0, Du));
}
const Dl = () => Ue.starting ? new Promise((e) => Nl.push(e)) : Promise.resolve();
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
function Uu(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Vu {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Uu(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const rt = "viewer.shell", Cn = 2e4, Gu = 4, ho = "/api/read-lines", Ku = 5e3, Yu = 403, mo = "/api/repeated-lines", Qu = 10, Ju = 2e3, Xu = 3e5, nS = 6e5, En = 6, Zu = 500, ec = "/journal/summary", po = "/api/server-state", tc = 2e4, An = Il ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, nc = (e) => e.split("?")[0].endsWith(ec), ls = (e, t) => Object.assign(new Error(t), { status: e });
async function ac(e, t, n = ls) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const sc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), oc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), vo = (e) => e.split(" ").slice(0, 2).join(" "), nt = "read", It = "write", lc = "stream";
class ic {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = En;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = vo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < Ju));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Qu || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(mo, { method: "POST", headers: { ...An, "Content-Type": "application/json" }, body: i }, [{ window: rt, line: mo, kind: It }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Ou(n ? Rl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: oc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === It ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = Cn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && zu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Gu ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(ho, { headers: An }, [{ window: rt, line: ho, kind: nt }], Ku).then(async (t) => {
      if (t.status === Yu) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ls(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Vu(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = vo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = En;
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
    const i = a instanceof FormData, r = { method: t, headers: { ...An, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: sc(a) }, c = s || (i ? Xu : Cn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: rt, line: n, kind: nt }], c)) : await this.sent(n, r, [{ window: rt, line: n, kind: It }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, Zu)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = En, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return ac(i, `${i.status} ${i.statusText}`).catch((r) => {
      throw r.blocked && t !== "GET" && this.refused(r.message), r;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: rt, line: t, kind: nt }], Cn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: An });
    if (!n.ok) throw ls(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, En, o).then((i) => (this.written(n), i)) : As() && !nc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: rt, line: t, kind: lc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(po, { cache: "no-store" }, [{ window: rt, line: po, kind: nt }], tc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = rt, line: s = t, limit: o = Cn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? nt : It;
    return l === It ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const xa = Symbol.for("journal.transport"), Me = globalThis[xa] ?? (globalThis[xa] = new ic());
class Pl {
  constructor() {
    this.following = Qe([]), this.held = /* @__PURE__ */ new Set();
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
const rc = 50, uc = "refresh", cc = 1e3, dc = 3e4, fc = "requested", hc = "after_window", mc = 50, On = ".*", pc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function vc(e) {
  const t = {}, n = Ht({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function p(x) {
    const $ = () => r[x] ?? r[`${x.slice(0, x.lastIndexOf("."))}.*`] ?? {}, w = S(void 0), v = Tl(e, async (T) => {
      const A = await _(x, T);
      return A.ok && !Object.keys(T).length && (w.value = A.value), A;
    }, () => $().page_size || mc, () => !!$().page_size, () => !!$().reads_ids);
    return t[x] = { ...v, data: w, readAt: 0 };
  }
  const g = new Proxy({}, { get: (x, $) => typeof $ != "string" || $.startsWith("__v") ? void 0 : t[$] ?? p($) }), b = (x) => (r[x].loading !== fc || x.endsWith(On)) && (!r[x].tab || r[x].tab === n.tab);
  function _(x, $ = {}) {
    return new Promise((w) => {
      a.push({ name: x, flags: $, resolve: w }), a.length === 1 && setTimeout(O);
    });
  }
  async function O() {
    const x = /* @__PURE__ */ new Map(), $ = a.splice(0).filter((T) => {
      const A = JSON.stringify(T.flags);
      return x.has(T.name) || x.set(T.name, A), x.get(T.name) === A ? !0 : (a.push(T), !1);
    });
    a.length && setTimeout(O);
    const w = Object.fromEntries($.flatMap(({ name: T, flags: A }) => Object.entries(A).map(([R, q]) => [`${T}.${R}`, q]))), v = await e.readKeys({ only: [...new Set($.map(({ name: T }) => T))], state: { ...n, ...w } });
    $.forEach(({ name: T, resolve: A }) => A(v.ok ? v.value.keys[T] : v));
  }
  async function C(x) {
    var T;
    const $ = ++d;
    (x.length ? x : Object.keys(r).filter((A) => !A.endsWith(On) && r[A].loading === "first" && b(A))).forEach((A) => l[A] = $);
    const v = await e.readKeys({ only: x, state: { ...n } });
    if (!v.ok) {
      if (v.failure === "cancelled") return !1;
      const A = (x.length ? x : Object.keys(t)).filter((q) => (l[q] ?? 0) <= $);
      A.forEach((q) => {
        g[q].readAt = Date.now(), v.failure === "unreachable" ? i.add(q) : i.delete(q), g[q].showFirst(v);
      });
      const R = v.failure === "unreachable" && ((T = e.waitForServer) == null ? void 0 : T.call(e));
      return R && R.then(() => {
        if (h) return;
        const q = A.filter((N) => l[N] === $);
        (q.length || !x.length && !A.length && d === $) && C(q);
      }), !1;
    }
    return P(v.value.declared), Object.entries(v.value.keys).forEach(([A, R]) => {
      (l[A] ?? 0) > $ || (l[A] = $, g[A].readAt = Date.now(), i.delete(A), R.ok && (g[A].data.value = R.value), g[A].showFirst(R));
    }), !0;
  }
  function j(x) {
    const $ = pc(x);
    return $.length ? ($.forEach((w) => o.names.add(w)), o.answer ?? (o.answer = new Promise((w) => setTimeout(() => {
      const v = [...o.names];
      o.names.clear(), o.answer = null, w(C(v));
    })))) : C([]);
  }
  function z(x) {
    x.forEach(($) => s.add($)), clearTimeout(c), c = setTimeout(() => {
      const $ = [...s];
      s.clear(), $.length && C($);
    }, rc);
  }
  const W = (x) => x.endsWith(On) ? Object.keys(t).filter(($) => $.startsWith(x.slice(0, -1)) && t[$].readAt) : [x], B = (x) => (r[x] ?? r[`${x.split(".")[0]}.*`]).reload_seconds;
  function G(x) {
    const $ = Object.keys(r).filter((v) => x.event === uc || r[v].events.some((T) => Ts(T, x.event)));
    $.filter((v) => r[v].page_size).forEach((v) => g[v].heard(x));
    const w = $.filter((v) => !r[v].page_size);
    w.filter((v) => !b(v)).forEach((v) => g[v].readAt = 0), z(w.filter(b).flatMap(W));
  }
  function P(x) {
    if (Object.keys(r).length) return;
    r = x;
    const $ = [...new Set(Object.values(x).flatMap((v) => v.events))];
    $.length && e.follow($, G);
    const w = Object.keys(x).filter((v) => x[v].loading === hc);
    w.length && C(w);
  }
  ge(() => n.tab, () => {
    const x = Object.keys(r).filter(($) => !$.endsWith(On) && b($) && !g[$].readAt);
    x.length && C(x);
  }), Re(() => {
    h = !0, clearTimeout(c);
  });
  function L() {
    const x = Date.now(), $ = Object.keys(r).filter((w) => r[w].reload_seconds > 0 && b(w)).flatMap(W).filter((w) => x - g[w].readAt >= (i.has(w) ? Math.min(B(w) * 1e3, dc) : B(w) * 1e3));
    $.length && z($);
  }
  return Es(L, () => e.visible.value, cc), queueMicrotask(() => C([])), { props: g, state: n, reload: j, readKey: _ };
}
const gc = Symbol("open-view"), De = Symbol.for("journal.window-context"), jl = Symbol("dock-card");
function yc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = vc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function ze() {
  const e = Ce(De, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return yc(e);
}
const bc = (e, t) => e(jl, t), aS = () => Ce(jl), kc = ["data-icon", "stroke-width", "innerHTML"], ve = {
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
    }, null, 12, kc));
  }
}, wc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, $c = /* @__PURE__ */ U(wc, [["__scopeId", "data-v-eb453d6f"]]), xc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ra(), a = M(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = S(!1), o = M(() => t.busy || s.value), l = Ce(De, null), i = M(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function r(c) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, Rl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, d) => (u(), H(yt(e.href ? "a" : "button"), qe(a.value, {
      type: e.href ? void 0 : I(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: r
    }), {
      default: F(() => [
        m("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), H(ve, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          me(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), H($c, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ U(xc, [["__scopeId", "data-v-ededdadf"]]), Sc = ["aria-checked", "aria-haspopup", "onClick"], _c = {
  key: 0,
  class: "segmented-dot"
}, Mc = {
  key: 1,
  class: "segmented-note"
}, Cc = {
  key: 2,
  class: "segmented-count"
}, Ec = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = _s();
    return (s, o) => {
      const l = Hr("tip");
      return u(), f("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(D, null, ae(e.options, (i) => Je((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", _c)) : k("", !0),
          ne(" " + y(i.label) + " ", 1),
          i.note ? (u(), f("small", Mc, y(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (u(), f("em", Cc, y(i.count), 1)) : k("", !0)
        ], 10, Sc)), [
          [l, i.tip || i.title, `${I(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Pt = /* @__PURE__ */ U(Ec, [["__scopeId", "data-v-c89bc92d"]]), Ac = {
  key: 0,
  class: "more-items"
}, Oc = {
  key: 0,
  role: "alert"
}, Tc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", Ac, [
      e.failure ? (u(), f("p", Oc, y(e.failure), 1)) : k("", !0),
      e.more ? (u(), H(pe, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: F(() => [
          ne(y(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, pn = /* @__PURE__ */ U(Tc, [["__scopeId", "data-v-10464014"]]), Ic = { class: "link-group" }, Rc = {
  class: "group-label",
  "data-link-kind": ""
}, Bc = ["disabled", "onClick"], Lc = { class: "title" }, Nc = { class: "relations" }, qc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(!1), o = M(() => s.value ? n.rows : n.rows.slice(0, 3)), l = M(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Ic, [
      m("div", Rc, y(l.value), 1),
      (u(!0), f(D, null, ae(o.value, (p) => (u(), f("button", qe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(p), {
        disabled: i(p),
        onClick: (g) => a("open", p)
      }), [
        m("span", Lc, y(p.endpoint.title), 1),
        m("span", Nc, [
          ne(y(c(p)), 1),
          i(p) ? (u(), f(D, { key: 0 }, [
            ne(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Bc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Dc = /* @__PURE__ */ U(qc, [["__scopeId", "data-v-be6f079c"]]), Pc = ["data-loaded"], jc = { class: "rows" }, Fc = ["disabled", "onClick"], Wc = { class: "title" }, Hc = { class: "relations" }, zc = { key: 2 }, Uc = {
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
    const n = e, a = t, s = S([]), o = S({}), l = S(0), i = S(""), r = S(null), c = S(!1), d = S("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (L) => p[L] || `${L.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())}s`, b = M(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((L, x) => L + x, 0) },
      ...Object.entries(o.value).filter(([L]) => !n.onlyKinds.length || n.onlyKinds.includes(L)).map(([L, x]) => ({ key: L, label: g(L), count: x }))
    ]), _ = M(() => {
      const L = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map(($) => $.endpoint.model))].map(($) => [$, s.value.filter((w) => w.endpoint.model === $).length])), x = { doc: 0, task: 1, message: 2 };
      return Object.entries(L).sort(([$], [w]) => (x[$] ?? 3) - (x[w] ?? 3)).map(([$, w]) => ({ model: $, count: w, rows: s.value.filter((v) => v.endpoint.model === $) }));
    }), O = (L) => L.endpoint.unavailable || !L.endpoint.open_ref, C = (L) => ({ [n.linkAttribute]: !0, "data-link-model": L.endpoint.model, "data-link-id": L.endpoint.id }), j = (L) => `${L.endpoint.model === "doc" && L.endpoint.id === n.documentId ? "Design document" : L.endpoint.model.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())} ${L.endpoint.id}, ${L.relations.map((x) => x.replaceAll("_", " ")).join(", ")}`;
    async function z(L = 1) {
      const x = ++h;
      c.value = !0, d.value = "";
      const $ = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(L), "--page-size", String(n.pageSize)];
      n.outsidePlan && $.push("--outside-plan"), n.documentId && $.push("--first-counterpart", `doc:${n.documentId}`), i.value && $.push("--kind", i.value);
      try {
        const w = await n.read($);
        if (x !== h) return;
        if (!w.ok) {
          d.value = w.error;
          return;
        }
        const v = w.value.counterparts ?? [], T = L === 1 ? v : [...s.value, ...v];
        s.value = [...new Map(T.map((A) => [`${A.endpoint.model}:${A.endpoint.id}`, A])).values()], o.value = w.value.kinds ?? {}, l.value = w.value.total, r.value = w.value.next_page ?? null;
      } catch (w) {
        x === h && (d.value = w.message);
      } finally {
        x === h && (c.value = !1);
      }
    }
    function W(L) {
      if (O(L)) return;
      const [x, $] = L.endpoint.open_ref.split(":");
      a("open", { table: x, id: Number($) });
    }
    function B(L) {
      i.value = L, z();
    }
    const G = () => !c.value && r.value && z(r.value), P = M(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ge(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], r.value = null, i.value = "", z();
    }, { immediate: !0 }), (L, x) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (u(), H(Pt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: B
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", jc, [
        e.grouped ? (u(!0), f(D, { key: 0 }, ae(_.value, ($) => (u(), H(Dc, {
          key: $.model,
          model: $.model,
          count: $.count,
          rows: $.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: W
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(D, { key: 1 }, ae(s.value, ($) => (u(), f("button", qe({
          key: `${$.endpoint.model}:${$.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, C($), {
          disabled: O($),
          onClick: (w) => W($)
        }), [
          m("span", Wc, y($.endpoint.title), 1),
          m("span", Hc, [
            ne(y(j($)), 1),
            O($) ? (u(), f(D, { key: 0 }, [
              ne(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Fc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", zc, y(e.empty), 1)) : k("", !0),
        E(pn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: P.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Pc)) : k("", !0);
  }
}, Vc = /* @__PURE__ */ U(Uc, [["__scopeId", "data-v-29b9c31b"]]), Gc = (e, t, n) => Math.max(t, Math.min(n, e)), Kc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Fl = /* @__PURE__ */ new WeakMap(), Yc = (e, t) => Fl.set(e, t);
function Qc(e, t) {
  for (let n = t; n; n = Fl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Wl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Qc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const Ot = 8, Jc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = S(null), o = (v) => v ? `${v}px` : void 0, l = M(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = S({ w: 0, h: 0 }), r = S(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), h = (v) => {
      const T = v.closest(".pane, .float-window");
      return T ? d(T.getBoundingClientRect()) : c();
    }, p = (v, T) => `${Math.max(0, v ? Math.min(v, T) : T)}px`;
    function g(v, T) {
      return {
        below: v.bottom - T.bottom - a.gap - Ot,
        above: T.top - v.top - a.gap - Ot,
        across: v.right - v.left - 2 * Ot
      };
    }
    function b(v) {
      const T = h(a.anchor), A = g(T, v);
      return i.value.w <= A.across && i.value.h <= Math.max(A.below, A.above) ? T : c();
    }
    const _ = M(() => {
      if (!r.value) return l.value;
      const v = r.value, T = b(v), A = g(T, v), { w: R, h: q } = i.value, N = a.align === "auto" ? v.left + v.right > T.left + T.right : a.align === "right", ee = Gc(N ? v.right - R : v.left, T.left + Ot, Math.max(T.left + Ot, T.right - R - Ot)), ie = q > A.below && A.above > A.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: p(a.maxHeight, A.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: p(a.maxHeight, A.below) };
      return { ...l.value, ...ie, left: `${ee}px`, maxWidth: p(a.maxWidth, A.across) };
    }), O = n, C = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function j(v) {
      const T = C(), A = T.indexOf(document.activeElement);
      T[(A + v + T.length) % T.length].focus();
    }
    const z = { ArrowDown: () => j(1), ArrowUp: () => j(-1), Escape: () => O("close") }, W = (v) => z[v.key] && (v.preventDefault(), z[v.key]()), B = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let G = 0;
    const P = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(B);
    });
    Wl(s, (v) => a.anchor && !a.anchor.contains(v.target) && O("close"));
    const L = (v, T) => ["top", "left", "right", "bottom"].some((A) => Math.abs(v[A] - T[A]) > 1), x = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let $ = 0;
    function w() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(v)) return O("close");
        L(v, r.value) && (r.value = v);
      }
      $ = requestAnimationFrame(w);
    }
    return Se(() => {
      a.anchor && s.value && Yc(s.value, a.anchor), B(), s.value && P.observe(s.value), !a.plain && C()[0] && C()[0].focus(), w();
    }), Re(() => {
      P.disconnect(), cancelAnimationFrame($), cancelAnimationFrame(G);
    }), t({ element: s }), (v, T) => (u(), H(ua, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", qe({
        ref_key: "panel",
        ref: s
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: _.value,
        onKeydown: W
      }), [
        me(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Is = /* @__PURE__ */ U(Jc, [["__scopeId", "data-v-3d203970"]]), Xc = { class: "split-button" }, Zc = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = S(null), s = S(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", Xc, [
      E(pe, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (r) => n("main"))
      }, {
        default: F(() => [
          me(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        E(pe, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (r) => s.value = !s.value)
        }, {
          default: F(() => [
            E(ve, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), H(Is, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: F(() => [
          me(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, ed = /* @__PURE__ */ U(Zc, [["__scopeId", "data-v-c258494d"]]), td = 0, nd = "/api/lines", ad = "/api/line", go = 5e3, yo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), bo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Sa = (e) => JSON.stringify(e.line), ko = () => new DOMException("cancelled", "AbortError");
class sd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Sa(t))) {
        Me.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, It));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), td));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(ko())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(ko()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(nd, yo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => bo(i.body, nt)), go);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, r) => i.resolve(l[r]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Me.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, nt), Date.now() - n < go ? this.slow.delete(Sa(t.body)) : this.slow.add(Sa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(ad, yo(t.body, t.signal), [bo(t.body, n)], n === nt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Hl = new sd(), od = "/api/window";
function ld(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${od}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: nt }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const zl = /* @__PURE__ */ new Map();
class id {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Qe({ buttons: [], missing: {} }), this.loading = Qe(!1), this.loaded = Qe(!1), this.failed = Qe(""), this.pending = null;
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
function sS(e, t) {
  const n = new id(e, t);
  return zl.set(e, n), n.load().catch(() => {
  }), n;
}
const Rs = (e) => zl.get(e);
function rd(e, t, n) {
  const a = Rs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function ud(e, t) {
  if (!e) return !0;
  const n = Rs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Kn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Ul = {};
async function oS(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Ul = (await t.json()).states);
}
const Bs = (e, t) => {
  var n;
  return (n = Ul[e]) == null ? void 0 : n[t];
}, on = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.label) ?? Kn(t);
}, Vl = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, cd = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, dd = Symbol("pane-page"), Ls = Symbol("inspector-host"), Gl = { 1: "refused", 2: "usage", 3: "fault" }, fd = 100, hd = 50, md = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, pd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function vd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = S({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: g = [], sources: b = [], links: _ = {}, search: O = {}, readOnly: C = !1, shared: j = null }) {
  const z = /* @__PURE__ */ new Map(), W = new AbortController(), B = S(!1), G = performance.now();
  let P = 0, L = 0, x = () => {
  };
  const $ = new Promise((q) => x = q);
  W.signal.addEventListener("abort", x, { once: !0 });
  const w = () => {
    clearTimeout(L), L = setTimeout(() => {
      P === 0 && Cs(G, () => {
        B.value = !0, x();
      });
    }, hd);
  }, v = (q, N) => (P += 1, Bt(e, q, t, W.signal, N).finally(() => {
    P -= 1, w();
  })), T = (q, N) => (w(), $.then(() => W.signal.aborted ? lt : Bt(e, q, t, W.signal, N))), A = ({ only: q = [], state: N = {} } = {}) => (P += 1, yd(() => ld(e, t, q, N, W.signal), W.signal).finally(() => {
    P -= 1, w();
  })), R = (q, { unbatched: N = !1, deferred: ee = !1 } = {}) => {
    const te = z.get(q);
    if (te && performance.now() - te.at < fd) return te.answer;
    const ie = ee && !B.value ? T(q, N) : v(q, N);
    return z.set(q, { answer: ie, at: performance.now() }), ie;
  };
  return {
    answered: B,
    settle: w,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: M(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: g,
    sources: b,
    links: _,
    search: O,
    readOnly: C,
    shared: j,
    read: R,
    readKeys: A,
    waitForServer: () => As() ? Dl() : null,
    run: (q) => Bt(e, q, t, W.signal),
    upload: (q) => kd(q, e, W.signal),
    cancel: () => W.abort(),
    signal: W.signal,
    subscriptions: l,
    follow: (q, N) => l.follow(e, [q].flat().filter((ee) => o.some((te) => Ts(te, ee))), (ee) => {
      z.clear(), N(ee);
    }, a),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (q) => M(() => {
      var N;
      return r.value[q] ?? ((N = c.find((ee) => ee.key === q)) == null ? void 0 : N.default);
    }),
    setting: async (q, N) => {
      const ee = await R(`window setting ${e} ${q}`);
      return ee.ok ? ee.value.value : N;
    },
    setOption: h,
    keep: (q, N) => Bt(e, ["window", "save-setting", e, q, JSON.stringify(N)], t, W.signal)
  };
}
function Kl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const lt = { ok: !1, failure: "cancelled", error: "" }, Ns = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Yl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? lt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Gl[n.code] || "fault", error: Kl(n.error) };
  } catch {
    return t != null && t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
const gd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Gl[e.code] || "fault", error: Kl(e.error) };
async function yd(e, t) {
  try {
    const n = await e();
    return t.aborted ? lt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, gd(s)])) } };
  } catch {
    return t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
async function Ql(e, t, n) {
  const a = await Yl(() => Hl.read(e, t, n), t);
  return a.failure !== "unreachable" || !As() ? a : (await Dl(), t.aborted ? lt : Ql(e, t, n));
}
function Bt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => bd(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : qs(t)));
}
async function bd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : qs(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, i) => Ql({ ...o, attribution: i }, l, s), a, o).catch(() => lt) : Yl(() => Hl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function kd(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? lt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
function qs(e) {
  return [...e.matchAll(md)].map(([t]) => t.replace(pd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const wd = (e) => `show-${e}`, lS = (e, t, n) => e.filter((a) => {
  var s;
  return n(wd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Jl = "messages.chat", $d = {
  key: 0,
  class: "template-brief"
}, xd = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Sd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S([]), o = S(""), l = M(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = M(() => s.value.find((c) => String(c.id) === n.value));
    async function r() {
      const c = await Bt(Jl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === d);
      h && a("pick", String(h.id));
    }
    return r(), (c, d) => (u(), f(D, null, [
      E(Pt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (u(), f("p", $d, y(i.value.brief), 1)) : k("", !0),
      o.value ? (u(), f("p", xd, y(o.value), 1)) : k("", !0)
    ], 64));
  }
}, _d = /* @__PURE__ */ U(Sd, [["__scopeId", "data-v-14be8a5c"]]), Md = { class: "info-tip" }, Cd = ["aria-label"], Ed = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Ad = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (u(), f("span", Md, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        E(ve, {
          name: "info",
          size: 13
        })
      ], 8, Cd),
      m("span", Ed, [
        (u(!0), f(D, null, ae(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, y(a), 1))), 128))
      ])
    ]));
  }
}, Xl = /* @__PURE__ */ U(Ad, [["__scopeId", "data-v-a2fe5ff1"]]), Od = { class: "form-field" }, Td = { class: "form-field-head" }, Id = ["for"], Rd = {
  key: 1,
  class: "form-field-aside"
}, Bd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Od, [
      m("div", Td, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, y(e.label), 9, Id),
        e.help ? (u(), H(Xl, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (u(), f("span", Rd, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Ld = /* @__PURE__ */ U(Bd, [["__scopeId", "data-v-302c40bf"]]), is = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Nd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ra(), n = M(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((u(), f("textarea", qe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [I(is), I(t).value]
    ]);
  }
}), qd = /* @__PURE__ */ U(Nd, [["__scopeId", "data-v-e130a5b9"]]), Dd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _s(), o = M(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), H(Ld, {
      label: e.field.label,
      for: I(s),
      "data-button-field": e.field.name
    }, {
      default: F(() => [
        E(Ut, { value: o.value }, {
          choice: F(() => [
            E(Pt, {
              id: I(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (r) => a("pick", r))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: F(() => [
            E(_d, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (r) => a("pick", r))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: F(() => [
            E(qd, {
              id: I(s),
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
}, da = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), H(pe, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: F(() => [
        E(ve, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Pd(e, t, n, a = () => window) {
  Se(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const jd = (e, t = () => !0) => Pd("keydown", (n) => n.key === "Escape" && t() && e());
function Zl(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = S(!1), s = M(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return jd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Fd = 80, Tt = Ht([]);
function ei(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return ge(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), M(() => Fd + Math.max(0, Tt.indexOf(t)));
}
let ti = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ti = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Wd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Hd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Wd)];
    if (!l.length) return o.preventDefault();
    const [i, r] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), r.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === r && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Se(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : ti, document.addEventListener("keydown", s), He(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const zd = ["aria-modal", "aria-label", "aria-labelledby"], Ud = {
  key: 0,
  class: "dialog-head"
}, Vd = ["id", "tabindex"], Gd = {
  key: 1,
  class: "dialog-foot"
}, Kd = 500, Yd = 400, Qd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Zl(a, n), i = ei(s), r = S(null), c = S(null), d = S(null), h = _s(), p = S(!1), g = Date.now();
    n.modal && Hd(c, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Yd);
    }
    function _(j) {
      !n.modal || Date.now() - g >= Kd || ![" ", "Enter"].includes(j.key) || (j.preventDefault(), j.stopPropagation());
    }
    const O = () => r.value && (r.value.scrollTop = r.value.scrollHeight), C = new MutationObserver(O);
    return ge(r, (j) => {
      C.disconnect(), j && n.follow && (C.observe(j, { childList: !0, subtree: !0, characterData: !0 }), O());
    }), Re(() => C.disconnect()), (j, z) => (u(), H(ua, { to: "body" }, [
      E(zt, {
        name: "dialog",
        appear: "",
        onAfterLeave: I(l)
      }, {
        default: F(() => [
          I(s) ? (u(), f("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: I(i) }),
            onClick: $e(b, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? I(h) : void 0,
              onKeydownCapture: _
            }, [
              e.bare ? k("", !0) : (u(), f("header", Ud, [
                m("h3", {
                  id: I(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, y(e.title), 9, Vd),
                e.closable ? (u(), H(da, {
                  key: 0,
                  onClick: I(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: r,
                class: Y(["dialog-body", { bare: e.bare }])
              }, [
                me(j.$slots, "default", {}, void 0, !0)
              ], 2),
              j.$slots.foot ? (u(), f("footer", Gd, [
                me(j.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, zd)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, fa = /* @__PURE__ */ U(Qd, [["__scopeId", "data-v-6d1ecd98"]]), Jd = {
  class: "action-output",
  "data-action-output": ""
}, Xd = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(fa, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: F(() => [
        m("pre", Jd, y(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Zd = /* @__PURE__ */ U(Xd, [["__scopeId", "data-v-423a045c"]]);
function ef(e) {
  const t = document.body.appendChild(document.createElement("div")), n = zr(Zd, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const tf = (e, t, n = {}) => qs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function vn(e, t, n, a = {}) {
  var s;
  try {
    if (!await ud(e.module, n)) return { ok: !1, error: "" };
    const o = await Bt(Jl, tf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && ef(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const nf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, _a = [
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
}), ha = {
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
    filters: _a
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: _a
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
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: _a }),
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
}, af = ["secrets", "plugins"], ni = Object.keys(ha).filter((e) => !(Il && af.includes(e)));
M(() => ni.map((e) => ({ name: e, ...ha[e] })));
const Vt = (e) => ha[e], ai = new Map(ni.flatMap((e) => [e, e.replace(/s$/, ""), ha[e].title.toLowerCase()].map((t) => [t, e]))), ht = (e) => ai.get(String(e).toLowerCase()) || "", si = [...ai.keys()].sort((e, t) => t.length - e.length).join("|"), sf = {
  class: "button-form",
  "data-button-form": ""
}, of = {
  key: 0,
  class: "button-form-title"
}, lf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, rf = { class: "button-form-actions" }, uf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = S(!1), l = S(""), i = M(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = M(() => {
      var h;
      if (!n.row) return n.button.label;
      const d = ((h = Vt(ht(n.row.noun))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const d = await vn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, h) => (u(), H(fa, {
      title: r.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: F(() => {
        var p;
        return [
          m("div", sf, [
            (p = e.row) != null && p.title ? (u(), f("p", of, y(e.row.title), 1)) : k("", !0),
            (u(!0), f(D, null, ae(e.button.fields, (g) => (u(), H(Dd, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (b) => s.value[g.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", lf, y(l.value), 1)) : k("", !0),
            m("div", rf, [
              E(pe, {
                small: "",
                onClick: h[0] || (h[0] = (g) => a("close"))
              }, {
                default: F(() => [...h[2] || (h[2] = [
                  ne("Cancel", -1)
                ])]),
                _: 1
              }),
              E(pe, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: F(() => [...h[3] || (h[3] = [
                  ne("Send", -1)
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
}, cf = /* @__PURE__ */ U(uf, [["__scopeId", "data-v-f26c27a7"]]), df = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ff = {
  key: 1,
  class: "menu-item-text"
}, hf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", df, y(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (u(), f("span", ff, [
        m("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, y(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, jt = /* @__PURE__ */ U(hf, [["__scopeId", "data-v-fec99974"]]), mf = ["aria-busy"], pf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, vf = { class: "button-slot-confirm-text" }, gf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, yf = {
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
    const n = e, a = t, s = M(() => Rs(n.environment)), o = M(
      () => {
        var C;
        return !n.readOnly && ((C = s.value) == null ? void 0 : C.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = M(() => {
      var C;
      return !n.readOnly && ((C = s.value) == null ? void 0 : C.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = M(() => n.readOnly ? [] : rd(n.environment, n.name, n.row)), c = S(null), d = S(null), h = S(""), p = S(!1), g = (C) => [C.from ? `From ${C.from}` : "", C.tip, C.warning].filter(Boolean).join(" · "), b = (C) => C.icon || (C.warning ? "dot" : "");
    function _(C) {
      if (!(p.value || n.readOnly)) {
        if (C.fields.length) {
          c.value = C;
          return;
        }
        if (C.confirm) {
          d.value = C;
          return;
        }
        return O(C);
      }
    }
    async function O(C) {
      d.value = null, h.value = "", a("failure", ""), p.value = !0;
      const j = await vn(C, n.row, n.environment);
      p.value = !1, h.value = j.ok ? "" : j.error;
      const z = C.label.toLowerCase() + (n.objectName && !C.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", j.ok ? "" : `Could not ${z}: ${j.error}`), j.ok && a("done");
    }
    return (C, j) => (u(), f("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), f(D, { key: 0 }, [
        j[5] || (j[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        E(pe, {
          small: "",
          onClick: i
        }, {
          default: F(() => [...j[4] || (j[4] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", pf, [
        m("span", vf, y(d.value.confirm), 1),
        E(pe, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: Y({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: j[0] || (j[0] = (z) => O(d.value))
        }, {
          default: F(() => [
            ne(y(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        E(pe, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: j[1] || (j[1] = (z) => d.value = null)
        }, {
          default: F(() => [...j[6] || (j[6] = [
            ne("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (u(), f(D, { key: 2 }, [
        (u(!0), f(D, null, ae(r.value, (z) => (u(), f(D, {
          key: z.name
        }, [
          z.menu.length ? (u(), H(ed, {
            key: 0,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": z.menu_label || "More ways",
            title: g(z),
            "data-button": z.name,
            onMain: (W) => _(z)
          }, {
            menu: F(({ close: W }) => [
              (u(!0), f(D, null, ae(z.menu, (B) => (u(), H(jt, {
                key: B.label,
                description: B.description,
                onClick: (G) => (W(), _({ ...z, ...B, menu: [] }))
              }, {
                default: F(() => [
                  ne(y(B.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: F(() => [
              ne(y(z.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), H(pe, {
            key: 1,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            bordered: !z.primary,
            class: Y({ danger: z.danger }),
            icon: b(z),
            disabled: p.value,
            title: g(z),
            "data-button": z.name,
            onClick: (W) => _(z)
          }, {
            default: F(() => [
              ne(y(z.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", gf, y(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (u(), H(cf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: j[2] || (j[2] = (z) => c.value = null),
          onDone: j[3] || (j[3] = (z) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, mf));
  }
}, Ds = /* @__PURE__ */ U(yf, [["__scopeId", "data-v-a4b6f174"]]), bf = {
  class: "running",
  "data-running-command": ""
}, kf = ["title"], wf = {
  key: "idle",
  class: "running-idle"
}, $f = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", bf, [
      E(zt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: F(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, y(e.text), 9, kf)) : (u(), f("span", wf, y(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, iS = /* @__PURE__ */ U($f, [["__scopeId", "data-v-d3240219"]]), xf = ["aria-checked", "aria-label", "title"], Sf = {
  key: 0,
  class: "switch-inner"
}, _f = {
  key: 0,
  class: "switch-word"
}, Mf = {
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
        e.labelled ? (u(), f("span", Sf, y(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", _f, y(e.word), 1)) : k("", !0)
    ], 10, xf));
  }
}, rS = /* @__PURE__ */ U(Mf, [["__scopeId", "data-v-1bfb90f3"]]);
function oi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Yn(e, t) {
  return oi(() => localStorage, e, t);
}
function li(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ps(e, t) {
  return li(() => localStorage, e, t);
}
function ii(e, t) {
  ge(t, (n) => Ps(e, n), { deep: !0 });
}
function Cf(e, t) {
  return oi(() => sessionStorage, e, t);
}
function Ef(e, t) {
  return li(() => sessionStorage, e, t);
}
const Qn = "journal.environment", ri = S(Cf(Qn, Yn(Qn, "")));
function Af(e) {
  ri.value = e, Ef(Qn, e), Ps(Qn, e);
}
const Jn = S(location.hash), wo = Qe(null), $o = { integrations: "mcp", library: "team" };
function Of() {
  if (!wo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if ($o[n]) {
    location.replace(`#/${[$o[n], ...a].join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash;
    return;
  }
  !n || wo.value(n) || (Af(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jn.value = location.hash, Of();
});
const rs = M(() => {
  const [e, t = ""] = Jn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, r = ""] = l.split("@"), [c = "", d = "", h = ""] = i.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: r };
  });
  return {
    env: ri.value,
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
function Tf(e = "", t = 0, n = "") {
  location.hash = js.page(e, t, n);
}
function If(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Rf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function ui(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Rf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Nt = {};
function uS(e, t) {
  return Nt[e] = t, () => Nt[e] === t && delete Nt[e];
}
function vt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Nt[e]) != null && l.call(Nt, t))) return;
  const s = rs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  ui([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Bf(e, t, n, a = 0, s = "") {
  if (e === rs.value.env) return vt(t, n, a, s);
  const o = rs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  ui([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Bf(a, s, Number(o), 0, t) : vt(s, Number(o), 0, t);
}
function Lf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Lt(e) {
  const t = Lf(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function cS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Nf = { class: "inspector-part" }, qf = { class: "inspector-part-title" }, Df = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", Nf, [
      m("h4", qf, y(e.title), 1),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, dS = /* @__PURE__ */ U(Df, [["__scopeId", "data-v-5175e4a3"]]), xo = /* @__PURE__ */ new Map(), Pf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = S(null), a = S(!1), s = S(t.name && xo.get(t.name) || !1);
    function o(r) {
      s.value = r, t.name && xo.set(t.name, r);
    }
    const l = () => {
      const r = !!n.value && n.value.scrollHeight > t.at;
      r !== a.value && (a.value = r);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Se(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (r, c) => (u(), f(D, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ye(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (d) => o(!0))
      }, [
        me(r.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = $e((d) => o(!s.value), ["stop"]))
      }, y(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, jf = /* @__PURE__ */ U(Pf, [["__scopeId", "data-v-4d2235ba"]]), Ff = ["aria-valuenow", "aria-valuemax"], Wf = {
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
    return (a, s) => (u(), f("span", {
      class: Y(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      m("span", {
        class: "fill",
        style: ye({ width: n.value })
      }, null, 4)
    ], 10, Ff));
  }
}, ci = /* @__PURE__ */ U(Wf, [["__scopeId", "data-v-9eba6a85"]]), Hf = { processes: "process", memories: "memory", replies: "reply" }, Xn = (e) => (Hf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), us = [], zf = 2e3, ct = /* @__PURE__ */ new Map(), Uf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Vf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? us.unshift(e) : us.push(e), ct.clear();
}
function di(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Gf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Kf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ot(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Yf(e, t) {
  const n = [{ type: "text", text: ot(e).replace(/\r\n/g, `
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
function ln(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Qf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Qf(e) {
  return e.split(Vf).map((t, n) => n % 2 ? t : t.replace(Uf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function So(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Jf = 24;
function Xf(e) {
  const [t, , ...n] = e, a = So(t), s = n.map(So), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > Jf) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${ln(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${ln(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const fi = /^\s*(?:[-*+]|\d+[.)])\s+/, cs = /^\s*(\d+)[.)]\s/, _o = (e) => e.match(/^\s*/)[0].length;
function hi(e) {
  const t = e[0].match(cs), n = _o(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && _o(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${ln(o.text)}${o.nested.length ? hi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Zf(e, t) {
  const n = cs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (fi.test(e[s]) && cs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Mo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function mi(e) {
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
      n.push(`<h${i}>${ln(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Mo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Xf(t.slice(a, i))), a = i;
      continue;
    }
    if (fi.test(s)) {
      const i = Zf(t, a);
      n.push(hi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${mi(
          t.slice(a, i).map((r) => r.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Mo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${ln(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const eh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, th = (e) => e.type !== "text" && !eh.test(e.html);
function nh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(mi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : th(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Fs(e, t = { env: "" }) {
  const n = Kf(e, t), a = ct.get(n);
  if (ct.delete(n), a && a.source === t.source && a.reads.every((l) => Gf(l, t)))
    return ct.set(n, a), a.html;
  const s = [], o = nh(Yf(e, { ...t, reads: s }));
  return ct.set(n, { html: o, reads: s, source: t.source }), ct.size > zf && ct.delete(ct.keys().next().value), o;
}
const Ma = /* @__PURE__ */ new WeakMap();
function ah(e) {
  if (Ma.has(e)) return Ma.get(e);
  const t = Ur(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const h = s(c, d), p = e.read(`${Xn(c)} show ${d}`);
    n.set(h, p), p.then((g) => {
      n.get(h) === p && (n.delete(h), t.set(h, g.ok ? { ...g.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Xn(c).replace(/-/g, "_")}.*`], (d) => {
      const h = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(h)) continue;
        const g = Number(p.slice(h.length));
        (!d.row_id || d.row_id === g) && o(c, g);
      }
    }));
  }
  function i(c, d) {
    l(c);
    const h = s(c, d);
    return !t.has(h) && !n.has(h) && o(c, d), t.get(h);
  }
  const r = { id: Symbol("window text rows"), row: i };
  return Ma.set(e, r), r;
}
function pi() {
  const e = Ce(De, null), t = e ? ah(e) : null;
  return (n, a = {}) => Fs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const vi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, gn = (e) => String(e || "").replace(vi, (t, n, a, s) => s), sh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Tn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, oh = /^Traceback \(most recent call last\):/m, lh = 8;
function gi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, lh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function ih(e) {
  const t = [...e.matchAll(sh)].map((a) => a.index);
  if (Tn.lastIndex = 0, !t.length || !Tn.test(e)) return null;
  Tn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Tn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: gi(n), tail: "" } : null;
}
function rh(e) {
  const t = oh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: gi([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = gn(e), n = rh(t) || ih(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Zn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, yi = (e) => `${e.table}:${e.id}`, Co = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ca = 80;
function Eo(e) {
  return e.length <= Ca ? e : `${e.slice(0, Ca + 1).replace(/\s+\S*$/, "") || e.slice(0, Ca)}…`;
}
const Ao = {
  messages: (e) => Eo(Co(e.text)),
  comments: (e) => Eo(Co(e.text)),
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
}, uh = (e) => (Ao[e.table] ? Ao[e.table](e) : e.title || "") || "", Ct = (e) => Zn(e.created_at), ch = (e) => Zn(e.updated_at) || Ct(e), dh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, fh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function hh(e) {
  const t = dh.exec(e);
  if (t && ht(t[1])) return { at: t.index, length: t[0].length, table: ht(t[1]), id: Number(t[2]), label: t[3] };
  const n = fh.exec(e), a = n && ht(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function mh(e, t, n, a) {
  const s = di(a, e, t), o = gn(s ? uh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ot(Vt(e).title)} ${t}</span><span class="row-card-title">${ot(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = hh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: mh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ph = /\.(png|jpe?g|gif|webp|svg)$/i, vh = (e) => ph.test(e), gh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, yh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function bh(e, t) {
  const n = gh.exec(e), [, a, s, o, l, i] = n || [], r = n && ht(a || o), c = r && di(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Vt(r).title} ${c.id} · ${ot(i)}`, p = vh(i) ? `<img class="file-card-image" src="${d}" alt="${ot(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${ot(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function kh(e) {
  const t = yh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ot(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = bh(e, t) || kh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const wh = /`([^`\n]+)`/g;
Et((e) => e.replace(wh, (t, n) => `<code>${n}</code>`));
const Oo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${js.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(vi, (n, a, s, o) => Oo[a] ? Oo[a](s, o, t) : o)
);
const $h = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, bi = new RegExp(`\\b(${si}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), ki = new RegExp(`\\b(${si}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), xh = new RegExp(`<code>((?:${bi.source}|${ki.source}))</code>`, "gi"), Sh = (e) => e.replace(xh, "$1"), _h = (e, t) => `<a class="row-pill" href="#" data-peek="${ht(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Mh = (e) => e.replace(ki, (t, n, a) => a.replace(/\d+/g, (s) => _h(n.replace(/s$/i, ""), s))), Ch = (e) => Mh(e).replace(
  bi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ht(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Sh(e).split($h).map((n, a) => a % 2 ? n : Ch(n)).join("")
);
const Eh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Ah = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Oh = /[\w\]]\(/, Th = /^[\w$.[\]'"]+\s*=\s*[^=]/, Ih = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Rh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Bh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Lh = /[[({,]$/, Nh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, qh = /^(\t|\s{2,})\S/, Dh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Ph = /`[^`]+`/, jh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Fh = /[{}()[\];=<>$&|*\\@+^~%]/g, wi = /^\s*(?:[-*+]|\d+[.)])\s/, Wh = /^\s*>/, Hh = /^\s*\|/, zh = 0.6, Uh = 0.4, Vh = 5, Gh = 0.03, $i = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Vh && t.every((n) => jh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Fh) ?? []).length / e.length < Gh;
}, Ea = (e) => {
  const t = e.trim();
  return Ph.test(t) ? !1 : [Eh, Ah, Oh, Th, Ih, Rh, Bh, Lh, Nh].some((n) => n.test(t)) || /[;{}]$/.test(t) || qh.test(e) && !wi.test(e) && !$i(e);
};
function Kh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || wi.test(t[0]) || t.every((o) => Wh.test(o) || Hh.test(o))) return "text";
  const n = t.filter((o) => !Dh.test(o.trim()));
  if (t.length === 1) return !n.length || Ea(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ea).length, s = n.filter((o) => !Ea(o) && $i(o)).length;
  return a >= n.length * zh && s <= n.length * Uh ? "code" : "text";
}
const ds = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Yh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Qh = `${ds} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Jh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Xh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", To = {
  js: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Yh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Qh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Jh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Xh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Zh = {
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
function Io(e, t, n) {
  return n && e.startsWith(n, t);
}
function em(e, t) {
  const n = To[Zh[t] ?? t] || To.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Io(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Io(e, o, n.block[0])) {
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
function tm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of em(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ot(l) : `<span class="tok-${a}">${ot(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function nm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const am = 1500, Ro = /* @__PURE__ */ new WeakMap();
async function sm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await nm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ro.get(t)), Ro.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, am)
  )));
}
typeof document < "u" && document.addEventListener("click", sm, !0);
const om = /\n\s*\n/, lm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, im = /^\s*(`{3,}|~{3,})\s*$/, rm = /^\s{4,}\S/, um = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, fs = /^\s*(?:[-*+]|\d+[.)])\s/, xi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, cm = [
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
function dm(e) {
  const t = Ws(e.join(`
`));
  return (cm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const fm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && xi.test(t) && !fs.test(t);
}, hm = (e, t) => fs.test(t) || fs.test([...e].reverse().find((n) => n.trim()) || "");
function Hs(e, t) {
  const n = t || dm(e), a = tm(Ws(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function mm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && im.test(s));
  return a < 0 ? e.length : a;
}
function pm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Hs(a.map(gn), n ? n.toLowerCase() : "");
}
function vm(e) {
  const t = e.split(om).map((l) => ({ paragraph: l, type: Kh(Ws(l).split(`
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
`).map(gn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function gm(e, t) {
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
    const i = n[l].match(lm);
    if (i) {
      const c = mm(n, l, i[2]);
      o(), a.push(pm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const r = fm(s) ? um : rm;
    if (!t && r.test(n[l]) && !hm(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && xi.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - l + d.length >= 2) {
        o(), a.push(Hs([...d, ...n.slice(l, c)].map(gn), "")), l = c;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => gm(e, t.document), { first: !0 });
const ym = ["innerHTML"], bm = ["innerHTML"], km = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = pi(), a = M(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => I(Lt) && I(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, ym)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => I(Lt) && I(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, bm));
  }
}, at = /* @__PURE__ */ U(km, [["__scopeId", "data-v-d8e75741"]]), Bo = (e) => [...new Set(e.agents.map((t) => t.name))], wm = (e) => Bo(e).length === 1 ? `Worker: ${Bo(e)[0]}` : "Delegated", $m = ["aria-expanded"], xm = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Sm = {
  key: 0,
  class: "tip-failure"
}, _m = { key: 1 }, Mm = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Ce(De, null), a = M(() => cd(t.type, t.state)), s = S(!1), o = S([]), l = S("");
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
      ne(y(I(on)(e.type, e.state)) + " ", 1),
      s.value ? (u(), f("span", xm, [
        l.value ? (u(), f("span", Sm, y(l.value), 1)) : k("", !0),
        (u(!0), f(D, null, ae(o.value, (p, g) => (u(), f("span", {
          key: g,
          class: "tip-line"
        }, y(p), 1))), 128))
      ])) : k("", !0)
    ], 40, $m)) : (u(), f("span", _m, y(I(on)(e.type, e.state)), 1));
  }
}, Cm = /* @__PURE__ */ U(Mm, [["__scopeId", "data-v-73ac4596"]]), Em = {
  class: "plan-details",
  "data-plan-details": ""
}, Am = { class: "state-line" }, Om = {
  key: 0,
  class: "phase-count"
}, Tm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Im = { class: "text" }, Rm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Bm = { class: "overall" }, Lm = { class: "overall-figure" }, Nm = {
  key: 2,
  class: "delegation",
  "data-plan-delegated": ""
}, qm = {
  key: 3,
  class: "part"
}, Dm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (u(), f("div", Em, [
      m("div", Am, [
        E(Cm, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: Y(["status", I(Vl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Om, "Phase " + y(e.plan.current_phase) + " of " + y(e.plan.phases.length), 1)) : k("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Tm, [
        m("h4", null, y(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Im, y(e.plan.reason), 1)
      ])) : k("", !0),
      e.plan.total ? (u(), f("section", Rm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Bm, [
          E(ci, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Lm, y(e.plan.finished) + " of " + y(e.plan.total) + " done", 1)
        ])
      ])) : k("", !0),
      e.plan.delegated ? (u(), f("p", Nm, y(I(wm)(e.plan)), 1)) : k("", !0),
      e.plan.brief ? (u(), f("section", qm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        E(jf, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: F(() => [
            E(at, {
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
}, fS = /* @__PURE__ */ U(Dm, [["__scopeId", "data-v-43c8af15"]]), Pm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, jm = { ...Pm, done: "Completed" }, Fm = /* @__PURE__ */ new Set(["completed", "cancelled"]), Wm = (e) => Fm.has(e), rn = (e) => Wm(e) ? "done" : e, Hm = { class: "task-status-icon" }, zm = ["width", "height", "aria-label"], Um = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = M(() => Vl("task", rn(t.status))), a = M(() => n.value === "testing" ? "started" : n.value), s = M(() => jm[t.status] ?? on("task", t.status));
    return (o, l) => (u(), f("span", Hm, [
      E(zt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: F(() => [
          (u(), f("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            E(Ut, { value: a.value }, {
              blocked: F(() => [...l[0] || (l[0] = [
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
              done: F(() => [...l[1] || (l[1] = [
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
              started: F(() => [...l[2] || (l[2] = [
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
              asked: F(() => [...l[3] || (l[3] = [
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
              paused: F(() => [...l[4] || (l[4] = [
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
              planned: F(() => [...l[5] || (l[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: F(() => [...l[6] || (l[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, zm))
        ]),
        _: 1
      })
    ]));
  }
}, yn = /* @__PURE__ */ U(Um, [["__scopeId", "data-v-ae24a63f"]]), Vm = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Gm = ["title", "onClick"], Km = { class: "agent-word" }, Ym = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = M(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((r) => r.helper_id && !n.has(r.state))) {
        const r = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, held: r });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (u(), f("div", Vm, [
      (u(!0), f(D, null, ae(s.value, (i) => (u(), f("button", {
        key: i.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${i.name}`,
        "data-plan-phase-agent": "",
        onClick: (r) => I(Ne)(`agents:${i.id}`)
      }, [
        m("span", {
          class: Y(["agent-dot", { held: i.held }])
        }, null, 2),
        ne(" " + y(i.name) + " ", 1),
        m("span", Km, y(i.held ? "Working" : "Queued"), 1)
      ], 8, Gm))), 128))
    ])) : k("", !0);
  }
}, Qm = /* @__PURE__ */ U(Ym, [["__scopeId", "data-v-0c589695"]]), Jm = { class: "phases" }, Xm = { class: "phead" }, Zm = { class: "mark" }, ep = { class: "ptitle" }, tp = { class: "phead-end" }, np = {
  key: 0,
  class: "checkpoint"
}, ap = { class: "progress" }, sp = {
  key: 0,
  class: "when"
}, op = ["onClick"], lp = { class: "row-id" }, ip = { class: "row-title" }, rp = ["title"], up = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((i) => n.has(i.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, i) => (u(), f("ol", Jm, [
      (u(!0), f(D, null, ae(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: Y(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", Xm, [
          m("span", Zm, [
            E(ve, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", ep, y(c + 1) + ". " + y(r.title), 1),
          m("span", tp, [
            r.checkpoint ? (u(), f("span", np, "checkpoint")) : k("", !0),
            m("span", ap, y(s(r)) + "/" + y(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", sp, y(r.goal), 1)) : k("", !0),
        E(Qm, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(D, null, ae(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: Y(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          E(yn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", lp, "#" + y(d.id), 1),
          m("span", ip, y(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, y(d.helper_name), 9, rp)) : k("", !0)
        ], 10, op))), 128))
      ], 2))), 128))
    ]));
  }
}, hS = /* @__PURE__ */ U(up, [["__scopeId", "data-v-6a600744"]]), cp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, dp = {
  key: 0,
  class: "empty",
  role: "alert"
}, fp = {
  key: 2,
  class: "empty"
}, hp = { class: "day" }, mp = { class: "events" }, pp = { class: "mark" }, vp = { class: "what" }, gp = { class: "head" }, yp = { class: "word" }, bp = ["title", "onClick"], kp = { class: "at" }, wp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = S(null), l = S(""), i = M(() => {
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
    return ge(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", cp, [
      l.value ? (u(), f("p", dp, y(l.value), 1)) : o.value === null ? (u(), H(Ge, { key: 1 })) : o.value.length ? k("", !0) : (u(), f("p", fp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(D, null, ae(i.value, (p) => (u(), f(D, {
        key: p.day
      }, [
        m("h3", hp, y(p.day), 1),
        m("ol", mp, [
          (u(!0), f(D, null, ae(p.items, (g) => (u(), f("li", {
            key: `${g.time}-${g.event_type}-${g.task_id}`,
            class: Y(["event", g.event_type]),
            "data-plan-event": ""
          }, [
            m("span", pp, [
              n[g.event_type].state ? (u(), H(yn, {
                key: 0,
                status: n[g.event_type].state
              }, null, 8, ["status"])) : (u(), H(ve, {
                key: 1,
                name: n[g.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", vp, [
              m("div", gp, [
                m("span", yp, y(n[g.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${g.task_id}`,
                  onClick: (b) => s("select", g.task_id)
                }, "#" + y(g.task_id) + " " + y(g.title), 9, bp),
                m("span", kp, y(r(g.time)), 1)
              ]),
              g.text ? (u(), H(at, {
                key: 0,
                class: "text",
                text: g.text
              }, null, 8, ["text"])) : k("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, mS = /* @__PURE__ */ U(wp, [["__scopeId", "data-v-9e511133"]]);
function $p(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function zs(e, t = Date.now()) {
  const n = $p(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const xp = 36e5;
function Sp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / xp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Lo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Si(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function No(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Aa = (e) => String(e).padStart(2, "0");
function _i(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Aa(t % 60)}s` : `${Math.floor(t / 3600)}h ${Aa(Math.floor(t % 3600 / 60))}m ${Aa(t % 60)}s`;
}
const _p = 1e3;
function Mi() {
  const e = S(Date.now()), t = setInterval(() => e.value = Date.now(), _p);
  return Ze(() => clearInterval(t)), e;
}
const Mp = Symbol("resource-subscriptions");
function bn(e, t) {
  const n = Ce(Mp, () => new Pl(), !0), a = Os(t, 100), s = n.follow("resources", e, a);
  ca(() => {
    s(), a.cancel();
  });
}
const Cp = "Not known", Ep = 80, Ap = 1e3, Op = "worker", Tp = "main", Ip = /* @__PURE__ */ new Set(["waiting", "blocked"]), Ci = (e) => e.ok ? e.value.rows : [], qo = (e) => e.ok ? e.value.total : 0, Ei = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Rp = (e, t) => (t == null ? void 0 : t.given_name) || Ei((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Bp = (e, t) => e.ended_at ? "ended" : e.paused_at || Ip.has(t == null ? void 0 : t.state) ? "waiting" : "running", Lp = (e, t) => [(t == null ? void 0 : t.profile) && Ei(t.profile_title || t.profile), e.program, t == null ? void 0 : t.model, (t == null ? void 0 : t.effort) && `${t.effort} effort`].filter(Boolean), Ai = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Np({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Ap, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: _i(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Ep }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Cp : `$${t.cost_dollars.toFixed(2)}` }), e.role === Op && l.push({ key: "pace", label: "Tasks an hour", value: String(Sp(Ai(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Tp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function qp(e) {
  const t = Ai(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Dp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Lo(e.created_at)]), e.ended_at && n.push(["Ended", Lo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const Pp = { class: "band" }, jp = { key: 0 }, Fp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", Pp, [
      E(ve, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      me(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", jp, y(e.count), 1)) : k("", !0)
    ]));
  }
}, Ft = /* @__PURE__ */ U(Fp, [["__scopeId", "data-v-1758914f"]]), Wp = { class: "number" }, Hp = { class: "text" }, zp = 150, Up = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = S(!1), a = M(() => t.text.length > zp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(D, null, [
      e.text ? (u(), f(D, { key: 0 }, [
        E(Ft, { icon: "file" }, {
          default: F(() => [
            ne(y(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
          class: Y(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, y(e.text), 3),
        a.value && !n.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (u(), f(D, { key: 1 }, [
        E(Ft, { icon: "points" }, {
          default: F(() => [...l[1] || (l[1] = [
            ne("Points to prove", -1)
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
            m("span", Wp, y(i.id), 1),
            m("span", Hp, [
              ne(y(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, y(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, Vp = /* @__PURE__ */ U(Up, [["__scopeId", "data-v-c99de22c"]]), Gp = ["aria-expanded"], Kp = { class: "count" }, Yp = {
  key: 0,
  "data-agent-fold-body": ""
}, Qp = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Dt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = an(e, "open");
    return (n, a) => (u(), f(D, null, [
      m("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        E(ve, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        ne(y(e.label), 1),
        m("span", Kp, y(e.count), 1),
        E(ve, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Gp),
      t.value ? (u(), f("div", Yp, [
        me(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Oa = /* @__PURE__ */ U(Qp, [["__scopeId", "data-v-7f93d8d9"]]), Jp = ["onClick"], Xp = { class: "text" }, Zp = { class: "aside" }, e1 = {
  key: 0,
  class: "none"
}, t1 = {
  class: "skills",
  "data-agent-skills": ""
}, n1 = {
  key: 0,
  class: "none-inline"
}, a1 = { class: "label" }, s1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Ht({ helpers: !1, skills: !1 }), a = S([]), s = S([]), o = async (i) => Ci(await t.read(i));
    ge(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ge(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Kn(i.role)} ${i.id}`;
    return (i, r) => (u(), f(D, null, [
      E(Oa, {
        open: n.helpers,
        "onUpdate:open": r[0] || (r[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: F(() => [
          (u(!0), f(D, null, ae(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => I(vt)("agents", c.id)
          }, [
            m("span", Xp, y(l(c)), 1),
            m("span", Zp, y(I(Kn)(c.role)) + " " + y(c.id), 1)
          ], 8, Jp))), 128)),
          a.value.length ? k("", !0) : (u(), f("p", e1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Oa, {
        open: n.skills,
        "onUpdate:open": r[1] || (r[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: F(() => [
          m("p", t1, [
            (u(!0), f(D, null, ae(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, y(c.skill), 1))), 128)),
            s.value.length ? k("", !0) : (u(), f("span", n1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Oa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: F(() => [
          (u(!0), f(D, null, ae(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", a1, y(c) + ":", 1),
            m("span", {
              class: Y(["value", h])
            }, y(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, o1 = /* @__PURE__ */ U(s1, [["__scopeId", "data-v-358a0300"]]), l1 = ["datetime", "title"], Xe = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Mi(), a = M(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, y(I(zs)(e.at, I(n))), 9, l1));
  }
}, i1 = {
  class: "now",
  "data-agent-now": ""
}, r1 = {
  key: 1,
  class: "muted"
}, u1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, c1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, d1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, f1 = { class: "line" }, h1 = { class: "detail" }, m1 = { class: "bar" }, p1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = M(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(D, null, [
      E(Ft, { icon: "play" }, {
        default: F(() => [...o[2] || (o[2] = [
          ne("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", i1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => I(vt)("tasks", e.inspection.task.id))
        }, "Task " + y(e.inspection.task.id) + ": " + y(e.inspection.task.title), 1)) : (u(), f("span", r1, y(e.nothing), 1)),
        n.value ? (u(), f("span", u1, y(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (u(), f("span", c1, [
          o[3] || (o[3] = ne("Last heard: ", -1)),
          E(Xe, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", d1, [
        m("div", f1, [
          m("span", null, "Plan " + y(e.inspection.plan.id) + ", phase " + y(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => I(vt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", h1, y(e.inspection.plan.done) + " of " + y(e.inspection.plan.total) + " tasks done", 1),
        m("div", m1, [
          m("i", {
            style: ye({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, v1 = /* @__PURE__ */ U(p1, [["__scopeId", "data-v-cbe6a9f7"]]), g1 = ["onClick"], y1 = { class: "text" }, b1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, k1 = { class: "text" }, w1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, $1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(D, null, [
      E(Ft, { icon: "clock" }, {
        default: F(() => [...n[0] || (n[0] = [
          ne("Recent", -1)
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
          onClick: (s) => I(vt)(a.table, a.id)
        }, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", y1, y(a.text), 1),
          E(Xe, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, g1)) : (u(), f("div", b1, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", k1, y(a.text), 1),
          E(Xe, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (u(), f("p", w1, "Nothing yet."))
    ], 64));
  }
}, x1 = /* @__PURE__ */ U($1, [["__scopeId", "data-v-58f0db57"]]), S1 = {
  class: "strip",
  "data-agent-strip": ""
}, _1 = ["data-agent-cell"], M1 = {
  key: 0,
  class: "meter"
}, C1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", S1, [
      (u(!0), f(D, null, ae(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, y(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, y(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", M1, [
          m("i", {
            class: Y({ high: a.high }),
            style: ye({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, _1))), 128))
    ]));
  }
}, E1 = /* @__PURE__ */ U(C1, [["__scopeId", "data-v-b6657ab7"]]), A1 = {
  class: "who",
  "data-agent-who": ""
}, O1 = { class: "name" }, T1 = ["data-agent-state"], I1 = {
  class: "sub",
  "data-agent-identity": ""
}, R1 = {
  class: "sub",
  "data-agent-started-by": ""
}, B1 = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, parts: { type: Array, required: !0 }, startedBy: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", A1, [
      m("h2", O1, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, T1),
        ne(y(e.name), 1)
      ]),
      m("p", I1, y(e.parts.join(" · ")), 1),
      m("p", R1, "Started by: " + y(e.startedBy), 1)
    ]));
  }
}, L1 = /* @__PURE__ */ U(B1, [["__scopeId", "data-v-cf32a62c"]]), N1 = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, q1 = { class: "scroll" }, D1 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, P1 = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, j1 = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Mi(), a = S(null), s = S(null), o = S(null), l = S({}), i = S({ helpers: 0, skills: 0 }), r = S(0), c = S([]), d = S("");
    let h = 0;
    const p = M(() => {
      var b;
      return a.value.ended_at ? qp(s.value) : `It has no task.${(b = s.value) != null && b.instruction ? " It was given an instruction." : ""}`;
    });
    async function g() {
      const b = ++h, _ = await t.read(["agent", "show", String(t.id)]);
      if (b !== h) return;
      if (!_.ok) return void (d.value = _.error);
      const O = String(t.id), C = _.value.role === "worker", [j, z, W, B, G, P] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", O, "--environment", t.environment]),
        t.read(["usage", "agent", O]),
        _.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", O]),
        t.read(["agent", "list", "--parent", O, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", O, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        C ? t.read(["worker-worktree", "points", "--agent", O]) : { ok: !1 }
      ]);
      b === h && (d.value = z.ok ? "" : z.error, a.value = _.value, s.value = Ci(j).find((L) => L.id === t.id) ?? null, o.value = z.ok ? z.value : null, l.value = W.ok ? W.value : {}, i.value = { helpers: qo(B), skills: qo(G) }, c.value = P.ok ? P.value.points : [], r.value += 1);
    }
    return bn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], g), Se(g), (b, _) => {
      var O;
      return u(), f("article", N1, [
        m("div", q1, [
          d.value ? (u(), f("p", D1, y(d.value), 1)) : a.value && o.value ? (u(), f(D, { key: 1 }, [
            E(L1, {
              name: I(Rp)(a.value, s.value),
              state: I(Bp)(a.value, s.value),
              parts: I(Lp)(a.value, s.value),
              "started-by": o.value.started_by
            }, null, 8, ["name", "state", "parts", "started-by"]),
            E(E1, {
              cells: I(Np)({ row: a.value, facts: s.value, inspection: o.value, now: I(n) })
            }, null, 8, ["cells"]),
            E(v1, {
              inspection: o.value,
              tool: l.value,
              nothing: p.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            E(Vp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((O = s.value) == null ? void 0 : O.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            E(x1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            E(o1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: r.value,
              details: I(Dp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", P1, "Ended " + y(I(zs)(a.value.ended_at, I(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (u(), H(Ge, { key: 2 }))
        ])
      ]);
    };
  }
}, pS = /* @__PURE__ */ U(j1, [["__scopeId", "data-v-40345b29"]]), F1 = ["aria-expanded"], W1 = { class: "drop-label" }, H1 = ["value"], z1 = {
  key: 1,
  class: "drop-lead"
}, U1 = { class: "drop-item-text" }, V1 = {
  key: 2,
  class: "drop-note"
}, G1 = {
  key: 1,
  class: "drop-none"
}, K1 = {
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
    const n = e, a = t, s = S(!1), o = S(null), l = S(""), i = M(() => {
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
        e.icon ? (u(), H(ve, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        m("span", W1, y(e.label), 1),
        E(ve, {
          name: "down",
          size: 11
        })
      ], 10, F1),
      s.value ? (u(), H(Is, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (h) => s.value = !1)
      }, {
        default: F(() => [
          e.searchable ? (u(), f("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (h) => l.value = h.target.value)
          }, null, 40, H1)) : k("", !0),
          (u(!0), f(D, null, ae(i.value, (h) => (u(), H(jt, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => r(h)
          }, {
            default: F(() => [
              h.running !== void 0 ? (u(), f("span", {
                key: 0,
                class: Y(["drop-dot", { live: h.running }])
              }, null, 2)) : k("", !0),
              h.lead ? (u(), f("span", z1, y(h.lead), 1)) : k("", !0),
              m("span", U1, y(h.label), 1),
              h.note ? (u(), f("span", V1, y(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (u(), f("p", G1, y(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Oi = /* @__PURE__ */ U(K1, [["__scopeId", "data-v-29dfcce5"]]);
function Y1(e) {
  const t = S(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Se(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), Ze(() => n.disconnect()), t;
}
const Q1 = ["data-comment-id"], J1 = {
  key: 0,
  class: "comment-top"
}, X1 = { class: "comment-mark" }, Z1 = {
  class: "comment-body",
  "data-comment": ""
}, ev = { class: "comment-foot" }, tv = {
  key: 1,
  "data-comment-lost": ""
}, nv = {
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
      e.comment.quote ? (u(), f("div", J1, [
        m("span", X1, y(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, y(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", Z1, y(e.comment.body), 1),
      m("div", ev, [
        e.comment.created_at ? (u(), H(Xe, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (u(), f("span", tv, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Q1));
  }
}, Ti = /* @__PURE__ */ U(nv, [["__scopeId", "data-v-a37d4507"]]);
var Ml;
/Mac|iPhone|iPad/.test(((Ml = navigator.userAgentData) == null ? void 0 : Ml.platform) || navigator.platform);
function Ii(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const av = {
  class: "comment-box",
  "data-comment-box": ""
}, sv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, ov = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, lv = { class: "comment-row" }, iv = ["placeholder"], rv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Dt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Dt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = an(e, "draft"), l = S(""), i = S(!1), r = S(null), c = M(() => {
      var g;
      return ((g = a.selection) == null ? void 0 : g.selection_type) === "code";
    }), d = M(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      r.value.style.height = "auto", r.value.style.height = `${r.value.scrollHeight + 2}px`;
    }
    async function p() {
      const g = o.value.trim();
      if (!(!g || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(g), o.value = "", await He(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => r.value.focus() }), (g, b) => (u(), f("div", av, [
      e.selection ? (u(), f("div", sv, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, y(e.selection.quote), 3),
        E(da, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (_) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (u(), f("p", ov, y(l.value), 1)) : k("", !0),
      m("div", lv, [
        Je(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": b[1] || (b[1] = (_) => o.value = _),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Mt((_) => I(Ii)(_, p), ["enter"]))
        }, null, 42, iv), [
          [Gn, o.value]
        ]),
        E(pe, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: F(() => [...b[4] || (b[4] = [
            ne("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, uv = /* @__PURE__ */ U(rv, [["__scopeId", "data-v-41d2081c"]]), In = (e) => e ? e.split(", ") : [];
function cv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function dv(e, t) {
  return {
    reads: In(e.reads_allowed),
    runs: In(e.runs_allowed),
    missing: [...In(e.reads_missing), ...In(e.runs_missing)],
    ask: t
  };
}
const fv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Vr("SkeletonParts", !0);
      return u(!0), f(D, null, ae(e.parts, (r, c) => (u(), f(D, { key: c }, [
        (u(!0), f(D, null, ae(r.count, (d) => (u(), H(Ut, {
          key: d,
          value: r.shape
        }, {
          line: F(() => [
            E(Xt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: r.width, height: `${t[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: F(() => [
            E(Xt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[r.size]}px`, height: `${n[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: F(() => [
            E(Xt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: r.width, height: `${r.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: F(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: F(() => [
            m("div", {
              class: "skeleton-row",
              style: ye(a(r))
            }, [
              E(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: F(() => [
            m("div", {
              class: "skeleton-stack",
              style: ye(a(r))
            }, [
              E(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: F(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ye(a(r))
            }, [
              E(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: F(() => [
            m("div", {
              class: "skeleton-grid",
              style: ye(s(r))
            }, [
              E(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), hv = /* @__PURE__ */ U(fv, [["__scopeId", "data-v-fa8baeaf"]]), mv = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, pv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", mv, [
      E(hv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Us = /* @__PURE__ */ U(pv, [["__scopeId", "data-v-52f66b64"]]), Ri = {
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
}, vv = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["badge", e.tone])
    }, y(e.text), 3));
  }
}, Bi = /* @__PURE__ */ U(vv, [["__scopeId", "data-v-9e7e1157"]]), gv = { class: "bars" }, yv = { class: "bar-name" }, bv = { class: "bar-value" }, kv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = M(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", gv, [
      (u(!0), f(D, null, ae(e.items, (r, c) => (u(), H(yt(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: Y(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: F(() => [
          m("span", yv, y(r.label), 1),
          E(ci, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", bv, y(r.value) + y(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, wv = /* @__PURE__ */ U(kv, [["__scopeId", "data-v-663427f4"]]), $v = { class: "bars" }, xv = {
  key: 0,
  class: "bars-title"
}, Sv = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", $v, [
      e.node.title ? (u(), f("span", xv, y(e.node.title), 1)) : k("", !0),
      E(wv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, _v = /* @__PURE__ */ U(Sv, [["__scopeId", "data-v-7135bb11"]]), Mv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = M(() => n[a.node.type](a.node));
    return (l, i) => (u(), f("div", {
      class: Y([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ye(o.value)
    }, [
      (u(!0), f(D, null, ae(e.node.children || [], (r, c) => (u(), H(Li, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, jn = /* @__PURE__ */ U(Mv, [["__scopeId", "data-v-d142a3f4"]]), Cv = {
  key: 0,
  class: "card-head"
}, Ev = { class: "card-title" }, Av = {
  key: 0,
  class: "card-note"
}, Ov = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", Cv, [
        m("span", Ev, y(e.node.title), 1),
        e.node.note ? (u(), f("span", Av, y(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      E(jn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Tv = /* @__PURE__ */ U(Ov, [["__scopeId", "data-v-67b72d40"]]), Iv = { class: "fact" }, Rv = { class: "fact-label" }, Bv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", Iv, [
      m("span", Rv, y(e.label), 1),
      E(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Lv = /* @__PURE__ */ U(Bv, [["__scopeId", "data-v-3a88ecf8"]]), Nv = { class: "list" }, qv = { class: "list-label" }, Dv = {
  key: 1,
  class: "list-note"
}, Pv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Nv, [
      (u(!0), f(D, null, ae(e.items, (o, l) => (u(), H(yt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: F(() => [
          m("span", qv, y(o.label), 1),
          o.badge ? (u(), H(Bi, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (u(), f("span", Dv, y(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, jv = /* @__PURE__ */ U(Pv, [["__scopeId", "data-v-ebe2ae0a"]]), Fv = { class: "table" }, Wv = {
  key: 0,
  class: "table-row empty"
}, Hv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", Fv, [
      m("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (u(!0), f(D, null, ae(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, y(i), 1))), 128))
      ], 4),
      (u(!0), f(D, null, ae(e.rows, (i, r) => (u(), H(yt(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ye(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: F(() => [
          (u(!0), f(D, null, ae(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, y(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", Wv, y(e.empty), 1)) : k("", !0)
    ]));
  }
}, zv = /* @__PURE__ */ U(Hv, [["__scopeId", "data-v-9326a52e"]]), Uv = { class: "stat-value" }, Vv = { class: "stat-label" }, Gv = {
  key: 0,
  class: "stat-note"
}, Kv = {
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
    return (a, s) => (u(), H(yt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: F(() => [
        m("span", Uv, y(e.value), 1),
        m("span", Vv, y(e.label), 1),
        e.note ? (u(), f("span", Gv, y(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Yv = /* @__PURE__ */ U(Kv, [["__scopeId", "data-v-ad0db6d6"]]), Qv = { class: "code" }, Jv = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), H(Ut, {
      value: e.node.type
    }, {
      stack: F(() => [
        E(jn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: F(() => [
        E(jn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: F(() => [
        E(jn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: F(() => [
        E(Tv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: F(() => [
        m("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, y(e.node.text), 3)
      ]),
      divider: F(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: F(() => [
        E(Yv, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: F(() => [
        E(_v, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: F(() => [
        E(zv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: F(() => [
        E(jv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: F(() => [
        E(at, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: F(() => [
        E(Lv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: F(() => [
        E(Bi, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: F(() => [
        m("pre", Qv, [
          m("code", null, y(e.node.text), 1)
        ])
      ]),
      file: F(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, y(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Li = /* @__PURE__ */ U(Jv, [["__scopeId", "data-v-cbdcf540"]]), Xv = { class: "dashboard" }, Zv = { class: "trail" }, eg = ["onClick"], tg = {
  key: 0,
  class: "gone",
  role: "status"
}, ng = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = S(!!n.page && !s(n.page)), l = S(n.page && !o.value ? [n.page] : []), i = M(() => l.value.at(-1) || n.document.start), r = M(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ge(
      () => n.document.start,
      () => l.value = []
    ), (p, g) => (u(), f("div", Xv, [
      e.document.broken ? (u(), H(sn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: F(() => [
          ne(y(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), H(sn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: F(() => [
          ne(y(e.document.missing), 1)
        ]),
        _: 1
      })) : r.value ? (u(), f(D, { key: 2 }, [
        m("nav", Zv, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (b) => h(0))
          }, y(c(e.document.start)), 3),
          (u(!0), f(D, null, ae(l.value, (b, _) => (u(), f(D, {
            key: `${_}-${b}`
          }, [
            g[2] || (g[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: _ === l.value.length - 1 }]),
              onClick: (O) => h(_ + 1)
            }, y(c(b)), 11, eg)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", tg, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        E(zt, {
          name: "page",
          mode: "out-in"
        }, {
          default: F(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              E(Li, {
                node: r.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, ag = /* @__PURE__ */ U(ng, [["__scopeId", "data-v-fbe83734"]]);
function sg(e, t) {
  const n = ze(), a = Os(e, Ri.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Se(e), Ze(() => {
    s(), a.cancel();
  });
}
const og = {
  key: 0,
  class: "window-failure"
}, lg = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ze(), o = S(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? sg(l, n.events) : Es(l, () => !0, Ri.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", og, y(o.value.error), 1)) : o.value ? (u(), H(ag, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, ig = 1e4;
class rg {
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
    return this.heardAt !== null && t - this.heardAt > ig;
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
const ug = {
  key: 0,
  class: "frame-note"
}, cg = {
  key: 0,
  class: "frame-note"
}, dg = ["src", "title"], fg = 1e3, hg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ze(), a = S(null), s = S(!1), o = S(!1);
    let l = null, i = 0;
    return Se(() => {
      l = new rg(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, fg);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", ug, "This window was closed because it stopped answering.")) : (u(), f(D, { key: 1 }, [
      s.value ? (u(), f("div", cg, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        E(pe, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: F(() => [...c[1] || (c[1] = [
            ne("Close the window", -1)
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
        title: I(n).window
      }, null, 8, dg)
    ], 64));
  }
}, mg = /* @__PURE__ */ U(hg, [["__scopeId", "data-v-32a49046"]]), pg = {
  class: "allowance-prompt",
  role: "dialog"
}, vg = { class: "allowance-prompt-text" }, gg = { class: "allowance-prompt-buttons" }, yg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", pg, [
      m("p", vg, y(I(cv)(e.request)), 1),
      m("div", gg, [
        E(pe, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: F(() => [...s[2] || (s[2] = [
            ne("Allow", -1)
          ])]),
          _: 1
        }),
        E(pe, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: F(() => [...s[3] || (s[3] = [
            ne("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, bg = /* @__PURE__ */ U(yg, [["__scopeId", "data-v-cad69fe2"]]), Ta = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), H(sn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: F(() => [
        ne(y(e.reason) + " ", 1),
        e.retry ? (u(), H(pe, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: F(() => [...s[2] || (s[2] = [
            ne("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (u(), H(pe, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: F(() => [...s[3] || (s[3] = [
            ne("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, kg = ["data-window", "data-agent"], wg = {
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
    const n = e, a = t, s = S(""), o = S(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Ce(gc, null), r = vd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: M(() => n.options),
      declared: n.declared,
      page: Ce(dd, null),
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
    Cl(De, r), ge(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Se(r.settle), Re(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Gr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ia(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), H(bg, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (u(), H(Ta, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), H(Ta, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(D, { key: 4 }, [
        (u(), H(c, { key: o.value })),
        e.skeleton.length && !I(r).answered.value ? (u(), H(Us, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (u(), H(Ta, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, kg));
  }
}, Zt = /* @__PURE__ */ U(wg, [["__scopeId", "data-v-c4443e2b"]]), Ni = {
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
    const n = e, a = t, s = { render: () => ia(mg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), H(Zt, {
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
}, $g = ["data-window"], qi = {
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
    const n = e, a = t, s = Qe(null), o = S("");
    return ge(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Nu();
          } catch (i) {
            if (Bu(i) && Lu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      E(Us, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, $g)) : (u(), H(Zt, {
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
}, xg = {
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
    const n = t, a = e, s = M(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = M(() => s.value && { render: () => ia(lg, { line: s.value.line, events: s.value.events }) }), l = S(null), i = M(() => {
      var p, g;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), r = M(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = M(
      () => {
        var p, g;
        return l.value ? dv(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
    return ge(
      () => {
        var p, g;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await d(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (p, g) => {
      var b, _;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), H(Us, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((_ = s.value) == null ? void 0 : _.shows) === "one-agent" && e.agent === null ? (u(), H(sn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), H(Zt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": r.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), H(qi, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (O, C) => n("option", O, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), H(Ni, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (O, C) => n("option", O, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), H(Zt, {
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
        onOption: g[2] || (g[2] = (O, C) => n("option", O, C))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), H(Zt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (O) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Sg = ["data-section"], _g = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Mg = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ce(Ls, null), a = M(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = M(() => ({ row: t.row }));
    return (o, l) => I(n) ? (u(!0), f(D, { key: 0 }, ae(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), H(xg, {
        key: 0,
        name: i.name,
        catalogue: I(n).catalogue,
        subscriptions: I(n).subscriptions,
        environment: I(n).environment,
        prompts: I(n).prompts,
        "shell-read": I(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", _g, y(i.name) + " is not available", 1))
    ], 8, Sg))), 128)) : k("", !0);
  }
}, hs = /* @__PURE__ */ U(Mg, [["__scopeId", "data-v-a47d36b7"]]), Cg = { class: "rail-head" }, Eg = { key: 0 }, Ag = {
  key: 1,
  class: "rail-none"
}, Og = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Cg, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", Eg, y(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (u(!0), f(D, { key: 0 }, ae(e.comments, (a) => (u(), H(Ti, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", Ag, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Tg = /* @__PURE__ */ U(Og, [["__scopeId", "data-v-4d684649"]]), Ig = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, Rg = ["aria-pressed"], Bg = ["aria-pressed"], Lg = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Ng = {
  key: 0,
  role: "alert"
}, qg = {
  key: 1,
  class: "sidebar-none"
}, Dg = ["data-question-id"], Pg = { class: "question-state" }, jg = ["data-question-show", "onClick"], Fg = {
  key: 0,
  class: "sidebar-none"
}, Wg = {
  key: 1,
  class: "question-answer"
}, Hg = {
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
    const t = Ce(Ls, null);
    return (n, a) => (u(), f("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", Ig, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, Rg),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Bg)
      ]),
      e.mode === "comments" ? (u(), f(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), H(Tg, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        E(pn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), f("aside", Lg, [
        e.failure ? (u(), f("p", Ng, y(e.failure), 1)) : e.questions.length ? k("", !0) : (u(), f("p", qg, "No questions about this text yet.")),
        (u(!0), f(D, null, ae(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", Pg, y(I(on)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, y(s.text), 9, jg),
            s.quote ? (u(), f(D, { key: 0 }, [
              m("blockquote", null, y(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", Fg, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (u(), f("p", Wg, "Answered: " + y(s.answer), 1)) : k("", !0),
            E(hs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            E(Ds, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = I(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Dg);
        }), 128))
      ]))
    ], 2));
  }
}, Do = /* @__PURE__ */ U(Hg, [["__scopeId", "data-v-2718a08d"]]), zg = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Ug = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ht({ abstract: n.row.abstract, body: n.row.body }), o = S("");
    async function l() {
      const i = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, r) => (u(), H(fa, {
      title: "Edit the document",
      wide: "",
      onClose: r[3] || (r[3] = (c) => a("close"))
    }, {
      foot: F(() => [
        m("span", zg, y(o.value), 1),
        E(pe, {
          onClick: r[2] || (r[2] = (c) => a("close"))
        }, {
          default: F(() => [...r[6] || (r[6] = [
            ne("Cancel", -1)
          ])]),
          _: 1
        }),
        E(pe, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: F(() => [...r[7] || (r[7] = [
            ne("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: F(() => [
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
              [Gn, s.abstract]
            ])
          ]),
          m("label", null, [
            r[5] || (r[5] = m("span", null, "Text", -1)),
            Je(m("textarea", {
              "onUpdate:modelValue": r[1] || (r[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Gn, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Vg = /* @__PURE__ */ U(Ug, [["__scopeId", "data-v-e99f14e0"]]);
function Di(e, t) {
  const n = S([]), a = S(!1), s = S(null), o = S(0), l = S(!1), i = S("");
  let r = 0, c = 0;
  const d = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: _, id: O, title: C } = e(), j = `On ${_} ${O}, ${C}: `;
    return b.text.startsWith(j) ? b.text.slice(j.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: _, id: O } = e();
    if (!O) return;
    const C = ++c;
    l.value = !0, i.value = "";
    try {
      const j = await t([_, "comments", String(O), "--page", String(b), "--page-size", "25"]);
      if (C !== c) return;
      if (!j.ok) {
        i.value = j.error;
        return;
      }
      const z = j.value.rows ?? [], W = b === 1 ? z : [...n.value, ...z];
      n.value = [...new Map(W.map((B) => [B.id, B])).values()], o.value = j.value.total ?? n.value.length, s.value = j.value.next_page ?? null;
    } catch (j) {
      C === c && (i.value = j.message);
    } finally {
      C === c && (l.value = !1);
    }
  }
  async function p(b) {
    var B;
    const { noun: _, id: O } = e(), C = `${_}:${O}`, j = { id: `sending-${++r}`, text: b };
    n.value = [...n.value, j], o.value++, a.value = !0;
    const z = await t([_, "comment", String(O), b]);
    if (C !== `${e().noun}:${e().id}`) return;
    if (!z.ok)
      throw n.value = n.value.filter((G) => G.id !== j.id), o.value = Math.max(0, o.value - 1), new Error(z.error);
    await h();
    const W = (B = z.value) == null ? void 0 : B.id;
    W && !n.value.some((G) => G.id === W) && (n.value = [...n.value, { ...j, id: W }]);
  }
  const g = () => !l.value && s.value && h(s.value);
  return ge(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: p, load: h, loadMore: g, nextPage: s, total: o, loading: l, failure: i };
}
function Gg(e, t) {
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
const Kg = {
  class: "document-tab",
  "data-document-revisions": ""
}, Yg = ["datetime"], Qg = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Jg = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Xg = {
  key: 2,
  class: "document-none"
}, Zg = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(null), o = S(""), l = M(() => s.value ? Gg(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", Kg, [
      e.editing ? (u(), H(pe, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (h) => a("close-revision"))
      }, {
        default: F(() => [...d[1] || (d[1] = [
          ne("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (u(), f(D, { key: 1 }, [
        (u(!0), f(D, null, ae(e.revisions, (h) => (u(), H(pe, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: F(() => [
            ne("Revision " + y(h.number) + ": " + y(h.change) + " · " + y(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, y(h.created_at.slice(0, 16).replace("T", " ")), 9, Yg)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", Qg, y(o.value), 1)) : k("", !0),
        s.value ? (u(), f(D, { key: 1 }, [
          E(pe, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: r
          }, {
            default: F(() => [...d[2] || (d[2] = [
              ne("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", Jg, [
            (u(!0), f(D, null, ae(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, y(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (u(), f("p", Xg, "No revisions"))
    ]));
  }
}, ey = /* @__PURE__ */ U(Zg, [["__scopeId", "data-v-3a381aa4"]]), ty = "button, [data-comment-number]", ny = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Pi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(ty) || n.push(t.currentNode);
  return n;
}
function Po(e, t, n) {
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
const ay = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function sy(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Pi(e), s = a.map((c) => c.data).join(""), o = Po(a, n.startContainer, n.startOffset), l = s.slice(o, Po(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: ay(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function oy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function ly(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Ia(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function iy({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function ry(e, t) {
  const n = Pi(e), a = oy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = ly(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(iy).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ia(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ia(t.number, t.id, t.label)) : l.at(-1).append(Ia(t.number, t.id, t.label))), !0;
}
function uy(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !ry(e, a) && a.id && n.push(a.id);
  return n;
}
const cy = (e) => e.closest(ny) ?? e;
function jo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const dy = {
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
    const a = e, s = n, o = S(null), l = S(null), i = S(null), r = S(!1), c = S(null);
    function d() {
      if (!l.value || r.value) return;
      l.value.innerHTML = a.html;
      const _ = a.comments.filter((z) => z.quote).map((z) => ({ ...z, label: a.annotationLabel, hot: z.id === a.hot })), O = uy(l.value, a.pending ? [..._, { ...a.pending, pending: !0 }] : _);
      s("lost", O);
      const C = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!C) {
        c.value = null;
        return;
      }
      const j = document.createElement("div");
      j.className = "inline-comment", cy(C).after(j), c.value = j;
    }
    function h() {
      if (!l.value) return;
      const _ = sy(l.value);
      if (r.value = !!_, !_) {
        i.value = null;
        return;
      }
      const O = window.getSelection().getRangeAt(0).getBoundingClientRect(), C = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(O.left - C.left, 0)}px`, top: `${O.top - C.top + o.value.scrollTop}px` }, s("select", _);
    }
    function p(_) {
      const O = _.target.closest("[data-comment-number]");
      O ? s("number", Number(O.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function g(_) {
      var O;
      (O = l.value.querySelector(`[data-comment="${_}"]`)) == null || O.scrollIntoView({ block: "center" });
    }
    function b(_) {
      var O;
      (O = l.value.querySelectorAll("h3, h4, h5, h6")[_]) == null || O.scrollIntoView({ block: "start" });
    }
    return ge(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), Se(() => {
      d(), document.addEventListener("selectionchange", h);
    }), Ze(() => document.removeEventListener("selectionchange", h)), t({ show: g, showHeading: b, nextTick: He }), (_, O) => (u(), f("div", {
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
        style: ye(i.value),
        "data-comment-pill": "",
        onMousedown: O[0] || (O[0] = $e(() => {
        }, ["prevent"])),
        onClick: O[1] || (O[1] = (C) => s("write"))
      }, [
        E(ve, {
          name: "chat",
          size: 13
        }),
        O[2] || (O[2] = ne("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (u(), H(ua, {
        key: 1,
        to: c.value
      }, [
        me(_.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      me(_.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, fy = /* @__PURE__ */ U(dy, [["__scopeId", "data-v-548d0aaa"]]), hy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, my = { class: "document-tabs" }, py = { class: "document-body" }, vy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, gy = {
  key: 1,
  class: "document-loading"
}, yy = {
  class: "document-details",
  "data-resource-fields": ""
}, by = 760, ky = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = S(null), a = Y1(n), s = M(() => a.value !== null && a.value < by), o = S(null), l = S(""), i = S([]), r = S([]), c = S(""), d = S("comments"), h = S("text"), p = S(0), g = S(0), b = S([]), _ = S(null), O = S(""), C = S(!1), j = S(null), z = S(null);
    let W = 0;
    const B = Di(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (fe) => t.read(fe)), G = M(() => jo(B.comments.value)), P = M(() => d.value === "questions" ? jo(r.value) : G.value), L = M(() => d.value === "questions" ? P.value.length : B.total.value), x = M(() => {
      var fe;
      return (fe = o.value) != null && fe.body ? Fs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), $ = M(() => {
      var fe;
      return (((fe = o.value) == null ? void 0 : fe.body) ?? "").split(`
`).filter((Z) => /^#{1,4} /.test(Z)).map((Z, oe) => ({ key: String(oe), value: oe, label: Z.replace(/^#+ /, "") }));
    }), w = M(() => G.value.find((fe) => fe.id === g.value)), v = M(() => {
      var fe;
      return (fe = o.value) != null && fe.close_reason ? "Closed" : "Open";
    }), T = M(() => h.value === "comments" && !s.value ? "text" : h.value), A = (fe) => fe.ok ? fe.value.rows ?? [] : [];
    async function R() {
      const fe = ++W, Z = await t.read([t.noun, "inspect", String(t.id)]);
      if (fe !== W) return;
      l.value = Z.ok ? "" : Z.error, o.value = Z.ok ? Z.value : null;
      const oe = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), le = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      fe === W && (r.value = A(oe), c.value = oe.ok ? "" : oe.error, i.value = le ? A(le) : []);
    }
    async function q(fe) {
      const Z = _.value ? ["--quote", _.value.quote, "--position", String(_.value.position), "--selection-type", _.value.selection_type] : [], oe = await t.read([t.noun, "comment", String(t.id), ...Z, "--", fe]);
      if (!oe.ok) throw new Error(oe.error);
      _.value = null, await Promise.all([R(), B.load()]);
    }
    async function N() {
      const fe = await t.read(["doc", "close", String(t.id)]);
      l.value = fe.ok ? "" : fe.error, fe.ok && await R();
    }
    function ee() {
      O.value.trim() || (_.value = null);
    }
    function te(fe) {
      var Z;
      if (p.value = fe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? g.value = g.value === fe ? 0 : fe : (Z = n.value.querySelector(d.value === "questions" ? `[data-question-id="${fe}"]` : `[data-comment-id="${fe}"]`)) == null || Z.scrollIntoView({ block: "nearest" });
    }
    async function ie(fe) {
      var Z, oe;
      h.value = "text", p.value = fe, await ((Z = j.value) == null ? void 0 : Z.nextTick()), (oe = j.value) == null || oe.show(fe);
    }
    function Oe() {
      C.value = !1, R();
    }
    return ge(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, g.value = 0, _.value = null, r.value = [], c.value = "", R();
    }, { immediate: !0 }), ge(d, () => {
      p.value = 0, g.value = 0;
    }), (fe, Z) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", hy, [
        E(pe, {
          bordered: "",
          "data-text-edit": "",
          onClick: Z[0] || (Z[0] = (oe) => C.value = !0)
        }, {
          default: F(() => [...Z[14] || (Z[14] = [
            ne("Edit", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      m("nav", my, [
        m("button", {
          type: "button",
          class: Y(["document-tab-button", { on: T.value === "text" }]),
          "data-document-tab": "text",
          onClick: Z[1] || (Z[1] = (oe) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: T.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Z[2] || (Z[2] = (oe) => h.value = "comments")
        }, [
          ne(y(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, y(L.value || ""), 1)
        ], 2)) : k("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: T.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Z[3] || (Z[3] = (oe) => h.value = "revisions")
        }, [
          Z[15] || (Z[15] = ne("Revisions ", -1)),
          m("em", null, y(i.value.length || ""), 1)
        ], 2)) : k("", !0),
        Z[16] || (Z[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        T.value === "text" && $.value.length > 1 ? (u(), H(Oi, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: $.value,
          "data-text-chapters": "",
          onPick: Z[4] || (Z[4] = (oe) => {
            var le;
            return (le = j.value) == null ? void 0 : le.showHeading(oe.value);
          })
        }, null, 8, ["label", "items"])) : k("", !0)
      ]),
      m("div", py, [
        l.value ? (u(), f("p", vy, y(l.value), 1)) : o.value ? T.value === "revisions" ? (u(), H(ey, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: N,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : T.value === "comments" ? (u(), H(Do, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": Z[5] || (Z[5] = (oe) => d.value = oe),
          tab: "",
          comments: G.value,
          questions: r.value,
          hot: p.value,
          lost: b.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!I(B).nextPage.value,
          "comment-loading": I(B).loading.value,
          "comment-failure": I(B).failure.value,
          "comment-total": I(B).total.value,
          onMore: I(B).loadMore,
          onShow: ie,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(D, { key: 4 }, [
          E(fy, {
            ref_key: "words",
            ref: j,
            html: x.value,
            comments: P.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: _.value,
            inline: g.value,
            onSelect: Z[7] || (Z[7] = (oe) => _.value = oe),
            onClear: ee,
            onNumber: te,
            onWrite: Z[8] || (Z[8] = (oe) => {
              var le;
              return (le = z.value) == null ? void 0 : le.focus();
            }),
            onLost: Z[9] || (Z[9] = (oe) => b.value = oe)
          }, {
            inline: F(() => [
              w.value ? (u(), H(Ti, {
                key: 0,
                comment: w.value,
                hot: "",
                onShow: Z[6] || (Z[6] = (oe) => ie(w.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: F(() => [
              m("dl", yy, [
                Z[18] || (Z[18] = m("h4", null, "Details", -1)),
                Z[19] || (Z[19] = m("dt", null, "State", -1)),
                m("dd", null, y(v.value), 1),
                o.value.close_reason ? (u(), f(D, { key: 0 }, [
                  Z[17] || (Z[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, y(o.value.close_reason), 1)
                ], 64)) : k("", !0),
                Z[20] || (Z[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  E(Xe, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                Z[21] || (Z[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  E(Xe, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? k("", !0) : (u(), H(Do, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": Z[10] || (Z[10] = (oe) => d.value = oe),
            comments: G.value,
            questions: r.value,
            hot: p.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!I(B).nextPage.value,
            "comment-loading": I(B).loading.value,
            "comment-failure": I(B).failure.value,
            "comment-total": I(B).total.value,
            onMore: I(B).loadMore,
            onShow: ie,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", gy, [
          E(Ge)
        ]))
      ]),
      o.value ? (u(), H(uv, {
        key: 1,
        ref_key: "composer",
        ref: z,
        draft: O.value,
        "onUpdate:draft": Z[11] || (Z[11] = (oe) => O.value = oe),
        selection: _.value,
        send: q,
        narrow: s.value,
        onClear: Z[12] || (Z[12] = (oe) => _.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      C.value ? (u(), H(Vg, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: Z[13] || (Z[13] = (oe) => C.value = !1),
        onSaved: Oe
      }, null, 8, ["noun", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, vS = /* @__PURE__ */ U(ky, [["__scopeId", "data-v-784faf41"]]), wy = {
  key: 1,
  class: "row-list-failure"
}, $y = ["data-row"], xy = {
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
    const t = e, n = M(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = S(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), H(Ge, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", wy, y(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), H(sn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: F(() => [
        ne(y(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(D, { key: 3 }, [
      (u(), H(yt(e.arrival ? Ms : "ul"), qe(n.value, { class: "row-list" }), {
        default: F(() => [
          (u(!0), f(D, null, ae(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            me(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, $y))), 128))
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
}, Sy = /* @__PURE__ */ U(xy, [["__scopeId", "data-v-6c7ba696"]]), _y = {
  class: "agent-rows",
  "data-agent-rows": ""
}, My = {
  key: 1,
  class: "agent-rows-note"
}, Cy = {
  key: 2,
  class: "agent-rows-note"
}, Ey = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Ay = ["data-agent-row", "onClick"], Oy = { class: "agent-row-name" }, Ty = { class: "agent-row-state" }, Iy = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = M(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", _y, [
      e.loaded ? e.failure ? (u(), f("p", My, y(e.failure), 1)) : e.rows.length ? (u(), f(D, { key: 3 }, [
        m("p", Ey, y(a.value) + " running", 1),
        (u(!0), f(D, null, ae(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => I(Ne)(`agents:${l.id}`)
        }, [
          m("span", Oy, "#" + y(l.id) + " " + y(l.session), 1),
          m("span", Ty, y(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Ay))), 128))
      ], 64)) : (u(), f("p", Cy, y(e.none), 1)) : (u(), H(Ge, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, gS = /* @__PURE__ */ U(Iy, [["__scopeId", "data-v-a01e5a17"]]), ut = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, We = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Fe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Ry = 6;
function Vs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const By = (e) => {
  const t = Vs(e, ut.lineChars), n = Math.max(ut.minWidth, Math.max(...t.map((a) => a.length)) * ut.charWidth + ut.padX * 2);
  return { name: e, lines: t, line: ut.line, padY: ut.padY, width: n, height: t.length * ut.line + ut.padY * 2 };
};
function Ly(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Ny(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function qy(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, r) => [i, r]))), o = (l, i) => {
    const r = s(), c = (d) => {
      const h = i(d).map((p) => r.get(p));
      return h.length ? h.reduce((p, g) => p + g, 0) / h.length : r.get(d);
    };
    return [...l].sort((d, h) => c(d) - c(h));
  };
  for (let l = 0; l < Ry; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Dy(e, t) {
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
function Py(e) {
  const t = [...new Set(e.flatMap(([W, B]) => [W, B]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = Ly(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, B) => !s.has(B)), l = Ny(t, o), i = qy(t, o, l), r = new Map(t.map((W) => [W, By(W)])), c = i.map((W) => W.reduce((B, G) => B + r.get(G).width, 0) + Fe.across * (W.length - 1)), d = Math.max(...c) + Fe.margin * 2, h = Fy(e, l, i.length), p = /* @__PURE__ */ new Map();
  let g = Fe.margin;
  i.forEach((W, B) => {
    let G = (d - c[B]) / 2;
    const P = Math.max(...W.map((L) => r.get(L).height));
    W.forEach((L) => {
      const x = r.get(L);
      p.set(L, { ...x, x: G, y: g + (P - x.height) / 2 }), G += x.width + Fe.across;
    }), g += P + (h[B] ?? Fe.down);
  });
  const b = e.map(([W, B, G], P) => ({ from: W, to: B, label: G || "", back: s.has(P) || l.get(B) <= l.get(W) }));
  Dy(b, p);
  const _ = b.map((W) => Wy(W, p.get(W.from), p.get(W.to))), O = [...p.values()], C = Vy(_, O), j = Math.max(g - Fe.down, ...C.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(d - Fe.margin, ...C.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + Fe.margin, height: j + Fe.margin, nodes: O, arrows: C };
}
const jy = (e) => e ? Vs(e, We.lineChars).length * We.line + We.pad * 2 : 0;
function Fy(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Fe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += jy(l) + Fe.labelSpace);
  }), a.map((s) => Math.max(Fe.down, s));
}
function Wy(e, t, n) {
  const a = e.label ? Vs(e.label, We.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * We.charWidth + We.pad * 2 : 0, o = a.length * We.line + (a.length ? We.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const Hy = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, zy = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Uy = [0, -1, 1, -2, 2, -3, 3].map((e) => e * We.line);
function Vy(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = Hy(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Uy.flatMap((r) => zy.map((c) => s(c, r))).find((r) => !n.some((c) => Fo(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => Fo(i, r)); ) i.y += We.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: We.line, pad: We.pad } };
  });
}
const Fo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Gy = { class: "flowchart-tools" }, Ky = ["width", "height", "viewBox", "aria-label"], Yy = ["d"], Qy = ["x", "y", "width", "height"], Jy = ["x", "y"], Xy = ["x", "dy"], Zy = {
  key: 0,
  class: "flowchart-label"
}, e0 = ["x", "y", "width", "height"], t0 = ["x", "y"], n0 = ["x", "dy"], a0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Py(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = S(null), i = S({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var C;
      const _ = (C = l.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(_ != null && _.width)) return;
      const O = Math.min(_.width / s.value.width, _.height / s.value.height, 1.5);
      i.value = { zoom: O, x: (_.width - s.value.width * O) / 2, y: (_.height - s.value.height * O) / 2 };
    }
    function d(_, O, C) {
      const { zoom: j, x: z, y: W } = i.value, B = Math.min(o.most, Math.max(o.least, j * _));
      i.value = { zoom: B, x: O - (O - z) * B / j, y: C - (C - W) * B / j };
    }
    function h(_) {
      const O = l.value.getBoundingClientRect();
      d(_, O.width / 2, O.height / 2);
    }
    function p(_) {
      const O = l.value.getBoundingClientRect();
      _.ctrlKey || _.metaKey ? d(_.deltaY < 0 ? o.step : 1 / o.step, _.clientX - O.left, _.clientY - O.top) : i.value = { ...i.value, x: i.value.x - _.deltaX, y: i.value.y - _.deltaY };
    }
    function g(_) {
      var O, C, j;
      _.preventDefault(), (O = window.getSelection()) == null || O.removeAllRanges(), r = { x: _.clientX - i.value.x, y: _.clientY - i.value.y }, (j = (C = l.value).setPointerCapture) == null || j.call(C, _.pointerId);
    }
    function b(_) {
      r && (i.value = { ...i.value, x: _.clientX - r.x, y: _.clientY - r.y });
    }
    return Se(c), (_, O) => (u(), H(fa, {
      title: e.title,
      large: "",
      onClose: O[4] || (O[4] = (C) => a("close"))
    }, {
      default: F(() => [
        m("div", Gy, [
          E(pe, {
            small: "",
            onClick: O[0] || (O[0] = (C) => h(o.step))
          }, {
            default: F(() => [...O[5] || (O[5] = [
              ne("Zoom in", -1)
            ])]),
            _: 1
          }),
          E(pe, {
            small: "",
            onClick: O[1] || (O[1] = (C) => h(1 / o.step))
          }, {
            default: F(() => [...O[6] || (O[6] = [
              ne("Zoom out", -1)
            ])]),
            _: 1
          }),
          E(pe, {
            small: "",
            onClick: c
          }, {
            default: F(() => [...O[7] || (O[7] = [
              ne("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: $e(p, ["prevent"]),
          onPointerdown: g,
          onPointermove: b,
          onPointerup: O[2] || (O[2] = (C) => ro(r) ? r.value = null : r = null),
          onPointercancel: O[3] || (O[3] = (C) => ro(r) ? r.value = null : r = null)
        }, [
          (u(), f("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ye({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            O[8] || (O[8] = m("defs", null, [
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
            (u(!0), f(D, null, ae(s.value.arrows, (C, j) => (u(), f("path", {
              key: `arrow-${j}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Yy))), 128)),
            (u(!0), f(D, null, ae(s.value.nodes, (C) => (u(), f("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, Qy),
              m("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (u(!0), f(D, null, ae(C.lines, (j, z) => (u(), f("tspan", {
                  key: z,
                  x: C.x + C.width / 2,
                  dy: z ? C.line : 0
                }, y(j), 9, Xy))), 128))
              ], 8, Jy)
            ]))), 128)),
            (u(!0), f(D, null, ae(s.value.arrows, (C, j) => (u(), f(D, {
              key: `label-${j}`
            }, [
              C.label ? (u(), f("g", Zy, [
                m("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, e0),
                m("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (u(!0), f(D, null, ae(C.label.lines, (z, W) => (u(), f("tspan", {
                    key: W,
                    x: C.label.x + C.label.width / 2,
                    dy: W ? C.label.line : 0
                  }, y(z), 9, n0))), 128))
                ], 8, t0)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Ky))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, s0 = /* @__PURE__ */ U(a0, [["__scopeId", "data-v-51d24cfe"]]), Wo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ho = {
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
  agent: Wo,
  worker: Wo,
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
}, o0 = ["innerHTML"], l0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => Ho[t.name] || Ho.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, o0));
  }
}, gt = /* @__PURE__ */ U(l0, [["__scopeId", "data-v-beb5935c"]]), i0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      E(gt, { name: "fold" })
    ], 2));
  }
}, mt = /* @__PURE__ */ U(i0, [["__scopeId", "data-v-d03899bb"]]), r0 = ["data-tip", "aria-label"], u0 = {
  key: 0,
  class: "mact-word"
}, c0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      E(gt, { name: "open" }),
      e.open ? (u(), f("span", u0, y(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, r0));
  }
}, ji = /* @__PURE__ */ U(c0, [["__scopeId", "data-v-3b292e09"]]), Fi = 120, Fn = 280, Wi = 160, d0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, f0 = ["leaving", "resizing", "entering"];
function ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function h0(e) {
  const t = f0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ms(e);
  return e.classList.add(...t), n;
}
function Hi(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = S(t()), s = S("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, p) {
    i(h);
    const g = h0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Fn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Fn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, g);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let g = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== g && (g = p.offsetHeight, r(h, ms(h)));
    });
    return b.observe(p), b;
  }
  async function d(h) {
    const p = e.value, g = ++o;
    if (!p || !p.offsetWidth || d0()) {
      a.value = h;
      return;
    }
    const b = ms(p);
    if (l(p, b), s.value = "leaving", await n(Fi), g !== o) return;
    a.value = h, s.value = "resizing", await He(), r(p, b);
    const _ = c(p);
    await n(Fn), _ == null || _.disconnect(), g === o && (i(p), s.value = "entering", await n(Wi), g === o && (s.value = ""));
  }
  return ge(t, (h) => d(h)), Ze(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const m0 = { class: "growing-card-top" }, p0 = ["aria-expanded"], v0 = { class: "growing-card-avatar" }, g0 = { class: "growing-card-title" }, y0 = { class: "growing-card-more" }, b0 = { class: "growing-card-body" }, k0 = {
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
    const n = e, a = t, s = S(!1), o = S(null), { folded: l, phase: i } = Hi(o, () => !s.value), r = M(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = M(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", I(i), { open: !I(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", m0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", v0, [
            e.bad ? (u(), H(gt, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(D, { key: 1 }, [
              ne(y(r.value), 1)
            ], 64)) : (u(), H(ve, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", g0, y(e.title), 1),
          E(mt, { open: s.value }, null, 8, ["open"])
        ], 8, p0),
        e.action ? (u(), H(ji, {
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
          E(ve, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", y0, [
        m("div", b0, [
          (u(!0), f(D, null, ae(c.value, (p, g) => (u(), f("p", {
            key: g,
            class: "growing-card-text"
          }, y(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, w0 = /* @__PURE__ */ U(k0, [["__scopeId", "data-v-f2b4930d"]]), $0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, x0 = { class: "md inline" }, S0 = ["disabled", "title", "onClick"], _0 = {
  key: 1,
  class: "message-links-many"
}, M0 = ["aria-expanded"], C0 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, E0 = ["disabled", "onClick"], A0 = { class: "row-pill message-links-chip" }, O0 = { class: "message-links-title" }, T0 = { key: 0 }, Ra = 3, I0 = "task", R0 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.total || n.links.length), o = M(() => n.links.every((p) => p.endpoint.model === I0) ? "tasks" : "items"), l = S(!1), i = S(null);
    Wl(i, () => l.value = !1);
    const r = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, d = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, Ne(p.endpoint.open_ref));
    }
    return (p, g) => (u(), f("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ra, three: s.value === Ra, open: l.value }]),
      "data-message-links": ""
    }, [
      E(gt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), f("span", $0, [
        m("span", x0, [
          g[1] || (g[1] = ne("Linked: ", -1)),
          (u(!0), f(D, null, ae(e.links, (b) => (u(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (_) => h(b)
          }, [
            ne(y(b.endpoint.model.replaceAll("_", " ")) + " " + y(b.endpoint.id), 1),
            d(b) ? (u(), f(D, { key: 0 }, [
              ne(" (" + y(d(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (u(), f(D, { key: 1 }, [
              ne(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, S0))), 128))
        ])
      ])) : k("", !0),
      s.value >= Ra ? (u(), f("span", _0, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          ne(y(s.value) + " linked " + y(o.value) + " ", 1),
          E(mt, { open: l.value }, null, 8, ["open"])
        ], 8, M0)
      ])) : k("", !0),
      l.value ? (u(), f("div", C0, [
        (u(!0), f(D, null, ae(e.links, (b) => (u(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (_) => h(b)
        }, [
          m("span", A0, y(b.endpoint.model.replaceAll("_", " ")) + " " + y(b.endpoint.id), 1),
          m("span", O0, y(b.endpoint.title), 1),
          m("span", null, y(d(b)), 1),
          c(b) ? (u(), f("span", T0, "Unavailable")) : k("", !0)
        ], 8, E0))), 128))
      ])) : k("", !0),
      E(pn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, B0 = /* @__PURE__ */ U(R0, [["__scopeId", "data-v-e9bc783c"]]), L0 = ["title", "aria-label"], N0 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, q0 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, D0 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = M(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (u(), f("span", {
      class: Y(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (u(), f("svg", N0, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", q0)) : k("", !0)
      ]))
    ], 10, L0));
  }
}, P0 = /* @__PURE__ */ U(D0, [["__scopeId", "data-v-6dc92808"]]), j0 = "img,pre,table";
function F0(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function W0(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function H0(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(j0)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = F0(W0(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function z0(e, t) {
  let n = null;
  const a = () => e.value && H0(e.value);
  Se(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), ge(t, a, { flush: "post" });
}
const U0 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function V0(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Rn = /* @__PURE__ */ new WeakMap(), Ye = "work", Qt = "sent", G0 = 50, zo = () => ({ rows: S([]), total: S(0), next: S(null), loading: S(!1), failure: S(""), version: 0 });
function K0(e) {
  var h;
  if (Rn.has(e)) return Rn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (p) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...p.views].some((b) => b.visible);
  };
  async function o(p, g, b = 1) {
    const _ = p[g], O = ++_.version;
    _.loading.value = !0, _.failure.value = "";
    const C = g === Ye ? "--type about --type edited --group-counterparts" : "--type sent_to", j = `link list --source message:${p.id} ${C} --page ${b} --page-size ${g === Ye ? 10 : 25}`;
    try {
      const z = await e.read(j);
      if (t.get(p.id) !== p || _.version !== O) return;
      if (!z.ok) {
        _.failure.value = z.error;
        return;
      }
      const W = g === Ye ? z.value.counterparts ?? [] : z.value.rows ?? [], B = b === 1 ? W : [..._.rows.value, ...W], G = g === Ye ? (P) => `${P.endpoint.model}:${P.endpoint.id}` : (P) => P.id ?? P.target_id;
      _.rows.value = [...new Map(B.map((P) => [G(P), P])).values()], _.total.value = z.value.total ?? _.rows.value.length, _.next.value = z.value.next_page ?? null;
    } catch (z) {
      _.version === O && (_.failure.value = z.message);
    } finally {
      _.version === O && (_.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const p = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of p) {
      const b = [...g.dirty];
      g.dirty.clear();
      for (const _ of b) o(g, _);
    }
  }
  function i(p, g = [Ye, Qt]) {
    for (const b of g) p.dirty.add(b);
    s(p) && (n.add(p.id), a ?? (a = setTimeout(l, 0)));
  }
  function r(p) {
    const g = p.sources ?? (p.source_model && Number.isInteger(p.source_id) ? [{ model: p.source_model, id: p.source_id }] : []), b = p.link_types ?? (p.link_type ? [p.link_type] : []), _ = b.length ? [Ye, Qt].filter((C) => C === Ye ? b.some((j) => ["about", "edited"].includes(j)) : b.includes("sent_to")) : [Ye, Qt];
    if (!_.length) return;
    const O = g.length ? [...new Set(g.filter((C) => C.model === "message").map((C) => C.id))].map((C) => t.get(C)).filter(Boolean) : [...t.values()].filter(s).slice(0, G0);
    for (const C of O) i(C, _);
  }
  const c = (h = e.follow) == null ? void 0 : h.call(e, ["link.*"], r), d = {
    attach(p, g) {
      let b = t.get(p);
      return b || (b = { id: p, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ye, Qt]), work: zo(), sent: zo() }, t.set(p, b)), b.views.add(g), b.dirty.size && i(b, [...b.dirty]), b;
    },
    shown(p) {
      p.dirty.size && i(p, [...p.dirty]);
    },
    detach(p, g) {
      p.views.delete(g), p.views.size || t.delete(p.id), t.size || (clearTimeout(a), c == null || c(), Rn.delete(e));
    },
    more(p, g) {
      const b = p == null ? void 0 : p[g];
      if (b != null && b.next.value && !b.loading.value) return o(p, g, b.next.value);
    }
  };
  return Rn.set(e, d), d;
}
function Y0(e, t, n) {
  const a = Qe(null);
  let s = null;
  const o = ge(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = K0(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      c.visible = g.some((b) => b.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), p = ge(n, (g) => {
      h == null || h.disconnect(), g && (h == null || h.observe(g));
    }, { immediate: !0, flush: "post" });
    r(() => {
      p(), h == null || h.disconnect(), s.detach(d, c), a.value = null;
    });
  }, { immediate: !0 });
  return ca(o), {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Ye),
    loadSent: () => s == null ? void 0 : s.more(a.value, Qt)
  };
}
const Q0 = ["data-incoming", "data-ref"], J0 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], X0 = { class: "message-body" }, Z0 = ["title"], eb = ["innerHTML"], tb = ["title"], nb = ["innerHTML"], ab = {
  class: "message-faces",
  "data-message-faces": ""
}, sb = ["title", "data-face", "onClick"], ob = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, lb = ["title", "data-reaction", "onClick"], ib = {
  key: 0,
  class: "message-reaction-count"
}, rb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, ub = ["href", "title"], cb = ["src", "alt"], db = ["href"], fb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, hb = ["disabled", "data-sent-worker", "title", "onClick"], mb = { class: "message-foot" }, pb = { class: "message-time" }, vb = {
  class: "message-id",
  "data-message-id": ""
}, gb = 140, yb = 2, bb = 1500, kb = "An earlier message", wb = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(!1), o = S(null), l = M(() => ["user", "comment"].includes(n.message.type)), i = M(() => {
      const [Z, oe] = (n.message.commented_row || ":").split(":"), le = ht(Z);
      return le ? { ref: `${le}:${oe}`, label: `${Vt(le).title.toLowerCase()} ${oe}` } : null;
    }), r = M(() => n.message.worker_id ?? null), c = S(!1), d = M(() => r.value !== null && ((n.message.text ?? "").length > gb || (n.message.text ?? "").split(`
`).filter((Z) => Z.trim()).length > yb)), h = M(() => l.value && !n.message.read_at && !n.message.local);
    async function p() {
      var Z;
      await ((Z = navigator.clipboard) == null ? void 0 : Z.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, bb);
    }
    const g = pi(), b = M(() => g(n.message.text ?? "")), _ = M(() => JSON.parse(n.message.flowchart_edges || "[]")), O = S(!1), C = M(() => g(n.quote || kb));
    function j() {
      const Z = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Z ? Z.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    z0(o, () => `${n.message.text} ${n.quote}`);
    const z = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (Z) => `/api/files/message/${n.message.id}/${encodeURIComponent(Z)}`, B = M(() => JSON.parse(n.message.captions || "{}")), G = M(() => (n.message.files ?? []).map((Z) => ({ name: Z, address: W(Z), isImage: z.test(Z), title: B.value[Z] || Z }))), P = M(() => Si(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), L = Ce(De, null), { links: x, total: $, more: w, loading: v, failure: T, sentTo: A, sentMore: R, sentLoading: q, sentFailure: N, loadMore: ee, loadSent: te } = Y0(L, () => l.value && !n.message.local ? n.message.id : null, o), ie = S(!1), Oe = M(() => V0(n.message.reactions));
    function fe(Z) {
      ie.value = !1, a("react", n.message, Z);
    }
    return (Z, oe) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      E(w0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: oe[0] || (oe[0] = (le) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Q0)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", X0, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: oe[6] || (oe[6] = (...le) => I(Lt) && I(Lt)(...le))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: oe[1] || (oe[1] = $e((le) => I(Ne)(i.value.ref), ["stop"]))
          }, [
            E(ve, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + y(i.value.label), 1)
          ], 8, Z0)) : k("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(j, ["stop"]),
            innerHTML: C.value
          }, null, 8, eb)) : k("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: oe[2] || (oe[2] = $e((le) => I(Ne)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + y(r.value), 9, tb)) : k("", !0),
          m("div", {
            class: Y({ "message-folded": d.value && !c.value }),
            "data-message-text": "",
            innerHTML: b.value
          }, null, 10, nb),
          d.value ? (u(), f("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: oe[3] || (oe[3] = $e((le) => c.value = !c.value, ["stop"]))
          }, y(c.value ? "Show less" : "Show more"), 1)) : k("", !0),
          _.value.length ? (u(), f(D, { key: 4 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: oe[4] || (oe[4] = (le) => O.value = !0)
            }, "Open the flowchart"),
            O.value ? (u(), H(s0, {
              key: 0,
              title: e.message.text,
              edges: _.value,
              onClose: oe[5] || (oe[5] = (le) => O.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: ie.value }]),
          "data-message-tools": ""
        }, [
          ie.value ? (u(), f(D, { key: 0 }, [
            m("div", ab, [
              (u(!0), f(D, null, ae(I(U0), (le) => (u(), f("button", {
                key: le,
                type: "button",
                class: "message-face",
                title: `React ${le}`,
                "data-face": le,
                onClick: (et) => fe(le)
              }, y(le), 9, sb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: oe[7] || (oe[7] = (le) => ie.value = !1)
            }, [
              E(ve, {
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
              onClick: oe[8] || (oe[8] = (le) => ie.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: oe[9] || (oe[9] = (le) => a("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: p
            }, y(s.value ? "Copied" : "Copy"), 1),
            h.value ? (u(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: oe[10] || (oe[10] = (le) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      Oe.value.length ? (u(), f("div", ob, [
        (u(!0), f(D, null, ae(Oe.value, (le) => (u(), f("button", {
          key: le.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: le.mine }]),
          title: le.title,
          "data-reaction": le.emoji,
          onClick: (et) => a("react", e.message, le.emoji)
        }, [
          ne(y(le.emoji) + " ", 1),
          le.count > 1 ? (u(), f("span", ib, y(le.count), 1)) : k("", !0)
        ], 10, lb))), 128))
      ])) : k("", !0),
      G.value.length ? (u(), f("div", rb, [
        (u(!0), f(D, null, ae(G.value, (le) => (u(), f(D, {
          key: le.name
        }, [
          le.isImage ? (u(), f("a", {
            key: 0,
            href: le.address,
            target: "_blank",
            class: "message-image",
            title: le.title
          }, [
            m("img", {
              src: le.address,
              alt: le.name,
              "data-figure-picture": ""
            }, null, 8, cb)
          ], 8, ub)) : (u(), f("a", {
            key: 1,
            href: le.address,
            target: "_blank",
            class: "message-file"
          }, y(le.name), 9, db))
        ], 64))), 128))
      ])) : k("", !0),
      I(A).length ? (u(), f("div", fb, [
        E(ve, {
          name: "send",
          size: 12
        }),
        (u(!0), f(D, null, ae(I(A), (le) => (u(), f("button", {
          key: le.id,
          type: "button",
          class: "message-sent-worker",
          disabled: le.unavailable || !le.open_ref,
          "data-sent-worker": le.id,
          title: `Open worker ${le.id}`,
          onClick: $e((et) => le.open_ref && I(Ne)(le.open_ref), ["stop"])
        }, [
          ne("Also sent to worker " + y(le.id), 1),
          le.unavailable ? (u(), f(D, { key: 0 }, [
            ne(" (unavailable)")
          ], 64)) : k("", !0)
        ], 8, hb))), 128))
      ])) : k("", !0),
      E(pn, {
        more: I(R),
        loading: I(q),
        failure: I(N),
        label: "More recipients",
        onMore: I(te)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", mb, [
        m("time", pb, y(P.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(D, { key: 0 }, [
          oe[11] || (oe[11] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", vb, "message " + y(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (u(), H(P0, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      I(x).length || I(T) ? (u(), H(B0, {
        key: 3,
        links: I(x),
        total: I($),
        more: I(w),
        loading: I(v),
        failure: I(T),
        onMore: I(ee)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, J0));
  }
}, yS = /* @__PURE__ */ U(wb, [["__scopeId", "data-v-0be1107c"]]), ea = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ba = 200, zi = (e) => {
  var t;
  return ((t = ea.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ea[0].key;
}, bS = (e) => {
  var t;
  return ((t = ea.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, $b = ["aria-label"], xb = 300, Uo = 400, Sb = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ba } },
  setup(e) {
    const t = e, n = M(() => zi(t.value)), a = M(() => n.value < Ba ? [1, 0.25, 0.25] : n.value === Ba ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: Y(["ico", "prio", { hot: n.value >= Uo, high: n.value >= xb && n.value < Uo }]),
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
    ], 10, $b));
  }
}, kS = /* @__PURE__ */ U(Sb, [["__scopeId", "data-v-b10e610f"]]), _b = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Vo = (e) => _b[e.card.state] || "idle", Mb = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Go = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Ko = (e, t) => Go[Vo(e)] - Go[Vo(t)], Yo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, wS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Ko(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Mb(a, s)) : [...e].sort((a, s) => Ko(a, s) || (Yo[t] || Yo.state)(a, s)), Cb = { class: "list-row" }, Eb = {
  key: 0,
  class: "list-row-type"
}, Ab = { class: "list-row-main" }, Ob = {
  key: 0,
  class: "list-row-title"
}, Tb = { class: "list-row-body" }, Ib = {
  key: 1,
  class: "list-row-end"
}, Rb = {
  key: 1,
  class: "list-row-text"
}, Bb = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Cb, [
      e.type ? (u(), f("span", Eb, y(e.type), 1)) : k("", !0),
      m("div", Ab, [
        e.title ? (u(), f("span", Ob, y(e.title), 1)) : k("", !0),
        m("div", Tb, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", Ib, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (u(), f("span", Rb, y(e.text), 1)) : k("", !0)
    ]));
  }
}, $S = /* @__PURE__ */ U(Bb, [["__scopeId", "data-v-dfc8c3a7"]]), xS = {
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
    return (l, i) => (u(), H(Oi, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Lb = {
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
}, Ui = /* @__PURE__ */ U(Lb, [["__scopeId", "data-v-978e0921"]]), Nb = ["aria-label"], qb = { class: "head" }, Db = { class: "names" }, Pb = { class: "body" }, jb = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Zl(a, n), i = ei(s);
    return (r, c) => (u(), H(ua, { to: "body" }, [
      E(zt, {
        name: "side",
        appear: "",
        onAfterLeave: I(l)
      }, {
        default: F(() => [
          I(s) ? (u(), f("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ye({ "--depth": e.depth, zIndex: I(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = $e((...d) => I(o) && I(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), f(D, { key: 0 }, [
                m("header", qb, [
                  m("div", Db, [
                    m("h2", null, y(e.title), 1),
                    e.abstract ? (u(), H(at, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0)
                  ]),
                  me(r.$slots, "actions", {}, void 0, !0),
                  E(da, {
                    title: e.closeLabel,
                    onClick: I(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), H(Ui, { key: 0 }, {
                  default: F(() => [
                    me(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", Pb, [
                  me(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : me(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, Nb)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, SS = /* @__PURE__ */ U(jb, [["__scopeId", "data-v-f276f055"]]), Fb = {
  key: 1,
  class: "text-field-label"
}, Wb = {
  key: 2,
  class: "text-field-end"
}, Hb = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Dt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = an(e, "modelValue"), a = ra(), s = "onUpdate:modelValue" in (((d = Kr()) == null ? void 0 : d.vnode.props) || {}), o = M(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = M(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = M(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = S(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, I(a).class]),
      style: ye(I(a).style)
    }, [
      e.icon ? (u(), H(ve, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (u(), f("span", Fb, y(e.label), 1)) : k("", !0),
      Je(m("input", qe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [I(is), o.value]
      ]),
      h.$slots.end ? (u(), f("span", Wb, [
        me(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : Je((u(), f("input", qe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, r.value, { onInput: l }), null, 16)), [
      [I(is), o.value]
    ]);
  }
}), _S = /* @__PURE__ */ U(Hb, [["__scopeId", "data-v-d9c38ca8"]]), zb = { class: "title" }, Ub = { class: "state" }, Vb = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ns(t.line, t.events);
    return (o, l) => (u(), H(Sy, {
      rows: I(n),
      failure: I(a),
      loaded: I(s),
      empty: e.empty
    }, {
      default: F(({ row: i }) => [
        m("span", zb, y(i.title), 1),
        m("span", Ub, y(I(on)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, MS = /* @__PURE__ */ U(Vb, [["__scopeId", "data-v-9191a6f0"]]);
function Gb(e = 1e3, t = null) {
  const n = S(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ge(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const La = S(Date.now() / 1e3);
let Qo = 0, Bn = 0;
function Gs() {
  return Bn || (La.value = Date.now() / 1e3, Qo = setInterval(() => La.value = Date.now() / 1e3, 1e3)), Bn += 1, El() && ca(() => {
    Bn -= 1, Bn || clearInterval(Qo);
  }), La;
}
const Kb = 200, Yb = Fi + Fn + Wi + Kb;
function Kt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Qb(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Kt(e),
    top: Kt(e.querySelector(".top")),
    title: Kt(e.querySelector(".title")),
    contents: Kt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, r, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: r, transform: c, display: d }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: r, transform: c, display: d }))(getComputedStyle(e)),
    parent: Kt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Jb(e, t, n, a) {
  ge(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(Qb(o, l, n.value)), performance.now() - l < Yb) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const Xb = ["title", "data-figure-mark", "data-folded", "data-open"], Zb = {
  key: 2,
  class: "worker"
}, ek = { class: "head" }, tk = { key: 0 }, nk = {
  key: 3,
  class: "status"
}, ak = {
  key: 0,
  class: "figure"
}, sk = {
  key: 1,
  class: "ran-for"
}, ok = { key: 2 }, lk = {
  key: 3,
  class: "news"
}, ik = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, rk = {
  key: 6,
  class: "settled"
}, uk = {
  key: 1,
  class: "bar"
}, ck = {
  key: 3,
  class: "detail body"
}, dk = {
  key: 0,
  class: "body-label"
}, fk = ["title"], hk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ra(), a = ["onClick", "onAct"], s = M(() => Object.fromEntries(Object.entries(n).filter(([te]) => !a.includes(te)))), o = S(!1), l = M(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = M(() => t.open !== void 0), r = M(() => i.value || l.value), c = M(() => i.value ? t.open : o.value), d = M(() => i.value ? !t.open : l.value && !o.value), h = M(() => !!(t.mark.action && n.onAct)), p = M(() => r.value || h.value || !!n.onClick), g = S(null), b = S(null), { folded: _, phase: O } = Hi(g, () => d.value);
    Jb(g, d, O, Ce(De, null));
    function C(te) {
      var ie, Oe;
      if (!(te.target !== g.value && !b.value.contains(te.target))) {
        if (i.value) return (ie = n.onClick) == null ? void 0 : ie.call(n, te);
        if (l.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(te);
      }
    }
    const j = (te) => n.onAct(te), z = ["failed", "unfinished"], W = M(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? z.includes(t.mark.state) ? "danger" : "good" : ""), B = M(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = M(() => B.value || "var(--tone-work)"), P = M(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), L = Gs(), x = M(
      () => t.mark.began_at && P.value && !t.mark.figure && !t.mark.counting ? _i(L.value - t.mark.began_at) : ""
    ), $ = M(() => {
      const { started: te, ended: ie } = t.mark;
      return te ? ie ? `ran ${No(ie - te, !0)}` : No(L.value - te, !0) : x.value;
    }), w = ["bad", "danger", "warn"], v = M(() => w.includes(W.value) || t.mark.asks ? "attention" : P.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), T = ["bad", "danger"], A = M(() => T.includes(W.value)), R = M(() => v.value === "process" ? "running" : A.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), q = M(
      () => !!(t.mark.figure || $.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), N = M(() => [t.mark.title, t.mark.time ? Si(t.mark.time) : ""].filter(Boolean).join(" · ")), ee = M(() => ({
      ...B.value ? { "--mark": B.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (te, ie) => (u(), f("div", qe(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${v.value}`,
        I(O),
        {
          open: c.value,
          folding: i.value && d.value,
          live: p.value,
          failed: A.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: B.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ee.value,
      title: N.value,
      "data-figure-mark": e.mark.key,
      "data-folded": I(_) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (u(), H(yt(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": r.value ? String(!!c.value) : void 0
      }, {
        default: F(() => [
          e.mark.markIcon ? (u(), H(gt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), H(ve, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", Zb, y(e.mark.worker), 1)) : k("", !0),
          m("span", ek, [
            E(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", tk, y(e.mark.name), 1)) : k("", !0),
            r.value ? (u(), H(mt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          q.value ? (u(), f("span", nk, [
            e.mark.figure ? (u(), f("span", ak, y(e.mark.figure), 1)) : k("", !0),
            $.value ? (u(), f("span", sk, y($.value), 1)) : k("", !0),
            e.mark.stopping ? (u(), f("span", ok, "Stopping")) : k("", !0),
            e.mark.news ? (u(), f("span", lk, y(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (u(), f("span", ik)) : R.value ? (u(), H(gt, {
              key: 5,
              class: Y(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (u(), f("span", rk, y(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), H(ji, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(j, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && P.value ? (u(), f("span", uk, [
        m("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !I(_) ? (u(), H(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !I(_) ? (u(), f("div", ck, [
        e.mark.bodyLabel ? (u(), f("p", dk, y(e.mark.bodyLabel), 1)) : k("", !0),
        E(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !I(_) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, y(e.mark.command), 9, fk)) : k("", !0),
      e.mark.card ? (u(), H(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      me(te.$slots, "default", {
        shown: !I(_)
      }, void 0, !0)
    ], 16, Xb));
  }
}), Vi = /* @__PURE__ */ U(hk, [["__scopeId", "data-v-2aa9c496"]]), mk = 60, Gi = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Ki(e, t) {
  const n = S([]), a = S(0);
  let s = -1, o = 0, l = !1;
  async function i() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, a.value = d.value.first_byte, s = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function r() {
    if (s < 0) return i();
    const d = await e(["output", "page", String(t()), "--after", String(s)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < s ? i() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), s = d.value.last_byte, d) : d;
  }
  async function c(d) {
    if (l || a.value <= 0 || d.scrollTop > mk) return;
    l = !0;
    const h = d.scrollHeight, p = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, p.ok && (n.value = [...p.value.lines, ...n.value], a.value = p.value.first_byte, await He(), d.scrollTop += d.scrollHeight - h);
  }
  return { lines: n, newest: i, follow: r, loadEarlier: c };
}
const pk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Yi(e) {
  var n;
  const t = pk[e] || ((n = Vt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const vk = (e) => Yi(String(e).split(":")[0]), gk = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), yk = { passed: "good", failed: "danger", warned: "warn", running: "" }, bk = { good: "good", warn: "warn", danger: "danger" }, Jo = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Tf(e.target_model, e.target_id || 0)
}, kk = { "open row": (e) => vk(e.target_model), "open page": () => Yi("pages") };
function wk(e, t) {
  const n = t || {}, a = Jo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? yk[e.outcome] || "" : bk[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? kk[a](e) : "",
    handlers: a ? { onAct: () => Jo[a](e) } : {}
  };
}
const $k = 24, xk = 1e3, Xo = 2e3, Sk = 0.25, _k = 5e3;
function Mk(e, t = $k, n = () => !0) {
  const a = S(!1), s = S(0), o = S(!1);
  let l = 0, i = 0, r = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const W = c();
    return W ? W.scrollHeight - W.scrollTop - W.clientHeight : 0;
  }, h = () => !c() || d() <= t;
  function p(W) {
    if (clearTimeout(l), !W) {
      o.value = !1, r = Date.now();
      return;
    }
    const B = Date.now() - r < Xo ? Xo : xk;
    l = setTimeout(() => o.value = a.value, B);
  }
  function g() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(W = !1) {
    const B = c();
    B && W && B.scrollTo ? B.scrollTo({ top: B.scrollHeight, behavior: "smooth" }) : B && (B.scrollTop = B.scrollHeight), g();
  }
  function _() {
    C(), !a.value && (a.value = !0, p(!0));
  }
  const O = () => !!c() && d() <= c().clientHeight * Sk;
  function C() {
    clearTimeout(i), O() && (i = setTimeout(() => a.value && O() && n() && b(!0), _k));
  }
  function j() {
    h() ? g() : _();
  }
  function z(W = 1, B = !1) {
    a.value ? s.value += Math.max(0, W) : b(B);
  }
  return El() && ca(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: g, toBottom: b, left: _, scrolled: j, arrived: z };
}
const Ck = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Ek = (e) => String(e ?? "").replace(Ck, ""), Ak = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(null), { away: o, scrolled: l, arrived: i, toBottom: r } = Mk(s);
    ge(
      () => n.lines.length,
      () => He(() => i()),
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
      ne(y(I(Ek)(e.lines.join(`
`)) || e.empty), 1),
      I(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => I(r)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, Ok = /* @__PURE__ */ U(Ak, [["__scopeId", "data-v-c2fb1783"]]), Tk = "*.*", Ik = {
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
    const t = e, n = Ce(De, null), a = new Pl();
    ge(
      () => a.patterns,
      (r, c, d) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, r, (g) => a.dispatch(g));
        d(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = M(() => !!(t.declaration.shipped || t.declaration.trusted)), i = M(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Tk] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), H(qi, {
      key: 0,
      entry: i.value,
      subscriptions: I(a),
      environment: I(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), H(Ni, {
      key: 1,
      entry: i.value,
      subscriptions: I(a),
      environment: I(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Rk = { class: "mark-more-inner" }, Bk = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Lk = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Nk = {
  key: 3,
  class: "mark-lines"
}, qk = "process", Zo = "task", Dk = {
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
    const t = e, n = ze(), a = M(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = M(() => gk.has(t.mark.variant) && t.mark.detail || ""), o = M(() => t.mark.target_model === Zo ? t.mark.target_id : 0), l = Ki(
      Gi(n),
      () => t.mark.target_id
    ), i = l.lines, r = S(!1), c = S(""), d = M(() => !t.declaration.body_url && t.mark.target_model === qk && !!t.mark.target_id);
    async function h(g = l.follow) {
      const b = await g();
      r.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = M(() => t.shown && d.value);
    return ge(p, (g) => g && h()), Es(() => p.value && h(), () => p.value && !t.mark.ended_at), ge(
      () => t.mark.ended_at,
      (g) => g && p.value && h(l.newest)
    ), (g, b) => (u(), f("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = $e(() => {
      }, ["stop"]))
    }, [
      m("div", Rk, [
        e.declaration.body_url ? (u(), H(Ik, {
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
            m("p", Bk, y(s.value), 1)
          ], 64)) : k("", !0),
          d.value && c.value ? (u(), f("p", Lk, y(c.value), 1)) : d.value && r.value ? (u(), f(D, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            E(Ok, {
              class: "mark-terminal",
              lines: I(i),
              onOlder: I(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", Nk, y(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = $e((_) => I(Ne)(`${Zo}:${o.value}`), ["stop"]))
          }, " Open task " + y(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ps = /* @__PURE__ */ U(Dk, [["__scopeId", "data-v-d5db6cd9"]]), Pk = ["title", "aria-label", "onClick"], jk = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Fk = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = M(() => nf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = S(""), s = Ce(De);
    async function o(l) {
      const i = await vn(l, { id: t.mark.target_id }, s.environment);
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
        E(gt, {
          name: r.icon
        }, null, 8, ["name"])
      ], 8, Pk))), 128)),
      a.value ? (u(), f("span", jk, y(a.value), 1)) : k("", !0)
    ], 64));
  }
}, Wk = /* @__PURE__ */ U(Fk, [["__scopeId", "data-v-7a62c88e"]]);
function Qi(e, t) {
  const n = Qe(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Ji = Qi("/api/marks", "marks"), CS = Ji.fetchAll, Hk = Ji.find, zk = ["data-ref"], Uk = ["data-ref"], Vk = { class: "mark-row" }, Gk = "dock add", Kk = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = M(() => Hk(a.mark.type)), o = M(() => wk(a.mark, s.value)), l = M(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), i = S(!1);
    function r(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      i.value = !i.value;
    }
    const c = M(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((h) => {
        var p;
        return !a.docked || !((p = h.runs) != null && p.startsWith(Gk));
      }).map((h) => ({ ...h, module: s.value.module }));
    });
    return (d, h) => {
      var p, g;
      return (p = s.value) != null && p.card ? (u(), f("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": I(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        E(ps, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, zk)) : (u(), f("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": I(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Vk, [
          E(Vi, qe({
            mark: o.value,
            open: l.value ? i.value : void 0
          }, Yr(o.value.handlers), { onClick: r }), Qr({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: F(({ shown: b }) => [
                E(ps, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: b
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          E(Wk, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Uk));
    };
  }
}, Yk = /* @__PURE__ */ U(Kk, [["__scopeId", "data-v-afd7d6b1"]]), Qk = ["data-ref"], Jk = ["inert"], Xk = { class: "group-fold" }, Zk = { class: "thread-group" }, ew = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = S(!1), a = S(!1), s = S(!1), o = S(null);
    ge(n, async (i) => {
      var r;
      a.value = !0, await He(), (r = o.value) == null || r.offsetHeight, s.value = i;
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
    return (i, r) => (u(), f("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      E(Vi, {
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
        m("div", Xk, [
          m("div", Zk, [
            (u(!0), f(D, null, ae(e.group.marks, (c) => (u(), H(Yk, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Jk)) : k("", !0)
    ], 8, Qk));
  }
}, ES = /* @__PURE__ */ U(ew, [["__scopeId", "data-v-45b58b9b"]]);
function tw(e) {
  const t = S(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Se(() => n.observe(e.value)), Ze(() => n.disconnect()), t;
}
const nw = { class: "chat-dock-fold" }, aw = ["aria-label"], sw = { class: "chat-dock-head" }, ow = { class: "chat-dock-inner" }, lw = { class: "chat-dock-foot" }, Xi = 700, iw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = S(null), a = S(null), s = tw(a), o = S(!1);
    let l = 0;
    return Se(() => l = setTimeout(() => o.value = !0, Xi)), Ze(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", nw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          me(i.$slots, "edge", {}, void 0, !0),
          m("header", sw, [
            me(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", ow, [
              m("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ye(I(s) === null ? null : { height: `${I(s)}px` })
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
          m("footer", lw, [
            me(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, aw)
      ])
    ], 2));
  }
}, Zi = /* @__PURE__ */ U(iw, [["__scopeId", "data-v-ea4dd536"]]), rw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Na = 5, uw = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Na, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Na}s`, animationDelay: `${(n - Na).toFixed(2)}s` };
    return (s, o) => (u(), f("span", rw, [
      m("i", { style: a })
    ]));
  }
}, er = /* @__PURE__ */ U(uw, [["__scopeId", "data-v-2a7bc150"]]), cw = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), vs = (e) => e.charAt(0).toUpperCase() + e.slice(1), dw = (e) => vs(e.replace(/_at$/, "").replaceAll("_", " ")), fw = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, hw = (e, t, n) => [vs(`${e} ${n}`), (t == null ? void 0 : t.state) && vs(t.state)].filter(Boolean).join(" · "), tr = (e) => e.given_name || `${Kn(e.role)} ${e.id}`, mw = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? tr(t) : (e == null ? void 0 : e.name) ?? "", pw = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? tr(t) : "", vw = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !cw.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: dw(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], gw = { reviewing: "Under review" }, yw = (e, t) => e || gw[t == null ? void 0 : t.state] || "", nr = Qi("/api/docks", "docks"), AS = nr.fetchAll, Rt = nr.find, bw = 6, kw = 3, qa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ma = (e) => Date.parse(e.leaves_at) / 1e3, St = (e) => !!(e.leaves_at && !e.kept), ww = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!St(e) || t < ma(e) || n.has(e.id)), $w = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => ww(a, t, n)).sort((a, s) => a.id - s.id);
function xw(e, t, n = bw) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ma(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Sw = (e, t, n = e) => n < 2 ? !1 : e >= kw ? !0 : t, _w = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), gs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Mw = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Cw = (e) => ({ ...e.kept ? gs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : gs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Ew = ["keep", "unkeep", "open", "undock"], Aw = (e) => ({ ...e, iconOnly: Ew.includes(e.action) });
function Ow(e, t) {
  var n;
  return [
    ...Mw(e, t) ? [Cw(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Vt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    gs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(Aw);
}
function Tw(e, t) {
  const n = Ow(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: _w(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Iw = { class: "dock-text" }, Rw = ["title"], Bw = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Lw = {
  class: "dock-facts",
  "data-dock-facts": ""
}, Nw = {
  key: 1,
  "data-dock-row": ""
}, qw = {
  key: 2,
  class: "dock-kept"
}, Dw = { class: "dock-acts" }, Pw = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = M(() => Rt(a.item.type)), o = Gs(), l = M(() => zs(a.item.created_at, o.value * 1e3)), i = S(null), r = S(null), c = S(null), d = S(null), h = M(() => Tw(a.item, s.value)), p = ze(), g = M(() => `dock.${a.item.id}`), b = M(() => p.props[g.value].data.value), _ = M(() => Xn(a.item.target_model ?? "")), O = M(() => {
      var $;
      return (($ = s.value) == null ? void 0 : $.word) ?? "";
    }), C = M(() => ({ ...b.value, id: a.item.target_id, noun: _.value })), j = () => {
      var $, w;
      return ((w = ($ = s.value) == null ? void 0 : $.reads) == null ? void 0 : w.length) && p.reload(g.value);
    };
    bc(Cl, { data: b, reload: j, readOutput: Gi(p) }), ge(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      ($, w, v) => {
        var A;
        j();
        const T = (A = p.subscriptions) == null ? void 0 : A.follow(`dock ${a.item.id}`, [`${_.value.replaceAll("-", "_")}.*`], (R) => {
          (!R.row_id || R.row_id === a.item.target_id) && j();
        });
        v(() => T == null ? void 0 : T());
      },
      { immediate: !0 }
    );
    const z = S(/* @__PURE__ */ new Set()), W = S("");
    async function B($) {
      if ($.action === "undock") return n("undock", $);
      if ($.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (z.value = /* @__PURE__ */ new Set([...z.value, $.label])), W.value = "";
      const v = await vn($, { id: a.item.target_id }, p.environment);
      (v == null ? void 0 : v.ok) === !1 && (z.value = new Set([...z.value].filter((T) => T !== $.label)), W.value = `Could not ${$.label.toLowerCase()}: ${v.error}`);
    }
    const G = M(() => h.value.actions.filter(($) => !z.value.has($.label))), P = M(() => {
      var $;
      return yw(($ = s.value) == null ? void 0 : $.badge, C.value);
    }), L = M(() => h.value.controls), x = M(() => {
      var $;
      return !!(($ = s.value) != null && $.draws_head) && !a.collapsed;
    });
    return ($, w) => {
      var v, T, A, R;
      return u(), H(Zi, {
        label: h.value.title + ((v = s.value) != null && v.needs_user ? ", waiting for you" : ""),
        type: (T = s.value) != null && T.needs_user ? "waiting" : "",
        folded: !!((A = s.value) != null && A.folds) && e.folded,
        body: !!((R = s.value) != null && R.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: w[3] || (w[3] = (q) => e.collapsed && n("open"))
      }, {
        edge: F(() => [
          e.leaving && !e.item.kept ? (u(), H(er, {
            key: 0,
            "ends-at": I(ma)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: F(() => {
          var q;
          return [
            x.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(D, { key: 1 }, [
              E(ve, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", Iw, [
                m("span", {
                  class: "dock-title",
                  title: h.value.title
                }, y(h.value.title), 9, Rw)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (q = s.value) != null && q.leaves_after_seconds ? k("", !0) : (u(), f(D, { key: 0 }, [
                ne(y(l.value), 1)
              ], 64))
            ], 512),
            L.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: w[0] || (w[0] = $e(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(D, null, ae(L.value, (N) => {
                var ee, te;
                return u(), f(D, {
                  key: N.action + N.runs
                }, [
                  !z.value.has(N.label) && (!((ee = N.variants) != null && ee.length) || !((te = C.value) != null && te.state) || N.variants.includes(C.value.state)) ? (u(), H(pe, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: N.pressed }),
                    "aria-pressed": N.pressed,
                    "aria-label": N.label,
                    title: N.label,
                    "data-dock-action": N.action,
                    onClick: (ie) => B(N)
                  }, {
                    default: F(() => [
                      E(ve, {
                        name: N.icon,
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
        still: F(() => [
          W.value || e.refusal ? (u(), f("p", Bw, y(W.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: F(() => {
          var q;
          return [
            m("span", Lw, [
              P.value ? (u(), f("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, y(P.value), 3)) : k("", !0),
              O.value ? (u(), f("span", Nw, y(O.value) + " " + y(e.item.target_id), 1)) : k("", !0),
              e.item.kept ? (u(), f("span", qw, "Kept")) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: r,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (q = s.value) != null && q.folds ? (u(), H(pe, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: w[1] || (w[1] = (N) => n("fold"))
            }, {
              default: F(() => [
                ne(y(s.value.folds) + " ", 1),
                E(mt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            m("span", Dw, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              E(Ds, {
                name: `dock.${e.item.type}`,
                row: C.value,
                environment: I(p).environment,
                "read-only": I(p).readOnly,
                "object-name": I(Xn)(e.item.target_model),
                "external-failure": "",
                onFailure: w[2] || (w[2] = (N) => W.value = N),
                onDone: $.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(D, null, ae(G.value, (N) => (u(), H(pe, {
                key: N.action + N.runs,
                small: "",
                variant: N.primary ? "primary" : "ghost",
                bordered: !N.primary,
                "data-dock-action": N.action,
                onClick: (ee) => B(N)
              }, {
                default: F(() => [
                  ne(y(N.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: F(() => {
          var q;
          return [
            (q = s.value) != null && q.body_url ? (u(), H(ps, {
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
}, el = /* @__PURE__ */ U(Pw, [["__scopeId", "data-v-990215c2"]]), jw = ["title", "aria-label"], Fw = { class: "run-chip-in" }, Ww = {
  key: 0,
  class: "run-chip-ring"
}, Hw = { class: "run-chip-name" }, zw = { class: "run-chip-bar" }, Uw = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = ze(), o = M(() => `run.${a.item.target_id}`), l = M(() => s.props[o.value].data.value), i = M(() => !l.value || l.value.state === "running" || l.value.state === "background"), r = M(() => {
      var p, g;
      return ((p = l.value) == null ? void 0 : p.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), c = M(() => i.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let h = null;
    return Se(() => {
      var p;
      d(), h = (p = s.subscriptions) == null ? void 0 : p.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), Ze(() => h == null ? void 0 : h()), (p, g) => {
      var b;
      return u(), f("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: ye({ "--tone": c.value })
      }, [
        I(St)(e.item) ? (u(), H(er, {
          key: 0,
          "ends-at": I(ma)(e.item)
        }, null, 8, ["ends-at"])) : k("", !0),
        m("span", Fw, [
          i.value ? (u(), f("span", Ww)) : (u(), H(gt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", Hw, y(r.value), 1)
        ]),
        m("span", zw, [
          m("i", {
            style: ye({ width: i.value ? `${((b = l.value) == null ? void 0 : b.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, jw);
    };
  }
}, Vw = /* @__PURE__ */ U(Uw, [["__scopeId", "data-v-226ac6c8"]]), Gw = 24, Kw = 8, OS = 420;
function TS({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Gw ? !0 : e < t && s > Kw ? !1 : null;
}
const Yw = (e, t) => e === void 0 ? t : e, Qw = { me: 1, people: [] }, ta = Ht({
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
  people: Qw,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Yn("journal.activity", !0),
  wide: !1,
  sideMini: Yn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
ii("journal.activity", () => ta.activity);
ii("journal.side.mini", () => ta.sideMini);
const ar = "journal.viewer.";
function Jw(e, t, n) {
  try {
    const a = n.getItem(ar + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function Xw(e, t, n) {
  try {
    n.setItem(ar + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function tl(e, t, n = window.localStorage) {
  const a = S(Jw(e, t, n));
  return ge(a, (s) => Xw(e, s, n), { deep: !0 }), a;
}
const Zw = {
  key: "dock-all",
  class: "dock-all"
}, e2 = {
  key: "runs-head",
  class: "dock-runs-head"
}, t2 = { class: "dock-runs-title" }, n2 = { class: "dock-runs-chips" }, a2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var R, q;
    const t = e, n = Gb(500), a = S(/* @__PURE__ */ new Set()), s = S(!1), o = S(!1), l = Ce(De), i = S(/* @__PURE__ */ new Set()), r = S({});
    async function c(N, ee) {
      r.value = { ...r.value, [N.id]: "" }, i.value = /* @__PURE__ */ new Set([...i.value, N.id]);
      const te = await vn(ee, { id: N.target_id }, l.environment);
      (te == null ? void 0 : te.ok) === !1 && (i.value = new Set([...i.value].filter((ie) => ie !== N.id)), r.value = { ...r.value, [N.id]: `Could not dismiss this card: ${te.error}` });
    }
    const d = M(
      () => $w(
        t.items.filter((N) => !i.value.has(N.id)),
        n.value,
        a.value
      )
    ), h = M(
      () => xw(
        d.value.filter((N) => qa(N, Rt)),
        n.value
      )
    ), p = M(() => d.value.filter((N) => !h.value.includes(N) && !qa(N, Rt))), g = M(() => h.value.filter((N) => !St(N))), b = tl(`dock-size:${((R = ta.identity) == null ? void 0 : R.root) || location.host}`, null), _ = (N) => {
      var ee;
      return !!((ee = Rt(N.type)) != null && ee.needs_user);
    }, O = S(/* @__PURE__ */ new Set()), C = M(() => d.value.length === 1), j = (N) => _(N) || C.value, z = (N) => j(N) ? O.value.has(N.id) : b.value ? b.value.collapsed && !b.value.opened.includes(N.id) : t.collapsed, W = M(() => d.value.some(z)), B = M(() => (s.value = Sw(h.value.length, s.value, g.value.length)) && !o.value && !d.value.some(z));
    function G() {
      const N = !W.value;
      b.value = { collapsed: N, opened: [] }, O.value = new Set(N ? d.value.filter(_).map((ee) => ee.id) : []);
    }
    function P(N) {
      var te;
      if (!z(N)) return;
      if (j(N)) return void (O.value = new Set([...O.value].filter((ie) => ie !== N.id)));
      const ee = (te = b.value) != null && te.collapsed ? b.value.opened : [];
      b.value = { collapsed: !0, opened: [...ee, N.id] };
    }
    const L = tl(`dock-folded:${((q = ta.identity) == null ? void 0 : q.root) || location.host}`, {}), x = (N) => {
      var ee;
      return !!((ee = Rt(N.type)) != null && ee.folds) && Yw(L.value[N.id], qa(N, Rt) || t.folded);
    };
    function $(N) {
      L.value = { ...L.value, [N.id]: !x(N) };
    }
    function w(N) {
      L.value = { ...L.value, ...Object.fromEntries(h.value.map((ee) => [ee.id, ee.id !== N.id])) }, o.value = !0;
    }
    function v() {
      L.value = Object.fromEntries(Object.entries(L.value).filter(([N]) => !h.value.some((ee) => String(ee.id) === N))), o.value = !1;
    }
    function T(N) {
      a.value = /* @__PURE__ */ new Set([...a.value, N.id]);
    }
    function A(N) {
      a.value = new Set([...a.value].filter((ee) => ee !== N.id));
    }
    return (N, ee) => (u(), H(Ms, {
      tag: "div",
      name: "dock",
      duration: I(Xi),
      class: "dock-stack"
    }, {
      default: F(() => [
        d.value.length > 1 ? (u(), f("div", Zw, [
          E(pe, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": W.value ? "Open all" : "Collapse all",
            onClick: G
          }, {
            default: F(() => [
              E(mt, {
                open: !W.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (u(!0), f(D, null, ae(p.value, (te) => (u(), H(el, {
          key: te.id,
          item: te,
          class: Y({ timed: I(St)(te) }),
          leaving: I(St)(te) && !a.value.has(te.id),
          folded: x(te),
          collapsed: z(te),
          refusal: r.value[te.id],
          onOpen: (ie) => P(te),
          onFold: (ie) => $(te),
          onUndock: (ie) => c(te, ie),
          onMouseenter: (ie) => T(te),
          onMouseleave: (ie) => A(te)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !W.value ? (u(), f("div", e2, [
          m("span", null, y(h.value.length) + " runs", 1),
          E(pe, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: v
          }, {
            default: F(() => [
              ee[1] || (ee[1] = ne(" Runs ", -1)),
              E(mt, { open: "" })
            ]),
            _: 1
          })
        ])) : k("", !0),
        (u(!0), f(D, null, ae(B.value ? [] : h.value, (te) => (u(), H(el, {
          key: te.id,
          item: te,
          class: Y({ timed: I(St)(te) }),
          leaving: I(St)(te) && !a.value.has(te.id),
          folded: x(te),
          collapsed: z(te),
          refusal: r.value[te.id],
          onOpen: (ie) => P(te),
          onFold: (ie) => $(te),
          onUndock: (ie) => c(te, ie),
          onMouseenter: (ie) => T(te),
          onMouseleave: (ie) => A(te)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        B.value ? (u(), H(Zi, {
          key: "runs-row",
          label: `${h.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: F(() => [
            E(ve, {
              name: "runs",
              size: 14
            }),
            m("span", t2, y(h.value.length) + " runs", 1)
          ]),
          foot: F(() => [
            m("span", n2, [
              (u(!0), f(D, null, ae(h.value, (te) => (u(), H(Vw, {
                key: te.id,
                item: te,
                onClick: (ie) => w(te)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            E(pe, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: ee[0] || (ee[0] = (te) => o.value = !0)
            }, {
              default: F(() => [
                ee[2] || (ee[2] = ne(" Runs ", -1)),
                E(mt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : k("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, IS = /* @__PURE__ */ U(a2, [["__scopeId", "data-v-cf067799"]]), _t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Wn = (e) => Math.min(Math.max(e, 0), 1), s2 = (e) => {
  const t = Wn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => s2((e - t) / (n - t));
function RS(e) {
  const t = Wn(e), n = Wn((t - 0.12) / 0.76) * _t.shuffles, a = Math.min(Math.floor(n), _t.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), r = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Wn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / _t.shuffles, lift: _t.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function BS(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const nl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, LS = (e) => nl[e] ?? nl.butler, Ks = 2400, o2 = 0.05;
function l2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, o2), l = Math.min(t + Ks * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function NS(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function i2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function qS(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const DS = (e, t) => ({ ...e, stretch: t.stretch }), PS = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, sr = (e, t) => t >= (e.least ?? 0);
function jS(e, t, n) {
  if (!sr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const FS = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), r2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", al = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), u2 = (e) => e.right > e.left && e.bottom > e.top;
function WS(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(r2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = al(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = al(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), u2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function or(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [d, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const g = t[d] - e[d];
      if (Math.abs(g) < 1e-9)
        (e[d] < o[h] || e[d] > o[p]) && (i = -1);
      else {
        const b = (o[h] - e[d]) / g, _ = (o[p] - e[d]) / g;
        l = Math.max(l, Math.min(b, _)), i = Math.min(i, Math.max(b, _));
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
}, un = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), c2 = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => c2(un(e, t, n)), d2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ft = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Ln = ([e, t], n) => e + n() * (t - e);
function f2(e) {
  return d2.map(() => {
    const t = Ln(ft.speed, e), n = Ln(ft.angle, e) * Math.PI / 180, a = Ln(ft.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Ln(ft.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const h2 = f2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function m2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ft.gravity * (t[2] - ft.floor))) / ft.gravity;
}
function HS(e, t, n = h2) {
  const a = Ae.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = m2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= ft.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const zS = (e, t) => e && Ae[e.name] ? { name: e.name, u: t / e.frames } : null;
function US(e, t) {
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
const VS = () => Array.from({ length: Ae.pogo.count }, (e, t) => Ae.pogo.bounce * (t + 1) / Ae.pogo.count), qt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function GS(e, t, n) {
  const { away: a, side: s } = Ae.bug_smash, o = s * a * n, [l, i] = [t.left + qt.margin * n, t.right - qt.margin * n], r = Math.min(Math.max(e + o + s * qt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function KS(e, t, n) {
  const a = Ae.bug_smash, s = Te(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (qt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: qt.tall * n * (1 - Te(t, a.emerge)),
      turn: 90 * (1 - Te(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Te(t, a.gone)
    }
  };
}
function YS(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= qt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = l2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Le = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function QS(e) {
  const t = Le.least + Math.floor(e() * (Le.most - Le.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Le.walls[Math.floor(e() * Le.walls.length)],
    along: Le.margin + e() * (1 - 2 * Le.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ys(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Le.margin, l = ((e.along - Le.margin + e.way * Le.speed * n / a) / s % 2 + 2) % 2, i = Le.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Le.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Le.inset : t.right - Le.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function p2(e, t) {
  const n = Ae.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = i2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function JS(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ae.bug_shot, { frame: l, bug: i, shot: r } = p2(n, e.length), c = e.map((C, j) => ({ ...ys(C, t, Math.min(n / o.fps, Hn(j).shot)), shot: j < r })), d = Te(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], g = e.map((C, j) => ({ bug: C, index: j, seconds: n / o.fps - Hn(j).shot, spot: ys(C, t, Hn(j).shot) })).filter((C) => C.seconds >= 0), b = g.flatMap((C) => {
    const j = (s == null ? void 0 : s.get(C.index)) ?? k2(C.bug, t, C.spot, s ? [] : a);
    return s == null || s.set(C.index, j), s && w2(j, C.seconds, a), $2(j, C.seconds, a);
  }), _ = g.filter((C) => y2(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), O = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: O }, slush: b, camera: _ };
}
function Hn(e) {
  const t = Ae.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function XS(e, t, n, a) {
  const { limit: s, margin: o } = Ae.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = Hn(d), p = ys(c, t, h.shot), g = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - p.x), _ = Math.abs(p.x - r) >= g ? r : p.x + b * g, O = b > 0 ? Math.max(r, Math.min(_, i)) : Math.min(r, Math.max(_, l)), C = { from: r, to: O, begin: h.walk, end: h.aim };
    return r = O, C;
  });
}
function ZS(e, t, n) {
  var o;
  const a = Ae.bug_shot.back.stride * n;
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
const _e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, v2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function g2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const y2 = (e) => e.along * 97 % 1 < _e.camera, cn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * _e.gravity * t * t });
function b2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * _e.gravity * (t.bottom - e.from.y))) / _e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * _e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / _e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += _e.step) {
    const d = Math.min(c + _e.step, l.t), h = cn(e, d), p = or(i, h, n);
    if (p) return { ...p, t: c + (d - c) * p.share };
    i = h;
  }
  const r = cn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function k2(e, t, n, a = []) {
  const s = g2(e.along + 1), [o, l] = v2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: _e.count }, () => {
    const r = i + (s() - 0.5) * 2 * (_e.spread * Math.PI / 180), c = _e.speed[0] + s() * (_e.speed[1] - _e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: _e.radius[0] + s() * (_e.radius[1] - _e.radius[0]) };
    return { ...d, ...b2(d, t, a) };
  });
}
function w2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += _e.step) {
      const l = Math.min(o + _e.step, s), i = or(cn(a, o), cn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function $2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...cn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - _e.hold) / _e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, r = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - r)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: r, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function e6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: r } = Ae.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / r, d = (o[1] - o[0]) * i / r, h = Te(e, [0, c]), p = Te(e, [c, c + d]);
  return l.map((g) => {
    const b = { x: a.x + g.at[0] * t, y: a.y + g.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * h,
      y: n.y + (b.y - n.y) * h,
      r: g.size * t * (0.15 + 0.85 * h * h),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: h >= 1
    };
  });
}
function t6(e, t, n, a, s) {
  const { sway: o, above: l } = Ae.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (_) => {
    const [O, C] = [_.x - e.at.x, _.y - e.at.y];
    return { x: i.x + O * c - C * d, y: i.y + O * d + C * c };
  }, [p, g] = [...n].sort((_, O) => _.x - O.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: b.map((_, O) => ({ from: _, to: O < b.length / 2 ? p : g })) };
}
const n6 = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function na(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: un(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: un(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function a6(e, t) {
  const n = Ae[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = na(n, t), l = 1 - (1 - n.small) * Te(a, n.shrinks) * (1 - Te(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = na(n, t), o = n.flat * Te(a, n.squashes) * (1 - Te(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * un(s, ...n.springs)) * (1 - un(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const s6 = (e) => e === "pack_box";
function o6(e) {
  const { into: t, out: n } = na(Ae.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function l6(e) {
  const t = Ae.rope_swing, { into: n, out: a } = na(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const x2 = { after: 3 }, Ys = 10, S2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, _2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, M2 = { weight: 19 }, lr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, C2 = { every: 120 }, ir = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, rr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, E2 = {
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
}, kn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Ys }), re = (e, t, n = {}) => kn(e, "clip", t, n), Da = (e, t, n = {}) => kn(e, "look", t, n), sl = (e, t, n = {}) => kn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...kn(e, "pick", t, n), ...a }), we = (e) => kn("nothing", "nothing", e, {}), A2 = 120, O2 = 300, Pa = (e, t) => ({ ...re(e, t), cooldown: O2 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), T2 = () => [re("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: S2[e.name] }), Yt = (e) => ({ ...e, shenanigan: !0, lasts: _2[e.name] }), pa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...de("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...de("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(re("bug_smash", 2)), toward: "", onto: !1 },
    re("nod", 2)
  ]),
  ...de("tests_failed", { cooldown: 20, toward: "card" }, [re("startled", 2), re("dismay", 1), re("tantrum", 3), we(1)]),
  ...de("committed", { cooldown: 30, toward: "card", onto: !0 }, [re("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...de("sin_fixed", { cooldown: 300 }, [re("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...de("sin_committed", { cooldown: 300 }, [re("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...de("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [re("nod", 4), re("hand_rub", 4), we(7)]),
  ...de("question_asked", { cooldown: 60 }, [re("ask_sign", 9), re("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...de("reported", { cooldown: 90 }, [sl("read", 3), re("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [sl("read", 3), we(1)]),
  ...de("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), we(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, T2()),
  ...de("bar_failed", { holds: !0 }, [re("fume", 1), re("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...de("standing", { cooldown: 12 }, [re("look_left", 2), re("look_right", 2), re("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...de("launched", { cooldown: 300 }, [re("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...de("building", { cooldown: 30 }, [re("wipe_brow", 4), re("look_left", 1), re("look_right", 1), we(69)]),
  ...de("failed", { cooldown: 20, toward: "card" }, [re("shake", 3), re("tantrum", 2), we(2)]),
  ...de("refused", { cooldown: 20 }, [re("shake", 1), we(1)]),
  ...de("work_done", { cooldown: 120 }, [re("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...de("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...de("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...de("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...de("answered", { cooldown: 15 }, [Da("amused", 3), we(2)]),
  ...de("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...de("long_walk", { cooldown: 90 }, [re("stumble", 3), we(22)]),
  ...de("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), we(13)]),
  ...de("typing", { cooldown: 60 }, [Da("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(E2).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Da(t, 1)])),
  ...Object.entries(ir).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(rr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...de("pastime", {}, [
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
    { ...Yt($t(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Yt($t(re("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...de("held:search", { cooldown: A2 }, [Pa("search", 3), { ...Pa("binoculars", 2), when: { home: !0 } }, { ...Pa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...de("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...de("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...de("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...de("tickled", {}, [{ ...$t(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...de("eager", {}, [re("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...de("jump", {}, [Yt($t(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...de("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...de("unit", { cooldown: lr.build.cooldown }, [be("unit", M2.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: C2.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...de("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...de("roam", {}, [
    be("rest", 35, {}, { stay: [25, 60] }),
    be("seat", 15, {}, { stay: [15, 40] }),
    be("edge", 25, {}, { stay: [8, 20] }),
    Yt(be("bubble", 15, {}, { stay: [30, 80] })),
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
    Yt($t(be("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...de("laptop", {}, [be("seat", 6, {}, { stay: [60, 150] }), be("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...de("ledge_at", {}, [be("middle", 2, {}, { along: 1 / 2 }), be("third", 1, {}, { along: 1 / 3 }), be("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...de("composed_as", {}, [
    be("facing", 4, {}, { turn: 0, leans: 0 }),
    be("turned_left", 1, {}, { turn: 335, leans: 0 }),
    be("turned_right", 1, {}, { turn: 25, leans: 0 }),
    be("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    be("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], ur = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), cr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), I2 = (e) => Array.isArray(e) ? e[0] : e, R2 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, B2 = (e) => pa.some((t) => t.when.moment === e);
function L2(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || cr(d).every(([h, p]) => n(h) >= I2(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = pa.filter((d) => ur(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= x2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ve(e, t) {
  const n = L2(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (dr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function dr(e, t, n) {
  var a;
  for (const [s, o] of cr(t)) (a = e.memory) == null || a.set(s, e.now + R2(o, n));
}
function i6(e, t, n) {
  dr(e, pa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const r6 = (e) => Object.values(lr).find((t) => ur(t.when, e)) ?? null, N2 = (e, t, n) => n - t <= (e.lifetime ?? Ys), u6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || sr(e.clip, t));
class fr {
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
}, c6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), hr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), d6 = {
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
}, f6 = 120, q2 = 20, h6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < q2), D2 = (e) => bs[e] || bs.idle, m6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, mr = "airborne", P2 = "landing", j2 = "travelling", pr = "grounded", p6 = ({ airborne: e, landing: t, trip: n }) => e ? mr : t ? P2 : n != null && n.started ? j2 : pr;
function v6(e, t) {
  var s;
  const n = F2(e, t);
  return e.mode === pr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function F2(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === mr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...W2(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const g = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : D2(c), facing: g ? p : i.posture === "sit" ? i.face : h };
}
function W2(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ks = (e) => e.outcome, H2 = "plugin:code-commandments:sins:", ol = (e) => e.type === "plugins.card" && e.markKey.startsWith(H2), z2 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => ol(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => ol(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], g6 = (e, t) => e.filter((n) => n.author === "user" && Zn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Zn(n.read_at), card: yi(n) })).sort((n, a) => n.time - a.time), ll = { user: "reacted", agent: "agent_reacted" };
function y6(e, t) {
  return e.filter((n) => ll[n.author] && Ct(n) > t).map((n) => ({ beat: `${ll[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const U2 = [.../* @__PURE__ */ new Set([...Object.values(ir).flatMap((e) => Object.keys(e)), ...Object.keys(rr)])];
function b6(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = U2.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: yi(n) })).sort((n, a) => n.time - a.time);
}
const V2 = (e) => new fr(e).isTest(), aa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ks(e)] || "";
}, G2 = 1800, K2 = (e, t) => {
  if (aa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && aa(n) !== "finished" && Number(e.time) - Number(n.time) <= G2 ? "tests_fixed" : "tests_passed";
};
function k6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(V2), s = a.filter((i) => aa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, aa(i))), o.map((i) => ({ beat: K2(i, s), time: Number(i.time), card: i.key }));
}
function w6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ks(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ks(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const $6 = (e) => e.map((t) => {
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
function x6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function S6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function _6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = z2.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function Qs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const il = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Y2(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Qs(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function M6(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : B2(`held:${e}`) ? "idle" : e;
}
const Be = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function C6(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Be.ahead * n ? 180 : Math.sign(a) * Be.turn;
}
const rl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function E6(e, t) {
  const n = Math.min(Be.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Be.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Be.lines, Math.floor((e.bottom - e.top - 2 * a) / Be.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Be.sweep) % s, i = o % Be.sweep, r = Be.sweep - Be.returnSeconds, c = rl((i - r) / Be.returnSeconds), d = i <= r ? rl(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Be.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const ul = 3, vr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, cl = 12, A6 = (e, t) => ({ mood: e, began: t, seen: 0 });
function O6(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!vr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= ul ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * cl) / cl, lasts: ul } };
}
const T6 = (e) => e.posture === "hang" && !vr(e.face), Q2 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), J2 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function I6(e, t, n) {
  return Q2.has(e) ? 1 / 0 : !J2.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(gr(n - t.began, t.share) - st.lead, 0);
}
const X2 = 5;
function R6(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= X2 ? { beat: "long_walk", time: n } : null };
}
const Z2 = 30, Nn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function B6(e, t, n, a, s = null) {
  if (t && n < t.until || !Nn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, i] = Nn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Nn.every } : { state: e, began: 0, until: 0, next: n + Nn.every };
}
const L6 = (e, t, n) => t && n < t.until && hr.has(e.state) ? { state: t.state, since: t.began } : e, st = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, gr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function N6(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = gr(o, e.share);
  return s ? { eager: e5(t, l), moment: null } : l > st.lead ? { eager: t, moment: null } : l < st.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > st.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < st.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function e5(e, t) {
  return e.on && t > st.lead + st.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= st.lead && t >= st.least ? { ...e, on: !0, calm: !1 } : e;
}
const t5 = 1, n5 = { look: "look", gaze: "gaze" };
function a5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [n5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const s5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), o5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > t5 * t, memory: a, now: s, room: o }, n).name === "backflip", l5 = { work: ["building"], idle: ["standing"] };
function q6(e, t, n, a) {
  const s = bs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(l5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), hr.has(e) ? { moments: o, began: n || a } : (n && a - n >= Z2 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function i5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const dl = { pondering: i5 };
function D6(e, t, n, a, s, o) {
  if (dl[e.beat]) {
    const i = dl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = a5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Ys && { lifetime: l.lifetime } } } : null;
}
function P6(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = s5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const j6 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function F6(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function W6(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const H6 = (e, t) => !!(e != null && e.watches) && !t.once, z6 = 10, U6 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || N2(a, a.queuedAt, n)), V6 = (e, t) => t ? null : e[0] ?? null;
function G6(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const K6 = (e, t) => !t.during || !e.some((n) => n.during === t.during), r5 = 2 * Math.PI, u5 = 500;
function Y6(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / u5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = r5 * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, _ = (c ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !r ? s && !t.behind && !g.behind ? d5(g, t, n, p, s) : h5(g, t, n, p) : t) ?? g, O = _ != null && _.behind && _.mood === "reading" ? c5(e.point, _, n, l, s) : _;
  return { point: O ?? null, toward: O ? { x: O.x - n.x, y: O.y - n.y } : null, amount: h, at: a };
}
function c5(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, l = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, g = h ? e.readingYaw + p : d, b = g + l(c - g), _ = Math.min(Math.max(a / 1e3, 0), 0.1), O = Be.turnSpeed * _, C = h ? g + Math.min(Math.max(b - g, -O), O) : b, j = h ? e.readingFollow + p : C, z = j + (C - j) * (1 - Math.exp(-_ / Be.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, B = o(Qs(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(B, -W.up), W.down), P = Be.tipSpeed * _, L = h ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -P), P) : G;
  return { ...t, readingYaw: C, readingFollow: z, readingPitch: L, readingFacing: i };
}
function d5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (j) => {
    const { yaw: z, pitch: W } = Qs(j.x - n.x, s, n.y - j.y, o);
    return { yaw: z, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [il(i(e)), il(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [p, g] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [b, _, O] = r.map((j, z) => p * j + g * c[z]), C = s * b / _;
  return { ...t, x: n.x + C, y: n.y - Y2(C, s, -Math.asin(Math.min(Math.max(O, -1), 1)), o) };
}
const f5 = 0.15;
function Q6(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= f5;
}
function h5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const m5 = (e) => !(e != null && e.on);
function J6(e, t, n) {
  if (m5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const dn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, tt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ja = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), fl = (e) => e * e * (3 - 2 * e);
function p5(e) {
  if (e < 0 || e >= tt.seconds) return null;
  const t = ja(e, ...tt.flicker), n = Math.floor(t * tt.flickers * 2) % 2 === 0, a = e < tt.flicker[1] ? n ? 0.35 + 0.5 * t : tt.dim : 1;
  return { strength: 1 - fl(ja(e, ...tt.fade)), lit: a, white: e < tt.flash[0] ? 0 : 1 - fl(ja(e, ...tt.flash)) };
}
const X6 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Z6(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = p5(t - e.at);
  return a && { colour: dn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: tt.signs[e.tone], ...a } };
}
function e_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function t_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= dn.looks || a === null && n - e.since >= dn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function n_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const dt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, a_ = { behind: 39, figure: 40, ahead: 41 }, v5 = "[data-figure-pile]", g5 = { amber: [1, 0.69, 0.125], good: dn.colours.good, bad: dn.colours.bad }, zn = { phases: 4, ms: 230, dim: 0.25 }, s_ = (e, t, n) => e !== "amber" || (t + n) % zn.phases < zn.phases / 2 ? 1 : zn.dim, o_ = (e) => e === "amber" ? zn.phases : 1;
function l_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const i_ = Object.keys(g5), Ke = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Jt = ([e, t], n) => e + n() * (t - e);
function r_(e) {
  const t = Ke.least + Math.floor(e() * (Ke.most - Ke.least + 1));
  return Array.from({ length: Math.min(t, Ke.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ke.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Jt(Ke.start, e), l = Jt(Ke.reach, e);
    return {
      text: Ve({ moment: "digit" }, e).name,
      x: a * o,
      y: Ke.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Jt(Ke.moveMs, e)),
      fadeMs: Math.round(Jt(Ke.fadeMs, e))
    };
  });
}
const Fa = { high: 3, gap: 1 };
function u_(e) {
  const t = Math.floor(e / Fa.high);
  return { left: -(dt.inside + dt.width / 2 + t * (dt.width + Fa.gap)), up: e % Fa.high * (dt.height - dt.top) };
}
const y5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, b5 = { after: 5 }, k5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new fr(t).isBuild());
function c_(e, t, n) {
  const a = k5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= b5.after ? s : null;
}
function d_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: y5(n, a, s) } : null;
}
const hl = { ahead: 140, up: 70 };
function f_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * hl.ahead, y: a - hl.up } } : o ? { at: { x: n(o), y: a - o.up - dt.height } } : t ? { at: null } : null;
}
const Wa = { least: 4e3, most: 1e4 }, w5 = (e) => Wa.least + e() * (Wa.most - Wa.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function h_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = w5(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const m_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), p_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), yr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), v_ = new Set(pa.filter((e) => yr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), $5 = (e) => e.some((t) => t.state === "built"), g_ = (e, t) => $5(t) ? e.filter((n) => !yr.has(n.beat)) : e, pt = { reach: 40, room: 6 }, x5 = (e, t) => t <= e - pt.reach + 2, y_ = (e, t, n) => x5(e, n) ? t - pt.reach : e - pt.reach - pt.room, b_ = (e, t, n, a) => a > 0 && t < e && t + pt.reach >= e - 2 ? Math.min(n, Math.max(e, t + pt.reach)) : e, Ha = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, k_ = (e) => Jt(e() < Ha.longShare ? Ha.long : Ha.short, e), S5 = 2 * dt.width;
function w_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= S5 ? o : e + (o - e + s / 2) % s;
}
const _5 = 60, $_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= _5, ml = "[data-figure-home]", wn = () => {
  var t;
  const e = document.querySelector(ml);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ml)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, M5 = "[data-figure-docked-bars]", C5 = "[data-figure-chat-foot]", E5 = [0.85, 0.6, 0.35, 0.15], A5 = ["question", "waiting", "suggestion"], x_ = (e, t) => A5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function S_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const O5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", T5 = "[data-figure-newest]";
function br() {
  var a, s;
  const e = (a = wn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(T5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function fn(e, t, n = br()) {
  if (!e || !n) return !0;
  const a = it(e, t), s = ga(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ie.top * t.size, bottom: a.top + Ie.bottom * t.size }, l = _t.gap;
  return !va(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function __(e, t, n, a = br()) {
  if (!a || fn(t, e, a)) return null;
  const s = ga(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = At(), r = t.posture === "stand" ? Zs * e.size : Cr * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - _t.gap - l, a.right + _t.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= d && fn(p, e, a) && l$(p, e)).sort((p, g) => Math.abs(p.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const za = 0.26, kr = 0.54, I5 = 1.25 / 5.4, $n = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: za, travels: "stand" },
  lounge: { drop: za, travels: "stand" },
  composed: { drop: za, travels: "stand" },
  hang: { drop: kr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, M_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * I5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - kr
}), en = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), R5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), C_ = (e, t) => (e === "sit" ? R5.has(t) : en.has(e)) ? e : "stand";
function E_(e, t) {
  return e.facing === t.facing || !en.has(e.posture) && !en.has(t.posture) ? t : { posture: "stand", facing: en.has(e.posture) ? e.facing : t.facing };
}
const A_ = 0.25, O_ = (e, t) => en.has(e) && $n[t].drop === 0, wr = 2, B5 = 90, L5 = 180, N5 = 140, q5 = 280, D5 = 420, P5 = 0.25, j5 = 290, F5 = 600, W5 = "cubic-bezier(0.2, 0.7, 0.4, 1)", H5 = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ua = 5;
function sa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ua) return null;
  (l || i) && (o = Math.max(o, wr));
  const g = o > 1, b = Math.abs(t.x - e.x), _ = b < Ua ? 0 : b / (B5 * o) * 1e3, O = Math.min(_, g ? N5 : L5), C = Math.abs(t.y - e.y), j = t.y < e.y, z = j && !p && o5(C, n, r, c, d, h), W = j ? D5 + Math.min(C, 400) * P5 : Math.sqrt(2 * C / Ks) * 1e3, B = {
    x: t.x,
    y: t.y,
    ms: C > Ua ? z ? F5 : W : 0,
    lead: z ? j5 : j ? q5 : 0,
    easing: j ? W5 : H5,
    hopping: !0,
    clip: z ? "backflip" : j ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: _ + O, lead: 0, easing: "linear", ramp: O, ...g ? { clip: "run" } : {} }, P = p ? z5(t, n) : B, L = j && !a ? [{ ...G, y: e.y }, P] : [{ ...B, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: L, lands: !s, pace: o, running: g };
}
const z5 = (e, t) => ({ x: e.x, y: e.y, ms: Ae.pogo.frames / Ae.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), U5 = (e, t) => e.postures.includes(t) ? t : e.postures[0], T_ = (e, t, n) => e.posture === "walk" && n ? "walk" : U5(e.clip, t), it = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - $n[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, va = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Js = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = wn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const qn = 0.5, pl = 20;
function I_(e, t, n = At()) {
  const a = it(e, t);
  return a.left >= n.left + pl && a.right <= n.right - pl;
}
function Xs(e, t, n = At()) {
  const a = it(e, t), s = a.right - a.left, o = ga(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - qn && i <= n.right + qn && a.top >= n.top - qn && r <= n.bottom + qn;
}
const oa = [0.35, 0.5, 0.65], la = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ie = { left: oa[0], right: oa.at(-1), top: la[0], bottom: la.at(-1) }, V5 = 0.24;
function ga(e) {
  if (e.posture === "stand") return { left: Ie.left, right: Ie.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + V5 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ie.left, t), right: Math.max(Ie.right, t) };
}
function G5(e, { size: t }, n = At()) {
  const a = ga(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Zs = (Ie.right - Ie.left) / 2 + 0.08;
function R_(e, t) {
  return e === "hang" ? Ie : { ...Ie, bottom: Math.min(Ie.bottom, 1 - t - $n[e].drop) };
}
const K5 = "[data-figure-agent]";
function $r(e, t, n = "", a = "") {
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
const xr = (e) => la.flatMap(
  (t) => oa.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function eo(e, t, n = "") {
  if (!fn(e, t)) return oa.length * la.length;
  const a = it(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(O5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && va(s, r) && Js(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return xr(s).filter(([i, r]) => l(i, r) || $r(i, r, n)).length;
}
function Y5(e, t) {
  const n = it(e, t);
  return xr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => $r(a, s, "", K5)).length;
}
const vl = 4;
function B_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = vl; o <= s; o += vl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!Y5(i, e) && fn(i, e)) return i;
    }
  return null;
}
function hn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Xs(l, t, a) && fn(l, t)).map((l) => ({ spot: l, covered: eo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Sr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Q5 = [0.5, 0.25, 0.75], J5 = (e) => Sr(e.getBoundingClientRect(), Q5), _r = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, X5 = Zs, Z5 = (e, t, { size: n }, a = X5) => Mr(e, _r[t], a * n, "stand");
function Mr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const e$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Cr = 0.1, t$ = (e, t, { size: n }) => Mr(e, e$[t], Cr * n, "sit"), n$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Va = 60;
function L_(e, t) {
  const n = n$(t);
  return !e.aside || Math.abs(n) >= Va ? t : n < 0 ? 360 - Va : Va;
}
const tn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, a$ = (e) => [.../* @__PURE__ */ new Set([e, ...tn.turns.map((t) => (t + 360) % 360)])];
function N_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = a$(t), l = tn.every[0] + a() * (tn.every[1] - tn.every[0]);
  return { face: t, from: s ? s$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function s$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / tn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function q_(e, t) {
  const { element: n, edge: a } = ya(), s = ["left", "right"].map((i) => xn(t$(a, i, e), e)).filter((i) => n && Xs(i, e) && !eo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function D_(e, t, { size: n }) {
  const a = (Ie.right - Ie.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Er } : e;
}
const Er = 7;
function Ar() {
  const e = [...document.querySelectorAll(v5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function o$(e, t) {
  const n = it(e, t), a = n.right - n.left;
  return { left: n.left + Ie.left * a, right: n.left + Ie.right * a, top: n.top + Ie.top * a, bottom: n.bottom };
}
function l$(e, t) {
  const n = Ar();
  return !n || !va(o$(e, t), n);
}
const i$ = 4;
function ya() {
  const e = Sn(), t = Ar(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > i$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Er - n, 0) } };
}
const P_ = ({ size: e, below: t }) => (1 - t) * e;
function xn(e, t) {
  const n = At(), { size: a, below: s } = t, o = $n[e.posture].drop * a;
  return { ...G5(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ws = (e, t) => Object.keys(_r).map((n) => xn(Z5(e, n, t), t)), to = (e, t) => Sr(e, E5).map((n) => xn(n, t)), Or = (e, t, n) => hn(e, t, n) ?? e[0];
function j_(e, t) {
  const { element: n, edge: a } = ya();
  return { ...Or(ws(a, e), e, t), view: null, on: n };
}
function F_(e, t, n, a) {
  const { element: s, edge: o } = ya(), l = (a ? ws(o, t) : [...ws(o, t), ...to(o, t)]).filter(
    (c) => !va(it(c, t), e)
  ), i = hn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), r = i && !eo(i, t) ? i : hn(l, t, n);
  return r && { ...r, view: null, on: s };
}
function Sn() {
  var a;
  const e = wn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(M5);
  if (!t) return { ...ba(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const gl = { within: 2 };
function W_(e) {
  const { element: t, docked: n, edge: a } = Sn();
  if (!n || e.on !== t) return !0;
  const s = ba().edge;
  return a.left > s.left + gl.within || a.left + a.width < s.left + s.width - gl.within;
}
const r$ = "[data-figure-closing]";
function H_() {
  var n;
  const { element: e, docked: t } = Sn();
  return t && !!((n = e.firstElementChild) != null && n.matches(r$));
}
const Tr = "[data-figure-progress]";
function z_(e) {
  const t = e.querySelector(Tr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function U_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const u$ = { across: 300, above: 380, below: 60 };
function V_(e) {
  const { across: t, above: n, below: a } = u$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: c$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const c$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Ir = "[data-figure-bar]", $s = { back: 144, along: 0.4 };
function G_(e) {
  const { element: t, docked: n, edge: a } = Sn(), s = n ? t.querySelector(Ir) : null;
  if (!(s != null && s.querySelector(Tr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...xn({ x: o - $s.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function K_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < $s.along * a.size ? t.x + $s.along * a.size : e.x, y: e.y, behind: !0 };
}
function Y_(e) {
  const t = e.querySelector(Ir), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ba() {
  const e = wn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function Q_(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = ba(), r = n === null ? d$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : xn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function d$(e, t, n, a, s) {
  const o = to(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + dt.width < s && r.x + a - pt.reach - pt.room >= l);
  return hn(i.length ? i : o, t, n);
}
const f$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function J_(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, wr));
  const g = (z) => {
    const W = it(z, n, $n[z.posture].travels);
    return { x: W.left, y: W.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return h$(g(e), g(t), g({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [_, ...O] = [e, ...r, t].map(g), C = sa(_, O[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: p }), j = O.slice(1).map((z, W) => {
    var B;
    return (B = sa(O[W], z, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : B.legs.find((G) => G.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...j.filter(Boolean)] };
}
function h$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / f$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? sa(e, n, o.size, { pace: l }) : sa(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function X_(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function Z_(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && hn(J5(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ya();
  return { ...Or(to(s, t), t, n), view: null, on: a };
}
const m$ = "[data-figure-bubble]", p$ = 250;
let nn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Rr = 0;
const Gt = () => nn, Ga = /* @__PURE__ */ new WeakMap();
let v$ = 0;
function no(e) {
  return Ga.has(e) || Ga.set(e, `floor-${++v$}`), Ga.get(e);
}
const g$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, y$ = () => {
  var e, t;
  return ((t = (e = wn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function b$(e, t) {
  var a;
  const n = (a = e.querySelector(C5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function k$(e, t) {
  const n = e && b$(e, t), a = e ? [...e.querySelectorAll(m$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || g$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: no(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const w$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= p$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Br(e = nn, t = performance.now()) {
  const n = At(), a = y$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Sn(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = ba();
  return c.element && r.push({ id: no(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...k$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: w$(e, d, t) }))) });
}
const xs = /* @__PURE__ */ new Set();
function $$(e) {
  return xs.add(e), () => xs.delete(e);
}
function x$() {
  Lr();
  const e = () => {
    Rr = requestAnimationFrame(e), !document.hidden && (nn = Br(nn), xs.forEach((t) => t(nn)));
  };
  e();
}
function Lr() {
  cancelAnimationFrame(Rr);
}
const ao = 5, S$ = 56, _$ = { share: 0.6 }, M$ = (e) => -Math.sqrt(2 * Ks * _$.share * e), Wt = (e, t) => e.find((n) => n.id === t) ?? null;
function eM(e, t = Br().floors) {
  const n = Wt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : no(e.on) : null, o = s && Wt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Nr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Gt().floors) {
  const c = Wt(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || C$(c, d, o)) && E$(d, i, r) ? { x: d.x, y: d.y } : null;
}
const so = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, C$ = (e, t, n) => !so({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function tM(e, t = Gt().floors) {
  if (!so(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= ao && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function E$(e, t, n = Gt().floors) {
  const a = Wt(n, "home");
  return e.posture === "hang" && a && it(e, t).bottom >= a.top ? !1 : Xs(e, t);
}
function nM(e, t, n, a = Gt().floors) {
  const s = Nr(e, n, a);
  if (!e.home) return A$(e, t, s, a);
  if (!s) return null;
  const o = Wt(a, "home"), l = s.y - t.y, i = l > ao ? "dropping" : -l > S$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function A$(e, t, n, a) {
  const s = n ? Wt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: M$(e.risen) };
  if (!n) return null;
  if (so(t) && n.y - t.y > ao) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function aM(e, t, n) {
  const a = Zs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function sM(e, t, n, a = Gt().floors) {
  const s = t && Nr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const O$ = ["data-type"], T$ = { class: "figure-floor-name" }, I$ = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", T$, y(e.floor.type), 1)
    ], 12, O$));
  }
}, R$ = /* @__PURE__ */ U(I$, [["__scopeId", "data-v-4e0f1e2e"]]), B$ = {
  class: "figure-floors",
  "aria-hidden": "true"
}, L$ = {
  __name: "FigureFloors",
  setup(e) {
    const t = Qe(Gt().floors);
    let n = () => {
    };
    return Se(() => {
      n = $$((a) => t.value = a.floors), x$();
    }), Re(() => {
      n(), Lr();
    }), (a, s) => (u(), f("div", B$, [
      (u(!0), f(D, null, ae(t.value, (o) => (u(), H(R$, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, oM = /* @__PURE__ */ U(L$, [["__scopeId", "data-v-e519168b"]]), Ka = (e) => typeof e == "number" ? e : Date.parse(e);
function lM(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ka(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ka(s.row.created_at) - Ka(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const N$ = 3, Ya = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function q$(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ya[n.grouping]) == null ? void 0 : a.call(Ya, e.row, n)) || "";
}
function D$(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function iM(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= N$ ? [D$(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = q$(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function rM(e) {
  const t = ze(), n = t.option("row"), a = S(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), ge(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function P$(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const uM = (e) => (t) => t.filter((n) => n.id !== e), cM = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), dM = (e) => (t) => [...t, e], fM = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function hM(e, t = {}) {
  const n = ze(), a = S(null), s = S("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function mM(e) {
  const t = ze(), n = S("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Dn = /* @__PURE__ */ new Map();
function j$(e, t) {
  if (Dn.has(e)) return Dn.get(e);
  const n = t().finally(() => Dn.delete(e));
  return Dn.set(e, n), n;
}
function pM() {
  const e = ze(), t = S(null), n = S("");
  async function a() {
    const s = await j$(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const F$ = { class: "cards-page" }, W$ = { class: "cards-bar" }, H$ = { class: "cards-count" }, z$ = { class: "cards" }, U$ = {
  key: 1,
  class: "cards-note"
}, V$ = {
  key: 2,
  class: "cards-note"
}, G$ = ["data-row", "onClick"], K$ = { class: "card-head" }, Y$ = { class: "card-title" }, Q$ = { class: "card-foot" }, J$ = {
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
    return (a, s) => (u(), f("div", F$, [
      m("div", W$, [
        m("span", H$, y(e.rows.length) + " " + y(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        E(pe, qe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: F(() => [
            E(ve, {
              name: "plus",
              size: 12
            }),
            ne(" New " + y(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", z$, [
        e.loaded ? e.failure ? (u(), f("p", U$, y(e.failure), 1)) : e.rows.length ? k("", !0) : (u(), f("p", V$, "No " + y(e.noun) + "s yet", 1)) : (u(), H(Ge, {
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
          m("span", K$, [
            E(ve, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ne(" " + y(e.head(o)), 1),
            E(Xe, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", Y$, y(e.title(o)), 1),
          m("span", Q$, y(e.foot(o)), 1)
        ], 8, G$))), 128))
      ]),
      me(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, vM = /* @__PURE__ */ U(J$, [["__scopeId", "data-v-990e6b37"]]), yl = "newest";
function gM(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Ce(De, null)) == null ? void 0 : c.search, s = S(""), o = S(yl), l = S("all"), i = M(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((p) => P$(p, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === yl ? h : [...h].sort((p, g) => t(p).localeCompare(t(g)));
  }), r = M(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
}
const X$ = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Z$ = 40, e4 = "top", t4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var h;
    const n = e, a = (h = Ce(De, null)) == null ? void 0 : h.autoScroll, s = M(() => a === e4), o = S(null), l = S(!1), i = (p) => s.value ? p.scrollTop : p.scrollHeight - p.scrollTop - p.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      l.value = i(o.value) >= Z$;
    }
    return ge(() => n.rowCount, async () => {
      await He(), !l.value && o.value && (o.value.scrollTop = r());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (p, g) => (u(), f("div", X$, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        me(p.$slots, "default", {}, void 0, !0)
      ], 34),
      E(zt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: F(() => [
          Je(m("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: c
          }, [
            E(ve, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            g[0] || (g[0] = ne(" Newest ", -1))
          ], 512), [
            [Al, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, yM = /* @__PURE__ */ U(t4, [["__scopeId", "data-v-3accb764"]]), n4 = ["aria-selected", "data-tab", "onClick"], a4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, s4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ce(De, null), o = M(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = S(null), i = S({ left: 0, width: 0, slides: !1 }), r = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const g = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!g) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: g.offsetLeft, width: g.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const d = () => He(() => c(!0));
    let h = null;
    return Se(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Re(() => h == null ? void 0 : h.disconnect()), ge(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, d), ge(() => n.answer, d, { deep: !0 }), (p, g) => (u(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), f(D, null, ae(o.value, (b) => {
        var _, O;
        return u(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((_ = e.active) == null ? void 0 : _.key) === b.key }]),
          "aria-selected": ((O = e.active) == null ? void 0 : O.key) === b.key,
          "data-tab": b.key,
          onClick: (C) => a("choose", b)
        }, [
          ne(y(b.label) + " ", 1),
          r(b) ? (u(), f("span", a4, y(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, n4);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ye({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, bM = /* @__PURE__ */ U(s4, [["__scopeId", "data-v-63fcd326"]]), o4 = {
  class: "tab-body",
  "data-tab-body": ""
}, l4 = { "data-tab-content": "" }, i4 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = S(!1);
    let a = 0;
    return ge(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Cs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), f("div", o4, [
      n.value ? (u(), H(Ge, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      Je(m("div", l4, [
        me(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Al, !n.value]
      ])
    ]));
  }
}, kM = /* @__PURE__ */ U(i4, [["__scopeId", "data-v-63876533"]]), r4 = {}, u4 = { class: "menu-label" };
function c4(e, t) {
  return u(), f("span", u4, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const bl = /* @__PURE__ */ U(r4, [["render", c4], ["__scopeId", "data-v-aa955b3e"]]), d4 = {
  class: "search-bar",
  "data-search-bar": ""
}, f4 = { class: "search-bar-control" }, h4 = ["value", "placeholder", "aria-label"], m4 = ["aria-expanded"], p4 = {
  key: 0,
  "data-menu-count": ""
}, v4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const a = e, s = n, o = Jr(), l = ((C = Ce(De, null)) == null ? void 0 : C.search) ?? {}, i = M(() => l.placeholder || a.placeholder), r = l.context ?? [], c = S(null), d = S(null), h = S([]), p = M(() => h.value.length ? h.value[h.value.length - 1].next : r), g = M(() => !!o.menu || r.length > 0), b = (j) => {
      h.value = [], d.value = d.value ? null : j.currentTarget;
    };
    function _(j) {
      if (j.next.length) {
        h.value = [...h.value, j];
        return;
      }
      d.value = null, s("pick", j.click);
    }
    function O() {
      var j;
      s("update:modelValue", ""), (j = c.value) == null || j.focus();
    }
    return t({ focus: () => {
      var j;
      return (j = c.value) == null ? void 0 : j.focus();
    } }), (j, z) => {
      var W;
      return u(), f("div", d4, [
        m("div", f4, [
          E(ve, {
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
            onInput: z[0] || (z[0] = (B) => s("update:modelValue", B.target.value)),
            onKeydown: Mt(O, ["esc"])
          }, null, 40, h4),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: O
          }, [
            E(ve, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          g.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: b
          }, [
            e.menuCount ? (u(), f("span", p4, y(e.menuCount), 1)) : k("", !0),
            E(ve, {
              name: "caret",
              size: 12
            })
          ], 8, m4)) : k("", !0)
        ]),
        (W = I(l).button) != null && W.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: z[1] || (z[1] = (B) => s("pick", I(l).button.click))
        }, y(I(l).button.title), 1)) : k("", !0),
        me(j.$slots, "default", {}, void 0, !0),
        d.value ? (u(), H(Is, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: z[3] || (z[3] = $e(() => {
          }, ["stop"])),
          onClose: z[4] || (z[4] = (B) => d.value = null)
        }, {
          default: F(() => [
            h.value.length ? (u(), H(jt, {
              key: 0,
              "data-search-back": "",
              onClick: z[2] || (z[2] = (B) => h.value = h.value.slice(0, -1))
            }, {
              default: F(() => [
                ne("‹ " + y(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (u(!0), f(D, null, ae(p.value, (B) => (u(), H(jt, {
              key: B.title,
              description: B.subtext,
              "data-search-entry": B.title,
              onClick: (G) => _(B)
            }, {
              default: F(() => [
                ne(y(B.title) + y(B.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? k("", !0) : me(j.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, g4 = /* @__PURE__ */ U(v4, [["__scopeId", "data-v-45374bed"]]), y4 = {
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
    return (o, l) => (u(), H(g4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: F(() => [
        E(bl, null, {
          default: F(() => [...l[2] || (l[2] = [
            ne("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(D, null, ae(a, (i) => E(jt, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (r) => e.tools.order.value = i.key
        }, {
          default: F(() => [
            ne(y(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(D, { key: 0 }, [
          E(bl, null, {
            default: F(() => [...l[3] || (l[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(D, null, ae(s, (i) => E(jt, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (r) => e.tools.state.value = i.key
          }, {
            default: F(() => [
              ne(y(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: F(() => [
        me(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, wM = /* @__PURE__ */ U(y4, [["__scopeId", "data-v-dab0064d"]]);
function $M() {
  const e = S(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const xM = (e) => import(
  /* @vite-ignore */
  e
), b4 = 86400, Ss = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function k4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ss(t) - Ss(e)) / b4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function SM(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ss(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: k4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Qa = 280, Ja = 240, Xa = 120, w4 = 6, $4 = 14, mn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function x4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function qr(e, t) {
  const n = Math.max(0, x4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function S4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${$4}px)` }), e.offsetHeight, e.style.transition = `height ${Qa}ms ${mn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = qr(t, e));
    const p = s() - i;
    if (!r && p >= Qa && (r = !0, e.style.transition = `opacity ${Ja}ms ease-out, transform ${Ja}ms ${mn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Qa + Ja) return a(h);
    d();
  };
  return a(h), d;
}
function _M(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${w4}px)` }), e.offsetHeight, e.style.transition = `opacity ${Xa}ms ease-out, transform ${Xa}ms ${mn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = qr(t, e)), s() - l < Xa) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const _4 = 140, Pn = 220, kl = 5;
function MM({ gap: e = _4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function r() {
    const d = n.splice(0, kl);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(r, e));
      });
  }
  const c = (d, h, p, g = S4) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: d, options: h, done: p, arrival: g, display: d.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(r, e));
    d.style.display = "none", n.push(b), n.length >= kl && c.flush();
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
function CM(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Pn}ms ${mn}, opacity ${Pn}ms ease-in, margin ${Pn}ms ${mn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Pn);
}
const Dr = "chat.pins.minimised", Un = S(Yn(Dr, !1));
function wl(e) {
  Un.value = e, Ps(Dr, e);
}
function M4(e) {
  const t = M(() => e()), n = M(() => Un.value ? [] : e()), a = () => wl(!Un.value), s = Date.now() / 1e3;
  return ge(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && wl(!1)
  ), { pins: t, visible: n, minimised: Un, toggle: a };
}
const C4 = ["title"], E4 = {
  key: 0,
  class: "pins-count"
}, A4 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = M4(() => t.pinRows);
    return (o, l) => I(n).length ? (u(), f("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: I(a), inline: e.inline }]),
      title: I(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...i) => I(s) && I(s)(...i), ["stop"]))
    }, [
      E(ve, {
        name: I(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      I(a) ? (u(), f("span", E4, y(I(n).length), 1)) : k("", !0)
    ], 10, C4)) : k("", !0);
  }
}, EM = /* @__PURE__ */ U(A4, [["__scopeId", "data-v-d073c504"]]), O4 = ["title"], T4 = ["title"], I4 = { class: "diff-card-dir" }, R4 = { class: "diff-card-name" }, B4 = ["title"], L4 = ["title"], N4 = {
  key: 0,
  class: "diff-card-note"
}, q4 = ["href"], D4 = ["src", "alt"], P4 = { class: "diff-card-rows" }, j4 = { class: "diff-row-num" }, F4 = { class: "diff-row-sign" }, W4 = { class: "diff-row-code" }, H4 = {
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
    function o($) {
      ($.metaKey || $.ctrlKey) && ($.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = M(() => n.path.lastIndexOf("/") + 1), c = M(() => n.path.slice(0, r.value)), d = M(() => n.path.slice(r.value)), h = M(() => n.change === "deleted"), p = M(() => l[n.change]), g = M(() => new Set(n.rows.filter(($) => $.line_type === "add").map(($) => $.line))), b = S("after"), _ = M(() => b.value === "before" ? n.whole.old : n.whole.text), O = M(() => n.whole && n.whole.text !== void 0 ? _.value.split(`
`).map(($, w) => ({ line_type: b.value === "after" && g.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: $ })) : n.rows.filter(
      ($) => !(n.editsOnly && ["ctx", "fold"].includes($.line_type)) && !(n.hideRemovals && $.line_type === "del")
    )), C = S(!1), j = M(() => n.lines && !C.value && !n.whole), z = M(() => j.value ? O.value.slice(0, n.lines) : O.value), W = M(() => O.value.length - z.value.length), B = ($) => $.line === null || $.line_type === "del" ? "" : $.line, G = ($) => $.line_type === "fold" ? $.hidden ? `⋯ ${$.hidden} lines` : "⋯" : $.text, P = S(null), L = S(null);
    let x = null;
    return Se(() => {
      if (!L.value) return;
      let $ = !0;
      x = new ResizeObserver(() => {
        !P.value || !L.value || (P.value.style.transition = $ ? "none" : "", P.value.style.height = `${L.value.offsetHeight}px`, $ = !1);
      }), x.observe(L.value);
    }), Re(() => x && x.disconnect()), ($, w) => (u(), f("section", {
      class: Y(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (v) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${I(s)}-click to open it`,
          onClick: o
        }, [
          m("span", I4, y(c.value), 1),
          m("span", R4, y(d.value), 1),
          p.value ? (u(), f("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, y(p.value), 3)) : k("", !0)
        ], 8, T4),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + y(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + y(e.removed), 3),
        E(Xe, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = $e((v) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, y(b.value === "after" ? "After" : "Before"), 9, B4)) : k("", !0),
        h.value ? k("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = $e((v) => a("whole"), ["stop"]))
        }, [
          E(ve, {
            name: "file",
            size: 12
          })
        ], 10, L4))
      ], 8, O4),
      e.whole && e.whole.error ? (u(), f("p", N4, y(e.whole.error), 1)) : k("", !0),
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
          }, null, 8, D4)
        ], 8, q4)) : (u(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: P,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: L,
            class: "diff-card-diff"
          }, [
            m("div", P4, [
              (u(!0), f(D, null, ae(z.value, (v, T) => (u(), f("div", {
                key: T,
                class: Y(["diff-row", v.line_type, { fresh: e.fresh && v.edit === e.fresh }])
              }, [
                m("span", j4, y(B(v)), 1),
                m("span", F4, y(i[v.line_type]), 1),
                m("span", W4, y(G(v)), 1)
              ], 2))), 128)),
              W.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = $e((v) => C.value = !0, ["stop"]))
              }, y(W.value) + " more " + y(W.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, AM = /* @__PURE__ */ U(H4, [["__scopeId", "data-v-23581cbb"]]), z4 = { "data-queue-controls": "" }, U4 = { class: "counts" }, V4 = { "data-queue-spots": "" }, G4 = {
  class: "spots",
  "aria-label": "Places in use"
}, K4 = { "data-queue-waiting": "" }, Y4 = { key: 0 }, Q4 = { class: "control" }, J4 = { class: "stepper" }, X4 = ["disabled"], Z4 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, ex = ["disabled"], tx = ["for"], nx = ["id", "value", "disabled", "onChange"], ax = { class: "control" }, sx = ["aria-checked", "disabled"], ox = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, lx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, ix = {
  key: 2,
  class: "note failure",
  role: "alert"
}, rx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(!1), o = S("");
    async function l(i, r) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(r)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, r) => (u(), f("div", z4, [
      E(Ft, { icon: "gauge" }, {
        default: F(() => [...r[3] || (r[3] = [
          ne("Now", -1)
        ])]),
        _: 1
      }),
      m("div", U4, [
        m("div", null, [
          m("strong", V4, [
            ne(y(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + y(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + y(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", G4, [
            (u(!0), f(D, null, ae(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", K4, y(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", Y4, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", Q4, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", J4, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, X4),
          m("output", Z4, y(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, ex)
        ])
      ]),
      (u(!0), f(D, null, ae(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, y(c.title), 9, tx),
          m("p", null, y(c.description), 1)
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
        }, null, 40, nx)
      ]))), 128)),
      m("div", ax, [
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
        ])], 8, sx)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", ox, [
        E(ve, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = ne("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", lx, [
        E(ve, {
          name: "pause",
          size: 13
        }),
        ne("The queue is paused. No waiting command gets a place until it is resumed. " + y(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (u(), f("p", ix, y(o.value), 1)) : k("", !0)
    ]));
  }
}, ux = /* @__PURE__ */ U(rx, [["__scopeId", "data-v-b594afa3"]]), cx = ["data-queue-row", "data-queue-process"], dx = ["aria-expanded"], fx = { class: "run-line" }, hx = { class: "leading" }, mx = {
  key: 0,
  "data-queue-position": ""
}, px = ["title"], vx = { class: "command" }, gx = {
  class: "time",
  "data-queue-time": ""
}, yx = { class: "details" }, bx = { "data-queue-type": "" }, kx = { class: "failed" }, wx = { class: "drop-inner" }, $x = { class: "output" }, xx = { class: "output-heading" }, Sx = ["href"], _x = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(), o = Ki((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = Gs(), r = M(() => ({ test: "Test run", build: "Build", check: "Check", install: "Install" })[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = M(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const g = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((g - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function d() {
      if (!n.expanded) return;
      const p = s.value, g = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await He(), n.expanded && g && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await He(), n.expanded && (s.value.scrollTop = s.value.scrollHeight));
    }
    return ge(() => n.expanded, h, { immediate: !0 }), bn(["output.*"], d), (p, g) => (u(), f("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      m("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: g[2] || (g[2] = (b) => a("toggle")),
        onKeydown: [
          g[3] || (g[3] = Mt($e((b) => a("toggle"), ["prevent"]), ["enter"])),
          g[4] || (g[4] = Mt($e((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", fx, [
          m("span", hx, [
            e.run.section === "waiting" ? (u(), f("span", mx, y(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, px))
          ]),
          m("code", vx, y(e.run.line), 1),
          m("span", gx, y(c.value), 1),
          E(ve, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", yx, [
          m("span", bx, y(r.value), 1),
          e.run.owner_agent_id ? (u(), f(D, { key: 0 }, [
            g[6] || (g[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: g[0] || (g[0] = $e((b) => I(vt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + y(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), f(D, { key: 1 }, [
            g[7] || (g[7] = m("span", { class: "separator" }, "·", -1)),
            g[8] || (g[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (u(), f(D, { key: 2 }, [
            g[9] || (g[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: g[1] || (g[1] = $e((b) => I(vt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + y(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (u(), f(D, { key: 3 }, [
            g[10] || (g[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", kx, "Failed, exit " + y(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, dx),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", wx, [
          m("div", $x, [
            m("div", xx, [
              m("span", null, "Output " + y(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Sx)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: g[5] || (g[5] = (b) => e.expanded && I(o).loadEarlier(b.target))
            }, [
              g[11] || (g[11] = m("span", { class: "prompt" }, "$ ", -1)),
              ne(y(e.run.line), 1),
              I(l).length ? (u(), f(D, { key: 0 }, [
                ne(y(`
` + I(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, cx));
  }
}, Mx = /* @__PURE__ */ U(_x, [["__scopeId", "data-v-3e2f7508"]]), Cx = {
  class: "process-queue",
  "data-test-queue": ""
}, Ex = { class: "scroll" }, Ax = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Ox = ["data-queue-empty"], Za = 20, Tx = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = S(null), a = S(""), s = S([]), o = S(Za), l = M(() => {
      var p, g;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((g = n.value) == null ? void 0 : g.recent.length) ?? 0);
    });
    let i = 0;
    const r = M(() => n.value ? [
      { type: "running", heading: "Running", icon: "start", rows: n.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: n.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: n.value.recent, empty: "Nothing has run yet." }
    ].flatMap((g) => [
      { key: `band:${g.type}`, section: g },
      ...g.rows.length ? g.rows.map((b, _) => ({ key: `run:${b.id}`, run: b, position: _ + 1 })) : [{ key: `none:${g.type}`, section: g, empty: !0 }]
    ]) : []);
    function c(p) {
      s.value = s.value.includes(p) ? s.value.filter((g) => g !== p) : [...s.value, p];
    }
    async function d() {
      const p = ++i, g = await t.read(o.value === Za ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === i && (a.value = g.ok ? "" : g.error, g.ok && (n.value = g.value));
    }
    function h() {
      o.value += Za, d();
    }
    return bn(["process.*", "setting.*"], d), Se(d), (p, g) => (u(), f("article", Cx, [
      g[0] || (g[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", Ex, [
        a.value ? (u(), f("p", Ax, y(a.value), 1)) : k("", !0),
        n.value ? (u(), f(D, { key: 1 }, [
          E(ux, {
            queue: n.value,
            read: e.read,
            onSaved: d
          }, null, 8, ["queue", "read"]),
          E(Ms, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: F(() => [
              (u(!0), f(D, null, ae(r.value, (b) => (u(), f(D, {
                key: b.key
              }, [
                b.run ? (u(), H(Mx, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (_) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (u(), f("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, y(b.section.empty), 9, Ox)) : (u(), H(Ft, {
                  key: 2,
                  icon: b.section.icon,
                  count: b.section.rows.length,
                  "data-queue-heading": b.section.type
                }, {
                  default: F(() => [
                    ne(y(b.section.heading), 1)
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
        ], 64)) : a.value ? k("", !0) : (u(), H(Ge, { key: 2 }))
      ])
    ]));
  }
}, OM = /* @__PURE__ */ U(Tx, [["__scopeId", "data-v-d9b6ef6b"]]), Ix = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, Rx = ["aria-expanded"], Bx = {
  class: "links-count",
  "data-inspector-links-count": ""
}, Lx = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, Nx = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, qx = {
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
    const t = e, n = S(t.open), a = S(0), s = S(0), o = S("");
    let l = 0;
    async function i() {
      const r = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], d = await t.read(c);
      r === l && (o.value = d.ok ? "" : d.error, d.ok && (a.value = d.value.total), s.value += 1);
    }
    return ge(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), bn(["link.*", "phase.*", "phase_task.*"], i), (r, c) => (u(), f(D, null, [
      a.value ? (u(), f("section", Ix, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", Bx, y(a.value), 1),
          E(mt, { open: n.value }, null, 8, ["open"])
        ], 8, Rx),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", Lx, [
            E(Vc, {
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
      o.value ? (u(), f("p", Nx, y(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Dx = /* @__PURE__ */ U(qx, [["__scopeId", "data-v-479ab50f"]]), Px = ["placeholder"], jx = { class: "actions" }, Fx = { class: "error" }, Wx = {
  key: 1,
  class: "card closed"
}, Hx = { class: "mark" }, zx = { class: "prompt" }, Ux = {
  key: 0,
  class: "draft"
}, Vx = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Dt({
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
  emits: /* @__PURE__ */ Dt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = an(e, "draft"), l = an(e, "error"), i = S(!!l.value), r = S(!1), c = S(!1), d = S(null);
    async function h() {
      var b, _;
      i.value = !0, r.value = !1, await He(), (_ = ((b = d.value) == null ? void 0 : b.querySelector("input")) || d.value) == null || _.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function g() {
      const b = o.value.trim();
      if (!(!b || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(b), i.value = !1, r.value = !0;
        } catch (_) {
          o.value = b, l.value = _.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, _) => (u(), f("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(g, ["prevent"]),
        onKeydown: Mt(p, ["esc"])
      }, [
        me(b.$slots, "who", {}, void 0, !0),
        Je(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": _[0] || (_[0] = (O) => o.value = O),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: _[1] || (_[1] = Mt((O) => I(Ii)(O, g), ["enter"]))
        }, null, 40, Px), [
          [Gn, o.value]
        ]),
        m("div", jx, [
          m("span", Fx, y(l.value), 1),
          E(pe, {
            small: "",
            onClick: p
          }, {
            default: F(() => [..._[3] || (_[3] = [
              ne("Cancel", -1)
            ])]),
            _: 1
          }),
          E(pe, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: F(() => [..._[4] || (_[4] = [
              ne("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", Wx, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", Hx, [
            E(ve, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", zx, y(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", Ux, "Draft kept")) : k("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: _[2] || (_[2] = (O) => s("show"))
        }, [
          m("span", null, y(I(Kc)(e.count, "comment")), 1),
          E(ve, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, Gx = /* @__PURE__ */ U(Vx, [["__scopeId", "data-v-b68baddd"]]), Kx = { wide: 1130 }, Yx = /\{([A-Za-z_]\w*)\}/g;
function Vn(e, t, n = {}) {
  return e.replace(Yx, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const Qx = (e, t, n, a) => Vn(e.label, n, { row_id: a, id: a }) || hw(t, n, a), Jx = { class: "comment-side-head" }, Xx = {
  key: 0,
  class: "comment-none"
}, Zx = { key: 0 }, e8 = {
  key: 1,
  class: "comment-none"
}, t8 = {
  class: "comment",
  "data-comment": ""
}, n8 = {
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
      m("header", Jx, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        E(da, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", Xx, "No comments yet")) : k("", !0),
      (u(!0), f(D, null, ae(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", Zx, y(a.quote), 1)) : k("", !0),
        a.revision ? (u(), f("span", e8, "Revision " + y(a.revision), 1)) : k("", !0),
        m("p", t8, y(e.words(a)), 1)
      ]))), 128)),
      E(pn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, $l = /* @__PURE__ */ U(n8, [["__scopeId", "data-v-276284a3"]]), a8 = { class: "resource-heading" }, s8 = { class: "resource-type" }, o8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, l8 = {
  key: 1,
  class: "resource-abstract"
}, i8 = {
  __name: "ResourceHeading",
  props: { label: String, title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", a8, [
      m("p", s8, y(e.label), 1),
      e.title ? (u(), f("h2", o8, y(e.title), 1)) : k("", !0),
      e.abstract ? (u(), f("p", l8, y(e.abstract), 1)) : k("", !0)
    ]));
  }
}, r8 = /* @__PURE__ */ U(i8, [["__scopeId", "data-v-e70bb004"]]), u8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, c8 = { class: "inspector-icons" }, d8 = { class: "inspector-icons-start" }, f8 = { class: "inspector-icons-end" }, h8 = ["href"], m8 = {
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
    const n = e, a = t, s = M(() => `${n.opened.table}:${n.opened.id}`), o = M(() => n.shareable && !n.readOnly), l = M(() => n.backed ? "Close all rows" : "Close");
    return (i, r) => (u(), f("header", u8, [
      m("div", c8, [
        m("span", d8, [
          e.backed ? (u(), H(pe, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: r[0] || (r[0] = (c) => a("back"))
          }, {
            default: F(() => [
              E(ve, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (u(), f(D, { key: 1 }, [
            E(pe, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: r[1] || (r[1] = (c) => a("step", -1))
            }, {
              default: F(() => [
                E(ve, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            E(pe, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: r[2] || (r[2] = (c) => a("step", 1))
            }, {
              default: F(() => [
                E(ve, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        m("span", f8, [
          e.embedded ? (u(), H(pe, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: r[3] || (r[3] = (c) => I(Ne)(s.value))
          }, {
            default: F(() => [
              E(ve, {
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
            href: I(If)(s.value)
          }, [
            E(ve, {
              name: "share",
              size: 13
            })
          ], 8, h8)) : k("", !0),
          e.embedded ? k("", !0) : (u(), H(pe, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: r[4] || (r[4] = (c) => a("close"))
          }, {
            default: F(() => [
              E(ve, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      E(r8, {
        label: e.label,
        title: e.title,
        abstract: e.description
      }, null, 8, ["label", "title", "abstract"])
    ]));
  }
}, p8 = /* @__PURE__ */ U(m8, [["__scopeId", "data-v-51401f06"]]), v8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, g8 = { class: "field-name" }, y8 = {
  key: 1,
  class: "field-value"
}, b8 = ["onClick"], k8 = {
  key: 2,
  class: "field-value"
}, w8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", v8, [
      (u(!0), f(D, null, ae(e.fields, (o) => (u(), f(D, {
        key: o.name
      }, [
        m("p", g8, y(o.label), 1),
        o.isTime ? (u(), H(Xe, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", y8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, y(o.value), 9, b8)
        ])) : (u(), f("p", k8, y(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, $8 = /* @__PURE__ */ U(w8, [["__scopeId", "data-v-7e45afb5"]]);
async function x8(e, t) {
  const n = await e(["agent", "show", String(t.agent_id)]);
  return n.ok ? pw(t, n.value) : "";
}
async function S8(e, t) {
  const n = await e(["actor", "show", String(t)]), a = n.ok && n.value.type === "agent" ? await e(["agent", "show", String(t)]) : { ok: !1 };
  return n.ok ? mw(n.value, a.ok ? a.value : null) : "";
}
const _8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, M8 = {
  key: 1,
  class: "inspector-wait"
}, C8 = { class: "inspector-main" }, E8 = { class: "inspector-column" }, A8 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, O8 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, T8 = { class: "inspector-text" }, I8 = ["innerHTML"], R8 = {
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
    const n = e, a = t, s = /* @__PURE__ */ new Set(["question", "memory", "rule"]), o = M(() => n.catalogue.inspector(n.noun) ?? {
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
    }), l = S(null), i = S(""), r = S(""), c = S(""), d = S("details"), h = S(null), p = S(0);
    let g = 0;
    const b = M(() => ({ row_id: n.id, id: n.id })), _ = M(() => l.value ? Vn(o.value.title, l.value, b.value) || fw(n.noun, l.value, n.id) : ""), O = M(() => l.value ? Qx(o.value, n.noun, l.value, n.id) : ""), C = M(() => O.value === _.value ? "" : O.value), j = M(() => l.value ? Vn(o.value.description, l.value, b.value) : ""), z = M(() => {
      var R, q, N;
      return ((R = l.value) == null ? void 0 : R.body) || ((q = l.value) == null ? void 0 : q.brief) || (s.has(n.noun) ? (N = l.value) == null ? void 0 : N.text : "") || "";
    }), W = M(() => z.value ? Fs(z.value, { env: "", rowNames: !1 }) : ""), B = M(() => vw(l.value, z.value, i.value, r.value)), G = M(() => o.value.comments && p.value >= Kx.wide), P = M(() => o.value.comments && !G.value), L = (R) => o.value.components.filter((q) => (q.tab || "") === R).map((q) => q.window), x = M(() => [...new Set(o.value.components.map((R) => R.tab).filter(Boolean))]), $ = M(() => x.value.length || P.value ? [{ key: "details", label: "Details" }, ...x.value.map((R) => ({ key: R, label: R })), ...P.value ? [{ key: "comments", label: "Comments" }] : []] : []), w = Di(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (R) => n.read(R));
    async function v(R, q) {
      const N = await q;
      return R === g ? N : "";
    }
    async function T() {
      const R = ++g, q = await n.read(Vn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      R === g && (c.value = q.ok ? "" : q.error, q.ok && (l.value = q.value, l.value.creator_id && (i.value = await v(R, S8(n.read, l.value.creator_id))), l.value.agent_id && (r.value = await v(R, x8(n.read, l.value)))));
    }
    ge(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", T();
    }, { immediate: !0 }), bn(o.value.events, T), ge(w.open, (R) => R && P.value && (d.value = "comments"));
    let A = null;
    return Se(() => {
      var R;
      p.value = ((R = h.value) == null ? void 0 : R.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (A = new ResizeObserver(() => p.value = h.value.clientWidth), A.observe(h.value));
    }), Re(() => A == null ? void 0 : A.disconnect()), (R, q) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      E(p8, {
        label: C.value,
        title: _.value,
        description: j.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.noun}s`, id: e.id },
        onClose: q[0] || (q[0] = (N) => a("close")),
        onBack: q[1] || (q[1] = (N) => a("back")),
        onStep: q[2] || (q[2] = (N) => a("step", N))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (u(), f("p", _8, y(c.value), 1)) : l.value ? (u(), f(D, { key: 2 }, [
        E(Ui, null, {
          default: F(() => [
            E(Ds, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: T
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", C8, [
          m("div", E8, [
            $.value.length ? (u(), f("div", A8, [
              E(Pt, {
                options: $.value,
                value: d.value,
                onPick: q[3] || (q[3] = (N) => d.value = N)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", O8, [
              E(Ut, { value: d.value }, {
                details: F(() => [
                  m("div", T8, [
                    W.value ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: W.value
                    }, null, 8, I8)) : k("", !0),
                    o.value.lists_fields !== !1 ? (u(), H($8, {
                      key: 1,
                      fields: B.value,
                      onPeek: q[4] || (q[4] = (N) => a("open", N))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  E(hs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: L(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: F(() => [
                  E($l, {
                    below: "",
                    comments: I(w).comments.value,
                    words: I(w).words,
                    more: !!I(w).nextPage.value,
                    loading: I(w).loading.value,
                    failure: I(w).failure.value,
                    onMore: I(w).loadMore,
                    onClose: q[5] || (q[5] = (N) => d.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: F(() => [
                  E(hs, {
                    names: L(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), H(Dx, {
                key: 0,
                model: e.noun,
                id: e.id,
                read: e.read,
                kinds: o.value.links.kinds,
                open: o.value.links.open,
                "outside-plan": o.value.links.outside_plan,
                "page-size": o.value.links.page_size,
                onOpen: q[6] || (q[6] = (N) => a("open", N))
              }, null, 8, ["model", "id", "read", "kinds", "open", "outside-plan", "page-size"])) : k("", !0)
            ]),
            o.value.comments ? (u(), H(Gx, {
              key: 1,
              send: I(w).send,
              count: I(w).total.value,
              onShow: q[7] || (q[7] = (N) => P.value && (d.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          G.value ? (u(), H($l, {
            key: 0,
            comments: I(w).comments.value,
            words: I(w).words,
            more: !!I(w).nextPage.value,
            loading: I(w).loading.value,
            failure: I(w).failure.value,
            onMore: I(w).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (u(), f("div", M8, [
        E(Ge)
      ]))
    ], 512));
  }
}, B8 = /* @__PURE__ */ U(R8, [["__scopeId", "data-v-56b380d7"]]), TM = {
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
    const t = Ce(Ls);
    return (n, a) => (u(), H(B8, qe(n.$props, {
      catalogue: I(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, L8 = { class: "facts" }, N8 = { class: "fact wide" }, q8 = ["title"], D8 = {
  key: 1,
  class: "fact-value"
}, P8 = {
  key: 0,
  class: "fact"
}, j8 = { class: "fact-value" }, F8 = { class: "fact" }, W8 = { class: "fact-label" }, H8 = ["title"], z8 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, U8 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, V8 = {
  key: 2,
  class: "fact"
}, G8 = { class: "fact-value" }, K8 = { class: "fact wide" }, Y8 = { class: "fact-label" }, Q8 = { class: "fact wide" }, J8 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, X8 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ea.map(({ key: i, label: r }) => ({ key: String(i), label: r })), a = [1, 2, 3, 4, 5].map((i) => ({ key: String(i), label: String(i) })), s = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], o = t, l = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (i, r) => {
      var c, d;
      return u(), f("div", L8, [
        m("div", N8, [
          r[4] || (r[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (c = e.place) != null && c.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (h) => I(Ne)(`plans:${e.place.plan_id}`))
          }, "Plan " + y(e.place.plan_id) + ": " + y(e.place.plan_title), 9, q8)) : (u(), f("span", D8, "Not in a plan"))
        ]),
        ((d = e.place) == null ? void 0 : d.phase_total) > 1 ? (u(), f("div", P8, [
          r[5] || (r[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", j8, y(e.place.phase_number) + " of " + y(e.place.phase_total) + ": " + y(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (u(), f(D, { key: 1 }, [
          m("div", F8, [
            m("span", W8, y(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (h) => I(Ne)(`agents:${e.task.helper_id}`))
            }, y(e.task.helper_name), 9, H8)
          ]),
          I(l).has(e.task.state) ? (u(), f("p", z8, y(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", U8, y(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", V8, [
          r[6] || (r[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", G8, "Agent " + y(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", K8, [
          m("span", Y8, [
            r[7] || (r[7] = ne(" Complexity ", -1)),
            E(Xl, {
              lines: s.map((h, p) => `${p + 1}: ${h}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          E(Pt, {
            options: I(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (h) => o("complexity", h))
          }, null, 8, ["options", "value"])
        ]),
        m("div", Q8, [
          r[8] || (r[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          E(Pt, {
            options: I(n),
            value: String(I(zi)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (h) => o("priority", h))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", J8, y(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, Z8 = /* @__PURE__ */ U(X8, [["__scopeId", "data-v-ae15e31b"]]);
function e3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
  return { above: o.reverse(), below: l };
}
const t3 = { class: "number" }, n3 = { class: "title" }, a3 = { class: "word" }, s3 = {
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
    return (a, s) => (u(), H(yt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: F(() => [
        E(yn, { status: e.status }, null, 8, ["status"]),
        m("span", t3, y(e.number), 1),
        m("span", n3, y(e.title), 1),
        m("span", a3, y(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, es = /* @__PURE__ */ U(s3, [["__scopeId", "data-v-f6417ae8"]]), o3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, l3 = { class: "level" }, i3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(!1);
    ge(() => n.task.id, () => s.value = !1);
    const o = M(() => e3(n.task.id, n.graph)), l = M(() => s.value ? o.value.above : o.value.above.slice(-1)), i = M(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = M(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, p = !1) => ({ status: rn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), f("section", o3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(D, null, ae(l.value, (g) => (u(), f(D, {
        key: g.map((b) => b.id).join()
      }, [
        m("div", l3, [
          (u(!0), f(D, null, ae(g, (b) => (u(), H(es, qe({
            key: b.id,
            ref_for: !0
          }, d(b), {
            onSelect: p[0] || (p[0] = (_) => a("select", _))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      E(es, Xr(Zr(d(e.task, !0))), null, 16),
      (u(!0), f(D, null, ae(i.value, (g) => (u(), f(D, {
        key: g.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        E(es, qe({ ref_for: !0 }, d(g), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      r.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (g) => s.value = !s.value)
      }, y(s.value ? "Show less" : `Show the whole chain (${r.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, r3 = /* @__PURE__ */ U(i3, [["__scopeId", "data-v-79c52417"]]), u3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, c3 = ["datetime"], d3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", u3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(D, null, ae(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, y(new Date(a.created_at).toLocaleString()), 9, c3),
        m("p", null, y(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, f3 = /* @__PURE__ */ U(d3, [["__scopeId", "data-v-b41f213b"]]), h3 = {
  class: "part",
  "data-resource-waits": ""
}, m3 = ["onClick"], p3 = { class: "wait-id" }, v3 = { class: "wait-title" }, g3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", h3, [
      m("h4", null, y(e.title), 1),
      (u(!0), f(D, null, ae(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        E(yn, {
          status: I(rn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", p3, y(o.id), 1),
        m("span", v3, y(o.title), 1)
      ], 8, m3))), 128))
    ]));
  }
}, xl = /* @__PURE__ */ U(g3, [["__scopeId", "data-v-8fb2e251"]]), y3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, b3 = { class: "text" }, k3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, w3 = 180, $3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = S(!1), l = M(() => a.task.waits.filter((r) => !n.has(r.state))), i = M(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(D, null, [
      l.value.length ? (u(), H(xl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", y3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", b3, y(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (u(), f("section", k3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, y(e.task.brief), 3),
        e.task.brief.length > w3 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (u(), H(xl, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, x3 = /* @__PURE__ */ U($3, [["__scopeId", "data-v-4a3f1e79"]]), S3 = {
  class: "task-details",
  "data-task-details": ""
}, _3 = { class: "since" }, M3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, C3 = { class: "text" }, E3 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, A3 = {
  key: 1,
  class: "note"
}, O3 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, T3 = { class: "text" }, I3 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", S3, [
        m("div", {
          class: Y(["state-line", I(rn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            E(yn, {
              status: I(rn)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + y(a(e.task.state)), 1)
          ]),
          m("span", _3, [
            o[5] || (o[5] = ne(" since ", -1)),
            E(Xe, {
              at: I(ch)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", M3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", C3, y(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", E3, "Opens by itself when " + y(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", A3, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", O3, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", T3, y(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (u(), H(r3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        E(Z8, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        E(x3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        E(f3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, IM = /* @__PURE__ */ U(I3, [["__scopeId", "data-v-7e73fa21"]]), R3 = 50, B3 = { messages: 25 }, L3 = (e) => B3[e] || R3, N3 = {
  class: "task-log",
  "aria-label": "Task log"
}, q3 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, D3 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, P3 = { class: "entries" }, j3 = ["data-task-log-important"], F3 = ["datetime"], W3 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, H3 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = S([]), a = S(1), s = S(!0), o = S(!0), l = S("");
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
        String(L3("task_logs")),
        "--page",
        String(c)
      ]);
      d === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return ge(
      () => [t.id, t.changes],
      () => {
        n.value = [], r();
      },
      { immediate: !0 }
    ), Ze(() => {
      i += 1;
    }), (c, d) => (u(), f("section", N3, [
      o.value ? (u(), H(Ge, { key: 0 })) : l.value ? (u(), f(D, { key: 1 }, [
        m("p", q3, y(l.value), 1),
        E(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => r(a.value))
        }, {
          default: F(() => [...d[3] || (d[3] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(D, { key: 2 }, [
        n.value.length ? k("", !0) : (u(), f("p", D3, "No log entries yet.")),
        m("ol", P3, [
          (u(!0), f(D, null, ae(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, y(new Date(h.created_at).toLocaleString()), 9, F3),
            m("p", null, y(h.line), 1)
          ], 10, j3))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", W3, [
          E(pe, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => r(a.value - 1))
          }, {
            default: F(() => [...d[4] || (d[4] = [
              ne("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + y(a.value), 1),
          E(pe, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => r(a.value + 1))
          }, {
            default: F(() => [...d[5] || (d[5] = [
              ne("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, RM = /* @__PURE__ */ U(H3, [["__scopeId", "data-v-cfa43bf1"]]);
function z3(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ts = { exports: {} }, Sl;
function U3() {
  return Sl || (Sl = 1, (function(e, t) {
    var n = (function() {
      var a = function(B, G) {
        var P = 236, L = 17, x = B, $ = o[G], w = null, v = 0, T = null, A = [], R = {}, q = function(K, Q) {
          v = x * 4 + 17, w = (function(V) {
            for (var J = new Array(V), X = 0; X < V; X += 1) {
              J[X] = new Array(V);
              for (var se = 0; se < V; se += 1)
                J[X][se] = null;
            }
            return J;
          })(v), N(0, 0), N(v - 7, 0), N(0, v - 7), ie(), te(), fe(K, Q), x >= 7 && Oe(K), T == null && (T = le(x, $, A)), Z(T, Q);
        }, N = function(K, Q) {
          for (var V = -1; V <= 7; V += 1)
            if (!(K + V <= -1 || v <= K + V))
              for (var J = -1; J <= 7; J += 1)
                Q + J <= -1 || v <= Q + J || (0 <= V && V <= 6 && (J == 0 || J == 6) || 0 <= J && J <= 6 && (V == 0 || V == 6) || 2 <= V && V <= 4 && 2 <= J && J <= 4 ? w[K + V][Q + J] = !0 : w[K + V][Q + J] = !1);
        }, ee = function() {
          for (var K = 0, Q = 0, V = 0; V < 8; V += 1) {
            q(!0, V);
            var J = i.getLostPoint(R);
            (V == 0 || K > J) && (K = J, Q = V);
          }
          return Q;
        }, te = function() {
          for (var K = 8; K < v - 8; K += 1)
            w[K][6] == null && (w[K][6] = K % 2 == 0);
          for (var Q = 8; Q < v - 8; Q += 1)
            w[6][Q] == null && (w[6][Q] = Q % 2 == 0);
        }, ie = function() {
          for (var K = i.getPatternPosition(x), Q = 0; Q < K.length; Q += 1)
            for (var V = 0; V < K.length; V += 1) {
              var J = K[Q], X = K[V];
              if (w[J][X] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    se == -2 || se == 2 || ce == -2 || ce == 2 || se == 0 && ce == 0 ? w[J + se][X + ce] = !0 : w[J + se][X + ce] = !1;
            }
        }, Oe = function(K) {
          for (var Q = i.getBCHTypeNumber(x), V = 0; V < 18; V += 1) {
            var J = !K && (Q >> V & 1) == 1;
            w[Math.floor(V / 3)][V % 3 + v - 8 - 3] = J;
          }
          for (var V = 0; V < 18; V += 1) {
            var J = !K && (Q >> V & 1) == 1;
            w[V % 3 + v - 8 - 3][Math.floor(V / 3)] = J;
          }
        }, fe = function(K, Q) {
          for (var V = $ << 3 | Q, J = i.getBCHTypeInfo(V), X = 0; X < 15; X += 1) {
            var se = !K && (J >> X & 1) == 1;
            X < 6 ? w[X][8] = se : X < 8 ? w[X + 1][8] = se : w[v - 15 + X][8] = se;
          }
          for (var X = 0; X < 15; X += 1) {
            var se = !K && (J >> X & 1) == 1;
            X < 8 ? w[8][v - X - 1] = se : X < 9 ? w[8][15 - X - 1 + 1] = se : w[8][15 - X - 1] = se;
          }
          w[v - 8][8] = !K;
        }, Z = function(K, Q) {
          for (var V = -1, J = v - 1, X = 7, se = 0, ce = i.getMaskFunction(Q), ue = v - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var xe = 0; xe < 2; xe += 1)
                if (w[J][ue - xe] == null) {
                  var Ee = !1;
                  se < K.length && (Ee = (K[se] >>> X & 1) == 1);
                  var he = ce(J, ue - xe);
                  he && (Ee = !Ee), w[J][ue - xe] = Ee, X -= 1, X == -1 && (se += 1, X = 7);
                }
              if (J += V, J < 0 || v <= J) {
                J -= V, V = -V;
                break;
              }
            }
        }, oe = function(K, Q) {
          for (var V = 0, J = 0, X = 0, se = new Array(Q.length), ce = new Array(Q.length), ue = 0; ue < Q.length; ue += 1) {
            var xe = Q[ue].dataCount, Ee = Q[ue].totalCount - xe;
            J = Math.max(J, xe), X = Math.max(X, Ee), se[ue] = new Array(xe);
            for (var he = 0; he < se[ue].length; he += 1)
              se[ue][he] = 255 & K.getBuffer()[he + V];
            V += xe;
            var Pe = i.getErrorCorrectPolynomial(Ee), je = c(se[ue], Pe.getLength() - 1), oo = je.mod(Pe);
            ce[ue] = new Array(Pe.getLength() - 1);
            for (var he = 0; he < ce[ue].length; he += 1) {
              var lo = he + oo.getLength() - ce[ue].length;
              ce[ue][he] = lo >= 0 ? oo.getAt(lo) : 0;
            }
          }
          for (var io = 0, he = 0; he < Q.length; he += 1)
            io += Q[he].totalCount;
          for (var ka = new Array(io), _n = 0, he = 0; he < J; he += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              he < se[ue].length && (ka[_n] = se[ue][he], _n += 1);
          for (var he = 0; he < X; he += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              he < ce[ue].length && (ka[_n] = ce[ue][he], _n += 1);
          return ka;
        }, le = function(K, Q, V) {
          for (var J = d.getRSBlocks(K, Q), X = h(), se = 0; se < V.length; se += 1) {
            var ce = V[se];
            X.put(ce.getMode(), 4), X.put(ce.getLength(), i.getLengthInBits(ce.getMode(), K)), ce.write(X);
          }
          for (var ue = 0, se = 0; se < J.length; se += 1)
            ue += J[se].dataCount;
          if (X.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + X.getLengthInBits() + ">" + ue * 8 + ")";
          for (X.getLengthInBits() + 4 <= ue * 8 && X.put(0, 4); X.getLengthInBits() % 8 != 0; )
            X.putBit(!1);
          for (; !(X.getLengthInBits() >= ue * 8 || (X.put(P, 8), X.getLengthInBits() >= ue * 8)); )
            X.put(L, 8);
          return oe(X, J);
        };
        R.addData = function(K, Q) {
          Q = Q || "Byte";
          var V = null;
          switch (Q) {
            case "Numeric":
              V = p(K);
              break;
            case "Alphanumeric":
              V = g(K);
              break;
            case "Byte":
              V = b(K);
              break;
            case "Kanji":
              V = _(K);
              break;
            default:
              throw "mode:" + Q;
          }
          A.push(V), T = null;
        }, R.isDark = function(K, Q) {
          if (K < 0 || v <= K || Q < 0 || v <= Q)
            throw K + "," + Q;
          return w[K][Q];
        }, R.getModuleCount = function() {
          return v;
        }, R.make = function() {
          if (x < 1) {
            for (var K = 1; K < 40; K++) {
              for (var Q = d.getRSBlocks(K, $), V = h(), J = 0; J < A.length; J++) {
                var X = A[J];
                V.put(X.getMode(), 4), V.put(X.getLength(), i.getLengthInBits(X.getMode(), K)), X.write(V);
              }
              for (var se = 0, J = 0; J < Q.length; J++)
                se += Q[J].dataCount;
              if (V.getLengthInBits() <= se * 8)
                break;
            }
            x = K;
          }
          q(!1, ee());
        }, R.createTableTag = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var V = "";
          V += '<table style="', V += " border-width: 0px; border-style: none;", V += " border-collapse: collapse;", V += " padding: 0px; margin: " + Q + "px;", V += '">', V += "<tbody>";
          for (var J = 0; J < R.getModuleCount(); J += 1) {
            V += "<tr>";
            for (var X = 0; X < R.getModuleCount(); X += 1)
              V += '<td style="', V += " border-width: 0px; border-style: none;", V += " border-collapse: collapse;", V += " padding: 0px; margin: 0px;", V += " width: " + K + "px;", V += " height: " + K + "px;", V += " background-color: ", V += R.isDark(J, X) ? "#000000" : "#ffffff", V += ";", V += '"/>';
            V += "</tr>";
          }
          return V += "</tbody>", V += "</table>", V;
        }, R.createSvgTag = function(K, Q, V, J) {
          var X = {};
          typeof arguments[0] == "object" && (X = arguments[0], K = X.cellSize, Q = X.margin, V = X.alt, J = X.title), K = K || 2, Q = typeof Q > "u" ? K * 4 : Q, V = typeof V == "string" ? { text: V } : V || {}, V.text = V.text || null, V.id = V.text ? V.id || "qrcode-description" : null, J = typeof J == "string" ? { text: J } : J || {}, J.text = J.text || null, J.id = J.text ? J.id || "qrcode-title" : null;
          var se = R.getModuleCount() * K + Q * 2, ce, ue, xe, Ee, he = "", Pe;
          for (Pe = "l" + K + ",0 0," + K + " -" + K + ",0 0,-" + K + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += X.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', he += ' viewBox="0 0 ' + se + " " + se + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += J.text || V.text ? ' role="img" aria-labelledby="' + et([J.id, V.id].join(" ").trim()) + '"' : "", he += ">", he += J.text ? '<title id="' + et(J.id) + '">' + et(J.text) + "</title>" : "", he += V.text ? '<description id="' + et(V.id) + '">' + et(V.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', xe = 0; xe < R.getModuleCount(); xe += 1)
            for (Ee = xe * K + Q, ce = 0; ce < R.getModuleCount(); ce += 1)
              R.isDark(xe, ce) && (ue = ce * K + Q, he += "M" + ue + "," + Ee + Pe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, R.createDataURL = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var V = R.getModuleCount() * K + Q * 2, J = Q, X = V - Q;
          return W(V, V, function(se, ce) {
            if (J <= se && se < X && J <= ce && ce < X) {
              var ue = Math.floor((se - J) / K), xe = Math.floor((ce - J) / K);
              return R.isDark(xe, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(K, Q, V) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var J = R.getModuleCount() * K + Q * 2, X = "";
          return X += "<img", X += ' src="', X += R.createDataURL(K, Q), X += '"', X += ' width="', X += J, X += '"', X += ' height="', X += J, X += '"', V && (X += ' alt="', X += et(V), X += '"'), X += "/>", X;
        };
        var et = function(K) {
          for (var Q = "", V = 0; V < K.length; V += 1) {
            var J = K.charAt(V);
            switch (J) {
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
                Q += J;
                break;
            }
          }
          return Q;
        }, Pr = function(K) {
          var Q = 1;
          K = typeof K > "u" ? Q * 2 : K;
          var V = R.getModuleCount() * Q + K * 2, J = K, X = V - K, se, ce, ue, xe, Ee, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Pe = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, je = "";
          for (se = 0; se < V; se += 2) {
            for (ue = Math.floor((se - J) / Q), xe = Math.floor((se + 1 - J) / Q), ce = 0; ce < V; ce += 1)
              Ee = "█", J <= ce && ce < X && J <= se && se < X && R.isDark(ue, Math.floor((ce - J) / Q)) && (Ee = " "), J <= ce && ce < X && J <= se + 1 && se + 1 < X && R.isDark(xe, Math.floor((ce - J) / Q)) ? Ee += " " : Ee += "█", je += K < 1 && se + 1 >= X ? Pe[Ee] : he[Ee];
            je += `
`;
          }
          return V % 2 && K > 0 ? je.substring(0, je.length - V - 1) + Array(V + 1).join("▀") : je.substring(0, je.length - 1);
        };
        return R.createASCII = function(K, Q) {
          if (K = K || 1, K < 2)
            return Pr(Q);
          K -= 1, Q = typeof Q > "u" ? K * 2 : Q;
          var V = R.getModuleCount() * K + Q * 2, J = Q, X = V - Q, se, ce, ue, xe, Ee = Array(K + 1).join("██"), he = Array(K + 1).join("  "), Pe = "", je = "";
          for (se = 0; se < V; se += 1) {
            for (ue = Math.floor((se - J) / K), je = "", ce = 0; ce < V; ce += 1)
              xe = 1, J <= ce && ce < X && J <= se && se < X && R.isDark(ue, Math.floor((ce - J) / K)) && (xe = 0), je += xe ? Ee : he;
            for (ue = 0; ue < K; ue += 1)
              Pe += je + `
`;
          }
          return Pe.substring(0, Pe.length - 1);
        }, R.renderTo2dContext = function(K, Q) {
          Q = Q || 2;
          for (var V = R.getModuleCount(), J = 0; J < V; J++)
            for (var X = 0; X < V; X++)
              K.fillStyle = R.isDark(J, X) ? "black" : "white", K.fillRect(J * Q, X * Q, Q, Q);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(B) {
          for (var G = [], P = 0; P < B.length; P += 1) {
            var L = B.charCodeAt(P);
            G.push(L & 255);
          }
          return G;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(B, G) {
        var P = (function() {
          for (var x = j(B), $ = function() {
            var te = x.read();
            if (te == -1) throw "eof";
            return te;
          }, w = 0, v = {}; ; ) {
            var T = x.read();
            if (T == -1) break;
            var A = $(), R = $(), q = $(), N = String.fromCharCode(T << 8 | A), ee = R << 8 | q;
            v[N] = ee, w += 1;
          }
          if (w != G)
            throw w + " != " + G;
          return v;
        })(), L = 63;
        return function(x) {
          for (var $ = [], w = 0; w < x.length; w += 1) {
            var v = x.charCodeAt(w);
            if (v < 128)
              $.push(v);
            else {
              var T = P[x.charAt(w)];
              typeof T == "number" ? (T & 255) == T ? $.push(T) : ($.push(T >>> 8), $.push(T & 255)) : $.push(L);
            }
          }
          return $;
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
        ], G = 1335, P = 7973, L = 21522, x = {}, $ = function(w) {
          for (var v = 0; w != 0; )
            v += 1, w >>>= 1;
          return v;
        };
        return x.getBCHTypeInfo = function(w) {
          for (var v = w << 10; $(v) - $(G) >= 0; )
            v ^= G << $(v) - $(G);
          return (w << 10 | v) ^ L;
        }, x.getBCHTypeNumber = function(w) {
          for (var v = w << 12; $(v) - $(P) >= 0; )
            v ^= P << $(v) - $(P);
          return w << 12 | v;
        }, x.getPatternPosition = function(w) {
          return B[w - 1];
        }, x.getMaskFunction = function(w) {
          switch (w) {
            case l.PATTERN000:
              return function(v, T) {
                return (v + T) % 2 == 0;
              };
            case l.PATTERN001:
              return function(v, T) {
                return v % 2 == 0;
              };
            case l.PATTERN010:
              return function(v, T) {
                return T % 3 == 0;
              };
            case l.PATTERN011:
              return function(v, T) {
                return (v + T) % 3 == 0;
              };
            case l.PATTERN100:
              return function(v, T) {
                return (Math.floor(v / 2) + Math.floor(T / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(v, T) {
                return v * T % 2 + v * T % 3 == 0;
              };
            case l.PATTERN110:
              return function(v, T) {
                return (v * T % 2 + v * T % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(v, T) {
                return (v * T % 3 + (v + T) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, x.getErrorCorrectPolynomial = function(w) {
          for (var v = c([1], 0), T = 0; T < w; T += 1)
            v = v.multiply(c([1, r.gexp(T)], 0));
          return v;
        }, x.getLengthInBits = function(w, v) {
          if (1 <= v && v < 10)
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
          else if (v < 27)
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
          else if (v < 41)
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
            throw "type:" + v;
        }, x.getLostPoint = function(w) {
          for (var v = w.getModuleCount(), T = 0, A = 0; A < v; A += 1)
            for (var R = 0; R < v; R += 1) {
              for (var q = 0, N = w.isDark(A, R), ee = -1; ee <= 1; ee += 1)
                if (!(A + ee < 0 || v <= A + ee))
                  for (var te = -1; te <= 1; te += 1)
                    R + te < 0 || v <= R + te || ee == 0 && te == 0 || N == w.isDark(A + ee, R + te) && (q += 1);
              q > 5 && (T += 3 + q - 5);
            }
          for (var A = 0; A < v - 1; A += 1)
            for (var R = 0; R < v - 1; R += 1) {
              var ie = 0;
              w.isDark(A, R) && (ie += 1), w.isDark(A + 1, R) && (ie += 1), w.isDark(A, R + 1) && (ie += 1), w.isDark(A + 1, R + 1) && (ie += 1), (ie == 0 || ie == 4) && (T += 3);
            }
          for (var A = 0; A < v; A += 1)
            for (var R = 0; R < v - 6; R += 1)
              w.isDark(A, R) && !w.isDark(A, R + 1) && w.isDark(A, R + 2) && w.isDark(A, R + 3) && w.isDark(A, R + 4) && !w.isDark(A, R + 5) && w.isDark(A, R + 6) && (T += 40);
          for (var R = 0; R < v; R += 1)
            for (var A = 0; A < v - 6; A += 1)
              w.isDark(A, R) && !w.isDark(A + 1, R) && w.isDark(A + 2, R) && w.isDark(A + 3, R) && w.isDark(A + 4, R) && !w.isDark(A + 5, R) && w.isDark(A + 6, R) && (T += 40);
          for (var Oe = 0, R = 0; R < v; R += 1)
            for (var A = 0; A < v; A += 1)
              w.isDark(A, R) && (Oe += 1);
          var fe = Math.abs(100 * Oe / v / v - 50) / 5;
          return T += fe * 10, T;
        }, x;
      })(), r = (function() {
        for (var B = new Array(256), G = new Array(256), P = 0; P < 8; P += 1)
          B[P] = 1 << P;
        for (var P = 8; P < 256; P += 1)
          B[P] = B[P - 4] ^ B[P - 5] ^ B[P - 6] ^ B[P - 8];
        for (var P = 0; P < 255; P += 1)
          G[B[P]] = P;
        var L = {};
        return L.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return G[x];
        }, L.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return B[x];
        }, L;
      })();
      function c(B, G) {
        if (typeof B.length > "u")
          throw B.length + "/" + G;
        var P = (function() {
          for (var x = 0; x < B.length && B[x] == 0; )
            x += 1;
          for (var $ = new Array(B.length - x + G), w = 0; w < B.length - x; w += 1)
            $[w] = B[w + x];
          return $;
        })(), L = {};
        return L.getAt = function(x) {
          return P[x];
        }, L.getLength = function() {
          return P.length;
        }, L.multiply = function(x) {
          for (var $ = new Array(L.getLength() + x.getLength() - 1), w = 0; w < L.getLength(); w += 1)
            for (var v = 0; v < x.getLength(); v += 1)
              $[w + v] ^= r.gexp(r.glog(L.getAt(w)) + r.glog(x.getAt(v)));
          return c($, 0);
        }, L.mod = function(x) {
          if (L.getLength() - x.getLength() < 0)
            return L;
          for (var $ = r.glog(L.getAt(0)) - r.glog(x.getAt(0)), w = new Array(L.getLength()), v = 0; v < L.getLength(); v += 1)
            w[v] = L.getAt(v);
          for (var v = 0; v < x.getLength(); v += 1)
            w[v] ^= r.gexp(r.glog(x.getAt(v)) + $);
          return c(w, 0).mod(x);
        }, L;
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
        ], G = function(x, $) {
          var w = {};
          return w.totalCount = x, w.dataCount = $, w;
        }, P = {}, L = function(x, $) {
          switch ($) {
            case o.L:
              return B[(x - 1) * 4 + 0];
            case o.M:
              return B[(x - 1) * 4 + 1];
            case o.Q:
              return B[(x - 1) * 4 + 2];
            case o.H:
              return B[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return P.getRSBlocks = function(x, $) {
          var w = L(x, $);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + $;
          for (var v = w.length / 3, T = [], A = 0; A < v; A += 1)
            for (var R = w[A * 3 + 0], q = w[A * 3 + 1], N = w[A * 3 + 2], ee = 0; ee < R; ee += 1)
              T.push(G(q, N));
          return T;
        }, P;
      })(), h = function() {
        var B = [], G = 0, P = {};
        return P.getBuffer = function() {
          return B;
        }, P.getAt = function(L) {
          var x = Math.floor(L / 8);
          return (B[x] >>> 7 - L % 8 & 1) == 1;
        }, P.put = function(L, x) {
          for (var $ = 0; $ < x; $ += 1)
            P.putBit((L >>> x - $ - 1 & 1) == 1);
        }, P.getLengthInBits = function() {
          return G;
        }, P.putBit = function(L) {
          var x = Math.floor(G / 8);
          B.length <= x && B.push(0), L && (B[x] |= 128 >>> G % 8), G += 1;
        }, P;
      }, p = function(B) {
        var G = s.MODE_NUMBER, P = B, L = {};
        L.getMode = function() {
          return G;
        }, L.getLength = function(w) {
          return P.length;
        }, L.write = function(w) {
          for (var v = P, T = 0; T + 2 < v.length; )
            w.put(x(v.substring(T, T + 3)), 10), T += 3;
          T < v.length && (v.length - T == 1 ? w.put(x(v.substring(T, T + 1)), 4) : v.length - T == 2 && w.put(x(v.substring(T, T + 2)), 7));
        };
        var x = function(w) {
          for (var v = 0, T = 0; T < w.length; T += 1)
            v = v * 10 + $(w.charAt(T));
          return v;
        }, $ = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return L;
      }, g = function(B) {
        var G = s.MODE_ALPHA_NUM, P = B, L = {};
        L.getMode = function() {
          return G;
        }, L.getLength = function($) {
          return P.length;
        }, L.write = function($) {
          for (var w = P, v = 0; v + 1 < w.length; )
            $.put(
              x(w.charAt(v)) * 45 + x(w.charAt(v + 1)),
              11
            ), v += 2;
          v < w.length && $.put(x(w.charAt(v)), 6);
        };
        var x = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          if ("A" <= $ && $ <= "Z")
            return $.charCodeAt(0) - 65 + 10;
          switch ($) {
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
              throw "illegal char :" + $;
          }
        };
        return L;
      }, b = function(B) {
        var G = s.MODE_8BIT_BYTE, P = a.stringToBytes(B), L = {};
        return L.getMode = function() {
          return G;
        }, L.getLength = function(x) {
          return P.length;
        }, L.write = function(x) {
          for (var $ = 0; $ < P.length; $ += 1)
            x.put(P[$], 8);
        }, L;
      }, _ = function(B) {
        var G = s.MODE_KANJI, P = a.stringToBytesFuncs.SJIS;
        if (!P)
          throw "sjis not supported.";
        (function($, w) {
          var v = P($);
          if (v.length != 2 || (v[0] << 8 | v[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var L = P(B), x = {};
        return x.getMode = function() {
          return G;
        }, x.getLength = function($) {
          return ~~(L.length / 2);
        }, x.write = function($) {
          for (var w = L, v = 0; v + 1 < w.length; ) {
            var T = (255 & w[v]) << 8 | 255 & w[v + 1];
            if (33088 <= T && T <= 40956)
              T -= 33088;
            else if (57408 <= T && T <= 60351)
              T -= 49472;
            else
              throw "illegal char at " + (v + 1) + "/" + T;
            T = (T >>> 8 & 255) * 192 + (T & 255), $.put(T, 13), v += 2;
          }
          if (v < w.length)
            throw "illegal char at " + (v + 1);
        }, x;
      }, O = function() {
        var B = [], G = {};
        return G.writeByte = function(P) {
          B.push(P & 255);
        }, G.writeShort = function(P) {
          G.writeByte(P), G.writeByte(P >>> 8);
        }, G.writeBytes = function(P, L, x) {
          L = L || 0, x = x || P.length;
          for (var $ = 0; $ < x; $ += 1)
            G.writeByte(P[$ + L]);
        }, G.writeString = function(P) {
          for (var L = 0; L < P.length; L += 1)
            G.writeByte(P.charCodeAt(L));
        }, G.toByteArray = function() {
          return B;
        }, G.toString = function() {
          var P = "";
          P += "[";
          for (var L = 0; L < B.length; L += 1)
            L > 0 && (P += ","), P += B[L];
          return P += "]", P;
        }, G;
      }, C = function() {
        var B = 0, G = 0, P = 0, L = "", x = {}, $ = function(v) {
          L += String.fromCharCode(w(v & 63));
        }, w = function(v) {
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
          for (B = B << 8 | v & 255, G += 8, P += 1; G >= 6; )
            $(B >>> G - 6), G -= 6;
        }, x.flush = function() {
          if (G > 0 && ($(B << 6 - G), B = 0, G = 0), P % 3 != 0)
            for (var v = 3 - P % 3, T = 0; T < v; T += 1)
              L += "=";
        }, x.toString = function() {
          return L;
        }, x;
      }, j = function(B) {
        var G = B, P = 0, L = 0, x = 0, $ = {};
        $.read = function() {
          for (; x < 8; ) {
            if (P >= G.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var v = G.charAt(P);
            if (P += 1, v == "=")
              return x = 0, -1;
            if (v.match(/^\s$/))
              continue;
            L = L << 6 | w(v.charCodeAt(0)), x += 6;
          }
          var T = L >>> x - 8 & 255;
          return x -= 8, T;
        };
        var w = function(v) {
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
        return $;
      }, z = function(B, G) {
        var P = B, L = G, x = new Array(B * G), $ = {};
        $.setPixel = function(A, R, q) {
          x[R * P + A] = q;
        }, $.write = function(A) {
          A.writeString("GIF87a"), A.writeShort(P), A.writeShort(L), A.writeByte(128), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(255), A.writeByte(255), A.writeByte(255), A.writeString(","), A.writeShort(0), A.writeShort(0), A.writeShort(P), A.writeShort(L), A.writeByte(0);
          var R = 2, q = v(R);
          A.writeByte(R);
          for (var N = 0; q.length - N > 255; )
            A.writeByte(255), A.writeBytes(q, N, 255), N += 255;
          A.writeByte(q.length - N), A.writeBytes(q, N, q.length - N), A.writeByte(0), A.writeString(";");
        };
        var w = function(A) {
          var R = A, q = 0, N = 0, ee = {};
          return ee.write = function(te, ie) {
            if (te >>> ie)
              throw "length over";
            for (; q + ie >= 8; )
              R.writeByte(255 & (te << q | N)), ie -= 8 - q, te >>>= 8 - q, N = 0, q = 0;
            N = te << q | N, q = q + ie;
          }, ee.flush = function() {
            q > 0 && R.writeByte(N);
          }, ee;
        }, v = function(A) {
          for (var R = 1 << A, q = (1 << A) + 1, N = A + 1, ee = T(), te = 0; te < R; te += 1)
            ee.add(String.fromCharCode(te));
          ee.add(String.fromCharCode(R)), ee.add(String.fromCharCode(q));
          var ie = O(), Oe = w(ie);
          Oe.write(R, N);
          var fe = 0, Z = String.fromCharCode(x[fe]);
          for (fe += 1; fe < x.length; ) {
            var oe = String.fromCharCode(x[fe]);
            fe += 1, ee.contains(Z + oe) ? Z = Z + oe : (Oe.write(ee.indexOf(Z), N), ee.size() < 4095 && (ee.size() == 1 << N && (N += 1), ee.add(Z + oe)), Z = oe);
          }
          return Oe.write(ee.indexOf(Z), N), Oe.write(q, N), Oe.flush(), ie.toByteArray();
        }, T = function() {
          var A = {}, R = 0, q = {};
          return q.add = function(N) {
            if (q.contains(N))
              throw "dup key:" + N;
            A[N] = R, R += 1;
          }, q.size = function() {
            return R;
          }, q.indexOf = function(N) {
            return A[N];
          }, q.contains = function(N) {
            return typeof A[N] < "u";
          }, q;
        };
        return $;
      }, W = function(B, G, P) {
        for (var L = z(B, G), x = 0; x < G; x += 1)
          for (var $ = 0; $ < B; $ += 1)
            L.setPixel($, x, P($, x));
        var w = O();
        L.write(w);
        for (var v = C(), T = w.toByteArray(), A = 0; A < T.length; A += 1)
          v.writeByte(T[A]);
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
var V3 = U3();
const G3 = /* @__PURE__ */ z3(V3), K3 = ["width", "height", "viewBox"], Y3 = ["width", "height"], Q3 = ["d"], J3 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = M(() => {
      const a = G3(0, "M");
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
      }, null, 8, Y3),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Q3)
    ], 8, K3));
  }
}, BM = /* @__PURE__ */ U(J3, [["__scopeId", "data-v-489f0852"]]), X3 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, LM = /* @__PURE__ */ U(X3, [["__scopeId", "data-v-47e67f04"]]);
function NM(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const qM = eu(() => import("./VoiceFigure-Bc5X1hrG.js").then((e) => e.V)), DM = "1.2.0", PM = "3.5";
export {
  Ef as $,
  Ae as A,
  Ie as B,
  va as C,
  it as D,
  F_ as E,
  Z5 as F,
  T6 as G,
  q_ as H,
  R5 as I,
  l$ as J,
  At as K,
  nS as L,
  Zs as M,
  f$ as N,
  o$ as O,
  pa as P,
  a_ as Q,
  c6 as R,
  zn as S,
  r_ as T,
  n6 as U,
  Te as V,
  na as W,
  t6 as X,
  e6 as Y,
  Cf as Z,
  U as _,
  VS as a,
  __ as a$,
  c$ as a0,
  d6 as a1,
  f6 as a2,
  De as a3,
  x6 as a4,
  $6 as a5,
  Ct as a6,
  h6 as a7,
  L6 as a8,
  LS as a9,
  g_ as aA,
  e_ as aB,
  $5 as aC,
  P6 as aD,
  j6 as aE,
  W_ as aF,
  wr as aG,
  i_ as aH,
  wn as aI,
  FS as aJ,
  DS as aK,
  T_ as aL,
  $n as aM,
  L_ as aN,
  O6 as aO,
  t_ as aP,
  n_ as aQ,
  Z6 as aR,
  dn as aS,
  _t as aT,
  NS as aU,
  f2 as aV,
  J6 as aW,
  r6 as aX,
  br as aY,
  Wt as aZ,
  Gt as a_,
  M_ as aa,
  R_ as ab,
  zS as ac,
  a6 as ad,
  s6 as ae,
  k6 as af,
  w6 as ag,
  S6 as ah,
  QS as ai,
  ml as aj,
  m6 as ak,
  B6 as al,
  V_ as am,
  G6 as an,
  U6 as ao,
  z6 as ap,
  _6 as aq,
  y6 as ar,
  g6 as as,
  b6 as at,
  l_ as au,
  R6 as av,
  N6 as aw,
  Y_ as ax,
  en as ay,
  q6 as az,
  x$ as b,
  K_ as b$,
  Y5 as b0,
  B_ as b1,
  d_ as b2,
  c_ as b3,
  N2 as b4,
  lr as b5,
  $_ as b6,
  I6 as b7,
  ba as b8,
  dt as b9,
  h_ as bA,
  b_ as bB,
  pt as bC,
  u_ as bD,
  k_ as bE,
  D6 as bF,
  K6 as bG,
  F6 as bH,
  Be as bI,
  A6 as bJ,
  w_ as bK,
  aM as bL,
  sM as bM,
  RS as bN,
  p2 as bO,
  C6 as bP,
  m_ as bQ,
  GS as bR,
  U_ as bS,
  f_ as bT,
  p_ as bU,
  v_ as bV,
  M6 as bW,
  x5 as bX,
  E6 as bY,
  H6 as bZ,
  z_ as b_,
  y_ as ba,
  Fa as bb,
  yi as bc,
  J_ as bd,
  eM as be,
  o_ as bf,
  O_ as bg,
  BS as bh,
  V6 as bi,
  X_ as bj,
  p6 as bk,
  v6 as bl,
  XS as bm,
  u6 as bn,
  jS as bo,
  E_ as bp,
  KS as bq,
  YS as br,
  ZS as bs,
  Q6 as bt,
  i2 as bu,
  N_ as bv,
  s$ as bw,
  JS as bx,
  WS as by,
  Y6 as bz,
  L2 as c,
  BM as c$,
  PS as c0,
  qS as c1,
  W6 as c2,
  tM as c3,
  so as c4,
  nM as c5,
  Nr as c6,
  A_ as c7,
  l6 as c8,
  o6 as c9,
  mt as cA,
  Ld as cB,
  TM as cC,
  ve as cD,
  Xl as cE,
  bM as cF,
  dS as cG,
  DM as cH,
  PM as cI,
  $S as cJ,
  wM as cK,
  ps as cL,
  ES as cM,
  Yk as cN,
  jt as cO,
  bl as cP,
  Is as cQ,
  yS as cR,
  xS as cS,
  gc as cT,
  Ok as cU,
  EM as cV,
  fS as cW,
  hS as cX,
  mS as cY,
  kS as cZ,
  OM as c_,
  d2 as ca,
  HS as cb,
  n$ as cc,
  X6 as cd,
  Qs as ce,
  g5 as cf,
  s_ as cg,
  tn as ch,
  qt as ci,
  pS as cj,
  gS as ck,
  yM as cl,
  pe as cm,
  cf as cn,
  Ds as co,
  da as cp,
  ag as cq,
  fa as cr,
  AM as cs,
  IS as ct,
  vS as cu,
  lg as cv,
  Oi as cw,
  sn as cx,
  oM as cy,
  eS as cz,
  Ve as d,
  Mu as d$,
  Ri as d0,
  Vc as d1,
  vM as d2,
  Sy as d3,
  iS as d4,
  OS as d5,
  g4 as d6,
  Pt as d7,
  SS as d8,
  Ge as d9,
  MM as dA,
  _M as dB,
  Rs as dC,
  rd as dD,
  Os as dE,
  wm as dF,
  CM as dG,
  TS as dH,
  AS as dI,
  CS as dJ,
  iM as dK,
  tm as dL,
  lM as dM,
  oS as dN,
  xM as dO,
  Hk as dP,
  P$ as dQ,
  uS as dR,
  wS as dS,
  cM as dT,
  fM as dU,
  Ne as dV,
  Sp as dW,
  bS as dX,
  bc as dY,
  Gi as dZ,
  uM as d_,
  bt as da,
  hv as db,
  ed as dc,
  Cm as dd,
  MS as de,
  rS as df,
  Ut as dg,
  kM as dh,
  r3 as di,
  IM as dj,
  RM as dk,
  yn as dl,
  qd as dm,
  at as dn,
  _S as dp,
  Xe as dq,
  qM as dr,
  LM as ds,
  Us as dt,
  dM as du,
  Cs as dv,
  $p as dw,
  Bo as dx,
  zs as dy,
  ud as dz,
  i6 as e,
  lS as e0,
  sS as e1,
  on as e2,
  Vl as e3,
  cd as e4,
  cS as e5,
  ht as e6,
  NM as e7,
  j$ as e8,
  tS as e9,
  aS as ea,
  rM as eb,
  gM as ec,
  Mi as ed,
  $M as ee,
  Ki as ef,
  Wl as eg,
  M4 as eh,
  Es as ei,
  hM as ej,
  ns as ek,
  mM as el,
  pM as em,
  ze as en,
  SM as eo,
  Kn as ep,
  l2 as f,
  Q_ as g,
  fn as h,
  D_ as i,
  Z_ as j,
  P_ as k,
  C_ as l,
  E$ as m,
  eo as n,
  I_ as o,
  US as p,
  j_ as q,
  Br as r,
  Lr as s,
  Me as t,
  D2 as u,
  x_ as v,
  G_ as w,
  S_ as x,
  Sn as y,
  H_ as z
};
