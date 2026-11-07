/* @code-commandments-generated */
import { openBlock as u, createElementBlock as f, normalizeStyle as be, unref as I, renderSlot as me, createElementVNode as m, normalizeClass as Y, Fragment as N, renderList as ne, defineComponent as Hr, Comment as zr, h as ra, cloneVNode as Ur, createBlock as W, withCtx as j, createVNode as A, toDisplayString as y, createCommentVNode as w, ref as x, onMounted as _e, onBeforeUnmount as Ve, reactive as Ht, shallowRef as Xe, watch as ve, onUnmounted as Re, inject as Ee, useAttrs as ua, computed as M, resolveDynamicComponent as yt, mergeProps as qe, useId as _s, resolveDirective as Gr, withDirectives as Je, createTextVNode as te, Teleport as ca, nextTick as Pe, Transition as zt, withModifiers as xe, createApp as Vr, shallowReactive as Kr, withKeys as Mt, onScopeDispose as da, useModel as sn, mergeModels as Dt, vModelText as Kn, resolveComponent as Yr, provide as Al, onErrorCaptured as Qr, TransitionGroup as Ms, isRef as uo, getCurrentInstance as Xr, getCurrentScope as Ol, toHandlers as Jr, createSlots as Zr, vShow as Tl, useSlots as eu, normalizeProps as tu, guardReactiveProps as nu, defineAsyncComponent as au } from "vue";
function Il(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, su = 1600, ou = {
  __name: "Shimmer",
  setup(e) {
    const t = Il(su);
    return (n, a) => (u(), f("span", {
      class: "shimmer",
      style: be(I(t))
    }, null, 4));
  }
}, Jt = /* @__PURE__ */ z(ou, [["__scopeId", "data-v-6c018b03"]]), lu = { class: "skeleton-line" }, iu = 2e3, ru = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Il(iu);
    return (n, a) => (u(), f("span", lu, [
      me(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (u(!0), f(N, null, ne(e.bars, (s) => (u(), f("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: be({ ...I(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, bt = /* @__PURE__ */ z(ru, [["__scopeId", "data-v-484fe8a0"]]), Ut = Hr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== zr);
      return a.length !== 1 ? ra(N, { key: n }, a) : a[0].key == null ? Ur(a[0], { key: n }) : a[0];
    };
  }
}), uu = ["aria-label"], cu = ["aria-label"], du = ["aria-label"], fu = ["aria-label"], hu = ["aria-label"], mu = ["aria-label"], pu = ["aria-label"], vu = {
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
      messages: j(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(), f(N, null, ne(t, (d) => A(Jt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: be({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, uu)
      ]),
      older: j(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(N, null, ne(t.slice(0, 3), (d) => (u(), W(Jt, {
            key: d.id,
            class: Y(["skeleton-message", { mine: d.mine }]),
            style: be({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, cu)
      ]),
      cards: j(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(N, null, ne(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (u(), f(N, null, ne(n, (h) => A(bt, {
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
          (u(!0), f(N, null, ne(e.count, (d) => (u(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            A(bt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (u(), f(N, null, ne(s, (h) => A(bt, {
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
          A(bt, {
            class: "skeleton-heading",
            bars: i
          }),
          (u(!0), f(N, null, ne(e.count, (d) => (u(), W(bt, {
            key: d,
            bars: I(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, hu)
      ]),
      text: j(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(N, null, ne(e.count, (d) => (u(), W(bt, {
            key: d,
            bars: I(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, mu)
      ]),
      default: j(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (u(!0), f(N, null, ne(e.count, (d) => (u(), W(bt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, pu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ke = /* @__PURE__ */ z(vu, [["__scopeId", "data-v-ef519c5f"]]), gu = {
  key: 1,
  class: "empty-state titled"
}, yu = { class: "empty-state-title" }, bu = { class: "empty-state-text" }, ku = {
  key: 2,
  class: "empty-state"
}, wu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (u(), W(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (u(), f("div", gu, [
      m("p", yu, y(e.title), 1),
      m("p", bu, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (u(), f("p", ku, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, on = /* @__PURE__ */ z(wu, [["__scopeId", "data-v-b27e89b0"]]), $u = { class: "fold-group" }, xu = ["aria-expanded"], Su = { class: "fold-label" }, _u = {
  key: 0,
  class: "fold-count"
}, Mu = {
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
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Su, y(e.label), 1),
        e.count !== "" ? (u(), f("span", _u, y(e.count), 1)) : w("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, xu),
      e.open ? me(a.$slots, "default", {}, void 0, !0, 0) : w("", !0)
    ]));
  }
}, rS = /* @__PURE__ */ z(Mu, [["__scopeId", "data-v-9ef1865c"]]), Cu = 150, Eu = () => Cu;
function Cs(e, t, n = Eu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Au(e, t, n) {
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
const Ou = 50, co = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function uS(e) {
  const t = ze().sources.find((n) => n.key === e);
  return t ? ns(t.read, t.events) : ns("", []);
}
function Rl(e, t, n, a, s = () => !1) {
  const o = x([]), l = x(null), i = x(""), r = x(!1), c = performance.now(), d = x(!1), h = x(""), p = x(null), g = /* @__PURE__ */ new Set();
  let b = null;
  function S(v) {
    return s() ? (g.add(v), b ?? (b = new Promise((T) => setTimeout(() => T(O()), Ou)))) : C(v);
  }
  async function O() {
    const v = new Set(g);
    g.clear(), b = null;
    const T = F, E = await t({ ids: [...v].join(","), limit: v.size });
    if (T !== F) return;
    if (!E.ok) return L();
    const B = new Map(E.value.rows.map((q) => [q.id, q]));
    o.value = o.value.flatMap((q) => v.has(q.id) ? B.has(q.id) ? [B.get(q.id)] : [] : [q]);
  }
  async function C(v) {
    const T = F, E = await t({ "before-id": v + 1, limit: 1 });
    if (T !== F) return;
    if (!E.ok) return L();
    const B = E.value.rows.find((q) => q.id === v);
    o.value = B ? o.value.map((q) => q.id === v ? B : q) : o.value.filter((q) => q.id !== v);
  }
  async function D(v) {
    if (a() && String((v == null ? void 0 : v.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((H) => H.id !== v.row_id));
    if (a() && (v != null && v.row_id) && !String(v.event ?? "").endsWith(".create") && o.value.some((H) => H.id === v.row_id)) return S(v.row_id);
    if (!(a() && o.value.length && String((v == null ? void 0 : v.event) ?? "").endsWith(".create"))) return L();
    const E = Math.max(...o.value.map((H) => H.id)), B = F, q = await t({ "after-id": E });
    if (B !== F) return;
    if (!q.ok) return L();
    const J = new Set(o.value.map((H) => H.id));
    o.value = [...q.value.rows.filter((H) => !J.has(H.id)), ...o.value];
  }
  async function U() {
    if (!d.value || !o.value.length) return !1;
    const v = F, T = Math.min(...o.value.map((q) => q.id)), E = await t({ "before-id": T });
    if (v !== F) return !1;
    if (!E.ok || !E.value.rows.length) return d.value = !1;
    d.value = co(E.value, n());
    const B = new Set(o.value.map((q) => q.id));
    return o.value = [...o.value, ...E.value.rows.filter((q) => !B.has(q.id))], !0;
  }
  let F = 0;
  function R(v, T) {
    var q, J;
    const E = v.ok ? e.shared ? [v.value] : ((q = v.value) == null ? void 0 : q.rows) ?? [] : [];
    v.ok && (o.value = T(E)), l.value = v.ok ? v.value : null;
    const B = E.length ? Math.min(...E.map((H) => H.id)) : 0;
    v.ok && ((J = v.value) != null && J.rows) && !o.value.some((H) => H.id < B) && (d.value = !e.shared && co(v.value, n())), i.value = v.ok ? "" : v.error, Cs(c, () => r.value = !0);
  }
  async function V(v) {
    const T = ++F, E = await t({});
    T === F && R(E, v);
  }
  const P = (v) => {
    if (!a() || !v.length) return v;
    const T = Math.min(...v.map((B) => B.id)), E = Math.max(...v.map((B) => B.id));
    return [...o.value.filter((B) => B.id > E), ...v, ...o.value.filter((B) => B.id < T)];
  }, L = () => V(P), $ = (v) => R(v, P), _ = () => V((v) => v);
  async function k(v, T = null) {
    const E = await Au(T && { target: o, fields: { value: T(o.value) } }, v, e.run);
    return h.value = E.ok ? "" : E.error, p.value = E.ok ? E.value : null, await L(), E;
  }
  return { rows: o, listing: l, failure: i, loaded: r, more: d, load: L, loadLatest: _, older: U, act: k, actionFailure: h, answer: p, context: e, heard: D, showFirst: $, pageSize: n };
}
const Tu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ns(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = ze(), l = Rl(s, (r) => s.read(s.shared && !Object.keys(r).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Tu(r)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Iu = 2e3;
function Es(e, t, n = Iu) {
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
  }), Ve(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", c);
  });
}
const Bl = typeof document < "u" && document.documentElement.classList.contains("phone"), Ll = 120;
var Cl;
const $a = globalThis[Cl = Symbol.for("journal.pressed")] ?? (globalThis[Cl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Ru(e = 0) {
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
function Nl(e = window) {
  if (!as(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    as(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ss = "journal.stale-build-reload", Bu = 'script[type="module"][src*="/assets/index-"]', fo = (e) => {
  var t;
  return ((t = e.querySelector(Bu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Lu(e = document, t = (a, s) => Ce.quietRead(a, s), n = () => Nl(window)) {
  const a = fo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = fo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let xa = "";
function Nu(e, t = () => Nl(window)) {
  if (!e) return !1;
  const n = !!xa && xa !== e;
  return xa = e, n && t(), n;
}
const qu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Du(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ss) === e.message) return !1;
    t.setItem(ss, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Pu(e = window.sessionStorage) {
  try {
    e.removeItem(ss);
  } catch {
    return;
  }
}
const ju = 2e3, Fu = 3e4, Ue = Ht({ starting: !1, external: !1, late: !1, offline: !1 }), As = () => Ue.starting, Wu = 3;
let Cn = 0, os = 0, ql = 0, Dl = [];
async function Hu() {
  try {
    const e = await Ce.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ue.external };
  }
}
let ho = null;
const zu = () => ho ?? (ho = Hu().finally(() => ho = null));
function Uu() {
  clearTimeout(os), clearTimeout(ql), os = 0, Object.assign(Ue, { starting: !1, external: !1, late: !1, offline: !1 }), Dl.splice(0).forEach((e) => e()), Lu();
}
async function Gu() {
  Ue.offline = !navigator.onLine;
  const e = await zu();
  if (Ue.external = e.updating, Cn = !e.restarting && !e.updating && e.reachable ? Cn + 1 : 0, Cn < Wu) return;
  Cn = 0, (!Nu(e.started_at) || as()) && Uu();
}
function Pl() {
  os = setTimeout(async () => {
    await Gu(), Ue.starting && Pl();
  }, ju);
}
function Vu() {
  Ue.starting || (Ue.starting = !0, Ue.offline = !navigator.onLine, Pl(), ql = setTimeout(() => Ue.late = !0, Fu));
}
const jl = () => Ue.starting ? new Promise((e) => Dl.push(e)) : Promise.resolve();
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
function Ku(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Yu {
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
const rt = "viewer.shell", En = 2e4, Qu = 4, mo = "/api/read-lines", Xu = 5e3, Ju = 403, po = "/api/repeated-lines", Zu = 10, ec = 2e3, tc = 3e5, cS = 6e5, An = 6, nc = 500, ac = "/journal/summary", vo = "/api/server-state", sc = 2e4, On = Bl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, oc = (e) => e.split("?")[0].endsWith(ac), ls = (e, t) => Object.assign(new Error(t), { status: e });
async function lc(e, t, n = ls) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const ic = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), rc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), go = (e) => e.split(" ").slice(0, 2).join(" "), nt = "read", It = "write", uc = "stream";
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
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, r]) => o - r < ec));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Zu || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(po, { method: "POST", headers: { ...On, "Content-Type": "application/json" }, body: i }, [{ window: rt, line: po, kind: It }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Ru(n ? Ll : 0);
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
      return await fetch(t, a[0].kind === It ? { ...l, priority: "high" } : l);
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
    return this.out(mo, { headers: On }, [{ window: rt, line: mo, kind: nt }], Xu).then(async (t) => {
      if (t.status === Ju) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ls(t.status, "The read lines did not answer");
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
    const i = a instanceof FormData, r = { method: t, headers: { ...On, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: ic(a) }, c = s || (i ? tc : En);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, r, [{ window: rt, line: n, kind: nt }], c)) : await this.sent(n, r, [{ window: rt, line: n, kind: It }], c);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((h) => setTimeout(h, nc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = An, l = {}) {
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
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: rt, line: t, kind: nt }], En)), !0);
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
    return t !== "GET" ? this.send(t, n, a, s, An, o).then((i) => (this.written(n), i)) : As() && !oc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: rt, line: t, kind: uc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(vo, { cache: "no-store" }, [{ window: rt, line: vo, kind: nt }], sc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = rt, line: s = t, limit: o = En } = {}) {
    const l = (n.method ?? "GET") === "GET" ? nt : It;
    return l === It ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Sa = Symbol.for("journal.transport"), Ce = globalThis[Sa] ?? (globalThis[Sa] = new cc());
class Fl {
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
const dc = 50, fc = "refresh", hc = 1e3, mc = 3e4, pc = "requested", vc = "after_window", gc = 50, Tn = ".*", yc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function bc(e) {
  const t = {}, n = Ht({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let r = {}, c = 0, d = 0, h = !1;
  function p($) {
    const _ = () => r[$] ?? r[`${$.slice(0, $.lastIndexOf("."))}.*`] ?? {}, k = x(void 0), v = Rl(e, async (T) => {
      const E = await S($, T);
      return E.ok && !Object.keys(T).length && (k.value = E.value), E;
    }, () => _().page_size || gc, () => !!_().page_size, () => !!_().reads_ids);
    return t[$] = { ...v, data: k, readAt: 0 };
  }
  const g = new Proxy({}, { get: ($, _) => typeof _ != "string" || _.startsWith("__v") ? void 0 : t[_] ?? p(_) }), b = ($) => (r[$].loading !== pc || $.endsWith(Tn)) && (!r[$].tab || r[$].tab === n.tab);
  function S($, _ = {}) {
    return new Promise((k) => {
      a.push({ name: $, flags: _, resolve: k }), a.length === 1 && setTimeout(O);
    });
  }
  async function O() {
    const $ = /* @__PURE__ */ new Map(), _ = a.splice(0).filter((T) => {
      const E = JSON.stringify(T.flags);
      return $.has(T.name) || $.set(T.name, E), $.get(T.name) === E ? !0 : (a.push(T), !1);
    });
    a.length && setTimeout(O);
    const k = Object.fromEntries(_.flatMap(({ name: T, flags: E }) => Object.entries(E).map(([B, q]) => [`${T}.${B}`, q]))), v = await e.readKeys({ only: [...new Set(_.map(({ name: T }) => T))], state: { ...n, ...k } });
    _.forEach(({ name: T, resolve: E }) => E(v.ok ? v.value.keys[T] : v));
  }
  async function C($) {
    var T;
    const _ = ++d;
    ($.length ? $ : Object.keys(r).filter((E) => !E.endsWith(Tn) && r[E].loading === "first" && b(E))).forEach((E) => l[E] = _);
    const v = await e.readKeys({ only: $, state: { ...n } });
    if (!v.ok) {
      if (v.failure === "cancelled") return !1;
      const E = ($.length ? $ : Object.keys(t)).filter((q) => (l[q] ?? 0) <= _);
      E.forEach((q) => {
        g[q].readAt = Date.now(), v.failure === "unreachable" ? i.add(q) : i.delete(q), g[q].showFirst(v);
      });
      const B = v.failure === "unreachable" && ((T = e.waitForServer) == null ? void 0 : T.call(e));
      return B && B.then(() => {
        if (h) return;
        const q = E.filter((J) => l[J] === _);
        (q.length || !$.length && !E.length && d === _) && C(q);
      }), !1;
    }
    return P(v.value.declared), Object.entries(v.value.keys).forEach(([E, B]) => {
      (l[E] ?? 0) > _ || (l[E] = _, g[E].readAt = Date.now(), i.delete(E), B.ok && (g[E].data.value = B.value), g[E].showFirst(B));
    }), !0;
  }
  function D($) {
    const _ = yc($);
    return _.length ? (_.forEach((k) => o.names.add(k)), o.answer ?? (o.answer = new Promise((k) => setTimeout(() => {
      const v = [...o.names];
      o.names.clear(), o.answer = null, k(C(v));
    })))) : C([]);
  }
  function U($) {
    $.forEach((_) => s.add(_)), clearTimeout(c), c = setTimeout(() => {
      const _ = [...s];
      s.clear(), _.length && C(_);
    }, dc);
  }
  const F = ($) => $.endsWith(Tn) ? Object.keys(t).filter((_) => _.startsWith($.slice(0, -1)) && t[_].readAt) : [$], R = ($) => (r[$] ?? r[`${$.split(".")[0]}.*`]).reload_seconds;
  function V($) {
    const _ = Object.keys(r).filter((v) => $.event === fc || r[v].events.some((T) => Ts(T, $.event)));
    _.filter((v) => r[v].page_size).forEach((v) => g[v].heard($));
    const k = _.filter((v) => !r[v].page_size);
    k.filter((v) => !b(v)).forEach((v) => g[v].readAt = 0), U(k.filter(b).flatMap(F));
  }
  function P($) {
    if (Object.keys(r).length) return;
    r = $;
    const _ = [...new Set(Object.values($).flatMap((v) => v.events))];
    _.length && e.follow(_, V);
    const k = Object.keys($).filter((v) => $[v].loading === vc);
    k.length && C(k);
  }
  ve(() => n.tab, () => {
    const $ = Object.keys(r).filter((_) => !_.endsWith(Tn) && b(_) && !g[_].readAt);
    $.length && C($);
  }), Re(() => {
    h = !0, clearTimeout(c);
  });
  function L() {
    const $ = Date.now(), _ = Object.keys(r).filter((k) => r[k].reload_seconds > 0 && b(k)).flatMap(F).filter((k) => $ - g[k].readAt >= (i.has(k) ? Math.min(R(k) * 1e3, mc) : R(k) * 1e3));
    _.length && U(_);
  }
  return Es(L, () => e.visible.value, hc), queueMicrotask(() => C([])), { props: g, state: n, reload: D, readKey: S };
}
const kc = Symbol("open-view"), De = Symbol.for("journal.window-context"), Wl = Symbol("dock-card");
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
function ze() {
  const e = Ee(De, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return wc(e);
}
const $c = (e, t) => e(Wl, t), dS = () => Ee(Wl), xc = ["data-icon", "stroke-width", "innerHTML"], ge = {
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
    }, null, 12, xc));
  }
}, Sc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: "spinner",
      style: be({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, _c = /* @__PURE__ */ z(Sc, [["__scopeId", "data-v-eb453d6f"]]), Mc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ua(), a = M(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = x(!1), o = M(() => t.busy || s.value), l = Ee(De, null), i = M(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function r(c) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => s.value = !0, Ll);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, d) => (u(), W(yt(e.href ? "a" : "button"), qe(a.value, {
      type: e.href ? void 0 : I(n).type || "button",
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
          e.icon ? (u(), W(ge, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : w("", !0),
          me(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (u(), W(_c, {
          key: 0,
          class: "btn-spinner"
        })) : w("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ z(Mc, [["__scopeId", "data-v-ededdadf"]]), Cc = ["aria-checked", "aria-haspopup", "onClick"], Ec = {
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
    const n = t, a = _s();
    return (s, o) => {
      const l = Gr("tip");
      return u(), f("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (u(!0), f(N, null, ne(e.options, (i) => Je((u(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (r) => n("pick", i.key)
        }, [
          i.dot ? (u(), f("span", Ec)) : w("", !0),
          te(" " + y(i.label) + " ", 1),
          i.note ? (u(), f("small", Ac, y(i.note), 1)) : w("", !0),
          i.count !== void 0 ? (u(), f("em", Oc, y(i.count), 1)) : w("", !0)
        ], 10, Cc)), [
          [l, i.tip || i.title, `${I(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Pt = /* @__PURE__ */ z(Tc, [["__scopeId", "data-v-c89bc92d"]]), Ic = {
  key: 0,
  class: "more-items"
}, Rc = {
  key: 0,
  role: "alert"
}, Bc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (u(), f("div", Ic, [
      e.failure ? (u(), f("p", Rc, y(e.failure), 1)) : w("", !0),
      e.more ? (u(), W(pe, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          te(y(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : w("", !0)
    ])) : w("", !0);
  }
}, vn = /* @__PURE__ */ z(Bc, [["__scopeId", "data-v-10464014"]]), Lc = { class: "link-group" }, Nc = {
  class: "group-label",
  "data-link-kind": ""
}, qc = ["disabled", "onClick"], Dc = { class: "title" }, Pc = { class: "relations" }, jc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(!1), o = M(() => s.value ? n.rows : n.rows.slice(0, 3)), l = M(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), i = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, r = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), c = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (d, h) => (u(), f("div", Lc, [
      m("div", Nc, y(l.value), 1),
      (u(!0), f(N, null, ne(o.value, (p) => (u(), f("button", qe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, r(p), {
        disabled: i(p),
        onClick: (g) => a("open", p)
      }), [
        m("span", Dc, y(p.endpoint.title), 1),
        m("span", Pc, [
          te(y(c(p)), 1),
          i(p) ? (u(), f(N, { key: 0 }, [
            te(" · Unavailable")
          ], 64)) : w("", !0)
        ])
      ], 16, qc))), 128)),
      e.rows.length > 3 && !s.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (p) => s.value = !0)
      }, "Show more")) : w("", !0)
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
    const n = e, a = t, s = x([]), o = x({}), l = x(0), i = x(""), r = x(null), c = x(!1), d = x("");
    let h = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, g = (L) => p[L] || `${L.replaceAll("_", " ").replace(/^./, ($) => $.toUpperCase())}s`, b = M(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((L, $) => L + $, 0) },
      ...Object.entries(o.value).filter(([L]) => !n.onlyKinds.length || n.onlyKinds.includes(L)).map(([L, $]) => ({ key: L, label: g(L), count: $ }))
    ]), S = M(() => {
      const L = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((_) => _.endpoint.model))].map((_) => [_, s.value.filter((k) => k.endpoint.model === _).length])), $ = { doc: 0, task: 1, message: 2 };
      return Object.entries(L).sort(([_], [k]) => ($[_] ?? 3) - ($[k] ?? 3)).map(([_, k]) => ({ model: _, count: k, rows: s.value.filter((v) => v.endpoint.model === _) }));
    }), O = (L) => L.endpoint.unavailable || !L.endpoint.open_ref, C = (L) => ({ [n.linkAttribute]: !0, "data-link-model": L.endpoint.model, "data-link-id": L.endpoint.id }), D = (L) => `${L.endpoint.model === "doc" && L.endpoint.id === n.documentId ? "Design document" : L.endpoint.model.replaceAll("_", " ").replace(/^./, ($) => $.toUpperCase())} ${L.endpoint.id}, ${L.relations.map(($) => $.replaceAll("_", " ")).join(", ")}`;
    async function U(L = 1) {
      const $ = ++h;
      c.value = !0, d.value = "";
      const _ = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(L), "--page-size", String(n.pageSize)];
      n.outsidePlan && _.push("--outside-plan"), n.documentId && _.push("--first-counterpart", `doc:${n.documentId}`), i.value && _.push("--kind", i.value);
      try {
        const k = await n.read(_);
        if ($ !== h) return;
        if (!k.ok) {
          d.value = k.error;
          return;
        }
        const v = k.value.counterparts ?? [], T = L === 1 ? v : [...s.value, ...v];
        s.value = [...new Map(T.map((E) => [`${E.endpoint.model}:${E.endpoint.id}`, E])).values()], o.value = k.value.kinds ?? {}, l.value = k.value.total, r.value = k.value.next_page ?? null;
      } catch (k) {
        $ === h && (d.value = k.message);
      } finally {
        $ === h && (c.value = !1);
      }
    }
    function F(L) {
      if (O(L)) return;
      const [$, _] = L.endpoint.open_ref.split(":");
      a("open", { table: $, id: Number(_) });
    }
    function R(L) {
      i.value = L, U();
    }
    const V = () => !c.value && r.value && U(r.value), P = M(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ve(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], r.value = null, i.value = "", U();
    }, { immediate: !0 }), (L, $) => s.value.length || c.value || d.value || e.empty ? (u(), f("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (u(), W(Pt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: R
      }, null, 8, ["options", "value"])) : w("", !0),
      m("div", Hc, [
        e.grouped ? (u(!0), f(N, { key: 0 }, ne(S.value, (_) => (u(), W(Fc, {
          key: _.model,
          model: _.model,
          count: _.count,
          rows: _.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: F
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (u(!0), f(N, { key: 1 }, ne(s.value, (_) => (u(), f("button", qe({
          key: `${_.endpoint.model}:${_.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, C(_), {
          disabled: O(_),
          onClick: (k) => F(_)
        }), [
          m("span", Uc, y(_.endpoint.title), 1),
          m("span", Gc, [
            te(y(D(_)), 1),
            O(_) ? (u(), f(N, { key: 0 }, [
              te(" · Unavailable")
            ], 64)) : w("", !0)
          ])
        ], 16, zc))), 128)),
        !s.value.length && !c.value && !d.value && e.empty ? (u(), f("p", Vc, y(e.empty), 1)) : w("", !0),
        A(vn, {
          more: !!r.value,
          loading: c.value,
          failure: d.value,
          label: P.value,
          onMore: V
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Wc)) : w("", !0);
  }
}, Yc = /* @__PURE__ */ z(Kc, [["__scopeId", "data-v-29b9c31b"]]), Qc = (e, t, n) => Math.max(t, Math.min(n, e)), Xc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Hl = /* @__PURE__ */ new WeakMap(), Jc = (e, t) => Hl.set(e, t);
function Zc(e, t) {
  for (let n = t; n; n = Hl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function zl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Zc(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const Ot = 8, ed = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = x(null), o = (v) => v ? `${v}px` : void 0, l = M(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = x({ w: 0, h: 0 }), r = x(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (v) => ({
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
      const T = h(a.anchor), E = g(T, v);
      return i.value.w <= E.across && i.value.h <= Math.max(E.below, E.above) ? T : c();
    }
    const S = M(() => {
      if (!r.value) return l.value;
      const v = r.value, T = b(v), E = g(T, v), { w: B, h: q } = i.value, J = a.align === "auto" ? v.left + v.right > T.left + T.right : a.align === "right", H = Qc(J ? v.right - B : v.left, T.left + Ot, Math.max(T.left + Ot, T.right - B - Ot)), ae = q > E.below && E.above > E.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: p(a.maxHeight, E.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: p(a.maxHeight, E.below) };
      return { ...l.value, ...ae, left: `${H}px`, maxWidth: p(a.maxWidth, E.across) };
    }), O = n, C = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function D(v) {
      const T = C(), E = T.indexOf(document.activeElement);
      T[(E + v + T.length) % T.length].focus();
    }
    const U = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => O("close") }, F = (v) => U[v.key] && (v.preventDefault(), U[v.key]()), R = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let V = 0;
    const P = new ResizeObserver(() => {
      cancelAnimationFrame(V), V = requestAnimationFrame(R);
    });
    zl(s, (v) => a.anchor && !a.anchor.contains(v.target) && O("close"));
    const L = (v, T) => ["top", "left", "right", "bottom"].some((E) => Math.abs(v[E] - T[E]) > 1), $ = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let _ = 0;
    function k() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || $(v)) return O("close");
        L(v, r.value) && (r.value = v);
      }
      _ = requestAnimationFrame(k);
    }
    return _e(() => {
      a.anchor && s.value && Jc(s.value, a.anchor), R(), s.value && P.observe(s.value), !a.plain && C()[0] && C()[0].focus(), k();
    }), Re(() => {
      P.disconnect(), cancelAnimationFrame(_), cancelAnimationFrame(V);
    }), t({ element: s }), (v, T) => (u(), W(ca, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", qe({
        ref_key: "panel",
        ref: s
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: S.value,
        onKeydown: F
      }), [
        me(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Is = /* @__PURE__ */ z(ed, [["__scopeId", "data-v-3d203970"]]), td = { class: "split-button" }, nd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = x(null), s = x(!1), o = () => s.value = !1;
    return (l, i) => (u(), f("span", td, [
      A(pe, {
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
            A(ge, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (u(), W(Is, {
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
}, ad = /* @__PURE__ */ z(nd, [["__scopeId", "data-v-c258494d"]]), sd = 0, od = "/api/lines", ld = "/api/line", yo = 5e3, bo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), ko = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), _a = (e) => JSON.stringify(e.line), wo = () => new DOMException("cancelled", "AbortError");
class id {
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
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, It));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ce.whenFree(() => this.send()), sd));
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
      const o = await Ce.sent(od, bo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => ko(i.body, nt)), yo);
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
    await this.alone(t, nt), Date.now() - n < yo ? this.slow.delete(_a(t.body)) : this.slow.add(_a(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ce.sent(ld, bo(t.body, t.signal), [ko(t.body, n)], n === nt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Ul = new id(), rd = "/api/window";
function ud(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${rd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, r = (c) => Ce.whenFree(async () => {
    const d = await Ce.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: nt }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Ce.joined(`${e} ${n.join(",")} ${o}`, r, s);
}
const Gl = /* @__PURE__ */ new Map();
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
function fS(e, t) {
  const n = new cd(e, t);
  return Gl.set(e, n), n.load().catch(() => {
  }), n;
}
const Rs = (e) => Gl.get(e);
function dd(e, t, n) {
  const a = Rs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function fd(e, t) {
  if (!e) return !0;
  const n = Rs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Yn = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Vl = {};
async function hS(e = (t) => Ce.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Vl = (await t.json()).states);
}
const Bs = (e, t) => {
  var n;
  return (n = Vl[e]) == null ? void 0 : n[t];
}, ln = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.label) ?? Yn(t);
}, Kl = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, hd = (e, t) => {
  var n;
  return ((n = Bs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, md = Symbol("pane-page"), Ls = Symbol("inspector-host"), Yl = { 1: "refused", 2: "usage", 3: "fault" }, pd = 100, vd = 50, gd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, yd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function bd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: r = x({}), declared: c = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: g = [], sources: b = [], links: S = {}, search: O = {}, readOnly: C = !1, shared: D = null }) {
  const U = /* @__PURE__ */ new Map(), F = new AbortController(), R = x(!1), V = performance.now();
  let P = 0, L = 0, $ = () => {
  };
  const _ = new Promise((q) => $ = q);
  F.signal.addEventListener("abort", $, { once: !0 });
  const k = () => {
    clearTimeout(L), L = setTimeout(() => {
      P === 0 && Cs(V, () => {
        R.value = !0, $();
      });
    }, vd);
  }, v = (q, J) => (P += 1, Bt(e, q, t, F.signal, J).finally(() => {
    P -= 1, k();
  })), T = (q, J) => (k(), _.then(() => F.signal.aborted ? lt : Bt(e, q, t, F.signal, J))), E = ({ only: q = [], state: J = {} } = {}) => (P += 1, wd(() => ud(e, t, q, J, F.signal), F.signal).finally(() => {
    P -= 1, k();
  })), B = (q, { unbatched: J = !1, deferred: H = !1 } = {}) => {
    const se = U.get(q);
    if (se && performance.now() - se.at < pd) return se.answer;
    const ae = H && !R.value ? T(q, J) : v(q, J);
    return U.set(q, { answer: ae, at: performance.now() }), ae;
  };
  return {
    answered: R,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: M(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: g,
    sources: b,
    links: S,
    search: O,
    readOnly: C,
    shared: D,
    read: B,
    readKeys: E,
    waitForServer: () => As() ? jl() : null,
    run: (q) => Bt(e, q, t, F.signal),
    upload: (q) => xd(q, e, F.signal),
    cancel: () => F.abort(),
    signal: F.signal,
    subscriptions: l,
    follow: (q, J) => l.follow(e, [q].flat().filter((H) => o.some((se) => Ts(se, H))), (H) => {
      U.clear(), J(H);
    }, a),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (q) => M(() => {
      var J;
      return r.value[q] ?? ((J = c.find((H) => H.key === q)) == null ? void 0 : J.default);
    }),
    setting: async (q, J) => {
      const H = await B(`window setting ${e} ${q}`);
      return H.ok ? H.value.value : J;
    },
    setOption: h,
    keep: (q, J) => Bt(e, ["window", "save-setting", e, q, JSON.stringify(J)], t, F.signal)
  };
}
function Ql(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const lt = { ok: !1, failure: "cancelled", error: "" }, Ns = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Xl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? lt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Yl[n.code] || "fault", error: Ql(n.error) };
  } catch {
    return t != null && t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
const kd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Yl[e.code] || "fault", error: Ql(e.error) };
async function wd(e, t) {
  try {
    const n = await e();
    return t.aborted ? lt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, kd(s)])) } };
  } catch {
    return t.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
async function Jl(e, t, n) {
  const a = await Xl(() => Ul.read(e, t, n), t);
  return a.failure !== "unreachable" || !As() ? a : (await jl(), t.aborted ? lt : Jl(e, t, n));
}
function Bt(e, t, n, a = void 0, s = !1) {
  return Ce.held(() => $d(e, t, n, a, s), Ce.knownRead(Array.isArray(t) ? t : qs(t)));
}
async function $d(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : qs(t), environment: n };
  return await Ce.isRead(o.line) ? Ce.joined(JSON.stringify(o), (l, i) => Jl({ ...o, attribution: i }, l, s), a, o).catch(() => lt) : Xl(() => Ul.write({ ...o, attribution: {
    client_id: Ce.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function xd(e, t, n = void 0) {
  try {
    const a = await Ce.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? lt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? lt : { ok: !1, failure: "unreachable", error: Ns };
  }
}
function qs(e) {
  return [...e.matchAll(gd)].map(([t]) => t.replace(yd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Sd = (e) => `show-${e}`, mS = (e, t, n) => e.filter((a) => {
  var s;
  return n(Sd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Zl = "messages.chat", _d = {
  key: 0,
  class: "template-brief"
}, Md = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Cd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x([]), o = x(""), l = M(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = M(() => s.value.find((c) => String(c.id) === n.value));
    async function r() {
      const c = await Bt(Zl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((p) => p.title === d);
      h && a("pick", String(h.id));
    }
    return r(), (c, d) => (u(), f(N, null, [
      A(Pt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (u(), f("p", _d, y(i.value.brief), 1)) : w("", !0),
      o.value ? (u(), f("p", Md, y(o.value), 1)) : w("", !0)
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
    return (t, n) => (u(), f("span", Ad, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(ge, {
          name: "info",
          size: 13
        })
      ], 8, Od),
      m("span", Td, [
        (u(!0), f(N, null, ne(e.lines, (a, s) => (u(), f("span", {
          key: s,
          class: "info-tip-line"
        }, y(a), 1))), 128))
      ])
    ]));
  }
}, ei = /* @__PURE__ */ z(Id, [["__scopeId", "data-v-a2fe5ff1"]]), Rd = { class: "form-field" }, Bd = { class: "form-field-head" }, Ld = ["for"], Nd = {
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
    return (t, n) => (u(), f("div", Rd, [
      m("div", Bd, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, y(e.label), 9, Ld),
        e.help ? (u(), W(ei, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : w("", !0),
        t.$slots.aside ? (u(), f("span", Nd, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Dd = /* @__PURE__ */ z(qd, [["__scopeId", "data-v-302c40bf"]]), is = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Pd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ua(), n = M(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((u(), f("textarea", qe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [I(is), I(t).value]
    ]);
  }
}), jd = /* @__PURE__ */ z(Pd, [["__scopeId", "data-v-e130a5b9"]]), Fd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _s(), o = M(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, i) => (u(), W(Dd, {
      label: e.field.label,
      for: I(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        A(Ut, { value: o.value }, {
          choice: j(() => [
            A(Pt, {
              id: I(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (r) => a("pick", r))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            A(Ed, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (r) => a("pick", r))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            A(jd, {
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
}, fa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (u(), W(pe, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        A(ge, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Wd(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Hd = (e, t = () => !0) => Wd("keydown", (n) => n.key === "Escape" && t() && e());
function ti(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = x(!1), s = M(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Hd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const zd = 80, Tt = Ht([]);
function ni(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return ve(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), M(() => zd + Math.max(0, Tt.indexOf(t)));
}
let ai = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ai = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
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
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : ai, document.addEventListener("keydown", s), Pe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ti(a, n), i = ni(s), r = x(null), c = x(null), d = x(null), h = _s(), p = x(!1), g = Date.now();
    n.modal && Gd(c, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Jd);
    }
    function S(D) {
      !n.modal || Date.now() - g >= Xd || ![" ", "Enter"].includes(D.key) || (D.preventDefault(), D.stopPropagation());
    }
    const O = () => r.value && (r.value.scrollTop = r.value.scrollHeight), C = new MutationObserver(O);
    return ve(r, (D) => {
      C.disconnect(), D && n.follow && (C.observe(D, { childList: !0, subtree: !0, characterData: !0 }), O());
    }), Re(() => C.disconnect()), (D, U) => (u(), W(ca, { to: "body" }, [
      A(zt, {
        name: "dialog",
        appear: "",
        onAfterLeave: I(l)
      }, {
        default: j(() => [
          I(s) ? (u(), f("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: be({ zIndex: I(i) }),
            onClick: xe(b, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? I(h) : void 0,
              onKeydownCapture: S
            }, [
              e.bare ? w("", !0) : (u(), f("header", Kd, [
                m("h3", {
                  id: I(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, y(e.title), 9, Yd),
                e.closable ? (u(), W(fa, {
                  key: 0,
                  onClick: I(o)
                }, null, 8, ["onClick"])) : w("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: r,
                class: Y(["dialog-body", { bare: e.bare }])
              }, [
                me(D.$slots, "default", {}, void 0, !0)
              ], 2),
              D.$slots.foot ? (u(), f("footer", Qd, [
                me(D.$slots, "foot", {}, void 0, !0)
              ])) : w("", !0)
            ], 42, Vd)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ha = /* @__PURE__ */ z(Zd, [["__scopeId", "data-v-6d1ecd98"]]), ef = {
  class: "action-output",
  "data-action-output": ""
}, tf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), W(ha, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        m("pre", ef, y(e.text), 1)
      ]),
      _: 1
    }));
  }
}, nf = /* @__PURE__ */ z(tf, [["__scopeId", "data-v-423a045c"]]);
function af(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Vr(nf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const sf = (e, t, n = {}) => qs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function gn(e, t, n, a = {}) {
  var s;
  try {
    if (!await fd(e.module, n)) return { ok: !1, error: "" };
    const o = await Bt(Zl, sf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && af(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const of = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ma = [
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
}, lf = ["secrets", "plugins"], si = Object.keys(ma).filter((e) => !(Bl && lf.includes(e)));
M(() => si.map((e) => ({ name: e, ...ma[e] })));
const Gt = (e) => ma[e], oi = new Map(si.flatMap((e) => [e, e.replace(/s$/, ""), ma[e].title.toLowerCase()].map((t) => [t, e]))), ht = (e) => oi.get(String(e).toLowerCase()) || "", li = [...oi.keys()].sort((e, t) => t.length - e.length).join("|"), rf = {
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
    const n = e, a = t, s = x(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = x(!1), l = x(""), i = M(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), r = M(() => {
      var h;
      if (!n.row) return n.button.label;
      const d = ((h = Gt(ht(n.row.noun))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const d = await gn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, h) => (u(), W(ha, {
      title: r.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => a("close"))
    }, {
      default: j(() => {
        var p;
        return [
          m("div", rf, [
            (p = e.row) != null && p.title ? (u(), f("p", uf, y(e.row.title), 1)) : w("", !0),
            (u(!0), f(N, null, ne(e.button.fields, (g) => (u(), W(Fd, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (b) => s.value[g.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (u(), f("p", cf, y(l.value), 1)) : w("", !0),
            m("div", df, [
              A(pe, {
                small: "",
                onClick: h[0] || (h[0] = (g) => a("close"))
              }, {
                default: j(() => [...h[2] || (h[2] = [
                  te("Cancel", -1)
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
}, hf = /* @__PURE__ */ z(ff, [["__scopeId", "data-v-f26c27a7"]]), mf = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, pf = {
  key: 1,
  class: "menu-item-text"
}, vf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (u(), f("span", mf, y(e.checked ? "✓" : ""), 1)) : w("", !0),
      e.description ? (u(), f("span", pf, [
        m("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, y(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, jt = /* @__PURE__ */ z(vf, [["__scopeId", "data-v-fec99974"]]), gf = ["aria-busy"], yf = {
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
    const n = e, a = t, s = M(() => Rs(n.environment)), o = M(
      () => {
        var C;
        return !n.readOnly && ((C = s.value) == null ? void 0 : C.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = M(() => {
      var C;
      return !n.readOnly && ((C = s.value) == null ? void 0 : C.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), r = M(() => n.readOnly ? [] : dd(n.environment, n.name, n.row)), c = x(null), d = x(null), h = x(""), p = x(!1), g = (C) => [C.from ? `From ${C.from}` : "", C.tip, C.warning].filter(Boolean).join(" · "), b = (C) => C.icon || (C.warning ? "dot" : "");
    function S(C) {
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
      const D = await gn(C, n.row, n.environment);
      p.value = !1, h.value = D.ok ? "" : D.error;
      const U = C.label.toLowerCase() + (n.objectName && !C.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", D.ok ? "" : `Could not ${U}: ${D.error}`), D.ok && a("done");
    }
    return (C, D) => (u(), f("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (u(), f(N, { key: 0 }, [
        D[5] || (D[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(pe, {
          small: "",
          onClick: i
        }, {
          default: j(() => [...D[4] || (D[4] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (u(), f("span", yf, [
        m("span", bf, y(d.value.confirm), 1),
        A(pe, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: Y({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: D[0] || (D[0] = (U) => O(d.value))
        }, {
          default: j(() => [
            te(y(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(pe, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: D[1] || (D[1] = (U) => d.value = null)
        }, {
          default: j(() => [...D[6] || (D[6] = [
            te("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? w("", !0) : (u(), f(N, { key: 2 }, [
        (u(!0), f(N, null, ne(r.value, (U) => (u(), f(N, {
          key: U.name
        }, [
          U.menu.length ? (u(), W(ad, {
            key: 0,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": U.menu_label || "More ways",
            title: g(U),
            "data-button": U.name,
            onMain: (F) => S(U)
          }, {
            menu: j(({ close: F }) => [
              (u(!0), f(N, null, ne(U.menu, (R) => (u(), W(jt, {
                key: R.label,
                description: R.description,
                onClick: (V) => (F(), S({ ...U, ...R, menu: [] }))
              }, {
                default: j(() => [
                  te(y(R.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              te(y(U.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (u(), W(pe, {
            key: 1,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            bordered: !U.primary,
            class: Y({ danger: U.danger }),
            icon: b(U),
            disabled: p.value,
            title: g(U),
            "data-button": U.name,
            onClick: (F) => S(U)
          }, {
            default: j(() => [
              te(y(U.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (u(), f("span", kf, y(h.value), 1)) : w("", !0),
        c.value && !e.readOnly ? (u(), W(hf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: D[2] || (D[2] = (U) => c.value = null),
          onDone: D[3] || (D[3] = (U) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : w("", !0)
      ], 64))
    ], 10, gf));
  }
}, Ds = /* @__PURE__ */ z(wf, [["__scopeId", "data-v-a4b6f174"]]), $f = {
  class: "running",
  "data-running-command": ""
}, xf = ["title"], Sf = {
  key: "idle",
  class: "running-idle"
}, _f = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (u(), f("span", $f, [
      A(zt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (u(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, y(e.text), 9, xf)) : (u(), f("span", Sf, y(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, pS = /* @__PURE__ */ z(_f, [["__scopeId", "data-v-d3240219"]]), Mf = ["aria-checked", "aria-label", "title"], Cf = {
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
        e.labelled ? (u(), f("span", Cf, y(e.word), 1)) : w("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (u(), f("span", Ef, y(e.word), 1)) : w("", !0)
    ], 10, Mf));
  }
}, vS = /* @__PURE__ */ z(Af, [["__scopeId", "data-v-1bfb90f3"]]);
function ii(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Qn(e, t) {
  return ii(() => localStorage, e, t);
}
function ri(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ps(e, t) {
  return ri(() => localStorage, e, t);
}
function ui(e, t) {
  ve(t, (n) => Ps(e, n), { deep: !0 });
}
function Of(e, t) {
  return ii(() => sessionStorage, e, t);
}
function Tf(e, t) {
  return ri(() => sessionStorage, e, t);
}
const Xn = "journal.environment", ci = x(Of(Xn, Qn(Xn, "")));
function If(e) {
  ci.value = e, Tf(Xn, e), Ps(Xn, e);
}
const Jn = x(location.hash), $o = Xe(null), xo = { integrations: "mcp", library: "team" };
function Rf() {
  if (!$o.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (xo[n]) {
    location.replace(`#/${[xo[n], ...a].join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash;
    return;
  }
  !n || $o.value(n) || (If(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Jn.value = location.hash, Rf();
});
const rs = M(() => {
  const [e, t = ""] = Jn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, r = ""] = l.split("@"), [c = "", d = "", h = ""] = i.split(":");
    return { table: c, id: Number(d), comment: Number(h) || 0, env: r };
  });
  return {
    env: ci.value,
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
function Bf(e = "", t = 0, n = "") {
  location.hash = js.page(e, t, n);
}
function Lf(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Nf = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function di(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Nf).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Nt = {};
function gS(e, t) {
  return Nt[e] = t, () => Nt[e] === t && delete Nt[e];
}
function vt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Nt[e]) != null && l.call(Nt, t))) return;
  const s = rs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  di([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function qf(e, t, n, a = 0, s = "") {
  if (e === rs.value.env) return vt(t, n, a, s);
  const o = rs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  di([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? qf(a, s, Number(o), 0, t) : vt(s, Number(o), 0, t);
}
function Df(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Lt(e) {
  const t = Df(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function yS(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Pf = { class: "inspector-part" }, jf = { class: "inspector-part-title" }, Ff = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("section", Pf, [
      m("h4", jf, y(e.title), 1),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, bS = /* @__PURE__ */ z(Ff, [["__scopeId", "data-v-5175e4a3"]]), So = /* @__PURE__ */ new Map(), Wf = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = x(null), a = x(!1), s = x(t.name && So.get(t.name) || !1);
    function o(r) {
      s.value = r, t.name && So.set(t.name, r);
    }
    const l = () => {
      const r = !!n.value && n.value.scrollHeight > t.at;
      r !== a.value && (a.value = r);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (r, c) => (u(), f(N, null, [
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
      }, y(s.value ? "Show less" : "Show more"), 1)) : w("", !0)
    ], 64));
  }
}, Hf = /* @__PURE__ */ z(Wf, [["__scopeId", "data-v-4d2235ba"]]), zf = ["aria-valuenow", "aria-valuemax"], Uf = {
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
        style: be({ width: n.value })
      }, null, 4)
    ], 10, zf));
  }
}, fi = /* @__PURE__ */ z(Uf, [["__scopeId", "data-v-9eba6a85"]]), Gf = { processes: "process", memories: "memory", replies: "reply" }, Zn = (e) => (Gf[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), us = [], Vf = 2e3, ct = /* @__PURE__ */ new Map(), Kf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Yf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? us.unshift(e) : us.push(e), ct.clear();
}
function hi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Qf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Xf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ot(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Jf(e, t) {
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
  return Zf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Zf(e) {
  return e.split(Yf).map((t, n) => n % 2 ? t : t.replace(Kf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function _o(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const eh = 24;
function th(e) {
  const [t, , ...n] = e, a = _o(t), s = n.map(_o), o = (r) => [a, ...s].some((c) => (c[r] ?? "").length > eh) ? ' class="text-column"' : "", l = a.map((r, c) => `<th${o(c)}>${rn(r)}</th>`).join(""), i = s.map((r) => `<tr>${r.map((c, d) => `<td${o(d)}>${rn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const mi = /^\s*(?:[-*+]|\d+[.)])\s+/, cs = /^\s*(\d+)[.)]\s/, Mo = (e) => e.match(/^\s*/)[0].length;
function pi(e) {
  const t = e[0].match(cs), n = Mo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Mo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${rn(o.text)}${o.nested.length ? pi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function nh(e, t) {
  const n = cs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (mi.test(e[s]) && cs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Co = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function vi(e) {
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
      n.push(th(t.slice(a, i))), a = i;
      continue;
    }
    if (mi.test(s)) {
      const i = nh(t, a);
      n.push(pi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${vi(
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
const ah = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, sh = (e) => e.type !== "text" && !ah.test(e.html);
function oh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(vi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : sh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Fs(e, t = { env: "" }) {
  const n = Xf(e, t), a = ct.get(n);
  if (ct.delete(n), a && a.source === t.source && a.reads.every((l) => Qf(l, t)))
    return ct.set(n, a), a.html;
  const s = [], o = oh(Jf(e, { ...t, reads: s }));
  return ct.set(n, { html: o, reads: s, source: t.source }), ct.size > Vf && ct.delete(ct.keys().next().value), o;
}
const Ca = /* @__PURE__ */ new WeakMap();
function lh(e) {
  if (Ca.has(e)) return Ca.get(e);
  const t = Kr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, d) => `${c}:${d}`;
  function o(c, d) {
    const h = s(c, d), p = e.read(`${Zn(c)} show ${d}`);
    n.set(h, p), p.then((g) => {
      n.get(h) === p && (n.delete(h), t.set(h, g.ok ? { ...g.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${Zn(c).replace(/-/g, "_")}.*`], (d) => {
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
  return Ca.set(e, r), r;
}
function gi() {
  const e = Ee(De, null), t = e ? lh(e) : null;
  return (n, a = {}) => Fs(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const yi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, yn = (e) => String(e || "").replace(yi, (t, n, a, s) => s), ih = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), In = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, rh = /^Traceback \(most recent call last\):/m, uh = 8;
function bi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, uh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function ch(e) {
  const t = [...e.matchAll(ih)].map((a) => a.index);
  if (In.lastIndex = 0, !t.length || !In.test(e)) return null;
  In.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(In)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: bi(n), tail: "" } : null;
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
  return { lead: e.slice(0, t.index), html: bi([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = yn(e), n = dh(t) || ch(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ea = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, ki = (e) => `${e.table}:${e.id}`, Eo = (e) => (e || "").split(`
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
}, fh = (e) => (Oo[e.table] ? Oo[e.table](e) : e.title || "") || "", Ct = (e) => ea(e.created_at), hh = (e) => ea(e.updated_at) || Ct(e), mh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, ph = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function vh(e) {
  const t = mh.exec(e);
  if (t && ht(t[1])) return { at: t.index, length: t[0].length, table: ht(t[1]), id: Number(t[2]), label: t[3] };
  const n = ph.exec(e), a = n && ht(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function gh(e, t, n, a) {
  const s = hi(a, e, t), o = yn(s ? fh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ot(Gt(e).title)} ${t}</span><span class="row-card-title">${ot(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = vh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: gh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const yh = /\.(png|jpe?g|gif|webp|svg)$/i, bh = (e) => yh.test(e), kh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, wh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function $h(e, t) {
  const n = kh.exec(e), [, a, s, o, l, i] = n || [], r = n && ht(a || o), c = r && hi(t, r, Number(s || l));
  if (r !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const d = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Gt(r).title} ${c.id} · ${ot(i)}`, p = bh(i) ? `<img class="file-card-image" src="${d}" alt="${ot(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${ot(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function xh(e) {
  const t = wh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ot(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
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
const To = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${js.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(yi, (n, a, s, o) => To[a] ? To[a](s, o, t) : o)
);
const _h = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, wi = new RegExp(`\\b(${li}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), $i = new RegExp(`\\b(${li}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Mh = new RegExp(`<code>((?:${wi.source}|${$i.source}))</code>`, "gi"), Ch = (e) => e.replace(Mh, "$1"), Eh = (e, t) => `<a class="row-pill" href="#" data-peek="${ht(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Ah = (e) => e.replace($i, (t, n, a) => a.replace(/\d+/g, (s) => Eh(n.replace(/s$/i, ""), s))), Oh = (e) => Ah(e).replace(
  wi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ht(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : Ch(e).split(_h).map((n, a) => a % 2 ? n : Oh(n)).join("")
);
const Th = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Ih = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Rh = /[\w\]]\(/, Bh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Lh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Nh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, qh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Dh = /[[({,]$/, Ph = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, jh = /^(\t|\s{2,})\S/, Fh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Wh = /`[^`]+`/, Hh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, zh = /[{}()[\];=<>$&|*\\@+^~%]/g, xi = /^\s*(?:[-*+]|\d+[.)])\s/, Uh = /^\s*>/, Gh = /^\s*\|/, Vh = 0.6, Kh = 0.4, Yh = 5, Qh = 0.03, Si = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Yh && t.every((n) => Hh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(zh) ?? []).length / e.length < Qh;
}, Aa = (e) => {
  const t = e.trim();
  return Wh.test(t) ? !1 : [Th, Ih, Rh, Bh, Lh, Nh, qh, Dh, Ph].some((n) => n.test(t)) || /[;{}]$/.test(t) || jh.test(e) && !xi.test(e) && !Si(e);
};
function Xh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || xi.test(t[0]) || t.every((o) => Uh.test(o) || Gh.test(o))) return "text";
  const n = t.filter((o) => !Fh.test(o.trim()));
  if (t.length === 1) return !n.length || Aa(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Aa).length, s = n.filter((o) => !Aa(o) && Si(o)).length;
  return a >= n.length * Vh && s <= n.length * Kh ? "code" : "text";
}
const ds = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Jh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Zh = `${ds} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, em = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", tm = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Io = {
  js: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Jh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Zh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ds, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
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
function Ro(e, t, n) {
  return n && e.startsWith(n, t);
}
function am(e, t) {
  const n = Io[nm[t] ?? t] || Io.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function sm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of am(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ot(l) : `<span class="tok-${a}">${ot(l)}</span>`);
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
const lm = 1500, Bo = /* @__PURE__ */ new WeakMap();
async function im(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await om(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Bo.get(t)), Bo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, lm)
  )));
}
typeof document < "u" && document.addEventListener("click", im, !0);
const rm = /\n\s*\n/, um = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, cm = /^\s*(`{3,}|~{3,})\s*$/, dm = /^\s{4,}\S/, fm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, fs = /^\s*(?:[-*+]|\d+[.)])\s/, _i = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, hm = [
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
function mm(e) {
  const t = Ws(e.join(`
`));
  return (hm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const pm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && _i.test(t) && !fs.test(t);
}, vm = (e, t) => fs.test(t) || fs.test([...e].reverse().find((n) => n.trim()) || "");
function Hs(e, t) {
  const n = t || mm(e), a = sm(Ws(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function gm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && cm.test(s));
  return a < 0 ? e.length : a;
}
function ym(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Hs(a.map(yn), n ? n.toLowerCase() : "");
}
function bm(e) {
  const t = e.split(rm).map((l) => ({ paragraph: l, type: Xh(Ws(l).split(`
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
      const c = gm(n, l, i[2]);
      o(), a.push(ym(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const r = pm(s) ? fm : dm;
    if (!t && r.test(n[l]) && !vm(s, n[l])) {
      let c = l;
      for (; c < n.length && (r.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && _i.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
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
Et((e, t) => km(e, t.document), { first: !0 });
const wm = ["innerHTML"], $m = ["innerHTML"], xm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = gi(), a = M(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (u(), f("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => I(Lt) && I(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, wm)) : (u(), f("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => I(Lt) && I(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, $m));
  }
}, at = /* @__PURE__ */ z(xm, [["__scopeId", "data-v-d8e75741"]]), Lo = (e) => [...new Set(e.agents.map((t) => t.name))], Sm = (e) => Lo(e).length === 1 ? `Worker: ${Lo(e)[0]}` : "Delegated", _m = ["aria-expanded"], Mm = {
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
    const t = e, n = Ee(De, null), a = M(() => hd(t.type, t.state)), s = x(!1), o = x([]), l = x("");
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
      te(y(I(ln)(e.type, e.state)) + " ", 1),
      s.value ? (u(), f("span", Mm, [
        l.value ? (u(), f("span", Cm, y(l.value), 1)) : w("", !0),
        (u(!0), f(N, null, ne(o.value, (p, g) => (u(), f("span", {
          key: g,
          class: "tip-line"
        }, y(p), 1))), 128))
      ])) : w("", !0)
    ], 40, _m)) : (u(), f("span", Em, y(I(ln)(e.type, e.state)), 1));
  }
}, Om = /* @__PURE__ */ z(Am, [["__scopeId", "data-v-73ac4596"]]), Tm = {
  class: "plan-details",
  "data-plan-details": ""
}, Im = { class: "state-line" }, Rm = {
  key: 0,
  class: "phase-count"
}, Bm = {
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
        A(Om, {
          type: "plan",
          state: e.plan.state,
          "row-id": e.plan.id,
          read: e.read,
          class: Y(["status", I(Kl)("plan", e.plan.state)]),
          "data-plan-status": ""
        }, null, 8, ["state", "row-id", "read", "class"]),
        e.plan.current_phase ? (u(), f("span", Rm, "Phase " + y(e.plan.current_phase) + " of " + y(e.plan.phases.length), 1)) : w("", !0)
      ]),
      e.plan.reason ? (u(), f("section", Bm, [
        m("h4", null, y(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
        m("p", Lm, y(e.plan.reason), 1)
      ])) : w("", !0),
      e.plan.total ? (u(), f("section", Nm, [
        n[0] || (n[0] = m("h4", null, "Progress", -1)),
        m("div", qm, [
          A(fi, {
            value: e.plan.finished,
            max: e.plan.total
          }, null, 8, ["value", "max"]),
          m("span", Dm, y(e.plan.finished) + " of " + y(e.plan.total) + " done", 1)
        ])
      ])) : w("", !0),
      e.plan.assignee ? (u(), f("p", Pm, "Agent: " + y(e.plan.assignee.name), 1)) : e.plan.delegated ? (u(), f("p", jm, y(I(Sm)(e.plan)), 1)) : w("", !0),
      e.plan.brief ? (u(), f("section", Fm, [
        n[1] || (n[1] = m("h4", null, "The brief", -1)),
        A(Hf, {
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
}, kS = /* @__PURE__ */ z(Wm, [["__scopeId", "data-v-c37da567"]]), Hm = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, zm = { ...Hm, done: "Completed" }, Um = /* @__PURE__ */ new Set(["completed", "cancelled"]), Gm = (e) => Um.has(e), un = (e) => Gm(e) ? "done" : e, Vm = { class: "task-status-icon" }, Km = ["width", "height", "aria-label"], Ym = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = M(() => Kl("task", un(t.status))), a = M(() => n.value === "testing" ? "started" : n.value), s = M(() => zm[t.status] ?? ln("task", t.status));
    return (o, l) => (u(), f("span", Vm, [
      A(zt, {
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
            A(Ut, { value: a.value }, {
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
}, bn = /* @__PURE__ */ z(Ym, [["__scopeId", "data-v-ae24a63f"]]), Qm = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Xm = ["title", "onClick"], Jm = { class: "agent-word" }, Zm = {
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
    return (o, l) => s.value.length ? (u(), f("div", Qm, [
      (u(!0), f(N, null, ne(s.value, (i) => (u(), f("button", {
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
        te(" " + y(i.name) + " ", 1),
        m("span", Jm, y(i.held ? "Working" : "Queued"), 1)
      ], 8, Xm))), 128))
    ])) : w("", !0);
  }
}, ep = /* @__PURE__ */ z(Zm, [["__scopeId", "data-v-0c589695"]]), tp = { class: "phases" }, np = { class: "phead" }, ap = { class: "mark" }, sp = { class: "ptitle" }, op = { class: "phead-end" }, lp = {
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
      (u(!0), f(N, null, ne(e.phases, (r, c) => (u(), f("li", {
        key: r.id,
        class: Y(["phase", { current: c + 1 === e.currentPhase, done: o(r) }]),
        "data-resource-phase": ""
      }, [
        m("div", np, [
          m("span", ap, [
            A(ge, {
              name: o(r) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", sp, y(c + 1) + ". " + y(r.title), 1),
          m("span", op, [
            r.checkpoint ? (u(), f("span", lp, "checkpoint")) : w("", !0),
            m("span", ip, y(s(r)) + "/" + y(r.tasks.length), 1)
          ])
        ]),
        r.goal ? (u(), f("div", rp, y(r.goal), 1)) : w("", !0),
        A(ep, {
          tasks: r.tasks
        }, null, 8, ["tasks"]),
        (u(!0), f(N, null, ne(r.tasks, (d) => (u(), f("button", {
          key: d.id,
          type: "button",
          class: Y(["row", d.state]),
          "data-resource-task": "",
          onClick: (h) => a("select", d.id)
        }, [
          A(bn, {
            status: d.state
          }, null, 8, ["status"]),
          m("span", cp, "#" + y(d.id), 1),
          m("span", dp, y(d.title), 1),
          d.helper_id ? (u(), f("span", {
            key: 0,
            class: "holder",
            title: d.state === "open" ? `Queued for ${d.helper_name}` : `Held by ${d.helper_name}`,
            "data-plan-agent": ""
          }, y(d.helper_name), 9, fp)) : w("", !0)
        ], 10, up))), 128))
      ], 2))), 128))
    ]));
  }
}, wS = /* @__PURE__ */ z(hp, [["__scopeId", "data-v-6a600744"]]), mp = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, pp = {
  key: 0,
  class: "empty",
  role: "alert"
}, vp = {
  key: 2,
  class: "empty"
}, gp = { class: "day" }, yp = { class: "events" }, bp = { class: "mark" }, kp = { class: "what" }, wp = { class: "head" }, $p = { class: "word" }, xp = ["title", "onClick"], Sp = { class: "at" }, _p = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = x(null), l = x(""), i = M(() => {
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
    return ve(() => a.id, c, { immediate: !0 }), (d, h) => (u(), f("section", mp, [
      l.value ? (u(), f("p", pp, y(l.value), 1)) : o.value === null ? (u(), W(Ke, { key: 1 })) : o.value.length ? w("", !0) : (u(), f("p", vp, "Nothing has happened on this plan's tasks yet.")),
      (u(!0), f(N, null, ne(i.value, (p) => (u(), f(N, {
        key: p.day
      }, [
        m("h3", gp, y(p.day), 1),
        m("ol", yp, [
          (u(!0), f(N, null, ne(p.items, (g) => (u(), f("li", {
            key: `${g.time}-${g.event_type}-${g.task_id}`,
            class: Y(["event", g.event_type]),
            "data-plan-event": ""
          }, [
            m("span", bp, [
              n[g.event_type].state ? (u(), W(bn, {
                key: 0,
                status: n[g.event_type].state
              }, null, 8, ["status"])) : (u(), W(ge, {
                key: 1,
                name: n[g.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", kp, [
              m("div", wp, [
                m("span", $p, y(n[g.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${g.task_id}`,
                  onClick: (b) => s("select", g.task_id)
                }, "#" + y(g.task_id) + " " + y(g.title), 9, xp),
                m("span", Sp, y(r(g.time)), 1)
              ]),
              g.text ? (u(), W(at, {
                key: 0,
                class: "text",
                text: g.text
              }, null, 8, ["text"])) : w("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, $S = /* @__PURE__ */ z(_p, [["__scopeId", "data-v-9e511133"]]);
function Mp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function zs(e, t = Date.now()) {
  const n = Mp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Cp = 36e5;
function Ep(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Cp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function No(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Mi(e) {
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
function Ci(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Oa(t % 60)}s` : `${Math.floor(t / 3600)}h ${Oa(Math.floor(t % 3600 / 60))}m ${Oa(t % 60)}s`;
}
const Ap = 1e3;
function Ei() {
  const e = x(Date.now()), t = setInterval(() => e.value = Date.now(), Ap);
  return Ve(() => clearInterval(t)), e;
}
const Op = Symbol("resource-subscriptions");
function kn(e, t) {
  const n = Ee(Op, () => new Fl(), !0), a = Os(t, 100), s = n.follow("resources", e, a);
  da(() => {
    s(), a.cancel();
  });
}
const Tp = "Not known", Ip = 80, Rp = 1e3, Bp = "worker", Lp = "main", Np = /* @__PURE__ */ new Set(["waiting", "blocked"]), Ai = (e) => e.ok ? e.value.rows : [], Do = (e) => e.ok ? e.value.total : 0, Oi = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), qp = (e, t) => (t == null ? void 0 : t.given_name) || Oi((t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.role), Dp = (e, t) => e.ended_at ? "ended" : e.paused_at || Np.has(t == null ? void 0 : t.state) ? "waiting" : "running", Pp = (e, t) => [(t == null ? void 0 : t.profile) && Oi(t.profile_title || t.profile), e.program, t == null ? void 0 : t.model, (t == null ? void 0 : t.effort) && `${t.effort} effort`].filter(Boolean), Ti = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function jp({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / Rp, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Ci(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Ip }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Tp : `$${t.cost_dollars.toFixed(2)}` }), e.role === Bp && l.push({ key: "pace", label: "Tasks an hour", value: String(Ep(Ti(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Lp && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Fp(e) {
  const t = Ti(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Wp(e, t) {
  const n = [["Number", String(e.id)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && n.push(["Parent agent", `Agent ${e.parent_id}`]), n.push(["Started by", t.started_by], ["Started", No(e.created_at)]), e.ended_at && n.push(["Ended", No(e.ended_at)]), e.pid && n.push(["Process", `pid ${e.pid}`]), n;
}
const Hp = { class: "band" }, zp = { key: 0 }, Up = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (u(), f("h2", Hp, [
      A(ge, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      me(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (u(), f("span", zp, y(e.count), 1)) : w("", !0)
    ]));
  }
}, Ft = /* @__PURE__ */ z(Up, [["__scopeId", "data-v-1758914f"]]), Gp = { class: "number" }, Vp = { class: "text" }, Kp = 150, Yp = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = x(!1), a = M(() => t.text.length > Kp), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (u(), f(N, null, [
      e.text ? (u(), f(N, { key: 0 }, [
        A(Ft, { icon: "file" }, {
          default: j(() => [
            te(y(e.label), 1)
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
        }, "Show all")) : w("", !0)
      ], 64)) : w("", !0),
      e.points.length ? (u(), f(N, { key: 1 }, [
        A(Ft, { icon: "points" }, {
          default: j(() => [...l[1] || (l[1] = [
            te("Points to prove", -1)
          ])]),
          _: 1
        }),
        (u(!0), f(N, null, ne(e.points, (i) => {
          var r;
          return u(), f("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", Gp, y(i.id), 1),
            m("span", Vp, [
              te(y(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((r = i.proof) == null ? void 0 : r.state) === "checked" }])
              }, y(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : w("", !0)
    ], 64));
  }
}, Qp = /* @__PURE__ */ z(Yp, [["__scopeId", "data-v-c99de22c"]]), Xp = ["aria-expanded"], Jp = { class: "count" }, Zp = {
  key: 0,
  "data-agent-fold-body": ""
}, e1 = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Dt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = sn(e, "open");
    return (n, a) => (u(), f(N, null, [
      m("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(ge, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        te(y(e.label), 1),
        m("span", Jp, y(e.count), 1),
        A(ge, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Xp),
      t.value ? (u(), f("div", Zp, [
        me(n.$slots, "default", {}, void 0, !0)
      ])) : w("", !0)
    ], 64));
  }
}, Ta = /* @__PURE__ */ z(e1, [["__scopeId", "data-v-7f93d8d9"]]), t1 = ["onClick"], n1 = { class: "text" }, a1 = { class: "aside" }, s1 = {
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
    const t = e, n = Ht({ helpers: !1, skills: !1 }), a = x([]), s = x([]), o = async (i) => Ai(await t.read(i));
    ve(() => [n.helpers, t.loads], async ([i]) => {
      i && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ve(() => [n.skills, t.loads], async ([i]) => {
      i && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    });
    const l = (i) => i.given_name || `${Yn(i.role)} ${i.id}`;
    return (i, r) => (u(), f(N, null, [
      A(Ta, {
        open: n.helpers,
        "onUpdate:open": r[0] || (r[0] = (c) => n.helpers = c),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: j(() => [
          (u(!0), f(N, null, ne(a.value, (c) => (u(), f("button", {
            key: c.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (d) => I(vt)("agents", c.id)
          }, [
            m("span", n1, y(l(c)), 1),
            m("span", a1, y(I(Yn)(c.role)) + " " + y(c.id), 1)
          ], 8, t1))), 128)),
          a.value.length ? w("", !0) : (u(), f("p", s1, "It started no helpers."))
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
          m("p", o1, [
            (u(!0), f(N, null, ne(s.value, (c) => (u(), f("span", {
              key: c.id,
              "data-agent-skill": ""
            }, y(c.skill), 1))), 128)),
            s.value.length ? w("", !0) : (u(), f("span", l1, "It loaded no skills."))
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
          (u(!0), f(N, null, ne(e.details, ([c, d, h]) => (u(), f("div", {
            key: c,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", i1, y(c) + ":", 1),
            m("span", {
              class: Y(["value", h])
            }, y(d), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, u1 = /* @__PURE__ */ z(r1, [["__scopeId", "data-v-358a0300"]]), c1 = ["datetime", "title"], Ze = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ei(), a = M(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (u(), f("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, y(I(zs)(e.at, I(n))), 9, c1));
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
}, v1 = { class: "line" }, g1 = { class: "detail" }, y1 = { class: "bar" }, b1 = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = M(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (u(), f(N, null, [
      A(Ft, { icon: "play" }, {
        default: j(() => [...o[2] || (o[2] = [
          te("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", d1, [
        e.inspection.task ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => I(vt)("tasks", e.inspection.task.id))
        }, "Task " + y(e.inspection.task.id) + ": " + y(e.inspection.task.title), 1)) : (u(), f("span", f1, y(e.nothing), 1)),
        n.value ? (u(), f("span", h1, y(n.value), 1)) : w("", !0),
        e.inspection.last_activity ? (u(), f("span", m1, [
          o[3] || (o[3] = te("Last heard: ", -1)),
          A(Ze, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : w("", !0)
      ]),
      e.inspection.plan ? (u(), f("div", p1, [
        m("div", v1, [
          m("span", null, "Plan " + y(e.inspection.plan.id) + ", phase " + y(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => I(vt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", g1, y(e.inspection.plan.done) + " of " + y(e.inspection.plan.total) + " tasks done", 1),
        m("div", y1, [
          m("i", {
            style: be({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : w("", !0)
    ], 64));
  }
}, k1 = /* @__PURE__ */ z(b1, [["__scopeId", "data-v-cbe6a9f7"]]), w1 = ["onClick"], $1 = { class: "text" }, x1 = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, S1 = { class: "text" }, _1 = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, M1 = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f(N, null, [
      A(Ft, { icon: "clock" }, {
        default: j(() => [...n[0] || (n[0] = [
          te("Recent", -1)
        ])]),
        _: 1
      }),
      (u(!0), f(N, null, ne(e.moves, (a) => (u(), f(N, {
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
          m("span", $1, y(a.text), 1),
          A(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, w1)) : (u(), f("div", x1, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", S1, y(a.text), 1),
          A(Ze, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? w("", !0) : (u(), f("p", _1, "Nothing yet."))
    ], 64));
  }
}, C1 = /* @__PURE__ */ z(M1, [["__scopeId", "data-v-58f0db57"]]), E1 = {
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
      (u(!0), f(N, null, ne(e.cells, (a) => (u(), f("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, y(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, y(a.value), 3),
        a.meter !== void 0 ? (u(), f("div", O1, [
          m("i", {
            class: Y({ high: a.high }),
            style: be({ width: `${a.meter}%` })
          }, null, 6)
        ])) : w("", !0)
      ], 8, A1))), 128))
    ]));
  }
}, I1 = /* @__PURE__ */ z(T1, [["__scopeId", "data-v-b6657ab7"]]), R1 = {
  class: "who",
  "data-agent-who": ""
}, B1 = { class: "name" }, L1 = ["data-agent-state"], N1 = {
  class: "sub",
  "data-agent-identity": ""
}, q1 = {
  class: "sub",
  "data-agent-started-by": ""
}, D1 = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, parts: { type: Array, required: !0 }, startedBy: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", R1, [
      m("h2", B1, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, L1),
        te(y(e.name), 1)
      ]),
      m("p", N1, y(e.parts.join(" · ")), 1),
      m("p", q1, "Started by: " + y(e.startedBy), 1)
    ]));
  }
}, P1 = /* @__PURE__ */ z(D1, [["__scopeId", "data-v-cf32a62c"]]), j1 = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, F1 = { class: "scroll" }, W1 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, H1 = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, z1 = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ei(), a = x(null), s = x(null), o = x(null), l = x({}), i = x({ helpers: 0, skills: 0 }), r = x(0), c = x([]), d = x("");
    let h = 0;
    const p = M(() => {
      var b;
      return a.value.ended_at ? Fp(s.value) : `It has no task.${(b = s.value) != null && b.instruction ? " It was given an instruction." : ""}`;
    });
    async function g() {
      const b = ++h, S = await t.read(["agent", "show", String(t.id)]);
      if (b !== h) return;
      if (!S.ok) return void (d.value = S.error);
      const O = String(t.id), C = S.value.role === "worker", [D, U, F, R, V, P] = await Promise.all([
        t.read(["usage", "agents", "--closed", "--agent", O, "--environment", t.environment]),
        t.read(["usage", "agent", O]),
        S.value.ended_at ? { ok: !1 } : t.read(["usage", "tool", "--agent", O]),
        t.read(["agent", "list", "--parent", O, "--limit", "1", "--columns", "id"]),
        t.read(["agent-skill", "list", "--agent", O, "--state", "loaded", "--limit", "1", "--columns", "id"]),
        C ? t.read(["worker-worktree", "points", "--agent", O]) : { ok: !1 }
      ]);
      b === h && (d.value = U.ok ? "" : U.error, a.value = S.value, s.value = Ai(D).find((L) => L.id === t.id) ?? null, o.value = U.ok ? U.value : null, l.value = F.ok ? F.value : {}, i.value = { helpers: Do(R), skills: Do(V) }, c.value = P.ok ? P.value.points : [], r.value += 1);
    }
    return kn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], g), _e(g), (b, S) => {
      var O;
      return u(), f("article", j1, [
        m("div", F1, [
          d.value ? (u(), f("p", W1, y(d.value), 1)) : a.value && o.value ? (u(), f(N, { key: 1 }, [
            A(P1, {
              name: I(qp)(a.value, s.value),
              state: I(Dp)(a.value, s.value),
              parts: I(Pp)(a.value, s.value),
              "started-by": o.value.started_by
            }, null, 8, ["name", "state", "parts", "started-by"]),
            A(I1, {
              cells: I(jp)({ row: a.value, facts: s.value, inspection: o.value, now: I(n) })
            }, null, 8, ["cells"]),
            A(k1, {
              inspection: o.value,
              tool: l.value,
              nothing: p.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(Qp, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((O = s.value) == null ? void 0 : O.instruction) ?? "",
              points: c.value
            }, null, 8, ["label", "text", "points"]),
            A(C1, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(u1, {
              id: e.id,
              read: e.read,
              counts: i.value,
              loads: r.value,
              details: I(Wp)(a.value, o.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (u(), f("p", H1, "Ended " + y(I(zs)(a.value.ended_at, I(n))) + ". It takes no more actions.", 1)) : w("", !0)
          ], 64)) : (u(), W(Ke, { key: 2 }))
        ])
      ]);
    };
  }
}, xS = /* @__PURE__ */ z(z1, [["__scopeId", "data-v-40345b29"]]), U1 = ["aria-expanded"], G1 = { class: "drop-label" }, V1 = ["value"], K1 = {
  key: 1,
  class: "drop-lead"
}, Y1 = { class: "drop-item-text" }, Q1 = {
  key: 2,
  class: "drop-note"
}, X1 = {
  key: 1,
  class: "drop-none"
}, J1 = {
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
    const n = e, a = t, s = x(!1), o = x(null), l = x(""), i = M(() => {
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
        e.icon ? (u(), W(ge, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : w("", !0),
        m("span", G1, y(e.label), 1),
        A(ge, {
          name: "down",
          size: 11
        })
      ], 10, U1),
      s.value ? (u(), W(Is, {
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
          }, null, 40, V1)) : w("", !0),
          (u(!0), f(N, null, ne(i.value, (h) => (u(), W(jt, {
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
              h.lead ? (u(), f("span", K1, y(h.lead), 1)) : w("", !0),
              m("span", Y1, y(h.label), 1),
              h.note ? (u(), f("span", Q1, y(h.note), 1)) : w("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? w("", !0) : (u(), f("p", X1, y(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : w("", !0)
    ], 2));
  }
}, Ii = /* @__PURE__ */ z(J1, [["__scopeId", "data-v-29dfcce5"]]);
function Z1(e) {
  const t = x(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), Ve(() => n.disconnect()), t;
}
const ev = ["data-comment-id"], tv = {
  key: 0,
  class: "comment-top"
}, nv = { class: "comment-mark" }, av = {
  class: "comment-body",
  "data-comment": ""
}, sv = { class: "comment-foot" }, ov = {
  key: 1,
  "data-comment-lost": ""
}, lv = {
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
      e.comment.quote ? (u(), f("div", tv, [
        m("span", nv, y(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, y(e.comment.quote), 3)
      ])) : w("", !0),
      m("p", av, y(e.comment.body), 1),
      m("div", sv, [
        e.comment.created_at ? (u(), W(Ze, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : w("", !0),
        e.lost ? (u(), f("span", ov, "The text has changed here")) : e.comment.quote ? (u(), f("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : w("", !0)
      ])
    ], 10, ev));
  }
}, Ri = /* @__PURE__ */ z(lv, [["__scopeId", "data-v-a37d4507"]]);
var El;
/Mac|iPhone|iPad/.test(((El = navigator.userAgentData) == null ? void 0 : El.platform) || navigator.platform);
function Bi(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const iv = {
  class: "comment-box",
  "data-comment-box": ""
}, rv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, uv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, cv = { class: "comment-row" }, dv = ["placeholder"], fv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Dt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Dt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = sn(e, "draft"), l = x(""), i = x(!1), r = x(null), c = M(() => {
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
          await a.send(g), o.value = "", await Pe(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => r.value.focus() }), (g, b) => (u(), f("div", iv, [
      e.selection ? (u(), f("div", rv, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, y(e.selection.quote), 3),
        A(fa, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (S) => s("clear"))
        })
      ])) : w("", !0),
      l.value ? (u(), f("p", uv, y(l.value), 1)) : w("", !0),
      m("div", cv, [
        Je(m("textarea", {
          ref_key: "box",
          ref: r,
          "onUpdate:modelValue": b[1] || (b[1] = (S) => o.value = S),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Mt((S) => I(Bi)(S, p), ["enter"]))
        }, null, 42, dv), [
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
            te("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, hv = /* @__PURE__ */ z(fv, [["__scopeId", "data-v-41d2081c"]]), Rn = (e) => e ? e.split(", ") : [];
function mv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function pv(e, t) {
  return {
    reads: Rn(e.reads_allowed),
    runs: Rn(e.runs_allowed),
    missing: [...Rn(e.reads_missing), ...Rn(e.runs_missing)],
    ask: t
  };
}
const vv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Yr("SkeletonParts", !0);
      return u(!0), f(N, null, ne(e.parts, (r, c) => (u(), f(N, { key: c }, [
        (u(!0), f(N, null, ne(r.count, (d) => (u(), W(Ut, {
          key: d,
          value: r.shape
        }, {
          line: j(() => [
            A(Jt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: be({ width: r.width, height: `${t[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            A(Jt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: be({ width: `${n[r.size]}px`, height: `${n[r.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            A(Jt, {
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
              A(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            m("div", {
              class: "skeleton-stack",
              style: be(a(r))
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
              style: be(a(r))
            }, [
              A(i, {
                parts: r.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            m("div", {
              class: "skeleton-grid",
              style: be(s(r))
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
}), gv = /* @__PURE__ */ z(vv, [["__scopeId", "data-v-fa8baeaf"]]), yv = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, bv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (u(), f("div", yv, [
      A(gv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Us = /* @__PURE__ */ z(bv, [["__scopeId", "data-v-52f66b64"]]), Li = {
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
}, kv = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["badge", e.tone])
    }, y(e.text), 3));
  }
}, Ni = /* @__PURE__ */ z(kv, [["__scopeId", "data-v-9e7e1157"]]), wv = { class: "bars" }, $v = { class: "bar-name" }, xv = { class: "bar-value" }, Sv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = M(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (u(), f("div", wv, [
      (u(!0), f(N, null, ne(e.items, (r, c) => (u(), W(yt(r.open ? "button" : "div"), {
        key: `${c}-${r.label}`,
        type: r.open ? "button" : void 0,
        class: Y(["bar-row", r.tone, { opens: r.open }]),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          m("span", $v, y(r.label), 1),
          A(fi, {
            value: Number(r.value) || 0,
            max: s.value,
            tone: r.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", xv, y(r.value) + y(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, _v = /* @__PURE__ */ z(Sv, [["__scopeId", "data-v-663427f4"]]), Mv = { class: "bars" }, Cv = {
  key: 0,
  class: "bars-title"
}, Ev = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", Mv, [
      e.node.title ? (u(), f("span", Cv, y(e.node.title), 1)) : w("", !0),
      A(_v, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Av = /* @__PURE__ */ z(Ev, [["__scopeId", "data-v-7135bb11"]]), Ov = {
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
      style: be(o.value)
    }, [
      (u(!0), f(N, null, ne(e.node.children || [], (r, c) => (u(), W(qi, {
        key: c,
        node: r,
        onOpen: i[0] || (i[0] = (d) => s("open", d)),
        onFile: i[1] || (i[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Fn = /* @__PURE__ */ z(Ov, [["__scopeId", "data-v-d142a3f4"]]), Tv = {
  key: 0,
  class: "card-head"
}, Iv = { class: "card-title" }, Rv = {
  key: 0,
  class: "card-note"
}, Bv = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (u(), f("header", Tv, [
        m("span", Iv, y(e.node.title), 1),
        e.node.note ? (u(), f("span", Rv, y(e.node.note), 1)) : w("", !0)
      ])) : w("", !0),
      A(Fn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Lv = /* @__PURE__ */ z(Bv, [["__scopeId", "data-v-67b72d40"]]), Nv = { class: "fact" }, qv = { class: "fact-label" }, Dv = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", Nv, [
      m("span", qv, y(e.label), 1),
      A(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Pv = /* @__PURE__ */ z(Dv, [["__scopeId", "data-v-3a88ecf8"]]), jv = { class: "list" }, Fv = { class: "list-label" }, Wv = {
  key: 1,
  class: "list-note"
}, Hv = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", jv, [
      (u(!0), f(N, null, ne(e.items, (o, l) => (u(), W(yt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          m("span", Fv, y(o.label), 1),
          o.badge ? (u(), W(Ni, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : w("", !0),
          o.note ? (u(), f("span", Wv, y(o.note), 1)) : w("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, zv = /* @__PURE__ */ z(Hv, [["__scopeId", "data-v-ebe2ae0a"]]), Uv = { class: "table" }, Gv = {
  key: 0,
  class: "table-row empty"
}, Vv = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (u(), f("div", Uv, [
      m("div", {
        class: "table-row head",
        style: be(s.value)
      }, [
        (u(!0), f(N, null, ne(e.columns, (i) => (u(), f("span", {
          key: i,
          class: "cell"
        }, y(i), 1))), 128))
      ], 4),
      (u(!0), f(N, null, ne(e.rows, (i, r) => (u(), W(yt(i.open ? "button" : "div"), {
        key: r,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: be(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          (u(!0), f(N, null, ne(i.cells, (c, d) => (u(), f("span", {
            key: d,
            class: "cell"
          }, y(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (u(), f("div", Gv, y(e.empty), 1)) : w("", !0)
    ]));
  }
}, Kv = /* @__PURE__ */ z(Vv, [["__scopeId", "data-v-9326a52e"]]), Yv = { class: "stat-value" }, Qv = { class: "stat-label" }, Xv = {
  key: 0,
  class: "stat-note"
}, Jv = {
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
    return (a, s) => (u(), W(yt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        m("span", Yv, y(e.value), 1),
        m("span", Qv, y(e.label), 1),
        e.note ? (u(), f("span", Xv, y(e.note), 1)) : w("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Zv = /* @__PURE__ */ z(Jv, [["__scopeId", "data-v-ad0db6d6"]]), eg = { class: "code" }, tg = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (u(), W(Ut, {
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
        A(Lv, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        m("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, y(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        A(Zv, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (i) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        A(Av, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        A(Kv, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        A(zv, {
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
        A(Pv, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        A(Ni, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        m("pre", eg, [
          m("code", null, y(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (i) => s(e.node))
        }, y(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), qi = /* @__PURE__ */ z(tg, [["__scopeId", "data-v-cbdcf540"]]), ng = { class: "dashboard" }, ag = { class: "trail" }, sg = ["onClick"], og = {
  key: 0,
  class: "gone",
  role: "status"
}, lg = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = x(!!n.page && !s(n.page)), l = x(n.page && !o.value ? [n.page] : []), i = M(() => l.value.at(-1) || n.document.start), r = M(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, h = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ve(
      () => n.document.start,
      () => l.value = []
    ), (p, g) => (u(), f("div", ng, [
      e.document.broken ? (u(), W(on, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          te(y(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (u(), W(on, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          te(y(e.document.missing), 1)
        ]),
        _: 1
      })) : r.value ? (u(), f(N, { key: 2 }, [
        m("nav", ag, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (b) => h(0))
          }, y(c(e.document.start)), 3),
          (u(!0), f(N, null, ne(l.value, (b, S) => (u(), f(N, {
            key: `${S}-${b}`
          }, [
            g[2] || (g[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: S === l.value.length - 1 }]),
              onClick: (O) => h(S + 1)
            }, y(c(b)), 11, sg)
          ], 64))), 128))
        ]),
        o.value ? (u(), f("p", og, "What you opened is no longer in this dashboard. Here is its start page.")) : w("", !0),
        A(zt, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (u(), f("div", {
              key: i.value,
              class: "page"
            }, [
              A(qi, {
                node: r.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : w("", !0)
    ]));
  }
}, ig = /* @__PURE__ */ z(lg, [["__scopeId", "data-v-fbe83734"]]);
function rg(e, t) {
  const n = ze(), a = Os(e, Li.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), Ve(() => {
    s(), a.cancel();
  });
}
const ug = {
  key: 0,
  class: "window-failure"
}, cg = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ze(), o = x(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? rg(l, n.events) : Es(l, () => !0, Li.documentWithNoEvents), (i, r) => o.value && !o.value.ok ? (u(), f("p", ug, y(o.value.error), 1)) : o.value ? (u(), W(ig, {
      key: 1,
      document: o.value.value,
      onFile: r[0] || (r[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : w("", !0);
  }
}, dg = 1e4;
class fg {
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
    return this.heardAt !== null && t - this.heardAt > dg;
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
const hg = {
  key: 0,
  class: "frame-note"
}, mg = {
  key: 0,
  class: "frame-note"
}, pg = ["src", "title"], vg = 1e3, gg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ze(), a = x(null), s = x(!1), o = x(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new fg(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, vg);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (r, c) => o.value ? (u(), f("p", hg, "This window was closed because it stopped answering.")) : (u(), f(N, { key: 1 }, [
      s.value ? (u(), f("div", mg, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        A(pe, {
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
        title: I(n).window
      }, null, 8, pg)
    ], 64));
  }
}, yg = /* @__PURE__ */ z(gg, [["__scopeId", "data-v-32a49046"]]), bg = {
  class: "allowance-prompt",
  role: "dialog"
}, kg = { class: "allowance-prompt-text" }, wg = { class: "allowance-prompt-buttons" }, $g = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("div", bg, [
      m("p", kg, y(I(mv)(e.request)), 1),
      m("div", wg, [
        A(pe, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            te("Allow", -1)
          ])]),
          _: 1
        }),
        A(pe, {
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
}, xg = /* @__PURE__ */ z($g, [["__scopeId", "data-v-cad69fe2"]]), Ia = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), W(on, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        te(y(e.reason) + " ", 1),
        e.retry ? (u(), W(pe, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            te("Retry", -1)
          ])]),
          _: 1
        })) : w("", !0),
        e.removable ? (u(), W(pe, {
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
}, Sg = ["data-window", "data-agent"], _g = {
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
    const n = e, a = t, s = x(""), o = x(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Ee(kc, null), r = bd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: M(() => n.options),
      declared: n.declared,
      page: Ee(md, null),
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
    Al(De, r), ve(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), _e(r.settle), Re(() => {
      r.cancel(), n.subscriptions.stopAll(n.name);
    }), Qr((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ra(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (u(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (u(), W(xg, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : w("", !0),
      e.unavailableReason ? (u(), W(Ia, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (u(), W(Ia, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (u(), f(N, { key: 4 }, [
        (u(), W(c, { key: o.value })),
        e.skeleton.length && !I(r).answered.value ? (u(), W(Us, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : w("", !0)
      ], 64)) : (u(), W(Ia, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Sg));
  }
}, Zt = /* @__PURE__ */ z(_g, [["__scopeId", "data-v-c4443e2b"]]), Di = {
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
    const n = e, a = t, s = { render: () => ra(yg, { src: n.entry.entry_url }) };
    return (o, l) => (u(), W(Zt, {
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
}, Mg = ["data-window"], Pi = {
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
    const n = e, a = t, s = Xe(null), o = x("");
    return ve(
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
      A(Us, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Mg)) : (u(), W(Zt, {
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
}, Cg = {
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
    const n = t, a = e, s = M(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = M(() => s.value && { render: () => ra(cg, { line: s.value.line, events: s.value.events }) }), l = x(null), i = M(() => {
      var p, g;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), r = M(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = M(
      () => {
        var p, g;
        return l.value ? pv(l.value, h) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
        var p, g;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await d(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (p, g) => {
      var b, S;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (u(), W(Us, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((S = s.value) == null ? void 0 : S.shows) === "one-agent" && e.agent === null ? (u(), W(on, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (u(), W(Zt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": r.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (u(), W(Pi, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (u(), W(Di, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (u(), W(Zt, {
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
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (u(), W(Zt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (O) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Eg = ["data-section"], Ag = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Og = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ee(Ls, null), a = M(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = M(() => ({ row: t.row }));
    return (o, l) => I(n) ? (u(!0), f(N, { key: 0 }, ne(a.value, (i) => (u(), f("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (u(), W(Cg, {
        key: 0,
        name: i.name,
        catalogue: I(n).catalogue,
        subscriptions: I(n).subscriptions,
        environment: I(n).environment,
        prompts: I(n).prompts,
        "shell-read": I(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (u(), f("p", Ag, y(i.name) + " is not available", 1))
    ], 8, Eg))), 128)) : w("", !0);
  }
}, hs = /* @__PURE__ */ z(Og, [["__scopeId", "data-v-a47d36b7"]]), Tg = { class: "rail-head" }, Ig = { key: 0 }, Rg = {
  key: 1,
  class: "rail-none"
}, Bg = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (u(), f("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", Tg, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (u(), f("span", Ig, y(e.total || e.comments.length), 1)) : w("", !0)
      ]),
      e.comments.length ? (u(!0), f(N, { key: 0 }, ne(e.comments, (a) => (u(), W(Ri, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (u(), f("p", Rg, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, Lg = /* @__PURE__ */ z(Bg, [["__scopeId", "data-v-4d684649"]]), Ng = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, qg = ["aria-pressed"], Dg = ["aria-pressed"], Pg = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, jg = {
  key: 0,
  role: "alert"
}, Fg = {
  key: 1,
  class: "sidebar-none"
}, Wg = ["data-question-id"], Hg = { class: "question-state" }, zg = ["data-question-show", "onClick"], Ug = {
  key: 0,
  class: "sidebar-none"
}, Gg = {
  key: 1,
  class: "question-answer"
}, Vg = {
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
      m("nav", Ng, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, qg),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Dg)
      ]),
      e.mode === "comments" ? (u(), f(N, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (u(), W(Lg, {
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
      ], 64)) : (u(), f("aside", Pg, [
        e.failure ? (u(), f("p", jg, y(e.failure), 1)) : e.questions.length ? w("", !0) : (u(), f("p", Fg, "No questions about this text yet.")),
        (u(!0), f(N, null, ne(e.questions, (s) => {
          var o;
          return u(), f("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", Hg, y(I(ln)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, y(s.text), 9, zg),
            s.quote ? (u(), f(N, { key: 0 }, [
              m("blockquote", null, y(s.quote), 1),
              e.lost.includes(s.id) ? (u(), f("p", Ug, "The quoted text has changed.")) : w("", !0)
            ], 64)) : w("", !0),
            s.answer ? (u(), f("p", Gg, "Answered: " + y(s.answer), 1)) : w("", !0),
            A(hs, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(Ds, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = I(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Wg);
        }), 128))
      ]))
    ], 2));
  }
}, Po = /* @__PURE__ */ z(Vg, [["__scopeId", "data-v-2718a08d"]]), Kg = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, Yg = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ht({ abstract: n.row.abstract, body: n.row.body }), o = x("");
    async function l() {
      const i = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, r) => (u(), W(ha, {
      title: "Edit the document",
      wide: "",
      onClose: r[3] || (r[3] = (c) => a("close"))
    }, {
      foot: j(() => [
        m("span", Kg, y(o.value), 1),
        A(pe, {
          onClick: r[2] || (r[2] = (c) => a("close"))
        }, {
          default: j(() => [...r[6] || (r[6] = [
            te("Cancel", -1)
          ])]),
          _: 1
        }),
        A(pe, {
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
            Je(m("input", {
              "onUpdate:modelValue": r[0] || (r[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Kn, s.abstract]
            ])
          ]),
          m("label", null, [
            r[5] || (r[5] = m("span", null, "Text", -1)),
            Je(m("textarea", {
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
}, Qg = /* @__PURE__ */ z(Yg, [["__scopeId", "data-v-e99f14e0"]]);
function ji(e, t) {
  const n = x([]), a = x(!1), s = x(null), o = x(0), l = x(!1), i = x("");
  let r = 0, c = 0;
  const d = (b) => {
    if (typeof b.body == "string") return b.body;
    const { noun: S, id: O, title: C } = e(), D = `On ${S} ${O}, ${C}: `;
    return b.text.startsWith(D) ? b.text.slice(D.length) : b.text;
  };
  async function h(b = 1) {
    const { noun: S, id: O } = e();
    if (!O) return;
    const C = ++c;
    l.value = !0, i.value = "";
    try {
      const D = await t([S, "comments", String(O), "--page", String(b), "--page-size", "25"]);
      if (C !== c) return;
      if (!D.ok) {
        i.value = D.error;
        return;
      }
      const U = D.value.rows ?? [], F = b === 1 ? U : [...n.value, ...U];
      n.value = [...new Map(F.map((R) => [R.id, R])).values()], o.value = D.value.total ?? n.value.length, s.value = D.value.next_page ?? null;
    } catch (D) {
      C === c && (i.value = D.message);
    } finally {
      C === c && (l.value = !1);
    }
  }
  async function p(b) {
    var R;
    const { noun: S, id: O } = e(), C = `${S}:${O}`, D = { id: `sending-${++r}`, text: b };
    n.value = [...n.value, D], o.value++, a.value = !0;
    const U = await t([S, "comment", String(O), b]);
    if (C !== `${e().noun}:${e().id}`) return;
    if (!U.ok)
      throw n.value = n.value.filter((V) => V.id !== D.id), o.value = Math.max(0, o.value - 1), new Error(U.error);
    await h();
    const F = (R = U.value) == null ? void 0 : R.id;
    F && !n.value.some((V) => V.id === F) && (n.value = [...n.value, { ...D, id: F }]);
  }
  const g = () => !l.value && s.value && h(s.value);
  return ve(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: p, load: h, loadMore: g, nextPage: s, total: o, loading: l, failure: i };
}
function Xg(e, t) {
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
const Jg = {
  class: "document-tab",
  "data-document-revisions": ""
}, Zg = ["datetime"], ey = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, ty = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, ny = {
  key: 2,
  class: "document-none"
}, ay = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(null), o = x(""), l = M(() => s.value ? Xg(s.value.body, n.text) : []);
    async function i(c) {
      const d = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function r() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, d) => (u(), f("div", Jg, [
      e.editing ? (u(), W(pe, {
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
      e.revisions.length ? (u(), f(N, { key: 1 }, [
        (u(!0), f(N, null, ne(e.revisions, (h) => (u(), W(pe, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (p) => i(h)
        }, {
          default: j(() => [
            te("Revision " + y(h.number) + ": " + y(h.change) + " · " + y(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, y(h.created_at.slice(0, 16).replace("T", " ")), 9, Zg)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (u(), f("p", ey, y(o.value), 1)) : w("", !0),
        s.value ? (u(), f(N, { key: 1 }, [
          A(pe, {
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
          m("div", ty, [
            (u(!0), f(N, null, ne(l.value, (h) => (u(), f("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, y(h.text || " "), 3))), 128))
          ])
        ], 64)) : w("", !0)
      ], 64)) : (u(), f("p", ny, "No revisions"))
    ]));
  }
}, sy = /* @__PURE__ */ z(ay, [["__scopeId", "data-v-3a381aa4"]]), oy = "button, [data-comment-number]", ly = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Fi(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(oy) || n.push(t.currentNode);
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
const iy = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function ry(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Fi(e), s = a.map((c) => c.data).join(""), o = jo(a, n.startContainer, n.startOffset), l = s.slice(o, jo(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const r = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: iy(r.nodeType === Node.TEXT_NODE ? r.parentElement : r) };
}
function uy(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function cy(e, t, n) {
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
function dy({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function fy(e, t) {
  const n = Fi(e), a = uy(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = cy(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(dy).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ra(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ra(t.number, t.id, t.label)) : l.at(-1).append(Ra(t.number, t.id, t.label))), !0;
}
function hy(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !fy(e, a) && a.id && n.push(a.id);
  return n;
}
const my = (e) => e.closest(ly) ?? e;
function Fo(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const py = {
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
    const a = e, s = n, o = x(null), l = x(null), i = x(null), r = x(!1), c = x(null);
    function d() {
      if (!l.value || r.value) return;
      l.value.innerHTML = a.html;
      const S = a.comments.filter((U) => U.quote).map((U) => ({ ...U, label: a.annotationLabel, hot: U.id === a.hot })), O = hy(l.value, a.pending ? [...S, { ...a.pending, pending: !0 }] : S);
      s("lost", O);
      const C = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!C) {
        c.value = null;
        return;
      }
      const D = document.createElement("div");
      D.className = "inline-comment", my(C).after(D), c.value = D;
    }
    function h() {
      if (!l.value) return;
      const S = ry(l.value);
      if (r.value = !!S, !S) {
        i.value = null;
        return;
      }
      const O = window.getSelection().getRangeAt(0).getBoundingClientRect(), C = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(O.left - C.left, 0)}px`, top: `${O.top - C.top + o.value.scrollTop}px` }, s("select", S);
    }
    function p(S) {
      const O = S.target.closest("[data-comment-number]");
      O ? s("number", Number(O.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function g(S) {
      var O;
      (O = l.value.querySelector(`[data-comment="${S}"]`)) == null || O.scrollIntoView({ block: "center" });
    }
    function b(S) {
      var O;
      (O = l.value.querySelectorAll("h3, h4, h5, h6")[S]) == null || O.scrollIntoView({ block: "start" });
    }
    return ve(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, r.value, a.pending], d, { flush: "post" }), _e(() => {
      d(), document.addEventListener("selectionchange", h);
    }), Ve(() => document.removeEventListener("selectionchange", h)), t({ show: g, showHeading: b, nextTick: Pe }), (S, O) => (u(), f("div", {
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
        onMousedown: O[0] || (O[0] = xe(() => {
        }, ["prevent"])),
        onClick: O[1] || (O[1] = (C) => s("write"))
      }, [
        A(ge, {
          name: "chat",
          size: 13
        }),
        O[2] || (O[2] = te("Comment on this", -1))
      ], 36)) : w("", !0),
      c.value ? (u(), W(ca, {
        key: 1,
        to: c.value
      }, [
        me(S.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : w("", !0),
      me(S.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, vy = /* @__PURE__ */ z(py, [["__scopeId", "data-v-548d0aaa"]]), gy = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, yy = { class: "document-tabs" }, by = { class: "document-body" }, ky = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, wy = {
  key: 1,
  class: "document-loading"
}, $y = {
  class: "document-details",
  "data-resource-fields": ""
}, xy = 760, Sy = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = x(null), a = Z1(n), s = M(() => a.value !== null && a.value < xy), o = x(null), l = x(""), i = x([]), r = x([]), c = x(""), d = x("comments"), h = x("text"), p = x(0), g = x(0), b = x([]), S = x(null), O = x(""), C = x(!1), D = x(null), U = x(null);
    let F = 0;
    const R = ji(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (fe) => t.read(fe)), V = M(() => Fo(R.comments.value)), P = M(() => d.value === "questions" ? Fo(r.value) : V.value), L = M(() => d.value === "questions" ? P.value.length : R.total.value), $ = M(() => {
      var fe;
      return (fe = o.value) != null && fe.body ? Fs(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), _ = M(() => {
      var fe;
      return (((fe = o.value) == null ? void 0 : fe.body) ?? "").split(`
`).filter((ee) => /^#{1,4} /.test(ee)).map((ee, le) => ({ key: String(le), value: le, label: ee.replace(/^#+ /, "") }));
    }), k = M(() => V.value.find((fe) => fe.id === g.value)), v = M(() => {
      var fe;
      return (fe = o.value) != null && fe.close_reason ? "Closed" : "Open";
    }), T = M(() => h.value === "comments" && !s.value ? "text" : h.value), E = (fe) => fe.ok ? fe.value.rows ?? [] : [];
    async function B() {
      const fe = ++F, ee = await t.read([t.noun, "inspect", String(t.id)]);
      if (fe !== F) return;
      l.value = ee.ok ? "" : ee.error, o.value = ee.ok ? ee.value : null;
      const le = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), ie = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      fe === F && (r.value = E(le), c.value = le.ok ? "" : le.error, i.value = ie ? E(ie) : []);
    }
    async function q(fe) {
      const ee = S.value ? ["--quote", S.value.quote, "--position", String(S.value.position), "--selection-type", S.value.selection_type] : [], le = await t.read([t.noun, "comment", String(t.id), ...ee, "--", fe]);
      if (!le.ok) throw new Error(le.error);
      S.value = null, await Promise.all([B(), R.load()]);
    }
    async function J() {
      const fe = await t.read(["doc", "close", String(t.id)]);
      l.value = fe.ok ? "" : fe.error, fe.ok && await B();
    }
    function H() {
      O.value.trim() || (S.value = null);
    }
    function se(fe) {
      var ee;
      if (p.value = fe, s.value && d.value === "questions") {
        h.value = "comments";
        return;
      }
      s.value ? g.value = g.value === fe ? 0 : fe : (ee = n.value.querySelector(d.value === "questions" ? `[data-question-id="${fe}"]` : `[data-comment-id="${fe}"]`)) == null || ee.scrollIntoView({ block: "nearest" });
    }
    async function ae(fe) {
      var ee, le;
      h.value = "text", p.value = fe, await ((ee = D.value) == null ? void 0 : ee.nextTick()), (le = D.value) == null || le.show(fe);
    }
    function ye() {
      C.value = !1, B();
    }
    return ve(() => `${t.noun}:${t.id}`, () => {
      o.value = null, h.value = "text", p.value = 0, g.value = 0, S.value = null, r.value = [], c.value = "", B();
    }, { immediate: !0 }), ve(d, () => {
      p.value = 0, g.value = 0;
    }), (fe, ee) => (u(), f("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (u(), f("div", gy, [
        A(pe, {
          bordered: "",
          "data-text-edit": "",
          onClick: ee[0] || (ee[0] = (le) => C.value = !0)
        }, {
          default: j(() => [...ee[14] || (ee[14] = [
            te("Edit", -1)
          ])]),
          _: 1
        })
      ])) : w("", !0),
      m("nav", yy, [
        m("button", {
          type: "button",
          class: Y(["document-tab-button", { on: T.value === "text" }]),
          "data-document-tab": "text",
          onClick: ee[1] || (ee[1] = (le) => h.value = "text")
        }, "Text", 2),
        s.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: T.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: ee[2] || (ee[2] = (le) => h.value = "comments")
        }, [
          te(y(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, y(L.value || ""), 1)
        ], 2)) : w("", !0),
        e.noun === "doc" ? (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: T.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: ee[3] || (ee[3] = (le) => h.value = "revisions")
        }, [
          ee[15] || (ee[15] = te("Revisions ", -1)),
          m("em", null, y(i.value.length || ""), 1)
        ], 2)) : w("", !0),
        ee[16] || (ee[16] = m("span", { class: "document-tabs-space" }, null, -1)),
        T.value === "text" && _.value.length > 1 ? (u(), W(Ii, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: _.value,
          "data-text-chapters": "",
          onPick: ee[4] || (ee[4] = (le) => {
            var ie;
            return (ie = D.value) == null ? void 0 : ie.showHeading(le.value);
          })
        }, null, 8, ["label", "items"])) : w("", !0)
      ]),
      m("div", by, [
        l.value ? (u(), f("p", ky, y(l.value), 1)) : o.value ? T.value === "revisions" ? (u(), W(sy, {
          key: 2,
          id: e.id,
          revisions: i.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: J,
          onRestored: B
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : T.value === "comments" ? (u(), W(Po, {
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
          "comment-more": !!I(R).nextPage.value,
          "comment-loading": I(R).loading.value,
          "comment-failure": I(R).failure.value,
          "comment-total": I(R).total.value,
          onMore: I(R).loadMore,
          onShow: ae,
          onChanged: B
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (u(), f(N, { key: 4 }, [
          A(vy, {
            ref_key: "words",
            ref: D,
            html: $.value,
            comments: P.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: p.value,
            pending: S.value,
            inline: g.value,
            onSelect: ee[7] || (ee[7] = (le) => S.value = le),
            onClear: H,
            onNumber: se,
            onWrite: ee[8] || (ee[8] = (le) => {
              var ie;
              return (ie = U.value) == null ? void 0 : ie.focus();
            }),
            onLost: ee[9] || (ee[9] = (le) => b.value = le)
          }, {
            inline: j(() => [
              k.value ? (u(), W(Ri, {
                key: 0,
                comment: k.value,
                hot: "",
                onShow: ee[6] || (ee[6] = (le) => ae(k.value.id))
              }, null, 8, ["comment"])) : w("", !0)
            ]),
            default: j(() => [
              m("dl", $y, [
                ee[18] || (ee[18] = m("h4", null, "Details", -1)),
                ee[19] || (ee[19] = m("dt", null, "State", -1)),
                m("dd", null, y(v.value), 1),
                o.value.close_reason ? (u(), f(N, { key: 0 }, [
                  ee[17] || (ee[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, y(o.value.close_reason), 1)
                ], 64)) : w("", !0),
                ee[20] || (ee[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  A(Ze, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                ee[21] || (ee[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  A(Ze, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? w("", !0) : (u(), W(Po, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": ee[10] || (ee[10] = (le) => d.value = le),
            comments: V.value,
            questions: r.value,
            hot: p.value,
            lost: b.value,
            failure: c.value,
            read: e.read,
            "comment-more": !!I(R).nextPage.value,
            "comment-loading": I(R).loading.value,
            "comment-failure": I(R).failure.value,
            "comment-total": I(R).total.value,
            onMore: I(R).loadMore,
            onShow: ae,
            onChanged: B
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (u(), f("div", wy, [
          A(Ke)
        ]))
      ]),
      o.value ? (u(), W(hv, {
        key: 1,
        ref_key: "composer",
        ref: U,
        draft: O.value,
        "onUpdate:draft": ee[11] || (ee[11] = (le) => O.value = le),
        selection: S.value,
        send: q,
        narrow: s.value,
        onClear: ee[12] || (ee[12] = (le) => S.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : w("", !0),
      C.value ? (u(), W(Qg, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: ee[13] || (ee[13] = (le) => C.value = !1),
        onSaved: ye
      }, null, 8, ["noun", "id", "row", "read"])) : w("", !0)
    ], 512));
  }
}, SS = /* @__PURE__ */ z(Sy, [["__scopeId", "data-v-784faf41"]]), _y = {
  key: 1,
  class: "row-list-failure"
}, My = ["data-row"], Cy = {
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
    const t = e, n = M(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = x(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (u(), W(Ke, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (u(), f("p", _y, y(e.failure), 1)) : !e.rows.length && e.loaded ? (u(), W(on, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        te(y(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (u(), f(N, { key: 3 }, [
      (u(), W(yt(e.arrival ? Ms : "ul"), qe(n.value, { class: "row-list" }), {
        default: j(() => [
          (u(!0), f(N, null, ne(e.rows, (i) => (u(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            me(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, My))), 128))
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
}, Ey = /* @__PURE__ */ z(Cy, [["__scopeId", "data-v-6c7ba696"]]), Ay = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Oy = {
  key: 1,
  class: "agent-rows-note"
}, Ty = {
  key: 2,
  class: "agent-rows-note"
}, Iy = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Ry = ["data-agent-row", "onClick"], By = { class: "agent-row-name" }, Ly = { class: "agent-row-state" }, Ny = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = M(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (u(), f("div", Ay, [
      e.loaded ? e.failure ? (u(), f("p", Oy, y(e.failure), 1)) : e.rows.length ? (u(), f(N, { key: 3 }, [
        m("p", Iy, y(a.value) + " running", 1),
        (u(!0), f(N, null, ne(n.value, (l) => (u(), f("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => I(Ne)(`agents:${l.id}`)
        }, [
          m("span", By, "#" + y(l.id) + " " + y(l.session), 1),
          m("span", Ly, y(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Ry))), 128))
      ], 64)) : (u(), f("p", Ty, y(e.none), 1)) : (u(), W(Ke, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, _S = /* @__PURE__ */ z(Ny, [["__scopeId", "data-v-a01e5a17"]]), ut = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, He = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, We = { across: 48, down: 110, margin: 32, labelSpace: 14 }, qy = 6;
function Gs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Dy = (e) => {
  const t = Gs(e, ut.lineChars), n = Math.max(ut.minWidth, Math.max(...t.map((a) => a.length)) * ut.charWidth + ut.padX * 2);
  return { name: e, lines: t, line: ut.line, padY: ut.padY, width: n, height: t.length * ut.line + ut.padY * 2 };
};
function Py(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, r) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(r) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function jy(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Fy(e, t, n) {
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
  for (let l = 0; l < qy; l++) {
    const i = l % 2 === 0, r = a.map((c, d) => d);
    (i ? r.slice(1) : r.slice(0, -1).reverse()).forEach((c) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], d);
    });
  }
  return a;
}
function Wy(e, t) {
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
function Hy(e) {
  const t = [...new Set(e.flatMap(([F, R]) => [F, R]))], n = new Set(e.map(([, F]) => F)), a = t.filter((F) => !n.has(F)), s = Py(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((F, R) => !s.has(R)), l = jy(t, o), i = Fy(t, o, l), r = new Map(t.map((F) => [F, Dy(F)])), c = i.map((F) => F.reduce((R, V) => R + r.get(V).width, 0) + We.across * (F.length - 1)), d = Math.max(...c) + We.margin * 2, h = Uy(e, l, i.length), p = /* @__PURE__ */ new Map();
  let g = We.margin;
  i.forEach((F, R) => {
    let V = (d - c[R]) / 2;
    const P = Math.max(...F.map((L) => r.get(L).height));
    F.forEach((L) => {
      const $ = r.get(L);
      p.set(L, { ...$, x: V, y: g + (P - $.height) / 2 }), V += $.width + We.across;
    }), g += P + (h[R] ?? We.down);
  });
  const b = e.map(([F, R, V], P) => ({ from: F, to: R, label: V || "", back: s.has(P) || l.get(R) <= l.get(F) }));
  Wy(b, p);
  const S = b.map((F) => Gy(F, p.get(F.from), p.get(F.to))), O = [...p.values()], C = Qy(S, O), D = Math.max(g - We.down, ...C.filter((F) => F.label).map((F) => F.label.y + F.label.height));
  return { width: Math.max(d - We.margin, ...C.filter((F) => F.label).map((F) => F.label.x + F.label.width)) + We.margin, height: D + We.margin, nodes: O, arrows: C };
}
const zy = (e) => e ? Gs(e, He.lineChars).length * He.line + He.pad * 2 : 0;
function Uy(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => We.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, r] = [t.get(s), t.get(o)].sort((c, d) => c - d);
    r > i && (a[i + Math.floor((r - i - 1) / 2)] += zy(l) + We.labelSpace);
  }), a.map((s) => Math.max(We.down, s));
}
function Gy(e, t, n) {
  const a = e.label ? Gs(e.label, He.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * He.charWidth + He.pad * 2 : 0, o = a.length * He.line + (a.length ? He.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, r = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, d = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + d }, { x: r, y: c - d }, { x: r, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + d} ${r} ${c - d} ${r} ${c}` };
}
const Vy = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Ky = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Yy = [0, -1, 1, -2, 2, -3, 3].map((e) => e * He.line);
function Qy(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (r, c) => {
      const d = Vy(a.curve, r);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Yy.flatMap((r) => Ky.map((c) => s(c, r))).find((r) => !n.some((c) => Wo(r, c))) ?? s(0.5, 0);
    for (; n.some((r) => Wo(i, r)); ) i.y += He.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: He.line, pad: He.pad } };
  });
}
const Wo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Xy = { class: "flowchart-tools" }, Jy = ["width", "height", "viewBox", "aria-label"], Zy = ["d"], e0 = ["x", "y", "width", "height"], t0 = ["x", "y"], n0 = ["x", "dy"], a0 = {
  key: 0,
  class: "flowchart-label"
}, s0 = ["x", "y", "width", "height"], o0 = ["x", "y"], l0 = ["x", "dy"], i0 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Hy(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = x(null), i = x({ zoom: 1, x: 0, y: 0 });
    let r = null;
    function c() {
      var C;
      const S = (C = l.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(S != null && S.width)) return;
      const O = Math.min(S.width / s.value.width, S.height / s.value.height, 1.5);
      i.value = { zoom: O, x: (S.width - s.value.width * O) / 2, y: (S.height - s.value.height * O) / 2 };
    }
    function d(S, O, C) {
      const { zoom: D, x: U, y: F } = i.value, R = Math.min(o.most, Math.max(o.least, D * S));
      i.value = { zoom: R, x: O - (O - U) * R / D, y: C - (C - F) * R / D };
    }
    function h(S) {
      const O = l.value.getBoundingClientRect();
      d(S, O.width / 2, O.height / 2);
    }
    function p(S) {
      const O = l.value.getBoundingClientRect();
      S.ctrlKey || S.metaKey ? d(S.deltaY < 0 ? o.step : 1 / o.step, S.clientX - O.left, S.clientY - O.top) : i.value = { ...i.value, x: i.value.x - S.deltaX, y: i.value.y - S.deltaY };
    }
    function g(S) {
      var O, C, D;
      S.preventDefault(), (O = window.getSelection()) == null || O.removeAllRanges(), r = { x: S.clientX - i.value.x, y: S.clientY - i.value.y }, (D = (C = l.value).setPointerCapture) == null || D.call(C, S.pointerId);
    }
    function b(S) {
      r && (i.value = { ...i.value, x: S.clientX - r.x, y: S.clientY - r.y });
    }
    return _e(c), (S, O) => (u(), W(ha, {
      title: e.title,
      large: "",
      onClose: O[4] || (O[4] = (C) => a("close"))
    }, {
      default: j(() => [
        m("div", Xy, [
          A(pe, {
            small: "",
            onClick: O[0] || (O[0] = (C) => h(o.step))
          }, {
            default: j(() => [...O[5] || (O[5] = [
              te("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            small: "",
            onClick: O[1] || (O[1] = (C) => h(1 / o.step))
          }, {
            default: j(() => [...O[6] || (O[6] = [
              te("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            small: "",
            onClick: c
          }, {
            default: j(() => [...O[7] || (O[7] = [
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
          onPointerdown: g,
          onPointermove: b,
          onPointerup: O[2] || (O[2] = (C) => uo(r) ? r.value = null : r = null),
          onPointercancel: O[3] || (O[3] = (C) => uo(r) ? r.value = null : r = null)
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
            (u(!0), f(N, null, ne(s.value.arrows, (C, D) => (u(), f("path", {
              key: `arrow-${D}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Zy))), 128)),
            (u(!0), f(N, null, ne(s.value.nodes, (C) => (u(), f("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, e0),
              m("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (u(!0), f(N, null, ne(C.lines, (D, U) => (u(), f("tspan", {
                  key: U,
                  x: C.x + C.width / 2,
                  dy: U ? C.line : 0
                }, y(D), 9, n0))), 128))
              ], 8, t0)
            ]))), 128)),
            (u(!0), f(N, null, ne(s.value.arrows, (C, D) => (u(), f(N, {
              key: `label-${D}`
            }, [
              C.label ? (u(), f("g", a0, [
                m("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, s0),
                m("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (u(!0), f(N, null, ne(C.label.lines, (U, F) => (u(), f("tspan", {
                    key: F,
                    x: C.label.x + C.label.width / 2,
                    dy: F ? C.label.line : 0
                  }, y(U), 9, l0))), 128))
                ], 8, o0)
              ])) : w("", !0)
            ], 64))), 128))
          ], 12, Jy))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, r0 = /* @__PURE__ */ z(i0, [["__scopeId", "data-v-51d24cfe"]]), Ho = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', zo = {
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
}, u0 = ["innerHTML"], c0 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => zo[t.name] || zo.dot);
    return (a, s) => (u(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, u0));
  }
}, gt = /* @__PURE__ */ z(c0, [["__scopeId", "data-v-beb5935c"]]), d0 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(gt, { name: "fold" })
    ], 2));
  }
}, mt = /* @__PURE__ */ z(d0, [["__scopeId", "data-v-d03899bb"]]), f0 = ["data-tip", "aria-label"], h0 = {
  key: 0,
  class: "mact-word"
}, m0 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (u(), f("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(gt, { name: "open" }),
      e.open ? (u(), f("span", h0, y(e.label), 1)) : w("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, f0));
  }
}, Wi = /* @__PURE__ */ z(m0, [["__scopeId", "data-v-3b292e09"]]), Hi = 120, Wn = 280, zi = 160, p0 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, v0 = ["leaving", "resizing", "entering"];
function ms(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function g0(e) {
  const t = v0.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ms(e);
  return e.classList.add(...t), n;
}
function Ui(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = x(t()), s = x("");
  let o = 0;
  const l = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function r(h, p) {
    i(h);
    const g = g0(h);
    l(h, p), h.offsetWidth, h.style.transition = `width ${Wn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Wn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, g);
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
    if (!p || !p.offsetWidth || p0()) {
      a.value = h;
      return;
    }
    const b = ms(p);
    if (l(p, b), s.value = "leaving", await n(Hi), g !== o) return;
    a.value = h, s.value = "resizing", await Pe(), r(p, b);
    const S = c(p);
    await n(Wn), S == null || S.disconnect(), g === o && (i(p), s.value = "entering", await n(zi), g === o && (s.value = ""));
  }
  return ve(t, (h) => d(h)), Ve(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const y0 = { class: "growing-card-top" }, b0 = ["aria-expanded"], k0 = { class: "growing-card-avatar" }, w0 = { class: "growing-card-title" }, $0 = { class: "growing-card-more" }, x0 = { class: "growing-card-body" }, S0 = {
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
    const n = e, a = t, s = x(!1), o = x(null), { folded: l, phase: i } = Ui(o, () => !s.value), r = M(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = M(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (u(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", I(i), { open: !I(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", y0, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (p) => s.value = !s.value)
        }, [
          m("span", k0, [
            e.bad ? (u(), W(gt, {
              key: 0,
              name: "cross"
            })) : r.value ? (u(), f(N, { key: 1 }, [
              te(y(r.value), 1)
            ], 64)) : (u(), W(ge, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", w0, y(e.title), 1),
          A(mt, { open: s.value }, null, 8, ["open"])
        ], 8, b0),
        e.action ? (u(), W(Wi, {
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
          A(ge, {
            name: "bubble",
            size: 13
          })
        ])) : w("", !0)
      ]),
      m("div", $0, [
        m("div", x0, [
          (u(!0), f(N, null, ne(c.value, (p, g) => (u(), f("p", {
            key: g,
            class: "growing-card-text"
          }, y(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, _0 = /* @__PURE__ */ z(S0, [["__scopeId", "data-v-f2b4930d"]]), M0 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, C0 = { class: "md inline" }, E0 = ["disabled", "title", "onClick"], A0 = {
  key: 1,
  class: "message-links-many"
}, O0 = ["aria-expanded"], T0 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, I0 = ["disabled", "onClick"], R0 = { class: "row-pill message-links-chip" }, B0 = { class: "message-links-title" }, L0 = { key: 0 }, Ba = 3, N0 = "task", q0 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.total || n.links.length), o = M(() => n.links.every((p) => p.endpoint.model === N0) ? "tasks" : "items"), l = x(!1), i = x(null);
    zl(i, () => l.value = !1);
    const r = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, d = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(p) {
      c(p) || (l.value = !1, Ne(p.endpoint.open_ref));
    }
    return (p, g) => (u(), f("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ba, three: s.value === Ba, open: l.value }]),
      "data-message-links": ""
    }, [
      A(gt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (u(), f("span", M0, [
        m("span", C0, [
          g[1] || (g[1] = te("Linked: ", -1)),
          (u(!0), f(N, null, ne(e.links, (b) => (u(), f("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (S) => h(b)
          }, [
            te(y(b.endpoint.model.replaceAll("_", " ")) + " " + y(b.endpoint.id), 1),
            d(b) ? (u(), f(N, { key: 0 }, [
              te(" (" + y(d(b)) + ")", 1)
            ], 64)) : w("", !0),
            c(b) ? (u(), f(N, { key: 1 }, [
              te(" (unavailable)")
            ], 64)) : w("", !0)
          ], 8, E0))), 128))
        ])
      ])) : w("", !0),
      s.value >= Ba ? (u(), f("span", A0, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: r
        }, [
          te(y(s.value) + " linked " + y(o.value) + " ", 1),
          A(mt, { open: l.value }, null, 8, ["open"])
        ], 8, O0)
      ])) : w("", !0),
      l.value ? (u(), f("div", T0, [
        (u(!0), f(N, null, ne(e.links, (b) => (u(), f("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (S) => h(b)
        }, [
          m("span", R0, y(b.endpoint.model.replaceAll("_", " ")) + " " + y(b.endpoint.id), 1),
          m("span", B0, y(b.endpoint.title), 1),
          m("span", null, y(d(b)), 1),
          c(b) ? (u(), f("span", L0, "Unavailable")) : w("", !0)
        ], 8, I0))), 128))
      ])) : w("", !0),
      A(vn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, D0 = /* @__PURE__ */ z(q0, [["__scopeId", "data-v-e9bc783c"]]), P0 = ["title", "aria-label"], j0 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, F0 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, W0 = {
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
      (u(), f("svg", j0, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (u(), f("path", F0)) : w("", !0)
      ]))
    ], 10, P0));
  }
}, H0 = /* @__PURE__ */ z(W0, [["__scopeId", "data-v-6dc92808"]]), z0 = "img,pre,table";
function U0(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function G0(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function V0(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(z0)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = U0(G0(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function K0(e, t) {
  let n = null;
  const a = () => e.value && V0(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), ve(t, a, { flush: "post" });
}
const Y0 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Q0(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Bn = /* @__PURE__ */ new WeakMap(), Qe = "work", Qt = "sent", X0 = 50, Uo = () => ({ rows: x([]), total: x(0), next: x(null), loading: x(!1), failure: x(""), version: 0 });
function J0(e) {
  var h;
  if (Bn.has(e)) return Bn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (p) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...p.views].some((b) => b.visible);
  };
  async function o(p, g, b = 1) {
    const S = p[g], O = ++S.version;
    S.loading.value = !0, S.failure.value = "";
    const C = g === Qe ? "--type about --type edited --group-counterparts" : "--type sent_to", D = `link list --source message:${p.id} ${C} --page ${b} --page-size ${g === Qe ? 10 : 25}`;
    try {
      const U = await e.read(D);
      if (t.get(p.id) !== p || S.version !== O) return;
      if (!U.ok) {
        S.failure.value = U.error;
        return;
      }
      const F = g === Qe ? U.value.counterparts ?? [] : U.value.rows ?? [], R = b === 1 ? F : [...S.rows.value, ...F], V = g === Qe ? (P) => `${P.endpoint.model}:${P.endpoint.id}` : (P) => P.id ?? P.target_id;
      S.rows.value = [...new Map(R.map((P) => [V(P), P])).values()], S.total.value = U.value.total ?? S.rows.value.length, S.next.value = U.value.next_page ?? null;
    } catch (U) {
      S.version === O && (S.failure.value = U.message);
    } finally {
      S.version === O && (S.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const p = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of p) {
      const b = [...g.dirty];
      g.dirty.clear();
      for (const S of b) o(g, S);
    }
  }
  function i(p, g = [Qe, Qt]) {
    for (const b of g) p.dirty.add(b);
    s(p) && (n.add(p.id), a ?? (a = setTimeout(l, 0)));
  }
  function r(p) {
    const g = p.sources ?? (p.source_model && Number.isInteger(p.source_id) ? [{ model: p.source_model, id: p.source_id }] : []), b = p.link_types ?? (p.link_type ? [p.link_type] : []), S = b.length ? [Qe, Qt].filter((C) => C === Qe ? b.some((D) => ["about", "edited"].includes(D)) : b.includes("sent_to")) : [Qe, Qt];
    if (!S.length) return;
    const O = g.length ? [...new Set(g.filter((C) => C.model === "message").map((C) => C.id))].map((C) => t.get(C)).filter(Boolean) : [...t.values()].filter(s).slice(0, X0);
    for (const C of O) i(C, S);
  }
  const c = (h = e.follow) == null ? void 0 : h.call(e, ["link.*"], r), d = {
    attach(p, g) {
      let b = t.get(p);
      return b || (b = { id: p, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Qe, Qt]), work: Uo(), sent: Uo() }, t.set(p, b)), b.views.add(g), b.dirty.size && i(b, [...b.dirty]), b;
    },
    shown(p) {
      p.dirty.size && i(p, [...p.dirty]);
    },
    detach(p, g) {
      p.views.delete(g), p.views.size || t.delete(p.id), t.size || (clearTimeout(a), c == null || c(), Bn.delete(e));
    },
    more(p, g) {
      const b = p == null ? void 0 : p[g];
      if (b != null && b.next.value && !b.loading.value) return o(p, g, b.next.value);
    }
  };
  return Bn.set(e, d), d;
}
function Z0(e, t, n) {
  const a = Xe(null);
  let s = null;
  const o = ve(t, (l, i, r) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = J0(e);
    const c = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, c);
    a.value = d;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      c.visible = g.some((b) => b.isIntersecting), c.visible && s.shown(d);
    }, { rootMargin: "100px" }), p = ve(n, (g) => {
      h == null || h.disconnect(), g && (h == null || h.observe(g));
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Qe),
    loadSent: () => s == null ? void 0 : s.more(a.value, Qt)
  };
}
const eb = ["data-incoming", "data-ref"], tb = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], nb = { class: "message-body" }, ab = ["title"], sb = ["innerHTML"], ob = ["title"], lb = ["innerHTML"], ib = {
  class: "message-faces",
  "data-message-faces": ""
}, rb = ["title", "data-face", "onClick"], ub = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, cb = ["title", "data-reaction", "onClick"], db = {
  key: 0,
  class: "message-reaction-count"
}, fb = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, hb = ["href", "title"], mb = ["src", "alt"], pb = ["href"], vb = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, gb = ["disabled", "data-sent-worker", "title", "onClick"], yb = { class: "message-foot" }, bb = { class: "message-time" }, kb = {
  class: "message-id",
  "data-message-id": ""
}, wb = 140, $b = 2, xb = 1500, Sb = "An earlier message", _b = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(!1), o = x(null), l = M(() => ["user", "comment"].includes(n.message.type)), i = M(() => {
      const [ee, le] = (n.message.commented_row || ":").split(":"), ie = ht(ee);
      return ie ? { ref: `${ie}:${le}`, label: `${Gt(ie).title.toLowerCase()} ${le}` } : null;
    }), r = M(() => n.message.worker_id ?? null), c = x(!1), d = M(() => r.value !== null && ((n.message.text ?? "").length > wb || (n.message.text ?? "").split(`
`).filter((ee) => ee.trim()).length > $b)), h = M(() => l.value && !n.message.read_at && !n.message.local);
    async function p() {
      var ee;
      await ((ee = navigator.clipboard) == null ? void 0 : ee.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, xb);
    }
    const g = gi(), b = M(() => g(n.message.text ?? "")), S = M(() => JSON.parse(n.message.flowchart_edges || "[]")), O = x(!1), C = M(() => g(n.quote || Sb));
    function D() {
      const ee = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ee ? ee.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    K0(o, () => `${n.message.text} ${n.quote}`);
    const U = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, F = (ee) => `/api/files/message/${n.message.id}/${encodeURIComponent(ee)}`, R = M(() => JSON.parse(n.message.captions || "{}")), V = M(() => (n.message.files ?? []).map((ee) => ({ name: ee, address: F(ee), isImage: U.test(ee), title: R.value[ee] || ee }))), P = M(() => Mi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), L = Ee(De, null), { links: $, total: _, more: k, loading: v, failure: T, sentTo: E, sentMore: B, sentLoading: q, sentFailure: J, loadMore: H, loadSent: se } = Z0(L, () => l.value && !n.message.local ? n.message.id : null, o), ae = x(!1), ye = M(() => Q0(n.message.reactions));
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
      A(_0, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: le[0] || (le[0] = (ie) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, eb)) : (u(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", nb, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: le[6] || (le[6] = (...ie) => I(Lt) && I(Lt)(...ie))
        }, [
          i.value ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: le[1] || (le[1] = xe((ie) => I(Ne)(i.value.ref), ["stop"]))
          }, [
            A(ge, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + y(i.value.label), 1)
          ], 8, ab)) : w("", !0),
          e.message.parent_id ? (u(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(D, ["stop"]),
            innerHTML: C.value
          }, null, 8, sb)) : w("", !0),
          r.value !== null ? (u(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${r.value}`,
            onClick: le[2] || (le[2] = xe((ie) => I(Ne)(`agents:${r.value}`), ["stop"]))
          }, "Worker " + y(r.value), 9, ob)) : w("", !0),
          m("div", {
            class: Y({ "message-folded": d.value && !c.value }),
            "data-message-text": "",
            innerHTML: b.value
          }, null, 10, lb),
          d.value ? (u(), f("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: le[3] || (le[3] = xe((ie) => c.value = !c.value, ["stop"]))
          }, y(c.value ? "Show less" : "Show more"), 1)) : w("", !0),
          S.value.length ? (u(), f(N, { key: 4 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: le[4] || (le[4] = (ie) => O.value = !0)
            }, "Open the flowchart"),
            O.value ? (u(), W(r0, {
              key: 0,
              title: e.message.text,
              edges: S.value,
              onClose: le[5] || (le[5] = (ie) => O.value = !1)
            }, null, 8, ["title", "edges"])) : w("", !0)
          ], 64)) : w("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: ae.value }]),
          "data-message-tools": ""
        }, [
          ae.value ? (u(), f(N, { key: 0 }, [
            m("div", ib, [
              (u(!0), f(N, null, ne(I(Y0), (ie) => (u(), f("button", {
                key: ie,
                type: "button",
                class: "message-face",
                title: `React ${ie}`,
                "data-face": ie,
                onClick: (et) => fe(ie)
              }, y(ie), 9, rb))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: le[7] || (le[7] = (ie) => ae.value = !1)
            }, [
              A(ge, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (u(), f(N, { key: 1 }, [
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
            }, y(s.value ? "Copied" : "Copy"), 1),
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
      ye.value.length ? (u(), f("div", ub, [
        (u(!0), f(N, null, ne(ye.value, (ie) => (u(), f("button", {
          key: ie.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: ie.mine }]),
          title: ie.title,
          "data-reaction": ie.emoji,
          onClick: (et) => a("react", e.message, ie.emoji)
        }, [
          te(y(ie.emoji) + " ", 1),
          ie.count > 1 ? (u(), f("span", db, y(ie.count), 1)) : w("", !0)
        ], 10, cb))), 128))
      ])) : w("", !0),
      V.value.length ? (u(), f("div", fb, [
        (u(!0), f(N, null, ne(V.value, (ie) => (u(), f(N, {
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
            }, null, 8, mb)
          ], 8, hb)) : (u(), f("a", {
            key: 1,
            href: ie.address,
            target: "_blank",
            class: "message-file"
          }, y(ie.name), 9, pb))
        ], 64))), 128))
      ])) : w("", !0),
      I(E).length ? (u(), f("div", vb, [
        A(ge, {
          name: "send",
          size: 12
        }),
        (u(!0), f(N, null, ne(I(E), (ie) => (u(), f("button", {
          key: ie.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ie.unavailable || !ie.open_ref,
          "data-sent-worker": ie.id,
          title: `Open worker ${ie.id}`,
          onClick: xe((et) => ie.open_ref && I(Ne)(ie.open_ref), ["stop"])
        }, [
          te("Also sent to worker " + y(ie.id), 1),
          ie.unavailable ? (u(), f(N, { key: 0 }, [
            te(" (unavailable)")
          ], 64)) : w("", !0)
        ], 8, gb))), 128))
      ])) : w("", !0),
      A(vn, {
        more: I(B),
        loading: I(q),
        failure: I(J),
        label: "More recipients",
        onMore: I(se)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", yb, [
        m("time", bb, y(P.value), 1),
        Number.isInteger(e.message.id) ? (u(), f(N, { key: 0 }, [
          le[11] || (le[11] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", kb, "message " + y(e.message.id), 1)
        ], 64)) : w("", !0),
        l.value ? (u(), W(H0, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : w("", !0)
      ]),
      I($).length || I(T) ? (u(), W(D0, {
        key: 3,
        links: I($),
        total: I(_),
        more: I(k),
        loading: I(v),
        failure: I(T),
        onMore: I(H)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : w("", !0)
    ], 8, tb));
  }
}, MS = /* @__PURE__ */ z(_b, [["__scopeId", "data-v-0be1107c"]]), ta = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], La = 200, Gi = (e) => {
  var t;
  return ((t = ta.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ta[0].key;
}, CS = (e) => {
  var t;
  return ((t = ta.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Mb = ["aria-label"], Cb = 300, Go = 400, Eb = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: La } },
  setup(e) {
    const t = e, n = M(() => Gi(t.value)), a = M(() => n.value < La ? [1, 0.25, 0.25] : n.value === La ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (u(), f("svg", {
      class: Y(["ico", "prio", { hot: n.value >= Go, high: n.value >= Cb && n.value < Go }]),
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
    ], 10, Mb));
  }
}, ES = /* @__PURE__ */ z(Eb, [["__scopeId", "data-v-b10e610f"]]), Ab = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Vo = (e) => Ab[e.card.state] || "idle", Ob = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Ko = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Yo = (e, t) => Ko[Vo(e)] - Ko[Vo(t)], Qo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, AS = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Yo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Ob(a, s)) : [...e].sort((a, s) => Yo(a, s) || (Qo[t] || Qo.state)(a, s)), Tb = { class: "list-row" }, Ib = {
  key: 0,
  class: "list-row-type"
}, Rb = { class: "list-row-main" }, Bb = {
  key: 0,
  class: "list-row-title"
}, Lb = { class: "list-row-body" }, Nb = {
  key: 1,
  class: "list-row-end"
}, qb = {
  key: 1,
  class: "list-row-text"
}, Db = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (u(), f("div", Tb, [
      e.type ? (u(), f("span", Ib, y(e.type), 1)) : w("", !0),
      m("div", Rb, [
        e.title ? (u(), f("span", Bb, y(e.title), 1)) : w("", !0),
        m("div", Lb, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (u(), f("div", Nb, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : w("", !0)
      ]),
      e.text ? (u(), f("span", qb, y(e.text), 1)) : w("", !0)
    ]));
  }
}, OS = /* @__PURE__ */ z(Db, [["__scopeId", "data-v-dfc8c3a7"]]), TS = {
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
    return (l, i) => (u(), W(Ii, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (r) => a("pick", r.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Pb = {
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
}, Vi = /* @__PURE__ */ z(Pb, [["__scopeId", "data-v-978e0921"]]), jb = ["aria-label"], Fb = { class: "head" }, Wb = { class: "names" }, Hb = { class: "body" }, zb = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ti(a, n), i = ni(s);
    return (r, c) => (u(), W(ca, { to: "body" }, [
      A(zt, {
        name: "side",
        appear: "",
        onAfterLeave: I(l)
      }, {
        default: j(() => [
          I(s) ? (u(), f("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: be({ "--depth": e.depth, zIndex: I(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...d) => I(o) && I(o)(...d), ["self"]))
          }, [
            m("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (u(), f(N, { key: 0 }, [
                m("header", Fb, [
                  m("div", Wb, [
                    m("h2", null, y(e.title), 1),
                    e.abstract ? (u(), W(at, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : w("", !0)
                  ]),
                  me(r.$slots, "actions", {}, void 0, !0),
                  A(fa, {
                    title: e.closeLabel,
                    onClick: I(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                r.$slots.foot ? (u(), W(Vi, { key: 0 }, {
                  default: j(() => [
                    me(r.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : w("", !0),
                m("div", Hb, [
                  me(r.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : me(r.$slots, "default", {}, void 0, !0, 1)
            ], 10, jb)
          ], 6)) : w("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, IS = /* @__PURE__ */ z(zb, [["__scopeId", "data-v-f276f055"]]), Ub = {
  key: 1,
  class: "text-field-label"
}, Gb = {
  key: 2,
  class: "text-field-end"
}, Vb = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Dt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = sn(e, "modelValue"), a = ua(), s = "onUpdate:modelValue" in (((d = Xr()) == null ? void 0 : d.vnode.props) || {}), o = M(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = M(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), r = M(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = x(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (u(), f("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, I(a).class]),
      style: be(I(a).style)
    }, [
      e.icon ? (u(), W(ge, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : w("", !0),
      e.label ? (u(), f("span", Ub, y(e.label), 1)) : w("", !0),
      Je(m("input", qe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [I(is), o.value]
      ]),
      h.$slots.end ? (u(), f("span", Gb, [
        me(h.$slots, "end", {}, void 0, !0)
      ])) : w("", !0)
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
}), RS = /* @__PURE__ */ z(Vb, [["__scopeId", "data-v-d9c38ca8"]]), Kb = { class: "title" }, Yb = { class: "state" }, Qb = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ns(t.line, t.events);
    return (o, l) => (u(), W(Ey, {
      rows: I(n),
      failure: I(a),
      loaded: I(s),
      empty: e.empty
    }, {
      default: j(({ row: i }) => [
        m("span", Kb, y(i.title), 1),
        m("span", Yb, y(I(ln)(e.noun, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, BS = /* @__PURE__ */ z(Qb, [["__scopeId", "data-v-9191a6f0"]]);
function Xb(e = 1e3, t = null) {
  const n = x(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ve(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const Na = x(Date.now() / 1e3);
let Xo = 0, Ln = 0;
function Vs() {
  return Ln || (Na.value = Date.now() / 1e3, Xo = setInterval(() => Na.value = Date.now() / 1e3, 1e3)), Ln += 1, Ol() && da(() => {
    Ln -= 1, Ln || clearInterval(Xo);
  }), Na;
}
const Jb = 200, Zb = Hi + Wn + zi + Jb;
function Kt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function ek(e, t, n) {
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
function tk(e, t, n, a) {
  ve(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function r() {
      if (a.markMotion.value) {
        if (i.push(ek(o, l, n.value)), performance.now() - l < Zb) return void requestAnimationFrame(r);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    r();
  }, { flush: "sync" });
}
const nk = ["title", "data-figure-mark", "data-folded", "data-open"], ak = {
  key: 2,
  class: "worker"
}, sk = { class: "head" }, ok = { key: 0 }, lk = {
  key: 3,
  class: "status"
}, ik = {
  key: 0,
  class: "figure"
}, rk = {
  key: 1,
  class: "ran-for"
}, uk = { key: 2 }, ck = {
  key: 3,
  class: "news"
}, dk = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, fk = {
  key: 6,
  class: "settled"
}, hk = {
  key: 1,
  class: "bar"
}, mk = {
  key: 3,
  class: "detail body"
}, pk = {
  key: 0,
  class: "body-label"
}, vk = ["title"], gk = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ua(), a = ["onClick", "onAct"], s = M(() => Object.fromEntries(Object.entries(n).filter(([se]) => !a.includes(se)))), o = x(!1), l = M(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = M(() => t.open !== void 0), r = M(() => i.value || l.value), c = M(() => i.value ? t.open : o.value), d = M(() => i.value ? !t.open : l.value && !o.value), h = M(() => !!(t.mark.action && n.onAct)), p = M(() => r.value || h.value || !!n.onClick), g = x(null), b = x(null), { folded: S, phase: O } = Ui(g, () => d.value);
    tk(g, d, O, Ee(De, null));
    function C(se) {
      var ae, ye;
      if (!(se.target !== g.value && !b.value.contains(se.target))) {
        if (i.value) return (ae = n.onClick) == null ? void 0 : ae.call(n, se);
        if (l.value) return void (o.value = !o.value);
        (ye = n.onAct || n.onClick) == null || ye(se);
      }
    }
    const D = (se) => n.onAct(se), U = ["failed", "unfinished"], F = M(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), R = M(() => t.mark.color ? t.mark.color : F.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : F.value ? `var(--tone-${F.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), V = M(() => R.value || "var(--tone-work)"), P = M(() => !t.mark.ending && !t.mark.ended && F.value !== "stopped"), L = Vs(), $ = M(
      () => t.mark.began_at && P.value && !t.mark.figure && !t.mark.counting ? Ci(L.value - t.mark.began_at) : ""
    ), _ = M(() => {
      const { started: se, ended: ae } = t.mark;
      return se ? ae ? `ran ${qo(ae - se, !0)}` : qo(L.value - se, !0) : $.value;
    }), k = ["bad", "danger", "warn"], v = M(() => k.includes(F.value) || t.mark.asks ? "attention" : P.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), T = ["bad", "danger"], E = M(() => T.includes(F.value)), B = M(() => v.value === "process" ? "running" : E.value ? "cross" : F.value === "stopped" ? "stopped" : F.value === "good" ? "tick" : ""), q = M(
      () => !!(t.mark.figure || _.value || t.mark.docked || t.mark.stopping || B.value || t.mark.settled || t.mark.news)
    ), J = M(() => [t.mark.title, t.mark.time ? Mi(t.mark.time) : ""].filter(Boolean).join(" · ")), H = M(() => ({
      ...R.value ? { "--mark": R.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (se, ae) => (u(), f("div", qe(s.value, {
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
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: R.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: H.value,
      title: J.value,
      "data-figure-mark": e.mark.key,
      "data-folded": I(S) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (u(), W(yt(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": r.value ? String(!!c.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (u(), W(gt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (u(), W(ge, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (u(), f("span", ak, y(e.mark.worker), 1)) : w("", !0),
          m("span", sk, [
            A(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (u(), f("strong", ok, y(e.mark.name), 1)) : w("", !0),
            r.value ? (u(), W(mt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : w("", !0)
          ]),
          q.value ? (u(), f("span", lk, [
            e.mark.figure ? (u(), f("span", ik, y(e.mark.figure), 1)) : w("", !0),
            _.value ? (u(), f("span", rk, y(_.value), 1)) : w("", !0),
            e.mark.stopping ? (u(), f("span", uk, "Stopping")) : w("", !0),
            e.mark.news ? (u(), f("span", ck, y(e.mark.news), 1)) : w("", !0),
            B.value === "running" ? (u(), f("span", dk)) : B.value ? (u(), W(gt, {
              key: 5,
              class: Y(["sign", B.value]),
              name: B.value
            }, null, 8, ["class", "name"])) : w("", !0),
            e.mark.settled ? (u(), f("span", fk, y(e.mark.settled), 1)) : w("", !0)
          ])) : w("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (u(), W(Wi, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(D, ["stop"])
      }, null, 8, ["label", "open"])) : w("", !0),
      (e.mark.figure || e.mark.counting) && P.value ? (u(), f("span", hk, [
        m("span", {
          class: "progress",
          style: be({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: V.value })
        }, null, 4)
      ])) : w("", !0),
      e.mark.detail && !I(S) ? (u(), W(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      e.mark.body && !I(S) ? (u(), f("div", mk, [
        e.mark.bodyLabel ? (u(), f("p", pk, y(e.mark.bodyLabel), 1)) : w("", !0),
        A(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : w("", !0),
      e.mark.command && !I(S) ? (u(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, y(e.mark.command), 9, vk)) : w("", !0),
      e.mark.card ? (u(), W(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : w("", !0),
      me(se.$slots, "default", {
        shown: !I(S)
      }, void 0, !0)
    ], 16, nk));
  }
}), Ki = /* @__PURE__ */ z(gk, [["__scopeId", "data-v-2aa9c496"]]), yk = 8, bk = 40, kk = [];
class Ks {
  constructor(t, n, { top: a = yk, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && kk.push(this);
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
    n > bk && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await Pe(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await Pe();
  }
}
const wk = 60, $k = 300, Yi = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Qi(e, t) {
  const n = x([]), a = x(0);
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
  const c = new Ks("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => $k, more: () => a.value > 0, previous: r }, { top: wk });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const xk = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Xi(e) {
  var n;
  const t = xk[e] || ((n = Gt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Sk = (e) => Xi(String(e).split(":")[0]), _k = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Mk = { passed: "good", failed: "danger", warned: "warn", running: "" }, Ck = { good: "good", warn: "warn", danger: "danger" }, Jo = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Bf(e.target_model, e.target_id || 0)
}, Ek = { "open row": (e) => Sk(e.target_model), "open page": () => Xi("pages") };
function Ak(e, t) {
  const n = t || {}, a = Jo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Mk[e.outcome] || "" : Ck[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Ek[a](e) : "",
    handlers: a ? { onAct: () => Jo[a](e) } : {}
  };
}
const Ok = 24, Tk = 1e3, Zo = 2e3, Ik = 0.25, Rk = 5e3;
function Bk(e, t = Ok, n = () => !0) {
  const a = x(!1), s = x(0), o = x(!1);
  let l = 0, i = 0, r = 0;
  const c = () => e && "value" in e ? e.value : e, d = () => {
    const F = c();
    return F ? F.scrollHeight - F.scrollTop - F.clientHeight : 0;
  }, h = () => !c() || d() <= t;
  function p(F) {
    if (clearTimeout(l), !F) {
      o.value = !1, r = Date.now();
      return;
    }
    const R = Date.now() - r < Zo ? Zo : Tk;
    l = setTimeout(() => o.value = a.value, R);
  }
  function g() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(F = !1) {
    const R = c();
    R && F && R.scrollTo ? R.scrollTo({ top: R.scrollHeight, behavior: "smooth" }) : R && (R.scrollTop = R.scrollHeight), g();
  }
  function S() {
    C(), !a.value && (a.value = !0, p(!0));
  }
  const O = () => !!c() && d() <= c().clientHeight * Ik;
  function C() {
    clearTimeout(i), O() && (i = setTimeout(() => a.value && O() && n() && b(!0), Rk));
  }
  function D() {
    h() ? g() : S();
  }
  function U(F = 1, R = !1) {
    a.value ? s.value += Math.max(0, F) : b(R);
  }
  return Ol() && da(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: h, follow: g, toBottom: b, left: S, scrolled: D, arrived: U };
}
const Lk = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Nk = (e) => String(e ?? "").replace(Lk, ""), qk = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(null), { away: o, scrolled: l, arrived: i, toBottom: r } = Bk(s);
    ve(
      () => n.lines.length,
      () => Pe(() => {
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
      te(y(I(Nk)(e.lines.join(`
`)) || e.empty), 1),
      I(o) ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => I(r)(!0))
      }, "Follow")) : w("", !0)
    ], 544));
  }
}, Dk = /* @__PURE__ */ z(qk, [["__scopeId", "data-v-5a8693fe"]]), Pk = "*.*", jk = {
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
    const t = e, n = Ee(De, null), a = new Fl();
    ve(
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
      events: l.value ? [Pk] : t.declaration.events ?? [],
      options: []
    }));
    return (r, c) => l.value ? (u(), W(Pi, {
      key: 0,
      entry: i.value,
      subscriptions: I(a),
      environment: I(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (u(), W(Di, {
      key: 1,
      entry: i.value,
      subscriptions: I(a),
      environment: I(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Fk = { class: "mark-more-inner" }, Wk = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Hk = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, zk = {
  key: 3,
  class: "mark-lines"
}, Uk = "process", el = "task", Gk = {
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
    ), s = M(() => _k.has(t.mark.variant) && t.mark.detail || ""), o = M(() => t.mark.target_model === el ? t.mark.target_id : 0), l = Qi(
      Yi(n),
      () => t.mark.target_id
    ), i = l.lines, r = x(!1), c = x(""), d = M(() => !t.declaration.body_url && t.mark.target_model === Uk && !!t.mark.target_id);
    async function h(g = l.follow) {
      const b = await g();
      r.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = M(() => t.shown && d.value);
    return ve(p, (g) => g && h()), Es(() => p.value && h(), () => p.value && !t.mark.ended_at), ve(
      () => t.mark.ended_at,
      (g) => g && p.value && h(l.newest)
    ), (g, b) => (u(), f("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = xe(() => {
      }, ["stop"]))
    }, [
      m("div", Fk, [
        e.declaration.body_url ? (u(), W(jk, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (u(), f(N, { key: 1 }, [
          s.value ? (u(), f(N, { key: 0 }, [
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", Wk, y(s.value), 1)
          ], 64)) : w("", !0),
          d.value && c.value ? (u(), f("p", Hk, y(c.value), 1)) : d.value && r.value ? (u(), f(N, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            A(Dk, {
              class: "mark-terminal",
              lines: I(i),
              feed: I(l).feed,
              onOlder: I(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (u(), f("p", zk, y(a.value.join(`
`)), 1)) : w("", !0),
          o.value ? (u(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = xe((S) => I(Ne)(`${el}:${o.value}`), ["stop"]))
          }, " Open task " + y(o.value) + " and its proofs ", 1)) : w("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ps = /* @__PURE__ */ z(Gk, [["__scopeId", "data-v-df71b15a"]]), Vk = ["title", "aria-label", "onClick"], Kk = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Yk = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = M(() => of(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = x(""), s = Ee(De);
    async function o(l) {
      const i = await gn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (u(), f(N, null, [
      (u(!0), f(N, null, ne(n.value, (r) => (u(), f("button", {
        key: r.runs,
        type: "button",
        class: "mark-button",
        title: r.label,
        "aria-label": r.label,
        onClick: xe((c) => o(r), ["stop"])
      }, [
        A(gt, {
          name: r.icon
        }, null, 8, ["name"])
      ], 8, Vk))), 128)),
      a.value ? (u(), f("span", Kk, y(a.value), 1)) : w("", !0)
    ], 64));
  }
}, Qk = /* @__PURE__ */ z(Yk, [["__scopeId", "data-v-7a62c88e"]]);
function Ji(e, t) {
  const n = Xe(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ce.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Zi = Ji("/api/marks", "marks"), LS = Zi.fetchAll, Xk = Zi.find, Jk = ["data-ref"], Zk = ["data-ref"], ew = { class: "mark-row" }, tw = "dock add", nw = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = M(() => Xk(a.mark.type)), o = M(() => Ak(a.mark, s.value)), l = M(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), i = x(!1);
    function r(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      i.value = !i.value;
    }
    const c = M(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((h) => {
        var p;
        return !a.docked || !((p = h.runs) != null && p.startsWith(tw));
      }).map((h) => ({ ...h, module: s.value.module }));
    });
    return (d, h) => {
      var p, g;
      return (p = s.value) != null && p.card ? (u(), f("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": I(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(ps, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Jk)) : (u(), f("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": I(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", ew, [
          A(Ki, qe({
            mark: o.value,
            open: l.value ? i.value : void 0
          }, Jr(o.value.handlers), { onClick: r }), Zr({ _: 2 }, [
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
          A(Qk, {
            buttons: c.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Zk));
    };
  }
}, aw = /* @__PURE__ */ z(nw, [["__scopeId", "data-v-afd7d6b1"]]), sw = ["data-ref"], ow = ["inert"], lw = { class: "group-fold" }, iw = { class: "thread-group" }, rw = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = x(!1), a = x(!1), s = x(!1), o = x(null);
    ve(n, async (i) => {
      var r;
      a.value = !0, await Pe(), (r = o.value) == null || r.offsetHeight, s.value = i;
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
      A(Ki, {
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
        m("div", lw, [
          m("div", iw, [
            (u(!0), f(N, null, ne(e.group.marks, (c) => (u(), W(aw, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, ow)) : w("", !0)
    ], 8, sw));
  }
}, NS = /* @__PURE__ */ z(rw, [["__scopeId", "data-v-45b58b9b"]]);
function uw(e) {
  const t = x(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), Ve(() => n.disconnect()), t;
}
const cw = { class: "chat-dock-fold" }, dw = ["aria-label"], fw = { class: "chat-dock-head" }, hw = { class: "chat-dock-inner" }, mw = { class: "chat-dock-foot" }, er = 700, pw = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = x(null), a = x(null), s = uw(a), o = x(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, er)), Ve(() => clearTimeout(l)), t({ card: n }), (i, r) => (u(), f("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", cw, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          me(i.$slots, "edge", {}, void 0, !0),
          m("header", fw, [
            me(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", hw, [
              m("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: be(I(s) === null ? null : { height: `${I(s)}px` })
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
          m("footer", mw, [
            me(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, dw)
      ])
    ], 2));
  }
}, tr = /* @__PURE__ */ z(pw, [["__scopeId", "data-v-ea4dd536"]]), vw = {
  class: "dock-leave",
  "aria-hidden": "true"
}, qa = 5, gw = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(qa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${qa}s`, animationDelay: `${(n - qa).toFixed(2)}s` };
    return (s, o) => (u(), f("span", vw, [
      m("i", { style: a })
    ]));
  }
}, nr = /* @__PURE__ */ z(gw, [["__scopeId", "data-v-2a7bc150"]]), yw = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), vs = (e) => e.charAt(0).toUpperCase() + e.slice(1), bw = (e) => vs(e.replace(/_at$/, "").replaceAll("_", " ")), kw = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, ww = (e, t, n) => [vs(`${e} ${n}`), (t == null ? void 0 : t.state) && vs(t.state)].filter(Boolean).join(" · "), ar = (e) => e.given_name || `${Yn(e.role)} ${e.id}`, $w = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? ar(t) : (e == null ? void 0 : e.name) ?? "", xw = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? ar(t) : "", Sw = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !yw.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: bw(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], _w = { reviewing: "Under review" }, Mw = (e, t) => e || _w[t == null ? void 0 : t.state] || "", sr = Ji("/api/docks", "docks"), qS = sr.fetchAll, Rt = sr.find, Cw = 6, Ew = 3, Da = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, pa = (e) => Date.parse(e.leaves_at) / 1e3, St = (e) => !!(e.leaves_at && !e.kept), Aw = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!St(e) || t < pa(e) || n.has(e.id)), Ow = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => Aw(a, t, n)).sort((a, s) => a.id - s.id);
function Tw(e, t, n = Cw) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(pa(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Iw = (e, t, n = e) => n < 2 ? !1 : e >= Ew ? !0 : t, Rw = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), gs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Bw = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Lw = (e) => ({ ...e.kept ? gs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : gs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Nw = ["keep", "unkeep", "open", "undock"], qw = (e) => ({ ...e, iconOnly: Nw.includes(e.action) });
function Dw(e, t) {
  var n;
  return [
    ...Bw(e, t) ? [Lw(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Gt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    gs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(qw);
}
function or(e, t) {
  const n = Dw(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: Rw(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Pw = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || or(e, t).title, jw = { class: "dock-text" }, Fw = ["title"], Ww = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, Hw = {
  class: "dock-facts",
  "data-dock-facts": ""
}, zw = {
  key: 1,
  "data-dock-row": ""
}, Uw = {
  key: 2,
  class: "dock-kept"
}, Gw = { class: "dock-acts" }, Vw = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = M(() => Rt(a.item.type)), o = Vs(), l = M(() => zs(a.item.created_at, o.value * 1e3)), i = x(null), r = x(null), c = x(null), d = x(null), h = M(() => or(a.item, s.value)), p = ze(), g = M(() => `dock.${a.item.id}`), b = M(() => p.props[g.value].data.value), S = M(() => Pw(a.item, s.value, b.value)), O = M(() => Zn(a.item.target_model ?? "")), C = M(() => {
      var k;
      return ((k = s.value) == null ? void 0 : k.word) ?? "";
    }), D = M(() => ({ ...b.value, id: a.item.target_id, noun: O.value })), U = () => {
      var k, v;
      return ((v = (k = s.value) == null ? void 0 : k.reads) == null ? void 0 : v.length) && p.reload(g.value);
    };
    $c(Al, { data: b, reload: U, readOutput: Yi(p) }), ve(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (k, v, T) => {
        var B;
        U();
        const E = (B = p.subscriptions) == null ? void 0 : B.follow(`dock ${a.item.id}`, [`${O.value.replaceAll("-", "_")}.*`], (q) => {
          (!q.row_id || q.row_id === a.item.target_id) && U();
        });
        T(() => E == null ? void 0 : E());
      },
      { immediate: !0 }
    );
    const F = x(/* @__PURE__ */ new Set()), R = x("");
    async function V(k) {
      if (k.action === "undock") return n("undock", k);
      if (k.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      k.action === "declared" && (F.value = /* @__PURE__ */ new Set([...F.value, k.label])), R.value = "";
      const T = await gn(k, { id: a.item.target_id }, p.environment);
      (T == null ? void 0 : T.ok) === !1 && (F.value = new Set([...F.value].filter((E) => E !== k.label)), R.value = `Could not ${k.label.toLowerCase()}: ${T.error}`);
    }
    const P = M(() => h.value.actions.filter((k) => !F.value.has(k.label))), L = M(() => {
      var k;
      return Mw((k = s.value) == null ? void 0 : k.badge, D.value);
    }), $ = M(() => h.value.controls), _ = M(() => {
      var k;
      return !!((k = s.value) != null && k.draws_head) && !a.collapsed;
    });
    return (k, v) => {
      var T, E, B, q;
      return u(), W(tr, {
        label: h.value.title + ((T = s.value) != null && T.needs_user ? ", waiting for you" : ""),
        type: (E = s.value) != null && E.needs_user ? "waiting" : "",
        folded: !!((B = s.value) != null && B.folds) && e.folded,
        body: !!((q = s.value) != null && q.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: v[3] || (v[3] = (J) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (u(), W(nr, {
            key: 0,
            "ends-at": I(pa)(e.item)
          }, null, 8, ["ends-at"])) : w("", !0)
        ]),
        head: j(() => {
          var J;
          return [
            _.value ? (u(), f("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (u(), f(N, { key: 1 }, [
              A(ge, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", jw, [
                m("span", {
                  class: "dock-title",
                  title: S.value
                }, y(S.value), 9, Fw)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? w("", !0) : (u(), f(N, { key: 0 }, [
                te(y(l.value), 1)
              ], 64))
            ], 512),
            $.value.length ? (u(), f("span", {
              key: 2,
              class: "dock-controls",
              onClick: v[0] || (v[0] = xe(() => {
              }, ["stop"]))
            }, [
              (u(!0), f(N, null, ne($.value, (H) => {
                var se, ae;
                return u(), f(N, {
                  key: H.action + H.runs
                }, [
                  !F.value.has(H.label) && (!((se = H.variants) != null && se.length) || !((ae = D.value) != null && ae.state) || H.variants.includes(D.value.state)) ? (u(), W(pe, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: H.pressed }),
                    "aria-pressed": H.pressed,
                    "aria-label": H.label,
                    title: H.label,
                    "data-dock-action": H.action,
                    onClick: (ye) => V(H)
                  }, {
                    default: j(() => [
                      A(ge, {
                        name: H.icon,
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
          R.value || e.refusal ? (u(), f("p", Ww, y(R.value || e.refusal), 1)) : w("", !0)
        ]),
        foot: j(() => {
          var J;
          return [
            m("span", Hw, [
              L.value ? (u(), f("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, y(L.value), 3)) : w("", !0),
              C.value ? (u(), f("span", zw, y(C.value) + " " + y(e.item.target_id), 1)) : w("", !0),
              e.item.kept ? (u(), f("span", Uw, "Kept")) : w("", !0),
              m("span", {
                ref_key: "foot",
                ref: r,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (J = s.value) != null && J.folds ? (u(), W(pe, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: v[1] || (v[1] = (H) => n("fold"))
            }, {
              default: j(() => [
                te(y(s.value.folds) + " ", 1),
                A(mt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : w("", !0),
            m("span", Gw, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              A(Ds, {
                name: `dock.${e.item.type}`,
                row: D.value,
                environment: I(p).environment,
                "read-only": I(p).readOnly,
                "object-name": I(Zn)(e.item.target_model),
                "external-failure": "",
                onFailure: v[2] || (v[2] = (H) => R.value = H),
                onDone: k.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (u(!0), f(N, null, ne(P.value, (H) => (u(), W(pe, {
                key: H.action + H.runs,
                small: "",
                variant: H.primary ? "primary" : "ghost",
                bordered: !H.primary,
                "data-dock-action": H.action,
                onClick: (se) => V(H)
              }, {
                default: j(() => [
                  te(y(H.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var J;
          return [
            (J = s.value) != null && J.body_url ? (u(), W(ps, {
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
}, tl = /* @__PURE__ */ z(Vw, [["__scopeId", "data-v-dadb9f55"]]), Kw = ["title", "aria-label"], Yw = { class: "run-chip-in" }, Qw = {
  key: 0,
  class: "run-chip-ring"
}, Xw = { class: "run-chip-name" }, Jw = { class: "run-chip-bar" }, Zw = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = ze(), o = M(() => `run.${a.item.target_id}`), l = M(() => s.props[o.value].data.value), i = M(() => !l.value || l.value.state === "running" || l.value.state === "background"), r = M(() => {
      var p, g;
      return ((p = l.value) == null ? void 0 : p.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), c = M(() => i.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let h = null;
    return _e(() => {
      var p;
      d(), h = (p = s.subscriptions) == null ? void 0 : p.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), Ve(() => h == null ? void 0 : h()), (p, g) => {
      var b;
      return u(), f("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: be({ "--tone": c.value })
      }, [
        I(St)(e.item) ? (u(), W(nr, {
          key: 0,
          "ends-at": I(pa)(e.item)
        }, null, 8, ["ends-at"])) : w("", !0),
        m("span", Yw, [
          i.value ? (u(), f("span", Qw)) : (u(), W(gt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          m("span", Xw, y(r.value), 1)
        ]),
        m("span", Jw, [
          m("i", {
            style: be({ width: i.value ? `${((b = l.value) == null ? void 0 : b.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, Kw);
    };
  }
}, e2 = /* @__PURE__ */ z(Zw, [["__scopeId", "data-v-226ac6c8"]]), t2 = 24, n2 = 8, DS = 420;
function PS({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= t2 ? !0 : e < t && s > n2 ? !1 : null;
}
const a2 = (e, t) => e === void 0 ? t : e, s2 = { me: 1, people: [] }, na = Ht({
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
  people: s2,
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
ui("journal.activity", () => na.activity);
ui("journal.side.mini", () => na.sideMini);
const lr = "journal.viewer.";
function o2(e, t, n) {
  try {
    const a = n.getItem(lr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function l2(e, t, n) {
  try {
    n.setItem(lr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function nl(e, t, n = window.localStorage) {
  const a = x(o2(e, t, n));
  return ve(a, (s) => l2(e, s, n), { deep: !0 }), a;
}
const i2 = {
  key: "dock-all",
  class: "dock-all"
}, r2 = {
  key: "runs-head",
  class: "dock-runs-head"
}, u2 = { class: "dock-runs-title" }, c2 = { class: "dock-runs-chips" }, d2 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var q, J;
    const t = e, n = Xb(500), a = x(/* @__PURE__ */ new Set()), s = x(!1), o = x(!1), l = Ee(De), i = x(/* @__PURE__ */ new Set()), r = x({});
    async function c(H, se) {
      r.value = { ...r.value, [H.id]: "" }, i.value = /* @__PURE__ */ new Set([...i.value, H.id]);
      const ae = await gn(se, { id: H.target_id }, l.environment);
      (ae == null ? void 0 : ae.ok) === !1 && (i.value = new Set([...i.value].filter((ye) => ye !== H.id)), r.value = { ...r.value, [H.id]: `Could not dismiss this card: ${ae.error}` });
    }
    const d = M(
      () => Ow(
        t.items.filter((H) => !i.value.has(H.id)),
        n.value,
        a.value
      )
    ), h = M(
      () => Tw(
        d.value.filter((H) => Da(H, Rt)),
        n.value
      )
    ), p = M(() => d.value.filter((H) => !h.value.includes(H) && !Da(H, Rt))), g = M(() => h.value.filter((H) => !St(H))), b = nl(`dock-size:${((q = na.identity) == null ? void 0 : q.root) || location.host}`, null), S = (H) => {
      var se;
      return !!((se = Rt(H.type)) != null && se.needs_user);
    }, O = x(/* @__PURE__ */ new Set()), C = x(/* @__PURE__ */ new Set()), D = M(() => d.value.length === 1), U = (H) => S(H) || D.value, F = (H) => U(H) ? O.value.has(H.id) || C.value.has(H.id) : b.value ? b.value.collapsed && !b.value.opened.includes(H.id) : t.collapsed, R = M(() => d.value.some(F)), V = M(() => (s.value = Iw(h.value.length, s.value, g.value.length)) && !o.value && !d.value.some(F));
    ve(() => t.collapsed, (H) => {
      C.value = new Set(H ? d.value.filter(S).map((se) => se.id) : []);
    });
    function P() {
      const H = !R.value;
      b.value = { collapsed: H, opened: [] }, O.value = new Set(H ? d.value.filter(S).map((se) => se.id) : []), C.value = /* @__PURE__ */ new Set();
    }
    function L(H) {
      var ae;
      if (!F(H)) return;
      if (U(H)) {
        O.value = new Set([...O.value].filter((ye) => ye !== H.id)), C.value = new Set([...C.value].filter((ye) => ye !== H.id));
        return;
      }
      const se = (ae = b.value) != null && ae.collapsed ? b.value.opened : [];
      b.value = { collapsed: !0, opened: [...se, H.id] };
    }
    const $ = nl(`dock-folded:${((J = na.identity) == null ? void 0 : J.root) || location.host}`, {}), _ = (H) => {
      var se;
      return !!((se = Rt(H.type)) != null && se.folds) && (t.insidesFolded || a2($.value[H.id], Da(H, Rt) || t.folded));
    };
    function k(H) {
      $.value = { ...$.value, [H.id]: !_(H) };
    }
    function v(H) {
      $.value = { ...$.value, ...Object.fromEntries(h.value.map((se) => [se.id, se.id !== H.id])) }, o.value = !0;
    }
    function T() {
      $.value = Object.fromEntries(Object.entries($.value).filter(([H]) => !h.value.some((se) => String(se.id) === H))), o.value = !1;
    }
    function E(H) {
      a.value = /* @__PURE__ */ new Set([...a.value, H.id]);
    }
    function B(H) {
      a.value = new Set([...a.value].filter((se) => se !== H.id));
    }
    return (H, se) => (u(), W(Ms, {
      tag: "div",
      name: "dock",
      duration: I(er),
      class: "dock-stack"
    }, {
      default: j(() => [
        d.value.length > 1 ? (u(), f("div", i2, [
          A(pe, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": R.value ? "Open all" : "Collapse all",
            onClick: P
          }, {
            default: j(() => [
              A(mt, {
                open: !R.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : w("", !0),
        (u(!0), f(N, null, ne(p.value, (ae) => (u(), W(tl, {
          key: ae.id,
          item: ae,
          class: Y({ timed: I(St)(ae) }),
          leaving: I(St)(ae) && !a.value.has(ae.id),
          folded: _(ae),
          collapsed: F(ae),
          refusal: r.value[ae.id],
          onOpen: (ye) => L(ae),
          onFold: (ye) => k(ae),
          onUndock: (ye) => c(ae, ye),
          onMouseenter: (ye) => E(ae),
          onMouseleave: (ye) => B(ae)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !R.value ? (u(), f("div", r2, [
          m("span", null, y(h.value.length) + " runs", 1),
          A(pe, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: T
          }, {
            default: j(() => [
              se[1] || (se[1] = te(" Runs ", -1)),
              A(mt, { open: "" })
            ]),
            _: 1
          })
        ])) : w("", !0),
        (u(!0), f(N, null, ne(V.value ? [] : h.value, (ae) => (u(), W(tl, {
          key: ae.id,
          item: ae,
          class: Y({ timed: I(St)(ae) }),
          leaving: I(St)(ae) && !a.value.has(ae.id),
          folded: _(ae),
          collapsed: F(ae),
          refusal: r.value[ae.id],
          onOpen: (ye) => L(ae),
          onFold: (ye) => k(ae),
          onUndock: (ye) => c(ae, ye),
          onMouseenter: (ye) => E(ae),
          onMouseleave: (ye) => B(ae)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        V.value ? (u(), W(tr, {
          key: "runs-row",
          label: `${h.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            A(ge, {
              name: "runs",
              size: 14
            }),
            m("span", u2, y(h.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            m("span", c2, [
              (u(!0), f(N, null, ne(h.value, (ae) => (u(), W(e2, {
                key: ae.id,
                item: ae,
                onClick: (ye) => v(ae)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            A(pe, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: se[0] || (se[0] = (ae) => o.value = !0)
            }, {
              default: j(() => [
                se[2] || (se[2] = te(" Runs ", -1)),
                A(mt)
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
}, jS = /* @__PURE__ */ z(d2, [["__scopeId", "data-v-97a3f0b4"]]), _t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Hn = (e) => Math.min(Math.max(e, 0), 1), f2 = (e) => {
  const t = Hn(e);
  return t * t * (3 - 2 * t);
}, kt = (e, t, n) => f2((e - t) / (n - t));
function FS(e) {
  const t = Hn(e), n = Hn((t - 0.12) / 0.76) * _t.shuffles, a = Math.min(Math.floor(n), _t.shuffles - 1), s = n - a, o = kt(s, 0.26, 0.38) * (1 - kt(s, 0.76, 0.96)), l = kt(s, 0.38, 0.76), i = kt(t, 0, 0.12) * (1 - kt(t, 0.88, 1)), r = kt(s, 0.2, 0.34) * (1 - kt(s, 0.84, 1)), c = Math.sin(Math.PI * Hn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / _t.shuffles, lift: _t.lift * o, ready: i, weight: r, follow: c, shuffle: a, phase: s };
}
function WS(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const al = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, HS = (e) => al[e] ?? al.butler, Ys = 2400, h2 = 0.05;
function m2({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, h2), l = Math.min(t + Ys * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function zS(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function p2(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function US(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const GS = (e, t) => ({ ...e, stretch: t.stretch }), VS = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, ir = (e, t) => t >= (e.least ?? 0);
function KS(e, t, n) {
  if (!ir(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const YS = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), v2 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", sl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), g2 = (e) => e.right > e.left && e.bottom > e.top;
function QS(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(v2)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = sl(l, n);
    const r = o.closest("[data-figure-scroll]");
    return r && !o.closest("[data-figure-chat-foot]") && (i = sl(i, r.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), g2(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function rr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [d, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const g = t[d] - e[d];
      if (Math.abs(g) < 1e-9)
        (e[d] < o[h] || e[d] > o[p]) && (i = -1);
      else {
        const b = (o[h] - e[d]) / g, S = (o[p] - e[d]) / g;
        l = Math.max(l, Math.min(b, S)), i = Math.min(i, Math.max(b, S));
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
}, cn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), y2 = (e) => e * e * (3 - 2 * e), Te = (e, [t, n]) => y2(cn(e, t, n)), b2 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ft = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Nn = ([e, t], n) => e + n() * (t - e);
function k2(e) {
  return b2.map(() => {
    const t = Nn(ft.speed, e), n = Nn(ft.angle, e) * Math.PI / 180, a = Nn(ft.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Nn(ft.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const w2 = k2(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function $2(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ft.gravity * (t[2] - ft.floor))) / ft.gravity;
}
function XS(e, t, n = w2) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = $2(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const r = Math.min(s, l), c = a.from.map((d, h) => d + o.velocity[h] * r);
  return c[2] -= ft.gravity * r * r / 2, { at: c, turn: o.spin * r, landed: Math.max(0, s - l) / i };
}
const JS = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function ZS(e, t) {
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
const e6 = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), qt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function t6(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, i] = [t.left + qt.margin * n, t.right - qt.margin * n], r = Math.min(Math.max(e + o + s * qt.reach * n, l), i), c = r - o - e, d = r - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [r - t.left, d - t.left] };
}
function n6(e, t, n) {
  const a = Oe.bug_smash, s = Te(t, a.walk), o = ([l, i]) => l + (i - l) * s;
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
function a6(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= qt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = m2({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Le = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function s6(e) {
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
function x2(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = p2(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function o6(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: i, shot: r } = x2(n, e.length), c = e.map((C, D) => ({ ...ys(C, t, Math.min(n / o.fps, zn(D).shot)), shot: D < r })), d = Te(l / o.frames, o.aim), [h, p] = [c[Math.max(i - 1, 0)], c[i]], g = e.map((C, D) => ({ bug: C, index: D, seconds: n / o.fps - zn(D).shot, spot: ys(C, t, zn(D).shot) })).filter((C) => C.seconds >= 0), b = g.flatMap((C) => {
    const D = (s == null ? void 0 : s.get(C.index)) ?? E2(C.bug, t, C.spot, s ? [] : a);
    return s == null || s.set(C.index, D), s && A2(D, C.seconds, a), O2(D, C.seconds, a);
  }), S = g.filter((C) => M2(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), O = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: c, frame: l, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: O }, slush: b, camera: S };
}
function zn(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function l6(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let r = n.x;
  return e.map((c, d) => {
    const h = zn(d), p = ys(c, t, h.shot), g = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === r ? r - l >= i - r ? -1 : 1 : Math.sign(r - p.x), S = Math.abs(p.x - r) >= g ? r : p.x + b * g, O = b > 0 ? Math.max(r, Math.min(S, i)) : Math.min(r, Math.max(S, l)), C = { from: r, to: O, begin: h.walk, end: h.aim };
    return r = O, C;
  });
}
function i6(e, t, n) {
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
const Me = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, S2 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function _2(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const M2 = (e) => e.along * 97 % 1 < Me.camera, dn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Me.gravity * t * t });
function C2(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Me.gravity * (t.bottom - e.from.y))) / Me.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Me.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Me.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, d) => c.t - d.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Me.step) {
    const d = Math.min(c + Me.step, l.t), h = dn(e, d), p = rr(i, h, n);
    if (p) return { ...p, t: c + (d - c) * p.share };
    i = h;
  }
  const r = dn(e, l.t);
  return { ...l, x: Math.min(Math.max(r.x, t.left), t.right), y: Math.min(Math.max(r.y, t.top), t.bottom) };
}
function E2(e, t, n, a = []) {
  const s = _2(e.along + 1), [o, l] = S2[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Me.count }, () => {
    const r = i + (s() - 0.5) * 2 * (Me.spread * Math.PI / 180), c = Me.speed[0] + s() * (Me.speed[1] - Me.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(r) * c, vy: Math.sin(r) * c, r: Me.radius[0] + s() * (Me.radius[1] - Me.radius[0]) };
    return { ...d, ...C2(d, t, a) };
  });
}
function A2(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Me.step) {
      const l = Math.min(o + Me.step, s), i = rr(dn(a, o), dn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function O2(e, t, n = []) {
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
function r6(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: r } = Oe.bug_shot;
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
function u6(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, i = { x: t.x, y: t.y - l * a }, r = o / 2 * Math.sin(2 * Math.PI * s), [c, d] = [Math.cos(r * Math.PI / 180), Math.sin(r * Math.PI / 180)], h = (S) => {
    const [O, C] = [S.x - e.at.x, S.y - e.at.y];
    return { x: i.x + O * c - C * d, y: i.y + O * d + C * c };
  }, [p, g] = [...n].sort((S, O) => S.x - O.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: r, lines: b.map((S, O) => ({ from: S, to: O < b.length / 2 ? p : g })) };
}
const c6 = (e, t) => Te(t, e.grows) * (1 - Te(t, e.sinks));
function aa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: cn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: cn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function d6(e, t) {
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
const f6 = (e) => e === "pack_box";
function h6(e) {
  const { into: t, out: n } = aa(Oe.rope_swing, e);
  return 1 - Te(t, [0, 1]) * (1 - Te(n, [0, 1]));
}
function m6(e) {
  const t = Oe.rope_swing, { into: n, out: a } = aa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Te(n, [0, 1]) * (1 - Te(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const T2 = { after: 3 }, Qs = 10, I2 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, R2 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, B2 = { weight: 19 }, ur = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, L2 = { every: 120 }, cr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, dr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, N2 = {
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
}, wn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Qs }), re = (e, t, n = {}) => wn(e, "clip", t, n), Pa = (e, t, n = {}) => wn(e, "look", t, n), ol = (e, t, n = {}) => wn(e, "gaze", t, n), ke = (e, t, n = {}, a = {}) => ({ ...wn(e, "pick", t, n), ...a }), $e = (e) => wn("nothing", "nothing", e, {}), q2 = 120, D2 = 300, ja = (e, t) => ({ ...re(e, t), cooldown: D2 }), de = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), P2 = () => [re("joy", 2)], wt = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), $t = (e) => ({ ...e, cooldown: I2[e.name] }), Yt = (e) => ({ ...e, shenanigan: !0, lasts: R2[e.name] }), va = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...de("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), $e(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...de("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...$t(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...$t(re("bug_smash", 2)), toward: "", onto: !1 },
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
  ...de("reported", { cooldown: 90 }, [ol("read", 3), re("nod", 1), $e(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...de("read_message", { cooldown: 30 }, [ol("read", 3), $e(1)]),
  ...de("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), $e(6)]),
  ...de("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), $e(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...de("bar_done", { holds: !0 }, P2()),
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
  ...Object.entries(N2).flatMap(([e, t]) => de(`reacted:${e}`, {}, [Pa(t, 1)])),
  ...Object.entries(cr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => de(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(dr).flatMap(([e, t]) => de(`agent_reacted:${e}`, {}, [re(t, 1)])),
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
    $e(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...de("held:search", { cooldown: q2 }, [ja("search", 3), { ...ja("binoculars", 2), when: { home: !0 } }, { ...ja("glass_bubble", 2), when: { bubble: !0 } }]),
  ...de("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...de("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...de("spell", {}, [ke("writing", 12, { state: "writing" }), ke("reading", 12, { state: "reading" }), ke("searching", 12, { state: "searching" }), $e(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...de("tickled", {}, [{ ...$t(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...de("eager", {}, [re("eager", 2, { slow: !0 }), $e(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...de("jump", {}, [Yt($t(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...de("climb", {}, [ke("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...de("unit", { cooldown: ur.build.cooldown }, [ke("unit", B2.weight), $e(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...de("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...de("perch", {}, [{ ...ke("hang", 1, { hands: !0, free: !0 }), cooldown: L2.every }, ke("stand", 5)]),
  // a digit a blow's dust lets out
  ...de("digit", {}, [ke("0", 1), ke("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...de("roam", {}, [
    ke("rest", 35, {}, { stay: [25, 60] }),
    ke("seat", 15, {}, { stay: [15, 40] }),
    ke("edge", 25, {}, { stay: [8, 20] }),
    Yt(ke("bubble", 15, {}, { stay: [30, 80] })),
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
    Yt($t(ke("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], fr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), hr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), j2 = (e) => Array.isArray(e) ? e[0] : e, F2 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, W2 = (e) => va.some((t) => t.when.moment === e);
function H2(e) {
  var c;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || hr(d).every(([h, p]) => n(h) >= j2(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = va.filter((d) => fr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= T2.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, r = i.filter((d) => {
    var h;
    return d.type === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return r.some((d) => d.type !== "nothing") ? r : i;
}
function Ge(e, t) {
  const n = H2(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (mr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function mr(e, t, n) {
  var a;
  for (const [s, o] of hr(t)) (a = e.memory) == null || a.set(s, e.now + F2(o, n));
}
function p6(e, t, n) {
  mr(e, va.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const v6 = (e) => Object.values(ur).find((t) => fr(t.when, e)) ?? null, z2 = (e, t, n) => n - t <= (e.lifetime ?? Qs), g6 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || ir(e.clip, t));
class pr {
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
}, y6 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), vr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), b6 = {
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
}, k6 = 120, U2 = 20, w6 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < U2), G2 = (e) => bs[e] || bs.idle, $6 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, gr = "airborne", V2 = "landing", K2 = "travelling", yr = "grounded", x6 = ({ airborne: e, landing: t, trip: n }) => e ? gr : t ? V2 : n != null && n.started ? K2 : yr;
function S6(e, t) {
  var s;
  const n = Y2(e, t);
  return e.mode === yr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function Y2(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: r, state: c, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === gr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (r == null ? void 0 : r.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Q2(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (r && !(r.onto && o)) return { clip: r.clip, facing: r.facing, once: !0, ...r.holds && { holds: !0 }, ...r.stretch && { stretch: r.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const g = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : G2(c), facing: g ? p : i.posture === "sit" ? i.face : h };
}
function Q2(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ks = (e) => e.outcome, X2 = "plugin:code-commandments:sins:", ll = (e) => e.type === "plugins.card" && e.markKey.startsWith(X2), J2 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => ll(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => ll(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], _6 = (e, t) => e.filter((n) => n.author === "user" && ea(n.read_at) > t).map((n) => ({ beat: "read_message", time: ea(n.read_at), card: ki(n) })).sort((n, a) => n.time - a.time), il = { user: "reacted", agent: "agent_reacted" };
function M6(e, t) {
  return e.filter((n) => il[n.author] && Ct(n) > t).map((n) => ({ beat: `${il[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Z2 = [.../* @__PURE__ */ new Set([...Object.values(cr).flatMap((e) => Object.keys(e)), ...Object.keys(dr)])];
function C6(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Z2.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: ki(n) })).sort((n, a) => n.time - a.time);
}
const e5 = (e) => new pr(e).isTest(), sa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ks(e)] || "";
}, t5 = 1800, n5 = (e, t) => {
  if (sa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && sa(n) !== "finished" && Number(e.time) - Number(n.time) <= t5 ? "tests_fixed" : "tests_passed";
};
function E6(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(e5), s = a.filter((i) => sa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, sa(i))), o.map((i) => ({ beat: n5(i, s), time: Number(i.time), card: i.key }));
}
function A6(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ks(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ks(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const O6 = (e) => e.map((t) => {
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
function T6(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function I6(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function R6(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var r;
    return { beat: (r = J2.find((c) => c.matches(i))) == null ? void 0 : r.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, r) => i.time - r.time);
}
function Xs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const rl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function a5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Xs(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function B6(e, t, n, a = {}) {
  const s = Ge({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : W2(`held:${e}`) ? "idle" : e;
}
const Be = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function L6(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Be.ahead * n ? 180 : Math.sign(a) * Be.turn;
}
const ul = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function N6(e, t) {
  const n = Math.min(Be.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Be.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Be.lines, Math.floor((e.bottom - e.top - 2 * a) / Be.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Be.sweep) % s, i = o % Be.sweep, r = Be.sweep - Be.returnSeconds, c = ul((i - r) / Be.returnSeconds), d = i <= r ? ul(i / r) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + h * Be.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const cl = 3, br = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, dl = 12, q6 = (e, t) => ({ mood: e, began: t, seen: 0 });
function D6(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!br(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= cl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * dl) / dl, lasts: cl } };
}
const P6 = (e) => e.posture === "hang" && !br(e.face), s5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), o5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function j6(e, t, n) {
  return s5.has(e) ? 1 / 0 : !o5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(kr(n - t.began, t.share) - st.lead, 0);
}
const l5 = 5;
function F6(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= l5 ? { beat: "long_walk", time: n } : null };
}
const i5 = 30, qn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function W6(e, t, n, a, s = null) {
  if (t && n < t.until || !qn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ge({ moment: "spell", state: e, tally: s }, a), [l, i] = qn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + qn.every } : { state: e, began: 0, until: 0, next: n + qn.every };
}
const H6 = (e, t, n) => t && n < t.until && vr.has(e.state) ? { state: t.state, since: t.began } : e, st = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, kr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function z6(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const r = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: r ? { beat: r } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = kr(o, e.share);
  return s ? { eager: r5(t, l), moment: null } : l > st.lead ? { eager: t, moment: null } : l < st.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > st.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < st.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ge({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function r5(e, t) {
  return e.on && t > st.lead + st.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= st.lead && t >= st.least ? { ...e, on: !0, calm: !1 } : e;
}
const u5 = 1, c5 = { look: "look", gaze: "gaze" };
function d5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ge({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [c5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const f5 = (e, t, n, a, s, o = "", l = () => !0, i = null, r = "") => Ge({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: r }, s), h5 = (e, t, n, a, s, o = 0) => Ge({ moment: "jump", high: e > u5 * t, memory: a, now: s, room: o }, n).name === "backflip", m5 = { work: ["building"], idle: ["standing"] };
function U6(e, t, n, a) {
  const s = bs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(m5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), vr.has(e) ? { moments: o, began: n || a } : (n && a - n >= i5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function p5(e, t, n) {
  return !Ge({ moment: "pondering", memory: e, now: t }, n) || !Ge({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ge({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const fl = { pondering: p5 };
function G6(e, t, n, a, s, o) {
  if (fl[e.beat]) {
    const i = fl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = d5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Qs && { lifetime: l.lifetime } } } : null;
}
function V6(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const r = f5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return r && { clip: r.name, card: "", flies: !!r.flies };
}
const K6 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function Y6(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Q6(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const X6 = (e, t) => !!(e != null && e.watches) && !t.once, J6 = 10, Z6 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || z2(a, a.queuedAt, n)), e_ = (e, t) => t ? null : e[0] ?? null;
function t_(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const n_ = (e, t) => !t.during || !e.some((n) => n.during === t.during), v5 = 2 * Math.PI, g5 = 500;
function a_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / g5, r = t && e.point && !!t.behind != !!e.point.behind, c = r && e.amount > 0, d = t && !c ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = v5 * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, S = (c ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !r ? s && !t.behind && !g.behind ? b5(g, t, n, p, s) : w5(g, t, n, p) : t) ?? g, O = S != null && S.behind && S.mood === "reading" ? y5(e.point, S, n, l, s) : S;
  return { point: O ?? null, toward: O ? { x: O.x - n.x, y: O.y - n.y } : null, amount: h, at: a };
}
function y5(e, t, n, a, s) {
  const o = ($) => $ * 180 / Math.PI, l = ($) => o(Math.atan2(Math.sin($ * Math.PI / 180), Math.cos($ * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, r = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -r)) - i), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -r)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? l(e.readingFacing - i) : 0, g = h ? e.readingYaw + p : d, b = g + l(c - g), S = Math.min(Math.max(a / 1e3, 0), 0.1), O = Be.turnSpeed * S, C = h ? g + Math.min(Math.max(b - g, -O), O) : b, D = h ? e.readingFollow + p : C, U = D + (C - D) * (1 - Math.exp(-S / Be.followSeconds)), F = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, R = o(Xs(t.x - n.x, -r, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), V = Math.min(Math.max(R, -F.up), F.down), P = Be.tipSpeed * S, L = h ? e.readingPitch + Math.min(Math.max(V - e.readingPitch, -P), P) : V;
  return { ...t, readingYaw: C, readingFollow: U, readingPitch: L, readingFacing: i };
}
function b5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (D) => {
    const { yaw: U, pitch: F } = Xs(D.x - n.x, s, n.y - D.y, o);
    return { yaw: U, pitch: Math.min(Math.max(F, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [r, c] = [rl(i(e)), rl(i(t))], d = Math.acos(Math.min(Math.max(r[0] * c[0] + r[1] * c[1] + r[2] * c[2], -1), 1));
  if (d <= a) return { ...t };
  const h = a / d, [p, g] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [b, S, O] = r.map((D, U) => p * D + g * c[U]), C = s * b / S;
  return { ...t, x: n.x + C, y: n.y - a5(C, s, -Math.asin(Math.min(Math.max(O, -1), 1)), o) };
}
const k5 = 0.15;
function s_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= k5;
}
function w5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), r = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + r * Math.cos(i), y: n.y + r * Math.sin(i) };
}
const $5 = (e) => !(e != null && e.on);
function o_(e, t, n) {
  if ($5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const fn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, tt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Fa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), hl = (e) => e * e * (3 - 2 * e);
function x5(e) {
  if (e < 0 || e >= tt.seconds) return null;
  const t = Fa(e, ...tt.flicker), n = Math.floor(t * tt.flickers * 2) % 2 === 0, a = e < tt.flicker[1] ? n ? 0.35 + 0.5 * t : tt.dim : 1;
  return { strength: 1 - hl(Fa(e, ...tt.fade)), lit: a, white: e < tt.flash[0] ? 0 : 1 - hl(Fa(e, ...tt.flash)) };
}
const l_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function i_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = x5(t - e.at);
  return a && { colour: fn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: tt.signs[e.tone], ...a } };
}
function r_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function u_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= fn.looks || a === null && n - e.since >= fn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function c_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const dt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, d_ = { behind: 39, figure: 40, ahead: 41 }, S5 = "[data-figure-pile]", _5 = { amber: [1, 0.69, 0.125], good: fn.colours.good, bad: fn.colours.bad }, Un = { phases: 4, ms: 230, dim: 0.25 }, f_ = (e, t, n) => e !== "amber" || (t + n) % Un.phases < Un.phases / 2 ? 1 : Un.dim, h_ = (e) => e === "amber" ? Un.phases : 1;
function m_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const p_ = Object.keys(_5), Ye = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Xt = ([e, t], n) => e + n() * (t - e);
function v_(e) {
  const t = Ye.least + Math.floor(e() * (Ye.most - Ye.least + 1));
  return Array.from({ length: Math.min(t, Ye.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ye.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Xt(Ye.start, e), l = Xt(Ye.reach, e);
    return {
      text: Ge({ moment: "digit" }, e).name,
      x: a * o,
      y: Ye.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Xt(Ye.moveMs, e)),
      fadeMs: Math.round(Xt(Ye.fadeMs, e))
    };
  });
}
const Wa = { high: 3, gap: 1 };
function g_(e) {
  const t = Math.floor(e / Wa.high);
  return { left: -(dt.inside + dt.width / 2 + t * (dt.width + Wa.gap)), up: e % Wa.high * (dt.height - dt.top) };
}
const M5 = (e, t, n) => Ge({ moment: "unit", memory: e, now: t }, n) !== null, C5 = { after: 5 }, E5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new pr(t).isBuild());
function y_(e, t, n) {
  const a = E5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= C5.after ? s : null;
}
function b_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: M5(n, a, s) } : null;
}
const ml = { ahead: 140, up: 70 };
function k_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * ml.ahead, y: a - ml.up } } : o ? { at: { x: n(o), y: a - o.up - dt.height } } : t ? { at: null } : null;
}
const Ha = { least: 4e3, most: 1e4 }, A5 = (e) => Ha.least + e() * (Ha.most - Ha.least), xt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function w_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = A5(t);
    if (n.length >= xt.most || t() >= xt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (xt.at[0] + t() * (xt.at[1] - xt.at[0]));
    n.push({ from: o, to: o + xt.ms }), a = o + xt.ms;
  }
}
const $_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), x_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), wr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), S_ = new Set(va.filter((e) => wr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), O5 = (e) => e.some((t) => t.state === "built"), __ = (e, t) => O5(t) ? e.filter((n) => !wr.has(n.beat)) : e, pt = { reach: 40, room: 6 }, T5 = (e, t) => t <= e - pt.reach + 2, M_ = (e, t, n) => T5(e, n) ? t - pt.reach : e - pt.reach - pt.room, C_ = (e, t, n, a) => a > 0 && t < e && t + pt.reach >= e - 2 ? Math.min(n, Math.max(e, t + pt.reach)) : e, za = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, E_ = (e) => Xt(e() < za.longShare ? za.long : za.short, e), I5 = 2 * dt.width;
function A_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= I5 ? o : e + (o - e + s / 2) % s;
}
const R5 = 60, O_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= R5, pl = "[data-figure-home]", $n = () => {
  var t;
  const e = document.querySelector(pl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(pl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, B5 = "[data-figure-docked-bars]", L5 = "[data-figure-chat-foot]", N5 = [0.85, 0.6, 0.35, 0.15], q5 = ["question", "waiting", "suggestion"], T_ = (e, t) => q5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function I_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const D5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", P5 = "[data-figure-newest]";
function $r() {
  var a, s;
  const e = (a = $n()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(P5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function hn(e, t, n = $r()) {
  if (!e || !n) return !0;
  const a = it(e, t), s = ya(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ie.top * t.size, bottom: a.top + Ie.bottom * t.size }, l = _t.gap;
  return !ga(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function R_(e, t, n, a = $r()) {
  if (!a || hn(t, e, a)) return null;
  const s = ya(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = At(), r = t.posture === "stand" ? eo * e.size : Or * e.size, c = Math.max(n.left + r, i.left + o), d = Math.min(n.right - r, i.right - l);
  return [a.left - _t.gap - l, a.right + _t.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= d && hn(p, e, a) && m$(p, e)).sort((p, g) => Math.abs(p.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Ua = 0.26, xr = 0.54, j5 = 1.25 / 5.4, xn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ua, travels: "stand" },
  lounge: { drop: Ua, travels: "stand" },
  composed: { drop: Ua, travels: "stand" },
  hang: { drop: xr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, B_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * j5 * Math.cos(t * Math.PI / 180),
  y: 1 - n - xr
}), en = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), F5 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), L_ = (e, t) => (e === "sit" ? F5.has(t) : en.has(e)) ? e : "stand";
function N_(e, t) {
  return e.facing === t.facing || !en.has(e.posture) && !en.has(t.posture) ? t : { posture: "stand", facing: en.has(e.posture) ? e.facing : t.facing };
}
const q_ = 0.25, D_ = (e, t) => en.has(e) && xn[t].drop === 0, Sr = 2, W5 = 90, H5 = 180, z5 = 140, U5 = 280, G5 = 420, V5 = 0.25, K5 = 290, Y5 = 600, Q5 = "cubic-bezier(0.2, 0.7, 0.4, 1)", X5 = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ga = 5;
function oa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: r = Math.random, memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ga) return null;
  (l || i) && (o = Math.max(o, Sr));
  const g = o > 1, b = Math.abs(t.x - e.x), S = b < Ga ? 0 : b / (W5 * o) * 1e3, O = Math.min(S, g ? z5 : H5), C = Math.abs(t.y - e.y), D = t.y < e.y, U = D && !p && h5(C, n, r, c, d, h), F = D ? G5 + Math.min(C, 400) * V5 : Math.sqrt(2 * C / Ys) * 1e3, R = {
    x: t.x,
    y: t.y,
    ms: C > Ga ? U ? Y5 : F : 0,
    lead: U ? K5 : D ? U5 : 0,
    easing: D ? Q5 : X5,
    hopping: !0,
    clip: U ? "backflip" : D ? "jump" : "fall"
  }, V = { x: t.x, y: t.y, ms: S + O, lead: 0, easing: "linear", ramp: O, ...g ? { clip: "run" } : {} }, P = p ? J5(t, n) : R, L = D && !a ? [{ ...V, y: e.y }, P] : [{ ...R, x: e.x }, V];
  return { way: Math.sign(t.x - e.x) || 1, legs: L, lands: !s, pace: o, running: g };
}
const J5 = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Z5 = (e, t) => e.postures.includes(t) ? t : e.postures[0], P_ = (e, t, n) => e.posture === "walk" && n ? "walk" : Z5(e.clip, t), it = (e, { size: t, below: n }, a = e.posture) => {
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
const Dn = 0.5, vl = 20;
function j_(e, t, n = At()) {
  const a = it(e, t);
  return a.left >= n.left + vl && a.right <= n.right - vl;
}
function Zs(e, t, n = At()) {
  const a = it(e, t), s = a.right - a.left, o = ya(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], r = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Dn && i <= n.right + Dn && a.top >= n.top - Dn && r <= n.bottom + Dn;
}
const la = [0.35, 0.5, 0.65], ia = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ie = { left: la[0], right: la.at(-1), top: ia[0], bottom: ia.at(-1) }, e$ = 0.24;
function ya(e) {
  if (e.posture === "stand") return { left: Ie.left, right: Ie.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + e$ * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ie.left, t), right: Math.max(Ie.right, t) };
}
function t$(e, { size: t }, n = At()) {
  const a = ya(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const eo = (Ie.right - Ie.left) / 2 + 0.08;
function F_(e, t) {
  return e === "hang" ? Ie : { ...Ie, bottom: Math.min(Ie.bottom, 1 - t - xn[e].drop) };
}
const n$ = "[data-figure-agent]";
function _r(e, t, n = "", a = "") {
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
const Mr = (e) => ia.flatMap(
  (t) => la.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function to(e, t, n = "") {
  if (!hn(e, t)) return la.length * ia.length;
  const a = it(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(D5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: r }) => r.width && r.height && ga(s, r) && Js(i)).map(({ rect: i }) => i), l = (i, r) => o.some((c) => i >= c.left && i <= c.right && r >= c.top && r <= c.bottom);
  return Mr(s).filter(([i, r]) => l(i, r) || _r(i, r, n)).length;
}
function a$(e, t) {
  const n = it(e, t);
  return Mr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => _r(a, s, "", n$)).length;
}
const gl = 4;
function W_(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = gl; o <= s; o += gl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!a$(i, e) && hn(i, e)) return i;
    }
  return null;
}
function mn(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Zs(l, t, a) && hn(l, t)).map((l) => ({ spot: l, covered: to(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Cr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), s$ = [0.5, 0.25, 0.75], o$ = (e) => Cr(e.getBoundingClientRect(), s$), Er = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, l$ = eo, i$ = (e, t, { size: n }, a = l$) => Ar(e, Er[t], a * n, "stand");
function Ar(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const r$ = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Or = 0.1, u$ = (e, t, { size: n }) => Ar(e, r$[t], Or * n, "sit"), c$ = (e) => ((e + 180) % 360 + 360) % 360 - 180, Va = 60;
function H_(e, t) {
  const n = c$(t);
  return !e.aside || Math.abs(n) >= Va ? t : n < 0 ? 360 - Va : Va;
}
const tn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, d$ = (e) => [.../* @__PURE__ */ new Set([e, ...tn.turns.map((t) => (t + 360) % 360)])];
function z_(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = d$(t), l = tn.every[0] + a() * (tn.every[1] - tn.every[0]);
  return { face: t, from: s ? f$(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function f$(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / tn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function U_(e, t) {
  const { element: n, edge: a } = ba(), s = ["left", "right"].map((i) => Sn(u$(a, i, e), e)).filter((i) => n && Zs(i, e) && !to(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, r) => o(i) - o(r))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function G_(e, t, { size: n }) {
  const a = (Ie.right - Ie.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Tr } : e;
}
const Tr = 7;
function Ir() {
  const e = [...document.querySelectorAll(S5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function h$(e, t) {
  const n = it(e, t), a = n.right - n.left;
  return { left: n.left + Ie.left * a, right: n.left + Ie.right * a, top: n.top + Ie.top * a, bottom: n.bottom };
}
function m$(e, t) {
  const n = Ir();
  return !n || !ga(h$(e, t), n);
}
const p$ = 4;
function ba() {
  const e = _n(), t = Ir(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > p$ || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Tr - n, 0) } };
}
const V_ = ({ size: e, below: t }) => (1 - t) * e;
function Sn(e, t) {
  const n = At(), { size: a, below: s } = t, o = xn[e.posture].drop * a;
  return { ...t$(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ws = (e, t) => Object.keys(Er).map((n) => Sn(i$(e, n, t), t)), no = (e, t) => Cr(e, N5).map((n) => Sn(n, t)), Rr = (e, t, n) => mn(e, t, n) ?? e[0];
function K_(e, t) {
  const { element: n, edge: a } = ba();
  return { ...Rr(ws(a, e), e, t), view: null, on: n };
}
function Y_(e, t, n, a) {
  const { element: s, edge: o } = ba(), l = (a ? ws(o, t) : [...ws(o, t), ...no(o, t)]).filter(
    (c) => !ga(it(c, t), e)
  ), i = mn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), r = i && !to(i, t) ? i : mn(l, t, n);
  return r && { ...r, view: null, on: s };
}
function _n() {
  var a;
  const e = $n(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(B5);
  if (!t) return { ...ka(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const yl = { within: 2 };
function Q_(e) {
  const { element: t, docked: n, edge: a } = _n();
  if (!n || e.on !== t) return !0;
  const s = ka().edge;
  return a.left > s.left + yl.within || a.left + a.width < s.left + s.width - yl.within;
}
const v$ = "[data-figure-closing]";
function X_() {
  var n;
  const { element: e, docked: t } = _n();
  return t && !!((n = e.firstElementChild) != null && n.matches(v$));
}
const Br = "[data-figure-progress]";
function J_(e) {
  const t = e.querySelector(Br);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Z_(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const g$ = { across: 300, above: 380, below: 60 };
function eM(e) {
  const { across: t, above: n, below: a } = g$;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: y$(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const y$ = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Lr = "[data-figure-bar]", $s = { back: 144, along: 0.4 };
function tM(e) {
  const { element: t, docked: n, edge: a } = _n(), s = n ? t.querySelector(Lr) : null;
  if (!(s != null && s.querySelector(Br))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Sn({ x: o - $s.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function nM(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < $s.along * a.size ? t.x + $s.along * a.size : e.x, y: e.y, behind: !0 };
}
function aM(e) {
  const t = e.querySelector(Lr), n = t == null ? void 0 : t.firstElementChild;
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
function sM(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = ka(), r = n === null ? b$(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Sn({ x: n, y: i.top, posture: "stand" }, e);
  return r && { ...r, view: null, on: l, stays: !0 };
}
function b$(e, t, n, a, s) {
  const o = no(e, t), l = Math.min(...o.map((r) => r.x)), i = o.filter((r) => r.x + a + dt.width < s && r.x + a - pt.reach - pt.room >= l);
  return mn(i.length ? i : o, t, n);
}
const k$ = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function oM(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: r = [], memory: c = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Sr));
  const g = (U) => {
    const F = it(U, n, xn[U.posture].travels);
    return { x: F.left, y: F.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return w$(g(e), g(t), g({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [S, ...O] = [e, ...r, t].map(g), C = oa(S, O[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: d, room: h, pogo: p }), D = O.slice(1).map((U, F) => {
    var R;
    return (R = oa(O[F], U, n.size, { random: i, memory: c, now: d, room: h })) == null ? void 0 : R.legs.find((V) => V.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...D.filter(Boolean)] };
}
function w$(e, t, n, a, s, o, l) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / k$.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), r = s ? oa(e, n, o.size, { pace: l }) : oa(n, t, o.size, { pace: l }), c = s ? [...(r == null ? void 0 : r.legs) ?? [], i(n, t)] : [i(e, n), ...(r == null ? void 0 : r.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function lM(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function iM(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && mn(o$(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = ba();
  return { ...Rr(no(s, t), t, n), view: null, on: a };
}
const $$ = "[data-figure-bubble]", x$ = 250;
let nn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Nr = 0;
const Vt = () => nn, Ka = /* @__PURE__ */ new WeakMap();
let S$ = 0;
function ao(e) {
  return Ka.has(e) || Ka.set(e, `floor-${++S$}`), Ka.get(e);
}
const _$ = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, M$ = () => {
  var e, t;
  return ((t = (e = $n()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function C$(e, t) {
  var a;
  const n = (a = e.querySelector(L5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function E$(e, t) {
  const n = e && C$(e, t), a = e ? [...e.querySelectorAll($$)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || _$(l, n))).map(({ element: o, type: l, box: i }) => ({ id: ao(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const A$ = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= x$ ? (t.top - a.top) / s * 1e3 : 0;
};
function qr(e = nn, t = performance.now()) {
  const n = At(), a = M$(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = _n(), r = [];
  o && r.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = ka();
  return c.element && r.push({ id: ao(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), r.push(...E$(a, s)), r.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(r.map((d) => Object.freeze({ ...d, vy: A$(e, d, t) }))) });
}
const xs = /* @__PURE__ */ new Set();
function O$(e) {
  return xs.add(e), () => xs.delete(e);
}
function T$() {
  Dr();
  const e = () => {
    Nr = requestAnimationFrame(e), !document.hidden && (nn = qr(nn), xs.forEach((t) => t(nn)));
  };
  e();
}
function Dr() {
  cancelAnimationFrame(Nr);
}
const so = 5, I$ = 56, R$ = { share: 0.6 }, B$ = (e) => -Math.sqrt(2 * Ys * R$.share * e), Wt = (e, t) => e.find((n) => n.id === t) ?? null;
function rM(e, t = qr().floors) {
  const n = Wt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ao(e.on) : null, o = s && Wt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Pr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, r = Vt().floors) {
  const c = Wt(r, e);
  if (!c) return null;
  const d = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || L$(c, d, o)) && N$(d, i, r) ? { x: d.x, y: d.y } : null;
}
const oo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, L$ = (e, t, n) => !oo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function uM(e, t = Vt().floors) {
  if (!oo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= so && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function N$(e, t, n = Vt().floors) {
  const a = Wt(n, "home");
  return e.posture === "hang" && a && it(e, t).bottom >= a.top ? !1 : Zs(e, t);
}
function cM(e, t, n, a = Vt().floors) {
  const s = Pr(e, n, a);
  if (!e.home) return q$(e, t, s, a);
  if (!s) return null;
  const o = Wt(a, "home"), l = s.y - t.y, i = l > so ? "dropping" : -l > I$ ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function q$(e, t, n, a) {
  const s = n ? Wt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: B$(e.risen) };
  if (!n) return null;
  if (oo(t) && n.y - t.y > so) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function dM(e, t, n) {
  const a = eo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function fM(e, t, n, a = Vt().floors) {
  const s = t && Pr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const D$ = ["data-type"], P$ = { class: "figure-floor-name" }, j$ = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (u(), f("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: be({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", P$, y(e.floor.type), 1)
    ], 12, D$));
  }
}, F$ = /* @__PURE__ */ z(j$, [["__scopeId", "data-v-4e0f1e2e"]]), W$ = {
  class: "figure-floors",
  "aria-hidden": "true"
}, H$ = {
  __name: "FigureFloors",
  setup(e) {
    const t = Xe(Vt().floors);
    let n = () => {
    };
    return _e(() => {
      n = O$((a) => t.value = a.floors), T$();
    }), Re(() => {
      n(), Dr();
    }), (a, s) => (u(), f("div", W$, [
      (u(!0), f(N, null, ne(t.value, (o) => (u(), W(F$, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, hM = /* @__PURE__ */ z(H$, [["__scopeId", "data-v-e519168b"]]), an = (e) => typeof e == "number" ? e : Date.parse(e);
function mM(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: an(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => an(s.row.created_at) - an(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const bl = 20;
async function pM(e, t, n) {
  for (let a = 0; a < bl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || an(o.created_at) <= an(s.created_at) || !await n()) return a;
  }
  return bl;
}
const z$ = 3, Ya = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function U$(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ya[n.grouping]) == null ? void 0 : a.call(Ya, e.row, n)) || "";
}
function G$(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function vM(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= z$ ? [G$(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = U$(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function gM(e) {
  const t = ze(), n = t.option("row"), a = x(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), ve(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function V$(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const yM = (e) => (t) => t.filter((n) => n.id !== e), bM = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), kM = (e) => (t) => [...t, e], wM = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function $M(e, t = {}) {
  const n = ze(), a = x(null), s = x("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function xM(e) {
  const t = ze(), n = x("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Pn = /* @__PURE__ */ new Map();
function K$(e, t) {
  if (Pn.has(e)) return Pn.get(e);
  const n = t().finally(() => Pn.delete(e));
  return Pn.set(e, n), n;
}
function SM() {
  const e = ze(), t = x(null), n = x("");
  async function a() {
    const s = await K$(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Y$ = { class: "cards-page" }, Q$ = { class: "cards-bar" }, X$ = { class: "cards-count" }, J$ = { class: "cards" }, Z$ = {
  key: 1,
  class: "cards-note"
}, e4 = {
  key: 2,
  class: "cards-note"
}, t4 = ["data-row", "onClick"], n4 = { class: "card-head" }, a4 = { class: "card-title" }, s4 = { class: "card-foot" }, o4 = {
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
    return (a, s) => (u(), f("div", Y$, [
      m("div", Q$, [
        m("span", X$, y(e.rows.length) + " " + y(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        A(pe, qe({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            A(ge, {
              name: "plus",
              size: 12
            }),
            te(" New " + y(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", J$, [
        e.loaded ? e.failure ? (u(), f("p", Z$, y(e.failure), 1)) : e.rows.length ? w("", !0) : (u(), f("p", e4, "No " + y(e.noun) + "s yet", 1)) : (u(), W(Ke, {
          key: 0,
          shape: "cards"
        })),
        (u(!0), f(N, null, ne(e.rows, (o) => (u(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", n4, [
            A(ge, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            te(" " + y(e.head(o)), 1),
            A(Ze, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", a4, y(e.title(o)), 1),
          m("span", s4, y(e.foot(o)), 1)
        ], 8, t4))), 128))
      ]),
      me(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, _M = /* @__PURE__ */ z(o4, [["__scopeId", "data-v-990e6b37"]]), kl = "newest";
function MM(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Ee(De, null)) == null ? void 0 : c.search, s = x(""), o = x(kl), l = x("all"), i = M(() => {
    const d = s.value.trim().toLowerCase(), h = e.value.filter((p) => V$(p, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === kl ? h : [...h].sort((p, g) => t(p).localeCompare(t(g)));
  }), r = M(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: r, hasStates: !!n };
}
const l4 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, i4 = 40, r4 = "top", u4 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Ee(De, null)) == null ? void 0 : p.autoScroll, s = M(() => a === r4), o = x(null), l = x(!1), i = (g) => s.value ? g.scrollTop : g.scrollHeight - g.scrollTop - g.clientHeight, r = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: r(), behavior: "smooth" });
    function d() {
      var g;
      l.value = i(o.value) >= i4, s.value || (g = n.feed) == null || g.reachTop(o.value);
    }
    ve(() => {
      var g;
      return [n.rowCount, (g = n.feed) == null ? void 0 : g.isLoaded()];
    }, async () => {
      await Pe(), o.value && (l.value || (o.value.scrollTop = r()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return _e(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = r());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), Ve(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (g, b) => (u(), f("div", l4, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        me(g.$slots, "default", {}, void 0, !0)
      ], 34),
      A(zt, {
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
            A(ge, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            b[0] || (b[0] = te(" Newest ", -1))
          ], 512), [
            [Tl, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, CM = /* @__PURE__ */ z(u4, [["__scopeId", "data-v-95e8baa9"]]), c4 = ["aria-selected", "data-tab", "onClick"], d4 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, f4 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ee(De, null), o = M(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = x(null), i = x({ left: 0, width: 0, slides: !1 }), r = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const g = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!g) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: g.offsetLeft, width: g.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const d = () => Pe(() => c(!0));
    let h = null;
    return _e(() => {
      var p;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Re(() => h == null ? void 0 : h.disconnect()), ve(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, d), ve(() => n.answer, d, { deep: !0 }), (p, g) => (u(), f("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (u(!0), f(N, null, ne(o.value, (b) => {
        var S, O;
        return u(), f("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((S = e.active) == null ? void 0 : S.key) === b.key }]),
          "aria-selected": ((O = e.active) == null ? void 0 : O.key) === b.key,
          "data-tab": b.key,
          onClick: (C) => a("choose", b)
        }, [
          te(y(b.label) + " ", 1),
          r(b) ? (u(), f("span", d4, y(e.answer[b.count_field]), 1)) : w("", !0)
        ], 10, c4);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: be({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, EM = /* @__PURE__ */ z(f4, [["__scopeId", "data-v-63fcd326"]]), h4 = {
  class: "tab-body",
  "data-tab-body": ""
}, m4 = { "data-tab-content": "" }, p4 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = x(!1);
    let a = 0;
    return ve(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Cs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (u(), f("div", h4, [
      n.value ? (u(), W(Ke, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : w("", !0),
      Je(m("div", m4, [
        me(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Tl, !n.value]
      ])
    ]));
  }
}, AM = /* @__PURE__ */ z(p4, [["__scopeId", "data-v-63876533"]]), v4 = {}, g4 = { class: "menu-label" };
function y4(e, t) {
  return u(), f("span", g4, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const wl = /* @__PURE__ */ z(v4, [["render", y4], ["__scopeId", "data-v-aa955b3e"]]), b4 = {
  class: "search-bar",
  "data-search-bar": ""
}, k4 = { class: "search-bar-control" }, w4 = ["value", "placeholder", "aria-label"], $4 = ["aria-expanded"], x4 = {
  key: 0,
  "data-menu-count": ""
}, S4 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const a = e, s = n, o = eu(), l = ((C = Ee(De, null)) == null ? void 0 : C.search) ?? {}, i = M(() => l.placeholder || a.placeholder), r = l.context ?? [], c = x(null), d = x(null), h = x([]), p = M(() => h.value.length ? h.value[h.value.length - 1].next : r), g = M(() => !!o.menu || r.length > 0), b = (D) => {
      h.value = [], d.value = d.value ? null : D.currentTarget;
    };
    function S(D) {
      if (D.next.length) {
        h.value = [...h.value, D];
        return;
      }
      d.value = null, s("pick", D.click);
    }
    function O() {
      var D;
      s("update:modelValue", ""), (D = c.value) == null || D.focus();
    }
    return t({ focus: () => {
      var D;
      return (D = c.value) == null ? void 0 : D.focus();
    } }), (D, U) => {
      var F;
      return u(), f("div", b4, [
        m("div", k4, [
          A(ge, {
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
            onInput: U[0] || (U[0] = (R) => s("update:modelValue", R.target.value)),
            onKeydown: Mt(O, ["esc"])
          }, null, 40, w4),
          e.modelValue ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: O
          }, [
            A(ge, {
              name: "close",
              size: 12
            })
          ])) : w("", !0),
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
            e.menuCount ? (u(), f("span", x4, y(e.menuCount), 1)) : w("", !0),
            A(ge, {
              name: "caret",
              size: 12
            })
          ], 8, $4)) : w("", !0)
        ]),
        (F = I(l).button) != null && F.title ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: U[1] || (U[1] = (R) => s("pick", I(l).button.click))
        }, y(I(l).button.title), 1)) : w("", !0),
        me(D.$slots, "default", {}, void 0, !0),
        d.value ? (u(), W(Is, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: U[3] || (U[3] = xe(() => {
          }, ["stop"])),
          onClose: U[4] || (U[4] = (R) => d.value = null)
        }, {
          default: j(() => [
            h.value.length ? (u(), W(jt, {
              key: 0,
              "data-search-back": "",
              onClick: U[2] || (U[2] = (R) => h.value = h.value.slice(0, -1))
            }, {
              default: j(() => [
                te("‹ " + y(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : w("", !0),
            (u(!0), f(N, null, ne(p.value, (R) => (u(), W(jt, {
              key: R.title,
              description: R.subtext,
              "data-search-entry": R.title,
              onClick: (V) => S(R)
            }, {
              default: j(() => [
                te(y(R.title) + y(R.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? w("", !0) : me(D.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : w("", !0)
      ]);
    };
  }
}, _4 = /* @__PURE__ */ z(S4, [["__scopeId", "data-v-45374bed"]]), M4 = {
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
    return (o, l) => (u(), W(_4, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: j(() => [
        A(wl, null, {
          default: j(() => [...l[2] || (l[2] = [
            te("Order", -1)
          ])]),
          _: 1
        }),
        (u(), f(N, null, ne(a, (i) => A(jt, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (r) => e.tools.order.value = i.key
        }, {
          default: j(() => [
            te(y(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (u(), f(N, { key: 0 }, [
          A(wl, null, {
            default: j(() => [...l[3] || (l[3] = [
              te("Show", -1)
            ])]),
            _: 1
          }),
          (u(), f(N, null, ne(s, (i) => A(jt, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (r) => e.tools.state.value = i.key
          }, {
            default: j(() => [
              te(y(i.label), 1)
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
}, OM = /* @__PURE__ */ z(M4, [["__scopeId", "data-v-dab0064d"]]);
function TM() {
  const e = x(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const IM = (e) => import(
  /* @vite-ignore */
  e
), C4 = 86400, Ss = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function E4(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ss(t) - Ss(e)) / C4);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function RM(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ss(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: E4(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Qa = 280, Xa = 240, Ja = 120, A4 = 6, O4 = 14, pn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function T4(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function jr(e, t) {
  const n = Math.max(0, T4(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function I4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${O4}px)` }), e.offsetHeight, e.style.transition = `height ${Qa}ms ${pn}`, e.style.height = `${l}px`;
  const i = s();
  let r = !1, c = !1;
  const d = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = jr(t, e));
    const p = s() - i;
    if (!r && p >= Qa && (r = !0, e.style.transition = `opacity ${Xa}ms ease-out, transform ${Xa}ms ${pn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Qa + Xa) return a(h);
    d();
  };
  return a(h), d;
}
function BM(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${A4}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ja}ms ease-out, transform ${Ja}ms ${pn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = jr(t, e)), s() - l < Ja) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const R4 = 140, jn = 220, $l = 5;
function LM({ gap: e = R4, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(d, h) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), h();
    });
  }
  function r() {
    const d = n.splice(0, $l);
    if (s = d.length > 0, !s) return;
    let h = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(r, e));
      });
  }
  const c = (d, h, p, g = I4) => {
    if (l || !h.pane || !h.follows()) return p();
    const b = { el: d, options: h, done: p, arrival: g, display: d.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(r, e));
    d.style.display = "none", n.push(b), n.length >= $l && c.flush();
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
function NM(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${jn}ms ${pn}, opacity ${jn}ms ease-in, margin ${jn}ms ${pn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, jn);
}
const Fr = "chat.pins.minimised", Gn = x(Qn(Fr, !1));
function xl(e) {
  Gn.value = e, Ps(Fr, e);
}
function B4(e) {
  const t = M(() => e()), n = M(() => Gn.value ? [] : e()), a = () => xl(!Gn.value), s = Date.now() / 1e3;
  return ve(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && xl(!1)
  ), { pins: t, visible: n, minimised: Gn, toggle: a };
}
const L4 = ["title"], N4 = {
  key: 0,
  class: "pins-count"
}, q4 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = B4(() => t.pinRows);
    return (o, l) => I(n).length ? (u(), f("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: I(a), inline: e.inline }]),
      title: I(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...i) => I(s) && I(s)(...i), ["stop"]))
    }, [
      A(ge, {
        name: I(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      I(a) ? (u(), f("span", N4, y(I(n).length), 1)) : w("", !0)
    ], 10, L4)) : w("", !0);
  }
}, qM = /* @__PURE__ */ z(q4, [["__scopeId", "data-v-d073c504"]]), D4 = ["title"], P4 = ["title"], j4 = { class: "diff-card-dir" }, F4 = { class: "diff-card-name" }, W4 = ["title"], H4 = ["title"], z4 = {
  key: 0,
  class: "diff-card-note"
}, U4 = ["href"], G4 = ["src", "alt"], V4 = { class: "diff-card-rows" }, K4 = { class: "diff-row-num" }, Y4 = { class: "diff-row-sign" }, Q4 = { class: "diff-row-code" }, X4 = {
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
    function o(_) {
      (_.metaKey || _.ctrlKey) && (_.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, r = M(() => n.path.lastIndexOf("/") + 1), c = M(() => n.path.slice(0, r.value)), d = M(() => n.path.slice(r.value)), h = M(() => n.change === "deleted"), p = M(() => l[n.change]), g = M(() => new Set(n.rows.filter((_) => _.line_type === "add").map((_) => _.line))), b = x("after"), S = M(() => b.value === "before" ? n.whole.old : n.whole.text), O = M(() => n.whole && n.whole.text !== void 0 ? S.value.split(`
`).map((_, k) => ({ line_type: b.value === "after" && g.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: _ })) : n.rows.filter(
      (_) => !(n.editsOnly && ["ctx", "fold"].includes(_.line_type)) && !(n.hideRemovals && _.line_type === "del")
    )), C = x(!1), D = M(() => n.lines && !C.value && !n.whole), U = M(() => D.value ? O.value.slice(0, n.lines) : O.value), F = M(() => O.value.length - U.value.length), R = (_) => _.line === null || _.line_type === "del" ? "" : _.line, V = (_) => _.line_type === "fold" ? _.hidden ? `⋯ ${_.hidden} lines` : "⋯" : _.text, P = x(null), L = x(null);
    let $ = null;
    return _e(() => {
      if (!L.value) return;
      let _ = !0;
      $ = new ResizeObserver(() => {
        !P.value || !L.value || (P.value.style.transition = _ ? "none" : "", P.value.style.height = `${L.value.offsetHeight}px`, _ = !1);
      }), $.observe(L.value);
    }), Re(() => $ && $.disconnect()), (_, k) => (u(), f("section", {
      class: Y(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (v) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${I(s)}-click to open it`,
          onClick: o
        }, [
          m("span", j4, y(c.value), 1),
          m("span", F4, y(d.value), 1),
          p.value ? (u(), f("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, y(p.value), 3)) : w("", !0)
        ], 8, P4),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + y(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + y(e.removed), 3),
        A(Ze, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = xe((v) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, y(b.value === "after" ? "After" : "Before"), 9, W4)) : w("", !0),
        h.value ? w("", !0) : (u(), f("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = xe((v) => a("whole"), ["stop"]))
        }, [
          A(ge, {
            name: "file",
            size: 12
          })
        ], 10, H4))
      ], 8, D4),
      e.whole && e.whole.error ? (u(), f("p", z4, y(e.whole.error), 1)) : w("", !0),
      !h.value && !e.folded ? (u(), f(N, { key: 1 }, [
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
          }, null, 8, G4)
        ], 8, U4)) : (u(), f("div", {
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
            m("div", V4, [
              (u(!0), f(N, null, ne(U.value, (v, T) => (u(), f("div", {
                key: T,
                class: Y(["diff-row", v.line_type, { fresh: e.fresh && v.edit === e.fresh }])
              }, [
                m("span", K4, y(R(v)), 1),
                m("span", Y4, y(i[v.line_type]), 1),
                m("span", Q4, y(V(v)), 1)
              ], 2))), 128)),
              F.value > 0 ? (u(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = xe((v) => C.value = !0, ["stop"]))
              }, y(F.value) + " more " + y(F.value === 1 ? "line" : "lines"), 1)) : w("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : w("", !0)
    ], 2));
  }
}, DM = /* @__PURE__ */ z(X4, [["__scopeId", "data-v-23581cbb"]]), J4 = { "data-queue-controls": "" }, Z4 = { class: "counts" }, ex = { "data-queue-spots": "" }, tx = {
  class: "spots",
  "aria-label": "Places in use"
}, nx = { "data-queue-waiting": "" }, ax = { key: 0 }, sx = { class: "control" }, ox = { class: "stepper" }, lx = ["disabled"], ix = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, rx = ["disabled"], ux = ["for"], cx = ["id", "value", "disabled", "onChange"], dx = { class: "control" }, fx = ["aria-checked", "disabled"], hx = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, mx = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, px = {
  key: 2,
  class: "note failure",
  role: "alert"
}, vx = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(!1), o = x("");
    async function l(i, r) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(r)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, r) => (u(), f("div", J4, [
      A(Ft, { icon: "gauge" }, {
        default: j(() => [...r[3] || (r[3] = [
          te("Now", -1)
        ])]),
        _: 1
      }),
      m("div", Z4, [
        m("div", null, [
          m("strong", ex, [
            te(y(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + y(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + y(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", tx, [
            (u(!0), f(N, null, ne(e.queue.parallel_limit, (c) => (u(), f("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", nx, y(e.queue.waiting_count), 1),
          r[4] || (r[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (u(), f("p", ax, "The oldest goes first.")) : w("", !0)
        ])
      ]),
      m("div", sx, [
        r[5] || (r[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", ox, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: r[0] || (r[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, lx),
          m("output", ix, y(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: r[1] || (r[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, rx)
        ])
      ]),
      (u(!0), f(N, null, ne(e.queue.suite_limits, (c) => (u(), f("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, y(c.title), 9, ux),
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
        }, null, 40, cx)
      ]))), 128)),
      m("div", dx, [
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
        ])], 8, fx)
      ]),
      e.queue.halt_kind === "update" ? (u(), f("p", hx, [
        A(ge, {
          name: "pause",
          size: 13
        }),
        r[8] || (r[8] = te("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (u(), f("p", mx, [
        A(ge, {
          name: "pause",
          size: 13
        }),
        te("The queue is paused. No waiting command gets a place until it is resumed. " + y(e.queue.halt_reason), 1)
      ])) : w("", !0),
      o.value ? (u(), f("p", px, y(o.value), 1)) : w("", !0)
    ]));
  }
}, gx = /* @__PURE__ */ z(vx, [["__scopeId", "data-v-b594afa3"]]), yx = ["data-queue-row", "data-queue-process"], bx = ["aria-expanded"], kx = { class: "run-line" }, wx = { class: "leading" }, $x = {
  key: 0,
  "data-queue-position": ""
}, xx = ["title"], Sx = { class: "command" }, _x = {
  class: "time",
  "data-queue-time": ""
}, Mx = { class: "details" }, Cx = { "data-queue-type": "" }, Ex = { class: "failed" }, Ax = { class: "drop-inner" }, Ox = { class: "output" }, Tx = { class: "output-heading" }, Ix = ["href"], Rx = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(), o = Qi((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = Vs(), r = M(() => ({ test: "Test run", build: "Build", check: "Check", install: "Install" })[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = M(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const g = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((g - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function d() {
      if (!n.expanded) return;
      const p = s.value, g = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await Pe(), n.expanded && g && (p.scrollTop = p.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await Pe(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return ve(() => n.expanded, h, { immediate: !0 }), kn(["output.*"], d), (p, g) => (u(), f("div", {
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
          g[3] || (g[3] = Mt(xe((b) => a("toggle"), ["prevent"]), ["enter"])),
          g[4] || (g[4] = Mt(xe((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", kx, [
          m("span", wx, [
            e.run.section === "waiting" ? (u(), f("span", $x, y(e.position), 1)) : (u(), f("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, xx))
          ]),
          m("code", Sx, y(e.run.line), 1),
          m("span", _x, y(c.value), 1),
          A(ge, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", Mx, [
          m("span", Cx, y(r.value), 1),
          e.run.owner_agent_id ? (u(), f(N, { key: 0 }, [
            g[6] || (g[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: g[0] || (g[0] = xe((b) => I(vt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + y(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (u(), f(N, { key: 1 }, [
            g[7] || (g[7] = m("span", { class: "separator" }, "·", -1)),
            g[8] || (g[8] = m("span", null, "Main agent", -1))
          ], 64)) : w("", !0),
          e.run.task_id ? (u(), f(N, { key: 2 }, [
            g[9] || (g[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: g[1] || (g[1] = xe((b) => I(vt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + y(e.run.task_id), 1)
          ], 64)) : w("", !0),
          e.run.state === "failed" ? (u(), f(N, { key: 3 }, [
            g[10] || (g[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", Ex, "Failed, exit " + y(e.run.exit_code), 1)
          ], 64)) : w("", !0)
        ])
      ], 40, bx),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", Ax, [
          m("div", Ox, [
            m("div", Tx, [
              m("span", null, "Output " + y(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Ix)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: g[5] || (g[5] = (b) => e.expanded && I(o).loadEarlier(b.target))
            }, [
              g[11] || (g[11] = m("span", { class: "prompt" }, "$ ", -1)),
              te(y(e.run.line), 1),
              I(l).length ? (u(), f(N, { key: 0 }, [
                te(y(`
` + I(l).join(`
`)), 1)
              ], 64)) : w("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, yx));
  }
}, Bx = /* @__PURE__ */ z(Rx, [["__scopeId", "data-v-a9f44873"]]), Lx = {
  class: "process-queue",
  "data-test-queue": ""
}, Nx = { class: "scroll" }, qx = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Dx = ["data-queue-empty"], Za = 20, Px = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = x(null), a = x(""), s = x([]), o = x(Za), l = M(() => {
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
      ...g.rows.length ? g.rows.map((b, S) => ({ key: `run:${b.id}`, run: b, position: S + 1 })) : [{ key: `none:${g.type}`, section: g, empty: !0 }]
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
    return kn(["process.*", "setting.*"], d), _e(d), (p, g) => (u(), f("article", Lx, [
      g[0] || (g[0] = m("p", { class: "lead" }, "Commands from workers wait here for a free place. Reading and editing never wait.", -1)),
      m("div", Nx, [
        a.value ? (u(), f("p", qx, y(a.value), 1)) : w("", !0),
        n.value ? (u(), f(N, { key: 1 }, [
          A(gx, {
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
              (u(!0), f(N, null, ne(r.value, (b) => (u(), f(N, {
                key: b.key
              }, [
                b.run ? (u(), W(Bx, {
                  key: 0,
                  run: b.run,
                  environment: n.value.environment_name,
                  position: b.position,
                  read: e.read,
                  expanded: s.value.includes(b.run.id),
                  onToggle: (S) => c(b.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : b.empty ? (u(), f("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": b.section.type
                }, y(b.section.empty), 9, Dx)) : (u(), W(Ft, {
                  key: 2,
                  icon: b.section.icon,
                  count: b.section.rows.length,
                  "data-queue-heading": b.section.type
                }, {
                  default: j(() => [
                    te(y(b.section.heading), 1)
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
        ], 64)) : a.value ? w("", !0) : (u(), W(Ke, { key: 2 }))
      ])
    ]));
  }
}, PM = /* @__PURE__ */ z(Px, [["__scopeId", "data-v-d9b6ef6b"]]), jx = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, Fx = ["aria-expanded"], Wx = {
  class: "links-count",
  "data-inspector-links-count": ""
}, Hx = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, zx = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, Ux = {
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
    const t = e, n = x(t.open), a = x(0), s = x(0), o = x("");
    let l = 0;
    async function i() {
      const r = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], d = await t.read(c);
      r === l && (o.value = d.ok ? "" : d.error, d.ok && (a.value = d.value.total), s.value += 1);
    }
    return ve(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), kn(["link.*", "phase.*", "phase_task.*"], i), (r, c) => (u(), f(N, null, [
      a.value ? (u(), f("section", jx, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (d) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", Wx, y(a.value), 1),
          A(mt, { open: n.value }, null, 8, ["open"])
        ], 8, Fx),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (u(), f("div", Hx, [
            A(Yc, {
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
      o.value ? (u(), f("p", zx, y(o.value), 1)) : w("", !0)
    ], 64));
  }
}, Gx = /* @__PURE__ */ z(Ux, [["__scopeId", "data-v-479ab50f"]]), Vx = ["placeholder"], Kx = { class: "actions" }, Yx = { class: "error" }, Qx = {
  key: 1,
  class: "card closed"
}, Xx = { class: "mark" }, Jx = { class: "prompt" }, Zx = {
  key: 0,
  class: "draft"
}, e8 = {
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
    const a = e, s = n, o = sn(e, "draft"), l = sn(e, "error"), i = x(!!l.value), r = x(!1), c = x(!1), d = x(null);
    async function h() {
      var b, S;
      i.value = !0, r.value = !1, await Pe(), (S = ((b = d.value) == null ? void 0 : b.querySelector("input")) || d.value) == null || S.focus();
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
        } catch (S) {
          o.value = b, l.value = S.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, S) => (u(), f("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (u(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(g, ["prevent"]),
        onKeydown: Mt(p, ["esc"])
      }, [
        me(b.$slots, "who", {}, void 0, !0),
        Je(m("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": S[0] || (S[0] = (O) => o.value = O),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: S[1] || (S[1] = Mt((O) => I(Bi)(O, g), ["enter"]))
        }, null, 40, Vx), [
          [Kn, o.value]
        ]),
        m("div", Kx, [
          m("span", Yx, y(l.value), 1),
          A(pe, {
            small: "",
            onClick: p
          }, {
            default: j(() => [...S[3] || (S[3] = [
              te("Cancel", -1)
            ])]),
            _: 1
          }),
          A(pe, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: j(() => [...S[4] || (S[4] = [
              te("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (u(), f("div", Qx, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", Xx, [
            A(ge, {
              name: r.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", Jx, y(r.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (u(), f("span", Zx, "Draft kept")) : w("", !0)
        ]),
        e.count ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: S[2] || (S[2] = (O) => s("show"))
        }, [
          m("span", null, y(I(Xc)(e.count, "comment")), 1),
          A(ge, {
            name: "down",
            size: 12
          })
        ])) : w("", !0)
      ]))
    ], 2));
  }
}, t8 = /* @__PURE__ */ z(e8, [["__scopeId", "data-v-b68baddd"]]), n8 = { wide: 1130 }, a8 = /\{([A-Za-z_]\w*)\}/g;
function Vn(e, t, n = {}) {
  return e.replace(a8, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const s8 = (e, t, n, a) => Vn(e.label, n, { row_id: a, id: a }) || ww(t, n, a), o8 = { class: "comment-side-head" }, l8 = {
  key: 0,
  class: "comment-none"
}, i8 = { key: 0 }, r8 = {
  key: 1,
  class: "comment-none"
}, u8 = {
  class: "comment",
  "data-comment": ""
}, c8 = {
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
      m("header", o8, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        A(fa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (u(), f("p", l8, "No comments yet")) : w("", !0),
      (u(!0), f(N, null, ne(e.comments, (a) => (u(), f("section", {
        key: a.id
      }, [
        a.quote ? (u(), f("blockquote", i8, y(a.quote), 1)) : w("", !0),
        a.revision ? (u(), f("span", r8, "Revision " + y(a.revision), 1)) : w("", !0),
        m("p", u8, y(e.words(a)), 1)
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
}, Sl = /* @__PURE__ */ z(c8, [["__scopeId", "data-v-276284a3"]]), d8 = { class: "resource-heading" }, f8 = { class: "resource-type" }, h8 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, m8 = {
  key: 1,
  class: "resource-abstract"
}, p8 = {
  __name: "ResourceHeading",
  props: { label: String, title: String, abstract: String },
  setup(e) {
    return (t, n) => (u(), f("div", d8, [
      m("p", f8, y(e.label), 1),
      e.title ? (u(), f("h2", h8, y(e.title), 1)) : w("", !0),
      e.abstract ? (u(), f("p", m8, y(e.abstract), 1)) : w("", !0)
    ]));
  }
}, v8 = /* @__PURE__ */ z(p8, [["__scopeId", "data-v-e70bb004"]]), g8 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, y8 = { class: "inspector-icons" }, b8 = { class: "inspector-icons-start" }, k8 = { class: "inspector-icons-end" }, w8 = ["href"], $8 = {
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
    return (i, r) => (u(), f("header", g8, [
      m("div", y8, [
        m("span", b8, [
          e.backed ? (u(), W(pe, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: r[0] || (r[0] = (c) => a("back"))
          }, {
            default: j(() => [
              A(ge, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : w("", !0),
          e.stepped ? (u(), f(N, { key: 1 }, [
            A(pe, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: r[1] || (r[1] = (c) => a("step", -1))
            }, {
              default: j(() => [
                A(ge, {
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
                A(ge, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : w("", !0)
        ]),
        m("span", k8, [
          e.embedded ? (u(), W(pe, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: r[3] || (r[3] = (c) => I(Ne)(s.value))
          }, {
            default: j(() => [
              A(ge, {
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
            href: I(Lf)(s.value)
          }, [
            A(ge, {
              name: "share",
              size: 13
            })
          ], 8, w8)) : w("", !0),
          e.embedded ? w("", !0) : (u(), W(pe, {
            key: 2,
            variant: "icon",
            title: l.value,
            "aria-label": l.value,
            "data-resource-close": "",
            onClick: r[4] || (r[4] = (c) => a("close"))
          }, {
            default: j(() => [
              A(ge, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(v8, {
        label: e.label,
        title: e.title,
        abstract: e.description
      }, null, 8, ["label", "title", "abstract"])
    ]));
  }
}, x8 = /* @__PURE__ */ z($8, [["__scopeId", "data-v-51401f06"]]), S8 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, _8 = { class: "field-name" }, M8 = {
  key: 1,
  class: "field-value"
}, C8 = ["onClick"], E8 = {
  key: 2,
  class: "field-value"
}, A8 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", S8, [
      (u(!0), f(N, null, ne(e.fields, (o) => (u(), f(N, {
        key: o.name
      }, [
        m("p", _8, y(o.label), 1),
        o.isTime ? (u(), W(Ze, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (u(), f("p", M8, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, y(o.value), 9, C8)
        ])) : (u(), f("p", E8, y(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, O8 = /* @__PURE__ */ z(A8, [["__scopeId", "data-v-7e45afb5"]]);
async function T8(e, t) {
  const n = await e(["agent", "show", String(t.agent_id)]);
  return n.ok ? xw(t, n.value) : "";
}
async function I8(e, t) {
  const n = await e(["actor", "show", String(t)]), a = n.ok && n.value.type === "agent" ? await e(["agent", "show", String(t)]) : { ok: !1 };
  return n.ok ? $w(n.value, a.ok ? a.value : null) : "";
}
const R8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, B8 = {
  key: 1,
  class: "inspector-wait"
}, L8 = { class: "inspector-main" }, N8 = { class: "inspector-column" }, q8 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, D8 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, P8 = { class: "inspector-text" }, j8 = ["innerHTML"], F8 = {
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
    }), l = x(null), i = x(""), r = x(""), c = x(""), d = x("details"), h = x(null), p = x(0);
    let g = 0;
    const b = M(() => ({ row_id: n.id, id: n.id })), S = M(() => l.value ? Vn(o.value.title, l.value, b.value) || kw(n.noun, l.value, n.id) : ""), O = M(() => l.value ? s8(o.value, n.noun, l.value, n.id) : ""), C = M(() => O.value === S.value ? "" : O.value), D = M(() => l.value ? Vn(o.value.description, l.value, b.value) : ""), U = M(() => {
      var B, q, J;
      return ((B = l.value) == null ? void 0 : B.body) || ((q = l.value) == null ? void 0 : q.brief) || (s.has(n.noun) ? (J = l.value) == null ? void 0 : J.text : "") || "";
    }), F = M(() => U.value ? Fs(U.value, { env: "", rowNames: !1 }) : ""), R = M(() => Sw(l.value, U.value, i.value, r.value)), V = M(() => o.value.comments && p.value >= n8.wide), P = M(() => o.value.comments && !V.value), L = (B) => o.value.components.filter((q) => (q.tab || "") === B).map((q) => q.window), $ = M(() => [...new Set(o.value.components.map((B) => B.tab).filter(Boolean))]), _ = M(() => $.value.length || P.value ? [{ key: "details", label: "Details" }, ...$.value.map((B) => ({ key: B, label: B })), ...P.value ? [{ key: "comments", label: "Comments" }] : []] : []), k = ji(() => o.value.comments && l.value ? { noun: n.noun, id: n.id, title: l.value.title } : {}, (B) => n.read(B));
    async function v(B, q) {
      const J = await q;
      return B === g ? J : "";
    }
    async function T() {
      const B = ++g, q = await n.read(Vn(o.value.reads, null, b.value).split(/\s+/).filter(Boolean));
      B === g && (c.value = q.ok ? "" : q.error, q.ok && (l.value = q.value, l.value.creator_id && (i.value = await v(B, I8(n.read, l.value.creator_id))), l.value.agent_id && (r.value = await v(B, T8(n.read, l.value)))));
    }
    ve(() => `${n.noun}:${n.id}`, () => {
      l.value = null, i.value = "", r.value = "", c.value = "", d.value = "details", T();
    }, { immediate: !0 }), kn(o.value.events, T), ve(k.open, (B) => B && P.value && (d.value = "comments"));
    let E = null;
    return _e(() => {
      var B;
      p.value = ((B = h.value) == null ? void 0 : B.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (E = new ResizeObserver(() => p.value = h.value.clientWidth), E.observe(h.value));
    }), Re(() => E == null ? void 0 : E.disconnect()), (B, q) => (u(), f("aside", {
      ref_key: "root",
      ref: h,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(x8, {
        label: C.value,
        title: S.value,
        description: D.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: o.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.noun}s`, id: e.id },
        onClose: q[0] || (q[0] = (J) => a("close")),
        onBack: q[1] || (q[1] = (J) => a("back")),
        onStep: q[2] || (q[2] = (J) => a("step", J))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      c.value ? (u(), f("p", R8, y(c.value), 1)) : l.value ? (u(), f(N, { key: 2 }, [
        A(Vi, null, {
          default: j(() => [
            A(Ds, {
              name: `row.${e.noun}`,
              row: { ...l.value, id: e.id, noun: e.noun },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: T
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }),
        m("div", L8, [
          m("div", N8, [
            _.value.length ? (u(), f("div", q8, [
              A(Pt, {
                options: _.value,
                value: d.value,
                onPick: q[3] || (q[3] = (J) => d.value = J)
              }, null, 8, ["options", "value"])
            ])) : w("", !0),
            m("div", D8, [
              A(Ut, { value: d.value }, {
                details: j(() => [
                  m("div", P8, [
                    F.value ? (u(), f("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: F.value
                    }, null, 8, j8)) : w("", !0),
                    o.value.lists_fields ? (u(), W(O8, {
                      key: 1,
                      fields: R.value,
                      onPeek: q[4] || (q[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : w("", !0)
                  ]),
                  A(hs, {
                    "slot-name": `inspector.${e.noun}`,
                    names: L(""),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: j(() => [
                  A(Sl, {
                    below: "",
                    comments: I(k).comments.value,
                    words: I(k).words,
                    more: !!I(k).nextPage.value,
                    loading: I(k).loading.value,
                    failure: I(k).failure.value,
                    onMore: I(k).loadMore,
                    onClose: q[5] || (q[5] = (J) => d.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: j(() => [
                  A(hs, {
                    names: L(d.value),
                    row: { ...l.value, id: e.id, noun: e.noun }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              o.value.links ? (u(), W(Gx, {
                key: 0,
                model: e.noun,
                id: e.id,
                read: e.read,
                kinds: o.value.links.kinds,
                open: o.value.links.open,
                "outside-plan": o.value.links.outside_plan,
                "page-size": o.value.links.page_size,
                onOpen: q[6] || (q[6] = (J) => a("open", J))
              }, null, 8, ["model", "id", "read", "kinds", "open", "outside-plan", "page-size"])) : w("", !0)
            ]),
            o.value.comments ? (u(), W(t8, {
              key: 1,
              send: I(k).send,
              count: I(k).total.value,
              onShow: q[7] || (q[7] = (J) => P.value && (d.value = "comments"))
            }, null, 8, ["send", "count"])) : w("", !0)
          ]),
          V.value ? (u(), W(Sl, {
            key: 0,
            comments: I(k).comments.value,
            words: I(k).words,
            more: !!I(k).nextPage.value,
            loading: I(k).loading.value,
            failure: I(k).failure.value,
            onMore: I(k).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : w("", !0)
        ])
      ], 64)) : (u(), f("div", B8, [
        A(Ke)
      ]))
    ], 512));
  }
}, W8 = /* @__PURE__ */ z(F8, [["__scopeId", "data-v-adc870da"]]), jM = {
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
    return (n, a) => (u(), W(W8, qe(n.$props, {
      catalogue: I(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, H8 = { class: "facts" }, z8 = { class: "fact wide" }, U8 = ["title"], G8 = {
  key: 1,
  class: "fact-value"
}, V8 = {
  key: 0,
  class: "fact"
}, K8 = { class: "fact-value" }, Y8 = { class: "fact" }, Q8 = { class: "fact-label" }, X8 = ["title"], J8 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Z8 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, e3 = {
  key: 2,
  class: "fact"
}, t3 = { class: "fact-value" }, n3 = { class: "fact wide" }, a3 = { class: "fact-label" }, s3 = { class: "fact wide" }, o3 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, l3 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ta.map(({ key: i, label: r }) => ({ key: String(i), label: r })), a = [1, 2, 3, 4, 5].map((i) => ({ key: String(i), label: String(i) })), s = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], o = t, l = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (i, r) => {
      var c, d;
      return u(), f("div", H8, [
        m("div", z8, [
          r[4] || (r[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (c = e.place) != null && c.plan_id ? (u(), f("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (h) => I(Ne)(`plans:${e.place.plan_id}`))
          }, "Plan " + y(e.place.plan_id) + ": " + y(e.place.plan_title), 9, U8)) : (u(), f("span", G8, "Not in a plan"))
        ]),
        ((d = e.place) == null ? void 0 : d.phase_total) > 1 ? (u(), f("div", V8, [
          r[5] || (r[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", K8, y(e.place.phase_number) + " of " + y(e.place.phase_total) + ": " + y(e.place.phase_title), 1)
        ])) : w("", !0),
        e.task.helper_id ? (u(), f(N, { key: 1 }, [
          m("div", Y8, [
            m("span", Q8, y(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            m("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (h) => I(Ne)(`agents:${e.task.helper_id}`))
            }, y(e.task.helper_name), 9, X8)
          ]),
          I(l).has(e.task.state) ? (u(), f("p", J8, y(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (u(), f("p", Z8, y(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : w("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (u(), f("div", e3, [
          r[6] || (r[6] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", t3, "Agent " + y(e.task.holder_id), 1)
        ])) : w("", !0),
        m("div", n3, [
          m("span", a3, [
            r[7] || (r[7] = te(" Complexity ", -1)),
            A(ei, {
              lines: s.map((h, p) => `${p + 1}: ${h}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Pt, {
            options: I(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (h) => o("complexity", h))
          }, null, 8, ["options", "value"])
        ]),
        m("div", s3, [
          r[8] || (r[8] = m("span", { class: "fact-label" }, "Priority", -1)),
          A(Pt, {
            options: I(n),
            value: String(I(Gi)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (h) => o("priority", h))
          }, null, 8, ["options", "value"]),
          e.refusal ? (u(), f("p", o3, y(e.refusal), 1)) : w("", !0)
        ])
      ]);
    };
  }
}, i3 = /* @__PURE__ */ z(l3, [["__scopeId", "data-v-ae15e31b"]]);
function r3(e, t) {
  const n = new Map(t.tasks.map((r) => [r.id, r])), a = (r) => t.edges.filter(([, c]) => c === r).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let r = a(e); r.length; r = [...new Set(r.flatMap(a))].filter((c) => !s.has(c)))
    r.forEach((c) => s.add(c)), o.push(r.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let r = t.edges.find(([c]) => c === e); r && !i.has(r[1]); r = t.edges.find(([c]) => c === r[1]))
    i.add(r[1]), l.push(n.get(r[1]));
  return { above: o.reverse(), below: l };
}
const u3 = { class: "number" }, c3 = { class: "title" }, d3 = { class: "word" }, f3 = {
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
    return (a, s) => (u(), W(yt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        A(bn, { status: e.status }, null, 8, ["status"]),
        m("span", u3, y(e.number), 1),
        m("span", c3, y(e.title), 1),
        m("span", d3, y(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, es = /* @__PURE__ */ z(f3, [["__scopeId", "data-v-f6417ae8"]]), h3 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, m3 = { class: "level" }, p3 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(!1);
    ve(() => n.task.id, () => s.value = !1);
    const o = M(() => r3(n.task.id, n.graph)), l = M(() => s.value ? o.value.above : o.value.above.slice(-1)), i = M(() => s.value ? o.value.below : o.value.below.slice(0, 1)), r = M(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), d = (h, p = !1) => ({ status: un(h.state), number: h.id, title: h.title, word: p ? "This task" : c(h.state), current: p });
    return (h, p) => o.value.above.length || o.value.below.length ? (u(), f("section", h3, [
      p[5] || (p[5] = m("h4", null, "What waits on what", -1)),
      (u(!0), f(N, null, ne(l.value, (g) => (u(), f(N, {
        key: g.map((b) => b.id).join()
      }, [
        m("div", m3, [
          (u(!0), f(N, null, ne(g, (b) => (u(), W(es, qe({
            key: b.id,
            ref_for: !0
          }, d(b), {
            onSelect: p[0] || (p[0] = (S) => a("select", S))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(es, tu(nu(d(e.task, !0))), null, 16),
      (u(!0), f(N, null, ne(i.value, (g) => (u(), f(N, {
        key: g.id
      }, [
        p[4] || (p[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        A(es, qe({ ref_for: !0 }, d(g), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      r.value ? (u(), f("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (g) => s.value = !s.value)
      }, y(s.value ? "Show less" : `Show the whole chain (${r.value} more)`), 1)) : w("", !0)
    ])) : w("", !0);
  }
}, v3 = /* @__PURE__ */ z(p3, [["__scopeId", "data-v-79c52417"]]), g3 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, y3 = ["datetime"], b3 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (u(), f("section", g3, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (u(!0), f(N, null, ne(e.renewals, (a) => (u(), f("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, y(new Date(a.created_at).toLocaleString()), 9, y3),
        m("p", null, y(a.reason), 1)
      ]))), 128))
    ])) : w("", !0);
  }
}, k3 = /* @__PURE__ */ z(b3, [["__scopeId", "data-v-b41f213b"]]), w3 = {
  class: "part",
  "data-resource-waits": ""
}, $3 = ["onClick"], x3 = { class: "wait-id" }, S3 = { class: "wait-title" }, _3 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (u(), f("section", w3, [
      m("h4", null, y(e.title), 1),
      (u(!0), f(N, null, ne(e.waits, (o) => (u(), f("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(bn, {
          status: I(un)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", x3, y(o.id), 1),
        m("span", S3, y(o.title), 1)
      ], 8, $3))), 128))
    ]));
  }
}, _l = /* @__PURE__ */ z(_3, [["__scopeId", "data-v-8fb2e251"]]), M3 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, C3 = { class: "text" }, E3 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, A3 = 180, O3 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = x(!1), l = M(() => a.task.waits.filter((r) => !n.has(r.state))), i = M(() => a.task.waits.filter((r) => n.has(r.state)));
    return (r, c) => (u(), f(N, null, [
      l.value.length ? (u(), W(_l, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : w("", !0),
      e.task.state === "completed" && e.task.outcome ? (u(), f("section", M3, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", C3, y(e.task.outcome), 1)
      ])) : w("", !0),
      e.task.brief ? (u(), f("section", E3, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, y(e.task.brief), 3),
        e.task.brief.length > A3 && !o.value ? (u(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : w("", !0)
      ])) : w("", !0),
      i.value.length ? (u(), W(_l, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : w("", !0)
    ], 64));
  }
}, T3 = /* @__PURE__ */ z(O3, [["__scopeId", "data-v-4a3f1e79"]]), I3 = {
  class: "task-details",
  "data-task-details": ""
}, R3 = { class: "since" }, B3 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, L3 = { class: "text" }, N3 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, q3 = {
  key: 1,
  class: "note"
}, D3 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, P3 = { class: "text" }, j3 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return u(), f("div", I3, [
        m("div", {
          class: Y(["state-line", I(un)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(bn, {
              status: I(un)(e.task.state)
            }, null, 8, ["status"]),
            te(" " + y(a(e.task.state)), 1)
          ]),
          m("span", R3, [
            o[5] || (o[5] = te(" since ", -1)),
            A(Ze, {
              at: I(hh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (u(), f("section", B3, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", L3, y(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (u(), f("p", N3, "Opens by itself when " + y(e.task.openers.join(" or ")) + ".", 1)) : (u(), f("p", q3, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (u(), f("section", D3, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", P3, y(e.task.reason), 1)
        ])) : w("", !0),
        e.graph ? (u(), W(v3, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : w("", !0),
        A(i3, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(T3, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(k3, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, FM = /* @__PURE__ */ z(j3, [["__scopeId", "data-v-7e73fa21"]]), F3 = 50, W3 = { messages: 25 }, H3 = (e) => W3[e] || F3, z3 = {
  class: "task-log",
  "aria-label": "Task log"
}, U3 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, G3 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, V3 = { class: "entries" }, K3 = ["data-task-log-important"], Y3 = ["datetime"], Q3 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, X3 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = x([]), a = x(1), s = x(!0), o = x(!0), l = x("");
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
        String(H3("task_logs")),
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
    ), Ve(() => {
      i += 1;
    }), (c, d) => (u(), f("section", z3, [
      o.value ? (u(), W(Ke, { key: 0 })) : l.value ? (u(), f(N, { key: 1 }, [
        m("p", U3, y(l.value), 1),
        A(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => r(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            te("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (u(), f(N, { key: 2 }, [
        n.value.length ? w("", !0) : (u(), f("p", G3, "No log entries yet.")),
        m("ol", V3, [
          (u(!0), f(N, null, ne(n.value, (h) => (u(), f("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, y(new Date(h.created_at).toLocaleString()), 9, Y3),
            m("p", null, y(h.line), 1)
          ], 10, K3))), 128))
        ]),
        a.value > 1 || !s.value ? (u(), f("nav", Q3, [
          A(pe, {
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
          m("span", null, "Page " + y(a.value), 1),
          A(pe, {
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
}, WM = /* @__PURE__ */ z(X3, [["__scopeId", "data-v-cfa43bf1"]]);
function J3(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ts = { exports: {} }, Ml;
function Z3() {
  return Ml || (Ml = 1, (function(e, t) {
    var n = (function() {
      var a = function(R, V) {
        var P = 236, L = 17, $ = R, _ = o[V], k = null, v = 0, T = null, E = [], B = {}, q = function(K, Q) {
          v = $ * 4 + 17, k = (function(G) {
            for (var X = new Array(G), Z = 0; Z < G; Z += 1) {
              X[Z] = new Array(G);
              for (var oe = 0; oe < G; oe += 1)
                X[Z][oe] = null;
            }
            return X;
          })(v), J(0, 0), J(v - 7, 0), J(0, v - 7), ae(), se(), fe(K, Q), $ >= 7 && ye(K), T == null && (T = ie($, _, E)), ee(T, Q);
        }, J = function(K, Q) {
          for (var G = -1; G <= 7; G += 1)
            if (!(K + G <= -1 || v <= K + G))
              for (var X = -1; X <= 7; X += 1)
                Q + X <= -1 || v <= Q + X || (0 <= G && G <= 6 && (X == 0 || X == 6) || 0 <= X && X <= 6 && (G == 0 || G == 6) || 2 <= G && G <= 4 && 2 <= X && X <= 4 ? k[K + G][Q + X] = !0 : k[K + G][Q + X] = !1);
        }, H = function() {
          for (var K = 0, Q = 0, G = 0; G < 8; G += 1) {
            q(!0, G);
            var X = i.getLostPoint(B);
            (G == 0 || K > X) && (K = X, Q = G);
          }
          return Q;
        }, se = function() {
          for (var K = 8; K < v - 8; K += 1)
            k[K][6] == null && (k[K][6] = K % 2 == 0);
          for (var Q = 8; Q < v - 8; Q += 1)
            k[6][Q] == null && (k[6][Q] = Q % 2 == 0);
        }, ae = function() {
          for (var K = i.getPatternPosition($), Q = 0; Q < K.length; Q += 1)
            for (var G = 0; G < K.length; G += 1) {
              var X = K[Q], Z = K[G];
              if (k[X][Z] == null)
                for (var oe = -2; oe <= 2; oe += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    oe == -2 || oe == 2 || ce == -2 || ce == 2 || oe == 0 && ce == 0 ? k[X + oe][Z + ce] = !0 : k[X + oe][Z + ce] = !1;
            }
        }, ye = function(K) {
          for (var Q = i.getBCHTypeNumber($), G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            k[Math.floor(G / 3)][G % 3 + v - 8 - 3] = X;
          }
          for (var G = 0; G < 18; G += 1) {
            var X = !K && (Q >> G & 1) == 1;
            k[G % 3 + v - 8 - 3][Math.floor(G / 3)] = X;
          }
        }, fe = function(K, Q) {
          for (var G = _ << 3 | Q, X = i.getBCHTypeInfo(G), Z = 0; Z < 15; Z += 1) {
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
            var je = i.getErrorCorrectPolynomial(Ae), Fe = c(oe[ue], je.getLength() - 1), lo = Fe.mod(je);
            ce[ue] = new Array(je.getLength() - 1);
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
          for (; !(Z.getLengthInBits() >= ue * 8 || (Z.put(P, 8), Z.getLengthInBits() >= ue * 8)); )
            Z.put(L, 8);
          return le(Z, X);
        };
        B.addData = function(K, Q) {
          Q = Q || "Byte";
          var G = null;
          switch (Q) {
            case "Numeric":
              G = p(K);
              break;
            case "Alphanumeric":
              G = g(K);
              break;
            case "Byte":
              G = b(K);
              break;
            case "Kanji":
              G = S(K);
              break;
            default:
              throw "mode:" + Q;
          }
          E.push(G), T = null;
        }, B.isDark = function(K, Q) {
          if (K < 0 || v <= K || Q < 0 || v <= Q)
            throw K + "," + Q;
          return k[K][Q];
        }, B.getModuleCount = function() {
          return v;
        }, B.make = function() {
          if ($ < 1) {
            for (var K = 1; K < 40; K++) {
              for (var Q = d.getRSBlocks(K, _), G = h(), X = 0; X < E.length; X++) {
                var Z = E[X];
                G.put(Z.getMode(), 4), G.put(Z.getLength(), i.getLengthInBits(Z.getMode(), K)), Z.write(G);
              }
              for (var oe = 0, X = 0; X < Q.length; X++)
                oe += Q[X].dataCount;
              if (G.getLengthInBits() <= oe * 8)
                break;
            }
            $ = K;
          }
          q(!1, H());
        }, B.createTableTag = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var G = "";
          G += '<table style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: " + Q + "px;", G += '">', G += "<tbody>";
          for (var X = 0; X < B.getModuleCount(); X += 1) {
            G += "<tr>";
            for (var Z = 0; Z < B.getModuleCount(); Z += 1)
              G += '<td style="', G += " border-width: 0px; border-style: none;", G += " border-collapse: collapse;", G += " padding: 0px; margin: 0px;", G += " width: " + K + "px;", G += " height: " + K + "px;", G += " background-color: ", G += B.isDark(X, Z) ? "#000000" : "#ffffff", G += ";", G += '"/>';
            G += "</tr>";
          }
          return G += "</tbody>", G += "</table>", G;
        }, B.createSvgTag = function(K, Q, G, X) {
          var Z = {};
          typeof arguments[0] == "object" && (Z = arguments[0], K = Z.cellSize, Q = Z.margin, G = Z.alt, X = Z.title), K = K || 2, Q = typeof Q > "u" ? K * 4 : Q, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-description" : null, X = typeof X == "string" ? { text: X } : X || {}, X.text = X.text || null, X.id = X.text ? X.id || "qrcode-title" : null;
          var oe = B.getModuleCount() * K + Q * 2, ce, ue, Se, Ae, he = "", je;
          for (je = "l" + K + ",0 0," + K + " -" + K + ",0 0,-" + K + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += Z.scalable ? "" : ' width="' + oe + 'px" height="' + oe + 'px"', he += ' viewBox="0 0 ' + oe + " " + oe + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += X.text || G.text ? ' role="img" aria-labelledby="' + et([X.id, G.id].join(" ").trim()) + '"' : "", he += ">", he += X.text ? '<title id="' + et(X.id) + '">' + et(X.text) + "</title>" : "", he += G.text ? '<description id="' + et(G.id) + '">' + et(G.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', Se = 0; Se < B.getModuleCount(); Se += 1)
            for (Ae = Se * K + Q, ce = 0; ce < B.getModuleCount(); ce += 1)
              B.isDark(Se, ce) && (ue = ce * K + Q, he += "M" + ue + "," + Ae + je);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, B.createDataURL = function(K, Q) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var G = B.getModuleCount() * K + Q * 2, X = Q, Z = G - Q;
          return F(G, G, function(oe, ce) {
            if (X <= oe && oe < Z && X <= ce && ce < Z) {
              var ue = Math.floor((oe - X) / K), Se = Math.floor((ce - X) / K);
              return B.isDark(Se, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, B.createImgTag = function(K, Q, G) {
          K = K || 2, Q = typeof Q > "u" ? K * 4 : Q;
          var X = B.getModuleCount() * K + Q * 2, Z = "";
          return Z += "<img", Z += ' src="', Z += B.createDataURL(K, Q), Z += '"', Z += ' width="', Z += X, Z += '"', Z += ' height="', Z += X, Z += '"', G && (Z += ' alt="', Z += et(G), Z += '"'), Z += "/>", Z;
        };
        var et = function(K) {
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
        }, Wr = function(K) {
          var Q = 1;
          K = typeof K > "u" ? Q * 2 : K;
          var G = B.getModuleCount() * Q + K * 2, X = K, Z = G - K, oe, ce, ue, Se, Ae, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, je = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Fe = "";
          for (oe = 0; oe < G; oe += 2) {
            for (ue = Math.floor((oe - X) / Q), Se = Math.floor((oe + 1 - X) / Q), ce = 0; ce < G; ce += 1)
              Ae = "█", X <= ce && ce < Z && X <= oe && oe < Z && B.isDark(ue, Math.floor((ce - X) / Q)) && (Ae = " "), X <= ce && ce < Z && X <= oe + 1 && oe + 1 < Z && B.isDark(Se, Math.floor((ce - X) / Q)) ? Ae += " " : Ae += "█", Fe += K < 1 && oe + 1 >= Z ? je[Ae] : he[Ae];
            Fe += `
`;
          }
          return G % 2 && K > 0 ? Fe.substring(0, Fe.length - G - 1) + Array(G + 1).join("▀") : Fe.substring(0, Fe.length - 1);
        };
        return B.createASCII = function(K, Q) {
          if (K = K || 1, K < 2)
            return Wr(Q);
          K -= 1, Q = typeof Q > "u" ? K * 2 : Q;
          var G = B.getModuleCount() * K + Q * 2, X = Q, Z = G - Q, oe, ce, ue, Se, Ae = Array(K + 1).join("██"), he = Array(K + 1).join("  "), je = "", Fe = "";
          for (oe = 0; oe < G; oe += 1) {
            for (ue = Math.floor((oe - X) / K), Fe = "", ce = 0; ce < G; ce += 1)
              Se = 1, X <= ce && ce < Z && X <= oe && oe < Z && B.isDark(ue, Math.floor((ce - X) / K)) && (Se = 0), Fe += Se ? Ae : he;
            for (ue = 0; ue < K; ue += 1)
              je += Fe + `
`;
          }
          return je.substring(0, je.length - 1);
        }, B.renderTo2dContext = function(K, Q) {
          Q = Q || 2;
          for (var G = B.getModuleCount(), X = 0; X < G; X++)
            for (var Z = 0; Z < G; Z++)
              K.fillStyle = B.isDark(X, Z) ? "black" : "white", K.fillRect(X * Q, Z * Q, Q, Q);
        }, B;
      };
      a.stringToBytesFuncs = {
        default: function(R) {
          for (var V = [], P = 0; P < R.length; P += 1) {
            var L = R.charCodeAt(P);
            V.push(L & 255);
          }
          return V;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(R, V) {
        var P = (function() {
          for (var $ = D(R), _ = function() {
            var se = $.read();
            if (se == -1) throw "eof";
            return se;
          }, k = 0, v = {}; ; ) {
            var T = $.read();
            if (T == -1) break;
            var E = _(), B = _(), q = _(), J = String.fromCharCode(T << 8 | E), H = B << 8 | q;
            v[J] = H, k += 1;
          }
          if (k != V)
            throw k + " != " + V;
          return v;
        })(), L = 63;
        return function($) {
          for (var _ = [], k = 0; k < $.length; k += 1) {
            var v = $.charCodeAt(k);
            if (v < 128)
              _.push(v);
            else {
              var T = P[$.charAt(k)];
              typeof T == "number" ? (T & 255) == T ? _.push(T) : (_.push(T >>> 8), _.push(T & 255)) : _.push(L);
            }
          }
          return _;
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
        var R = [
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
        ], V = 1335, P = 7973, L = 21522, $ = {}, _ = function(k) {
          for (var v = 0; k != 0; )
            v += 1, k >>>= 1;
          return v;
        };
        return $.getBCHTypeInfo = function(k) {
          for (var v = k << 10; _(v) - _(V) >= 0; )
            v ^= V << _(v) - _(V);
          return (k << 10 | v) ^ L;
        }, $.getBCHTypeNumber = function(k) {
          for (var v = k << 12; _(v) - _(P) >= 0; )
            v ^= P << _(v) - _(P);
          return k << 12 | v;
        }, $.getPatternPosition = function(k) {
          return R[k - 1];
        }, $.getMaskFunction = function(k) {
          switch (k) {
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
              throw "bad maskPattern:" + k;
          }
        }, $.getErrorCorrectPolynomial = function(k) {
          for (var v = c([1], 0), T = 0; T < k; T += 1)
            v = v.multiply(c([1, r.gexp(T)], 0));
          return v;
        }, $.getLengthInBits = function(k, v) {
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
        }, $.getLostPoint = function(k) {
          for (var v = k.getModuleCount(), T = 0, E = 0; E < v; E += 1)
            for (var B = 0; B < v; B += 1) {
              for (var q = 0, J = k.isDark(E, B), H = -1; H <= 1; H += 1)
                if (!(E + H < 0 || v <= E + H))
                  for (var se = -1; se <= 1; se += 1)
                    B + se < 0 || v <= B + se || H == 0 && se == 0 || J == k.isDark(E + H, B + se) && (q += 1);
              q > 5 && (T += 3 + q - 5);
            }
          for (var E = 0; E < v - 1; E += 1)
            for (var B = 0; B < v - 1; B += 1) {
              var ae = 0;
              k.isDark(E, B) && (ae += 1), k.isDark(E + 1, B) && (ae += 1), k.isDark(E, B + 1) && (ae += 1), k.isDark(E + 1, B + 1) && (ae += 1), (ae == 0 || ae == 4) && (T += 3);
            }
          for (var E = 0; E < v; E += 1)
            for (var B = 0; B < v - 6; B += 1)
              k.isDark(E, B) && !k.isDark(E, B + 1) && k.isDark(E, B + 2) && k.isDark(E, B + 3) && k.isDark(E, B + 4) && !k.isDark(E, B + 5) && k.isDark(E, B + 6) && (T += 40);
          for (var B = 0; B < v; B += 1)
            for (var E = 0; E < v - 6; E += 1)
              k.isDark(E, B) && !k.isDark(E + 1, B) && k.isDark(E + 2, B) && k.isDark(E + 3, B) && k.isDark(E + 4, B) && !k.isDark(E + 5, B) && k.isDark(E + 6, B) && (T += 40);
          for (var ye = 0, B = 0; B < v; B += 1)
            for (var E = 0; E < v; E += 1)
              k.isDark(E, B) && (ye += 1);
          var fe = Math.abs(100 * ye / v / v - 50) / 5;
          return T += fe * 10, T;
        }, $;
      })(), r = (function() {
        for (var R = new Array(256), V = new Array(256), P = 0; P < 8; P += 1)
          R[P] = 1 << P;
        for (var P = 8; P < 256; P += 1)
          R[P] = R[P - 4] ^ R[P - 5] ^ R[P - 6] ^ R[P - 8];
        for (var P = 0; P < 255; P += 1)
          V[R[P]] = P;
        var L = {};
        return L.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return V[$];
        }, L.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return R[$];
        }, L;
      })();
      function c(R, V) {
        if (typeof R.length > "u")
          throw R.length + "/" + V;
        var P = (function() {
          for (var $ = 0; $ < R.length && R[$] == 0; )
            $ += 1;
          for (var _ = new Array(R.length - $ + V), k = 0; k < R.length - $; k += 1)
            _[k] = R[k + $];
          return _;
        })(), L = {};
        return L.getAt = function($) {
          return P[$];
        }, L.getLength = function() {
          return P.length;
        }, L.multiply = function($) {
          for (var _ = new Array(L.getLength() + $.getLength() - 1), k = 0; k < L.getLength(); k += 1)
            for (var v = 0; v < $.getLength(); v += 1)
              _[k + v] ^= r.gexp(r.glog(L.getAt(k)) + r.glog($.getAt(v)));
          return c(_, 0);
        }, L.mod = function($) {
          if (L.getLength() - $.getLength() < 0)
            return L;
          for (var _ = r.glog(L.getAt(0)) - r.glog($.getAt(0)), k = new Array(L.getLength()), v = 0; v < L.getLength(); v += 1)
            k[v] = L.getAt(v);
          for (var v = 0; v < $.getLength(); v += 1)
            k[v] ^= r.gexp(r.glog($.getAt(v)) + _);
          return c(k, 0).mod($);
        }, L;
      }
      var d = (function() {
        var R = [
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
        ], V = function($, _) {
          var k = {};
          return k.totalCount = $, k.dataCount = _, k;
        }, P = {}, L = function($, _) {
          switch (_) {
            case o.L:
              return R[($ - 1) * 4 + 0];
            case o.M:
              return R[($ - 1) * 4 + 1];
            case o.Q:
              return R[($ - 1) * 4 + 2];
            case o.H:
              return R[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return P.getRSBlocks = function($, _) {
          var k = L($, _);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + _;
          for (var v = k.length / 3, T = [], E = 0; E < v; E += 1)
            for (var B = k[E * 3 + 0], q = k[E * 3 + 1], J = k[E * 3 + 2], H = 0; H < B; H += 1)
              T.push(V(q, J));
          return T;
        }, P;
      })(), h = function() {
        var R = [], V = 0, P = {};
        return P.getBuffer = function() {
          return R;
        }, P.getAt = function(L) {
          var $ = Math.floor(L / 8);
          return (R[$] >>> 7 - L % 8 & 1) == 1;
        }, P.put = function(L, $) {
          for (var _ = 0; _ < $; _ += 1)
            P.putBit((L >>> $ - _ - 1 & 1) == 1);
        }, P.getLengthInBits = function() {
          return V;
        }, P.putBit = function(L) {
          var $ = Math.floor(V / 8);
          R.length <= $ && R.push(0), L && (R[$] |= 128 >>> V % 8), V += 1;
        }, P;
      }, p = function(R) {
        var V = s.MODE_NUMBER, P = R, L = {};
        L.getMode = function() {
          return V;
        }, L.getLength = function(k) {
          return P.length;
        }, L.write = function(k) {
          for (var v = P, T = 0; T + 2 < v.length; )
            k.put($(v.substring(T, T + 3)), 10), T += 3;
          T < v.length && (v.length - T == 1 ? k.put($(v.substring(T, T + 1)), 4) : v.length - T == 2 && k.put($(v.substring(T, T + 2)), 7));
        };
        var $ = function(k) {
          for (var v = 0, T = 0; T < k.length; T += 1)
            v = v * 10 + _(k.charAt(T));
          return v;
        }, _ = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return L;
      }, g = function(R) {
        var V = s.MODE_ALPHA_NUM, P = R, L = {};
        L.getMode = function() {
          return V;
        }, L.getLength = function(_) {
          return P.length;
        }, L.write = function(_) {
          for (var k = P, v = 0; v + 1 < k.length; )
            _.put(
              $(k.charAt(v)) * 45 + $(k.charAt(v + 1)),
              11
            ), v += 2;
          v < k.length && _.put($(k.charAt(v)), 6);
        };
        var $ = function(_) {
          if ("0" <= _ && _ <= "9")
            return _.charCodeAt(0) - 48;
          if ("A" <= _ && _ <= "Z")
            return _.charCodeAt(0) - 65 + 10;
          switch (_) {
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
              throw "illegal char :" + _;
          }
        };
        return L;
      }, b = function(R) {
        var V = s.MODE_8BIT_BYTE, P = a.stringToBytes(R), L = {};
        return L.getMode = function() {
          return V;
        }, L.getLength = function($) {
          return P.length;
        }, L.write = function($) {
          for (var _ = 0; _ < P.length; _ += 1)
            $.put(P[_], 8);
        }, L;
      }, S = function(R) {
        var V = s.MODE_KANJI, P = a.stringToBytesFuncs.SJIS;
        if (!P)
          throw "sjis not supported.";
        (function(_, k) {
          var v = P(_);
          if (v.length != 2 || (v[0] << 8 | v[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var L = P(R), $ = {};
        return $.getMode = function() {
          return V;
        }, $.getLength = function(_) {
          return ~~(L.length / 2);
        }, $.write = function(_) {
          for (var k = L, v = 0; v + 1 < k.length; ) {
            var T = (255 & k[v]) << 8 | 255 & k[v + 1];
            if (33088 <= T && T <= 40956)
              T -= 33088;
            else if (57408 <= T && T <= 60351)
              T -= 49472;
            else
              throw "illegal char at " + (v + 1) + "/" + T;
            T = (T >>> 8 & 255) * 192 + (T & 255), _.put(T, 13), v += 2;
          }
          if (v < k.length)
            throw "illegal char at " + (v + 1);
        }, $;
      }, O = function() {
        var R = [], V = {};
        return V.writeByte = function(P) {
          R.push(P & 255);
        }, V.writeShort = function(P) {
          V.writeByte(P), V.writeByte(P >>> 8);
        }, V.writeBytes = function(P, L, $) {
          L = L || 0, $ = $ || P.length;
          for (var _ = 0; _ < $; _ += 1)
            V.writeByte(P[_ + L]);
        }, V.writeString = function(P) {
          for (var L = 0; L < P.length; L += 1)
            V.writeByte(P.charCodeAt(L));
        }, V.toByteArray = function() {
          return R;
        }, V.toString = function() {
          var P = "";
          P += "[";
          for (var L = 0; L < R.length; L += 1)
            L > 0 && (P += ","), P += R[L];
          return P += "]", P;
        }, V;
      }, C = function() {
        var R = 0, V = 0, P = 0, L = "", $ = {}, _ = function(v) {
          L += String.fromCharCode(k(v & 63));
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
        return $.writeByte = function(v) {
          for (R = R << 8 | v & 255, V += 8, P += 1; V >= 6; )
            _(R >>> V - 6), V -= 6;
        }, $.flush = function() {
          if (V > 0 && (_(R << 6 - V), R = 0, V = 0), P % 3 != 0)
            for (var v = 3 - P % 3, T = 0; T < v; T += 1)
              L += "=";
        }, $.toString = function() {
          return L;
        }, $;
      }, D = function(R) {
        var V = R, P = 0, L = 0, $ = 0, _ = {};
        _.read = function() {
          for (; $ < 8; ) {
            if (P >= V.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var v = V.charAt(P);
            if (P += 1, v == "=")
              return $ = 0, -1;
            if (v.match(/^\s$/))
              continue;
            L = L << 6 | k(v.charCodeAt(0)), $ += 6;
          }
          var T = L >>> $ - 8 & 255;
          return $ -= 8, T;
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
        return _;
      }, U = function(R, V) {
        var P = R, L = V, $ = new Array(R * V), _ = {};
        _.setPixel = function(E, B, q) {
          $[B * P + E] = q;
        }, _.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(P), E.writeShort(L), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(P), E.writeShort(L), E.writeByte(0);
          var B = 2, q = v(B);
          E.writeByte(B);
          for (var J = 0; q.length - J > 255; )
            E.writeByte(255), E.writeBytes(q, J, 255), J += 255;
          E.writeByte(q.length - J), E.writeBytes(q, J, q.length - J), E.writeByte(0), E.writeString(";");
        };
        var k = function(E) {
          var B = E, q = 0, J = 0, H = {};
          return H.write = function(se, ae) {
            if (se >>> ae)
              throw "length over";
            for (; q + ae >= 8; )
              B.writeByte(255 & (se << q | J)), ae -= 8 - q, se >>>= 8 - q, J = 0, q = 0;
            J = se << q | J, q = q + ae;
          }, H.flush = function() {
            q > 0 && B.writeByte(J);
          }, H;
        }, v = function(E) {
          for (var B = 1 << E, q = (1 << E) + 1, J = E + 1, H = T(), se = 0; se < B; se += 1)
            H.add(String.fromCharCode(se));
          H.add(String.fromCharCode(B)), H.add(String.fromCharCode(q));
          var ae = O(), ye = k(ae);
          ye.write(B, J);
          var fe = 0, ee = String.fromCharCode($[fe]);
          for (fe += 1; fe < $.length; ) {
            var le = String.fromCharCode($[fe]);
            fe += 1, H.contains(ee + le) ? ee = ee + le : (ye.write(H.indexOf(ee), J), H.size() < 4095 && (H.size() == 1 << J && (J += 1), H.add(ee + le)), ee = le);
          }
          return ye.write(H.indexOf(ee), J), ye.write(q, J), ye.flush(), ae.toByteArray();
        }, T = function() {
          var E = {}, B = 0, q = {};
          return q.add = function(J) {
            if (q.contains(J))
              throw "dup key:" + J;
            E[J] = B, B += 1;
          }, q.size = function() {
            return B;
          }, q.indexOf = function(J) {
            return E[J];
          }, q.contains = function(J) {
            return typeof E[J] < "u";
          }, q;
        };
        return _;
      }, F = function(R, V, P) {
        for (var L = U(R, V), $ = 0; $ < V; $ += 1)
          for (var _ = 0; _ < R; _ += 1)
            L.setPixel(_, $, P(_, $));
        var k = O();
        L.write(k);
        for (var v = C(), T = k.toByteArray(), E = 0; E < T.length; E += 1)
          v.writeByte(T[E]);
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
var eS = Z3();
const tS = /* @__PURE__ */ J3(eS), nS = ["width", "height", "viewBox"], aS = ["width", "height"], sS = ["d"], oS = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = M(() => {
      const a = tS(0, "M");
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
      }, null, 8, aS),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, sS)
    ], 8, nS));
  }
}, HM = /* @__PURE__ */ z(oS, [["__scopeId", "data-v-489f0852"]]), lS = {
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
}, zM = /* @__PURE__ */ z(lS, [["__scopeId", "data-v-47e67f04"]]);
function UM(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const GM = au(() => import("./VoiceFigure-BNO6ih0h.js").then((e) => e.V)), VM = "1.2.0", KM = "3.5";
export {
  Tf as $,
  Oe as A,
  Ie as B,
  ga as C,
  it as D,
  Y_ as E,
  i$ as F,
  P6 as G,
  U_ as H,
  F5 as I,
  m$ as J,
  At as K,
  cS as L,
  eo as M,
  k$ as N,
  h$ as O,
  va as P,
  d_ as Q,
  y6 as R,
  Un as S,
  v_ as T,
  c6 as U,
  Te as V,
  aa as W,
  u6 as X,
  r6 as Y,
  Of as Z,
  z as _,
  e6 as a,
  R_ as a$,
  y$ as a0,
  b6 as a1,
  k6 as a2,
  De as a3,
  T6 as a4,
  O6 as a5,
  Ct as a6,
  w6 as a7,
  H6 as a8,
  HS as a9,
  __ as aA,
  r_ as aB,
  O5 as aC,
  V6 as aD,
  K6 as aE,
  Q_ as aF,
  Sr as aG,
  p_ as aH,
  $n as aI,
  YS as aJ,
  GS as aK,
  P_ as aL,
  xn as aM,
  H_ as aN,
  D6 as aO,
  u_ as aP,
  c_ as aQ,
  i_ as aR,
  fn as aS,
  _t as aT,
  zS as aU,
  k2 as aV,
  o_ as aW,
  v6 as aX,
  $r as aY,
  Wt as aZ,
  Vt as a_,
  B_ as aa,
  F_ as ab,
  JS as ac,
  d6 as ad,
  f6 as ae,
  E6 as af,
  A6 as ag,
  I6 as ah,
  s6 as ai,
  pl as aj,
  $6 as ak,
  W6 as al,
  eM as am,
  t_ as an,
  Z6 as ao,
  J6 as ap,
  R6 as aq,
  M6 as ar,
  _6 as as,
  C6 as at,
  m_ as au,
  F6 as av,
  z6 as aw,
  aM as ax,
  en as ay,
  U6 as az,
  T$ as b,
  nM as b$,
  a$ as b0,
  W_ as b1,
  b_ as b2,
  y_ as b3,
  z2 as b4,
  ur as b5,
  O_ as b6,
  j6 as b7,
  ka as b8,
  dt as b9,
  w_ as bA,
  C_ as bB,
  pt as bC,
  g_ as bD,
  E_ as bE,
  G6 as bF,
  n_ as bG,
  Y6 as bH,
  Be as bI,
  q6 as bJ,
  A_ as bK,
  dM as bL,
  fM as bM,
  FS as bN,
  x2 as bO,
  L6 as bP,
  $_ as bQ,
  t6 as bR,
  Z_ as bS,
  k_ as bT,
  x_ as bU,
  S_ as bV,
  B6 as bW,
  T5 as bX,
  N6 as bY,
  X6 as bZ,
  J_ as b_,
  M_ as ba,
  Wa as bb,
  ki as bc,
  oM as bd,
  rM as be,
  h_ as bf,
  D_ as bg,
  WS as bh,
  e_ as bi,
  lM as bj,
  x6 as bk,
  S6 as bl,
  l6 as bm,
  g6 as bn,
  KS as bo,
  N_ as bp,
  n6 as bq,
  a6 as br,
  i6 as bs,
  s_ as bt,
  p2 as bu,
  z_ as bv,
  f$ as bw,
  o6 as bx,
  QS as by,
  a_ as bz,
  H2 as c,
  PM as c$,
  VS as c0,
  US as c1,
  Q6 as c2,
  uM as c3,
  oo as c4,
  cM as c5,
  Pr as c6,
  q_ as c7,
  m6 as c8,
  h6 as c9,
  rS as cA,
  mt as cB,
  Dd as cC,
  jM as cD,
  ge as cE,
  ei as cF,
  EM as cG,
  bS as cH,
  VM as cI,
  KM as cJ,
  OS as cK,
  OM as cL,
  ps as cM,
  NS as cN,
  aw as cO,
  jt as cP,
  wl as cQ,
  Is as cR,
  MS as cS,
  TS as cT,
  kc as cU,
  Dk as cV,
  qM as cW,
  kS as cX,
  wS as cY,
  $S as cZ,
  ES as c_,
  b2 as ca,
  XS as cb,
  c$ as cc,
  l_ as cd,
  Xs as ce,
  _5 as cf,
  f_ as cg,
  tn as ch,
  qt as ci,
  xS as cj,
  _S as ck,
  CM as cl,
  pe as cm,
  hf as cn,
  Ds as co,
  fa as cp,
  ig as cq,
  ha as cr,
  DM as cs,
  jS as ct,
  SS as cu,
  cg as cv,
  Ii as cw,
  on as cx,
  Ks as cy,
  hM as cz,
  Ge as d,
  pM as d$,
  HM as d0,
  Li as d1,
  Yc as d2,
  _M as d3,
  Ey as d4,
  pS as d5,
  DS as d6,
  _4 as d7,
  Pt as d8,
  IS as d9,
  fd as dA,
  LM as dB,
  BM as dC,
  Rs as dD,
  dd as dE,
  Os as dF,
  Sm as dG,
  NM as dH,
  PS as dI,
  kk as dJ,
  qS as dK,
  LS as dL,
  vM as dM,
  sm as dN,
  mM as dO,
  hS as dP,
  IM as dQ,
  Xk as dR,
  V$ as dS,
  gS as dT,
  AS as dU,
  bM as dV,
  wM as dW,
  Ne as dX,
  Ep as dY,
  CS as dZ,
  $c as d_,
  Ke as da,
  bt as db,
  gv as dc,
  ad as dd,
  Om as de,
  BS as df,
  vS as dg,
  Ut as dh,
  AM as di,
  v3 as dj,
  FM as dk,
  WM as dl,
  bn as dm,
  jd as dn,
  at as dp,
  RS as dq,
  Ze as dr,
  GM as ds,
  zM as dt,
  Us as du,
  kM as dv,
  Cs as dw,
  Mp as dx,
  Lo as dy,
  zs as dz,
  p6 as e,
  Yi as e0,
  yM as e1,
  Au as e2,
  mS as e3,
  fS as e4,
  ln as e5,
  Kl as e6,
  hd as e7,
  yS as e8,
  ht as e9,
  UM as ea,
  K$ as eb,
  uS as ec,
  dS as ed,
  gM as ee,
  MM as ef,
  Ei as eg,
  TM as eh,
  Qi as ei,
  zl as ej,
  B4 as ek,
  Es as el,
  $M as em,
  ns as en,
  xM as eo,
  SM as ep,
  ze as eq,
  RM as er,
  Yn as es,
  m2 as f,
  sM as g,
  hn as h,
  G_ as i,
  iM as j,
  V_ as k,
  L_ as l,
  N$ as m,
  to as n,
  j_ as o,
  ZS as p,
  K_ as q,
  qr as r,
  Dr as s,
  Ce as t,
  G2 as u,
  T_ as v,
  tM as w,
  I_ as x,
  _n as y,
  X_ as z
};
