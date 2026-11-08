/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as ye, unref as B, renderSlot as fe, createElementVNode as m, normalizeClass as Y, Fragment as D, renderList as ae, defineComponent as Gr, Comment as Vr, h as ra, cloneVNode as Kr, createBlock as F, withCtx as j, createVNode as A, toDisplayString as g, createCommentVNode as w, ref as _, onMounted as Se, onBeforeUnmount as Ke, reactive as zt, shallowRef as Je, watch as ve, onUnmounted as Ie, inject as Ce, useAttrs as ua, computed as M, resolveDynamicComponent as it, mergeProps as qe, useId as _s, resolveDirective as Yr, withDirectives as Ze, createTextVNode as ne, Teleport as ca, nextTick as je, Transition as Ut, withModifiers as xe, createApp as Qr, shallowReactive as Xr, withKeys as Mt, onScopeDispose as da, useModel as sn, mergeModels as Pt, vModelText as Kn, resolveComponent as Jr, provide as Ol, onErrorCaptured as Zr, TransitionGroup as Ms, isRef as uo, getCurrentInstance as eu, getCurrentScope as Tl, toHandlers as tu, createSlots as nu, vShow as Il, useSlots as au, normalizeProps as su, guardReactiveProps as ou, defineAsyncComponent as lu } from "vue";
function Rl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const U = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, iu = 1600, ru = {
  __name: "Shimmer",
  setup(e) {
    const t = Rl(iu);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: ye(B(t))
    }, null, 4));
  }
}, Jt = /* @__PURE__ */ U(ru, [["__scopeId", "data-v-6c018b03"]]), uu = { class: "skeleton-line" }, cu = 2e3, du = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Rl(cu);
    return (n, a) => (u(), f("span", uu, [
      fe(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(D, null, ae(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ye({ ...B(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ U(du, [["__scopeId", "data-v-484fe8a0"]]), Gt = Gr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Vr);
      return a.length !== 1 ? ra(D, { key: n }, a) : a[0].key == null ? Kr(a[0], { key: n }) : a[0];
    };
  }
}), fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], vu = ["aria-label"], gu = ["aria-label"], yu = ["aria-label"], bu = {
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
          (u(), f(D, null, ae(t, (d) => A(Jt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: ye({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, fu)
      ]),
      older: j(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(t.slice(0, 3), (d) => (u(), F(Jt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: ye({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, hu)
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
            (u(), f(D, null, ae(n, (h) => A(bt, {
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
          (u(!0), f(D, null, ae(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            A(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(D, null, ae(s, (h) => A(bt, {
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
          A(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (u(!0), f(D, null, ae(e.count, (d) => (u(), F(bt, {
            key: d,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, vu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), F(bt, {
            key: d,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, gu)
      ]),
      default: j(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(D, null, ae(e.count, (d) => (u(), F(bt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, yu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ye = /* @__PURE__ */ U(bu, [["__scopeId", "data-v-ef519c5f"]]), ku = {
  key: 1,
  class: "empty-state titled"
}, wu = { class: "empty-state-title" }, $u = { class: "empty-state-text" }, xu = {
  key: 2,
  class: "empty-state"
}, Su = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), F(Ye, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", ku, [
      m("p", wu, g(e.title), 1),
      m("p", $u, [
        fe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", xu, [
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, on = /* @__PURE__ */ U(Su, [["__scopeId", "data-v-b27e89b0"]]), _u = { class: "fold-group" }, Mu = ["aria-expanded"], Cu = { class: "fold-label" }, Eu = {
  key: 0,
  class: "fold-count"
}, Au = {
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
    return (a, s) => (u(), f("div", _u, [
      m("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Cu, g(e.label), 1),
        e.count !== "" ? (u(), f("span", Eu, g(e.count), 1)) : w("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Mu),
      e.open ? fe(a.$slots, "default", {}, void 0, !0, 0) : w("", !0)
    ]));
  }
}, gS = /* @__PURE__ */ U(Au, [["__scopeId", "data-v-9ef1865c"]]), Ou = 150, Tu = () => Ou;
function Cs(e, t, n = Tu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Iu(e, t, n) {
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
const Ru = 50, co = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function yS(e) {
  const t = Ue().sources.find((n) => n.key === e);
  return t ? ns(t.read, t.events) : ns("", []);
}
function Bl(e, t, n, a, s = () => !1) {
  const o = _([]), l = _(null), i = _(""), r = _(!1), c = performance.now(), d = _(!1), h = _(""), p = _(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function O(v) {
    return s() ? (y.add(v), b ?? (b = new Promise((R) => setTimeout(() => R(S()), Ru)))) : $(v);
  }
  async function S() {
    const v = new Set(y);
    y.clear(), b = null;
    const R = N, T = await t({ ids: [...v].join(","), limit: v.size });
    if (R !== N) return;
    if (!T.ok) return q();
    const L = new Map(T.value.rows.map((P) => [P.id, P]));
    o.value = o.value.flatMap((P) => v.has(P.id) ? L.has(P.id) ? [L.get(P.id)] : [] : [P]);
  }
  async function $(v) {
    const R = N, T = await t({ "before-id": v + 1, limit: 1 });
    if (R !== N) return;
    if (!T.ok) return q();
    const L = T.value.rows.find((P) => P.id === v);
    o.value = L ? o.value.map((P) => P.id === v ? L : P) : o.value.filter((P) => P.id !== v);
  }
  async function I(v) {
    if (a() && String((v == null ? void 0 : v.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((z) => z.id !== v.row_id));
    if (a() && (v != null && v.row_id) && !String(v.event ?? "").endsWith(".create") && o.value.some((z) => z.id === v.row_id)) return O(v.row_id);
    if (!(a() && o.value.length && String((v == null ? void 0 : v.event) ?? "").endsWith(".create"))) return q();
    const T = Math.max(...o.value.map((z) => z.id)), L = N, P = await t({ "after-id": T });
    if (L !== N) return;
    if (!P.ok) return q();
    const J = new Set(o.value.map((z) => z.id));
    o.value = [...P.value.rows.filter((z) => !J.has(z.id)), ...o.value];
  }
  async function H() {
    if (!d.value || !o.value.length) return !1;
    const v = N, R = Math.min(...o.value.map((P) => P.id)), T = await t({ "before-id": R });
    if (v !== N) return !1;
    if (!T.ok || !T.value.rows.length) return d.value = !1;
    d.value = co(T.value, n());
    const L = new Set(o.value.map((P) => P.id));
    return o.value = [...o.value, ...T.value.rows.filter((P) => !L.has(P.id))], !0;
  }
  let N = 0;
  function E(v, R) {
    var P, J;
    const T = v.ok ? e.shared ? [v.value] : ((P = v.value) == null ? void 0 : P.rows) ?? [] : [];
    v.ok && (o.value = R(T)), l.value = v.ok ? v.value : null;
    const L = T.length ? Math.min(...T.map((z) => z.id)) : 0;
    v.ok && ((J = v.value) != null && J.rows) && !o.value.some((z) => z.id < L) && (d.value = !e.shared && co(v.value, n())), i.value = v.ok ? "" : v.error, Cs(c, () => r.value = !0);
  }
  async function V(v) {
    const R = ++N, T = await t({});
    R === N && E(T, v);
  }
  const W = (v) => {
    if (!a() || !v.length) return v;
    const R = Math.min(...v.map((L) => L.id)), T = Math.max(...v.map((L) => L.id));
    return [...o.value.filter((L) => L.id > T), ...v, ...o.value.filter((L) => L.id < R)];
  }, q = () => V(W), x = (v) => E(v, W), C = () => V((v) => v);
  async function k(v, R = null) {
    const T = await Iu(R && { target: o, fields: { value: R(o.value) } }, v, e.run);
    return h.value = T.ok ? "" : T.error, p.value = T.ok ? T.value : null, await q(), T;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: q, loadLatest: C, older: H, act: k, actionFailure: h, answer: p, context: e, heard: I, showFirst: x, pageSize: n };
}
const Bu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ns(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = Ue(), l = Bl(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Bu(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Lu = 2e3;
function Es(e, t, n = Lu) {
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
  }), Ke(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const Ll = typeof document < "u" && document.documentElement.classList.contains("phone"), Nl = 120;
var El;
const $a = globalThis[El = Symbol.for("journal.pressed")] ?? (globalThis[El] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Nu(e = 0) {
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
const ss = "journal.stale-build-reload", qu = 'script[type="module"][src*="/assets/index-"]', fo = (e) => {
  var t;
  return ((t = e.querySelector(qu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Du(e = document, t = (a, s) => Me.quietRead(a, s), n = () => ql(window)) {
  const a = fo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = fo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let xa = "";
function Pu(e, t = () => ql(window)) {
  if (!e) return !1;
  const n = !!xa && xa !== e;
  return xa = e, n && t(), n;
}
const ju = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Fu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ss) === e.message) return !1;
    t.setItem(ss, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Wu(e = window.sessionStorage) {
  try {
    e.removeItem(ss);
  } catch {
    return;
  }
}
const Hu = 2e3, zu = 3e4, Ge = zt({ starting: !1, external: !1, late: !1, offline: !1 }), As = () => Ge.starting, Uu = 3;
let Cn = 0, os = 0, Dl = 0, Pl = [];
async function Gu() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let ho = null;
const Vu = () => ho ?? (ho = Gu().finally(() => ho = null));
function Ku() {
  clearTimeout(os), clearTimeout(Dl), os = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), Pl.splice(0).forEach((e) => e()), Du();
}
async function Yu() {
  Ge.offline = !navigator.onLine;
  const e = await Vu();
  if (Ge.external = e.updating, Cn = !e.restarting && !e.updating && e.reachable ? Cn + 1 : 0, Cn < Uu) return;
  Cn = 0, (!Pu(e.started_at) || as()) && Ku();
}
function jl() {
  os = setTimeout(async () => {
    await Yu(), Ge.starting && jl();
  }, Hu);
}
function Qu() {
  Ge.starting || (Ge.starting = !0, Ge.offline = !navigator.onLine, jl(), Dl = setTimeout(() => Ge.late = !0, zu));
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
function Xu(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Ju {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Xu(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const ut = "viewer.shell", En = 2e4, Zu = 4, mo = "/api/read-lines", ec = 5e3, tc = 403, po = "/api/repeated-lines", nc = 10, ac = 2e3, sc = 3e5, bS = 6e5, An = 6, oc = 500, lc = "/journal/summary", vo = "/api/server-state", ic = 2e4, On = Ll ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, rc = (e) => e.split("?")[0].endsWith(lc), ls = (e, t) => Object.assign(new Error(t), { status: e });
async function uc(e, t, n = ls) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const cc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), dc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), go = (e) => e.split(" ").slice(0, 2).join(" "), nt = "read", Rt = "write", fc = "stream";
class hc {
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
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < ac));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < nc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(po, { method: "POST", headers: { ...On, "Content-Type": "application/json" }, body: i }, [{ window: ut, line: po, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Nu(n ? Nl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: dc(n.signal, s) } : n;
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
      throw o instanceof TypeError && Qu(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Zu ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(mo, { headers: On }, [{ window: ut, line: mo, kind: nt }], ec).then(async (t) => {
      if (t.status === tc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ls(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Ju(
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
    const i = a instanceof FormData, r = { method: t, headers: { ...On, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: cc(a) }, c = s || (i ? sc : En);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: ut, line: n, kind: nt }], c)) : await this.sent(n, r, [{ window: ut, line: n, kind: Rt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, oc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = An, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return uc(i, `${i.status} ${i.statusText}`).catch((r) => {
      throw r.blocked && t !== "GET" && this.refused(r.message), r;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: ut, line: t, kind: nt }], En)), !0);
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
    return t !== "GET" ? this.send(t, n, a, s, An, o).then((i) => (this.written(n), i)) : As() && !rc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ut, line: t, kind: fc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(vo, { cache: "no-store" }, [{ window: ut, line: vo, kind: nt }], ic);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ut, line: s = t, limit: o = En } = {}) {
    const l = (n.method ?? "GET") === "GET" ? nt : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Sa = Symbol.for("journal.transport"), Me = globalThis[Sa] ?? (globalThis[Sa] = new hc());
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
const mc = 50, pc = "refresh", vc = 1e3, gc = 3e4, yc = "requested", bc = "after_window", kc = 50, Tn = ".*", wc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function $c(e) {
  const t = {}, n = zt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function p(x) {
    const C = () => r[x] ?? r[`${x.slice(0, x.lastIndexOf("."))}.*`] ?? {}, k = _(void 0), v = Bl(e, async (R) => {
      const T = await O(x, R);
      return T.ok && !Object.keys(R).length && (k.value = T.value), T;
    }, () => C().page_size || kc, () => !!C().page_size, () => !!C().reads_ids);
    return t[x] = { ...v, data: k, readAt: 0 };
  }
  const y = new Proxy({}, { get: (x, C) => typeof C != "string" || C.startsWith("__v") ? void 0 : t[C] ?? p(C) }), b = (x) => (r[x].loading !== yc || x.endsWith(Tn)) && (!r[x].tab || r[x].tab === n.tab);
  function O(x, C = {}) {
    return new Promise((k) => {
      a.push({ name: x, flags: C, resolve: k }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const x = /* @__PURE__ */ new Map(), C = a.splice(0).filter((R) => {
      const T = JSON.stringify(R.flags);
      return x.has(R.name) || x.set(R.name, T), x.get(R.name) === T ? !0 : (a.push(R), !1);
    });
    a.length && setTimeout(S);
    const k = Object.fromEntries(C.flatMap(({ name: R, flags: T }) => Object.entries(T).map(([L, P]) => [`${R}.${L}`, P]))), v = await e.readKeys({ only: [...new Set(C.map(({ name: R }) => R))], state: { ...n, ...k } });
    C.forEach(({ name: R, resolve: T }) => T(v.ok ? v.value.keys[R] : v));
  }
  async function $(x) {
    var R;
    const C = ++d;
    (x.length ? x : Object.keys(r).filter((T) => !T.endsWith(Tn) && r[T].loading === "first" && b(T))).forEach((T) => l[T] = C);
    const v = await e.readKeys({ only: x, state: { ...n } });
    if (!v.ok) {
      if (v.failure === "cancelled") return !1;
      const T = (x.length ? x : Object.keys(t)).filter((P) => (l[P] ?? 0) <= C);
      T.forEach((P) => {
        y[P].readAt = Date.now(), v.failure === "unreachable" ? i.add(P) : i.delete(P), y[P].showFirst(v);
      });
      const L = v.failure === "unreachable" && ((R = e.waitForServer) == null ? void 0 : R.call(e));
      return L && L.then(() => {
        if (h) return;
        const P = T.filter((J) => l[J] === C);
        (P.length || !x.length && !T.length && d === C) && $(P);
      }), !1;
    }
    return W(v.value.declared), Object.entries(v.value.keys).forEach(([T, L]) => {
      (l[T] ?? 0) > C || (l[T] = C, y[T].readAt = Date.now(), i.delete(T), L.ok && (y[T].data.value = L.value), y[T].showFirst(L));
    }), !0;
  }
  function I(x) {
    const C = wc(x);
    return C.length ? (C.forEach((k) => o.names.add(k)), o.answer ?? (o.answer = new Promise((k) => setTimeout(() => {
      const v = [...o.names];
      o.names.clear(), o.answer = null, k($(v));
    })))) : $([]);
  }
  function H(x) {
    x.forEach((C) => s.add(C)), clearTimeout(c), c = setTimeout(() => {
      const C = [...s];
      s.clear(), C.length && $(C);
    }, mc);
  }
  const N = (x) => x.endsWith(Tn) ? Object.keys(t).filter((C) => C.startsWith(x.slice(0, -1)) && t[C].readAt) : [x], E = (x) => (r[x] ?? r[`${x.split(".")[0]}.*`]).reload_seconds;
  function V(x) {
    const C = Object.keys(r).filter((v) => x.event === pc || r[v].events.some((R) => Ts(R, x.event)));
    C.filter((v) => r[v].page_size).forEach((v) => y[v].heard(x));
    const k = C.filter((v) => !r[v].page_size);
    k.filter((v) => !b(v)).forEach((v) => y[v].readAt = 0), H(k.filter(b).flatMap(N));
  }
  function W(x) {
    if (Object.keys(r).length) return;
    r = x;
    const C = [...new Set(Object.values(x).flatMap((v) => v.events))];
    C.length && e.follow(C, V);
    const k = Object.keys(x).filter((v) => x[v].loading === bc);
    k.length && $(k);
  }
  ve(() => n.tab, () => {
    const x = Object.keys(r).filter((C) => !C.endsWith(Tn) && b(C) && !y[C].readAt);
    x.length && $(x);
  }), Ie(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const x = Date.now(), C = Object.keys(r).filter((k) => r[k].reload_seconds > 0 && b(k)).flatMap(N).filter((k) => x - y[k].readAt >= (i.has(k) ? Math.min(E(k) * 1e3, gc) : E(k) * 1e3));
    C.length && H(C);
  }
  return Es(q, () => e.visible.value, vc), queueMicrotask(() => $([])), { props: y, state: n, reload: I, readKey: O };
}
const xc = Symbol("open-view"), De = Symbol.for("journal.window-context"), Hl = Symbol("dock-card");
function Sc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = $c(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function Ue() {
  const e = Ce(De, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Sc(e);
}
const _c = (e, t) => e(Hl, t), kS = () => Ce(Hl), Mc = ["data-icon", "stroke-width", "innerHTML"], me = {
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
    }, null, 12, Mc));
  }
}, Cc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Ec = /* @__PURE__ */ U(Cc, [["__scopeId", "data-v-eb453d6f"]]), Ac = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ua(), a = M(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = _(!1), o = M(() => t.busy || s.value), l = Ce(De, null), i = M(() => o.value || t.disabled || !!(l != null && l.readOnly));
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
    return (c, d) => (u(), F(it(e.href ? "a" : "button"), qe(a.value, {
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
          e.icon ? (u(), F(me, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : w("", !0),
          fe(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), F(Ec, {
          key: 0,
          class: "btn-spinner"
        })) : w("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ U(Ac, [["__scopeId", "data-v-ededdadf"]]), Oc = ["aria-checked", "aria-haspopup", "onClick"], Tc = {
  key: 0,
  class: "segmented-dot"
}, Ic = {
  key: 1,
  class: "segmented-note"
}, Rc = {
  key: 2,
  class: "segmented-count"
}, Bc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = _s();
    return (s, o) => {
      const l = Yr("tip");
      return u(), f("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(D, null, ae(e.options, (i) => Ze((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", Tc)) : w("", !0),
          ne(" " + g(i.label) + " ", 1),
          i.note ? (u(), f("small", Ic, g(i.note), 1)) : w("", !0),
          i.count !== void 0 ? (u(), f("em", Rc, g(i.count), 1)) : w("", !0)
        ], 10, Oc)), [
          [l, i.tip || i.title, `${B(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, jt = /* @__PURE__ */ U(Bc, [["__scopeId", "data-v-c89bc92d"]]), Lc = {
  key: 0,
  class: "more-items"
}, Nc = {
  key: 0,
  role: "alert"
}, qc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", Lc, [
      e.failure ? (u(), f("p", Nc, g(e.failure), 1)) : w("", !0),
      e.more ? (u(), F(pe, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          ne(g(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : w("", !0)
    ])) : w("", !0);
  }
}, vn = /* @__PURE__ */ U(qc, [["__scopeId", "data-v-10464014"]]), Dc = { class: "link-group" }, Pc = {
  class: "group-label",
  "data-link-kind": ""
}, jc = ["disabled", "onClick"], Fc = { class: "title" }, Wc = { class: "relations" }, Hc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = M(() => s.value ? n.rows : n.rows.slice(0, 3)), l = M(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Dc, [
      m("div", Pc, g(l.value), 1),
      (u(!0), f(D, null, ae(o.value, (p) => (u(), f("button", qe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Fc, g(p.endpoint.title), 1),
        m("span", Wc, [
          ne(g(c(p)), 1),
          i(p) ? (u(), f(D, { key: 0 }, [
            ne(" · Unavailable")
          ], 64)) : w("", !0)
        ])
      ], 16, jc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : w("", !0)
    ]));
  }
}, zc = /* @__PURE__ */ U(Hc, [["__scopeId", "data-v-be6f079c"]]), Uc = ["data-loaded"], Gc = { class: "rows" }, Vc = ["disabled", "onClick"], Kc = { class: "title" }, Yc = { class: "relations" }, Qc = { key: 2 }, Xc = {
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
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (q) => p[q] || `${q.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())}s`, b = M(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((q, x) => q + x, 0) },
      ...Object.entries(o.value).filter(([q]) => !n.onlyKinds.length || n.onlyKinds.includes(q)).map(([q, x]) => ({ key: q, label: y(q), count: x }))
    ]), O = M(() => {
      const q = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((C) => C.endpoint.model))].map((C) => [C, s.value.filter((k) => k.endpoint.model === C).length])), x = { doc: 0, task: 1, message: 2 };
      return Object.entries(q).sort(([C], [k]) => (x[C] ?? 3) - (x[k] ?? 3)).map(([C, k]) => ({ model: C, count: k, rows: s.value.filter((v) => v.endpoint.model === C) }));
    }), S = (q) => q.endpoint.unavailable || !q.endpoint.open_ref, $ = (q) => ({ [n.linkAttribute]: !0, "data-link-model": q.endpoint.model, "data-link-id": q.endpoint.id }), I = (q) => `${q.endpoint.model === "doc" && q.endpoint.id === n.documentId ? "Design document" : q.endpoint.model.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())} ${q.endpoint.id}, ${q.relations.map((x) => x.replaceAll("_", " ")).join(", ")}`;
    async function H(q = 1) {
      const x = ++h;
      c.value = !0, d.value = "";
      const C = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(q), "--page-size", String(n.pageSize)];
      n.outsidePlan && C.push("--outside-plan"), n.documentId && C.push("--first-counterpart", `doc:${n.documentId}`), i.value && C.push("--kind", i.value);
      try {
        const k = await n.read(C);
        if (x !== h) return;
        if (!k.ok) {
          d.value = k.error;
          return;
        }
        const v = k.value.counterparts ?? [], R = q === 1 ? v : [...s.value, ...v];
        s.value = [...new Map(R.map((T) => [`${T.endpoint.model}:${T.endpoint.id}`, T])).values()], o.value = k.value.kinds ?? {}, l.value = k.value.total, r.value = k.value.next_page ?? null;
      } catch (k) {
        x === h && (d.value = k.message);
      } finally {
        x === h && (c.value = !1);
      }
    }
    function N(q) {
      if (S(q)) return;
      const [x, C] = q.endpoint.open_ref.split(":");
      a("open", { table: x, id: Number(C) });
    }
    function E(q) {
      i.value = q, H();
    }
    const V = () => !c.value && r.value && H(r.value), W = M(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
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
      m("div", Gc, [
        e.grouped ? (u(!0), f(D, { key: 0 }, ae(O.value, (C) => (u(), F(zc, {
          key: C.model,
          model: C.model,
          count: C.count,
          rows: C.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: N
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(D, { key: 1 }, ae(s.value, (C) => (u(), f("button", qe({
          key: `${C.endpoint.model}:${C.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, $(C), {
          disabled: S(C),
          onClick: (k) => N(C)
        }), [
          m("span", Kc, g(C.endpoint.title), 1),
          m("span", Yc, [
            ne(g(I(C)), 1),
            S(C) ? (u(), f(D, { key: 0 }, [
              ne(" · Unavailable")
            ], 64)) : w("", !0)
          ])
        ], 16, Vc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Qc, g(e.empty), 1)) : w("", !0),
        A(vn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: W.value,
          onMore: V
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Uc)) : w("", !0);
  }
}, Jc = /* @__PURE__ */ U(Xc, [["__scopeId", "data-v-29b9c31b"]]), Zc = (e, t, n) => Math.max(t, Math.min(n, e)), ed = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, zl = /* @__PURE__ */ new WeakMap(), td = (e, t) => zl.set(e, t);
function nd(e, t) {
  for (let n = t; n; n = zl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ul(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !nd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const Tt = 8, ad = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = _(null), o = (v) => v ? `${v}px` : void 0, l = M(() => ({
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
      const R = h(a.anchor), T = y(R, v);
      return i.value.w <= T.across && i.value.h <= Math.max(T.below, T.above) ? R : c();
    }
    const O = M(() => {
      if (!r.value) return l.value;
      const v = r.value, R = b(v), T = y(R, v), { w: L, h: P } = i.value, J = a.align === "auto" ? v.left + v.right > R.left + R.right : a.align === "right", z = Zc(J ? v.right - L : v.left, R.left + Tt, Math.max(R.left + Tt, R.right - L - Tt)), oe = P > T.below && T.above > T.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: p(a.maxHeight, T.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: p(a.maxHeight, T.below) };
      return { ...l.value, ...oe, left: `${z}px`, maxWidth: p(a.maxWidth, T.across) };
    }), S = n, $ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function I(v) {
      const R = $(), T = R.indexOf(document.activeElement);
      R[(T + v + R.length) % R.length].focus();
    }
    const H = { ArrowDown: () => I(1), ArrowUp: () => I(-1), Escape: () => S("close") }, N = (v) => H[v.key] && (v.preventDefault(), H[v.key]()), E = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let V = 0;
    const W = new ResizeObserver(() => {
      cancelAnimationFrame(V), V = requestAnimationFrame(E);
    });
    Ul(s, (v) => a.anchor && !a.anchor.contains(v.target) && S("close"));
    const q = (v, R) => ["top", "left", "right", "bottom"].some((T) => Math.abs(v[T] - R[T]) > 1), x = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let C = 0;
    function k() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(v)) return S("close");
        q(v, r.value) && (r.value = v);
      }
      C = requestAnimationFrame(k);
    }
    return Se(() => {
      a.anchor && s.value && td(s.value, a.anchor), E(), s.value && W.observe(s.value), !a.plain && $()[0] && $()[0].focus(), k();
    }), Ie(() => {
      W.disconnect(), cancelAnimationFrame(C), cancelAnimationFrame(V);
    }), t({ element: s }), (v, R) => (u(), F(ca, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", qe({
        ref_key: "panel",
        ref: s
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: N
      }), [
        fe(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Is = /* @__PURE__ */ U(ad, [["__scopeId", "data-v-3d203970"]]), sd = { class: "split-button" }, od = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = _(null), s = _(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", sd, [
      A(pe, {
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
        A(pe, {
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
            A(me, { name: "caret" })
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
          fe(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : w("", !0)
    ]));
  }
}, ld = /* @__PURE__ */ U(od, [["__scopeId", "data-v-c258494d"]]), id = 0, rd = "/api/lines", ud = "/api/line", yo = 5e3, bo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), ko = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), _a = (e) => JSON.stringify(e.line), wo = () => new DOMException("cancelled", "AbortError");
class cd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(_a(t))) {
        Me.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), id));
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
      const o = await Me.sent(rd, bo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => ko(i.body, nt)), yo);
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
    await this.alone(t, nt), Date.now() - n < yo ? this.slow.delete(_a(t.body)) : this.slow.add(_a(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(ud, bo(t.body, t.signal), [ko(t.body, n)], n === nt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Gl = new cd(), dd = "/api/window";
function fd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${dd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: nt }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const Vl = /* @__PURE__ */ new Map();
class hd {
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
function wS(e, t) {
  const n = new hd(e, t);
  return Vl.set(e, n), n.load().catch(() => {
  }), n;
}
const Rs = (e) => Vl.get(e);
function md(e, t, n) {
  const a = Rs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function pd(e, t) {
  if (!e) return !0;
  const n = Rs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Yn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Kl = {};
async function $S(e = (t) => Me.raw(t)) {
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
}, vd = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, gd = Symbol("pane-page"), Ls = Symbol("inspector-host"), Ql = { 1: "refused", 2: "usage", 3: "fault" }, yd = 100, bd = 50, kd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, wd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function $d({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = _({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: O = {}, search: S = {}, readOnly: $ = !1, shared: I = null }) {
  const H = /* @__PURE__ */ new Map(), N = new AbortController(), E = _(!1), V = performance.now();
  let W = 0, q = 0, x = () => {
  };
  const C = new Promise((P) => x = P);
  N.signal.addEventListener("abort", x, { once: !0 });
  const k = () => {
    clearTimeout(q), q = setTimeout(() => {
      W === 0 && Cs(V, () => {
        E.value = !0, x();
      });
    }, bd);
  }, v = (P, J) => (W += 1, Lt(e, P, t, N.signal, J).finally(() => {
    W -= 1, k();
  })), R = (P, J) => (k(), C.then(() => N.signal.aborted ? lt : Lt(e, P, t, N.signal, J))), T = ({ only: P = [], state: J = {} } = {}) => (W += 1, Sd(() => fd(e, t, P, J, N.signal), N.signal).finally(() => {
    W -= 1, k();
  })), L = (P, { unbatched: J = !1, deferred: z = !1 } = {}) => {
    const se = H.get(P);
    if (se && performance.now() - se.at < yd) return se.answer;
    const oe = z && !E.value ? R(P, J) : v(P, J);
    return H.set(P, { answer: oe, at: performance.now() }), oe;
  };
  return {
    answered: E,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: M(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: O,
    search: S,
    readOnly: $,
    shared: I,
    read: L,
    readKeys: T,
    waitForServer: () => As() ? Fl() : null,
    run: (P) => Lt(e, P, t, N.signal),
    upload: (P) => Md(P, e, N.signal),
    cancel: () => N.abort(),
    signal: N.signal,
    subscriptions: l,
    follow: (P, J) => l.follow(e, [P].flat().filter((z) => o.some((se) => Ts(se, z))), (z) => {
      H.clear(), J(z);
    }, a),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (P) => M(() => {
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
const lt = { ok: !1, failure: "cancelled", error: "" }, Ns = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Jl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? lt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Ql[n.code] || "fault", error: Xl(n.error) };
  } catch {
    return t != null && t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
const xd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Ql[e.code] || "fault", error: Xl(e.error) };
async function Sd(e, t) {
  try {
    const n = await e();
    return t.aborted ? lt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, xd(s)])) } };
  } catch {
    return t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
async function Zl(e, t, n) {
  const a = await Jl(() => Gl.read(e, t, n), t);
  return a.failure !== "unreachable" || !As() ? a : (await Fl(), t.aborted ? lt : Zl(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => _d(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : qs(t)));
}
async function _d(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : qs(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, i) => Zl({ ...o, attribution: i }, l, s), a, o).catch(() => lt) : Jl(() => Gl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Md(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? lt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
function qs(e) {
  return [...e.matchAll(kd)].map(([t]) => t.replace(wd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Cd = (e) => `show-${e}`, xS = (e, t, n) => e.filter((a) => {
  var s;
  return n(Cd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ei = "messages.chat", Ed = {
  key: 0,
  class: "template-brief"
}, Ad = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Od = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = M(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = M(() => s.value.find((c) => String(c.id) === n.value));
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
      A(jt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (u(), f("p", Ed, g(i.value.brief), 1)) : w("", !0),
      o.value ? (u(), f("p", Ad, g(o.value), 1)) : w("", !0)
    ], 64));
  }
}, Td = /* @__PURE__ */ U(Od, [["__scopeId", "data-v-14be8a5c"]]), Id = { class: "info-tip" }, Rd = ["aria-label"], Bd = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Ld = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (u(), f("span", Id, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(me, {
          name: "info",
          size: 13
        })
      ], 8, Rd),
      m("span", Bd, [
        (u(!0), f(D, null, ae(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, g(a), 1))), 128))
      ])
    ]));
  }
}, ti = /* @__PURE__ */ U(Ld, [["__scopeId", "data-v-a2fe5ff1"]]), Nd = { class: "form-field" }, qd = { class: "form-field-head" }, Dd = ["for"], Pd = {
  key: 1,
  class: "form-field-aside"
}, jd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Nd, [
      m("div", qd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, g(e.label), 9, Dd),
        e.help ? (u(), F(ti, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : w("", !0),
        t.$slots.aside ? (u(), f("span", Pd, [
          fe(t.$slots, "aside", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Fd = /* @__PURE__ */ U(jd, [["__scopeId", "data-v-302c40bf"]]), is = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Wd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ua(), n = M(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ze((u(), f("textarea", qe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [B(is), B(t).value]
    ]);
  }
}), Hd = /* @__PURE__ */ U(Wd, [["__scopeId", "data-v-e130a5b9"]]), zd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _s(), o = M(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), F(Fd, {
      label: e.field.label,
      for: B(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        A(Gt, { value: o.value }, {
          choice: j(() => [
            A(jt, {
              id: B(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (r) => a("pick", r))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            A(Td, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (r) => a("pick", r))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            A(Hd, {
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
        A(me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Ud(e, t, n, a = () => window) {
  Se(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ie(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Gd = (e, t = () => !0) => Ud("keydown", (n) => n.key === "Escape" && t() && e());
function ni(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = _(!1), s = M(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Gd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Vd = 80, It = zt([]);
function ai(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return ve(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Ie(n), M(() => Vd + Math.max(0, It.indexOf(t)));
}
let si = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return si = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Kd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Yd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Kd)];
    if (!l.length) return o.preventDefault();
    const [i, r] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), r.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === r && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Se(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : si, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Qd = ["aria-modal", "aria-label", "aria-labelledby"], Xd = {
  key: 0,
  class: "dialog-head"
}, Jd = ["id", "tabindex"], Zd = {
  key: 1,
  class: "dialog-foot"
}, ef = 500, tf = 400, nf = {
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
    n.modal && Yd(c, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, tf);
    }
    function O(I) {
      !n.modal || Date.now() - y >= ef || ![" ", "Enter"].includes(I.key) || (I.preventDefault(), I.stopPropagation());
    }
    const S = () => r.value && (r.value.scrollTop = r.value.scrollHeight), $ = new MutationObserver(S);
    return ve(r, (I) => {
      $.disconnect(), I && n.follow && ($.observe(I, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Ie(() => $.disconnect()), (I, H) => (u(), F(ca, { to: "body" }, [
      A(Ut, {
        name: "dialog",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: j(() => [
          B(s) ? (u(), f("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: B(i) }),
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
              onKeydownCapture: O
            }, [
              e.bare ? w("", !0) : (u(), f("header", Xd, [
                m("h3", {
                  id: B(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, g(e.title), 9, Jd),
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
                fe(I.$slots, "default", {}, void 0, !0)
              ], 2),
              I.$slots.foot ? (u(), f("footer", Zd, [
                fe(I.$slots, "foot", {}, void 0, !0)
              ])) : w("", !0)
            ], 42, Qd)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ha = /* @__PURE__ */ U(nf, [["__scopeId", "data-v-6d1ecd98"]]), af = {
  class: "action-output",
  "data-action-output": ""
}, sf = {
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
        m("pre", af, g(e.text), 1)
      ]),
      _: 1
    }));
  }
}, of = /* @__PURE__ */ U(sf, [["__scopeId", "data-v-423a045c"]]);
function lf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Qr(of, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const rf = (e, t, n = {}) => qs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function gn(e, t, n, a = {}) {
  var s;
  try {
    if (!await pd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(ei, rf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && lf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const uf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ma = [
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
}), ma = {
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
    filters: Ma
  }),
  tasks: ke("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ma
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
  pins: ke("Pin", "band", "One line pinned to the chat while it matters", { filters: Ma }),
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
}, cf = ["secrets", "plugins"], oi = Object.keys(ma).filter((e) => !(Ll && cf.includes(e)));
M(() => oi.map((e) => ({ name: e, ...ma[e] })));
const Vt = (e) => ma[e], li = new Map(oi.flatMap((e) => [e, e.replace(/s$/, ""), ma[e].title.toLowerCase()].map((t) => [t, e]))), mt = (e) => li.get(String(e).toLowerCase()) || "", ii = [...li.keys()].sort((e, t) => t.length - e.length).join("|"), df = {
  class: "button-form",
  "data-button-form": ""
}, ff = {
  key: 0,
  class: "button-form-title"
}, hf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, mf = { class: "button-form-actions" }, pf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = _(!1), l = _(""), i = M(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = M(() => {
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
          m("div", df, [
            (p = e.row) != null && p.title ? (u(), f("p", ff, g(e.row.title), 1)) : w("", !0),
            (u(!0), f(D, null, ae(e.button.fields, (y) => (u(), F(zd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", hf, g(l.value), 1)) : w("", !0),
            m("div", mf, [
              A(pe, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: j(() => [...h[2] || (h[2] = [
                  ne("Cancel", -1)
                ])]),
                _: 1
              }),
              A(pe, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: j(() => [...h[3] || (h[3] = [
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
}, vf = /* @__PURE__ */ U(pf, [["__scopeId", "data-v-f26c27a7"]]), gf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, yf = {
  key: 1,
  class: "menu-item-text"
}, bf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", gf, g(e.checked ? "✓" : ""), 1)) : w("", !0),
      e.description ? (u(), f("span", yf, [
        m("span", null, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, g(e.description), 1)
      ])) : fe(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ft = /* @__PURE__ */ U(bf, [["__scopeId", "data-v-fec99974"]]), kf = ["aria-busy"], wf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, $f = { class: "button-slot-confirm-text" }, xf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Sf = {
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
        var $;
        return !n.readOnly && (($ = s.value) == null ? void 0 : $.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = M(() => {
      var $;
      return !n.readOnly && (($ = s.value) == null ? void 0 : $.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = M(() => n.readOnly ? [] : md(n.environment, n.name, n.row)), c = _(null), d = _(null), h = _(""), p = _(!1), y = ($) => [$.from ? `From ${$.from}` : "", $.tip, $.warning].filter(Boolean).join(" · "), b = ($) => $.icon || ($.warning ? "dot" : "");
    function O($) {
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
        A(pe, {
          small: "",
          onClick: i
        }, {
          default: j(() => [...I[4] || (I[4] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", wf, [
        m("span", $f, g(d.value.confirm), 1),
        A(pe, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: Y({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: I[0] || (I[0] = (H) => S(d.value))
        }, {
          default: j(() => [
            ne(g(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(pe, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: I[1] || (I[1] = (H) => d.value = null)
        }, {
          default: j(() => [...I[6] || (I[6] = [
            ne("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? w("", !0) : (u(), f(D, { key: 2 }, [
        (u(!0), f(D, null, ae(r.value, (H) => (u(), f(D, {
          key: H.name
        }, [
          H.menu.length ? (u(), F(ld, {
            key: 0,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": H.menu_label || "More ways",
            title: y(H),
            "data-button": H.name,
            onMain: (N) => O(H)
          }, {
            menu: j(({ close: N }) => [
              (u(!0), f(D, null, ae(H.menu, (E) => (u(), F(Ft, {
                key: E.label,
                description: E.description,
                onClick: (V) => (N(), O({ ...H, ...E, menu: [] }))
              }, {
                default: j(() => [
                  ne(g(E.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              ne(g(H.label) + " ", 1)
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
            onClick: (N) => O(H)
          }, {
            default: j(() => [
              ne(g(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", xf, g(h.value), 1)) : w("", !0),
        c.value && !e.readOnly ? (u(), F(vf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: I[2] || (I[2] = (H) => c.value = null),
          onDone: I[3] || (I[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : w("", !0)
      ], 64))
    ], 10, kf));
  }
}, Ds = /* @__PURE__ */ U(Sf, [["__scopeId", "data-v-a4b6f174"]]), _f = {
  class: "running",
  "data-running-command": ""
}, Mf = ["title"], Cf = {
  key: "idle",
  class: "running-idle"
}, Ef = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", _f, [
      A(Ut, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, g(e.text), 9, Mf)) : (u(), f("span", Cf, g(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, SS = /* @__PURE__ */ U(Ef, [["__scopeId", "data-v-d3240219"]]), Af = ["aria-checked", "aria-label", "title"], Of = {
  key: 0,
  class: "switch-inner"
}, Tf = {
  key: 0,
  class: "switch-word"
}, If = {
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
        e.labelled ? (u(), f("span", Of, g(e.word), 1)) : w("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", Tf, g(e.word), 1)) : w("", !0)
    ], 10, Af));
  }
}, _S = /* @__PURE__ */ U(If, [["__scopeId", "data-v-1bfb90f3"]]);
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
function Rf(e, t) {
  return ri(() => sessionStorage, e, t);
}
function Bf(e, t) {
  return ui(() => sessionStorage, e, t);
}
const Xn = "journal.environment", di = _(Rf(Xn, Qn(Xn, "")));
function Lf(e) {
  di.value = e, Bf(Xn, e), Ps(Xn, e);
}
const Jn = _(location.hash), $o = Je(null), xo = { integrations: "mcp", library: "team" };
function Nf() {
  if (!$o.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (xo[n]) {
    location.replace(`#/${[xo[n], ...a].join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash;
    return;
  }
  !n || $o.value(n) || (Lf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jn.value = location.hash, Nf();
});
const rs = M(() => {
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
function qf(e = "", t = 0, n = "") {
  location.hash = js.page(e, t, n);
}
function Df(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Pf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function fi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Pf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function MS(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function gt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = rs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  fi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function jf(e, t, n, a = 0, s = "") {
  if (e === rs.value.env) return gt(t, n, a, s);
  const o = rs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  fi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? jf(a, s, Number(o), 0, t) : gt(s, Number(o), 0, t);
}
function Ff(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = Ff(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function CS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Wf = { class: "inspector-part" }, Hf = { class: "inspector-part-title" }, zf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", Wf, [
      m("h4", Hf, g(e.title), 1),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ES = /* @__PURE__ */ U(zf, [["__scopeId", "data-v-5175e4a3"]]), So = /* @__PURE__ */ new Map(), Uf = {
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
    return Se(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ie(() => i.disconnect()), (r, c) => (u(), f(D, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ye(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (d) => o(!0))
      }, [
        fe(r.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = xe((d) => o(!s.value), ["stop"]))
      }, g(s.value ? "Show less" : "Show more"), 1)) : w("", !0)
    ], 64));
  }
}, hi = /* @__PURE__ */ U(Uf, [["__scopeId", "data-v-4d2235ba"]]), Gf = ["aria-valuenow", "aria-valuemax"], Vf = {
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
    ], 10, Gf));
  }
}, mi = /* @__PURE__ */ U(Vf, [["__scopeId", "data-v-9eba6a85"]]), Kf = { processes: "process", memories: "memory", replies: "reply" }, Zn = (e) => (Kf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), us = [], Yf = 2e3, dt = /* @__PURE__ */ new Map(), Qf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Xf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? us.unshift(e) : us.push(e), dt.clear();
}
function pi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Jf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Zf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ot(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function eh(e, t) {
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
function rn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return th(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function th(e) {
  return e.split(Xf).map((t, n) => n % 2 ? t : t.replace(Qf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function _o(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const nh = 24;
function ah(e) {
  const [t, , ...n] = e, a = _o(t), s = n.map(_o), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > nh) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${rn(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${rn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const vi = /^\s*(?:[-*+]|\d+[.)])\s+/, cs = /^\s*(\d+)[.)]\s/, Mo = (e) => e.match(/^\s*/)[0].length;
function gi(e) {
  const t = e[0].match(cs), n = Mo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Mo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${rn(o.text)}${o.nested.length ? gi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function sh(e, t) {
  const n = cs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (vi.test(e[s]) && cs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Co = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function yi(e) {
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
      n.push(ah(t.slice(a, i))), a = i;
      continue;
    }
    if (vi.test(s)) {
      const i = sh(t, a);
      n.push(gi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${yi(
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
const oh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, lh = (e) => e.type !== "text" && !oh.test(e.html);
function ih(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(yi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : lh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Fs(e, t = { env: "" }) {
  const n = Zf(e, t), a = dt.get(n);
  if (dt.delete(n), a && a.source === t.source && a.reads.every((l) => Jf(l, t)))
    return dt.set(n, a), a.html;
  const s = [], o = ih(eh(e, { ...t, reads: s }));
  return dt.set(n, { html: o, reads: s, source: t.source }), dt.size > Yf && dt.delete(dt.keys().next().value), o;
}
const Ca = /* @__PURE__ */ new WeakMap();
function rh(e) {
  if (Ca.has(e)) return Ca.get(e);
  const t = Xr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
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
function bi() {
  const e = Ce(De, null), t = e ? rh(e) : null;
  return (n, a = {}) => Fs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const ki = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, yn = (e) => String(e || "").replace(ki, (t, n, a, s) => s), uh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), In = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, ch = /^Traceback \(most recent call last\):/m, dh = 8;
function wi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, dh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function fh(e) {
  const t = [...e.matchAll(uh)].map((a) => a.index);
  if (In.lastIndex = 0, !t.length || !In.test(e)) return null;
  In.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(In)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: wi(n), tail: "" } : null;
}
function hh(e) {
  const t = ch.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: wi([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = yn(e), n = hh(t) || fh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ea = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, $i = (e) => `${e.table}:${e.id}`, Eo = (e) => (e || "").split(`
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
}, mh = (e) => (Oo[e.table] ? Oo[e.table](e) : e.title || "") || "", Ct = (e) => ea(e.created_at), ph = (e) => ea(e.updated_at) || Ct(e), vh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, gh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function yh(e) {
  const t = vh.exec(e);
  if (t && mt(t[1])) return { at: t.index, length: t[0].length, table: mt(t[1]), id: Number(t[2]), label: t[3] };
  const n = gh.exec(e), a = n && mt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function bh(e, t, n, a) {
  const s = pi(a, e, t), o = yn(s ? mh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ot(Vt(e).title)} ${t}</span><span class="row-card-title">${ot(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = yh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: bh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const kh = /\.(png|jpe?g|gif|webp|svg)$/i, wh = (e) => kh.test(e), $h = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, xh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Sh(e, t) {
  const n = $h.exec(e), [, a, s, o, l, i] = n || [], r = n && mt(a || o), c = r && pi(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Vt(r).title} ${c.id} · ${ot(i)}`, p = wh(i) ? `<img class="file-card-image" src="${d}" alt="${ot(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${ot(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function _h(e) {
  const t = xh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ot(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = Sh(e, t) || _h(e);
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
const To = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${js.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(ki, (n, a, s, o) => To[a] ? To[a](s, o, t) : o)
);
const Ch = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, xi = new RegExp(`\\b(${ii}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Si = new RegExp(`\\b(${ii}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Eh = new RegExp(`<code>((?:${xi.source}|${Si.source}))</code>`, "gi"), Ah = (e) => e.replace(Eh, "$1"), Oh = (e, t) => `<a class="row-pill" href="#" data-peek="${mt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Th = (e) => e.replace(Si, (t, n, a) => a.replace(/\d+/g, (s) => Oh(n.replace(/s$/i, ""), s))), Ih = (e) => Th(e).replace(
  xi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${mt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Ah(e).split(Ch).map((n, a) => a % 2 ? n : Ih(n)).join("")
);
const Rh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Bh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Lh = /[\w\]]\(/, Nh = /^[\w$.[\]'"]+\s*=\s*[^=]/, qh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Dh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Ph = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, jh = /[[({,]$/, Fh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Wh = /^(\t|\s{2,})\S/, Hh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, zh = /`[^`]+`/, Uh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Gh = /[{}()[\];=<>$&|*\\@+^~%]/g, _i = /^\s*(?:[-*+]|\d+[.)])\s/, Vh = /^\s*>/, Kh = /^\s*\|/, Yh = 0.6, Qh = 0.4, Xh = 5, Jh = 0.03, Mi = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Xh && t.every((n) => Uh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Gh) ?? []).length / e.length < Jh;
}, Aa = (e) => {
  const t = e.trim();
  return zh.test(t) ? !1 : [Rh, Bh, Lh, Nh, qh, Dh, Ph, jh, Fh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Wh.test(e) && !_i.test(e) && !Mi(e);
};
function Zh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || _i.test(t[0]) || t.every((o) => Vh.test(o) || Kh.test(o))) return "text";
  const n = t.filter((o) => !Hh.test(o.trim()));
  if (t.length === 1) return !n.length || Aa(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Aa).length, s = n.filter((o) => !Aa(o) && Mi(o)).length;
  return a >= n.length * Yh && s <= n.length * Qh ? "code" : "text";
}
const ds = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", em = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", tm = `${ds} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, nm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", am = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Io = {
  js: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: em, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: tm, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: nm, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: am, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, sm = {
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
function om(e, t) {
  const n = Io[sm[t] ?? t] || Io.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function lm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of om(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ot(l) : `<span class="tok-${a}">${ot(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function im(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const rm = 1500, Bo = /* @__PURE__ */ new WeakMap();
async function um(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await im(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Bo.get(t)), Bo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, rm)
  )));
}
typeof document < "u" && document.addEventListener("click", um, !0);
const cm = /\n\s*\n/, dm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, fm = /^\s*(`{3,}|~{3,})\s*$/, hm = /^\s{4,}\S/, mm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, fs = /^\s*(?:[-*+]|\d+[.)])\s/, Ci = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, pm = [
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
function vm(e) {
  const t = Ws(e.join(`
`));
  return (pm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const gm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ci.test(t) && !fs.test(t);
}, ym = (e, t) => fs.test(t) || fs.test([...e].reverse().find((n) => n.trim()) || "");
function Hs(e, t) {
  const n = t || vm(e), a = lm(Ws(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function bm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && fm.test(s));
  return a < 0 ? e.length : a;
}
function km(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Hs(a.map(yn), n ? n.toLowerCase() : "");
}
function wm(e) {
  const t = e.split(cm).map((l) => ({ paragraph: l, type: Zh(Ws(l).split(`
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
function $m(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : wm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(dm);
    if (i) {
      const c = bm(n, l, i[2]);
      o(), a.push(km(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const r = gm(s) ? mm : hm;
    if (!t && r.test(n[l]) && !ym(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Ci.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
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
Et((e, t) => $m(e, t.document), { first: !0 });
const xm = ["innerHTML"], Sm = ["innerHTML"], _m = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = bi(), a = M(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => B(Nt) && B(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, xm)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => B(Nt) && B(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, Sm));
  }
}, at = /* @__PURE__ */ U(_m, [["__scopeId", "data-v-d8e75741"]]), Lo = (e) => [...new Set(e.agents.map((t) => t.name))], Mm = (e) => Lo(e).length === 1 ? `Worker: ${Lo(e)[0]}` : "Delegated", Cm = ["aria-expanded"], Em = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Am = {
  key: 0,
  class: "tip-failure"
}, Om = { key: 1 }, Tm = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Ce(De, null), a = M(() => vd(t.type, t.state)), s = _(!1), o = _([]), l = _("");
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
      ne(g(B(ln)(e.type, e.state)) + " ", 1),
      s.value ? (u(), f("span", Em, [
        l.value ? (u(), f("span", Am, g(l.value), 1)) : w("", !0),
        (u(!0), f(D, null, ae(o.value, (p, y) => (u(), f("span", {
          key: y,
          class: "tip-line"
        }, g(p), 1))), 128))
      ])) : w("", !0)
    ], 40, Cm)) : (u(), f("span", Om, g(B(ln)(e.type, e.state)), 1));
  }
}, Im = /* @__PURE__ */ U(Tm, [["__scopeId", "data-v-73ac4596"]]), Rm = {
  class: "plan-details",
  "data-plan-details": ""
}, Bm = { class: "state-line" }, Lm = {
  key: 0,
  class: "phase-count"
}, Nm = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, qm = { class: "text" }, Dm = {
  key: 1,
  class: "part",
  "data-plan-progress": ""
}, Pm = { class: "overall" }, jm = { class: "overall-figure" }, Fm = {
  key: 2,
  class: "delegation",
  "data-plan-assignee": ""
}, Wm = {
  key: 3,
  class: "delegation",
  "data-plan-delegated": ""
}, Hm = {
  key: 4,
  class: "part"
}, zm = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => (u(), f("div", Rm, [
      m("div", Bm, [
        A(Im, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: Y(["status", B(Yl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Lm, "Phase " + g(e.plan.current_phase) + " of " + g(e.plan.phases.length), 1)) : w("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Nm, [
        m("h4", null, g(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", qm, g(e.plan.reason), 1)
      ])) : w("", !0),
      e.plan.total ? (u(), f("section", Dm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Pm, [
          A(mi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", jm, g(e.plan.finished) + " of " + g(e.plan.total) + " done", 1)
        ])
      ])) : w("", !0),
      e.plan.assignee ? (u(), f("p", Fm, "Agent: " + g(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), f("p", Wm, g(B(Mm)(e.plan)), 1)) : w("", !0),
      e.plan.brief ? (u(), f("section", Hm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        A(hi, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: j(() => [
            A(at, {
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
}, AS = /* @__PURE__ */ U(zm, [["__scopeId", "data-v-c37da567"]]), Um = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Gm = { ...Um, done: "Completed" }, Vm = /* @__PURE__ */ new Set(["completed", "cancelled"]), Km = (e) => Vm.has(e), un = (e) => Km(e) ? "done" : e, Ym = { class: "task-status-icon" }, Qm = ["width", "height", "aria-label"], Xm = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = M(() => Yl("task", un(t.status))), a = M(() => n.value === "testing" ? "started" : n.value), s = M(() => Gm[t.status] ?? ln("task", t.status));
    return (o, l) => (u(), f("span", Ym, [
      A(Ut, {
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
            A(Gt, { value: a.value }, {
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
          ], 10, Qm))
        ]),
        _: 1
      })
    ]));
  }
}, bn = /* @__PURE__ */ U(Xm, [["__scopeId", "data-v-ae24a63f"]]), Jm = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Zm = ["title", "onClick"], ep = { class: "agent-word" }, tp = {
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
    return (o, l) => s.value.length ? (u(), f("div", Jm, [
      (u(!0), f(D, null, ae(s.value, (i) => (u(), f("button", {
        key: i.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${i.name}`,
        "data-plan-phase-agent": "",
        onClick: (r) => B(Ne)(`agents:${i.id}`)
      }, [
        m("span", {
          class: Y(["agent-dot", { held: i.held }])
        }, null, 2),
        ne(" " + g(i.name) + " ", 1),
        m("span", ep, g(i.held ? "Working" : "Queued"), 1)
      ], 8, Zm))), 128))
    ])) : w("", !0);
  }
}, np = /* @__PURE__ */ U(tp, [["__scopeId", "data-v-0c589695"]]), ap = { class: "phases" }, sp = { class: "phead" }, op = { class: "mark" }, lp = { class: "ptitle" }, ip = { class: "phead-end" }, rp = {
  key: 0,
  class: "checkpoint"
}, up = { class: "progress" }, cp = {
  key: 0,
  class: "when"
}, dp = ["onClick"], fp = { class: "row-id" }, hp = { class: "row-title" }, mp = ["title"], pp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((i) => n.has(i.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, i) => (u(), f("ol", ap, [
      (u(!0), f(D, null, ae(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: Y(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", sp, [
          m("span", op, [
            A(me, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", lp, g(c + 1) + ". " + g(r.title), 1),
          m("span", ip, [
            r.checkpoint ? (u(), f("span", rp, "checkpoint")) : w("", !0),
            m("span", up, g(s(r)) + "/" + g(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", cp, g(r.goal), 1)) : w("", !0),
        A(np, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(D, null, ae(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: Y(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          A(bn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", fp, "#" + g(d.id), 1),
          m("span", hp, g(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, g(d.helper_name), 9, mp)) : w("", !0)
        ], 10, dp))), 128))
      ], 2))), 128))
    ]));
  }
}, OS = /* @__PURE__ */ U(pp, [["__scopeId", "data-v-6a600744"]]), vp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, gp = {
  key: 0,
  class: "empty",
  role: "alert"
}, yp = {
  key: 2,
  class: "empty"
}, bp = { class: "day" }, kp = { class: "events" }, wp = { class: "mark" }, $p = { class: "what" }, xp = { class: "head" }, Sp = { class: "word" }, _p = ["title", "onClick"], Mp = { class: "at" }, Cp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = _(null), l = _(""), i = M(() => {
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
    return ve(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", vp, [
      l.value ? (u(), f("p", gp, g(l.value), 1)) : o.value === null ? (u(), F(Ye, { key: 1 })) : o.value.length ? w("", !0) : (u(), f("p", yp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(D, null, ae(i.value, (p) => (u(), f(D, {
        key: p.day
      }, [
        m("h3", bp, g(p.day), 1),
        m("ol", kp, [
          (u(!0), f(D, null, ae(p.items, (y) => (u(), f("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", wp, [
              n[y.event_type].state ? (u(), F(bn, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (u(), F(me, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", $p, [
              m("div", xp, [
                m("span", Sp, g(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + g(y.task_id) + " " + g(y.title), 9, _p),
                m("span", Mp, g(r(y.time)), 1)
              ]),
              y.text ? (u(), F(at, {
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
}, TS = /* @__PURE__ */ U(Cp, [["__scopeId", "data-v-9e511133"]]);
function Ep(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function zs(e, t = Date.now()) {
  const n = Ep(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Ap = 36e5;
function Op(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Ap;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function No(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Ei(e) {
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
function Ai(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Oa(t % 60)}s` : `${Math.floor(t / 3600)}h ${Oa(Math.floor(t % 3600 / 60))}m ${Oa(t % 60)}s`;
}
const Tp = 1e3;
function Oi() {
  const e = _(Date.now()), t = setInterval(() => e.value = Date.now(), Tp);
  return Ke(() => clearInterval(t)), e;
}
const Ip = Symbol("resource-subscriptions");
function kn(e, t) {
  const n = Ce(Ip, () => new Wl(), !0), a = Os(t, 100), s = n.follow("resources", e, a);
  da(() => {
    s(), a.cancel();
  });
}
const Rp = "Not known", Bp = 80, Lp = 1e3, Np = "worker", qp = "main", Dp = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Ti = (e) => e.ok ? e.value.rows : [], Do = (e) => e.ok ? e.value.total : 0, Ii = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Pp = (e, t) => (t == null ? void 0 : t.given_name) || Ii((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), jp = (e, t) => e.ended_at ? "ended" : e.paused_at || Dp.has(t == null ? void 0 : t.state) ? "waiting" : "running", Fp = (e, t) => [(t == null ? void 0 : t.profile) && Ii(t.profile_title || t.profile), e.program, t == null ? void 0 : t.model, (t == null ? void 0 : t.effort) && `${t.effort} effort`].filter(Boolean), Ri = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Wp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Lp, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ai(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Bp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Rp : `$${t.cost_dollars.toFixed(2)}` }), e.role === Np && l.push({ key: "pace", label: "Tasks an hour", value: String(Op(Ri(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === qp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Hp(e) {
  const t = Ri(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function zp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", No(e.created_at)]), e.ended_at && n.push(["Ended", No(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const Up = { class: "band" }, Gp = { key: 0 }, Vp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", Up, [
      A(me, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      fe(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", Gp, g(e.count), 1)) : w("", !0)
    ]));
  }
}, Wt = /* @__PURE__ */ U(Vp, [["__scopeId", "data-v-1758914f"]]), Kp = { class: "number" }, Yp = { class: "text" }, Qp = 150, Xp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = _(!1), a = M(() => t.text.length > Qp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(D, null, [
      e.text ? (u(), f(D, { key: 0 }, [
        A(Wt, { icon: "file" }, {
          default: j(() => [
            ne(g(e.label), 1)
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
        A(Wt, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
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
            m("span", Kp, g(i.id), 1),
            m("span", Yp, [
              ne(g(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, g(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : w("", !0)
    ], 64));
  }
}, Jp = /* @__PURE__ */ U(Xp, [["__scopeId", "data-v-c99de22c"]]), Zp = ["aria-expanded"], e1 = { class: "count" }, t1 = {
  key: 0,
  "data-agent-fold-body": ""
}, n1 = {
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
        A(me, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        ne(g(e.label), 1),
        m("span", e1, g(e.count), 1),
        A(me, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Zp),
      t.value ? (u(), f("div", t1, [
        fe(n.$slots, "default", {}, void 0, !0)
      ])) : w("", !0)
    ], 64));
  }
}, Ta = /* @__PURE__ */ U(n1, [["__scopeId", "data-v-7f93d8d9"]]), a1 = ["onClick"], s1 = { class: "text" }, o1 = { class: "aside" }, l1 = {
  key: 0,
  class: "none"
}, i1 = {
  class: "skills",
  "data-agent-skills": ""
}, r1 = {
  key: 0,
  class: "none-inline"
}, u1 = { class: "label" }, c1 = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = zt({ helpers: !1, skills: !1 }), a = _([]), s = _([]), o = async (i) => Ti(await t.read(i));
    ve(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ve(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Yn(i.role)} ${i.id}`;
    return (i, r) => (u(), f(D, null, [
      A(Ta, {
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
            onClick: (d) => B(gt)("agents", c.id)
          }, [
            m("span", s1, g(l(c)), 1),
            m("span", o1, g(B(Yn)(c.role)) + " " + g(c.id), 1)
          ], 8, a1))), 128)),
          a.value.length ? w("", !0) : (u(), f("p", l1, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Ta, {
        open: n.skills,
        "onUpdate:open": r[1] || (r[1] = (c) => n.skills = c),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: j(() => [
          m("p", i1, [
            (u(!0), f(D, null, ae(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, g(c.skill), 1))), 128)),
            s.value.length ? w("", !0) : (u(), f("span", r1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Ta, {
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
            m("span", u1, g(c) + ":", 1),
            m("span", {
              class: Y(["value", h])
            }, g(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, d1 = /* @__PURE__ */ U(c1, [["__scopeId", "data-v-358a0300"]]), f1 = ["datetime", "title"], et = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Oi(), a = M(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, g(B(zs)(e.at, B(n))), 9, f1));
  }
}, h1 = {
  class: "now",
  "data-agent-now": ""
}, m1 = {
  key: 1,
  class: "muted"
}, p1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, v1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, g1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, y1 = { class: "line" }, b1 = { class: "detail" }, k1 = { class: "bar" }, w1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = M(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(D, null, [
      A(Wt, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          ne("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", h1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => B(gt)("tasks", e.inspection.task.id))
        }, "Task " + g(e.inspection.task.id) + ": " + g(e.inspection.task.title), 1)) : (u(), f("span", m1, g(e.nothing), 1)),
        n.value ? (u(), f("span", p1, g(n.value), 1)) : w("", !0),
        e.inspection.last_activity ? (u(), f("span", v1, [
          o[3] || (o[3] = ne("Last heard: ", -1)),
          A(et, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : w("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", g1, [
        m("div", y1, [
          m("span", null, "Plan " + g(e.inspection.plan.id) + ", phase " + g(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => B(gt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", b1, g(e.inspection.plan.done) + " of " + g(e.inspection.plan.total) + " tasks done", 1),
        m("div", k1, [
          m("i", {
            style: ye({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : w("", !0)
    ], 64));
  }
}, $1 = /* @__PURE__ */ U(w1, [["__scopeId", "data-v-cbe6a9f7"]]), x1 = ["onClick"], S1 = { class: "text" }, _1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, M1 = { class: "text" }, C1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, E1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(D, null, [
      A(Wt, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
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
          onClick: (s) => B(gt)(a.table, a.id)
        }, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", S1, g(a.text), 1),
          A(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, x1)) : (u(), f("div", _1, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", M1, g(a.text), 1),
          A(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? w("", !0) : (u(), f("p", C1, "Nothing yet."))
    ], 64));
  }
}, A1 = /* @__PURE__ */ U(E1, [["__scopeId", "data-v-58f0db57"]]), O1 = {
  class: "strip",
  "data-agent-strip": ""
}, T1 = ["data-agent-cell"], I1 = {
  key: 0,
  class: "meter"
}, R1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", O1, [
      (u(!0), f(D, null, ae(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, g(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, g(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", I1, [
          m("i", {
            class: Y({ high: a.high }),
            style: ye({ width: `${a.meter}%` })
          }, null, 6)
        ])) : w("", !0)
      ], 8, T1))), 128))
    ]));
  }
}, B1 = /* @__PURE__ */ U(R1, [["__scopeId", "data-v-b6657ab7"]]), L1 = ["disabled", "title"], N1 = { class: "gauge usage" }, q1 = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.windows[0] ?? null), o = M(() => s.value ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = M(() => o.value !== null && o.value >= 100), i = M(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), r = M(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, d) => o.value !== null ? (u(), f("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: r.value,
      onClick: d[0] || (d[0] = (h) => a("open", h.currentTarget))
    }, [
      A(me, {
        name: "allowance",
        size: 12
      }),
      d[1] || (d[1] = ne()),
      m("span", N1, [
        m("span", {
          style: ye({ width: `${o.value}%` })
        }, null, 4)
      ]),
      ne(" " + g(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, L1)) : w("", !0);
  }
}, D1 = /* @__PURE__ */ U(q1, [["__scopeId", "data-v-1fff5e1b"]]), P1 = {
  class: "who",
  "data-agent-who": ""
}, j1 = { class: "name" }, F1 = ["data-agent-state"], W1 = { class: "identity" }, H1 = {
  class: "sub",
  "data-agent-identity": ""
}, z1 = {
  class: "sub",
  "data-agent-started-by": ""
}, U1 = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, parts: { type: Array, required: !0 }, startedBy: { type: String, required: !0 }, windows: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", P1, [
      m("h2", j1, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, F1),
        ne(g(e.name), 1)
      ]),
      m("div", W1, [
        m("p", H1, g(e.parts.join(" · ")), 1),
        A(D1, {
          windows: e.windows,
          disabled: ""
        }, null, 8, ["windows"])
      ]),
      m("p", z1, "Started by: " + g(e.startedBy), 1)
    ]));
  }
}, G1 = /* @__PURE__ */ U(U1, [["__scopeId", "data-v-1a74ce1a"]]), V1 = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, K1 = { class: "scroll" }, Y1 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Q1 = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, X1 = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Oi(), a = _(null), s = _(null), o = _(null), l = _({}), i = _({ helpers: 0, skills: 0 }), r = _(0), c = _([]), d = _("");
    let h = 0;
    const p = M(() => {
      var b;
      return a.value.ended_at ? Hp(s.value) : `It has no task.${(b = s.value) != null && b.instruction ? " It was given an instruction." : ""}`;
    });
    async function y() {
      const b = ++h, O = await t.read(["agent", "show", String(t.id)]);
      if (b !== h) return;
      if (!O.ok) return void (d.value = O.error);
      const S = String(t.id), $ = O.value.role === "worker", [I, H, N, E, V, W] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", S, "--environment", t.environment]),
        t.read(["usage", "agent", S]),
        O.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", S]),
        t.read(["agent", "list", "--parent", S, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", S, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        $ ? t.read(["worker-worktree", "points", "--agent", S]) : { ok: !1 }
      ]);
      b === h && (d.value = H.ok ? "" : H.error, a.value = O.value, s.value = Ti(I).find((q) => q.id === t.id) ?? null, o.value = H.ok ? H.value : null, l.value = N.ok ? N.value : {}, i.value = { helpers: Do(E), skills: Do(V) }, c.value = W.ok ? W.value.points : [], r.value += 1);
    }
    return kn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], y), Se(y), (b, O) => {
      var S, $;
      return u(), f("article", V1, [
        m("div", K1, [
          d.value ? (u(), f("p", Y1, g(d.value), 1)) : a.value && o.value ? (u(), f(D, { key: 1 }, [
            A(G1, {
              name: B(Pp)(a.value, s.value),
              state: B(jp)(a.value, s.value),
              parts: B(Fp)(a.value, s.value),
              "started-by": o.value.started_by,
              windows: ((S = s.value) == null ? void 0 : S.windows) ?? []
            }, null, 8, ["name", "state", "parts", "started-by", "windows"]),
            A(B1, {
              cells: B(Wp)({ row: a.value, facts: s.value, inspection: o.value, now: B(n) })
            }, null, 8, ["cells"]),
            A($1, {
              inspection: o.value,
              tool: l.value,
              nothing: p.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(Jp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: (($ = s.value) == null ? void 0 : $.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            A(A1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(d1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: r.value,
              details: B(zp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", Q1, "Ended " + g(B(zs)(a.value.ended_at, B(n))) + ". It takes no more actions.", 1)) : w("", !0)
          ], 64)) : (u(), F(Ye, { key: 2 }))
        ])
      ]);
    };
  }
}, IS = /* @__PURE__ */ U(X1, [["__scopeId", "data-v-1f6cb5ee"]]), J1 = ["aria-expanded"], Z1 = { class: "drop-label" }, ev = ["value"], tv = {
  key: 1,
  class: "drop-lead"
}, nv = { class: "drop-item-text" }, av = {
  key: 2,
  class: "drop-note"
}, sv = {
  key: 1,
  class: "drop-none"
}, ov = {
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
    const n = e, a = t, s = _(!1), o = _(null), l = _(""), i = M(() => {
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
        e.icon ? (u(), F(me, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : w("", !0),
        m("span", Z1, g(e.label), 1),
        A(me, {
          name: "down",
          size: 11
        })
      ], 10, J1),
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
          }, null, 40, ev)) : w("", !0),
          (u(!0), f(D, null, ae(i.value, (h) => (u(), F(Ft, {
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
              h.lead ? (u(), f("span", tv, g(h.lead), 1)) : w("", !0),
              m("span", nv, g(h.label), 1),
              h.note ? (u(), f("span", av, g(h.note), 1)) : w("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? w("", !0) : (u(), f("p", sv, g(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : w("", !0)
    ], 2));
  }
}, Bi = /* @__PURE__ */ U(ov, [["__scopeId", "data-v-29dfcce5"]]);
function lv(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Se(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), Ke(() => n.disconnect()), t;
}
const iv = ["data-comment-id"], rv = {
  key: 0,
  class: "comment-top"
}, uv = { class: "comment-mark" }, cv = {
  class: "comment-body",
  "data-comment": ""
}, dv = { class: "comment-foot" }, fv = {
  key: 1,
  "data-comment-lost": ""
}, hv = {
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
      e.comment.quote ? (u(), f("div", rv, [
        m("span", uv, g(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, g(e.comment.quote), 3)
      ])) : w("", !0),
      m("p", cv, g(e.comment.body), 1),
      m("div", dv, [
        e.comment.created_at ? (u(), F(et, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : w("", !0),
        e.lost ? (u(), f("span", fv, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : w("", !0)
      ])
    ], 10, iv));
  }
}, Li = /* @__PURE__ */ U(hv, [["__scopeId", "data-v-a37d4507"]]);
var Al;
/Mac|iPhone|iPad/.test(((Al = navigator.userAgentData) == null ? void 0 : Al.platform) || navigator.platform);
function Ni(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const mv = {
  class: "comment-box",
  "data-comment-box": ""
}, pv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, vv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, gv = { class: "comment-row" }, yv = ["placeholder"], bv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Pt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Pt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = sn(e, "draft"), l = _(""), i = _(!1), r = _(null), c = M(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), d = M(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
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
    return t({ focus: () => r.value.focus() }), (y, b) => (u(), f("div", mv, [
      e.selection ? (u(), f("div", pv, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, g(e.selection.quote), 3),
        A(fa, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (O) => s("clear"))
        })
      ])) : w("", !0),
      l.value ? (u(), f("p", vv, g(l.value), 1)) : w("", !0),
      m("div", gv, [
        Ze(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": b[1] || (b[1] = (O) => o.value = O),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Mt((O) => B(Ni)(O, p), ["enter"]))
        }, null, 42, yv), [
          [Kn, o.value]
        ]),
        A(pe, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: j(() => [...b[4] || (b[4] = [
            ne("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, kv = /* @__PURE__ */ U(bv, [["__scopeId", "data-v-41d2081c"]]), Rn = (e) => e ? e.split(", ") : [];
function wv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function $v(e, t) {
  return {
    reads: Rn(e.reads_allowed),
    runs: Rn(e.runs_allowed),
    missing: [...Rn(e.reads_missing), ...Rn(e.runs_missing)],
    ask: t
  };
}
const xv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Jr("SkeletonParts", !0);
      return u(!0), f(D, null, ae(e.parts, (r, c) => (u(), f(D, { key: c }, [
        (u(!0), f(D, null, ae(r.count, (d) => (u(), F(Gt, {
          key: d,
          value: r.shape
        }, {
          line: j(() => [
            A(Jt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: r.width, height: `${t[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            A(Jt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[r.size]}px`, height: `${n[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            A(Jt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: r.width, height: `${r.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            m("div", {
              class: "skeleton-row",
              style: ye(a(r))
            }, [
              A(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            m("div", {
              class: "skeleton-stack",
              style: ye(a(r))
            }, [
              A(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ye(a(r))
            }, [
              A(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            m("div", {
              class: "skeleton-grid",
              style: ye(s(r))
            }, [
              A(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Sv = /* @__PURE__ */ U(xv, [["__scopeId", "data-v-fa8baeaf"]]), _v = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Mv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", _v, [
      A(Sv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Us = /* @__PURE__ */ U(Mv, [["__scopeId", "data-v-52f66b64"]]), qi = {
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
}, Cv = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["badge", e.tone])
    }, g(e.text), 3));
  }
}, Di = /* @__PURE__ */ U(Cv, [["__scopeId", "data-v-9e7e1157"]]), Ev = { class: "bars" }, Av = { class: "bar-name" }, Ov = { class: "bar-value" }, Tv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = M(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", Ev, [
      (u(!0), f(D, null, ae(e.items, (r, c) => (u(), F(it(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: Y(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          m("span", Av, g(r.label), 1),
          A(mi, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Ov, g(r.value) + g(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Iv = /* @__PURE__ */ U(Tv, [["__scopeId", "data-v-663427f4"]]), Rv = { class: "bars" }, Bv = {
  key: 0,
  class: "bars-title"
}, Lv = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Rv, [
      e.node.title ? (u(), f("span", Bv, g(e.node.title), 1)) : w("", !0),
      A(Iv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Nv = /* @__PURE__ */ U(Lv, [["__scopeId", "data-v-7135bb11"]]), qv = {
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
      (u(!0), f(D, null, ae(e.node.children || [], (r, c) => (u(), F(Pi, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Fn = /* @__PURE__ */ U(qv, [["__scopeId", "data-v-d142a3f4"]]), Dv = {
  key: 0,
  class: "card-head"
}, Pv = { class: "card-title" }, jv = {
  key: 0,
  class: "card-note"
}, Fv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", Dv, [
        m("span", Pv, g(e.node.title), 1),
        e.node.note ? (u(), f("span", jv, g(e.node.note), 1)) : w("", !0)
      ])) : w("", !0),
      A(Fn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Wv = /* @__PURE__ */ U(Fv, [["__scopeId", "data-v-67b72d40"]]), Hv = { class: "fact" }, zv = { class: "fact-label" }, Uv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", Hv, [
      m("span", zv, g(e.label), 1),
      A(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Gv = /* @__PURE__ */ U(Uv, [["__scopeId", "data-v-3a88ecf8"]]), Vv = { class: "list" }, Kv = { class: "list-label" }, Yv = {
  key: 1,
  class: "list-note"
}, Qv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Vv, [
      (u(!0), f(D, null, ae(e.items, (o, l) => (u(), F(it(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", Kv, g(o.label), 1),
          o.badge ? (u(), F(Di, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : w("", !0),
          o.note ? (u(), f("span", Yv, g(o.note), 1)) : w("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Xv = /* @__PURE__ */ U(Qv, [["__scopeId", "data-v-ebe2ae0a"]]), Jv = { class: "table" }, Zv = {
  key: 0,
  class: "table-row empty"
}, eg = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", Jv, [
      m("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (u(!0), f(D, null, ae(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, g(i), 1))), 128))
      ], 4),
      (u(!0), f(D, null, ae(e.rows, (i, r) => (u(), F(it(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ye(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          (u(!0), f(D, null, ae(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, g(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", Zv, g(e.empty), 1)) : w("", !0)
    ]));
  }
}, tg = /* @__PURE__ */ U(eg, [["__scopeId", "data-v-9326a52e"]]), ng = { class: "stat-value" }, ag = { class: "stat-label" }, sg = {
  key: 0,
  class: "stat-note"
}, og = {
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
    return (a, s) => (u(), F(it(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        m("span", ng, g(e.value), 1),
        m("span", ag, g(e.label), 1),
        e.note ? (u(), f("span", sg, g(e.note), 1)) : w("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, lg = /* @__PURE__ */ U(og, [["__scopeId", "data-v-ad0db6d6"]]), ig = { class: "code" }, rg = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), F(Gt, {
      value: e.node.type
    }, {
      stack: j(() => [
        A(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        A(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        A(Fn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        A(Wv, {
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
        A(lg, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        A(Nv, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        A(tg, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        A(Xv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        A(at, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        A(Gv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        A(Di, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", ig, [
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
}), Pi = /* @__PURE__ */ U(rg, [["__scopeId", "data-v-cbdcf540"]]), ug = { class: "dashboard" }, cg = { class: "trail" }, dg = ["onClick"], fg = {
  key: 0,
  class: "gone",
  role: "status"
}, hg = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = _(!!n.page && !s(n.page)), l = _(n.page && !o.value ? [n.page] : []), i = M(() => l.value.at(-1) || n.document.start), r = M(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ve(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (u(), f("div", ug, [
      e.document.broken ? (u(), F(on, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          ne(g(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), F(on, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          ne(g(e.document.missing), 1)
        ]),
        _: 1
      })) : r.value ? (u(), f(D, { key: 2 }, [
        m("nav", cg, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, g(c(e.document.start)), 3),
          (u(!0), f(D, null, ae(l.value, (b, O) => (u(), f(D, {
            key: `${O}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: O === l.value.length - 1 }]),
              onClick: (S) => h(O + 1)
            }, g(c(b)), 11, dg)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", fg, "What you opened is no longer in this dashboard. Here is its start page.")) : w("", !0),
        A(Ut, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              A(Pi, {
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
}, mg = /* @__PURE__ */ U(hg, [["__scopeId", "data-v-fbe83734"]]);
function pg(e, t) {
  const n = Ue(), a = Os(e, qi.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Se(e), Ke(() => {
    s(), a.cancel();
  });
}
const vg = {
  key: 0,
  class: "window-failure"
}, gg = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ue(), o = _(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? pg(l, n.events) : Es(l, () => !0, qi.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", vg, g(o.value.error), 1)) : o.value ? (u(), F(mg, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : w("", !0);
  }
}, yg = 1e4;
class bg {
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
    return this.heardAt !== null && t - this.heardAt > yg;
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
const kg = {
  key: 0,
  class: "frame-note"
}, wg = {
  key: 0,
  class: "frame-note"
}, $g = ["src", "title"], xg = 1e3, Sg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ue(), a = _(null), s = _(!1), o = _(!1);
    let l = null, i = 0;
    return Se(() => {
      l = new bg(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, xg);
    }), Ie(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", kg, "This window was closed because it stopped answering.")) : (u(), f(D, { key: 1 }, [
      s.value ? (u(), f("div", wg, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        A(pe, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...c[1] || (c[1] = [
            ne("Close the window", -1)
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
      }, null, 8, $g)
    ], 64));
  }
}, _g = /* @__PURE__ */ U(Sg, [["__scopeId", "data-v-32a49046"]]), Mg = {
  class: "allowance-prompt",
  role: "dialog"
}, Cg = { class: "allowance-prompt-text" }, Eg = { class: "allowance-prompt-buttons" }, Ag = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Mg, [
      m("p", Cg, g(B(wv)(e.request)), 1),
      m("div", Eg, [
        A(pe, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ne("Allow", -1)
          ])]),
          _: 1
        }),
        A(pe, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            ne("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Og = /* @__PURE__ */ U(Ag, [["__scopeId", "data-v-cad69fe2"]]), Ia = {
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
        ne(g(e.reason) + " ", 1),
        e.retry ? (u(), F(pe, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ne("Retry", -1)
          ])]),
          _: 1
        })) : w("", !0),
        e.removable ? (u(), F(pe, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            ne("Remove tab", -1)
          ])]),
          _: 1
        })) : w("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Tg = ["data-window", "data-agent"], Ig = {
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
    const i = Ce(xc, null), r = $d({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: M(() => n.options),
      declared: n.declared,
      page: Ce(gd, null),
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
    Ol(De, r), ve(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Se(r.settle), Ie(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Zr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ra(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), F(Og, {
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
    ], 8, Tg));
  }
}, Zt = /* @__PURE__ */ U(Ig, [["__scopeId", "data-v-c4443e2b"]]), ji = {
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
    const n = e, a = t, s = { render: () => ra(_g, { src: n.entry.entry_url }) };
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
}, Rg = ["data-window"], Fi = {
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
            )).default, Wu();
          } catch (i) {
            if (ju(i) && Fu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (u(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(Us, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Rg)) : (u(), F(Zt, {
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
}, Bg = {
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
    const n = t, a = e, s = M(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = M(() => s.value && { render: () => ra(gg, { line: s.value.line, events: s.value.events }) }), l = _(null), i = M(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), r = M(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = M(
      () => {
        var p, y;
        return l.value ? $v(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
      var b, O;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), F(Us, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((O = s.value) == null ? void 0 : O.shows) === "one-agent" && e.agent === null ? (u(), F(on, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), F(Zt, {
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
        onOption: y[0] || (y[0] = (S, $) => n("option", S, $))
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
}, Lg = ["data-section"], Ng = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, qg = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ce(Ls, null), a = M(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = M(() => ({ row: t.row }));
    return (o, l) => B(n) ? (u(!0), f(D, { key: 0 }, ae(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), F(Bg, {
        key: 0,
        name: i.name,
        catalogue: B(n).catalogue,
        subscriptions: B(n).subscriptions,
        environment: B(n).environment,
        prompts: B(n).prompts,
        "shell-read": B(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", Ng, g(i.name) + " is not available", 1))
    ], 8, Lg))), 128)) : w("", !0);
  }
}, hs = /* @__PURE__ */ U(qg, [["__scopeId", "data-v-a47d36b7"]]), Dg = { class: "rail-head" }, Pg = { key: 0 }, jg = {
  key: 1,
  class: "rail-none"
}, Fg = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Dg, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", Pg, g(e.total || e.comments.length), 1)) : w("", !0)
      ]),
      e.comments.length ? (u(!0), f(D, { key: 0 }, ae(e.comments, (a) => (u(), F(Li, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", jg, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Wg = /* @__PURE__ */ U(Fg, [["__scopeId", "data-v-4d684649"]]), Hg = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, zg = ["aria-pressed"], Ug = ["aria-pressed"], Gg = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Vg = {
  key: 0,
  role: "alert"
}, Kg = {
  key: 1,
  class: "sidebar-none"
}, Yg = ["data-question-id"], Qg = { class: "question-state" }, Xg = ["data-question-show", "onClick"], Jg = {
  key: 0,
  class: "sidebar-none"
}, Zg = {
  key: 1,
  class: "question-answer"
}, ey = {
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
      m("nav", Hg, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, zg),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Ug)
      ]),
      e.mode === "comments" ? (u(), f(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), F(Wg, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : w("", !0),
        A(vn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), f("aside", Gg, [
        e.failure ? (u(), f("p", Vg, g(e.failure), 1)) : e.questions.length ? w("", !0) : (u(), f("p", Kg, "No questions about this text yet.")),
        (u(!0), f(D, null, ae(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", Qg, g(B(ln)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, g(s.text), 9, Xg),
            s.quote ? (u(), f(D, { key: 0 }, [
              m("blockquote", null, g(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", Jg, "The quoted text has changed.")) : w("", !0)
            ], 64)) : w("", !0),
            s.answer ? (u(), f("p", Zg, "Answered: " + g(s.answer), 1)) : w("", !0),
            A(hs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(Ds, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = B(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Yg);
        }), 128))
      ]))
    ], 2));
  }
}, Po = /* @__PURE__ */ U(ey, [["__scopeId", "data-v-2718a08d"]]), ty = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, ny = {
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
        m("span", ty, g(o.value), 1),
        A(pe, {
          onClick: r[2] || (r[2] = (c) => a("close"))
        }, {
          default: j(() => [...r[6] || (r[6] = [
            ne("Cancel", -1)
          ])]),
          _: 1
        }),
        A(pe, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: j(() => [...r[7] || (r[7] = [
            ne("Save", -1)
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
}, ay = /* @__PURE__ */ U(ny, [["__scopeId", "data-v-e99f14e0"]]);
function Wi(e, t) {
  const n = _([]), a = _(!1), s = _(null), o = _(0), l = _(!1), i = _("");
  let r = 0, c = 0;
  const d = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: O, id: S, title: $ } = e(), I = `On ${O} ${S}, ${$}: `;
    return b.text.startsWith(I) ? b.text.slice(I.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: O, id: S } = e();
    if (!S) return;
    const $ = ++c;
    l.value = !0, i.value = "";
    try {
      const I = await t([O, "comments", String(S), "--page", String(b), "--page-size", "25"]);
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
    const { noun: O, id: S } = e(), $ = `${O}:${S}`, I = { id: `sending-${++r}`, text: b };
    n.value = [...n.value, I], o.value++, a.value = !0;
    const H = await t([O, "comment", String(S), b]);
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
function sy(e, t) {
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
const oy = {
  class: "document-tab",
  "data-document-revisions": ""
}, ly = ["datetime"], iy = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, ry = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, uy = {
  key: 2,
  class: "document-none"
}, cy = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(""), l = M(() => s.value ? sy(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", oy, [
      e.editing ? (u(), F(pe, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (h) => a("close-revision"))
      }, {
        default: j(() => [...d[1] || (d[1] = [
          ne("Close the open revision", -1)
        ])]),
        _: 1
      })) : w("", !0),
      e.revisions.length ? (u(), f(D, { key: 1 }, [
        (u(!0), f(D, null, ae(e.revisions, (h) => (u(), F(pe, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: j(() => [
            ne("Revision " + g(h.number) + ": " + g(h.change) + " · " + g(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, g(h.created_at.slice(0, 16).replace("T", " ")), 9, ly)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", iy, g(o.value), 1)) : w("", !0),
        s.value ? (u(), f(D, { key: 1 }, [
          A(pe, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: r
          }, {
            default: j(() => [...d[2] || (d[2] = [
              ne("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", ry, [
            (u(!0), f(D, null, ae(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, g(h.text || " "), 3))), 128))
          ])
        ], 64)) : w("", !0)
      ], 64)) : (u(), f("p", uy, "No revisions"))
    ]));
  }
}, dy = /* @__PURE__ */ U(cy, [["__scopeId", "data-v-3a381aa4"]]), fy = "button, [data-comment-number]", hy = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Hi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(fy) || n.push(t.currentNode);
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
const my = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function py(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Hi(e), s = a.map((c) => c.data).join(""), o = jo(a, n.startContainer, n.startOffset), l = s.slice(o, jo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: my(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function vy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function gy(e, t, n) {
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
function yy({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function by(e, t) {
  const n = Hi(e), a = vy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = gy(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(yy).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ra(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ra(t.number, t.id, t.label)) : l.at(-1).append(Ra(t.number, t.id, t.label))), !0;
}
function ky(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !by(e, a) && a.id && n.push(a.id);
  return n;
}
const wy = (e) => e.closest(hy) ?? e;
function Fo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const $y = {
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
      const O = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), S = ky(l.value, a.pending ? [...O, { ...a.pending, pending: !0 }] : O);
      s("lost", S);
      const $ = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!$) {
        c.value = null;
        return;
      }
      const I = document.createElement("div");
      I.className = "inline-comment", wy($).after(I), c.value = I;
    }
    function h() {
      if (!l.value) return;
      const O = py(l.value);
      if (r.value = !!O, !O) {
        i.value = null;
        return;
      }
      const S = window.getSelection().getRangeAt(0).getBoundingClientRect(), $ = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(S.left - $.left, 0)}px`, top: `${S.top - $.top + o.value.scrollTop}px` }, s("select", O);
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
    return ve(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), Se(() => {
      d(), document.addEventListener("selectionchange", h);
    }), Ke(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: je }), (O, S) => (u(), f("div", {
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
        onMousedown: S[0] || (S[0] = xe(() => {
        }, ["prevent"])),
        onClick: S[1] || (S[1] = ($) => s("write"))
      }, [
        A(me, {
          name: "chat",
          size: 13
        }),
        S[2] || (S[2] = ne("Comment on this", -1))
      ], 36)) : w("", !0),
      c.value ? (u(), F(ca, {
        key: 1,
        to: c.value
      }, [
        fe(O.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : w("", !0),
      fe(O.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, xy = /* @__PURE__ */ U($y, [["__scopeId", "data-v-548d0aaa"]]), Sy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, _y = { class: "document-tabs" }, My = { class: "document-body" }, Cy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Ey = {
  key: 1,
  class: "document-loading"
}, Ay = {
  class: "document-details",
  "data-resource-fields": ""
}, Oy = 760, Ty = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _(null), a = lv(n), s = M(() => a.value !== null && a.value < Oy), o = _(null), l = _(""), i = _([]), r = _([]), c = _(""), d = _("comments"), h = _("text"), p = _(0), y = _(0), b = _([]), O = _(null), S = _(""), $ = _(!1), I = _(null), H = _(null);
    let N = 0;
    const E = Wi(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (ie) => t.read(ie)), V = M(() => Fo(E.comments.value)), W = M(() => d.value === "questions" ? Fo(r.value) : V.value), q = M(() => d.value === "questions" ? W.value.length : E.total.value), x = M(() => {
      var ie;
      return (ie = o.value) != null && ie.body ? Fs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), C = M(() => {
      var ie;
      return (((ie = o.value) == null ? void 0 : ie.body) ?? "").split(`
`).filter((ee) => /^#{1,4} /.test(ee)).map((ee, te) => ({ key: String(te), value: te, label: ee.replace(/^#+ /, "") }));
    }), k = M(() => V.value.find((ie) => ie.id === y.value)), v = M(() => {
      var ie;
      return (ie = o.value) != null && ie.close_reason ? "Closed" : "Open";
    }), R = M(() => h.value === "comments" && !s.value ? "text" : h.value), T = (ie) => ie.ok ? ie.value.rows ?? [] : [];
    async function L() {
      const ie = ++N, ee = await t.read([t.noun, "inspect", String(t.id)]);
      if (ie !== N) return;
      l.value = ee.ok ? "" : ee.error, o.value = ee.ok ? ee.value : null;
      const te = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), Pe = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      ie === N && (r.value = T(te), c.value = te.ok ? "" : te.error, i.value = Pe ? T(Pe) : []);
    }
    async function P(ie) {
      const ee = O.value ? ["--quote", O.value.quote, "--position", String(O.value.position), "--selection-type", O.value.selection_type] : [], te = await t.read([t.noun, "comment", String(t.id), ...ee, "--", ie]);
      if (!te.ok) throw new Error(te.error);
      O.value = null, await Promise.all([L(), E.load()]);
    }
    async function J() {
      const ie = await t.read(["doc", "close", String(t.id)]);
      l.value = ie.ok ? "" : ie.error, ie.ok && await L();
    }
    function z() {
      S.value.trim() || (O.value = null);
    }
    function se(ie) {
      var ee;
      if (p.value = ie, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === ie ? 0 : ie : (ee = n.value.querySelector(d.value === "questions" ? `[data-question-id="${ie}"]` : `[data-comment-id="${ie}"]`)) == null || ee.scrollIntoView({ block: "nearest" });
    }
    async function oe(ie) {
      var ee, te;
      h.value = "text", p.value = ie, await ((ee = I.value) == null ? void 0 : ee.nextTick()), (te = I.value) == null || te.show(ie);
    }
    function ge() {
      $.value = !1, L();
    }
    return ve(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, O.value = null, r.value = [], c.value = "", L();
    }, { immediate: !0 }), ve(d, () => {
      p.value = 0, y.value = 0;
    }), (ie, ee) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", Sy, [
        A(pe, {
          bordered: "",
          "data-text-edit": "",
          onClick: ee[0] || (ee[0] = (te) => $.value = !0)
        }, {
          default: j(() => [...ee[14] || (ee[14] = [
            ne("Edit", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      m("nav", _y, [
        m("button", {
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "text" }]),
          "data-document-tab": "text",
          onClick: ee[1] || (ee[1] = (te) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: ee[2] || (ee[2] = (te) => h.value = "comments")
        }, [
          ne(g(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, g(q.value || ""), 1)
        ], 2)) : w("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: ee[3] || (ee[3] = (te) => h.value = "revisions")
        }, [
          ee[15] || (ee[15] = ne("Revisions ", -1)),
          m("em", null, g(i.value.length || ""), 1)
        ], 2)) : w("", !0),
        ee[16] || (ee[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        R.value === "text" && C.value.length > 1 ? (u(), F(Bi, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: C.value,
          "data-text-chapters": "",
          onPick: ee[4] || (ee[4] = (te) => {
            var Pe;
            return (Pe = I.value) == null ? void 0 : Pe.showHeading(te.value);
          })
        }, null, 8, ["label", "items"])) : w("", !0)
      ]),
      m("div", My, [
        l.value ? (u(), f("p", Cy, g(l.value), 1)) : o.value ? R.value === "revisions" ? (u(), F(dy, {
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
          "onUpdate:mode": ee[5] || (ee[5] = (te) => d.value = te),
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
          onShow: oe,
          onChanged: L
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(D, { key: 4 }, [
          A(xy, {
            ref_key: "words",
            ref: I,
            html: x.value,
            comments: W.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: O.value,
            inline: y.value,
            onSelect: ee[7] || (ee[7] = (te) => O.value = te),
            onClear: z,
            onNumber: se,
            onWrite: ee[8] || (ee[8] = (te) => {
              var Pe;
              return (Pe = H.value) == null ? void 0 : Pe.focus();
            }),
            onLost: ee[9] || (ee[9] = (te) => b.value = te)
          }, {
            inline: j(() => [
              k.value ? (u(), F(Li, {
                key: 0,
                comment: k.value,
                hot: "",
                onShow: ee[6] || (ee[6] = (te) => oe(k.value.id))
              }, null, 8, ["comment"])) : w("", !0)
            ]),
            default: j(() => [
              m("dl", Ay, [
                ee[18] || (ee[18] = m("h4", null, "Details", -1)),
                ee[19] || (ee[19] = m("dt", null, "State", -1)),
                m("dd", null, g(v.value), 1),
                o.value.close_reason ? (u(), f(D, { key: 0 }, [
                  ee[17] || (ee[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, g(o.value.close_reason), 1)
                ], 64)) : w("", !0),
                ee[20] || (ee[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  A(et, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                ee[21] || (ee[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  A(et, {
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
            "onUpdate:mode": ee[10] || (ee[10] = (te) => d.value = te),
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
            onShow: oe,
            onChanged: L
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", Ey, [
          A(Ye)
        ]))
      ]),
      o.value ? (u(), F(kv, {
        key: 1,
        ref_key: "composer",
        ref: H,
        draft: S.value,
        "onUpdate:draft": ee[11] || (ee[11] = (te) => S.value = te),
        selection: O.value,
        send: P,
        narrow: s.value,
        onClear: ee[12] || (ee[12] = (te) => O.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : w("", !0),
      $.value ? (u(), F(ay, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: ee[13] || (ee[13] = (te) => $.value = !1),
        onSaved: ge
      }, null, 8, ["noun", "id", "row", "read"])) : w("", !0)
    ], 512));
  }
}, RS = /* @__PURE__ */ U(Ty, [["__scopeId", "data-v-784faf41"]]), Iy = {
  key: 1,
  class: "row-list-failure"
}, Ry = ["data-row"], By = {
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
    const t = e, n = M(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = _(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), F(Ye, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", Iy, g(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), F(on, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        ne(g(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(D, { key: 3 }, [
      (u(), F(it(e.arrival ? Ms : "ul"), qe(n.value, { class: "row-list" }), {
        default: j(() => [
          (u(!0), f(D, null, ae(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            fe(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Ry))), 128))
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
}, Ly = /* @__PURE__ */ U(By, [["__scopeId", "data-v-6c7ba696"]]), Ny = {
  class: "agent-rows",
  "data-agent-rows": ""
}, qy = {
  key: 1,
  class: "agent-rows-note"
}, Dy = {
  key: 2,
  class: "agent-rows-note"
}, Py = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, jy = ["data-agent-row", "onClick"], Fy = { class: "agent-row-name" }, Wy = { class: "agent-row-state" }, Hy = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = M(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", Ny, [
      e.loaded ? e.failure ? (u(), f("p", qy, g(e.failure), 1)) : e.rows.length ? (u(), f(D, { key: 3 }, [
        m("p", Py, g(a.value) + " running", 1),
        (u(!0), f(D, null, ae(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => B(Ne)(`agents:${l.id}`)
        }, [
          m("span", Fy, "#" + g(l.id) + " " + g(l.session), 1),
          m("span", Wy, g(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, jy))), 128))
      ], 64)) : (u(), f("p", Dy, g(e.none), 1)) : (u(), F(Ye, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, BS = /* @__PURE__ */ U(Hy, [["__scopeId", "data-v-a01e5a17"]]), ct = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, ze = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, zy = 6;
function Gs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Uy = (e) => {
  const t = Gs(e, ct.lineChars), n = Math.max(ct.minWidth, Math.max(...t.map((a) => a.length)) * ct.charWidth + ct.padX * 2);
  return { name: e, lines: t, line: ct.line, padY: ct.padY, width: n, height: t.length * ct.line + ct.padY * 2 };
};
function Gy(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Vy(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Ky(e, t, n) {
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
  for (let l = 0; l < zy; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Yy(e, t) {
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
function Qy(e) {
  const t = [...new Set(e.flatMap(([N, E]) => [N, E]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = Gy(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, E) => !s.has(E)), l = Vy(t, o), i = Ky(t, o, l), r = new Map(t.map((N) => [N, Uy(N)])), c = i.map((N) => N.reduce((E, V) => E + r.get(V).width, 0) + He.across * (N.length - 1)), d = Math.max(...c) + He.margin * 2, h = Jy(e, l, i.length), p = /* @__PURE__ */ new Map();
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
  Yy(b, p);
  const O = b.map((N) => Zy(N, p.get(N.from), p.get(N.to))), S = [...p.values()], $ = a0(O, S), I = Math.max(y - He.down, ...$.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(d - He.margin, ...$.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + He.margin, height: I + He.margin, nodes: S, arrows: $ };
}
const Xy = (e) => e ? Gs(e, ze.lineChars).length * ze.line + ze.pad * 2 : 0;
function Jy(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += Xy(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function Zy(e, t, n) {
  const a = e.label ? Gs(e.label, ze.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * ze.charWidth + ze.pad * 2 : 0, o = a.length * ze.line + (a.length ? ze.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const e0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, t0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], n0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * ze.line);
function a0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = e0(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = n0.flatMap((r) => t0.map((c) => s(c, r))).find((r) => !n.some((c) => Wo(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => Wo(i, r)); ) i.y += ze.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: ze.line, pad: ze.pad } };
  });
}
const Wo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, s0 = { class: "flowchart-tools" }, o0 = ["width", "height", "viewBox", "aria-label"], l0 = ["d"], i0 = ["x", "y", "width", "height"], r0 = ["x", "y"], u0 = ["x", "dy"], c0 = {
  key: 0,
  class: "flowchart-label"
}, d0 = ["x", "y", "width", "height"], f0 = ["x", "y"], h0 = ["x", "dy"], m0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Qy(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = _(null), i = _({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var $;
      const O = ($ = l.value) == null ? void 0 : $.getBoundingClientRect();
      if (!(O != null && O.width)) return;
      const S = Math.min(O.width / s.value.width, O.height / s.value.height, 1.5);
      i.value = { zoom: S, x: (O.width - s.value.width * S) / 2, y: (O.height - s.value.height * S) / 2 };
    }
    function d(O, S, $) {
      const { zoom: I, x: H, y: N } = i.value, E = Math.min(o.most, Math.max(o.least, I * O));
      i.value = { zoom: E, x: S - (S - H) * E / I, y: $ - ($ - N) * E / I };
    }
    function h(O) {
      const S = l.value.getBoundingClientRect();
      d(O, S.width / 2, S.height / 2);
    }
    function p(O) {
      const S = l.value.getBoundingClientRect();
      O.ctrlKey || O.metaKey ? d(O.deltaY < 0 ? o.step : 1 / o.step, O.clientX - S.left, O.clientY - S.top) : i.value = { ...i.value, x: i.value.x - O.deltaX, y: i.value.y - O.deltaY };
    }
    function y(O) {
      var S, $, I;
      O.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), r = { x: O.clientX - i.value.x, y: O.clientY - i.value.y }, (I = ($ = l.value).setPointerCapture) == null || I.call($, O.pointerId);
    }
    function b(O) {
      r && (i.value = { ...i.value, x: O.clientX - r.x, y: O.clientY - r.y });
    }
    return Se(c), (O, S) => (u(), F(ha, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = ($) => a("close"))
    }, {
      default: j(() => [
        m("div", s0, [
          A(pe, {
            small: "",
            onClick: S[0] || (S[0] = ($) => h(o.step))
          }, {
            default: j(() => [...S[5] || (S[5] = [
              ne("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            small: "",
            onClick: S[1] || (S[1] = ($) => h(1 / o.step))
          }, {
            default: j(() => [...S[6] || (S[6] = [
              ne("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            small: "",
            onClick: c
          }, {
            default: j(() => [...S[7] || (S[7] = [
              ne("Fit the whole chart", -1)
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
            (u(!0), f(D, null, ae(s.value.arrows, ($, I) => (u(), f("path", {
              key: `arrow-${I}`,
              class: "flowchart-arrow",
              d: $.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, l0))), 128)),
            (u(!0), f(D, null, ae(s.value.nodes, ($) => (u(), f("g", {
              key: $.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: $.x,
                y: $.y,
                width: $.width,
                height: $.height,
                rx: "8"
              }, null, 8, i0),
              m("text", {
                x: $.x + $.width / 2,
                y: $.y + $.padY + $.line / 2
              }, [
                (u(!0), f(D, null, ae($.lines, (I, H) => (u(), f("tspan", {
                  key: H,
                  x: $.x + $.width / 2,
                  dy: H ? $.line : 0
                }, g(I), 9, u0))), 128))
              ], 8, r0)
            ]))), 128)),
            (u(!0), f(D, null, ae(s.value.arrows, ($, I) => (u(), f(D, {
              key: `label-${I}`
            }, [
              $.label ? (u(), f("g", c0, [
                m("rect", {
                  x: $.label.x,
                  y: $.label.y,
                  width: $.label.width,
                  height: $.label.height,
                  rx: "4"
                }, null, 8, d0),
                m("text", {
                  x: $.label.x + $.label.width / 2,
                  y: $.label.y + $.label.pad + $.label.line / 2
                }, [
                  (u(!0), f(D, null, ae($.label.lines, (H, N) => (u(), f("tspan", {
                    key: N,
                    x: $.label.x + $.label.width / 2,
                    dy: N ? $.label.line : 0
                  }, g(H), 9, h0))), 128))
                ], 8, f0)
              ])) : w("", !0)
            ], 64))), 128))
          ], 12, o0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, p0 = /* @__PURE__ */ U(m0, [["__scopeId", "data-v-51d24cfe"]]), Ho = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', zo = {
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
}, v0 = ["innerHTML"], g0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => zo[t.name] || zo.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, v0));
  }
}, yt = /* @__PURE__ */ U(g0, [["__scopeId", "data-v-beb5935c"]]), y0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(yt, { name: "fold" })
    ], 2));
  }
}, pt = /* @__PURE__ */ U(y0, [["__scopeId", "data-v-d03899bb"]]), b0 = ["data-tip", "aria-label"], k0 = {
  key: 0,
  class: "mact-word"
}, w0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(yt, { name: "open" }),
      e.open ? (u(), f("span", k0, g(e.label), 1)) : w("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, b0));
  }
}, zi = /* @__PURE__ */ U(w0, [["__scopeId", "data-v-3b292e09"]]), Ui = 120, Wn = 280, Gi = 160, $0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, x0 = ["leaving", "resizing", "entering"];
function ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function S0(e) {
  const t = x0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ms(e);
  return e.classList.add(...t), n;
}
function Vi(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = _(t()), s = _("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, p) {
    i(h);
    const y = S0(h);
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
    if (!p || !p.offsetWidth || $0()) {
      a.value = h;
      return;
    }
    const b = ms(p);
    if (l(p, b), s.value = "leaving", await n(Ui), y !== o) return;
    a.value = h, s.value = "resizing", await je(), r(p, b);
    const O = c(p);
    await n(Wn), O == null || O.disconnect(), y === o && (i(p), s.value = "entering", await n(Gi), y === o && (s.value = ""));
  }
  return ve(t, (h) => d(h)), Ke(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const _0 = { class: "growing-card-top" }, M0 = ["aria-expanded"], C0 = { class: "growing-card-avatar" }, E0 = { class: "growing-card-title" }, A0 = { class: "growing-card-more" }, O0 = { class: "growing-card-body" }, T0 = {
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
    const n = e, a = t, s = _(!1), o = _(null), { folded: l, phase: i } = Vi(o, () => !s.value), r = M(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = M(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", B(i), { open: !B(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", _0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", C0, [
            e.bad ? (u(), F(yt, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(D, { key: 1 }, [
              ne(g(r.value), 1)
            ], 64)) : (u(), F(me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", E0, g(e.title), 1),
          A(pt, { open: s.value }, null, 8, ["open"])
        ], 8, M0),
        e.action ? (u(), F(zi, {
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
          A(me, {
            name: "bubble",
            size: 13
          })
        ])) : w("", !0)
      ]),
      m("div", A0, [
        m("div", O0, [
          (u(!0), f(D, null, ae(c.value, (p, y) => (u(), f("p", {
            key: y,
            class: "growing-card-text"
          }, g(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, I0 = /* @__PURE__ */ U(T0, [["__scopeId", "data-v-f2b4930d"]]), R0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, B0 = { class: "md inline" }, L0 = ["disabled", "title", "onClick"], N0 = {
  key: 1,
  class: "message-links-many"
}, q0 = ["aria-expanded"], D0 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, P0 = ["disabled", "onClick"], j0 = { class: "row-pill message-links-chip" }, F0 = { class: "message-links-title" }, W0 = { key: 0 }, Ba = 3, H0 = "task", z0 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.total || n.links.length), o = M(() => n.links.every((p) => p.endpoint.model === H0) ? "tasks" : "items"), l = _(!1), i = _(null);
    Ul(i, () => l.value = !1);
    const r = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, d = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, Ne(p.endpoint.open_ref));
    }
    return (p, y) => (u(), f("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ba, three: s.value === Ba, open: l.value }]),
      "data-message-links": ""
    }, [
      A(yt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), f("span", R0, [
        m("span", B0, [
          y[1] || (y[1] = ne("Linked: ", -1)),
          (u(!0), f(D, null, ae(e.links, (b) => (u(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (O) => h(b)
          }, [
            ne(g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
            d(b) ? (u(), f(D, { key: 0 }, [
              ne(" (" + g(d(b)) + ")", 1)
            ], 64)) : w("", !0),
            c(b) ? (u(), f(D, { key: 1 }, [
              ne(" (unavailable)")
            ], 64)) : w("", !0)
          ], 8, L0))), 128))
        ])
      ])) : w("", !0),
      s.value >= Ba ? (u(), f("span", N0, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          ne(g(s.value) + " linked " + g(o.value) + " ", 1),
          A(pt, { open: l.value }, null, 8, ["open"])
        ], 8, q0)
      ])) : w("", !0),
      l.value ? (u(), f("div", D0, [
        (u(!0), f(D, null, ae(e.links, (b) => (u(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (O) => h(b)
        }, [
          m("span", j0, g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
          m("span", F0, g(b.endpoint.title), 1),
          m("span", null, g(d(b)), 1),
          c(b) ? (u(), f("span", W0, "Unavailable")) : w("", !0)
        ], 8, P0))), 128))
      ])) : w("", !0),
      A(vn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, U0 = /* @__PURE__ */ U(z0, [["__scopeId", "data-v-e9bc783c"]]), G0 = ["title", "aria-label"], V0 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, K0 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Y0 = {
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
      (u(), f("svg", V0, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", K0)) : w("", !0)
      ]))
    ], 10, G0));
  }
}, Q0 = /* @__PURE__ */ U(Y0, [["__scopeId", "data-v-6dc92808"]]), X0 = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, J0 = (e) => e.worker_id != null ? "report" : "message", Z0 = (e) => X0[J0(e)], eb = "img,pre,table";
function tb(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function nb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function ab(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(eb)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = tb(nb(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function sb(e, t) {
  let n = null;
  const a = () => e.value && ab(e.value);
  Se(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), ve(t, a, { flush: "post" });
}
const ob = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function lb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Bn = /* @__PURE__ */ new WeakMap(), Re = "work", Xe = "sent", ib = 50, Uo = 50, Go = () => ({ rows: _([]), total: _(0), next: _(null), loading: _(!1), failure: _(""), version: 0 });
function rb(e) {
  var O;
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
    const V = $ === Re ? N.value.counterparts ?? [] : N.value.rows ?? [], W = H === 1 ? V : [...E.rows.value, ...V], q = $ === Re ? (x) => `${x.endpoint.model}:${x.endpoint.id}` : (x) => x.id ?? x.target_id;
    E.rows.value = [...new Map(W.map((x) => [q(x), x])).values()], E.total.value = N.value.total ?? E.rows.value.length, E.next.value = N.value.next_page ?? null;
  }
  function i(S, $, I, H) {
    const N = S[$];
    N.version === I && (N.failure.value = H.message, N.loading.value = !1);
  }
  async function r(S, $, I) {
    const H = o(S, $), N = $ === Re ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(S, $, H, I, await e.read(`link list --source message:${S.id} ${N} --page ${I} --page-size ${$ === Re ? 10 : 25}`));
    } catch (E) {
      i(S, $, H, E);
    }
  }
  async function c(S) {
    const $ = S.map((I) => ({ [Re]: o(I, Re), [Xe]: o(I, Xe) }));
    try {
      const I = await e.read(`link receipts --messages ${S.map((H) => H.id).join(",")}`);
      S.forEach((H, N) => {
        const E = I.ok ? I.value.messages[String(H.id)] : null;
        l(H, Re, $[N][Re], 1, I.ok ? { ok: !0, value: E.named } : I), l(H, Xe, $[N][Xe], 1, I.ok ? { ok: !0, value: E.sent } : I);
      });
    } catch (I) {
      S.forEach((H, N) => [Re, Xe].forEach((E) => i(H, E, $[N][E], I)));
    }
  }
  function d() {
    a = null;
    const S = [...n].map(($) => t.get($)).filter(($) => $ && s($));
    n.clear(), S.forEach(($) => $.dirty.clear());
    for (let $ = 0; $ < S.length; $ += Uo) c(S.slice($, $ + Uo));
  }
  function h(S, $ = [Re, Xe]) {
    for (const I of $) S.dirty.add(I);
    s(S) && (n.add(S.id), a ?? (a = setTimeout(d, 0)));
  }
  function p(S) {
    const $ = S.sources ?? (S.source_model && Number.isInteger(S.source_id) ? [{ model: S.source_model, id: S.source_id }] : []), I = S.link_types ?? (S.link_type ? [S.link_type] : []), H = I.length ? [Re, Xe].filter((E) => E === Re ? I.some((V) => ["about", "edited"].includes(V)) : I.includes("sent_to")) : [Re, Xe];
    if (!H.length) return;
    const N = $.length ? [...new Set($.filter((E) => E.model === "message").map((E) => E.id))].map((E) => t.get(E)).filter(Boolean) : [...t.values()].filter(s).slice(0, ib);
    for (const E of N) h(E, H);
  }
  const y = (O = e.follow) == null ? void 0 : O.call(e, ["link.*"], p), b = {
    attach(S, $) {
      let I = t.get(S);
      return I || (I = { id: S, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Re, Xe]), work: Go(), sent: Go() }, t.set(S, I)), I.views.add($), I.dirty.size && h(I, [...I.dirty]), I;
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
function ub(e, t, n) {
  const a = Je(null);
  let s = null;
  const o = ve(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = rb(e);
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Re),
    loadSent: () => s == null ? void 0 : s.more(a.value, Xe)
  };
}
const cb = ["data-incoming", "data-ref"], db = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], fb = { class: "message-body" }, hb = ["title"], mb = ["innerHTML"], pb = ["title"], vb = ["innerHTML"], gb = {
  class: "message-faces",
  "data-message-faces": ""
}, yb = ["title", "data-face", "onClick"], bb = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, kb = ["title", "data-reaction", "onClick"], wb = {
  key: 0,
  class: "message-reaction-count"
}, $b = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, xb = ["href", "title"], Sb = ["src", "alt"], _b = ["href"], Mb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Cb = ["disabled", "data-sent-worker", "title", "onClick"], Eb = { class: "message-foot" }, Ab = { class: "message-time" }, Ob = {
  class: "message-id",
  "data-message-id": ""
}, Tb = 1500, Ib = "An earlier message", Rb = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _(null), l = M(() => ["user", "comment"].includes(n.message.type)), i = M(() => {
      const [ie, ee] = (n.message.commented_row || ":").split(":"), te = mt(ie);
      return te ? { ref: `${te}:${ee}`, label: `${Vt(te).title.toLowerCase()} ${ee}` } : null;
    }), r = M(() => n.message.worker_id ?? null), c = M(() => Z0(n.message)), d = M(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var ie;
      await ((ie = navigator.clipboard) == null ? void 0 : ie.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Tb);
    }
    const p = bi(), y = M(() => p(n.message.text ?? "")), b = M(() => JSON.parse(n.message.flowchart_edges || "[]")), O = _(!1), S = M(() => p(n.quote || Ib));
    function $() {
      const ie = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ie ? ie.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    sb(o, () => `${n.message.text} ${n.quote}`);
    const I = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, H = (ie) => `/api/files/message/${n.message.id}/${encodeURIComponent(ie)}`, N = M(() => JSON.parse(n.message.captions || "{}")), E = M(() => (n.message.files ?? []).map((ie) => ({ name: ie, address: H(ie), isImage: I.test(ie), title: N.value[ie] || ie }))), V = M(() => Ei(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), W = Ce(De, null), { links: q, total: x, more: C, loading: k, failure: v, sentTo: R, sentMore: T, sentLoading: L, sentFailure: P, loadMore: J, loadSent: z } = ub(W, () => l.value && !n.message.local ? n.message.id : null, o), se = _(!1), oe = M(() => lb(n.message.reactions));
    function ge(ie) {
      se.value = !1, a("react", n.message, ie);
    }
    return (ie, ee) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(I0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (te) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, cb)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", fb, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: ee[5] || (ee[5] = (...te) => B(Nt) && B(Nt)(...te))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = xe((te) => B(Ne)(i.value.ref), ["stop"]))
          }, [
            A(me, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + g(i.value.label), 1)
          ], 8, hb)) : w("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe($, ["stop"]),
            innerHTML: S.value
          }, null, 8, mb)) : w("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: ee[2] || (ee[2] = xe((te) => B(Ne)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + g(r.value), 9, pb)) : w("", !0),
          A(hi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: j(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, vb)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (u(), f(D, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[3] || (ee[3] = (te) => O.value = !0)
            }, "Open the flowchart"),
            O.value ? (u(), F(p0, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: ee[4] || (ee[4] = (te) => O.value = !1)
            }, null, 8, ["title", "edges"])) : w("", !0)
          ], 64)) : w("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: se.value }]),
          "data-message-tools": ""
        }, [
          se.value ? (u(), f(D, { key: 0 }, [
            m("div", gb, [
              (u(!0), f(D, null, ae(B(ob), (te) => (u(), f("button", {
                key: te,
                type: "button",
                class: "message-face",
                title: `React ${te}`,
                "data-face": te,
                onClick: (Pe) => ge(te)
              }, g(te), 9, yb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[6] || (ee[6] = (te) => se.value = !1)
            }, [
              A(me, {
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
              onClick: ee[7] || (ee[7] = (te) => se.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ee[8] || (ee[8] = (te) => a("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: h
            }, g(s.value ? "Copied" : "Copy"), 1),
            d.value ? (u(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ee[9] || (ee[9] = (te) => a("delete", e.message))
            }, "Delete")) : w("", !0)
          ], 64))
        ], 2)
      ]),
      oe.value.length ? (u(), f("div", bb, [
        (u(!0), f(D, null, ae(oe.value, (te) => (u(), f("button", {
          key: te.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: te.mine }]),
          title: te.title,
          "data-reaction": te.emoji,
          onClick: (Pe) => a("react", e.message, te.emoji)
        }, [
          ne(g(te.emoji) + " ", 1),
          te.count > 1 ? (u(), f("span", wb, g(te.count), 1)) : w("", !0)
        ], 10, kb))), 128))
      ])) : w("", !0),
      E.value.length ? (u(), f("div", $b, [
        (u(!0), f(D, null, ae(E.value, (te) => (u(), f(D, {
          key: te.name
        }, [
          te.isImage ? (u(), f("a", {
            key: 0,
            href: te.address,
            target: "_blank",
            class: "message-image",
            title: te.title
          }, [
            m("img", {
              src: te.address,
              alt: te.name,
              "data-figure-picture": ""
            }, null, 8, Sb)
          ], 8, xb)) : (u(), f("a", {
            key: 1,
            href: te.address,
            target: "_blank",
            class: "message-file"
          }, g(te.name), 9, _b))
        ], 64))), 128))
      ])) : w("", !0),
      B(R).length ? (u(), f("div", Mb, [
        A(me, {
          name: "send",
          size: 12
        }),
        (u(!0), f(D, null, ae(B(R), (te) => (u(), f("button", {
          key: te.id,
          type: "button",
          class: "message-sent-worker",
          disabled: te.unavailable || !te.open_ref,
          "data-sent-worker": te.id,
          title: `Open worker ${te.id}`,
          onClick: xe((Pe) => te.open_ref && B(Ne)(te.open_ref), ["stop"])
        }, [
          ne("Also sent to worker " + g(te.id), 1),
          te.unavailable ? (u(), f(D, { key: 0 }, [
            ne(" (unavailable)")
          ], 64)) : w("", !0)
        ], 8, Cb))), 128))
      ])) : w("", !0),
      A(vn, {
        more: B(T),
        loading: B(L),
        failure: B(P),
        label: "More recipients",
        onMore: B(z)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Eb, [
        m("time", Ab, g(V.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(D, { key: 0 }, [
          ee[10] || (ee[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Ob, "message " + g(e.message.id), 1)
        ], 64)) : w("", !0),
        l.value ? (u(), F(Q0, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : w("", !0)
      ]),
      B(q).length || B(v) ? (u(), F(U0, {
        key: 3,
        links: B(q),
        total: B(x),
        more: B(C),
        loading: B(k),
        failure: B(v),
        onMore: B(J)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : w("", !0)
    ], 8, db));
  }
}, LS = /* @__PURE__ */ U(Rb, [["__scopeId", "data-v-0293091f"]]), ta = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], La = 200, Ki = (e) => {
  var t;
  return ((t = ta.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ta[0].key;
}, NS = (e) => {
  var t;
  return ((t = ta.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Bb = ["aria-label"], Lb = 300, Vo = 400, Nb = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: La } },
  setup(e) {
    const t = e, n = M(() => Ki(t.value)), a = M(() => n.value < La ? [1, 0.25, 0.25] : n.value === La ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: Y(["ico", "prio", { hot: n.value >= Vo, high: n.value >= Lb && n.value < Vo }]),
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
    ], 10, Bb));
  }
}, qS = /* @__PURE__ */ U(Nb, [["__scopeId", "data-v-b10e610f"]]), Yi = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], DS = (e) => {
  const t = Yi[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, qb = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Ko = (e) => qb[e.card.state] || "idle", Db = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Yo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Qo = (e, t) => Yo[Ko(e)] - Yo[Ko(t)], Xo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, PS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Qo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Db(a, s)) : [...e].sort((a, s) => Qo(a, s) || (Xo[t] || Xo.state)(a, s)), Pb = { class: "list-row" }, jb = {
  key: 0,
  class: "list-row-type"
}, Fb = { class: "list-row-main" }, Wb = {
  key: 0,
  class: "list-row-title"
}, Hb = { class: "list-row-body" }, zb = {
  key: 1,
  class: "list-row-end"
}, Ub = {
  key: 1,
  class: "list-row-text"
}, Gb = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Pb, [
      e.type ? (u(), f("span", jb, g(e.type), 1)) : w("", !0),
      m("div", Fb, [
        e.title ? (u(), f("span", Wb, g(e.title), 1)) : w("", !0),
        m("div", Hb, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", zb, [
          fe(t.$slots, "end", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      e.text ? (u(), f("span", Ub, g(e.text), 1)) : w("", !0)
    ]));
  }
}, jS = /* @__PURE__ */ U(Gb, [["__scopeId", "data-v-dfc8c3a7"]]), FS = {
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
    return (l, i) => (u(), F(Bi, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Vb = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      fe(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Qi = /* @__PURE__ */ U(Vb, [["__scopeId", "data-v-978e0921"]]), Kb = ["aria-label"], Yb = { class: "head" }, Qb = { class: "names" }, Xb = { class: "body" }, Jb = {
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
      A(Ut, {
        name: "side",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: j(() => [
          B(s) ? (u(), f("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ye({ "--depth": e.depth, zIndex: B(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => B(o) && B(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), f(D, { key: 0 }, [
                m("header", Yb, [
                  m("div", Qb, [
                    m("h2", null, g(e.title), 1),
                    e.abstract ? (u(), F(at, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : w("", !0)
                  ]),
                  fe(r.$slots, "actions", {}, void 0, !0),
                  A(fa, {
                    title: e.closeLabel,
                    onClick: B(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), F(Qi, { key: 0 }, {
                  default: j(() => [
                    fe(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : w("", !0),
                m("div", Xb, [
                  fe(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : fe(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, Kb)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, WS = /* @__PURE__ */ U(Jb, [["__scopeId", "data-v-f276f055"]]), Zb = {
  key: 1,
  class: "text-field-label"
}, ek = {
  key: 2,
  class: "text-field-end"
}, tk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Pt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = sn(e, "modelValue"), a = ua(), s = "onUpdate:modelValue" in (((d = eu()) == null ? void 0 : d.vnode.props) || {}), o = M(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = M(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = M(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = _(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, B(a).class]),
      style: ye(B(a).style)
    }, [
      e.icon ? (u(), F(me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : w("", !0),
      e.label ? (u(), f("span", Zb, g(e.label), 1)) : w("", !0),
      Ze(m("input", qe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [B(is), o.value]
      ]),
      h.$slots.end ? (u(), f("span", ek, [
        fe(h.$slots, "end", {}, void 0, !0)
      ])) : w("", !0)
    ], 6)) : Ze((u(), f("input", qe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, r.value, { onInput: l }), null, 16)), [
      [B(is), o.value]
    ]);
  }
}), HS = /* @__PURE__ */ U(tk, [["__scopeId", "data-v-d9c38ca8"]]), nk = { class: "title" }, ak = { class: "state" }, sk = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ns(t.line, t.events);
    return (o, l) => (u(), F(Ly, {
      rows: B(n),
      failure: B(a),
      loaded: B(s),
      empty: e.empty
    }, {
      default: j(({ row: i }) => [
        m("span", nk, g(i.title), 1),
        m("span", ak, g(B(ln)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, zS = /* @__PURE__ */ U(sk, [["__scopeId", "data-v-9191a6f0"]]);
function ok(e = 1e3, t = null) {
  const n = _(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ve(t, s, { immediate: !0 }) : s(!0), Ie(() => clearInterval(a)), n;
}
const Na = _(Date.now() / 1e3);
let Jo = 0, Ln = 0;
function Vs() {
  return Ln || (Na.value = Date.now() / 1e3, Jo = setInterval(() => Na.value = Date.now() / 1e3, 1e3)), Ln += 1, Tl() && da(() => {
    Ln -= 1, Ln || clearInterval(Jo);
  }), Na;
}
const lk = 200, ik = Ui + Wn + Gi + lk;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function rk(e, t, n) {
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
function uk(e, t, n, a) {
  ve(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(rk(o, l, n.value)), performance.now() - l < ik) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const ck = ["title", "data-figure-mark", "data-folded", "data-open"], dk = {
  key: 2,
  class: "worker"
}, fk = { class: "head" }, hk = { key: 0 }, mk = {
  key: 3,
  class: "status"
}, pk = {
  key: 0,
  class: "figure"
}, vk = {
  key: 1,
  class: "ran-for"
}, gk = { key: 2 }, yk = {
  key: 3,
  class: "news"
}, bk = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, kk = {
  key: 6,
  class: "settled"
}, wk = {
  key: 1,
  class: "bar"
}, $k = {
  key: 3,
  class: "detail body"
}, xk = {
  key: 0,
  class: "body-label"
}, Sk = ["title"], _k = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ua(), a = ["onClick", "onAct"], s = M(() => Object.fromEntries(Object.entries(n).filter(([se]) => !a.includes(se)))), o = _(!1), l = M(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = M(() => t.open !== void 0), r = M(() => i.value || l.value), c = M(() => i.value ? t.open : o.value), d = M(() => i.value ? !t.open : l.value && !o.value), h = M(() => !!(t.mark.action && n.onAct)), p = M(() => r.value || h.value || !!n.onClick), y = _(null), b = _(null), { folded: O, phase: S } = Vi(y, () => d.value);
    uk(y, d, S, Ce(De, null));
    function $(se) {
      var oe, ge;
      if (!(se.target !== y.value && !b.value.contains(se.target))) {
        if (i.value) return (oe = n.onClick) == null ? void 0 : oe.call(n, se);
        if (l.value) return void (o.value = !o.value);
        (ge = n.onAct || n.onClick) == null || ge(se);
      }
    }
    const I = (se) => n.onAct(se), H = ["failed", "unfinished"], N = M(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), E = M(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), V = M(() => E.value || "var(--tone-work)"), W = M(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), q = Vs(), x = M(
      () => t.mark.began_at && W.value && !t.mark.figure && !t.mark.counting ? Ai(q.value - t.mark.began_at) : ""
    ), C = M(() => {
      const { started: se, ended: oe } = t.mark;
      return se ? oe ? `ran ${qo(oe - se, !0)}` : qo(q.value - se, !0) : x.value;
    }), k = ["bad", "danger", "warn"], v = M(() => k.includes(N.value) || t.mark.asks ? "attention" : W.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), R = ["bad", "danger"], T = M(() => R.includes(N.value)), L = M(() => v.value === "process" ? "running" : T.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), P = M(
      () => !!(t.mark.figure || C.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), J = M(() => [t.mark.title, t.mark.time ? Ei(t.mark.time) : ""].filter(Boolean).join(" · ")), z = M(() => ({
      ...E.value ? { "--mark": E.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (se, oe) => (u(), f("div", qe(s.value, {
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
          failed: T.value,
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
      "data-folded": B(O) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: $
    }), [
      (u(), F(it(p.value ? "button" : "span"), {
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
          }, null, 8, ["name"])) : (u(), F(me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", dk, g(e.mark.worker), 1)) : w("", !0),
          m("span", fk, [
            A(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", hk, g(e.mark.name), 1)) : w("", !0),
            r.value ? (u(), F(pt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : w("", !0)
          ]),
          P.value ? (u(), f("span", mk, [
            e.mark.figure ? (u(), f("span", pk, g(e.mark.figure), 1)) : w("", !0),
            C.value ? (u(), f("span", vk, g(C.value), 1)) : w("", !0),
            e.mark.stopping ? (u(), f("span", gk, "Stopping")) : w("", !0),
            e.mark.news ? (u(), f("span", yk, g(e.mark.news), 1)) : w("", !0),
            L.value === "running" ? (u(), f("span", bk)) : L.value ? (u(), F(yt, {
              key: 5,
              class: Y(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : w("", !0),
            e.mark.settled ? (u(), f("span", kk, g(e.mark.settled), 1)) : w("", !0)
          ])) : w("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), F(zi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(I, ["stop"])
      }, null, 8, ["label", "open"])) : w("", !0),
      (e.mark.figure || e.mark.counting) && W.value ? (u(), f("span", wk, [
        m("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: V.value })
        }, null, 4)
      ])) : w("", !0),
      e.mark.detail && !B(O) ? (u(), F(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      e.mark.body && !B(O) ? (u(), f("div", $k, [
        e.mark.bodyLabel ? (u(), f("p", xk, g(e.mark.bodyLabel), 1)) : w("", !0),
        A(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : w("", !0),
      e.mark.command && !B(O) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, g(e.mark.command), 9, Sk)) : w("", !0),
      e.mark.card ? (u(), F(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      fe(se.$slots, "default", {
        shown: !B(O)
      }, void 0, !0)
    ], 16, ck));
  }
}), Xi = /* @__PURE__ */ U(_k, [["__scopeId", "data-v-2aa9c496"]]), Mk = 8, Ck = 40, Ek = [];
class Ks {
  constructor(t, n, { top: a = Mk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Ek.push(this);
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
    n > Ck && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Ak = 60, Ok = 300, Ji = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Zi(e, t) {
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
  const c = new Ks("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Ok, more: () => a.value > 0, previous: r }, { top: Ak });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Tk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function er(e) {
  var n;
  const t = Tk[e] || ((n = Vt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ik = (e) => er(String(e).split(":")[0]), Rk = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Bk = { passed: "good", failed: "danger", warned: "warn", running: "" }, Lk = { good: "good", warn: "warn", danger: "danger" }, Zo = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => qf(e.target_model, e.target_id || 0)
}, Nk = { "open row": (e) => Ik(e.target_model), "open page": () => er("pages") };
function qk(e, t) {
  const n = t || {}, a = Zo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Bk[e.outcome] || "" : Lk[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Nk[a](e) : "",
    handlers: a ? { onAct: () => Zo[a](e) } : {}
  };
}
const Dk = 24, Pk = 1e3, el = 2e3, jk = 0.25, Fk = 5e3;
function Wk(e, t = Dk, n = () => !0) {
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
    const E = Date.now() - r < el ? el : Pk;
    l = setTimeout(() => o.value = a.value, E);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(N = !1) {
    const E = c();
    E && N && E.scrollTo ? E.scrollTo({ top: E.scrollHeight, behavior: "smooth" }) : E && (E.scrollTop = E.scrollHeight), y();
  }
  function O() {
    $(), !a.value && (a.value = !0, p(!0));
  }
  const S = () => !!c() && d() <= c().clientHeight * jk;
  function $() {
    clearTimeout(i), S() && (i = setTimeout(() => a.value && S() && n() && b(!0), Fk));
  }
  function I() {
    h() ? y() : O();
  }
  function H(N = 1, E = !1) {
    a.value ? s.value += Math.max(0, N) : b(E);
  }
  return Tl() && da(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: y, toBottom: b, left: O, scrolled: I, arrived: H };
}
const Hk = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, zk = (e) => String(e ?? "").replace(Hk, ""), Uk = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), { away: o, scrolled: l, arrived: i, toBottom: r } = Wk(s);
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
      ne(g(B(zk)(e.lines.join(`
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
}, Gk = /* @__PURE__ */ U(Uk, [["__scopeId", "data-v-5a8693fe"]]), Vk = "*.*", Kk = {
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
    const t = e, n = Ce(De, null), a = new Wl();
    ve(
      () => a.patterns,
      (r, c, d) => {
        var p;
        const h = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, r, (y) => a.dispatch(y));
        d(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = M(() => !!(t.declaration.shipped || t.declaration.trusted)), i = M(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Vk] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), F(Fi, {
      key: 0,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), F(ji, {
      key: 1,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Yk = { class: "mark-more-inner" }, Qk = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Xk = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Jk = {
  key: 3,
  class: "mark-lines"
}, Zk = "process", tl = "task", ew = {
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
    const t = e, n = Ue(), a = M(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = M(() => Rk.has(t.mark.variant) && t.mark.detail || ""), o = M(() => t.mark.target_model === tl ? t.mark.target_id : 0), l = Zi(
      Ji(n),
      () => t.mark.target_id
    ), i = l.lines, r = _(!1), c = _(""), d = M(() => !t.declaration.body_url && t.mark.target_model === Zk && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      r.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = M(() => t.shown && d.value);
    return ve(p, (y) => y && h()), Es(() => p.value && h(), () => p.value && !t.mark.ended_at), ve(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, b) => (u(), f("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = xe(() => {
      }, ["stop"]))
    }, [
      m("div", Yk, [
        e.declaration.body_url ? (u(), F(Kk, {
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
            m("p", Qk, g(s.value), 1)
          ], 64)) : w("", !0),
          d.value && c.value ? (u(), f("p", Xk, g(c.value), 1)) : d.value && r.value ? (u(), f(D, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            A(Gk, {
              class: "mark-terminal",
              lines: B(i),
              feed: B(l).feed,
              onOlder: B(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", Jk, g(a.value.join(`
`)), 1)) : w("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = xe((O) => B(Ne)(`${tl}:${o.value}`), ["stop"]))
          }, " Open task " + g(o.value) + " and its proofs ", 1)) : w("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ps = /* @__PURE__ */ U(ew, [["__scopeId", "data-v-df71b15a"]]), tw = ["title", "aria-label", "onClick"], nw = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, aw = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = M(() => uf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = _(""), s = Ce(De);
    async function o(l) {
      const i = await gn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (u(), f(D, null, [
      (u(!0), f(D, null, ae(n.value, (r) => (u(), f("button", {
        key: r.runs,
        type: "button",
        class: "mark-button",
        title: r.label,
        "aria-label": r.label,
        onClick: xe((c) => o(r), ["stop"])
      }, [
        A(yt, {
          name: r.icon
        }, null, 8, ["name"])
      ], 8, tw))), 128)),
      a.value ? (u(), f("span", nw, g(a.value), 1)) : w("", !0)
    ], 64));
  }
}, sw = /* @__PURE__ */ U(aw, [["__scopeId", "data-v-7a62c88e"]]);
function tr(e, t) {
  const n = Je(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const nr = tr("/api/marks", "marks"), US = nr.fetchAll, ow = nr.find, lw = ["data-ref"], iw = ["data-ref"], rw = { class: "mark-row" }, uw = "dock add", cw = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = M(() => ow(a.mark.type)), o = M(() => qk(a.mark, s.value)), l = M(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), i = _(!1);
    function r(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      i.value = !i.value;
    }
    const c = M(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((h) => {
        var p;
        return !a.docked || !((p = h.runs) != null && p.startsWith(uw));
      }).map((h) => ({ ...h, module: s.value.module }));
    });
    return (d, h) => {
      var p, y;
      return (p = s.value) != null && p.card ? (u(), f("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(ps, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, lw)) : (u(), f("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (y = s.value) == null ? void 0 : y.full_width, docked: e.docked, "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", rw, [
          A(Xi, qe({
            mark: o.value,
            open: l.value ? i.value : void 0
          }, tu(o.value.handlers), { onClick: r }), nu({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: b }) => [
                A(ps, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: b
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          A(sw, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, iw));
    };
  }
}, dw = /* @__PURE__ */ U(cw, [["__scopeId", "data-v-afd7d6b1"]]), fw = ["data-ref"], hw = ["inert"], mw = { class: "group-fold" }, pw = { class: "thread-group" }, vw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(!1), a = _(!1), s = _(!1), o = _(null);
    ve(n, async (i) => {
      var r;
      a.value = !0, await je(), (r = o.value) == null || r.offsetHeight, s.value = i;
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
      A(Xi, {
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
        m("div", mw, [
          m("div", pw, [
            (u(!0), f(D, null, ae(e.group.marks, (c) => (u(), F(dw, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, hw)) : w("", !0)
    ], 8, fw));
  }
}, GS = /* @__PURE__ */ U(vw, [["__scopeId", "data-v-45b58b9b"]]);
function gw(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Se(() => n.observe(e.value)), Ke(() => n.disconnect()), t;
}
const yw = { class: "chat-dock-fold" }, bw = ["aria-label"], kw = { class: "chat-dock-head" }, ww = { class: "chat-dock-inner" }, $w = { class: "chat-dock-foot" }, ar = 700, xw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = _(null), a = _(null), s = gw(a), o = _(!1);
    let l = 0;
    return Se(() => l = setTimeout(() => o.value = !0, ar)), Ke(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", yw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          fe(i.$slots, "edge", {}, void 0, !0),
          m("header", kw, [
            fe(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", ww, [
              m("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ye(B(s) === null ? null : { height: `${B(s)}px` })
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
          m("footer", $w, [
            fe(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, bw)
      ])
    ], 2));
  }
}, sr = /* @__PURE__ */ U(xw, [["__scopeId", "data-v-ea4dd536"]]), Sw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, qa = 5, _w = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(qa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${qa}s`, animationDelay: `${(n - qa).toFixed(2)}s` };
    return (s, o) => (u(), f("span", Sw, [
      m("i", { style: a })
    ]));
  }
}, or = /* @__PURE__ */ U(_w, [["__scopeId", "data-v-2a7bc150"]]), Mw = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), vs = (e) => e.charAt(0).toUpperCase() + e.slice(1), Cw = (e) => vs(e.replace(/_at$/, "").replaceAll("_", " ")), Ew = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Aw = (e, t, n) => [vs(`${e} ${n}`), (t == null ? void 0 : t.state) && vs(t.state)].filter(Boolean).join(" · "), lr = (e) => e.given_name || `${Yn(e.role)} ${e.id}`, Ow = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? lr(t) : (e == null ? void 0 : e.name) ?? "", Tw = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? lr(t) : "", Iw = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Mw.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Cw(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], Rw = { reviewing: "Under review" }, Bw = (e, t) => e || Rw[t == null ? void 0 : t.state] || "", ir = tr("/api/docks", "docks"), VS = ir.fetchAll, Bt = ir.find, Lw = 6, Nw = 3, Da = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, pa = (e) => Date.parse(e.leaves_at) / 1e3, St = (e) => !!(e.leaves_at && !e.kept), qw = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!St(e) || t < pa(e) || n.has(e.id)), Dw = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => qw(a, t, n)).sort((a, s) => a.id - s.id);
function Pw(e, t, n = Lw) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(pa(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const jw = (e, t, n = e) => n < 2 ? !1 : e >= Nw ? !0 : t, Fw = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), gs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Ww = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Hw = (e) => ({ ...e.kept ? gs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : gs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), zw = ["keep", "unkeep", "open", "undock"], Uw = (e) => ({ ...e, iconOnly: zw.includes(e.action) });
function Gw(e, t) {
  var n;
  return [
    ...Ww(e, t) ? [Hw(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Vt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    gs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(Uw);
}
function rr(e, t) {
  const n = Gw(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: Fw(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Vw = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || rr(e, t).title, Kw = { class: "dock-text" }, Yw = ["title"], Qw = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Xw = {
  class: "dock-facts",
  "data-dock-facts": ""
}, Jw = {
  key: 1,
  "data-dock-row": ""
}, Zw = { class: "dock-acts" }, e2 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = M(() => Bt(a.item.type)), o = Vs(), l = M(() => zs(a.item.created_at, o.value * 1e3)), i = _(null), r = _(null), c = _(null), d = _(null), h = M(() => rr(a.item, s.value)), p = Ue(), y = M(() => `dock.${a.item.id}`), b = M(() => p.props[y.value].data.value), O = M(() => Vw(a.item, s.value, b.value)), S = M(() => Zn(a.item.target_model ?? "")), $ = M(() => {
      var k;
      return ((k = s.value) == null ? void 0 : k.word) ?? "";
    }), I = M(() => ({ ...b.value, id: a.item.target_id, noun: S.value })), H = () => {
      var k, v;
      return ((v = (k = s.value) == null ? void 0 : k.reads) == null ? void 0 : v.length) && p.reload(y.value);
    };
    _c(Ol, { data: b, reload: H, readOutput: Ji(p) }), ve(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (k, v, R) => {
        var L;
        H();
        const T = (L = p.subscriptions) == null ? void 0 : L.follow(`dock ${a.item.id}`, [`${S.value.replaceAll("-", "_")}.*`], (P) => {
          (!P.row_id || P.row_id === a.item.target_id) && H();
        });
        R(() => T == null ? void 0 : T());
      },
      { immediate: !0 }
    );
    const N = _(/* @__PURE__ */ new Set()), E = _("");
    async function V(k) {
      if (k.action === "undock") return n("undock", k);
      if (k.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      k.action === "declared" && (N.value = /* @__PURE__ */ new Set([...N.value, k.label])), E.value = "";
      const R = await gn(k, { id: a.item.target_id }, p.environment);
      (R == null ? void 0 : R.ok) === !1 && (N.value = new Set([...N.value].filter((T) => T !== k.label)), E.value = `Could not ${k.label.toLowerCase()}: ${R.error}`);
    }
    const W = M(() => h.value.actions.filter((k) => !N.value.has(k.label))), q = M(() => {
      var k;
      return Bw((k = s.value) == null ? void 0 : k.badge, I.value);
    }), x = M(() => h.value.controls), C = M(() => {
      var k;
      return !!((k = s.value) != null && k.draws_head) && !a.collapsed;
    });
    return (k, v) => {
      var R, T, L, P;
      return u(), F(sr, {
        label: h.value.title + ((R = s.value) != null && R.needs_user ? ", waiting for you" : ""),
        type: (T = s.value) != null && T.needs_user ? "waiting" : "",
        folded: !!((L = s.value) != null && L.folds) && e.folded,
        body: !!((P = s.value) != null && P.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: v[3] || (v[3] = (J) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (u(), F(or, {
            key: 0,
            "ends-at": B(pa)(e.item)
          }, null, 8, ["ends-at"])) : w("", !0)
        ]),
        head: j(() => {
          var J;
          return [
            C.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(D, { key: 1 }, [
              A(me, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", Kw, [
                m("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: O.value
                }, g(O.value), 11, Yw)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? w("", !0) : (u(), f(D, { key: 0 }, [
                ne(g(l.value), 1)
              ], 64))
            ], 512),
            x.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: v[0] || (v[0] = xe(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(D, null, ae(x.value, (z) => {
                var se, oe;
                return u(), f(D, {
                  key: z.action + z.runs
                }, [
                  !N.value.has(z.label) && (!((se = z.variants) != null && se.length) || !((oe = I.value) != null && oe.state) || z.variants.includes(I.value.state)) ? (u(), F(pe, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: z.pressed }),
                    "aria-pressed": z.pressed,
                    "aria-label": z.label,
                    title: z.label,
                    "data-dock-action": z.action,
                    onClick: (ge) => V(z)
                  }, {
                    default: j(() => [
                      A(me, {
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
          E.value || e.refusal ? (u(), f("p", Qw, g(E.value || e.refusal), 1)) : w("", !0)
        ]),
        foot: j(() => {
          var J;
          return [
            m("span", Xw, [
              q.value ? (u(), f("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, g(q.value), 3)) : w("", !0),
              $.value ? (u(), f("span", Jw, g($.value) + " " + g(e.item.target_id), 1)) : w("", !0),
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
                ne(g(s.value.folds) + " ", 1),
                A(pt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : w("", !0),
            m("span", Zw, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              A(Ds, {
                name: `dock.${e.item.type}`,
                row: I.value,
                environment: B(p).environment,
                "read-only": B(p).readOnly,
                "object-name": B(Zn)(e.item.target_model),
                "external-failure": "",
                onFailure: v[2] || (v[2] = (z) => E.value = z),
                onDone: k.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(D, null, ae(W.value, (z) => (u(), F(pe, {
                key: z.action + z.runs,
                small: "",
                variant: z.primary ? "primary" : "ghost",
                bordered: !z.primary,
                "data-dock-action": z.action,
                onClick: (se) => V(z)
              }, {
                default: j(() => [
                  ne(g(z.label), 1)
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
}, nl = /* @__PURE__ */ U(e2, [["__scopeId", "data-v-46615a02"]]), t2 = ["title", "aria-label"], n2 = { class: "run-chip-in" }, a2 = {
  key: 0,
  class: "run-chip-ring"
}, s2 = { class: "run-chip-name" }, o2 = { class: "run-chip-bar" }, l2 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ue(), o = M(() => `run.${a.item.target_id}`), l = M(() => s.props[o.value].data.value), i = M(() => !l.value || l.value.state === "running" || l.value.state === "background"), r = M(() => {
      var p, y;
      return ((p = l.value) == null ? void 0 : p.title) || ((y = l.value) == null ? void 0 : y.line) || a.item.title || "";
    }), c = M(() => i.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let h = null;
    return Se(() => {
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
        style: ye({ "--tone": c.value })
      }, [
        B(St)(e.item) ? (u(), F(or, {
          key: 0,
          "ends-at": B(pa)(e.item)
        }, null, 8, ["ends-at"])) : w("", !0),
        m("span", n2, [
          i.value ? (u(), f("span", a2)) : (u(), F(yt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", s2, g(r.value), 1)
        ]),
        m("span", o2, [
          m("i", {
            style: ye({ width: i.value ? `${((b = l.value) == null ? void 0 : b.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, t2);
    };
  }
}, i2 = /* @__PURE__ */ U(l2, [["__scopeId", "data-v-226ac6c8"]]), r2 = 24, u2 = 8, KS = 420;
function YS({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= r2 ? !0 : e < t && s > u2 ? !1 : null;
}
const c2 = (e, t) => e === void 0 ? t : e, d2 = { me: 1, people: [] }, na = zt({
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
  people: d2,
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
const ur = "journal.viewer.";
function f2(e, t, n) {
  try {
    const a = n.getItem(ur + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function h2(e, t, n) {
  try {
    n.setItem(ur + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function al(e, t, n = window.localStorage) {
  const a = _(f2(e, t, n));
  return ve(a, (s) => h2(e, s, n), { deep: !0 }), a;
}
const m2 = {
  key: "dock-all",
  class: "dock-all"
}, p2 = {
  key: "runs-head",
  class: "dock-runs-head"
}, v2 = { class: "dock-runs-title" }, g2 = { class: "dock-runs-chips" }, y2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var P, J;
    const t = e, n = ok(500), a = _(/* @__PURE__ */ new Set()), s = _(!1), o = _(!1), l = Ce(De), i = _(/* @__PURE__ */ new Set()), r = _({});
    async function c(z, se) {
      r.value = { ...r.value, [z.id]: "" }, i.value = /* @__PURE__ */ new Set([...i.value, z.id]);
      const oe = await gn(se, { id: z.target_id }, l.environment);
      (oe == null ? void 0 : oe.ok) === !1 && (i.value = new Set([...i.value].filter((ge) => ge !== z.id)), r.value = { ...r.value, [z.id]: `Could not dismiss this card: ${oe.error}` });
    }
    const d = M(
      () => Dw(
        t.items.filter((z) => !i.value.has(z.id)),
        n.value,
        a.value
      )
    ), h = M(
      () => Pw(
        d.value.filter((z) => Da(z, Bt)),
        n.value
      )
    ), p = M(() => d.value.filter((z) => !h.value.includes(z) && !Da(z, Bt))), y = M(() => h.value.filter((z) => !St(z))), b = al(`dock-size:${((P = na.identity) == null ? void 0 : P.root) || location.host}`, null), O = (z) => {
      var se;
      return !!((se = Bt(z.type)) != null && se.needs_user);
    }, S = _(/* @__PURE__ */ new Set()), $ = _(/* @__PURE__ */ new Set()), I = M(() => d.value.length === 1), H = (z) => O(z) || I.value, N = (z) => H(z) ? S.value.has(z.id) || $.value.has(z.id) : b.value ? b.value.collapsed && !b.value.opened.includes(z.id) : t.collapsed, E = M(() => d.value.some(N)), V = M(() => (s.value = jw(h.value.length, s.value, y.value.length)) && !o.value && !d.value.some(N));
    ve(() => t.collapsed, (z) => {
      $.value = new Set(z ? d.value.filter(O).map((se) => se.id) : []);
    });
    function W() {
      const z = !E.value;
      b.value = { collapsed: z, opened: [] }, S.value = new Set(z ? d.value.filter(O).map((se) => se.id) : []), $.value = /* @__PURE__ */ new Set();
    }
    function q(z) {
      var oe;
      if (!N(z)) return;
      if (H(z)) {
        S.value = new Set([...S.value].filter((ge) => ge !== z.id)), $.value = new Set([...$.value].filter((ge) => ge !== z.id));
        return;
      }
      const se = (oe = b.value) != null && oe.collapsed ? b.value.opened : [];
      b.value = { collapsed: !0, opened: [...se, z.id] };
    }
    const x = al(`dock-folded:${((J = na.identity) == null ? void 0 : J.root) || location.host}`, {}), C = (z) => {
      var se;
      return !!((se = Bt(z.type)) != null && se.folds) && (t.insidesFolded || c2(x.value[z.id], Da(z, Bt) || t.folded));
    };
    function k(z) {
      x.value = { ...x.value, [z.id]: !C(z) };
    }
    function v(z) {
      x.value = { ...x.value, ...Object.fromEntries(h.value.map((se) => [se.id, se.id !== z.id])) }, o.value = !0;
    }
    function R() {
      x.value = Object.fromEntries(Object.entries(x.value).filter(([z]) => !h.value.some((se) => String(se.id) === z))), o.value = !1;
    }
    function T(z) {
      a.value = /* @__PURE__ */ new Set([...a.value, z.id]);
    }
    function L(z) {
      a.value = new Set([...a.value].filter((se) => se !== z.id));
    }
    return (z, se) => (u(), F(Ms, {
      tag: "div",
      name: "dock",
      duration: B(ar),
      class: "dock-stack"
    }, {
      default: j(() => [
        d.value.length > 1 ? (u(), f("div", m2, [
          A(pe, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": E.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: j(() => [
              A(pt, {
                open: !E.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : w("", !0),
        (u(!0), f(D, null, ae(p.value, (oe) => (u(), F(nl, {
          key: oe.id,
          item: oe,
          class: Y({ timed: B(St)(oe) }),
          leaving: B(St)(oe) && !a.value.has(oe.id),
          folded: C(oe),
          collapsed: N(oe),
          refusal: r.value[oe.id],
          onOpen: (ge) => q(oe),
          onFold: (ge) => k(oe),
          onUndock: (ge) => c(oe, ge),
          onMouseenter: (ge) => T(oe),
          onMouseleave: (ge) => L(oe)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !E.value ? (u(), f("div", p2, [
          m("span", null, g(h.value.length) + " runs", 1),
          A(pe, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: R
          }, {
            default: j(() => [
              se[1] || (se[1] = ne(" Runs ", -1)),
              A(pt, { open: "" })
            ]),
            _: 1
          })
        ])) : w("", !0),
        (u(!0), f(D, null, ae(V.value ? [] : h.value, (oe) => (u(), F(nl, {
          key: oe.id,
          item: oe,
          class: Y({ timed: B(St)(oe) }),
          leaving: B(St)(oe) && !a.value.has(oe.id),
          folded: C(oe),
          collapsed: N(oe),
          refusal: r.value[oe.id],
          onOpen: (ge) => q(oe),
          onFold: (ge) => k(oe),
          onUndock: (ge) => c(oe, ge),
          onMouseenter: (ge) => T(oe),
          onMouseleave: (ge) => L(oe)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        V.value ? (u(), F(sr, {
          key: "runs-row",
          label: `${h.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            A(me, {
              name: "runs",
              size: 14
            }),
            m("span", v2, g(h.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            m("span", g2, [
              (u(!0), f(D, null, ae(h.value, (oe) => (u(), F(i2, {
                key: oe.id,
                item: oe,
                onClick: (ge) => v(oe)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            A(pe, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: se[0] || (se[0] = (oe) => o.value = !0)
            }, {
              default: j(() => [
                se[2] || (se[2] = ne(" Runs ", -1)),
                A(pt)
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
}, QS = /* @__PURE__ */ U(y2, [["__scopeId", "data-v-97a3f0b4"]]), _t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Hn = (e) => Math.min(Math.max(e, 0), 1), b2 = (e) => {
  const t = Hn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => b2((e - t) / (n - t));
function XS(e) {
  const t = Hn(e), n = Hn((t - 0.12) / 0.76) * _t.shuffles, a = Math.min(Math.floor(n), _t.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), r = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Hn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / _t.shuffles, lift: _t.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function JS(e, t, n, a, s) {
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
}, ZS = (e) => sl[e] ?? sl.butler, Ys = 2400, k2 = 0.05;
function w2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, k2), l = Math.min(t + Ys * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function e6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function $2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function t6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const n6 = (e, t) => ({ ...e, stretch: t.stretch }), a6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, cr = (e, t) => t >= (e.least ?? 0);
function s6(e, t, n) {
  if (!cr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const o6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), x2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ol = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), S2 = (e) => e.right > e.left && e.bottom > e.top;
function l6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(x2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = ol(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = ol(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), S2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
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
        const b = (o[h] - e[d]) / y, O = (o[p] - e[d]) / y;
        l = Math.max(l, Math.min(b, O)), i = Math.min(i, Math.max(b, O));
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
}, cn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), _2 = (e) => e * e * (3 - 2 * e), Oe = (e, [t, n]) => _2(cn(e, t, n)), M2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ht = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Nn = ([e, t], n) => e + n() * (t - e);
function C2(e) {
  return M2.map(() => {
    const t = Nn(ht.speed, e), n = Nn(ht.angle, e) * Math.PI / 180, a = Nn(ht.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Nn(ht.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const E2 = C2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function A2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ht.gravity * (t[2] - ht.floor))) / ht.gravity;
}
function i6(e, t, n = E2) {
  const a = Ae.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = A2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= ht.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const r6 = (e, t) => e && Ae[e.name] ? { name: e.name, u: t / e.frames } : null;
function u6(e, t) {
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
const c6 = () => Array.from({ length: Ae.pogo.count }, (e, t) => Ae.pogo.bounce * (t + 1) / Ae.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function d6(e, t, n) {
  const { away: a, side: s } = Ae.bug_smash, o = s * a * n, [l, i] = [t.left + Dt.margin * n, t.right - Dt.margin * n], r = Math.min(Math.max(e + o + s * Dt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function f6(e, t, n) {
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
function h6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = w2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Le = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function m6(e) {
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
function O2(e, t) {
  const n = Ae.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = $2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function p6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ae.bug_shot, { frame: l, bug: i, shot: r } = O2(n, e.length), c = e.map(($, I) => ({ ...ys($, t, Math.min(n / o.fps, zn(I).shot)), shot: I < r })), d = Oe(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map(($, I) => ({ bug: $, index: I, seconds: n / o.fps - zn(I).shot, spot: ys($, t, zn(I).shot) })).filter(($) => $.seconds >= 0), b = y.flatMap(($) => {
    const I = (s == null ? void 0 : s.get($.index)) ?? L2($.bug, t, $.spot, s ? [] : a);
    return s == null || s.set($.index, I), s && N2(I, $.seconds, a), q2(I, $.seconds, a);
  }), O = y.filter(($) => R2($.bug)).map(($) => ({ seconds: $.seconds, from: $.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: S }, slush: b, camera: O };
}
function zn(e) {
  const t = Ae.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function v6(e, t, n, a) {
  const { limit: s, margin: o } = Ae.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = zn(d), p = ys(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - p.x), O = Math.abs(p.x - r) >= y ? r : p.x + b * y, S = b > 0 ? Math.max(r, Math.min(O, i)) : Math.min(r, Math.max(O, l)), $ = { from: r, to: S, begin: h.walk, end: h.aim };
    return r = S, $;
  });
}
function g6(e, t, n) {
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
const _e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, T2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function I2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const R2 = (e) => e.along * 97 % 1 < _e.camera, dn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * _e.gravity * t * t });
function B2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * _e.gravity * (t.bottom - e.from.y))) / _e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * _e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / _e.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += _e.step) {
    const d = Math.min(c + _e.step, l.t), h = dn(e, d), p = dr(i, h, n);
    if (p) return { ...p, t: c + (d - c) * p.share };
    i = h;
  }
  const r = dn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function L2(e, t, n, a = []) {
  const s = I2(e.along + 1), [o, l] = T2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: _e.count }, () => {
    const r = i + (s() - 0.5) * 2 * (_e.spread * Math.PI / 180), c = _e.speed[0] + s() * (_e.speed[1] - _e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: _e.radius[0] + s() * (_e.radius[1] - _e.radius[0]) };
    return { ...d, ...B2(d, t, a) };
  });
}
function N2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += _e.step) {
      const l = Math.min(o + _e.step, s), i = dr(dn(a, o), dn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function q2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...dn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - _e.hold) / _e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, r = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - r)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: r, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function y6(e, t, n, a) {
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
function b6(e, t, n, a, s) {
  const { sway: o, above: l } = Ae.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (O) => {
    const [S, $] = [O.x - e.at.x, O.y - e.at.y];
    return { x: i.x + S * c - $ * d, y: i.y + S * d + $ * c };
  }, [p, y] = [...n].sort((O, S) => O.x - S.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: b.map((O, S) => ({ from: O, to: S < b.length / 2 ? p : y })) };
}
const k6 = (e, t) => Oe(t, e.grows) * (1 - Oe(t, e.sinks));
function aa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: cn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: cn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function w6(e, t) {
  const n = Ae[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = aa(n, t), l = 1 - (1 - n.small) * Oe(a, n.shrinks) * (1 - Oe(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = aa(n, t), o = n.flat * Oe(a, n.squashes) * (1 - Oe(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * cn(s, ...n.springs)) * (1 - cn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const $6 = (e) => e === "pack_box";
function x6(e) {
  const { into: t, out: n } = aa(Ae.rope_swing, e);
  return 1 - Oe(t, [0, 1]) * (1 - Oe(n, [0, 1]));
}
function S6(e) {
  const t = Ae.rope_swing, { into: n, out: a } = aa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Oe(n, [0, 1]) * (1 - Oe(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const D2 = { after: 3 }, Qs = 10, P2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, j2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, F2 = { weight: 19 }, fr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, W2 = { every: 120 }, hr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, mr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, H2 = {
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
}, wn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Qs }), re = (e, t, n = {}) => wn(e, "clip", t, n), Pa = (e, t, n = {}) => wn(e, "look", t, n), ll = (e, t, n = {}) => wn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...wn(e, "pick", t, n), ...a }), we = (e) => wn("nothing", "nothing", e, {}), z2 = 120, U2 = 300, ja = (e, t) => ({ ...re(e, t), cooldown: U2 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), G2 = () => [re("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: P2[e.name] }), Qt = (e) => ({ ...e, shenanigan: !0, lasts: j2[e.name] }), va = [
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
  ...de("reported", { cooldown: 90 }, [ll("read", 3), re("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [ll("read", 3), we(1)]),
  ...de("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), we(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, G2()),
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
  ...de("answered", { cooldown: 15 }, [Pa("amused", 3), we(2)]),
  ...de("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...de("long_walk", { cooldown: 90 }, [re("stumble", 3), we(22)]),
  ...de("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), we(13)]),
  ...de("typing", { cooldown: 60 }, [Pa("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(H2).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Pa(t, 1)])),
  ...Object.entries(hr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(mr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [re(t, 1)])),
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
    { ...Qt($t(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Qt($t(re("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...de("held:search", { cooldown: z2 }, [ja("search", 3), { ...ja("binoculars", 2), when: { home: !0 } }, { ...ja("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...de("jump", {}, [Qt($t(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...de("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...de("unit", { cooldown: fr.build.cooldown }, [be("unit", F2.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: W2.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...de("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...de("roam", {}, [
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
], pr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), vr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), V2 = (e) => Array.isArray(e) ? e[0] : e, K2 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, Y2 = (e) => va.some((t) => t.when.moment === e);
function Q2(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || vr(d).every(([h, p]) => n(h) >= V2(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = va.filter((d) => pr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= D2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ve(e, t) {
  const n = Q2(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (gr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function gr(e, t, n) {
  var a;
  for (const [s, o] of vr(t)) (a = e.memory) == null || a.set(s, e.now + K2(o, n));
}
function _6(e, t, n) {
  gr(e, va.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const M6 = (e) => Object.values(fr).find((t) => pr(t.when, e)) ?? null, X2 = (e, t, n) => n - t <= (e.lifetime ?? Qs), C6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || cr(e.clip, t));
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
}, E6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), br = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), A6 = {
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
}, O6 = 120, J2 = 20, T6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < J2), Z2 = (e) => bs[e] || bs.idle, I6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, kr = "airborne", e5 = "landing", t5 = "travelling", wr = "grounded", R6 = ({ airborne: e, landing: t, trip: n }) => e ? kr : t ? e5 : n != null && n.started ? t5 : wr;
function B6(e, t) {
  var s;
  const n = n5(e, t);
  return e.mode === wr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function n5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === kr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...a5(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : Z2(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function a5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ks = (e) => e.outcome, s5 = "plugin:code-commandments:sins:", il = (e) => e.type === "plugins.card" && e.markKey.startsWith(s5), o5 = [
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
], L6 = (e, t) => e.filter((n) => n.author === "user" && ea(n.read_at) > t).map((n) => ({ beat: "read_message", time: ea(n.read_at), card: $i(n) })).sort((n, a) => n.time - a.time), rl = { user: "reacted", agent: "agent_reacted" };
function N6(e, t) {
  return e.filter((n) => rl[n.author] && Ct(n) > t).map((n) => ({ beat: `${rl[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const l5 = [.../* @__PURE__ */ new Set([...Object.values(hr).flatMap((e) => Object.keys(e)), ...Object.keys(mr)])];
function q6(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = l5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: $i(n) })).sort((n, a) => n.time - a.time);
}
const i5 = (e) => new yr(e).isTest(), sa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ks(e)] || "";
}, r5 = 1800, u5 = (e, t) => {
  if (sa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && sa(n) !== "finished" && Number(e.time) - Number(n.time) <= r5 ? "tests_fixed" : "tests_passed";
};
function D6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(i5), s = a.filter((i) => sa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, sa(i))), o.map((i) => ({ beat: u5(i, s), time: Number(i.time), card: i.key }));
}
function P6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ks(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ks(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const j6 = (e) => e.map((t) => {
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
function F6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function W6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function H6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = o5.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function Xs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const ul = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function c5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Xs(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function z6(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : Y2(`held:${e}`) ? "idle" : e;
}
const Be = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function U6(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Be.ahead * n ? 180 : Math.sign(a) * Be.turn;
}
const cl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function G6(e, t) {
  const n = Math.min(Be.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Be.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Be.lines, Math.floor((e.bottom - e.top - 2 * a) / Be.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Be.sweep) % s, i = o % Be.sweep, r = Be.sweep - Be.returnSeconds, c = cl((i - r) / Be.returnSeconds), d = i <= r ? cl(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Be.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const dl = 3, $r = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, fl = 12, V6 = (e, t) => ({ mood: e, began: t, seen: 0 });
function K6(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!$r(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= dl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * fl) / fl, lasts: dl } };
}
const Y6 = (e) => e.posture === "hang" && !$r(e.face), d5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), f5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function Q6(e, t, n) {
  return d5.has(e) ? 1 / 0 : !f5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(xr(n - t.began, t.share) - st.lead, 0);
}
const h5 = 5;
function X6(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= h5 ? { beat: "long_walk", time: n } : null };
}
const m5 = 30, qn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function J6(e, t, n, a, s = null) {
  if (t && n < t.until || !qn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, i] = qn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + qn.every } : { state: e, began: 0, until: 0, next: n + qn.every };
}
const Z6 = (e, t, n) => t && n < t.until && br.has(e.state) ? { state: t.state, since: t.began } : e, st = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, xr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function e_(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = xr(o, e.share);
  return s ? { eager: p5(t, l), moment: null } : l > st.lead ? { eager: t, moment: null } : l < st.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > st.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < st.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function p5(e, t) {
  return e.on && t > st.lead + st.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= st.lead && t >= st.least ? { ...e, on: !0, calm: !1 } : e;
}
const v5 = 1, g5 = { look: "look", gaze: "gaze" };
function y5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [g5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const b5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), k5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > v5 * t, memory: a, now: s, room: o }, n).name === "backflip", w5 = { work: ["building"], idle: ["standing"] };
function t_(e, t, n, a) {
  const s = bs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(w5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), br.has(e) ? { moments: o, began: n || a } : (n && a - n >= m5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function $5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const hl = { pondering: $5 };
function n_(e, t, n, a, s, o) {
  if (hl[e.beat]) {
    const i = hl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = y5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Qs && { lifetime: l.lifetime } } } : null;
}
function a_(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = b5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const s_ = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function o_(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function l_(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const i_ = (e, t) => !!(e != null && e.watches) && !t.once, r_ = 10, u_ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || X2(a, a.queuedAt, n)), c_ = (e, t) => t ? null : e[0] ?? null;
function d_(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const f_ = (e, t) => !t.during || !e.some((n) => n.during === t.during), x5 = 2 * Math.PI, S5 = 500;
function h_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / S5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = x5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, O = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !r ? s && !t.behind && !y.behind ? M5(y, t, n, p, s) : E5(y, t, n, p) : t) ?? y, S = O != null && O.behind && O.mood === "reading" ? _5(e.point, O, n, l, s) : O;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: a };
}
function _5(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, l = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : d, b = y + l(c - y), O = Math.min(Math.max(a / 1e3, 0), 0.1), S = Be.turnSpeed * O, $ = h ? y + Math.min(Math.max(b - y, -S), S) : b, I = h ? e.readingFollow + p : $, H = I + ($ - I) * (1 - Math.exp(-O / Be.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, E = o(Xs(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), V = Math.min(Math.max(E, -N.up), N.down), W = Be.tipSpeed * O, q = h ? e.readingPitch + Math.min(Math.max(V - e.readingPitch, -W), W) : V;
  return { ...t, readingYaw: $, readingFollow: H, readingPitch: q, readingFacing: i };
}
function M5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (I) => {
    const { yaw: H, pitch: N } = Xs(I.x - n.x, s, n.y - I.y, o);
    return { yaw: H, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [ul(i(e)), ul(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [p, y] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [b, O, S] = r.map((I, H) => p * I + y * c[H]), $ = s * b / O;
  return { ...t, x: n.x + $, y: n.y - c5($, s, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const C5 = 0.15;
function m_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= C5;
}
function E5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const A5 = (e) => !(e != null && e.on);
function p_(e, t, n) {
  if (A5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const fn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, tt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Fa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ml = (e) => e * e * (3 - 2 * e);
function O5(e) {
  if (e < 0 || e >= tt.seconds) return null;
  const t = Fa(e, ...tt.flicker), n = Math.floor(t * tt.flickers * 2) % 2 === 0, a = e < tt.flicker[1] ? n ? 0.35 + 0.5 * t : tt.dim : 1;
  return { strength: 1 - ml(Fa(e, ...tt.fade)), lit: a, white: e < tt.flash[0] ? 0 : 1 - ml(Fa(e, ...tt.flash)) };
}
const v_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function g_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = O5(t - e.at);
  return a && { colour: fn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: tt.signs[e.tone], ...a } };
}
function y_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function b_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= fn.looks || a === null && n - e.since >= fn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function k_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ft = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, w_ = { behind: 39, figure: 40, ahead: 41 }, T5 = "[data-figure-pile]", I5 = { amber: [1, 0.69, 0.125], good: fn.colours.good, bad: fn.colours.bad }, Un = { phases: 4, ms: 230, dim: 0.25 }, $_ = (e, t, n) => e !== "amber" || (t + n) % Un.phases < Un.phases / 2 ? 1 : Un.dim, x_ = (e) => e === "amber" ? Un.phases : 1;
function S_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const __ = Object.keys(I5), Qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Xt = ([e, t], n) => e + n() * (t - e);
function M_(e) {
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
function C_(e) {
  const t = Math.floor(e / Wa.high);
  return { left: -(ft.inside + ft.width / 2 + t * (ft.width + Wa.gap)), up: e % Wa.high * (ft.height - ft.top) };
}
const R5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, B5 = { after: 5 }, L5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new yr(t).isBuild());
function E_(e, t, n) {
  const a = L5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= B5.after ? s : null;
}
function A_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: R5(n, a, s) } : null;
}
const pl = { ahead: 140, up: 70 };
function O_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * pl.ahead, y: a - pl.up } } : o ? { at: { x: n(o), y: a - o.up - ft.height } } : t ? { at: null } : null;
}
const Ha = { least: 4e3, most: 1e4 }, N5 = (e) => Ha.least + e() * (Ha.most - Ha.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function T_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = N5(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const I_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), R_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Sr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), B_ = new Set(va.filter((e) => Sr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), q5 = (e) => e.some((t) => t.state === "built"), L_ = (e, t) => q5(t) ? e.filter((n) => !Sr.has(n.beat)) : e, vt = { reach: 40, room: 6 }, D5 = (e, t) => t <= e - vt.reach + 2, N_ = (e, t, n) => D5(e, n) ? t - vt.reach : e - vt.reach - vt.room, q_ = (e, t, n, a) => a > 0 && t < e && t + vt.reach >= e - 2 ? Math.min(n, Math.max(e, t + vt.reach)) : e, za = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, D_ = (e) => Xt(e() < za.longShare ? za.long : za.short, e), P5 = 2 * ft.width;
function P_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= P5 ? o : e + (o - e + s / 2) % s;
}
const j5 = 60, j_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= j5, vl = "[data-figure-home]", $n = () => {
  var t;
  const e = document.querySelector(vl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(vl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, F5 = "[data-figure-docked-bars]", W5 = "[data-figure-chat-foot]", H5 = [0.85, 0.6, 0.35, 0.15], z5 = ["question", "waiting", "suggestion"], F_ = (e, t) => z5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function W_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const U5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", G5 = "[data-figure-newest]";
function _r() {
  var a, s;
  const e = (a = $n()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(G5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function hn(e, t, n = _r()) {
  if (!e || !n) return !0;
  const a = rt(e, t), s = ya(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Te.top * t.size, bottom: a.top + Te.bottom * t.size }, l = _t.gap;
  return !ga(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function H_(e, t, n, a = _r()) {
  if (!a || hn(t, e, a)) return null;
  const s = ya(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = At(), r = t.posture === "stand" ? eo * e.size : Rr * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - _t.gap - l, a.right + _t.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= d && hn(p, e, a) && w$(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Ua = 0.26, Mr = 0.54, V5 = 1.25 / 5.4, xn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ua, travels: "stand" },
  lounge: { drop: Ua, travels: "stand" },
  composed: { drop: Ua, travels: "stand" },
  hang: { drop: Mr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, z_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * V5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Mr
}), en = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), K5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), U_ = (e, t) => (e === "sit" ? K5.has(t) : en.has(e)) ? e : "stand";
function G_(e, t) {
  return e.facing === t.facing || !en.has(e.posture) && !en.has(t.posture) ? t : { posture: "stand", facing: en.has(e.posture) ? e.facing : t.facing };
}
const V_ = 0.25, K_ = (e, t) => en.has(e) && xn[t].drop === 0, Cr = 2, Y5 = 90, Q5 = 180, X5 = 140, J5 = 280, Z5 = 420, e$ = 0.25, t$ = 290, n$ = 600, a$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", s$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ga = 5;
function oa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ga) return null;
  (l || i) && (o = Math.max(o, Cr));
  const y = o > 1, b = Math.abs(t.x - e.x), O = b < Ga ? 0 : b / (Y5 * o) * 1e3, S = Math.min(O, y ? X5 : Q5), $ = Math.abs(t.y - e.y), I = t.y < e.y, H = I && !p && k5($, n, r, c, d, h), N = I ? Z5 + Math.min($, 400) * e$ : Math.sqrt(2 * $ / Ys) * 1e3, E = {
    x: t.x,
    y: t.y,
    ms: $ > Ga ? H ? n$ : N : 0,
    lead: H ? t$ : I ? J5 : 0,
    easing: I ? a$ : s$,
    hopping: !0,
    clip: H ? "backflip" : I ? "jump" : "fall"
  }, V = { x: t.x, y: t.y, ms: O + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, W = p ? o$(t, n) : E, q = I && !a ? [{ ...V, y: e.y }, W] : [{ ...E, x: e.x }, V];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !s, pace: o, running: y };
}
const o$ = (e, t) => ({ x: e.x, y: e.y, ms: Ae.pogo.frames / Ae.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), l$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], Y_ = (e, t, n) => e.posture === "walk" && n ? "walk" : l$(e.clip, t), rt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - xn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ga = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Js = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = $n()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Dn = 0.5, gl = 20;
function Q_(e, t, n = At()) {
  const a = rt(e, t);
  return a.left >= n.left + gl && a.right <= n.right - gl;
}
function Zs(e, t, n = At()) {
  const a = rt(e, t), s = a.right - a.left, o = ya(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Dn && i <= n.right + Dn && a.top >= n.top - Dn && r <= n.bottom + Dn;
}
const la = [0.35, 0.5, 0.65], ia = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Te = { left: la[0], right: la.at(-1), top: ia[0], bottom: ia.at(-1) }, i$ = 0.24;
function ya(e) {
  if (e.posture === "stand") return { left: Te.left, right: Te.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + i$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Te.left, t), right: Math.max(Te.right, t) };
}
function r$(e, { size: t }, n = At()) {
  const a = ya(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const eo = (Te.right - Te.left) / 2 + 0.08;
function X_(e, t) {
  return e === "hang" ? Te : { ...Te, bottom: Math.min(Te.bottom, 1 - t - xn[e].drop) };
}
const u$ = "[data-figure-agent]";
function Er(e, t, n = "", a = "") {
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
const Ar = (e) => ia.flatMap(
  (t) => la.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function to(e, t, n = "") {
  if (!hn(e, t)) return la.length * ia.length;
  const a = rt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(U5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && ga(s, r) && Js(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return Ar(s).filter(([i, r]) => l(i, r) || Er(i, r, n)).length;
}
function c$(e, t) {
  const n = rt(e, t);
  return Ar({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Er(a, s, "", u$)).length;
}
const yl = 4;
function J_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = yl; o <= s; o += yl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!c$(i, e) && hn(i, e)) return i;
    }
  return null;
}
function mn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Zs(l, t, a) && hn(l, t)).map((l) => ({ spot: l, covered: to(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Or = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), d$ = [0.5, 0.25, 0.75], f$ = (e) => Or(e.getBoundingClientRect(), d$), Tr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, h$ = eo, m$ = (e, t, { size: n }, a = h$) => Ir(e, Tr[t], a * n, "stand");
function Ir(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const p$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Rr = 0.1, v$ = (e, t, { size: n }) => Ir(e, p$[t], Rr * n, "sit"), g$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Va = 60;
function Z_(e, t) {
  const n = g$(t);
  return !e.aside || Math.abs(n) >= Va ? t : n < 0 ? 360 - Va : Va;
}
const tn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, y$ = (e) => [.../* @__PURE__ */ new Set([e, ...tn.turns.map((t) => (t + 360) % 360)])];
function eM(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = y$(t), l = tn.every[0] + a() * (tn.every[1] - tn.every[0]);
  return { face: t, from: s ? b$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function b$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / tn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function tM(e, t) {
  const { element: n, edge: a } = ba(), s = ["left", "right"].map((i) => Sn(v$(a, i, e), e)).filter((i) => n && Zs(i, e) && !to(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function nM(e, t, { size: n }) {
  const a = (Te.right - Te.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Br } : e;
}
const Br = 7;
function Lr() {
  const e = [...document.querySelectorAll(T5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function k$(e, t) {
  const n = rt(e, t), a = n.right - n.left;
  return { left: n.left + Te.left * a, right: n.left + Te.right * a, top: n.top + Te.top * a, bottom: n.bottom };
}
function w$(e, t) {
  const n = Lr();
  return !n || !ga(k$(e, t), n);
}
const $$ = 4;
function ba() {
  const e = _n(), t = Lr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > $$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Br - n, 0) } };
}
const aM = ({ size: e, below: t }) => (1 - t) * e;
function Sn(e, t) {
  const n = At(), { size: a, below: s } = t, o = xn[e.posture].drop * a;
  return { ...r$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ws = (e, t) => Object.keys(Tr).map((n) => Sn(m$(e, n, t), t)), no = (e, t) => Or(e, H5).map((n) => Sn(n, t)), Nr = (e, t, n) => mn(e, t, n) ?? e[0];
function sM(e, t) {
  const { element: n, edge: a } = ba();
  return { ...Nr(ws(a, e), e, t), view: null, on: n };
}
function oM(e, t, n, a) {
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
  const e = $n(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(F5);
  if (!t) return { ...ka(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const bl = { within: 2 };
function lM(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = ka().edge;
  return a.left > s.left + bl.within || a.left + a.width < s.left + s.width - bl.within;
}
const x$ = "[data-figure-closing]";
function iM() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(x$));
}
const qr = "[data-figure-progress]";
function rM(e) {
  const t = e.querySelector(qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function uM(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const S$ = { across: 300, above: 380, below: 60 };
function cM(e) {
  const { across: t, above: n, below: a } = S$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: _$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const _$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Dr = "[data-figure-bar]", $s = { back: 144, along: 0.4 };
function dM(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(Dr) : null;
  if (!(s != null && s.querySelector(qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Sn({ x: o - $s.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function fM(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < $s.along * a.size ? t.x + $s.along * a.size : e.x, y: e.y, behind: !0 };
}
function hM(e) {
  const t = e.querySelector(Dr), n = t == null ? void 0 : t.firstElementChild;
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
function mM(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = ka(), r = n === null ? M$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Sn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function M$(e, t, n, a, s) {
  const o = no(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + ft.width < s && r.x + a - vt.reach - vt.room >= l);
  return mn(i.length ? i : o, t, n);
}
const C$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function pM(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Cr));
  const y = (H) => {
    const N = rt(H, n, xn[H.posture].travels);
    return { x: N.left, y: N.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return E$(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [O, ...S] = [e, ...r, t].map(y), $ = oa(O, S[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: p }), I = S.slice(1).map((H, N) => {
    var E;
    return (E = oa(S[N], H, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : E.legs.find((V) => V.hopping);
  });
  return $ && { ...$, legs: [...$.legs, ...I.filter(Boolean)] };
}
function E$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / C$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? oa(e, n, o.size, { pace: l }) : oa(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function vM(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function gM(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && mn(f$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ba();
  return { ...Nr(no(s, t), t, n), view: null, on: a };
}
const A$ = "[data-figure-bubble]", O$ = 250;
let nn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Pr = 0;
const Kt = () => nn, Ka = /* @__PURE__ */ new WeakMap();
let T$ = 0;
function ao(e) {
  return Ka.has(e) || Ka.set(e, `floor-${++T$}`), Ka.get(e);
}
const I$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, R$ = () => {
  var e, t;
  return ((t = (e = $n()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function B$(e, t) {
  var a;
  const n = (a = e.querySelector(W5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function L$(e, t) {
  const n = e && B$(e, t), a = e ? [...e.querySelectorAll(A$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || I$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: ao(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const N$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= O$ ? (t.top - a.top) / s * 1e3 : 0;
};
function jr(e = nn, t = performance.now()) {
  const n = At(), a = R$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = ka();
  return c.element && r.push({ id: ao(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...L$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: N$(e, d, t) }))) });
}
const xs = /* @__PURE__ */ new Set();
function q$(e) {
  return xs.add(e), () => xs.delete(e);
}
function D$() {
  Fr();
  const e = () => {
    Pr = requestAnimationFrame(e), !document.hidden && (nn = jr(nn), xs.forEach((t) => t(nn)));
  };
  e();
}
function Fr() {
  cancelAnimationFrame(Pr);
}
const so = 5, P$ = 56, j$ = { share: 0.6 }, F$ = (e) => -Math.sqrt(2 * Ys * j$.share * e), Ht = (e, t) => e.find((n) => n.id === t) ?? null;
function yM(e, t = jr().floors) {
  const n = Ht(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ao(e.on) : null, o = s && Ht(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Wr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Kt().floors) {
  const c = Ht(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || W$(c, d, o)) && H$(d, i, r) ? { x: d.x, y: d.y } : null;
}
const oo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, W$ = (e, t, n) => !oo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function bM(e, t = Kt().floors) {
  if (!oo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= so && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function H$(e, t, n = Kt().floors) {
  const a = Ht(n, "home");
  return e.posture === "hang" && a && rt(e, t).bottom >= a.top ? !1 : Zs(e, t);
}
function kM(e, t, n, a = Kt().floors) {
  const s = Wr(e, n, a);
  if (!e.home) return z$(e, t, s, a);
  if (!s) return null;
  const o = Ht(a, "home"), l = s.y - t.y, i = l > so ? "dropping" : -l > P$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function z$(e, t, n, a) {
  const s = n ? Ht(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: F$(e.risen) };
  if (!n) return null;
  if (oo(t) && n.y - t.y > so) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function wM(e, t, n) {
  const a = eo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function $M(e, t, n, a = Kt().floors) {
  const s = t && Wr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const U$ = ["data-type"], G$ = { class: "figure-floor-name" }, V$ = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", G$, g(e.floor.type), 1)
    ], 12, U$));
  }
}, K$ = /* @__PURE__ */ U(V$, [["__scopeId", "data-v-4e0f1e2e"]]), Y$ = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Q$ = {
  __name: "FigureFloors",
  setup(e) {
    const t = Je(Kt().floors);
    let n = () => {
    };
    return Se(() => {
      n = q$((a) => t.value = a.floors), D$();
    }), Ie(() => {
      n(), Fr();
    }), (a, s) => (u(), f("div", Y$, [
      (u(!0), f(D, null, ae(t.value, (o) => (u(), F(K$, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, xM = /* @__PURE__ */ U(Q$, [["__scopeId", "data-v-e519168b"]]), an = (e) => typeof e == "number" ? e : Date.parse(e);
function SM(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: an(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => an(s.row.created_at) - an(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const kl = 20;
async function _M(e, t, n) {
  for (let a = 0; a < kl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || an(o.created_at) <= an(s.created_at) || !await n()) return a;
  }
  return kl;
}
const X$ = 3, Ya = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function J$(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ya[n.grouping]) == null ? void 0 : a.call(Ya, e.row, n)) || "";
}
function Z$(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function MM(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= X$ ? [Z$(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = J$(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function CM(e) {
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
function e4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const EM = (e) => (t) => t.filter((n) => n.id !== e), AM = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), OM = (e) => (t) => [...t, e], TM = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function IM(e, t = {}) {
  const n = Ue(), a = _(null), s = _("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function RM(e) {
  const t = Ue(), n = _("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Pn = /* @__PURE__ */ new Map();
function t4(e, t) {
  if (Pn.has(e)) return Pn.get(e);
  const n = t().finally(() => Pn.delete(e));
  return Pn.set(e, n), n;
}
function BM() {
  const e = Ue(), t = _(null), n = _("");
  async function a() {
    const s = await t4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const n4 = { class: "cards-page" }, a4 = { class: "cards-bar" }, s4 = { class: "cards-count" }, o4 = { class: "cards" }, l4 = {
  key: 1,
  class: "cards-note"
}, i4 = {
  key: 2,
  class: "cards-note"
}, r4 = ["data-row", "onClick"], u4 = { class: "card-head" }, c4 = { class: "card-title" }, d4 = { class: "card-foot" }, f4 = {
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
    return (a, s) => (u(), f("div", n4, [
      m("div", a4, [
        m("span", s4, g(e.rows.length) + " " + g(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        A(pe, qe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            A(me, {
              name: "plus",
              size: 12
            }),
            ne(" New " + g(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", o4, [
        e.loaded ? e.failure ? (u(), f("p", l4, g(e.failure), 1)) : e.rows.length ? w("", !0) : (u(), f("p", i4, "No " + g(e.noun) + "s yet", 1)) : (u(), F(Ye, {
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
          m("span", u4, [
            A(me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ne(" " + g(e.head(o)), 1),
            A(et, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", c4, g(e.title(o)), 1),
          m("span", d4, g(e.foot(o)), 1)
        ], 8, r4))), 128))
      ]),
      fe(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, LM = /* @__PURE__ */ U(f4, [["__scopeId", "data-v-990e6b37"]]), wl = "newest";
function NM(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Ce(De, null)) == null ? void 0 : c.search, s = _(""), o = _(wl), l = _("all"), i = M(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((p) => e4(p, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === wl ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), r = M(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
}
const h4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, m4 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, p4 = 40, v4 = "top", g4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Ce(De, null)) == null ? void 0 : p.autoScroll, s = M(() => a === v4), o = _(null), l = _(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      var y;
      l.value = i(o.value) >= p4, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    ve(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = r()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return Se(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = r());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), Ke(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (u(), f("div", h4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        fe(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", m4, [
        A(Ut, {
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
              A(me, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = ne(" Newest ", -1))
            ], 512), [
              [Il, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, qM = /* @__PURE__ */ U(g4, [["__scopeId", "data-v-d704d7e3"]]), y4 = ["aria-selected", "data-tab", "onClick"], b4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, k4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ce(De, null), o = M(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = _(null), i = _({ left: 0, width: 0, slides: !1 }), r = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const d = () => je(() => c(!0));
    let h = null;
    return Se(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Ie(() => h == null ? void 0 : h.disconnect()), ve(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, d), ve(() => n.answer, d, { deep: !0 }), (p, y) => (u(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), f(D, null, ae(o.value, (b) => {
        var O, S;
        return u(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((O = e.active) == null ? void 0 : O.key) === b.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === b.key,
          "data-tab": b.key,
          onClick: ($) => a("choose", b)
        }, [
          ne(g(b.label) + " ", 1),
          r(b) ? (u(), f("span", b4, g(e.answer[b.count_field]), 1)) : w("", !0)
        ], 10, y4);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ye({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, DM = /* @__PURE__ */ U(k4, [["__scopeId", "data-v-63fcd326"]]), w4 = {
  class: "tab-body",
  "data-tab-body": ""
}, $4 = { "data-tab-content": "" }, x4 = {
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
    }), (s, o) => (u(), f("div", w4, [
      n.value ? (u(), F(Ye, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : w("", !0),
      Ze(m("div", $4, [
        fe(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Il, !n.value]
      ])
    ]));
  }
}, PM = /* @__PURE__ */ U(x4, [["__scopeId", "data-v-63876533"]]), S4 = {}, _4 = { class: "menu-label" };
function M4(e, t) {
  return u(), f("span", _4, [
    fe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $l = /* @__PURE__ */ U(S4, [["render", M4], ["__scopeId", "data-v-aa955b3e"]]), C4 = {
  class: "search-bar",
  "data-search-bar": ""
}, E4 = { class: "search-bar-control" }, A4 = ["value", "placeholder", "aria-label"], O4 = ["aria-expanded"], T4 = {
  key: 0,
  "data-menu-count": ""
}, I4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var $;
    const a = e, s = n, o = au(), l = (($ = Ce(De, null)) == null ? void 0 : $.search) ?? {}, i = M(() => l.placeholder || a.placeholder), r = l.context ?? [], c = _(null), d = _(null), h = _([]), p = M(() => h.value.length ? h.value[h.value.length - 1].next : r), y = M(() => !!o.menu || r.length > 0), b = (I) => {
      h.value = [], d.value = d.value ? null : I.currentTarget;
    };
    function O(I) {
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
      return u(), f("div", C4, [
        m("div", E4, [
          A(me, {
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
            onKeydown: Mt(S, ["esc"])
          }, null, 40, A4),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            A(me, {
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
            e.menuCount ? (u(), f("span", T4, g(e.menuCount), 1)) : w("", !0),
            A(me, {
              name: "caret",
              size: 12
            })
          ], 8, O4)) : w("", !0)
        ]),
        (N = B(l).button) != null && N.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (E) => s("pick", B(l).button.click))
        }, g(B(l).button.title), 1)) : w("", !0),
        fe(I.$slots, "default", {}, void 0, !0),
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
                ne("‹ " + g(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : w("", !0),
            (u(!0), f(D, null, ae(p.value, (E) => (u(), F(Ft, {
              key: E.title,
              description: E.subtext,
              "data-search-entry": E.title,
              onClick: (V) => O(E)
            }, {
              default: j(() => [
                ne(g(E.title) + g(E.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? w("", !0) : fe(I.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : w("", !0)
      ]);
    };
  }
}, R4 = /* @__PURE__ */ U(I4, [["__scopeId", "data-v-45374bed"]]), B4 = {
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
    return (o, l) => (u(), F(R4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: j(() => [
        A($l, null, {
          default: j(() => [...l[2] || (l[2] = [
            ne("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(D, null, ae(a, (i) => A(Ft, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (r) => e.tools.order.value = i.key
        }, {
          default: j(() => [
            ne(g(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(D, { key: 0 }, [
          A($l, null, {
            default: j(() => [...l[3] || (l[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(D, null, ae(s, (i) => A(Ft, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (r) => e.tools.state.value = i.key
          }, {
            default: j(() => [
              ne(g(i.label), 1)
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
}, jM = /* @__PURE__ */ U(B4, [["__scopeId", "data-v-dab0064d"]]);
function FM() {
  const e = _(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const WM = (e) => import(
  /* @vite-ignore */
  e
), L4 = 86400, Ss = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function N4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ss(t) - Ss(e)) / L4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function HM(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ss(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: N4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Qa = 280, Xa = 240, Ja = 120, q4 = 6, D4 = 14, pn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function P4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Hr(e, t) {
  const n = Math.max(0, P4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function j4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${D4}px)` }), e.offsetHeight, e.style.transition = `height ${Qa}ms ${pn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Hr(t, e));
    const p = s() - i;
    if (!r && p >= Qa && (r = !0, e.style.transition = `opacity ${Xa}ms ease-out, transform ${Xa}ms ${pn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Qa + Xa) return a(h);
    d();
  };
  return a(h), d;
}
function zM(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${q4}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ja}ms ease-out, transform ${Ja}ms ${pn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Hr(t, e)), s() - l < Ja) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const F4 = 140, jn = 220, xl = 5;
function UM({ gap: e = F4, later: t = setTimeout } = {}) {
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
  const c = (d, h, p, y = j4) => {
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
function GM(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${jn}ms ${pn}, opacity ${jn}ms ease-in, margin ${jn}ms ${pn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, jn);
}
const zr = "chat.pins.minimised", Gn = _(Qn(zr, !1));
function Sl(e) {
  Gn.value = e, Ps(zr, e);
}
function W4(e) {
  const t = M(() => e()), n = M(() => Gn.value ? [] : e()), a = () => Sl(!Gn.value), s = Date.now() / 1e3;
  return ve(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && Sl(!1)
  ), { pins: t, visible: n, minimised: Gn, toggle: a };
}
const H4 = ["title"], z4 = {
  key: 0,
  class: "pins-count"
}, U4 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = W4(() => t.pinRows);
    return (o, l) => B(n).length ? (u(), f("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: B(a), inline: e.inline }]),
      title: B(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...i) => B(s) && B(s)(...i), ["stop"]))
    }, [
      A(me, {
        name: B(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      B(a) ? (u(), f("span", z4, g(B(n).length), 1)) : w("", !0)
    ], 10, H4)) : w("", !0);
  }
}, VM = /* @__PURE__ */ U(U4, [["__scopeId", "data-v-d073c504"]]), G4 = ["title"], V4 = ["title"], K4 = { class: "diff-card-dir" }, Y4 = { class: "diff-card-name" }, Q4 = ["title"], X4 = ["title"], J4 = {
  key: 0,
  class: "diff-card-note"
}, Z4 = ["href"], ex = ["src", "alt"], tx = { class: "diff-card-rows" }, nx = { class: "diff-row-num" }, ax = { class: "diff-row-sign" }, sx = { class: "diff-row-code" }, ox = {
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
    function o(C) {
      (C.metaKey || C.ctrlKey) && (C.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = M(() => n.path.lastIndexOf("/") + 1), c = M(() => n.path.slice(0, r.value)), d = M(() => n.path.slice(r.value)), h = M(() => n.change === "deleted"), p = M(() => l[n.change]), y = M(() => new Set(n.rows.filter((C) => C.line_type === "add").map((C) => C.line))), b = _("after"), O = M(() => b.value === "before" ? n.whole.old : n.whole.text), S = M(() => n.whole && n.whole.text !== void 0 ? O.value.split(`
`).map((C, k) => ({ line_type: b.value === "after" && y.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: C })) : n.rows.filter(
      (C) => !(n.editsOnly && ["ctx", "fold"].includes(C.line_type)) && !(n.hideRemovals && C.line_type === "del")
    )), $ = _(!1), I = M(() => n.lines && !$.value && !n.whole), H = M(() => I.value ? S.value.slice(0, n.lines) : S.value), N = M(() => S.value.length - H.value.length), E = (C) => C.line === null || C.line_type === "del" ? "" : C.line, V = (C) => C.line_type === "fold" ? C.hidden ? `⋯ ${C.hidden} lines` : "⋯" : C.text, W = _(null), q = _(null);
    let x = null;
    return Se(() => {
      if (!q.value) return;
      let C = !0;
      x = new ResizeObserver(() => {
        !W.value || !q.value || (W.value.style.transition = C ? "none" : "", W.value.style.height = `${q.value.offsetHeight}px`, C = !1);
      }), x.observe(q.value);
    }), Ie(() => x && x.disconnect()), (C, k) => (u(), f("section", {
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
          m("span", K4, g(c.value), 1),
          m("span", Y4, g(d.value), 1),
          p.value ? (u(), f("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, g(p.value), 3)) : w("", !0)
        ], 8, V4),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + g(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + g(e.removed), 3),
        A(et, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = xe((v) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, g(b.value === "after" ? "After" : "Before"), 9, Q4)) : w("", !0),
        h.value ? w("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = xe((v) => a("whole"), ["stop"]))
        }, [
          A(me, {
            name: "file",
            size: 12
          })
        ], 10, X4))
      ], 8, G4),
      e.whole && e.whole.error ? (u(), f("p", J4, g(e.whole.error), 1)) : w("", !0),
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
          }, null, 8, ex)
        ], 8, Z4)) : (u(), f("div", {
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
            m("div", tx, [
              (u(!0), f(D, null, ae(H.value, (v, R) => (u(), f("div", {
                key: R,
                class: Y(["diff-row", v.line_type, { fresh: e.fresh && v.edit === e.fresh }])
              }, [
                m("span", nx, g(E(v)), 1),
                m("span", ax, g(i[v.line_type]), 1),
                m("span", sx, g(V(v)), 1)
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
}, KM = /* @__PURE__ */ U(ox, [["__scopeId", "data-v-23581cbb"]]), lx = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (u(), F(it(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: j(() => [
        fe(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          fe(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, YM = /* @__PURE__ */ U(lx, [["__scopeId", "data-v-683e1839"]]), ix = { "data-queue-controls": "" }, rx = { class: "counts" }, ux = { "data-queue-spots": "" }, cx = {
  class: "spots",
  "aria-label": "Places in use"
}, dx = { "data-queue-waiting": "" }, fx = { key: 0 }, hx = { class: "control" }, mx = { class: "stepper" }, px = ["disabled"], vx = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, gx = ["disabled"], yx = ["for"], bx = ["id", "value", "disabled", "onChange"], kx = { class: "control" }, wx = ["aria-checked", "disabled"], $x = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, xx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, Sx = {
  key: 2,
  class: "note failure",
  role: "alert"
}, _x = {
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
    return (i, r) => (u(), f("div", ix, [
      A(Wt, { icon: "gauge" }, {
        default: j(() => [...r[3] || (r[3] = [
          ne("Now", -1)
        ])]),
        _: 1
      }),
      m("div", rx, [
        m("div", null, [
          m("strong", ux, [
            ne(g(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + g(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + g(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", cx, [
            (u(!0), f(D, null, ae(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", dx, g(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", fx, "The oldest goes first.")) : w("", !0)
        ])
      ]),
      m("div", hx, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", mx, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, px),
          m("output", vx, g(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, gx)
        ])
      ]),
      (u(!0), f(D, null, ae(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, g(c.title), 9, yx),
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
        }, null, 40, bx)
      ]))), 128)),
      m("div", kx, [
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
        ])], 8, wx)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", $x, [
        A(me, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = ne("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", xx, [
        A(me, {
          name: "pause",
          size: 13
        }),
        ne("The queue is paused. No waiting command gets a place until it is resumed. " + g(e.queue.halt_reason), 1)
      ])) : w("", !0),
      o.value ? (u(), f("p", Sx, g(o.value), 1)) : w("", !0)
    ]));
  }
}, Mx = /* @__PURE__ */ U(_x, [["__scopeId", "data-v-b594afa3"]]), Cx = ["data-queue-row", "data-queue-process"], Ex = ["aria-expanded"], Ax = { class: "run-line" }, Ox = { class: "leading" }, Tx = {
  key: 0,
  "data-queue-position": ""
}, Ix = ["title"], Rx = { class: "command" }, Bx = {
  class: "time",
  "data-queue-time": ""
}, Lx = { class: "details" }, Nx = { "data-queue-type": "" }, qx = { class: "failed" }, Dx = { class: "drop-inner" }, Px = { class: "output" }, jx = { class: "output-heading" }, Fx = ["href"], Wx = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(), o = Zi((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = Vs(), r = M(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = M(() => {
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
          y[3] || (y[3] = Mt(xe((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Mt(xe((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", Ax, [
          m("span", Ox, [
            e.run.section === "waiting" ? (u(), f("span", Tx, g(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, Ix))
          ]),
          m("code", Rx, g(e.run.line), 1),
          m("span", Bx, g(c.value), 1),
          A(me, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", Lx, [
          m("span", Nx, g(r.value), 1),
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
            m("span", qx, "Failed, exit " + g(e.run.exit_code), 1)
          ], 64)) : w("", !0)
        ])
      ], 40, Ex),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", Dx, [
          m("div", Px, [
            m("div", jx, [
              m("span", null, "Output " + g(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Fx)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && B(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              ne(g(e.run.line), 1),
              B(l).length ? (u(), f(D, { key: 0 }, [
                ne(g(`
` + B(l).join(`
`)), 1)
              ], 64)) : w("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, Cx));
  }
}, Hx = /* @__PURE__ */ U(Wx, [["__scopeId", "data-v-001561c5"]]), zx = {
  class: "process-queue",
  "data-test-queue": ""
}, Ux = { class: "scroll" }, Gx = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Vx = ["data-queue-empty"], Za = 20, Kx = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _(null), a = _(""), s = _([]), o = _(Za), l = M(() => {
      var p, y;
      return (((p = n.value) == null ? void 0 : p.recent_total) ?? 0) > (((y = n.value) == null ? void 0 : y.recent.length) ?? 0);
    });
    let i = 0;
    const r = M(() => n.value ? [
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
    async function d() {
      const p = ++i, y = await t.read(o.value === Za ? ["queue", "list"] : ["queue", "list", "--recent", String(o.value)]);
      p === i && (a.value = y.ok ? "" : y.error, y.ok && (n.value = y.value));
    }
    function h() {
      o.value += Za, d();
    }
    return kn(["process.*", "setting.*"], d), Se(d), (p, y) => (u(), f("article", zx, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", Ux, [
        a.value ? (u(), f("p", Gx, g(a.value), 1)) : w("", !0),
        n.value ? (u(), f(D, { key: 1 }, [
          A(Mx, {
            queue: n.value,
            read: e.read,
            onSaved: d
          }, null, 8, ["queue", "read"]),
          A(Ms, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: j(() => [
              (u(!0), f(D, null, ae(r.value, (b) => (u(), f(D, {
                key: b.key
              }, [
                b.run ? (u(), F(Hx, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (O) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (u(), f("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, g(b.section.empty), 9, Vx)) : (u(), F(Wt, {
                  key: 2,
                  icon: b.section.icon,
                  count: b.section.rows.length,
                  "data-queue-heading": b.section.type
                }, {
                  default: j(() => [
                    ne(g(b.section.heading), 1)
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
}, QM = /* @__PURE__ */ U(Kx, [["__scopeId", "data-v-d9b6ef6b"]]), Yx = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, Qx = ["aria-expanded"], Xx = {
  class: "links-count",
  "data-inspector-links-count": ""
}, Jx = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, Zx = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, e8 = {
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
      a.value ? (u(), f("section", Yx, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", Xx, g(a.value), 1),
          A(pt, { open: n.value }, null, 8, ["open"])
        ], 8, Qx),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", Jx, [
            A(Jc, {
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
      o.value ? (u(), f("p", Zx, g(o.value), 1)) : w("", !0)
    ], 64));
  }
}, t8 = /* @__PURE__ */ U(e8, [["__scopeId", "data-v-479ab50f"]]), n8 = ["placeholder"], a8 = { class: "actions" }, s8 = { class: "error" }, o8 = {
  key: 1,
  class: "card closed"
}, l8 = { class: "mark" }, i8 = { class: "prompt" }, r8 = {
  key: 0,
  class: "draft"
}, u8 = {
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
      var b, O;
      i.value = !0, r.value = !1, await je(), (O = ((b = d.value) == null ? void 0 : b.querySelector("input")) || d.value) == null || O.focus();
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
        } catch (O) {
          o.value = b, l.value = O.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, O) => (u(), f("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(y, ["prevent"]),
        onKeydown: Mt(p, ["esc"])
      }, [
        fe(b.$slots, "who", {}, void 0, !0),
        Ze(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": O[0] || (O[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: O[1] || (O[1] = Mt((S) => B(Ni)(S, y), ["enter"]))
        }, null, 40, n8), [
          [Kn, o.value]
        ]),
        m("div", a8, [
          m("span", s8, g(l.value), 1),
          A(pe, {
            small: "",
            onClick: p
          }, {
            default: j(() => [...O[3] || (O[3] = [
              ne("Cancel", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: j(() => [...O[4] || (O[4] = [
              ne("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", o8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", l8, [
            A(me, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", i8, g(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", r8, "Draft kept")) : w("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: O[2] || (O[2] = (S) => s("show"))
        }, [
          m("span", null, g(B(ed)(e.count, "comment")), 1),
          A(me, {
            name: "down",
            size: 12
          })
        ])) : w("", !0)
      ]))
    ], 2));
  }
}, c8 = /* @__PURE__ */ U(u8, [["__scopeId", "data-v-b68baddd"]]), d8 = { wide: 1130 }, f8 = /\{([A-Za-z_]\w*)\}/g;
function Vn(e, t, n = {}) {
  return e.replace(f8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const h8 = (e, t, n, a) => Vn(e.label, n, { row_id: a, id: a }) || Aw(t, n, a), m8 = { class: "comment-side-head" }, p8 = {
  key: 0,
  class: "comment-none"
}, v8 = { key: 0 }, g8 = {
  key: 1,
  class: "comment-none"
}, y8 = {
  class: "comment",
  "data-comment": ""
}, b8 = {
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
      m("header", m8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        A(fa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", p8, "No comments yet")) : w("", !0),
      (u(!0), f(D, null, ae(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", v8, g(a.quote), 1)) : w("", !0),
        a.revision ? (u(), f("span", g8, "Revision " + g(a.revision), 1)) : w("", !0),
        m("p", y8, g(e.words(a)), 1)
      ]))), 128)),
      A(vn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, _l = /* @__PURE__ */ U(b8, [["__scopeId", "data-v-276284a3"]]), k8 = { class: "resource-heading" }, w8 = { class: "resource-type" }, $8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, x8 = {
  key: 1,
  class: "resource-abstract"
}, S8 = {
  __name: "ResourceHeading",
  props: { label: String, title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", k8, [
      m("p", w8, g(e.label), 1),
      e.title ? (u(), f("h2", $8, g(e.title), 1)) : w("", !0),
      e.abstract ? (u(), f("p", x8, g(e.abstract), 1)) : w("", !0)
    ]));
  }
}, _8 = /* @__PURE__ */ U(S8, [["__scopeId", "data-v-e70bb004"]]), M8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, C8 = { class: "inspector-icons" }, E8 = { class: "inspector-icons-start" }, A8 = { class: "inspector-icons-end" }, O8 = ["href"], T8 = {
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
    return (i, r) => (u(), f("header", M8, [
      m("div", C8, [
        m("span", E8, [
          e.backed ? (u(), F(pe, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: r[0] || (r[0] = (c) => a("back"))
          }, {
            default: j(() => [
              A(me, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : w("", !0),
          e.stepped ? (u(), f(D, { key: 1 }, [
            A(pe, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: r[1] || (r[1] = (c) => a("step", -1))
            }, {
              default: j(() => [
                A(me, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            A(pe, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: r[2] || (r[2] = (c) => a("step", 1))
            }, {
              default: j(() => [
                A(me, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : w("", !0)
        ]),
        m("span", A8, [
          e.embedded ? (u(), F(pe, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: r[3] || (r[3] = (c) => B(Ne)(s.value))
          }, {
            default: j(() => [
              A(me, {
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
            href: B(Df)(s.value)
          }, [
            A(me, {
              name: "share",
              size: 13
            })
          ], 8, O8)) : w("", !0),
          e.embedded ? w("", !0) : (u(), F(pe, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: r[4] || (r[4] = (c) => a("close"))
          }, {
            default: j(() => [
              A(me, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(_8, {
        label: e.label,
        title: e.title,
        abstract: e.description
      }, null, 8, ["label", "title", "abstract"])
    ]));
  }
}, I8 = /* @__PURE__ */ U(T8, [["__scopeId", "data-v-51401f06"]]), R8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, B8 = { class: "field-name" }, L8 = {
  key: 1,
  class: "field-value"
}, N8 = ["onClick"], q8 = {
  key: 2,
  class: "field-value"
}, D8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", R8, [
      (u(!0), f(D, null, ae(e.fields, (o) => (u(), f(D, {
        key: o.name
      }, [
        m("p", B8, g(o.label), 1),
        o.isTime ? (u(), F(et, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", L8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, g(o.value), 9, N8)
        ])) : (u(), f("p", q8, g(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, P8 = /* @__PURE__ */ U(D8, [["__scopeId", "data-v-7e45afb5"]]);
async function j8(e, t) {
  const n = await e(["agent", "show", String(t.agent_id)]);
  return n.ok ? Tw(t, n.value) : "";
}
async function F8(e, t) {
  const n = await e(["actor", "show", String(t)]), a = n.ok && n.value.type === "agent" ? await e(["agent", "show", String(t)]) : { ok: !1 };
  return n.ok ? Ow(n.value, a.ok ? a.value : null) : "";
}
const W8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, H8 = {
  key: 1,
  class: "inspector-wait"
}, z8 = { class: "inspector-main" }, U8 = { class: "inspector-column" }, G8 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, V8 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, K8 = { class: "inspector-text" }, Y8 = ["innerHTML"], Q8 = {
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
      lists_fields: !0,
      draws_text: !1
    }), l = _(null), i = _(""), r = _(""), c = _(""), d = _("details"), h = _(null), p = _(0);
    let y = 0;
    const b = M(() => ({ row_id: n.id, id: n.id })), O = M(() => l.value ? Vn(o.value.title, l.value, b.value) || Ew(n.noun, l.value, n.id) : ""), S = M(() => l.value ? h8(o.value, n.noun, l.value, n.id) : ""), $ = M(() => S.value === O.value ? "" : S.value), I = M(() => l.value ? Vn(o.value.description, l.value, b.value) : ""), H = M(() => {
      var L, P, J;
      return ((L = l.value) == null ? void 0 : L.body) || ((P = l.value) == null ? void 0 : P.brief) || (s.has(n.noun) ? (J = l.value) == null ? void 0 : J.text : "") || "";
    }), N = M(() => H.value ? Fs(H.value, { env: "", rowNames: !1 }) : ""), E = M(() => Iw(l.value, H.value, i.value, r.value)), V = M(() => o.value.comments && p.value >= d8.wide), W = M(() => o.value.comments && !V.value), q = (L) => o.value.components.filter((P) => (P.tab || "") === L).map((P) => P.window), x = M(() => [...new Set(o.value.components.map((L) => L.tab).filter(Boolean))]), C = M(() => x.value.length || W.value ? [{ key: "details", label: "Details" }, ...x.value.map((L) => ({ key: L, label: L })), ...W.value ? [{ key: "comments", label: "Comments" }] : []] : []), k = Wi(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (L) => n.read(L));
    async function v(L, P) {
      const J = await P;
      return L === y ? J : "";
    }
    async function R() {
      const L = ++y, P = await n.read(Vn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      L === y && (c.value = P.ok ? "" : P.error, P.ok && (l.value = P.value, l.value.creator_id && (i.value = await v(L, F8(n.read, l.value.creator_id))), l.value.agent_id && (r.value = await v(L, j8(n.read, l.value)))));
    }
    ve(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", R();
    }, { immediate: !0 }), kn(o.value.events, R), ve(k.open, (L) => L && W.value && (d.value = "comments"));
    let T = null;
    return Se(() => {
      var L;
      p.value = ((L = h.value) == null ? void 0 : L.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (T = new ResizeObserver(() => p.value = h.value.clientWidth), T.observe(h.value));
    }), Ie(() => T == null ? void 0 : T.disconnect()), (L, P) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(I8, {
        label: $.value,
        title: O.value,
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
      c.value ? (u(), f("p", W8, g(c.value), 1)) : l.value ? (u(), f(D, { key: 2 }, [
        A(Qi, null, {
          default: j(() => [
            A(Ds, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: R
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", z8, [
          m("div", U8, [
            C.value.length ? (u(), f("div", G8, [
              A(jt, {
                options: C.value,
                value: d.value,
                onPick: P[3] || (P[3] = (J) => d.value = J)
              }, null, 8, ["options", "value"])
            ])) : w("", !0),
            m("div", V8, [
              A(Gt, { value: d.value }, {
                details: j(() => [
                  m("div", K8, [
                    N.value && !o.value.draws_text ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: N.value
                    }, null, 8, Y8)) : w("", !0),
                    o.value.lists_fields ? (u(), F(P8, {
                      key: 1,
                      fields: E.value,
                      onPeek: P[4] || (P[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : w("", !0)
                  ]),
                  A(hs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: q(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  A(_l, {
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
                  A(hs, {
                    names: q(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), F(t8, {
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
            o.value.comments ? (u(), F(c8, {
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
      ], 64)) : (u(), f("div", H8, [
        A(Ye)
      ]))
    ], 512));
  }
}, X8 = /* @__PURE__ */ U(Q8, [["__scopeId", "data-v-e194a998"]]), XM = {
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
    return (n, a) => (u(), F(X8, qe(n.$props, {
      catalogue: B(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, J8 = { class: "facts" }, Z8 = { class: "fact wide" }, e3 = ["title"], t3 = {
  key: 1,
  class: "fact-value"
}, n3 = {
  key: 0,
  class: "fact"
}, a3 = { class: "fact-value" }, s3 = { class: "fact" }, o3 = { class: "fact-label" }, l3 = ["title"], i3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, r3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, u3 = {
  key: 2,
  class: "fact"
}, c3 = { class: "fact-value" }, d3 = { class: "fact wide" }, f3 = { class: "fact-label" }, h3 = { class: "fact wide" }, m3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, p3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ta.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var r, c;
      return u(), f("div", J8, [
        m("div", Z8, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (d) => B(Ne)(`plans:${e.place.plan_id}`))
          }, "Plan " + g(e.place.plan_id) + ": " + g(e.place.plan_title), 9, e3)) : (u(), f("span", t3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (u(), f("div", n3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", a3, g(e.place.phase_number) + " of " + g(e.place.phase_total) + ": " + g(e.place.phase_title), 1)
        ])) : w("", !0),
        e.task.helper_id ? (u(), f(D, { key: 1 }, [
          m("div", s3, [
            m("span", o3, g(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (d) => B(Ne)(`agents:${e.task.helper_id}`))
            }, g(e.task.helper_name), 9, l3)
          ]),
          B(o).has(e.task.state) ? (u(), f("p", i3, g(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", r3, g(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : w("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", u3, [
          i[6] || (i[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", c3, "Agent " + g(e.task.holder_id), 1)
        ])) : w("", !0),
        m("div", d3, [
          m("span", f3, [
            i[7] || (i[7] = ne(" Complexity ", -1)),
            A(ti, {
              lines: B(Yi).map((d, h) => `${h + 1}: ${d}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(jt, {
            options: B(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (d) => s("complexity", d))
          }, null, 8, ["options", "value"])
        ]),
        m("div", h3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          A(jt, {
            options: B(n),
            value: String(B(Ki)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", m3, g(e.refusal), 1)) : w("", !0)
        ])
      ]);
    };
  }
}, v3 = /* @__PURE__ */ U(p3, [["__scopeId", "data-v-a8bf3e2c"]]);
function g3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
  return { above: o.reverse(), below: l };
}
const y3 = { class: "number" }, b3 = { class: "title" }, k3 = { class: "word" }, w3 = {
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
    return (a, s) => (u(), F(it(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        A(bn, { status: e.status }, null, 8, ["status"]),
        m("span", y3, g(e.number), 1),
        m("span", b3, g(e.title), 1),
        m("span", k3, g(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, es = /* @__PURE__ */ U(w3, [["__scopeId", "data-v-f6417ae8"]]), $3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, x3 = { class: "level" }, S3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1);
    ve(() => n.task.id, () => s.value = !1);
    const o = M(() => g3(n.task.id, n.graph)), l = M(() => s.value ? o.value.above : o.value.above.slice(-1)), i = M(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = M(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, p = !1) => ({ status: un(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), f("section", $3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(D, null, ae(l.value, (y) => (u(), f(D, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", x3, [
          (u(!0), f(D, null, ae(y, (b) => (u(), F(es, qe({
            key: b.id,
            ref_for: !0
          }, d(b), {
            onSelect: p[0] || (p[0] = (O) => a("select", O))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(es, su(ou(d(e.task, !0))), null, 16),
      (u(!0), f(D, null, ae(i.value, (y) => (u(), f(D, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        A(es, qe({ ref_for: !0 }, d(y), {
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
}, _3 = /* @__PURE__ */ U(S3, [["__scopeId", "data-v-79c52417"]]), M3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, C3 = ["datetime"], E3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", M3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(D, null, ae(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, g(new Date(a.created_at).toLocaleString()), 9, C3),
        m("p", null, g(a.reason), 1)
      ]))), 128))
    ])) : w("", !0);
  }
}, A3 = /* @__PURE__ */ U(E3, [["__scopeId", "data-v-b41f213b"]]), O3 = {
  class: "part",
  "data-resource-waits": ""
}, T3 = ["onClick"], I3 = { class: "wait-id" }, R3 = { class: "wait-title" }, B3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", O3, [
      m("h4", null, g(e.title), 1),
      (u(!0), f(D, null, ae(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(bn, {
          status: B(un)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", I3, g(o.id), 1),
        m("span", R3, g(o.title), 1)
      ], 8, T3))), 128))
    ]));
  }
}, Ml = /* @__PURE__ */ U(B3, [["__scopeId", "data-v-8fb2e251"]]), L3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, N3 = { class: "text" }, q3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, D3 = 180, P3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = _(!1), l = M(() => a.task.waits.filter((r) => !n.has(r.state))), i = M(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(D, null, [
      l.value.length ? (u(), F(Ml, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : w("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", L3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", N3, g(e.task.outcome), 1)
      ])) : w("", !0),
      e.task.brief ? (u(), f("section", q3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, g(e.task.brief), 3),
        e.task.brief.length > D3 && !o.value ? (u(), f("button", {
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
}, j3 = /* @__PURE__ */ U(P3, [["__scopeId", "data-v-4a3f1e79"]]), F3 = {
  class: "task-details",
  "data-task-details": ""
}, W3 = { class: "since" }, H3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, z3 = { class: "text" }, U3 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, G3 = {
  key: 1,
  class: "note"
}, V3 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, K3 = { class: "text" }, Y3 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", F3, [
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
            A(bn, {
              status: B(un)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + g(a(e.task.state)), 1)
          ]),
          m("span", W3, [
            o[5] || (o[5] = ne(" since ", -1)),
            A(et, {
              at: B(ph)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", H3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", z3, g(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", U3, "Opens by itself when " + g(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", G3, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", V3, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", K3, g(e.task.reason), 1)
        ])) : w("", !0),
        e.graph ? (u(), F(_3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : w("", !0),
        A(v3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(j3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(A3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, JM = /* @__PURE__ */ U(Y3, [["__scopeId", "data-v-7e73fa21"]]), Q3 = 50, X3 = { messages: 25 }, J3 = (e) => X3[e] || Q3, Z3 = {
  class: "task-log",
  "aria-label": "Task log"
}, eS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, tS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, nS = { class: "entries" }, aS = ["data-task-log-important"], sS = ["datetime"], oS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, lS = {
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
        String(J3("task_logs")),
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
    }), (c, d) => (u(), f("section", Z3, [
      o.value ? (u(), F(Ye, { key: 0 })) : l.value ? (u(), f(D, { key: 1 }, [
        m("p", eS, g(l.value), 1),
        A(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => r(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(D, { key: 2 }, [
        n.value.length ? w("", !0) : (u(), f("p", tS, "No log entries yet.")),
        m("ol", nS, [
          (u(!0), f(D, null, ae(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, g(new Date(h.created_at).toLocaleString()), 9, sS),
            m("p", null, g(h.line), 1)
          ], 10, aS))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", oS, [
          A(pe, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => r(a.value - 1))
          }, {
            default: j(() => [...d[4] || (d[4] = [
              ne("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + g(a.value), 1),
          A(pe, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => r(a.value + 1))
          }, {
            default: j(() => [...d[5] || (d[5] = [
              ne("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : w("", !0)
      ], 64))
    ]));
  }
}, ZM = /* @__PURE__ */ U(lS, [["__scopeId", "data-v-cfa43bf1"]]);
function iS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ts = { exports: {} }, Cl;
function rS() {
  return Cl || (Cl = 1, (function(e, t) {
    var n = (function() {
      var a = function(E, V) {
        var W = 236, q = 17, x = E, C = o[V], k = null, v = 0, R = null, T = [], L = {}, P = function(K, Q) {
          v = x * 4 + 17, k = (function(G) {
            for (var X = new Array(G), Z = 0; Z < G; Z += 1) {
              X[Z] = new Array(G);
              for (var le = 0; le < G; le += 1)
                X[Z][le] = null;
            }
            return X;
          })(v), J(0, 0), J(v - 7, 0), J(0, v - 7), oe(), se(), ie(K, Q), x >= 7 && ge(K), R == null && (R = Pe(x, C, T)), ee(R, Q);
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
        }, oe = function() {
          for (var K = i.getPatternPosition(x), Q = 0; Q < K.length; Q += 1)
            for (var G = 0; G < K.length; G += 1) {
              var X = K[Q], Z = K[G];
              if (k[X][Z] == null)
                for (var le = -2; le <= 2; le += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    le == -2 || le == 2 || ce == -2 || ce == 2 || le == 0 && ce == 0 ? k[X + le][Z + ce] = !0 : k[X + le][Z + ce] = !1;
            }
        }, ge = function(K) {
          for (var Q = i.getBCHTypeNumber(x), G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            k[Math.floor(G / 3)][G % 3 + v - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            k[G % 3 + v - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, ie = function(K, Q) {
          for (var G = C << 3 | Q, X = i.getBCHTypeInfo(G), Z = 0; Z < 15; Z += 1) {
            var le = !K && (X >> Z & 1) == 1;
            Z < 6 ? k[Z][8] = le : Z < 8 ? k[Z + 1][8] = le : k[v - 15 + Z][8] = le;
          }
          for (var Z = 0; Z < 15; Z += 1) {
            var le = !K && (X >> Z & 1) == 1;
            Z < 8 ? k[8][v - Z - 1] = le : Z < 9 ? k[8][15 - Z - 1 + 1] = le : k[8][15 - Z - 1] = le;
          }
          k[v - 8][8] = !K;
        }, ee = function(K, Q) {
          for (var G = -1, X = v - 1, Z = 7, le = 0, ce = i.getMaskFunction(Q), ue = v - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var $e = 0; $e < 2; $e += 1)
                if (k[X][ue - $e] == null) {
                  var Ee = !1;
                  le < K.length && (Ee = (K[le] >>> Z & 1) == 1);
                  var he = ce(X, ue - $e);
                  he && (Ee = !Ee), k[X][ue - $e] = Ee, Z -= 1, Z == -1 && (le += 1, Z = 7);
                }
              if (X += G, X < 0 || v <= X) {
                X -= G, G = -G;
                break;
              }
            }
        }, te = function(K, Q) {
          for (var G = 0, X = 0, Z = 0, le = new Array(Q.length), ce = new Array(Q.length), ue = 0; ue < Q.length; ue += 1) {
            var $e = Q[ue].dataCount, Ee = Q[ue].totalCount - $e;
            X = Math.max(X, $e), Z = Math.max(Z, Ee), le[ue] = new Array($e);
            for (var he = 0; he < le[ue].length; he += 1)
              le[ue][he] = 255 & K.getBuffer()[he + G];
            G += $e;
            var Fe = i.getErrorCorrectPolynomial(Ee), We = c(le[ue], Fe.getLength() - 1), lo = We.mod(Fe);
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
              he < le[ue].length && (wa[Mn] = le[ue][he], Mn += 1);
          for (var he = 0; he < Z; he += 1)
            for (var ue = 0; ue < Q.length; ue += 1)
              he < ce[ue].length && (wa[Mn] = ce[ue][he], Mn += 1);
          return wa;
        }, Pe = function(K, Q, G) {
          for (var X = d.getRSBlocks(K, Q), Z = h(), le = 0; le < G.length; le += 1) {
            var ce = G[le];
            Z.put(ce.getMode(), 4), Z.put(ce.getLength(), i.getLengthInBits(ce.getMode(), K)), ce.write(Z);
          }
          for (var ue = 0, le = 0; le < X.length; le += 1)
            ue += X[le].dataCount;
          if (Z.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + Z.getLengthInBits() + ">" + ue * 8 + ")";
          for (Z.getLengthInBits() + 4 <= ue * 8 && Z.put(0, 4); Z.getLengthInBits() % 8 != 0; )
            Z.putBit(!1);
          for (; !(Z.getLengthInBits() >= ue * 8 || (Z.put(W, 8), Z.getLengthInBits() >= ue * 8)); )
            Z.put(q, 8);
          return te(Z, X);
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
              G = O(K);
              break;
            default:
              throw "mode:" + Q;
          }
          T.push(G), R = null;
        }, L.isDark = function(K, Q) {
          if (K < 0 || v <= K || Q < 0 || v <= Q)
            throw K + "," + Q;
          return k[K][Q];
        }, L.getModuleCount = function() {
          return v;
        }, L.make = function() {
          if (x < 1) {
            for (var K = 1; K < 40; K++) {
              for (var Q = d.getRSBlocks(K, C), G = h(), X = 0; X < T.length; X++) {
                var Z = T[X];
                G.put(Z.getMode(), 4), G.put(Z.getLength(), i.getLengthInBits(Z.getMode(), K)), Z.write(G);
              }
              for (var le = 0, X = 0; X < Q.length; X++)
                le += Q[X].dataCount;
              if (G.getLengthInBits() <= le * 8)
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
          var le = L.getModuleCount() * K + Q * 2, ce, ue, $e, Ee, he = "", Fe;
          for (Fe = "l" + K + ",0 0," + K + " -" + K + ",0 0,-" + K + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += Z.scalable ? "" : ' width="' + le + 'px" height="' + le + 'px"', he += ' viewBox="0 0 ' + le + " " + le + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += X.text || G.text ? ' role="img" aria-labelledby="' + Ot([X.id, G.id].join(" ").trim()) + '"' : "", he += ">", he += X.text ? '<title id="' + Ot(X.id) + '">' + Ot(X.text) + "</title>" : "", he += G.text ? '<description id="' + Ot(G.id) + '">' + Ot(G.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', $e = 0; $e < L.getModuleCount(); $e += 1)
            for (Ee = $e * K + Q, ce = 0; ce < L.getModuleCount(); ce += 1)
              L.isDark($e, ce) && (ue = ce * K + Q, he += "M" + ue + "," + Ee + Fe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, L.createDataURL = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var G = L.getModuleCount() * K + Q * 2, X = Q, Z = G - Q;
          return N(G, G, function(le, ce) {
            if (X <= le && le < Z && X <= ce && ce < Z) {
              var ue = Math.floor((le - X) / K), $e = Math.floor((ce - X) / K);
              return L.isDark($e, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(K, Q, G) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var X = L.getModuleCount() * K + Q * 2, Z = "";
          return Z += "<img", Z += ' src="', Z += L.createDataURL(K, Q), Z += '"', Z += ' width="', Z += X, Z += '"', Z += ' height="', Z += X, Z += '"', G && (Z += ' alt="', Z += Ot(G), Z += '"'), Z += "/>", Z;
        };
        var Ot = function(K) {
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
        }, Ur = function(K) {
          var Q = 1;
          K = typeof K > "u" ? Q * 2 : K;
          var G = L.getModuleCount() * Q + K * 2, X = K, Z = G - K, le, ce, ue, $e, Ee, he = {
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
          for (le = 0; le < G; le += 2) {
            for (ue = Math.floor((le - X) / Q), $e = Math.floor((le + 1 - X) / Q), ce = 0; ce < G; ce += 1)
              Ee = "█", X <= ce && ce < Z && X <= le && le < Z && L.isDark(ue, Math.floor((ce - X) / Q)) && (Ee = " "), X <= ce && ce < Z && X <= le + 1 && le + 1 < Z && L.isDark($e, Math.floor((ce - X) / Q)) ? Ee += " " : Ee += "█", We += K < 1 && le + 1 >= Z ? Fe[Ee] : he[Ee];
            We += `
`;
          }
          return G % 2 && K > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return L.createASCII = function(K, Q) {
          if (K = K || 1, K < 2)
            return Ur(Q);
          K -= 1, Q = typeof Q > "u" ? K * 2 : Q;
          var G = L.getModuleCount() * K + Q * 2, X = Q, Z = G - Q, le, ce, ue, $e, Ee = Array(K + 1).join("██"), he = Array(K + 1).join("  "), Fe = "", We = "";
          for (le = 0; le < G; le += 1) {
            for (ue = Math.floor((le - X) / K), We = "", ce = 0; ce < G; ce += 1)
              $e = 1, X <= ce && ce < Z && X <= le && le < Z && L.isDark(ue, Math.floor((ce - X) / K)) && ($e = 0), We += $e ? Ee : he;
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
          for (var x = I(E), C = function() {
            var se = x.read();
            if (se == -1) throw "eof";
            return se;
          }, k = 0, v = {}; ; ) {
            var R = x.read();
            if (R == -1) break;
            var T = C(), L = C(), P = C(), J = String.fromCharCode(R << 8 | T), z = L << 8 | P;
            v[J] = z, k += 1;
          }
          if (k != V)
            throw k + " != " + V;
          return v;
        })(), q = 63;
        return function(x) {
          for (var C = [], k = 0; k < x.length; k += 1) {
            var v = x.charCodeAt(k);
            if (v < 128)
              C.push(v);
            else {
              var R = W[x.charAt(k)];
              typeof R == "number" ? (R & 255) == R ? C.push(R) : (C.push(R >>> 8), C.push(R & 255)) : C.push(q);
            }
          }
          return C;
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
        ], V = 1335, W = 7973, q = 21522, x = {}, C = function(k) {
          for (var v = 0; k != 0; )
            v += 1, k >>>= 1;
          return v;
        };
        return x.getBCHTypeInfo = function(k) {
          for (var v = k << 10; C(v) - C(V) >= 0; )
            v ^= V << C(v) - C(V);
          return (k << 10 | v) ^ q;
        }, x.getBCHTypeNumber = function(k) {
          for (var v = k << 12; C(v) - C(W) >= 0; )
            v ^= W << C(v) - C(W);
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
          for (var v = k.getModuleCount(), R = 0, T = 0; T < v; T += 1)
            for (var L = 0; L < v; L += 1) {
              for (var P = 0, J = k.isDark(T, L), z = -1; z <= 1; z += 1)
                if (!(T + z < 0 || v <= T + z))
                  for (var se = -1; se <= 1; se += 1)
                    L + se < 0 || v <= L + se || z == 0 && se == 0 || J == k.isDark(T + z, L + se) && (P += 1);
              P > 5 && (R += 3 + P - 5);
            }
          for (var T = 0; T < v - 1; T += 1)
            for (var L = 0; L < v - 1; L += 1) {
              var oe = 0;
              k.isDark(T, L) && (oe += 1), k.isDark(T + 1, L) && (oe += 1), k.isDark(T, L + 1) && (oe += 1), k.isDark(T + 1, L + 1) && (oe += 1), (oe == 0 || oe == 4) && (R += 3);
            }
          for (var T = 0; T < v; T += 1)
            for (var L = 0; L < v - 6; L += 1)
              k.isDark(T, L) && !k.isDark(T, L + 1) && k.isDark(T, L + 2) && k.isDark(T, L + 3) && k.isDark(T, L + 4) && !k.isDark(T, L + 5) && k.isDark(T, L + 6) && (R += 40);
          for (var L = 0; L < v; L += 1)
            for (var T = 0; T < v - 6; T += 1)
              k.isDark(T, L) && !k.isDark(T + 1, L) && k.isDark(T + 2, L) && k.isDark(T + 3, L) && k.isDark(T + 4, L) && !k.isDark(T + 5, L) && k.isDark(T + 6, L) && (R += 40);
          for (var ge = 0, L = 0; L < v; L += 1)
            for (var T = 0; T < v; T += 1)
              k.isDark(T, L) && (ge += 1);
          var ie = Math.abs(100 * ge / v / v - 50) / 5;
          return R += ie * 10, R;
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
          for (var C = new Array(E.length - x + V), k = 0; k < E.length - x; k += 1)
            C[k] = E[k + x];
          return C;
        })(), q = {};
        return q.getAt = function(x) {
          return W[x];
        }, q.getLength = function() {
          return W.length;
        }, q.multiply = function(x) {
          for (var C = new Array(q.getLength() + x.getLength() - 1), k = 0; k < q.getLength(); k += 1)
            for (var v = 0; v < x.getLength(); v += 1)
              C[k + v] ^= r.gexp(r.glog(q.getAt(k)) + r.glog(x.getAt(v)));
          return c(C, 0);
        }, q.mod = function(x) {
          if (q.getLength() - x.getLength() < 0)
            return q;
          for (var C = r.glog(q.getAt(0)) - r.glog(x.getAt(0)), k = new Array(q.getLength()), v = 0; v < q.getLength(); v += 1)
            k[v] = q.getAt(v);
          for (var v = 0; v < x.getLength(); v += 1)
            k[v] ^= r.gexp(r.glog(x.getAt(v)) + C);
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
        ], V = function(x, C) {
          var k = {};
          return k.totalCount = x, k.dataCount = C, k;
        }, W = {}, q = function(x, C) {
          switch (C) {
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
        return W.getRSBlocks = function(x, C) {
          var k = q(x, C);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + C;
          for (var v = k.length / 3, R = [], T = 0; T < v; T += 1)
            for (var L = k[T * 3 + 0], P = k[T * 3 + 1], J = k[T * 3 + 2], z = 0; z < L; z += 1)
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
          for (var C = 0; C < x; C += 1)
            W.putBit((q >>> x - C - 1 & 1) == 1);
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
            v = v * 10 + C(k.charAt(R));
          return v;
        }, C = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return q;
      }, y = function(E) {
        var V = s.MODE_ALPHA_NUM, W = E, q = {};
        q.getMode = function() {
          return V;
        }, q.getLength = function(C) {
          return W.length;
        }, q.write = function(C) {
          for (var k = W, v = 0; v + 1 < k.length; )
            C.put(
              x(k.charAt(v)) * 45 + x(k.charAt(v + 1)),
              11
            ), v += 2;
          v < k.length && C.put(x(k.charAt(v)), 6);
        };
        var x = function(C) {
          if ("0" <= C && C <= "9")
            return C.charCodeAt(0) - 48;
          if ("A" <= C && C <= "Z")
            return C.charCodeAt(0) - 65 + 10;
          switch (C) {
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
              throw "illegal char :" + C;
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
          for (var C = 0; C < W.length; C += 1)
            x.put(W[C], 8);
        }, q;
      }, O = function(E) {
        var V = s.MODE_KANJI, W = a.stringToBytesFuncs.SJIS;
        if (!W)
          throw "sjis not supported.";
        (function(C, k) {
          var v = W(C);
          if (v.length != 2 || (v[0] << 8 | v[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var q = W(E), x = {};
        return x.getMode = function() {
          return V;
        }, x.getLength = function(C) {
          return ~~(q.length / 2);
        }, x.write = function(C) {
          for (var k = q, v = 0; v + 1 < k.length; ) {
            var R = (255 & k[v]) << 8 | 255 & k[v + 1];
            if (33088 <= R && R <= 40956)
              R -= 33088;
            else if (57408 <= R && R <= 60351)
              R -= 49472;
            else
              throw "illegal char at " + (v + 1) + "/" + R;
            R = (R >>> 8 & 255) * 192 + (R & 255), C.put(R, 13), v += 2;
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
          for (var C = 0; C < x; C += 1)
            V.writeByte(W[C + q]);
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
        var E = 0, V = 0, W = 0, q = "", x = {}, C = function(v) {
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
            C(E >>> V - 6), V -= 6;
        }, x.flush = function() {
          if (V > 0 && (C(E << 6 - V), E = 0, V = 0), W % 3 != 0)
            for (var v = 3 - W % 3, R = 0; R < v; R += 1)
              q += "=";
        }, x.toString = function() {
          return q;
        }, x;
      }, I = function(E) {
        var V = E, W = 0, q = 0, x = 0, C = {};
        C.read = function() {
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
        return C;
      }, H = function(E, V) {
        var W = E, q = V, x = new Array(E * V), C = {};
        C.setPixel = function(T, L, P) {
          x[L * W + T] = P;
        }, C.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(W), T.writeShort(q), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(W), T.writeShort(q), T.writeByte(0);
          var L = 2, P = v(L);
          T.writeByte(L);
          for (var J = 0; P.length - J > 255; )
            T.writeByte(255), T.writeBytes(P, J, 255), J += 255;
          T.writeByte(P.length - J), T.writeBytes(P, J, P.length - J), T.writeByte(0), T.writeString(";");
        };
        var k = function(T) {
          var L = T, P = 0, J = 0, z = {};
          return z.write = function(se, oe) {
            if (se >>> oe)
              throw "length over";
            for (; P + oe >= 8; )
              L.writeByte(255 & (se << P | J)), oe -= 8 - P, se >>>= 8 - P, J = 0, P = 0;
            J = se << P | J, P = P + oe;
          }, z.flush = function() {
            P > 0 && L.writeByte(J);
          }, z;
        }, v = function(T) {
          for (var L = 1 << T, P = (1 << T) + 1, J = T + 1, z = R(), se = 0; se < L; se += 1)
            z.add(String.fromCharCode(se));
          z.add(String.fromCharCode(L)), z.add(String.fromCharCode(P));
          var oe = S(), ge = k(oe);
          ge.write(L, J);
          var ie = 0, ee = String.fromCharCode(x[ie]);
          for (ie += 1; ie < x.length; ) {
            var te = String.fromCharCode(x[ie]);
            ie += 1, z.contains(ee + te) ? ee = ee + te : (ge.write(z.indexOf(ee), J), z.size() < 4095 && (z.size() == 1 << J && (J += 1), z.add(ee + te)), ee = te);
          }
          return ge.write(z.indexOf(ee), J), ge.write(P, J), ge.flush(), oe.toByteArray();
        }, R = function() {
          var T = {}, L = 0, P = {};
          return P.add = function(J) {
            if (P.contains(J))
              throw "dup key:" + J;
            T[J] = L, L += 1;
          }, P.size = function() {
            return L;
          }, P.indexOf = function(J) {
            return T[J];
          }, P.contains = function(J) {
            return typeof T[J] < "u";
          }, P;
        };
        return C;
      }, N = function(E, V, W) {
        for (var q = H(E, V), x = 0; x < V; x += 1)
          for (var C = 0; C < E; C += 1)
            q.setPixel(C, x, W(C, x));
        var k = S();
        q.write(k);
        for (var v = $(), R = k.toByteArray(), T = 0; T < R.length; T += 1)
          v.writeByte(R[T]);
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
var uS = rS();
const cS = /* @__PURE__ */ iS(uS), dS = ["width", "height", "viewBox"], fS = ["width", "height"], hS = ["d"], mS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = M(() => {
      const a = cS(0, "M");
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
      }, null, 8, fS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, hS)
    ], 8, dS));
  }
}, eC = /* @__PURE__ */ U(mS, [["__scopeId", "data-v-489f0852"]]), pS = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      fe(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, tC = /* @__PURE__ */ U(pS, [["__scopeId", "data-v-47e67f04"]]);
function nC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const aC = lu(() => import("./VoiceFigure-6U3Es048.js").then((e) => e.V)), sC = "1.2.0", oC = "3.5";
export {
  Bf as $,
  Ae as A,
  Te as B,
  ga as C,
  rt as D,
  oM as E,
  m$ as F,
  Y6 as G,
  tM as H,
  K5 as I,
  w$ as J,
  At as K,
  bS as L,
  eo as M,
  C$ as N,
  k$ as O,
  va as P,
  w_ as Q,
  E6 as R,
  Un as S,
  M_ as T,
  k6 as U,
  Oe as V,
  aa as W,
  b6 as X,
  y6 as Y,
  Rf as Z,
  U as _,
  c6 as a,
  H_ as a$,
  _$ as a0,
  A6 as a1,
  O6 as a2,
  De as a3,
  F6 as a4,
  j6 as a5,
  Ct as a6,
  T6 as a7,
  Z6 as a8,
  ZS as a9,
  L_ as aA,
  y_ as aB,
  q5 as aC,
  a_ as aD,
  s_ as aE,
  lM as aF,
  Cr as aG,
  __ as aH,
  $n as aI,
  o6 as aJ,
  n6 as aK,
  Y_ as aL,
  xn as aM,
  Z_ as aN,
  K6 as aO,
  b_ as aP,
  k_ as aQ,
  g_ as aR,
  fn as aS,
  _t as aT,
  e6 as aU,
  C2 as aV,
  p_ as aW,
  M6 as aX,
  _r as aY,
  Ht as aZ,
  Kt as a_,
  z_ as aa,
  X_ as ab,
  r6 as ac,
  w6 as ad,
  $6 as ae,
  D6 as af,
  P6 as ag,
  W6 as ah,
  m6 as ai,
  vl as aj,
  I6 as ak,
  J6 as al,
  cM as am,
  d_ as an,
  u_ as ao,
  r_ as ap,
  H6 as aq,
  N6 as ar,
  L6 as as,
  q6 as at,
  S_ as au,
  X6 as av,
  e_ as aw,
  hM as ax,
  en as ay,
  t_ as az,
  D$ as b,
  fM as b$,
  c$ as b0,
  J_ as b1,
  A_ as b2,
  E_ as b3,
  X2 as b4,
  fr as b5,
  j_ as b6,
  Q6 as b7,
  ka as b8,
  ft as b9,
  T_ as bA,
  q_ as bB,
  vt as bC,
  C_ as bD,
  D_ as bE,
  n_ as bF,
  f_ as bG,
  o_ as bH,
  Be as bI,
  V6 as bJ,
  P_ as bK,
  wM as bL,
  $M as bM,
  XS as bN,
  O2 as bO,
  U6 as bP,
  I_ as bQ,
  d6 as bR,
  uM as bS,
  O_ as bT,
  R_ as bU,
  B_ as bV,
  z6 as bW,
  D5 as bX,
  G6 as bY,
  i_ as bZ,
  rM as b_,
  N_ as ba,
  Wa as bb,
  $i as bc,
  pM as bd,
  yM as be,
  x_ as bf,
  K_ as bg,
  JS as bh,
  c_ as bi,
  vM as bj,
  R6 as bk,
  B6 as bl,
  v6 as bm,
  C6 as bn,
  s6 as bo,
  G_ as bp,
  f6 as bq,
  h6 as br,
  g6 as bs,
  m_ as bt,
  $2 as bu,
  eM as bv,
  b$ as bw,
  p6 as bx,
  l6 as by,
  h_ as bz,
  Q2 as c,
  TS as c$,
  a6 as c0,
  t6 as c1,
  l_ as c2,
  bM as c3,
  oo as c4,
  kM as c5,
  Wr as c6,
  V_ as c7,
  S6 as c8,
  x6 as c9,
  gS as cA,
  pt as cB,
  Fd as cC,
  XM as cD,
  YM as cE,
  me as cF,
  ti as cG,
  DM as cH,
  ES as cI,
  sC as cJ,
  oC as cK,
  jS as cL,
  jM as cM,
  ps as cN,
  GS as cO,
  dw as cP,
  Ft as cQ,
  $l as cR,
  Is as cS,
  LS as cT,
  FS as cU,
  xc as cV,
  Gk as cW,
  ta as cX,
  VM as cY,
  AS as cZ,
  OS as c_,
  M2 as ca,
  i6 as cb,
  g$ as cc,
  v_ as cd,
  Xs as ce,
  I5 as cf,
  $_ as cg,
  tn as ch,
  Dt as ci,
  IS as cj,
  BS as ck,
  qM as cl,
  pe as cm,
  vf as cn,
  Ds as co,
  fa as cp,
  mg as cq,
  ha as cr,
  KM as cs,
  QS as ct,
  RS as cu,
  gg as cv,
  Bi as cw,
  on as cx,
  Ks as cy,
  xM as cz,
  Ve as d,
  Op as d$,
  qS as d0,
  QM as d1,
  eC as d2,
  qi as d3,
  Jc as d4,
  LM as d5,
  Ly as d6,
  SS as d7,
  KS as d8,
  R4 as d9,
  Lo as dA,
  zs as dB,
  pd as dC,
  UM as dD,
  zM as dE,
  Rs as dF,
  md as dG,
  Os as dH,
  Mm as dI,
  GM as dJ,
  YS as dK,
  Ek as dL,
  VS as dM,
  US as dN,
  MM as dO,
  lm as dP,
  SM as dQ,
  $S as dR,
  WM as dS,
  ow as dT,
  e4 as dU,
  Ki as dV,
  MS as dW,
  PS as dX,
  AM as dY,
  TM as dZ,
  Ne as d_,
  jt as da,
  WS as db,
  Ye as dc,
  bt as dd,
  Sv as de,
  ld as df,
  Im as dg,
  zS as dh,
  _S as di,
  Gt as dj,
  PM as dk,
  _3 as dl,
  JM as dm,
  ZM as dn,
  bn as dp,
  Hd as dq,
  at as dr,
  HS as ds,
  et as dt,
  aC as du,
  tC as dv,
  Us as dw,
  OM as dx,
  Cs as dy,
  Ep as dz,
  _6 as e,
  NS as e0,
  _c as e1,
  _M as e2,
  Ji as e3,
  EM as e4,
  Iu as e5,
  DS as e6,
  xS as e7,
  wS as e8,
  ln as e9,
  Yl as ea,
  vd as eb,
  CS as ec,
  mt as ed,
  nC as ee,
  t4 as ef,
  yS as eg,
  kS as eh,
  CM as ei,
  NM as ej,
  Oi as ek,
  FM as el,
  Zi as em,
  Ul as en,
  W4 as eo,
  Es as ep,
  IM as eq,
  ns as er,
  RM as es,
  BM as et,
  Ue as eu,
  HM as ev,
  Yn as ew,
  w2 as f,
  mM as g,
  hn as h,
  nM as i,
  gM as j,
  aM as k,
  U_ as l,
  H$ as m,
  to as n,
  Q_ as o,
  u6 as p,
  sM as q,
  jr as r,
  Fr as s,
  Me as t,
  Z2 as u,
  F_ as v,
  dM as w,
  W_ as x,
  _n as y,
  iM as z
};
