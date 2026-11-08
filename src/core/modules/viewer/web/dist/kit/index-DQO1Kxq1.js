/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as ve, unref as L, renderSlot as fe, createElementVNode as m, normalizeClass as V, Fragment as j, renderList as ne, defineComponent as Ur, Comment as Gr, h as ua, cloneVNode as Vr, createBlock as W, withCtx as F, createVNode as T, toDisplayString as v, createCommentVNode as b, ref as A, onMounted as xe, onBeforeUnmount as tt, reactive as Ht, shallowRef as Je, watch as me, onUnmounted as Ie, inject as _e, useAttrs as ca, computed as E, resolveDynamicComponent as rt, mergeProps as Pe, useId as As, resolveDirective as Kr, withDirectives as Ze, createTextVNode as Y, Teleport as da, nextTick as je, Transition as zt, withModifiers as $e, createApp as Yr, shallowReactive as Qr, withKeys as Mt, onScopeDispose as fa, useModel as on, mergeModels as Pt, toRef as xa, vModelText as Yn, resolveComponent as Xr, provide as Il, onErrorCaptured as Jr, TransitionGroup as Os, isRef as mo, getCurrentInstance as Zr, getCurrentScope as Bl, createSlots as eu, vShow as Rl, useSlots as tu, normalizeProps as nu, guardReactiveProps as au, defineAsyncComponent as su } from "vue";
function Ll(e, t = performance.now()) {
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
    const t = Ll(ou);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: ve(L(t))
    }, null, 4));
  }
}, Zt = /* @__PURE__ */ U(lu, [["__scopeId", "data-v-6c018b03"]]), iu = { class: "skeleton-line" }, ru = 2e3, uu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Ll(ru);
    return (n, a) => (u(), f("span", iu, [
      fe(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: V(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(j, null, ne(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: V(["bar", { still: e.still }]),
          style: ve({ ...L(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, yt = /* @__PURE__ */ U(uu, [["__scopeId", "data-v-484fe8a0"]]), Ut = Ur({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Gr);
      return a.length !== 1 ? ua(j, { key: n }, a) : a[0].key == null ? Vr(a[0], { key: n }) : a[0];
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
    ], l = ["94%", "88%", "91%", "62%"].map((r) => ({ width: r, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (r, c) => (u(), W(Ut, { value: e.shape }, {
      messages: F(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), f(j, null, ne(t, (d) => T(Zt, {
            key: d.id,
            class: V(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, cu)
      ]),
      older: F(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(j, null, ne(t.slice(0, 3), (d) => (u(), W(Zt, {
            key: d.id,
            class: V(["skeleton-message", { mine: d.mine }]),
            style: ve({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, du)
      ]),
      cards: F(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(j, null, ne(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(j, null, ne(n, (h) => T(yt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, fu)
      ]),
      file: F(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(j, null, ne(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            T(yt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(j, null, ne(s, (h) => T(yt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, hu)
      ]),
      page: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          T(yt, {
            class: "skeleton-heading",
            bars: i
          }),
          (u(!0), f(j, null, ne(e.count, (d) => (u(), W(yt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, mu)
      ]),
      text: F(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(j, null, ne(e.count, (d) => (u(), W(yt, {
            key: d,
            bars: L(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, pu)
      ]),
      default: F(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(j, null, ne(e.count, (d) => (u(), W(yt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, gu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ke = /* @__PURE__ */ U(vu, [["__scopeId", "data-v-ef519c5f"]]), yu = {
  key: 1,
  class: "empty-state titled"
}, bu = { class: "empty-state-title" }, ku = { class: "empty-state-text" }, wu = {
  key: 2,
  class: "empty-state"
}, $u = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), W(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", yu, [
      m("p", bu, v(e.title), 1),
      m("p", ku, [
        fe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", wu, [
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, ln = /* @__PURE__ */ U($u, [["__scopeId", "data-v-b27e89b0"]]), xu = { class: "fold-group" }, Su = ["aria-expanded"], Mu = { class: "fold-label" }, _u = {
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
        class: V(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Mu, v(e.label), 1),
        e.count !== "" ? (u(), f("span", _u, v(e.count), 1)) : b("", !0),
        m("span", {
          class: V(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Su),
      e.open ? fe(a.$slots, "default", {}, void 0, !0, 0) : b("", !0)
    ]));
  }
}, xS = /* @__PURE__ */ U(Cu, [["__scopeId", "data-v-9ef1865c"]]), Eu = 150, Au = () => Eu;
function Ts(e, t, n = Au(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Nl(e, t, n) {
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
const Ou = 50, po = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function SS(e) {
  const t = Ye().sources.find((n) => n.key === e);
  return t ? ss(t.read, t.events) : ss("", []);
}
function ql(e, t, n, a, s = () => !1) {
  const o = A([]), l = A(null), i = A(""), r = A(!1), c = performance.now(), d = A(!1), h = A(""), p = A(null), y = /* @__PURE__ */ new Set();
  let k = null;
  function B(g) {
    return s() ? (y.add(g), k ?? (k = new Promise((M) => setTimeout(() => M(x()), Ou)))) : $(g);
  }
  async function x() {
    const g = new Set(y);
    y.clear(), k = null;
    const M = q, I = await t({ ids: [...g].join(","), limit: g.size });
    if (M !== q) return;
    if (!I.ok) return P();
    const R = new Map(I.value.rows.map((D) => [D.id, D]));
    o.value = o.value.flatMap((D) => g.has(D.id) ? R.has(D.id) ? [R.get(D.id)] : [] : [D]);
  }
  async function $(g) {
    const M = q, I = await t({ "before-id": g + 1, limit: 1 });
    if (M !== q) return;
    if (!I.ok) return P();
    const R = I.value.rows.find((D) => D.id === g);
    o.value = R ? o.value.map((D) => D.id === g ? R : D) : o.value.filter((D) => D.id !== g);
  }
  async function C(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ae) => ae.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((ae) => ae.id === g.row_id)) return B(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return P();
    const I = Math.max(...o.value.map((ae) => ae.id)), R = q, D = await t({ "after-id": I });
    if (R !== q) return;
    if (!D.ok) return P();
    const Z = new Set(o.value.map((ae) => ae.id));
    o.value = [...D.value.rows.filter((ae) => !Z.has(ae.id)), ...o.value];
  }
  async function N() {
    if (!d.value || !o.value.length) return !1;
    const g = q, M = Math.min(...o.value.map((D) => D.id)), I = await t({ "before-id": M });
    if (g !== q) return !1;
    if (!I.ok || !I.value.rows.length) return d.value = !1;
    d.value = po(I.value, n());
    const R = new Set(o.value.map((D) => D.id));
    return o.value = [...o.value, ...I.value.rows.filter((D) => !R.has(D.id))], !0;
  }
  let q = 0;
  function _(g, M) {
    var D, Z;
    const I = g.ok ? e.shared ? [g.value] : ((D = g.value) == null ? void 0 : D.rows) ?? [] : [];
    g.ok && (o.value = M(I)), l.value = g.ok ? g.value : null;
    const R = I.length ? Math.min(...I.map((ae) => ae.id)) : 0;
    g.ok && ((Z = g.value) != null && Z.rows) && !o.value.some((ae) => ae.id < R) && (d.value = !e.shared && po(g.value, n())), i.value = g.ok ? "" : g.error, Ts(c, () => r.value = !0);
  }
  async function z(g) {
    const M = ++q, I = await t({});
    M === q && _(I, g);
  }
  const H = (g) => {
    if (!a() || !g.length) return g;
    const M = Math.min(...g.map((R) => R.id)), I = Math.max(...g.map((R) => R.id));
    return [...o.value.filter((R) => R.id > I), ...g, ...o.value.filter((R) => R.id < M)];
  }, P = () => z(H), S = (g) => _(g, H), O = () => z((g) => g);
  async function w(g, M = null) {
    const I = await Nl(M && { target: o, fields: { value: M(o.value) } }, g, e.run);
    return h.value = I.ok ? "" : I.error, p.value = I.ok ? I.value : null, await P(), I;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: P, loadLatest: O, older: N, act: w, actionFailure: h, answer: p, context: e, heard: C, showFirst: S, pageSize: n };
}
const Tu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ss(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = Ye(), l = ql(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Tu(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Iu = 2e3;
function Is(e, t, n = Iu) {
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
  xe(async () => {
    document.addEventListener("visibilitychange", c), await l(e), r();
  }), tt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const Dl = typeof document < "u" && document.documentElement.classList.contains("phone"), Pl = 120;
var Ol;
const Sa = globalThis[Ol = Symbol.for("journal.pressed")] ?? (globalThis[Ol] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Bu(e = 0) {
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
function jl(e = window) {
  if (!os(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    os(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ls = "journal.stale-build-reload", Ru = 'script[type="module"][src*="/assets/index-"]', go = (e) => {
  var t;
  return ((t = e.querySelector(Ru)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Lu(e = document, t = (a, s) => Me.quietRead(a, s), n = () => jl(window)) {
  const a = go(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = go(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ma = "";
function Nu(e, t = () => jl(window)) {
  if (!e) return !1;
  const n = !!Ma && Ma !== e;
  return Ma = e, n && t(), n;
}
const qu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Du(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ls) === e.message) return !1;
    t.setItem(ls, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Pu(e = window.sessionStorage) {
  try {
    e.removeItem(ls);
  } catch {
    return;
  }
}
const ju = 2e3, Fu = 3e4, Ge = Ht({ starting: !1, external: !1, late: !1, offline: !1 }), Bs = () => Ge.starting, Wu = 3;
let En = 0, is = 0, Fl = 0, Wl = [];
async function Hu() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ge.external };
  }
}
let vo = null;
const zu = () => vo ?? (vo = Hu().finally(() => vo = null));
function Uu() {
  clearTimeout(is), clearTimeout(Fl), is = 0, Object.assign(Ge, { starting: !1, external: !1, late: !1, offline: !1 }), Wl.splice(0).forEach((e) => e()), Lu();
}
async function Gu() {
  Ge.offline = !navigator.onLine;
  const e = await zu();
  if (Ge.external = e.updating, En = !e.restarting && !e.updating && e.reachable ? En + 1 : 0, En < Wu) return;
  En = 0, (!Nu(e.started_at) || os()) && Uu();
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
function Ku(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Yu {
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
const ct = "viewer.shell", An = 2e4, Qu = 4, yo = "/api/read-lines", Xu = 5e3, Ju = 403, bo = "/api/repeated-lines", Zu = 10, ec = 2e3, tc = 3e5, MS = 6e5, On = 6, nc = 500, ac = "/journal/summary", ko = "/api/server-state", sc = 2e4, Tn = Dl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, oc = (e) => e.split("?")[0].endsWith(ac), rs = (e, t) => Object.assign(new Error(t), { status: e });
async function lc(e, t, n = rs) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const ic = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), rc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), wo = (e) => e.split(" ").slice(0, 2).join(" "), at = "read", Bt = "write", uc = "stream";
class cc {
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
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < ec));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Zu || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(bo, { method: "POST", headers: { ...Tn, "Content-Type": "application/json" }, body: i }, [{ window: ct, line: bo, kind: Bt }]).catch(() => {
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
    const o = this.took(a, t), l = s ? { ...n, signal: rc(n.signal, s) } : n;
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
    return this.out(yo, { headers: Tn }, [{ window: ct, line: yo, kind: at }], Xu).then(async (t) => {
      if (t.status === Ju) return /* @__PURE__ */ new Set();
      if (!t.ok) throw rs(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Yu(
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
    const i = a instanceof FormData, r = { method: t, headers: { ...Tn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: ic(a) }, c = s || (i ? tc : An);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: ct, line: n, kind: at }], c)) : await this.sent(n, r, [{ window: ct, line: n, kind: Bt }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, nc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = On, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return lc(i, `${i.status} ${i.statusText}`).catch((r) => {
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
    return t !== "GET" ? this.send(t, n, a, s, On, o).then((i) => (this.written(n), i)) : Bs() && !oc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ct, line: t, kind: uc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(ko, { cache: "no-store" }, [{ window: ct, line: ko, kind: at }], sc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ct, line: s = t, limit: o = An } = {}) {
    const l = (n.method ?? "GET") === "GET" ? at : Bt;
    return l === Bt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const _a = Symbol.for("journal.transport"), Me = globalThis[_a] ?? (globalThis[_a] = new cc());
class Ul {
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
const dc = 50, fc = "refresh", hc = 1e3, mc = 3e4, pc = "requested", gc = "after_window", vc = 50, In = ".*", yc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function bc(e) {
  const t = {}, n = Ht({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function p(S) {
    const O = () => r[S] ?? r[`${S.slice(0, S.lastIndexOf("."))}.*`] ?? {}, w = A(void 0), g = ql(e, async (M) => {
      const I = await B(S, M);
      return I.ok && !Object.keys(M).length && (w.value = I.value), I;
    }, () => O().page_size || vc, () => !!O().page_size, () => !!O().reads_ids);
    return t[S] = { ...g, data: w, readAt: 0 };
  }
  const y = new Proxy({}, { get: (S, O) => typeof O != "string" || O.startsWith("__v") ? void 0 : t[O] ?? p(O) }), k = (S) => (r[S].loading !== pc || S.endsWith(In)) && (!r[S].tab || r[S].tab === n.tab);
  function B(S, O = {}) {
    return new Promise((w) => {
      a.push({ name: S, flags: O, resolve: w }), a.length === 1 && setTimeout(x);
    });
  }
  async function x() {
    const S = /* @__PURE__ */ new Map(), O = a.splice(0).filter((M) => {
      const I = JSON.stringify(M.flags);
      return S.has(M.name) || S.set(M.name, I), S.get(M.name) === I ? !0 : (a.push(M), !1);
    });
    a.length && setTimeout(x);
    const w = Object.fromEntries(O.flatMap(({ name: M, flags: I }) => Object.entries(I).map(([R, D]) => [`${M}.${R}`, D]))), g = await e.readKeys({ only: [...new Set(O.map(({ name: M }) => M))], state: { ...n, ...w } });
    O.forEach(({ name: M, resolve: I }) => I(g.ok ? g.value.keys[M] : g));
  }
  async function $(S) {
    var M;
    const O = ++d;
    (S.length ? S : Object.keys(r).filter((I) => !I.endsWith(In) && r[I].loading === "first" && k(I))).forEach((I) => l[I] = O);
    const g = await e.readKeys({ only: S, state: { ...n } });
    if (!g.ok) {
      if (g.failure === "cancelled") return !1;
      const I = (S.length ? S : Object.keys(t)).filter((D) => (l[D] ?? 0) <= O);
      I.forEach((D) => {
        y[D].readAt = Date.now(), g.failure === "unreachable" ? i.add(D) : i.delete(D), y[D].showFirst(g);
      });
      const R = g.failure === "unreachable" && ((M = e.waitForServer) == null ? void 0 : M.call(e));
      return R && R.then(() => {
        if (h) return;
        const D = I.filter((Z) => l[Z] === O);
        (D.length || !S.length && !I.length && d === O) && $(D);
      }), !1;
    }
    return H(g.value.declared), Object.entries(g.value.keys).forEach(([I, R]) => {
      (l[I] ?? 0) > O || (l[I] = O, y[I].readAt = Date.now(), i.delete(I), R.ok && (y[I].data.value = R.value), y[I].showFirst(R));
    }), !0;
  }
  function C(S) {
    const O = yc(S);
    return O.length ? (O.forEach((w) => o.names.add(w)), o.answer ?? (o.answer = new Promise((w) => setTimeout(() => {
      const g = [...o.names];
      o.names.clear(), o.answer = null, w($(g));
    })))) : $([]);
  }
  function N(S) {
    S.forEach((O) => s.add(O)), clearTimeout(c), c = setTimeout(() => {
      const O = [...s];
      s.clear(), O.length && $(O);
    }, dc);
  }
  const q = (S) => S.endsWith(In) ? Object.keys(t).filter((O) => O.startsWith(S.slice(0, -1)) && t[O].readAt) : [S], _ = (S) => (r[S] ?? r[`${S.split(".")[0]}.*`]).reload_seconds;
  function z(S) {
    const O = Object.keys(r).filter((g) => S.event === fc || r[g].events.some((M) => Ls(M, S.event)));
    O.filter((g) => r[g].page_size).forEach((g) => y[g].heard(S));
    const w = O.filter((g) => !r[g].page_size);
    w.filter((g) => !k(g)).forEach((g) => y[g].readAt = 0), N(w.filter(k).flatMap(q));
  }
  function H(S) {
    if (Object.keys(r).length) return;
    r = S;
    const O = [...new Set(Object.values(S).flatMap((g) => g.events))];
    O.length && e.follow(O, z);
    const w = Object.keys(S).filter((g) => S[g].loading === gc);
    w.length && $(w);
  }
  me(() => n.tab, () => {
    const S = Object.keys(r).filter((O) => !O.endsWith(In) && k(O) && !y[O].readAt);
    S.length && $(S);
  }), Ie(() => {
    h = !0, clearTimeout(c);
  });
  function P() {
    const S = Date.now(), O = Object.keys(r).filter((w) => r[w].reload_seconds > 0 && k(w)).flatMap(q).filter((w) => S - y[w].readAt >= (i.has(w) ? Math.min(_(w) * 1e3, mc) : _(w) * 1e3));
    O.length && N(O);
  }
  return Is(P, () => e.visible.value, hc), queueMicrotask(() => $([])), { props: y, state: n, reload: C, readKey: B };
}
const kc = Symbol("open-view"), qe = Symbol.for("journal.window-context"), Gl = Symbol("dock-card");
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
function Ye() {
  const e = _e(qe, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return wc(e);
}
const $c = (e, t) => e(Gl, t), _S = () => _e(Gl), us = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', $o = {
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
    }, null, 12, xc));
  }
}, Sc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Mc = /* @__PURE__ */ U(Sc, [["__scopeId", "data-v-eb453d6f"]]), _c = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ca(), a = E(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = A(!1), o = E(() => t.busy || s.value), l = _e(qe, null), i = E(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function r(c) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, Pl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, d) => (u(), W(rt(e.href ? "a" : "button"), Pe(a.value, {
      type: e.href ? void 0 : L(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: r
    }), {
      default: F(() => [
        m("span", {
          class: V(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (u(), W(re, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : b("", !0),
          fe(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), W(Mc, {
          key: 0,
          class: "btn-spinner"
        })) : b("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ U(_c, [["__scopeId", "data-v-ededdadf"]]), Cc = ["aria-checked", "aria-haspopup", "onClick"], Ec = {
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
    const n = t, a = As();
    return (s, o) => {
      const l = Kr("tip");
      return u(), f("span", {
        class: V(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(j, null, ne(e.options, (i) => Ze((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: V(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", Ec)) : b("", !0),
          Y(" " + v(i.label) + " ", 1),
          i.note ? (u(), f("small", Ac, v(i.note), 1)) : b("", !0),
          i.count !== void 0 ? (u(), f("em", Oc, v(i.count), 1)) : b("", !0)
        ], 10, Cc)), [
          [l, i.tip || i.title, `${L(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, jt = /* @__PURE__ */ U(Tc, [["__scopeId", "data-v-c89bc92d"]]), Ic = {
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
    return (t, n) => e.failure || e.more ? (u(), f("div", Ic, [
      e.failure ? (u(), f("p", Bc, v(e.failure), 1)) : b("", !0),
      e.more ? (u(), W(pe, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: F(() => [
          Y(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : b("", !0)
    ])) : b("", !0);
  }
}, vn = /* @__PURE__ */ U(Rc, [["__scopeId", "data-v-10464014"]]), Lc = { class: "link-group" }, Nc = {
  class: "group-label",
  "data-link-kind": ""
}, qc = ["disabled", "onClick"], Dc = { class: "title" }, Pc = { class: "relations" }, jc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = E(() => s.value ? n.rows : n.rows.slice(0, 3)), l = E(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Lc, [
      m("div", Nc, v(l.value), 1),
      (u(!0), f(j, null, ne(o.value, (p) => (u(), f("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        m("span", Dc, v(p.endpoint.title), 1),
        m("span", Pc, [
          Y(v(c(p)), 1),
          i(p) ? (u(), f(j, { key: 0 }, [
            Y(" · Unavailable")
          ], 64)) : b("", !0)
        ])
      ], 16, qc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : b("", !0)
    ]));
  }
}, Fc = /* @__PURE__ */ U(jc, [["__scopeId", "data-v-be6f079c"]]), Wc = ["data-loaded"], Hc = { class: "rows" }, zc = ["disabled", "onClick"], Uc = { class: "title" }, Gc = { class: "relations" }, Vc = { key: 2 }, Kc = {
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
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (P) => p[P] || `${P.replaceAll("_", " ").replace(/^./, (S) => S.toUpperCase())}s`, k = E(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((P, S) => P + S, 0) },
      ...Object.entries(o.value).filter(([P]) => !n.onlyKinds.length || n.onlyKinds.includes(P)).map(([P, S]) => ({ key: P, label: y(P), count: S }))
    ]), B = E(() => {
      const P = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((O) => O.endpoint.model))].map((O) => [O, s.value.filter((w) => w.endpoint.model === O).length])), S = { doc: 0, task: 1, message: 2 };
      return Object.entries(P).sort(([O], [w]) => (S[O] ?? 3) - (S[w] ?? 3)).map(([O, w]) => ({ model: O, count: w, rows: s.value.filter((g) => g.endpoint.model === O) }));
    }), x = (P) => P.endpoint.unavailable || !P.endpoint.open_ref, $ = (P) => ({ [n.linkAttribute]: !0, "data-link-model": P.endpoint.model, "data-link-id": P.endpoint.id }), C = (P) => `${P.endpoint.model === "doc" && P.endpoint.id === n.documentId ? "Design document" : P.endpoint.model.replaceAll("_", " ").replace(/^./, (S) => S.toUpperCase())} ${P.endpoint.id}, ${P.relations.map((S) => S.replaceAll("_", " ")).join(", ")}`;
    async function N(P = 1) {
      const S = ++h;
      c.value = !0, d.value = "";
      const O = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(P), "--page-size", String(n.pageSize)];
      n.outsidePlan && O.push("--outside-plan"), n.documentId && O.push("--first-counterpart", `doc:${n.documentId}`), i.value && O.push("--kind", i.value);
      try {
        const w = await n.read(O);
        if (S !== h) return;
        if (!w.ok) {
          d.value = w.error;
          return;
        }
        const g = w.value.counterparts ?? [], M = P === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(M.map((I) => [`${I.endpoint.model}:${I.endpoint.id}`, I])).values()], o.value = w.value.kinds ?? {}, l.value = w.value.total, r.value = w.value.next_page ?? null;
      } catch (w) {
        S === h && (d.value = w.message);
      } finally {
        S === h && (c.value = !1);
      }
    }
    function q(P) {
      if (x(P)) return;
      const [S, O] = P.endpoint.open_ref.split(":");
      a("open", { table: S, id: Number(O) });
    }
    function _(P) {
      i.value = P, N();
    }
    const z = () => !c.value && r.value && N(r.value), H = E(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], r.value = null, i.value = "", N();
    }, { immediate: !0 }), (P, S) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
      key: 0,
      class: V(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      k.value.length > 2 ? (u(), W(jt, {
        key: 0,
        options: k.value,
        value: i.value,
        wrap: "",
        onPick: _
      }, null, 8, ["options", "value"])) : b("", !0),
      m("div", Hc, [
        e.grouped ? (u(!0), f(j, { key: 0 }, ne(B.value, (O) => (u(), W(Fc, {
          key: O.model,
          model: O.model,
          count: O.count,
          rows: O.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: q
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(j, { key: 1 }, ne(s.value, (O) => (u(), f("button", Pe({
          key: `${O.endpoint.model}:${O.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, $(O), {
          disabled: x(O),
          onClick: (w) => q(O)
        }), [
          m("span", Uc, v(O.endpoint.title), 1),
          m("span", Gc, [
            Y(v(C(O)), 1),
            x(O) ? (u(), f(j, { key: 0 }, [
              Y(" · Unavailable")
            ], 64)) : b("", !0)
          ])
        ], 16, zc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Vc, v(e.empty), 1)) : b("", !0),
        T(vn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: H.value,
          onMore: z
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Wc)) : b("", !0);
  }
}, Yc = /* @__PURE__ */ U(Kc, [["__scopeId", "data-v-29b9c31b"]]), Qc = (e, t, n) => Math.max(t, Math.min(n, e)), Xc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Vl = /* @__PURE__ */ new WeakMap(), Jc = (e, t) => Vl.set(e, t);
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
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
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
    const a = e, s = A(null), o = (g) => g ? `${g}px` : void 0, l = E(() => ({
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
    function k(g) {
      const M = h(a.anchor), I = y(M, g);
      return i.value.w <= I.across && i.value.h <= Math.max(I.below, I.above) ? M : c();
    }
    const B = E(() => {
      if (!r.value) return l.value;
      const g = r.value, M = k(g), I = y(M, g), { w: R, h: D } = i.value, Z = a.align === "auto" ? g.left + g.right > M.left + M.right : a.align === "right", ae = Qc(Z ? g.right - R : g.left, M.left + Tt, Math.max(M.left + Tt, M.right - R - Tt)), ge = D > I.below && I.above > I.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, I.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, I.below) };
      return { ...l.value, ...ge, left: `${ae}px`, maxWidth: p(a.maxWidth, I.across) };
    }), x = n, $ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function C(g) {
      const M = $(), I = M.indexOf(document.activeElement);
      M[(I + g + M.length) % M.length].focus();
    }
    const N = { ArrowDown: () => C(1), ArrowUp: () => C(-1), Escape: () => x("close") }, q = (g) => N[g.key] && (g.preventDefault(), N[g.key]()), _ = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let z = 0;
    const H = new ResizeObserver(() => {
      cancelAnimationFrame(z), z = requestAnimationFrame(_);
    });
    Kl(s, (g) => a.anchor && !a.anchor.contains(g.target) && x("close"));
    const P = (g, M) => ["top", "left", "right", "bottom"].some((I) => Math.abs(g[I] - M[I]) > 1), S = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let O = 0;
    function w() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || S(g)) return x("close");
        P(g, r.value) && (r.value = g);
      }
      O = requestAnimationFrame(w);
    }
    return xe(() => {
      a.anchor && s.value && Jc(s.value, a.anchor), _(), s.value && H.observe(s.value), !a.plain && $()[0] && $()[0].focus(), w();
    }), Ie(() => {
      H.disconnect(), cancelAnimationFrame(O), cancelAnimationFrame(z);
    }), t({ element: s }), (g, M) => (u(), W(da, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", Pe({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: B.value,
        onKeydown: q
      }), [
        fe(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ha = /* @__PURE__ */ U(ed, [["__scopeId", "data-v-3d203970"]]), td = { class: "split-button" }, nd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = A(null), s = A(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", td, [
      T(pe, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (r) => n("main"))
      }, {
        default: F(() => [
          fe(l.$slots, "default", {}, void 0, !0)
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
          default: F(() => [
            T(re, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), W(ha, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: F(() => [
          fe(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : b("", !0)
    ]));
  }
}, ad = /* @__PURE__ */ U(nd, [["__scopeId", "data-v-c258494d"]]), sd = 0, od = "/api/lines", ld = "/api/line", xo = 5e3, So = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Mo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ca = (e) => JSON.stringify(e.line), _o = () => new DOMException("cancelled", "AbortError");
class id {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ca(t))) {
        Me.whenFree(() => this.readAlone(l));
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), sd));
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
      const o = await Me.sent(od, So({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Mo(i.body, at)), xo);
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
    await this.alone(t, at), Date.now() - n < xo ? this.slow.delete(Ca(t.body)) : this.slow.add(Ca(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(ld, So(t.body, t.signal), [Mo(t.body, n)], n === at ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Yl = new id(), rd = "/api/window";
function ud(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${rd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: at }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const Ql = /* @__PURE__ */ new Map();
class cd {
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
function CS(e, t) {
  const n = new cd(e, t);
  return Ql.set(e, n), n.load().catch(() => {
  }), n;
}
const Ns = (e) => Ql.get(e);
function dd(e, t, n) {
  const a = Ns(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function fd(e, t) {
  if (!e) return !0;
  const n = Ns(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Qn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Xl = {};
async function ES(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Xl = (await t.json()).states);
}
const qs = (e, t) => {
  var n;
  return (n = Xl[e]) == null ? void 0 : n[t];
}, rn = (e, t) => {
  var n;
  return ((n = qs(e, t)) == null ? void 0 : n.label) ?? Qn(t);
}, Jl = (e, t) => {
  var n;
  return ((n = qs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, hd = (e, t) => {
  var n;
  return ((n = qs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, md = Symbol("pane-page"), Ds = Symbol("inspector-host"), Zl = { 1: "refused", 2: "usage", 3: "fault" }, pd = 100, gd = 50, vd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, yd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function bd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = A({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: k = [], links: B = {}, search: x = {}, readOnly: $ = !1, shared: C = null }) {
  const N = /* @__PURE__ */ new Map(), q = new AbortController(), _ = A(!1), z = performance.now();
  let H = 0, P = 0, S = () => {
  };
  const O = new Promise((D) => S = D);
  q.signal.addEventListener("abort", S, { once: !0 });
  const w = () => {
    clearTimeout(P), P = setTimeout(() => {
      H === 0 && Ts(z, () => {
        _.value = !0, S();
      });
    }, gd);
  }, g = (D, Z) => (H += 1, Lt(e, D, t, q.signal, Z).finally(() => {
    H -= 1, w();
  })), M = (D, Z) => (w(), O.then(() => q.signal.aborted ? it : Lt(e, D, t, q.signal, Z))), I = ({ only: D = [], state: Z = {} } = {}) => (H += 1, wd(() => ud(e, t, D, Z, q.signal), q.signal).finally(() => {
    H -= 1, w();
  })), R = (D, { unbatched: Z = !1, deferred: ae = !1 } = {}) => {
    const le = N.get(D);
    if (le && performance.now() - le.at < pd) return le.answer;
    const ge = ae && !_.value ? M(D, Z) : g(D, Z);
    return N.set(D, { answer: ge, at: performance.now() }), ge;
  };
  return {
    answered: _,
    settle: w,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: E(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: k,
    links: B,
    search: x,
    readOnly: $,
    shared: C,
    read: R,
    readKeys: I,
    waitForServer: () => Bs() ? zl() : null,
    run: (D) => Lt(e, D, t, q.signal),
    upload: (D) => xd(D, e, q.signal),
    cancel: () => q.abort(),
    signal: q.signal,
    subscriptions: l,
    follow: (D, Z) => l.follow(e, [D].flat().filter((ae) => o.some((le) => Ls(le, ae))), (ae) => {
      N.clear(), Z(ae);
    }, a),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (D) => E(() => {
      var Z;
      return r.value[D] ?? ((Z = c.find((ae) => ae.key === D)) == null ? void 0 : Z.default);
    }),
    setting: async (D, Z) => {
      const ae = await R(`window setting ${e} ${D}`);
      return ae.ok ? ae.value.value : Z;
    },
    setOption: h,
    keep: (D, Z) => Lt(e, ["window", "save-setting", e, D, JSON.stringify(Z)], t, q.signal)
  };
}
function ei(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const it = { ok: !1, failure: "cancelled", error: "" }, Ps = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ti(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? it : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Zl[n.code] || "fault", error: ei(n.error) };
  } catch {
    return t != null && t.aborted ? it : { ok: !1, failure: "unreachable", error: Ps };
  }
}
const kd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Zl[e.code] || "fault", error: ei(e.error) };
async function wd(e, t) {
  try {
    const n = await e();
    return t.aborted ? it : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, kd(s)])) } };
  } catch {
    return t.aborted ? it : { ok: !1, failure: "unreachable", error: Ps };
  }
}
async function ni(e, t, n) {
  const a = await ti(() => Yl.read(e, t, n), t);
  return a.failure !== "unreachable" || !Bs() ? a : (await zl(), t.aborted ? it : ni(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => $d(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : js(t)));
}
async function $d(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : js(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, i) => ni({ ...o, attribution: i }, l, s), a, o).catch(() => it) : ti(() => Yl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function xd(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? it : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? it : { ok: !1, failure: "unreachable", error: Ps };
  }
}
function js(e) {
  return [...e.matchAll(vd)].map(([t]) => t.replace(yd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Sd = (e) => `show-${e}`, AS = (e, t, n) => e.filter((a) => {
  var s;
  return n(Sd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ai = "messages.chat", Md = {
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
    const n = e, a = t, s = A([]), o = A(""), l = E(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = E(() => s.value.find((c) => String(c.id) === n.value));
    async function r() {
      const c = await Lt(ai, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === d);
      h && a("pick", String(h.id));
    }
    return r(), (c, d) => (u(), f(j, null, [
      T(jt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (u(), f("p", Md, v(i.value.brief), 1)) : b("", !0),
      o.value ? (u(), f("p", _d, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, Ed = /* @__PURE__ */ U(Cd, [["__scopeId", "data-v-14be8a5c"]]), Ad = { class: "info-tip" }, Od = ["aria-label"], Td = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Id = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (u(), f("span", Ad, [
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
      ], 8, Od),
      m("span", Td, [
        (u(!0), f(j, null, ne(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, si = /* @__PURE__ */ U(Id, [["__scopeId", "data-v-a2fe5ff1"]]), Bd = { class: "form-field" }, Rd = { class: "form-field-head" }, Ld = ["for"], Nd = {
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
    return (t, n) => (u(), f("div", Bd, [
      m("div", Rd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Ld),
        e.help ? (u(), W(si, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : b("", !0),
        t.$slots.aside ? (u(), f("span", Nd, [
          fe(t.$slots, "aside", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Dd = /* @__PURE__ */ U(qd, [["__scopeId", "data-v-302c40bf"]]), cs = {
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
    return (a, s) => Ze((u(), f("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [L(cs), L(t).value]
    ]);
  }
}), jd = /* @__PURE__ */ U(Pd, [["__scopeId", "data-v-e130a5b9"]]), Fd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = As(), o = E(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), W(Dd, {
      label: e.field.label,
      for: L(s),
      "data-button-field": e.field.name
    }, {
      default: F(() => [
        T(Ut, { value: o.value }, {
          choice: F(() => [
            T(jt, {
              id: L(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (r) => a("pick", r))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: F(() => [
            T(Ed, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (r) => a("pick", r))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: F(() => [
            T(jd, {
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
    return (t, n) => (u(), W(pe, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: F(() => [
        T(re, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Wd(e, t, n, a = () => window) {
  xe(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ie(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Hd = (e, t = () => !0) => Wd("keydown", (n) => n.key === "Escape" && t() && e());
function oi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = A(!1), s = E(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Hd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const zd = 80, It = Ht([]);
function li(e) {
  const t = Symbol("layer"), n = () => It.includes(t) && It.splice(It.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !It.includes(t) && It.push(t), a || n();
    },
    { immediate: !0 }
  ), Ie(n), E(() => zd + Math.max(0, It.indexOf(t)));
}
let ii = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ii = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
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
    const [i, r] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), r.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === r && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  xe(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : ii, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
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
    open: { type: Boolean, default: null },
    closable: { type: Boolean, default: !0 },
    modal: Boolean,
    sheet: Boolean
  },
  emits: ["close", "dismiss", "escape"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = oi(a, n), i = li(s), r = A(null), c = A(null), d = A(null), h = As(), p = A(!1), y = Date.now();
    n.modal && Gd(c, () => a("escape"), d);
    function k() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Jd);
    }
    function B(C) {
      !n.modal || Date.now() - y >= Xd || ![" ", "Enter"].includes(C.key) || (C.preventDefault(), C.stopPropagation());
    }
    const x = () => r.value && (r.value.scrollTop = r.value.scrollHeight), $ = new MutationObserver(x);
    return me(r, (C) => {
      $.disconnect(), C && n.follow && ($.observe(C, { childList: !0, subtree: !0, characterData: !0 }), x());
    }), Ie(() => $.disconnect()), (C, N) => (u(), W(da, { to: "body" }, [
      T(zt, {
        name: "dialog",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: F(() => [
          L(s) ? (u(), f("div", {
            key: 0,
            class: V(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: L(i) }),
            onClick: $e(k, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: V(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? L(h) : void 0,
              onKeydownCapture: B
            }, [
              e.bare ? b("", !0) : (u(), f("header", Kd, [
                m("h3", {
                  id: L(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Yd),
                e.closable ? (u(), W(ma, {
                  key: 0,
                  onClick: L(o)
                }, null, 8, ["onClick"])) : b("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: r,
                class: V(["dialog-body", { bare: e.bare }])
              }, [
                fe(C.$slots, "default", {}, void 0, !0)
              ], 2),
              C.$slots.foot ? (u(), f("footer", Qd, [
                fe(C.$slots, "foot", {}, void 0, !0)
              ])) : b("", !0)
            ], 42, Vd)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, pa = /* @__PURE__ */ U(Zd, [["__scopeId", "data-v-6d1ecd98"]]), ef = {
  class: "action-output",
  "data-action-output": ""
}, tf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), W(pa, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: F(() => [
        m("pre", ef, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, nf = /* @__PURE__ */ U(tf, [["__scopeId", "data-v-423a045c"]]);
function af(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Yr(nf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const sf = (e, t, n = {}) => js(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function yn(e, t, n, a = {}) {
  var s;
  try {
    if (!await fd(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(ai, sf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && af(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const of = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ea = [
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
}, lf = ["secrets", "plugins"], ri = Object.keys(ga).filter((e) => !(Dl && lf.includes(e)));
E(() => ri.map((e) => ({ name: e, ...ga[e] })));
const Gt = (e) => ga[e], ui = new Map(ri.flatMap((e) => [e, e.replace(/s$/, ""), ga[e].title.toLowerCase()].map((t) => [t, e]))), pt = (e) => ui.get(String(e).toLowerCase()) || "", ci = [...ui.keys()].sort((e, t) => t.length - e.length).join("|"), rf = {
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
    const n = e, a = t, s = A(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = A(!1), l = A(""), i = E(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = E(() => {
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
    return (d, h) => (u(), W(pa, {
      title: r.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: F(() => {
        var p;
        return [
          m("div", rf, [
            (p = e.row) != null && p.title ? (u(), f("p", uf, v(e.row.title), 1)) : b("", !0),
            (u(!0), f(j, null, ne(e.button.fields, (y) => (u(), W(Fd, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (k) => s.value[y.name] = k
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", cf, v(l.value), 1)) : b("", !0),
            m("div", df, [
              T(pe, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: F(() => [...h[2] || (h[2] = [
                  Y("Cancel", -1)
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
                default: F(() => [...h[3] || (h[3] = [
                  Y("Send", -1)
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
}, hf = /* @__PURE__ */ U(ff, [["__scopeId", "data-v-f26c27a7"]]), mf = {
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
    return (t, n) => (u(), f("button", {
      type: "button",
      class: V(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", mf, v(e.checked ? "✓" : ""), 1)) : b("", !0),
      e.description ? (u(), f("span", pf, [
        m("span", null, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : fe(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ze = /* @__PURE__ */ U(gf, [["__scopeId", "data-v-fec99974"]]), vf = ["aria-busy"], yf = {
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
    const n = e, a = t, s = E(() => Ns(n.environment)), o = E(
      () => {
        var $;
        return !n.readOnly && (($ = s.value) == null ? void 0 : $.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = E(() => {
      var $;
      return !n.readOnly && (($ = s.value) == null ? void 0 : $.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = E(() => n.readOnly ? [] : dd(n.environment, n.name, n.row)), c = A(null), d = A(null), h = A(""), p = A(!1), y = ($) => [$.from ? `From ${$.from}` : "", $.tip, $.warning].filter(Boolean).join(" · "), k = ($) => $.icon || ($.warning ? "dot" : "");
    function B($) {
      if (!(p.value || n.readOnly)) {
        if ($.fields.length) {
          c.value = $;
          return;
        }
        if ($.confirm) {
          d.value = $;
          return;
        }
        return x($);
      }
    }
    async function x($) {
      d.value = null, h.value = "", a("failure", ""), p.value = !0;
      const C = await yn($, n.row, n.environment);
      p.value = !1, h.value = C.ok ? "" : C.error;
      const N = $.label.toLowerCase() + (n.objectName && !$.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", C.ok ? "" : `Could not ${N}: ${C.error}`), C.ok && a("done");
    }
    return ($, C) => (u(), f("span", {
      class: V(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), f(j, { key: 0 }, [
        C[5] || (C[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        T(pe, {
          small: "",
          onClick: i
        }, {
          default: F(() => [...C[4] || (C[4] = [
            Y("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", yf, [
        m("span", bf, v(d.value.confirm), 1),
        T(pe, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: V({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: C[0] || (C[0] = (N) => x(d.value))
        }, {
          default: F(() => [
            Y(v(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        T(pe, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: C[1] || (C[1] = (N) => d.value = null)
        }, {
          default: F(() => [...C[6] || (C[6] = [
            Y("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? b("", !0) : (u(), f(j, { key: 2 }, [
        (u(!0), f(j, null, ne(r.value, (N) => (u(), f(j, {
          key: N.name
        }, [
          N.menu.length ? (u(), W(ad, {
            key: 0,
            small: "",
            variant: N.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": N.menu_label || "More ways",
            title: y(N),
            "data-button": N.name,
            onMain: (q) => B(N)
          }, {
            menu: F(({ close: q }) => [
              (u(!0), f(j, null, ne(N.menu, (_) => (u(), W(ze, {
                key: _.label,
                description: _.description,
                onClick: (z) => (q(), B({ ...N, ..._, menu: [] }))
              }, {
                default: F(() => [
                  Y(v(_.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: F(() => [
              Y(v(N.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), W(pe, {
            key: 1,
            small: "",
            variant: N.primary ? "primary" : "ghost",
            bordered: !N.primary,
            class: V({ danger: N.danger }),
            icon: k(N),
            disabled: p.value,
            title: y(N),
            "data-button": N.name,
            onClick: (q) => B(N)
          }, {
            default: F(() => [
              Y(v(N.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", kf, v(h.value), 1)) : b("", !0),
        c.value && !e.readOnly ? (u(), W(hf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: C[2] || (C[2] = (N) => c.value = null),
          onDone: C[3] || (C[3] = (N) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : b("", !0)
      ], 64))
    ], 10, vf));
  }
}, Fs = /* @__PURE__ */ U(wf, [["__scopeId", "data-v-a4b6f174"]]), $f = {
  class: "running",
  "data-running-command": ""
}, xf = ["title"], Sf = {
  key: "idle",
  class: "running-idle"
}, Mf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", $f, [
      T(zt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: F(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, xf)) : (u(), f("span", Sf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, OS = /* @__PURE__ */ U(Mf, [["__scopeId", "data-v-d3240219"]]), _f = ["aria-checked", "aria-label", "title"], Cf = {
  key: 0,
  class: "switch-inner"
}, Ef = {
  key: 0,
  class: "switch-word"
}, Af = {
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
        e.labelled ? (u(), f("span", Cf, v(e.word), 1)) : b("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", Ef, v(e.word), 1)) : b("", !0)
    ], 10, _f));
  }
}, TS = /* @__PURE__ */ U(Af, [["__scopeId", "data-v-1bfb90f3"]]);
function di(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Xn(e, t) {
  return di(() => localStorage, e, t);
}
function fi(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ws(e, t) {
  return fi(() => localStorage, e, t);
}
function hi(e, t) {
  me(t, (n) => Ws(e, n), { deep: !0 });
}
function Of(e, t) {
  return di(() => sessionStorage, e, t);
}
function Tf(e, t) {
  return fi(() => sessionStorage, e, t);
}
const Jn = "journal.environment", mi = A(Of(Jn, Xn(Jn, "")));
function If(e) {
  mi.value = e, Tf(Jn, e), Ws(Jn, e);
}
const Zn = A(location.hash), Co = Je(null), Eo = { integrations: "mcp", library: "team" };
function Bf() {
  if (!Co.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Eo[n]) {
    location.replace(`#/${[Eo[n], ...a].join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash;
    return;
  }
  !n || Co.value(n) || (If(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Zn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Zn.value = location.hash, Bf();
});
const ds = E(() => {
  const [e, t = ""] = Zn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, r = ""] = l.split("@"), [c = "", d = "", h = ""] = i.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: r };
  });
  return {
    env: mi.value,
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
function Rf(e = "", t = 0, n = "") {
  location.hash = Hs.page(e, t, n);
}
function Lf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Nf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function pi(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Nf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const qt = {};
function IS(e, t) {
  return qt[e] = t, () => qt[e] === t && delete qt[e];
}
function vt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = qt[e]) != null && l.call(qt, t))) return;
  const s = ds.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  pi([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function qf(e, t, n, a = 0, s = "") {
  if (e === ds.value.env) return vt(t, n, a, s);
  const o = ds.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  pi([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? qf(a, s, Number(o), 0, t) : vt(s, Number(o), 0, t);
}
function Df(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Nt(e) {
  const t = Df(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function BS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Pf = { class: "inspector-part" }, jf = { class: "inspector-part-title" }, Ff = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", Pf, [
      m("h4", jf, v(e.title), 1),
      fe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, RS = /* @__PURE__ */ U(Ff, [["__scopeId", "data-v-5175e4a3"]]), Ao = /* @__PURE__ */ new Map(), Wf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = A(null), a = A(!1), s = A(t.name && Ao.get(t.name) || !1);
    function o(r) {
      s.value = r, t.name && Ao.set(t.name, r);
    }
    const l = () => {
      const r = !!n.value && n.value.scrollHeight > t.at;
      r !== a.value && (a.value = r);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return xe(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ie(() => i.disconnect()), (r, c) => (u(), f(j, null, [
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
      }, v(s.value ? "Show less" : "Show more"), 1)) : b("", !0)
    ], 64));
  }
}, gi = /* @__PURE__ */ U(Wf, [["__scopeId", "data-v-4d2235ba"]]), Hf = ["aria-valuenow", "aria-valuemax"], zf = {
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
    ], 10, Hf));
  }
}, vi = /* @__PURE__ */ U(zf, [["__scopeId", "data-v-9eba6a85"]]), Uf = { processes: "process", memories: "memory", replies: "reply" }, ea = (e) => (Uf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), fs = [], Gf = 2e3, ft = /* @__PURE__ */ new Map(), Vf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Kf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? fs.unshift(e) : fs.push(e), ft.clear();
}
function yi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Yf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Qf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function lt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Xf(e, t) {
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
  return Jf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Jf(e) {
  return e.split(Kf).map((t, n) => n % 2 ? t : t.replace(Vf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Oo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Zf = 24;
function eh(e) {
  const [t, , ...n] = e, a = Oo(t), s = n.map(Oo), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > Zf) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${un(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${un(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const bi = /^\s*(?:[-*+]|\d+[.)])\s+/, hs = /^\s*(\d+)[.)]\s/, To = (e) => e.match(/^\s*/)[0].length;
function ki(e) {
  const t = e[0].match(hs), n = To(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && To(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${un(o.text)}${o.nested.length ? ki(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function th(e, t) {
  const n = hs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (bi.test(e[s]) && hs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Io = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function wi(e) {
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
      n.push(eh(t.slice(a, i))), a = i;
      continue;
    }
    if (bi.test(s)) {
      const i = th(t, a);
      n.push(ki(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${wi(
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
const nh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ah = (e) => e.type !== "text" && !nh.test(e.html);
function sh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(wi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : ah(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function zs(e, t = { env: "" }) {
  const n = Qf(e, t), a = ft.get(n);
  if (ft.delete(n), a && a.source === t.source && a.reads.every((l) => Yf(l, t)))
    return ft.set(n, a), a.html;
  const s = [], o = sh(Xf(e, { ...t, reads: s }));
  return ft.set(n, { html: o, reads: s, source: t.source }), ft.size > Gf && ft.delete(ft.keys().next().value), o;
}
const Aa = /* @__PURE__ */ new WeakMap();
function oh(e) {
  if (Aa.has(e)) return Aa.get(e);
  const t = Qr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
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
function $i() {
  const e = _e(qe, null), t = e ? oh(e) : null;
  return (n, a = {}) => zs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const xi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, bn = (e) => String(e || "").replace(xi, (t, n, a, s) => s), lh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Bn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, ih = /^Traceback \(most recent call last\):/m, rh = 8;
function Si(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, rh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function uh(e) {
  const t = [...e.matchAll(lh)].map((a) => a.index);
  if (Bn.lastIndex = 0, !t.length || !Bn.test(e)) return null;
  Bn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Bn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Si(n), tail: "" } : null;
}
function ch(e) {
  const t = ih.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Si([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = bn(e), n = ch(t) || uh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ta = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Mi = (e) => `${e.table}:${e.id}`, Bo = (e) => (e || "").split(`
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
}, dh = (e) => (Lo[e.table] ? Lo[e.table](e) : e.title || "") || "", _t = (e) => ta(e.created_at), fh = (e) => ta(e.updated_at) || _t(e), hh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, mh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function ph(e) {
  const t = hh.exec(e);
  if (t && pt(t[1])) return { at: t.index, length: t[0].length, table: pt(t[1]), id: Number(t[2]), label: t[3] };
  const n = mh.exec(e), a = n && pt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function gh(e, t, n, a) {
  const s = yi(a, e, t), o = bn(s ? dh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${lt(Gt(e).title)} ${t}</span><span class="row-card-title">${lt(o)}</span></a>`;
}
Et(
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
  const n = bh.exec(e), [, a, s, o, l, i] = n || [], r = n && pt(a || o), c = r && yi(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Gt(r).title} ${c.id} · ${lt(i)}`, p = yh(i) ? `<img class="file-card-image" src="${d}" alt="${lt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${lt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function $h(e) {
  const t = kh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${lt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
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
Et((e) => e.replace(xh, (t, n) => `<code>${n}</code>`));
const No = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Hs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(xi, (n, a, s, o) => No[a] ? No[a](s, o, t) : o)
);
const Sh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, _i = new RegExp(`\\b(${ci}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Ci = new RegExp(`\\b(${ci}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Mh = new RegExp(`<code>((?:${_i.source}|${Ci.source}))</code>`, "gi"), _h = (e) => e.replace(Mh, "$1"), Ch = (e, t) => `<a class="row-pill" href="#" data-peek="${pt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Eh = (e) => e.replace(Ci, (t, n, a) => a.replace(/\d+/g, (s) => Ch(n.replace(/s$/i, ""), s))), Ah = (e) => Eh(e).replace(
  _i,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${pt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : _h(e).split(Sh).map((n, a) => a % 2 ? n : Ah(n)).join("")
);
const Oh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Th = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Ih = /[\w\]]\(/, Bh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Rh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Lh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Nh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, qh = /[[({,]$/, Dh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Ph = /^(\t|\s{2,})\S/, jh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Fh = /`[^`]+`/, Wh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Hh = /[{}()[\];=<>$&|*\\@+^~%]/g, Ei = /^\s*(?:[-*+]|\d+[.)])\s/, zh = /^\s*>/, Uh = /^\s*\|/, Gh = 0.6, Vh = 0.4, Kh = 5, Yh = 0.03, Ai = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Kh && t.every((n) => Wh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Hh) ?? []).length / e.length < Yh;
}, Ta = (e) => {
  const t = e.trim();
  return Fh.test(t) ? !1 : [Oh, Th, Ih, Bh, Rh, Lh, Nh, qh, Dh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Ph.test(e) && !Ei.test(e) && !Ai(e);
};
function Qh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ei.test(t[0]) || t.every((o) => zh.test(o) || Uh.test(o))) return "text";
  const n = t.filter((o) => !jh.test(o.trim()));
  if (t.length === 1) return !n.length || Ta(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ta).length, s = n.filter((o) => !Ta(o) && Ai(o)).length;
  return a >= n.length * Gh && s <= n.length * Vh ? "code" : "text";
}
const ms = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Xh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Jh = `${ms} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Zh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", em = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", qo = {
  js: { keywords: ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Xh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Jh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
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
function Do(e, t, n) {
  return n && e.startsWith(n, t);
}
function nm(e, t) {
  const n = qo[tm[t] ?? t] || qo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function am(e, t) {
  const n = [""];
  for (const { type: a, value: s } of nm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? lt(l) : `<span class="tok-${a}">${lt(l)}</span>`);
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
const om = 1500, Po = /* @__PURE__ */ new WeakMap();
async function lm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await sm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Po.get(t)), Po.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, om)
  )));
}
typeof document < "u" && document.addEventListener("click", lm, !0);
const im = /\n\s*\n/, rm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, um = /^\s*(`{3,}|~{3,})\s*$/, cm = /^\s{4,}\S/, dm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, ps = /^\s*(?:[-*+]|\d+[.)])\s/, Oi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, fm = [
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
function hm(e) {
  const t = Us(e.join(`
`));
  return (fm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const mm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Oi.test(t) && !ps.test(t);
}, pm = (e, t) => ps.test(t) || ps.test([...e].reverse().find((n) => n.trim()) || "");
function Gs(e, t) {
  const n = t || hm(e), a = am(Us(e.join(`
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
  return Gs(a.map(bn), n ? n.toLowerCase() : "");
}
function ym(e) {
  const t = e.split(im).map((l) => ({ paragraph: l, type: Qh(Us(l).split(`
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
    const i = n[l].match(rm);
    if (i) {
      const c = gm(n, l, i[2]);
      o(), a.push(vm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const r = mm(s) ? dm : cm;
    if (!t && r.test(n[l]) && !pm(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Oi.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
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
Et((e, t) => bm(e, t.document), { first: !0 });
const km = ["innerHTML"], wm = ["innerHTML"], $m = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = $i(), a = E(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, km)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => L(Nt) && L(Nt)(...l)),
      innerHTML: a.value
    }, null, 8, wm));
  }
}, st = /* @__PURE__ */ U($m, [["__scopeId", "data-v-d8e75741"]]), jo = (e) => [...new Set(e.agents.map((t) => t.name))], xm = (e) => jo(e).length === 1 ? `Worker: ${jo(e)[0]}` : "Delegated", Sm = ["aria-expanded"], Mm = {
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
    const t = e, n = _e(qe, null), a = E(() => hd(t.type, t.state)), s = A(!1), o = A([]), l = A("");
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
      Y(v(L(rn)(e.type, e.state)) + " ", 1),
      s.value ? (u(), f("span", Mm, [
        l.value ? (u(), f("span", _m, v(l.value), 1)) : b("", !0),
        (u(!0), f(j, null, ne(o.value, (p, y) => (u(), f("span", {
          key: y,
          class: "tip-line"
        }, v(p), 1))), 128))
      ])) : b("", !0)
    ], 40, Sm)) : (u(), f("span", Cm, v(L(rn)(e.type, e.state)), 1));
  }
}, Am = /* @__PURE__ */ U(Em, [["__scopeId", "data-v-73ac4596"]]), Om = {
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
    return (t, n) => (u(), f("div", Om, [
      m("div", Tm, [
        T(Am, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: V(["status", L(Jl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Im, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : b("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Bm, [
        m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Rm, v(e.plan.reason), 1)
      ])) : b("", !0),
      e.plan.total ? (u(), f("section", Lm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", Nm, [
          T(vi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", qm, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
        ])
      ])) : b("", !0),
      e.plan.assignee ? (u(), f("p", Dm, "Agent: " + v(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), f("p", Pm, v(L(xm)(e.plan)), 1)) : b("", !0),
      e.plan.brief ? (u(), f("section", jm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        T(gi, {
          name: `plans:${e.plan.id}:brief`,
          at: 220,
          keep: 160
        }, {
          default: F(() => [
            T(st, {
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
}, LS = /* @__PURE__ */ U(Fm, [["__scopeId", "data-v-c37da567"]]), Wm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Hm = { ...Wm, done: "Completed" }, zm = /* @__PURE__ */ new Set(["completed", "cancelled"]), Um = (e) => zm.has(e), cn = (e) => Um(e) ? "done" : e, Gm = { class: "task-status-icon" }, Vm = ["width", "height", "aria-label"], Km = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = E(() => Jl("task", cn(t.status))), a = E(() => n.value === "testing" ? "started" : n.value), s = E(() => Hm[t.status] ?? rn("task", t.status));
    return (o, l) => (u(), f("span", Gm, [
      T(zt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: F(() => [
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
          ], 10, Vm))
        ]),
        _: 1
      })
    ]));
  }
}, kn = /* @__PURE__ */ U(Km, [["__scopeId", "data-v-ae24a63f"]]), Ym = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Qm = ["title", "onClick"], Xm = { class: "agent-word" }, Jm = {
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
    return (o, l) => s.value.length ? (u(), f("div", Ym, [
      (u(!0), f(j, null, ne(s.value, (i) => (u(), f("button", {
        key: i.id,
        type: "button",
        class: "phase-agent",
        title: `Open ${i.name}`,
        "data-plan-phase-agent": "",
        onClick: (r) => L(Ne)(`agents:${i.id}`)
      }, [
        m("span", {
          class: V(["agent-dot", { held: i.held }])
        }, null, 2),
        Y(" " + v(i.name) + " ", 1),
        m("span", Xm, v(i.held ? "Working" : "Queued"), 1)
      ], 8, Qm))), 128))
    ])) : b("", !0);
  }
}, Zm = /* @__PURE__ */ U(Jm, [["__scopeId", "data-v-0c589695"]]), ep = { class: "phases" }, tp = { class: "phead" }, np = { class: "mark" }, ap = { class: "ptitle" }, sp = { class: "phead-end" }, op = {
  key: 0,
  class: "checkpoint"
}, lp = { class: "progress" }, ip = {
  key: 0,
  class: "when"
}, rp = ["onClick"], up = { class: "row-id" }, cp = { class: "row-title" }, dp = ["title"], fp = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = t, s = (l) => l.tasks.filter((i) => n.has(i.state)).length, o = (l) => l.tasks.length > 0 && s(l) === l.tasks.length;
    return (l, i) => (u(), f("ol", ep, [
      (u(!0), f(j, null, ne(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: V(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", tp, [
          m("span", np, [
            T(re, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", ap, v(c + 1) + ". " + v(r.title), 1),
          m("span", sp, [
            r.checkpoint ? (u(), f("span", op, "checkpoint")) : b("", !0),
            m("span", lp, v(s(r)) + "/" + v(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", ip, v(r.goal), 1)) : b("", !0),
        T(Zm, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(j, null, ne(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: V(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          T(kn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", up, "#" + v(d.id), 1),
          m("span", cp, v(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, v(d.helper_name), 9, dp)) : b("", !0)
        ], 10, rp))), 128))
      ], 2))), 128))
    ]));
  }
}, NS = /* @__PURE__ */ U(fp, [["__scopeId", "data-v-6a600744"]]), hp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, mp = {
  key: 0,
  class: "empty",
  role: "alert"
}, pp = {
  key: 2,
  class: "empty"
}, gp = { class: "day" }, vp = { class: "events" }, yp = { class: "mark" }, bp = { class: "what" }, kp = { class: "head" }, wp = { class: "word" }, $p = ["title", "onClick"], xp = { class: "at" }, Sp = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = A(null), l = A(""), i = E(() => {
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
    return me(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", hp, [
      l.value ? (u(), f("p", mp, v(l.value), 1)) : o.value === null ? (u(), W(Ke, { key: 1 })) : o.value.length ? b("", !0) : (u(), f("p", pp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(j, null, ne(i.value, (p) => (u(), f(j, {
        key: p.day
      }, [
        m("h3", gp, v(p.day), 1),
        m("ol", vp, [
          (u(!0), f(j, null, ne(p.items, (y) => (u(), f("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: V(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", yp, [
              n[y.event_type].state ? (u(), W(kn, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (u(), W(re, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", bp, [
              m("div", kp, [
                m("span", wp, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (k) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, $p),
                m("span", xp, v(r(y.time)), 1)
              ]),
              y.text ? (u(), W(st, {
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
}, qS = /* @__PURE__ */ U(Sp, [["__scopeId", "data-v-9e511133"]]);
function Mp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Vs(e, t = Date.now()) {
  const n = Mp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const _p = 36e5;
function Cp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / _p;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Fo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Ti(e) {
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
function Ii(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ia(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ia(Math.floor(t % 3600 / 60))}m ${Ia(t % 60)}s`;
}
const Ep = 1e3;
function Bi() {
  const e = A(Date.now()), t = setInterval(() => e.value = Date.now(), Ep);
  return tt(() => clearInterval(t)), e;
}
const Ap = Symbol("resource-subscriptions");
function wn(e, t) {
  const n = _e(Ap, () => new Ul(), !0), a = Rs(t, 100), s = n.follow("resources", e, a);
  fa(() => {
    s(), a.cancel();
  });
}
const Op = "Not known", Tp = 80, Ip = 1e3, Bp = "worker", Rp = "main", Lp = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), gs = (e) => e.ok ? e.value.rows : [], Ho = (e) => e.ok ? e.value.total : 0, Np = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), qp = (e, t) => (t == null ? void 0 : t.given_name) || Np((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Dp = (e, t) => e.ended_at ? "ended" : e.paused_at || Lp.has(t == null ? void 0 : t.state) ? "waiting" : "running", Ri = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Pp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Ip, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ii(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Tp }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Op : `$${t.cost_dollars.toFixed(2)}` }), e.role === Bp && l.push({ key: "pace", label: "Tasks an hour", value: String(Cp(Ri(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Rp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function jp(e) {
  const t = Ri(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Fp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", Fo(e.created_at)]), e.ended_at && n.push(["Ended", Fo(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const Wp = { class: "band" }, Hp = { key: 0 }, zp = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", Wp, [
      T(re, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      fe(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", Hp, v(e.count), 1)) : b("", !0)
    ]));
  }
}, Ft = /* @__PURE__ */ U(zp, [["__scopeId", "data-v-1758914f"]]), Up = { class: "number" }, Gp = { class: "text" }, Vp = 150, Kp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = A(!1), a = E(() => t.text.length > Vp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(j, null, [
      e.text ? (u(), f(j, { key: 0 }, [
        T(Ft, { icon: "file" }, {
          default: F(() => [
            Y(v(e.label), 1)
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
        }, "Show all")) : b("", !0)
      ], 64)) : b("", !0),
      e.points.length ? (u(), f(j, { key: 1 }, [
        T(Ft, { icon: "points" }, {
          default: F(() => [...l[1] || (l[1] = [
            Y("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(j, null, ne(e.points, (i) => {
          var r;
          return u(), f("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", Up, v(i.id), 1),
            m("span", Gp, [
              Y(v(i.text), 1),
              m("span", {
                class: V(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : b("", !0)
    ], 64));
  }
}, Yp = /* @__PURE__ */ U(Kp, [["__scopeId", "data-v-c99de22c"]]), Qp = ["aria-expanded"], Xp = { class: "count" }, Jp = {
  key: 0,
  "data-agent-fold-body": ""
}, Zp = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Pt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = on(e, "open");
    return (n, a) => (u(), f(j, null, [
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
        Y(v(e.label), 1),
        m("span", Xp, v(e.count), 1),
        T(re, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Qp),
      t.value ? (u(), f("div", Jp, [
        fe(n.$slots, "default", {}, void 0, !0)
      ])) : b("", !0)
    ], 64));
  }
}, Ba = /* @__PURE__ */ U(Zp, [["__scopeId", "data-v-7f93d8d9"]]), e1 = ["onClick"], t1 = { class: "text" }, n1 = { class: "aside" }, a1 = {
  key: 0,
  class: "none"
}, s1 = {
  class: "skills",
  "data-agent-skills": ""
}, o1 = {
  key: 0,
  class: "none-inline"
}, l1 = { class: "label" }, i1 = {
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
    return (i, r) => (u(), f(j, null, [
      T(Ba, {
        open: n.helpers,
        "onUpdate:open": r[0] || (r[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: F(() => [
          (u(!0), f(j, null, ne(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => L(vt)("agents", c.id)
          }, [
            m("span", t1, v(l(c)), 1),
            m("span", n1, v(L(Qn)(c.role)) + " " + v(c.id), 1)
          ], 8, e1))), 128)),
          a.value.length ? b("", !0) : (u(), f("p", a1, "It started no helpers."))
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
        default: F(() => [
          m("p", s1, [
            (u(!0), f(j, null, ne(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, v(c.skill), 1))), 128)),
            s.value.length ? b("", !0) : (u(), f("span", o1, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      T(Ba, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: F(() => [
          (u(!0), f(j, null, ne(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", l1, v(c) + ":", 1),
            m("span", {
              class: V(["value", h])
            }, v(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, r1 = /* @__PURE__ */ U(i1, [["__scopeId", "data-v-358a0300"]]), u1 = ["datetime", "title"], et = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Bi(), a = E(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(L(Vs)(e.at, L(n))), 9, u1));
  }
}, c1 = {
  class: "now",
  "data-agent-now": ""
}, d1 = {
  key: 1,
  class: "muted"
}, f1 = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, h1 = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, m1 = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, p1 = { class: "line" }, g1 = { class: "detail" }, v1 = { class: "bar" }, y1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = E(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(j, null, [
      T(Ft, { icon: "play" }, {
        default: F(() => [...o[2] || (o[2] = [
          Y("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", c1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => L(vt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (u(), f("span", d1, v(e.nothing), 1)),
        n.value ? (u(), f("span", f1, v(n.value), 1)) : b("", !0),
        e.inspection.last_activity ? (u(), f("span", h1, [
          o[3] || (o[3] = Y("Seen: ", -1)),
          T(et, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : b("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", m1, [
        m("div", p1, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => L(vt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", g1, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", v1, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : b("", !0)
    ], 64));
  }
}, b1 = /* @__PURE__ */ U(y1, [["__scopeId", "data-v-ff25c609"]]), k1 = ["onClick"], w1 = { class: "text" }, $1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, x1 = { class: "text" }, S1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, M1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(j, null, [
      T(Ft, { icon: "clock" }, {
        default: F(() => [...n[0] || (n[0] = [
          Y("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), f(j, null, ne(e.moves, (a) => (u(), f(j, {
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
          m("span", w1, v(a.text), 1),
          T(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, k1)) : (u(), f("div", $1, [
          m("i", {
            class: V(["dot", a.tone])
          }, null, 2),
          m("span", x1, v(a.text), 1),
          T(et, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? b("", !0) : (u(), f("p", S1, "Nothing yet."))
    ], 64));
  }
}, _1 = /* @__PURE__ */ U(M1, [["__scopeId", "data-v-58f0db57"]]), C1 = {
  class: "strip",
  "data-agent-strip": ""
}, E1 = ["data-agent-cell"], A1 = {
  key: 0,
  class: "meter"
}, O1 = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", C1, [
      (u(!0), f(j, null, ne(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: V({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", A1, [
          m("i", {
            class: V({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : b("", !0)
      ], 8, E1))), 128))
    ]));
  }
}, T1 = /* @__PURE__ */ U(O1, [["__scopeId", "data-v-b6657ab7"]]), I1 = {}, B1 = { class: "menu-label" };
function R1(e, t) {
  return u(), f("span", B1, [
    fe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const St = /* @__PURE__ */ U(I1, [["render", R1], ["__scopeId", "data-v-aa955b3e"]]), L1 = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, N1 = {
  key: 0,
  class: "skills-none"
}, q1 = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.skills.filter((l) => l.state === "loaded")), o = E(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (u(), f("div", L1, [
      T(St, null, {
        default: F(() => [...i[1] || (i[1] = [
          Y("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? b("", !0) : (u(), f("p", N1, "None yet. Compacting the conversation empties this list.")),
      (u(!0), f(j, null, ne(s.value, (r) => (u(), f("p", {
        key: r.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        T(re, {
          name: "book",
          size: 12
        }),
        Y(v(r.skill), 1)
      ]))), 128)),
      o.value.length ? (u(), f(j, { key: 1 }, [
        T(St, null, {
          default: F(() => [...i[2] || (i[2] = [
            Y("Still to read", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(j, null, ne(o.value, (r) => (u(), f("p", {
          key: r.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          T(re, {
            name: "book",
            size: 12
          }),
          Y(v(r.skill), 1)
        ]))), 128))
      ], 64)) : b("", !0),
      T(ze, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (r) => a("browse"))
      }, {
        default: F(() => [...i[3] || (i[3] = [
          Y("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, D1 = /* @__PURE__ */ U(q1, [["__scopeId", "data-v-be514d47"]]), P1 = ["disabled", "title"], j1 = { class: "gauge usage" }, F1 = {
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
      d[1] || (d[1] = Y()),
      m("span", j1, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      Y(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, P1)) : b("", !0);
  }
}, W1 = /* @__PURE__ */ U(F1, [["__scopeId", "data-v-048b0a74"]]);
function H1(e, t, n, { groups: a, programs: s }) {
  const o = A({}), l = A(""), i = A(!1), r = E(() => !!e.value && !e.value.ended_at), c = E(() => r.value && !!e.value.paused_at);
  async function d(k, B = null) {
    l.value = "";
    const x = await Nl(B, k, t);
    return l.value = x.ok ? "" : x.error, n(), x;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: r, paused: c, choose: (k, B) => d(["agent", "control", String(e.value.id), k, B.value], { target: o, fields: { value: { ...o.value, [k]: B.label } } }), stop: () => (i.value = !1, d(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (k) => d(["agent", "launch", k.name]) };
}
function z1(e) {
  if (!e) return "Not compacted yet";
  const t = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${t}` : e.end_percent === null ? `Last compacted ${t}, from ${e.start_percent}%` : `Last compacted ${t}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const U1 = ["disabled", "title"], G1 = ["disabled", "title"], V1 = { class: "gauge" }, K1 = ["disabled", "title"], Y1 = ["disabled"], Q1 = ["disabled"], X1 = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, J1 = ["title"], Z1 = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, eg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, tg = { class: "gauge" }, ng = { class: "context-used" }, ag = 75, sg = {
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
    const n = e, a = t, s = H1(xa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: xa(n, "controlGroups"), programs: xa(n, "agentPrograms") }), o = A(null), l = A(""), i = E(() => s.groups.value.find((C) => C.key === l.value));
    function r(C, N) {
      o.value = C.currentTarget, l.value = N;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const d = E(() => n.skills.filter((C) => C.state === "loaded"));
    function h(C) {
      r(C, "skills"), a("skills");
    }
    const p = (C) => s.groups.value.some((N) => N.key === C), y = E(() => {
      var C;
      return s.chosen.value.model ?? ((C = B.value) == null ? void 0 : C.model) ?? "";
    }), k = E(() => {
      var C;
      return s.chosen.value.effort ?? ((C = B.value) == null ? void 0 : C.effort) ?? "";
    });
    E(() => !!n.agent && !n.agent.ended_at);
    const B = E(() => {
      var C;
      return ((C = n.usage.agents) == null ? void 0 : C.find((N) => {
        var q;
        return N.id === ((q = n.agent) == null ? void 0 : q.id);
      })) ?? null;
    }), x = E(() => {
      var C;
      return ((C = B.value) == null ? void 0 : C.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), $ = E(() => {
      var C;
      return (C = B.value) != null && C.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    });
    return (C, N) => {
      var q;
      return u(), f("div", {
        class: V(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (u(), f(j, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: N[0] || (N[0] = (_) => r(_, "agent"))
          }, [
            T(re, {
              name: "agents",
              size: 12
            }),
            Y(" " + v(((q = e.agentPrograms.find((_) => _.name === e.agent.program)) == null ? void 0 : q.title) || e.agent.program), 1)
          ], 8, U1),
          T(W1, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: N[1] || (N[1] = (_) => a("open", "usage", _))
          }, null, 8, ["windows", "disabled"]),
          x.value !== null ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${x.value}% full: clear or compact it`,
            onClick: N[2] || (N[2] = (_) => p("context") ? r(_, "context") : a("open", "context", _.currentTarget))
          }, [
            T(re, {
              name: "gauge",
              size: 12
            }),
            N[14] || (N[14] = Y()),
            m("span", V1, [
              m("span", {
                style: ve({ width: `${x.value}%` })
              }, null, 4)
            ]),
            Y(" " + v(x.value) + "% ", 1)
          ], 8, G1)) : b("", !0),
          y.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: N[3] || (N[3] = (_) => p("model") ? r(_, "model") : null)
          }, [
            T(re, {
              name: "model",
              size: 12
            }),
            Y(" " + v(y.value), 1)
          ], 8, K1)) : b("", !0),
          p("effort") || e.card && k.value ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: N[4] || (N[4] = (_) => r(_, "effort"))
          }, [
            T(re, {
              name: "bolt",
              size: 12
            }),
            Y(" " + v(k.value), 1)
          ], 8, Y1)) : b("", !0),
          $.value ? (u(), f("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: N[5] || (N[5] = (_) => a("open", "cost", _.currentTarget))
          }, v($.value), 9, Q1)) : b("", !0),
          e.branch ? (u(), f("span", X1, [
            T(re, {
              name: "branch",
              size: 12
            }),
            Y(" " + v(e.branch), 1)
          ])) : b("", !0),
          e.card ? b("", !0) : (u(), f("button", {
            key: 5,
            type: "button",
            class: V(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: N[6] || (N[6] = (_) => a("open", "jobs", _.currentTarget))
          }, [
            T(re, {
              name: "clock",
              size: 12
            }),
            Y(" " + v(e.jobs), 1)
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
            Y(" " + v(d.value.length), 1)
          ])) : b("", !0),
          e.fitness ? (u(), f(j, { key: 7 }, [
            m("button", {
              type: "button",
              class: V(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ag }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: N[7] || (N[7] = (_) => a("open", "fitness", _.currentTarget))
            }, [
              T(re, {
                name: "heart",
                size: 12
              }),
              Y(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: V(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: N[8] || (N[8] = (_) => a("open", "load", _.currentTarget))
            }, [
              T(re, {
                name: "weight",
                size: 12
              }),
              Y(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : b("", !0)
        ], 64)) : e.run && !e.loading ? (u(), f("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: N[9] || (N[9] = (_) => r(_, "start"))
        }, [
          T(re, {
            name: "agents",
            size: 12
          }),
          N[15] || (N[15] = Y(" Start an agent", -1))
        ])) : b("", !0),
        N[21] || (N[21] = m("span", { class: "space" }, null, -1)),
        L(s).failure.value ? (u(), f("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: L(s).failure.value
        }, v(L(s).failure.value), 9, J1)) : b("", !0),
        fe(C.$slots, "default", {}, void 0, !0),
        o.value ? (u(), W(ha, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: F(() => {
            var _;
            return [
              l.value === "agent" ? (u(), f(j, { key: 0 }, [
                L(s).asking.value ? (u(), f(j, { key: 0 }, [
                  T(St, { "data-agent-stop-ask": "" }, {
                    default: F(() => [...N[16] || (N[16] = [
                      Y("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  T(ze, {
                    "data-agent-stop-confirm": "",
                    onClick: N[10] || (N[10] = (z) => (c(), L(s).stop()))
                  }, {
                    default: F(() => [...N[17] || (N[17] = [
                      Y("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  T(ze, {
                    onClick: N[11] || (N[11] = (z) => L(s).asking.value = !1)
                  }, {
                    default: F(() => [...N[18] || (N[18] = [
                      Y("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (u(), W(ze, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: N[12] || (N[12] = (z) => L(s).asking.value = !0)
                }, {
                  default: F(() => [...N[19] || (N[19] = [
                    Y("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (u(), f(j, { key: 1 }, [
                T(St, null, {
                  default: F(() => [...N[20] || (N[20] = [
                    Y("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (u(!0), f(j, null, ne(L(s).programs.value, (z) => (u(), W(ze, {
                  key: z.name,
                  "data-agent-program": z.name,
                  onClick: (H) => (c(), L(s).start(z))
                }, {
                  default: F(() => [
                    Y(v(z.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (u(), W(D1, {
                key: 2,
                skills: e.skills,
                onBrowse: N[13] || (N[13] = (z) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (u(), f(j, { key: 3 }, [
                T(St, null, {
                  default: F(() => [
                    Y(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (u(), f(j, { key: 0 }, [
                  m("p", Z1, v(L(z1)(((_ = B.value) == null ? void 0 : _.last_compaction) ?? null)), 1),
                  m("div", eg, [
                    m("span", tg, [
                      m("span", {
                        style: ve({ width: `${x.value}%` })
                      }, null, 4)
                    ]),
                    m("span", ng, v(x.value) + "%", 1)
                  ])
                ], 64)) : b("", !0),
                (u(!0), f(j, null, ne(i.value.choices, (z) => (u(), W(ze, {
                  key: z.value,
                  "data-agent-choice": z.value,
                  onClick: (H) => (L(s).choose(i.value.key, z), c())
                }, {
                  default: F(() => [
                    Y(v(z.label), 1)
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
}, og = /* @__PURE__ */ U(sg, [["__scopeId", "data-v-a6fce350"]]), lg = {
  class: "who",
  "data-agent-who": ""
}, ig = { class: "name" }, rg = ["data-agent-state"], ug = {
  class: "sub",
  "data-agent-started-by": ""
}, cg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", lg, [
      m("h2", ig, [
        m("i", {
          class: V(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, rg),
        Y(v(e.name), 1)
      ]),
      T(og, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", ug, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, dg = /* @__PURE__ */ U(cg, [["__scopeId", "data-v-83bd4a9d"]]), fg = {
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
    const t = e, n = Bi(), a = A(null), s = A(null), o = A(null), l = A({}), i = A({ helpers: 0, skills: 0 }), r = A(0), c = A([]), d = A([]), h = A("");
    let p = 0;
    const y = E(() => {
      var B;
      return a.value.ended_at ? jp(s.value) : `It has no task.${(B = s.value) != null && B.instruction ? " It was given an instruction." : ""}`;
    });
    async function k() {
      const B = ++p, x = await t.read(["agent", "show", String(t.id)]);
      if (B !== p) return;
      if (!x.ok) return void (h.value = x.error);
      const $ = String(t.id), C = x.value.role === "worker", [N, q, _, z, H, P, S] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", $, "--environment", t.environment]),
        t.read(["usage", "agent", $]),
        x.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", $]),
        t.read(["agent", "list", "--parent", $, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", $, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        C ? t.read(["worker-worktree", "points", "--agent", $]) : { ok: !1 },
        t.read(["agent", "programs"])
      ]);
      B === p && (h.value = q.ok ? "" : q.error, a.value = x.value, s.value = gs(N).find((O) => O.id === t.id) ?? null, o.value = q.ok ? q.value : null, l.value = _.ok ? _.value : {}, i.value = { helpers: Ho(z), skills: Ho(H) }, c.value = P.ok ? P.value.points : [], d.value = gs(S), r.value += 1);
    }
    return wn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], k), xe(k), (B, x) => {
      var $, C;
      return u(), f("article", fg, [
        m("div", hg, [
          h.value ? (u(), f("p", mg, v(h.value), 1)) : a.value && o.value ? (u(), f(j, { key: 1 }, [
            T(dg, {
              name: L(qp)(a.value, s.value),
              state: L(Dp)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: d.value,
              usage: { agents: s.value ? [s.value] : [], windows: (($ = s.value) == null ? void 0 : $.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            T(T1, {
              cells: L(Pp)({ row: a.value, facts: s.value, inspection: o.value, now: L(n) })
            }, null, 8, ["cells"]),
            T(b1, {
              inspection: o.value,
              tool: l.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            T(Yp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((C = s.value) == null ? void 0 : C.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            T(_1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            T(r1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: r.value,
              details: L(Fp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", pg, "Ended " + v(L(Vs)(a.value.ended_at, L(n))) + ". It takes no more actions.", 1)) : b("", !0)
          ], 64)) : (u(), W(Ke, { key: 2 }))
        ])
      ]);
    };
  }
}, DS = /* @__PURE__ */ U(gg, [["__scopeId", "data-v-c9e195e5"]]), vg = ["aria-expanded"], yg = { class: "drop-label" }, bg = ["value"], kg = {
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
    const n = e, a = t, s = A(!1), o = A(null), l = A(""), i = E(() => {
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
        e.icon ? (u(), W(re, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : b("", !0),
        m("span", yg, v(e.label), 1),
        T(re, {
          name: "down",
          size: 11
        })
      ], 10, vg),
      s.value ? (u(), W(ha, {
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
          }, null, 40, bg)) : b("", !0),
          (u(!0), f(j, null, ne(i.value, (h) => (u(), W(ze, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => r(h)
          }, {
            default: F(() => [
              h.running !== void 0 ? (u(), f("span", {
                key: 0,
                class: V(["drop-dot", { live: h.running }])
              }, null, 2)) : b("", !0),
              h.lead ? (u(), f("span", kg, v(h.lead), 1)) : b("", !0),
              m("span", wg, v(h.label), 1),
              h.note ? (u(), f("span", $g, v(h.note), 1)) : b("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? b("", !0) : (u(), f("p", xg, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : b("", !0)
    ], 2));
  }
}, Li = /* @__PURE__ */ U(Sg, [["__scopeId", "data-v-29dfcce5"]]);
function Mg(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return xe(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), tt(() => n.disconnect()), t;
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
    return (a, s) => (u(), f("article", {
      class: V(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (u(), f("div", Cg, [
        m("span", Eg, v(e.comment.number), 1),
        m("span", {
          class: V(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : b("", !0),
      m("p", Ag, v(e.comment.body), 1),
      m("div", Og, [
        e.comment.created_at ? (u(), W(et, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : b("", !0),
        e.lost ? (u(), f("span", Tg, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : b("", !0)
      ])
    ], 10, _g));
  }
}, Ni = /* @__PURE__ */ U(Ig, [["__scopeId", "data-v-a37d4507"]]);
var Tl;
/Mac|iPhone|iPad/.test(((Tl = navigator.userAgentData) == null ? void 0 : Tl.platform) || navigator.platform);
function qi(e, t) {
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
    const a = e, s = n, o = on(e, "draft"), l = A(""), i = A(!1), r = A(null), c = E(() => {
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
        } catch (k) {
          l.value = k.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => r.value.focus() }), (y, k) => (u(), f("div", Bg, [
      e.selection ? (u(), f("div", Rg, [
        k[3] || (k[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: V(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        T(ma, {
          title: "Comment on the whole document instead",
          onClick: k[0] || (k[0] = (B) => s("clear"))
        })
      ])) : b("", !0),
      l.value ? (u(), f("p", Lg, v(l.value), 1)) : b("", !0),
      m("div", Ng, [
        Ze(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": k[1] || (k[1] = (B) => o.value = B),
          rows: "1",
          maxlength: "2000",
          class: V({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: k[2] || (k[2] = Mt((B) => L(qi)(B, p), ["enter"]))
        }, null, 42, qg), [
          [Yn, o.value]
        ]),
        T(pe, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: F(() => [...k[4] || (k[4] = [
            Y("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, Pg = /* @__PURE__ */ U(Dg, [["__scopeId", "data-v-41d2081c"]]), Rn = (e) => e ? e.split(", ") : [];
function jg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Fg(e, t) {
  return {
    reads: Rn(e.reads_allowed),
    runs: Rn(e.runs_allowed),
    missing: [...Rn(e.reads_missing), ...Rn(e.runs_missing)],
    ask: t
  };
}
const Wg = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Xr("SkeletonParts", !0);
      return u(!0), f(j, null, ne(e.parts, (r, c) => (u(), f(j, { key: c }, [
        (u(!0), f(j, null, ne(r.count, (d) => (u(), W(Ut, {
          key: d,
          value: r.shape
        }, {
          line: F(() => [
            T(Zt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: r.width, height: `${t[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: F(() => [
            T(Zt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[r.size]}px`, height: `${n[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: F(() => [
            T(Zt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: r.width, height: `${r.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: F(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: F(() => [
            m("div", {
              class: "skeleton-row",
              style: ve(a(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: F(() => [
            m("div", {
              class: "skeleton-stack",
              style: ve(a(r))
            }, [
              T(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: F(() => [
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
          grid: F(() => [
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
}), Hg = /* @__PURE__ */ U(Wg, [["__scopeId", "data-v-fa8baeaf"]]), zg = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Ug = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", zg, [
      T(Hg, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Ks = /* @__PURE__ */ U(Ug, [["__scopeId", "data-v-52f66b64"]]), Di = {
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
}, Gg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: V(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Pi = /* @__PURE__ */ U(Gg, [["__scopeId", "data-v-9e7e1157"]]), Vg = { class: "bars" }, Kg = { class: "bar-name" }, Yg = { class: "bar-value" }, Qg = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = E(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", Vg, [
      (u(!0), f(j, null, ne(e.items, (r, c) => (u(), W(rt(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: V(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: F(() => [
          m("span", Kg, v(r.label), 1),
          T(vi, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Yg, v(r.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Xg = /* @__PURE__ */ U(Qg, [["__scopeId", "data-v-663427f4"]]), Jg = { class: "bars" }, Zg = {
  key: 0,
  class: "bars-title"
}, ev = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Jg, [
      e.node.title ? (u(), f("span", Zg, v(e.node.title), 1)) : b("", !0),
      T(Xg, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, tv = /* @__PURE__ */ U(ev, [["__scopeId", "data-v-7135bb11"]]), nv = {
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
      (u(!0), f(j, null, ne(e.node.children || [], (r, c) => (u(), W(ji, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Wn = /* @__PURE__ */ U(nv, [["__scopeId", "data-v-d142a3f4"]]), av = {
  key: 0,
  class: "card-head"
}, sv = { class: "card-title" }, ov = {
  key: 0,
  class: "card-note"
}, lv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: V(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", av, [
        m("span", sv, v(e.node.title), 1),
        e.node.note ? (u(), f("span", ov, v(e.node.note), 1)) : b("", !0)
      ])) : b("", !0),
      T(Wn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, iv = /* @__PURE__ */ U(lv, [["__scopeId", "data-v-67b72d40"]]), rv = { class: "fact" }, uv = { class: "fact-label" }, cv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", rv, [
      m("span", uv, v(e.label), 1),
      T(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, dv = /* @__PURE__ */ U(cv, [["__scopeId", "data-v-3a88ecf8"]]), fv = { class: "list" }, hv = { class: "list-label" }, mv = {
  key: 1,
  class: "list-note"
}, pv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", fv, [
      (u(!0), f(j, null, ne(e.items, (o, l) => (u(), W(rt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: V(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: F(() => [
          m("span", hv, v(o.label), 1),
          o.badge ? (u(), W(Pi, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : b("", !0),
          o.note ? (u(), f("span", mv, v(o.note), 1)) : b("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, gv = /* @__PURE__ */ U(pv, [["__scopeId", "data-v-ebe2ae0a"]]), vv = { class: "table" }, yv = {
  key: 0,
  class: "table-row empty"
}, bv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", vv, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (u(!0), f(j, null, ne(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (u(!0), f(j, null, ne(e.rows, (i, r) => (u(), W(rt(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: V(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: F(() => [
          (u(!0), f(j, null, ne(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", yv, v(e.empty), 1)) : b("", !0)
    ]));
  }
}, kv = /* @__PURE__ */ U(bv, [["__scopeId", "data-v-9326a52e"]]), wv = { class: "stat-value" }, $v = { class: "stat-label" }, xv = {
  key: 0,
  class: "stat-note"
}, Sv = {
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
    return (a, s) => (u(), W(rt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: V(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: F(() => [
        m("span", wv, v(e.value), 1),
        m("span", $v, v(e.label), 1),
        e.note ? (u(), f("span", xv, v(e.note), 1)) : b("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Mv = /* @__PURE__ */ U(Sv, [["__scopeId", "data-v-ad0db6d6"]]), _v = { class: "code" }, Cv = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), W(Ut, {
      value: e.node.type
    }, {
      stack: F(() => [
        T(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: F(() => [
        T(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: F(() => [
        T(Wn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: F(() => [
        T(iv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: F(() => [
        m("h3", {
          class: V(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: F(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: F(() => [
        T(Mv, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: F(() => [
        T(tv, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: F(() => [
        T(kv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: F(() => [
        T(gv, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: F(() => [
        T(st, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: F(() => [
        T(dv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: F(() => [
        T(Pi, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: F(() => [
        m("pre", _v, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: F(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ji = /* @__PURE__ */ U(Cv, [["__scopeId", "data-v-cbdcf540"]]), Ev = { class: "dashboard" }, Av = { class: "trail" }, Ov = ["onClick"], Tv = {
  key: 0,
  class: "gone",
  role: "status"
}, Iv = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = A(!!n.page && !s(n.page)), l = A(n.page && !o.value ? [n.page] : []), i = E(() => l.value.at(-1) || n.document.start), r = E(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return me(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (u(), f("div", Ev, [
      e.document.broken ? (u(), W(ln, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: F(() => [
          Y(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), W(ln, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: F(() => [
          Y(v(e.document.missing), 1)
        ]),
        _: 1
      })) : r.value ? (u(), f(j, { key: 2 }, [
        m("nav", Av, [
          m("button", {
            type: "button",
            class: V(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (k) => h(0))
          }, v(c(e.document.start)), 3),
          (u(!0), f(j, null, ne(l.value, (k, B) => (u(), f(j, {
            key: `${B}-${k}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: V(["step", { current: B === l.value.length - 1 }]),
              onClick: (x) => h(B + 1)
            }, v(c(k)), 11, Ov)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", Tv, "What you opened is no longer in this dashboard. Here is its start page.")) : b("", !0),
        T(zt, {
          name: "page",
          mode: "out-in"
        }, {
          default: F(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              T(ji, {
                node: r.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (k) => a("file", k))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : b("", !0)
    ]));
  }
}, Bv = /* @__PURE__ */ U(Iv, [["__scopeId", "data-v-fbe83734"]]);
function Rv(e, t) {
  const n = Ye(), a = Rs(e, Di.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  xe(e), tt(() => {
    s(), a.cancel();
  });
}
const Lv = {
  key: 0,
  class: "window-failure"
}, Nv = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ye(), o = A(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Rv(l, n.events) : Is(l, () => !0, Di.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", Lv, v(o.value.error), 1)) : o.value ? (u(), W(Bv, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : b("", !0);
  }
}, qv = 1e4;
class Dv {
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
    return this.heardAt !== null && t - this.heardAt > qv;
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
const Pv = {
  key: 0,
  class: "frame-note"
}, jv = {
  key: 0,
  class: "frame-note"
}, Fv = ["src", "title"], Wv = 1e3, Hv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ye(), a = A(null), s = A(!1), o = A(!1);
    let l = null, i = 0;
    return xe(() => {
      l = new Dv(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, Wv);
    }), Ie(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", Pv, "This window was closed because it stopped answering.")) : (u(), f(j, { key: 1 }, [
      s.value ? (u(), f("div", jv, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        T(pe, {
          onClick: c[0] || (c[0] = (d) => o.value = !0)
        }, {
          default: F(() => [...c[1] || (c[1] = [
            Y("Close the window", -1)
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
      }, null, 8, Fv)
    ], 64));
  }
}, zv = /* @__PURE__ */ U(Hv, [["__scopeId", "data-v-32a49046"]]), Uv = {
  class: "allowance-prompt",
  role: "dialog"
}, Gv = { class: "allowance-prompt-text" }, Vv = { class: "allowance-prompt-buttons" }, Kv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Uv, [
      m("p", Gv, v(L(jg)(e.request)), 1),
      m("div", Vv, [
        T(pe, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: F(() => [...s[2] || (s[2] = [
            Y("Allow", -1)
          ])]),
          _: 1
        }),
        T(pe, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: F(() => [...s[3] || (s[3] = [
            Y("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Yv = /* @__PURE__ */ U(Kv, [["__scopeId", "data-v-cad69fe2"]]), Ra = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), W(ln, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: F(() => [
        Y(v(e.reason) + " ", 1),
        e.retry ? (u(), W(pe, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: F(() => [...s[2] || (s[2] = [
            Y("Retry", -1)
          ])]),
          _: 1
        })) : b("", !0),
        e.removable ? (u(), W(pe, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: F(() => [...s[3] || (s[3] = [
            Y("Remove tab", -1)
          ])]),
          _: 1
        })) : b("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Qv = ["data-window", "data-agent"], Xv = {
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
    const i = _e(kc, null), r = bd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: E(() => n.options),
      declared: n.declared,
      page: _e(md, null),
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
    Il(qe, r), me(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), xe(r.settle), Ie(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Jr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ua(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), W(Yv, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : b("", !0),
      e.unavailableReason ? (u(), W(Ra, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), W(Ra, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(j, { key: 4 }, [
        (u(), W(c, { key: o.value })),
        e.skeleton.length && !L(r).answered.value ? (u(), W(Ks, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : b("", !0)
      ], 64)) : (u(), W(Ra, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Qv));
  }
}, en = /* @__PURE__ */ U(Xv, [["__scopeId", "data-v-c4443e2b"]]), Fi = {
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
    const n = e, a = t, s = { render: () => ua(zv, { src: n.entry.entry_url }) };
    return (o, l) => (u(), W(en, {
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
}, Jv = ["data-window"], Wi = {
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
    return me(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Pu();
          } catch (i) {
            if (qu(i) && Du(i)) return;
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
    ], 8, Jv)) : (u(), W(en, {
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
}, Zv = {
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
    const n = t, a = e, s = E(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = E(() => s.value && { render: () => ua(Nv, { line: s.value.line, events: s.value.events }) }), l = A(null), i = E(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), r = E(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = E(
      () => {
        var p, y;
        return l.value ? Fg(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
      var k, B;
      return !s.value && ((k = e.catalogue.loaded) == null ? void 0 : k.value) === !1 ? (u(), W(Ks, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((B = s.value) == null ? void 0 : B.shows) === "one-agent" && e.agent === null ? (u(), W(ln, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), W(en, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": r.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), W(Wi, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (x, $) => n("option", x, $))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), W(Fi, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (x, $) => n("option", x, $))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), W(en, {
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
        onOption: y[2] || (y[2] = (x, $) => n("option", x, $))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), W(en, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (x) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, ey = ["data-section"], ty = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, ny = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _e(Ds, null), a = E(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = E(() => ({ row: t.row }));
    return (o, l) => L(n) ? (u(!0), f(j, { key: 0 }, ne(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), W(Zv, {
        key: 0,
        name: i.name,
        catalogue: L(n).catalogue,
        subscriptions: L(n).subscriptions,
        environment: L(n).environment,
        prompts: L(n).prompts,
        "shell-read": L(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", ty, v(i.name) + " is not available", 1))
    ], 8, ey))), 128)) : b("", !0);
  }
}, vs = /* @__PURE__ */ U(ny, [["__scopeId", "data-v-a47d36b7"]]), ay = { class: "rail-head" }, sy = { key: 0 }, oy = {
  key: 1,
  class: "rail-none"
}, ly = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: V(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", ay, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", sy, v(e.total || e.comments.length), 1)) : b("", !0)
      ]),
      e.comments.length ? (u(!0), f(j, { key: 0 }, ne(e.comments, (a) => (u(), W(Ni, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", oy, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, iy = /* @__PURE__ */ U(ly, [["__scopeId", "data-v-4d684649"]]), ry = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, uy = ["aria-pressed"], cy = ["aria-pressed"], dy = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, fy = {
  key: 0,
  role: "alert"
}, hy = {
  key: 1,
  class: "sidebar-none"
}, my = ["data-question-id"], py = { class: "question-state" }, gy = ["data-question-show", "onClick"], vy = {
  key: 0,
  class: "sidebar-none"
}, yy = {
  key: 1,
  class: "question-answer"
}, by = {
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
    const t = _e(Ds, null);
    return (n, a) => (u(), f("div", {
      class: V(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", ry, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, uy),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, cy)
      ]),
      e.mode === "comments" ? (u(), f(j, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), W(iy, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : b("", !0),
        T(vn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (u(), f("aside", dy, [
        e.failure ? (u(), f("p", fy, v(e.failure), 1)) : e.questions.length ? b("", !0) : (u(), f("p", hy, "No questions about this text yet.")),
        (u(!0), f(j, null, ne(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: V(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", py, v(L(rn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, gy),
            s.quote ? (u(), f(j, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", vy, "The quoted text has changed.")) : b("", !0)
            ], 64)) : b("", !0),
            s.answer ? (u(), f("p", yy, "Answered: " + v(s.answer), 1)) : b("", !0),
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
          ], 10, my);
        }), 128))
      ]))
    ], 2));
  }
}, zo = /* @__PURE__ */ U(by, [["__scopeId", "data-v-2718a08d"]]), ky = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, wy = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ht({ abstract: n.row.abstract, body: n.row.body }), o = A("");
    async function l() {
      const i = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, r) => (u(), W(pa, {
      title: "Edit the document",
      wide: "",
      onClose: r[3] || (r[3] = (c) => a("close"))
    }, {
      foot: F(() => [
        m("span", ky, v(o.value), 1),
        T(pe, {
          onClick: r[2] || (r[2] = (c) => a("close"))
        }, {
          default: F(() => [...r[6] || (r[6] = [
            Y("Cancel", -1)
          ])]),
          _: 1
        }),
        T(pe, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: F(() => [...r[7] || (r[7] = [
            Y("Save", -1)
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
            Ze(m("input", {
              "onUpdate:modelValue": r[0] || (r[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Yn, s.abstract]
            ])
          ]),
          m("label", null, [
            r[5] || (r[5] = m("span", null, "Text", -1)),
            Ze(m("textarea", {
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
}, $y = /* @__PURE__ */ U(wy, [["__scopeId", "data-v-e99f14e0"]]);
function Hi(e, t) {
  const n = A([]), a = A(!1), s = A(null), o = A(0), l = A(!1), i = A("");
  let r = 0, c = 0;
  const d = (k) => {
    if (typeof k.body == "string") return k.body;
    const { noun: B, id: x, title: $ } = e(), C = `On ${B} ${x}, ${$}: `;
    return k.text.startsWith(C) ? k.text.slice(C.length) : k.text;
  };
  async function h(k = 1) {
    const { noun: B, id: x } = e();
    if (!x) return;
    const $ = ++c;
    l.value = !0, i.value = "";
    try {
      const C = await t([B, "comments", String(x), "--page", String(k), "--page-size", "25"]);
      if ($ !== c) return;
      if (!C.ok) {
        i.value = C.error;
        return;
      }
      const N = C.value.rows ?? [], q = k === 1 ? N : [...n.value, ...N];
      n.value = [...new Map(q.map((_) => [_.id, _])).values()], o.value = C.value.total ?? n.value.length, s.value = C.value.next_page ?? null;
    } catch (C) {
      $ === c && (i.value = C.message);
    } finally {
      $ === c && (l.value = !1);
    }
  }
  async function p(k) {
    var _;
    const { noun: B, id: x } = e(), $ = `${B}:${x}`, C = { id: `sending-${++r}`, text: k };
    n.value = [...n.value, C], o.value++, a.value = !0;
    const N = await t([B, "comment", String(x), k]);
    if ($ !== `${e().noun}:${e().id}`) return;
    if (!N.ok)
      throw n.value = n.value.filter((z) => z.id !== C.id), o.value = Math.max(0, o.value - 1), new Error(N.error);
    await h();
    const q = (_ = N.value) == null ? void 0 : _.id;
    q && !n.value.some((z) => z.id === q) && (n.value = [...n.value, { ...C, id: q }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return me(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: p, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function xy(e, t) {
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
const Sy = {
  class: "document-tab",
  "data-document-revisions": ""
}, My = ["datetime"], _y = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Cy = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Ey = {
  key: 2,
  class: "document-none"
}, Ay = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), o = A(""), l = E(() => s.value ? xy(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", Sy, [
      e.editing ? (u(), W(pe, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (h) => a("close-revision"))
      }, {
        default: F(() => [...d[1] || (d[1] = [
          Y("Close the open revision", -1)
        ])]),
        _: 1
      })) : b("", !0),
      e.revisions.length ? (u(), f(j, { key: 1 }, [
        (u(!0), f(j, null, ne(e.revisions, (h) => (u(), W(pe, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: F(() => [
            Y("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, My)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", _y, v(o.value), 1)) : b("", !0),
        s.value ? (u(), f(j, { key: 1 }, [
          T(pe, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: r
          }, {
            default: F(() => [...d[2] || (d[2] = [
              Y("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", Cy, [
            (u(!0), f(j, null, ne(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: V(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : b("", !0)
      ], 64)) : (u(), f("p", Ey, "No revisions"))
    ]));
  }
}, Oy = /* @__PURE__ */ U(Ay, [["__scopeId", "data-v-3a381aa4"]]), Ty = "button, [data-comment-number]", Iy = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function zi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Ty) || n.push(t.currentNode);
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
const By = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function Ry(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = zi(e), s = a.map((c) => c.data).join(""), o = Uo(a, n.startContainer, n.startOffset), l = s.slice(o, Uo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: By(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function Ly(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function Ny(e, t, n) {
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
function qy({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function Dy(e, t) {
  const n = zi(e), a = Ly(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = Ny(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(qy).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(La(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(La(t.number, t.id, t.label)) : l.at(-1).append(La(t.number, t.id, t.label))), !0;
}
function Py(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !Dy(e, a) && a.id && n.push(a.id);
  return n;
}
const jy = (e) => e.closest(Iy) ?? e;
function Go(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Fy = {
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
      const B = a.comments.filter((N) => N.quote).map((N) => ({ ...N, label: a.annotationLabel, hot: N.id === a.hot })), x = Py(l.value, a.pending ? [...B, { ...a.pending, pending: !0 }] : B);
      s("lost", x);
      const $ = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!$) {
        c.value = null;
        return;
      }
      const C = document.createElement("div");
      C.className = "inline-comment", jy($).after(C), c.value = C;
    }
    function h() {
      if (!l.value) return;
      const B = Ry(l.value);
      if (r.value = !!B, !B) {
        i.value = null;
        return;
      }
      const x = window.getSelection().getRangeAt(0).getBoundingClientRect(), $ = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(x.left - $.left, 0)}px`, top: `${x.top - $.top + o.value.scrollTop}px` }, s("select", B);
    }
    function p(B) {
      const x = B.target.closest("[data-comment-number]");
      x ? s("number", Number(x.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(B) {
      var x;
      (x = l.value.querySelector(`[data-comment="${B}"]`)) == null || x.scrollIntoView({ block: "center" });
    }
    function k(B) {
      var x;
      (x = l.value.querySelectorAll("h3, h4, h5, h6")[B]) == null || x.scrollIntoView({ block: "start" });
    }
    return me(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), xe(() => {
      d(), document.addEventListener("selectionchange", h);
    }), tt(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: k, nextTick: je }), (B, x) => (u(), f("div", {
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
        onMousedown: x[0] || (x[0] = $e(() => {
        }, ["prevent"])),
        onClick: x[1] || (x[1] = ($) => s("write"))
      }, [
        T(re, {
          name: "chat",
          size: 13
        }),
        x[2] || (x[2] = Y("Comment on this", -1))
      ], 36)) : b("", !0),
      c.value ? (u(), W(da, {
        key: 1,
        to: c.value
      }, [
        fe(B.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : b("", !0),
      fe(B.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Wy = /* @__PURE__ */ U(Fy, [["__scopeId", "data-v-548d0aaa"]]), Hy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, zy = { class: "document-tabs" }, Uy = { class: "document-body" }, Gy = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Vy = {
  key: 1,
  class: "document-loading"
}, Ky = {
  class: "document-details",
  "data-resource-fields": ""
}, Yy = 760, Qy = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = Mg(n), s = E(() => a.value !== null && a.value < Yy), o = A(null), l = A(""), i = A([]), r = A([]), c = A(""), d = A("comments"), h = A("text"), p = A(0), y = A(0), k = A([]), B = A(null), x = A(""), $ = A(!1), C = A(null), N = A(null);
    let q = 0;
    const _ = Hi(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (oe) => t.read(oe)), z = E(() => Go(_.comments.value)), H = E(() => d.value === "questions" ? Go(r.value) : z.value), P = E(() => d.value === "questions" ? H.value.length : _.total.value), S = E(() => {
      var oe;
      return (oe = o.value) != null && oe.body ? zs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), O = E(() => {
      var oe;
      return (((oe = o.value) == null ? void 0 : oe.body) ?? "").split(`
`).filter((ee) => /^#{1,4} /.test(ee)).map((ee, te) => ({ key: String(te), value: te, label: ee.replace(/^#+ /, "") }));
    }), w = E(() => z.value.find((oe) => oe.id === y.value)), g = E(() => {
      var oe;
      return (oe = o.value) != null && oe.close_reason ? "Closed" : "Open";
    }), M = E(() => h.value === "comments" && !s.value ? "text" : h.value), I = (oe) => oe.ok ? oe.value.rows ?? [] : [];
    async function R() {
      const oe = ++q, ee = await t.read([t.noun, "inspect", String(t.id)]);
      if (oe !== q) return;
      l.value = ee.ok ? "" : ee.error, o.value = ee.ok ? ee.value : null;
      const te = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), De = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      oe === q && (r.value = I(te), c.value = te.ok ? "" : te.error, i.value = De ? I(De) : []);
    }
    async function D(oe) {
      const ee = B.value ? ["--quote", B.value.quote, "--position", String(B.value.position), "--selection-type", B.value.selection_type] : [], te = await t.read([t.noun, "comment", String(t.id), ...ee, "--", oe]);
      if (!te.ok) throw new Error(te.error);
      B.value = null, await Promise.all([R(), _.load()]);
    }
    async function Z() {
      const oe = await t.read(["doc", "close", String(t.id)]);
      l.value = oe.ok ? "" : oe.error, oe.ok && await R();
    }
    function ae() {
      x.value.trim() || (B.value = null);
    }
    function le(oe) {
      var ee;
      if (p.value = oe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? y.value = y.value === oe ? 0 : oe : (ee = n.value.querySelector(d.value === "questions" ? `[data-question-id="${oe}"]` : `[data-comment-id="${oe}"]`)) == null || ee.scrollIntoView({ block: "nearest" });
    }
    async function ge(oe) {
      var ee, te;
      h.value = "text", p.value = oe, await ((ee = C.value) == null ? void 0 : ee.nextTick()), (te = C.value) == null || te.show(oe);
    }
    function Ae() {
      $.value = !1, R();
    }
    return me(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, y.value = 0, B.value = null, r.value = [], c.value = "", R();
    }, { immediate: !0 }), me(d, () => {
      p.value = 0, y.value = 0;
    }), (oe, ee) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", Hy, [
        T(pe, {
          bordered: "",
          "data-text-edit": "",
          onClick: ee[0] || (ee[0] = (te) => $.value = !0)
        }, {
          default: F(() => [...ee[14] || (ee[14] = [
            Y("Edit", -1)
          ])]),
          _: 1
        })
      ])) : b("", !0),
      m("nav", zy, [
        m("button", {
          type: "button",
          class: V(["document-tab-button", { on: M.value === "text" }]),
          "data-document-tab": "text",
          onClick: ee[1] || (ee[1] = (te) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: V(["document-tab-button", { on: M.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: ee[2] || (ee[2] = (te) => h.value = "comments")
        }, [
          Y(v(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(P.value || ""), 1)
        ], 2)) : b("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: V(["document-tab-button", { on: M.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: ee[3] || (ee[3] = (te) => h.value = "revisions")
        }, [
          ee[15] || (ee[15] = Y("Revisions ", -1)),
          m("em", null, v(i.value.length || ""), 1)
        ], 2)) : b("", !0),
        ee[16] || (ee[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        M.value === "text" && O.value.length > 1 ? (u(), W(Li, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: O.value,
          "data-text-chapters": "",
          onPick: ee[4] || (ee[4] = (te) => {
            var De;
            return (De = C.value) == null ? void 0 : De.showHeading(te.value);
          })
        }, null, 8, ["label", "items"])) : b("", !0)
      ]),
      m("div", Uy, [
        l.value ? (u(), f("p", Gy, v(l.value), 1)) : o.value ? M.value === "revisions" ? (u(), W(Oy, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: Z,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : M.value === "comments" ? (u(), W(zo, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": ee[5] || (ee[5] = (te) => d.value = te),
          tab: "",
          comments: z.value,
          questions: r.value,
          hot: p.value,
          lost: k.value,
          failure: c.value,
          read: e.read,
          "comment-more": !!L(_).nextPage.value,
          "comment-loading": L(_).loading.value,
          "comment-failure": L(_).failure.value,
          "comment-total": L(_).total.value,
          onMore: L(_).loadMore,
          onShow: ge,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(j, { key: 4 }, [
          T(Wy, {
            ref_key: "words",
            ref: C,
            html: S.value,
            comments: H.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: B.value,
            inline: y.value,
            onSelect: ee[7] || (ee[7] = (te) => B.value = te),
            onClear: ae,
            onNumber: le,
            onWrite: ee[8] || (ee[8] = (te) => {
              var De;
              return (De = N.value) == null ? void 0 : De.focus();
            }),
            onLost: ee[9] || (ee[9] = (te) => k.value = te)
          }, {
            inline: F(() => [
              w.value ? (u(), W(Ni, {
                key: 0,
                comment: w.value,
                hot: "",
                onShow: ee[6] || (ee[6] = (te) => ge(w.value.id))
              }, null, 8, ["comment"])) : b("", !0)
            ]),
            default: F(() => [
              m("dl", Ky, [
                ee[18] || (ee[18] = m("h4", null, "Details", -1)),
                ee[19] || (ee[19] = m("dt", null, "State", -1)),
                m("dd", null, v(g.value), 1),
                o.value.close_reason ? (u(), f(j, { key: 0 }, [
                  ee[17] || (ee[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(o.value.close_reason), 1)
                ], 64)) : b("", !0),
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
          s.value ? b("", !0) : (u(), W(zo, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": ee[10] || (ee[10] = (te) => d.value = te),
            comments: z.value,
            questions: r.value,
            hot: p.value,
            lost: k.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!L(_).nextPage.value,
            "comment-loading": L(_).loading.value,
            "comment-failure": L(_).failure.value,
            "comment-total": L(_).total.value,
            onMore: L(_).loadMore,
            onShow: ge,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", Vy, [
          T(Ke)
        ]))
      ]),
      o.value ? (u(), W(Pg, {
        key: 1,
        ref_key: "composer",
        ref: N,
        draft: x.value,
        "onUpdate:draft": ee[11] || (ee[11] = (te) => x.value = te),
        selection: B.value,
        send: D,
        narrow: s.value,
        onClear: ee[12] || (ee[12] = (te) => B.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : b("", !0),
      $.value ? (u(), W($y, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: ee[13] || (ee[13] = (te) => $.value = !1),
        onSaved: Ae
      }, null, 8, ["noun", "id", "row", "read"])) : b("", !0)
    ], 512));
  }
}, PS = /* @__PURE__ */ U(Qy, [["__scopeId", "data-v-784faf41"]]), Xy = {
  key: 1,
  class: "row-list-failure"
}, Jy = ["data-row"], Zy = {
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
    const t = e, n = E(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", "data-row-list-moves": "" } : {}), a = A(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), W(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", Xy, v(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), W(ln, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: F(() => [
        Y(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(j, { key: 3 }, [
      (u(), W(rt(e.arrival || e.moves ? Os : "ul"), Pe(n.value, { class: "row-list" }), {
        default: F(() => [
          (u(!0), f(j, null, ne(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            fe(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Jy))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : b("", !0)
    ], 64));
  }
}, e0 = /* @__PURE__ */ U(Zy, [["__scopeId", "data-v-059675a8"]]), t0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, n0 = {
  key: 1,
  class: "agent-rows-note"
}, a0 = {
  key: 2,
  class: "agent-rows-note"
}, s0 = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, o0 = ["data-agent-row", "onClick"], l0 = { class: "agent-row-name" }, i0 = { class: "agent-row-state" }, r0 = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = E(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", t0, [
      e.loaded ? e.failure ? (u(), f("p", n0, v(e.failure), 1)) : e.rows.length ? (u(), f(j, { key: 3 }, [
        m("p", s0, v(a.value) + " running", 1),
        (u(!0), f(j, null, ne(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => L(Ne)(`agents:${l.id}`)
        }, [
          m("span", l0, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", i0, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, o0))), 128))
      ], 64)) : (u(), f("p", a0, v(e.none), 1)) : (u(), W(Ke, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, jS = /* @__PURE__ */ U(r0, [["__scopeId", "data-v-a01e5a17"]]), dt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ue = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, He = { across: 48, down: 110, margin: 32, labelSpace: 14 }, u0 = 6;
function Ys(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const c0 = (e) => {
  const t = Ys(e, dt.lineChars), n = Math.max(dt.minWidth, Math.max(...t.map((a) => a.length)) * dt.charWidth + dt.padX * 2);
  return { name: e, lines: t, line: dt.line, padY: dt.padY, width: n, height: t.length * dt.line + dt.padY * 2 };
};
function d0(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function f0(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function h0(e, t, n) {
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
  for (let l = 0; l < u0; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function m0(e, t) {
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
function p0(e) {
  const t = [...new Set(e.flatMap(([q, _]) => [q, _]))], n = new Set(e.map(([, q]) => q)), a = t.filter((q) => !n.has(q)), s = d0(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((q, _) => !s.has(_)), l = f0(t, o), i = h0(t, o, l), r = new Map(t.map((q) => [q, c0(q)])), c = i.map((q) => q.reduce((_, z) => _ + r.get(z).width, 0) + He.across * (q.length - 1)), d = Math.max(...c) + He.margin * 2, h = v0(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = He.margin;
  i.forEach((q, _) => {
    let z = (d - c[_]) / 2;
    const H = Math.max(...q.map((P) => r.get(P).height));
    q.forEach((P) => {
      const S = r.get(P);
      p.set(P, { ...S, x: z, y: y + (H - S.height) / 2 }), z += S.width + He.across;
    }), y += H + (h[_] ?? He.down);
  });
  const k = e.map(([q, _, z], H) => ({ from: q, to: _, label: z || "", back: s.has(H) || l.get(_) <= l.get(q) }));
  m0(k, p);
  const B = k.map((q) => y0(q, p.get(q.from), p.get(q.to))), x = [...p.values()], $ = $0(B, x), C = Math.max(y - He.down, ...$.filter((q) => q.label).map((q) => q.label.y + q.label.height));
  return { width: Math.max(d - He.margin, ...$.filter((q) => q.label).map((q) => q.label.x + q.label.width)) + He.margin, height: C + He.margin, nodes: x, arrows: $ };
}
const g0 = (e) => e ? Ys(e, Ue.lineChars).length * Ue.line + Ue.pad * 2 : 0;
function v0(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => He.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += g0(l) + He.labelSpace);
  }), a.map((s) => Math.max(He.down, s));
}
function y0(e, t, n) {
  const a = e.label ? Ys(e.label, Ue.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ue.charWidth + Ue.pad * 2 : 0, o = a.length * Ue.line + (a.length ? Ue.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const b0 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, k0 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], w0 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ue.line);
function $0(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = b0(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = w0.flatMap((r) => k0.map((c) => s(c, r))).find((r) => !n.some((c) => Vo(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => Vo(i, r)); ) i.y += Ue.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ue.line, pad: Ue.pad } };
  });
}
const Vo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, x0 = { class: "flowchart-tools" }, S0 = ["width", "height", "viewBox", "aria-label"], M0 = ["d"], _0 = ["x", "y", "width", "height"], C0 = ["x", "y"], E0 = ["x", "dy"], A0 = {
  key: 0,
  class: "flowchart-label"
}, O0 = ["x", "y", "width", "height"], T0 = ["x", "y"], I0 = ["x", "dy"], B0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => p0(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = A(null), i = A({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var $;
      const B = ($ = l.value) == null ? void 0 : $.getBoundingClientRect();
      if (!(B != null && B.width)) return;
      const x = Math.min(B.width / s.value.width, B.height / s.value.height, 1.5);
      i.value = { zoom: x, x: (B.width - s.value.width * x) / 2, y: (B.height - s.value.height * x) / 2 };
    }
    function d(B, x, $) {
      const { zoom: C, x: N, y: q } = i.value, _ = Math.min(o.most, Math.max(o.least, C * B));
      i.value = { zoom: _, x: x - (x - N) * _ / C, y: $ - ($ - q) * _ / C };
    }
    function h(B) {
      const x = l.value.getBoundingClientRect();
      d(B, x.width / 2, x.height / 2);
    }
    function p(B) {
      const x = l.value.getBoundingClientRect();
      B.ctrlKey || B.metaKey ? d(B.deltaY < 0 ? o.step : 1 / o.step, B.clientX - x.left, B.clientY - x.top) : i.value = { ...i.value, x: i.value.x - B.deltaX, y: i.value.y - B.deltaY };
    }
    function y(B) {
      var x, $, C;
      B.preventDefault(), (x = window.getSelection()) == null || x.removeAllRanges(), r = { x: B.clientX - i.value.x, y: B.clientY - i.value.y }, (C = ($ = l.value).setPointerCapture) == null || C.call($, B.pointerId);
    }
    function k(B) {
      r && (i.value = { ...i.value, x: B.clientX - r.x, y: B.clientY - r.y });
    }
    return xe(c), (B, x) => (u(), W(pa, {
      title: e.title,
      large: "",
      onClose: x[4] || (x[4] = ($) => a("close"))
    }, {
      default: F(() => [
        m("div", x0, [
          T(pe, {
            small: "",
            onClick: x[0] || (x[0] = ($) => h(o.step))
          }, {
            default: F(() => [...x[5] || (x[5] = [
              Y("Zoom in", -1)
            ])]),
            _: 1
          }),
          T(pe, {
            small: "",
            onClick: x[1] || (x[1] = ($) => h(1 / o.step))
          }, {
            default: F(() => [...x[6] || (x[6] = [
              Y("Zoom out", -1)
            ])]),
            _: 1
          }),
          T(pe, {
            small: "",
            onClick: c
          }, {
            default: F(() => [...x[7] || (x[7] = [
              Y("Fit the whole chart", -1)
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
          onPointermove: k,
          onPointerup: x[2] || (x[2] = ($) => mo(r) ? r.value = null : r = null),
          onPointercancel: x[3] || (x[3] = ($) => mo(r) ? r.value = null : r = null)
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
            x[8] || (x[8] = m("defs", null, [
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
            (u(!0), f(j, null, ne(s.value.arrows, ($, C) => (u(), f("path", {
              key: `arrow-${C}`,
              class: "flowchart-arrow",
              d: $.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, M0))), 128)),
            (u(!0), f(j, null, ne(s.value.nodes, ($) => (u(), f("g", {
              key: $.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: $.x,
                y: $.y,
                width: $.width,
                height: $.height,
                rx: "8"
              }, null, 8, _0),
              m("text", {
                x: $.x + $.width / 2,
                y: $.y + $.padY + $.line / 2
              }, [
                (u(!0), f(j, null, ne($.lines, (C, N) => (u(), f("tspan", {
                  key: N,
                  x: $.x + $.width / 2,
                  dy: N ? $.line : 0
                }, v(C), 9, E0))), 128))
              ], 8, C0)
            ]))), 128)),
            (u(!0), f(j, null, ne(s.value.arrows, ($, C) => (u(), f(j, {
              key: `label-${C}`
            }, [
              $.label ? (u(), f("g", A0, [
                m("rect", {
                  x: $.label.x,
                  y: $.label.y,
                  width: $.label.width,
                  height: $.label.height,
                  rx: "4"
                }, null, 8, O0),
                m("text", {
                  x: $.label.x + $.label.width / 2,
                  y: $.label.y + $.label.pad + $.label.line / 2
                }, [
                  (u(!0), f(j, null, ne($.label.lines, (N, q) => (u(), f("tspan", {
                    key: q,
                    x: $.label.x + $.label.width / 2,
                    dy: q ? $.label.line : 0
                  }, v(N), 9, I0))), 128))
                ], 8, T0)
              ])) : b("", !0)
            ], 64))), 128))
          ], 12, S0))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, R0 = /* @__PURE__ */ U(B0, [["__scopeId", "data-v-51d24cfe"]]), L0 = ["innerHTML"], N0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = E(() => $o[t.name] || $o.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, L0));
  }
}, Ct = /* @__PURE__ */ U(N0, [["__scopeId", "data-v-beb5935c"]]), q0 = {
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
}, Vt = /* @__PURE__ */ U(q0, [["__scopeId", "data-v-d03899bb"]]), D0 = ["data-tip", "aria-label"], P0 = {
  key: 0,
  class: "mact-word"
}, j0 = {
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
      e.open ? (u(), f("span", P0, v(e.label), 1)) : b("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, D0));
  }
}, Ui = /* @__PURE__ */ U(j0, [["__scopeId", "data-v-3b292e09"]]), Gi = 120, Hn = 280, Vi = 160, F0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, W0 = ["leaving", "resizing", "entering"];
function ys(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function H0(e) {
  const t = W0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ys(e);
  return e.classList.add(...t), n;
}
function Ki(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = A(t()), s = A("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, p) {
    i(h);
    const y = H0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Hn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const k = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, r(h, ys(h)));
    });
    return k.observe(p), k;
  }
  async function d(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || F0()) {
      a.value = h;
      return;
    }
    const k = ys(p);
    if (l(p, k), s.value = "leaving", await n(Gi), y !== o) return;
    a.value = h, s.value = "resizing", await je(), r(p, k);
    const B = c(p);
    await n(Hn), B == null || B.disconnect(), y === o && (i(p), s.value = "entering", await n(Vi), y === o && (s.value = ""));
  }
  return me(t, (h) => d(h)), tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const z0 = { class: "growing-card-top" }, U0 = ["aria-expanded"], G0 = { class: "growing-card-avatar" }, V0 = { class: "growing-card-title" }, K0 = { class: "growing-card-more" }, Y0 = { class: "growing-card-body" }, Q0 = {
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
    const n = e, a = t, s = A(!1), o = A(null), { folded: l, phase: i } = Ki(o, () => !s.value), r = E(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = E(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: V(["growing-card-wrap", L(i), { open: !L(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", z0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", G0, [
            e.bad ? (u(), W(Ct, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(j, { key: 1 }, [
              Y(v(r.value), 1)
            ], 64)) : (u(), W(re, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", V0, v(e.title), 1),
          T(Vt, { open: s.value }, null, 8, ["open"])
        ], 8, U0),
        e.action ? (u(), W(Ui, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : b("", !0),
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
        ])) : b("", !0)
      ]),
      m("div", K0, [
        m("div", Y0, [
          (u(!0), f(j, null, ne(c.value, (p, y) => (u(), f("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, X0 = /* @__PURE__ */ U(Q0, [["__scopeId", "data-v-f2b4930d"]]), J0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Z0 = { class: "md inline" }, eb = ["disabled", "title", "onClick"], tb = {
  key: 1,
  class: "message-links-many"
}, nb = ["aria-expanded"], ab = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, sb = ["disabled", "onClick"], ob = { class: "row-pill message-links-chip" }, lb = { class: "message-links-title" }, ib = { key: 0 }, Na = 3, rb = "task", ub = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(() => n.total || n.links.length), o = E(() => n.links.every((p) => p.endpoint.model === rb) ? "tasks" : "items"), l = A(!1), i = A(null);
    Kl(i, () => l.value = !1);
    const r = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, d = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, Ne(p.endpoint.open_ref));
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
      e.links.length ? (u(), f("span", J0, [
        m("span", Z0, [
          y[1] || (y[1] = Y("Linked: ", -1)),
          (u(!0), f(j, null, ne(e.links, (k) => (u(), f("button", {
            key: `${k.endpoint.model}:${k.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(k),
            title: k.endpoint.title,
            onClick: (B) => h(k)
          }, [
            Y(v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
            d(k) ? (u(), f(j, { key: 0 }, [
              Y(" (" + v(d(k)) + ")", 1)
            ], 64)) : b("", !0),
            c(k) ? (u(), f(j, { key: 1 }, [
              Y(" (unavailable)")
            ], 64)) : b("", !0)
          ], 8, eb))), 128))
        ])
      ])) : b("", !0),
      s.value >= Na ? (u(), f("span", tb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          Y(v(s.value) + " linked " + v(o.value) + " ", 1),
          T(Vt, { open: l.value }, null, 8, ["open"])
        ], 8, nb)
      ])) : b("", !0),
      l.value ? (u(), f("div", ab, [
        (u(!0), f(j, null, ne(e.links, (k) => (u(), f("button", {
          key: `${k.endpoint.model}:${k.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(k),
          onClick: (B) => h(k)
        }, [
          m("span", ob, v(k.endpoint.model.replaceAll("_", " ")) + " " + v(k.endpoint.id), 1),
          m("span", lb, v(k.endpoint.title), 1),
          m("span", null, v(d(k)), 1),
          c(k) ? (u(), f("span", ib, "Unavailable")) : b("", !0)
        ], 8, sb))), 128))
      ])) : b("", !0),
      T(vn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (k) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, cb = /* @__PURE__ */ U(ub, [["__scopeId", "data-v-e9bc783c"]]), db = ["title", "aria-label"], fb = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, hb = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, mb = {
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
      (u(), f("svg", fb, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", hb)) : b("", !0)
      ]))
    ], 10, db));
  }
}, pb = /* @__PURE__ */ U(mb, [["__scopeId", "data-v-6dc92808"]]), gb = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, vb = (e) => e.worker_id != null ? "report" : "message", yb = (e) => gb[vb(e)], bb = "img,pre,table";
function kb(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function wb(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function $b(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(bb)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = kb(wb(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function xb(e, t) {
  let n = null;
  const a = () => e.value && $b(e.value);
  xe(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const Sb = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Mb(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Ln = /* @__PURE__ */ new WeakMap(), Be = "work", Xe = "sent", _b = 50, Ko = 50, Yo = () => ({ rows: A([]), total: A(0), next: A(null), loading: A(!1), failure: A(""), version: 0 });
function Cb(e) {
  var B;
  if (Ln.has(e)) return Ln.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (x) => {
    var $;
    return (($ = e.visible) == null ? void 0 : $.value) !== !1 && [...x.views].some((C) => C.visible);
  };
  function o(x, $) {
    const C = x[$], N = ++C.version;
    return C.loading.value = !0, C.failure.value = "", N;
  }
  function l(x, $, C, N, q) {
    const _ = x[$];
    if (t.get(x.id) !== x || _.version !== C) return;
    if (_.loading.value = !1, !q.ok) {
      _.failure.value = q.error;
      return;
    }
    const z = $ === Be ? q.value.counterparts ?? [] : q.value.rows ?? [], H = N === 1 ? z : [..._.rows.value, ...z], P = $ === Be ? (S) => `${S.endpoint.model}:${S.endpoint.id}` : (S) => S.id ?? S.target_id;
    _.rows.value = [...new Map(H.map((S) => [P(S), S])).values()], _.total.value = q.value.total ?? _.rows.value.length, _.next.value = q.value.next_page ?? null;
  }
  function i(x, $, C, N) {
    const q = x[$];
    q.version === C && (q.failure.value = N.message, q.loading.value = !1);
  }
  async function r(x, $, C) {
    const N = o(x, $), q = $ === Be ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(x, $, N, C, await e.read(`link list --source message:${x.id} ${q} --page ${C} --page-size ${$ === Be ? 10 : 25}`));
    } catch (_) {
      i(x, $, N, _);
    }
  }
  async function c(x) {
    const $ = x.map((C) => ({ [Be]: o(C, Be), [Xe]: o(C, Xe) }));
    try {
      const C = await e.read(`link receipts --messages ${x.map((N) => N.id).join(",")}`);
      x.forEach((N, q) => {
        const _ = C.ok ? C.value.messages[String(N.id)] : null;
        l(N, Be, $[q][Be], 1, C.ok ? { ok: !0, value: _.named } : C), l(N, Xe, $[q][Xe], 1, C.ok ? { ok: !0, value: _.sent } : C);
      });
    } catch (C) {
      x.forEach((N, q) => [Be, Xe].forEach((_) => i(N, _, $[q][_], C)));
    }
  }
  function d() {
    a = null;
    const x = [...n].map(($) => t.get($)).filter(($) => $ && s($));
    n.clear(), x.forEach(($) => $.dirty.clear());
    for (let $ = 0; $ < x.length; $ += Ko) c(x.slice($, $ + Ko));
  }
  function h(x, $ = [Be, Xe]) {
    for (const C of $) x.dirty.add(C);
    s(x) && (n.add(x.id), a ?? (a = setTimeout(d, 0)));
  }
  function p(x) {
    const $ = x.sources ?? (x.source_model && Number.isInteger(x.source_id) ? [{ model: x.source_model, id: x.source_id }] : []), C = x.link_types ?? (x.link_type ? [x.link_type] : []), N = C.length ? [Be, Xe].filter((_) => _ === Be ? C.some((z) => ["about", "edited"].includes(z)) : C.includes("sent_to")) : [Be, Xe];
    if (!N.length) return;
    const q = $.length ? [...new Set($.filter((_) => _.model === "message").map((_) => _.id))].map((_) => t.get(_)).filter(Boolean) : [...t.values()].filter(s).slice(0, _b);
    for (const _ of q) h(_, N);
  }
  const y = (B = e.follow) == null ? void 0 : B.call(e, ["link.*"], p), k = {
    attach(x, $) {
      let C = t.get(x);
      return C || (C = { id: x, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Be, Xe]), work: Yo(), sent: Yo() }, t.set(x, C)), C.views.add($), C.dirty.size && h(C, [...C.dirty]), C;
    },
    shown(x) {
      x.dirty.size && h(x, [...x.dirty]);
    },
    detach(x, $) {
      x.views.delete($), x.views.size || t.delete(x.id), t.size || (clearTimeout(a), y == null || y(), Ln.delete(e));
    },
    more(x, $) {
      const C = x == null ? void 0 : x[$];
      if (C != null && C.next.value && !C.loading.value) return r(x, $, C.next.value);
    }
  };
  return Ln.set(e, k), k;
}
function Eb(e, t, n) {
  const a = Je(null);
  let s = null;
  const o = me(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Cb(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((k) => k.isIntersecting), c.visible && s.shown(d);
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
    loadSent: () => s == null ? void 0 : s.more(a.value, Xe)
  };
}
const Ab = ["data-incoming", "data-ref"], Ob = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Tb = { class: "message-body" }, Ib = ["title"], Bb = ["innerHTML"], Rb = ["title"], Lb = ["innerHTML"], Nb = {
  class: "message-faces",
  "data-message-faces": ""
}, qb = ["title", "data-face", "onClick"], Db = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Pb = ["title", "data-reaction", "onClick"], jb = {
  key: 0,
  class: "message-reaction-count"
}, Fb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Wb = ["href", "title"], Hb = ["src", "alt"], zb = ["href"], Ub = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Gb = ["disabled", "data-sent-worker", "title", "onClick"], Vb = { class: "message-foot" }, Kb = { class: "message-time" }, Yb = {
  class: "message-id",
  "data-message-id": ""
}, Qb = 1500, Xb = "An earlier message", Jb = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = A(null), l = E(() => ["user", "comment"].includes(n.message.type)), i = E(() => {
      const [oe, ee] = (n.message.commented_row || ":").split(":"), te = pt(oe);
      return te ? { ref: `${te}:${ee}`, label: `${Gt(te).title.toLowerCase()} ${ee}` } : null;
    }), r = E(() => n.message.worker_id ?? null), c = E(() => yb(n.message)), d = E(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var oe;
      await ((oe = navigator.clipboard) == null ? void 0 : oe.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Qb);
    }
    const p = $i(), y = E(() => p(n.message.text ?? "")), k = E(() => JSON.parse(n.message.flowchart_edges || "[]")), B = A(!1), x = E(() => p(n.quote || Xb));
    function $() {
      const oe = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      oe ? oe.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    xb(o, () => `${n.message.text} ${n.quote}`);
    const C = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, N = (oe) => `/api/files/message/${n.message.id}/${encodeURIComponent(oe)}`, q = E(() => JSON.parse(n.message.captions || "{}")), _ = E(() => (n.message.files ?? []).map((oe) => ({ name: oe, address: N(oe), isImage: C.test(oe), title: q.value[oe] || oe }))), z = E(() => Ti(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), H = _e(qe, null), { links: P, total: S, more: O, loading: w, failure: g, sentTo: M, sentMore: I, sentLoading: R, sentFailure: D, loadMore: Z, loadSent: ae } = Eb(H, () => l.value && !n.message.local ? n.message.id : null, o), le = A(!1), ge = E(() => Mb(n.message.reactions));
    function Ae(oe) {
      le.value = !1, a("react", n.message, oe);
    }
    return (oe, ee) => e.message.peer || e.message.recipient ? (u(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      T(X0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (te) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Ab)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Tb, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: V(["message-card", "md", { comment: i.value }]),
          onClick: ee[5] || (ee[5] = (...te) => L(Nt) && L(Nt)(...te))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = $e((te) => L(Ne)(i.value.ref), ["stop"]))
          }, [
            T(re, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Ib)) : b("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e($, ["stop"]),
            innerHTML: x.value
          }, null, 8, Bb)) : b("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: ee[2] || (ee[2] = $e((te) => L(Ne)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + v(r.value), 9, Rb)) : b("", !0),
          T(gi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: F(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Lb)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          k.value.length ? (u(), f(j, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[3] || (ee[3] = (te) => B.value = !0)
            }, "Open the flowchart"),
            B.value ? (u(), W(R0, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: ee[4] || (ee[4] = (te) => B.value = !1)
            }, null, 8, ["title", "edges"])) : b("", !0)
          ], 64)) : b("", !0)
        ], 2),
        m("div", {
          class: V(["message-tools", { picking: le.value }]),
          "data-message-tools": ""
        }, [
          le.value ? (u(), f(j, { key: 0 }, [
            m("div", Nb, [
              (u(!0), f(j, null, ne(L(Sb), (te) => (u(), f("button", {
                key: te,
                type: "button",
                class: "message-face",
                title: `React ${te}`,
                "data-face": te,
                onClick: (De) => Ae(te)
              }, v(te), 9, qb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[6] || (ee[6] = (te) => le.value = !1)
            }, [
              T(re, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), f(j, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ee[7] || (ee[7] = (te) => le.value = !0)
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
            }, v(s.value ? "Copied" : "Copy"), 1),
            d.value ? (u(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ee[9] || (ee[9] = (te) => a("delete", e.message))
            }, "Delete")) : b("", !0)
          ], 64))
        ], 2)
      ]),
      ge.value.length ? (u(), f("div", Db, [
        (u(!0), f(j, null, ne(ge.value, (te) => (u(), f("button", {
          key: te.emoji,
          type: "button",
          class: V(["message-reaction", { mine: te.mine }]),
          title: te.title,
          "data-reaction": te.emoji,
          onClick: (De) => a("react", e.message, te.emoji)
        }, [
          Y(v(te.emoji) + " ", 1),
          te.count > 1 ? (u(), f("span", jb, v(te.count), 1)) : b("", !0)
        ], 10, Pb))), 128))
      ])) : b("", !0),
      _.value.length ? (u(), f("div", Fb, [
        (u(!0), f(j, null, ne(_.value, (te) => (u(), f(j, {
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
            }, null, 8, Hb)
          ], 8, Wb)) : (u(), f("a", {
            key: 1,
            href: te.address,
            target: "_blank",
            class: "message-file"
          }, v(te.name), 9, zb))
        ], 64))), 128))
      ])) : b("", !0),
      L(M).length ? (u(), f("div", Ub, [
        T(re, {
          name: "send",
          size: 12
        }),
        (u(!0), f(j, null, ne(L(M), (te) => (u(), f("button", {
          key: te.id,
          type: "button",
          class: "message-sent-worker",
          disabled: te.unavailable || !te.open_ref,
          "data-sent-worker": te.id,
          title: `Open worker ${te.id}`,
          onClick: $e((De) => te.open_ref && L(Ne)(te.open_ref), ["stop"])
        }, [
          Y("Also sent to worker " + v(te.id), 1),
          te.unavailable ? (u(), f(j, { key: 0 }, [
            Y(" (unavailable)")
          ], 64)) : b("", !0)
        ], 8, Gb))), 128))
      ])) : b("", !0),
      T(vn, {
        more: L(I),
        loading: L(R),
        failure: L(D),
        label: "More recipients",
        onMore: L(ae)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Vb, [
        m("time", Kb, v(z.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(j, { key: 0 }, [
          ee[10] || (ee[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Yb, "message " + v(e.message.id), 1)
        ], 64)) : b("", !0),
        l.value ? (u(), W(pb, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : b("", !0)
      ]),
      L(P).length || L(g) ? (u(), W(cb, {
        key: 3,
        links: L(P),
        total: L(S),
        more: L(O),
        loading: L(w),
        failure: L(g),
        onMore: L(Z)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : b("", !0)
    ], 8, Ob));
  }
}, FS = /* @__PURE__ */ U(Jb, [["__scopeId", "data-v-0293091f"]]), na = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], qa = 200, Yi = (e) => {
  var t;
  return ((t = na.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? na[0].key;
}, WS = (e) => {
  var t;
  return ((t = na.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Zb = ["aria-label"], ek = 300, Qo = 400, tk = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: qa } },
  setup(e) {
    const t = e, n = E(() => Yi(t.value)), a = E(() => n.value < qa ? [1, 0.25, 0.25] : n.value === qa ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: V(["ico", "prio", { hot: n.value >= Qo, high: n.value >= ek && n.value < Qo }]),
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
    ], 10, Zb));
  }
}, HS = /* @__PURE__ */ U(tk, [["__scopeId", "data-v-b10e610f"]]), Qi = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], zS = (e) => {
  const t = Qi[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, nk = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Xo = (e) => nk[e.card.state] || "idle", ak = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Jo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Zo = (e, t) => Jo[Xo(e)] - Jo[Xo(t)], el = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, US = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Zo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || ak(a, s)) : [...e].sort((a, s) => Zo(a, s) || (el[t] || el.state)(a, s)), sk = { class: "list-row" }, ok = {
  key: 0,
  class: "list-row-type"
}, lk = { class: "list-row-main" }, ik = {
  key: 0,
  class: "list-row-title"
}, rk = { class: "list-row-body" }, uk = {
  key: 1,
  class: "list-row-end"
}, ck = {
  key: 1,
  class: "list-row-text"
}, dk = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", sk, [
      e.type ? (u(), f("span", ok, v(e.type), 1)) : b("", !0),
      m("div", lk, [
        e.title ? (u(), f("span", ik, v(e.title), 1)) : b("", !0),
        m("div", rk, [
          fe(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", uk, [
          fe(t.$slots, "end", {}, void 0, !0)
        ])) : b("", !0)
      ]),
      e.text ? (u(), f("span", ck, v(e.text), 1)) : b("", !0)
    ]));
  }
}, GS = /* @__PURE__ */ U(dk, [["__scopeId", "data-v-dfc8c3a7"]]), VS = {
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
    return (l, i) => (u(), W(Li, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, fk = {
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
}, Xi = /* @__PURE__ */ U(fk, [["__scopeId", "data-v-978e0921"]]), hk = ["aria-label"], mk = { class: "head" }, pk = { class: "names" }, gk = { class: "body" }, vk = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = oi(a, n), i = li(s);
    return (r, c) => (u(), W(da, { to: "body" }, [
      T(zt, {
        name: "side",
        appear: "",
        onAfterLeave: L(l)
      }, {
        default: F(() => [
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
              e.title ? (u(), f(j, { key: 0 }, [
                m("header", mk, [
                  m("div", pk, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (u(), W(st, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : b("", !0)
                  ]),
                  fe(r.$slots, "actions", {}, void 0, !0),
                  T(ma, {
                    title: e.closeLabel,
                    onClick: L(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), W(Xi, { key: 0 }, {
                  default: F(() => [
                    fe(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : b("", !0),
                m("div", gk, [
                  fe(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : fe(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, hk)
          ], 6)) : b("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, KS = /* @__PURE__ */ U(vk, [["__scopeId", "data-v-f276f055"]]), yk = {
  key: 1,
  class: "text-field-label"
}, bk = {
  key: 2,
  class: "text-field-end"
}, kk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Pt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = on(e, "modelValue"), a = ca(), s = "onUpdate:modelValue" in (((d = Zr()) == null ? void 0 : d.vnode.props) || {}), o = E(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = E(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = E(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = A(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: V(["text-field", { large: e.large, ended: h.$slots.end }, L(a).class]),
      style: ve(L(a).style)
    }, [
      e.icon ? (u(), W(re, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : b("", !0),
      e.label ? (u(), f("span", yk, v(e.label), 1)) : b("", !0),
      Ze(m("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [L(cs), o.value]
      ]),
      h.$slots.end ? (u(), f("span", bk, [
        fe(h.$slots, "end", {}, void 0, !0)
      ])) : b("", !0)
    ], 6)) : Ze((u(), f("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, r.value, { onInput: l }), null, 16)), [
      [L(cs), o.value]
    ]);
  }
}), YS = /* @__PURE__ */ U(kk, [["__scopeId", "data-v-d9c38ca8"]]), wk = { class: "title" }, $k = { class: "state" }, xk = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ss(t.line, t.events);
    return (o, l) => (u(), W(e0, {
      rows: L(n),
      failure: L(a),
      loaded: L(s),
      empty: e.empty
    }, {
      default: F(({ row: i }) => [
        m("span", wk, v(i.title), 1),
        m("span", $k, v(L(rn)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, QS = /* @__PURE__ */ U(xk, [["__scopeId", "data-v-9191a6f0"]]);
function Sk(e = 1e3, t = null) {
  const n = A(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Ie(() => clearInterval(a)), n;
}
const Da = A(Date.now() / 1e3);
let tl = 0, Nn = 0;
function Qs() {
  return Nn || (Da.value = Date.now() / 1e3, tl = setInterval(() => Da.value = Date.now() / 1e3, 1e3)), Nn += 1, Bl() && fa(() => {
    Nn -= 1, Nn || clearInterval(tl);
  }), Da;
}
const Mk = 200, _k = Gi + Hn + Vi + Mk;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Ck(e, t, n) {
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
function Ek(e, t, n, a) {
  me(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(Ck(o, l, n.value)), performance.now() - l < _k) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const Ak = ["title", "data-figure-mark", "data-folded", "data-open"], Ok = {
  key: 2,
  class: "worker"
}, Tk = { class: "head" }, Ik = { key: 0 }, Bk = {
  key: 3,
  class: "status"
}, Rk = {
  key: 0,
  class: "figure"
}, Lk = {
  key: 1,
  class: "ran-for"
}, Nk = { key: 2 }, qk = {
  key: 3,
  class: "news"
}, Dk = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Pk = {
  key: 6,
  class: "settled"
}, jk = {
  key: 1,
  class: "bar"
}, Fk = {
  key: 3,
  class: "detail body"
}, Wk = {
  key: 0,
  class: "body-label"
}, Hk = ["title"], zk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ca(), a = ["onClick", "onAct"], s = E(() => Object.fromEntries(Object.entries(n).filter(([le]) => !a.includes(le)))), o = A(!1), l = E(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = E(() => t.open !== void 0), r = E(() => i.value || l.value), c = E(() => i.value ? t.open : o.value), d = E(() => i.value ? !t.open : l.value && !o.value), h = E(() => !!(t.mark.action && n.onAct)), p = E(() => r.value || h.value || !!n.onClick), y = A(null), k = A(null), { folded: B, phase: x } = Ki(y, () => d.value);
    Ek(y, d, x, _e(qe, null));
    function $(le) {
      var ge, Ae;
      if (!(le.target !== y.value && !k.value.contains(le.target))) {
        if (i.value) return (ge = n.onClick) == null ? void 0 : ge.call(n, le);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(le);
      }
    }
    const C = (le) => n.onAct(le), N = ["failed", "unfinished"], q = E(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? N.includes(t.mark.state) ? "danger" : "good" : ""), _ = E(() => t.mark.color ? t.mark.color : q.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : q.value ? `var(--tone-${q.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), z = E(() => _.value || "var(--tone-work)"), H = E(() => !t.mark.ending && !t.mark.ended && q.value !== "stopped"), P = Qs(), S = E(
      () => t.mark.began_at && H.value && !t.mark.figure && !t.mark.counting ? Ii(P.value - t.mark.began_at) : ""
    ), O = E(() => {
      const { started: le, ended: ge } = t.mark;
      return le ? ge ? `ran ${Wo(ge - le, !0)}` : Wo(P.value - le, !0) : S.value;
    }), w = ["bad", "danger", "warn"], g = E(() => w.includes(q.value) || t.mark.asks ? "attention" : H.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], I = E(() => M.includes(q.value)), R = E(() => g.value === "process" ? "running" : I.value ? "cross" : q.value === "stopped" ? "stopped" : q.value === "good" ? "tick" : ""), D = E(
      () => !!(t.mark.figure || O.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), Z = E(() => [t.mark.title, t.mark.time ? Ti(t.mark.time) : ""].filter(Boolean).join(" · ")), ae = E(() => ({
      ..._.value ? { "--mark": _.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ge) => (u(), f("div", Pe(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        L(x),
        {
          open: c.value,
          folding: i.value && d.value,
          live: p.value,
          failed: I.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: _.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ae.value,
      title: Z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": L(B) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: $
    }), [
      (u(), W(rt(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: k,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": r.value ? String(!!c.value) : void 0
      }, {
        default: F(() => [
          e.mark.markIcon ? (u(), W(Ct, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), W(re, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", Ok, v(e.mark.worker), 1)) : b("", !0),
          m("span", Tk, [
            T(st, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", Ik, v(e.mark.name), 1)) : b("", !0),
            r.value ? (u(), W(Vt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : b("", !0)
          ]),
          D.value ? (u(), f("span", Bk, [
            e.mark.figure ? (u(), f("span", Rk, v(e.mark.figure), 1)) : b("", !0),
            O.value ? (u(), f("span", Lk, v(O.value), 1)) : b("", !0),
            e.mark.stopping ? (u(), f("span", Nk, "Stopping")) : b("", !0),
            e.mark.news ? (u(), f("span", qk, v(e.mark.news), 1)) : b("", !0),
            R.value === "running" ? (u(), f("span", Dk)) : R.value ? (u(), W(Ct, {
              key: 5,
              class: V(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : b("", !0),
            e.mark.settled ? (u(), f("span", Pk, v(e.mark.settled), 1)) : b("", !0)
          ])) : b("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), W(Ui, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: $e(C, ["stop"])
      }, null, 8, ["label", "open"])) : b("", !0),
      (e.mark.figure || e.mark.counting) && H.value ? (u(), f("span", jk, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: z.value })
        }, null, 4)
      ])) : b("", !0),
      e.mark.detail && !L(B) ? (u(), W(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      e.mark.body && !L(B) ? (u(), f("div", Fk, [
        e.mark.bodyLabel ? (u(), f("p", Wk, v(e.mark.bodyLabel), 1)) : b("", !0),
        T(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : b("", !0),
      e.mark.command && !L(B) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Hk)) : b("", !0),
      e.mark.card ? (u(), W(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : b("", !0),
      fe(le.$slots, "default", {
        shown: !L(B)
      }, void 0, !0)
    ], 16, Ak));
  }
}), Ji = /* @__PURE__ */ U(zk, [["__scopeId", "data-v-2aa9c496"]]), Uk = 8, Gk = 40, Vk = [];
class Xs {
  constructor(t, n, { top: a = Uk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Vk.push(this);
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
    n > Gk && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Kk = 60, Yk = 300, Zi = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function er(e, t) {
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
  const c = new Xs("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Yk, more: () => a.value > 0, previous: r }, { top: Kk });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Qk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function tr(e) {
  var n;
  const t = Qk[e] || ((n = Gt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Xk = (e) => tr(String(e).split(":")[0]), Jk = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Zk = { passed: "good", failed: "danger", warned: "warn", running: "" }, ew = { good: "good", warn: "warn", danger: "danger" }, nl = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Rf(e.target_model, e.target_id || 0)
}, tw = { "open row": (e) => Xk(e.target_model), "open page": () => tr("pages") };
function nw(e, t) {
  const n = t || {}, a = nl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Zk[e.outcome] || "" : ew[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? tw[a](e) : "",
    handlers: a ? { onAct: () => nl[a](e) } : {}
  };
}
const aw = 24, sw = 1e3, al = 2e3, ow = 0.25, lw = 5e3;
function iw(e, t = aw, n = () => !0) {
  const a = A(!1), s = A(0), o = A(!1);
  let l = 0, i = 0, r = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const q = c();
    return q ? q.scrollHeight - q.scrollTop - q.clientHeight : 0;
  }, h = () => !c() || d() <= t;
  function p(q) {
    if (clearTimeout(l), !q) {
      o.value = !1, r = Date.now();
      return;
    }
    const _ = Date.now() - r < al ? al : sw;
    l = setTimeout(() => o.value = a.value, _);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function k(q = !1) {
    const _ = c();
    _ && q && _.scrollTo ? _.scrollTo({ top: _.scrollHeight, behavior: "smooth" }) : _ && (_.scrollTop = _.scrollHeight), y();
  }
  function B() {
    $(), !a.value && (a.value = !0, p(!0));
  }
  const x = () => !!c() && d() <= c().clientHeight * ow;
  function $() {
    clearTimeout(i), x() && (i = setTimeout(() => a.value && x() && n() && k(!0), lw));
  }
  function C() {
    h() ? y() : B();
  }
  function N(q = 1, _ = !1) {
    a.value ? s.value += Math.max(0, q) : k(_);
  }
  return Bl() && fa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: y, toBottom: k, left: B, scrolled: C, arrived: N };
}
const rw = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, uw = (e) => String(e ?? "").replace(rw, ""), cw = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), { away: o, scrolled: l, arrived: i, toBottom: r } = iw(s);
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
      Y(v(L(uw)(e.lines.join(`
`)) || e.empty), 1),
      L(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => L(r)(!0))
      }, "Follow")) : b("", !0)
    ], 544));
  }
}, dw = /* @__PURE__ */ U(cw, [["__scopeId", "data-v-5a8693fe"]]), fw = "*.*", hw = {
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
    const t = e, n = _e(qe, null), a = new Ul();
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
      events: l.value ? [fw] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), W(Wi, {
      key: 0,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), W(Fi, {
      key: 1,
      entry: i.value,
      subscriptions: L(a),
      environment: L(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, mw = { class: "mark-more-inner" }, pw = {
  class: "mark-lines",
  "data-mark-reason": ""
}, gw = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, vw = {
  key: 3,
  class: "mark-lines"
}, yw = "process", sl = "task", bw = {
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
    const t = e, n = Ye(), a = E(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = E(() => Jk.has(t.mark.variant) && t.mark.detail || ""), o = E(() => t.mark.target_model === sl ? t.mark.target_id : 0), l = er(
      Zi(n),
      () => t.mark.target_id
    ), i = l.lines, r = A(!1), c = A(""), d = E(() => !t.declaration.body_url && t.mark.target_model === yw && !!t.mark.target_id);
    async function h(y = l.follow) {
      const k = await y();
      r.value = !0, c.value = k.ok ? "" : k.error;
    }
    const p = E(() => t.shown && d.value);
    return me(p, (y) => y && h()), Is(() => p.value && h(), () => p.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (y) => y && p.value && h(l.newest)
    ), (y, k) => (u(), f("div", {
      class: V(["mark-more", { open: e.shown }]),
      onClick: k[1] || (k[1] = $e(() => {
      }, ["stop"]))
    }, [
      m("div", mw, [
        e.declaration.body_url ? (u(), W(hw, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (u(), f(j, { key: 1 }, [
          s.value ? (u(), f(j, { key: 0 }, [
            k[2] || (k[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", pw, v(s.value), 1)
          ], 64)) : b("", !0),
          d.value && c.value ? (u(), f("p", gw, v(c.value), 1)) : d.value && r.value ? (u(), f(j, { key: 2 }, [
            k[3] || (k[3] = m("p", { class: "mark-label" }, "Output", -1)),
            T(dw, {
              class: "mark-terminal",
              lines: L(i),
              feed: L(l).feed,
              onOlder: L(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", vw, v(a.value.join(`
`)), 1)) : b("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: k[0] || (k[0] = $e((B) => L(Ne)(`${sl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : b("", !0)
        ], 64))
      ])
    ], 2));
  }
}, bs = /* @__PURE__ */ U(bw, [["__scopeId", "data-v-df71b15a"]]), kw = ["title", "aria-label", "onClick"], ww = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, $w = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = E(() => of(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = A(""), s = _e(qe);
    async function o(l) {
      const i = await yn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (u(), f(j, null, [
      (u(!0), f(j, null, ne(n.value, (r) => (u(), f("button", {
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
      ], 8, kw))), 128)),
      a.value ? (u(), f("span", ww, v(a.value), 1)) : b("", !0)
    ], 64));
  }
}, xw = /* @__PURE__ */ U($w, [["__scopeId", "data-v-7a62c88e"]]);
function nr(e, t) {
  const n = Je(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const ar = nr("/api/marks", "marks"), XS = ar.fetchAll, Sw = ar.find, Mw = ["data-ref"], _w = ["data-ref"], Cw = { class: "mark-row" }, Ew = "dock add", Aw = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = E(() => Sw(a.mark.type)), o = E(() => nw(a.mark, s.value)), l = E(() => {
      var h;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (h = s.value) != null && h.body_url);
    }), i = E(() => l.value || !!o.value.handlers.onAct), r = A(!1);
    function c() {
      r.value = !r.value;
    }
    const d = E(() => {
      var h;
      return (((h = s.value) == null ? void 0 : h.buttons) || []).filter((p) => {
        var y;
        return !a.docked || !((y = p.runs) != null && y.startsWith(Ew));
      }).map((p) => ({ ...p, module: s.value.module }));
    });
    return (h, p) => {
      var y, k;
      return (y = s.value) != null && y.card ? (u(), f("div", {
        key: 0,
        class: V(["thread-turn", "card", "whole-card", { "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        T(bs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Mw)) : (u(), f("div", {
        key: 1,
        class: V(["thread-turn", "card", { "full-width": (k = s.value) == null ? void 0 : k.full_width, docked: e.docked, "user-side": L(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", Cw, [
          T(Ji, {
            mark: o.value,
            open: i.value ? r.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: c
          }, eu({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: F(({ shown: B }) => [
                T(bs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: B
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          T(xw, {
            buttons: d.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, _w));
    };
  }
}, Ow = /* @__PURE__ */ U(Aw, [["__scopeId", "data-v-f1243ccb"]]), Tw = ["data-ref"], Iw = ["inert"], Bw = { class: "group-fold" }, Rw = { class: "thread-group" }, Lw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = A(!1), a = A(!1), s = A(!1), o = A(null);
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
      T(Ji, {
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
        m("div", Bw, [
          m("div", Rw, [
            (u(!0), f(j, null, ne(e.group.marks, (c) => (u(), W(Ow, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Iw)) : b("", !0)
    ], 8, Tw));
  }
}, JS = /* @__PURE__ */ U(Lw, [["__scopeId", "data-v-45b58b9b"]]);
function Nw(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return xe(() => n.observe(e.value)), tt(() => n.disconnect()), t;
}
const qw = { class: "chat-dock-fold" }, Dw = ["aria-label"], Pw = { class: "chat-dock-head" }, jw = { class: "chat-dock-inner" }, Fw = { class: "chat-dock-foot" }, sr = 700, Ww = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = A(null), a = A(null), s = Nw(a), o = A(!1);
    let l = 0;
    return xe(() => l = setTimeout(() => o.value = !0, sr)), tt(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: V(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", qw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: V(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          fe(i.$slots, "edge", {}, void 0, !0),
          m("header", Pw, [
            fe(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: V(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", jw, [
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
          m("footer", Fw, [
            fe(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Dw)
      ])
    ], 2));
  }
}, Hw = /* @__PURE__ */ U(Ww, [["__scopeId", "data-v-574cba3d"]]), zw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Pa = 5, Uw = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Pa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Pa}s`, animationDelay: `${(n - Pa).toFixed(2)}s` };
    return (s, o) => (u(), f("span", zw, [
      m("i", { style: a })
    ]));
  }
}, Gw = /* @__PURE__ */ U(Uw, [["__scopeId", "data-v-2a7bc150"]]), Vw = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), ks = (e) => e.charAt(0).toUpperCase() + e.slice(1), Kw = (e) => ks(e.replace(/_at$/, "").replaceAll("_", " ")), Yw = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Qw = (e, t, n) => [ks(`${e} ${n}`), (t == null ? void 0 : t.state) && ks(t.state)].filter(Boolean).join(" · "), or = (e) => e.given_name || `${Qn(e.role)} ${e.id}`, Xw = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? or(t) : (e == null ? void 0 : e.name) ?? "", Jw = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? or(t) : "", Zw = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Vw.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: Kw(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], e2 = { reviewing: "Under review" }, t2 = (e, t) => e || e2[t == null ? void 0 : t.state] || "", lr = nr("/api/docks", "docks"), ZS = lr.fetchAll, Rt = lr.find, n2 = 6, ja = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Js = (e) => Date.parse(e.leaves_at) / 1e3, Xt = (e) => !!(e.leaves_at && !e.kept), a2 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!Xt(e) || t < Js(e) || n.has(e.id)), s2 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => a2(a, t, n)).sort((a, s) => a.id - s.id);
function o2(e, t, n = n2) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Js(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const l2 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ws = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), i2 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), r2 = (e) => ({ ...e.kept ? ws("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : ws("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), u2 = ["keep", "unkeep", "open", "undock"], c2 = (e) => ({ ...e, iconOnly: u2.includes(e.action) });
function d2(e, t) {
  var n;
  return [
    ...i2(e, t) ? [r2(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Gt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    ws("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(c2);
}
function ir(e, t) {
  const n = d2(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: l2(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const f2 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || ir(e, t).title, h2 = { class: "dock-text" }, m2 = ["title"], p2 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, g2 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, v2 = {
  key: 1,
  "data-dock-row": ""
}, y2 = { class: "dock-acts" }, b2 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = E(() => Rt(a.item.type)), o = Qs(), l = E(() => Vs(a.item.created_at, o.value * 1e3)), i = A(null), r = A(null), c = A(null), d = A(null), h = E(() => ir(a.item, s.value)), p = Ye(), y = E(() => `dock.${a.item.id}`), k = E(() => p.props[y.value].data.value), B = E(() => f2(a.item, s.value, k.value)), x = E(() => ea(a.item.target_model ?? "")), $ = E(() => {
      var w;
      return ((w = s.value) == null ? void 0 : w.word) ?? "";
    }), C = E(() => ({ ...k.value, id: a.item.target_id, noun: x.value })), N = () => {
      var w, g;
      return ((g = (w = s.value) == null ? void 0 : w.reads) == null ? void 0 : g.length) && p.reload(y.value);
    };
    $c(Il, { data: k, reload: N, readOutput: Zi(p) }), me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (w, g, M) => {
        var R;
        N();
        const I = (R = p.subscriptions) == null ? void 0 : R.follow(`dock ${a.item.id}`, [`${x.value.replaceAll("-", "_")}.*`], (D) => {
          (!D.row_id || D.row_id === a.item.target_id) && N();
        });
        M(() => I == null ? void 0 : I());
      },
      { immediate: !0 }
    );
    const q = A(/* @__PURE__ */ new Set()), _ = A("");
    async function z(w) {
      if (w.action === "undock") return n("undock", w);
      if (w.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      w.action === "declared" && (q.value = /* @__PURE__ */ new Set([...q.value, w.label])), _.value = "";
      const M = await yn(w, { id: a.item.target_id }, p.environment);
      (M == null ? void 0 : M.ok) === !1 && (q.value = new Set([...q.value].filter((I) => I !== w.label)), _.value = `Could not ${w.label.toLowerCase()}: ${M.error}`);
    }
    const H = E(() => h.value.actions.filter((w) => !q.value.has(w.label))), P = E(() => {
      var w;
      return t2((w = s.value) == null ? void 0 : w.badge, C.value);
    }), S = E(() => h.value.controls), O = E(() => {
      var w;
      return !!((w = s.value) != null && w.draws_head) && !a.collapsed;
    });
    return (w, g) => {
      var M, I, R, D;
      return u(), W(Hw, {
        label: h.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        type: (I = s.value) != null && I.needs_user ? "waiting" : "",
        folded: !!((R = s.value) != null && R.folds) && e.folded,
        body: !!((D = s.value) != null && D.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: g[3] || (g[3] = (Z) => e.collapsed && n("open"))
      }, {
        edge: F(() => [
          e.leaving && !e.item.kept ? (u(), W(Gw, {
            key: 0,
            "ends-at": L(Js)(e.item)
          }, null, 8, ["ends-at"])) : b("", !0)
        ]),
        head: F(() => {
          var Z;
          return [
            O.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(j, { key: 1 }, [
              T(re, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", h2, [
                m("span", {
                  class: V(["dock-title", { strip: e.collapsed }]),
                  title: B.value
                }, v(B.value), 11, m2)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Z = s.value) != null && Z.leaves_after_seconds ? b("", !0) : (u(), f(j, { key: 0 }, [
                Y(v(l.value), 1)
              ], 64))
            ], 512),
            S.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: g[0] || (g[0] = $e(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(j, null, ne(S.value, (ae) => {
                var le, ge;
                return u(), f(j, {
                  key: ae.action + ae.runs
                }, [
                  !q.value.has(ae.label) && (!((le = ae.variants) != null && le.length) || !((ge = C.value) != null && ge.state) || ae.variants.includes(C.value.state)) ? (u(), W(pe, {
                    key: 0,
                    variant: "icon",
                    class: V({ kept: ae.pressed }),
                    "aria-pressed": ae.pressed,
                    "aria-label": ae.label,
                    title: ae.label,
                    "data-dock-action": ae.action,
                    onClick: (Ae) => z(ae)
                  }, {
                    default: F(() => [
                      T(re, {
                        name: ae.icon,
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
        still: F(() => [
          _.value || e.refusal ? (u(), f("p", p2, v(_.value || e.refusal), 1)) : b("", !0)
        ]),
        foot: F(() => {
          var Z;
          return [
            m("span", g2, [
              P.value ? (u(), f("span", {
                key: 0,
                class: V(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(P.value), 3)) : b("", !0),
              $.value ? (u(), f("span", v2, v($.value) + " " + v(e.item.target_id), 1)) : b("", !0),
              m("span", {
                ref_key: "foot",
                ref: r,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (Z = s.value) != null && Z.folds ? (u(), W(pe, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: g[1] || (g[1] = (ae) => n("fold"))
            }, {
              default: F(() => [
                Y(v(s.value.folds) + " ", 1),
                T(Vt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : b("", !0),
            m("span", y2, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              T(Fs, {
                name: `dock.${e.item.type}`,
                row: C.value,
                environment: L(p).environment,
                "read-only": L(p).readOnly,
                "object-name": L(ea)(e.item.target_model),
                "external-failure": "",
                onFailure: g[2] || (g[2] = (ae) => _.value = ae),
                onDone: w.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(j, null, ne(H.value, (ae) => (u(), W(pe, {
                key: ae.action + ae.runs,
                small: "",
                variant: ae.primary ? "primary" : "ghost",
                bordered: !ae.primary,
                "data-dock-action": ae.action,
                onClick: (le) => z(ae)
              }, {
                default: F(() => [
                  Y(v(ae.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: F(() => {
          var Z;
          return [
            (Z = s.value) != null && Z.body_url ? (u(), W(bs, {
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
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : b("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, ol = /* @__PURE__ */ U(b2, [["__scopeId", "data-v-46615a02"]]), k2 = 24, w2 = 8, e6 = 420;
function t6({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= k2 ? !0 : e < t && s > w2 ? !1 : null;
}
const $2 = (e, t) => e === void 0 ? t : e, x2 = { me: 1, people: [] }, aa = Ht({
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
  people: x2,
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
hi("journal.activity", () => aa.activity);
hi("journal.side.mini", () => aa.sideMini);
const rr = "journal.viewer.";
function S2(e, t, n) {
  try {
    const a = n.getItem(rr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function M2(e, t, n) {
  try {
    n.setItem(rr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function ll(e, t, n = window.localStorage) {
  const a = A(S2(e, t, n));
  return me(a, (s) => M2(e, s, n), { deep: !0 }), a;
}
const _2 = {
  key: "dock-all",
  class: "dock-all"
}, C2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var w, g;
    const t = e, n = Sk(500), a = A(/* @__PURE__ */ new Set()), s = _e(qe), o = A(/* @__PURE__ */ new Set()), l = A({});
    async function i(M, I) {
      l.value = { ...l.value, [M.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, M.id]);
      const R = await yn(I, { id: M.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((D) => D !== M.id)), l.value = { ...l.value, [M.id]: `Could not dismiss this card: ${R.error}` });
    }
    const r = E(
      () => s2(
        t.items.filter((M) => !o.value.has(M.id)),
        n.value,
        a.value
      )
    ), c = E(
      () => o2(
        r.value.filter((M) => ja(M, Rt)),
        n.value
      )
    ), d = E(() => r.value.filter((M) => !c.value.includes(M) && !ja(M, Rt))), h = ll(`dock-size:${((w = aa.identity) == null ? void 0 : w.root) || location.host}`, null), p = (M) => {
      var I;
      return !!((I = Rt(M.type)) != null && I.needs_user);
    }, y = A(/* @__PURE__ */ new Set()), k = A(/* @__PURE__ */ new Set()), B = E(() => r.value.length === 1), x = (M) => p(M) || B.value, $ = (M) => x(M) ? y.value.has(M.id) || k.value.has(M.id) : h.value ? h.value.collapsed && !h.value.opened.includes(M.id) : t.collapsed, C = E(() => r.value.some($));
    me(() => t.collapsed, (M) => {
      k.value = new Set(M ? r.value.filter(p).map((I) => I.id) : []);
    });
    function N() {
      const M = !C.value;
      h.value = { collapsed: M, opened: [] }, y.value = new Set(M ? r.value.filter(p).map((I) => I.id) : []), k.value = /* @__PURE__ */ new Set();
    }
    function q(M) {
      var R;
      if (!$(M)) return;
      if (x(M)) {
        y.value = new Set([...y.value].filter((D) => D !== M.id)), k.value = new Set([...k.value].filter((D) => D !== M.id));
        return;
      }
      const I = (R = h.value) != null && R.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...I, M.id] };
    }
    const _ = ll(`dock-folded:${((g = aa.identity) == null ? void 0 : g.root) || location.host}`, {}), z = (M) => {
      var I;
      return !!((I = Rt(M.type)) != null && I.folds) && (t.insidesFolded || $2(_.value[M.id], ja(M, Rt) || t.folded));
    };
    function H(M) {
      z(M) && P(M), _.value = { ..._.value, [M.id]: !z(M) };
    }
    function P(M) {
      var I;
      !((I = h.value) != null && I.collapsed) || h.value.opened.includes(M.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, M.id] });
    }
    function S(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function O(M) {
      a.value = new Set([...a.value].filter((I) => I !== M.id));
    }
    return (M, I) => (u(), W(Os, {
      tag: "div",
      name: "dock",
      duration: L(sr),
      class: "dock-stack"
    }, {
      default: F(() => [
        r.value.length > 1 ? (u(), f("div", _2, [
          T(pe, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": C.value ? "Open all" : "Collapse all",
            onClick: N
          }, {
            default: F(() => [
              T(Vt, {
                open: !C.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : b("", !0),
        (u(!0), f(j, null, ne(d.value, (R) => (u(), W(ol, {
          key: R.id,
          item: R,
          class: V({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: $(R),
          refusal: l.value[R.id],
          onOpen: (D) => q(R),
          onFold: (D) => H(R),
          onUndock: (D) => i(R, D),
          onMouseenter: (D) => S(R),
          onMouseleave: (D) => O(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (u(!0), f(j, null, ne(c.value, (R) => (u(), W(ol, {
          key: R.id,
          item: R,
          class: V({ timed: L(Xt)(R) }),
          leaving: L(Xt)(R) && !a.value.has(R.id),
          folded: z(R),
          collapsed: $(R),
          refusal: l.value[R.id],
          onOpen: (D) => q(R),
          onFold: (D) => H(R),
          onUndock: (D) => i(R, D),
          onMouseenter: (D) => S(R),
          onMouseleave: (D) => O(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, n6 = /* @__PURE__ */ U(C2, [["__scopeId", "data-v-2c47a65e"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, zn = (e) => Math.min(Math.max(e, 0), 1), E2 = (e) => {
  const t = zn(e);
  return t * t * (3 - 2 * t);
}, bt = (e, t, n) => E2((e - t) / (n - t));
function a6(e) {
  const t = zn(e), n = zn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = bt(s, 0.26, 0.38) * (1 - bt(s, 0.76, 0.96)), l = bt(s, 0.38, 0.76), i = bt(t, 0, 0.12) * (1 - bt(t, 0.88, 1)), r = bt(s, 0.2, 0.34) * (1 - bt(s, 0.84, 1)), c = Math.sin(Math.PI * zn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function s6(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const il = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, o6 = (e) => il[e] ?? il.butler, Zs = 2400, A2 = 0.05;
function O2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, A2), l = Math.min(t + Zs * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function l6(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function T2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function i6(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const r6 = (e, t) => ({ ...e, stretch: t.stretch }), u6 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, ur = (e, t) => t >= (e.least ?? 0);
function c6(e, t, n) {
  if (!ur(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const d6 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), I2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", rl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), B2 = (e) => e.right > e.left && e.bottom > e.top;
function f6(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(I2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = rl(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = rl(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), B2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function cr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [d, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[h] || e[d] > o[p]) && (i = -1);
      else {
        const k = (o[h] - e[d]) / y, B = (o[p] - e[d]) / y;
        l = Math.max(l, Math.min(k, B)), i = Math.min(i, Math.max(k, B));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const r = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: r, y: c, on: "surface", surface: s.id, dx: r - s.left, dy: c - s.top };
  }
  return a;
}
const Ee = {
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
}, dn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), R2 = (e) => e * e * (3 - 2 * e), Oe = (e, [t, n]) => R2(dn(e, t, n)), L2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], mt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, qn = ([e, t], n) => e + n() * (t - e);
function N2(e) {
  return L2.map(() => {
    const t = qn(mt.speed, e), n = qn(mt.angle, e) * Math.PI / 180, a = qn(mt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [qn(mt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const q2 = N2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function D2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * mt.gravity * (t[2] - mt.floor))) / mt.gravity;
}
function h6(e, t, n = q2) {
  const a = Ee.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = D2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= mt.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const m6 = (e, t) => e && Ee[e.name] ? { name: e.name, u: t / e.frames } : null;
function p6(e, t) {
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
const g6 = () => Array.from({ length: Ee.pogo.count }, (e, t) => Ee.pogo.bounce * (t + 1) / Ee.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function v6(e, t, n) {
  const { away: a, side: s } = Ee.bug_smash, o = s * a * n, [l, i] = [t.left + Dt.margin * n, t.right - Dt.margin * n], r = Math.min(Math.max(e + o + s * Dt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function y6(e, t, n) {
  const a = Ee.bug_smash, s = Oe(t, a.walk), o = ([l, i]) => l + (i - l) * s;
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
function b6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = O2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Le = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function k6(e) {
  const t = Le.least + Math.floor(e() * (Le.most - Le.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Le.walls[Math.floor(e() * Le.walls.length)],
    along: Le.margin + e() * (1 - 2 * Le.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function $s(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Le.margin, l = ((e.along - Le.margin + e.way * Le.speed * n / a) / s % 2 + 2) % 2, i = Le.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Le.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Le.inset : t.right - Le.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function P2(e, t) {
  const n = Ee.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = T2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function w6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ee.bug_shot, { frame: l, bug: i, shot: r } = P2(n, e.length), c = e.map(($, C) => ({ ...$s($, t, Math.min(n / o.fps, Un(C).shot)), shot: C < r })), d = Oe(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map(($, C) => ({ bug: $, index: C, seconds: n / o.fps - Un(C).shot, spot: $s($, t, Un(C).shot) })).filter(($) => $.seconds >= 0), k = y.flatMap(($) => {
    const C = (s == null ? void 0 : s.get($.index)) ?? z2($.bug, t, $.spot, s ? [] : a);
    return s == null || s.set($.index, C), s && U2(C, $.seconds, a), G2(C, $.seconds, a);
  }), B = y.filter(($) => W2($.bug)).map(($) => ({ seconds: $.seconds, from: $.spot })), x = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: x }, slush: k, camera: B };
}
function Un(e) {
  const t = Ee.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function $6(e, t, n, a) {
  const { limit: s, margin: o } = Ee.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = Un(d), p = $s(c, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), k = p.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - p.x), B = Math.abs(p.x - r) >= y ? r : p.x + k * y, x = k > 0 ? Math.max(r, Math.min(B, i)) : Math.min(r, Math.max(B, l)), $ = { from: r, to: x, begin: h.walk, end: h.aim };
    return r = x, $;
  });
}
function x6(e, t, n) {
  var o;
  const a = Ee.bug_shot.back.stride * n;
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
const Se = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, j2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function F2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const W2 = (e) => e.along * 97 % 1 < Se.camera, fn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Se.gravity * t * t });
function H2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Se.gravity * (t.bottom - e.from.y))) / Se.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Se.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Se.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Se.step) {
    const d = Math.min(c + Se.step, l.t), h = fn(e, d), p = cr(i, h, n);
    if (p) return { ...p, t: c + (d - c) * p.share };
    i = h;
  }
  const r = fn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function z2(e, t, n, a = []) {
  const s = F2(e.along + 1), [o, l] = j2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Se.count }, () => {
    const r = i + (s() - 0.5) * 2 * (Se.spread * Math.PI / 180), c = Se.speed[0] + s() * (Se.speed[1] - Se.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: Se.radius[0] + s() * (Se.radius[1] - Se.radius[0]) };
    return { ...d, ...H2(d, t, a) };
  });
}
function U2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Se.step) {
      const l = Math.min(o + Se.step, s), i = cr(fn(a, o), fn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function G2(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...fn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Se.hold) / Se.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, r = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - r)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: r, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function S6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: r } = Ee.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / r, d = (o[1] - o[0]) * i / r, h = Oe(e, [0, c]), p = Oe(e, [c, c + d]);
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
function M6(e, t, n, a, s) {
  const { sway: o, above: l } = Ee.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (B) => {
    const [x, $] = [B.x - e.at.x, B.y - e.at.y];
    return { x: i.x + x * c - $ * d, y: i.y + x * d + $ * c };
  }, [p, y] = [...n].sort((B, x) => B.x - x.x), k = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: k.map((B, x) => ({ from: B, to: x < k.length / 2 ? p : y })) };
}
const _6 = (e, t) => Oe(t, e.grows) * (1 - Oe(t, e.sinks));
function sa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: dn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: dn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function C6(e, t) {
  const n = Ee[e];
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
const E6 = (e) => e === "pack_box";
function A6(e) {
  const { into: t, out: n } = sa(Ee.rope_swing, e);
  return 1 - Oe(t, [0, 1]) * (1 - Oe(n, [0, 1]));
}
function O6(e) {
  const t = Ee.rope_swing, { into: n, out: a } = sa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Oe(n, [0, 1]) * (1 - Oe(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const V2 = { after: 3 }, eo = 10, K2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Y2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Q2 = { weight: 19 }, dr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, X2 = { every: 120 }, fr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, hr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, J2 = {
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
}, $n = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: eo }), ie = (e, t, n = {}) => $n(e, "clip", t, n), Fa = (e, t, n = {}) => $n(e, "look", t, n), ul = (e, t, n = {}) => $n(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...$n(e, "pick", t, n), ...a }), ke = (e) => $n("nothing", "nothing", e, {}), Z2 = 120, e5 = 300, Wa = (e, t) => ({ ...ie(e, t), cooldown: e5 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), t5 = () => [ie("joy", 2)], kt = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), wt = (e) => ({ ...e, cooldown: K2[e.name] }), Qt = (e) => ({ ...e, shenanigan: !0, lasts: Y2[e.name] }), va = [
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
  ...de("reported", { cooldown: 90 }, [ul("read", 3), ie("nod", 1), ke(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [ul("read", 3), ke(1)]),
  ...de("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), ke(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), ke(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, t5()),
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
  ...Object.entries(J2).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Fa(t, 1)])),
  ...Object.entries(fr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(hr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [ie(t, 1)])),
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
  ...de("held:search", { cooldown: Z2 }, [Wa("search", 3), { ...Wa("binoculars", 2), when: { home: !0 } }, { ...Wa("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...de("unit", { cooldown: dr.build.cooldown }, [ye("unit", Q2.weight), ke(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: X2.every }, ye("stand", 5)]),
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
], mr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), pr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), n5 = (e) => Array.isArray(e) ? e[0] : e, a5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, s5 = (e) => va.some((t) => t.when.moment === e);
function o5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || pr(d).every(([h, p]) => n(h) >= n5(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = va.filter((d) => mr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= V2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ve(e, t) {
  const n = o5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (gr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function gr(e, t, n) {
  var a;
  for (const [s, o] of pr(t)) (a = e.memory) == null || a.set(s, e.now + a5(o, n));
}
function T6(e, t, n) {
  gr(e, va.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const I6 = (e) => Object.values(dr).find((t) => mr(t.when, e)) ?? null, l5 = (e, t, n) => n - t <= (e.lifetime ?? eo), B6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || ur(e.clip, t));
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
}, R6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), yr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), L6 = {
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
}, N6 = 120, i5 = 20, q6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < i5), r5 = (e) => xs[e] || xs.idle, D6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, br = "airborne", u5 = "landing", c5 = "travelling", kr = "grounded", P6 = ({ airborne: e, landing: t, trip: n }) => e ? br : t ? u5 : n != null && n.started ? c5 : kr;
function j6(e, t) {
  var s;
  const n = d5(e, t);
  return e.mode === kr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function d5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === br && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...f5(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : r5(c), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function f5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Ss = (e) => e.outcome, h5 = "plugin:code-commandments:sins:", cl = (e) => e.type === "plugins.card" && e.markKey.startsWith(h5), m5 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
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
], F6 = (e, t) => e.filter((n) => n.author === "user" && ta(n.read_at) > t).map((n) => ({ beat: "read_message", time: ta(n.read_at), card: Mi(n) })).sort((n, a) => n.time - a.time), dl = { user: "reacted", agent: "agent_reacted" };
function W6(e, t) {
  return e.filter((n) => dl[n.author] && _t(n) > t).map((n) => ({ beat: `${dl[n.author]}:${n.emoji}`, time: _t(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const p5 = [.../* @__PURE__ */ new Set([...Object.values(fr).flatMap((e) => Object.keys(e)), ...Object.keys(hr)])];
function H6(e, t) {
  return e.filter((n) => n.author === "agent" && _t(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = p5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: _t(n), card: Mi(n) })).sort((n, a) => n.time - a.time);
}
const g5 = (e) => new vr(e).isTest(), oa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Ss(e)] || "";
}, v5 = 1800, y5 = (e, t) => {
  if (oa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && oa(n) !== "finished" && Number(e.time) - Number(n.time) <= v5 ? "tests_fixed" : "tests_passed";
};
function z6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(g5), s = a.filter((i) => oa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, oa(i))), o.map((i) => ({ beat: y5(i, s), time: Number(i.time), card: i.key }));
}
function U6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Ss(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Ss(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const G6 = (e) => e.map((t) => {
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
function V6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function K6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Y6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = m5.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function to(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const fl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function b5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    to(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function Q6(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : s5(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function X6(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const hl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function J6(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, i = o % Re.sweep, r = Re.sweep - Re.returnSeconds, c = hl((i - r) / Re.returnSeconds), d = i <= r ? hl(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const ml = 3, wr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, pl = 12, Z6 = (e, t) => ({ mood: e, began: t, seen: 0 });
function eM(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!wr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= ml ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * pl) / pl, lasts: ml } };
}
const tM = (e) => e.posture === "hang" && !wr(e.face), k5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), w5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function nM(e, t, n) {
  return k5.has(e) ? 1 / 0 : !w5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max($r(n - t.began, t.share) - ot.lead, 0);
}
const $5 = 5;
function aM(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= $5 ? { beat: "long_walk", time: n } : null };
}
const x5 = 30, Dn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function sM(e, t, n, a, s = null) {
  if (t && n < t.until || !Dn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, i] = Dn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Dn.every } : { state: e, began: 0, until: 0, next: n + Dn.every };
}
const oM = (e, t, n) => t && n < t.until && yr.has(e.state) ? { state: t.state, since: t.began } : e, ot = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, $r = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function lM(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = $r(o, e.share);
  return s ? { eager: S5(t, l), moment: null } : l > ot.lead ? { eager: t, moment: null } : l < ot.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ot.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ot.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function S5(e, t) {
  return e.on && t > ot.lead + ot.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ot.lead && t >= ot.least ? { ...e, on: !0, calm: !1 } : e;
}
const M5 = 1, _5 = { look: "look", gaze: "gaze" };
function C5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [_5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const E5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), A5 = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > M5 * t, memory: a, now: s, room: o }, n).name === "backflip", O5 = { work: ["building"], idle: ["standing"] };
function iM(e, t, n, a) {
  const s = xs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(O5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), yr.has(e) ? { moments: o, began: n || a } : (n && a - n >= x5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function T5(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const gl = { pondering: T5 };
function rM(e, t, n, a, s, o) {
  if (gl[e.beat]) {
    const i = gl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = C5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== eo && { lifetime: l.lifetime } } } : null;
}
function uM(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = E5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const cM = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function dM(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function fM(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const hM = (e, t) => !!(e != null && e.watches) && !t.once, mM = 10, pM = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || l5(a, a.queuedAt, n)), gM = (e, t) => t ? null : e[0] ?? null;
function vM(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const yM = (e, t) => !t.during || !e.some((n) => n.during === t.during), I5 = 2 * Math.PI, B5 = 500;
function bM(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / B5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = I5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, B = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !r ? s && !t.behind && !y.behind ? L5(y, t, n, p, s) : q5(y, t, n, p) : t) ?? y, x = B != null && B.behind && B.mood === "reading" ? R5(e.point, B, n, l, s) : B;
  return { point: x ?? null, toward: x ? { x: x.x - n.x, y: x.y - n.y } : null, amount: h, at: a };
}
function R5(e, t, n, a, s) {
  const o = (S) => S * 180 / Math.PI, l = (S) => o(Math.atan2(Math.sin(S * Math.PI / 180), Math.cos(S * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : d, k = y + l(c - y), B = Math.min(Math.max(a / 1e3, 0), 0.1), x = Re.turnSpeed * B, $ = h ? y + Math.min(Math.max(k - y, -x), x) : k, C = h ? e.readingFollow + p : $, N = C + ($ - C) * (1 - Math.exp(-B / Re.followSeconds)), q = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, _ = o(to(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), z = Math.min(Math.max(_, -q.up), q.down), H = Re.tipSpeed * B, P = h ? e.readingPitch + Math.min(Math.max(z - e.readingPitch, -H), H) : z;
  return { ...t, readingYaw: $, readingFollow: N, readingPitch: P, readingFacing: i };
}
function L5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (C) => {
    const { yaw: N, pitch: q } = to(C.x - n.x, s, n.y - C.y, o);
    return { yaw: N, pitch: Math.min(Math.max(q, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [fl(i(e)), fl(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [p, y] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [k, B, x] = r.map((C, N) => p * C + y * c[N]), $ = s * k / B;
  return { ...t, x: n.x + $, y: n.y - b5($, s, -Math.asin(Math.min(Math.max(x, -1), 1)), o) };
}
const N5 = 0.15;
function kM(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= N5;
}
function q5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const D5 = (e) => !(e != null && e.on);
function wM(e, t, n) {
  if (D5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const hn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, nt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ha = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), vl = (e) => e * e * (3 - 2 * e);
function P5(e) {
  if (e < 0 || e >= nt.seconds) return null;
  const t = Ha(e, ...nt.flicker), n = Math.floor(t * nt.flickers * 2) % 2 === 0, a = e < nt.flicker[1] ? n ? 0.35 + 0.5 * t : nt.dim : 1;
  return { strength: 1 - vl(Ha(e, ...nt.fade)), lit: a, white: e < nt.flash[0] ? 0 : 1 - vl(Ha(e, ...nt.flash)) };
}
const $M = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function xM(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = P5(t - e.at);
  return a && { colour: hn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: nt.signs[e.tone], ...a } };
}
function SM(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function MM(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= hn.looks || a === null && n - e.since >= hn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function _M(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ht = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, CM = { behind: 39, figure: 40, ahead: 41 }, j5 = "[data-figure-pile]", F5 = { amber: [1, 0.69, 0.125], good: hn.colours.good, bad: hn.colours.bad }, Gn = { phases: 4, ms: 230, dim: 0.25 }, EM = (e, t, n) => e !== "amber" || (t + n) % Gn.phases < Gn.phases / 2 ? 1 : Gn.dim, AM = (e) => e === "amber" ? Gn.phases : 1;
function OM(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const TM = Object.keys(F5), Qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Jt = ([e, t], n) => e + n() * (t - e);
function IM(e) {
  const t = Qe.least + Math.floor(e() * (Qe.most - Qe.least + 1));
  return Array.from({ length: Math.min(t, Qe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Qe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Jt(Qe.start, e), l = Jt(Qe.reach, e);
    return {
      text: Ve({ moment: "digit" }, e).name,
      x: a * o,
      y: Qe.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Jt(Qe.moveMs, e)),
      fadeMs: Math.round(Jt(Qe.fadeMs, e))
    };
  });
}
const za = { high: 3, gap: 1 };
function BM(e) {
  const t = Math.floor(e / za.high);
  return { left: -(ht.inside + ht.width / 2 + t * (ht.width + za.gap)), up: e % za.high * (ht.height - ht.top) };
}
const W5 = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, H5 = { after: 5 }, z5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new vr(t).isBuild());
function RM(e, t, n) {
  const a = z5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= H5.after ? s : null;
}
function LM(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: W5(n, a, s) } : null;
}
const yl = { ahead: 140, up: 70 };
function NM(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * yl.ahead, y: a - yl.up } } : o ? { at: { x: n(o), y: a - o.up - ht.height } } : t ? { at: null } : null;
}
const Ua = { least: 4e3, most: 1e4 }, U5 = (e) => Ua.least + e() * (Ua.most - Ua.least), $t = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function qM(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = U5(t);
    if (n.length >= $t.most || t() >= $t.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * ($t.at[0] + t() * ($t.at[1] - $t.at[0]));
    n.push({ from: o, to: o + $t.ms }), a = o + $t.ms;
  }
}
const DM = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), PM = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), xr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), jM = new Set(va.filter((e) => xr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), G5 = (e) => e.some((t) => t.state === "built"), FM = (e, t) => G5(t) ? e.filter((n) => !xr.has(n.beat)) : e, gt = { reach: 40, room: 6 }, V5 = (e, t) => t <= e - gt.reach + 2, WM = (e, t, n) => V5(e, n) ? t - gt.reach : e - gt.reach - gt.room, HM = (e, t, n, a) => a > 0 && t < e && t + gt.reach >= e - 2 ? Math.min(n, Math.max(e, t + gt.reach)) : e, Ga = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, zM = (e) => Jt(e() < Ga.longShare ? Ga.long : Ga.short, e), K5 = 2 * ht.width;
function UM(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= K5 ? o : e + (o - e + s / 2) % s;
}
const Y5 = 60, GM = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Y5, bl = "[data-figure-home]", xn = () => {
  var t;
  const e = document.querySelector(bl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(bl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Q5 = "[data-figure-docked-bars]", X5 = "[data-figure-chat-foot]", J5 = [0.85, 0.6, 0.35, 0.15], Z5 = ["question", "waiting", "suggestion"], VM = (e, t) => Z5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function KM() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const e$ = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", t$ = "[data-figure-newest]";
function Sr() {
  var a, s;
  const e = (a = xn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(t$), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function mn(e, t, n = Sr()) {
  if (!e || !n) return !0;
  const a = ut(e, t), s = ba(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Te.top * t.size, bottom: a.top + Te.bottom * t.size }, l = xt.gap;
  return !ya(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function YM(e, t, n, a = Sr()) {
  if (!a || mn(t, e, a)) return null;
  const s = ba(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = At(), r = t.posture === "stand" ? so * e.size : Ir * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= d && mn(p, e, a) && O$(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Va = 0.26, Mr = 0.54, n$ = 1.25 / 5.4, Sn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Va, travels: "stand" },
  lounge: { drop: Va, travels: "stand" },
  composed: { drop: Va, travels: "stand" },
  hang: { drop: Mr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, QM = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * n$ * Math.cos(t * Math.PI / 180),
  y: 1 - n - Mr
}), tn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), a$ = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), XM = (e, t) => (e === "sit" ? a$.has(t) : tn.has(e)) ? e : "stand";
function JM(e, t) {
  return e.facing === t.facing || !tn.has(e.posture) && !tn.has(t.posture) ? t : { posture: "stand", facing: tn.has(e.posture) ? e.facing : t.facing };
}
const ZM = 0.25, e_ = (e, t) => tn.has(e) && Sn[t].drop === 0, _r = 2, s$ = 90, o$ = 180, l$ = 140, i$ = 280, r$ = 420, u$ = 0.25, c$ = 290, d$ = 600, f$ = "cubic-bezier(0.2, 0.7, 0.4, 1)", h$ = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ka = 5;
function la(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ka) return null;
  (l || i) && (o = Math.max(o, _r));
  const y = o > 1, k = Math.abs(t.x - e.x), B = k < Ka ? 0 : k / (s$ * o) * 1e3, x = Math.min(B, y ? l$ : o$), $ = Math.abs(t.y - e.y), C = t.y < e.y, N = C && !p && A5($, n, r, c, d, h), q = C ? r$ + Math.min($, 400) * u$ : Math.sqrt(2 * $ / Zs) * 1e3, _ = {
    x: t.x,
    y: t.y,
    ms: $ > Ka ? N ? d$ : q : 0,
    lead: N ? c$ : C ? i$ : 0,
    easing: C ? f$ : h$,
    hopping: !0,
    clip: N ? "backflip" : C ? "jump" : "fall"
  }, z = { x: t.x, y: t.y, ms: B + x, lead: 0, easing: "linear", ramp: x, ...y ? { clip: "run" } : {} }, H = p ? m$(t, n) : _, P = C && !a ? [{ ...z, y: e.y }, H] : [{ ..._, x: e.x }, z];
  return { way: Math.sign(t.x - e.x) || 1, legs: P, lands: !s, pace: o, running: y };
}
const m$ = (e, t) => ({ x: e.x, y: e.y, ms: Ee.pogo.frames / Ee.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), p$ = (e, t) => e.postures.includes(t) ? t : e.postures[0], t_ = (e, t, n) => e.posture === "walk" && n ? "walk" : p$(e.clip, t), ut = (e, { size: t, below: n }, a = e.posture) => {
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
const Pn = 0.5, kl = 20;
function n_(e, t, n = At()) {
  const a = ut(e, t);
  return a.left >= n.left + kl && a.right <= n.right - kl;
}
function ao(e, t, n = At()) {
  const a = ut(e, t), s = a.right - a.left, o = ba(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Pn && i <= n.right + Pn && a.top >= n.top - Pn && r <= n.bottom + Pn;
}
const ia = [0.35, 0.5, 0.65], ra = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Te = { left: ia[0], right: ia.at(-1), top: ra[0], bottom: ra.at(-1) }, g$ = 0.24;
function ba(e) {
  if (e.posture === "stand") return { left: Te.left, right: Te.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + g$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Te.left, t), right: Math.max(Te.right, t) };
}
function v$(e, { size: t }, n = At()) {
  const a = ba(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const so = (Te.right - Te.left) / 2 + 0.08;
function a_(e, t) {
  return e === "hang" ? Te : { ...Te, bottom: Math.min(Te.bottom, 1 - t - Sn[e].drop) };
}
const y$ = "[data-figure-agent]";
function Cr(e, t, n = "", a = "") {
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
const Er = (e) => ra.flatMap(
  (t) => ia.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function oo(e, t, n = "") {
  if (!mn(e, t)) return ia.length * ra.length;
  const a = ut(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(e$)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && ya(s, r) && no(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return Er(s).filter(([i, r]) => l(i, r) || Cr(i, r, n)).length;
}
function b$(e, t) {
  const n = ut(e, t);
  return Er({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Cr(a, s, "", y$)).length;
}
const wl = 4;
function s_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = wl; o <= s; o += wl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!b$(i, e) && mn(i, e)) return i;
    }
  return null;
}
function pn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => ao(l, t, a) && mn(l, t)).map((l) => ({ spot: l, covered: oo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Ar = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), k$ = [0.5, 0.25, 0.75], w$ = (e) => Ar(e.getBoundingClientRect(), k$), Or = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, $$ = so, x$ = (e, t, { size: n }, a = $$) => Tr(e, Or[t], a * n, "stand");
function Tr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const S$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Ir = 0.1, M$ = (e, t, { size: n }) => Tr(e, S$[t], Ir * n, "sit"), _$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ya = 60;
function o_(e, t) {
  const n = _$(t);
  return !e.aside || Math.abs(n) >= Ya ? t : n < 0 ? 360 - Ya : Ya;
}
const nn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, C$ = (e) => [.../* @__PURE__ */ new Set([e, ...nn.turns.map((t) => (t + 360) % 360)])];
function l_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = C$(t), l = nn.every[0] + a() * (nn.every[1] - nn.every[0]);
  return { face: t, from: s ? E$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function E$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / nn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function i_(e, t) {
  const { element: n, edge: a } = ka(), s = ["left", "right"].map((i) => Mn(M$(a, i, e), e)).filter((i) => n && ao(i, e) && !oo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function r_(e, t, { size: n }) {
  const a = (Te.right - Te.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Br } : e;
}
const Br = 7;
function Rr() {
  const e = [...document.querySelectorAll(j5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function A$(e, t) {
  const n = ut(e, t), a = n.right - n.left;
  return { left: n.left + Te.left * a, right: n.left + Te.right * a, top: n.top + Te.top * a, bottom: n.bottom };
}
function O$(e, t) {
  const n = Rr();
  return !n || !ya(A$(e, t), n);
}
const T$ = 4;
function ka() {
  const e = _n(), t = Rr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > T$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Br - n, 0) } };
}
const u_ = ({ size: e, below: t }) => (1 - t) * e;
function Mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = Sn[e.posture].drop * a;
  return { ...v$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ms = (e, t) => Object.keys(Or).map((n) => Mn(x$(e, n, t), t)), lo = (e, t) => Ar(e, J5).map((n) => Mn(n, t)), Lr = (e, t, n) => pn(e, t, n) ?? e[0];
function c_(e, t) {
  const { element: n, edge: a } = ka();
  return { ...Lr(Ms(a, e), e, t), view: null, on: n };
}
function d_(e, t, n, a) {
  const { element: s, edge: o } = ka(), l = (a ? Ms(o, t) : [...Ms(o, t), ...lo(o, t)]).filter(
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
  const e = xn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Q5);
  if (!t) return { ...wa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const $l = { within: 2 };
function f_(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = wa().edge;
  return a.left > s.left + $l.within || a.left + a.width < s.left + s.width - $l.within;
}
const I$ = "[data-figure-closing]";
function h_() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(I$));
}
const Nr = "[data-figure-progress]";
function m_(e) {
  const t = e.querySelector(Nr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function p_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const B$ = { across: 300, above: 380, below: 60 };
function g_(e) {
  const { across: t, above: n, below: a } = B$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: R$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const R$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), qr = "[data-figure-bar]", _s = { back: 144, along: 0.4 };
function v_(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(qr) : null;
  if (!(s != null && s.querySelector(Nr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Mn({ x: o - _s.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function y_(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < _s.along * a.size ? t.x + _s.along * a.size : e.x, y: e.y, behind: !0 };
}
function b_(e) {
  const t = e.querySelector(qr), n = t == null ? void 0 : t.firstElementChild;
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
function k_(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = wa(), r = n === null ? L$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Mn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function L$(e, t, n, a, s) {
  const o = lo(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + ht.width < s && r.x + a - gt.reach - gt.room >= l);
  return pn(i.length ? i : o, t, n);
}
const N$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function w_(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, _r));
  const y = (N) => {
    const q = ut(N, n, Sn[N.posture].travels);
    return { x: q.left, y: q.top };
  }, k = t.ladder ?? e.ladder;
  if (k && !(t.ladder && e.ladder)) return q$(y(e), y(t), y({ ...k.foot, posture: "stand" }), k.way, !!t.ladder, n, s);
  const [B, ...x] = [e, ...r, t].map(y), $ = la(B, x[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: p }), C = x.slice(1).map((N, q) => {
    var _;
    return (_ = la(x[q], N, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : _.legs.find((z) => z.hopping);
  });
  return $ && { ...$, legs: [...$.legs, ...C.filter(Boolean)] };
}
function q$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / N$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? la(e, n, o.size, { pace: l }) : la(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function $_(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function x_(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && pn(w$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ka();
  return { ...Lr(lo(s, t), t, n), view: null, on: a };
}
const D$ = "[data-figure-bubble]", P$ = 250;
let an = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Dr = 0;
const Kt = () => an, Qa = /* @__PURE__ */ new WeakMap();
let j$ = 0;
function io(e) {
  return Qa.has(e) || Qa.set(e, `floor-${++j$}`), Qa.get(e);
}
const F$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, W$ = () => {
  var e, t;
  return ((t = (e = xn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function H$(e, t) {
  var a;
  const n = (a = e.querySelector(X5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function z$(e, t) {
  const n = e && H$(e, t), a = e ? [...e.querySelectorAll(D$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || F$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: io(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const U$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= P$ ? (t.top - a.top) / s * 1e3 : 0;
};
function Pr(e = an, t = performance.now()) {
  const n = At(), a = W$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = wa();
  return c.element && r.push({ id: io(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...z$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: U$(e, d, t) }))) });
}
const Cs = /* @__PURE__ */ new Set();
function G$(e) {
  return Cs.add(e), () => Cs.delete(e);
}
function V$() {
  jr();
  const e = () => {
    Dr = requestAnimationFrame(e), !document.hidden && (an = Pr(an), Cs.forEach((t) => t(an)));
  };
  e();
}
function jr() {
  cancelAnimationFrame(Dr);
}
const ro = 5, K$ = 56, Y$ = { share: 0.6 }, Q$ = (e) => -Math.sqrt(2 * Zs * Y$.share * e), Wt = (e, t) => e.find((n) => n.id === t) ?? null;
function S_(e, t = Pr().floors) {
  const n = Wt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : io(e.on) : null, o = s && Wt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Fr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Kt().floors) {
  const c = Wt(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || X$(c, d, o)) && J$(d, i, r) ? { x: d.x, y: d.y } : null;
}
const uo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, X$ = (e, t, n) => !uo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function M_(e, t = Kt().floors) {
  if (!uo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= ro && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function J$(e, t, n = Kt().floors) {
  const a = Wt(n, "home");
  return e.posture === "hang" && a && ut(e, t).bottom >= a.top ? !1 : ao(e, t);
}
function __(e, t, n, a = Kt().floors) {
  const s = Fr(e, n, a);
  if (!e.home) return Z$(e, t, s, a);
  if (!s) return null;
  const o = Wt(a, "home"), l = s.y - t.y, i = l > ro ? "dropping" : -l > K$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Z$(e, t, n, a) {
  const s = n ? Wt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Q$(e.risen) };
  if (!n) return null;
  if (uo(t) && n.y - t.y > ro) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function C_(e, t, n) {
  const a = so * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function E_(e, t, n, a = Kt().floors) {
  const s = t && Fr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const e4 = ["data-type"], t4 = { class: "figure-floor-name" }, n4 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", t4, v(e.floor.type), 1)
    ], 12, e4));
  }
}, a4 = /* @__PURE__ */ U(n4, [["__scopeId", "data-v-4e0f1e2e"]]), s4 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, o4 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Je(Kt().floors);
    let n = () => {
    };
    return xe(() => {
      n = G$((a) => t.value = a.floors), V$();
    }), Ie(() => {
      n(), jr();
    }), (a, s) => (u(), f("div", s4, [
      (u(!0), f(j, null, ne(t.value, (o) => (u(), W(a4, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, A_ = /* @__PURE__ */ U(o4, [["__scopeId", "data-v-e519168b"]]), sn = (e) => typeof e == "number" ? e : Date.parse(e);
function O_(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: sn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => sn(s.row.created_at) - sn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const xl = 20;
async function T_(e, t, n) {
  for (let a = 0; a < xl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || sn(o.created_at) <= sn(s.created_at) || !await n()) return a;
  }
  return xl;
}
const l4 = 3, Xa = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function i4(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Xa[n.grouping]) == null ? void 0 : a.call(Xa, e.row, n)) || "";
}
function r4(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function I_(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= l4 ? [r4(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = i4(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function B_(e) {
  const t = Ye(), n = t.option("row"), a = A(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), me(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function u4(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const R_ = (e) => (t) => t.filter((n) => n.id !== e), L_ = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), N_ = (e) => (t) => [...t, e], q_ = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function D_(e, t = {}) {
  const n = Ye(), a = A(null), s = A("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function P_(e) {
  const t = Ye(), n = A("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const jn = /* @__PURE__ */ new Map();
function c4(e, t) {
  if (jn.has(e)) return jn.get(e);
  const n = t().finally(() => jn.delete(e));
  return jn.set(e, n), n;
}
function j_() {
  const e = Ye(), t = A(null), n = A("");
  async function a() {
    const s = await c4(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const d4 = { class: "cards-page" }, f4 = { class: "cards-bar" }, h4 = { class: "cards-count" }, m4 = { class: "cards" }, p4 = {
  key: 1,
  class: "cards-note"
}, g4 = {
  key: 2,
  class: "cards-note"
}, v4 = ["data-row", "onClick"], y4 = { class: "card-head" }, b4 = { class: "card-title" }, k4 = { class: "card-foot" }, w4 = {
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
    return (a, s) => (u(), f("div", d4, [
      m("div", f4, [
        m("span", h4, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        T(pe, Pe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: F(() => [
            T(re, {
              name: "plus",
              size: 12
            }),
            Y(" New " + v(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", m4, [
        e.loaded ? e.failure ? (u(), f("p", p4, v(e.failure), 1)) : e.rows.length ? b("", !0) : (u(), f("p", g4, "No " + v(e.noun) + "s yet", 1)) : (u(), W(Ke, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), f(j, null, ne(e.rows, (o) => (u(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", y4, [
            T(re, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            Y(" " + v(e.head(o)), 1),
            T(et, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", b4, v(e.title(o)), 1),
          m("span", k4, v(e.foot(o)), 1)
        ], 8, v4))), 128))
      ]),
      fe(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, F_ = /* @__PURE__ */ U(w4, [["__scopeId", "data-v-990e6b37"]]), Sl = "newest";
function W_(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = _e(qe, null)) == null ? void 0 : c.search, s = A(""), o = A(Sl), l = A("all"), i = E(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((p) => u4(p, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Sl ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), r = E(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
}
const $4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, x4 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, S4 = 40, M4 = "top", _4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = _e(qe, null)) == null ? void 0 : p.autoScroll, s = E(() => a === M4), o = A(null), l = A(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      var y;
      l.value = i(o.value) >= S4, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    me(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = r()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return xe(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = r());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), tt(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, k) => (u(), f("div", $4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: V(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        fe(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", x4, [
        T(zt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: F(() => [
            Ze(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              T(re, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              k[0] || (k[0] = Y(" Newest ", -1))
            ], 512), [
              [Rl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, H_ = /* @__PURE__ */ U(_4, [["__scopeId", "data-v-d704d7e3"]]), C4 = ["aria-selected", "data-tab", "onClick"], E4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, A4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _e(qe, null), o = E(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = A(null), i = A({ left: 0, width: 0, slides: !1 }), r = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var k;
      const y = (k = l.value) == null ? void 0 : k.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const d = () => je(() => c(!0));
    let h = null;
    return xe(() => {
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
      (u(!0), f(j, null, ne(o.value, (k) => {
        var B, x;
        return u(), f("button", {
          key: k.key,
          type: "button",
          role: "tab",
          class: V(["inner-tab", { on: ((B = e.active) == null ? void 0 : B.key) === k.key }]),
          "aria-selected": ((x = e.active) == null ? void 0 : x.key) === k.key,
          "data-tab": k.key,
          onClick: ($) => a("choose", k)
        }, [
          Y(v(k.label) + " ", 1),
          r(k) ? (u(), f("span", E4, v(e.answer[k.count_field]), 1)) : b("", !0)
        ], 10, C4);
      }), 128)),
      m("i", {
        class: V(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, z_ = /* @__PURE__ */ U(A4, [["__scopeId", "data-v-63fcd326"]]), O4 = {
  class: "tab-body",
  "data-tab-body": ""
}, T4 = { "data-tab-content": "" }, I4 = {
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
    }), (s, o) => (u(), f("div", O4, [
      n.value ? (u(), W(Ke, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : b("", !0),
      Ze(m("div", T4, [
        fe(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Rl, !n.value]
      ])
    ]));
  }
}, U_ = /* @__PURE__ */ U(I4, [["__scopeId", "data-v-63876533"]]), B4 = {
  class: "search-bar",
  "data-search-bar": ""
}, R4 = { class: "search-bar-control" }, L4 = ["value", "placeholder", "aria-label"], N4 = ["aria-expanded"], q4 = {
  key: 0,
  "data-menu-count": ""
}, D4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var $;
    const a = e, s = n, o = tu(), l = (($ = _e(qe, null)) == null ? void 0 : $.search) ?? {}, i = E(() => l.placeholder || a.placeholder), r = l.context ?? [], c = A(null), d = A(null), h = A([]), p = E(() => h.value.length ? h.value[h.value.length - 1].next : r), y = E(() => !!o.menu || r.length > 0), k = (C) => {
      h.value = [], d.value = d.value ? null : C.currentTarget;
    };
    function B(C) {
      if (C.next.length) {
        h.value = [...h.value, C];
        return;
      }
      d.value = null, s("pick", C.click);
    }
    function x() {
      var C;
      s("update:modelValue", ""), (C = c.value) == null || C.focus();
    }
    return t({ focus: () => {
      var C;
      return (C = c.value) == null ? void 0 : C.focus();
    } }), (C, N) => {
      var q;
      return u(), f("div", B4, [
        m("div", R4, [
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
            onInput: N[0] || (N[0] = (_) => s("update:modelValue", _.target.value)),
            onKeydown: Mt(x, ["esc"])
          }, null, 40, L4),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: x
          }, [
            T(re, {
              name: "close",
              size: 12
            })
          ])) : b("", !0),
          y.value ? (u(), f("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: k
          }, [
            e.menuCount ? (u(), f("span", q4, v(e.menuCount), 1)) : b("", !0),
            T(re, {
              name: "caret",
              size: 12
            })
          ], 8, N4)) : b("", !0)
        ]),
        (q = L(l).button) != null && q.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: N[1] || (N[1] = (_) => s("pick", L(l).button.click))
        }, v(L(l).button.title), 1)) : b("", !0),
        fe(C.$slots, "default", {}, void 0, !0),
        d.value ? (u(), W(ha, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: N[3] || (N[3] = $e(() => {
          }, ["stop"])),
          onClose: N[4] || (N[4] = (_) => d.value = null)
        }, {
          default: F(() => [
            h.value.length ? (u(), W(ze, {
              key: 0,
              "data-search-back": "",
              onClick: N[2] || (N[2] = (_) => h.value = h.value.slice(0, -1))
            }, {
              default: F(() => [
                Y("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : b("", !0),
            (u(!0), f(j, null, ne(p.value, (_) => (u(), W(ze, {
              key: _.title,
              description: _.subtext,
              "data-search-entry": _.title,
              onClick: (z) => B(_)
            }, {
              default: F(() => [
                Y(v(_.title) + v(_.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? b("", !0) : fe(C.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : b("", !0)
      ]);
    };
  }
}, P4 = /* @__PURE__ */ U(D4, [["__scopeId", "data-v-45374bed"]]), j4 = {
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
    return (o, l) => (u(), W(P4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: F(() => [
        T(St, null, {
          default: F(() => [...l[2] || (l[2] = [
            Y("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(j, null, ne(a, (i) => T(ze, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (r) => e.tools.order.value = i.key
        }, {
          default: F(() => [
            Y(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(j, { key: 0 }, [
          T(St, null, {
            default: F(() => [...l[3] || (l[3] = [
              Y("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(j, null, ne(s, (i) => T(ze, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (r) => e.tools.state.value = i.key
          }, {
            default: F(() => [
              Y(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : b("", !0)
      ]),
      default: F(() => [
        fe(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, G_ = /* @__PURE__ */ U(j4, [["__scopeId", "data-v-dab0064d"]]);
function V_() {
  const e = A(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const K_ = (e) => import(
  /* @vite-ignore */
  e
), F4 = 86400, Es = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function W4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Es(t) - Es(e)) / F4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function Y_(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Es(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: W4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ja = 280, Za = 240, es = 120, H4 = 6, z4 = 14, gn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function U4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Wr(e, t) {
  const n = Math.max(0, U4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function G4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${z4}px)` }), e.offsetHeight, e.style.transition = `height ${Ja}ms ${gn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = Wr(t, e));
    const p = s() - i;
    if (!r && p >= Ja && (r = !0, e.style.transition = `opacity ${Za}ms ease-out, transform ${Za}ms ${gn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Ja + Za) return a(h);
    d();
  };
  return a(h), d;
}
function Q_(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${H4}px)` }), e.offsetHeight, e.style.transition = `opacity ${es}ms ease-out, transform ${es}ms ${gn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Wr(t, e)), s() - l < es) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const V4 = 140, Fn = 220, Ml = 5;
function X_({ gap: e = V4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function r() {
    const d = n.splice(0, Ml);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(r, e));
      });
  }
  const c = (d, h, p, y = G4) => {
    if (l || !h.pane || !h.follows()) return p();
    const k = { el: d, options: h, done: p, arrival: y, display: d.style.display || "" };
    if (!s)
      return s = !0, i(k, () => o = t(r, e));
    d.style.display = "none", n.push(k), n.length >= Ml && c.flush();
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
function J_(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${gn}, opacity ${Fn}ms ease-in, margin ${Fn}ms ${gn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Fn);
}
const Hr = "chat.pins.minimised", Vn = A(Xn(Hr, !1));
function _l(e) {
  Vn.value = e, Ws(Hr, e);
}
function K4(e) {
  const t = E(() => e()), n = E(() => Vn.value ? [] : e()), a = () => _l(!Vn.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => _t(o) > s).length,
    (o, l) => o > l && _l(!1)
  ), { pins: t, visible: n, minimised: Vn, toggle: a };
}
const Y4 = ["title"], Q4 = {
  key: 0,
  class: "pins-count"
}, X4 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = K4(() => t.pinRows);
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
      L(a) ? (u(), f("span", Q4, v(L(n).length), 1)) : b("", !0)
    ], 10, Y4)) : b("", !0);
  }
}, Z_ = /* @__PURE__ */ U(X4, [["__scopeId", "data-v-d073c504"]]), J4 = ["title"], Z4 = ["title"], ex = { class: "diff-card-dir" }, tx = { class: "diff-card-name" }, nx = ["title"], ax = ["title"], sx = {
  key: 0,
  class: "diff-card-note"
}, ox = ["href"], lx = ["src", "alt"], ix = { class: "diff-card-rows" }, rx = { class: "diff-row-num" }, ux = { class: "diff-row-sign" }, cx = { class: "diff-row-code" }, dx = {
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
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = E(() => n.path.lastIndexOf("/") + 1), c = E(() => n.path.slice(0, r.value)), d = E(() => n.path.slice(r.value)), h = E(() => n.change === "deleted"), p = E(() => l[n.change]), y = E(() => new Set(n.rows.filter((O) => O.line_type === "add").map((O) => O.line))), k = A("after"), B = E(() => k.value === "before" ? n.whole.old : n.whole.text), x = E(() => n.whole && n.whole.text !== void 0 ? B.value.split(`
`).map((O, w) => ({ line_type: k.value === "after" && y.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: O })) : n.rows.filter(
      (O) => !(n.editsOnly && ["ctx", "fold"].includes(O.line_type)) && !(n.hideRemovals && O.line_type === "del")
    )), $ = A(!1), C = E(() => n.lines && !$.value && !n.whole), N = E(() => C.value ? x.value.slice(0, n.lines) : x.value), q = E(() => x.value.length - N.value.length), _ = (O) => O.line === null || O.line_type === "del" ? "" : O.line, z = (O) => O.line_type === "fold" ? O.hidden ? `⋯ ${O.hidden} lines` : "⋯" : O.text, H = A(null), P = A(null);
    let S = null;
    return xe(() => {
      if (!P.value) return;
      let O = !0;
      S = new ResizeObserver(() => {
        !H.value || !P.value || (H.value.style.transition = O ? "none" : "", H.value.style.height = `${P.value.offsetHeight}px`, O = !1);
      }), S.observe(P.value);
    }), Ie(() => S && S.disconnect()), (O, w) => (u(), f("section", {
      class: V(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (g) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${L(s)}-click to open it`,
          onClick: o
        }, [
          m("span", ex, v(c.value), 1),
          m("span", tx, v(d.value), 1),
          p.value ? (u(), f("span", {
            key: 0,
            class: V(["diff-card-badge", e.change])
          }, v(p.value), 3)) : b("", !0)
        ], 8, Z4),
        m("span", {
          class: V(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: V(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        T(et, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: k.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = $e((g) => k.value = k.value === "after" ? "before" : "after", ["stop"]))
        }, v(k.value === "after" ? "After" : "Before"), 9, nx)) : b("", !0),
        h.value ? b("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: V(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = $e((g) => a("whole"), ["stop"]))
        }, [
          T(re, {
            name: "file",
            size: 12
          })
        ], 10, ax))
      ], 8, J4),
      e.whole && e.whole.error ? (u(), f("p", sx, v(e.whole.error), 1)) : b("", !0),
      !h.value && !e.folded ? (u(), f(j, { key: 1 }, [
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
          }, null, 8, lx)
        ], 8, ox)) : (u(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: H,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: P,
            class: "diff-card-diff"
          }, [
            m("div", ix, [
              (u(!0), f(j, null, ne(N.value, (g, M) => (u(), f("div", {
                key: M,
                class: V(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                m("span", rx, v(_(g)), 1),
                m("span", ux, v(i[g.line_type]), 1),
                m("span", cx, v(z(g)), 1)
              ], 2))), 128)),
              q.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = $e((g) => $.value = !0, ["stop"]))
              }, v(q.value) + " more " + v(q.value === 1 ? "line" : "lines"), 1)) : b("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : b("", !0)
    ], 2));
  }
}, eC = /* @__PURE__ */ U(dx, [["__scopeId", "data-v-23581cbb"]]), fx = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (u(), W(rt(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: F(() => [
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
}, tC = /* @__PURE__ */ U(fx, [["__scopeId", "data-v-683e1839"]]), hx = { "data-queue-controls": "" }, mx = { class: "counts" }, px = { "data-queue-spots": "" }, gx = {
  class: "spots",
  "aria-label": "Places in use"
}, vx = { "data-queue-waiting": "" }, yx = { key: 0 }, bx = { class: "control" }, kx = { class: "stepper" }, wx = ["disabled"], $x = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, xx = ["disabled"], Sx = ["for"], Mx = ["id", "value", "disabled", "onChange"], _x = { class: "control" }, Cx = ["aria-checked", "disabled"], Ex = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, Ax = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, Ox = {
  key: 2,
  class: "note failure",
  role: "alert"
}, Tx = {
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
    return (i, r) => (u(), f("div", hx, [
      T(Ft, { icon: "gauge" }, {
        default: F(() => [...r[3] || (r[3] = [
          Y("Now", -1)
        ])]),
        _: 1
      }),
      m("div", mx, [
        m("div", null, [
          m("strong", px, [
            Y(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", gx, [
            (u(!0), f(j, null, ne(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: V({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", vx, v(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", yx, "The oldest goes first.")) : b("", !0)
        ])
      ]),
      m("div", bx, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", kx, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, wx),
          m("output", $x, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, xx)
        ])
      ]),
      (u(!0), f(j, null, ne(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, Sx),
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
        }, null, 40, Mx)
      ]))), 128)),
      m("div", _x, [
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
        ])], 8, Cx)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", Ex, [
        T(re, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = Y("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", Ax, [
        T(re, {
          name: "pause",
          size: 13
        }),
        Y("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : b("", !0),
      o.value ? (u(), f("p", Ox, v(o.value), 1)) : b("", !0)
    ]));
  }
}, Ix = /* @__PURE__ */ U(Tx, [["__scopeId", "data-v-b594afa3"]]), Bx = ["data-queue-row", "data-queue-process"], Rx = ["aria-expanded"], Lx = { class: "run-line" }, Nx = { class: "leading" }, qx = {
  key: 0,
  "data-queue-position": ""
}, Dx = ["title"], Px = { class: "command" }, jx = {
  class: "time",
  "data-queue-time": ""
}, Fx = { class: "details" }, Wx = { "data-queue-type": "" }, Hx = { class: "failed" }, zx = { class: "drop-inner" }, Ux = { class: "output" }, Gx = { class: "output-heading" }, Vx = ["href"], Kx = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(), o = er((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = Qs(), r = E(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = E(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, k = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return k < 60 ? `${k} s` : k < 3600 ? `${Math.floor(k / 60)} m ${k % 60} s` : `${Math.floor(k / 3600)} h ${String(Math.floor(k / 60) % 60).padStart(2, "0")} m`;
    });
    async function d() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await je(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await je(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return me(() => n.expanded, h, { immediate: !0 }), wn(["output.*"], d), (p, y) => (u(), f("div", {
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
          y[3] || (y[3] = Mt($e((k) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Mt($e((k) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", Lx, [
          m("span", Nx, [
            e.run.section === "waiting" ? (u(), f("span", qx, v(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: V(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, Dx))
          ]),
          m("code", Px, v(e.run.line), 1),
          m("span", jx, v(c.value), 1),
          T(re, {
            class: V(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", Fx, [
          m("span", Wx, v(r.value), 1),
          e.run.owner_agent_id ? (u(), f(j, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = $e((k) => L(vt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), f(j, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : b("", !0),
          e.run.task_id ? (u(), f(j, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = $e((k) => L(vt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : b("", !0),
          e.run.state === "failed" ? (u(), f(j, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", Hx, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : b("", !0)
        ])
      ], 40, Rx),
      m("div", {
        class: V(["drop", { open: e.expanded }])
      }, [
        m("div", zx, [
          m("div", Ux, [
            m("div", Gx, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Vx)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (k) => e.expanded && L(o).loadEarlier(k.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              Y(v(e.run.line), 1),
              L(l).length ? (u(), f(j, { key: 0 }, [
                Y(v(`
` + L(l).join(`
`)), 1)
              ], 64)) : b("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, Bx));
  }
}, Yx = /* @__PURE__ */ U(Kx, [["__scopeId", "data-v-001561c5"]]), Qx = {
  class: "process-queue",
  "data-test-queue": ""
}, Xx = { class: "scroll" }, Jx = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Zx = ["data-queue-empty"], ts = 20, e8 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = A(""), s = A([]), o = A(ts), l = E(() => {
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
      ...y.rows.length ? y.rows.map((k, B) => ({ key: `run:${k.id}`, run: k, position: B + 1 })) : [{ key: `none:${y.type}`, section: y, empty: !0 }]
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
    return wn(["process.*", "setting.*"], d), xe(d), (p, y) => (u(), f("article", Qx, [
      y[0] || (y[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", Xx, [
        a.value ? (u(), f("p", Jx, v(a.value), 1)) : b("", !0),
        n.value ? (u(), f(j, { key: 1 }, [
          T(Ix, {
            queue: n.value,
            read: e.read,
            onSaved: d
          }, null, 8, ["queue", "read"]),
          T(Os, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: F(() => [
              (u(!0), f(j, null, ne(r.value, (k) => (u(), f(j, {
                key: k.key
              }, [
                k.run ? (u(), W(Yx, {
                  key: 0,
                  run: k.run,
                  environment: n.value.environment_name,
                  position: k.position,
                  read: e.read,
                  expanded: s.value.includes(k.run.id),
                  onToggle: (B) => c(k.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : k.empty ? (u(), f("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": k.section.type
                }, v(k.section.empty), 9, Zx)) : (u(), W(Ft, {
                  key: 2,
                  icon: k.section.icon,
                  count: k.section.rows.length,
                  "data-queue-heading": k.section.type
                }, {
                  default: F(() => [
                    Y(v(k.section.heading), 1)
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
          }, "Show older commands")) : b("", !0)
        ], 64)) : a.value ? b("", !0) : (u(), W(Ke, { key: 2 }))
      ])
    ]));
  }
}, nC = /* @__PURE__ */ U(e8, [["__scopeId", "data-v-d9b6ef6b"]]), t8 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, n8 = ["aria-expanded"], a8 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, s8 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, o8 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, l8 = {
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
    }, { immediate: !0 }), wn(["link.*", "phase.*", "phase_task.*"], i), (r, c) => (u(), f(j, null, [
      a.value ? (u(), f("section", t8, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", a8, v(a.value), 1),
          T(Vt, { open: n.value }, null, 8, ["open"])
        ], 8, n8),
        m("div", {
          class: V(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", s8, [
            T(Yc, {
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
          ])) : b("", !0)
        ], 2)
      ])) : b("", !0),
      o.value ? (u(), f("p", o8, v(o.value), 1)) : b("", !0)
    ], 64));
  }
}, i8 = /* @__PURE__ */ U(l8, [["__scopeId", "data-v-479ab50f"]]), r8 = ["placeholder"], u8 = { class: "actions" }, c8 = { class: "error" }, d8 = {
  key: 1,
  class: "card closed"
}, f8 = { class: "mark" }, h8 = { class: "prompt" }, m8 = {
  key: 0,
  class: "draft"
}, p8 = {
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
      var k, B;
      i.value = !0, r.value = !1, await je(), (B = ((k = d.value) == null ? void 0 : k.querySelector("input")) || d.value) == null || B.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const k = o.value.trim();
      if (!(!k || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(k), i.value = !1, r.value = !0;
        } catch (B) {
          o.value = k, l.value = B.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (k, B) => (u(), f("div", {
      class: V(["comment-bar", { open: i.value }])
    }, [
      i.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(y, ["prevent"]),
        onKeydown: Mt(p, ["esc"])
      }, [
        fe(k.$slots, "who", {}, void 0, !0),
        Ze(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": B[0] || (B[0] = (x) => o.value = x),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: B[1] || (B[1] = Mt((x) => L(qi)(x, y), ["enter"]))
        }, null, 40, r8), [
          [Yn, o.value]
        ]),
        m("div", u8, [
          m("span", c8, v(l.value), 1),
          T(pe, {
            small: "",
            onClick: p
          }, {
            default: F(() => [...B[3] || (B[3] = [
              Y("Cancel", -1)
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
            default: F(() => [...B[4] || (B[4] = [
              Y("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", d8, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", f8, [
            T(re, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", h8, v(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", m8, "Draft kept")) : b("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: B[2] || (B[2] = (x) => s("show"))
        }, [
          m("span", null, v(L(Xc)(e.count, "comment")), 1),
          T(re, {
            name: "down",
            size: 12
          })
        ])) : b("", !0)
      ]))
    ], 2));
  }
}, g8 = /* @__PURE__ */ U(p8, [["__scopeId", "data-v-b68baddd"]]), v8 = { wide: 1130 }, y8 = /\{([A-Za-z_]\w*)\}/g;
function Kn(e, t, n = {}) {
  return e.replace(y8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const b8 = (e, t, n, a) => Kn(e.label, n, { row_id: a, id: a }) || Qw(t, n, a), k8 = { class: "comment-side-head" }, w8 = {
  key: 0,
  class: "comment-none"
}, $8 = { key: 0 }, x8 = {
  key: 1,
  class: "comment-none"
}, S8 = {
  class: "comment",
  "data-comment": ""
}, M8 = {
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
      m("header", k8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        T(ma, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", w8, "No comments yet")) : b("", !0),
      (u(!0), f(j, null, ne(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", $8, v(a.quote), 1)) : b("", !0),
        a.revision ? (u(), f("span", x8, "Revision " + v(a.revision), 1)) : b("", !0),
        m("p", S8, v(e.words(a)), 1)
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
}, Cl = /* @__PURE__ */ U(M8, [["__scopeId", "data-v-276284a3"]]), _8 = { class: "resource-heading" }, C8 = { class: "resource-type" }, E8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, A8 = {
  key: 1,
  class: "resource-abstract"
}, O8 = {
  __name: "ResourceHeading",
  props: { label: String, title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", _8, [
      m("p", C8, v(e.label), 1),
      e.title ? (u(), f("h2", E8, v(e.title), 1)) : b("", !0),
      e.abstract ? (u(), f("p", A8, v(e.abstract), 1)) : b("", !0)
    ]));
  }
}, T8 = /* @__PURE__ */ U(O8, [["__scopeId", "data-v-e70bb004"]]), I8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, B8 = { class: "inspector-icons" }, R8 = { class: "inspector-icons-start" }, L8 = { class: "inspector-icons-end" }, N8 = ["href"], q8 = {
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
    return (i, r) => (u(), f("header", I8, [
      m("div", B8, [
        m("span", R8, [
          e.backed ? (u(), W(pe, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: r[0] || (r[0] = (c) => a("back"))
          }, {
            default: F(() => [
              T(re, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          e.stepped ? (u(), f(j, { key: 1 }, [
            T(pe, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: r[1] || (r[1] = (c) => a("step", -1))
            }, {
              default: F(() => [
                T(re, {
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
              default: F(() => [
                T(re, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : b("", !0)
        ]),
        m("span", L8, [
          e.embedded ? (u(), W(pe, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: r[3] || (r[3] = (c) => L(Ne)(s.value))
          }, {
            default: F(() => [
              T(re, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : b("", !0),
          o.value ? (u(), f("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this row",
            "aria-label": "Share this row",
            "data-resource-share": "",
            href: L(Lf)(s.value)
          }, [
            T(re, {
              name: "share",
              size: 13
            })
          ], 8, N8)) : b("", !0),
          e.embedded ? b("", !0) : (u(), W(pe, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: r[4] || (r[4] = (c) => a("close"))
          }, {
            default: F(() => [
              T(re, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      T(T8, {
        label: e.label,
        title: e.title,
        abstract: e.description
      }, null, 8, ["label", "title", "abstract"])
    ]));
  }
}, D8 = /* @__PURE__ */ U(q8, [["__scopeId", "data-v-51401f06"]]), P8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, j8 = { class: "field-name" }, F8 = {
  key: 1,
  class: "field-value"
}, W8 = ["onClick"], H8 = {
  key: 2,
  class: "field-value"
}, z8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", P8, [
      (u(!0), f(j, null, ne(e.fields, (o) => (u(), f(j, {
        key: o.name
      }, [
        m("p", j8, v(o.label), 1),
        o.isTime ? (u(), W(et, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", F8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, W8)
        ])) : (u(), f("p", H8, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, U8 = /* @__PURE__ */ U(z8, [["__scopeId", "data-v-7e45afb5"]]);
async function G8(e, t) {
  const n = await e(["agent", "show", String(t.agent_id)]);
  return n.ok ? Jw(t, n.value) : "";
}
async function V8(e, t) {
  const n = await e(["actor", "show", String(t)]), a = n.ok && n.value.type === "agent" ? await e(["agent", "show", String(t)]) : { ok: !1 };
  return n.ok ? Xw(n.value, a.ok ? a.value : null) : "";
}
const K8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Y8 = {
  key: 1,
  class: "inspector-wait"
}, Q8 = { class: "inspector-main" }, X8 = { class: "inspector-column" }, J8 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, Z8 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, e3 = { class: "inspector-text" }, t3 = ["innerHTML"], n3 = {
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
    }), l = A(null), i = A(""), r = A(""), c = A(""), d = A("details"), h = A(null), p = A(0);
    let y = 0;
    const k = E(() => ({ row_id: n.id, id: n.id })), B = E(() => l.value ? Kn(o.value.title, l.value, k.value) || Yw(n.noun, l.value, n.id) : ""), x = E(() => l.value ? b8(o.value, n.noun, l.value, n.id) : ""), $ = E(() => x.value === B.value ? "" : x.value), C = E(() => l.value ? Kn(o.value.description, l.value, k.value) : ""), N = E(() => {
      var R, D, Z;
      return ((R = l.value) == null ? void 0 : R.body) || ((D = l.value) == null ? void 0 : D.brief) || (s.has(n.noun) ? (Z = l.value) == null ? void 0 : Z.text : "") || "";
    }), q = E(() => N.value ? zs(N.value, { env: "", rowNames: !1 }) : ""), _ = E(() => Zw(l.value, N.value, i.value, r.value)), z = E(() => o.value.comments && p.value >= v8.wide), H = E(() => o.value.comments && !z.value), P = (R) => o.value.components.filter((D) => (D.tab || "") === R).map((D) => D.window), S = E(() => [...new Set(o.value.components.map((R) => R.tab).filter(Boolean))]), O = E(() => S.value.length || H.value ? [{ key: "details", label: "Details" }, ...S.value.map((R) => ({ key: R, label: R })), ...H.value ? [{ key: "comments", label: "Comments" }] : []] : []), w = Hi(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (R) => n.read(R));
    async function g(R, D) {
      const Z = await D;
      return R === y ? Z : "";
    }
    async function M() {
      const R = ++y, D = await n.read(Kn(o.value.reads, null, k.value).split(/\s+/).filter(Boolean));
      R === y && (c.value = D.ok ? "" : D.error, D.ok && (l.value = D.value, l.value.creator_id && (i.value = await g(R, V8(n.read, l.value.creator_id))), l.value.agent_id && (r.value = await g(R, G8(n.read, l.value)))));
    }
    me(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", M();
    }, { immediate: !0 }), wn(o.value.events, M), me(w.open, (R) => R && H.value && (d.value = "comments"));
    let I = null;
    return xe(() => {
      var R;
      p.value = ((R = h.value) == null ? void 0 : R.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (I = new ResizeObserver(() => p.value = h.value.clientWidth), I.observe(h.value));
    }), Ie(() => I == null ? void 0 : I.disconnect()), (R, D) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      T(D8, {
        label: $.value,
        title: B.value,
        description: C.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.noun}s`, id: e.id },
        onClose: D[0] || (D[0] = (Z) => a("close")),
        onBack: D[1] || (D[1] = (Z) => a("back")),
        onStep: D[2] || (D[2] = (Z) => a("step", Z))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (u(), f("p", K8, v(c.value), 1)) : l.value ? (u(), f(j, { key: 2 }, [
        T(Xi, null, {
          default: F(() => [
            T(Fs, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: M
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", Q8, [
          m("div", X8, [
            O.value.length ? (u(), f("div", J8, [
              T(jt, {
                options: O.value,
                value: d.value,
                onPick: D[3] || (D[3] = (Z) => d.value = Z)
              }, null, 8, ["options", "value"])
            ])) : b("", !0),
            m("div", Z8, [
              T(Ut, { value: d.value }, {
                details: F(() => [
                  m("div", e3, [
                    q.value && !o.value.draws_text ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: q.value
                    }, null, 8, t3)) : b("", !0),
                    o.value.lists_fields ? (u(), W(U8, {
                      key: 1,
                      fields: _.value,
                      onPeek: D[4] || (D[4] = (Z) => a("open", Z))
                    }, null, 8, ["fields"])) : b("", !0)
                  ]),
                  T(vs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: P(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: F(() => [
                  T(Cl, {
                    below: "",
                    comments: L(w).comments.value,
                    words: L(w).words,
                    more: !!L(w).nextPage.value,
                    loading: L(w).loading.value,
                    failure: L(w).failure.value,
                    onMore: L(w).loadMore,
                    onClose: D[5] || (D[5] = (Z) => d.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: F(() => [
                  T(vs, {
                    names: P(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), W(i8, {
                key: 0,
                model: e.noun,
                id: e.id,
                read: e.read,
                kinds: o.value.links.kinds,
                open: o.value.links.open,
                "outside-plan": o.value.links.outside_plan,
                "page-size": o.value.links.page_size,
                onOpen: D[6] || (D[6] = (Z) => a("open", Z))
              }, null, 8, ["model", "id", "read", "kinds", "open", "outside-plan", "page-size"])) : b("", !0)
            ]),
            o.value.comments ? (u(), W(g8, {
              key: 1,
              send: L(w).send,
              count: L(w).total.value,
              onShow: D[7] || (D[7] = (Z) => H.value && (d.value = "comments"))
            }, null, 8, ["send", "count"])) : b("", !0)
          ]),
          z.value ? (u(), W(Cl, {
            key: 0,
            comments: L(w).comments.value,
            words: L(w).words,
            more: !!L(w).nextPage.value,
            loading: L(w).loading.value,
            failure: L(w).failure.value,
            onMore: L(w).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : b("", !0)
        ])
      ], 64)) : (u(), f("div", Y8, [
        T(Ke)
      ]))
    ], 512));
  }
}, a3 = /* @__PURE__ */ U(n3, [["__scopeId", "data-v-e194a998"]]), aC = {
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
    const t = _e(Ds);
    return (n, a) => (u(), W(a3, Pe(n.$props, {
      catalogue: L(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, s3 = { class: "facts" }, o3 = { class: "fact wide" }, l3 = ["title"], i3 = {
  key: 1,
  class: "fact-value"
}, r3 = {
  key: 0,
  class: "fact"
}, u3 = { class: "fact-value" }, c3 = { class: "fact" }, d3 = { class: "fact-label" }, f3 = ["title"], h3 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, m3 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, p3 = {
  key: 2,
  class: "fact"
}, g3 = { class: "fact-value" }, v3 = { class: "fact wide" }, y3 = { class: "fact-label" }, b3 = { class: "fact wide" }, k3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, w3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = na.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var r, c;
      return u(), f("div", s3, [
        m("div", o3, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (r = e.place) != null && r.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (d) => L(Ne)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, l3)) : (u(), f("span", i3, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (u(), f("div", r3, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", u3, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : b("", !0),
        e.task.helper_id ? (u(), f(j, { key: 1 }, [
          m("div", c3, [
            m("span", d3, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (d) => L(Ne)(`agents:${e.task.helper_id}`))
            }, v(e.task.helper_name), 9, f3)
          ]),
          L(o).has(e.task.state) ? (u(), f("p", h3, v(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", m3, v(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : b("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", p3, [
          i[6] || (i[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", g3, "Agent " + v(e.task.holder_id), 1)
        ])) : b("", !0),
        m("div", v3, [
          m("span", y3, [
            i[7] || (i[7] = Y(" Complexity ", -1)),
            T(si, {
              lines: L(Qi).map((d, h) => `${h + 1}: ${d}`),
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
        m("div", b3, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          T(jt, {
            options: L(n),
            value: String(L(Yi)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", k3, v(e.refusal), 1)) : b("", !0)
        ])
      ]);
    };
  }
}, $3 = /* @__PURE__ */ U(w3, [["__scopeId", "data-v-a8bf3e2c"]]);
function x3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
  return { above: o.reverse(), below: l };
}
const S3 = { class: "number" }, M3 = { class: "title" }, _3 = { class: "word" }, C3 = {
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
    return (a, s) => (u(), W(rt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: V(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: F(() => [
        T(kn, { status: e.status }, null, 8, ["status"]),
        m("span", S3, v(e.number), 1),
        m("span", M3, v(e.title), 1),
        m("span", _3, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ns = /* @__PURE__ */ U(C3, [["__scopeId", "data-v-f6417ae8"]]), E3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, A3 = { class: "level" }, O3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1);
    me(() => n.task.id, () => s.value = !1);
    const o = E(() => x3(n.task.id, n.graph)), l = E(() => s.value ? o.value.above : o.value.above.slice(-1)), i = E(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = E(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, p = !1) => ({ status: cn(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), f("section", E3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(j, null, ne(l.value, (y) => (u(), f(j, {
        key: y.map((k) => k.id).join()
      }, [
        m("div", A3, [
          (u(!0), f(j, null, ne(y, (k) => (u(), W(ns, Pe({
            key: k.id,
            ref_for: !0
          }, d(k), {
            onSelect: p[0] || (p[0] = (B) => a("select", B))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      T(ns, nu(au(d(e.task, !0))), null, 16),
      (u(!0), f(j, null, ne(i.value, (y) => (u(), f(j, {
        key: y.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        T(ns, Pe({ ref_for: !0 }, d(y), {
          onSelect: p[1] || (p[1] = (k) => a("select", k))
        }), null, 16)
      ], 64))), 128)),
      r.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${r.value} more)`), 1)) : b("", !0)
    ])) : b("", !0);
  }
}, T3 = /* @__PURE__ */ U(O3, [["__scopeId", "data-v-79c52417"]]), I3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, B3 = ["datetime"], R3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", I3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(j, null, ne(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, B3),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : b("", !0);
  }
}, L3 = /* @__PURE__ */ U(R3, [["__scopeId", "data-v-b41f213b"]]), N3 = {
  class: "part",
  "data-resource-waits": ""
}, q3 = ["onClick"], D3 = { class: "wait-id" }, P3 = { class: "wait-title" }, j3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", N3, [
      m("h4", null, v(e.title), 1),
      (u(!0), f(j, null, ne(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        T(kn, {
          status: L(cn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", D3, v(o.id), 1),
        m("span", P3, v(o.title), 1)
      ], 8, q3))), 128))
    ]));
  }
}, El = /* @__PURE__ */ U(j3, [["__scopeId", "data-v-8fb2e251"]]), F3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, W3 = { class: "text" }, H3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, z3 = 180, U3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = A(!1), l = E(() => a.task.waits.filter((r) => !n.has(r.state))), i = E(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(j, null, [
      l.value.length ? (u(), W(El, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : b("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", F3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", W3, v(e.task.outcome), 1)
      ])) : b("", !0),
      e.task.brief ? (u(), f("section", H3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: V(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > z3 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : b("", !0)
      ])) : b("", !0),
      i.value.length ? (u(), W(El, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : b("", !0)
    ], 64));
  }
}, G3 = /* @__PURE__ */ U(U3, [["__scopeId", "data-v-4a3f1e79"]]), V3 = {
  class: "task-details",
  "data-task-details": ""
}, K3 = { class: "since" }, Y3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Q3 = { class: "text" }, X3 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, J3 = {
  key: 1,
  class: "note"
}, Z3 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, eS = { class: "text" }, tS = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", V3, [
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
            Y(" " + v(a(e.task.state)), 1)
          ]),
          m("span", K3, [
            o[5] || (o[5] = Y(" since ", -1)),
            T(et, {
              at: L(fh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", Y3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", Q3, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", X3, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", J3, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", Z3, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", eS, v(e.task.reason), 1)
        ])) : b("", !0),
        e.graph ? (u(), W(T3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : b("", !0),
        T($3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        T(G3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        T(L3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, sC = /* @__PURE__ */ U(tS, [["__scopeId", "data-v-7e73fa21"]]), nS = 50, aS = { messages: 25 }, sS = (e) => aS[e] || nS, oS = {
  class: "task-log",
  "aria-label": "Task log"
}, lS = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, iS = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, rS = { class: "entries" }, uS = ["data-task-log-important"], cS = ["datetime"], dS = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, fS = {
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
        String(sS("task_logs")),
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
    ), tt(() => {
      i += 1;
    }), (c, d) => (u(), f("section", oS, [
      o.value ? (u(), W(Ke, { key: 0 })) : l.value ? (u(), f(j, { key: 1 }, [
        m("p", lS, v(l.value), 1),
        T(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => r(a.value))
        }, {
          default: F(() => [...d[3] || (d[3] = [
            Y("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(j, { key: 2 }, [
        n.value.length ? b("", !0) : (u(), f("p", iS, "No log entries yet.")),
        m("ol", rS, [
          (u(!0), f(j, null, ne(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: V(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, cS),
            m("p", null, v(h.line), 1)
          ], 10, uS))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", dS, [
          T(pe, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => r(a.value - 1))
          }, {
            default: F(() => [...d[4] || (d[4] = [
              Y("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          T(pe, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => r(a.value + 1))
          }, {
            default: F(() => [...d[5] || (d[5] = [
              Y("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : b("", !0)
      ], 64))
    ]));
  }
}, oC = /* @__PURE__ */ U(fS, [["__scopeId", "data-v-cfa43bf1"]]);
function hS(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var as = { exports: {} }, Al;
function mS() {
  return Al || (Al = 1, (function(e, t) {
    var n = (function() {
      var a = function(_, z) {
        var H = 236, P = 17, S = _, O = o[z], w = null, g = 0, M = null, I = [], R = {}, D = function(K, Q) {
          g = S * 4 + 17, w = (function(G) {
            for (var X = new Array(G), J = 0; J < G; J += 1) {
              X[J] = new Array(G);
              for (var se = 0; se < G; se += 1)
                X[J][se] = null;
            }
            return X;
          })(g), Z(0, 0), Z(g - 7, 0), Z(0, g - 7), ge(), le(), oe(K, Q), S >= 7 && Ae(K), M == null && (M = De(S, O, I)), ee(M, Q);
        }, Z = function(K, Q) {
          for (var G = -1; G <= 7; G += 1)
            if (!(K + G <= -1 || g <= K + G))
              for (var X = -1; X <= 7; X += 1)
                Q + X <= -1 || g <= Q + X || (0 <= G && G <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= X && X <= 4 ? w[K + G][Q + X] = !0 : w[K + G][Q + X] = !1);
        }, ae = function() {
          for (var K = 0, Q = 0, G = 0; G < 8; G += 1) {
            D(!0, G);
            var X = i.getLostPoint(R);
            (G == 0 || K > X) && (K = X, Q = G);
          }
          return Q;
        }, le = function() {
          for (var K = 8; K < g - 8; K += 1)
            w[K][6] == null && (w[K][6] = K % 2 == 0);
          for (var Q = 8; Q < g - 8; Q += 1)
            w[6][Q] == null && (w[6][Q] = Q % 2 == 0);
        }, ge = function() {
          for (var K = i.getPatternPosition(S), Q = 0; Q < K.length; Q += 1)
            for (var G = 0; G < K.length; G += 1) {
              var X = K[Q], J = K[G];
              if (w[X][J] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    se == -2 || se == 2 || ce == -2 || ce == 2 || se == 0 && ce == 0 ? w[X + se][J + ce] = !0 : w[X + se][J + ce] = !1;
            }
        }, Ae = function(K) {
          for (var Q = i.getBCHTypeNumber(S), G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            w[Math.floor(G / 3)][G % 3 + g - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            w[G % 3 + g - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, oe = function(K, Q) {
          for (var G = O << 3 | Q, X = i.getBCHTypeInfo(G), J = 0; J < 15; J += 1) {
            var se = !K && (X >> J & 1) == 1;
            J < 6 ? w[J][8] = se : J < 8 ? w[J + 1][8] = se : w[g - 15 + J][8] = se;
          }
          for (var J = 0; J < 15; J += 1) {
            var se = !K && (X >> J & 1) == 1;
            J < 8 ? w[8][g - J - 1] = se : J < 9 ? w[8][15 - J - 1 + 1] = se : w[8][15 - J - 1] = se;
          }
          w[g - 8][8] = !K;
        }, ee = function(K, Q) {
          for (var G = -1, X = g - 1, J = 7, se = 0, ce = i.getMaskFunction(Q), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (w[X][ue - we] == null) {
                  var Ce = !1;
                  se < K.length && (Ce = (K[se] >>> J & 1) == 1);
                  var he = ce(X, ue - we);
                  he && (Ce = !Ce), w[X][ue - we] = Ce, J -= 1, J == -1 && (se += 1, J = 7);
                }
              if (X += G, X < 0 || g <= X) {
                X -= G, G = -G;
                break;
              }
            }
        }, te = function(K, Q) {
          for (var G = 0, X = 0, J = 0, se = new Array(Q.length), ce = new Array(Q.length), ue = 0; ue < Q.length; ue += 1) {
            var we = Q[ue].dataCount, Ce = Q[ue].totalCount - we;
            X = Math.max(X, we), J = Math.max(J, Ce), se[ue] = new Array(we);
            for (var he = 0; he < se[ue].length; he += 1)
              se[ue][he] = 255 & K.getBuffer()[he + G];
            G += we;
            var Fe = i.getErrorCorrectPolynomial(Ce), We = c(se[ue], Fe.getLength() - 1), co = We.mod(Fe);
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
        }, De = function(K, Q, G) {
          for (var X = d.getRSBlocks(K, Q), J = h(), se = 0; se < G.length; se += 1) {
            var ce = G[se];
            J.put(ce.getMode(), 4), J.put(ce.getLength(), i.getLengthInBits(ce.getMode(), K)), ce.write(J);
          }
          for (var ue = 0, se = 0; se < X.length; se += 1)
            ue += X[se].dataCount;
          if (J.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + J.getLengthInBits() + ">" + ue * 8 + ")";
          for (J.getLengthInBits() + 4 <= ue * 8 && J.put(0, 4); J.getLengthInBits() % 8 != 0; )
            J.putBit(!1);
          for (; !(J.getLengthInBits() >= ue * 8 || (J.put(H, 8), J.getLengthInBits() >= ue * 8)); )
            J.put(P, 8);
          return te(J, X);
        };
        R.addData = function(K, Q) {
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
              G = k(K);
              break;
            case "Kanji":
              G = B(K);
              break;
            default:
              throw "mode:" + Q;
          }
          I.push(G), M = null;
        }, R.isDark = function(K, Q) {
          if (K < 0 || g <= K || Q < 0 || g <= Q)
            throw K + "," + Q;
          return w[K][Q];
        }, R.getModuleCount = function() {
          return g;
        }, R.make = function() {
          if (S < 1) {
            for (var K = 1; K < 40; K++) {
              for (var Q = d.getRSBlocks(K, O), G = h(), X = 0; X < I.length; X++) {
                var J = I[X];
                G.put(J.getMode(), 4), G.put(J.getLength(), i.getLengthInBits(J.getMode(), K)), J.write(G);
              }
              for (var se = 0, X = 0; X < Q.length; X++)
                se += Q[X].dataCount;
              if (G.getLengthInBits() <= se * 8)
                break;
            }
            S = K;
          }
          D(!1, ae());
        }, R.createTableTag = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var G = "";
          G += '<table style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: " + Q + "px;", G += '">', G += "<tbody>";
          for (var X = 0; X < R.getModuleCount(); X += 1) {
            G += "<tr>";
            for (var J = 0; J < R.getModuleCount(); J += 1)
              G += '<td style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: 0px;", G += " width: " + K + "px;", G += " height: " + K + "px;", G += " background-color: ", G += R.isDark(X, J) ? "#000000" : "#ffffff", G += ";", G += '"/>';
            G += "</tr>";
          }
          return G += "</tbody>", G += "</table>", G;
        }, R.createSvgTag = function(K, Q, G, X) {
          var J = {};
          typeof arguments[0] == "object" && (J = arguments[0], K = J.cellSize, Q = J.margin, G = J.alt, X = J.title), K = K || 2, Q = typeof Q > "u" ? K * 4 : Q, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-description" : null, X = typeof X == "string" ? { text: X } : X || {}, X.text = X.text || null, X.id = X.text ? X.id || "qrcode-title" : null;
          var se = R.getModuleCount() * K + Q * 2, ce, ue, we, Ce, he = "", Fe;
          for (Fe = "l" + K + ",0 0," + K + " -" + K + ",0 0,-" + K + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += J.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', he += ' viewBox="0 0 ' + se + " " + se + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += X.text || G.text ? ' role="img" aria-labelledby="' + Ot([X.id, G.id].join(" ").trim()) + '"' : "", he += ">", he += X.text ? '<title id="' + Ot(X.id) + '">' + Ot(X.text) + "</title>" : "", he += G.text ? '<description id="' + Ot(G.id) + '">' + Ot(G.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', we = 0; we < R.getModuleCount(); we += 1)
            for (Ce = we * K + Q, ce = 0; ce < R.getModuleCount(); ce += 1)
              R.isDark(we, ce) && (ue = ce * K + Q, he += "M" + ue + "," + Ce + Fe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, R.createDataURL = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var G = R.getModuleCount() * K + Q * 2, X = Q, J = G - Q;
          return q(G, G, function(se, ce) {
            if (X <= se && se < J && X <= ce && ce < J) {
              var ue = Math.floor((se - X) / K), we = Math.floor((ce - X) / K);
              return R.isDark(we, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(K, Q, G) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var X = R.getModuleCount() * K + Q * 2, J = "";
          return J += "<img", J += ' src="', J += R.createDataURL(K, Q), J += '"', J += ' width="', J += X, J += '"', J += ' height="', J += X, J += '"', G && (J += ' alt="', J += Ot(G), J += '"'), J += "/>", J;
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
        }, zr = function(K) {
          var Q = 1;
          K = typeof K > "u" ? Q * 2 : K;
          var G = R.getModuleCount() * Q + K * 2, X = K, J = G - K, se, ce, ue, we, Ce, he = {
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
              Ce = "█", X <= ce && ce < J && X <= se && se < J && R.isDark(ue, Math.floor((ce - X) / Q)) && (Ce = " "), X <= ce && ce < J && X <= se + 1 && se + 1 < J && R.isDark(we, Math.floor((ce - X) / Q)) ? Ce += " " : Ce += "█", We += K < 1 && se + 1 >= J ? Fe[Ce] : he[Ce];
            We += `
`;
          }
          return G % 2 && K > 0 ? We.substring(0, We.length - G - 1) + Array(G + 1).join("▀") : We.substring(0, We.length - 1);
        };
        return R.createASCII = function(K, Q) {
          if (K = K || 1, K < 2)
            return zr(Q);
          K -= 1, Q = typeof Q > "u" ? K * 2 : Q;
          var G = R.getModuleCount() * K + Q * 2, X = Q, J = G - Q, se, ce, ue, we, Ce = Array(K + 1).join("██"), he = Array(K + 1).join("  "), Fe = "", We = "";
          for (se = 0; se < G; se += 1) {
            for (ue = Math.floor((se - X) / K), We = "", ce = 0; ce < G; ce += 1)
              we = 1, X <= ce && ce < J && X <= se && se < J && R.isDark(ue, Math.floor((ce - X) / K)) && (we = 0), We += we ? Ce : he;
            for (ue = 0; ue < K; ue += 1)
              Fe += We + `
`;
          }
          return Fe.substring(0, Fe.length - 1);
        }, R.renderTo2dContext = function(K, Q) {
          Q = Q || 2;
          for (var G = R.getModuleCount(), X = 0; X < G; X++)
            for (var J = 0; J < G; J++)
              K.fillStyle = R.isDark(X, J) ? "black" : "white", K.fillRect(X * Q, J * Q, Q, Q);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(_) {
          for (var z = [], H = 0; H < _.length; H += 1) {
            var P = _.charCodeAt(H);
            z.push(P & 255);
          }
          return z;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(_, z) {
        var H = (function() {
          for (var S = C(_), O = function() {
            var le = S.read();
            if (le == -1) throw "eof";
            return le;
          }, w = 0, g = {}; ; ) {
            var M = S.read();
            if (M == -1) break;
            var I = O(), R = O(), D = O(), Z = String.fromCharCode(M << 8 | I), ae = R << 8 | D;
            g[Z] = ae, w += 1;
          }
          if (w != z)
            throw w + " != " + z;
          return g;
        })(), P = 63;
        return function(S) {
          for (var O = [], w = 0; w < S.length; w += 1) {
            var g = S.charCodeAt(w);
            if (g < 128)
              O.push(g);
            else {
              var M = H[S.charAt(w)];
              typeof M == "number" ? (M & 255) == M ? O.push(M) : (O.push(M >>> 8), O.push(M & 255)) : O.push(P);
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
        var _ = [
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
        ], z = 1335, H = 7973, P = 21522, S = {}, O = function(w) {
          for (var g = 0; w != 0; )
            g += 1, w >>>= 1;
          return g;
        };
        return S.getBCHTypeInfo = function(w) {
          for (var g = w << 10; O(g) - O(z) >= 0; )
            g ^= z << O(g) - O(z);
          return (w << 10 | g) ^ P;
        }, S.getBCHTypeNumber = function(w) {
          for (var g = w << 12; O(g) - O(H) >= 0; )
            g ^= H << O(g) - O(H);
          return w << 12 | g;
        }, S.getPatternPosition = function(w) {
          return _[w - 1];
        }, S.getMaskFunction = function(w) {
          switch (w) {
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
              throw "bad maskPattern:" + w;
          }
        }, S.getErrorCorrectPolynomial = function(w) {
          for (var g = c([1], 0), M = 0; M < w; M += 1)
            g = g.multiply(c([1, r.gexp(M)], 0));
          return g;
        }, S.getLengthInBits = function(w, g) {
          if (1 <= g && g < 10)
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
          else if (g < 27)
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
          else if (g < 41)
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
            throw "type:" + g;
        }, S.getLostPoint = function(w) {
          for (var g = w.getModuleCount(), M = 0, I = 0; I < g; I += 1)
            for (var R = 0; R < g; R += 1) {
              for (var D = 0, Z = w.isDark(I, R), ae = -1; ae <= 1; ae += 1)
                if (!(I + ae < 0 || g <= I + ae))
                  for (var le = -1; le <= 1; le += 1)
                    R + le < 0 || g <= R + le || ae == 0 && le == 0 || Z == w.isDark(I + ae, R + le) && (D += 1);
              D > 5 && (M += 3 + D - 5);
            }
          for (var I = 0; I < g - 1; I += 1)
            for (var R = 0; R < g - 1; R += 1) {
              var ge = 0;
              w.isDark(I, R) && (ge += 1), w.isDark(I + 1, R) && (ge += 1), w.isDark(I, R + 1) && (ge += 1), w.isDark(I + 1, R + 1) && (ge += 1), (ge == 0 || ge == 4) && (M += 3);
            }
          for (var I = 0; I < g; I += 1)
            for (var R = 0; R < g - 6; R += 1)
              w.isDark(I, R) && !w.isDark(I, R + 1) && w.isDark(I, R + 2) && w.isDark(I, R + 3) && w.isDark(I, R + 4) && !w.isDark(I, R + 5) && w.isDark(I, R + 6) && (M += 40);
          for (var R = 0; R < g; R += 1)
            for (var I = 0; I < g - 6; I += 1)
              w.isDark(I, R) && !w.isDark(I + 1, R) && w.isDark(I + 2, R) && w.isDark(I + 3, R) && w.isDark(I + 4, R) && !w.isDark(I + 5, R) && w.isDark(I + 6, R) && (M += 40);
          for (var Ae = 0, R = 0; R < g; R += 1)
            for (var I = 0; I < g; I += 1)
              w.isDark(I, R) && (Ae += 1);
          var oe = Math.abs(100 * Ae / g / g - 50) / 5;
          return M += oe * 10, M;
        }, S;
      })(), r = (function() {
        for (var _ = new Array(256), z = new Array(256), H = 0; H < 8; H += 1)
          _[H] = 1 << H;
        for (var H = 8; H < 256; H += 1)
          _[H] = _[H - 4] ^ _[H - 5] ^ _[H - 6] ^ _[H - 8];
        for (var H = 0; H < 255; H += 1)
          z[_[H]] = H;
        var P = {};
        return P.glog = function(S) {
          if (S < 1)
            throw "glog(" + S + ")";
          return z[S];
        }, P.gexp = function(S) {
          for (; S < 0; )
            S += 255;
          for (; S >= 256; )
            S -= 255;
          return _[S];
        }, P;
      })();
      function c(_, z) {
        if (typeof _.length > "u")
          throw _.length + "/" + z;
        var H = (function() {
          for (var S = 0; S < _.length && _[S] == 0; )
            S += 1;
          for (var O = new Array(_.length - S + z), w = 0; w < _.length - S; w += 1)
            O[w] = _[w + S];
          return O;
        })(), P = {};
        return P.getAt = function(S) {
          return H[S];
        }, P.getLength = function() {
          return H.length;
        }, P.multiply = function(S) {
          for (var O = new Array(P.getLength() + S.getLength() - 1), w = 0; w < P.getLength(); w += 1)
            for (var g = 0; g < S.getLength(); g += 1)
              O[w + g] ^= r.gexp(r.glog(P.getAt(w)) + r.glog(S.getAt(g)));
          return c(O, 0);
        }, P.mod = function(S) {
          if (P.getLength() - S.getLength() < 0)
            return P;
          for (var O = r.glog(P.getAt(0)) - r.glog(S.getAt(0)), w = new Array(P.getLength()), g = 0; g < P.getLength(); g += 1)
            w[g] = P.getAt(g);
          for (var g = 0; g < S.getLength(); g += 1)
            w[g] ^= r.gexp(r.glog(S.getAt(g)) + O);
          return c(w, 0).mod(S);
        }, P;
      }
      var d = (function() {
        var _ = [
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
        ], z = function(S, O) {
          var w = {};
          return w.totalCount = S, w.dataCount = O, w;
        }, H = {}, P = function(S, O) {
          switch (O) {
            case o.L:
              return _[(S - 1) * 4 + 0];
            case o.M:
              return _[(S - 1) * 4 + 1];
            case o.Q:
              return _[(S - 1) * 4 + 2];
            case o.H:
              return _[(S - 1) * 4 + 3];
            default:
              return;
          }
        };
        return H.getRSBlocks = function(S, O) {
          var w = P(S, O);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + S + "/errorCorrectionLevel:" + O;
          for (var g = w.length / 3, M = [], I = 0; I < g; I += 1)
            for (var R = w[I * 3 + 0], D = w[I * 3 + 1], Z = w[I * 3 + 2], ae = 0; ae < R; ae += 1)
              M.push(z(D, Z));
          return M;
        }, H;
      })(), h = function() {
        var _ = [], z = 0, H = {};
        return H.getBuffer = function() {
          return _;
        }, H.getAt = function(P) {
          var S = Math.floor(P / 8);
          return (_[S] >>> 7 - P % 8 & 1) == 1;
        }, H.put = function(P, S) {
          for (var O = 0; O < S; O += 1)
            H.putBit((P >>> S - O - 1 & 1) == 1);
        }, H.getLengthInBits = function() {
          return z;
        }, H.putBit = function(P) {
          var S = Math.floor(z / 8);
          _.length <= S && _.push(0), P && (_[S] |= 128 >>> z % 8), z += 1;
        }, H;
      }, p = function(_) {
        var z = s.MODE_NUMBER, H = _, P = {};
        P.getMode = function() {
          return z;
        }, P.getLength = function(w) {
          return H.length;
        }, P.write = function(w) {
          for (var g = H, M = 0; M + 2 < g.length; )
            w.put(S(g.substring(M, M + 3)), 10), M += 3;
          M < g.length && (g.length - M == 1 ? w.put(S(g.substring(M, M + 1)), 4) : g.length - M == 2 && w.put(S(g.substring(M, M + 2)), 7));
        };
        var S = function(w) {
          for (var g = 0, M = 0; M < w.length; M += 1)
            g = g * 10 + O(w.charAt(M));
          return g;
        }, O = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return P;
      }, y = function(_) {
        var z = s.MODE_ALPHA_NUM, H = _, P = {};
        P.getMode = function() {
          return z;
        }, P.getLength = function(O) {
          return H.length;
        }, P.write = function(O) {
          for (var w = H, g = 0; g + 1 < w.length; )
            O.put(
              S(w.charAt(g)) * 45 + S(w.charAt(g + 1)),
              11
            ), g += 2;
          g < w.length && O.put(S(w.charAt(g)), 6);
        };
        var S = function(O) {
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
        return P;
      }, k = function(_) {
        var z = s.MODE_8BIT_BYTE, H = a.stringToBytes(_), P = {};
        return P.getMode = function() {
          return z;
        }, P.getLength = function(S) {
          return H.length;
        }, P.write = function(S) {
          for (var O = 0; O < H.length; O += 1)
            S.put(H[O], 8);
        }, P;
      }, B = function(_) {
        var z = s.MODE_KANJI, H = a.stringToBytesFuncs.SJIS;
        if (!H)
          throw "sjis not supported.";
        (function(O, w) {
          var g = H(O);
          if (g.length != 2 || (g[0] << 8 | g[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var P = H(_), S = {};
        return S.getMode = function() {
          return z;
        }, S.getLength = function(O) {
          return ~~(P.length / 2);
        }, S.write = function(O) {
          for (var w = P, g = 0; g + 1 < w.length; ) {
            var M = (255 & w[g]) << 8 | 255 & w[g + 1];
            if (33088 <= M && M <= 40956)
              M -= 33088;
            else if (57408 <= M && M <= 60351)
              M -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + M;
            M = (M >>> 8 & 255) * 192 + (M & 255), O.put(M, 13), g += 2;
          }
          if (g < w.length)
            throw "illegal char at " + (g + 1);
        }, S;
      }, x = function() {
        var _ = [], z = {};
        return z.writeByte = function(H) {
          _.push(H & 255);
        }, z.writeShort = function(H) {
          z.writeByte(H), z.writeByte(H >>> 8);
        }, z.writeBytes = function(H, P, S) {
          P = P || 0, S = S || H.length;
          for (var O = 0; O < S; O += 1)
            z.writeByte(H[O + P]);
        }, z.writeString = function(H) {
          for (var P = 0; P < H.length; P += 1)
            z.writeByte(H.charCodeAt(P));
        }, z.toByteArray = function() {
          return _;
        }, z.toString = function() {
          var H = "";
          H += "[";
          for (var P = 0; P < _.length; P += 1)
            P > 0 && (H += ","), H += _[P];
          return H += "]", H;
        }, z;
      }, $ = function() {
        var _ = 0, z = 0, H = 0, P = "", S = {}, O = function(g) {
          P += String.fromCharCode(w(g & 63));
        }, w = function(g) {
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
        return S.writeByte = function(g) {
          for (_ = _ << 8 | g & 255, z += 8, H += 1; z >= 6; )
            O(_ >>> z - 6), z -= 6;
        }, S.flush = function() {
          if (z > 0 && (O(_ << 6 - z), _ = 0, z = 0), H % 3 != 0)
            for (var g = 3 - H % 3, M = 0; M < g; M += 1)
              P += "=";
        }, S.toString = function() {
          return P;
        }, S;
      }, C = function(_) {
        var z = _, H = 0, P = 0, S = 0, O = {};
        O.read = function() {
          for (; S < 8; ) {
            if (H >= z.length) {
              if (S == 0)
                return -1;
              throw "unexpected end of file./" + S;
            }
            var g = z.charAt(H);
            if (H += 1, g == "=")
              return S = 0, -1;
            if (g.match(/^\s$/))
              continue;
            P = P << 6 | w(g.charCodeAt(0)), S += 6;
          }
          var M = P >>> S - 8 & 255;
          return S -= 8, M;
        };
        var w = function(g) {
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
      }, N = function(_, z) {
        var H = _, P = z, S = new Array(_ * z), O = {};
        O.setPixel = function(I, R, D) {
          S[R * H + I] = D;
        }, O.write = function(I) {
          I.writeString("GIF87a"), I.writeShort(H), I.writeShort(P), I.writeByte(128), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(255), I.writeByte(255), I.writeByte(255), I.writeString(","), I.writeShort(0), I.writeShort(0), I.writeShort(H), I.writeShort(P), I.writeByte(0);
          var R = 2, D = g(R);
          I.writeByte(R);
          for (var Z = 0; D.length - Z > 255; )
            I.writeByte(255), I.writeBytes(D, Z, 255), Z += 255;
          I.writeByte(D.length - Z), I.writeBytes(D, Z, D.length - Z), I.writeByte(0), I.writeString(";");
        };
        var w = function(I) {
          var R = I, D = 0, Z = 0, ae = {};
          return ae.write = function(le, ge) {
            if (le >>> ge)
              throw "length over";
            for (; D + ge >= 8; )
              R.writeByte(255 & (le << D | Z)), ge -= 8 - D, le >>>= 8 - D, Z = 0, D = 0;
            Z = le << D | Z, D = D + ge;
          }, ae.flush = function() {
            D > 0 && R.writeByte(Z);
          }, ae;
        }, g = function(I) {
          for (var R = 1 << I, D = (1 << I) + 1, Z = I + 1, ae = M(), le = 0; le < R; le += 1)
            ae.add(String.fromCharCode(le));
          ae.add(String.fromCharCode(R)), ae.add(String.fromCharCode(D));
          var ge = x(), Ae = w(ge);
          Ae.write(R, Z);
          var oe = 0, ee = String.fromCharCode(S[oe]);
          for (oe += 1; oe < S.length; ) {
            var te = String.fromCharCode(S[oe]);
            oe += 1, ae.contains(ee + te) ? ee = ee + te : (Ae.write(ae.indexOf(ee), Z), ae.size() < 4095 && (ae.size() == 1 << Z && (Z += 1), ae.add(ee + te)), ee = te);
          }
          return Ae.write(ae.indexOf(ee), Z), Ae.write(D, Z), Ae.flush(), ge.toByteArray();
        }, M = function() {
          var I = {}, R = 0, D = {};
          return D.add = function(Z) {
            if (D.contains(Z))
              throw "dup key:" + Z;
            I[Z] = R, R += 1;
          }, D.size = function() {
            return R;
          }, D.indexOf = function(Z) {
            return I[Z];
          }, D.contains = function(Z) {
            return typeof I[Z] < "u";
          }, D;
        };
        return O;
      }, q = function(_, z, H) {
        for (var P = N(_, z), S = 0; S < z; S += 1)
          for (var O = 0; O < _; O += 1)
            P.setPixel(O, S, H(O, S));
        var w = x();
        P.write(w);
        for (var g = $(), M = w.toByteArray(), I = 0; I < M.length; I += 1)
          g.writeByte(M[I]);
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
var pS = mS();
const gS = /* @__PURE__ */ hS(pS), vS = ["width", "height", "viewBox"], yS = ["width", "height"], bS = ["d"], kS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = E(() => {
      const a = gS(0, "M");
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
      }, null, 8, yS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, bS)
    ], 8, vS));
  }
}, lC = /* @__PURE__ */ U(kS, [["__scopeId", "data-v-489f0852"]]), wS = {
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
}, iC = /* @__PURE__ */ U(wS, [["__scopeId", "data-v-47e67f04"]]);
function rC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const uC = su(() => import("./VoiceFigure-BIYdFzGl.js").then((e) => e.V)), cC = "1.2.0", dC = "3.5";
export {
  Tf as $,
  Ee as A,
  Te as B,
  ya as C,
  ut as D,
  d_ as E,
  x$ as F,
  tM as G,
  i_ as H,
  a$ as I,
  O$ as J,
  At as K,
  MS as L,
  so as M,
  N$ as N,
  A$ as O,
  va as P,
  CM as Q,
  R6 as R,
  Gn as S,
  IM as T,
  _6 as U,
  Oe as V,
  sa as W,
  M6 as X,
  S6 as Y,
  Of as Z,
  U as _,
  g6 as a,
  YM as a$,
  R$ as a0,
  L6 as a1,
  N6 as a2,
  qe as a3,
  V6 as a4,
  G6 as a5,
  _t as a6,
  q6 as a7,
  oM as a8,
  o6 as a9,
  FM as aA,
  SM as aB,
  G5 as aC,
  uM as aD,
  cM as aE,
  f_ as aF,
  _r as aG,
  TM as aH,
  xn as aI,
  d6 as aJ,
  r6 as aK,
  t_ as aL,
  Sn as aM,
  o_ as aN,
  eM as aO,
  MM as aP,
  _M as aQ,
  xM as aR,
  hn as aS,
  xt as aT,
  l6 as aU,
  N2 as aV,
  wM as aW,
  I6 as aX,
  Sr as aY,
  Wt as aZ,
  Kt as a_,
  QM as aa,
  a_ as ab,
  m6 as ac,
  C6 as ad,
  E6 as ae,
  z6 as af,
  U6 as ag,
  K6 as ah,
  k6 as ai,
  bl as aj,
  D6 as ak,
  sM as al,
  g_ as am,
  vM as an,
  pM as ao,
  mM as ap,
  Y6 as aq,
  W6 as ar,
  F6 as as,
  H6 as at,
  OM as au,
  aM as av,
  lM as aw,
  b_ as ax,
  tn as ay,
  iM as az,
  V$ as b,
  y_ as b$,
  b$ as b0,
  s_ as b1,
  LM as b2,
  RM as b3,
  l5 as b4,
  dr as b5,
  GM as b6,
  nM as b7,
  wa as b8,
  ht as b9,
  qM as bA,
  HM as bB,
  gt as bC,
  BM as bD,
  zM as bE,
  rM as bF,
  yM as bG,
  dM as bH,
  Re as bI,
  Z6 as bJ,
  UM as bK,
  C_ as bL,
  E_ as bM,
  a6 as bN,
  P2 as bO,
  X6 as bP,
  DM as bQ,
  v6 as bR,
  p_ as bS,
  NM as bT,
  PM as bU,
  jM as bV,
  Q6 as bW,
  V5 as bX,
  J6 as bY,
  hM as bZ,
  m_ as b_,
  WM as ba,
  za as bb,
  Mi as bc,
  w_ as bd,
  S_ as be,
  AM as bf,
  e_ as bg,
  s6 as bh,
  gM as bi,
  $_ as bj,
  P6 as bk,
  j6 as bl,
  $6 as bm,
  B6 as bn,
  c6 as bo,
  JM as bp,
  y6 as bq,
  b6 as br,
  x6 as bs,
  kM as bt,
  T2 as bu,
  l_ as bv,
  E$ as bw,
  w6 as bx,
  f6 as by,
  bM as bz,
  o5 as c,
  qS as c$,
  u6 as c0,
  i6 as c1,
  fM as c2,
  M_ as c3,
  uo as c4,
  __ as c5,
  Fr as c6,
  ZM as c7,
  O6 as c8,
  A6 as c9,
  xS as cA,
  Vt as cB,
  Dd as cC,
  aC as cD,
  tC as cE,
  re as cF,
  si as cG,
  z_ as cH,
  RS as cI,
  cC as cJ,
  dC as cK,
  GS as cL,
  G_ as cM,
  bs as cN,
  JS as cO,
  Ow as cP,
  ze as cQ,
  St as cR,
  ha as cS,
  FS as cT,
  VS as cU,
  kc as cV,
  dw as cW,
  na as cX,
  Z_ as cY,
  LS as cZ,
  NS as c_,
  L2 as ca,
  h6 as cb,
  _$ as cc,
  $M as cd,
  to as ce,
  F5 as cf,
  EM as cg,
  nn as ch,
  Dt as ci,
  DS as cj,
  jS as ck,
  H_ as cl,
  pe as cm,
  hf as cn,
  Fs as co,
  ma as cp,
  Bv as cq,
  pa as cr,
  eC as cs,
  n6 as ct,
  PS as cu,
  Nv as cv,
  Li as cw,
  ln as cx,
  Xs as cy,
  A_ as cz,
  Ve as d,
  Cp as d$,
  HS as d0,
  nC as d1,
  lC as d2,
  Di as d3,
  Yc as d4,
  F_ as d5,
  e0 as d6,
  OS as d7,
  e6 as d8,
  P4 as d9,
  jo as dA,
  Vs as dB,
  fd as dC,
  X_ as dD,
  Q_ as dE,
  Ns as dF,
  dd as dG,
  Rs as dH,
  xm as dI,
  J_ as dJ,
  t6 as dK,
  Vk as dL,
  ZS as dM,
  XS as dN,
  I_ as dO,
  am as dP,
  O_ as dQ,
  ES as dR,
  K_ as dS,
  Sw as dT,
  u4 as dU,
  Yi as dV,
  IS as dW,
  US as dX,
  L_ as dY,
  q_ as dZ,
  Ne as d_,
  jt as da,
  KS as db,
  Ke as dc,
  yt as dd,
  Hg as de,
  ad as df,
  Am as dg,
  QS as dh,
  TS as di,
  Ut as dj,
  U_ as dk,
  T3 as dl,
  sC as dm,
  oC as dn,
  kn as dp,
  jd as dq,
  st as dr,
  YS as ds,
  et as dt,
  uC as du,
  iC as dv,
  Ks as dw,
  N_ as dx,
  Ts as dy,
  Mp as dz,
  T6 as e,
  WS as e0,
  $c as e1,
  T_ as e2,
  Zi as e3,
  R_ as e4,
  Nl as e5,
  zS as e6,
  AS as e7,
  CS as e8,
  rn as e9,
  Jl as ea,
  hd as eb,
  BS as ec,
  pt as ed,
  rC as ee,
  c4 as ef,
  SS as eg,
  _S as eh,
  B_ as ei,
  W_ as ej,
  Bi as ek,
  V_ as el,
  er as em,
  Kl as en,
  K4 as eo,
  Is as ep,
  D_ as eq,
  ss as er,
  P_ as es,
  j_ as et,
  Ye as eu,
  Y_ as ev,
  Qn as ew,
  O2 as f,
  k_ as g,
  mn as h,
  r_ as i,
  x_ as j,
  u_ as k,
  XM as l,
  J$ as m,
  oo as n,
  n_ as o,
  p6 as p,
  c_ as q,
  Pr as r,
  jr as s,
  Me as t,
  r5 as u,
  VM as v,
  v_ as w,
  KM as x,
  _n as y,
  h_ as z
};
